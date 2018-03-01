//@ sourceURL=scheduleItemSelector.control.js

(function($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.common.schedule").use(["snapNotification", "snap.EventAggregator", "snap.common.timeUtils", "snap.common.endlessMVVMScroll",
            "snap.common.schedule.ScheduleCommon", "snap.service.availabilityBlockService"
        ])
        .define("itemSelector", function($snapNotification, $eventAggregator, $timeUtils, $endlessMVVMScroll, $scheduleCommon,
            $availabilityBlockService) {

            var itemDefaultValues = {
                id: null,
                name: "Select a Person",
                imageSource: global.getDefaultProfileImageForPatient(),
                info: "For the list",
            };

            this.events = {
                onItemSelected: "onItemSelected",
                onItemClicked: "onItemClicked",
                onSelectorHide: "onSelectorHide",
                onDataLoaded: "onDataLoaded"
            };

            var $scope = this,
                noneReportedMessage = snap.noneReportedMessage;

            this.personType = {
                clinician: "clinician",
                patient: "patient"
            };

            this.containerType = {
                empty: 0,
                provider: 1,
                patient: 2,
                familyGroup: 3
            };

            function Item(item, container) {
                this.id = item.id;
                this.name = item.name;
                this.gender = item.gender || null;
                this.imageSource = item.imageSource ||
                    (item.personType === $scope.personType.clinician ? global.getDefaultProfileImageForClinician(this.gender) : 
                        global.getDefaultProfileImageForPatient(this.gender));
                this.info = item.info;
                this.personType = item.personType;
                this.personId = item.personId;
                this.data = item.data;

                this.isDefault = !this.id;
                this.isSelected = !!item.isSelected;
                this.isDisabled = !!item.isDisabled;
                this._disableReason = item._disableReason;

                this.isTimeOffsetsVisible = !!item.isTimeOffsetsVisible;
                this.timeZoneId = null;
                this.timeZoneName = "unknown";

                this.vm_TimeText = item.vm_TimeText || noneReportedMessage;

                this.vm_nodeId = container ? container.getSelectedItemId() : null;

                this._convertedTimeCashe = item._convertedTimeCashe || null;

                this.select = function(val) {
                    this.set("isSelected", val);
                };

                this.refreshState = function() {
                    if (this.isDisabled) {
                        this._refreshTooltip(this._disableReason);
                    }
                };

                this._refreshTooltip = function(reason) {
                    var that = this;

                    if (this.vm_nodeId) {
                        // set zero timeout in order to await re-rendering
                        setTimeout(function() {
                            var targetEl = $("#" + that.vm_nodeId);
                            if (targetEl.length) {
                                var kendoTooltip = targetEl.data("kendoTooltip");
                                if (kendoTooltip) {
                                    kendoTooltip.destroy();
                                }
                                targetEl.kendoTooltip({
                                    position: "top",
                                    content: reason
                                });
                            }
                        });
                    }
                };

                this.disable = function(reason) {
                    this.set("isDisabled", true);
                    this._disableReason = reason || "Profile is unavailable";
                };

                this.getValue = function() {
                    return item;
                };

                this.updateTime = function(startTime, endTime, sourceTimeZoneId, useCahedValue) {
                    var that = this;
                    var dfd = $.Deferred();
                    if (this.isDefault) {
                        dfd.reject();
                    } else {
                        var duration = endTime - startTime;
                        var convertedTimePromise = (useCahedValue && this._convertedTimeCashe) ? dfd.resolve(this._convertedTimeCashe) : this._convertTime(startTime, sourceTimeZoneId);
                        convertedTimePromise.done(function(convertedTime) {
                            if (convertedTime) {
                                that._convertedTimeCashe = convertedTime;
                                var convertedStartTime = $timeUtils.dateFromSnapDateString(convertedTime.convertedDateTime);
                                var timeZoneName = convertedTime.targetTimeZone.abbreviation;
                                var convertedEndTime = new Date(convertedStartTime);
                                convertedEndTime.setTime(convertedEndTime.getTime() + duration);
                                that.timeZoneId = convertedTime.targetTimeZone.id;
                                that.timeZoneName = convertedTime.targetTimeZone.name;
                                that.set("vm_TimeText", kendo.toString(convertedStartTime, "h:mm tt ") + timeZoneName + " - " +
                                    kendo.toString(convertedEndTime, "h:mm tt ") + timeZoneName);
                                dfd.resolve();
                            } else {
                                that.set("vm_TimeText", noneReportedMessage);
                            }
                        }).fail(function() {
                            that.set("vm_TimeText", noneReportedMessage);
                        });
                    }
                    return dfd.promise();
                };

                this._convertTime = function(time, sourceTimeZoneId) {
                    var dfd = $.Deferred();
                    if (!time) {
                        dfd.reject();
                    } else {
                        var opt = {
                            dateTime: $timeUtils.dateToString(time),
                            sourceTimeZoneId: sourceTimeZoneId
                        };
                        if (this.personType === $scope.personType.clinician) {
                            opt.targetUserId = this.id;
                        } else {
                            opt.targetPatientId = this.id;
                        }
                        $availabilityBlockService.convertTime(opt).then(function(resp) {
                            dfd.resolve(resp);
                        }, function() {
                            dfd.reject();
                        });
                    }
                    return dfd.promise();
                };

                this.onViewProfileClick = function(e) {
                    if (!!this.id) {
                        $eventAggregator.published("itemSelector_onProfileClick", {
                            id: this.id,
                            personType: this.personType
                        });
                    }
                    e.preventDefault();
                    return false;
                };

                this.onSelectClick = function() {
                    if (container) {
                        container.onSelectClick(this);
                    }
                };
            }

            function Container(opt) {
                var $container = this;
                opt.onDataLoad = function() {
                    $container.trigger($scope.events.onDataLoaded);
                    $container._refresh();
                };

                $endlessMVVMScroll.getConstructor().call(this, opt);
                $container = this;

                var defaultItem = $.extend(true, {}, itemDefaultValues, opt.defaultItem);

                this.nameFilter = "";
                this.isItemsSelectorVisible = false;
                this.isSelectorLocked = false;
                this.vm_tabindex = opt.tabindex || 1;
                this.selectedItem = null;
                this.htmlContainerId = opt.htmlContainerId;
                this.counterpartFilter = opt.counterpartFilter;
                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this._reloadOnTypeTimer = null;

                this.vm_listId = opt.htmlContainerId.replace(/^#/, ""); // remove '#' symbol

                this.getSelectedItemId = function() {
                    return this.vm_listId + "_selectedItem";
                };

                this._selectUiElement = function(item, value) {
                    var that = this;
                    var findItem = this.getItemById(item.id);
                    if (findItem) {
                        // update item from allItems collection(if it is visible)
                        findItem.select(value);
                    }
                    item.select(value);
                    if (value) {
                        this.selectedItem = item;
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function() {
                            that._refreshSelectedItem();
                        });
                        this._refresh();
                    }
                };

                this._reloadItems = function(nameFilter) {
                    this.filters({
                        search: nameFilter || ""
                    });
                };

                this.getSelectedItem = function() {
                    return this.selectedItem;
                };

                this._refreshSelectedItem = function(refreshSelectedItems) {
                    this.trigger("change", {
                        field: "vm_getSelectedItemOrDefault"
                    });
                    if (refreshSelectedItems) {
                        this.trigger("change", {
                            field: "vm_getSelectedItems"
                        });
                    }
                };

                this._refresh = function() {
                    this.trigger("change", {
                        field: "vm_getSelectedItems"
                    });
                    this.trigger("change", {
                        field: "vm_getSelectedItemOrDefault"
                    });

                    this.trigger("change", {
                        field: "vm_isItemsListEmpty"
                    });

                    this.trigger("change", {
                        field: "vm_allItems"
                    });
                };


                /* MVVM */
                this.vm_nameFilterChange = function() {
                    if (this._reloadOnTypeTimer) {
                        window.clearTimeout(this._reloadOnTypeTimer);
                        this._reloadOnTypeTimer = null;
                    }
                    // Postpone data reloading until the end of typing
                    this._reloadOnTypeTimer = window.setTimeout(function() {
                        $container._reloadItems($container.nameFilter);
                    }, 300);
                };

                this.vm_getSelectedItems = function() {
                    return this.selectedItem ? [this.selectedItem] : [];
                };

                this.vm_isItemsListEmpty = function() {
                    var that = this;
                    if (this.selectedItem) {
                        return this.getVisibleItems().filter(function(item) {
                            return item.id !== that.selectedItem.id;
                        }).length === 0;
                    } else {
                        return this.getVisibleItems().length === 0;
                    }
                };

                this.vm_getSelectedItemOrDefault = function() {
                    if (this.selectedItem) {
                        this.selectedItem.set("isSelectorLocked", this.isSelectorLocked);
                        this.selectedItem.refreshState();
                        return this.selectedItem;
                    } else {
                        var def = defaultItem;
                        if (opt.defaultItem) {
                            def = opt.defaultItem;
                        }
                        return kendo.observable(new Item(def));
                    }
                };

                this.vm_openItemsSelector = function(e) {
                    if (e) {
                        e.preventDefault();
                    }
                    if (!this.isSelectorLocked) {
                        var that = this;
                        that.set("isItemsSelectorVisible", true);

                        window.setTimeout(function() {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    }
                };

                this.vm_hideItemsSelector = function(e) {
                    e.preventDefault();
                    this.set("isItemsSelectorVisible", false);
                    this.trigger($scope.events.onSelectorHide);
                };


                /* Public methods */

                this.loadSelector = function() {
                    $container = this;
                    if (!this.isSelectorLoaded()) {
                        this.load();
                    } else {
                        this._reloadItems();
                    }
                };

                this.setCounterpartFilter = function(counterpartFilter) {
                    this.counterpartFilter = counterpartFilter;
                    if (this.isSelectorLoaded()) {
                        this._reloadItems();
                    }
                };

                this.isCounterpartFilterSet = function() {
                    return !!this.counterpartFilter;
                };

                this.selectInitialItem = function(item) {
                    var that = this;
                    var observedItem = kendo.observable(new Item(item, this));
                    this.selectedItem = observedItem;
                    this.selectItem(observedItem);
                    this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function() {
                        that._refreshSelectedItem(true);
                    });
                    this._refreshSelectedItem(true);
                };

                this.onSelectClick = function(item) {
                    if (item.isDisabled) {
                        return;
                    }
                    if (this.selectWithConfirmation) {
                        this.trigger($scope.events.onItemClicked, item);
                    } else {
                        this.selectHandler(item);
                    }
                };

                this.selectHandler = function(item) {
                    // selectedItem will unselect automatically
                    if (item) {
                        this.selectItem(item);
                    }
                    this.trigger($scope.events.onItemSelected);

                    this.set("isItemsSelectorVisible", false);
                    this.trigger($scope.events.onSelectorHide);
                };

                this.getFirstItem = function() {
                    var items = this.getVisibleItems();
                    return items.length ? items[0] : null;
                };

                this.setEventTime = function(start, end, timeZoneId) {
                    this._startTime = start;
                    this._endTime = end;
                    this._timeZoneId = timeZoneId;
                };

                this.updateEventTime = function(start, end, timeZoneId, useCahedValue) {
                    var that = this;
                    this.setEventTime(start, end, timeZoneId);
                    if (this.selectedItem) {
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId, useCahedValue).done(function() {
                            that._refreshSelectedItem();
                        });
                    }
                };

                this.showTimeOffset = function(value) {
                    if (this.selectedItem) {
                        this.selectedItem.set("isTimeOffsetsVisible", value);
                        this._refreshSelectedItem();
                    }
                };

                this.disableSelectedItem = function(reason) {
                    if (this.selectedItem) {
                        this.selectedItem.disable(reason);
                        this._refreshSelectedItem();
                    }
                };
            }

            function EmptyContainer(opt) {
                Container.call(this, opt);

                this._getData = function() {
                    var promise = $.Deferred();
                    promise.resolve({
                        data: [],
                        total: 0
                    });
                    return promise;
                };
            }

            function ClinicianContainer(opt) {
                Container.call(this, opt);
                this.typeName = "ClinicianContainer";

                this.personType = $scope.personType.clinician;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;

                    filter.roleFunctions = [snap.security.conduct_virtual_consultations];
                    if (this.counterpartFilter) {
                        filter.patient = this.counterpartFilter;
                    }

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getClinicianList(snap.hospitalSession.hospitalId, filter).then(function(clinicians) {
                        var items = clinicians.data.map(function(clinician) {
                            clinician.person.providerId = clinician.providerId;
                            return kendo.observable(new Item({
                                id: clinician.userId,
                                personId: clinician.person.id,
                                name: $scheduleCommon.getFullName(clinician.person),
                                gender: clinician.gender,
                                imageSource: clinician.person.photoUrl || global.getDefaultProfileImageForClinician(clinician.gender),
                                info: $scheduleCommon.getSpeciality(clinician.specialty),
                                data: clinician,
                                personType: that.personType,
                                isSelected: clinician.userId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: clinicians.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Provider list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }

            function PatientContainer(opt) {
                Container.call(this, opt);
                this.typeName = "PatientContainer";

                this.personType = $scope.personType.patient;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;
                    if (this.counterpartFilter) {
                        filter.clinician = this.counterpartFilter;
                    }

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getPatientList(snap.hospitalSession.hospitalId, filter).then(function(patients) {
                        var items = patients.data.map(function(patient) {
                            patient.person.providerId = patient.providerId;
                            return kendo.observable(new Item({
                                id: patient.patientId,
                                personId: patient.person.id,
                                name: $scheduleCommon.getFullName(patient.person),
                                gender: patient.gender,
                                imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(patient.gender),
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                data: patient,
                                personType: that.personType,
                                isSelected: patient.patientId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: patients.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Patients list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }

            function FamilyGroupContainer(opt) {
                Container.call(this, opt);

                this.personType = $scope.personType.patient;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;
                    if (this.counterpartFilter) {
                        filter.providerPersonId = this.counterpartFilter;
                    }
                    filter.includeInvisible = true; // include invisible (due to visibility rules) family group members

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getPatientProfilesForPatient(filter).then(function(patients) {
                        var items = patients.data.map(function(patient) {
                            patient.person.providerId = patient.providerId;
                            return kendo.observable(new Item({
                                id: patient.patientId,
                                personId: patient.person.id,
                                isDisabled: patient.isInvisible,
                                name: $scheduleCommon.getFullName(patient.person),
                                gender: patient.gender,
                                imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(patient.gender),
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                data: patient,
                                personType: that.personType,
                                isSelected: patient.patientId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: patients.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Patients list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }


            this.emptySelector = function(opt) {
                return kendo.observable(new EmptyContainer(opt));
            };

            this.patientsSelector = function(opt) {
                return kendo.observable(new PatientContainer(opt));
            };

            this.cliniciansSelector = function(opt) {
                return kendo.observable(new ClinicianContainer(opt));
            };

            this.familyGroupSelector = function(opt) {
                return kendo.observable(new FamilyGroupContainer(opt));
            };

            this.convertPersonToSelectorItem = function(person, id, personType, gender, speciality) {
                var item = {
                    id: id || null,
                    personId: person.id,
                    name: $scheduleCommon.getFullName(person),
                    gender: gender,
                    imageSource: person.photoUrl,
                    data: {
                        person: person
                    },
                    personType: personType,
                };

                if (personType === $scope.personType.patient) {
                    item.info = $scheduleCommon.getPhoneNumber(person);
                } else {
                    item.info = $scheduleCommon.getSpeciality(speciality);
                }

                return item;
            };
        }).singleton();
}(jQuery, snap, kendo, window));

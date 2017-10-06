//@ sourceURL=itemSelector.control.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common").use(["snapNotification", "snap.EventAggregator", "snap.common.timeUtils", "snap.common.schedule.ScheduleCommon", "snap.common.loadingStack", "snap.service.availabilityBlockService"])
        .define("ItemSelector", function ($snapNotification, $eventAggregator, $timeUtils, $scheduleCommon, $loadingStack, $availabilityBlockService) {
            var itemDefaultValues = {
                id: null,
                name: "Select a Person",
                imageSource: "/images/default-user.jpg",
                info: "For the list",
            };

            this.events = {
                onItemSelected: "onItemSelected",
                onItemClicked: "onItemClicked",
                onSelectorHide: "onSelectorHide"
            };

            var $scope = this;

            this.personType = {
                clinician: "clinician",
                patient: "patient"
            };

            function sortByName(arr) {
                return arr.sort(function (a, b) {
                    var nameA = a.name.toLowerCase(),
                        nameB = b.name.toLowerCase();

                    if (nameA < nameB) { //sort string ascending
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0; //default return value (no sorting)
                });
            }

            function Item(item, container) {
                this.id = item.id;
                this.name = item.name;
                this.imageSource = item.imageSource ||
                    (item.personType === $scope.personType.clinician ? getDefaultProfileImageForClinician() : getDefaultProfileImageForPatient());
                this.info = item.info;
                this.personType = item.personType;
                this.personId = item.personId;
                this.data = item.data;

                this.isDefault = !this.id;
                this.isSelected = false;
                this.isDisabled = !!item.isDisabled;
                this.isTimeOffsetsVisible = !!item.isTimeOffsetsVisible;
                this.timeZoneId = null;
                this.timeZoneName = "unknown";

                this.vm_TimeText = item.vm_TimeText || "";

                this._convertedTimeCashe = item._convertedTimeCashe || null;

                this.select = function (val) {
                    this.set("isSelected", val);
                };

                this.onSelectClick = function () {
                    if (container) {
                        container.onSelectClick(this);
                    }
                };

                this.onViewProfileClick = function (e) {
                    if (!!this.id) {
                        $eventAggregator.published("itemSelector_onProfileClick", {
                            id: this.id,
                            personType: this.personType
                        });
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };

                this.getValue = function () {
                    return item;
                };

                this.vm_isVisible = function () {
                    if (container) {
                        return !this.isSelected;
                    }

                    return true;
                };

                this.updateTime = function (startTime, endTime, sourceTimeZoneId, useCahedValue) {
                    var that = this;
                    var dfd = $.Deferred();
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
                        }
                    });
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
                        }
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
                }
            }

            function Container(opt) {
                this.ds = null;
                this.nameFilter = "";
                this.counterpartFilter = opt.counterpartFilter;
                this.isItemsSelectorVisible = false;
                this.isSelectorLocked = false;
                this.vm_tabindex = opt.tabindex || 1;

                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this.selectedItem = null;
                var scope = this;

                var defaultItem = $.extend(true, {}, itemDefaultValues, opt.defaultItem);
                var triggerEvent = function (name) {
                    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                    var eventCbList = eventList[name];
                    if (eventCbList) {
                        $.each(eventCbList, function () {
                            return this.apply(scope, args);
                        });
                    }
                };

                this.isCounterpartFilterSet = function() {
                    return !!this.counterpartFilter;
                };

                this.onSelectClick = function(item) {
                    if (this.selectWithConfirmation) {
                        triggerEvent($scope.events.onItemClicked, item);
                    } else {
                        this.selectHandler(item);
                    }
                };

                this.selectHandler = function (item) {
                    this.ds.data().forEach(function (i) {
                        if (i.isSelected) {
                            i.select(false);
                        }
                    });

                    item.select(true);
                    this.selectItem(item);


                    triggerEvent($scope.events.onItemSelected);

                    this.set("isItemsSelectorVisible", false);
                    triggerEvent($scope.events.onSelectorHide);

                    this.trigger("change", {field: "ds"});
                };


                var eventList = {};

                /*********************** PUBLIC API ***********************/
                this.setDataSource = function (ds) {
                    this.set("ds", ds);

                    var that = this;
                    var loadingStack = $loadingStack.newStack(function () {
                        that.set("vm_isItemsLoading", true);
                    }, function () {
                        that.set("vm_isItemsLoading", false);
                    });

                    this.ds.bind("change", function () {
                        that._refresh();
                    });

                    this.ds.bind("requestStart", function () {
                        loadingStack.push();
                    })

                    this.ds.bind("requestEnd", function () {
                        loadingStack.pop();
                    })
                };

                this.getSelectedItem = function () {
                    return this.selectedItem;
                };

                this.isAnyItemSelected = function () {
                    var selectedItem = this.getSelectedItem();
                    return selectedItem !== null;
                };

                this.selectItem = function (item, doNotUpdateTime) {
                    var that = this;
                    this.set("selectedItem", new Item(item));
                    this.selectedItem.select(true);
                    this._refresh();
                    if (!doNotUpdateTime) {
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function() {
                            that._refresh();
                        });
                    }

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
                            that._refresh();
                        });
                    }
                };

                this.showTimeOffset = function (value) {
                    if (this.selectedItem) {
                        this.selectedItem.set("isTimeOffsetsVisible", value);
                        this._refresh();
                    }
                };

                this.refresh = function () {
                    this._reloadItems();
                };

                //We need event subscription because we can not not use Kendo Observable in constructor.
                //And use var scope = this; scope.set("...", ...)
                this.on = function (eventName, cb) {
                    var eventCbList = eventList[eventName];
                    if (!eventCbList) {
                        eventCbList = [];
                    }
                    eventCbList.push(cb);
                    eventList[eventName] = eventCbList;
                };

                this.getItemById = function(id){
                    return this.ds.data().find(function (item) {
                       return item.id == id;
                    });
                }
                /*********************** MVVM BINDINGS ***********************/
                this.vm_isItemsLoading = false;

                this.vm_nameFilterChange = function () {
                    if (!!this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    var that = this;
                    this.searchTimeout = setTimeout(function () {
                        that.ds.read({
                            skip: 0
                        });
                    }, 500);
                };

                this.vm_isItemsListEmpty = function () {
                    return this.ds.data().length === 0;
                };

                this.vm_getItemsListEmptyNotification = function () {
                    return this.nameFilter === "" ?
                        "Enter user name to begin search" :
                        "No users match your search";
                };

                this.vm_getSelectedItemOrDefault = function () {
                    if (this.selectedItem) {
                        var selected = kendo.observable(new Item(this.selectedItem));
                        selected.set("isSelectorLocked", this.isSelectorLocked);
                        return selected;
                    } else {
                        var def = defaultItem;
                        if (opt.defaultItem) {
                            def = opt.defaultItem;
                        }

                        return kendo.observable(new Item(def));
                    }
                };

                this.vm_isSelectedItemsListNotEmpty = function () {
                    return this.vm_getSelectedItems().length > 0;
                };

                this.vm_getSelectedItems = function () {
                    var arr = [];

                    if (this.selectedItem) {
                        arr.push(this.selectedItem);
                    }
                    return arr;
                };

                this.vm_openItemsSelector = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                    if (!this.isSelectorLocked) {
                        var that = this;
                        that.set("isItemsSelectorVisible", true);

                        window.setTimeout(function () {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    }
                };

                this.vm_hideItemsSelector = function (e) {
                    e.preventDefault();
                    this.set("isItemsSelectorVisible", false);
                    triggerEvent($scope.events.onSelectorHide);
                };

                /************************ PRIVATE METHODS ************************/
                this._reloadItems = function () {
                    var that = this;
                    this.ds.read({ skip: 0 }).done(function () {
                        that._refresh();

                        window.setTimeout(function () {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    });
                };

                this._refresh = function () {
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
                        field: "vm_getItemsListEmptyNotification"
                    });

                    this.trigger("change", {
                        field: "vm_isSelectedItemsListNotEmpty"
                    });
                };

                this.disableSelectedItem = function() {
                    if (this.selectedItem) {
                        this.selectedItem.set("isDisabled", true);
                        this.trigger("change", {
                            field: "vm_getSelectedItemOrDefault"
                        });
                    }
                };
            }

            //************************* Data sources **************************
            function createCliniciansDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: [snap.baseUrl + "/api/v2.1/providers", snap.hospitalSession.hospitalId, "clinicians"].join("/"),
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }
                                if (container.counterpartFilter) {
                                    data.patient = container.counterpartFilter;
                                }
                                data.roleFunctions = [snap.security.conduct_virtual_consultations].join(",")
                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Provider list");
                    },
                    schema: {
                        data: function (clinicians) {
                            var data = clinicians.data.map(function (clinician) {
                                clinician.person.providerId = clinician.providerId;
                                return new Item({
                                    id: clinician.userId,
                                    personId: clinician.person.id,
                                    name: $scheduleCommon.getFullName(clinician.person),
                                    imageSource: clinician.person.photoUrl || getDefaultProfileImageForClinician(),
                                    info: $scheduleCommon.getPhoneNumber(clinician.person),
                                    data: clinician,
                                    personType: $scope.personType.clinician,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            function createPatientsDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: ['/api/v2.1/providers/', snap.hospitalSession.hospitalId, '/patients'].join(''),
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }
                                if (container.counterpartFilter) {
                                    data.clinician = container.counterpartFilter;
                                }

                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Patients list");
                    },
                    schema: {
                        data: function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return new Item({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $scope.personType.patient,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            function createFamilyGroupDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: snap.baseUrl + "/api/v2.1/patients/authorized-patients",
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }

                                if (container.counterpartFilter) {
                                    data.providerPersonId = container.counterpartFilter;
                                }

                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Patients list");
                    },
                    schema: {
                        data: function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return new Item({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $scope.personType.patient,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            /************************ "STATIC" METHODS ************************/
            this.containerClass = Container;

            this.emptySelector = function (opt) {
                var c = kendo.observable(new Container(opt));
                c.setDataSource(new kendo.data.DataSource({ data: [] }));

                return c;
            };

            this.patientsSelector = function (opt) {
                opt.tabindex = 1;
                var c = kendo.observable(new Container(opt));
                var ds = createPatientsDS(c);
                c.setDataSource(ds);

                return c;
            };

            this.cliniciansSelector = function (opt) {
                opt.tabindex = 2;
                var c = kendo.observable(new Container(opt));
                var ds = createCliniciansDS(c);
                c.setDataSource(ds);

                return c;
            };

            this.familyGroupSelector = function (opt) {
                opt.tabindex = 1;
                var c = kendo.observable(new Container(opt));
                var ds = createFamilyGroupDS(c);
                c.setDataSource(ds);

                return c;
            };


            this.convertPersonToSelectorItem = function (person, id, personType, speciality) {
                var item = {
                    id: id || null,
                    personId: person.id,
                    name: $scheduleCommon.getFullName(person),
                    imageSource: person.photoUrl || (personType === $scope.personType.patient ? getDefaultProfileImageForPatient() : getDefaultProfileImageForClinician()),
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
}(jQuery, snap, kendo));

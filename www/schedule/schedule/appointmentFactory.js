//@ sourceURL=appointmentFactory.js

(function ($, snap, kendo, global) {
    "use strict";
    snap.namespace("snap.patient.schedule")
        .use(["snapNotification",
            "snap.admin.TimeUtils",
            "snap.common.schedule.ItemSelector",
            "snap.common.schedule.ScheduleCommon",
			"snap.common.schedule.encounterMethodSelector",
            "snap.helper.encounterMethodHelper",
            "snap.EventAggregator",
            "snap.service.availabilityBlockService",
            "snap.patient.schedule.patientAppointmentService",
            "snap.patient.schedule.familyGroupDataSource",
            "snap.patient.schedule.apptsSlotsTray",
            "snap.service.selfSchedulingService",
            "snap.patient.schedule.patientSelfSchedulingHub",
            "snap.service.userService",
            "snap.patient.schedule.providersSlotsLocator",
             "snap.common.timer",
            "snap.DataService.customerDataService",
            "snap.common.navigationHelper"
        ])
        .define("AppointmentFactory", function ($snapNotification, $timeUtils,
            $itemSelector, $scheduleCommon, $encounterMethodSelector, $encounterMethodHelper, $eventAggregator,
            $availabilityBlockService, $appointmentService,
            $familyGroupDataSource, $apptsSlotsTray, $selfSchedulingService,
            $patientSelfSchedulingHub, $userService, $providersSlotsLocator, $timer, $customerDataService, $errorHandler, $navigationHelper) {

            this.closeEvent = "pappt_OnCloseClick";
            this.savedEvent = "pappt_OnSaved";
            this.removedEvent = "pappt_OnRemoved";

            this.dialogContainer = null;
            var fact = this;
$("#localize-widget").hide();
            var encounterTypeCodes = snap.enums.EncounterTypeCode;

            var phoneTypeEnum = snap.resolveObject("snap.enums.PhoneTypes");

            function Appointment(data) {
                var _this = this;

                var opt = data.appt;
				 var scope = this;

                $providersSlotsLocator.setListeningDate(new Date(opt.start));
                var slotsLocator = $providersSlotsLocator.createSlotsLocator();

                var otherPrimaryConcernId = $scheduleCommon.concernCodes.otherPrimary;
                var otherSecondaryConcernId = $scheduleCommon.concernCodes.otherSecondary;

				var availableTimeTimer = null;
                var defaultPatient = {
                    id: null,
                    name: "Select a Patient",
                    imageSource: "images/Patient-Male.gif",
                    info: "For this appointment"
                };

				this.preventDefault = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                };
                this._typeName = "Appointment";
                this._removeCurrentEventMessage = "Are you sure that you want to cancel this appointment?";
                this._removedSuccesfullyMessage = "The Appointment was removed successfully";

                this.clinician = null;
                this.clinicianImageSource = "images/Patient-Male.gif";
                this.clinicianFullName = "Select a Provider";

				this.availableTime = "00:00";

                this._secondaryConcernsAvailable = false;

                this.clinicianCard = data.clinicianCard;
                this.isClinicianDisabled = data.isClinicianDisabled;
                this.isDisabled = !!data.isClinicianDisabled;
 				this._providerDisabledReason = data.disableReason || "Provider is unavailable";


                this.appointmentId = opt.appointmentId || 0;
  				this.consultationId = opt.consultationId || null; // Optional field. Consultation may not exist yet.
                this.start = opt.start;
                this.end = opt.end;
                this.startDate = opt.start;
                this.oldStartDate = opt.start;
                this.availabilityBlockId = opt.availabilityBlockId;
                this.isNow = opt.isNow;
                this.waiveFee = opt.waiveFee;

                this.isLoading = false;
                this.isError = false;
                this.showFrequencyDetails = false;

                this.isDateAreaInEditMode = false;
                this.vm_primaryConsernId = null;
                this.vm_secondaryConsernId = null;
                this.primaryConcernOtherText = "";
                this.secondaryConcernOtherText = "";
               // this.isReadOnly = data.isReadOnly || false;
                this.isFuture = data.isFuture;

                this.appointmentStatusCode = opt.appointmentStatusCode;

                this.vm_isLoading = false;

                this.phoneNumber = "";
                this.phoneType = phoneTypeEnum.other;

                this.timeZoneId = snap.profileSession.timeZoneId;
                this.serviceTypeId = opt.serviceTypeId;

                this.phoneTypeDs = new kendo.data.DataSource({
                    data: [{
                        text: "Home",
                        value: phoneTypeEnum.home
                    }, {
                        text: "Mobile",
                        value: phoneTypeEnum.mobile
                    }, {
                        text: "Other",
                        value: phoneTypeEnum.other
                    }]
                });
				var isUnEditable = data.isReadOnly || false;
                if (this.appointmentStatusCode) {
                    isUnEditable = isUnEditable || $scheduleCommon.isAppointmentReadOnly(this.appointmentStatusCode);
                }
                this.isRemovable = !isUnEditable;
                this.isReadOnly = isUnEditable;
                this.appointmentTypeCode = $scheduleCommon.appointmentTypeCode.patientScheduled;

                this._initSelectors = function () {
                    var clinician = $scheduleCommon.findProvider(opt.participants);
                    var clinicianID = clinician ? clinician.person.id : null;

                    var clinicianPersonId = opt.clinicianPersonId ? opt.clinicianPersonId : clinicianID;

                    this.patientsSelector = this._isPatientSelectorLocked() ?
                        $itemSelector.emptySelector({ 
                            defaultItem: defaultPatient,
                            htmlContainerId: "#itemSelector_patientsList",
                            scrollableElementClass: ".itemSelector_scrollable"
                        }) :
                        $itemSelector.familyGroupSelector({
                            defaultItem: defaultPatient,
                            counterpartFilter: clinicianPersonId,
                            htmlContainerId: "#itemSelector_patientsList",
                            scrollableElementClass: ".itemSelector_scrollable"
                        });

                    this.encounterMethodSelector = $encounterMethodSelector.createSelector({
                        appointmentTypeCode: this.appointmentTypeCode
                    });
                    this.encounterMethodSelector.bind($encounterMethodSelector.events.onMethodSelected, function(encounterTypeCode) {
                        scope.encounterTypeCode = encounterTypeCode;
                        scope.trigger("change", { field: "isPhone" });
                        scope._onDataChange();
                    });
                };

                this.getOptions = function () {
                    var concerns = [];

                    if (this.primaryConcern) {
                        concerns.push(this.primaryConcern);
                    }

                    if (this.secondaryConcern) {
                        concerns.push(this.secondaryConcern);
                    }

                    var participants = [];

                    if (this.clinician) {
                        participants.push({
                            appointmentId: this.appointmentId,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: this.clinician.person.id,
                            person: this.clinician.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
                        });
                    }

                    var patient = this.patientsSelector.getSelectedItem();
                    if (patient) {
                        participants.push({
                            appointmentId: this.appointmentId,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: patient.data.person.id,
                            person: patient.data.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.patient,
                            patientId: patient.id
                        });
                    }

                    return {
                        id: this.appointmentId,
                        start: this.start,
                        end: this.end,
                        availabilityBlockId: this.availabilityBlockId,
                        isNow: this.isNow,
                        appointmentTypeCode: this.appointmentTypeCode,
                        intakeMetadata: {
                            additionalNotes: this.additionalNotes,
                            concerns: concerns
                        },
                        participants: participants,
                        waiveFee: this.waiveFee,
                        encounterTypeCode: this.encounterTypeCode,
                        phoneNumber: this.phoneNumber,
                        phoneType: this.phoneType,
                        serviceTypeId: this.serviceTypeId
                    };
                };

                /*********************** PUBLIC API ***********************/
                this.setInitialFocus = function () {
                    $(".directory__opener").first().focus();
                };
                this._finishLoading = function () {
                          scope = this;
                    // 1 second timeout to prevent css issues
                    // so that all styles will apply and conrtols will render
                    window.setTimeout(function () {
                        scope.set("vm_isLoading", false);
                        scope.setInitialFocus();

                        scope.trigger("change", { field: "vm_primaryConsernId" });
                        scope.trigger("change", { field: "vm_secondaryConsernId" });
                    }, 1000);
                };
                this._checkCurrentTime = function() {
                    var dfd = $.Deferred();
                    if (!this.isReadOnly && !this.vm_isNew()) {
                        $userService.getUserCurrentTime().done(function(resp) {
                            var userTime = $timeUtils.dateFromSnapDateString(resp.data[0]);
                            scope.set("isReadOnly", scope.start < userTime);
                            scope.patientsSelector.set("isSelectorLocked", scope.patientsSelector.isSelectorLocked || scope.isReadOnly);
                            scope.trigger("change", {field: "vm_dialogTitle"});

                            var userDNATime = userTime.setMinutes(userTime.getMinutes() - 30);
                            scope.set("isFuture", userDNATime <= scope.end);
                            dfd.resolve();
                        });
                    } else {
                        dfd.resolve();
                    }
                    return dfd.promise();
                }
                this.load = function () {
                    scope = this;

                    this._checkCurrentTime().always(function() {
                        // autosize textarea after changing readonly property
                        global.autosize($('.js-autoresize-textarea'));
                    });

                    this.set("vm_isLoading", true);
                    this._isPatientLoaded = false;
                    this._areConcernsLoaded = false;

                    this.patientsSelector.loadSelector();
                    this.patientsSelector.set("isSelectorLocked", this._isPatientSelectorLocked());
                    if (this.isClinicianDisabled) {
                        var targetEl = $("#providerContainer");
                        if (targetEl.length) {
                            targetEl.kendoTooltip({
                                position: "top",
                                content: scope._providerDisabledReason
                            });
                        }
                    }

                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this._updateProviderEventTime();

                    this.encounterMethodSelector.setReadonly(this.isReadOnly);

                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this.trigger("change", {
                        field: "vm_dialogTitle"
                    });

                    $eventAggregator.unSubscribe("slotTray_slotClickCallback");
                    $eventAggregator.subscriber("slotTray_slotClickCallback", function () {
                        scope._onDataChange();
                        scope.patientsSelector.updateEventTime(scope.start, scope.end, scope.timeZoneId);
                        scope._updateProviderEventTime();
                    });

                    $eventAggregator.unSubscribe("itemSelector_onProfileClick");
                    $eventAggregator.subscriber("itemSelector_onProfileClick", function(data) {
                        $navigationHelper.patient.goToPatietProfile({ patientId: data.id });
                    });

                    scope.patientsSelector.bind($itemSelector.events.onSelectorHide, scope.setInitialFocus);

                    if (!this.vm_isNew()) {
                        this.patientsSelector.selectWithConfirmation = true;
                        this.patientsSelector.bind($itemSelector.events.onItemClicked, function (item) {
                            $snapNotification.confirmationWithCallbacks("Are you sure you want to change the patient for this appointment? (This will send a cancellation notice to the previous patient.)", function () {
                                scope.patientsSelector.selectHandler(item);
                            });
                        });
                    }

                    var codeSetsDs = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);

                    var patient = scope.patientsSelector.getSelectedItem();
                    if (patient) {
                        if (this.isReadOnly) {
                            this._isPatientLoaded = true;
                            this.set("vm_canShowTimeOffsets", true);
                        } else {
                            // check and refresh the patient
                            if (scope.patientsSelector.vm_isItemsLoading) {
                                scope.patientsSelector.one($itemSelector.events.onDataLoaded, function() {
                                    scope._checkPatient(patient, data);
                                });
                            } else {
                                scope._checkPatient(patient, data);
                            }

                            this.patientsSelector.bind($itemSelector.events.onItemSelected, function () {
                                scope._onDataChange();
                                scope.set("phoneNumber", "");
                                scope.vm_onPhoneTypeChange();

                                scope.patientsSelector.showTimeOffset(scope.vm_isTimeOffsetsVisible);
                                if (scope.isDisabled && !scope.isClinicianDisabled) {
                                    // if clinician is enabled, and patient disabled, we will enable dialog after selected patient change
                                    scope.set("isDisabled", false);
                                    scope.trigger("change", { field: "vm_isNotDisabled" });
                                }
                            });
                        }
                    }

                    codeSetsDs.getItemIdByName("primary", snap.hospitalSession.hospitalId, "other (provide details below)").done(function (codeId) {
                        if (codeId !== null) {
                            otherPrimaryConcernId = codeId;
                            scope.set("dataPrimaryConcernList", codeSetsDs.getCodeSetDataSourceReplacingNames(
                                "primary",
                                snap.hospitalSession.hospitalId, [
                                    "Other (provide details below)"
                                ], [{
                                    "codeId": otherPrimaryConcernId,
                                    "text": "Other (provide details below)"
                                }]
                            ));
                        } else {
                            scope.set("dataPrimaryConcernList", codeSetsDs.getCodeSetDataSource("primary", snap.hospitalSession.hospitalId));
                        }

                        if (scope.vm_primaryConsernId) {
                            scope.dataPrimaryConcernList.one("change", function () {
                                var primaryConcernFound = !!scope._formatConcernData(scope.dataPrimaryConcernList, scope.vm_primaryConsernId, true);
                                scope.set("vm_primaryConcernError", !primaryConcernFound);
                                scope.set("vm_primaryConcernActive", primaryConcernFound);
                            });
                        }
                        scope.trigger("change", { field: "vm_primaryConsernId" });
                        scope.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });

                        codeSetsDs.getItemIdByName("secondary", snap.hospitalSession.hospitalId, "other (provide details below)").done(function (codeId) {
                            if (codeId !== null) {
                                otherSecondaryConcernId = codeId;
                                scope.set("dataSecondaryConcernList", codeSetsDs.getCodeSetDataSourceReplacingNames(
                                    "secondary",
                                    snap.hospitalSession.hospitalId, [
                                        "Other (provide details below)"
                                    ], [{
                                        "codeId": otherSecondaryConcernId,
                                        "text": "Other (provide details below)"
                                    }]
                                ));
                            } else {
                                scope.set("dataSecondaryConcernList", codeSetsDs.getCodeSetDataSource("secondary", snap.hospitalSession.hospitalId));
                            }
                            
                            scope.dataSecondaryConcernList.read().then(function () {
                                scope._secondaryConcernsAvailable = scope.dataSecondaryConcernList.data().length > 0;
                                scope.trigger("change", { field: "vm_isAddConcernButtonVisible" });
                                if (scope.vm_secondaryConsernId) {
                                    var secondaryConcernFound = !!scope._formatConcernData(scope.dataSecondaryConcernList, scope.vm_secondaryConsernId, false);
                                    scope.set("vm_secondaryConcernError", !secondaryConcernFound);
                                    scope.set("vm_secondaryConcernActive", secondaryConcernFound);
                                }
                            });
                            scope.trigger("change", { field: "vm_secondaryConsernId" });
                            scope.trigger("change", { field: "vm_isSecondaryConcernOtherSelected" });

                            scope._areConcernsLoaded = true;
                            if (scope._isPatientLoaded) {
                                scope._finishLoading();
                            }
                        });
                    });

                    if (!this.appointmentId) {
                        this._initDeactivationTimeout();
                    }

                };

this._checkPatient = function(patient, data) {
                    if (scope.vm_isNew()) {
                        var patientItem = scope.patientsSelector.getItemById(patient.id) || scope.patientsSelector.getFirstItem();
                        if (patientItem) {
                            scope.patientsSelector.selectHandler(patientItem);
                        }
                        data.patientProfileId = scope.patientsSelector.getSelectedItem().id;
                    }
                    getPatientItem(data.patientProfileId).then(function (item) {
                        if (item) {
                            scope.patientsSelector.selectInitialItem(item);
                        } else {
                            scope.set("isDisabled", true);
                            scope.trigger("change", { field: "vm_isNotDisabled" });
                            scope.patientsSelector.disableSelectedItem($errorHandler.getProfileDisabledReason());
                        }
                    }, function(error) {
                        scope.set("isDisabled", true);
                        scope.trigger("change", { field: "vm_isNotDisabled" });
                        scope.patientsSelector.disableSelectedItem($errorHandler.getProfileDisabledReason(error));
                    }).always(function() {
                        scope._isPatientLoaded = true;
                        if (scope._areConcernsLoaded) {
                            scope._finishLoading();
                        }
                        scope.set("vm_canShowTimeOffsets", scope.patientsSelector.getSelectedItem() !== null);
                    });
                };


                this.save = function () {


                    this.set("isLoading", true);
                    this.set("isError", false);

                    var that = this;
                    var promise = $appointmentService.saveAppointment(this.getOptions());
                    promise.done(function () {
  if (!that.vm_isNew()) {

                            $snapNotification.success(that._typeName + " updated successfully");
                        }
                        that.set("isError", false);
                    }).fail(function () {
                        that.set("isError", true);
                    }).always(function () {
                        that.set("isLoading", false);
                    });

                    return promise;
                };

                 this.remove = function () {
                    var dfd = $.Deferred();
                    var that = this;
                    this._checkPaymentStatus().done(function(result) {
                        if(result) {
                            $appointmentService.removeAppointment(that.appointmentId).done(function() {
                                dfd.resolve();
                            }).fail(function(error) {
                                dfd.reject(error);
                            });    
                        } else {
                            dfd.reject("Consultation is already paid by other user.");
                        }
                    });

                    return dfd;
                };

                this.unlockSlot = function() {
                    this._clearDeactivationTimeout();

                    $patientSelfSchedulingHub.unlockSlot(this.availabilityBlockId, this.start, this.end);
                };







                this._checkPaymentStatus = function() {
                    var dfd = $.Deferred();
                    if(this.consultationId) {
                        $customerDataService.checkPaymentStatus(this.consultationId).done(function (responsePayment) {
                            if (responsePayment.paidByUserId === snap.profileSession.userId)
                            {
                                dfd.resolve(true);
                            }
                            else {
                                dfd.resolve(false);
                            }
                        }).fail(function() {
                            dfd.resolve(true);
                        });
                    } else {
                        dfd.resolve(true);
                    }

                    return dfd;
                };

                this.validate = function () {
                    var errorList = [];
                    if (this.start === null) {
                        errorList.push("Start date is required");
                    }
                    if (this.patientsSelector.getSelectedItem() === null) {
                        errorList.push("Select a Patient.");
                        this.set("vm_isPatientSelectError", true);
                        this.set("vm_canShowTimeOffsets", false);
                    }

                    if ((this.vm_primaryConsernId !== null) && (this.displaySecondaryConcern && this.vm_secondaryConsernId !== null) && this.vm_secondaryConsernId !== otherSecondaryConcernId && this.primaryConcern.customCode.description === this.secondaryConcern.customCode.description) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if ((this.vm_secondaryConsernId === otherSecondaryConcernId && this.vm_primaryConsernId === otherPrimaryConcernId) && ($.trim(this.primaryConcernOtherText) === $.trim(this.secondaryConcernOtherText))) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if (this.vm_primaryConsernId === null) {
                        errorList.push("Select or enter a Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_primaryConsernId === otherPrimaryConcernId && $.trim(this.primaryConcernOtherText) === "") {
                        errorList.push("Enter Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.displaySecondaryConcern && this.vm_secondaryConsernId === null) {
                        errorList.push("Select Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_secondaryConsernId === otherSecondaryConcernId && $.trim(this.secondaryConcernOtherText) === "") {
                        errorList.push("Enter Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.encounterTypeCode === encounterTypeCodes.Phone && $.trim(this.phoneNumber) === "") {
                        errorList.push("Enter a Phone number.");
                        this.set("vm_phoneNumberError", true);
                        this.set("vm_isPhoneNumberFilled", false);
                    }

                    return errorList;
                };

                this.toggleDateArea = function () {
                    this.set("startDate", this.start);
                    this.set("isDateAreaInEditMode", !this.get("isDateAreaInEditMode"));
                };
                /*********************** MVVM BINDINGS ***********************/
                this.availableTime = "00:00";

                this._startTimer = function() {
                    var that = this;
                    var timer = $timer.createTimer({
                        countDown: true,
                        time: 300,
                        onTimerTickCallback: function(timerTick) {
                            that.set("availableTime", [timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                        }
                    });

                    availableTimeTimer.start();
                };

                this.vm_currentDate = function () {
                    var dateFilter = new Date();
                    dateFilter.setHours(0, 0, 0, 0);

                    return dateFilter;
                };









                this.vm_hideTimer = false;
                 this.vm_dialogTitle = function () {
                    var appoinmentStatus = this.isReadOnly ? "Appointment" : "Edit Appointment";
                    return this.vm_isNew() ? "New Appointment" : appoinmentStatus;
                };

                this.vm_isNotDisabled = function () {
                    return !this.isDisabled;
                };

                this.vm_saveBtnTxt = function () {
                    return this.vm_isNew() ? "Create" : "Save";
                };

                this.vm_onSubmitClick = function () {
                    // debugger;

                    var that = this;
                    //if(that.additionalNotes == ""){
                         var addnotes = $(".consultation-note__textarea").val();
                         that.additionalNotes = addnotes;
                    //}
                     this._dialogChanged = false;
                    if (!this.isLoading) {
                        this.set("isError", false);
                        this.set("isLoading", true);
                        var errors = this.validate();
                        if (errors.length === 0) {
                            saveAction();

                        } else {
                            this.set("isLoading", false);
                            this.set("isError", true);

                            $snapNotification.error(errors.join("<br\>"));
                        }
                    }

                    function saveAction() {
                        that.save().done(function () {
                            $eventAggregator.published(fact.savedEvent, that.getOptions());
                            that._clearDeactivationTimeout();
                            $patientSelfSchedulingHub.bookSlot(that.availabilityBlockId, that.start, that.end);

                        }).fail(function (error) {
                            if (error) {
                                $snapNotification.error(error);
                                that.set("isError", true);
                            }
                        }).always(function () {
                            that.set("isloading", false);
                        });
                    }
                };

                 this.vm_onCloseClick = function (e) {
                    $eventAggregator.published(fact.closeEvent, this);

                    this.preventDefault(e);
                };


                this.vm_onRemoveClick = function () {
                    this._clearDeactivationTimeout();
                    var that = this;
                    $snapNotification.hideAllConfirmations();
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to remove this appointment?", function () {
                        that.set("isLoading", true);
                        that._dialogChanged = false;

                        that.remove().done(function () {
                            $eventAggregator.published(fact.removedEvent, that);
                             $snapNotification.success("The Appointment was removed successfully");
                        }).fail(function (error) {
                            $snapNotification.error(error);
                            that.set("isError", true);
                        }).always(function(){
                            that.set("isLoading", false);
                        });
                    });
                };

                this.vm_isAddConcernButtonVisible = function () {
                    return !this.isReadOnly && this._secondaryConcernsAvailable && !this.displaySecondaryConcern && this.vm_primaryConsernId !== null;
                };

                this.vm_isSaveBtnVisible = function() {
                    return this._dialogChanged || this.vm_isNew();
                };

                this.vm_isCancelBtnVisible = function () {
                    return !this.vm_isSaveBtnVisible() && this.isRemovable;
                };

                this.vm_canShowTimeOffsets = false;
                this.vm_isTimeOffsetsVisible = false;
                this.vm_ProviderTimeText = "";
                this.vm_showTimeOffsets = function () {
                    var flag = !this.vm_isTimeOffsetsVisible;
                    this.set("vm_isTimeOffsetsVisible", flag);
                    this.patientsSelector.showTimeOffset(flag);
                };

                this._setSelectorTime = function() {
                    this.patientsSelector.setEventTime(this.start, this.end, this.timeZoneId);
                };

                this._updateProviderEventTime = function() {
                    var that = this;
                    var duration = this.end - this.start;
                    var opt = {
                        dateTime: $timeUtils.dateToString(this.start),
                        sourceTimeZoneId: this.timeZoneId,
                        targetUserId: this.clinicianCard.userId
                    };
                    $availabilityBlockService.convertTime(opt).done(function(convertedTime) {
                        if (convertedTime) {
                            var convertedStartTime = $timeUtils.dateFromSnapDateString(convertedTime.convertedDateTime);
                            var timeZoneName = convertedTime.targetTimeZone.abbreviation;
                            var convertedEndTime = new Date(convertedStartTime);
                            convertedEndTime.setTime(convertedEndTime.getTime() + duration);
                            that.set("vm_ProviderTimeText", kendo.toString(convertedStartTime, "h:mm tt ") + timeZoneName + " - " +
                                kendo.toString(convertedEndTime, "h:mm tt ") + timeZoneName);
                        }
                    });
                };

               this._dialogChanged = false;

                this._onDataChange = function () {
                    if (!this._dialogChanged) {
                        this._dialogChanged = true;
                        this.trigger("change", { field: "vm_isSaveBtnVisible" });
                        this.trigger("change", { field: "vm_isCancelBtnVisible" });
                    }
                    if (this.isError) {
                        this.set("isError", false);
                    }
                };

                this.isVideo = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Video;
                };
                this.isPhone = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Phone;
                };
                this.isText = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Text;
                };
                this.isInPerson = function () {
                    return this.encounterTypeCode == encounterTypeCodes.InPerson;
                };
                this.refreshEncounterType = function () {
                    this.trigger("change", { field: "isVideo" });
                    this.trigger("change", { field: "isPhone" });
                    this.trigger("change", { field: "isText" });
                    this.trigger("change", { field: "isInPerson" });
                };
                var setEncounterType = function (encounterTypeCode) {
                    if (!scope.isReadOnly) {
                        scope.set("encounterTypeCode", encounterTypeCode);
                        scope.refreshEncounterType();
                        scope._onDataChange();
                    }
                };
                this.setVideoType = function () {
                    setEncounterType(encounterTypeCodes.Video);
                };
                this.setPhoneType = function () {
                    setEncounterType(encounterTypeCodes.Phone);
                };
                this.isPhoneConsultationDisabled = function () {
                    return snap && snap.hospitalSettings.disablePhoneConsultation;
                }
                this.setTextType = function () {
                    setEncounterType(encounterTypeCodes.Text);
                };
                this.setInPersonType = function () {
                    setEncounterType(encounterTypeCodes.InPerson);
                };

                this.vm_isPhoneNumberFilled = false;






                this.vm_onPhoneNumberChange = function() {
                    this.set("vm_phoneNumberError", false);
                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    if (this.phoneType !== phoneTypeEnum.other) {
                        this.set("phoneType", phoneTypeEnum.other);
                    }
                    this._onDataChange();
                };

                this.vm_onPhoneTypeChange = function () {
                    // get phone type
                    // get phone from person from selector
                    // update phone field
                    // TODO: remove filter Function to utilities or replace with ES6 or underscore / lodash libraries
                    try {
                        var _phoneType = this.phoneType;

                        var filterFunc = function (array, callback) {
                            var result = [];
                            for (var i = 0; i < array.length; i++) {
                                if (callback(array[i])) {
                                    result.push(array[i]);
                                }
                            }
                            return result;
                        };

                        var callback = function (a) {
                            return phoneTypeEnum[a] == _phoneType;
                        };

                        var typeName = filterFunc(Object.keys(phoneTypeEnum), callback)[0];

                        //there is a selected patient
                        if (this.patientsSelector.getSelectedItem()) {
                            var phones = this.patientsSelector.getSelectedItem().data.person.phones;
                            var callback2 = function (b) {
                                return b.use == typeName;
                            };
                            var numberVal = filterFunc(phones, callback2);

                            if (numberVal.length > 0) {
                                this.set("phoneNumber", numberVal[0].value);
                            }
                            else {
                                this.set("phoneNumber", "");
                            }
                        }
                    }
                    catch (exp)
                    {
                        console.error(exp);
                    }

                    this._onDataChange();
                };
this.vm_isNew = function () {
                    return this.appointmentId === 0;
                };

 this._isPatientSelectorLocked = function () {
                    return this.isReadOnly || !this.vm_isNew();
                };

                this.vm_expandAddNotes = function(){
                    this.set("vm_isAddNotesExpanded", !this.vm_isAddNotesExpanded);
                   /*window.setTimeout(function () {
                    alert("enter");
                        $('.dialogbox-master__wrapper').animate({scrollTop : 1000},900);
                  }, 1000);*/

                };

                this.vm_onKeyUpAdditionalNotes = function () {
                    this._onDataChange();
                };

                this.vm_onAddConcernClick = function (e) {
                    this.preventDefault();
                    this.set("displaySecondaryConcern", true);
                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this._onDataChange();
                };

                this.vm_onRemoveSecondaryConcernClick = function () {
                    this.set("vm_secondaryConcernError", false);
                    this.set("vm_secondaryConcernActive", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("displaySecondaryConcern", false);
                    this.set("vm_secondaryConsernId", null);
                    this.secondaryConcern = null;
                    this.set("secondaryConcernOtherText", "");
                    this.trigger("change", {
                        field: "vm_isSecondaryConcernOtherSelected"
                    });
                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this._onDataChange();
                };

                this.vm_primaryConcernActive = false;

                this.vm_isPrimaryConcernOtherSelected = function () {
                    return this.vm_primaryConsernId === otherPrimaryConcernId;
                };

                this.vm_isSecondaryConcernOtherSelected = function () {
                    return this.vm_secondaryConsernId === otherSecondaryConcernId;
                };

                 this.vm_onPrimaryConcernChange = function () {
                    this.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });

                    this.set("vm_primaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_secondaryConcernError", false);
                        this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);

                    var concern = this._formatConcernData(this.dataPrimaryConcernList, this.vm_primaryConsernId, true);
                    var changedSelectedConcern = this.primaryConcern ? this.vm_primaryConsernId !== this.primaryConcern.customCode.code : true;
                    if (changedSelectedConcern && this.primaryConcernOtherText !== "") {
                        this.set("primaryConcernOtherText", "");
                    }

                    if (this.vm_isPrimaryConcernOtherSelected()) {
                        concern.customCode.description = this.get("primaryConcernOtherText");
                    }

                    this.primaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_primaryConcernError = false;

                this.vm_secondaryConcernActive = false;

               this.vm_onSecondaryConcernChange = function () {
                    this.trigger("change", {
                        field: "vm_isSecondaryConcernOtherSelected"
                    });

                    var concern = this._formatConcernData(this.dataSecondaryConcernList, this.vm_secondaryConsernId, false);

                    this.set("vm_secondaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);

                    var changedSelectedConcern = this.secondaryConcern ? this.vm_secondaryConsernId !== this.secondaryConcern.customCode.code : true;
                    if (changedSelectedConcern && this.secondaryConcernOtherText !== "") {
                        this.set("secondaryConcernOtherText", "");
                    }

                    if (this.vm_isSecondaryConcernOtherSelected()) {
                        concern.customCode.description = this.get("secondaryConcernOtherText");
                    }

                    this.secondaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_getStartTime = function () {
                    return [kendo.toString(this.get("start"), "h:mm"), " <span>", kendo.toString(this.get("start"), "tt"), "</span>"].join("");
                };
                this.vm_getStartDate = function () {
                    return kendo.toString(this.get("start"), "dddd, MMMM dd, yyyy");
                };


                this.vm_onToggleEditDate = function (e) {
                    if (!this.isDateAreaInEditMode) {
                        $('.js-footer-slider').not('.slick-initialized').slick({
                            infinite: false,
                            variableWidth: true,
                            slidesToShow: 1,
                          //  slidesToScroll: 2,
                          slidesToScroll: 1,
                            draggable: false,
                            easing: 'ease',
                            prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                            nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                        });
                    }

                    this.toggleDateArea();

                    this.preventDefault();
                    return false;
                };

                this.vm_onCancelEditDate = function () {
                    this.toggleDateArea();
                };

                this.vm_getDateAreaHeader = function () {
                    return this.get("isDateAreaInEditMode") ? "Reschedule Your Appointment" : "Date and Time";
                };

                this.vm_getDateAreaActionLabel = function () {
                    return this.get("isDateAreaInEditMode") ? "Done" : "<span class='icon_note'></span> Edit";
                };
                this.vm_onViewClinicianProfileClick = function () {
                    //TODO: GET ID AND IMPLEMENT REDIRECT
                };

                this.vm_notification_msg = "";

                this.vm_startDateChange = function () {
                    if (this.startDate === null) {
                        this.set("startDate", this.oldStartDate);
                    } else {
                        this.setSlotsDate(this.startDate);
                    }
                };

                this.setSlotsDate = function (starDate) {
                    var that = this;

                    var date = new Date(starDate);
                    date.setHours(0, 0, 0, 0);

                    this.set("startDate", date);

                    $selfSchedulingService.getSingleClinician(this.clinicianCard.userId, $timeUtils.dateToString(date)).done(function (response) {
                        var clinicianCard = response.data[0];
                        that.set("apptsSlotsTray", $apptsSlotsTray.createTimeSlotsTray(clinicianCard, date, that._selectNewAppointmentTime));
                        slotsLocator.setSlots(that.apptsSlotsTray.slots, date);

                        that.oldStartDate = that.startDate;
                        $('.js-footer-slider').not('.slick-initialized').slick({
                            infinite: false,
                            variableWidth: true,
                            slidesToShow: 1,
                        //    slidesToScroll: 2,
                            slidesToScroll: 1,
                            draggable: false,
                            easing: 'ease',
                            prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                            nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                        });
                    }).fail(function (error) {
                        if (error.status === 404) {
                            that.set("startDate", that.oldStartDate);
                            $snapNotification.info("There is no available appointment slots for selected date.");
                        }
                    });
                };
                /*********************** PRIVATE API ***********************/
                this._setOptions = function (opt, clinicianCard) {
                    this._setSelectorTime();

                    if (opt.intakeMetadata) {
                        this.additionalNotes = opt.intakeMetadata.additionalNotes ? opt.intakeMetadata.additionalNotes : "";

                        if (opt.intakeMetadata.concerns && opt.intakeMetadata.concerns.length > 0) {

                            var concerns = opt.intakeMetadata.concerns;
                            for (var i = 0; i < concerns.length; i++) {
                                if (concerns[i].isPrimary) {
                                    this.primaryConcern = concerns[i];
                                    this.vm_primaryConsernId = concerns[i].customCode.code;
                                    this.primaryConcernOtherText = concerns[i].customCode.description;
                                } else {
                                    this.secondaryConcern = concerns[i];
                                    this.displaySecondaryConcern = true;
                                    this.vm_secondaryConsernId = concerns[i].customCode.code;
                                    this.secondaryConcernOtherText = concerns[i].customCode.description;
                                }
                            }
                        }
                    }
                    var clinician = $scheduleCommon.findProvider(opt.participants);
                    if (clinician) {
                        this.clinician = clinician;
                        this.clinicianImageSource = clinician.person.photoUrl || global.getDefaultProfileImageForClinician();
                        this.clinicianFullName = $scheduleCommon.getFullName(clinician.person);
                        this.info = $scheduleCommon.getSpeciality(clinician.person.speciality);
                        if (!this.patientsSelector.isCounterpartFilterSet()) {
                            this.patientsSelector.setCounterpartFilter(clinician.person.id);
                        }
                    }

                    if (clinicianCard) {
                        var date = new Date(this.startDate);
                        date.setHours(0, 0, 0, 0);

                        this.apptsSlotsTray = $apptsSlotsTray.createTimeSlotsTray(clinicianCard, date, this._selectNewAppointmentTime);
                        slotsLocator.setSlots(this.apptsSlotsTray.slots, date);
                    }

                    var patient = $scheduleCommon.findPatient(opt.participants);
                    var patientId = patient.patientId || data.patientProfileId;
                     if (patient) {
                        this.patientsSelector.selectInitialItem(
                            $itemSelector.convertPersonToSelectorItem(patient.person, patientId, $itemSelector.personType.patient), true);
                    }

                    this.vm_isAddNotesExpanded = false;
                    this.phoneNumber = opt.phoneNumber;
                    this.phoneType = opt.phoneType || phoneTypeEnum.other;

                    this.encounterTypeCode = opt.encounterTypeCode || $encounterMethodHelper.getFirstEnabledEncounterMethod(this.appointmentTypeCode);
                    this.encounterMethodSelector.select(this.encounterTypeCode);
                };


                this._selectNewAppointmentTime = function (timeSlot) {
                    $eventAggregator.published("apptvm_TimeSlotSelected", timeSlot);
                    $patientSelfSchedulingHub.lockSlot(timeSlot.availabilityBlockId, $timeUtils.dateToString(timeSlot.start), $timeUtils.dateToString(timeSlot.end));
                };
                this._formatConcernData = function (concernList, selectedConcernId, isPrimary) {
                    var concerns = concernList.data().filter(function (concern) {
                        return concern.codeId === selectedConcernId;
                    });

                    if (concerns.length > 0) {
                        return {
                            isPrimary: isPrimary,
                            customCode: {
                                code: selectedConcernId,
                                description: concerns[0].text
                            }
                        };
                    }

                    return null;
                };
                this._deactivationTimeout = null;
                this._clearDeactivationTimeout = function () {
                    if (this._deactivationTimeout) {
                        clearTimeout(this._deactivationTimeout);
                        this.set("isReadOnly", false);
                    }
                    if (availableTimeTimer) {
                        availableTimeTimer.stop();
                        availableTimeTimer = null;
                    }
                };
                this.isExpiredAppointment = false;
                this._initDeactivationTimeout = function () {
                    this._clearDeactivationTimeout();

                    this._startTimer();

                    var that = this;
                    this._deactivationTimeout = setTimeout(function () {
                        that.set("isReadOnly", true);
                        that.set("isDisabled", true);
                        that.trigger("change", { field: "vm_isNotDisabled" });
                        that.set("vm_notification_msg", "This appointment has expired. Please close this dialogue and select a new time.");
                        that.set("vm_hideTimer", true);

                        setTimeout(function () {
                            that.set("isExpiredAppointment", true);
                        }, 1000);

                        $patientSelfSchedulingHub.unlockSlot(that.availabilityBlockId, that.start, that.end);
                    },
                    5 * 60 * 1000);
                };

                this._initSelectors();

                this._setOptions(opt, data.clinicianCard);

                function getPatientItem(patientProfileId) {
                    var dfd = $.Deferred();

                    if (patientProfileId) {
                        $selfSchedulingService.getFamillyGroupPatient(patientProfileId).done(function (resp) {
                            if (resp.data.length) {
                                var patient = resp.data[0];
                                dfd.resolve({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $itemSelector.personType.patient
                                });
                            } else {
                                dfd.resolve(null);
                            }
                        }).fail(function () {
                            dfd.resolve(null);
                        });
                    } else {
                        dfd.resolve(null);
                    }

                    return dfd.promise();
                }
            }



            this.createNew = function (opts) {
                return new Appointment(opts);
            };
        }).singleton();
}(jQuery, snap, kendo, window));

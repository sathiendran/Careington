//@ sourceURL=patienthome.new.viewmodel.js

(function ($, snap, kendo, global) {
    "use strict";
    snap.namespace("Snap.Patient")
        .use(["snapNotification", "snap.common.timeUtils", "snapHttp", "snapLoader", "eventaggregator", "snap.DataService.customerDataService", "snap.service.appointmentService",
            "snap.service.availabilityBlockService", "snap.hub.mainHub", "snap.hub.consultationsListingHub", "snap.hub.creditHub",
             "snap.patient.schedule.patientSelfSchedulingHub","snap.hub.notificationService", "snap.patient.patientEnterConsultationHelper",
            "snap.patient.patientReEnterConsultationHelper", "snap.patient.appointmentInProgressDialog",
            "snap.common.dialogWindow", "snap.common.timer", "snap.patient.patientResponseAddressDialog", "snap.helper.locationHelper", , "snap.common.overlay"])
        .extend(kendo.observable)
        .define("PatientHomeNewViewModel", function ($snapNotification, $timeUtils, $snapHttp, $snapLoader, $eventAggregator, $service, $appointmentService, $availabilityBlockService,
            $mainHub, $consultationsListingHub, $creditHub, $patientSelfSchedulingHub, $notificationService, $patientEnterConsultationHelper,
            $patientReEnterConsultationHelper, $appointmentInProgressDialog,
            $dialogWindow, $timer, $patientResponseAddressDialog,
            $locationHelper, $overlay) {
            var $scope = this;
            var timer = null;
            var HOUR_LIMIT = 12; // How only new in 12 hours
            var MINUTE_AVAILABLE = 30; // Before 30 minutes and after can start consultation
            var NO_ROOM_MINUTE_AVAILABLE = 5; // Before 5 minutes to start no-room consultations are put to the queue
            var appointmentInProgressDialog = null;

            var encounterTypeCode = snap.enums.EncounterTypeCode;

            var hubStart = function () {
                var date = new Date();
                date.setHours(0,0,0,0);
                $mainHub.register($consultationsListingHub);
                $mainHub.register($patientSelfSchedulingHub, {dateForListening: date, timeZoneSystemId: snap.userSession.timeZoneSystemId});
                $mainHub.register($creditHub);
                $consultationsListingHub.on("refreshConsultationsListings", function () {
                    loadData();
                });
                $patientSelfSchedulingHub.off("onRefreshState").on("onRefreshState", function() {
                    $scope.isOpenForBusiness();
                });
                $creditHub.on("onCreditChanged", function () {
                    $scope.checkForCredits();
                });
                $notificationService.on("message", function (messageType, message) {
                    var consultationId = +message;
                    window.console.debug("Message Type : " + messageType);
                    window.console.debug("Message value : " + consultationId);
                    if (messageType === "consultation_dropped") {
                        if (snap.consultationSession && typeof consultationId === "number" && snap.consultationSession.consultationId === consultationId) {
                            $snapNotification.info("The consultation expired.");
                            $scope.closePopup();
                            $scope._hasActiveConsultation = false;
                            $scope.trigger("change", {field: "isMoreScheduled"});
                            $scope.trigger("change", {field: "titleScheduled"});
                        }
                    } else if (messageType === "consultation_started") {
                        if (consultationId === $scope.activeConsultationId) {
                            $scope.patientObj.set("isInQueue", false);
                            $scope.patientObj.set("isInProgress", true);
                        } else {
                            // reload consultations to init banner
                            loadData();
                        }
                    } else if (messageType === "consultation_ended" && consultationId === $scope.activeConsultationId) {
                        $snapNotification.success("Consultation is ended.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                            $scope.trigger("change", {field: "isMoreScheduled"});
                            $scope.trigger("change", {field: "titleScheduled"});
                        }, 500);
                        loadData();
                    } else if (messageType === "consultation_dismissed" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("This consultation has been dismissed. If you feel this cancellation is in error, please contact your provider.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                            $scope.trigger("change", {field: "isMoreScheduled"});
                            $scope.trigger("change", {field: "titleScheduled"});
                        }, 500);
                        loadData();
                    } else if (messageType === "consultation_fulfilled" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("The Provider has marked your consultation as complete.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                            $scope.trigger("change", {field: "isMoreScheduled"});
                            $scope.trigger("change", {field: "titleScheduled"});
                        }, 500);
                        loadData();
                    }
                });
                $mainHub.start();
            };

            function ItemBase(item, appt) {
                this.id = item.account.patientId;
                this.firstName = item.patientName;
                this.lastName = item.lastName;
                this.imgSrc = item.account.profileImagePath || item.account.profileImage || global.getDefaultProfileImageForPatient();
                this.encounterTypeCode = appt.encounterTypeCode;

                this.isVideoType = false;
                this.isPhoneType = false;
                this.isTextType = false;
                this.isInPersonType = false;

                this._setEncounterType = function (typeCode) {
                    if (typeCode == encounterTypeCode.Video) {
                        this.isVideoType = true;
                    } else if (typeCode == encounterTypeCode.Phone) {
                        this.isPhoneType = true;
                    } else if (typeCode == encounterTypeCode.Text) {
                        this.isTextType = true;
                    } else if (typeCode == encounterTypeCode.InPerson) {
                        this.isInPersonType = true;
                    }
                };

                this._setEncounterType(appt.encounterTypeCode);
            }


            function Item(item, appt) {
                ItemBase.call(this, item, appt);

                this.startTime = appt.startTime;
                this.endTime = appt.endTime;
                this.apptTime = "@ " + global.GetFormattedTimeFromTimeStamp(this.startTime);
                this.expiryTime = appt.expiryTime;

                this.endWaitTime = "few seconds";

                this.isInQueue = !!appt.patientQueueId;
                this.isInProgress = false;
            }

            function ConsultationItem(item, consultation) {
                ItemBase.call(this, item, consultation);

                this.consultationDateInfo = consultation.consultationDateInfo;
                this.start = new Date(consultation.consultationDateInfo);
                this.apptTime = "@ " + global.GetFormattedTimeFromTimeStamp(this.consultationDateInfo);

                this.isInProgress = consultation.status === snap.consultationStatus.startedConsultation;
                this.isInQueue = !this.isInProgress;
            }

            this.activeConsultationId = null;
            this.availableConsultations = [];
            this.scheduledConsultations = [];
            this.notRoomActiveConsultations = []; // non-video consultations (thay are not held in consultation room). the closest of them is shown in banner
            this.nextschedConsult = null;
            this.hasScheduledConsult = false;
            this.patientObj = null;
            this._hasActiveConsultation = false;

            this.showMoreScheduledBlock = function() {
                return this._hasActiveConsultation || this.scheduledConsultations.length > 0;
            };
            this.isMoreScheduled = function() {
                return this.scheduledConsultations.length + this.notRoomActiveConsultations.length > 1;
            };
            this.isOnDemandLoaded = false;
            this.isScheduledLoaded = false;
            this.isLoading = function () {
                return !(this.get("isOnDemandLoaded") && this.get("isScheduledLoaded"));
            };
            this.isReadyState = false;
            this._updateCreditsVisibility = function () {
                $scope.set("isVisibleApptBadge", $scope.hasCredits && ($scope.isOnDemandEnabled || $scope.isSelfScheduleAvailable || $scope.hasScheduledConsult));
            };
            this.onViewProfileClick = function (e) {
                sessionStorage.setItem('snap_patientId_ref', e.data.patientObj.id);

                // User can see his own profile and dependents profiels.
                location.href = snap.profileSession.profileId === e.data.patientObj.id ? "/patient/User" : "/patient/Dependent";

                e.preventDefault();
                return false;
            };
            this.titleScheduled = function () {
                var itemCount = this.scheduledConsultations.length + this.notRoomActiveConsultations.length - 1;

                if (itemCount < 2) {
                    return ["There is <b>one</b> more appointment today"].join("");
                } else {
                    return ["There are <b>", itemCount, "</b> more appointments today "].join("");
                }
            };
            this.detailsBtn = function (e) {
                e.preventDefault();
                sessionStorage.setItem("snap_tabName_ref", "Scheduled");
                window.location.href = "/patient/PatientConsultations";
            };
            this.manageAccount = function () {
                window.location.href = "/patient/Users";
            };
            this.searchProviders = function () {
                window.location.href = "/patient/Main/#/selfScheduling";
            };
            this.isOnDemandEnabled = false;
            this.isOnDemandDisabled = false;
            this.nextOnDemandAvail = false;
            this.nextOnDemandAvailDate = "";
            this.contactNumber = snap.hospitalSession.contactNumber;
            this.contactNumberLink = function() {
                return "tel:+" + this.get("contactNumber");
            };
            this.isSelfScheduleEnabled = snap.hospitalSettings.providerSearch;
            this.isSelfScheduleAvailable = false;
            this.isSelfScheduleDisabled = function() {
                return !this.isSelfScheduleAvailable;
            };
            this.hasCredits = false;
            this.getCliniciansCards = function () {
                var filterDate = new Date();
                filterDate.setHours(0, 0, 0, 0);

                var filters = {
                    take: 0,
                    onlyMyProviders: false,
                    date: $timeUtils.dateToString(filterDate),
                    applyVisibilityRules: true,
                    availableOnly: false
                };
                return $service.getCliniciansCards(filters);
            };
            this.isProviderAvailable = function () {
                var $def = $.Deferred();
                if (this.isSelfScheduleEnabled) {
                    this.getCliniciansCards().done(function (response) {
                        $eventAggregator.published("isProviderAvailable", response.total > 0);
                        $scope.set("isSelfScheduleAvailable", response.total > 0);
                        $scope.trigger("change", { field: "isSelfScheduleDisabled" });
                        $def.resolve($scope.isSelfScheduleAvailable);
                    }).fail(function () {
                        if (!snap.isUnloading) { // workaround for FF specific issue (request is terminated with error when leaving the page)
                            $snapNotification.error("Self Scheduling not available.");
                            $def.resolve();
                        }
                    });
                }

                this._updateCreditsVisibility();
            };
            this.callOnDemand = function () {
                if (kendo.support.mobileOS !== false) {
                  //  snap.openMobileApp("", function () {
                        $scope.startIntakeForm();
                    //});
                    return;
                }
                this.startIntakeForm();
            };
            this.startIntakeForm = function () {

                if (kendo.support.browser && kendo.support.browser.edge === true) {
                    $snapNotification.info("Microsoft Edge Browser is not curently supported for consultation.Please use Chrome or Firefox.");
                    return;
                }
                window.location.href = "/patient/Intake/#/ChoosePatient";

            };



            this.isOpenForBusiness = function () {
                try {
                    $service.getOnDemand().done(function (response) {
                        var data = response.data[0];
                        var onDemandAvailable = false;
                        if (data.providerOnDemandEnabled) {
                            for (var i = 0, l = data.familyMembers.length; i < l ; i++) {
                                if (data.familyMembers[i].providerAvailable && data.familyMembers[i].isAuthorized) {
                                    onDemandAvailable = true;
                                    break;
                                }
                            }
                        }
                        $scope.set("isOnDemandEnabled", data.providerOnDemandEnabled);
                        $scope.set("isOnDemandDisabled", !onDemandAvailable);

                        if(!onDemandAvailable && data.availabilityBlockStartTime){
                            var nextOnDemandAvail = kendo.toString(new Date(data.availabilityBlockStartTime), "h:mmtt MMMM dd, yyyy");

                            $scope.set("nextOnDemandAvail", true);
                            $scope.set("nextOnDemandAvailDate", nextOnDemandAvail);
                        }


                        $scope._updateCreditsVisibility();
                    }).fail(function (xhr) {
                        if (xhr.status === 401) {
                            sessionStorage.setItem("snap_logoutError", "outside of Provider operating hours");
                          //  window.location = snap.patientLogin();
                        } else {
                            $snapNotification.error(xhr.d);
                        }
                    }).always(function () {
                        $scope.set("isOnDemandLoaded", true);
                    });
                } catch (err) {
                    $snapNotification.info("Error getting provider information.");
                    window.console.log(err);
                }

                this.isProviderAvailable();
            };
            this.isVisibleApptBadge = false;
            this.availCredits = 0;
            this.availCreditsTxt = "Appointment Credits";
            this.checkForCredits = function () {
                var that = this;
                $service.getPatientCredits(snap.profileSession.profileId).done(function (response) {
                    var credits = response.total;
                    that.hasCredits = credits > 0;
                    if (credits > 0) {
                        that.set("availCredits", credits);
                        that.set("availCreditsTxt", credits === 1 ? "Appointment Credit" : "Appointment Credits");
                    }
                    that._updateCreditsVisibility();
                }).fail(function (xhr) {
                    snap.util.logToConsole(xhr);
                });
            };
            this.closePopup = function () {
                var currentDialog = $('#popup-container').data("kendoWindow");

                if (currentDialog) {
                    currentDialog.close();
                }
            };

            var checkLocation = function() {
                var dfd = $.Deferred();
                if(sessionStorage.getItem("snap_locationWasChecked") === "true") {
                    dfd.resolve();
                } else {
                    $service.isResponseRulesActive().done(function (isActive) {
                        if (isActive.active) {
                            $service.getDefaultPatientProfileDetails("all").done(function (data) {
                                var dialog = $dialogWindow.createNewDialog({
                                    vm: $patientResponseAddressDialog,
                                    container: "#patientResponseAddressPopUpContainer",
                                    contentPath: "/content/patient/patientResponseAddressDialog.html",
                                    required: true
                                });

                                dialog.open({
                                    patientId: snap.profileSession.profileId,
                                    userId: snap.profileSession.profileId,
                                    currentLocationText: $locationHelper.getEncounterAddressTextFromPatientProfile(data.data[0]),
                                    currentLocation: $locationHelper.getEncounterAddressLocationFromPatientProfile(data.data[0]),
                                    imageSource: snap.profileSession.profileImage,
                                    fullName: snap.profileSession.fullName,
                                    firstName: snap.profileSession.firstName
                                }).done(function() {
                                    // If the Window has no set dimensions and is centered before its content is loaded with Ajax, it is probably going to resize after the content is loaded.
                                    // This naturally changes the position of the widget on the screen and it is no longer centered.
                                    dialog.rCenter();
                                });
                                $eventAggregator.subscribe("patientResponseDialog_locationConfirmed", function(){
                                    dfd.resolve();
                                    sessionStorage.setItem("snap_locationWasChecked", true);
                                });
                            }).fail(function() {
                                $snapNotification.error("Failed to load profile details");
                                dfd.resolve();
                            });
                        } else {
                            dfd.resolve();
                            sessionStorage.setItem("snap_locationWasChecked", true);
                        }
                    }).fail(function(xhr, status, error) {
                        window.console.error("Response rules API failure" + error);
                        $snapNotification.error("Failed to check response rules");
                        dfd.resolve();
                    });
                }
                return dfd.promise();
            };

            var checkForReenterWaiting = function() {
                var dfd = $.Deferred();
                $service.getAvailableWaitingConsultation().done(function(response) {
                    var availableWaiting = response.data;
                    if (availableWaiting.length) {
                        if (!appointmentInProgressDialog) {
                            appointmentInProgressDialog = $dialogWindow.createNewDialog({
                                vm: $appointmentInProgressDialog,
                                container: "#appointmentInProgressContainer",
                                contentPath:
                                    "/content/patient/appointmentInProgressDialog.html?svp=snapversion",
                                required: true
                            });
                        }
                        appointmentInProgressDialog.open(availableWaiting[0]);
                        $eventAggregator.subscribe("appointmentInProgressDialog_dialogClosed", function() {
                            dfd.resolve();
                        });
                    } else {
                        dfd.resolve();
                    }
                }).fail(function(xhr, status, error) {
                    window.console.error("AvailableWaiting API failure" + error);
                    $snapNotification.error("Failed to check available waiting consultations");
                    dfd.resolve();
                });
                return dfd.promise();
            };

            this.isMoreAvailToEnterConsults = false;
            this.availableToEnterConsults = [];
            this.processAvailableToEnterConsultations = function () {
                var schedConsultData = $scope.scheduledConsultations,
                    availToEnterConsultData = [];

                //get a list of consults that are available now.
                if (schedConsultData.length > 1) {
                    for (var i = 0; schedConsultData.length - 1 > i; i++) {
                        var schedConsultEnterTime = Math.floor((new Date(schedConsultData[i].startTime).getTime() - $scope.loadTime) / (1000 * 60)) - MINUTE_AVAILABLE;
                        if (schedConsultEnterTime >= -30 && schedConsultEnterTime <= 0) {
                            availToEnterConsultData.push(schedConsultData[i]);
                        }
                    }

                    $scope.set("isMoreAvailToEnterConsults", availToEnterConsultData.length > 0);
                }

                this.set("availableToEnterConsults", availToEnterConsultData);
            };

            var startAppointmentExpirationTimer = function (time) {
                if (timer) {
                    timer.stop();
                    timer = null;
                }
                timer = $timer.createTimer({
                    countDown: true,
                    time: time,
                    onTimerTickCallback: function (timerTick) {
                        if (timerTick.original.hours <= 0 && timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                            timer.stop();
                            timer = null;
                            $snapNotification.info("The appointment has expired. Reloading data");
                            loadData();
                        }
                    }
                });
                timer.start();
            };

            this._stopTimer = function() {
                if (timer) {
                    timer.stop();
                    timer = null;
                }
            };

            this._startTimer = function () {
                $scope.set("isReadyState", false);
                if ($scope.patientObj) {
                    if (timer) {
                        timer.stop();
                        timer = null;
                    }
                    var scheduledTime = new Date($scope.patientObj.startTime);
                    var restTime = Math.floor((scheduledTime.getTime() - $scope.loadTime.getTime()) / 1000);
                    if ($scope.patientObj.encounterTypeCode === encounterTypeCode.Video) {
                        restTime -= MINUTE_AVAILABLE * 60;
                    } else {
                        restTime -= NO_ROOM_MINUTE_AVAILABLE * 60;
                    }
                    if (restTime >= 0 && !$scope.patientObj.isInQueue) {
                        timer = $timer.createTimer({
                            countDown: true,
                            time: restTime,
                            onTimerTickCallback: function (timerTick) {
                                if (timerTick.original.hours <= 0 && timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                                    // now can enter appointment
                                    timer.stop();
                                    timer = null;
                                    setReadyState();
                                    startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60);
                                } else {
                                    $scope.patientObj.set("endWaitTime", [timerTick.formatted.hours, timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                                }
                            }
                        });
                        timer.start();
                    } else {
                        // appointment should be already available
                        setReadyState();
                        startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60 + restTime);
                    }
                }
            };

            function setReadyState () {
                if ($scope.patientObj.isPhoneType || $scope.patientObj.isTextType) {
                    $scope.patientObj.set("endWaitTime", "few seconds");
                    $scope.set("isReadyState", $scope.patientObj.isInQueue);
                    $scope._goToSchedConsult($scope.nextschedConsult);
                } else {
                    $scope.set("isReadyState", true);
                }
            }

            this.loadingConsult = false;

            this.enterSchedConsult = function (e) {
                var that = this;
                if (kendo.support.mobileOS !== false) {
                  //  snap.openMobileApp("", function () {
                        that._goToSchedConsult(that.nextschedConsult);
                  //  });
                   return;
                }
                else {
                    e.preventDefault();
                    this._goToSchedConsult(this.nextschedConsult);
                }
            };
            this._goToSchedConsult = function(consultation) {
                $patientEnterConsultationHelper.enterConsultation(consultation).fail(function(isLoadingConsultation) {
                    if (!isLoadingConsultation) {
                        loadData();
                    }
                });
            };

            this._initHomePageBanner = function(allConsultations) {
                if (allConsultations.length) {
                    var consultationData = null;
                    if (allConsultations.length > 1) {
                        // search consultations in progress
                        var inProgressConsultations = allConsultations.filter(function(consultation) {
                            return consultation.status === snap.consultationStatus.startedConsultation;
                        });
                        // if there is no consultation in progress, take all consultations
                        var dataToSort = inProgressConsultations.length ? inProgressConsultations : allConsultations;

                        // search the closest consultation
                        dataToSort.sort(function(cons1, cons2) {
                            return new Date(cons1.consultationDateInfo) > new Date(cons2.consultationDateInfo);
                        });
                        consultationData = dataToSort[0];
                    } else {
                        consultationData = allConsultations[0];
                    }

                    this._stopTimer();

                    $service.getPatientProfileDetails(consultationData.patientId, "all").done(function (res) {
                        $scope._hasActiveConsultation = true;
                        $scope.activeConsultationId = consultationData.consultationId;
                        $scope.set("isReadyState", true);

                        var patientObj = res.data[0];
                        patientObj = kendo.observable(new ConsultationItem(patientObj, consultationData));
                        $scope.set("patientObj", patientObj);
                        $scope.trigger("change", {field: "showMoreScheduledBlock"});
                        $scope.trigger("change", {field: "isMoreScheduled"});
                        $scope.trigger("change", {field: "titleScheduled"});
                    });
                }
            };


            var loadData = function () {
                $scope.notRoomActiveConsultations = [];
                $.when($service.getAvailableConsultation(), $service.getScheduledConsultation())
                    .then(function (availableConsultationData, schedDate) {
                        $scope.hasScheduledConsult = false;
                        $scope.loadTime = new Date();
                        var availableConsultData = availableConsultationData[0].data,
                            schedConsultData = schedDate[0].data;

                        if (availableConsultData) {
                            var availableConsultations = [];
                            $.each(availableConsultData, function (index, value) {
                                if (value.encounterTypeCode === encounterTypeCode.Phone) {
                                    $scope.notRoomActiveConsultations.push(value);
                                } else if (value.status === snap.consultationStatus.startedConsultation && (value.doctorStatus === 0 || value.patientStatus === 4 || value.doctorStatus === 2)) {
                                    return;
                                }

                                availableConsultations.push(value);

                            });
                            $scope._initHomePageBanner($scope.notRoomActiveConsultations);
                            $scope.set("availableConsultations", availableConsultations);
                        }

                        $.each(schedConsultData, function (index, value) {
                            value.scheduledTime = new Date(value.startTime);
                            value.endTime = new Date(value.endTime);
                            value.expiryTime = Math.floor((value.scheduledTime.getTime() - $scope.loadTime.getTime()) / 1000);
                        });

                        // Filter available to enter scheduled consultations
                        var expDate = new Date();
                        expDate.setTime(expDate.getTime() + (HOUR_LIMIT * 60 * 60 * 1000));
                        schedConsultData = schedConsultData.filter(function (v) {
                            return v.expiryTime < HOUR_LIMIT * 60 * 60;
                        });

                        $scope.set("scheduledConsultations", schedConsultData);
                        $scope.trigger("change", {field: "isMoreScheduled"});
                        $scope.trigger("change", {field: "titleScheduled"});


                        //get provider's details for next scheduled appt
                        var nextschedConsult = schedConsultData.length > 0 ? schedConsultData[schedConsultData.length - 1] : null;
                        $scope.set("nextschedConsult", nextschedConsult);

                        if ($scope.nextschedConsult && !$scope._hasActiveConsultation) {
                            $scope.hasScheduledConsult = true;
                            $service.getPatientProfileDetails($scope.nextschedConsult.patientId, "all").then(function (res) {
                                if (!$scope._hasActiveConsultation) {
                                    // need to check again because active consultation might initiate during getPatientProfileDetails request
                                    var patientObj = res.data[0];
                                    patientObj = kendo.observable(new Item(patientObj, nextschedConsult));
                                    $scope.set("patientObj", patientObj);
                                    $scope._startTimer();
                                }

                            });
                        }
                        $scope.processAvailableToEnterConsultations();
                        $scope._updateCreditsVisibility();
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                        }, 3000);
                    })
                    .always(function () {
                        $scope.set("isScheduledLoaded", true);
                    });
            };

            this.loadData = function () {
                hubStart();
                var that = this;

                function loadPageDetails() {
                    loadData();
                    that.isOpenForBusiness();
                }

                // check all possible dialogs consequentially
                $patientReEnterConsultationHelper.checkForReEntryConsultation().always(function() {
                    checkForReenterWaiting().always(function() {
                        // check location only if no reenter occured
                        checkLocation().always(function() {
                            // start loading data after location check
                            loadPageDetails();
                        });
                    })
                });
            };

            this.dispose = function() {
                this._stopTimer();
            };
        });

}(jQuery, snap, kendo, window));

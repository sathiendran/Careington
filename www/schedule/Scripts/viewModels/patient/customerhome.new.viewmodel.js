/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />

//@ sourceURL=customerhome.new.viewmodel.js
; (function ($, snap, kendo) {
    "use strict";
    snap.namespace("Snap.Patient")
        .use(["snapNotification", "snapHttp", "snapLoader", "eventaggregator", "snap.DataService.customerDataService", "snap.service.appointmentService",
            "snap.service.availabilityBlockService", "snap.hub.mainHub", "snap.hub.consultationsListingHub", "snap.hub.creditHub", "snap.patient.PatientHeaderViewModel",
            "snap.hub.notificationService",
            "snap.clinician.patientQueue.reEnterConsultationDialog",
            "snap.common.dialogWindow", "snap.common.timer", "snap.patient.patientResponseAddressDialog"])
        .extend(kendo.observable)
        .define("PatientHomeNewViewModel", function ($snapNotification, $snapHttp, $snapLoader, $eventAggregator, $service, $appointmentService, $availabilityBlockService,
            $mainHub, $consultationsListingHub, $creditHub, $patientHeaderVM, $notificationService,
            $reEnterConsultationDialog,
            $dialogWindow, $timer, $patientResponseAddressDialog) {
            var $scope = this;
            var timer = null;
            var HOUR_LIMIT = 12; // How only new in 12 hours
            var MINUTE_AVAILABLE = 30; // Before 30 minutes and after can start consultation
            var NO_ROOM_MINUTE_AVAILABLE = 5; // Before 5 minutes to start no-room consultations are put to the queue
            var notifyCinicianDialog = null;

            var encounterTypeCode = snap.enums.EncounterTypeCode;

            var hubStart = function () {
                $mainHub.register($consultationsListingHub);
                $consultationsListingHub.on('refreshConsultationsListings', function () {
                    loadData();
                });
                $mainHub.register($creditHub);
                $creditHub.on("onCreditChanged", function () {
                    $scope.checkForCredits();
                });
                $notificationService.on("message", function (messageType, message) {
                    var consultationId = +message;
                    console.debug("Message Type : " + messageType);
                    console.debug("Message value : " + consultationId);
                    if (messageType === "consultation_dropped") {
                        if (snap.consultationSession && typeof consultationId === "number" && snap.consultationSession.consultationId === consultationId) {
                            $snapNotification.info("The consultation expired.");
                            $scope.closePopup();
                            $scope._hasActiveConsultation = false;
                        }
                        return;
                    }
                    if (messageType === "consultation_started") {
                        if (consultationId === $scope.activeConsultationId) {
                            $scope.patientObj.set("isInQueue", false);
                            $scope.patientObj.set("isInProgress", true);
                        } else {
                            var consultationData = $scope.availableConsultation.find(function(item) {
                                return item.consultationId == consultationId
                            });
                            if (consultationData) {
                                // init banner with started consultation
                                consultationData.status = snap.consultationStatus.startedConsultation;
                                $scope._initHomePageBanner(consultationData);
                            } else {
                                // reload consultations to init banner
                                loadData();
                            }
                        }
                        return;
                        
                    }
                    if (messageType === "consultation_ended" && consultationId === $scope.activeConsultationId) {
                        $snapNotification.success("Consultation is ended.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                        }, 500);
                        loadData();
                        return;
                    }
                    if (messageType === "consultation_dismissed" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("This consultation has been dismissed. If you feel this cancellation is in error, please contact your provider.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                        }, 500);
                        loadData();
                        return;
                    }

                    if (messageType === "consultation_fulfilled" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("The Provider has marked your consultation as complete.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                        }, 500);
                        loadData();
                        return;
                    }
                });
                $mainHub.start();
            };

            function ItemBase(item, appt) {
                this.id = item.account.patientId;
                this.firstName = item.patientName;
                this.lastName = item.lastName;
                this.imgSrc = item.account.profileImagePath || item.account.profileImage || getDefaultProfileImageForPatient();
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
                this.apptTime = "@ " + GetFormattedTimeFromTimeStamp(this.startTime);
                this.expiryTime = appt.expiryTime;

                this.endWaitTime = "0:0:0";

                this.isInQueue = false;
                this.isInProgress = false;
            }

            function ConsultationItem(item, consultation) {
                ItemBase.call(this, item, consultation);

                this.consultationDateInfo = consultation.consultationDateInfo;
                this.start = new Date(consultation.consultationDateInfo);
                this.apptTime = "@ " + GetFormattedTimeFromTimeStamp(this.consultationDateInfo);

                this.isInProgress = consultation.status === snap.consultationStatus.startedConsultation;
                this.isInQueue = !this.isInProgress;
            }

            this.activeConsultationId = null;

            this.patientObj = null;

            this._hasActiveConsultation = false;
            this.showMoreScheduledBlock = function() {
                return this._hasActiveConsultation || this.scheduledConsultation.length > 0;
            };

            this.isReadyState = false;
            this.isMoreScheduled = false;
            this._updateCreditsVisibility = function () {
                $scope.set("isVisibleApptBadge", $scope.hasCredits && ($scope.isOnDemandAvailable || $scope.isSelfScheduleAvailable || $scope.hasScheduledConsult));
            };
            this.onViewProfileClick = function (e) {
                sessionStorage.setItem('snap_patientId_ref', e.data.patientObj.id);
                location.href = "/Customer/User";

                e.preventDefault();
                return false;
            };
            this.titleScheduled = function () {

                var itemCount = this.get("scheduledConsultation").length - 1;

                if (itemCount < 2) {
                    return ["There is <b>one</b> more appointment today"].join("");
                } else {
                    return ["There are <b>", itemCount, "</b> more appointments today "].join("");
                }
            };
            this.detailsBtn = function (e) {
                e.preventDefault();
                sessionStorage.setItem("snap_tabName_ref", "Scheduled");
                window.location.href = "/Customer/PatientConsultations";
            };
            this.manageAccount = function () {
                window.location.href = "/Customer/Users";
            };
            this.searchProviders = function () {
                window.location.href = "/Customer/Main/#/selfScheduling";
            };
            this.isOnDemandAvailable = false;
            this.isSelfScheduleAvailable = false;
            this.hasCredits = false;
            this.isProviderAvailable = function () {
                $scope.set("isSelfScheduleAvailable", $patientHeaderVM.isSelfScheduleAvailable);
                $scope._updateCreditsVisibility();
            };
            this.callOnDemand = function () {
                if (kendo.support.mobileOS !== false) {
                    snap.openMobileApp("", function () {
                        $scope.startIntakeForm();
                    });
                    return;
                }
                this.startIntakeForm();
            };
            this.startIntakeForm = function () {

                if (kendo.support.browser && kendo.support.browser["edge"] === true) {
                    $snapNotification.info("Microsoft Edge Browser is not curently supported for consultation.Please use Chrome or Firefox.");
                    return;
                }
                window.location.href = "/Customer/Intake/#/ChoosePatient";

            };



            this.IsOpenForBusiness = function () {
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
                        $scope.set("isOnDemandAvailable", data.providerOnDemandEnabled && onDemandAvailable);
                        $scope._updateCreditsVisibility();
                    }).fail(function (xhr) {
                        if (xhr.status === 401) {
                            sessionStorage.setItem("snap_logoutError", "outside of Provider operating hours");
                            window.location = snap.patientLogin();
                        } else {
                            $snapNotification.error(xhr.d);
                        }
                    });
                } catch (err) {
                    $snapNotification.info("Error getting provider information.");
                    window.console.log(err);
                }
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
                }).fail(function (xhr, status, error) {
                    console.log("Credit Failure");
                });
            };
            this.closePopup = function () {
                var currentDialog = $('#popup-container').data("kendoWindow");

                if (currentDialog) {
                    currentDialog.close();
                }
            };

            this.checkForReEntryConsultation = function () {
                var that = this;

                $service.getActiveConsultations().done(function (response) {
                    var tdata = response.total;

                    if (tdata > 0) {
                        var activeConnection;
                        response.data.forEach(function (connectionModel) {
                            if (connectionModel.status === snap.consultationStatus.startedConsultation && connectionModel.encounterTypeCode === encounterTypeCode.Video) {
                                activeConnection = connectionModel;
                            }
                        });

                        if (activeConnection) {
                            // todo: if audio or chat type, show it in progress? if video type then show dialog
                            if (notifyCinicianDialog === null) {
                                notifyCinicianDialog = $dialogWindow.createNewDialog({
                                    vm: $reEnterConsultationDialog,
                                    container: "#reEnterPopUpContainer",
                                    contentPath: "/content/clinician/patientQueue/reEnterConsultation.html?svp=snapversion"
                                });
                            }

                            notifyCinicianDialog.open({
                                consultationId: activeConnection.consultationId,
                                patientId: activeConnection.patientId,
                                userType: 2,
                                meetingId: activeConnection.meetingId,
                                personId: activeConnection.patientPersonId
                            });
                        }
                    }
                }).fail(function (xhr, status, error) {
                    window.console.error("Consult API failure" + error);
                });
            };
            this.isMoreAvailConsults = false;
            this.availConsults = [];
            this.processAvailableConsultations = function () {
                var schedConsultData = $scope.scheduledConsultation,
                    availConsultData = [];

                //get a list of consults that are available now.
                if (schedConsultData.length > 1) {
                    for (var i = 0; schedConsultData.length - 1 > i; i++) {
                        var schedConsultEnterTime = Math.floor((new Date(schedConsultData[i].startTime).getTime() - $scope.loadTime) / (1000 * 60)) - MINUTE_AVAILABLE;

                        schedConsultEnterTime >= -30 && schedConsultEnterTime <= 0 ? availConsultData.push(schedConsultData[i]) : null;
                    }

                    $scope.set("isMoreAvailConsults", availConsultData.length > 0);
                }

                this.set("availConsults", availConsultData);

                //if more appointments are avialble, show info box

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
                    if (restTime >= 0) {
                        timer = $timer.createTimer({
                            countDown: true,
                            time: restTime,
                            onTimerTickCallback: function (timerTick) {
                                if (timerTick.original.hours <= 0 && timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                                    // now can enter appointment
                                    timer.stop();
                                    timer = null;
                                    $scope.set("isReadyState", true);
                                    if ($scope.patientObj.isPhoneType || $scope.patientObj.isTextType) {
                                        $scope.patientObj.set("isInQueue", true);
                                        $scope._goToSchedConsult($scope.nextschedConsult);
                                    }
                                    startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60);
                                } else {
                                    $scope.patientObj.set("endWaitTime", [timerTick.formatted.hours, timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                                }
                            }
                        });
                        timer.start();
                    } else {
                        // appointment is already available
                        $scope.set("isReadyState", true);
                        if ($scope.patientObj.isPhoneType || $scope.patientObj.isTextType) {
                            $scope.patientObj.set("isInQueue", true);
                            $scope._goToSchedConsult($scope.nextschedConsult);
                        }
                        startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60 + restTime);
                    }
                }
            };

            this.loadingConsult = false;

            this.enterSchedConsult = function (e) {
                e.preventDefault();
                this.set("loadingConsult", true);
                this._goToSchedConsult(this.nextschedConsult);
            };
            this.goToSchedConsultInternal = function (data, callback) {
                this._goToSchedConsult(data, true, callback);
            };
            this._goToSchedConsult = function (data, isInternal, callback) {
                var appointmentId = data.appointmentId,
                    participants = data.participants,
                    patientParticipant = null,
                    patientId = data.patientId;

                if (isEmpty(patientId)) {
                    this.set("loadingConsult", false);
                    $snapNotification.error("Patient Loading Error");
                    return;
                }
                $.each(participants, function () {
                    if (this.participantTypeCode === 1) {
                        patientParticipant = this;
                    }
                });
                var personId = patientParticipant.person.id;
                var startTime = data.startTime;
                if (!patientParticipant) {
                    this.set("loadingConsult", false);
                    $snapNotification.error("Patient Loading Error");
                    return;
                }

                $service.createConsultationFromAppointment(personId, appointmentId).then(function (data) {

                    if (data) {
                        var respData = data.data[0];
                        var newConsultationId = respData.consultationId;

                        if (parseInt(newConsultationId) > 0) {

                            $appointmentService.getConsultationById(newConsultationId).done(function (resp) {
                                if (resp.data && resp.data.length > 0) {
                                    var consultationData = resp.data[0].consultationInfo;
                                    var consultationAmount = consultationData.consultationAmount || 0;
                                    var patientInformation = resp.data[0].patientInformation;
                                    snap.setSnapConsultationSessionData({
                                        consultationId: newConsultationId,
                                        patientId: patientId,
                                        personId: personId,
                                        patientParticipant: patientParticipant,
                                        isScheduled: true,
                                        totalSteps: 3,
                                        currentStep: 0,
                                        consultationAmount: consultationAmount,
                                        patientQueueEntryId: respData.patientQueueEntryId,
                                        meetingId: respData.meetingId
                                    });

                                    if (callback && callback.call) {
                                        callback.call();
                                    }
                                    if (consultationData.encounterTypeCode === encounterTypeCode.Phone) {
                                        var consultationInfo = {
                                            consultationId: consultationData.id,
                                            status: consultationData.consultationStatus,
                                            patientId: patientInformation.patientId,
                                            encounterTypeCode: consultationData.encounterTypeCode,
                                            consultationDateInfo: startTime
                                        }
                                        $scope._initHomePageBanner(consultationInfo);
                                        if (isInternal) {
                                            location.href = "/Customer/Main/#/Home";
                                        } else {
                                            return;
                                        }
                                    } else if (snap.hospitalSettings.showCTTOnScheduled) {
                                        location.href = "/Customer/Intake/#/Confirmation";
                                    } else if (snap.hospitalSettings.insuranceBeforeWaiting) {
                                        location.href = "/Customer/Intake/#/Insurance";
                                    } else if (snap.hospitalSettings.eCommerce && consultationAmount > 0 && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom) {
                                        location.href = "/Customer/Intake/#/Payment";
                                    } else {
                                        if (kendo.support.mobileOS) {
                                            snap.openMobileApp(parseInt(newConsultationId), function () {
                                                sessionStorage.setItem("consultationinitaction", "1");
                                                location.href = "/Customer/Main/#/Waiting";
                                            });
                                            return;
                                        }
                                        sessionStorage.setItem("consultationinitaction", "1");
                                        location.href = "/Customer/Main/#/Waiting";
                                    }
                                }
                            });


                        }
                    }

                }, function (error) {
                    if (error.status === 409) {
                        $snapNotification.error("The consultation is already in progress");
                    } else {
                        $snapNotification.error(error.responseText);
                    }
                    if (!isInternal) {
                        $scope.set("loadingConsult", false);
                        loadData();
                    }
                });
            };

            this._initHomePageBanner = function(consultationData) {
                var isConsultStarted = consultationData.status === snap.consultationStatus.startedConsultation;
                if ($scope._hasActiveConsultation) {
                    if ($scope.patientObj.isInProgress) {
                        // we should not reset banner if there is any consultation in progress
                        return;
                    } else if (!isConsultStarted) {
                        var startDate = new Date(consultationData.consultationDateInfo);
                        if ($scope.patientObj.start <= startDate) {
                            // we should not reset banner if there is earlier or the same time queueing consultation
                            return;
                        }
                    }
                }

                
                if (timer) {
                    timer.stop();
                    timer = null;
                }
                $service.getPatientProfileDetails(consultationData.patientId, "all").done(function (res) {
                    $scope._hasActiveConsultation = true;
                    $scope.activeConsultationId = consultationData.consultationId;
                    $scope.set("isReadyState", true);

                    var patientObj = res.data[0];
                    patientObj = kendo.observable(new ConsultationItem(patientObj, consultationData));
                    $scope.set("patientObj", patientObj);
                    $scope.trigger("change", {field: "showMoreScheduledBlock"});
                });
            };


            this.availableConsultation = [];
            this.scheduledConsultation = [];
            this.nextschedConsult = null;
            this.hasScheduledConsult = false;
            var loadData = function () {
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
                                    $scope._initHomePageBanner(value);
                                } else if (value.status === snap.consultationStatus.startedConsultation && (value.doctorStatus === 0 || value.patientStatus === 4 || value.doctorStatus === 2)) {
                                    return;
                                }

                                availableConsultations.push(value);

                            });

                            $scope.set("availableConsultation", availableConsultations);
                        }
                  


                        //Consultation should not be displayed in both Available and Scheduled lists.
                        //So if consultation in Available list we exclude it from Scheduled list.

                        //Becuase now schedule comes from appointment and available is consulation 


                        $.each(schedConsultData, function (index, value) {
                            value.scheduledTime = new Date(value.startTime);
                            value.endTime = new Date(value.endTime);
                            value.expiryTime = Math.floor((value.scheduledTime.getTime() - $scope.loadTime.getTime()) / 1000);
                        });


                        var expDate = new Date();
                        expDate.setTime(expDate.getTime() + (HOUR_LIMIT * 60 * 60 * 1000));
                        schedConsultData = schedConsultData.filter(function (v) {
                            return v.expiryTime < HOUR_LIMIT * 60 * 60;
                        });

                        $scope.set("scheduledConsultation", schedConsultData);
                        $scope.set("isMoreScheduled", schedConsultData.length > 1);


                        //get provider's details for next scheduled appt
                        var nextschedConsult = schedConsultData.length > 0 ? schedConsultData[schedConsultData.length - 1] : null;
                        $scope.set("nextschedConsult", nextschedConsult);

                        if ($scope.nextschedConsult && !$scope._hasActiveConsultation) {
                            $scope.hasScheduledConsult = true;
                            $service.getPatientProfileDetails(nextschedConsult.patientId, "all").then(function (res) {
                                if (!$scope._hasActiveConsultation) {
                                    // need to check again because active consultation might initiate during getPatientProfileDetails request
                                    var patientObj = res.data[0];
                                    patientObj = kendo.observable(new Item(patientObj, nextschedConsult));
                                    $scope.set("patientObj", patientObj);
                                    $scope._startTimer();
                                }
                                
                            });
                        }
                        $scope.processAvailableConsultations();
                        $scope._updateCreditsVisibility();
                        setTimeout(function () {
                            $scope.trigger("change", {field: "showMoreScheduledBlock"});
                        }, 3000);
                    });
            };

            this.loadData = function () {
                hubStart();
                var that = this;

                if(sessionStorage.getItem("snap_locationWasChecked") === "true") {
                    loadPageDetails();
                } else {
                    $service.isResponseRulesActive().done(function (isActive) {
                        if (isActive.active) {
                            $service.getDefaultPatientProfileDetails("all").done(function (data) {
                                var dialog = $dialogWindow.createNewDialog({
                                    vm: $patientResponseAddressDialog,
                                    container: "#patientResponseAddressPopUpContainer",
                                    contentPath: "/content/patient/patientResponseAddressDialog.html"
                                });

                                dialog.open({
                                    patientId: snap.profileSession.profileId,
                                    userId: snap.profileSession.profileId,
                                    patientProfile: data.data[0]
                                }).done(function() {
                                    // If the Window has no set dimensions and is centered before its content is loaded with Ajax, it is probably going to resize after the content is loaded. 
                                    // This naturally changes the position of the widget on the screen and it is no longer centered. 
                                    dialog.rCenter();
                                });
                            });
                        } else {
                            loadPageDetails();
                            sessionStorage.setItem("snap_locationWasChecked", true);
                        }
                    });

                    $eventAggregator.subscribe("patientResponseDialog_locationConfirmed", function(){
                        loadPageDetails();
                        sessionStorage.setItem("snap_locationWasChecked", true);
                    });
                }

                
                function loadPageDetails() {
                    loadData();
                    that.IsOpenForBusiness();
                    $patientHeaderVM.isProviderAvailable().done(function() {
                            that.isProviderAvailable()
                    });
                }
            };
        });

}(jQuery, snap, kendo));
//@ sourceURL=encounter.viewmodel.js

/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />
"use strict";
; (function (snap, kendo, $, global) {
    var app = snap.resolveObject("app");

    var encounterRoomViewModel = function (
        $snapNotification, 
        $eventaggregator, 
        $appointmentService, 
        $patientViewModel, 
        $mainHub, 
        $consultationHub, 
        $clinicianHeaderViewModel,
        $userConsultationChat,
        $contentLoader,
        $messages,
        $meetingHub) {

        this.$snapNotification = $snapNotification;
        this.$eventaggregator = $eventaggregator;
        this.$appointmentService = $appointmentService;
        this.$patientViewModel = $patientViewModel;
        this.$mainHub = $mainHub;
        this.$consultationHub = $consultationHub;
        this.$clinicianHeaderViewModel = $clinicianHeaderViewModel;
        this.$userConsultationChat = $userConsultationChat;
        this.$contentLoader = $contentLoader;
        this.$consultationMessages = $messages.consultationMessages;
        this.$meetingHub = $meetingHub;
       
        this.detailsTab = true;
        this.infoPanel = false;
        this.mobileInfoPanel = false;
        this.isfileSharingEnable = false;
        this.isMessaging = false;
        this.isBetaVideo = false;
        this.consultationId = null;
        this.consultationInfomation = null;
        this.patientInfo = null;
        this.sessionTime = "00:00";
        this.consultButtonTitle = "End Session";

        this._notifyPatientDisconnectTimeout = null;

        this.hidePatientProfile = function(){
            return snap.hospitalSettings["integrations.AthenaHealthHidePatientProfile"] === "true";
        };
        
        this.subscribeToEvents();
       
    };
    encounterRoomViewModel.prototype.subscribeToEvents = function() {
        var that = this;
        this.$eventaggregator.subscriber("forceLogout", function() {
            that.$mainHub.stop();
        });
        this.$eventaggregator.subscriber("endSession", function() {
            that.endSession();
        });
    };
    encounterRoomViewModel.prototype.toggleDetailsTab = function (e) {
        if (e)
            e.preventDefault();
        this.set("detailsTab", !this.detailsTab);
    };
    encounterRoomViewModel.prototype.toggleMobileInfoPanel = function(e){
        if (e)
            e.preventDefault();
        this.set("infoPanel", !this.infoPanel);
        this.set("mobileInfoPanel", !this.mobileInfoPanel);
    };
    encounterRoomViewModel.prototype.cleanup = function() {
        if (this._notifyPatientDisconnectTimeout) {
            window.clearTimeout(this._notifyPatientDisconnectTimeout);
            this._notifyPatientDisconnectTimeout = null;
        }
        this.$eventaggregator.unSubscribe("endSession");
        this.stopTimer(true);
        this.$mainHub.stop();
        this.$consultationHub.off(); // remove all subscriptions
        this.$consultationHub.cleanup();
        this.$userConsultationChat.cleanup();
    };
    encounterRoomViewModel.prototype.loadData = function (pageType) {
        var _this = this;
        _this.pageType = pageType;
        this.stopTimer(true);

        this.consultationId = snap.consultationSession.consultationId;
        this.meetingId = snap.consultationSession.meetingId;
        this.$patientViewModel.init(snap.ParticipantType.Physician).done(function() {
            _this.$patientViewModel.load();
        });
        this.$appointmentService.getAppointment(this.consultationId).then(function (result) {
            if (result) {
                _this.set("consultationInfomation", result.data[0].consultationInfo);
                _this.set("patientInfo", result.data[0].patientInformation);
                
                snap.consultationSession.meetingId = result.data[0].meetingId;
                if (_this.consultationInfomation) {
                    if (_this.consultationInfomation.statusId == snap.consultationStatus.endedConsultation) {
                        _this.$snapNotification.info("This consultation has already completed.");
                        setTimeout(function () {
                            location.replace(snap.getClinicianHome());
                        }, 1000);
                        return;

                    }
                    _this.$patientViewModel.setAppointmentData(result.data);
                    _this._initHub();
                }
                else {
                    _this.$snapNotification.error("consultation not found");
                    setTimeout(function () {
                        location.replace(snap.getClinicianHome());
                    }, 1000);
                    return;
                }
            }
        });

    };
    encounterRoomViewModel.prototype.initControl = function ($vm) {
        kendo.bind($("#encounter-rm-container"), $vm);
        kendo.bind($("#left-col-tabs"), this.$patientViewModel);
        kendo.bind($("#right-col-tabs"), this.$patientViewModel);
        kendo.bind($("#consult-room-top-header"), this.$patientViewModel);
        
        $("#left-col-tabs").kendoTabStrip({
            animation: false
        }).data("kendoTabStrip");
        
        var tabsright = $("#right-col-tabs").kendoTabStrip({
            animation: false,
            select: function (ee) {
                if ($(ee.item).hasClass("ePrescribe")) {
                    ee.preventDefault();
                    var consultationId = snap.consultationSession
                        ? snap.consultationSession.consultationId
                        : snap.consultationId;
                    window.open(snap.string.formatURIComponents('/redirection?type=5&token={0}&consultationId={1}&from=physician', snap.userSession.token, consultationId));
                }
            }
        }).data("kendoTabStrip");

        $('#soap-field-s, #soap-field-o, #soap-field-a, #soap-field-p').kendoEditor({
            tools: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent"]
        });
        if (snap['getSnapHospitalSettings']) {
            snap.getSnapHospitalSettings();
            if (snap.hospitalSettings) {
                this.isfileSharingEnable = snap.hospitalSettings.fileSharing == true;
                this.isBetaVideo = snap.hospitalSettings.videoBeta == true;
                this.isMessaging = snap.hospitalSettings.messaging == true;
            }
        }
        
        if (!this.isfileSharingEnable) {
            var elInfo = $(".filestab");
            tabsright.remove(elInfo);
        } else {
            $("#fileSharingSection").load("/content/filesharing.html" + snap.addVersion, function () {
                initFileSharingControls(1);
                setupConsultation(snap.profileSession.userId, snap.consultationSession.patientId, snap.consultationSession.consultationId);
            });
        }
    };
    encounterRoomViewModel.prototype._redirectToWaitingList = function (message) {
        snap.ConsultationPage = false;
        this.$mainHub.stop();
        if (message) {
            this.$snapNotification.error(message);
        }
        setTimeout(function () {
            location.href = snap.getClinicianHome();
        }, 5000);
    };
    encounterRoomViewModel.prototype._convertToDatePart = function (sec) {
        var d, h, m, s;
        s = sec;
        m = Math.abs(Math.floor(s / 60));
        s = s % 60;
        h = Math.abs(Math.floor(m / 60));
        m = m % 60;
        d = Math.abs(Math.floor(h / 24));
        h = h % 24;
        return { d: d, h: h, m: m, s: s };
    };
    encounterRoomViewModel.prototype.stopTimer = function(doResetTime) {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
            if (doResetTime) {
                this.set("sessionTime", "00:00");
            }
        }
    };
    encounterRoomViewModel.prototype.startTimer = function (hrs, min, sec) {
        var _this = this;
        min = min || 0;
        sec = sec || 0;
        hrs = hrs || 0;
        this.stopTimer();
        this._timerInterval = setInterval(function () {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
            }
            if (min == 60) {
                min = 0;
                hrs++;
            }
            var minStr;
            var secStr;
            var hrsStr;
            if (min < 10) {
                minStr = "0" + min;
            } else {
                minStr = "" + min;
            }
            if (sec < 10) {
                secStr = "0" + sec;
            } else {
                secStr = "" + sec;
            }
            if (hrs < 10) {
                hrsStr = "0" + hrs;
            } else {
                hrsStr = "" + hrs;
            }

            if (hrs == 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);


    };
    encounterRoomViewModel.prototype.showTimerUI = function () {
        var _this = this;
        if (this.$consultationHub.getSessionSecondsElapsed) { // check consultation Time
            this.$consultationHub.getSessionSecondsElapsed().then(function (timeInfo) {
                            
                if (timeInfo == 0) {
                    _this.startTimer(0, 0, 0);
                    return;
                }
                timeInfo = new Date(timeInfo);
                var diffDate = _this._convertToDatePart(timeInfo);
                var hour = diffDate.h;
                var min = diffDate.m;
                var sec = diffDate.s;
                if (sec >= 0) {
                    sec = Math.floor(sec);
                    _this.startTimer(hour, min, sec);
                }
            });
        }
    };
    encounterRoomViewModel.prototype.initFileSharing = function () {
        try {
            app.snapFileService.setupNotification(false);
        } catch (ex) {
            console.error("file sharing Hub not activate");
        }
    };
    encounterRoomViewModel.prototype.endSession = function () {
     
        snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
        $("#btnConfirmYes").click(function () {
            this._endSession();
        }.bind(this));
        $("#btnConfirmNo").click(function () {
            $(".k-notification-confirmation").parent().remove();
        });
       
        
    };
    encounterRoomViewModel.prototype._endSession = function () {
        var _this = this;
        this.$clinicianHeaderViewModel.set("isSessionEnding", true);
        this.$clinicianHeaderViewModel.trigger("change", { field: "consultSessionTxt" });
        _this.$consultationHub.endConsultation().then(function (result) {
            if (result && result['Result']) {
                var status = result.status;
                if (status == snap.consultationStatus.droppedConsultation) {
                    var phnNumber = _this.patientInfo.mobilePhone || _this.patientInfo.homePhone
                    _this.$snapNotification.info("It seems you've been disconnected.\n Please use the number below to call the patient in order to complete the consultation. \n If further video time is needed you can create a new appointment for the patient.\n " + phnNumber);

                } else {
                    _this.$snapNotification.success("Consultation ended. Please wait while we transfer you to home page.");
                }
                //get the main hub
                try {
                    //we know that we are going to redirect to other page here so its save to flag ConsultationPage off 
                    snap.ConsultationPage = false;
                    var $hub = snap.resolveObject("snap.hub.mainHub");
                    if ($hub) {
                        $hub.isManualStop = true;
                    }
                } catch (ex) {
                    snap.util.logToConsole(ex);
                }


                if ((typeof data === 'undefined') || (typeof data.url === 'undefined'))
                    window.location.href = snap.getClinicianHome();
                else
                    window.location.href = data.url;

            } else {
                _this.$snapNotification.info("Unable to end this consultation");
            }
        }).always(function() {
            _this.$clinicianHeaderViewModel.set("isSessionEnding", false);
            _this.$clinicianHeaderViewModel.trigger("change", { field: "consultSessionTxt" });
        });
    };
    encounterRoomViewModel.prototype._onSessionStarted = function () {
        this.$clinicianHeaderViewModel.onSessionStarted();
        this.set("isStarted", true);

        if(this.pageType === "chat") {
            this.$userConsultationChat.openChat(snap.consultationSession.meetingId);    
        }

        if (app.snapFileService) {
            app.snapFileService.consultStatus = 1;
            if (app.snapFileService.viewModel)
                app.snapFileService.viewModel.drill();
            if (app.snapFileService.bottomViewModel)
                app.snapFileService.bottomViewModel.drill();
        }
    };
    encounterRoomViewModel.prototype._startSession =function(){
        var $def = $.Deferred();
        var _this = this;
        this.$consultationHub.startConsultation().then(function (data) {
            if (data && data.Status === snap.consultationStatus.doctorInitiatedConsultation || data.Status == snap.consultationStatus.startedConsultation) {
                snap.consultationSession.meetingId = data.MeetingId;
                _this._onSessionStarted();
                $def.resolve(true);
            }
        });
        return $def.promise();
    };
    encounterRoomViewModel.prototype._initHub = function () {
        var _this = this;
        this._notifyPatientDisconnectTimeout = null;
        var NOTIFY_DISCONNECT_TIMEOUT = 10000;

        if(this.pageType === "chat") {
            this.$userConsultationChat.init({
                personInfo: {personId: snap.consultationSession.personId},
                consultationId: this.consultationId
            });

            this.$contentLoader.bindViewModel(this.$userConsultationChat, "#chatCont", "/content/shared/consultationChat.html?svp=snapversion");

            this.$meetingHub.on("start", function() {
                _this.$userConsultationChat.openChat(_this.meetingId);
            });

            this.$consultationHub.on("viewAnotherDoctor", function () {
                _this._redirectToWaitingList(_this.$consultationMessages.consultationViewAnotherDoctor);
            });

            this.$consultationHub.on("patientUnavailable", function() {
                if (_this.isStarted) {
                    snap.patentEnteredConsult = true;
                    _this._notifyPatientDisconnectTimeout = window.setTimeout(function() {
                        _this.$snapNotification.info(_this.$consultationMessages.patientDisconnected);
                        _this._notifyPatientDisconnectTimeout = null;
                    }, NOTIFY_DISCONNECT_TIMEOUT);
                } else {
                    _this.$snapNotification.info(_this.$consultationMessages.patientDisconnectedFromWaiting);
                    _this._redirectToWaitingList();
                }
            });
            this.$consultationHub.on("patientAvailable", function() {

                if (_this.isStarted) {
                    if (global.isEmpty(snap.patentEnteredConsult)) {
                        snap.patentEnteredConsult = true;
                    } else {
                        if (_this._notifyPatientDisconnectTimeout) {
                            window.clearTimeout(_this._notifyPatientDisconnectTimeout);
                            _this._notifyPatientDisconnectTimeout = null;
                        } else {
                            _this.$snapNotification.info(_this.$consultationMessages.patientReentered);
                        }
                    }
                } else {
                    _this.$snapNotification.info(_this.$consultationMessages.patientReenteredWaiting);
                }
            });
            this.$consultationHub.on("onPatientEndedConsultation", function() {
                _this.$snapNotification.info(_this.$consultationMessages.patientLeft);
            });
            this.$consultationHub.on("patientDisconnectedFromWaitingRoom", function() {
                _this._redirectToWaitingList(_this.$consultationMessages.patientDisconnectedFromWaiting);
            });
            this.$consultationHub.on("onPatientMarkConsultationAsFullfill", function() {
                _this.$snapNotification.info(_this.$consultationMessages.patientMarkComplete);
            });

            this.$consultationHub.on("start", function() {
                _this.$patientViewModel.onOpenChat();
            });
        }

        
        this.$mainHub.register(this.$consultationHub, { pageType: snap.ConsulationPageType.PatientPhysicianConsultationPage });
        this.$consultationHub.on("viewAnotherDoctor", function () {
            _this._redirectToWaitingList("This consultation has already been started another provider.");
        });
       
        this.$consultationHub.on("patientContactNumberChange", function (number) {
            if (number) {
                _this.$patientViewModel.updatePatientNumber(number);
            }
        });
        this.$consultationHub.on("start", function () {
            if (_this.isfileSharingEnable) {
                app.snapFileService.subscribeNotification(false);
            }
            if (_this.consultationInfomation.statusId == snap.consultationStatus.startedConsultation || 
                _this.consultationInfomation.statusId == snap.consultationStatus.disconnectedConsultation || 
                _this.consultationInfomation.statusId == snap.consultationStatus.patientEndConsultation) {
                _this._onSessionStarted();
                _this.showTimerUI();
                return;
            }
            _this.$consultationHub.getPatientTemporaryContactNumber().then(function (data) {
                if (data) {
                    _this.$patientViewModel.updatePatientNumber(data);
                }
            });
            _this._startSession().then(function () {
                _this.showTimerUI();
            });
            
        });

        this.$mainHub.start();    
    };


    snap.namespace("snap.shared")
    .use([
        "snapNotification", 
        "eventaggregator", 
        "snap.service.appointmentService", 
        "snap.physician.PatientViewModel",
        "snap.hub.mainHub", 
        "snap.hub.ConsultationHub", 
        "snap.clinician.ClinicianHeaderViewModel",
        "snap.common.chat.userConsultationChat",
        "snap.common.contentLoader",
        "snap.common.messages",
        "snap.hub.MeetingHub"])
    .extend(kendo.observable)
    .define("encounterRoomViewModel", encounterRoomViewModel)
    .singleton();
}(snap, kendo, jQuery, window));


//@ sourceURL=patientQueue.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue").use([
            "snapNotification",
            "snap.hub.notificationService", 
            "snap.EventAggregator", 
            "snap.clinician.patientQueue.patientCardFactory", 
            "snap.shared.consultationsListingControl", 
            "snap.common.schedule.ScheduleCommon", 
            "snap.service.appointmentService",
            "snap.hub.snapWaitingRoomConsultationsHub",
            "snap.clinician.patientQueue.doctorToPatientPreConsultationChat",
            "snap.hub.MeetingHub",
            "snap.common.contentLoader",
            "snap.hub.mainHub",
            "snap.Service.MessengerService",
            "snap.physician.PatientViewModel",
            "snap.clinician.patientQueue.reEnterConsultationDialog",
            "snap.common.dialogWindow",
            "snap.common.patientQueue.patientQueueBase"])
        .extend(kendo.observable)
        .define("patientQueue", function (
            $snapNotification, 
            $notificationService, 
            $eventAggregator, 
            $patientCardFactory, 
            $consultationsListingControl, 
            $scheduleCommon, 
            $appointmentService, 
            $snapWaitingRoomConsultationsHub, 
            $doctorToPatientPreConsultationChat,
            $meetingHub,
            $contentLoader,
            $mainHub,
            $messengerService,
            $patientViewModel,
            $reEnterConsultationDialog,
            $dialogWindow,
            $patientQueueBase
        ){
            var uiMessages = {
                loadingOnDemand:    "Loading On-Demand consultations.",
                loadingScheduled:   "Loading Scheduled consultations.",
                noOnDemand:         "There are no On-Demand Consultations.",
                noScheduled: "There are currently no scheduled patients waiting. <a href='" + snap.getBaseUrl() + "Physician/PhysicianConsultations' >View your upcoming appointments.</a>",
                cannotSeeOnDemand:  "You are not currently scheduled to provide on-demand services. <a href='" + snap.getBaseUrl() + "Physician/Main/#/scheduler' >Click Here to update your schedule.</a>",
                cannonStartConsultationPatientDisconnected: "Cannot start consultation, patient has been disconnected from waiting room.",
            },
            $historyTab = null, //JQuery selector for history tab. 
            notifyCinicianDialog = null;

            this.preConsultationChat = $doctorToPatientPreConsultationChat;  // Pre consultation chat.

            //****************** Call BASE constructor ********************
            $patientQueueBase.ctor.call(this);


            this.isDataInit = false;
            
            this.vm_patientAvgWaitTime = "";
            this.vm_onDemandTabMessage = uiMessages.loadingOnDemand;
            this.vm_scheduledTabMessage = uiMessages.loadingScheduled;
            this.vm_isLoading = true;
            
            this.vm_showLeftColumn = false;
            this.vm_showRightColumn = false;
            //************************* PUBLIC METHODS ************************

            this.leftColToggle = function() {
                this.set("vm_showLeftColumn", !this.vm_showLeftColumn);

                if($historyTab) {
                    if (this.vm_showLeftColumn) {
                        $historyTab.addClass("is-active").data("kendoTabStrip").select(1);
                    } else {
                        $historyTab.removeClass("is-active");
                    }
                }
            };

            this.load = function() {
                this.isDataInit = true;
                initJQuery();

                $patientCardFactory.init({ userType: $scheduleCommon.userType.clinician });

                snap.clearSnapConsultationSession(); //copied from old physicianlanding.viewmodel.js

                this._subscribeToEventAgregatorEvents();
                this._subscribeToAjaxEvent();
                this._subscribeToHubEvents();

                //this._loadPhycicianConsultationHistory();

                var that = this;
                $contentLoader.bindViewModel(this.preConsultationChat, "#chatContainer", "/content/shared/chat.html?svp=snapversion").done(function() {
                    that.preConsultationChat.load({
                        userId: snap.profileSession.userId,
                        personId: snap.profileSession.personId,
                    });
                });
            };

            this.refresh = function() {
                // Each time when we enter patient queue we have to refresh consultation listing.
                // We need this because we do not know what has happened since our last visit. 
                // For example provider itself or admin can create or remove On-Demand availability block for current time. So we need refresh patient queue.

                // 1. Clear patient queue.
                this._clearPatientQueue();

                this.set("vm_scheduledTabMessage", uiMessages.loadingScheduled);
                this.set("vm_onDemandTabMessage", uiMessages.loadingOnDemand);

                // 2. Refresh patient queue in order to get fresh data.
                if ($snapWaitingRoomConsultationsHub.isHubStarted()) {
                    $snapWaitingRoomConsultationsHub.refresh();
                } else {
                    $mainHub.start();
                } 
            };

            this.checkForReEntryConsultation = function() {
                $appointmentService.getPhysicianActiveConsultations().done(function (response) {
                    var tdata = response.total;

                    if (tdata > 0) {
                        var activeConnection;

                        response.data.forEach(function(connectionModel) {
                            if (connectionModel.status === 83/*DisconnectedConsultation*/) {
                                activeConnection = connectionModel;
                            }
                        });

                        if (activeConnection) {
                            if(notifyCinicianDialog === null) {
                                notifyCinicianDialog = $dialogWindow.createNewDialog({
                                    vm: $reEnterConsultationDialog,
                                    container: "#reEnterPopUpContainer",
                                    contentPath: "/content/clinician/patientQueue/reEnterConsultation.html?svp=snapversion"
                                });
                            }

                            notifyCinicianDialog.open({
                                consultationId:  activeConnection.consultationId,
                                patientId: activeConnection.patientId,
                                userType: 1,
                                meetingId: activeConnection.meetingId,
                                personId: activeConnection.providerPersonId
                            });
                        }
                    }
                }).fail(function (xhr, status, error) {
                    console.error("Consult API failure" + error);
                });
            };

            this.selectPatientCard = function(patientQueueEntryId, isFocused) {

                //Disable All cards. 
                this._applyOptToAllCards({
                    isActive: false,
                    isDisable: isFocused,
                    isNoAction: isFocused,
                    isShowOptions: false
                });

                return this._selectPatientCard(patientQueueEntryId, isFocused);
            };

            this.unselectPatientCard = function() {
                //Enable All cards. 
                this._applyOptToAllCards({
                    isActive: false,
                    isDisable: false,
                    isNoAction: false,
                    isShowOptions: false
                });

                return this._unselectPatientCard();
            };

            //*********************** MVVM BINDINGS *************************
            this.vm_onHistoryButtonClick = function(e) {
                e.preventDefault();

                this.leftColToggle();
            };

            this.vm_onStartSelectedConsultationClick = function() {
                if(this._selectedPatient) { 
                    startConsultation(this._selectedPatient);
                }
            };

            this.vm_redirectToPatientAccount = function () {
                this._redirectTopatientAccount(this.patientViewModel.consultationInfomation.patientId);
            };

            //********************** PRIVATE METHODS ************************
            this._loadPhycicianConsultationHistory = function () {
                var kendoTabstrip = $historyTab.data("kendoTabStrip");
                if (!kendoTabstrip.value()) {
                    $consultationsListingControl.init({ viewPath: "/content/clinician/consultationHistory.html?svp=snapversion" }).done(function () {
                        $consultationsListingControl.loadConsultationsToTabstrip(kendoTabstrip, "Scheduled", { status: "Scheduled", clinicianUserId: snap.profileSession.userId }, { userType: $scheduleCommon.userType.clinician });
                        $consultationsListingControl.loadConsultationsToTabstrip(kendoTabstrip, "Past", { status: "Past", clinicianUserId: snap.profileSession.userId }, { userType: $scheduleCommon.userType.clinician });
                        $consultationsListingControl.loadConsultationsToTabstrip(kendoTabstrip, "Dropped", { status: "Dropped", clinicianUserId: snap.profileSession.userId }, { userType: $scheduleCommon.userType.clinician });
                        $consultationsListingControl.loadConsultationsToTabstrip(kendoTabstrip, "DNA", { status: "DNA", clinicianUserId: snap.profileSession.userId }, { userType: $scheduleCommon.userType.clinician });

                        kendoTabstrip.select(1);
                    });
                }
            };

            this._subscribeToHubEvents = function() {
                $mainHub.register($meetingHub, {meetingPersonId: snap.profileSession.personId});
                $mainHub.register($notificationService);
                $mainHub.register($snapWaitingRoomConsultationsHub);
                $consultationsListingControl.initHub();
                
                this._subscribeToWaitingRoomHub();
                this._subscribeToNotificationHub();
                this._subscribeToMeetingHub();
                var that = this;
                $mainHub.on("start", function() {
                   
                    that._loadPhycicianConsultationHistory();
                    that.set("vm_isLoading", true);
                    that.clearLocks();
                    $snapWaitingRoomConsultationsHub.refresh().then(function () {
                        that.set("vm_isLoading", false);
                    });
                });

                return $mainHub.start();
            };

            this._subscribeToEventAgregatorEvents = function() {
                var that = this;
                $eventAggregator.subscriber("appt_onRemoveClick", function() {
                    if($snapWaitingRoomConsultationsHub) 
                        $snapWaitingRoomConsultationsHub.refresh();
                });

                $eventAggregator.subscriber("patientCard_onStartConsultationClick", function(patientCard) {
                    var card = that._findPatientCard(patientCard.patientQueueEntryId);
                    if(card) { 
                        startConsultation(card);
                    }
                });

                $eventAggregator.subscriber("patientCard_showChat", function(patienCardVM) {
                    if(that._selectedPatient === null || patienCardVM.patientQueueEntryId !== that._selectedPatient.patientQueueEntryId) {
                        that.selectPatientCard(patienCardVM.patientQueueEntryId, true);
                    }

                    that.vm_onShowChat();
                });

                $eventAggregator.subscriber("patientCard_select", function(patienCardVM, isFocused) {
                    if(that._selectedPatient === null || patienCardVM.patientQueueEntryId !== that._selectedPatient.patientQueueEntryId) {
                        if(that._selectedPatient && !that._selectedPatient.isConnected()) {
                            that._removePatientCardFromList(that._selectedPatient);
                        }

                        that._closeAllFlagsMenu();
                        that.selectPatientCard(patienCardVM.patientQueueEntryId, isFocused);

                        if(isFocused){
                            that.vm_onShowEncounterMetadata();
                        }
                    }
                });

                $eventAggregator.subscriber("patientCard_unselect", function() {
                    that.unselectPatientCard();
                });                

                $eventAggregator.subscriber("patientCard_consultationSavedAndClosed", function(appointmentId) {
                    that.removeCardFromPatientQueue(appointmentId);
                    $consultationsListingControl.refresh();
                }); 

                $eventAggregator.subscriber("patientCard_dismissed", function(appointmentId) {
                    that.removeCardFromPatientQueue(appointmentId);
                    $consultationsListingControl.refresh();
                });
                
                // $eventAggregator.subscriber("consultation_markedAsComplete", function() {
                //     $consultationsListingControl.refresh(); // Check in ticket 7669 maybe we do not need this
                // });                     

                $eventAggregator.subscriber("preConsultationChat_sendMessage", function() {
                    // Each time when physician send message to patient we reset timer. See ticket #7730
                    that._resetCardLockTimerTime();
                });

                $eventAggregator.subscriber("patientCard_redirectToAccount", function(patientId) {
                    that._redirectTopatientAccount(patientId);
                });     

                $eventAggregator.subscriber("patientCard_notificationSent", function(notificationObject) {
                    that._updateNotificationInfo(notificationObject);

                    // After notification sent, automatically unselect patient card. 
                    if(that._selectedPatient) {
                        that.unselectPatientCard();
                    }
                });
            };

            this._subscribeToNotificationHub = function() {
                $notificationService.on("message", function (messageType) {
                    if (messageType === "appointment_cancelled") {
                        if($snapWaitingRoomConsultationsHub) 
                            $snapWaitingRoomConsultationsHub.refresh();
                    }
                });
            };

            this._subscribeToWaitingRoomHub = function () {
                var that = this;

                $snapWaitingRoomConsultationsHub.on("onUpdateFlag", function (patientQueueEntryId, flag) { 
                    that._updateFlag(patientQueueEntryId, flag);
                });

                $snapWaitingRoomConsultationsHub.on("dispatchPatientConsultationInformation", function (data) {
                    if (!data) {
                        return;
                    }
                    that.set("vm_patientAvgWaitTime", data.PatientAvgWaitTime);
                    var scheduledWaitingList = [],
                        onDemandWaitingList = [];

                    data.SchedulPatientWaitingList.forEach(function(consultation) {
                        var patientCard = $patientCardFactory.createPatientCard(consultation);
                        if (patientCard.isScheduled) {
                            scheduledWaitingList.push(patientCard);
                        } else {
                            onDemandWaitingList.push(patientCard);
                        }
                    });

                    var sortFunction = function(a, b) { return a.consultationId - b.consultationId; };

                    scheduledWaitingList.sort(sortFunction);
                    onDemandWaitingList.sort(sortFunction);

                    if(!snap.hospitalSettings.onDemand) {
                        // If OnDemand module turned off we always have only "Scheduled Appointments" tab, so we will open it by default.
                        that.set("vm_isScheduledTabActive", true);
                    } else {
                        if(scheduledWaitingList.length > 0) {
                            that.set("vm_isScheduledTabActive", true);
                        } else if(onDemandWaitingList.length > 0) {
                            that.set("vm_isOnDemandTabActive", true);
                        }
                    }

                    that.scheduledWaitingList = scheduledWaitingList;
                    that.onDemandWaitingList = (data.PhysicianSlotAvailable && that.vm_isOnDemandConsultationsAvailableInHospital) ? onDemandWaitingList : [];

                    that._updateCurrentPatienConnectionState();

                    that._isPhysicianSlotAvailable = data.PhysicianSlotAvailable;
                    that._updateTabMessages(data.PhysicianSlotAvailable);

                    that._triggerWaitingListFields();

                    that._restoreSelectedPatientCardState();

                    that._setLockedSlots();

                    that.trigger("change", { field: "scheduledWaitingList" });
                    that.trigger("change", { field: "onDemandWaitingList" });

                    that.set("vm_isLoading", true);
                });

                $snapWaitingRoomConsultationsHub.on("lockRequest", function (patientQueueEntryId, physicianName) { 
                    that.lockPatientCard(patientQueueEntryId, physicianName);
                });

                $snapWaitingRoomConsultationsHub.on("unlockRequest", function (patientQueueEntryId) { 
                    that.unlockPatientCard(patientQueueEntryId);

                    that._triggerWaitingListFields();
                });

                $snapWaitingRoomConsultationsHub.on("appointmentDismissed", function (appt) {
                    that.removeCardFromPatientQueue(appt.appointmentId);
                });               

                $snapWaitingRoomConsultationsHub.on("appointmentSaveClosed", function (appt) {
                    that.removeCardFromPatientQueue(appt.appointmentId);
                }); 
            };

            this._subscribeToMeetingHub = function() {
                var that = this;
                $meetingHub.on("onPreConsultationMessageReceived", function (data) {
                    that._updatePreConsultationMessage(data.meetingId);
                });
            };

            this._updateTabMessages = function() {
                this.set("vm_scheduledTabMessage",  this.scheduledWaitingList.length === 0 ?  uiMessages.noScheduled : "");
                if (this._isPhysicianSlotAvailable) {
                    this.set("vm_onDemandTabMessage", this.onDemandWaitingList.length === 0 ? uiMessages.noOnDemand: "");                        
                } else {
                    this.set("vm_onDemandTabMessage", uiMessages.cannotSeeOnDemand);
                }
            };

            this._subscribeToAjaxEvent = function() {
                $(document).ajaxComplete(function (event, xhr, settings) {
                    if (settings && settings.url && settings.type) {
                        if ((settings.type === "PUT" || settings.type === "POST") && /\/api\/admin\/schedule\/consultations(\/\d*)?/.test(settings.url)) {
                            $snapWaitingRoomConsultationsHub.refresh();
                        }
                    }
                });
            };

            this._redirectTopatientAccount = function(patientId) {
                sessionStorage.setItem("snap_patientId_ref", patientId);
                snap.submitForm({
                    url: "/Physician/PatientFile",
                    method: "POST"
                }, {
                    patientId: this.patientViewModel.consultationInfomation.patientId,
                    token: snap.userSession.token
                });  
            };

            var isDesktop = !kendo.support.mobileOS;
            var isIOS = !isDesktop && kendo.support.mobileOS.ios;
            function startConsultation(patientCard) {
                if(!patientCard.isConnected()) {
                    $snapNotification.error(uiMessages.cannonStartConsultationPatientDisconnected);
                    return;
                }

                if (isIOS) {
                    $snapNotification.info("Browser is not supported for consultation.");
                    return;
                }
                if (kendo.support.browser && kendo.support.browser.edge === true) {
                    $snapNotification.info("Microsoft Edge Browser is not curently supported for consultation.Please use Chrome or Firefox.");
                    return;
                }
                if (snap.profileSession.isLogouted) {
                    $snapNotification.error("Consultation cannot be started because you have logged in on another device. Please enter this consultation from there.");
                    window.setTimeout(function() {
                        location.href = '/Physician/Login';
                    }, 1000);
                } else {
                    if (patientCard) {
                        var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
                        if ($messengerViewModel && $messengerViewModel.isCalling()) {
                            $snapNotification.confirmationWithCallbacks("Starting a patient consultation will end your current Provider consultation. Are you sure you want to proceed?", function() {
                                $messengerViewModel.endCallInternal();
                                openConsultation(patientCard);
                            });
                        } else {
                            openConsultation(patientCard);
                        }
                    }
                }
            }

            function openConsultation(card) {
                var data = card.getPatientCardData();
                var consultationId = data.ConsultationId;
                $snapWaitingRoomConsultationsHub.isConsulationAvailableForView(consultationId).then(function (flag) {
                    if (flag) {
                        $snapWaitingRoomConsultationsHub.unremovableLockRequest(card.patientQueueEntryId);
                        var patientID = data.PatientId;
                        var guardianUserId = data.ConsultantUserId === null ? 0 : data.ConsultantUserId;

                        var rxNTPatID = data.RxNTPatientId;
                        var patFName = data.PatientFirstName;
                        var patLName = data.PatientLastName;
                        var consultationData = {
                            consultationId: consultationId,
                            patientId: patientID,
                            guardianUserId: guardianUserId,
                            rxNTPatId: rxNTPatID,
                            patFName: patFName,
                            patLName: patLName,
                            startAutomatically: true,
                            meetingId: card.meetingId,
                            personId: snap.profileSession.personId
                        };
                        snap.setSnapConsultationSessionData(consultationData);
                        if (data.EncounterTypeCode === snap.enums.EncounterTypeCode.Phone) {
                            window.location = "/physician/main#/encounter/phone";
                        } else {
                            window.location = "/physician/main#/consultation";
                        }
                        
                    } else {
                        $snapNotification.info("This consultation has already been started another provider.");

                    }
                });
            }

            function initJQuery() {
                $(function () {
                    $historyTab = $(".patient-queue__history-tabs").kendoTabStrip({
                        animation:  {
                            open: {
                                effects: false
                            }
                        }
                    });
                });
            }

        }).singleton();
}(jQuery, snap, kendo));
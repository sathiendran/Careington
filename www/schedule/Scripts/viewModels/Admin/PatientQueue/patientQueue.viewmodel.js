//@ sourceURL=patientQueue.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.patientQueue").use([
            "snapNotification",
            "snap.hub.notificationService", 
            "snap.EventAggregator", 
            "snap.clinician.patientQueue.patientCardFactory", 
            "snap.common.schedule.ScheduleCommon", 
            "snap.service.appointmentService",
            "snap.hub.snapWaitingRoomConsultationsHub",
            "snap.admin.patientQueue.adminToPatientPreConsultationChat",
            "snap.hub.MeetingHub",
            "snap.common.contentLoader",
            "snap.hub.mainHub",
            "snap.Service.MessengerService",
            "snap.physician.PatientViewModel",
            "snap.common.timer",
            "snap.clinician.patientQueue.reEnterConsultationDialog",
            "snap.common.dialogWindow",
            "snap.common.patientQueue.patientQueueBase",
            "snap.admin.schedule.TimeUtils",
            "snap.admin.patientQueue.filters"])
        .extend(kendo.observable)
        .define("patientQueue", function (
            $snapNotification, 
            $notificationService, 
            $eventAggregator, 
            $patientCardFactory, 
            $scheduleCommon, 
            $appointmentService, 
            $snapWaitingRoomConsultationsHub, 
            $preConsultationChat,
            $meetingHub,
            $contentLoader,
            $mainHub,
            $messengerService,
            $patientViewModel,
            $timer,
            $reEnterConsultationDialog,
            $dialogWindow,
            $patientQueueBase,
            $timeUtils,
            $filters
        ){
            var uiMessages = {
                loadingOnDemand:    "Loading On-Demand consultations.",
                loadingScheduled:   "Loading Scheduled consultations.",
                noOnDemand:         "There are no On-Demand Consultations.",
                noScheduled:        "There are no Scheduled Consultations.",
                noOnDemandFiltered: "There are no On-Demand Consultations that match  your search.",
                noScheduledFiltered:"There are no Scheduled Consultations that match  your search.",
            },
            allPatientsInQueue = [],
            isDataInit = false;

            this.filters = $filters;
            this.preConsultationChat = $preConsultationChat;  // Pre consultation chat.

            //****************** Call BASE constructor ********************
            $patientQueueBase.ctor.call(this);

            this.isDataInit = function() {
                return isDataInit;
            };

            this.refresh = function () {
                this.clearLocks();
                $snapWaitingRoomConsultationsHub.refreshAdminPatientQueue();
            };

            this.load = function() {
                isDataInit = true;

                $patientCardFactory.init({ userType: $scheduleCommon.userType.admin });

                this._subscribeToEventAgregatorEvents();
                this._subscribeToHubEvents();

                var that = this;
                $contentLoader.bindViewModel(that.preConsultationChat, "#chatContainer", "/content/admin/patientQueue/preConsultationChat.html").done(function() {
                    that.preConsultationChat.load({
                        userId: snap.profileSession.userId,
                        personId: snap.profileSession.personId,
                    });
                });

                // update time dependent filters every 2 seconds to prevent wrong counts
                window.setInterval(function() {
                    that.filters.updateTimeDependentFilterInfo(allPatientsInQueue);
                }, 2 * 1000);
            };

            this.leftColToggle = function() {
                this.set("vm_showLeftColumn", !this.vm_showLeftColumn);
            };

            this.selectPatientCard = function(patientQueueEntryId, isFocused) {

                //Disable All cards. 
                this._applyOptToAllCards({
                    isActive: false,
                    isDisable: isFocused,
                    isNoAction: true,
                    isShowOptions: false
                });

                return this._selectPatientCard(patientQueueEntryId, isFocused);
            };

            this.unselectPatientCard = function() {
                //Enable All cards. 
                this._applyOptToAllCards({
                    isActive: false,
                    isDisable: false,
                    isNoAction: true,
                    isShowOptions: false
                });

                return this._unselectPatientCard();
            };

            this.vm_showLeftColumn = true;
            this.vm_showRightColumn = false;

            this.vm_scheduledTabMessage = uiMessages.loadingScheduled;
            this.vm_onDemandTabMessage = uiMessages.loadingOnDemand;

            this.vm_leftColToggle = function(e) {
                e.preventDefault(); 

                this.leftColToggle();   

                return false;
            };

            this.vm_redirectToPatientAccount = function (e) {
                e.preventDefault();

                this._redirectTopatientAccount(this.patientViewModel.consultationInfomation.patientId);
                return false;
            };

             this._subscribeToEventAgregatorEvents = function() {
                var that = this;

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

                $eventAggregator.subscriber("patientCard_dismissed", function(appointmentId) {
                    that.removeCardFromPatientQueue(appointmentId);
                    that.filters.updateFilterInfo(that._getAllCards());
                });

                $eventAggregator.subscriber("preConsultationChat_sendMessage", function() {
                    // Each time when physician send message to patient we reset timer. See ticket #7730
                    that._resetCardLockTimerTime();
                });

                $eventAggregator.subscriber("patientCard_redirectToAccount", function(patientId) {
                    that._redirectTopatientAccount(patientId);
                });

                $eventAggregator.subscriber("patientQueueFilters_change", function() {
                    if(that._selectedPatient) {
                        that.unselectPatientCard();
                    }

                    that._refreshConsultationLists();
                });

                $eventAggregator.subscriber("patientCard_notificationSent", function(notificationObject) {
                    that._updateNotificationInfo(notificationObject);
                });   
            };


            this._subscribeToHubEvents = function() {
                $mainHub.register($notificationService);
                $mainHub.register($snapWaitingRoomConsultationsHub);
                
                this._subscribeToWaitingRoomHub();
                this._subscribeToNotificationHub();
                this._subscribeToMeetingHub();
                var that = this;
                $mainHub.on("start", function () {

                    that.refresh();
                });
               

                return $mainHub.start();
            };

            this._subscribeToWaitingRoomHub = function () {
                var that = this;

                $snapWaitingRoomConsultationsHub.on("onUpdateFlag", function (patientQueueEntryId, flag) { 
                    that._updateFlag(patientQueueEntryId, flag);
                });

                $snapWaitingRoomConsultationsHub.on("dispatchAdminPatientQueue", function (data) {
                    if (!data || !data.SchedulPatientWaitingList) {
                        return;
                    }

                    allPatientsInQueue = data.SchedulPatientWaitingList.map(function(consultation) {
                        return kendo.observable($patientCardFactory.createPatientCard(consultation, { noAction: true})); // wrap to kendo observable.
                    });
                    that._refreshConsultationLists();
                    that.filters.updateFilterInfo(allPatientsInQueue);
                });

                $snapWaitingRoomConsultationsHub.on("lockRequest", function (patientQueueEntryId, physicianName) { 
                    that.lockPatientCard(patientQueueEntryId, physicianName);
                    that.filters.updateFilterMatchInfo(allPatientsInQueue, ["statuses"]);
                });

                $snapWaitingRoomConsultationsHub.on("unlockRequest", function (patientQueueEntryId) { 
                    that.unlockPatientCard(patientQueueEntryId);
                    that.filters.updateFilterMatchInfo(allPatientsInQueue, ["statuses"]);
                });

                $snapWaitingRoomConsultationsHub.on("appointmentDismissed", function (appt) {
                    that.removeCardFromPatientQueue(appt.appointmentId);
                });               

                $snapWaitingRoomConsultationsHub.on("appointmentSaveClosed", function (appt) {
                    that.removeCardFromPatientQueue(appt.appointmentId);
                });

                $eventAggregator.subscriber("patientCard_flagChanged", function(cardObject) {
                   that.filters.updateFilterMatchInfo(allPatientsInQueue, ["flags"]);
                });         
            };

            this._subscribeToNotificationHub = function() {
                $notificationService.on("message", function (messageType) {
                    if (messageType === "appointment_cancelled") {
                        if($snapWaitingRoomConsultationsHub) 
                            $snapWaitingRoomConsultationsHub.refreshAdminPatientQueue();
                    }
                });
            };

            this._subscribeToMeetingHub = function() {
                var that = this;
                $meetingHub.on("onPreConsultationMessageReceived", function (data) {
                    var card = that._updatePreConsultationMessage(data.meetingId);

                    // Some patient cards could be hiden (user use filters) but we need update they consultation messages count as well.
                    if(card === null) {
                        card = snap.util.findElement(allPatientsInQueue, "meetingId", data.meetingId);
                        card.updateMeetingConversationCount(card.meetingConversationCount + 1);
                    }
                });
            };

            this._refreshConsultationLists = function() {
                this.scheduledWaitingList = this.filters.filter(allPatientsInQueue, {isScheduled: true}).sort(sortFunction);
                this.onDemandWaitingList = snap.hospitalSettings.onDemand ?  this.filters.filter(allPatientsInQueue,  {isScheduled: false}).sort(sortFunction) : [];

                this._updateCurrentPatienConnectionState();

                this._updateTabMessages();

                // Always show Scheduled consulattions tab amd show on demand if awailable
                this.set("vm_isScheduledTabActive", true); 
                this.set("vm_isOnDemandTabActive", snap.hospitalSettings.onDemand);

                this.set("vm_patientAvgWaitTime", avgWaitTime(this._getAllCards()));

                this._triggerWaitingListFields();

                this._setLockedSlots();

                this._restoreSelectedPatientCardState();

                this.trigger("change", { field: "scheduledWaitingList" });
                this.trigger("change", { field: "onDemandWaitingList" });

                function sortFunction(a, b) { 
                    return a.consultationId - b.consultationId; 
                }
            };

            this._redirectTopatientAccount = function(patientId) {
                sessionStorage.setItem("snap_patientId_ref", patientId);
                snap.submitForm({
                    url: "/Admin/Patient",
                    method: "POST"
                }, {
                    patientId: this.patientViewModel.consultationInfomation.patientId,
                    token: snap.userSession.token
                });
            };

             this._updateTabMessages = function() {
                var isFilterEmpty = this.filters.isAllFiltersClear();
                this.set("vm_scheduledTabMessage",  this.scheduledWaitingList.length === 0 ?  (isFilterEmpty ? uiMessages.noScheduled : uiMessages.noScheduledFiltered) : "");
                this.set("vm_onDemandTabMessage", this.onDemandWaitingList.length === 0 ? (isFilterEmpty ? uiMessages.noOnDemand : uiMessages.noOnDemandFiltered) : "");
            };

            function avgWaitTime(consultations) {
                var sum = consultations.map(function(c) { return c.waitingTimeInSeconds; }).reduce(function(a, b) { return a + b; }, 0);
                var avg =  sum / consultations.length;
                
                return $timeUtils.parseTimeInterval(avg).toString();
            }
        }).singleton();
}(jQuery, snap, kendo));

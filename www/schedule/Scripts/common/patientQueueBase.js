 //@ sourceURL= patientQueueBase.viewmodel.js

 (function ($, snap) {
        "use strict";

    snap.namespace("snap.common.patientQueue").use([
        "snapNotification",
        "snap.hub.snapWaitingRoomConsultationsHub",
        "snap.hub.MeetingHub",
        "snap.physician.PatientViewModel",
        "snap.common.timer",
        "snap.service.appointmentService",
        "snap.Service.MessengerService",
        ])
        .define("patientQueueBase", function (
            $snapNotification,
            $snapWaitingRoomConsultationsHub,
            $meetingHub,
            $patientViewModel,
            $timer,
            $appointmentService,
            $messengerService){
            function Constructor () {
                var lockedSlotsArray = [],
                    uiSlotsDictionary = {},
                    cardLockTimer = null,       // When user lock OnDemand "Patient queue entry" we use this timer in order to check that card not held longer than allowed time. ;
                    defaultTime = 180;          // This is a maximum allowed lock time. A card should be held no longer than this time without interaction
                var soundPlayer;
                var playSound = function () {
                    var sound = $messengerService.getRingtone("incommingMessage");
                    soundPlayer = new Audio(sound);
                    soundPlayer.play();

                };
                this.scheduledWaitingList = []; // Waiting list of all available Scheduled consultations requests.
                this.onDemandWaitingList = [];  // Waiting list of all available On Demand consultations requests.

                this.patientViewModel = $patientViewModel;                                      // Patient details.

                this._selectedPatient = null;   // Currently selected patient card.

                this.clearLocks = function () {
                    lockedSlotsArray = [];
                    $snapWaitingRoomConsultationsHub.clearLocks();
                };

                this.lockPatientCard = function(patientQueueEntryId, physicianName) {
                    window.console.log("lockRequest: " + patientQueueEntryId);

                    if(findWithAttr(lockedSlotsArray, "patientQueueEntryId", patientQueueEntryId) < 0) {
                        lockedSlotsArray.push({
                            patientQueueEntryId: patientQueueEntryId,
                            physicianName: physicianName
                        });    
                    }

                    var uiSlot = uiSlotsDictionary[patientQueueEntryId];
                    if(uiSlot) {

                        this._lockSlot(uiSlot, physicianName);
                    }
                };

                this.unlockPatientCard = function(patientQueueEntryId) {
                    window.console.log("unlockRequest: " + patientQueueEntryId);
                    
                    var slotIndex = findWithAttr(lockedSlotsArray, "patientQueueEntryId", patientQueueEntryId);
                    if(slotIndex >= 0) {
                        lockedSlotsArray.splice(slotIndex, 1);
                    }

                    var uiSlot = uiSlotsDictionary[patientQueueEntryId];
                    if(uiSlot) {
                        uiSlot.unlock();
                    }
                };

                this.removeCardFromPatientQueue = function(appointmentId) {
                    // If dismissed patient card was selected by clinician, we need unselect it.
                    if(this._selectedPatient && this._selectedPatient.appointmentId === appointmentId) {
                        this.unselectPatientCard();
                    }

                    // Remove dismissed card from patient queue.
                    var dismissedCard = this._findPatientCardBy("appointmentId", appointmentId);
                    if(dismissedCard) {
                        this._pqRemovePatientCard(dismissedCard);
                    }
                };

                // ******************************* COMMON MVVV BINDINGS ****************************************
                this.vm_isOnDemandConsultationsAvailableInHospital = snap.hospitalSettings.onDemand;  
                this.vm_releasedInTime = "";                // Visual indication, show how much time remain before patient card will be released (in case if user selected some patient card).
                this.vm_isTimerVisible = false;             // Is release timer visible (see vm_releasedInTime property).
                this.vm_isEncounterMetadataVisible = false; // Show details for selected consultation.
                this.vm_isChatVisible = false;              // Show pre-consultation chat for selected consultation.

                this.vm_isScheduledTabActive = true;
                this.vm_isOnDemandTabActive = true;
                this.vm_isChatDisabled = false;
                this.vm_isOnDemandActive = false;



                this.vm_currentChatMessagesCount = function() {
                    if(this._selectedPatient) {
                        return this._selectedPatient.meetingConversationCount;
                    }

                    return 0;
                };

                this.vm_newMessages = function(){
                    if(this._selectedPatient) {
                        return this._selectedPatient.meetingConversationCount > 0;
                    }
                };

                this.vm_noMessages = function () {
                    if (this._selectedPatient) {
                        var convoCount = this._selectedPatient.meetingConversationCount
                        return convoCount === 0 || convoCount === null;
                    }
                };

                this.vm_ScheduledWaitingCount = function() {
                    return this.scheduledWaitingList.length;
                };

                this.vm_isVisibleScheduledWaitingCt = function(){
                    return this.scheduledWaitingList.length > 0;
                };

                this.vm_OnDemandWaitingCount = function() {
                    return this.onDemandWaitingList.length;
                };

                this.vm_isVisibleonDemandWaitingCt = function () {
                    return this.onDemandWaitingList.length > 0;
                };

                this.vm_onShowEncounterMetadata = function() {
                    this.set("vm_isChatVisible", false);
                    this.set("vm_isEncounterMetadataVisible", true);
                    this.set("vm_showRightColumn", true);
                    this.trigger("change", { field: "vm_showRightColumn" });
                };

                this.vm_onShowChat = function() {
                    if (!this.vm_isChatDisabled) {
                        this.set("vm_isChatVisible", true);
                        this.set("vm_isEncounterMetadataVisible", false);
                        this.set("vm_showRightColumn", true);
                        this.trigger("change", { field: "vm_showRightColumn" });
                        this._updateParticipantLastRead();
                    }
                };

                this.vm_onMobileTabclick = function(){
                    this.set("vm_isOnDemandActive", !this.vm_isOnDemandActive);
                }

                this.vm_onScheduledWaitingTabClick = function() {
                    this.set("vm_isScheduledTabActive", !this.vm_isScheduledTabActive);
                };

                this.vm_onOnDemandWaitingTabClick = function() {
                    this.set("vm_isOnDemandTabActive", !this.vm_isOnDemandTabActive);
                };

                this.vm_onProfileDetailsClose = function(e) {
                    e.preventDefault();

                    if(this._selectedPatient && !this._selectedPatient.isConnected()) {
                        this._pqRemovePatientCard(this._selectedPatient);
                    }

                    this.unselectPatientCard();
                };

                this._setLockedSlots = function() {
                    uiSlotsDictionary = {};

                    var that = this;
                    this._getAllCards().forEach(function(uiSlot) {
                        uiSlotsDictionary[uiSlot.patientQueueEntryId] = uiSlot;

                        var lockedSlotIndex = findWithAttr(lockedSlotsArray, "patientQueueEntryId", uiSlot.patientQueueEntryId);
                        if(lockedSlotIndex >= 0) {
                            that._lockSlot(uiSlot, lockedSlotsArray[lockedSlotIndex].physicianName);
                        }
                    });
                };

                this._lockSlot = function(uiSlot, physicianName) {
                    //Skip selected patient entry.
                    if(this._selectedPatient !== null && uiSlot.patientQueueEntryId === this._selectedPatient.patientQueueEntryId) {
                        return;
                    }

                    uiSlot.lock(physicianName);
                };

                this._lockPatientQueueEntry = function(card) {
                    $snapWaitingRoomConsultationsHub.lockRequest(card.patientQueueEntryId);

                    // If there remained timer from previously locked "Patient queue entry", we should dispose it.
                    this._disposeCardLockTimer();
                    
                    // We use timer only for OnDemand consultations.
                    // Scheduled consultation always related to one provider, so there is no sense to add timer.
                    if(card.vm_isOnDemand) {
                        var that = this;

                        // create new timer with default parameter for the currently locked "Patient queue entry",.
                        cardLockTimer = $timer.createTimer({
                            countDown: true,
                            time: defaultTime,
                            onTimerTickCallback: function(timerTick) {
                                that.set("vm_releasedInTime", [timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));

                                // We need display timer in UI when one minutes remained.
                                if(timerTick.original.minutes === 0 && that.vm_isTimerVisible === false) {
                                    that.set("vm_isTimerVisible", true);
                                }

                                // When time runs out, we need to unselect current patient queue entry. 
                                if(timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                                    that.unselectPatientCard();
                                    $snapNotification.info("Patient card unselected due to inactivity.");
                                }
                            }
                        });               

                        // Start timer immediately.
                        cardLockTimer.start();
                    }
                };

                this._unlockPatientQueueEntry = function(patientQueueEntryId) {
                   $snapWaitingRoomConsultationsHub.unlockRequest(patientQueueEntryId);

                    // Once "Patient queue entry" released, we do not need timer for it any more, so we will dispose it.
                    this._disposeCardLockTimer();
                }; 

                this._disposeCardLockTimer = function() {
                    // Always stop timer before dispose it in order to avoid loitering.
                    if(cardLockTimer) {
                        cardLockTimer.stop();
                        cardLockTimer = null;
                    }

                    // Hide timer in UI. 
                    this.set("vm_isTimerVisible", false);
                };

                this._resetCardLockTimerTime = function() {
                    // Hide timer in UI. 
                    this.set("vm_isTimerVisible", false);

                    if(cardLockTimer) {
                        cardLockTimer.stop();
                        cardLockTimer.setTime(defaultTime);
                        cardLockTimer.start();
                    }

                    if(this._selectedPatient) {
                        //We need to notify back-end that card on-hold in order to avoid situation when back-end removed lock after 5 minutes. See ticket #8382
                        $snapWaitingRoomConsultationsHub.renewLock(this._selectedPatient.patientQueueEntryId);    
                    }
                };

                this._refreshSelectedPatientCard = function(isFocused) {
                    // refresh cards states
                    this._applyOptToAllCards({
                        isActive: false,
                        isDisable: isFocused,
                        isNoAction: isFocused,
                        isShowOptions: false
                    });
                    if (!this._selectedPatient) {
                        return null;
                    }
                    var card = this._findPatientCard(this._selectedPatient.patientQueueEntryId);
                    if(card) {
                        card.isActive(isFocused);
                        card.set("vm_isDisable", false);
                    }
                    return card; 
                };

                this._selectPatientCard = function(patientQueueEntryId, isFocused) {
                    if(this._selectedPatient) {
                        this._unselectPatientCard();
                    }

                    var card = this._findPatientCard(patientQueueEntryId);
                    if(card) {
                        card.isActive(isFocused);
                        card.set("vm_isDisable", false);

                        this._selectedPatient = card;
                        this._loadCosultationDetails(card.consultationId);

                        this.set("vm_isChatDisabled", card.vm_isChatDisabled);
                        if (!card.vm_isChatDisabled) {
                            this.preConsultationChat.openChat(card.meetingId);
                        }
                        
                        this._lockPatientQueueEntry(card);

                        this.trigger("change", { field: "vm_currentChatMessagesCount" });
                        this.trigger("change", { field: "vm_newMessages" });
                        this.trigger("change", { field: "vm_noMessages" });
                    }

                    return card; 
                };

                this._unselectPatientCard = function() {
                    this._hideCosultationDetails();
                    this.preConsultationChat.deactivateChat();

                    if(this._selectedPatient) {
                        this._unlockPatientQueueEntry(this._selectedPatient.patientQueueEntryId);
                        
                        if(this._selectedPatient) {
                            this._selectedPatient.isActive(false);
                        }
                    }

                    var card = this._selectedPatient;
                    this._selectedPatient = null;

                    return card;
                };

                this._pqRemovePatientCard = function(card) {
                    this._removePatientCardFromList(card);
                    this._triggerWaitingListFields();
                    this._updateTabMessages();

                    this._triggerPatientLists();
                };

                this._addpPatientCardToList = function(card) {
                    var array  = card.isScheduled ? this.scheduledWaitingList : this.onDemandWaitingList;
                    array.push(card);
                };

                this._removePatientCardFromList = function(card) {
                    var array  = card.isScheduled ? this.scheduledWaitingList : this.onDemandWaitingList;

                    var index = array.indexOf(card);
                    if(index >= 0) {
                        array.splice(index, 1);
                    }
                };

                 this._updateCurrentPatienConnectionState = function() {
                    // If selectedPatient not null, than provider review his patient card right now.
                    if(this._selectedPatient) {
                        // Check if selectedPatient in waiting room.
                        var isConnected = this._findPatientCard(this._selectedPatient.patientQueueEntryId) !== null;

                        if(isConnected && !this._selectedPatient.isConnected()) {
                            this._selectedPatient.isConnected(true);
                        } else if(!isConnected && this._selectedPatient.isConnected()) {
                            this._selectedPatient.isConnected(false);
                        }

                        if(!isConnected) {
                            this._addpPatientCardToList(this._selectedPatient);
                        }
                    }
                };


                this._loadCosultationDetails = function(consultationId) {
                    var that = this;

                    if(this.patientViewModel.consultationInfomation.consultationId !== consultationId) {
                        $appointmentService.getAppointment(consultationId).done(function(result) {
                            that.patientViewModel.setAppointmentData(result.data);

                            that.trigger("change", { field: "patientViewModel" });
                        });
                    }
                };

                this._hideCosultationDetails = function() {
                    this.set("vm_showRightColumn", false);

                    this.trigger("change", { field: "vm_showRightColumn" });
                };


                this._applyOptToAllCards = function(vmOpt) {
                    vmOpt = $.extend({}, {
                        isActive: false,
                        isDisable: false,
                        isNoAction: false,
                        isShowOptions: false
                    }, vmOpt);

                    applyToAll(this.scheduledWaitingList);
                    applyToAll(this.onDemandWaitingList);

                    function applyToAll(list) {
                        list.forEach(function(item) {
                            item.isActive(vmOpt.isActive);
                            item.set("vm_isDisable", vmOpt.isDisable);
                            item.set("vm_isNoAction", vmOpt.isNoAction);
                            item.set("vm_showOptions", vmOpt.isShowOptions);
                        });
                    }
                };

                this._clearPatientQueue = function() {
                    this.set("scheduledWaitingList", []);
                    this.set("onDemandWaitingList", []);

                    this._triggerWaitingListFields();
                };


                this._findPatientCard = function(patientQueueEntryId) {
                    return this._findPatientCardBy("patientQueueEntryId", patientQueueEntryId);
                };

                this._findPatientCardBy = function(fieldName, value) {
                    var allCards = this._getAllCards();

                    for(var i = 0; i < allCards.length; i++) {
                        if(allCards[i][fieldName] === value) {
                            return allCards[i];
                        }
                    }

                    return null;
                };           

                this._getAllCards = function() {
                    var allCards = [];
                    this.scheduledWaitingList.forEach(function(item) {
                        allCards.push(item);
                    });

                    this.onDemandWaitingList.forEach(function(item) {
                        allCards.push(item);
                    });

                    return allCards;
                };

                this._triggerPatientLists = function() {
                    this.trigger("change", { field: "scheduledWaitingList" });
                    this.trigger("change", { field: "onDemandWaitingList" });
                };

                this._triggerWaitingListFields = function() {
                    this.trigger("change", { field: "vm_ScheduledWaitingCount" });
                    this.trigger("change", { field: "vm_isVisibleScheduledWaitingCt" });
                    this.trigger("change", { field: "vm_OnDemandWaitingCount" });    
                    this.trigger("change", { field: "vm_isVisibleonDemandWaitingCt" });                
                };

                this._updateParticipantLastRead = function() {
                    if(this._selectedPatient) {
                        $meetingHub.updateParticipantLastRead(this._selectedPatient.meetingId, snap.profileSession.personId);

                        this._selectedPatient.updateMeetingConversationCount(0);

                        this.trigger("change", { field: "vm_currentChatMessagesCount"});
                        this.trigger("change", { field: "vm_newMessages" });
                        this.trigger("change", { field: "vm_noMessages" });
                    }
                };
                
                this._updatePreConsultationMessage = function(meetingId) {
                    var card = this._findPatientCardBy("meetingId", meetingId);

                    if(card) {
                        if (card.vm_isChatDisabled) {
                            return card;
                        }
                        var isCardSelected = this._selectedPatient !== null && card.patientQueueEntryId === this._selectedPatient.patientQueueEntryId;
                        if(this.vm_isChatVisible && isCardSelected) {
                            this._updateParticipantLastRead(card.meetingId, snap.profileSession.personId);
                        } else {
                            card.updateMeetingConversationCount(card.meetingConversationCount + 1);
                            if (isCardSelected) {
                                // refresh selected card meetingConversationCount
                                this._selectedPatient = card;
                            }
                            playSound();
                        }
                        
                        this.trigger("change", { field: "vm_currentChatMessagesCount" });
                        this.trigger("change", { field: "vm_newMessages" });
                        this.trigger("change", { field: "vm_noMessages" });
                    }

                    return card;
                };

                this._updateNotificationInfo = function(notificationObject) {
                    var card = this._findPatientCardBy("appointmentId", notificationObject.appointmentId);

                    if(card) {
                        card.addNotification(notificationObject.notifiedPersons);
                    }
                };

                this._closeAllFlagsMenu = function() {
                    this._getAllCards().forEach(function(card) {
                        card.set("vm_isActiveFlags", false);
                    });
                };

                this._restoreSelectedPatientCardState = function() {
                    var selectedPatient = this._selectedPatient;

                    if(selectedPatient) {
                        var tmp = {
                            isChatVisible: this.vm_isChatVisible,
                            isEncounterMetadataVisible: this.vm_isEncounterMetadataVisible,
                        };

                        var card = this._refreshSelectedPatientCard(tmp.isEncounterMetadataVisible || tmp.isChatVisible);

                        if(tmp.isEncounterMetadataVisible)
                            this.vm_onShowEncounterMetadata();

                        if(tmp.isChatVisible)
                            this.vm_onShowChat();
                    }
                };

                this._updateFlag = function(appointmentId, flag) {
                    var card = this._findPatientCardBy("appointmentId", appointmentId);
                    if (card) {
                        card.setFlag(flag);
                    }
                };

               
                // ToDo: use snap.find instead.
                function findWithAttr(array, attr, value) {
                    for(var i = 0; i < array.length; i += 1) {
                        if(array[i][attr] === value) {
                            return i;
                        }
                    }
                    return -1;
                }
            }

            this.ctor = Constructor;
        });
}(jQuery, snap));

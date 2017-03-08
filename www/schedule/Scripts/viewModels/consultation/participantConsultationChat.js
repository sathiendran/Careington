//@ sourceURL=participantConsultationChat.js

(function ($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.common.chat")
        .use(["snapNotification", "snap.EventAggregator", "snap.hub.MeetingHub", "snap.Service.MessengerService", "snap.admin.schedule.TimeUtils", 
            "snap.hub.mainHub", "snap.common.chat.chatBase", "snap.service.guestConsultationService"])
        .extend(kendo.observable)
        .define("participantConsultationChat", function ($snapNotification, $eventAggregator, $meetingHub, $metingService, $timeUtils, 
            $mainHub, $chatBase, $guestConsultationService) {

            var $scope = this;
            this._consultationId = null;
            this._person = null;

            //****************** Call BASE constructor ********************
            $chatBase.ctor.call(this);

            //********************** PUBLIC API ****************************

            this.load = function(personInfo, consultationId) {
                this._person = personInfo;
                this._consultationId = consultationId;

                this._subscribeToChatHub();
            };


            //********************** MVVM BINDINGS ****************************
            
            this.vm_newMessageText = "";

            this.vm_onSendMessageButtonClick = function() {
                if (/\S/.test(this.vm_newMessageText)) {
                    this._sendMessage(this.vm_newMessageText);
                }

                this.set("vm_newMessageText", "");
            };

            this.vm_onEnterKey = function() {
                setTimeout(function() {
                    $scope.vm_onSendMessageButtonClick();
                }, 200);
            };

            //********************** PRIVATE METHODS ****************************

            this._subscribeToChatHub = function () {
                var that = this;
                $meetingHub.on("onConsultationMessageReceived", function (data) {
                    that._addChatMessage(data);
                });

                if(!$meetingHub.isHubInitialized()) {
                    $mainHub.register($meetingHub, {meetingPersonId: this._person.personId});

                    $mainHub.start();
                }
            };

            this._loadChatHistory = function() {
                this.set("chatHistory", []);
                $guestConsultationService.loadChatHistory(this._consultationId).done(function(data) {
                    if (data && data.data) {
                        data.data.forEach(function(item) {
                            $scope._addChatMessage(item, true);
                        });
                        updateScroll();
                    }
                });
            };

            this._addChatMessage = function(data, doNotScroll) {
                var newMessage = this._createChatMessage(data);
                newMessage.formattedSentDate = kendo.toString(new Date(newMessage.sentDate), "h:mm tt"); 

                this.chatHistory.push(newMessage);
                this.trigger("change", { field: "chatHistory" });

                if (!doNotScroll) {
                    updateScroll();
                }
            };

            this._sendMessage = function (message) {
                var that = this;
                $meetingHub.sendConsultationChatMessage(this._consultationId, this._meetingId, this._person.personId, message).done(function (data) {
                    that._addChatMessage(data);

                    $meetingHub.updateParticipantLastRead(that._meetingId, that._person.personId);
                });
            };

            $eventAggregator.subscriber("onOpenConsultationChat", function() {
                updateScroll();
            });

            var updateScroll = function() {
                window.setTimeout(function() {
                    $(".consultation__messages-list").animate({
                        scrollTop: $('.consultation__messages-container').height()
                    }, 1000);
                }, 300);
            };

        }).singleton();
}(jQuery, snap, kendo, window));
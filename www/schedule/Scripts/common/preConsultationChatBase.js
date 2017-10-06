//@ sourceURL=preConsultationChatBase.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.common.patientQueue")
        .use(["snapNotification", "snap.EventAggregator", "snap.hub.MeetingHub", "snap.Service.MessengerService", "snap.common.timeUtils", 
            "snap.hub.mainHub", "snap.common.chat.chatBase"])
        .define("preConsultationChat", function ($snapNotification, $eventAggregator, $meetingHub, $metingService, $timeUtils, $mainHub, $chatBase) {

            function PreConsultationChat() {
                //****************** Call BASE constructor ********************
                $chatBase.ctor.call(this);

                this._person = null;

                //********************** PUBLIC API ****************************

                this.load = function(personInfo) {
                    this._person = personInfo;

                    this._subscribeToChatHub();
                };

                this._deactivateChat = function() {
                    this._meetingId = null;
                    this.set("chatHistory", []);
                };


                //********************** PRIVATE METHODS ****************************

                this._subscribeToChatHub = function () {
                    var that = this;
                    $meetingHub.on("onPreConsultationMessageReceived", function (data) {
                        that._addChatMessage(data);
                    });

                    if(!$meetingHub.isHubInitialized()) {
                        $mainHub.register($meetingHub, {meetingPersonId: this._person.personId});

                        $mainHub.start();
                    }
                };

                this._loadChatHistory = function() {
                    var that = this;
                    $metingService.getMeetingConversation(this._meetingId).done(function(data) {
                        that.set("chatHistory", []); // empty existing messages
                        data.data.forEach(function(item) {
                            that._addChatMessage(item);
                        });
                    });
                };

                this._addChatMessage = function(data) {
                    if (this._meetingId !== data.meetingId) {
                        return;
                    }
                    var newMessage = this._createChatMessage(data);
                    this.chatHistory.push(newMessage);
                    this.trigger("change", { field: "chatHistory" });
                    
                    $('#chatMessagesList > .chat__messages-container').scrollTop($('#chatMessagesList > .chat__messages-container').prop("scrollHeight"));
                };

                this._sendMessage = function (message) {
                    var that = this;

                    $meetingHub.sendPreConsultationChatMessage(this._meetingId, this._person.personId, message).done(function (data) {
                        that._addChatMessage(data);

                        $meetingHub.updateParticipantLastRead(that._meetingId, that._person.personId);
                    });
                };
            }

            this.ctor = PreConsultationChat;

        }).singleton();
}(jQuery, snap));
//@ sourceURL=chatBase.js

(function($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.common.chat")
        .use(["snapNotification", "snap.EventAggregator", "snap.hub.MeetingHub", "snap.Service.MessengerService", "snap.common.timeUtils"])
        .define("chatBase", function($snapNotification, $eventAggregator, $meetingHub, $metingService, $timeUtils) {

            function ChatBase() {
                this._person = null;
                this._meetingId = null;

                this.vm_chatInactive = false; // default value
                this.chatHistory = [];

                this.openChat = function(meetingId) {
                    this._meetingId = meetingId;
                    this.chatHistory = [];

                    this._loadChatHistory();

                    if (this._loadDetails) {
                        this._loadDetails();
                    }
                };

                this.getMessagesCount = function() {
                    return this.chatHistory.length;
                };

                this.getCurrentMeetingId = function() {
                    return this._meetingId;
                };


                //********************** PRIVATE METHODS ****************************
                this._createChatMessage = function(data) {
                    if (!data.profileImagePath) {
                        data.profileImagePath = global.getDefaultProfileImageForClinician();
                    }

                    var newMessage = new ChatMessage(data);
                    newMessage.isMine = newMessage.senderPersonId === this._person.personId;

                    var last = this.chatHistory[this.chatHistory.length - 1];
                    if (last) {
                        newMessage.isSame = last.senderPersonId === newMessage.senderPersonId;
                    }

                    return newMessage;
                };
            }

            function ChatMessage(chatMessage) {
                this.meetingId = chatMessage.meetingId;
                this.senderPersonId = chatMessage.senderPersonId;
                this.senderName = chatMessage.senderName;
                this.message = chatMessage.message;
                this.sentDate = chatMessage.sentDate;
                this.profileImagePath = chatMessage.profileImagePath;

                var messageSentTimeInfo = $timeUtils.dateFromSnapDateString(chatMessage.sentDate);
                this.formattedSentDate = kendo.toString(messageSentTimeInfo, "h:mm tt");

                this.isMine = false;
                this.isSame = false;
            }

            this.ctor = ChatBase;

        }).singleton();
}(jQuery, snap, kendo, window));

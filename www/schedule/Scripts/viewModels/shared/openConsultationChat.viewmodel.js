//@ sourceURL=openConsultationChat.viewmodel.js

(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common.chat")
        .use(["snapNotification", "snap.EventAggregator", "snap.hub.MeetingHub", "snap.Service.MessengerService", "snap.common.timeUtils",
            "snap.hub.mainHub", "snap.common.chat.chatBase"
        ])
        .extend(kendo.observable)
        .define("openConsultationChat", function($snapNotification, $eventAggregator, $meetingHub, $metingService, $timeUtils, $mainHub,
            $chatBase) {

            var $scope = this;
            this._person = null;
            this._isGuestPage = false;

            //****************** Call BASE constructor ********************
            $chatBase.ctor.call(this);

            //********************** PUBLIC API ****************************

            this.cleanup = function() {
                $meetingHub.off("onBroadcastMessageReceived");
                $meetingHub.cleanup();
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
            var getParticipantConversations = function() {
                var url = "/api/v2.1/participants/conversations";
                return $.ajax({
                    url: url,
                    headers: {
                        'Authorization': 'JWT-Participant ' + snap.guestSession.participantToken,
                        'Content-Type': 'application/json',
                        'X-Api-Session-Id': snap.apiSessionId
                    }
                });
            };
            var getConvertedTime = function(timeString) {
                var messageSentTimeInfo;
                if ($scope._isGuestPage) {
                    // for guest use his local machine time (because api returns utc time for him)
                    messageSentTimeInfo = new Date(timeString);
                } else {
                    // the user receives time in his timezone
                    messageSentTimeInfo = $timeUtils.dateFromSnapDateString(timeString);
                }
                return kendo.toString(messageSentTimeInfo, "h:mm tt");
            };

            this._init = function(opt) {
                this._person = opt.personInfo;
                this._isGuestPage = opt.isGuestPage;
                this.set("chatHistory", []);

                this._subscribeToChatHub();
            };

            this._subscribeToChatHub = function() {
                var that = this;
                $meetingHub.on("onBroadcastMessageReceived", function(data) {
                    that._addChatMessage(data);
                });
                // hub is registered and started in openconsultation viewmodel
            };

            this._loadChatHistory = function() {
                $scope.set("chatHistory", []);
                var getConversationPromise = this._isGuestPage ? getParticipantConversations() :
                    $metingService.getMeetingConversation(this._meetingId);

                getConversationPromise.done(function(data) {
                    if (data && data.data) {
                        data.data.forEach(function(item) {
                            $scope._addChatMessage(item, true);
                        });
                        $scope._updateScroll();
                    }
                });
            };

            this._addChatMessage = function(data, doNotScroll) {
                var newMessage = this._createChatMessage(data);
                newMessage.formattedSentDate = getConvertedTime(newMessage.sentDate);

                this.chatHistory.push(newMessage);
                this.trigger("change", { field: "chatHistory" });

                if (!doNotScroll) {
                    $scope._updateScroll();
                }
            };

            this._sendMessage = function(message) {
                var that = this;
                $meetingHub.broadcastChatMessage(this._meetingId, message);
            };

            $eventAggregator.subscriber("onOpenConsultationChat", function() {
                $scope._updateScroll();
            });

        }).singleton();
}(jQuery, snap, kendo));

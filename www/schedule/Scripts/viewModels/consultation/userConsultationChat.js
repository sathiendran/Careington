//@ sourceURL=userConsultationChat.js

(function ($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.common.chat")
        .use(["snapNotification", "snap.EventAggregator", "snap.hub.MeetingHub", "snap.Service.MessengerService", "snap.admin.schedule.TimeUtils", 
            "snap.hub.mainHub", "snap.common.chat.chatBase", "snap.service.appointmentService"])
        .extend(kendo.observable)
        .define("userConsultationChat", function ($snapNotification, $eventAggregator, $meetingHub, $metingService, $timeUtils, $mainHub, 
            $chatBase, $appointmentService) {

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

            this.preConsultationChatHistory = [];
            this.vm_newMessageText = "";

            this.vm_onEnterKey = function() {
                setTimeout(function() {
                    $scope.vm_onSendMessageButtonClick();
                }, 200);
            };

            this.vm_onSendMessageButtonClick = function() {
                if (/\S/.test(this.vm_newMessageText)) {
                    this._sendMessage(this.vm_newMessageText);
                }

                this.set("vm_newMessageText", "");
            };


            this.vm_messageSeparatorVisible = function() {
                return this.chatHistory && this.chatHistory.length && 
                this.preConsultationChatHistory && this.preConsultationChatHistory.length;
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
                this.set("preConsultationChatHistory", []);

                var preConsHistoryPromise = $appointmentService.loadPreConsultationChatHistory(this._consultationId);
                var consHistoryPromise = $appointmentService.loadChatHistory(this._consultationId);

                processHistoryPromise(preConsHistoryPromise, true).always(function() {
                    processHistoryPromise(consHistoryPromise);
                });
            }

            var processHistoryPromise = function(historyPromise, isPreConsultationMessage) {
                var dfd = $.Deferred();
                historyPromise.then(function(data) {
                    if (data && data.data) {
                        data.data.forEach(function(item) {
                            $scope._addChatMessage(item, true, isPreConsultationMessage);
                        });
                        updateScroll();
                        dfd.resolve();
                    }
                }, function() {
                    dfd.reject();
                });
                return dfd.promise();
            };

            this._addChatMessage = function(data, doNotScroll, isPreConsultationMessage) {
                var newMessage = this._createChatMessage(data);

                if (isPreConsultationMessage) {
                    this.preConsultationChatHistory.push(newMessage);
                    this.trigger("change", { field: "preConsultationChatHistory" });
                } else {
                    this.chatHistory.push(newMessage);
                    this.trigger("change", { field: "chatHistory" });
                    this.trigger("change", { field: "vm_messageSeparatorVisible" });
                }

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
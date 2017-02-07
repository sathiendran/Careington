/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapNotification.js" />
/// <reference path="../core/snapHttp.js" />



;
(function($) {

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("MeetingHub", function($hubModel) {
            var scope = this,
                meetingHub = $.connection.messengerHub,
                isStarted = false,
                isInitialized = false;
            scope.meetingId = null;

            this.isVisibleForUsers = 0;

            $hubModel._initModel(meetingHub, this);

            //init Hub
            var initEvent = function() {
                meetingHub.client.onParticipantConnected = function (meetingId,participants) {
                    scope.triggerEvent("onParticipantConnected", meetingId, participants);
                };
                meetingHub.client.onParticipantDisconnected = function (meetingId, participants) {
                    scope.triggerEvent("onParticipantDisconnected",meetingId,participants)
                };


                meetingHub.client.onBroadcastMessageReceived = function (data) {
                    scope.triggerEvent("onBroadcastMessageReceived",data);
                };

                meetingHub.client.onVideoIncoming = function(data, fromUserId) {
                    scope.triggerEvent("onVideoIncoming", data, fromUserId);
                };
                meetingHub.client.onAudioIncoming = function(data, fromUserId) {
                    scope.triggerEvent("onAudioIncoming", data, fromUserId);
                };
                meetingHub.client.onClientUnavailable = function() {
                    scope.triggerEvent("onClientUnavailable");
                };
                meetingHub.client.onMessageReceived = function(data) {
                    scope.triggerEvent("onMessageReceived", data);
                };
                meetingHub.client.onAcceptCall = function() {
                    scope.triggerEvent("onAcceptCall");
                };
                meetingHub.client.onSwitchToOpenConsultation = function (meetingId, participantId) {
                    scope.triggerEvent("onSwitchToOpenConsultation", meetingId, participantId);
                };
                meetingHub.client.onRejectCall = function(rejectTypeId) {
                    scope.triggerEvent("onRejectCall", rejectTypeId);
                };
                meetingHub.client.onDisconnectCall = function() {
                    scope.triggerEvent("onDisconnectCall");
                };
                meetingHub.client.onPreConsultationMessageReceived = function (data) {
                    scope.triggerEvent("onPreConsultationMessageReceived", data);
                };
                meetingHub.client.onConsultationMessageReceived = function (data) {
                    scope.triggerEvent("onConsultationMessageReceived", data);
                };
                meetingHub.client.onClientConnected = function() {
                    scope.triggerEvent("onClientConnected");
                };
                meetingHub.client.onClientDisconnected = function(userId) {
                    scope.triggerEvent("onClientDisconnected", userId);
                };
                meetingHub.client.onCallmateDisconnected = function() {
                    scope.triggerEvent("onCallmateDisconnected");
                };
                meetingHub.client.onReenterCall = function (callParams, callmateUserId) {
                    scope.triggerEvent("onReenterCall", callParams, callmateUserId);
                };

                meetingHub.client.onCallmateReentered = function() {
                    scope.triggerEvent("onCallmateReentered");
                };

                meetingHub.client.onOpenConultationEnded = function () {
                    scope.triggerEvent("onOpenConultationEnded");
                };

                meetingHub.client.onUserListUpdate = function (data) {
                    scope.triggerEvent("onUserListUpdate", data);
                };

                meetingHub.client.onRefreshParticipantList = function () {
                    scope.triggerEvent("onRefreshParticipantList");
                };

                meetingHub.client.onUserLeaveOpenConsultation = function(userParticipantId) {
                    scope.triggerEvent("onUserLeaveOpenConsultation", userParticipantId);
                };
            };

            var initConnection = function (opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                var participantToken = sessionStorage.getItem("participantToken");
                if (participantToken) {
                    $.connection.hub.qs["JWT-Participant"] = participantToken;
                    $.connection.hub.qs["participant"] = 1;
                } else if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                    $.connection.hub.qs["participant"] = 0;
                }
                if (opt) {
                    $.connection.hub.qs["MeetingPersonId"] = opt.meetingPersonId || "";
                    $.connection.hub.qs["openConsultation"] = opt.openConsultation || 0;
                    $.connection.hub.qs["meetingId"] = opt.meetingId;
                    $.connection.hub.qs["isVisibleForUsers"] = scope.isVisibleForUsers || opt.isVisibleForUsers || 0;
                } else {
                    $.connection.hub.qs["meetingId"] = snap.consultationSession ? snap.consultationSession.meetingId : null;
                }
                scope.isVisibleForUsers = $.connection.hub.qs.isVisibleForUsers;
                scope.meetingId = $.connection.hub.qs.meetingId;
            };

            this.init = function (opt) {
                initConnection(opt);

                if (isInitialized) {
                    window.console.log("meetingHub was initialized before");
                    return;
                }
                isInitialized = true;
                initEvent();

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("meetingHub started");
                });
            };

            this.isHubStarted = function() {
                return isStarted;
            };

            this.isHubInitialized = function() {
                return isInitialized;
            };

            this.markAsStarted = function(value) {
                isStarted = !!value;
            };

            this.startCall = function(meetingId, type, userId) {
                return meetingHub.server.startCall(meetingId, type, userId);
            };

            this.rejctCall = function(userId, rejectTypeId) {
                rejectTypeId = rejectTypeId || 1;
                return meetingHub.server.rejctCall(userId, rejectTypeId);
            };

            this.disconnectCall = function(userId) {
                return meetingHub.server.disconnectCall(userId);
            };

            this.acceptCall = function(userId, meetingId) {
                return meetingHub.server.acceptCall(userId, meetingId);
            };

            this.registerMeeting = function(meetingUId) {
                return meetingHub.server.registerMeeting(meetingUId);
            };

            this.switchToOpenConsultation = function (userId) {
                return meetingHub.server.switchToOpenConsultation(userId);
            };

            this.sendChatMessage = function(userId, message) {
                return meetingHub.server.sendChatMessage(userId, message);
            };

            this.broadcastChatMessage = function (meetingId, message) {
                return meetingHub.server.broadcastChatMessage(meetingId, message);
            }
            this.callmateReentered = function() {
                return meetingHub.server.callmateReentered();
            };

            this.sendPreConsultationChatMessage = function (meetingId, senderId, message) {
                return meetingHub.server.sendPreConsultationChatMessage(meetingId, senderId, message);
            }; //merge7083

            this.sendConsultationChatMessage = function (consultationId, meetingId, senderId, message) {
                return meetingHub.server.sendConsultationChatMessage(consultationId, meetingId, senderId, message);
            };

            this.updateParticipantLastRead = function(meetingId, personId) {
                return meetingHub.server.updateParticipantLastRead(meetingId, personId);
            };

            this.endOpenConsultation = function (meetingId) {
                return meetingHub.server.endOpenConsultation(meetingId);
            };

            this.changeUserStatus = function (status) {
                return meetingHub.server.changeUserStatus(status);
            };

            this.updateUsersStatus = function () {
                return meetingHub.server.updateUsersStatus();
            };

            this.leaveMeeting = function (meetingId) {
                return meetingHub.server.leaveMeeting(meetingId);
            };

            this.disconnectPartisipant = function(participantId) {
                return meetingHub.server.disconnectPartisipant(participantId);
            };

            this.leaveOpenConsultation = function (meetingId, participantId) {
                return meetingHub.server.leaveOpenConsultation(meetingId, participantId);
            };

        }).singleton();


}(jQuery));

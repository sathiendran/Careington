/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapNotification.js" />
/// <reference path="../core/snapHttp.js" />



;
(function($, snap) {
    "use strict";

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("MeetingHub", function($hubModel) {
            var scope = this,
                meetingHub = $.connection.messengerHub;

            this._name = "meetingHub";

            this.qs = {
                meetingId: null,
                meetingPersonId: null,
                isVisibleForUsers: 0,
                openConsultation: 0
            };

            $hubModel._initModel(meetingHub, this);

            //init Hub
            this._initClient = function() {
                meetingHub.client.onParticipantConnected = function (participantId) {
                    scope.triggerEvent("onParticipantConnected", participantId);
                };
                meetingHub.client.onParticipantDisconnected = function (participantId) {
                    scope.triggerEvent("onParticipantDisconnected", participantId);
                };
                meetingHub.client.onParticipantDeclined = function () {
                    scope.triggerEvent("onParticipantDeclined");
                };
                meetingHub.client.onProviderConnected = function (participantId) {
                    scope.triggerEvent("onProviderConnected", participantId);
                };
                meetingHub.client.onProviderDisconnected = function ( participantId) {
                    scope.triggerEvent("onProviderDisconnected", participantId);
                };

                meetingHub.client.onOpenConsultationStarted = function (callStartTime, callSeconds) {
                    scope.triggerEvent("onOpenConsultationStarted", callStartTime, callSeconds);
                };

                meetingHub.client.onOpenConsultationEnded = function () {
                    scope.triggerEvent("onOpenConsultationEnded");
                };

                meetingHub.client.onUserLeaveOpenConsultation = function(userParticipantId, userName) {
                    scope.triggerEvent("onUserLeaveOpenConsultation", userParticipantId, userName);
                };

                meetingHub.client.onBroadcastMessageReceived = function (data) {
                    scope.triggerEvent("onBroadcastMessageReceived",data);
                };

                meetingHub.client.onVideoIncoming = function(data, userInfo) {
                    scope.triggerEvent("onVideoIncoming", data, userInfo);
                };
                meetingHub.client.onAudioIncoming = function(data, userInfo) {
                    scope.triggerEvent("onAudioIncoming", data, userInfo);
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
                meetingHub.client.onReenterCall = function (callParams, userInfo) {
                    scope.triggerEvent("onReenterCall", callParams, userInfo);
                };

                meetingHub.client.onCallmateReentered = function() {
                    scope.triggerEvent("onCallmateReentered");
                };

                meetingHub.client.onUserListUpdate = function (data) {
                    scope.triggerEvent("onUserListUpdate", data);
                };

                meetingHub.client.onParticipantStatusChanged = function (participantId, status, message) {
                    scope.triggerEvent("onParticipantStatusChanged", participantId, status, message);
                };
            };

            this._initConnection = function (opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                var participantToken = sessionStorage.getItem("participantToken");
                if (participantToken) {
                    $.connection.hub.qs["JWT-Participant"] = participantToken;
                    $.connection.hub.qs["participant"] = 1;
                } else if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                    $.connection.hub.qs["participant"] = 0;
                }
                opt = opt || {};
                opt.meetingId = opt.meetingId || (snap.consultationSession ? snap.consultationSession.meetingId : null);
                $.extend(scope.qs, opt);
                $.extend($.connection.hub.qs, scope.qs);

                scope.qs = $.connection.hub.qs;

            };

            /* Public functions */

            this.isVisibleForUsers = function() {
                return $.connection.hub.qs.isVisibleForUsers === 1;
            };


            /* Server functions */

            this.onLeaveOpenConsultation = function() {
                scope.qs.openConsultation = 0;
            };

            this.startCall = function(meetingId, type, userId) {
                return this._invokeServerFunction("startCall", meetingId, type, userId);
            };

            this.rejctCall = function(userId, rejectTypeId) {
                rejectTypeId = rejectTypeId || 1;
                return this._invokeServerFunction("rejctCall", userId, rejectTypeId);
            };

            this.disconnectCall = function(userId) {
                return this._invokeServerFunction("disconnectCall", userId);
            };

            this.acceptCall = function (userId, meetingSessionId) {
                return this._invokeServerFunction("acceptCall", userId, meetingSessionId);
            };

            this.switchToOpenConsultation = function (userId) {
                return this._invokeServerFunction("switchToOpenConsultation", userId);
            };

            this.sendChatMessage = function(userId, message) {
                return this._invokeServerFunction("sendChatMessage", userId, message);
            };

            this.broadcastChatMessage = function (meetingId, message) {
                return this._invokeServerFunction("broadcastChatMessage", meetingId, message);
            };
            this.callmateReentered = function() {
                return this._invokeServerFunction("callmateReentered");
            };

            this.sendPreConsultationChatMessage = function (meetingId, senderId, message) {
                return this._invokeServerFunction("sendPreConsultationChatMessage", meetingId, senderId, message);
            }; //merge7083

            this.sendConsultationChatMessage = function (consultationId, meetingId, senderId, message) {
                return this._invokeServerFunction("sendConsultationChatMessage", consultationId, meetingId, senderId, message);
            };

            this.updateParticipantLastRead = function(meetingId, personId) {
                return this._invokeServerFunction("updateParticipantLastRead", meetingId, personId);
            };

            this.changeUserStatus = function (status) {
                return this._invokeServerFunction("changeUserStatus", status);
            };

            this.updateUsersStatus = function () {
                return this._invokeServerFunction("updateUsersStatus");
            };

            this.disconnectPartisipant = function(participantId) {
                return this._invokeServerFunction("disconnectPartisipant", participantId);
            };

            this.leaveOpenConsultation = function (meetingId) {
                return this._invokeServerFunction("leaveOpenConsultation", meetingId);
            };

            this.getOpenConsultationSeconds = function () {
                return this._invokeServerFunction("getOpenConsultationSeconds");
            };

        }).singleton();


}(jQuery, snap));

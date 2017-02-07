/// <reference path="../jquery-1.10.2.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />



;
(function($) {
    snap.ConsulationPageType = {
        CustomerWaitingPage: 1,
        PatientPhysicianConsultationPage: 2,
        GuestParticipantConsultationPage: 3
    };

    snap.ParticipantType = {
        Physician: 1,
        Patient: 2,
        Guest: 3
    };

    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("ChatHub", function($hubModel) {
            var scope = this,
                isStarted = false,
                isInitialized = false,
                chatHub = $.connection.snapChatService;

            $hubModel._initModel(chatHub, this);

            var initEvent = function() {
                chatHub.client = chatHub.client || {};
                chatHub.client.registerComplete = function() {
                    var args = Array.prototype.slice.call(arguments);
                    scope.triggerEvent("connected", args);

                };
                chatHub.client.notifyUserList = function(online, offline, busyUser, awayUser) {
                    scope.triggerEvent("notifyUserList", online, offline, busyUser, awayUser);
                };
                chatHub.client.deliverPatientNumber = function(number) {
                    scope.triggerEvent("onPatientNumberChanged", number);
                };
                chatHub.client.deliverMessageToPhysician = function(data, msg) {
                    scope.triggerEvent("deliverMessageToPhysician", data, msg);
                };
                chatHub.client.deliverMessageToPatient = function(data, msg) {
                    var _data = {
                        data: data,
                        msg: msg,
                        date: kendo.toString(new Date(), "hh:mm tt")
                    };
                    scope.triggerEvent("deliverMessageToPatient", _data);
                };
                chatHub.client.deliverToUser = function(from, to, msg) {
                    scope.triggerEvent("deliverToUser", from, to, msg);
                };
                chatHub.client.notifyPhysicianOnlineStatus = function(isOnline) {
                    scope.triggerEvent("notifyPhysicianOnlineStatus", isOnline);
                };
                chatHub.client.notifyPatietOnlineStatus = function(isOnline) {
                    scope.triggerEvent("notifyPatietOnlineStatus", isOnline);
                };
                chatHub.client.sendChatMessage = function(data) {
                    scope.triggerEvent("sendChatMessage", data);
                };
            };

            var initConnection = function(participantType) {

                $.connection.hub.qs = $.connection.hub.qs || {};

                if (snap.consultationId || snap.consultationSession) {
                    $.connection.hub.qs["consultationId"] = snap.consultationSession ? snap.consultationSession.consultationId : snap.consultationId;
                } else {
                    $.connection.hub.qs["consultationId"] = 0;
                }
                if (snap.profileSession && snap.profileSession.userId) {
                    $.connection.hub.qs["userId"] = snap.profileSession.userId;
                }
                if (participantType) {
                    $.connection.hub.qs["participantType"] = participantType;
                    if (participantType === snap.ParticipantType.Guest) {
                        // participant
                        $.connection.hub.qs["JWT-Participant"] = snap.userSession.token;
                        $.connection.hub.qs["participant"] = 1;
                        delete $.connection.hub.qs["Bearer"];
                    } else {
                        $.connection.hub.qs["Bearer"] = snap.userSession.token;
                    }
                } else {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function (participantType) {
                initConnection(participantType);
                if (isInitialized) {
                    window.console.log("chatHub was initialized before");
                    return;
                }
                isInitialized = true;
                initEvent();
                scope.on("start", function() {
                    if (!isInitialized) {
                        return;
                    }
                    isStarted = true;
                    window.console.log("chatHub started");
                    chatHub.server.registerMe();
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

            this.changeStatus = function(status) {
                return chatHub.server.changeStatus(status);
            };

            this.registerMe = function() {
                return chatHub.server.registerMe();
            };

            this.sendMessageToPhysician = function(message) {
                var $def = $.Deferred();
                chatHub.server.sendMessageToPhysician(message).then(function(data) {
                    if (data && $.trim(data.msg) !== "") {
                        data.date = kendo.toString(new Date(), "hh:mm tt");
                        $def.resolve(data);
                    } else {
                        $def.reject();
                    }

                });
                return $def.promise();
            };

            this.sendMessageToParticipant = function(message) {
                return chatHub.server.sendMessageToParticipant(message);
            };

            this.sendMessageToPatient = function(message) {
                return chatHub.server.sendMessageToPatient(message);
            };

            this.sendMessageToUser = function(token, msg) {
                return chatHub.server.sendMessageToUser(token, msg);
            };

            this.getPhysicianStatus = function() {
                return chatHub.server.getPhysicianStatus();
            };

            this.refreshPatienNumberInPhysician = function(number) {
                return chatHub.server.refreshPatienNumberInPhysician(number);
            }

        }).singleton();


}(jQuery));

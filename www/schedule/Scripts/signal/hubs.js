/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";
    if (typeof($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function() {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function() {
        var proxies = {};
        this.starting(function() {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function() {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['consultationHub'] = this.createHubProxy('consultationHub');
        proxies['consultationHub'].client = {};
        proxies['consultationHub'].server = {
            disconnectConsultation: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["DisconnectConsultation"], $.makeArray(arguments)));
            },

            disconnectGuest: function(participantId) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["DisconnectGuest"], $.makeArray(arguments)));
            },

            disconnectPatient: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["DisconnectPatient"], $.makeArray(arguments)));
            },

            endConsultation: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["EndConsultation"], $.makeArray(arguments)));
            },

            getAll: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getConsultationTime: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["GetConsultationTime"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getPatientTemporaryContactNumber: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["GetPatientTemporaryContactNumber"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            isClientAvailable: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["IsClientAvailable"], $.makeArray(arguments)));
            },

            isPatientInMobileDevice: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["IsPatientInMobileDevice"], $.makeArray(arguments)));
            },

            isPhysicianInConsultationRoom: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["IsPhysicianInConsultationRoom"], $.makeArray(arguments)));
            },

            notifyCaptureImage: function(imgeId) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["NotifyCaptureImage"], $.makeArray(arguments)));
            },

            removeCaptureImage: function(imgId) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["RemoveCaptureImage"], $.makeArray(arguments)));
            },

            removeConnection: function(item) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["RemoveConnection"], $.makeArray(arguments)));
            },

            reviewConsultationReview: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["ReviewConsultationReview"], $.makeArray(arguments)));
            },

            startConsultation: function() {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["StartConsultation"], $.makeArray(arguments)));
            },

            updateParticipantDetails: function(Id, fullName) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["UpdateParticipantDetails"], $.makeArray(arguments)));
            },

            updatePatientNumber: function(number) {
                return proxies['consultationHub'].invoke.apply(proxies['consultationHub'], $.merge(["UpdatePatientNumber"], $.makeArray(arguments)));
            }
        };

        proxies['consultationsListingHub'] = this.createHubProxy('consultationsListingHub');
        proxies['consultationsListingHub'].client = {};
        proxies['consultationsListingHub'].server = {
            getAll: function() {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getConsultationsInfo: function(consultationRequest) {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["GetConsultationsInfo"], $.makeArray(arguments)));
            },

            getConsultationsInfoForPatient: function(consultationRequest) {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["GetConsultationsInfoForPatient"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            refresh: function() {
                return proxies['consultationsListingHub'].invoke.apply(proxies['consultationsListingHub'], $.merge(["Refresh"], $.makeArray(arguments)));
            }
        };

        proxies['creditHub'] = this.createHubProxy('creditHub');
        proxies['creditHub'].client = {};
        proxies['creditHub'].server = {
            getAll: function() {
                return proxies['creditHub'].invoke.apply(proxies['creditHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['creditHub'].invoke.apply(proxies['creditHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['creditHub'].invoke.apply(proxies['creditHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            }
        };

        proxies['dataBaseProfilerHub'] = this.createHubProxy('dataBaseProfilerHub');
        proxies['dataBaseProfilerHub'].client = {};
        proxies['dataBaseProfilerHub'].server = {};

        proxies['fileSharingHub'] = this.createHubProxy('fileSharingHub');
        proxies['fileSharingHub'].client = {};
        proxies['fileSharingHub'].server = {
            getAll: function() {
                return proxies['fileSharingHub'].invoke.apply(proxies['fileSharingHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['fileSharingHub'].invoke.apply(proxies['fileSharingHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['fileSharingHub'].invoke.apply(proxies['fileSharingHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            subscribeNotification: function() {
                return proxies['fileSharingHub'].invoke.apply(proxies['fileSharingHub'], $.merge(["SubscribeNotification"], $.makeArray(arguments)));
            }
        };

        proxies['messengerHub'] = this.createHubProxy('messengerHub');
        proxies['messengerHub'].client = {};
        proxies['messengerHub'].server = {
            acceptCall: function(userId, meetingId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["AcceptCall"], $.makeArray(arguments)));
            },

            broadcastChatMessage: function(meetingId, message) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["BroadcastChatMessage"], $.makeArray(arguments)));
            },

            callmateReentered: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["CallmateReentered"], $.makeArray(arguments)));
            },

            changeUserStatus: function(status) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["ChangeUserStatus"], $.makeArray(arguments)));
            },

            disconnectCall: function(userId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["DisconnectCall"], $.makeArray(arguments)));
            },

            disconnectPartisipant: function(participantId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["DisconnectPartisipant"], $.makeArray(arguments)));
            },

            endOpenConsultation: function(meetingId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["EndOpenConsultation"], $.makeArray(arguments)));
            },

            getAll: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getConsultationId: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["GetConsultationId"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            leaveMeeting: function(meetingId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["LeaveMeeting"], $.makeArray(arguments)));
            },

            leaveOpenConsultation: function(meetingId, participantId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["LeaveOpenConsultation"], $.makeArray(arguments)));
            },

            registerMeeting: function(meetingUId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["RegisterMeeting"], $.makeArray(arguments)));
            },

            rejctCall: function(userId, rejectTypeId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["RejctCall"], $.makeArray(arguments)));
            },

            sendChatMessage: function(participantId, message) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["SendChatMessage"], $.makeArray(arguments)));
            },

            sendConsultationChatMessage: function(consultationId, meetingId, senderPersonId, message) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["SendConsultationChatMessage"], $.makeArray(arguments)));
            },

            sendPreConsultationChatMessage: function(meetingId, senderPersonId, message) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["SendPreConsultationChatMessage"], $.makeArray(arguments)));
            },

            startCall: function(meetingSessionId, type, toUserId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["StartCall"], $.makeArray(arguments)));
            },

            switchToOpenConsultation: function(userId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["SwitchToOpenConsultation"], $.makeArray(arguments)));
            },

            updateParticipantLastRead: function(meetingId, personId) {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["UpdateParticipantLastRead"], $.makeArray(arguments)));
            },

            updateUsersStatus: function() {
                return proxies['messengerHub'].invoke.apply(proxies['messengerHub'], $.merge(["UpdateUsersStatus"], $.makeArray(arguments)));
            }
        };

        proxies['patientSelfSchedulingHub'] = this.createHubProxy('patientSelfSchedulingHub');
        proxies['patientSelfSchedulingHub'].client = {};
        proxies['patientSelfSchedulingHub'].server = {
            bookSlot: function(blockId, from, to) {
                return proxies['patientSelfSchedulingHub'].invoke.apply(proxies['patientSelfSchedulingHub'], $.merge(["BookSlot"], $.makeArray(arguments)));
            },

            changeDate: function(date) {
                return proxies['patientSelfSchedulingHub'].invoke.apply(proxies['patientSelfSchedulingHub'], $.merge(["ChangeDate"], $.makeArray(arguments)));
            },

            lockSlot: function(blockId, from, to) {
                return proxies['patientSelfSchedulingHub'].invoke.apply(proxies['patientSelfSchedulingHub'], $.merge(["LockSlot"], $.makeArray(arguments)));
            },

            unlockSlot: function(blockId, from, to) {
                return proxies['patientSelfSchedulingHub'].invoke.apply(proxies['patientSelfSchedulingHub'], $.merge(["UnlockSlot"], $.makeArray(arguments)));
            }
        };

        proxies['serviceTypesHub'] = this.createHubProxy('serviceTypesHub');
        proxies['serviceTypesHub'].client = {};
        proxies['serviceTypesHub'].server = {
            getAll: function() {
                return proxies['serviceTypesHub'].invoke.apply(proxies['serviceTypesHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['serviceTypesHub'].invoke.apply(proxies['serviceTypesHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['serviceTypesHub'].invoke.apply(proxies['serviceTypesHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            }
        };

        proxies['sessionLimiterHub'] = this.createHubProxy('sessionLimiterHub');
        proxies['sessionLimiterHub'].client = {};
        proxies['sessionLimiterHub'].server = {
            deactivatedPatient: function(patientUserId) {
                return proxies['sessionLimiterHub'].invoke.apply(proxies['sessionLimiterHub'], $.merge(["DeactivatedPatient"], $.makeArray(arguments)));
            },

            getAll: function() {
                return proxies['sessionLimiterHub'].invoke.apply(proxies['sessionLimiterHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['sessionLimiterHub'].invoke.apply(proxies['sessionLimiterHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['sessionLimiterHub'].invoke.apply(proxies['sessionLimiterHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            hello: function() {
                return proxies['sessionLimiterHub'].invoke.apply(proxies['sessionLimiterHub'], $.merge(["Hello"], $.makeArray(arguments)));
            }
        };

        proxies['snapChatService'] = this.createHubProxy('snapChatService');
        proxies['snapChatService'].client = {};
        proxies['snapChatService'].server = {
            changeStatus: function(status) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["ChangeStatus"], $.makeArray(arguments)));
            },

            getAll: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getConsultationMessage: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["GetConsultationMessage"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getPhysicianStatus: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["GetPhysicianStatus"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            refreshPatienNumberInPhysician: function(number) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["RefreshPatienNumberInPhysician"], $.makeArray(arguments)));
            },

            registerMe: function() {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["RegisterMe"], $.makeArray(arguments)));
            },

            sendMessageToParticipant: function(message) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["SendMessageToParticipant"], $.makeArray(arguments)));
            },

            sendMessageToPatient: function(message) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["SendMessageToPatient"], $.makeArray(arguments)));
            },

            sendMessageToPhysician: function(message) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["SendMessageToPhysician"], $.makeArray(arguments)));
            },

            sendMessageToUser: function(userID, message) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["sendMessageToUser"], $.makeArray(arguments)));
            },

            unRegisterMe: function(groupName) {
                return proxies['snapChatService'].invoke.apply(proxies['snapChatService'], $.merge(["UnRegisterMe"], $.makeArray(arguments)));
            }
        };

        proxies['snapNotificationsHub'] = this.createHubProxy('snapNotificationsHub');
        proxies['snapNotificationsHub'].client = {};
        proxies['snapNotificationsHub'].server = {
            getAll: function() {
                return proxies['snapNotificationsHub'].invoke.apply(proxies['snapNotificationsHub'], $.merge(["GetAll"], $.makeArray(arguments)));
            },

            getConnectionId: function() {
                return proxies['snapNotificationsHub'].invoke.apply(proxies['snapNotificationsHub'], $.merge(["GetConnectionId"], $.makeArray(arguments)));
            },

            getParticipantId: function() {
                return proxies['snapNotificationsHub'].invoke.apply(proxies['snapNotificationsHub'], $.merge(["GetParticipantId"], $.makeArray(arguments)));
            },

            getUserInfo: function() {
                return proxies['snapNotificationsHub'].invoke.apply(proxies['snapNotificationsHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
            },

            register: function() {
                return proxies['snapNotificationsHub'].invoke.apply(proxies['snapNotificationsHub'], $.merge(["Register"], $.makeArray(arguments)));
            }
        };

        proxies['snapWaitingRoomConsultationsHub'] = this.createHubProxy('snapWaitingRoomConsultationsHub');
        proxies['snapWaitingRoomConsultationsHub'].client = {};
        proxies['snapWaitingRoomConsultationsHub'].server = {
            getAdminFilter: function() {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["GetAdminFilter"], $.makeArray(arguments)));
            },

            getUserId: function() {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["GetUserId"], $.makeArray(arguments)));
            },

            getUserIdByConnectionId: function(conntectionId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["GetUserIdByConnectionId"], $.makeArray(arguments)));
            },

            isClientAvailable: function() {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["IsClientAvailable"], $.makeArray(arguments)));
            },

            isConsulationAvailableForView: function(consultationId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["IsConsulationAvailableForView"], $.makeArray(arguments)));
            },

            lockRequest: function(requestId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["LockRequest"], $.makeArray(arguments)));
            },

            refresh: function() {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["Refresh"], $.makeArray(arguments)));
            },

            refreshAdminPatientQueue: function() {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["RefreshAdminPatientQueue"], $.makeArray(arguments)));
            },

            renewLock: function(requestId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["RenewLock"], $.makeArray(arguments)));
            },

            saveAdminFilter: function(adminFilter) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["SaveAdminFilter"], $.makeArray(arguments)));
            },

            sendLockSlotToHospiatUsers: function(patientQueueLock) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["SendLockSlotToHospiatUsers"], $.makeArray(arguments)));
            },

            sendUnlockSlotToHospiatUsers: function(patientQueueLock) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["SendUnlockSlotToHospiatUsers"], $.makeArray(arguments)));
            },

            unlockRequest: function(requestId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["UnlockRequest"], $.makeArray(arguments)));
            },

            unremovableLockRequest: function(requestId) {
                return proxies['snapWaitingRoomConsultationsHub'].invoke.apply(proxies['snapWaitingRoomConsultationsHub'], $.merge(["UnremovableLockRequest"], $.makeArray(arguments)));
            }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("https://emerald.snap-qa.com/api/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));
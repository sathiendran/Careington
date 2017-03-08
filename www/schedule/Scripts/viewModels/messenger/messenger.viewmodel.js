//@ sourceURL=meeting.viewmodel.js

/// <reference path="../jquery-1.10.2.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
"use strict"


// ReSharper disable CoercedEqualsUsing
// ReSharper disable StringLiteralWrongQuotes
// Todo: Add comments describing the purpose of this file.
; (function ($, snap, kendo) {
    var callState = {
        none: 0,
        dial: 1,
        incomming: 2,
        started: 3,
        rejected: 4,
        end: 5,
        chat: 6
    };
    var ringtoneType = {
        incommingAudio: "incommingAudio",
        incommingVideo: "incommingVideo",
        callEnd: "callEnd",
        callDropped: "callDropped",
        incommingMessage: "incommingMessage"
    };

    var rejectType = {
        declined: 1,
        onAnotherCall: 2,
        noAnswer: 3,
        disconnected: 4,
        onConsultation: 5,
        unavailable: 6, // if onClientUnavailable triggered
        incompatible: 7
    };

    var callType = {
        video: 1,
        audio: 2
    };

    var statusMap = {
        73: 'Online',
        74: 'Offline',
        75: 'Busy',
        76: 'Away'
    };
    var participantTypeCode = {
        none: 0,
        patient: 1,
        practicioner: 2,
        relatedPerson: 3
    };

    var precedenceIndex = {
        offline: 1,
        away: 2,
        busy: 3,
        hasNewMsg: 4,
        online: 5,
        onlineWithNewMsg: 6
    };

    var wasNotOnlineMessage = "Has not logged in";

    var reasonPhrase = {
        declined: " has declined your call.",
        onAnotherCall: " is on another call.",
        noAnswer: " did not pickup the call.",
        onConsultation: " is on consultation.",
        disconnected: " was disconnected.",
        endedCall: " ended the call.",
        incompatible: " has incompatible for video/audio call browser."
    };
    var callWaitTime = 1000 * 60;
    var recentListMaxCapasity = 5;

    snap.namespace("snap.Shared")
        .use([
            "snap.hub.MeetingHub", "snapNotification", "snap.Service.MessengerService",
            "snap.hub.mainHub", "EventAggregator", "snap.admin.schedule.TimeUtils", "snap.Shared.providerChatTokboxModule"
        ])
        .extend(kendo.observable)
        .define("MessengerViewModel", function ($meetingHub, $snapNotification, $meetingService, $mainHub, $eventAggregator,
            $timeUtils, $providerChatTokboxModule) {

            var currentVideoMetaData = null;
            var tokboxFeedSize = {
                width: 375,
                height: 487
            };

            var reconnectTimeout = null,
                showCallPanelTimeout = null,
                reconnectWaitTime = 60 * 1000;

            var eventList = {};
            var $scope = this;
            var allUsers = [];
            var callStartFlag = null;

            var showCallPanelWaitTime = 5000;

            var isInitStarted = false;
            var shouldClearCall = false;

            var getTimeOrTimeAgoString = function (snapDateString) {
                var timeOffset = new Date() - new Date(snapDateString);
                var days = Math.round(timeOffset / (1000 * 60 * 60 * 24));

                if (days >= 1) {
                    return kendo.toString($timeUtils.dateFromSnapDateString(snapDateString), "M/d/yyyy");
                } else {
                    return kendo.toString($timeUtils.dateFromSnapDateString(snapDateString), "h:mmtt");
                }
            };

            var clearReconnectTimeout = function () {
                if (reconnectTimeout) {
                    window.clearTimeout(reconnectTimeout);
                    reconnectTimeout = null;
                }
            };

            var clearShowCallPanelTimeout = function () {
                if (showCallPanelTimeout) {
                    window.clearTimeout(showCallPanelTimeout);
                    showCallPanelTimeout = null;
                }
            };

            var updateStatusUI = function () {
                $scope.trigger("change", { field: "isAvailable" });
                $scope.trigger("change", { field: "isBusy" });
                $scope.trigger("change", { field: "isDnD" });
                $scope.trigger("change", { field: "isOffline" });
                $scope.trigger("change", { field: "selectedStatus" });
            };
            var currentChatHistory = {};
            var userParticipantMapping = {};
            var setAudioFlag = function (flag) {
                $scope.set("isActiveAudio", flag);
                $scope.set("isActiveAudioSession", flag);
                $scope.set("isVideoDisabled", flag);
                $scope.set("isActiveVideo", !flag);
                $scope.set("isActiveVideoSession", !flag);
                refreshAllUsers();
            };
            var switchToAudio = function () {
                $providerChatTokboxModule.switchToAudio();
            };
            var switchToVideo = function () {
                $providerChatTokboxModule.switchToVideo();
            };
            var showVideoAudioUI = function () {
                $scope.showCallPanel(true);

                $scope.set("isChatroomVisible", false);
                $scope.setActiveSession(true);
                $scope.set("isActiveChat", false);
                $scope.set("isScreenVisible", true);
                $scope._updateHeader();
                $scope.trigger("change", { field: "audioVideoOptions" });
                $scope.updateActiveBadgeVisibility();
            };
            var startTokboxSession = function (data, _isAudio) {
                if ($scope.callState == callState.none || $scope.callState == callState.end) {
                    return;
                }
                $scope.set("isVideoDisabled", false);
                $scope.set("isSubscriberAudioLost", false);
                $scope.set("isSelfAudioLost", false);
                $providerChatTokboxModule.startTokboxSession(data, _isAudio);
            };
            var initTokbox = function () {
                $providerChatTokboxModule.on("isSelfAudioLost", function(isLost) {
                    if ($scope.isActiveSession) {
                        $scope.set("isSelfAudioLost", isLost);
                    }
                });
                $providerChatTokboxModule.on("isSubscriberAudioLost", function(isLost) {
                    if ($scope.isActiveSession) {
                        $scope.set("isSubscriberAudioLost", isLost);
                    }
                });
                $providerChatTokboxModule.on("isAudioChanged", function (value) {
                    setAudioFlag(value);
                });
                $providerChatTokboxModule.on("sessionDisconnect", function () {
                    if (shouldClearCall) {
                        $scope._clearCall();
                    }
                });
                $providerChatTokboxModule.on("webRtcDisabled", function() {
                    $snapNotification.info("Your current browser only supports text chat.");
                    refreshAllUsers();
                });

                $providerChatTokboxModule.init({
                    feedSize: tokboxFeedSize,
                    containerName: "videobox",
                    userId: snap.profileSession.userId
                });
            };
            var soundPlayer;
            var playSound = function (soundType) {

                var sound = $meetingService.getRingtone(soundType);
                var isLoop = soundType === ringtoneType.incommingAudio || soundType === ringtoneType.incommingVideo;

                if (!isLoop && soundPlayer && soundPlayer.loop && !soundPlayer.paused) {
                    // if some sound already plays, pause it and then continue
                    var unloopedSoundPlayer = new Audio(sound);
                    stopSound(true).done(function () {
                        unloopedSoundPlayer.play();
                        setTimeout(function () {
                            if (soundPlayer) {
                                soundPlayer.play();
                            }
                        }, 1000);
                    });
                } else {
                    stopSound().done(function () {
                        soundPlayer = new Audio(sound);
                        soundPlayer.loop = isLoop;
                        soundPlayer.play();
                    });
                }

            };
            var stopSound = function (keepSoundPlayer) {
                var dfd = $.Deferred();
                if (soundPlayer) {
                    soundPlayer.pause();
                    setTimeout(function () {
                        if (soundPlayer) {
                            if (soundPlayer.paused) {
                                soundPlayer = keepSoundPlayer ? soundPlayer : null;
                                dfd.resolve();
                            } else {
                                dfd.reject();
                            }
                        } else {
                            dfd.resolve();
                        }
                    }, 200);
                } else {
                    dfd.resolve();
                }
                return dfd.promise();
            };

            /*Binding Object*/

            this.recentMeeting = [];
            this.allPhysician = [];
            this.providerStatusList = new kendo.data.DataSource({
                data: [{ text: "available", value: 1 },
                    { text: "busy", value: 2 },
                    { text: "away", value: 3 },
                    { text: "offline", value: 4 }]
            });

            this.selectedStatus = 1;
            this.onStatusChange = function () {
                var chatStatus = '';
                switch (this.selectedStatus) {
                    case 1:
                        chatStatus = "Online";
                        break;
                    case 2:
                        chatStatus = "Busy";
                        break;
                    case 3:
                        chatStatus = "Away";
                        break;
                    default:
                        chatStatus = "Offline";
                        break;

                }
                $meetingHub.changeUserStatus(chatStatus).then(function () {
                    updateStatusUI();
                });
            };
            this.isAvailable = function () {
                return this.selectedStatus === 1;
            };
            this.isBusy = function () {
                return this.selectedStatus === 2;
            };
            this.isDnD = function () {
                return this.selectedStatus === 3;
            };
            this.isOffline = function () {
                return this.selectedStatus === 4;
            };
            this.isConsultRoom = function() {
                return !! snap.ConsultationPage;
            };
            this.isActiveSession = false;
            this.isVisible = false;
            this.isListVisible = true;
            this.isChatPanelVisible = false;
            this.isProviderListActive = true;
            this.isChatroomVisible = false;
            this.isScreenVisible = true;
            this.isIncomingCall = false;
            this.showCallStateMessage = false;
            this.isFooterVisible = false;
            this.searchTerm = '';
            this.userAvailable = false;
            this.audioVideoOptions = function () {
                return this.openConsultationEnabled && this.isActiveSession && !this.isReconnecting && this.isCallStarted();
            };
            this.user = snap.profileSession;
            this.callState = callState.none;
            this.currentUserChatHistory = [];
            this.isVideoDisabled = false;
            this.isMicDisabled = false;
            this.isRecentListActive = false;
            this.recentList = [];
            this.isActiveVideo = false;
            this.isActiveVideoSession = false;
            this.isActiveAudioSession = false;
            this.isActiveAudio = false;
            this.isActiveChat = false;
            this.isReconnecting = false;
            this.callStateMessage = '';
            this.footerBtnText = '';

            this.headerViewmodel = null;
            this.activeUserHasNewMsg = false;

            this.dataLoaded = false;
            this.vm_isProviderListLoading = false;
            this.openConsultationEnabled = !snap.hospitalSettings.hideOpenConsultation && snap.hasAnyPermission(snap.security.open_consultation);
            this.isSubscriberAudioLost = false;
            this.isSelfAudioLost = false;


            this.toggleCamera = function (e) {
                this.preventDefault(e);
                if (kendo.support.mobileOS && this.isActiveVideo) {
                    $providerChatTokboxModule.toggleCamera();
                }
            };

            this.setActiveSession = function (value) {
                this.set("isActiveSession", value);
                snap.isActiveWebRTC = value;
            };

            this.updateActiveBadgeVisibility = function () {
                if (this.headerViewmodel) {
                    var displayActiveBadge = this.isActiveSession && (!this.isVisible || !this.isScreenVisible || this.isListVisible);
                    //var displayIncomingCall = !this.isVisible || !this.isListVisible;
                    this.headerViewmodel.set("activeBadgeVisible", displayActiveBadge);
                    // hide incoming call icon
                    //this.headerViewmodel.set("hasIncomingCall", displayIncomingCall ? this.isIncomingCall : false);
                }
            };

            this._updateHeader = function () {
                if (this.headerViewmodel) {
                    var msgSum = this._newMsgSum();
                    var displayMsgCount = !this.isVisible || !this.isListVisible;
                    this.headerViewmodel.set("hasNewMsg", displayMsgCount ? msgSum > 0 : false);
                    this.headerViewmodel.set("countNewDlg", displayMsgCount ? msgSum : 0);
                    this.updateActiveBadgeVisibility();
                }
            };

            this._newMsgSum = function () {
                var msgSum = 0;
                this.allPhysician.forEach(function (item) {
                    msgSum += item.countNewMsg;
                });
                return msgSum;
            };

            this._newMsgFromActiveUser = function () {
                var user = this.findUser($scope.activeUser.userId);
                return user ? user.countNewMsg : 0;
            };

            this._setVisibility = function (value) {
                this.set("isVisible", value);

                if (this.isVisible && this.isChatPanelVisible && this.isChatroomVisible) {
                    this.removeUnreadMessages(this.activeUser.userId);
                    var participantData = userParticipantMapping[this.activeUser.userId];
                    $meetingHub.updateParticipantLastRead(participantData.meetingId, snap.profileSession.personId);
                }

                this._updateHeader();
            };
            this.closeMessenger = function (e) {
                this.preventDefault(e);
                this._setVisibility(false);
            };
            this.showRecentList = function (e) {
                this.preventDefault(e);
                this.set("isRecentListActive", !this.isRecentListActive);
                $('.staff-messenger__recent-list').slideToggle();
                this.trigger("change", { field: "noRecentResultsFound" });
            };
            this.allList = true;
            this.showAllList = function (e) {
                this.preventDefault(e);
                this.set("allList", !this.allList);
                $('.staff-messenger__all-list').slideToggle();
                this.trigger("change", { field: "noAllPhysicianResultsFound" });
            };
            $.extend(this.user, {
                age: 0
            });

            this.triggerEvent = function (name) {
                var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                var eventCbList = eventList[name];
                if (eventCbList) {
                    $.each(eventCbList, function () {
                        return this.apply($scope, args);
                    });
                }
            };

            this.on = function (eventName, cb) {
                var eventCbList = eventList[eventName];
                if (!eventCbList) {
                    eventCbList = [];
                }
                eventCbList.push(cb);
                eventList[eventName] = eventCbList;
            };

            this.onSearchKeyUp = function () {
                $scope.trigger("change", { field: "getAllPhysician" });
                $scope.trigger("change", { field: "getRecentList" });
                $scope.trigger("change", { field: "noAllPhysicianResultsFound" });
                $scope.trigger("change", { field: "noRecentResultsFound" });
            };
            this.initData = function () {
                this.set("vm_isProviderListLoading", true);
                this.dataLoaded = false;
                var dfd = $.Deferred();
                if (isInitStarted) {
                    return;
                }
                isInitStarted = true;
                $meetingService.getPhysicians().then(function (data) {
                    data = data.data[0];
                    var tmpList = [];
                    if ($.isArray(data)) {
                        data.forEach(function (item) {
                            if (item.userId !== snap.profileSession.userId) {
                                tmpList.push(new User(item));
                            }
                        });
                    }
                    $scope.set("allPhysician", tmpList);
                    $scope.updateUserListSort();
                    refreshAllUsers();
                    $scope.dataLoaded = true;
                    $scope.triggerEvent("dataLoaded");

                    if ($meetingHub.isHubStarted()) {
                        // if hub started before all data loaded, we need to refresh providers statuses
                        $meetingHub.updateUsersStatus().then(function(users) {
                            onUserListUpdate(users);
                        }, function() {
                            $snapNotification.error("Failed to load users statuses");
                            $scope.set("vm_isProviderListLoading", false);
                        });
                    }
                    dfd.resolve();
                });
                return dfd.promise();
            };

            this.toggleChat = function () {
                var dfd = $.Deferred();
                refreshAllUsers();
                this._setVisibility(!this.isVisible);

                dfd.resolve();
            };

            this._insertMessageIntoHistory = function (data, chatUser) {
                if (data) {
                    var chatUserId = chatUser.userId;

                    if (!currentChatHistory[chatUserId]) {
                        currentChatHistory[chatUserId] = [];
                    }
                    var chatHistory = currentChatHistory[chatUserId];
                    var last = chatHistory[chatHistory.length - 1];
                    data.senderCss = "";
                    if (last) {
                        if (last.userId === data.userId) {
                            data.senderCss = "is-mine is-same";
                        } else {
                            data.senderCss = "is-mine";
                        }
                    }
                    if (!data.profileImagePath) {
                        var gender;
                        if (data.userId == snap.profileSession.userId) {
                            gender = snap.profileSession.gender;
                        } else {
                            var fromUser = $scope.findUser(data.userId);
                            gender = fromUser ? fromUser.gender : null;
                        }

                        data.profileImagePath = getDefaultProfileImageForClinician(gender);
                    }

                    data.formattedSentDate = getTimeOrTimeAgoString(data.sentDate);
                    chatHistory.push(data);
                }
            };

            this._receivedMessageInternal = function (data, chatUser, doCheckForUnique) {
                if (data) {
                    var doInsert = true;
                    var chatUserId = chatUser.userId;

                    if (doCheckForUnique) {
                        var foundItem = currentChatHistory[chatUserId].find(function (chatItem) {
                            return chatItem.conversationId === data.message.conversationId;
                        });
                        doInsert = !foundItem;
                    }

                    if (doInsert) {
                        $scope._insertMessageIntoHistory(data, chatUser);
                    }

                    if (chatUserId === $scope.activeUser.userId) {
                        $scope._scrollAndUpdateChat(chatUserId);
                    }
                }
            };

            this.isDialogActive  = function(userId) {
                return this.isVisible && this.isChatroomVisible && this.isChatPanelVisible && userId == this.activeUser.userId;
            };

            this._startCall = function (currentUser, _isAudio) {
                $meetingService.createMeeting().then(function (data) {
                    data = data.data[0];
                    currentUser.meetingInfo = data;
                    $meetingService.createSession(data.meetingId).then(function (sessionData) {

                        sessionData = sessionData.data[0];
                        currentUser.meetingSession = sessionData;

                        $scope.allPhysician.forEach(function (item) {
                            if (item.userId == currentUser.userId) {
                                item.meetingInfo = data;
                            }
                        });
                        $scope.setActiveUser(currentUser);
                        showVideoAudioUI();
                        var curCallType = _isAudio ? callType.audio : callType.video;
                        $meetingHub.startCall(sessionData.meetingSessionId, curCallType, currentUser.userId).then(function (meeetingSessionData) {
                            if (!$scope.showCallStateMessage) {
                                $scope.callState = callState.dial;
                                currentVideoMetaData = meeetingSessionData;
                                startTokboxSession(meeetingSessionData, _isAudio);
                            }
                        });
                    });

                });
            };


            this.startAudioCall = function (e) {
                this.preventDefault(e);
                clearShowCallPanelTimeout();
                if (($scope.isActiveVideo || $scope.isActiveAudio) && !$scope.isCalling()) {
                    return;
                }
                if (snap.ConsultationPage) {
                    $snapNotification.info("Audio call is not allowed during the consulation.");
                    return;
                }
                $scope.set("isFooterVisible", false);
                var currentUser = e.data.userId ? e.data : (this.activeMessengerUser.userId ? this.activeMessengerUser : this.activeUser);

                $providerChatTokboxModule.hasAudioSource().then(function () {
                    $scope.setActiveUser(currentUser, true);
                    $scope.set("isActiveAudio", true);
                    $scope.set("isActiveAudioSession", true);
                    $scope.set("isActiveChat", false);
                    $scope.set("showCallStateMessage", false);

                    if ($scope.isActiveVideo || $scope.isActiveVideoSession) {
                        $scope.set("isActiveVideo", false);
                        $scope.set("isActiveVideoSession", false);
                        switchToAudio();
                    }

                    if (currentUser.status === 'Online') {
                        if ($scope.callState == callState.none || $scope.callState == callState.end) {
                            $scope._startCall(currentUser, true);
                        } else {
                            showVideoAudioUI();
                        }
                    } else if (currentUser.userId === $scope.activeMessengerUser.userId && $scope.isCalling()) {
                        showVideoAudioUI();
                    }
                    refreshAllUsers();
                }, function () {
                    $snapNotification.info("Audio call is not available. Couldn't find a mic.");
                });
            };

            this.startVideoCall = function (e) {
                this.preventDefault(e);
                clearShowCallPanelTimeout();
                if (($scope.isActiveVideo || $scope.isActiveAudio) && !$scope.isCalling()) {
                    return;
                }
                if (snap.ConsultationPage) {
                    $snapNotification.info("Video call is not allowed during the consulation.");
                    return;
                }
                $scope.set("isFooterVisible", false);
                var currentUser = e.data.userId ? e.data : (this.activeMessengerUser.userId ? this.activeMessengerUser : this.activeUser);

                $providerChatTokboxModule.hasVideoSource().then(function () {
                    $scope.setActiveUser(currentUser, true);
                    $scope.set("isActiveVideo", true);
                    $scope.set("isActiveVideoSession", true);
                    $scope.set("isActiveChat", false);
                    $scope.set("showCallStateMessage", false);

                    if ($scope.isActiveAudio || $scope.isActiveAudioSession) {
                        $scope.set("isActiveAudio", false);
                        $scope.set("isActiveAudioSession", false);
                        switchToVideo();
                    }

                    if (currentUser.status === 'Online') {
                        if ($scope.callState == callState.none || $scope.callState == callState.end) {
                            $scope._startCall(currentUser, false);
                        } else {
                            showVideoAudioUI();
                        }
                    } else if (currentUser.userId === $scope.activeMessengerUser.userId && $scope.isCalling()) {
                        showVideoAudioUI();
                    }
                    refreshAllUsers();
                }, function () {
                    $snapNotification.info("Video call is not available. Couldn't find a webcam.");
                });


            };
            this.isSwitchingToOC = false;
            var clearCurrentCall = function (isInitiator) {
                var currentUserId = $scope.activeMessengerUser.userId || $scope.activeUser.userId;
                if (isInitiator) {
                    $meetingHub.disconnectCall(currentUserId);
                }
                $scope.callState = callState.end;
                $providerChatTokboxModule.disconnectSession(true);
                stopSound();
                $scope._clearCall(true);
            };
            var switchToOpenConsultation = function() {
                $scope.headerViewmodel.providerChat();
                var currentUserId = $scope.activeMessengerUser.userId || $scope.activeUser.userId;
                $meetingHub.switchToOpenConsultation(currentUserId).then(function (data) {
                    sessionStorage.setItem("participantId", data.participantId);
                    redirectToOpenConsultation(data.meetingId);
                }, function(error) {
                    $snapNotification.error("Unable to switch to open consultation");
                    window.console.log(error);
                });
                    
            };
            var redirectToOpenConsultation = function (meetingId) {
                clearCurrentCall();
                location.href = "/Physician/Main/#/openconsultation/" + meetingId;
            };
            this.openConsulation = function (e) {
                this.preventDefault(e);
                if (snap.ConsultationPage) {
                    return;
                }
                $snapNotification.confirmationWithCallbacks("Are you sure you want to initiate open consultation?", function() {
                    switchToOpenConsultation();
                });
            };

            this.addParticipants = function (e) {
                this.preventDefault(e);
                var data = JSON.parse(sessionStorage.getItem("meetingdata"));
                data = data || {};
                data.openInvitationPanel = true;
                sessionStorage.setItem("meetingdata", JSON.stringify(data));
                this.openConsulation();
            };

            this.preventDefault = function (e) {
                if (typeof e !== "undefined") {
                    e.preventDefault();
                }
                return false;
            };
            this.refreshChatData = function () {
                $scope.trigger("change", { field: "currentUserChatHistory" });
            };

            var distinctHistory = function (chatHistory) {
                var uniqueChatHistory = [];
                chatHistory.forEach(function (item) {
                    var foundItem = uniqueChatHistory.find(function (chatItem) {
                        return chatItem.conversationId === item.conversationId;
                    });
                    if (!foundItem) {
                        uniqueChatHistory.push(item);
                    }
                });
                return uniqueChatHistory;
            };
            this.loadChatHistory = function (user) {
                var $def = $.Deferred();
                var userId = user.userId;

                $meetingService.getUserConversationHistories(userId).then(function (chatData) {
                    chatData = chatData.data;
                    chatData.forEach(function (data) {
                        $scope._insertMessageIntoHistory(data, user);
                    });

                    currentChatHistory[userId] = distinctHistory(currentChatHistory[userId]);

                    currentChatHistory[userId].sort(function (item1, item2) {
                        var data1 = new Date(item1.sentDate);
                        var data2 = new Date(item2.sentDate);
                        return data1.getTime() - data2.getTime();
                    });
                    if ($scope.activeUser.userId === userId) {
                        $scope._scrollAndUpdateChat(userId);
                    }
                    $def.resolve();
                });
                return $def.promise();
            };

            this.setActiveUser = function (currentUser, isAudioVideo) {
                if (isAudioVideo) {
                    this.set("activeMessengerUser", currentUser);
                }
                this.set("activeUser", currentUser);
            };

            var refreshAllUsers = function () {
                $scope.trigger("change", { field: "activeUser" });
                $scope.trigger("change", { field: "activeMessengerUser" });
                $scope.trigger("change", { field: "getAllPhysician" });
                $scope.trigger("change", { field: "getRecentList" });
            };

            var refreshListUsers = function () {
                $scope.trigger("change", { field: "getAllPhysician" });
                $scope.trigger("change", { field: "getRecentList" });
            };

            this._scrollAndUpdateChat = function (userId) {
                $scope.set("currentUserChatHistory", currentChatHistory[userId]);
                var $t = $('.chat__messages-container');
                $t.animate({ "scrollTop": $('.chat__messages-container')[0].scrollHeight }, "slow");
            };

            this.switchChat = function (currentUser) {
                var currentUserId = currentUser.userId;
                $scope.setActiveUser(currentUser);
                if (!currentChatHistory[currentUserId]) {
                    currentChatHistory[currentUserId] = [];
                }
                $scope._scrollAndUpdateChat(currentUserId);
                $scope.removeUnreadMessages(currentUserId);

                if (currentChatHistory[currentUserId].length === 0) {
                    $scope.loadChatHistory(currentUser);
                }
            };

            this._startChatInternal = function (currentUser, participantData) {
                $scope.showCallPanel(true);
                $scope.set("isChatroomVisible", true);
                $scope.set("isScreenVisible", false);
                $scope.switchChat(currentUser);
                $meetingHub.updateParticipantLastRead(participantData.meetingId, snap.profileSession.personId);
            };

            this.startChat = function (e) {
                this.preventDefault(e);
                clearShowCallPanelTimeout();
                $scope.set("isFooterVisible", false);

                var currentUser = e.data.userId ? e.data : (this.activeMessengerUser.userId ? this.activeMessengerUser : this.activeUser);

                var participantData = userParticipantMapping[currentUser.userId];
                if (participantData) {
                    this._startChatInternal(currentUser, participantData);
                } else {
                    $meetingService.getOrCreateMeetingId(currentUser.userId).then(function (meetingId) {
                        $meetingService.createParticipant(meetingId, currentUser.userId, participantTypeCode.practicioner).then(function (participantData) {
                            participantData = participantData.data[0];
                            if (participantData.userId === 0) {
                                participantData.userId = currentUser.userId;
                            }
                            userParticipantMapping[currentUser.userId] = participantData;
                            $scope._startChatInternal(currentUser, participantData);
                        });
                    });
                }

                this.set("isActiveChat", true);
                this.set("isActiveVideo", false);
                this.set("isActiveAudio", false);
            };

            this.currentMessageBody = "";

            this.acceptCall = function (e) {
                this.preventDefault(e);
                stopSound();
                var dfd = $.Deferred();
                callStartFlag = new Date().getTime();
                $meetingHub.acceptCall(this.activeUser.userId, currentVideoMetaData.MeetingId).then(function () {
                    $scope.setActiveUser($scope.activeUser, true);
                    $scope.callState = callState.started;
                    startTokboxSession(currentVideoMetaData, $scope.isActiveAudio);
                    dfd.resolve();
                    $scope.setActiveSession(true);
                    $scope.set("isIncomingCall", false);
                    $scope.set("userAvailable", true);
                    $scope.trigger("change", { field: "audioVideoOptions" });
                    $scope.updateActiveBadgeVisibility();
                    $providerChatTokboxModule.onAcceptCall();
                }, function () {
                    dfd.reject();
                });
                return dfd.promise();
            };
            this._clearActiveUser = function () {

                this.activeUser = new User({
                    firstName: "",
                    lastName: "",
                    userId: 0
                });
                this.activeMessengerUser = new User({
                    firstName: "",
                    lastName: "",
                    userId: 0
                });
                this.activeUser.setUserStatus("Online");
                this.activeMessengerUser.setUserStatus("Online");
            };
            this._clearActiveUser();
            this._clearCall = function (withTimeout) {
                shouldClearCall = false;
                setTimeout(function () {
                    shouldClearCall = true;
                }, 3000);
                $scope.callState = callState.none;
                $scope.set("isActiveVideo", false);
                $scope.set("isActiveVideoSession", false);
                $scope.set("isActiveAudio", false);
                $scope.set("isActiveAudioSession", false);
                $scope.setActiveSession(false);
                $scope.set("isIncomingCall", false);
                $scope.set("userAvailable", false);

                $scope.set("isSubscriberAudioLost", false);
                $scope.set("isSelfAudioLost", false);

                $scope.trigger("change", { field: "audioVideoOptions" });

                $scope.updateActiveBadgeVisibility();
                $scope.updateLoginStatus();
                $scope.updateUserListSort();
                refreshAllUsers();

                var waitTime = withTimeout ? showCallPanelWaitTime : 0;
                clearShowCallPanelTimeout(); // clear timeout before set it
                showCallPanelTimeout = setTimeout(function () {
                    $scope.showCallPanel(false);
                    $scope._clearActiveUser();
                    if ($scope.showCallStateMessage) {
                        $scope.set("userAvailable", false);
                        $scope.set("showCallStateMessage", false);
                    }
                    $scope.set("isFooterVisible", false);
                }, waitTime);
            };

            this.endCall = function (e) {
                this.preventDefault(e);
                $scope.callState = callState.end;
                $providerChatTokboxModule.disconnectSession();
                if (e) {
                    //only play when directly end call
                    playSound(ringtoneType.callEnd);
                }
                $scope._clearCall(true);
                $scope.set("isActiveChat", false);
            };

            this.returnToProviders = function (e) {
                clearShowCallPanelTimeout();
                this.preventDefault(e);

                this.set("showCallStateMessage", false);
                $scope.set("isFooterVisible", false);

                if ($scope.callState == callState.started || $scope.callState == callState.dial) {
                    if ($scope.isReconnecting && $scope.callState == callState.started) {
                        $scope.set("isReconnecting", false);
                        $scope.disconnectCall();
                        clearReconnectTimeout();
                    }
                    return;
                }

                $scope.showCallPanel(false);
            };

            this.rejectCall = function (e) {
                this.preventDefault(e);
                stopSound();
                if (currentVideoMetaData) {
                    $meetingHub.rejctCall(currentVideoMetaData.CallRequestId).then(function () {
                        $scope._clearCall();
                    });
                }
            };

            this.muteVideo = function (e) {
                this.preventDefault(e);
                if (this.isVideoDisabled) {
                    switchToVideo();
                } else {
                    switchToAudio();
                }
            };

            this.muteAudio = function (e) {
                this.preventDefault(e);
                if ($providerChatTokboxModule.muteAudio(!this.isMicDisabled)) {
                    this.set("isMicDisabled", !this.isMicDisabled);
                }
            };

            this.onFullScreen = function () {
                $providerChatTokboxModule.onFullScreen();
            };

            /*Send message to selected Client */
            this.sendMessage = function (e) {
                this.preventDefault(e);

                var message = this.currentMessageBody;
                var userId = this.activeUser.userId;
                addToRecent(userId, false);

                if (message === "") {
                    return;
                }
                this.set("currentMessageBody", "");

                var participantData = userParticipantMapping[userId];
                $meetingHub.sendChatMessage(participantData.participantId, message).then(function (data) {
                    $scope._receivedMessageInternal(data, $scope.activeUser);
                    $scope.set("currentMessageBody", "");
                    $scope._scrollAndUpdateChat(userId);
                });
            };

            this.onKeypress = function (e) {
                if ((e.keyCode == 10 || e.keyCode == 13) && (e.shiftKey || e.ctrlKey)) {
                    // ctrl + enter, ctrl + shift
                    this.preventDefault(e);
                    this.set("currentMessageBody", this.currentMessageBody + '\n');
                } else if (e.keyCode == 13) {
                    this.sendMessage(e);
                }
            };
            this.disconnectCallForOC = function (e) {
                this.preventDefault(e);
                $providerChatTokboxModule.disconnectSession();
                $scope._clearCall(true);
            };

            this.disconnectCall = function (e) {
                this.preventDefault(e);
                var currentUserId = this.activeMessengerUser.userId || this.activeUser.userId;

                $meetingHub.disconnectCall(currentUserId);
                $scope.set("showCallStateMessage", true);
                $scope.set("callStateMessage", "You have ended the call with " + $scope.activeMessengerUser.fullName + ".");
                $scope.callState = callState.end;
                $providerChatTokboxModule.disconnectSession();
                $scope._clearCall(true);
            };

            this.showProviderList = function (e) {
                this.preventDefault(e);

                if ($scope.callState === callState.none && this.isChatPanelVisible) {
                    this.set("isListVisible", !this.isListVisible);
                    this.set("isChatPanelVisible", !this.isChatPanelVisible);
                    this.set("isProviderListActive", !this.isProviderListActive);
                    this._updateHeader();
                    return;
                } else if ($scope.callState === callState.none || $scope.callState === callState.rejected || $scope.callState === callState.end) {

                    return;
                }
                $scope.updateLoginStatus();
                $scope.updateUserListSort();
                refreshAllUsers();

                this.set("isListVisible", !this.isListVisible);
                this.set("isChatPanelVisible", !this.isChatPanelVisible);
                this.set("isProviderListActive", !this.isProviderListActive);

                this._updateHeader();
            };

            this.showCallPanel = function (flag) {
                this.set("isListVisible", !flag);
                this.set("isChatPanelVisible", flag);
                this.set("isProviderListActive", !flag);
            };

            this.showActiveCallScreen = function () {
                this.showCallPanel(true);
            };

            this.showActiveChatScreen = function () {
                this.showCallPanel(true);
            };

            this.updateUserListSort = function () {
                this.allPhysician = this.allPhysician.sort(function (item1, item2) {
                    if (item1.precedenceIndex === item2.precedenceIndex) {
                        return item1.fullName > item2.fullName ? 1 : -1;
                    } else {
                        return item1.precedenceIndex < item2.precedenceIndex ? 1 : -1;
                    }
                });
            };

            this.removeUnreadMessages = function (userId) {

                var writeUser = this.findUser(userId);
                if (writeUser) {
                    writeUser.setMsgCount(0);
                    $scope.updateUserListSort();
                    refreshAllUsers();
                }
                $scope._updateHeader();
            };


            var loadUnreadConversations = function (personId) {
                var dfd = $.Deferred();
                $meetingService.getUnreadConversations(personId).done(function (resp) {
                    if (resp.data && resp.data.length) {
                        resp.data.forEach(function (item) {
                            var user = $scope.findUser(item.userId);
                            if (user) {
                                user.setMsgCount(item.countNewMsg);
                            }
                        });
                        $scope.updateUserListSort();
                        refreshAllUsers();
                        $scope._updateHeader();
                        dfd.resolve();
                    }
                });
                return dfd.promise();
            };

            var loadRecentList = function (personId) {
                $meetingService.getLastParticipantsList(personId, recentListMaxCapasity).done(function (resp) {
                    if (resp.data && resp.data.length) {
                        resp.data.reverse(); // we need to reverce so that the last items will displace first
                        resp.data.forEach(function (item) {
                            var user = $scope.findUser(item.userId);
                            if (user) {
                                pushToRecentList(user.userId);
                                snap.addToSnapChatRecentSession(user.userId);
                            }
                        });
                        if ($scope.recentList.length) {
                            $scope.showRecentList();
                        }
                        refreshListUsers();
                    }
                });
            };

            var initRecentFromSession = function () {
                if (snap.chatRecentSession) {
                    snap.chatRecentSession.forEach(function (userId) {
                        var writeUser = $scope.findUser(userId);
                        if (writeUser) {
                            pushToRecentList(writeUser.userId);
                        }
                    });
                    if ($scope.recentList.length) {
                        $scope.showRecentList();
                    }
                    refreshListUsers();
                    return snap.chatRecentSession.length;
                }
                return 0;
            };

            var pushToRecentList = function (userId) {
                var oldIndex = $scope.recentList.indexOf(userId);
                if (oldIndex >= 0) {
                    $scope.recentList.splice(oldIndex, 1);
                }
                $scope.recentList.unshift(userId);

                if ($scope.recentList.length > recentListMaxCapasity) {
                    $scope.recentList.pop();
                }
            };

            var addToRecent = function (userId, hasNewMsg) {
                var writeUser = $scope.findUser(userId);
                if (writeUser) {
                    if (hasNewMsg && !$scope.isDialogActive(userId)) {
                        writeUser.incrementNewMsg();
                        playSound(ringtoneType.incommingMessage);
                    }
                    pushToRecentList(userId);
                    snap.addToSnapChatRecentSession(userId);
                }
                $scope.updateUserListSort();
                refreshAllUsers();
                $scope._updateHeader();
            };

            this.initHeaderViewModel = function ($viewmodel) {
                this.headerViewmodel = $viewmodel;
            };

            this.updateLoginStatus = function () {
                var userId = $scope.user.userId;
                var currentUser = allUsers.find(function (item) {
                    return item.UserId === userId;
                });
                if (currentUser) {
                    if (currentUser.StatusID === 73) {
                        $scope.selectedStatus = 1;
                    }
                    else if (currentUser.StatusID === 75) {
                        $scope.selectedStatus = 2;
                    }
                    else if (currentUser.StatusID === 76) {
                        $scope.selectedStatus = 3;
                    } else {
                        $scope.selectedStatus = 4;
                    }
                    updateStatusUI();
                }
            };

            this.findUser = function (userId) {
                return this.allPhysician.find(function (item) {
                    return item.userId === userId;
                });
            };

            this.getAllPhysician = function () {
                var tmp = [];
                var searchTerm = this.searchTerm.toLowerCase();
                this.allPhysician.forEach(function (item) {
                    var name = (item.fullName || '').toLowerCase();
                    if (searchTerm.length === 0 || name.indexOf(searchTerm) >= 0) {
                        tmp.push(item);
                    } else {
                        var departmentName = (item.departmentName || '').toLowerCase();
                        if (departmentName.indexOf(searchTerm) >= 0) {
                            tmp.push(item);
                        }
                    }
                });
                return tmp;
            };

            this.getRecentList = function () {
                var tmp = [];
                var searchTerm = this.searchTerm.toLowerCase();
                this.recentList.forEach(function (userId) {
                    var user = $scope.findUser(userId);
                    if (user) {
                        var name = (user.fullName || '').toLowerCase();
                        if (searchTerm.length === 0 || name.indexOf(searchTerm) >= 0) {
                            tmp.push(user);
                        } else {
                            var departmentName = (user.departmentName || '').toLowerCase();
                            if (departmentName.indexOf(searchTerm) >= 0) {
                                tmp.push(user);
                            }
                        }
                    }
                });
                return tmp;
            };

            this.noAllPhysicianResultsFound = function () {
                return this.allList && this.searchTerm.length > 0 && this.getAllPhysician().length === 0;
            };
            this.noRecentResultsFound = function () {
                return this.isRecentListActive && this.searchTerm.length > 0 && this.getRecentList().length === 0;
            };

            this.initCall = function (currentUser, isAudioCall, videoKey) {
                $scope.callState = callState.incomming;
                currentVideoMetaData = videoKey;
                $scope.set("isSelfAudioLost", false);
                $scope.set("isSubscriberAudioLost", false);
                $scope.setActiveUser(currentUser, true);
                $scope._setVisibility(true);
                $scope.set("isChatroomVisible", false);
                $scope.set("isScreenVisible", true);
                $scope.showCallPanel(true);
                $scope.set("isIncomingCall", true);
                $scope.set("isChatroomVisible", false);
                $scope.set("userAvailable", true);
                setAudioFlag(isAudioCall);
                $scope.setActiveSession(true);
                $scope.updateActiveBadgeVisibility();

                var currentFlag = new Date().getTime();
                callStartFlag = currentFlag;
                reconnectTimeout = setTimeout(function () {
                    if (currentFlag == callStartFlag) {
                        stopSound();
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.noAnswer);
                        $scope._clearCall();
                    }
                }, callWaitTime);
            };

            $eventAggregator.subscribe("forceLogout", function () {
                if ($scope.callState == callState.dial) {
                    $scope.disconnectCall();
                } else if ($scope.callState == callState.incomming) {
                    $scope.rejectCall();
                } else {
                    $providerChatTokboxModule.disconnectSession();
                    $scope._clearCall(false);
                }
            });

            this.onRejectCall = function (rejectTypeId) {
                clearReconnectTimeout();
                stopSound();
                $scope.set("showCallStateMessage", true);
                $scope.set("userAvailable", false);
                $scope.set("footerBtnText", "Back To List");
                $scope.set("isFooterVisible", true);
                if (rejectTypeId === rejectType.declined) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.declined);
                } else if (rejectTypeId === rejectType.onAnotherCall) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.onAnotherCall);
                } else if (rejectTypeId === rejectType.noAnswer) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.noAnswer);
                } else if (rejectTypeId === rejectType.onConsultation) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.onConsultation);
                } else if (rejectTypeId === rejectType.unavailable) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.disconnected);
                } else if (rejectTypeId === rejectType.incompatible) {
                    $scope.set("callStateMessage", $scope.activeUser.fullName + reasonPhrase.incompatible);
                }
                playSound(ringtoneType.callDropped);
                $scope.endCall();
            };

            this.isCalling = function() {
                return $scope.callState == callState.started || $scope.callState == callState.incomming || $scope.callState == callState.dial;
            };

            this.isCallStarted = function() {
                return $scope.callState == callState.started;
            };

            this.endCallInternal = function () {
                if ($scope.callState == callState.started) {
                    $scope.disconnectCall();
                } else if ($scope.callState == callState.dial) {
                    // if we are calling this user at the moment
                    $scope.disconnectCall();
                } else if ($scope.callState == callState.incomming) {
                    // if we have an incoming call
                    $scope.rejectCall();
                }
            };

            this.onDisconnectCall = function (reason) {
                clearReconnectTimeout();
                stopSound();
                playSound(ringtoneType.callEnd);
                var message;
                if (reason && reason.trim() !== "") {
                    message = reason;
                } else {
                    message = $scope.activeUser.fullName + reasonPhrase.endedCall;
                }
                $scope.set("showCallStateMessage", true);
                $scope.set("callStateMessage", message);
                $scope.set("footerBtnText", "Back To List");
                $scope.set("isFooterVisible", true);
                $scope.endCall();
            };

            var onUserListUpdate = function(users) {
                if (!$.isArray(users)) {
                    users = [];
                }
                allUsers = users;

                $scope.updateLoginStatus();
                $scope.allPhysician.forEach(function (item) {
                    item.updateUserStatus();
                });
                $scope.updateUserListSort();
                refreshAllUsers();
                if ($scope.dataLoaded) {
                    $scope.set("vm_isProviderListLoading", false);
                }
            };

            this.initChatEvent = function () {
                $meetingHub.on("onUserListUpdate", function (users) {
                    onUserListUpdate(users);
                });
            };

            this.onReenterCall = function (callParams, callmateUserId) {
                clearShowCallPanelTimeout();
                $scope.set("isFooterVisible", false);
                $scope.callState = callState.incomming;
                var callmateUser = $scope.findUser(callmateUserId);

                $scope.initCall(callmateUser, callParams.CallType == callType.audio, callParams);
                $scope.acceptCall().done(function () {
                    $scope.callState = callState.started;
                    callStartFlag = new Date().getTime();
                    $meetingHub.callmateReentered();
                    $scope.set("showCallStateMessage", true);
                    $scope.set("isReconnecting", true);
                    $scope.set("callStateMessage", "You have re-joined the call with " + $scope.activeUser.fullName + ".");
                    setTimeout(function () {
                        $scope.set("isReconnecting", false);
                        $scope.set("isIncomingCall", false);
                        $scope.set("showCallStateMessage", false);
                        $scope.trigger("change", { field: "audioVideoOptions" });
                        $scope.updateActiveBadgeVisibility();
                    }, 2000);
                });
            };

            this.initMeetingEvent = function () {
                $mainHub.register($meetingHub, {isVisibleForUsers: 1});
                this.initChatEvent();
                $meetingHub.on("onClientDisconnected", function (userId) {
                    if ($scope.activeMessengerUser.userId === userId) {
                        if ($scope.callState == callState.dial) {
                            // if we are calling this user at the moment
                            $scope.onRejectCall(rejectType.unavailable);
                        } else if ($scope.callState == callState.incomming) {
                            // if we have an incoming call
                            $scope.onDisconnectCall($scope.activeMessengerUser.fullName + reasonPhrase.disconnected);
                        }
                    }
                });
                $meetingHub.on("onSwitchToOpenConsultation", function (meetingId, participantId) {
                    if (snap.ConsultationPage) {
                        return;
                    }
                    sessionStorage.setItem("participantId", participantId);
                    redirectToOpenConsultation(meetingId);
                });
                $meetingHub.on("onReenterCall", function (callParams, callmateUserId) {
                    if ($scope.dataLoaded) {
                        $scope.onReenterCall(callParams, callmateUserId);
                    } else {
                        $scope.on("dataLoaded", function () {
                            $scope.onReenterCall(callParams, callmateUserId);
                        });
                    }

                });
                $meetingHub.on("onVideoIncoming", function (videoKey, fromUserId) {
                    clearShowCallPanelTimeout();
                    if (snap.ConsultationPage) {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.onConsultation);
                        return;
                    }
                    if (!$providerChatTokboxModule.isWebRtcEnabled()) {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.incompatible);
                        return;
                    }
                    $scope.set("isFooterVisible", false);
                    if (!$scope.isCalling()) {
                        $scope.callState = callState.incomming;
                        var callingUser = $scope.findUser(fromUserId);
                        if (callingUser) {
                            playSound(ringtoneType.incommingVideo);
                            $scope.set("showCallStateMessage", false);
                            $scope.initCall(callingUser, false, videoKey);

                        }
                    } else {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.onAnotherCall);
                    }
                });

                $meetingHub.on("onAudioIncoming", function (videoKey, fromUserId) {
                    clearShowCallPanelTimeout();
                    if (snap.ConsultationPage) {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.onConsultation);
                        return;
                    }
                    if (!$providerChatTokboxModule.isWebRtcEnabled()) {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.incompatible);
                        return;
                    }
                    $scope.set("isFooterVisible", false);
                    if (!$scope.isCalling()) {
                        $scope.callState = callState.incomming;
                        var callingUser = $scope.findUser(fromUserId);
                        if (callingUser) {
                            playSound(ringtoneType.incommingAudio);
                            $scope.set("showCallStateMessage", false);
                            $scope.initCall(callingUser, true, videoKey);
                        }
                    } else {
                        $meetingHub.rejctCall(videoKey.CallRequestId, rejectType.onAnotherCall);
                    }
                });
                $meetingHub.on("onMessageReceived", function (data) {
                    var fromUserId = data.userId;
                    var fromUser = $scope.findUser(fromUserId);

                    if (!data.profileImagePath) {
                        data.profileImagePath = getDefaultProfileImageForClinician(fromUser.gender);
                    }

                    if (!data.userId) {
                        return;
                    }

                    var userChatHistory = currentChatHistory[fromUserId] || [];
                    var participantData;
                    var meetingId;

                    if (userChatHistory.length === 0) {
                        $scope._receivedMessageInternal(data, fromUser); // to prevent multiple loading
                        participantData = userParticipantMapping[fromUserId];
                        if (!participantData) {
                            meetingId = data.meetingId;
                            $meetingService.createParticipant(meetingId,
                                    fromUserId,
                                    participantTypeCode.practicioner)
                                .then(function (participantData) {
                                    participantData = participantData.data[0];
                                    userParticipantMapping[fromUserId] = participantData;
                                    $scope.loadChatHistory(fromUser);
                                });
                        }
                    } else {
                        participantData = userParticipantMapping[fromUserId];
                        if (!participantData) {
                            meetingId = data.meetingId;
                            $meetingService.createParticipant(meetingId,
                                    fromUserId,
                                    participantTypeCode.practicioner)
                                .then(function (participantData) {
                                    participantData = participantData.data[0];
                                    userParticipantMapping[fromUserId] = participantData;
                                    $scope._receivedMessageInternal(data, fromUser, true);
                                });
                        } else {
                            $scope._receivedMessageInternal(data, fromUser);
                        }
                    }
                    addToRecent(fromUserId, true);
                    if ($scope.isDialogActive(data.userId)) {
                        $meetingHub.updateParticipantLastRead(data.meetingId, snap.profileSession.personId);
                    }
                });

                $meetingHub.on("onClientUnavailable", function () {
                    if ($scope.callState == callState.dial || $scope.isActiveSession) {
                        // call was initiated but client occured unavailable
                        $scope.onRejectCall(rejectType.unavailable);
                    } else if ($scope.callState == callState.started) {
                        // call was accepted but client occured unavailable
                        $scope.onDisconnectCall($scope.activeMessengerUser.fullName + reasonPhrase.disconnected);
                    }
                });

                $meetingHub.on("onDisconnectCall", function () {
                    $scope.onDisconnectCall();
                });

                $meetingHub.on("onRejectCall", function (rejectTypeId) {
                    $scope.onRejectCall(rejectTypeId);
                });

                $meetingHub.on("onAcceptCall", function () {
                    clearShowCallPanelTimeout();
                    $scope.callState = callState.started;
                    callStartFlag = new Date().getTime();
                    $scope.set("userAvailable", true);
                    $scope.set("isFooterVisible", false);
                    $scope.trigger("change", { field: "audioVideoOptions" });
                    $providerChatTokboxModule.onAcceptCall();
                });

                $meetingHub.on("onCallmateReentered", function () {
                    if ($scope.callState == callState.started) {
                        $scope._setVisibility(true);
                        $scope.set("isChatroomVisible", false);
                        $scope.set("isScreenVisible", true);
                        $scope.set("isReconnecting", true);
                        $scope.trigger("change", { field: "audioVideoOptions" });
                        $scope.set("isIncomingCall", true);
                        $scope.set("isFooterVisible", false);
                        $scope.set("callStateMessage", $scope.activeMessengerUser.fullName + " re-joined the call.");
                        $scope.updateActiveBadgeVisibility();
                        $scope.setActiveUser($scope.activeMessengerUser);

                        clearShowCallPanelTimeout();
                        clearReconnectTimeout();

                        setTimeout(function () {
                            $scope.set("isReconnecting", false);
                            $scope.set("isIncomingCall", false);
                            $scope.set("showCallStateMessage", false);
                            $scope.trigger("change", { field: "audioVideoOptions" });
                            $scope.updateActiveBadgeVisibility();
                        }, 2000);
                    }

                });

                $meetingHub.on("onCallmateDisconnected", function () {
                    $scope.set("userAvailable", false);

                    if ($scope.callState == callState.started) {
                        $providerChatTokboxModule.onCallmateDisconnected();
                        $scope.set("showCallStateMessage", true);
                        $scope.set("callStateMessage", $scope.activeUser.fullName + " has been disconnected from the call.");
                        $scope.set("isReconnecting", true);
                        $scope.set("isFooterVisible", true);
                        $scope.trigger("change", { field: "audioVideoOptions" });
                        $scope.set("footerBtnText", "Reject call");
                        playSound(ringtoneType.callDropped);
                        reconnectTimeout = window.setTimeout(function () {
                            $scope.callState = callState.disconnected;
                            $scope.set("footerBtnText", "Back To List");
                            $scope.set("isReconnecting", false);
                            $scope.set("callStateMessage", $scope.activeUser.fullName + " seems to have left. Ending call.");
                            playSound(ringtoneType.callEnd);
                            $scope.disconnectCall();

                            clearReconnectTimeout();
                        }, reconnectWaitTime);
                    }
                });
            };

            this.hubStart = function () {
                $meetingHub.on("start", function () {
                    $meetingHub.registerMeeting("");
                });
                $mainHub.start();
            };

            this.initRecent = function () {
                // initially recent list is closed
                $scope.set("isRecentListActive", false);
                $('.staff-messenger__recent-list').slideToggle();

                if (initRecentFromSession() === 0) {
                    // if we have no recent users in cache, load the list from api
                    loadRecentList(snap.profileSession.personId);
                }
                loadUnreadConversations(snap.profileSession.personId);
            };

            /* Basic View Model Function*/
            this.init = function () {
                snap.getSnapChatRecentSession();
                $scope.initData().done(function () {
                    $scope.initRecent();
                });
                $scope.initMeetingEvent();
                $scope.hubStart();
                initTokbox();
            };

            function User(userDetails) {
                $.extend(this, new kendo.Observable(), userDetails);

                this.profileImagePath = this.profileImagePath ||
                    (this.gender ? getDefaultProfileImageForClinician(this.gender) : getDefaultProfileImageForClinician());

                this.setPresenceIndex = function () {
                    if (this.status === "Online") {
                        if (this.hasNewMsg) {
                            this.precedenceIndex = precedenceIndex.onlineWithNewMsg;
                        } else {
                            this.precedenceIndex = precedenceIndex.online;
                        }
                    } else if (this.hasNewMsg) {
                        this.precedenceIndex = precedenceIndex.hasNewMsg;
                    } else if (this.status === "Away") {
                        this.precedenceIndex = precedenceIndex.away;
                    } else if (this.status === "Busy") {
                        this.precedenceIndex = precedenceIndex.busy;
                    } else {
                        this.precedenceIndex = precedenceIndex.offline;
                    }
                };

                this.setUserStatus = function (status, lastOnlineMessage) {
                    this.isOffline = false;
                    this.isOnline = false;
                    this.isBusy = false;
                    this.isAway = false;

                    var that = this;

                    this.status = status;
                    this.statusText = status;
                    this.setPresenceIndex();
                    if (status === "Online") {
                        this.isOnline = true;
                    } else if (status === "Away") {
                        this.isAway = true;
                    } else if (status === "Busy") {
                        this.isBusy = true;
                    } else {
                        this.isOffline = true;
                        if (typeof lastOnlineMessage !== "undefined" && lastOnlineMessage.length) {
                            this.statusText = "Offline for " + lastOnlineMessage;
                        } else {
                            var matchUser = allUsers.find(function (item) {
                                return item.UserId == that.userId;
                            });
                            this.statusText = (matchUser && typeof matchUser.LastOnlineMessage !== "undefined" && matchUser.LastOnlineMessage.length) ?
                                "Offline for " + matchUser.LastOnlineMessage : wasNotOnlineMessage;
                        }
                    }
                };

                this.updateUserStatus = function () {
                    var that = this;
                    var matchUser = allUsers.find(function (item) {
                        return item.UserId == that.userId;
                    });

                    if (matchUser) {
                        if (!matchUser.StatusID) {
                            matchUser.StatusID = 74;
                        }
                        var status = statusMap[matchUser.StatusID];
                        this.setUserStatus(status, matchUser.LastOnlineMessage);
                    } else {
                        this.setUserStatus("Offline");
                    }
                };

                this.incrementNewMsg = function () {
                    this.countNewMsg++;
                    this.hasNewMsg = true;
                    this.setPresenceIndex();
                };

                this.setMsgCount = function (count) {
                    this.countNewMsg = count;
                    this.hasNewMsg = count > 0;
                    this.setPresenceIndex();
                };

                this.isControlDisable = function () {
                    return !this.isOnline && !($scope.isActiveSession && $scope.activeMessengerUser.userId === this.userId);
                };

                this.isRestrictedDisabled = function () {
                    return this.isOnline && (snap.ConsultationPage || $scope.isActiveSession && $scope.activeMessengerUser.userId != this.userId);
                };

                this.hasActiveVideo = function () {
                    return $providerChatTokboxModule.isWebRtcEnabled() && $scope.isActiveSession && $scope.isActiveVideoSession && this.userId === $scope.activeMessengerUser.userId;
                };
                this.hasActiveAudio = function () {
                    return $providerChatTokboxModule.isWebRtcEnabled() && $scope.isActiveSession && $scope.isActiveAudioSession && this.userId === $scope.activeMessengerUser.userId;
                };

                this.setUserStatus("Offline");
                this.setMsgCount(0);

                return this;
            }

        })
        .singleton();

}(jQuery, snap, kendo));

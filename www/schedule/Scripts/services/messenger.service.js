/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />




; (function ($, snap) {
    'use strict';

   
    snap.namespace("snap.Service").use(["snapHttp"]).define("MessengerService", function ($http) {
        var $scope = this;
        this.getPhysicians = function () {
            var url = [snap.baseUrl, "/api/v2/physicians"].join("");
            return $http.get(url);
        };

        this.createMeeting = function () {
            var url = [snap.baseUrl, "/api/v2.1/meetings"].join("");
            return $http.makeRequest({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    meetingTypeCode: 3
                })
            });
        };

        this.getMeetingsWithUser = function(withUserId) {
            var url = [snap.baseUrl, "/api/v2.1/meetings/date-desc"].join("");
            var options = {
                userId: withUserId
            };
            return $http.get(url, options);
        };

        this.createSession = function (meetingId) {
            var url = [snap.baseUrl, "/api/v2.1/meetings/", meetingId, "/sessions"].join("");
            return $http.makeRequest({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

        };

        this.createParticipant = function (meetingId, userId, participantTypeCode) {
            var url = [snap.baseUrl, "/api/v2.1/meetings/", meetingId, "/participants"].join("");
            return $http.makeRequest({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json", data: JSON.stringify({
                    userId: userId,
                    participantType : participantTypeCode
                })
            });

        };

        this.getUserConversationHistories = function (userId) {
            var url = [snap.baseUrl, "/api/v2.1/meetings/users/", userId, "/conversations"].join("");
            return $http.get(url);
        };

        this.getParticipants = function (meetingId) {
            var url = [snap.baseUrl, "/api/v2/meetings/", meetingId, "/participants"].join("");
            return $http.get(url);
        }

        this.getOrCreateMeetingId = function (userId) {
            var $def = $.Deferred();
            var meetingMappingDB = JSON.parse(sessionStorage.getItem("snap_meeting_mapping")) || {};
            var meetingId = meetingMappingDB[userId];
            if(meetingId){
                $def.resolve(meetingId);
            } else {
                $scope.getMeetingsWithUser(userId).then(function (data) {
                    if (data.total > 0) {
                        data = data.data[0];
                        var meetingId = data.meetingId;
                        meetingMappingDB[userId] = meetingId;
                        sessionStorage.setItem("snap_meeting_mapping", JSON.stringify(meetingMappingDB));
                        $def.resolve(meetingId);
                    } else {
                        $scope.createMeeting().then(function(data) {
                            data = data.data[0];
                            var meetingId = data.meetingId;
                            meetingMappingDB[userId] = meetingId;
                            sessionStorage.setItem("snap_meeting_mapping", JSON.stringify(meetingMappingDB));
                            $def.resolve(meetingId);
                        });
                    }
                });
            }

            return $def.promise();
        };
        this.getPhysicianInformation = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/Physicians/", id].join(""));
        };
        this.changeStatus = function () {

        };

        this.getUnreadConversations = function (id) {
            return $http.get(["/api/v2.1/meetings/conversations/", id, "/recent"].join(""));
        };

        this.getLastParticipantsList = function (id, take) {
            return $http.get(["/api/v2.1/meetings/latest-users-chatted-with"].join(""), { personId: id, meetingType: 3, take: take });
        };
        
        this.getPhysicianInformation = function (id) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/physician/", id].join(""));
        };

        this.getPhysicianInformationByPersonId = function (personId) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/provider/", personId].join(""));
        };

        this.getMeetingConversation = function (meetingId) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/", meetingId, "/conversations"].join(""));
        };
        this.getMeetingSession = function (meetingId) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/", meetingId, "/sessions"].join(""));
        };
        this.getMeeting = function (meetingId) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/", meetingId].join(""));
            //v2.1/meetings/{meetingId}
        }
        this.getUnreadConversationsCount = function (meetingId, personId) {
            return $http.get([snap.baseUrl, "/api/v2.1/meetings/", meetingId, "/unreadConversations/", personId, "/count", ].join(""));
        };

        this.getUserCurrentTime = function () {
            return $http.get("/api/v2.1/users/current-time");
        };

        this.getRingtone = function (soundType) {

            var ringtoneType = {
                incommingAudio: "/sound/default/incoming-audio.mp3",
                incommingVideo: "/sound/default/incoming-video.mp3",
                callEnd: "/sound/default/call-end.mp3",
                callDropped: "/sound/default/call-dropped.mp3",
                incommingMessage: "/sound/default/message.mp3"
            };
            var sound = ringtoneType[soundType];
            if (!sound) {
                sound = "/sound/default/ringtone.mp3";
            }
            return sound;

        };

        
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


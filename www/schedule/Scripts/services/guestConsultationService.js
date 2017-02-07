/// <reference path="../core/snap.core.js" />
/// <reference path="../jquery-2.1.3.js" />


;
(function($, snap) {

    "use strict";

    snap.namespace("snap.service").define("guestConsultationService", function() {
        var participantToken = sessionStorage.getItem("participantToken");
        this.getAppointment = function() {
            var url = "/api/v2/participants/appointments";
            return $.ajax({
                url: url,
                headers: {
                    'Authorization': 'JWT-Participant ' + participantToken,
                    'Content-Type': 'application/json',
                    'X-Api-Key': snap.apiKey,
                    'X-Developer-Id': snap.apiDeveloperId
                }
            });
        };
        this.getParticipants = function() {
            var url = "/api/v2/patients/consultations/participants";
            return $.ajax({
                url: url,
                headers: {
                    'Authorization': 'JWT-Participant ' + participantToken,
                    'Content-Type': 'application/json',
                    'X-Api-Key': snap.apiKey,
                    'X-Developer-Id': snap.apiDeveloperId
                }
            });
        };

        this.loadChatHistory = function(consulationId) {
            var url = ["/api/participants/consultations", consulationId, "chat"].join("/");
            return $.ajax({
                url: url,
                headers: {
                    'Authorization': 'JWT-Participant ' + participantToken,
                    'Content-Type': 'application/json',
                    'X-Api-Key': snap.apiKey,
                    'X-Developer-Id': snap.apiDeveloperId
                }
            });
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));
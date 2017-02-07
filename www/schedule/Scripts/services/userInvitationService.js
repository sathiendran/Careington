
; (function ($, snap) {

    'use strict';

    snap.using(["snapHttp"]).define("invitationService", function ($http) {
        this.saveDataAndSendEmail = function (data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/admin/patients"].join(""),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });
        };
        this.sendEmailInvitation = function (email) {
            return $http.post([snap.baseUrl, "/api/v2/admin/patients/send-onboarding-email","?email=", encodeURIComponent(email)].join(""));
        };
        this.sendEmailInvitationToDependent = function (token, hospitalId) {
            return $.ajax({
                url: [snap.baseUrl, '/api/v2/emails/cousers/invitations'].join(""),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ hospitalId: hospitalId, token: token })

            });
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


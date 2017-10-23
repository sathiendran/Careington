/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />
; (function ($, snap) {
    "use strict";

    snap.namespace("snap.DataService").using(["snapHttp", "snap.enums.profileFilter"]).define("customerDataService", function ($http, $profileFilter) {
        this.createOnDemandConsltation = function (onDemandRequest) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/patients/consultations"].join(""),
                type: "POST",
                data: JSON.stringify(onDemandRequest),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.createConsultationFromAppointment = function (personId, appointmentId) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/patients/", personId, "/encounters"].join(""),
                type: "POST",
                data: JSON.stringify({
                    appointmentId: appointmentId,
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };
        this.useExistingCreditForConsultation = function (patientId, consultationId) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/patients/", patientId, "/payments/debits?errorIfNoCredits=false"].join(""),
                type: "POST",
                data: JSON.stringify({
                    consultationId: consultationId,
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.checkPaymentStatus = function (consultationId) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/patients/copay/", consultationId, "/paymentstatus"].join(""),
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function () { snapError("Payment Processing Failure"); }
            });
        };
        this.updateConsultationMetadata = function (consultationId, intakeData) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/patients/consultations/", consultationId, "/intake"].join(""),
                type: "PUT",
                data: JSON.stringify(intakeData),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

        };
        this.getAvailableConsultation = function () {
            return $http.get([snap.baseUrl, "/api/v2/patients/availableconsultations"].join(""));
        };
        this.getAvailableWaitingConsultation = function () {
            return $http.get([snap.baseUrl, "/api/v2/patients/availableconsultations/waiting"].join(""));
        };
        this.deleteAvailableWaitingConsultation = function (consultationId) {
            return $.ajax({
                type: "DELETE",
                url: [snap.baseUrl, "/api/v2/patients/availableconsultations/waiting/", consultationId].join(""),
                contentType: "application/json; charset=utf-8"
            });
        };
        this.getScheduledConsultation = function () {
            return $http.get([snap.baseUrl, "/api/v2.1/patients/appointments?includePatientCoUsers=false"].join(""));
        };
        this.getOnDemand = function () {
            return $.ajax({
                type: "GET",
                url: snap.baseUrl + "/api/v2.1/patients/ondemand/availability",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.deleteActiveConsultations = function (consultationId) {
            return $.ajax({
                type: "DELETE",
                url: [snap.baseUrl, "/api/v2/patients/activeconsultations/", consultationId].join(""),
                contentType: "application/json; charset=utf-8",
                error: function () { snapInfo("Could not end the consultation. The Clincian might have already completed the session.") }
            });

        };
        this.getPatientCredits = function (patientId) {
            return $.ajax({
                type: "GET",
                url: snap.baseUrl + "/api/v2.1/patients/" + patientId + "/payments/credits",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.getActiveConsultations = function () {
            return $.ajax({
                type: "GET",
                url: snap.baseUrl + "/api/v2/patients/consultations/activeconsultations",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.markAppointmentAsFullfilled = function (consultationId) {
            return $.ajax({
                url: "/api/v2.1/patients/consultations/" + consultationId + "/markasfullfill",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.getAccountUserProfiles = function (patientId, authorizedOnly, includeAllGuardians) {
            var opt = {
                authorizedOnly: authorizedOnly, // if true gets guardians only from familygroup adults
                includeAllGuardians: includeAllGuardians // if true get all guardians, not only account admin
            };
            var url = [snap.baseUrl, "/api/v2/patients/" + (patientId ? patientId + "/" : "") + "familygroup/adults"].join("");
            return $http.get(url, opt);
        };
        this.getAccountRelations = function (patientId) {
            var url = [snap.baseUrl, "/api/v2/patients/", patientId, "/familygroup/relations"].join("");
            return $http.get(url);
        };
        this.getAccountGuardians = function (patientId, includeUnauthorized) {
            var url = [snap.baseUrl, "/api/v2/patients/", patientId, "/familygroup/guardians?includeUnauthorized=", !!includeUnauthorized].join("");
            return $http.get(url);
        };
        this.getAccountDependentProfiles = function (patientId) {
            if (patientId) {
                return $http.get([snap.baseUrl, "/api/v2/patients/" + patientId + "/familyprofiles/dependents"].join(""));
            } else {
                return $http.get([snap.baseUrl, "/api/v2/patients/familyprofiles/dependents"].join(""));
            }
        };
        this.getFamilyGroup = function() {
            return $http.get([snap.baseUrl, "/api/familyGroup"].join(""));
        };

        this.getPatientProfile = function (patientId) {
            return $http.get([snap.baseUrl, "/api/v2/patients/profiles/", patientId].join(""));
        };

        var getPatientProfileDetails = function(patientId, include, role, guardianPatientId) {
            var opt = {
                role: role || $profileFilter.patient,
                include: include || "all",
                guardianPatientId: guardianPatientId
            };
            return $http.get([snap.baseUrl, "/api/v2/patients/profile/", patientId].join(""), opt);
        };

        this.getPatientProfileDetails = function (patientId, include, guardianPatientId) {
            return getPatientProfileDetails(patientId, include, $profileFilter.patient, guardianPatientId);
        };

        this.getPatientProfileDetailsForAdmin = function (patientId, include, guardianPatientId) {
            return getPatientProfileDetails(patientId, include, $profileFilter.admin, guardianPatientId);
        };

        this.getPatientIdentifiers = function (role) {
            role = role || $profileFilter.patient;
            return $http.get([snap.baseUrl, "/api/v2/patients/profiles/identifier-types", "?role=" + role].join(""))
        };

        this.getDefaultPatientProfileDetails = function (include, role) {
            role = role || $profileFilter.patient;
            return $http.get([snap.baseUrl, "/api/v2/patients/profile/?include=" + include, "&role=" + role].join(""));
        };
        this.editPatientProfile = function (data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/patients/profile"].join(""),
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.addPatientProfile = function (data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/familygroups/dependents"].join(""),
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.addDependentAsAdmin = function (patientId, data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/admin/patient/", patientId, "/dependent"].join(""),
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.editRelationAndAuthorization = function (patientId, data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/patients/familygroup/", patientId, "/relationship"].join(""),
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.editRelationAndAuthorizationAsAdmin = function (guardianId, patientId, data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2/admin/patient/", guardianId, "/dependent/", patientId, "/relationship"].join(""),
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.getAccountDetails = function () {
            return $http.get([snap.baseUrl, "/api/v2/patients/accountSettings"].join(""));
        };
        this.updateAccountDetails = function (data) {
            return $.ajax([snap.baseUrl, "/api/v2/patients/accountSettings"].join(""), { type: "PUT", data: data });
        };
        this.getUserCurrentTimeId = function () {
            var promise = $.Deferred();
            var counter = 2;
            function get() {
                $http.get("/api/v2.1/users/current-time").done(function (responce) {
                    promise.resolve(responce);
                }).fail(function () {
                    if (counter > 0) {
                        counter--;
                        get();
                    } else {
                        snap.redirectToLogin();
                        promise.reject();
                    }
                });
            }
            get();
            return promise.promise();
        };

        this.isResponseRulesActive = function() {
            return $http.get([snap.baseUrl, "/api/v2.1/patients/response-rules-active"].join(""));
        };

        this.getRulesStatus = function () {
            return $http.get([snap.baseUrl, "/api/v2.1/patients/rules-status"].join(""));
        };

        this.updatePatientResponseAddress = function(locationEncoded, patientId) {
            var url = [snap.baseUrl, "/api/v2.1/patients/encounter/address?patientId=" + patientId,
                locationEncoded.addressText ? "&addressText=" + locationEncoded.addressText : "",
                locationEncoded.country ? "&country=" + locationEncoded.country : "",
                locationEncoded.region ? "&region=" + locationEncoded.region : ""].join("");

            return $.ajax({
                url: url,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.getProviderLicensePatientAddressMetaRule = function() {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/admin/rules/patient-provider-license-meta-rules"].join(""),
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.getCliniciansCards = function (opt) {
            return $http.get("/api/v2.1/patients/appointments/self-scheduling/clinicians", opt);
        };

        this.deleteProfileImage = function (patientId) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/patients/profile-images?patientId=" + patientId].join(""),
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            });
        };

        this.checkRegistrationRule = function(address) {
            return $http.get(
                [snap.baseUrl, "/api/v2.1/admin/rules/registration-rule"].join(""),
                {
                    address: address
                });
        }

    }).singleton();

}(jQuery, window.snap = window.snap || {}));

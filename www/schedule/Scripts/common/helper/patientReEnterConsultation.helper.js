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
                url: snap.baseUrl + "/api/v2.1/patients/consultations/" + consultationId + "/markasfullfill",
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
            return $http.get(snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", opt);
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

/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />


; (function ($, snap) {

    "use strict";

    snap.namespace("snap.service").using(["snapHttp"]).define("appointmentService", function ($http) {
        this.getAppointment = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/providers/appointments/", id, '/all'].join(""));
        };

        this.getAppointments = function (data) {
            return $http.get([snap.baseUrl, "/api/v2/admin/consultations"].join(""), data);
        };
        this.getVideoKey = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/providers/appointments/", id, "/videokey"].join(""));
        };

        this.saveSoapData = function (data) {
            var url = [snap.baseUrl, "/api/v2/providers/soapnotes"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });

        };

        this.getParticipants = function (consulationId,opt) {
            var url = [snap.baseUrl, "/api/v2/patients/consultations/",consulationId,"/participants"].join("");
            return $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                data: opt
            });
        };
        this.saveMedicalCodeForConsultation = function (data) {
            var url=[snap.baseUrl, "/api/v2/providers/consultation/medicalcodes"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });

        };

        this.getConsultation = function(id) {
            return $http.get([snap.baseUrl, "/api/v2.1/clinicians/consultations/", id].join(""));
        };

        this.getConsultationById = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/patients/consultations/", id, "/all"].join(""));
        };
        this.getPatientInformationByConsultationId = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/patients/consultations/", id, "/patientprofile"].join(""));
        };
        this.getCptCodes = function () {
            return $http.get([snap.baseUrl, "/api/v2/CptCodes"].join(""));
        };
        this.getHospitalMedicaCodingConfiguration = function(consultationId) {
            return $http.get([snap.baseUrl, "/api/v2/providers/medicalcodingsconfiguration/", consultationId].join(""));
        };
        this.getPhysicianInformation = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/providers/", id].join(""));
        };
        this.getConsultationDetails = function(consultationId) {
            return $http.get([snap.baseUrl, "/api/v2/reports/consultation/", consultationId, "?include=prescription"].join(""));
        };
        this.getConsultationChartNotes = function(consultationId, meetingTypeCode) {
            return $http.get([snap.baseUrl, "api/reports/consultationreportdetails/chatnote", consultationId, meetingTypeCode].join("/"));
        };
        this.getConsultAttachedFiles = function (consultationId) {
            return $http.get([snap.baseUrl, "/api/v2.1/filesharing/consultations/", consultationId].join(""));
        };

        this.fullfillappointment = function(consultationId) {
            return $http.post([snap.baseUrl, "/api/v2.1/clinicians/consultations/", consultationId, "/markasfullfill"].join(""));
        };

        this.setAppointmentFlag = function(appointmentId, flag) {
            var url=[snap.baseUrl, "/api/v2.1/clinician/appointments/", appointmentId, "/flag"].join("");
            return $.ajax({
                url: url,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "text json",
                data: JSON.stringify({ Flag: flag})
            });
        };

        this.dismissAppointment = function(appointmentId, dismissReasonId) {
            var url=[snap.baseUrl, "/api/v2.1/appointments/", appointmentId, "/dismiss"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ DismissReasonId: dismissReasonId })
            });
        };

        this.updateConsultationStatus = function (consultationId, updateStatusId) {
            var url = [snap.baseUrl, "/api/v2.1/clinicians/consultations/", consultationId, "/status"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ ConsultationStatusId: updateStatusId })
            });
        };

        this.getPhysicianActiveConsultations = function() {
            return $http.get([snap.baseUrl, "/api/v2/providers/consultations/activeconsultations"].join(""));
        };

        this.getPhysicianActiveOpenConsultations = function () {
            return $http.get([snap.baseUrl, "/api/v2/providers/consultations/activeopenconsultations"].join(""));
        };


        this.clinicianEndActiveConsultaion = function(consulationId) {
            var url = [snap.baseUrl, "/api/v2/providers/consultations/activeconsultations/",consulationId].join("");
            return $.ajax({
                url: url,
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            });
        };

        this.clinicianEndActiveOpenConsultaion = function (meetingId) {
            var url = [snap.baseUrl, "/api/v2/providers/consultations/activeopenconsultations/", meetingId].join("");
            return $.ajax({
                url: url,
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            });
        };


        this.patientEndActiveConsultaion = function(consulationId) {
            var url = [snap.baseUrl, "/api/v2/patients/activeconsultations/",consulationId].join("");
            return $.ajax({
                url: url,
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            });
        };

        this.loadChatHistory = function(consulationId) {
            return $http.get([snap.baseUrl, "api/consultations", consulationId, "chat"].join("/"));
        };

        this.loadPreConsultationChatHistory = function(consulationId) {
            return $http.get([snap.baseUrl, "api/consultations", consulationId, "preconsultation-chat"].join("/"));
        };
        this.notifyProviders = function(appointmentId, request) {
            var url = [snap.baseUrl + "/api/v2.1/clinician/appointments/", appointmentId, "/notifications"].join("");

            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                timeout: 60000,
                data: JSON.stringify(request)
            });
        };

        this.loadSnapshots = function(consultationId) {
            var url = [snap.baseUrl, "/api/v2/consultations/", consultationId, "/snapshots", "?thumbnail=true"].join("");
            return $http.get(url);
        };

        this.getSnapshot = function(consultationId, imageId) {
            var url = [snap.baseUrl, "/api/v2/consultations/", consultationId, "/snapshots/", imageId, "?thumbnail=true"].join("");
            return $http.get(url);
        };

        this.addSnapshot = function(consultationId, imageUrl) {
            var url = [snap.baseUrl, "/api/v2/consultations/", consultationId, "/snapshots"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify({
                    snapshotDataUrl: imageUrl
                }),
                contentType: "application/json; charset=utf-8",
            });
        };

        this.deleteSnapshot = function(consultationId, imageId) {
            var url = [snap.baseUrl, "/api/v2/consultations/", consultationId, "/snapshots/", imageId].join("");
            return $.ajax({
                url: url,
                type: "DELETE"
            });
        };

    }).singleton();

}(jQuery, window.snap = window.snap || {}));


(function($, snap) {
    "use strict";

    snap.namespace("snap.common.schedule").use(["snapNotification", "snap.enums.userTypes"])
        .define("ScheduleCommon", function($snapNotification, $userTypes) {

            /************************ START Timezone ***************************/
            //This functionality check that we have timeZoneSystemId.
            //If not, then we get timeZoneSystemId from "/api/v2/admin/userstaffprofile" api.
            if (isEmpty(snap.userSession.timeZoneSystemId)) {
                window.console.warn("snap.userSession.timeZoneSystemId is undefined.");

                $.ajax({
                    type: "GET",
                    url: "/api/v2.1/users/current-time",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                }).done(function(response) {
                    var timeZone = response.message;
                    snap.userSession.timeZoneSystemId = timeZone;
                    snap.updateSnapJsSession("snap_user_session", "timeZoneSystemId", timeZone);
                }).fail(function() {
                    $snapNotification.error("Error. Time zone info missied");
                });
            }
            /************************ END Timezone ***************************/

            this.findParticipant = function(participants, participantTypeCode) {
                if (participants) {
                    for (var j = 0; j < participants.length; j++) {
                        if (participants[j] && participants[j].participantTypeCode === participantTypeCode && (typeof participants[j].status === "undefined" || participants[j].status === 1)) {
                            return participants[j];
                        }
                    }
                }

                return null;
            };

            this.findProvider = function(participants) {
                return this.findParticipant(participants, this.participantTypeCode.practicioner);
            };

            this.findPatient = function(participants) {
                return this.findParticipant(participants, this.participantTypeCode.patient);
            };

            this.getFullName = function(person) {
                var fullName = "";
                if (person && person.name) {
                    var nameParts = [];

                    if (!!person.name.given) {
                        nameParts.push(person.name.given);
                    }

                    if (!!person.name.family) {
                        nameParts.push(person.name.family);
                    }

                    fullName = nameParts.join(" ");
                }

                return fullName;
            };

            this.getPhoneNumber = function(person) {
                var phoneTypesPriority = ["home", "work", "other", "old", "temp"];

                if (person && person.phones && person.phones.length) {
                    var phones = person.phones;
                    for (var i = 0; i < phoneTypesPriority.length; i++) {
                        for (var j = 0; j < phones.length; j++) {
                            if (phones[j].use === phoneTypesPriority[i] && $.trim(phones[j].value) !== "") {
                                return phones[j].value;
                            }
                        }
                    }
                    return person.phones[0].value;
                }
                return "";
            };

            this.getSpeciality = function (speciality) {
                if (!isEmpty(speciality)) {
                    var arr = [];

                    if (!!speciality.primary) {
                        arr.push(speciality.primary);
                    }

                    if (!!speciality.secondary) {
                        arr.push(speciality.secondary);
                    }

                    return arr.length ? arr.join(" | ") : snap.noneReportedMessage;
                }
                else return snap.noneReportedMessage;
            };

            this.attendenceCode = {
                unknown: 0,
                required: 1,
                optional: 2,
                cancelled: 3
            };

            this.participantTypeCode = {
                none: 0,
                patient: 1,
                practicioner: 2,
                relatedPerson: 3
            };

            this.userType = $userTypes;

            this.appointmentTypeCode = {
                none: 0,
                clinicianScheduled: 1,
                onDemand: 2,
                patientScheduled: 3
            };

            this.blockPermissions = {
                allowOnDemandAppt: "allowOnDemandAppt",
                allowSelfAppt: "allowSelfAppt",
                allowProviderAppt: "allowProviderAppt",
            };

            this.eventType = {
                availabilityBlock: "availabilityBlock",
                appointment: "appointment",
                documentEncounter: "documentEncounter"
            };
            this.appointmentStatusCode = {
                notSpecified: 0,
                scheduled: 1,
                waiting: 2,
                cancelledByPatient: 3,
                cancelledByProvider: 4,
                fulfilled: 5,
                transferred: 6
            };
            this.appointmentStatus = {
                notSpecified: "NotSpecified",
                scheduled: "Scheduled",
                waiting: "Waiting",
                cancelledByPatient: "CancelledByPatient",
                cancelledByProvider: "CancelledByProvider",
                fulfilled: "Fulfilled",
                transferred: "Transferred"
            };

            this.concernCodes = {
                otherPrimary: -1,
                otherSecondary: -2
            };
            this.isAppointmentFulfilled = function(status) {
                if (typeof (status) === "string") {
                    return status === this.appointmentStatus.fulfilled;
                }
                return status === this.appointmentStatusCode.fulfilled;
            }
            this.isAppointmentReadOnly = function (status) {
                if (typeof (status) === "string") {
                    return [this.appointmentStatus.scheduled, this.appointmentStatus.transferred].indexOf(status) === -1;
                }
                return [this.appointmentStatusCode.scheduled, this.appointmentStatusCode.transferred].indexOf(status) === -1;
            };
            this.isAppointmentInWaiting = function (status) {
                if (typeof (status) === "string") {
                    return status === this.appointmentStatus.waiting;
                }
                return status === this.appointmentStatusCode.waiting;
            };

            this.handleDataSourceError = function (e, dsName) {
                if (!snap.isUnloading) {
                    var errorMessage = dsName + " error. ";
                    if (e.errorThrown === "Unauthorized") {
                        errorMessage = ["You do not have role functions for viewing ", dsName, "."].join("");
                    }
                    else if (e.xhr.readySate !== 4) {
                        errorMessage = ["Cannot read ", dsName, ". Please check your internet connection"].join("");
                    }
                    else if (typeof e.errorThrown != "undefined") {
                        errorMessage = errorMessage + e.errorThrown;
                    }

                    $snapNotification.error(errorMessage);
                }
            }
        }).singleton();
}(jQuery, snap));
//@ sourceURL=reEnterConsultation.viewmodel.js

(function ($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.patient")
    .use(["snapNotification", "snap.EventAggregator", "snap.enums.consultationStatus", "snap.service.appointmentService", "snap.common.schedule.ScheduleCommon"])
        .extend(kendo.observable)
        .define("reEnterConsultationDialog", function ($snapNotification, $eventAggregator, $consultationStatus, $appointmentService, $scheduleCommon) {
            var dialog = null;
            var consultationOpt = null;
            var duration;
            this.providerFullName = "";
            this.department = "";
            this.providerProfileImage = global.getDefaultProfileImageForClinician();
            this.vm_isError = false;
            this.vm_isLoading = false;
            this.setOptions = function (opt) {
                dialog = opt.dialog;
                consultationOpt = opt.opt;
                duration = opt.opt.duration;

            }.bind(this);

            this.vm_onReEnterClick = function () {
                this._executeOnConsultationCheck(function action() {
                    snap.setSnapConsultationSessionData({
                        consultationId: consultationOpt.consultationId,
                        patientId: consultationOpt.patientId,
                        meetingId: consultationOpt.meetingId,
                        personId: consultationOpt.personId,
                        patientName: consultationOpt.patientName
                    });
                    window.location = "/patient/main#/consultation?reload=1";
                });
            };

            this.vm_onMarkCompleteClick = function () {
                var that = this;

                this._executeOnConsultationCheck(function action() {
                    that.set("vm_isLoading", true);
                    $appointmentService.patientEndActiveConsultaion(consultationOpt.consultationId).done(function () {
                        $snapNotification.info("Consultation saved.");
                    }).fail(function () {
                        $snapNotification.error("Cannot end consultation.");
                    }).always(function () {
                        $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                        that.set("vm_isLoading", false);
                        dialog.close();
                    });
                });
            };

            this._executeOnConsultationCheck = function(action) {
                var that = this;
                that.set("vm_isLoading", true);
                $appointmentService.getConsultation(consultationOpt.consultationId).always(function() {
                    that.set("vm_isLoading", false);
                }).done(function(consultation) {
                    var status = consultation.data[0].statusId;
                    if (status === $consultationStatus.startedConsultation || status === $consultationStatus.disconnectedConsultation ||
                        status === $consultationStatus.doctorInitiatedConsultation) {
                        action();
                    } else {
                        var message = "Your consultation has expired.";
                        if (status === $consultationStatus.endedConsultation) {
                            message = "Your consultation has been finished via provider.";
                        } else if (status === $consultationStatus.droppedConsultation) {
                            message = "Your consultation has been marked as dropped.";
                        }
                        $snapNotification.error(message);
                        dialog.close();
                        $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                    }
                }).fail(function(){
                    $snapNotification.error("Cannot check Consultation.");
                    dialog.close();
                    $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                });
            };
        }).singleton();
}(jQuery, snap, kendo, window));

;
(function($, snap) {
    "use strict";
    snap.namespace("snap.patient")
        .use(["snapNotification", "eventaggregator", "snap.DataService.customerDataService",
            "snap.enums.consultationStatus", "snap.common.dialogWindow", "snap.patient.reEnterConsultationDialog"
        ])
        .define("patientReEnterConsultationHelper", function($snapNotification, $eventAggregator, $service,
            $consultationStatus, $dialogWindow, $reEnterConsultationDialog) {

            var $encounterTypeCode = snap.resolveObject("snap.enums.EncounterTypeCode");
            var reenterDialog = null;

            this.checkForReEntryConsultation = function() {
                var dfd = $.Deferred();
                $service.getActiveConsultations().done(function(response) {
                    var tdata = response.total;

                    if (tdata > 0) {
                        var activeConnection;
                        response.data.forEach(function(connectionModel) {
                            if ((connectionModel.status === $consultationStatus.startedConsultation || connectionModel.status === $consultationStatus.doctorInitiatedConsultation) && connectionModel.encounterTypeCode === $encounterTypeCode.Video) {
                                activeConnection = connectionModel;
                            }
                        });

                        if (activeConnection) {
                            if (!reenterDialog) {
                                reenterDialog = $dialogWindow.createNewDialog({
                                    vm: $reEnterConsultationDialog,
                                    container: "#reEnterPopUpContainer",
                                    contentPath: "/content/patient/reEnterConsultation.html?v=v2.16.1.0.35",
                                    required: true
                                });
                            }
                            reenterDialog.open({
                                consultationId: activeConnection.consultationId,
                                patientId: activeConnection.patientId,
                                userType: 2,
                                meetingId: activeConnection.meetingId,
                                personId: activeConnection.patientPersonId,
                                patientName: activeConnection.patientName
                            });

                            $eventAggregator.subscribe("reEnterConsultationDialog_dialogClosed", function() {
                                dfd.resolve();
                            });
                        } else {
                            dfd.resolve();
                        }
                    } else {
                        dfd.resolve();
                    }
                }).fail(function(xhr, status, error) {
                  //  window.console.error("Consult API failure" + error);
                  //  $snapNotification.error("Failed to check active consultations");
                  //  dfd.resolve();
                });
                return dfd.promise();
            };
        }).singleton();

}(jQuery, snap));

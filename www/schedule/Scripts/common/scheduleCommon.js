(function($, snap) {
    "use strict";

    snap.namespace("snap.common.schedule").use(["snapNotification"])
        .define("ScheduleCommon", function($snapNotification) {

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

            this.userType = {
                admin: 0,
                clinician: 1,
                patient: 2
            };

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
//@ sourceURL=patientEnterConsultation.helper.js
;
(function($, snap, kendo, global) {
    "use strict";
    snap.namespace("snap.patient")
        .use(["snapNotification", "eventaggregator", "snap.DataService.customerDataService", "snap.service.appointmentService", "snap.common.utility",
            "snap.enums.ParticipantTypeCodes"])
        .define("patientEnterConsultationHelper", function($snapNotification, $eventAggregator, $service, $appointmentService, $utility,
            $participantTypeCodes) {
            var $encounterTypeCode = snap.resolveObject("snap.enums.EncounterTypeCode"),
                isLoadingConsult = false;

            var getPatientPersonId = function(appointment) {
                if (global.isEmpty(appointment.patientId)) {
                    $snapNotification.error("Appointment patientId is not set");
                    return null;
                }
                var patientParticipant = appointment.participants.find(function(participant) {
                    return participant.participantTypeCode === $participantTypeCodes.patient;
                });
                if (global.isEmpty(patientParticipant)) {
                    $snapNotification.error("Appointment patient is not set");
                    return null;
                }
                return patientParticipant.person.id;
            };

            this.enterConsultation = function(appointment) {
                var dfd = $.Deferred();
                if (isLoadingConsult) {
                    dfd.reject(true);
                } else {
                    isLoadingConsult = true;
                    var personId = getPatientPersonId(appointment);
                    if (global.isEmpty(personId)) {
                        isLoadingConsult = false;
                        dfd.reject();
                    } else {
                        if (appointment.encounterTypeCode === $encounterTypeCode.Phone || appointment.encounterTypeCode === $encounterTypeCode.InPerson) {
                            // phone-type and in-person consultations are automatically created in api
                            var isHomePage = window.location.href.toLowerCase().indexOf(snap.getPatientHome().toLowerCase()) >= 0;
                            if (!isHomePage) {
                                window.location.href = snap.getPatientHome();
                            }
                            isLoadingConsult = false;
                            dfd.resolve();
                        } else {
                            var appointmentId = appointment.appointmentId;
                            var patientId = appointment.patientId;
                            $service.createConsultationFromAppointment(personId, appointmentId).then(function(createConsultationResp) {
                                if (createConsultationResp) {
                                    var respData = createConsultationResp.data[0];
                                    var newConsultationId = respData.consultationId;

                                    if (parseInt(newConsultationId) > 0) {

                                        $appointmentService.getConsultationById(newConsultationId).done(function(getConsultationResp) {
                                            if (getConsultationResp.data && getConsultationResp.data.length > 0) {
                                                var consultationData = getConsultationResp.data[0].consultationInfo;
                                                var patientData = getConsultationResp.data[0].patientInformation;
                                                var consultationAmount = consultationData.consultationAmount || 0;

                                                var dob = new Date(patientData.dob);
                                                var d = new Date();
                                                d.setFullYear(d.getFullYear() - 1);
                                                var isUnder1 = dob > d;

                                                snap.setSnapConsultationSessionData({
                                                    consultationId: newConsultationId,
                                                    appointmentId: appointmentId,
                                                    patientId: patientId,
                                                    personId: personId,
                                                    isScheduled: true,
                                                    consultationAmount: consultationAmount,
                                                    patientQueueEntryId: respData.patientQueueEntryId,
                                                    meetingId: respData.meetingId,
                                                    communicationMethod: consultationData.encounterTypeCode,
                                                    isUnder1: isUnder1
                                                });

                                                if (isUnder1) {
                                                    // redirect to fill birth history
                                                    location.href = "/patient/Intake/#/IntakeStep/4";
                                                } else if (snap.hospitalSettings.showCTTOnScheduled) {
                                                    location.href = "/patient/Intake/#/Confirmation";
                                                } else if (snap.hospitalSettings.insuranceBeforeWaiting) {
                                                    location.href = "/patient/Intake/#/Insurance";
                                                } else if (snap.hospitalSettings.eCommerce && consultationAmount > 0 && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom) {
                                                    location.href = "/patient/Intake/#/Payment";
                                                } else {
                                                    if (kendo.support.mobileOS) {
                                                        snap.openMobileApp(parseInt(newConsultationId), function() {
                                                            sessionStorage.setItem("snap_consultationinitaction", "1");
                                                            location.href = "/patient/Main/#/Waiting";
                                                        });
                                                    } else {
                                                        sessionStorage.setItem("snap_consultationinitaction", "1");
                                                        location.href = "/patient/Main/#/Waiting";
                                                    }
                                                }
                                                isLoadingConsult = false;
                                                dfd.resolve();
                                            }
                                        });
                                    }
                                }
                            }, function(xhr) {
                                $snapNotification.error($utility.formatErrorMessage(xhr));
                                isLoadingConsult = false;
                                dfd.reject();
                            });
                        }
                    }
                }

                return dfd.promise();
            };
        });

}(jQuery, snap, kendo, window));

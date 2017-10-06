(function ($, snap) {
    "use strict";

   snap.namespace("snap.patient.schedule").use(["snap.service.selfSchedulingService", "snap.common.timeUtils", "snap.common.overlay",
        "snap.patient.patientEnterConsultationHelper"])
        .define("patientAppointmentService", function ($selfSchedulingService, $timeUtils, $overlay, $patientEnterConsultationHelper) {
            var formatErrorMessage = function (error) {
                if (typeof (error) === "undefined" || error === null) {
                    return "Unknown error";
                }

                window.console.error(error);

                var errorMessage;
                if (typeof (error) === 'string') {
                    errorMessage = error;
                } else {
                    if (error.status === 500) {
                        errorMessage = "Internal server error";
                    } else if (error.status === 404) {
                        errorMessage = "Not found";
                    } else if (error.responseText) {
                        errorMessage = error.responseText;
                        try {
                            var parsedMessage = JSON.parse(errorMessage);
                            if (!!parsedMessage.message) {
                                errorMessage = parsedMessage.message;
                            }
                        } catch (e) {
                            snap.util.logToConsole(e);
                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };
            function saveAppt(appt) {
                var dfd = $.Deferred();
                appt.startTime = $timeUtils.dateToString(appt.start);
                appt.endTime = $timeUtils.dateToString(appt.end);
                appt.where = appt.phoneNumber;
                appt.whereUse = appt.phoneType;
                delete appt.start;
                delete appt.end;
                delete appt.phoneNumber;
                delete appt.phoneType;

                var action = appt.id === 0 ?
                    $selfSchedulingService.addAppointment(appt) :
                    $selfSchedulingService.updateAppointment(appt, appt.id);

                action.done(function (response) {
                    dfd.resolve(response);
                }).fail(function (response) {
                    dfd.reject(response);
                });

                return dfd.promise();
            }


            function saveAppointmen(appt) {
                var dfd = $.Deferred();
                saveAppt(appt).done(function (appointmentResponse) {
                    if (appt.isNow && $overlay) {
                        var isLoading = true;

                        $overlay.loadOverlay();
                        $overlay.setLoadingIcn("images/Clipboard-Anim-C.svg");
                        $overlay.toggleOverlay();


                        setTimeout(function(){
                            if(isLoading){
                                $overlay.setLoadingTxt("Sending your appointment information.");
                            }
                        }, 3000);

                        setTimeout(function(){
                            if(isLoading){
                                $overlay.setLoadingTxt("Prepping your consultation room.");
                            }
                        }, 6000);

                        //tony.y: i should not do this, copypaste from \Scripts\pagevm\sharedvm\consultationsListing.viewmodel.js direct violation of DRY principle
                        // TODO: create common service to inject it into this object
                        if (snap.patientPage) {
                            var path = '/api/v2.1/patients/appointments/' + appointmentResponse.data[0].appointmentId;
                            $.ajax({
                                type: "GET",
                                url: path,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    isLoading = false;
                                    var data = response.data[0];
                                    //this works slow
                                    $overlay.setLoadingIcn("images/Clipboard-Done-C.svg");
                                    $overlay.setLoadingTxt("All set.");

                                    if (appt.encounterTypeCode === snap.enums.EncounterTypeCode.Phone) {
                                        $overlay.setSubTxt("A provider will call you shortly.");
                                    } else {
                                        $overlay.setSubTxt(" ");
                                    }

                                    Snap.Patient.PatientHomeNewViewModel().goToSchedConsultInternal(data, function() {
                                        window.setTimeout(function() {
                                            $overlay.toggleOverlay();
                                        }, 2000);
                                    });

                                },
                                error: function () {
                                    snapError("Cannot find appointment.");
                                }
                            });
                        }

                    }
                    dfd.resolve(appointmentResponse); //Success
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd.promise();
            }

            this.removeAppointment = function (id) {
                var def = $.Deferred();
                $selfSchedulingService.removeAppointment(id).done(function () {
                    def.resolve();
                }).fail(function (error) {
                    def.reject(formatErrorMessage(error));
                });
                return def.promise();
            };

            this.saveAppointment = function (obj) {
                return saveAppointmen(obj);
            };

            this.getClinician = function (clinicianId, date) {
                var dfd = $.Deferred();
                $selfSchedulingService.getSingleClinician(clinicianId, date).done(function (clinicianResp) {
                    var doc = clinicianResp.data[0];
                    var docPerson = {
                        id: doc.personId,
                        photoUrl: doc.photo,
                        providerId: snap.hospitalSession.hospitalId,
                        name: {
                            given: doc.name,
                            family: doc.lastName
                        }
                    };
                    doc.person = docPerson;
                    doc.fullName = [doc.name, doc.lastName].join(" ");

                    dfd.resolve(doc);
                });
                return dfd.promise();
            };

            this.getAppointment = function (apptId) {
                var promise = $.Deferred();
                var that = this;
                $selfSchedulingService.getAppointment(apptId).done(function (resp) {
                    var appt = resp.data[0];
                    that.getClinician(appt.clinicianId, $timeUtils.dateToString($timeUtils.dateFromSnapDateString(appt.startTime))).done(function (clinicianResp) {
                        appt.clinician = clinicianResp;
                        promise.resolve(appt);
                    }).fail(function () {
                        promise.reject();
                    });
                }).fail(function () {
                    promise.reject();
                });
                return promise.promise();
            };
        });
}(jQuery, snap));

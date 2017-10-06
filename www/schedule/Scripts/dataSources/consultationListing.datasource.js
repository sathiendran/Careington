//@ sourceURL=consultationsListingDataSource.datasource.js

(function ($, global, snap, kendo) {
    "use strict";
    snap.use(["SnapNotification", "snap.common.schedule.ScheduleCommon", "snap.service.availabilityBlockService", "snap.common.timeUtils"])
    .define("consultationsListingDataSource", function ($snapNotification, $scheduleCommon, $availabilityBlockService, $timeUtils) {
        this.consultationStutuses = {
            Scheduled: "Scheduled",
            Past: "Past",
            Dropped: "Dropped",
            DNA: "DNA",
            Active: "Active"
        };
        this.dataSouceModes = {
            Patient: 1,
            Clinician: 0
        };
        var ds = this;

        var encounterTypeCodes = snap.enums.EncounterTypeCode;

        var setEncounterFlags = function (appt) {
            appt.isVideo = appt.encounterTypeCode === encounterTypeCodes.Video;
            appt.isPhone = appt.encounterTypeCode === encounterTypeCodes.Phone;
            appt.isText = appt.encounterTypeCode === encounterTypeCodes.Text;
            appt.isInPerson = appt.encounterTypeCode === encounterTypeCodes.InPerson;
            return appt;
        };

        var isPatientQueueEnabled = function(userType, apptClinicianId) {
            return (userType === $scheduleCommon.userType.admin && snap.isAdminPatientQueueEnabled()) || 
                (userType === $scheduleCommon.userType.clinician && apptClinicianId === snap.profileSession.userId);
        };


        this.getConsultationsInfoForPatient = function (promise, hub, filters) {
            return new kendo.data.DataSource({
                type: "signalr",
                pageSize: 20,
                serverPaging: true,
                schema: {
                    total: "Total",
                    data: "Data",
                    model: {
                        id: "ConsultationId",
                        fields: {
                            "ConsultationId": { type: "number" },
                            "PatientName": { type: "string" }
                        }
                    }
                },
                transport: {
                    signalr: {
                        promise: promise,
                        hub: hub,
                        server: {
                            read: "GetConsultationsInfoForPatient"
                        }
                    },
                    parameterMap: function (data) {
                        data.PatientId = filters.patientId;
                        data.Order = filters.Order;
                        return data;
                    }
                }
            });
        };

        this.getDataSource = function (promise, hub, getFilters) {
            return new kendo.data.DataSource({
                type: "signalr",
                pageSize: 20,
                serverPaging: true,
                schema: {
                    total: "Total",
                    model: {
                        id: "ConsultationId",
                        fields: {
                            "ConsultationId": { type: "number" },
                            "PatientName": { type: "string" }
                        }
                    },
                    data: function (response) {
                        var consultations = response.Data.map(function (consultation) {
                            var appt = {
                                PatientId: consultation.PatientId,
                                apptId: consultation.AppointmentId,
                                consultationId: consultation.ConsultationId,
                                patientName: consultation.PatientName,
                                clinicianName: consultation.AssignedDoctorName,
                                startDate: consultation.ConsultationDate,
                                startTime: consultation.ConsultationTime,
                                duration: snap.dateConversion.formatConsultationDuration(consultation.ConsultationDuration) + " min",
                                showConsultationDetails: false,
                                sessionId: consultation.SessionId || "",
                                dismissed: consultation.Dismissed,
                                appointmentTypeCode: consultation.AppointmentType,
                                encounterTypeCode: consultation.EncounterTypeCode,
                                showConsultBtn: false,
                                inQueue: false
                            };
                            setEncounterFlags(appt);
                            return appt;
                        });

                        return consultations;
                    }
                },
                transport: {
                    signalr: {
                        promise: promise,
                        hub: hub,
                        server: {
                            read: "GetConsultationsInfo"
                        }
                    },
                    parameterMap: function (data, type) {
                        var filters = getFilters();

                        if (type !== "read") {
                            return { data: data.models };
                        }
                        else {
                            data.ConsultationStatus = filters.status;
                            data.PatientId = filters.patientId;
                            data.PhysicianUserId = filters.clinicianUserId;
                            data.IncludeDependents = filters.includePatientDependents;

                            if (filters.startDate)
                                data.StartDate = $timeUtils.dateToString(filters.startDate);
                            if (filters.endDate)
                                data.EndDate = $timeUtils.dateToString($timeUtils.addDays(filters.endDate, 1));

                            return data;
                        }
                    }
                }
            });
        };

        this.getEmptyDataSource = function () {
            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        options.success({
                            data: [],
                            total: 0
                        });
                    }
                },
                schema: {
                    total: "total",
                    data: "data"
                }
            });
        };

        this.getAppointmentsDataSource = function (getFilters, userType) {
            return new kendo.data.DataSource({
                pageSize: 20,
                serverPaging: true,
                transport: {
                    read: function (options) {
                        var filter = getFilters();
                       
                        var obj = {
                            appointmentStatusCodes: [$scheduleCommon.appointmentStatusCode.scheduled, $scheduleCommon.appointmentStatusCode.waiting],
                            appointmentTypeCodes: [$scheduleCommon.appointmentTypeCode.clinicianScheduled,
                                $scheduleCommon.appointmentTypeCode.patientScheduled],
                            skip: options.data.skip,
                            take: options.data.take
                        };

                        if (filter.clinicianUserId) {
                            obj.clinicianIds = [filter.clinicianUserId];
                        }

                        if (filter.patientId) {
                            obj.patientIds = [filter.patientId];
                            obj.includePatientDependents = filter.includePatientDependents ? true : false;
                        }

                        $availabilityBlockService.getUserCurrentTime().done(function (userCurrentTimeResponse) {
                            var userTime = $timeUtils.dateFromSnapDateString(userCurrentTimeResponse.data[0]);
                            var userDNATime = new Date(userTime);
                            userDNATime.setMinutes(userDNATime.getMinutes() - 30);

                            var startDate = filter.startDate instanceof Date ? filter.startDate : new Date("01/01/2000");
                            var endDate = filter.endDate instanceof Date ? $timeUtils.addDays(filter.endDate, 1) : new Date("01/01/2050");

                            var obj = {
                                appointmentStatusCodes: [$scheduleCommon.appointmentStatusCode.scheduled],
                                appointmentTypeCodes: [$scheduleCommon.appointmentTypeCode.clinicianScheduled, 
                                    $scheduleCommon.appointmentTypeCode.patientScheduled],
                                skip:  options.data.skip,
                                take:  options.data.take
                            };

                            if (filter.clinicianUserId) {
                                obj.clinicianIds = [filter.clinicianUserId];
                            }

                            if (filter.patientId) {
                                obj.patientIds = [filter.patientId];
                                obj.includePatientDependents = filter.includePatientDependents ? true : false;
                            }

                            if (filter.status === ds.consultationStutuses.DNA) {
                                if (endDate > userDNATime) {
                                    // for DNA tab we don't need appointments which start time is in the future
                                    // we get appointments which endTime is less or equal userDNATime + maxAppointmentDuration (that is 24 hours).
                                    endDate = userDNATime;
                                }
                            } else if (filter.status === ds.consultationStutuses.Scheduled && startDate < userDNATime) {
                                    // for scheduled tab we don't need appointments which start time is in the past
                                    startDate = userDNATime;
                            }

                            obj.startDate = $timeUtils.dateToString(startDate);
                            obj.endDate = $timeUtils.dateToString(endDate);

                            var promiseForScheduled = (userType === $scheduleCommon.userType.patient) ?
                                      $availabilityBlockService.getAppointmentsForPatient(obj) :
                                      $availabilityBlockService.getAppointmentsForClinician(obj);

                            var promise = promiseForScheduled;
                                                                 
                            if (filter.status === ds.consultationStutuses.Scheduled) {
                                // for Scheduled tab load also "Waiting" appointments
                                var objForWaiting = $.extend(true, {}, obj);
                                objForWaiting.appointmentStatusCodes = [$scheduleCommon.appointmentStatusCode.waiting];

                                // set time frame with 24 hours past buffer
                                var startDateCopy = new Date(startDate);
                                startDateCopy.setDate(startDateCopy.getDate() - 1);
                                objForWaiting.startDate = $timeUtils.dateToString(new Date(startDateCopy));

                                var promiseForWaiting = (userType === $scheduleCommon.userType.patient) ?
                                      $availabilityBlockService.getAppointmentsForPatient(objForWaiting) :
                                      $availabilityBlockService.getAppointmentsForClinician(objForWaiting);

                                // process both responses
                                promise = snap.util.processResponsesAsSingle(promiseForScheduled, promiseForWaiting);
                            }

                            promise.done(function(appointmentsResponse) {
                                var appts = appointmentsResponse.data;

                                appts.forEach(function (appt) {
                                    var scheduledTime = $timeUtils.dateFromSnapDateString(appt.startTime);
                                    appt.expiryTime = Math.floor(scheduledTime.getTime() - userTime.getTime()) / 60000;
                                });

                                options.success({
                                    data: appts,
                                    total: appointmentsResponse.total
                                });
                            }).fail(function (response) {
                                if (response.status === 0 && response.readyState === 0) {
                                    $snapNotification.info("Internet connection lost.");
                                } else {
                                    $snapNotification.error("Cannot read appointments.");
                                }
                                options.error(response);
                            });
                        }).fail(function (response) {
                            if (response.status === 0 && response.readyState === 0) {
                                $snapNotification.info("Internet connection lost.");
                            } else {
                                $snapNotification.error("Cannot read appointments.");
                            }
                            options.error(response);
                        });
                    }
                },
                schema: {
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "string" }
                        }
                    },
                    data: function (response) {
                        var MINUTE_AVAILABLE = 30;
                        var blocks = response.data.map(function (appt) {
                            var startDate = $timeUtils.dateFromSnapDateString(appt.startTime);
                            var filters = getFilters();
                            var obj = {
                                apptId: appt.appointmentId,
                                encounterTypeCode: appt.encounterTypeCode,
                                patientName: "",
                                doctorName: "",
                                startDate: kendo.toString(startDate, "MMM dd, yyyy"),
                                startTime: kendo.toString(startDate, "hh:mm tt"),
                                appointmentTypeCode: appt.appointmentTypeCode,
                                showConsultationDetails: true,
                                showConsultBtn: false,
                                inQueue: $scheduleCommon.isAppointmentInWaiting(appt.appointmentStatusCode) && filters.status !== ds.consultationStutuses.DNA,
                                patientQueueEnabled: isPatientQueueEnabled(userType, appt.clinicianId)
                            };
                            setEncounterFlags(obj);
                            
                            var patient = $scheduleCommon.findPatient(appt.participants);
                            if (patient) {
                                obj.patientName = $scheduleCommon.getFullName(patient.person);
                            }

                            var clinician = $scheduleCommon.findProvider(appt.participants);
                            if (clinician) {
                                obj.clinicianName = $scheduleCommon.getFullName(clinician.person);
                            }

                            if (snap.patientPage && obj.isVideo && appt.expiryTime <= MINUTE_AVAILABLE && appt.expiryTime >= -MINUTE_AVAILABLE) {
                                obj.showConsultBtn = true;
                            }
                            return obj;
                        });
                        return blocks;
                    }
                }
            });
        };



    }).singleton();
})(jQuery, window, snap, kendo);
(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("availabilityBlockService", function ($http) {
        var abApiUrl = "/api/v2.1/clinicians/availability-blocks",
            apptApiUrl = "/api/v2.1/clinicians/appointments",
            codeSetsDS,
            codeSetDataSourceWrapper = snap.resolveObject("snap.dataSource.codeSetDataSourceWrapper");

        if (codeSetDataSourceWrapper) {
            codeSetsDS = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);
        }

        this.getAvailabilityBlocks = function (opt) {
            var path = abApiUrl;

            return $http.get(path, {
                ClinicianIds: opt.clinicianIds,
                StartDate: opt.startDate,
                EndDate: opt.endDate
            });
        };

        this.getSingleAvailabilityBlock = function (blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $http.get(path);
        };

        this.addAvailabilityBlock = function (block) {
            var path = abApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(block),
            });

        };

        this.updateAvailabilityBlock = function (block, blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(block),
            });
        };

        this.deleteAvailabilityBlock = function (blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        this.deleteAvailabilityBlockRule = function (blockId, ruleId) {
            var path = [abApiUrl, blockId, "rule", ruleId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        this.getAvailabilityBlockClinician = function (blockId) {
            var path = [abApiUrl, blockId, "clinicians"].join("/");

            return $http.get(path);
        };

        this.getAppointmentsForClinician = function (opt) {
            var path = apptApiUrl;

            return $http.get(path, opt);
        };

        this.getAppointmentsForPatient = function (opt) {
            return $http.get("/api/v2.1/patients/filtered-appointments", opt);
        };

        this.getPatientAppointmentsForPatient = function (patientId, opt) {
            var path = ["/api/v2.1/patients", patientId, "filtered-appointments"].join("/");
            return $http.get(path, opt);
        };


        this.getAppointment = function (apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $http.get(path);
        };

        this.getAppointmentForpatient = function (apptId) {
            var path = ["/api/v2.1/patients/appointments", apptId].join("/");

            return $http.get(path);
        };

        /************************ Appointments *************************/
        this.addAppointment = function (appt) {
            var path = apptApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };

        this.updateAppointment = function (appt, apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };

        this.deleteAppointment = function (apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        /************************ COVERAGES *************************/
        this.getCoverageBlocks = function (filters) {
            var dfd = $.Deferred();
            if (filters.type !== "all") {
                $http.get('/api/v2.1/clinicians/availability-blocks/coverage', filters).done(function (coverageBlocks) {
                    var blocks = extendBlockArrayWithType(coverageBlocks.data, filters.type);
                    dfd.resolve({ data: blocks, total: blocks.length });
                }).fail(function () {
                    dfd.reject();
                });
            } else {
                $.when(
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "onDemand" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "patientScheduled" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "adminScheduled" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "unavailable" }))
                    ).done(function (onDemand, patientScheduled, adminScheduled, unavailable) {
                        var blocks = [].concat(
                            extendBlockArrayWithType(onDemand[0].data, 'onDemand'),
                            extendBlockArrayWithType(patientScheduled[0].data, 'patientScheduled'),
                            extendBlockArrayWithType(adminScheduled[0].data, 'adminScheduled'),
                            extendBlockArrayWithType(unavailable[0].data, 'unavailable')
                        );
                        dfd.resolve({ data: blocks, total: blocks.length });
                    }).fail(function () {
                        dfd.reject();
                    });
            }

            return dfd.promise();

            function extendBlockArrayWithType(coverageBlocks, coverageBlockType) {
                return coverageBlocks.map(function (item) {
                    return $.extend({}, item, { type: coverageBlockType });
                });
            }
        };

        /************************ ENCOUNTER DIALOG *************************/

        this.saveEncounterDocument = function(encDoc) {
            var path = "/api/v2.1/clinicians/documentencounter";

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(encDoc),
            });
        };

        /************************ CONCERNS **************************/
        this.getOtherPrimaryConcernId = function () {
            return codeSetsDS.getItemIdByName("primary", snap.hospitalSession.hospitalId, "other (provide details below)");
        };

        this.getOtherSecondaryConcerId = function () {
            return codeSetsDS.getItemIdByName("secondary", snap.hospitalSession.hospitalId, "other (provide details below)")
        }
        this.getPrimaryConcerns = function () {
            var def = $.Deferred();
            this.getOtherPrimaryConcernId().done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "primary",
                        snap.hospitalSession.hospitalId, [
                            "Other (provide details below)"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSource("primary", snap.hospitalSession.hospitalId));
                }
            });

            return def.promise();
        };

        this.getSecondaryConcerns = function () {
            var def = $.Deferred();
            this.getOtherSecondaryConcerId().done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "secondary",
                        snap.hospitalSession.hospitalId, [
                            "Other (provide details below)"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSource("secondary", snap.hospitalSession.hospitalId));
                }
            });
            return def.promise();
        };

        /************************ PERSON **************************/
        this.getPatientList = function (providerId, opt) {
            var path = ["/api/v2.1/providers", providerId, "patients"].join("/");
            var parameters = opt || {};

            return $http.get(path, parameters);
        };

        this.getClinicianList = function (providerId, opt) {
            var path = ["/api/v2.1/providers", providerId, "clinicians"].join("/");
            var parameters = opt || {};

            return $http.get(path, parameters);
        };

        this.getAllStaffAccountsForScheduling = function (providerId) {
            var path = ["/api/v2.1/providers/", providerId, "/clinicians?roleFunctions=", snap.security.conduct_virtual_consultations].join("");

            return $http.get(path);
        };

        this.getPersonByEmail = function (email, userType) {
            var path = "/api/v2.1/people?email=" + email;

            if (userType) {
                path += "&userType=" + userType;
            }

            return $http.get(path);
        };

        this.getUserCurrentTime = function () {
            return $http.get("/api/v2.1/users/current-time");
        };

        this.getPatientProfile = function (providerId, patientId) {
            var path = ["/api/v2.1/providers", providerId, "patients", patientId].join("/");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };
        this.getPatientProfilesForPatient = function (opt) {
            var path = snap.baseUrl + "/api/v2.1/patients/authorized-patients";
            var parameters = opt || {};

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: parameters
            });
        };
        this.getPatientProfileForPatient = function (patientId) {
            var path = [snap.baseUrl + "/api/v2.1/patients/authorized-patients", patientId].join("/");
            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.getClinicianProfile = function (providerId, clinicianId) {
            var path = ["/api/v2.1/providers", providerId, "users", clinicianId, "clinician/person"].join("/");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };
        this.convertTime = function(opt) {
            var path = "/api/v2.1/convert-time";
            return $http.get(path, opt);
        };
        this.getTimeZones = function() {
            var path = "/api/v2/timezones";
            return $http.get(path);
        };

    }).singleton();
}(jQuery, window.snap = window.snap || {}));

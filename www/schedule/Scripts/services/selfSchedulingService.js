//@ sourceURL=selfSchedulingService.js

(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("selfSchedulingService", function($http) {

        var apptApiUrl = "/api/v2.1/patients/appointments";
        this.getAppointment = function (apptId) {
            return $http.get([apptApiUrl, apptId].join("/"));
        }
         this.addAppointment = function(appt) {
            var path = apptApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
         };

         this.removeAppointment = function (appointmentId) {
             var path = [apptApiUrl, appointmentId].join("/");

             return $.ajax({
                 type: "DELETE",
                 url: path
             });
         };

        this.updateAppointment = function(appt, apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };
        this.getSingleClinician = function (clinicianUserId, date) {
            return $.ajax({
                type: "GET",
                url: ["/api/v2.1/patients/appointments/self-scheduling/clinicians", clinicianUserId].join("/"),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {date: date},
            });
        };

        this.getCliniciansCards = function (opt) {
            return $.get("/api/v2.1/patients/appointments/self-scheduling/clinicians", opt);
        };

        this.getFamillyGroup = function(opt){
            return $http.get("/api/v2.1/patients/authorized-patients", opt);
        };

        this.getFamillyGroupPatient = function(patientId){
            return $http.get(["/api/v2.1/patients/authorized-patients", patientId].join("/"));
        };

        this.getClinicianCard = function (userId, date) { 
            return $.get(["/api/v2.1/patients/appointments/self-scheduling/clinicians", userId].join("/"), {date: date});
        };

        this.addClinicianToFavourites = function (data) {
            return $.ajax({
                type: "POST",
                url: "/api/v2.1/patients/favorite-clinicians",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
            });
        };

        this.removeClinicianFromFavourites = function (personId) {
            //Real API call.
            return $.ajax({
                type: "DELETE",
                url: ["/api/v2.1/patients/favorite-clinicians", personId].join("/"),
            });
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
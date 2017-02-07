/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />


; (function ($, snap) {

    "use strict";

    snap.namespace("snap.service").using(["snapHttp"]).define("appointmentService", function ($http) {
        this.getAppointment = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/physicians/appointments/", id, '/all'].join(""));
        };
       
        this.getAppointments = function (data) {
            return $http.get([snap.baseUrl, "/api/v2/admin/consultations"].join(""), data);
        };
        this.getVideoKey = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/physicians/appointments/", id, "/videokey"].join(""));
        };
        
        this.saveSoapData = function (data) {
            var url = [snap.baseUrl, "/api/v2/physicians/soapnotes"].join("");
            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });
           
        };

        this.getParticipants = function (consulationId) {
            var url = [snap.baseUrl, "/api/v2/patients/consultations/",consulationId,"/participants"].join("");
            return $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json; charset=utf-8"
            });
        };
        this.saveMedicalCodeForConsultation = function (data) {
            var url=[snap.baseUrl, "/api/v2/physicians/consultation/medicalcodes"].join("");
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
            return $http.get([snap.baseUrl, "/api/v2/physicians/medicalcodingsconfiguration/", consultationId].join(""));
        };
        this.getPhysicianInformation = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/Physicians/", id].join(""));
        };
        this.getConsultationDetails = function(consultationId) {
            return $http.get([snap.baseUrl, "/api/reports/consultationreportdetails/", consultationId].join(""));
        };
        this.getConsultationChartNotes = function(consultationId, meetingTypeCode) {
            return $http.get([snap.baseUrl, "api/reports/consultationreportdetails/chatnote", consultationId, meetingTypeCode].join("/"));
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

        this.getPhysicianActiveConsultations = function() {
            return $http.get([snap.baseUrl, "/api/v2/physicians/consultations/activeconsultations"].join(""));
        };

        this.getPhysicianActiveOpenConsultations = function () {
            return $http.get([snap.baseUrl, "/api/v2/physicians/consultations/activeopenconsultations"].join(""));
        };


        this.clinicianEndActiveConsultaion = function(consulationId) {
            var url = [snap.baseUrl, "/api/v2/physicians/consultations/activeconsultations/",consulationId].join("");
            return $.ajax({
                url: url,
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            });
        };

        this.clinicianEndActiveOpenConsultaion = function (meetingId) {
            var url = [snap.baseUrl, "/api/v2/physicians/consultations/activeopenconsultations/", meetingId].join("");
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
            var url = ["/api/v2.1/clinician/appointments/", appointmentId, "/notifications"].join("");

            return $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                timeout: 60000,
                data: JSON.stringify(request)
            });  
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


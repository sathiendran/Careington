/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="../models/model.js" />

var snap = snap || {};

if (!snap.dataService) {
    snap.dataService = {};
}
snap.baseUrl = "";

snap.dataService.physicianDataService = (function () {
    'use strict';
    var
    saveSoapData = function (data) {

        return $.post([snap.baseUrl, "/api/patients/consultations/soapnote"].join(""), data);
    },
    getConsultationById = function (id) {
        return $.getJSON([snap.baseUrl, "/api/patients/consultations/", id, "/all"].join(""));
    },
    getPatientInformationByConsultationId = function (id) {
        return $.getJSON([snap.baseUrl, "/api/patients/consultations/", id, "/patientprofile"].join(""));
    },
    getCptCodes = function () { //cptCode Obsolet
        return $.getJSON([snap.baseUrl, "/api/patients/consultations/CptCodes"].join(""));
    };

    return {
        saveSoapData: saveSoapData,
        getCptCodes: getCptCodes, //cptCode Obsolet
        getConsultationById: getConsultationById,
        getPatientInformationByConsultationId: getPatientInformationByConsultationId

    };

}());

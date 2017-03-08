/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />


; (function ($, snap) {

    "use strict";

    snap.namespace("snap.service.Report").using(["snapHttp"]).define("Consultation", function ($http) {
        this.getConsultation = function (id, include) {
            return $http.get([snap.baseUrl, "/api/v2/reports/consultation/", id, "?include=", include].join(""));
        };
        this.getChat = function (id) {
            return $http.get([snap.baseUrl, "/api/v2/reports/consultation/chat/", id].join(""));
        };
        this.checkSlot = function (data) {
            return $http.post([snap.baseUrl, "/api/v2/schedule/consultations/checkSlot"].join(""), data);
        },
        this.reschedule = function (data) {
            return $http.ajax({ method: 'PUT', url: [snap.baseUrl, "/api/v2/schedule/consultations/", data.consultationId, "/reschedule"].join(""), data: data });
        },
        this.IntakeModel = kendo.data.Model.define({
            fields: {
                "infantData": {
                    defaultValue: {
                        patientAgeUnderOneYear: 'N',
                        dischargedWithMother: '',
                        fullTerm: 'N',
                        vaccinationsCurrent: 'N',
                        vaginalBirth: 'N',

                    }
                }
            }
        });
        this.InfantModel = kendo.data.Model.define({
            fields: {
                "patientAgeUnderOneYear": { defaultValue: 'N'},
                "dischargedWithMother": {defaultValue: '' },
                "fullTerm": {defaultValue: '' },
                "vaccinationsCurrent": { defaultValue: '' },
                "vaginalBirth": { defaultValue: '' },
            }
        });
        this.ConsultationModel = kendo.data.Model.define({
            fields: {
                "doctorFirstName": { type: "string" },
                "doctorLastName": { type: "string" },
                "medicalSpeciality": { type: "string" },
                "isNoCharge": { defaultValue: "N" },
                "patientName": {  },
                "lastName": {  },
                
                "profileImagePath": { type: "string" },
                "patientAddress": {},
                "homePhone":{},
                "mobilePhone": {},
                "primaryConcern": { type: "string" },
                "secondaryConcern": { nullable: false },
                "subjective": { type: "string" },
                "objective": { type: "string" },
                "assessment": { type: "string" },
                "plane": { type: "string" },
                "note": { type: "string" },
                "gender": {},
                
                "consultationDate": { type: "date" },
                "scheduledDate": { type: "date" },
                "scheduledTime": { type: "date" },
                "dob": { type: "date" },
                "medicalCodeDetails": { type: "array" },
                
                
            }
        });
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


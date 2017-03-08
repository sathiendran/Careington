; (function ($, snap) {
    "use strict";

    snap.namespace("snap.DataService").using(["snapHttp"]).define("healthPlanDataService", function ($http) {
        this.skipHealthPlan = function (healthPlanId, data) {
            return $.ajax({
                url: [snap.baseUrl, "/api/healthplan/", healthPlanId, "/skip"].join(""),
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.applyHealthPlan = function (healthPlanId, data) {            
            return $.ajax({
                url: [snap.baseUrl, "/api/healthplan/", healthPlanId, "/apply"].join(""),
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.clearHealthPlan = function (data) {            
            return $.ajax({
                url: [snap.baseUrl, "/api/healthplan/", -1, "/clear"].join(""),
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.getHealthPlans = function (patientId) {
            return $http.get([snap.baseUrl, "/api/v2/healthplans", (patientId ? ("?patientId=" + patientId) : "")].join(""));
        };
        this.getHealthPlanDetails = function (policyNumber, patientId) {
            return $http.get([snap.baseUrl, "/api/healthplan?policyNumber=", policyNumber, (patientId ? ("&patientId=" + patientId) : "")].join(""));
        };
        this.addHealthPlan = function (planData) {
            return $.ajax({
                url: [snap.baseUrl, "/api/healthplan"].join(""),
                type: "POST",
                data: JSON.stringify(planData),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.editHealthPlan = function (planId, planData) {
            return $.ajax({
                url: [snap.baseUrl, "/api/healthplan/", planId].join(""),
                type: "PUT",
                data: JSON.stringify(planData),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.getHealthPlanProviders = function () {
            return $http.get([snap.baseUrl, "/api/v2/healthplan/providers"].join(""));
        };
        
    }).singleton();



}(jQuery, window.snap = window.snap || {}));


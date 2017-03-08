//@ sourceURL=adminAnalyticsService.js

/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />
; (function ($, snap) {

    'use strict';

    snap.namespace("snap.service").using(["snapHttp"]).define("adminAnalyticsService", function ($http) {

        const datePattert = "yyyy-MM-dd";
        var chartUrl = function (chartName, options) {
            var array = [
                "/api/v2/clinicians/dashboard",
                chartName,
                kendo.toString(options.startDate, datePattert),
                kendo.toString(options.endDate, datePattert)
            ];

            if (options.measureType) {
                array.push(options.measureType);
            }

            return array.join("/");
        }

        this.getAvgWaitingTime = function (options) {
            return $http.get(chartUrl("wait-times", options));
        };

        this.getAvgConsultationTime = function (options) {
            return $http.get(chartUrl("consultation-times", options));
        };

        this.getSymptomTracker = function (options) {
            return $http.get(chartUrl("symptoms", options));
        };
       
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


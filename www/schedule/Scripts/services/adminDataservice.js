/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />




; (function ($, snap) {

    'use strict';

    snap.using(["snapHttp"]).define("adminService", function ($http) {
        this.getTimeZones = function () {
            return $http.get([snap.baseUrl, "/api/v2/timezones"].join(""));
        };
        this.saveData = function (data) {
            return $http.post([snap.baseUrl, "/api/admin/pendingaccounts"].join(""), JSON.stringify(data), $.ajaxSetup({contentType: "application/json"}));
        };
        this.getCountryCodes = function () {
            return $http.get([snap.baseUrl, "/api/countrycode"].join(""));
        };
        this.getProfileData = function (id) {
            return $http.get([snap.baseUrl, "/api/admin/pendingaccounts/", id].join(""));
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));


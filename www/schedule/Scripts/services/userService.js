(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("userService", function ($http) {
        this.getUserCurrentTime = function () {
            return $http.get("/api/v2.1/users/current-time").fail(function () {
                snap.redirectToLogin();
            });
        };

        this.getUserTimeZoneId = function() {
            return $http.get("/api/v2.1/users/current-time");
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("medicalCodesService", function ($http) {
        var apiPath = "/api/v2/physicians/medicalcodes";

        this.get = function (data) {
            return $.ajax({
                url: apiPath,
                type: "GET",
                data: data,
            });
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
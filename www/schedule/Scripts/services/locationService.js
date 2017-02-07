(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("locationService", function ($http) {
        var postalCodeApiUrl = "/api/v2.1/admin/postalcodes";

        this.getPostalCodes = function(filter) {
            return $http.get(postalCodeApiUrl, filter);
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
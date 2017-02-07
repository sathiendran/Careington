(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("codesService", function ($http) {
        this.getCodeSet = function(hospitalId, codeSetName) {
            return $.ajax({
                url: "/api/v2/codesets",
                type: "GET",
                data: {
                    hospitalId: hospitalId,
                    fields: codeSetName
                }
            });
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("serviceTypesService", function ($http) {
        var apiPath = "/api/v2.1/service-types";

        this.get = function (hospitalId) {
            return $.ajax({
                url: apiPath,
                type: "GET",
                data:{ providerId: hospitalId},
            });

        };

        this.create = function(serviceType) {
            return $.ajax({
                url: apiPath,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(serviceType)
            });
        };

        this.update = function(serviceType) {
            return $.ajax({
                url: [apiPath, serviceType.serviceTypeId].join("/"),
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(serviceType)
            });
        };

        this.delete = function(serviceTypeId) {
            return $.ajax({
                url: [apiPath, serviceTypeId].join("/"),
                type: "DELETE"
            });
        }

        this.reorder = function(serviceTypes) {
            return $.ajax({
                url: [apiPath, "reorder"].join("/"),
                type: "PATCH",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(serviceTypes)
            });
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
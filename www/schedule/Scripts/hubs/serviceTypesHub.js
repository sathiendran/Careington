//@ sourceURL=serviceTypesHub.js

"use strict";
(function (global, $, snap) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("serviceTypesHub", function ($hubModel) {
            var serviceTypesHub = $.connection.serviceTypesHub,
                scope = this;

            this._name = "serviceTypesHub";

            $hubModel._initModel(serviceTypesHub, this);

            this._initClient = function () {
                serviceTypesHub.client = {};
                serviceTypesHub.client.changed = function () {
                    scope.triggerEvent("changed");
                };
            };

            this._initConnection = function () {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };
        }).singleton();
})(window, jQuery, snap);

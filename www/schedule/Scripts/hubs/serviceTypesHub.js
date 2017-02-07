//@ sourceURL=serviceTypesHub.js

"use strict";
(function (global, $, snap) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("serviceTypesHub", function ($hubModel) {
            var serviceTypesHub = $.connection.serviceTypesHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(serviceTypesHub, this);

            var initEvent = function () {
                serviceTypesHub.client = {};
                serviceTypesHub.client.changed = function () {
                    scope.triggerEvent("changed");
                };
            };

            var initConnection = function () {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function () {
                initConnection();

                if (isInitialized) {
                    window.console.log("serviceTypesHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("start", function () {
                    isStarted = true;
                    window.console.log("serviceTypesHub started");
                });

                initEvent();
            };

            this.isHubStarted = function () {
                return isStarted;
            };

            this.isHubInitialized = function () {
                return isInitialized;
            };

            this.markAsStarted = function (value) {
                isStarted = !!value;
            };
        }).singleton();
})(window, jQuery, snap);

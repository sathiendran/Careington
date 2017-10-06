//@ sourceURL=patientIntakeHub.js

"use strict";
(function(global, $, snap) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("patientIntakeHub", function($hubModel) {
            var patientIntakeHub = $.connection.patientIntakeHub,
                scope = this;

            this._name = "patientIntakeHub";

            $hubModel._initModel(patientIntakeHub, this);

            this._initClient = function() {
                patientIntakeHub.client = {};
                patientIntakeHub.client.onAppointmentIsProcessed = function(patientName) {
                    scope.triggerEvent("onAppointmentIsProcessed", patientName);
                };
            };

            this._initConnection = function(opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
                if (opt) {
                    $.connection.hub.qs["appointmentId"] = opt.appointmentId;
                }
            };

            this.keepOnDisconnect = function() {
                return this._invokeServerFunction("keepOnDisconnect");
            };
        }).singleton();
})(window, jQuery, snap);

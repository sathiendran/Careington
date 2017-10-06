;
(function(global, $, snap) {
    "use strict";
    
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("consultationsListingHub", function($hubModel) {
            var consultationsListingHub = $.connection.consultationsListingHub,
                scope = this;

            this._name = "consultationsListingHub";

            $hubModel._initModel(consultationsListingHub, this);

            this._initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this._initClient = function() {
                consultationsListingHub.client = {};
                consultationsListingHub.client.refreshConsultationsListings = function() {
                    scope.triggerEvent("refreshConsultationsListings");
                };
            };

            this._initDetails = function() {
                scope.on("refreshConsultationsListings", function() {
                    window.console.log("consultationsListingHub: Refresh consultations listings");
                });
            };

            this.refresh = function() {
                return this._invokeServerFunction("refresh");
            };

            this.getConsultationsInfo = function(data) {
                return this._invokeServerFunction("getConsultationsInfo", data);
            };

            this.getConsultationsInfoForPatient = function(data) {
                return this._invokeServerFunction("getConsultationsInfoForPatient", data);
            };

        }).singleton();
})(window, jQuery, snap);

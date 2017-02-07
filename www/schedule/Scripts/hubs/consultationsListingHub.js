;
(function(global, $) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("consultationsListingHub", function($hubModel) {
            var consultationsListingHub = $.connection.consultationsListingHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(consultationsListingHub, this);

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function() {
                if (isInitialized) {
                    window.console.log("consultationsListingHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("refreshConsultationsListings", function() {
                    window.console.log("consultationsListingHub: Refresh consultations listings");
                });
                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("consultationsListingHub started");
                });

                consultationsListingHub.client = {};
                consultationsListingHub.client.refreshConsultationsListings = function() {
                    scope.triggerEvent("refreshConsultationsListings");
                };

                initConnection();
            };

            this.isHubStarted = function() {
                return isStarted;
            };

            this.isHubInitialized = function() {
                return isInitialized;
            };

            this.markAsStarted = function(value) {
                isStarted = !!value;
            };

            this.refresh = function() {
                return consultationsListingHub.server.refresh();
            };

            this.getConsultationsInfo = function(data) {
                return consultationsListingHub.server.getConsultationsInfo(data);
            };

            this.getConsultationsInfoForPatient = function() {
                return consultationsListingHub.server.getConsultationsInfoForPatient(data);
            };

        }).singleton();
})(window, jQuery);

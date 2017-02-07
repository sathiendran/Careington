;
(function(global, $) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("creditHub", function($hubModel) {
            var creditHub = $.connection.creditHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(creditHub, this);

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function(isCustomer) {
                if (isInitialized) {
                    window.console.log("creditHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("creditHub started");
                });

                creditHub.client = {
                    onCreditChanged: function () {
                        scope.triggerEvent("onCreditChanged");
                    }
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

        }).singleton();
})(window, jQuery);

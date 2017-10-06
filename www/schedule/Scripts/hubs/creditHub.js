;
(function(global, $, snap) {
    "use strict";

    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("creditHub", function($hubModel) {
            var creditHub = $.connection.creditHub,
                scope = this;

            this._name = "creditHub";

            $hubModel._initModel(creditHub, this);

            this._initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this._initClient = function() {
                creditHub.client = {
                    onCreditChanged: function () {
                        scope.triggerEvent("onCreditChanged");
                    }
                };
            };

        }).singleton();
})(window, jQuery, snap);

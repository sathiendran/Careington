/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../jquery.signalR-2.2.1.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../snap.common.js" />

;
(function(snap, $) {
    "use strict";

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("notificationService", function($hubModel) {
            var scope = this,
                snapNotificationsHub = $.connection.snapNotificationsHub;

            this._name = "notificationService";

            $hubModel._initModel(snapNotificationsHub, this);

            this._initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this._initClient = function() {
                snapNotificationsHub.on("broadcastMessage", function(messageType, message) {
                    window.console.log("notificationService: broadcastMessage");
                    scope.triggerEvent("message", messageType, message);
                });
            };

        }).singleton();

}(snap, jQuery));
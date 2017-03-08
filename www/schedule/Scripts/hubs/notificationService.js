/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../jquery.signalR-2.2.0.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../snap.common.js" />

;
(function(snap, $) {

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("notificationService", function($hubModel) {
            var scope = this,
                isStarted = false,
                isInitialized = false,
                snapNotificationsHub = $.connection.snapNotificationsHub;

            $hubModel._initModel(snapNotificationsHub, this);

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            var initEvent = function() {
                snapNotificationsHub.on("broadcastMessage", function(messageType, message) {
                    window.console.log("notificationService: broadcastMessage");
                    scope.triggerEvent("message", messageType, message);
                });
            };

            this.init = function() {
                initConnection();
                
                if (isInitialized) {
                    window.console.log("notificationService was initialized before");
                    return;
                }
                isInitialized = true;
                initEvent();

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("notificationService started");
                });
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

}(snap, jQuery));

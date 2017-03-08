// snap.session.js
// Provides session timeout monitoring for application end-users.
// Dependencies: jQuery, SignalR, server-generated SignalR module ("~/signalr/hubs")
;
(function(global, $) {
    if (snap.hub && snap.hub.mainHub) {
        return;
    }
  
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("mainHub", function($hubModel) {

            var snap = global.snap = global.snap || {},
                scope = this,
                hubs = [],
                isInitialized = false;

            $hubModel._initModel(null, this);

            $.connection.hub.reconnected(function() {
                console.log("SignalR: reconnected");
                setTimeout(function() {
                    console.log("SignalR: hub restarting");
                    scope.start();
                }, 5000);
            });

            $.connection.hub.connectionSlow(function() {
                console.log("SignalR: connectionSlow");
            });
           
            $.connection.hub.stateChanged(function(change) {
                console.log("SignalR newState: " + change.newState);
                if (change.newState === $.signalR.connectionState.connected) {
                    if (hubReconnctTimer) {
                        clearInterval(hubReconnctTimer);
                        hubReconnctTimer = null;
                    }
                    onStart();
                } else if (change.newState === $.signalR.connectionState.disconnected) {
                    
                    onDisconnect();
                }
            });


            var initConnection = function() {
                if (isInitialized) {
                    return;
                }
                isInitialized = true;

                $.connection.hub.logging = true;
                $.connection.hub.qs = {};
                hubs = [];

                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                } else {
                    snap.getSnapUserSession();
                    if(!snap.userSession && snap.redirectToLogin && !(snap.publicPage || snap.loginPage)){
                        // if userSession is not defined
                        snap.redirectToLogin();
                    }
                }
            };

            var onStart = function() {
                window.console.log("SignalR: started");
                scope.triggerEvent("start");
                $.each(hubs, function(index, hub) {
                    hub.triggerEvent("start");
                    if (hub.markAsStarted) {
                        hub.markAsStarted(true);
                    }
                });
            };
            var hubReconnctTimer = null;
            var numberofRetry = 0;
            var notificationIsActive = false; 

            var onDisconnect = function() {
                var wasConsultation = snap.ConsultationPage;
                console.log("SignalR: disconnected");
                $.each(hubs, function(index, hub) {
                    if (hub.markAsStarted) {
                        hub.markAsStarted(false);
                    }
                });
                if (scope.isManualStop) {
                    return;
                }

                //only show the message on consulation Page
                if (wasConsultation) {
                    snapInfo("Attempting to reconnect...."); //todo keep this up 
                }
                if (hubReconnctTimer) {
                    clearInterval(hubReconnctTimer);
                    hubReconnctTimer = null;
                }
                hubReconnctTimer = setInterval(function () {
                    numberofRetry++;
                    if (numberofRetry >= 5 && !notificationIsActive) {
                        
                        notificationIsActive = true;

                        var yesCall = function () {
                            snap.clearPage();
                            window.location.reload(true);
                        };

                        var noCall = function () {
                            notificationIsActive = false;
                            numberofRetry = 0;
                        }

                        snap
                            .SnapNotification()
                            .confirmationWithCallbacks("Connection to the system is lost. Do you want to refresh the page?", yesCall, noCall);
                    }

                    console.log("SignalR: Reconnection attempt");
                    $.connection.hub.start()
                        .done(function() {
                            if (hubReconnctTimer) {
                                clearInterval(hubReconnctTimer);
                                hubReconnctTimer = null;

                            }
                        });

                }, 1 * 30 * 1000); //todo tony.y: why so? what about using parameters form snap.config?
            };

            this.register = function(hub) {
                initConnection();
                if (typeof hub === "undefined" || !hub) {
                    return;
                }
                var args = Array.prototype.slice.call(arguments, 1);
                hub.init.apply(hub, args);
                hubs.push(hub);
            };
            this.isManualStop = false;
            this.start = function() {
                var dfd = $.Deferred();
                initConnection();
                console.log('Register Hubs_' + hubs.length);
                numberofRetry = 0;
                this.isManualStop = true;
                $.connection.hub.stop();
                

                window.setTimeout(function () {
                    var option = {};
                    if (snap.signalTransport && snap.signalTransport == "longpolling") {
                        option.transport = "longPolling";
                    }
                    $.connection.hub.start(option).done(function () {
                        scope.isManualStop = false;
                        dfd.resolve();
                    }).fail(function () {
                        scope.isManualStop = false;
                        dfd.reject();
                    });
                }, 100);
                
                return dfd.promise();
            };

            this.isHubStarted = function() {
                return $.connection.hub.state === $.signalR.connectionState.connected;
            };

            this.stop = function() {
                window.console.log("SignalR: stop");
                this.isManualStop = true;
                $.connection.hub.stop();
                isInitialized = false;
            };
        }).singleton();
}(window, jQuery));

// snap.session.js
// Provides session timeout monitoring for application end-users.
// Dependencies: jQuery, SignalR, server-generated SignalR module ("~/signalr/hubs")
;
(function(global, $, snap) {
    "use strict";
    if (snap.hub && snap.hub.mainHub) {
        return;
    }

    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("mainHub", function($hubModel) {

            var snap = global.snap = global.snap || {},
                scope = this,
                hubs = [],
                isInitialized = false;

            this._name = "mainHub";

            $hubModel._initModel(null, this);

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
                if (snap.isUnloading) {
                    window.console.log("SignalR was disconnected due to page unloading");
                    // do nothing if disconnects due to navigation between pages
                    return;
                }
                var wasConsultation = snap.ConsultationPage;
                window.console.log("SignalR: disconnected");
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
                  //  global.snapInfo("Attempting to reconnect...."); //todo keep this up
                      navigator.notification.alert(
                          snap.alertInternetConnection, //'No Internet Connection.', // message
                          function() {
                               //window.location.href = snap.redirctPage;
                              // window.location.reload(true);
                          },
                          snap.appName, // title
                          snap.sessAlertDone //'Done' // buttonName
                      );
                      return false;
                }
                if (hubReconnctTimer) {
                    clearInterval(hubReconnctTimer);
                    hubReconnctTimer = null;
                }
                hubReconnctTimer = setInterval(function () {
                    numberofRetry++;
                    if (numberofRetry >= 5 && !notificationIsActive) {

                        notificationIsActive = true;

                        navigator.notification.alert(
                          snap.ssConnectLost, //'Connection to the system is lost.', // message
                            function() {
                                 if(snap.redirctPage == undefined) {
                            //window.location.href = "#/tab/chooseEnvironment";

                                     if (deploymentEnvLogout === "Multiple") {
                                         window.location.href = '#/tab/chooseEnvironment';
                                     } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                                         window.location.href = '#/tab/singleTheme';
                                     }else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
                                         window.location.href = '#/tab/singleTheme';
                                     }else {
                                         window.location.href = '#/tab/login';
                                     }

                                } else {
                                 window.location.href = snap.redirctPage;
                                }
                            },
                            snap.appName, // title
                            snap.sessAlertDone //'Done' // buttonName
                        );
                        return false;

                        /*var yesCall = function () {
                            snap.clearPage();
                             location.href = snap.redirctPage;
                          //  window.location.reload(true);
                        };

                        var noCall = function () {
                            notificationIsActive = false;
                            numberofRetry = 0;
                        };

                        snap
                            .SnapNotification()
                            .confirmationWithCallbacks("Connection to the system is lost. Do you want to logged out the app?", yesCall, noCall);*/
                    }

                    window.console.log("SignalR: Reconnection attempt");
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
                if (hub._name) {
                    window.console.log('SignalR: Register Hub: ' + hub._name);
                }
                var args = Array.prototype.slice.call(arguments, 1);
                hub.init.apply(hub, args);

                if (hubs.indexOf(hub) === -1) {
                    hubs.push(hub);
                }
            };
            this.isManualStop = false;
            this.start = function() {
                $.connection.hub.url = snap.baseUrl + "/api/signalr";
                var dfd = $.Deferred();
                initConnection();
                window.console.log('SignalR: Invoking start. Were registered', hubs.length, 'hubs, hub.url', $.connection.hub.url);
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
                window.console.log("SignalR: manual stop");
                this.isManualStop = true;
                $.connection.hub.stop();
                isInitialized = false;
            };

            $.connection.hub.reconnected(function () {
                window.console.log("SignalR: reconnected");
                window.setTimeout(function () {
                    window.console.log("SignalR: hub restarting");
                    scope.start();
                }, 5000);
            });

            $.connection.hub.connectionSlow(function () {
                window.console.log("SignalR: connectionSlow");
            });

            $.connection.hub.stateChanged(function (change) {
                window.console.log("SignalR newState: " + change.newState);
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
        }).singleton();
}(window, jQuery, snap));

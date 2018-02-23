;
(function(global, $, snap) {
    "use strict";

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("sessionLimiterHub", function($hubModel) {
            var sessionLimiterHub = $.connection.sessionLimiterHub;

            this._name = "sessionLimiterHub";

            $hubModel._initModel(sessionLimiterHub, this);

            this._initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this._initClient = function() {
                var loginPath;
                var currentUrl = window.location.href.toLowerCase();

                if ((currentUrl.indexOf('provider/') != -1)) {
                    loginPath = snap.clinicianLogin();
                } else if ((currentUrl.indexOf('/admin/') != -1)) {
                    loginPath = snap.adminLogin();
                } else if ((currentUrl.indexOf('/snapmdadmin/') != -1)) {
                    loginPath = snap.snapMDAdminLogin();
                } else if ((currentUrl.indexOf('/patient/') != -1)) {
                    loginPath = snap.patientLogin();
                }
                sessionLimiterHub.client.forceLogout = function(ip) {
                    if (snap.EventAggregator) {
                        snap.EventAggregator().publish("forceLogout");
                    }
                    snap.profileSession.isLogouted = true;
                    snap.clearAllSnapSessions();

                    navigator.notification.alert(
                        snap.sessAlertMessage, //'You have logged in on another device and ended this session.', // message
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

               };

               /* sessionLimiterHub.client.warnLogout = function(ip) {
                    snap.profileSession.isLogouted = true;
                    var redirectingTimeInSeconds = 5;
                    global.snapInfo("You might have logged in on another device.");
                    window.console.log("You might have logged in on another device. IP: " + ip);
                    setTimeout(function() {
                      //  window.location.href = loginPath;
                    }, redirectingTimeInSeconds * 1000);
                };
*/
                /*when a user got deactivated by admin*/
                sessionLimiterHub.client.deactivated = function() {
                    snap.userSession.token = '';
                    /*logged out mesg*/
                    var redirectingTimeInSeconds = 5;
                    var msg = "";
                    msg += "<b>Your account has been deactivated.</b> <br\>";
                    msg += "Please contact customer support regarding your account. <br\>";
                    msg += "<b>You will be logged out in " + redirectingTimeInSeconds + " seconds.</b>";
                    global.snapAnnouncement(msg);
                    setTimeout(function() {
                        //window.location.href = loginPath;
                    }, redirectingTimeInSeconds * 1000);
                };

                sessionLimiterHub.client.sessionRegistered = function() {
                    window.console.log("sessionLimiterHub: Session limiter registered");
                };
            };

        }).singleton();
})(window, jQuery, snap);

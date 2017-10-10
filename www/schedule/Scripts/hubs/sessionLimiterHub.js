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
                  /*  $("body").prepend("<div class=\"overlay\"></div>");

                    $(".overlay").css({
                        "position": "absolute",
                        "width": $(document).width(),
                        "height": $(document).height(),
                        "background-color": "grey",
                        "z-index": 10005, //We need such a big index in order to overlay kendo dialogWindow, it usually has 10003 index.
                    }).fadeTo(0, 0.6);

                    global.showSnapAlert("You have logged in on another device.", "confirmation");
                    window.console.log("You have logged in on another device. IP: " + ip);
                    $('#btnAlertOk').click(function() {
                        window.location.href = loginPath;
                    });*/
                    navigator.notification.alert(
                        'You have logged in on another device.', // message
                        function() {
                            $overlay.toggleOverlay();
                             window.location.href = snap.redirctPage;
                            // $timeout(function() {
                                   window.location.reload(true);
                              // });
                            //return;
                        },
                        snap.appName, // title
                        'Done' // buttonName
                    );
                    return false;

                };

                sessionLimiterHub.client.warnLogout = function(ip) {
                    snap.profileSession.isLogouted = true;
                    var redirectingTimeInSeconds = 5;
                    global.snapInfo("You might have logged in on another device.");
                    window.console.log("You might have logged in on another device. IP: " + ip);
                    setTimeout(function() {
                      //  window.location.href = loginPath;
                    }, redirectingTimeInSeconds * 1000);
                };

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

;
(function(global, $) {
    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("sessionLimiterHub", function($hubModel) {
            var sessionLimiterHub = $.connection.sessionLimiterHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(sessionLimiterHub, this);

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            var initEvent = function() {
                var loginPath;
                var currentUrl = window.location.href.toLowerCase();

                if ((currentUrl.indexOf('physician/') != -1)) {
                    loginPath = snap.clinicianLogin();
                } else if ((currentUrl.indexOf('/admin/') != -1)) {
                    loginPath = '/Admin/Login';
                } else if ((currentUrl.indexOf('/snapmdadmin/') != -1)) {
                    loginPath = '/snapmdadmin/Login';
                } else if ((currentUrl.indexOf('/customer/') != -1)) {
                    loginPath = snap.patientLogin();
                }
                sessionLimiterHub.client.forceLogout = function(ip) {
                    if (snap.EventAggregator) {
                        snap.EventAggregator().publish("forceLogout");
                    }
                    snap.profileSession.isLogouted = true;
                    snap.clearAllSnapSessions();
                    $("body").prepend("<div class=\"overlay\"></div>");

                    $(".overlay").css({
                        "position": "absolute",
                        "width": $(document).width(),
                        "height": $(document).height(),
                        "background-color": "grey",
                        "z-index": 10005, //We need such a big index in order to overlay kendo dialogWindow, it usually has 10003 index.
                    }).fadeTo(0, 0.6);

                    showSnapAlert("You have logged in on another device.", "confirmation");
                    console.log("You have logged in on another device. IP: " + ip);
                    $('#btnAlertOk').click(function() {
                        window.location.href = loginPath;
                    });
                };

                sessionLimiterHub.client.warnLogout = function(ip) {
                    snap.profileSession.isLogouted = true;
                    var redirectingTimeInSeconds = 5;
                    snapInfo("You might have logged in on another device.");
                    console.log("You might have logged in on another device. IP: " + ip);
                    setTimeout(function() {
                        window.location.href = loginPath;
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
                    snapAnnouncement(msg);
                    setTimeout(function() {
                        window.location.href = loginPath;
                    }, redirectingTimeInSeconds * 1000);
                };

                sessionLimiterHub.client.sessionRegistered = function() {
                    window.console.log("sessionLimiterHub: Session limiter registered");
                };
            };

            this.init = function() {
                initConnection();
                
                if (isInitialized) {
                    window.console.log("sessionLimiterHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("sessionLimiterHub started");
                });

                initEvent();
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

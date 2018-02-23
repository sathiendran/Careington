// snap.session.js
// Provides session timeout monitoring for application end-users.
// Dependencies: jQuery, SignalR, server-generated SignalR module ("~/signalr/hubs")
// Append version querystring as ?v=1.7.1.0

(function(global, $) {
    var snap = global.snap = global.snap || {};

    var timeout = null;
    snap.idleTime = 0;
    var getLoginPath = function () {
        var currentUrl = window.location.href.toLowerCase();
      //   location.href = snap.redirctPage;
      if ((currentUrl.indexOf('/public') != -1)) {
            return currentUrl;
        }
        else if ((currentUrl.indexOf('physician/') != -1)) {
          //  return snap.clinicianLogin();
            return snap.redirctPage;
        } else if ((currentUrl.indexOf('/admin/') != -1)) {
            //return '/Admin/Login';
              return snap.redirctPage;
        } else if ((currentUrl.indexOf('/snapmdadmin/') != -1)) {
            //return '/snapmdadmin/Login';
              return snap.redirctPage;
        } else if ((currentUrl.indexOf('/customer/') != -1)) {
            //return snap.patientLogin();
              return snap.redirctPage;
        } else {
          //  return snap.redirctPage;
        }

    };
    $.extend(snap, {
		idleInterval: null,
        timeoutNotification: function (isIdleTimeout) {
            function centerize(e) {
                if (!$("." + e.sender._guid)[1]) {
                    var element = e.element.parent(),
                        eWidth = element.width(),
                        eHeight = element.height(),
                        wWidth = $(window).width(),
                        wHeight = $(window).height();

                    var newLeft = Math.floor(wWidth / 2 - eWidth / 2);
                    var newTop = Math.floor(wHeight / 2.5 - eHeight / 2);

                    e.element.parent().css({ top: newTop, left: newLeft, zIndex: 20004 });
                }
            };

            var notification = $("#sessionTimeout").kendoNotification({
                hideOnClick: false,
                autoHideAfter: 0,
                width: 400,
                show: centerize,
                templates: [{
                    type: "sessionTimeout",
                    template: $("#timeoutTemplate").html()
                }]
            }).data("kendoNotification");

            if (!notification) {
                notification = $("#sessionTimeout").kendoNotification({
                    hideOnClick: false,
                    autoHideAfter: 0,
                    width: 400,
                    show: centerize,
                    templates: [{
                        type: "sessionTimeout",
                        template: $("#timeoutTemplate").html()
                    }]
                }).data("kendoNotification");
            }

            if (notification) {
                 navigator.notification.alert(
                  // 'Your session timed out.', // message
                  snap.SessTimedOutMsg,
                   function() {
                        window.location.href = snap.redirctPage;
                      //  window.location.reload(true);
                   },
                   snap.appName, // title
                   snap.SessTimedOk //'Done' // buttonName
               );
               return false;
               /* notification.show({
                    title: "Logout warning",
                    message: "Your session is about to expire. Please " + (isIdleTimeout ? "click continue button" : "refresh the page to continue") +
                        " or you will be automatically redirected to the login page."
                }, "sessionTimeout");

                $("#btn-sessionRenew").on("click", function () {
                    // Stop timer in case we choose a different method to refresh.
                    clearTimeout(timeout);
                    notification.hide();
                });

                $("#btn-sessionLogout").on("click", function () {
                    clearTimeout(timeout);
                  //  window.location.href = snap.redirctPage;
                  //  window.location.reload(true);
             });*/
            }
        },

        redirectTimeout: function () {
            timeout = setTimeout(function () {
                // window.location.href = snap.redirctPage;
              //  window.location.reload(true);
            }, 110000);
        },
        redirectToLogin: function () {
            // window.location.href = snap.redirctPage;
            // window.location.reload(true);
        },

        cancelTimeout: function () {
            snap.timeoutNotification = function () {
                window.console.log("Timeout notification received but ignored.");
                return false;
            }
        },
        clearPage: function() {
            snap.ConsultationPage = snap.isWaitingRoom = snap.loginPage = snap.isActiveWebRTC = false;
        }
    });
    var initIdleInterval = function() {
        var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
        //Zero the idle timer on mouse movement.
        $(this).mousemove(function() {
            snap.idleTime = 0;
        });
        $(this).keypress(function() {
            snap.idleTime = 0;
        });
        function timerIncrement() {
            snap.idleTime++;
            if (snap.idleTime > 29) { // 30 minutes
                if (!(snap.ConsultationPage || snap.isWaitingRoom || snap.publicPage || snap.loginPage || snap.isActiveWebRTC)) {
                    snap.redirectTimeout();
                    snap.timeoutNotification(true);
                    sessionStorage.setItem("snap_logoutError", "Due to inactivity");
                }
                snap.idleTime = 0;
            }
        };
    };

    var initSnapUserSession = function() {
        if (!snap.userSession) {
            var storedData = sessionStorage.getItem("snap_user_session");
            if (storedData) {
                snap.userSession = JSON.parse(storedData);
            }
            if (!snap.userSession) {
                //window.console.log("New user session");
            }
        }
    };
     initSnapUserSession();
    $(function() {
        initIdleInterval();
        var $mainHub = snap.resolveObject("snap.hub.mainHub");
        $mainHub.register(snap.resolveObject("snap.hub.sessionLimiterHub"));
        $mainHub.register(snap.resolveObject("snap.hub.notificationService"));
    });

})(window, jQuery);

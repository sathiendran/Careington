// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


var deploymentEnv = 'Production'; //Production //Multiple //Multiple //Single //Demo
var deploymentEnvLogout = 'Production'; // same as above var deploymentEnvForProduction = 'Production';
var appStoreTestUserEmail = ''; // Need to update your QA test account & same id need to add in WaitingRoomController, ConferenceController & IntakeController
var appStoreTestUserEmail2 = ''; // Need to update your QA test account & same id need to add in WaitingRoomController, ConferenceController & IntakeController
var deploymentEnvForProduction = ''; //'Production'; // Set 'Production' Only for Single Production - For Apple testing purpose
var loginPageEnv = 'Production'; //Multiple //Production // Single
var appVersion = 8.1; // PUT your current app version
var serviceAPIError = '' // IF  API returns 500 - Page redirect to web page - PUT your 500 WEb error page link here;

var timeoutValue = 0;
var videoCallSessionDuration = 8000;
var videoCallStartTime = new Date();
if (deploymentEnv == 'Single') {
    appStoreTestUserEmail = '';
    deploymentEnvForProduction = 'Staging'; //'Production', 'Staging', 'QA', 'Sandbox'; // Set 'Production' Only for Single Production - For Apple testing purpose

    var singleStagingHospitalId;
    var singleHospitalId;
    var brandColor;
    var logo;
    var Hospital;
    var HospitalTag;



    var cobrandApp = ' '; // add your Hospital Name
    switch (cobrandApp) {
        case " ": // add your Hospital Name
            singleStagingHospitalId = 0; // If you want stage build, you need to set Stage Hospital ID here
            singleHospitalId = 0; // If you want Production build, you need to set Production Hospital ID here
            singleQAHospitalId = ''; // If you want QA build, you need to set QA Hospital ID here
            singleSandboxHospitalId = ''; // If you want Sandbox build, you need to set sandbox Hospital ID here
            brandColor = ''; // add your Brand Color
            logo = ''; // add your Hospital Name
            Hospital = ' '; // you need to set Hospital Brand name Here
            HospitalTag = ' '; // you need to set Hospital tag name Here
            ssoURL = "";
            break;
    }

}



var handleOpenURL = function (url) {
    setTimeout(function () {
        window.localStorage.setItem("external_load", null);
        window.localStorage.setItem("external_load", url);

    }, 0);
}


angular.module('starter', ['ionic', 'ngTouch', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform, $state, $rootScope, LoginService, $ionicPopup, $window, Idle, $ionicBackdrop, $interval) {

        $ionicPlatform.ready(function () {
         

            function resetSessionLogoutTimer() {
                window.localStorage.setItem('Active', timeoutValue);
                timeoutValue = 0;
                clearSessionLogoutTimer();
                appIdleInterval = $interval(function () {
                    if (window.localStorage.getItem("isCustomerInWaitingRoom") != 'Yes' && window.localStorage.getItem('isVideoCallProgress') != 'Yes') {
                        timeoutValue++;
                        window.localStorage.setItem('InActiveSince', timeoutValue);
                        if (timeoutValue === 30)
                            goInactive();
                    } else {
                        timeoutValue = 0;
                        window.localStorage.setItem('InActiveSince', timeoutValue);
                    }
                }, 60000);
            }

            function clearSessionLogoutTimer() {
                if (typeof appIdleInterval != "undefined") {
                    $interval.cancel(appIdleInterval);
                    appIdleInterval = undefined;
                    appIdleInterval = 0;
                    timeoutValue = 0;
                    window.localStorage.setItem('InActiveSince', timeoutValue);
                }
            }

            $('body').bind('touchstart', function () {
                resetSessionLogoutTimer();
            });

            var timeoutID;
            function setup() {
                this.addEventListener("mousemove", resetTimer, false);
                this.addEventListener("mousedown", resetTimer, false);
                this.addEventListener("keypress", resetTimer, false);
                this.addEventListener("DOMMouseScroll", resetTimer, false);
                this.addEventListener("mousewheel", resetTimer, false);
                this.addEventListener("touchmove", resetTimer, false);
                this.addEventListener("MSPointerMove", resetTimer, false);
                this.addEventListener("touchstart", resetTimer, false);
                this.addEventListener("touchend", resetTimer, false);
                startTimer();
            }

            function startTimer() {
                timeoutID = window.setTimeout(goInactive, 1800000);
            }

            function resetTimer(e) {
                window.clearTimeout(timeoutID);
                goActive();
            }

           


            function goInactive() {
                if ($state.$current.name !== "tab.waitingRoom" && $state.$current.name !== "tab.videoConference" && $state.$current.name !== "tab.videoLost") {
                    var inactiveDuration = window.localStorage.getItem('InActiveSince');
                    var isCustomerInWaitingRoomVal = window.localStorage.getItem("isCustomerInWaitingRoom");
                    var isVideoCallProgressVal = window.localStorage.getItem('isVideoCallProgress')
                    inactiveDuration = Number(inactiveDuration);
                    if (inactiveDuration === 30) {
                        if (window.localStorage.getItem("tokenExpireTime") != null && window.localStorage.getItem("tokenExpireTime") != "") {
                            if (isCustomerInWaitingRoomVal != 'Yes' && isVideoCallProgressVal != 'Yes') {
                                $(".ion-google-place-container").css({
                                    "display": "none"
                                });
                                $ionicBackdrop.release();
                                window.localStorage.setItem('Inactive Success', timeoutValue);
                                timeoutValue = 0;
                                clearSessionLogoutTimer();

                                var localizeCurrent = $('#localize-current').text();
                                console.log("lang " + localizeCurrent);
                                if (localizeCurrent == "Español") {
                                    var SessTimedOutMsg = 'Su sesión ha excedido el tiempo de espera.';
                                    var SessTimedOk = 'De acuerdo';
                                } else {
                                    var SessTimedOutMsg = 'Your session timed out.';
                                    var SessTimedOk = 'Ok';
                                }
                                if ($rootScope.currState.$current.name == "tab.addnewdependent") {
                                    if ($rootScope.flagdeptmodal == true) {
                                        navigator.notification.alert(

                                            $rootScope.alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    } else {
                                        $rootScope.removemodal();
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    }
                                } else if ($rootScope.currState.$current.name == "tab.healthinfo") {
                                    if ($rootScope.flagmodal == true) {
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title
                                            alertokay // buttonName
                                        );

                                        return false;
                                    } else {
                                        $rootScope.editremovemodal();
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    }
                                }
                                else {
                                    navigator.notification.alert(

                                        alertTimedout, // message
                                        function () {
                                            $rootScope.ClearRootScope();
                                            return;
                                        },
                                        $rootScope.alertMsgName // title

                                    );
                                    return false;
                                }

                            }
                        }
                    }
                }
            }
            function goActive() {
                console.log('Active');
                startTimer();
            }


            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.localStorage.getItem("app_load") == "yes") {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 500);
            } else {
              
                window.localStorage.setItem("app_load", "yes");
               
            }
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            var initialScreenSize = window.innerHeight;
            window.addEventListener("resize", function () {
                if (window.innerHeight < initialScreenSize) {
                    $(".has-footer").css({
                        "bottom": 0
                    });
                    $(".footer").hide();
                } else {
                    $(".footer").show();
                }
            });
            


            setTimeout(function () {
                document.addEventListener("offline", onOffline, false);
                document.addEventListener("online", onOnline, false);
            }, 100);
            $rootScope.flagpopup = true;
            var myPopup;
            function onOffline() {
                $rootScope.online = navigator.onLine;
                if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
                    $rootScope.connAlertStatus = true;
                    $('#thumbVideos').remove();
                    $('#videoControls').remove();
                    session.unpublish(publisher)
                    session.disconnect();
                    $('#publisher').hide();
                    $('#subscriber').hide();
                    OT.updateViews();
                    $state.go('tab.videoLost', { retry: 1 });
                } else {
                    $rootScope.connAlertStatus = true;
                    $('.popup').addClass("ietpopup");
                    $('.popup-title').addClass("iettitle");
                    $('.popup-buttons').addClass("ietpopup-buttons");
                    $('.dialogbox--person-location').css("visibility", "hidden");
                    $('.dialogbox-master').css("visibility", "hidden");
                    $('#scd-bdy').css("visibility", "hidden");
                    $rootScope.alertPopupA = function () {
                        $rootScope.flagpopup = false;
                        var myPopup = $ionicPopup.show({

                            template: '<b class="localizejs">Please make sure that you have network connection.</b>',
                            title: '<span class="localizejs">No Internet Connection</span>',
                            rootScope: $rootScope,
                            cssClass: 'my-custom-popup',
                            buttons: [{
                                text: '<b class="ietfonttype localizejs">ok</b>',
                                type: 'button',
                            }]
                        });

                        myPopup.then(function (res) {
                            if (res) {
                                console.log('res', res);
                            } else {
                                console.log('else');
                            }
                        });
                        $rootScope.closepopup = function () {
                            myPopup.close();
                            $('.dialogbox--person-location').css("visibility", "visible");
                            $('.dialogbox-master').css("visibility", "visible");
                            $('#scd-bdy').css("visibility", "visible");
                            $rootScope.flagpopup = true;
                        }
                    }
                    if ($rootScope.flagpopup === true) {
                        $rootScope.alertPopupA();
                    }

                }
                return false;
            }

            function onOnline() {
                console.log('Closing in controller!');

                $rootScope.connAlertStatus = false;
                $rootScope.online = navigator.onLine;
                if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
                    $state.go('tab.videoLost', { retry: 2 });
                } else {
                    if ($state.$current.name == "tab.waitingRoom")
                        $rootScope.waitingroomlostconnection();
                    //  if($rootScope.flagpopup==false){
                    $rootScope.closepopup();
                    //}
                }
            }

            // cordova.plugins.backgroundMode.setDefaults({
            //     text: $rootScope.alertMsgName
            // });
            // cordova.plugins.backgroundMode.enable();


            // cordova.plugins.backgroundMode.onactivate = function () {
            //     var backGroundNetConnection;
            //     backGroundNetConnection = setInterval(function () {
            //         //  $rootScope.flagpopup=true;
            //         var myPopup;
            //         $rootScope.online = navigator.onLine;

            //         $window.addEventListener("offline", function () {
            //             $rootScope.$apply(function () {
            //                 if ($rootScope.connAlertStatus !== true) {
            //                     $rootScope.online = navigator.onLine;
            //                     if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
            //                         console.log('gggg5');
            //                         $('#thumbVideos').remove();
            //                         $('#videoControls').remove();
            //                         session.unpublish(publisher)
            //                         session.disconnect();
            //                         $('#publisher').hide();
            //                         $('#subscriber').hide();
            //                         OT.updateViews();
            //                     } else {
            //                         $('.popup').addClass("ietpopup");
            //                         $('.popup-title').addClass("iettitle");
            //                         $('.popup-buttons').addClass("ietpopup-buttons");
            //                         $('.dialogbox--person-location').css("visibility", "hidden");
            //                         $('.dialogbox-master').css("visibility", "hidden");
            //                         $('#scd-bdy').css("visibility", "hidden");
            //                         $rootScope.alertPopupA = function () {
            //                             $rootScope.flagpopup = false;
            //                             var myPopup = $ionicPopup.show({
            //                                 template: '<b class="localizejs">Please make sure that you have network connection.</b>',
            //                                 title: '<span class="localizejs">No Internet Connection</span>',
            //                                 rootScope: $rootScope,
            //                                 cssClass: 'my-custom-popup',
            //                                 buttons: [{
            //                                     text: '<b class="ietfonttype localizejs">ok</b>',
            //                                     onTap: function (e) {
            //                                         return false;
            //                                     }
            //                                 }]
            //                             });

            //                             myPopup.then(function (res) {
            //                                 if (res) {
            //                                     console.log('res', res);
            //                                 } else {
            //                                     console.log('else');
            //                                 }
            //                             });
            //                             $rootScope.closepopup = function () {
            //                                 myPopup.close();
            //                                 $('.dialogbox--person-location').css("visibility", "visible");
            //                                 $('.dialogbox-master').css("visibility", "visible");
            //                                 $('#scd-bdy').css("visibility", "visible");
            //                                 $rootScope.flagpopup = true;
            //                             }
            //                         }
            //                         if ($rootScope.flagpopup === true) {
            //                             $rootScope.alertPopupA();
            //                         }

            //                     }
            //                 }
            //                 return false;
            //             });
            //         }, false);

            //         $window.addEventListener("online", function () {
            //             $rootScope.$apply(function () {
            //                 console.log('Closing in controller!');
            //                 $rootScope.online = navigator.onLine;
            //                 if ($rootScope.connAlertStatus !== false) {
            //                     if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
            //                         $rootScope.netConnectionStaus = true;
            //                     } else {
            //                         //if($rootScope.flagpopup==false){
            //                         $rootScope.closepopup();
            //                         //}
            //                     }
            //                 }
            //             });
            //         }, false);
            //     }, 30000);
            // }

            setTimeout(function () {
                //  Idle.watch();
                if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "" && window.localStorage.getItem("external_load") != "null") {
                    if (window.localStorage.getItem("external_load").indexOf('jwt') >= 0) {
                        var extQuery = window.localStorage.getItem("external_load").split('?');
                        var extQueryOnly = extQuery[2];
                        var query = extQueryOnly.split("&");
                        var jwtTokenString = query[0].split("=");
                        window.localStorage.setItem("external_load", null);
                        if (jwtTokenString[1] != "" && jwtTokenString[1] != "undefined") {
                            $state.go('tab.ssoJWTPage', {
                                jwtToken: jwtTokenString[1]
                            });
                        } else if (loginPageEnv === 'Single') {
                            $state.go('tab.loginSingle');
                        } else if (loginPageEnv === 'Multiple') {
                            $state.go('tab.chooseEnvironment');
                        } else if (loginPageEnv === 'Production') {
                            $state.go('tab.login');
                        }
                    } else {
                        var EXTRA = {};
                        var extQuery = window.localStorage.getItem("external_load").split('?')
                        var extQueryOnly = extQuery[1];

                        var query = extQueryOnly.split("&");

                        for (var i = 0, max = query.length; i < max; i++) {
                            if (query[i] === "") // check for trailing & with no param
                                continue;

                            var param = query[i].split("=");
                            EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                        }
                        window.localStorage.setItem("external_load", null);
                        if (deploymentEnv != 'Single') {
                            if (EXTRA['env'] != "") {
                                var dEnv = EXTRA['env'];
                                if (dEnv.toUpperCase() == "SANDBOX") {
                                    deploymentEnv = "Sandbox";
                                    apiCommonURL = 'https://sandbox.connectedcare.md';
                                } else if (dEnv.toUpperCase() == "QA") {
                                    deploymentEnv = "QA";
                                    apiCommonURL = 'https://emerald.qa1.snapvcm.com';
                                } else if (dEnv.toUpperCase() == "PRODUCTION") {
                                    deploymentEnv = "Production";
                                    apiCommonURL = 'https://connectedcare.md';
                                } else if (dEnv.toUpperCase() == "STAGE") {
                                    deploymentEnv = "Staging";
                                    apiCommonURL = 'https://emerald.stage.snapvcm.com';
                                } else if (dEnv.toUpperCase() == "DEMO") {
                                    deploymentEnv = "Demo";
                                    apiCommonURL = 'https://demo.connectedcare.md';
                                }
                            }
                        }
                        if (EXTRA['token'] != "" && EXTRA['env'] != "" && EXTRA['token'] != "undefined" && EXTRA['env'] != "undefined") {
                            $state.go('tab.interimpage', {
                                token: EXTRA['token'],
                                hospitalId: EXTRA['hospitalId'],
                                consultationId: EXTRA['consultationId']
                            });
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Multiple') {
                            $state.go('tab.chooseEnvironment');
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Single') {
                            $state.go('tab.loginSingle');
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Production') {
                            $state.go('tab.login');
                        }
                    }
                }
            }, 2000);
            $ionicPlatform.on('resume', function () {
                if (typeof alive_waiting_room_pool != "undefined")
                    clearInterval(alive_waiting_room_pool);
                alive_waiting_room_pool = undefined;
                setTimeout(function () {
                    if ($rootScope.netConnectionStaus === true) {
                        $state.go('tab.videoLost', { retry: 2 });
                        //$state.go('tab.login');
                    }
                    //  Idle.watch();
                    if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "" && window.localStorage.getItem("external_load") != "null") {
                        if (window.localStorage.getItem("external_load").indexOf('jwt') >= 0) {
                            var extQuery = window.localStorage.getItem("external_load").split('?');
                            var extQueryOnly = extQuery[2];
                            var query = extQueryOnly.split("&");
                            var jwtTokenString = query[0].split("=");
                            window.localStorage.setItem("external_load", null);
                            if (jwtTokenString[1] != "" && jwtTokenString[1] != "undefined") {
                                $state.go('tab.ssoJWTPage', {
                                    jwtToken: jwtTokenString[1]
                                });
                            } else if (loginPageEnv === 'Single') {
                                $state.go('tab.loginSingle');
                            } else if (loginPageEnv === 'Multiple') {
                                $state.go('tab.chooseEnvironment');
                            } else if (loginPageEnv === 'Production') {
                                $state.go('tab.login');
                            }
                        } else {
                            var EXTRA = {};
                            var extQuery = window.localStorage.getItem("external_load").split('?')
                            var extQueryOnly = extQuery[1];

                            var query = extQueryOnly.split("&");

                            for (var i = 0, max = query.length; i < max; i++) {
                                if (query[i] === "") // check for trailing & with no param
                                    continue;

                                var param = query[i].split("=");
                                EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                            }
                            window.localStorage.setItem("external_load", null);
                            if (deploymentEnv != 'Single') {
                                if (EXTRA['env'] != "") {
                                    var dEnv = EXTRA['env'];
                                    if (dEnv.toUpperCase() == "SANDBOX") {
                                        deploymentEnv = "Sandbox";
                                        apiCommonURL = 'https://sandbox.connectedcare.md';
                                    } else if (dEnv.toUpperCase() == "QA") {
                                        deploymentEnv = "QA";
                                        apiCommonURL = 'https://emerald.qa1.com';
                                    } else if (dEnv.toUpperCase() == "PRODUCTION") {
                                        deploymentEnv = "Production";
                                        apiCommonURL = 'https://connectedcare.md';
                                    } else if (dEnv.toUpperCase() == "STAGE") {
                                        deploymentEnv = "Staging";
                                        apiCommonURL = 'https://emerald.stage.snapvcm.com';
                                    } else if (dEnv.toUpperCase() == "DEMO") {
                                        deploymentEnv = "Demo";
                                        apiCommonURL = 'https://demo.connectedcare.md';
                                    }
                                }
                            }
                            if (EXTRA['token'] != "" && EXTRA['env'] != "" && EXTRA['token'] != "undefined" && EXTRA['env'] != "undefined") {
                                $state.go('tab.interimpage', {
                                    token: EXTRA['token'],
                                    hospitalId: EXTRA['hospitalId'],
                                    consultationId: EXTRA['consultationId']
                                });
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Multiple') {
                                $state.go('tab.chooseEnvironment');
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Single') {
                                $state.go('tab.loginSingle');
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Production') {
                                $state.go('tab.login');
                            }
                        }
                    }
                }, 2000);
            });
        });

    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, IdleProvider, KeepaliveProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content):/);
        //IdleProvider.idle(600); // in seconds
        //  IdleProvider.timeout(600); // in seconds
        //  KeepaliveProvider.interval(60); // in seconds
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.serviceUnavailableError', {
                url: '/serviceUnavailableError/:lastFunctionCall/:serviceUnavailableError',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-serviceUnavailableError.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.loginSingle', {
                url: '/loginSingle',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-loginSingle.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.provider', {
                url: '/provider',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-provider.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.terms', {
                url: '/terms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-terms.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.password', {
                url: '/password',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-password.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.resetPassword', {
                url: '/resetPassword',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-resetPassword.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.userhome', {
                url: '/userhome',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userhome.html',
                        controller: 'LoginCtrl'
                    }
                }
            }).state('tab.CurrentLocationlist', {
                url: '/CurrentLocationlist',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-CurrentLocationlist.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.patientDetail', {
                url: '/patientDetail',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientDetail.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.patientCalendar', {
                url: '/patientCalendar',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientCalendar.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            /*.state('tab.updationpopup', {
                url: '/patientCalendar',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-updationpopup.html',
                        controller: 'LoginCtrl'
                    }
                }
            })*/
            .state('tab.appoimentDetails', {
                url: '/appoimentDetails/:getPage',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appoimentDetails.html',
                        controller: 'appoimentDetailsCtrl'
                    }
                }
            })
            .state('tab.patientConcerns', {
                url: '/patientConcerns',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientConcerns.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.appointmentDialog', {
                url: '/appointmentDialog',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-appointmentDialog.html',
                        controller: ''
                    }
                }
            })
            .state('tab.confirmPatientAddressDialog', {
                url: '/confirmPatientAddressDialog',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-confirmPatientAddressDialog.html',
                        controller: ''
                    }
                }
            })
            .state('tab.providerSearch', {
                url: '/providerSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-providerSearch.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })

            .state('tab.providerBody', {
                url: '/providerSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-providerBody.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })

            .state('tab.overlay', {
                url: '/overlay',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-overlay.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })
            .state('tab.ChronicCondition', {
                url: '/ChronicCondition',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ChronicCondition.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.priorSurgeries', {
                url: '/priorSurgeries',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-priorSurgeries.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.CurrentMedication', {
                url: '/CurrentMedication',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-CurrentMedication.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.intakeBornHistory', {
                url: '/intakeBornHistory',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-intakeBornHistory.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.MedicationAllegies', {
                url: '/MedicationAllegies',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-MedicationAllegies.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.ConsentTreat', {
                url: '/ConsentTreat/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ConsentTreat.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultCharge', {
                url: '/consultCharge/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultCharge.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.addHealthPlan', {
                url: '/addHealthPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addHealthPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.planDetails', {
                url: '/planDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-planDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.planeditDetails', {
                url: '/planeditDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-planeditDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.applyPlan', {
                url: '/applyPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-applyPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.addCard', {
                url: '/addCard',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addCard.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultChargeNoPlan', {
                url: '/consultChargeNoPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultChargeNoPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.cardDetails', {
                url: '/cardDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-cardDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.cardeditDetails', {
                url: '/cardeditDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-cardeditDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.submitPayment', {
                url: '/submitPayment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-submitPayment.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.receipt', {
                //url: '/receipt',
                url: '/receipt/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-receipt.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.waitingRoom', {
                url: '/waitingRoom',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-waitingRoom.html',
                        controller: 'waitingRoomCtrl'
                    }
                }
            })
            .state('tab.videoConference', {
                url: '/videoConference',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-videoConference.html',
                        controller: 'ConferenceCtrl'
                    }
                }
            })
            .state('tab.connectionLost', {
                url: '/connectionLost',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-connectionLost.html',
                        controller: 'connectionLostCtrl'
                    }
                }
            })
            .state('tab.ReportScreen', {
                url: '/ReportScreen',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ReportScreen.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.interimpage', {
                url: '/interimpage/:token/:hospitalId/:consultationId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-interimpage.html',
                        controller: 'InterimController'
                    }
                }
            })
            .state('tab.ssoJWTPage', {
                url: '/ssoJWTPage/:jwtToken',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ssoJWTPage.html',
                        controller: 'SSOJWTParsingController'
                    }
                }
            })
            .state('tab.chooseEnvironment', {
                url: '/chooseEnvironment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-chooseEnvironment.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('tab.singleTerms', {
                url: '/singleTerms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-singleTerms.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.singleTheme', {
                url: '/singleTheme',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-singleTheme.html',
                        controller: 'singleHospitalThemeCtrl'
                    }
                }
            })
            .state('tab.searchprovider', {
                url: '/searchprovider',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-searchprovider.html',
                        controller: 'searchProviderController'
                    }
                }
            })
            .state('tab.registerStep1', {
                url: '/registerStep1',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerStep1.html',
                        controller: 'registerStep1Controller'
                    }
                }
            })
            .state('tab.registerAddress', {
                url: '/registerAddress',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerAddress.html',
                        controller: 'registerStep1Controller'
                    }
                }
            })
            .state('tab.userAccount', {
                url: '/userAccount',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userAccount.html',
                        controller: 'userAccountCtrl'
                    }
                }
            })
            .state('tab.healthinfo', {
                url: '/healthinfo/:getid',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-healthinfo.html',
                        controller: 'healthinfoController'
                    }
                }
            })
            .state('tab.userAppointment', {
                url: '/userAppointment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userAppointment.html',
                        controller: ''
                    }
                }
            })
            .state('tab.addUser', {
                url: '/addUser',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addUser.html',
                        controller: 'newuserController'
                    }
                }
            })
            .state('tab.registerStep2', {
                url: '/registerStep2',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerStep2.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.registerSuccess', {
                url: '/registerSuccess',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerSuccess.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.registerTerms', {
                url: '/registerTerms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerTerms.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.relatedusers', {
                url: '/relatedusers',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-relatedusers.html',
                        controller: 'relateduserController'
                    }
                }
            })
            .state('tab.appointmentpatientdetails', {
                //  url: '/videoLost/:retry',
                url: '/appointmentpatientdetails/:getPage',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appointmentpatientdetails.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            .state('tab.profileoption', {
                url: '/profileoption',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-profileoption.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultations', {
                url: '/consultations',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultations.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.reports', {
                url: '/reports',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-reports.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.missedConsultAppoint', {
                url: '/missedConsultAppoint',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-missedConsultAppoint.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.addnewuser', {
                url: '/addnewuser',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addnewuser.html',
                        controller: 'addnewuserController'
                    }
                }
            })
            .state('tab.addnewdependent', {
                url: '/addnewdependent',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addnewdependent.html',
                        controller: 'addnewdependentController'
                    }
                }
            })
            .state('tab.consultationSearch', {
                url: '/consultationSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultationSearch.html',
                        controller: 'consultationController'

                    }
                }
            })
            .state('tab.currentmedicationsearch', {
                url: '/currentmedicationsearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-currentmedicationsearch.html',
                        controller: 'healthinfocontroller'
                    }
                }
            })
            .state('tab.addpatientid', {
                url: '/addpatientid',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addpatientid.html',
                        controller: 'healthinfocontroller'
                    }
                }
            })

            .state('tab.appointmentpatientdetailssearch', {
                url: '/appointmentpatientdetailssearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appointmentdetailssearch.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            .state('primaryPatientSideMenu', {
                url: '/',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/primaryPatientSideMenu.html',
                        controller: 'sidemenuController'
                    }
                }
            })
            .state('tab.videoLost', {
                url: '/videoLost/:retry',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-videoLost.html',
                        controller: 'videoLostCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback tab-chooseEnvironment

        if (deploymentEnv == "Multiple") {
            $urlRouterProvider.otherwise('/tab/chooseEnvironment');
        } else if (deploymentEnv == "Single") {
            $urlRouterProvider.otherwise('/tab/singleTheme');
           
        } else {
            $urlRouterProvider.otherwise('/tab/login');
        }

    });

function generateTextImage(text, bgcolor) {
    if (!bgcolor) {
        bgcolor = 'f54f2b';
    }
    bgcolor = bgcolor.replace('#', '');
    return "https://placeholdit.imgix.net/~text?txtsize=120&txtclr=ffffff&w=200&h=200&bg=" + bgcolor + "&txt=" + text;
}

function getInitialForName(name) {
    var initial = "";
    if (name) {
        name = name.toUpperCase();
        name = name.replace('  ', ' ');
        name = name.trim()
        var names = name.split(' ');
        initial = initial + names[0].substring(0, 1);
        if (names[1])
            initial = initial + names[1].substring(0, 1);
        else
            initial = name.substring(0, 2);
    }
    return initial;
}
function getInitialFromName(firstName, LastName) {
    var initial = "";
    var name = firstName + ' ' + LastName;
    if (!angular.isUndefined(firstName) && firstName !== '') {
        name = name.toUpperCase();
        name = name.replace('  ', ' ');
        name = name.trim()
        var names = name.split(' ');
        initial = initial + names[0].substring(0, 1);
        if (names[1])
            initial = initial + names[1].substring(0, 1);
        else
            initial = name.substring(0, 2);
    }
    return initial;
}

function getOnlyPhoneNumber(phoneNumber) {
    return phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length);
}

function formatHeightVal(height) {
    var h = height.split('.');
    var hv = h[0] + "|";
    if (h[1])
        hv = hv + h[1];
    else
        hv = hv + "0";
    return hv;
}

function getAge(birth) {
    var today = new Date();
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();
    var birthage = new Date(birth);
    var birthyear = birthage.getFullYear();
    var birthmonth = birthage.getMonth();
    var birthday = birthage.getDate();
    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;
    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        age = parseInt(age) - 1;
    }
    return age;
}
var createSVGIcon = function (iconName) {
    return "<svg class='icon-" + iconName + " svgIcon" + iconName + " svgIconForVideo'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
};

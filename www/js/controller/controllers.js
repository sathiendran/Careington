var indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    }
    // request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
    //request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
var api_keys_env = '';
var session = null;
var publisher = null;

if (deploymentEnv === "Sandbox" || deploymentEnv === "Multiple" || deploymentEnv === "QA") {
    var util = {

        setHeaders: function(request, credentials) {
            if (api_keys_env === 'Staging') {
                if (typeof credentials !== 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = 'cc552a3733af44a88ccb0c88ecec2d78';
                request.defaults.headers.post['X-Api-Key'] = '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38';
                return request;
            } else if (api_keys_env === 'Sandbox') {
                if (typeof credentials !== 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '1e9b9d60bb7f45d8bf41cd35627a60df';
                request.defaults.headers.post['X-Api-Key'] = '21c50e877e0ec912bc014280aee25bcf978de453';
                return request;
            } else {
                if (typeof credentials !== 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '84f6101ff82d494f8fcc5c0e54005895';
                request.defaults.headers.post['X-Api-Key'] = 'c69fe0477e08cb4352e07c502ddd2d146b316112';
                return request;
            }
        },
        getHeaders: function(accessToken) {
            if (api_keys_env === 'Staging') {
                var headers = {
                    'X-Developer-Id': 'cc552a3733af44a88ccb0c88ecec2d78',
                    'X-Api-Key': '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env === 'Sandbox') {
                var headers = {
                    'X-Developer-Id': '1e9b9d60bb7f45d8bf41cd35627a60df',
                    'X-Api-Key': '21c50e877e0ec912bc014280aee25bcf978de453',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }
                return headers;
            } else {

                var headers = {
                    'X-Developer-Id': '84f6101ff82d494f8fcc5c0e54005895',
                    'X-Api-Key': 'c69fe0477e08cb4352e07c502ddd2d146b316112',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }
                return headers;
            }
        }
    }
} else if (deploymentEnv === "Production") {
    var util = {
        setHeaders: function(request, credentials) {
            if (api_keys_env == 'Production') {
                if (typeof credentials != 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '1f9480321986463b822a981066cad094';
                request.defaults.headers.post['X-Api-Key'] = 'd3d2f653608d25c080810794928fcaa12ef372a2';
                return request;
            } else if (api_keys_env == 'Staging') {
                if (typeof credentials != 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = 'cc552a3733af44a88ccb0c88ecec2d78';
                request.defaults.headers.post['X-Api-Key'] = '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38';
                return request;

            }
        },
        getHeaders: function(accessToken) {
            if (api_keys_env == 'Production') {
                var headers = {
                    'X-Developer-Id': '1f9480321986463b822a981066cad094',
                    'X-Api-Key': 'd3d2f653608d25c080810794928fcaa12ef372a2',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken != 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env == 'Staging') {
                var headers = {
                    'X-Developer-Id': 'cc552a3733af44a88ccb0c88ecec2d78',
                    'X-Api-Key': '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken != 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            }
        }
    }
} else if (deploymentEnv === "Single") {
    var util = {
        setHeaders: function(request, credentials) {
            if (api_keys_env === 'Staging') {
                if (typeof credentials !== 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = 'cc552a3733af44a88ccb0c88ecec2d78';
                request.defaults.headers.post['X-Api-Key'] = '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38';
                return request;
            } else if (api_keys_env == 'Production') {
                if (typeof credentials != 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '1f9480321986463b822a981066cad094';
                request.defaults.headers.post['X-Api-Key'] = 'd3d2f653608d25c080810794928fcaa12ef372a2';
                return request;
            } else if (api_keys_env == 'QA') {
                if (typeof credentials != 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
                request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
                return request;
            } else if (api_keys_env == 'Sandbox') {
                if (typeof credentials != 'undefined') {
                    request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
                }
                request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                request.defaults.headers.post['X-Developer-Id'] = '1e9b9d60bb7f45d8bf41cd35627a60df';
                request.defaults.headers.post['X-Api-Key'] = '21c50e877e0ec912bc014280aee25bcf978de453';
                return request;
            }
        },
        getHeaders: function(accessToken) {
            if (api_keys_env === 'Staging') {
                var headers = {
                    'X-Developer-Id': 'cc552a3733af44a88ccb0c88ecec2d78',
                    'X-Api-Key': '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env == 'Production') {
                var headers = {
                    'X-Developer-Id': '1f9480321986463b822a981066cad094',
                    'X-Api-Key': 'd3d2f653608d25c080810794928fcaa12ef372a2',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env == 'QA') {
                var headers = {
                    'X-Developer-Id': '4ce98e9fda3f405eba526d0291a852f0',
                    'X-Api-Key': '1de605089c18aa8318c9f18177facd7d93ceafa5',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken != 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env == 'Sandbox') {
                var headers = {
                    'X-Developer-Id': '1e9b9d60bb7f45d8bf41cd35627a60df',
                    'X-Api-Key': '21c50e877e0ec912bc014280aee25bcf978de453',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken != 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            }
        }
    }

} else if (deploymentEnv == "Demo") {
    var util = {
        setHeaders: function(request, credentials) {
            if (typeof credentials != 'undefined') {
                request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
            }
            request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            request.defaults.headers.post['X-Developer-Id'] = 'f92f6017f3f043809e0f317c1d0cde4c';
            request.defaults.headers.post['X-Api-Key'] = 'ddc9e736777f130b97f7fff5976c5bc9e7f3b337';
            return request;
        },
        getHeaders: function(accessToken) {
            var headers = {
                'X-Developer-Id': 'f92f6017f3f043809e0f317c1d0cde4c',
                'X-Api-Key': 'ddc9e736777f130b97f7fff5976c5bc9e7f3b337',
                'Content-Type': 'application/json; charset=utf-8'
            };
            if (typeof accessToken != 'undefined') {
                headers['Authorization'] = 'Bearer ' + accessToken;
            }

            return headers;
        }
    }
}

var REVIEW_CONSULTATION_EVENT_CODE = 116;
var STARTED_CONSULTATION_EVENT_CODE = 117;
var STOPPED_CONSULTATION_EVENT_CODE = 118;
var ENDED_CONSULTATION_EVENT_CODE = 119;
var WAITING_CONSULTATION_EVENT_CODE = 120;
var JOIN_CONSULTATION_EVENT_CODE = 121;

var CLINICIAN_CONSULTATION_EVENT_TYPE_ID = 22;
var PATIENT_CONSULTATION_EVENT_TYPE_ID = 23;

var REVIEW_CONSULTATION_STATUS_CODE = 69;
var STARTED_CONSULTATION_STATUS_CODE = 70;
var STOPPED_CONSULTATION_STATUS_CODE = 118;
var ENDED_CONSULTATION_STATUS_CODE = 119;
var WAITING_CONSULTATION_STATUS_CODE = 68;
var JOIN_CONSULTATION_STATUS_CODE = 121;



angular.module('ngIOS9UIWebViewPatch', ['ng']).config(function($provide) {
    $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

        if (isIOS9UIWebView($window.navigator.userAgent)) {
            return applyIOS9Shim($delegate);
        }

        return $delegate;

        function isIOS9UIWebView(userAgent) {
            return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
        }

        function applyIOS9Shim(browser) {
            var pendingLocationUrl = null;
            var originalUrlFn = browser.url;

            browser.url = function() {
                if (arguments.length) {
                    pendingLocationUrl = arguments[0];
                    return originalUrlFn.apply(browser, arguments);
                }

                return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
            };

            window.addEventListener('popstate', clearPendingLocationUrl, false);
            window.addEventListener('hashchange', clearPendingLocationUrl, false);

            function clearPendingLocationUrl() {
                pendingLocationUrl = null;
            }

            return browser;
        }
    }]);
});

if (deploymentEnv === "Sandbox") {
    apiCommonURL = 'https://sandbox.connectedcare.md';
} else if (deploymentEnv === "Production") {
    apiCommonURL = 'https://connectedcare.md';
} else if (deploymentEnv === "QA") {
    apiCommonURL = 'https://snap-qa.com';
} else if (deploymentEnv == "Single") {
    //	apiCommonURL = 'https://sandbox.connectedcare.md';
    //apiCommonURL = 'https://demo.connectedcare.md';
    if (deploymentEnvForProduction == 'Production') {
        apiCommonURL = 'https://connectedcare.md';
        api_keys_env = "Production";
    } else if (deploymentEnvForProduction == 'Staging') {
        apiCommonURL = 'https://snap-stage.com';
        api_keys_env = "Staging";
    } else if (deploymentEnvForProduction == 'QA') {
        apiCommonURL = 'https://snap-qa.com';
        api_keys_env = "QA";
    } else if (deploymentEnvForProduction == 'Sandbox') {
        apiCommonURL = 'https://hello420.sandbox.connectedcare.md';
        api_keys_env = "Sandbox";
    }
} else if (deploymentEnv == "Staging") {

    apiCommonURL = 'https://snap-stage.com';
    api_keys_env = "Staging";
}



angular.module('starter.controllers', ['starter.services', 'ngLoadingSpinner', 'timer', 'ion-google-place', 'ngIOS9UIWebViewPatch', 'ngCordova', 'ngIdle'])


.controller('LoginCtrl', function($scope, $ionicScrollDelegate, $sce, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, get2CharInString, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar, CreditCardValidations, $ionicPopup, Idle) {

     function resetSessionLogoutTimer(){
         window.localStorage.setItem('Active', timeoutValue);
         timeoutValue = 0;
         clearSessionLogoutTimer();
         appIdleInterval = $interval(function() {
            if(window.localStorage.getItem("isCustomerInWaitingRoom") != 'Yes' && window.localStorage.getItem('isVideoCallProgress') != 'Yes'){
                 timeoutValue++;
                 window.localStorage.setItem('InActiveSince', timeoutValue);
                 if(timeoutValue === 30)
                   goInactive();
            }else{
                  timeoutValue = 0;
                  window.localStorage.setItem('InActiveSince', timeoutValue);
            }
         }, 60000);
    };


     function clearSessionLogoutTimer(){
       if(typeof appIdleInterval != "undefined"){
          $interval.cancel(appIdleInterval);
           appIdleInterval = undefined;
           appIdleInterval = 0;
           timeoutValue = 0;
           window.localStorage.setItem('InActiveSince', timeoutValue);
       }
 };
     resetSessionLogoutTimer();
    window.localStorage.setItem('isVideoCallProgress', "No");
    window.localStorage.setItem("isCustomerInWaitingRoom", "No");
    $rootScope.drawSVGCIcon = function(iconName) {
        return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
    };

    $rootScope.drawImage = function(imagePath, firstName, lastName) {
        $('.patProfileImage').css({
            'background-color': $rootScope.brandColor
        });
        var Name = getInitialFromName(firstName, lastName);
        if(Name === 'WW') {
             Name = 'W';
        }
        if (!angular.isUndefined(imagePath) && imagePath !== '') {
            if (imagePath.indexOf("api") >= 0) {
                var image = imagePath;
                return "<img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'>";
            } else {
                return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
            }
        } else {
              return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
        }
    };

    $rootScope.drawSVGCIconForVideo = function(iconName, color) {
        return "<svg class='icon-" + iconName + " svgIcon" + iconName + " svgIconForVideo'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
    };

    $rootScope.canceloption = function() {
        $window.history.back();
        $scope.apply();
    }


    $rootScope.deploymentEnv = deploymentEnv;
    if (deploymentEnv !== 'Multiple') {
        $rootScope.APICommonURL = apiCommonURL;

    }


    $rootScope.envList = ["Snap.QA", "Sandbox", "Staging", "Snap-test"];

    $scope.ChangeEnv = function(env) {
        $window.localStorage.setItem('tokenExpireTime', '');
        if (env == "Snap.QA") {
            $rootScope.APICommonURL = 'https://snap-qa.com';
            apiCommonURL = 'https://snap-qa.com';
            //$rootScope.APICommonURL ='http://emerald.snap.local';
            //apiCommonURL ='http://emerald.snap.local';
            //$rootScope.APICommonURL ='https://snapmd-api.azurewebsites.net';
            //apiCommonURL ='https://snapmd-api.azurewebsites.net';
            api_keys_env = "Snap.QA";
        } else if (env == "Sandbox") {
            $rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
            apiCommonURL = 'https://sandbox.connectedcare.md';
            api_keys_env = "Sandbox";
        } else if (env === "Staging") {
            $rootScope.APICommonURL = 'https://snap-stage.com';
            apiCommonURL = ' https://snap-stage.com';
            api_keys_env = "Staging";
        }else if (env === "Snap-test") {
            $rootScope.APICommonURL = 'https://snap-test.com';
            apiCommonURL = ' https://snap-test.com';
            api_keys_env = "Snap.QA";
        }
        $state.go('tab.login');
    };
    //$rootScope.externalURL = localStorage.getItem("external_load");
    /*$scope.externalVideoURLFromWeb = localStorage.getItem("external_load");
  if($scope.externalVideoURLFromWeb !== ""){
  alert($scope.externalVideoURLFromWeb);
  alert($scope.externalVideoURLFromWeb.search().user);
}*/
    /*
    $timeout(function(){
    $rootScope.externalURL = localStorage.getItem("external_load");
    },900);
    */
    /*$rootScope.online = navigator.onLine;
    $rootScope.IsOnline = navigator.onLine;
    alert($rootScope.online + 'aaa');
    alert($rootScope.IsOnline + 'bbb');
    connectionCheck = $interval(function(){
    if($rootScope.online) {
    $scope.networkError();
    }
    }, 1000);

    $scope.networkError = function(){
    $interval.cancel(connectionCheck);
    $rootScope.online = true;
    return alert('Network Disconnected');
    }
    */

    $window.localStorage.setItem('ChkVideoConferencePage', "");
    $rootScope.currState = $state;
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();

    $rootScope.IOSDevice = ionic.Platform.isIOS();
    $rootScope.AndroidDevice = ionic.Platform.isAndroid();
    $rootScope.WindowsPhone = ionic.Platform.isWindowsPhone();
    $rootScope.isWebView = ionic.Platform.isWebView();
    $rootScope.isIPad = ionic.Platform.isIPad();
    $rootScope.isWindow = true;

    /******** Prabin: Code to implement static brand color, logo and tagline. *******/
    if (deploymentEnvLogout == 'Single') {
        if ($rootScope.currState.$current.name == "tab.loginSingle") {

            $rootScope.brandColor = brandColor;
            $rootScope.logo = logo;
            $rootScope.HospitalTag = HospitalTag;
            $rootScope.Hospital = Hospital;
            $rootScope.alertMsgName = Hospital;
            $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
        }
    } else {
        $rootScope.alertMsgName = 'Virtual Care';
        $rootScope.reportHospitalUpperCase = 'Virtual Care';
    }


    /******** Code to implement static brand color ends here **********/

    if ($rootScope.IOSDevice || $rootScope.isIPad) {
        /*  $rootScope.screenwidth = window.innerWidth;
  if ($rootScope.screenwidth < 325) { //alert($rootScope.screenwidth);
  $rootScope.consentScreenSize = "margin-top: 224px !important;";
}*/

        $rootScope.deviceName = "IOS";
        $rootScope.appointCOntent = "margin-top: 175px; ";
        $rootScope.BarHeaderLessDevice = "bar-headerLessIOS";
        $rootScope.SubHeaderLessDevice = "bar-subheaderLessIOS";
        $rootScope.loginSub = "height: 100px; top: 43px;";
        $rootScope.loginSubTitle = "top: 31px;";
        $rootScope.HeadTitleLessDevice = "head_titleLessIOS";
        $rootScope.password_sub_header = "password_sub_headerIOS";
        $rootScope.password_header_content = "password_header_contentIOS";
        $rootScope.header_image = "header_imageIOS";
        $rootScope.title_patient = "title_patientIOS";
        $rootScope.HeaderList = "HeaderListIOS";
        $rootScope.menuiconIOS = "menuiconIOS";
        $rootScope.sidemenuHome = "SidemenuHomeIOS";
        $rootScope.calendarTitle = "calendarTitleIOS";
        $rootScope.barsubheaderHomeUser = "bar-subheaderHomeUserIOS";
        $rootScope.patient_subHeaderTopMove = "margin-top: 1px !important;";
        $rootScope.intakeTittle = "intakeTittleIOS";
        $rootScope.MenuInnerStyle = "top: 0px;";
       // $rootScope.IntakeFormInnerStyle = "margin-top: 7px;";
        $rootScope.IntakeFormInnerStyleMedication = "margin-top: 0px;";
        $rootScope.PatientCalentarInnerStyle = "margin-top: 1px;";
        $rootScope.PatientCalentarSchedule = "top: 7px;position: relative; height: 49px;";
        $rootScope.PatientCalentarScheduleItem = "top: 45px;"
        $rootScope.PatientCalentarInnerStyleDetail = "margin-top: 1px;";
        $rootScope.PatientCalentarInnerStyleAppointmentWith = "margin-top: -16px !important;";
        $rootScope.appoinmentStyle = "  margin-top: -5px;";
        $rootScope.appointContent = "margin: 85px 0 0 0;";
        $rootScope.MenuIconBottom = "top: 4px;";
        $rootScope.patientsubHeaderInnerStyle = "margin-top: 0px;";
        $rootScope.waitingContentIos = "margin-top: 124px; ";
        $rootScope.BackBotton = "top: 7px; position: relative;";
        $rootScope.Appoinmentwaitcenter = "left: -27px;";
        $rootScope.PaymentStyle = "top: 11px;";
        $rootScope.HeadercardDetails = "height: 69px;";
        $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
        $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
        $rootScope.AddHealthPlanCancel = "margin-top: 6px";
        $rootScope.ReportScreen = " top: 1px; position: relative;";
        $rootScope.PlanDetails = "margin-top: 22px;";
        $rootScope.SubDetailsPlanDetails = "margin-top: -16px;";
        $rootScope.PatientTitle = "  margin-top: 26px; margin-left:-40px;";
        $rootScope.MenuIconBottomRecipt = "top: -4px;";
        $rootScope.PatientConcerns = "margin-top: 90px;";
        $rootScope.GoogleSearchStyle = "top: 24px;";
        $rootScope.BackgroundColorGoogle = "background-color: #fff;";
        $rootScope.GoogleSearchContent = "top: 55px;";
        $rootScope.NextButtonReduce = "right: 5px;";
        $rootScope.CardDetailsNextButton = "left: 0px;margin-top: 13px;";
        $rootScope.IntakeFormInnerStyleTitle = "top: 3px;position: relative;";
        //$rootScope.loginLineHeight = "top: 2px; position: relative;";
        //$rootScope.passwordLineHeight = "top: 2px; position: relative;";
        $rootScope.ContentOverlop = "margin: 147px 0 0 0;";
        $rootScope.ContentConsultCharge = "margin: 141px 0 0 0; padding-top: 43px;";
        //$rootScope.currentMedicationContent = "margin-top: 125px !important;";
        $rootScope.usHomeCOntent = "margin: 75px 0 0 0 !important;";
        if ($rootScope.IOSDevice) {
            $rootScope.patientConternFontStyle = "patientConternFontStyle-ios";
            $rootScope.concernListTitleStyle = "concernListTitle-ios";
            $rootScope.concernListDoneStyle = "concernListDone-ios";
            $rootScope.PrimaryConcernPopupH = "height: 66px;";
            $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
            $rootScope.PrimaryConcernPopupTitle = "margin-top: 7px; font-family: 'Glober SemiBold'; ";
            $rootScope.PrimaryConcernPopupDone = "margin-top: 14px; padding-right: 0px; padding-left: 0px;padding: 0px;";
            $rootScope.PriorSurgeryPopupTitle = "margin-top: 16px;";
            $rootScope.PriorSurgeryPopupDone = "  margin-top: 21px;";
            $rootScope.PriorSurgeryPopupCancel = " margin-top: 2px;  padding-right: 0px; padding-left: 0px;padding: 0px;";
            $rootScope.ChronicConditionPopupTitle = "margin-top: 13px;";
            $rootScope.ChronicConditionPopupDone = "margin-top: 13px;";
            $rootScope.NextIntakeForm = "margin-left: -21px;";
            $rootScope.LoginContant = "padding-top: 43px !important; margin: 99px 0 0 0;"; //margin: 30px 0 0 0 remove
            $rootScope.LoginContantDiv = " height: 50px;"; //95px
            //$rootScope.PasswordOverlop = "margin: 235px 0 0 0;";
            $rootScope.PasswordOverlop = "margin: 105px 0 0 0 !important;";
            $rootScope.PriorSurgeryPopupTextBox = "margin-top: 15px;";
            $rootScope.PriorSurgeryPopupTextBox = "margin-top: 11px;";
            $rootScope.ContentOverlop = "margin: 147px 0 0 0;";
            $rootScope.AddhealthplanOverlop = "margin: 187px 0 0 0;";
            $rootScope.PositionIOS = "position:fixed; top:105px;";
            $rootScope.MarginHomeTop = "margin-top: 223px";
            $rootScope.concernsItemDivs = "top: 5px;";
            $rootScope.FootNextButtonRight = "margin-left: -83px !important;";
            $rootScope.FootNextButton = "left: 24px;";
            $rootScope.PriorSurgeryContant = "margin-top: 43px;";
            $rootScope.reportDone = "padding-top: 26px;";
            $rootScope.reportTitletop = "top: 14px !important; left: -8px !important;";
            $rootScope.resetContent = "margin: -46px 0 0 0;";
            $rootScope.ConcernFooterNextIOS = "margin-left: -46px !important; left: -16px !important;";
            $rootScope.providerItamMarginTop = "top: 5px;";
        }
        if ($rootScope.isIPad) {
            $rootScope.PrimaryConcernPopupH = "height: 66px;";
            $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
            $rootScope.PrimaryConcernPopupTitle = "margin-top: 6px; font-family: 'Glober SemiBold'; ";
            $rootScope.PrimaryConcernPopupDone = "margin-top: 8px; padding-right: 0px; padding-left: 0px;padding: 0px;";
            $rootScope.PriorSurgeryPopupTitle = "margin-top: 0px;";
            $rootScope.PriorSurgeryPopupDone = "margin-top: 6px;";
            $rootScope.PriorSurgeryPopupCancel = " margin-top: 2px; padding-right: 0px; padding-left: 0px;padding: 0px;";
            $rootScope.ChronicConditionPopupTitle = "margin-top: 6px;";
            $rootScope.ChronicConditionPopupDone = "margin-top: 10px;";
            /*$rootScope.FootNextButtonRight = "margin-left: -61px !important;"; */
            $rootScope.FootNextButtonRight = "margin-left: -87px !important;";
            $rootScope.FootNextButton = "left: 22px;";
            $rootScope.FootNextButtonPatient = "left: 3px;";
        }
        $rootScope.PriorSurgeryContant = "margin-top: 53px;";
        $rootScope.CardDetailYear = "padding-left: 11px;";
        $rootScope.CardDetailmonth = "padding-right: 11px;";
        $rootScope.CountrySearchItem = "top: 13px;";
        $rootScope.ConstantTreat = "font-size: 16px;";
        $rootScope.NeedanAcountStyle = "NeedanAcount_ios";
        $rootScope.calendarBackStyle = "top: 13px !important;";
    } else if ($rootScope.AndroidDevice) {
        $rootScope.deviceName = "Android";
        $rootScope.BarHeaderLessDevice = "bar-headerLessAndroid";
        $rootScope.SubHeaderLessDevice = "bar-subheaderLessAndroid";
        $rootScope.HeadTitleLessDevice = "head_titleLessAndroid";
        $rootScope.password_sub_header = "password_sub_headerAndroid";
        $rootScope.password_header_content = "password_header_contentAndroid";
        $rootScope.header_image = "header_imageAndroid";
        $rootScope.title_patient = "title_patientAndroid";
        $rootScope.HeaderList = "HeaderListAndroid";
        $rootScope.sidemenuHome = "SidemenuHomeAndroid";
        $rootScope.calendarTitle = "calendarTitleAndroid";
        $rootScope.barsubheaderHomeUser = "bar-subheaderHomeUserAndroid";
        $rootScope.calendarBack = "calendarBackAndroid";
        $rootScope.intakeTittle = "intakeTittleAndroid";
        $rootScope.MenuInnerStyle = "top: -8px;";
        $rootScope.MenuIconBottomRecipt = "top: -8px;";
        $rootScope.AddhealthplanOverlop = "margin: 186px 0 0 0;";
        $rootScope.PriorSurgeryPopupCancel = "margin-top: -4px;  padding-right: 0px; padding-left: 0px;padding: 0px;";
        //$rootScope.PasswordOverlop = "margin: 105px 0 0 0; padding-top: 30px;";
        //$rootScope.PasswordOverlop = "margin: 118px 0 0 0;";
        $rootScope.PatientTitle = "  margin-left:-45px;"
        $rootScope.PasswordOverlop = "margin: 57px 0 0 0;";
        $rootScope.resetContent = "margin: 202px 0 0 0;";
        $rootScope.NeedanAcountStyle = "NeedanAcount_android";
        $rootScope.calendarBackStyle = "";
        $rootScope.patientConternFontStyle = "patientConternFontStyle";
        $rootScope.concernListTitleStyle = "concernListTitle";
        $rootScope.concernListDoneStyle = "concernListDone";
        $rootScope.PrimaryMarginTop = "margin-top: -16px";
        $rootScope.ConcernFooterNextIOS = "margin-left: -22px !important; left: -34px !important;";
        //  $rootScope.providerItamTop = "top: 6px;";
        $rootScope.appointContent = "margin: 76px 0 0 0;";
        //$rootScope.MarginHomeTop = "margin-top: -130px;";
        $rootScope.waitingContentIos = "margin-top: 120px; ";
        $rootScope.providerItamMarginTop = "";
        $rootScope.appointCOntent = "margin-top:153px;";
    }
    $scope.showSearchInput = function() {
        var searchStyle = $('#divSearchInput').css('display');

        if (searchStyle === 'none') {
            $("#divSearchInput").css("display", "block");

            if ($('#divSearchInput').hasClass("ng-hide"))
                $('#divSearchInput').removeClass('ng-hide');
            if ($('#divSearchInput').hasClass("slideOutUp"))
                $('#divSearchInput').removeClass('slideOutUp');
            $('#divSearchInput').addClass('animated slideInDown');


            var searchStyle1 = $('#divSearchInput').css('display');
            if (searchStyle1 === 'block') {
                if ($rootScope.AndroidDevice) {
                    $('.ContentUserHome').animate({
                        "margin": "140px 0 0 0"
                    }, 290);
                } else {
                    $('.ContentUserHome').animate({
                        "margin": "125px 0 0 0"
                    }, 290);
                }
            }

        } else {
            if ($('#divSearchInput').hasClass("slideInDown")) {
                $('#divSearchInput').removeClass('slideInDown');
            }
            $('#divSearchInput').addClass('animated slideOutUp');
            if ($rootScope.AndroidDevice) {

                $('.ContentUserHome').animate({
                    "margin": "70px 0 0 0"
                }, 290);
            } else {
                $('.ContentUserHome').animate({
                    "margin": "75px 0 0 0"
                }, 290);
            }

            setTimeout(function() {
                $("#divSearchInput").css("display", "none");
            }, 500);
        }
    };

    $ionicPlatform.registerBackButtonAction(function(event, $state) {
        if (($rootScope.currState.$current.name === "tab.userhome") ||
            ($rootScope.currState.$current.name === "tab.addCard") ||
            ($rootScope.currState.$current.name === "tab.submitPayment") ||
            ($rootScope.currState.$current.name === "tab.waitingRoom") ||
            ($rootScope.currState.$current.name === "tab.receipt") ||
            ($rootScope.currState.$current.name === "tab.videoConference") ||
            ($rootScope.currState.$current.name === "tab.connectionLost") ||
            ($rootScope.currState.$current.name === "tab.ReportScreen")
        ) {
            // H/W BACK button is disabled for these states (these views)
            // Do not go to the previous state (or view) for these states.
            // Do nothing here to disable H/W back button.
        } else if ($rootScope.currState.$current.name === "tab.login") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.loginSingle") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.cardDetails") {
            var gSearchLength = $('.ion-google-place-container').length;
            if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) === 'block') {
                $ionicBackdrop.release();
                $(".ion-google-place-container").css({
                    "display": "none"
                });
            } else {
                $(".ion-google-place-container").css({
                    "display": "none"
                });
                navigator.app.backHistory();
            }

        } else {
            navigator.app.backHistory();
        }
    }, 100);


    $scope.$storage = $window.localStorage;



    var checkAndChangeMenuIcon;
    $interval.cancel(checkAndChangeMenuIcon);

    $rootScope.checkAndChangeMenuIcon = function() {
            if (!$ionicSideMenuDelegate.isOpen(true)) {
                if ($('#BackButtonIcon svg').hasClass("ion-close")) {
                    $('#BackButtonIcon svg').removeClass("ion-close");
                    $('#BackButtonIcon svg').addClass("icon-menu");
                }
            } else {
                if ($('#BackButtonIcon svg').hasClass("icon-menu")) {
                    $('#BackButtonIcon svg').removeClass("icon-menu");
                    $('#BackButtonIcon svg').addClass("ion-close");
                }
            }
        }
        //$window.localStorage.setItem("Cardben.ross.310.95348@gmail.com", undefined);
        //$window.localStorage.setItem("CardTextben.ross.310.95348@gmail.com", undefined);

    $scope.toggleLeft = function() {
        $rootScope.statename = $rootScope.currState.$current.name;
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.checkAndChangeMenuIcon();
        if (checkAndChangeMenuIcon) {
            $interval.cancel(checkAndChangeMenuIcon);
        }
        if ($rootScope.statename = "tab.userhome") {
            $('.sideuserhome').addClass("uhome");

        }
        if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
            checkAndChangeMenuIcon = $interval(function() {
                if ($rootScope.checkAndChangeMenuIcon) {
                    $rootScope.checkAndChangeMenuIcon();
                }
            }, 300);
        }
    };

    $scope.doRefreshUserHome = function() {
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('tab.userhome');
        //$scope.doGetScheduledConsulatation();
        $timeout(function() {
            //$scope.getScheduledDetails($rootScope.patientId);
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
        $scope.$apply();
    };


    $rootScope.ClearRootScope = function() {
        $window.localStorage.setItem('tokenExpireTime', '');
        $(".ion-google-place-container").css({
            "display": "none"
        });

        $ionicBackdrop.release();
        $rootScope = $rootScope.$new(true);
        $scope = $scope.$new(true);
        for (var prop in $rootScope) {
            if (prop.substring(0, 1) !== '$') {
                delete $rootScope[prop];
            }
        }
        if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
        } else if (deploymentEnvLogout === "Single") {
            $state.go('tab.loginSingle');
        } else {
            $state.go('tab.login');
        }
    }



    $('#Provider').change(function() {
        $('div.viewport1').text($("option:selected", this).text());
    });

    //$rootScope.StateList = StateLists.getStateDetails();
    $scope.currentYear = new Date().getFullYear()
    $scope.currentMonth = new Date().getMonth() + 1
    $scope.months = $locale.DATETIME_FORMATS.MONTH
    $scope.ccinfo = {
        type: undefined
    }
    $scope.save = function(data) {
        if ($scope.paymentForm.$valid) {
            console.log('valid data saving stuff here');
            console.log(data) // valid data saving stuff here
        }
    }


    $scope.$on("callValidation", function(event, args) {
        $scope.errorMsg = args.errorMsg;
        $rootScope.Validation($scope.errorMsg);
    });

    $scope.$on("callPatientDetails", function(event, args) {
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('tab.userhome');
        $rootScope.hasRequiredFields = true;
        $("#HealthFooter").css("display", "block");
    });

    $rootScope.Validation = function($errorMsg) {

        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> ' + $errorMsg + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';


        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $("#Error_Message").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'slideOutUp');
        refresh_close();
        //});
    }


    $scope.$on("callServerErrorMessageValidation", function(event, args) {
        $rootScope.serverErrorMessageValidation();
    });


    $rootScope.serverErrorMessageValidation = function() {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Unable to connect to the server. Please try again later! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $(".Server_Error").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();
        //});
    }

    $rootScope.serverErrorMessageValidationForPayment = function() {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Invalid card details. Please correct and try again.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $(".Server_Error").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();
        //});
    }

    $rootScope.serverErrorMessageValidationForHealthPlanApply = function() {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Health Plan Enquiry failed! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $(".Server_Error").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();
        //});
    }

    $rootScope.serverErrorMessageValidationForHealthPlanVerify = function() {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Unable to verify health plan. Please correct and try again.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $(".Server_Error").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();
        //});
    }


    $scope.$watch('userLogin.UserEmail', function(UserEmail) {
        if ($window.localStorage.getItem('username') == UserEmail) {
            if ($window.localStorage.getItem('username')) {
                $rootScope.chkedchkbox = true;
            }
        }
        if ($window.localStorage.getItem('username') != UserEmail) {
            $window.localStorage.setItem('username', "");
            $rootScope.chkedchkbox = false;
        } else {
            if ($("input[class=isRemChecked]").is(':checked') == true) {
                //if ($("#squaredCheckbox").prop('checked') == true) {
                $rootScope.chkedchkbox = true;
            }
        }


    });




    $('#UserEmail').val($window.localStorage.getItem('username'));




    $scope.userLogin = {};
    $scope.userLogin.UserEmail = $window.localStorage.oldEmail;
    $scope.LoginFunction = function(item, event) {
        if ($('#UserEmail').val() === '') {
            $scope.ErrorMessage = "Please enter your email";
            $rootScope.Validation($scope.ErrorMessage);

        } else {
            $scope.ValidateEmail = function(email) {
                //var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };

            if (!$scope.ValidateEmail($("#UserEmail").val())) {
                $scope.ErrorMessage = "Please enter a valid email address";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                 $rootScope.isNotificationDisplayed = false;
                $window.localStorage.setItem('FlagForCheckingAuthorization', '');
                if (ionic.Platform.is('browser') !== true) {
                    $scope.nameForChckingCurrentFuncForMic = 'GeneralLoginFun';
                    chkCameraAndMicroPhoneSettings($scope.nameForChckingCurrentFuncForMic);
                } else {
                    $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                    $scope.GetLoginFunctionDetails();
                }
            }
        }

    };

      $scope.GetLoginFunctionDetails = function() {
          if ($("input[class=isRemChecked]").is(':checked') == true) {
              $window.localStorage.setItem('username', $("#UserEmail").val());
              $window.localStorage.oldEmail = $scope.userLogin.UserEmail;

              $rootScope.UserEmail = $scope.userLogin.UserEmail;
              $rootScope.chkedchkbox = true;

          } else {
              $rootScope.UserEmail = $scope.userLogin.UserEmail;

              $window.localStorage.oldEmail = '';
              $window.localStorage.setItem('username', "");
              $rootScope.chkedchkbox = false;
          }
          if (deploymentEnv == "Production") {
              if (appStoreTestUserEmail != '' && $("#UserEmail").val() == appStoreTestUserEmail) {
                  apiCommonURL = 'https://snap-stage.com';
                  api_keys_env = 'Staging';
                  $rootScope.APICommonURL = 'https://snap-stage.com';
              } else {
                  apiCommonURL = 'https://connectedcare.md';
                  api_keys_env = 'Production';
                  $rootScope.APICommonURL = 'https://connectedcare.md';
              }
          }
          $('#loginEmail').hide();
          $('#verifyEmail').show();
          $scope.doGetFacilitiesList();
      }


    $scope.checkSingleHospitalLogin = function(item, event) {

        if ($('#UserEmail').val() == '') {
            $scope.ErrorMessage = "Please enter an email";
            $rootScope.Validation($scope.ErrorMessage);

        } else {
            $scope.ValidateEmail = function(email) {
                //var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };
            if (!$scope.ValidateEmail($("#UserEmail").val())) {
                $scope.ErrorMessage = "Please enter a valid email address";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#password').val() == '') {
                $scope.ErrorMessage = "Please enter your password";
                $rootScope.Validation($scope.ErrorMessage);

            } else {
                 $rootScope.isNotificationDisplayed = false;
                 $window.localStorage.setItem('FlagForCheckingAuthorization', '');
                if (ionic.Platform.is('browser') !== true) {
                    $scope.nameForChckingCurrentFuncForMic = 'SingleFuncLogin';
                    chkCameraAndMicroPhoneSettings($scope.nameForChckingCurrentFuncForMic);
                } else {
                    $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                    $scope.GetSingleLoginDetailsFOrCheckingMic();
                }
            }
        }
    };

    $scope.GetSingleLoginDetailsFOrCheckingMic = function() {
          if (deploymentEnvLogout == 'Single') {
              if (deploymentEnvForProduction == 'Production') {
                  if (appStoreTestUserEmail != '' && $("#UserEmail").val() == appStoreTestUserEmail) {
                      //deploymentEnv = "Staging";
                      $rootScope.hospitalId = singleStagingHospitalId;
                      apiCommonURL = 'https://snap-stage.com';
                      api_keys_env = 'Staging';
                      $rootScope.APICommonURL = 'https://snap-stage.com';
                  } else {
                      //deploymentEnv = "Production";
                      $rootScope.hospitalId = singleHospitalId;
                      apiCommonURL = 'https://connectedcare.md';
                      api_keys_env = 'Production';
                      $rootScope.APICommonURL = 'https://connectedcare.md';
                  }
              } else if (deploymentEnvForProduction == 'Staging') {
                  $rootScope.hospitalId = singleStagingHospitalId;
                  api_keys_env = "Staging";
              } else if (deploymentEnvForProduction == 'QA') {
                  $rootScope.hospitalId = singleQAHospitalId;
                  api_keys_env = "QA";
              } else if (deploymentEnvForProduction == 'Sandbox') {
                  $rootScope.hospitalId = singleSandboxHospitalId;
                  api_keys_env = "Sandbox";
              }
          }
          if ($("input[class=isRemChecked]").is(':checked') == true) {
              $window.localStorage.setItem('username', $("#UserEmail").val());
              $window.localStorage.oldEmail = $scope.userLogin.UserEmail;
              $rootScope.UserEmail = $scope.userLogin.UserEmail;
              $rootScope.chkedchkbox = true;

          } else {
              $rootScope.UserEmail = $scope.userLogin.UserEmail;
              $window.localStorage.oldEmail = '';
              $window.localStorage.setItem('username', "");
              $rootScope.chkedchkbox = false;
          }
          //$scope.doGetToken();
          $scope.doGetTokenSSO();
    }


    $scope.doGetFacilitiesList = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            emailAddress: $rootScope.UserEmail,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                //console.log(data);
                $rootScope.PostPaymentDetails = data.data;
                if ($rootScope.PostPaymentDetails == 0) {
                    $scope.ErrorMessage = "No account associated with this email.  Please try again";
                    $rootScope.Validation($scope.ErrorMessage);
                    $('#verifyEmail').hide();
                    $('#loginEmail').show();
                } else {
                    $rootScope.hospitalDetailsList = [];
                    angular.forEach($rootScope.PostPaymentDetails, function(index, item) {
                        if (typeof index.logo != 'undefined' && index.logo != '') {
                            $scope.chkImageorNot = "image";
                            var hosImage = index.logo;
                            if (hosImage.indexOf("http") >= 0) {
                                $scope.proImage = hosImage;
                            } else {
                                $scope.proImage = apiCommonURL + hosImage;
                            }
                        } else {
                            $scope.chkImageorNot = "";
                            $scope.proImage = get2CharInString.getProv2Char(index.name);
                        }
                        $rootScope.hospitalDetailsList.push({
                            'id': index.$id,
                            'domainName': index.domainName,
                            'logo': $scope.proImage,
                            'chkImageorNot': $scope.chkImageorNot,
                            'name': index.name,
                            'operatingHours': index.operatingHours,
                            'providerId': index.providerId,
                            'brandColor': index.brandColor,
                            'contactNumber': index.contactNumber,
                            'appointmentsContactNumber': index.appointmentsContactNumber,
                        });
                    });

                    $rootScope.contactNumber = $rootScope.hospitalDetailsList[0].contactNumber;
                    $rootScope.appointmentsContactNumber = $rootScope.hospitalDetailsList[0].appointmentsContactNumber;

                    if (typeof $rootScope.contactNumber !== 'undefined') {

                        $rootScope.contactNumber = $rootScope.contactNumber;
                    } else if (typeof $rootScope.contactNumber === 'undefined') {
                        if (typeof $rootScope.appointmentsContactNumber !== 'undefined') {
                            $rootScope.contactNumber = $rootScope.appointmentsContactNumber;
                        } else if (typeof $rootScope.appointmentsContactNumber === 'undefined') {
                            $rootScope.contactNumber = '';
                        }
                    }

                    $rootScope.CountryLists = CountryList.getCountryDetails();
                    $state.go('tab.provider');
                }

                //console.log($rootScope.hospitalDetailsList);
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                }
                $('#verifyEmail').hide();
                $('#loginEmail').show();

            }
        };

        LoginService.getFacilitiesList(params);
    }

    $scope.goToSearchProvider = function(currentPage) {
        $rootScope.frontPage = 'tab.' + currentPage;
        $rootScope.backProviderSearchKey = '';
        if (currentPage === "loginSingle") {
            $rootScope.regStep1 = {};
            $rootScope.selectedSearchProviderList = [];
            $rootScope.selectedSearchProviderList.push({
                  'hospitalName':  $rootScope.Hospital,
                });
            $rootScope.selectedSearchProviderList = $rootScope.selectedSearchProviderList[0];
            $state.go('tab.registerStep1');
        } else {
            $state.go('tab.searchprovider');
        }
    }

    $rootScope.backtoPreviousPage = function() {
        $state.go($rootScope.frontPage);
    }

    $rootScope.cancelProviderSearch = function() {
        navigator.notification.confirm(
            'Are you sure that you want to cancel?',
            function(index) {
                if (index == 1) {

                } else if (index == 2) {
                    //$state.go('tab.userhome');
                    $state.go($rootScope.frontPage);
                }
            },
            'Confirmation:', ['No', 'Yes']
        );
    }

    $rootScope.backtoPreviousPageFromTerms = function(registerCurrentPage) {
        $state.go(registerCurrentPage);
    }

    $scope.doGetSingleHospitalInformation = function() {
        $rootScope.paymentMode = '';
        $rootScope.insuranceMode = '';
        $rootScope.onDemandMode = '';
        $rootScope.OrganizationLocation = '';
        $rootScope.PPIsBloodTypeRequired = '';
        $rootScope.PPIsHairColorRequired = '';
        $rootScope.PPIsEthnicityRequired = '';
        $rootScope.PPIsEyeColorRequired = '';
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                if ($rootScope.getDetails != '') {
                    for (var i = 0; i < $rootScope.getDetails.length; i++) {
                        if ($rootScope.getDetails[i] == 'InsuranceVerification' || $rootScope.getDetails[i] == 'mInsVerification') {
                            $rootScope.insuranceMode = 'on';
                        }

                        if ($rootScope.getDetails[i] == 'ECommerce' || $rootScope.getDetails[i] == 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'OnDemand' || $rootScope.getDetails[i] == 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'OrganizationLocation' || $rootScope.getDetails[i] == 'mOrganizationLocation') {
                            $rootScope.OrganizationLocation = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsBloodTypeRequired') {
                            $rootScope.PPIsBloodTypeRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsHairColorRequired') {
                            $rootScope.PPIsHairColorRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEthnicityRequired') {
                            $rootScope.PPIsEthnicityRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEyeColorRequired') {
                            $rootScope.PPIsEyeColorRequired = 'on';
                        }
                    }
                }
                $rootScope.brandColor = data.data[0].brandColor;
                //$rootScope.logo = apiCommonURL + data.data[0].hospitalImage;
                $rootScope.logo = data.data[0].hospitalImage;
                $rootScope.Hospital = data.data[0].brandName;
                if (deploymentEnvLogout == 'Single') {
                    $rootScope.alertMsgName = $rootScope.Hospital;
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                } else {
                    $rootScope.alertMsgName = 'Virtual Care';
                    $rootScope.reportHospitalUpperCase = 'Virtual Care';
                }
                $rootScope.HospitalTag = data.data[0].brandTitle;
                $rootScope.contactNumber = data.data[0].contactNumber;
                $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                $rootScope.clientName = data.data[0].hospitalName;

                $state.go('tab.password');


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                }


            }
        };
        LoginService.getHospitalInfo(params);
    }



    $('.hospitalDynamicLink').click(function() {
        var url = 'https://' + $rootScope.hospitalDomainName + '/public/#/UserTerms';
        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
    });


    $scope.ProviderFunction = function(hospitalDetailsDatas) {
        $rootScope.hospitalId = hospitalDetailsDatas.providerId;
        $rootScope.hospitalName = hospitalDetailsDatas.name;
        //  $rootScope.logo = hospitalDetailsDatas.logo;
        $rootScope.operatingHours = hospitalDetailsDatas.operatingHours;
        $rootScope.id = hospitalDetailsDatas.id;
        //  $rootScope.brandColor = hospitalDetailsDatas.brandColor;
        $rootScope.backgroundimage = "background-image: none;";
        $scope.doGetSingleHospitalInformation();
        /*
        ref = window.open('http://emerald.snap.local/auth/Login?app_url=snapmdconnectedcare://&state=userhome', '_blank', 'location=no,toolbar=no');
        */
    }

    $scope.textboxUp = function() {
        /*$timeout(function(){
  $ionicScrollDelegate.scrollTo(0, 150, true);
}, 400);*/
        // $('#passwordtop').css({"padding-bottom": "2px !important"});
        $timeout(function() {
            $ionicScrollDelegate.scrollTo(0, 150, true);
            //$ionicScrollDelegate.getScrollView().scrollTo(0, 150, false);
        }, 900);
    };



    $scope.goBackProvider = function() {
        $state.go('tab.provider');
    };

    $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme = function() {
        $rootScope.paymentMode = '';
        $rootScope.insuranceMode = '';
        $rootScope.onDemandMode = '';
        $rootScope.OrganizationLocation = '';
        $rootScope.PPIsBloodTypeRequired = '';
        $rootScope.PPIsHairColorRequired = '';
        $rootScope.PPIsEthnicityRequired = '';
        $rootScope.PPIsEyeColorRequired = '';
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                if ($rootScope.getDetails != '') {
                    for (var i = 0; i < $rootScope.getDetails.length; i++) {
                        if ($rootScope.getDetails[i] == 'InsuranceVerification' || $rootScope.getDetails[i] == 'mInsVerification') {
                            $rootScope.insuranceMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'ECommerce' || $rootScope.getDetails[i] == 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'OnDemand' || $rootScope.getDetails[i] == 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'OrganizationLocation' || $rootScope.getDetails[i] == 'mOrganizationLocation') {
                            $rootScope.OrganizationLocation = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsBloodTypeRequired') {
                            $rootScope.PPIsBloodTypeRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsHairColorRequired') {
                            $rootScope.PPIsHairColorRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEthnicityRequired') {
                            $rootScope.PPIsEthnicityRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEyeColorRequired') {
                            $rootScope.PPIsEyeColorRequired = 'on';
                        }
                    }
                }
                //$rootScope.brandColor = data.data[0].brandColor;

                $rootScope.logo = data.data[0].hospitalImage;
                //$rootScope.Hospital = data.data[0].brandName;
                if (deploymentEnvLogout == 'Single') {
                    $rootScope.alertMsgName = $rootScope.Hospital;
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                } else {
                    $rootScope.alertMsgName = 'Virtual Care';
                    $rootScope.reportHospitalUpperCase = 'Virtual Care';
                }
                $rootScope.contactNumber = data.data[0].contactNumber;
                $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                $rootScope.clientName = data.data[0].hospitalName;
                $state.go('tab.userhome');
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getHospitalInfo(params);
    }


    /*  $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme = function() {
    $rootScope.paymentMode = '';
    $rootScope.insuranceMode = '';
    $rootScope.onDemandMode = '';
    var params = {
    hospitalId: $rootScope.hospitalId,
    success: function(data) {
    $rootScope.getDetails = data.data[0].enabledModules;
    if ($rootScope.getDetails !== '') {
    for (var i = 0; i < $rootScope.getDetails.length; i++) {

    if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {

    $rootScope.insuranceMode = 'on';
    }
    if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
    $rootScope.paymentMode = 'on';
    }
    if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
    $rootScope.onDemandMode = 'on';
    }
    if ($rootScope.getDetails[i] == 'OrganizationLocation' || $rootScope.getDetails[i] == 'mOrganizationLocation') {
    $rootScope.OrganizationLocation = 'on';
    }
    if ($rootScope.getDetails[i] == 'PPIsBloodTypeRequired') {
    $rootScope.PPIsBloodTypeRequired = 'on';
    }
    if ($rootScope.getDetails[i] == 'PPIsHairColorRequired') {
    $rootScope.PPIsHairColorRequired = 'on';
    }
    if ($rootScope.getDetails[i] == 'PPIsEthnicityRequired') {
    $rootScope.PPIsEthnicityRequired = 'on';
    }
    if ($rootScope.getDetails[i] == 'PPIsEyeColorRequired') {
    $rootScope.PPIsEyeColorRequired = 'on';
    }
    }
    }
    //$rootScope.brandColor = data.data[0].brandColor;

    $rootScope.logo = data.data[0].hospitalImage;
    //$rootScope.Hospital = data.data[0].brandName;
    if (deploymentEnvLogout == 'Single') {
    $rootScope.alertMsgName = $rootScope.Hospital;
    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();

    } else {
    $rootScope.alertMsgName = $rootScope.Hospital;
    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();

    }
    $rootScope.contactNumber = data.data[0].contactNumber;
    $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
    $rootScope.clientName = data.data[0].hospitalName;
    $state.go('tab.userhome');
    },
    error: function(data) {
    $rootScope.serverErrorMessageValidation();
    }
    };
    LoginService.getHospitalInfo(params);
    }*/


    $scope.doPostResendEmail = function() {
        var params = {
            email: $rootScope.UserEmail,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                //console.log('dopostsentpass');
                //  console.log(data);
                //  alert('ddd');
                $scope.ErrorMessage = "Account Activation link has been sent to the address you provided";
                $rootScope.Validation($scope.ErrorMessage);
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.postResendEmail(params);

    }

    $scope.doGetTokenSSO = function() {
        var loginEmail = $rootScope.UserEmail;
        if (cobrandApp === "Hello420" && loginEmail.toLowerCase() != "itunesmobiletester@gmail.com") {
            //  Idle.watch();
            $scope.checkForSSOUserExistsInHello420();
        } else {
            $scope.doGetToken();
        }
    }

    $scope.checkForSSOUserExistsInHello420 = function() {
            var Hello420HospitalId = 197;
            var params = {
                emailAddress: $rootScope.UserEmail,
                success: function(data) {
                    $rootScope.FacilitiesList = data.data;
                    if ($rootScope.FacilitiesList.length > 0) {
                        angular.forEach($rootScope.FacilitiesList, function(index, item) {
                            if (index.providerId == Hello420HospitalId) {
                                if (ssoURL !== "") {
                                    $scope.ErrorMessage = "You will be directed to the Hello420 website momentarily";
                                    $rootScope.Validation($scope.ErrorMessage);
                                    setTimeout(function() {
                                        //ssoURL = "http://52.34.151.119/hello420/login/";
                                        window.open(ssoURL, '_system', '');
                                        return;
                                    }, 2000);
                                    /*navigator.notification.alert(
              'You will be redirected to Hello420 website to continue.',  // message
              function(){
              ssoURL = "http://52.34.151.119/hello420/login/";
              window.open(ssoURL, '_system', '');
              return;
            },
            $rootScope.alertMsgName,
            'OK'
          );
          */

                                }
                            }
                        });
                    } else {
                        $scope.ErrorMessage = "Login Failed! Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                },
                error: function(data) {
                    $scope.ErrorMessage = "Login Failed! Please try again";
                    $rootScope.Validation($scope.ErrorMessage);
                }
            };
            LoginService.getFacilitiesList(params);
        }
        //Password functionality


    $scope.pass = {};
    $scope.doGetToken = function() {
        if ($('#password').val() === '') {
            $scope.ErrorMessage = "Please enter your password";
            $rootScope.Validation($scope.ErrorMessage);
        } else {
          $('#loginPwd').hide();
          $('#loginPwdVerify').show();
            console.log($scope.password);
            var params = {
                email: $rootScope.UserEmail,
                password: $scope.pass.password,
                userTypeId: 1,
                hospitalId: $rootScope.hospitalId,
                success: function(data) {
                    //Get default payment profile from localstorage if already stored.
                    $rootScope.accessToken = data.data[0].access_token;
                    //  $window.localStorage.setItem('tokenExpireTime', data.data[0].expires);
                    $scope.getCurrentTimeForSessionLogout = new Date();
                    $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                    $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                    //  $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');

                    if (typeof data.data[0].access_token == 'undefined') {
                        $('#loginPwdVerify').hide();
                        $('#loginPwd').show();
                        $scope.ErrorMessage = "Incorrect Password. Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $scope.tokenStatus = 'alert-success';
                        $scope.doGetCodesSet();
                        $scope.chkPatientFilledAllRequirements();
                        //    Idle.watch();
                        //$rootScope.CountryLists = CountryList.getCountryDetails();
                    }
                    window.localStorage.setItem('rootScope', angular.fromJson($rootScope));
                },
                error: function(data, status) {
                  $('#loginPwdVerify').hide();
                  $('#loginPwd').show();
                    var networkState = navigator.connection.type;
                    if (networkState != 'none') {
                        if (status == '401' || status == '403') {
                            /*  navigator.notification.confirm(
            'Your account is not verified yet. Do you want to resend?',
            function(index) {
            if (index == 1) {

          } else if (index == 2) {
          $scope.doPostResendEmail();
        }
      },
      'Confirmation:', ['Cancel', 'Resend']
    );*/
                            $scope.ErrorMessage = "We are unable to log you in. Please contact customer support regarding your account";
                            $rootScope.Validation($scope.ErrorMessage);

                        } else {
                            $scope.ErrorMessage = "Incorrect Password. Please try again";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getToken(params);
        }
    }

    //Idle.watch();

    $scope.$on('IdleStart', function() {
        console.log("aaa");
    });
    $scope.$on('IdleWarn', function(e, countdown) {});
    $scope.$on('IdleTimeout', function() {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
        if (window.localStorage.getItem("tokenExpireTime") != null && window.localStorage.getItem("tokenExpireTime") != "") {
            if ($rootScope.currState.$current.name != "tab.waitingRoom" && $rootScope.currState.$current.name != "videoConference") {
                navigator.notification.alert(
                    'Your session timed out.', // message
                    null,
                    $rootScope.alertMsgName,
                    'Ok' // buttonName
                );
                $rootScope.ClearRootScope();
            }
        }
    });

    $scope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        console.log("aaa3");
    });

    $scope.$on('Keepalive', function() {
        // do something to keep the user's session alive
        console.log("aaa4");
    });

    $scope.emailType = 'resetpassword';

    $scope.doPostSendPasswordResetEmail = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        if (deploymentEnv == "Single") {
            $scope.userEmailId = $('#UserEmail').val();
        } else {
            $scope.userEmailId = $rootScope.UserEmail;
        }
        if ($scope.userEmailId == '') {

            $scope.ErrorMessage = "Please enter an email!";
            $rootScope.Validation($scope.ErrorMessage);
        } else {

            $scope.ValidateEmail = function(email) {
                //var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };
            if (!$scope.ValidateEmail($scope.userEmailId)) {
                $scope.ErrorMessage = "Please enter a valid email address";
                $rootScope.Validation($scope.ErrorMessage);
            } else {

                if (deploymentEnv == "Single") {
                    if (deploymentEnvLogout == 'Single') {
                        if (deploymentEnvForProduction == 'Production') {
                            if (appStoreTestUserEmail != '' && $("#UserEmail").val() == appStoreTestUserEmail) {
                                //deploymentEnv = "Staging";
                                $rootScope.hospitalId = singleStagingHospitalId;
                                apiCommonURL = 'https://snap-stage.com';
                                api_keys_env = 'Staging';
                                $rootScope.APICommonURL = 'https://snap-stage.com';
                            } else {
                                //deploymentEnv = "Production";
                                $rootScope.hospitalId = singleHospitalId;
                                apiCommonURL = 'https://connectedcare.md';
                                api_keys_env = 'Production';
                                $rootScope.APICommonURL = 'https://connectedcare.md';
                            }
                        } else if (deploymentEnvForProduction == 'Staging') {
                            $rootScope.hospitalId = singleStagingHospitalId;
                            api_keys_env = "Staging";
                        } else if (deploymentEnvForProduction == 'QA') {
                            $rootScope.hospitalId = singleQAHospitalId;
                            api_keys_env = "QA";
                        } else if (deploymentEnvForProduction == 'Sandbox') {
                            $rootScope.hospitalId = singleSandboxHospitalId;
                            api_keys_env = "Sandbox";
                        }
                    }


                    //$rootScope.UserEmail = $('#UserEmail').val();
                    if ($("#squaredCheckbox").prop('checked') == true) {
                        //if ($("input[class=isRemChecked]").is(':checked') == true) {
                        $window.localStorage.setItem('username', $("#UserEmail").val());
                        $window.localStorage.oldEmail = $scope.userLogin.UserEmail;
                        $rootScope.UserEmail = $scope.userLogin.UserEmail;
                        $rootScope.chkedchkbox = true;

                    } else {
                        $rootScope.UserEmail = $scope.userLogin.UserEmail;
                        $window.localStorage.oldEmail = '';
                        $window.localStorage.setItem('username', "");
                        $rootScope.chkedchkbox = false;
                    }
                }

                var params = {
                    patientEmail: $rootScope.UserEmail,
                    emailType: $scope.emailType,
                    hospitalId: $rootScope.hospitalId,
                    accessToken: $rootScope.accessToken,
                    success: function(data) {
                        console.log('dopostsentpass');
                        console.log(data);
                        $scope.PasswordResetEmail = data;
                        $state.go('tab.resetPassword');
                    },
                    error: function(data, status) {
                        if (status == '404') {
                            $scope.ErrorMessage = "Email Address not Found";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status == null) {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $rootScope.serverErrorMessageValidation();
                        }
                    }
                };

                LoginService.postSendPasswordResetEmail(params);
            }

        }
    }

    $scope.goBackFromReset = function() {
        if (deploymentEnv === "Single") {
            $state.go('tab.loginSingle');
        } else {
            $state.go('tab.password');
        }
    }


    $rootScope.doGetTermsandCondition = function(registerRedirectPage, registerCurrentPage) {

        /*if(deploymentEnvLogout == 'Single' && deploymentEnvForProduction =='Production') {
  $rootScope.hospitalId = singleHospitalId;
  apiCommonURL = 'https://connectedcare.md';
  api_keys_env = '';
  $rootScope.APICommonURL = 'https://connectedcare.md';
} else if(deploymentEnvLogout == 'Single') {
$rootScope.hospitalId = singleHospitalId;
}*/

        if (deploymentEnvLogout == 'Single') {
            if (deploymentEnvForProduction == 'Production') {
                if (appStoreTestUserEmail != '' && $("#UserEmail").val() == appStoreTestUserEmail) {
                    //deploymentEnv = "Staging";
                    $rootScope.hospitalId = singleStagingHospitalId;
                    apiCommonURL = 'https://snap-stage.com';
                    api_keys_env = 'Staging';
                    $rootScope.APICommonURL = 'https://snap-stage.com';
                } else {
                    //deploymentEnv = "Production";
                    $rootScope.hospitalId = singleHospitalId;
                    apiCommonURL = 'https://connectedcare.md';
                    api_keys_env = 'Production';
                    $rootScope.APICommonURL = 'https://connectedcare.md';
                }
            } else if (deploymentEnvForProduction == 'Staging') {
                $rootScope.hospitalId = singleStagingHospitalId;
                api_keys_env = "Staging";
            } else if (deploymentEnvForProduction == 'QA') {
                $rootScope.hospitalId = singleQAHospitalId;
                api_keys_env = "QA";
            } else if (deploymentEnvForProduction == 'Sandbox') {
                $rootScope.hospitalId = singleSandboxHospitalId;
                api_keys_env = "Sandbox";
            }
        }

        if ($scope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            documentType: 1,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                //$rootScope.termsandCOnditionsContent = htmlEscapeValue.getHtmlEscapeValue(data.data[0].documentText);
                $rootScope.termsandCOnditionsContent = angular.element('<div>').html(data.data[0].documentText).text();
                $rootScope.registerRedirectPage = registerRedirectPage;
                $rootScope.registerCurrentPage = registerCurrentPage;
                $state.go(registerRedirectPage);

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getConcentToTreat(params);
    }


    //$rootScope.patientId = 471;
    //$rootScope.patientId = 3056;
    //$rootScope.consultationId = 2440;
    //$scope.userId = 471;
    //$scope.userId = 3056;
    //$scope.BillingAddress = '123 chennai';
    //$scope.CardNumber = 4111111111111111;
    //$scope.City = 'chennai';
    //$scope.ExpiryMonth = 8;
    //$scope.ExpiryYear = 2019;
    //$scope.FirstName = 'Rin';
    //$scope.LastName = 'Soft';
    //$scope.State = 'Tamilnadu';
    //$scope.Zip = 91302;
    //$scope.Country = 'US';
    //$scope.Cvv = 123;
    //$scope.profileId = 31867222; medicalconditions, medications, medicationallergies, consultprimaryconcerns, consultsecondaryconcerns, eyecolor, haircolor, ethnicity, bloodtype, relationship, heightunit, weightunit
    $scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns,eyecolor,haircolor,ethnicity,bloodtype,relationship,heightunit,weightunit';




    $rootScope.searchPatientList = {};
    $scope.searched = false;
    //$rootScope.age = 25;

    $scope.$watch('data.searchQuery', function(searchKey) {
        if (searchKey !== '' && typeof searchKey !== 'undefined') {
            $rootScope.patientSearchKey = searchKey;
            var loggedInPatient = {
                'patientFirstName': $rootScope.primaryPatientName,
                'patientLastName': $rootScope.primaryPatientLastName,
                'birthdate': $rootScope.dob,
                'ageBirthDate': $rootScope.ageBirthDate,
                'profileImagePath': $rootScope.PatientImage,
                'patientName': $rootScope.primaryPatientFullName,
                'patientId': $rootScope.primaryPatientId,
                'isAuthorized': true,
                'gender': $rootScope.primaryPatGender,
                'depRelationShip': ''
            };
            if (!$scope.searched) {
                //$rootScope.dependentDetails.push(loggedInPatient);
                $rootScope.RelatedPatientProfiles.splice(0, 0, loggedInPatient);
            }
            $scope.searched = true;
            $rootScope.homeMagnifyDisplay = "none";
        } else {
            if ($scope.searched) {
                $rootScope.RelatedPatientProfiles.shift();
                $scope.searched = false;
                $rootScope.homeMagnifyDisplay = "block";
            }
        }
    })
    $scope.$on("callPatientAndDependentProfiles", function(event, args) {
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('tab.Health');
    });

    $scope.doGetConutriesList = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.serviceCountries = angular.fromJson(data.data);
                $scope.getTimezoneList();
            },
            error: function(data) {

            }
        };
        LoginService.getCountiesList(params);
    }

    $scope.getTimezoneList = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                addGroupingToTimeZone(data.data);
                //  $rootScope.timeZones = angular.fromJson(data.data);
            },
            error: function(data) {

            }
        };
        LoginService.getTimezoneList(params);
    }

    var isDST = function(t) {
        var jan = new Date(t.getFullYear(), 0, 1);
        var jul = new Date(t.getFullYear(), 6, 1);
        return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == t.getTimezoneOffset();
    };

    function addGroupingToTimeZone(data) {
        var x = new Date();
        var displaytz = "GMT";
        var currentTimeZoneOffsetInHours = (x.getTimezoneOffset() / 60);
        if (isDST(x))
            currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours + 1;
        if (currentTimeZoneOffsetInHours > 0) {
            if (currentTimeZoneOffsetInHours < 10)
                displaytz = displaytz + '-0' + currentTimeZoneOffsetInHours;
            else
                displaytz = displaytz + '-' + currentTimeZoneOffsetInHours;
        } else {
            if (currentTimeZoneOffsetInHours < -9)
                displaytz = displaytz + '+0' + currentTimeZoneOffsetInHours * -1;
            else
                displaytz = displaytz + '+' + currentTimeZoneOffsetInHours * -1;
        }

        for (var i = 0; i < data.length; i++) {
            //if (data[i].name.indexOf(displaytz) !== -1) {
            // data[i].tzGroup = "0Your Browser";
            // data[i].tzSort = "0";
            // }
            //else
            if ((data[i].id === 75) || (data[i].id === 80) || (data[i].id === 74) ||
                (data[i].id === 77) || (data[i].id === 82) || (data[i].id === 83) ||
                (data[i].id === 85) || (data[i].id === 86) || (data[i].id === 87)) {
                data[i].tzGroup = "1United States";
                data[i].tzSort = "1";
            } else if ((data[i].id === 2) || (data[i].id === 4)) {
                data[i].tzGroup = "2United Kingdom";
                data[i].tzSort = "2";
            } else {
                data[i].tzGroup = "3Global";
                data[i].tzSort = "3";
            }
        }
        $rootScope.timeZones = $filter('orderBy')(data, ['tzSort', 'id']);
        console.log(data);
    }

    $scope.doGetPatientProfiles = function() {
        $rootScope.primaryPatientDetails = '';
        $rootScope.patientInfomation = '';
        $rootScope.patientAccount = '';
        $rootScope.patientAddresses = '';
        $rootScope.patientAnatomy = '';
        $rootScope.patientPharmacyDetails = '';
        $rootScope.patientPhysicianDetails = '';
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {

                $rootScope.primaryPatientDetails = [];
                //angular.fromJson(index.billingAddress)
                angular.forEach(data.data, function(index, item) {
                    $rootScope.primaryPatientDetails.push({
                        'account': angular.fromJson(index.account),
                        'address': index.address,
                        'addresses': angular.fromJson(index.addresses),
                        'anatomy': angular.fromJson(index.anatomy),
                        'countryCode': index.countryCode,
                        'createDate': index.createDate,
                        'dob': index.dob,
                        'gender': index.gender,
                        'homePhone': index.homePhone,
                        'lastName': index.lastName,
                        'mobilePhone': index.mobilePhone,
                        'patientName': index.patientName,
                        'pharmacyDetails': index.pharmacyDetails,
                        'physicianDetails': index.physicianDetails,
                        'schoolContact': index.schoolContact,
                        'schoolName': index.schoolName
                    });
                });

                $rootScope.patientInfomation = data.data[0];
                $rootScope.patientAccount = data.data[0].account;
                $rootScope.patientAddresses = data.data[0].addresses;
                $rootScope.patientAnatomy = data.data[0].anatomy;
                $rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
                $rootScope.patientPhysicianDetails = data.data[0].physicianDetails;
                //alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
                //$rootScope.PatientImage = ($rootScope.APICommonURL + $rootScope.patientAccount.profileImagePath).replace(new RegExp("\\../","gm"),"/");
                //  if ($rootScope.patientAccount.profileImagePath !== '' && typeof $rootScope.patientAccount.profileImagePath !== 'undefined') {
                $rootScope.PatientImage = $rootScope.patientAccount.profileImagePath;
                /* } else {
      $rootScope.PatientImage = apiCommonURL + '/images/default-user.jpg';
      var ptInitial = getInitialForName($rootScope.patientInfomation.patientName + ' ' + $rootScope.patientInfomation.lastName);
      $rootScope.PatientImage = generateTextImage(ptInitial, $rootScope.brandColor);
    }*/
                $rootScope.address = data.data[0].address;
                $rootScope.city = data.data[0].city;
                $rootScope.createDate = data.data[0].createDate;
                $rootScope.dob = data.data[0].dob;
                $rootScope.PatientAge = $rootScope.dob;
                $rootScope.ageBirthDate = ageFilter.getDateFilter(data.data[0].dob);
                if (typeof data.data[0].gender !== 'undefined') {
                    if (data.data[0].gender === 'F') {
                        $rootScope.primaryPatGender = "Female";
                    } else {
                        $rootScope.primaryPatGender = "Male";
                    }
                    //$rootScope.gender = data.data[0].gender;
                } else {
                    $rootScope.gender = "NA";
                    $rootScope.primaryPatGender = '';
                }
                $rootScope.homePhone = data.data[0].homePhone;
                $rootScope.mobilePhone = data.data[0].mobilePhone;
                if ($rootScope.OrganizationLocation === 'on') {
                    if (typeof data.data[0].location !== 'undefined') {
                        $rootScope.location = data.data[0].location;
                    } else {
                        $rootScope.location = 'N/A';
                    }

                    if (typeof data.data[0].organization !== 'undefined') {

                        $rootScope.organization = data.data[0].organization;
                    } else {
                        $rootScope.organization = 'N/A';
                    }
                }
                $rootScope.primaryPatientName = angular.element('<div>').html(data.data[0].patientName).text();

                $rootScope.userCountry = data.data[0].country;
                if (typeof $rootScope.userCountry === 'undefined') {
                    $rootScope.userCountry = '';
                }
                $rootScope.primaryPatientGuardianName = '';
                $rootScope.state = data.data[0].state;
                $rootScope.zipCode = data.data[0].zipCode;

                $rootScope.primaryPatientId = $rootScope.patientAccount.patientId;
                $scope.doGetPrimaryPatientLastName();
                $rootScope.doGetScheduledConsulatation();

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                }
                //    $rootScope.serverErrorMessageValidation();
                $rootScope.patientInfomation = '';
                $rootScope.patientAccount = '';
                $rootScope.patientAddresses = '';
                $rootScope.patientAnatomy = '';
                $rootScope.patientPharmacyDetails = ''
                $rootScope.patientPhysicianDetails = '';
                //alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
                $rootScope.PatientImage = '';
                $rootScope.address = '';
                $rootScope.city = '';
                $rootScope.createDate = '';
                $rootScope.dob = '';
                $rootScope.ageBirthDate = '';
                $rootScope.gender = '';
                $rootScope.homePhone = '';
                $rootScope.location = '';
                $rootScope.mobilePhone = '';
                $rootScope.organization = '';
                $rootScope.primaryPatientName = '';
                $rootScope.userCountry = '';
                $rootScope.primaryPatientGuardianName = '';
                $rootScope.state = '';
                $rootScope.zipCode = '';
                $rootScope.primaryPatientId = '';
            }
        };

        LoginService.getPatientProfiles(params);
    }

    $scope.doGetPrimaryPatientLastName = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.primaryPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                //$scope.RelatedPatientProfiles = data.data;
                $rootScope.primaryPatientLastNameArray = [];
                angular.forEach(data.data, function(index, item) {
                    $rootScope.primaryPatientLastNameArray.push({
                        'id': index.$id,
                        'patientName': index.patientName,

                        'lastName': htmlEscapeValue.getHtmlEscapeValue(index.lastName),
                        //'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
                        'profileImagePath': index.profileImagePath,
                        'mobilePhone': index.mobilePhone,
                        'homePhone': index.homePhone,
                        'primaryPhysician': index.primaryPhysician,
                        'primaryPhysicianContact': index.primaryPhysicianContact,
                        'physicianSpecialist': index.physicianSpecialist,
                        'physicianSpecialistContact': index.physicianSpecialistContact,
                        'organization': index.organization,
                        'location': index.location,
                    });
                });
                //$rootScope.primaryPatientLastName = $rootScope.primaryPatientLastName[0].lastName;
                if (!angular.isUndefined($rootScope.primaryPatientLastNameArray[0].lastName)) {
                    $rootScope.primaryPatientLastName = angular.element('<div>').html($rootScope.primaryPatientLastNameArray[0].lastName).text();
                } else {
                    $rootScope.primaryPatientLastName = '';
                }


                $rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' ' + $rootScope.primaryPatientLastName;

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPrimaryPatientLastName(params);
    }

    $scope.chkPatientFilledAllRequirements = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.hasRequiredFields = data.data[0].hasRequiredFields;
                $rootScope.currentPatientDetails = data.data;
                if ($rootScope.hasRequiredFields === true) {
                    $scope.doGetPatientProfiles();
                    $scope.doGetRelatedPatientProfiles('tab.userhome');
                } else {
                    $state.go('tab.healthinfo');
                    $rootScope.primaryPatientId = $rootScope.currentPatientDetails[0].profileId;
                    $rootScope.doGetRequiredPatientProfiles($rootScope.currentPatientDetails[0].profileId);
                }

            },
            error: function(data, status) {
                $('#loginPwdVerify').hide();
                $('#loginPwd').show();
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPatientFilledAllRequirements(params);
    }

    $rootScope.doGetRequiredPatientProfiles = function(patientId) {
         $rootScope.PatientImageSelectUser = '';
         $rootScope.PatientImage = '';
         $rootScope.primaryPatientName = '';
         $rootScope.primaryPatientLastName = '';
         $rootScope.dob = '';
         $rootScope.primaryPatGender ='';
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            patientId: patientId,
            success: function(data) {
                $scope.selectedPatientDetails = [];
                //angular.fromJson(index.billingAddress)
                angular.forEach(data.data, function(index, item) {
                    $scope.selectedPatientDetails.push({
                        'account': angular.fromJson(index.account),
                        'address': index.address,
                        'addresses': angular.fromJson(index.addresses),
                        'anatomy': angular.fromJson(index.anatomy),
                        'countryCode': index.countryCode,
                        'createDate': index.createDate,
                        'fieldChangesTrackingDetails': angular.fromJson(index.fieldChangesTrackingDetails),
                        'dob': index.dob,
                        'gender': index.gender,
                        'homePhone': index.homePhone,
                        'lastName': index.lastName,
                        'location': index.location,
                        'locationId': index.locationId,
                        'medicalHistory': angular.fromJson(index.medicalHistory),
                        'mobilePhone': index.mobilePhone,
                        'organization': index.organization,
                        'organizationId': index.organizationId,
                        'patientName': index.patientName,
                        'personId': index.personId,
                        'pharmacyDetails': index.pharmacyDetails,
                        'physicianDetails': index.physicianDetails,
                        'schoolContact': index.schoolContact,
                        'schoolName': index.schoolName
                    });
                });
                $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                /*if (typeof $rootScope.currentPatientDetails[0].account.profileImage != 'undefined' && $rootScope.currentPatientDetails[0].account.profileImage != '') {
                    var hosImage = $rootScope.currentPatientDetails[0].account.profileImage;
                    if (hosImage.indexOf("http") >= 0) {
                        $rootScope.PatientImageSelectUser = hosImage;
                    } else {
                        $rootScope.PatientImageSelectUser = apiCommonURL + hosImage;
                    }
                } else {
                    $rootScope.PatientImageSelectUser = get2CharInString.getProv2Char($rootScope.currentPatientDetails[0].patientName + ' ' + $rootScope.currentPatientDetails[0].lastName);
               }*/
                $rootScope.PatientImageSelectUser = $rootScope.currentPatientDetails[0].account.profileImage;
                $rootScope.PatientImage = $rootScope.PatientImageSelectUser;
                $rootScope.primaryPatientName = $rootScope.currentPatientDetails[0].patientName;
                $rootScope.primaryPatientLastName = $rootScope.currentPatientDetails[0].lastName;
                $rootScope.dob = $rootScope.currentPatientDetails[0].dob;
                //$rootScope.primaryPatGender = $rootScope.currentPatientDetails[0].dob;
                $scope.doGetConutriesList();
                $rootScope.doGetLocations();
                $rootScope.getHealtPageForFillingRequiredDetails();

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getSelectedPatientProfiles(params);
    }


    $scope.doGetRelatedPatientProfiles = function(ReDirectPage) {
        $rootScope.RelatedPatientProfiles = '';
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                //$scope.RelatedPatientProfiles = data.data;

                $rootScope.RelatedPatientProfiles = [];

                angular.forEach(data.data, function(index, item) {
                    /*  var imgDate = new Date();
        if (!index.profileImagePath) {
        var ptInitial = getInitialForName(index.patientName);
        index.profileImagePath = $rootScope.APICommonURL + '/images/default-user.jpg';
        index.profileImagePath = generateTextImage(ptInitial, $rootScope.brandColor);
      } else {
      index.profileImagePath = index.profileImagePath + '?' + imgDate.getTime()
    }*/


                    if (typeof index.gender !== 'undefined') {
                        if (index.gender === 'F') {
                            $scope.patGender = "Female";
                        } else {
                            $scope.patGender = "Male";
                        }
                    } else {
                        $scope.patGender = "NA";
                    }

                    var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                        codeId: index.relationCode
                    })
                    if (getdependRelationShip.length !== 0) {
                        var depRelationShip = getdependRelationShip[0].text;
                    } else {
                        var depRelationShip = '';
                    }

                    $rootScope.RelatedPatientProfiles.push({
                        'id': index.$id,
                        'patientId': index.patientId,
                        'patientName': index.patientName,
                        //'profileImagePath': ($rootScope.APICommonURL + index.profileImagePath).replace(new RegExp("\\../","gm"),"/"),
                        'profileImagePath': index.profileImagePath,
                        'relationCode': index.relationCode,
                        'depRelationShip': depRelationShip,
                        'isAuthorized': index.isAuthorized,
                        'birthdate': index.birthdate,
                        'ageBirthDate': ageFilter.getDateFilter(index.birthdate),
                        'addresses': angular.fromJson(index.addresses),
                        'gender': $scope.patGender,
                        'patientFirstName': angular.element('<div>').html(index.patientFirstName).text(),
                        'patientLastName': angular.element('<div>').html(index.patientLastName).text(),
                        //  'guardianFirstName': angular.element('<div>').html(index.guardianFirstName).text(),
                        //  'guardianLastName': angular.element('<div>').html(index.guardianLastName).text(),
                        //  'guardianName': angular.element('<div>').html(index.guardianName).text(),
                        'personId': index.personId,

                    });
                });
                $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
                $scope.doGetCodesSet();
                if (ReDirectPage == 'tab.userhome') {
                  $('#loginPwdVerify').hide();
                  $('#loginPwd').show();
                    if (deploymentEnv === "Single") {
                        $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme();
                    } else {
                        $state.go('tab.userhome');
                        //$state.go('tab.userAccount');
                    }
                } else {
                    $state.go('tab.healthinfo');
                }


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getRelatedPatientProfiles(params);
    }



    $scope.doGetExistingConsulatation = function() {
        $rootScope.consultionInformation = '';
        $rootScope.appointmentsPatientFirstName = '';
        $rootScope.appointmentsPatientLastName = '';
        $rootScope.appointmentsPatientDOB = '';
        $rootScope.appointmentsPatientGurdianName = '';
        $rootScope.appointmentsPatientImage = '';
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.existingConsultation = data;

                $rootScope.consultionInformation = data.data[0].consultationInfo;
                $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                if (!angular.isUndefined($rootScope.consultationStatusId)) {
                    if ($rootScope.consultationStatusId === 71) {
                        navigator.notification.alert(
                            'Your consultation is already started on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 72) {
                        navigator.notification.alert(
                            'Your consultation is already ended.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 79) {
                        navigator.notification.alert(
                            'Your consultation is cancelled.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 80) {
                        navigator.notification.alert(
                            'Your consultation is in progress on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    }

                }

                $rootScope.patientExistInfomation = data.data[0].patientInformation;
                $rootScope.intakeForm = data.data[0].intakeForm;
                $rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
                $rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
                $rootScope.appointmentsPatientGurdianName = angular.element('<div>').html($rootScope.patientExistInfomation.guardianName).text();
                $rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;

                //$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
                $rootScope.appointmentsPatientImage = $rootScope.patientExistInfomation.profileImagePath;
                $rootScope.reportScreenPrimaryConcern = angular.element('<div>').html($rootScope.intakeForm.concerns[0].customCode.description).text();
                $rootScope.reportScreenSecondaryConcern = angular.element('<div>').html($rootScope.intakeForm.concerns[1].customCode.description).text();
                if ($rootScope.reportScreenSecondaryConcern === "") {

                    $rootScope.reportScreenSecondaryConcern = "None Reported";
                }
                if (typeof $rootScope.consultionInformation.note !== 'undefined') {
                    $rootScope.preConsultantNotes = angular.element('<div>').html($rootScope.consultionInformation.note).text();

                } else {
                    $rootScope.preConsultantNotes = '';
                }
                $scope.doGetExistingPatientName();
                $rootScope.doGetDoctorDetails();

            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getExistingConsulatation(params);

    }

    $scope.doGetExistingPatientName = function() {
        var params = {
            patientId: $rootScope.appointmentsPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.appointmentsPatientFirstName = angular.element('<div>').html(data.data[0].patientName).text();
                $rootScope.appointmentsPatientLastName = angular.element('<div>').html(data.data[0].lastName).text();


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPrimaryPatientLastName(params);
    }

    $rootScope.doGetDoctorDetails = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var params = {
            doctorId: $rootScope.assignedDoctorId,
            accessToken: $rootScope.accessToken,
            success: function(data) {

                //$rootScope.doctorImage = $rootScope.APICommonURL + data.data[0].profileImagePath;
                $rootScope.doctorImage = data.data[0].profileImagePath;
                $state.go('tab.appoimentDetails');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getDoctorDetails(params);

    }

    /*$scope.doGetExistingConsulatationReport = function () {

    $rootScope.appointmentsPatientFirstName = '';
    $rootScope.appointmentsPatientLastName = '';
    $rootScope.appointmentsPatientDOB = '';
    $rootScope.appointmentsPatientGurdianName = '';
    $rootScope.appointmentsPatientImage = '';


    if ($scope.accessToken === 'No Token') {
    alert('No token.  Get token first then attempt operation.');
    return;
    }

    var params = {
    consultationId: $rootScope.consultationId,
    accessToken: $rootScope.accessToken,
    success: function (data) {
    $rootScope.consultReport = data.data[0].details[0];
    $rootScope.reportScreenPrimaryConcern = $rootScope.consultReport.primaryConcern;
    if(typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
    $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
    $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
    } else {
    $rootScope.reportScreenPrimaryConcern = "";
    }
    $rootScope.reportScreenSecondaryConcern = $rootScope.consultReport.secondaryConcern;
    if(typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
    $rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
    $rootScope.reportScreenSecondaryConcern = $rootScope.reportScreenSecondaryConcern1[1];
    } else {
    $rootScope.reportScreenSecondaryConcern = "";
    }
    $rootScope.preConsultantNotes = $rootScope.consultReport.rx;

    //$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
    $rootScope.appointmentsPatientDOB = $rootScope.consultReport.dob;

    $rootScope.appointmentsPatientId = $rootScope.consultReport.patientId;

    //$rootScope.appointmentsPatientGurdianName = $rootScope.consultReport.guardianName;
    if($rootScope.appointmentsPatientId !== $rootScope.primaryPatientId) {
    $rootScope.appointmentsPatientGurdianName = $rootScope.primaryPatientName + ' '+ $rootScope.primaryPatientLastName;
    }

    $rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.consultReport.profileImagePath;
    $rootScope.appointmentsPatientFirstName = $rootScope.consultReport.patientName;
    $rootScope.appointmentsPatientLastName = $rootScope.consultReport.lastName;
    $state.go('tab.appoimentDetails');

    },
    error: function (data) {
    $rootScope.serverErrorMessageValidation();
    }
    };

    LoginService.getConsultationFinalReport(params);
    }*/

    $scope.GetHealthPlanList = function() {
        $scope.doGetPatientHealthPlansList();
    }


    if (typeof $rootScope.providerName === 'undefined' || $rootScope.providerName === "")

    {
        $rootScope.chooseHealthHide = 'initial';
        $rootScope.chooseHealthShow = 'none';
    } else if (typeof $rootScope.providerName !== 'undefined' || $rootScope.providerName !== "") {
        $rootScope.chooseHealthHide = 'none';
        $rootScope.chooseHealthShow = 'initial';
    }

    $rootScope.openAddHealthPlanSection = function() {
        if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on') {
            $rootScope.applyPlanMode = "none";
            $rootScope.chooseHealthHide = 'initial';
            $rootScope.chooseHealthShow = 'none';
            $rootScope.verifyPlanMode = "block";
        } else {
            $rootScope.applyPlanMode = "block";
            $rootScope.verifyPlanMode = "none";
        }
        $rootScope.consultChargeNoPlanPage = "none";
        //$rootScope.verifyHealthPlanPage = "none";
        //  $rootScope.consultChargeSection = "block";
        //  $rootScope.healthPlanSection = "block";
        $rootScope.healthPlanPage = "block";
        $rootScope.chooseHealthHide = 'initial';
        $rootScope.chooseHealthShow = 'none';
        $rootScope.providerName = "";
        $rootScope.PolicyNo = "";
        $scope.doGetPatientHealthPlansList();
    }

    $scope.openVerifyInsuranceSection = function() {

        //  $rootScope.consultChargeSection = "none";
        //  $rootScope.healthPlanSection = "block";
        $rootScope.verifyHealthPlanPage = "block";
        $rootScope.healthPlanPage = "none";
        $rootScope.consultChargeNoPlanPage = "none";
        $rootScope.chooseHealthHide = 'initial';
        $rootScope.chooseHealthShow = 'none';
        $rootScope.providerName = "";
        $rootScope.PolicyNo = "";
        $scope.doGetPatientHealthPlansList();
    }


    $scope.doGetPatientHealthPlansList = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                //$scope.patientHealthPlanList = data;


                //    if (data.data !== '') {
                if (data.data != 0) {
                    $rootScope.patientHealthPlanList = [];
                    angular.forEach(data.data, function(index, item) {
                        $rootScope.patientHealthPlanList.push({
                            'id': index.$id,
                            'healthPlanId': index.healthPlanId,
                            'familyGroupId': index.familyGroupId,
                            'patientId': index.patientId,
                            'insuranceCompany': index.insuranceCompany,
                            'isDefaultPlan': index.isDefaultPlan,
                            'insuranceCompanyPhone': index.insuranceCompanyPhone,
                            'memberName': index.memberName,
                            'subsciberId': index.subsciberId,
                            'payerId': index.payerId,
                            'policyNumberLong': index.policyNumber,
                            'policyNumber': index.policyNumber.substring(index.policyNumber.length - 4, index.policyNumber.length),
                        });
                    });




                    if ($rootScope.currState.$current.name === "tab.consultCharge")

                    {
                        $rootScope.enableAddHealthPlan = "block";
                        $rootScope.disableAddHealthPlan = "none;";
                        //  $rootScope.consultChargeSection = "none";
                        //  $rootScope.healthPlanSection = "block";
                        //$state.go('tab.addHealthPlan');
                    } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                        //$rootScope.ApplyPlanPatientHealthPlanList =  $rootScope.patientHealthPlanList;
                        //    $rootScope.consultChargeSection = "none";
                        $rootScope.disableAddHealthPlan = "none";
                        //  $rootScope.healthPlanSection = "block";
                        $rootScope.enableAddHealthPlan = "block";
                        $state.go('tab.consultCharge');

                    }
                } else {
                    if ($rootScope.currState.$current.name === "tab.consultCharge") {
                        $rootScope.enableAddHealthPlan = "none";
                        $rootScope.disableAddHealthPlan = "block;";
                        //    $rootScope.consultChargeSection = "none";
                        //  $rootScope.healthPlanSection = "block";
                        //$state.go('tab.addHealthPlan');
                    } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                        //  $rootScope.consultChargeSection = "none";
                        //  $rootScope.healthPlanSection = "block";
                        $state.go('tab.consultCharge');
                    }
                }


            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPatientHealthPlansList(params);

    }

    /* country and State */

    $rootScope.StateText = "Select your state";

    //Start Open Country List popup
    $scope.loadCountriesList = function() {

        $ionicModal.fromTemplateUrl('templates/tab-CountryList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        //$rootScope.CountryLists = CountryList.getCountryDetails();
    };

    // Onchange of Contries
    $scope.OnSelectContryData = function(CountriesList, items) {
        angular.forEach(CountriesList, function(item, index) {
            if (item.Name === items.Name) {
                item.checked = true;
                $rootScope.SelectedCountry = {
                    'CountryName': items.Name,
                    'CountryCode': items.CountryCodes.iso2,
                };
            } else {
                item.checked = false;
            }
        });
    };

    $scope.closeCountryList = function() {
        $rootScope.SelectedCountry;
        $scope.modal.hide();
        //$scope.data.searchCountry = '';
    };
    //End Countries

    //Start Open State List popup
    $scope.loadStateList = function(CountryCode) {
        $ionicModal.fromTemplateUrl('templates/tab-StateList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        $rootScope.CountryCode = CountryCode;
    };
    $scope.stateList = '';




    $scope.StateSelect = function($a) {
        if ($a.length >= 3) {

            $timeout(function() {
                var params = {
                    SearchKeys: $a,
                    CountryCode: $rootScope.CountryCode
                };
                //$rootScope.stateList = StateList.getStateDetails(params);
                var config = {
                    'params': {
                        'callback': 'JSON_CALLBACK'
                    }
                };

                var googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?callback=angular.callbacks._&input=' + $a + '&types=(cities)&language=en&components=country:' + $rootScope.CountryCode + '&key=AIzaSyCjq4bTUhjvIxSFJBA6Ekk3DPdA_VrU9Zs';

                var googlePlacesResponsePromise = $http.jsonp(googlePlacesUrl, {
                    'params': {
                        'callback': 'JSON_CALLBACK'
                    }
                });

                googlePlacesResponsePromise.success(function(data, status, headers, config) {
                    $rootScope.stateList = JSON.stringify(data);
                });

                googlePlacesResponsePromise.error(function(data, status, headers, config) {
                    alert("AJAX failed");
                });

            }, 1000);

            console.log($rootScope.stateList);
        } else {
            $rootScope.stateList = {};
        }
    };

    $scope.closeStateList = function() {
        $rootScope.stateList;
        $rootScope.stateList;
        $scope.modal.hide();
    };
    //End State


    $scope.CountryChange = function() {
            if ($('#country').val() === 'US') {
                $rootScope.StateList = {};
                $rootScope.StateList = StateLists.getStateDetails();
                $rootScope.StateText = "Select your state";
            } else if ($('#country').val() === 'UK') {
                $rootScope.StateList = {};
                $rootScope.StateList = UKStateList.getUkStateDetails();
                $rootScope.StateText = "Select your County";
            } else {
                $rootScope.StateText = "Select your state";
                $rootScope.StateList = StateLists.getStateDetails();
            }
            $timeout(function() {
                $('select option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);

        }
        /* country and State */

    $("#addHealthPlan").change(function() {
        //console.log( $('option:selected', this).text() );
        if ($('option:selected', this).text() === 'Add a new health plan') {
            if ($rootScope.accessToken === 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            $rootScope.submitPayBack = $rootScope.currState.$current.name;
            $scope.doGetHealthPlanProvider();
            // $state.go('tab.planDetails');
        } else {
            $('div.viewport').text($("option:selected", this).text());
        }
    });


    /*$scope.getDOBDiv = function() {
    //  $('div.dobRequired').text($(".userDateofbirth").val());
    alert('ggg');
    $('.dobRequired').css('display', 'none');
    $('.userDateofbirth').css('display', 'block');
    }

    $('#addHealthPlan').change(function () {
    if($('option:selected', this).text() === 'Add a new health plan') {
    $rootScope.submitPayBack = $rootScope.currState.$current.name;
    $state.go('tab.planDetails');
    } else {
    $('div.viewport').text($("option:selected", this).text());
    }
    }); */

    $scope.doGetHealthPlanProvider = function() {
        $rootScope.HealthPlanProvidersList = [];
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.HealthPlanProvidersList = data.data;
                // $('.dobRequired').css('display', 'block');
                //$('.userDateofbirth').css('display', 'none');

                if (data !== "")

                    $rootScope.ProviderList = [];
                angular.forEach($scope.HealthPlanProvidersList, function(index, item) {
                    $rootScope.ProviderList.push({
                        'id': index.id,
                        'payerId': index.payerId,
                        'payerName': index.payerName,

                    });
                });
                $state.go('tab.planDetails');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getHealthPlanProvidersList(params);
    }



    $scope.AddHealth = {};
    $scope.doPostNewHealthPlan = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var HealthPlanProviders = $scope.AddHealth.Provider.split("@");
        $scope.insuranceCompany = HealthPlanProviders[0];
        $scope.insuranceCompanyNameId = HealthPlanProviders[1];
        $scope.payerId = HealthPlanProviders[2];
        $scope.ProviderId = HealthPlanProviders[3];
        //$scope.healthPlanID = $scope.ProviderId;
        // console.log($scope.healthPlanID);
        //End
        $rootScope.providerName = HealthPlanProviders[0];
        $rootScope.PolicyNo = $scope.AddHealth.policyNumber;
        $rootScope.healthPlanID = HealthPlanProviders[1];


        if (typeof $rootScope.patientHealthPlanList !== 'undefined') {

            var subsciberNewID = $rootScope.patientHealthPlanList.length + 1;
        } else {
            var subsciberNewID = 1;
        }

        $scope.insuranceCompany = $scope.insuranceCompany;
        $scope.insuranceCompanyNameId = $scope.insuranceCompanyNameId;
        $scope.isDefaultPlan = 'Y';
        $scope.insuranceCompanyPhone = '8888888888';
        $scope.memberName = $scope.AddHealth.firstName + $scope.AddHealth.lastName;
        $scope.subsciberId = subsciberNewID // patient id
        $scope.policyNumber = $scope.AddHealth.policyNumber; //P20
        $scope.subscriberFirstName = $scope.AddHealth.firstName;
        $scope.subscriberLastName = $scope.AddHealth.lastName;
        $scope.subscriberDob = $scope.AddHealth.dateBirth;
        $scope.isActive = 'A';
        $scope.payerId = $scope.payerId;

        var params = {
            accessToken: $rootScope.accessToken,
            healthPlanID: $rootScope.healthPlanID,
            PatientId: $rootScope.patientId,
            insuranceCompany: $scope.insuranceCompany,
            insuranceCompanyNameId: $scope.insuranceCompanyNameId,
            isDefaultPlan: $scope.isDefaultPlan,
            insuranceCompanyPhone: $scope.insuranceCompanyPhone,
            memberName: $scope.memberName,
            subsciberId: $scope.subsciberId,
            policyNumber: $scope.policyNumber,
            subscriberFirstName: $scope.subscriberFirstName,
            subscriberLastName: $scope.subscriberLastName,
            subscriberDob: $scope.subscriberDob,
            isActive: $scope.isActive,
            payerId: $scope.payerId,
            success: function(data) {
                $scope.NewHealthPlan = data;
                if ($scope.NewHealthPlan.healthPlanID !== '') {
                    $rootScope.healthPlanID = data.healthPlanID;
                    $scope.doGetPatientHealthPlansList();
                } else {
                    $scope.ErrorMessage = data.message;
                    $rootScope.Validation($scope.ErrorMessage);
                    $state.go('tab.planDetails');
                }
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.postNewHealthPlan(params);
    }

    $scope.goCardDetailsPage = function() {
        $rootScope.cardPage = "consultCharge";
        $state.go('tab.cardDetails');
    }
    $scope.goCardDetailsPageFromAddCard = function() {
        $rootScope.cardPage = "addCard";
        $state.go('tab.cardDetails');
    }


    $("#addNewCard").change(function() {
        console.log($('option:selected', this).text());
        if ($('option:selected', this).text() === 'Add a new card') {
            $rootScope.submitPayBack = $rootScope.currState.$current.name;
            console.log($rootScope.submitPayBack);
            $rootScope.cardPage = "consultCharge";
            $state.go('tab.cardDetails');
        } else {
            $('div.cardViewport').text($("option:selected", this).text());
        }
    });

    $("#addNewCard_addCard").change(function() {
        console.log($('option:selected', this).text());
        if ($('option:selected', this).text() === 'Add a new card') {
            $rootScope.submitPayBack = $rootScope.currState.$current.name;
            console.log($rootScope.submitPayBack);
            $rootScope.cardPage = "addCard";
            $state.go('tab.cardDetails');
        } else {
            $('div.cardViewport').text($("option:selected", this).text());
        }
    });

    $("#addNewCard_submitPay").change(function() {
        console.log($('option:selected', this).text());
        if ($('option:selected', this).text() === 'Add a new card') {
            $rootScope.submitPayBack = $rootScope.currState.$current.name;
            console.log($rootScope.submitPayBack);
            $rootScope.cardPage = "submitPayment";
            $state.go('tab.cardDetails');
        } else {
            $('div.cardViewport').text($("option:selected", this).text());
        }
    });

    $scope.GetConsultChargeNoPlan = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {
        //$("#aaaa").addClass('animated ' + 'slideInUp');
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $rootScope.BackPage = P_Page;
        $rootScope.copayAmount = $rootScope.consultationAmount;
        //  $rootScope.consultChargeSection = "none";
        //  $rootScope.healthPlanSection = "block";
        $rootScope.healthPlanPage = "none";
        $rootScope.consultChargeNoPlanPage = "block";
        //$state.go('tab.consultChargeNoPlan');
    }

    $scope.showConsultChargeNoPlan = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $rootScope.BackPage = P_Page;
        $rootScope.copayAmount = $rootScope.consultationAmount;
        $rootScope.healthPlanPage = "none";
        $rootScope.consultChargeNoPlanPage = "block";
        //$state.go('tab.consultChargeNoPlan');
    }

    $scope.backAddHealthPlan = function() {
        if ($rootScope.healthPlanPage === "block") {
            $state.go('tab.consultCharge');
        } else {
            $rootScope.healthPlanPage = "block";
            $rootScope.consultChargeNoPlanPage = "none";
        }

    }

    $scope.backConsultCharge = function() {
        if (($rootScope.insuranceMode !== 'on' && $rootScope.paymentMode === 'on') || ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on')) {
            $state.go('tab.ConsentTreat');
        } else if ($rootScope.healthPlanPage === "block") {
            $state.go('tab.ConsentTreat');
        } else if ($rootScope.consultChargeNoPlanPage === "block") {
            $rootScope.consultChargeNoPlanPage = "none";
            $rootScope.healthPlanPage = "block";
            //  $rootScope.consultChargeSection = "block";
        }

    }

    $scope.goToNextPage = function() {
        $state.go($rootScope.BackPage);
    }

    $scope.goToPreviosPage = function() {
        /*if($rootScope.submitPayBack==="tab.addCard") {
  $state.go('tab.applyPlan');
} else {
$state.go('tab.consultCharge');
}*/
        //$rootScope.consultChargeSection = "block";
        // $rootScope.healthPlanSection = "none";
        $rootScope.consultChargeNoPlanPage = "none";
        $rootScope.healthPlanPage = "block";
        $state.go('tab.' + $rootScope.cardPage);
    }

    /*
    $scope.doGetPatientPaymentProfilesCardDetails = function () {
    if ($scope.accessToken === 'No Token') {
    alert('No token.  Get token first then attempt operation.');
    return;
    }
    var params = {
    hospitalId: $rootScope.hospitalId,
    patientId: $rootScope.patientId,
    accessToken: $rootScope.accessToken,
    success: function (data) {
    if(data !== '') {

    $rootScope.PaymentProfile = [];
    $rootScope.patientprofileID = data.data.profileID;

    $rootScope.PaymentDetailsList = data.data.paymentProfiles;
    $rootScope.SelectedPaymentDetails = $rootScope.PaymentDetailsList[data.data.paymentProfiles.length - 1];


    $rootScope.PaymentDetailsList.push({
    'cardNumber': 'Add a new card'
    });

    angular.forEach(data.data.paymentProfiles, function(index, item) {
    $rootScope.PaymentProfile.push({
    'id': index.$id,
    'billingAddress': angular.fromJson(index.billingAddress),
    'cardExpiration': index.cardExpiration,
    'cardNumber': index.cardNumber,
    'isBusiness': index.isBusiness,
    'profileID': index.profileID,
    });
    });
    $rootScope.enableSubmitpayment = "block";
    $rootScope.disableSubmitpayment = "none;";
    $state.go('tab.submitPayment');
    } else {
    $rootScope.enableSubmitpayment = "none";
    $rootScope.disableSubmitpayment = "block;";
    $state.go('tab.submitPayment');
    }

    },
    error: function (data) {
    $rootScope.serverErrorMessageValidation();
    }
    };

    LoginService.getPatientPaymentProfile(params);

    }*/

    //Come to this issues : value="? undefined:undefined ?". Use this following Function //
    $timeout(function() {
        $('select option').filter(function() {
            return this.value.indexOf('?') >= 0;
        }).remove();
    }, 100);
    //value="? undefined:undefined ?"//

    $scope.Health = {};
    $scope.doPostApplyHealthPlan = function() {
        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $scope.Choose = 'false';
        console.log($scope.Health.addHealthPlan);

        if ($rootScope.currState.$current.name === "tab.applyPlan") {
            if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                $rootScope.NewHealth = $scope.Health.addHealthPlan;
                $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                $rootScope.providerName = healthInsurance[0];
                $rootScope.PolicyNo = healthInsurance[1];
                $rootScope.healthPlanID = healthInsurance[2];
                //$rootScope.providerName   =  InsuranceCompany;


            } else if (typeof $scope.Health.addHealthPlan === 'undefined') {

                $rootScope.providerName = $rootScope.providerName;
                $rootScope.PolicyNo = $rootScope.PolicyNo;
                $rootScope.healthPlanID = $rootScope.healthPlanID;
                //$rootScope.providerName   =  InsuranceCompany;

            }
        }


        if ($rootScope.currState.$current.name === "tab.consultCharge") {
            if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                if ($scope.Health.addHealthPlan !== 'Choose Your Health Plan') {

                    $rootScope.NewHealth = $scope.Health.addHealthPlan;
                    $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                    var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                    $rootScope.providerName = healthInsurance[0];
                    $rootScope.PolicyNo = healthInsurance[1];
                    $rootScope.healthPlanID = healthInsurance[2];
                } else {
                    $rootScope.NewHealth = "";
                    $rootScope.providerName = "";
                    $rootScope.PolicyNo = "";
                    $rootScope.healthPlanID = "";
                }
                //$rootScope.providerName   =  InsuranceCompany;
            }
            if (typeof $scope.Health.addHealthPlan === 'undefined' || $scope.Health.addHealthPlan === 'Choose Your Health Plan') {
                if ($rootScope.NewHealth === "" && $rootScope.providerName === "") {
                    $scope.Choose = 'true';
                } else {
                    if ($rootScope.NewHealth !== "") {
                        if ($rootScope.providerName !== '') {
                            $rootScope.providerName = $rootScope.providerName;
                            $rootScope.PolicyNo = $rootScope.PolicyNo;
                            $rootScope.healthPlanID = $rootScope.healthPlanID;
                        } else {
                            $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                            var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                            $rootScope.providerName = healthInsurance[0];
                            $rootScope.PolicyNo = healthInsurance[1];
                            $rootScope.healthPlanID = healthInsurance[2];
                        }
                    } else {
                        $rootScope.providerName = $rootScope.providerName;
                        $rootScope.PolicyNo = $rootScope.PolicyNo;
                        $rootScope.healthPlanID = $rootScope.healthPlanID;
                    }
                }

            } else {

                $rootScope.NewHealth;
                $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                var healthInsurance = $rootScope.SelectedHealthPlans.split('@');

                $rootScope.providerName = healthInsurance[0];
                $rootScope.PolicyNo = healthInsurance[1];
                $rootScope.healthPlanID = healthInsurance[2];
                // $rootScope.providerName   =  InsuranceCompany;
            }

        }
        if ($scope.Choose !== 'true') {
            var params = {
                accessToken: $rootScope.accessToken,
                insuranceCompanyName: $rootScope.providerName,
                policyNumber: $rootScope.PolicyNo,
                consultationId: $rootScope.consultationId,
                healthPlanId: $rootScope.healthPlanID,
                success: function(data) {
                    if (!data.message) {
                        $scope.ApplyHealthPlan = data;
                        $rootScope.copayAmount = data.copayAmount;
                        if ($rootScope.consultationAmount > $rootScope.copayAmount) {
                            $rootScope.PlanCoversAmount = $rootScope.consultationAmount - $rootScope.copayAmount;
                        } else {
                            $rootScope.PlanCoversAmount = '';
                        }
                        console.log($scope.ApplyHealthPlan);
                        $rootScope.doGetPatientPaymentProfiles();
                        $state.go('tab.addCard');
                    } else {
                        if ($scope.Health.addHealthPlan !== '') {
                            $scope.ErrorMessage = "Bad Request Please check it";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.ErrorMessages = "Choose Your Health Plan";
                            $rootScope.Validation($scope.ErrorMessages);
                        }
                    }


                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidationForHealthPlanApply();
                }
            };
        } else {
            $scope.ErrorMessages = "Choose Your Health Plan";
            $rootScope.Validation($scope.ErrorMessages);
        }

        LoginService.postApplyHealthPlan(params);
    }

    $scope.doPostVerifyHealthPlan = function() {


        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $scope.Choose = 'false';
        console.log($scope.Health.addHealthPlan);



        if ($rootScope.currState.$current.name === "tab.consultCharge") {
            if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                if ($scope.Health.addHealthPlan !== 'Choose Your Health Plan') {

                    $rootScope.NewHealth = $scope.Health.addHealthPlan;
                    $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                    var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                    $rootScope.providerName = healthInsurance[0];
                    $rootScope.PolicyNo = healthInsurance[1];
                    $rootScope.healthPlanID = healthInsurance[2];
                } else {
                    $rootScope.NewHealth = "";
                    $rootScope.providerName = "";
                    $rootScope.PolicyNo = "";
                    $rootScope.healthPlanID = "";
                }
                //$rootScope.providerName   =  InsuranceCompany;
            }
            if (typeof $scope.Health.addHealthPlan === 'undefined' || $scope.Health.addHealthPlan === 'Choose Your Health Plan') {
                if ($rootScope.NewHealth === "" && $rootScope.providerName === "") {
                    $scope.Choose = 'true';
                } else {
                    if ($rootScope.NewHealth !== "") {
                        if ($rootScope.providerName !== '') {
                            $rootScope.providerName = $rootScope.providerName;
                            $rootScope.PolicyNo = $rootScope.PolicyNo;
                            $rootScope.healthPlanID = $rootScope.healthPlanID;
                        } else {
                            $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                            var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                            $rootScope.providerName = healthInsurance[0];
                            $rootScope.PolicyNo = healthInsurance[1];
                            $rootScope.healthPlanID = healthInsurance[2];
                        }
                    } else {
                        $rootScope.providerName = $rootScope.providerName;
                        $rootScope.PolicyNo = $rootScope.PolicyNo;
                        $rootScope.healthPlanID = $rootScope.healthPlanID;
                    }
                }

            } else {

                $rootScope.NewHealth;
                $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                var healthInsurance = $rootScope.SelectedHealthPlans.split('@');

                $rootScope.providerName = healthInsurance[0];
                $rootScope.PolicyNo = healthInsurance[1];
                $rootScope.healthPlanID = healthInsurance[2];
                // $rootScope.providerName   =  InsuranceCompany;
            }

        }
        if ($scope.Choose !== 'true') {
            var params = {
                accessToken: $rootScope.accessToken,
                insuranceCompanyName: $rootScope.providerName,
                policyNumber: $rootScope.PolicyNo,
                consultationId: $rootScope.consultationId,
                healthPlanId: $rootScope.healthPlanID,
                success: function(data) {
                    console.log(data);
                    $scope.doGetSkipHealthPlan();
                },
                error: function(data) {
                    //$rootScope.serverErrorMessageValidationForHealthPlanVerify();
                    $scope.doGetSkipHealthPlan();
                }
            };
        } else {
            $scope.ErrorMessages = "Choose Your Health Plan";
            $rootScope.Validation($scope.ErrorMessages);
        }

        LoginService.postVerifyHealthPlan(params);
    }


    $scope.doGetSkipHealthPlan = function() {


        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var params = {
            accessToken: $rootScope.accessToken,
            insuranceCompanyName: $rootScope.providerName,
            policyNumber: $rootScope.PolicyNo,
            consultationId: $rootScope.consultationId,
            healthPlanId: $rootScope.healthPlanID,
            success: function(data) {
                console.log(data);
                $rootScope.enablePaymentSuccess = "none";
                $rootScope.enableCreditVerification = "none";
                $rootScope.enableInsuranceVerificationSuccess = "block";
                $state.go('tab.receipt');
                $scope.ReceiptTimeout();

            },
            error: function(data) {
                //$rootScope.serverErrorMessageValidation();
                $rootScope.enablePaymentSuccess = "none";
                $rootScope.enableCreditVerification = "none";
                $rootScope.enableInsuranceVerificationSuccess = "block";
                $state.go('tab.receipt');
                $scope.ReceiptTimeout();
            }
        };

        LoginService.postSkipHealthPlan(params);
    }




    $rootScope.doGetPatientPaymentProfiles = function() {


        if ($scope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var params = {
            hospitalId: $rootScope.hospitalId,
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data !== '') {
                    if (data.data[0].paymentProfiles.length !== 0) {

                        $rootScope.patientprofileID = data.data[0].profileID;

                        $rootScope.PaymentProfile = [];

                        angular.forEach(data.data[0].paymentProfiles, function(index, item) {


                            $rootScope.PaymentProfile.push({
                                'id': index.$id,
                                'billingAddress': angular.fromJson(index.billingAddress),
                                'cardExpiration': index.cardExpiration,
                                'cardNumber': replaceCardNumber.getCardNumber(index.cardNumber),
                                'isBusiness': index.isBusiness,
                                'profileID': index.profileID,
                            });
                        });
                        $rootScope.totalPaymentCard = $rootScope.PaymentProfile.length;

                        $rootScope.enableSubmitpayment = "block";
                        $rootScope.disableSubmitpayment = "none";
                        $rootScope.enablePaymentSuccess = "block";
                        $rootScope.enableCreditVerification = "none";
                        if ($rootScope.copayAmount !== 0) {
                            $rootScope.enableSubmitpaymentAddCard = "block";
                            $rootScope.disableSubmitpaymentAddCard = "none";
                            $rootScope.continueAddCard = "none";
                            $rootScope.textAddCard = "block";
                        } else {
                            $rootScope.enableSubmitpaymentAddCard = "none";
                            $rootScope.disableSubmitpaymentAddCard = "none";
                            $rootScope.continueAddCard = "block";
                            $rootScope.textAddCard = "none";
                        }
                        //$state.go('tab.addCard');
                    } else if (data.data[0].paymentProfiles.length === 0) {
                        $rootScope.enableSubmitpayment = "none";
                        $rootScope.disableSubmitpayment = "block";
                        if ($rootScope.copayAmount !== 0) {
                            $rootScope.enableSubmitpaymentAddCard = "none";
                            $rootScope.disableSubmitpaymentAddCard = "block;";
                            $rootScope.continueAddCard = "none";
                            $rootScope.textAddCard = "block";
                        } else {
                            $rootScope.enableSubmitpaymentAddCard = "none";
                            $rootScope.disableSubmitpaymentAddCard = "none";
                            $rootScope.continueAddCard = "block";
                            $rootScope.textAddCard = "none";
                        }
                        //$state.go('tab.addCard');
                    }
                } else {
                    $rootScope.enableSubmitpayment = "none";
                    $rootScope.disableSubmitpayment = "block";
                    if ($rootScope.copayAmount !== 0) {
                        $rootScope.enableSubmitpaymentAddCard = "none";
                        $rootScope.disableSubmitpaymentAddCard = "block;";
                        $rootScope.continueAddCard = "none";
                        $rootScope.textAddCard = "block";
                    } else {
                        $rootScope.enableSubmitpaymentAddCard = "none";
                        $rootScope.disableSubmitpaymentAddCard = "none";
                        $rootScope.continueAddCard = "block";
                        $rootScope.textAddCard = "none";
                    }
                }

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPatientPaymentProfile(params);
    }

    $scope.doPostClearHealthPlan = function() {
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            healthPlanID: $rootScope.healthPlanID,
            InsuranceCompanyName: $rootScope.providerName,
            PolicyNumber: $rootScope.PolicyNo,
            ConsultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $state.go('tab.userhome');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.postClearHealthPlan(params);
    }

    $scope.cancelConsultation = function() {
        navigator.notification.confirm(
            'Are you sure that you want to cancel this consultation?',
            function(index) {
                if (index === 1) {

                } else if (index === 2) {
                    $state.go('tab.userhome');
                }
            },

            $rootScope.alertMsgName, ['No', 'Yes']
        );
    }

    $scope.cancelConsultationForHealthPlan = function() {
        navigator.notification.confirm(
            'Are you sure that you want to cancel this consultation?',
            function(index) {
                if (index === 1) {

                } else if (index === 2) {
                    $scope.doPostClearHealthPlan();
                }
            },

            $rootScope.alertMsgName, ['No', 'Yes']
        );
    }

    $scope.doGetReceipt = function() {
        $rootScope.enablePaymentSuccess = "none";
        $rootScope.enableCreditVerification = "none";
        $state.go('tab.receipt');
        $scope.ReceiptTimeout();
    }



    $rootScope.verifyCardDisplay = "none";
    $rootScope.cardDisplay = "inherit;";
    $rootScope.planverify = "inherit";
    $scope.getCardDetails = {};

    $scope.ccCvvLength = 3;
    $scope.$watch('getCardDetails.CardNumber', function(cardNumber) {
        var ccn1 = String(cardNumber).substr(0, 1);
        if (typeof cardNumber !== "undefined") {
            if (ccn1 === 3) {
                $scope.ccCvvLength = 4;
            } else {
                $scope.ccCvvLength = 3;
                /*  if ($scope.getCardDetails.Cvv.length > 0) {
      $scope.getCardDetails.Cvv = String($scope.getCardDetails.Cvv).substr(0, 3);
    }*/
            }
        }
    });

    $scope.doPostPaymentProfileDetails = function() {

        /*$scope.BillingAddress = '123 chennai';
        $scope.CardNumber = 4111111111111111;
        $scope.City = 'chennai';
        $scope.ExpiryMonth = 8;
        $scope.ExpiryYear = 2019;
        $scope.FirstName = 'Rin';
        $scope.LastName = 'Soft';
        $scope.State = 'Tamilnadu';
        $scope.Zip = 91302;
        $scope.Country = 'US';
        $scope.Cvv = 123;*/

        var zipCount = $('#Zip').val().length;
        //var ExpiryDate = $('#ExpireDate').val().split("/");

        var currentTime = new Date()
        var ExpiryDateCheck = new Date();
        //var CurrentDate = $filter('date')(currentTime, 'MM-dd-yyyy').split("-");

        ExpiryDateCheck.setFullYear($scope.getCardDetails.CardExpireDatesYear, $scope.getCardDetails.CardExpireDatesMonth, 1);

        $rootScope.FirstName = $scope.getCardDetails.FirstName;
        $rootScope.LastName = $scope.getCardDetails.LastName;
        $rootScope.CardNumber = $scope.getCardDetails.CardNumber;
        $rootScope.ccexpiry = $scope.getCardDetails.CardExpireDates;
        $rootScope.Cvv = $scope.getCardDetails.Cvv;
        $rootScope.BillingAddress = $scope.getCardDetails.BillingAddress;
        $rootScope.City = $scope.getCardDetails.City;
        $rootScope.State = $scope.getCardDetails.State;
        $rootScope.Zip = $scope.getCardDetails.CardZipCode;
        $rootScope.ExpiryMonth = $scope.getCardDetails.CardExpireDatesMonth;
        $rootScope.ExpiryYear = $scope.getCardDetails.CardExpireDatesYear;
        $scope.Country = $scope.getCardDetails.Country;



        if ($('#FirstName').val() === '' || $('#LastName').val() === '' || $('#CardNumber').val() === '' || $('#datepicker').val() === '' || $('#Cvv').val() === '' ||
            $('#BillingAddress').val() === '' || $('#City').val() === '' || $('#State').val() === '' || $('#Zip').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if (!CreditCardValidations.validCreditCard($rootScope.CardNumber)) {
            $scope.invalidZip = "";
            $scope.invalidMonth = "";
            $scope.invalidCVV = "";
            $scope.invalidCard = "border: 1px solid red;max-width:50%;";
            $scope.ErrorMessage = "Invalid Card Number";
            $rootScope.Validation($scope.ErrorMessage);
        } else if (ExpiryDateCheck < currentTime) {
            $scope.invalidZip = "";
            $scope.invalidCard = "";

            $scope.invalidCVV = "";
            $scope.invalidMonth = "border: 1px solid red;";
            $scope.ErrorMessage = "Invalid Expiry Month";

            $rootScope.Validation($scope.ErrorMessage);
        } else if ($rootScope.Cvv.length !== $scope.ccCvvLength) {
            $scope.invalidZip = "";
            $scope.invalidMonth = "";
            $scope.invalidCard = "";
            $scope.invalidCVV = "border: 1px solid red;";
            $scope.ErrorMessage = "Security code must be " + $scope.ccCvvLength + " numbers";
            $rootScope.Validation($scope.ErrorMessage);
        } else if (zipCount <= 4) {
            $scope.invalidMonth = "";
            $scope.invalidCard = "";
            $scope.invalidCVV = "";
            $scope.invalidZip = "border: 1px solid red;";
            $scope.ErrorMessage = "Verify Zip";
            $rootScope.Validation($scope.ErrorMessage);
        } else {

            if ($scope.accessToken === 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            $scope.invalidZip = "";
            $scope.invalidMonth = "";
            $scope.invalidCard = "";
            $scope.invalidCVV = "";

            $rootScope.cardDisplay = "none;";
            $rootScope.verifyCardDisplay = "inherit";
            $rootScope.planverify = "0.3";
            var params = {
                EmailId: $rootScope.UserEmail,
                BillingAddress: $rootScope.BillingAddress,
                CardNumber: $rootScope.CardNumber,
                City: $rootScope.City,
                ExpiryMonth: $rootScope.ExpiryMonth,
                ExpiryYear: $rootScope.ExpiryYear,
                FirstName: $rootScope.FirstName,
                LastName: $rootScope.LastName,
                State: $rootScope.State,
                Zip: $rootScope.Zip,
                Country: $scope.Country,
                ProfileId: $rootScope.patientprofileID,
                Cvv: $rootScope.Cvv,
                accessToken: $rootScope.accessToken,

                success: function(data) {
                    $scope.PostPaymentDetails = data;



                    //if(data.message === "Success")	{

                    $rootScope.userCardDetails = data.data[0].paymentProfileId;
                    if (typeof $rootScope.CardNumber === 'undefined') {
                        $rootScope.choosePaymentShow = 'none';
                        $rootScope.choosePaymentHide = 'initial';
                    } else if (typeof $rootScope.CardNumber !== 'undefined') {
                        $rootScope.choosePaymentShow = 'initial';
                        $rootScope.choosePaymentHide = 'none';
                        var cardNo = $rootScope.CardNumber;
                        var strCardNo = cardNo.toString();
                        var getLastFour = strCardNo.substr(strCardNo.length - 4);
                        $rootScope.userCardNumber = getLastFour;
                    }
                    // $scope.doGetPatientPaymentProfilesCardDetails();
                    $rootScope.doGetPatientPaymentProfiles();
                    $state.go('tab.submitPayment');
                    /*} else {
        if(!angular.isUndefined(data.message)) {
        $scope.ErrorMessage = data.message;
        $rootScope.Validation($scope.ErrorMessage);
        $state.go('tab.cardDetails');
      } else {
      $rootScope.serverErrorMessageValidationForPayment();
    }
  }*/
                    $rootScope.cardDisplay = "inherit;";
                    $rootScope.verifyCardDisplay = "none";
                    $rootScope.planverify = "inherit";
                },
                error: function(data) {
                    $rootScope.cardDisplay = "inherit;";
                    $rootScope.verifyCardDisplay = "none";
                    $rootScope.planverify = "inherit";
                    $rootScope.serverErrorMessageValidationForPayment();
                }
            };

            LoginService.postPaymentProfileDetails(params);

        }
    }



    $scope.doGetCodesSet = function() {
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            hospitalId: $rootScope.hospitalId,
            accessToken: $rootScope.accessToken,
            fields: $scope.codesFields,
            success: function(data) {
                //console.log(data.data[3].codes);
                $rootScope.hospitalCodesList = angular.fromJson(data.data[3].codes);
                $rootScope.primaryConcernList = $rootScope.hospitalCodesList;
                $rootScope.primaryConcernDataList = angular.fromJson(data.data[3].codes);
                $rootScope.getSecondaryConcernAPIList = angular.fromJson(data.data[4].codes);
                if (angular.fromJson(data.data[4].codes) !== "") {
                    $rootScope.scondaryConcernsCodesList = angular.fromJson(data.data[4].codes);
                } else {
                    $rootScope.scondaryConcernsCodesList = $rootScope.primaryConcernDataList;
                }
                $rootScope.chronicConditionsCodesList = angular.fromJson(data.data[0].codes);
                $rootScope.chronicConditionList = $rootScope.chronicConditionsCodesList;
                $rootScope.currentMedicationsCodesList = angular.fromJson(data.data[1].codes);
                $rootScope.CurrentMedicationList = $rootScope.currentMedicationsCodesList;
                $rootScope.medicationAllergiesCodesList = angular.fromJson(data.data[2].codes);
                $rootScope.MedicationAllegiesList = $rootScope.medicationAllergiesCodesList;
                $rootScope.surgeryYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);


                $rootScope.eyeHairEthnicityRelationCodeSets = [];
                angular.forEach(data.data, function(index, item) {
                    $rootScope.eyeHairEthnicityRelationCodeSets.push({
                        'codes': angular.fromJson(index.codes),
                        'hospitalId': index.hospitalId,
                        'name': index.name
                    });
                });

                $rootScope.listOfEyeColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Eye Color"
                });
                $rootScope.listOfHairColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Hair Color"
                });
                $rootScope.listOfEthnicity = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Ethnicity"
                });
                $rootScope.listOfRelationship = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Relationship"
                });
                $rootScope.listOfHeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Height Units"
                });
                $rootScope.listOfWeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Weight Units"
                });
                $rootScope.listOfBloodtype = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Blood Type"
                });

                //	$state.go('tab.patientConcerns');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                }
            }
        };
        $rootScope.MedicationAllegiesItem = "";
        $rootScope.CurrentMedicationItem = "";
        $rootScope.PatientChronicConditionsSelected = "";

        $rootScope.SecondaryConcernText = "";
        $rootScope.PrimaryConcernText = "";

        $rootScope.PatientPrimaryConcern = "";
        $rootScope.PatientPrimaryConcernItem = "";
        $rootScope.PatientSecondaryConcern = "";
        $rootScope.PatientChronicCondition = "";
        $rootScope.patinentCurrentMedication = "";
        $rootScope.patinentMedicationAllergies = "";
        $rootScope.patientSurgeriess = "";
        $rootScope.MedicationCount == 'undefined';
        $rootScope.checkedChronic = 0;
        $rootScope.ChronicCount = "";
        $rootScope.AllegiesCount = "";
        $rootScope.checkedAllergies = 0;
        $rootScope.MedicationCount = "";
        $rootScope.checkedMedication = 0;
        $rootScope.IsValue = "";
        $rootScope.IsToPriorCount = "";
        $rootScope.IsToPriorCount = "";
        SurgeryStocksListService.ClearSurgery();
        LoginService.getCodesSet(params);
    }

    $scope.addMinutes = function(inDate, inMinutes) {
        var newdate = new Date();
        newdate.setTime(inDate.getTime() + inMinutes * 60000);
        return newdate;
    }


    /*$rootScope.doGetScheduledConsulatation = function () {
    if ($rootScope.accessToken == 'No Token') {
    alert('No token.  Get token first then attempt operation.');
    return;
    }
    $rootScope.scheduledConsultationList = [];
    var params = {
    patientId: $rootScope.primaryPatientId,
    accessToken: $rootScope.accessToken,
    success: function (data) {
    if(data != "") {
    $scope.scheduledConsultationList = data.data;
    $rootScope.getScheduledList = [];
    $rootScope.scheduleParticipants = [];
    var currentDate = new Date();
    currentDate = $scope.addMinutes(currentDate, -30);
    //var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");


    angular.forEach($scope.scheduledConsultationList, function(index, item) {
    if(currentDate < CustomCalendar.getLocalTime(index.startTime)) {
    $rootScope.getScheduledList.push({
    'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
    'appointmentId': index.appointmentId,
    'appointmentStatusCode': index.appointmentStatusCode,
    'appointmentTypeCode': index.appointmentTypeCode,
    'availabilityBlockId': index.availabilityBlockId,
    'endTime': index.endTime,
    'intakeMetadata': angular.fromJson(index.intakeMetadata),
    'participants': angular.fromJson(index.participants),
    'waiveFee': index.waiveFee
    });
    angular.forEach(index.participants, function(index, item) {
    $rootScope.scheduleParticipants.push({
    'appointmentId': index.appointmentId,
    'attendenceCode': index.attendenceCode,
    'participantId': index.participantId,
    'participantTypeCode': index.participantTypeCode,
    'person': angular.fromJson(index.person),
    'referenceType': index.referenceType,
    'status': index.status
    });
    })
    }
    });
    $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");

    console.log($rootScope.scheduledList);
    $rootScope.nextAppointmentDisplay = 'none';

    var d = new Date();
    d.setHours(d.getHours() + 12);
    var currentUserHomeDate = CustomCalendar.getLocalTime(d);

    if($rootScope.scheduledList != '')
    {
    //var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
    //var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
    var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
    var currentUserHomeDate = currentUserHomeDate;

    if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
    console.log('scheduledTime <= getTwelveHours UserHome');
    $rootScope.nextAppointmentDisplay = 'block';
    $rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
    $rootScope.timerCOlor = '#FEEFE8';
    var beforAppointmentTime = 	getReplaceTime;
    var doGetAppointmentTime =  $scope.addMinutes(beforAppointmentTime, -30);
    if((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime()))
    {
    $rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
    $rootScope.timerCOlor = '#E1FCD4';
    }
    }
    }
    }
    },
    error: function (data) {
    $rootScope.serverErrorMessageValidation();
    }
    };

    LoginService.getScheduledConsulatation(params);
    }*/


    /*$scope.doGetScheduledConsulatation = function () {
    if ($scope.accessToken == 'No Token') {
    alert('No token.  Get token first then attempt operation.');
    return;
    }
    $rootScope.scheduledConsultationList = [];
    var params = {
    patientId: $rootScope.primaryPatientId,
    accessToken: $rootScope.accessToken,
    success: function (data) {
    console.log(data);
    $scope.scheduledConsultationList = data.data;
    if(data != "") {
    $rootScope.scheduledList = [];
    var currentDate = new Date();
    currentDate = $scope.addMinutes(currentDate, -30);
    //var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");


    angular.forEach($scope.scheduledConsultationList, function(index, item) {
    if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
    $rootScope.scheduledList.push({
    'id': index.$id,
    'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
    'consultantUserId': index.consultantUserId,
    'consultationId': index.consultationId,
    'patientFirstName': htmlEscapeValue.getHtmlEscapeValue(index.patientFirstName),
    'patientLastName': htmlEscapeValue.getHtmlEscapeValue(index.patientLastName),
    'patientId': index.patientId,
    'assignedDoctorName': htmlEscapeValue.getHtmlEscapeValue(index.assignedDoctorName),
    'patientName': htmlEscapeValue.getHtmlEscapeValue(index.patientName),
    'consultationStatus': index.consultationStatus,
    'scheduledId': index.scheduledId,
    });
    }
    });


    $rootScope.nextAppointmentDisplay = 'none';

    var d = new Date();
    d.setHours(d.getHours() + 12);
    var currentUserHomeDate = CustomCalendar.getLocalTime(d);

    if($rootScope.scheduledList != '')
    {
    //var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
    //var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
    var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
    var currentUserHomeDate = currentUserHomeDate;

    if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
    console.log('scheduledTime <= getTwelveHours UserHome');
    $rootScope.nextAppointmentDisplay = 'block';
    $rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
    var beforAppointmentTime = 	getReplaceTime;
    var doGetAppointmentTime =  $scope.addMinutes(beforAppointmentTime, -30);
    if((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime()))
    {
    $rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
    }
    }
    }

    }
    },
    error: function (data) {
    $rootScope.serverErrorMessageValidation();
    }
    };

    LoginService.getScheduledConsulatation(params);
    }*/

    //$scope.doGetConsultationId($rootScope.scheduledList[0].appointmentId, $rootScope.scheduleParticipants[0].person.id);
    $rootScope.doGetConsultationId = function(appointmentId, personId, nextPage) {
        var params = {
            accessToken: $rootScope.accessToken,
            AppointmentId: appointmentId,
            personID: personId,
            success: function(data) {
                $rootScope.consultationId = data.data[0].consultationId;
                //$rootScope.doGeAppointmentExistingConsulatation();
                $rootScope.appointmentDisplay = "test";
                $scope.$root.$broadcast("callAppointmentConsultation");
                //$state.go(nextPage);
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.postGetConsultationId(params);
    }

    $rootScope.doGetScheduledConsulatation = function() {
        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $rootScope.scheduledConsultationList = [];
        var params = {
            patientId: $rootScope.primaryPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data != "") {
                    $scope.scheduledConsultationList = data.data;
                    $rootScope.getScheduledList = [];
                    $rootScope.scheduleParticipants = [];
                    var currentDate = new Date();
                    currentDate = $scope.addMinutes(currentDate, -30);
                    //var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");


                    angular.forEach($scope.scheduledConsultationList, function(index, item) {
                        if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {
                            $scope.paticipatingPatient = $filter('filter')(angular.fromJson(index.participants), {
                                "participantTypeCode": "1"
                            })[0];
                            var apptdate = index.startTime
                            var dataw = Date.parse(apptdate);
                            var newda = new Date(dataw);
                            var splitmnth = newda.getMonth() + 1;
                            var splitdate = newda.getDate();
                            var splityear = newda.getFullYear();
                            var Aptdate = splityear + "/" + splitmnth + "/" + splitdate;
                            $scope.formatscheduleddate = moment(Aptdate, 'YYYY/MM/DD').format('MMM D');

                            $scope.paticipatingPatientName = $scope.paticipatingPatient.person.name.given + ' ' + $scope.paticipatingPatient.person.name.family;
                            $scope.paticipatingPatientInitial = getInitialForName($scope.paticipatingPatientName);
                            //  if ($scope.paticipatingPatient.person.photoUrl) {
                            $scope.paticipatingPatientPhoto = $scope.paticipatingPatient.person.photoUrl;
                            /*  } else {
            $scope.paticipatingPatientPhoto = generateTextImage($scope.paticipatingPatientInitial, $rootScope.brandColor);
          }*/
                            $scope.paticipatingPhysician = $filter('filter')(angular.fromJson(index.participants), {
                                "participantTypeCode": "2"
                            })[0];
                            $scope.paticipatingPhysicianName = $scope.paticipatingPhysician.person.name.given + ' ' + $scope.paticipatingPhysician.person.name.family;
                            $scope.paticipatingPhysicianInitial = getInitialForName($scope.paticipatingPhysicianName);
                            //  if ($scope.paticipatingPhysician.person.photoUrl) {
                            $scope.paticipatingPhysicianPhoto = $scope.paticipatingPhysician.person.photoUrl;
                            /*  } else {
          $scope.paticipatingPhysicianPhoto = generateTextImage($scope.paticipatingPhysicianInitial, $rootScope.brandColor);
        }*/
                            $rootScope.getScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
                                'appointmentId': index.appointmentId,
                                'appointmentStatusCode': index.appointmentStatusCode,
                                'appointmentTypeCode': index.appointmentTypeCode,
                                'availabilityBlockId': index.availabilityBlockId,
                                'endTime': index.endTime,
                                'intakeMetadata': angular.fromJson(index.intakeMetadata),
                                'participants': angular.fromJson(index.participants),
                                'patientId': index.patientId,
                                'waiveFee': index.waiveFee,
                                'patientName': $scope.paticipatingPatientName,
                                'patientInitial': $scope.paticipatingPatientInitial,
                                'patientImage': $scope.paticipatingPatientPhoto,
                                'physicianName': $scope.paticipatingPhysicianName,
                                'physicianInitial': $scope.paticipatingPhysicianInitial,
                                'physicianImage': $scope.paticipatingPhysicianPhoto,
                                'scheduledDate': $scope.formatscheduleddate,
                                'patFirstName': $scope.paticipatingPatient.person.name.given,
                                'patLastName': $scope.paticipatingPatient.person.name.family,
                                'phiFirstName': $scope.paticipatingPhysician.person.name.given,
                                'phiFirstName': $scope.paticipatingPhysician.person.name.family
                            });
                            angular.forEach(index.participants, function(index, item) {
                                $rootScope.scheduleParticipants.push({
                                    'appointmentId': index.appointmentId,
                                    'attendenceCode': index.attendenceCode,
                                    'participantId': index.participantId,
                                    'participantTypeCode': index.participantTypeCode,
                                    'person': angular.fromJson(index.person),
                                    'referenceType': index.referenceType,
                                    'status': index.status
                                });
                            })
                        }
                    });
                    $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");

                    console.log($rootScope.scheduledList);
                    $rootScope.nextAppointmentDisplay = 'none';
                    //  $rootScope.accountClinicianFooter = 'block';

                    var d = new Date();
                    d.setHours(d.getHours() + 12);
                    var currentUserHomeDate = CustomCalendar.getLocalTime(d);

                    if ($rootScope.scheduledList != '') {
                        //var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
                        //var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
                        var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
                        var currentUserHomeDate = currentUserHomeDate;

                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                            console.log('scheduledTime <= getTwelveHours UserHome');
                            $rootScope.userHomeRecentAppointmentColor = '#FDD8C5';
                            $rootScope.nextAppointmentDisplay = 'block';
                            $rootScope.timerCOlor = '#FDD8C5';
                            var beforAppointmentTime = getReplaceTime;
                            var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);
                            if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {
                                $rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
                                $rootScope.timerCOlor = '#E1FCD4';
                            }
                        }
                    }
                }
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getScheduledConsulatation(params);
    }


    $scope.getScheduledDetails = function(patientId) {
        $rootScope.selectedPatientIdForDetails = patientId;
        $state.go('tab.patientCalendar');
    }


    $rootScope.PlanDisplay = "inherit";
    $rootScope.verifyPlanDisplay = "none;";
    $rootScope.planverify = "inherit";
    $rootScope.subdetailsdisplay = "inherit";
    $scope.PlanDetailsValidation = function(model) {
        $rootScope.doddate = $('#date').val();
        $rootScope.restage = getAge($rootScope.doddate);



        /*if($('#Provider').val() === '' || $('#firstName').val() === '' || $('#lastName').val() === '' || $('#policyNumber').val() === '' || $('#date').val() === '' ){ */
        if ($('#Provider').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if ($('#firstName').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if ($('#lastName').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if ($('#policyNumber').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if ($('#date').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);
        } else if ($rootScope.restage < 13) {
            $scope.ErrorMessage = "Subscriber should be atleast 13 years old";
            $rootScope.Validation($scope.ErrorMessage);
        } else {
            $rootScope.verifyPlanDisplay = "inherit";
            $rootScope.PlanDisplay = "none;";
            $rootScope.planverify = "0.3";
            $rootScope.subdetailsdisplay = "none";
            $scope.doPostNewHealthPlan();
        }
    }
    $scope.VerifyPlanDetailsValidation = function(model) {


        if ($('#firstName').val() === '' || $('#lastName').val() === '' || $('#policyNumber').val() === '' || $('#date').val() === '') {
            $scope.ErrorMessage = "Required fields can't be empty";
            $rootScope.Validation($scope.ErrorMessage);

        } else {
            $state.go('tab.applyPlan');
        }
    }


    $rootScope.SubmitCardValidation = function($a) {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i>' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

        //$('#notifications-window-row-button').click(function(){
        $("#notifications-top-center").remove();
        $(".Error_Message").append(top);
        //$("#notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();
        //});
    }

    $scope.ReceiptTimeout = function() {

        var currentTimeReceipt = new Date();

        currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);

        $rootScope.ReceiptTime = currentTimeReceipt.getTime();

        //setTimeout(function(){ $state.go('tab.waitingRoom');	 }, 10000);
        setTimeout(function() {
            $scope.doGetWaitingRoom();
        }, 10000);

    }

    $scope.cardPaymentId = [];
    $scope.doPostCoPayDetails = function() {


        if ($('#addNewCard').val() === 'Choose Your Card' || $('#addNewCard_addCard').val() === 'Choose Your Card' || $('#addNewCard_submitPay').val() === 'Choose Your Card') {
            $scope.ErrorMessages = "Please select the card to use for payment";
            $rootScope.SubmitCardValidation($scope.ErrorMessages);

        } else {

            if (typeof $scope.cardPaymentId.addNewCard !== 'undefined') {
                $rootScope.paymentProfileId = $scope.cardPaymentId.addNewCard;
            } else if (typeof $scope.cardPaymentId.addNewCard === 'undefined') {
                if (typeof $rootScope.userCardDetails === 'undefined') {
                    $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                    $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                } else {
                    $rootScope.paymentProfileId = $rootScope.userCardDetails;
                }
            }

            if ($scope.accessToken === 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                profileId: parseInt($rootScope.patientprofileID),
                emailAddress: $rootScope.UserEmail,
                Amount: $rootScope.copayAmount,
                consultationId: $rootScope.consultationId,
                paymentProfileId: parseInt($rootScope.paymentProfileId),
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    //To save the last used card for user.
                    var cardSelectedText = $('#cardViewport').html();
                    $window.localStorage.setItem("Card" + $rootScope.UserEmail, $rootScope.paymentProfileId);
                    $window.localStorage.setItem("CardText" + $rootScope.UserEmail, cardSelectedText);
                    $rootScope.paymentConfirmationNumber = data.data[0].confirmationNumber;
                    $scope.CreditCardDetails = data;
                    $state.go('tab.receipt');
                    $scope.ReceiptTimeout();
                },
                error: function(data, status) {
                    if (status === 0) {

                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);

                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.postCoPayDetails(params);
        }
    }

    $rootScope.doDeleteAccountUser = function(patientId) {
        var params = {
            accessToken: $rootScope.accessToken,
            PatientId: patientId,
            success: function(data) {
                $scope.deleteCoUser = JSON.stringify(data, null, 2);
                $rootScope.doGetAccountDependentDetails();
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.deleteAccountUser(params);
    }

    $scope.checkEditOptionForCoUser = function(currentPatId) {
        if ($rootScope.listOfCoUserDetails !== 0 && !angular.isUndefined($rootScope.listOfCoUserDetails)) {
            var coUserInfo = $filter('filter')($rootScope.listOfCoUserDetails, {
                patientId: currentPatId
            });
            if (coUserInfo.length === 1) {
                $rootScope.editOption = "None";
            } else {
                $rootScope.editOption = " ";
            }
        } else {
            $rootScope.editOption = " ";
        }
    }

    $rootScope.doGetSelectedPatientProfiles = function(patientId, nextPage, seeADoc) {
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            patientId: patientId,
            success: function(data) {
                if (nextPage == 'tab.relatedusers') {
                    $rootScope.selectedRelatedDependentDetails = [];
                    //angular.fromJson(index.billingAddress)
                    angular.forEach(data.data, function(index, item) {
                        $rootScope.selectedRelatedDependentDetails.push({
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'anatomy': angular.fromJson(index.anatomy),
                            'countryCode': index.countryCode,
                            'createDate': index.createDate,
                            'dob': index.dob,
                            'gender': index.gender,
                            'homePhone': index.homePhone,
                            'lastName': index.lastName,
                            'mobilePhone': index.mobilePhone,
                            'patientName': index.patientName,
                            'pharmacyDetails': index.pharmacyDetails,
                            'physicianDetails': index.physicianDetails,
                            'schoolContact': index.schoolContact,
                            'schoolName': index.schoolName,

                        });
                    });

                    var date = new Date($rootScope.selectedRelatedDependentDetails[0].dob);
                    $rootScope.dependentDOB = $filter('date')(date, "yyyy-MM-dd");
                    if ($rootScope.selectedRelatedDependentDetails[0].gender == 'M') {
                        $rootScope.dependentGender = "Male";
                        $rootScope.isCheckedMaleDependent = true;
                    } else if ($rootScope.selectedRelatedDependentDetails[0].gender == 'F') {
                        $rootScope.dependentGender = "Female";
                        $rootScope.isCheckedMaleDependent = true;
                    }
                    $scope.getRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                        codeId: $rootScope.selectedRelatedDependentDetails[0].account.relationshipCodeId
                    })
                    if ($scope.getRelationShip.length !== 0) {
                        $rootScope.dependentRelationShip = $scope.getRelationShip[0].text;
                    } else {
                        $rootScope.dependentRelationShip = '';
                    }

                    if ($rootScope.selectedRelatedDependentDetails.length !== 0) {
                        $rootScope.dependentDOB = ageFilter.getDateFilter($rootScope.dependentDOB);
                        if (!angular.isUndefined($rootScope.dependentDOB) && $rootScope.dependentDOB !== '') {
                            $scope.dob = " . " + $rootScope.dependentDOB;
                        } else {
                            $scope.dob = '';
                        }
                        if (!angular.isUndefined($rootScope.dependentRelationShip) && $rootScope.dependentRelationShip !== '') {
                            $scope.relationship = " . " + $rootScope.dependentRelationShip;
                        } else {
                            $scope.relationship = '';
                        }
                        var confirmPopup = $ionicPopup.confirm({

                            title: "<a class='item-avatar'>  <img src='" + dependentDetails.profileImagePath + "'><span><span class='fname'><b>" + $rootScope.selectedRelatedDependentDetails[0].patientName + "</b></span> <span class='fname'><b>" + $rootScope.selectedRelatedDependentDetails[0].patientName + "</b></span></span></a> ",
                            //  subTitle:"<p class='fontcolor'>"+$rootScope.dependentGender+"<span ng-if="+ $rootScope.dependentDOB+ "!= ''" >. "+$rootScope.dependentDOB+ "<span ng-if="+ dependentRelationShip + "!= ''" >. " + dependentRelationShip +"</p>",
                            subTitle: "<p class='fontcolor'>" + $rootScope.dependentGender + $scope.dob + $scope.relationship + "</p>",
                            //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
                            templateUrl: 'templates/archiveTemplate.html',

                            buttons: [{
                                text: 'Cancel',
                                onTap: function(e) {
                                    return false;
                                }
                            }, {
                                text: '<b>Archieve</b>',
                                type: 'button-assertive',
                                onTap: function(e) {
                                    return true;
                                }
                            }, ],
                        });
                        confirmPopup.then(function(res) {
                            if (res) {
                                $rootScope.doDeleteAccountUser(patientId);
                            } else {
                                $scope.showdnewetails = false;
                                $scope.allval = false;
                            }


                        });
                    }



                } else {
                    $scope.selectedPatientDetails = [];
                    //angular.fromJson(index.billingAddress)
                    angular.forEach(data.data, function(index, item) {
                        $scope.selectedPatientDetails.push({
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'anatomy': angular.fromJson(index.anatomy),
                            'countryCode': index.countryCode,
                            'createDate': index.createDate,
                            'fieldChangesTrackingDetails': angular.fromJson(index.fieldChangesTrackingDetails),
                            'dob': index.dob,
                            'gender': index.gender,
                            'homePhone': index.homePhone,
                            'lastName': index.lastName,
                            'location': index.location,
                            'locationId': index.locationId,
                            'medicalHistory': angular.fromJson(index.medicalHistory),
                            'mobilePhone': index.mobilePhone,
                            'organization': index.organization,
                            'organizationId': index.organizationId,
                            'patientName': index.patientName,
                            'personId': index.personId,
                            'pharmacyDetails': index.pharmacyDetails,
                            'physicianDetails': index.physicianDetails,
                            'schoolContact': index.schoolContact,
                            'schoolName': index.schoolName
                        });
                    });
                    $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                    var date = new Date($rootScope.currentPatientDetails[0].dob);
                    //$rootScope.userDOB = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    $rootScope.userDOBDateFormat = date;
                    $rootScope.userDOBDateForAuthorize = $filter('date')(date, "MM-dd-yyyy");
                    $scope.checkEditOptionForCoUser($rootScope.currentPatientDetails[0].account.patientId);
                    $state.go(nextPage);
                }
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getSelectedPatientProfiles(params);
    }


    $rootScope.doGetIndividualScheduledConsulatation = function() {
        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $rootScope.appointmentPatientId = '';
        $rootScope.individualScheduledConsultationList = [];
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data != "") {
                    $scope.individualScheduledConsultationList = data.data[0];
                    if ($rootScope.patientId == $rootScope.primaryPatientId) {
                        $rootScope.P_isAuthorized = true;
                    } else {
                        if (data.data[0].account.isAuthorized == "T" || data.data[0].account.isAuthorized == true || data.data[0].account.isAuthorized == "Y") {
                            $rootScope.P_isAuthorized = true;
                            //  }else if(P_isAuthorized == "F" || P_isAuthorized == false) {
                        } else {
                            $rootScope.P_isAuthorized = false;
                        }
                    }

                    var date = new Date($scope.individualScheduledConsultationList.dob);
                    //$rootScope.userDOB = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");

                    if ($rootScope.userDOB !== "" && !angular.isUndefined($rootScope.userDOB)) {
                        var ageDifMs = Date.now() - new Date($rootScope.userDOB).getTime(); // parse string to date
                        var ageDate = new Date(ageDifMs); // miliseconds from epoch
                        $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                        if ($scope.userAge === 0) {
                            $rootScope.concentToTreatPreviousPage = "tab.intakeBornHistory";
                            $rootScope.userAgeForIntake = 8;
                        } else {
                            $rootScope.concentToTreatPreviousPage = "tab.CurrentMedication";
                            $rootScope.userAgeForIntake = 7;
                        }
                        if ($scope.individualScheduledConsultationList.account.patientId !== $rootScope.primaryPatientId) {
                            if ($rootScope.userDOB.indexOf('T') == -1) {
                                $rootScope.PatientAge = $rootScope.userDOB + "T00:00:00Z";
                            }
                        }
                    }
                    if ($scope.individualScheduledConsultationList.gender == 'M' || $scope.individualScheduledConsultationList.gender == 'Male') {
                        $rootScope.userGender = "Male";
                        $rootScope.isCheckedMale = true;
                    } else if ($scope.individualScheduledConsultationList.gender == 'F' || $scope.individualScheduledConsultationList.gender == 'Female') {
                        $rootScope.userGender = "Female";
                        $rootScope.isCheckedFemale = true;
                    } else {
                        $rootScope.userGender = '';
                        $rootScope.isCheckedFemale = '';
                    }


                    if ($scope.individualScheduledConsultationList.account.patientId !== $rootScope.primaryPatientId) {
                        if (!angular.isUndefined($scope.individualScheduledConsultationList.account.relationship)) {
                            $rootScope.patRelationShip = $scope.individualScheduledConsultationList.account.relationship;
                            if($rootScope.patRelationShip === 'Choose') {
                              $rootScope.patRelationShip = '';
                            }
                        } else {
                            $rootScope.patRelationShip = '';
                        }
                    } else {
                        $rootScope.patRelationShip = '';
                    }

                    $rootScope.getIndividualScheduledList = [];
                    $rootScope.individualScheduleParticipants = [];
                    var currentDate = new Date();
                    currentDate = $scope.addMinutes(currentDate, -30);
                    //var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");


                    angular.forEach($scope.individualScheduledConsultationList.appointments, function(index, item) {
                        if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {


                            var apptdate = index.startTime
                            var dataw = Date.parse(apptdate);
                            var newda = new Date(dataw);
                            var splitmnth = newda.getMonth() + 1;
                            var splitdate = newda.getDate();
                            var splityear = newda.getFullYear();
                            var Aptdate = splityear + "/" + splitmnth + "/" + splitdate;
                            $scope.formatscheduleddate = moment(Aptdate, 'YYYY/MM/DD').format('MMM D');
                            $rootScope.getIndividualScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
                                'appointmentId': index.appointmentId,
                                'appointmentStatusCode': index.appointmentStatusCode,
                                'appointmentTypeCode': index.appointmentTypeCode,
                                'availabilityBlockId': index.availabilityBlockId,
                                'endTime': index.endTime,
                                'intakeMetadata': angular.fromJson(index.intakeMetadata),
                                'participants': angular.fromJson(index.participants),
                                'waiveFee': index.waiveFee,
                                'scheduledDate': $scope.formatscheduleddate
                            });
                            angular.forEach(index.participants, function(index, item) {
                                $rootScope.individualScheduleParticipants.push({
                                    'appointmentId': index.appointmentId,
                                    'attendenceCode': index.attendenceCode,
                                    'participantId': index.participantId,
                                    'participantTypeCode': index.participantTypeCode,
                                    'person': angular.fromJson(index.person),
                                    'referenceType': index.referenceType,
                                    'status': index.status
                                });
                            })
                        }
                    });

                    $rootScope.individualScheduledList = $filter('filter')($filter('orderBy')($rootScope.getIndividualScheduledList, "scheduledTime"), "a");

                    $rootScope.getIndividualScheduleDetails = $rootScope.individualScheduledList;

                    console.log($rootScope.individualScheduledList);
                    //$rootScope.nextAppointmentDisplay = 'none';

                    var d = new Date();
                    d.setHours(d.getHours() + 12);
                    var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                    $rootScope.individualNextAppointmentDisplay = 'none';
                    $rootScope.individualwithoutAppointmentDisplay = 'block';
                    $rootScope.accountClinicianFooter = 'block';
                    $rootScope.accountStyle = "";
                    $rootScope.userAccContent = "";
                    if ($rootScope.individualScheduledList != '') {
                        //var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
                        //var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
                        var getReplaceTime = $rootScope.individualScheduledList[0].scheduledTime;
                        var currentUserHomeDate = currentUserHomeDate;


                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                            console.log('scheduledTime <= getTwelveHours UserHome');
                            //$rootScope.nextAppointmentDisplay = 'block';
                            //  $rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
                            $rootScope.accountClinicianFooter = 'none';
                            $rootScope.individualNextAppointmentDisplay = 'block';
                            $rootScope.individualwithoutAppointmentDisplay = 'none';
                            //$rootScope.accountStyle = "AppointDisplay" + $rootScope.deviceName;
                            $rootScope.accountStyle = "AppointNone" + $rootScope.deviceName;
                            $rootScope.userAccContent = "userAccContent" + $rootScope.deviceName;
                            $rootScope.appointmentPatientId = $rootScope.patientId;
                            var beforAppointmentTime = getReplaceTime;
                            var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);


                            if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {
                                //  $rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
                                //  if($rootScope.scheduledList[0].patientId == $rootScope.patientId) {
                                //  }
                            }
                        }

                        var getReplaceTime1 = $rootScope.individualScheduledList[0].scheduledTime;
                        var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
                        var currentUserHomeDate = currentUserHomeDate;
                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {

                            $rootScope.time = new Date(getReplaceTime).getTime();

                            $timeout(function() {
                                document.getElementsByTagName('timer')[0].stop();
                                document.getElementsByTagName('timer')[0].start();
                            }, 10);

                            $scope.$on('timer-tick', function(event, args) {
                                if (args.days == 0) {
                                    $rootScope.hourDisplay = 'initial';
                                    $rootScope.daysDisplay = 'none';
                                    $rootScope.dayDisplay = 'none';
                                } else if (args.days == 1) {
                                    $rootScope.daysDisplay = 'none';
                                    $rootScope.hourDisplay = 'none';
                                    $rootScope.dayDisplay = 'initial';
                                } else if (args.days > 1) {
                                    $rootScope.daysDisplay = 'initial';
                                    $rootScope.hourDisplay = 'none';
                                    $rootScope.dayDisplay = 'none';
                                }


                                if (args.millis < 600) {
                                    $rootScope.timeNew = 'none';
                                    $rootScope.timeNew1 = 'block';
                                    $rootScope.timerCOlor = '#E1FCD4';
                                    $('.AvailableIn').hide();
                                    $('.enterAppoinment').show();
                                } else if (args.millis > 600) {
                                    $rootScope.timeNew = 'block';
                                    $rootScope.timeNew1 = 'none';
                                    $rootScope.timerCOlor = '#FDD8C5';
                                    $('.AvailableIn').show();
                                    $('.enterAppoinment').hide();
                                }
                            });
                            $rootScope.time = new Date(getReplaceTime).getTime();

                            var d = new Date();

                            var currentUserHomeDate = CustomCalendar.getLocalTime(d);

                            if (getReplaceTime < currentUserHomeDate) {
                                $rootScope.timerCOlor = '#E1FCD4';
                                $('.AvailableIn').hide();
                                $('.enterAppoinment').show();
                            }
                        } else if ((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
                            $rootScope.timerCOlor = 'transparent';
                        }
                    }
                }
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getIndividualScheduledConsulatation(params);
    }

    $rootScope.doGetonDemandAvailability = function() {
        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.onDemandAvailability = data.data[0].onDemandAvailabilityBlockCount;
                //	$state.go('tab.patientDetail');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getonDemandAvailability(params);
    }

    $rootScope.doGetLocations = function() {
        $rootScope.listOfOrganization = '';
        $rootScope.listOfLocation = '';
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.listOfOrganization = [];
                $rootScope.listOfLocation = [];
                if (data.data[0] !== '') {
                    angular.forEach(data.data, function(index, item) {
                        $rootScope.listOfOrganization.push({
                            'addresses': index.addresses,
                            'createdByUserId': index.createdByUserId,
                            'createdDate': index.createdDate,
                            'hospitalId': index.hospitalId,
                            'id': index.id,
                            'locations': angular.fromJson(index.locations),
                            'modifiedByUserId': index.modifiedByUserId,
                            'modifiedDate': index.modifiedDate,
                            'name': index.name,
                            'organizationTypeId': index.organizationTypeId
                        });
                        angular.forEach(index.locations, function(index, item) {
                            $rootScope.listOfLocation.push({
                                'createdByUserId': index.createdByUserId,
                                'createdDate': index.createdDate,
                                'id': index.id,
                                'modifiedByUserId': index.modifiedByUserId,
                                'modifiedDate': index.modifiedDate,
                                'name': index.name,
                                'organizationId': index.organizationId
                            });
                        })
                    });
                }

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getListOfLocationOrganization(params);
    }

    $rootScope.passededconsultants = function() {

        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            statusId: 72,
            success: function(data, status) {
                if (data == null) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (status === 401) {
                    $rootScope.patientId = $rootScope.coUserAuthorization;
                    $rootScope.getCoUserAunthent = 'notAuthorized';
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.getCoUserAunthent = 'Authorized';
                    $rootScope.Passedconsultations = data.data;
                }


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getListOfPassedConsultations(params);

    }
    $rootScope.passededconsultantsForCoUser = function(Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {

        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            statusId: 72,
            success: function(data, status) {
                if (data == null) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (status === 401) {
                    $rootScope.patientId = $rootScope.coUserAuthorization;
                    $rootScope.getCoUserAunthent = 'notAuthorized';
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.getCoUserAunthent = 'Authorized';
                    $rootScope.Passedconsultations = data.data;
                    if($rootScope.getCoUserAunthent === 'Authorized') {
                      if ($rootScope.patientSearchKey != '' || typeof $rootScope.patientSearchKey != "undefined") {
                        if ($rootScope.RelatedPatientProfiles.length !== 0 && $rootScope.RelatedPatientProfiles !== '') {
                              if ($rootScope.primaryPatientFullName === $rootScope.RelatedPatientProfiles[0].patientName) {
                                  $rootScope.RelatedPatientProfiles.shift();
                              }
                          }
                          $rootScope.providerName = '';
                          $rootScope.PolicyNo = '';
                          $rootScope.healthPlanID = '';
                          $rootScope.NewHealth = '';
                      }
                      $rootScope.userAgeForIntake = '';
                      $rootScope.updatedPatientImagePath = '';
                      $rootScope.newDependentImagePath = '';
                      $rootScope.appointmentDisplay = '';
                      $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
                      $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
                      $rootScope.locationdet = Pat_locat;
                      $rootScope.PatientImageSelectUser = P_img;
                      $rootScope.PatientFirstName = P_Fname;
                      $rootScope.PatientLastName = P_Lname;
                      $rootScope.PatientAge = P_Age;
                      $rootScope.SelectPatientAge = $rootScope.PatientAge;
                      $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
                    //  $rootScope.patientId = P_Id;
                      $scope.doGetConutriesList();
                      $rootScope.doGetCreditDetails();
                      $rootScope.doGetLocations();
                      $rootScope.doGetIndividualScheduledConsulatation();
                      $rootScope.doGetonDemandAvailability();
                      $rootScope.doGetListOfCoUsers();
                      if (!$rootScope.P_isAuthorized) {
                          $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                          $rootScope.SubmitCardValidation($scope.ErrorMessage);
                      }
                      if ($rootScope.P_isAuthorized = undefined) {
                          $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                          $rootScope.SubmitCardValidation($scope.ErrorMessage);
                      }
                      if (clickEvent === "patientClick") {
                          $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');
                      } else if (clickEvent === "sideMenuClick") {
                          $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
                      } else if (clickEvent === "sideMenuClickApoointments") {
                          $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
                      } else if (clickEvent === "tab.patientConcerns") {
                          $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
                      } else {
                          $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
                      }
                  }
                }


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getListOfPassedConsultations(params);

    }

    $rootScope.doGetListOfCoUsers = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            authorizedOnly: true,
            success: function(data) {
                //$scope.listOfCoUser = JSON.stringify(data, null, 2);
                if (data.data != '') {
                    $rootScope.listOfCoUserDetails = [];
                    angular.forEach(data.data, function(index, item) {
                        if (index.patientId !== $rootScope.primaryPatientId) {
                            var getCoUserRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCodeId
                            })
                            if (getCoUserRelationShip.length !== 0) {
                                var relationShip = getCoUserRelationShip[0].text;
                            } else {
                                var relationShip = '';
                            }
                            var dob = ageFilter.getDateFilter(index.dob);
                            if (index.gender == 'M') {
                                var gender = "Male";
                            } else if (index.gender == 'F') {
                                var gender = "Female";
                            }
                            //  if (index.imagePath) {
                            $scope.coUserImagePath = index.imagePath;
                            /*  } else {
            var coName = index.name + " " + index.lastname; //alert(coName);
            $scope.coUserName = getInitialForName(coName);
            $scope.coUserImagePath = generateTextImage($scope.coUserName, $rootScope.brandColor);
          }*/

                            $rootScope.listOfCoUserDetails.push({
                                'address': index.address,
                                'bloodType': index.bloodType,
                                'description': index.description,
                                'dob': dob,
                                'emailId': index.emailId,
                                'ethnicity': index.ethnicity,
                                'eyeColor': index.eyeColor,
                                'gender': gender,
                                'hairColor': index.hairColor,
                                'height': index.height,
                                'heightUnit': index.heightUnit,
                                'homePhone': index.homePhone,
                                'imagePath': $scope.coUserImagePath,
                                'lastname': index.lastname,
                                'mobilePhone': index.mobilePhone,
                                'name': index.name,
                                'patientId': index.patientId,
                                'personId': index.personId,
                                'relationship': relationShip,
                                'relationCodeId': index.relationCodeId,
                                'roleId': index.roleId,
                                'userId': index.userId,
                                'weight': index.weight,
                                'weightUnit': index.weightUnit
                            });
                        }
                    });
                }

            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getListOfCoUsers(params);
    }

    $rootScope.doGetCreditDetails = function() {

        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data.data != '') {
                    $rootScope.listOfCreditDetails = [];
                    angular.forEach(data.data, function(index, item) {
                        $rootScope.listOfCreditDetails.push({
                            'appointmentTypeCode': index.appointmentTypeCode,
                            'creditAmount': index.creditAmount,
                            'creditDate': index.creditDate,
                            'patientId': index.patientId,
                            'patientPaymentId': index.patientPaymentId
                        });
                    });
                    if ($rootScope.listOfCreditDetails.length > 0) {
                        $rootScope.getIndividualPatientCreditCount = $rootScope.listOfCreditDetails.length;
                        $rootScope.getReceiptCreditCount = $rootScope.getIndividualPatientCreditCount - 1;
                    } else {
                        $rootScope.getIndividualPatientCreditCount = 0;
                    }
                } else {
                    $rootScope.listOfCreditDetails = '';
                    $rootScope.getIndividualPatientCreditCount = 0;
                }
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.GetCreditDetails(params);
      }


    function chkCameraAndMicroPhoneSettings(getCurrentFuncName) {
        $window.localStorage.setItem('FlagForCheckingFirstLogin', '');
        cordova.plugins.diagnostic.requestCameraAuthorization(function(status) {
            if(status === ''){
                 $scope.settingsMessage = "This app requires camera and microphone access to function properly.";
                 $scope.titeName = 'Would Like to Access the Camera and Microphone';
                 onMicroPhoneAuthorizationDenied();
            }else if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status) {
                    if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                        $scope.settingsMessage = "This app requires camera and microphone access to function properly.";
                        $scope.titeName = 'Would Like to Access the Camera and Microphone';
                        onMicroPhoneAuthorizationDenied();
                    } else {
                        $scope.settingsMessage = "This app requires camera access to function properly.";
                        $scope.titeName = 'Would Like to Access the Camera';
                        onMicroPhoneAuthorizationDenied();
                    }
                })
            } else {
                cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status) {
                    if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                        $scope.titeName = 'Would Like to Access the MicroPhone';
                        $scope.settingsMessage = "This app requires microphone access to function properly.";
                        onMicroPhoneAuthorizationDenied();
                   } else { //authorized
                        $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                        if(getCurrentFuncName === 'GeneralLoginFun') {
                          $scope.GetLoginFunctionDetails();
                        } else if(getCurrentFuncName === 'SingleFuncLogin') {
                            $scope.GetSingleLoginDetailsFOrCheckingMic();
                        }
                    }
                }, function(error) {
                    console.log(error);
                })
            }
        }, function(error) {
            console.log(error);
        })
   }

    function onMicroPhoneAuthorizationDenied() {
        if(!$rootScope.isNotificationDisplayed) {
             $rootScope.isNotificationDisplayed = true;
             $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
             navigator.notification.alert(
                 $scope.settingsMessage,
                 function(i) {
                     if (i) {
                         cordova.plugins.diagnostic.switchToSettings();
                     }
                 },
                 $rootScope.alertMsgName + " " + $scope.titeName,
                 'Ok'
             );
             exit;
        }
    }

    $rootScope.GoToPatientDetailsFromRelatedUsers = function(Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {
        $rootScope.coUserAuthorization =  $rootScope.patientId;
        $rootScope.patientId = P_Id;
        $rootScope.getCoUserAunthent = '';
        $rootScope.passededconsultantsForCoUser(Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent);
    }




    $rootScope.GoToPatientDetails = function(Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {
        if ($rootScope.patientSearchKey != '' || typeof $rootScope.patientSearchKey != "undefined") {

            //Removing main patient from the dependant list. If the first depenedant name and patient names are same, removing it. This needs to be changed when actual API given.
            if ($rootScope.RelatedPatientProfiles.length !== 0 && $rootScope.RelatedPatientProfiles !== '') {
                if ($rootScope.primaryPatientFullName === $rootScope.RelatedPatientProfiles[0].patientName) {
                    $rootScope.RelatedPatientProfiles.shift();
                    //  $scope.searched = false;
                }
            }
            $rootScope.providerName = '';
            $rootScope.PolicyNo = '';
            $rootScope.healthPlanID = '';
            $rootScope.NewHealth = '';
        }
        $rootScope.userAgeForIntake = '';
        $rootScope.updatedPatientImagePath = '';
        $rootScope.newDependentImagePath = '';
        $rootScope.appointmentDisplay = '';
        $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
        $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
            $rootScope.locationdet = Pat_locat;
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            //  $rootScope.userAgeForIntake = ageFilter.getDateFilter(P_Age);
            $rootScope.SelectPatientAge = $rootScope.PatientAge;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $rootScope.patientId = P_Id;
            $scope.doGetConutriesList();
            $rootScope.doGetCreditDetails();
            $rootScope.passededconsultants();
            $rootScope.doGetLocations();
            $rootScope.doGetIndividualScheduledConsulatation();
            $rootScope.doGetonDemandAvailability();
            $rootScope.doGetListOfCoUsers();
            if (!$rootScope.P_isAuthorized) {
                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                $rootScope.SubmitCardValidation($scope.ErrorMessage);
            }
            if ($rootScope.P_isAuthorized = undefined) {
                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                $rootScope.SubmitCardValidation($scope.ErrorMessage);
            }
            if (clickEvent === "patientClick") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');
            } else if (clickEvent === "sideMenuClick") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
            } else if (clickEvent === "sideMenuClickApoointments") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
            } else if (clickEvent === "tab.patientConcerns") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
            } else {
                $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
            }
    }


    $rootScope.GoUserPatientDetails = function(Pat_locat, P_Id, clickEvent) {
        if ($rootScope.patientSearchKey != '' || typeof $rootScope.patientSearchKey != "undefined") {

            //Removing main patient from the dependant list. If the first depenedant name and patient names are same, removing it. This needs to be changed when actual API given.
            if ($rootScope.RelatedPatientProfiles.length !== 0 && $rootScope.RelatedPatientProfiles !== '') {
                if ($rootScope.primaryPatientFullName === $rootScope.RelatedPatientProfiles[0].patientName) {
                    $rootScope.RelatedPatientProfiles.shift();
                    //  $scope.searched = false;
                }
            }
            $rootScope.providerName = '';
            $rootScope.PolicyNo = '';
            $rootScope.healthPlanID = '';
            $rootScope.NewHealth = '';
        }
        //$rootScope.userAgeForIntake = '';
        $rootScope.updatedPatientImagePath = '';
        $rootScope.newDependentImagePath = '';
        $rootScope.appointmentDisplay = '';
        $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
        $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);


        $rootScope.locationdet = Pat_locat;

        $rootScope.patientId = P_Id;


        if (clickEvent === "patientClick") {
            $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');
        } else if (clickEvent === "sideMenuClick") {
            $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
        } else if (clickEvent === "sideMenuClickApoointments") {
            $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
        } else if (clickEvent === "tab.patientConcerns") {
            $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
        } else {
            $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
        }
        //$state.go('tab.patientDetail');
        //$scope.doGetUserHospitalInformation();

    }


    $scope.doToPatientCalendar = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $state.go('tab.patientCalendar');
    }

    $scope.doToAppoimentDetails = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $state.go('tab.appoimentDetails');
    }

    $scope.enterWaitingRoom = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $scope.doGetWaitingRoom();
    }
    $scope.goBackFromConcernToTreat = function() {
        $state.go($rootScope.concentToTreatPreviousPage);
    }


    $scope.GoToConsultCharge = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        if ($rootScope.appointmentsPage === false) {
            /*if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on') {
    $rootScope.verifyInsuranceSection = "block";
    $rootScope.verifyConsultChargeSection = "none";
  } else {
  $rootScope.verifyInsuranceSection = "none";
  $rootScope.verifyConsultChargeSection = "block";
}
$rootScope.consultChargeSection = "block";
$rootScope.healthPlanSection = "none";
$rootScope.healthPlanSection = "block";*/
            if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on') {
                $rootScope.healthPlanPage = "none";
                $rootScope.consultChargeNoPlanPage = "block";
            } else {
                $rootScope.consultChargeNoPlanPage = "none";
                $rootScope.healthPlanPage = "block";
            }

            $rootScope.doPutConsultationSave();
        } else if ($rootScope.appointmentsPage === true) {
            if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on') {
                $rootScope.doPostDepitDetails();
            } else {
                $scope.doGetHospitalInformation();
            }
        }
    }

    $rootScope.doPostDepitDetails = function() {
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            patientId: $rootScope.patientId,
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $state.go('tab.receipt');
                $rootScope.enablePaymentSuccess = "none";
                $rootScope.enableInsuranceVerificationSuccess = "none";
                $rootScope.enableCreditVerification = "block";
                $scope.ReceiptTimeout();
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.postDepitDetails(params);
    }


    $scope.doGetHospitalInformation = function() {
        if ($rootScope.accessToken === 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            accessToken: $rootScope.accessToken,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                if ($rootScope.getDetails !== '') {
                    /*for (var i = 0; i < $rootScope.getDetails.length; i++) {
        if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
        $rootScope.insuranceMode = 'on';
      }
      //if ($rootScope.getDetails[i] === 'PaymentPageBeforeWaitingRoom') {
      if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
      $rootScope.paymentMode = 'on';
    }
    if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
    $rootScope.onDemandMode = 'on';
  }
}*/
                    //  $rootScope.consultChargeSection = "block";

                    //  $rootScope.healthPlanSection = "block";

                    //Get Payment Details
                    if ($rootScope.paymentMode == 'on' && $rootScope.consultationAmount != 0 && typeof $rootScope.consultationAmount != 'undefined') {

                        $rootScope.doGetPatientPaymentProfiles();
                    }
                    $rootScope.enableInsuranceVerificationSuccess = "none";
                    $rootScope.enableCreditVerification = "none";

                    if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode === 'on') {
                        $rootScope.openAddHealthPlanSection();
                    }

                    if ($rootScope.insuranceMode !== 'on' && $rootScope.paymentMode !== 'on') {

                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none";
                        $state.go('tab.receipt');
                        $scope.ReceiptTimeout();
                    } else if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on') {
                        //  $rootScope.verifyInsuranceSection = "none";
                        //  $rootScope.verifyConsultChargeSection = "none";
                        $rootScope.openAddHealthPlanSection();
                        $state.go('tab.consultCharge');
                    } else {

                        if ($rootScope.consultationAmount > 0 && typeof $rootScope.consultationAmount != 'undefined') {
                            if ($rootScope.insuranceMode != 'on' && $rootScope.paymentMode == 'on') {

                                //  $rootScope.consultChargeSection = "none";
                                //  $rootScope.healthPlanSection = "block";
                                $rootScope.healthPlanPage = "none";
                                $rootScope.consultChargeNoPlanPage = "block";
                            }
                            $state.go('tab.consultCharge');
                            //  $rootScope.verifyInsuranceSection = "none";
                            //  $rootScope.verifyConsultChargeSection = "block";

                            if (typeof $rootScope.userDefaultPaymentProfile == "undefined") {
                                $('#addNewCard').val('Choose Your Card');
                                $('#addNewCard_addCard').val('Choose Your Card');
                                $('#addNewCard_submitPay').val('Choose Your Card');
                                $rootScope.userDefaultPaymentProfileText = null;

                            } else {
                                $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                            }
                        } else {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none";
                            $state.go('tab.receipt');
                            $scope.ReceiptTimeout();
                        }
                    }
                }


            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getHospitalInfo(params);
    }


    /*$scope.doGetUserHospitalInformationForUserHome = function () {
    if ($rootScope.accessToken === 'No Token') {
    alert('No token.  Get token first then attempt operation.');
    return;
    }
    var params = {
    accessToken: $rootScope.accessToken,
    hospitalId: $rootScope.hospitalId,
    success: function (data) {
    $rootScope.getDetails = data.data[0].enabledModules;
    if($rootScope.getDetails !== '') {
    for (var i = 0; i < $rootScope.getDetails.length; i++) {
    if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {

    $rootScope.insuranceMode = 'on';
    }
    //if ($rootScope.getDetails[i] === 'PaymentPageBeforeWaitingRoom') {
    if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
    $rootScope.paymentMode = 'on';
    }
    if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
    $rootScope.onDemandMode = 'on';
    }
    }
    }
    $state.go('tab.appoimentDetails');


    },
    error: function (data) {
    $rootScope.serverErrorMessageValidation();
    }
    };
    LoginService.getHospitalInfo(params);
    }*/


    $rootScope.GoToappoimentDetailsFromUserHome = function(scheduledListData, fromPreviousPage) {
        $rootScope.AppointScheduleTime = '';
        $rootScope.scheduledListDatas = scheduledListData;
        var currentTime = $rootScope.scheduledListDatas.scheduledTime;
        var getMinsExtraTime = $scope.addMinutes(currentTime, 30);
        var getEnterTime = new Date();
        var getMissedAppointmentExpiryTime = ((new Date(getMinsExtraTime).getTime()) - (getEnterTime.getTime()));
        if (getMissedAppointmentExpiryTime > 0) {
            $rootScope.AppointScheduleTime = getMissedAppointmentExpiryTime;
        } else {
            $rootScope.AppointScheduleTime = '';
        }

        //$scope.doGetUserHospitalInformationForUserHome();
        $rootScope.appointPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[0].customCode.description);
        $rootScope.appointSecondConcern = $rootScope.scheduledListDatas.intakeMetadata.concerns[1];
        if ($rootScope.appointSecondConcern == '' || typeof $rootScope.appointSecondConcern == 'undefined') {
            $rootScope.appointSecondConcern = 'None Reported';
        } else {
            $rootScope.appointSecondConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[1].customCode.description);
        }
        $rootScope.appointNotes = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.additionalNotes);
        if ($rootScope.appointNotes == '' || typeof $rootScope.appointNotes == 'undefined') {
            $rootScope.appointNotes = 'None Reported';
        } else {
            $rootScope.appointNotes = $rootScope.scheduledListDatas.intakeMetadata.additionalNotes;
        }
        if (!angular.isUndefined($rootScope.scheduledListDatas.patientId)) {
            $rootScope.patientId = $rootScope.scheduledListDatas.patientId;
        } else {
            $rootScope.patientId = $rootScope.patientId;
        }
        $scope.doGetConutriesList();
        $rootScope.doGetCreditDetails();
        $rootScope.passededconsultants();
        $rootScope.doGetLocations();
        $rootScope.doGetonDemandAvailability();
        $rootScope.doGetIndividualScheduledConsulatation();
        $rootScope.doGetListOfCoUsers();
        //  $rootScope.doGetSelectedPatientProfiles($rootScope.patientId, '', '');
        if (fromPreviousPage != "AppointmentPage") {
            $rootScope.doGetConsultationId($rootScope.scheduledListDatas.appointmentId, $rootScope.scheduledListDatas.participants[0].person.id, 'tab.appoimentDetails');
        }
        //$state.go('tab.appoimentDetails');
    };


    // var dtNow = new Date("2015-06-11T13:58:04.268Z");
    //$rootScope.time = dtNow.getTime();




    $scope.doGetWaitingRoom = function() {
        /*
  var params = {
  accessToken: $rootScope.accessToken,
  consultationID: $rootScope.consultationId,
  eventType: PATIENT_CONSULTATION_EVENT_TYPE_ID,
  event: WAITING_CONSULTATION_EVENT_CODE,
  success: function (data) {
  $state.go('tab.waitingRoom');
},
error: function (data) {
$rootScope.serverErrorMessageValidation();
}
};
LoginService.updateConsultationEvent(params);
*/
        $state.go('tab.waitingRoom');
    }

    $scope.doRefreshReportDetails = function() {
        $rootScope.doGetExistingConsulatationReport();
        $timeout(function() {
            //$scope.getScheduledDetails($rootScope.patientId);
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
        $scope.$apply();
    }

    $rootScope.EnableBackButton = function() {
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('tab.userhome');
        //  $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');
        $state.go('tab.userhome');
    }

    $rootScope.doGetAttachmentURL = function(fileId) {
        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            attachmentFileId: fileId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                var fileUrl = data.data[0].url;
                if (fileUrl.indexOf('https://') < 0)
                    fileUrl = apiCommonURL + fileUrl;
                window.open(fileUrl, '_system', 'location=yes');
            },
            error: function(data, status) {
                if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getAttachmentURL(params);

    }


})



.directive('inputMaxLengthNumber', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModelCtrl) {
            function fromUser(text) {
                var maxlength = Number(attrs.maxlength);
                if (String(text).length >= maxlength) {
                    var newString = String(text).substr(0, maxlength);
                    ngModelCtrl.$setViewValue(newString);
                    ngModelCtrl.$render();
                    return ngModelCtrl.$modelValue;
                }
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})



.directive('creditCardExpirationEntry', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModelCtrl) {
            function fromUser(text) {
                var newVal = String(text);
                if (typeof oldLength !== "undefined") {
                    if (oldLength !== 3 && String(text).length === 2) {

                        //newVal = newVal.substr(0,2) + "/" + newVal.substr(2, newVal.length);//
                        newVal = String(text) + "/";
                    }
                }
                if (String(text).length === 1) {
                    oldLength = 7;
                } else {
                    oldLength = String(text).length;
                }
                ngModelCtrl.$setViewValue(newVal);
                ngModelCtrl.$render();
                return newVal;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})


.filter('ageFilter', function() {
    function getAge(dateString) {
        var now = new Date();
        var today = new Date(now.getYear(), now.getMonth(), now.getDate());

        var yearNow = now.getYear();
        var monthNow = now.getMonth();
        var dateNow = now.getDate();

        var dob = new Date(dateString.substring(6, 10),
            dateString.substring(0, 2) - 1,
            dateString.substring(3, 5)
        );

        var yearDob = dob.getYear();
        var monthDob = dob.getMonth();
        var dateDob = dob.getDate();
        var age = {};
        var ageString = "";
        var yearString = "";
        var monthString = "";
        var dayString = "";


        yearAge = yearNow - yearDob;

        if (monthNow >= monthDob)
            var monthAge = monthNow - monthDob;
        else {
            yearAge--;
            var monthAge = 12 + monthNow - monthDob;
        }

        if (dateNow >= dateDob)
            var dateAge = dateNow - dateDob;
        else {
            monthAge--;
            var dateAge = 31 + dateNow - dateDob;

            if (monthAge < 0) {
                monthAge = 11;
                yearAge--;
            }
        }

        age = {
            years: yearAge,
            months: monthAge,
            days: dateAge
        };

        yearString = "y";
        monthString = "m";

        /*if ( age.years < 10 ) years = '0' + age.years;
  else years = age.years;
  if ( age.months < 10 ) month = '0' + age.months;
  else month = age.months;
  if ( age.days > 1 ) dayString = " days";
  else dayString = " day";



  if(age.years === 0 ) {
  if(age.days <= 15) {
  return ageString =  age.months + monthString;
} else if (age.days > 15) {
var ageMonth =  (age.months + 1);
if ( ageMonth < 10 ) return ageString = '0' + ageMonth + monthString;
else return ageString = ageMonth + monthString;
}
}
if (age.years > 0) {
if(age.days <= 15) {
var month =  month + monthString;
} else if (age.days > 15) {
//var month =  (month + 1) + monthString;
var ageMonth =  (age.months + 1);
if ( ageMonth < 10 ) var month = '0' + ageMonth + monthString;
else var month = ageMonth + monthString;
}
return ageString = age.years + yearString +'/'+ month; }
*/


        if (age.years === 0) {
            if (age.days <= 15) {
                return ageString = age.months + monthString;;
            } else if (age.days > 15) {
                return ageString = (age.months + 1) + monthString;;
            }
        }
        if (age.years > 0) {
            if (age.days <= 15) {
                var month = age.months + monthString;;
            } else if (age.days > 15) {
                var month = (age.months + 1) + monthString;;
            }
            //return ageString = age.years + yearString + '/' + month;
            if (age.months !== 0) {
                return ageString = age.years + yearString + '/' + month;
            } else {
                return ageString = age.years + yearString;
            }

        }



    }

    return function(birthdate) {
        var BirthDate = new Date(birthdate);

        var year = BirthDate.getFullYear();
        var month = BirthDate.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        } else {
            month = month;
        }
        var date = BirthDate.getDate();
        if (date < 10) {
            date = '0' + date;
        } else {
            date = date;
        }

        var newDate = month + '/' + date + '/' + year;

        var age = getAge(newDate);
        return age;
    };
})

.directive('googlePlaces', function() {
    return {
        restrict: 'E',
        replace: true,
        // transclude:true,
        scope: {
            location: '='
        },
        template: '<input id="google_places_ac" name="google_places_ac" ng-model="google_places_ac" type="text" class="input-block-level" required  />',
        link: function($scope, elm, attrs) {
            var input = document.getElementById('google_places_ac');
            var autocomplete = new google.maps.places.Autocomplete(input, {
                types: ['(regions)'],
                componentRestrictions: {
                    country: "US"
                }
            });
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                $scope.$apply();
            });
        }
    }
})

// Array Of Countries Filter
.filter('arrayContries', function() {
    return function(items, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
})


.filter('truncate', function() {
        return function(input, characters) {
            if (input.length > characters) {
                return input.substr(0, characters) + '...';
            }

            return input;
        };
    })
    // Special Charctor Remove Filter //
    .filter('filterHtmlChars', function() {
        return function(html) {
            var filtered = angular.element('<div>').html(html).text();
            return filtered;
        }
    })

.directive('siteHeader', function() {
    return {
        restrict: 'E',
        template: '<a class="button_new icon ion-chevron-left"><span>{{back}}</span></a>',
        scope: {
            back: '@back',
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
        }
    };
})

.directive('siteHeader1', function() {
    return {
        restrict: 'E',
        template: '<a class="headerval"><span style="margin-left: 3px;">{{back}}</span></a>',
        scope: {
            back: '@back',
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
        }
    };
})

.directive('siteHeaderIos', function() {
        return {
            restrict: 'E',
            template: '<a class="headerval" style="top: -5px !important;"><span style="margin-left: 3px;">{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function(scope, element, attrs) {
                $(element[0]).on('click', function() {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })
    .directive('siteHeader2', function() {
        return {
            restrict: 'E',
            template: '<a class="button_new icon PlanCancel" ><span>{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function(scope, element, attrs) {
                $(element[0]).on('click', function() {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })
    .directive('siteHeaderConcernBack', function() {
        return {
            restrict: 'E',
            template: '<a class="button_new icon ion-chevron-left"><span> {{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function(scope, element, attrs) {
                $(element[0]).on('click', function() {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })



.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}])

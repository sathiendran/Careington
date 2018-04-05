var indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
    }
    return -1;
}
// request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
// request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
var api_keys_env = '';
var session = null;
var publisher = null;
var isSSProviderListLoaded = false;
if (deploymentEnv === "Sandbox" || deploymentEnv === "Multiple" || deploymentEnv === "QA" || deploymentEnv === "QA1" || deploymentEnv === "QA2" ) {
    var util = {

        setHeaders: function (request, credentials) {
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
                //  request.defaults.headers.post['Time-Zone'] = 'West Asia Standard Time';
                return request;
            }
        },
        getHeaders: function (accessToken) {
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
                    //  'Time-Zone' : 'West Asia Standard Time'
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
        setHeaders: function (request, credentials) {
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
        getHeaders: function (accessToken) {
            if (api_keys_env === 'Production') {
                var headers = {
                    'X-Developer-Id': '1f9480321986463b822a981066cad094',
                    'X-Api-Key': 'd3d2f653608d25c080810794928fcaa12ef372a2',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            } else if (api_keys_env === 'Staging') {
                var headers = {
                    'X-Developer-Id': 'cc552a3733af44a88ccb0c88ecec2d78',
                    'X-Api-Key': '1dc3a07ce76d4de432967eaa6b67cdc3aff0ee38',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                if (typeof accessToken !== 'undefined') {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                return headers;
            }
        }
    }
} else if (deploymentEnv === "Single") {
    var util = {
        setHeaders: function (request, credentials) {
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
        getHeaders: function (accessToken) {
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
            } else if (api_keys_env === 'Production') {
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

} else if (deploymentEnv === "Demo") {
    var util = {
        setHeaders: function (request, credentials) {
            if (typeof credentials !== 'undefined') {
                request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
            }
            request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            request.defaults.headers.post['X-Developer-Id'] = 'f92f6017f3f043809e0f317c1d0cde4c';
            request.defaults.headers.post['X-Api-Key'] = 'ddc9e736777f130b97f7fff5976c5bc9e7f3b337';
            return request;
        },
        getHeaders: function (accessToken) {
            var headers = {
                'X-Developer-Id': 'f92f6017f3f043809e0f317c1d0cde4c',
                'X-Api-Key': 'ddc9e736777f130b97f7fff5976c5bc9e7f3b337',
                'Content-Type': 'application/json; charset=utf-8'
            };
            if (typeof accessToken !== 'undefined') {
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

angular.module('ngIOS9UIWebViewPatch', ['ng']).config(function ($provide) {
    $provide.decorator('$browser', ['$delegate', '$window', function ($delegate, $window) {

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

            browser.url = function () {
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
    $rootScope.backColor = '#DD472D';
    apiCommonURL = 'https://connectedcare.md';
    api_keys_env = "Production";
} else if (deploymentEnv === "QA") {
    //apiCommonURL = 'https://snap-qa.com';
    apiCommonURL = 'https://emerald.qa1.snapvcm.com';
} else if (deploymentEnv === "Single") {
    if (deploymentEnvForProduction === 'Production') {
        apiCommonURL = 'https://connectedcare.md';
        api_keys_env = "Production";
    } else if (deploymentEnvForProduction === 'Staging') {
        apiCommonURL = 'https://emerald.stage.snapvcm.com';
        api_keys_env = "Staging";
    } else if (deploymentEnvForProduction === 'QA') {
        //apiCommonURL = 'https://snap-qa.com';
        apiCommonURL = 'https://emerald.qa1.snapvcm.com';
        api_keys_env = "QA";
    } else if (deploymentEnvForProduction === 'Sandbox') {
        //  apiCommonURL = 'https://hello420.sandbox.connectedcare.md';
        apiCommonURL = 'https://sandbox.connectedcare.md';

        api_keys_env = "Sandbox";
    }
} else if (deploymentEnv === "Staging") {

    apiCommonURL = 'https://emerald.stage.snapvcm.com';
    api_keys_env = "Staging";
}

angular.module('starter.controllers', ['starter.services', 'ngLoadingSpinner', 'timer', 'ion-google-place', 'ngIOS9UIWebViewPatch', 'ngCordova', 'ngIdle', 'ngStorage'])

    .controller('LoginCtrl', function ($scope, $ionicScrollDelegate, $sce, htmlEscapeValue, $location, $window, ageFilter, ageFilterReport, replaceCardNumber, get2CharInString, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar, CreditCardValidations, $ionicPopup) {
        $("#localize-widget").show();


        //venkat start
        $(".accoTitle-IOS").css("margin-top", "4px");

        var localizeCurrent = $('#localize-current').text();
        console.log("localizeCurrent =" + localizeCurrent);
        if ($(window).width() <= 375) {
            if (localizeCurrent == "Español") {
                $scope.whoNeedsText = "font-size:17px";
                $scope.consentTitleFont = "font-size:17px !important";
                $(".newProviderSub").css("padding-bottom", "16px");
                $(".ConcernsFooter .FooterCenter a").css("padding-left", "1px");
            }
            else if (localizeCurrent == "English (UK)") {
                $scope.whoNeedsText = "font-size:21px";
            }
            else if (localizeCurrent == "English") {
                $scope.whoNeedsText = "font-size:21px";
            }
            // else {
            //     $scope.whoNeedsText = "font-size:21px";
            //     $scope.consentTitleFont = "font-size:20px !important";
            //     $(".newProviderSub").css("padding-bottom", "33px");
            //     $(".ConcernsFooter .FooterCenter a").css("padding-left", "10px");
            // }
        } else {
            $scope.consentTitleFont = "font-size:21px !important";
        }

        $('#localize-langs').click(function () {
            if ($(window).width() <= 375) {
                var isLang = $('#localize-langs .activated').text();
                if (isLang == "Español") {
                    $("#whoNeedsTextval").css("font-size", "17px");
                    $(".newProviderSub").css("padding-bottom", "16px");
                    $(".ConcernsFooter .FooterCenter a").css("padding-left", "1px");
                }
                else if (isLang == "English (UK)") {
                    $("#whoNeedsTextval").css("font-size", "21px");
                }
                else if (isLang == "English") {
                    $("#whoNeedsTextval").css("font-size", "21px");
                }

                //    else {
                //        $("#whoNeedsTextval").css("font-size", "21px");
                //        $(".newProviderSub").css("padding-bottom", "33px");
                //        $(".ConcernsFooter .FooterCenter a").css("padding-left", "10px");
                //    }
                isLang = "";
            }
        });
        //venkat end


        //venket
        var localizeCurrent = $('#localize-current').text();
        var myLength = $(".departmentClassVal").text().length;
        console.log("myLength =" + myLength);
        if ($(window).width() <= 375) {
            if (localizeCurrent == "Español") {
                //   console.log("Español");
                //  $scope.ReportEthnicityVal = "width:36.33%";
            } else {
                ///  $scope.ReportEthnicityVal = "width:41.33%";
            }
            /* if(myLength >= 11) {
             //    console.log("myLength  is more=");
               if(localizeCurrent == "Español") {
             //      console.log("Español");
                   $scope.departmentClass = "height:45px";
               } if(localizeCurrent == "English (UK)") {
                   $scope.departmentClass = "height:25px";
               } if(localizeCurrent == "English") {
                   $scope.departmentClass = "height:25px";
               }
             }*/
        } else {
            if (localizeCurrent == "Español") {
            } else {
            }
        }

        $('#localize-langs').click(function () {
            ///    console.log("myLength ="+myLength);
            if ($(window).width() <= 375) {
                var isLang = $('#localize-langs .activated').text();
                var myLength = $(".departmentClassVal").text().length;
                //console.log("val ="+$(".departmentClassVal").text());
                //console.log("myLength ="+myLength);
                if (isLang == "Español") {
                    //console.log("Español");
                    //       $scope.ReportEthnicityVal = "width:36.33%";
                } else {
                    // $scope.ReportEthnicityVal = "width:41.33%";
                }
                if (myLength >= 11) {
                    //  console.log("myLength  is more=");
                    if (isLang == "Español") {
                        $scope.departmentClass = "height:45px";
                    } else {
                        $scope.departmentClass = "height:25px";
                    }
                    isLang = "";
                }
            }
        });


        $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        if ($rootScope.chkSSPageEnter) {
            $rootScope.chkSSPageEnter = false;
            $ionicSideMenuDelegate.toggleLeft();
        }
        isSSProviderListLoaded = false;
        window.localStorage.setItem('isVideoCallProgress', "No");
        window.localStorage.setItem("isCustomerInWaitingRoom", "No");
        $rootScope.is_iPadDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        $rootScope.drawSVGCIcon = function (iconName) {
            return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        };

        //  $scope.formatIsdCode = (s,c,n) => (s.length<n) ? s+c.repeat(n-s.length):


        $rootScope.drawImage = function (imagePath, firstName, lastName) {
            $('.patProfileImage').css({
                'background-color': $rootScope.brandColor
            });
            var Name = getInitialFromName(firstName, lastName);
            if (Name === 'WW') {
                Name = 'W';
            }
            if (!angular.isUndefined(imagePath) && imagePath !== '') {
                if (imagePath.indexOf("api") >= 0) {
                    var image = imagePath;
                    return "<img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'>";
                    //return $sce.trustAsHtml("<div class='patProfileImage'><span> <img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'></sapn></div>");
                } else {
                    return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
                }
            } else {
                $rootScope.isImageFound = false;
                return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
            }
        };

        $rootScope.drawImageIntake = function (imagePath, firstName, lastName) {
            $('.patProfileImageIntake').css({
                'background-color': $rootScope.brandColor
            });
            var Name = getInitialFromName(firstName, lastName);
            if (Name === 'WW') {
                Name = 'W';
            }
            if (!angular.isUndefined(imagePath) && imagePath !== '') {
                if (imagePath.indexOf("api") >= 0) {
                    var image = imagePath;
                    return "<img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'>";

                    //return $sce.trustAsHtml("<div class='patProfileImage'><span> <img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'></sapn></div>");
                } else {
                    return $sce.trustAsHtml("<div class='patProfileImageIntake'><span>" + Name + "</sapn></div>");
                }
            } else {
                return $sce.trustAsHtml("<div class='patProfileImageIntake'><span>" + Name + "</sapn></div>");
            }
        };

        $scope.obj = { language_selected: { 'name': 'Choose a language' } };
        $scope.language_list = [{ 'name': 'english', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/gb.png' }, { 'name': 'italian', 'url': 'http://www.gravatar.com/avatar/b3e04a46e85ad3e165d66f5d927eb609?d=monsterid&amp;r=g&amp;s=16&apos' }];
        $rootScope.drawImageSS = function (imagePath, firstName, lastName) {
            $('.patProfileImageSS').css({
                'background-color': $rootScope.brandColor
            });
            var Name = getInitialFromName(firstName, lastName);
            if (Name === 'WW') {
                Name = 'W';
            }
            if (!angular.isUndefined(imagePath) && imagePath !== '') {
                if (imagePath.indexOf("api") >= 0) {
                    var image = imagePath;
                    return "<img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'>";
                } else {
                    return $sce.trustAsHtml("<div class='patProfileImageSS'><span>" + Name + "</sapn></div>");
                }
            } else {
                return $sce.trustAsHtml("<div class='patProfileImageSS'><span>" + Name + "</sapn></div>");
            }
        };

        $rootScope.drawSVGCIconForVideo = function (iconName) {
            return "<svg class='icon-" + iconName + " svgIcon" + iconName + " svgIconForVideo'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        };

        $scope.language_list = [{ 'name': 'english', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/gb.png' }, { 'name': 'italian', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/it.png' }];
        $rootScope.canceloption = function () {
            $window.history.back();
            $scope.apply();
        }
        $rootScope.deploymentEnv = deploymentEnv;
        if (deploymentEnv !== 'Multiple') {
            $rootScope.APICommonURL = apiCommonURL;

        }
        $rootScope.envList = ["Snap.QA1", "Snap.QA2", "Sandbox", "Staging", "Snap-test", "Snap-azure-Dev2"];

        $scope.ChangeEnv = function (env) {
            $rootScope.backColor = '#DD472D';
            $window.localStorage.setItem('tokenExpireTime', '');
            if (env === "Snap.QA1") {
                //  $rootScope.APICommonURL = 'https://snap-qa.com';
                //  apiCommonURL = 'https://snap-qa.com';
                $rootScope.APICommonURL = 'https://emerald.qa1.snapvcm.com';
                apiCommonURL = 'https://emerald.qa1.snapvcm.com';
                api_keys_env = "Snap.QA";
            } else if (env === "Snap.QA2") {
                //  $rootScope.APICommonURL = 'https://snap-qa.com';
                //  apiCommonURL = 'https://snap-qa.com';
                $rootScope.APICommonURL = 'https://emerald.qa2.snapvcm.com';
                apiCommonURL = 'https://emerald.qa2.snapvcm.com';
                api_keys_env = "Snap.QA";
            } else if (env === "Sandbox") {
                $rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
                apiCommonURL = 'https://sandbox.connectedcare.md';
                api_keys_env = "Sandbox";
            } else if (env === "Staging") {
                $rootScope.APICommonURL = 'https://emerald.stage.snapvcm.com';
                apiCommonURL = 'https://emerald.stage.snapvcm.com';
                api_keys_env = "Staging";
            } else if (env === "Snap-test") {
                $rootScope.APICommonURL = 'https://snap-test.com';
                apiCommonURL = 'https://snap-test.com';
                api_keys_env = "Snap.QA";
            } else if (env === "Snap-azure-Dev2") {
                //  $rootScope.APICommonURL = 'https://connectedcarepilotweb2.azurewebsites.net';
                //  apiCommonURL = 'https://connectedcarepilotweb2.azurewebsites.net';
                //   $rootScope.APICommonURL = 'https://emerald.qa1.snapvcm.com';
                //               apiCommonURL = 'https://emerald.qa1.snapvcm.com';
                //               api_keys_env = "Snap.QA";

                $rootScope.APICommonURL = 'https://emerald.dev2.snapvcm.com';
                apiCommonURL = 'https://emerald.dev2.snapvcm.com';
                api_keys_env = "Snap.QA";

            }
            snap.baseUrl = apiCommonURL;
            $state.go('tab.login');
        };

        $window.localStorage.setItem('ChkVideoConferencePage', "");
        $rootScope.currState = $state;
        $rootScope.monthsList = CustomCalendar.getMonthsList();
        $rootScope.EditSurgerymonthsList = CustomCalendar.getMonthsListforSurgery();
        $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
        $window.localStorage.setItem('AndroidDevice', ionic.Platform.isAndroid());
        $rootScope.IOSDevice = ionic.Platform.isIOS();
        $rootScope.AndroidDevice = ionic.Platform.isAndroid();
        $rootScope.WindowsPhone = ionic.Platform.isWindowsPhone();
        $rootScope.isWebView = ionic.Platform.isWebView();
        $rootScope.isIPad = ionic.Platform.isIPad();
        $rootScope.isWindow = true;

        /******** Prabin: Code to implement static brand color, logo and tagline. *******/
        if (deploymentEnvLogout === 'Single') {
            if ($rootScope.currState.$current.name === "tab.loginSingle") {
                $rootScope.brandColor = brandColor;
                $rootScope.logo = logo;
                $rootScope.HospitalTag = HospitalTag;
                $rootScope.Hospital = Hospital;
                $rootScope.alertMsgName = Hospital;
                $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
            } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === 'Single' && $rootScope.currState.$current.name === "tab.login") {
                $rootScope.HospitalTag = HospitalTag;
                $rootScope.Hospital = Hospital;
                $rootScope.alertMsgName = Hospital;
                $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
            }
        } else {
            $rootScope.alertMsgName = 'Virtual Care';
            $rootScope.reportHospitalUpperCase = 'Virtual Care';
        }


        window.addEventListener('native.keyboardshow', function () {
            $scope.$apply(function () {
                $("#localize-widget").hide();
            });

        })
        window.addEventListener('native.keyboardhide', function () {
            $scope.$apply(function () {
                $("#localize-widget").show();
            });
        });


        /******** Code to implement static brand color ends here **********/

        if ($rootScope.IOSDevice || $rootScope.isIPad) {
            $rootScope.online = navigator.onLine;
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
            // $rootScope.patient_subHeaderTopMove = "margin-top: 1px !important;";
            $rootScope.intakeTittle = "intakeTittleIOS";
            $rootScope.MenuInnerStyle = "top: 0px;";
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
            $rootScope.PaymentStyle = "padding: 0px; margin-top: 132px;	background-color: #fff; top: 13px;";
            $rootScope.HeadercardDetails = "height: 69px;";
            $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
            $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
            $rootScope.AddHealthPlanCancel = "margin-top: 6px";
            $rootScope.ReportScreen = "top: 1px; position: relative;";
            $rootScope.PlanDetails = "margin-top: 22px;";
            $rootScope.SubDetailsPlanDetails = "margin-top: -16px;";
            $rootScope.PatientTitle = "margin-left:-40px;";
            $rootScope.MenuIconBottomRecipt = "top: -4px;";
            $rootScope.PatientConcerns = "margin-top: 90px;";
            $rootScope.GoogleSearchStyle = "top: 24px;";
            $rootScope.BackgroundColorGoogle = "background-color: #fff;";
            $rootScope.GoogleSearchContent = "top: 55px;";
            $rootScope.NextButtonReduce = "right: 5px;";
            $rootScope.CardDetailsNextButton = "left: 0px;margin-top: 13px;";
            $rootScope.IntakeFormInnerStyleTitle = "top: 18px;position: relative;";

            $rootScope.ContentOverlop = "margin: 147px 0 0 0;";
            $rootScope.ContentConsultCharge = "margin: 141px 0 0 0; padding-top: 43px;";
            $rootScope.usHomeCOntent = "margin: 75px 0 0 0 !important;";
            if ($rootScope.IOSDevice) {
                $rootScope.patientConternFontStyle = "patientConternFontStyle-ios";
                $rootScope.concernListTitleStyle = "concernListTitle-ios";
                $rootScope.concernListDoneStyle = "concernListDone-ios";
                //$rootScope.PrimaryConcernPopupH = "height: 66px;";
                $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
                $rootScope.PrimaryConcernPopupTitle = "margin-top: 7px; font-family: 'Glober SemiBold'; ";
                $rootScope.PrimaryConcernPopupDone = "margin-top: 10px; padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.surgeryConcernPopupDone = "padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.PriorSurgeryPopupTitle = "margin-top: 16px;";
                $rootScope.PriorSurgeryPopupDone = "margin-top: 21px;";
                $rootScope.PriorSurgeryPopupCancel = "margin-top: 3px;  padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.ChronicConditionPopupTitle = "margin-top: 13px;";
                $rootScope.ChronicConditionPopupDone = "margin-top: 13px;";
                //  $rootScope.NextIntakeForm = "margin-left: -21px;";
                $rootScope.LoginContant = "padding-top: 43px !important; margin: 99px 0 0 0;"; //margin: 30px 0 0 0 remove
                $rootScope.LoginContantDiv = "height: 50px;"; //95px
                $rootScope.PasswordOverlop = "margin: 105px 0 0 0 !important;";
                $rootScope.PriorSurgeryPopupTextBox = "margin-top: 0px;";
                $rootScope.PriorSurgeryPopupTextBox = "margin-top: 0px;";
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
                $rootScope.ConcernFooterNextIOS = "margin-left: -46px !important; left: -15px !important;";
                $rootScope.providerItamMarginTop = "top: 5px;";
                $rootScope.PrimaryConcernPopupTitleIOSDeviHeader = "height: 64px !important;";
                $rootScope.rightHeaderIconIOS = "margin-top: 18px !important;";
                $rootScope.leftHeaderIconIOS = "margin-top: 22px !important;";
                $rootScope.concernListTitleiosDevices = "margin-top: 16px !important;";
                $rootScope.concernListContentIOS = "margin-top: 55px !important;";
                $rootScope.InputboxPaddingIOS = "padding-top: 12px !important;";
                $rootScope.concernListSearchIconIOS = "bottom: -4px !important;";
                $rootScope.concernListTitleiosprior = "top: 14px !important;"
                $rootScope.surgeryTopAddButtonIOS = "top: 23px !important;height: 30px !important;";
                $rootScope.termsCondtion = "margin-top: 7px !important;";
                $rootScope.HomeHeaderIOS =	"top: 7px !important";
                $rootScope.HomeBackIOS =	"top: 4px; !important";
                $rootScope.HomeUserIconIOS =	"top: 19px; !important";
               
            }
            if ($rootScope.isIPad) {
                $rootScope.PrimaryConcernPopupH = "height: 66px;";
                $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
                $rootScope.PrimaryConcernPopupTitle = "margin-top: 6px; font-family: 'Glober SemiBold'; ";
                $rootScope.PrimaryConcernPopupDone = "margin-top: 8px; padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.surgeryConcernPopupDone = "padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.PriorSurgeryPopupTitle = "margin-top: 0px;";
                $rootScope.PriorSurgeryPopupDone = "margin-top: 6px;";
                $rootScope.PriorSurgeryPopupCancel = "margin-top: 2px; padding-right: 0px; padding-left: 0px;padding: 0px;";
                $rootScope.ChronicConditionPopupTitle = "margin-top: 6px;";
                $rootScope.ChronicConditionPopupDone = "margin-top: 10px;";
                $rootScope.FootNextButtonRight = "margin-left: -87px !important;";
                $rootScope.FootNextButton = "left: 22px;";
                $rootScope.FootNextButtonPatient = "left: 3px;";
                $rootScope.IpadInsurncepageCenter1 = "margin-top: 113px;";
                $rootScope.IpadInsurncepageCenter = "margin-top: 30px;";
                $rootScope.IpadInsurncepageYourCopy = "margin-left: -7% !important;"
                $rootScope.IpadInsurncepageCenterAddcard = "margin-top: 80px;";
                $rootScope.IpadInsurncepageCenterAddcardButton = "padding-top: 10% !important;"
                $rootScope.IpadInsurncepageContsultation = "margin-left: 230px !important;margin-top: 70px !important";
            }
            $rootScope.PriorSurgeryContant = "margin-top: 53px;";
            $rootScope.CardDetailYear = "padding-left: 11px;";
            $rootScope.CardDetailmonth = "padding-right: 11px;";
            $rootScope.CountrySearchItem = "top: 13px;";
            $rootScope.ConstantTreat = "font-size: 16px;";
            $rootScope.NeedanAcountStyle = "NeedanAcount_ios";
            $rootScope.calendarBackStyle = "top: 13px !important;";
            $rootScope.userAccNewTitle = "margin-top: -10px;"
        } else if ($rootScope.AndroidDevice) {
            $rootScope.online = navigator.onLine;
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
            $rootScope.PriorSurgeryPopupCancel = "padding-right: 0px; padding-left: 0px;padding: 0px;";
            $rootScope.PatientTitle = "margin-left:-45px;"
            $rootScope.PasswordOverlop = "margin: 57px 0 0 0;";
            $rootScope.resetContent = "margin: 202px 0 0 0;";
            $rootScope.NeedanAcountStyle = "NeedanAcount_android";
            $rootScope.calendarBackStyle = "";
            $rootScope.patientConternFontStyle = "patientConternFontStyle";
            $rootScope.concernListTitleStyle = "concernListTitle";
            $rootScope.concernListDoneStyle = "concernListDone";
            $rootScope.PrimaryMarginTop = "margin-top: -16px";
            //$rootScope.ConcernFooterNextIOS = "margin-left: -22px !important; left: -34px !important;";
            $rootScope.appointContent = "margin: 76px 0 0 0;";
            $rootScope.waitingContentIos = "margin-top: 120px; ";
            $rootScope.providerItamMarginTop = "";
            $rootScope.appointCOntent = "margin-top:153px;";
            $rootScope.PaymentStyle = "padding: 0px; margin-top: 148px;	background-color: #fff; top: -2px;";
            $rootScope.conChargeMargin = "margin: 206px 0 0 0;";
            $rootScope.termsCondtion = "margin-top: 1px !important;";
            $rootScope.Useraccount =	"top: 13px; !important";
        }
        $scope.showSearchInput = function () {
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

                setTimeout(function () {
                    $("#divSearchInput").css("display", "none");
                }, 500);
            }
        };

        $ionicPlatform.registerBackButtonAction(function () {
            if (($rootScope.currState.$current.name === "tab.userhome") ||
                ($rootScope.currState.$current.name === "tab.addCard") ||
                ($rootScope.currState.$current.name === "tab.submitPayment") ||
                ($rootScope.currState.$current.name === "tab.waitingRoom") ||
                ($rootScope.currState.$current.name === "tab.receipt") ||
                ($rootScope.currState.$current.name === "tab.videoConference") ||
                ($rootScope.currState.$current.name === "tab.connectionLost") ||
                ($rootScope.currState.$current.name === "tab.ReportScreen") ||
                ($rootScope.currState.$current.name === "tab.CurrentLocationlist")
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
            } else if ($rootScope.currState.$current.name === "tab.cardDetails" || $rootScope.currState.$current.name === "tab.cardeditDetails") {
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
        $scope.currentstateview = true;

        /*$rootScope.checkAndChangeMenuIcon = function() {
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

        $rootScope.toggleLeft = function() {
            $rootScope.statename = $rootScope.currState.$current.name;
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($rootScope.statename === "tab.userhome") {
                $('.sideuserhome').addClass("uhome");

            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function() {
                    if ($rootScope.checkAndChangeMenuIcon) {
                        $rootScope.checkAndChangeMenuIcon();
                    }
                }, 300);
            }
        };*/


        $rootScope.checkAndChangeMenuIcon = function () {
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

        $rootScope.toggleLeft = function () {
            $rootScope.statename = $rootScope.currState.$current.name;
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($rootScope.statename === "tab.userhome") {
                $('.sideuserhome').addClass("uhome");

            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function () {
                    if ($rootScope.checkAndChangeMenuIcon) {
                        $rootScope.checkAndChangeMenuIcon();
                    }
                }, 300);
            }
        };

        // // // $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        // if($rootScope.chkSSPageEnter) {
        //    $ionicSideMenuDelegate.toggleLeft();
        // }

        $scope.doRefreshUserHome = function () {
            $rootScope.doGetPatientProfiles();
            //  $rootScope.cuttlocations = "tab.ReportScreen";
            //$rootScope.doGetRelatedPatientProfiles('tab.userhome');
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            //  $scope.$apply();
        };


        $rootScope.ClearRootScope = function () {
            $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
            $(".overlay").css({ "display": "none" });
            $rootScope.checkSession = true;
            $rootScope.registedPwd = '';
            $rootScope.PatientIdentifiers = '';
            $rootScope.PatientidupdateList = '';
            if (typeof $scope.modal != 'undefined' && $scope.modal != '' && $scope.modal != null) {
                $scope.modal.remove();
            }
            $rootScope.sessionConsultConnection.start().done(function () {
                $rootScope.sessionRoomConHub.invoke('LogoutUser');
                // alert('hhh');
                $rootScope.accessToken = '';
                $rootScope.sessionRoomConHub = null;
                $rootScope.sessionConsultConnection = null;

            });

            if ($rootScope.chkSSPageEnter) {
                $rootScope.chkSSPageEnter = false;
                $ionicSideMenuDelegate.toggleLeft();
            }
            $rootScope.cuttlocations = ''
            $window.localStorage.setItem('tokenExpireTime', '');
            $(".ion-google-place-container").css({
                "display": "none"
            });
            //  if (deploymentEnvLogout === 'Single' && deploymentEnvForProduction === 'Production' && appStoreTestUserEmail === 'itunesmobiletester@gmail.com' && api_keys_env === 'Staging' && cobrandApp !== 'MDAmerica') {
            if ((deploymentEnvLogout === 'Single' && deploymentEnvForProduction === 'Production' && api_keys_env === 'Staging' && cobrandApp !== 'MDAmerica') && (appStoreTestUserEmail === 'itunesmobiletester@gmail.com' || appStoreTestUserEmail2 == 'snap.rinsoft.qaapptester@gmail.com')) {
                $rootScope.hospitalId = singleHospitalId;
                apiCommonURL = 'https://connectedcare.md';
                api_keys_env = 'Production';
                $rootScope.APICommonURL = 'https://connectedcare.md';
                $scope.doGetSingleHosInfoForiTunesStage('logOut');
            } else {
                if (deploymentEnvLogout === "Multiple") {
                    $state.go('tab.chooseEnvironment');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                    //$state.go('tab.login');
                    $state.go('tab.singleTheme');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
                    //$state.go('tab.loginSingle');
                    $state.go('tab.singleTheme');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else {
                    $state.go('tab.login');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                }
            }
            $rootScope.chkSSPageEnter = false;
            $ionicBackdrop.release();
            $rootScope = $rootScope.$new(true);
            $scope = $scope.$new(true);
            for (var prop in $rootScope) {
                if (prop.substring(0, 1) !== '$') {
                    delete $rootScope[prop];
                }
            }
            // });
        }


        //  if(typeof $rootScope.accessToken != 'undefined' && $rootScope.accessToken != '') {
        $rootScope.sessionConsultConnection = $.hubConnection();
        $rootScope.sessionRoomConHub = $rootScope.sessionConsultConnection.createHubProxy('sessionLimiterHub');
        $rootScope.sessionConsultConnection.url = $rootScope.APICommonURL + "/api/signalR/";
        $rootScope.sessionConsultConnection.qs = {
            "Bearer": $rootScope.accessToken,
            // "isMobile": true,
        };
        $rootScope.sessionRoomConHub.on("onConsultationReview", function () {
            // alert("The Provider is now reviewing the intake form.");
            $scope.$digest();
        });
        $rootScope.sessionRoomConHub.on("onCustomerDefaultWaitingInformation", function () {
            $scope.$digest();
        });
        $rootScope.sessionRoomConHub.on("onConsultationStarted", function () {
            $scope.$digest();
        });
        $rootScope.sessionConsultConnection.logging = true;
        window.whub = $rootScope.sessionConsultConnection;
        $rootScope.sessionConsultConnection.start({
            withCredentials: false
        }).then(function () {
            $rootScope.sessionConsultConnection.disconnected(function () {
                // console.log("hhhh");
                setTimeout(function () {
                    // if(activeConsultConnection && activeConsultConnection.start){
                    //   activeConsultConnection.start();
                    //console.log("iiii");
                    //   }
                }, 5000);
            });

        });

        $rootScope.sessionRoomConHub.on("onSessionTerminated", function (ip) {
            navigator.notification.alert(
                /* 'You have logged in on another device and ended this session.', */// message
                sessAlertMessage,
                function () {
                    $rootScope.ClearRootScope();
                    return;
                },
                $rootScope.alertMsgName, // title
                sessAlertDone // buttonName
            );
        });

        /*  sessionRoomConHub.on("forceLogout", function(ip) {
              alert("You might have logged in on another device.");
              window.console.log("You might have logged in on another device. IP: " + ip);
             $scope.getLogoutPopup();
             forceLogout();
          });*/

        $rootScope.sessionRoomConHub.on("sessionRegistered", function (ip) {
            //alert("sessionLimiterHub: Session limiter registered");
        });


        //   }

        /*  $('#Provider').change(function() {
              $('div.viewport1').text($("option:selected", this).text());
          });*/
        $scope.currentYear = new Date().getFullYear()
        $scope.currentMonth = new Date().getMonth() + 1
        $scope.months = $locale.DATETIME_FORMATS.MONTH
        $scope.ccinfo = {
            type: undefined
        }
        $scope.save = function () {
            if ($scope.paymentForm.$valid) { }
        }


        $scope.$on("callValidation", function (event, args) {
            $scope.errorMsg = args.errorMsg;
            $rootScope.Validation($scope.errorMsg);
        });

        $scope.$on("callPatientDetails", function (event, args) {
            $rootScope.doGetPatientProfiles();
            //  $rootScope.doGetRelatedPatientProfiles('tab.userhome');
            $rootScope.hasRequiredFields = true;
            $rootScope.viewmyhealthDisplay = 'none';
            $rootScope.viewhealthDisplay = 'block';
            $("#HealthFooter").css("display", "block");
        });

        $rootScope.Validation = function ($errorMsg) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            if ($errorMsg.length >= 50) {
                if ($rootScope.is_iPadDeviceWidth <= 320) {

                    var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent localizejs" style="font-size: 16px !important;margin-top: -2px !important;"> <i class="ion-alert-circled" style="font-size: 16px;"></i> <span class="localizejs">' + $errorMsg + '! </span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
                } else {
                    var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent localizejs" style="font-size: 16px !important;margin-top: 6px !important;"> <i class="ion-alert-circled" style="font-size: 16px;"></i> <span class="localizejs">' + $errorMsg + '! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
                }
            } else {
                var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="localizejs">' + $errorMsg + '! </span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            }
            $("#notifications-top-center").remove();
            $("#Error_Message").append(top);
            refresh_close();

        }
        $rootScope.DynamicValidation = function ($errorMsg, $dynamicMsg) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            if ($errorMsg.length >= 50) {
                if ($rootScope.is_iPadDeviceWidth <= 320) {
                    var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent" > <i class="ion-alert-circled" style="font-size: 16px;"></i> <span class="localizejs"> ' + $errorMsg + '</span><span>' + $dynamicMsg + ' ! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
                } else {
                    var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent" > <i class="ion-alert-circled" style="font-size: 16px;"></i> <span class="localizejs"> ' + $errorMsg + '</span><span>' + $dynamicMsg + ' ! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
                }
            } else {
                var top = '<div id="notifications-top-center" class="notificationError"  ><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="localizejs"> ' + $errorMsg + '</span><span>' + $dynamicMsg + ' ! </span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            }
            $("#notifications-top-center").remove();
            $("#Error_Message").append(top);
            refresh_close();

        }


        $scope.$on("callServerErrorMessageValidation", function (event, args) {
            $rootScope.serverErrorMessageValidation();
        });

        $rootScope.serverErrorMessageValidation = function () {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();

            var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled localizejs" style="font-size: 22px;"></i> Unable to connect to the server. Please try again later! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Server_Error").append(top);
            refresh_close();

        }

        $rootScope.serverErrorMessageValidationForPayment = function () {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="loclaizejs">Invalid card details. Please correct and try again.!</span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Server_Error").append(top);
            refresh_close();

        }

        $rootScope.serverErrorMessageValidationForHealthPlanApply = function () {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();

            var top = '<div id="notifications-top-center" class="notificationError" style="height: 65px !important;"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="localizejs">Health Plan Enquiry failed! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Server_Error").append(top);
            refresh_close();

        }

        $rootScope.serverErrorMessageValidationForHealthPlanVerify = function () {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();

            var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i><span class="localizejs"> Unable to verify health plan. Please correct and try again.! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Server_Error").append(top);

            refresh_close();

        }


        $scope.$watch('userLogin.UserEmail', function (UserEmail) {
            if ($window.localStorage.getItem('username') == UserEmail) {
                if ($window.localStorage.getItem('username')) {
                    $rootScope.chkedchkbox = true;
                }
            }
            if ($window.localStorage.getItem('username') !== UserEmail) {
                $window.localStorage.setItem('username', "");
                $rootScope.chkedchkbox = false;
            } else {
                if ($("input[class=isRemChecked]").is(':checked') == true) {
                    $rootScope.chkedchkbox = true;
                }
            }


        });

        $('#UserEmail').val($window.localStorage.getItem('username'));

        $scope.userLogin = {};
        $scope.userLogin.UserEmail = $window.localStorage.oldEmail;
        $scope.LoginFunction = function () {
            $rootScope.viaNewUser = false;
            if ($('#UserEmail').val() === '') {
                $scope.ErrorMessage = "Please enter your email";
                $rootScope.Validation($scope.ErrorMessage);

            } else {
                $scope.ValidateEmail = function (email) {
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

        $scope.GetLoginFunctionDetails = function () {
            var usertconvetemail = $scope.userLogin.UserEmail.toString()
            if ($("input[class=isRemChecked]").is(':checked') === true) {
                $window.localStorage.setItem('username', $("#UserEmail").val());
                $window.localStorage.oldEmail = usertconvetemail;
                $rootScope.UserEmail = usertconvetemail;
                $rootScope.chkedchkbox = true;

            } else {
                $rootScope.UserEmail = usertconvetemail;

                $window.localStorage.oldEmail = '';
                $window.localStorage.setItem('username', "");
                $rootScope.chkedchkbox = false;
            }
            if (deploymentEnv === "Production") {
                //if (appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) {
                if ((appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) || (appStoreTestUserEmail2 !== '' && $("#UserEmail").val() === appStoreTestUserEmail2)) {
                    apiCommonURL = 'https://emerald.stage.snapvcm.com';
                    api_keys_env = 'Staging';
                    $rootScope.APICommonURL = 'https://emerald.stage.snapvcm.com';
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

        $scope.$on("callServiceUnAvailableErrorPage", function (event, args) {
            $scope.callServiceUnAvailableError();
        });

        $scope.callServiceUnAvailableError = function () {
            var url = serviceAPIError;
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        }


        $scope.checkSingleHospitalLogin = function () {

            if ($('#UserEmail').val() === '') {
                $scope.ErrorMessage = "Please enter an email";
                $rootScope.Validation($scope.ErrorMessage);

            } else {
                $scope.ValidateEmail = function (email) {

                    var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return expr.test(email);
                };
                if (!$scope.ValidateEmail($("#UserEmail").val())) {
                    $scope.ErrorMessage = "Please enter a valid email address";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($('#password').val() === '') {
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

        $scope.GetSingleLoginDetailsFOrCheckingMic = function () {
            if (deploymentEnvLogout === 'Single') {
                if (deploymentEnvForProduction === 'Production') {
                    //  if (appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) {
                    if ((appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) || (appStoreTestUserEmail2 !== '' && $("#UserEmail").val() === appStoreTestUserEmail2)) {
                        $rootScope.hospitalId = singleStagingHospitalId;
                        apiCommonURL = 'https://emerald.stage.snapvcm.com';
                        api_keys_env = 'Staging';
                        $rootScope.APICommonURL = 'https://emerald.stage.snapvcm.com';
                    } else {
                        $rootScope.hospitalId = singleHospitalId;
                        apiCommonURL = 'https://connectedcare.md';
                        api_keys_env = 'Production';
                        $rootScope.APICommonURL = 'https://connectedcare.md';
                    }
                } else if (deploymentEnvForProduction === 'Staging') {
                    $rootScope.hospitalId = singleStagingHospitalId;
                    api_keys_env = "Staging";
                } else if (deploymentEnvForProduction === 'QA') {
                    $rootScope.hospitalId = singleQAHospitalId;
                    api_keys_env = "QA";
                } else if (deploymentEnvForProduction === 'Sandbox') {
                    $rootScope.hospitalId = singleSandboxHospitalId;
                    api_keys_env = "Sandbox";
                }
            }
            var convertemail = $scope.userLogin.UserEmail.toString();
            if ($("input[class=isRemChecked]").is(':checked') === true) {
                $window.localStorage.setItem('username', $("#UserEmail").val());
                $window.localStorage.oldEmail = convertemail;
                $rootScope.UserEmail = convertemail;
                $rootScope.chkedchkbox = true;

            } else {
                $rootScope.UserEmail = convertemail;
                $window.localStorage.oldEmail = '';
                $window.localStorage.setItem('username', "");
                $rootScope.chkedchkbox = false;
            }
            //  if(appStoreTestUserEmail === 'itunesmobiletester@gmail.com' && api_keys_env === 'Staging') {
            if ((appStoreTestUserEmail === 'itunesmobiletester@gmail.com' || appStoreTestUserEmail2 === 'snap.rinsoft.qaapptester@gmail.com') && api_keys_env === 'Staging') {
                $scope.doGetToken();
            } else {
                $scope.doGetSingleHosInfoForiTunesStage('HosInfoForCoBrand');
            }
        }

        $scope.doGetSingleHosInfoForiTunesStage = function (HosForCoBrand) {
            $rootScope.paymentMode = '';
            $rootScope.insuranceMode = '';
            $rootScope.onDemandMode = '';
            $rootScope.OrganizationLocation = '';
            $rootScope.PPIsBloodTypeRequired = '';
            $rootScope.PPIsHairColorRequired = '';
            $rootScope.PPIsEthnicityRequired = '';
            $rootScope.PPIsEyeColorRequired = '';
            $rootScope.Cttonscheduled = '';
            $rootScope.onSSAvailability = '';
            $rootScope.InsVerificationDummy = '';
            $rootScope.InsuranceBeforeWaiting = '';
            $rootScope.HidePaymentPageBeforeWaitingRoom = '';
            $rootScope.HideForgotPasswordLink = '';
            $rootScope.BlankUserAccount = '';
            var params = {
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    if (!angular.isUndefined(data.data[0].customerSso) && data.data[0].customerSso === "Mandatory") {
                        $rootScope.customerSso = "Mandatory";
                        ssoURL = data.data[0].patientLogin;
                    } else {
                        $rootScope.customerSso = '';
                    }
                    if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                        $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                    } else {
                        $rootScope.isSSORegisterAvailable = '';
                    }
                    $rootScope.getDetails = data.data[0].enabledModules;
                    $rootScope.ssopatienttoken = data.data[0].patientTokenApi;
                    $rootScope.ssopatientregister = data.data[0].patientRegistrationApi;
                    $rootScope.ssopatientforgetpwd = data.data[0].patientForgotPasswordApi;
                    $rootScope.appointmentsContactNumber = data.data[0].appointmentsContactNumber;

                    if ($rootScope.getDetails !== '') {
                        for (var i = 0; i < $rootScope.getDetails.length; i++) {
                            if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                                $rootScope.insuranceMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                                $rootScope.InsuranceBeforeWaiting = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                                $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HideForgotPasswordLink' || $rootScope.getDetails[i] === 'mHideForgotPasswordLink') {
                                $rootScope.HideForgotPasswordLink = 'on';
                            }
                            /*if (($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') && ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand')) {
                                $rootScope.BlankUserAccount = 'on';
                            }*/
                            if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                                $rootScope.InsVerificationDummy = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                                $rootScope.paymentMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                                $rootScope.onDemandMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ShowCTTOnScheduled' || $rootScope.getDetails[i] === 'mShowCTTOnScheduled') {
                                $rootScope.Cttonscheduled = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') {
                                $rootScope.onSSAvailability = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                                $rootScope.OrganizationLocation = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                                $rootScope.PPIsBloodTypeRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                                $rootScope.PPIsHairColorRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                                $rootScope.PPIsEthnicityRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                                $rootScope.PPIsEyeColorRequired = 'on';
                            }
                        }
                        if ($rootScope.onDemandMode == '' && $rootScope.onSSAvailability == '') {
                            $rootScope.BlankUserAccount = true;
                        } else {
                            $rootScope.BlankUserAccount = false;
                        }

                    }
                    $rootScope.brandColor = data.data[0].brandColor;
                    $rootScope.logo = data.data[0].hospitalImage;
                    $rootScope.Hospital = data.data[0].brandName;
                    $rootScope.adminSetlocale = data.data[0].locale;
                    /*  if(data.data[0].locale == 'en-GB') {
                          $rootScope.adminSetlocale = '&pound;';
                      } else {
                         $rootScope.adminSetlocale = '$';
                      }*/
                    if (deploymentEnvLogout === 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    } else {
                        $rootScope.alertMsgName = $rootScope.Hospital;
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    }
                    $rootScope.HospitalTag = data.data[0].brandTitle;
                    $rootScope.contactNumber = data.data[0].contactNumber;
                    $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                    $rootScope.clientName = data.data[0].hospitalName;

                    var hospitaData = {};
                    hospitaData.hospitalId = $rootScope.hospitalId;
                    hospitaData.brandName = data.data[0].brandName;
                    hospitaData.subBrandName = data.data[0].brandTitle;
                    hospitaData.clientName = data.data[0].hospitalName;
                    hospitaData.brandColor = data.data[0].brandColor;
                    hospitaData.hospitalLogo = data.data[0].hospitalImage;
                    hospitaData.address = data.data[0].address;
                    hospitaData.locale = data.data[0].locale;

                    hospitaData.patientLogin = data.data[0].patientLogin;
                    hospitaData.patientConsultEndUrl = data.data[0].patientConsultEndUrl;

                    hospitaData.customerSSO = data.data[0].customerSso;
                    hospitaData.customerSSOButtonText = data.data[0].customerSsoLinkText;

                    hospitaData.clinicianConsultEndUrl = data.data[0].clinicianConsultEndUrl;
                    hospitaData.clinicianLogin = data.data[0].clinicianLogin;

                    hospitaData.clinicianSSO = data.data[0].clinicianSso;
                    hospitaData.clinicianSSOButtonText = data.data[0].clinicianSsoLinkText;

                    hospitaData.contactNumber = data.data[0].contactNumber;
                    hospitaData.email = data.data[0].email;
                    var hosJsonData = JSON.stringify(hospitaData);
                    $window.localStorage.setItem('snap_hospital_session', hosJsonData);

                    var hsettings = {};

                    hsettings.eCommerce = $rootScope.getDetails.indexOf("ECommerce") > -1;
                    hsettings.onDemand = $rootScope.getDetails.indexOf("OnDemand") > -1;
                    hsettings.cPTCodes = $rootScope.getDetails.indexOf("CPTCodes") > -1;
                    hsettings.messaging = $rootScope.getDetails.indexOf("Messaging") > -1;

                    hsettings.insuranceVerification = $rootScope.getDetails.indexOf("InsuranceVerification") > -1;
                    hsettings.ePrescriptions = $rootScope.getDetails.indexOf("EPrescriptions") > -1;
                    hsettings.ePrescriptions_EPSchedule = $rootScope.getDetails.indexOf("EPrescriptions_EPSchedule") > -1;
                    hsettings.intakeForm = $rootScope.getDetails.indexOf("IntakeForm") > -1;
                    hsettings.intakeForm_OnDemand = $rootScope.getDetails.indexOf("IntakeForm_OnDemand") > -1;
                    hsettings.intakeForm_Scheduled = $rootScope.getDetails.indexOf("IntakeForm_Scheduled") > -1;
                    hsettings.providerSearch = $rootScope.getDetails.indexOf("ClinicianSearch") > -1;
                    hsettings.rxNTEHR = $rootScope.getDetails.indexOf("RxNTEHR") > -1;
                    hsettings.rxNTPM = $rootScope.getDetails.indexOf("RxNTPM") > -1;
                    hsettings.hidePaymentPageBeforeWaitingRoom = $rootScope.getDetails.indexOf("HidePaymentPageBeforeWaitingRoom") > -1;
                    hsettings.fileSharing = $rootScope.getDetails.indexOf("FileSharing") > -1;
                    hsettings.insuranceBeforeWaiting = $rootScope.getDetails.indexOf("InsuranceBeforeWaiting") > -1;
                    hsettings.ePerscriptions = $rootScope.getDetails.indexOf("EPerscriptions") > -1;
                    hsettings.ePSchedule1 = $rootScope.getDetails.indexOf("EPSchedule1") > -1;

                    hsettings.iCD9Codes = $rootScope.getDetails.indexOf("ICD9Codes") > -1;
                    hsettings.textMessaging = $rootScope.getDetails.indexOf("TextMessaging") > -1;
                    hsettings.insVerificationDummy = $rootScope.getDetails.indexOf("InsVerificationDummy") > -1;
                    hsettings.videoBeta = $rootScope.getDetails.indexOf("VideoBeta") > -1;
                    hsettings.hidePaymentBeforeWaiting = $rootScope.getDetails.indexOf("HidePaymentBeforeWaiting") > -1;
                    hsettings.showCTTOnScheduled = $rootScope.getDetails.indexOf("ShowCTTOnScheduled") > -1;

                    hsettings.pPIsBloodTypeRequired = $rootScope.getDetails.indexOf("PPIsBloodTypeRequired") > -1;
                    hsettings.disablePhoneConsultation = $rootScope.getDetails.indexOf("DisablePhoneConsultation") > -1;
                    hsettings.pPIsHairColorRequired = $rootScope.getDetails.indexOf("PPIsHairColorRequired") > -1;
                    hsettings.pPIsEthnicityRequired = $rootScope.getDetails.indexOf("PPIsEthnicityRequired") > -1;
                    hsettings.pPIsEyeColorRequired = $rootScope.getDetails.indexOf("PPIsEyeColorRequired") > -1;
                    hsettings.organizationLocation = $rootScope.getDetails.indexOf("OrganizationLocation") > -1;

                    hsettings.AddressValidation = $rootScope.getDetails.indexOf("AddressValidation") > -1;

                    hsettings.hideOpenConsultation = $rootScope.getDetails.indexOf("HideOpenConsultation") > -1;
                    hsettings.hideDrToDrChat = $rootScope.getDetails.indexOf("HideDrToDrChat") > -1;
                    hsettings.drToDrChatInAdmin = false; //data.indexOf("DrToDrChatInAdmin") > -1;

                    hsettings.adminMeetingReport = $rootScope.getDetails.indexOf("AdminMeetingReport") > -1;
                    hsettings.includeDirections = $rootScope.getDetails.indexOf("IncludeDirections") > -1;
                    hsettings.hideForgotPasswordLink = $rootScope.getDetails.indexOf("HideForgotPasswordLink") > -1;
                    hsettings.encounterGeoLocation = $rootScope.getDetails.indexOf("EncounterGeoLocation") > -1;


                    hsettings.enableAdminScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleVideoConsultation") > -1;
                    hsettings.enableAdminSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableAdminSchedulePhoneConsultation") > -1;
                    hsettings.enableAdminScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleChatConsultation") > -1;
                    hsettings.enableAdminScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleInPersonConsultation") > -1;
                    hsettings.enableSelfScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleVideoConsultation") > -1;
                    hsettings.enableSelfSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableSelfSchedulePhoneConsultation") > -1;
                    //hsettings.enableSelfScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleChatConsultation") > -1;
                    hsettings.enableSelfScheduleChatConsultation = false;
                    hsettings.enableSelfScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleInPersonConsultation") > -1;
                    hsettings.enableOnDemandVideoConsultation = $rootScope.getDetails.indexOf("EnableOnDemandVideoConsultation") > -1;
                    hsettings.enableOnDemandPhoneConsultation = $rootScope.getDetails.indexOf("EnableOnDemandPhoneConsultation") > -1;
                    hsettings.enableOnDemandChatConsultation = $rootScope.getDetails.indexOf("EnableOnDemandChatConsultation") > -1;

                    //alert(data.indexOf("HideDrToDrChat"));
                    //Addd Public facing Hospital Setting
                    if (data.data[0]['settings']) {
                        $.extend(hsettings, data.data[0]['settings']);
                    }
                    var hsettingsJsonData = JSON.stringify(hsettings);
                    $window.localStorage.setItem('snap_hospital_settings', hsettingsJsonData);

                    if (HosForCoBrand === 'HosInfoForCoBrand') {
                        $scope.doGetTokenSSO();
                    } else {
                        $window.location.reload();
                        if (deploymentEnvLogout === "Multiple") {
                            $state.go('tab.chooseEnvironment');
                        } else if (deploymentEnvLogout === "Single") {
                            //$state.go('tab.loginSingle');
                            $state.go('tab.singleTheme');
                        } else {
                            $state.go('tab.login');
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }

        /*if ($stateParams.serviceUnavailableError === "yes") {
          $interval(function() {
              $stateParams.lastFunctionCall;
          }, 100);
        }
    */
        $scope.doGetFacilitiesList = function () {

            var params = {
                emailAddress: $rootScope.UserEmail,
                accessToken: $rootScope.accessToken,
                success: function (data) {

                    $rootScope.PostPaymentDetails = data.data;
                    if ($rootScope.PostPaymentDetails.length === 0) {
                        $scope.ErrorMessage = "No account associated with this email.  Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                        $('#verifyEmail').hide();
                        $('#loginEmail').show();
                    } else {
                        $rootScope.hospitalDetailsList = [];
                        angular.forEach($rootScope.PostPaymentDetails, function (index) {
                            if (typeof index.logo !== 'undefined' && index.logo !== '') {
                                $scope.chkImageorNot = "image";
                                var hosImage = index.logo;
                                if (hosImage.indexOf("http") >= 0) {
                                    $scope.proImage = hosImage;
                                } else {
                                    $scope.proImage = apiCommonURL + hosImage;
                                }
                            } else {
                                $scope.chkImageorNot = "";
                                $scope.proImage = get2CharInString.getProv2Char(index.brandName);
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
                                'brandName': index.brandName,
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
                        // $state.go('tab.provider');
                        if ($rootScope.viaNewUser != true || typeof $rootScope.viaNewUser == 'undefined') {
                            $state.go('tab.provider'); //Sakthi
                        }
                    }


                },
                error: function (data, status) {
                    $('#verifyEmail').hide();
                    $('#loginEmail').show();
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        /*  $scope.lastFunctionCall = '$scope.doGetFacilitiesList()';
                          $state.go('tab.serviceUnavailableError', { lastFunctionCall : $scope.lastFunctionCall, serviceUnavailableError: 'yes' });
                          $.get("https://www.connectedcarestatus.com/", function(data) {
                            var data = $(data);
                            //do something
                            $("#ddd").html(data);
                          });*/
                        $scope.callServiceUnAvailableError();
                    }

                }
            };

            LoginService.getFacilitiesList(params);
        }

        $scope.goToSearchProvider = function (currentPage) {
            $rootScope.LogCurrentPage = currentPage;
            $rootScope.isNotificationDisplayed = false;
            $window.localStorage.setItem('FlagForCheckingAuthorization', '');
            if (ionic.Platform.is('browser') !== true) {
                $scope.nameForChckingCurrentFuncForMic = 'SearchProvidePage';
                chkCameraAndMicroPhoneSettings($scope.nameForChckingCurrentFuncForMic);
            } else {
                $scope.chkSearchProviderPage(currentPage);
            }
        }


        $rootScope.backtoPreviousPage = function () {
            $state.go($rootScope.frontPage);
        }

        // $rootScope.getTokenDetailsForRegisterdUsers = function() {
        //     $rootScope.UserEmail = $rootScope.registedEmail;
        //     $scope.pass.password = $rootScope.registedPwd;
        //     $scope.doGetToken();
        // }

        $rootScope.getTokenDetailsForRegisterdUsers = function () {
            $rootScope.viaNewUser = true;
            $scope.doGetFacilitiesList();
            $scope.doGetSingleHospitalInformation()
            $rootScope.UserEmail = $rootScope.registedEmail;
            $scope.pass.password = $rootScope.registedPwd;
            $scope.doGetToken();
        }

        $rootScope.doGetCountries = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.CountryList = data;
                    console.log($scope.CountryList);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getCountriesList(params);
        }

        $rootScope.getStatesForUS = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.usStates = data;
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getStatesForUS(params);
        }
        $rootScope.cancelProviderSearch = function () {
            navigator.notification.confirm(
                /*  'Are you sure that you want to cancel?',*/
                alertCancelMessageProviderSearch,
                function (index) {
                    if (index === 1) {

                    } else if (index === 2) {

                        $state.go($rootScope.frontPage);
                    }
                },
                NaviConfirmation, ['No', YESMessageProviderSearch]
            );
        }

        $rootScope.backtoPreviousPageFromTerms = function (registerCurrentPage) {
            //$state.go(registerCurrentPage);
            $window.history.back();
        }

        $scope.doGetSingleHospitalInformation = function () {
            $rootScope.paymentMode = '';
            $rootScope.insuranceMode = '';
            $rootScope.onDemandMode = '';
            $rootScope.OrganizationLocation = '';
            $rootScope.PPIsBloodTypeRequired = '';
            $rootScope.PPIsHairColorRequired = '';
            $rootScope.PPIsEthnicityRequired = '';
            $rootScope.PPIsEyeColorRequired = '';
            $rootScope.Cttonscheduled = '';
            $rootScope.onSSAvailability = '';
            $rootScope.Cttonscheduled = '';
            $rootScope.InsVerificationDummy = '';
            $rootScope.InsuranceBeforeWaiting = '';
            $rootScope.HidePaymentPageBeforeWaitingRoom = '';
            $rootScope.HideForgotPasswordLink = '';
            $rootScope.BlankUserAccount = '';
            var params = {
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.getDetails = data.data[0].enabledModules;
                    $rootScope.mobileSettings = data.data[0].settings;
                    $rootScope.appointmentsContactNumber = data.data[0].appointmentsContactNumber;
                    var mobappversion = $rootScope.mobileSettings.mobileApp_MinSupportedVersion;
                    var sptversion = mobappversion.split("v");
                    var checkmobilever = parseFloat(sptversion[1]);
                    // var checkmobilever = 71;
                    if (appVersion > checkmobilever) {
                        if ($rootScope.getDetails !== '') {
                            for (var i = 0; i < $rootScope.getDetails.length; i++) {
                                if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                                    $rootScope.insuranceMode = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                                    $rootScope.InsuranceBeforeWaiting = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'HideForgotPasswordLink' || $rootScope.getDetails[i] === 'mHideForgotPasswordLink') {
                                    $rootScope.HideForgotPasswordLink = 'on';
                                }
                                /*if (($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') && ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand')) {
                                        $rootScope.BlankUserAccount = 'on';
                                    }*/
                                if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                                    $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                                    $rootScope.InsVerificationDummy = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                                    $rootScope.paymentMode = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                                    $rootScope.onDemandMode = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'ShowCTTOnScheduled' || $rootScope.getDetails[i] === 'mShowCTTOnScheduled') {
                                    $rootScope.Cttonscheduled = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') {
                                    $rootScope.onSSAvailability = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                                    $rootScope.OrganizationLocation = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                                    $rootScope.PPIsBloodTypeRequired = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                                    $rootScope.PPIsHairColorRequired = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                                    $rootScope.PPIsEthnicityRequired = 'on';
                                }
                                if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                                    $rootScope.PPIsEyeColorRequired = 'on';
                                }
                            }
                            if ($rootScope.onDemandMode == '' && $rootScope.onSSAvailability == '') {
                                $rootScope.BlankUserAccount = true;
                            } else {
                                $rootScope.BlankUserAccount = false;
                            }
                        }
                        $rootScope.brandColor = data.data[0].brandColor;

                        $rootScope.logo = data.data[0].hospitalImage;
                        $rootScope.Hospital = data.data[0].brandName;
                        $rootScope.adminSetlocale = data.data[0].locale;
                        if (deploymentEnvLogout === 'Single') {
                            $rootScope.alertMsgName = $rootScope.Hospital;
                            $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                        } else {
                            $rootScope.alertMsgName = 'Virtual Care';
                            $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                        }
                        $rootScope.HospitalTag = data.data[0].brandTitle;
                        $rootScope.contactNumber = data.data[0].contactNumber;
                        $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                        $rootScope.clientName = data.data[0].hospitalName;

                        var hospitaData = {};
                        hospitaData.hospitalId = $rootScope.hospitalId;
                        hospitaData.brandName = data.data[0].brandName;
                        hospitaData.subBrandName = data.data[0].brandTitle;
                        hospitaData.clientName = data.data[0].hospitalName;
                        hospitaData.brandColor = data.data[0].brandColor;
                        hospitaData.hospitalLogo = data.data[0].hospitalImage;
                        hospitaData.address = data.data[0].address;
                        hospitaData.locale = data.data[0].locale;

                        hospitaData.patientLogin = data.data[0].patientLogin;
                        hospitaData.patientConsultEndUrl = data.data[0].patientConsultEndUrl;

                        hospitaData.customerSSO = data.data[0].customerSso;
                        hospitaData.customerSSOButtonText = data.data[0].customerSsoLinkText;

                        hospitaData.clinicianConsultEndUrl = data.data[0].clinicianConsultEndUrl;
                        hospitaData.clinicianLogin = data.data[0].clinicianLogin;

                        hospitaData.clinicianSSO = data.data[0].clinicianSso;
                        hospitaData.clinicianSSOButtonText = data.data[0].clinicianSsoLinkText;

                        hospitaData.contactNumber = data.data[0].contactNumber;
                        hospitaData.email = data.data[0].email;
                        var hosJsonData = JSON.stringify(hospitaData);
                        $window.localStorage.setItem('snap_hospital_session', hosJsonData);

                        var hsettings = {};

                        hsettings.eCommerce = $rootScope.getDetails.indexOf("ECommerce") > -1;
                        hsettings.onDemand = $rootScope.getDetails.indexOf("OnDemand") > -1;
                        hsettings.cPTCodes = $rootScope.getDetails.indexOf("CPTCodes") > -1;
                        hsettings.messaging = $rootScope.getDetails.indexOf("Messaging") > -1;

                        hsettings.insuranceVerification = $rootScope.getDetails.indexOf("InsuranceVerification") > -1;
                        hsettings.ePrescriptions = $rootScope.getDetails.indexOf("EPrescriptions") > -1;
                        hsettings.ePrescriptions_EPSchedule = $rootScope.getDetails.indexOf("EPrescriptions_EPSchedule") > -1;
                        hsettings.intakeForm = $rootScope.getDetails.indexOf("IntakeForm") > -1;
                        hsettings.intakeForm_OnDemand = $rootScope.getDetails.indexOf("IntakeForm_OnDemand") > -1;
                        hsettings.intakeForm_Scheduled = $rootScope.getDetails.indexOf("IntakeForm_Scheduled") > -1;
                        hsettings.providerSearch = $rootScope.getDetails.indexOf("ClinicianSearch") > -1;
                        hsettings.rxNTEHR = $rootScope.getDetails.indexOf("RxNTEHR") > -1;
                        hsettings.rxNTPM = $rootScope.getDetails.indexOf("RxNTPM") > -1;
                        hsettings.hidePaymentPageBeforeWaitingRoom = $rootScope.getDetails.indexOf("HidePaymentPageBeforeWaitingRoom") > -1;
                        hsettings.fileSharing = $rootScope.getDetails.indexOf("FileSharing") > -1;
                        hsettings.insuranceBeforeWaiting = $rootScope.getDetails.indexOf("InsuranceBeforeWaiting") > -1;
                        hsettings.ePerscriptions = $rootScope.getDetails.indexOf("EPerscriptions") > -1;
                        hsettings.ePSchedule1 = $rootScope.getDetails.indexOf("EPSchedule1") > -1;

                        hsettings.iCD9Codes = $rootScope.getDetails.indexOf("ICD9Codes") > -1;
                        hsettings.textMessaging = $rootScope.getDetails.indexOf("TextMessaging") > -1;
                        hsettings.insVerificationDummy = $rootScope.getDetails.indexOf("InsVerificationDummy") > -1;
                        hsettings.videoBeta = $rootScope.getDetails.indexOf("VideoBeta") > -1;
                        hsettings.hidePaymentBeforeWaiting = $rootScope.getDetails.indexOf("HidePaymentBeforeWaiting") > -1;
                        hsettings.showCTTOnScheduled = $rootScope.getDetails.indexOf("ShowCTTOnScheduled") > -1;

                        hsettings.pPIsBloodTypeRequired = $rootScope.getDetails.indexOf("PPIsBloodTypeRequired") > -1;
                        hsettings.disablePhoneConsultation = $rootScope.getDetails.indexOf("DisablePhoneConsultation") > -1;
                        hsettings.pPIsHairColorRequired = $rootScope.getDetails.indexOf("PPIsHairColorRequired") > -1;
                        hsettings.pPIsEthnicityRequired = $rootScope.getDetails.indexOf("PPIsEthnicityRequired") > -1;
                        hsettings.pPIsEyeColorRequired = $rootScope.getDetails.indexOf("PPIsEyeColorRequired") > -1;
                        hsettings.organizationLocation = $rootScope.getDetails.indexOf("OrganizationLocation") > -1;

                        hsettings.AddressValidation = $rootScope.getDetails.indexOf("AddressValidation") > -1;

                        hsettings.hideOpenConsultation = $rootScope.getDetails.indexOf("HideOpenConsultation") > -1;
                        hsettings.hideDrToDrChat = $rootScope.getDetails.indexOf("HideDrToDrChat") > -1;
                        hsettings.drToDrChatInAdmin = false; //data.indexOf("DrToDrChatInAdmin") > -1;

                        hsettings.adminMeetingReport = $rootScope.getDetails.indexOf("AdminMeetingReport") > -1;
                        hsettings.includeDirections = $rootScope.getDetails.indexOf("IncludeDirections") > -1;
                        hsettings.hideForgotPasswordLink = $rootScope.getDetails.indexOf("HideForgotPasswordLink") > -1;
                        hsettings.encounterGeoLocation = $rootScope.getDetails.indexOf("EncounterGeoLocation") > -1;


                        hsettings.enableAdminScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleVideoConsultation") > -1;
                        hsettings.enableAdminSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableAdminSchedulePhoneConsultation") > -1;
                        hsettings.enableAdminScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleChatConsultation") > -1;
                        hsettings.enableAdminScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleInPersonConsultation") > -1;
                        hsettings.enableSelfScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleVideoConsultation") > -1;
                        hsettings.enableSelfSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableSelfSchedulePhoneConsultation") > -1;
                        //  hsettings.enableSelfScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleChatConsultation") > -1;
                        hsettings.enableSelfScheduleChatConsultation = false;
                        hsettings.enableSelfScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleInPersonConsultation") > -1;
                        hsettings.enableOnDemandVideoConsultation = $rootScope.getDetails.indexOf("EnableOnDemandVideoConsultation") > -1;
                        hsettings.enableOnDemandPhoneConsultation = $rootScope.getDetails.indexOf("EnableOnDemandPhoneConsultation") > -1;
                        hsettings.enableOnDemandChatConsultation = $rootScope.getDetails.indexOf("EnableOnDemandChatConsultation") > -1;

                        //add currency
                        $rootScope.currencySymbol = '';
                        $rootScope.currency = null;
                        if (typeof data.data[0]["currency"] != 'undefined') {
                            $rootScope.currency = data.data[0]["currency"];
                            $rootScope.currencySymbol = $rootScope.currency.currencySymbol;
                        }

                        //alert(data.indexOf("HideDrToDrChat"));
                        //Addd Public facing Hospital Setting
                        if (data.data[0]['settings']) {
                            $.extend(hsettings, data.data[0]['settings']);
                        }
                        var hsettingsJsonData = JSON.stringify(hsettings);
                        $window.localStorage.setItem('snap_hospital_settings', hsettingsJsonData);
                        if ($rootScope.viaNewUser != true || typeof $rootScope.viaNewUser == 'undefined') {
                            $state.go('tab.password');
                        }
                        //$state.go('tab.password');
                    } else {
                        var confirmPopup = $ionicPopup.prompt({

                            templateUrl: 'templates/updationpopup.html',
                            cssClass: 'updatepopup',
                            hardwareBackButtonClose: false,
                            scope: $scope,
                        });

                    }
                },
                error: function (data, status) {
                    if (status === 0) {

                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);

                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }

        $scope.goToStore = function () {
            if ($rootScope.AndroidDevice) {
                var url = 'https://play.google.com/store/apps/details?id=com.snap.connectedcare.production';
                // window.location.href = 'https://play.google.com/store/apps/details?id=com.snap.connectedcare.production';
            } else {
                var url = 'https://itunes.apple.com/us/app/virtual-care/id1035220141?ls=1&mt=8';
                //window.location.href = 'https://itunes.apple.com/us/app/virtual-care/id1035220141?ls=1&mt=8';
            }
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        }



        if ($stateParams.getPage === 'CTT') {
            $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
            if ($rootScope.chkSSPageEnter) {
                $ionicSideMenuDelegate.toggleLeft();
                $rootScope.chkSSPageEnter = false;
            }
            $rootScope.patientId = JSON.parse(sessionStorage.getItem("appointPatId"));
            $rootScope.appointmentwaivefee = JSON.parse(sessionStorage.getItem("waivefee"));
            $rootScope.userhome = true;
            $rootScope.SSPage = true;
            $rootScope.appointmentsPage = true;
            $rootScope.consultationId = $stateParams.getconsultId;
            $rootScope.P_isAuthorized = true;
            //$(".overlay").css({"display": "none" });
            $rootScope.concentToTreatPreviousPage = "tab.userhome";
            $rootScope.doGetpatDetailsForSS($rootScope.patientId, "Now");
        }

        $rootScope.doCheckExistingConsulatationStatus = function (CurrentPage) {
            
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $scope.existingConsultation = data;
                    $rootScope.consultionInformation = data.data[0].consultationInfo;
                    //Get Hospital Information
                    if (!$rootScope.SSPage) {
                        $rootScope.patientId = $rootScope.appointmentsPatientId;
                        if ($rootScope.primaryPatientId != $rootScope.patientId) {
                            $rootScope.PatientGuardian = $rootScope.appointPatientGuardian;
                        }
                    }
                    $rootScope.consultationAmount = $rootScope.consultionInformation.consultationAmount;
                    $rootScope.copayAmount = $rootScope.consultationAmount;
                    $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                   
                    if (!angular.isUndefined($rootScope.consultationStatusId)) {
                        if ($rootScope.consultationStatusId === 71) {
                            //  $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(
                                //'Your consultation is already started on other device.', // message
                                consultStartMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 72) {
                            //  $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(
                                //'Your consultation is already ended.', // message
                                consultEndMeg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 79) {
                            //  $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(
                                //  'Your consultation is cancelled.', // message
                                consultCancelMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 80) {
                            //$rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(
                                //  'Your consultation is in progress on other device.', // message
                                consultProgMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else {
                            //  $scope.doGetConcentToTreat(CurrentPage);
                            $scope.doGetAppointPaymentStatus(CurrentPage);
                        }

                    }
                },
                error: function (data, status) {
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

        $rootScope.doGetpatDetailsForSS = function (patientId, getStatus) {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: patientId,
                success: function (data) {
                    $scope.selPatDetails = [];
                    //angular.fromJson(index.billingAddress)
                    angular.forEach(data.data, function (index) {
                        $scope.selPatDetails.push({
                            'identifiers': angular.fromJson(index.identifiers),
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
                    if (getStatus === 'Now') {
                        $rootScope.schedulePatAge = getAge($scope.selPatDetails[0].dob);
                        $rootScope.GoToPatientDetails($scope.selPatDetails[0].location, $scope.selPatDetails[0].account.profileImage, $scope.selPatDetails[0].patientName, $scope.selPatDetails[0].lastName, $scope.selPatDetails[0].dob, ' ', $rootScope.patientId, 'true', 'SS');
                    } else {
                        $rootScope.GoToPatientDetails($scope.selPatDetails[0].location, $scope.selPatDetails[0].account.profileImage, $scope.selPatDetails[0].patientName, $scope.selPatDetails[0].lastName, $scope.selPatDetails[0].dob, ' ', $rootScope.patientId, 'true', 'notNow');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getSelectedPatientProfiles(params);
        }

        $scope.doGetConcentToTreat = function (CurrentPage) {
            var params = {
                documentType: 2,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    if (!$rootScope.SSPage) {
                        $rootScope.concentToTreatPreviousPage = CurrentPage;
                    }
                    $rootScope.editplan = "none";
                    $rootScope.concentToTreatContent = htmlEscapeValue.getHtmlEscapeValue(data.data[0].documentText);
                    if ($rootScope.appointmentsPage === true) {
                        if ($rootScope.schedulePatAge === 0) {
                            $rootScope.birHistory = {};
                            $rootScope.appointIntakePage = 0;
                            if (!$rootScope.SSPage) {
                                $rootScope.concentToTreatPreviousPage = "tab.intakeBornHistory";
                            }
                            $state.go('tab.intakeBornHistory');
                        } else {
                            $rootScope.appointIntakePage = '';
                            if (!$rootScope.SSPage) {
                                $rootScope.concentToTreatPreviousPage = "tab.appoimentDetails";
                            }
                            if ($rootScope.Cttonscheduled === 'on') {
                                $state.go('tab.ConsentTreat');
                            } else if ($rootScope.appointmentwaivefee == true) {
                                $rootScope.doGetWaiveFeeHospitalInformation();
                                //  }else  if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' &&  $rootScope.appointmentwaivefee === false && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.copayAmount != 0) {
                            } else if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' && $rootScope.appointmentwaivefee === false && $rootScope.copayAmount != 0) {
                                $rootScope.doPostDepitDetails();
                                //  }else if($rootScope.getIndividualPatientCreditCount !== 0 &&  $rootScope.appointmentwaivefee === true && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.copayAmount != 0){
                            } else if ($rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.appointmentwaivefee === true && $rootScope.copayAmount != 0) {
                                $state.go('tab.receipt');
                                $rootScope.enablePaymentSuccess = "none";
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enableCreditVerification = "none";
                                $rootScope.enableWaivefeeVerification = "block";
                                $rootScope.ReceiptTimeout();
                            }
                            else {
                                $rootScope.doGetHospitalInformation();
                            }
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getConcentToTreat(params);
        }

        $scope.doGetAppointPaymentStatus = function (CurrentPage) {
            $rootScope.isPaid = '';
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.isPaid = data.isPaid;
                    $scope.doGetConcentToTreat(CurrentPage);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);

                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getAppointPaymentStatus(params);
        }

        $scope.doGetSingleHospitalRegistrationInformation = function () {
            $rootScope.paymentMode = '';
            $rootScope.insuranceMode = '';
            $rootScope.onDemandMode = '';
            $rootScope.OrganizationLocation = '';
            $rootScope.PPIsBloodTypeRequired = '';
            $rootScope.PPIsHairColorRequired = '';
            $rootScope.PPIsEthnicityRequired = '';
            $rootScope.PPIsEyeColorRequired = '';
            $rootScope.Cttonscheduled = '';
            $rootScope.onSSAvailability = '';
            $rootScope.InsVerificationDummy = '';
            $rootScope.InsuranceBeforeWaiting = '';
            $rootScope.HidePaymentPageBeforeWaitingRoom = '';
            $rootScope.HideForgotPasswordLink = '';
            $rootScope.BlankUserAccount = '';
            var params = {
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.getDetails = data.data[0].enabledModules;
                    $rootScope.appointmentsContactNumber = data.data[0].appointmentsContactNumber;

                    if ($rootScope.getDetails !== '') {
                        for (var i = 0; i < $rootScope.getDetails.length; i++) {
                            if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                                $rootScope.insuranceMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                                $rootScope.InsuranceBeforeWaiting = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                                $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HideForgotPasswordLink' || $rootScope.getDetails[i] === 'mHideForgotPasswordLink') {
                                $rootScope.HideForgotPasswordLink = 'on';
                            }
                            /*if (($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') && ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand')) {
                                $rootScope.BlankUserAccount = 'on';
                            }*/
                            if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                                $rootScope.InsVerificationDummy = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                                $rootScope.paymentMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                                $rootScope.onDemandMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ShowCTTOnScheduled' || $rootScope.getDetails[i] === 'mShowCTTOnScheduled') {
                                $rootScope.Cttonscheduled = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') {
                                $rootScope.onSSAvailability = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                                $rootScope.OrganizationLocation = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                                $rootScope.PPIsBloodTypeRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                                $rootScope.PPIsHairColorRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                                $rootScope.PPIsEthnicityRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                                $rootScope.PPIsEyeColorRequired = 'on';
                            }
                        }
                        if ($rootScope.onDemandMode == '' && $rootScope.onSSAvailability == '') {
                            $rootScope.BlankUserAccount = true;
                        } else {
                            $rootScope.BlankUserAccount = false;
                        }
                    }


                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }


        $('.hospitalDynamicLink').click(function () {
            var url = 'https://' + $rootScope.hospitalDomainName + '/public/#/UserTerms';
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        });

        $rootScope.sideMenuHospitallink = function () {
            var url = 'https://' + $rootScope.hospitalDomainName + '/public/#/UserTerms';
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        }


        $scope.ProviderFunction = function (hospitalDetailsDatas) {
            $rootScope.hospitalId = hospitalDetailsDatas.providerId;
            $rootScope.hospitalName = hospitalDetailsDatas.name;
            $rootScope.operatingHours = hospitalDetailsDatas.operatingHours;
            $rootScope.id = hospitalDetailsDatas.id;
            $rootScope.backgroundimage = "background-image: none;";
            $scope.doGetSingleHospitalInformation();

        }

        // $scope.textboxUp = function() {

        //     $timeout(function() {
        //         $ionicScrollDelegate.scrollTo(0, 150, true);

        //     }, 900);
        // };

        $scope.goBackProvider = function () {
            $state.go('tab.provider');
        };
        $scope.mobileloc = false;
        $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme = function () {
            
            $rootScope.paymentMode = '';
            $rootScope.insuranceMode = '';
            $rootScope.onDemandMode = '';
            $rootScope.OrganizationLocation = '';
            $rootScope.PPIsBloodTypeRequired = '';
            $rootScope.PPIsHairColorRequired = '';
            $rootScope.PPIsEthnicityRequired = '';
            $rootScope.PPIsEyeColorRequired = '';
            $rootScope.Cttonscheduled = '';
            $rootScope.onSSAvailability = '';
            $rootScope.InsVerificationDummy = '';
            $rootScope.InsuranceBeforeWaiting = '';
            $rootScope.HidePaymentPageBeforeWaitingRoom = '';
            $rootScope.HideForgotPasswordLink = '';
            $rootScope.BlankUserAccount = '';
            var params = {
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.getDetails = data.data[0].enabledModules;
                    $rootScope.ssopatienttoken = data.data[0].patientTokenApi;
                    $rootScope.ssopatientregister = data.data[0].patientRegistrationApi;
                    $rootScope.ssopatientforgetpwd = data.data[0].patientForgotPasswordApi;
                    $rootScope.appointmentsContactNumber = data.data[0].appointmentsContactNumber;

                    if ($rootScope.getDetails !== '') {
                        for (var i = 0; i < $rootScope.getDetails.length; i++) {
                            if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                                $rootScope.insuranceMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                                $rootScope.InsuranceBeforeWaiting = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                                $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'HideForgotPasswordLink' || $rootScope.getDetails[i] === 'mHideForgotPasswordLink') {
                                $rootScope.HideForgotPasswordLink = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                                $rootScope.InsVerificationDummy = 'on';
                            }
                            /*if (($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') && ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand')) {
                                $rootScope.BlankUserAccount = 'on';
                            }*/
                            if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                                $rootScope.paymentMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                                $rootScope.onDemandMode = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ShowCTTOnScheduled' || $rootScope.getDetails[i] === 'mShowCTTOnScheduled') {
                                $rootScope.Cttonscheduled = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'ClinicianSearch' || $rootScope.getDetails[i] === 'mClinicianSearch') {
                                $rootScope.onSSAvailability = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                                $rootScope.OrganizationLocation = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                                $rootScope.PPIsBloodTypeRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                                $rootScope.PPIsHairColorRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                                $rootScope.PPIsEthnicityRequired = 'on';
                            }
                            if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                                $rootScope.PPIsEyeColorRequired = 'on';
                            }
                        }
                        if ($rootScope.onDemandMode == '' && $rootScope.onSSAvailability == '') {
                            $rootScope.BlankUserAccount = true;
                        } else {
                            $rootScope.BlankUserAccount = false;
                        }
                    }
                    $rootScope.brandColor = data.data[0].brandColor;
                    $rootScope.logo = data.data[0].hospitalImage;
                    $rootScope.Hospital = data.data[0].brandName;
                    $rootScope.adminSetlocale = data.data[0].locale;
                    if (deploymentEnvLogout === 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    } else {
                        $rootScope.alertMsgName = $rootScope.Hospital;
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    }
                    $rootScope.HospitalTag = data.data[0].brandTitle;
                    $rootScope.contactNumber = data.data[0].contactNumber;
                    $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                    $rootScope.clientName = data.data[0].hospitalName;
                    if (!angular.isUndefined(data.data[0].customerSso) && data.data[0].customerSso === "Mandatory") {
                        $rootScope.customerSso = "Mandatory";
                        ssoURL = data.data[0].patientLogin;
                    } else {
                        $rootScope.customerSso = '';
                    }

                    var hospitaData = {};
                    hospitaData.hospitalId = $rootScope.hospitalId;
                    hospitaData.brandName = data.data[0].brandName;
                    hospitaData.subBrandName = data.data[0].brandTitle;
                    hospitaData.clientName = data.data[0].hospitalName;
                    hospitaData.brandColor = data.data[0].brandColor;
                    hospitaData.hospitalLogo = data.data[0].hospitalImage;
                    hospitaData.address = data.data[0].address;
                    hospitaData.locale = data.data[0].locale;

                    hospitaData.patientLogin = data.data[0].patientLogin;
                    hospitaData.patientConsultEndUrl = data.data[0].patientConsultEndUrl;

                    hospitaData.customerSSO = data.data[0].customerSso;
                    hospitaData.customerSSOButtonText = data.data[0].customerSsoLinkText;

                    hospitaData.clinicianConsultEndUrl = data.data[0].clinicianConsultEndUrl;
                    hospitaData.clinicianLogin = data.data[0].clinicianLogin;

                    hospitaData.clinicianSSO = data.data[0].clinicianSso;
                    hospitaData.clinicianSSOButtonText = data.data[0].clinicianSsoLinkText;

                    hospitaData.contactNumber = data.data[0].contactNumber;
                    hospitaData.email = data.data[0].email;
                    var hosJsonData = JSON.stringify(hospitaData);
                    $window.localStorage.setItem('snap_hospital_session', hosJsonData);

                    var hsettings = {};

                    hsettings.eCommerce = $rootScope.getDetails.indexOf("ECommerce") > -1;
                    hsettings.onDemand = $rootScope.getDetails.indexOf("OnDemand") > -1;
                    hsettings.cPTCodes = $rootScope.getDetails.indexOf("CPTCodes") > -1;
                    hsettings.messaging = $rootScope.getDetails.indexOf("Messaging") > -1;

                    hsettings.insuranceVerification = $rootScope.getDetails.indexOf("InsuranceVerification") > -1;
                    hsettings.ePrescriptions = $rootScope.getDetails.indexOf("EPrescriptions") > -1;
                    hsettings.ePrescriptions_EPSchedule = $rootScope.getDetails.indexOf("EPrescriptions_EPSchedule") > -1;
                    hsettings.intakeForm = $rootScope.getDetails.indexOf("IntakeForm") > -1;
                    hsettings.intakeForm_OnDemand = $rootScope.getDetails.indexOf("IntakeForm_OnDemand") > -1;
                    hsettings.intakeForm_Scheduled = $rootScope.getDetails.indexOf("IntakeForm_Scheduled") > -1;
                    hsettings.providerSearch = $rootScope.getDetails.indexOf("ClinicianSearch") > -1;
                    hsettings.rxNTEHR = $rootScope.getDetails.indexOf("RxNTEHR") > -1;
                    hsettings.rxNTPM = $rootScope.getDetails.indexOf("RxNTPM") > -1;
                    hsettings.hidePaymentPageBeforeWaitingRoom = $rootScope.getDetails.indexOf("HidePaymentPageBeforeWaitingRoom") > -1;
                    hsettings.fileSharing = $rootScope.getDetails.indexOf("FileSharing") > -1;
                    hsettings.insuranceBeforeWaiting = $rootScope.getDetails.indexOf("InsuranceBeforeWaiting") > -1;
                    hsettings.ePerscriptions = $rootScope.getDetails.indexOf("EPerscriptions") > -1;
                    hsettings.ePSchedule1 = $rootScope.getDetails.indexOf("EPSchedule1") > -1;

                    hsettings.iCD9Codes = $rootScope.getDetails.indexOf("ICD9Codes") > -1;
                    hsettings.textMessaging = $rootScope.getDetails.indexOf("TextMessaging") > -1;
                    hsettings.insVerificationDummy = $rootScope.getDetails.indexOf("InsVerificationDummy") > -1;
                    hsettings.videoBeta = $rootScope.getDetails.indexOf("VideoBeta") > -1;
                    hsettings.hidePaymentBeforeWaiting = $rootScope.getDetails.indexOf("HidePaymentBeforeWaiting") > -1;
                    hsettings.showCTTOnScheduled = $rootScope.getDetails.indexOf("ShowCTTOnScheduled") > -1;

                    hsettings.pPIsBloodTypeRequired = $rootScope.getDetails.indexOf("PPIsBloodTypeRequired") > -1;
                    hsettings.disablePhoneConsultation = $rootScope.getDetails.indexOf("DisablePhoneConsultation") > -1;
                    hsettings.pPIsHairColorRequired = $rootScope.getDetails.indexOf("PPIsHairColorRequired") > -1;
                    hsettings.pPIsEthnicityRequired = $rootScope.getDetails.indexOf("PPIsEthnicityRequired") > -1;
                    hsettings.pPIsEyeColorRequired = $rootScope.getDetails.indexOf("PPIsEyeColorRequired") > -1;
                    hsettings.organizationLocation = $rootScope.getDetails.indexOf("OrganizationLocation") > -1;

                    hsettings.AddressValidation = $rootScope.getDetails.indexOf("AddressValidation") > -1;

                    hsettings.hideOpenConsultation = $rootScope.getDetails.indexOf("HideOpenConsultation") > -1;
                    hsettings.hideDrToDrChat = $rootScope.getDetails.indexOf("HideDrToDrChat") > -1;
                    hsettings.drToDrChatInAdmin = false; //data.indexOf("DrToDrChatInAdmin") > -1;

                    hsettings.adminMeetingReport = $rootScope.getDetails.indexOf("AdminMeetingReport") > -1;
                    hsettings.includeDirections = $rootScope.getDetails.indexOf("IncludeDirections") > -1;
                    hsettings.hideForgotPasswordLink = $rootScope.getDetails.indexOf("HideForgotPasswordLink") > -1;
                    hsettings.encounterGeoLocation = $rootScope.getDetails.indexOf("EncounterGeoLocation") > -1;


                    hsettings.enableAdminScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleVideoConsultation") > -1;
                    hsettings.enableAdminSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableAdminSchedulePhoneConsultation") > -1;
                    hsettings.enableAdminScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleChatConsultation") > -1;
                    hsettings.enableAdminScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableAdminScheduleInPersonConsultation") > -1;
                    hsettings.enableSelfScheduleVideoConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleVideoConsultation") > -1;
                    hsettings.enableSelfSchedulePhoneConsultation = $rootScope.getDetails.indexOf("EnableSelfSchedulePhoneConsultation") > -1;
                    //  hsettings.enableSelfScheduleChatConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleChatConsultation") > -1;
                    hsettings.enableSelfScheduleChatConsultation = false;
                    hsettings.enableSelfScheduleInPersonConsultation = $rootScope.getDetails.indexOf("EnableSelfScheduleInPersonConsultation") > -1;
                    hsettings.enableOnDemandVideoConsultation = $rootScope.getDetails.indexOf("EnableOnDemandVideoConsultation") > -1;
                    hsettings.enableOnDemandPhoneConsultation = $rootScope.getDetails.indexOf("EnableOnDemandPhoneConsultation") > -1;
                    hsettings.enableOnDemandChatConsultation = $rootScope.getDetails.indexOf("EnableOnDemandChatConsultation") > -1;

                    //alert(data.indexOf("HideDrToDrChat"));
                    //Addd Public facing Hospital Setting
                    if (data.data[0]['settings']) {
                        $.extend(hsettings, data.data[0]['settings']);
                    }
                    var hsettingsJsonData = JSON.stringify(hsettings);
                    $window.localStorage.setItem('snap_hospital_settings', hsettingsJsonData);

                    if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                        $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                    } else {
                        $rootScope.isSSORegisterAvailable = '';
                    }

                    if ($rootScope.cuttlocations == "tab.ReportScreen" && (!$rootScope.passwordPreviousPage || $rootScope.passwordPreviousPage == '')) {
                        $state.go('tab.userhome');
                    } else {
                        $rootScope.cuttlocations = "tab.ReportScreen";
                        $rootScope.passwordPreviousPage = false;
                        $scope.doGetWaitingConsultent();
                    }

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }
        $scope.doPostResendEmail = function () {
            var params = {
                email: $rootScope.UserEmail,
                hospitalId: $rootScope.hospitalId,
                success: function () {

                    $scope.ErrorMessage = "Account Activation link has been sent to the address you provided";
                    $rootScope.Validation($scope.ErrorMessage);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.postResendEmail(params);

        }

        $scope.doGetTokenSSO = function () {
            var loginEmail = $rootScope.UserEmail;
            if (cobrandApp === "Hello420" && loginEmail.toLowerCase() !== "itunesmobiletester@gmail.com") {

                $scope.checkForSSOUserExistsInHello420();
            } else if ($rootScope.customerSso === "Mandatory" && $rootScope.ssopatienttoken != "") {
                $scope.doCheckssoToken();
            } else {
                $scope.doGetToken();
            }
        }

        $scope.checkForSSOUserExistsInHello420 = function () {
            var Hello420HospitalId = 197;
            var params = {
                emailAddress: $rootScope.UserEmail,
                success: function (data) {
                    $rootScope.FacilitiesList = data.data;
                    if ($rootScope.FacilitiesList.length > 0) {
                        angular.forEach($rootScope.FacilitiesList, function (index) {
                            if (index.providerId === Hello420HospitalId) {
                                if (ssoURL !== "") {
                                    $scope.ErrorMessage = "You will be directed to the Hello420 website momentarily";
                                    $rootScope.Validation($scope.ErrorMessage);
                                    setTimeout(function () {
                                        window.open(ssoURL, '_system', '');
                                        return;
                                    }, 2000);

                                }
                            }
                        });
                    } else {
                        $scope.ErrorMessage = "Login Failed! Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $scope.ErrorMessage = "Login Failed! Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                }
            };
            LoginService.getFacilitiesList(params);
        }

        $scope.pass = {};

        $scope.doCheckssoToken = function () {
            if ($('#password').val() === '') {
                $scope.ErrorMessage = "Please enter your password";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $('#loginPwd').hide();
                $('#loginPwdVerify').show();
                console.log($scope.password);
                $rootScope.registedPwd = $scope.pass.password;
                var params = {
                    email: $rootScope.UserEmail,
                    password: $scope.pass.password,
                    apiSsoURL: $rootScope.ssopatienttoken,
                    success: function (data) {
                        $rootScope.accessToken = data.access_token;
                        $scope.doGetUserTimezone();
                        $scope.getCurrentTimeForSessionLogout = new Date();
                        $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                        $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                        if (typeof data.access_token == 'undefined') {
                            $('#loginPwdVerify').hide();
                            $('#loginPwd').show();
                            $scope.ErrorMessage = "Incorrect Password. Please try again";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.tokenStatus = 'alert-success';
                            $scope.doGetCodesSet();
                            $scope.chkPatientFilledAllRequirements();

                        }
                        window.localStorage.setItem('rootScope', angular.fromJson($rootScope));
                    },
                    error: function (data, status) {
                        $('#loginPwdVerify').hide();
                        $('#loginPwd').show();
                        if (status == '401' || status == '403') {
                            $scope.ErrorMessage = "We are unable to log you in. Please contact customer support regarding your account";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status == '404') {
                            $scope.ErrorMessage = "Incorrect Username or Password. Please try again!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status === 503) {
                            $scope.callServiceUnAvailableError();
                        } else if (status === 0) {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.ErrorMessage = "Incorrect Password. Please try again";
                            $rootScope.Validation($scope.ErrorMessage);
                        }

                    }
                };
                LoginService.getcheckssoToken(params);
            }
        }

        $scope.doGetUserTimezone = function () {
            $rootScope.userTimeZoneId = '';
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.userTimeZoneId = data.message;
                },
                error: function (data, status) {
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

            LoginService.getUserTimezone(params);
        }

        $scope.doGetToken = function () {
            if ($('#password').val() === '') {
                $scope.ErrorMessage = "Please enter your password";
                $rootScope.Validation($scope.ErrorMessage);
            } else {

                $('#loginPwd').hide();
                $('#loginPwdVerify').show();
                $rootScope.registedPwd = $scope.pass.password;
                var params = {
                    email: $rootScope.UserEmail,
                    password: $scope.pass.password,
                    userTypeId: 1,
                    hospitalId: $rootScope.hospitalId,
                    success: function (data) {
                        $rootScope.accessToken = data.data[0].access_token;

                        var userData = {};
                        userData.apiDeveloperId = util.getHeaders()["X-Developer-Id"];
                        userData.apiKey = util.getHeaders()["X-Api-Key"];
                        userData.token = data.data[0].access_token;
                        userData.snapLogin = true;
                        var userDataJsonData = JSON.stringify(userData);
                        $window.localStorage.setItem('snap_user_session', userDataJsonData);

                        $scope.getCurrentTimeForSessionLogout = new Date();
                        $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                        $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                        if (typeof data.data[0].access_token === 'undefined') {
                            $('#loginPwdVerify').hide();
                            $('#loginPwd').show();
                            $scope.ErrorMessage = "Incorrect Password. Please try again";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.tokenStatus = 'alert-success';
                            $scope.getPatDetailsForSession();
                            // $scope.doGetUserTimezone();
                            // $scope.doGetCodesSet();
                            // $scope.chkPatientFilledAllRequirements();
                        }
                        window.localStorage.setItem('rootScope', angular.fromJson($rootScope));
                    },
                    error: function (data, status) {
                        $('#loginPwdVerify').hide();
                        $('#loginPwd').show();

                        if (status === '401' || status === '403') {
                            $scope.ErrorMessage = "We are unable to log you in. Please contact customer support regarding your account";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status === 503) {
                            $scope.callServiceUnAvailableError();
                        } else if (status === 0) {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.ErrorMessage = "Incorrect Password. Please try again";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        //  }
                    }
                };
                LoginService.getToken(params);
            }
        }



        $scope.$on('IdleStart', function () {

        });
        $scope.$on('IdleWarn', function () { });
        $scope.$on('IdleTimeout', function () {

            if (window.localStorage.getItem("tokenExpireTime") !== null && window.localStorage.getItem("tokenExpireTime") !== "") {
                if ($rootScope.currState.$current.name !== "tab.waitingRoom" && $rootScope.currState.$current.name !== "videoConference") {

                    navigator.notification.alert(
                        SessTimedOutMsg, // message
                        null,
                        $rootScope.alertMsgName,
                        SessTimedOk // buttonName
                    );
                    $rootScope.ClearRootScope();
                }
            }
        });

        $scope.$on('IdleEnd', function () {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog

        });

        $scope.$on('Keepalive', function () {
            // do something to keep the user's session alive

        });

        $scope.emailType = 'resetpassword';

        $scope.doPostSendPasswordResetEmail = function () {

            if (deploymentEnv === "Single" && cobrandApp !== 'MDAmerica') {
                $scope.userEmailId = $('#UserEmail').val();
            } else if (deploymentEnv === "Single" && cobrandApp === 'MDAmerica') {
                $scope.userEmailId = $rootScope.UserEmail;
            } else {
                $scope.userEmailId = $rootScope.UserEmail;
            }
            if ($scope.userEmailId === '') {

                $scope.ErrorMessage = "Please enter an email!";
                $rootScope.Validation($scope.ErrorMessage);
            } else {

                $scope.ValidateEmail = function (email) {
                    var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return expr.test(email);
                };
                if (!$scope.ValidateEmail($scope.userEmailId)) {
                    $scope.ErrorMessage = "Please enter a valid email address";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    if (deploymentEnv === "Single" && cobrandApp !== 'MDAmerica') {
                        if (deploymentEnvLogout === 'Single') {
                            if (deploymentEnvForProduction === 'Production') {
                                //   if (appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) {
                                if ((appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) || (appStoreTestUserEmail2 !== '' && $("#UserEmail").val() === appStoreTestUserEmail2)) {
                                    $rootScope.hospitalId = singleStagingHospitalId;
                                    apiCommonURL = 'https://snap-stage.com';
                                    api_keys_env = 'Staging';
                                    $rootScope.APICommonURL = 'https://snap-stage.com';
                                } else {

                                    $rootScope.hospitalId = singleHospitalId;
                                    apiCommonURL = 'https://connectedcare.md';
                                    api_keys_env = 'Production';
                                    $rootScope.APICommonURL = 'https://connectedcare.md';
                                }
                            } else if (deploymentEnvForProduction === 'Staging') {
                                $rootScope.hospitalId = singleStagingHospitalId;
                                api_keys_env = "Staging";
                            } else if (deploymentEnvForProduction === 'QA') {
                                $rootScope.hospitalId = singleQAHospitalId;
                                api_keys_env = "QA";
                            } else if (deploymentEnvForProduction === 'Sandbox') {
                                $rootScope.hospitalId = singleSandboxHospitalId;
                                api_keys_env = "Sandbox";
                            }
                        }
                        var convertedemail = $scope.userLogin.UserEmail.toString();
                        if ($("#squaredCheckbox").prop('checked') === true) {
                            $window.localStorage.setItem('username', $("#UserEmail").val());
                            $window.localStorage.oldEmail = convertedemail;
                            $rootScope.UserEmail = convertedemail;
                            $rootScope.chkedchkbox = true;

                        } else {
                            $rootScope.UserEmail = convertedemail;
                            $window.localStorage.oldEmail = '';
                            $window.localStorage.setItem('username', "");
                            $rootScope.chkedchkbox = false;
                        }
                    }

                    if ($rootScope.customerSso === "Mandatory" && $rootScope.ssopatientforgetpwd != "") {

                        var params = {
                            email: $rootScope.UserEmail,
                            apiSsoURL: $rootScope.ssopatientforgetpwd,
                            success: function (data) {
                                $scope.PasswordResetEmail = data;
                                $state.go('tab.resetPassword');
                            },
                            error: function (data, status) {
                                if (status === '404') {
                                    $scope.ErrorMessage = "Email Address not Found";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status == null) {
                                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status === 0) {
                                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status === 503) {
                                    $scope.callServiceUnAvailableError();
                                } else {
                                    $rootScope.serverErrorMessageValidation();
                                }
                            }
                        };
                        LoginService.ssoPasswordReset(params);

                    }
                    else {
                        var params = {
                            patientEmail: $rootScope.UserEmail,
                            emailType: $scope.emailType,
                            hospitalId: $rootScope.hospitalId,
                            accessToken: $rootScope.accessToken,
                            success: function (data) {
                                $scope.PasswordResetEmail = data;
                                $state.go('tab.resetPassword');
                            },
                            error: function (data, status) {
                                if (status === '404') {
                                    $scope.ErrorMessage = "Email Address not Found";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status == null) {
                                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status === 0) {
                                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (status === 503) {
                                    $scope.callServiceUnAvailableError();
                                } else {
                                    $rootScope.serverErrorMessageValidation();
                                }
                            }
                        };
                        LoginService.postSendPasswordResetEmail(params);
                    }
                }
            }
        }

        $scope.goBackFromReset = function () {
            if (deploymentEnv === "Single" && cobrandApp !== 'MDAmerica') {
                $state.go('tab.loginSingle');
            } else {
                $state.go('tab.password');
            }
        }

        $rootScope.doGetTermsandCondition = function (registerRedirectPage, registerCurrentPage) {
            if ($rootScope.regCountry2 == "" || $rootScope.regCountry2 == 'Choose') {
                $rootScope.regCountry2 = $('#regCountryCode').val();
            } else if ($rootScope.regCountry2 != "") {
                if ($('#regCountryCode').val() != "Choose") {
                    $rootScope.regCountry2 = $('#regCountryCode').val();
                } else {
                    $rootScope.regCountry2 = $rootScope.regCountry2;
                }

            } else {
                $rootScope.regCountry2 = $('#regCountryCode').val();
            }

            
            if (deploymentEnvLogout === 'Single') {
                if (deploymentEnvForProduction === 'Production') {
                    //    if (appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) {
                    if ((appStoreTestUserEmail !== '' && $("#UserEmail").val() === appStoreTestUserEmail) || (appStoreTestUserEmail2 !== '' && $("#UserEmail").val() === appStoreTestUserEmail2)) {
                        $rootScope.hospitalId = singleStagingHospitalId;
                        apiCommonURL = 'https://emerald.stage.snapvcm.com';
                        api_keys_env = 'Staging';
                        $rootScope.APICommonURL = 'https://emerald.stage.snapvcm.com';
                    } else {

                        $rootScope.hospitalId = singleHospitalId;
                        apiCommonURL = 'https://connectedcare.md';
                        api_keys_env = 'Production';
                        $rootScope.APICommonURL = 'https://connectedcare.md';
                    }
                } else if (deploymentEnvForProduction === 'Staging') {
                    $rootScope.hospitalId = singleStagingHospitalId;
                    api_keys_env = "Staging";
                } else if (deploymentEnvForProduction === 'QA') {
                    $rootScope.hospitalId = singleQAHospitalId;
                    api_keys_env = "QA";
                } else if (deploymentEnvForProduction === 'Sandbox') {
                    $rootScope.hospitalId = singleSandboxHospitalId;
                    api_keys_env = "Sandbox";
                }
            }


            var params = {
                documentType: 1,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.termsandCOnditionsContent = angular.element('<div>').html(data.data[0].documentText).text();
                    $rootScope.registerRedirectPage = registerRedirectPage;
                    $rootScope.registerCurrentPage = registerCurrentPage;
                    $state.go(registerRedirectPage);

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getConcentToTreat(params);
            $('body').toggleClass('is-main-nav');
        }
        $scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns,eyecolor,haircolor,ethnicity,bloodtype,relationship,heightunit,weightunit';




        $rootScope.searchPatientList = {};
        $scope.searched = false;


        $scope.$watch('data.searchQuery', function (searchKey) {
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
        $scope.$on("callPatientAndDependentProfiles", function (event, args) {
            if ($rootScope.hasRequiredFields === false) {
                $rootScope.doGetPatientProfiles();
                //  $rootScope.doGetRelatedPatientProfiles('tab.userhome');
                $rootScope.imgUploadPatientProfile = false;
                $rootScope.hasRequiredFields = true;
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
                $("#HealthFooter").css("display", "block");
            } else {
                //$rootScope.doGetRelatedPatientProfiles('tab.Health');
                $rootScope.imgUploadPatientProfile = true;
                $rootScope.doGetPatientProfiles();
            }


        });

        $scope.doGetConutriesList = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    //  $rootScope.aaa = [];
                    $rootScope.serviceCountries = angular.fromJson(data.data);
                    /* angular.forEach($rootScope.serviceCountries, function(item,index) {
                       if((item.code).length === 2) {
                         $scope.cntryCode = item.code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ item.name;
                       } else if((item.code).length === 3) {
                          $scope.cntryCode = item.code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ item.name
                       } else if((item.code).length === 4) {
                          $scope.cntryCode = item.code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ item.name
                       }
                          $rootScope.aaa.push({
                              'code': item.code,
                              'name': item.name,
                              'id': item.id,
                              'sd': $scope.cntryCode
                          });
                      });*/
                    $scope.getTimezoneList();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getCountiesList(params);
        }

        $scope.getTimezoneList = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    addGroupingToTimeZone(data.data);

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getTimezoneList(params);
        }

        var isDST = function (t) {
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

        }

        $rootScope.doGetPatientProfiles = function () {
            $rootScope.primaryPatientDetails = '';
            $rootScope.patientInfomation = '';
            $rootScope.patientAccount = '';
            $rootScope.patientAddresses = '';
            $rootScope.patientAnatomy = '';
            $rootScope.patientPharmacyDetails = '';
            $rootScope.patientPhysicianDetails = '';
            $rootScope.encounterstate = '';
            $rootScope.encountercountry = '';
            $rootScope.encounterStateCode = '';
            $rootScope.encounterCountryCode = '';
            $rootScope.stateAddressesCode = '';
            $rootScope.countryAddressCode = '';

            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {

                    $rootScope.primaryPatientDetails = [];
                    $rootScope.addressInfoFetch = [];
                    angular.forEach(data.data, function (index) {
                        $rootScope.primaryPatientDetails.push({
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
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
                        $rootScope.addressInfoFetch.push({
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
                        });
                    });
                    // $rootScope.addressInfoFetch = '';
                    // $rootScope.addressInfoFetch = $scope.primaryPatientDetailsSecond;
                    $rootScope.primaryPatientDetails[0].address = ($rootScope.primaryPatientDetails[0].address != '' ? $rootScope.primaryPatientDetails[0].address : $rootScope.primaryPatientDetails[0].addressObject.addressText);
                    $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                    $rootScope.patientInfomation = data.data[0];
                    $rootScope.patientAccount = data.data[0].account;
                    $rootScope.patientAddresses = data.data[0].addresses;
                    $rootScope.patientAnatomy = data.data[0].anatomy;
                    $rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
                    $rootScope.patientPhysicianDetails = data.data[0].physicianDetails;
                    $rootScope.PatientImage = $rootScope.patientAccount.profileImagePath;
                    $rootScope.patientParticularaddress = data.data[0].addressLocation;
                    if ($rootScope.patientParticularaddress != undefined) {
                        $rootScope.stateaddresses = $rootScope.patientParticularaddress.state;
                        $rootScope.countryaddress = $rootScope.patientParticularaddress.country;
                        $rootScope.stateAddressesCode = $rootScope.patientParticularaddress.stateCode;
                        $rootScope.countryAddressCode = $rootScope.patientParticularaddress.countryCode;
                    }

                    $rootScope.patientEncounteraddress = data.data[0].encounterAddressLocation;
                    if ($rootScope.patientEncounteraddress != undefined) {
                        $rootScope.encounterstate = $rootScope.patientEncounteraddress.state;
                        $rootScope.encounterStateCode = $rootScope.patientEncounteraddress.stateCode;
                        $rootScope.encountercountry = $rootScope.patientEncounteraddress.country;
                        $rootScope.encounterCountryCode = $rootScope.patientEncounteraddress.countryCode;
                    }

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

                    //  $rootScope.doGetScheduledConsulatation();
                    if ($rootScope.imgUploadPatientProfile == true && $rootScope.sessPopup != true) {
                        $rootScope.doGetScheduledNowPhoneConsulatation('tab.healthinfo');
                    } else if ($rootScope.sessPopup != true) {
                        $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                        $scope.doGetPrimaryPatientLastName();
                    }
                },
                error: function (data, status) {
                    $rootScope.patientInfomation = '';
                    $rootScope.patientAccount = '';
                    $rootScope.patientAddresses = '';
                    $rootScope.patientAnatomy = '';
                    $rootScope.patientPharmacyDetails = ''
                    $rootScope.patientPhysicianDetails = '';

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
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };

            LoginService.getPatientProfiles(params);
        }


        $rootScope.doGetPrimaryPatientProfiles = function () {
            $rootScope.primaryPatientDetails = '';
            $rootScope.patientInfomation = '';
            $rootScope.patientAccount = '';
            $rootScope.patientAddresses = '';
            $rootScope.patientAnatomy = '';
            $rootScope.patientPharmacyDetails = '';
            $rootScope.patientPhysicianDetails = '';
            $rootScope.encounterstate = '';
            $rootScope.encountercountry = '';
            $rootScope.encounterStateCode = '';
            $rootScope.encounterCountryCode = '';
            $rootScope.stateAddressesCode = '';
            $rootScope.countryAddressCode = '';

            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {

                    $rootScope.primaryPatientDetails = [];
                    $rootScope.addressInfoFetch = [];
                    angular.forEach(data.data, function (index) {
                        $rootScope.primaryPatientDetails.push({
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
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
                        $rootScope.addressInfoFetch.push({
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
                        });
                    });
                    // $rootScope.addressInfoFetch = '';
                    // $rootScope.addressInfoFetch = $scope.primaryPatientDetailsSecond;
                    $rootScope.primaryPatientDetails[0].address = ($rootScope.primaryPatientDetails[0].address != '' ? $rootScope.primaryPatientDetails[0].address : $rootScope.primaryPatientDetails[0].addressObject.addressText);
                    $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                    $rootScope.patientInfomation = data.data[0];
                    $rootScope.patientAccount = data.data[0].account;
                    $rootScope.patientAddresses = data.data[0].addresses;
                    $rootScope.patientAnatomy = data.data[0].anatomy;
                    $rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
                    $rootScope.patientPhysicianDetails = data.data[0].physicianDetails;
                    $rootScope.PatientImage = $rootScope.patientAccount.profileImagePath;
                    $rootScope.patientParticularaddress = data.data[0].addressLocation;
                    if ($rootScope.patientParticularaddress != undefined) {
                        $rootScope.stateaddresses = $rootScope.patientParticularaddress.state;
                        $rootScope.countryaddress = $rootScope.patientParticularaddress.country;
                        $rootScope.stateAddressesCode = $rootScope.patientParticularaddress.stateCode;
                        $rootScope.countryAddressCode = $rootScope.patientParticularaddress.countryCode;
                    }

                    $rootScope.patientEncounteraddress = data.data[0].encounterAddressLocation;
                    if ($rootScope.patientEncounteraddress != undefined) {
                        $rootScope.encounterstate = $rootScope.patientEncounteraddress.state;
                        $rootScope.encounterStateCode = $rootScope.patientEncounteraddress.stateCode;
                        $rootScope.encountercountry = $rootScope.patientEncounteraddress.country;
                        $rootScope.encounterCountryCode = $rootScope.patientEncounteraddress.countryCode;
                    }

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

                    //  $rootScope.doGetScheduledConsulatation();
                    if ($rootScope.imgUploadPatientProfile == true && $rootScope.sessPopup != true) {
                        // $rootScope.doGetScheduledNowPhoneConsulatation('tab.healthinfo');
                    } else if ($rootScope.sessPopup != true) {
                        // $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                        $scope.doGetPrimaryPatientLastName();
                    }
                },
                error: function (data, status) {
                    $rootScope.patientInfomation = '';
                    $rootScope.patientAccount = '';
                    $rootScope.patientAddresses = '';
                    $rootScope.patientAnatomy = '';
                    $rootScope.patientPharmacyDetails = ''
                    $rootScope.patientPhysicianDetails = '';

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
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };

            LoginService.getPatientProfiles(params);
        }

        $scope.doGetPrimaryPatientLastName = function () {

            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.primaryPatientLastNameArray = [];
                    angular.forEach(data.data, function (index) {
                        $rootScope.primaryPatientLastNameArray.push({
                            'id': index.$id,
                            'patientName': index.patientName,

                            'lastName': htmlEscapeValue.getHtmlEscapeValue(index.lastName),
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
                    if (!angular.isUndefined($rootScope.primaryPatientLastNameArray[0].lastName)) {
                        $rootScope.primaryPatientLastName = angular.element('<div>').html($rootScope.primaryPatientLastNameArray[0].lastName).text();
                    } else {
                        $rootScope.primaryPatientLastName = '';
                    }
                    $rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' ' + $rootScope.primaryPatientLastName;

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getPrimaryPatientLastName(params);
        }
        $scope.getPatDetailsForSession = function () {
            $rootScope.primaryPatSSDetails = '';
            $rootScope.currentPatientDetails = '';
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.currentPatientDetails = data.data[0];
                    $rootScope.doGetActiveSession();
                },
                error: function (data, status) {
                    $('#loginPwdVerify').hide();
                    $('#loginPwd').show();
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getPatientFilledAllRequirements(params);
        }

        $scope.chkPatientFilledAllRequirements = function () {
            $rootScope.primaryPatSSDetails = '';
            $scope.doGetConutriesList();
            $rootScope.doGetLocations();
            $rootScope.doGetCountries();
            $rootScope.getStatesForUS();

            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.hasRequiredFields = data.data[0].hasRequiredFields;
                    $rootScope.userRoleDescription = data.data[0].userRoleDescription;
                    $rootScope.currentPatientDetails = data.data;;
                    $rootScope.systemTimeZoneID = data.data[0].timeZoneSystemId;
                    // $rootScope.Country_cod =  $rootScope.currentPatientDetails[0].mobilePhone;
                    if (typeof $rootScope.currentPatientDetails[0].mobilePhone != 'undefined') {
                        $rootScope.Country_codsplit = $rootScope.currentPatientDetails[0].mobilePhone.split('(');
                        $rootScope.countrycodevalue = $rootScope.Country_codsplit[0];
                    } else {
                        $rootScope.Country_codsplit = '';
                        $rootScope.countrycodevalue = '';
                    }
                    var profileData = {};
                    profileData.firstName = data.data[0].firstName;
                    profileData.fullName = data.data[0].fullName;
                    profileData.name = data.data[0].fullName;
                    profileData.gender = data.data[0].gender;
                    profileData.lastName = data.data[0].lastName;
                    profileData.profileId = data.data[0].profileId;
                    profileData.id = data.data[0].profileId;
                    profileData.userId = data.data[0].userId;
                    profileData.personId = data.data[0].userId;
                    profileData.timeZone = data.data[0].timeZone;
                    profileData.timeZoneId = data.data[0].timeZoneId;
                    profileData.hasRequiredFields = data.data[0].hasRequiredFields;
                    profileData.contactNumber = data.data[0].mobilePhone;
                    profileData.info = data.data[0].mobilePhone;
                    profileData.dob = data.data[0].dob;
                    profileData.isLogouted = false;

                    /*  profileData.profileImage = data.data[0].profileImagePath
                          || getDefaultProfileImageForPatient(data.data[0].gender);*/


                    if (data.data[0].profileImage.indexOf("api") <= 0) {
                        profileData.profileImage = 'images/default-user.jpg';
                        profileData.imageSource = 'images/default-user.jpg';
                    } else {
                        profileData.profileImage = data.data[0].profileImage;
                        profileData.imageSource = data.data[0].profileImage;
                    }


                    var userProfileJsonData = JSON.stringify(profileData);
                    $rootScope.primaryPatSSDetails = userProfileJsonData;
                    $window.localStorage.setItem('snap_patientprofile_session', userProfileJsonData);
                    $rootScope.passwordPreviousPage = false;

                    if ($rootScope.hasRequiredFields === true) {
                        $rootScope.cuttlocations = "";
                        $rootScope.viewmyhealthDisplay = 'block';
                        $rootScope.viewhealthDisplay = 'none';
                        $rootScope.passwordPreviousPage = true;
                        $scope.GetUserAccountCondition(profileData.id);
                        $state.go('tab.userhome');

                        //  $rootScope.doGetPatientProfiles();
                        //  $rootScope.doGetRelatedPatientProfiles('tab.userhome');
                    } else {
                        $scope.doGetSingleHospitalRegistrationInformation();
                        $rootScope.checkedpatientdet = '';
                        $rootScope.PatientidupdateList = [];
                        $rootScope.primaryPatientId = $rootScope.currentPatientDetails[0].profileId;

                        $scope.chkPatientFillDetails = true;
                        if ($rootScope.currentPatientDetails[0].profileId != '25198') {
                            $rootScope.doGetRequiredPatientProfiles($rootScope.currentPatientDetails[0].profileId, $scope.chkPatientFillDetails);
                        }
                        $scope.GetUserAccountCondition(profileData.id);
                        $state.go('tab.healthinfo');


                    }

                },
                error: function (data, status) {
                    $('#loginPwdVerify').hide();
                    $('#loginPwd').show();
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getPatientFilledAllRequirements(params);
        }
        $scope.getOnlyNumbers = function (text) {
            var newStr = "";
            if (text) {
                newStr = text.replace(/[^0-9.]/g, "");
            }
            return newStr;
        }

        $scope.goTOSchedule = function () {
            //  $("#localize-widget").show();
            if ($rootScope.currState.$current.name == "tab.userhome") {
                $window.localStorage.setItem('snap_patientprofile_session', $rootScope.primaryPatSSDetails);
            }
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }

        $rootScope.doGetRequiredPatientProfiles = function (patientId, chkPreviousPage, cutlocations, authen) {
            if (chkPreviousPage === true) {
                $rootScope.PatientImageSelectUser = '';
                $rootScope.PatientImage = '';
                $rootScope.primaryPatientName = '';
                $rootScope.primaryPatientLastName = '';
                $rootScope.dob = '';
                $rootScope.primaryPatGender = '';
            }

            var params = {
                accessToken: $rootScope.accessToken,
                patientId: patientId,
                success: function (data) {
                    $scope.selectedPatientDetails = [];
                    $rootScope.addressInfoFetch = [];
                    //angular.fromJson(index.billingAddress)
                    angular.forEach(data.data, function (index) {
                        $scope.selectedPatientDetails.push({
                            'identifiers': angular.fromJson(index.identifiers),
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
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

                        $rootScope.addressInfoFetch.push({
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
                        });

                    });
                    $scope.selectedPatientDetails[0].address = ($scope.selectedPatientDetails[0].address != '' ? $scope.selectedPatientDetails[0].address : $scope.selectedPatientDetails[0].addressObject.addressText);
                    $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                    $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                    $rootScope.addressInfoFetch = $scope.selectedPatientDetails;
                    $rootScope.patientId = $rootScope.currentPatientDetails[0].account.patientId;

                $rootScope.userline1 = $rootScope.addressInfoFetch[0].addressObject.line1;
                $rootScope.userline2 = $rootScope.addressInfoFetch[0].addressObject.line2;
                $rootScope.usercity = $rootScope.addressInfoFetch[0].addressObject.city;
                $rootScope.userstate = $rootScope.addressInfoFetch[0].addressObject.state;
                $rootScope.userstateCode = $rootScope.addressInfoFetch[0].addressObject.stateCode;
                $rootScope.userpostalCode = $rootScope.addressInfoFetch[0].addressObject.postalCode;
                $rootScope.usercountry = $rootScope.addressInfoFetch[0].addressObject.country;
                $rootScope.usercountryCode = $rootScope.addressInfoFetch[0].addressObject.countryCode;

                    console.log("data");
                    console.log($rootScope.currentPatientDetails);
                    $rootScope.currentPatientDetails[0].homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].homePhone));
                    $rootScope.currentPatientDetails[0].mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].mobilePhone));
                    if (chkPreviousPage === true) {
                        $rootScope.PatientImageSelectUser = $rootScope.currentPatientDetails[0].account.profileImage;
                        $rootScope.PatientImage = $rootScope.PatientImageSelectUser;
                        $rootScope.primaryPatientName = $rootScope.currentPatientDetails[0].patientName;
                        $rootScope.primaryPatientLastName = $rootScope.currentPatientDetails[0].lastName;
                        $rootScope.dob = $rootScope.currentPatientDetails[0].dob;
                        $rootScope.getHealtPageForFillingRequiredDetails();
                    } else {
                        $rootScope.GoToPatientDetails(cutlocations, $rootScope.currentPatientDetails[0].account.profileImagePath, $rootScope.currentPatientDetails[0].patientName, $rootScope.currentPatientDetails[0].lastName, $rootScope.currentPatientDetails[0].dob, $rootScope.currentPatientDetails[0].guardianName, $rootScope.patientId, authen, ' ');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }

                }
            };

            LoginService.getSelectedPatientProfiles(params);


        }
        $scope.loadDependent = function () {
            $rootScope.RelatedPatientProfiles = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.RelatedPatientProfiles = [];
                    angular.forEach(data.data, function (index) {
                        if (typeof index.gender !== 'undefined') {
                            if (index.gender === 'F') {
                                $scope.patGender = "Female";
                            } else {
                                $scope.patGender = "Male";
                            }
                        } else {
                            $scope.patGender = "NA";
                        }
                        if (typeof $rootScope.listOfRelationship !== 'undefined' && $rootScope.listOfRelationship !== '') {
                            var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCode
                            })
                            if (getdependRelationShip.length !== 0) {
                                var depRelationShip = getdependRelationShip[0].text;
                            } else {
                                var depRelationShip = '';
                            }
                        } else {
                            var depRelationShip = '';
                        }

                        $rootScope.RelatedPatientProfiles.push({
                            'id': index.$id,
                            'patientId': index.patientId,
                            'patientName': index.patientName,
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
                            'personId': index.personId,

                        });
                    });
                    $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
                    $scope.doGetCodesSet();
                    if (ReDirectPage === 'tab.userhome') {
                        $('#loginPwdVerify').hide();
                        $('#loginPwd').show();
                        if (deploymentEnv === "Single") {
                            $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme();
                        } else {
                            if ($rootScope.cuttlocations == "tab.ReportScreen") {
                                $state.go('tab.userhome');
                            }
                            // else if ($rootScope.cuttlocations == undefined) {
                            //   $scope.doGetlocationResponse();
                            // } else {
                            //     $scope.doGetlocationResponse();
                            // }
                        }
                    } else {
                        $state.go('tab.healthinfo');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getRelatedPatientProfiles(params);
        };

        $rootScope.doGetRelatedPatientProfiles = function (ReDirectPage) {
            $rootScope.RelatedPatientProfiles = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.RelatedPatientProfiles = [];
                    angular.forEach(data.data, function (index) {
                        if (typeof index.gender !== 'undefined') {
                            if (index.gender === 'F') {
                                $scope.patGender = "Female";
                            } else {
                                $scope.patGender = "Male";
                            }
                        } else {
                            $scope.patGender = "NA";
                        }
                        if (typeof $rootScope.listOfRelationship !== 'undefined' && $rootScope.listOfRelationship !== '') {
                            var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCode
                            })
                            if (getdependRelationShip.length !== 0) {
                                var depRelationShip = getdependRelationShip[0].text;
                            } else {
                                var depRelationShip = '';
                            }
                        } else {
                            var depRelationShip = '';
                        }
                        if ($rootScope.scheduledList != '') {
                            var appoint = $rootScope.scheduledList.filter(function (r) { var show = r.patientId == index.patientId; return show; });
                        } else {
                            var appoint = '';
                        }
                        $rootScope.RelatedPatientProfiles.push({
                            'id': index.$id,
                            'patientId': index.patientId,
                            'patientName': index.patientName,
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
                            'personId': index.personId,
                            'appoint': angular.fromJson(appoint[0])
                        });
                    });
                    $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
                    $scope.doGetCodesSet();
                    if (ReDirectPage === 'tab.userhome') {
                        $('#loginPwdVerify').hide();
                        $('#loginPwd').show();
                        if (deploymentEnv === "Single") {
                            $scope.doGetSingleUserHospitalInformationForCoBrandedHardCodedColorScheme();
                        } else {
                            if ($rootScope.cuttlocations == "tab.ReportScreen" && (!$rootScope.passwordPreviousPage || $rootScope.passwordPreviousPage == '')) {
                                $state.go('tab.userhome');
                                /*  }  else if ($rootScope.cuttlocations == undefined) {
                                    $scope.doGetlocationResponse();*/
                            } else {
                                $rootScope.cuttlocations = "tab.ReportScreen";
                                $rootScope.passwordPreviousPage = false;
                                $scope.doGetWaitingConsultent();
                                //$scope.doGetlocationResponse();
                            }
                        }
                    } else {
                        $state.go('tab.healthinfo');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getRelatedPatientProfiles(params);
        }

        $scope.updateYesCurrentLocation = function () {
            if (typeof $rootScope.patientEncounteraddress === 'undefined' && typeof $rootScope.patientParticularaddress !== 'undefined') {
                //   $scope.upcountrystate = $rootScope.stateAddressesCode +","+$rootScope.countryAddressCode;
                $scope.countryRegion = $rootScope.stateAddressesCode;
                $scope.countryCode = $rootScope.countryAddressCode;
            } else if ($rootScope.patientEncounteraddress !== '' && typeof $rootScope.patientEncounteraddress !== 'undefined' && $rootScope.encounterstate !== '') {
                $scope.countryRegion = $rootScope.encounterStateCode;
                $scope.countryCode = $rootScope.encounterCountryCode;
            } else if ($rootScope.encountercountry !== '' && $rootScope.encounterstate === '') {
                $scope.countryCode = $rootScope.encounterCountryCode;
                $scope.countryRegion = '';
            } else if (typeof $rootScope.patientEncounteraddress === 'undefined' && typeof $rootScope.patientParticularaddress === 'undefined') {
                $scope.countryCode = $rootScope.primaryPatientDetails[0].address;
                $scope.countryRegion = '';
            }
            var params = {
                accessToken: $rootScope.accessToken,
                countrystate: $scope.countryCode,
                countryRegion: $scope.countryRegion,
                patientID: $rootScope.primaryPatientId,
                //state:  $scope.upstate,

                success: function (data, status) {
                    //  history.back();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.putListOfCountryLocation(params);
        }

        var deregisterBackButton;
        $scope.doGetlocationResponse = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.active == true) {
                        $state.go('tab.userhome');

                        deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) { }, 401);

                        var confirmPopup = $ionicPopup.confirm({

                            title: "<div class='locationtitle localizejs'> Confirm Current Location </div> ",

                            templateUrl: 'templates/currentLocation.html',
                            cssClass: 'locpopup',
                            hardwareBackButtonClose: false,

                            buttons: [{
                                text: '<b class="localizejs">No</b>',
                                onTap: function (e) {

                                    $scope.showAlert();
                                    return true;
                                }
                            }, {
                                text: '<b class="localizejs">Yes</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    //  return true;
                                    //$rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                                }
                            },],

                        });
                        $timeout(function () {
                            confirmPopup.close();
                        }, 1794000);
                        confirmPopup.then(function (res) {
                            if (res) {
                                deregisterBackButton();
                            } else {
                                $scope.updateYesCurrentLocation();
                                //  $rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                            }
                        });
                    } else {
                        $state.go('tab.userhome');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };

            LoginService.getLocationResponse(params);
        }

        $scope.doGetWaitingConsultantPatientProfiles = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: $rootScope.videoWaitingConsultentDetails[0].patientId,
                success: function (data) {
                    $scope.selectedPatientDetails = [];
                    angular.forEach(data.data, function (index) {
                        $scope.selectedPatientDetails.push({
                            'identifiers': angular.fromJson(index.identifiers),
                            'account': angular.fromJson(index.account),
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
                            'anatomy': angular.fromJson(index.anatomy),
                            'countryCode': index.countryCode,
                            'createDate': index.createDate,
                            'fieldChangesTrackingDetails': angular.fromJson(index.fieldChangesTrackingDetails),
                            'dependentRelation': angular.fromJson(index.dependentRelation),
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
                    $scope.selectedPatientDetails[0].address = ($scope.selectedPatientDetails[0].address != '' ? $scope.selectedPatientDetails[0].address : $scope.selectedPatientDetails[0].addressObject.addressText);
                    $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                    $rootScope.cutaddress = $rootScope.currentPatientDetails[0].address; //surya commanded
                    //$rootScope.cutaddress = $rootScope.currentPatientDetails[0].addresses[0].addressText;

                    $rootScope.PatientIdentifiers = $rootScope.currentPatientDetails[0].identifiers;
                    $rootScope.PatidentifierCount = $scope.PatientIdentifiers.length;
                    var cutaddresses = $rootScope.cutaddress.split(",");
                    $rootScope.stateaddresses = cutaddresses[0];
                    var date = new Date($rootScope.currentPatientDetails[0].dob);
                    $rootScope.userDOBDateFormat = date;
                    $rootScope.userDOBDateForAuthorize = $filter('date')(date, "MM-dd-yyyy");
                    //  $rootScope.userGender = $rootScope.currentPatientDetails[0].gender;
                    if ($rootScope.currentPatientDetails[0].gender === 'M' || $rootScope.currentPatientDetails[0].gender === 'Male') {
                        $rootScope.userGender = "Male";
                    } else if ($rootScope.currentPatientDetails[0].gender === 'F' || $rootScope.currentPatientDetails[0].gender === 'Female') {
                        $rootScope.userGender = "Female";
                    }
                    $rootScope.userDOB = $rootScope.currentPatientDetails[0].dob;
                    if ($rootScope.primaryPatientId != $rootScope.videoWaitingConsultentDetails[0].patientId) {
                        $rootScope.patRelationShip = $rootScope.currentPatientDetails[0].dependentRelation.relationship;
                    } else {
                        $rootScope.patRelationShip = '';
                    }

                    $.getScript("lib/jquery.signalR-2.1.2.js", function (data, textStatus, jqxhr) {

                    });
                    setTimeout(function () {
                        $scope.enterWaitingRoom($rootScope.currentPatientDetails[0].account.profileImage, $rootScope.currentPatientDetails[0].patientName, $rootScope.currentPatientDetails[0].lastName, $rootScope.currentPatientDetails[0].dob, $rootScope.primaryPatientName)
                    }, 100);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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

        $scope.doDeleteWaitingConsultant = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                consultationId: $rootScope.videoWaitingConsultentDetails[0].consultationId,
                success: function (data) {
                    if (ionic.Platform.is('browser') !== true) {
                        navigator.notification.alert(
                            //  'Consultation saved successfully!', // message
                            consultSaveMsg,
                            function () {
                                $scope.doGetlocationResponse();
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            sessAlertDone  //  'Done' // buttonName
                        );
                        return false;
                    } else {
                        $scope.doGetlocationResponse();
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        navigator.notification.alert(
                            //'Failed to save consultation!', // message
                            consultFailMsg,
                            function () {
                                $scope.doGetlocationResponse();
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            sessAlertDone //  'Done' // buttonName
                        );
                        return false;
                    }
                }
            };
            LoginService.deleteWaitingConsultant(params);
        }

        $scope.doGetWaitingConsultent = function () {
            $rootScope.WaitingConsultentDetails = '';
            $rootScope.videoWaitingConsultentDetails = '';
            $rootScope.phoneWaitingConsultentDetails = '';
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data.length !== 0) {
                        $state.go('tab.userhome');
                        $rootScope.WaitingConsultentDetails = [];
                        angular.forEach(data.data, function (index, item) {
                            $rootScope.WaitingConsultentDetails.push({
                                'consultantUserId': index.consultantUserId,
                                'consultationDateInfo': index.consultationDateInfo,
                                'consultationId': index.consultationId,
                                'createdDate': index.createdDate,
                                'doctorStatus': index.doctorStatus,
                                'encounterTypeCode': index.encounterTypeCode,
                                'expireDate': index.expireDate,
                                'expireDateInfo': index.expireDateInfo,
                                'isTimeConverted': index.isTimeConverted,
                                'meetingId': index.meetingId,
                                'patientId': index.patientId,
                                'patientStatus': index.patientStatus,
                                'personId': index.personId,
                                'status': index.status
                            });
                        });

                        $rootScope.videoWaitingConsultentDetails = $rootScope.WaitingConsultentDetails.filter(function (r) { var show = r.encounterTypeCode == 3; return show; });
                        $rootScope.phoneWaitingConsultentDetails = $rootScope.WaitingConsultentDetails.filter(function (r) { var show = r.encounterTypeCode == 2; return show; });
                        $rootScope.consultationId = $rootScope.videoWaitingConsultentDetails[0].consultationId;
                        $rootScope.patientId = $rootScope.videoWaitingConsultentDetails[0].patientId;
                        deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) { }, 401);

                        var confirmPopup = $ionicPopup.confirm({

                            title: "<div class='locationtitle appointProgreeTitle localizejs'> Appointment in progress </div> ",

                            templateUrl: 'templates/waitingConsultent.html',
                            cssClass: 'locpopup',
                            hardwareBackButtonClose: false,

                            buttons: [{
                                text: '<b class="localizejs">No</b>',
                                onTap: function (e) {
                                    //  $scope.showAlert();
                                    return true;
                                }

                            }, {
                                text: '<b class="localizejs">Yes</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    //  return true;
                                    //$rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                                }
                            },],

                        });
                        $timeout(function () {
                            confirmPopup.close();
                        }, 1794000);
                        confirmPopup.then(function (res) {
                            if (res) {
                                $rootScope.waitingPopupAvailable = false;
                                $scope.doDeleteWaitingConsultant();
                            } else {
                                $rootScope.waitingPopupAvailable = true;
                                $scope.doGetWaitingConsultantPatientProfiles();
                            }
                        });
                    } else {
                        $rootScope.waitingPopupAvailable = false;
                        $scope.doGetlocationResponse();
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };

            LoginService.getWaitingConsultent(params);
        }

        $scope.showAlert = function () {
            $rootScope.doGetCountryLocations();
            $state.go("tab.CurrentLocationlist");
        };
        $scope.cancellocation = function () {
            $scope.doGetlocationResponse();
            //history.back();
        }

        $scope.doGetExistingConsulatation = function () {
            $rootScope.consultionInformation = '';
            $rootScope.appointmentsPatientFirstName = '';
            $rootScope.appointmentsPatientLastName = '';
            $rootScope.appointmentsPatientDOB = '';
            $rootScope.appointmentsPatientGurdianName = '';
            $rootScope.appointmentsPatientImage = '';
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $scope.existingConsultation = data;

                    $rootScope.consultionInformation = data.data[0].consultationInfo;
                    $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                    if (!angular.isUndefined($rootScope.consultationStatusId)) {
                        if ($rootScope.consultationStatusId === 71) {
                            navigator.notification.alert(
                                //  'Your consultation is already started on other device.', // message
                                consultStartMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 72) {
                            navigator.notification.alert(
                                //'Your consultation is already ended.', // message
                                consultEndMeg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 79) {
                            navigator.notification.alert(
                                //  'Your consultation is cancelled.', // message
                                consultCancelMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 80) {
                            navigator.notification.alert(
                                //  'Your consultation is in progress on other device.', // message
                                consultProgMsg,
                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title
                                sessAlertDone //'Done' // buttonName
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
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getExistingConsulatation(params);

        }

        $scope.doGetExistingPatientName = function () {
            var params = {
                patientId: $rootScope.appointmentsPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.appointmentsPatientFirstName = angular.element('<div>').html(data.data[0].patientName).text();
                    $rootScope.appointmentsPatientLastName = angular.element('<div>').html(data.data[0].lastName).text();


                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getPrimaryPatientLastName(params);
        }

        $rootScope.doGetDoctorDetails = function () {
            var params = {
                doctorId: $rootScope.assignedDoctorId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.doctorImage = data.data[0].profileImagePath;
                    $state.go('tab.appoimentDetails');
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getDoctorDetails(params);

        }

        $scope.GetHealthPlanList = function () {
            $scope.doGetPatientHealthPlansList();
        }

        if (typeof $rootScope.providerName === 'undefined' || $rootScope.providerName === "") {
            $rootScope.chooseHealthHide = 'initial';
            $rootScope.chooseHealthShow = 'none';
        } else if (typeof $rootScope.providerName !== 'undefined' || $rootScope.providerName !== "") {
            $rootScope.chooseHealthHide = 'none';
            $rootScope.chooseHealthShow = 'initial';
        }

        $rootScope.openAddHealthPlanSection = function () {
            //  if ($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on' && $rootScope.paymentMode !== 'on') {
            //    if (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') ||  ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on') || $rootScope.copayAmount === 0) {
            if ($rootScope.paymentMode != 'on' && $rootScope.insuranceMode === 'on') {
                $rootScope.applyPlanMode = "none";
                $rootScope.chooseHealthHide = 'initial';
                $rootScope.chooseHealthShow = 'none';
                $rootScope.verifyPlanMode = "block";
            } else {
                $rootScope.applyPlanMode = "block";
                $rootScope.verifyPlanMode = "none";
            }
            $rootScope.consultChargeNoPlanPage = "none";
            $rootScope.healthPlanPage = "block";
            $rootScope.chooseHealthHide = 'initial';
            $rootScope.chooseHealthShow = 'none';
            $rootScope.providerName = "";
            $rootScope.PolicyNo = "";
            $scope.doGetPatientHealthPlansList();
        }

        $scope.openVerifyInsuranceSection = function () {

            $rootScope.verifyHealthPlanPage = "block";
            $rootScope.healthPlanPage = "none";
            $rootScope.consultChargeNoPlanPage = "none";
            $rootScope.chooseHealthHide = 'initial';
            $rootScope.chooseHealthShow = 'none';
            $rootScope.providerName = "";
            $rootScope.PolicyNo = "";
            $scope.doGetPatientHealthPlansList();
        }

        $scope.doGetPatientHealthPlansList = function () {

            var params = {
                patientId: $rootScope.patientId,
                primaryPatientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data != 0) {
                        $rootScope.patientHealthPlanList = [];
                        $rootScope.allPatientHealthPlanList = [];

                        angular.forEach(data.data, function (index, item) {
                            $rootScope.allPatientHealthPlanList.push({
                                'id': index.$id,
                                'healthPlanId': index.healthPlanId,
                                'familyGroupId': index.familyGroupId,
                                'patientId': index.patientId,
                                'insuranceCompany': index.insuranceCompany,
                                'isDefaultPlan': index.isDefaultPlan,
                                'insuranceCompanyPhone': index.insuranceCompanyPhone,
                                'memberName': index.memberName,
                                'members': index.members,
                                'subsciberId': index.subsciberId,
                                'payerId': index.payerId,
                                'policyNumberLong': index.policyNumber,
                                'policyNumber': index.policyNumber.substring(index.policyNumber.length - 4, index.policyNumber.length),
                            });
                        });
                        $rootScope.patientHealthPlanList = $rootScope.allPatientHealthPlanList;
                        //  $rootScope.patientHealthPlanList = $rootScope.allPatientHealthPlanList.filter(function(r) { var show = r.patientId == $rootScope.patientId; return show; });
                        if ($rootScope.patientHealthPlanList.length !== 0) {
                            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.disableAddHealthPlan = "none;";
                                $rootScope.editplan = "block";
                                $rootScope.planchange();
                            } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                                $rootScope.disableAddHealthPlan = "none";
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.editplan = "block";
                                $rootScope.planchange();
                                $state.go('tab.consultCharge');
                            } else if ($rootScope.currState.$current.name === "tab.planeditDetails") {
                                $rootScope.disableAddHealthPlan = "none";
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.editplan = "block";
                                $rootScope.planchange();
                                $state.go('tab.consultCharge');
                            } else if ($rootScope.currState.$current.name === "tab.ConsentTreat") {
                                $rootScope.disableAddHealthPlan = "none";
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.editplan = "none";
                                //  $rootScope.planchange();
                                $state.go('tab.consultCharge');
                            } else {
                                $rootScope.disableAddHealthPlan = "none";
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.editplan = "none";
                                //  $rootScope.planchange();
                                $state.go('tab.consultCharge');
                            }
                        } else {
                            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                                $rootScope.enableAddHealthPlan = "none";
                                $rootScope.disableAddHealthPlan = "block;";
                                $rootScope.editplan = "block";
                            } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                                $rootScope.planchange();
                                $state.go('tab.consultCharge');
                                $rootScope.editplan = "block";
                            } else if ($rootScope.currState.$current.name === "tab.planeditDetails") {
                                $rootScope.planchange();
                                $state.go('tab.consultCharge');
                                $rootScope.editplan = "block";
                            } else if ($rootScope.currState.$current.name === "tab.ConsentTreat") {
                                //   $rootScope.planchange();
                                $rootScope.enableAddHealthPlan = "none";
                                $rootScope.disableAddHealthPlan = "block;";
                                $state.go('tab.consultCharge');
                                $rootScope.editplan = "none";
                            } else {
                                $state.go('tab.consultCharge');
                                $rootScope.editplan = "none";
                            }
                        }
                    } else {
                        if ($rootScope.currState.$current.name === "tab.consultCharge") {
                            $rootScope.enableAddHealthPlan = "none";
                            $rootScope.disableAddHealthPlan = "block;";
                            $rootScope.editplan = "block";
                        } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                            $rootScope.planchange();
                            $state.go('tab.consultCharge');
                            $rootScope.editplan = "block";
                        } else if ($rootScope.currState.$current.name === "tab.planeditDetails") {
                            $rootScope.planchange();
                            $state.go('tab.consultCharge');
                            $rootScope.editplan = "block";
                        } else if ($rootScope.currState.$current.name === "tab.ConsentTreat") {
                            //   $rootScope.planchange();
                            $rootScope.enableAddHealthPlan = "none";
                            $rootScope.disableAddHealthPlan = "block;";
                            $state.go('tab.consultCharge');
                            $rootScope.editplan = "none";
                        } else {
                            $state.go('tab.consultCharge');
                            $rootScope.editplan = "none";
                        }
                    }

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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
        $scope.loadCountriesList = function () {

            /*  $ionicModal.fromTemplateUrl('templates/tab-CountryList.html', {
                  scope: $scope,
                  animation: 'slide-in-up',
                  focusFirstInput: false
              }).then(function(modal) {
                  $scope.modal = modal;
                  $scope.modal.show();
              });*/

        };

        // Onchange of Contries
        $scope.OnSelectContryData = function (CountriesList, items) {
            angular.forEach(CountriesList, function (item) {
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

        $scope.closeCountryList = function () {
            $rootScope.SelectedCountry;
            $scope.modal.hide();

        };
        //End Countries

        $scope.loadStateList = function (CountryCode) {
            /*  $ionicModal.fromTemplateUrl('templates/tab-StateList.html', {
                  scope: $scope,
                  animation: 'slide-in-up',
                  focusFirstInput: false
              }).then(function(modal) {
                  $scope.modal = modal;
                  $scope.modal.show();
              });*/
            $rootScope.CountryCode = CountryCode;
        };
        $scope.stateList = '';




        $scope.StateSelect = function ($a) {
            if ($a.length >= 3) {

                $timeout(function () {
                    var params = {
                        SearchKeys: $a,
                        CountryCode: $rootScope.CountryCode
                    };

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

                    googlePlacesResponsePromise.success(function (data, status, headers, config) {
                        $rootScope.stateList = JSON.stringify(data);
                    });

                    googlePlacesResponsePromise.error(function (data, status, headers, config) {

                    });

                }, 1000);


            } else {
                $rootScope.stateList = {};
            }
        };

        $scope.closeStateList = function () {
            $rootScope.stateList;
            $rootScope.stateList;
            $scope.modal.hide();
        };
        //End State


        $scope.CountryChange = function () {
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
            $timeout(function () {
                $('select option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);

        }
        /* country and State */

        $("#addHealthPlan").click(function () {
            $scope.isSelectDrop = true;
        });

        $("#Provider").click(function () {
            $scope.isSelectDrop = true;
        });

        $("#editprovider").click(function () {
            $scope.isSelectDrop = true;
        });
        /* $(document).click(function() {
            if($scope.isSelectDrop) {
                setTimeout(function() {
                    $("#localize-widget").show();
                  }, 0);
            }
        });*/

        $("#addHealthPlan").change(function () {
            setTimeout(function () {
                $("#localize-widget").show();
            }, 0);
            $rootScope.getHlthSctValue = $('option:selected', this).text();
            if ($('option:selected', this).text() === 'Add a new health plan') {
                $rootScope.currentplan = "";
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.currentplan = "tab.planDetails";
                $scope.doGetHealthPlanProvider($rootScope.currentplan);
            } else if ($('option:selected', this).text() === 'Agregar un nuevo plan de salud') {
                $rootScope.currentplan = "";
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.currentplan = "tab.planDetails";
                $scope.doGetHealthPlanProvider($rootScope.currentplan);
            }
            else if ($('option:selected', this).text() === 'Choose Your Health Plan') {
                $rootScope.editplan = "none";
                $("div.viewport").html('<div class="insCHooseProviderName">Choose Your Health Plan</div>');
            } else if ($('option:selected', this).text() === 'Elija su plan de salud') {
                $rootScope.editplan = "none";
                $("div.viewport").html('<div class="insCHooseProviderName">Elija su plan de salud</div>');
            }
            else {
                //  $('div.viewport').text($("option:selected", this).text());
                var selectedValue = $('option:selected', this).val().split('@');
                $("div.viewport").html('<div class="insProviderName localizejs">' + selectedValue[0] + '</div><div class="insSubscriberName localizejs">Subscriber ID:' + selectedValue[1] + '</div>');
                $rootScope.editplan = "block";
            }
            $("#localize-widget").show();
        });
        $rootScope.planchange = function () {
            var insplan = $('#addHealthPlan').val();
            if (insplan != undefined) {
                if (insplan != 'Choose Your Health Plan' && insplan != 'Elija su plan de salud' && insplan.indexOf("undefined") == -1) {
                    $rootScope.editplan = "block";
                } else {
                    $rootScope.editplan = "none";
                }
            }

        }
        $scope.editinsurance = function () {
            var ponum = $("#addHealthPlan").val();
            var num = ponum.split("@");
            $rootScope.policynumber = num[1];

            // $rootScope.submitPayBack = $rootScope.currState.$current.name;
            $scope.doGetInsuranceDetails();
        }

        $scope.doGetInsuranceDetails = function () {
            $rootScope.insuranceList = [];
            var params = {
                //  patientId: $rootScope.patientId,
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                policyNumber: $scope.policynumber,
                success: function (data, status) {
                    if (data != '') {
                        $rootScope.insuranceList = data;
                        $rootScope.editinsDOB = new Date($rootScope.insuranceList.subscriberDob);
                        //   var date = new Date($rootScope.insuranceList.subscriberDob);
                        //  $rootScope.editinsDOB = $filter('date')(date, "dd-mm-yyyy");
                        $rootScope.edithealthplanid = $rootScope.insuranceList.healthPlanId;
                        $rootScope.currentplan = "tab.planeditDetails";
                        $scope.doGetHealthPlanProvider($rootScope.currentplan);
                    }
                },
                error: function (data, status) {
                    //alert("fail");
                }

            };
            LoginService.getInsuranceDetails(params);

        }
        // $scope.editinsuranceDOB=function(){
        //   var chngedob=$('#date').val();
        //   var patdob =new Date(chngedob);
        //   // $rootScope.restage =getAge(patdob);
        // }

        $scope.doGetHealthPlanProvider = function (currentplan) {
            $rootScope.HealthPlanProvidersList = [];
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $scope.HealthPlanProvidersList = data.data;

                    if (data !== "")
                        $rootScope.ProviderList = [];
                    angular.forEach($scope.HealthPlanProvidersList, function (index) {
                        $rootScope.ProviderList.push({
                            'id': index.id,
                            'payerId': index.payerId,
                            'payerName': index.payerName,

                        });
                    });
                    // $state.go('tab.planDetails');
                    /* if(typeof(currentplan) === 'undefined') {
                       currentplan = "tab.planDetails";
                     }*/
                    //   	var currentplandet = $rootScope.currentplan;
                    if (currentplan === "tab.planDetails" || typeof currentplan === 'undefined' || currentplan == '') {
                        $state.go('tab.planDetails');
                    } else if (currentplan === "tab.planeditDetails") {
                        $state.go('tab.planeditDetails');

                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHealthPlanProvidersList(params);
        }

        //$scope.AddHealth = {};
        $scope.AddHealth = [];
        $scope.doPostNewHealthPlan = function () {

            var HealthPlanProviders = $scope.AddHealth.Provider.split("@");
            $scope.insuranceCompany = HealthPlanProviders[0];
            $scope.insuranceCompanyNameId = HealthPlanProviders[1];
            $scope.payerId = HealthPlanProviders[2];
            $scope.ProviderId = HealthPlanProviders[3];
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
            //  $scope.memberName = $scope.AddHealth.firstName + ' '+ $scope.AddHealth.lastName;
            $scope.memberName = $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName;
            $scope.subsciberId = subsciberNewID // patient id
            $scope.policyNumber = $scope.AddHealth.policyNumber; //P20
            $scope.subscriberFirstName = $scope.AddHealth.firstName;
            $scope.subscriberLastName = $scope.AddHealth.lastName;
            $scope.subscriberDob = $scope.AddHealth.dateBirth;
            $scope.isActive = 'A';
            $scope.payerId = $scope.payerId;
            $scope.Members = [];
            $scope.Members.push({
                "memberName": $scope.memberName,
                "patientId": $rootScope.patientId,
                "profileImagePath": $rootScope.PatientImageSelectUser,
                "subscriberId": $scope.subsciberId,
            });

            var params = {
                accessToken: $rootScope.accessToken,
                //  healthPlanID: $rootScope.healthPlanID,
                PatientId: $rootScope.primaryPatientId,
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
                Members: $scope.Members,
                success: function (data) {
                    $scope.NewHealthPlan = data;
                    if ($scope.NewHealthPlan.healthPlanID !== '') {
                        $rootScope.healthPlanID = data.healthPlanID;
                        $scope.doGetPatientHealthPlansList();
                    } else {
                        $scope.ErrorMessage = data.message;
                        $rootScope.Validation($scope.ErrorMessage);
                        $scope.addinsplan = true;
                        $scope.editinsplan = true;
                        $state.go('tab.planDetails');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.postNewHealthPlan(params);
        }
        $scope.EditHealth = {};
        $scope.doEditHealthPlan = function () {

            var HealthPlanProviders = $('#editprovider').val().split("@");
            $scope.insuranceCompany = HealthPlanProviders[0];
            $scope.insuranceCompanyNameId = HealthPlanProviders[1];
            $scope.payerId = HealthPlanProviders[2];
            $scope.ProviderId = HealthPlanProviders[3];
            //End
            $rootScope.providerName = HealthPlanProviders[0];
            $rootScope.PolicyNo = $('#editpolicyNumber').val();
            $rootScope.edihealthPlanID = $rootScope.edithealthplanid;
            if (typeof $rootScope.patientHealthPlanList !== 'undefined') {

                var subsciberNewID = $rootScope.patientHealthPlanList.length + 1;
            } else {
                var subsciberNewID = 1;
            }

            $scope.insuranceCompany = $scope.insuranceCompany;
            $scope.insuranceCompanyNameId = $scope.insuranceCompanyNameId;
            $scope.isDefaultPlan = 'Y';
            $scope.insuranceCompanyPhone = '8888888888';
            //  $scope.memberName = $("#editfirstName").val() +' '+ $("#editlastName").val();
            $scope.memberName = $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName;
            $scope.subsciberId = subsciberNewID // patient id
            $scope.policyNumber = $("#editpolicyNumber").val(); //P20
            $scope.subscriberFirstName = $("#editfirstName").val();
            $scope.subscriberLastName = $("#editlastName").val();
            $scope.subscriberDob = $("#editdate").val();
            $scope.isActive = 'A';
            $scope.payerId = $scope.payerId;

            $scope.Members = [];
            $scope.Members.push({
                "memberName": $scope.memberName,
                "patientId": $rootScope.patientId,
                "profileImagePath": $rootScope.PatientImageSelectUser,
                "subscriberId": $scope.subsciberId,
            });

            var params = {
                accessToken: $rootScope.accessToken,
                healthPlanID: $rootScope.edihealthPlanID,
                PatientId: $rootScope.primaryPatientId,
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
                Members: $scope.Members,
                success: function (data) {
                    $scope.NewHealtheditPlan = data;
                    if ($scope.NewHealtheditPlan.healthPlanID !== '') {
                        $rootScope.healthPlanID = data.healthPlanID;
                        $scope.doGetPatientHealthPlansList();
                        $rootScope.planchange();
                    } else {
                        $scope.ErrorMessage = data.message;
                        $rootScope.Validation($scope.ErrorMessage);
                        $scope.addinsplan = true;
                        $scope.editinsplan = true;
                        $state.go('tab.planeditDetails');
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);

                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.putEditHealthPlan(params);
        }

        $scope.goCardDetailsPage = function () {
            $rootScope.cardPage = "consultCharge";
            $state.go('tab.cardDetails');
        }
        $scope.goCardDetailsPageFromAddCard = function () {
            $rootScope.cardPage = "addCard";
            $state.go('tab.cardDetails');
        }
        $scope.cardchange = function (pageName) {

            setTimeout(function () {
                $("#localize-widget").show();
            }, 0);

            if (pageName === 'consulCharge') {
                var insplan = $('#addNewCard').val();
            } else if (pageName === 'addNewCard') {
                var insplan = $('#addNewCard_addCard').val();
            } else if (pageName === 'submitPay') {
                var insplan = $('#addNewCard_submitPay').val();
            }

            /* if( insplan !== 'Choose Your Card'){
                 $rootScope.editCardStyle ="block";
              } else{
                $rootScope.editCardStyle ="none";
              }*/
            $("#localize-widget").show();
        }

        $("#addNewCard").change(function () {
            if ($('option:selected', this).text() === 'Add a new card' || $('option:selected', this).text() === 'Agregar una tarjeta nueva') {
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.cardPage = "consultCharge";
                $state.go('tab.cardDetails');
                if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined' && $rootScope.userDefaultPaymentProfileText != 'undefined') {
                    $rootScope.editCardStyle = "block";
                } else {
                    $rootScope.editCardStyle = "none";
                }
            } else {
                if ($('option:selected', this).text() === 'Choose Your Card' || payValue === 'Elija su Tarjeta') {
                    $rootScope.iscancel = false;
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                } else {
                    $rootScope.iscancel = true;
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        $("div.cardViewport").empty();
                        if (payValue[3] != "logoNone") {
                            $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo" src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        } else {
                            $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet"><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        }
                    }
                    // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
                }
                //$('div.cardViewport').text($("option:selected", this).text());
            }
            if ($('option:selected', this).text() === 'Agregar una tarjeta nueva' || $('option:selected', this).text() === 'Add a new card') {
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.cardPage = "consultCharge";
                $state.go('tab.cardDetails');
                if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined' && $rootScope.userDefaultPaymentProfileText != 'undefined') {
                    $rootScope.editCardStyle = "block";
                } else {
                    $rootScope.editCardStyle = "none";
                }
            } else {
                if ($('option:selected', this).text() === 'Elija su Tarjeta') {
                    $rootScope.editCardStyle = "none";
                    //  $rootScope.editplan ="none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Elija su Tarjeta</div>');
                } else if ($('option:selected', this).text() === 'Choose Your Card') {
                    // $rootScope.iscancel = false;
                    //    $rootScope.editplan ="none";
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                } else {
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        //$("div.cardViewport").empty();
                        if (payValue[3] != "logoNone") {
                            $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo" src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        } else {
                            $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet"><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        }
                    }
                    // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
                }
                //$('div.cardViewport').text($("option:selected", this).text());
            }
        });

        $("#addNewCard_addCard").change(function () {
            if ($('option:selected', this).text() === 'Add a new card' || $('option:selected', this).text() === 'Agrega una nueva tarjeta') {
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.cardPage = "addCard";
                $state.go('tab.cardDetails');
                if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined' && $rootScope.userDefaultPaymentProfileText != 'undefined') {
                    $rootScope.editCardStyle = "block";
                } else {
                    $rootScope.editCardStyle = "none";
                }
            } else {
                //$('div.cardViewport').text($("option:selected", this).text());
                if ($('option:selected', this).text() === 'Choose Your Card' || $('option:selected', this).text() != 'Elija su Tarjeta') {
                    $rootScope.iscancel = false;
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                } else {
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        $("div.cardViewport").empty();
                        if (payValue[3] != "logoNone") {
                            $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo"  src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        } else {
                            //$("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg class="icon-creditcard"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="symbol-defs.svg#icon-creditcard"></use></svg></i></div><div class="insCardNumber">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div>');
                            $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet" ><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        }

                    }



                    // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
                }
            }
            if ($('option:selected', this).text() === 'Agregar una tarjeta nueva' || $('option:selected', this).text() === 'Add a new card') {
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                $rootScope.cardPage = "addCard";
                $state.go('tab.cardDetails');
                if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined' && $rootScope.userDefaultPaymentProfileText != 'undefined') {
                    $rootScope.editCardStyle = "block";
                } else {
                    $rootScope.editCardStyle = "none";
                }
            } else {
                //$('div.cardViewport').text($("option:selected", this).text());
                if ($('option:selected', this).text() === 'Elija su Tarjeta' || $('option:selected', this).text() === 'Choose your Card') {
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                } else {
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        $("div.cardViewport").empty();
                        if (payValue[3] != "logoNone") {
                            $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo"  src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        } else {
                            //$("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg class="icon-creditcard"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="symbol-defs.svg#icon-creditcard"></use></svg></i></div><div class="insCardNumber">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div>');
                            $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet" ><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        }
                    }

                    // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
                }
            }
        });

        $("#addNewCard_submitPay").change(function () {
            if ($('option:selected', this).text() === 'Add a new card' || $('option:selected', this).text() === 'Agrega una nueva tarjeta') {
                //  $rootScope.userCardDetails = $('option:selected', this).text();
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                // $rootScope.userCardNumber = 'Choose Your Card';
                //$rootScope.cardPage = "submitPayment";
                $rootScope.editCardStyle = "block";
                $state.go('tab.cardDetails');
            } else {

                if ($('option:selected', this).text() === 'Choose Your Card' || $('option:selected', this).text() != 'Elija su Tarjeta') {
                    $rootScope.iscancel = false;
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                }
                else {
                    //  $('div.cardViewport').text($("option:selected", this).text());
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        $("div.cardViewport").empty();
                        if (payValue[3] != "logoNone") {
                            $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo"  src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        } else {
                            //$("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg class="icon-creditcard"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="symbol-defs.svg#icon-creditcard"></use></svg></i></div><div class="insCardNumber">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div>');
                            $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet" ><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                        }
                    }
                    //  $rootScope.userCardNumber = $('option:selected', this).text();
                    $rootScope.userCardNumber = payValue[2];
                    $rootScope.userCardDetails = payValue[0];
                    $rootScope.userCardType = payValue[3];
                }
                //  $('div.cardViewport').text($("option:selected", this).text());
                // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
            }
            if ($('option:selected', this).text() === 'Agregar una tarjeta nueva' || $('option:selected', this).text() === 'Add a new card') {
                //  $rootScope.userCardDetails = $('option:selected', this).text();
                $rootScope.submitPayBack = $rootScope.currState.$current.name;
                // $rootScope.userCardNumber = 'Choose Your Card';
                //$rootScope.cardPage = "submitPayment";
                $rootScope.editCardStyle = "block";
                $state.go('tab.cardDetails');
            } else {

                if ($('option:selected', this).text() === 'Elija su Tarjeta' || $('option:selected', this).text() === 'Choose your Card') {
                    $rootScope.editCardStyle = "none";
                    $("div.cardViewport").empty();
                    $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                }
                else {
                    //  $('div.cardViewport').text($("option:selected", this).text());
                    $rootScope.editCardStyle = "block";
                    var payValue = ($('option:selected', this).val()).split("@");
                    if (payValue == 'Choose Your Card' || payValue == 'Elija su Tarjeta') {
                        $rootScope.editCardStyle = "none";
                    } else {
                        if (payValue != undefined) {



                            $("div.cardViewport").empty();
                            if (payValue[3] != "logoNone") {
                                $("div.cardViewport").html('<div class="insCardName"><img class="cardlogo"  src = "' + payValue[3] + '" /></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                            } else {
                                //$("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg class="icon-creditcard"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="symbol-defs.svg#icon-creditcard"></use></svg></i></div><div class="insCardNumber">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div>');
                                $("div.cardViewport").html('<div class="insCardName"> <i class="iconfontSVG"><svg version="1.1" id="Credit_card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 3 150 55" enable-background="new 0 3 150 55" width="10cm" height="10cm" preserveAspectRatio="xMinYMin meet" ><path d="M18,3H2C0.899,3,0,3.9,0,5v10c0,1.1,0.899,2,2,2h16c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,15H2V9h16V15z M18,6H2V5h16    V6z M4,11.1v0.6h0.6v-0.6H4z M7.6,12.299V12.9h1.2v-0.601h0.6v-0.6H10v-0.6H8.8v0.6H8.199v0.6H7.6z M10,12.9v-0.601H9.399V12.9H10z     M7,12.9v-0.601H5.8V12.9H7z M7.6,11.699h0.6v-0.6H7v1.199h0.6V11.699z M5.199,12.299H5.8v-0.6h0.6v-0.6h-1.2v0.6H4.6v0.6H4V12.9    h1.199V12.299z"></path></svg></i></div><div class="insCardNumber">' + 'XXXX-XXXX-XXXX-' + payValue[2] + '</div>');
                            }
                        }
                    }

                    //  $rootScope.userCardNumber = $('option:selected', this).text();
                    $rootScope.userCardNumber = payValue[2];
                    $rootScope.userCardDetails = payValue[0];
                    $rootScope.userCardType = payValue[3];
                }
                //  $('div.cardViewport').text($("option:selected", this).text());
                // $("div.cardViewport").html('<div class="parenttt" style=" display: table;padding: 4px;  width: 100%;  margin: -10px 5px;"><div class="insCardImage"><img src = "https://emerald.snap-qa.com/images/creditcards/Visa-dark.png"  style =" width: 75px;  height: 50px;vertical-align: middle;"/> '+payValue[1]+'</div> <div class="insCardNumber" style =" vertical-align: middle;display: table-cell; text-align: justify; font-family: GloberSemiBold; font-size: 21px;padding: 12px 0px 12px 25px;">'+ 'XXXX-XXXX-XXXX-'+payValue[2]+'</div> </div>');
            }
        });

        $scope.GetConsultChargeNoPlan = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $rootScope.BackPage = P_Page;
            $rootScope.copayAmount = $rootScope.consultationAmount;
            $rootScope.healthPlanPage = "none";
            $rootScope.consultChargeNoPlanPage = "block";

        }

        $scope.showConsultChargeNoPlan = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {
            $rootScope.checkHealthSectionOn = true;
            if ($rootScope.copayAmount === 0) {
                $rootScope.enableInsuranceVerificationSuccess = "none";
                $rootScope.enablePaymentSuccess = "none";
                $rootScope.enableCreditVerification = "none";
                $rootScope.enableWaivefeeVerification = "none";
                $state.go('tab.receipt');
                $rootScope.ReceiptTimeout();
            } else if ($rootScope.appointmentwaivefee == true) {
                $rootScope.enableInsuranceVerificationSuccess = "none";
                $rootScope.enablePaymentSuccess = "none";
                if (P_Page == "skipThis") {
                    $rootScope.enableCreditVerification = "none";
                    $rootScope.enableWaivefeeVerification = "block";
                } else {
                    $rootScope.enableCreditVerification = "none";
                    $rootScope.enableWaivefeeVerification = "none";
                }
                $state.go('tab.receipt');
                $rootScope.ReceiptTimeout();
            } else if ($rootScope.isPaid === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                $rootScope.enableInsuranceVerificationSuccess = "none";
                $rootScope.enablePaymentSuccess = "none";
                if ($rootScope.appointmentwaivefee === true) {
                    $rootScope.enableCreditVerification = "none";
                    $rootScope.enableWaivefeeVerification = "block";
                } else {
                    $rootScope.enableWaivefeeVerification = "none";
                    $rootScope.enableCreditVerification = "block";
                }
                $state.go('tab.receipt');
                $rootScope.ReceiptTimeout();
            } else {
                $rootScope.PatientImageSelectUser = P_img;
                $rootScope.PatientFirstName = P_Fname;
                $rootScope.PatientLastName = P_Lname;
                $rootScope.PatientAge = P_Age;
                $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
                $rootScope.BackPage = P_Page;
                $rootScope.copayAmount = $rootScope.consultationAmount;
                $rootScope.healthPlanPage = "none";
                $rootScope.consultChargeNoPlanPage = "block";
                if ($rootScope.userDefaultPaymentProfile == null || ($('#addNewCard').val() == 'Choose Your Card') || ($('#addNewCard').val() == 'Elija su Tarjeta')) {
                    $rootScope.editCardStyle = "none";
                    $rootScope.iscancel = false;
                    var localizeCurrent = $('#localize-current').text();
                    if (localizeCurrent == "Español") {
                        $('#addNewCard').val('Elija su Tarjeta');
                        $("div.cardViewport").empty();
                        $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Elija su Tarjeta</div>');
                    } else {
                        $('#addNewCard').val('Choose Your Card');
                        $("div.cardViewport").empty();
                        $("div.cardViewport").html('<div class="insCHooseProviderName localizejs">Choose Your Card</div>');
                    }
                } else {
                    $rootScope.editCardStyle = "block";
                }
                $('option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }
        }

        $scope.backAddHealthPlan = function () {
            if ($rootScope.healthPlanPage === "block") {
                $state.go('tab.consultCharge');
            } else {
                $rootScope.healthPlanPage = "block";
                $rootScope.consultChargeNoPlanPage = "none";
            }

        }

        $scope.backConsultCharge = function () {
            /*  if($stateParams.getPage === 'CTT') {
                  $state.go('tab.userhome');
              } else {*/
            if ($rootScope.chooseHealthShow == 'none' || ($rootScope.providerName == '' || typeof $rootScope.providerName == 'undefined' || $rootScope.editplan == 'none')) {
                $rootScope.editplan = "none";
                var localizeCurrent = $('#localize-current').text();
                if (localizeCurrent == "Español") {
                    $("#addHealthPlan").val('Elija su plan de salud');
                    $("div.viewport").html('<div class="insCHooseProviderName">Elija su plan de salud</div>');
                } else {
                    $("#addHealthPlan").val('Choose Your Health Plan');
                    $("div.viewport").html('<div class="insCHooseProviderName">Choose Your Health Plan</div>');
                }

            } else {
                $rootScope.editplan = "block";
            }
            if (($rootScope.insuranceMode !== 'on' && $rootScope.paymentMode === 'on' && $rootScope.Cttonscheduled === 'on') || ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on' && $rootScope.Cttonscheduled === 'on')) {
                $state.go('tab.ConsentTreat');
            } else if (($rootScope.healthPlanPage === "block" && $rootScope.Cttonscheduled === 'on') || ($rootScope.paymentBackPage === true && $rootScope.Cttonscheduled === 'on')) {
                $state.go('tab.ConsentTreat');
            } else if ($rootScope.consultChargeNoPlanPage === "block" && $rootScope.paymentBackPage !== true) {
                $rootScope.consultChargeNoPlanPage = "none";
                $rootScope.healthPlanPage = "block";
            } else if ($rootScope.Cttonscheduled !== 'on') {
                if ($rootScope.concentToTreatPreviousPage === "tab.CurrentMedication") {
                    $state.go('tab.ConsentTreat');
                } else {
                    $state.go($rootScope.concentToTreatPreviousPage);
                }
            } else {
                //  $rootScope.doGetScheduledNowPhoneConsulatation();
                //  $rootScope.doGetIndividualScheduledConsulatation();
                $state.go('tab.userhome');
            }
            //  }
        }

        $scope.goToNextPage = function () {
            $state.go($rootScope.BackPage);
        }

        $scope.goToPreviosPage = function () {
            if ($rootScope.checkHealthSectionOn) {
                $rootScope.consultChargeNoPlanPage = "none";
                $rootScope.healthPlanPage = "block";
                $state.go('tab.' + $rootScope.cardPage);
            } else {
                if (($rootScope.insuranceMode !== 'on' && $rootScope.paymentMode === 'on' && $rootScope.Cttonscheduled === 'on') || ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on' && $rootScope.Cttonscheduled === 'on')) {
                    $state.go('tab.ConsentTreat');
                } else if (($rootScope.healthPlanPage === "block" && $rootScope.Cttonscheduled === 'on') || ($rootScope.paymentBackPage === true && $rootScope.Cttonscheduled === 'on')) {
                    $state.go('tab.ConsentTreat');
                } else if ($rootScope.Cttonscheduled !== 'on') {
                    if ($rootScope.concentToTreatPreviousPage === "tab.CurrentMedication") {
                        $state.go('tab.ConsentTreat');
                    } else {
                        $state.go($rootScope.concentToTreatPreviousPage);
                    }
                } else {
                    $state.go('tab.userhome');
                }
            }
        }


        //Come to this issues : value="? undefined:undefined ?". Use this following Function //
        $timeout(function () {
            $('select option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
        //value="? undefined:undefined ?"//

        $scope.Health = {};
        $scope.doPostApplyHealthPlan = function () {
            $scope.Choose = 'false';
            if ($rootScope.currState.$current.name === "tab.applyPlan") {
                if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                    $rootScope.NewHealth = $scope.Health.addHealthPlan;
                    $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                    var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                    $rootScope.providerName = healthInsurance[0];
                    $rootScope.PolicyNo = healthInsurance[1];
                    $rootScope.healthPlanID = healthInsurance[2];
                } else if (typeof $scope.Health.addHealthPlan === 'undefined') {

                    $rootScope.providerName = $rootScope.providerName;
                    $rootScope.PolicyNo = $rootScope.PolicyNo;
                    $rootScope.healthPlanID = $rootScope.healthPlanID;
                }
            }


            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                    if ($scope.Health.addHealthPlan !== 'Choose Your Health Plan' && $scope.Health.addHealthPlan !== 'Elija su plan de salud') {

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
                }
                if (typeof $scope.Health.addHealthPlan === 'undefined' || $scope.Health.addHealthPlan === 'Choose Your Health Plan' || $scope.Health.addHealthPlan === 'Elija su plan de salud') {
                    if ((typeof $rootScope.NewHealth === 'undefined' || $rootScope.NewHealth === "") && $rootScope.providerName === "") {
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
                }

            }
            if ($scope.Choose !== 'true') {
                var params = {
                    accessToken: $rootScope.accessToken,
                    insuranceCompanyName: $rootScope.providerName,
                    policyNumber: $rootScope.PolicyNo,
                    consultationId: $rootScope.consultationId,
                    healthPlanId: $rootScope.healthPlanID,
                    success: function (data) {
                        if (!data.message) {
                            $scope.ApplyHealthPlan = data;
                            $rootScope.copayAmount = data.copayAmount;
                            if ($rootScope.consultationAmount > $rootScope.copayAmount) {
                                $rootScope.PlanCoversAmount = $rootScope.consultationAmount - $rootScope.copayAmount;
                            } else {
                                $rootScope.PlanCoversAmount = '';
                            }
                            if ($rootScope.isPaid !== true && ($rootScope.getIndividualPatientCreditCount === 0 || $rootScope.getIndividualPatientCreditCount === '')) {
                                $rootScope.doGetPatientPaymentProfiles();
                                $rootScope.editCardStyle = "none";
                                $state.go('tab.addCard');
                            } else if ($rootScope.isPaid === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enablePaymentSuccess = "none";
                                if ($rootScope.appointmentwaivefee === true) {
                                    $rootScope.enableCreditVerification = "none";
                                    $rootScope.enableWaivefeeVerification = "block";
                                } else {
                                    $rootScope.enableWaivefeeVerification = "none";
                                    $rootScope.enableCreditVerification = "block";
                                }
                                $state.go('tab.receipt');
                                $rootScope.ReceiptTimeout();
                            }
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
                    error: function (data, status) {
                        if (status === 0) {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status === 503) {
                            $scope.callServiceUnAvailableError();
                        } else {
                            $rootScope.serverErrorMessageValidationForHealthPlanApply();
                        }
                    }
                };
            } else {
                $scope.ErrorMessages = "Choose Your Health Plan";
                $rootScope.Validation($scope.ErrorMessages);
            }
            LoginService.postApplyHealthPlan(params);
        }

        $scope.doPostVerifyHealthPlan = function () {
            $scope.Choose = 'false';
            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                if (typeof $scope.Health.addHealthPlan !== 'undefined') {
                    if ($scope.Health.addHealthPlan !== 'Choose Your Health Plan' && $scope.Health.addHealthPlan !== 'Elija su plan de salud') {
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
                }
                if (typeof $scope.Health.addHealthPlan === 'undefined' || $scope.Health.addHealthPlan === 'Choose Your Health Plan' || $scope.Health.addHealthPlan === 'Elija su plan de salud') {
                    if ((typeof $rootScope.NewHealth === 'undefined' || $rootScope.NewHealth === "") && $rootScope.providerName === "") {
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
                }

            }
            if ($scope.Choose !== 'true') {
                var params = {
                    accessToken: $rootScope.accessToken,
                    insuranceCompanyName: $rootScope.providerName,
                    policyNumber: $rootScope.PolicyNo,
                    consultationId: $rootScope.consultationId,
                    healthPlanId: $rootScope.healthPlanID,
                    success: function () {
                        $scope.doGetSkipHealthPlan();
                    },
                    error: function () {
                        $scope.doGetSkipHealthPlan();
                    }
                };
            } else {
                $scope.ErrorMessages = "Choose Your Health Plan";
                $rootScope.Validation($scope.ErrorMessages);
            }

            LoginService.postVerifyHealthPlan(params);
        }


        $scope.doGetSkipHealthPlan = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                insuranceCompanyName: $rootScope.providerName,
                policyNumber: $rootScope.PolicyNo,
                consultationId: $rootScope.consultationId,
                healthPlanId: $rootScope.healthPlanID,
                success: function () {
                    //  if($rootScope.isPaid === true) {
                    if ($rootScope.isPaid === true) {
                        $rootScope.enableInsuranceVerificationSuccess = "block";
                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none";
                        $rootScope.enableWaivefeeVerification = "none";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                    } else {
                        //  if($rootScope.paymentMode !== 'on' || $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' || $rootScope.appointmentwaivefee === true) {
                        if ($rootScope.paymentMode !== 'on' || $rootScope.appointmentwaivefee === true) {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none"
                            $rootScope.enableWaivefeeVerification = "none";;
                            $rootScope.enableInsuranceVerificationSuccess = "block";
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                            //  } else if($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on') {
                        } else if ($rootScope.paymentMode === 'on') {
                            $rootScope.doGetPatientPaymentProfiles();
                            $state.go('tab.addCard');
                        }
                    }
                },
                error: function () {
                    //    if($rootScope.paymentMode !== 'on' || $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' || $rootScope.appointmentwaivefee === true) {
                    if ($rootScope.paymentMode !== 'on' || $rootScope.appointmentwaivefee === true) {
                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none";
                        $rootScope.enableWaivefeeVerification = "none";
                        $rootScope.enableInsuranceVerificationSuccess = "block";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                    } else if ($rootScope.paymentMode === 'on') {
                        $rootScope.doGetPatientPaymentProfiles();
                        $state.go('tab.addCard');
                    }
                }
            };

            LoginService.postSkipHealthPlan(params);
        }


        $rootScope.doGetPayAddCardDetails = function () {
            $rootScope.addCardStatus = '';
            $rootScope.PayAddCardDetails = '';
            var params = {
                accessToken: $rootScope.accessToken,
                userTimeZoneId: $rootScope.userTimeZoneId,
                success: function (data, status) {
                    $rootScope.PayAddCardDetails = [];
                    $rootScope.addCardStatus = status;
                    if (data !== '') {
                        $rootScope.PayAddCardDetails = data;
                        //   $scope.doPostChargifyDetails();
                    }
                },
                error: function (data, status) {
                    $rootScope.addCardStatus = status;
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getPayCardDetails(params);
        }


        $rootScope.doGetPatientPaymentProfiles = function () {
            $rootScope.userCardType = '';
            $rootScope.doGetPayAddCardDetails();
            var params = {
                hospitalId: $rootScope.hospitalId,
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data !== '') {
                        if (data.data[0].paymentProfiles.length !== 0) {
                            $rootScope.disableSubmitpayment = "none";
                            $rootScope.patientprofileID = data.data[0].profileID;
                            $rootScope.PaymentProfile = [];
                            angular.forEach(data.data[0].paymentProfiles, function (index) {
                                var imgUrl = '';
                                var cardTypeStr = index.cardType;

                                if (typeof cardTypeStr !== 'undefined' && cardTypeStr !== '') {
                                    var cardTypeStr = cardTypeStr.toLowerCase();

                                    if (cardTypeStr.indexOf("visa") >= 0) {
                                        imgUrl = 'img/card-logo/Visa-dark.png';
                                    } else if (cardTypeStr.indexOf("master") >= 0) {
                                        imgUrl = 'img/card-logo/MasterCard-dark.png';
                                    } else if (cardTypeStr.indexOf("america") >= 0) {
                                        imgUrl = 'img/card-logo/AmericanExpress-dark.png';
                                    } else if (cardTypeStr.indexOf("discover") >= 0) {
                                        imgUrl = 'img/card-logo/Discover-dark.png';
                                    } else if (cardTypeStr.indexOf("diner") >= 0) {
                                        imgUrl = 'img/card-logo/DinersClub-dark.png';
                                    } else if (cardTypeStr.indexOf("jcb") >= 0) {
                                        imgUrl = 'img/card-logo/JCB-dark.png';
                                    } else if (cardTypeStr.indexOf("maestro") >= 0) {
                                        imgUrl = 'img/card-logo/Maestro-dark.png';
                                    } else if (cardTypeStr.indexOf("laser") >= 0) {
                                        imgUrl = 'img/card-logo/Laser-dark.png';
                                    }
                                    else {
                                        imgUrl = 'logoNone';
                                    }
                                } else {
                                    imgUrl = 'logoNone';
                                }

                                /*
                              switch(index.cardType)
                              {
                                  case "Visa":
                                      imgUrl = 'img/card-logo/Visa-dark.png';
                                      break;
                                  case "MasterCard":
                                      imgUrl = 'img/card-logo/MasterCard-dark.png';
                                      break;
                                  case "American_express":
                                      imgUrl = 'img/card-logo/AmericanExpress-dark.png';
                                      break;
                                  case "Discover":
                                      imgUrl = 'img/card-logo/Discover-dark.png';
                                      break;
                                  case "Diners_club":
                                      imgUrl = 'img/card-logo/DinersClub-dark.png';
                                      break;
                                  case "Jcb":
                                      imgUrl = 'img/card-logo/JCB-dark.png';
                                      break;
                                  case "Maestro":
                                      imgUrl = 'img/card-logo/Maestro-dark.png';
                                      break;
                                  case "Laser":
                                      imgUrl = 'img/card-logo/Laser-dark.png';
                                      break;
                                  default:
                                      imgUrl = 'logoNone';
                              }
  */
                                $rootScope.PaymentProfile.push({
                                    'id': index.$id,
                                    'billingAddress': angular.fromJson(index.billingAddress),
                                    'cardExpiration': index.cardExpiration,
                                    'cardNumber': replaceCardNumber.getCardNumber(index.cardNumber),
                                    'isBusiness': index.isBusiness,
                                    'profileID': index.profileID,
                                    'cardType': index.cardType,
                                    'cardLogo': imgUrl,
                                });

                            });


                            if ((typeof $rootScope.paymentProfileId != 'undefined' && typeof $rootScope.paymentProfileId != '' && $window.localStorage.getItem("Card" + $rootScope.UserEmail) != null && $window.localStorage.getItem("Card" + $rootScope.UserEmail) != '') && ($rootScope.paymentProfileId == $window.localStorage.getItem("Card" + $rootScope.UserEmail))) {
                                $scope.userCrdType = $filter('filter')($rootScope.PaymentProfile, {
                                    profileID: $rootScope.paymentProfileId
                                });
                                if ($scope.userCrdType != '' && $scope.userCrdType.length != 0) {
                                    var userCardType = $scope.userCrdType[0].cardLogo;
                                    var crdNum = $scope.userCrdType[0].cardNumber.split('XXXX');
                                    $window.localStorage.setItem("Card" + $rootScope.UserEmail, $rootScope.paymentProfileId);
                                    $window.localStorage.setItem("CardText" + $rootScope.UserEmail, crdNum);
                                    $window.localStorage.setItem("CardLogo" + $rootScope.UserEmail, userCardType);
                                    $window.localStorage.setItem("hosNameforCard", $rootScope.hospitalName);
                                    if ($rootScope.userDefaultPaymentProfile == null) {
                                        $rootScope.editCardStyle = "none";
                                    } else {
                                        $rootScope.editCardStyle = "block";
                                    }
                                } else {
                                    $('#addNewCard').val('Choose Your Card');
                                    $('#addNewCard_addCard').val('Choose Your Card');
                                    $('#addNewCard_submitPay').val('Choose Your Card');
                                    $rootScope.userDefaultPaymentProfileText = null;

                                    $rootScope.editCardStyle = "none";
                                }

                            }

                            if (typeof $rootScope.userCardDetails !== 'undefined' && $rootScope.userCardDetails !== '') {
                                $scope.userCrdType = $filter('filter')($rootScope.PaymentProfile, {
                                    profileID: $rootScope.userCardDetails
                                });
                                if ($scope.userCrdType.length != 0) {
                                    $rootScope.userCardType = $scope.userCrdType[0].cardLogo;
                                    $rootScope.editCardStyle = "block";
                                }
                            } else if (typeof $rootScope.chkProfileIdForCrdType !== 'undefined' && $rootScope.chkProfileIdForCrdType !== '') {
                                $scope.userCrdType = $filter('filter')($rootScope.PaymentProfile, {
                                    profileID: $rootScope.chkProfileIdForCrdType
                                });
                                //  alert($scope.userCrdType);
                                //  console.log($scope.userCrdType);
                                $rootScope.userCardType = $scope.userCrdType[0].cardLogo;
                                $scope.crdNum = $scope.userCrdType[0].cardNumber.split('XXXX');
                                // $rootScope.userCardNumber = $scope.crdNum[1];
                                $rootScope.userCardNumber = $scope.crdNum;
                                $rootScope.editCardStyle = "block";
                            }

                            $rootScope.totalPaymentCard = $rootScope.PaymentProfile.length;
                            $rootScope.enableSubmitpayment = "block";
                            $rootScope.disableSubmitpayment = "none";
                            $rootScope.enablePaymentSuccess = "block";
                            $rootScope.enableCreditVerification = "none";
                            $rootScope.enableWaivefeeVerification = "none";
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
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getPatientPaymentProfile(params);
        }

        $rootScope.doGetChargifyPayUpdateCardDetails = function (profileID) {
            $rootScope.chargifyUpdateCardStatus = '';
            $rootScope.chargifyPayUpdateCardDetails = '';
            var params = {
                accessToken: $rootScope.accessToken,
                profileID: profileID,
                userTimeZoneId: $rootScope.userTimeZoneId,
                success: function (data, status) {
                    $rootScope.chargifyPayUpdateCardDetails = [];
                    $rootScope.chargifyUpdateCardStatus = status;
                    if (data !== '') {
                        $rootScope.chargifyPayUpdateCardDetails = data;
                        //   $scope.doPostChargifyDetails();
                    }
                },
                error: function (data, status) {
                    $rootScope.chargifyUpdateCardStatus = status;
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getPayUpdateCardDetails(params);
        }

        $scope.editCardDetails = {};
        $scope.editpaymentcard = function (pageName) {
            //  var proid = $("#addNewCard").val();
            $state.go('tab.cardeditDetails');
            $rootScope.isEditAvailable = true;

            if (typeof $scope.cardPaymentId.addNewCard !== 'undefined') {
                if (pageName === 'consulCharge') {
                    $rootScope.cardPage = "consultCharge";
                    var insplanCrdVal = $('#addNewCard').val();
                    if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined') {
                        $rootScope.editCardStyle = "block";
                    } else {
                        $rootScope.editCardStyle = "none";
                    }

                } else if (pageName === 'addNewCard') {
                    $rootScope.cardPage = "addCard";
                    var insplanCrdVal = $('#addNewCard_addCard').val();
                    if ($rootScope.userDefaultPaymentProfileText != null && typeof $rootScope.userDefaultPaymentProfileText != 'undefined') {
                        $rootScope.editCardStyle = "block";
                    } else {
                        $rootScope.editCardStyle = "none";
                    }
                } else if (pageName === 'submitPay') {
                    var insplanCrdVal = $('#addNewCard_submitPay').val();
                }
                if (typeof insplanCrdVal !== 'undefined') {
                    var payValue = insplanCrdVal.split("@");
                    $rootScope.profileid = payValue[0];
                } else if (typeof insplanCrdVal === 'undefined') {
                    if (typeof $rootScope.userCardDetails === 'undefined') {
                        $rootScope.profileid = $rootScope.userDefaultPaymentProfile;
                    } else {
                        $rootScope.profileid = $rootScope.userCardDetails;
                    }
                }
            } else if (typeof $scope.cardPaymentId.addNewCard === 'undefined') {
                if (typeof $rootScope.userCardDetails === 'undefined') {
                    $rootScope.profileid = $rootScope.userDefaultPaymentProfile;
                } else {
                    $rootScope.profileid = $rootScope.userCardDetails;
                }
            }

            /*
                    if($rootScope.userDefaultPaymentProfileText == null)
                    {
                        $rootScope.editCardStyle ="none";
                    }else{
                        $rootScope.editCardStyle ="block";
                    }*/
            //$rootScope.profileid = proid;
            $rootScope.editPaymentProfile = [];
            angular.forEach($rootScope.PaymentProfile, function (index) {
                if (index.profileID == $rootScope.profileid) {
                    $rootScope.editPaymentProfile.push({
                        'id': index.$id,
                        'billingAddress': angular.fromJson(index.billingAddress),
                        'cardExpiration': index.cardExpiration,
                        'cardNumber': replaceCardNumber.getCardNumber(index.cardNumber),
                        'isBusiness': index.isBusiness,
                        'profileID': index.profileID,
                        'cardType': index.cardType,
                        'cardLogo': index.cardLogo,
                    });
                }
            });
            $rootScope.doGetChargifyPayUpdateCardDetails($rootScope.editPaymentProfile[0].profileID);

            var cardExpiration = $rootScope.editPaymentProfile[0].cardExpiration;
            $rootScope.cardExpirationSplitValue = cardExpiration.split('/');
            $rootScope.editbilling = $rootScope.editPaymentProfile[0].billingAddress;
            $rootScope.editcardNumber = $rootScope.editPaymentProfile[0].cardNumber;

            /* $scope.editCardDetails.cardEditCity = $rootScope.editbilling.city;
                $scope.editCardDetails.cardEditState = $rootScope.editbilling.state;
                $scope.editCardDetails.cardEditCountry = $rootScope.editbilling.country;
                $scope.editCardDetails.cardEditZip = $rootScope.editbilling.zip;
                $("#editCity").val($scope.editCardDetails.cardEditCity);
                $("#editState").val($scope.editCardDetails.cardEditState);
                $("#editCountry").val($scope.editCardDetails.cardEditCountry);
                $("#editZip").val($scope.editCardDetails.cardEditZip);*/
        }

        if ($rootScope.currState.$current.name == 'tab.cardeditDetails') {
            $scope.editCardDetails.cardEditCity = $rootScope.editbilling.city;
            $scope.editCardDetails.cardEditState = $rootScope.editbilling.state;
            $scope.editCardDetails.cardEditCountry = $rootScope.editbilling.country;
            $scope.editCardDetails.cardEditZip = $rootScope.editbilling.zip;
        }

        $scope.doPostClearHealthPlan = function () {
            var params = {
                healthPlanID: $rootScope.healthPlanID,
                InsuranceCompanyName: $rootScope.providerName,
                PolicyNumber: $rootScope.PolicyNo,
                ConsultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $state.go('tab.userhome');
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.postClearHealthPlan(params);
        }

        $scope.cancelConsultation = function () {
            navigator.notification.confirm(
                /*'Are you sure that you want to cancel this consultation?',*/
                alertCancelMessageConsultation,
                function (index) {
                    if (index === 1) {

                    } else if (index === 2) {
                        $state.go('tab.userhome');
                    }
                },

                $rootScope.alertMsgName, ['No', YESMessageProviderSearch]
            );
        }
        $scope.cancelConsultationForHealthPlan = function () {
            navigator.notification.confirm(
                /*  'Are you sure that you want to cancel this consultation?',*/
                alertCancelMessageConsultation,
                function (index) {
                    if (index === 1) {

                    } else if (index === 2) {
                        if ($rootScope.healthPlanID !== '' && typeof $rootScope.healthPlanID !== 'undefined') {
                            $scope.doPostClearHealthPlan();
                        } else {
                            $state.go('tab.userhome');
                        }
                    }
                },

                $rootScope.alertMsgName, ['No', YESMessageProviderSearch]
            );
        }

        $scope.doGetReceipt = function () {
            $rootScope.enablePaymentSuccess = "none";
            $rootScope.enableCreditVerification = "none";
            $rootScope.enableWaivefeeVerification = "none";
            $rootScope.enableInsuranceVerificationSuccess = "none";
            $state.go('tab.receipt');
            $rootScope.ReceiptTimeout();
        }

        //$("#Cvv").keyup(function() {
        //  $("#Cvv").val(this.value.match(/[0-9]*/));
        //});

        $rootScope.verifyCardDisplay = "none";
        $rootScope.cardDisplay = "inherit;";
        $rootScope.planverify = "inherit";
        $scope.getCardDetails = {};
        //$scope.editCardDetails = {};
        $scope.ccCvvLength = 3;
        $rootScope.editCvvLength = 3;
        $rootScope.editsecuritycode = $('#editcvv').val();
        $scope.$watch('getCardDetails.CardNumber', function (cardNumber) {
            var ccn1 = String(cardNumber).substr(0, 1);
            if (typeof cardNumber !== "undefined") {
                if (ccn1 === 3) {
                    $scope.ccCvvLength = 4;
                } else {
                    $scope.ccCvvLength = 3;
                }
            }
        });
        $scope.$watch('editsecuritycode', function (cardNumber) {
            var ccn1 = String(cardNumber).substr(0, 1);
            if (typeof cardNumber !== "undefined") {
                if (ccn1 === 3) {
                    $rootScope.editCvvLength = 4;
                } else {
                    $rootScope.editCvvLength = 3;
                }
            }
        });

        $scope.doEditPaymentProfileDetails = function () {

            $rootScope.iscancel = false;
            var editzipCount = $('#editZip').val().length;
            var currentTime = new Date()
            var EditexpiryDateCheck = new Date();
            //  EditexpiryDateCheck.setFullYear($scope.getCardDetails.CardExpireDatesYear, $scope.getCardDetails.CardExpireDatesMonth, 1);
            //  ExpiryDateCheck.setFullYear($scope.getCardDetails.CardExpireDatesYear, $scope.getCardDetails.CardExpireDatesMonth, 1);

            $rootScope.editFirstName = $("#editFirstName").val();
            $rootScope.editLastName = $("#editLastName").val();
            $rootScope.editCardNumber = $("#editCardNumber").val();
            $rootScope.editCvv = $("#editcvv").val();
            $rootScope.editBillingAddress = $("#editbillingAddress").val();
            $rootScope.editCity = $("#editCity").val();
            $rootScope.editState = $("#editState").val();
            $rootScope.editZip = $("#editZip").val();
            $rootScope.editExpiryMonth = $("#editExpmonth").val();
            $rootScope.editExpiryYear = $("#editExpyear").val();
            $scope.editCountry = $("#editCountry").val();
            EditexpiryDateCheck.setFullYear($rootScope.editExpiryYear, $rootScope.editExpiryMonth, 1);


            if ($('#editFirstName').val() === '') {
                $scope.ErrorMessage = "First Name can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editlaststName').val() === '') {
                $scope.ErrorMessage = "Last Name can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editCardNumber').val() === '') {
                $scope.ErrorMessage = "Card number can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editExpmonth').val() === '') {
                $scope.ErrorMessage = "Expiry Month can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editExpyear').val() === '') {
                $scope.ErrorMessage = "Expiry can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editcvv').val() === '') {
                $scope.ErrorMessage = "security code can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editbillingAddress').val() === '') {
                $scope.ErrorMessage = "BillingAddress can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editCity').val() === '') {
                $scope.ErrorMessage = "City can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editState').val() === '') {
                $scope.ErrorMessage = "State can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editCountry').val() === '') {
                $scope.ErrorMessage = "Country can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if ($('#editZip').val() == '' && ($('#editCountry').val() == 'US' || $('#editCountry').val() == 'United States')) {
                $scope.ErrorMessage = "Zip can't be empty";
                $rootScope.Validation($scope.ErrorMessage);

            } else if (!CreditCardValidations.validCreditCard($rootScope.editCardNumber)) {
                $scope.invalidZip = "";
                $scope.invalidMonth = "";
                $scope.invalidCVV = "";
                $scope.invalidCard = "border: 1px solid red;max-width:50%;";
                $scope.ErrorMessage = "Invalid Card Number";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (EditexpiryDateCheck < currentTime) {
                $scope.invalidMonth = "border: 1px solid red;";
                $scope.ErrorMessage = "Invalid Expiry Month";

                $rootScope.Validation($scope.ErrorMessage);
            } else if (editzipCount <= 4 && ($scope.editCountry == 'US' || $('#editCountry').val() == 'United States')) {
                $scope.invalidMonth = "";
                $scope.invalidCard = "";
                $scope.invalidCVV = "";
                $scope.invalidZip = "border: 1px solid red;";
                $scope.ErrorMessage = "Verify Zip";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.editCvv.length !== $rootScope.editCvvLength) {
                $scope.invalidZip = "";
                $scope.invalidMonth = "";
                $scope.invalidCard = "";
                $scope.invalidCVV = "border: 1px solid red;";
                $scope.ErrorMessage = "Security code must be " + $rootScope.editCvvLength + " numbers";
                $rootScope.Validation($scope.ErrorMessage);
            } else {

                $rootScope.cardDisplay = "none;";
                $rootScope.verifyCardDisplay = "inherit";
                $rootScope.planverify = "0.3";
                if ($rootScope.chargifyUpdateCardStatus === 200) {
                    var params = {
                        uri: $rootScope.chargifyPayUpdateCardDetails.uri,
                        api_id: $rootScope.chargifyPayUpdateCardDetails.form["secure[api_id]"],
                        data: $rootScope.chargifyPayUpdateCardDetails.form["secure[data]"],
                        nonce: $rootScope.chargifyPayUpdateCardDetails.form["secure[nonce]"],
                        timestamp: $rootScope.chargifyPayUpdateCardDetails.form["secure[timestamp]"],
                        signature: $rootScope.chargifyPayUpdateCardDetails.form["secure[signature]"],
                        profile_ID: $rootScope.chargifyPayUpdateCardDetails.form["payment_profile[id]"],
                        card_number: $rootScope.editCardNumber,
                        expiration_month: $rootScope.editExpiryMonth,
                        expiration_year: $rootScope.editExpiryYear,
                        cvv: $rootScope.editCvv,
                        first_name: $rootScope.editFirstName,
                        last_name: $rootScope.editLastName,
                        billing_state: $rootScope.editState,
                        billing_address: $rootScope.editBillingAddress,
                        billing_city: $rootScope.editCity,
                        billing_zip: $rootScope.editZip,
                        billing_country: $scope.editCountry,
                        accessToken: $rootScope.accessToken,
                        success: function (data) {
                            if (data.errorMessages === null || data.errorMessages === '') {
                                $scope.EditPaymentDetails = data;
                                $rootScope.userCardDetails = $scope.EditPaymentDetails.paymentProfileId;
                                $rootScope.chkProfileIdForCrdType = $scope.EditPaymentDetails.paymentProfileId;
                                if (typeof $rootScope.editCardNumber === 'undefined') {
                                    $rootScope.choosePaymentShow = 'none';
                                    $rootScope.choosePaymentHide = 'initial';
                                } else if (typeof $rootScope.editCardNumber !== 'undefined') {
                                    $rootScope.choosePaymentShow = 'initial';
                                    $rootScope.choosePaymentHide = 'none';
                                    var cardNo = $rootScope.editCardNumber;
                                    var strCardNo = cardNo.toString();
                                    var getLastFour = strCardNo.substr(strCardNo.length - 4);
                                    $rootScope.userCardNumber = getLastFour;
                                }
                                //  alert("lasr -> "+$rootScope.userCardNumber);
                                $rootScope.doGetPatientPaymentProfiles();
                                $state.go('tab.submitPayment');
                                $rootScope.cardDisplay = "inherit;";
                                $rootScope.verifyCardDisplay = "none";
                                $rootScope.planverify = "inherit";
                            } else {
                                $rootScope.cardDisplay = "inherit;";
                                $rootScope.verifyCardDisplay = "none";
                                $rootScope.planverify = "inherit";
                                if (typeof $rootScope.editCardNumber !== 'undefined' && data.errorCode != '4221') {
                                    var cardNo = $rootScope.editCardNumber;
                                    var strCardNo = cardNo.toString();
                                    var getLastFour = strCardNo.substr(strCardNo.length - 4);
                                    $scope.ErrorMessage = "Unable to add payment method x" + getLastFour + ". Credit card number: must be a valid credit card number";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (data.errorCode != '4221') {
                                    $scope.ErrorMessage = "Credit card number: must be a valid credit card number";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else {
                                    $scope.ErrorMessage = "Duplicate submission detected. Please try again, and refrain from using Cancel button";
                                    $rootScope.Validation($scope.ErrorMessage);
                                }
                            }
                        },
                        error: function () {
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                            $rootScope.serverErrorMessageValidationForPayment();
                        }
                    };
                    LoginService.PostUpdateChargifyDetails(params);
                } else {
                    var params = {
                        EmailId: $rootScope.UserEmail,
                        BillingAddress: $rootScope.editBillingAddress,
                        CardNumber: $rootScope.editCardNumber,
                        City: $rootScope.editCity,
                        ExpiryMonth: $rootScope.editExpiryMonth,
                        ExpiryYear: $rootScope.editExpiryYear,
                        FirstName: $rootScope.editFirstName,
                        LastName: $rootScope.editLastName,
                        State: $rootScope.editState,
                        Zip: $rootScope.editZip,
                        Country: $scope.editCountry,
                        ProfileId: $rootScope.profileid,
                        Cvv: $rootScope.editCvv,
                        Patientprofileid: $rootScope.patientprofileID,
                        accessToken: $rootScope.accessToken,
                        success: function (data) {


                            $scope.EditPaymentDetails = data;
                            $rootScope.userCardDetails = $rootScope.profileid;
                            $rootScope.chkProfileIdForCrdType = $rootScope.profileid;
                            if (typeof $rootScope.editCardNumber === 'undefined') {
                                $rootScope.choosePaymentShow = 'none';
                                $rootScope.choosePaymentHide = 'initial';
                            } else if (typeof $rootScope.editCardNumber !== 'undefined') {
                                $rootScope.choosePaymentShow = 'initial';
                                $rootScope.choosePaymentHide = 'none';
                                var cardNo = $rootScope.editCardNumber;
                                //  alert('cardno ->'+cardNo);
                                var strCardNo = cardNo.toString();
                                var getLastFour = strCardNo.substr(strCardNo.length - 4);
                                $rootScope.userCardNumber = getLastFour;
                                //alert('cardno ->'+$rootScope.userCardNumber);

                                /*if($rootScope.paymentProfileId == $window.localStorage.getItem("Card"+ $rootScope.UserEmail))
                                {
                                     $window.localStorage.setItem("Card" + $rootScope.UserEmail, $rootScope.paymentProfileId);
                                     $window.localStorage.setItem("CardText" + $rootScope.UserEmail, $rootScope.paymentCardNumber);
                                     $window.localStorage.setItem("CardLogo" + $rootScope.UserEmail, $rootScope.paymentProfileLogo);
                                     $window.localStorage.setItem("hosNameforCard", $rootScope.hospitalName);
                                }*/
                            }
                            $rootScope.doGetPatientPaymentProfiles();
                            $state.go('tab.submitPayment');
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                        },
                        error: function () {
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                            $rootScope.serverErrorMessageValidationForPayment();
                        }
                    };
                    LoginService.editPaymentProfile(params);
                }
            }
        }

        $scope.doPostPaymentProfileDetails = function () {
           
            $rootScope.iscancel = false;

            $rootScope.isEditAvailable = false;
            var zipCount = $('#Zip').val().length;
            var currentTime = new Date()
            var ExpiryDateCheck = new Date();
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
            $scope.CountryFullName = $scope.getCardDetails.CountryFullName;



            if ($('#FirstName').val() === '' || $('#LastName').val() === '' || $('#CardNumber').val() === '' || $('#datepicker').val() === '' || $('#Cvv').val() === '' ||
                $('#BillingAddress').val() === '' || $('#City').val() === '' || $('#State').val() === '' ) {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if($('#Zip').val() === '' && $scope.Country == 'US') {
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
                //  } else if ($rootScope.Cvv.length !== $scope.ccCvvLength) {
            } else if ($rootScope.Cvv.toString().length < 3) {
                $scope.invalidZip = "";
                $scope.invalidMonth = "";
                $scope.invalidCard = "";
                $scope.invalidCVV = "border: 1px solid red;";
                //  $scope.ErrorMessage = "CVV code must be " + $scope.ccCvvLength + " numbers";
                $scope.ErrorMessage = "Invalid CVV code";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (zipCount <= 4 && $scope.Country == 'US') {
                $scope.invalidMonth = "";
                $scope.invalidCard = "";
                $scope.invalidCVV = "";
                $scope.invalidZip = "border: 1px solid red;";
                $scope.ErrorMessage = "Verify Zip";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $scope.invalidZip = "";
                $scope.invalidMonth = "";
                $scope.invalidCard = "";
                $scope.invalidCVV = "";

                $rootScope.cardDisplay = "none;";
                $rootScope.verifyCardDisplay = "inherit";
                $rootScope.planverify = "0.3";
                if ($rootScope.addCardStatus === 200) {
                    var params = {
                        uri: $rootScope.PayAddCardDetails.uri,
                        api_id: $rootScope.PayAddCardDetails.form["secure[api_id]"],
                        data: $rootScope.PayAddCardDetails.form["secure[data]"],
                        nonce: $rootScope.PayAddCardDetails.form["secure[nonce]"],
                        timestamp: $rootScope.PayAddCardDetails.form["secure[timestamp]"],
                        signature: $rootScope.PayAddCardDetails.form["secure[signature]"],
                        customerID: $rootScope.PayAddCardDetails.form["signup[customer][id]"],
                        productID: $rootScope.PayAddCardDetails.form["signup[product][id]"],
                        card_number: $rootScope.CardNumber,
                        expiration_month: $rootScope.ExpiryMonth,
                        expiration_year: $rootScope.ExpiryYear,
                        cvv: $rootScope.Cvv,
                        first_name: $rootScope.FirstName,
                        last_name: $rootScope.LastName,
                        billing_state: $rootScope.State,
                        billing_address: $rootScope.BillingAddress,
                        billing_city: $rootScope.City,
                        billing_zip: $rootScope.Zip,
                        billing_country: $scope.Country,
                        accessToken: $rootScope.accessToken,
                        success: function (data) {
                            if (data.errorMessages === null || data.errorMessages === '') {
                                $scope.PostPaymentDetails = data;
                                $rootScope.userCardDetails = data.paymentProfileId;
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
                                $rootScope.doGetPatientPaymentProfiles();
                                $state.go('tab.submitPayment');
                                $rootScope.cardDisplay = "inherit;";
                                $rootScope.verifyCardDisplay = "none";
                                $rootScope.planverify = "inherit";
                            } else {
                                $rootScope.cardDisplay = "inherit;";
                                $rootScope.verifyCardDisplay = "none";
                                $rootScope.planverify = "inherit";
                                if (typeof $rootScope.editCardNumber !== 'undefined' && data.errorCode != '4221') {
                                    var cardNo = $rootScope.editCardNumber;
                                    var strCardNo = cardNo.toString();
                                    var getLastFour = strCardNo.substr(strCardNo.length - 4);
                                    $scope.ErrorMessage = "Unable to add payment method x" + getLastFour + ". Credit card number: must be a valid credit card number";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else if (data.errorCode != '4221') {
                                    $scope.ErrorMessage = "Credit card number: must be a valid credit card number";
                                    $rootScope.Validation($scope.ErrorMessage);
                                } else {
                                    $scope.ErrorMessage = "Duplicate submission detected. Please try again, and refrain from using Cancel button";
                                    $rootScope.Validation($scope.ErrorMessage);
                                }
                            }
                        },
                        error: function (data, status) {
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                            $rootScope.serverErrorMessageValidationForPayment();
                        }
                    };
                    LoginService.PostChargifyDetails(params);
                } else {
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
                        success: function (data) {
                            $scope.PostPaymentDetails = data;
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
                            $rootScope.doGetPatientPaymentProfiles();
                            $state.go('tab.submitPayment');
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                        },
                        error: function (data, status) {
                            $rootScope.cardDisplay = "inherit;";
                            $rootScope.verifyCardDisplay = "none";
                            $rootScope.planverify = "inherit";
                            if (status === 0) {
                                $scope.ErrorMessage = "Internet connection not available, Try again later!";
                                $rootScope.Validation($scope.ErrorMessage);
                            } else if (status === 503) {
                                $scope.callServiceUnAvailableError();
                            } else {
                                $rootScope.serverErrorMessageValidationForPayment();
                            }
                        }
                    };
                    LoginService.postPaymentProfileDetails(params);
                }

            }
        }

        $scope.doGetCodesSet = function () {
            var params = {
                hospitalId: $rootScope.hospitalId,
                accessToken: $rootScope.accessToken,
                fields: $scope.codesFields,
                success: function (data) {
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
                    $rootScope.selectYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);

                    $rootScope.eyeHairEthnicityRelationCodeSets = [];
                    angular.forEach(data.data, function (index) {
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
                    if ($rootScope.listOfHeightunit[0].codes[0].text == "m/cm") {
                        var cmId = $rootScope.listOfHeightunit[0].codes[0].codeId;
                        var ftId = $rootScope.listOfHeightunit[0].codes[1].codeId;
                        $rootScope.listOfHeightunit[0].codes[0].codeId = ftId;
                        $rootScope.listOfHeightunit[0].codes[0].text = "ft/in"
                        $rootScope.listOfHeightunit[0].codes[0].displayOrder = 1;
                        $rootScope.listOfHeightunit[0].codes[1].codeId = cmId
                        $rootScope.listOfHeightunit[0].codes[1].text = "m/cm"
                        $rootScope.listOfHeightunit[0].codes[1].displayOrder = 2;
                    }

                    $rootScope.listOfWeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                        name: "Weight Units"
                    });
                    $rootScope.listOfBloodtype = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                        name: "Blood Type"
                    });
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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
            $rootScope.MedicationCount === 'undefined';
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

        $scope.addMinutes = function (inDate, inMinutes) {
            var newdate = new Date();
            newdate.setTime(inDate.getTime() + inMinutes * 60000);
            return newdate;
        }

        $rootScope.doGetScheduledNowPhoneConsulatation = function (redirectToPage) {
            $rootScope.scheduledConsultationList = '';
            $rootScope.getScheduledList = [];
            $rootScope.scheduleParticipants = [];
            $rootScope.scheduledList = '';
            $rootScope.scheduledConsultationList = [];
            var date = new Date();
            date = new Date(date.setDate(date.getDate() - 1));
            var yesterdayDate = new Date(date.setHours(date.getHours() - 1));
            var splitmnth = yesterdayDate.getMonth() + 1;
            var splitdate = yesterdayDate.getDate();
            var splityear = yesterdayDate.getFullYear(); var splitHour = yesterdayDate.getHours(); var splitMins = yesterdayDate.getMinutes(); var splitSec = yesterdayDate.getSeconds();
            var Aptdate = splityear + "-" + splitmnth + "-" + splitdate + "T" + splitHour + ":" + splitMins + ":" + splitSec;
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                userTimeZoneId: $rootScope.userTimeZoneId,
                yesterdayDate: Aptdate,
                success: function (data) {
                    if (data.total > 0) {
                        $scope.scheduledConsultationList = data.data;
                        $rootScope.getScheduledList = [];
                        $rootScope.scheduleParticipants = [];
                        var currentDate = new Date();
                        currentDate = $scope.addMinutes(currentDate, -60);
                        angular.forEach($scope.scheduledConsultationList, function (index) {
                            //  if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {
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
                            $rootScope.appointmentwaivefee = index.waiveFee;
                            $scope.paticipatingPatientName = $scope.paticipatingPatient.person.name.given + ' ' + $scope.paticipatingPatient.person.name.family;
                            $scope.paticipatingPatientInitial = getInitialForName($scope.paticipatingPatientName);
                            $scope.paticipatingPatientPhoto = $scope.paticipatingPatient.person.photoUrl;
                            $scope.paticipatingPhysician = $filter('filter')(angular.fromJson(index.participants), {
                                "participantTypeCode": "2"
                            })[0];
                            $scope.paticipatingPhysicianName = $scope.paticipatingPhysician.person.name.given + ' ' + $scope.paticipatingPhysician.person.name.family;
                            $scope.paticipatingPhysicianInitial = getInitialForName($scope.paticipatingPhysicianName);
                            $scope.paticipatingPhysicianPhoto = $scope.paticipatingPhysician.person.photoUrl;

                            var nextAppointmentDisplay = 'none';
                            var userHomeRecentAppointmentColor = '';
                            var d = new Date();
                            d.setHours(d.getHours() + 12);
                            //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                            var currentUserHomeDate = d;

                            var getReplaceTime = CustomCalendar.getLocalTime1(index.startTime);
                            var currentUserHomeDate = currentUserHomeDate;

                            if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                                userHomeRecentAppointmentColor = '#FDD8C5';
                                nextAppointmentDisplay = 'block';
                                $rootScope.timerCOlor = '#FDD8C5';
                                var beforAppointmentTime = getReplaceTime;
                                var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);
                                if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {
                                    userHomeRecentAppointmentColor = '#a2d28a';//E1FCD4
                                    $rootScope.timerCOlor = '#a2d28a';
                                }
                            }
                            
                            var AppoinmentDateString = formatJSONDateShort(index.startTime);
                            var AppoinmentDate = new Date(AppoinmentDateString);
                            var AppionmentTimeString =  GetFormattedTimeFromTimeStamp(index.startTime);
                            var AppionmentTimeSplit = AppionmentTimeString.split(' ');

                            $rootScope.getScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime1(index.startTime),
                                //'scheduledTimelab': GetFormattedTimeFromTimeStamp(index.startTime),
                                'scheduledTimelab': AppionmentTimeSplit[0],
                                'scheduledTimelabGMT': AppionmentTimeSplit[1],
                                'scheduledTimeDate': AppoinmentDate,
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
                                'phiLastName': $scope.paticipatingPhysician.person.name.family,
                                'encounterTypeCode': index.encounterTypeCode,
                                'clinicianId': index.clinicianId,
                                'userHomeRecentAppointmentColor': userHomeRecentAppointmentColor,
                                'nextAppointmentDisplay': nextAppointmentDisplay
                            });
                            angular.forEach(index.participants, function (index, item) {
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

                            //    }
                        });
                        $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");
                        //  $rootScope.primaryAppointDetails = $rootScope.scheduledList.filter(function(r) { var show = r.patientId == $rootScope.primaryPatientId; return show; });

                        $rootScope.inqueueAppoint = true;
                        // $rootScope.doGetScheduledConsulatation(redirectToPage);
                        $rootScope.doGetScheduledAvailableConsultation(redirectToPage);


                    } else {
                        $rootScope.inqueueAppoint = false;
                        // $rootScope.doGetScheduledConsulatation(redirectToPage);
                        $rootScope.doGetScheduledAvailableConsultation(redirectToPage);
                    }
                },
                error: function (status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            //LoginService.getScheduledConsulatation(params);
            LoginService.getScheduledNowPhoneConsulatation(params);
        }

        $rootScope.doGetScheduledAvailableConsultation = function (redirectToPage) {
            if (!$rootScope.inqueueAppoint) {
                $rootScope.scheduledConsultationList = '';
                $rootScope.getScheduledList = [];
                $rootScope.scheduleParticipants = [];
                $rootScope.scheduledList = '';
                $rootScope.scheduledConsultationList = [];
            }
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                userTimeZoneId: $rootScope.userTimeZoneId,
                success: function (data) {
                    // $rootScope.inprogressConsultationList = [];
                    if (data.total > 0) {
                        if (!$rootScope.inqueueAppoint) {
                            $rootScope.getScheduledList = [];
                            $rootScope.scheduleParticipants = [];
                        }
                        angular.forEach(data.data, function (index) {
                            if (index.status == 71) {
                                
                                var AppoinmentDateString = formatJSONDateShort(index.consultationDateInfo);
                                var AppoinmentDate = new Date(AppoinmentDateString);
                                var AppionmentTimeString =  GetFormattedTimeFromTimeStamp(index.consultationDateInfo);
                                var AppionmentTimeSplit = AppionmentTimeString.split(' ');

                                $rootScope.getScheduledList.push({
                                    'consultantUserId': index.consultantUserId,
                                    //'scheduledTime': CustomCalendar.getLocalTime1(index.consultationDateInfo),
                                    'scheduledTime': CustomCalendar.getLocalTime(index.consultationDateInfo),
                                    'scheduledTimelab': AppionmentTimeSplit[0],
                                    'scheduledTimelabGMT': AppionmentTimeSplit[1],
                                    'scheduledTimeDate': AppoinmentDate,
                                    'consultationId': index.consultationId,
                                    'createdDate': index.createdDate,
                                    'doctorStatus': index.doctorStatus,
                                    'encounterTypeCode': index.encounterTypeCode,
                                    'expireDate': index.expireDate,
                                    'expireDateInfo': index.expireDateInfo,
                                    'isTimeConverted': index.isTimeConverted,
                                    'meetingId': index.meetingId,
                                    'patFirstName': index.patientFirstName,
                                    'patLastName': index.patientLastName,
                                    'patientId': index.patientId,
                                    'patientName': $scope.patientName,
                                    'patientStatus': index.patientStatus,
                                    'personId': index.personId,
                                    'status': index.status,
                                    'userHomeRecentAppointmentColor': '#a2d28a',
                                    'nextAppointmentDisplay': 'block'
                                });
                                if (typeof $rootScope.scheduledListDatas != 'undefined' && $rootScope.scheduledListDatas != null && typeof $rootScope.inProgressConsultID != 'undefined' && $rootScope.inProgressConsultID != null) {
                                    // if(($rootScope.inProgressConsultID == $rootScope.getScheduledList[0].consultationId) && ($rootScope.scheduledListDatas.patientId == $rootScope.getScheduledList[0].patientId)) {

                                    var getConsultDetails = $filter('filter')($rootScope.getScheduledList, {
                                        consultationId: $rootScope.inProgressConsultID
                                    });

                                   if (($rootScope.inProgressConsultID == getConsultDetails[0].consultationId) && ($rootScope.scheduledListDatas.patientId == getConsultDetails[0].patientId)) {
                                        $(".appointInqueue").css({ "display": "none" });
                                        $(".appointInProgress").css({ "display": "initial" });
                                    } else {
                                        $(".appointInqueue").css({ "display": "initial" });
                                        $(".appointInProgress").css({ "display": "none" });
                                    }
                                } else {
                                    $(".appointInqueue").css({ "display": "initial" });
                                    $(".appointInProgress").css({ "display": "none" });

                                }
                            }
                        });

                        $rootScope.activeInqueueAppoint = true;
                        $rootScope.doGetScheduledConsulatation(redirectToPage);
                    } else {
                        $(".appointInqueue").css({ "display": "initial" });
                        $(".appointInProgress").css({ "display": "none" });
                        $rootScope.activeInqueueAppoint = false;
                        $rootScope.doGetScheduledConsulatation(redirectToPage);
                    }
                },
                error: function (status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getScheduledAvailableConsultation(params);
        }

        $rootScope.doGetScheduledConsulatation = function (redirectToPage) {
            if (!$rootScope.inqueueAppoint && !$rootScope.activeInqueueAppoint) {
                $rootScope.scheduledConsultationList = '';
                $rootScope.getScheduledList = [];
                $rootScope.scheduleParticipants = [];
                $rootScope.scheduledList = '';
                $rootScope.scheduledConsultationList = [];
            }
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                userTimeZoneId: $rootScope.userTimeZoneId,
                success: function (data) {
                    if (data !== "") {
                        $scope.scheduledConsultationList = data.data;
                        if (!$rootScope.inqueueAppoint && !$rootScope.activeInqueueAppoint) {
                            $rootScope.getScheduledList = [];
                            $rootScope.scheduleParticipants = [];
                        }
                        var currentDate = new Date();
                        currentDate = $scope.addMinutes(currentDate, -60);
                        angular.forEach($scope.scheduledConsultationList, function (index) {
                            // if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {
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
                            $rootScope.appointmentwaivefee = index.waiveFee;
                            $scope.paticipatingPatientName = $scope.paticipatingPatient.person.name.given + ' ' + $scope.paticipatingPatient.person.name.family;
                            $scope.paticipatingPatientInitial = getInitialForName($scope.paticipatingPatientName);
                            $scope.paticipatingPatientPhoto = $scope.paticipatingPatient.person.photoUrl;
                            $scope.paticipatingPhysician = $filter('filter')(angular.fromJson(index.participants), {
                                "participantTypeCode": "2"
                            })[0];
                            $scope.paticipatingPhysicianName = $scope.paticipatingPhysician.person.name.given + ' ' + $scope.paticipatingPhysician.person.name.family;
                            $scope.paticipatingPhysicianInitial = getInitialForName($scope.paticipatingPhysicianName);
                            $scope.paticipatingPhysicianPhoto = $scope.paticipatingPhysician.person.photoUrl;

                            var nextAppointmentDisplay = 'none';
                            var userHomeRecentAppointmentColor = '';
                            var d = new Date();
                            d.setHours(d.getHours() + 12);
                            //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                            var currentUserHomeDate = d;

                            var getReplaceTime = CustomCalendar.getLocalTime1(index.startTime);
                            var currentUserHomeDate = currentUserHomeDate;

                            if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                                userHomeRecentAppointmentColor = '#FDD8C5';
                                nextAppointmentDisplay = 'block';
                                $rootScope.timerCOlor = '#FDD8C5';
                                var beforAppointmentTime = getReplaceTime;
                                var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);
                                if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {
                                    userHomeRecentAppointmentColor = '#a2d28a';//E1FCD4
                                    $rootScope.timerCOlor = '#a2d28a';
                                }
                            }

                            
                            var AppoinmentDateString = formatJSONDateShort(index.startTime);
                            var AppoinmentDate = new Date(AppoinmentDateString);
                            var AppionmentTimeString =  GetFormattedTimeFromTimeStamp(index.startTime);
                            var AppionmentTimeSplit = AppionmentTimeString.split(' ');

                            $rootScope.getScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime1(index.startTime),
                                'scheduledTimelab': AppionmentTimeSplit[0],
                                'scheduledTimelabGMT': AppionmentTimeSplit[1],
                                'scheduledTimeDate': AppoinmentDate,
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
                                'phiLastName': $scope.paticipatingPhysician.person.name.family,
                                'encounterTypeCode': index.encounterTypeCode,
                                'clinicianId': index.clinicianId,
                                'userHomeRecentAppointmentColor': userHomeRecentAppointmentColor,
                                'nextAppointmentDisplay': nextAppointmentDisplay
                            });
                            angular.forEach(index.participants, function (index, item) {
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
                            // }
                        });

                        $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");
                        //  $rootScope.primaryAppointDetails = $rootScope.scheduledList.filter(function(r) { var show = r.patientId == $rootScope.primaryPatientId; return show; });
                        $rootScope.doGetIndividualScheduledConsulatation();
                        if (redirectToPage == 'tab.userhome')
                            $rootScope.doGetRelatedPatientProfiles('tab.userhome');
                    } else {
                        $rootScope.doGetIndividualScheduledConsulatation();
                        if (redirectToPage == 'tab.userhome')
                            $rootScope.doGetRelatedPatientProfiles('tab.userhome');
                    }
                },
                error: function (status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getScheduledConsulatation(params);
            //LoginService.getScheduledNowPhoneConsulatation(params);
        }

        //if($rootScope.activeInqueueAppoint) {
        var activeConsultConnection = $.hubConnection();
        var activeRoomConHub = activeConsultConnection.createHubProxy('snapNotificationsHub');
        activeConsultConnection.url = $rootScope.APICommonURL + "/api/signalR/";
        activeConsultConnection.qs = {
            "Bearer": $rootScope.accessToken,
            "waitingroom": 1,
            "isMobile": true,
        };
        activeRoomConHub.on("onConsultationReview", function () {
            // alert("The Provider is now reviewing the intake form.");
            $scope.$digest();
        });
        activeRoomConHub.on("onCustomerDefaultWaitingInformation", function () {
            $scope.$digest();
        });
        activeRoomConHub.on("onConsultationStarted", function () {
            $scope.$digest();
        });
        activeConsultConnection.logging = true;
        window.whub = activeConsultConnection;
        activeConsultConnection.start({
            withCredentials: false
        }).then(function () {
            activeConsultConnection.disconnected(function () {
                // console.log("hhhh");
                setTimeout(function () {
                    // if(activeConsultConnection && activeConsultConnection.start){
                    //   activeConsultConnection.start();
                    //console.log("iiii");
                    //   }
                }, 5000);
            });
        });


        var alertMsgcomplete = "The Provider has marked your consultation as complete.";
        var alertconfirmok = "Ok";
        var alertCancelMessageProviderSearch = "Are you sure that you want to cancel?";
        var alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
        var sessAlertMessage = "You have logged in on another device and ended this session.";
        var YESMessageProviderSearch = 'Yes';
        var NaviConfirmation = 'Confirmation:';
        var sessAlertDone = 'Done';
        var SessTimedOutMsg = 'Your session timed out.';
        var SessTimedOk = 'Ok';
        var consultEndMessage = 'Consultation is ended.';
        var consultExpireMessage = 'The consultation expired.';
        var consultDismisMsg = "This consultation has been dismissed.If you feel this cancellation is in error, please contact your provider.";
        var consultStartMsg = 'Your consultation is already started on other device.';
        var consultEndMeg = 'Your consultation is already ended.';
        var consultCancelMsg = 'Your consultation is cancelled.';
        var consultProgMsg = 'Your consultation is in progress on other device.';
        var consultSaveMsg = 'Consultation saved successfully!';
        var consultFailMsg = 'Failed to save consultation!';


        var localizeCurrent = $('#localize-current').text();
        console.log("lang " + localizeCurrent);
        if (localizeCurrent == "Español") {
            alertMsgcomplete = "El Proveedor ha marcado su consulta como completa.";
            alertCancelMessageProviderSearch = "¿Estás seguro de que quieres cancelar?";
            alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
            alertconfirmok = "De acuerdo";
            YESMessageProviderSearch = 'Sí';
            NaviConfirmation = 'Confirmación:';
            sessAlertMessage = "Ha iniciado sesión en otro dispositivo y finalizó esta sesión.";
            sessAlertDone = 'Hecho';
            SessTimedOutMsg = 'Su sesión ha excedido el tiempo de espera.';
            SessTimedOk = 'De acuerdo';
            consultEndMessage = 'La consulta ha terminado.';
            consultExpireMessage = 'La consulta expiró.';
            consultDismisMsg = 'Esta consulta ha sido rechazada. Si siente que esta cancelación es errónea, comuníquese con su proveedor.';
            consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
            consultEndMeg = 'Su consulta ya ha finalizado';
            consultCancelMsg = 'Su consulta se cancela.';
            consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
            consultSaveMsg = 'Consulta guardada exitosamente!';
            consultFailMsg = 'Error al guardar consulta!';
        }
        else {
            alertMsgcomplete = "The Provider has marked your consultation as complete.";
            alertCancelMessageProviderSearch = "Are you sure that you want to cancel?";
            alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
            alertconfirmok = "Ok";
            YESMessageProviderSearch = 'Yes';
            NaviConfirmation = 'Confirmation:';
            sessAlertMessage = "You have logged in on another device and ended this session.";
            sessAlertDone = 'Done';
        }

        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            console.log("lang " + isLang);
            if (isLang == "Español") {
                alertMsgcomplete = "El Proveedor ha marcado su consulta como completa.";
                alertCancelMessageProviderSearch = "¿Estás seguro de que quieres cancelar?";
                alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
                alertconfirmok = "De acuerdo";
                YESMessageProviderSearch = 'Sí';
                NaviConfirmation = 'Confirmación:';
                sessAlertMessage = "Ha iniciado sesión en otro dispositivo y finalizó esta sesión.";
                sessAlertDone = 'Hecho';
                SessTimedOutMsg = 'Su sesión ha excedido el tiempo de espera.';
                SessTimedOk = 'De acuerdo';
                consultEndMessage = 'La consulta ha terminado.';
                consultExpireMessage = 'La consulta expiró.';
                consultDismisMsg = 'Esta consulta ha sido rechazada. Si siente que esta cancelación es errónea, comuníquese con su proveedor.';
                consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
                consultEndMeg = 'Su consulta ya ha finalizado';
                consultCancelMsg = 'Su consulta se cancela.';
                consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
                consultSaveMsg = 'Consulta guardada exitosamente!';
                consultFailMsg = 'Error al guardar consulta!';
            } else {
                alertMsgcomplete = "The Provider has marked your consultation as complete.";
                alertconfirmok = "Ok";
                alertCancelMessageProviderSearch = "Are you sure that you want to cancel?";
                YESMessageProviderSearch = 'Yes';
                alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
                NaviConfirmation = 'Confirmation:';
                sessAlertMessage = "You have logged in on another device and ended this session.";
                sessAlertDone = 'Done';
                SessTimedOutMsg = 'Your session timed out.';
                SessTimedOk = 'Ok';
                consultEndMessage = 'Consultation is ended.';
                consultExpireMessage = 'The consultation expired.';
                consultDismisMsg = "This consultation has been dismissed.If you feel this cancellation is in error, please contact your provider.";
                consultStartMsg = 'Your consultation is already started on other device.';
                consultEndMeg = 'Your consultation is already ended.';
                consultCancelMsg = 'Your consultation is cancelled.';
                consultProgMsg = 'Your consultation is in progress on other device.';
                consultSaveMsg = 'Consultation saved successfully!';
                consultFailMsg = 'Failed to save consultation!';
            }
        });

        var isOpenPopup = 0;
        activeRoomConHub.on("broadcastMessage", function (messageType, message) {
            $scope.doRefreshUserHome();
           $rootScope.inProgressConsultID = message;
            if (messageType == 'consultation_ended') {
                
                //  alert('gg2');
                navigator.notification.alert(
                    //'Consultation is ended.', // message
                    consultEndMessage,
                    function () {
                        activeConsultConnection.stop();
                        activeConsultConnection.qs = {};
                        activeConsultConnection = null;
                        activeRoomConHub = null;
                        if ((($('.appointInProgress').is(':hidden') != true) && $state.current.name == "tab.appoimentDetails") || $state.current.name == "tab.waitingRoom") {
                            $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                        } else if ($state.current.name == "tab.userhome") {
                            $scope.doRefreshUserHome();
                        } else {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                        }
                        return;
                    },
                    $rootScope.alertMsgName, // title
                    alertconfirmok // buttonName
                );
                return false;
            } else if (messageType == 'consultation_dropped') {
                //  alert('gg');
                navigator.notification.alert(
                    //'The consultation expired.', // message
                    consultExpireMessage,
                    function () {
                        activeConsultConnection.stop();
                        activeConsultConnection.qs = {};
                        activeConsultConnection = null;
                        activeRoomConHub = null;
                        if ((($('.appointInProgress').is(':hidden') != true) && $state.current.name == "tab.appoimentDetails") || $state.current.name == "tab.waitingRoom") {
                            $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                        } else if ($state.current.name == "tab.userhome") {
                            $scope.doRefreshUserHome();
                        } else {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                        }
                        return;
                    },
                    $rootScope.alertMsgName, // title
                    alertconfirmok // buttonName
                );
                return false;
            } else if (messageType == 'consultation_fulfilled') {
                //  alert('gg1');
                navigator.notification.alert(
                    // 'The Provider has marked your consultation as complete.', // message
                    alertMsgcomplete,
                    function () {
                        activeConsultConnection.stop();
                        activeConsultConnection.qs = {};
                        activeConsultConnection = null;
                        activeRoomConHub = null;
                        if ((($('.appointInProgress').is(':hidden') != true) && $state.current.name == "tab.appoimentDetails") || $state.current.name == "tab.waitingRoom") {
                            $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');

                        } else {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                        }
                        return;
                    },
                    $rootScope.alertMsgName, // title
                    'Ok' // buttonName
                );
                return false;
            }
            else if (messageType == 'consultation_dismissed') {
                //  alert('gg1');
                if (isOpenPopup == 0) {
                    isOpenPopup += 1;
                    navigator.notification.alert(
                        // 'This consultation has been dismissed.If you feel this cancellation is in error, please contact your provider. ', // message
                        consultDismisMsg,
                        function () {
                            activeConsultConnection.stop();
                            activeConsultConnection.qs = {};
                            activeConsultConnection = null;
                            activeRoomConHub = null;
                            if ((($('.appointInProgress').is(':hidden') != true) && $state.current.name == "tab.appoimentDetails") || $state.current.name == "tab.waitingRoom") {
                                $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                            } else if ($state.current.name == "tab.userhome") {
                                $scope.doRefreshUserHome();
                            } else {
                                $rootScope.doGetScheduledNowPhoneConsulatation();
                            }
                            return;
                        },
                        $rootScope.alertMsgName, // title
                        'Ok' // buttonName
                    );
                    return false;
                }
            } else {
                // alert('gg4');
                if ($state.current.name == "tab.waitingRoom")
                    $rootScope.doGetScheduledNowPhoneConsulatation('tab.userhome');
                else
                    $rootScope.doGetScheduledNowPhoneConsulatation();
                // $rootScope.doGetScheduledNowPhoneConsulatation();
            }
        });


        activeRoomConHub.on("onConsultationEnded", function () {
            // alert('ended');
        });
        //};







        $scope.doPutActiveSession = function () {
            var params = {
                email: $rootScope.UserEmail,
                password: $rootScope.registedPwd,
                userTypeId: 1,
                hospitalId: $rootScope.hospitalId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.sessPopup = false;
                    $scope.doGetUserTimezone();
                    $scope.doGetCodesSet();
                    $scope.chkPatientFilledAllRequirements();
                    // $rootScope.doGetPatientProfiles();
                    $rootScope.sessionConsultConnection = $.hubConnection();
                    $rootScope.sessionRoomConHub = $rootScope.sessionConsultConnection.createHubProxy('sessionLimiterHub');
                    $rootScope.sessionConsultConnection.url = $rootScope.APICommonURL + "/api/signalR/";
                    $rootScope.sessionConsultConnection.qs = {
                        "Bearer": $rootScope.accessToken,
                        // "isMobile": true,
                    };
                    $rootScope.sessionRoomConHub.on("onConsultationReview", function () {
                        // alert("The Provider is now reviewing the intake form.");
                        $scope.$digest();
                    });
                    $rootScope.sessionRoomConHub.on("onCustomerDefaultWaitingInformation", function () {
                        $scope.$digest();
                    });
                    $rootScope.sessionRoomConHub.on("onConsultationStarted", function () {
                        $scope.$digest();
                    });
                    $rootScope.sessionConsultConnection.logging = true;
                    window.whub = $rootScope.sessionConsultConnection;
                    $rootScope.sessionConsultConnection.start({
                        withCredentials: false
                    }).then(function () {
                        $rootScope.sessionConsultConnection.disconnected(function () {
                            // console.log("hhhh");
                            setTimeout(function () {
                                // if(activeConsultConnection && activeConsultConnection.start){
                                //   activeConsultConnection.start();
                                //console.log("iiii");
                                //   }
                            }, 5000);
                        });

                    });

                    $rootScope.sessionRoomConHub.on("onSessionTerminated", function (ip) {
                        navigator.notification.alert(
                            /*  'You have logged in on another device and ended this session.',*/ // message
                            sessAlertMessage,
                            function () {
                                $rootScope.ClearRootScope();
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            sessAlertDone // buttonName
                        );
                    });

                    $rootScope.sessionRoomConHub.on("sessionRegistered", function (ip) {
                        // alert("sessionLimiterHub: Session limiter registered");
                    });
                    // $scope.doGetScheduleconsultDetails();
                },
                error: function (data, status) {
                    if (status === '401' || status === '403') {
                        $scope.ErrorMessage = "We are unable to log you in. Please contact customer support regarding your account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $scope.ErrorMessage = "Incorrect Password. Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    //  }
                }
            };
            LoginService.putActiveSession(params);
        }

        $scope.doGetTokenForSession = function () {
            var params = {
                email: $rootScope.UserEmail,
                password: $rootScope.registedPwd,
                userTypeId: 1,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.accessToken = data.data[0].access_token;

                    var userData = {};
                    userData.apiDeveloperId = util.getHeaders()["X-Developer-Id"];
                    userData.apiKey = util.getHeaders()["X-Api-Key"];
                    userData.token = data.data[0].access_token;
                    userData.snapLogin = true;
                    var userDataJsonData = JSON.stringify(userData);
                    $window.localStorage.setItem('snap_user_session', userDataJsonData);

                    $scope.getCurrentTimeForSessionLogout = new Date();
                    $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                    $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                    $scope.doPutActiveSession();
                },
                error: function (data, status) {
                    if (status === '401' || status === '403') {
                        $scope.ErrorMessage = "We are unable to log you in. Please contact customer support regarding your account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $scope.ErrorMessage = "Incorrect Password. Please try again";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    //  }
                }
            };
            LoginService.getToken(params);
        }

        $scope.getLogoutPopup = function () {
            $rootScope.checkSession = false;
            var confirmPopup = $ionicPopup.confirm({
                title: "<div class='locationtitle localizejs sessionLocTitle'>Account in use</div> ",
                templateUrl: 'templates/sessionLogout.html',
                cssClass: 'locpopup',
                hardwareBackButtonClose: false,

                buttons: [{
                    text: '<b class="localizejs sesCancel">Cancel</b>',
                    onTap: function (e) {
                    }
                }, {
                    text: '<b class="localizejs sessLogin">Login</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                },],

            });
            $timeout(function () {
                confirmPopup.close();
            }, 1794000);
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.doGetTokenForSession();
                } else {
                    $rootScope.ClearRootScope();
                }
            });
        }

        $rootScope.doGetActiveSession = function () {
            $rootScope.sessPopup = '';
            var params = {
                accessToken: $rootScope.accessToken,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    if (data.data[0] != false) {
                        $rootScope.sessPopup = true;
                        $scope.getLogoutPopup();
                    } else {
                        $scope.doGetUserTimezone();
                        $scope.doGetCodesSet();
                        $scope.chkPatientFilledAllRequirements();
                        // $scope.doGetScheduleconsultDetails();
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);

                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getActiveSession(params);
        }






        $scope.getScheduledDetails = function (patientId) {
            $rootScope.selectedPatientIdForDetails = patientId;
            $state.go('tab.patientCalendar');
        }
        $scope.changedlanDisplay = function () {
            setTimeout(function () {
                $("#localize-widget").show();
            }, 0);
        }

        $rootScope.PlanDisplay = "inherit";
        $rootScope.verifyPlanDisplay = "none;";
        $rootScope.planverify = "inherit";
        $rootScope.subdetailsdisplay = "inherit";
        $scope.PlanDetailsValidation = function (model) {
            $("#localize-widget").show();
            $rootScope.doddate = $('#date').val();
            $rootScope.restage = getAge($rootScope.doddate);

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

        $scope.initialPlanDetails = function () {
            // alert($scope.AddHealth.firstName);
            $scope.AddHealth.firstName = $rootScope.ahfirstName;
            $scope.AddHealth.lastName = $rootScope.ahlastName;
            //$scope.AddHealth.Provider = $rootScope.ahProvider;
            $scope.AddHealth.policyNumber = $rootScope.ahpolicyNumber;
            //$scope.AddHealth.dateBirth = $rootScope.ahdateBirth;

            // document.getElementById('Provider').value = $rootScope.ahProvider;
            $scope.AddHealth.Provider = $rootScope.ahProvider;

            /* var dropdown = document.getElementById("Provider");
             dropdown.options[dropdown.selectedIndex].value = $rootScope.ahProvider;*/


            $rootScope.ahfirstName = '';
            $rootScope.ahlastName = '';
            $rootScope.ahProvider = '';
            $rootScope.ahpolicyNumber = '';
            //   $rootScope.ahdateBirth = '';
            /* $rootScope.ahProvider = document.getElementById('Provider').value;
              $rootScope.ahfirstName = document.getElementById('firstName').value;
              $rootScope.ahlastName = document.getElementById('lastName').value;
              $rootScope.ahpolicyNumber = document.getElementById('policyNumber').value;*/
        }
        //document.getElementById('Provider').value = $rootScope.ahProvider;
        $scope.VerifyPlanDetailsValidation = function () {
            if ($('#firstName').val() === '' || $('#lastName').val() === '' || $('#policyNumber').val() === '' || $('#date').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $state.go('tab.applyPlan');
            }
        }
        $rootScope.PlaneditDisplay = "inherit";
        $rootScope.verifyPlaneditDisplay = "none;";
        $rootScope.plaeditnverify = "inherit";
        $rootScope.subdetailseditdisplay = "inherit";

        $scope.PlanediValidation = function (model) {
            $rootScope.doddate = $('#editdate').val();
            $rootScope.restage = getAge($rootScope.doddate);

            if ($('#editprovider').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editfirstName').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editlastName').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editpolicyNumber').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($('#editdate').val() === '') {
                $scope.ErrorMessage = "Required fields can't be empty";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.restage < 13) {
                $scope.ErrorMessage = "Subscriber should be atleast 13 years old";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $rootScope.verifyPlaneditDisplay = "inherit";
                $rootScope.PlaneditDisplay = "none;";
                $rootScope.planeditverify = "0.3";
                $rootScope.subdetailseditdisplay = "none";
                $scope.doEditHealthPlan();
            }
        }

        $rootScope.SubmitCardValidation = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i><span class="localizejs">' + $a + '! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Error_Message").append(top);
            refresh_close();
            //});
        }

        $rootScope.ReceiptTimeout = function () {
            var currentTimeReceipt = new Date();
            currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
            $rootScope.ReceiptTime = currentTimeReceipt.getTime();
            $.getScript("lib/jquery.signalR-2.1.2.js", function (data, textStatus, jqxhr) {

            });
            setTimeout(function () {
                $scope.doGetWaitingRoom();
            }, 10000);

        }

        $scope.cardPaymentId = [];
        $scope.doPostCoPayDetails = function () {


            if ($('#addNewCard').val() === 'Choose Your Card' || $('#addNewCard_addCard').val() === 'Choose Your Card' || $('#addNewCard_submitPay').val() === 'Choose Your Card') {
                $scope.ErrorMessages = "Please select the card to use for payment";
                $rootScope.SubmitCardValidation($scope.ErrorMessages);

            } else {

                if (typeof $scope.cardPaymentId.addNewCard !== 'undefined') {
                    //$rootScope.paymentProfileId = $scope.cardPaymentId.addNewCard;
                    var payValue = $scope.cardPaymentId.addNewCard.split("@");
                    $rootScope.paymentProfileId = payValue[0];
                    $rootScope.paymentProfileIdType = payValue[1];
                    $rootScope.paymentCardNumber = payValue[2];
                    $rootScope.paymentProfileLogo = payValue[3];
                } else if (typeof $scope.cardPaymentId.addNewCard === 'undefined') {
                    if (typeof $rootScope.userCardDetails === 'undefined') {
                        $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                        $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                        //  $rootScope.paymentProfileIdType = $rootScope.userDefaultPaymentProfileType;
                        $rootScope.paymentCardNumber = $rootScope.userDefaultPaymentProfileText;
                        $rootScope.paymentProfileLogo = $rootScope.userDefaultPaymentLogo;
                    } else {
                        $rootScope.paymentProfileId = $rootScope.userCardDetails;
                        //  $rootScope.paymentProfileIdType = $rootScope.userCardType;
                        $rootScope.paymentCardNumber = $rootScope.userCardNumber;
                        $rootScope.paymentProfileLogo = $rootScope.userCardType;
                    }
                }

                var params = {
                    profileId: parseInt($rootScope.patientprofileID),
                    emailAddress: $rootScope.UserEmail,
                    Amount: $rootScope.copayAmount,
                    consultationId: $rootScope.consultationId,
                    paymentProfileId: parseInt($rootScope.paymentProfileId),
                    accessToken: $rootScope.accessToken,
                    success: function (data) {
                        //To save the last used card for user.
                        //  var cardSelectedText = $('#cardViewport').html();
                        $window.localStorage.setItem("Card" + $rootScope.UserEmail, $rootScope.paymentProfileId);
                        $window.localStorage.setItem("CardText" + $rootScope.UserEmail, $rootScope.paymentCardNumber);
                        $window.localStorage.setItem("CardLogo" + $rootScope.UserEmail, $rootScope.paymentProfileLogo);
                        $window.localStorage.setItem("hosNameforCard", $rootScope.hospitalName);
                        $rootScope.paymentConfirmationNumber = data.data[0].confirmationNumber;
                        $scope.CreditCardDetails = data;
                        $rootScope.enableInsuranceVerificationSuccess = "none";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                    },
                    error: function (data, status) {
                        if (status === 0) {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (status === 503) {
                            $scope.callServiceUnAvailableError();
                        } else if (status === 400) {
                            $scope.ErrorMessage = "There's an error with this transaction due to technical issues";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $rootScope.serverErrorMessageValidation();
                        }
                    }
                };

                LoginService.postCoPayDetails(params);
            }
        }

        $rootScope.doDeleteAccountUser = function (patientId) {
            var params = {
                accessToken: $rootScope.accessToken,
                PatientId: patientId,
                success: function (data) {
                    $scope.deleteCoUser = JSON.stringify(data, null, 2);
                    $rootScope.doGetAccountDependentDetails();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.deleteAccountUser(params);
        }

        $scope.checkEditOptionForCoUser = function (currentPatId) {
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


        $rootScope.doGetSelectedPatientProfiles = function (patientId, nextPage, seeADoc) {

            var params = {
                accessToken: $rootScope.accessToken,
                patientId: patientId,
                success: function (data) {
                    if (nextPage === 'tab.relatedusers') {
                        $rootScope.selectedRelatedDependentDetails = [];
                        $rootScope.addressInfoFetch = [];
                        angular.forEach(data.data, function (index) {

                            $rootScope.selectedRelatedDependentDetails.push({
                                'identifiers': angular.fromJson(index.identifiers),
                                'account': angular.fromJson(index.account),
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
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
                            $rootScope.addressInfoFetch.push({
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
                            });


                        });
                        $rootScope.selectedRelatedDependentDetails[0].address = ($rootScope.selectedRelatedDependentDetails[0].address != '' ? $rootScope.selectedRelatedDependentDetails[0].address : $rootScope.selectedRelatedDependentDetails[0].addressObject.addressText);
                        $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                        // $rootScope.addressInfoFetch = '';
                        // $rootScope.addressInfoFetch = $scope.selectedRelatedDependentDetailsSecond;
                        $rootScope.PatientIdentifiers = $rootScope.selectedRelatedDependentDetails[0].identifiers;
                        var date = new Date($rootScope.selectedRelatedDependentDetails[0].dob);
                        $rootScope.dependentDOB = $filter('date')(date, "yyyy-MM-dd");
                        if ($rootScope.selectedRelatedDependentDetails[0].gender === 'M') {
                            $rootScope.dependentGender = "Male";
                            $rootScope.isCheckedMaleDependent = true;
                        } else if ($rootScope.selectedRelatedDependentDetails[0].gender === 'F') {
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
                                subTitle: "<p class='fontcolor'>" + $rootScope.dependentGender + $scope.dob + $scope.relationship + "</p>",
                                templateUrl: 'templates/archiveTemplate.html',

                                buttons: [{
                                    text: 'Cancel',
                                    onTap: function (e) {
                                        return false;
                                    }
                                }, {
                                    text: '<b>Archieve</b>',
                                    type: 'button-assertive',
                                    onTap: function (e) {
                                        return true;
                                    }
                                },],
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    $rootScope.doDeleteAccountUser(patientId);
                                } else {
                                    $scope.showdnewetails = false;
                                    $scope.allval = false;
                                }


                            });
                        }

                    } else {
                        $rootScope.selectedPatientDetails = [];
                        $rootScope.addressInfoFetch = [];
                        angular.forEach(data.data, function (index) {
                            $rootScope.selectedPatientDetails.push({
                                'identifiers': angular.fromJson(index.identifiers),
                                'account': angular.fromJson(index.account),
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
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


                            $rootScope.addressInfoFetch.push({
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
                            });

                        });
                        $rootScope.selectedPatientDetails[0].address = ($rootScope.selectedPatientDetails[0].address != '' ? $rootScope.selectedPatientDetails[0].address : $rootScope.selectedPatientDetails[0].addressObject.addressText);
                        $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                        //         $scope.selectedPatientDetails[0].address = ($scope.selectedPatientDetails[0].address != '' ? $scope.selectedPatientDetails[0].address : $scope.selectedPatientDetails[0].addressObject.addressText );
                        //        $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText );
                        //$rootScope.addressInfoFetch = '';
                        //  $rootScope.addressInfoFetch = $rootScope.selectedPatientDetailsSecond;
                        $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                        $rootScope.cutaddress = $rootScope.currentPatientDetails[0].address;//surya commanded
                        //$rootScope.cutaddress = $rootScope.currentPatientDetails[0].addresses[0].addressText;
                        $rootScope.PatientIdentifiers = $rootScope.currentPatientDetails[0].identifiers;
                        $rootScope.PatidentifierCount = $scope.PatientIdentifiers.length;
                        var cutaddresses = $rootScope.cutaddress.split(",");
                        $rootScope.stateaddresses = cutaddresses[0];
                        var date = new Date($rootScope.currentPatientDetails[0].dob);
                        $rootScope.userDOBDateFormat = date;
                        $rootScope.userDOBDateForAuthorize = $filter('date')(date, "MM-dd-yyyy");

                        if (patientId === $rootScope.primaryPatientId) {
                            $rootScope.P_isAuthorized = true;
                        } else {
                            if ($rootScope.currentPatientDetails[0].account.isAuthorized === "T" || $rootScope.currentPatientDetails[0].account.isAuthorized === true || $rootScope.currentPatientDetails[0].account.isAuthorized === "Y") {
                                $rootScope.P_isAuthorized = true;
                            } else {
                                $rootScope.P_isAuthorized = false;
                            }
                        }
                        //  $rootScope.accountClinicianFooter = 'ngLoadingSpinner';

                        $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");

                        if ($rootScope.userDOB !== "" && !angular.isUndefined($rootScope.userDOB)) {
                            var ageDifMs = Date.now() - new Date($rootScope.userDOB).getTime(); // parse string to date
                            var ageDate = new Date(ageDifMs); // miliseconds from epoch
                            $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                            if ($scope.userAge === 0) {
                                if (!$rootScope.SSPage) {
                                    $rootScope.concentToTreatPreviousPage = "tab.intakeBornHistory";
                                }
                                $rootScope.userAgeForIntake = 8;
                            } else {
                                if (!$rootScope.SSPage) {
                                    $rootScope.concentToTreatPreviousPage = "tab.CurrentMedication";
                                }
                                $rootScope.userAgeForIntake = 7;
                            }
                            if (patientId !== $rootScope.primaryPatientId) {
                                if ($rootScope.userDOB.indexOf('T') === -1) {
                                    $rootScope.PatientAge = $rootScope.userDOB + "T00:00:00Z";
                                    $rootScope.SelectPatientAge = $rootScope.PatientAge;
                                }
                            }
                        }
                        if ($rootScope.currentPatientDetails[0].gender === 'M' || $rootScope.currentPatientDetails[0].gender === 'Male') {
                            $rootScope.userGender = "Male";
                            $rootScope.isCheckedMale = true;
                        } else if ($rootScope.currentPatientDetails[0].gender === 'F' || $rootScope.currentPatientDetails[0].gender === 'Female') {
                            $rootScope.userGender = "Female";
                            $rootScope.isCheckedFemale = true;
                        } else {
                            $rootScope.userGender = '';
                            $rootScope.isCheckedFemale = '';
                        }

                        if (patientId !== $rootScope.primaryPatientId) {
                            if (!angular.isUndefined($rootScope.currentPatientDetails[0].account.relationship)) {
                                $rootScope.patRelationShip = $rootScope.currentPatientDetails[0].account.relationship;
                                if ($rootScope.patRelationShip === 'Choose') {
                                    $rootScope.patRelationShip = '';
                                }
                            } else {
                                $rootScope.patRelationShip = '';
                            }
                        } else {
                            $rootScope.patRelationShip = '';
                        }
                        $rootScope.individualmobile = $rootScope.currentPatientDetails[0].mobilePhone;

                        if (data.data[0].account.patientId != $rootScope.primaryPatientId) {
                            var profileData = {};
                            profileData.firstName = data.data[0].patientName;
                            profileData.fullName = data.data[0].patientName + ' ' + data.data[0].lastName;
                            profileData.name = data.data[0].patientName + ' ' + data.data[0].lastName;
                            profileData.gender = data.data[0].gender;
                            profileData.lastName = data.data[0].lastName;
                            profileData.profileId = data.data[0].account.patientId;
                            profileData.id = data.data[0].account.patientId;
                            profileData.userId = data.data[0].personId;
                            profileData.personId = data.data[0].personId;
                            //    profileData.timeZone = data.data[0].timeZone;
                            profileData.timeZoneId = data.data[0].account.timeZoneId;
                            profileData.hasRequiredFields = true;
                            profileData.contactNumber = data.data[0].mobilePhone;
                            profileData.info = data.data[0].mobilePhone;
                            profileData.dob = data.data[0].dob;
                            profileData.isLogouted = false;

                            if (data.data[0].account.profileImage.indexOf("api") <= 0) {
                                profileData.profileImage = 'images/default-user.jpg';
                                profileData.imageSource = 'images/default-user.jpg';
                            } else {
                                profileData.profileImage = data.data[0].account.profileImage;
                                profileData.imageSource = data.data[0].account.profileImage;
                            }

                            var userProfileJsonData = JSON.stringify(profileData);
                            $window.localStorage.setItem('snap_patientprofile_session', userProfileJsonData);
                        }

                        $scope.checkEditOptionForCoUser($rootScope.currentPatientDetails[0].account.patientId);
                        if (nextPage === 'SS') {
                            $rootScope.doCheckExistingConsulatationStatus('tab.userhome');
                        } else if (nextPage === '') {
                            $state.go('tab.appoimentDetails')
                        } else if (nextPage === " ") {
                            $state.go('tab.healthinfo');
                        } else if (nextPage != 'notNow') {
                            $state.go(nextPage);
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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


        $rootScope.doGetSelectedPatientProfilesSS = function (patientId, nextPage, seeADoc) {

            var params = {
                accessToken: $rootScope.accessToken,
                patientId: patientId,
                success: function (data) {
                    if (nextPage === 'tab.relatedusers') {
                        $rootScope.selectedRelatedDependentDetails = [];
                        $rootScope.addressInfoFetch = [];
                        angular.forEach(data.data, function (index) {
                            $rootScope.selectedRelatedDependentDetails.push({
                                'identifiers': angular.fromJson(index.identifiers),
                                'account': angular.fromJson(index.account),
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
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

                            $rootScope.addressInfoFetch.push({
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
                            });
                        });
                        $rootScope.selectedRelatedDependentDetails[0].address = ($rootScope.selectedRelatedDependentDetails[0].address != '' ? $rootScope.selectedRelatedDependentDetails[0].address : $rootScope.selectedRelatedDependentDetails[0].addressObject.addressText);
                        $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                        //    $rootScope.addressInfoFetch = '';
                        //  $rootScope.addressInfoFetch = $scope.selectedRelatedDependentDetailsSecond;
                        $rootScope.PatientIdentifiers = $rootScope.selectedRelatedDependentDetails[0].identifiers;
                        var date = new Date($rootScope.selectedRelatedDependentDetails[0].dob);
                        $rootScope.dependentDOB = $filter('date')(date, "yyyy-MM-dd");
                        if ($rootScope.selectedRelatedDependentDetails[0].gender === 'M') {
                            $rootScope.dependentGender = "Male";
                            $rootScope.isCheckedMaleDependent = true;
                        } else if ($rootScope.selectedRelatedDependentDetails[0].gender === 'F') {
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
                                subTitle: "<p class='fontcolor'>" + $rootScope.dependentGender + $scope.dob + $scope.relationship + "</p>",
                                templateUrl: 'templates/archiveTemplate.html',

                                buttons: [{
                                    text: 'Cancel',
                                    onTap: function (e) {
                                        return false;
                                    }
                                }, {
                                    text: '<b>Archieve</b>',
                                    type: 'button-assertive',
                                    onTap: function (e) {
                                        return true;
                                    }
                                },],
                            });
                            confirmPopup.then(function (res) {
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
                        $rootScope.addressInfoFetch = [];
                        angular.forEach(data.data, function (index) {
                            $scope.selectedPatientDetails.push({
                                'identifiers': angular.fromJson(index.identifiers),
                                'account': angular.fromJson(index.account),
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
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

                            $rootScope.addressInfoFetch.push({
                                'address': index.address,
                                'addresses': angular.fromJson(index.addresses),
                                'addressObject': angular.fromJson(index.addressObject),
                            });

                        });
                        $scope.selectedPatientDetails[0].address = ($scope.selectedPatientDetails[0].address != '' ? $scope.selectedPatientDetails[0].address : $scope.selectedPatientDetails[0].addressObject.addressText);
                        $rootScope.addressInfoFetch[0].address = ($rootScope.addressInfoFetch[0].address != '' ? $rootScope.addressInfoFetch[0].address : $rootScope.addressInfoFetch[0].addressObject.addressText);
                        // $rootScope.addressInfoFetch = '';
                        // $rootScope.addressInfoFetch = $scope.selectedPatientDetailsSecond;
                        $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                        $rootScope.cutaddress = $rootScope.currentPatientDetails[0].address;
                        //$rootScope.cutaddress = $rootScope.currentPatientDetails[0].addresses[0].addressText;
                        $rootScope.PatientIdentifiers = $rootScope.currentPatientDetails[0].identifiers;
                        $rootScope.PatidentifierCount = $scope.PatientIdentifiers.length;
                        var cutaddresses = $rootScope.cutaddress.split(",");
                        $rootScope.stateaddresses = cutaddresses[0];
                        var date = new Date($rootScope.currentPatientDetails[0].dob);
                        $rootScope.userDOBDateFormat = date;
                        $rootScope.userDOBDateForAuthorize = $filter('date')(date, "MM-dd-yyyy");

                        if (patientId == $rootScope.primaryPatientId) {
                            $rootScope.P_isAuthorized = true;
                        } else {
                            if ($rootScope.currentPatientDetails[0].account.isAuthorized === "T" || $rootScope.currentPatientDetails[0].account.isAuthorized === true || $rootScope.currentPatientDetails[0].account.isAuthorized === "Y") {
                                $rootScope.P_isAuthorized = true;
                            } else {
                                $rootScope.P_isAuthorized = false;
                            }
                        }
                        //  $rootScope.accountClinicianFooter = 'ngLoadingSpinner';

                        $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");

                        if ($rootScope.userDOB !== "" && !angular.isUndefined($rootScope.userDOB)) {
                            var ageDifMs = Date.now() - new Date($rootScope.userDOB).getTime(); // parse string to date
                            var ageDate = new Date(ageDifMs); // miliseconds from epoch
                            $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                            if ($scope.userAge === 0) {
                                if (!$rootScope.SSPage) {
                                    $rootScope.concentToTreatPreviousPage = "tab.intakeBornHistory";
                                }
                                $rootScope.userAgeForIntake = 8;
                            } else {
                                if (!$rootScope.SSPage) {
                                    $rootScope.concentToTreatPreviousPage = "tab.CurrentMedication";
                                }
                                $rootScope.userAgeForIntake = 7;
                            }
                            if (patientId !== $rootScope.primaryPatientId) {
                                if ($rootScope.userDOB.indexOf('T') === -1) {
                                    $rootScope.PatientAge = $rootScope.userDOB + "T00:00:00Z";
                                    $rootScope.SelectPatientAge = $rootScope.PatientAge;
                                }
                            }
                        }
                        if ($rootScope.currentPatientDetails[0].gender === 'M' || $rootScope.currentPatientDetails[0].gender === 'Male') {
                            $rootScope.userGender = "Male";
                            $rootScope.isCheckedMale = true;
                        } else if ($rootScope.currentPatientDetails[0].gender === 'F' || $rootScope.currentPatientDetails[0].gender === 'Female') {
                            $rootScope.userGender = "Female";
                            $rootScope.isCheckedFemale = true;
                        } else {
                            $rootScope.userGender = '';
                            $rootScope.isCheckedFemale = '';
                        }

                        if (patientId !== $rootScope.primaryPatientId) {
                            if (!angular.isUndefined($rootScope.currentPatientDetails[0].account.relationship)) {
                                $rootScope.patRelationShip = $rootScope.currentPatientDetails[0].account.relationship;
                                if ($rootScope.patRelationShip === 'Choose') {
                                    $rootScope.patRelationShip = '';
                                }
                            } else {
                                $rootScope.patRelationShip = '';
                            }
                        } else {
                            $rootScope.patRelationShip = '';
                        }
                        $rootScope.individualmobile = $rootScope.currentPatientDetails[0].mobilePhone;

                        $scope.checkEditOptionForCoUser($rootScope.currentPatientDetails[0].account.patientId);
                        if (nextPage === 'SS') {
                            $rootScope.doCheckExistingConsulatationStatus('tab.userhome');
                        } else if (nextPage === '') {
                            $state.go('tab.appoimentDetails')
                        } else if (nextPage != 'notNow') {
                            $state.go(nextPage);
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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


        //Language Changer
        // $rootScope.alertTimedout = "Your session timed out.";
        // $rootScope.alertokay = "Ok";
        // $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
        // $rootScope.alertokay = "Ok";
        // $rootScope.alertconstarted = "Your consultation is already started on other device.";
        // $rootScope.alertconended = "Your consultation is already ended.";
        // $rootScope.alertDone = "Done";
        // $rootScope.alertconcancel = "Your consultation is cancelled.";
        // $rootScope.alertconprogress = "Your consultation is in progress on other device.";
        // $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
        // $rootScope.YESMessageProviderSearch='Yes';
        // $rootScope.NaviConfirmation = 'Confirmation:';
        // $rootScope.alertTimedout = "Your session timed out.";
        // $rootScope.alertokay = "Ok";
        // $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
        // $rootScope.alertconsultationfailed = "Failed to save consultation!";
        // $rootScope.alertMsg = "A verification email has been sent to the user.";
        // $rootScope.alertokay = "Ok";
        // $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
        // $rootScope.alertMsgvideo = "Consultation ended successfully!";
        // $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
        // $rootScope.consultEndMeg = 'Your consultation is already ended.';
        // $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
        // $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
        // $rootScope.sessAlertDone = 'Done';
        // $rootScope.alertMsgConference = "Consultation ended successfully!";
        // $rootScope.Buttonmsg = "Done";
        // $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
        // $rootScope.consultAlredComplMsg = 'Consultation already completed!';
        // $rootScope. NaviConfirmation = 'Confirmation:';
        // $rootScope. YESMessageProviderSearch='Yes';

        var localizeCurrent = $('#localize-current').text();
        console.log("lang " + localizeCurrent);
        if (localizeCurrent == "Español") {
            $rootScope.alertTimedout = "Su sesión ha expirado.";
            $rootScope.alertokay = "De acuerdo";
            $rootScope.alertupload = "No se puede cargar la foto. Por favor, inténtelo de nuevo más tarde.";
            $rootScope.alertokay = "De acuerdo";
            $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
            $rootScope.alertconended = "Su consulta ya ha finalizado.";
            $rootScope.alertDone = "Hecho";
            $rootScope.alertconcancel = "Su consulta se cancela.";
            $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
            $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
            $rootScope.YESMessageProviderSearch = 'Sí';
            $rootScope.NaviConfirmation = 'Confirmación:';
            $rootScope.alertTimedout = "Su sesión ha expirado.";
            $rootScope.alertokay = "De acuerdo";
            $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
            $rootScope.alertconsultationfailed = "Error al guardar consulta!";
            $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
            $rootScope.alertokay = "De acuerdo";
            $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
            $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
            $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
            $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
            $rootScope.consultCancelMsg = 'Su consulta se cancela.';
            $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
            $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
            $rootScope.Buttonmsg = "Listo";
            $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
            $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
            $rootScope.NaviConfirmation = 'Confirmación:';
            $rootScope.YESMessageProviderSearch = 'Sí';
        }

        else {
            $rootScope.alertTimedout = "Your session timed out."
            $rootScope.alertokay = "Ok";
            $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
            $rootScope.alertokay = "Ok";
            $rootScope.alertconstarted = "Your consultation is already started on other device.";
            $rootScope.alertconended = "Your consultation is already ended.";
            $rootScope.alertDone = "Done";
            $rootScope.alertconcancel = "Your consultation is cancelled.";
            $rootScope.alertconprogress = "Your consultation is in progress on other device.";
            $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
            $rootScope.YESMessageProviderSearch = 'Yes';
            $rootScope.NaviConfirmation = 'Confirmation:';
            $rootScope.alertTimedout = "Your session timed out.";
            $rootScope.alertokay = "Ok";
            $rootScope.alertconsultationsave = "Consultation saved successfully!";
            $rootScope.alertconsultationfailed = "Failed to save consultation!";
            $rootScope.alertMsg = "A verification email has been sent to the user.";
            $rootScope.alertokay = "Ok";
            $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
            $rootScope.alertMsgvideo = "Consultation ended successfully!";
            $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
            $rootScope.consultEndMeg = 'Your consultation is already ended.';
            $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
            $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
            $rootScope.sessAlertDone = 'Done'; $rootScope.alertMsgConference = "Consultation ended successfully!";
            $rootScope.Buttonmsg = "Done";
            $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
            $rootScope.consultAlredComplMsg = 'Consultation already completed!';
            $rootScope.NaviConfirmation = 'Confirmation:';
            $rootScope.YESMessageProviderSearch = 'Yes';
        }


        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            console.log("lang " + isLang);
            if (isLang == "Español") {
                $rootScope.alertTimedout = "Su sesión ha expirado.";
                $rootScope.alertokay = "De acuerdo";
                $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
                $rootScope.alertokay = "Ok";
                $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
                $rootScope.alertconended = "Su consulta ya ha finalizado.";
                $rootScope.alertDone = "Hecho";
                $rootScope.alertconcancel = "Su consulta se cancela.";
                $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
                $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
                $rootScope.YESMessageProviderSearch = 'Sí';
                $rootScope.NaviConfirmation = 'Confirmación:';
                $rootScope.alertTimedout = "Su sesión ha expirado.";
                $rootScope.alertokay = "De acuerdo";
                $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
                $rootScope.alertconsultationfailed = "Error al guardar consulta!";
                $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
                $rootScope.alertokay = "De acuerdo";
                $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
                $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
                $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
                $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
                $rootScope.consultCancelMsg = 'Su consulta se cancela.';
                $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
                $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
                $rootScope.Buttonmsg = "Listo";
                $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
                $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
                $rootScope.NaviConfirmation = 'Confirmación:';
                $rootScope.YESMessageProviderSearch = 'Sí';
            }
            else {
                $rootScope.alertTimedout = "Your session timed out."
                $rootScope.alertokay = "Ok";
                $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
                $rootScope.alertokay = "Ok";
                $rootScope.alertconstarted = "Your consultation is already started on other device.";
                $rootScope.alertconended = "Your consultation is already ended.";
                $rootScope.alertDone = "Done";
                $rootScope.alertconcancel = "Your consultation is cancelled.";
                $rootScope.alertconprogress = "Your consultation is in progress on other device.";
                $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
                $rootScope.YESMessageProviderSearch = 'Yes';
                $rootScope.NaviConfirmation = 'Confirmation:';
                $rootScope.alertTimedout = "Your session timed out.";
                $rootScope.alertokay = "Ok";
                $rootScope.alertconsultationsave = "Consultation saved successfully!";
                $rootScope.alertconsultationfailed = "Failed to save consultation!";
                $rootScope.alertMsg = "A verification email has been sent to the user.";
                $rootScope.alertokay = "Ok";
                $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
                $rootScope.alertMsgvideo = "Consultation ended successfully!";
                $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
                $rootScope.consultEndMeg = 'Your consultation is already ended.';
                $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
                $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
                $rootScope.sessAlertDone = 'Done';
                $rootScope.alertMsgConference = "Consultation ended successfully!";
                $rootScope.Buttonmsg = "Done";
                $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
                $rootScope.consultAlredComplMsg = 'Consultation already completed!';
                $rootScope.NaviConfirmation = 'Confirmation:';
                $rootScope.YESMessageProviderSearch = 'Yes';
            }
        });


        /*$rootScope.doGetIndividualScheduledConsulatation = function() {
            $scope.individualScheduledConsultationList = '';
            $rootScope.appointmentsPatientId = '';
            $rootScope.getIndividualScheduledList = '';
            $rootScope.individualScheduleParticipants = '';
            $rootScope.individualScheduledList = '';
            $rootScope.getIndividualScheduleDetails = '';
            $rootScope.individualScheduledConsultationList = [];
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    if (data !== "") {
                        $scope.individualScheduledConsultationList = data.data[0];
                        if ($rootScope.patientId === $rootScope.primaryPatientId) {
                            $rootScope.P_isAuthorized = true;
                        } else {
                            if (data.data[0].account.isAuthorized === "T" || data.data[0].account.isAuthorized === true || data.data[0].account.isAuthorized === "Y") {
                                $rootScope.P_isAuthorized = true;
                            } else {
                                $rootScope.P_isAuthorized = false;
                            }
                        }
                        $rootScope.accountClinicianFooter = 'ngLoadingSpinner';
                        var date = new Date($scope.individualScheduledConsultationList.dob);
                        $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");
                        $rootScope.appointmentsPatientDOB = $filter('date')(date, "yyyy-MM-dd");

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
                                if ($rootScope.userDOB.indexOf('T') === -1) {
                                    $rootScope.PatientAge = $rootScope.userDOB + "T00:00:00Z";
                                    $rootScope.SelectPatientAge = $rootScope.PatientAge;
                                }
                            }
                        }
                        if ($scope.individualScheduledConsultationList.gender === 'M' || $scope.individualScheduledConsultationList.gender === 'Male') {
                            $rootScope.userGender = "Male";
                            $rootScope.isCheckedMale = true;
                        } else if ($scope.individualScheduledConsultationList.gender === 'F' || $scope.individualScheduledConsultationList.gender === 'Female') {
                            $rootScope.userGender = "Female";
                            $rootScope.isCheckedFemale = true;
                        } else {
                            $rootScope.userGender = '';
                            $rootScope.isCheckedFemale = '';
                        }

                        if ($scope.individualScheduledConsultationList.account.patientId !== $rootScope.primaryPatientId) {
                            if (!angular.isUndefined($scope.individualScheduledConsultationList.account.relationship)) {
                                $rootScope.patRelationShip = $scope.individualScheduledConsultationList.account.relationship;
                                if ($rootScope.patRelationShip === 'Choose') {
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
                        currentDate = $scope.addMinutes(currentDate, -60);
                        $rootScope.individualmobile = $scope.individualScheduledConsultationList.mobilePhone;
                        angular.forEach($scope.individualScheduledConsultationList.appointments, function(index) {
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
                                    'scheduledDate': $scope.formatscheduleddate,
                                    'encountertypecode':index.encounterTypeCode,
                                    'clinicianId': index.clinicianId
                                });
                                angular.forEach(index.participants, function(index) {
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

                        $rootScope.individualScheduledList = $filter('filter')($filter('orderBy')($rootScope.getIndividualScheduledList,"scheduledTime"), "a");
                        $rootScope.getIndividualScheduleDetails = $rootScope.individualScheduledList;

                        var d = new Date();
                        d.setHours(d.getHours() + 12);
                        //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                        var currentUserHomeDate = d;
                        $rootScope.individualNextAppointmentDisplay = 'none';
                        $rootScope.individualwithoutAppointmentDisplay = 'block';
                        $rootScope.accountClinicianFooter = 'block';
                        $rootScope.accountStyle = "";
                        $rootScope.userAccContent = "";
                        if ($rootScope.individualScheduledList != '') {
                            var getReplaceTime = $rootScope.individualScheduledList[0].scheduledTime;
                            var currentUserHomeDate = currentUserHomeDate;


                            if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                                $rootScope.accountClinicianFooter = 'none';
                                $rootScope.individualNextAppointmentDisplay = 'block';
                                $rootScope.individualwithoutAppointmentDisplay = 'none';
                                $rootScope.accountStyle = "AppointNone" + $rootScope.deviceName;
                                $rootScope.userAccContent = "userAccContent" + $rootScope.deviceName;
                                $rootScope.appointmentsPatientId = $rootScope.patientId;
                                var beforAppointmentTime = getReplaceTime;
                                var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);


                                if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {

                                }
                            }

                            var getReplaceTime1 = $rootScope.individualScheduledList[0].scheduledTime;
                            var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
                            var currentUserHomeDate = currentUserHomeDate;
                            if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {

                                $rootScope.time = new Date(getReplaceTime).getTime();

                                $timeout(function() {
                                    //document.getElementsByTagName('timer')[0].stop();
                                    document.getElementsByTagName('timer')[0].start();
                                }, 10);

                                $scope.$on('timer-tick', function(event, args) {
                                    if (args.days === 0) {
                                        $rootScope.hourDisplay = 'initial';
                                        $rootScope.daysDisplay = 'none';
                                        $rootScope.dayDisplay = 'none';
                                    } else if (args.days === 1) {
                                        $rootScope.daysDisplay = 'none';
                                        $rootScope.hourDisplay = 'none';
                                        $rootScope.dayDisplay = 'initial';
                                    } else if (args.days > 1) {
                                        $rootScope.daysDisplay = 'initial';
                                        $rootScope.hourDisplay = 'none';
                                        $rootScope.dayDisplay = 'none';
                                    }
                                  //  if (args.millis < 600) {
                                    if (args.minutes === 0 && args.seconds === 1) {
                                        $rootScope.timeNew = 'none';
                                        $rootScope.timeNew1 = 'block';
                                        $rootScope.timerCOlor = '#a2d28a';
                                        $('.AvailableIn').hide();
                                        $('.enterAppoinment').show();
                                  //} else if (args.millis > 600) {
                                    } else if (args.minutes >= 0 && args.seconds > 0) {
                                        $rootScope.timeNew = 'block';
                                        $rootScope.timeNew1 = 'none';
                                        $rootScope.timerCOlor = '#FDD8C5';
                                        $('.AvailableIn').show();
                                        $('.enterAppoinment').hide();
                                    }
                                });
                                $rootScope.time = new Date(getReplaceTime).getTime();
                                var d = new Date();
                                //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                                var currentUserHomeDate = d;
                                if (getReplaceTime < currentUserHomeDate) {
                                    $rootScope.timerCOlor = '#a2d28a';
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
                  } else if(status === 503) {
                    $scope.callServiceUnAvailableError();
                  } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getIndividualScheduledConsulatation(params);
        }*/
        $rootScope.doGetIndividualScheduledConsulatation = function () {
            $scope.individualScheduledConsultationList = '';
            $rootScope.appointmentsPatientId = '';
            $rootScope.getIndividualScheduledList = '';
            $rootScope.individualScheduledList = '';
            $rootScope.individualNextAppointmentDisplay = 'none';

            $('.accoTitle-IOS').attr('style', 'margin-top: 4px !important');
            /*$('.subheaderheightOne').attr('style', 'height: 100px !important');
            $('.userAccHeaderTitle').attr('style', 'margin-top: -43px !important');
            $('.userlistAccountHome').attr('style', 'margin-top: -43px !important');
            //var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if($rootScope.is_iPadDeviceWidth >= 550)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 55px !important');
            else if($rootScope.is_iPadDeviceWidth <= 320)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0px !important');
            else
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 36px !important');*/

            $rootScope.individualwithoutAppointmentDisplay = 'block';
            $rootScope.accountClinicianFooter = 'block';
            $rootScope.accountStyle = "";
            $rootScope.userAccContent = "";
            $rootScope.getIndividualScheduleDetails = [];
            $rootScope.individualScheduledConsultationList = [];
            $rootScope.getIndividualInQueueScheduleDetails = [];
            $rootScope.getIndividualPatScheduleDetails = [];
            $rootScope.primaryAppointDetails = [];
            $rootScope.getAllInQueueScheduleDetails = [];
            $rootScope.getAllPatScheduleDetails = [];

            $('.subheaderheightOne').attr('style', 'height: 115px !important');
            $('.userAccHeaderTitle').attr('style', 'margin-top: -43px !important');
            $('.userlistAccountHome').attr('style', 'margin-top: -43px !important');
            //var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            //if($rootScope.is_iPadDeviceWidth >= 550)
            //  $('.userlistAccountHome-ios5').attr('style', 'margin-top: 55px !important');
            if ($rootScope.is_iPadDeviceWidth <= 320) {
                $('.UserAccountProfileImage').attr('style', 'margin-top: 9% !important');
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 2% !important');
                $('.subheaderheightOne').attr('style', 'height: 100px !important');
                $('.UserAccountProfileImage .patProfileImage').attr('style', 'margin-top: 10% !important');
            }
            else if ($rootScope.is_iPadDeviceWidth >= 321 && $rootScope.is_iPadDeviceWidth <= 365)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 15% !important');
            else if ($rootScope.is_iPadDeviceWidth >= 366 && $rootScope.is_iPadDeviceWidth <= 375)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
            else if ($rootScope.is_iPadDeviceWidth == 412)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 15% !important');
            else if ($rootScope.is_iPadDeviceWidth == 414)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
            else if ($rootScope.is_iPadDeviceWidth >= 376 && $rootScope.is_iPadDeviceWidth <= 414)//iphone 7+
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
            else if ($rootScope.is_iPadDeviceWidth >= 415 && $rootScope.is_iPadDeviceWidth <= 767)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 25% !important');
            else if ($rootScope.is_iPadDeviceWidth >= 768 && $rootScope.is_iPadDeviceWidth <= 1024)
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: -20% !important');
            else
                $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');



            $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");
            if ($rootScope.scheduledList != '') {
                $rootScope.primaryAppointDetails = $rootScope.scheduledList.filter(function (r) { var show = r.patientId == $rootScope.primaryPatientId; return show; });
                $rootScope.getAllInQueueScheduleDetails = $rootScope.scheduledList.filter(function (r) { var show = r.appointmentStatusCode == 'Waiting'; return show; });
                $rootScope.getAllPatScheduleDetails = $rootScope.scheduledList.filter(function (r) { var show = r.appointmentStatusCode != 'Waiting'; return show; });

                $rootScope.getIndividualScheduleDetails = $rootScope.scheduledList.filter(function (r) { var show = r.patientId == $rootScope.patientId; return show; });
                $rootScope.getIndividualInQueueScheduleDetails = $rootScope.getIndividualScheduleDetails.filter(function (r) { var show = r.appointmentStatusCode == 'Waiting'; return show; });
                $rootScope.getIndividualPatScheduleDetails = $rootScope.getIndividualScheduleDetails.filter(function (r) { var show = r.appointmentStatusCode != 'Waiting'; return show; });
                var d = new Date();
                d.setHours(d.getHours() + 12);
                //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                var currentUserHomeDate = d;
                $rootScope.individualNextAppointmentDisplay = 'none';
                $rootScope.individualwithoutAppointmentDisplay = 'block';
                $rootScope.accountClinicianFooter = 'block';
                $rootScope.accountStyle = "";
                $rootScope.userAccContent = "";
                $('.subheaderheightOne').attr('style', 'height: 115px !important');
                $('.userAccHeaderTitle').attr('style', 'margin-top: -43px !important');
                $('.userlistAccountHome').attr('style', 'margin-top: -43px !important');

                if ($rootScope.is_iPadDeviceWidth <= 320) {
                    $('.UserAccountProfileImage').attr('style', 'margin-top: 9% !important');
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 2% !important');
                    $('.subheaderheightOne').attr('style', 'height: 100px !important');
                    $('.UserAccountProfileImage .patProfileImage').attr('style', 'margin-top: 10% !important');
                }
                else if ($rootScope.is_iPadDeviceWidth >= 321 && $rootScope.is_iPadDeviceWidth <= 365)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 15% !important');
                else if ($rootScope.is_iPadDeviceWidth >= 366 && $rootScope.is_iPadDeviceWidth <= 375)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
                else if ($rootScope.is_iPadDeviceWidth == 412)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 15% !important');
                else if ($rootScope.is_iPadDeviceWidth == 414)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
                else if ($rootScope.is_iPadDeviceWidth >= 376 && $rootScope.is_iPadDeviceWidth <= 414)//iphone 7+
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
                else if ($rootScope.is_iPadDeviceWidth >= 415 && $rootScope.is_iPadDeviceWidth <= 767)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 25% !important');
                else if ($rootScope.is_iPadDeviceWidth >= 768 && $rootScope.is_iPadDeviceWidth <= 1024)
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: -20% !important');
                else
                    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');


                if ($rootScope.getIndividualScheduleDetails != '') {
                    //  if($rootScope.getIndividualPatScheduleDetails != '') {
                    var getReplaceTime = $rootScope.getIndividualScheduleDetails[0].scheduledTime;
                    /*  } else {
                          var getReplaceTime = $rootScope.getIndividualScheduleDetails[0].scheduledTime;
                      }*/
                    var currentUserHomeDate = currentUserHomeDate;

                    if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                        $rootScope.accountClinicianFooter = 'none';
                        $rootScope.individualNextAppointmentDisplay = 'block';
                        $rootScope.individualwithoutAppointmentDisplay = 'none';
                        $rootScope.accountStyle = "AppointNone" + $rootScope.deviceName;
                        $rootScope.userAccContent = "userAccContent" + $rootScope.deviceName;
                        $rootScope.appointmentsPatientId = $rootScope.patientId;

                        $('.subheaderheightOne').attr('style', 'height: 160px !important');
                        $('.userAccHeaderTitle').attr('style', 'margin-top: 0px !important');
                        $('.userlistAccountHome').attr('style', 'margin-top: 0px !important');
                        console.log('$rootScope.is_iPadDeviceWidth ' + $rootScope.is_iPadDeviceWidth);
                        if ($rootScope.is_iPadDeviceWidth <= 320) {
                            $('.UserAccountProfileImage').attr('style', 'margin-top: 0% !important');
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 18% !important');
                            $('.subheaderheightOne').attr('style', 'height: 150px !important');
                            $('.UserAccountProfileImage .patProfileImage').attr('style', 'margin-top: 45% !important');
                            $('.UserAccountProfileImage img').attr('style', 'margin-top: 45% !important');

                        }
                        else if ($rootScope.is_iPadDeviceWidth >= 321 && $rootScope.is_iPadDeviceWidth <= 365)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 25% !important');
                        else if ($rootScope.is_iPadDeviceWidth >= 366 && $rootScope.is_iPadDeviceWidth <= 375)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
                        else if ($rootScope.is_iPadDeviceWidth == 412)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 25% !important');
                        else if ($rootScope.is_iPadDeviceWidth == 414)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');
                        else if ($rootScope.is_iPadDeviceWidth >= 376 && $rootScope.is_iPadDeviceWidth <= 414)//iphone 7+
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 25% !important');
                        else if ($rootScope.is_iPadDeviceWidth >= 415 && $rootScope.is_iPadDeviceWidth <= 767)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: 35% !important');
                        else if ($rootScope.is_iPadDeviceWidth >= 768 && $rootScope.is_iPadDeviceWidth <= 1024)
                            $('.userlistAccountHome-ios5').attr('style', 'margin-top: -20% !important');
                        // else
                        //    $('.userlistAccountHome-ios5').attr('style', 'margin-top: 0% !important');


                        /*  var beforAppointmentTime = getReplaceTime;
                          var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);

                          if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {

                          }*/
                    }


                    if ($rootScope.getIndividualPatScheduleDetails != '') {
                        var getReplaceTime1 = $rootScope.getIndividualPatScheduleDetails[0].scheduledTime;
                    } else {
                        var getReplaceTime1 = $rootScope.getIndividualScheduleDetails[0].scheduledTime;
                    }
                    var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
                    var currentUserHomeDate = currentUserHomeDate;
                    if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {

                        $scope.$broadcast('timer-stop');
                        $rootScope.time = new Date(getReplaceTime).getTime();

                        /*    $timeout(function() {
                                document.getElementsByTagName('timer')[0].stop();
                                document.getElementsByTagName('timer')[0].start();
                            }, 10);*/

                        $scope.$on('timer-tick', function (event, args) {
                            if (args.days === 0) {
                                $rootScope.hourDisplay = 'initial';
                                $rootScope.daysDisplay = 'none';
                                $rootScope.dayDisplay = 'none';
                            } else if (args.days === 1) {
                                $rootScope.daysDisplay = 'none';
                                $rootScope.hourDisplay = 'none';
                                $rootScope.dayDisplay = 'initial';
                            } else if (args.days > 1) {
                                $rootScope.daysDisplay = 'initial';
                                $rootScope.hourDisplay = 'none';
                                $rootScope.dayDisplay = 'none';
                            }
                            //  if (args.millis < 600) {
                            if (args.minutes === 0 && args.seconds === 1) {
                                $rootScope.timeNew = 'none';
                                $rootScope.timeNew1 = 'block';
                                $rootScope.timerCOlor = '#a2d28a';
                                $('.AvailableIn').hide();
                                $('.enterAppoinment').show();
                                //} else if (args.millis > 600) {
                            } else if (args.minutes >= 0 && args.seconds > 0) {
                                $rootScope.timeNew = 'block';
                                $rootScope.timeNew1 = 'none';
                                $rootScope.timerCOlor = '#FDD8C5';
                                $('.AvailableIn').show();
                                $('.enterAppoinment').hide();
                            }
                        });
                        $rootScope.time = new Date(getReplaceTime).getTime();
                        var d = new Date();
                        //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                        var currentUserHomeDate = d;
                        if (getReplaceTime < currentUserHomeDate) {
                            $rootScope.timerCOlor = '#a2d28a';
                            $('.AvailableIn').hide();
                            $('.enterAppoinment').show();
                        }
                    } else if ((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
                        $rootScope.timerCOlor = 'transparent';
                    }
                }
            }
        }


        $rootScope.doGetonDemandAvailability = function () {
            $rootScope.providerAvailability = '';
            $rootScope.onDemandAvailability = '';
            $rootScope.providerOnDemandEnabled = '';
            var params = {
                accessToken: $rootScope.accessToken,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {

                    angular.forEach(data.data[0].familyMembers, function (index) {
                        if (index.patientId == $rootScope.checkpatid || typeof $rootScope.checkpatid === 'undefined') {
                            $rootScope.providerAvailability = index.providerAvailable;
                        }
                    });

                    $rootScope.getNextAvailProvTime = CustomCalendar.getLocalTime1(data.data[0].startTime);
                    $rootScope.getNextAvailProvTime1 = data.data[0].startTime;

                    $rootScope.onDemandAvailability = data.data[0].onDemandAvailabilityBlockCount;
                    $rootScope.providerOnDemandEnabled = data.data[0].providerOnDemandEnabled;
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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

        $rootScope.doGetLocations = function () {
            $rootScope.listOfOrganization = '';
            $rootScope.listOfLocation = '';
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.listOfOrganization = [];
                    $rootScope.listOfLocation = [];
                    if (data.data[0] !== '') {
                        angular.forEach(data.data, function (index) {
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
                            angular.forEach(index.locations, function (index) {
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
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfLocationOrganization(params);
        }

        $scope.loction = {};
        $rootScope.doGetCountryLocations = function () {
            $rootScope.listOfCountries = '';
            $rootScope.listOfCountry = '';

            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.listOfCountries = [];
                    $rootScope.listOfCountry = [];

                    if (data.data[0] !== '') {
                        angular.forEach(data.data, function (index) {
                            $rootScope.listOfCountries.push({
                                'conditionTypeId': index.conditionTypeId,
                                'description': index.description,
                                'createdDate': index.createdDate,
                                'id': index.id,
                                'country': angular.fromJson(index.countries)

                            });
                            angular.forEach(index.countries, function (index) {
                                $rootScope.listOfCountry.push({
                                    'country': index.country,
                                    'countryCode': index.countryCode,
                                    'region': angular.fromJson(index.regions)
                                });
                            });

                        });
                    }

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfCountryLocation(params);
        }


        $scope.$watch('loction.loccountry', function (cutLoc) {
            $rootScope.listOfSelectstate = [];
            if (cutLoc) {
                $rootScope.listOfLocState = $filter('filter')($rootScope.listOfCountry, {
                    country: cutLoc
                });
                if ($rootScope.listOfLocState[0].region == undefined) {
                    $scope.currentstateview = false;
                }
                angular.forEach($rootScope.listOfLocState[0].region, function (index) {
                    $rootScope.listOfSelectstate.push({
                        'region': index.region,
                        'regionCode': index.regionCode
                    });
                    $scope.currentstateview = true;
                });
            } else {
                $rootScope.listOfLocState = "";
            }

        });

        $scope.updatelocation = function () {

            //  $rootScope.upcountry=$( "#country option:selected" ).text();
            $rootScope.upcountry = $rootScope.listOfLocState[0].countryCode;
            $rootScope.upstate = $("#state option:selected").val();
            $rootScope.statereg = $rootScope.listOfLocState;
            if ($rootScope.upcountry == "Select your Country" && $rootScope.upstate == "Choose state" && $rootScope.listOfLocState == "") {
                $scope.ErrorMessage = "Please select country";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.upcountry != "" && $rootScope.statereg[0].region != undefined && $rootScope.upstate == "Choose state") {
                $scope.ErrorMessage = "Please select state";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $scope.updateCurrentLocation();
            }
        }


        $scope.updateCurrentLocation = function () {
            if ($rootScope.upcountry != "" && $rootScope.upstate != "Choose state") {
                $scope.countryCode = $rootScope.upcountry;
                $scope.countryRegion = $rootScope.upstate;
            } else if ($rootScope.upcountry != "" && $rootScope.upstate == "Choose state") {
                $scope.countryCode = $rootScope.upcountry;
                $scope.countryRegion = '';
            }
            var params = {
                accessToken: $rootScope.accessToken,
                countrystate: $scope.countryCode,
                countryRegion: $scope.countryRegion,
                patientID: $rootScope.primaryPatientId,
                //state:  $scope.upstate,

                success: function (data, status) {
                    history.back();
                },
                error: function (data, status) {
                    //alert("fail");
                }
            };
            LoginService.putListOfCountryLocation(params);
        }

        $rootScope.passededconsultants = function () {

            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                statusId: 72,
                success: function (data, status) {
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
                        $rootScope.encountercode = $rootScope.Passedconsultations.encounterTypeCode;


                    }


                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfPassedConsultations(params);

        }
        $rootScope.passededconsultantsForCoUser = function (Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {

            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                statusId: 72,
                success: function (data, status) {
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
                        if ($rootScope.getCoUserAunthent === 'Authorized') {
                            if ($rootScope.patientSearchKey !== '' || typeof $rootScope.patientSearchKey !== "undefined") {
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
                            if ($window.localStorage.getItem("hosNameforCard") === $rootScope.hospitalName) {
                                $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
                                $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
                                $rootScope.userDefaultPaymentLogo = $window.localStorage.getItem("CardLogo" + $rootScope.UserEmail);
                            } else {
                                $rootScope.userDefaultPaymentProfile = null;
                            }
                            $rootScope.locationdet = Pat_locat;
                            $rootScope.PatientImageSelectUser = P_img;
                            $rootScope.PatientFirstName = P_Fname;
                            $rootScope.PatientLastName = P_Lname;
                            $rootScope.PatientAge = P_Age;
                            $rootScope.SelectPatientAge = $rootScope.PatientAge;
                            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
                            $scope.doGetConutriesList();
                            $rootScope.doGetCreditDetails();
                            $rootScope.doGetLocations();
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                            $rootScope.doGetonDemandAvailability();
                            $rootScope.doGetListOfCoUsers();
                            $scope.getHealthHistoryDetails();
                            if (!$rootScope.P_isAuthorized) {
                                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                                $rootScope.SubmitCardValidation($scope.ErrorMessage);
                            }
                            if ($rootScope.P_isAuthorized === undefined) {
                                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                                $rootScope.SubmitCardValidation($scope.ErrorMessage);
                            }
                            if (clickEvent === "patientClick") {
                                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');
                                var confirmPopup = $ionicPopup.confirm({

                                    title: "<div class='locationtitle localizejs'> Confirm Current Location </div> ",

                                    templateUrl: 'templates/currentLocation.html',
                                    cssClass: 'locpopup',

                                    buttons: [{
                                        text: 'No',
                                        onTap: function (e) {
                                            $scope.showAlert();
                                            return true;
                                        }
                                    }, {
                                        text: '<b class="localizejs">Yes</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {

                                        }
                                    },],
                                });
                                confirmPopup.then(function (res) {
                                    if (res) {

                                    } else {
                                        $rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                                    }
                                });
                            } else if (clickEvent === "sideMenuClick") {
                                var patid = $rootScope.patientId;
                                var primarypatid = $rootScope.primaryPatientId;
                                if (primarypatid == patid) {
                                    $rootScope.viewmyhealthDisplay = 'block';
                                    $rootScope.viewhealthDisplay = 'none';
                                } else {
                                    $rootScope.viewmyhealthDisplay = 'none';
                                    $rootScope.viewhealthDisplay = 'block';
                                }
                                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
                            } else if (clickEvent === "sideMenuClickApoointments") {
                                var patid = $rootScope.patientId;
                                var primarypatid = $rootScope.primaryPatientId;
                                if (primarypatid == patid) {
                                    $rootScope.viewmyhealthDisplay = 'block';
                                    $rootScope.viewhealthDisplay = 'none';
                                } else {
                                    $rootScope.viewmyhealthDisplay = 'none';
                                    $rootScope.viewhealthDisplay = 'block';
                                }
                                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
                            } else if (clickEvent === "tab.patientConcerns") {
                                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
                            } else {
                                $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
                            }
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfPassedConsultations(params);

        }




        $rootScope.doGetListOfCoUsers = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                authorizedOnly: true,
                success: function (data) {
                    if (data.data !== '') {
                        $rootScope.listOfCoUserDetails = [];
                        angular.forEach(data.data, function (index) {
                            if (index.patientId !== $rootScope.primaryPatientId && index.isDependent != true) {
                                var getCoUserRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                    codeId: index.relationCodeId
                                })
                                if (getCoUserRelationShip.length !== 0) {
                                    var relationShip = getCoUserRelationShip[0].text;
                                } else {
                                    var relationShip = '';
                                }
                                var dob = ageFilter.getDateFilter(index.dob);
                                if (index.gender === 'M') {
                                    var gender = "Male";
                                } else if (index.gender === 'F') {
                                    var gender = "Female";
                                }

                                $scope.coUserImagePath = index.imagePath;

                                $rootScope.listOfCoUserDetails.push({
                                    'address': index.address,
                                    'bloodType': index.bloodType,
                                    'description': index.description,
                                    'dob': index.dob,
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
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
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

        $rootScope.doGetCreditDetails = function () {

            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data !== '') {
                        $rootScope.listOfCreditDetails = [];
                        angular.forEach(data.data, function (index) {
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
                            if ($rootScope.appointmentwaivefee == true) {
                                $rootScope.getReceiptCreditCount = $rootScope.getIndividualPatientCreditCount;
                            } else {
                                $rootScope.getReceiptCreditCount = $rootScope.getIndividualPatientCreditCount - 1; $rootScope.getReceiptCreditCount = $rootScope.getIndividualPatientCreditCount - 1;
                            }

                        } else {
                            $rootScope.getIndividualPatientCreditCount = 0;
                        }
                    } else {
                        $rootScope.listOfCreditDetails = '';
                        $rootScope.getIndividualPatientCreditCount = 0;
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.GetCreditDetails(params);
        }

        $scope.chkSearchProviderPage = function (currentPage) {
            $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
            $scope.doGetConutriesList();
            $scope.getTimezoneList();
            $rootScope.frontPage = 'tab.' + currentPage;
            $rootScope.backProviderSearchKey = '';
            if (currentPage === "loginSingle") {
                $rootScope.regStep1 = {};
                $rootScope.selectedSearchProviderList = [];
                $rootScope.selectedSearchProviderList.push({
                    'brandName': $rootScope.Hospital,
                });
                $rootScope.selectedSearchProviderList = $rootScope.selectedSearchProviderList[0];
                $state.go('tab.registerStep1');
            } else {
                $state.go('tab.searchprovider');
            }
        }

        function chkCameraAndMicroPhoneSettings(getCurrentFuncName) {
            $window.localStorage.setItem('FlagForCheckingFirstLogin', '');
            cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                if (status === '') {
                    $scope.settingsMessage = "This app requires microphone access in order to conduct audio/video consultations.";
                    $scope.titeName = 'Would Like to Access the Microphone';
                    onMicroPhoneAuthorizationDenied();
                } else if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                    cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
                        if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                            $scope.settingsMessage = "This app requires camera and microphone access in order to conduct audio/video consultations.";
                            $scope.titeName = 'Would Like to Access the Camera and Microphone';
                            onMicroPhoneAuthorizationDenied();
                        } else {
                            $scope.settingsMessage = "This app requires camera access in order to conduct audio/video consultations.";
                            $scope.titeName = 'Would Like to Access the Camera';
                            onMicroPhoneAuthorizationDenied();
                        }
                    })
                } else {

                    if (getCurrentFuncName === 'GeneralLoginFun') {
                        $scope.GetLoginFunctionDetails();
                    } else if (getCurrentFuncName === 'SingleFuncLogin') {
                        $scope.GetSingleLoginDetailsFOrCheckingMic();
                    } else if (getCurrentFuncName === "SearchProvidePage") {
                        $scope.chkSearchProviderPage($rootScope.LogCurrentPage);
                    }
                    cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status) {
                        if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                            $scope.titeName = 'Would Like to Access the Microphone';
                            $scope.settingsMessage = "This app requires microphone access in order to conduct audio/video consultations.";
                            onMicroPhoneAuthorizationDenied();
                        } else { //authorized
                            $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                            if (getCurrentFuncName === 'GeneralLoginFun') {
                                $scope.GetLoginFunctionDetails();
                            } else if (getCurrentFuncName === 'SingleFuncLogin') {
                                $scope.GetSingleLoginDetailsFOrCheckingMic();
                            } else if(getCurrentFuncName === "SearchProvidePage") {
                                  $scope.chkSearchProviderPage($rootScope.LogCurrentPage);
                            }
                        }
                    }, function() {

                    })
                }
            }, function () {

            })
        }

        function onMicroPhoneAuthorizationDenied() {
            if (!$rootScope.isNotificationDisplayed) {
                $rootScope.isNotificationDisplayed = true;
                $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                navigator.notification.alert(
                    $scope.settingsMessage,
                    function (i) {
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

        $scope.getHealthHistoryDetails = function () {
            $rootScope.PatientMedicalProfileList = [];
            $rootScope.patvalues = '';
            $rootScope.patientmedications = '';
            $rootScope.CurMedicationCount = '';
            $rootScope.patientmedicationsallergies = '';
            $rootScope.CurAllergiesCount = '';
            $rootScope.patientmedicalConditions = '';
            $rootScope.ChronicCount = '';
            $rootScope.patientmedicalsurgeries = '';
            $rootScope.patientMedicalSurgeriesCount = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.healthHistoryInformation = [];
                    $rootScope.PatientMedicalProfileList = data.data;
                    $rootScope.patvalues = $rootScope.PatientMedicalProfileList;
                    $rootScope.patientmedications = $rootScope.PatientMedicalProfileList[0].medications;
                    $rootScope.CurMedicationCount = $scope.patientmedications.length;
                    $rootScope.patientmedicationsallergies = $rootScope.PatientMedicalProfileList[0].medicationAllergies;
                    $rootScope.CurAllergiesCount = $scope.patientmedicationsallergies.length;
                    $rootScope.patientmedicalConditions = $rootScope.PatientMedicalProfileList[0].medicalConditions;
                    $rootScope.ChronicCount = $scope.patientmedicalConditions.length;
                    $rootScope.patientmedicalsurgeries = $rootScope.PatientMedicalProfileList[0].surgeries;
                    $rootScope.patientMedicalSurgeriesCount = $rootScope.patientmedicalsurgeries.length;
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    }
                }
            };
            LoginService.getPatientMedicalProfile(params);
        }

        $rootScope.GoToPatientDetailsFromRelatedUsers = function (Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {

            $rootScope.coUserAuthorization = $rootScope.patientId;
            $rootScope.patientId = P_Id;
            $rootScope.getCoUserAunthent = '';
            $rootScope.passededconsultantsForCoUser(Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent);
        }

        $rootScope.GoToPatientDetails = function (Pat_locat, P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Id, P_isAuthorized, clickEvent) {
           
            $rootScope.checkpatid = P_Id;
            if ($rootScope.patientSearchKey !== '' && typeof $rootScope.patientSearchKey !== "undefined") {
                //Removing main patient from the dependant list. If the first depenedant name and patient names are same, removing it. This needs to be changed when actual API given.
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
            if ($window.localStorage.getItem("hosNameforCard") === $rootScope.hospitalName) {
                $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
                $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
                $rootScope.userDefaultPaymentLogo = $window.localStorage.getItem("CardLogo" + $rootScope.UserEmail);
            } else {
                $rootScope.userDefaultPaymentProfile = null;
            }
            $rootScope.locationdet = Pat_locat;
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.SelectPatientAge = $rootScope.PatientAge;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $rootScope.patientId = P_Id;
            $scope.doGetConutriesList();
            $rootScope.doGetCreditDetails();
            $rootScope.passededconsultants();
            $rootScope.doGetLocations();
            //  $rootScope.doGetScheduledNowPhoneConsulatation();
            $rootScope.doGetonDemandAvailability();
            $rootScope.doGetListOfCoUsers();
            $scope.getHealthHistoryDetails();
            $rootScope.P_isAuthorized = P_isAuthorized;
            if (!$rootScope.P_isAuthorized) {
                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                $rootScope.SubmitCardValidation($scope.ErrorMessage);
            }
            if ($rootScope.P_isAuthorized == undefined) {
                $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName + '!';
                $rootScope.SubmitCardValidation($scope.ErrorMessage);
            }
            if (clickEvent === "patientClick") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');

            } else if (clickEvent === "sideMenuClick") {
                var patid = $rootScope.patientId;
                var primarypatid = $rootScope.primaryPatientId;
                if (primarypatid === patid) {
                    $rootScope.viewmyhealthDisplay = 'block';
                    $rootScope.viewhealthDisplay = 'none';
                } else {
                    $rootScope.viewmyhealthDisplay = 'none';
                    $rootScope.viewhealthDisplay = 'block';
                }
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
            } else if (clickEvent === "sideMenuClickApoointments") {
                var patid = $rootScope.patientId;
                var primarypatid = $rootScope.primaryPatientId;
                if (primarypatid === patid) {
                    $rootScope.viewmyhealthDisplay = 'block';
                    $rootScope.viewhealthDisplay = 'none';
                } else {
                    $rootScope.viewmyhealthDisplay = 'none';
                    $rootScope.viewhealthDisplay = 'block';
                }
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
            } else if (clickEvent === "tab.patientConcerns") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
            } else {
                $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
            }
        }
        $rootScope.GoUserPatientDetails = function (Pat_locat, P_Id, clickEvent) {
            if ($rootScope.patientSearchKey !== '' || typeof $rootScope.patientSearchKey !== "undefined") {
                if ($rootScope.RelatedPatientProfiles.length !== 0 && $rootScope.RelatedPatientProfiles !== '') {
                    if ($rootScope.primaryPatientFullName === $rootScope.RelatedPatientProfiles[0].patientName) {
                        $rootScope.RelatedPatientProfiles.shift();

                    }
                }

                if ($rootScope.P_Id != P_Id) {
                    $rootScope.providerName = '';
                    $rootScope.PolicyNo = '';
                    $rootScope.healthPlanID = '';
                    $rootScope.NewHealth = '';
                }

                $rootScope.P_Id = P_Id;

            }

            $rootScope.updatedPatientImagePath = '';
            $rootScope.newDependentImagePath = '';
            $rootScope.appointmentDisplay = '';
            if ($window.localStorage.getItem("hosNameforCard") === $rootScope.hospitalName) {
                $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
                $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
                $rootScope.userDefaultPaymentLogo = $window.localStorage.getItem("CardLogo" + $rootScope.UserEmail);
            } else {
                $rootScope.userDefaultPaymentProfile = null;
            }
            $rootScope.locationdet = Pat_locat;
            $rootScope.patientId = P_Id;

            if (clickEvent === "patientClick") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.userAccount', '');

            } else if (clickEvent === "sideMenuClick") {
                var patid = $rootScope.patientId;
                var primarypatid = $rootScope.primaryPatientId;
                if (primarypatid === patid) {
                    $rootScope.viewmyhealthDisplay = 'block';
                    $rootScope.viewhealthDisplay = 'none';
                } else {
                    $rootScope.viewmyhealthDisplay = 'none';
                    $rootScope.viewhealthDisplay = 'block';
                }
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.healthinfo', '');
            } else if (clickEvent === "sideMenuClickApoointments") {
                var patid = $rootScope.patientId;
                var primarypatid = $rootScope.primaryPatientId;
                if (primarypatid === patid) {
                    $rootScope.viewmyhealthDisplay = 'block';
                    $rootScope.viewhealthDisplay = 'none';
                } else {
                    $rootScope.viewmyhealthDisplay = 'none';
                    $rootScope.viewhealthDisplay = 'block';
                }
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.appointmentpatientdetails', '');
            } else if (clickEvent === "tab.patientConcerns") {
                $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.patientConcerns', '');
            } else {
                $rootScope.doGetSelectedPatientProfiles(P_Id, clickEvent, '');
            }

        }

        $scope.doToPatientCalendar = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $state.go('tab.patientCalendar');
        }

        $scope.doToAppoimentDetails = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $state.go('tab.appoimentDetails');
        }

        $scope.enterWaitingRoom = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $scope.doGetWaitingRoom();
        }
        $scope.goBackFromConcernToTreat = function () {
            /*if($stateParams.getPage === 'CTT') {
               $state.go('tab.userhome');
             } else {*/
            var ageDifMs = Date.now() - new Date($rootScope.userDOB).getTime(); // parse string to date
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            if ($scope.userAge == 0) {
                $state.go("tab.intakeBornHistory");
            } else {
                $state.go($rootScope.concentToTreatPreviousPage);
            }

            //}
        }

        $scope.doGetOndemandAppointPaymentStatus = function () {
            $rootScope.isPaidOnDemand = '';
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.isPaidOnDemand = data.isPaid;
                    $scope.$root.$broadcast("callDoPutConsultationSave");
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getAppointPaymentStatus(params);
        }

        $scope.doPutScheduledConsultationSave = function () {
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                ConsultationSaveData: $rootScope.scheduledConsultSave,
                success: function (data) {
                    console.log($rootScope.scheduledConsultSave);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.putConsultationSave(params);
        }



        $scope.GoToConsultCharge = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
            
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
            $rootScope.editplan = "none";
            if ($rootScope.appointmentsPage !== true) {
                $rootScope.appointmentwaivefee = '';
                if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') {
                    $rootScope.healthPlanPage = "none";
                    $rootScope.consultChargeNoPlanPage = "block";
                } else {
                    $rootScope.consultChargeNoPlanPage = "none";
                    $rootScope.healthPlanPage = "block";
                }
                $scope.doGetOndemandAppointPaymentStatus();
            } else if ($rootScope.appointmentsPage === true) {
                if ($rootScope.schedulePatAge === 0) {
                    $scope.doPutScheduledConsultationSave();
                }
                /*  if($rootScope.copayAmount === 0) {
                        $rootScope.applyPlanMode = "none";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.verifyPlanMode = "block";
                        $rootScope.consultChargeNoPlanPage = "none";
                        $rootScope.healthPlanPage = "block";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.providerName = "";
                        $rootScope.PolicyNo = "";
                        $scope.doGetPatientHealthPlansList();
                  } else*/
                if ($rootScope.appointmentwaivefee == true) {
                    $rootScope.doGetWaiveFeeHospitalInformation();
                    //  } else if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' &&  $rootScope.appointmentwaivefee === false && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.isPaid !== true && $rootScope.copayAmount != 0) {
                } else if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' && $rootScope.appointmentwaivefee === false && $rootScope.isPaid !== true && $rootScope.copayAmount != 0) {
                    $rootScope.doPostDepitDetails();
                    //} else if($rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.paymentMode === 'on' &&  $rootScope.appointmentwaivefee === true && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.copayAmount != 0){
                } else if ($rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.paymentMode === 'on' && $rootScope.appointmentwaivefee === true && $rootScope.copayAmount != 0) {
                    $state.go('tab.receipt');
                    $rootScope.enablePaymentSuccess = "none";
                    $rootScope.enableInsuranceVerificationSuccess = "none";
                    $rootScope.enableCreditVerification = "none";
                    $rootScope.enableWaivefeeVerification = "block";
                    $rootScope.ReceiptTimeout();
                    /*  } else if($rootScope.appointmentwaivefee === true){
                        $rootScope.applyPlanMode = "none";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.verifyPlanMode = "block";
                        $rootScope.consultChargeNoPlanPage = "none";
                        $rootScope.healthPlanPage = "block";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.providerName = "";
                        $rootScope.PolicyNo = "";
                        $scope.doGetPatientHealthPlansList();
                        $state.go('tab.consultCharge');*/
                } else {
                    $rootScope.doGetHospitalInformation();
                }
            }
        }

        $rootScope.doPostDepitDetails = function () {
            var params = {
                patientId: $rootScope.patientId,
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    //  if(($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && ($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on')) {
                    if ($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on' && $rootScope.paymentMode === 'on') {
                        $rootScope.applyPlanMode = "block";
                        $rootScope.verifyPlanMode = "none";
                        $rootScope.consultChargeNoPlanPage = "none";
                        $rootScope.healthPlanPage = "block";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.providerName = "";
                        $rootScope.PolicyNo = "";
                        if ($rootScope.getIndividualPatientCreditCount === 0 && $rootScope.getIndividualPatientCreditCount !== '') {
                            if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                $('#addNewCard').val('Choose Your Card');
                                $('#addNewCard_addCard').val('Choose Your Card');
                                $('#addNewCard_submitPay').val('Choose Your Card');
                                $rootScope.userDefaultPaymentProfileText = null;
                                $rootScope.editCardStyle = 'none';
                            } else {
                                $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                            }
                            $rootScope.doGetPatientPaymentProfiles();
                        }
                        $scope.doGetPatientHealthPlansList();
                        $state.go('tab.consultCharge');
                        //  } else if((($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || $rootScope.insuranceMode !== 'on') && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                    } else if ((($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || $rootScope.insuranceMode !== 'on') && ($rootScope.paymentMode === 'on' || $rootScope.paymentMode !== 'on')) {
                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none"
                        $rootScope.enableWaivefeeVerification = "none";;
                        $rootScope.enableInsuranceVerificationSuccess = "none";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                        //  } else if($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined'  && $rootScope.copayAmount !== 0) {
                    } else if ($rootScope.paymentMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined' && $rootScope.copayAmount !== 0) {
                        if ($rootScope.isPaid !== true && ($rootScope.getIndividualPatientCreditCount === 0 || angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                            if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                $('#addNewCard').val('Choose Your Card');
                                $('#addNewCard_addCard').val('Choose Your Card');
                                $('#addNewCard_submitPay').val('Choose Your Card');
                                $rootScope.userDefaultPaymentProfileText = null;
                                $rootScope.editCardStyle = 'none';
                            } else {
                                $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                            }
                            $rootScope.paymentBackPage = true;
                            $rootScope.doGetPatientPaymentProfiles();
                            $rootScope.healthPlanPage = "none";
                            $rootScope.consultChargeNoPlanPage = "block";
                            $state.go('tab.consultCharge');
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $rootScope.enableCreditVerification = "none";
                            $rootScope.enableWaivefeeVerification = "none";
                        } else if ($rootScope.isPaid === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $rootScope.enablePaymentSuccess = "none";
                            if ($rootScope.appointmentwaivefee === true) {
                                $rootScope.enableCreditVerification = "none";
                                $rootScope.enableWaivefeeVerification = "block";
                            } else {
                                $rootScope.enableWaivefeeVerification = "none";
                                $rootScope.enableCreditVerification = "block";
                            }
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                        }
                        //} else if(($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                    } else if (($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && (($rootScope.paymentMode === 'on' || $rootScope.paymentMode !== 'on'))) {
                        $rootScope.openAddHealthPlanSection();
                        $state.go('tab.consultCharge');
                    } else if ($rootScope.consultationAmount === 0) {
                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none"
                        $rootScope.enableWaivefeeVerification = "none";;
                        $rootScope.enableInsuranceVerificationSuccess = "block";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.postDepitDetails(params);
        }


        $rootScope.doGetHospitalInformation = function () {
            $rootScope.paymentBackPage = '';
            var params = {
                accessToken: $rootScope.accessToken,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.getDetails = data.data[0].enabledModules;
                    if ($rootScope.getDetails !== '') {
                        //  if(($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && ($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on')) {
                        if (($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && $rootScope.paymentMode === 'on') {
                            $rootScope.applyPlanMode = "block";
                            $rootScope.verifyPlanMode = "none";
                            $rootScope.consultChargeNoPlanPage = "none";
                            $rootScope.healthPlanPage = "block";
                            $rootScope.chooseHealthHide = 'initial';
                            $rootScope.chooseHealthShow = 'none';
                            $rootScope.providerName = "";
                            $rootScope.PolicyNo = "";
                            if ($rootScope.getIndividualPatientCreditCount === 0 && $rootScope.getIndividualPatientCreditCount !== '') {
                                if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                    $('#addNewCard').val('Choose Your Card');
                                    $('#addNewCard_addCard').val('Choose Your Card');
                                    $('#addNewCard_submitPay').val('Choose Your Card');
                                    $rootScope.userDefaultPaymentProfileText = null;
                                    $rootScope.editCardStyle = 'none';
                                } else {
                                    $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                    $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                    $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                                }
                                $rootScope.doGetPatientPaymentProfiles();
                            }
                            $scope.doGetPatientHealthPlansList();
                            $state.go('tab.consultCharge');
                            //  } else if((($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || $rootScope.insuranceMode !== 'on') && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                        } else if ((($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || $rootScope.insuranceMode !== 'on') && $rootScope.paymentMode !== 'on') {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none"
                            $rootScope.enableWaivefeeVerification = "none";;
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                            //  } else if($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined' && $rootScope.copayAmount !== 0) {
                        } else if ($rootScope.paymentMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined' && $rootScope.copayAmount !== 0) {
                            if ($rootScope.isPaid !== true && ($rootScope.getIndividualPatientCreditCount === 0 || angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                                if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                    $('#addNewCard').val('Choose Your Card');
                                    $('#addNewCard_addCard').val('Choose Your Card');
                                    $('#addNewCard_submitPay').val('Choose Your Card');
                                    $rootScope.userDefaultPaymentProfileText = null;
                                    $rootScope.editCardStyle = 'none';
                                } else {
                                    $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                    $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                    $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                                }
                                $rootScope.paymentBackPage = true;
                                $rootScope.doGetPatientPaymentProfiles();
                                $rootScope.healthPlanPage = "none";
                                $rootScope.consultChargeNoPlanPage = "block";
                                $state.go('tab.consultCharge');
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enableCreditVerification = "none";
                                $rootScope.enableWaivefeeVerification = "none";
                            } else if ($rootScope.isPaid === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enablePaymentSuccess = "none";
                                if ($rootScope.appointmentwaivefee === true) {
                                    $rootScope.enableCreditVerification = "none";
                                    $rootScope.enableWaivefeeVerification = "block";
                                } else {
                                    $rootScope.enableWaivefeeVerification = "none";
                                    $rootScope.enableCreditVerification = "block";
                                }
                                $state.go('tab.receipt');
                                $rootScope.ReceiptTimeout();
                            }
                            //    } else if(($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                        } else if (($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting === 'on') && (($rootScope.paymentMode === 'on' || $rootScope.paymentMode !== 'on'))) {
                            $rootScope.openAddHealthPlanSection();
                            $state.go('tab.consultCharge');
                        } else if ($rootScope.consultationAmount === 0) {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none"
                            $rootScope.enableWaivefeeVerification = "none";;
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }


        $rootScope.doGetWaiveFeeHospitalInformation = function () {
            $rootScope.paymentBackPage = '';
            var params = {
                accessToken: $rootScope.accessToken,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.getDetails = data.data[0].enabledModules;
                    if ($rootScope.getDetails !== '') {
                        if (($rootScope.insuranceMode === 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || $rootScope.insuranceMode !== 'on') {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none"
                            $rootScope.enableWaivefeeVerification = "none";
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                        } else {
                            $rootScope.applyPlanMode = "none";
                            $rootScope.chooseHealthHide = 'initial';
                            $rootScope.chooseHealthShow = 'none';
                            $rootScope.verifyPlanMode = "block";
                            $rootScope.consultChargeNoPlanPage = "none";
                            $rootScope.healthPlanPage = "block";
                            $rootScope.chooseHealthHide = 'initial';
                            $rootScope.chooseHealthShow = 'none';
                            $rootScope.providerName = "";
                            $rootScope.PolicyNo = "";
                            $scope.doGetPatientHealthPlansList();
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }

        $rootScope.GoToappoimentDetailsFromUserHome = function (scheduledListData, fromPreviousPage) {
            if (scheduledListData.status != 71) {
                $rootScope.AppointScheduleTime = '';
                $rootScope.appointmentsPatientId = '';
                // $rootScope.schedulemobile = scheduledListData.participants[1].person.phones[0].value;
                $rootScope.schedulemobile = scheduledListData.where;
                $rootScope.scheduledListDatas = scheduledListData;
                $rootScope.appointmentwaivefee = scheduledListData.waiveFee;
                var currentTime = $rootScope.scheduledListDatas.scheduledTime; 

                var serverDateTime = currentTime;

                var currentLocalTimeZoneDateTime = new Date(serverDateTime);

                var getMinsExtraTime = $scope.addMinutes(currentLocalTimeZoneDateTime, 30);
                var getEnterTime = new Date();
                var getMissedAppointmentExpiryTime = ((new Date(getMinsExtraTime).getTime()) - (getEnterTime.getTime()));
                if (getMissedAppointmentExpiryTime > 0) {
                    $rootScope.AppointScheduleTime = getMissedAppointmentExpiryTime;
                } else {
                    $rootScope.AppointScheduleTime = '';
                }
                $rootScope.appointPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[0].customCode.description);
                $rootScope.appointSecondConcern = $rootScope.scheduledListDatas.intakeMetadata.concerns[1];
                if ($rootScope.appointSecondConcern == '' || typeof $rootScope.appointSecondConcern === 'undefined') {
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
                $rootScope.doGetScheduledNowPhoneConsulatation();
                $rootScope.doGetListOfCoUsers();
                $scope.getHealthHistoryDetails();

                if (fromPreviousPage === 'userHome') {
                    $rootScope.userAgeForIntake = '';
                    $rootScope.updatedPatientImagePath = '';
                    $rootScope.newDependentImagePath = '';
                    $rootScope.appointmentDisplay = '';
                    $rootScope.appointPreviousPage = 'tab.userhome';
                    if ($window.localStorage.getItem("hosNameforCard") === $rootScope.hospitalName) {
                        $rootScope.userDefaultPaymentProfile = $window.localStorage.getItem("Card" + $rootScope.UserEmail);
                        $rootScope.userDefaultPaymentProfileText = $window.localStorage.getItem("CardText" + $rootScope.UserEmail);
                        $rootScope.userDefaultPaymentLogo = $window.localStorage.getItem("CardLogo" + $rootScope.UserEmail);
                    } else {
                        $rootScope.userDefaultPaymentProfile = null;
                    }
                    $rootScope.PatientImageSelectUser = $rootScope.scheduledListDatas.patientImage;
                    $rootScope.PatientFirstName = $rootScope.scheduledListDatas.patFirstName;
                    $rootScope.PatientLastName = $rootScope.scheduledListDatas.patLastName;
                    //  $rootScope.PatientAge = P_Age;
                    $rootScope.SelectPatientAge = $rootScope.PatientAge;
                    $rootScope.doGetSelectedPatientProfiles($rootScope.patientId, '', '');
                    if ($rootScope.patientId !== $rootScope.primaryPatientId) {
                        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
                    }
                }
                if (fromPreviousPage == "userAccount") {
                    $rootScope.appointPreviousPage = 'tab.userAccount';
                }
                if (fromPreviousPage !== "AppointmentPage") {
                    $rootScope.appointmentId = scheduledListData.appointmentId;
                    $rootScope.appointPersonId = scheduledListData.participants[0].person.id
                    $rootScope.appointmentsPatientId = $rootScope.patientId;
                    $rootScope.assignedDoctorId = scheduledListData.clinicianId; //$rootScope.scheduledListDatas.participants[0].person.id;
                    $rootScope.appointmentsPatientGurdianName = htmlEscapeValue.getHtmlEscapeValue($rootScope.primaryPatientFullName);
                    $rootScope.appointmentDisplay = "test";
                    $scope.$root.$broadcast("callAppointmentConsultation");
                    //  $rootScope.doGetConsultationId($rootScope.scheduledListDatas.appointmentId, $rootScope.scheduledListDatas.participants[0].person.id, 'tab.appoimentDetails');
                }
            }
        };
        $scope.doGetWaitingRoom = function () {
            if ($rootScope.activeInqueueAppoint) {
                //activeConsultConnection.stop();
                //  activeConsultConnection.qs = {};
                activeConsultConnection = null;
                activeRoomConHub = null;
            }
            cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status) {
                                    if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
                                        $scope.titeName = 'Would Like to Access the Microphone';
                                        $scope.settingsMessage = "This app requires microphone access in order to conduct audio/video consultations.";
                                        onMicroPhoneAuthorizationDenied();
                                    } else { //authorized
                                        $window.localStorage.setItem('FlagForCheckingAuthorization', 'Authorized');
                                        if (getCurrentFuncName === 'GeneralLoginFun') {
                                            $scope.GetLoginFunctionDetails();
                                        } else if (getCurrentFuncName === 'SingleFuncLogin') {
                                            $scope.GetSingleLoginDetailsFOrCheckingMic();
                                        } else if(getCurrentFuncName === "SearchProvidePage") {
                                              $scope.chkSearchProviderPage($rootScope.LogCurrentPage);
                                        }
                                    }
                                }, function() {

                                });
            $state.go('tab.waitingRoom');
        }

        $scope.backToEdiORAddPlan = function () {
            if (($rootScope.getHlthSctValue === 'Add a new health plan' || $rootScope.getHlthSctValue === 'Choose Your Health Plan' || $rootScope.providerName === '' || $rootScope.getHlthSctValue === 'Agregar un nuevo plan de salud' || $rootScope.getHlthSctValue === 'Elija su plan de salud') && $rootScope.chooseHealthShow == 'none') {
                $rootScope.editplan = "none";
            } else {
                $rootScope.editplan = "block";
            }
            $state.go('tab.consultCharge');
        }

        $scope.backToEdiORAddCard = function () {
            // $rootScope.iscancel = true;
            if ($rootScope.submitPayBack == 'tab.submitPayment') {
                if (typeof $rootScope.userCardType == 'undefined') {
                    $rootScope.iscancel = true;
                    $rootScope.editCardStyle = "none";
                }
            }
            if ($rootScope.isEditAvailable) {
                $rootScope.isEditAvailable = true
            } else {
                //$rootScope.editCardStyle ="none";
                $rootScope.isEditAvailable = false;
            }
            if (typeof $rootScope.submitPayBack == 'undefined') {
                history.back();
            } else {
                $state.go($rootScope.submitPayBack);
            }

        }

        $scope.catchPlanDetails = function () {
            $rootScope.ahProvider = document.getElementById('Provider').value;
            $rootScope.ahfirstName = document.getElementById('firstName').value;
            $rootScope.ahlastName = document.getElementById('lastName').value;
            $rootScope.ahpolicyNumber = document.getElementById('policyNumber').value;
            //  $rootScope.ahdateBirth = document.getElementById('date').value;
        }

        $scope.doRefreshReportDetails = function () {
            $rootScope.doGetExistingConsulatationReport();
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        }

        $rootScope.EnableBackButton = function () {
            if ($rootScope.waitingPopupAvailable) {
                $scope.doGetlocationResponse();
                var currentLocation = window.location;
                var loc = currentLocation.href;
                var newloc = loc.split("#");
                var locat = newloc[1];
                var sploc = locat.split("/");
                $rootScope.cuttlocations = sploc[1] + "." + sploc[2];
                //  $rootScope.doGetPatientProfiles();
                //$state.go('tab.userhome');
            } else {
                var currentLocation = window.location;
                var loc = currentLocation.href;
                var newloc = loc.split("#");
                var locat = newloc[1];
                var sploc = locat.split("/");
                $rootScope.cuttlocations = sploc[1] + "." + sploc[2];
                $rootScope.doGetPatientProfiles();
                $state.go('tab.userhome');
            }
        }

        $rootScope.doGetAttachmentURL = function (fileId) {
            var params = {
                attachmentFileId: fileId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    var fileUrl = data.data[0].url;
                    if (fileUrl.indexOf('https://') < 0)
                        fileUrl = apiCommonURL + fileUrl;
                    window.open(fileUrl, '_system', 'location=yes');
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getAttachmentURL(params);
        }


        $scope.GetUserAccountCondition = function (pid) {
            var params = {
                patientId: pid,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.total === 0) {
                        $rootScope.chkAvailabiltyOfSS = false;
                    } else if (data.total > 0) {
                        $rootScope.chkAvailabiltyOfSS = true;
                    }
                    $scope.doGetSingleHospitalRegistrationInformation();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getUserAccountCondition(params);
        }


        $scope.loadDependent = function () {
            $rootScope.RelatedPatientProfiles = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.RelatedPatientProfiles = [];
                    angular.forEach(data.data, function (index) {
                        if (typeof index.gender !== 'undefined') {
                            if (index.gender === 'F') {
                                $scope.patGender = "Female";
                            } else {
                                $scope.patGender = "Male";
                            }
                        } else {
                            $scope.patGender = "NA";
                        }
                        if (typeof $rootScope.listOfRelationship !== 'undefined' && $rootScope.listOfRelationship !== '') {
                            var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCode
                            })
                            if (getdependRelationShip.length !== 0) {
                                var depRelationShip = getdependRelationShip[0].text;
                            } else {
                                var depRelationShip = '';
                            }
                        } else {
                            var depRelationShip = '';
                        }

                        $rootScope.RelatedPatientProfiles.push({
                            'id': index.$id,
                            'patientId': index.patientId,
                            'patientName': index.patientName,
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
                            'personId': index.personId,

                        });
                    });
                    $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
                    $scope.doGetCodesSet();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.callServiceUnAvailableError();
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getRelatedPatientProfiles(params);
        };




        // $(".overlay").css({"display": "none" });


        // Note



    })

    .directive('inputMaxLengthNumber', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
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

    .directive('creditCardExpirationEntry', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                function fromUser(text) {
                    var newVal = String(text);
                    if (typeof oldLength !== "undefined") {
                        if (oldLength !== 3 && String(text).length === 2) {
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


    .filter('ageFilter', function () {
        function getAge(dateString) {
            var now = new Date();
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

            yearString = " yrs ";
            monthString = " m ";
            //dayString = "days";
            dayString = " d ";

            var monthsCount = (now.getFullYear() - dob.getFullYear()) * 12;
            monthsCount += now.getMonth() - dob.getMonth();
            if (now.getDate() < dob.getDate()) {
                monthsCount--;
            }

            if (monthsCount <= 6 && age.days <= 30) {
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                //  return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;

            } else if (monthsCount <= 23 && age.days <= 30) {
                //   return  monthsCount + monthString;
            } else {
                return ageString = age.years;
            }



            // if (age.years === 0) {
            //    /* if (age.days <= 15) {
            //         return ageString = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         return ageString = (age.months + 1) + monthString;;
            //     }*/
            //     //var sdt = new Date('1993-10-20');
            //     var dob1 = new Date(dateString);
            //     var difdt1 = new Date(new Date() - dob1);
            //     var num_years = difdt1/31536000000;
            //     var num_months = (difdt1 % 31536000000)/2628000000;
            //     var num_days = ((difdt1 % 31536000000) % 2628000000)/86400000;
            //     return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;
            // }
            // if (age.years > 0) {
            //    /* if (age.days <= 15) {
            //         var month = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         var month = (age.months + 1) + monthString;;
            //     }*/
            //      //if (age.days != 0) {
            //         var month = age.months + monthString;;
            //    // }
            //     if (age.months !== 0) {
            //         return ageString = age.years + yearString + month;
            //     } else {
            //         return ageString = age.years + yearString;
            //     }

            // }
        }
        return function (birthdate) {
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




    .filter('ageYearsStringFilter', function () {
        function getAge(dateString) {
            var now = new Date();
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

            yearString = " yrs ";
            monthString = " m ";
            //dayString = "days";
            dayString = " d ";

            var monthsCount = (now.getFullYear() - dob.getFullYear()) * 12;
            monthsCount += now.getMonth() - dob.getMonth();
            if (now.getDate() < dob.getDate()) {
                monthsCount--;
            }

            if (monthsCount <= 6 && age.days <= 30) {
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                //   return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;

            } else if (monthsCount <= 23 && age.days <= 30) {
                //   return  monthsCount + monthString;
            } else {
                return ageString = yearString;
            }



            // if (age.years === 0) {
            //    /* if (age.days <= 15) {
            //         return ageString = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         return ageString = (age.months + 1) + monthString;;
            //     }*/
            //     //var sdt = new Date('1993-10-20');
            //     var dob1 = new Date(dateString);
            //     var difdt1 = new Date(new Date() - dob1);
            //     var num_years = difdt1/31536000000;
            //     var num_months = (difdt1 % 31536000000)/2628000000;
            //     var num_days = ((difdt1 % 31536000000) % 2628000000)/86400000;
            //     return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;
            // }
            // if (age.years > 0) {
            //    /* if (age.days <= 15) {
            //         var month = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         var month = (age.months + 1) + monthString;;
            //     }*/
            //      //if (age.days != 0) {
            //         var month = age.months + monthString;;
            //    // }
            //     if (age.months !== 0) {
            //         return ageString = age.years + yearString + month;
            //     } else {
            //         return ageString = age.years + yearString;
            //     }

            // }
        }
        return function (birthdate) {
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




    .filter('ageMonthFilter', function () {
        function getAge(dateString) {
            var now = new Date();
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

            yearString = " yrs ";
            monthString = " m ";
            //dayString = "days";
            dayString = " d ";

            var monthsCount = (now.getFullYear() - dob.getFullYear()) * 12;
            monthsCount += now.getMonth() - dob.getMonth();
            if (now.getDate() < dob.getDate()) {
                monthsCount--;
            }

            if (monthsCount <= 6 && age.days <= 30) {
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                // return ageString = Math.floor(num_months) + monthString;
               
                var ageString = monthsCount + monthString;
                return ageString;

            } else if (monthsCount <= 23 && age.days <= 30) {
                return monthsCount + monthString;
            } else {
                //  return ageString = age.years + yearString;
            }



            // if (age.years === 0) {
            //    /* if (age.days <= 15) {
            //         return ageString = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         return ageString = (age.months + 1) + monthString;;
            //     }*/
            //     //var sdt = new Date('1993-10-20');
            //     var dob1 = new Date(dateString);
            //     var difdt1 = new Date(new Date() - dob1);
            //     var num_years = difdt1/31536000000;
            //     var num_months = (difdt1 % 31536000000)/2628000000;
            //     var num_days = ((difdt1 % 31536000000) % 2628000000)/86400000;
            //     return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;
            // }
            // if (age.years > 0) {
            //    /* if (age.days <= 15) {
            //         var month = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         var month = (age.months + 1) + monthString;;
            //     }*/
            //      //if (age.days != 0) {
            //         var month = age.months + monthString;;
            //    // }
            //     if (age.months !== 0) {
            //         return ageString = age.years + yearString + month;
            //     } else {
            //         return ageString = age.years + yearString;
            //     }

            // }
        }
        return function (birthdate) {
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




    .filter('ageDayFilter', function () {
        function getAge(dateString) {
            var now = new Date();
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

            yearString = " yrs ";
            monthString = " m ";
            //dayString = "days";
            dayString = " d ";

            var monthsCount = (now.getFullYear() - dob.getFullYear()) * 12;
            monthsCount += now.getMonth() - dob.getMonth();
            if (now.getDate() < dob.getDate()) {
                monthsCount--;
            }

            if (monthsCount <= 6 && age.days <= 30) {
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                //return ageString = Math.floor(num_days) + dayString ;
                //Days//
                
                var ageString = age.days + dayString;
                return ageString;

            } else if (monthsCount <= 23 && age.days <= 30) {
                //  return  monthsCount + monthString;
            } else {
                //  return ageString = age.years + yearString;
            }




            // if (age.years === 0) {
            //    /* if (age.days <= 15) {
            //         return ageString = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         return ageString = (age.months + 1) + monthString;;
            //     }*/
            //     //var sdt = new Date('1993-10-20');
            //     var dob1 = new Date(dateString);
            //     var difdt1 = new Date(new Date() - dob1);
            //     var num_years = difdt1/31536000000;
            //     var num_months = (difdt1 % 31536000000)/2628000000;
            //     var num_days = ((difdt1 % 31536000000) % 2628000000)/86400000;
            //     return ageString = Math.floor(num_months) + monthString + Math.floor(num_days) + dayString ;
            // }
            // if (age.years > 0) {
            //    /* if (age.days <= 15) {
            //         var month = age.months + monthString;;
            //     } else if (age.days > 15) {
            //         var month = (age.months + 1) + monthString;;
            //     }*/
            //      //if (age.days != 0) {
            //         var month = age.months + monthString;;
            //    // }
            //     if (age.months !== 0) {
            //         return ageString = age.years + yearString + month;
            //     } else {
            //         return ageString = age.years + yearString;
            //     }

            // }
        }
        return function (birthdate) {
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



    .filter('ageFilterOld', function () {
        function getAge(dateString) {
            var now = new Date();
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

            yearString = "yrs";
            monthString = "m";
            //dayString = "days";
            dayString = "d";

            if (age.years === 0) {
                /* if (age.days <= 15) {
                     return ageString = age.months + monthString;;
                 } else if (age.days > 15) {
                     return ageString = (age.months + 1) + monthString;;
                 }*/
                //var sdt = new Date('1993-10-20');
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                return ageString = Math.floor(num_months) + monthString + '/' + Math.floor(num_days) + dayString;
            }
            if (age.years > 0) {
                var monthTotal = 0;
                if (age.days <= 15) {
                    monthTotal = age.months;
                    var month = age.months + monthString;;
                } else if (age.days > 15) {
                    monthTotal = age.months + 1;
                    var month = (age.months + 1) + monthString;;
                }
                if (monthTotal === 12) {
                    return ageString = (age.years + 1) + yearString;
                } else {
                    if (age.months !== 0) {
                        return ageString = age.years + yearString + '/' + month;
                    } else {
                        return ageString = age.years + yearString;
                    }
                }
            }
        }
        return function (birthdate) {
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
    .directive('googlePlaces', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                location: '='
            },
            template: '<input id="google_places_ac" name="google_places_ac" ng-model="google_places_ac" type="text" class="input-block-level" required  />',
            link: function ($scope, elm, attrs) {
                var input = document.getElementById('google_places_ac');
                var autocomplete = new google.maps.places.Autocomplete(input, {
                    types: ['(regions)'],
                    componentRestrictions: {
                        country: "US"
                    }
                });
                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                    var place = autocomplete.getPlace();
                    $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                    $scope.$apply();
                });
            }
        }
    })
    // Array Of Countries Filter
    .filter('arrayContries', function () {
        return function (items, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    })

    .filter('truncate', function () {
        return function (input, characters) {
            if (input.length > characters) {
                return input.substr(0, characters) + '...';
            }

            return input;
        };
    })
    // Special Charctor Remove Filter //
    .filter('filterHtmlChars', function () {
        return function (html) {
            var filtered = angular.element('<div>').html(html).text();
            return filtered;
        }
    })

    .directive('siteHeader', function () {
        return {
            restrict: 'E',
            template: '<a class="button_new icon ion-chevron-left"><span>{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function (scope, element, attrs) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })

    .directive('siteHeader1', function () {
        return {
            restrict: 'E',
            template: '<a class="headerval"><span style="margin-left: 3px;">{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function (scope, element) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })

    .directive('siteHeaderIos', function () {
        return {
            restrict: 'E',
            template: '<a class="headerval" style="top: -5px !important;"><span style="margin-left: 3px;">{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function (scope, element) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })
    .directive('siteHeader2', function () {
        return {
            restrict: 'E',
            template: '<a class="button_new icon PlanCancel" ><span>{{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function (scope, element) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })
    .directive('siteHeaderConcernBack', function () {
        return {
            restrict: 'E',
            template: '<a class="button_new icon ion-chevron-left"><span> {{back}}</span></a>',
            scope: {
                back: '@back',
                icons: '@icons'
            },
            link: function (scope, element) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    })


    .filter("sanitize", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }])
    .directive('noSpecialChar', function() {
        return {
          require: 'ngModel',
          restrict: 'A',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
              if (inputValue == undefined)
                return ''
              //cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
              cleanInputValue1 = inputValue.replace(/[^\w\s]/gi, '');
              cleanInputValue2 =  cleanInputValue1.replace(/\s/g, '');
              cleanInputValue =  cleanInputValue2.replace(/^[A-z]/g, '');
              if (cleanInputValue != inputValue) {
                modelCtrl.$setViewValue(cleanInputValue);
                modelCtrl.$render();
              }
              return cleanInputValue;
            });
          }
        }
      })
.directive('noSpecialChar', function() {
        return {
          require: 'ngModel',
          restrict: 'A',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
              if (inputValue == undefined)
                return ''
              //cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
              cleanInputValue1 = inputValue.replace(/[^\w\s]/gi, '');
              cleanInputValue2 =  cleanInputValue1.replace(/\s/g, '');
              cleanInputValue =  cleanInputValue2.replace(/^[A-z]/g, '');
              if (cleanInputValue != inputValue) {
                modelCtrl.$setViewValue(cleanInputValue);
                modelCtrl.$render();
              }
              return cleanInputValue;
            });
          }
        }
      })
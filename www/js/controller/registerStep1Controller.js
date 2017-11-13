angular.module('starter.controllers')
    .controller('registerStep1Controller', function ($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
        $rootScope.isRegistrationCompleted = false;
        var onePopupLimit = true; 
        $ionicPlatform.registerBackButtonAction(function () {
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
                if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block') {
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

        /*  $rootScope.formatIsdCode = function(countryCode) {
            if(!angular.isUndefined(countryCode) && countryCode !== 0 && countryCode !== '') {
                var tt = $(this)[0].country.code.length;
                if (tt === 2)
                    return ($(this)[0].country.code) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + ($(this)[0].country.name);
                else if (tt === 3)
                    return ($(this)[0].country.code) + "&nbsp;&nbsp;&nbsp;&nbsp;" + ($(this)[0].country.name);
                else if (tt === 4)
                    return ($(this)[0].country.code) + "&nbsp;&nbsp;&nbsp;" + ($(this)[0].country.name);
            }
          };*/


        //  $scope.formatIsdCode = (s,c,n) => (s.length<n) ? s+c.repeat(n-s.length): s;

        $scope.formatIsdCode = function (s, c, n) {
            String.prototype.repeat = function (n) {
                n = n || 1;
                return Array(n + 1).join(this);
            }
            if (s.length < n) {
                return s + c.repeat(n - s.length);
            } else {
                return s;
            }
        }

        $scope.fnameBlur = function () {
            $scope.fnameerror = false;
            $('.regstfname').removeClass("emailbackground");
        }
        $scope.lnameBlur = function () {
            $scope.lnameerror = false;
            $('.regstlname').removeClass("emailbackground");
        }
        $scope.genderBlur = function () {
            $scope.gendererror = false;
            $('.regstgender').removeClass("emailbackground");
            $('.ssooption').removeClass("emailbackground");
        }

        $scope.countryBlur = function () {
            $scope.countryError = false;

            $('.regstCountry').removeClass("emailbackground");
            $('.ssooptionCountry').removeClass("emailbackground");
            if (($('#regCountryCode').val() === 'Choose') || ($('#regCountryCode').val() === ' ')) {
                $("div.viewport").html('<div class="regCountryOpt">Choose</div>');
            } else {
                var selectedValue = $('#regCountryCode').val();
                $("div.viewport").html('<div class="regCountryOpt">' + selectedValue + '</div>');
            }
        }
        $scope.timeZoneBlur = function () {
            $scope.timeZoneError = false;
            $('.regstTimezone').removeClass("emailbackground");
            $('.ssooptionTimezone').removeClass("emailbackground");
        }
        $scope.addressBlur = function () {
            $scope.adderror = false;
            $('.regstaddress').removeClass("emailbackground");
        }
        $scope.ValidateEmail = function (email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };
        var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;
        $scope.emailBlur = function () {
            $scope.emailmanderror = false;
            $scope.emailexisterror = false;
            $('.regemail').removeClass("emailbackground");
            var emailvalue = $('#regEmail').val();
            if (emailvalue !== '') {
                if (!$scope.ValidateEmail($("#regEmail").val())) {
                    $scope.emailerror = true;
                    $('.regemail').addClass("emailbackground");
                } else {
                    $scope.emailerror = false;
                }

            }
        }
        //$scope.mobilelength = $("#regMobile").val().length;
        $scope.moblieBlur = function () {
            $('.regstmobile').removeClass("emailbackground");
            $scope.mobilemanderror = false;
            $scope.mobilelength = $("#regMobile").val().length;
            if ($scope.mobilelength < 14) {
                $scope.mobileerror = true;
                $('.regstmobile').addClass("emailbackground");
            }
            else {
                $scope.mobileerror = false;
            }
        }
        $scope.pwdBlur = function () {
            $('.regstpwd').removeClass("emailbackground");
            $scope.pwdmanderror = false;
            if (!pwdRegularExpress.test($scope.regStep1.regPassword)) {
                $scope.pwderror = true;
                $scope.pwdspaceerror = false;
                $('.regstpwd').addClass("emailbackground");
            } else if (/\s/.test($scope.regStep1.regPassword)) {
                $scope.pwdspaceerror = true;
                $scope.pwderror = false;
                $('.regstpwd').addClass("emailbackground");
            } else {
                $scope.pwderror = false;
                $scope.pwdspaceerror = false;
                $('.regstpwd').removeClass("emailbackground");
            }
        }
        $scope.regdobs = function () {
            $('.regstdob').removeClass("emailbackground");
            $scope.dobmanderror = false;
            var selectedDate = document.getElementById('regDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
                dt2 = Date.parse(selectedDate);
            $rootScope.restrictage = getAge(selectedDate);
            if (dt2 > dt1) {
                $scope.dobfuture = true;
                $scope.doberror = false;
                $('.regstdob').addClass("emailbackground");
            } else if ($rootScope.restrictage <= 11) {
                $scope.doberror = true;
                $scope.dobfuture = false;
                $('.regstdob').addClass("emailbackground");
            } else {
                $scope.doberror = false;
                $scope.dobfuture = false;
            }
        }
        $scope.confirmpwdBlur = function () {
            $scope.cnfrmpwderror = false;
            $('.regstconpwd').removeClass("emailbackground");
            if ($scope.regStep1.regPassword !== $scope.regStep1.regConfrmPassword) {
                $scope.cnfrmpwderror = true;
                $('.regstconpwd').addClass("emailbackground");
            } else {
                $scope.cnfrmpwderror = false;
            }
        }


        $rootScope.postRegisterStep1 = function () {

            $scope.fname = $('#regFName').val();
            $scope.lname = $('#regLName').val();
            $scope.gender = $('#regGender').val();
            $scope.dob = $('#regDOB').val();
            $scope.homeaddress = $('#regaddress').val();
            $scope.email = $('#regEmail').val();
            $scope.mobile = $('#regMobile').val();
            $scope.regCountry2 = $('#regCountryCode').val();
            if ($('#regCountryCode').val() == 'Choose') {
                $scope.regCountry2 = $rootScope.regCountry2
            }

            //  $scope.regCountryCode =  $scope.regCountry2[0];
            //  $scope.regCountryName =  $scope.regCountry2[1];
            //  $scope.regTimezone =  $('#regTimezone').val();
            $scope.password = $('#regPassword').val();
            $scope.confirmPwd = $('#regConfrmPassword').val();
            var selectedDate = document.getElementById('regDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
                dt2 = Date.parse(selectedDate);
            $rootScope.restrictage = getAge(selectedDate)

            if (typeof $scope.fname === 'undefined' || $scope.fname === '') {
                $scope.fnameerror = true;
                $('.regstfname').addClass("emailbackground");
            } else if (typeof $scope.lname === 'undefined' || $scope.lname === '') {
                $scope.lnameerror = true;
                $('.regstlname').addClass("emailbackground");
            } else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
                $scope.gendererror = true;
                $('.regstgender').addClass("emailbackground");
                $('.ssooption').addClass("emailbackground");
            } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
                $scope.dobmanderror = true;
                $('.regstdob').addClass("emailbackground");
            } else if (dt2 > dt1) {
                $scope.dobfuture = true;
                $scope.doberror = false;
            } else if ($rootScope.restrictage <= 11) {
                $scope.doberror = true;
                $scope.dobfuture = false;
            } else if (typeof $scope.homeaddress === 'undefined' || $scope.homeaddress === '') {
                $scope.adderror = true;
                $('.regstaddress').addClass("emailbackground");
            } else if (typeof $scope.email === 'undefined' || $scope.email === '') {
                $('.regemail').addClass("emailbackground");
                $scope.emailmanderror = true;
            } else if (!$scope.ValidateEmail($("#regEmail").val())) {
                $scope.emailerror = true;
            } else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
                $('.regstmobile').addClass("emailbackground");
                $scope.mobileerror = false;
                $scope.mobilemanderror = true;
            } else if (typeof $scope.regCountry2 === 'undefined' || $scope.regCountry2 === '' || $scope.regCountry2 === 'Choose') {
                $('.regstCountry').addClass("emailbackground");
                $('.ssooptionCountry').addClass("emailbackground");
                //  $scope.countryError = true;
                $scope.ErrorMessage = "Please choose your country code";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
                /*  }else if(typeof $scope.regTimezone === 'undefined' ||$scope.regTimezone === ''){
                    $scope.timeZoneError = true;
                      $('.regstTimezone').addClass("emailbackground");
                      $('.ssooptionTimezone').addClass("emailbackground");*/
            } else if ($scope.mobilelength < 14) {
                $scope.mobileerror = true;
            } else if (typeof $scope.password === 'undefined' || $scope.password === '') {
                $('.regstpwd').addClass("emailbackground");
                $scope.pwdmanderror = true;
            } else if (!pwdRegularExpress.test($scope.password)) {
                $scope.pwderror = true;
                $scope.pwdspaceerror = false;
            } else if (/\s/.test($scope.password)) {
                $scope.pwdspaceerror = true;
                $scope.pwderror = false;
            } else if (typeof $scope.confirmPwd === 'undefined' || $scope.confirmPwd === '') {
                $('.regstconpwd').addClass("emailbackground");
                $scope.confirmpwdmanderror = true;
            } else if ($scope.regStep1.regPassword !== $scope.regStep1.regConfrmPassword) {
                $scope.cnfrmpwderror = true;
            } else if ($rootScope.customerSso == "Mandatory") {
                $scope.doPostNewSsoRegistration();
            } else {
                $scope.doPostRegistration();
            }

        }
        $scope.doPostNewSsoRegistration = function () {

            var params = {
                email: $scope.email,
                password: $scope.password,
                firstname: $scope.fname,
                lastname: $scope.lname,
                address: $scope.homeaddress,
                dob: $scope.dob,
                gender: $scope.gender,
                mobile: $scope.mobile,
                apiSsoURL: $rootScope.ssopatientregister,
                success: function () {
                    $rootScope.isRegistrationCompleted = true;
                    $rootScope.registedEmail = $scope.email;
                    $rootScope.registedPwd = $scope.password;
                    $state.go('tab.registerSuccess');
                },
                error: function (data, status) {
                    $rootScope.isRegistrationCompleted = false;
                    if (data.status == 400) {
                        //   var emailerror = data.data.message;
                        //  $scope.ErrorMessage = "Email address already registered.";
                        //if($scope.ErrorMessage === emailerror) {
                        if (data.data.message.indexOf('already registered') > 0) {
                            $scope.contactmail = $scope.email;
                            var myPopup = $ionicPopup.show({

                                title: "<div class=''><p class='fname emailext localizejs' ><b>Account Already Exists</b></p> </div> ",
                                templateUrl: 'templates/emailpopup.html',
                                scope: $scope,
                                buttons: [{
                                    text: '<b class="fonttype localizejs">Edit Email</b>',
                                    onTap: function (e) {
                                        return false;
                                    }
                                }, {
                                    text: '<b class="fonttype localizejs">Go to Login</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        return true;
                                    }
                                },]
                            });

                            myPopup.then(function (res) {
                                if (res) {
                                    $state.go('tab.loginSingle');
                                } else {
                                    $('.regemail').addClass("emailbackground");
                                    $scope.emailexisterror = true;
                                }
                            });
                            $scope.closepopup = function () {
                                myPopup.close();
                            }
                        } else {
                            $scope.ErrorMessage = data.statusText;
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.$root.$broadcast("callServerErrorMessageValidation");
                    }
                }
            };
            LoginService.postSsoRegisterDetails(params);




            /*  else{
    
    
                var params = {
                    address: $scope.homeaddress,
                    dob: $scope.dob,
                    email: $scope.email,
                    name: $scope.userFirstandLastName,
                    password: $scope..password,
                    providerId: $rootScope.hospitalId,
                    success: function() {
                        $rootScope.isRegistrationCompleted = true;
                        $rootScope.registedEmail = $scope.email;
                        $rootScope.registedPwd = $scope.password;
                        $state.go('tab.registerSuccess');
                    },
                    error: function(data) {
                        $rootScope.isRegistrationCompleted = false;
                        if (data.message.indexOf('already registered') > 0) {
                            navigator.notification.alert(
                                data.message, // message
                                function() {},
                                $rootScope.alertMsgName, // title
                                'Done' // buttonName
                            );
                            return false;
                        } else {
                            $scope.$root.$broadcast("callServerErrorMessageValidation");
                        }
                    }
                };
                LoginService.postRegisterDetails(params);
    
              }*/
        }

        $scope.doPostRegistration = function () {
             $scope.userFirstandLastName = {
                "$id": "2",
                "first": $scope.fname,
                "last": $scope.lname
            }
            var params = {
                address: $scope.homeaddress,
                dob: $scope.dob,
                email: $scope.email,
                name: $scope.userFirstandLastName,
                password: $scope.password,
                gender: $scope.gender,
                mobile: $scope.mobile,
                providerId: $rootScope.hospitalId,
                gender: $scope.gender,
                mobileNumberWithCountryCode: $scope.regCountry2 + $scope.mobile,
                //timeZoneId: $scope.regTimezone,
                //  country: $scope.regCountryName,
                success: function () {
                    $rootScope.isRegistrationCompleted = true;
                    $rootScope.registedEmail = $scope.email;
                    $rootScope.registedPwd = $scope.password;
                    $state.go('tab.registerSuccess');
                },
                error: function (data, status) {
                    $rootScope.isRegistrationCompleted = false;
                    if (data.status == 400) {
                        //   var emailerror = data.data.message;
                        //  $scope.ErrorMessage = "Email address already registered.";
                        //if($scope.ErrorMessage === emailerror) {
                        if (data.data.message.indexOf('already registered') > 0) {
                            $scope.contactmail = $scope.email;
                            if(onePopupLimit) {
                                onePopupLimit = false;
                            var myPopup = $ionicPopup.show({

                                title: "<div class=''><p class='fname emailext localizejs' ><b>Account Already Exists</b></p> </div> ",
                                templateUrl: 'templates/emailpopup.html',
                                scope: $scope,
                                buttons: [{
                                    text: '<b class="fonttype localizejs">Edit Email</b>',
                                    onTap: function (e) {
                                        onePopupLimit = true;
                                        return false;
                                    }
                                }, {
                                    text: '<b class="fonttype localizejs">Go to Login</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        onePopupLimit = true;
                                        return true;
                                    }
                                },]
                            });
                        }
                            if (ionic.Platform.is('browser') !== true) {
                                cordova.plugins.Keyboard.close();
                            }
                            
                            myPopup.then(function (res) {
                                if (res) {
                                    //$state.go('tab.login');
                                    if (deploymentEnvLogout === "Single") {
                                        onePopupLimit = true;
                                        $state.go('tab.loginSingle');
                                    } else {
                                        onePopupLimit = true;
                                        $state.go('tab.login');
                                     }
                                } else {
                                    $('.regemail').addClass("emailbackground");
                                    $scope.emailexisterror = true;
                                }
                            });
                            $scope.closepopup = function () {
                                onePopupLimit = true;
                                myPopup.close();
                            }
                        } else if (status === 503) {
                            $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                        } else if (data.statusText == "Bad Request" && data.status == 400) {
                            $scope.ErrorMessage = "Patient Registration is not allowed for this address!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $scope.ErrorMessage = data.statusText;
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                    }
                    else {
                        $scope.$root.$broadcast("callServerErrorMessageValidation");
                    }
                }
            };
            LoginService.postRegisterDetails(params);
        }
        $scope.doChkAddressForReg = function (regStep1) {
            var params = {
                AddressText: regStep1.address,
                HospitalId: $rootScope.hospitalId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data[0].isAvailable === true) {
                        $state.go('tab.registerStep2');
                        $rootScope.step1RegDetails = step1PostRegDetailsService.getPostRegDetails();
                    } else {
                        $state.go('tab.registerAddress');
                    }
                },
                error: function (data, status) {
                    if (data === 'null') {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.chkAddressForReg(params);
        }
        $scope.change = function () {
            var isVisible = $cordovaKeyboard.hideA.isVisible();

        }
        $("#localize-widget").show();
        $scope.registerStpe1BackToSearchProvider = function () {
            if ($rootScope.providerSearchKey !== '' && typeof $rootScope.providerSearchKey !== 'undefined') {
                $rootScope.backProviderSearchKey = $rootScope.providerSearchKey;
            }
            $state.go('tab.searchprovider');
        }
        $('.hospitalDynamicLink').click(function () {
            var url = 'https://' + $rootScope.hospitalDomainName + '/public/#/UserTerms';
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        });

        $rootScope.backtoPreviousPage = function () {
            $state.go($rootScope.frontPage);
        }
        $rootScope.backtoPreviousPagefromReg = function () {
            if (deploymentEnvLogout === "Single") {
                $state.go('tab.loginSingle');
            } else {
                $state.go('tab.searchprovider');
            }
        }


        /* $scope.registerStepBack=function(){
           history.back();
           $scope.$apply();
      }*/


    })

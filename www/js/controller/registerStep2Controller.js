angular.module('starter.controllers')
    .controller('registerStep2Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
      $rootScope.drawSVGCIcon = function(iconName){
          return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName +"'></use></svg>";
      };

        $rootScope.isRegistrationCompleted = false;
        $ionicPlatform.registerBackButtonAction(function(event, $state) {
            if (($rootScope.currState.$current.name == "tab.userhome") ||
                ($rootScope.currState.$current.name == "tab.addCard") ||
                ($rootScope.currState.$current.name == "tab.submitPayment") ||
                ($rootScope.currState.$current.name == "tab.waitingRoom") ||
                ($rootScope.currState.$current.name == "tab.receipt") ||
                ($rootScope.currState.$current.name == "tab.videoConference") ||
                ($rootScope.currState.$current.name == "tab.connectionLost") ||
                ($rootScope.currState.$current.name == "tab.ReportScreen")
            ) {
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states.
                // Do nothing here to disable H/W back button.
            } else if ($rootScope.currState.$current.name == "tab.login") {
                navigator.app.exitApp();
            } else if ($rootScope.currState.$current.name == "tab.loginSingle") {
                navigator.app.exitApp();
            } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
                navigator.app.exitApp();
            } else if ($rootScope.currState.$current.name == "tab.cardDetails") {
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

        $scope.regStep2 = {};

  $rootScope.postRegistersStep2 = function() {

      var selectedDob = document.getElementById('dob').value;
      var now = new Date();
      var dt1 = Date.parse(now),
      dt2 = Date.parse(selectedDob);


            $scope.reg2email=$('#RegEmail').val();
            $scope.ValidateEmail = function(email) {
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };
            var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;

            if (typeof $scope.reg2email == 'undefined' ||$scope.reg2email == '') {
                $scope.ErrorMessage = "Please enter your Email Address";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            }  else if(!$scope.ValidateEmail($("#RegEmail").val())){


                    $scope.ErrorMessage = "Please enter a valid Email Address";
                    $scope.$root.$broadcast("callValidation", {
                        errorMsg: $scope.ErrorMessage
                    });
                }

                else if (typeof $scope.regStep2.password == 'undefined' || $scope.regStep2.password == '') {
                $scope.ErrorMessage = "Please enter your Password";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (!pwdRegularExpress.test($scope.regStep2.password)) {
                $scope.ErrorMessage = "Your Password must be between 8 and 20 characters. It must contain at least one upper and lower case letter and at least one number";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (/\s/.test($scope.regStep2.password)) {
                $scope.ErrorMessage = "Password must not contain white spaces";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (typeof $scope.regStep2.confirmPwd == 'undefined' || $scope.regStep2.confirmPwd == '') {
                $scope.ErrorMessage = "Please enter your Confirm Password";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if ($scope.regStep2.password != $scope.regStep2.confirmPwd) {
                $scope.ErrorMessage = "Password mismatch";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (typeof $scope.regStep2.dob == 'undefined' || $scope.regStep2.dob == '' || $scope.regStep2.dob == null) {
                $scope.ErrorMessage = "Please select your Birthdate";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            }else if (dt2 >dt1) {
               $scope.ErrorMessage = "DOB can not be in Future";
               $rootScope.Validation($scope.ErrorMessage);
           } else {
                $scope.doPostUserRegisterDetails();
                return false;
            }

        }
        $rootScope.callRegisterFunction = function(){
          $rootScope.postRegistersStep2();
        }
        $scope.backregister=function(){
          $state.go('tab.registerStep1');
        }

        $rootScope.doPostUserRegisterDetails = function() {
            $scope.userFirstandLastName = {
                "$id": "2",
                "first": $rootScope.step1RegDetails[0].FName,
                "last": $rootScope.step1RegDetails[0].LName
            }
            var params = {
                address: $rootScope.step1RegDetails[0].address,
                dob: $scope.regStep2.dob,
                email: $scope.reg2email,
                name: $scope.userFirstandLastName,
                password: $scope.regStep2.password,
                providerId: $rootScope.hospitalId,
                success: function(data) {
                    $rootScope.isRegistrationCompleted = true;
                    console.log(data);
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
        }
        $scope.GoBackToStep1 = function() {
          $state.go('tab.registerStep1');
        }

    })

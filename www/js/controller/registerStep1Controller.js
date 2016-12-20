angular.module('starter.controllers')
    .controller('registerStep1Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
        $ionicPlatform.registerBackButtonAction(function() {
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


        $rootScope.postRegisterStep1 = function() {
            step1PostRegDetailsService.ClearPostRgDetails();
            step1PostRegDetailsService.addPostRegDetails($rootScope.regStep1);
            $scope.doChkAddressForReg($rootScope.regStep1);
            /*if (typeof $rootScope.regStep1.FName === 'undefined' || $rootScope.regStep1.FName === '') {
                $scope.ErrorMessage = "Please enter your First Name";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (typeof $rootScope.regStep1.LName === 'undefined' || $rootScope.regStep1.LName === '') {
                $scope.ErrorMessage = "Please enter your Last Name";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (typeof $rootScope.regStep1.address === 'undefined' || $rootScope.regStep1.address === '') {
                $scope.ErrorMessage = "Please enter your Full Address";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else {
                step1PostRegDetailsService.addPostRegDetails($rootScope.regStep1);
                $scope.doChkAddressForReg($rootScope.regStep1);
            }*/
        }

        $scope.doChkAddressForReg = function(regStep1) {
          var params = {
              AddressText: regStep1.address,
              HospitalId: $rootScope.hospitalId,
              accessToken: $rootScope.accessToken,
              success: function(data) {
                    if(data.data[0].isAvailable === true) {
                      $state.go('tab.registerStep2');
                      $rootScope.step1RegDetails = step1PostRegDetailsService.getPostRegDetails();
                    } else {
                      $state.go('tab.registerAddress');
                    }
              },
              error: function(data) {
                if(data ==='null' ){
               $scope.ErrorMessage = "Internet connection not available, Try again later!";
               $rootScope.Validation($scope.ErrorMessage);
             }else{
                 $rootScope.serverErrorMessageValidation();
             }
              }
          };

          LoginService.chkAddressForReg(params);
        }

        $scope.registerStpe1BackToSearchProvider = function() {
            if ($rootScope.providerSearchKey !== '' && typeof $rootScope.providerSearchKey !== 'undefined') {
                $rootScope.backProviderSearchKey = $rootScope.providerSearchKey;
            }
            $state.go('tab.searchprovider');
        }

    })

angular.module('starter.controllers')
    .controller('registerStep1Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
        $rootScope.isRegistrationCompleted = false;
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
        $scope.fnameBlur=function(){
          $scope.fnameerror =false;
        }
        $scope.lnameBlur=function(){
          $scope.lnameerror =false;
        }
        $scope.genderBlur=function(){
          $scope.gendererror =false;
        }
        $scope.addressBlur=function(){
          $scope.adderror=false;
        }
        $scope.ValidateEmail = function(email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };
        var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;
        $scope.emailBlur = function() {
          $scope.emailmanderror =false;
          $scope.emailexisterror=false;
            $('.regemail').removeClass("emailbackground");
            var emailvalue = $('#regEmail').val();
            if (emailvalue !== '') {
                if (!$scope.ValidateEmail($("#regEmail").val())) {
                    $scope.emailerror =true;
                }else{
                    $scope.emailerror =false;
                }

            }
        }
        $scope.mobilelength = $("#regMobile").val().length;
        $scope.moblieBlur=function(){

         $scope.mobilelength = $("#regMobile").val().length;
          if ($scope.mobilelength < 14) {
            $scope.mobileerror = true;
          }
         else{
            $scope.mobileerror = false;
         }
        }
        $scope.pwdBlur=function(){
          if (!pwdRegularExpress.test($scope.regStep1.regPassword)) {
              $scope.pwderror =true;
              $scope.pwdspaceerror =false;
          } else if (/\s/.test($scope.regStep1.regPassword)) {
              $scope.pwdspaceerror =true;
                $scope.pwderror =false;
          }else{
            $scope.pwderror =false;
            $scope.pwdspaceerror =false;
          }
        }
        $scope.regdobs=function(){
          $scope.dobmanderror=false;
          var selectedDate = document.getElementById('regDOB').value;
          var now = new Date();
          var dt1 = Date.parse(now),
         dt2 = Date.parse(selectedDate);
                $rootScope.restrictage = getAge(selectedDate);
              if (dt2 >dt1) {
                 $scope.dobfuture = true;
                  $scope.doberror = false;
             } else if($rootScope.restrictage <= 11){
               $scope.doberror = true;
                $scope.dobfuture = false;
             }else{
                  $scope.doberror = false;
                   $scope.dobfuture = false;
             }
        }
        $scope.confirmpwdBlur=function(){
          if ($scope.regStep1.regPassword !== $scope.regStep1.regConfrmPassword) {
              $scope.cnfrmpwderror =true;
          }else{
              $scope.cnfrmpwderror =false;
          }
        }
        $rootScope.postRegisterStep1 = function() {

            $scope.fname=$('#regFName').val();
            $scope.lname=$('#regLName').val();
            $scope.gender=  $('#regGender').val();
            $scope.dob=  $('#regDOB').val();
            $scope.homeaddress= $('#regaddress').val();
            $scope.email= $('#regEmail').val();
            $scope.mobile=  $('#regMobile').val();
            $scope.password=  $('#regPassword').val();
            $scope.confirmPwd=$('#regConfrmPassword').val();
            var selectedDate = document.getElementById('regDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
           dt2 = Date.parse(selectedDate);
                  $rootScope.restrictage = getAge(selectedDate)

          if (typeof $scope.fname === 'undefined' ||$scope.fname === '') {
              $scope.fnameerror = true;
          }else if(typeof $scope.lname === 'undefined' ||$scope.lname === ''){
              $scope.lnameerror = true;
          }else if(typeof $scope.gender === 'undefined' ||$scope.gender === ''){
            $scope.gendererror = true;
          }else if(typeof $scope.dob === 'undefined' ||$scope.dob === ''){
            $scope.dobmanderror = true;
          }else if (dt2 > dt1) {
                $scope.dobfuture = true;
                $scope.doberror = false;
          }else if($rootScope.restrictage <= 11){
              $scope.doberror = true;
               $scope.dobfuture = false;
          }else if(typeof $scope.homeaddress === 'undefined' ||$scope.homeaddress === ''){
            $scope.adderror=true;
          }else if(typeof $scope.email === 'undefined' ||$scope.email === ''){
            $scope.emailmanderror=true;
          }else if(!$scope.ValidateEmail($("#regEmail").val())){
                $scope.emailerror=true;
          }else if(typeof $scope.mobile === 'undefined' ||$scope.mobile === ''){
            $scope.mobilemanderror=true;
          }else if ($scope.mobilelength < 14) {
              $scope.mobileerror=true;
          }  else if (typeof $scope.password === 'undefined' || $scope.password === '') {
            $scope.pwdmanderror=true;
         } else if (!pwdRegularExpress.test($scope.password)) {
            $scope.pwderror =true;
            $scope.pwdspaceerror =false;
         } else if (/\s/.test($scope.password)) {
             $scope.pwdspaceerror =true;
             $scope.pwderror =false;
         }else if (typeof $scope.confirmPwd === 'undefined' || $scope.confirmPwd === '') {
           $scope.confirmpwdmanderror=true;
        }else if ($scope.regStep1.regPassword !== $scope.regStep1.regConfrmPassword) {
            $scope.cnfrmpwderror =true;
        }else if($rootScope.customerSso=="Mandatory"){
          $scope.doPostNewSsoRegistration();
        }else{
            $scope.doPostRegistration();
        }

        }
        $scope.doPostNewSsoRegistration=function(){

            var params = {
              email: $scope.email,
              password:$scope.password,
              firstname: $scope.fname,
              lastname: $scope.lname,
              address: $scope.homeaddress,
              dob: $scope.dob,
              gender: $scope.gender,
              mobile: $scope.mobile,
              apiSsoURL:$rootScope.ssopatientregister,
              success: function() {
                  $rootScope.isRegistrationCompleted = true;
                  $rootScope.registedEmail = $scope.email;
                  $rootScope.registedPwd = $scope.password;
                  $state.go('tab.registerSuccess');
              },
              error: function(data,status) {
                  $rootScope.isRegistrationCompleted = false;
                  if(data.status == 400){
                    $scope.ErrorMessage = data.statusText.indexOf("already exists");
                    if($scope.ErrorMessage >= 0) {
                        $scope.contactmail=$scope.email;
                        var myPopup = $ionicPopup.show({

                            title      :"<div class=''><p class='fname emailext' ><b>Account Already Exists</b></p> </div> ",
                            templateUrl: 'templates/emailpopup.html',
                            scope: $scope,
                            buttons: [{
                                text: '<b class="fonttype">Edit Email</b>',
                                onTap: function(e) {
                                    return false;
                                }
                            }, {
                                text: '<b class="fonttype">Go to Login</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    return true;
                                }
                            }, ]
                        });

                        myPopup.then(function(res) {
                            if (res) {
                            $state.go('tab.loginSingle');
                            } else {
                                $('.regemail').addClass("emailbackground");
                                $scope.emailexisterror=true;
                            }
                        });
                        $scope.closepopup = function() {
                            myPopup.close();
                        }
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

    $scope.doPostRegistration=function(){
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
          providerId: $rootScope.hospitalId,
          success: function() {
              $rootScope.isRegistrationCompleted = true;
              $rootScope.registedEmail = $scope.email;
              $rootScope.registedPwd = $scope.password;
              $state.go('tab.registerSuccess');
          },
          error: function(data,status) {
              $rootScope.isRegistrationCompleted = false;
            /*  if (data.message.indexOf('already registered') > 0) {
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
            */
            if(data.status == 400){
              $scope.ErrorMessage = data.statusText.indexOf("already exists");
              if($scope.ErrorMessage >= 0) {
                  $scope.contactmail=$scope.email;
                  var myPopup = $ionicPopup.show({

                      title      :"<div class=''><p class='fname emailext' ><b>Account Already Exists</b></p> </div> ",
                      templateUrl: 'templates/emailpopup.html',
                      scope: $scope,
                      buttons: [{
                          text: '<b class="fonttype">Edit Email</b>',
                          onTap: function(e) {
                              return false;
                          }
                      }, {
                          text: '<b class="fonttype">Go to Login</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                              return true;
                          }
                      }, ]
                  });

                  myPopup.then(function(res) {
                      if (res) {
                      $state.go('tab.login');
                      } else {
                          $('.regemail').addClass("emailbackground");
                          $scope.emailexisterror=true;
                      }
                  });
                  $scope.closepopup = function() {
                      myPopup.close();
                  }
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

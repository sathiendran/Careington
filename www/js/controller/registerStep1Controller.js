angular.module('starter.controllers')
    .controller('registerStep1Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
       var localizeCurrent = $('#localize-current').text();
        if(localizeCurrent == "Español"){
            $rootScope.defaultAddressText = 'Por favor ingrese la dirección';
          }else{
            $rootScope.defaultAddressText = 'Please enter address';
          }

          $('#localize-langs').click(function() {
             var isLang = $('#localize-langs .activated').text();
             console.log("isLang isssss is== "+isLang);
               if(isLang == "Español"){
                  $rootScope.defaultAddressText = 'Por favor ingrese la dirección';
               }else{
                $rootScope.defaultAddressText = 'Please enter address';
               }

             isLang = "";
         });

        $rootScope.isRegistrationCompleted = false;
        var onePopupLimit = true;

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

        $scope.formatIsdCode = function(s,c,n) {
          String.prototype.repeat= function(n){
              n= n || 1;
              return Array(n+1).join(this);
          }
           if(s.length<n) {
             return s+c.repeat(n-s.length);
           } else {
            return s;
           }
        }

        $scope.fnameBlur=function(){
          $scope.fnameerror =false;
          $('.regstfname').removeClass("emailbackground");
        }
        $scope.lnameBlur=function(){
          $scope.lnameerror =false;
          $('.regstlname').removeClass("emailbackground");
        }
        $scope.genderBlur=function(){
          $scope.gendererror =false;
          setTimeout(function() {
            $("#localize-widget").show();
          }, 0);
          $('.regstgender').removeClass("emailbackground");
          $('.ssooption').removeClass("emailbackground");
        }


        $("#regGender").click(function() {
             $scope.isSelectDrop = true;
       });

       $("#regCountryCode").click(function() {
             $scope.isSelectDrop = true;
        });

        $(document).click(function() {
            if($scope.isSelectDrop) {
                setTimeout(function() {
                    $("#localize-widget").show();
                }, 0);
            }
        });

        $scope.countryBlur=function(){
          $scope.countryError =false;

          setTimeout(function() {
            $("#localize-widget").show();
          }, 0);

          $('.regstCountry').removeClass("emailbackground");
          $('.ssooptionCountry').removeClass("emailbackground");
          if (($('#regCountryCode').val() === 'Choose') || ($('#regCountryCode').val() === ' ')) {
                $("div.viewport").html('<div class="regCountryOpt">Choose</div>');
          } else {
                var selectedValue = $('#regCountryCode').val();
                $("div.viewport").html('<div class="regCountryOpt">'+selectedValue+'</div>');
          }

        }
        $scope.timeZoneBlur=function(){
          $scope.timeZoneError =false;
          $('.regstTimezone').removeClass("emailbackground");
          $('.ssooptionTimezone').removeClass("emailbackground");
        }
        $scope.addressBlur=function(){
          $scope.adderror=false;
          $('.regstaddress').removeClass("emailbackground");
        }
        $scope.ValidateEmail = function(email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };
        var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;
        $scope.emailBlur = function() {
        //  $scope.emailmanderror =false;
        //  $scope.emailexisterror=false;
          $scope.emailerrorSpan=false;

            $('.regemail').removeClass("emailbackground");
            var emailvalue = $('#regEmail').val();
            if (emailvalue !== '') {
                if (!$scope.ValidateEmail($("#regEmail").val())) {
                 //   $scope.emailerror =true;
                    $scope.emailerrorSpan=true;
                    $scope.emailerroralert = "Please enter valid email id";


                        $('.regemail').addClass("emailbackground");
                }else{
                    $scope.emailerror =false;
                }

            }
        }
        //$scope.mobilelength = $("#regMobile").val().length;
        $scope.moblieBlur=function(){

          $scope.mobileerrorSpan=false;
        //  $scope.mobilemanderror=false;
          $('.regstmobile').removeClass("emailbackground");
        //   $scope.mobileerror=false;
           $scope.mobilelength = $("#regMobile").val().length;
          if ($scope.mobilelength != 0 && $scope.mobilelength < 14) {
        //    $scope.mobilemanderror=false;
        //    $scope.mobileerror = true;
            $scope.mobileerrorSpan=true;
            $scope.mobileerroralert = "Please enter a valid mobile number";

              $('.regstmobile').addClass("emailbackground");
          } else{
          //  $scope.mobilemanderror=false;
          //  $scope.mobileerror = false;
              $scope.mobileerrorSpan=false;
              $scope.mobileerroralert = "";
         }
        }
        $scope.pwdBlur=function(){
          $('.regstpwd').removeClass("emailbackground");
          $scope.pwdmanderror=false;
          if (!pwdRegularExpress.test($scope.regStep1.regPassword)) {
              $scope.pwderror =true;
              $scope.pwdspaceerror =false;
              $('.regstpwd').addClass("emailbackground");
          } else if (/\s/.test($scope.regStep1.regPassword)) {
              $scope.pwdspaceerror =true;
                $scope.pwderror =false;
                $('.regstpwd').addClass("emailbackground");
          }else{
            $scope.pwderror =false;
            $scope.pwdspaceerror =false;
            $('.regstpwd').removeClass("emailbackground");
          }
        }
        $scope.regdobs=function(){
            $('.regstdob').removeClass("emailbackground");
          $scope.dobmanderror=false;
          var selectedDate = document.getElementById('regDOB').value;
          var now = new Date();
          var dt1 = Date.parse(now),
         dt2 = Date.parse(selectedDate);
                $rootScope.restrictage = getAge(selectedDate);
              if (dt2 >dt1) {
                 $scope.dobfuture = true;
                  $scope.doberror = false;
                  $('.regstdob').addClass("emailbackground");
             } else if($rootScope.restrictage <= 11){
               $scope.doberror = true;
                $scope.dobfuture = false;
                  $('.regstdob').addClass("emailbackground");
             }else{
                  $scope.doberror = false;
                   $scope.dobfuture = false;
             }
        }
        $scope.confirmpwdBlur=function(){
          $scope.cnfrmpwderror =false;
          $('.regstconpwd').removeClass("emailbackground");
          if ($scope.regStep1.regPassword !== $scope.regStep1.regConfrmPassword) {
              $scope.cnfrmpwderror =true;
              $('.regstconpwd').addClass("emailbackground");
          }else{
              $scope.cnfrmpwderror =false;
          }
        }


        $rootScope.postRegisterStep1 = function() {
            $scope.emailerrorSpan=false;
            $scope.fname=$('#regFName').val();
            $scope.lname=$('#regLName').val();
            $scope.gender=  $('#regGender').val();
            $scope.dob=  $('#regDOB').val();
            $scope.homeaddress= $('#regaddress').val();
            $scope.email= $('#regEmail').val();
            $scope.mobile=  $('#regMobile').val();
            $scope.regCountry2 =  $('#regCountryCode').val();
            if($('#regCountryCode').val() == 'Choose') {
                $scope.regCountry2 =  $rootScope.regCountry2
            }

            //  $scope.regCountryCode =  $scope.regCountry2[0];
            //  $scope.regCountryName =  $scope.regCountry2[1];
          //  $scope.regTimezone =  $('#regTimezone').val();
            $scope.password=  $('#regPassword').val();
            $scope.confirmPwd=$('#regConfrmPassword').val();
            var selectedDate = document.getElementById('regDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
           dt2 = Date.parse(selectedDate);
                  $rootScope.restrictage = getAge(selectedDate)

          if (typeof $scope.fname === 'undefined' ||$scope.fname === '') {
              $scope.fnameerror = true;
                $('.regstfname').addClass("emailbackground");
          }else if(typeof $scope.lname === 'undefined' ||$scope.lname === ''){
              $scope.lnameerror = true;
                $('.regstlname').addClass("emailbackground");
          }else if(typeof $scope.gender === 'undefined' ||$scope.gender === ''){
            $scope.gendererror = true;
              $('.regstgender').addClass("emailbackground");
              $('.ssooption').addClass("emailbackground");
          }else if(typeof $scope.dob === 'undefined' ||$scope.dob === ''){
            $scope.dobmanderror = true;
              $('.regstdob').addClass("emailbackground");
          }else if (dt2 > dt1) {
                $scope.dobfuture = true;
                $scope.doberror = false;
          }else if($rootScope.restrictage <= 11){
              $scope.doberror = true;
               $scope.dobfuture = false;
          }else if(typeof $scope.homeaddress === 'undefined' ||$scope.homeaddress === ''){
            $scope.adderror=true;
              $('.regstaddress').addClass("emailbackground");
          }else if(typeof $scope.email === 'undefined' ||$scope.email === ''){
            $('.regemail').addClass("emailbackground");
            $scope.emailerrorSpan=true;
            $scope.emailerroralert = "Please enter your email id";

          //  $scope.emailmanderror=true;
          }else if(!$scope.ValidateEmail($("#regEmail").val())){
                $scope.emailerror=true;
          }else if(typeof $scope.mobile === 'undefined' ||$scope.mobile === ''){
            $('.regstmobile').addClass("emailbackground");
          //  $scope.mobileerror=false;
          //  $scope.mobilemanderror=true;



            $scope.mobileerrorSpan=true;
            $scope.mobileerroralert = "Please enter a mobile number";


          }else if(typeof $scope.regCountry2 === 'undefined' || $scope.regCountry2 === '' || $scope.regCountry2 === 'Choose'){
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
          }else if ($scope.mobilelength < 14) {
            //   $scope.mobileerror=true;
          //     $scope.mobilemanderror=false;

               $scope.mobileerrorSpan=true;
               $scope.mobileerroralert = "Please enter a valid mobile number";



          }  else if (typeof $scope.password === 'undefined' || $scope.password === '') {
            $('.regstpwd').addClass("emailbackground");
            $scope.pwdmanderror=true;
         } else if (!pwdRegularExpress.test($scope.password)) {
            $scope.pwderror =true;
            $scope.pwdspaceerror =false;
         } else if (/\s/.test($scope.password)) {
             $scope.pwdspaceerror =true;
             $scope.pwderror =false;
         }else if (typeof $scope.confirmPwd === 'undefined' || $scope.confirmPwd === '') {
           $('.regstconpwd').addClass("emailbackground");
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
                     //   var emailerror = data.data.message;
                   //  $scope.ErrorMessage = "Email address already registered.";
                     //if($scope.ErrorMessage === emailerror) {
                  if (data.data.message.indexOf('already registered') > 0) {
                   $scope.contactmail=$scope.email;
                        var myPopup = $ionicPopup.show({

                            title      :"<div class=''><p class='fname emailext localizejs' ><b>Account Already Exists</b></p> </div> ",
                            templateUrl: 'templates/emailpopup.html',
                            scope: $scope,
                            buttons: [{
                                text: '<b class="fonttype localizejs">Edit Email</b>',
                                onTap: function(e) {
                                    return false;
                                }
                            }, {
                                text: '<b class="fonttype localizejs">Go to Login</b>',
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
                               // $scope.emailexisterror=true;
                                $scope.emailerrorSpan=true;
                                $scope.emailerroralert = "An account with this email already exist.";

                            }
                        });
                        $scope.closepopup = function() {
                            myPopup.close();
                        }
                    } else {
                      $scope.ErrorMessage = data.statusText;
                      $rootScope.Validation($scope.ErrorMessage);
                    }
                  } else if(status === 503) {
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

    $scope.doPostRegistration=function(){
      $scope.userFirstandLastName = {
          "$id": "2",
          "first": $scope.fname,
          "last": $scope.lname
      }
      var params = {
          address: '',
          addressObject: $rootScope.fullAddressObj,
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
          success: function(data) {
            $rootScope.addressInfoFetch = [];
                angular.forEach(data.data, function(index) {
                     $rootScope.addressInfoFetch.push({
                            'address': index.address,
                            'addresses': angular.fromJson(index.addresses),
                            'addressObject': angular.fromJson(index.addressObject),
                        });
                });
              $rootScope.isRegistrationCompleted = true;
              $rootScope.registedEmail = $scope.email;
              $rootScope.registedPwd = $scope.password;
              $state.go('tab.registerSuccess');
          },
          error: function(data,status) {
              $rootScope.isRegistrationCompleted = false;
              if(data.status == 400){
                  //   var emailerror = data.data.message;
                //  $scope.ErrorMessage = "Email address already registered.";
                  //if($scope.ErrorMessage === emailerror) {
               if (data.data.message.indexOf('already registered') > 0) {
                    $scope.contactmail=$scope.email;
                if(onePopupLimit) {
                  onePopupLimit = false;
                  var myPopup = $ionicPopup.show({

                      title      :"<div class=''><p class='fname emailext localizejs' ><b>Account Already Exists</b></p> </div> ",
                      templateUrl: 'templates/emailpopup.html',
                      scope: $scope,
                      buttons: [{
                          text: '<b class="fonttype localizejs">Edit Email</b>',
                          onTap: function(e) {
                            onePopupLimit = true;
                              return false;
                          }
                      }, {
                          text: '<b class="fonttype localizejs">Go to Login</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                            onePopupLimit = true;
                              return true;
                          }
                      }, ]
                  });
                }
                  myPopup.then(function(res) {
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
                          //$scope.emailexisterror=true;
                          $scope.emailerrorSpan=true;
                          $scope.emailerroralert = "An account with this email already exist.";

                      }
                  });
                  $scope.closepopup = function() {
                    onePopupLimit = true;
                      myPopup.close();
                  }
              } else if(status === 503) {
                $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
              } else if(data.statusText == "Bad Request" && data.status == 400){
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



















 $rootScope.editremovemodal = function () {
   $("#localize-widget").show();
    $('.regFooter').css("display","block");
            $scope.modal.remove()
                .then(function () {
                  $scope.regStep1.homeadd= $scope.oldfullAddress;
                  $scope.route = $scope.oldroute;
                  $scope.address2 = $scope.oldaddress2;
                  $scope.City =  $scope.oldCity;
                  $scope.ZipCode = $scope.oldZipCode;
                  $scope.Country = $scope.oldCountry;
                  if($scope.Country == 'US')
                  {
                    $scope.showCountrySelectBox = true;
                  }else{
                    $scope.showCountrySelectBox = false;
                  }
                  $scope.state1 = $scope.oldstate1;
                  $scope.State =   $scope.oldState;
                    $scope.modal = null;
                });
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();

        };

  /*$scope.doGetCountries = function() {
          var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {

                    $scope.CountryList = data;
                    console.log($scope.CountryList);
              },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getCountriesList(params);
      }

        $scope.getStatesForUS = function(){
            var params = {
                accessToken : $rootScope.accessToken,
                success:function(data){
                    //alert("enter");
                        $scope.usStates = data;
                        //console.log($scope.usStates);
                },
                error:function(data,status){
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getStatesForUS(params);
        }*/
        $rootScope.ValidationReg = function ($a) {
            $('.ContinueAddressBtn').css({'display':'none'});
            $('.CancelAddressBtn').css({'display':'none'});
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                    setTimeout(function(){
                    $('.ContinueAddressBtn').css({'display':'block'});
                    $('.CancelAddressBtn').css({'display':'block'});
                    },100)
                });
            }
            refresh_close();
            var top = '<div class="notifications-top-center notificationError" style="height: 58px;"><div class="ErrorContent localizejs" style="margin-top: 5px !important;"> <i class="ion-alert-circled" style="font-size: 23px;"></i> ' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".ErrorMessageReg").append(top);
            refresh_close();
         }

        $scope.addressEditSave = function(){
           $('.regFooter').css("display","block");
          //if(document.getElementById('fullAddress').value != 'Please enter address' )
          $scope.countryValue = document.getElementById('country').value;
          if($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country' ) {
            $scope.ErrorMessage = "Please select Country";
            $rootScope.ValidationReg($scope.ErrorMessage);
          } else if($scope.countryValue == 'Select Country') {
            $scope.ErrorMessage = "Please select Country";
            $rootScope.ValidationReg($scope.ErrorMessage);
          } else {
            $('.ContinueAddressBtn').css({'display':'block'});
            $('.CancelAddressBtn').css({'display':'block'});
          }
          if(document.getElementById('fullAddress').value != $rootScope.defaultAddressText )
          {
    		      var stateObj  = '';
              var countryFetch  = '';
              var countryCodeFetch  = '';
              var stateCodeFetch  = '';
              $scope.regStep1.homeadd =  document.getElementById('fullAddress').value;
              $scope.route = document.getElementById('txtPlaces').value;
              $scope.address2 = document.getElementById('address2').value;
              $scope.City = document.getElementById('city').value;

                var element =  document.getElementById('state');
                if (typeof(element) != 'undefined' && element != null)
                {
                   $scope.State = document.getElementById('state').value;
                   stateCodeFetch = document.getElementById('state').options[document.getElementById('state').selectedIndex].getAttribute("data-state-code");
                   stateObj = $scope.State;
                }

                  var element =  document.getElementById('state1');
                if (typeof(element) != 'undefined' && element != null)
                {
                  $scope.state1 = document.getElementById('state1').value;
                  stateCodeFetch = $scope.state1;
                  stateObj = $scope.state1;
                }



              $scope.ZipCode = document.getElementById('zipcode').value;
              $scope.Country = document.getElementById('country').value;
              if($scope.Country == 'US')
              {
                $scope.showCountrySelectBox = true;
              }else{
                $scope.showCountrySelectBox = false;
              }
              var countryFetch = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
              var countryCodeFetch = document.getElementById('country').value;

              var res = new Object();
              res['city'] = $scope.City;
              res['country'] = countryFetch;
              res['countryCode'] = countryCodeFetch;
              res['line1'] = $scope.route;
              res['line2'] = $scope.address2;
              res['postalCode'] = $scope.ZipCode;
              res['state'] = stateObj;
              res['stateCode'] = stateCodeFetch;

              $rootScope.fullAddressObj = res;
              //console.log($rootScope.fullAddressObj);
              if($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country' ) {
                
                } else {
                    $scope.modal.remove()
                    .then(function () {
                        $scope.modal = null;
                    });
                }
              }

        }
        $scope.changeCountry = function(){
            var country = document.getElementById('country').value;
            if(country == 'Select Country')
            {
               $scope.imageName = '';
            }
        }
        $scope.makeAddress=function(){
            var txtPlaces = document.getElementById('txtPlaces').value;
            var address2 = document.getElementById('address2').value;
            var city = document.getElementById('city').value
            var element =  document.getElementById('state');
            if (typeof(element) != 'undefined' && element != null)
            {
               if(document.getElementById('state').value != '' && document.getElementById('state').value != 'Select State')
                var state = document.getElementById('state').value;
            }
            var element =  document.getElementById('state1');
            if (typeof(element) != 'undefined' && element != null)
            {
               if(document.getElementById('state1').value != '' )
                var state = document.getElementById('state1').value;
            }
            var zipcode = document.getElementById('zipcode').value;
            if(document.getElementById('country').value != 'Select Country' )
            {

                        var country = document.getElementById('country').value;
                        $scope.imageName = 'images/countries/flags/'+country+'-32.png';
            }
            if(document.getElementById('country').value == 'US')
            {
              $scope.showCountrySelectBox  = true;
            }else{
              $scope.showCountrySelectBox  = false;
            }
            var res = new Object();
            res['txtPlaces'] = txtPlaces;
            res['address2'] = address2;
            res['city'] = city;
            res['state'] = state;
            res['zipcode'] = zipcode;
            res['country'] = country;
            var fullAddressCombo = '';
            var c = Object.keys(res).length;
            var count = 0;
            for(var i in res)
            {
                count++;
             if(res[i] != '' && res[i] != undefined && res[i].indexOf('?') == -1)
                 {
                     if(count != c)
                        {
                              fullAddressCombo = fullAddressCombo+res[i]+', ';
                        }else{
                            fullAddressCombo = fullAddressCombo+res[i];
                        }

                 }
            }

            if(fullAddressCombo.length != 0 && fullAddressCombo!=', ' && fullAddressCombo !=',' )
                            document.getElementById('fullAddress').value = fullAddressCombo;
            if(fullAddressCombo.length == 0 || fullAddressCombo == ', ' || fullAddressCombo ==',' )
                            document.getElementById('fullAddress').value = $rootScope.defaultAddressText;
                            //document.getElementById('fullAddress').value = "Please enter address";
        }




    $scope.disableTap = function(){


        document.getElementById('txtPlaces').addEventListener('keypress', function(e) {
        if (event.which == 13 || event.keyCode == 13 && document.getElementsByClassName('pac-container:visible').length) {
        /* validate your form here and submit your form */
           // document.forms[0].submit();
            return true;
        }
        return true;
        });


      /*  document.getElementById('txtPlaces').keydown(function (e) {
          if (e.which == 13 && $('.pac-container:visible').length)
           return false;
        });*/
    }

    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
                //    google.maps.event.addListener(autocomplete, 'place_changed', fillAddress);
   $rootScope.Widgetshow = function(){
     $("#localize-widget").show();
   }
        $scope.addressEditModal = function () {
           $("#localize-widget").hide();
            //$('#healthInfoHeightUnit').val("");
            $('#regDOB').blur();
            $ionicModal.fromTemplateUrl('templates/tab-addressedittemplate.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show().then(function () {
                $("#localize-widget").hide();
                  var AddrText = '';

                  if(document.getElementById('regaddress').value == '')
                  {
                    //AddrText  = 'Please enter address';
                    AddrText  = $rootScope.defaultAddressText;
                  }else{
                    AddrText  = document.getElementById('regaddress').value;
                  }
                  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
                                  google.maps.event.addListener(autocomplete, 'place_changed', fillAddress);
                document.getElementById('fullAddress').value = AddrText;
                document.getElementById('country').value = $scope.Country;
                if($scope.state1 == undefined)
                    $scope.state1 = '';
                if($scope.State == undefined)
                    $scope.State = '';
                  $scope.oldfullAddress =  document.getElementById('fullAddress').value;
                  $scope.oldroute =  document.getElementById('txtPlaces').value;
                  $scope.oldaddress2 = document.getElementById('address2').value;
                  $scope.oldCity = document.getElementById('city').value;
                  $scope.oldZipCode = document.getElementById('zipcode').value;
                  $scope.oldCountry = document.getElementById('country').value;
		  $scope.imageName = 'images/countries/flags/'+$scope.oldCountry+'-32.png';
                var element =  document.getElementById('state1');
                        if (typeof(element) != 'undefined' && element != null)
                            {
                                document.getElementById('state1').value = $scope.state1;
                                $scope.oldstate1 = document.getElementById('state1').value;

                            }
                 var element =  document.getElementById('state');
                        if (typeof(element) != 'undefined' && element != null)
                            {
                                document.getElementById('state').value = $scope.State;
                                $scope.oldState = document.getElementById('state').value;
                            }
                //var location_input = document.getElementById('txtPlaces');
                //var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
                var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
                google.maps.event.addListener(autocomplete, 'place_changed', fillAddress);
                setTimeout(function(){
                    var container = document.getElementsByClassName('pac-container');
                    container = angular.element(container);
                    // Apply css to ensure the container overlays the other elements, and
                    // events occur on the element not behind it
                    container.css('z-index', '5000');
                    container.css('pointer-events', 'auto');
                    // Disable ionic data tap
                    container.attr('data-tap-disabled', 'true');
                    // Leave the input field if a prediction is chosen
                    container.on('click', function(e){
                        //input.blur();
                        e.preventDefault();
                        document.getElementById('txtPlaces').blur();
                    });
                }, 2000);
                //google.maps.event.addDomListener(document.getElementById("pac-input"), 'blur', fillAddress);
                //document.getElementById('txtPlaces').addEventListener('click', fillAddress);
                function fillAddress()
                {
                var place = autocomplete.getPlace();
                $scope.$apply(function() {
                    $scope.route = '';
                    $scope.address2 = '';
                    $scope.City = '';
                    $scope.ZipCode = '';
                    $scope.State = '';
                    $scope.state1 = '';
                    $scope.Country = '';
                    $scope.vsPlace = place;
                    for(var k = 0; k < place.address_components.length; k++){


                      if(place.address_components[k].types.indexOf("street_number") >= 0){
                                $scope.street = place.address_components[k].long_name;
                            }
                            if(place.address_components[k].types.indexOf("route") >= 0){
                                $scope.route = place.address_components[k].short_name;
                                if($scope.street != '' && $scope.street != null && $scope.street != undefined)
                                {
                                      $scope.route = $scope.street + ' ' + $scope.route;
                                }
                            }
                            /*
                            if(place.address_components[k].types.indexOf("route") >= 0){
                                $scope.route = place.address_components[k].short_name;
                            }*/
                            if(place.address_components[k].types.indexOf("sublocality_level_1") >= 0){
                                $scope.sublocality1 = place.address_components[k].long_name;
                            }
                            if(place.address_components[k].types.indexOf("locality") >= 0){
                                $scope.City = place.address_components[k].long_name;
                            }
                            if(place.address_components[k].types.indexOf("administrative_area_level_2") >= 0){
                                $scope.district = place.address_components[k].long_name;
                            }
                            if(place.address_components[k].types.indexOf("postal_code") >= 0){
                                $scope.ZipCode = Number(place.address_components[k].long_name);
                            }
                            if(place.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                                $scope.State = place.address_components[k].long_name;
                                $scope.StateCode = place.address_components[k].short_name;
                            }
                            if(place.address_components[k].types.indexOf("country") >= 0){
                                $scope.Country = place.address_components[k].short_name;
                                if($scope.Country == "US")
                                {
                                   $scope.showCountrySelectBox  = true;
                                }else{
                                  $scope.showCountrySelectBox  = false;
                                     $scope.state1 =  $scope.State;
                                     $scope.State = '';
                                }
                            }
                        }
                        document.getElementById('txtPlaces').value = $scope.route;
                        document.getElementById('city').value = $scope.City;
                        document.getElementById('address2').value = '';
                        var element =  document.getElementById('state');
                        if (typeof(element) != 'undefined' && element != null)
                                document.getElementById('state').value = $scope.State;
                        var element =  document.getElementById('state1');
                        if (typeof(element) != 'undefined' && element != null)
                                document.getElementById('state1').value = $scope.state1;
                        document.getElementById('zipcode').value = $scope.ZipCode;
                        document.getElementById('country').value = $scope.Country;
                        $scope.imageName = 'images/countries/flags/'+$scope.Country+'-32.png';
                        if($scope.State != '')
                            var state = $scope.StateCode;
                        if($scope.state1 != '')
                            var state = $scope.state1;
                        var txtPlaces = $scope.route;
                        var city = $scope.City;
                        //var state = $scope.State;
                        var zipcode = $scope.ZipCode;
                        var country = $scope.Country;
                        var res = new Object();
                        res['txtPlaces'] = txtPlaces;
                        res['city'] = city;
                        res['state'] = state;
                        res['zipcode'] = zipcode;
                        res['country'] = country;
                        var fullAddressCombo = '';
                        var c =  Object.keys(res).length;
                        var count = 0;
                        for(var i in res)
                        {
                         if(res[i] != ',' && res[i] != ' ,' && res[i] != '' && res[i] != undefined)
                             {
                                count++;
                                if(count != c)
                                    {
                                          fullAddressCombo = fullAddressCombo+res[i]+', ';
                                    }else{
                                        fullAddressCombo = fullAddressCombo+res[i];
                                    }
                             }
                        }
                        if(fullAddressCombo.length != 0 && fullAddressCombo!=', ' && fullAddressCombo !=',' )
                            document.getElementById('fullAddress').value = fullAddressCombo;
                        if(fullAddressCombo.length == 0 || fullAddressCombo ==', ' || fullAddressCombo ==',' )
                            document.getElementById('fullAddress').value = $rootScope.defaultAddressText;
                            //document.getElementById('fullAddress').value = "Please enter address";

                });

             }
        });
     });

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
              error: function(data,status) {
                if(data ==='null' ){
               $scope.ErrorMessage = "Internet connection not available, Try again later!";
               $rootScope.Validation($scope.ErrorMessage);
             } else if(status === 503) {
               $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
             } else{
                 $rootScope.serverErrorMessageValidation();
             }
              }
          };

          LoginService.chkAddressForReg(params);
        }
        $scope.change = function()
        {
          var isVisible = $cordovaKeyboard.isVisible();

        }
$("#localize-widget").show();
        $scope.registerStpe1BackToSearchProvider = function() {
            if ($rootScope.providerSearchKey !== '' && typeof $rootScope.providerSearchKey !== 'undefined') {
                $rootScope.backProviderSearchKey = $rootScope.providerSearchKey;
            }
            $state.go('tab.searchprovider');
        }
        $('.hospitalDynamicLink').click(function() {
            var url = 'https://' + $rootScope.hospitalDomainName + '/public/#/UserTerms';
            window.open(encodeURI(url), '_system', 'location=yes');
            return false;
        });

        $rootScope.backtoPreviousPage = function() {
           $state.go($rootScope.frontPage);
       }
       $rootScope.backtoPreviousPagefromReg = function() {
         if (deploymentEnvLogout === "Single") {
             $state.go('tab.loginSingle');
         } else {
             $state.go('tab.searchprovider');
         }
      }


      //Language changer
    var localizeCurrent = $('#localize-current').text();
    console.log("lang "+localizeCurrent);
      if(localizeCurrent == "Español") {
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
      $rootScope.YESMessageProviderSearch='Sí';
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
      $rootScope.YESMessageProviderSearch='Sí';
      }

    else  {
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
     $rootScope.YESMessageProviderSearch='Yes';
     $rootScope.NaviConfirmation = 'Confirmation:';
     $rootScope.alertTimedout = "Your session timed out.";
     $rootScope.alertokay = "Ok";
     $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
     $rootScope.alertconsultationfailed = "Failed to save consultation!";
     $rootScope.alertMsg = "A verification email has been sent to the user.";
     $rootScope.alertokay = "Ok";
     $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
     $rootScope.alertMsgvideo = "Consultation ended successfully!";
     $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
     $rootScope.consultEndMeg = 'Your consultation is already ended.';
     $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
     $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
     $rootScope.sessAlertDone = 'Done';$rootScope.alertMsgConference = "Consultation ended successfully!";
     $rootScope.Buttonmsg = "Done";
     $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
     $rootScope.consultAlredComplMsg = 'Consultation already completed!';
     $rootScope. NaviConfirmation = 'Confirmation:';
     $rootScope. YESMessageProviderSearch='Yes';
      }


     $('#localize-langs').click(function() {
       var isLang = $('#localize-langs .activated').text();
         console.log("lang "+isLang);
         if(isLang == "Español") {
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
           $rootScope.YESMessageProviderSearch='Sí';
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
          $rootScope.YESMessageProviderSearch='Sí';
         }
          else{
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
               $rootScope.YESMessageProviderSearch='Yes';
               $rootScope.NaviConfirmation = 'Confirmation:';
               $rootScope.alertTimedout = "Your session timed out.";
               $rootScope.alertokay = "Ok";
               $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
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
               $rootScope. NaviConfirmation = 'Confirmation:';
               $rootScope. YESMessageProviderSearch='Yes';
          }
        });

//end

       /* $scope.registerStepBack=function(){
          history.back();
          $scope.$apply();
     }*/


    })

angular.module('starter.controllers')
    .controller('registerStep2Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
      $rootScope.drawSVGCIcon = function(iconName){
          return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName +"'></use></svg>";
      };
$("#localize-widget").show();

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

        $scope.regStep2 = {};

  $rootScope.postRegistersStep2 = function() {

      var selectedDob = document.getElementById('dob').value;
      var now = new Date();
      var dt1 = Date.parse(now),
      dt2 = Date.parse(selectedDob);
      $rootScope.restrictage = getAge(selectedDob);

            $scope.reg2email=$('#RegEmail').val();
            $scope.ValidateEmail = function(email) {
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };
            var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;

            if (typeof $scope.reg2email === 'undefined' ||$scope.reg2email === '') {
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

                else if (typeof $scope.regStep2.password === 'undefined' || $scope.regStep2.password === '') {
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
            } else if (typeof $scope.regStep2.confirmPwd === 'undefined' || $scope.regStep2.confirmPwd === '') {
                $scope.ErrorMessage = "Please enter your Confirm Password";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if ($scope.regStep2.password !== $scope.regStep2.confirmPwd) {
                $scope.ErrorMessage = "Password mismatch";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            } else if (typeof $scope.regStep2.dob === 'undefined' || $scope.regStep2.dob === '' || $scope.regStep2.dob === null) {
                $scope.ErrorMessage = "Please select your Birthdate";
                $scope.$root.$broadcast("callValidation", {
                    errorMsg: $scope.ErrorMessage
                });
            }else if (dt2 >dt1) {
               $scope.ErrorMessage = "DOB can not be in Future";
               $rootScope.Validation($scope.ErrorMessage);
           } else if($rootScope.restrictage <= 11){
             $scope.ErrorMessage = "You should be atleast 12 years old to register";
             $rootScope.Validation($scope.ErrorMessage);
           }

           else {
             if($rootScope.customerSso == "Mandatory"){
               $rootScope.doPostSsoUserRegisterDetails();
                return false;
             }else{
                $rootScope.doPostUserRegisterDetails();
               return false;
             }


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
                success: function() {
                    $rootScope.isRegistrationCompleted = true;
                    $rootScope.registedEmail = $scope.reg2email;
                    $rootScope.registedPwd = $scope.regStep2.password;
                    $state.go('tab.registerSuccess');
                },
                error: function(data,status) {
                    $rootScope.isRegistrationCompleted = false;
                    if (data.message.indexOf('already registered') > 0) {
                        navigator.notification.alert(
                            data.message, // message
                            function() {},
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.$root.$broadcast("callServerErrorMessageValidation");
                    }
                }
            };
            LoginService.postRegisterDetails(params);
        }

        $rootScope.doPostSsoUserRegisterDetails = function() {

            var params = {
                address: $rootScope.step1RegDetails[0].address,
                dob: $scope.regStep2.dob,
                email: $scope.reg2email,
                firstname: $rootScope.step1RegDetails[0].FName,
                lastname:$rootScope.step1RegDetails[0].LName,
                password: $scope.regStep2.password,
                countryId:1,
                gender: "M",
                mobileNumberWithCountryCode:"+12135551212",
                timezoneId:23,
                success: function() {
                    $rootScope.isRegistrationCompleted = true;
                    $rootScope.registedEmail = $scope.reg2email;
                    $rootScope.registedPwd = $scope.regStep2.password;
                    $state.go('tab.registerSuccess');
                },
                error: function(data,status) {
                    $rootScope.isRegistrationCompleted = false;
                    if (data.message.indexOf('already registered') > 0) {
                        navigator.notification.alert(
                            data.message, // message
                            function() {},
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.$root.$broadcast("callServerErrorMessageValidation");
                    }
                }
            };
            //LoginService.postRegisterssoDetails(params);
        }


        $scope.GoBackToStep1 = function() {
          $state.go('tab.registerStep1');
        }

    })

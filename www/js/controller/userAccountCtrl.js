angular.module('starter.controllers')
    .controller('userAccountCtrl', function($scope, $ionicScrollDelegate, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $filter, $timeout, $ionicPopup) {

var localizeCurrent = $('#localize-current').text();
         if(localizeCurrent == "Español"){
             $scope.ualabel = "margin-left:-97px !important";
         }else{
             $scope.ualabel = "margin-left:0px !important";
         }
         $('#localize-langs').click(function() {

             var isLang = $('#localize-langs .activated').text();
               if(isLang == "Español"){
                   $scope.ualabel = "margin-left:-97px !important";
               }else{
                   $scope.ualabel = "margin-left:0px !important";
               }
               isLang = '';

         });

      $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        $rootScope.drawSVGCIcon = function(iconName) {
            return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        };
$("#localize-widget").show();



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

        $scope.getPatientProfile = function() {
            $state.go('tab.healthinfo');
        }

        var checkAndChangeMenuIcon;
        $interval.cancel(checkAndChangeMenuIcon);

        $rootScope.checkAndChangeMenuIcon = function() {
                if (!$ionicSideMenuDelegate.isOpen(true)) {
                    if ($('#BackButtonIcon').hasClass("ion-close")) {
                        $('#BackButtonIcon').removeClass("ion-close");
                        $('#BackButtonIcon').addClass("ion-navicon-round");
                    }
                } else {
                    if ($('#BackButtonIcon').hasClass("ion-navicon-round")) {
                        $('#BackButtonIcon').removeClass("ion-navicon-round");
                        $('#BackButtonIcon').addClass("ion-close");
                    }
                }
            }
            $rootScope.changeptienthome=function(){
              $rootScope.doGetPatientProfiles();
              $state.go('tab.userhome');
            }
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function() {
                    $rootScope.checkAndChangeMenuIcon();
                }, 300);
            }
        };

        $scope.doRefreshAccount = function() {
            $rootScope.doGetScheduledNowPhoneConsulatation();
            $timeout(function() {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        };
        $scope.doRefreshUserPage = function() {
            $rootScope.doGetScheduledNowPhoneConsulatation();
            $timeout(function() {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        };
        $rootScope.getManageProfile = function(currentPatientDetails) {
            $rootScope.currentPatientDetails = currentPatientDetails;
            $rootScope.doddate = $rootScope.currentPatientDetails[0].dob;
            $rootScope.restage = getAge($rootScope.doddate);
            if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId)) {
                $rootScope.viewemailDisplay = 'flex';
                $rootScope.viewtimezoneDisplay = 'flex';
            } else {
                $rootScope.viewemailDisplay = 'none';
                $rootScope.viewtimezoneDisplay = 'none';
            }

            if ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId) {
                $rootScope.viewmyhealthDisplay = 'block';
                $rootScope.viewhealthDisplay = 'none';
            } else {
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
            }
            if ($rootScope.currentPatientDetails[0].gender === 'M') {
                $rootScope.userGender = "Male";
                $rootScope.isCheckedMale = true;
            } else if ($rootScope.currentPatientDetails[0].gender === 'F') {
                $rootScope.userGender = "Female";
                $rootScope.isCheckedFemale = true;
            }
            $rootScope.passededconsultants();
            $rootScope.connection;
            $state.go('tab.healthinfo');
        }

        var primaryvalue = $rootScope.PatientPrimaryConcernItem;
        $scope.goToPatientConcerns = function(currentPatientDetails) {
            var currentLocation = window.location;
            var loc = currentLocation.href;
            var newloc = loc.split("#");
            var locat = newloc[1];
            var sploc = locat.split("/");
            var cutlocations = sploc[1] + "." + sploc[2];
            $rootScope.getCheckedPrimaryConcern;
            $rootScope.PatientPrimaryConcernItem;
            $scope.PatientPrimaryConcernItem = false;
            $rootScope.Patconcern = "";
            $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
            $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
            $rootScope.PatientPrimaryConcern = "";
            $rootScope.PrimaryCount = "";
            $rootScope.checkedPrimary = 0;
            $rootScope.secondaryConcernList = "";
            $scope.PatientPrimaryConcernItem = "";
            $rootScope.getCheckedPrimaryConcern = false;
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
            $rootScope.ChronicCountValidCount = "";
            $rootScope.PriorSurgeryValidCount = "";
            $rootScope.AllegiesCountValid = "";
            $rootScope.MedicationCountValid = "";
            $rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');


        }

        $rootScope.doGetCurrentUserAppointment = function() {
            $rootScope.passededconsultants();
            //$rootScope.doGetScheduledNowPhoneConsulatation();

            if ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId) {
                $rootScope.viewmyhealthDisplay = 'block';
                $rootScope.viewhealthDisplay = 'none';
            } else {
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
            }
            $state.go('tab.appointmentpatientdetails');
        }
        $scope.goTOSchedule = function() {
          $("#localize-widget").show();
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }
        //Sakthi
       $scope.getNumbersFromString = function(num){
            var txt = num;
            var numb = txt.match(/\d/g);
            numb = numb.join("");
            return numb;
       }

        $rootScope.callPhone = function() {
           
            var num = $scope.getNumbersFromString($rootScope.appointmentsContactNumber);
            window.open('tel:' + num , '_system');
          //   var url = 'tel:' + $rootScope.appointmentsContactNumber;
          //   window.open(url, '_system', 'location=yes');
         return false;
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

    })

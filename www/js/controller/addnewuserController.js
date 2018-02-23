angular.module('starter.controllers')
    .controller('addnewuserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate,
        $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log,
        $ionicPopup, ageFilter, $window, $timeout) {

  $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
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
        }

        $scope.userpatient = function(){
          $rootScope.doGetPatientProfiles();
          $state.go('tab.userhome');
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
                        angular.forEach(data.data, function(index) {
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
                            angular.forEach(index.locations, function(index) {
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
                error: function(data,status) {
                  if(status===0 ){
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                       $rootScope.Validation($scope.ErrorMessage);

                  } else if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else{
                    $rootScope.serverErrorMessageValidation();
                  }

                }
            };
            LoginService.getListOfLocationOrganization(params);
        }
        $rootScope.goToUserPageFromAddUser = function() {
             $state.go('tab.userhome');
        }
        $rootScope.adddependent = function() {
            $scope.doGetLocations();
            $rootScope.newDependentImagePath = '';
            $rootScope.addPatientidupdateList = '';
            $rootScope.listOfAddPatientIdentifiers = '';
            $('select').prop('selectedIndex', 0);
            $state.go('tab.addnewdependent');
        }
        $rootScope.addcouser = function() {
            $rootScope.newCoUserImagePath = '';
            $scope.doGetLocations();
            $('select').prop('selectedIndex', 0);
            $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
            $state.go('tab.addUser');
      }
      $timeout(function() {
            $('option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);

        $scope.goTOSchedule = function() {
        //  $("#localize-widget").show();
          $('<link/>', {
              rel: 'stylesheet',
              type: 'text/css',
              href: 'css/styles.v3.less.dynamic.css'
          }).appendTo('head');
          //  $state.go('tab.providerSearch', { viewMode : 'all' });
          $state.go('tab.providerSearch');
        }

  });

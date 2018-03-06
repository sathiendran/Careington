angular.module('starter.controllers')

.controller('waitingRoomCtrl', function($scope, $window, $ionicPlatform, htmlEscapeValue, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout, SurgeryStocksListService, $filter, StateList,$ionicBackdrop) {
    $.getScript( "lib/jquery.signalR-2.1.2.js", function( data, textStatus, jqxhr ) {

    });
    /*
    $.getScript( "https://snap-qa.com/api/signalR/hubs", function( data, textStatus, jqxhr ) {

    });*/
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

    var localizeCurrent = $('#localize-current').text();

      if(localizeCurrent == "Español") {

        consultSaveMsg = 'Consulta guardada exitosamente!';
        consultFailMsg = 'Error al guardar consulta!';

      } else {

      consultSaveMsg = 'Consultation saved successfully!';
      consultFailMsg = 'Failed to save consultation!';

    }


     $('#localize-langs').click(function() {
       var isLang = $('#localize-langs .activated').text();
         console.log("lang "+isLang);
         if(isLang == "Español") {

             consultSaveMsg = 'Consulta guardada exitosamente!';
             consultFailMsg = 'Error al guardar consulta!';

         } else {

            consultSaveMsg = 'Consultation saved successfully!';
            consultFailMsg = 'Failed to save consultation!';

        }
        });


    window.plugins.insomnia.keepAwake();
    $rootScope.currState = $state;
    window.localStorage.setItem('videoCallPtImage', $rootScope.PatientImageSelectUser);
    window.localStorage.setItem('videoCallPtFullName', $rootScope.PatientFirstName + " " + $rootScope.PatientLastName);
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
    $scope.$storage = $window.localStorage;

    $scope.doGetSingleHosInfoForiTunesStage = function() {
        $rootScope.paymentMode = '';
        $rootScope.insuranceMode = '';
        $rootScope.onDemandMode = '';
        $rootScope.OrganizationLocation = '';
        $rootScope.PPIsBloodTypeRequired = '';
        $rootScope.PPIsHairColorRequired = '';
        $rootScope.PPIsEthnicityRequired = '';
        $rootScope.PPIsEyeColorRequired = '';
        $rootScope.InsVerificationDummy = '';
        $rootScope.InsuranceBeforeWaiting = '';
        $rootScope.HidePaymentPageBeforeWaitingRoom = '';
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                $rootScope.ssopatienttoken = data.data[0].patientTokenApi;
                $rootScope.ssopatientregister = data.data[0].patientRegistrationApi;
                $rootScope.ssopatientforgetpwd = data.data[0].patientForgotPasswordApi;
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
                        if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                            $rootScope.InsVerificationDummy = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
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
                if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                    $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                } else {
                    $rootScope.isSSORegisterAvailable = '';
                }
                $window.location.reload();
                if (deploymentEnvLogout === "Multiple") {
                    $state.go('tab.chooseEnvironment');
                } else if (deploymentEnvLogout === "Single") {
                  //  $state.go('tab.loginSingle');
                  $state.go('tab.singleTheme');
                } else {
                    $state.go('tab.login');
                //  $state.go('tab.singleTheme');
                }
            },
            error: function(data,status) {
              if(status === 503) {
                $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
              } else {
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getHospitalInfo(params);
    }

    $rootScope.ClearRootScope = function() {
      $rootScope.cuttlocations = '';
      $(".ion-google-place-container").css({
          "display": "none"
      });
      $rootScope.registedPwd =  '';
      $rootScope.PatientIdentifiers = '';
      $rootScope.PatientidupdateList = '';
      $rootScope.sessionConsultConnection.start().done(function() {
        $rootScope.sessionRoomConHub.invoke('LogoutUser');
        // alert('hhh');
         $rootScope.accessToken = '';
         $rootScope.sessionRoomConHub = null;
         $rootScope.sessionConsultConnection = null;
      });
      $ionicBackdrop.release();
      $window.localStorage.setItem('tokenExpireTime', '');
        $(".overlay").css({"display": "none" });
    //  if (deploymentEnvLogout === 'Single' && deploymentEnvForProduction === 'Production' && appStoreTestUserEmail === 'itunesmobiletester@gmail.com' && api_keys_env === 'Staging') {
    if ((deploymentEnvLogout === 'Single' && deploymentEnvForProduction === 'Production' && api_keys_env === 'Staging' && cobrandApp !== 'MDAmerica') && (appStoreTestUserEmail === 'itunesmobiletester@gmail.com' || appStoreTestUserEmail2 == 'snap.rinsoft.qaapptester@gmail.com')) {
            $rootScope.hospitalId = singleHospitalId;
            apiCommonURL = 'https://connectedcare.md';
            api_keys_env = 'Production';
            $rootScope.APICommonURL = 'https://connectedcare.md';
            $scope.doGetSingleHosInfoForiTunesStage();
      } else {

        if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
            $timeout(function() {
                   //$window.location.reload(true);
               });
        } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                 $state.go('tab.singleTheme');
                 $timeout(function() {
                        //$window.location.reload(true);
                    });
        }else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
            $state.go('tab.singleTheme');
            $timeout(function() {
                   //$window.location.reload(true);
               });
        }else {
           $state.go('tab.login');
           $timeout(function() {
                  //$window.location.reload(true);
              });
        }
      }
      $rootScope = $rootScope.$new(true);
      $scope = $scope.$new(true);
      for (var prop in $rootScope) {
          if (prop.substring(0,1) !== '$') {
              delete $rootScope[prop];
          }
      }
    }

    $scope.isPhysicianStartedConsultaion = false;
    $scope.waitingMsg = "The Provider will be with you shortly";
    var initWaitingRoomHub = function() {
        var WaitingRoomConnection = $.hubConnection();
        var WaitingRoomConHub = WaitingRoomConnection.createHubProxy('consultationHub');
        WaitingRoomConnection.url = $rootScope.APICommonURL + "/api/signalR/";
        var consultationWatingId = +$rootScope.consultationId;
        var sound = $rootScope.AndroidDevice ? 'file://sound.mp3' : 'file://beep.caf';
//if(WaitingRoomConnection.state ===4 )
//WaitingRoomConnection.start();
        WaitingRoomConnection.qs = {
            "Bearer": $rootScope.accessToken,
            "consultationId": consultationWatingId,
            "waitingroom": 1,
            "isMobile": true
        };
        WaitingRoomConHub.on("onConsultationReview", function() {
            $scope.waitingMsg = "The Provider is now reviewing the intake form";
            $scope.$digest();
        });
        WaitingRoomConHub.on("onCustomerDefaultWaitingInformation", function() {
            if(typeof appIdleInterval !== "undefined")
                clearInterval(appIdleInterval);
            appIdleInterval = undefined;
            appIdleInterval = 0;
             window.localStorage.setItem("isCustomerInWaitingRoom", "Yes");
             window.localStorage.setItem('accessToken', $rootScope.accessToken);
             window.localStorage.setItem("waitingRoomConsultationId", +$rootScope.consultationId);
            $scope.waitingMsg = "Please Wait";
            $scope.postPollforCredit();
            $scope.$digest();
        });
        WaitingRoomConHub.on("onConsultationStarted", function() {
             window.localStorage.setItem("isCustomerInWaitingRoom", "No");
             if(typeof alive_waiting_room_pool !== 'undefined')
                 clearInterval(alive_waiting_room_pool);
            $scope.waitingMsg = "Please wait";
            $scope.$digest();
           // $.connection.hub.stop();
           WaitingRoomConnection.stop();
            WaitingRoomConnection.qs = {};
            WaitingRoomConnection = null;
            WaitingRoomConHub = null;
            getConferenceKeys();
        });
        WaitingRoomConnection.logging = true;
        window.whub = WaitingRoomConnection;
        WaitingRoomConnection.start({
            withCredentials: false
        }).then(function() {
            $scope.waitingMsg = "The Provider will be with you shortly";
            $scope.$digest();
            WaitingRoomConnection.disconnected(function() {
               setTimeout(function() {
                  // WaitingRoomConnection.start();
               }, 5000); // Restart connection after 5 seconds.
          });
        });
    };
    initWaitingRoomHub();

    var getConferenceKeys = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function(data) {
                $rootScope.videoSessionId = data.sessionId;
                $rootScope.videoApiKey = data.apiKey;
                $rootScope.videoToken = data.token;
                if ($rootScope.videoSessionId !== "" && $rootScope.videoToken !== "") {
                     if(typeof alive_waiting_room_pool !== 'undefined')
                         clearInterval(alive_waiting_room_pool);
                     window.localStorage.setItem("isCustomerInWaitingRoom", "No");
                    $state.go('tab.videoConference');
                }

            },
            error: function(data,status) {
              if(status===0 ){
                   $scope.ErrorMessage = "Internet connection not available, Try again later!";
                   $rootScope.Validation($scope.ErrorMessage);
              } else if(status === 503) {
                $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
              }else{
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getVideoConferenceKeys(params);
    };

    var alive_waiting_room_pool;
    alive_waiting_room_pool = setInterval(function(){
         if(window.localStorage.getItem("isCustomerInWaitingRoom") === "Yes"){
             $scope.postPollforCredit();
         }
       }, 30000);

       $scope.postPollforCredit = function() {
           vConsultationWatingId = window.localStorage.getItem("waitingRoomConsultationId");
           vAccessToken = window.localStorage.getItem("accessToken");
           var alive_timestamp_url = apiCommonURL + '/api/v2/patients/activeconsultations/' + vConsultationWatingId + '/alive-timestamp';
           var reqHeaders = util.getHeaders();
           reqHeaders['Authorization'] = "Bearer " + vAccessToken;
           $.ajax({
               type: 'PUT',
               headers: reqHeaders,
               url: alive_timestamp_url,
               success: function(){

               },
               failure: function(){

               }
             });
       }

       $scope.doGetExistingConsulatation = function() {
           $rootScope.consultionInformation = '';
           $rootScope.appointmentsPatientFirstName = '';
           $rootScope.appointmentsPatientLastName = '';
           $rootScope.appointmentsPatientDOB = '';
           $rootScope.appointmentsPatientGurdianName = '';
           $rootScope.appointmentsPatientImage = '';


           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {
                   $scope.existingConsultation = data;

                   $rootScope.consultionInformation = data.data[0].consultationInfo;
                   $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                   if (!angular.isUndefined($rootScope.consultationStatusId)) {

                     if (!angular.isUndefined($rootScope.consultationStatusId)) {
                         if ($rootScope.consultationStatusId === 71) {
                             navigator.notification.alert(
                                // 'Your consultation is already started on other device.', // message
                                $rootScope.consultStartMsg,
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                 $rootScope.sessAlertDone  //'Done' // buttonName
                             );
                             return false;
                         } else if ($rootScope.consultationStatusId === 72) {
                              window.localStorage.setItem('isVideoCallProgress', "No");
                              $('#thumbVideos').remove();
                                $('#videoControls').remove();
                              //  session.disconnect();
                                $('#publisher').hide();
                                $('#subscriber').hide();
                                $('#divVdioControlPanel').hide();

                               navigator.notification.alert(
                                // 'Consultation already completed!', // message
                                $rootScope.consultEndMeg,
                                   consultationEndedAlertDismissed,
                                   $rootScope.alertMsgName, // title
                                   $rootScope.sessAlertDone //'Done' // buttonName
                               );
                          } else if ($rootScope.consultationStatusId === 79) {
                             navigator.notification.alert(
                                 //'Your consultation is cancelled.', // message
                                 $rootScope.consultCancelMsg,
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                 $rootScope.sessAlertDone //'Done' // buttonName
                             );
                             return false;
                         } else if ($rootScope.consultationStatusId === 80) {
                             navigator.notification.alert(
                                // 'Your consultation is in progress on other device.', // message
                                $rootScope.consultProgMsg,
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                $rootScope.sessAlertDone // 'Done' // buttonName
                             );
                             return false;
                         } else if ($rootScope.consultationStatusId === 82 || $rootScope.consultationStatusId === 70) {
                           initWaitingRoomHub();
                         }
                     }

                   }

               },
               error: function(data,status) {
                  if(status === 503) {
                   $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                 }
               }
           };

           LoginService.getExistingConsulatation(params);

       }

       $rootScope.doGetExistingConsulatationReport = function() {
           $state.go('tab.ReportScreen');
           $rootScope.userReportDOB = "";
           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {
                   $rootScope.attachmentLength = '';
                   $rootScope.existingConsultationReport = data.data[0].details[0];
                   $rootScope.existconsultationparticipants=data.data[0].participants;

                   /*if ($rootScope.existingConsultationReport.height !== '' && typeof $rootScope.existingConsultationReport.height !== 'undefined')
                   {
                     if ($rootScope.existingConsultationReport.heightUnit !== '' && typeof $rootScope.existingConsultationReport.heightUnit !== 'undefined') {
                       $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                     } else {
                       $rootScope.reportHeight = $rootScope.existingConsultationReport.height;
                     }
                   } else {
                       $rootScope.reportHeight = 'N/R';
                   }*/

                   if ($rootScope.existingConsultationReport.height !== '' && typeof $rootScope.existingConsultationReport.height !== 'undefined') {
                           if ($rootScope.existingConsultationReport.heightUnit !== '' && typeof $rootScope.existingConsultationReport.heightUnit !== 'undefined') {
                               $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                               var reheight = $rootScope.existingConsultationReport.height.split("|")
                               $rootScope.reportheight1 = reheight[0];
                               $rootScope.reportheight2 = reheight[1];
                               var reheightunit = $rootScope.existingConsultationReport.heightUnit.split("/");
                               $rootScope.reportheightunit1 = reheightunit[0];
                               $rootScope.reportheightunit2 = reheightunit[1];
                           } else {
                               $rootScope.reportHeight = $rootScope.existingConsultationReport.height;
                           }
                       } else {
                           $rootScope.reportHeight = 'N/R';
                       }

                   if ($rootScope.existingConsultationReport.weight !== '' && typeof $rootScope.existingConsultationReport.weight !== 'undefined') {
                       $rootScope.reportWeight = $rootScope.existingConsultationReport.weight + " " + $rootScope.existingConsultationReport.weightUnit;
                   } else {
                       $rootScope.reportWeight = 'N/R';
                   }

                    if($rootScope.existingConsultationReport.note !== '' && typeof $rootScope.existingConsultationReport.note !== 'undefined') {
                         $rootScope.repadditionalnotes = $rootScope.existingConsultationReport.note;
                       }
                       else{
                           $rootScope.repadditionalnotes = 'N/R';
                       }

                   $rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
                   $rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);
                    $rootScope.reportpatientid =htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientId);
                   if ($rootScope.primaryPatientId !== $rootScope.existingConsultationReport.patientId){
                     if ($rootScope.existingConsultationReport.guardianName !== '' && typeof $rootScope.existingConsultationReport.guardianName !== 'undefined') {
                         $rootScope.reportGuardian = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.guardianName);
                     }
                    }
                   if ($rootScope.existingConsultationReport.patientAddress !== '' && typeof $rootScope.existingConsultationReport.patientAddress !== 'undefined') {
                       $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                   } else {
                       $rootScope.reportPatientAddress = 'None Reported';
                   }

                   if($rootScope.existingConsultationReport.ethnicity !== '' && typeof $rootScope.existingConsultationReport.ethnicity !== 'undefined') {
                       $rootScope.reportethnicity = $rootScope.existingConsultationReport.ethnicity;

                     }else{
                        $rootScope.reportethnicity = 'N/R';
                     }
                   if ($rootScope.existingConsultationReport.homePhone !== '' && typeof $rootScope.existingConsultationReport.homePhone !== 'undefined') {
                       $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                   } else {
                       $rootScope.reportHomePhone = 'N/R';
                   }

                   if ($rootScope.existingConsultationReport.hospitalAddress !== '' && typeof $rootScope.existingConsultationReport.hospitalAddress !== 'undefined') {
                       $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                   } else {

                   }

                   if ($rootScope.existingConsultationReport.brandName !== '' && typeof $rootScope.existingConsultationReport.brandName !== 'undefined') {
                           $rootScope.reportBrandName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.brandName);
                       } else {
                           $rootScope.reportBrandName = 'N/R';
                       }

                   if (!angular.isUndefined($rootScope.existingConsultationReport.location)) {
                       $rootScope.location = $rootScope.existingConsultationReport.location;
                   } else {
                       $rootScope.location = 'N/R';
                   }

                   if (!angular.isUndefined($rootScope.existingConsultationReport.organization)) {
                       $rootScope.organization =$rootScope.existingConsultationReport.organization;
                   } else {
                       $rootScope.organization = 'N/R';
                   }

                   if ($rootScope.existingConsultationReport.doctorFirstName !== '' && typeof $rootScope.existingConsultationReport.doctorFirstName !== 'undefined') {
                       $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                   } else {
                       $rootScope.reportDoctorFirstName = 'None Reported';
                   }
                   if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                       $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                   } else {
                       $rootScope.reportMedicalSpeciality = '';
                   }
                     if ($rootScope.existingConsultationReport.department !== '' && typeof $rootScope.existingConsultationReport.department !== 'undefined') {
                      $rootScope.providerDepartment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.department);
                   } else {
                       $rootScope.providerDepartment = '';
                   }

                   if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                       $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                   } else {
                       $rootScope.reportDoctorLastName = 'None Reported';
                   }

                   $rootScope.reportservicetype = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.serviceTypeName);

                   if ($rootScope.existingConsultationReport.encounterTypeCode !== '' && typeof $rootScope.existingConsultationReport.encounterTypeCode !== 'undefined') {
                         $rootScope.encountercode =  $rootScope.existingConsultationReport.encounterTypeCode;
                           if ($rootScope.encountercode == 2) {
                               $rootScope.encountertype = "Phone Consultation";
                               $rootScope.consultationphone = $rootScope.existingConsultationReport.consultationPhoneNumber;
                               if($rootScope.existingConsultationReport.consultationPhoneType == 1){
                                 $rootScope.phonetype = "Mobile"
                               }if($rootScope.existingConsultationReport.consultationPhoneType == 2){
                                 $rootScope.phonetype = "Home"
                               }if($rootScope.existingConsultationReport.consultationPhoneType == 3){
                                 $rootScope.phonetype = "Other"
                               }

                           } else if ($rootScope.encountercode == 3) {
                               $rootScope.encountertype = "Video Consultation";
                           }
                       } else {
                           $rootScope.encountertype = 'None Reported';
                       }

                   if ($rootScope.existingConsultationReport.appointmentType !== '' && typeof $rootScope.existingConsultationReport.appointmentType !== 'undefined') {
                         $rootScope.appointmentcode =  $rootScope.existingConsultationReport.appointmentType;
                           if ($rootScope.appointmentcode == 1) {
                               $rootScope.appointmenttype = "ClinicianScheduled";
                           } else if ($rootScope.appointmentcode == 2) {
                               $rootScope.appointmenttype = "On-Demand";
                           }else if ($rootScope.appointmentcode == 3) {
                               $rootScope.appointmenttype = "PatientScheduled";
                           }
                       } else {
                           $rootScope.appointmenttype = 'None Reported';
                       }

                   if ($rootScope.existingConsultationReport.consultationStatus !== '' && typeof $rootScope.existingConsultationReport.consultationStatus !== 'undefined') {
                        $rootScope.consultstatus =  $rootScope.existingConsultationReport.consultationStatus;

                           if ($rootScope.consultstatus == 72) {
                               $rootScope.reportStatus = "Successful";
                           } else if ($rootScope.consultstatus == 79) {
                               $rootScope.reportStatus = "Cancelled";
                           } else if ($rootScope.consultstatus == 81) {
                               $rootScope.reportStatus = "Dropped";
                           }
                       } else {
                           $rootScope.reportStatus = 'None Reported';
                       }


                   if ($rootScope.existingConsultationReport.rx !== '' && typeof $rootScope.existingConsultationReport.rx !== 'undefined') {
                       $rootScope.reportrx = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.rx);
                   } else {
                       $rootScope.reportrx = 'None Reported';
                   }
                   var startTimeISOString = $rootScope.existingConsultationReport.consultationDate;
                   var startTime = new Date(startTimeISOString);
                   $rootScope.consultationDate = new Date(startTime.getTime() + (startTime.getTimezoneOffset() * 60000));

                   if ($rootScope.existingConsultationReport.consultationDuration !== 0 && typeof $rootScope.existingConsultationReport.consultationDuration !== 'undefined')
                   {
                       $rootScope.displayCOnsultationDuration = "display";
                       var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
                       var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
                       if (consultationMinutes === 0) {
                           $rootScope.consultDurationMinutes = '00';
                       } else if (consultationMinutes < 10) {
                           $rootScope.consultDurationMinutes = '0' + consultationMinutes;
                       } else {
                           $rootScope.consultDurationMinutes = consultationMinutes;
                       }

                       if (consultationSeconds == 0) {
                           $rootScope.consultDurationSeconds = '00';
                       } else if (consultationSeconds < 10) {
                           $rootScope.consultDurationSeconds = '0' + consultationSeconds;
                       } else {
                           $rootScope.consultDurationSeconds = consultationSeconds;
                       }
                   } else {
                       $rootScope.displayCOnsultationDuration = "none";
                   }

                   $rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;
                   $rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
                   if (typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
                       var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
                       if (n < 0) {
                           $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
                       } else {
                           $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
                           $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
                       }
                   } else {
                       $rootScope.reportScreenPrimaryConcern = "";
                   }
                   $rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
                   if (typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
                       var nsc = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                       if (nsc < 0) {
                           $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern);
                       } else {
                           $rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
                           $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern1[1]);
                       }
                   } else {
                       $rootScope.reportScreenSecondaryConcern = "None Reported";
                   }
                   $rootScope.intake = $rootScope.existingConsultationReport.intake;

                   $rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;

                   if ($rootScope.fullTerm === 'N') {
                       $rootScope.fullTerm = 'No';
                   } else if ($rootScope.fullTerm === 'Y') {
                       $rootScope.fullTerm = 'Yes';
                   }

                   $rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
                   if ($rootScope.vaginalBirth === 'N') {
                       $rootScope.vaginalBirth = 'No';
                   } else if ($rootScope.vaginalBirth === 'Y') {
                       $rootScope.vaginalBirth = 'Yes';
                   }

                   $rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
                   if ($rootScope.dischargedWithMother === 'N') {
                       $rootScope.dischargedWithMother = 'No';
                   } else if ($rootScope.dischargedWithMother === 'Y') {
                       $rootScope.dischargedWithMother = 'Yes';
                   }

                   $rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
                   if ($rootScope.vaccinationsCurrent === 'N') {
                       $rootScope.vaccinationsCurrent = 'No';
                   } else if ($rootScope.vaccinationsCurrent === 'Y') {
                       $rootScope.vaccinationsCurrent = 'Yes';
                   }

    var repdob =$rootScope.existingConsultationReport.dob;
                       var reptdate = repdob.split("T");
                       $rootScope.reportdob = reptdate[0];

   var now = new Date();
               var duedate = new Date(now);
               var stdate = duedate.setDate(now.getDate() - 365);
               var start = new Date(stdate);
               var day = start.getDate();
               var mnth = start.getMonth() + 1;
               var year = start.getFullYear();

                       $rootScope.todayDateForReport = mnth+"/"+day+"/"+year;

                   if($rootScope.existingConsultationReport.dob !== "" && !angular.isUndefined($rootScope.existingConsultationReport.dob)) {
                     var ageDifMs = Date.now() - new Date($rootScope.existingConsultationReport.dob).getTime(); // parse string to date
                     var ageDate = new Date(ageDifMs); // miliseconds from epoch
                     $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                     if($scope.userAge === 0) {
                       $rootScope.userReportDOB = $scope.userAge;
                     } else {
                       $rootScope.userReportDOB = $scope.userAge;
                     }
                   }

                   if (typeof data.data[0].details[0].hospitalImage !== 'undefined' && data.data[0].details[0].hospitalImage !== '') {
                       var hosImage = data.data[0].details[0].hospitalImage;
                       if (hosImage.indexOf(apiCommonURL) >= 0) {
                           $rootScope.hospitalImage = hosImage;
                       } else {
                           $rootScope.hospitalImage = apiCommonURL + hosImage;
                       }
                   } else {
                       $rootScope.hospitalImage = '';
                   }

                   $rootScope.gender = data.data[0].details[0].gender;
                   if (data.data[0].details[0].gender !== '' && typeof data.data[0].details[0].gender !== 'undefined') {

                       if ($rootScope.gender === 'M') {
                           $rootScope.gender = 'Male';
                       } else if ($rootScope.gender === 'F') {
                           $rootScope.gender = 'Female';
                       }
                   } else {
                       $rootScope.gender = 'N/R';
                   }

                   $rootScope.ReportMedicalConditions = [];
                   angular.forEach($rootScope.intake.medicalConditions, function(index, item) {
                       $rootScope.ReportMedicalConditions.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportMedicationAllergies = [];
                   angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {
                       $rootScope.ReportMedicationAllergies.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportMedications = [];
                   angular.forEach($rootScope.intake.medications, function(index, item) {
                       $rootScope.ReportMedications.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportSurgeries = [];
                   angular.forEach($rootScope.intake.surgeries, function(index, item) {
                       $rootScope.ReportSurgeries.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'description': index.description,
                           'month': index.month,
                           'year': index.year,
                       });
                   });
                   $rootScope.AttendeeList = [];
                   angular.forEach($rootScope.existconsultationparticipants, function(index, item) {
                     var atname = index.person.name.given;
                     if (atname !== '') {
                         $rootScope.AttendeeList.push({
                             'Number': item + 1,
                             'attedeename': index.person.name.given,
                             'secondname':  index.person.name.family,
                             'consultstart': index.period.start,
                             'consultend': index.period.end,
                       });
                     }
                   });

                   $rootScope.reportMedicalCodeDetails = [];

                  /* if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined')
                    {
                       angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                           $rootScope.reportMedicalCodeDetails.push({
                               'Number': item + 1,
                               'shortDescription': index.shortDescription,
                               'medicalCodingSystem': index.medicalCodingSystem
                           });
                       });
                       $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'CPT'
                       });
                       $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'ICD-10-DX'
                       });

                   } else {
                       $rootScope.reportMedicalCodeDetails = '';
                   }*/

   if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined')
                       {
                           angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                             var cptcode = index.shortDescription;
                             var spcptcode = cptcode.split("-");
                             var icdcode =   index.shortDescription;
                             var spicdcode = icdcode.split("-");
                             var icd9code =   index.shortDescription;
                             var spicd9code = icdcode.split("-");
                             var snocode =   index.shortDescription;
                             var spsnocode = snocode.split("-");
                               $rootScope.reportMedicalCodeDetails.push({
                                   'Number': item + 1,
                                   'shortDescription': index.shortDescription,
                                   'medicalCodingSystem': index.medicalCodingSystem,
                                   'EnCPTCode' : spcptcode[0],
                                   'EnCPTDescription' : spcptcode[1],
                                   'EnICDcode' : spicdcode[0],
                                   'EnICDDescription' : spicdcode[1],
                                   'EnICD9code' : spicd9code[0],
                                   'EnICD9Description' : spicd9code[1],
                                   'SNOMEDcode' : spsnocode[0],
                                   'SNOMEDcodeDescription' : spsnocode[1]
                               });
                           });
                           $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                               medicalCodingSystem: 'CPT'
                           });
                           // if($rootScope.reportMediCPT != ""){
                           //
                           //   var cptcode =   $rootScope.reportMediCPT[0].shortDescription;
                           //   var spcptcode = cptcode.split("-");
                           //   $rootScope.reportMediCPTcode = spcptcode[0];
                           //   $rootScope.reportMediCPTdescription = spcptcode[1];
                           // }


                           $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                               medicalCodingSystem: 'ICD-10-DX'
                           });
                           // if($rootScope.reportMediICD != ""){
                           //   var icdcode =   $rootScope.reportMediICD[0].shortDescription;
                           //   var spicdcode = cptcode.split("-");
                           //   $rootScope.reportMediICDcode = spicdcode[0];
                           //   $rootScope.reportMediICDdescription = spicdcode[1];
                           // }
                           $rootScope.reportMediICD9 = $filter('filter')($scope.reportMedicalCodeDetails, {
                               medicalCodingSystem: 'ICD-9-DX'
                           });
                           // if($rootScope.reportMediICD9 != ""){
                           //   var icd9code =   $rootScope.reportMediICD9[0].shortDescription;
                           //   var spicd9code = cptcode.split("-");
                           //   $rootScope.reportMediICD9code = spicd9code[0];
                           //   $rootScope.reportMediICD9description = spicd9code[1];
                           // }
                           $rootScope.reportSNOMED = $filter('filter')($scope.reportMedicalCodeDetails, {
                               medicalCodingSystem: 'SNOMED-CT'
                           });
                           if($rootScope.reportSNOMED != ""){
                             var snocode =   $rootScope.reportSNOMED[0].shortDescription;
                             var spsnocode = cptcode.split("-");
                             $rootScope.reportMediSnocode = spsnocode[0];
                             $rootScope.reportMediSnodescription = spsnocode[1];
                           }
                       } else {
                           $rootScope.reportMedicalCodeDetails = 'None Reported';
                       }
                   $window.localStorage.setItem('ChkVideoConferencePage', "");
                   session = null;
                   $scope.getSoapNotes();
                   $scope.doGetChatTranscript();
                   $scope.doGetAttachmentList();
                   $scope.doGetWaitingRoomChatTranscript();
               },
               error: function(data,status) {
                 if(status===0 ){

                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);

                 }else{
                   $rootScope.serverErrorMessageValidation();
                 }
               }
           };

           LoginService.getConsultationFinalReport(params);
       }

       $scope.doGetAttachmentList = function() {

               var params = {
                 consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
                   success: function(data) {
                       $scope.getSoapNotes();
                       $rootScope.getAttachmentList = []
                       $rootScope.snapdetails = data.data[0];
                       $rootScope.foldersize = $rootScope.snapdetails.myFolderMaxSize;
                       $rootScope.foldercreation = $rootScope.snapdetails.snapFile.createdDate;
                       angular.forEach(data.data[0].snapFile.files, function(index) {
                           var attachImage = index.name.split(".");
                           $rootScope.getAttachmentList.push({
                               'id': "'" + index.id + "'",
                               'name': index.name,
                               'image': attachImage[attachImage.length - 1]
                           });

                       });

                       $rootScope.attachmentLength = $rootScope.getAttachmentList.length;

                   },
                   error: function(data,status) {
                     if(status === 503) {
                       $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                     } else {
                       $rootScope.serverErrorMessageValidation();
                     }
                   }
               };
               LoginService.getAttachmentList(params);
           }
           $scope.ConvChar=function( str ) {
             c = {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#039;',
                  '#':'&#035;' };
             return str.replace( /[<&>'"#]/g, function(s) { return c[s]; } );
           }

           $scope.doGetChatTranscript = function() {

               var params = {
                   consultationId: $rootScope.consultationId,
                   accessToken: $rootScope.accessToken,
                   success: function(data) {

                     $rootScope.chatTranscript = [];
                     if(data.count !== 0) {
                       var chatdetails=data.data[0];
                         angular.forEach(chatdetails, function(index) {
                           $rootScope.chatTranscript.push({
                             'ChatMessage': index.chatMessage,
                           });
                       });
                     }
                   },
                   error: function(data,status) {
                     if(status===0 ){

                          $scope.ErrorMessage = "Internet connection not available, Try again later!";
                          $rootScope.Validation($scope.ErrorMessage);

                     }else{
                       $rootScope.serverErrorMessageValidation();
                     }
                   }
               };
               LoginService.getChatTranscript(params);

           }

             $scope.doGetWaitingRoomChatTranscript = function() {

               var params = {
                   consultationId: $rootScope.consultationId,
                   accessToken: $rootScope.accessToken,
                   success: function(data) {

                     $rootScope.waitingRoomChatTranscript = [];
                     if(data.count !== 0) {
                       var chatdetails=data.data;
                         angular.forEach(chatdetails, function(index) {
                           $rootScope.waitingRoomChatTranscript.push({
                             'ChatMessage': index,
                           });
                       });
                     }
                   },
                   error: function(data,status) {
                     if(status===0 ){

                          $scope.ErrorMessage = "Internet connection not available, Try again later!";
                          $rootScope.Validation($scope.ErrorMessage);

                     }else{
                       $rootScope.serverErrorMessageValidation();
                     }
                   }
               };
               LoginService.getWaitingRoomChatTranscript(params);

           }

           $scope.getSoapNotes = function() {
               $("#reportSubjective").html($rootScope.existingConsultationReport.subjective);
               $("#reportObjective").html($rootScope.existingConsultationReport.objective);
               $("#reportAssessment").html($rootScope.existingConsultationReport.assessment);
               $("#reportPlan").html($rootScope.existingConsultationReport.plan);
               if ($rootScope.existingConsultationReport.subjective !== '' && typeof $rootScope.existingConsultationReport.subjective !== 'undefined') {
                   $rootScope.reportSubjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.subjective);
               } else {
                   $rootScope.reportSubjective = 'None Reported';
               }

               if ($rootScope.existingConsultationReport.objective !== '' && typeof $rootScope.existingConsultationReport.objective !== 'undefined') {
                   $rootScope.reportObjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.objective);
               } else {
                   $rootScope.reportObjective = 'None Reported';
               }

               if ($rootScope.existingConsultationReport.assessment !== '' && typeof $rootScope.existingConsultationReport.assessment !== 'undefined') {
                   $rootScope.reportAssessment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.assessment);
               } else {
                   $rootScope.reportAssessment = 'None Reported';
               }

               if ($rootScope.existingConsultationReport.plan !== '' && typeof $rootScope.existingConsultationReport.plan !== 'undefined') {
                   $rootScope.reportPlan = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.plan);
               } else {
                   $rootScope.reportPlan = 'None Reported';
               }
               $('#soapReport').find('a').each(function() {
                   var aLink = angular.element(this).attr('href');
                   var onClickLink = "window.open('" + aLink + "', '_system', 'location=yes'); return false;";
                   angular.element(this).removeAttr('href', '');
                   angular.element(this).attr('href', 'javascript:void(0);');
                   angular.element(this).attr('onclick', onClickLink);
               });
           }

       function consultationEndedAlertDismissed() {
            $rootScope.doGetExistingConsulatationReport();
       }

    $rootScope.waitingroomlostconnection = function(){
        // $window.alert("you lost your connection name!");
        $scope.doGetExistingConsulatation();
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

})

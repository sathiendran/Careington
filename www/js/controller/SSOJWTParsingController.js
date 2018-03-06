angular.module('starter.controllers')
.controller('SSOJWTParsingController', function($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar) {
    $rootScope.deploymentEnv = deploymentEnv;
    if (deploymentEnv !== 'Multiple') {
        $rootScope.APICommonURL = apiCommonURL;
    }
    $rootScope.viaNewUser = false;
    $window.localStorage.setItem('ChkVideoConferencePage', "");
    $rootScope.online = navigator.onLine;
    $rootScope.is_iPadDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
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
    $scope.ssoMessage = 'Authenticating..... Please wait!';
    $scope.addMinutes = function(inDate, inMinutes) {
        var newdate = new Date();
        newdate.setTime(inDate.getTime() + inMinutes * 60000);
        return newdate;
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

    $scope.callServiceUnAvailableError = function() {
        var url = serviceAPIError;
        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
    }
    $scope.goToStore = function() {
      if($rootScope.AndroidDevice) {
         window.location.href = 'https://play.google.com/store/apps/details?id=com.snap.connectedcare.production';
      } else {
         window.location.href = 'https://itunes.apple.com/us/app/virtual-care/id1035220141?ls=1&mt=8';
      }
    }
    $("#localize-widget").show();
    $scope.doGetSingleUserHospitalInformation = function() {
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
                $rootScope.mobileSettings = data.data[0].settings;
                var mobappversion = $rootScope.mobileSettings.mobileApp_MinSupportedVersion;
                var sptversion = mobappversion.split("v");
                var checkmobilever = parseFloat(sptversion[1]);
               // var checkmobilever = 71;
                if(appVersion > checkmobilever){
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
                    $rootScope.backColor = data.data[0].brandColor;
                    $rootScope.singleHospital = data.data[0].brandName;
                    $rootScope.adminSetlocale = data.data[0].locale;
                    if (deploymentEnvLogout === 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    } else {
                        $rootScope.alertMsgName = $rootScope.Hospital;
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    }
                    if(cobrandApp === 'MDAmerica' && deploymentEnv === "Single"){
                         $rootScope.cobrandApp_New = 'MDAmerica';
                         $rootScope.deploymentEnv_New = deploymentEnv;
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
                    hsettings.disablePhoneConsultation = $rootScope.getDetails.indexOf("DisablePhoneConsultation") > -1
          					hsettings.pPIsHairColorRequired = $rootScope.getDetails.indexOf("PPIsHairColorRequired") > -1;
          					hsettings.pPIsEthnicityRequired = $rootScope.getDetails.indexOf("PPIsEthnicityRequired") > -1;
          					hsettings.pPIsEyeColorRequired = $rootScope.getDetails.indexOf("PPIsEyeColorRequired") > -1;
          					hsettings.organizationLocation = $rootScope.getDetails.indexOf("OrganizationLocation") > -1;

          					hsettings.AddressValidation = $rootScope.getDetails.indexOf("AddressValidation") > -1;

          					hsettings.hideOpenConsultation = $rootScope.getDetails.indexOf("HideOpenConsultation") > -1;
          					hsettings.hideDrToDrChat = $rootScope.getDetails.indexOf("HideDrToDrChat") > -1;
          					hsettings.drToDrChatInAdmin = false; //data.indexOf("DrToDrChatInAdmin") > -1;
          					//alert(data.indexOf("HideDrToDrChat"));
          					//Addd Public facing Hospital Setting
          					if (data.data[0]['settings']) {
          						$.extend(hsettings, data.data[0]['settings']);
          					}
          					var hsettingsJsonData = JSON.stringify(hsettings);
          					$window.localStorage.setItem('snap_hospital_settings', hsettingsJsonData);

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
                }else{
                    var confirmPopup = $ionicPopup.prompt({
                        templateUrl: 'templates/updationpopup.html',
                        cssClass: 'updatepopup',
                        hardwareBackButtonClose: false,
                        scope: $scope,
                    });
                }
            },
            error: function(data, status) {
              if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getHospitalInfo(params);
    }

    $scope.doGetScheduledNowPhoneConsulatation = function(redirectToPage) {
          $rootScope.scheduledConsultationList = '';
          $rootScope.getScheduledList = [];
          $rootScope.scheduleParticipants = [];
          $rootScope.scheduledList = '';
          $rootScope.scheduledConsultationList = [];
          var params = {
              patientId: $rootScope.primaryPatientId,
              accessToken: $rootScope.accessToken,
              userTimeZoneId: $rootScope.userTimeZoneId,
              success: function(data) {
                  if (data.total > 0) {
                      $scope.scheduledConsultationList = data.data;
                      $rootScope.getScheduledList = [];
                      $rootScope.scheduleParticipants = [];
                      var currentDate = new Date();
                      currentDate = $scope.addMinutes(currentDate, -60);
                      angular.forEach($scope.scheduledConsultationList, function(index) {
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
                              $rootScope.appointmentwaivefee=index.waiveFee;
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

                              var getReplaceTime = CustomCalendar.getLocalTime(index.startTime);
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

                              $rootScope.getScheduledList.push({
                                  'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
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
                                  'encounterTypeCode':index.encounterTypeCode,
                                  'clinicianId': index.clinicianId,
                                  'userHomeRecentAppointmentColor': userHomeRecentAppointmentColor,
                                  'nextAppointmentDisplay': nextAppointmentDisplay
                              });
                              angular.forEach(index.participants, function(index, item) {
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
                      $rootScope.primaryAppointDetails = $rootScope.scheduledList.filter(function(r) { var show = r.patientId == $rootScope.primaryPatientId; return show; });

                       $rootScope.inqueueAppoint = true;
                       $scope.doGetScheduledAvailableConsultation(redirectToPage);

                  } else {
                     $rootScope.inqueueAppoint = false;
                     $scope.doGetScheduledAvailableConsultation(redirectToPage);
                  }
              },
              error: function(status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                      $rootScope.serverErrorMessageValidation();
                  }
              }
          };
          //LoginService.getScheduledConsulatation(params);
          LoginService.getScheduledNowPhoneConsulatation(params);
      }

      $scope.doGetScheduledAvailableConsultation = function(redirectToPage) {
           if(!$rootScope.inqueueAppoint) {
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
              success: function(data) {
                  // $rootScope.inprogressConsultationList = [];
                   if(data.total > 0) {
                        if(!$rootScope.inqueueAppoint) {
                            $rootScope.getScheduledList = [];
                            $rootScope.scheduleParticipants = [];
                        }
                        angular.forEach(data.data, function(index) {
                             if(index.status == 71) {
                                     $rootScope.getScheduledList.push({
                                          'consultantUserId': index.consultantUserId,
                                          'scheduledTime': CustomCalendar.getLocalTime(index.consultationDateInfo),
                                          'consultationId': index.consultationId,
                                          'createdDate': index.createdDate,
                                          'doctorStatus': index.doctorStatus,
                                          'encounterTypeCode':index.encounterTypeCode,
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
                               }
                        });
                          $rootScope.activeInqueueAppoint = true;
                          $scope.doGetScheduledConsulatation(redirectToPage);
                     } else {
                            $rootScope.activeInqueueAppoint = false;
                          $scope.doGetScheduledConsulatation(redirectToPage);
                     }
              },
              error: function(status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                     $rootScope.serverErrorMessageValidation();
                  }
              }
          };
          LoginService.getScheduledAvailableConsultation(params);
      }

    $scope.doGetScheduledConsulatation = function(redirectToPage) {
      if(!$rootScope.inqueueAppoint && !$rootScope.activeInqueueAppoint) {
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
            success: function(data) {
                if (data !== "") {
                    $scope.scheduledConsultationList = data.data;
                    if(!$rootScope.inqueueAppoint && !$rootScope.activeInqueueAppoint) {
                        $rootScope.getScheduledList = [];
                        $rootScope.scheduleParticipants = [];
                    }
                    var currentDate = new Date();
                    currentDate = $scope.addMinutes(currentDate, -60);
                    angular.forEach($scope.scheduledConsultationList, function(index) {
                        if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {
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
                            $rootScope.appointmentwaivefee=index.waiveFee;
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

                            var getReplaceTime = CustomCalendar.getLocalTime(index.startTime);
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

                            $rootScope.getScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
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
                                'encounterTypeCode':index.encounterTypeCode,
                                'clinicianId': index.clinicianId,
                                'userHomeRecentAppointmentColor': userHomeRecentAppointmentColor,
                                'nextAppointmentDisplay': nextAppointmentDisplay
                            });
                            angular.forEach(index.participants, function(index, item) {
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
                        }
                    });

                    $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");
                    $rootScope.primaryAppointDetails = $rootScope.scheduledList.filter(function(r) { var show = r.patientId == $rootScope.primaryPatientId; return show; });
                  //  $scope.doGetIndividualScheduledConsulatation();
                    if(redirectToPage == 'tab.userhome')
                     $scope.doGetRelatedPatientProfiles(redirectToPage);
                } else {
                    //$scope.doGetIndividualScheduledConsulatation();
                  if(redirectToPage == 'tab.userhome')
                   $scope.doGetRelatedPatientProfiles(redirectToPage);
                }
            },
            error: function(status) {
              if (status === 0) {
                  $scope.ErrorMessage = "Internet connection not available, Try again later!";
                  $rootScope.Validation($scope.ErrorMessage);
              } else if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getScheduledConsulatation(params);
        //LoginService.getScheduledNowPhoneConsulatation(params);
    }

    $scope.doGetPrimaryPatientLastName = function() {
      var params = {
            patientId: $rootScope.primaryPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.primaryPatientLastNameArray = [];
                angular.forEach(data.data, function(index) {
                    $rootScope.primaryPatientLastNameArray.push({
                        'id': index.$id,
                        'patientName': index.patientName,
                        'lastName': index.lastName,
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
                    $rootScope.primaryPatientLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.primaryPatientLastNameArray[0].lastName);
                } else {
                    $rootScope.primaryPatientLastName = '';
                }
                $rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' ' + $rootScope.primaryPatientLastName;
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                   $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getPrimaryPatientLastName(params);
    };
    $scope.doGetPatientProfiles = function() {
      var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
              $rootScope.primaryPatientDetails = [];
                angular.forEach(data.data, function(index) {
                    $rootScope.primaryPatientDetails.push({
                        'account': angular.fromJson(index.account),
                        'address': index.address,
                        'addresses': angular.fromJson(index.addresses),
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
                });
                $rootScope.patientInfomation = data.data[0];
                $rootScope.patientAccount = data.data[0].account;
                $rootScope.patientAddresses = data.data[0].addresses;
                $rootScope.patientAnatomy = data.data[0].anatomy;
                $rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
                $rootScope.patientPhysicianDetails = data.data[0].physicianDetails;
                $rootScope.PatientImage = $rootScope.patientAccount.profileImagePath;
                $rootScope.address = data.data[0].address;
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
                }
                $rootScope.homePhone = data.data[0].homePhone;
                $rootScope.mobilePhone = data.data[0].mobilePhone;
                if ($rootScope.OrganizationLocation === 'on') {
                    if (typeof data.data[0].location !== 'undefined') {
                        $rootScope.location = data.data[0].location;
                    } else {
                        $rootScope.location = '';
                    }
                    if (typeof data.data[0].organization !== 'undefined') {

                        $rootScope.organization = data.data[0].organization;
                    } else {
                        $rootScope.organization = '';
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
                $scope.doGetPrimaryPatientLastName();
                $scope.doGetScheduledNowPhoneConsulatation('tab.userhome');
            },
            error: function(data,status) {
               if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                $scope.ssoMessage = 'Authentication Failed! Please try again later!';
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
              }
            }
        };

        LoginService.getPatientProfiles(params);
    };
    $scope.doDeleteWaitingConsultant = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.videoWaitingConsultentDetails[0].consultationId,
            success: function(data) {
              if (ionic.Platform.is('browser') !== true) {
                  navigator.notification.alert(
                      'Consultation saved successfully!', // message
                      function() {
                          $scope.doGetlocationResponse();
                          return;
                      },
                      $rootScope.alertMsgName, // title
                      'Done' // buttonName
                  );
                  return false;
                } else {
                  $scope.doGetlocationResponse();
                }
            },
            error: function(data, status) {
              if (status === 0) {
                  $scope.ErrorMessage = "Internet connection not available, Try again later!";
                  $rootScope.Validation($scope.ErrorMessage);
              } else if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                  navigator.notification.alert(
                      'Failed to save consultation!', // message
                      function() {
                          $scope.doGetlocationResponse();
                          return;
                      },
                      $rootScope.alertMsgName, // title
                      'Done' // buttonName
                  );
                  return false;
              }
            }
        };
        LoginService.deleteWaitingConsultant(params);
    }
    $scope.doGetWaitingRoom = function() {
        $state.go('tab.waitingRoom');
    }
    $scope.enterWaitingRoom = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;
        $scope.doGetWaitingRoom();
    }
    $scope.doGetWaitingConsultantPatientProfiles = function() {
          var params = {
              accessToken: $rootScope.accessToken,
              patientId: $rootScope.videoWaitingConsultentDetails[0].patientId,
              success: function(data) {
                      $scope.selectedPatientDetails = [];
                      angular.forEach(data.data, function(index) {
                          $scope.selectedPatientDetails.push({
                            'identifiers': angular.fromJson(index.identifiers),
                              'account': angular.fromJson(index.account),
                              'address': index.address,
                              'addresses': angular.fromJson(index.addresses),
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
                      $rootScope.currentPatientDetails = $scope.selectedPatientDetails;
                      $rootScope.cutaddress = $rootScope.currentPatientDetails[0].address;
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
                      if($rootScope.primaryPatientId != $rootScope.videoWaitingConsultentDetails[0].patientId) {
                        $rootScope.patRelationShip = $rootScope.currentPatientDetails[0].dependentRelation.relationship;
                      } else {
                        $rootScope.patRelationShip = '';
                      }

                      $.getScript("lib/jquery.signalR-2.1.2.js", function(data, textStatus, jqxhr) {

                      });
                      setTimeout(function() {
                        $scope.enterWaitingRoom($rootScope.currentPatientDetails[0].account.profileImage, $rootScope.currentPatientDetails[0].patientName, $rootScope.currentPatientDetails[0].lastName, $rootScope.currentPatientDetails[0].dob, $rootScope.primaryPatientName)
                      }, 100);
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

          LoginService.getSelectedPatientProfiles(params);
      }

    $scope.doGetWaitingConsultent = function() {
      $rootScope.WaitingConsultentDetails = '';
      $rootScope.videoWaitingConsultentDetails = '';
      $rootScope.phoneWaitingConsultentDetails = '';
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data.data.length !== 0) {
                    $state.go('tab.userhome');
                    $rootScope.WaitingConsultentDetails = [];
                    angular.forEach(data.data, function(index, item) {
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

                    $rootScope.videoWaitingConsultentDetails = $rootScope.WaitingConsultentDetails.filter(function(r) { var show = r.encounterTypeCode == 3; return show; });
                    $rootScope.phoneWaitingConsultentDetails = $rootScope.WaitingConsultentDetails.filter(function(r) { var show = r.encounterTypeCode == 2; return show; });
                    $rootScope.consultationId = $rootScope.videoWaitingConsultentDetails[0].consultationId;
                    $rootScope.patientId = $rootScope.videoWaitingConsultentDetails[0].patientId;
                    deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(e){}, 401);

                    var confirmPopup = $ionicPopup.confirm({

                        title: "<div class='locationtitle appointProgreeTitle localizejs'> Appointment in progress </div> ",

                        templateUrl: 'templates/waitingConsultent.html',
                        cssClass: 'locpopup',
                        hardwareBackButtonClose: false,

                        buttons: [{
                            text: '<b class="localizejs">No</b>',
                            onTap: function(e) {
                              //  $scope.showAlert();
                                return true;
                            }

                        }, {
                            text: '<b class="localizejs">Yes</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                //  return true;
                                //$rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                            }
                        }, ],

                    });
                    $timeout(function(){
                     confirmPopup.close();
                        }, 1794000);
                    confirmPopup.then(function(res) {
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
            error: function(data, status) {
              if (status === 0) {
                  $scope.ErrorMessage = "Internet connection not available, Try again later!";
                  $rootScope.Validation($scope.ErrorMessage);
              } else if(status === 503) {
                $scope.callServiceUnAvailableError();
              }
            }
        };

        LoginService.getWaitingConsultent(params);
    }
    $scope.loction = {};
    $scope.doGetCountryLocations = function() {
        $rootScope.listOfCountries = '';
        $rootScope.listOfCountry = '';

        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.listOfCountries = [];
                $rootScope.listOfCountry = [];

                if (data.data[0] !== '') {
                    angular.forEach(data.data, function(index) {
                        $rootScope.listOfCountries.push({
                            'conditionTypeId': index.conditionTypeId,
                            'description': index.description,
                            'createdDate': index.createdDate,
                            'id': index.id,
                            'country': angular.fromJson(index.countries)

                        });
                        angular.forEach(index.countries, function(index) {
                            $rootScope.listOfCountry.push({
                                'country': index.country,
                                'countryCode': index.countryCode,
                                'region': angular.fromJson(index.regions)
                            });
                        });

                    });
                }

            },
            error: function(data, status) {
              if (status === 0) {
                  $scope.ErrorMessage = "Internet connection not available, Try again later!";
                  $rootScope.Validation($scope.ErrorMessage);
              } else if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getListOfCountryLocation(params);
    }
    $scope.showAlert = function() {
        $scope.doGetCountryLocations();
        $state.go("tab.CurrentLocationlist");
    };

    var deregisterBackButton;
    $scope.doGetlocationResponse = function() {
          var params = {
              accessToken: $rootScope.accessToken,
              success: function(data) {
                  if (data.active == true) {
                      $state.go('tab.userhome');

                      deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(e){}, 401);

                      var confirmPopup = $ionicPopup.confirm({

                          title: "<div class='locationtitle localizejs'> Confirm Current Location </div> ",

                          templateUrl: 'templates/currentLocation.html',
                          cssClass: 'locpopup',
                          hardwareBackButtonClose: false,

                          buttons: [{
                              text: '<b class="localizejs">No</b>',
                              onTap: function(e) {

                                  $scope.showAlert();
                                  return true;
                              }
                          }, {
                              text: '<b class="localizejs">Yes</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                  //  return true;
                                  //$rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
                              }
                          }, ],

                      });
                      $timeout(function(){
                       confirmPopup.close();
                          }, 1794000);
                      confirmPopup.then(function(res) {
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
              error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }
              }
          };

          LoginService.getLocationResponse(params);
      }
    $scope.doGetRelatedPatientProfiles = function(redirectPage) {
      var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.RelatedPatientProfiles = [];
                angular.forEach(data.data, function(index) {
                    if (typeof index.gender !== 'undefined') {
                        if (index.gender === 'F') {
                            $scope.patGender = "Female";
                        } else {
                            $scope.patGender = "Male";
                        }
                    } else {
                        $scope.patGender = "NA";
                    }
                    var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                        codeId: index.relationCode
                    })
                    if (getdependRelationShip.length !== 0) {
                        var depRelationShip = getdependRelationShip[0].text;
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
                if (redirectPage === 'tab.userhome') {
                  $scope.doGetWaitingConsultent();
                  //$state.go('tab.userhome');
                } else {
                    $scope.doGetExistingConsulatation();
                }
            },
            error: function(data,status) {
              if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                 $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getRelatedPatientProfiles(params);
    };
    $scope.doGetCodesSet = function() {
      var params = {
            hospitalId: $rootScope.hospitalId,
            accessToken: $rootScope.accessToken,
            fields: 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns,eyecolor,haircolor,ethnicity,bloodtype,relationship,heightunit,weightunit',
            success: function(data) {
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
                angular.forEach(data.data, function(index) {
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
                $rootScope.listOfWeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Weight Units"
                });
                $rootScope.listOfBloodtype = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Blood Type"
                });
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        $rootScope.MedicationAllegiesItem = "";
        $rootScope.CurrentMedicationItem = "";
        $rootScope.PatientChronicConditionsSelected = "";
        $rootScope.SecondaryConcernText = "";
        $rootScope.PrimaryConcernText = "";
        $rootScope.PatientPrimaryConcern = "";
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
                    if ($rootScope.consultationStatusId === 71) {
                        navigator.notification.alert(
                            'Your consultation is already started on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 72) {
                        navigator.notification.alert(
                            'Your consultation is already ended.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 79) {
                        navigator.notification.alert(
                            'Your consultation is cancelled.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 80) {
                        navigator.notification.alert(
                            'Your consultation is in progress on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    }
                }
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
                $rootScope.intakeForm = data.data[0].intakeForm;
                $rootScope.PatientAge = $rootScope.patientExistInfomation.dob;
                $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;;
                $rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
                $rootScope.PatientImageSelectUser = $rootScope.patientExistInfomation.profileImagePath;
                $scope.doGetExistingPatientName();
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getExistingConsulatation(params);
    }
    $scope.doGetExistingPatientName = function() {
        var params = {
            patientId: $rootScope.appointmentsPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.PatientFirstName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);
                $rootScope.PatientLastName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].lastName);
                if (typeof data.data[0].profileImagePath !== 'undefined' && data.data[0].profileImagePath !== '') {
                    var hosImage = data.data[0].profileImagePath;
                    if (hosImage.indexOf("http") >= 0) {
                        $rootScope.PatientImageSelectUser = hosImage;
                    } else {
                        $rootScope.PatientImageSelectUser = apiCommonURL + hosImage;
                    }
                } else {
                    $rootScope.PatientImageSelectUser = get2CharInString.getProv2Char(data.data[0].patientName + ' ' + data.data[0].lastName);
                }
                $state.go('tab.waitingRoom');
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getPrimaryPatientLastName(params);
    }

    $scope.chkPatientFilledAllRequirements = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.hasRequiredFields = data.data[0].hasRequiredFields;
              //  $rootScope.currentPatientDetails = data.data;
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getPatientFilledAllRequirements(params);
    }


    $rootScope.jwtToken = '';
    $scope.doGetTokenUsingSsoJwt = function() {
        var params = {
            jwt: $rootScope.jwtToken,
            success: function(data) {
                $rootScope.accessToken = data.data[0].access_token;
                $scope.getCurrentTimeForSessionLogout = new Date();
                $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');
                $scope.chkPatientFilledAllRequirements();
                $scope.doGetCodesSet();
                $scope.doGetSingleUserHospitalInformation();
                $scope.doGetPatientProfiles();
              //  $scope.doGetRelatedPatientProfiles('userhome');
            },
            error: function(data, status) {
                var networkState = navigator.connection.type;
                if (networkState !== 'none') {
                    $scope.ErrorMessage = "Incorrect Password. Please try again";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getTokenUsingSsoJwt(params);
    }
    if (!angular.isUndefined($stateParams.jwtToken) && $stateParams.jwtToken !== '') {
        if (window.localStorage.getItem("external_load") !== null && window.localStorage.getItem("external_load") !== "") {
            $rootScope.jwtToken = $stateParams.jwtToken;
            if (deploymentEnvLogout === 'Single') {
                if (deploymentEnvForProduction === 'Production') {
                    $rootScope.hospitalId = singleHospitalId;
                    apiCommonURL = 'https://connectedcare.md';
                    api_keys_env = 'Production';
                    $rootScope.APICommonURL = 'https://connectedcare.md';
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
            $scope.doGetTokenUsingSsoJwt();
        }
    } else {
         if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
        } else if (deploymentEnvLogout === "Single") {
             if(cobrandApp === 'MDAmerica' && deploymentEnv === "Single"){
                  $rootScope.cobrandApp_New = 'MDAmerica';
                  $rootScope.deploymentEnv_New = deploymentEnv;
                  $state.go('tab.login');
             } else {
                  $state.go('tab.loginSingle');
             }
        } else {
            $state.go('tab.login');
        }
    }
})

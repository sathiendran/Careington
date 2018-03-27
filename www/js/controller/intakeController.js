angular.module('starter.controllers')
    .controller('IntakeFormsCtrl', function ($scope, $ionicPlatform, $window, $ionicBackdrop, htmlEscapeValue, $interval, $ionicSideMenuDelegate, replaceCardNumber, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $timeout, CustomCalendar, CustomCalendarMonth) {

        //venkat start cancelbtnSecondSpanishFont concernListTitleSecondSpanishFont donebtnSecondSpanishFont
        window.addEventListener('native.keyboardhide', function () {
            $("#localize-widget").hide();
        })
          $("#localize-widget").hide();
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
        if (localizeCurrent == "Español") {
            $scope.concernListTitleSpanishFont = "font-size:16px !important;margin-left: 30px;";
            $scope.cancelbtnSpanishFont = "font-size:16px !important";
            $scope.donebtnSpanishFont = "font-size:16px !important";

            $scope.concernListTitleSecondSpanishFont = "font-size:16px !important;margin-left: 30px;";
            $scope.cancelbtnSecondSpanishFont = "font-size:14px !important";
            $scope.donebtnSecondSpanishFont = "font-size:14px !important";
            $scope.PatientConcernCancel = "padding: 7px;";

        } else {
            $scope.concernListTitleSpanishFont = "font-size:20px !important";
            $scope.cancelbtnSpanishFont = "font-size:20px !important";
            $scope.donebtnSpanishFont = "font-size:20px !important";

            $scope.concernListTitleSecondSpanishFont = "font-size:20px !important;";
            $scope.cancelbtnSecondSpanishFont = "font-size:20px !important";
            $scope.donebtnSecondSpanishFont = "font-size:20px !important";
              $scope.PatientConcernCancel = "padding: 10px;";

        }
        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            if (isLang == "Español") {
                $scope.concernListTitleSpanishFont = "font-size:16px !important;margin-left: 30px;";
                $scope.cancelbtnSpanishFont = "font-size:16px !important";
                $scope.donebtnSpanishFont = "font-size:16px !important";

                $scope.concernListTitleSecondSpanishFont = "font-size:16px !important;margin-left: 30px;";
                $scope.cancelbtnSecondSpanishFont = "font-size:14px !important";
                $scope.donebtnSecondSpanishFont = "font-size:14px !important";
                $scope.PatientConcernCancel = "padding: 7px;";

            } else {
                $scope.concernListTitleSpanishFont = "font-size:20px !important";
                $scope.cancelbtnSpanishFont = "font-size:20px !important";
                $scope.donebtnSpanishFont = "font-size:20px !important";
                $scope.PatientConcernCancel = "padding: 10px;";

            }
            isLang = "";
        });
        //venkat end

        $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        debugger;
        $("#localize-widget").hide();
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
                if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) === 'block') {
                    $ionicBackdrop.release();
                    $(".ion-google-place-container").css({
                        "display": "none"
                    });
                } else {
                    navigator.app.backHistory();
                }
            }
        }, 100);
        // activeConsultConnection.stop();
        //  activeConsultConnection.qs = {};


        activeConsultConnection = null;
        activeRoomConHub = null;
        $rootScope.currState = $state;
        $rootScope.monthsList = CustomCalendar.getMonthsList();
        $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
        $rootScope.limit = 4;
        $rootScope.Concernlimit = 1;
        $rootScope.checkedPrimary = 0;
        $scope.doGetSingleHosInfoForiTunesStage = function () {
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
                success: function (data) {
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
                        //$state.go('tab.loginSingle');
                        $state.go('tab.singleTheme');
                    } else {
                        $state.go('tab.login');
                    }
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getHospitalInfo(params);
        }

        $rootScope.goBackButton = function(page) {
            debugger;
            $state.go('tab.'+ page);
        }

        $rootScope.ClearRootScope = function () {
            $rootScope.cuttlocations = '';
            $window.localStorage.setItem('tokenExpireTime', '');
            $(".overlay").css({ "display": "none" });
            if ($rootScope.chkSSPageEnter) {
                $rootScope.chkSSPageEnter = false;
                $ionicSideMenuDelegate.toggleLeft();
            }
            if(typeof $scope.modal != 'undefined' &&  $scope.modal != '' && $scope.modal != null) {
                  $scope.modal.remove();
            }
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
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                    $state.go('tab.singleTheme');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
                    $state.go('tab.singleTheme');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                } else {
                    $state.go('tab.login');
                    $timeout(function () {
                        //$window.location.reload(true);
                    });
                }
            }
            $rootScope = $rootScope.$new(true);
            $scope = $scope.$new(true);
            for (var prop in $rootScope) {
                if (prop.substring(0, 1) !== '$') {
                    delete $rootScope[prop];
                }
            }
            $(".ion-google-place-container").css({
                "display": "none"
            });

            $ionicBackdrop.release();
        }
        $rootScope.checkPreLoadDataAndSelectionAndRebindSelectionList = function (selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function (item) {
                item.checked = false;
            });
            if (!angular.isUndefined(selectedListItem)) {

                if (selectedListItem.length > 0) {
                    angular.forEach(selectedListItem, function (value1) {
                        angular.forEach(mainListItem, function (value2) {
                            if (value1.description === value2.text) {
                                value2.checked = true;
                            }
                        });
                    });
                }
            }
        };
        var locationdet = $rootScope.locationdet;
        $scope.locat = false;
        $scope.doGetExistingConsulatation = function () {
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $scope.existingConsultation = data;
                    $rootScope.consultionInformation = data.data[0].consultationInfo;
                    $rootScope.inTakeForm = data.data[0].intakeForm;
                    $rootScope.inTakeFormCurrentMedication = $rootScope.inTakeForm.medications;
                    if (!angular.isUndefined($rootScope.inTakeFormCurrentMedication)) {
                        $rootScope.MedicationCountValid = $rootScope.inTakeFormCurrentMedication.length;
                        if (typeof $rootScope.MedicationCountValid !== 'undefined' && $rootScope.MedicationCountValid !== '') {
                            $scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormCurrentMedication, $rootScope.CurrentMedicationList);
                            $rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {
                                checked: true
                            });
                            $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
                            if ($rootScope.patinentCurrentMedication) {
                                $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
                                $rootScope.MedicationCountValid = $rootScope.MedicationCount;
                            }

                        }
                    }
                    $rootScope.inTakeFormChronicConditions = $rootScope.inTakeForm.medicalConditions;
                    if (!angular.isUndefined($rootScope.inTakeFormChronicConditions)) {
                        $rootScope.ChronicValid = $rootScope.inTakeFormChronicConditions.length;
                        $rootScope.ChronicCount = $rootScope.inTakeFormChronicConditions.length;
                        if (typeof $rootScope.ChronicValid !== 'undefined' && $rootScope.ChronicValid !== '') {
                            $scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormChronicConditions, $rootScope.chronicConditionList);

                            $rootScope.PatientChronicConditionItem = $filter('filter')($rootScope.chronicConditionList, {
                                checked: true
                            });
                            $rootScope.PatientChronicCondition = $rootScope.PatientChronicConditionItem;
                            $rootScope.PatientChronicConditionsSelected = $rootScope.PatientChronicConditionItem;
                            if ($rootScope.PatientChronicCondition) {
                                $rootScope.ChronicCountValidCount = $rootScope.PatientChronicCondition.length;
                                $rootScope.ChronicCount = $rootScope.inTakeFormChronicConditions.length;
                            }
                        }
                    }
                    $rootScope.inTakeFormPriorSurgeories = $rootScope.inTakeForm.surgeries;
                    if (!angular.isUndefined($rootScope.inTakeFormPriorSurgeories)) {
                        $rootScope.PriorSurgeryValid = $rootScope.inTakeFormPriorSurgeories.length;
                        if (typeof $rootScope.PriorSurgeryValid !== 'undefined' && $rootScope.PriorSurgeryValid !== '') {
                            SurgeryStocksListService.ClearSurgery();
                            angular.forEach($rootScope.inTakeFormPriorSurgeories, function (Priorvalue) {
                                var surgeryMonthName = Priorvalue.month;
                                var PriorSurgeryDate = new Date(Priorvalue.year, surgeryMonthName - 1, 01);
                                var dateString = PriorSurgeryDate;
                                var surgeryName = Priorvalue.description;
                                var stockSurgery = SurgeryStocksListService.addSurgery(surgeryName, dateString);
                                $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
                                $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
                            });
                            $rootScope.PriorSurgeryValidCount = $rootScope.IsToPriorCount;
                        }
                    }
                    $rootScope.inTakeFormMedicationAllergies = $rootScope.inTakeForm.medicationAllergies;
                    if (!angular.isUndefined($rootScope.inTakeFormMedicationAllergies)) {
                        $rootScope.AllegiesCountValid = $rootScope.inTakeFormMedicationAllergies.length;
                        if (typeof $rootScope.AllegiesCountValid !== 'undefined' && $rootScope.AllegiesCountValid !== '') {
                            $scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormMedicationAllergies, $rootScope.MedicationAllegiesList);
                            $rootScope.MedicationAllegiesItem = $filter('filter')($rootScope.MedicationAllegiesList, {
                                checked: true
                            });
                            $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
                            if ($rootScope.patinentMedicationAllergies) {
                                $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
                                $rootScope.AllegiesCountValid = $rootScope.AllegiesCount;
                            }
                        }
                    }
                    $state.go('tab.ChronicCondition');
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.existingConsultation = 'Error getting existing consultation';
                    }
                }
            };
            LoginService.getExistingConsulatation(params);
        }

        $rootScope.goBackFromConcern = function () {
            $state.go($rootScope.locationdet);
        }
        $scope.model = null;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        $rootScope.PreviousDate = yyyy + '-' + mm + '-' + dd; //Previous Month 2015-06-23
        $rootScope.PopupValidation = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                    $rootScope.PrimaryPopup = $rootScope.PrimaryPopup - 1;
                });
            }
            refresh_close();
            $rootScope.PrimaryPopup = $rootScope.PrimaryPopup + 1;
            var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="localizejs">' + $a + '! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".PopupError_Message").append(top);
            refresh_close();

        }
        // Get list of primary concerns lists
        $scope.primaryConcernList = $rootScope.hospitalCodesList;
        $scope.loadPrimaryConcerns = function () {
            $scope.data.searchProvider = '';
            $scope.clearSelectionAndRebindSelectionList($rootScope.PatientPrimaryConcernItem, $scope.primaryConcernList);
            if ($rootScope.getSecondaryConcernAPIList !== "") {
                if (typeof $scope.PatientPrimaryConcernItem !== 'undefined') {
                    if ($rootScope.IsValue !== '' && $rootScope.IsValue !== 0) {
                        $rootScope.getCheckedPrimaryConcern = $filter('filter')($scope.primaryConcernList, {
                            text: $rootScope.PrimaryConcernText
                        });
                        $rootScope.getCheckedPrimaryConcern[0].checked = true;
                    }
                    if ($rootScope.IsValue === '') {
                        $rootScope.getCheckedPrimaryConcern = $filter('filter')($scope.primaryConcernList, {
                            text: $rootScope.PrimaryConcernText
                        });
                        $rootScope.getCheckedPrimaryConcern[0].checked = false;
                    }
                }
                if (typeof $scope.PatientSecondaryConcernItem !== 'undefined') {
                    $scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {
                        text: $rootScope.SecondaryConcernText
                    });
                    $scope.getCheckedSecondaryConcern[0].checked = false;
                }
            }
            if (typeof $rootScope.PrimaryCount === "") {
                $rootScope.checkedPrimary = "";
            } else {
                $rootScope.checkedPrimary = $rootScope.PrimaryCount;
            }
            $ionicModal.fromTemplateUrl('templates/tab-ConcernsList.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        var isOpenError = 0;
        $scope.closePrimaryConcerns = function () {
            $rootScope.PatientPrimaryConcernItem = $filter('filter')($scope.primaryConcernList, {
                checked: true
            });
            if ($scope.PatientPrimaryConcernItem !== '') {
                $rootScope.PrimaryConcernText = $scope.PatientPrimaryConcernItem[0].text;
                $rootScope.codeId = $scope.PatientPrimaryConcernItem[0].codeId;
                if (typeof $rootScope.PatientSecondaryConcern[0] !== 'undefined') {
                    if ($scope.PatientPrimaryConcernItem[0].text === $rootScope.PatientSecondaryConcern[0].text) {
                        if(isOpenError == 0) {
                            $scope.ErrorMessage = "Primary and Secondary Concerns must be different";
                            $rootScope.ValidationFunction1($scope.ErrorMessage);
                            isOpenError += 1;
                        }
                        
                    } else {
                        $rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
                        $rootScope.IsValue = $scope.PatientPrimaryConcernItem.length;
                        $rootScope.PrimaryCount = $scope.PatientPrimaryConcernItem.length;
                        $scope.modal.remove();
                    }
                } else {
                    $rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
                    $rootScope.IsValue = $scope.PatientPrimaryConcernItem.length;
                    $rootScope.PrimaryCount = $scope.PatientPrimaryConcernItem.length;
                    $scope.modal.remove();
                }
            }
        };
        // Onchange of primary concerns
        $scope.OnSelectPatientPrimaryConcern = function (position, primaryConcernList, items) {
            angular.forEach(primaryConcernList, function (item) {
                if (item.text === items.text)
                    item.checked = true;
                else item.checked = false;
            });
            if (items.text === "Other (provide details below)")
                $scope.openOtherPrimaryConcernView();
            else $scope.closePrimaryConcerns();
        }
        $rootScope.PrimaryPopup = 0;
        // Open text view for other primary concern
        $scope.openOtherPrimaryConcernView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<div class="PopupError_Message ErrorMessageDiv" ></div><textarea name="comment" id="comment-textarea" maxlength="230" ng-model="data.PrimaryConcernOther" class="textAreaPop">',
                title: '<span class="localizejs">Enter Primary Concern</span>',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<span class="localizejs">Cancel</span>',
                    onTap: function (e) {
                        debugger;
                        angular.forEach($scope.primaryConcernList, function (item) {
                            item.checked = false;
                        });
                    }
                }, {
                    text: '<b class="localizejs">Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        debugger;
                        if (!$scope.data.PrimaryConcernOther) {
                            if ($rootScope.PrimaryPopup === 0) {
                                $scope.ErrorMessages = "Please enter a reason for today's visit";
                                $rootScope.PopupValidation($scope.ErrorMessages);
                            }
                            e.preventDefault();
                        } else {
                            angular.forEach($scope.primaryConcernList, function (item) {
                                item.checked = false;
                            });
                            var newPrimaryConcernItem = {
                                text: $scope.data.PrimaryConcernOther,
                                checked: true
                            };
                            $scope.primaryConcernList.splice(1, 0, newPrimaryConcernItem);
                            $scope.closePrimaryConcerns();
                            return $scope.data.PrimaryConcernOther;
                        }

                    }

                }]
            });
        };

        $scope.removePrimaryConcern = function (index, item) {
            $rootScope.PatientPrimaryConcern.splice(index, 1);
            var indexPos = $scope.primaryConcernList.indexOf(item);
            $scope.primaryConcernList[indexPos].checked = false;
            $rootScope.IsValue = $rootScope.PatientPrimaryConcern.length;
            $rootScope.IsValue = $scope.primaryConcernList;
            $rootScope.IsValue = "";
        }
        $rootScope.PrimaryNext = 0;
        $rootScope.ConcernsValidation = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                    $rootScope.PrimaryNext = $rootScope.PrimaryNext - 1;
                });
            }
            refresh_close();
            $rootScope.PrimaryNext = $rootScope.PrimaryNext + 1;
            var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 23px;"></i> ' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Error_Message").append(top);
            refresh_close();
        }

        $scope.PatientConcernsDirectory = function (ChronicValid) {
            $rootScope.ChronicValid = ChronicValid; // pre populated valid value
            $rootScope.IsValue = $rootScope.PatientPrimaryConcern.length;
            if ($rootScope.IsValue === 0 || $rootScope.IsValue === undefined) {
                if ($rootScope.PrimaryNext === 0) {
                    $scope.ErrorMessage = "Primary Concern Can't be Empty";
                    $rootScope.ConcernsValidation($scope.ErrorMessage);
                }
            } else {
                $rootScope.birHistory = {};
                $rootScope.isPaid = '';
                $rootScope.appointIntakePage = '';
                $rootScope.appointmentsPage = '';
                $rootScope.userhome = '';
                $rootScope.SSPage = '';
                $scope.doPostOnDemandConsultation();
            }
        }
        $scope.doPutScheduledConsultationSave = function () {
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                ConsultationSaveData: $rootScope.scheduledConsultSave,
                success: function (data) {
                    console.log($rootScope.scheduledConsultSave);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.putConsultationSave(params);
        }
        $scope.doGetConcentToTreat = function () {
            var params = {
                documentType: 2,
                hospitalId: $rootScope.hospitalId,
                success: function (data) {
                    $rootScope.concentToTreatContent = htmlEscapeValue.getHtmlEscapeValue(data.data[0].documentText);
                    if ($rootScope.appointmentsPage === true && $rootScope.schedulePatAge === 0) {
                        //$rootScope.appointmentsPage = false;
                        if ($rootScope.schedulePatAge === 0 && $rootScope.Cttonscheduled !== 'on') {
                            $scope.doPutScheduledConsultationSave();
                        }
                        if ($rootScope.Cttonscheduled === 'on') {
                            $state.go('tab.ConsentTreat');
                        } else if ($rootScope.appointmentwaivefee == true) {
                            $rootScope.doGetWaiveFeeHospitalInformation();
                      //  } else if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' && $rootScope.appointmentwaivefee === false && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.copayAmount != 0) {
                        } else if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount != 0 && $rootScope.paymentMode === 'on' && $rootScope.appointmentwaivefee === false && $rootScope.copayAmount != 0) {
                            $rootScope.doPostDepitDetails();
                      //  } else if ($rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.appointmentwaivefee === true && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.copayAmount != 0) {
                      } else if ($rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.appointmentwaivefee === true && $rootScope.copayAmount != 0) {
                            $state.go('tab.receipt');
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $rootScope.enableCreditVerification = "none";
                            $rootScope.enableWaivefeeVerification = "block";
                            $rootScope.ReceiptTimeout();
                            /*  } else if($rootScope.appointmentwaivefee === true){
                                 $rootScope.applyPlanMode = "none";
                                 $rootScope.chooseHealthHide = 'initial';
                                 $rootScope.chooseHealthShow = 'none';
                                 $rootScope.verifyPlanMode = "block";
                                 $rootScope.consultChargeNoPlanPage = "none";
                                 $rootScope.healthPlanPage = "block";
                                 $rootScope.chooseHealthHide = 'initial';
                                 $rootScope.chooseHealthShow = 'none';
                                 $rootScope.providerName = "";
                                 $rootScope.PolicyNo = "";
                                 $scope.doGetPatientHealthPlansList();
                                 $state.go('tab.consultCharge');*/
                        } else {
                            $rootScope.doGetHospitalInformation();
                        }
                    } else {
                        $rootScope.appointmentwaivefee = '';
                        $rootScope.appointmentsPage = false;
                        $state.go('tab.ConsentTreat');
                    }
                },
                error: function (data, status) {
                    if (data == 'null') {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getConcentToTreat(params);
        }

        $scope.goToConsentToTreat = function () {
            $rootScope.scheduledConsultSave = '';
            if ($rootScope.userAgeForIntake === 8) {
                $scope.ConsultationSaveData = {
                    "medicationAllergies": [],
                    "surgeries": [],
                    "medicalConditions": [],
                    "medications": [],
                    "infantData": [],
                    "concerns": []
                };
                $scope.schedConsultationSaveData = {
                    "infantData": []
                };
                if (typeof $("input[name='birthBorn']:checked").val() === 'undefined' || $("input[name='birthBorn']:checked").val() === ' ') {
                    $scope.ErrorMessage = "Please choose if the patient was born at full term or not?";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                } else if (typeof $("input[name='birthVagin']:checked").val() === 'undefined' || $("input[name='birthVagin']:checked").val() === ' ') {
                    $scope.ErrorMessage = "Please choose if the patient was born vaginally or not?";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                } else if (typeof $("input[name='birthDischargedwithMother']:checked").val() === 'undefined' || $("input[name='birthDischargedwithMother']:checked").val() === ' ') {
                    $scope.ErrorMessage = "Please choose if the patient was discharged with the Mother or not?";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                } else if (typeof $("input[name='birthVaccination']:checked").val() === 'undefined' || $("input[name='birthVaccination']:checked").val() === ' ') {
                    $scope.ErrorMessage = "Please choose if the patients vaccinations are up-to-date or not?";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                } else {
                    $scope.ConsultationSaveData.infantData = {
                        "patientAgeUnderOneYear": "Y",
                        "fullTerm": $("input[name='birthBorn']:checked").val(),
                        "vaginalBirth": $("input[name='birthVagin']:checked").val(),
                        "dischargedWithMother": $("input[name='birthDischargedwithMother']:checked").val(),
                        "vaccinationsCurrent": $("input[name='birthVaccination']:checked").val()
                    }
                    $scope.schedConsultationSaveData.infantData = {
                        "patientAgeUnderOneYear": "Y",
                        "fullTerm": $("input[name='birthBorn']:checked").val(),
                        "vaginalBirth": $("input[name='birthVagin']:checked").val(),
                        "dischargedWithMother": $("input[name='birthDischargedwithMother']:checked").val(),
                        "vaccinationsCurrent": $("input[name='birthVaccination']:checked").val()
                    }
                    $rootScope.scheduledConsultSave = $scope.schedConsultationSaveData;
                    //$rootScope.appointmentsPage = false;
                    $scope.doGetConcentToTreat();
                }
            } else {
                $scope.ConsultationSaveData.infantData = {
                    "patientAgeUnderOneYear": "",
                    "fullTerm": "",
                    "vaginalBirth": "",
                    "dischargedWithMother": "",
                    "vaccinationsCurrent": ""
                }
                //$rootScope.appointmentsPage = false;
                $scope.doGetConcentToTreat();
            }
        };
        $scope.goToHealthHistory = function () {
            if ($rootScope.userAgeForIntake === 8) {
                $state.go('tab.intakeBornHistory');
            } else {
                $scope.goToConsentToTreat();
            }
        };

        $scope.backFromIntakeBornHisPage = function () {
            if ($rootScope.concentToTreatPreviousPage === 'tab.intakeBornHistory' && $rootScope.appointIntakePage === 0) {
                $state.go('tab.appoimentDetails');
            } else if ($rootScope.concentToTreatPreviousPage === 'tab.userhome') {
                $state.go('tab.userhome');
            } else {
                $state.go('tab.CurrentMedication');
            }

        };

        $scope.data = {};
        $scope.$watch('data.searchProvider', function (searchKey) {
            $rootScope.providerSearchKey = searchKey;
            if (typeof $rootScope.providerSearchKey === 'undefined') {
                $scope.data.searchProvider = $rootScope.backProviderSearchKey;
            }
            if ($rootScope.providerSearchKey !== '' && typeof $rootScope.providerSearchKey !== 'undefined') {
                $rootScope.iconDisplay = 'none';
            } else {
                $rootScope.iconDisplay = 'Block';
            }
        });
        $scope.secondaryConcernList = $rootScope.scondaryConcernsCodesList;
        $scope.loadSecondaryConcerns = function () {
            $scope.data.searchProvider = '';
            $scope.clearSelectionAndRebindSelectionList($rootScope.PatientSecondaryConcernItem, $scope.secondaryConcernList);
            if ($rootScope.getSecondaryConcernAPIList !== "") {
                if ($scope.PatientPrimaryConcernItem !== '') {
                    $scope.getCheckedPrimaryConcern = $filter('filter')($scope.primaryConcernList, {
                        text: $rootScope.PrimaryConcernText
                    });
                    $scope.getCheckedPrimaryConcern[0].checked = false;
                }
                if (typeof $scope.PatientSecondaryConcernItem !== 'undefined') {
                    if ($rootScope.secondaryConcernValueExist !== '') {
                        $scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {
                            text: $rootScope.SecondaryConcernText
                        });
                        $scope.getCheckedSecondaryConcern[0].checked = true;
                    }

                    if ($rootScope.secondaryConcernValueExist === '') {
                        $scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {
                            text: $rootScope.SecondaryConcernText
                        });
                        $scope.getCheckedSecondaryConcern[0].checked = false;
                    }
                }
                if (typeof $scope.PatientSecondaryConcernItem === 'undefined') {
                    if ($rootScope.secondaryConcernValueExist !== '') {
                        $scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {
                            text: $rootScope.SecondaryConcernText
                        });
                        $scope.getCheckedSecondaryConcern[0].checked = false;
                    }
                }
            }
            $ionicModal.fromTemplateUrl('templates/tab-SecondaryConcernsList.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        
        $scope.closeSecondaryConcerns = function () {
            $scope.PatientSecondaryConcernItem = $filter('filter')($scope.secondaryConcernList, {
                checked: true
            });
            if ($scope.PatientSecondaryConcernItem !== '') {
                $rootScope.SecondaryConcernText = $scope.PatientSecondaryConcernItem[0].text;
                $rootScope.SecondarycodeId = $scope.PatientSecondaryConcernItem[0].codeId;
                if (typeof $rootScope.PatientPrimaryConcern[0] !== 'undefined') {
                    if ($scope.PatientSecondaryConcernItem[0].text === $rootScope.PatientPrimaryConcern[0].text) {
                        if(isOpenError == 0) {
                            $scope.ErrorMessage = "Primary and Secondary Concerns must be different";
                            $rootScope.ValidationFunction1($scope.ErrorMessage);
                            isOpenError += 1;
                        }
                       
                    } else {
                        $rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
                        $rootScope.secondaryConcernValueExist = $rootScope.PatientSecondaryConcern.length;
                        $scope.modal.remove();
                    }
                } else {
                    $rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
                    $rootScope.secondaryConcernValueExist = $rootScope.PatientSecondaryConcern.length;
                    $scope.modal.remove();
                }
            }
        };
        // Onchange of Secondary concerns
        $scope.OnSelectPatientSecondaryConcern = function (position, secondaryConcernList, items) {
            angular.forEach(secondaryConcernList, function (item) {
                if (item.text == items.text)
                    item.checked = true;
                else item.checked = false;
            });
            if (items.text === "Other (provide details below)") {
                $scope.openOtherSecondaryConcernView();
                item.checked = false;
            } else {
                $scope.closeSecondaryConcerns();
            }
        }
        // Open text view for other Secondary concern
        $scope.openOtherSecondaryConcernView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<textarea name="comment" id="comment-textarea" maxlength="230" ng-model="data.SecondaryConcernOther" class="textAreaPop">',
                title: '<span class="localizejs">Enter Secondary Concern</span>',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<span class="localizejs">Cancel</span>',
                    onTap: function (e) {
                        angular.forEach($scope.secondaryConcernList, function (item) {
                            item.checked = false;
                        });
                    }
                }, {
                    text: '<b class="localizejs">Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.SecondaryConcernOther) {
                            e.preventDefault();
                        } else {
                            angular.forEach($scope.secondaryConcernList, function (item) {
                                item.checked = false;
                            });
                            var newSecodaryConcernItem = {
                                text: $scope.data.SecondaryConcernOther,
                                checked: true
                            };
                            $scope.secondaryConcernList.splice(1, 0, newSecodaryConcernItem);
                            $scope.closeSecondaryConcerns();
                            return $scope.data.SecondaryConcernOther;
                        }
                    }
                }]
            });
        };
        $scope.removeSecondaryConcern = function (index, item) {
            $rootScope.PatientSecondaryConcern.splice(index, 1);
            var indexPos = $scope.secondaryConcernList.indexOf(item);
            $scope.secondaryConcernList[indexPos].checked = false;
            $rootScope.secondaryConcernValueExist = $rootScope.PatientSecondaryConcern.length;
            $rootScope.SecondaryConcernText = '';
            $rootScope.secondaryConcernValueExist = '';
        }

        /*Secondary concern End here*/
        $scope.OnDemandConsultationSaveData = {
            "concerns": [],
            "patientId": $rootScope.patientId
        }
        if ($rootScope.mobilePhone !== '') {
            $scope.OnDemandConsultationSaveData["phone"] = $rootScope.mobilePhone;
        } else if ($rootScope.mobilePhone === '') {
            $scope.OnDemandConsultationSaveData["phone"] = $rootScope.homePhone;
        }
        $scope.doPostOnDemandConsultation = function () {
            if (typeof $rootScope.PrimaryConcernText !== 'undefined') {
                $scope.primaryFilter = $filter('filter')($scope.OnDemandConsultationSaveData.concerns, {
                    description: $rootScope.PrimaryConcernText
                });
                if ($scope.primaryFilter.length === 0) {
                    $scope.OnDemandConsultationSaveData.concerns.push({
                        isPrimary: true,
                        description: $rootScope.PrimaryConcernText
                    });
                }
            }
            if (typeof $rootScope.SecondaryConcernText !== 'undefined' && $rootScope.SecondaryConcernText !== "") {
                $scope.sceondFilter = $filter('filter')($scope.OnDemandConsultationSaveData.concerns, {
                    description: $rootScope.SecondaryConcernText
                });
                if ($scope.sceondFilter.length === 0) {
                    $scope.OnDemandConsultationSaveData.concerns.push({
                        isPrimary: false,
                        description: $rootScope.SecondaryConcernText
                    });
                }
            }
            var params = {
                accessToken: $rootScope.accessToken,
                OnDemandConsultationData: $scope.OnDemandConsultationSaveData,
                patientId: $rootScope.patientId,
                success: function (data) {
                    $rootScope.appointmentwaivefee = '';
                    $rootScope.OnDemandConsultationSaveResult = data.data[0];
                    $rootScope.checkHealthSectionOn = false;
                    $rootScope.consultationAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
                    $rootScope.copayAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
                    $rootScope.consultationId = $rootScope.OnDemandConsultationSaveResult.consultationId;
                    $scope.doGetExistingConsulatation();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.postOnDemandConsultation(params);
        };
        $scope.clearSelectionAndRebindSelectionList = function (selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function (item, key2) {
                item.checked = false;
            });
            if (!angular.isUndefined(selectedListItem)) {
                if (selectedListItem.length > 0) {
                    angular.forEach(selectedListItem, function (value1, key1) {
                        angular.forEach(mainListItem, function (value2, key2) {
                            if (value1.text === value2.text) {
                                value2.checked = true;
                            }
                        });
                    });
                }
            }
        };
        $scope.BackToChronicCondition = function (ChronicValid) {
            $rootScope.ChronicValid = ChronicValid;
            $state.go('tab.ChronicCondition');
        }
        // Open Chronic Condition popup
        $scope.loadChronicCondition = function () {
            $scope.data.searchProvider = '';
            $scope.clearSelectionAndRebindSelectionList($rootScope.PatientChronicConditionsSelected, $rootScope.chronicConditionList);
            if (typeof $rootScope.ChronicCount === 'undefined') {
                $rootScope.checkedChronic = 0;
            } else {
                $rootScope.checkedChronic = $rootScope.ChronicCount;
            }

            $ionicModal.fromTemplateUrl('templates/tab-ChronicConditionList.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.closeChronicCondition = function () {
            $rootScope.PatientChronicConditionItem = $filter('filter')($scope.chronicConditionList, {
                checked: true
            });
            $rootScope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {
                checked: true
            });
            if ($scope.PatientChronicConditionItem !== '') {
                $rootScope.PatientChronicCondition = $rootScope.PatientChronicConditionItem;
                $rootScope.ChronicCount = $rootScope.PatientChronicCondition.length;
                $scope.modal.remove();
            }
        };

        // Onchange of Chronic Condition
        $scope.OnSelectChronicCondition = function (item) {
            if (item.checked === true) {
                $rootScope.checkedChronic++;
            } else {
                $rootScope.checkedChronic--;
            }
            if ($rootScope.checkedChronic === 4) {
                $scope.closeChronicCondition();
            }
        }
        // Open text view for other Chronic Condition
        $scope.openOtherChronicConditionView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<textarea name="comment" id="comment-textarea" ng-model="data.ChronicCondtionOther" class="textAreaPop">',
                title: '<span class="localizejs">Enter Concerns</span>',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<span class="localizejs">Cancel</span>',
                    onTap: function (e) {
                        angular.forEach($scope.chronicConditionList, function (item) {
                            if (item.checked) {
                                if (item.text === "Other")
                                    item.checked = false;
                            }
                        });
                        $rootScope.checkedChronic--;
                    }
                }, {
                    text: '<b class="localizejs">Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.ChronicCondtionOther) {
                            e.preventDefault();
                        } else {
                            angular.forEach($scope.chronicConditionList, function (item) {
                                if (item.checked) {
                                    if (item.text == "Other") {
                                        item.checked = false;
                                    }
                                }
                            });
                            var newchronicConditionItem = {
                                text: $scope.data.ChronicCondtionOther,
                                checked: true
                            };
                            $rootScope.chronicConditionList.splice(1, 0, newchronicConditionItem);
                            return $scope.data.ChronicCondtionOther;
                        }
                    }
                }]
            });
        };
        $scope.removeChronicCondition = function (index, item) {
            $rootScope.PatientChronicCondition.splice(index, 1);
            var indexPos = $rootScope.chronicConditionList.indexOf(item);
            $rootScope.chronicConditionList[indexPos].checked = false;
            $rootScope.ChronicCount = $rootScope.PatientChronicCondition.length;
            $rootScope.checkedChronic--;
            $rootScope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {
                checked: true
            });
        }
        $scope.GoToMedicationAllegies = function (AllegiesCountValid) {
            $state.go('tab.MedicationAllegies');
        }
        // Open Medication Allegies List popup
        $scope.loadMedicationAllegies = function () {
            $scope.data.searchProvider = '';
            $scope.clearSelectionAndRebindSelectionList($rootScope.MedicationAllegiesItem, $rootScope.MedicationAllegiesList);
            if (typeof $rootScope.AllegiesCount === 'undefined') {
                $rootScope.checkedAllergies = 0;
            } else {
                $rootScope.checkedAllergies = $rootScope.AllegiesCount;
            }
            $ionicModal.fromTemplateUrl('templates/tab-MedicationAllegiesList.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        $scope.closeMedicationAllegies = function () {
            $rootScope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {
                checked: true
            });
            if ($rootScope.MedicationAllegiesItem !== '') {
                $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
                $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
                $scope.modal.remove();
            }
        };
        // Onchnge of Medication Alligies
        $scope.OnSelectMedicationAllegies = function (item) {
            if (item.checked === true) {
                $rootScope.checkedAllergies++;
            } else {
                $rootScope.checkedAllergies--;
            }
            if ($rootScope.checkedAllergies === 4) {
                $scope.closeMedicationAllegies();
            }
        }
        // Open text view for other Medication Allergies
        $scope.openOtherMedicationAllgiesView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<textarea name="comment" id="comment-textarea" ng-model="data.MedicationAllergiesOther" class="textAreaPop">',
                title: '<span class="localizejs">Enter Concerns</span>',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<span class="localizejs">Cancel</span>',
                    onTap: function (e) {
                        angular.forEach($scope.MedicationAllegiesList, function (item) {
                            if (item.checked) {
                                if (item.text === "Other")
                                    item.checked = false;
                            }
                        });
                        $rootScope.checkedAllergies--;
                    }
                }, {
                    text: '<b class="localizejs">Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.MedicationAllergiesOther) {
                            e.preventDefault();
                        } else {
                            angular.forEach($scope.MedicationAllegiesList, function (item) {
                                if (item.checked) {
                                    if (item.text === "Other") {
                                        item.checked = false;
                                    }
                                }
                            });
                            var newMedicationAllegiesItem = {
                                text: $scope.data.MedicationAllergiesOther,
                                checked: true
                            };
                            $rootScope.MedicationAllegiesList.splice(1, 0, newMedicationAllegiesItem);
                            $scope.closeMedicationAllegies();
                            return $scope.data.MedicationAllergiesOther;
                        }
                    }
                }]
            });
        };
        $scope.removeMedicationAllegies = function (index, item) {
            $scope.patinentMedicationAllergies.splice(index, 1);
            var indexPos = $rootScope.MedicationAllegiesList.indexOf(item);
            $rootScope.MedicationAllegiesList[indexPos].checked = false;
            $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
            $rootScope.checkedAllergies--;
            $rootScope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {
                checked: true
            });
        }
        $scope.GoToCurrentMedication = function (MedicationCountValid) {
            $state.go('tab.CurrentMedication');
        }
        // Open Current Medication popup
        $scope.loadCurrentMedication = function () {
            $scope.data.searchProvider = '';
            $scope.clearSelectionAndRebindSelectionList($rootScope.CurrentMedicationItem, $rootScope.CurrentMedicationList);
            if (typeof $rootScope.MedicationCount === 'undefined') {
                $rootScope.checkedMedication = 0;
            } else {
                $rootScope.checkedMedication = $rootScope.MedicationCount;
            }
            $ionicModal.fromTemplateUrl('templates/tab-CurrentMedicationList.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        $scope.closeCurrentMedication = function () {
            $rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {
                checked: true
            });
            if ($rootScope.CurrentMedicationItem !== '') {
                $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
                $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
                $scope.modal.remove();
            }
        };
        // Onchange of Current Medication
        $scope.OnSelectCurrentMedication = function (item) {
            if (item.checked === true) {
                $rootScope.checkedMedication++;
            } else {
                $rootScope.checkedMedication--;
            }
            if (item.text === "Other - (List below)") {
                $scope.openOtherCurrentMedicationView(item);
            } else {
                if ($rootScope.checkedMedication === 4) {
                    $scope.closeCurrentMedication();
                }
            }
        }
        // Open text view for other Current Medication
        $scope.openOtherCurrentMedicationView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<textarea name="comment" id="comment-textarea" ng-model="data.CurrentMedicationOther" class="textAreaPop">',
                title: '<span class="localizejs">Enter Medication</span>',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<span class="localizejs">Cancel</span>',
                    onTap: function (e) {
                        angular.forEach($scope.CurrentMedicationList, function (item) {
                            if (item.checked) {
                                if (item.text === "Other - (List below)") item.checked = false;
                            }
                        });
                        $rootScope.checkedMedication--;
                    }
                }, {
                    text: '<b class="localizejs">Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.CurrentMedicationOther) {
                            e.preventDefault();
                        } else {
                            angular.forEach($scope.CurrentMedicationList, function (item) {
                                if (item.checked) {
                                    if (item.text === "Other - (List below)") {
                                        item.checked = false;
                                    }
                                }
                            });
                            var newCurrentMedicationItem = {
                                text: $scope.data.CurrentMedicationOther,
                                checked: true
                            };
                            $rootScope.CurrentMedicationList.splice(1, 0, newCurrentMedicationItem);
                            if ($rootScope.checkedMedication === 4) {
                                $scope.closeCurrentMedication();
                            }
                            return $scope.data.CurrentMedicationOther;
                        }
                    }
                }]
            });
        };

        $scope.removeCurrentMedication = function (index, item) {
            $scope.patinentCurrentMedication.splice(index, 1);
            var indexPos = $rootScope.CurrentMedicationList.indexOf(item);
            $rootScope.CurrentMedicationList[indexPos].checked = false;
            $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
            $rootScope.checkedMedication--;
            $rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {
                checked: true
            });
        }

        $scope.GoTopriorSurgery = function (PriorSurgeryValid) {
            $state.go('tab.priorSurgeries');
        }
        $scope.getSurgeryPopup = function () {
            //  $scope.modal.remove();
            $rootScope.LastName1 = '';
            $rootScope.datestr = '';
            $scope.showIntakeEditSurgery = false;
            $rootScope.showIntakeNewSurgeryAdd = false;
            $rootScope.selectYearsList = CustomCalendar.getSurgeryYearsList($rootScope.SelectPatientAge);
            $ionicModal.fromTemplateUrl('templates/surgeryPopup.html', {
                scope: $scope,
                reload: true,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                //  $state.reload();
                $scope.modal = modal;
                $scope.surgery.name = '';
                $scope.surgery.dateString = '';
                $scope.surgery.dateStringMonth = '';
                $scope.surgery.dateStringYear = '';
                $rootScope.showIntakeNewSurgeryAdd = false;
                $scope.showIntakeEditSurgery = false;
                $scope.modal.show();
                $timeout(function () {
                    $('option').filter(function () {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                }, 100);
            });
            $rootScope.arrofSurgeryItemIndex = [];
        };
        $rootScope.ValidationFunction1 = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                     isOpenError = 0; // by sakthi multi popup error msg
                });
            }
            refresh_close();
            var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i><span class="loclaizejs" >' + $a + '! </span></div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".ErrorMessage").append(top);
            refresh_close();
        }
        $scope.surgery = {};
        $scope.closeSurgeryPopup = function () {
            $scope.surgery.name;
            $scope.surgery.dateString;
            var selectedSurgeryDate = new Date($scope.surgery.dateStringYear, $scope.surgery.dateStringMonth - 1, 01);
            $scope.surgery.dateString = selectedSurgeryDate;
            var patientBirthDateStr = new Date($rootScope.PatientAge);
            var isSurgeryDateValid = true;
            if (selectedSurgeryDate < patientBirthDateStr) {
                isSurgeryDateValid = false;
            }
            var today = new Date();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var isSurgeryDateIsFuture = true;
            if (+$scope.surgery.dateStringYear === yyyy) {
                if (+$scope.surgery.dateStringMonth > mm) {
                    isSurgeryDateIsFuture = false;
                }
            }
            if ($scope.surgery.name === '' || $scope.surgery.name === undefined) {
                $scope.ErrorMessage = "Provide a short description of the surgical procedure";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (($scope.surgery.dateStringMonth === '' || $scope.surgery.dateStringMonth === undefined || $scope.surgery.dateStringYear === '' || $scope.surgery.dateStringYear === undefined)) {
                $scope.ErrorMessage = "Provide both the month and year of the surgical procedure";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (!isSurgeryDateValid) {
                $scope.ErrorMessage = "Surgery date should not be before your birthdate";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (!isSurgeryDateIsFuture) {
                $scope.ErrorMessage = "Surgery date should not be the future Date";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else {
                SurgeryStocksListService.addSurgery($scope.surgery.name, $scope.surgery.dateString);
                $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
                $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
                $rootScope.showIntakeNewSurgeryAdd = false;
                $scope.showIntakeEditSurgery = false;
                $(".surgeryDisplay-" + $scope.editItemIndex).css("display", "block");
                $(".surgeryEdit-" + $scope.editItemIndex).css("display", "none");
                if ($rootScope.patientSurgeriess.length === 3)
                    $scope.modal.remove();
            }
        }
        $scope.RemoveSurgeryPopup = function () {
            $scope.data.searchProvider = '';
            $scope.modal.remove();
        };
        $scope.removePriorSurgeries = function (index, item) {
            $rootScope.patientSurgeriess.splice(index, 1);
            var indexPos = $rootScope.patientSurgeriess.indexOf(item);
            $rootScope.IsToPriorCount--;
        }
        $scope.removeSurgeryItem = function (index, item) {
            var iIndex = $rootScope.patientSurgeriess.indexOf(item);
            $rootScope.patientSurgeriess.splice(iIndex, 1);
            //var indexPos = $rootScope.patientSurgeriess.indexOf(item);
            $rootScope.IsToPriorCount--;
            $rootScope.showIntakeNewSurgeryAdd = false;
            $scope.showIntakeEditSurgery = false;
            if ($rootScope.patientSurgeriess.length === 3)
                $scope.modal.remove();
            //$rootScope.arrofSurgeryItemIndex = [];
            //$rootScope.arrofSurgeryItemIndex.splice($rootScope.arrofSurgeryItemIndex.indexOf(index),1);
            //console.log($rootScope.patientSurgeriess);

        };

        $scope.openEditSurgeryItem = function (index1, surgery) {
            // if($scope.showIntakeEditSurgery !== true && $rootScope.showIntakeNewSurgeryAdd !== true) {
            // $rootScope.showIntakeNewSurgeryAdd = false;
            // $scope.showIntakeEditSurgery = true;
            // $scope.editItemIndex = index;
            // $(".surgeryDisplay-" + index).css("display", "none");
            // $(".surgeryEdit-" + index).css("display", "block");
            // $scope.editSurgeryArray = surgery;
            // }

            // $rootScope.arrofSurgeryItemIndex.push({ indexRow: index })
            var index = $rootScope.patientSurgeriess.indexOf(surgery);
            $rootScope.patientSurgeriess
            $rootScope.showIntakeNewSurgeryAdd = false;
            $scope.showIntakeEditSurgery = true;
            $scope.editItemIndex = index;

            angular.forEach($rootScope.patientSurgeriess, function (value, key) {
                if (index == $rootScope.patientSurgeriess.indexOf(value)) {
                    $(".surgeryDisplay-" + key).css("display", "none");
                    $(".surgeryEdit-" + key).css("display", "block");
                    // $scope.month.text = $('#surDateStringMonth_' +key).val();
                    // $scope.month.text = $('#dateStringYear_' +key).val();
                } else {
                    $(".surgeryDisplay-" + key).css("display", "block");
                    $(".surgeryEdit-" + key).css("display", "none");

                    $(".surgeryDisplay-" + key).css("display", "block");
                    $(".surgeryEdit-" + key).css("display", "none");
                }

                // $scope.surgery.name = $('#surDescription_' +0).val();
                // $scope.month.text = $('#surDateStringMonth_' + 0).val();
                // $scope.month.text = $('#dateStringYear_' + 0).val();

            });

            // if(index == 0) {
            // $(".surgeryDisplay-"+0).css("display", "none");
            // $(".surgeryEdit-"+0).css("display", "block");

            // $(".surgeryDisplay-"+1).css("display", "block");
            // $(".surgeryEdit-"+1).css("display", "none");

            // $(".surgeryDisplay-"+2).css("display", "block");
            // $(".surgeryEdit-"+2).css("display", "none");

            // // $scope.surgery.name = $('#surDescription_' +0).val();
            // // $scope.month.text = $('#surDateStringMonth_' + 0).val();
            // // $scope.month.text = $('#dateStringYear_' + 0).val();

            // }
            // if(index == 1) {
            // $(".surgeryDisplay-"+1).css("display", "none");
            // $(".surgeryEdit-"+1).css("display", "block");

            // $(".surgeryDisplay-"+0).css("display", "block");
            // $(".surgeryEdit-"+0).css("display", "none");

            // $(".surgeryDisplay-"+2).css("display", "block");
            // $(".surgeryEdit-"+2).css("display", "none");


            // }
            // if(index == 2) {
            // $(".surgeryDisplay-"+2).css("display", "none");
            // $(".surgeryEdit-"+2).css("display", "block");

            // $(".surgeryDisplay-"+0).css("display", "block");
            // $(".surgeryEdit-"+0).css("display", "none");

            // $(".surgeryDisplay-"+1).css("display", "block");
            // $(".surgeryEdit-"+1).css("display", "none");

            // }

            $rootScope.arrofSurgeryItemIndex.push({ indexRow: index })

            $scope.editSurgeryArray = surgery;

            //  $scope.Editsurgery.surDescription = description;
        }
        $scope.showNewSurgeryAddScreen = function () {
            $scope.surgery = {};
            $timeout(function () {
                $('select option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);

            $rootScope.showIntakeNewSurgeryAdd = true;
            $scope.showIntakeEditSurgery = false;
        };

        //$scope.surgery = {};
        $scope.EditIntakeSurgeryItem = function () {
            //   $timeout(function() {

            var arrofSurgeryItem = [];
            var hidePopup = true;
            angular.forEach($rootScope.arrofSurgeryItemIndex, function (value, key) {

                if (($('#surDescription_' + value.indexRow).val() != '' || $('#surDescription_' + value.indexRow).val() === undefined) && $scope.showIntakeEditSurgery === true) {

                    if (($scope.dateStringMonths != '' || $scope.dateStringMonths != undefined || $scope.dateStringYears != '' || $scope.dateStringYears != undefined)) {

                        $scope.dateStringMonths = $('#surDateStringMonth_' + value.indexRow).val();
                        $scope.dateStringYears = $('#dateStringYear_' + value.indexRow).val();
                        var selectedSurgeryDate = new Date($scope.dateStringYears, $scope.dateStringMonths - 1, 01);
                        $scope.dateString = selectedSurgeryDate;
                        var patientBirthDateStr = new Date($rootScope.PatientAge);
                        var isSurgeryDateValid = true;
                        if (selectedSurgeryDate < patientBirthDateStr) {
                            isSurgeryDateValid = false;
                        }
                        var today = new Date();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var isSurgeryDateIsFuture = true;
                        if (+$scope.dateStringYear === yyyy) {
                            if (+$scope.dateStringMonth > mm) {
                                isSurgeryDateIsFuture = false;
                            }
                        }

                        if (isSurgeryDateValid && $scope.showIntakeEditSurgery === true) {

                            if (isSurgeryDateIsFuture && $scope.showIntakeEditSurgery === true) {

                                arrofSurgeryItem.push({
                                    Description: $('#surDescription_' + value.indexRow).val(),
                                    MonthString: $('#surDateStringMonth_' + value.indexRow).val(),
                                    YearString: $('#dateStringYear_' + value.indexRow).val(),
                                    IndexRow: value.indexRow,
                                });

                            } else {
                                $scope.ErrorMessage = "Surgery date should not be the future Date";
                                $rootScope.ValidationFunction1($scope.ErrorMessage);
                                hidePopup = false;
                            }
                        } else {
                            $scope.ErrorMessage = "Surgery date should not be before your birthdate";
                            $rootScope.ValidationFunction1($scope.ErrorMessage);
                            hidePopup = false;
                        }
                    } else {
                        $scope.ErrorMessage = "Provide both the month and year of the surgical procedure";
                        $rootScope.ValidationFunction1($scope.ErrorMessage);
                        hidePopup = false;
                    }
                } else {
                    $scope.ErrorMessage = "Provide a short description of the surgical procedure";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                    hidePopup = false;
                }
            });

            if (hidePopup) {
                angular.forEach(arrofSurgeryItem, function (value, key) {
                    $scope.surDescription = value.Description;
                    $scope.dateStringMonth = value.MonthString;
                    $scope.dateStringYear = value.YearString;

                    var selectedSurgeryDate = new Date($scope.dateStringYear, $scope.dateStringMonth - 1, 01);
                    $scope.dateString = selectedSurgeryDate;
                    var patientBirthDateStr = new Date($rootScope.PatientAge);
                    var isSurgeryDateValid = true;
                    if (selectedSurgeryDate < patientBirthDateStr) {
                        isSurgeryDateValid = false;
                    }
                    var today = new Date();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    var isSurgeryDateIsFuture = true;
                    if (+$scope.dateStringYear === yyyy) {
                        if (+$scope.dateStringMonth > mm) {
                            isSurgeryDateIsFuture = false;
                        }
                    }
                    $scope.newEditSurgery = {
                        //'$$hashKey': $scope.editSurgeryArray.$$hashKey,
                        'Name': $scope.surDescription,
                        'Date': $scope.dateString
                    };
                    SurgeryStocksListService.SurgeriesList[value.IndexRow] = $scope.newEditSurgery;
                    $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
                    $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
                    $rootScope.showIntakeNewSurgeryAdd = false;
                    $scope.showIntakeEditSurgery = false;
                    $(".surgeryDisplay-" + value.IndexRow).css("display", "block");
                    $(".surgeryEdit-" + value.IndexRow).css("display", "none");
                    //if (hidePopup)
                    $scope.modal.remove();

                });
            }


        }

        $scope.backtoSurgeryView = function (index, description) {
            $rootScope.showIntakeNewSurgeryAdd = false;
            //  $scope.surgeryDisplayTrue = true;
        }

        $scope.doGetPatientHealthPlansList = function () {

            var params = {
                patientId: $rootScope.patientId,
                primaryPatientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data != 0) {
                        $rootScope.patientHealthPlanList = [];
                        $rootScope.allPatientHealthPlanList = [];
                        angular.forEach(data.data, function (index, item) {
                            $rootScope.allPatientHealthPlanList.push({
                                'id': index.$id,
                                'healthPlanId': index.healthPlanId,
                                'familyGroupId': index.familyGroupId,
                                'patientId': index.patientId,
                                'insuranceCompany': index.insuranceCompany,
                                'isDefaultPlan': index.isDefaultPlan,
                                'insuranceCompanyPhone': index.insuranceCompanyPhone,
                                'memberName': index.memberName,
                                'members': index.members,
                                'subsciberId': index.subsciberId,
                                'payerId': index.payerId,
                                'policyNumberLong': index.policyNumber,
                                'policyNumber': index.policyNumber.substring(index.policyNumber.length - 4, index.policyNumber.length),
                            });
                        });
                        $rootScope.patientHealthPlanList  = $rootScope.allPatientHealthPlanList;
                      //  $rootScope.patientHealthPlanList = $rootScope.allPatientHealthPlanList.filter(function (r) { var show = r.patientId == $rootScope.patientId; return show; });
                        if ($rootScope.patientHealthPlanList.length !== 0) {
                            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                                $rootScope.enableAddHealthPlan = "block";
                                $rootScope.disableAddHealthPlan = "none;";
                                if($rootScope.chooseHealthShow == 'initial')
                                    $rootScope.editplan = "block";
                                else
                                    $rootScope.editplan = "none";

                            } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                                $rootScope.disableAddHealthPlan = "none";
                                $rootScope.enableAddHealthPlan = "block";
                                $state.go('tab.consultCharge');
                            }
                        } else {
                            if ($rootScope.currState.$current.name === "tab.consultCharge") {
                                $rootScope.enableAddHealthPlan = "none";
                                $rootScope.disableAddHealthPlan = "block;";
                            } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                                $state.go('tab.consultCharge');
                            }
                        }
                    } else {
                        if ($rootScope.currState.$current.name === "tab.consultCharge") {
                            $rootScope.enableAddHealthPlan = "none";
                            $rootScope.disableAddHealthPlan = "block;";
                        } else if ($rootScope.currState.$current.name === "tab.planDetails") {
                            $state.go('tab.consultCharge');
                        }
                    }

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getPatientHealthPlansList(params);

        }

        $scope.ConsultationSaveData = {
            "medicationAllergies": [],
            "surgeries": [],
            "medicalConditions": [],
            "medications": [],
            "infantData": [],
            "concerns": []
        };
        $rootScope.doPutConsultationSave = function () {
            if ($rootScope.userAgeForIntake == 8 && typeof $rootScope.scheduledConsultSave != 'undefined') {
                $scope.ConsultationSaveData.infantData = $rootScope.scheduledConsultSave.infantData;
            }
            for (var i = 0; i < $rootScope.AllegiesCount; i++) {
                $scope.medFilter = $filter('filter')($scope.ConsultationSaveData.medicationAllergies, {
                    code: $rootScope.patinentMedicationAllergies[i].codeId
                });
                if ($scope.medFilter.length === 0) {
                    $scope.ConsultationSaveData.medicationAllergies.push({
                        code: $rootScope.patinentMedicationAllergies[i].codeId,
                        description: $rootScope.patinentMedicationAllergies[i].text
                    });
                }
            }
            for (var i = 0; i < $rootScope.IsToPriorCount; i++) {
                date1 = new Date($rootScope.patientSurgeriess[i].Date);
                year = date1.getFullYear();
                month = (date1.getMonth()) + 1;
                $scope.surgeryFilter = $filter('filter')($scope.ConsultationSaveData.surgeries, {
                    description: $rootScope.patientSurgeriess[i].Name
                });
                if ($scope.surgeryFilter.length == 0) {
                    $scope.ConsultationSaveData.surgeries.push({
                        description: $rootScope.patientSurgeriess[i].Name,
                        month: month,
                        year: year
                    });
                }
            }
            for (var i = 0; i < $rootScope.ChronicCount; i++) {
                $scope.chronicFilter = $filter('filter')($scope.ConsultationSaveData.medicalConditions, {
                    code: $rootScope.PatientChronicCondition[i].codeId
                });
                if ($scope.chronicFilter.length === 0) {
                    $scope.ConsultationSaveData.medicalConditions.push({
                        code: $rootScope.PatientChronicCondition[i].codeId,
                        description: $rootScope.PatientChronicCondition[i].text
                    });
                }
            }
            for (var i = 0; i < $rootScope.MedicationCount; i++) {
                $scope.medicationFilter = $filter('filter')($scope.ConsultationSaveData.medications, {
                    code: $rootScope.patinentCurrentMedication[i].codeId
                });
                if ($scope.medicationFilter.length === 0) {
                    $scope.ConsultationSaveData.medications.push({
                        code: $rootScope.patinentCurrentMedication[i].codeId,
                        description: $rootScope.patinentCurrentMedication[i].text
                    });
                }
            }
            if (typeof $rootScope.PrimaryConcernText !== 'undefined') {
                $scope.primaryFilter = $filter('filter')($scope.ConsultationSaveData.concerns, {
                    description: $rootScope.PrimaryConcernText
                });
                if ($scope.primaryFilter.length === 0) {
                    $scope.ConsultationSaveData.concerns.push({
                        isPrimary: true,
                        description: $rootScope.PrimaryConcernText,
                        customCode: {
                            code: $rootScope.codeId,
                            description: $rootScope.PrimaryConcernText
                        }
                    });
                }
            }
            if (typeof $rootScope.SecondaryConcernText !== 'undefined') {
                $scope.sceondFilter = $filter('filter')($scope.ConsultationSaveData.concerns, {
                    description: $rootScope.SecondaryConcernText
                });
                if ($scope.sceondFilter.length == 0) {
                    $scope.ConsultationSaveData.concerns.push({
                        isPrimary: false,
                        description: $rootScope.SecondaryConcernText,
                        customCode: {
                            code: $rootScope.SecondarycodeId,
                            description: $rootScope.SecondaryConcernText
                        }
                    });
                }
            } //$rootScope.isPaidOnDemand

            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                ConsultationSaveData: $scope.ConsultationSaveData,
                success: function (data) {
                    $scope.cardPaymentId = [];
                //    if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.isPaidOnDemand !== true) {
                if (!angular.isUndefined($rootScope.getIndividualPatientCreditCount) && $rootScope.getIndividualPatientCreditCount !== 0 && $rootScope.paymentMode === 'on' &&  $rootScope.isPaidOnDemand !== true) {
                        $scope.doPostOndemandDepitDetails();
                    } else {
                        $scope.ConsultationSave = "success";
                      //  if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on') {
                       if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode === 'on' && $rootScope.consultationAmount !== 0) {
                            $rootScope.applyPlanMode = "block";
                            $rootScope.verifyPlanMode = "none";
                            $rootScope.consultChargeNoPlanPage = "none";
                            $rootScope.healthPlanPage = "block";
                          //  $rootScope.chooseHealthHide = 'initial';
                          //  $rootScope.chooseHealthShow = 'none';
                            $rootScope.chooseHealthHide = 'none';
                            $rootScope.chooseHealthShow = 'initial';
                          //  $rootScope.providerName = "";
                          //  $rootScope.PolicyNo = "";
                            if ($rootScope.getIndividualPatientCreditCount === 0 && $rootScope.getIndividualPatientCreditCount !== '') {
                                if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                    $('#addNewCard').val('Choose Your Card');
                                    $('#addNewCard_addCard').val('Choose Your Card');
                                    $('#addNewCard_submitPay').val('Choose Your Card');
                                    $rootScope.userDefaultPaymentProfileText = null;
                                    $rootScope.editCardStyle = "none";
                                } else {
                                    $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                    $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                    $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                                    $rootScope.editCardStyle = "block";
                                }

                                $rootScope.doGetPatientPaymentProfiles();
                            }
                            $scope.doGetPatientHealthPlansList();
                            $state.go('tab.consultCharge');
                      //  } else if ($rootScope.insuranceMode === 'on' && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                       } else if ($rootScope.insuranceMode === 'on' && ($rootScope.paymentMode === 'on' || $rootScope.paymentMode !== 'on')) {
                            $rootScope.openAddHealthPlanSection();
                            $state.go('tab.consultCharge');
                      //  } else if ($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined') {
                       } else if ($rootScope.paymentMode === 'on'  && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined') {
                            if ($rootScope.isPaidOnDemand !== true && ($rootScope.getIndividualPatientCreditCount === 0 || angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                                if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                    $('#addNewCard').val('Choose Your Card');
                                    $('#addNewCard_addCard').val('Choose Your Card');
                                    $('#addNewCard_submitPay').val('Choose Your Card');
                                    $rootScope.userDefaultPaymentProfileText = null;
                                } else {
                                    $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                    $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                    $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                    $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                                }
                                $rootScope.paymentBackPage = true;
                                $rootScope.doGetPatientPaymentProfiles();
                                $rootScope.healthPlanPage = "none";
                                $rootScope.consultChargeNoPlanPage = "block";
                                $state.go('tab.consultCharge');
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enableCreditVerification = "none";
                                $rootScope.enableWaivefeeVerification = "none";
                            } else if ($rootScope.isPaidOnDemand === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                                $rootScope.enableInsuranceVerificationSuccess = "none";
                                $rootScope.enablePaymentSuccess = "none";
                                if ($rootScope.appointmentwaivefee === true) {
                                    $rootScope.enableCreditVerification = "none";
                                    $rootScope.enableWaivefeeVerification = "block";
                                } else {
                                    $rootScope.enableWaivefeeVerification = "none";
                                    $rootScope.enableCreditVerification = "block";
                                }
                                $state.go('tab.receipt');
                                $rootScope.ReceiptTimeout();
                            }
                      //  } else if ($rootScope.consultationAmount === 0 || ($rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on')) {
                      } else if ($rootScope.consultationAmount === 0 || ($rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on')) {
                            $rootScope.enablePaymentSuccess = "none";
                            $rootScope.enableCreditVerification = "none"
                            $rootScope.enableWaivefeeVerification = "none";;
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.putConsultationSave(params);
        }

        $scope.$on("callDoPutConsultationSave", function (event, args) {
            $rootScope.doPutConsultationSave();
        });

        $scope.doPostOndemandDepitDetails = function () {
            var params = {
                patientId: $rootScope.patientId,
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                  //  if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on') {
                  if ($rootScope.insuranceMode === 'on' && $rootScope.paymentMode === 'on' && $rootScope.consultationAmount !== 0) {
                        $rootScope.applyPlanMode = "block";
                        $rootScope.verifyPlanMode = "none";
                        $rootScope.consultChargeNoPlanPage = "none";
                        $rootScope.healthPlanPage = "block";
                        $rootScope.chooseHealthHide = 'initial';
                        $rootScope.chooseHealthShow = 'none';
                        $rootScope.providerName = "";
                        $rootScope.PolicyNo = "";
                        if ($rootScope.getIndividualPatientCreditCount === 0 && $rootScope.getIndividualPatientCreditCount !== '') {
                            if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                $('#addNewCard').val('Choose Your Card');
                                $('#addNewCard_addCard').val('Choose Your Card');
                                $('#addNewCard_submitPay').val('Choose Your Card');
                                $rootScope.userDefaultPaymentProfileText = null;
                                $rootScope.editCardStyle = "none";
                            } else {
                                $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                                $rootScope.editCardStyle = "block";
                            }
                            $rootScope.doGetPatientPaymentProfiles();

                        }

                        $scope.doGetPatientHealthPlansList();
                        $state.go('tab.consultCharge');
                  //  } else if ($rootScope.insuranceMode === 'on' && (($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom === 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on'))) {
                    } else if ($rootScope.insuranceMode === 'on' && ($rootScope.paymentMode === 'on'  || $rootScope.paymentMode !== 'on' )) {
                        $rootScope.openAddHealthPlanSection();
                        $state.go('tab.consultCharge');
                  //  } else if ($rootScope.paymentMode === 'on' && $rootScope.HidePaymentPageBeforeWaitingRoom !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined') {
                   } else if ($rootScope.paymentMode === 'on' &&  $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on' && $rootScope.consultationAmount !== 0 && typeof $rootScope.consultationAmount !== 'undefined') {
                        if ($rootScope.isPaidOnDemand !== true && ($rootScope.getIndividualPatientCreditCount === 0 || angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                            if (typeof $rootScope.userDefaultPaymentProfile === "undefined" || $rootScope.userDefaultPaymentProfile === null) {
                                $('#addNewCard').val('Choose Your Card');
                                $('#addNewCard_addCard').val('Choose Your Card');
                                $('#addNewCard_submitPay').val('Choose Your Card');
                                $rootScope.userDefaultPaymentProfileText = null;
                            } else {
                                $('#addNewCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
                                $('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
                                $rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
                                $scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
                            }
                            $rootScope.paymentBackPage = true;
                            $rootScope.doGetPatientPaymentProfiles();
                            $rootScope.healthPlanPage = "none";
                            $rootScope.consultChargeNoPlanPage = "block";
                            $state.go('tab.consultCharge');
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $rootScope.enableCreditVerification = "none";
                            $rootScope.enableWaivefeeVerification = "none";
                        } else if ($rootScope.isPaidOnDemand === true || ($rootScope.getIndividualPatientCreditCount !== 0 && !angular.isUndefined($rootScope.getIndividualPatientCreditCount))) {
                            $rootScope.enableInsuranceVerificationSuccess = "none";
                            $rootScope.enablePaymentSuccess = "none";
                            if ($rootScope.appointmentwaivefee === true) {
                                $rootScope.enableCreditVerification = "none";
                                $rootScope.enableWaivefeeVerification = "block";
                            } else {
                                $rootScope.enableWaivefeeVerification = "none";
                                $rootScope.enableCreditVerification = "block";
                            }
                            $state.go('tab.receipt');
                            $rootScope.ReceiptTimeout();
                        }
                  //  } else if ($rootScope.consultationAmount === 0 || ($rootScope.HidePaymentPageBeforeWaitingRoom === 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on')) {
                    } else if ($rootScope.consultationAmount === 0 || ($rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on') || ($rootScope.paymentMode !== 'on' && $rootScope.insuranceMode !== 'on' && $rootScope.InsuranceBeforeWaiting !== 'on')) {
                        $rootScope.enablePaymentSuccess = "none";
                        $rootScope.enableCreditVerification = "none"
                        $rootScope.enableWaivefeeVerification = "none";;
                        $rootScope.enableInsuranceVerificationSuccess = "none";
                        $state.go('tab.receipt');
                        $rootScope.ReceiptTimeout();
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.postDepitDetails(params);
        }


        $scope.ReceiptTimeout = function () {
            var currentTimeReceipt = new Date();
            currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
            $rootScope.ReceiptTime = currentTimeReceipt.getTime();
            $.getScript("lib/jquery.signalR-2.1.2.js", function (data, textStatus, jqxhr) {

            });

            setTimeout(function () {
                $state.go('tab.waitingRoom');
            }, 10000);
        }
        $scope.clearRootScopeConce = function () {
            navigator.notification.confirm(
                /*'Are you sure that you want to cancel this consultation?',*/
                $rootScope.alertCancelMessageConsultation,
                function (index) {
                    if (index == 1) {

                    } else if (index == 2) {
                        $rootScope.PatientPrimaryConcernItem;
                        $rootScope.PatientPrimaryConcern = "";
                        $rootScope.primaryConcernList = "";
                        $rootScope.secondaryConcernList = "";
                        $scope.PatientPrimaryConcernItem = "";
                        $rootScope.primaryconcern = false;
                        $rootScope.secondaryconcern = false;
                        $rootScope.PatientSecondaryConcern = "";
                        $rootScope.PatientChronicCondition = "";
                        $rootScope.patinentCurrentMedication = "";
                        $rootScope.patinentMedicationAllergies = "";
                        $rootScope.patientSurgeriess = "";
                        $rootScope.MedicationCount == 'undefined';
                        $rootScope.checkedChronic = 0;
                        $rootScope.ChronicCount = "";
                        $rootScope.AllegiesCount = "";
                        $rootScope.checkedAllergies = 0;
                        $rootScope.MedicationCount = "";
                        $rootScope.checkedMedication = 0;
                        $rootScope.IsValue = "";
                        $rootScope.secondaryConcernValueExist = "";
                        $rootScope.IsToPriorCount = "";
                        $rootScope.ChronicCountValidCount = "";
                        $rootScope.PriorSurgeryValidCount = "";
                        $rootScope.AllegiesCountValid = "";
                        $rootScope.MedicationCountValid = "";
                        SurgeryStocksListService.ClearSurgery();
                        $state.go('tab.userhome');
                    }
                },
                $rootScope.NaviConfirmation, ['No', $rootScope.YESMessageProviderSearch]
            );

        };
        //Side Menu
        var checkAndChangeMenuIcon;
        $interval.cancel(checkAndChangeMenuIcon);
        $rootScope.checkAndChangeMenuIcon = function () {
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
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle" && $state.current.name !== "tab.waitingRoom" && $state.current.name !== "tab.videoConference" && $state.current.name !== "tab.connectionLost") {
                checkAndChangeMenuIcon = $interval(function () {
                    $rootScope.checkAndChangeMenuIcon();
                }, 300);
            }
        };

        $("#localize-widget").hide();
        $scope.goTOSchedule = function () {
          $("#localize-widget").show();
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }

        $(".overlay").css({ "display": "none" });
    })

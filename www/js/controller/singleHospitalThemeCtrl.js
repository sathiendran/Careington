angular.module('starter.controllers')

.controller('singleHospitalThemeCtrl', function($scope, ageFilter, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $ionicLoading) {

    $ionicLoading.show({
        template: '<img src="img/puff.svg" alt="Loading" />'
    });
    $rootScope.customerSso = '';

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

    $rootScope.patientConsultEndUrl = "";

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
                    if (deploymentEnvLogout === 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    } else {
                        $rootScope.alertMsgName = $rootScope.Hospital;
                        $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                    }
                    $rootScope.patientConsultEndUrl = data.data[0].patientConsultEndUrl;
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

                    brandColor = $rootScope.brandColor;
                    logo = $rootScope.logo;
                    HospitalTag = $rootScope.HospitalTag;
                    Hospital = $rootScope.Hospital;
                    if (!angular.isUndefined(data.data[0].customerSso) && data.data[0].customerSso === "Mandatory") {
                        $rootScope.customerSso = "Mandatory";
                        ssoURL = data.data[0].patientLogin;
                    }
                    if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                        $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                    } else {
                        $rootScope.isSSORegisterAvailable = '';
                    }
                    $ionicLoading.hide();
                    $state.go('tab.loginSingle');
                }else{
            					var confirmPopup = $ionicPopup.confirm({

            						  templateUrl: 'templates/updationpopup.html',
            						  cssClass: 'updatepopup',
            						  hardwareBackButtonClose: false,
            					});
                }
            },
            error: function(data,status) {
              if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                $ionicLoading.hide();
              }

            }
        };
        LoginService.getHospitalInfo(params);
    }
    $scope.doGetSingleUserHospitalInformation();
})

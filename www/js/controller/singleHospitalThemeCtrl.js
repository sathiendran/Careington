angular.module('starter.controllers')

.controller('singleHospitalThemeCtrl', function($scope, ageFilter, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $ionicLoading) {

    $ionicLoading.show({
        template: '<img src="img/puff.svg" alt="Loading" />'
    });
    $rootScope.customerSso = '';

    if (deploymentEnvLogout == 'Single') {
        if (deploymentEnvForProduction == 'Production') {

            $rootScope.hospitalId = singleHospitalId;
            apiCommonURL = 'https://connectedcare.md';
            api_keys_env = 'Production';
            $rootScope.APICommonURL = 'https://connectedcare.md';

        } else if (deploymentEnvForProduction == 'Staging') {
            $rootScope.hospitalId = singleStagingHospitalId;
            api_keys_env = "Staging";
        } else if (deploymentEnvForProduction == 'QA') {
            $rootScope.hospitalId = singleQAHospitalId;
            api_keys_env = "QA";
        } else if (deploymentEnvForProduction == 'Sandbox') {
            $rootScope.hospitalId = singleSandboxHospitalId;
            api_keys_env = "Sandbox";
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
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                if ($rootScope.getDetails !== '') {
                    for (var i = 0; i < $rootScope.getDetails.length; i++) {

                        if ($rootScope.getDetails[i] == 'InsuranceVerification' || $rootScope.getDetails[i] == 'mInsVerification') {
                            $rootScope.insuranceMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'OrganizationLocation' || $rootScope.getDetails[i] == 'mOrganizationLocation') {
                            $rootScope.OrganizationLocation = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsBloodTypeRequired') {
                            $rootScope.PPIsBloodTypeRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsHairColorRequired') {
                            $rootScope.PPIsHairColorRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEthnicityRequired') {
                            $rootScope.PPIsEthnicityRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] == 'PPIsEyeColorRequired') {
                            $rootScope.PPIsEyeColorRequired = 'on';
                        }
                    }
                }
                $rootScope.brandColor = data.data[0].brandColor;
                $rootScope.logo = data.data[0].hospitalImage;
                $rootScope.Hospital = data.data[0].brandName;
                if (deploymentEnvLogout == 'Multiple') {
                    $rootScope.alertMsgName = 'Virtual Care';
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase(); //'Virtual Care';
                } else {
                    $rootScope.alertMsgName = $rootScope.Hospital;
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                }
                $rootScope.patientConsultEndUrl = data.data[0].patientConsultEndUrl;
                $rootScope.HospitalTag = data.data[0].brandTitle;
                $rootScope.contactNumber = data.data[0].contactNumber;
                $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                $rootScope.clientName = data.data[0].hospitalName;
                brandColor = $rootScope.brandColor;
                logo = $rootScope.logo;
                HospitalTag = $rootScope.HospitalTag;
                Hospital = $rootScope.Hospital;
                if (!angular.isUndefined(data.data[0].customerSso)) {
                    if (data.data[0].customerSso === "Mandatory") {
                        $rootScope.customerSso = "Mandatory";
                        ssoURL = data.data[0].patientLogin;

                    }
                }
                $ionicLoading.hide();
                $state.go('tab.loginSingle');
            },
            error: function(data) {
                $ionicLoading.hide();

            }
        };
        LoginService.getHospitalInfo(params);
    }
    $scope.doGetSingleUserHospitalInformation();
})

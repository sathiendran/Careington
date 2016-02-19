angular.module('starter.controllers', ['starter.services','ngLoadingSpinner', 'timer','ngStorage', 'ion-google-place', 'ngIOS9UIWebViewPatch'])

.controller('singleHospitalThemeCtrl', function($scope, ageFilter, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $localstorage) {
	$rootScope.hospitalId = singleHospitalId;
	if(deploymentEnvLogout == 'Single' && deploymentEnvForProduction =='Production') {
			apiCommonURL = 'https://connectedcare.md';
			api_keys_env = '';
			$rootScope.APICommonURL = 'https://connectedcare.md';
	}
	
	
    $scope.doGetSingleUserHospitalInformation = function () {
			$rootScope.paymentMode = '';
			$rootScope.insuranceMode = '';
			$rootScope.onDemandMode = '';
			var params = {
				hospitalId: $rootScope.hospitalId,
				success: function (data) {	
					$rootScope.getDetails = data.data[0].enabledModules;
					if($rootScope.getDetails != '') {
						for (var i = 0; i < $rootScope.getDetails.length; i++) {
							if ($rootScope.getDetails[i] == 'InsuranceVerification' || $rootScope.getDetails[i] == 'mInsVerification') {
								$rootScope.insuranceMode = 'on';									
							}
							if ($rootScope.getDetails[i] == 'ECommerce' || $rootScope.getDetails[i] == 'mECommerce') {
								$rootScope.paymentMode = 'on';
							}
							if ($rootScope.getDetails[i] == 'OnDemand' || $rootScope.getDetails[i] == 'mOnDemand') {
								$rootScope.onDemandMode = 'on';
							}
						}
					}
                    $rootScope.brandColor = data.data[0].brandColor;
                    $rootScope.logo = apiCommonURL + data.data[0].hospitalImage;
                    $rootScope.Hospital = data.data[0].brandName; 
                    if(deploymentEnvLogout == 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase =  'Virtual Care';
                    } else {
                         $rootScope.alertMsgName = $rootScope.Hospital;
                         $rootScope.reportHospitalUpperCase =  $rootScope.Hospital.toUpperCase();
                    } 
					$rootScope.HospitalTag = data.data[0].brandTitle;
					$rootScope.contactNumber = data.data[0].contactNumber;
					$rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
					$rootScope.clientName = data.data[0].hospitalName;
					
                     $state.go('tab.loginSingle'); 
					
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			LoginService.getHospitalInfo(params);		
    }
    $scope.doGetSingleUserHospitalInformation();  
})

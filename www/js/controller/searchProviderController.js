
angular.module('starter.controllers')
.controller('searchProviderController', function($scope, ageFilter, get2CharInString, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
	  $ionicPlatform.registerBackButtonAction(function (event, $state) {	 
        if ( ($rootScope.currState.$current.name=="tab.userhome") ||
			  ($rootScope.currState.$current.name=="tab.addCard") ||	
			  ($rootScope.currState.$current.name=="tab.submitPayment") ||
			  ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") || 	
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			  ($rootScope.currState.$current.name=="tab.connectionLost") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){ 
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            }else if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
			}else if($rootScope.currState.$current.name=="tab.loginSingle"){
                navigator.app.exitApp();
            }else if($rootScope.currState.$current.name=="tab.cardDetails"){
				var gSearchLength = $('.ion-google-place-container').length;
				if(($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block')	{
					$ionicBackdrop.release();					
					$(".ion-google-place-container").css({"display": "none"});						 
					
				}else{		
					$(".ion-google-place-container").css({"display": "none"});
					navigator.app.backHistory(); 
				}
												
			}else {                
                navigator.app.backHistory(); 
            }
        }, 100); 
	
	$scope.data = {};
	$scope.$watch('data.searchProvider', function(searchKey){
		 $rootScope.providerSearchKey = searchKey;	
			if(typeof $rootScope.providerSearchKey =='undefined') {
				$scope.data.searchProvider = $rootScope.backProviderSearchKey;				
			}
			if($rootScope.providerSearchKey != '' && typeof $rootScope.providerSearchKey != 'undefined') {
				$rootScope.iconDisplay = 'none';
			} else {
				$rootScope.iconDisplay = 'Block';
			}
			if($rootScope.providerSearchKey != '' && typeof $rootScope.providerSearchKey != 'undefined' && $rootScope.providerSearchKey.length >= 3){           
				$scope.doGetSearchProviderList($rootScope.providerSearchKey);				
			} else {				
				$('#providerListDiv').hide();
				$('#emptyProvider').hide();
				$('#startSearchProvider').show();			
			}		
    });
	
	$scope.doGetSearchProviderList = function(providerSearchKey) {		
		 var params = {
			accessToken: $rootScope.accessToken,
			providerSearchKey: providerSearchKey,
			success: function (data) {
				$rootScope.searchProviderList = [];	
				if(data.data != '') {					
					$('#startSearchProvider').hide();
					$('#emptyProvider').hide();
					$('#providerListDiv').show();
					angular.forEach(data.data, function(index, item) {		
						$rootScope.searchProviderList.push({
							'id': index.$id,
							'customerSso': index.customerSso,
							'hospitalId': index.hospitalId,
							'hospitalName': index.hospitalName,
							'firstCharactOfHosName' : get2CharInString.getProv2Char(index.hospitalName),
							'brandColor' : index.brandColor,
							'brandName' : index.brandName,
							'brandTitle' : index.brandTitle,
							'hospitalImage' : $rootScope.APICommonURL + index.hospitalImage
						});
					});						
					
				} else {
					$('#providerListDiv').hide();
					$('#startSearchProvider').hide();
					$('#emptyProvider').show();
				}
			},
			error: function (data) {
				$scope.$root.$broadcast("callServerErrorMessageValidation");				
			}
		};
		
		LoginService.getSearchProviderList(params);
	}
	
	
	$scope.goToRegisterStep1 = function(providerList) {
		$rootScope.selectedSearchProviderList = providerList;
		$rootScope.hospitalId = providerList.hospitalId
		$scope.doGetSingleUserHospitalInformation();
		
	}
	
		$scope.doGetSingleUserHospitalInformation = function () {			
			var params = {
				hospitalId: $rootScope.hospitalId,
				success: function (data) {					
                    $rootScope.brandColor = data.data[0].brandColor;
                    $rootScope.logo = apiCommonURL + data.data[0].hospitalImage;
                    $rootScope.Hopital = data.data[0].brandName; 
                    if(deploymentEnvLogout == 'Multiple') {
                        $rootScope.alertMsgName = 'Virtual Care';
                        $rootScope.reportHospitalUpperCase =  'Virtual Care';
                    } else {
                         $rootScope.alertMsgName = $rootScope.Hopital;
                         $rootScope.reportHospitalUpperCase =  $rootScope.Hopital.toUpperCase();
                    } 
					$rootScope.HopitalTag = data.data[0].brandTitle;
					$rootScope.contactNumber = data.data[0].contactNumber;
					$rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
					$rootScope.clientName = data.data[0].hospitalName;
					
                    $state.go('tab.registerStep1');
					
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			LoginService.getHospitalInfo(params);		
		}
	
	
	
		
})



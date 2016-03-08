
angular.module('starter.controllers')
.controller('registerStep1Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $localstorage) {
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
		
		$scope.regStep1 = {};
		$rootScope.postRegisterStep1 = function() {			
			if(typeof $scope.regStep1.FName == 'undefined' || $scope.regStep1.FName == '') {
				$scope.ErrorMessage = "Please enter your First Name";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if(typeof $scope.regStep1.LName == 'undefined' || $scope.regStep1.LName == '') {
				$scope.ErrorMessage = "Please enter your Last Name";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			}else if(typeof $scope.regStep1.address == 'undefined' || $scope.regStep1.address == '') {
				$scope.ErrorMessage = "Please enter your Full Address";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else {
				step1PostRegDetailsService.addPostRegDetails($scope.regStep1);					
				$state.go('tab.registerStep2');		
				$rootScope.step1RegDetails = step1PostRegDetailsService.getPostRegDetails();				
			}
		}
		
		$scope.registerStpe1BackToSearchProvider = function() {
			if($rootScope.providerSearchKey !='' && typeof $rootScope.providerSearchKey !='undefined') {
				$rootScope.backProviderSearchKey = $rootScope.providerSearchKey;
			}
			$state.go('tab.searchprovider');
		}				
		
})




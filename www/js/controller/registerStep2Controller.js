
angular.module('starter.controllers')
.controller('registerStep2Controller', function($scope, ageFilter, $timeout, step1PostRegDetailsService, $ionicPlatform, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $localstorage) {
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
		
		$scope.regStep2 = {};
		$scope.postRegisterStep2 = function() {
			$scope.ValidateEmail = function(email){
				var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return expr.test(email);
			};
			var pwdRegularExpress = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^.{8,20}$/;	
					
			if(typeof $scope.regStep2.emailID == 'undefined' || $scope.regStep2.emailID == '') {
				$scope.ErrorMessage = "Please enter your Email Address";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if (!$scope.ValidateEmail($scope.regStep2.emailID)) {
				$scope.ErrorMessage = "Please enter a valid Email Address";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if(typeof $scope.regStep2.password == 'undefined' || $scope.regStep2.password == '') {
				$scope.ErrorMessage = "Please enter your Password";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if(!pwdRegularExpress.test($scope.regStep2.password)) { 
				$scope.ErrorMessage = "Your Password must be between 8 and 20 characters. It must contain at least one upper and lower case letter and at least one number";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if (/\s/.test($scope.regStep2.password)) {
				$scope.ErrorMessage = "Password must not contain white spaces";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			}else if(typeof $scope.regStep2.confirmPwd == 'undefined' || $scope.regStep2.confirmPwd == '') {
				$scope.ErrorMessage = "Please enter your Confirm Password";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if($scope.regStep2.password != $scope.regStep2.confirmPwd) {
				$scope.ErrorMessage = "Password mismatch";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else if(typeof $scope.regStep2.dob == 'undefined' || $scope.regStep2.dob == '' || $scope.regStep2.dob == null) {
				$scope.ErrorMessage = "Please select your Birthdate";
				$scope.$root.$broadcast("callValidation", {errorMsg: $scope.ErrorMessage });
			} else {
				$scope.doPostUserRegisterDetails();
			}
			
		}
		
		$scope.doPostUserRegisterDetails = function() {	
			$scope.userFirstandLastName={											
											"$id": "2",
											"first": $rootScope.step1RegDetails[0].FName,
											"last": $rootScope.step1RegDetails[0].LName											
										}
				 var params = {
					address: $rootScope.step1RegDetails[0].address,
					dob: $scope.regStep2.dob,
					email: $scope.regStep2.emailID,
					name: $scope.userFirstandLastName,
					password: $scope.regStep2.password,
					providerId: $rootScope.hospitalId,
					success: function (data) {					
						console.log(data);	
						$state.go('tab.registerSuccess');	
					},
					error: function (data) {
						if(data.message == 'Email address already registered.') {
							navigator.notification.alert(
								'Email address already registered. Please use different Email ID',  // message
								function(){ },
								 $rootScope.alertMsgName,            // title
								'Done'                  // buttonName
							);
							return false;
						} else {
							$scope.$root.$broadcast("callServerErrorMessageValidation");
						}
					}
				};
				
			LoginService.postRegisterDetails(params);
		}
		
		
})




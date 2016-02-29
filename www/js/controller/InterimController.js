angular.module('starter.controllers', ['starter.services','ngLoadingSpinner', 'timer','ngStorage', 'ion-google-place', 'ngIOS9UIWebViewPatch'])

//InterimController - To manipulate URL Schemes
.controller('InterimController', function($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	
	$rootScope.deploymentEnv = deploymentEnv;
     if(deploymentEnv != 'Multiple') {
         $rootScope.APICommonURL = apiCommonURL;
     }
	
	/*if(deploymentEnv == "Sandbox"){
		$rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
		apiCommonURL = 'https://sandbox.connectedcare.md';		
	}else if(deploymentEnv == "Production"){
		$rootScope.APICommonURL = 'https://connectedcare.md';
		apiCommonURL = 'https://connectedcare.md';
	}else if(deploymentEnv == "QA"){
		$rootScope.APICommonURL = 'https://snap-qa.com';
		apiCommonURL = 'https://snap-qa.com';
	}else if(deploymentEnv == "Single"){
		//$rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
		//apiCommonURL = 'https://sandbox.connectedcare.md';
	//	$rootScope.APICommonURL = 'https://snap-qa.com';
	//	apiCommonURL = 'https://snap-qa.com';
	//	$rootScope.APICommonURL = 'https://connectedcare.md';
	//	apiCommonURL = 'https://connectedcare.md';
    $rootScope.APICommonURL = 'https://snap-stage.com';
		apiCommonURL = ' https://snap-stage.com';    
    
	} else if(deploymentEnv == "Staging") {
		$rootScope.APICommonURL = 'https://snap-stage.com';
		apiCommonURL = ' https://snap-stage.com';
		api_keys_env = "Staging";
	}*/
    
	$localstorage.set('ChkVideoConferencePage', ""); 
	
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
	
	$scope.ssoMessage = 'Authenticating..... Please wait!';
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
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
							//if ($rootScope.getDetails[i] == 'PaymentPageBeforeWaitingRoom') {
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
					
                    // $state.go('tab.loginSingle'); 
					
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			LoginService.getHospitalInfo(params);		
    }
    
	
	$scope.doGetScheduledConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
             $rootScope.scheduledConsultationList = [];
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
					console.log(data);
                    $scope.scheduledConsultationList = data.data;
					if(data != "") {
						$rootScope.scheduledList = [];
						var currentDate = new Date();
						currentDate = $scope.addMinutes(currentDate, -30);
					//	var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");
							
												
						angular.forEach($scope.scheduledConsultationList, function(index, item) {							
							if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
								 $rootScope.scheduledList.push({							
									'id': index.$id,
									'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
									'consultantUserId': index.consultantUserId,
									'consultationId': index.consultationId,
									'patientFirstName': htmlEscapeValue.getHtmlEscapeValue(index.patientFirstName),
									'patientLastName': htmlEscapeValue.getHtmlEscapeValue(index.patientLastName),
									'patientId': index.patientId,
									'assignedDoctorName': htmlEscapeValue.getHtmlEscapeValue(index.assignedDoctorName), 
									'patientName': htmlEscapeValue.getHtmlEscapeValue(index.patientName),
									'consultationStatus': index.consultationStatus,
									'scheduledId': index.scheduledId,    
								});
							}	
						});
						
						
						$rootScope.nextAppointmentDisplay = 'none';
						
						var d = new Date();
						d.setHours(d.getHours() + 12);
						var currentUserHomeDate = CustomCalendar.getLocalTime(d);
						
						if($rootScope.scheduledList != '')
						{
							//var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
							//var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
							var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
							var currentUserHomeDate = currentUserHomeDate;
							
							if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
								console.log('scheduledTime <= getTwelveHours UserHome');
								$rootScope.nextAppointmentDisplay = 'block';
								$rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
								var beforAppointmentTime = 	getReplaceTime;
								var doGetAppointmentTime =  $scope.addMinutes(beforAppointmentTime, -30);
								if((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime()))
								{
									$rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
								}
							}
						}
						 
					}
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getScheduledConsulatation(params);
        };
	$scope.doGetPrimaryPatientLastName = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
				success: function (data) {
					//$scope.RelatedPatientProfiles = data.data;
					$rootScope.primaryPatientLastName = [];	
						angular.forEach(data.data, function(index, item) {		
							$rootScope.primaryPatientLastName.push({
								'id': index.$id,
								'patientName': index.patientName,
								'lastName': index.lastName,
								'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
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
					$rootScope.primaryPatientLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.primaryPatientLastName[0].lastName); 	
					
					$rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' '+$rootScope.primaryPatientLastName;					
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPrimaryPatientLastName(params);
		};
	$scope.doGetPatientProfiles = function() {
		if ($rootScope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
			var params = {
			accessToken: $rootScope.accessToken,
			success: function (data) {
				
				$rootScope.patientInfomation = data.data[0];
				$rootScope.patientAccount = data.data[0].account;	
				$rootScope.patientAddresses = data.data[0].addresses;	
				$rootScope.patientAnatomy = data.data[0].anatomy;
				$rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
				$rootScope.patientPhysicianDetails = data.data[0].physicianDetails;	
				//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
				$rootScope.PatientImage = ($rootScope.APICommonURL + $rootScope.patientAccount.profileImagePath).replace(new RegExp("\\../","gm"),"/");
				$rootScope.address = data.data[0].address;
				$rootScope.city = data.data[0].city;
				$rootScope.createDate = data.data[0].createDate;
				$rootScope.dob = data.data[0].dob;
				$rootScope.ageBirthDate = ageFilter.getDateFilter(data.data[0].dob);
				$rootScope.gender = data.data[0].gender;
				$rootScope.homePhone = data.data[0].homePhone;
				
				if(typeof data.data[0].location != 'undefined') {
					$rootScope.location = data.data[0].location;
				} else {
					$rootScope.location = '';
				}
				$rootScope.mobilePhone = data.data[0].mobilePhone;
				
				if(typeof data.data[0].organization != 'undefined') {
					$rootScope.organization = data.data[0].organization;
				} else {
					$rootScope.organization = '';
				}
				$rootScope.primaryPatientName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);
				$rootScope.userCountry = data.data[0].country;
				if(typeof $rootScope.userCountry == 'undefined') {
					$rootScope.userCountry = '';
				}
				$rootScope.primaryPatientGuardianName = '';
				$rootScope.state = data.data[0].state;
				$rootScope.zipCode = data.data[0].zipCode;
				$rootScope.primaryPatientId = $rootScope.patientAccount.patientId;	
				$scope.doGetPrimaryPatientLastName();	
				$scope.doGetScheduledConsulatation();
					
			},
			error: function (data) {
				$scope.ssoMessage = 'Authentication Failed! Please try again later!';
				$rootScope.patientInfomation = '';
				$rootScope.patientAccount = '';	
				$rootScope.patientAddresses = '';	
				$rootScope.patientAnatomy = '';
				$rootScope.patientPharmacyDetails = ''
				$rootScope.patientPhysicianDetails = '';	
				//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
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
		};
		
		LoginService.getPatientProfiles(params);
	};
	$scope.doGetRelatedPatientProfiles = function(redirectPage) {		
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
			var params = {
			patientId: $rootScope.patientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				//$scope.RelatedPatientProfiles = data.data;
				$rootScope.RelatedPatientProfiles = [];	
				
					angular.forEach(data.data, function(index, item) {		
						$rootScope.RelatedPatientProfiles.push({
							'id': index.$id,
							'patientId': index.patientId,
							'patientName': index.patientName,
							'profileImagePath': ($rootScope.APICommonURL + index.profileImagePath).replace(new RegExp("\\../","gm"),"/"),
							'relationCode': index.relationCode,
							'isAuthorized': index.isAuthorized,
							'birthdate': index.birthdate,
							'ageBirthDate': ageFilter.getDateFilter(index.birthdate),
							'addresses': angular.fromJson(index.addresses),
							'patientFirstName': htmlEscapeValue.getHtmlEscapeValue(index.patientFirstName),
							'patientLastName': htmlEscapeValue.getHtmlEscapeValue(index.patientLastName),
							'guardianFirstName': htmlEscapeValue.getHtmlEscapeValue(index.guardianFirstName),
							'guardianLastName': htmlEscapeValue.getHtmlEscapeValue(index.guardianLastName),
							'guardianName': htmlEscapeValue.getHtmlEscapeValue(index.guardianName),
						});
					});	
					
					$rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
					if(redirectPage == 'userhome'){
						$state.go('tab.userhome');
					}else{
						//$state.go('tab.waitingRoom');
						$scope.doGetExistingConsulatation();
					}
					
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getRelatedPatientProfiles(params);
	};
	
	$scope.doGetExistingConsulatation = function () {
		$rootScope.consultionInformation = '';
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
						if($rootScope.consultationStatusId == 71 ) {
							navigator.notification.alert(
								'Your consultation is already started on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								$rootScope.alertMsgName,            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 72 ) {
							navigator.notification.alert(
								'Your consultation is already ended.',  // message
								function(){ $state.go('tab.userhome'); return;},
								$rootScope.alertMsgName,            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 79 ) {
							navigator.notification.alert(
								'Your consultation is cancelled.',  // message
								function(){ $state.go('tab.userhome'); return;},
								 $rootScope.alertMsgName,            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 80 ) {
							navigator.notification.alert(
								'Your consultation is in progress on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								 $rootScope.alertMsgName,            // title
								'Done'                  // buttonName
							);
							return false;
						}
						
				}
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
				$rootScope.intakeForm = data.data[0].intakeForm;
				$rootScope.PatientAge = $rootScope.patientExistInfomation.dob;
				$rootScope.PatientGuardian = $rootScope.patientExistInfomation.guardianName;
				$rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
				$rootScope.PatientImageSelectUser = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
				$scope.doGetExistingPatientName();
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
	}
	
	$scope.doGetExistingPatientName = function () {
		var params = {
			patientId: $rootScope.appointmentsPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {	
				$rootScope.PatientFirstName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);				
				$rootScope.PatientLastName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].lastName); 	
				$state.go('tab.waitingRoom');
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getPrimaryPatientLastName(params);
	}
	
	if($stateParams.token != "" && $stateParams.hospitalId != "" && $stateParams.consultationId != ""){
		$rootScope.accessToken = $stateParams.token;
		$rootScope.hospitalId = $stateParams.hospitalId;
		$rootScope.consultationId = $stateParams.consultationId;
		$scope.doGetSingleUserHospitalInformation();
		$scope.doGetPatientProfiles();
		//$scope.doGetExistingConsulatation();	
		$scope.doGetRelatedPatientProfiles('waitingRoom');
		//$state.go('tab.waitingRoom');
	}else if($stateParams.token != "" && $stateParams.hospitalId != "" && $stateParams.consultationId == ""){
		$rootScope.accessToken = $stateParams.token;
		$rootScope.hospitalId = $stateParams.hospitalId;
		//$rootScope.accessToken = "RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ";
		//localStorage.setItem("external_load", null);
		$scope.doGetSingleUserHospitalInformation();
		$scope.doGetPatientProfiles();	
		$scope.doGetRelatedPatientProfiles('userhome');
	}else{
		if(deploymentEnvLogout == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnvLogout == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
	$scope.showAlert = function(){
	
	};
})       

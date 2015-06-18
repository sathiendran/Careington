var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
	  if (i in this && this[i] === item) return i;
	}
	return -1;
}

var util = {
    setHeaders: function (request, credentials) {
        if (typeof credentials != 'undefined') {
            request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
        }
        request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
        request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
        return request;
    },
    getHeaders: function (accessToken) {
        var headers = {
                'X-Developer-Id': '4ce98e9fda3f405eba526d0291a852f0',
                'X-Api-Key': '1de605089c18aa8318c9f18177facd7d93ceafa5',
                'Content-Type': 'application/json; charset=utf-8'
            };
        if (typeof accessToken != 'undefined') {
            headers['Authorization'] = 'Bearer ' + accessToken;
        }
        
        return headers;
    }
}

var REVIEW_CONSULTATION_EVENT_CODE = 116;
var STARTED_CONSULTATION_EVENT_CODE = 117;
var STOPPED_CONSULTATION_EVENT_CODE = 118;
var ENDED_CONSULTATION_EVENT_CODE = 119;
var WAITING_CONSULTATION_EVENT_CODE = 120;
var JOIN_CONSULTATION_EVENT_CODE = 121;

var CLINICIAN_CONSULTATION_EVENT_TYPE_ID = 22;
var PATIENT_CONSULTATION_EVENT_TYPE_ID = 23;

var REVIEW_CONSULTATION_STATUS_CODE = 69;
var STARTED_CONSULTATION_STATUS_CODE = 70;
var STOPPED_CONSULTATION_STATUS_CODE = 118;
var ENDED_CONSULTATION_STATUS_CODE = 119;
var WAITING_CONSULTATION_STATUS_CODE = 68;
var JOIN_CONSULTATION_STATUS_CODE = 121;


angular.module('starter.controllers', ['starter.services','ngLoadingSpinner', 'timer','ngStorage', 'ion-google-place'])


.controller('LoginCtrl', function($scope, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout,SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
    
	$rootScope.currState = $state;
    
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
    
	$ionicPlatform.registerBackButtonAction(function (event, $state) {	
        if ( ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") || 	
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){ 
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            }else if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
            }else { 
                // For all other states, the H/W BACK button is enabled
                navigator.app.backHistory(); 
            }
        }, 100); 
		
		

/*	var dtNow = new Date("2015-05-26T13:20:04.268Z");	*/

    $scope.$storage = $localStorage;
   
    
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();

	};

    //$rootScope.StateList = StateLists.getStateDetails();
	$scope.currentYear = new Date().getFullYear()
      $scope.currentMonth = new Date().getMonth() + 1
      $scope.months = $locale.DATETIME_FORMATS.MONTH
      $scope.ccinfo = {type:undefined}
      $scope.save = function(data){
        if ($scope.paymentForm.$valid){
			console.log('valid data saving stuff here');
          console.log(data) // valid data saving stuff here
        }
      }
	
	$rootScope.Validation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$("#Error_Message").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}
	
	$rootScope.serverErrorMessageValidation = function(){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Server Error! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Server_Error").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}	
	
	
	$scope.validation = function() {
		$scope.ErrorMessage = "Oops, something went wrong";
		$rootScope.Validation($scope.ErrorMessage);
		
	};
	

    $('#UserEmail').val($localstorage.get('username'));
    
	$scope.userLogin = {};
    $scope.userLogin.UserEmail = $localStorage.oldEmail;
    $scope.LoginFunction = function(item,event){
		if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Please enter your email";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			 $scope.ValidateEmail = function(email){
				var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				return expr.test(email);
			};
			
			if (!$scope.ValidateEmail($("#UserEmail").val())) {
				$scope.ErrorMessage = "Please enter a valid email address";
				$rootScope.Validation($scope.ErrorMessage);
			}
			else {	
				if($scope.userLogin.remember) {
                    $localstorage.set('username', $("#UserEmail").val());
                    $localStorage.oldEmail = $scope.userLogin.UserEmail;  
                    $rootScope.UserEmail = $scope.userLogin.UserEmail;

                } else { 
                   $rootScope.UserEmail = $scope.userLogin.UserEmail;
                   $localStorage.oldEmail = '';
                   $localstorage.set('username', ""); 
                }                
				$scope.doGetFacilitiesList();
			}
		}
		
    };
	
	$rootScope.APICommonURL = 'https://snap-dev.com';
	
	$scope.doGetFacilitiesList = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
            emailAddress: $rootScope.UserEmail, 
			accessToken: $rootScope.accessToken,			
            success: function (data) {
				//console.log(data);
                $rootScope.PostPaymentDetails = data.data;
				if($rootScope.PostPaymentDetails == "")	 {
					$scope.ErrorMessage = "No account associated with this email.  Please try again";
					$rootScope.Validation($scope.ErrorMessage);
				} else {				
					$rootScope.hospitalDetailsList = [];
					angular.forEach($rootScope.PostPaymentDetails, function(index, item) {	
						$rootScope.hospitalDetailsList.push({							
							'id': index.$id,
							'domainName': index.domainName,
							'logo': $rootScope.APICommonURL + index.logo,
							'name': index.name,
							'operatingHours': index.operatingHours,
							'providerId': index.providerId,	
							'brandColor': index.brandColor,
							'contactNumber':index.contactNumber,
							'appointmentsContactNumber': index.appointmentsContactNumber,
						});
					});
					
					$rootScope.contactNumber = $rootScope.hospitalDetailsList[0].contactNumber;
					$rootScope.appointmentsContactNumber = $rootScope.hospitalDetailsList[0].appointmentsContactNumber;
					
					if(typeof $rootScope.contactNumber != 'undefined') {
						$rootScope.contactNumber = $rootScope.contactNumber;
					} else if(typeof $rootScope.contactNumber == 'undefined') {
						if(typeof $rootScope.appointmentsContactNumber != 'undefined') {
							$rootScope.contactNumber = $rootScope.appointmentsContactNumber;
						} else if(typeof $rootScope.appointmentsContactNumber == 'undefined') {
							$rootScope.contactNumber = '';
						}
					}
					
					$rootScope.CountryLists = CountryList.getCountryDetails();	
                    $state.go('tab.provider');
				}
				
				//console.log($rootScope.hospitalDetailsList);		
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
		
		LoginService.getFacilitiesList(params);
	}
	
	
	
	$scope.ProviderFunction = function(hospitalDetailsDatas) {
        $rootScope.hospitalId = hospitalDetailsDatas.providerId;
        $rootScope.Hopital = hospitalDetailsDatas.name;
        $rootScope.logo = hospitalDetailsDatas.logo;
        $rootScope.operatingHours = hospitalDetailsDatas.operatingHours;
        $rootScope.id = hospitalDetailsDatas.id;
        $rootScope.brandColor = hospitalDetailsDatas.brandColor;       		
		$state.go('tab.password');
	}
	
	//Password functionality	
	$scope.pass = {};
	
	$scope.doGetToken = function () {
	
		if($('#password').val() == ''){
			$scope.ErrorMessage = "Please enter your password";
			$rootScope.Validation($scope.ErrorMessage);
		} else {
			console.log($scope.password);
			var params = {
				email: $rootScope.UserEmail, 
				password: $scope.pass.password,
				userTypeId: 1,
				hospitalId: $rootScope.hospitalId,
				success: function (data) {
					$rootScope.accessToken = data.access_token;
					console.log($scope.accessToken);
					if(typeof data.access_token == 'undefined') {
						$scope.ErrorMessage = "Incorrect Password. Please try again";
						$rootScope.Validation($scope.ErrorMessage);
					} else {
						$scope.tokenStatus = 'alert-success';
					//	$scope.doGetExistingConsulatation();
						$scope.doGetPatientProfiles();	
						$scope.doGetRelatedPatientProfiles();
                        //$rootScope.CountryLists = CountryList.getCountryDetails();							
					}
				},
				error: function (data) {
					$scope.ErrorMessage = "Incorrect Password. Please try again";
					$rootScope.Validation($scope.ErrorMessage);
				}
			};
			
			LoginService.getToken(params);
		}
    }
	$scope.emailType = 'resetpassword';
	
	$scope.doPostSendPasswordResetEmail = function() {
			if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			 var params = {
                patientEmail: $rootScope.UserEmail,
				emailType: $scope.emailType,
                accessToken: $rootScope.accessToken,
                success: function (data) {
				console.log('dopostsentpass');
					console.log(data);
                    $scope.PasswordResetEmail = data;
					$state.go('tab.resetPassword');	
                },
                error: function (data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
			
			LoginService.postSendPasswordResetEmail(params);
		}	
	

	//$rootScope.patientId = 471;
	//$rootScope.patientId = 3056;
	//$rootScope.consultationId = 2440;
	//$scope.userId = 471;
	//$scope.userId = 3056;
	//$scope.BillingAddress = '123 chennai';
	//$scope.CardNumber = 4111111111111111;
	//$scope.City = 'chennai';
	//$scope.ExpiryMonth = 8;
	//$scope.ExpiryYear = 2019;
	//$scope.FirstName = 'Rin';
	//$scope.LastName = 'Soft';
	//$scope.State = 'Tamilnadu';
	//$scope.Zip = 91302;
	//$scope.Country = 'US';	
	//$scope.Cvv = 123;
	//$scope.profileId = 31867222;
	$scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns';
	
	
	
    $rootScope.searchPatientList = {};
    $scope.searched = false;
    $rootScope.age = 25;
    
    $scope.$watch('data.searchQuery', function(searchKey){
        if(searchKey != '' && typeof searchKey != 'undefined'){
            $rootScope.patientSearchKey = searchKey;
            var loggedInPatient = {
                'patientFirstName': $rootScope.patientName,
                'lastName': $rootScope.patientName,
                'age': $rootScope.age,
                'guardianName': $rootScope.patientName,
                'profileImagePath': $rootScope.PatientImage
            };
            if(!$scope.searched){
                //$rootScope.dependentDetails.push(loggedInPatient);
                $rootScope.RelatedPatientProfiles.splice(0, 0, loggedInPatient);
            }
            $scope.searched = true;
        }else{
            if($scope.searched){
                $rootScope.RelatedPatientProfiles.shift();
                $scope.searched = false;
            }
        }
    });  
	
	$scope.doGetPatientProfiles = function() {
			if ($scope.accessToken == 'No Token') {
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
					
					$rootScope.PatientImage = $rootScope.APICommonURL + $rootScope.patientAccount.profileImagePath;
					$rootScope.address = data.data[0].address;
					$rootScope.city = data.data[0].city;
					$rootScope.createDate = data.data[0].createDate;
					$rootScope.dob = data.data[0].dob;
					$rootScope.gender = data.data[0].gender;
					$rootScope.homePhone = data.data[0].homePhone;
					$rootScope.location = data.data[0].location;
					$rootScope.mobilePhone = data.data[0].mobilePhone;
					$rootScope.organization = data.data[0].organization;
					$rootScope.primaryPatientName = data.data[0].patientName;
					$rootScope.primaryPatientGuardianName = '';
					$rootScope.state = data.data[0].state;
					$rootScope.zipCode = data.data[0].zipCode;
					$rootScope.primaryPatientId = $rootScope.patientAccount.patientId;	
					$scope.doGetPrimaryPatientLastName();	
					 $scope.doGetScheduledConsulatation();
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPatientProfiles(params);
		}
		
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
					$rootScope.primaryPatientLastName = $rootScope.primaryPatientLastName[0].lastName;	
						 
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPrimaryPatientLastName(params);
		}	
	
	
	$scope.doGetRelatedPatientProfiles = function() {
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
								'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
								'relationCode': index.relationCode,
								'isAuthorized': index.isAuthorized,
								'birthdate': index.birthdate,
								'addresses': angular.fromJson(index.addresses),
								'patientFirstName': index.patientFirstName,
								'patientLastName': index.patientLastName,
								'guardianFirstName': index.guardianFirstName,
								'guardianLastName': index.guardianLastName,
								'guardianName': index.guardianName,
							});
						});	
						
						 $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
						 $state.go('tab.userhome');	
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getRelatedPatientProfiles(params);
		}
    
    
    
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
                $rootScope.patientInfomation = data.data[0].patientInformation;	
                $rootScope.PatientImage = $rootScope.APICommonURL + $rootScope.patientInfomation.profileImagePath;
                $rootScope.inTakeForm = data.data[0].intakeForm;
				$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctorId;
				$rootScope.appointmentsPatientFirstName = $rootScope.inTakeForm.patientFirstName;
				$rootScope.appointmentsPatientLastName = $rootScope.inTakeForm.patientLastName;
				$rootScope.appointmentsPatientDOB = $rootScope.inTakeForm.dateOfBirth;
				$rootScope.appointmentsPatientGurdianName = $rootScope.inTakeForm.gardianName;
				$rootScope.appointmentsPatientId = $rootScope.inTakeForm.patientId;
				$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.patientInfomation.profileImagePath;
				$scope.doGetDoctorDetails();
               
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
	}
	
	$scope.doGetDoctorDetails = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            doctorId: $rootScope.assignedDoctorId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
				$rootScope.doctorImage = $rootScope.APICommonURL + data.data[0].profileImagePath;	
				$state.go('tab.appoimentDetails');
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getDoctorDetails(params);	
		
	}
	
	$scope.GetHealthPlanList = function () {
		$scope.doGetPatientHealthPlansList()
	}
	
	
	$scope.doGetPatientHealthPlansList = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
			patientId: $rootScope.patientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				//$scope.patientHealthPlanList = data;
				
				if(data.data != '') {
						$rootScope.patientHealthPlanList = [];	
						angular.forEach(data.data, function(index, item) {	
							$rootScope.patientHealthPlanList.push({
								'id': index.$id,
								'healthPlanId': index.healthPlanId,
								'familyGroupId': index.familyGroupId,
								'patientId': index.patientId,
								'insuranceCompany': index.insuranceCompany,
								'isDefaultPlan': index.isDefaultPlan,
								'insuranceCompanyPhone': index.insuranceCompanyPhone,
								'memberName': index.memberName,
								'subsciberId': index.subsciberId,
								'payerId': index.payerId,
								'policyNumber': index.policyNumber.substring(index.policyNumber.length-4, index.policyNumber.length),
							});
						});							
					
						
						if($rootScope.currState.$current.name=="tab.consultCharge")
						{
							$rootScope.enableAddHealthPlan = "block";
							$rootScope.disableAddHealthPlan = "none;";					
							$state.go('tab.addHealthPlan');
						} else if ($rootScope.currState.$current.name=="tab.planDetails") {
							$rootScope.ApplyPlanPatientHealthPlanList =  $rootScope.patientHealthPlanList;
							//$rootScope.SelectedHealthPlan = $rootScope.ApplyPlanPatientHealthPlanList[data.data.length - 1];
                            $rootScope.HealthPlanListCount = $rootScope.ApplyPlanPatientHealthPlanList[data.data.length];
                            console.log($rootScope.HealthPlanListCount);
                          /*  if($rootScope.primaryPatientId == $rootScope.patientId) {
                            $rootScope.ApplyPlanPatientHealthPlanList.push({
								'insuranceCompany': 'Add a new health plan'
							});
                            }  */
							$state.go('tab.applyPlan');						
							
						}
					} else {
						if($rootScope.currState.$current.name=="tab.consultCharge")
						{
							$rootScope.enableAddHealthPlan = "none";
							$rootScope.disableAddHealthPlan = "block;";
							$state.go('tab.addHealthPlan');
						} else if ($rootScope.currState.$current.name=="tab.planDetails") {
							$state.go('tab.applyPlan');
						}
					}	
				
				
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};

		LoginService.getPatientHealthPlansList(params);
        
	}
	
    /* country and State */
    
        $rootScope.StateText = "Select your state";

         //Start Open Country List popup
        $scope.loadCountriesList = function() {

               $ionicModal.fromTemplateUrl('templates/tab-CountryList.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    focusFirstInput: false
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                }); 
            //$rootScope.CountryLists = CountryList.getCountryDetails();
        };
    
        // Onchange of Contries
        $scope.OnSelectContryData = function(CountriesList, items) {
             angular.forEach(CountriesList, function(item, index) {
                 if (item.Name == items.Name){
                     item.checked = true;
                     $rootScope.SelectedCountry={							
                        'CountryName': items.Name,
                        'CountryCode': items.CountryCodes.iso2,
                     };
                 }
                 else {
                     item.checked = false; 
                 }
             });
        };

        $scope.closeCountryList = function() {
            $rootScope.SelectedCountry;
            $scope.modal.hide(); 
            //$scope.data.searchCountry = '';    
        };
       //End Countries 
   
        //Start Open State List popup
        $scope.loadStateList = function(CountryCode) {
         $ionicModal.fromTemplateUrl('templates/tab-StateList.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    focusFirstInput: false
          }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
             }); 
        $rootScope.CountryCode = CountryCode;
        };
        $scope.stateList = '';
    
    
    
    
    $scope.StateSelect = function($a) {
        if($a.length >= 3){
            
            $timeout(function(){
                var params = { SearchKeys: $a, CountryCode: $rootScope.CountryCode};
                //$rootScope.stateList = StateList.getStateDetails(params);
                var config = { 'params': { 'callback': 'JSON_CALLBACK'} };
                
                var googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?callback=angular.callbacks._&input=' + $a + '&types=(cities)&language=en&components=country:'+$rootScope.CountryCode+'&key=AIzaSyCjq4bTUhjvIxSFJBA6Ekk3DPdA_VrU9Zs';
               
                var googlePlacesResponsePromise = $http.jsonp(googlePlacesUrl,{ 'params': { 'callback': 'JSON_CALLBACK'} });
                
                googlePlacesResponsePromise.success(function(data, status, headers, config) {
                    $rootScope.stateList = JSON.stringify(data);
                });
                
                googlePlacesResponsePromise.error(function(data, status, headers, config) {
                    alert("AJAX failed");
                });
                
            }, 1000);
            
            console.log($rootScope.stateList);
        }else{
            $rootScope.stateList = {};
        }
    };
  
   $scope.closeStateList = function() {
     $rootScope.stateList;
     $rootScope.stateList;
     $scope.modal.hide(); 
    };
   //End State 
    
    
    $scope.CountryChange = function () {
        if($('#country').val() == 'US') {
            $rootScope.StateList = {};
            $rootScope.StateList = StateLists.getStateDetails();
            $rootScope.StateText = "Select your state";
        }else if($('#country').val() == 'UK') {
            $rootScope.StateList = {};
             $rootScope.StateList = UKStateList.getUkStateDetails();
            $rootScope.StateText = "Select your County";
        } else { 
            $rootScope.StateText = "Select your state";
            $rootScope.StateList = StateLists.getStateDetails(); 
        }
        $timeout(function(){
            $('select option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
        
     }
    /* country and State */
    
	 $("#addHealthPlan").change(function() {
        //console.log( $('option:selected', this).text() );
		if(($('option:selected', this).text() == 'Add a new health p...') || ($('option:selected', this).text() == 'Add a new health plan')) {
            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            $scope.doGetHealthPlanProvider();
		}
    });
	
	$scope.doGetHealthPlanProvider = function() {
		$rootScope.HealthPlanProvidersList = [];
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
				console.log('addHealthPlan');
					console.log(data);
                    $scope.HealthPlanProvidersList = data.data;
                    if(data != "")
                    $rootScope.ProviderList = [];
                    angular.forEach($scope.HealthPlanProvidersList, function(index, item) {	
						  $rootScope.ProviderList.push({							
							'id': index.$id,
							'id': index.id,
							'payerId': index.payerId,
							'payerName': index.payerName,
							    
						});
					});	
                    $state.go('tab.planDetails');
                },
                error: function (data) {
					$rootScope.serverErrorMessageValidation();
                }
            };
        LoginService.getHealthPlanProvidersList(params);
	}
	

    
    $scope.AddHealth = {};
    $scope.doPostNewHealthPlan = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
        
        var HealthPlanProviders =  $scope.AddHealth.Provider.split("@");
        $scope.insuranceCompany = HealthPlanProviders[0];
        $scope.insuranceCompanyNameId = HealthPlanProviders[1];
        $scope.payerId = HealthPlanProviders[2];
        $scope.ProviderId = HealthPlanProviders[3];
        $scope.healthPlanID = $scope.ProviderId;
        console.log($scope.healthPlanID);
       //End 
		$rootScope.providerName = HealthPlanProviders[0];
        $rootScope.PolicyNo = $scope.AddHealth.policyNumber;
       
        if(typeof $rootScope.patientHealthPlanList != 'undefined') { 
                var subsciberNewID = $rootScope.patientHealthPlanList.length + 1;
            } else {
                var subsciberNewID = 1;
            }
        
        $scope.insuranceCompany = $scope.insuranceCompany;
		$scope.insuranceCompanyNameId = $scope.insuranceCompanyNameId;
		$scope.isDefaultPlan =  'Y';
		$scope.insuranceCompanyPhone = '8888888888';
		$scope.memberName = $scope.AddHealth.firstName + $scope.AddHealth.lastName;
		$scope.subsciberId = subsciberNewID // patient id
		$scope.policyNumber = $scope.AddHealth.policyNumber; //P20
		$scope.subscriberFirstName = $scope.AddHealth.firstName;
		$scope.subscriberLastName =  $scope.AddHealth.lastName;
		$scope.subscriberDob = $scope.AddHealth.dateBirth;
		$scope.isActive = 'A';
		$scope.payerId = $scope.payerId; 
        
			 var params = {
                accessToken: $rootScope.accessToken,
                PatientId: $rootScope.patientId,
				insuranceCompany: $scope.insuranceCompany,
				insuranceCompanyNameId: $scope.insuranceCompanyNameId,
				isDefaultPlan: $scope.isDefaultPlan,
				insuranceCompanyPhone: $scope.insuranceCompanyPhone,
				memberName: $scope.memberName,
				subsciberId: $scope.subsciberId,
				policyNumber: $scope.policyNumber,
				subscriberFirstName: $scope.subscriberFirstName,
				subscriberLastName: $scope.subscriberLastName,
				subscriberDob: $scope.subscriberDob,
				isActive: $scope.isActive,
				payerId: $scope.payerId,
				success: function (data) {
					$scope.NewHealthPlan = data;
					if($scope.NewHealthPlan.healthPlanID != '')	{	
			            $rootScope.HealthPlanIdGet = data.healthPlanID;
						$scope.doGetPatientHealthPlansList();						
					} else {					
						$scope.ErrorMessage = data.message;
						$rootScope.Validation($scope.ErrorMessage);
						$state.go('tab.planDetails');
					}
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postNewHealthPlan(params);
		}
	
	
	
	
	 $("#addNewCard").change(function() {
        console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new card') {
			$state.go('tab.cardDetails');
		}
    });
		
    $scope.GetConsultChargeNoPlan = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {		
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
		$state.go('tab.consultChargeNoPlan');
	}
	
	$scope.doGetPatientPaymentProfilesCardDetails = function () {
		if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}			
			var params = {
				hospitalId: $rootScope.hospitalId, 
				patientId: $rootScope.patientId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					if(data != '') {						

						$rootScope.PaymentProfile = [];	
						$rootScope.patientprofileID = data.data.profileID;
						
						$rootScope.PaymentDetailsList = data.data.paymentProfiles;
						$rootScope.SelectedPaymentDetails = $rootScope.PaymentDetailsList[data.data.paymentProfiles.length - 1];
						
						
						$rootScope.PaymentDetailsList.push({
							'cardNumber': 'Add a new card'
						});
					
						angular.forEach(data.data.paymentProfiles, function(index, item) {
							$rootScope.PaymentProfile.push({
								'id': index.$id,
								'billingAddress': angular.fromJson(index.billingAddress),
								'cardExpiration': index.cardExpiration,
								'cardNumber': index.cardNumber,
								'isBusiness': index.isBusiness,
								'profileID': index.profileID,
							});
						});	
						$rootScope.enableSubmitpayment = "block";
						$rootScope.disableSubmitpayment = "none;";
					} else {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";						
					}		
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		
	}
	
	//Come to this issues : value="? undefined:undefined ?". Use this following Function //
      $timeout(function(){
            $('select option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
    //value="? undefined:undefined ?"//
    
    $scope.Health = {};	
    $scope.doPostApplyHealthPlan = function() {
        //console.log($scope.Health.addHealthPlan);
        
        if($rootScope.currState.$current.name=="tab.applyPlan") {
            if(typeof $scope.Health.addHealthPlan != 'undefined') {
                 $rootScope.NewHealth = $scope.Health.addHealthPlan;
                 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                 var InsuranceCompany = healthInsurance[0];
                 var PolicyNumber = healthInsurance[1];
                 var healthPlanIdApply = healthInsurance[2];
                 $rootScope.SelectInsuranceCompany   =  InsuranceCompany;
               
            
            }  else if(typeof $scope.Health.addHealthPlan == 'undefined') {
                 var InsuranceCompany = $rootScope.providerName;
                 var PolicyNumber = $rootScope.PolicyNo;
                 var healthPlanIdApply = $rootScope.HealthPlanIdGet;
                 $rootScope.SelectInsuranceCompany   =  InsuranceCompany;
                
            }
        } 
        
       
       
        
        if($rootScope.currState.$current.name=="tab.addHealthPlan") {
                       if(typeof $scope.Health.addHealthPlan != 'undefined') {
                                 $rootScope.NewHealth = $scope.Health.addHealthPlan;
                                 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                                 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                                 var InsuranceCompany = healthInsurance[0];
                                 var PolicyNumber = healthInsurance[1];
                                 var healthPlanIdApply = healthInsurance[2];
                                 $rootScope.SelectInsuranceCompany   =  InsuranceCompany;
                       } else {
                        if(typeof $scope.Health.addHealthPlan == 'undefined') {
                             if(!$rootScope.NewHealth) {
                             $scope.ErrorMessages = "Select your health plan";
			                 $rootScope.Validation($scope.ErrorMessages);
                             }
                             $rootScope.NewHealth ;
                             $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                             var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                             var InsuranceCompany = healthInsurance[0];
                             var PolicyNumber = healthInsurance[1];
                             var healthPlanIdApply = healthInsurance[2];
                             $rootScope.SelectInsuranceCompany   =  InsuranceCompany;
                        } else {
                             $rootScope.NewHealth ;
                             $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                             var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                             var InsuranceCompany = healthInsurance[0];
                             var PolicyNumber = healthInsurance[1];
                             var healthPlanIdApply = healthInsurance[2];
                             $rootScope.SelectInsuranceCompany   =  InsuranceCompany;
                            }
                       }   
         }
            
		 
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                accessToken: $rootScope.accessToken,
				insuranceCompanyName: InsuranceCompany,
				policyNumber: PolicyNumber,
				consultationId: $rootScope.consultationId,
				healthPlanId: healthPlanIdApply,
				success: function (data) {
                    if(!data.message) {
					$scope.ApplyHealthPlan = data;
					$rootScope.copayAmount = data.copayAmount;
					$rootScope.PlanCoversAmount = $rootScope.consultationAmount - $rootScope.copayAmount;
					console.log($scope.ApplyHealthPlan);
                    $rootScope.doGetPatientPaymentProfiles();
                    $state.go('tab.addCard');
                    } else {
                        if($scope.Health.addHealthPlan != ''){
                    $scope.ErrorMessage = "Bad Request Please check it";
			        $rootScope.Validation($scope.ErrorMessage);
                        } else {
                    $scope.ErrorMessages = "Select your health plan";
			        $rootScope.Validation($scope.ErrorMessages);
                        }
                    }
                    

				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postApplyHealthPlan(params);
   	   /*	}  else  {
            $scope.ErrorMessages = "Please select your Plan!";
			$rootScope.Validation($scope.ErrorMessages);
           
        } */

			
	}
    
    
   
	$rootScope.doGetPatientPaymentProfiles = function () {	
		
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			
			var params = {
				hospitalId: $rootScope.hospitalId, 
				patientId: $rootScope.patientId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					if(data != 0) {				
						
						$rootScope.patientprofileID = data.data.profileID;	

						$rootScope.PaymentProfile = [];	
					
						angular.forEach(data.data.paymentProfiles, function(index, item) {	
				
							
							$rootScope.PaymentProfile.push({
								'id': index.$id,
								'billingAddress': angular.fromJson(index.billingAddress),
								'cardExpiration': index.cardExpiration,
								'cardNumber': index.cardNumber,
								'isBusiness': index.isBusiness,
								'profileID': index.profileID,
							});
						});							
						$rootScope.enableSubmitpayment = "block";
						$rootScope.disableSubmitpayment = "none;";						
						//$state.go('tab.addCard');
					} else if(data == 0) {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";
						//$state.go('tab.addCard');
					}
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPatientPaymentProfile(params);		
    }
	
	
	
	$rootScope.verifyCardDisplay = "none";
	$rootScope.cardDisplay = "inherit;";
	
	$scope.getCardDetails = {};  

    $scope.ccCvvLength = 3;
    $scope.$watch('getCardDetails.CardNumber', function(cardNumber){
        var ccn1 = String(cardNumber).substr(0,1); 
        if(typeof cardNumber != "undefined"){
            if(ccn1 == 3){
                $scope.ccCvvLength = 4;
            }else{
                $scope.ccCvvLength = 3;
                if($scope.getCardDetails.Cvv.length > 0){
                    $scope.getCardDetails.Cvv = String($scope.getCardDetails.Cvv).substr(0,3);
                }
            }
        }
    });
    
	$scope.doPostPaymentProfileDetails = function () {
	
        /*$scope.BillingAddress = '123 chennai';
        $scope.CardNumber = 4111111111111111;
        $scope.City = 'chennai';
        $scope.ExpiryMonth = 8;
        $scope.ExpiryYear = 2019;
        $scope.FirstName = 'Rin';
        $scope.LastName = 'Soft';
        $scope.State = 'Tamilnadu';
        $scope.Zip = 91302;
        $scope.Country = 'US';	
        $scope.Cvv = 123;*/

        var zipCount = $('#Zip').val().length;
        //var ExpiryDate = $('#ExpireDate').val().split("/");        

        var currentTime = new Date()
        var ExpiryDateCheck = new Date();
            //var CurrentDate = $filter('date')(currentTime, 'MM-dd-yyyy').split("-");

        ExpiryDateCheck.setFullYear($scope.getCardDetails.CardExpireDatesYear, $scope.getCardDetails.CardExpireDatesMonth, 1);

        $rootScope.FirstName = $scope.getCardDetails.FirstName;
        $rootScope.LastName = $scope.getCardDetails.LastName;
        $rootScope.CardNumber = $scope.getCardDetails.CardNumber;
        $rootScope.ccexpiry = $scope.getCardDetails.CardExpireDates;
        $rootScope.Cvv = $scope.getCardDetails.Cvv;
        $rootScope.BillingAddress = $scope.getCardDetails.BillingAddress;
        $rootScope.City = $scope.getCardDetails.City;
        $rootScope.State = $scope.getCardDetails.State;	
        $rootScope.Zip = $scope.getCardDetails.CardZipCode;
        $rootScope.ExpiryMonth = $scope.getCardDetails.CardExpireDatesMonth;
        $rootScope.ExpiryYear = $scope.getCardDetails.CardExpireDatesYear;
        $scope.Country = $scope.getCardDetails.Country;
		
      
      if($('#FirstName').val() == '' || $('#LastName').val() == '' || $('#CardNumber').val() == '' || $('#datepicker').val() == '' || $('#Cvv').val() == '' || $('#BillingAddress').val() == '' ||  $('#City').val() == '' || $('#State').val() == ''|| $('#Zip').val() == '' )  {			
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else if(zipCount <= 4) {
			$scope.ErrorMessage = "Verify Zip";
			$rootScope.Validation($scope.ErrorMessage);
        } else if(ExpiryDateCheck < currentTime) {
             $scope.ErrorMessage = "Verify month & year";
			 $rootScope.Validation($scope.ErrorMessage);
        }else if(!CreditCardValidations.validCreditCard($rootScope.CardNumber)){
            $scope.ErrorMessage = "Invalid Card Number";
            $rootScope.Validation($scope.ErrorMessage);
        }else if($rootScope.Cvv.length != $scope.ccCvvLength){
            $scope.ErrorMessage = "Security code must be " + $scope.ccCvvLength + " numbers";
            $rootScope.Validation($scope.ErrorMessage);
        }
        else {		
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            $rootScope.cardDisplay = "none;";
            $rootScope.verifyCardDisplay = "block";
            var params = {
                userId: $rootScope.primaryPatientId, 
                BillingAddress: $rootScope.BillingAddress,
                CardNumber: $rootScope.CardNumber,
                City: $rootScope.City,
                ExpiryMonth: $rootScope.ExpiryMonth,
                ExpiryYear: $rootScope.ExpiryYear,
                FirstName: $rootScope.FirstName,
                LastName: $rootScope.LastName,
                State: $rootScope.State,
                Zip: $rootScope.Zip,
                Country: $scope.Country,
                ProfileId: $rootScope.patientprofileID,
                Cvv: $rootScope.Cvv,		
                accessToken: $rootScope.accessToken,

                success: function (data) {
                    $scope.PostPaymentDetails = data;
                    
                    if(data.message == "Success")	{
                        console.log(data);
                        $scope.doGetPatientPaymentProfilesCardDetails();
                        $state.go('tab.submitPayment');
                    } else {	
                        $scope.ErrorMessage = data.message;
                        $rootScope.Validation($scope.ErrorMessage);
                        $state.go('tab.cardDetails');
                    }
                    $rootScope.cardDisplay = "block;";
                    $rootScope.verifyCardDisplay = "none";
                },
                error: function (data) {
                    $rootScope.cardDisplay = "block;";
                    $rootScope.verifyCardDisplay = "none";
                    $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.postPaymentProfileDetails(params);
		
		}
	}
	
	
	
	$scope.doGetCodesSet = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian,P_id) {
       if($rootScope.P_isAuthorized == true) {
			// Start Intake Sub Header Information 
			$rootScope.PatientImageSelectUser = P_img;
			$rootScope.PatientFirstName = P_Fname;
			$rootScope.PatientLastName = P_Lname;
			$rootScope.PatientAge = P_Age;
			$rootScope.PatientGuardian = P_Guardian;
            $rootScope.patientId = P_id;
			// End Intake Sub Header Information 
			
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				hospitalId: $rootScope.hospitalId,
				accessToken: $rootScope.accessToken,
				fields: $scope.codesFields,
				success: function (data) {
				//console.log(data.data[3].codes);
					$rootScope.hospitalCodesList = angular.fromJson(data.data[3].codes);
					$rootScope.scondaryConcernsCodesList = angular.fromJson(data.data[4].codes);
					$rootScope.chronicConditionsCodesList = angular.fromJson(data.data[0].codes);
					$rootScope.currentMedicationsCodesList = angular.fromJson(data.data[1].codes);	
					$rootScope.medicationAllergiesCodesList = angular.fromJson(data.data[2].codes);
                    $rootScope.surgeryYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);
					$state.go('tab.patientConcerns');
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
		   $rootScope.PatientPrimaryConcern = "";
			$rootScope.PatientSecondaryConcern = "";
			$rootScope.PatientChronicCondition = "";
			$rootScope.patinentCurrentMedication = "";
			$rootScope.patinentMedicationAllergies = "";
			$rootScope.patientSurgeriess = "";
			$rootScope.MedicationCount == 'undefined'
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
		} else {
		    $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName+'!'; 
            $rootScope.SubmitCardValidation($scope.ErrorMessage);
		}	
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
						 var TodayDate = new Date();						 
						year = TodayDate.getFullYear();
						month = (TodayDate.getMonth()) + 1;
						date = TodayDate.getDate();
						//2014-09-16T00:00:00
						if(date<10) {
							date='0'+date;
						} 

						if(month<10) {
							month='0'+month;
						} 
						
						$rootScope.TodayDate = year+'-'+month+'-'+date;
						
						angular.forEach($scope.scheduledConsultationList, function(index, item) {							
							if($rootScope.TodayDate < index.scheduledTime) {
								 $rootScope.scheduledList.push({							
									'id': index.$id,
									'scheduledTime': index.scheduledTime,
									'consultantUserId': index.consultantUserId,
									'consultationId': index.consultationId,
									'firstName': index.firstName,
									'lastName': index.lastName,	
									'patientId': index.patientId,
									'assignedDoctorName': index.assignedDoctorName,
									'patientName': index.patientName,
									'patientUserId': index.patientUserId,
									'scheduledId': index.scheduledId,    
								});
							}	
						});	
						var d = new Date();
						d.setHours(d.getHours() + 12);
						$scope.getTwelveHours = $filter('date')(d, "yyyy-MM-ddThh:mm:ss");
						$rootScope.nextAppointmentDisplay = 'none';
								console.log($rootScope.scheduledList[0].scheduledTime);
								console.log($scope.getTwelveHours);
						if($rootScope.scheduledList[0].scheduledTime <= $scope.getTwelveHours) {
							console.log('scheduledTime <= getTwelveHours UserHome');
							$rootScope.nextAppointmentDisplay = 'block';
						}
						 
					}
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getScheduledConsulatation(params);
        }
		
	$scope.getScheduledDetails = function (patientId) {
		$rootScope.getIndividualScheduleDetails = $filter('filter')($rootScope.scheduledList, {patientId:patientId});
			//$rootScope.getIndividualScheduleDetails123 = '2015-06-19T02:09:14';
		var d = new Date();
		d.setHours(d.getHours() + 12);
		$scope.getTwelveHours = $filter('date')(d, "yyyy-MM-ddThh:mm:ss");
		$rootScope.patientDisplay1 = 'none';
		$rootScope.patientDisplay = 'none';
				console.log($rootScope.getIndividualScheduleDetails[0].scheduledTime);
				console.log($scope.getTwelveHours);
		if($rootScope.getIndividualScheduleDetails[0].scheduledTime <= $scope.getTwelveHours) {
			console.log('scheduledTime <= getTwelveHours');
			$rootScope.patientDisplay = 'block';
		}
		$state.go('tab.patientCalendar');
	}
		
		
		$rootScope.PlanDisplay = "inherit";
		$rootScope.verifyPlanDisplay = "none;";
		
	$scope.PlanDetailsValidation = function(model) {
		
		/*if($('#Provider').val() == '' || $('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){ */
        if($('#Provider').val() == '') {
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
        } else if($('#firstName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
        } else if($('#lastName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else if($('#policyNumber').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else if($('#date').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else {
			$rootScope.verifyPlanDisplay = "block";
			$rootScope.PlanDisplay = "none;";	 		
			$scope.doPostNewHealthPlan();	
		}	
	}
	$scope.VerifyPlanDetailsValidation = function(model) {
		
		if($('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			$state.go('tab.applyPlan');
		}	
	}
	
	
    $rootScope.SubmitCardValidation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i>'+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Error_Message").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}

	$scope.ReceiptTimeout = function() {
	
		var currentTimeReceipt = new Date();
		
		currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
		
		$rootScope.ReceiptTime = currentTimeReceipt.getTime();
		
		//setTimeout(function(){ $state.go('tab.waitingRoom');	 }, 10000);
        setTimeout(function(){ $scope.doGetWaitingRoom(); }, 10000);
        
	}
	
    $scope.cardPaymentId = [];	
    $scope.doPostCoPayDetails = function () {		
		
		if($('#addNewCard').val() == 'Choose Your Card'){			
			$scope.ErrorMessages = "Please select the card to use for payment";
			$rootScope.SubmitCardValidation($scope.ErrorMessages);
			
		} else {
		
			 $rootScope.paymentProfileId = $scope.cardPaymentId.addNewCard;
	
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				profileId: parseInt($rootScope.patientprofileID), 
				emailAddress: $rootScope.UserEmail,
				Amount: $rootScope.copayAmount,
				consultationId: $rootScope.consultationId,
				paymentProfileId: parseInt($rootScope.paymentProfileId),
				accessToken: $rootScope.accessToken,
				success: function (data) {
					$rootScope.paymentConfirmationNumber = data.data[0].confirmationNumber;
					$scope.CreditCardDetails = data;					
					$state.go('tab.receipt');	
					$scope.ReceiptTimeout();						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postCoPayDetails(params);
		}
	}
    
    $scope.GoToPatientDetails = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian,P_Id,P_isAuthorized) {
        if($rootScope.patientSearchKey != ''){
            //Removing main patient from the dependant list. If the first depenedant name and patient names are same, removing it. This needs to be changed when actual API given.
        if($rootScope.patientName == $rootScope.RelatedPatientProfiles[0].patientName){
                $rootScope.RelatedPatientProfiles.shift();
                $scope.searched = false;
            }
        }
        
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $rootScope.patientId = P_Id;
		$rootScope.P_isAuthorized = P_isAuthorized
        $state.go('tab.patientDetail'); 
    }
    
     $scope.doToPatientCalendar = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.patientCalendar'); 
    }
	
    $scope.doToAppoimentDetails  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.appoimentDetails'); 
    }
    
    $scope.enterWaitingRoom  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $scope.doGetWaitingRoom();
               
    }
	 $scope.GoToConsultCharge  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;		
		$rootScope.doPutConsultationSave();       
    }
	
	
     
     $scope.GoToappoimentDetails = function(scheduledListData) {
	 
		$scope.$on('timer-tick', function (event, args){
			
			console.log(args.minutes + ' - ' + args.seconds + '-' + args.days );
			if(args.days == 0) {
				$rootScope.hourDisplay = 'initial';
				$rootScope.daysDisplay = 'none';
				$rootScope.dayDisplay = 'none';		
			} else if(args.days == 1) {
				$rootScope.daysDisplay = 'none';	
				$rootScope.hourDisplay = 'none';
				$rootScope.dayDisplay = 'initial';		
			} else if(args.days > 1) {
				$rootScope.daysDisplay = 'initial';	
				$rootScope.hourDisplay = 'none';
				$rootScope.dayDisplay = 'none';	
			}
			
		
			if(args.millis < 100){
			   // $rootScope.timeNew = 'Completed';
				$rootScope.timeNew = 'none';
			   $rootScope.timeNew1 = 'block';
			  // $rootScope.patientDisplay = 'none';
			  // $rootScope.patientDisplay1 = 'block';
				console.log($rootScope.timeNew);
			}
			else if(args.millis < 600000){
			//$rootScope.timeNew = 'below 10 minutes!';
			   $rootScope.timeNew = 'none';
			   $rootScope.timeNew1 = 'block';
			   $rootScope.patientDisplay = 'none';
			   $rootScope.patientDisplay1 = 'block';
			   console.log('below 10 minutes!');
			   
			}else{
			   // $rootScope.timeNew = 'More than 10 minutes!';
				$rootScope.timeNew = 'block';
			   $rootScope.timeNew1 = 'none';
			   // $rootScope.patientDisplay = 'block';
			   //$rootScope.patientDisplay1 = 'none';
				console.log('More than 10 minutes!');
			}
			
		});
	 
		$rootScope.scheduledListDatas =scheduledListData;     
		   //console.log($rootScope.scheduledListDatas);
		   
		$rootScope.consultationId = $rootScope.scheduledListDatas.consultationId;
		
		$rootScope.dtNow = new Date($rootScope.scheduledListDatas.scheduledTime + "Z");
		
		//$rootScope.dtNow = new Date("2015-06-15T13:20:04.268Z");
		
		$rootScope.time = $rootScope.dtNow.getTime();
		
		//$scope.$broadcast('timer-start');
		
		
		$timeout(function() {   
			document.getElementsByTagName('timer')[0].start();
		});
		
		$scope.doGetExistingConsulatation();  
		   
     };
	 
	 
	// var dtNow = new Date("2015-06-11T13:58:04.268Z");
	//$rootScope.time = dtNow.getTime();
		
		
	


	   
    $scope.doGetWaitingRoom = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            consultationID: $rootScope.consultationId,
            eventType: PATIENT_CONSULTATION_EVENT_TYPE_ID,
            event: WAITING_CONSULTATION_EVENT_CODE,
            success: function (data) {
                $state.go('tab.waitingRoom');                  
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.updateConsultationEvent(params);					
    }
	
	$rootScope.EnableBackButton = function () {     
        $state.go('tab.userhome');			
    };
   
})

.controller('waitingRoomCtrl', function($scope, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout,SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList) {
 
	$rootScope.currState = $state;
    
	$ionicPlatform.registerBackButtonAction(function (event, $state) {	
        if ( ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") || 	
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){ 
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            } else { 
                // For all other states, the H/W BACK button is enabled
                navigator.app.backHistory(); 
            }
        }, 100); 
    $scope.$storage = $localStorage;
     
    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
    $scope.isPhysicianStartedConsultaion = false;
            
    consultationStatusCheck = $interval(function(){
         if(!$scope.isPhysicianStartedConsultaion){
              $scope.checkIfPhysicianStartedConference();
         }
    }, 5000);
            
    $scope.checkIfPhysicianStartedConference = function(){
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function (data) {
                console.log('-------------------------------- ' +  data.data[0].consultationInfo.consultationStatus);
                 if(data.data[0].consultationInfo.consultationStatus == REVIEW_CONSULTATION_STATUS_CODE){
                      $interval.cancel(consultationStatusCheck);
                      $scope.isPhysicianStartedConsultaion = true;
                      $scope.getConferenceKeys();
                      return;
                 }
            },
            error: function (data) {
				$rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.getExistingConsulatation(params);
     };
    
    $scope.getConferenceKeys = function(){
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function (data) {
                $rootScope.videoSessionId = data.sessionId;
                $rootScope.videoApiKey = data.apiKey;
                $rootScope.videoToken = data.token;
                if($rootScope.videoSessionId != "" && $rootScope.videoToken != ""){
                    $state.go('tab.videoConference');
                }

            },
            error: function (data) {
               $rootScope.serverErrorMessageValidation(); 
            }
        };
        LoginService.getVideoConferenceKeys(params);
    };
    
})

// Controller to be used by all intake forms
.controller('IntakeFormsCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory, $filter, $rootScope, $state,SurgeryStocksListService, LoginService, $timeout, CustomCalendar) {
    $rootScope.currState = $state;
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
   
    $rootScope.limit = 4;
	$rootScope.Concernlimit = 1;
    $rootScope.checkedPrimary = 0;
    
     
    $scope.doGetExistingConsulatation = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = { 
            consultationId: 2440, // consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
                $rootScope.patientInfomation = data.data[0].patientInformation;	
                $rootScope.PatientImage = $rootScope.APICommonURL + $rootScope.patientInfomation.profileImagePath;
                $rootScope.inTakeForm = data.data[0].intakeForm;
                $rootScope.inTakeFormCurrentMedication = $rootScope.inTakeForm.takingMedications;
                $rootScope.inTakeFormChronicCondition = $rootScope.inTakeForm.medicalCondition;
                $rootScope.inTakeFormPriorSurgeories = $rootScope.inTakeForm.priorSurgeories;
                $rootScope.inTakeFormMedicationAllergies = $rootScope.inTakeForm.medicationAllergies;
            },
            error: function (data) {
                $scope.existingConsultation = 'Error getting existing consultation';
				console.log(data);
            }
        };
        
        LoginService.getExistingConsulatation(params);
	}
    
  
    $scope.model = null;
	var today = new Date();
			var dd = today.getDate()-1;
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();	
				if(dd<10) {
					dd='0'+dd;
				} 

				if(mm<10) {
					mm='0'+mm;
				} 

			//$rootScope.PreviousDate = yyyy+'-'+mm+'-'+dd; //Previous Date
            $rootScope.PreviousDate = yyyy+'-'+mm; //Previous Month
			console.log('dddd',$rootScope.PreviousDate);
    
	/*Primary concern Start here*/
	
	  $rootScope.PopupValidation = function($a){
        function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);
			$rootScope.PrimaryPopup = $rootScope.PrimaryPopup - 1;
			});
			}
			refresh_close();
			$rootScope.PrimaryPopup = $rootScope.PrimaryPopup + 1;
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".PopupError_Message").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    // Get list of primary concerns lists
    $scope.primaryConcernList = $rootScope.hospitalCodesList;
  
    
      // Open primary concerns popup
    $scope.loadPrimaryConcerns = function() {
        
        $ionicModal.fromTemplateUrl('templates/tab-ConcernsList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
    
      
   $scope.closePrimaryConcerns = function() {
        $scope.PatientPrimaryConcernItem = $filter('filter')($scope.primaryConcernList, {checked:true});		
		$rootScope.PrimaryConcernText = $scope.PatientPrimaryConcernItem[0].text;		
		
        //angular.forEach($scope.PatientPrimaryConcernItem, function(item, index) {
           //$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
		   if(typeof $rootScope.PatientSecondaryConcern[0] != 'undefined') {
					if($scope.PatientPrimaryConcernItem[0].text == $rootScope.PatientSecondaryConcern[0].text) {			
						$scope.ErrorMessage = "Primary and Secondary Concerns must be different";
						$rootScope.ValidationFunction1($scope.ErrorMessage);
					}
					else {
					$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
					 $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
					$scope.modal.hide();
					$scope.data.searchQuery = '';
					}
			} else {
				$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
				 $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
				$scope.modal.hide();
				$scope.data.searchQuery = '';
			}
		   
		   
		   
		   
        //});
         
       
    };
   
    
    // Onchange of primary concerns
    $scope.OnSelectPatientPrimaryConcern = function(position, primaryConcernList, items) {
      angular.forEach(primaryConcernList, function(item, index) {
         if (item.text == items.text) 
              item.checked = true;
          else item.checked = false; 
          });
        
      if(items.text == "Other (provide details below)")
                $scope.openOtherPrimaryConcernView();
                    //item.checked = false;
    
    } 
	$rootScope.PrimaryPopup = 0;
  // Open text view for other primary concern
	$scope.openOtherPrimaryConcernView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          //template: '<input type="text" ng-model="data.PrimaryConcernOther">',
			template: '<div class="PopupError_Message ErrorMessageDiv" ></div><textarea name="comment" id="comment-textarea" ng-model="data.PrimaryConcernOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.primaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.PrimaryConcernOther) {
					if($rootScope.PrimaryPopup == 0) {
						$scope.ErrorMessages = "Please enter a reason for today's visit";
						$rootScope.PopupValidation($scope.ErrorMessages);
					}
						e.preventDefault();
				  } else {
                      angular.forEach($scope.primaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                      var newPrimaryConcernItem = { text: $scope.data.PrimaryConcernOther, checked: true };
                      $scope.primaryConcernList.splice(1, 0, newPrimaryConcernItem);
                      //$scope.primaryConcernList.push({ text: $scope.data.PrimaryConcernOther, checked: true });
					  return $scope.data.PrimaryConcernOther;
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removePrimaryConcern = function(index, item){
        //$scope.PatientPrimaryConcern = "";
    $scope.PatientPrimaryConcern.splice(index, 1);
    var indexPos = $scope.primaryConcernList.indexOf(item);
    $scope.primaryConcernList[indexPos].checked = false;    
    $rootScope.IsValue =  $scope.PatientPrimaryConcern.length;
      $rootScope.IsValue =    $scope.primaryConcernList;
    $rootScope.IsValue = "";
    }
	//console.log($rootScope.IsValue)
    
	$rootScope.PrimaryNext = 0;
    
    $rootScope.ConcernsValidation = function($a){
        function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);
				$rootScope.PrimaryNext = $rootScope.PrimaryNext - 1;
			});
			
			}
			refresh_close();
			
			$rootScope.PrimaryNext = $rootScope.PrimaryNext + 1;
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 23px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".Error_Message").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
    
    $scope.PatientConcernsDirectory = function(){
        if($rootScope.IsValue == 0 || $rootScope.IsValue == undefined) {
			if($rootScope.PrimaryNext == 0) {
				$scope.ErrorMessage = "Primary Concern Can't be Empty";
				$rootScope.ConcernsValidation($scope.ErrorMessage);
			}
        } else { 
			$scope.doPostOnDemandConsultation();			
        }
        
    }
    
	/*Primary concern End here*/
	
	/*Secondary concern Start here*/
	
    
    $scope.secondaryConcernList = $rootScope.scondaryConcernsCodesList;
    //$rootScope.PatientSecondaryConcern = [];
    
    // Open Secondary concerns popup
    $scope.loadSecondaryConcerns = function() {
        $ionicModal.fromTemplateUrl('templates/tab-SecondaryConcernsList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }); 
    };

    $scope.closeSecondaryConcerns = function() {
        $scope.PatientSecondaryConcernItem = $filter('filter')($scope.secondaryConcernList, {checked:true});
		$rootScope.SecondaryConcernText = $scope.PatientSecondaryConcernItem[0].text;
		
      //  angular.forEach($scope.PatientSecondaryConcernItem, function(item, index) {
			if(typeof $rootScope.PatientPrimaryConcern[0] != 'undefined') {
					if($scope.PatientSecondaryConcernItem[0].text == $rootScope.PatientPrimaryConcern[0].text) {			
						$scope.ErrorMessage = "Primary and Secondary Concerns must be different";
						$rootScope.ValidationFunction1($scope.ErrorMessage);
					}
					else {
					$rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
					 $scope.modal.hide();
					$scope.data.searchQuery = '';	
					}
			} else {
				$rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
				 $scope.modal.hide();
				$scope.data.searchQuery = '';
			}
			
       // });
       
    };
    
    
    // Onchange of Secondary concerns
    $scope.OnSelectPatientSecondaryConcern = function(position, secondaryConcernList, items) {
        angular.forEach(secondaryConcernList, function(item, index) {
           /* if (position != index) 
              item.checked = false; */
            if (item.text == items.text) 
              item.checked = true;
            else item.checked = false; 
        });
        if(items.text == "Other (provide details below)"){
            $scope.openOtherSecondaryConcernView();
            item.checked = false;
        }
    }
	
    // Open text view for other Secondary concern
	$scope.openOtherSecondaryConcernView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
           template: '<textarea name="comment" id="comment-textarea" ng-model="data.SecondaryConcernOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.secondaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.SecondaryConcernOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.secondaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                     var newSecodaryConcernItem = { text: $scope.data.SecondaryConcernOther, checked: true };
                      $scope.secondaryConcernList.splice(1, 0, newSecodaryConcernItem);
                      
                      // $scope.secondaryConcernList.push({ text: $scope.data.SecondaryConcernOther, checked: true });
					  return $scope.data.SecondaryConcernOther;
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removeSecondaryConcern = function(index, item){
      $scope.PatientSecondaryConcern.splice(index, 1);
      var indexPos = $scope.secondaryConcernList.indexOf(item);
      $scope.secondaryConcernList[indexPos].checked = false;
    }
	
	/*Secondary concern End here*/


	$scope.OnDemandConsultationSaveData ={
											  "concerns": [
												
											  ],											  
											  "patientId": $rootScope.patientId
										}	
										

					if($rootScope.mobilePhone != '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.mobilePhone;
					} else if($rootScope.mobilePhone == '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.homePhone;
					}
					
			
	
	$scope.doPostOnDemandConsultation = function() {
	
			$scope.OnDemandConsultationSaveData.concerns.push(
				{isPrimary: true, description: $rootScope.PrimaryConcernText},
				{isPrimary: false, description: $rootScope.SecondaryConcernText}
			);		
	
	
				if ($rootScope.accessToken == 'No Token') {
					alert('No token.  Get token first then attempt operation.');
					return;
				}
				 var params = {
					accessToken: $rootScope.accessToken,
					OnDemandConsultationData: $scope.OnDemandConsultationSaveData,
					patientId: $rootScope.patientId,
					success: function (data) {
						$rootScope.OnDemandConsultationSaveResult = data.data[0];
						$rootScope.consultationAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
						$rootScope.copayAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
						$rootScope.consultationId = $rootScope.OnDemandConsultationSaveResult.consultationId;
						console.log(data);
                        $scope.doGetExistingConsulatation();
						$state.go('tab.ChronicCondition');
					},
					error: function (data) {
						$rootScope.serverErrorMessageValidation();
					}
				};
				
				LoginService.postOnDemandConsultation (params);
		};

	
	
	/*Chronic Condition Start here*/
	
    // Get list of Chronic Condition lists
   $scope.chronicConditionList = $rootScope.chronicConditionsCodesList;
	
   // Open Chronic Condition popup
    $scope.loadChronicCondition = function() {
	
		if(typeof $rootScope.ChronicCount == 'undefined') { 
			$rootScope.checkedChronic = 0;
		} else {  
		$rootScope.checkedChronic  = $rootScope.ChronicCount;  
		}
		
        $ionicModal.fromTemplateUrl('templates/tab-ChronicConditionList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }); 
    };

    $scope.closeChronicCondition = function() {
    $scope.PatientChronicConditionItem = $filter('filter')($scope.chronicConditionList, {checked:true});
    $rootScope.PatientChronicCondition = $scope.PatientChronicConditionItem;
	$rootScope.ChronicCount = $scope.PatientChronicCondition.length;
	console.log($rootScope.ChronicCount);
	console.log($rootScope.PatientChronicCondition);
    $scope.modal.hide(); 
    $scope.data.searchQuery = '';    
    };
      
    
    // Onchange of Chronic Condition
    $scope.OnSelectChronicCondition = function(item) {
       if(item.checked == true) { 
		$rootScope.checkedChronic++; 
	  }  else  { 
	  $rootScope.checkedChronic--; 
	  }
        if(item.text == "Other"){
           $scope.openOtherChronicConditionView(item);          
		 }
    }
	
   
    // Open text view for other Chronic Condition
	$scope.openOtherChronicConditionView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
            template: '<textarea name="comment" id="comment-textarea" ng-model="data.ChronicCondtionOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.chronicConditionList, function(item, index) {
                        if(item.checked) { if(item.text == "Other") item.checked = false; }
                          });
                      $rootScope.checkedChronic--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.ChronicCondtionOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.chronicConditionList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other") { item.checked = false; }
                        } 
                        
                       });  
                      
                       var newchronicConditionItem = { text: $scope.data.ChronicCondtionOther, checked: true };
                      $scope.chronicConditionList.splice(1, 0, newchronicConditionItem);
                      
                       //$scope.chronicConditionList.push({ text: $scope.data.ChronicCondtionOther, checked: true });
                       return $scope.data.ChronicCondtionOther;
				  }
				}
			  }
			]
		  });
    };
    
    
    $scope.removeChronicCondition = function(index, item){
          $scope.PatientChronicCondition.splice(index, 1);
          var indexPos = $scope.chronicConditionList.indexOf(item);
          $scope.chronicConditionList[indexPos].checked = false;
          $rootScope.checkedChronic--;
		  $rootScope.ChronicCount = $rootScope.checkedChronic;
    }
	
  
	/*Chronic Condition End here*/
    
    
    
  
    /*Medication Allegies Start here*/
	
    // Get list of Medication Allegies List
    $scope.MedicationAllegiesList = $rootScope.medicationAllergiesCodesList;
	
    
    // Open Medication Allegies List popup

    $scope.loadMedicationAllegies = function() {
        
        if(typeof $rootScope.AllegiesCount == 'undefined') { 
			$rootScope.checkedAllergies = 0;
		} else {  
		$rootScope.checkedAllergies  = $rootScope.AllegiesCount;  
		}
        
        $ionicModal.fromTemplateUrl('templates/tab-MedicationAllegiesList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
	
     $scope.closeMedicationAllegies = function() {
        $scope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
        $rootScope.patinentMedicationAllergies = $scope.MedicationAllegiesItem;
        $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
        $scope.modal.hide();
        $scope.data.searchQuery = ''; 
    };
    
      // Onchange of Medication Alligies
    $scope.OnSelectMedicationAllegies = function(item) {
            if(item.checked == true) { 
                $rootScope.checkedAllergies++; 
              }  else  { 
                $rootScope.checkedAllergies--; 
              }
        if(item.text == "Other"){
            $scope.openOtherMedicationAllgiesView(item);
        }
    }
    
    
    
      // Open text view for other Medication Allergies
	$scope.openOtherMedicationAllgiesView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          template: '<textarea name="comment" id="comment-textarea" ng-model="data.MedicationAllergiesOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.MedicationAllegiesList, function(item, index) {
                       if(item.checked) { if(item.text == "Other") item.checked = false; }
                          });
                      $rootScope.checkedAllergies--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.MedicationAllergiesOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.MedicationAllegiesList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other") { item.checked = false; }
                        } 
                      });
                     
                       var newMedicationAllegiesItem = { text: $scope.data.MedicationAllergiesOther, checked: true };
                      $scope.MedicationAllegiesList.splice(1, 0, newMedicationAllegiesItem);
        
                      // $scope.MedicationAllegiesList.push({ text: $scope.data.MedicationAllergiesOther, checked: true });
					  return $scope.data.MedicationAllergiesOther;
				  }
				}
			  }
			]
		  });
    };
    
    
    
     $scope.removeMedicationAllegies = function(index, item){
      $scope.patinentMedicationAllergies.splice(index, 1);
      var indexPos = $scope.MedicationAllegiesList.indexOf(item);
      $scope.MedicationAllegiesList[indexPos].checked = false;
      $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
      $rootScope.checkedAllergies--;
    }
	
    /*Medication Allegies End here*/
    
    
      /*Current Medication Start here*/
	
    // Get list of Current Medication  List
     
    $scope.CurrentMedicationList = $rootScope.currentMedicationsCodesList;
    if($rootScope.currState.$current.name=="tab.CurrentMedication") {  
    angular.forEach($rootScope.inTakeFormCurrentMedication, function(index, item) { 
        $scope.CurrentMedicationList.push({
            $id: index.$id,
            codeId: index.id,
            displayOrder: 0,
            text: index.value,

        });
    }); 
    }
      console.log($scope.CurrentMedicationList);
      console.log($rootScope.inTakeFormCurrentMedication);
   // Open Current Medication popup
    $scope.loadCurrentMedication = function() {
        
         if(typeof $rootScope.MedicationCount == 'undefined') { 
			$rootScope.checkedMedication = 0;
		} else {  
		    $rootScope.checkedMedication  = $rootScope.MedicationCount;  
		}
        
        $ionicModal.fromTemplateUrl('templates/tab-CurrentMedicationList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
	
     $scope.closeCurrentMedication = function() {
        $scope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
        $rootScope.patinentCurrentMedication = $scope.CurrentMedicationItem;
        $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
        $scope.modal.hide();
        $scope.data.searchQuery = ''; 
         
    };
    
      // Onchange of Current Medication
    $scope.OnSelectCurrentMedication = function(item) {
        if(item.checked == true) { 
                $rootScope.checkedMedication++; 
              }  else  { 
                $rootScope.checkedMedication--; 
              }
         
        if(item.text == "Other - (List below)"){
            $scope.openOtherCurrentMedicationView(item);

        }
    }
    
    // Open text view for other Current Medication
	$scope.openOtherCurrentMedicationView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
           template: '<textarea name="comment" id="comment-textarea" ng-model="data.CurrentMedicationOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.CurrentMedicationList, function(item, index) {
                       if(item.checked) { if(item.text == "Other - (List below)") item.checked = false; }
                          });
                      $rootScope.checkedMedication--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.CurrentMedicationOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.CurrentMedicationList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other - (List below)") { item.checked = false; }
                        } 
                      });
                     
                          var newCurrentMedicationItem = { text: $scope.data.CurrentMedicationOther, checked: true };
                      $scope.CurrentMedicationList.splice(1, 0, newCurrentMedicationItem);
                      
                      // $scope.CurrentMedicationList.push({ text: $scope.data.CurrentMedicationOther, checked: true });
					  return $scope.data.CurrentMedicationOther;
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removeCurrentMedication = function(index, item){
      $scope.patinentCurrentMedication.splice(index, 1);
      var indexPos = $scope.CurrentMedicationList.indexOf(item);
      $scope.CurrentMedicationList[indexPos].checked = false;
      $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;    
      $rootScope.checkedMedication--;
    }
	
   /*Current Medication End here*/
    
    
    /* Prior Surgery page START */

	
   $scope.getSurgeryPopup = function() {
		$rootScope.LastName1 = '';
		$rootScope.datestr = '';
      
        $ionicModal.fromTemplateUrl('templates/surgeryPopup.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {		
			
            $scope.modal = modal;
            $scope.surgery.name = '';
            $scope.surgery.dateString = '';
            $scope.surgery.dateStringMonth = '';
            $scope.surgery.dateStringYear = '';
            $scope.modal.show();
            $timeout(function(){
                $('option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);
        }); 
    };
	
	
	$rootScope.ValidationFunction1 = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			 
				$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".ErrorMessage").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    
    $scope.surgery = {};
    
    $scope.closeSurgeryPopup = function(model) {
         $scope.surgery.name;
		/*$rootScope.LastName1 = $('#name').val();
		$rootScope.datestr = $('#dateString').val(); */
        $scope.surgery.dateString;
		/*if($scope.surgery.name == '' || $scope.surgery.dateString == ''){
            $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.name == undefined || $scope.surgery.dateString == undefined)) {
             $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } */
        
        var selectedSurgeryDate = new Date($scope.surgery.dateStringYear, $scope.surgery.dateStringMonth-1, 01);
        $scope.surgery.dateString = selectedSurgeryDate;
        var patientBirthDateStr = new Date($rootScope.PatientAge);
        
        var isSurgeryDateValid = true;
        if(selectedSurgeryDate < patientBirthDateStr){
            isSurgeryDateValid = false;
        }
        if($scope.surgery.name == '' || $scope.surgery.name == undefined){
            $scope.ErrorMessage = "Please provide a name/description for this surgery";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.dateStringMonth == '' || $scope.surgery.dateStringMonth == undefined || $scope.surgery.dateStringYear == '' || $scope.surgery.dateStringYear == undefined)) {
             $scope.ErrorMessage = "Please enter the date as MM/YYYY";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        }else if(!isSurgeryDateValid){
            $scope.ErrorMessage = "Sugery date should not be before your birthdate";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        }else {
            SurgeryStocksListService.addSurgery($scope.surgery.name, $scope.surgery.dateString);
            $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
            $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
            $scope.modal.hide();
		}
    }
	
	 $scope.RemoveSurgeryPopup = function(model) {
        $scope.modal.hide();
 };
     $scope.removePriorSurgeries = function(index, item){
      $scope.patientSurgeriess.splice(index, 1);
      var indexPos = $scope.patientSurgeriess.indexOf(item);
      $rootScope.IsToPriorCount--;
      //console.log($rootScope.IsToPriorCount--);
    }
    
	
	/* Prior Surgery page END */

	
	$scope.ConsultationSaveData = 	{
									  "medicationAllergies": [
									  ],
									  "surgeries": [
									  ],
									  "medicalConditions": [
									  ],
									  "medications": [
									  ],
									  "infantData": {
										"fullTerm": "",
										"vaginalBirth": "",
										"dischargedWithMother": "",
										"vaccinationsCurrent": ""
									  },
									  "concerns": [
									  ]
									};

      $rootScope.doPutConsultationSave = function () {
	  
			for (var i = 0; i < $rootScope.AllegiesCount; i++) {
				$scope.ConsultationSaveData.medicationAllergies.push(
					{code: $rootScope.patinentMedicationAllergies[i].codeId, description: $rootScope.patinentMedicationAllergies[i].text}
				);
			}
			
			for (var i = 0; i < $rootScope.IsToPriorCount; i++) {
				
				date1 = new Date ($rootScope.patientSurgeriess[i].Date );		 
				year = date1.getFullYear();
				month = (date1.getMonth()) + 1;
				
				$scope.ConsultationSaveData.surgeries.push(
					{description: $rootScope.patientSurgeriess[i].Name, month: month, year: year}
				);
			}	

			for (var i = 0; i < $rootScope.ChronicCount; i++) {
				$scope.ConsultationSaveData.medicalConditions.push(
					{code: $rootScope.PatientChronicCondition[i].codeId, description: $rootScope.PatientChronicCondition[i].text}
				);
			}	

			for (var i = 0; i < $rootScope.MedicationCount; i++) {
				$scope.ConsultationSaveData.medications.push(
					{code: $rootScope.patinentCurrentMedication[i].codeId, description: $rootScope.patinentCurrentMedication[i].text}
				);
			}	
	  
	  
			$scope.ConsultationSaveData.concerns.push(
				{isPrimary: true, description: $rootScope.PrimaryConcernText},
				{isPrimary: false, description: $rootScope.SecondaryConcernText}
			);	
			

			console.log($rootScope.patientSurgeriess);
			console.log($rootScope.IsToPriorCount);
		
		console.log($scope.ConsultationSaveData);
	  
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
				ConsultationSaveData: $scope.ConsultationSaveData,
                success: function (data) {                    
					$scope.ConsultationSave = "success";	
					$rootScope.doGetPatientPaymentProfiles();	
					 $state.go('tab.consultCharge'); 
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.putConsultationSave(params);
        }

    
    
    
    
     $scope.clearRootScopeConce = function(model) {
		$rootScope.PatientPrimaryConcern = "";
        $rootScope.PatientSecondaryConcern = "";
        $rootScope.PatientChronicCondition = "";
        $rootScope.patinentCurrentMedication = "";
        $rootScope.patinentMedicationAllergies = "";
        $rootScope.patientSurgeriess = "";
        $rootScope.MedicationCount == 'undefined'
        $rootScope.checkedChronic = 0;  
        $rootScope.ChronicCount = "";
        $rootScope.AllegiesCount = "";
        $rootScope.checkedAllergies = 0;
        $rootScope.MedicationCount = ""; 
        $rootScope.checkedMedication = 0; 
        $rootScope.IsValue = "";
        $rootScope.IsToPriorCount = "";
        SurgeryStocksListService.ClearSurgery();
        $state.go('tab.patientDetail');
        
     };
    
    //Side Menu
     $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    
	
})






.controller('ConferenceCtrl', function($scope, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
    
	$scope.myVideoHeight = $window.innerHeight - 40;
    $scope.myVideoWidth = $window.innerWidth;
    $scope.otherVideoTop = $window.innerHeight - 150;
    $scope.controlsStyle = false;
    
    $scope.cameraPosition = "front";
    $scope.publishAudio = true;
    
    
    $scope.muteIconClass = 'ion-ios-mic callIcons';
    $scope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
    
    
    $rootScope.videoApiKey = "45217062"; 
      $rootScope.videoSessionId = "2_MX40NTIxNzA2Mn5-MTQzMDI5NDIzNjAxOX5qbnI1b0NLSjZXQXZ0VjJGOFhZckFzNjJ-fg"; 
      $rootScope.videoToken = "T1==cGFydG5lcl9pZD00NTIxNzA2MiZzaWc9NTFhMjcwNzY4MzRhNTk3YTViZjlhNThlMDRmNDU2N2U5ODQzZWFjNjpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5USXhOekEyTW41LU1UUXpNREk1TkRJek5qQXhPWDVxYm5JMWIwTkxTalpYUVhaMFZqSkdPRmhaY2tGek5qSi1mZyZjcmVhdGVfdGltZT0xNDMwMjk0MjQ5Jm5vbmNlPTAuOTgxMzMwNzQ5MDM0MTQ0OSZleHBpcmVfdGltZT0xNDMyODg0NzA2JmNvbm5lY3Rpb25fZGF0YT0="; 
    /*
    
    apiKey = $rootScope.videoApiKey;
    sessionId = $rootScope.videoSessionId;
    token = $rootScope.videoToken;
    */
    var session = OT.initSession(apiKey, sessionId);
    var publisher;

    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            subscribeToAudio: true,
            subscribeToVideo: true
        });
        OT.updateViews();
    });

    // Handler for sessionDisconnected event
    session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
    });

    // Connect to the Session
    session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            publisher = OT.initPublisher('publisher', {
            });
            $timeout(function(){
                $scope.controlsStyle = true;
            }, 100);
            session.publish(publisher);
            OT.updateViews();

        } else {
            alert('There was an error connecting to the session: ' + error.message);
        }

    });
    $scope.toggleCamera = function(){
        if($scope.cameraPosition == "front"){
            $scope.newCamPosition = "back";
            $scope.cameraIconClass = 'ion-ios-reverse-camera-outline callIcons';
        }else{
            $scope.newCamPosition = "front";
            $scope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
        }
        $scope.cameraPosition = $scope.newCamPosition;
        publisher.setCameraPosition($scope.newCamPosition);
        OT.updateViews();
    };
    
    $scope.toggleMute = function(){
        if($scope.publishAudio){
            $scope.newPublishAudio = false;
            $scope.muteIconClass = 'ion-ios-mic-off callIcons activeCallIcon';
        }else{
            $scope.newPublishAudio = true;
            $scope.muteIconClass = 'ion-ios-mic callIcons';
        }
        $scope.publishAudio = $scope.newPublishAudio;
        publisher.publishAudio($scope.newPublishAudio);
        //OT.updateViews();
    };
    
    $scope.toggleSpeaker = function(){
        
    };
    
    $scope.turnOffCamera = function(){
        
    };
	
	$scope.doGetExistingConsulatationReport = function () {	
		
			
		 if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $rootScope.existingConsultationReport = data.data[0].details[0]	;
				$rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;					
				$rootScope.primaryConcern = $rootScope.existingConsultationReport.primaryConcern;
				$rootScope.primaryConcern = $rootScope.primaryConcern.split("?");
				$rootScope.secondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
				$rootScope.secondaryConcern = $rootScope.secondaryConcern.split("?");
				$rootScope.intake = $rootScope.existingConsultationReport.intake;
				
				$rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;
					if($rootScope.fullTerm == 'N') { $rootScope.fullTerm = 'No'; } else if($rootScope.fullTerm == 'T') { $rootScope.fullTerm = 'True'; } 
				
				$rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
					if($rootScope.vaginalBirth == 'N') { $rootScope.vaginalBirth = 'No'; } else if($rootScope.vaginalBirth == 'T') { $rootScope.vaginalBirth = 'True'; } 
				
				$rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
					if($rootScope.dischargedWithMother == 'N') { $rootScope.dischargedWithMother = 'No'; } else if($rootScope.dischargedWithMother == 'T') { $rootScope.dischargedWithMother = 'True'; } 
				
				$rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
					if($rootScope.vaccinationsCurrent == 'N') { $rootScope.vaccinationsCurrent = 'No'; } else if($rootScope.vaccinationsCurrent == 'T') { $rootScope.vaccinationsCurrent = 'True'; } 
				
				
				
				$rootScope.gender = data.data[0].details[0].gender;
				if($rootScope.gender == 'M') { $rootScope.gender = 'Male'; } else if($rootScope.gender == 'F') { $rootScope.gender = 'Female'; } 
				
				
					$rootScope.ReportMedicalConditions = [];
					angular.forEach($rootScope.intake.medicalConditions, function(index, item) {	
						$rootScope.ReportMedicalConditions.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});	
					
					$rootScope.ReportMedicationAllergies = [];
					angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {	
						$rootScope.ReportMedicationAllergies.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});	
					
					$rootScope.ReportMedications = [];
					angular.forEach($rootScope.intake.medications, function(index, item) {	
						$rootScope.ReportMedications.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});
					
					$rootScope.ReportSurgeries = [];
					angular.forEach($rootScope.intake.surgeries, function(index, item) {	
						$rootScope.ReportSurgeries.push({	
							'Number':item + 1,
							'id': index.$id,
							'description': index.description,
							'month': index.month,
							'year': index.year,
						});
					});
					
					
				
				$state.go('tab.ReportScreen');
		   },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
		LoginService.getConsultationFinalReport(params);
	}
	
	$scope.doGetPatientsSoapNotes = function() {
			if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			 var params = {
                consultationID: $rootScope.consultationId, 
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.SoapNote = data.data.soapNote;
                },
                error: function (data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
			
			LoginService.getPatientsSoapNotes(params);
		}
	
    
    $scope.disconnectConference = function(){
        session.unpublish(publisher)
        //publisher.destroy();
        session.disconnect();
		$scope.doGetPatientsSoapNotes();
		$scope.doGetExistingConsulatationReport();       
    };
    
})


.directive('inputMaxLengthNumber', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        var maxlength = Number(attrs.maxlength);
        if (String(text).length >= maxlength) {
        var newString = String(text).substr(0, maxlength);
          ngModelCtrl.$setViewValue(newString);
          ngModelCtrl.$render();
          return ngModelCtrl.$modelValue;
        }
        return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
})



.directive('creditCardExpirationEntry', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        var newVal = String(text);
        if(typeof oldLength != "undefined"){
            if(oldLength != 3 && String(text).length == 2){
                //newVal = newVal.substr(0,2) + "/" + newVal.substr(2, newVal.length);// 
                newVal = String(text) + "/";
            }
        }
        if(String(text).length == 1){
            oldLength = 7;
        }else{
            oldLength = String(text).length;
        }
        ngModelCtrl.$setViewValue(newVal);
        ngModelCtrl.$render();
        return newVal;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
})


.filter('ageFilter', function() {
    function getAge(dateString) {
	  var now = new Date();
	  var today = new Date(now.getYear(),now.getMonth(),now.getDate());

	  var yearNow = now.getYear();
	  var monthNow = now.getMonth();
	  var dateNow = now.getDate();

	  var dob = new Date(dateString.substring(6,10),
						 dateString.substring(0,2)-1,                   
						 dateString.substring(3,5)                  
						 );

	  var yearDob = dob.getYear();
	  var monthDob = dob.getMonth();
	  var dateDob = dob.getDate();
	  var age = {};
	  var ageString = "";
	  var yearString = "";
	  var monthString = "";
	  var dayString = "";


	  yearAge = yearNow - yearDob;

	  if (monthNow >= monthDob)
		var monthAge = monthNow - monthDob;
	  else {
		yearAge--;
		var monthAge = 12 + monthNow -monthDob;
	  }

	  if (dateNow >= dateDob)
		var dateAge = dateNow - dateDob;
	  else {
		monthAge--;
		var dateAge = 31 + dateNow - dateDob;

		if (monthAge < 0) {
		  monthAge = 11;
		  yearAge--;
		}
	  }

	  age = {
		  years: yearAge,
		  months: monthAge,
		  days: dateAge
		  };

	  if ( age.years > 1 ) yearString = " years";
	  else yearString = " year";
	  if ( age.months> 1 ) monthString = " months";
	  else monthString = " month";
	  if ( age.days > 1 ) dayString = " days";
	  else dayString = " day";

	  
	   if(age.years == 0 ) {  
			if(age.days <= 15) {
				return ageString = '0.' + age.months; 
			} else if (age.days > 15) {
				 return ageString = '0.' + (age.months + 1); 
			}
	   }
		if (age.years > 0) { return ageString = age.years; }

	  
	}

     return function(birthdate) {
			var BirthDate = new Date(birthdate);

			var year = BirthDate.getFullYear();
			var month = BirthDate.getMonth() + 1;
			if(month < 10) { month = '0' + month; } else { month = month; }
			var date = BirthDate.getDate();
			if(date < 10) { date = '0' + date; } else { date = date; }
			
			var newDate = month + '/' + date + '/' + year;

           var age = getAge(newDate);
		   return age;
     }; 
})

 .directive('googlePlaces', function(){
                return {
                    restrict:'E',
                    replace:true,
                    // transclude:true,
                    scope: {location:'='},
                    template: '<input id="google_places_ac" name="google_places_ac" ng-model="google_places_ac" type="text" class="input-block-level" required  />',
                    link: function($scope, elm, attrs){
                var input = document.getElementById('google_places_ac');        
                var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(regions)'],componentRestrictions: { country: "US" }});
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
                            var place  = autocomplete.getPlace();
                            $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                            $scope.$apply();
                        });
                    }
                }
})

// Array Of Countries Filter
.filter('arrayContries', function() {
  return function(items,reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    if(reverse) filtered.reverse();
     return filtered;
  };
})


.filter('truncate', function () {
    return function (input, characters) {
        if (input.length > characters) {
            return input.substr(0, characters) + '...';
        }

        return input;
    };
}) 

.directive('siteHeader', function () {
    return {
        restrict: 'E',
        template: '<a class="button_new icon ion-chevron-left"><span>{{back}}</span></a>',
        scope: {
            back: '@back',           
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });          
        }
    };
})

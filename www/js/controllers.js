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

angular.module('starter.controllers', ['starter.services','ngLoadingSpinner', 'timer','ngStorage'])


.controller('LoginCtrl', function($scope, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout,SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage) {
 
	$rootScope.currState = $state;
	$ionicPlatform.registerBackButtonAction(function (event, $state) {	
        if ( ($rootScope.currState.$current.name=="tab.waitingRoom") ||
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
	
	
	
	var dtNow = new Date("2015-05-26T13:20:04.268Z");
	
	$rootScope.time = dtNow.getTime();
	
	$rootScope.patientDisplay1 = 'none';
	$rootScope.patientDisplay = 'block';
	
	$scope.$on('timer-tick', function (event, args){
        $timeout(function() {
		console.log(args.minutes + ' - ' + args.seconds );
            if(args.millis < 100){
               // $rootScope.timeNew = 'Completed';
				$rootScope.timeNew = 'none';
			   $rootScope.timeNew1 = 'block';
			   $rootScope.patientDisplay = 'none';
			   $rootScope.patientDisplay1 = 'block';
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
			    $rootScope.patientDisplay = 'block';
			   $rootScope.patientDisplay1 = 'none';
				console.log('More than 10 minutes!');
            }
            
        });
    });
	
    $scope.$storage = $localStorage;
   
    
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
   
    $rootScope.StateText = "Select your state";
    $rootScope.CountryLists = CountryList.getCountryDetails();
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
    
 
    
    //$rootScope.StateList = StateLists.getStateDetails();
	$scope.currentYear = new Date().getFullYear()
      $scope.currentMonth = new Date().getMonth() + 1
      $scope.months = $locale.DATETIME_FORMATS.MONTH
      $scope.ccinfo = {type:undefined}
      $scope.save = function(data){
        if ($scope.paymentForm.$valid){
          console.log(data) // valid data saving stuff here
        }
      }
	
	$rootScope.Validation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$("#Error_Message").append(top);
				$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}
	
	$rootScope.CardValidation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon" ></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$("#Error_Message").append(top);
				$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}
	
	$scope.validation = function() {
		$scope.ErrorMessage = "Oops, something went wrong !";
		$rootScope.Validation($scope.ErrorMessage);
		
	};
	

//$rootScope.userLogin.UserEmail = 'ben.ross.310.95348@gmail.com';
    
    //$rootScope.userLogin.UserEmail = $localstorage.get('username');
    $('#UserEmail').val($localstorage.get('username'));
    
	$scope.userLogin = {};
    $scope.userLogin.UserEmail = $localStorage.oldEmail;
    $scope.LoginFunction = function(item,event){
		
		//$rootScope.UserEmail = $scope.userLogin.UserEmail;
		

		
		if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Please enter your email!";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			 $scope.ValidateEmail = function(email){
				var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				return expr.test(email);
			};
			
			if (!$scope.ValidateEmail($("#UserEmail").val())) {
				$scope.ErrorMessage = "Please enter a valid email address!";
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
					$scope.ErrorMessage = "We did not find an account associated with the email you entered.  Please try again!";
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
						});
					});	
						$state.go('tab.provider');
				}
				
				//console.log($rootScope.hospitalDetailsList);		
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
		
		LoginService.getFacilitiesList(params);
	}
	
	//$rootScope.providerId = $stateParams.providerID;
	//$rootScope.providerId ='126';
	
	$scope.ProviderFunction = function(hospitalDetailsDatas) {
        $rootScope.hospitalId = hospitalDetailsDatas.providerId;
        $rootScope.Hopital = hospitalDetailsDatas.name;
        $rootScope.logo = hospitalDetailsDatas.logo;
        $rootScope.operatingHours = hospitalDetailsDatas.operatingHours;
        $rootScope.id = hospitalDetailsDatas.id;
        $rootScope.brandColor = hospitalDetailsDatas.brandColor;
       // console.log($rootScope.hospitalId + ', ' + hospitalDetailsDatas.name + ', ' + hospitalDetailsDatas.logo + ', ' + hospitalDetailsDatas.operatingHours + ', ' + hospitalDetailsDatas.id + ', ' + hospitalDetailsDatas.brandColor)
        
		//$rootScope.hospitalId = '126';		
		//console.log($rootScope.hospitalId);			
		$state.go('tab.password');
	}
	
	//Password functionality

	//$scope.password = 'Password@123';
	$scope.pass = {};
	
	$scope.doGetToken = function () {
	
		if($('#password').val() == ''){
			$scope.ErrorMessage = "Please enter your password!";
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
						$scope.ErrorMessage = "The password you entered is incorrect.Please try again!";
						$rootScope.Validation($scope.ErrorMessage);
					} else {
						$scope.tokenStatus = 'alert-success';
						//$scope.doGetExistingConsulatation();
						$scope.doGetPatientProfiles();	
						$scope.doGetRelatedPatientProfiles();
						$state.go('tab.userhome');		
					}
				},
				error: function (data) {
					$scope.accessToken = 'Error getting access token';
					$scope.tokenStatus = 'alert-danger';
					console.log(data);
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
					console.log(data);
                    $scope.PasswordResetEmail = data;
					$state.go('tab.resetPassword');	
                },
                error: function (data) {
                    $scope.PasswordResetEmail = 'Error sending reset email';
                    console.log(data);
                }
            };
			
			LoginService.postSendPasswordResetEmail(params);
		}	
	

	$rootScope.patientId = 471;
	//$rootScope.patientId = 3056;
	$rootScope.consultationId = 2440;
	$scope.userId = 471;
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
					$rootScope.patientName = data.data[0].patientName;
					$rootScope.state = data.data[0].state;
					$rootScope.zipCode = data.data[0].zipCode;
					
					
					
					/*$rootScope.patientInfomation = [];	
					
						angular.forEach(data.data, function(index, item) {		
							$rootScope.patientInfomation.push({
								'id': index.$id,
								'account': angular.fromJson(index.account),
								'address': index.address,
								'addresses': angular.fromJson(index.addresses),
								'anatomy': angular.fromJson(index.anatomy),
								'city': index.city,
								'createDate': index.createDate,
								'dob': index.dob,
								'gender': index.gender,
								'homePhone': index.homePhone,
								'location': index.location,
								'mobilePhone': index.mobilePhone,
								'organization': index.organization,
								'patientName': index.patientName,
								'pharmacyDetails': angular.fromJson(index.pharmacyDetails),
								'physicianDetails': angular.fromJson(index.physicianDetails),
								'state': index.state,
								'zipCode': index.zipCode,
							});
						});	*/
						
						console.log($rootScope.patientInfomation);
				
						
				},
				error: function (data) {
					$scope.patientInfomation = 'Error getting Related Patient Profiles';
					console.log(data);
				}
			};
			
			LoginService.getPatientProfiles(params);
		}
	
	
	$scope.doGetRelatedPatientProfiles = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                patientID: $rootScope.patientId,
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
								'birthdate': new Date(index.birthdate),
								'addresses': angular.fromJson(index.addresses),
								'patientFirstName': index.patientFirstName,
								'patientLastName': index.patientLastName,
								'guardianFirstName': index.guardianFirstName,
								'guardianLastName': index.guardianLastName,
								'guardianName': index.guardianName,
							});
						});	
						
						 $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
						
				},
				error: function (data) {
					$scope.RelatedPatientProfiles = 'Error getting Related Patient Profiles';
					console.log(data);
				}
			};
			
			LoginService.getRelatedPatientProfiles(params);
		}
    
    
    
	$scope.doGetExistingConsulatation = function () {
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
               /* $rootScope.depedentInformation = data.data[0].dependentInformation;

                $rootScope.dependentDetails = [];	


                angular.forEach(data.data[0].dependentInformation, function(index, item) {	
                    $rootScope.dependentDetails.push({
                        'id': index.$id,
                        'patientName': index.fullName,
                        'lastName': index.lastName,
                        'age': index.age,
                        'guardianName': index.guardianName,
                        'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
                    });
                });	
                $rootScope.searchPatientList = $rootScope.dependentDetails;
            	*/
            },
            error: function (data) {
                $scope.existingConsultation = 'Error getting existing consultation';
				console.log(data);
            }
        };
        
        LoginService.getExistingConsulatation(params);
		
		
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
			patientId: $scope.otherPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				//$scope.patientHealthPlanList = data;
				
				if(data != '') {
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
							$rootScope.ApplyPlanPatientHealthPlanList = $rootScope.patientHealthPlanList;
							$rootScope.SelectedHealthPlan = $rootScope.ApplyPlanPatientHealthPlanList[data.data.length - 1];
							
							$rootScope.ApplyPlanPatientHealthPlanList.push({
								'insuranceCompany': 'Add a new health plan'
							});
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
				$scope.patientHealthPlanList = 'Error getting patient health plan list';
				console.log(data);
			}
		};

		LoginService.getPatientHealthPlansList(params);
	}
	
	
	 $("#addHealthPlan").change(function() {
        //console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new health plan') {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
             $rootScope.HealthPlanProvidersList = [];
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
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
                $scope.HealthPlanProvidersList = 'Error getting Health Plan Providers list';
                    console.log(data);
                }
            };
            LoginService.getHealthPlanProvidersList(params);
            
			//$state.go('tab.planDetails');
		}
    });
	
	$scope.healthPlanID = 124;
		//patientId
	/*	$scope.insuranceCompany = "aaa bbb";
		$scope.insuranceCompanyNameId = 1;
		$scope.isDefaultPlan = 'Y';
		$scope.insuranceCompanyPhone = '8888888888';
		$scope.memberName = 'Rinsoft';
		$scope.subsciberId = '505';
		$scope.policyNumber = '987654321'; //P20
		$scope.subscriberFirstName = 'Rin';
		$scope.subscriberLastName = 'Soft';
		$scope.subscriberDob = '2015-05-27T17:00:15.7010698-05:00';
		$scope.isActive = 'A';
		$scope.payerId = '471';  */
    
    
    $scope.AddHealth = {};
    $scope.doPostNewHealthPlan = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
        
    /*    angular.forEach($scope.ProviderList, function(index, item) {	
				    if($scope.ProviderList.payerId == $scope.AddHealth.Provider)
                    {
                     $rootScope.payerName = $scope.ProviderList.payerName;
                    $rootScope.payerID = $scope.ProviderList.id;       
                    }
		}); */
        
        $scope.insuranceCompany = $scope.AddHealth.Provider;
		$scope.insuranceCompanyNameId = 1;
		$scope.isDefaultPlan =  $scope.AddHealth.DefaultPlan;
		$scope.insuranceCompanyPhone = '8888888888';
		$scope.memberName = $scope.AddHealth.firstName + $scope.AddHealth.lastName;
		$scope.subsciberId = '505'; // patient id
		$scope.policyNumber = $scope.AddHealth.policyNumber;; //P20
		$scope.subscriberFirstName = $scope.AddHealth.firstName;
		$scope.subscriberLastName =  $scope.AddHealth.lastName;
		$scope.subscriberDob = $scope.AddHealth.dateBirth;
		$scope.isActive = 'A';
		$scope.payerId = '471'; 
        
			 var params = {
                accessToken: $rootScope.accessToken,
				healthPlanID: $scope.healthPlanID,
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
						console.log(data);						
						$scope.doGetPatientHealthPlansList();						
					} else {					
						$scope.ErrorMessage = data.message;
						$rootScope.CardValidation($scope.ErrorMessage);
						$state.go('tab.planDetails');
					}
				},
				error: function (data) {
					$scope.NewHealthPlan = 'Error posting Patient Profile';
					console.log(data);
				}
			};
			
			LoginService.postNewHealthPlan(params);
		}
	
	
	$scope.doGetExistingConsulatationReport = function () {	
		
			
		 if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $rootScope.existingConsultationReport = data.data[0];
					$state.go('tab.waitingRoom');
            },
            error: function (data) {
                $scope.existingConsultationReport = 'Error getting consultation report';
				console.log(data);
            }
        };
        
		LoginService.getConsultationFinalReport(params);
	}
	
	$scope.doGetExistingConsulatationReportReceipt = function () {	
		
		
		 if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $rootScope.existingConsultationReport = data.data[0];				
            },
            error: function (data) {
                $scope.existingConsultationReport = 'Error getting consultation report';
				console.log(data);
            }
        };
        
		LoginService.getConsultationFinalReport(params);
		
	}
	
	
	 $("#addNewCard").change(function() {
        console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new card') {
			$state.go('tab.cardDetails');
		}
    });
	$scope.doGetPatientPaymentProfilesConsultCharge = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Guardian) {
		
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        
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
						$scope.patientPaymentProfiles = data;	

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
						
						/*if(data.data.paymentProfiles.length > 0) {
							$rootScope.enableSubmitpayment = "block";
							$rootScope.disableSubmitpayment = "none;";
							//$rootScope.addPaymentCard = "none;";
						} else if(data.data.paymentProfiles.length == 0) {
							$rootScope.enableSubmitpayment = "none";
							$rootScope.disableSubmitpayment = "block;";
							//$rootScope.addPaymentCard = "block;";
						}*/
						$state.go('tab.consultChargeNoPlan');
					} else {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";
						$state.go('tab.consultChargeNoPlan');
					}		
					
				},
				error: function (data) {
					$scope.patientPaymentProfiles = 'Error getting patient payment profiles';
					console.log(data);
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		
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
						$scope.patientPaymentProfiles = data;	

						$rootScope.PaymentProfile = [];	
						
						
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
						
						/*if(data.data.paymentProfiles.length > 0) {
							$rootScope.enableSubmitpayment = "block";
							$rootScope.disableSubmitpayment = "none;";
							//$rootScope.addPaymentCard = "none;";
						} else if(data.data.paymentProfiles.length == 0) {
							$rootScope.enableSubmitpayment = "none";
							$rootScope.disableSubmitpayment = "block;";
							//$rootScope.addPaymentCard = "block;";
						}*/
						//$state.go('tab.consultChargeNoPlan');
					} else {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";
						//$state.go('tab.consultChargeNoPlan');
					}		
					
				},
				error: function (data) {
					$scope.patientPaymentProfiles = 'Error getting patient payment profiles';
					console.log(data);
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		
	}
	
	
	$scope.doGetPatientPaymentProfiles = function () {
	
		/*if($('#FirstName').val() == '' || $('#CardNumber').val() == '' || $('#date').val() == '' || $('#Cvv').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else {*/
		
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
						$scope.patientPaymentProfiles = data;	

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
						/*if(data.data.paymentProfiles.length > 0) {
							$rootScope.enableSubmitpayment = "block";
							$rootScope.disableSubmitpayment = "none;";
							//$rootScope.addPaymentCard = "none;";
						} else if(data.data.paymentProfiles.length == 0) {
							$rootScope.enableSubmitpayment = "none";
							$rootScope.disableSubmitpayment = "block;";
							//$rootScope.addPaymentCard = "block;";
						}*/
						//$state.go('tab.submitPayment');
						$rootScope.enableSubmitpayment = "block";
						$rootScope.disableSubmitpayment = "none;";						
						$state.go('tab.addCard');
					} else if(data == 0) {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";
						$state.go('tab.addCard');
					}
					
				},
				error: function (data) {
					$scope.patientPaymentProfiles = 'Error getting patient payment profiles';
					console.log(data);
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		//}
	}
	
	$scope.paymentProfileId = 28804398;	
	
	$rootScope.verifyCardDisplay = "none";
	$rootScope.cardDisplay = "inherit;";
	
	$scope.getCardDetails = {};  
	
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
    var ExpiryDate = $('#ExpireDate').val().split("/");        
           
    var currentTime = new Date()
    var ExpiryDateCheck = new Date();
        //var CurrentDate = $filter('date')(currentTime, 'MM-dd-yyyy').split("-");
        
    ExpiryDateCheck.setFullYear(ExpiryDate[1], ExpiryDate[0], 1);
	
	
	$scope.profileId = 31867222;
	
	
	
		
	$rootScope.FirstName = $scope.getCardDetails.FirstName;
	$rootScope.LastName = $scope.getCardDetails.LastName;
	$rootScope.CardNumber = $scope.getCardDetails.CardNumber;
	$rootScope.ccexpiry = $scope.getCardDetails.ccexpiry;
	$rootScope.Cvv = $scope.getCardDetails.Cvv;
	$rootScope.BillingAddress = $scope.getCardDetails.BillingAddress;
	$rootScope.City = $scope.getCardDetails.City;
	$rootScope.State = $scope.getCardDetails.State;	
	$rootScope.Zip = $scope.getCardDetails.CardZipCode;
	$rootScope.ExpiryMonth = ExpiryDate[0];
	$rootScope.ExpiryYear = ExpiryDate[1];
	$scope.Country = $scope.getCardDetails.Country;
	
	
	//$rootScope.Country = $scope.getCardDetails.;	
	
	
	
		
      
      if($('#FirstName').val() == '' || $('#LastName').val() == '' || $('#CardNumber').val() == '' || $('#datepicker').val() == '' || $('#Cvv').val() == '' || $('#BillingAddress').val() == '' ||  $('#City').val() == '' || $('#State').val() == ''|| $('#Zip').val() == '' )  {			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else if(zipCount <= 4) {
			$scope.ErrorMessage = "Verify Zip!";
			$rootScope.CardValidation($scope.ErrorMessage);
        } else if(ExpiryDate[0].length <= 1 || ExpiryDate[1].length <= 3 || ExpiryDate[0] >= 13) {
            $scope.ErrorMessage = "Verify Expiry Date!";
			$rootScope.CardValidation($scope.ErrorMessage);
        } else if(ExpiryDateCheck < currentTime) {
             $scope.ErrorMessage = "Verify month & year!";
			 $rootScope.CardValidation($scope.ErrorMessage);
        }
        else {
		
		
					
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
            userId: $scope.userId, 
			BillingAddress: $scope.BillingAddress,
			CardNumber: $scope.CardNumber,
			City: $scope.City,
			ExpiryMonth: $scope.ExpiryMonth,
			ExpiryYear: $scope.ExpiryYear,
			FirstName: $scope.FirstName,
			LastName: $scope.LastName,
			State: $scope.State,
			Zip: $scope.Zip,
			Country: $scope.Country,
			ProfileId: $scope.profileId,
			Cvv: $scope.Cvv,		
            accessToken: $rootScope.accessToken,
			
            success: function (data) {
                $scope.PostPaymentDetails = data;
				
				if(data.message == "Success")	{			
					console.log(data);
					$rootScope.verifyCardDisplay = "block";
					$rootScope.cardDisplay = "none;";
					$scope.doGetPatientPaymentProfilesCardDetails();
					$state.go('tab.submitPayment');
				} else {					
					$scope.ErrorMessage = data.message;
					$rootScope.CardValidation($scope.ErrorMessage);
					$state.go('tab.cardDetails');
				}
				
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
        
        LoginService.postPaymentProfileDetails(params);
		
		}
	}
	
	
	
	$scope.doGetCodesSet = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        
        // Start Intake Sub Header Information 
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
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
				$state.go('tab.patientConcerns');
			},
			error: function (data) {
				$scope.hospitalCodesList = 'Error getting hospital codes list';
				console.log(data);
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
	}

        $scope.doGetScheduledConsulatation = function (PatientId) {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
             $rootScope.scheduledConsultationList = [];
            var params = {
                patientId: PatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
					console.log(data);
                    $scope.scheduledConsultationList = data.data;
                    if(data != "")
                    $rootScope.scheduledList = [];
                    angular.forEach($scope.scheduledConsultationList, function(index, item) {	
						  $rootScope.scheduledList.push({							
							'id': index.$id,
							'scheduledTime': index.scheduledTime,
							'consultantUserId': index.consultantUserId,
							'consultationId': index.consultationId,
							'firstName': index.firstName,
							'lastName': index.lastName,	
							'assignedDoctorName': index.assignedDoctorName,
                            'patientName': index.patientName,
                            'patientUserId': index.patientUserId,
                            'scheduledId': index.scheduledId,    
						});
					});	
                     $state.go('tab.patientCalendar');
                },
                error: function (data) {
                    $scope.scheduledConsultationList = 'Error getting patient scheduled consultaion list';
                    console.log(data);
                }
            };

            LoginService.getScheduledConsulatation(params);
        }
		$rootScope.PlanDisplay = "inherit";
		$rootScope.verifyPlanDisplay = "none;";
		
	$scope.PlanDetailsValidation = function(model) {
		
		/*if($('#Provider').val() == '' || $('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){ */
        if($('#Provider').val() == '') {
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
        } else if($('#firstName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
        } else if($('#lastName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
		} else if($('#policyNumber').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
		} else if($('#date').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
		} else {
			$rootScope.verifyPlanDisplay = "block";
			$rootScope.PlanDisplay = "none;";			
			$scope.doPostNewHealthPlan();	
		}	
	}
	$scope.VerifyPlanDetailsValidation = function(model) {
		
		if($('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else {
			$state.go('tab.applyPlan');
		}	
	}
	
	
    $rootScope.SubmitCardValidation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon" ></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Error_Message").append(top);
				$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}

	$scope.ReceiptTimeout = function() {
	
		var currentTimeReceipt = new Date();
		
		currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
		
		$rootScope.ReceiptTime = currentTimeReceipt.getTime();
		
		setTimeout(function(){ $state.go('tab.waitingRoom');	 }, 10000);
	}
	
    
    $scope.doPostCoPayDetails = function () {
		
		if($('#addNewCard').val() == 'Choose Your Card'){			
			$scope.ErrorMessages = "Please select the credit card to be used for payment today!";
			$rootScope.SubmitCardValidation($scope.ErrorMessages);
			
		} else {
	
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				profileId: $scope.profileId, 
				emailAddress: $rootScope.UserEmail,
				Amount: 30,
				consultationId: $rootScope.consultationId,
				paymentProfileId: $scope.paymentProfileId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					$scope.CreditCardDetails = data;					
					$state.go('tab.receipt');	
					$scope.ReceiptTimeout();
					$scope.doGetExistingConsulatationReportReceipt();	
				},
				error: function (data) {
					$scope.CreditCardDetails = 'Error getting patient payment profiles';
					console.log(data);
				}
			};
			
			LoginService.postCoPayDetails(params);
		}
	}
    
    $scope.GoToPatientDetails = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian,P_Id) {
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
        $rootScope.PatientId = P_Id;
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
    
    $scope.doToWaitingRoom  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.waitingRoom'); 
    }
	 $scope.GoToConsultCharge  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.patientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.consultCharge'); 
    }
     
     $scope.GoToappoimentDetails = function(scheduledListData) {
       $rootScope.scheduledListDatas =scheduledListData;     
       $state.go('tab.appoimentDetails'); 
     };
	
	$rootScope.EnableBackButton = function () {     
        $state.go('tab.userhome');			
    };
   
})





// Controller to be used by all intake forms
.controller('IntakeFormsCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory, $filter, $rootScope, $state,SurgeryStocksListService) {
    
   
    $rootScope.limit = 4;
	$rootScope.Concernlimit = 1;
    $rootScope.checkedPrimary = 0;
    
 
  
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
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".PopupError_Message").append(top);
				$(".notifications-top-center").addClass('animated ' + 'bounce');
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
        angular.forEach($scope.PatientPrimaryConcernItem, function(item, index) {
           $rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
        });
         
        $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
        $scope.modal.hide();
        $scope.data.searchQuery = '';
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
					$scope.ErrorMessages = "Please enter the primary reason for today's visit.";
					$rootScope.PopupValidation($scope.ErrorMessages);
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
    
    
    $rootScope.ConcernsValidation = function($a){
        function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".Error_Message").append(top);
				$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
    
    $scope.PatientConcernsDirectory = function(){
        if($rootScope.IsValue == 0 || $rootScope.IsValue == undefined) {
            $scope.ErrorMessage = "Primary Concern Can't be Empty!";
			$rootScope.ConcernsValidation($scope.ErrorMessage);
            } else { $state.go('tab.ChronicCondition');
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
        angular.forEach($scope.PatientSecondaryConcernItem, function(item, index) {
            $rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
        });
        $scope.modal.hide();
        $scope.data.searchQuery = '';
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
            $scope.modal.show();
        }); 
    };
	
	
	$rootScope.ValidationFunction1 = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent">'+ $a +'</div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-close-round noticationIcon" ></span></div></div>';

			
				$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".ErrorMessage").append(top);
				$(".notifications-top-center").addClass('animated ' + 'bounce');
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
        if($scope.surgery.name == '' || $scope.surgery.name == undefined){
            $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.dateString == '' || $scope.surgery.dateString == undefined)) {
             $scope.ErrorMessage = "Please enter the date as MM/YYYY!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else {
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






.controller('ConferenceCtrl', function($scope, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService) {
    
	$scope.myVideoHeight = $window.innerHeight - 40;
    $scope.myVideoWidth = $window.innerWidth;
    $scope.otherVideoTop = $window.innerHeight - 150;
    $scope.controlsStyle = false;
    
    $scope.cameraPosition = "front";
    $scope.publishAudio = true;
    
    
    $scope.muteIconClass = 'ion-ios-mic callIcons';
    
    apiKey = "45217062"; 
      sessionId = "2_MX40NTIxNzA2Mn5-MTQzMDI5NDIzNjAxOX5qbnI1b0NLSjZXQXZ0VjJGOFhZckFzNjJ-fg"; 
      token = "T1==cGFydG5lcl9pZD00NTIxNzA2MiZzaWc9NTFhMjcwNzY4MzRhNTk3YTViZjlhNThlMDRmNDU2N2U5ODQzZWFjNjpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5USXhOekEyTW41LU1UUXpNREk1TkRJek5qQXhPWDVxYm5JMWIwTkxTalpYUVhaMFZqSkdPRmhaY2tGek5qSi1mZyZjcmVhdGVfdGltZT0xNDMwMjk0MjQ5Jm5vbmNlPTAuOTgxMzMwNzQ5MDM0MTQ0OSZleHBpcmVfdGltZT0xNDMyODg0NzA2JmNvbm5lY3Rpb25fZGF0YT0="; 
    
    var session = OT.initSession(apiKey, sessionId);
    var publisher;
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            subscribeToAudio: true,
            subscribeToVideo: true
        });
        //alert(' streamCreated ');
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
        }else{
            $scope.newCamPosition = "front";
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
    
    $scope.disconnectConference = function(){
        session.unpublish(publisher)
        //publisher.destroy();
        session.disconnect();
        $state.go('tab.ReportScreen');
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
     function calculateAge(birthday) { // birthday is a date
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }
     
     function monthDiff(d1, d2) {
       if (d1 < d2){
			if(d2.getMonth() > d1.getMonth())
			{
				var months = d2.getMonth() - d1.getMonth();
				//return months <= 0 ? 0 : months;
				return Math.abs(months <= 0 ? 0 : months);
			} else if(d2.getMonth() < d1.getMonth()) {
				var months = (12 - d1.getMonth()) + d2.getMonth();
				//return months <= 0 ? 0 : months;
				return Math.abs(months <= 0 ? 0 : months);
			}
       }
	  
       return 0;
     }


     return function(birthdate) { 
           var age = calculateAge(birthdate);
           if (age == 0) {
             return '0.' + monthDiff(birthdate, new Date()) + ' months';			
			} 
			return age;
     }; 
})

/*.directive('creditCardExpirationEntry', function() {
        return {
           require: 'ngModel',
           restrict: 'A',
            link: function (scope, element, attr, ngModelCtrl) {
              function fromUser(text) {
                var newVal = String(text);
                if(typeof oldLength != "undefined"){
                    if(oldLength != 3 && String(text).length == 2){
                       newVal = String(text) + "/";
                    }
                }
                if(String(text).length == 1){
                    oldLength = 7;
                }else{
                    oldLength = String(text).length;
                }
                  
                if(typeof newVal != "undefined" && newVal != ""){
                    scope.setValidccexpiry(true);
                }else { scope.setValidccexpiry(false); }
                scope.$apply();
                
                  
                ngModelCtrl.$setViewValue(newVal);
                ngModelCtrl.$render();
                return ngModelCtrl.newVal;
              }
              ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }) */


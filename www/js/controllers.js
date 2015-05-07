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

angular.module('starter.controllers', ['starter.services','ngLoadingSpinner'])


.controller('LoginCtrl', function($scope,$ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, IntakeLists, $state, $rootScope, $stateParams, SurgeryStocksSession, dateFilter, $timeout,SurgeryStocksListService) {
 
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	
	$rootScope.Validation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" >'+ $a +'<div id="notifications-top-center-close" class="close"><span class="ion-close-round" ></span></div></div>';

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
			
			var top = '<div id="notifications-top-center" style="height: 58px; line-height: 58px;" >'+ $a +'<div id="notifications-top-center-close" class="close"><span class="ion-close-round" ></span></div></div>';

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
	

	//Back Button	
	/*$scope.myGoBack = function() {
		$ionicHistory.goBack();
	}; */
	$rootScope.UserEmail = 'ben.ross.310.95348@gmail.com';
  
	$scope.userLogin = {};
    $scope.LoginFunction = function(item,event){
		//$rootScope.email = $scope.userLogin.email;
		$rootScope.UserEmail = $scope.UserEmail;
		//console.log($rootScope.UserEmail);
		
		if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Email ID can't be empty!";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			 $scope.ValidateEmail = function(email){
				var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
				return expr.test(email);
			};
			
			if (!$scope.ValidateEmail($("#UserEmail").val())) {
				$scope.ErrorMessage = "Invalid email address!";
				$rootScope.Validation($scope.ErrorMessage);
			}
			else {
				//alert("Valid email address.");
				$scope.doGetFacilitiesList();
				$state.go('tab.provider');
			}
		}
		
    };
	
	//$rootScope.providerId = $stateParams.providerID;
	//$rootScope.providerId ='126';
	
	$scope.ProviderFunction = function($hospitalId) {
		
		//$rootScope.hospitalId = $hospitalId;		
		$rootScope.hospitalId = '126';		
		//console.log($rootScope.hospitalId);			
		$state.go('tab.password');
	}
	
	//Password functionality

	$rootScope.password = 'Password@123';
	
	
	$scope.doGetToken = function () {
	
		if($('#password').val() == ''){
			$scope.ErrorMessage = "Password can't be empty!";
			$rootScope.Validation($scope.ErrorMessage);
		} else {
			
			var params = {
				email: $rootScope.UserEmail, 
				password: 'Password@123',
				userTypeId: 1,
				hospitalId: $rootScope.hospitalId,
				success: function (data) {
					$rootScope.accessToken = data.access_token;
					console.log($scope.accessToken);
					$scope.tokenStatus = 'alert-success';
					$scope.doGetExistingConsulatation();	
					$state.go('tab.userhome');		
					
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
	
 
	
	$rootScope.patientId = 471;
	$rootScope.consultationId = 2440;
	$scope.userId = 471;
	$scope.BillingAddress = '123 chennai';
	$scope.CardNumber = 4111111111111111;
	$scope.City = 'chennai';
	$scope.ExpiryMonth = 8;
	$scope.ExpiryYear = 2019;
	$scope.FirstName = 'Rin';
	$scope.LastName = 'Soft';
	$scope.State = 'Tamilnadu';
	$scope.Zip = 91302;
	$scope.Country = 'US';	
	$scope.Cvv = 123;
	$scope.profileId = 31867222;
	$scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns';
	
	
	
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
			
			$rootScope.consultionInformation = data.data.consultionInfo;
			$rootScope.patientInfomation = data.data.patientInfomation;	
			$rootScope.inTakeForm = data.data.inTakeForm;
			$rootScope.depedentInformation = data.data.depedentInformation;
			
			$rootScope.dependentDetails = [];	
			
			angular.forEach(data.data.depedentInformation, function(index, item) {	
				$rootScope.dependentDetails.push({
					'id': index.$id,
					'patientName': index.patientName,
					'lastName': index.lastName,
					'age': index.age,
					'guardianName': index.guardianName,
				});
			});	
			
			console.log($rootScope.dependentDetails);
				
            },
            error: function (data) {
                $scope.existingConsultation = 'Error getting existing consultation';
				console.log(data);
            }
        };
        
        LoginService.getExistingConsulatation(params);
		
		
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
	
	$scope.doGetPatientPaymentProfiles = function () {
	
		if($('#FirstName').val() == '' || $('#CardNumber').val() == '' || $('#date').val() == '' || $('#Cvv').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else {
		
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			
			var params = {
				hospitalId: $rootScope.hospitalId, 
				patientId: $rootScope.patientId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					$scope.patientPaymentProfiles = data;	

						$rootScope.paymentProfiles123 = [];	
				
				angular.forEach(data.data.paymentProfiles, function(index, item) {	
		
					
					$rootScope.paymentProfiles123.push({
						'id': index.$id,
						'billingAddress': angular.fromJson(index.billingAddress),
						'cardExpiration': index.cardExpiration,
						'cardNumber': index.cardNumber,
						'isBusiness': index.isBusiness,
						'profileID': index.profileID,
					});
				});	
				$state.go('tab.submitPayment');
					
				},
				error: function (data) {
					$scope.patientPaymentProfiles = 'Error getting patient payment profiles';
					console.log(data);
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		}
	}
	
	$scope.paymentProfileId = 28804398;
	
	$scope.doPostCoPayDetails = function () {
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
            },
            error: function (data) {
                $scope.CreditCardDetails = 'Error getting patient payment profiles';
				console.log(data);
            }
        };
        
        LoginService.postCoPayDetails(params);
	}
	
	
	$scope.doPostPaymentProfileDetails = function () {
		
		
		if($('#FirstName').val() == '' || $('#CardNumber').val() == '' || $('#date').val() == '' || $('#Cvv').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else {
					
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
					console.log(data);
					 $state.go('tab.verifyCard');  
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
        
        LoginService.postPaymentProfileDetails(params);
		
		}
	}
	
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
				
				$rootScope.hospitalDetails = [];
				angular.forEach(data.data, function(index, item) {	
					$rootScope.hospitalDetails.push({
						'id': index.$id,
						'hospital': index.hospital,
						'hospitalId': index.hospitalId,						
					});
				});	
				
				//console.log($rootScope.hospitalDetails);		
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
		
		LoginService.getFacilitiesList(params);
	}
	
	$scope.doGetCodesSet = function () {
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

        $scope.doGetScheduledConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                patientId: $scope.patientId,
                accessToken: $scope.accessToken,
                success: function (data) {
					console.log(data);
                    $scope.scheduledConsultationList = data;
                },
                error: function (data) {
                    $scope.scheduledConsultationList = 'Error getting patient scheduled consultaion list';
                    console.log(data);
                }
            };

            LoginService.getScheduledConsulatation(params);
        }
	$scope.PlanDetailsValidation = function(model) {
		
		if($('#Provider').val() == '' || $('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
			$rootScope.CardValidation($scope.ErrorMessage);
			
		} else {
			$state.go('tab.verifyPlan');
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
	
	
})

.controller('UserhomeCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory, $rootScope) {

    console.log($rootScope.hospitalId);
	console.log($rootScope.UserEmail);
	console.log($rootScope.password);


 $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
 /* $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }; */
})

.controller('UsersearchCtrl', function($scope,$ionicSideMenuDelegate, $ionicHistory) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
})



// Controller to be used by all intake forms
.controller('IntakeFormsCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory,PatientConcernsListService, IntakeLists, $filter, $rootScope, $state,SurgeryStocksSession,SurgeryStocksListService) {
    
    //$rootScope.Appointment = {};
    //$rootScope.Appointment.primaryConcern = "Hell";
    $rootScope.limit = 4;
	$rootScope.Concernlimit = 1;
    $rootScope.checkedPrimary = 0;
    
  /*  $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }; */
  
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

			$rootScope.PreviousDate = yyyy+'-'+mm+'-'+dd;
			console.log('dddd',$rootScope.PreviousDate);
    
	/*Primary concern Start here*/
	
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
                    item.checked = false;
    
    } 
	
  // Open text view for other primary concern
	$scope.openOtherPrimaryConcernView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          //template: '<input type="text" ng-model="data.PrimaryConcernOther">',
			template: '<textarea name="comment" id="comment-textarea" ng-model="data.PrimaryConcernOther" class="textAreaPop">',
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
					e.preventDefault();
				  } else {
                      angular.forEach($scope.primaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                      $scope.primaryConcernList.push({ text: $scope.data.PrimaryConcernOther, checked: true });
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
    
    $scope.PatientConcernsDirectory = function(){
    $state.go('tab.ChronicCondition');
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
                      $scope.secondaryConcernList.push({ text: $scope.data.SecondaryConcernOther, checked: true });
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
                      
                       $scope.chronicConditionList.push({ text: $scope.data.ChronicCondtionOther, checked: true });
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
                      $scope.MedicationAllegiesList.push({ text: $scope.data.MedicationAllergiesOther, checked: true });
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
                      $scope.CurrentMedicationList.push({ text: $scope.data.CurrentMedicationOther, checked: true });
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
			
			var top = '<div class="notifications-top-center" >'+ $a +'<div id="notifications-top-center-close" class="close"><span class="ion-close-round" ></span></div></div>';

			
				$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".Error_Message").append(top);
				$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    
    $scope.surgery = {};
    $scope.closeSurgeryPopup = function(model) {
		//$rootScope.LastName1 = $('#name').val();
		//$rootScope.datestr = $('#dateString').val();
		
		if($scope.surgery.name == '' || $scope.surgery.dateString == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty!";
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
      
      
    
     //Search Query
     $scope.clearSearch = function() {
		$scope.data.searchQuery = '';
     };
    
    //Search Query
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

.controller('PatientConcernsSelectCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicHistory) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  /*$scope.myGoBack = function() {
    $ionicHistory.goBack();
  }; */
})


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})







.controller('ConsentTreatCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	/*$scope.myGoBack = function() {
		$ionicHistory.goBack();
	}; */
})

.controller('addHealthPlanCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
	$ionicHistory.goBack();
	};
})

.controller('applyPlanCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
	$ionicHistory.goBack();
	};
})

.controller('addCardCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
})

.controller('consultChargeNoPlanCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
})

.controller('submitPaymentCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
})

.controller('receiptCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
})

.controller('waitingRoomCtrl', function($scope,$ionicSideMenuDelegate,$ionicHistory) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

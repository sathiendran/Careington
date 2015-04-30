var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
	  if (i in this && this[i] === item) return i;
	}
	return -1;
}

var util = {
	setHeaders: function(request, credentials) {
		if (typeof credentials != 'undefined') {
			request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
		}		
		request.defaults.headers['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
		request.defaults.headers['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
		return request;
	}
}

angular.module('starter.controllers', ['starter.services'])


.controller('LoginCtrl', function($scope,$ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, $state, $rootScope, $stateParams, SurgeryStocksSession, dateFilter, $timeout) {
 
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	//Back Button	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
	$rootScope.UserEmail = 'ben.ross.310.95348@gmail.com';
	
  
	$scope.userLogin = {};
    $scope.LoginFunction = function(item,event){
		//$rootScope.email = $scope.userLogin.email;
		$rootScope.UserEmail = $scope.UserEmail;
		//console.log($rootScope.UserEmail);
		$state.go('tab.provider');
    };
	
	//$rootScope.providerId = $stateParams.providerID;
	//$rootScope.providerId ='126';
	
	$scope.ProviderFunction = function($ProviderID) {
		
		//$rootScope.providerId = $ProviderID;		
		$rootScope.providerId = '126';		
		//console.log($rootScope.providerId);			
		$state.go('tab.password');
	}
	
	//Password functionality

	$rootScope.password = 'Password@123';
	
	
	$scope.doGetToken = function () {
        var params = {
            email: $rootScope.UserEmail, 
            password: 'Password@123',
            userTypeId: 1,
            hospitalId: $rootScope.providerId,
            success: function (data) {
                $rootScope.accessToken = data.access_token;
				console.log($scope.accessToken);
				$scope.tokenStatus = 'alert-success';
				$scope.doGetExistingConsulatation();
				
            },
            error: function (data) {
                $scope.accessToken = 'Error getting access token';
				$scope.tokenStatus = 'alert-danger';
				console.log(data);
            }
        };
        
        LoginService.getToken(params);
		
		$state.go('tab.userhome');
		
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
			
			console.log($rootScope.dependentDetails)
				
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
            },
            error: function (data) {
                $scope.existingConsultationReport = 'Error getting consultation report';
				console.log(data);
            }
        };
        
		LoginService.getConsultationFinalReport(params);
		$state.go('tab.waitingRoom');
	}
	
	$scope.doGetPatientPaymentProfiles = function () {
		
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            hospitalId: $rootScope.providerId, 
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
				
            },
            error: function (data) {
                $scope.patientPaymentProfiles = 'Error getting patient payment profiles';
				console.log(data);
            }
        };
        
        LoginService.getPatientPaymentProfile(params);
		$state.go('tab.submitPayment');
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
            },
            error: function (data) {
                $scope.CreditCardDetails = 'Error getting patient payment profiles';
				console.log(data);
            }
        };
        
        LoginService.postCoPayDetails(params);
		
		$state.go('tab.receipt');
	}
	
	
	$scope.doPostPaymentProfileDetails = function () {
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
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
        
        LoginService.postPaymentProfileDetails(params);
		 $state.go('tab.verifyCard');  
		
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
                $scope.PostPaymentDetails = data;				
            },
            error: function (data) {
                $scope.PostPaymentDetails = 'Error getting consultation report';
				console.log(data);
            }
        };
		
		LoginService.getFacilitiesList(params);
	}
	

  

	
	/*Chronic condition start here*/
	
	 $scope.devList = [
    { text: "This is a Chronic Conditions1", checked: false },
    { text: "This is a Chronic Conditions2", checked: false },
	{ text: "This is a Chronic Conditions3", checked: false },
	{ text: "This is a Chronic Conditions4", checked: false }
  ];
	
	$scope.getChronicConditionPopup = function() {
      
        $ionicModal.fromTemplateUrl('templates/tab-ChronicConditionList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }); 
    };


    $scope.closeChronicConditionPopup = function() {
        $scope.modal.hide();
    };


	/*Chronic condition END here*/
	
	
})

.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs, form) {
        form.$submitted = false;
        var fn = $parse(attrs.onValidSubmit);
        element.on('submit', function(event) {
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            if (form.$valid) {
              if (typeof fn === 'function') {
                fn(scope, {$event: event});
              }
            }
          });
        });
      }
    }
 
  }])
  .directive('validated', ['$parse', function($parse) {
    return {
      restrict: 'AEC',
      require: '^form',
      link: function(scope, element, attrs, form) {
        var inputs = element.find("*");
        for(var i = 0; i < inputs.length; i++) {
          (function(input){
            var attributes = input.attributes;
            if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
              var field = form[attributes.name.value];
              if (field != void 0) {
                angular.element(input).bind('blur',function(){
                  scope.$apply(function(){
                    field.$blurred = true;
                  })
                });
                scope.$watch(function() {
                  return form.$submitted + "_" + field.$valid + "_" + field.$blurred;
                }, function() {console.log(arguments);
                  if (!field.$blurred && form.$submitted != true) return;
                  var inp = angular.element(input);
                  if (inp.hasClass('ng-invalid')) {
                    element.removeClass('has-success');
                    element.addClass('has-error');
                  } else {
                    element.removeClass('has-error').addClass('has-success');
                  }
                });
              }
            }
          })(inputs[i]);
        }
      }
    }
  }])

.controller('UserhomeCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory, $rootScope) {

    console.log($rootScope.providerId);
	console.log($rootScope.UserEmail);
	console.log($rootScope.password);


 $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
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
.controller('IntakeFormsCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory,PatientConcernsListService, IntakeLists, $filter, $rootScope, $state,SurgeryStocksSession) {
    
    //$rootScope.Appointment = {};
    //$rootScope.Appointment.primaryConcern = "Hell";
    $scope.limit = 4;
    $scope.checkedChronic = 0;
    $scope.checkedAllergies = 0;
    $scope.checkedMedication = 0;
    
    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
  
    $scope.model = null;
    
	/*Primary concern Start here*/
	
    // Get list of primary concerns lists
    $scope.primaryConcernList = IntakeLists.getPrimaryConcerns();
    
    
    //$rootScope.PatientPrimaryConcern = "";
    
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
            //$scope.PatientPrimaryConcern = item.text;
            $rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
        });
        
        $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
        $scope.modal.hide();
    };
   
    
    // Onchange of primary concerns
    $scope.OnSelectPatientPrimaryConcern = function(position, primaryConcernList, item) {
        angular.forEach(primaryConcernList, function(item, index) {
            if (position != index) 
              item.checked = false;
        });
        if(item.text == "Other"){
            $scope.openOtherPrimaryConcernView();
        }
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
    }
	//console.log($rootScope.IsValue)
    
    $scope.PatientConcernsDirectory = function(){
    $state.go('tab.ChronicCondition');
    }
    
	/*Primary concern End here*/
	
	/*Secondary concern Start here*/
	
    // Get list of Secondary concerns lists
    $scope.secondaryConcernList = IntakeLists.getSecondaryConcerns();
    
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
    };
    
    
    // Onchange of Secondary concerns
    $scope.OnSelectPatientSecondaryConcern = function(position, secondaryConcernList, item) {
        angular.forEach(secondaryConcernList, function(item, index) {
            if (position != index) 
              item.checked = false;
        });
        if(item.text == "Other"){
            $scope.openOtherSecondaryConcernView();
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
    $scope.chronicConditionList = IntakeLists.getChronics();
    
    //$rootScope.PatientChronicCondition = [];
    
    // Open Chronic Condition popup
    $scope.loadChronicCondition = function() {
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
    $scope.modal.hide();    
    };
      
    
    // Onchange of Chronic Condition
    $scope.OnSelectChronicCondition = function(position, PatientChronicCondition, item) {
       if(item.text == "Other"){
            $scope.openOtherChronicConditionView();
        }
    }
	
   
    // Open text view for other Chronic Condition
	$scope.openOtherChronicConditionView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          //template: '<input type="text" ng-model="data.PrimaryConcernOther">',
			template: '<textarea name="comment" id="comment-textarea" ng-model="data.ChronicCondtionOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.chronicConditionList, function(item, index) {
                        item.checked = false;
                      });
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
                        item.checked = false;
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
          $scope.checkedChronic--;
    }
	
    $scope.checkChangedChronic = function(item){
        if(item.checked) $scope.checkedChronic++;
        else $scope.checkedChronic--;
    }
    
	/*Chronic Condition End here*/
    
    
    
  
    /*Medication Allegies Start here*/
	
    // Get list of Medication Allegies List
    $scope.MedicationAllegiesList = IntakeLists.getAllergies();
    
    //$scope.MedicationAllegies = "";
    
    //$rootScope.patinentMedicationAllergies = [];
    
    // Open Medication Allegies List popup
    $scope.loadMedicationAllegies = function() {
        
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
        $scope.modal.hide();
    };
    
      // Onchange of Medication Alligies
    $scope.OnSelectMedicationAllegies = function(position, MedicationAllegiesList, item) {
        if(item.text == "Other"){
            $scope.openOtherMedicationAllgiesView();
        }
    }
    
      // Open text view for other Medication Allergies
	$scope.openOtherMedicationAllgiesView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          //template: '<input type="text" ng-model="data.PrimaryConcernOther">',
			template: '<textarea name="comment" id="comment-textarea" ng-model="data.MedicationAllergiesOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.MedicationAllegiesList, function(item, index) {
                        item.checked = false;
                      });
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
                        item.checked = false;
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
      $scope.checkedAllergies--;
    }
	
     $scope.checkChangedAllergies = function(item){
        if(item.checked) $scope.checkedAllergies++;
        else $scope.checkedAllergies--;
    }
     
	/*Medication Allegies End here*/
    
    
      /*Current Medication Start here*/
	
    // Get list of Current Medication  List
    $scope.CurrentMedicationList = IntakeLists.getMedications();
    
    //$rootScope.patinentCurrentMedication = [];
    
    // Open Current Medication popup
    $scope.loadCurrentMedication = function() {
        
        $ionicModal.fromTemplateUrl('templates/tab-CurrentMedicationList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
	
     $scope.closeCurrentMedication = function() {
        $scope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
        $rootScope.patinentCurrentMedication = $scope.CurrentMedicationItem;
        $scope.modal.hide();
    };
    
      // Onchange of Current Medication
    $scope.OnSelectCurrentMedication = function(position, CurrentMedicationList, item) {
        if(item.text == "Other"){
            $scope.openOtherCurrentMedicationView();
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
                        item.checked = false;
                      });
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
                        item.checked = false;
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
      $scope.checkedMedication--;
    }
	
      $scope.checkChangedMedication = function(item){
        if(item.checked) $scope.checkedMedication++;
        else $scope.checkedMedication--;
    }
	/*Current Medication End here*/
    
    
    /* Prior Surgery page START */

	
   $scope.getSurgeryPopup = function() {
      
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
	
	$scope.patientSurgeries = [];
    $scope.surgery = {};
    $scope.closeSurgeryPopup = function(model) {	
	
		
        $scope.patientSurgeries.push($scope.surgery);
        console.log($scope.patientSurgeries);
        
       /* $scope.items.push({
            Name: $scope.surgery.name,
            Date: $scope.surgery.
        });

        // Clear input fields after push
        $scope.itemAmount = "";
        $scope.itemName = ""; */
		
        
		$state.go('tab.priorSurgeries');		
        $scope.modal.hide();
		
    };
	
	/* Prior Surgery page END */
      
      
    
     //Search Query
     $scope.clearSearch = function() {
		$scope.data.searchQuery = '';
     };
    
    //Search Query
     $scope.clearRootScopeConce = function() {
		$rootScope.PatientPrimaryConcern = "";
        $rootScope.PatientSecondaryConcern = "";
        $rootScope.PatientChronicCondition = "";
        $rootScope.patinentCurrentMedication = "";
        $rootScope.patinentMedicationAllergies = "";
        $scope.IsValue = "";
        $state.go('tab.patientDetail');
        $location.$$compose();
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
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
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
	
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
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

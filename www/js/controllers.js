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
	

  
/* Prior Surgery page START */

	$scope.model = null;
	$scope.rightButtons = [
        { 
			type: 'button-positive',  
			content: '<i class="icon ion-navicon"></i>',
			tap: function(e) {				
				$scope.openModal();				  
			}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/surgeryPopup.html', 
        function(modal) {
            $scope.modal = modal;
		},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
	
    $scope.openModal = function() {
        $scope.modal.show();
    };
	
	$scope.doLogin = function() {
	$state.go('tab.MedicationAllegies');	
	
	}
	
	
	$scope.surgery = {};
    $scope.closeSurgeryPopup = function(model) {	
	
		$scope.PreviousSurgeryLoadedList = SurgeryStocksSession.getSurgeryStocksSession();
				
		$scope.StockSurgery = [];
		
		angular.forEach($scope.PreviousSurgeryLoadedList, function(index, item) {			
			$scope.StockSurgery.push({
				 SurgeryName: index.SurgeryName,
				 SurgeryDate: index.surgeryDate
			});
		});	
		
	
		$rootScope.surgeryName = $scope.surgery.name;
		console.log($rootScope.surgeryName);
		
		 $scope.$watch('surgery.dateString', function (dateString)
			{
				$scope.date = new Date(dateString);
				 //alert('c ' + $scope.date);
				 alert('d '+ $scope.surgery.dateString);
				console.log('B', $scope.date, $scope.dateString);
				$rootScope.surgeryDate = $scope.surgery.dateString;
				alert($rootScope.surgeryDate);
			});
		
		$scope.StockSurgery.push({     
			 id: $scope.StockSurgery.length + 1,
            SurgeryName: $rootScope.surgeryName,
			SurgeryDate: $rootScope.surgeryDate
        });
		SurgeryStocksSession.setSurgeryStocksSession($scope.StockSurgery);
		
		 $scope.deleteSurgeryItem = function (index) {
			$scope.StockSurgery.splice(index, 1);
			}
		
		
       // $scope.modal.hide();
		$state.go('tab.priorSurgeries');		
		 $scope.modal.hide();
		 $scope.surgery.name = '';
		// $scope.surgery.dateString = '';
		
    };
	
	/* Prior Surgery page END */
	
	
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


.controller('PatientConcernCtrl', function($scope,$ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory,PatientConcernsListService) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
 $scope.model = null;
 $scope.devList = [
    { text: "Fever", checked: false },
    { text: "Vomiting", checked: false },
	{ text: "Headache", checked: false },
	{ text: "shortness of breath", checked: false }
  ];	
 $scope.rightButtons = [
        { 
   type: 'button-positive',  
   content: '<i class="icon ion-navicon"></i>',
   tap: function(e) {
    $scope.date = null;
    $scope.modal.scope.model = {description :"",amount :""};
    $scope.openModal();
      
	}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/tab-ConcernsList.html', 
        function(modal) {
            $scope.modal = modal;
	},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(model) {
        $scope.modal.hide();
    };
	
	$scope.OnSelectPatientConcerns = function(position, devList) {
      angular.forEach(devList, function(item, index) {
        if (position != index) 
          item.checked = false;
      });
    }
	
	$scope.SaveDesc = function(model) {
	$scope.data = {}
        $ionicPopup.show({
			template: '<input type="text" ng-model="data.wifi">',
			title: '<div style="float:right;">Enter Concerns<div>',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.wifi) {
					//don't allow the user to close unless he enters wifi password
					e.preventDefault();
				  } else {
					return $scope.data.wifi;
				  }
				}
			  }
			]
		  });
    };
})


.controller('ChronicConditionCtrl', function($scope, $ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory, $rootScope, ChronicStocksSession) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
 $scope.model = null;
 $scope.devList = [
    { text: "This is a Chronic Conditions1", checked: false },
    { text: "This is a Chronic Conditions2", checked: false },
	{ text: "This is a Chronic Conditions3", checked: false },
	{ text: "This is a Chronic Conditions4", checked: false }
  ];	
 $scope.rightButtons = [
        { 
   type: 'button-positive',  
   content: '<i class="icon ion-navicon"></i>',
   tap: function(e) {
    $scope.date = null;
    $scope.modal.scope.model = {description :"",amount :""};
    $scope.openModal();
      
	}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/tab-ChronicConditionList.html', 
        function(modal) {
            $scope.modal = modal;
	},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(model) {
        $scope.modal.hide();
    };
	
	$scope.OnSelectPatientConcerns = function(position, devList) {
	
		
		
		$rootScope.PreviousChronicLoadedList = ChronicStocksSession.getChronicStocksSession();
		
		$rootScope.chronicpatlist = [];
		
		 angular.forEach(PreviousChronicLoadedList, function(item, index) {      
				$rootScope.chronicpatlist.push({
						'text': index.text,
						'checked': index.checked,
						'index': item,					
					});
		
		  
			});
		
	
      angular.forEach(devList, function(item, index) {
       if (position == index) {
          //item.checked = false;
		 
				$rootScope.chronicpatlist.push({
						'text': item.text,
						'checked': item.checked,
						'index': index,					
					});
		}	
		  
      });
	  ChronicStocksSession.setChronicStocksSession($rootScope.chronicpatlist);
	  
    }
	
		
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

.controller('MedicationAllegiesCtrl', function($scope, $ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory) {
	 $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	  };
  
   $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
 $scope.model = null;
 $scope.devList = [
    { text: "This is a Medication Allergies", checked: false },
    { text: "This is a Medication Allergies", checked: false },
	{ text: "This is a Medication Allergies", checked: false },
	{ text: "This is a Medication Allergies", checked: false }
  ];	
 $scope.rightButtons = [
        { 
   type: 'button-positive',  
   content: '<i class="icon ion-navicon"></i>',
   tap: function(e) {
    $scope.date = null;
    $scope.modal.scope.model = {description :"",amount :""};
    $scope.openModal();
      
	}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/tab-MedicationAllegiesList.html', 
        function(modal) {
            $scope.modal = modal;
	},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(model) {
        $scope.modal.hide();
    };
 
})


.controller('CurrentMedicationCtrl', function($scope, $ionicSideMenuDelegate,$ionicModal,$ionicPopup,$ionicHistory) {
 	 $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	  };

  
   $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
 $scope.model = null;
 $scope.devList = [
    { text: "This is a Current Medication", checked: false },
    { text: "This is a Current Medication", checked: false },
	{ text: "This is a Current Medication", checked: false },
	{ text: "This is a Current Medication", checked: false }
  ];	
 $scope.rightButtons = [
        { 
   type: 'button-positive',  
   content: '<i class="icon ion-navicon"></i>',
   tap: function(e) {
    $scope.date = null;
    $scope.modal.scope.model = {description :"",amount :""};
    $scope.openModal();
      
	}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/tab-CurrentMedicationList.html', 
        function(modal) {
            $scope.modal = modal;
	},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(model) {
        $scope.modal.hide();
    };
 
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

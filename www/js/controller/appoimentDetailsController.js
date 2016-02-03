
angular.module('starter.controllers')


.controller('appoimentDetailsCtrl', function($scope, $ionicScrollDelegate, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	//$state.go('tab.appoimentDetails');
	//document.getElementsByTagName('timer')[0].stop();
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
		
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
	}
	
	$scope.enterWaitingRoom  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;	
		$rootScope.appointPatientGuardian = P_Guardian;	
		$rootScope.appointmentsPage = true;
		$scope.doCheckExistingConsulatationStatus();
        //$scope.doGetWaitingRoom();
    }
	$scope.doGetWaitingRoom = function() {
        $state.go('tab.waitingRoom');				
    }
	$rootScope.consultationId = $rootScope.scheduledListDatas.consultationId;
	var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;
	
	var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
	
	$rootScope.time = new Date(getReplaceTime).getTime();
	
	$scope.$on('timer-tick', function (event, args){
		//$timeout(function(){
		console.log('Timer tick events by Prabin');
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
		
		//console.log(args.millis);
		if(args.millis < 600){

		  $('.AvailableIn').hide();
			$('.enterAppoinment').show();
			 $rootScope.timerCOlor = '#E1FCD4';
		} else if(args.millis > 600){
			$('.AvailableIn').show();
			$('.enterAppoinment').hide();	
		}
		/*else if(args.millis < 1800000){
		   $('.AvailableIn').hide();
			$('.enterAppoinment').show();
		   $rootScope.timerCOlor = '#E1FCD4';
		   
		}else if(args.millis > 1800000){
		  $rootScope.timeNew = 'block';
		   $rootScope.timeNew1 = 'none';
			$('.AvailableIn').show();
			$('.enterAppoinment').hide();		   
		}*/
		//},1000);
	});
	$scope.showEnterWaitingRoomButton = function(){
		$rootScope.timeNew = 'none';
		$rootScope.timeNew1 = 'block';
		$('.AvailableIn').hide();
		$('.enterAppoinment').show();
	};
	$timeout(function() {   
		
	}, 100);
	
	var d = new Date();
	//d.setHours(d.getHours() + 12);
	
	var currentUserHomeDate = CustomCalendar.getLocalTime(d);
	
	if(getReplaceTime < currentUserHomeDate){
		$rootScope.timeNew = 'none';
		$rootScope.timeNew1 = 'block';
		$('.AvailableIn').hide();
		$('.enterAppoinment').show();	
		$rootScope.timerCOlor = '#E1FCD4';
	}
	$scope.doCheckExistingConsulatationStatus = function () {
		
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
				//Get Hospital Information
				$rootScope.patientId = $rootScope.appointmentsPatientId;
				
				if($rootScope.primaryPatientId !=  $rootScope.patientId) 
				{
					$rootScope.PatientGuardian = $rootScope.appointPatientGuardian;
				}
				
				//alert($rootScope.patientId);
				$rootScope.consultationAmount = $rootScope.consultionInformation.consultationAmount;
				$rootScope.copayAmount = $rootScope.consultationAmount;	
				
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
					if($rootScope.consultationStatusId == 71 ) {
						navigator.notification.alert(
							'Your consultation is already started on other device.',  // message
							function(){ $state.go('tab.userhome'); return;},
							'Dokita247',            // title
							'Done'                  // buttonName
						);
						return false;
					} else if($rootScope.consultationStatusId == 72 ) {
						navigator.notification.alert(
							'Your consultation is already ended.',  // message
							function(){ $state.go('tab.userhome'); return;},
							'Dokita247',            // title
							'Done'                  // buttonName
						);
						return false;
					} else if($rootScope.consultationStatusId == 79 ) {
						navigator.notification.alert(
							'Your consultation is cancelled.',  // message
							function(){ $state.go('tab.userhome'); return;},
							'Dokita247',            // title
							'Done'                  // buttonName
						);
						return false;
					} else if($rootScope.consultationStatusId == 80 ) {
						navigator.notification.alert(
							'Your consultation is in progress on other device.',  // message
							function(){ $state.go('tab.userhome'); return;},
							'Dokita247',            // title
							'Done'                  // buttonName
						);
						return false;
					} else {
						$state.go('tab.ConsentTreat');
						//$scope.doGetWaitingRoom();

					}
						
				}
				
               
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
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
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
						if($rootScope.consultationStatusId == 71 ) {
							navigator.notification.alert(
								'Your consultation is already started on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Dokita247',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 72 ) {
							navigator.notification.alert(
								'Your consultation is already ended.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Dokita247',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 79 ) {
							navigator.notification.alert(
								'Your consultation is cancelled.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Dokita247',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 80 ) {
							navigator.notification.alert(
								'Your consultation is in progress on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Dokita247',            // title
								'Done'                  // buttonName
							);
							return false;
						}
						
				}
				
				
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
				 $rootScope.intakeForm = data.data[0].intakeForm;
				$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
				$rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
				$rootScope.appointmentsPatientGurdianName = angular.element('<div>').html($rootScope.patientExistInfomation.guardianName).text();
				$rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
				$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
				$rootScope.reportScreenPrimaryConcern = angular.element('<div>').html($rootScope.intakeForm.concerns[0].customCode.description).text();
				$rootScope.reportScreenSecondaryConcern = angular.element('<div>').html($rootScope.intakeForm.concerns[1].customCode.description).text();
				if($rootScope.reportScreenSecondaryConcern == "") {
					$rootScope.reportScreenSecondaryConcern = "None Reported";
				}
				if(typeof $rootScope.consultionInformation.note != 'undefined') {
					$rootScope.preConsultantNotes = angular.element('<div>').html($rootScope.consultionInformation.note).text();				
				} else {
					$rootScope.preConsultantNotes = '';
				}
				$scope.doGetExistingPatientName();
				$scope.doGetDoctorDetails();
               
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
				$rootScope.appointmentsPatientFirstName = angular.element('<div>').html(data.data[0].patientName).text();	
				$rootScope.appointmentsPatientLastName = angular.element('<div>').html(data.data[0].lastName).text();		 
					
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getPrimaryPatientLastName(params);
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
				document.getElementsByTagName('timer')[0].stop();
				document.getElementsByTagName('timer')[0].start();
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getDoctorDetails(params);	
		
	}
	
	
	$scope.doGetExistingConsulatation();  
	//$scope.doGetExistingConsulatationReport();
	
	
})

angular.module('starter.controllers')



.controller('patientCalendarCtrl', function($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	
	
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
	
	//$rootScope.getIndividualScheduleDetails = $filter('filter')($rootScope.scheduledList, {patientId:$rootScope.selectedPatientIdForDetails});
	$rootScope.getIndividualScheduleDetails = $rootScope.individualScheduledList;
	
	var d = new Date();
	d.setHours(d.getHours() + 12);
	var currentUserHomeDate = CustomCalendar.getLocalTime(d);
	
	$scope.doRefresh = function() {
		$rootScope.doGetScheduledConsulatation();
		$rootScope.doGetIndividualScheduledConsulatation();
		$timeout( function() {
			$scope.$broadcast('scroll.refreshComplete');
		 }, 1000);
		$scope.$apply();	
	};
	
	/*$scope.doGetScheduledConsulatation = function () {
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
					//var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");
						
											
					angular.forEach($scope.scheduledConsultationList, function(index, item) {							
						if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
							 $rootScope.scheduledList.push({							
								'id': index.$id,
								'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
								'consultantUserId': index.consultantUserId,
								'consultationId': index.consultationId,
								'patientFirstName': htmlEscapeValue.getHtmlEscapeValue(index.patientFirstName), 
								'patientLastName': htmlEscapeValue.getHtmlEscapeValue(index.patientLastName),
								'assignedDoctorName': htmlEscapeValue.getHtmlEscapeValue(index.assignedDoctorName),
								'patientName': htmlEscapeValue.getHtmlEscapeValue(index.patientName),
								'patientId': index.patientId,
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
						$rootScope.getIndividualScheduleDetails = $filter('filter')($rootScope.scheduledList, {patientId:$rootScope.selectedPatientIdForDetails});
						
						var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
						var currentUserHomeDate = currentUserHomeDate;
						
						if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
							console.log('scheduledTime <= getTwelveHours UserHome');
							$rootScope.nextAppointmentDisplay = 'block';
							$rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
							 $rootScope.timerCOlor = '#FEEFE8';
							var beforAppointmentTime = 	getReplaceTime;
							var doGetAppointmentTime =  $scope.addMinutes(beforAppointmentTime, -30);
							if((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime()))
							{
								$rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
								 $rootScope.timerCOlor = '#E1FCD4';
							}
						}
						if($rootScope.getIndividualScheduleDetails !='') {		
							var getReplaceTime1 = $rootScope.getIndividualScheduleDetails[0].scheduledTime;	
							var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
							var currentUserHomeDate = currentUserHomeDate;		
							if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {	
								
								$rootScope.time = new Date(getReplaceTime).getTime();
								
								 $timeout(function() {  
									document.getElementsByTagName('timer')[0].stop();
									document.getElementsByTagName('timer')[0].start();
								}, 10);
									
								$scope.$on('timer-tick', function (event, args){
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
									
								
									if(args.millis < 600){
										$rootScope.timeNew = 'none';
									   $rootScope.timeNew1 = 'block';
									   $rootScope.timerCOlor = '#E1FCD4';
									} else if(args.millis > 600){
										$rootScope.timeNew = 'block';
										$rootScope.timeNew1 = 'none';
										$rootScope.timerCOlor = '#FEEFE8';
									}									
								});
								$rootScope.time = new Date(getReplaceTime).getTime();
								
								var d = new Date();
								
								var currentUserHomeDate = CustomCalendar.getLocalTime(d);
								
								if(getReplaceTime < currentUserHomeDate){
									 $rootScope.timerCOlor = '#E1FCD4';
								}
							} else if((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
								$rootScope.timerCOlor = 'transparent';
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
	}*/
	
	$rootScope.doGetAppointmentConsultationId = function(appointmentId, personId, nextPage) {			
		 var params = {
			accessToken: $rootScope.accessToken,
			AppointmentId: appointmentId,
			personID: personId,					
			success: function (data) {					
				$rootScope.consultationId = data.data[0].consultationId;
				//$rootScope.doGeAppointmentExistingConsulatation();
				$rootScope.appointmentDisplay = "test";
				$scope.$root.$broadcast("callAppointmentConsultation");
				//$state.go(nextPage);
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation()
			}
		};
			
		LoginService.postGetConsultationId(params);
	}

	$scope.GoToappoimentDetails = function(scheduledListData) {
		//$state.go('tab.appoimentDetails');
		$rootScope.scheduledListDatas = scheduledListData;	
		$rootScope.appointPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[0].customCode.description);
		$rootScope.appointSecondConcern = $rootScope.scheduledListDatas.intakeMetadata.concerns[1];
		if($rootScope.appointSecondConcern == '' || typeof $rootScope.appointSecondConcern == 'undefined') {
			$rootScope.appointSecondConcern = 'None Reported';
		} else {
			$rootScope.appointSecondConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[1].customCode.description);
		}
		$rootScope.appointNotes = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.additionalNotes);
		if($rootScope.appointNotes == '' || typeof $rootScope.appointNotes == 'undefined') {
			$rootScope.appointNotes = 'None Reported';
		} else {
			$rootScope.appointNotes = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.additionalNotes);
		}
		$rootScope.doGetAppointmentConsultationId($rootScope.scheduledListDatas.appointmentId, $rootScope.scheduledListDatas.participants[0].person.id, 'tab.appoimentDetails');	
	};
	
	if($rootScope.getIndividualScheduleDetails !='') {		
		var getReplaceTime2 = $rootScope.getIndividualScheduleDetails[0].scheduledTime;	
		var getReplaceTime3 = $scope.addMinutes(getReplaceTime2, -30);
		var currentUserHomeDate = currentUserHomeDate;		
		if((new Date(getReplaceTime3).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
			$scope.$on('timer-tick', function (event, args){
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
			
				if(args.millis < 600){
					$rootScope.timeNew = 'none';
				   $rootScope.timeNew1 = 'block';
				   $rootScope.timerCOlor = '#E1FCD4';
				} else if(args.millis > 600){
					$rootScope.timeNew = 'block';
				    $rootScope.timeNew1 = 'none';
				    $rootScope.timerCOlor = '#FEEFE8';
				}
				/*else if(args.millis < 600000){
				   $rootScope.timeNew = 'none';
				   $rootScope.timeNew1 = 'block';
				   $rootScope.timerCOlor = '#E1FCD4';
				}else if(args.millis > 600000){
					$rootScope.timeNew = 'block';
				   $rootScope.timeNew1 = 'none';
					$rootScope.timerCOlor = '#FEEFE8';
				}*/
				
			});
			$rootScope.time = new Date(getReplaceTime3).getTime();
			
			 $timeout(function() {  				
				document.getElementsByTagName('timer')[0].start();
			}, 10);
			
			var d = new Date();
			
			var currentUserHomeDate = CustomCalendar.getLocalTime(d);
			
			if(getReplaceTime3 < currentUserHomeDate){
				 $rootScope.timerCOlor = '#E1FCD4';
			}
		} else if((new Date(getReplaceTime3).getTime()) >= (new Date(d).getTime())) {
			$rootScope.timerCOlor = 'transparent';
		}	
	}
	
})



angular.module('starter.controllers')

.controller('ConferenceCtrl', function($scope, ageFilter, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService, $localstorage) {
    
    $scope.doGetExistingConsulatation = function () {
		$rootScope.consultionInformation = '';
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
		if ($rootScope.accessToken == 'No Token') {
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
						if($rootScope.consultationStatusId == 72 ) {
							$scope.doGetExistingConsulatationReport();
						}						
				}
               
            },
            error: function (data) {
              //  $rootScope.serverErrorMessageValidation();
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
				//$('#subscriber .OT_video-container').css('background-color', 'transparent');
				//$('#publisher .OT_video-container').css('background-color', 'transparent');
                $rootScope.existingConsultationReport = data.data[0].details[0]	;
				/*if($rootScope.existingConsultationReport.organization !='' && typeof $rootScope.existingConsultationReport.organization != 'undefined')
				{
					$rootScope.userReportOrganization = angular.element('<div>').html($rootScope.existingConsultationReport.organization).text();
				} else {
					$rootScope.userReportOrganization = '';
				}
				if($rootScope.existingConsultationReport.location !='' && typeof $rootScope.existingConsultationReport.location != 'undefined')
				{
					$rootScope.reportLocation = angular.element('<div>').html($rootScope.existingConsultationReport.location).text();
				} else {
					$rootScope.reportLocation = '';
				}*/
				
				if($rootScope.existingConsultationReport.height !='' && typeof $rootScope.existingConsultationReport.height != 'undefined')
				{
					$rootScope.reportHeight = $rootScope.existingConsultationReport.height +" "+$rootScope.existingConsultationReport.heightUnit;
				} else {
					$rootScope.reportHeight = 'NA';
				}
				
				if($rootScope.existingConsultationReport.weight !='' && typeof $rootScope.existingConsultationReport.weight != 'undefined')
				{
					$rootScope.reportWeight = $rootScope.existingConsultationReport.weight +" "+$rootScope.existingConsultationReport.weightUnit;
				} else {
					$rootScope.reportWeight = 'NA';
				}
				$rootScope.reportPatientName = angular.element('<div>').html($rootScope.existingConsultationReport.patientName).text();
				$rootScope.reportLastName = angular.element('<div>').html($rootScope.existingConsultationReport.lastName).text();
				
				if($rootScope.existingConsultationReport.patientAddress !='' && typeof $rootScope.existingConsultationReport.patientAddress != 'undefined')
				{
					$rootScope.reportPatientAddress = angular.element('<div>').html($rootScope.existingConsultationReport.patientAddress).text();
				} else {
					$rootScope.reportPatientAddress = 'None Reported';
				}
				
				if($rootScope.existingConsultationReport.homePhone !='' && typeof $rootScope.existingConsultationReport.homePhone != 'undefined')
				{
					$rootScope.reportHomePhone = angular.element('<div>').html($rootScope.existingConsultationReport.homePhone).text();
				} else {
					$rootScope.reportHomePhone = 'NA';
				}
				
				if($rootScope.existingConsultationReport.hospitalAddress !='' && typeof $rootScope.existingConsultationReport.hospitalAddress != 'undefined')
				{
					$rootScope.reportHospitalAddress = angular.element('<div>').html($rootScope.existingConsultationReport.hospitalAddress).text();
				} else {
					$rootScope.reportHospitalAddress = 'None Reported';
				}
				
				if($rootScope.existingConsultationReport.doctorFirstName !='' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined')
				{
					$rootScope.reportDoctorFirstName = angular.element('<div>').html($rootScope.existingConsultationReport.doctorFirstName).text();
				} else {
					$rootScope.reportDoctorFirstName = 'None Reported';
				}
				if($rootScope.existingConsultationReport.medicalSpeciality !='' && typeof $rootScope.existingConsultationReport.medicalSpeciality != 'undefined')
				{
					$rootScope.reportMedicalSpeciality = ', ' + angular.element('<div>').html($rootScope.existingConsultationReport.medicalSpeciality).text();
				} else {
					$rootScope.reportMedicalSpeciality = '';
				}
				
				if($rootScope.existingConsultationReport.doctorFirstName !='' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined')
				{
					$rootScope.reportDoctorLastName = angular.element('<div>').html($rootScope.existingConsultationReport.doctorLastName).text();
				} else {
					$rootScope.reportDoctorLastName = 'None Reported';
				}
			
				if($rootScope.existingConsultationReport.rx !='' && typeof $rootScope.existingConsultationReport.rx != 'undefined') {
					$rootScope.reportrx = angular.element('<div>').html($rootScope.existingConsultationReport.rx).text();
				} else {
					$rootScope.reportrx = 'None Reported';
				}
				
				var startTimeISOString =  $rootScope.existingConsultationReport.consultationDate;
				 var startTime = new Date(startTimeISOString );
				 $rootScope.consultationDate =   new Date( startTime.getTime() + ( startTime.getTimezoneOffset() * 60000 ) );
				
		if($rootScope.existingConsultationReport.consultationDuration != 0 && typeof $rootScope.existingConsultationReport.consultationDuration != 'undefined')	
			{
					$rootScope.displayCOnsultationDuration = "display";
				   var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
					var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
					if(consultationMinutes == 0){
						$rootScope.consultDurationMinutes = '00';
					} else if(consultationMinutes < 10) {
						$rootScope.consultDurationMinutes = '0' + consultationMinutes;
					} else {
						$rootScope.consultDurationMinutes = consultationMinutes;
					}
					
					if(consultationSeconds == 0){ 
						$rootScope.consultDurationSeconds = '00';
					} else if(consultationSeconds < 10) {
						$rootScope.consultDurationSeconds = '0' + consultationSeconds;
					} else {
						$rootScope.consultDurationSeconds = consultationSeconds;
					}
			} else {
				$rootScope.displayCOnsultationDuration = "none";
			}
				
				$rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;					
				$rootScope.reportScreenPrimaryConcern = angular.element('<div>').html($rootScope.existingConsultationReport.primaryConcern).text();
				if(typeof $rootScope.reportScreenPrimaryConcern != 'undefined') {
					var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
					if(n < 0) {
						$rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
					} else {
						$rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
						$rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
					}
				} else {
					$rootScope.reportScreenPrimaryConcern = "";
				}
				$rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
				if(typeof $rootScope.reportScreenSecondaryConcern != 'undefined') {
					var n = $rootScope.reportScreenSecondaryConcern.indexOf("?");
					if(n < 0) {
						$rootScope.reportScreenSecondaryConcern = angular.element('<div>').html($rootScope.reportScreenSecondaryConcern).text();
					} else {
						$rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
						$rootScope.reportScreenSecondaryConcern = angular.element('<div>').html($rootScope.reportScreenSecondaryConcern1[1]).text();
					}
				} else {
					$rootScope.reportScreenSecondaryConcern = "None Reported";
				}
				$rootScope.intake = $rootScope.existingConsultationReport.intake;
				
				$rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;
					if($rootScope.fullTerm == 'N') { $rootScope.fullTerm = 'No'; } else if($rootScope.fullTerm == 'T') { $rootScope.fullTerm = 'True'; } 
				
				$rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
					if($rootScope.vaginalBirth == 'N') { $rootScope.vaginalBirth = 'No'; } else if($rootScope.vaginalBirth == 'T') { $rootScope.vaginalBirth = 'True'; } 
				
				$rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
					if($rootScope.dischargedWithMother == 'N') { $rootScope.dischargedWithMother = 'No'; } else if($rootScope.dischargedWithMother == 'T') { $rootScope.dischargedWithMother = 'True'; } 
				
				$rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
					if($rootScope.vaccinationsCurrent == 'N') { $rootScope.vaccinationsCurrent = 'No'; } else if($rootScope.vaccinationsCurrent == 'T') { $rootScope.vaccinationsCurrent = 'True'; } 
				
				var usDOB = ageFilter.getDateFilter($rootScope.existingConsultationReport.dob);
				$rootScope.userReportDOB = usDOB.search("y");
								
				
				$rootScope.gender = data.data[0].details[0].gender;
				if(data.data[0].details[0].gender !='' && typeof data.data[0].details[0].gender != 'undefined')
				{
					if($rootScope.gender == 'M') { $rootScope.gender = 'Male'; } else if($rootScope.gender == 'F') { $rootScope.gender = 'Female'; } 
				} else {
					$rootScope.gender = 'NA';
				}
				
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
					
					$localstorage.set('ChkVideoConferencePage', ""); 	
				session = null; 
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
                consultationId: $rootScope.consultationId, 
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.SoapNote = data.data;					
					if($rootScope.SoapNote.subjective !='' && typeof $rootScope.SoapNote.subjective != 'undefined') {
						$rootScope.reportSubjective = angular.element('<div>').html($rootScope.SoapNote.subjective).text();
					} else {
						$rootScope.reportSubjective = 'None Reported';
					}
					
					if($rootScope.SoapNote.objective !='' && typeof $rootScope.SoapNote.objective != 'undefined') {
						$rootScope.reportObjective = angular.element('<div>').html($rootScope.SoapNote.objective).text();
					} else {
						$rootScope.reportObjective = 'None Reported';
					}
					
					if($rootScope.SoapNote.assessment !='' && typeof $rootScope.SoapNote.assessment != 'undefined') {
						$rootScope.reportAssessment = angular.element('<div>').html($rootScope.SoapNote.assessment).text();
					} else {
						$rootScope.reportAssessment = 'None Reported';
					}
					
					if($rootScope.SoapNote.plan !='' && typeof $rootScope.SoapNote.plan != 'undefined') {
						$rootScope.reportPlan = angular.element('<div>').html($rootScope.SoapNote.plan).text();
					} else {
						$rootScope.reportPlan = 'None Reported';
					}
					
                },
                error: function (data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
			
			LoginService.getPatientsSoapNotes(params);
		}
    
    
	/*if(session != null) {		 
		session.unpublish(publisher);
		session.disconnect();
		 session = null; 
         $scope.doGetExistingConsulatation();
	}*/
    $scope.doGetExistingConsulatation();
	
	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnvLogout == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnvLogout == "Single"){
			$state.go('tab.singleTheme');		
		}else{
			$state.go('tab.login');
		}
	}
    
    $localstorage.set('ChkVideoConferencePage', "videoConference"); 
    
    if(!angular.isUndefined($rootScope.consultationStatusId) || $rootScope.consultationStatusId != 72) 
    {    
	  
                var connection = $.hubConnection();
                    //debugger;
                var conHub = connection.createHubProxy('consultationHub');
                
                var initConferenceRoomHub = function () {
                    
                    connection.url = $rootScope.APICommonURL + "/api/signalR/";
                    var consultationWatingId = +$rootScope.consultationId;
                    
                    // var conHub = $.connection.consultationHub;
                    connection.qs = {
                            "Bearer": $rootScope.accessToken,
                            "consultationId": consultationWatingId,
                            "isMobile" : true
                        };
                        conHub.on("onConsultationReview", function () {
                            $rootScope.waitingMsg = "The clinician is now reviewing the intake form.";
                        });
                        conHub.on("onCustomerDefaultWaitingInformation",function () {
                            $rootScope.waitingMsg = "Please Wait....";
                        });
                        conHub.on("onConsultationStarted",function () {
                        $rootScope.waitingMsg = "Please wait...";
                        });
                        connection.logging = true;
                        connection.start({
                            withCredentials :false
                        }).then(function(){
                            conHub.invoke("joinCustomer").then(function(){
                            });
                            $rootScope.waitingMsg="The Clinician will be with you Shortly.";
                        });
                        conHub.on("onConsultationEnded",function () {
                            $scope.disconnectConference();
                        });
                };
                initConferenceRoomHub();
                
                $rootScope.clinicianVideoHeight = $window.innerHeight - 38;
                $rootScope.clinicianVideoWidth = $window.innerWidth;
                
                $rootScope.clinicianVideoHeightScreen = ($window.innerWidth / 16) * 9;
                        
                $rootScope.patientVideoTop = $window.innerHeight - 150;
                $rootScope.controlsStyle = false;
                
                $rootScope.cameraPosition = "front";
                $rootScope.publishAudio = true;
                
                
                $rootScope.muteIconClass = 'ion-ios-mic callIcons';
                $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
                
                var apiKey = $rootScope.videoApiKey;
                var sessionId = $rootScope.videoSessionId;
                var token = $rootScope.videoToken;
                /*
                var apiKey = "45191172";
                var sessionId = "1_MX40NTE5MTE3Mn5-MTQzOTQ2MDk3ODA4OH5wSEpoU091NXJkK01sZzFoUDV4aXhVWWh-fg";
                var token = "T1==cGFydG5lcl9pZD00NTE5MTE3MiZzaWc9MzAyOTYzMTExMGJkYTJhYmI3MDMwNTNiM2Q4MWM5ZjU1ZWZkNjlkODpzZXNzaW9uX2lkPTFfTVg0ME5URTVNVEUzTW41LU1UUXpPVFEyTURrM09EQTRPSDV3U0Vwb1UwOTFOWEprSzAxc1p6Rm9VRFY0YVhoVldXaC1mZyZjcmVhdGVfdGltZT0xNDM5NDYwOTc1Jm5vbmNlPTcwNDQzJnJvbGU9UFVCTElTSEVS";
                */
                session = OT.initSession(apiKey, sessionId);
                //var publisher;
                
                        
                session.on('streamCreated', function(event) { 		
                    //alert('stream created from type: ' + event.stream.videoType);
                    
                    if(ionic.Platform.isIOS()){
                        if(event.stream.videoType == 1){
                            $("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);	
                        } else if(event.stream.videoType == 2){			
                            $('#subscriber .OT_video-container').remove();
                            
                            var screenHeight = $rootScope.clinicianVideoHeight / 2;			
                            var divHeight = $rootScope.clinicianVideoHeightScreen / 2;
                            var totalHeight = screenHeight - divHeight;
                            
                            $("#subscriber").css('top',  totalHeight);
                            $("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeightScreen);			
                        }
                    }
                    session.subscribe(event.stream, 'subscriber', {
                        insertMode: 'append',
                        subscribeToAudio: true,
                        subscribeToVideo: true
                    });			
                
                    OT.updateViews();
                });
                
                session.on('streamDestroyed', function(event) { 					
                        //$("#subscriberScreen").hide();
                        //$("#subscriber").show();	
                        $("#subscriber").css('top', '0px');	
                        $("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);	
                        event.preventDefault(); 
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
                            insertMode: 'append',
                            publishAudio: true,
                            publishVideo: true
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
                        $rootScope.newCamPosition = "back";
                        $rootScope.cameraIconClass = 'ion-ios-reverse-camera-outline callIcons';
                    }else{
                        $rootScope.newCamPosition = "front";
                        $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
                    }
                    $scope.cameraPosition = $scope.newCamPosition;
                    publisher.setCameraPosition($scope.newCamPosition);
                    OT.updateViews();
                };
                
                $scope.toggleMute = function(){
                    if($scope.publishAudio){
                        $rootScope.newPublishAudio = false;
                        $rootScope.muteIconClass = 'ion-ios-mic-off callIcons activeCallIcon';
                    }else{
                        $rootScope.newPublishAudio = true;
                        $rootScope.muteIconClass = 'ion-ios-mic callIcons';
                    }
                    $rootScope.publishAudio = $rootScope.newPublishAudio;
                    publisher.publishAudio($rootScope.newPublishAudio);
                    //OT.updateViews();
                };
                
                $scope.toggleSpeaker = function(){
                    
                };
                
                $scope.turnOffCamera = function(){
                    
                };
    }               
	
	
    var callEnded = false;
    $scope.disconnectConference = function(){
		if(!callEnded){		
			
			//$timeout(function(){
			//try {
               session.unpublish(publisher)
			//publisher.destroy();
			session.disconnect();
			//} 
			/*catch(err) {
				alert(err);
			}*/
          // }, 5000);
			
			
			
		/*	$("#subscriber").width(0).height(0);	
			$('#publisher').width(0).height(0);
			
			$("#subscriber").remove();
			$("#publisher").remove();*/
			$('#publisher').hide();
				$('#subscriber').hide(); 
			//alert($('#publisher').html());
			//alert($('#subscriber').html());
			
			
		
			//$timeout(function(){
				 //setTimeout(function() {
			navigator.notification.alert(
				'Consultation ended successfully!',  // message
				consultationEndedAlertDismissed,         // callback
				 $rootScope.Hopital,            // title
				'Done'                  // buttonName
			);
				// }, 10000);
			 	
			//alert('Consultation ended successfully!');
		}
		
		  callEnded = true;
		
    };
    
	function consultationEndedAlertDismissed(){
		conHub.invoke("endConsultation").then(function(){
		});
		//$('#publisher').css('display', 'none');
			//$('#subscriber').css('display', 'none');
			
		//$scope.doGetPatientsSoapNotes();
		$scope.doGetExistingConsulatationReport(); 
		window.plugins.insomnia.allowSleepAgain();	
	}
})

angular.module('starter.controllers')

.controller('ConferenceCtrl', function($scope, ageFilter, htmlEscapeValue, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {

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
							$rootScope.doGetExistingConsulatationReport();
						}
				}

            },
            error: function (data) {
              //  $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getExistingConsulatation(params);

	}

    $rootScope.doGetExistingConsulatationReport = function () {
			$state.go('tab.ReportScreen');

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
				$rootScope.attachmentLength = '';
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
				$rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
				$rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);

				if($rootScope.existingConsultationReport.patientAddress !='' && typeof $rootScope.existingConsultationReport.patientAddress != 'undefined')
				{
					$rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
				} else {
					$rootScope.reportPatientAddress = 'None Reported';
				}

				if($rootScope.existingConsultationReport.homePhone !='' && typeof $rootScope.existingConsultationReport.homePhone != 'undefined')
				{
					$rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
				} else {
					$rootScope.reportHomePhone = 'NA';
				}

				if($rootScope.existingConsultationReport.hospitalAddress !='' && typeof $rootScope.existingConsultationReport.hospitalAddress != 'undefined')
				{
					$rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
				} else {
					$rootScope.reportHospitalAddress = 'None Reported';
				}

				if($rootScope.existingConsultationReport.doctorFirstName !='' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined')
				{
					$rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
				} else {
					$rootScope.reportDoctorFirstName = 'None Reported';
				}
				if($rootScope.existingConsultationReport.medicalSpeciality !='' && typeof $rootScope.existingConsultationReport.medicalSpeciality != 'undefined')
				{
					$rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
				} else {
					$rootScope.reportMedicalSpeciality = '';
				}

				if($rootScope.existingConsultationReport.doctorFirstName !='' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined')
				{
					$rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
				} else {
					$rootScope.reportDoctorLastName = 'None Reported';
				}

				if($rootScope.existingConsultationReport.rx !='' && typeof $rootScope.existingConsultationReport.rx != 'undefined') {
					$rootScope.reportrx = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.rx);
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
				$rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
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
						$rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern);
					} else {
						$rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
						$rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern1[1]);
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
				if(typeof usDOB != 'undefined' && usDOB != '') {
					$rootScope.userReportDOB = usDOB.search("y");
				} else {
					$rootScope.userReportDOB = 'None Reported';
				}
				if(typeof data.data[0].details[0].hospitalImage != 'undefined' && data.data[0].details[0].hospitalImage != '') {
					var hosImage = data.data[0].details[0].hospitalImage;
					if(hosImage.indexOf(apiCommonURL) >= 0) {
						$rootScope.hospitalImage = hosImage;
					} else {
						$rootScope.hospitalImage = apiCommonURL + hosImage;
					}
				} else {
					$rootScope.hospitalImage = '';
				}


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

					$rootScope.reportMedicalCodeDetails = [];

					if($rootScope.existingConsultationReport.medicalCodeDetails !='' && typeof $rootScope.existingConsultationReport.medicalCodeDetails != 'undefined')
					{
						angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
							$rootScope.reportMedicalCodeDetails.push({
								'Number':item + 1,
								'shortDescription': index.shortDescription,
								'medicalCodingSystem': index.medicalCodingSystem
							});
						});
						$rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {medicalCodingSystem:'CPT'});
						$rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {medicalCodingSystem:'ICD-10-DX'});

					} else {
						$rootScope.reportMedicalCodeDetails = '';
					}

					$window.localStorage.setItem('ChkVideoConferencePage', "");
				session = null;
				$scope.getSoapNotes();
				$scope.doGetAttachmentList();
		   },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

		LoginService.getConsultationFinalReport(params);
	}
	$scope.doGetAttachmentList = function () {
		if ($rootScope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function (data) {
				$scope.getSoapNotes();
                //$rootScope.attachmentFileId = data.data[0].snapFile.files[0].id;
				$rootScope.getAttachmentList = []


				angular.forEach(data.data[0].snapFile.files, function(index, item) {
					var attachImage = index.name.split(".");
					 $rootScope.getAttachmentList.push({
						'id': index.id,
						'name': index.name,
						'image': attachImage[attachImage.length-1]
					});
					//$scope.doGetAttachmentURL(index.id, index.name);

				});
				$rootScope.attachmentLength = $rootScope.getAttachmentList.length;


            },
            error: function (data) {
               $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getAttachmentList(params);

	}

	$scope.getSoapNotes = function() {
				$("#reportSubjective").html($rootScope.existingConsultationReport.subjective);
				$("#reportObjective").html($rootScope.existingConsultationReport.objective);
				$("#reportAssessment").html($rootScope.existingConsultationReport.assessment);
				$("#reportPlan").html($rootScope.existingConsultationReport.plan);
			if($rootScope.existingConsultationReport.subjective !='' && typeof $rootScope.existingConsultationReport.subjective != 'undefined') {
				$rootScope.reportSubjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.subjective);
			} else {
				$rootScope.reportSubjective = 'None Reported';
			}

			if($rootScope.existingConsultationReport.objective !='' && typeof $rootScope.existingConsultationReport.objective != 'undefined') {
				$rootScope.reportObjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.objective);
			} else {
				$rootScope.reportObjective = 'None Reported';
			}

			if($rootScope.existingConsultationReport.assessment !='' && typeof $rootScope.existingConsultationReport.assessment != 'undefined') {
				$rootScope.reportAssessment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.assessment);
			} else {
				$rootScope.reportAssessment = 'None Reported';
			}

			if($rootScope.existingConsultationReport.plan !='' && typeof $rootScope.existingConsultationReport.plan != 'undefined') {
				$rootScope.reportPlan = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.plan);
			} else {
				$rootScope.reportPlan = 'None Reported';
			}
			$('#soapReport').find('a').each(function() {
				var aLink = angular.element(this).attr('href');
				var onClickLink = "window.open('" + aLink + "', '_system', 'location=yes'); return false;";
				angular.element(this).removeAttr('href', '');
				angular.element(this).attr('href', 'javascript:void(0);');
				angular.element(this).attr('onclick', onClickLink);
			});
	}

	if(session != null) {
		session.unpublish(publisher);
		session.disconnect();
		 session = null;
         $scope.doGetExistingConsulatation();
	}
    $scope.doGetExistingConsulatation();

	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnvLogout == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnvLogout == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}

    $window.localStorage.setItem('ChkVideoConferencePage', "videoConference");

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

                $rootScope.clinicianVideoHeight = $window.innerHeight - 38 - 100;
                $rootScope.clinicianVideoWidth = $window.innerWidth;

                $rootScope.clinicianVideoHeightScreen = ($window.innerWidth / 16) * 9;

                $rootScope.patientVideoTop = $window.innerHeight - 150 - 100;
                $rootScope.controlsStyle = false;

                $rootScope.cameraPosition = "front";
                $rootScope.publishAudio = true;


                $rootScope.muteIconClass = 'ion-ios-mic callIcons';
                $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';

                var apiKey = $rootScope.videoApiKey;
                var sessionId = $rootScope.videoSessionId;
                var token = $rootScope.videoToken;

                session = OT.initSession(apiKey, sessionId);
                //var publisher;

				var customerFullName = $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName;
				var connectedStreams = new Array();
                var lastSubscriber = "";

				var thumbSwiper = new Swiper('.swiper-container',{
					mode:'horizontal',
					slidesPerView: 3,
				});

				session.on('streamCreated', function(event) {
                    //alert('stream created from type: ' + event.stream.videoType);
					$('#pleaseWaitVideo').remove();
					$('#subscriber').css('background-color', 'black !important');
					for(var i = 0; i < connectedStreams.length; i++){
						var tbStreamVal = session.streams[connectedStreams[i]];
						var connectedStreamId = connectedStreams[i];
						if(connectedStreamId != ""){
							$('#subscriber #video-' + connectedStreamId).hide();
							$('#subscriber #' + connectedStreamId).hide();
							$('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
						}
						if(typeof tbStreamVal == "undefined"){
							var index = connectedStreams.indexOf(connectedStreamId);
							connectedStreams.splice(index, 1);
						}
					}
					connectedStreams.push(event.stream.streamId);
					var streamIdVal = event.stream.streamId;

					var vdioContainer = document.createElement("div");
					vdioContainer.setAttribute("id", 'video-' + streamIdVal);

					var vdioPlayer = document.createElement("div");
					vdioPlayer.setAttribute("id", streamIdVal);

					vdioContainer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px!important; position: relative; height: " + $rootScope.clinicianVideoHeight + "px;");
					vdioPlayer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeight + "px;");

                    if(ionic.Platform.isIOS()){
						// if(event.stream.videoType == 1){
						// 	//$('#video-' + streamIdVal).width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);
						// 	//$('#' + streamIdVal).width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);
						// 	vdioContainer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px!important; position: relative; height: " + $rootScope.clinicianVideoHeight + "px;");
						// 	vdioPlayer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeight + "px;");
						// } else
						if(event.stream.videoType == 2){
							$('#subscriber .OT_root').hide();
							var screenHeight = $rootScope.clinicianVideoHeight / 2;
							var divHeight = $rootScope.clinicianVideoHeightScreen / 2;
							var totalHeight = screenHeight - divHeight;
							vdioContainer.setAttribute("style", "top:" + totalHeight + "px !important; position: relative; width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeightScreen + "px;");
							vdioPlayer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeightScreen + "px;");
						}
					}
					document.getElementById('subscriber').appendChild(vdioContainer);
					document.getElementById('video-' + streamIdVal).appendChild(vdioPlayer);

					lastSubscriber = event.stream.streamId;

					session.subscribe(event.stream, streamIdVal, {
                        insertMode: 'append',
                        subscribeToAudio: true,
                        subscribeToVideo: true
                    });

					$scope.createVideoThumbnail(event);

					OT.updateViews();
                });

				$scope.createVideoThumbnail = function(event){
					var streamIdVal = event.stream.streamId;
					var participantName = event.stream.name;
					if(participantName == ""){
						participantName = streamIdVal.split('-')[0];
					}
					var thumbContainer = document.createElement("div");
					thumbContainer.setAttribute("id", 'thumb-' + streamIdVal);

					var thumbPlayer = document.createElement("div");
					thumbPlayer.setAttribute("id", "thumbPlayer-" + streamIdVal);
					thumbContainer.setAttribute("class", "claVideoThumb");
					var thumbLeft = $('.claVideoThumb').length * 100;
					thumbContainer.setAttribute("style", "z-index: 30000; left: " + thumbLeft + "px; border: 1px dotted red; width: 100px !important; padding: 5px; position: absolute; float: left; height: 100px !important;");
					thumbPlayer.setAttribute("style", "background-color: black; border: 1px dotted green; width: 80px !important; position: absolute; height: 80px !important;");
					thumbPlayer.setAttribute("onclick", "switchToStream('" + streamIdVal + "');");
					//document.getElementById('thumbVideos').appendChild(thumbContainer);
					//document.getElementById('thumb-' + streamIdVal).appendChild(thumbPlayer);
					var imgThumbPath = $rootScope.APICommonURL + '/images/Patient-Male.gif';
					imgThumbPath = 'img/default-user.jpg';
					var videoSource = '';
					if(participantName.indexOf('Screen Share') >= 0){
						imgThumbPath = 'img/share-icon.jpg';
					}
					participantName = participantName.replace('Screen Share By :','');
					thumbSwiper.appendSlide("<div onclick='switchToStream(\"" + streamIdVal + "\");' id='thumbPlayer-" + streamIdVal + "' style='color: white !important; width: 100px; float: left; height: 90px; text-align: center; margin-left: 10px; margin-top:10px;'><div id='thumb-" + streamIdVal + "' class='swiper-slide claVideoThumb' style='width: 100px; float: left; height: 90px;text-align: center !important;'><img style='width: 50px; height: 50px; border-radius: 50%;' src='" + imgThumbPath +  "' class='listImgView'/><p class='ellipsis'>" + participantName + "</p></div></div>");
				};

				$scope.removeVideoThumbnail = function(streamIdVal){
					$('#thumbPlayer-' + streamIdVal).hide();
					$('#thumbPlayer-' + streamIdVal).remove();
					var swiperParent = $('#thumb-' + streamIdVal).parent();
					$('#thumb-' + streamIdVal).hide();
					$('#thumb-' + streamIdVal).remove();
					$(swiperParent).remove();
					$("div.swiper-slide:empty").remove();
					OT.updateViews();
				};

				$scope.arrangeVideoThumbnails = function(){
					var thumbLength = $('.claVideoThumb').length;
					for(var i = 0; i < thumbLength; i++){
						var thumbLeft = i * 100;
						$('.claVideoThumb').eq(i).css('left', thumbLeft + 'px !important;');
					}
				};

				switchToStream = function(selectedSteamId){
					for(var i = 0; i < connectedStreams.length; i++){
						var connectedStreamId = connectedStreams[i];
						if(connectedStreamId != "" && connectedStreamId != selectedSteamId){
							$('#subscriber #video-' + connectedStreamId).hide();
							$('#subscriber #' + connectedStreamId).hide();
							$('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
						}
					}
					$('#hiddenVideos #video-' + selectedSteamId).appendTo("#subscriber");
					$('#video-' + selectedSteamId).show();
					$('#' + selectedSteamId).show();
					OT.updateViews();
				};
                session.on('streamDestroyed', function(event) {
					var tbStreamVal = event.stream.streamId;
					$scope.removeVideoThumbnail(tbStreamVal);
					$('#subscriber #video-' + connectedStreamId).hide();
					$('#subscriber #' + connectedStreamId).hide();
					$('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
					$('#' + tbStreamVal).remove();
					$('#video-' + tbStreamVal).remove();
					if(typeof tbStreamVal != "undefined"){
						var index = connectedStreams.indexOf(tbStreamVal);
						connectedStreams.splice(index, 1);
					}
					$scope.removeVideoThumbnail(tbStreamVal);

					for(var i = 0; i < connectedStreams.length; i++){
						var tbStreamVal = session.streams[connectedStreams[i]];
						var connectedStreamId = connectedStreams[i];
						if(connectedStreamId != ""){
							$('#subscriber #video-' + connectedStreamId).hide();
							$('#subscriber #' + connectedStreamId).hide();
							$('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
						}
						if(typeof tbStreamVal == "undefined"){
							var index = connectedStreams.indexOf(connectedStreamId);
							connectedStreams.splice(index, 1);
						}
					}
					if(connectedStreams.length > 0){
						var doctorsStreamId = connectedStreams[0];
						$('#hiddenVideos #video-' + doctorsStreamId).appendTo("#subscriber");
						$('#video-' + doctorsStreamId).show();
						$('#' + doctorsStreamId).show();
					}

					//session.unsubscribe(event.stream);
					OT.updateViews();
					$scope.arrangeVideoThumbnails();
					$("#subscriber").css('top', '0px');
					$("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);
					event.preventDefault();
                });

                // Handler for sessionDisconnected event
                session.on('sessionDisconnected', function(event) {
                    console.log('You were disconnected from the session.', event.reason);
                });

				session.on("signal", function(event) {

				});

                // Connect to the Session
                session.connect(token, function(error) {
                    // If the connection is successful, initialize a publisher and publish to the session
                    if (!error) {
                        publisher = OT.initPublisher('publisher', {
                            insertMode: 'append',
                            publishAudio: true,
                            publishVideo: true,
							name: customerFullName
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
			$('#thumbVideos').remove();
			$('#videoControls').remove();

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
				 $rootScope.alertMsgName,            // title
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
    if(cobrandApp == 'Hello420'){
      var consulationEndRedirectURL = $rootScope.patientConsultEndUrl;
      if(consulationEndRedirectURL != ""){
        $state.go('tab.singleTheme');
        setTimeout(function(){
          window.open(consulationEndRedirectURL, '_system', '');
        }, 1000);
      }
    }else{
		    $rootScope.doGetExistingConsulatationReport();
    }
		window.plugins.insomnia.allowSleepAgain();
	}



})

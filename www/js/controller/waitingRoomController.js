angular.module('starter.controllers')

.controller('waitingRoomCtrl', function($scope, $window, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout, SurgeryStocksListService, $filter, StateList,$ionicBackdrop) {
    $.getScript( "lib/jquery.signalR-2.1.2.js", function( data, textStatus, jqxhr ) {

    });
    /*
    $.getScript( "https://snap-qa.com/api/signalR/hubs", function( data, textStatus, jqxhr ) {

    });*/
    window.plugins.insomnia.keepAwake();
    $rootScope.currState = $state;
    window.localStorage.setItem('videoCallPtImage', $rootScope.PatientImageSelectUser);
    window.localStorage.setItem('videoCallPtFullName', $rootScope.PatientFirstName + " " + $rootScope.PatientLastName);
    $ionicPlatform.registerBackButtonAction(function() {
        if (($rootScope.currState.$current.name === "tab.userhome") ||
            ($rootScope.currState.$current.name === "tab.addCard") ||
            ($rootScope.currState.$current.name === "tab.submitPayment") ||
            ($rootScope.currState.$current.name === "tab.waitingRoom") ||
            ($rootScope.currState.$current.name === "tab.receipt") ||
            ($rootScope.currState.$current.name === "tab.videoConference") ||
            ($rootScope.currState.$current.name === "tab.connectionLost") ||
            ($rootScope.currState.$current.name === "tab.ReportScreen")
        ) {
            // H/W BACK button is disabled for these states (these views)
            // Do not go to the previous state (or view) for these states.
            // Do nothing here to disable H/W back button.
        } else if ($rootScope.currState.$current.name === "tab.login") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.loginSingle") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.cardDetails") {
            var gSearchLength = $('.ion-google-place-container').length;
            if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) === 'block') {
                $ionicBackdrop.release();
                $(".ion-google-place-container").css({
                    "display": "none"
                });

            } else {
                $(".ion-google-place-container").css({
                    "display": "none"
                });
                navigator.app.backHistory();
            }

        } else {
            navigator.app.backHistory();
        }
    }, 100);
    $scope.$storage = $window.localStorage;

    $scope.doGetSingleHosInfoForiTunesStage = function() {
        $rootScope.paymentMode = '';
        $rootScope.insuranceMode = '';
        $rootScope.onDemandMode = '';
        $rootScope.OrganizationLocation = '';
        $rootScope.PPIsBloodTypeRequired = '';
        $rootScope.PPIsHairColorRequired = '';
        $rootScope.PPIsEthnicityRequired = '';
        $rootScope.PPIsEyeColorRequired = '';
        $rootScope.InsVerificationDummy = '';
        $rootScope.InsuranceBeforeWaiting = '';
        $rootScope.HidePaymentPageBeforeWaitingRoom = '';
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                $rootScope.ssopatienttoken = data.data[0].patientTokenApi;
                $rootScope.ssopatientregister = data.data[0].patientRegistrationApi;
                $rootScope.ssopatientforgetpwd = data.data[0].patientForgotPasswordApi;
                if ($rootScope.getDetails !== '') {
                    for (var i = 0; i < $rootScope.getDetails.length; i++) {
                        if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                            $rootScope.insuranceMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                            $rootScope.InsuranceBeforeWaiting = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                            $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                            $rootScope.InsVerificationDummy = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                            $rootScope.OrganizationLocation = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                            $rootScope.PPIsBloodTypeRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                            $rootScope.PPIsHairColorRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                            $rootScope.PPIsEthnicityRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                            $rootScope.PPIsEyeColorRequired = 'on';
                        }
                    }
                }
                $rootScope.brandColor = data.data[0].brandColor;
                $rootScope.logo = data.data[0].hospitalImage;
                $rootScope.Hospital = data.data[0].brandName;
                if (deploymentEnvLogout === 'Multiple') {
                    $rootScope.alertMsgName = 'Virtual Care';
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                } else {
                    $rootScope.alertMsgName = $rootScope.Hospital;
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                }
                $rootScope.HospitalTag = data.data[0].brandTitle;
                $rootScope.contactNumber = data.data[0].contactNumber;
                $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                $rootScope.clientName = data.data[0].hospitalName;
                if (!angular.isUndefined(data.data[0].customerSso) && data.data[0].customerSso === "Mandatory") {
                    $rootScope.customerSso = "Mandatory";
                    ssoURL = data.data[0].patientLogin;
                } else {
                    $rootScope.customerSso = '';
                }
                if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                    $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                } else {
                    $rootScope.isSSORegisterAvailable = '';
                }
                if (deploymentEnvLogout === "Multiple") {
                    $state.go('tab.chooseEnvironment');
                } else if (deploymentEnvLogout === "Single") {
                    $state.go('tab.loginSingle');
                } else {
                    $state.go('tab.login');
                }
            },
            error: function() {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.getHospitalInfo(params);
    }

    $rootScope.ClearRootScope = function() {

      $(".ion-google-place-container").css({
          "display": "none"
      });
      $ionicBackdrop.release();
      $window.localStorage.setItem('tokenExpireTime', '');
      if (deploymentEnvLogout === 'Single' && deploymentEnvForProduction === 'Production' && appStoreTestUserEmail === 'itunesmobiletester@gmail.com' && api_keys_env === 'Staging') {
            $rootScope.hospitalId = singleHospitalId;
            apiCommonURL = 'https://connectedcare.md';
            api_keys_env = 'Production';
            $rootScope.APICommonURL = 'https://connectedcare.md';
            $scope.doGetSingleHosInfoForiTunesStage();
      } else {
        if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
        } else if (deploymentEnvLogout === "Single") {
            $state.go('tab.loginSingle');
        } else {
            $state.go('tab.login');
        }
      }
      $rootScope = $rootScope.$new(true);
      $scope = $scope.$new(true);
      for (var prop in $rootScope) {
          if (prop.substring(0,1) !== '$') {
              delete $rootScope[prop];
          }
      }
    }


    $scope.isPhysicianStartedConsultaion = false;
    $scope.waitingMsg = "The Provider will be with you Shortly.";
    var initWaitingRoomHub = function() {
        var WaitingRoomConnection = $.hubConnection();
        var WaitingRoomConHub = WaitingRoomConnection.createHubProxy('consultationHub');
        WaitingRoomConnection.url = $rootScope.APICommonURL + "/api/signalR/";
        var consultationWatingId = +$rootScope.consultationId;
        var sound = $rootScope.AndroidDevice ? 'file://sound.mp3' : 'file://beep.caf';
//if(WaitingRoomConnection.state ===4 )
//WaitingRoomConnection.start();
        WaitingRoomConnection.qs = {
            "Bearer": $rootScope.accessToken,
            "consultationId": consultationWatingId,
            "waitingroom": 1,
            "isMobile": true
        };
        WaitingRoomConHub.on("onConsultationReview", function() {
            $scope.waitingMsg = "The Provider is now reviewing the intake form.";
            $scope.$digest();
        });
        WaitingRoomConHub.on("onCustomerDefaultWaitingInformation", function() {
            if(typeof appIdleInterval !== "undefined")
                clearInterval(appIdleInterval);
            appIdleInterval = undefined;
            appIdleInterval = 0;
             window.localStorage.setItem("isCustomerInWaitingRoom", "Yes");
             window.localStorage.setItem('accessToken', $rootScope.accessToken);
             window.localStorage.setItem("waitingRoomConsultationId", +$rootScope.consultationId);
            $scope.waitingMsg = "Please Wait....";
            $scope.postPollforCredit();
            $scope.$digest();
        });
        WaitingRoomConHub.on("onConsultationStarted", function() {
             window.localStorage.setItem("isCustomerInWaitingRoom", "No");
             if(typeof alive_waiting_room_pool !== 'undefined')
                 clearInterval(alive_waiting_room_pool);
            $scope.waitingMsg = "Please wait...";
            $scope.$digest();
           // $.connection.hub.stop();
           WaitingRoomConnection.stop();
            WaitingRoomConnection.qs = {};
            WaitingRoomConnection = null;
            WaitingRoomConHub = null;
            getConferenceKeys();
        });
        WaitingRoomConnection.logging = true;
        window.whub = WaitingRoomConnection;
        WaitingRoomConnection.start({
            withCredentials: false
        }).then(function() {
            $scope.waitingMsg = "The Provider will be with you Shortly.";
            $scope.$digest();
            WaitingRoomConnection.disconnected(function() {
               setTimeout(function() {
                  // WaitingRoomConnection.start();
               }, 5000); // Restart connection after 5 seconds.
          });
        });
    };
    initWaitingRoomHub();

    var getConferenceKeys = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function(data) {
                $rootScope.videoSessionId = data.sessionId;
                $rootScope.videoApiKey = data.apiKey;
                $rootScope.videoToken = data.token;
                if ($rootScope.videoSessionId !== "" && $rootScope.videoToken !== "") {
                     if(typeof alive_waiting_room_pool !== 'undefined')
                         clearInterval(alive_waiting_room_pool);
                     window.localStorage.setItem("isCustomerInWaitingRoom", "No");
                    $state.go('tab.videoConference');
                }

            },
            error: function(data,status) {
              if(status===0 ){

                   $scope.ErrorMessage = "Internet connection not available, Try again later!";
                   $rootScope.Validation($scope.ErrorMessage);

              }else{
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getVideoConferenceKeys(params);
    };

    var alive_waiting_room_pool;
    alive_waiting_room_pool = setInterval(function(){
         if(window.localStorage.getItem("isCustomerInWaitingRoom") === "Yes"){
             $scope.postPollforCredit();
         }
       }, 30000);

       $scope.postPollforCredit = function() {
           vConsultationWatingId = window.localStorage.getItem("waitingRoomConsultationId");
           vAccessToken = window.localStorage.getItem("accessToken");
           var alive_timestamp_url = apiCommonURL + '/api/v2/patients/activeconsultations/' + vConsultationWatingId + '/alive-timestamp';
           var reqHeaders = util.getHeaders();
           reqHeaders['Authorization'] = "Bearer " + vAccessToken;
           $.ajax({
               type: 'PUT',
               headers: reqHeaders,
               url: alive_timestamp_url,
               success: function(){

               },
               failure: function(){

               }
             });
       }

       $scope.doGetExistingConsulatation = function() {
           $rootScope.consultionInformation = '';
           $rootScope.appointmentsPatientFirstName = '';
           $rootScope.appointmentsPatientLastName = '';
           $rootScope.appointmentsPatientDOB = '';
           $rootScope.appointmentsPatientGurdianName = '';
           $rootScope.appointmentsPatientImage = '';


           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {
                   $scope.existingConsultation = data;

                   $rootScope.consultionInformation = data.data[0].consultationInfo;
                   $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                   if (!angular.isUndefined($rootScope.consultationStatusId)) {

                     if (!angular.isUndefined($rootScope.consultationStatusId)) {
                         if ($rootScope.consultationStatusId === 71) {
                             navigator.notification.alert(
                                 'Your consultation is already started on other device.', // message
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                 'Done' // buttonName
                             );
                             return false;
                         } else if ($rootScope.consultationStatusId === 72) {
                              window.localStorage.setItem('isVideoCallProgress', "No");
                              $('#thumbVideos').remove();
                                $('#videoControls').remove();
                                session.disconnect();
                                $('#publisher').hide();
                                $('#subscriber').hide();
                                $('#divVdioControlPanel').hide();

                               navigator.notification.alert(
                                   'Consultation already completed!', // message
                                   $rootScope.alertMsgName, // title
                                   'Done' // buttonName
                               );
                              $rootScope.doGetExistingConsulatationReport();
                          } else if ($rootScope.consultationStatusId === 79) {
                             navigator.notification.alert(
                                 'Your consultation is cancelled.', // message
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                 'Done' // buttonName
                             );
                             return false;
                         } else if ($rootScope.consultationStatusId === 80) {
                             navigator.notification.alert(
                                 'Your consultation is in progress on other device.', // message
                                 function() {
                                     $state.go('tab.userhome');
                                     return;
                                 },
                                 $rootScope.alertMsgName, // title
                                 'Done' // buttonName
                             );
                             return false;
                         }

                     }

                   }

               },
               error: function() {

               }
           };

           LoginService.getExistingConsulatation(params);

       }

       $rootScope.doGetExistingConsulatationReport = function() {
           $state.go('tab.ReportScreen');
           $rootScope.userReportDOB = "";
           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {
                   $rootScope.attachmentLength = '';
                   $rootScope.existingConsultationReport = data.data[0].details[0];
                   $rootScope.existconsultationparticipants=data.data[0].participants;
                   $rootScope.existconsultationPrescriptions=data.data[0].prescriptions;

                   if ($rootScope.existingConsultationReport.height !== '' && typeof $rootScope.existingConsultationReport.height !== 'undefined')
                   {
                     if ($rootScope.existingConsultationReport.heightUnit !== '' && typeof $rootScope.existingConsultationReport.heightUnit !== 'undefined') {
                       $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                     } else {
                       $rootScope.reportHeight = $rootScope.existingConsultationReport.height;
                     }
                   } else {
                       $rootScope.reportHeight = 'NA';
                   }

                   if ($rootScope.existingConsultationReport.weight !== '' && typeof $rootScope.existingConsultationReport.weight !== 'undefined') {
                       $rootScope.reportWeight = $rootScope.existingConsultationReport.weight + " " + $rootScope.existingConsultationReport.weightUnit;
                   } else {
                       $rootScope.reportWeight = 'NA';
                   }
                   $rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
                   $rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);
                   if ($rootScope.primaryPatientId !== $rootScope.existingConsultationReport.patientId){
                     if ($rootScope.existingConsultationReport.guardianName !== '' && typeof $rootScope.existingConsultationReport.guardianName !== 'undefined') {
                         $rootScope.reportGuardian = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.guardianName);
                     }
                    }
                   if ($rootScope.existingConsultationReport.patientAddress !== '' && typeof $rootScope.existingConsultationReport.patientAddress !== 'undefined') {
                       $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                   } else {
                       $rootScope.reportPatientAddress = 'None Reported';
                   }

                   if ($rootScope.existingConsultationReport.homePhone !== '' && typeof $rootScope.existingConsultationReport.homePhone !== 'undefined') {
                       $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                   } else {
                       $rootScope.reportHomePhone = 'NA';
                   }

                   if ($rootScope.existingConsultationReport.hospitalAddress !== '' && typeof $rootScope.existingConsultationReport.hospitalAddress !== 'undefined') {
                       $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                   } else {

                   }

                   if (!angular.isUndefined($rootScope.existingConsultationReport.location)) {
                       $rootScope.location = $rootScope.existingConsultationReport.location;
                   } else {
                       $rootScope.location = 'N/A';
                   }

                   if (!angular.isUndefined($rootScope.existingConsultationReport.organization)) {
                       $rootScope.organization =$rootScope.existingConsultationReport.organization;
                   } else {
                       $rootScope.organization = 'N/A';
                   }

                   if ($rootScope.existingConsultationReport.doctorFirstName !== '' && typeof $rootScope.existingConsultationReport.doctorFirstName !== 'undefined') {
                       $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                   } else {
                       $rootScope.reportDoctorFirstName = 'None Reported';
                   }
                   if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                       $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                   } else {
                       $rootScope.reportMedicalSpeciality = '';
                   }

                   if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                       $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                   } else {
                       $rootScope.reportDoctorLastName = 'None Reported';
                   }

                   $rootScope.reportrx = [];

                       if ($rootScope.existconsultationPrescriptions !== '' && typeof $rootScope.existconsultationPrescriptions !== 'undefined' && $rootScope.existconsultationPrescriptions.length !== 0) {
                           angular.forEach($rootScope.existconsultationPrescriptions, function(index) {
                               $rootScope.reportrx.push({
                                   'drugDosage': index.drugDosage,
                                   'drugName': index.drugName,
                                   'noRefills': index.noRefills,
                                   'quality': index.quality
                               });
                           });
                       } else {
                           $rootScope.reportrx = 'None Reported';
                       }
                   var startTimeISOString = $rootScope.existingConsultationReport.consultationDate;
                   var startTime = new Date(startTimeISOString);
                   $rootScope.consultationDate = new Date(startTime.getTime() + (startTime.getTimezoneOffset() * 60000));

                   if ($rootScope.existingConsultationReport.consultationDuration !== 0 && typeof $rootScope.existingConsultationReport.consultationDuration !== 'undefined')
                   {
                       $rootScope.displayCOnsultationDuration = "display";
                       var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
                       var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
                       if (consultationMinutes === 0) {
                           $rootScope.consultDurationMinutes = '00';
                       } else if (consultationMinutes < 10) {
                           $rootScope.consultDurationMinutes = '0' + consultationMinutes;
                       } else {
                           $rootScope.consultDurationMinutes = consultationMinutes;
                       }

                       if (consultationSeconds == 0) {
                           $rootScope.consultDurationSeconds = '00';
                       } else if (consultationSeconds < 10) {
                           $rootScope.consultDurationSeconds = '0' + consultationSeconds;
                       } else {
                           $rootScope.consultDurationSeconds = consultationSeconds;
                       }
                   } else {
                       $rootScope.displayCOnsultationDuration = "none";
                   }

                   $rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;
                   $rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
                   if (typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
                       var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
                       if (n < 0) {
                           $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
                       } else {
                           $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
                           $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
                       }
                   } else {
                       $rootScope.reportScreenPrimaryConcern = "";
                   }
                   $rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
                   if (typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
                       var nsc = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                       if (nsc < 0) {
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

                   if ($rootScope.fullTerm === 'N') {
                       $rootScope.fullTerm = 'No';
                   } else if ($rootScope.fullTerm === 'Y') {
                       $rootScope.fullTerm = 'Yes';
                   }

                   $rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
                   if ($rootScope.vaginalBirth === 'N') {
                       $rootScope.vaginalBirth = 'No';
                   } else if ($rootScope.vaginalBirth === 'Y') {
                       $rootScope.vaginalBirth = 'Yes';
                   }

                   $rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
                   if ($rootScope.dischargedWithMother === 'N') {
                       $rootScope.dischargedWithMother = 'No';
                   } else if ($rootScope.dischargedWithMother === 'Y') {
                       $rootScope.dischargedWithMother = 'Yes';
                   }

                   $rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
                   if ($rootScope.vaccinationsCurrent === 'N') {
                       $rootScope.vaccinationsCurrent = 'No';
                   } else if ($rootScope.vaccinationsCurrent === 'Y') {
                       $rootScope.vaccinationsCurrent = 'Yes';
                   }

                   if($rootScope.existingConsultationReport.dob !== "" && !angular.isUndefined($rootScope.existingConsultationReport.dob)) {
                     var ageDifMs = Date.now() - new Date($rootScope.existingConsultationReport.dob).getTime(); // parse string to date
                     var ageDate = new Date(ageDifMs); // miliseconds from epoch
                     $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                     if($scope.userAge === 0) {
                       $rootScope.userReportDOB = $scope.userAge;
                     } else {
                       $rootScope.userReportDOB = $scope.userAge;
                     }
                   }

                   if (typeof data.data[0].details[0].hospitalImage !== 'undefined' && data.data[0].details[0].hospitalImage !== '') {
                       var hosImage = data.data[0].details[0].hospitalImage;
                       if (hosImage.indexOf(apiCommonURL) >= 0) {
                           $rootScope.hospitalImage = hosImage;
                       } else {
                           $rootScope.hospitalImage = apiCommonURL + hosImage;
                       }
                   } else {
                       $rootScope.hospitalImage = '';
                   }

                   $rootScope.gender = data.data[0].details[0].gender;
                   if (data.data[0].details[0].gender !== '' && typeof data.data[0].details[0].gender !== 'undefined') {

                       if ($rootScope.gender === 'M') {
                           $rootScope.gender = 'Male';
                       } else if ($rootScope.gender === 'F') {
                           $rootScope.gender = 'Female';
                       }
                   } else {
                       $rootScope.gender = 'NA';
                   }

                   $rootScope.ReportMedicalConditions = [];
                   angular.forEach($rootScope.intake.medicalConditions, function(index, item) {
                       $rootScope.ReportMedicalConditions.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportMedicationAllergies = [];
                   angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {
                       $rootScope.ReportMedicationAllergies.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportMedications = [];
                   angular.forEach($rootScope.intake.medications, function(index, item) {
                       $rootScope.ReportMedications.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'code': index.code,
                           'description': index.description,
                       });
                   });

                   $rootScope.ReportSurgeries = [];
                   angular.forEach($rootScope.intake.surgeries, function(index, item) {
                       $rootScope.ReportSurgeries.push({
                           'Number': item + 1,
                           'id': index.$id,
                           'description': index.description,
                           'month': index.month,
                           'year': index.year,
                       });
                   });
                   $rootScope.AttendeeList = [];
                   angular.forEach($rootScope.existconsultationparticipants, function(index, item) {
                     var atname = index.person.name.given;
                     if (atname !== '') {
                         $rootScope.AttendeeList.push({
                             'Number': item + 1,
                             'attedeename': index.person.name.given,
                             'secondname':  index.person.name.family,
                             'consultstart': index.period.start,
                             'consultend': index.period.end,


                       });
                     }
                   });

                   $rootScope.reportMedicalCodeDetails = [];

                   if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined') {
                       angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                           $rootScope.reportMedicalCodeDetails.push({
                               'Number': item + 1,
                               'shortDescription': index.shortDescription,
                               'medicalCodingSystem': index.medicalCodingSystem
                           });
                       });
                       $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'CPT'
                       });
                       $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'ICD-10-DX'
                       });
                       $rootScope.reportMediICD9 = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'ICD-9-DX'
                       });
                       $rootScope.reportSNOMED = $filter('filter')($scope.reportMedicalCodeDetails, {
                           medicalCodingSystem: 'SNOMED-CT'
                       });

                   } else {
                       $rootScope.reportMedicalCodeDetails = '';
                   }

                   $window.localStorage.setItem('ChkVideoConferencePage', "");
                   session = null;
                   $scope.getSoapNotes();
                   $scope.doGetChatTranscript();
                   $scope.doGetAttachmentList();
               },
               error: function(data,status) {
                 if(status===0 ){

                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);

                 }else{
                   $rootScope.serverErrorMessageValidation();
                 }
               }
           };

           LoginService.getConsultationFinalReport(params);
       }

       $scope.doGetAttachmentList = function() {

           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {
                   $scope.getSoapNotes();
                   $rootScope.getAttachmentList = [];


                   angular.forEach(data.data[0].snapFile.files, function(index) {
                       var attachImage = index.name.split(".");
                       $rootScope.getAttachmentList.push({
                           'id': "'" + index.id + "'",
                           'name': index.name,
                           'image': attachImage[attachImage.length - 1]
                       });

                   });
                   $rootScope.attachmentLength = $rootScope.getAttachmentList.length;


               },
               error: function(data,status) {
                 if(status===0 ){

                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);

                 }else{
                   $rootScope.serverErrorMessageValidation();
                 }
               }
           };

           LoginService.getAttachmentList(params);

       }
       $scope.ConvChar=function( str ) {
         c = {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#039;',
              '#':'&#035;' };
         return str.replace( /[<&>'"#]/g, function(s) { return c[s]; } );
       }

       $scope.doGetChatTranscript = function() {

           var params = {
               consultationId: $rootScope.consultationId,
               accessToken: $rootScope.accessToken,
               success: function(data) {

                 $rootScope.chatTranscript = [];
                 if(data.data[0].length !== 0) {
                   var chatdetails=data.data[0];
                     angular.forEach(chatdetails, function(index) {
                       $rootScope.chatTranscript.push({
                         'ChatMessage': index.chatMessage,
                       });
                   });
                 }
               },
               error: function(data,status) {
                 if(status===0 ){

                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);

                 }else{
                   $rootScope.serverErrorMessageValidation();
                 }
               }
           };
           LoginService.getChatTranscript(params);

       }

       $scope.getSoapNotes = function() {
           $("#reportSubjective").html($rootScope.existingConsultationReport.subjective);
           $("#reportObjective").html($rootScope.existingConsultationReport.objective);
           $("#reportAssessment").html($rootScope.existingConsultationReport.assessment);
           $("#reportPlan").html($rootScope.existingConsultationReport.plan);
           if ($rootScope.existingConsultationReport.subjective !== '' && typeof $rootScope.existingConsultationReport.subjective !== 'undefined') {
               $rootScope.reportSubjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.subjective);
           } else {
               $rootScope.reportSubjective = 'None Reported';
           }

           if ($rootScope.existingConsultationReport.objective !== '' && typeof $rootScope.existingConsultationReport.objective !== 'undefined') {
               $rootScope.reportObjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.objective);
           } else {
               $rootScope.reportObjective = 'None Reported';
           }

           if ($rootScope.existingConsultationReport.assessment !== '' && typeof $rootScope.existingConsultationReport.assessment !== 'undefined') {
               $rootScope.reportAssessment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.assessment);
           } else {
               $rootScope.reportAssessment = 'None Reported';
           }

           if ($rootScope.existingConsultationReport.plan !== '' && typeof $rootScope.existingConsultationReport.plan !== 'undefined') {
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

    $rootScope.waitingroomlostconnection = function(){
        // $window.alert("you lost your connection name!");
        $scope.doGetExistingConsulatation();
    }

})

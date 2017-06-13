angular.module('starter.controllers')

.controller('waitingRoomCtrl', function($scope, $window, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout, SurgeryStocksListService, $filter, StateList,$ionicBackdrop) {
  $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
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

       $scope.goTOSchedule = function() {
           /* $("#style1").attr("disabled", "disabled");
             $("#style2").attr("disabled", "disabled");*/
           $('<link/>', {
               rel: 'stylesheet',
               type: 'text/css',
               href: 'css/styles.v3.less.dynamic.css'
           }).appendTo('head');
           //  $state.go('tab.providerSearch', { viewMode : 'all' });
           $state.go('tab.providerSearch');
       }


})

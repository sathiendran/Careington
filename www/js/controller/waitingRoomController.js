angular.module('starter.controllers')

.controller('waitingRoomCtrl', function($scope, $window, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout, SurgeryStocksListService, $filter, StateList,$ionicBackdrop) {
    window.plugins.insomnia.keepAwake();
    $rootScope.currState = $state;
    window.localStorage.setItem('videoCallPtImage', $rootScope.PatientImageSelectUser);
    window.localStorage.setItem('videoCallPtFullName', $rootScope.PatientFirstName + " " + $rootScope.PatientLastName);
    $ionicPlatform.registerBackButtonAction(function(event, $state) {
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

    $rootScope.ClearRootScope = function() {

      $(".ion-google-place-container").css({
          "display": "none"
      });
      $ionicBackdrop.release();
      $window.localStorage.setItem('tokenExpireTime', '');
      $rootScope = $rootScope.$new(true);
      $scope = $scope.$new(true);
      for (var prop in $rootScope) {
          if (prop.substring(0,1) !== '$') {
              delete $rootScope[prop];
          }
      }


        if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
        } else if (deploymentEnvLogout === "Single") {
            $state.go('tab.loginSingle');
        } else {
            $state.go('tab.login');
        }
    }


    $scope.isPhysicianStartedConsultaion = false;

    /*
    consultationStatusCheck = $interval(function(){
         if(!$scope.isPhysicianStartedConsultaion){
              $scope.checkIfPhysicianStartedConference();
         }
    }, 5000);

    $scope.checkIfPhysicianStartedConference = function(){
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function (data) {
                console.log('-------------------------------- ' +  data.data[0].consultationInfo.consultationStatus);
                 if(data.data[0].consultationInfo.consultationStatus === REVIEW_CONSULTATION_STATUS_CODE){
                      $interval.cancel(consultationStatusCheck);
                      $scope.isPhysicianStartedConsultaion = true;
                      $scope.getConferenceKeys();
                      return;
                 }
            },
            error: function (data) {
				$rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.getExistingConsulatation(params);
     };
    */

    $scope.waitingMsg = "The Provider will be with you Shortly.";
    var initWaitingRoomHub = function() {
        var connection = $.hubConnection();
        var conHub = connection.createHubProxy('consultationHub');
        connection.url = $rootScope.APICommonURL + "/api/signalR/";
        var consultationWatingId = +$rootScope.consultationId;
        var sound = $rootScope.AndroidDevice ? 'file://sound.mp3' : 'file://beep.caf';

        // var conHub = $.connection.consultationHub;
        connection.qs = {
            "Bearer": $rootScope.accessToken,
            "consultationId": consultationWatingId,
            "waitingroom": 1,
            "isMobile": true
        };
        conHub.on("onConsultationReview", function() {
            $scope.waitingMsg = "The Provider is now reviewing the intake form.";
            /*
            cordova.plugins.notification.local.schedule([
            	{
            		id: 1,
            		text: "The clinician is now reviewing the intake form.",
            		sound: sound,
            	}
            ]);
            //navigator.notification.beep(1);
            */
            $scope.$digest();
        });
        conHub.on("onCustomerDefaultWaitingInformation", function() {
            if(typeof appIdleInterval != "undefined")
                clearInterval(appIdleInterval);
            appIdleInterval = undefined;
            appIdleInterval = 0;
             window.localStorage.setItem("isCustomerInWaitingRoom", "Yes");
             window.localStorage.setItem('accessToken', $rootScope.accessToken);
             window.localStorage.setItem("waitingRoomConsultationId", +$rootScope.consultationId);
            $scope.waitingMsg = "Please Wait....";
            $scope.$digest();
        });
        conHub.on("onConsultationStarted", function() {
             window.localStorage.setItem("isCustomerInWaitingRoom", "No");
             if(typeof alive_waiting_room_pool !== 'undefined')
                 clearInterval(alive_waiting_room_pool);
            $scope.waitingMsg = "Please wait...";
            /*
			   cordova.plugins.notification.local.schedule([
					{
						id: 1,
						text: "The clinician started consultation.",
						sound: sound,
						data: { updated:true }
					}
				]);
				//navigator.notification.beep(2);
				*/
            $scope.$digest();;
            $.connection.hub.stop();
            getConferenceKeys();
        });
        connection.logging = true;
        connection.start({
            withCredentials: false
        }).then(function() {
            $scope.waitingMsg = "The Provider will be with you Shortly.";
            $scope.$digest();
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

})

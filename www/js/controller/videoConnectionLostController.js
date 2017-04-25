angular.module('starter.controllers')

    .controller('videoLostCtrl',function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $timeout, $rootScope, $state, LoginService, $stateParams, $location, $cordovaFileTransfer, $ionicLoading) {
         if(typeof appIdleInterval !== "undefined"){
              $interval.cancel(appIdleInterval);
              appIdleInterval = undefined;
              appIdleInterval = 0;
              timeoutValue = 0;
              window.localStorage.setItem('InActiveSince', timeoutValue);
         }
      $rootScope.consultationId = window.localStorage.getItem('ConferenceCallConsultationId');
      $rootScope.accessToken = window.localStorage.getItem('accessToken');
      $rootScope.videoSessionId = window.localStorage.getItem('videoSessionId');
      $rootScope.videoApiKey = window.localStorage.getItem('videoApiKey');
      $rootScope.videoToken = window.localStorage.getItem('videoToken');
      $rootScope.PatientImageSelectUser = window.localStorage.getItem('PatientImageSelectUser');
      $rootScope.PatientFirstName = window.localStorage.getItem('PatientFirstName');
      $rootScope.PatientLastName = window.localStorage.getItem('PatientLastName');
      $rootScope.videoLostMessage = 'Internet connection lost. Please reconnect.';

      $rootScope.checkForReEntryConsultation = function() {
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
                  $ionicLoading.show({
                      template: '<img src="img/puff.svg" alt="Loading" />'
                  });
                  $scope.existingConsultation = data;
                  $rootScope.consultionInformation = data.data[0].consultationInfo;
                  $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                  if (!angular.isUndefined($rootScope.consultationStatusId)) {
                      if ($rootScope.consultationStatusId === 72) {
                          window.localStorage.setItem('isVideoCallProgress', "No");
                          $scope.doGetExistingConsulatationReport();
                      }else if($rootScope.consultationStatusId === 71 || $rootScope.consultationStatusId === 80){
                          window.localStorage.setItem('isVideoCallProgress', "Yes");
                          setTimeout(function(){
                              $ionicLoading.hide();
                              $state.go('tab.videoConference');
                          }, 5000);
                      }else{
                        navigator.notification.alert(
                            'Consultation ended successfully!', // message
                            consultationEndedBeforeReconnect, // callback
                            $rootScope.alertMsgName, // title
                            'OK' // buttonName
                        );
                      }
                  }
              },
              error: function() {
              }
          };
          $ionicLoading.show({
              template: '<img src="img/puff.svg" alt="Loading" />'
          });
          setTimeout(function(){
              LoginService.getExistingConsulatation(params);
          }, 3000);

      };

      var consultationEndedBeforeReconnect  = function() {
          window.localStorage.setItem('isVideoCallProgress', "No");
          $scope.doGetExistingConsulatationReport();
      };

      if($stateParams.retry === '1'){
          $rootScope.videoLostMessage = 'Video connection lost.';
          $rootScope.videoLostMessageSub = 'Please make sure that you are connected to internet.';
      }else{
          $ionicLoading.show({
              template: '<img src="img/puff.svg" alt="Loading" />'
          });
          $rootScope.netConnectionStaus = false;
          $rootScope.videoLostMessage = 'Please wait while we are re-connecting you with provider!';
          $rootScope.videoLostMessageSub = 'This might take few seconds.';
          $rootScope.checkForReEntryConsultation();
      }

    })

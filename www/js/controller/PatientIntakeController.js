angular.module('starter.controllers')
    .controller('PatientIntakeCtrl', function ($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {

alert("PatientIntakeCtrl.js");

  $scope.patientMobNo ="323-664-8877";
  $scope.GoToPatientIntake = function () {
    //alert("chat");
    var patientMobNo = $scope.patientMobNo;
    alert("$scope.patientMobNo = "+patientMobNo);


  }

});

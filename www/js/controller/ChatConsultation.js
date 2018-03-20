angular.module('starter.controllers')
    .controller('ChatConsultationCtrl', function ($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {

//alert("hi");
$scope.activeTabPatientData = "";
$scope.activeTabchat = "active-Tab-chat";

  $scope.chat = function () {
    //alert("chat");
    $scope.activeTabPatientData = "";
    $scope.activeTabchat = "active-Tab-chat";
    $scope.PatientDataContent = "none;";
    $scope.chatContent = "block;";
  }
  $scope.PatientData = function () {
    //alert("PatientData");
    $scope.activeTabPatientData = "active-Tab-chat";
    $scope.activeTabchat = "";
    $scope.PatientDataContent = "block;";
    $scope.chatContent = "none;";
  }
});

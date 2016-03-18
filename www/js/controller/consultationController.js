angular.module('starter.controllers')
.controller('consultationController', function($scope) {
    
  $scope.isdiplay = false;
  $scope.showsearch = function() {
  $scope.isdiplay = !$scope.isdiplay;
   
  }
    
});
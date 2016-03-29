angular.module('starter.controllers')
.controller('addnewdepartmentController', function($scope,$timeout) {
    
    var countUp = function() {
      $scope.tempfooter= true;
      $scope.permfooter= true;
    }
    $timeout(countUp, 3000);
     
});
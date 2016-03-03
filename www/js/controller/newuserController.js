angular.module('starter.controllers')

.controller('newuserController', function($scope) {
     $scope.addmore = false;
      $scope.moredetails = function() {
        $scope.showme = true;
        $scope.addmore = true;
        $scope.showless= true;
    };
});
	
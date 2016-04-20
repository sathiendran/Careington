angular.module('starter.controllers')

.controller('healthsearchController', function($scope,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state) {
    
    
     $scope.alphabet = iterateAlphabet();
      var tmp={};
     function iterateAlphabet()
  {
     var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     var numbers = new Array();
     for(var i=0; i<str.length; i++)
     {
        var nextChar = str.charAt(i);
        numbers.push(nextChar);
     }
     return numbers;
  }
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
});


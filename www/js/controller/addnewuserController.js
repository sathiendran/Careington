angular.module('starter.controllers')
.controller('addnewuserController', function($scope,$state, $timeout) {
    
     $scope.adddependent = function(){   

        $state.go('tab.addnewdependent');
        
         $timeout(function(){
             $scope.tempfooter = true, $scope.permfooter = true}, 2000
             
             
             );  
    }

});
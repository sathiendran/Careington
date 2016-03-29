angular.module('starter.controllers')
.controller('addnewuserController', function($scope,$state, $timeout) {
    
     $scope.adddepartment = function(){   

        $state.go('tab.addnewdepartment');
        
         $timeout(function(){
             $scope.tempfooter = true, $scope.permfooter = true}, 2000
             
             
             );  
    }

});
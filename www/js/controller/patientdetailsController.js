angular.module('starter.controllers')
.controller('patientdetailsController', function($scope) {
   $scope.addmore=false;
     $scope.healthhide=true;  
      
     $scope.user= function() {
         
     var myEl = angular.element( document.querySelector( '#users' ) );
     myEl.addClass('btcolor');
      myEl.removeClass('btnextcolor');
  var myEl = angular.element( document.querySelector( '#allusers' ) );
      myEl.removeClass('btcolor').css('color','#11c1f3');
      myEl.addClass('btnextcolor');
      
    $scope.addmore=false;
     $scope.healthhide=true;  
      
   
    }
    
    
    $scope.alluser= function() {
        
     var myEl = angular.element( document.querySelector( '#allusers' ) );
         myEl.removeClass('btnextcolor');
         myEl.addClass('btcolor');
     var myEl = angular.element( document.querySelector( '#users' ) );
         myEl.removeClass('btcolor').css('color','#11c1f3');
         myEl.addClass('btnextcolor');
    $scope.addmore=true;
     $scope.healthhide=false;  
      
        
    }
   
    
});
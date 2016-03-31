angular.module('starter.controllers')

.controller('healthinfoController', function($scope) {
   $scope.addmore=false;
   $scope.healthhide=true;
   $scope.headerval=false;
   $scope.editshow=true;
   $scope.doneshow=true;
   $scope.inactive = true;
   $scope.doneedit=false;
  
   
   $scope.edittext = function() {
      $scope.inactive = false;
      $scope.doneshow=false;
      $scope.editshow=false;
      $scope.doneedit=true;
      
         
   }
   
      
   $scope.donetext = function() {
      $scope.inactive = true;
      $scope.doneshow=true;
      $scope.editshow=true;
      $scope.doneedit=false;
    
   }
   
   $scope.done=function(){
      $scope.editshow=true;
      $scope.doneshow=true;
      $scope.inactive = true;
      $scope.doneedit=false;
   }
   
   
 $scope.profile= function() {
     var myEl = angular.element( document.querySelector( '#profid' ) );
     myEl.addClass('btcolor');
      myEl.removeClass('btnextcolor');
  var myEl = angular.element( document.querySelector( '#healid' ) );
      myEl.removeClass('btcolor').css('color','#11c1f3');
      myEl.addClass('btnextcolor');
       $scope.editshow=true;
       $scope.addmore=false;
       $scope.healthhide=true;  
        $scope.doneshow=true;  
     
    }
 $scope.health= function() {
     
     var myEl = angular.element( document.querySelector( '#healid' ) );
         myEl.removeClass('btnextcolor');
         myEl.addClass('btcolor');
     var myEl = angular.element( document.querySelector( '#profid' ) );
         myEl.removeClass('btcolor').css('color','#11c1f3');
         myEl.addClass('btnextcolor');
  $scope.editshow=false;
     $scope.addmore=true;
       $scope.healthhide=false;  
      
         $scope.doneshow=true;
    }
   
});
	
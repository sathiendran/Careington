angular.module('starter.controllers')

.controller('healthinfoController', function($scope) {
   $scope.addmore=false;
   $scope.healthhide=true;
   $scope.headerval=false;
   $scope.editshow=true;
   $scope.doneshow=true;
   $scope.inactive = true;
   $scope.healthdisable=false;
   
   $scope.edittext = function() {
     $scope.inactive = false;
      $scope.doneshow=false;
        $scope.editshow=false;
        $scope.healthdisable=true;
   }
   
      
   $scope.donetext = function() {
      $scope.inactive = true;
      $scope.doneshow=true;
       $scope.editshow=true;
       $scope.healthdisable=false;
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
     //  $scope.headerval=false;
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
        //$scope.headerval=true;
         $scope.doneshow=true;
    }
   
});
	
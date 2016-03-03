angular.module('starter.controllers')

.controller('healthinfoController', function($scope) {
   $scope.addmore=false;
   $scope.healthhide=true;
   $scope.headerval=false;
 $scope.profile= function() {
     var myEl = angular.element( document.querySelector( '#profid' ) );
     myEl.addClass('btcolor');
  var myEl = angular.element( document.querySelector( '#healid' ) );
     myEl.removeClass('btcolor').css('color','#11c1f3');
      $scope.addmore=false;
       $scope.healthhide=true;    
       $scope.headerval=false;
    }
 $scope.health= function() {
       $scope.addmore=true;   
     var myEl = angular.element( document.querySelector( '#healid' ) );
     myEl.addClass('btcolor');
 var myEl = angular.element( document.querySelector( '#profid' ) );
     myEl.removeClass('btcolor').css('color','#11c1f3');
     $scope.addmore=true;
       $scope.healthhide=false;  
        $scope.headerval=true;
    }
   
});
	
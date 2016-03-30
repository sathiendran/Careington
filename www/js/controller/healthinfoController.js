angular.module('starter.controllers')

.controller('healthinfoController', function($scope) {
   $scope.addmore=false;
   $scope.healthhide=true;
   $scope.headerval=false;
   $scope.editshow=true;
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
       $scope.headerval=false;
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
        $scope.headerval=true;
    }
   
});
	
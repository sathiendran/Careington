angular.module('starter.controllers')
.controller('relateduserController', function($scope) {
    
     $scope.showdetails = true;
     $scope.showdnewetails=true;
     $scope.showarchieve=false;
     $scope.newarchieve=false;
     $scope.userdata=false;
     $scope.dependentshide=true;
     $scope.tabview=false;
     $scope.moretab=false;
      $scope.moredetails = function() {
        $scope.showdetails = false;
        $scope.showarchieve = true;
      
    };
    
      $scope.userdetails = function() {
        $scope.showdnewetails = false;
        $scope.newarchieve = true;
      
    };
    $scope.archievedetails=function(){
          $scope.showarchieve=false;
          $scope.showdetails = true;
    };
    
    $scope.archieve=function(){
          $scope.newarchieve=true;
          $scope.showdnewetails = false;
    }; 
    $scope.showtab=function(){
          $scope.tabview=true;
    };
    
    $scope.moreclickval=function(){
        $scope.moretab=true;
        $scope.tabview=false;
    }
    
    $scope.hidemoretab=function(){
         $scope.moretab=false;
         $scope.tabview=true;
    }
    $scope.userslist=function(){
        
         var myEl = angular.element( document.querySelector( '#users' ) );
     myEl.addClass('btcolor');
  var myEl = angular.element( document.querySelector( '#dependents' ) );
     myEl.removeClass('btcolor').css('color','#11c1f3');
        
        $scope.userdata=false;
    $scope.dependentshide=true;
    };
    $scope.dependentslist=function(){
        
        var myEl = angular.element( document.querySelector( '#dependents' ) );
     myEl.addClass('btcolor');
 var myEl = angular.element( document.querySelector( '#users' ) );
     myEl.removeClass('btcolor').css('color','#11c1f3');
         $scope.userdata=true;
     $scope.dependentshide=false;
    }
});
	
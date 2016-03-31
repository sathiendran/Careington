angular.module('starter.controllers')

.controller('healthinfoController', function($scope) {
   $scope.addmore=false;
   $scope.healthhide=true;
   $scope.headerval=false;
   $scope.editshow=true;
   $scope.doneshow=true;
   $scope.readattr = false;
   $scope.doneedit=false;
   $scope.flag = true;
   
   $scope.edittext = function() {
      $scope.readattr = false;
      $scope.doneshow=false;
      $scope.editshow=false;
      $scope.doneedit=true;
       $scope.flag = false;
        var editvalues = angular.element(document.getElementsByTagName('input'));
        var edittextarea = angular.element(document.getElementsByTagName('textarea'));
          editvalues.removeClass('textdata');
          editvalues.addClass('editdata');
          edittextarea.removeClass('editdata');
          edittextarea.addClass('textdata');
   }
   
      
   $scope.donetext = function() {
      $scope.readattr = true;
      $scope.doneshow=true;
      $scope.editshow=true;
      $scope.doneedit=false;
      $scope.flag = true;
      var editvalues = angular.element(document.getElementsByTagName('input'));
      var edittextarea = angular.element(document.getElementsByTagName('textarea'));
          editvalues.removeClass('editdata');
          editvalues.addClass('textdata');
          edittextarea.removeClass('editdata');
          edittextarea.addClass('textdata');
   }
   
   $scope.done=function(){
      $scope.editshow=true;
      $scope.doneshow=true;
      $scope.flag = true;
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
	
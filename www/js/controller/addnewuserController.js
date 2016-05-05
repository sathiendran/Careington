angular.module('starter.controllers')
.controller('addnewuserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPopup,ageFilter,$localstorage) {
  $ionicPlatform.registerBackButtonAction(function(event, $state) {
      if (($rootScope.currState.$current.name === "tab.userhome") ||
          ($rootScope.currState.$current.name === "tab.addCard") ||
          ($rootScope.currState.$current.name === "tab.submitPayment") ||
          ($rootScope.currState.$current.name === "tab.waitingRoom") ||
          ($rootScope.currState.$current.name === "tab.receipt") ||
          ($rootScope.currState.$current.name === "tab.videoConference") ||
          ($rootScope.currState.$current.name === "tab.connectionLost") ||
          ($rootScope.currState.$current.name === "tab.ReportScreen")
      ) {
          // H/W BACK button is disabled for these states (these views)
          // Do not go to the previous state (or view) for these states.
          // Do nothing here to disable H/W back button.
      } else if ($rootScope.currState.$current.name === "tab.login") {
          navigator.app.exitApp();
      } else if ($rootScope.currState.$current.name === "tab.loginSingle") {
          navigator.app.exitApp();
      } else if ($rootScope.currState.$current.name === "tab.cardDetails") {
          var gSearchLength = $('.ion-google-place-container').length;
          if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) === 'block') {
              $ionicBackdrop.release();
              $(".ion-google-place-container").css({
                  "display": "none"
              });
          } else {
              $(".ion-google-place-container").css({
                  "display": "none"
              });
              navigator.app.backHistory();
          }
      } else {
          navigator.app.backHistory();
      }
  }, 100);

  var checkAndChangeMenuIcon;
  $interval.cancel(checkAndChangeMenuIcon);
  $rootScope.checkAndChangeMenuIcon = function() {
          if (!$ionicSideMenuDelegate.isOpen(true)) {
              if ($('#BackButtonIcon').hasClass("ion-close")) {
                  $('#BackButtonIcon').removeClass("ion-close");
                  $('#BackButtonIcon').addClass("ion-navicon-round");
              }
          } else {
              if ($('#BackButtonIcon').hasClass("ion-navicon-round")) {
                  $('#BackButtonIcon').removeClass("ion-navicon-round");
                  $('#BackButtonIcon').addClass("ion-close");
              }
          }
      }
      //$localstorage.set("Cardben.ross.310.95348@gmail.com", undefined);
      //$localstorage.set("CardTextben.ross.310.95348@gmail.com", undefined);
  $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $rootScope.checkAndChangeMenuIcon();
      if (checkAndChangeMenuIcon) {
          $interval.cancel(checkAndChangeMenuIcon);
      }
      if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
          checkAndChangeMenuIcon = $interval(function() {
              $rootScope.checkAndChangeMenuIcon();
          }, 300);
      }
  };
  
   $('input').blur(function () {                        
       $(this).val(
       $.trim($(this).val())
      );
   });
  
  
   var minDate = new Date();
   var maxDate=minDate.getDay();
   var maxMonth=minDate.getMonth()+1;
   var maxYear=minDate.getFullYear();
   if(maxDate<10){
       var maxD="0"+maxDate;
   }
   if(maxMonth<10){
       var maxM="0"+maxMonth;
   }
   var maxDay=maxYear+"-"+maxM+"-"+maxD;
   var mDate="2016-05-04";
     $scope.maxDate1 = mDate;
     $scope.minimum ="1950-01-01";
  
  $('input.firstname').blur(function(){
		var value=$.trim($(this).val());
		$(this).val(value);
	});
    
  
    $("#userphone").blur(function () { 
        
      if (this.value.match(/^[0-9]{1,14}$/)) {
          this.value = this.value.replace(/^[0-9]{1,14}$/g, '');
        
      }
    });
    $("#usermobile").blur(function () { 
        
      if (this.value.match(/^[0-9]{1,14}$/)) {
          this.value = this.value.replace(/^[0-9]{1,14}$/g, '');
       
      }
    });
 
  
  
 $scope.adddependent = function(){
    $state.go('tab.addnewdependent');
 }

});

angular.module('starter.controllers')
.controller('consultationsearchController', function($scope,$ionicSideMenuDelegate, $ionicPlatform, $interval,  $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPopup,ageFilter,$window, $filter) {
  $ionicPlatform.registerBackButtonAction(function (event, $state) {
        if ( ($rootScope.currState.$current.name=="tab.userhome") ||
			  ($rootScope.currState.$current.name=="tab.addCard") ||
			  ($rootScope.currState.$current.name=="tab.submitPayment") ||
			  ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") ||
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			  ($rootScope.currState.$current.name=="tab.connectionLost") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states.
                // Do nothing here to disable H/W back button.
            }else if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
			}else if($rootScope.currState.$current.name=="tab.loginSingle"){
                navigator.app.exitApp();
            }else if($rootScope.currState.$current.name=="tab.cardDetails"){
				var gSearchLength = $('.ion-google-place-container').length;
				if(($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block')	{
					$ionicBackdrop.release();
					$(".ion-google-place-container").css({"display": "none"});

				}else{
					$(".ion-google-place-container").css({"display": "none"});
					navigator.app.backHistory();
				}

			}else {
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

  $scope.passedsearchshow=true;
  $scope.missedsearchshow=false;
  $scope.droppedsearcshow=false;
/*  $scope.isdiplay = false;
  $scope.showsearch = function() {
  $scope.isdiplay = !$scope.isdiplay;

}*/
  $rootScope.passedsearchconsult=function(){
   $scope.passededconsultants();
    var myEl = angular.element(document.querySelector('#passedsearch'));
    myEl.removeClass('btnextcolor');
    myEl.addClass('btcolor');
    var myEl = angular.element(document.querySelector('#missedsearch'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#droppedsearch'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    $scope.passedsearchshow=true;
    $scope.missedsearchshow=false;
    $scope.droppedsearchshow=false;
  }
  $scope.missedsearchconsult=function(){
      $scope.missedconsultants();
    var myEl = angular.element( document.querySelector( '#missedsearch' ) );
    myEl.addClass('btcolor');
    myEl.removeClass('btnextcolor');
    var myEl = angular.element( document.querySelector( '#passedsearch' ) );
    myEl.removeClass('btcolor').css('color','#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#droppedsearch'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    $scope.missedsearchshow=true;
    $scope.passedsearchshow=false;
    $scope.droppedsearchshow=false;
  }
  $scope.droppedsearchconsult=function(){
    $scope.droppedconsult();
    var myEl = angular.element( document.querySelector('#droppedsearch'));
    myEl.addClass('btcolor');
    myEl.removeClass('btnextcolor');
    var myEl = angular.element( document.querySelector('#passedsearch'));
    myEl.removeClass('btcolor').css('color','#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#missedsearch'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    $scope.passedsearchshow=false;
    $scope.missedsearchshow=false;
    $scope.droppedsearchshow=true;
  }
});

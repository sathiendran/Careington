(function(){
    angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner',   ['$http', '$rootScope', '$ionicPlatform' ,function ($http, $rootScope, $ionicPlatform){
        return {
            link: function (scope, elm, attrs)
            {
                $rootScope.spinnerActive = false;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading)
                { 
                    $rootScope.spinnerActive = loading;					 	
                    if(loading){
						if ($rootScope.currState.$current.name != "tab.chooseEnvironment") {
							elm.removeClass('ng-hide');						
							elm.css({
								'top' : 0, 
								'left' : 0, 
								'right' : 0, 
								'bottom' : 0, 
								'z-index' : 90000,
								'background-color' : '#666',
								'opacity' : 0.5,
								'position' : 'absolute'
							});
							$ionicPlatform.registerBackButtonAction(function (event) {	
								elm.css({
								'top' : 0, 
								'left' : 0, 
								'right' : 0, 
								'bottom' : 0, 
								'z-index' : 90000,
								'background-color' : '#666',
								'opacity' : 0.5,
								'position' : 'absolute'
							});	
								//alert('bbbb');
								//event.preventDefault();
							 }, 100); 
						}
                    }else{
                       elm.addClass('ng-hide');
						$ionicPlatform.registerBackButtonAction(function (event, $state) {	 
							if ( ($rootScope.currState.$current.name=="tab.userhome") ||
								 ($rootScope.currState.$current.name=="tab.waitingRoom") ||	
								 ($rootScope.currState.$current.name=="tab.receipt") || 	
								 ($rootScope.currState.$current.name=="tab.videoConference") ||
								 ($rootScope.currState.$current.name=="tab.ReportScreen")
								){ //alert('a'); 
									// H/W BACK button is disabled for these states (these views)
									// Do not go to the previous state (or view) for these states. 
									// Do nothing here to disable H/W back button.
								}else if($rootScope.currState.$current.name=="tab.login"){									 
									navigator.app.exitApp();
									//alert('a1');
								}else if($rootScope.currState.$current.name=="tab.loginSingle"){
									navigator.app.exitApp();
								}else {								
											
									navigator.app.backHistory();
									
								}
						}, 100); 
						/*$ionicPlatform.registerBackButtonAction(function (event, $state) {	
							if($rootScope.currState.$current.name=="tab.login"){									 
									navigator.app.exitApp();
									//alert('a1');
								}else {
									
								}
						}, 100); */
                    }
                });
            }
        };

    }]);
}).call(this);

(function(){
    angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner',   ['$http', '$rootScope', '$ionicPlatform', '$ionicLoading' ,function ($http, $rootScope, $ionicPlatform, $ionicLoading){
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
                        elm.addClass('ng-hide');
						if ($rootScope.currState.$current.name != "tab.chooseEnvironment" && $rootScope.currState.$current.name != "tab.singleTheme") {
                            $ionicLoading.show({
                                template: '<img src="img/puff.svg" alt="Loading" />'
                            });
						}
                    }else{
                       elm.addClass('ng-hide');
                       $ionicLoading.hide();

					}

                });
            }
        };

    }]);
}).call(this);

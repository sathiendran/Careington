angular.module('starter.controllers')
    .controller('addnewuserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate,
        $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log,
        $ionicPopup, ageFilter, $window, $timeout) {        
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
        }

        $rootScope.adddependent = function() {
            $rootScope.doGetOrgLoclist();
            $rootScope.newDependentImagePath = '';
            $('select').prop('selectedIndex', 0);
            $state.go('tab.addnewdependent');
        }

        $rootScope.addcouser = function() {
            $rootScope.newCoUserImagePath = '';
            $rootScope.doGetOrgLoclist();
            $('select').prop('selectedIndex', 0);
            $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
            $state.go('tab.addUser');
  }
        $rootScope.doGetOrgLoclist = function() {

            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }

            var params = {
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.orgloclist = [];
                    angular.forEach(data.data, function(index, item) {
                        $rootScope.orgloclist.push({
                            'locations': angular.fromJson(index.locations),
                            'name': index.name,
                            'id': index.id
                        });
                    });
                    $rootScope.listOfOrganization = $rootScope.orgloclist;
                    var listOfLocation = $rootScope.orgloclist;
                    $rootScope.locationdetails = _.pluck(listOfLocation, 'locations');
                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.getListOfLocationOrganization(params);

        }
        $timeout(function() {
            $('option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);



    });

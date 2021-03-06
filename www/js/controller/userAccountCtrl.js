angular.module('starter.controllers')
    .controller('userAccountCtrl', function($scope, $ionicScrollDelegate, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $filter, $timeout, SurgeryStocksListService, $ionicLoading) {
        $rootScope.drawSVGCIcon = function(iconName) {
            return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        };

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
            } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
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

        $scope.getPatientProfile = function() {
            $state.go('tab.healthinfo');
        }

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

        $scope.doRefreshAccount = function() {
            $rootScope.doGetIndividualScheduledConsulatation();
            $timeout(function() {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        };
        $scope.doRefreshUserPage = function() {
            $rootScope.doGetIndividualScheduledConsulatation();
            $timeout(function() {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        };
        $rootScope.getManageProfile = function(currentPatientDetails) {
            $rootScope.currentPatientDetails = currentPatientDetails;
            $rootScope.doddate = $rootScope.currentPatientDetails[0].dob;
            $rootScope.restage = getAge($rootScope.doddate);
            if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId == $rootScope.currentPatientDetails[0].account.patientId)) {
                $rootScope.viewemailDisplay = 'flex';
                $rootScope.viewtimezoneDisplay = 'flex';
            } else {
                $rootScope.viewemailDisplay = 'none';
                $rootScope.viewtimezoneDisplay = 'none';
            }

            if ($rootScope.primaryPatientId == $rootScope.currentPatientDetails[0].account.patientId) {
                $rootScope.viewmyhealthDisplay = 'block';
                $rootScope.viewhealthDisplay = 'none';
            } else {
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
            }
            if ($rootScope.currentPatientDetails[0].gender == 'M') {
                $rootScope.userGender = "Male";
                $rootScope.isCheckedMale = true;
            } else if ($rootScope.currentPatientDetails[0].gender == 'F') {
                $rootScope.userGender = "Female";
                $rootScope.isCheckedFemale = true;
            }
            $rootScope.passededconsultants();
            $rootScope.connection;
            $state.go('tab.healthinfo');
        }

        var primaryvalue = $rootScope.PatientPrimaryConcernItem;
        $scope.goToPatientConcerns = function(currentPatientDetails) {
            var currentLocation = window.location;
            var loc = currentLocation.href;
            var newloc = loc.split("#");
            var locat = newloc[1];
            var sploc = locat.split("/");
            var cutlocations = sploc[1] + "." + sploc[2];
            $rootScope.getCheckedPrimaryConcern;
            $rootScope.PatientPrimaryConcernItem;
            $scope.PatientPrimaryConcernItem = false;
            $rootScope.Patconcern = "";
            $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
            $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
            $rootScope.PatientPrimaryConcern = "";
            $rootScope.PrimaryCount = "";
            $rootScope.checkedPrimary = 0;
            $rootScope.secondaryConcernList = "";
            $scope.PatientPrimaryConcernItem = "";
            $rootScope.getCheckedPrimaryConcern = false;
            $rootScope.PatientSecondaryConcern = "";
            $rootScope.PatientChronicCondition = "";
            $rootScope.patinentCurrentMedication = "";
            $rootScope.patinentMedicationAllergies = "";
            $rootScope.patientSurgeriess = "";
            $rootScope.MedicationCount == 'undefined';
            $rootScope.checkedChronic = 0;
            $rootScope.ChronicCount = "";
            $rootScope.AllegiesCount = "";
            $rootScope.checkedAllergies = 0;
            $rootScope.MedicationCount = "";
            $rootScope.checkedMedication = 0;
            $rootScope.IsValue = "";
            $rootScope.IsToPriorCount = "";
            $rootScope.ChronicCountValidCount = "";
            $rootScope.PriorSurgeryValidCount = "";
            $rootScope.AllegiesCountValid = "";
            $rootScope.MedicationCountValid = "";
            $rootScope.GoUserPatientDetails(cutlocations, currentPatientDetails[0].account.patientId, 'tab.patientConcerns');
        }

        $rootScope.doGetCurrentUserAppointment = function() {
            $rootScope.passededconsultants();
            if ($rootScope.primaryPatientId == $rootScope.currentPatientDetails[0].account.patientId) {
                $rootScope.viewmyhealthDisplay = 'block';
                $rootScope.viewhealthDisplay = 'none';
            } else {
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
            }
            $state.go('tab.appointmentpatientdetails');
        }
    })

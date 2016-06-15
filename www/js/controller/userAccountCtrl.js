angular.module('starter.controllers')
    .controller('userAccountCtrl', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $filter) {
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
        /*  $rootScope.doGetListOfCodeSet = function() {
             var params = {
               accessToken: $rootScope.accessToken,
               hospitalId: $rootScope.hospitalId,
               success: function(data) {
                 $rootScope.eyeHairEthnicityRelationCodeSets = [];
                 angular.forEach(data.data, function(index, item) {
                   $rootScope.eyeHairEthnicityRelationCodeSets.push({
                     'codes': angular.fromJson(index.codes),
                     'hospitalId': index.hospitalId,
                     'name': index.name
                   });
                 });
                 $rootScope.listOfEyeColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Eye Color" });
                 $rootScope.listOfHairColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Hair Color" });
                 $rootScope.listOfEthnicity = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Ethnicity" });
                 $rootScope.listOfRelationship = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Relationship" });
                 $rootScope.listOfHeightunit= $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Patient Height" });
                 $rootScope.listOfWeightunit= $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Patient Weight" });
                 $rootScope.listOfBloodtype= $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, { name: "Blood Type" });
                   $state.go('tab.healthinfo');
               },
               error: function(data) {
                   $rootScope.serverErrorMessageValidation();
               }
             };
             LoginService.getListOfCodeSet(params);
           }*/

        $rootScope.getManageProfile = function(currentPatientDetails) {
            $rootScope.currentPatientDetails = currentPatientDetails;
            //     var date = new Date($rootScope.currentPatientDetails[0].dob);
            //$rootScope.userDOB = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            //   $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");
            if ($rootScope.currentPatientDetails[0].gender == 'M') {
                $rootScope.userGender = "Male";
                $rootScope.isCheckedMale = true;
            } else if ($rootScope.currentPatientDetails[0].gender == 'F') {
                $rootScope.userGender = "FeMale";
                $rootScope.isCheckedFeMale = true;
            }
            $rootScope.passededconsultants();

            $state.go('tab.healthinfo');
            //  $rootScope.doGetListOfCodeSet();
        }

        $scope.goToPatientConcerns = function() {
            $state.go('tab.patientConcerns');
        }

        $rootScope.doGetCurrentUserAppointment = function() {
            $state.go('tab.appointmentpatientdetails');
            $rootScope.passededconsultants();
        }


        $rootScope.passededconsultants = function() {

            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                statusId: 72,
                success: function(data) {
                    $rootScope.Passedconsultations = data.data;

                },
                error: function(data) {
                    $scope.listOfConsultations = 'Error getting List Of Consultations';
                }
            };
            LoginService.getListOfPassedConsultations(params);

        }




    })

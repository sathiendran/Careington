angular.module('starter.controllers')
    .controller('userAccountCtrl', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $filter, SurgeryStocksListService) {
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
            var doddate = new Date($rootScope.currentPatientDetails[0].dob);
            var today = new Date();
            var nowyear = today.getFullYear();
            var nowmonth = today.getMonth() + 1;
            var nowday = today.getDate();
            var dateofb = new Date(doddate)
            var birthyear = dateofb.getFullYear();
            var birthmonth = dateofb.getMonth();
            var birthday = dateofb.getDate();
            var age = nowyear - birthyear;
            var age_month = nowmonth - birthmonth;
            var age_day = nowday - birthday;
            if (age_month < 0 || (age_month == 0 && age_day < 0)) {
                age = parseInt(age) - 1;
            }
            if (age >= 12) {
                $rootScope.viewemailDisplay = 'flex';
                $rootScope.viewtimezoneDisplay='flex';
            } else {
                $rootScope.viewemailDisplay = 'none';
                $rootScope.viewtimezoneDisplay='none';

            }

            //$rootScope.userDOB = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            //   $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");
            if ($rootScope.currentPatientDetails[0].gender == 'M') {
                $rootScope.userGender = "Male";
                $rootScope.isCheckedMale = true;
            } else if ($rootScope.currentPatientDetails[0].gender == 'F') {
                $rootScope.userGender = "Female";
                $rootScope.isCheckedFemale = true;
            }
            $rootScope.passededconsultants();

            $state.go('tab.healthinfo');
            //  $rootScope.doGetListOfCodeSet();
        }
var primaryvalue=$rootScope.PatientPrimaryConcernItem;
//var patvalue=primaryvalue[0].checked;
//if($rootScope.PatientPrimaryConcernItem[0].checked=true){
//$rootScope.Patconcern=$rootScope.PatientPrimaryConcernItem[0].checked==false;
//alert($rootScope.Patoncern);
//}
        $scope.goToPatientConcerns = function() {
            $rootScope.getCheckedPrimaryConcern;
            $rootScope.PatientPrimaryConcernItem;
              $scope.PatientPrimaryConcernItem=false;
              $rootScope.Patconcern="";
          //  $rootScope.PatientPrimaryConcernItem[0].checked=false;
            $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
            $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
            $rootScope.PatientPrimaryConcern = "";
            $rootScope.PrimaryCount = "";
            $rootScope.checkedPrimary=0;
            $rootScope.secondaryConcernList = "";
            $scope.PatientPrimaryConcernItem = "";
              $rootScope.getCheckedPrimaryConcern=false;
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
            //SurgeryStocksListService.ClearSurgery();
            $state.go('tab.patientConcerns');
        }

        $rootScope.doGetCurrentUserAppointment = function() {

            $rootScope.passededconsultants();
            $state.go('tab.appointmentpatientdetails');
        }




    })

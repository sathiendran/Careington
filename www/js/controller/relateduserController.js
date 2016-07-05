angular.module('starter.controllers')
    .controller('relateduserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicPopup, ageFilter, $window, $filter) {
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



        $scope.showdetails = true;

        $scope.showarchieve = false;
        $scope.allval = true;
        $scope.userdata = false;
        $scope.dependentshide = true;
        $scope.tabview = false;
        $scope.moretab = false;
        $scope.viewunauthorized = false;
        $scope.authorizedview = false;
        $scope.moredetails = function() {
            $scope.showdetails = false;
            $scope.showarchieve = true;
            $scope.usersearchinfocontent = false;
            $scope.userinfoshow = false;
            $scope.userdone = false;
            $scope.useradd = false;
            $scope.userinfosubheader = false;
            $scope.usersearchsubheader = false;
            $scope.usertab = false;
        };

        $scope.userdetails = function() {
            $scope.tabview = false;
            $scope.newarchieve = true;
        };
        $scope.archievedetails = function() {
            $scope.showarchieve = false;
            $scope.showdetails = true;
        };

        $scope.archieve = function(P_Id) {
            $scope.newarchieve = true;
            //  $scope.showdnewetails = false;
            //  $rootScope.selectedRelatedDependentDetails = [];
            $rootScope.doGetSelectedPatientProfiles(P_Id, 'tab.relatedusers', '');

        };
        $scope.showtab = function(tabview) {
            $scope.tabView = true;
            $scope.moretab = false;
            $scope.patientIDWithTab = $window.localStorage.getItem('patientIDWithTab');
            if ($scope.patientIDWithTab === tabview) {
                $scope.tabWithPatientId = '';
                $window.localStorage.setItem('patientIDWithTab', '');
            } else {
                $scope.tabWithPatientId = tabview;
                $window.localStorage.setItem('patientIDWithTab', $scope.tabWithPatientId);
                if (typeof $scope.tabview === 'undefined') {
                    $scope.tabview = false;
                }
                $scope.tabview = $scope.tabview === false ? true : false;
            }

        };

        $scope.moreclickval = function(tabview) {
            $scope.tabView = false;
            $scope.tabWithPatientId = tabview;
            $window.localStorage.setItem('patientIDWithTab', $scope.tabWithPatientId);
            $scope.moretab = true;
        }

        $scope.hidemoretab = function() {
            $scope.moretab = false;
            $scope.tabView = true;
        }
        $scope.authorizeduser = function(tabWithPatientId) {
            $scope.patientIDWithTab = $window.localStorage.getItem('patientIDWithTab');
            if ($scope.patientIDWithTab === tabWithPatientId) {
                $scope.tabWithPatientId = '';
                $window.localStorage.setItem('patientIDWithTab', '');
            } else {
                $scope.tabWithPatientId = tabWithPatientId;
                $window.localStorage.setItem('patientIDWithTab', $scope.tabWithPatientId);
                //var myEl = angular.element( document.querySelector( '#authorizeddiv' ));
                // myEl.removeClass('fadediv');
                //  $scope.viewunauthorized = $scope.viewunauthorized === false ? true: false;

                $scope.viewunauthorized = true;
                $scope.authorizedview = false;
            }
        }


        $scope.addauthorized = function(tabWithPatientId) {
            $scope.tabWithPatientId = tabWithPatientId;
            $window.localStorage.setItem('patientIDWithTab', $scope.tabWithPatientId);
            $scope.viewunauthorized = false;
            $scope.authorizedview = true;
        }

        $rootScope.doUpdateDependentsAuthorize = function(relateDependentId, relateDependentRelationCode, relateDependentAuthorize) {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: relateDependentId,
                RelationCodeId: relateDependentRelationCode,
                IsAuthorized: relateDependentAuthorize,
                success: function(data) {
                    $scope.authorizedview = false;
                    //myPopup.close();
                    $rootScope.doGetAccountDependentDetails();
                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.updateDependentsAuthorize(params);
        }



        $scope.showPopup = function(dependentDetails, relateDependentAuthorize) {
$rootScope.authorised=relateDependentAuthorize;
            if (!angular.isUndefined(dependentDetails.birthdate) && dependentDetails.birthdate !== '') {
                $scope.dob = " . " + dependentDetails.birthdate;
            } else {
                $scope.dob = '';
            }
            if (!angular.isUndefined(dependentDetails.relationship) && dependentDetails.relationship !== '') {
                $scope.relationship = " . " + dependentDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            if($rootScope.authorised=="F")
            {
              var myPopup = $ionicPopup.show({

                  title: "<a class='item-avatar'>  <img src='" + dependentDetails.profileImagePath + "'><span><span class='fname'><b>" + dependentDetails.patientFirstName + "</b></span> <span class='sname'>" + dependentDetails.patientLastName + "</span> <span class='sname'>" + relateDependentAuthorize + "</span> </span></a> ",
                  subTitle: "<p class='fontcolor'>" + dependentDetails.gender + $scope.dob + $scope.relationship + "</p>",
                  //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',

                  templateUrl: 'templates/popupTemplate.html',
                  scope: $scope,
                  buttons: [{
                      text: '<b class="fonttype">Cancel</b>',
                      onTap: function(e) {
                          return false;
                      }
                  }, {
                      text: '<b class="fonttype">Confirm</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                              return true;
                          }
                          /*onTap: function(e) {
                            if (!$scope.Confirm) {
                                 $scope.authorizedview=false;
                                  myPopup.close();
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                            } else {

                            }
                          }*/
                  }, ]
              });
            }else{
              var myPopup = $ionicPopup.show({

                  title: "<div class='ion-close-round closeicon' ></div><a class='item-avatar'>  <img src='" + dependentDetails.profileImagePath + "'><span><span class='fname'><b>" + dependentDetails.patientFirstName + "</b></span> <span class='sname'>" + dependentDetails.patientLastName + "</span> <span class='sname'>" + relateDependentAuthorize + "</span> </span></a> ",
                  subTitle: "<p class='fontcolor'>" + dependentDetails.gender + $scope.dob + $scope.relationship + "</p>",
                  //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',

                  templateUrl: 'templates/unauthorizedpopup.html',
                  scope: $scope,
                  buttons: [{
                      text: '<b class="fonttype">Cancel</b>',
                      onTap: function(e) {
                          return false;
                      }
                  }, {
                      text: '<b class="fonttype">Confirm</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                              return true;
                          }

                  }, ]
              });
            }

            myPopup.then(function(res) {
                if (res) {
                    $rootScope.doUpdateDependentsAuthorize(dependentDetails.patientId, dependentDetails.relationCode, relateDependentAuthorize);
                } else {

                }

            });

        };

        $scope.userslist = function() {
            $scope.doGetListOfCoUsers();
            var myEl = angular.element(document.querySelector('#users'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#dependents'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');

            var myEl = angular.element(document.querySelector('#couserlist'));
            myEl.addClass('couses');
            myEl.removeClass('dependusers');

            var myEl = angular.element(document.querySelector('#dependuserlist'));
            myEl.removeClass('couses');
            myEl.addClass('dependusers');



        /*    $rootScope.CImage = apiCommonURL + '/images/default-user.jpg';
            var ptInitial = getInitialForName($rootScope.patientInfomation.patientName + ' ' + $rootScope.patientInfomation.lastName);
            $rootScope.PatientImage = generateTextImage(ptInitial, $rootScope.brandColor);*/









        };


        $scope.dependentslist = function() {
            $scope.tabWithPatientId = '';
            $window.localStorage.setItem('patientIDWithTab', '');
            var myEl = angular.element(document.querySelector('#dependents'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#users'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#dependuserlist'));
            myEl.addClass('couses');
            myEl.removeClass('dependusers');

            var myEl = angular.element(document.querySelector('#couserlist'));
            myEl.removeClass('couses');
            myEl.addClass('dependusers');
            $rootScope.doGetAccountDependentDetails();
        }


        $rootScope.doGetAccountDependentDetails = function() {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.listOfAccountDependents = [];
                    angular.forEach(data.data, function(index, item) {
                var getRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                            codeId: index.relationCode
                        })
                        if (getRelationShip.length !== 0) {
                            var relationShip = getRelationShip[0].text;
                        } else {
                            var relationShip = '';
                        }
                        if (index.gender == 'M') {
                            var gender = "Male";
                        } else if (index.gender == 'F') {
                            var gender = "FeMale";
                        }
                        if(index.profileImagePath){
                            $scope.iDependentPatientPhoto = index.profileImagePath;
                        }else{
                            $scope.iDependentPatientInitial = getInitialForName(index.patientName);
                            $scope.iDependentPatientPhoto = generateTextImage($scope.iDependentPatientInitial, $rootScope.brandColor);
                        }
                        $rootScope.listOfAccountDependents.push({
                            'addresses': index.addresses,
                            'profileImagePath': $scope.iDependentPatientPhoto,
                            'birthdate': ageFilter.getDateFilter(index.birthdate),
                            'bloodType': index.bloodType,
                            'ethnicity': index.ethnicity,
                            'eyeColor': index.eyeColor,
                            'gender': gender,
                            'guardianFirstName': index.guardianFirstName,
                            'guardianLastName': index.guardianLastName,
                            'guardianName': index.guardianName,
                            'hairColor': index.hairColor,
                            'height': index.height,
                            'heightUnit': index.heightUnit,
                            'homePhone': index.homePhone,
                            'isAuthorized': index.isAuthorized,
                            'mobilePhone': index.mobilePhone,
                            'patientFirstName': index.patientFirstName,
                            'patientId': index.patientId,
                            'tabPatientId': 'tab' + index.patientId,
                            'patientLastName': index.patientLastName,
                            'patientName': index.patientName,
                            'personId': index.personId,
                            'relationCode': index.relationCode,
                            'relationship': relationShip,
                            'weight': index.weight,
                            'weightUnit': index.weightUnit
                        });
                    });
                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.getAccountDependentDetails(params);
        }
        $scope.gpToAppointments = function() {
            $state.go('tab.appointmentpatientdetails');
        }
        $scope.goToConsultations = function() {
            $state.go('tab.consultations');
        }
        $scope.seeaPatientConcerns = function(patientId,clickEvent) {
          if($rootScope.onDemandAvailability > 0) {
            $rootScope.doGetSelectedPatientProfiles(patientId,'tab.patientConcerns','seeADoc');
          } else {
            $scope.ErrorMessage = "Physician or On demand unavailable. Please try again later!";
            $rootScope.Validation($scope.ErrorMessage);
          }
        }
        $rootScope.patientprofile = function(currentPatientDetails) {
            $rootScope.currentPatientDetails = currentPatientDetails;

            if ($rootScope.currentPatientDetails[0].gender == 'M') {
                $rootScope.userGender = "Male";
                $rootScope.isCheckedMale = true;
            } else if ($rootScope.currentPatientDetails[0].gender == 'F') {
                $rootScope.userGender = "FeMale";
                $rootScope.isCheckedFeMale = true;
            }
            $rootScope.passededconsultants();
            $state.go('tab.healthinfo');

        }

        /* Relationship Search */
        $scope.alphabet = iterateAlphabet();
        var tmp = {};

        function iterateAlphabet() {
            var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var numbers = new Array();
            for (var i = 0; i < str.length; i++) {
                var nextChar = str.charAt(i);
                numbers.push(nextChar);
            }
            return numbers;
        }
        $scope.groups = [];
        for (var i = 0; i < 10; i++) {
            $scope.groups[i] = {
                name: i,
                items: []
            };
            for (var j = 0; j < 3; j++) {
                $scope.groups[i].items.push(i + '-' + j);
            }
        }
        /* Seach Done*/

        $scope.selectrelation = function() {
            $scope.useradd = true;
            $scope.userdone = true;
            $scope.userinfosubheader = true;
            $scope.usersearchsubheader = true;
            $scope.userinfoshow = true;
            $scope.usersearchinfocontent = true;
            $scope.usertab = true;
        }

        $scope.usersearchdone = function() {
            $scope.useradd = false;
            $scope.userdone = false;
            $scope.userinfosubheader = false;
            $scope.usersearchsubheader = false;
            $scope.userinfoshow = false;
            $scope.usersearchinfocontent = false;
            $scope.usertab = false;
        }

        $rootScope.coUserArchieve = function(coUserDetails) {
            if (!angular.isUndefined(coUserDetails.dob) && coUserDetails.dob !== '') {
                $scope.dob = " . " + coUserDetails.dob;
            } else {
                $scope.dob = '';
            }
            if (!angular.isUndefined(coUserDetails.relationship) && coUserDetails.relationship !== '') {
                $scope.relationship = " . " + coUserDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: "<a class='item-avatar'>  <img src='" + coUserDetails.imagePath + "'><span><span class='fname'><b>" + coUserDetails.name + "</b></span> <span class='sname'>" + coUserDetails.lastname + "</span></span></a> ",
                subTitle: "<p class='fontcolor'>" + coUserDetails.gender + $scope.dob + $scope.relationship + "</p>",
                //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
                templateUrl: 'templates/coUserTemplate.html',
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: '<b>Archieve</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        return true;
                    }
                }, ],
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.doDeleteAccountUser(coUserDetails.userId);
                } else {
                    $scope.showdnewetails = false;
                    $scope.allval = false;
                }
            });
        }

        $rootScope.coUserUnlink = function(coUserDetails) {
            if (!angular.isUndefined(coUserDetails.dob) && coUserDetails.dob !== '') {
                $scope.dob = " . " + coUserDetails.dob;
            } else {
                $scope.dob = '';
            }
            if (!angular.isUndefined(coUserDetails.relationship) && coUserDetails.relationship !== '') {
                $scope.relationship = " . " + coUserDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: "<a class='item-avatar'>  <img src='" + coUserDetails.imagePath + "'><span><span class='fname'><b>" + coUserDetails.name + "</b></span> <span class='sname'>" + coUserDetails.lastname + "</span></span></a> ",
                subTitle: "<p class='fontcolor'>" + coUserDetails.gender + $scope.dob + $scope.relationship + "</p>",
                //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
                templateUrl: 'templates/coUserTemplate.html',
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: '<b>Unlink</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        return true;
                    }
                }, ],
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.doDeleteAccountCoUser(coUserDetails.patientId);
                } else {
                    $scope.showdnewetails = false;
                    $scope.allval = false;
                }
            });
        }



    });

angular.module('starter.controllers')

.controller('healthinfoController', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading) {

  $rootScope.couserdetails=false;
  $rootScope.dupcouser=false;
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
    $scope.healthInfoModel = {};
    $scope.addmore = false;
    $scope.healthhide = true;
    $scope.headerval = false;
    $scope.editshow = true;
    $scope.doneshow = true;
    $scope.readattr = false;
    $scope.doneedit = false;
    $scope.editshow = true;
    $scope.editimg = false;
    $scope.viewimg = true;
    //  $scope.healthinfoshow=true;
    // $scope.healthinfosubheader=true;
    //   $scope.searchdone=true;
    //  $scope.healthsearchsubheader=true;
    //  $scope.healthsearchinfo=true;
    //   $scope.healthtab=true;
    $rootScope.flag = true;




    $scope.edittext = function() {
        $scope.readattr = false;
        $scope.doneshow = false;
        $scope.editshow = false;
        $rootScope.flag = false;
        $scope.viewimg = false;
        $scope.doneedit = true;
        $scope.editimg = true;
        $('#ss').hide();
        $('#aaa').show();
        var editsvalues = angular.element(document.getElementsByTagName('input'));
        var edittextarea = angular.element(document.getElementsByTagName('textarea'));
        $scope.phoneval=$rootScope.currentPatientDetails[0].homePhone;
        $scope.mobileval=$rootScope.currentPatientDetails[0].mobilePhone;

        editsvalues.removeClass('textdata');
        edittextarea.removeClass('textdata');
        editsvalues.addClass('editdata');
        edittextarea.addClass('editdata');
        $scope.healthInfoModel.userDOB = $rootScope.userDOB;
    }

    //$scope.healthInfo = {};
    $scope.putUpdatePatientDetails = function() {
      $scope.editimg = true;
      $scope.viewimg = false;
            $scope.healthInfoFirstName = $('#healthInfoFirstName').val();
            $scope.healthInfoLastName = $('#healthInfoLastName').val();
            $scope.healthInfoDOB = $('#healthInfoDOB').val();
            $scope.healthInfoEmail = $('#healthInfoEmail').val();
            $scope.healthInfoGender = $("input[name='healthInfoGender']:checked").val();
            $scope.healthInfoHeight = $('#healthInfoHeight').val();
            $scope.HeightUnit = $('#healthInfoHeightUnit').val();
            $scope.HeightUnit1 = $scope.HeightUnit.split("@");
            $scope.healthInfoHeightUnit = $scope.HeightUnit1[0];
            $scope.healthInfoHeightUnitText = $scope.HeightUnit1[1];
            $scope.healthInfoWeight = $('#healthInfoWeight').val();
            $scope.WeightUnit = $('#healthInfoWeightUnit').val();
            $scope.WeightUnit1 = $scope.WeightUnit.split("@");
            $scope.healthInfoWeightUnit = $scope.WeightUnit1[0];
            $scope.healthInfoWeightUnitText = $scope.WeightUnit1[1];
            $scope.healthInfoHomePhone = $('#healthInfoHomePhone').val()
            $scope.healthInfoMobilePhone = $('#healthInfoMobilePhone').val();
            $scope.healthInfoAddress = $('#healthInfoAddress').val();
            $scope.healthInfoOrganization = $('#healthInfoOrganization').val();
            $scope.healthInfoLocation = $('#healthInfoLocation').val();
            $scope.healthInfoHairColor = $('#healthInfoHairColor').val();
            $scope.splitHairColor = $scope.healthInfoHairColor.split("@");
            $scope.getHairColorId = $scope.splitHairColor[0];
            $scope.getHairColorText = $scope.splitHairColor[1];
            $scope.healthInfoEyeColor = $('#healthInfoEyeColor').val();
            $scope.splitEyeColor = $scope.healthInfoEyeColor.split("@");
            $scope.getEyeColorId = $scope.splitEyeColor[0];
            $scope.getEyeColorText = $scope.splitEyeColor[1];
            $scope.healthInfoEthnicity = $('#healthInfoEthnicity').val();
            $scope.splitEthnicity = $scope.healthInfoEthnicity.split("@");
            $scope.getEthnicityId = $scope.splitEthnicity[0];
            $scope.getEthnicityText = $scope.splitEthnicity[1];
            $scope.healthInfoBloodType = $('#healthInfoBloodType').val();
            $scope.splitBloodType = $scope.healthInfoBloodType.split("@");
            $scope.getBloodTypeId = $scope.splitBloodType[0];
            $scope.getBloodTypeText = $scope.splitBloodType[1];

            $scope.ValidateEmail = function(email) {
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };

            if (typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '') {
                $scope.ErrorMessage = "Please Enter Your First Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '') {
                $scope.ErrorMessage = "Please Enter Your Last Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '') {
                $scope.ErrorMessage = "Please Select Your DOB";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '') {
                $scope.ErrorMessage = "Please Enter Your Email Id";
                $rootScope.Validation($scope.ErrorMessage);
            }  else if (typeof $scope.healthInfoHomePhone === 'undefined' || $scope.healthInfoHomePhone === '') {
                $scope.ErrorMessage = "Please Enter Your Home Phone";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoMobilePhone === 'undefined' || $scope.healthInfoMobilePhone === '') {
                $scope.ErrorMessage = "Please Enter Your Mobile Phone";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoAddress === 'undefined' || $scope.healthInfoAddress === '') {
                $scope.ErrorMessage = "Please Enter Your Address";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoGender === 'undefined' || $scope.healthInfoGender === '') {
                $scope.ErrorMessage = "Please Select Your Gender";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoHeight === 'undefined' || $scope.healthInfoHeight === '') {
                $scope.ErrorMessage = "Please Enter Your Height";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                $scope.ErrorMessage = "Please Select Your Height Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                $scope.ErrorMessage = "Please Enter Your Weight";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                $scope.ErrorMessage = "Please Select Your Weight Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '') {
                $scope.ErrorMessage = "Please Select Your Ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '') {
                $scope.ErrorMessage = "Please Select Your Hair Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '') {
                $scope.ErrorMessage = "Please Select Your Eye Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '') {
                $scope.ErrorMessage = "Please Select Your Blood Type";
                $rootScope.Validation($scope.ErrorMessage);
            }
            else {
                $scope.doPutProfileUpdation();
            }


        }
        //$rootScope.currentPatientDetails[0].account.email
    $rootScope.doPutProfileUpdation = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            emailAddress: $scope.healthInfoEmail,
            patientProfileData: {
                patientId: $rootScope.patientId, //$rootScope.currentPatientDetails[0].account.patientId,
                patientName: $scope.healthInfoFirstName,
                lastName: $scope.healthInfoLastName,
                dob: $scope.healthInfoDOB,
                bloodType: $scope.getBloodTypeId,
                eyeColor: $scope.getEyeColorId,
                gender: $scope.healthInfoGender,
                ethnicity: $scope.getEthnicityId,
                hairColor: $scope.getHairColorId,
                homePhone: $scope.healthInfoHomePhone,
                mobilePhone: $scope.healthInfoMobilePhone,
                schoolName: "",
                schoolContact: "",
                primaryPhysician: null,
                primaryPhysicianContact: null,
                physicianSpecialist: null,
                physicianSpecialistContact: null,
                preferedPharmacy: null,
                pharmacyContact: null,
                address: $scope.healthInfoAddress,
                profileImagePath: $rootScope.PatientImageSelectUser,
                height: $scope.healthInfoHeight,
                weight: $scope.healthInfoWeight,
                heightUnit: $scope.healthInfoHeightUnit,
                weightUnit: $scope.healthInfoWeightUnit,
                organizationId: $scope.healthInfoOrganization,
                locationId: $scope.healthInfoLocation,
                country: "+1"
            },
            timeZoneId: 2,
            patientProfileFieldsTracing: {
                ethnicity: true,
                address: true,
                bloodType: true,
                hairColor: true,
                eyeColor: true,
                country: true,
                height: true,
                heightUnit: true,
                weight: true,
                weightUnit: true,
                patientName: true,
                dob: true,
                gender: true,
                mobilePhone: true,
                lastName: true,
                email: true,
                timeZone: true
            },
            patientMedicalHistoryData: {
                patientId: $rootScope.currentPatientDetails[0].account.patientId,
            },
            success: function(data) {
              $scope.uploadPhotoForExistingPatient();
                  $rootScope.currentPatientDetails=$rootScope.currentPatientDetails[0];
                console.log(data);
                //  $rootScope.doGetPatientProfiles();
            //    $rootScope.getManageProfile(currentPatientDetails);
                $rootScope.doGetSelectedPatientProfiles(data.patientID);
                $scope.readattr = true;
                $scope.editshow = true;
                $scope.doneshow = true;
                $rootScope.flag = true;
                $scope.doneedit = false;
                //console.log($scope.healthInfo);
                var editvalues = angular.element(document.getElementsByTagName('input'));
                var edittextarea = angular.element(document.getElementsByTagName('textarea'));
                editvalues.removeClass('editdata');
                editvalues.addClass('textdata');
                edittextarea.removeClass('editdata');
                edittextarea.addClass('textdata');
            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.putProfileUpdation(params);
    }

    function iterateAlphabet() {
        var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
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
    $scope.profile = function() {
        var myEl = angular.element(document.querySelector('#profid'));
        myEl.addClass('btcolor');
        myEl.removeClass('btnextcolor');
        var myEl = angular.element(document.querySelector('#healid'));
        myEl.removeClass('btcolor').css('color', '#11c1f3');
        myEl.addClass('btnextcolor');
        $scope.editshow = true;
        $scope.addmore = false;
        $scope.healthhide = true;
        $scope.doneshow = true;
        $scope.cancelshow = false;
        editvalues.removeClass('textdata');
        editvalues.addClass('editdata');
        edittextarea.removeClass('editdata');
        edittextarea.addClass('textdata');

    }

    $scope.health = function() {

      $rootScope.PatientMedicalProfileList = [];
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.PatientMedicalProfileList = data.data;
                $rootScope.patvalues = $rootScope.PatientMedicalProfileList;
                $rootScope.patientmedications = $rootScope.PatientMedicalProfileList[0].medications;
                $rootScope.CurMedicationCount = $scope.patientmedications.length;
                $rootScope.patientmedicationsallergies = $rootScope.PatientMedicalProfileList[0].medicationAllergies;
                $rootScope.CurAllergiesCount = $scope.patientmedicationsallergies.length;
                $rootScope.patientmedicalConditions = $rootScope.PatientMedicalProfileList[0].medicalConditions;
                $rootScope.ChronicCount = $scope.patientmedicalConditions.length;
                $rootScope.patientmedicalsurgeries = $rootScope.PatientMedicalProfileList[0].surgeries;
                // var patientmedical=$scope.PatientMedicalProfileList;
                //var medicationvalues=patientmedical[0].medications;
            },
            error: function(data) {

            }
        };
        LoginService.getPatientMedicalProfile(params);

        var myEl = angular.element(document.querySelector('#healid'));
        myEl.removeClass('btnextcolor');
        myEl.addClass('btcolor');
        var myEl = angular.element(document.querySelector('#profid'));
        myEl.removeClass('btcolor').css('color', '#11c1f3');
        myEl.addClass('btnextcolor');
        $scope.editshow = false;
        $scope.addmore = true;
        $scope.healthhide = false;
        $scope.doneshow = true;
        $scope.cancelshow = true;

    }


    $scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns';

    $rootScope.getCodesSetsForHospital = function(){
      var params = {
          hospitalId: $rootScope.hospitalId,
          accessToken: $rootScope.accessToken,
          fields: $scope.codesFields,
          success: function(data) {
              $rootScope.hospitalList = angular.fromJson(data.data[3].codes);
              $rootScope.currentMedicationsearchList = angular.fromJson(data.data[1].codes);
              $rootScope.medicationAllergiesearchList = angular.fromJson(data.data[2].codes);
              $rootScope.chronicConditionsearchList = angular.fromJson(data.data[0].codes);
          },
          error: function(data) {
              $rootScope.serverErrorMessageValidation();
          }
      };
      LoginService.getCodesSet(params);
    };

    $scope.getCodesSetsForHospital();

    $scope.healthsearch = function(patientmedications) {
  $scope.clearSelectionAndRebindSelectionList($rootScope.patientmedications, $rootScope.currentMedicationsearchList);

        if (typeof $rootScope.CurMedicationCount === 'undefined') {
            $rootScope.checkedMedication = 0;
        } else {
            $rootScope.checkedMedication = $rootScope.CurMedicationCount;
        }


        $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
        $ionicModal.fromTemplateUrl('templates/tab-currentmedicationsearch.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();

        });
  $scope.alphabet = iterateAlphabet();
        var users = $rootScope.currentMedicationsearchList;
        var userslength = users.length;
        var log = [];
        var tmp = {};
        for (i = 0; i < userslength; i++) {
            var letter = users[i].text.toUpperCase().charAt(0);
            if (tmp[letter] == undefined) {
                tmp[letter] = []
            }
            tmp[letter].push(users[i]);
        }
        $rootScope.sorted_users = tmp;

        $rootScope.gotoList = function(id) {

            $location.hash(id);
            $ionicScrollDelegate.anchorScroll();

        }

        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
    }


    $scope.medicationdone = function() {

        $rootScope.CurrentmedicationupdateList = [];
        $rootScope.CurrentMedicationsearchItem = $filter('filter')($rootScope.currentMedicationsearchList, {
            checked: true
        });

        if ($rootScope.CurrentMedicationsearchItem !== '') {
            $rootScope.patientmedicationsSearch = $rootScope.CurrentMedicationsearchItem;
            $rootScope.MedicationsCount = $rootScope.patientmedicationsSearch.length;

            for (var i = 0; i < $rootScope.MedicationsCount; i++) {
                $rootScope.CurrentmedicationupdateList.push({
                    code: $rootScope.CurrentMedicationsearchItem[i].codeId,
                    description: $rootScope.CurrentMedicationsearchItem[i].text
                });
            }
            console.log($rootScope.patientsearchmedications);
            console.log($rootScope.MedicationsCount);
            $scope.modal.hide();
        }

        $scope.InfantData = [];

        console.log($rootScope.patientmedicalsurgeries);
        console.log($rootScope.CurrentMedicationsearchSelected);
        console.log($rootScope.patientmedicalConditions);
        console.log($rootScope.patientmedicationsallergies);
        var params = {

            accessToken: $rootScope.accessToken,
            MedicationAllergies: $rootScope.patientmedicationsallergies,
            Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
            MedicalConditions: $rootScope.patientmedicalConditions,
            Medications: $rootScope.CurrentmedicationupdateList,
            InfantData: $scope.InfantData,
            PatientId: $rootScope.patientId,
            success: function(data) {
                $scope.health();
            },
            error: function(data) {
                $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
            }
        };

        LoginService.putPatientMedicalProfile(params);
    }

    $scope.OnSelectMedication = function(currentmedication) {
        if (currentmedication.checked === true ) {
            $rootScope.checkedMedication++;
            console.log($rootScope.checkedMedication);
        } else {
            $rootScope.checkedMedication--;
               currentmedication.checked === false;
        }

        if ((currentmedication.text === "Other - (List below)") && $rootScope.checkedMedication <= 4) {
            $scope.openOtherCurrentMedicationView(currentmedication);
        } else {
            if ($rootScope.checkedMedication == 4) {

             $rootScope.checkedMedication--;
                $scope.medicationdone();
            }if($rootScope.checkedMedication >= 4){
               currentmedication.checked === false;
                 $scope.modal.hide();
            }
        }

    }


    $scope.openOtherCurrentMedicationView = function(model) {
        $scope.data = {}
        $ionicPopup.show({
            template: '<textarea name="comment" id="comment-textarea" ng-model="data.CurrentMedicationOther" class="textAreaPop">',
            title: 'Enter Current Medication',
            subTitle: '',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    angular.forEach($rootScope.currentMedicationsearchList, function(item, index) {
                        if (item.checked) {
                            if (item.text === "Other - (List below)") item.checked = false;
                        }
                    });
                    $rootScope.checkedMedication--;
                }
            }, {
                text: '<b>Done</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.CurrentMedicationOther) {
                        e.preventDefault();
                    } else {
                        angular.forEach($rootScope.currentMedicationsearchList, function(item, index) {
                            if (item.checked) {
                                if (item.text === "Other - (List below)") {
                                    item.checked = false;
                                }
                            }
                        });

                        var newCurrentMedicationItem = {
                            text: $scope.data.CurrentMedicationOther,
                            checked: true
                        };

                        $rootScope.currentMedicationsearchList.splice(1, 0, newCurrentMedicationItem);
                        var users = $rootScope.currentMedicationsearchList;
                        var userslength = users.length;
                        var log = [];
                        var tmp = {};
                        for (i = 0; i < userslength; i++) {
                            var letter = users[i].text.toUpperCase().charAt(0);
                            if (tmp[letter] == undefined) {
                                tmp[letter] = []
                            }
                            tmp[letter].push(users[i]);
                        }
                        $rootScope.sorted_users = tmp;

                        $rootScope.gotoList = function(id) {
                            // var myEl = angular.element(document.querySelector('#cursearch'));
                            //  myEl.addClass('currmedication');
                            $location.hash(id);
                            $ionicScrollDelegate.anchorScroll();
                        }

                        if ($rootScope.checkedMedication >= 4) {
                            $scope.medicationdone();
                        }
                        return $scope.data.CurrentMedicationOther;
                    }
                }
            }]
        });
    };




    $scope.alergiessearch = function() {

      $scope.clearSelectionAndRebindSelectionList($rootScope.patientmedicationsallergies, $rootScope.medicationAllergiesearchList);
        if (typeof $rootScope.CurAllergiesCount === 'undefined') {
                $rootScope.checkedAllergies = 0;
            } else {
                $rootScope.checkedAllergies = $rootScope.CurAllergiesCount;
            }
        $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
        $scope.alphabets = iterateAlphabet();
        $ionicModal.fromTemplateUrl('templates/tab-allergiesearch.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        var usersallergie = $rootScope.medicationAllergiesearchList;
        var usersallergielength = usersallergie.length;
        var log = [];
        var tmpallergie = {};
        for (i = 0; i < usersallergielength; i++) {
            var letter = usersallergie[i].text.toUpperCase().charAt(0);
            if (tmpallergie[letter] == undefined) {
                tmpallergie[letter] = [];
            }
            tmpallergie[letter].push(usersallergie[i]);
        }
        $scope.sorted_usersallergie = tmpallergie;

        $scope.gotoallergyList = function(codeid) {
            $location.hash(codeid);
            $ionicScrollDelegate.anchorScroll();
        }
        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
    }
    $scope.allergiedone = function() {
        $scope.modal.hide();

        $rootScope.AllergiesupdateList = [];
        $rootScope.AllergiessearchItem = $filter('filter')($rootScope.medicationAllergiesearchList, {
            checked: true
        });
        $rootScope.AllergiesearchSelected = $filter('filter')($rootScope.medicationAllergiesearchList, {
            checked: true
        });
        if ($rootScope.AllergiessearchItem !== '') {
            $rootScope.patientallergiesSearch = $rootScope.AllergiessearchItem;
            $rootScope.AllergiesCount = $rootScope.patientallergiesSearch.length;

            for (var i = 0; i < $rootScope.AllergiesCount; i++) {
                $rootScope.AllergiesupdateList.push({
                    code: $rootScope.AllergiessearchItem[i].codeId,
                    description: $rootScope.AllergiessearchItem[i].text
                });
            }

            console.log($rootScope.AllergiesCount);
            $scope.modal.hide();
        }

        $scope.InfantData = [];

        console.log($rootScope.patientmedicalsurgeries);
        console.log($rootScope.AllergiesearchSelected);
        console.log($rootScope.patientmedicalConditions);
        console.log($rootScope.patientmedicationsallergies);
        var params = {

            accessToken: $rootScope.accessToken,
            MedicationAllergies: $rootScope.AllergiesupdateList,
            Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
            MedicalConditions: $rootScope.patientmedicalConditions,
            Medications: $rootScope.patientmedications,
            InfantData: $scope.InfantData,
            PatientId: $rootScope.patientId,
            success: function(data) {
                $scope.health();
            },
            error: function(data) {
                $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
            }
        };

        LoginService.putPatientMedicalProfile(params);
    }
    $scope.OnSelectAllergies = function(allergie) {
        if (allergie.checked === true) {
            $rootScope.checkedAllergies++;
        } else {
            $rootScope.checkedAllergies--;
        }
        if ((allergie.text === "Other") && $rootScope.checkedAllergies <= 4) {
            $scope.openOtherAllergiesView(allergie);
        } else {
            if ($rootScope.checkedAllergies == 4) {

             $rootScope.checkedAllergies--;
                $scope.allergiedone();
            }if($rootScope.checkedAllergies >= 4){
                 allergie.checked === false;
                 $scope.modal.hide();
            }
        }


    }


    $scope.openOtherAllergiesView = function(model) {
        $scope.data = {}
        $ionicPopup.show({
            template: '<textarea name="comment" id="comment-textarea" ng-model="data.AllergiesOther" class="textAreaPop">',
            title: 'Enter Medication Allergie',
            subTitle: '',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    angular.forEach($rootScope.medicationAllergiesearchList, function(item, index) {
                        if (item.checked) {
                            if (item.text === "Other") item.checked = false;
                        }
                    });
                    $rootScope.checkedAllergies--;
                }
            }, {
                text: '<b>Done</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.AllergiesOther) {
                        e.preventDefault();
                    } else {
                        angular.forEach($rootScope.medicationAllergiesearchList, function(item, index) {
                            if (item.checked) {
                                if (item.text === "Other") {
                                    item.checked = false;
                                }
                            }
                        });
                        var newAllergiwItem = {
                            text: $scope.data.AllergiesOther,
                            checked: true
                        };
                        $rootScope.medicationAllergiesearchList.splice(1, 0, newAllergiwItem);

                        var usersallergie = $rootScope.medicationAllergiesearchList;
                        var usersallergielength = usersallergie.length;
                        var log = [];
                        var tmpallergie = {};
                        for (i = 0; i < usersallergielength; i++) {
                            var letter = usersallergie[i].text.toUpperCase().charAt(0);
                            if (tmpallergie[letter] == undefined) {
                                tmpallergie[letter] = [];
                            }
                            tmpallergie[letter].push(usersallergie[i]);
                        }
                        $scope.sorted_usersallergie = tmpallergie;

                        $scope.gotoallergyList = function(codeid) {
                            $location.hash(codeid);
                            $ionicScrollDelegate.anchorScroll();
                        }

                        if ($rootScope.checkedAllergies >= 4) {
                          allergie.checked === true
                            $scope.allergiedone();
                        }
                        return $scope.data.AllergiesOther;
                    }
                }
            }]
        });
    };




    $scope.chronicsearch = function() {
      $scope.clearSelectionAndRebindSelectionList($rootScope.patientmedicalConditions, $rootScope.chronicConditionsearchList);
        if (typeof $rootScope.ChronicCount === 'undefined') {
                $rootScope.checkedChronic = 0;
            } else {
                $rootScope.checkedChronic = $rootScope.ChronicCount;
            }

        $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
        $scope.chalphabet = iterateAlphabet();
        $ionicModal.fromTemplateUrl('templates/tab-chronicconditionsearch.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        var userschronic = $rootScope.chronicConditionsearchList;
        var userschroniclength = userschronic.length;
        var log = [];
        var tmpchronic = {};
        for (i = 0; i < userschroniclength; i++) {
            var chletter = userschronic[i].text.toUpperCase().charAt(0);
            if (tmpchronic[chletter] == undefined) {
                tmpchronic[chletter] = [];
            }
            tmpchronic[chletter].push(userschronic[i]);
        }
        $scope.sortedchronic_users = tmpchronic;

        $scope.gotochronicList = function(codeid) {
            $location.hash(codeid);
            $ionicScrollDelegate.anchorScroll();
        }
        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
    }

    $scope.chronicdone = function() {
        $scope.modal.hide();



        $rootScope.ChronicupdateList = [];
        $rootScope.ChronicsearchItem = $filter('filter')($rootScope.chronicConditionsearchList, {
            checked: true
        });
        $rootScope.ChronicsearchSelected = $filter('filter')($rootScope.chronicConditionsearchList, {
            checked: true
        });
        if ($rootScope.ChronicsearchItem !== '') {
            $rootScope.patientchronicSearch = $rootScope.ChronicsearchItem;
            $rootScope.ChronicCount = $rootScope.patientchronicSearch.length;

            for (var i = 0; i < $rootScope.ChronicCount; i++) {
                $rootScope.ChronicupdateList.push({
                    code: $rootScope.ChronicsearchItem[i].codeId,
                    description: $rootScope.ChronicsearchItem[i].text
                });
            }

            console.log($rootScope.AllergiesCount);
            $scope.modal.hide();
        }

        $scope.InfantData = [];

        console.log($rootScope.patientmedicalsurgeries);
        console.log($rootScope.ChronicsearchSelected);
        console.log($rootScope.patientmedicalConditions);
        console.log($rootScope.patientmedicationsallergies);
        var params = {

            accessToken: $rootScope.accessToken,
            MedicationAllergies: $rootScope.patientmedicationsallergies,
            Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
            MedicalConditions: $rootScope.ChronicupdateList,
            Medications: $rootScope.patientmedications,
            InfantData: $scope.InfantData,
            PatientId: $rootScope.patientId,
            success: function(data) {
                $scope.health();
            },
            error: function(data) {
                $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
            }
        };

        LoginService.putPatientMedicalProfile(params);


    }
    $scope.OnSelectChronicCondition = function(chronic) {
        if (chronic.checked === true) {
            $rootScope.checkedChronic++;
        } else {
            $rootScope.checkedChronic--;
        }

        if ((chronic.text === "Other") && $rootScope.checkedChronic <= 4) {
          //  $scope.openOtherAllergiesView(allergie);
        } else {
            if ($rootScope.checkedChronic == 4) {

             $rootScope.checkedAllergies--;
                $scope.chronicdone();
            }if($rootScope.checkedChronic >= 4){
                 chronic.checked === false;
                 $scope.modal.hide();
            }
        }


    }


    $rootScope.doGetListOfCoUsers = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            authorizedOnly: true,
            success: function(data) {
                //$scope.listOfCoUser = JSON.stringify(data, null, 2);
                $rootScope.listOfCoUserDetails = [];
                angular.forEach(data.data, function(index, item) {
                  if(index.patientId !== $rootScope.patientId) {
                      var getCoUserRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                          codeId: index.relationCodeId
                      })
                      if (getCoUserRelationShip.length !== 0) {
                          var relationShip = getCoUserRelationShip[0].text;
                      } else {
                          var relationShip = '';
                      }
                      var dob = ageFilter.getDateFilter(index.dob);
                      if (index.gender == 'M') {
                          var gender = "Male";
                      } else if (index.gender == 'F') {
                          var gender = "FeMale";
                      }
                      if(index.imagePath){
                          $scope.coUserImagePath = index.imagePath;
                      }else{
                          var coName = index.name + " " + index.lastname; //alert(coName);
                          $scope.coUserName = getInitialForName(coName);
                          $scope.coUserImagePath = generateTextImage($scope.coUserName, $rootScope.brandColor);
                      }

                      $rootScope.listOfCoUserDetails.push({
                          'address': index.address,
                          'bloodType': index.bloodType,
                          'description': index.description,
                          'dob': dob,
                          'emailId': index.emailId,
                          'ethnicity': index.ethnicity,
                          'eyeColor': index.eyeColor,
                          'gender': gender,
                          'hairColor': index.hairColor,
                          'height': index.height,
                          'heightUnit': index.heightUnit,
                          'homePhone': index.homePhone,
                          'imagePath': $scope.coUserImagePath,
                          'lastname': index.lastname,
                          'mobilePhone': index.mobilePhone,
                          'name': index.name,
                          'patientId': index.patientId,
                          'personId': index.personId,
                          'relationship': relationShip,
                          'relationCodeId': index.relationCodeId,
                          'roleId': index.roleId,
                          'userId': index.userId,
                          'weight': index.weight,
                          'weightUnit': index.weightUnit
                      });
                  }
                });
                $state.go('tab.relatedusers');
            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.getListOfCoUsers(params);
    }


    $rootScope.doDeleteAccountCoUser = function(patientId) {
        var params = {
            accessToken: $rootScope.accessToken,
            PatientId: patientId,
            success: function(data) {
                //  $scope.deleteCoUser = JSON.stringify(data, null, 2);
                $scope.doGetListOfCoUsers();
            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.deleteAccountCoUser(params);
    }

    $scope.removemodal = function(model) {
        $scope.modal.hide();
            $scope.cancelshow = true;
    };


 $scope.$watch('healthInfoModel.healthInfoOrganization', function(newVal) {
        if (!angular.isUndefined($rootScope.currentPatientDetails[0].organizationId) && $rootScope.currentPatientDetails[0].organizationId !== '' && angular.isUndefined(newVal)) {
            $rootScope.listOfLocForCurntOrg = $filter('filter')($rootScope.listOfLocation, {
                organizationId: $rootScope.currentPatientDetails[0].organizationId
            });
        } else {
            if (newVal) {
                $rootScope.listOfLocForCurntOrg = $filter('filter')($rootScope.listOfLocation, {
                    organizationId: newVal
                });
            } else {
                $rootScope.listOfLocForCurntOrg = '';
            }
        }
    });

    //Function to open ActionSheet when clicking Camera Button
    //================================================================================================================
    var options;
    var newUploadedPatientPhoto;

    $scope.showCameraActions = function() {
        options = {
            'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
            'addCancelButtonWithLabel': 'Cancel',
        };
        window.plugins.actionsheet.show(options, cameraActionCallback);
    }


    $scope.uploadPhotoForExistingPatient = function(){
        if($rootScope.updatedPatientImagePath !== '' && typeof $rootScope.updatedPatientImagePath !== 'undefined') {
            var fileMimeType = "image/jpeg";
            var fileUploadUrl = apiCommonURL + "/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
            var targetPath = newUploadedPatientPhoto;
            var filename = targetPath.split("/").pop();
            var options = {
                headers: {
                    'Authorization': 'Bearer ' + $rootScope.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"]
                },
            };
            $ionicLoading.show({
                template: '<img src="img/puff.svg" alt="Loading" />'
            });

            $cordovaFileTransfer.upload(fileUploadUrl, targetPath, options).then(function(result) {
                // Upload Success on server
                //console.log(result);
                var getImageURLFromResponse = angular.fromJson(result.response);
                $rootScope.PatientImageSelectUser = getImageURLFromResponse.data[0].uri;
                $scope.$root.$broadcast("callPatientAndDependentProfiles");
                //$rootScope.$broadcast('loading:hide');
                //  navigator.notification.alert('Uploaded successfully!',null,$rootScope.alertMsgName,'OK');
                //  getImageList();
            }, function(err) {
                // Upload Failure on server
                //navigator.notification.alert('Upload Failed! Please try again!',null,'Inflight','OK');
                //$rootScope.$broadcast('loading:hide');
                navigator.notification.alert('Unable to upload the photo. Please try again later.', null, $rootScope.alertMsgName, 'OK');
            }, function(progress) {
                // PROGRESS HANDLING GOES HERE
                $rootScope.$broadcast('loading:show');
            });
        }

    };


    //var fileUploadUrl = apiCommonURL + "/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
    //  var fileUploadUrl = "http://emerald.snap.local/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
    function cameraActionCallback(buttonIndex) {
        if (buttonIndex == 3) {
            return false;
        } else {
            var saveToPhotoAlbumFlag = false;
            var cameraSourceType = navigator.camera.PictureSourceType.CAMERA;
            var cameraMediaType = navigator.camera.MediaType.PICTURE;

            if (buttonIndex === 1) {
                saveToPhotoAlbumFlag = true;
                cameraSourceType = navigator.camera.PictureSourceType.CAMERA;
                cameraMediaType = navigator.camera.MediaType.PICTURE;
            }
            if (buttonIndex === 2) {
                cameraSourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
                cameraMediaType = navigator.camera.MediaType.PICTURE;
            }

            navigator.camera.getPicture(onCameraCaptureSuccess, onCameraCaptureFailure, {
                destinationType: navigator.camera.DestinationType.FILE_URI,
                quality: 75,
                //targetWidth: 500,
                //targetHeight: 500,
                allowEdit: true,
                saveToPhotoAlbum: saveToPhotoAlbumFlag,
                sourceType: cameraSourceType,
                mediaType: cameraMediaType,
            });
        }
    }

    // Function to call when the user choose image or video to upload
    function onCameraCaptureSuccess(imageData) {

        //File for Upload
        $rootScope.updatedPatientImagePath = imageData;
        newUploadedPatientPhoto = imageData;
        $state.go('tab.healthinfo');
        //	$rootScope.imagePath = imageData;

        // File name only
      //  var filename = targetPath.split("/").pop();

      /*  var options = {
            //fileKey: "file",
            //fileName: filename,
            //chunkedMode: false,
            //mimeType: fileMimeType,
            //  headers: { 'Authorization': "Bearer ZaxYTeT_v1bvq3jCP2xsdM4s44J0gXpHxSXS8XMxSz64T4Mls9EZEtSTh7iQdw28aPEd3lLHVYJflaJa-MdHt8grqUA244cAPvTSLDI1aCEZ-j_lskACfyOY1X_mMg_ZbRqtO1eGo2wWzkpeb-hne91VmiQnEflaaFZI6FxwHDI1psbPFm2lPHGpn7kxq7bmZxHIvR_Zl-qqJsXG5NFmAoBJO_AWatAc2tdQuw-wu8wUsQh90piJy-PfeeShtxb-NxKSKrYhYLrPM5OFm_eo8VhjrX4n3fWMN1LnZStuLx0iyt_H7puUW2IyTtJUlsMD-mvkIvcexQXEe0P8XzIkzCA3KdP7UOrGCfpk42BJnHvM_zWgpE307dss0c5DwgYj7VCNtXB7WhXiy7Udzc1VSw",
              //    'X-Api-Key': "c69fe0477e08cb4352e07c502ddd2d146b316112",
                //  'X-Developer-Id': "84f6101ff82d494f8fcc5c0e54005895"
              //  },
            headers: {
                'Authorization': "Bearer " + $rootScope.accessToken,
                'X-Api-Key': xApiKey,
                'X-Developer-Id': xDeveloperId
            },
        };

*/

    }

    // Function to call when the user cancels the operation
    function onCameraCaptureFailure(err) {
        //alert('Failure');
    }
    // End Photo Functionality


    $scope.clearSelectionAndRebindSelectionList = function(selectedListItem, mainListItem){
        angular.forEach(mainListItem, function(item, key2) {
               item.checked = false;
           });
        if(!angular.isUndefined(selectedListItem)){

           if(selectedListItem.length > 0){
               angular.forEach(selectedListItem, function(value1, key1) {
                   angular.forEach(mainListItem, function(value2, key2) {
                     if (value1.description === value2.text) {
                         value2.checked = true;
                     }
                   });
               });
           }
       }
    };

});

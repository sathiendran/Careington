    angular.module('starter.controllers')

    .controller('healthinfoController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicModal,$ionicPopup,$ionicHistory, $filter) {



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

        $scope.addmore = false;
        $scope.healthhide = true;
        $scope.headerval = false;
        $scope.editshow = true;
        $scope.doneshow = true;
        $scope.readattr = false;
        $scope.doneedit = false;
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
            $scope.doneedit = true;
            $rootScope.flag = false;
            $('#aaa').show();
            $('#ss').hide();
            var editvalues = angular.element(document.getElementsByTagName('input'));
            var edittextarea = angular.element(document.getElementsByTagName('textarea'));

            editvalues.removeClass('textdata');
            editvalues.addClass('editdata');
            edittextarea.removeClass('textdata');
            edittextarea.addClass('editdata');
    }

        //$scope.healthInfo = {};
        $scope.putUpdatePatientDetails = function() {
        $scope.healthInfoFirstName = $('#healthInfoFirstName').val();
        $scope.healthInfoLastName = $('#healthInfoLastName').val();
        $scope.healthInfoDOB = $('#healthInfoDOB').val();
        $scope.healthInfoEmail = $('#healthInfoEmail').val();
        $scope.healthInfoGender = $("input[name='healthInfoGender']:checked").val();
        $scope.healthInfoHeight = $('#healthInfoHeight').val();
        $scope.healthInfoHeightUnit = $('#healthInfoHeightUnit').val()
        $scope.healthInfoWeight = $('#healthInfoWeight').val()
        $scope.healthInfoWeightUnit = $('#healthInfoWeightUnit').val()
        $scope.healthInfoHomePhone = $('#healthInfoHomePhone').val()
        $scope.healthInfoMobilePhone = $('#healthInfoMobilePhone').val()
        $scope.healthInfoAddress = $('#healthInfoAddress').val();
        $scope.healthInfoOrganization = $('#healthInfoOrganization').val();
        $scope.healthInfoLocation = $('#healthInfoLocation').val();
        $scope.healthInfoHairColor = $('#healthInfoHairColor').val();
            $scope.splitHairColor =   $scope.healthInfoHairColor.split("@");
            $scope.getHairColorId = $scope.splitHairColor[0];
            $scope.getHairColorText = $scope.splitHairColor[1];
        $scope.healthInfoEyeColor = $('#healthInfoEyeColor').val();
            $scope.splitEyeColor =   $scope.healthInfoEyeColor.split("@");
            $scope.getEyeColorId = $scope.splitEyeColor[0];
            $scope.getEyeColorText = $scope.splitEyeColor[1];
        $scope.healthInfoEthnicity = $('#healthInfoEthnicity').val();
            $scope.splitEthnicity =   $scope.healthInfoEthnicity.split("@");
            $scope.getEthnicityId = $scope.splitEthnicity[0];
            $scope.getEthnicityText = $scope.splitEthnicity[1];
        $scope.healthInfoEthnicity = $('#healthInfoBloodType').val();

        $scope.ValidateEmail = function(email){
                    var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return expr.test(email);
                };

        if(typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '' ){
            $scope.ErrorMessage = "Please Enter Your First Name";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '' ){
            $scope.ErrorMessage = "Please Enter Your Last Name";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '' ){
            $scope.ErrorMessage = "Please Select Your DOB";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '' ){
            $scope.ErrorMessage = "Please Enter Your Email Id";
            $rootScope.Validation($scope.ErrorMessage);
        }else if (!$scope.ValidateEmail($scope.healthInfoEmail)) {
                    $scope.ErrorMessage = "Please enter a valid Email Address";
                    $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoHomePhone === 'undefined' || $scope.healthInfoHomePhone === ''){
            $scope.ErrorMessage = "Please Enter Your Home Phone";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoMobilePhone === 'undefined' || $scope.healthInfoMobilePhone === ''){
            $scope.ErrorMessage = "Please Enter Your Mobile Phone";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoAddress === 'undefined' || $scope.healthInfoAddress === ''){
            $scope.ErrorMessage = "Please Enter Your Address";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoOrganization === 'undefined' || $scope.healthInfoOrganization === ''){
            $scope.ErrorMessage = "Please Enter Your Organization";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoLocation === 'undefined' || $scope.healthInfoLocation === ''){
            $scope.ErrorMessage = "Please Enter Your Location";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoGender === 'undefined' || $scope.healthInfoGender === ''){
            $scope.ErrorMessage = "Please Select Your Gender";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoHeight === 'undefined' || $scope.healthInfoHeight === ''){
            $scope.ErrorMessage = "Please Enter Your Height";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === ''){
            $scope.ErrorMessage = "Please Enter Your Height Unit";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === ''){
            $scope.ErrorMessage = "Please Enter Your Weight";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === ''){
            $scope.ErrorMessage = "Please Enter Your Weight Unit";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === ''){
            $scope.ErrorMessage = "Please Select Your Ethnicity";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === ''){
            $scope.ErrorMessage = "Please Select Your Hair Color";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === ''){
            $scope.ErrorMessage = "Please Select Your Eye Color";
            $rootScope.Validation($scope.ErrorMessage);
        }else {
            $scope.doPutProfileUpdation();
        }
        }
    //$rootScope.currentPatientDetails[0].account.email
        $scope.doPutProfileUpdation = function() {
                    var params = {
                            accessToken: $rootScope.accessToken,
                            emailAddress: $scope.healthInfoEmail,
                            patientProfileData: {
                                patientId: $rootScope.patientId, //$rootScope.currentPatientDetails[0].account.patientId,
                                patientName: $scope.healthInfoFirstName,
                                lastName: $scope.healthInfoLastName,
                                dob: $scope.healthInfoDOB,
                                bloodType: 1,
                                eyeColor: $scope.getEyeColorId,
                                gender: $scope.healthInfoGender,
                                enthicity: $scope.getEthnicityId,
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
                                profileImagePath: "/images/Patient-Male.gif",
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
                        success: function (data) {
                            console.log(data);
            //  $rootScope.doGetPatientProfiles();
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
                        error: function (data) {
                            $rootScope.serverErrorMessageValidation();
                        }
                    };

                LoginService.putProfileUpdation(params);
            }

function iterateAlphabet()
  {
     var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
     var numbers = new Array();
     for(var i=0; i<str.length; i++)
     {
        var nextChar = str.charAt(i);
        numbers.push(nextChar);
     }
     return numbers;
  }
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
    $scope.profile= function() {
        var myEl = angular.element( document.querySelector( '#profid' ) );
        myEl.addClass('btcolor');
        myEl.removeClass('btnextcolor');
    var myEl = angular.element( document.querySelector( '#healid' ) );
        myEl.removeClass('btcolor').css('color','#11c1f3');
        myEl.addClass('btnextcolor');
        $scope.editshow=true;
        $scope.addmore=false;
        $scope.healthhide=true;
        $scope.doneshow=true;
        $scope.cancelshow=false;
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
                    success: function (data) {
                    $rootScope.PatientMedicalProfileList = data.data;
                    $rootScope.patvalues= $rootScope.PatientMedicalProfileList;
                    $rootScope.patientmedications= $rootScope.PatientMedicalProfileList[0].medications;
                    $rootScope.patientmedicationsallergies= $rootScope.PatientMedicalProfileList[0].medicationAllergies;
                    $rootScope.patientmedicalConditions= $rootScope.PatientMedicalProfileList[0].medicalConditions;
                    $rootScope.patientmedicalsurgeries= $rootScope.PatientMedicalProfileList[0].surgeries;
                    // var patientmedical=$scope.PatientMedicalProfileList;
                    //var medicationvalues=patientmedical[0].medications;
                    },
                    error: function (data) {

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
 $scope.healthsearch=function(){
        $scope.alphabet = iterateAlphabet();
      if(typeof $rootScope.MedicationsCount === 'undefined') {
			$rootScope.checkedMedication = 0;
		} else {
		$rootScope.checkedMedication  = $rootScope.MedicationsCount;
		}
       $ionicModal.fromTemplateUrl('templates/tab-currentmedicationsearch.html', {
          scope: $scope,
           animation: 'slide-in-up',
           focusFirstInput: false,
		   backdropClickToClose: false
           }).then(function(modal) {
           $scope.modal = modal;
           $scope.modal.show();
        });

        if ($rootScope.accessToken === 'No Token') {
                    alert('No token.  Get token first then attempt operation.');
                    return;
                }
                var params = {
                    hospitalId: $rootScope.hospitalId,
                    accessToken: $rootScope.accessToken,
                    fields: $scope.codesFields,
                    success: function (data) {
                    $rootScope.hospitalList = angular.fromJson(data.data[3].codes);
                    $rootScope.currentMedicationsearchList = angular.fromJson(data.data[1].codes);

                  var users = $rootScope.currentMedicationsearchList;
                    var userslength=users.length;
                    var log = [];
                    var tmp={};
                    for(i=0;i<userslength;i++){
                     var letter=users[i].text.toUpperCase().charAt(0);
                       if(tmp[ letter] ==undefined){
                       tmp[letter]=[]
                        }
                      tmp[letter].push( users[i] );
                    }
                  $rootScope.sorted_users= tmp;

              $rootScope.gotoList = function(id){

                   $location.hash(id);
                   $ionicScrollDelegate.anchorScroll();

                }

            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
              }
           };
        LoginService.getCodesSet(params);

        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
      }


$scope.medicationdone=function(){
      $rootScope.CurrentmedicationupdateList = [];
      $rootScope.CurrentMedicationsearchItem = $filter('filter')($rootScope.currentMedicationsearchList, {checked:true});
      $rootScope.CurrentMedicationsearchSelected = $filter('filter')($rootScope.currentMedicationsearchList, {checked:true});
      if($rootScope.CurrentMedicationsearchItem !== '') {
            $rootScope.patientmedicationsSearch = $rootScope.CurrentMedicationsearchItem;
		    $rootScope.MedicationsCount = $rootScope.patientmedicationsSearch.length;

         for (var i = 0; i < $rootScope.MedicationsCount; i++) {
                 $rootScope.CurrentmedicationupdateList.push(
					{code: $rootScope.CurrentMedicationsearchItem[i].codeId, description: $rootScope.CurrentMedicationsearchItem[i].text}
					);
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
					MedicationAllergies:$rootScope.patientmedicationsallergies,
					Surgeries:$rootScope.patientmedicalsurgeries,
					MedicalConditions:$rootScope.patientmedicalConditions,
					Medications:$rootScope.CurrentmedicationupdateList,
					InfantData:$scope.InfantData,
					patientId:$rootScope.patientId,
					success: function (data) {
						 $scope.health();
					},
					error: function (data) {
						$scope.postPatientMedicalProfile = 'Error getting Patient Medical Profile';
					}
				};

			 LoginService.putPatientMedicalProfile(params);
}

$scope.OnSelectMedication = function(currentmedication) {
       if(currentmedication.checked === true) {
		  $rootScope.checkedMedication++;
          console.log($rootScope.checkedMedication);
              } else  {
                $rootScope.checkedMedication--;
              }

        if(currentmedication.text === "Other - (List below)"){
            $scope.openOtherCurrentMedicationView(currentmedication);
        } else {
			if($rootScope.checkedMedication === 4) {
				$scope.medicationdone();
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
			buttons: [
			  {
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach(  $rootScope.currentMedicationsearchList , function(item, index) {
                       if(item.checked) { if(item.text === "Other - (List below)") item.checked = false; }
                          });
                      $rootScope.checkedMedication--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.CurrentMedicationOther) {
					e.preventDefault();
				  } else {
                      angular.forEach(  $rootScope.currentMedicationsearchList , function(item, index) {
                        if(item.checked) {
                            if(item.text === "Other - (List below)") { item.checked = false; }
                        }
                      });

                    var newCurrentMedicationItem = { text: $scope.data.CurrentMedicationOther,checked: true };

                      $rootScope.currentMedicationsearchList.splice(1, 0, newCurrentMedicationItem);
                    var users = $rootScope.currentMedicationsearchList;
                    var userslength=users.length;
                    var log = [];
                    var tmp={};
                    for(i=0;i<userslength;i++){
                     var letter=users[i].text.toUpperCase().charAt(0);
                       if(tmp[ letter] ==undefined){
                       tmp[letter]=[]
                        }
                      tmp[letter].push( users[i] );
                    }
                  $rootScope.sorted_users= tmp;

              $rootScope.gotoList = function(id){
                 // var myEl = angular.element(document.querySelector('#cursearch'));
                   //  myEl.addClass('currmedication');
                   $location.hash(id);
                   $ionicScrollDelegate.anchorScroll();
                }

                      if($rootScope.checkedMedication === 4) {
							$scope.medicationdone();
						}
					 return $scope.data.CurrentMedicationOther;
				  }
				}
			  }
			]
		  });
    };





 $scope.alergiessearch=function(){
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
    if ($rootScope.accessToken === 'No Token') {
                    alert('No token.  Get token first then attempt operation.');
                    return;
                }
                var params = {
                    hospitalId: $rootScope.hospitalId,
                    accessToken: $rootScope.accessToken,
                    fields: $scope.codesFields,
                    success: function (data) {
                       $rootScope.hospitalList = angular.fromJson(data.data[3].codes);
                       $rootScope.medicationAllergiesearchList = angular.fromJson(data.data[2].codes);

                    var usersallergie = $rootScope.medicationAllergiesearchList;
                    var usersallergielength=usersallergie.length;
                    var log = [];
                    var tmpallergie={};
                    for(i=0;i<usersallergielength;i++){
                     var letter=usersallergie[i].text.toUpperCase().charAt(0);
                       if( tmpallergie[letter] ==undefined){
                       tmpallergie[letter]=[];
                        }
                      tmpallergie[letter].push( usersallergie[i] );
                    }
                  $scope.sorted_usersallergie = tmpallergie;

                 $scope.gotoallergyList = function(codeid){
                   $location.hash(codeid);
                   $ionicScrollDelegate.anchorScroll();
                }


                    },
                    error: function (data) {
                        $rootScope.serverErrorMessageValidation();
                    }
                };

        LoginService.getCodesSet(params);
        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
    }
$scope.allergiedone=function(){
      $scope.modal.hide();

}
$scope.OnSelectAllergies = function(allergie) {
       if(allergie.checked === true) {
		$rootScope.checkedAllergies++;
	  }  else  {
	  $rootScope.checkedAllergies--;
	  }

  if(allergie.text === "Other"){
            $scope.openOtherAllergiesView(allergie);
        } else {
			if($rootScope.checkedAllergies === 4) {
				$scope.allergiedone();
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
			buttons: [
			  {
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach(  $rootScope.medicationAllergiesearchList , function(item, index) {
                       if(item.checked) { if(item.text === "Other") item.checked = false; }
                          });
                      $rootScope.checkedAllergies--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.AllergiesOther) {
					e.preventDefault();
				  } else {
                      angular.forEach(  $rootScope.medicationAllergiesearchList , function(item, index) {
                        if(item.checked) {
                            if(item.text === "Other") { item.checked = false; }
                        }
                      });
                     var newAllergiwItem = { text: $scope.data.AllergiesOther, checked: true };
                      $rootScope.medicationAllergiesearchList.splice(1, 0, newAllergiwItem);

                      var usersallergie = $rootScope.medicationAllergiesearchList;
                    var usersallergielength=usersallergie.length;
                    var log = [];
                    var tmpallergie={};
                    for(i=0;i<usersallergielength;i++){
                     var letter=usersallergie[i].text.toUpperCase().charAt(0);
                       if( tmpallergie[letter] ==undefined){
                       tmpallergie[letter]=[];
                        }
                      tmpallergie[letter].push( usersallergie[i] );
                    }
                  $scope.sorted_usersallergie = tmpallergie;

                 $scope.gotoallergyList = function(codeid){
                   $location.hash(codeid);
                   $ionicScrollDelegate.anchorScroll();
                }

						if($rootScope.checkedAllergies === 4) {
							$scope.allergiedone();
						}
					 return $scope.data.AllergiesOther;
				  }
				}
			  }
			]
		  });
    };




$scope.chronicsearch=function(){
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
    if ($rootScope.accessToken === 'No Token') {
                    alert('No token.  Get token first then attempt operation.');
                    return;
                }
                var params = {
                    hospitalId: $rootScope.hospitalId,
                    accessToken: $rootScope.accessToken,
                    fields: $scope.codesFields,
                    success: function (data) {
                     $rootScope.hospitalList = angular.fromJson(data.data[3].codes);
                     $rootScope.chronicConditionsearchList = angular.fromJson(data.data[0].codes);

                  var userschronic = $rootScope.chronicConditionsearchList;
                    var userschroniclength=userschronic.length;
                    var log = [];
                    var tmpchronic={};
                    for(i=0;i<userschroniclength;i++){
                     var chletter=userschronic[i].text.toUpperCase().charAt(0);
                       if( tmpchronic[chletter] ==undefined){
                       tmpchronic[ chletter]=[];
                        }
                      tmpchronic[ chletter].push( userschronic[i] );
                    }
                  $scope.sortedchronic_users = tmpchronic;

                 $scope.gotochronicList = function(codeid){
                   $location.hash(codeid);
                   $ionicScrollDelegate.anchorScroll();
                }
  },
  error: function (data) {
           $rootScope.serverErrorMessageValidation();
       }
 };

  LoginService.getCodesSet(params);
        $scope.cancelshow = false;
        $scope.doneshow = true;
        $scope.editshow = false;
}

$scope.chronicdone=function(){
    $scope.modal.hide();
}


$scope.OnSelectChronicCondition = function(chronic) {
       if(chronic.checked === true) {
		$rootScope.checkedChronic++;
	  }  else  {
	  $rootScope.checkedChronic--;
	  }
 }

 $scope.doGetListOfCoUsers = function() {
             var params = {
               	accessToken: $rootScope.accessToken,
 			            authorizedOnly: true,
              success: function(data) {
                 //$scope.listOfCoUser = JSON.stringify(data, null, 2);
                $rootScope.listOfCoUserDetails = [];
                angular.forEach(data.data, function(index, item) {
                  $rootScope.listOfCoUserDetails.push({
                     'description': index.description,
                    'imagePath': $rootScope.APICommonURL + index.imagePath,
                     'lastname': index.lastname,
                     'name': index.name,
                     'patientId': index.patientId,
                     'personId': index.personId,
                     'roleId': index.roleId,
                     'userId': index.userId
                  });
                 });
                 $state.go('tab.relatedusers');
               },
               error: function(data) {
                $rootScope.serverErrorMessageValidation();
               }
            };
             LoginService.getListOfCoUsers(params);
         }



    });

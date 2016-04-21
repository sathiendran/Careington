angular.module('starter.controllers')

.controller('healthinfoController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService) {

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
     editvalues.removeClass('textdata');
        editvalues.addClass('editdata');
        edittextarea.removeClass('editdata');
        edittextarea.addClass('textdata');

    }

    $scope.health = function() {

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
    }

});

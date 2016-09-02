angular.module('starter.controllers')

.controller('healthinfoController', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService) {
    $rootScope.patientAuthorize = true;
    $rootScope.patientUnAuthorize = false;
    $rootScope.patientAuthorizeValue = 'Y';
    $scope.getOnlyNumbers = function(text) {
        var newStr = "";
        if (text) {
            newStr = text.replace(/[^0-9.]/g, "");
        }
        return newStr;
    }

    $rootScope.getPhoneNumberWithoutCountryCode = function(phoneNumber) {
        var phoneNumberWithoutCountryCode = "";
        if (phoneNumber)
            phoneNumberWithoutCountryCode = phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length);
        return phoneNumberWithoutCountryCode;
    };

    $rootScope.reformatHeight = function(heightVal, index) {
        var newHeight = "0";
        if (heightVal) {
            var newHeightVal = heightVal.split('|');
            newHeight = newHeightVal[index];
        }
        return newHeight;
    };

    $rootScope.reformatHeightForDisplay = function(heightVal, heightUnit) {
        var newHeight = "";
        if (heightVal) {
            //  newHeight = heightVal.replace('|', ' ft ');
            //  newHeight = newHeight + " in"
            if (heightVal.indexOf('|') === -1) {
                heightVal = heightVal + "|" + 0;
                var heightValSplit = heightVal.split("|");
            }
            var heightValSplit = heightVal.split("|");
            var heightUnitSplit = heightUnit.split("/");
            if (heightValSplit[1] == 0) {
                newHeight = heightValSplit[0] + " " + heightUnitSplit[0];
            } else {
                newHeight = heightValSplit[0] + " " + heightUnitSplit[0] + " " + heightValSplit[1] + " " + heightUnitSplit[1];
            }
        }
        return newHeight;
    };

    $rootScope.getCountryName = function(countryCode) {
        var countryInfo = $filter('filter')($rootScope.serviceCountries, {
            code: countryCode
        });
        if (countryInfo[0])
            return countryInfo[0].name;
        else if (countryInfo)
            return countryInfo.name;
        else
            return "";
    };

    $rootScope.getTimeZoneName = function(timezoneCode) {
      if(timezoneCode !== 0) {
          var timezoneInfo = $filter('filter')($rootScope.timeZones, {
              id: timezoneCode
          });
          if (timezoneInfo[0])
              return timezoneInfo[0].name;
          else if (timezoneInfo)
              return timezoneInfo.name;
          else
              return "";
      }
    };


    $rootScope.currentPatientDetails[0].homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].homePhone));
    $rootScope.currentPatientDetails[0].mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].mobilePhone));

    $rootScope.couserdetails = false;
    $rootScope.dupcouser = false;
    $rootScope.showNewSurgeryAdd = false;
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
        $rootScope.statename=$rootScope.currState.$current.name;
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.checkAndChangeMenuIcon();
        if (checkAndChangeMenuIcon) {
            $interval.cancel(checkAndChangeMenuIcon);
        }
        if($rootScope.statename="tab.healthinfo"){
          $('.sideuserhealth').addClass("uhome");

        }
        if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
            checkAndChangeMenuIcon = $interval(function() {
                $rootScope.checkAndChangeMenuIcon();
            }, 300);
        }
    };
    $scope.healthInfoModel = {};
    $scope.healthInfoModel.address = $rootScope.currentPatientDetails[0].address;
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
    var minDate = new Date();
    var maxDate = minDate.getDate();
    var maxMonth = minDate.getMonth() + 1;
    var maxYear = minDate.getFullYear();
    if (maxDate < 10) {
        var maxD = "0" + maxDate;
    }
    if (maxMonth < 10) {
        var maxM = "0" + maxMonth;
    }
    var maxDay = maxYear + "-" + maxM + "-" + maxD;
    var mDate = maxDay;
    $scope.maxDate1 = mDate;
    $scope.minimum = "1950-01-01";

    $scope.heightunit1 = function() {
        var max = 10;
        var heightval = $('#healthInfoHeight').val();
        if (heightval > max) {
            $("#healthInfoHeight").val(max);
        }

    }

    $scope.heightunit1len=function(){
       var max = 10;
       var heightunitlen=$('#healthInfoHeight').val().length;
       if(heightunitlen>2){
           $("#healthInfoHeight").val(max);
       }
    }
    $scope.heightunit2 = function() {
        var max = 99;
        var height2val = $("#healthInfoHeight2").val();
        if (height2val > max) {
            $("#healthInfoHeight2").val(max);
        }

        var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
        var getheightunit = _.first(heightunit);
        if (getheightunit == "ft/in") {
            var maxheight = 11;
            if (height2val > maxheight) {
                $("#healthInfoHeight2").val(maxheight);
            }
        }

    }
    $scope.heightunit2len=function(){
      var max = 99;
      var heightunit2len=$('#healthInfoHeight2').val().length;

      if(heightunit2len>2){
          $("#healthInfoHeight2").val(max);
      }
      var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
      var getheightunit=_.first(heightunit);
      if(getheightunit=="ft/in"){
          var maxheight=11;
          if ( height2val > maxheight)
         {
             $("#healthInfoHeight2").val(maxheight);
         }
      }
    }
    $scope.weightunitchange=function(){
      var maxweight = 999;
      var weightval = $('#healthInfoWeight').val();
      if (weightval > maxweight) {
          $("#healthInfoWeight").val(maxweight);
      }
    }
    $scope.weightunit = function() {
        var maxweight = 999;
        var weightval = $('#healthInfoWeight').val();
        if (weightval > maxweight) {
            $("#healthInfoWeight").val(maxweight);
        }
        var weightvallen=$('#healthInfoWeight').val().length;
        if(weightvallen>3){
            $("#healthInfoWeight").val(maxweight);
        }
    }

    $scope.heightunitchange = function() {
        var maxheight = 11;
        var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
        var getheightunit = _.first(heightunit);
        if (getheightunit = "ft/in") {
            var height2val = $('#healthInfoHeight2').val();
            if (height2val != "") {
                if (height2val > maxheight) {
                    $("#healthInfoHeight2").val(maxheight);
                }
            }
        }
    }
    $rootScope.patientId = $rootScope.currentPatientDetails[0].account.patientId;
    $scope.edittext = function() {

        $rootScope.doddate = $rootScope.currentPatientDetails[0].dob;
        $rootScope.restage = getAge( $rootScope.doddate);
        if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId == $rootScope.patientId)) {
            $rootScope.emailDisplay = 'flex';
            $rootScope.timezoneDisplay = 'flex';
        } else {
            $rootScope.emailDisplay = 'none';
            $rootScope.timezoneDisplay = 'none';

        }

        //  $scope.readattr = false;
        $scope.doneshow = false;
        $scope.editshow = false;
        $rootScope.flag = false;
        //$scope.viewimg = false;
        $scope.doneedit = true;
        $scope.editimg = true;
        $('#ss').hide();
        $('#aaa').show();
        var editsvalues = angular.element(document.getElementsByTagName('input'));
        var edittextarea = angular.element(document.getElementsByTagName('textarea'));
        $scope.healthInfoModel.userDOB = new Date($rootScope.userDOB);
        $rootScope.currentPatientDetails[0].homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].homePhone));
        $rootScope.currentPatientDetails[0].mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].mobilePhone));
        $scope.phoneval = $rootScope.currentPatientDetails[0].homePhone;
        $scope.mobileval = $rootScope.currentPatientDetails[0].mobilePhone;
        $scope.formatheight = $rootScope.currentPatientDetails[0].anatomy.height;
        $scope.formatheightval = $scope.formatheight.split("|");
        $scope.height = parseInt($scope.formatheightval[0]);
        $scope.height2 = parseInt($scope.formatheightval[1]);
        $scope.weightvalue=$rootScope.currentPatientDetails[0].anatomy.weight;
        $scope.weight=parseInt($scope.weightvalue);

        editsvalues.removeClass('textdata');
        edittextarea.removeClass('textdata');
        editsvalues.addClass('editdata');
        edittextarea.addClass('editdata');
    }

    //$scope.healthInfo = {};
    $scope.ngBlur = function() {
        var today = new Date();
        var nowyear = today.getFullYear();
        var nowmonth = today.getMonth() + 1;
        var nowday = today.getDate();
        $rootScope.doddate = $('#healthInfoDOB').val();
        $rootScope.restage = getAge( $rootScope.doddate);
        if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId == $rootScope.patientId)) {
            $rootScope.emailDisplay = 'flex';
            $rootScope.timezoneDisplay = 'flex';
        } else {
            $rootScope.emailDisplay = 'none';
            $rootScope.timezoneDisplay = 'none';

        }
    }

    $scope.healthphoneblur = function() {
        $scope.homephonelength = $('#healthInfoHomePhone').val().length;
        var homephoneval = $('#healthInfoHomePhone').val();
        if (homephoneval != '') {
            if ($scope.homephonelength < 14) {
                $scope.ErrorMessage = "Please enter valid Home Phone Number";
                $rootScope.Validation($scope.ErrorMessage);
            }

        }

    }

    $scope.putUpdatePatientDetails = function() {
            $scope.editimg = true;
            $scope.viewimg = false;
            var selectDate = document.getElementById('healthInfoDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
                dt2 = Date.parse(selectDate);
            $scope.healthInfoFirstName = $('#healthInfoFirstName').val();
            $scope.healthInfoLastName = $('#healthInfoLastName').val();
            $rootScope.healthInfoDOB = $('#healthInfoDOB').val();
            $scope.healthInfoDOB = $('#healthInfoDOB').val();
            $scope.healthInfoEmail = $('#healthInfoEmail').val();
            if ($rootScope.primaryPatientId !== $rootScope.currentPatientDetails[0].account.patientId) {
                $scope.healthInfoRelationship = $("#healthInfoRelationship").val();
                $scope.splitRelationship = $scope.healthInfoRelationship.split("@");
                $scope.getRelationshipId = $scope.splitRelationship[0];
                $scope.getRelationshipText = $scope.splitRelationship[1];
            } else {
                $scope.healthInfoRelationship = "NA";
            }
            $scope.healthInfoGender = $("#healthInfoGender").val();
            $scope.healthInfoHeight = $('#healthInfoHeight').val();
            $scope.healthInfoHeight2 = $('#healthInfoHeight2').val();
            $scope.HeightUnit = $('#healthInfoHeightUnit').val();
            $scope.HeightUnit1 = $scope.HeightUnit.split("@");
            $scope.healthInfoHeightUnit = $scope.HeightUnit1[0];
            $scope.healthInfoHeightUnitText = $scope.HeightUnit1[1];
            $scope.healthInfoWeight = $('#healthInfoWeight').val();
            $scope.WeightUnit = $('#healthInfoWeightUnit').val();
            $scope.WeightUnit1 = $scope.WeightUnit.split("@");
            $scope.healthInfoWeightUnit = $scope.WeightUnit1[0];
            $scope.healthInfoWeightUnitText = $scope.WeightUnit1[1];
            $scope.healthInfoCountry = $('#healthInfoCountry').val();
            $scope.healthInfoTimezone = $('#healthInfoTimezone').val();
            $scope.healthInfoHomePhone = $('#healthInfoHomePhone').val();
            $scope.healthInfoMobilePhone = $('#healthInfoMobilePhone').val();
            $scope.healthmobilelength = $("#healthInfoMobilePhone").val().length;
            //$scope.healthInfoAddress = $('#healthInfoAddress').val();
            $scope.healthInfoAddress = $scope.healthInfoModel.address;
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
            var today = new Date();
            var nowyear = today.getFullYear();
            var nowmonth = today.getMonth() + 1;
            var nowday = today.getDate();
            var dateofb = new Date($rootScope.healthInfoDOB);
            var birthyear = dateofb.getFullYear();
            var birthmonth = dateofb.getMonth();
            var birthday = dateofb.getDate();
            var age = nowyear - birthyear;
            var age_month = nowmonth - birthmonth;
            var age_day = nowday - birthday;
            if (age_month < 0 || (age_month == 0 && age_day < 0)) {
                age = parseInt(age) - 1;
            }


            $scope.ValidateEmail = function(email) {
                //var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return expr.test(email);
            };

            if ($rootScope.primaryPatientId !== $rootScope.currentPatientDetails[0].account.patientId) {
                if (($rootScope.restage >= 12 && age_month >= 0)) {

                    if (typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '') {
                        $scope.ErrorMessage = "Please enterenter First Name";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '') {
                        $scope.ErrorMessage = "Please enter Last Name";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '') {
                        $scope.ErrorMessage = "Please select DOB";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (dt2 > dt1) {
                        $scope.ErrorMessage = "DOB can not be in Future";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '') {
                        $scope.ErrorMessage = "Please enter Email Id";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (!$scope.ValidateEmail($("#healthInfoEmail").val())) {
                        $scope.ErrorMessage = "Please enter a valid Email Address";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoRelationship === 'undefined' || $scope.healthInfoRelationship === '') {
                        $scope.ErrorMessage = "Please choose Relationship";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoCountry === 'undefined' || $scope.healthInfoCountry === '') {
                        $scope.ErrorMessage = "Please select Country";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoTimezone === 'undefined' || $scope.healthInfoTimezone === '') {
                        $scope.ErrorMessage = "Please select Time Zone";
                        $rootScope.Validation($scope.ErrorMessage);
                        // }   else if (typeof $scope.healthInfoHomePhone === 'undefined' || $scope.healthInfoHomePhone === '') {
                        //     $scope.ErrorMessage = "Please Enter Your Home Phone";
                        //     $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoMobilePhone === 'undefined' || $scope.healthInfoMobilePhone === '') {
                        $scope.ErrorMessage = "Please enter Mobile Phone";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($scope.healthmobilelength < 14) {
                        $scope.ErrorMessage = "Please enter valid Mobile Number";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoAddress === 'undefined' || $scope.healthInfoAddress === '') {
                        $scope.ErrorMessage = "Please enter Address";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoGender === 'undefined' || $scope.healthInfoGender === '') {
                        $scope.ErrorMessage = "Please select Gender";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoHeight === 'undefined' || $scope.healthInfoHeight === '') {
                        $scope.ErrorMessage = "Please enter Height";
                        $rootScope.Validation($scope.ErrorMessage);
                    } //else if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                    //     $scope.ErrorMessage = "Please Enter Your Height";
                    //     $rootScope.Validation($scope.ErrorMessage);
                    //}
                    else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                        $scope.ErrorMessage = "Please select Height Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                        $scope.ErrorMessage = "Please enter Weight";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                        $scope.ErrorMessage = "Please select Weight Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '') {
                        $scope.ErrorMessage = "Please select Ethnicity";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '') {
                        $scope.ErrorMessage = "Please select Hair Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '') {
                        $scope.ErrorMessage = "Please select Eye Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '') {
                        $scope.ErrorMessage = "Please select Blood Type";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                            $scope.healthInfoHeight2 = "0";
                        }
                        $scope.doPutProfileUpdation();
                    }



                } else {
                    if (typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '') {
                        $scope.ErrorMessage = "Please enter First Name";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '') {
                        $scope.ErrorMessage = "Please enter Last Name";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '') {
                        $scope.ErrorMessage = "Please select DOB";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (dt2 > dt1) {
                        $scope.ErrorMessage = "DOB can not be in Future";
                        $rootScope.Validation($scope.ErrorMessage);
                        /*} else if (typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '') {
                           $scope.ErrorMessage = "Please Enter Your Email Id";
                             $rootScope.Validation($scope.ErrorMessage);*/
                    } else if (typeof $scope.healthInfoRelationship === 'undefined' || $scope.healthInfoRelationship === '') {
                        $scope.ErrorMessage = "Please choose Relationship";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoCountry === 'undefined' || $scope.healthInfoCountry === '') {
                        $scope.ErrorMessage = "Please select Country";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    /*else if (typeof $scope.healthInfoTimezone === 'undefined' || $scope.healthInfoTimezone === '') {
                                           $scope.ErrorMessage = "Please select Time Zone";
                                           $rootScope.Validation($scope.ErrorMessage);}*/
                    // }   else if (typeof $scope.healthInfoHomePhone === 'undefined' || $scope.healthInfoHomePhone === '') {
                    //     $scope.ErrorMessage = "Please Enter Your Home Phone";
                    //     $rootScope.Validation($scope.ErrorMessage);
                    else if (typeof $scope.healthInfoMobilePhone === 'undefined' || $scope.healthInfoMobilePhone === '') {
                        $scope.ErrorMessage = "Please enter Mobile Phone";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($scope.healthmobilelength < 14) {
                        $scope.ErrorMessage = "Please enter valid Mobile Number";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoAddress === 'undefined' || $scope.healthInfoAddress === '') {
                        $scope.ErrorMessage = "Please enter Address";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoGender === 'undefined' || $scope.healthInfoGender === '') {
                        $scope.ErrorMessage = "Please select Gender";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoHeight === 'undefined' || $scope.healthInfoHeight === '') {
                        $scope.ErrorMessage = "Please enter Height";
                        $rootScope.Validation($scope.ErrorMessage);
                    } //else if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                    //     $scope.ErrorMessage = "Please Enter Your Height";
                    //     $rootScope.Validation($scope.ErrorMessage);
                    //}
                    else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                        $scope.ErrorMessage = "Please select Height Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                        $scope.ErrorMessage = "Please enter Weight";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                        $scope.ErrorMessage = "Please select Weight Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '') {
                        $scope.ErrorMessage = "Please select Ethnicity";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '') {
                        $scope.ErrorMessage = "Please select Hair Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '') {
                        $scope.ErrorMessage = "Please select Eye Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '') {
                        $scope.ErrorMessage = "Please select Blood Type";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                            $scope.healthInfoHeight2 = "0";
                        }
                        $scope.doPutProfileUpdation();
                    }

                }

            } else {
                if (typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '') {
                    $scope.ErrorMessage = "Please enter First Name";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '') {
                    $scope.ErrorMessage = "Please enter Last Name";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '') {
                    $scope.ErrorMessage = "Please select Your DOB";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (dt2 > dt1) {
                    $scope.ErrorMessage = "DOB can not be in Future";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '') {
                    $scope.ErrorMessage = "Please enter Email Id";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (!$scope.ValidateEmail($("#healthInfoEmail").val())) {
                    $scope.ErrorMessage = "Please enter a valid Email Address";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoRelationship === 'undefined' || $scope.healthInfoRelationship === '') {
                    $scope.ErrorMessage = "Please choose Relationship";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoCountry === 'undefined' || $scope.healthInfoCountry === '') {
                    $scope.ErrorMessage = "Please select Country";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoTimezone === 'undefined' || $scope.healthInfoTimezone === '') {
                    $scope.ErrorMessage = "Please select Time Zone";
                    $rootScope.Validation($scope.ErrorMessage);
                    // }   else if (typeof $scope.healthInfoHomePhone === 'undefined' || $scope.healthInfoHomePhone === '') {
                    //     $scope.ErrorMessage = "Please Enter Your Home Phone";
                    //     $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoMobilePhone === 'undefined' || $scope.healthInfoMobilePhone === '') {
                    $scope.ErrorMessage = "Please enter Mobile Phone";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($scope.healthmobilelength < 14) {
                    $scope.ErrorMessage = "Please enter valid Mobile Number";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoAddress === 'undefined' || $scope.healthInfoAddress === '') {
                    $scope.ErrorMessage = "Please enter Address";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoGender === 'undefined' || $scope.healthInfoGender === '') {
                    $scope.ErrorMessage = "Please select Gender";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoHeight === 'undefined' || $scope.healthInfoHeight === '') {
                    $scope.ErrorMessage = "Please enter Height";
                    $rootScope.Validation($scope.ErrorMessage);
                } //else if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                //     $scope.ErrorMessage = "Please Enter Your Height";
                //     $rootScope.Validation($scope.ErrorMessage);
                //}
                else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                    $scope.ErrorMessage = "Please select Height Unit";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                    $scope.ErrorMessage = "Please enter Weight";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                    $scope.ErrorMessage = "Please select Weight Unit";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '') {
                    $scope.ErrorMessage = "Please select Ethnicity";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '') {
                    $scope.ErrorMessage = "Please select Hair Color";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '') {
                    $scope.ErrorMessage = "Please select Eye Color";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '') {
                    $scope.ErrorMessage = "Please select Blood Type";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                        $scope.healthInfoHeight2 = "0";
                    }
                    $scope.doPutProfileUpdation();
                }

            }
        }
        //$rootScope.currentPatientDetails[0].account.email
    $rootScope.doPutProfileUpdation = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            emailAddress: $scope.healthInfoEmail,
            patientProfileData: {
                patientId: $rootScope.currentPatientDetails[0].account.patientId, //$rootScope.currentPatientDetails[0].account.patientId,
                patientName: $scope.healthInfoFirstName,
                lastName: $scope.healthInfoLastName,
                dob: $scope.healthInfoDOB,
                bloodType: $scope.getBloodTypeId,
                eyeColor: $scope.getEyeColorId,
                gender: $scope.healthInfoGender,
                ethnicity: $scope.getEthnicityId,
                hairColor: $scope.getHairColorId,
                //homePhone: $scope.healthInfoCountry + $scope.getOnlyNumbers($scope.healthInfoHomePhone),
                homePhone: $scope.getOnlyNumbers($scope.healthInfoHomePhone),
                mobilePhone: $scope.healthInfoCountry + $scope.getOnlyNumbers($scope.healthInfoMobilePhone),
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
                //height: formatHeightVal($scope.healthInfoHeight),
                height: $scope.healthInfoHeight + "|" + $scope.healthInfoHeight2,
                weight: $scope.healthInfoWeight,
                heightUnit: $scope.healthInfoHeightUnit,
                weightUnit: $scope.healthInfoWeightUnit,
                organizationId: $scope.healthInfoOrganization,
                locationId: $scope.healthInfoLocation,
                country: $scope.healthInfoCountry
            },
            timeZoneId: $scope.healthInfoTimezone,
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
                $rootScope.patientId = $rootScope.currentPatientDetails[0].account.patientId;
                if ($rootScope.updatedPatientImagePath !== '' && typeof $rootScope.updatedPatientImagePath !== 'undefined') {
                    $scope.uploadPhotoForExistingPatient();
                }
                if ($rootScope.primaryPatientId !== data.patientID) {
                    $scope.updateDependentRelation(data.patientID, $scope.getRelationshipId, $rootScope.patientAuthorizeValue);
                }
                $rootScope.currentPatientDetails.homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails.homePhone));
                $rootScope.currentPatientDetails.mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails.mobilePhone));
                $rootScope.currentPatientDetails = $rootScope.currentPatientDetails[0];

                if (angular.isUndefined($rootScope.currentPatientDetails.guardianName)) {
                    $rootScope.currentPatientDetails.guardianName = $rootScope.primaryPatientName + " " + $rootScope.primaryPatientLastName;
                }
                console.log(data);
                //  $rootScope.doGetPatientProfiles();
                //    $rootScope.getManageProfile(currentPatientDetails);

                var currentLocation = window.location;
                var loc=currentLocation.href;
                var newloc=loc.split("#");
                var locat=newloc[1];
                var sploc=locat.split("/");
                var cutlocations=sploc[1] +"."+sploc[2];

                $rootScope.GoToPatientDetails(cutlocations,$rootScope.currentPatientDetails.account.profileImagePath, $rootScope.currentPatientDetails.patientName, $rootScope.currentPatientDetails.lastName, $rootScope.currentPatientDetails.dob, $rootScope.currentPatientDetails.guardianName, data.patientID, $rootScope.currentPatientDetails.account.isAuthorized, ' ');
                // $rootScope.doGetSelectedPatientProfiles(data.patientID);
                var editdate = $rootScope.currentPatientDetails.dob;
                $rootScope.doddate = new Date($rootScope.healthInfoDOB);
                $rootScope.restage = getAge( $rootScope.doddate);

                if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId == $rootScope.patientId)) {
                    $rootScope.viewemailDisplay = 'flex';
                    $rootScope.viewtimezoneDisplay = 'flex';
                } else {
                    $rootScope.viewemailDisplay = 'none';
                    $rootScope.viewtimezoneDisplay = 'none';

                }

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
            error: function(data, status) {
                if (status === 400) {
                    $scope.ErrorMessage = "Patient already exists with email " + $scope.healthInfoEmail;
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 0 ){
                  $scope.ErrorMessage = "Internet connection not available, Try again later!";
                  $rootScope.Validation($scope.ErrorMessage);
                }else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.putProfileUpdation(params);
    }

    $scope.doDependentToUnauthorized = function(currentPatientDetails) {
        if (!angular.isUndefined($rootScope.userDOBDateFormat) && $rootScope.userDOBDateFormat !== '') {
            $scope.dob = " . " + ageFilter.getDateFilter($rootScope.userDOBDateFormat);
        } else {
            $scope.dob = '';
        }
        if (!angular.isUndefined(currentPatientDetails.account.relationship) && currentPatientDetails.account.relationship !== '') {
            $scope.relationship = " . " + currentPatientDetails.account.relationship;
        } else {
            $scope.relationship = '';
        }
        var myPopup = $ionicPopup.show({
            title: "<a class='item-avatar popupaligned'>  <img src='" + $rootScope.PatientImageSelectUser + "'><span><span class='popupname popupalign'><b>" + currentPatientDetails.patientName + "</b></span> <span class='sname ellipsis'>" + currentPatientDetails.lastName + "</span> </span></a> ",
            subTitle: "<p class='popupfont '>" + $rootScope.userGender + $scope.dob + $scope.relationship + "</p>",
            templateUrl: 'templates/healthUnauthorizedPopup.html',
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

        myPopup.then(function(res) {
            if (res) {
                $rootScope.patientAuthorizeValue = 'N';
                $rootScope.patientAuthorize = false;
                $rootScope.patientUnAuthorize = true;
                // $rootScope.doUpdateDependentsAuthorize(dependentDetails.patientId, dependentDetails.relationCode, relateDependentAuthorize);
            } else {}
        });
        $scope.closepopup = function() {
            myPopup.close();
        }
    }

    $scope.doDependentToAuthorized = function(currentPatientDetails) {
        if (!angular.isUndefined($rootScope.userDOBDateFormat) && $rootScope.userDOBDateFormat !== '') {
            $scope.dob = " . " + ageFilter.getDateFilter($rootScope.userDOBDateFormat);
        } else {
            $scope.dob = '';
        }
        if (!angular.isUndefined(currentPatientDetails.account.relationship) && currentPatientDetails.account.relationship !== '') {
            $scope.relationship = " . " + currentPatientDetails.account.relationship;
        } else {
            $scope.relationship = '';
        }
        var myPopup = $ionicPopup.show({
            title: "<a class='item-avatar popupaligned'>  <img src='" + $rootScope.PatientImageSelectUser + "'><span><span class='popupname popupalign'><b>" + currentPatientDetails.patientName + "</b></span> <span class='sname ellipsis'>" + currentPatientDetails.lastName + "</span> </span></a> ",
            subTitle: "<p class='popupfont '>" + $rootScope.userGender + $scope.dob + $scope.relationship + "</p>",
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

        myPopup.then(function(res) {
            if (res) {
                $rootScope.patientAuthorizeValue = 'Y';
                $rootScope.patientAuthorize = true;
                $rootScope.patientUnAuthorize = false;
                // $rootScope.doUpdateDependentsAuthorize(dependentDetails.patientId, dependentDetails.relationCode, relateDependentAuthorize);
            } else {

            }
        });
        $scope.closepopup = function() {
            myPopup.close();
        }
    }

    $scope.updateDependentRelation = function(patientID, relationshipID, authorizeID) {
        var params = {
            accessToken: $rootScope.accessToken,
            patientId: patientID,
            RelationCodeId: relationshipID,
            IsAuthorized: authorizeID,
            success: function(data) {
                console.log(data);
            },
            error: function(data, status) {
                if (status === 401) {
                    $scope.ErrorMessage = "Relation did not update";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.updateDependentsAuthorize(params);
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
                $rootScope.patientMedicalSurgeriesCount = $rootScope.patientmedicalsurgeries.length;
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

    $rootScope.getCodesSetsForHospital = function() {
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
              if(data =='null' ){
                $scope.ErrorMessage = "Internet connection not available, Try again later!";
                $rootScope.Validation($scope.ErrorMessage);
              }else{
                  $rootScope.serverErrorMessageValidation();
              }

            }
        };
        LoginService.getCodesSet(params);
    };

    $scope.getCodesSetsForHospital();

    $scope.healthsearch = function(patientmedications) {

        $scope.data.searchProvider = '';
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
        if (currentmedication.checked === true) {
            $rootScope.checkedMedication++;
            console.log($rootScope.checkedMedication);
        } else {
            $rootScope.checkedMedication--;
            currentmedication.checked === false;
        }

        if ((currentmedication.text === "Other - (List below)") && $rootScope.checkedMedication <= 4) {
            //  $scope.openOtherCurrentMedicationView(currentmedication);
        } else {
            if ($rootScope.checkedMedication == 4) {

                $rootScope.checkedMedication--;
                $scope.medicationdone();
            }
            if ($rootScope.checkedMedication >= 4) {
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
        $scope.data.searchProvider = '';
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
            //    $scope.openOtherAllergiesView(allergie);
        } else {
            if ($rootScope.checkedAllergies == 4) {

                $rootScope.checkedAllergies--;
                $scope.allergiedone();
            }
            if ($rootScope.checkedAllergies >= 4) {
                allergie.checked === false;
                $scope.modal.hide();
            }
        }


    }

    /*
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
                              item.checked === true
                                $scope.allergiedone();
                            }
                            return $scope.data.AllergiesOther;
                        }
                    }
                }]
            });
        };
    */



    $scope.chronicsearch = function() {
        $scope.data.searchProvider = '';
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
            }
            if ($rootScope.checkedChronic >= 4) {
                chronic.checked === false;
                $scope.modal.hide();
            }
        }


    }
    $scope.data = {};

    $scope.$watch('data.searchProvider', function(searchKey) {
        $rootScope.providerSearchKey = searchKey;
        if (typeof $rootScope.providerSearchKey == 'undefined') {
            $scope.data.searchProvider = $rootScope.backProviderSearchKey;
        }
        if ($rootScope.providerSearchKey != '' && typeof $rootScope.providerSearchKey != 'undefined') {
            $rootScope.iconDisplay = 'none';
        } else {
            $rootScope.iconDisplay = 'Block';
        }
    });




    $scope.doGetListOfCoUsers = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            authorizedOnly: true,
            success: function(data) {
                //$scope.listOfCoUser = JSON.stringify(data, null, 2);
                $rootScope.listOfCoUserDetails = [];
                angular.forEach(data.data, function(index, item) {
                    if (index.patientId !== $rootScope.primaryPatientId) {
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
                            var gender = "Female";
                        }
                        if (index.imagePath) {
                            $scope.coUserImagePath = index.imagePath;
                        } else {
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

            },
            error: function(data) {
              if(data =='null' ){
               $scope.ErrorMessage = "Internet connection not available, Try again later!";
               $rootScope.Validation($scope.ErrorMessage);
             }else{
                 $rootScope.serverErrorMessageValidation();
             }
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
              if(data =='null' ){
                 $scope.ErrorMessage = "Internet connection not available, Try again later!";
                 $rootScope.Validation($scope.ErrorMessage);
               }else{
                   $rootScope.serverErrorMessageValidation();
               }
            }
        };
        LoginService.deleteAccountCoUser(params);
    }

    $scope.removemodal = function(model) {
        $scope.modal.hide();
        $scope.cancelshow = true;
    };

    $scope.surgery = {};
    $rootScope.surgeryYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);
    $scope.showSurgeryPopup = function() {
        $ionicModal.fromTemplateUrl('templates/tab-surgeries.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose: false
        }).then(function(modal) {

            $scope.modal = modal;
            $scope.surgery.name = '';
            $scope.surgery.dateString = '';
            $scope.surgery.dateStringMonth = '';
            $scope.surgery.dateStringYear = '';
            $scope.modal.show();
            $timeout(function() {
                $('option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);
        });
    };

    $rootScope.ValidationFunction1 = function($a) {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> ' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';


        $("#notifications-top-center").remove();
        //$( ".ppp" ).prepend( top );
        $(".ErrorMessage").append(top);
        //$(".notifications-top-center").addClass('animated ' + 'bounce');
        refresh_close();

    }

    $scope.closeSurgeryPopup = function(model) {
        $scope.surgery.name;
        $scope.surgery.dateString;
        $scope.surgery.dateStringMonthVal = $scope.surgery.dateStringMonth;
        $scope.surgery.dateStringYearVal = $scope.surgery.dateStringYear;
        var selectedSurgeryDate = new Date($scope.surgery.dateStringYear, $scope.surgery.dateStringMonth - 1, 01);
        $scope.surgery.dateString = selectedSurgeryDate;
        var patientBirthDateStr = new Date($rootScope.PatientAge);

        var isSurgeryDateValid = true;
        if (selectedSurgeryDate < patientBirthDateStr) {
            isSurgeryDateValid = false;
        }
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var isSurgeryDateIsFuture = true;
        if ($scope.surgery.dateStringYear === yyyy) {
            if ($scope.surgery.dateStringMonth > mm) {
                var isSurgeryDateIsFuture = false;
            }
        }

        if ($scope.surgery.name == '' || $scope.surgery.name == undefined) {
            $scope.ErrorMessage = "Please provide a name/description for this surgery";
            $rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if (($scope.surgery.dateStringMonth === '' || $scope.surgery.dateStringMonth === undefined || $scope.surgery.dateStringYear === '' || $scope.surgery.dateStringYear === undefined)) {
            $scope.ErrorMessage = "Please enter the date as MM/YYYY";
            $rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if (!isSurgeryDateValid) {
            $scope.ErrorMessage = "Surgery date should not be before your birthdate";
            $rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if (!isSurgeryDateIsFuture) {
            $scope.ErrorMessage = "Surgery date should not be the future Date";
            $rootScope.ValidationFunction1($scope.ErrorMessage);
        } else {
            $scope.newSurgery = {
                'Description': $scope.surgery.name,
                'Month': $scope.surgery.dateStringMonthVal,
                'Year': $scope.surgery.dateStringYearVal
            };
            $rootScope.patientmedicalsurgeries.push($scope.newSurgery);
            $scope.isToHideModal = false;
            if ($rootScope.patientmedicalsurgeries.length == 3)
                $scope.isToHideModal = true;
            $scope.surgery = {};
            $rootScope.showNewSurgeryAdd = false;
            $scope.updateMedicalProfile($scope.isToHideModal);
        }
    }

    $scope.updateMedicalProfile = function(hide) {
        var params = {

            accessToken: $rootScope.accessToken,
            MedicationAllergies: $rootScope.patientmedicationsallergies,
            Surgeries: $rootScope.patientmedicalsurgeries,
            MedicalConditions: $rootScope.ChronicupdateList,
            Medications: $rootScope.patientmedications,
            InfantData: $scope.InfantData,
            PatientId: $rootScope.patientId,
            success: function(data) {

                $scope.health();
                $timeout(function() {
                    $('option').filter(function() {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                }, 100);
                if (hide) {
                    $scope.modal.hide();
                }

            },
            error: function(data) {
                $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
            }
        };

        LoginService.putPatientMedicalProfile(params);
    };

    $scope.hideSurgeryPopup = function(model) {
        $scope.modal.hide();
        $rootScope.showNewSurgeryAdd = false;
    };

    //$scope.CustomCalendar = CustomCalendar;

    $scope.getMonthName = function(month) {
        var monthName = CustomCalendar.getMonthName(month);
        return monthName;
    };

    $scope.showNewSurgeryAddScreen = function() {
        $rootScope.showNewSurgeryAdd = true;
    };

    $scope.removeSurgeryItem = function(index) {
        $rootScope.patientmedicalsurgeries.splice(index, 1);
        $scope.isToHideModal = false;
        if ($rootScope.patientmedicalsurgeries.length == 3)
            $scope.isToHideModal = true;
        $scope.updateMedicalProfile($scope.isToHideModal);
    };

    $scope.removePriorSurgeries = function(index, item) {
        $rootScope.patientSurgeriess.splice(index, 1);
        var indexPos = $rootScope.patientSurgeriess.indexOf(item);
        $rootScope.IsToPriorCount--;
        //console.log($rootScope.IsToPriorCount--);
    }



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


    $scope.uploadPhotoForExistingPatient = function() {
        if ($rootScope.updatedPatientImagePath !== '' && typeof $rootScope.updatedPatientImagePath !== 'undefined') {
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


    $scope.clearSelectionAndRebindSelectionList = function(selectedListItem, mainListItem) {
        angular.forEach(mainListItem, function(item, key2) {
            item.checked = false;
        });
        if (!angular.isUndefined(selectedListItem)) {

            if (selectedListItem.length > 0) {
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
    $timeout(function() {
        $('option').filter(function() {
            return this.value.indexOf('?') >= 0;
        }).remove();
    }, 100);

    $rootScope.drawSVGCIcon = function(iconName) {
        return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        exit;
    };




});

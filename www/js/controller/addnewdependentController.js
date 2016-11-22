angular.module('starter.controllers')

.controller('addnewdependentController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $timeout, $rootScope, $state, LoginService, $stateParams, $location, $cordovaFileTransfer, $ionicLoading, $ionicScrollDelegate, $ionicModal, $filter, $ionicPopup, $log, $window, $ionicBackdrop) {

    $timeout(function() {
        $('option').filter(function() {
            return this.value.indexOf('?') >= 0;
        }).remove();
    }, 100);
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
    $rootScope.ValidationFunction1 = function($a) {
        function refresh_close() {
            $('.close').click(function() {
                $(this).parent().fadeOut(200);
            });
        }
        refresh_close();

        var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> ' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
        $("#notifications-top-center").remove();
          $(".ErrorMessage").append(top);
        refresh_close();
    }
    $scope.hghtunit = false;
      $rootScope.flagdeptmodal=true;
    $scope.heightmodal = function() {
        document.getElementById('hunit').innerHTML = '';
        $ionicModal.fromTemplateUrl('templates/tab-heighttemplate.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose: false
        }).then(function(modal) {
            var hghtinval = $('#heightdep').val();
            $scope.modal = modal;
            $scope.modal.show().then(function() {
                $rootScope.flagdeptmodal=false;
              if(hghtinval===""){
                $('#deptheight').val("");
                $('#deptheight2').val("");
                document.getElementById('heightunitval').selectedIndex = 0;
                $scope.hfeet=true;
                $scope.hinch=true;
                $scope.hmeter=true;
                $scope.hcmeter=true;
              }
              else{
                var reminspace = hghtinval.split(" ");
                var fet = reminspace[0];
                var finc = reminspace[2];
                var units = reminspace[1];
                if (units === "ft") {
                    document.getElementById('heightunitval').selectedIndex = 0;
                    $('#deptheight').val(fet);
                    $('#deptheight2').val(finc);
                    $scope.hfeet = true;
                    $scope.hinch = true;
                    $scope.hmeter = true;
                    $scope.hcmeter = true;
                }   else if (units === "m") {
                      document.getElementById('heightunitval').selectedIndex = 1;
                      $('#deptheight').val(fet);
                      $('#deptheight2').val(finc);
                      $scope.hfeet = false;
                      $scope.hinch = false;
                      $scope.hmeter = false;
                      $scope.hcmeter = false;
                  }
                  else {
                        $('#deptheight').val("");
                        $('#deptheight2').val("");
                        $scope.hfeet = true;
                        $scope.hinch = true;
                        $scope.hmeter = true;
                        $scope.hcmeter = true;
                    }

              }


            });

              $timeout(function() {
                //  $scope.modal.remove()
                $('option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);
        });

    }
    $rootScope.removemodal = function() {
        $rootScope.flagdeptmodal=true;
      $('#deptheight').val("");
      $('#deptheight2').val("");
        $scope.modal.remove()
            .then(function() {
                $scope.modal = null;
            });

        $('option').filter(function() {
            return this.value.indexOf('?') >= 0;
        }).remove();
        $('#heightdep').val('');
        $("#deptheight").val('');
        $('#depheight2').val('');
    };

    $scope.getOnlyNumbers = function(text) {
        var newStr = text.replace(/[^0-9.]/g, "");
        return newStr;
    }
    $scope.addNewDependent = {};
    $scope.addNewDependent.homeadd = $rootScope.primaryPatientDetails[0].address;
    var newUploadedPhoto;

    $('input').blur(function() {
        $(this).val(
            $.trim($(this).val())
        );
    });
    var countUp = function() {
        $scope.tempfooter = true;
        $scope.permfooter = true;
    }
    $timeout(countUp, 5000);
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
    $scope.hfeet = true;
    $scope.hinch = true;
    $scope.hmeter = true;
    $scope.hcmeter = true;

      $scope.ngBlur = function() {
            $rootScope.doddate = $('#dob').val();
            $rootScope.restage = getAge($rootScope.doddate);
            if ($rootScope.restage >= 12) {

                $rootScope.emailDisplay = 'flex';
                $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.emailDisplay = 'none';
                $rootScope.timezoneDisplay = 'none';

            }
        }

        $scope.depheight1 = function() {
              var max = 10;
              var heights = $("#deptheight").val();
              if (heights === "") {
                  $("#deptheight").val("");
              } else if (heights > max) {

                  $("#deptheight").val(max);
              }
              var heightlen = $("#deptheight").val().length;
              if (heightlen > 2) {
                $("#deptheight").val(max);

              }
          }
          $scope.height1len = function() {
              var max = 10;
              var heightvallen = $('#deptheight').val().length;
              if (heightvallen > 2) {
                  $("#deptheight").val(max);
              }
          }
          $scope.depheight2 = function() {
              var max = 99;
              var height2val = $('#deptheight2').val();

              if (height2val === "") {
                  $("#deptheight2").val("");
              } else if (height2val > max) {
                  $("#deptheight2").val(max);
              }

              var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
              var getheightunit = _.first(heightunit);
              if (getheightunit === "ft/in") {
                  var maxheight = 11;
                  if (height2val > maxheight) {
                      $("#deptheight2").val(maxheight);
                  }
              }
          }
          $scope.height2len = function() {
              var max = 99;
              var height2vallen = $('#deptheight2').val().length;

              if (height2vallen > 2) {
                  $("#deptheight2").val(max);
              }
              var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
              var getheightunit = _.first(heightunit);
              if (getheightunit === "ft/in") {
                  var maxheight = 11;
                  if (height2vallen > maxheight) {
                      $("#deptheight2").val(maxheight);
                  }
              }
          }
    $scope.unitchange = function() {
        var maxheight = 11;
        var heightunits = $("#heightunitval").val().split("@").slice(1, 2);
        var getheightunit = _.first(heightunits);
        if (getheightunit === "ft/in") {
            $scope.hfeet = true;
            $scope.hinch = true;
            $scope.hmeter = true;
            $scope.hcmeter = true;
            var height2val = $('#deptheight').val();
            if (height2val !== "") {
                if (height2val > maxheight) {
                    $("#deptheight2").val(maxheight);
                }
            }
        } else {
            $scope.hfeet = false;
            $scope.hinch = false;
            $scope.hmeter = false;
            $scope.hcmeter = false;
        }
    }

    $scope.weightunitchange = function() {
        var maxweight = 999;
        var weightval = $('#weight').val();
        if (weightval > maxweight) {
            $("#weight").val(maxweight);
        }
    }
    $scope.weight1len = function() {
        var maxweight = 999;
        var weightvallen = $('#weight').val().length;
        var wghtparse=$('#weight').val();
        var weightparse=parseInt(wghtparse);
        if (weightvallen > 3) {
            $("#weight").val(maxweight);
        }else if(weightparse===0){
          $('#weight').val('')
          $scope.ErrorMessage = "Please enter valid Weight";
          $rootScope.Validation($scope.ErrorMessage);
        }
    }

    $scope.heightsave = function() {
      var heightdepval;
        $rootScope.height1 = $('#deptheight').val();
        $rootScope.height2 = $('#deptheight2').val();
        var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
        var heightunitid = $("#heightunitval").val().split("@").slice(0, 1);
        var getheightunitid = _.first(heightunitid);
        var getheightunit = _.first(heightunit);
        if (getheightunit === "ft/in") {
            if ($rootScope.height1 !== '' && $rootScope.height2 !== '') {
                 heightdepval = $('#deptheight').val() + " " + "ft" + " " + $('#deptheight2').val() + " " + "in";
                $('#heightdep').val(heightdepval);
            } else if ($rootScope.height1 !== '' && $rootScope.height2 === '') {
                 heightdepval = $('#deptheight').val() + " " + "ft" + " " + "0" + " " + "in";
                $('#heightdep').val(heightdepval);
            } else {
                 heightdepval = $('#deptheight').val() + " " + "ft" + " " + "0" + " " + 'in';
                $('#heightdep').val(heightdepval);
            }
        } else {
            if ($rootScope.height1 !== '' && $rootScope.height2 !== '') {
                 heightdepval = $('#deptheight').val() + " " + "m" + " " + $('#deptheight2').val() + " " + "cm";
                $('#heightdep').val(heightdepval);
            } else if ($rootScope.height !== '' && $rootScope.height === '') {
                 heightdepval = $('#deptheight').val() + " " + "m" + " " + "0" + " " + "cm";
                $('#heightdep').val(heightdepval);
            } else {
                 heightdepval = $('#deptheight').val() + " " + "m" + " " + "0" + " " + "cm";
                $('#heightdep').val(heightdepval);
            }
        }
        document.getElementById("hunit").innerHTML = getheightunitid;
        if ($rootScope.height1 === 'undefined' || $rootScope.height1 === '') {
            $scope.ErrorMessage = "Please enter height";
            $rootScope.ValidationFunction1($scope.ErrorMessage);
        }else if($rootScope.height2===0 && $rootScope.height1 ===0){
          $scope.ErrorMessage = "Please enter valid height";
          $rootScope.ValidationFunction1($scope.ErrorMessage);
        } else {
            $rootScope.flagdeptmodal=true;
            $scope.modal.remove()
                .then(function() {
                    $scope.modal = null;
                });
        }
        $('option').filter(function() {
            return this.value.indexOf('?') >= 0;
        }).remove();
    }

    $scope.phoneBlur = function() {
        $scope.phonelength = $("#homephone").val().length;
        var phonevalue = $("#homephone").val();
        if (phonevalue !== '') {
            if ($scope.phonelength < 14) {
                $scope.ErrorMessage = "Please enter valid Home Phone Number";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }
    }
    $scope.ValidateEmail = function(email) {
        var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return expr.test(email);
    };
    $scope.emailBlur = function() {
        var emailvalue = $('#email').val();
        if (emailvalue !== '') {
            if (!$scope.ValidateEmail($("#email").val())) {
                $scope.ErrorMessage = "Please enter a valid Email Address";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }
    }
    $scope.isDisabled = false;

    $scope.postDependentDetails = function() {


        $scope.firstName = $("#firstname").val();
        $scope.lastName = $("#lastname").val();
        $scope.email = $("#email").val();
        $scope.dob = $("#dob").val();
        $scope.relation = $("#relation").val();
        var splitheight = $('#heightdep').val();
        $scope.splitheights = $('#heightdep').val();
      //  var inch = splitheight.slice(6, 8)

        if ($rootScope.height2 === "") {
            $scope.heightinch = "0";
        } else {
            $scope.heightinch = $rootScope.height2;
        }
        $scope.heightft = $rootScope.height1;
        $scope.gender = $("#depgender").val();
        $scope.height = $scope.heightft;
        $scope.height2 = $scope.heightinch;
        $scope.weight = $("#weight").val();
        $scope.homephone = $("#homephone").val();
        $scope.phonelength = $("#homephone").val().length;
        $scope.mobile = $("#mobile").val();
        $scope.mobilelength = $("#mobile").val().length;
        $scope.homeaddress = $scope.addNewDependent.homeadd;
        if ($rootScope.OrganizationLocation === 'on') {
            var org = document.getElementById("organization");
            var loc = document.getElementById("location");
            if (org !== "Choose Organization") {
                $scope.organization = null;
                $scope.orgid = null;
            } else {
                var dependentorgan = org.options[org.selectedIndex].text;
                $scope.organization = dependentorgan;
                $scope.orgid = org.options[org.selectedIndex].value;
            }
            if (loc !== "Choose Location") {
                $scope.location = null;
                $scope.locationid = null;
            } else {
                var dependentloc = loc.options[loc.selectedIndex].text;
                $scope.location = dependentloc;
                $scope.locationid = loc.options[loc.selectedIndex].value;

            }
        } else {
            $scope.organization = null;
            $scope.location = null;
            $scope.orgid = null;
            $scope.locationid = null;
        }
        $scope.dependentCountry = $("#dependentCountry").val();
        $scope.dependentTimezone = $("#dependentTimezone").val();
        $scope.relation = $("#dependentrelation").val().split("@").slice(0, 1);
        $rootScope.getRelationId = _.first($scope.relation);
        $scope.getHeightunit = $('#hunit').text();
        $scope.weightunit = $("#weightunit").val().split("@").slice(0, 1);
        $scope.getWeightunit = _.first($scope.weightunit);
        $scope.hairColor = $('#hairColor').val();
        if (!angular.isUndefined($scope.hairColor) && $scope.hairColor !== '') {
            $scope.splitHairColor = $scope.hairColor.split("@");
            $scope.getHairColorId = $scope.splitHairColor[0];
            $scope.getHairColorText = $scope.splitHairColor[1];
        } else {
            $scope.getHairColorId = null;
        }
        $scope.eyeColor = $('#eyeColor').val();
        if (!angular.isUndefined($scope.eyeColor) && $scope.eyeColor !== '') {
            $scope.splitEyeColor = $scope.eyeColor.split("@");
            $scope.getEyeColorId = $scope.splitEyeColor[0];
            $scope.getEyeColorText = $scope.splitEyeColor[1];
        } else {
            $scope.getEyeColorId = null;
        }
        $scope.ethnicity = $('#ethnicity').val();
        if (!angular.isUndefined($scope.ethnicity) && $scope.ethnicity !== '') {
            $scope.splitEthnicity = $scope.ethnicity.split("@");
            $scope.getEthnicityId = $scope.splitEthnicity[0];
            $scope.getEthnicityText = $scope.splitEthnicity[1];
        } else {
            $scope.getEthnicityId = null;
        }
        $scope.bloodtype = $('#bloodtype').val();
        if (!angular.isUndefined($scope.bloodtype) && $scope.bloodtype !== '') {
            $scope.splitBloodType = $scope.bloodtype.split("@");
            $scope.getBloodtypeid = $scope.splitBloodType[0];
            $scope.getBloodTypeText = $scope.splitBloodType[1];
        } else {
            $scope.getBloodtypeid = null;
        }

        $rootScope.doddate = $('#dob').val();
        $rootScope.restage = getAge($scope.dob);
        var selectedDate = document.getElementById('dob').value;
        var now = new Date();
        var dt1 = Date.parse(now),
            dt2 = Date.parse(selectedDate);
        if ($rootScope.restage >= 12) {
            if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
                $scope.ErrorMessage = "Please enterenter First Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
                $scope.ErrorMessage = "Please enter Last Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
                $scope.ErrorMessage = "Please enter DOB";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (dt2 > dt1) {
                $scope.ErrorMessage = "DOB can not be in Future";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
                $scope.ErrorMessage = "Please select Relation";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
                $scope.ErrorMessage = "Please select Gender";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.splitheights === 'undefined' || $scope.splitheights === '') {
                $scope.ErrorMessage = "Please enter Height";
                $rootScope.Validation($scope.ErrorMessage);

            } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
                $scope.ErrorMessage = "Please select Height Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
                $scope.ErrorMessage = "Please select Weight";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.getWeightunit === 'undefined' || $scope.getWeightunit === '') {
                $scope.ErrorMessage = "Please select Weight Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
                $scope.ErrorMessage = "Please choose Country";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.dependentTimezone === 'undefined' || $scope.dependentTimezone === '') {
                $scope.ErrorMessage = "Please choose Time Zone";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
                $scope.ErrorMessage = "Please enter Mobile Number";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($scope.mobilelength < 14) {
                $scope.ErrorMessage = "Please enter valid Mobile Number";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '' || $scope.getBloodtypeid === null)) {
                $scope.ErrorMessage = "Please select Blood Type";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '' || $scope.getHairColorId === null)) {
                $scope.ErrorMessage = "Please select Hair Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '' || $scope.getEyeColorId === null)) {
                $scope.ErrorMessage = "Please select Eye Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '' || $scope.getEthnicityId === null)) {
                $scope.ErrorMessage = "Please select Ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                if (typeof $scope.height2 === 'undefined' || $scope.height2 === '') {
                    $scope.height2 = "0";
                }
                $scope.doPostNewDependentuser();
            }
        } else {
            if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
                $scope.ErrorMessage = "Please enter First Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
                $scope.ErrorMessage = "Please enter Last Name";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
                $scope.ErrorMessage = "Please enter DOB";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (dt2 > dt1) {
                $scope.ErrorMessage = "DOB can not be in Future";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
                $scope.ErrorMessage = "Please select Relation";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
                $scope.ErrorMessage = "Please select Gender";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.splitheights === 'undefined' || $scope.splitheights === '') {
                $scope.ErrorMessage = "Please enter Height";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
                $scope.ErrorMessage = "Please select Height Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
                $scope.ErrorMessage = "Please enter Weight";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.getWeightunit === 'undefined' || $scope.getWeightunit === '') {
                $scope.ErrorMessage = "Please select Weight Unit";
                $rootScope.Validation($scope.ErrorMessage);
            } else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
                $scope.ErrorMessage = "Please choose Country";
                $rootScope.Validation($scope.ErrorMessage);
            }
            else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
                $scope.ErrorMessage = "Please enter Mobile Number";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($scope.mobilelength < 14) {
                $scope.ErrorMessage = "Please enter valid Mobile Number";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '' || $scope.getBloodtypeid === null)) {
                $scope.ErrorMessage = "Please select Blood Type";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '' || $scope.getHairColorId === null)) {
                $scope.ErrorMessage = "Please select Hair Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '' || $scope.getEyeColorId === null)) {
                $scope.ErrorMessage = "Please select Eye Color";
                $rootScope.Validation($scope.ErrorMessage);
            } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '' || $scope.getEthnicityId === null)) {
                $scope.ErrorMessage = "Please select Ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
            } else {
                $scope.doPostNewDependentuser();
            }
        }
      }
    $scope.doPostNewDependentuser = function() {
        $scope.isDisabled = true;
        var params = {
            accessToken: $scope.accessToken,
            EmailAddress: $scope.email,
            PatientProfileData: {
                patientId: $rootScope.patientId,
                patientName: $scope.firstName,
                lastName: $scope.lastName,
                dob: $scope.dob,
                bloodType: $scope.getBloodtypeid,
                eyeColor: $scope.getEyeColorId,
                gender: $scope.gender,
                ethnicity: $scope.getEthnicityId,
                hairColor: $scope.getHairColorId,
                homePhone: $scope.getOnlyNumbers($scope.homephone),
                mobilePhone: $scope.dependentCountry + $scope.getOnlyNumbers($scope.mobile),
                schoolName: "",
                schoolContact: "",
                primaryPhysician: null,
                primaryPhysicianContact: null,
                physicianSpecialist: null,
                physicianSpecialistContact: null,
                preferedPharmacy: null,
                pharmacyContact: null,
                address: $scope.homeaddress,
                profileImagePath: $rootScope.newDependentImagePath,
                height: $scope.height + "|" + $scope.height2,
                weight: $scope.weight,
                heightUnit: $scope.getHeightunit,
                weightUnit: $scope.getWeightunit,
                organization: $scope.organization,
                location: $scope.location,
                organizationId: $scope.orgid,
                locationId: $scope.locationid,
                country: $scope.dependentCountry
            },
            TimeZoneId: $scope.dependentTimezone,
            PatientProfileFieldsTracing: {
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
            PatientMedicalHistoryData: {
                patientId: $scope.patientId,
            },

            success: function(data) {
              $('#dependentuserform')[0].reset();
              var updatepatientdetail = data.data;
                $rootScope.deppatientId = updatepatientdetail[0].patientId;
                var depPatientSuccessPtId = updatepatientdetail[0].patientId;
                var depPatientSecurityToken = updatepatientdetail[0].securityToken;
                if (!angular.isUndefined(depPatientSecurityToken) && $rootScope.restage >= 12 && $scope.email !== "") {
                    var ptName = $scope.firstName + " " + $scope.lastName;
                    $scope.sendCoUserInvite($rootScope.hospitalId, depPatientSuccessPtId, ptName, $scope.email, depPatientSecurityToken);
                }
                $scope.updateDependentRelation();
                $scope.isDisabled = false;

            },
            error: function(data, status) {
                $scope.isDisabled = false;
                $('select option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
                if (data.status === 400) {
                    $scope.ErrorMessage = data.statusText;
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (status === 0) {

                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
              }
        };
        LoginService.postNewDependentuser(params);
      }

      $scope.doChkAddressForReg = function(homeaddress) {
        var params = {
            AddressText: homeaddress,
            HospitalId: $rootScope.hospitalId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data.data[0].isAvailable === true) {
                    $scope.ErrorMessage = "Email ID Already Registered";
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    $scope.ErrorMessage = "Patient Registration is not allowed for this address";
                    $rootScope.Validation($scope.ErrorMessage);
                }
            },
            error: function() {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.chkAddressForReg(params);
    }
    $scope.updateDependentRelation = function() {
        var params = {
            accessToken: $rootScope.accessToken,
            patientId: $rootScope.deppatientId,
            RelationCodeId: $rootScope.getRelationId,
            IsAuthorized: "Y", //healthInfoAuthorize,
            success: function() {
                $('#dependentuserform')[0].reset();
                $('select').prop('selectedIndex', 0);
                if ($rootScope.newDependentImagePath !== '' && typeof $rootScope.newDependentImagePath !== 'undefined') {
                    $scope.uploadPhotoForDependant();
                } else {
                    $state.go('tab.relatedusers');
                }
            },
            error: function() {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.updateDependentsAuthorize(params);
    }

    $scope.sendCoUserInvite = function(hospitalId, userId, name, email, securityToken){

        if (securityToken.length > 3 && securityToken.substring(0, 2) === "##") {
            var params = {
                accessToken: $rootScope.accessToken,
                HospitalId: hospitalId,
                UserId: userId,
                Name: name,
                Email: email,
                Token: securityToken.substring(2),
                success: function() {
                  $scope.ErrorMessage = "A verification email has been sent to the user";
                  $rootScope.Validation($scope.ErrorMessage);
                },
                error: function() {
                  $scope.ErrorMessage = "Unable to sent email invitation";
                  $rootScope.Validation($scope.ErrorMessage);
                }
            };
            LoginService.sendCoUserEmailInvitation(params);
        }
    }

    $scope.canceldependent = function() {
      $ionicScrollDelegate.$getByHandle('isScroll').scrollTo();
         $('#dependentuserform')[0].reset();
         $('select').prop('selectedIndex', 0);
         history.back();
         if (!$scope.$$phase)
         $scope.$apply();

    }
    $scope.$watch('addNewDependent.healthInfoOrganization', function(newVal) {
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
                $rootScope.listOfLocForCurntOrg = "";
            }
        }
    });
    //Function to open ActionSheet when clicking Camera Button
    //================================================================================================================
    var options;
    $scope.showCameraActions = function() {
        options = {
            'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
            'addCancelButtonWithLabel': 'Cancel',
        };
        window.plugins.actionsheet.show(options, cameraActionCallback);
    }
    $scope.uploadPhotoForDependant = function() {
        var fileMimeType = "image/jpeg";
        var fileUploadUrl = apiCommonURL + "/api/v2.1/patients/profile-images?patientId=" + $rootScope.deppatientId;
        var targetPath = newUploadedPhoto;
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
            var getImageURLFromResponse = angular.fromJson(result.response);
            $rootScope.newDependentImagePath = getImageURLFromResponse.data[0].uri;
            $ionicLoading.hide();
            $state.go('tab.relatedusers');
        }, function() {
            $ionicLoading.hide();
            navigator.notification.alert('Unable to upload the photo. Please try again later.', null, $rootScope.alertMsgName, 'OK');
            $state.go('tab.relatedusers');
        }, function() {
             $ionicLoading.show({
                 template: '<img src="img/puff.svg" alt="Loading" />'
             });
        });
    };

    function cameraActionCallback(buttonIndex) {
        if (buttonIndex === 3) {
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
                allowEdit: 1,
                correctOrientation: true,
                saveToPhotoAlbum: saveToPhotoAlbumFlag,
                sourceType: cameraSourceType,
                mediaType: cameraMediaType,
            });
        }
    }
    // Function to call when the user choose image or video to upload
    function onCameraCaptureSuccess(imageData) {
        $rootScope.newDependentImagePath = imageData;
        newUploadedPhoto = imageData;
        $state.go('tab.addnewdependent');
    }
    function onCameraCaptureFailure() {}
});

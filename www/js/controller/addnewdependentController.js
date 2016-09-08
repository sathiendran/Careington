angular.module('starter.controllers')

    .controller('addnewdependentController',function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $timeout, $rootScope, $state, LoginService, $stateParams, $location, $cordovaFileTransfer, $ionicLoading,$ionicScrollDelegate,$ionicModal,$ionicPopup,$log,$window,$ionicBackdrop,Idle) {

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

$scope.hghtunit=false;
      $scope.$on('IdleStart', function() {
              console.log("aaa");
      });
      $scope.$on('IdleWarn', function(e, countdown) {
      });
      $scope.$on('IdleTimeout', function() {
        if (window.localStorage.getItem("tokenExpireTime") != null && window.localStorage.getItem("tokenExpireTime") != "") {
            if($rootScope.currState.$current.name != "tab.waitingRoom" && $rootScope.currState.$current.name != "videoConference") {
              navigator.notification.alert(
                   'Your session timed out.', // message
                   null,
                   $rootScope.alertMsgName,
                   'Ok' // buttonName
               );
              $rootScope.ClearRootScope();
            }
        }
      });

      $scope.$on('IdleEnd', function() {
          // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            console.log("aaa3");
      });

      $scope.$on('Keepalive', function() {
          // do something to keep the user's session alive
            console.log("aaa4");
      });

        $scope.getOnlyNumbers = function(text){
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
        $timeout(countUp,5000);


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



        $('input.firstname').blur(function() {
            var value = $.trim($(this).val());
            $(this).val(value);
        });


        $("#homephone").blur(function() {

            if (!this.value.match(/^[0-9]{1,18}$/)) {
                this.value = this.value.replace(/^[0-9]{1,18}$/g, '');

            }
        });
        $("#mobile").blur(function() {

            if (!this.value.match(/^[0-9]{1,18}$/)) {
                this.value = this.value.replace(/^[0-9]{1,18}$/g, '');

            }
        });
            var today = new Date();
            var nowyear = today.getFullYear();
            var nowmonth = today.getMonth()+1;
            var nowday = today.getDate();
$scope.hfeet=true;$scope.hinch=true;
$scope.hmeter=true;$scope.hcmeter=true;
$scope.heightmodal=function(){
    $('#heightdep').val('');
    $("#deptheight").val('');
    $('#depheight2').val('');
      document.getElementById('hunit').innerHTML = '';

  $ionicModal.fromTemplateUrl('templates/tab-heighttemplate.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false
  }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
      $scope.hfeet=true;$scope.hinch=true;
      $scope.hmeter=true;$scope.hcmeter=true;
      //  $("#heightvalue").val("");

      $timeout(function() {
          $('option').filter(function() {
              return this.value.indexOf('?') >= 0;
          }).remove();
      }, 100);
  });

}
$scope.removemodal = function(model) {
  $scope.modal.remove()
  .then(function() {
    $scope.modal = null;
  });
     var input = $('input');
     input.val('');
     input.trigger('input');
    $('option').filter(function() {
        return this.value.indexOf('?') >= 0;
    }).remove();
    // $ionicBackdrop.retain();
    $('#heightdep').val('');
    $("#deptheight").val('');
    $('#depheight2').val('');
};

   $scope.ngBlur = function () {
     $rootScope.doddate=$('#dob').val();
       $rootScope.restage = getAge(  $rootScope.doddate);
      if($rootScope.restage>=12 ){

        $rootScope.emailDisplay = 'flex';
        $rootScope.timezoneDisplay='flex';
      }else{
           $rootScope.emailDisplay = 'none';
           $rootScope.timezoneDisplay='none';

      }
   }
 // $scope.height = 0;
  // var heights='';
 $scope.depheight1=function(){
var max= 10;


        var heights=$("#deptheight").val();

       if (heights > max)
      {

          $("#deptheight").val(max);
      }
      var heightlen=$("#deptheight").val().length;

      if(heightlen>2){

        $("#deptheight").val(max);

      }
}
$scope.height1len=function(){
   var max = 10;
   var heightvallen=$('#deptheight').val().length;
   if(heightvallen>2){
       $("#deptheight").val(max);
   }
}
$scope.depheight2=function(){
       var max = 99;
       var height2val=$('#deptheight2').val();
       if ( height2val > max)
      {
          $("#deptheight2").val(max);
      }

      var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
      var getheightunit=_.first(heightunit);
      if(getheightunit=="ft/in"){
          var maxheight=11;
          if ( height2val > maxheight)
         {
             $("#deptheight2").val(maxheight);
         }
      }
}
$scope.height2len=function(){
  var max = 99;
  var height2vallen=$('#deptheight2').val().length;

  if(height2vallen>2){
      $("#deptheight2").val(max);
  }
  var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
  var getheightunit=_.first(heightunit);
  if(getheightunit=="ft/in"){
      var maxheight=11;
      if ( height2vallen > maxheight)
     {
         $("#deptheight2").val(maxheight);
     }
  }
}

$scope.unitchange=function(){
    var maxheight=11;
    //$scope.depunit=heightunit;
   var heightunits = $("#heightunitval").val().split("@").slice(1, 2);
   //var heightunit = $("#heightunit").val();
    var getheightunit=_.first(heightunits);
    if(getheightunit==="ft/in"){
      $scope.hfeet=true;$scope.hinch=true;
      $scope.hmeter=true;$scope.hcmeter=true;
        var height2val=$('#deptheight').val();
        if(height2val!=""){
            if ( height2val > maxheight)
           {
               $("#deptheight2").val(maxheight);
           }
        }
    }else{
      $scope.hfeet=false;$scope.hinch=false;
      $scope.hmeter=false;$scope.hcmeter=false;
    }
}

$scope.weightunitchange=function(){
       var maxweight = 999;
       var weightval=$('#weight').val();
       if ( weightval > maxweight)
      {
          $("#weight").val(maxweight);
      }
}
$scope.weight1len=function(){
    var maxweight = 999;
   var weightvallen=$('#weight').val().length;
   if(weightvallen>3){
       $("#weight").val(maxweight);
   }
}

$scope.heightsave=function(){
  $rootScope.height1=$('#deptheight').val();
  $rootScope.height2=$('#deptheight2').val();
 var heightunit = $("#heightunitval").val().split("@").slice(1, 2);
 var heightunitid = $("#heightunitval").val().split("@").slice(0, 1);
 var getheightunitid=_.first(heightunitid);
 var getheightunit=_.first(heightunit);
   if(getheightunit==="ft/in"){
     if($rootScope.height1!='' && $rootScope.height2 !=''  ){
       var heightdepval=$('#deptheight').val() + " " + "ft" + " " +  $('#deptheight2').val() + " " + "in";
       $('#heightdep').val(heightdepval);
     } else if($rootScope.height1!='' && $rootScope.height2==''){
        var heightdepval=$('#deptheight').val()+ " " +  "ft" + " " + "0"  + " " + "in";
        $('#heightdep').val(heightdepval);
      }
     else{
       var heightdepval=$('#deptheight').val() + " " + "ft" +" "+"0"+" " +'in';
       $('#heightdep').val(heightdepval);
     }
}else{
     if($rootScope.height1!='' && $rootScope.height2!=''){
       var heightdepval=$('#deptheight').val() +" "+ "m" + " " +$('#deptheight2').val() + " " + "cm";
   $('#heightdep').val(heightdepval);
 }
 else if($rootScope.height!='' && $rootScope.height==''){
   var heightdepval=$('#deptheight').val() +" "+ "m"+ " " +"0"+ " " + "cm";
   $('#heightdep').val(heightdepval);
 }
 else {
   var heightdepval=$('#deptheight').val() +" "+ "m"+ " " +"0"+ " " + "cm";
   $('#heightdep').val(heightdepval);
 }
}
 document.getElementById("hunit").innerHTML =getheightunitid;

 if ($rootScope.height1 === 'undefined' || $rootScope.height1 === '') {

 }else{
   $scope.modal.remove()
   .then(function() {
     $scope.modal = null;
   });
 }

  $('option').filter(function() {
      return this.value.indexOf('?') >= 0;
  }).remove();
  //  $('#heightform')[0].reset();
}

$scope.phoneBlur=function(){
$scope.phonelength=$("#homephone").val().length;
var phonevalue=$("#homephone").val();
if(phonevalue!=''){
    if($scope.phonelength < 14){
        $scope.ErrorMessage = "Please enter valid Home Phone Number";
        $rootScope.Validation($scope.ErrorMessage);
    }

}

}

        $scope.postDependentDetails = function() {
            $scope.firstName = $("#firstname").val();
            $scope.lastName = $("#lastname").val();
            $scope.email = $("#email").val();
            $scope.dob = $("#dob").val();
            $scope.relation = $("#relation").val();
            //$scope.healthInfoAuthorize = $("input[name='healthInfoAuthorize']:checked").val();
          //  $scope.gender = $("input[name='depgender']:checked").val();
            var splitheight=$('#heightdep').val();
            var inch=splitheight.slice(6,8)

            if($rootScope.height2==""){
              $scope.heightinch="0";
            }else{
              $scope.heightinch=$rootScope.height2;
            }
          //  $scope.heightft=splitheight.slice(0,2)
            $scope.heightft=$rootScope.height1;
            $scope.gender = $("#depgender").val();
            $scope.height =$scope.heightft;
            $scope.height2 =$scope.heightinch;
            $scope.weight = $("#weight").val();
            $scope.homephone = $("#homephone").val();
            $scope.phonelength=$("#homephone").val().length;
            $scope.mobile = $("#mobile").val();
            $scope.mobilelength=$("#mobile").val().length;
            //$scope.homeaddress = $("#homeadd").val();
            $scope.homeaddress = $scope.addNewDependent.homeadd;
            var org = document.getElementById("organization");
            var dependentorgan = org.options[org.selectedIndex].text;
            $scope.organization = dependentorgan;
            $scope.orgid = $("#organ").val();

            var loc = document.getElementById("location");
            var dependentloc = loc.options[loc.selectedIndex].text;
            $scope.location = dependentloc;
            $scope.locationid = $("#locate").val();
            $scope.dependentCountry = $("#dependentCountry").val();
            $scope.dependentTimezone = $("#dependentTimezone").val();
            $scope.relation = $("#dependentrelation").val().split("@").slice(0, 1);
            $rootScope.getRelationId = _.first($scope.relation);
            $scope.hairColor = $("#hairColor").val().split("@").slice(0, 1);
            $scope.getHairColorId = _.first($scope.hairColor);
            $scope.eyeColor = $("#eyeColor").val().split("@").slice(0, 1);
            $scope.getEyeColorId = _.first($scope.eyeColor);
            $scope.ethnicity = $("#ethnicity").val().split("@").slice(0, 1);
            $scope.getEthnicityId = _.first($scope.ethnicity);
          //  $scope.heightunit = $('#hunit').text();
            $scope.getHeightunit = $('#hunit').text();
            $scope.weightunit = $("#weightunit").val().split("@").slice(0, 1);
            $scope.getWeightunit = _.first($scope.weightunit);
            $scope.bloodtype = $("#bloodtype").val().split("@").slice(0, 1);
            $scope.getBloodtypeid = _.first($scope.bloodtype);
            $rootScope.doddate=$('#dob').val();
              $rootScope.restage = getAge($scope.dob);


           $scope.ValidateEmail = function(email) {
               //var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
               var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
               return expr.test(email);
           };

           var selectedDate = document.getElementById('dob').value;
           var now = new Date();
           var dt1 = Date.parse(now),
           dt2 = Date.parse(selectedDate);

  //  if ((age >=12  && age_month >= 0)) {
      if($rootScope.restage>=12 ){
      if ($scope.email === 'undefined' || $scope.email === '') {
          $scope.ErrorMessage = "Please enter Email Id";
          $rootScope.Validation($scope.ErrorMessage);
       } else if(!$scope.ValidateEmail($("#email").val())) {
           $scope.ErrorMessage = "Please enter a valid Email Address";
           $rootScope.Validation($scope.ErrorMessage);
       }
       else if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
           $scope.ErrorMessage = "Please enterenter First Name";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
           $scope.ErrorMessage = "Please enter Last Name";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
             $scope.ErrorMessage = "Please enter DOB";
             $rootScope.Validation($scope.ErrorMessage);
       } else if (dt2 >dt1) {
          $scope.ErrorMessage = "DOB can not be in Future";
          $rootScope.Validation($scope.ErrorMessage);
      }
        else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
            $scope.ErrorMessage = "Please select Relation";
            $rootScope.Validation($scope.ErrorMessage);
        }
       else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
           $scope.ErrorMessage = "Please select Gender";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.height === 'undefined' || $scope.height === '') {
           $scope.ErrorMessage = "Please enter Height";
           $rootScope.Validation($scope.ErrorMessage);
       // }else if (typeof $scope.height2 === 'undefined' || $scope.height2 === '') {
        //    //$scope.ErrorMessage = "Please Enter Your Height";
        //    //$rootScope.Validation($scope.ErrorMessage);
        //    $scope.height2 = "0";
       } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
           $scope.ErrorMessage = "Please select Height Unit";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
           $scope.ErrorMessage = "Please select Weight";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.getWeightunit == 'undefined' || $scope.getWeightunit === '') {
           $scope.ErrorMessage = "Please select Weight Unit";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
           $scope.ErrorMessage = "Please choose Country";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.dependentTimezone === 'undefined' || $scope.dependentTimezone === '') {
           $scope.ErrorMessage = "Please choose Time Zone";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
             $scope.ErrorMessage = "Please enter Mobile Number";
             $rootScope.Validation($scope.ErrorMessage);
       }else if($scope.mobilelength < 14){
           $scope.ErrorMessage = "Please enter valid Mobile Number";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '') {
           $scope.ErrorMessage = "Please select Blood Type";
           $rootScope.Validation($scope.ErrorMessage);
       }
       else if (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '') {
                $scope.ErrorMessage = "Please select Hair Color";
                $rootScope.Validation($scope.ErrorMessage);
      } else if (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '') {
                $scope.ErrorMessage = "Please select Eye Color";
                $rootScope.Validation($scope.ErrorMessage);
      } else if (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '') {
                $scope.ErrorMessage = "Please select Ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
      }
       else {
           if (typeof $scope.height2 === 'undefined' || $scope.height2 === '') {
               $scope.height2 = "0";
           }
          $scope.doPostNewDependentuser();
      }
   }else{
     if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
         $scope.ErrorMessage = "Please enter First Name";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
         $scope.ErrorMessage = "Please enter Last Name";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
           $scope.ErrorMessage = "Please enter DOB";
           $rootScope.Validation($scope.ErrorMessage);
    }else if (dt2 >dt1) {
       $scope.ErrorMessage = "DOB can not be in Future";
       $rootScope.Validation($scope.ErrorMessage);
   }
     else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
         $scope.ErrorMessage = "Please select Relation";
         $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
         $scope.ErrorMessage = "Please select Gender";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.height === 'undefined' || $scope.height === '') {
         $scope.ErrorMessage = "Please enter Height";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
         $scope.ErrorMessage = "Please select Height Unit";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
         $scope.ErrorMessage = "Please enter Weight";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.getWeightunit == 'undefined' || $scope.getWeightunit === '') {
         $scope.ErrorMessage = "Please select Weight Unit";
         $rootScope.Validation($scope.ErrorMessage);
     }else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
         $scope.ErrorMessage = "Please choose Country";
         $rootScope.Validation($scope.ErrorMessage);
     } /*else if (typeof $scope.dependentTimezone === 'undefined' || $scope.dependentTimezone === '') {
         $scope.ErrorMessage = "Please choose Time Zone";
         $rootScope.Validation($scope.ErrorMessage);
     }*/else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
           $scope.ErrorMessage = "Please enter Mobile Number";
           $rootScope.Validation($scope.ErrorMessage);
    }else if($scope.mobilelength < 14){
        $scope.ErrorMessage = "Please enter valid Mobile Number";
        $rootScope.Validation($scope.ErrorMessage);
    }else if (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '') {
         $scope.ErrorMessage = "Please select Blood Type";
         $rootScope.Validation($scope.ErrorMessage);
     }else if (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '') {
                $scope.ErrorMessage = "Please select Hair Color";
                $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '') {
                $scope.ErrorMessage = "Please select Eye Color";
                $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '') {
                $scope.ErrorMessage = "Please select Ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
    }
     else {
     $scope.doPostNewDependentuser();
    }
   }



        }
        $scope.doPostNewDependentuser = function() {
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
                    //homePhone: $scope.dependentCountry + $scope.getOnlyNumbers($scope.homephone),
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
                    //height: formatHeightVal($scope.height),
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

                    var updatepatientdetail = data.data;
                    $rootScope.deppatientId = updatepatientdetail[0].patientId;
                    $scope.updateDependentRelation();
                },
                  error: function(data) {
                      $('select option').filter(function() {
                          return this.value.indexOf('?') >= 0;
                      }).remove();
                    if(data.status === 400) {
                      $scope.ErrorMessage = data.statusText;
                      $rootScope.Validation($scope.ErrorMessage);
                    }else {
                      $rootScope.serverErrorMessageValidation();
                    }

                }
            };
            LoginService.postNewDependentuser(params);

        }

        $scope.doChkAddressForReg = function(homeaddress) {
          if ($scope.accessToken === 'No Token') {
              alert('No token.  Get token first then attempt operation.');
              return;
          }
          var params = {
              AddressText: homeaddress,
              HospitalId: $rootScope.hospitalId,
              accessToken: $rootScope.accessToken,
              success: function(data) {
                    if(data.data[0].isAvailable === true) {
                      $scope.ErrorMessage = "Email ID Already Registered";
                      $rootScope.Validation($scope.ErrorMessage);
                    } else {
                      $scope.ErrorMessage = "Patient Registration is not allowed for this address";
                      $rootScope.Validation($scope.ErrorMessage);
                    }
              },
              error: function(data) {
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
                success: function(data) {
                    $('#dependentuserform')[0].reset();
                    $('select').prop('selectedIndex', 0);
                    if($rootScope.newDependentImagePath !== '' && typeof $rootScope.newDependentImagePath !=='undefined') {
                        $scope.uploadPhotoForDependant();
                    }else{
                        $state.go('tab.relatedusers');
                    }

                },
                error: function(data, status) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.updateDependentsAuthorize(params);
        }

        $scope.canceldependent = function() {
            $('#dependentuserform')[0].reset();
            $('select').prop('selectedIndex', 0);
            $rootScope.couserslists = false;
            $rootScope.dependentuserslist = false;
          //  $state.go('tab.relatedusers');
          history.back();
          $scope.$apply();
        }

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

        $scope.uploadPhotoForDependant = function(){
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
            }, function(err) {
                $ionicLoading.hide();
                navigator.notification.alert('Unable to upload the photo. Please try again later.', null, $rootScope.alertMsgName, 'OK');
                $state.go('tab.relatedusers');
            }, function(progress) {

            });
        };


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
            $rootScope.newDependentImagePath = imageData;
            newUploadedPhoto = imageData;
        }

        function onCameraCaptureFailure(err) {
        }

    }).filter('secondDropdown', function() {
        return function(secondSelect, firstSelect) {
            var filtered = [];
            if (firstSelect === null) {
                return filtered;
            }
            if (secondSelect != undefined) {
                angular.forEach(secondSelect[0], function(s2) {
                    if (s2.organizationId == firstSelect) {
                        filtered.push(s2);
                    //   $scope.loctdetail=true;
                      }
                      else{
                      //$scope.loctdetail=false;
                      }
                });
            }


            return filtered;
        };
    });

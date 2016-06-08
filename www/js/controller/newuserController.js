angular.module('starter.controllers')

.controller('newuserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPopup,ageFilter,$window) {
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

      $scope.moredetails = function() {
        $scope.showme = true;
        $scope.addmore = true;
        $scope.showless= true;
    };
      $scope.lessdetails = function() {
        $scope.showme = false;
        $scope.addmore = false;
        $scope.showless= false;
    };

       $('input').blur(function () {
       $(this).val(
       $.trim($(this).val())
      );
   });


  /* var minDate = new Date();
   var maxDate=minDate.getDay();
   var maxMonth=minDate.getMonth()+1;
   var maxYear=minDate.getFullYear();
   if(maxDate<10){
       var maxD="0"+maxDate;
   }
   if(maxMonth<10){
       var maxM="0"+maxMonth;
   }
   var maxDay=maxYear+"-"+maxM+"-"+maxD;
   var mDate="2016-05-04";
     $scope.maxDay = maxDay;
     $scope.minimum ="1950-01-01";*/

  $('input').blur(function(){
		var value=$.trim($(this).val());
		$(this).val(value);
	});


  /*  $("#userphone").blur(function () {

      if (this.value.match(/^[0-9]{1,14}$/)) {
          this.value = this.value.replace(/^[0-9]{1,14}$/g, '');

      }
    });
    $("#usermobile").blur(function () {

      if (this.value.match(/^[0-9]{1,14}$/)) {
          this.value = this.value.replace(/^[0-9]{1,14}$/g, '');

      }
    });*/


    $scope.postNewuserDetails=function(){
           $scope.firstName=$("#userfirstname").val();
           $scope.lastName=$("#userlastname").val();
           $scope.email= $("#useremail").val();
           $scope.dob= $("#userdob").val();
           $scope.gender=$("input[name='userInfoGender']:checked").val();
           $scope.height= $("#userheight").val();
           $scope.weight= $("#userWeight").val();
           $scope.homephone= $("#userphone").val();
           $scope.mobile= $("#usermobile").val();
           $scope.homeaddress= $("#address").val();
           var org = document.getElementById("userorganization");
           var couserorgan = org.options[org.selectedIndex].text;
           $scope.coorganization= couserorgan;
           $scope.coorgid= $("#userorgan").val();
           var loc = document.getElementById("userlocation");
           var couserloc = loc.options[loc.selectedIndex].text;
           $scope.colocation= couserloc;
           $scope.colocationid= $("#userlocate").val();


           $scope.sptheightunit=$('#userheightunit').val().split("@");
           $scope.heightunitid=_.first($scope.sptheightunit);
           $scope.heightunit=_.last($scope.sptheightunit);
           $scope.sptweightunit=$('#userweightunit').val().split("@");
           $scope.weightunitid=_.first($scope.sptweightunit);
           $scope.weightunit=_.last($scope.sptweightunit);
           $scope.relation= $("#userrelation").val().split("@").slice(0,1);
           $scope.getRelationId=_.first($scope.relation);
           $scope.hairColor= $("#userhaircolor").val().split("@").slice(0,1);
           $scope.getHairColorId =_.first($scope.hairColor);
           $scope.eyeColor= $("#usereyecolor").val().split("@").slice(0,1);
           $scope.getEyeColorId =_.first($scope.eyeColor);
           $scope.ethnicity= $("#userethnicity").val().split("@").slice(0,1);
           $scope.getEthnicityId =_.first($scope.ethnicity);
        //   $scope.eyeColor= $("#eyeColor").val().split("@").slice(0,1);
          // $scope.ethnicity= $("#ethnicity").val().split("@").slice(0,1);;


       if(typeof $scope.firstName === 'undefined' || $scope.firstName === '' ){
            $scope.ErrorMessage = "Please Enter Your First Name";
            $rootScope.Validation($scope.ErrorMessage);
        } else if(typeof $scope.lastName === 'undefined' || $scope.lastName === '' ){
            $scope.ErrorMessage = "Please Enter Your Last Name";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.email === 'undefined' || $scope.email === '' ){
            $scope.ErrorMessage = "Please Enter Your Email Id";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.dob === 'undefined' || $scope.dob === '' ){
            $scope.ErrorMessage = "Please Enter Your DOB";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.gender === 'undefined' || $scope.gender === '' ){
            $scope.ErrorMessage = "Please Select Your Gender";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.height === 'undefined' || $scope.height === '' ){
            $scope.ErrorMessage = "Please Enter Your Height";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.heightunitid === 'undefined' || $scope.heightunitid === '' ){
            $scope.ErrorMessage = "Please Select Your Height Unit";
            $rootScope.Validation($scope.ErrorMessage);

        }else if(typeof $scope.weight === 'undefined' || $scope.weight === '' ){
            $scope.ErrorMessage = "Please Enter Your Weight";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.weightunitid == 'undefined' || $scope.weightunitid === '' ){
            $scope.ErrorMessage = "Please Select Your Weight Unit";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.homephone === 'undefined' || $scope.homephone === '' ){
            $scope.ErrorMessage = "Please Enter Your Home Phone";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.mobile === 'undefined' || $scope.mobile === '' ){
            $scope.ErrorMessage = "Please Enter Your mobile";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.homeaddress === 'undefined' || $scope.homeaddress === '' ){
            $scope.ErrorMessage = "Please Enter Your homeaddress";
            $rootScope.Validation($scope.ErrorMessage);
        }else if(typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '' ){
            $scope.ErrorMessage = "Please Select Your Relation";
            $rootScope.Validation($scope.ErrorMessage);}
       else{
          // alert("fail");
           $scope.doPostAddCousers();
       }

    }


 $scope.doPostAddCousers = function() {
           var params = {
				accessToken: $scope.accessToken,
			    email:$scope.email,
				familyGroupId: "",
				relationshipId: $scope.getRelationId,
				heightUnitId: $scope.heightunitid,
				weightUnitId: $scope.weightunitid,
				photo: $rootScope.newCoUserImagePath,
				height: $scope.height,
				weight: $scope.weight,
				heightUnit:$scope.heightunit,
				weightUnit:$scope.weightunit,
				address:$scope.homeaddress,
				homePhone:$scope.homephone,
				mobilePhone: $scope.mobile,
				dob: $scope.dob,
				gender: $scope.gender,
				organizationName: $scope.coorganization,
				locationName: $scope.colocation,
				firstName: $scope.firstName,
				lastName: $scope.lastName,
				profileImagePath: $rootScope.newCoUserImagePath,

              success: function (data) {
                      $('#couserform')[0].reset();
                      $('select').prop('selectedIndex', 0);
                      navigator.notification.alert(
                        'A verification email has been sent to the user.',  // message
                        function(){ $state.go('tab.relatedusers'); return;},
                         $rootScope.alertMsgName,            // title
                        'Done'                  // buttonName
                      );
                      return false;

                    //  $state.go('tab.relatedusers');

                    },
               error: function (data) {
                            $rootScope.serverErrorMessageValidation();
               }
            };
           // LoginService.postCousers(params);
            LoginService.postAddCousers(params);
       }



 $scope.cancelcouser=function(){
          $('#couserform')[0].reset();
           $('select').prop('selectedIndex', 0);
          $state.go('tab.relatedusers');
    }


    //Function to open ActionSheet when clicking Camera Button
    //================================================================================================================
    var options;

    $scope.showCameraActions = function(){
     options = {
       'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
       'addCancelButtonWithLabel': 'Cancel',
     };
     window.plugins.actionsheet.show(options, cameraActionCallback);
    }

    var fileMimeType = "image/jpeg";
    var fileUploadUrl = apiCommonURL + "/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
    //var fileUploadUrl = "http://emerald.snap.local/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
    function cameraActionCallback(buttonIndex) {
     if(buttonIndex==3)
      {
        return false;
      }
      else{
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
       var targetPath = imageData;

     //	$rootScope.imagePath = imageData;

       // File name only
       var filename = targetPath.split("/").pop();

    var options = {
           //fileKey: "file",
           //fileName: filename,
           //chunkedMode: false,
           //mimeType: fileMimeType,
           headers: { 'Authorization': $rootScope.accessToken,
                       'X-Api-Key': xApiKey,
                       'X-Developer-Id': xDeveloperId
                     },
         };

       $cordovaFileTransfer.upload(fileUploadUrl, targetPath, options).then(function (result) {
         // Upload Success on server
         //console.log(result);
         var getImageURLFromResponse = angular.fromJson(result.response);
         $rootScope.newCoUserImagePath = getImageURLFromResponse.data[0].uri;
         //$rootScope.$broadcast('loading:hide');
       //  navigator.notification.alert('Uploaded successfully!',null,$rootScope.alertMsgName,'OK');
       //  getImageList();
     }, function (err) {
         // Upload Failure on server
         //navigator.notification.alert('Upload Failed! Please try again!',null,'Inflight','OK');
         //$rootScope.$broadcast('loading:hide');
         navigator.notification.alert('Error in upload!',null,$rootScope.alertMsgName,'OK');
     }, function (progress) {
         // PROGRESS HANDLING GOES HERE
         $rootScope.$broadcast('loading:show');
     });



    }

    // Function to call when the user cancels the operation
    function onCameraCaptureFailure(err) {
     //alert('Failure');
    }
    // End Photo Functionality









})


.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
})
.filter('tel', function () {
    return function (tel) {
        console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
}).filter('userloc', function () {
    return function (userloc, userorg) {
        var userfiltered = [];
        if (userorg === null) {
            return filtered;
        }
        if(userloc!=undefined){
            angular.forEach(userloc[0], function (users2) {
            if (s2.organizationId == userorg) {
                userfiltered.push(users2);
            }
        });
        }

        return userfiltered;
    };
});
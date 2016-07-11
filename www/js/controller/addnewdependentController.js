angular.module('starter.controllers')
    .controller('addnewdependentController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $timeout, $rootScope, $state, LoginService, $stateParams, $location, $cordovaFileTransfer, $ionicLoading,$ionicScrollDelegate, $log,$window) {

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

        $scope.postDependentDetails = function() {
            $scope.firstName = $("#firstname").val();
            $scope.lastName = $("#lastname").val();
            $scope.email = $("#email").val();
            $scope.dob = $("#dob").val();
            $scope.relation = $("#relation").val();
          //  $scope.gender = $("input[name='depgender']:checked").val();
            $scope.gender = $("#depgender").val();
            $scope.height = $("#height").val();
            $scope.height2 = $("#height2").val();
            $scope.weight = $("#weight").val();
            $scope.homephone = $("#homephone").val();
            $scope.mobile = $("#mobile").val();
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
            $scope.heightunit = $("#heightunit").val().split("@").slice(0, 1);
            $scope.getHeightunit = _.first($scope.heightunit);
            $scope.weightunit = $("#weightunit").val().split("@").slice(0, 1);
            $scope.getWeightunit = _.first($scope.weightunit);
            $scope.bloodtype = $("#bloodtype").val().split("@").slice(0, 1);
            $scope.getBloodtypeid = _.first($scope.bloodtype);
            var dateofb=new Date( $scope.dob)
            var birthyear =dateofb.getFullYear();
            var birthmonth = dateofb.getMonth();
            var birthday = dateofb.getDate();
            var age = nowyear - birthyear;
            var age_month = nowmonth - birthmonth;
            var age_day = nowday - birthday;
            if(age_month < 0 || (age_month == 0 && age_day <0)) {
            age = parseInt(age) -1;
           }
    if ((age >=12  && age_month >= 0)) {
      if ($scope.email === 'undefined' || $scope.email === '') {
          $scope.ErrorMessage = "Please Enter Your Email Id";
          $rootScope.Validation($scope.ErrorMessage);
       }
       else if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
           $scope.ErrorMessage = "Please Enter Your First Name";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
           $scope.ErrorMessage = "Please Enter Your Last Name";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
             $scope.ErrorMessage = "Please Enter Your DOB";
             $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
            $scope.ErrorMessage = "Please Select Your Relation";
            $rootScope.Validation($scope.ErrorMessage);
        }
       else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
           $scope.ErrorMessage = "Please Select Your Gender";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.height === 'undefined' || $scope.height === '') {
           $scope.ErrorMessage = "Please Enter Your Height";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.height2 === 'undefined' || $scope.height2 === '') {
           $scope.ErrorMessage = "Please Enter Your Height";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
           $scope.ErrorMessage = "Please Select Your Height Unit";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
           $scope.ErrorMessage = "Please Enter Your Weight";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.getWeightunit == 'undefined' || $scope.getWeightunit === '') {
           $scope.ErrorMessage = "Please Select Your Weight Unit";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
           $scope.ErrorMessage = "Please Choose Your Country";
           $rootScope.Validation($scope.ErrorMessage);
       } else if (typeof $scope.dependentTimezone === 'undefined' || $scope.dependentTimezone === '') {
           $scope.ErrorMessage = "Please Choose Your Time Zone";
           $rootScope.Validation($scope.ErrorMessage);
       }else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
             $scope.ErrorMessage = "Please Enter Your Mobile Number";
             $rootScope.Validation($scope.ErrorMessage);
           }
       else if (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '') {
           $scope.ErrorMessage = "Please Select Your bloodtype";
           $rootScope.Validation($scope.ErrorMessage);
       }
       else if (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '') {
                $scope.ErrorMessage = "Please Select Your hairColor";
                $rootScope.Validation($scope.ErrorMessage);
      } else if (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '') {
                $scope.ErrorMessage = "Please Select Your eyeColor";
                $rootScope.Validation($scope.ErrorMessage);
      } else if (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '') {
                $scope.ErrorMessage = "Please Select Your ethnicity";
                $rootScope.Validation($scope.ErrorMessage);
      }
       else {
       $scope.doPostNewDependentuser();
      }
   }else{
     if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
         $scope.ErrorMessage = "Please Enter Your First Name";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.lastName === 'undefined' || $scope.lastName === '') {
         $scope.ErrorMessage = "Please Enter Your Last Name";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.dob === 'undefined' || $scope.dob === '') {
           $scope.ErrorMessage = "Please Enter Your DOB";
           $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.getRelationId === 'undefined' || $scope.getRelationId === '') {
         $scope.ErrorMessage = "Please Select Your Relation";
         $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
         $scope.ErrorMessage = "Please Select Your Gender";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.height === 'undefined' || $scope.height === '') {
         $scope.ErrorMessage = "Please Enter Your Height";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.getHeightunit === 'undefined' || $scope.getHeightunit === '') {
         $scope.ErrorMessage = "Please Select Your Height Unit";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.weight === 'undefined' || $scope.weight === '') {
         $scope.ErrorMessage = "Please Enter Your Weight";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.getWeightunit == 'undefined' || $scope.getWeightunit === '') {
         $scope.ErrorMessage = "Please Select Your Weight Unit";
         $rootScope.Validation($scope.ErrorMessage);
     }else if (typeof $scope.dependentCountry === 'undefined' || $scope.dependentCountry === '') {
         $scope.ErrorMessage = "Please Choose Your Country";
         $rootScope.Validation($scope.ErrorMessage);
     } else if (typeof $scope.dependentTimezone === 'undefined' || $scope.dependentTimezone === '') {
         $scope.ErrorMessage = "Please Choose Your Time Zone";
         $rootScope.Validation($scope.ErrorMessage);
     }else if (typeof $scope.mobile === 'undefined' || $scope.mobile === '') {
           $scope.ErrorMessage = "Please Enter Your Mobile Number";
           $rootScope.Validation($scope.ErrorMessage);
         }

     else if (typeof $scope.getBloodtypeid === 'undefined' || $scope.getBloodtypeid === '') {
         $scope.ErrorMessage = "Please Select Your bloodtype";
         $rootScope.Validation($scope.ErrorMessage);
     }else if (typeof $scope.getHairColorId === 'undefined' || $scope.getHairColorId === '') {
                $scope.ErrorMessage = "Please Select Your hairColor";
                $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.getEyeColorId === 'undefined' || $scope.getEyeColorId === '') {
                $scope.ErrorMessage = "Please Select Your eyeColor";
                $rootScope.Validation($scope.ErrorMessage);
    } else if (typeof $scope.getEthnicityId === 'undefined' || $scope.getEthnicityId === '') {
                $scope.ErrorMessage = "Please Select Your ethnicity";
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
                    homePhone: $scope.dependentCountry + $scope.getOnlyNumbers($scope.homephone),
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



                    /*  $('#dependentuserform')[0].reset();
                      $('select').prop('selectedIndex', 0);
                      $state.go('tab.relatedusers');
                      console.log(data);*/
                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.postNewDependentuser(params);

        }


        $scope.updateDependentRelation = function() {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: $rootScope.deppatientId,
                RelationCodeId: $rootScope.getRelationId,
                IsAuthorized: "Y",
                success: function(data) {
                    $('#dependentuserform')[0].reset();
                    $('select').prop('selectedIndex', 0);
                    if($rootScope.newDependentImagePath !== '' && typeof $rootScope.newDependentImagePath !=='undefined') {
                        $scope.uploadPhotoForDependant();
                    }else{
                        $state.go('tab.relatedusers');
                    }

                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.updateDependentsAuthorize(params);
        }

        $scope.canceldependent = function() {
            $('#dependentuserform')[0].reset();
            $('select').prop('selectedIndex', 0);
            $state.go('tab.addnewuser');
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

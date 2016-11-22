angular.module('starter.controllers')

.controller('newuserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicPopup, ageFilter, $window, $cordovaFileTransfer) {
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
    };
    $scope.newUSer = {};
    $scope.addmore = false;
    $scope.newUSer.address = $rootScope.primaryPatientDetails[0].address;
    $scope.moredetails = function() {
        $scope.showme = true;
        $scope.addmore = true;
        $scope.showless = true;
    };
    $scope.lessdetails = function() {
        $scope.showme = false;
        $scope.addmore = false;
        $scope.showless = false;
    };

    $('input').blur(function() {
        $(this).val(
            $.trim($(this).val())
        );
    });
    $('input').blur(function() {
        var value = $.trim($(this).val());
        $(this).val(value);
    });
      $scope.getOnlyNumbers = function(text){
          var newStr = text.replace(/[^0-9.]/g, "");
          return newStr;
      }
    $scope.postNewuserDetails = function() {
        $scope.firstName = $("#userfirstname").val();
        $scope.email = $("#useremail").val();
        $scope.ValidateEmail = function(email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };

        if (typeof $scope.firstName === 'undefined' || $scope.firstName === '') {
            $scope.ErrorMessage = "Please enter Name";
            $rootScope.Validation($scope.ErrorMessage);
      } else if (typeof $scope.email === 'undefined' || $scope.email === '') {
            $scope.ErrorMessage = "Please enter Email Id";
            $rootScope.Validation($scope.ErrorMessage);

        } else if(!$scope.ValidateEmail($("#useremail").val())) {
            $scope.ErrorMessage = "Please enter a valid email address";
            $rootScope.Validation($scope.ErrorMessage);
        }
         else {
          $scope.doPostAddCousers();
        }
    }


    $scope.doPostAddCousers = function() {

           var params = {
               accessToken: $scope.accessToken,
               email: $scope.email,
               firstName: $scope.firstName,
            success: function() {
                $('#couserform')[0].reset();
                $('select').prop('selectedIndex', 0);
                navigator.notification.alert(
                    'A verification email has been sent to the user.', // message
                    function() {
                        $state.go('tab.relatedusers');
                        return;
                    },
                    $rootScope.alertMsgName, // title
                    'OK' // buttonName
                );
                return false;
            },
            error: function(data,status) {
              if(status===0 ){
                   $scope.ErrorMessage = "Internet connection not available, Try again later!";
                   $rootScope.Validation($scope.ErrorMessage);

              }else{
                var Emailerror=data.message
                if(Emailerror==="Email ID Already Registered"){
                    $scope.ErrorMessage = "Patient already exists with email " + $scope.email;
                    $rootScope.Validation($scope.ErrorMessage);
                }else{
                    $rootScope.serverErrorMessageValidation();
                }
              }
            }
        };
        LoginService.postAddCousers(params);
    }

    $scope.cancelcouser = function() {
      $ionicScrollDelegate.$getByHandle('isScroll').scrollTo();
        $('#couserform')[0].reset();
        $('select').prop('selectedIndex', 0);
        history.back();
        if (!$scope.$$phase)
        $scope.$apply();
    }
    //Function to open ActionSheet when clicking Camera Button
    //================================================================================================================

    $scope.showUploadImageAlert = function() {
      navigator.notification.alert(
          'Photo can be uploaded only after activating co-user account.', // message
          function() {
            return;
          },
          $rootScope.alertMsgName, // title
          'Ok' // buttonName
      );
    }

    var options;

    $scope.showCameraActions = function() {
        options = {
            'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
            'addCancelButtonWithLabel': 'Cancel',
        };
        window.plugins.actionsheet.show(options, cameraActionCallback);
    }

    var fileMimeType = "image/jpeg";
    var fileUploadUrl = apiCommonURL + "/api/v2.1/patients/profile-images?patientId=" + $rootScope.patientId;
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

        var filename = targetPath.split("/").pop();

        var options = {

            headers: {
                'Authorization': 'Bearer' + $rootScope.accessToken,
                'X-Api-Key': xApiKey,
                'X-Developer-Id': xDeveloperId
            },
        };

        $cordovaFileTransfer.upload(fileUploadUrl, targetPath, options).then(function(result) {

            var getImageURLFromResponse = angular.fromJson(result.response);
            $rootScope.newCoUserImagePath = getImageURLFromResponse.data[0].uri;

        }, function(err) {

            navigator.notification.alert('Error in upload!', null, $rootScope.alertMsgName, 'OK');
        }, function(progress) {
            // PROGRESS HANDLING GOES HERE
            $rootScope.$broadcast('loading:show');
        });
    }

    // Function to call when the user cancels the operation
    function onCameraCaptureFailure(err) {
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
                    return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
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
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
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
    .filter('tel', function() {
        return function(tel) {
            if (!tel) {
                return '';
            }
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

            if (number) {
                if (number.length > 3) {
                    number = number.slice(0, 3) + '-' + number.slice(3, 7);
                } else {
                    number = number;
                }

                return ("(" + city + ") " + number).trim();
            } else {
                return "(" + city;
            }

        };
    }).filter('userloc', function() {
        return function(userloc, userorg) {
            var userfiltered = [];
            if (userorg === null) {
                return filtered;
            }
            if (userloc !== undefined) {
                angular.forEach(userloc[0], function(users2) {
                    if (s2.organizationId === userorg) {
                        userfiltered.push(users2);
                    }
                });
            }
            return userfiltered;
        };
    });

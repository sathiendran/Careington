 angular.module('starter.controllers')
    .controller('relateduserController', function($scope, $ionicPlatform, $ionicModal, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicPopup, ageFilter, $window, $filter, $timeout) {
      $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        $ionicPlatform.registerBackButtonAction(function() {
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
// $("#localize-widget").show();


//Language changer
var localizeCurrent = $('#localize-current').text();
console.log("lang "+localizeCurrent);
  if(localizeCurrent == "Español") {
  $rootScope.alertTimedout = "Su sesión ha expirado.";
  $rootScope.alertokay = "De acuerdo";
  $rootScope.alertupload = "No se puede cargar la foto. Por favor, inténtelo de nuevo más tarde.";
  $rootScope.alertokay = "De acuerdo";
  $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
  $rootScope.alertconended = "Su consulta ya ha finalizado.";
  $rootScope.alertDone = "Hecho";
  $rootScope.alertconcancel = "Su consulta se cancela.";
  $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
  $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
  $rootScope.YESMessageProviderSearch='Sí';
  $rootScope.NaviConfirmation = 'Confirmación:';
  $rootScope.alertTimedout = "Su sesión ha expirado.";
  $rootScope.alertokay = "De acuerdo";
  $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
  $rootScope.alertconsultationfailed = "Error al guardar consulta!";
  $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
  $rootScope.alertokay = "De acuerdo";
  $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
  $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
  $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
  $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
  $rootScope.consultCancelMsg = 'Su consulta se cancela.';
  $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
  $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
  $rootScope.Buttonmsg = "Listo";
  $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
  $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
  $rootScope.NaviConfirmation = 'Confirmación:';
  $rootScope.YESMessageProviderSearch='Sí';
  }

else  {
$rootScope.alertTimedout = "Your session timed out."
$rootScope.alertokay = "Ok";
$rootScope.alertupload = "Unable to upload the photo. Please try again later.";
$rootScope.alertokay = "Ok";
$rootScope.alertconstarted = "Your consultation is already started on other device.";
$rootScope.alertconended = "Your consultation is already ended.";
$rootScope.alertDone = "Done";
$rootScope.alertconcancel = "Your consultation is cancelled.";
$rootScope.alertconprogress = "Your consultation is in progress on other device.";
$rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
 $rootScope.YESMessageProviderSearch='Yes';
 $rootScope.NaviConfirmation = 'Confirmation:';
 $rootScope.alertTimedout = "Your session timed out.";
 $rootScope.alertokay = "Ok";
 $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
 $rootScope.alertconsultationfailed = "Failed to save consultation!";
 $rootScope.alertMsg = "A verification email has been sent to the user.";
 $rootScope.alertokay = "Ok";
 $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
 $rootScope.alertMsgvideo = "Consultation ended successfully!";
 $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
 $rootScope.consultEndMeg = 'Your consultation is already ended.';
 $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
 $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
 $rootScope.sessAlertDone = 'Done';$rootScope.alertMsgConference = "Consultation ended successfully!";
 $rootScope.Buttonmsg = "Done";
 $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
 $rootScope.consultAlredComplMsg = 'Consultation already completed!';
 $rootScope. NaviConfirmation = 'Confirmation:';
 $rootScope. YESMessageProviderSearch='Yes';
  }


 $('#localize-langs').click(function() {
   var isLang = $('#localize-langs .activated').text();
     console.log("lang "+isLang);
     if(isLang == "Español") {
       $rootScope.alertTimedout = "Su sesión ha expirado.";
       $rootScope.alertokay = "De acuerdo";
       $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
       $rootScope.alertokay = "Ok";
       $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
       $rootScope.alertconended = "Su consulta ya ha finalizado.";
       $rootScope.alertDone = "Hecho";
       $rootScope.alertconcancel = "Su consulta se cancela.";
       $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
       $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
       $rootScope.YESMessageProviderSearch='Sí';
       $rootScope.NaviConfirmation = 'Confirmación:';
       $rootScope.alertTimedout = "Su sesión ha expirado.";
       $rootScope.alertokay = "De acuerdo";
      $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
      $rootScope.alertconsultationfailed = "Error al guardar consulta!";
      $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
      $rootScope.alertokay = "De acuerdo";
      $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
      $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
      $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
      $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
      $rootScope.consultCancelMsg = 'Su consulta se cancela.';
      $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
      $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
      $rootScope.Buttonmsg = "Listo";
      $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
      $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
      $rootScope.NaviConfirmation = 'Confirmación:';
      $rootScope.YESMessageProviderSearch='Sí';
     }
      else{
          $rootScope.alertTimedout = "Your session timed out."
          $rootScope.alertokay = "Ok";
          $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
          $rootScope.alertokay = "Ok";
          $rootScope.alertconstarted = "Your consultation is already started on other device.";
          $rootScope.alertconended = "Your consultation is already ended.";
          $rootScope.alertDone = "Done";
          $rootScope.alertconcancel = "Your consultation is cancelled.";
          $rootScope.alertconprogress = "Your consultation is in progress on other device.";
          $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
           $rootScope.YESMessageProviderSearch='Yes';
           $rootScope.NaviConfirmation = 'Confirmation:';
           $rootScope.alertTimedout = "Your session timed out.";
           $rootScope.alertokay = "Ok";
           $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
           $rootScope.alertconsultationfailed = "Failed to save consultation!";
           $rootScope.alertMsg = "A verification email has been sent to the user.";
           $rootScope.alertokay = "Ok";
           $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
           $rootScope.alertMsgvideo = "Consultation ended successfully!";
           $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
           $rootScope.consultEndMeg = 'Your consultation is already ended.';
           $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
           $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
           $rootScope.sessAlertDone = 'Done';
           $rootScope.alertMsgConference = "Consultation ended successfully!";
           $rootScope.Buttonmsg = "Done";
           $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
           $rootScope.consultAlredComplMsg = 'Consultation already completed!';
           $rootScope. NaviConfirmation = 'Confirmation:';
           $rootScope. YESMessageProviderSearch='Yes';
      }
    });

//end

angular.element(document).ready(function () {

    $("#localize-widget").hide();
});
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
        $rootScope.drawImage = function(imagePath, firstName, lastName) {
            $('.patProfileImage').css({
                'background-color': $rootScope.brandColor
            });
            var Name = getInitialFromName(firstName, lastName);
            if (Name === 'WW') {
                Name = 'W';
            }
            if (!angular.isUndefined(imagePath) && imagePath !== '') {
                if (imagePath.indexOf("api") >= 0) {
                    var image = imagePath;
                    return "<img ng-src=" + image + " src=" + image + " class='UserHmelistImgView'>";
                } else {
                    return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
                }
            } else {
                return $sce.trustAsHtml("<div class='patProfileImage'><span>" + Name + "</sapn></div>");
            }
        };

        $rootScope.couserslists = true;
        $rootScope.dependentuserslist = true;
        $scope.cousericon = true;
        $scope.dependenticon = false;
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
            $scope.userdone = false;
            $scope.useradd = false;
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
        $scope.data = {};

        $scope.$watch('data.searchProvider', function(searchKey) {
            $rootScope.providerSearchKey = searchKey;
            if (typeof $rootScope.providerSearchKey === 'undefined') {
                $scope.data.searchProvider = $rootScope.backProviderSearchKey;
            }
            if ($rootScope.providerSearchKey !== '' && typeof $rootScope.providerSearchKey !== 'undefined') {
                $rootScope.iconDisplay = 'none';
            } else {
                $rootScope.iconDisplay = 'Block';
            }
        });
        $rootScope.changeptient = function(){
          $rootScope.doGetPatientProfiles();
            $state.go('tab.userhome');
        }
        $rootScope.doUpdateDependentsAuthorize = function(relateDependentId, relateDependentRelationCode, relateDependentAuthorize) {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: relateDependentId,
                RelationCodeId: relateDependentRelationCode,
                IsAuthorized: relateDependentAuthorize,
                success: function() {
                    $scope.authorizedview = false;
                    if(relateDependentAuthorize = 'Y' && $rootScope.patientId === relateDependentId) {
                      $rootScope.P_isAuthorized = true;
                    } else if(relateDependentAuthorize = 'N' && $rootScope.patientId === relateDependentId) {
                        $rootScope.P_isAuthorized = false;
                    }
                    $rootScope.doGetAccountDependentDetails();
                },
                error: function(data, status) {
                    if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to change authorization status of this dependent";
                        $scope.$root.$broadcast("callValidation", {
                            errorMsg: $scope.ErrorMessage
                        });
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    }else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        if (data === null || status === 0) {

                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);

                        } else {
                            $rootScope.serverErrorMessageValidation();
                        }
                    }
                }
            };
            LoginService.updateDependentsAuthorize(params);
        }

        $scope.showPopup = function(dependentDetails, relateDependentAuthorize) {
            $rootScope.authorised = relateDependentAuthorize;
            if (!angular.isUndefined(dependentDetails.birthdate) && dependentDetails.birthdate !== '') {
               // $scope.dob = " . " + dependentDetails.birthdate;
                $scope.dobAge = dependentDetails.birthdate;
            } else {
                $scope.dob = '';
                 $scope.dobAge = '';
            }
            if (!angular.isUndefined(dependentDetails.relationship) && dependentDetails.relationship !== '') {
                $scope.relationship = " . " + dependentDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            var getDrawImage = $rootScope.drawImage(dependentDetails.profileImagePath, dependentDetails.patientFirstName, dependentDetails.patientLastName);
            if ($rootScope.authorised === "F") {
                //ageFilter.getAge();
                $scope.userAge = ageFilter.getDateFilter($scope.dobAge);

                var myPopup = $ionicPopup.show({

                    title: "<div class='coUserLinkImage'>" + getDrawImage + "</div><div class='coUserLinkName'><span class='fname'><b>" + dependentDetails.patientFirstName + "</b></span> <span class='sname'>" + dependentDetails.patientLastName + "</span></div> <div class='fontcolor'>" + "<span class='localizejs'>" + dependentDetails.gender +  "</span>"+ " . " + $scope.userAge + "<span class='localizejs'>" + $scope.relationship + "</span></div> ",
                    templateUrl: 'templates/popupTemplate.html',
                    scope: $scope,
                    buttons: [{
                        text: '<b class="fonttype localizejs">Cancel</b>',
                        onTap: function(e) {
                            return false;
                        }
                    }, {
                        text: '<b class="fonttype localizejs">Confirm</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            return true;
                        }

                    }, ]
                });
            } else {
                $scope.userAge = ageFilter.getDateFilter($scope.dobAge);
                var myPopup = $ionicPopup.show({

                    title: "<div class='coUserLinkImage'>" + getDrawImage + "</div><div class='coUserLinkName'><span class='fname'><b>" + dependentDetails.patientFirstName + "</b></span> <span class='sname'>" + dependentDetails.patientLastName + "</span></div> <div class='fontcolor'>" + "<span class='localizejs'>" + dependentDetails.gender + "</span>"  + " . " + $scope.userAge + "<span class='localizejs'>" + $scope.relationship + "</span></div> ",
                    templateUrl: 'templates/unauthorizedpopup.html',
                    scope: $scope,
                    buttons: [{
                        text: '<b class="fonttype localizejs">Cancel</b>',
                        onTap: function(e) {
                            return false;
                        }
                    }, {
                        text: '<b class="fonttype localizejs">Confirm</b>',
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

            $scope.closepopup = function() {
                myPopup.close();

            }
        };

        $scope.userslist = function() {
            $scope.couserslists = true;
            $scope.dependentuserslist = true;
            $scope.cousericon = true;
            $scope.dependenticon = false;
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
            var params = {
                accessToken: $rootScope.accessToken,
                authorizedOnly: true,
                success: function(data) {
                    $rootScope.listOfCoUserDetails = [];
                    angular.forEach(data.data, function(index) {
                        if (index.patientId !== $rootScope.primaryPatientId && index.isDependent != true) {
                            var getCoUserRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCodeId
                            })
                            if (getCoUserRelationShip.length !== 0) {
                                var relationShip = getCoUserRelationShip[0].text;
                            } else {
                                var relationShip = '';
                            }
                            //var dob = ageFilter.getDateFilter(index.dob);

                            var dob = ageFilter.getDateFilter(index.dob);
                            if (index.gender == 'M') {
                                var gender = "Male";
                            } else if (index.gender == 'F') {
                                var gender = "Female";
                            }
                            $scope.coUserImagePath = index.imagePath;
                            $rootScope.listOfCoUserDetails.push({
                                'address': index.address,
                                'bloodType': index.bloodType,
                                'description': index.description,
                                'dob': index.dob,
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
                error: function(data, status) {
                    if (data === 'null') {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfCoUsers(params);

        };

        $scope.dependentslist = function() {
            $scope.couserslists = false;
            $scope.dependentuserslist = false;
            $scope.cousericon = false;
            $scope.dependenticon = true;
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
                    angular.forEach(data.data, function(index) {
                        var getRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                            codeId: index.relationCode
                        })
                        if (getRelationShip.length !== 0) {
                            var relationShip = getRelationShip[0].text;
                        } else {
                            var relationShip = '';
                        }
                        if (index.gender === 'M') {
                            var gender = "Male";
                        } else if (index.gender === 'F') {
                            var gender = "Female";
                        }

                        $scope.iDependentPatientPhoto = index.profileImagePath;
                        $rootScope.spdate = index.birthdate;
                        $rootScope.patage = new Date($rootScope.spdate);
                        $rootScope.listOfAccountDependents.push({
                            'addresses': index.addresses,
                            'profileImagePath': $scope.iDependentPatientPhoto,
                            'modifiedBirthdate': ageFilter.getDateFilter(index.birthdate),
                            'birthdate': index.birthdate,
                            'PatientAge': $rootScope.patage,
                            'bloodType': index.bloodType,
                            'ethnicity': index.ethnicity,
                            'eyeColor': index.eyeColor,
                            'gender': gender,
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
                error: function(data, status) {
                    if (data === 'null') {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getAccountDependentDetails(params);
        }
        $rootScope.doGetOrgLoclist = function() {
          var params = {
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.orgloclist = [];
                    angular.forEach(data.data, function(index) {
                        $rootScope.orgloclist.push({
                            'locations': angular.fromJson(index.locations),
                            'name': index.name,
                            'id': index.id
                        });
                    });
                    $rootScope.listOfOrganization = $rootScope.orgloclist;
                    var listOfLocation = $rootScope.orgloclist;
                    $rootScope.locationdetails = _.pluck(listOfLocation, 'locations');
                },
                error: function(data, status) {
                  if(status === 503) {
                   $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                 } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };
            LoginService.getListOfLocationOrganization(params);
        }
        $rootScope.adddependent = function() {
            $rootScope.doGetOrgLoclist();
            $rootScope.newDependentImagePath = '';
            $rootScope.addPatientidupdateList = '';
            $rootScope.listOfAddPatientIdentifiers = '';
            $('select').prop('selectedIndex', 0);
            $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
            $state.go('tab.addnewdependent');
        }
        $rootScope.addcouser = function() {
            $rootScope.newCoUserImagePath = '';
            $rootScope.doGetOrgLoclist();
            $('select').prop('selectedIndex', 0);
           $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
            $state.go('tab.addUser');
        }
        var currentLocation = window.location;
        var loc = currentLocation.href;
        var newloc = loc.split("#");
        var locat = newloc[1];
        var sploc = locat.split("/");
        var cutlocations = sploc[1] + "." + sploc[2];
        $scope.gpToAppointments = function(getDependentDetails) {
            $rootScope.GoToPatientDetails(cutlocations, getDependentDetails.profileImagePath, getDependentDetails.patientFirstName, getDependentDetails.patientLastName, getDependentDetails.birthdate, getDependentDetails.guardianName, getDependentDetails.patientId, getDependentDetails.isAuthorized, 'tab.appointmentpatientdetails');
          }
        $scope.goToConsultations = function(getDependentDetails) {
            $rootScope.GoToPatientDetails(cutlocations, getDependentDetails.profileImagePath, getDependentDetails.patientFirstName, getDependentDetails.patientLastName, getDependentDetails.birthdate, getDependentDetails.guardianName, getDependentDetails.patientId, getDependentDetails.isAuthorized, 'tab.consultations');
        }

        $scope.doGetonDemandAvailabilityforDependent = function(getDependentDetails, curntDepPatientId) {
          var params = {
            accessToken: $rootScope.accessToken,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {

              angular.forEach(data.data[0].familyMembers, function(index) {
                  if (index.patientId == curntDepPatientId) {
                      $scope.depProviderAvailability = index.providerAvailable;
                  }
              });
                $rootScope.onDemandAvailability = data.data[0].onDemandAvailabilityBlockCount;
                if ($rootScope.onDemandAvailability > 0 && $rootScope.P_isAuthorized && $scope.depProviderAvailability == true) {
                    $rootScope.cutlocations = 'tab.relatedusers';
                    $rootScope.GoToPatientDetails($rootScope.cutlocations, getDependentDetails.profileImagePath, getDependentDetails.patientFirstName, getDependentDetails.patientLastName, getDependentDetails.birthdate, getDependentDetails.guardianName, getDependentDetails.patientId, getDependentDetails.isAuthorized, 'tab.patientConcerns');
                } else {
                    $scope.ErrorMessage = "Provider or On demand unavailable. Please try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                }
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                } else if (status === 401) {
                    $scope.ErrorMessage = "You are not authorized to view this account";
                    $rootScope.Validation($scope.ErrorMessage);

                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getonDemandAvailability(params);
    }


        $scope.seeaPatientConcerns = function(getDependentDetails, curntDepPatientId) {
            $rootScope.PatientPrimaryConcernItem;
            $rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
            $rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
            $rootScope.PatientPrimaryConcern = "";
            $rootScope.primaryConcernList = "";
            $rootScope.secondaryConcernList = "";
            $scope.PatientPrimaryConcernItem = "";
            $rootScope.PatientSecondaryConcern = "";
            $rootScope.PatientChronicCondition = "";
            $rootScope.patinentCurrentMedication = "";
            $rootScope.patinentMedicationAllergies = "";
            $rootScope.patientSurgeriess = "";
            $rootScope.MedicationCount == 'undefined';
            $rootScope.checkedChronic = 0;
            $rootScope.ChronicCount = "";
            $rootScope.AllegiesCount = "";
            $rootScope.checkedAllergies = 0;
            $rootScope.MedicationCount = "";
            $rootScope.checkedMedication = 0;
            $rootScope.IsValue = "";
            $rootScope.IsToPriorCount = "";
            $rootScope.ChronicCountValidCount = "";
            $rootScope.PriorSurgeryValidCount = "";
            $rootScope.AllegiesCountValid = "";
            $rootScope.MedicationCountValid = "";
            $scope.doGetonDemandAvailabilityforDependent(getDependentDetails, curntDepPatientId);
        }
        $rootScope.patientprofile = function(getDependentDetails) {
          $rootScope.currentPatientDetails[0].account.patientId = getDependentDetails.patientId;

            $rootScope.GoToPatientDetails(cutlocations, getDependentDetails.profileImagePath, getDependentDetails.patientFirstName, getDependentDetails.patientLastName, getDependentDetails.birthdate, getDependentDetails.guardianName, getDependentDetails.patientId, getDependentDetails.isAuthorized, 'sideMenuClick');
            var primarypatid = $rootScope.primaryPatientId;
            var patid = getDependentDetails.patientId
            $rootScope.passededconsultants();
            $rootScope.restage = getAge(getDependentDetails.PatientAge);
            if ($rootScope.restage >= 12) {
                $rootScope.viewemailDisplay = 'flex';
                $rootScope.viewtimezoneDisplay = 'flex';
            } else {
                //  $rootScope.viewemailDisplay = 'none';
                $rootScope.viewtimezoneDisplay = 'none';
            }
            if (primarypatid === patid) {
                $rootScope.viewmyhealthDisplay = 'block';
                $rootScope.viewhealthDisplay = 'none';
            } else {
                $rootScope.viewmyhealthDisplay = 'none';
                $rootScope.viewhealthDisplay = 'block';
            }
            $state.go('tab.healthinfo');
        }

        /* Relationship Search */
        $scope.alphabet = iterateAlphabet();
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

        $scope.selectrelation = function(selPatient) {
            $scope.data.searchProvider = '';
            $rootScope.relationUpdatePatientId = selPatient.patientId;
            $rootScope.relationUpdateAuthStatus = selPatient.isAuthorized;
            $rootScope.relationUpdateRelationId = selPatient.relationship;
            $scope.clearSelectionAndRebindSelectionList($rootScope.relationUpdateRelationId, $rootScope.listOfRelationship[0].codes);
            $scope.usertab = true;
            $ionicModal.fromTemplateUrl('templates/tab-relationSearch.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
                $timeout(function() {
                    $scope.modal.remove()
                        .then(function() {
                            $scope.modal = null;
                        });
                }, 600000);
            });
        }
        $scope.usersearchdone = function() {
            $scope.modal.hide();
        }
        $scope.removemodal = function() {
            $scope.usersearchdone();
        };
        $scope.OnSelectRelation = function(newRelatioCodeId) {
            if (newRelatioCodeId.checked === true) {
                $rootScope.relationShipChecked++;
            } else {
                $rootScope.relationShipChecked--;
                newRelatioCodeId.checked === false;
            }
            if ($rootScope.relationUpdateAuthStatus) {
                relationUpdateAuthStatusVal = 'Y';
            } else {
                relationUpdateAuthStatusVal = 'N';
            }
            $rootScope.doUpdateDependentsAuthorize($rootScope.relationUpdatePatientId, newRelatioCodeId, relationUpdateAuthStatusVal);
            $scope.usersearchdone();
        }

        $rootScope.coUserArchieve = function(coUserDetails) {
            if (!angular.isUndefined(coUserDetails.dob) && coUserDetails.dob !== '') {
                $scope.dob = " . " + coUserDetails.dob;
                 $scope.dobAge = coUserDetails.dob;

            } else {
                $scope.dob = '';
                $scope.dobAge = '';
            }
            if (!angular.isUndefined(coUserDetails.relationship) && coUserDetails.relationship !== '') {
                $scope.relationship = " . " + coUserDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            $scope.userAge = ageFilter.getDateFilter($scope.dobAge);
            var confirmPopup = $ionicPopup.confirm({
                title: "<a class='item-avatar popupaligned'>  <img src='" + coUserDetails.imagePath + "'><span><span class='popupname popupalign'><b>" + coUserDetails.name + "</b></span> <span class='sname'>" + coUserDetails.lastname + "</span></span></a> ",
                subTitle: "<p class=' popupfont'>" + coUserDetails.gender + " . " + $scope.userAge + $scope.relationship + "</p>",
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
            $scope.closepopup = function() {
                myPopup.close();

            }
        }

        $rootScope.coUserUnlink = function(coUserDetails) {
            if (!angular.isUndefined(coUserDetails.dob) && coUserDetails.dob !== '') {
                $scope.dob = " . " + coUserDetails.dob;
                $scope.dobAge = coUserDetails.dob;
            } else {
                $scope.dob = '';
                $scope.dobAge = '';
            }
            if (!angular.isUndefined(coUserDetails.relationship) && coUserDetails.relationship !== '') {
                $scope.relationship = " . " + coUserDetails.relationship;
            } else {
                $scope.relationship = '';
            }
            var getDrawImage = $rootScope.drawImage(coUserDetails.imagePath, coUserDetails.name, coUserDetails.lastname);
            $scope.userAge = ageFilter.getDateFilter($scope.dobAge);
            var confirmPopup = $ionicPopup.confirm({
                title: "<div class='coUserLinkImage'>" + getDrawImage + "</div><div class='coUserLinkName'><span class='fname'><b>" + coUserDetails.name + "</b></span> <span class='sname'>" + coUserDetails.lastname + "</span></div> <div class='fontcolor'>" + "<span class='localizejs'>" + coUserDetails.gender +"</span>" + " . " + $scope.userAge + "<span class='localizejs'>" + $scope.relationship + "</span></div> ",
                //subTitle: "<div class='fontcolor'>" + coUserDetails.gender + $scope.dob + $scope.relationship + "</div>",
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

        $scope.clearSelectionAndRebindSelectionList = function(selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function(item) {
                item.checked = false;
            });
            if (!angular.isUndefined(selectedListItem)) {
                angular.forEach(mainListItem, function(value) {
                    if (value.text === selectedListItem) {
                        value.checked = true;
                        $scope.checkedrelation = value.text;
                    }
                })
            }
        };

        $scope.goTOSchedule = function() {
          $("#localize-widget").show();
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }

    });

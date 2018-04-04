angular.module('starter.controllers')
    .controller('healthinfoController', function ($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {
        $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        $rootScope.drawSVGCIcon = function (iconName) {
            return "<svg class='icon-" + iconName + "'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
        };
        $scope.init = function () {

            $("#localize-widget").hide();

        };

        //Language changer
        var localizeCurrent = $('#localize-current').text();
        console.log("lang " + localizeCurrent);
        if (localizeCurrent == "Español") {
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
            $rootScope.YESMessageProviderSearch = 'Sí';
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
            $rootScope.YESMessageProviderSearch = 'Sí';
        }

        else {
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
            $rootScope.YESMessageProviderSearch = 'Yes';
            $rootScope.NaviConfirmation = 'Confirmation:';
            $rootScope.alertTimedout = "Your session timed out.";
            $rootScope.alertokay = "Ok";
            $rootScope.alertconsultationsave = "Consultation saved successfully!";
            $rootScope.alertconsultationfailed = "Failed to save consultation!";
            $rootScope.alertMsg = "A verification email has been sent to the user.";
            $rootScope.alertokay = "Ok";
            $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
            $rootScope.alertMsgvideo = "Consultation ended successfully!";
            $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
            $rootScope.consultEndMeg = 'Your consultation is already ended.';
            $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
            $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
            $rootScope.sessAlertDone = 'Done'; $rootScope.alertMsgConference = "Consultation ended successfully!";
            $rootScope.Buttonmsg = "Done";
            $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
            $rootScope.consultAlredComplMsg = 'Consultation already completed!';
            $rootScope.NaviConfirmation = 'Confirmation:';
            $rootScope.YESMessageProviderSearch = 'Yes';
        }


        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            console.log("lang " + isLang);
            if (isLang == "Español") {
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
                $rootScope.YESMessageProviderSearch = 'Sí';
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
                $rootScope.YESMessageProviderSearch = 'Sí';
            }
            else {
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
                $rootScope.YESMessageProviderSearch = 'Yes';
                $rootScope.NaviConfirmation = 'Confirmation:';
                $rootScope.alertTimedout = "Your session timed out.";
                $rootScope.alertokay = "Ok";
                $rootScope.alertconsultationsave = "Consultation saved successfully!";
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
                $rootScope.NaviConfirmation = 'Confirmation:';
                $rootScope.YESMessageProviderSearch = 'Yes';
            }
        });

        //end

        $rootScope.currState = $state;
        if ($rootScope.currState.$current.name == "tab.consultations" || $rootScope.currState.$current.name == "tab.healthinfo") {
            $("#localize-widget").hide();
        }
        else {
            $("#localize-widget").show();
        }
        angular.element(document).ready(function () {
            if ($scope.healthfootsave == true) {

                $("#localize-widget").hide();
            }
            else {
                $("#localize-widget").show();
            }
        });
        var localizeCurrent = $('#localize-current').text();
        if (localizeCurrent == "Español") {
            $('.homePhoneInput').attr('style', 'margin-top: -20px !important');
            if ($rootScope.is_iPadDeviceWidth <= 320) {
                $scope.HealthinfoPatient = "width: 106% !important; margin-left: -10px; !important";
            }
        } else {
            $('.homePhoneInput').attr('style', 'margin-top: -20px !important');
            if ($rootScope.is_iPadDeviceWidth >= 360) {
                $('.homePhoneInputValue').attr('style', 'margin-top: 0px !important');
            } else {
                $('.homePhoneInput').attr('style', 'margin-top: -20px !important');
            }
            // $scope.HealthinfoPatient = "font-size:20px !important";
            //   $scope.HealthinfoPatient = "padding-top: 15px !important;"
        }
        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            if (isLang == "Español") {
                $('.homePhoneInput').attr('style', 'margin-top: -20px !important');
                if ($rootScope.is_iPadDeviceWidth <= 320) {
                    $scope.HealthinfoPatient = "width: 106% !important; margin-left: -10px; !important";
                }
            } else {
                if ($rootScope.is_iPadDeviceWidth >= 360) {
                    $('.homePhoneInputValue').attr('style', 'margin-top: 0px !important');
                } else {
                    $('.homePhoneInputValue').attr('style', 'margin-top: -20px !important');
                }
                // $(".whoNeedsText").css("font-size", "23px");
                // $scope.HealthinfoPatient = "font-size:20px !important";
                //  $scope.HealthinfoPatient = "padding-top: 15px !important;"
            }
            isLang = "";
        });

        $scope.fetchPatientDetails = function () {
          console.log("fetchPatientDetails enter");
            $scope.firsttimecall = 0;
            $rootScope.patientAuthorize = true;
            $rootScope.patientUnAuthorize = false;
            $rootScope.patientAuthorizeValue = 'Y';
            if ($stateParams.getid != '') {
                var patId = $stateParams.getid;
                $rootScope.doGetSelectedPatientProfilesSS(patId, true);
            }

            console.log("addressInfoFetch");
            console.log($rootScope.addressInfoFetch);
            console.log("currentPatientDetails");
            console.log($rootScope.currentPatientDetails);
            $scope.fullAddressObj = [];


            var res = new Object();
            res['city'] = $rootScope.addressInfoFetch[0].addressObject.city;
            res['country'] = $rootScope.addressInfoFetch[0].addressObject.country;
            res['countryCode'] = $rootScope.addressInfoFetch[0].addressObject.countryCode;
            res['line1'] = $rootScope.addressInfoFetch[0].addressObject.line1;
            res['line2'] = $rootScope.addressInfoFetch[0].addressObject.line2;
            res['postalCode'] = $rootScope.addressInfoFetch[0].addressObject.postalCode;
            res['state'] = $rootScope.addressInfoFetch[0].addressObject.state;
            res['stateCode'] = $rootScope.addressInfoFetch[0].addressObject.stateCode;
            $scope.fullAddressObj = res;
            /* $scope.fullAddressObj.city = $rootScope.addressInfoFetch[0].addressObject.city;
             $scope.fullAddressObj.country = $rootScope.addressInfoFetch[0].addressObject.country;
             $scope.fullAddressObj.countryCode = $rootScope.addressInfoFetch[0].addressObject.countryCode;
             $scope.fullAddressObj.line1 = $rootScope.addressInfoFetch[0].addressObject.line1;
             $scope.fullAddressObj.line2 = $rootScope.addressInfoFetch[0].addressObject.line2;
             $scope.fullAddressObj.postalCode = $rootScope.addressInfoFetch[0].addressObject.postalCode;
             $scope.fullAddressObj.state = $rootScope.addressInfoFetch[0].addressObject.state;
             $scope.fullAddressObj.stateCode = $rootScope.addressInfoFetch[0].addressObject.stateCode;*/

            //delete $rootScope.addressInfoFetchModify['addressText'];
            console.log('$scope.fullAddressObj');
            console.log($scope.fullAddressObj);


              if($rootScope.userRoleDescription == 'User' && $rootScope.hasRequiredFields != true) {
                    $scope.route = $rootScope.userline1;
                    $scope.address2 = $rootScope.userline2;
                    $scope.City = $rootScope.usercity;
                    $scope.ZipCode = $rootScope.userpostalCode;
                    $scope.State = $rootScope.userstateCode;
                    $scope.state1 = $rootScope.userstate;
                    $scope.Country = $rootScope.usercountryCode;
              }else{
                    $scope.route = $rootScope.addressInfoFetch[0].addressObject.line1;
                    $scope.address2 = $rootScope.addressInfoFetch[0].addressObject.line2;
                    $scope.City = $rootScope.addressInfoFetch[0].addressObject.city;
                    $scope.ZipCode = $rootScope.addressInfoFetch[0].addressObject.postalCode;
                    $scope.State = $rootScope.addressInfoFetch[0].addressObject.state;
                    $scope.state1 = $rootScope.addressInfoFetch[0].addressObject.state;
                    $scope.Country = $rootScope.addressInfoFetch[0].addressObject.countryCode;
              }

            /*            $scope.route = $rootScope.primaryPatientDetails[0].addressObject.line1;
                        $scope.address2 = $rootScope.primaryPatientDetails[0].addressObject.line2;
                        $scope.City = $rootScope.primaryPatientDetails[0].addressObject.city;
                        $scope.ZipCode = $rootScope.primaryPatientDetails[0].addressObject.postalCode;
                        $scope.State = $rootScope.primaryPatientDetails[0].addressObject.state;
                        $scope.state1 = $rootScope.primaryPatientDetails[0].addressObject.state;
                        $scope.Country = $rootScope.primaryPatientDetails[0].addressObject.countryCode;*/

            $rootScope.currentPatientDetails[0].address = $rootScope.addressInfoFetch[0].addressObject.addressText;
            if ($scope.Country == 'US') {
                $scope.showCountrySelectBox = true;
            } else {
                $scope.showCountrySelectBox = false;
            }
        };
        // $("#localize-widget").show();
        $scope.getOnlyNumbers = function (text) {
            var newStr = "";
            if (text) {
                newStr = text.replace(/[^0-9.]/g, "");
            }
            return newStr;
        }
        $timeout(function () {
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
        $rootScope.getPhoneNumberWithoutCountryCode = function (phoneNumber) {
            var phoneNumberWithoutCountryCode = "";
            if (phoneNumber)
                phoneNumberWithoutCountryCode = phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length);
            return phoneNumberWithoutCountryCode;
        };
        $rootScope.reformatHeight = function (heightVal, index) {
            var newHeight = "0";
            if (heightVal) {
                var newHeightVal = heightVal.split('|');
                newHeight = newHeightVal[index];
            }
            return newHeight;
        };
        $rootScope.reformatHeightForDisplay = function (heightVal, heightUnit) {
            var newHeight = "";
            if (heightVal) {
                if (heightVal.indexOf('|') === -1) {
                    heightVal = heightVal + "|" + 0;
                    var heightValSplit = heightVal.split("|");
                }
                var heightValSplit = heightVal.split("|");
                var heightUnitSplit = heightUnit.split("/");
                if (heightValSplit[1] === 0) {
                    newHeight = heightValSplit[0] + " " + heightUnitSplit[0] + " " + heightValSplit[1] + " " + heightUnitSplit[1];
                } else {
                    newHeight = heightValSplit[0] + " " + heightUnitSplit[0] + " " + heightValSplit[1] + " " + heightUnitSplit[1];
                }
            }
            return newHeight;
        };
        $rootScope.getCountryName = function (countryCode) {
            if (!angular.isUndefined(countryCode)) {
                /*var countryInfo = $filter('filter')($rootScope.serviceCountries, {
                    code: countryCode
                });*/
                var countryInfo = $rootScope.serviceCountries.filter(function (r) { var show = r.code == countryCode; return show; });
                if (countryInfo[0])
                    return countryInfo[0].name;
                else if (countryInfo)
                    return countryInfo.name;
                else
                    return "";
            }
        };
        $rootScope.getTimeZoneName = function (timezoneCode) {
            if (!angular.isUndefined(timezoneCode) && timezoneCode !== 0) {
                /*  var timezoneInfo = $filter('filter')($rootScope.timeZones, {
                      id: timezoneCode
                  });*/
                var timezoneInfo = $rootScope.timeZones.filter(function (r) { var show = r.id == timezoneCode; return show; });
                if (timezoneInfo[0])
                    return timezoneInfo[0].name;
                else if (timezoneInfo)
                    return timezoneInfo.name;
                else
                    return "";
            }
        };

        $rootScope.getCountryCode = function (countryCode) {
            if (!angular.isUndefined(countryCode) && countryCode !== '') {
                var countryInfo = $rootScope.serviceCountries.filter(function (r) { var show = r.code == countryCode; return show; });
                if (countryInfo[0])
                    return countryInfo[0].code;
                else if (countryInfo)
                    return countryInfo.code;
                else
                    return "";
            }
        };

        $rootScope.currentPatientDetails[0].homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].homePhone));
        $rootScope.currentPatientDetails[0].mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].mobilePhone));
        $rootScope.couserdetails = false;
        $rootScope.dupcouser = false;
        $rootScope.showNewSurgeryAdd = false;
        $scope.showEditSurgery = false;
        $ionicPlatform.registerBackButtonAction(function () {
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
        $rootScope.checkAndChangeMenuIcon = function () {
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
        $scope.toggleLeft = function () {
            $rootScope.statename = $rootScope.currState.$current.name;
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId) {
                if ($rootScope.statename === "tab.healthinfo") {
                    $('.sideuserhealth').addClass("uhome");
                }
            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function () {
                    $rootScope.checkAndChangeMenuIcon();
                }, 300);
            }
        };
        $scope.healthInfoModel = {};
        //$rootScope.timezoneDisplay = 'none';


        $scope.healthInfoModel.address = $rootScope.currentPatientDetails[0].address;

        $scope.mobileval = $rootScope.currentPatientDetails[0].mobilePhone;
        $scope.addmore = false;
        $scope.healthhide = true;
        $scope.healthfoottab = true;
        $('#HealthFooter').css({ 'display': 'block' });
        $scope.healthfootsave = true;
        $scope.editshow = true;
        $scope.doneshow = true;
        $scope.readattr = false;
        $scope.doneedit = false;
        $scope.editimg = false;
        $scope.viewimg = true;
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
        $scope.minimum = "1800-01-01";
        $scope.hghtunit = false;
        $scope.hfeet = true;
        $scope.hinch = true;
        $scope.hmeter = true;
        $scope.hcmeter = true;
        $scope.heighteditmodal = function () {
            $('#healthInfoHeightUnit').val("");
            $ionicModal.fromTemplateUrl('templates/tab-heightedittemplate.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                var hghtinval = $('#heightuser').val();
                //var hghtinvalArr = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
                //var hghtinval = hghtinvalArr[0];

                $scope.modal = modal;
                $scope.modal.show().then(function () {
                    if (hghtinval === "") {
                        $('#healthInfoHeight').val("");
                        $('#healthInfoHeight2').val("");
                        document.getElementById('healthInfoHeightUnit').selectedIndex = 0;
                        $scope.hfeet = true;
                        $scope.hinch = true;
                        $scope.hmeter = true;
                        $scope.hcmeter = true;
                    } else {
                        var reminspace = hghtinval.split(" ");
                        var fet = reminspace[0];
                        var finc = reminspace[2];
                        var units = reminspace[1];
                        if (units === "ft") {
                            $('#healthInfoHeight').val(fet);
                            $('#healthInfoHeight2').val(finc);
                            document.getElementById('healthInfoHeightUnit').selectedIndex = 0;
                            $scope.hfeet = true;
                            $scope.hinch = true;
                            $scope.hmeter = true;
                            $scope.hcmeter = true;
                        } else {
                            $('#healthInfoHeight').val(fet);
                            $('#healthInfoHeight2').val(finc);
                            document.getElementById('healthInfoHeightUnit').selectedIndex = 1;
                            $scope.hfeet = false;
                            $scope.hinch = false;
                            $scope.hmeter = false;
                            $scope.hcmeter = false;
                        }
                    }
                });
                $timeout(function () {
                    $('option').filter(function () {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                }, 100);
            });
        }
        $scope.removemodal = function (model) {
            $scope.modal.remove();
        };
        $rootScope.editremovemodal = function () {
            $("#localize-widget").show();
            $scope.modal.remove()
                .then(function () {
                    $scope.healthInfoModel.address = $scope.oldfullAddress;
                    $scope.route = $scope.oldroute;
                    $scope.address2 = $scope.oldaddress2;
                    $scope.City = $scope.oldCity;
                    $scope.ZipCode = $scope.oldZipCode;
                    $scope.Country = $scope.oldCountry;
                    if ($scope.Country == 'US') {
                        $scope.showCountrySelectBox = true;
                    } else {
                        $scope.showCountrySelectBox = false;
                    }
                    $scope.state1 = $scope.oldstate1;
                    $scope.State = $scope.oldState;
                    $scope.modal = null;
                });
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();

        };
        $rootScope.editremoveopenmodal = function () {
            $("#localize-widget").show();
            $scope.modal.remove()
                .then(function () {
                    $scope.modal = null;
                });
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();

        };
        $rootScope.SubmitCardValidation = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            var top = '<div id="notifications-top-center" class="notificationError localizejs" ><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i><span class="localizejs">' + $a + '!</span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".Error_Message").append(top);
            refresh_close();
            //});
        }
        $rootScope.ValidationFunction1 = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();
            var top = '<div class="notifications-top-center notificationError localizejs"><div class="ErrorContent localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i><span class="localizejs"> ' + $a + '!</span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

            $(".notifications-top-center").remove();
            $(".ErrorMessage").append(top);
            refresh_close();

        }
        $scope.heighteditsave = function () {
            $rootScope.patHeightUnit = '';
            //  $('#heightuser').val('');
            $rootScope.height1 = $('#healthInfoHeight').val();
            $rootScope.height2 = $('#healthInfoHeight2').val();
            if ($rootScope.height1 != 'undefined' && $rootScope.height1 != '') {
                var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
                var heightunitid = $("#healthInfoHeightUnit").val().split("@").slice(0, 1);
                var getheightunitid = _.first(heightunitid);
                $rootScope.patHeightUnit = getheightunitid;
                var getheightunit = _.first(heightunit);
                if (getheightunit === "ft/in") {
                    if ($rootScope.height1 !== '' && $rootScope.height2 !== '') {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "ft" + " " + $('#healthInfoHeight2').val() + " " + "in";
                        $('#heightuser').val(heightdepval);
                    } else if ($rootScope.height1 !== '' && $rootScope.height2 === '') {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "ft" + " " + "0" + " " + "in";
                        $('#heightuser').val(heightdepval);
                    }
                    else {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "ft" + " " + "0" + " " + 'in';
                        $('#heightuser').val(heightdepval);
                    }
                } else {
                    if ($rootScope.height1 !== '' && $rootScope.height2 !== '') {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "m" + " " + $('#healthInfoHeight2').val() + " " + "cm";
                        $('#heightuser').val(heightdepval);
                    }
                    else if ($rootScope.height !== '' && $rootScope.height === '') {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "m" + " " + "0" + " " + "cm";
                        $('#heightuser').val(heightdepval);
                    }
                    else {
                        var heightdepval = $('#healthInfoHeight').val() + " " + "m" + " " + "0" + " " + "cm";
                        $('#heightuser').val(heightdepval);
                    }
                }
                document.getElementById("hunit").innerHTML = getheightunitid;
            }
            if ($rootScope.height1 === 'undefined' || $rootScope.height1 === '') {
                $scope.ErrorMessage = "Please enter min value 0 in required field";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if ($rootScope.height2 == 0 && $rootScope.height1 == 0) {
                $scope.ErrorMessage = "Please enter valid height";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else {
                $scope.modal.remove()
                    .then(function () {
                        $scope.modal = null;
                    });
            }
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }
        $scope.depheight1 = function () {
            var max = 10;
            var heights = $("#healthInfoHeight").val();
            if (heights === "") {
                $("#healthInfoHeight").val("");
            } else if (heights > max) {
                $("#healthInfoHeight").val(max);
            }
            var heightlen = $("#healthInfoHeight").val().length;

            if (heightlen > 2) {
                $("#healthInfoHeight").val(max);
            }
        }

        $scope.heightunit1len = function () {
            var max = 10;
            var heightunitlen = $('#healthInfoHeight').val().length;
            if (heightunitlen > 2) {
                $("#healthInfoHeight").val(max);
            }
        }
        $scope.heightunit2 = function () {
            var max = 99;
            var height2val = $("#healthInfoHeight2").val();
            if (height2val === "") {
                $("#healthInfoHeight2").val("");
            } else if (height2val > max) {
                $("#healthInfoHeight2").val(max);
            }
            var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
            var getheightunit = _.first(heightunit);
            if (getheightunit === "ft/in") {
                var maxheight = 11;
                if (height2val > maxheight) {
                    $("#healthInfoHeight2").val(maxheight);
                }
            }
        }
        $scope.heightunit2len = function () {
            var max = 99;
            var heightunit2len = $('#healthInfoHeight2').val().length;
            var height2val = $("#healthInfoHeight2").val();
            if (heightunit2len > 2) {
                $("#healthInfoHeight2").val(max);
            }
            var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
            var getheightunit = _.first(heightunit);
            if (getheightunit === "ft/in") {
                var maxheight = 11;
                if (height2val > maxheight) {
                    $("#healthInfoHeight2").val(maxheight);
                }
            }
        }
        $scope.weightunitchange = function () {
            var maxweight = 999;
            var weightval = $('#healthInfoWeight').val();
            if (weightval > maxweight) {
                $("#healthInfoWeight").val(maxweight);
            }
        }
        $scope.weightunit = function () {
            var maxweight = 999;
            var weightval = $('#healthInfoWeight').val();
            if (weightval > maxweight) {
                $("#healthInfoWeight").val(maxweight);
            }
            var healweightparse = parseInt(weightval);
            var weightvallen = $('#healthInfoWeight').val().length;
            if (weightvallen > 3) {
                $("#healthInfoWeight").val(maxweight);
            } else if (healweightparse === 0) {
                $('#healthInfoWeight').val('')
                $scope.ErrorMessage = "Please enter valid Weight";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }

        $scope.heightunitchange = function () {
            var maxheight = 11;
            var heightunit = $("#healthInfoHeightUnit").val().split("@").slice(1, 2);
            var getheightunit = _.first(heightunit);
            if (getheightunit === "ft/in") {
                $scope.hfeet = true;
                $scope.hinch = true;
                $scope.hmeter = true;
                $scope.hcmeter = true;
                var height2val = $('#healthInfoHeight2').val();
                if (height2val !== "") {
                    if (height2val > maxheight) {
                        $("#healthInfoHeight2").val(maxheight);
                    }
                }
            } else {
                $scope.hfeet = false;
                $scope.hinch = false;
                $scope.hmeter = false;
                $scope.hcmeter = false;
            }
        }
        if (!angular.isUndefined($rootScope.currentPatientDetails[0].account)) {
            $rootScope.patientId = $rootScope.currentPatientDetails[0].account.patientId;
        } else {
            $rootScope.patientId = $rootScope.currentPatientDetails[0].profileId;
        }
        $scope.edittext = function () {
            window.addEventListener('native.keyboardshow', function () {
                $("#localize-widget").hide();

            });
            window.addEventListener('native.keyboardhide', function () {
                $("#localize-widget").hide();
            });
            //console.log("Patientlist" + $rootScope.PatientIdentifiers);

            $('#healthInfoEmail').attr('style', 'text-overflow: ellipsis !important');
            $scope.healthInfoModel.address = $rootScope.currentPatientDetails[0].address;
            $rootScope.checkedpatientdet = '';
            if ($rootScope.PatientIdentifiers == '' || $rootScope.PatientIdentifiers == 'undefined') {
                $rootScope.PatientidupdateList = [];
            }
            var Patientidentif = $rootScope.PatientIdentifiers.length;
            for (i = 1; i <= $rootScope.PatientIdentifiers.length; i++) {
                var val3 = document.getElementById("helthPatVal_" + i).value;
                $scope.length3 = val3.length;
                $scope.setSelectionRange(document.getElementById("helthPatVal_" + i), $scope.length3, $scope.length3);
            }

            // var val = document.getElementById("helthPatVal_4").value;
            // var val1 = document.getElementById("helthPatVal_3").value;
            // var val2 = document.getElementById("helthPatVal_2").value;
            // var val3 = document.getElementById("helthPatVal_1").value;

            // $scope.length = val.length;
            // $scope.length1 = val1.length;
            // $scope.length2 = val2.length;
            // $scope.length3 = val3.length;
            // $scope.setSelectionRange(document.getElementById("helthPatVal_4"),$scope.length,$scope.length);
            // $scope.setSelectionRange(document.getElementById("helthPatVal_3"),$scope.length1,$scope.length1);
            // $scope.setSelectionRange(document.getElementById("helthPatVal_2"),$scope.length2,$scope.length2);
            // $scope.setSelectionRange(document.getElementById("helthPatVal_1"),$scope.length3,$scope.length3);

            // console.log("value le :" + $scope.val.length);
            $scope.healthfoottab = false;
            $scope.healthfootsave = false;
            $scope.updationListLength = 5;
            $rootScope.PatientidupdateList = [];
            //  $rootScope.getPatientids();
            //  $scope.patientAuthorize = false;
            //$rootScope.patientUnAuthorize = true;
            $rootScope.doddate = $rootScope.currentPatientDetails[0].dob;
            $rootScope.restage = getAge($rootScope.doddate);
            if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId)) {
                $rootScope.emailDisplay = 'flex';
                //$rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.emailDisplay = 'none';
                $rootScope.timezoneDisplay = 'none';
            }
            var emailtestvalue = $('#healthInfoEmail').val();
            if (emailtestvalue !== '') {
                $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.timezoneDisplay = 'none';
            }
            $timeout(function () {
                $('option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);
            if ($rootScope.primaryPatientId !== $rootScope.currentPatientDetails[0].account.patientId) {
                if ($rootScope.currentPatientDetails[0].account.email !== '') {
                    $(".emailion").css({
                        "display": "initial"
                    });
                    document.getElementById("healthInfoEmail").placeholder = "Required";
                } else {
                    $(".emailion").css({
                        "display": "none"
                    });
                    document.getElementById("healthInfoEmail").placeholder = "Optional";
                }
            } else {
                $(".emailion").css({
                    "display": "initial"
                });
            }
            $scope.doneshow = false;
            $scope.editshow = false;
            $rootScope.flag = false;
            $scope.doneedit = true;
            $scope.editimg = true;
            $('#ss').hide();
            $('#aaa').show();

            if ($rootScope.PatidentifierCount == 0) {
                $rootScope.viewpatapiDisplay = 'flex';
                $rootScope.viewpatmodalDisplay = 'none';

            } else {
                $rootScope.viewpatapiDisplay = 'none';
                $rootScope.viewpatmodalDisplay = 'flex';

            }
            var editsvalues = angular.element(document.getElementsByTagName('input'));
            var edittextarea = angular.element(document.getElementsByTagName('textarea'));
            var reFormatDate = $rootScope.userDOB.split('-')[1];
            if ($rootScope.userDOB) {
                $scope.userdob = new Date($rootScope.userDOB.split('-')[0] + '/' + $rootScope.userDOB.split('-')[1] + '/' + $rootScope.userDOB.split('-')[2]);
            } else {
                $scope.userdob = new Date($rootScope.userDOB);
            }
            $rootScope.currentPatientDetails[0].homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].homePhone));
            $rootScope.currentPatientDetails[0].mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails[0].mobilePhone));
            $scope.healthInfoModel.healthInfoCountry = $rootScope.currentPatientDetails[0].countryCode;
            $scope.healthInfoModel.healthInfoTimezone = $rootScope.currentPatientDetails[0].account.timeZoneId;
            if (!angular.isUndefined($rootScope.currentPatientDetails[0].organizationId) && $rootScope.currentPatientDetails[0].organizationId !== '') {
                $rootScope.listOfLocForCurntOrg = $filter('filter')($rootScope.listOfLocation, {
                    organizationId: $rootScope.currentPatientDetails[0].organizationId
                });
            }
            $scope.phoneval = $rootScope.currentPatientDetails[0].homePhone;
            $scope.mobileval = $rootScope.currentPatientDetails[0].mobilePhone;
            $scope.healthInfoModel.address = $rootScope.currentPatientDetails[0].address;
            $scope.formatheight = $rootScope.currentPatientDetails[0].anatomy.height;
            $scope.formatheightval = $scope.formatheight.split("|");
            $scope.height = parseInt($scope.formatheightval[0]);
            $scope.height2 = parseInt($scope.formatheightval[1]);
            $scope.weightvalue = $rootScope.currentPatientDetails[0].anatomy.weight;
            $scope.weight = parseInt($scope.weightvalue);
            editsvalues.removeClass('textdata');
            edittextarea.removeClass('textdata');
            editsvalues.addClass('editdata');
            edittextarea.addClass('editdata');
            setTimeout(function () {
                $('#healthInfoTimezone').val($scope.healthInfoModel.healthInfoTimezone);
                $('#healthInfoCountry').val($scope.healthInfoModel.healthInfoCountry);
            }, 10);
            //$scope.doGetCountries();
            //$scope.getStatesForUS();
            //$scope.loadAddressData();




            //$scope.newupdatePatientDetails();
        }
        $scope.loadAddressData = function () {
            $scope.route = $rootScope.addressInfoFetch[0].addressObject.line1;
            $scope.address2 = $rootScope.addressInfoFetch[0].addressObject.line2;
            $scope.City = $rootScope.addressInfoFetch[0].addressObject.city;
            $scope.ZipCode = $rootScope.addressInfoFetch[0].addressObject.postalCode;
            $scope.State = $rootScope.addressInfoFetch[0].addressObject.state;
            $scope.state1 = $rootScope.addressInfoFetch[0].addressObject.state;
            $scope.Country = $rootScope.addressInfoFetch[0].addressObject.countryCode;
            if ($scope.Country == 'US') {
                $scope.showCountrySelectBox = true;
            } else {
                $scope.showCountrySelectBox = false;
            }
        }

        $scope.editDob = function () {
            var chngedob = $('#healthInfoDOB').val();
            var patdob = new Date(chngedob);
            $rootScope.restage = getAge(patdob);
            if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId)) {
                $rootScope.emailDisplay = 'flex';
                //  $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.emailDisplay = 'none';
                $rootScope.timezoneDisplay = 'none';

            }

        }
        /*$scope.healthphoneblur = function() {
            $scope.homephonelength = $('#healthInfoHomePhone').val().length;
            var homephoneval = $('#healthInfoHomePhone').val();
            if (homephoneval !== '') {
                if ($scope.homephonelength < 14) {
                    $scope.ErrorMessage = "Please enter valid Home Phone Number";
                    $rootScope.Validation($scope.ErrorMessage);
                }

            }
        }*/
        $scope.ValidateEmail = function (email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };
        $scope.showEmail = function () {

            $('#healthInfoEmail').attr('style', 'text-overflow: unset !important');
        }
        $scope.emailBlur = function () {
            var emailvalue = $('#healthInfoEmail').val();
            if (emailvalue !== '') {
                if (!$scope.ValidateEmail($("#healthInfoEmail").val())) {
                    $scope.ErrorMessage = "Please enter a valid Email Address";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.timezoneDisplay = 'none';
            }
        }
        $scope.editmail = function () {
            var emailedtvalue = $('#healthInfoEmail').val();
            if (emailedtvalue !== '') {
                $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.timezoneDisplay = 'none';
            }
        }

        $scope.putUpdatePatientDetails = function () {

            var selectDate = document.getElementById('healthInfoDOB').value;
            var now = new Date();
            var dt1 = Date.parse(now),
                dt2 = Date.parse(selectDate);
            $rootScope.listOfPatientIdentifiers = [];
            $scope.newupdatePatientDetails();

            $scope.txtPlacesVal = $scope.route;
            $scope.cityVal = $scope.City;
            $scope.state1Val = $scope.state1;
            $scope.stateVal = $scope.State;
            $scope.zipcodeVal = $scope.ZipCode;
            $scope.countryVal = $scope.Country;

            if (typeof $rootScope.PatientIdentifiers != 'undefined') {
                if ($rootScope.PatientIdentifiers.length > $rootScope.listOfPatientIdentifiers.length) {
                    var a = $rootScope.PatientIdentifiers;
                    var b = $rootScope.listOfPatientIdentifiers;

                    for (i = 0; i < a.length; i++) {
                        for (j = 0; j < b.length; j++) {
                            if (a[i].identifierTypeCode == b[j].identifierTypeCode) {
                                a[i].value = b[j].value;
                            }
                        }
                    }
                    $rootScope.patAllIdentifier = $rootScope.PatientIdentifiers;
                    $rootScope.patSelectedIdentifier = $rootScope.listOfPatientIdentifiers;
                    $scope.total_patients = $rootScope.listOfPatientIdentifiers.length;
                    $scope.Patienuplist = $rootScope.PatientIdentifiers.length;
                } else if ($rootScope.PatientIdentifiers.length === $rootScope.listOfPatientIdentifiers.length) {
                    if ($scope.updationListLength != 0) {
                        $scope.unique = function (arr) {
                            var a = arr.concat();
                            for (var i = 0; i < a.length; ++i) {
                                for (var j = i + 1; j < a.length; ++j) {
                                    if (a[i] === a[j])
                                        a.splice(j--, 1);
                                }
                            }
                            return a;
                        };
                        $rootScope.patSelectedIdentifier = $rootScope.listOfPatientIdentifiers;
                        $rootScope.patAllIdentifier = $scope.unique($rootScope.PatientIdentifiers.concat($rootScope.patSelectedIdentifier));
                        $scope.total_patients = $rootScope.listOfPatientIdentifiers.length;
                    } else {
                        $rootScope.PatientIdentifiers.forEach(function (item) {
                            var result = addEmpty(item);
                            if (!result)
                                item.value = null;

                        });
                        // $rootScope.patAllIdentifier =   $rootScope.listOfPatientIdentifiers;
                        function addEmpty(item) {
                            //var result = false;
                            $rootScope.listOfPatientIdentifiers.forEach(function (item1) {
                                if (item1.identifierTypeCode === item.identifierTypeCode) {
                                    result = false;
                                }
                            });
                            return result;
                        }
                        $rootScope.patSelectedIdentifier = [];
                        $rootScope.patAllIdentifier = $rootScope.PatientIdentifiers;
                        $scope.total_patients = 0;
                    }
                } else if ($rootScope.PatientIdentifiers.length < $rootScope.listOfPatientIdentifiers.length) {

                    $rootScope.patSelectedIdentifier = $rootScope.listOfPatientIdentifiers;
                    $rootScope.patAllIdentifier = $rootScope.patSelectedIdentifier;
                    // $rootScope.patAllIdentifier =  $rootScope.PatientIdentifiers;
                    // $rootScope.patSelectedIdentifier =$rootScope.listOfPatientIdentifiers;
                    $scope.total_patients = $rootScope.listOfPatientIdentifiers.length;
                }
                if ($rootScope.PatientIdentifiers.length) {
                    if ($rootScope.patSelectedIdentifier.length) {
                        $rootScope.patAllIdentifier.forEach(function (item) {
                            var result = addEmpty(item);
                            if (!result)
                                item.value = null;

                        });
                        // $rootScope.patAllIdentifier =   $rootScope.listOfPatientIdentifiers;
                        function addEmpty(item) {
                            var result = false;
                            $rootScope.patSelectedIdentifier.forEach(function (item1) {
                                if (item1.identifierTypeCode === item.identifierTypeCode) {
                                    result = true;
                                }
                            });
                            return result;
                        }
                    } else {

                    }
                } else {
                    $rootScope.patAllIdentifier = $rootScope.listOfPatientIdentifiers;
                    $scope.total_patients = $rootScope.listOfPatientIdentifiers.length;
                }
            } else {
                $rootScope.patAllIdentifier = $rootScope.listOfPatientIdentifiers;
                $scope.total_patients = $rootScope.listOfPatientIdentifiers.length;
            }


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
            if ($rootScope.height2 === "") {
                $rootScope.height2 = "0";
                $scope.healthInfoHeight2 = $rootScope.height2;
            } else {
                $scope.healthInfoHeight2 = $rootScope.height2;
            }
            if ($rootScope.height1 === undefined || $rootScope.height1 === '') {
                var hghtval = $('#heightuser').val();
                if (hghtval !== '') {
                    var remspace = hghtval.split(" ");
                    $rootScope.height1 = remspace[0];
                    $scope.healthInfoHeight = $rootScope.height1;
                }
            } else {
                $scope.healthInfoHeight = $rootScope.height1;
            }
            if ($rootScope.height2 === undefined || $rootScope.height1 === '') {
                var hghtinval = $('#heightuser').val();
                if (hghtinval !== '') {
                    var reminspace = hghtval.split(" ");
                    $rootScope.height2 = reminspace[2];
                    $scope.healthInfoHeight2 = $rootScope.height2;
                }
            } else {
                $scope.healthInfoHeight2 = $rootScope.height2;
            }
            if ($scope.patHeightUnit === "" || $scope.patHeightUnit === undefined) {
                $scope.healthInfoHeightUnit = $rootScope.currentPatientDetails[0].anatomy.heightUnitId;
                /*var hghtinval=$('#heightuser').val();
                var reminspace=hghtinval.split(" ");
                var units=reminspace[1];
                if(units==="ft"){
                    $scope.healthInfoHeightUnit="4715"
                }else{
                    $scope.healthInfoHeightUnit="4716"
                }*/
            } else {
                $scope.healthInfoHeightUnit = $rootScope.patHeightUnit;
                /*  var hghtinval=$('#heightuser').val();
                  var reminspace=hghtinval.split(" ");
                  var units=reminspace[1];
                  if(units==="ft"){
                    $scope.healthInfoHeightUnit="4715"
                  }else{
                      $scope.healthInfoHeightUnit="4716"
                  }*/
            }
            $scope.healthInfoGender = $("#healthInfoGender").val();
            $scope.HeightUnit = $('#healthInfoHeightUnit').val();
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
            $scope.healthInfoAddress = $scope.healthInfoModel.address;
            $scope.healthInfoAddressobj = $scope.fullAddressObj;
            if ($rootScope.OrganizationLocation === 'on') {
                $scope.healthInfoOrganization = $('#healthInfoOrganization').val();
                $scope.healthInfoLocation = $('#healthInfoLocation').val();
            } else {
                $scope.healthInfoOrganization = null;
                $scope.healthInfoLocation = null;
            }
            $scope.healthInfoHairColor = $('#healthInfoHairColor').val();
            if (!angular.isUndefined($scope.healthInfoHairColor) && $scope.healthInfoHairColor !== '') {
                $scope.splitHairColor = $scope.healthInfoHairColor.split("@");
                $scope.getHairColorId = $scope.splitHairColor[0];
                $scope.getHairColorText = $scope.splitHairColor[1];
            } else {
                $scope.getHairColorId = null;
            }
            $scope.healthInfoEyeColor = $('#healthInfoEyeColor').val();
            if (!angular.isUndefined($scope.healthInfoEyeColor) && $scope.healthInfoEyeColor !== '') {
                $scope.splitEyeColor = $scope.healthInfoEyeColor.split("@");
                $scope.getEyeColorId = $scope.splitEyeColor[0];
                $scope.getEyeColorText = $scope.splitEyeColor[1];
            } else {
                $scope.getEyeColorId = null;
            }
            $scope.healthInfoEthnicity = $('#healthInfoEthnicity').val();
            if (!angular.isUndefined($scope.healthInfoEthnicity) && $scope.healthInfoEthnicity !== '') {
                $scope.splitEthnicity = $scope.healthInfoEthnicity.split("@");
                $scope.getEthnicityId = $scope.splitEthnicity[0];
                $scope.getEthnicityText = $scope.splitEthnicity[1];
            } else {
                $scope.getEthnicityId = null;
            }
            $scope.healthInfoBloodType = $('#healthInfoBloodType').val();
            if (!angular.isUndefined($scope.healthInfoBloodType) && $scope.healthInfoBloodType !== '') {
                $scope.splitBloodType = $scope.healthInfoBloodType.split("@");
                $scope.getBloodTypeId = $scope.splitBloodType[0];
                $scope.getBloodTypeText = $scope.splitBloodType[1];
            } else {
                $scope.getBloodTypeId = null;
            }
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
            if (age_month < 0 || (age_month === 0 && age_day < 0)) {
                age = parseInt(age) - 1;
            }
            $timeout(function () {
                $('option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);

            var identifierTypeCode_ = '', span_Text = '';
            for (i = 1; i <= $scope.total_patients; i++) {
                if (typeof $rootScope.PatientidupdateList !== 'undefined' && $rootScope.PatientidupdateList !== '' && $rootScope.PatientidupdateList.length > 0 && $rootScope.viewpatapiDisplay != 'none') {
                    $scope.patvalue = $('#patval_' + i).val();
                    if (typeof $scope.patvalue === 'undefined' || $scope.patvalue === '') {
                        identifierTypeCode_ = document.getElementById("pattext_" + i).innerText;
                        //  identifierTypeCode_ = $('#identifierTypeCode_'+i).val();
                        break;
                    }
                } else {
                    $scope.patvalue = $('#helthPatVal_' + i).val();
                    if (typeof $scope.patvalue === 'undefined' || $scope.patvalue === '') {
                        identifierTypeCode_ = document.getElementById("patModText_" + i).innerText;
                        //  identifierTypeCode_ = $('#identifierTypeCode_'+i).val();
                        break;
                    }
                }
            }
            if ($('#healthInfoHomePhone').val() !== '') {
                $scope.homephonelength = $('#healthInfoHomePhone').val().length;
                var homephoneval = $('#healthInfoHomePhone').val();
                if (homephoneval !== '') {
                    if ($scope.homephonelength < 14) {
                        $scope.ErrorMessage = "Please enter valid Home Phone Number";
                        $rootScope.Validation($scope.ErrorMessage);
                        return false;
                    }

                }
            }

            if ($rootScope.primaryPatientId !== $rootScope.currentPatientDetails[0].account.patientId) {
                if (($rootScope.restage >= 12)) {
                    if ($rootScope.currentPatientDetails[0].account.email !== '') {
                        if (typeof $scope.healthInfoFirstName === 'undefined' || $scope.healthInfoFirstName === '') {
                            $scope.ErrorMessage = "Please enter First Name";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoLastName === 'undefined' || $scope.healthInfoLastName === '') {
                            $scope.ErrorMessage = "Please enter Last Name";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.healthInfoDOB === 'undefined' || $scope.healthInfoDOB === '') {
                            $scope.ErrorMessage = "Please select DOB";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (dt2 > dt1) {
                            $scope.ErrorMessage = "DOB can not be in Future";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoEmail === 'undefined' || $scope.healthInfoEmail === '') {
                            $scope.ErrorMessage = "The user email address can be changed, but not removed";
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
                        } else if ($scope.healthInfoEmail !== '' && $scope.healthInfoTimezone === '') {
                            $scope.ErrorMessage = "Please select Timezone";
                            $rootScope.Validation($scope.ErrorMessage);

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
                        } else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                            $scope.ErrorMessage = "Please select Height Unit";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                            $scope.ErrorMessage = "Please enter Weight";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                            $scope.ErrorMessage = "Please select Weight Unit";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '')) {
                            $scope.ErrorMessage = "Please select Ethnicity";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '')) {
                            $scope.ErrorMessage = "Please select Hair Color";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '')) {
                            $scope.ErrorMessage = "Please select Eye Color";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '')) {
                            $scope.ErrorMessage = "Please select Blood Type";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                            //  if(typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)
                            // {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                            //  }

                        }
                        else if (typeof $scope.zipcodeVal === 'undefined' || $scope.zipcodeVal === '' || $scope.zipcodeVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.countryVal === 'undefined' || $scope.countryVal === '' || $scope.countryVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }

                        else if (identifierTypeCode_ !== '') {
                            if (identifierTypeCode_.indexOf("Driver's license number") != -1) {
                                $scope.ErrorMessage = "Please enter Driver's license number";
                            } else if (identifierTypeCode_.indexOf("Employee number") != -1) {
                                $scope.ErrorMessage = "Please enter Employee number";
                            } else if (identifierTypeCode_.indexOf("Patient Medicaid number") != -1) {
                                $scope.ErrorMessage = "Please enter Patient Medicaid number";
                            } else if (identifierTypeCode_.indexOf("Patient's Medicare number") != -1) {
                                $scope.ErrorMessage = "Please enter Patient's Medicare number";
                            }

                            else if (identifierTypeCode_.indexOf("Número de licencia de conducir") != -1) {
                                $scope.ErrorMessage = "Please enter Driver's license number";
                            } else if (identifierTypeCode_.indexOf("Número de Empleado") != -1) {
                                $scope.ErrorMessage = "Please enter Employee number";
                            } else if (identifierTypeCode_.indexOf("Número de Medicaid del paciente") != -1) {
                                $scope.ErrorMessage = "Please enter Patient Medicaid number";
                            } else if (identifierTypeCode_.indexOf("Número de Medicare del Paciente") != -1) {
                                $scope.ErrorMessage = "Please enter Patient's Medicare number";
                            }

                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                                $scope.healthInfoHeight2 = "0";
                            }
                            if ($scope.healthInfoFirstName.length <= 24 && $scope.healthInfoLastName.length <= 24) {
                                $scope.doPutProfileUpdation();
                            } else {
                                debugger
                                $scope.ErrorMessage = 'Max length for first / last name is 24';
                                $rootScope.Validation($scope.ErrorMessage);
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
                            $scope.ErrorMessage = "Please select DOB";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (dt2 > dt1) {
                            $scope.ErrorMessage = "DOB can not be in Future";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoRelationship === 'undefined' || $scope.healthInfoRelationship === '') {
                            $scope.ErrorMessage = "Please choose Relationship";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoCountry === 'undefined' || $scope.healthInfoCountry === '') {
                            $scope.ErrorMessage = "Please select Country";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ((typeof $scope.healthInfoTimezone === 'undefined' || $scope.healthInfoTimezone === '' || $scope.healthInfoTimezone === 'Choose') && $rootScope.timezoneDisplay != 'none') {
                            $scope.ErrorMessage = "Please select Time Zone";
                            $rootScope.Validation($scope.ErrorMessage);
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
                        } else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                            $scope.ErrorMessage = "Please select Height Unit";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                            $scope.ErrorMessage = "Please enter Weight";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                            $scope.ErrorMessage = "Please select Weight Unit";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '')) {
                            $scope.ErrorMessage = "Please select Ethnicity";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '')) {
                            $scope.ErrorMessage = "Please select Hair Color";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '')) {
                            $scope.ErrorMessage = "Please select Eye Color";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '')) {
                            $scope.ErrorMessage = "Please select Blood Type";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                            //  if(typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)
                            // {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                            //  }

                        }
                        else if (typeof $scope.zipcodeVal === 'undefined' || $scope.zipcodeVal === '' || $scope.zipcodeVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                        else if (typeof $scope.countryVal === 'undefined' || $scope.countryVal === '' || $scope.countryVal === null) {
                            $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                            $rootScope.Validation($scope.ErrorMessage);
                        }



                        else if (identifierTypeCode_ !== '') {
                            if (identifierTypeCode_.indexOf("Driver's license number") != -1) {
                                $scope.ErrorMessage = "Please enter Driver's license number";
                            } else if (identifierTypeCode_.indexOf("Employee number") != -1) {
                                $scope.ErrorMessage = "Please enter Employee number";
                            } else if (identifierTypeCode_.indexOf("Patient Medicaid number") != -1) {
                                $scope.ErrorMessage = "Please enter Patient Medicaid number";
                            } else if (identifierTypeCode_.indexOf("Patient's Medicare number") != -1) {
                                $scope.ErrorMessage = "Please enter Patient's Medicare number";
                            }
                            else if (identifierTypeCode_.indexOf("Número de licencia de conducir") != -1) {
                                $scope.ErrorMessage = "Please enter Driver's license number";
                            } else if (identifierTypeCode_.indexOf("Número de Empleado") != -1) {
                                $scope.ErrorMessage = "Please enter Employee number";
                            } else if (identifierTypeCode_.indexOf("Número de Medicaid del paciente") != -1) {
                                $scope.ErrorMessage = "Please enter Patient Medicaid number";
                            } else if (identifierTypeCode_.indexOf("Número de Medicare del Paciente") != -1) {
                                $scope.ErrorMessage = "Please enter Patient's Medicare number";
                            }
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                                $scope.healthInfoHeight2 = "0";
                            }
                            if ($scope.healthInfoFirstName.length <= 24 && $scope.healthInfoLastName.length <= 24) {
                                $scope.doPutProfileUpdation();
                            } else {
                                debugger
                                $scope.ErrorMessage = 'Max length for first / last name is 24';
                                $rootScope.Validation($scope.ErrorMessage);
                            }
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
                        $scope.ErrorMessage = "Please select DOB";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (dt2 > dt1) {
                        $scope.ErrorMessage = "DOB can not be in Future";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoRelationship === 'undefined' || $scope.healthInfoRelationship === '') {
                        $scope.ErrorMessage = "Please choose Relationship";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoCountry === 'undefined' || $scope.healthInfoCountry === '') {
                        $scope.ErrorMessage = "Please select Country";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
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
                    } else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                        $scope.ErrorMessage = "Please select Height Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                        $scope.ErrorMessage = "Please enter Weight";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                        $scope.ErrorMessage = "Please select Weight Unit";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '')) {
                        $scope.ErrorMessage = "Please select Ethnicity";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '')) {
                        $scope.ErrorMessage = "Please select Hair Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '')) {
                        $scope.ErrorMessage = "Please select Eye Color";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '')) {
                        $scope.ErrorMessage = "Please select Blood Type";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                        $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                        $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                        //  if(typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)
                        // {
                        $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                        $rootScope.Validation($scope.ErrorMessage);
                        //  }

                    }
                    else if (typeof $scope.zipcodeVal === 'undefined' || $scope.zipcodeVal === '' || $scope.zipcodeVal === null) {
                        $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    else if (typeof $scope.countryVal === 'undefined' || $scope.countryVal === '' || $scope.countryVal === null) {
                        $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                        $rootScope.Validation($scope.ErrorMessage);
                    }

                    else if (identifierTypeCode_ !== '') {
                        if (identifierTypeCode_.indexOf("Driver's license number") != -1) {
                            $scope.ErrorMessage = "Please enter Driver's license number";
                        } else if (identifierTypeCode_.indexOf("Employee number") != -1) {
                            $scope.ErrorMessage = "Please enter Employee number";
                        } else if (identifierTypeCode_.indexOf("Patient Medicaid number") != -1) {
                            $scope.ErrorMessage = "Please enter Patient Medicaid number";
                        } else if (identifierTypeCode_.indexOf("Patient's Medicare number") != -1) {
                            $scope.ErrorMessage = "Please enter Patient's Medicare number";
                        }
                        else if (identifierTypeCode_.indexOf("Número de licencia de conducir") != -1) {
                            $scope.ErrorMessage = "Please enter Driver's license number";
                        } else if (identifierTypeCode_.indexOf("Número de Empleado") != -1) {
                            $scope.ErrorMessage = "Please enter Employee number";
                        } else if (identifierTypeCode_.indexOf("Número de Medicaid del paciente") != -1) {
                            $scope.ErrorMessage = "Please enter Patient Medicaid number";
                        } else if (identifierTypeCode_.indexOf("Número de Medicare del Paciente") != -1) {
                            $scope.ErrorMessage = "Please enter Patient's Medicare number";
                        }
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                            $scope.healthInfoHeight2 = "0";
                        }
                        if ($scope.healthInfoFirstName.length <= 24 && $scope.healthInfoLastName.length <= 24) {
                            $scope.doPutProfileUpdation();
                        } else {
                            $scope.ErrorMessage = 'Max length for first / last name is 24';
                            $rootScope.Validation($scope.ErrorMessage);
                        }
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
                } else if ($rootScope.restage <= 11) {
                    $scope.ErrorMessage = "User should be atleast 12 years old";
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
                } else if ((typeof $scope.healthInfoTimezone === 'undefined' || $scope.healthInfoTimezone === '' || $scope.healthInfoTimezone === 'Choose') && $rootScope.timezoneDisplay != 'none') {
                    $scope.ErrorMessage = "Please select Time Zone";
                    $rootScope.Validation($scope.ErrorMessage);
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
                }
                else if (typeof $scope.healthInfoHeightUnit === 'undefined' || $scope.healthInfoHeightUnit === '') {
                    $scope.ErrorMessage = "Please select Height Unit";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoWeight === 'undefined' || $scope.healthInfoWeight === '') {
                    $scope.ErrorMessage = "Please enter Weight";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if (typeof $scope.healthInfoWeightUnit === 'undefined' || $scope.healthInfoWeightUnit === '') {
                    $scope.ErrorMessage = "Please select Weight Unit";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($rootScope.PPIsEthnicityRequired === 'on' && (typeof $scope.healthInfoEthnicity === 'undefined' || $scope.healthInfoEthnicity === '')) {
                    $scope.ErrorMessage = "Please select Ethnicity";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($rootScope.PPIsHairColorRequired === 'on' && (typeof $scope.healthInfoHairColor === 'undefined' || $scope.healthInfoHairColor === '')) {
                    $scope.ErrorMessage = "Please select Hair Color";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($rootScope.PPIsEyeColorRequired === 'on' && (typeof $scope.healthInfoEyeColor === 'undefined' || $scope.healthInfoEyeColor === '')) {
                    $scope.ErrorMessage = "Please select Eye Color";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ($rootScope.PPIsBloodTypeRequired === 'on' && (typeof $scope.healthInfoBloodType === 'undefined' || $scope.healthInfoBloodType === '')) {
                    $scope.ErrorMessage = "Please select Blood Type";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                    //  if(typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)
                    // {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                    //  }

                } else if (typeof $scope.zipcodeVal === 'undefined' || $scope.zipcodeVal === '' || $scope.zipcodeVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                else if (typeof $scope.countryVal === 'undefined' || $scope.countryVal === '' || $scope.countryVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }

                else if (identifierTypeCode_ !== '') {
                    if (identifierTypeCode_.indexOf("Driver's license number") != -1) {
                        $scope.ErrorMessage = "Please enter Driver's license number";
                    } else if (identifierTypeCode_.indexOf("Employee number") != -1) {
                        $scope.ErrorMessage = "Please enter Employee number";
                    } else if (identifierTypeCode_.indexOf("Patient Medicaid number") != -1) {
                        $scope.ErrorMessage = "Please enter Patient Medicaid number";
                    } else if (identifierTypeCode_.indexOf("Patient's Medicare number") != -1) {
                        $scope.ErrorMessage = "Please enter Patient's Medicare number";
                    }
                    else if (identifierTypeCode_.indexOf("Número de licencia de conducir") != -1) {
                        $scope.ErrorMessage = "Please enter Driver's license number";
                    } else if (identifierTypeCode_.indexOf("Número de Empleado") != -1) {
                        $scope.ErrorMessage = "Please enter Employee number";
                    } else if (identifierTypeCode_.indexOf("Número de Medicaid del paciente") != -1) {
                        $scope.ErrorMessage = "Please enter Patient Medicaid number";
                    } else if (identifierTypeCode_.indexOf("Número de Medicare del Paciente") != -1) {
                        $scope.ErrorMessage = "Please enter Patient's Medicare number";
                    }
                    $rootScope.Validation($scope.ErrorMessage);
                } else {
                    if (typeof $scope.healthInfoHeight2 === 'undefined' || $scope.healthInfoHeight2 === '') {
                        $scope.healthInfoHeight2 = "0";
                    }
                    if ($scope.healthInfoFirstName.length <= 24 && $scope.healthInfoLastName.length <= 24) {
                        $scope.doPutProfileUpdation();
                    } else {
                        debugger
                        $scope.ErrorMessage = 'Max length for first / last name is 24';
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                }
            }
            //  $scope.patientAuthorize = true;
        }

        $scope.newupdatePatientDetails = function () {

            if (typeof $rootScope.PatientidupdateList !== 'undefined' && $rootScope.PatientidupdateList !== '' && $rootScope.PatientidupdateList.length > 0 && $rootScope.viewpatapiDisplay != 'none') {
                var patIndentifierDetailsArray = $("input[name^='patIndentifierDetails']");
                var patIndentifierDetailsLength = $("input[name^= 'patIndentifierDetails']").length;

                var patIdentValue = $("input[id^='patval']");
            } else {
                var patIndentifierDetailsArray = $("input[name^='patientidentifiDetails']");
                var patIndentifierDetailsLength = $("input[name^= 'patientidentifiDetails']").length;
                var patIdentValue = $("input[id^='helthPatVal']");
            }

            for (i = 0; i < patIndentifierDetailsLength; i++) {
                var patIndentifierArray = patIndentifierDetailsArray[i].value;
                var patIndentifierSingleArrayDetails = (patIndentifierDetailsArray[i].value).split(',');
                if (patIndentifierSingleArrayDetails[2] === '') {
                    patIndentifierSingleArrayDetails[2] = new Date();
                }
                //   var j =i+1;
                if (typeof $rootScope.PatientidupdateList !== 'undefined' && $rootScope.PatientidupdateList !== '' && $rootScope.PatientidupdateList.length > 0 && $rootScope.viewpatapiDisplay != 'none') {
                    var patIdentValue_New = $('#patval_' + (i + 1)).val();
                } else {
                    var patIdentValue_New = $('#helthPatVal_' + (i + 1)).val();
                }
                if (patIdentValue_New !== patIdentValue[i].value) {
                    patIdentValue[i].value = patIdentValue_New;
                }
                $rootScope.listOfPatientIdentifiers.push({
                    effectiveDate: patIndentifierSingleArrayDetails[2],
                    identifierTypeCode: patIndentifierSingleArrayDetails[0],
                    identifierTypeTitle: patIndentifierSingleArrayDetails[1],
                    statusCode: patIndentifierSingleArrayDetails[3],
                    value: patIdentValue_New
                    // value : patIdentValue[i].value
                });
            }
        }

        /* window.addEventListener('native.keyboardshow', function () {
              $scope.$apply(function() {
                  if($rootScope.flag == true) {
                    $scope.healthfoottab = false;
                  } else {
                    $scope.healthfootsave = true;
                  }
               });

           });
           window.addEventListener('native.keyboardhide', function () {
              $scope.$apply(function() {
                if($rootScope.flag == true) {
                  $scope.healthfoottab = true;
                } else {
                  $scope.healthfootsave = false;
                }
            });
          });*/

        $rootScope.doPutProfileUpdation = function () {

            $scope.patientMedicalHistoryDetails = {};
            $scope.patientMedicalHistoryDetails.patientId = $rootScope.currentPatientDetails[0].account.patientId;
            if ($rootScope.ChronicCount > 0) {
                if ($rootScope.ChronicCount === 1) {
                    $scope.patientMedicalHistoryDetails.medicalCondition1 = $rootScope.patientmedicalConditions[0].code;
                } else if ($rootScope.ChronicCount === 2) {
                    $scope.patientMedicalHistoryDetails.medicalCondition1 = $rootScope.patientmedicalConditions[0].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition2 = $rootScope.patientmedicalConditions[1].code;
                } else if ($rootScope.ChronicCount === 3) {
                    $scope.patientMedicalHistoryDetails.medicalCondition1 = $rootScope.patientmedicalConditions[0].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition2 = $rootScope.patientmedicalConditions[1].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition3 = $rootScope.patientmedicalConditions[2].code;
                } else if ($rootScope.ChronicCount === 4) {
                    $scope.patientMedicalHistoryDetails.medicalCondition1 = $rootScope.patientmedicalConditions[0].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition2 = $rootScope.patientmedicalConditions[1].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition3 = $rootScope.patientmedicalConditions[2].code;
                    $scope.patientMedicalHistoryDetails.medicalCondition4 = $rootScope.patientmedicalConditions[3].code;
                }
            }
            if ($rootScope.CurAllergiesCount > 0) {
                if ($rootScope.CurAllergiesCount === 1) {
                    $scope.patientMedicalHistoryDetails.allergicMedication1 = $rootScope.patientmedicationsallergies[0].code;
                } else if ($rootScope.CurAllergiesCount === 2) {
                    $scope.patientMedicalHistoryDetails.allergicMedication1 = $rootScope.patientmedicationsallergies[0].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication2 = $rootScope.patientmedicationsallergies[1].code;
                } else if ($rootScope.CurAllergiesCount === 3) {
                    $scope.patientMedicalHistoryDetails.allergicMedication1 = $rootScope.patientmedicationsallergies[0].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication2 = $rootScope.patientmedicationsallergies[1].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication3 = $rootScope.patientmedicationsallergies[2].code;
                } else if ($rootScope.CurAllergiesCount === 4) {
                    $scope.patientMedicalHistoryDetails.allergicMedication1 = $rootScope.patientmedicationsallergies[0].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication2 = $rootScope.patientmedicationsallergies[1].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication3 = $rootScope.patientmedicationsallergies[2].code;
                    $scope.patientMedicalHistoryDetails.allergicMedication4 = $rootScope.patientmedicationsallergies[3].code;
                }
            }

            if ($rootScope.CurMedicationCount > 0) {
                if ($rootScope.CurMedicationCount === 1) {
                    $scope.patientMedicalHistoryDetails.takingMedication1 = $rootScope.patientmedications[0].code;
                } else if ($rootScope.CurMedicationCount === 2) {
                    $scope.patientMedicalHistoryDetails.takingMedication1 = $rootScope.patientmedications[0].code;
                    $scope.patientMedicalHistoryDetails.takingMedication2 = $rootScope.patientmedications[1].code;
                } else if ($rootScope.CurMedicationCount === 3) {
                    $scope.patientMedicalHistoryDetails.takingMedication1 = $rootScope.patientmedications[0].code;
                    $scope.patientMedicalHistoryDetails.takingMedication2 = $rootScope.patientmedications[1].code;
                    $scope.patientMedicalHistoryDetails.takingMedication3 = $rootScope.patientmedications[2].code;
                } else if ($rootScope.CurMedicationCount === 4) {
                    $scope.patientMedicalHistoryDetails.takingMedication1 = $rootScope.patientmedications[0].code;
                    $scope.patientMedicalHistoryDetails.takingMedication2 = $rootScope.patientmedications[1].code;
                    $scope.patientMedicalHistoryDetails.takingMedication3 = $rootScope.patientmedications[2].code;
                    $scope.patientMedicalHistoryDetails.takingMedication4 = $rootScope.patientmedications[3].code;
                }
            }

            if ($rootScope.patientMedicalSurgeriesCount > 0) {
                if ($rootScope.patientMedicalSurgeriesCount === 1) {
                    $scope.patientMedicalHistoryDetails.priorSurgery1 = $rootScope.patientmedicalsurgeries[0].description;
                    $scope.patientMedicalHistoryDetails.surgery1Month = $rootScope.patientmedicalsurgeries[0].month;
                    $scope.patientMedicalHistoryDetails.surgery1Year = $rootScope.patientmedicalsurgeries[0].year;
                } else if ($rootScope.patientMedicalSurgeriesCount === 2) {
                    $scope.patientMedicalHistoryDetails.priorSurgery1 = $rootScope.patientmedicalsurgeries[0].description;
                    $scope.patientMedicalHistoryDetails.surgery1Month = $rootScope.patientmedicalsurgeries[0].month;
                    $scope.patientMedicalHistoryDetails.surgery1Year = $rootScope.patientmedicalsurgeries[0].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery2 = $rootScope.patientmedicalsurgeries[1].description;
                    $scope.patientMedicalHistoryDetails.surgery2Month = $rootScope.patientmedicalsurgeries[1].month;
                    $scope.patientMedicalHistoryDetails.surgery2Year = $rootScope.patientmedicalsurgeries[1].year;
                } else if ($rootScope.patientMedicalSurgeriesCount === 3) {
                    $scope.patientMedicalHistoryDetails.priorSurgery1 = $rootScope.patientmedicalsurgeries[0].description;
                    $scope.patientMedicalHistoryDetails.surgery1Month = $rootScope.patientmedicalsurgeries[0].month;
                    $scope.patientMedicalHistoryDetails.surgery1Year = $rootScope.patientmedicalsurgeries[0].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery2 = $rootScope.patientmedicalsurgeries[1].description;
                    $scope.patientMedicalHistoryDetails.surgery2Month = $rootScope.patientmedicalsurgeries[1].month;
                    $scope.patientMedicalHistoryDetails.surgery2Year = $rootScope.patientmedicalsurgeries[1].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery3 = $rootScope.patientmedicalsurgeries[2].description;
                    $scope.patientMedicalHistoryDetails.surgery3Month = $rootScope.patientmedicalsurgeries[2].month;
                    $scope.patientMedicalHistoryDetails.surgery3Year = $rootScope.patientmedicalsurgeries[2].year;
                } else if ($rootScope.patientMedicalSurgeriesCount === 4) {
                    $scope.patientMedicalHistoryDetails.priorSurgery1 = $rootScope.patientmedicalsurgeries[0].description;
                    $scope.patientMedicalHistoryDetails.surgery1Month = $rootScope.patientmedicalsurgeries[0].month;
                    $scope.patientMedicalHistoryDetails.surgery1Year = $rootScope.patientmedicalsurgeries[0].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery2 = $rootScope.patientmedicalsurgeries[1].description;
                    $scope.patientMedicalHistoryDetails.surgery2Month = $rootScope.patientmedicalsurgeries[1].month;
                    $scope.patientMedicalHistoryDetails.surgery2Year = $rootScope.patientmedicalsurgeries[1].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery3 = $rootScope.patientmedicalsurgeries[2].description;
                    $scope.patientMedicalHistoryDetails.surgery3Month = $rootScope.patientmedicalsurgeries[2].month;
                    $scope.patientMedicalHistoryDetails.surgery3Year = $rootScope.patientmedicalsurgeries[2].year;

                    $scope.patientMedicalHistoryDetails.priorSurgery4 = $rootScope.patientmedicalsurgeries[3].description;
                    $scope.patientMedicalHistoryDetails.surgery4Month = $rootScope.patientmedicalsurgeries[3].month;
                    $scope.patientMedicalHistoryDetails.surgery4Year = $rootScope.patientmedicalsurgeries[3].year;
                }
            }

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
                    address: "",
                    addressObject: $scope.healthInfoAddressobj,
                    profileImagePath: $rootScope.PatientImageSelectUser,
                    height: $scope.healthInfoHeight + "|" + $scope.healthInfoHeight2,
                    weight: $scope.healthInfoWeight,
                    heightUnit: $scope.healthInfoHeightUnit,
                    weightUnit: $scope.healthInfoWeightUnit,
                    organizationId: $scope.healthInfoOrganization,
                    locationId: $scope.healthInfoLocation,
                    identifiers: $rootScope.patAllIdentifier,
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
                patientMedicalHistoryData: $scope.patientMedicalHistoryDetails,
                success: function (data) {

                    $rootScope.PatientidupdateList = [];
                    $scope.editimg = true;
                    $scope.viewimg = false;
                    $scope.doneshow = true;
                    if ($rootScope.updatedPatientImagePath !== '' && typeof $rootScope.updatedPatientImagePath !== 'undefined') {
                        $scope.uploadPhotoForExistingPatient();
                    }
                    $rootScope.PatientIdentifiers = $rootScope.listOfPatientIdentifiers;
                    var chkPreviousPage = false;
                    var depPatientSuccessPtId = data.patientID;
                    var depPatientSecurityToken = data.securityToken;
                    if (!angular.isUndefined(depPatientSecurityToken) && $rootScope.restage >= 12 && $scope.healthInfoEmail != "") {
                        var ptName = $scope.healthInfoFirstName + " " + $scope.healthInfoLastName;
                        $scope.sendCoUserInvite($rootScope.hospitalId, depPatientSuccessPtId, ptName, $scope.healthInfoEmail, depPatientSecurityToken);
                    }
                    if (ionic.Platform.is('browser') !== true) {
                        cordova.plugins.Keyboard.close();
                    }
                    $rootScope.patientId = $rootScope.currentPatientDetails[0].account.patientId;
                    if ($rootScope.hasRequiredFields === false) {
                        if ($rootScope.updatedPatientImagePath === '' || typeof $rootScope.updatedPatientImagePath === 'undefined') {
                            $scope.$root.$broadcast("callPatientDetails");
                        }
                    } else {
                        if ($rootScope.primaryPatientId !== data.patientID) {
                            if ($rootScope.patientAuthorizeValue === 'Y') {
                                $scope.authen = true;
                                $rootScope.patientAuthorize = true;
                                $rootScope.patientUnAuthorize = false;
                            } else {
                                $scope.authen = false;
                                $rootScope.patientAuthorize = false;
                                $rootScope.patientUnAuthorize = true;

                            }
                            $scope.updateDependentRelation(data.patientID, $scope.getRelationshipId, $rootScope.patientAuthorizeValue);
                        } else {
                            $scope.authen = true;
                            $rootScope.patientAuthorize = true;
                            $rootScope.patientUnAuthorize = false;
                        }
                        $rootScope.currentPatientDetails.homePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails.homePhone));
                        $rootScope.currentPatientDetails.mobilePhone = getOnlyPhoneNumber($scope.getOnlyNumbers($rootScope.currentPatientDetails.mobilePhone));
                        $rootScope.currentPatientDetails = $rootScope.currentPatientDetails[0];
                        $rootScope.currentPatientDetails[0] = $rootScope.currentPatientDetails;

                        if (angular.isUndefined($rootScope.currentPatientDetails.guardianName)) {
                            $rootScope.currentPatientDetails.guardianName = $rootScope.primaryPatientName + " " + $rootScope.primaryPatientLastName;
                        }
                        var currentLocation = window.location;
                        var loc = currentLocation.href;
                        var newloc = loc.split("#");
                        var locat = newloc[1];
                        var sploc = locat.split("/");
                        var cutlocations = sploc[1] + "." + sploc[2];


                        $rootScope.doGetRequiredPatientProfiles(data.patientID, ' ', cutlocations, $scope.authen);

                        //  $rootScope.GoToPatientDetails(cutlocations,$rootScope.currentPatientDetails.account.profileImagePath, $rootScope.currentPatientDetails.patientName, $rootScope.currentPatientDetails.lastName, $rootScope.currentPatientDetails.dob, $rootScope.currentPatientDetails.guardianName, data.patientID, $scope.authen, ' ');
                        var editdate = $rootScope.currentPatientDetails.dob;
                        $rootScope.doddate = new Date($rootScope.healthInfoDOB);
                        $rootScope.restage = getAge($rootScope.doddate);

                        if ($rootScope.restage >= 12 || ($rootScope.primaryPatientId === $rootScope.patientId)) {
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
                        $scope.healthfoottab = true;
                        $('#HealthFooter').css({ 'display': 'block' });
                        $scope.healthfootsave = true;
                        var editvalues = angular.element(document.getElementsByTagName('input'));
                        var edittextarea = angular.element(document.getElementsByTagName('textarea'));
                        editvalues.removeClass('editdata');
                        editvalues.addClass('textdata');
                        edittextarea.removeClass('editdata');
                        edittextarea.addClass('textdata');
                    }
                    $rootScope.doGetPrimaryPatientProfiles();
                   
                    $rootScope.userTimeZoneId = $scope.healthInfoTimezone;  //sakthi
                    $rootScope.doGetUserTimezone();
                },
                error: function (data, status) {
                    if (status === 400) {
                        $scope.ErrorMessage = "Patient already exists with email " + $scope.healthInfoEmail;
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (data.statusText == "Patient Registration is not allowed for this address." && data.status == 400) {
                        $scope.ErrorMessage = "Patient Registration is not allowed for this address. ";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else if (data.statusText === "City is empty") {
                        $scope.ErrorMessage = "City is empty";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (data.status === 400) {
                        $scope.ErrorMessage = data.data;
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                    else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.putProfileUpdation(params);
        }

        $scope.sendCoUserInvite = function (hospitalId, userId, name, email, securityToken) {
            if (securityToken.length > 3 && securityToken.substring(0, 2) === "##") {
                var params = {
                    accessToken: $rootScope.accessToken,
                    HospitalId: hospitalId,
                    UserId: userId,
                    Name: name,
                    Email: email,
                    Token: securityToken.substring(2),
                    success: function () {
                    },
                    error: function (data, status) {
                        if (status === 503) {
                            $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                        } else {
                            $scope.ErrorMessage = "Unable to sent email invitation";
                            $rootScope.Validation($scope.ErrorMessage);
                        }
                    }
                };
                LoginService.sendCoUserEmailInvitation(params);
            }
        }

        $scope.doDependentToUnauthorized = function (currentPatientDetails) {
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
            var getDrawImage = $rootScope.drawImage($rootScope.PatientImageSelectUser, currentPatientDetails.patientName, currentPatientDetails.lastName);
            var myPopup = $ionicPopup.show({
                title: "<div class='coUserLinkImage'>" + getDrawImage + "</div><div class='coUserLinkName'><span class='fname'><b>" + currentPatientDetails.patientName + "</b></span> <span class='sname'>" + currentPatientDetails.lastName + "</span></div> <div class='fontcolor'>" + "<span class='localizejs'>" + $rootScope.userGender + "</span>" + $scope.dob + "<span class='localizejs'>" + $scope.relationship + "</span></div>",
                templateUrl: 'templates/healthUnauthorizedPopup.html',
                scope: $scope,
                buttons: [{
                    text: '<b class="fonttype localizejs">Cancel</b>',
                    onTap: function (e) {
                        return false;
                    }
                }, {
                    text: '<b class="fonttype localizejs">Confirm</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                },]
            });

            myPopup.then(function (res) {
                if (res) {
                    $rootScope.patientAuthorizeValue = 'N';
                    $rootScope.patientAuthorize = false;
                    $rootScope.patientUnAuthorize = true;
                } else { }
            });
            $scope.closepopup = function () {
                myPopup.close();
            }
        }
        $scope.doDependentToAuthorized = function (currentPatientDetails) {
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
            var getDrawImage = $rootScope.drawImage($rootScope.PatientImageSelectUser, currentPatientDetails.patientName, currentPatientDetails.lastName);
            var myPopup = $ionicPopup.show({
                title: "<div class='coUserLinkImage'>" + getDrawImage + "</div><div class='coUserLinkName'><span class='fname'><b>" + currentPatientDetails.patientName + "</b></span> <span class='sname'>" + currentPatientDetails.lastName + "</span></div> <div class='fontcolor'>" + "<span class='localizejs'>" + $rootScope.userGender + "</span>" + $scope.dob + " <span class='localizejs'> " + $scope.relationship + "</span></div>",
                templateUrl: 'templates/unauthorizedpopup.html',
                scope: $scope,
                buttons: [{
                    text: '<b class="fonttype">Cancel</b>',
                    onTap: function (e) {
                        return false;
                    }
                }, {
                    text: '<b class="fonttype">Confirm</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                },]
            });

            myPopup.then(function (res) {
                if (res) {
                    $rootScope.patientAuthorizeValue = 'Y';
                    $rootScope.patientAuthorize = true;
                    $rootScope.patientUnAuthorize = false;
                } else {
                }
            });
            $scope.closepopup = function () {
                myPopup.close();
            }
        }

        $scope.updateDependentRelation = function (patientID, relationshipID, authorizeID) {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: patientID,
                RelationCodeId: relationshipID,
                IsAuthorized: authorizeID,
                success: function () {

                },
                error: function (data, status) {
                    if (status === 401) {
                        $scope.ErrorMessage = "Relation did not update";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
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
        $scope.profile = function () {
            //$rootScope.patientAuthorize = true;
            var myEl = angular.element(document.querySelector('#profid'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#healid'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var editflag = $rootScope.flag;
            if (editflag === false) {
                $scope.editshow = false;
                $scope.doneshow = false;
                $scope.healthfoottab = false;
                $scope.healthfootsave = false;
            } else {
                $scope.editshow = true;
                $scope.doneshow = true;
                $scope.healthfoottab = true;
                $('#HealthFooter').css({ 'display': 'block' });
                $scope.healthfootsave = true;
            }
            if ($rootScope.hasRequiredFields !== true) {
                $('#HealthFooter').css({ 'display': 'none' });
                $scope.healthfootsave = false;
                $scope.doneshow = false;
            }
            $scope.addmore = false;
            $scope.healthhide = true;
            $scope.cancelshow = false;
            var editvalues = angular.element(document.getElementsByTagName('input'));
            var edittextarea = angular.element(document.getElementsByTagName('textarea'));
            editvalues.removeClass('textdata');
            editvalues.addClass('editdata');
            edittextarea.removeClass('editdata');
            edittextarea.addClass('textdata');
        }

        $scope.getHealthHistoryDetails = function () {
            $rootScope.PatientMedicalProfileList = [];
            $rootScope.patvalues = '';
            $rootScope.patientmedications = '';
            $rootScope.CurMedicationCount = '';
            $rootScope.patientmedicationsallergies = '';
            $rootScope.CurAllergiesCount = '';
            $rootScope.patientmedicalConditions = '';
            $rootScope.ChronicCount = '';
            $rootScope.patientmedicalsurgeries = '';
            $rootScope.patientMedicalSurgeriesCount = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data) {
                        $rootScope.healthHistoryInformation = [];
                        $rootScope.PatientMedicalProfileList = data.data;
                        if (typeof data.data !== 'undefined' && data.data !== '') {
                            $rootScope.patvalues = $rootScope.PatientMedicalProfileList;
                            $rootScope.patientmedications = $rootScope.PatientMedicalProfileList[0].medications;
                            $rootScope.CurMedicationCount = $scope.patientmedications.length;
                            $rootScope.patientmedicationsallergies = $rootScope.PatientMedicalProfileList[0].medicationAllergies;
                            $rootScope.CurAllergiesCount = $scope.patientmedicationsallergies.length;
                            $rootScope.patientmedicalConditions = $rootScope.PatientMedicalProfileList[0].medicalConditions;
                            $rootScope.ChronicCount = $scope.patientmedicalConditions.length;
                            $rootScope.patientmedicalsurgeries = $rootScope.PatientMedicalProfileList[0].surgeries;
                            $rootScope.patientMedicalSurgeriesCount = $rootScope.patientmedicalsurgeries.length;
                        }
                    }
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    }
                }
            };
            LoginService.getPatientMedicalProfile(params);
        }

        $rootScope.getHealtPageForFillingRequiredDetails = function () {
            $rootScope.editOption = "None";
            $scope.healthfootsave = false;
            $scope.cancelshow = false;
            $scope.doneshow = false;
            $scope.flag = false;
            $rootScope.viewmyhealthDisplay = 'block';
            $rootScope.emailDisplay = 'flex';
            $rootScope.viewhealthDisplay = 'none';
            $("#HealthFooter").css("display", "none");
            $rootScope.height1 = '';
            $rootScope.height2 = '';
            $rootScope.updatedPatientImagePath = '';
            $rootScope.currntCountryCode = $rootScope.serviceCountries.filter(function (r) { var show = r.code == $rootScope.currentPatientDetails[0].countryCode; return show; });
            if ($rootScope.currntCountryCode.length !== 0) {
                $scope.healthInfoModel.healthInfoCountryCode = $rootScope.currntCountryCode[0].code;
                if ($scope.healthInfoModel.healthInfoCountryCode.length == 6 || $scope.healthInfoModel.healthInfoCountryCode.length == 5) {
                    $("#health_width").css("width", "62px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 4) {
                    $("#health_width").css("width", "42px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 3) {
                    $("#health_width").css("width", "36px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 2) {
                    $("#health_width").css("width", "24px");
                }

            }
            var date = new Date($rootScope.currentPatientDetails[0].dob);
            $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");
            $scope.userDOB = $filter('date')(date, "yyyy-MM-dd");
            $('#healthInfoDOB').val($scope.userDOB);
            $scope.getHealthHistoryDetails();
        }

        $scope.validationForChkingRequiredFields = function () {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.healthfootsave = false;
            $scope.ErrorMessage = "Please fill all required details ";
            $rootScope.Validation($scope.ErrorMessage);
        }

        $scope.chkPreviousPageForRequiredDetaisUsers = function (nextPage) {
            if ($rootScope.hasRequiredFields === true) {
                $state.go(nextPage);
            } else {
                $scope.healthfootsave = false;
                $scope.ErrorMessage = "Please fill all required details ";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }
        $scope.getMedicalDetailsinHealthInfo = function () {
            $scope.healthfootsave = true;
            //$rootScope.patientAuthorize = false;
            if ($rootScope.hasRequiredFields === true) {
                $scope.healthfoottab = true;
                $('#HealthFooter').css({ 'display': 'block' });
                $scope.health();
            } else {
                $scope.healthfootsave = false;
                $scope.ErrorMessage = "Please fill all required details ";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }

        $scope.health = function () {
            $rootScope.PatientMedicalProfileList = [];
            $rootScope.patvalues = '';
            $rootScope.patientmedications = '';
            $rootScope.CurMedicationCount = '';
            $rootScope.patientmedicationsallergies = '';
            $rootScope.CurAllergiesCount = '';
            $rootScope.patientmedicalConditions = '';
            $rootScope.ChronicCount = '';
            $rootScope.patientmedicalsurgeries = '';
            $rootScope.patientMedicalSurgeriesCount = '';
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
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
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    }
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
        $rootScope.getCodesSetsForHospital = function () {
            var params = {
                hospitalId: $rootScope.hospitalId,
                accessToken: $rootScope.accessToken,
                fields: $scope.codesFields,
                success: function (data) {
                    $rootScope.hospitalList = angular.fromJson(data.data[3].codes);
                    $rootScope.currentMedicationsearchList = angular.fromJson(data.data[1].codes);
                    $rootScope.medicationAllergiesearchList = angular.fromJson(data.data[2].codes);
                    $rootScope.chronicConditionsearchList = angular.fromJson(data.data[0].codes);
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getCodesSet(params);
        };

        $scope.getCodesSetsForHospital();
        /*  $rootScope.getPatientids = function() {
              var params = {

                  accessToken: $rootScope.accessToken,

                  success: function(data) {
                 $rootScope.currentPatientsearchList = data.data;
                  $rootScope.currentPatientsidsList = data.data;
                  $rootScope.CurPatientidCount = $scope.currentPatientsidsList.length;
                  },
                  error: function(data,status) {
                    if(status===0 ){
                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);
                    }else{
                        $rootScope.serverErrorMessageValidation();
                    }
                  }
              };
              LoginService.getListOfPatientids(params);
          };*/
        //    $rootScope.getPatientids();
        $rootScope.healthpatid = function () {
            $rootScope.currentPatientsearchList = '';
            $rootScope.CurPatientidCount = '';
            var params = {

                accessToken: $rootScope.accessToken,

                success: function (data) {
                    $rootScope.currentPatientsearchList = data.data;
                    $rootScope.CurPatientidCount = $rootScope.currentPatientsearchList.length;
                    $scope.data.searchProvider = '';
                    if ($scope.updationListLength != 0) {
                        if ($rootScope.PatidentifierCount == 0 || typeof $rootScope.PatidentifierCount == 'undefined' || $scope.updationListLength !== 5 || (typeof $rootScope.PatientidupdateList != 'undefined' && $rootScope.PatientidupdateList.length > 0)) {
                            $scope.clearSelectionAndRebindpatSelectionList($rootScope.PatientidupdateList, $rootScope.currentPatientsearchList);
                        } else {
                            $scope.clearSelectionAndRebindpatapiSelectionList($rootScope.PatientIdentifiers, $rootScope.currentPatientsearchList);
                        }
                    }
                    if ((typeof $rootScope.PatidentifierCount === 'undefined' || $scope.updationListLength == 5) && typeof $rootScope.PatientidupdateList != 'undefined') {
                        $rootScope.checkedpatientdet = 0;
                    } else {
                        if ($scope.updationListLength === 5) {
                            $rootScope.checkedpatientdet = $rootScope.PatidentifierCount;
                        } else {
                            $rootScope.checkedpatientdet = $scope.updationListLength;
                        }

                    }
                    $ionicModal.fromTemplateUrl('templates/tab-addpatientid.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        focusFirstInput: false,
                        backdropClickToClose: false
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfPatientids(params);

            $ionicScrollDelegate.$getByHandle('scrollTopView').scrollTop();
            //$ionicScrollDelegate.scrollTop(true);

            $scope.alphabet = iterateAlphabet();
            var users = $rootScope.currentPatientsearchList;
            if (typeof users !== 'undefined') {
                var userslength = users.length;
                var log = [];
                var tmp = {};
                for (i = 0; i < userslength; i++) {
                    var letter = users[i].display.toUpperCase().charAt(0);
                    if (tmp[letter] == undefined) {
                        tmp[letter] = []
                    }
                    tmp[letter].push(users[i]);
                }
                $rootScope.sorted_users = tmp;
                $scope.selectedObject = {};
                $rootScope.gotopatList = function (id) {
                    $location.hash(id);
                    $ionicScrollDelegate.anchorScroll();
                }
            }

        }

        $scope.patientdone = function () {
            //  $rootScope.oldPatientIdentifiersDetails = $rootScope.PatientIdentifiers;
            //  $rootScope.PatientidupdateList = [];
            $scope.PatientsearchItem = $filter('filter')($rootScope.currentPatientsearchList, {
                checked: true
            });
            $rootScope.checkedpatientdet = $scope.PatientsearchItem.length;
            if ($scope.PatientsearchItem !== '') {
                // $rootScope.PatientIdentifiers = [];
                $rootScope.patientmedicationsSearch = $scope.PatientsearchItem;
                $rootScope.PatientsdetCount = $scope.PatientsearchItem.length;

                if ($rootScope.PatientsdetCount == 0) {
                    $rootScope.PatientidupdateList = [];
                }

                for (var k = 0; k < $rootScope.PatientsdetCount; k++) {

                    var status2 = "New";
                    for (var l = 0; l < $rootScope.PatientidupdateList.length; l++) {
                        if ($scope.PatientsearchItem[k].display == $scope.PatientidupdateList[l].display) {
                            status2 = "Exit";
                        }
                    }
                    if (status2 == "New") {
                        $rootScope.PatientidupdateList.push({
                            identifierTypeCode: $scope.PatientsearchItem[k].identifierTypeCode,
                            display: $scope.PatientsearchItem[k].display,
                            value: $scope.PatientsearchItem[k].value,
                            effectiveDate: $scope.PatientsearchItem[k].effectiveDate,
                            statusCode: $scope.PatientsearchItem[k].statusCode,
                            identifierTypeTitle: $scope.PatientsearchItem[k].identifierTypeTitle
                        });
                    }

                }

                for (var i = 0; i < $rootScope.PatientidupdateList.length; i++) {
                    var status1 = "New";
                    for (var j = 0; j < $rootScope.PatientsdetCount; j++) {
                        if ($scope.PatientidupdateList[i].display == $scope.PatientsearchItem[j].display) {
                            status1 = "Exit";
                        }
                    }
                    if (status1 == "New") {
                        $rootScope.PatientidupdateList.splice(i, 1);
                        i = i - 1;
                    }
                }

                $scope.updationListLength = $rootScope.PatientidupdateList.length;
                // $rootScope.PatientIdentifiers = $rootScope.PatientidupdateList;

                $scope.modal.remove();
                $rootScope.viewpatapiDisplay = 'flex';
                $rootScope.viewpatmodalDisplay = 'none';
                if ($rootScope.PatientsdetCount == 0) {
                    $timeout(function () {
                        $ionicScrollDelegate.scrollTop(true);
                    }, 300);
                } else {
                    $timeout(function () {
                        $ionicScrollDelegate.scrollBottom(true);
                    }, 300);
                }
                /* if($rootScope.PatientsdetCount == 0) {
                  $ionicScrollDelegate.$getByHandle('scrollTopView').scrollTop();
                }*/
                //   $ionicScrollDelegate.$getByHandle('scrollTopView').scrollTop();
            } else {
                $scope.updationListLength = 0;

            }

        }

        $scope.OnSelectPatientdet = function (currentpatientdet) {
            if (currentpatientdet.checked === true) {
                $rootScope.checkedpatientdet++;

            } else {
                $rootScope.checkedpatientdet--;
                currentpatientdet.checked === false;
            }

            if ($rootScope.checkedpatientdet === 4) {

                $rootScope.checkedpatientdet--;
                $scope.patientdone();
            }
            if ($rootScope.checkedpatientdet >= 4) {
                currentpatientdet.checked === false;
                $scope.modal.remove();
            }
            $ionicScrollDelegate.scrollTop(true);
        }
        $scope.healthsearch = function (patientmedications) {
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
            }).then(function (modal) {
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
            $scope.selectedObject = {};
            $rootScope.gotoList = function (id) {
                $location.hash(id);
                $ionicScrollDelegate.anchorScroll();
            }
            $scope.cancelshow = false;
            $scope.doneshow = true;
            $scope.editshow = false;
        }

        $scope.medicationdone = function () {
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
                $scope.modal.remove();
                //$scope.patientdone();
            }

            $scope.InfantData = [];

            var params = {
                accessToken: $rootScope.accessToken,
                MedicationAllergies: $rootScope.patientmedicationsallergies,
                Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
                MedicalConditions: $rootScope.patientmedicalConditions,
                Medications: $rootScope.CurrentmedicationupdateList,
                InfantData: $scope.InfantData,
                PatientId: $rootScope.patientId,
                success: function () {
                    $scope.health();
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
                    }
                }
            };
            LoginService.putPatientMedicalProfile(params);
        }
        $scope.OnSelectMedication = function (currentmedication) {
            if (currentmedication.checked === true) {
                $rootScope.checkedMedication++;

            } else {
                $rootScope.checkedMedication--;
                currentmedication.checked === false;
            }
            if ((currentmedication.text === "Other - (List below)") && $rootScope.checkedMedication <= 4) {
            } else {
                if ($rootScope.checkedMedication == 4) {

                    $rootScope.checkedMedication--;
                    $scope.medicationdone();
                }
                if ($rootScope.checkedMedication >= 4) {
                    currentmedication.checked === false;
                    $scope.modal.remove();
                }
            }
        }
        $scope.openOtherCurrentMedicationView = function () {
            $scope.data = {}
            $ionicPopup.show({
                template: '<textarea name="comment" id="comment-textarea" ng-model="data.CurrentMedicationOther" class="textAreaPop">',
                title: 'Enter Current Medication',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function (e) {
                        angular.forEach($rootScope.currentMedicationsearchList, function (item) {
                            if (item.checked) {
                                if (item.text === "Other - (List below)") item.checked = false;
                            }
                        });
                        $rootScope.checkedMedication--;
                    }
                }, {
                    text: '<b>Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.CurrentMedicationOther) {
                            e.preventDefault();
                        } else {
                            angular.forEach($rootScope.currentMedicationsearchList, function (item) {
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
                            $rootScope.b.splice(1, 0, newCurrentMedicationItem);
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
                            $rootScope.gotoList = function (id) {
                                var myclass = id;
                                myclass.addClass("alpha");
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

        $scope.alergiessearch = function () {
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
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();

            });
            var usersallergie = $rootScope.medicationAllergiesearchList;
            var usersallergielength = usersallergie.length;
            var log = [];
            var tmpallergie = {};
            for (i = 0; i < usersallergielength; i++) {
                var letter = usersallergie[i].text.toUpperCase().charAt(0);
                if (tmpallergie[letter] === undefined) {
                    tmpallergie[letter] = [];
                }
                tmpallergie[letter].push(usersallergie[i]);
            }
            $scope.sorted_usersallergie = tmpallergie;

            $scope.gotoallergyList = function (codeid) {
                $location.hash(codeid);
                $ionicScrollDelegate.anchorScroll();
            }
            $scope.cancelshow = false;
            $scope.doneshow = true;
            $scope.editshow = false;
        }
        $scope.allergiedone = function () {
            $scope.modal.remove();
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
                $scope.modal.remove();
            }

            $scope.InfantData = [];

            var params = {
                accessToken: $rootScope.accessToken,
                MedicationAllergies: $rootScope.AllergiesupdateList,
                Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
                MedicalConditions: $rootScope.patientmedicalConditions,
                Medications: $rootScope.patientmedications,
                InfantData: $scope.InfantData,
                PatientId: $rootScope.patientId,
                success: function () {
                    $scope.health();
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
                    }
                }
            };
            LoginService.putPatientMedicalProfile(params);
        }
        $scope.OnSelectAllergies = function (allergie) {
            if (allergie.checked === true) {
                $rootScope.checkedAllergies++;
            } else {
                $rootScope.checkedAllergies--;
            }
            if ((allergie.text === "Other") && $rootScope.checkedAllergies <= 4) {
            } else {
                if ($rootScope.checkedAllergies === 4) {
                    $rootScope.checkedAllergies--;
                    $scope.allergiedone();
                }
                if ($rootScope.checkedAllergies >= 4) {
                    allergie.checked === false;
                    $scope.modal.remove();
                }
            }
        }

        $scope.chronicsearch = function () {
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
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
            var userschronic = $rootScope.chronicConditionsearchList;
            var userschroniclength = userschronic.length;
            var log = [];
            var tmpchronic = {};
            for (i = 0; i < userschroniclength; i++) {
                var chletter = userschronic[i].text.toUpperCase().charAt(0);
                if (tmpchronic[chletter] === undefined) {
                    tmpchronic[chletter] = [];
                }
                tmpchronic[chletter].push(userschronic[i]);
            }
            $scope.sortedchronic_users = tmpchronic;

            $scope.gotochronicList = function (codeid) {
                $location.hash(codeid);
                $ionicScrollDelegate.anchorScroll();
            }
            $scope.cancelshow = false;
            $scope.doneshow = true;
            $scope.editshow = false;
        }
        $scope.chronicdone = function () {
            $scope.modal.remove();
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
                $scope.modal.remove();
            }
            $scope.InfantData = [];
            var params = {
                accessToken: $rootScope.accessToken,
                MedicationAllergies: $rootScope.patientmedicationsallergies,
                Surgeries: $rootScope.PatientMedicalProfileList[0].surgeries,
                MedicalConditions: $rootScope.ChronicupdateList,
                Medications: $rootScope.patientmedications,
                InfantData: $scope.InfantData,
                PatientId: $rootScope.patientId,
                success: function () {
                    $scope.health();
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
                    }
                }
            };
            LoginService.putPatientMedicalProfile(params);
        }
        $scope.OnSelectChronicCondition = function (chronic) {
            if (chronic.checked === true) {
                $rootScope.checkedChronic++;
            } else {
                $rootScope.checkedChronic--;
            }
            if ((chronic.text === "Other") && $rootScope.checkedChronic <= 4) {
            } else {
                if ($rootScope.checkedChronic === 4) {
                    $rootScope.checkedAllergies--;
                    $scope.chronicdone();
                }
                if ($rootScope.checkedChronic >= 4) {
                    chronic.checked === false;
                    $scope.modal.remove();
                }
            }
        }
        $scope.data = {};
        $scope.$watch('data.searchProvider', function (searchKey) {
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
        $scope.doGetListOfCoUsers = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                authorizedOnly: true,
                success: function (data) {
                    $rootScope.listOfCoUserDetails = [];
                    angular.forEach(data.data, function (index) {
                        if (index.patientId !== $rootScope.primaryPatientId && index.isDependent != true) {
                            var getCoUserRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                                codeId: index.relationCodeId
                            })
                            if (getCoUserRelationShip.length !== 0) {
                                var relationShip = getCoUserRelationShip[0].text;
                            } else {
                                var relationShip = '';
                            }
                            var dob = ageFilter.getDateFilter(index.dob);
                            if (index.gender === 'M') {
                                var gender = "Male";
                            } else if (index.gender === 'F') {
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
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getListOfCoUsers(params);
        }
        $rootScope.doDeleteAccountCoUser = function (patientId) {
            var params = {
                accessToken: $rootScope.accessToken,
                PatientId: patientId,
                success: function () {
                    $scope.doGetListOfCoUsers();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.deleteAccountCoUser(params);
        }
        $scope.removePatientIdmodal = function () {
            if ($scope.updationListLength === 0 && $rootScope.PatientIdentifiers.length != 0 && $rootScope.checkedpatientdet === '') {
                $rootScope.PatientidupdateList = $rootScope.PatientIdentifiers;
            }
            $scope.modal.remove();
            $scope.cancelshow = true;
        };
        $scope.surgery = {};
        $rootScope.selectYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);
        $scope.showSurgeryPopup = function () {
            //$scope.surgeryDisplayTrue = true;
            $("#localize-widget").hide();
            $ionicModal.fromTemplateUrl('templates/tab-surgeries.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.surgery.name = '';
                $scope.surgery.dateString = '';
                $scope.surgery.dateStringMonth = '';
                $scope.surgery.dateStringYear = '';
                $scope.modal.show();
                $timeout(function () {
                    $('option').filter(function () {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                }, 100);
            });
            $rootScope.arrofSurgeryItemIndex = [];
        };


        $scope.closeSurgeryPopup = function () {
            $("#localize-widget").hide();
            console.log('inside closeSurgeryPopup');
            console.log('name :' + $scope.surgery.name + ', date : ' + $scope.surgery.dateString);
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
            if (+$scope.surgery.dateStringYear === yyyy) {
                if ($scope.surgery.dateStringMonth > mm) {
                    var isSurgeryDateIsFuture = false;
                }
            }

            if (($scope.surgery.name === '' || $scope.surgery.name === undefined) && $rootScope.showNewSurgeryAdd === true) {
                $scope.ErrorMessage = "Provide a short description of the surgical procedure";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (($scope.surgery.dateStringMonth === '' || $scope.surgery.dateStringMonth === undefined || $scope.surgery.dateStringYear === '' || $scope.surgery.dateStringYear === undefined) && $rootScope.showNewSurgeryAdd === true) {
                $scope.ErrorMessage = "Provide both the month and year of the surgical procedure";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (!isSurgeryDateValid && $rootScope.showNewSurgeryAdd === true) {
                $scope.ErrorMessage = "Surgery date should not be before your birthdate";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if (!isSurgeryDateIsFuture && $rootScope.showNewSurgeryAdd === true) {
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
                if ($rootScope.patientmedicalsurgeries.length === 3)
                    $scope.isToHideModal = true;
                $scope.surgery = {};
                $rootScope.showNewSurgeryAdd = false;
                $scope.showEditSurgery = false;
                $scope.updateMedicalProfile($scope.isToHideModal);
            }
        }
        $scope.updateMedicalProfile = function (hide) {
            console.log('update medical profile');

            var params = {
                accessToken: $rootScope.accessToken,
                MedicationAllergies: $rootScope.patientmedicationsallergies,
                Surgeries: $rootScope.patientmedicalsurgeries,
                MedicalConditions: $rootScope.ChronicupdateList,
                Medications: $rootScope.patientmedications,
                InfantData: $scope.InfantData,
                PatientId: $rootScope.patientId,
                success: function () {

                    $scope.health();
                    $timeout(function () {
                        $('option').filter(function () {
                            return this.value.indexOf('?') >= 0;
                        }).remove();
                    }, 100);
                    if (hide) {
                        $scope.modal.remove();
                    }

                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $scope.putPatientMedicalProfile = 'Error getting Patient Medical Profile';
                    }
                }
            };
            console.log('params : ' + JSON.stringify(params));
            LoginService.putPatientMedicalProfile(params);
        };
        $scope.hideSurgeryPopup = function (model) {
            $("#localize-widget").hide();
            $scope.modal.remove();
            $rootScope.showNewSurgeryAdd = false;
            $scope.showEditSurgery = false;
        };
        $scope.getMonthName = function (month) {
            var monthName = CustomCalendar.getMonthName(month);
            return monthName;
        };

        $timeout(function () {
            $('select option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);

        $scope.showNewSurgeryAddScreen = function () {
            $("#localize-widget").hide();
            $scope.surgery = {};
            $timeout(function () {
                $('select option').filter(function () {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);

            $rootScope.showNewSurgeryAdd = true;
            $scope.showEditSurgery = false;
        };
        $scope.backtoSurgeryView = function (index, description) {
            $rootScope.showNewSurgeryAdd = false;
            //  $scope.surgeryDisplayTrue = true;
        }
        $scope.removeSurgeryItem = function (index, item) {
            //     $rootScope.patientmedicalsurgeries.splice(index, 1);
            //     $scope.isToHideModal = false;
            //     $rootScope.showNewSurgeryAdd = false;
            //  $scope.showEditSurgery = false;
            //     if ($rootScope.patientmedicalsurgeries.length === 3)
            //         $scope.isToHideModal = true;
            //     $scope.updateMedicalProfile($scope.isToHideModal);

            var iIndex = $rootScope.patientmedicalsurgeries.indexOf(item);
            $rootScope.patientmedicalsurgeries.splice(iIndex, 1);
            $scope.isToHideModal = false;
            $rootScope.showIntakeNewSurgeryAdd = false;
            $scope.showEditSurgery = false;
            $scope.showIntakeEditSurgery = false;
            if ($rootScope.patientmedicalsurgeries.length === 3)
                $scope.isToHideModal = true;
            $scope.updateMedicalProfile($scope.isToHideModal);
        };
        //$scope.Editsurgery = {};
        $scope.openEditSurgeryItem = function (index, surgery) {
            //    if($scope.showEditSurgery !== true && $rootScope.showNewSurgeryAdd !== true) {
            //          $rootScope.showNewSurgeryAdd = false;
            //          $scope.showEditSurgery = true;
            //          $scope.editItemIndex = index;
            //          $(".surgeryDisplay-"+index).css("display", "none");
            //          $(".surgeryEdit-"+index).css("display", "block");
            //          $scope.editSurgeryArray = surgery;
            //   }

            var index = $rootScope.patientmedicalsurgeries.indexOf(surgery);

            $rootScope.showIntakeNewSurgeryAdd = false;
            $rootScope.showNewSurgeryAdd = false;
            $scope.showEditSurgery = true;

            angular.forEach($rootScope.patientmedicalsurgeries, function (value, key) {
                if (index == $rootScope.patientmedicalsurgeries.indexOf(value)) {
                    $(".surgeryDisplay-" + key).css("display", "none");
                    $(".surgeryEdit-" + key).css("display", "block");
                    $scope.editItemIndex = key;
                    $rootScope.arrofSurgeryItemIndex.push({ indexRow: key })
                } else {
                    $(".surgeryDisplay-" + key).css("display", "block");
                    $(".surgeryEdit-" + key).css("display", "none");

                    $(".surgeryDisplay-" + key).css("display", "block");
                    $(".surgeryEdit-" + key).css("display", "none");
                }
            });

            //  $scope.Editsurgery.surDescription = description;
        }
        $scope.EditSurgeryItem = function () {
            //  $scope.$apply(function() {
            // $scope.surDescription = $('#surDescription_' + $scope.editItemIndex).val()
            // $scope.dateStringMonth = $('#surDateStringMonth_' + $scope.editItemIndex).val();
            // $scope.dateStringYear = $('#dateStringYear_' + $scope.editItemIndex).val();
            // //  });
            // var selectedSurgeryDate = new Date($scope.dateStringYear, $scope.dateStringMonth - 1, 01);
            // $scope.dateString = selectedSurgeryDate;
            // var patientBirthDateStr = new Date($rootScope.PatientAge);
            // var isSurgeryDateValid = true;
            // if (selectedSurgeryDate < patientBirthDateStr) {
            //     isSurgeryDateValid = false;
            // }
            // var today = new Date();
            // var mm = today.getMonth() + 1;
            // var yyyy = today.getFullYear();
            // var isSurgeryDateIsFuture = true;
            // if ($scope.dateStringYear === yyyy) {
            //     if ($scope.dateStringMonth > mm) {
            //         var isSurgeryDateIsFuture = false;
            //     }
            // }
            // if (($scope.surDescription === '' || $scope.surDescription === undefined) && $rootScope.showEditSurgery === true) {
            //     $scope.ErrorMessage = "Provide a short description of the surgical procedure";
            //     $rootScope.ValidationFunction1($scope.ErrorMessage);
            // } else if (($scope.dateStringMonth === '' || $scope.dateStringMonth === undefined || $scope.dateStringYear === '' || $scope.dateStringYear === undefined)) {
            //     $scope.ErrorMessage = "Provide both the month and year of the surgical procedure";
            //     $rootScope.ValidationFunction1($scope.ErrorMessage);
            // } else if (!isSurgeryDateValid && $scope.showEditSurgery === true) {
            //     $scope.ErrorMessage = "Surgery date should not be before your birthdate";
            //     $rootScope.ValidationFunction1($scope.ErrorMessage);
            // } else if (!isSurgeryDateIsFuture && $scope.showEditSurgery === true) {
            //     $scope.ErrorMessage = "Surgery date should not be the future Date";
            //     $rootScope.ValidationFunction1($scope.ErrorMessage);
            // } else {
            //     $scope.newEditSurgery = {
            //         'Description': $scope.surDescription,
            //         'Month': parseInt($scope.dateStringMonth),
            //         'Year': parseInt($scope.dateStringYear)
            //     };
            //     $rootScope.patientmedicalsurgeries[$scope.editItemIndex] = $scope.newEditSurgery;
            //     $scope.isToHideModal = false;
            //     if ($rootScope.patientmedicalsurgeries.length === 3)
            //         $scope.isToHideModal = true;
            //     // $scope.Editsurgery = {};
            //     $rootScope.showNewSurgeryAdd = false;
            //     $scope.showEditSurgery = false;
            //     // $scope.surgeryDisplayTrue = true;
            //     $scope.updateMedicalProfile($scope.isToHideModal);
            // }

            var arrofSurgeryItem = [];
            var hidePopup = true;
            angular.forEach($rootScope.arrofSurgeryItemIndex, function (value, key) {

                if (($('#surDescription_' + value.indexRow).val() != '' || $('#surDescription_' + value.indexRow).val() === undefined) && $scope.showEditSurgery === true) {

                    if (($scope.dateStringMonths != '' || $scope.dateStringMonths != undefined || $scope.dateStringYears != '' || $scope.dateStringYears != undefined)) {

                        $scope.dateStringMonths = $('#surDateStringMonth_' + value.indexRow).val();
                        $scope.dateStringYears = $('#dateStringYear_' + value.indexRow).val();
                        var selectedSurgeryDate = new Date($scope.dateStringYears, $scope.dateStringMonths - 1, 01);
                        $scope.dateString = selectedSurgeryDate;
                        var patientBirthDateStr = new Date($rootScope.PatientAge);
                        var isSurgeryDateValid = true;
                        if (selectedSurgeryDate < patientBirthDateStr) {
                            isSurgeryDateValid = false;
                        }
                        var today = new Date();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var isSurgeryDateIsFuture = true;
                        if (+$scope.dateStringYear === yyyy) {
                            if (+$scope.dateStringMonth > mm) {
                                isSurgeryDateIsFuture = false;
                            }
                        }

                        if (isSurgeryDateValid && $scope.showEditSurgery === true) {

                            if (isSurgeryDateIsFuture && $scope.showEditSurgery === true) {

                                arrofSurgeryItem.push({
                                    Description: $('#surDescription_' + value.indexRow).val(),
                                    MonthString: $('#surDateStringMonth_' + value.indexRow).val(),
                                    YearString: $('#dateStringYear_' + value.indexRow).val(),
                                    IndexRow: value.indexRow,
                                });

                            } else {
                                $scope.ErrorMessage = "Surgery date should not be the future Date";
                                $rootScope.ValidationFunction1($scope.ErrorMessage);
                                hidePopup = false;
                            }
                        } else {
                            $scope.ErrorMessage = "Surgery date should not be before your birthdate";
                            $rootScope.ValidationFunction1($scope.ErrorMessage);
                            hidePopup = false;
                        }
                    } else {
                        $scope.ErrorMessage = "Provide both the month and year of the surgical procedure";
                        $rootScope.ValidationFunction1($scope.ErrorMessage);
                        hidePopup = false;
                    }
                } else {
                    $scope.ErrorMessage = "Provide a short description of the surgical procedure";
                    $rootScope.ValidationFunction1($scope.ErrorMessage);
                    hidePopup = false;
                }
            });

            if (hidePopup) {
                angular.forEach(arrofSurgeryItem, function (value, key) {
                    $scope.surDescription = value.Description;
                    $scope.dateStringMonth = value.MonthString;
                    $scope.dateStringYear = value.YearString;

                    var selectedSurgeryDate = new Date($scope.dateStringYear, $scope.dateStringMonth - 1, 01);
                    $scope.dateString = selectedSurgeryDate;
                    var patientBirthDateStr = new Date($rootScope.PatientAge);
                    var isSurgeryDateValid = true;
                    if (selectedSurgeryDate < patientBirthDateStr) {
                        isSurgeryDateValid = false;
                    }
                    var today = new Date();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    var isSurgeryDateIsFuture = true;
                    if (+$scope.dateStringYear === yyyy) {
                        if (+$scope.dateStringMonth > mm) {
                            isSurgeryDateIsFuture = false;
                        }
                    }
                    $scope.newEditSurgery = {
                        'Description': $scope.surDescription,
                        'Month': parseInt($scope.dateStringMonth),
                        'Year': parseInt($scope.dateStringYear)
                    };

                    $rootScope.patientmedicalsurgeries[value.IndexRow] = $scope.newEditSurgery;
                    $scope.isToHideModal = false;
                    $scope.isToHideModal = true;
                    $rootScope.showNewSurgeryAdd = false;
                    $scope.showEditSurgery = false;
                    $scope.updateMedicalProfile($scope.isToHideModal);

                });
            }
        }
        $scope.removePriorSurgeries = function (index, item) {
            $rootScope.patientSurgeriess.splice(index, 1);
            var indexPos = $rootScope.patientSurgeriess.indexOf(item);
            $rootScope.IsToPriorCount--;
        }
        $scope.$watch('healthInfoModel.healthInfoOrganization', function (newVal) {
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

        $scope.$watch('healthInfoModel.healthInfoCountry', function (newVal) {
            if (!angular.isUndefined($rootScope.currentPatientDetails[0].countryCode) && $rootScope.currentPatientDetails[0].countryCode !== '' && angular.isUndefined(newVal)) {
                $rootScope.currntCountryCode = $rootScope.serviceCountries.filter(function (r) { var show = r.code == $rootScope.currentPatientDetails[0].countryCode; return show; });
                $scope.healthInfoModel.healthInfoCountryCode = $rootScope.currntCountryCode[0].code;
                if ($scope.healthInfoModel.healthInfoCountryCode.length == 6 || $scope.healthInfoModel.healthInfoCountryCode.length == 5) {
                    $("#health_width").css("width", "62px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 4) {
                    $("#health_width").css("width", "42px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 3) {
                    $("#health_width").css("width", "36px");
                }
                else if ($scope.healthInfoModel.healthInfoCountryCode.length == 2) {
                    $("#health_width").css("width", "24px");
                } else {
                    $("#health_width").css("width", "10px");
                }
            }

            else {
                if (newVal) {
                    $rootScope.currntCountryCode = $rootScope.serviceCountries.filter(function (r) { var show = r.code == newVal; return show; });
                    $scope.healthInfoModel.healthInfoCountryCode = $rootScope.currntCountryCode[0].code;
                    if ($scope.healthInfoModel.healthInfoCountryCode.length == 6 || $scope.healthInfoModel.healthInfoCountryCode.length == 5) {
                        $("#health_width").css("width", "62px");
                    } else if ($scope.healthInfoModel.healthInfoCountryCode.length == 4) {
                        $("#health_width").css("width", "42px");
                    } else if ($scope.healthInfoModel.healthInfoCountryCode.length == 3) {
                        $("#health_width").css("width", "36px");
                    } else if ($scope.healthInfoModel.healthInfoCountryCode.length == 2) {
                        $("#health_width").css("width", "24px");
                    } else {
                        $("#health_width").css("width", "10px");
                    }
                } else {
                    if (typeof $rootScope.countrycodevalue !== 'undefined') {
                        if ($rootScope.countrycodevalue.length == 6 || $rootScope.countrycodevalue.length == 5) {
                            $("#health_width").css("width", "62px");
                        }
                        else if ($rootScope.countrycodevalue.length == 4) {
                            $("#health_width").css("width", "42px");
                        }
                        else if ($rootScope.countrycodevalue.length == 3) {
                            $("#health_width").css("width", "36px");
                        }
                        else if ($rootScope.countrycodevalue.length == 2) {
                            $("#health_width").css("width", "24px");
                        }
                    } else {
                        $("#health_width").css("width", "10px");
                    }
                }
            }
        });
        //Function to open ActionSheet when clicking Camera Button
        //================================================================================================================
        var options;
        var newUploadedPatientPhoto;
        $scope.showCameraActions = function () {
            options = {
                'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
                'addCancelButtonWithLabel': 'Cancel',
            };
            window.plugins.actionsheet.show(options, cameraActionCallback);
        }
        $scope.uploadPhotoForExistingPatient = function () {
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
                $cordovaFileTransfer.upload(fileUploadUrl, targetPath, options).then(function (result) {
                    var getImageURLFromResponse = angular.fromJson(result.response);
                    $rootScope.PatientImageSelectUser = getImageURLFromResponse.data[0].uri;
                    $scope.$root.$broadcast("callPatientAndDependentProfiles");
                }, function (err) {
                    navigator.notification.alert('Unable to upload the photo. Please try again later.', null, $rootScope.alertMsgName, 'OK');
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                    $ionicLoading.show({
                        template: '<img src="img/puff.svg" alt="Loading" />'
                    });
                });
            }

        };

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
                    allowEdit: 1,
                    correctOrientation: true,
                    //saveToPhotoAlbum: saveToPhotoAlbumFlag,
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
        }
        // Function to call when the user cancels the operation
        function onCameraCaptureFailure(err) {
        }
        // End Photo Functionality
        $scope.clearSelectionAndRebindSelectionList = function (selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function (item, key2) {
                item.checked = false;
            });
            if (!angular.isUndefined(selectedListItem)) {
                if (selectedListItem.length > 0) {
                    angular.forEach(selectedListItem, function (value1, key1) {
                        angular.forEach(mainListItem, function (value2, key2) {
                            if (value1.description === value2.text) {
                                value2.checked = true;
                            }
                        });
                    });
                }
            }
        };
        $timeout(function () {
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
        $scope.clearSelectionAndRebindpatSelectionList = function (selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function (item, key2) {
                item.checked = false;
            });
            if (!angular.isUndefined(selectedListItem)) {
                if (selectedListItem.length > 0) {
                    angular.forEach(selectedListItem, function (value1, key1) {
                        angular.forEach(mainListItem, function (value2, key2) {
                            if (value1.display === value2.display) {
                                value2.checked = true;
                            }
                        });
                    });
                }
            }
        };
        $scope.clearSelectionAndRebindpatapiSelectionList = function (selectedListItem, mainListItem) {
            angular.forEach(mainListItem, function (item, key2) {
                item.checked = false;
            });

            if (!angular.isUndefined(selectedListItem)) {
                if (selectedListItem.length > 0) {
                    angular.forEach(selectedListItem, function (value1, key1) {
                        angular.forEach(mainListItem, function (value2, key2) {
                            if (value1.identifierTypeTitle === value2.display) {
                                value2.checked = true;
                                value2.value = value1.value;
                                value2.effectiveDate = value1.effectiveDate;
                                value2.identifierTypeCode = value1.identifierTypeCode;
                                value2.identifierTypeTitle = value1.identifierTypeTitle;
                                value2.statusCode = value1.statusCode;
                            }
                        });
                    });
                }
            }
        };
        // $scope.cursorposw = function() {
        // var app =   $(event.target).attr("id");
        //   alert(app);
        // }
        $scope.goTOSchedule = function () {
            //  $("#localize-widget").show();
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }

        jQuery.fn.putCursorAtEnd = function () {

            return this.each(function () {

                // Cache references
                var $el = $(this),
                    el = this;

                // Only focus if input isn't already
                if (!$el.is(":focus")) {
                    $el.focus();
                }

                // If this function exists... (IE 9+)
                if (el.setSelectionRange) {

                    // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
                    var len = $el.val().length * 2;

                    // Timeout seems to be required for Blink
                    setTimeout(function () {
                        el.setSelectionRange(len, len);
                    }, 1);

                } else {

                    // As a fallback, replace the contents with itself
                    // Doesn't work in Chrome, but Chrome supports setSelectionRange
                    $el.val($el.val());

                }

                // Scroll to the bottom, in case we're in a tall textarea
                // (Necessary for Firefox and Chrome)
                this.scrollTop = 999999;

            });

        };

        (function () {

            var searchInput = $("#helthPatVal_3");

            searchInput
                .putCursorAtEnd() // should be chainable
                .on("focus", function () { // could be on any event
                    searchInput.putCursorAtEnd()
                });

        })();
        $scope.setSelectionRange = function (input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
            else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        };

        $scope.changeCountry = function () {
            var country = document.getElementById('country').value;
            if (country == 'Select Country') {
                $scope.imageName = '';
            }
        }

        $rootScope.ValidationReg = function ($a) {
            $('.ContinueAddressBtn').css({ 'display': 'none' });
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                    setTimeout(function () {
                        $('.ContinueAddressBtn').css({ 'display': 'block' });
                    }, 100)
                });
            }
            refresh_close();
            var top = '<div class="notifications-top-center notificationError" style="height: 58px;"><div class="ErrorContent localizejs" style="margin-top: 5px !important;"> <i class="ion-alert-circled" style="font-size: 23px;"></i> ' + $a + '! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".ErrorMessageReg").append(top);
            refresh_close();
        }

        $scope.addressEditSave = function () {
            $scope.healthInfoModel.address = document.getElementById('fullAddress').value;
            $scope.countryValue = document.getElementById('country').value;
            if ($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country') {
                $scope.ErrorMessage = "Please select Country";
                $rootScope.ValidationReg($scope.ErrorMessage);
            } else if ($scope.countryValue == 'Select Country') {
                $scope.ErrorMessage = "Please select Country";
                $rootScope.ValidationReg($scope.ErrorMessage);
            } else {
                $('.ContinueAddressBtn').css({ 'display': 'block' });
            }

            var stateObj = '';
            var countryFetch = '';
            var countryCodeFetch = '';
            var stateCodeFetch = '';
            //document.getElementById('fullAddress').value;
            $scope.route = document.getElementById('txtPlaces').value;
            $scope.address2 = document.getElementById('address2').value;
            $scope.City = document.getElementById('city').value;
            var element = document.getElementById('state');
            if (typeof (element) != 'undefined' && element != null) {
                $scope.State = document.getElementById('state').value;
                stateCodeFetch = document.getElementById('state').options[document.getElementById('state').selectedIndex].getAttribute("data-state-code");
                stateObj = $scope.State;
            }
            var element = document.getElementById('state1');
            if (typeof (element) != 'undefined' && element != null) {
                $scope.state1 = document.getElementById('state1').value;
                stateCodeFetch = $scope.state1;
                stateObj = $scope.state1;
            }
            $scope.ZipCode = document.getElementById('zipcode').value;
            $scope.Country = document.getElementById('country').value;
            if ($scope.Country == 'US') {
                $scope.showCountrySelectBox = true;
            } else {
                $scope.showCountrySelectBox = false;
            }
            var countryFetch = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
            var countryCodeFetch = document.getElementById('country').value;

            var res = new Object();
            res['city'] = $scope.City;
            res['country'] = countryFetch;
            res['countryCode'] = countryCodeFetch;
            res['line1'] = $scope.route;
            res['line2'] = $scope.address2;
            res['postalCode'] = $scope.ZipCode;
            res['state'] = stateObj;
            res['stateCode'] = stateCodeFetch;

            $scope.fullAddressObj = res;
            //console.log($scope.fullAddressObj);
            if ($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country') {

            } else {
                $scope.modal.remove()
                    .then(function () {
                        $scope.modal = null;
                    });
            }
        }

        $scope.makeAddress = function () {
            var txtPlaces = document.getElementById('txtPlaces').value;
            var address2 = document.getElementById('address2').value;
            var city = document.getElementById('city').value
            var element = document.getElementById('state');
            if (typeof (element) != 'undefined' && element != null) {
                if (document.getElementById('state').value != '' && document.getElementById('state').value != 'Select State')
                    var state = document.getElementById('state').value;
            }
            var element = document.getElementById('state1');
            if (typeof (element) != 'undefined' && element != null) {
                if (document.getElementById('state1').value != '')
                    var state = document.getElementById('state1').value;
            }
            var zipcode = document.getElementById('zipcode').value;
            if (document.getElementById('country').value != 'Select Country') {

                var country = document.getElementById('country').value;
                $scope.imageName = 'images/countries/flags/' + country + '-32.png';
            }
            if (document.getElementById('country').value == 'US') {
                $scope.showCountrySelectBox = true;
            } else {
                $scope.showCountrySelectBox = false;
            }
            var res = new Object();
            res['txtPlaces'] = txtPlaces;
            res['address2'] = address2;
            res['city'] = city;
            res['state'] = state;
            res['zipcode'] = zipcode;
            res['country'] = country;
            var fullAddressCombo = '';
            var c = Object.keys(res).length;
            var count = 0;
            for (var i in res) {
                count++;
                if (res[i] != '' && res[i] != undefined && res[i].indexOf('?') == -1) {
                    if (count != c) {
                        fullAddressCombo = fullAddressCombo + res[i] + ', ';
                    } else {
                        fullAddressCombo = fullAddressCombo + res[i];
                    }

                }
            }

            if (fullAddressCombo.length != 0 && fullAddressCombo != ', ' && fullAddressCombo != ',')
                document.getElementById('fullAddress').value = fullAddressCombo;
            if (fullAddressCombo.length == 0 || fullAddressCombo == ', ' || fullAddressCombo == ',')
                document.getElementById('fullAddress').value = "Please enter address";
        }

        /*
            $scope.disableTap = function(){
                document.getElementById('txtPlaces').addEventListener('keypress', function(e) {
                if (event.which == 13 || event.keyCode == 13 && document.getElementsByClassName('pac-container:visible').length) {
                    return true;
                }
                return true;
                });
            }*/

        /*    $scope.route = $rootScope.currentPatientDetails[0].addressObject.line1;
            $scope.address2 = $rootScope.currentPatientDetails[0].addressObject.line2;
            $scope.City = $rootScope.currentPatientDetails[0].addressObject.city;
            $scope.ZipCode = $rootScope.currentPatientDetails[0].addressObject.postalCode;
            $scope.State = $rootScope.currentPatientDetails[0].addressObject.state;
            $scope.state1 = $rootScope.currentPatientDetails[0].addressObject.state;
            $scope.Country = $rootScope.currentPatientDetails[0].addressObject.countryCode;*/


        $scope.addressEditModal = function () {
            $("#localize-widget").hide();
            $ionicModal.fromTemplateUrl('templates/tab-addressedittemplate.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show().then(function () {
                $("#localize-widget").hide();
document.getElementById('fullAddress').value = $scope.healthInfoModel.address;
            if($rootScope.userRoleDescription === 'User' && $rootScope.hasRequiredFields != true){
                $scope.route = $rootScope.userline1;
                $scope.address2 = $rootScope.userline2;
                $scope.City = $rootScope.usercity;
                $scope.ZipCode = $rootScope.userpostalCode;
                $scope.State = $rootScope.userstateCode;
                $scope.state1 = $rootScope.userstate;
                $scope.Country = $rootScope.usercountryCode;
              }

                    document.getElementById('country').value = $scope.Country;
                    if ($scope.state1 == undefined)
                        $scope.state1 = '';
                    if ($scope.State == undefined)
                        $scope.State = '';
                    $scope.oldfullAddress = document.getElementById('fullAddress').value;
                    $scope.oldroute = document.getElementById('txtPlaces').value;
                    $scope.oldaddress2 = document.getElementById('address2').value;
                    $scope.oldCity = document.getElementById('city').value;
                    $scope.oldZipCode = document.getElementById('zipcode').value;
                    $scope.oldCountry = document.getElementById('country').value;
                    $scope.imageName = 'images/countries/flags/' + $scope.oldCountry + '-32.png';
                    var element = document.getElementById('state1');
                    if (typeof (element) != 'undefined' && element != null) {
                        document.getElementById('state1').value = $scope.state1;
                        $scope.oldstate1 = document.getElementById('state1').value;
                    }
                    var element = document.getElementById('state');
                    if (typeof (element) != 'undefined' && element != null) {
                        document.getElementById('state').value = $scope.State;
                        $scope.oldState = document.getElementById('state').value;
                    }
                    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
                    google.maps.event.addListener(autocomplete, 'place_changed', fillAddress);
                    setTimeout(function () {
                        var container = document.getElementsByClassName('pac-container');
                        container = angular.element(container);
                        container.css('z-index', '5000');
                        container.css('pointer-events', 'auto');
                        container.attr('data-tap-disabled', 'true');
                        container.on('click', function (e) {
                            //input.blur();
                            e.preventDefault();
                            document.getElementById('txtPlaces').blur();
                        });
                    }, 2000);
                    function fillAddress() {
                        var place = autocomplete.getPlace();
                        $scope.$apply(function () {
                            $scope.route = '';
                            $scope.address2 = '';
                            $scope.City = '';
                            $scope.ZipCode = '';
                            $scope.State = '';
                            $scope.state1 = '';
                            $scope.Country = '';
                            $scope.vsPlace = place;
                            for (var k = 0; k < place.address_components.length; k++) {


                                if (place.address_components[k].types.indexOf("street_number") >= 0) {
                                    $scope.street = place.address_components[k].long_name;
                                }
                                if (place.address_components[k].types.indexOf("route") >= 0) {
                                    $scope.route = place.address_components[k].short_name;
                                    if ($scope.street != '' && $scope.street != null && $scope.street != undefined) {
                                        $scope.route = $scope.street + ' ' + $scope.route;
                                    }
                                }
                                if (place.address_components[k].types.indexOf("sublocality_level_1") >= 0) {
                                    $scope.sublocality1 = place.address_components[k].long_name;
                                }
                                if (place.address_components[k].types.indexOf("locality") >= 0) {
                                    $scope.City = place.address_components[k].long_name;
                                }
                                if (place.address_components[k].types.indexOf("administrative_area_level_2") >= 0) {
                                    $scope.district = place.address_components[k].long_name;
                                }
                                if (place.address_components[k].types.indexOf("postal_code") >= 0) {
                                    $scope.ZipCode = Number(place.address_components[k].long_name);
                                }
                                if (place.address_components[k].types.indexOf("administrative_area_level_1") >= 0) {
                                    $scope.State = place.address_components[k].long_name;
                                    $scope.StateCode = place.address_components[k].short_name;
                                }
                                if (place.address_components[k].types.indexOf("country") >= 0) {
                                    $scope.Country = place.address_components[k].short_name;
                                    if ($scope.Country == "US") {
                                        $scope.showCountrySelectBox = true;
                                    } else {
                                        $scope.showCountrySelectBox = false;
                                        $scope.state1 = $scope.State;
                                        $scope.State = '';
                                    }
                                }
                            }
                            document.getElementById('txtPlaces').value = $scope.route;
                            document.getElementById('city').value = $scope.City;
                            document.getElementById('address2').value = '';
                            var element = document.getElementById('state');
                            if (typeof (element) != 'undefined' && element != null)
                                document.getElementById('state').value = $scope.State;
                            var element = document.getElementById('state1');
                            if (typeof (element) != 'undefined' && element != null)
                                document.getElementById('state1').value = $scope.state1;
                            document.getElementById('zipcode').value = $scope.ZipCode;
                            document.getElementById('country').value = $scope.Country;
                            $scope.imageName = 'images/countries/flags/' + $scope.Country + '-32.png';
                            if ($scope.State != '')
                                var state = $scope.StateCode;
                            if ($scope.state1 != '')
                                var state = $scope.state1;
                            var txtPlaces = $scope.route;
                            var city = $scope.City;
                            var zipcode = $scope.ZipCode;
                            var country = $scope.Country;
                            var res = new Object();
                            //res['street'] = $scope.street;
                            res['txtPlaces'] = txtPlaces;
                            res['city'] = city;
                            res['state'] = state;
                            res['zipcode'] = zipcode;
                            res['country'] = country;
                            var fullAddressCombo = '';
                            var c = Object.keys(res).length;
                            var count = 0;
                            for (var i in res) {
                                if (res[i] != ',' && res[i] != ' ,' && res[i] != '' && res[i] != undefined) {
                                    count++;
                                    if (count != c) {
                                        fullAddressCombo = fullAddressCombo + res[i] + ', ';
                                    } else {
                                        fullAddressCombo = fullAddressCombo + res[i];
                                    }
                                }
                            }
                            if (fullAddressCombo.length != 0 && fullAddressCombo != ', ' && fullAddressCombo != ',')
                                document.getElementById('fullAddress').value = fullAddressCombo;
                            if (fullAddressCombo.length == 0 || fullAddressCombo == ', ' || fullAddressCombo == ',')
                                document.getElementById('fullAddress').value = "Please enter address";
                        });
                    } // fillAddress closed
                }); // modal closed
            }); // then closed
        } //addressEditModal closed
    });

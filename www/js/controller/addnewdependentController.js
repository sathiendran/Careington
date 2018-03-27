angular.module('starter.controllers')

    .controller('addnewdependentController', function ($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $timeout, $rootScope, $state, LoginService, $stateParams, $location, $cordovaFileTransfer, $ionicLoading, $ionicScrollDelegate, $ionicModal, $filter, $ionicPopup, $log, $window, $ionicBackdrop) {
        $timeout(function () {
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);

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



        $("#localize-widget").show();


        var localizeCurrent = $('#localize-current').text();

        if (localizeCurrent == "Español") {
            //$scope.AddPicture = "margin-top: -10px;";
            $scope.AddPicture = "margin-top: 0px;";

        }
        else {
            $scope.AddPicture = "margin-top: 0px;";

        }

        $('#localize-langs').click(function () {
            var isLang = $('#localize-langs .activated').text();
            if (isLang == "Español") {
                //  $scope.AddPicture = "margin-top: -10px !important;";
                $("#AddPicture").css("margin-top", "-10px");


            }
            if (isLang == "English") {
                //  $scope.AddPicture = "margin-top: 0px !important;";
                $("#AddPicture").css("margin-top", "0px");

            }
            else {
                //  $scope.AddPicture = "margin-top: 0px !important;";
                $("#AddPicture").css("margin-top", "0px");

            }
        });
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


        $rootScope.adddependent = function () {
            $scope.doGetLocations();
            $rootScope.newDependentImagePath = '';
            $rootScope.addPatientidupdateList = '';
            $rootScope.listOfAddPatientIdentifiers = '';
            $('select').prop('selectedIndex', 0);
            $state.go('tab.addnewdependent');
        }

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
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function () {
                    $rootScope.checkAndChangeMenuIcon();
                }, 300);
            }
        }
        var localizeCurrent = $('#localize-current').text();
        if (localizeCurrent == "Español") {
            $scope.Errorconlength = "width: 96% !important";
        } else {
            $scope.Errorconlength = "width: 93% !important";
        }


        $rootScope.ValidationFunction1 = function ($a) {
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                });
            }
            refresh_close();

            var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent Errorconlength localizejs"> <i class="ion-alert-circled" style="font-size: 22px;"></i> <span class="localizej">' + $a + '!</span> </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';
            $("#notifications-top-center").remove();
            $(".ErrorMessage").append(top);
            refresh_close();
        }

        $scope.hghtunit = false;
        $rootScope.flagdeptmodal = true;
        $rootScope.timezoneDisplay = 'none';
        $scope.heightmodal = function () {
            document.getElementById('hunit').innerHTML = '';
            $ionicModal.fromTemplateUrl('templates/tab-heighttemplate.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function (modal) {
                var hghtinval = $('#heightdep').val();
                $scope.modal = modal;
                $scope.modal.show().then(function () {
                    $rootScope.flagdeptmodal = false;
                    if (hghtinval === "") {
                        $('#deptheight').val("");
                        $('#deptheight2').val("");
                        document.getElementById('heightunitval').selectedIndex = 0;
                        $scope.hfeet = true;
                        $scope.hinch = true;
                        $scope.hmeter = true;
                        $scope.hcmeter = true;
                    }
                    else {
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
                        } else if (units === "m") {
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

                $timeout(function () {
                    //  $scope.modal.remove()
                    $('option').filter(function () {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                }, 100);
            });

        }
        $rootScope.removemodal = function () {
            $rootScope.flagdeptmodal = true;
            $('#deptheight').val("");
            $('#deptheight2').val("");
            $scope.modal.remove()
                .then(function () {
                    $scope.modal = null;
                });

            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
            $('#heightdep').val('');
            $("#deptheight").val('');
            $('#depheight2').val('');
        };

        $scope.getOnlyNumbers = function (text) {
            var newStr = text.replace(/[^0-9.]/g, "");
            return newStr;
        }
        $scope.addNewDependent = {};
        console.log($rootScope.primaryPatientDetails);
        $scope.addNewDependent.homeadd = $rootScope.primaryPatientDetails[0].address;
        /*$scope.addNewDependent.homeadd = ($rootScope.primaryPatientDetails[0].address =='') ? $rootScope.primaryPatientDetails[0].addressObject : $rootScope.primaryPatientDetails[0].address ;
          $scope.route = $rootScope.primaryPatientDetails[0].addressObject.line1;
               $scope.address2 = $rootScope.primaryPatientDetails[0].addressObject.line2;
               $scope.City = $rootScope.primaryPatientDetails[0].addressObject.city;
               $scope.ZipCode = $rootScope.primaryPatientDetails[0].addressObject.postalCode;
               $scope.State = $rootScope.primaryPatientDetails[0].addressObject.state;
               $scope.state1 = $rootScope.primaryPatientDetails[0].addressObject.state;
               $scope.Country = $rootScope.primaryPatientDetails[0].addressObject.countryCode;*/
        // $scope.addNewDependent.homeadd = $rootScope.primaryPatientDetails[0].addresses[0].addressText;
        // alert("addNewDependent.homeadd " + $scope.addNewDependent.homeadd);
        var newUploadedPhoto;

        $('input').blur(function () {
            $(this).val(
                $.trim($(this).val())
            );
        });



        var countUp = function () {
            $scope.tempfooter = true;
            $scope.permfooter = true;
        }
        $timeout(countUp, 3000);
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
        $scope.hfeet = true;
        $scope.hinch = true;
        $scope.hmeter = true;
        $scope.hcmeter = true;

        $scope.ngBlur = function () {
            $rootScope.doddate = $('#dob').val();
            $rootScope.restage = getAge($rootScope.doddate);
            if ($rootScope.restage >= 12) {

                $rootScope.emailDisplay = 'flex';
                //    $rootScope.timezoneDisplay = 'flex';
            } else {
                $rootScope.emailDisplay = 'none';
                $rootScope.timezoneDisplay = 'none';

            }
        }

        $scope.depheight1 = function () {
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
        $scope.height1len = function () {
            var max = 10;
            var heightvallen = $('#deptheight').val().length;
            if (heightvallen > 2) {
                $("#deptheight").val(max);
            }
        }
        $scope.depheight2 = function () {
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
        $scope.height2len = function () {
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
        $scope.unitchange = function () {
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

        $scope.weightunitchange = function () {
            var maxweight = 999;
            var weightval = $('#weight').val();
            if (weightval > maxweight) {
                $("#weight").val(maxweight);
            }
        }
        $scope.weight1len = function () {
            var maxweight = 999;
            var weightvallen = $('#weight').val().length;
            var wghtparse = $('#weight').val();
            var weightparse = parseInt(wghtparse);
            if (weightvallen > 3) {
                $("#weight").val(maxweight);
            } else if (weightparse === 0) {
                $('#weight').val('')
                $scope.ErrorMessage = "Please enter valid Weight";
                $rootScope.Validation($scope.ErrorMessage);
            }
        }

        $scope.heightsave = function () {
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
                $scope.ErrorMessage = "Please enter min value 0 in required field";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else if ($rootScope.height2 == 0 && $rootScope.height1 == 0) {
                $scope.ErrorMessage = "Please enter valid height";
                $rootScope.ValidationFunction1($scope.ErrorMessage);
            } else {
                $rootScope.flagdeptmodal = true;
                $scope.modal.remove()
                    .then(function () {
                        $scope.modal = null;
                    });
            }
            $('option').filter(function () {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }

        $scope.phoneBlur = function () {
            $scope.phonelength = $("#homephone").val().length;
            var phonevalue = $("#homephone").val();
            if (phonevalue !== '') {
                if ($scope.phonelength < 14) {
                    $scope.ErrorMessage = "Please enter valid Home Phone Number";
                    $rootScope.Validation($scope.ErrorMessage);
                }
            }
        }
        $scope.ValidateEmail = function (email) {
            var expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(email);
        };
        $scope.emailBlur = function () {
            var emailvalue = $('#email').val();
            if (emailvalue !== '') {
                if (!$scope.ValidateEmail($("#email").val())) {
                    $scope.ErrorMessage = "Please enter a valid Email Address";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                $rootScope.timezoneDisplay = 'flex';
            }
        }
        $scope.depemail = function () {
            var emailtestvalue = $('#email').val();
            if (emailtestvalue !== '') {

                $rootScope.timezoneDisplay = 'flex';
            }
            if (emailtestvalue == '') {
                $rootScope.timezoneDisplay = 'none';
            }
        }

        window.addEventListener('native.keyboardshow', function () {
            $scope.$apply(function () {
                $("#localize-widget").hide();
            });

        })
        window.addEventListener('native.keyboardhide', function () {
            $scope.$apply(function () {
                $("#localize-widget").show();
            });
        });
        
        $scope.isDisabled = false;

        $scope.postDependentDetails = function () {
            $rootScope.listOfAddPatientIdentifiers = [];
            $scope.newupdatePatientDetails();

            if ($rootScope.fullAddressObj == '' || $rootScope.fullAddressObj == undefined) {
                var res = new Object();
                res['city'] = $rootScope.addressInfoFetch[0].addressObject.city;
                res['country'] = $rootScope.addressInfoFetch[0].addressObject.country;
                res['countryCode'] = $rootScope.addressInfoFetch[0].addressObject.countryCode;
                res['line1'] = $rootScope.addressInfoFetch[0].addressObject.line1;
                res['line2'] = $rootScope.addressInfoFetch[0].addressObject.line2;
                res['postalCode'] = $rootScope.addressInfoFetch[0].addressObject.postalCode;
                res['state'] = $rootScope.addressInfoFetch[0].addressObject.state;
                res['stateCode'] = $rootScope.addressInfoFetch[0].addressObject.stateCode;
                $rootScope.fullAddressObj = res;
            }

            $scope.firstName = $("#firstname").val();
            $scope.lastName = $("#lastname").val();
            $scope.email = $("#email").val();
            $scope.dob = $("#dob").val();
            $scope.relation = $("#dependentrelation").val();
            var splitheight = $('#heightdep').val();
            $scope.splitheights = $('#heightdep').val();
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
            $scope.homeaddressObj = $rootScope.fullAddressObj;

            $scope.txtPlacesVal = $scope.route;
            $scope.cityVal = $scope.City;
            $scope.state1Val = $scope.state1;
            $scope.stateVal = $scope.State;
            $scope.zipcodeVal = $scope.ZipCode;
            $scope.countryVal = $scope.Country;

            if ($rootScope.OrganizationLocation === 'on') {
                //  var org = document.getElementById("organization");
                //var loc = document.getElementById("location");
                var org = $("#organization option:selected").val();
                var loc = $("#location option:selected").val();

                if (org === "" || org === "Choose Organization") {
                    $scope.organization = null;
                    $scope.orgid = null;
                } else {
                    /*  var dependentorgan = org.options[org.selectedIndex].text;
                      $scope.organization = dependentorgan;
                      $scope.orgid = org.options[org.selectedIndex].value;*/
                    var dependentorgan = $("#organization option:selected").text();
                    $scope.organization = dependentorgan;
                    $scope.orgid = $("#organization option:selected").val();
                }
                if (loc === "" || loc === "Choose Location") {
                    $scope.location = null;
                    $scope.locationid = null;
                } else {
                    var dependentloc = $("#location option:selected").text();
                    $scope.location = dependentloc;
                    $scope.locationid = loc;

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
            $scope.total_patients = $rootScope.listOfAddPatientIdentifiers.length;
            var identifierTypeCode_ = '', span_Text = '';
            for (i = 1; i <= $scope.total_patients; i++) {
                if (typeof $rootScope.addPatientidupdateList !== 'undefined' && $rootScope.addPatientidupdateList !== '') {
                    $scope.patvalue = $('#patval_' + i).val();
                }
                if (typeof $scope.patvalue === 'undefined' || $scope.patvalue === '') {
                    identifierTypeCode_ = document.getElementById("pattext_" + i).innerText;
                    //  identifierTypeCode_ = $('#identifierTypeCode_'+i).val();
                    break;
                }
            }

            $rootScope.doddate = $('#dob').val();
            $rootScope.restage = getAge($scope.dob);
            var selectedDate = document.getElementById('dob').value;
            var now = new Date();
            var dt1 = Date.parse(now),
                dt2 = Date.parse(selectedDate);
            if ($rootScope.restage >= 12) {
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
                }
                else if (typeof $scope.gender === 'undefined' || $scope.gender === '') {
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
                } else if ($scope.email !== '' && $scope.dependentTimezone === '') {
                    $scope.ErrorMessage = "Please select Timezone";
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
                }

                else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                //   else if (typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) {
                else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
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
                    if (typeof $scope.height2 === 'undefined' || $scope.height2 === '') {
                        $scope.height2 = "0";
                    }
                    if ($scope.firstName.length <= 24 && $scope.lastName.length <= 24) {
                        debugger;
                        $scope.doPostNewDependentuser();
                    } else {
                        debugger
                        $scope.ErrorMessage = 'Max length for first / last name is 24';
                        $rootScope.Validation($scope.ErrorMessage);
                    }
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
                }
                else if (typeof $scope.txtPlacesVal === 'undefined' || $scope.txtPlacesVal === '' || $scope.txtPlacesVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                else if (typeof $scope.cityVal === 'undefined' || $scope.cityValVal === '' || $scope.cityValVal === null) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
                }
                //  else if (typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) {
                else if ((typeof $scope.state1Val === 'undefined' || $scope.state1Val === '' || $scope.state1Val === null) && (typeof $scope.stateVal === 'undefined' || $scope.stateVal === '' || $scope.stateVal === null)) {
                    $scope.ErrorMessage = "Home address is incomplete, please review the address to continue";
                    $rootScope.Validation($scope.ErrorMessage);
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
                    if ($scope.firstName.length <= 24 && $scope.lastName.length <= 24) {
                        $scope.doPostNewDependentuser();
                        debugger;
                    } else {
                        debugger
                        $scope.ErrorMessage = 'Max length for first / last name is 24';
                        $rootScope.Validation($scope.ErrorMessage);
                    }

                }
            }
        }
        $scope.doPostNewDependentuser = function () {
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
                    //address: $scope.homeaddress,
                    address: '',
                    //addressObject: $scope.homeaddressObj,
                    addressObject: $rootScope.fullAddressObj,
                    profileImagePath: $rootScope.newDependentImagePath,
                    height: $scope.height + "|" + $scope.height2,
                    weight: $scope.weight,
                    heightUnit: $scope.getHeightunit,
                    weightUnit: $scope.getWeightunit,
                    organization: $scope.organization,
                    location: $scope.location,
                    organizationId: $scope.orgid,
                    locationId: $scope.locationid,
                    country: $scope.dependentCountry,
                    identifiers: $rootScope.listOfAddPatientIdentifiers
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

                success: function (data) {
                    $('#dependentuserform')[0].reset();
                    var updatepatientdetail = data.data;
                    $rootScope.addPatientidupdateList = [];
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
                error: function (data, status) {
                    $scope.isDisabled = false;
                    $('select option').filter(function () {
                        return this.value.indexOf('?') >= 0;
                    }).remove();
                    if (data.status === 400) {
                        //$scope.ErrorMessage = data.statusText;
                        debugger
                        $scope.ErrorMessage = 'Email ID Already Registered';
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
            LoginService.postNewDependentuser(params);
        }

        $scope.doChkAddressForReg = function (homeaddress) {
            var params = {
                AddressText: homeaddress,
                HospitalId: $rootScope.hospitalId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    if (data.data[0].isAvailable === true) {
                        $scope.ErrorMessage = "Email ID Already Registered";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        $scope.ErrorMessage = "Patient Registration is not allowed for this address";
                        $rootScope.Validation($scope.ErrorMessage);
                    }
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.chkAddressForReg(params);
        }
        $scope.updateDependentRelation = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                patientId: $rootScope.deppatientId,
                RelationCodeId: $rootScope.getRelationId,
                IsAuthorized: "Y", //healthInfoAuthorize,
                success: function () {
                    $('#dependentuserform')[0].reset();
                    $('select').prop('selectedIndex', 0);
                    if ($rootScope.newDependentImagePath !== '' && typeof $rootScope.newDependentImagePath !== 'undefined') {
                        $scope.uploadPhotoForDependant();
                    } else {
                        $state.go('tab.relatedusers');
                    }
                },
                error: function (data, status) {
                    if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.updateDependentsAuthorize(params);
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
                        $scope.ErrorMessage = "A verification email has been sent to the user";
                        $rootScope.Validation($scope.ErrorMessage);
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

        $scope.doGetPatientIdList = function () {
            $rootScope.currentPatientIDlist = '';
            $rootScope.CurPatientidCount = '';
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.currentPatientIDlist = data.data;
                    $rootScope.CurPatientidCount = $rootScope.currentPatientIDlist.length;
                    $scope.data.searchProvider = '';
                    angular.forEach($rootScope.currentPatientIDlist, function (value, key2) {
                        value.checked = false;
                    });
                    if (typeof $rootScope.addPatientidupdateList !== 'undefined' && $rootScope.addPatientidupdateList != 0 && $rootScope.addPatientidupdateList != '') {
                        $scope.clearSelectionAndRebindpatapiSelectionList($rootScope.addPatientidupdateList, $rootScope.currentPatientIDlist);
                        $scope.addCheckedpatientdet = $rootScope.addPatientidupdateList.length;
                    } else {
                        $scope.addCheckedpatientdet = 0;
                    }

                    $ionicModal.fromTemplateUrl('templates/tab-addNewPatientId.html', {
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
            var users = $rootScope.currentPatientIDlist;
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
        function iterateAlphabet() {
            var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
            var numbers = new Array();
            for (var i = 0; i < str.length; i++) {
                var nextChar = str.charAt(i);
                numbers.push(nextChar);
            }
            return numbers;
        }

        $scope.newupdatePatientDetails = function () {
            var patIndentifierDetailsArray = $("input[name^='patIndentifierDetails']");
            var patIndentifierDetailsLength = $("input[name^= 'patIndentifierDetails']").length;
            var patIdentValue = $("input[id^='patval']");

            for (i = 0; i < patIndentifierDetailsLength; i++) {
                var patIndentifierArray = patIndentifierDetailsArray[i].value;
                var patIndentifierSingleArrayDetails = (patIndentifierDetailsArray[i].value).split(',');
                if (patIndentifierSingleArrayDetails[2] === '') {
                    patIndentifierSingleArrayDetails[2] = new Date();
                }

                var patIdentValue_New = $('#patval_' + (i + 1)).val();
                if (patIdentValue_New !== patIdentValue[i].value) {
                    patIdentValue[i].value = patIdentValue_New;
                }
                $rootScope.listOfAddPatientIdentifiers.push({
                    effectiveDate: patIndentifierSingleArrayDetails[2],
                    identifierTypeCode: patIndentifierSingleArrayDetails[0],
                    identifierTypeTitle: patIndentifierSingleArrayDetails[1],
                    statusCode: patIndentifierSingleArrayDetails[3],
                    value: patIdentValue_New
                    // value : patIdentValue[i].value
                });
            }
        }

        $scope.OnSelectPatientdet = function (currentpatientdet) {
            if (currentpatientdet.checked === true) {
                $scope.addCheckedpatientdet++;

            } else {
                $scope.addCheckedpatientdet--;
                currentpatientdet.checked === false;
            }

            if ($scope.addCheckedpatientdet === 4) {
                $scope.addCheckedpatientdet--;
                $scope.patientdone();
            }
            if ($scope.addCheckedpatientdet >= 4) {
                currentpatientdet.checked === false;
                $scope.modal.remove();
            }
            $ionicScrollDelegate.scrollTop(true);
        }
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
                            if (value1.display === value2.display) {
                                value2.checked = true;
                                value2.value = value1.value;
                                value2.createdDate = value1.createdDate;
                                value2.identifierTypeCode = value1.identifierTypeCode;
                                value2.display = value1.display;
                                value2.statusCode = value1.statusCode;
                            }
                        });
                    });
                }
            }
        };

        $scope.removePatientIdmodal = function () {
            //  $rootScope.addPatientidupdateList = $rootScope.PatientIdentifiers;
            $rootScope.viewAddpatapiDisplay = 'flex';
            $scope.modal.remove();
        };

        $scope.patientdone = function () {


            if ($rootScope.addPatientidupdateList.length == 0) {
                //console.log(" Length is 0 =");
                $rootScope.addPatientidupdateList = [];
            }

            $scope.PatientsearchItem = $filter('filter')($rootScope.currentPatientIDlist, {
                checked: true
            });
            if ($scope.PatientsearchItem !== '') {
                // $rootScope.PatientIdentifiers = [];
                $rootScope.patientmedicationsSearch = $scope.PatientsearchItem;
                $rootScope.PatientsdetCount = $scope.PatientsearchItem.length;

                if ($rootScope.PatientsdetCount == 0) {
                    $rootScope.addPatientidupdateList = [];
                }

                for (var i = 0; i < $rootScope.PatientsdetCount; i++) {

                    var status1 = "New";
                    for (var j = 0; j < $rootScope.addPatientidupdateList.length; j++) {
                        if ($scope.PatientsearchItem[i].display == $scope.addPatientidupdateList[j].display) {
                            status1 = "Exit";
                        }
                    }
                    if (status1 == "New") {
                        $rootScope.addPatientidupdateList.push({
                            identifierTypeCode: $scope.PatientsearchItem[i].identifierTypeCode,
                            display: $scope.PatientsearchItem[i].display,
                            value: $scope.PatientsearchItem[i].value,
                            createdDate: $scope.PatientsearchItem[i].createdDate,
                            statusCode: $scope.PatientsearchItem[i].statusCode
                        });
                    }

                }

                for (var k = 0; k < $rootScope.addPatientidupdateList.length; k++) {
                    var status2 = "New";
                    for (var l = 0; l < $rootScope.PatientsdetCount; l++) {
                        if ($scope.addPatientidupdateList[k].display == $scope.PatientsearchItem[l].display) {
                            status2 = "Exit";
                        }
                    }
                    if (status2 == "New") {
                        $rootScope.addPatientidupdateList.splice(k, 1);
                        k = k - 1;
                    }
                }



                // $rootScope.PatientIdentifiers = $rootScope.PatientidupdateList;

                $scope.modal.remove();
                $rootScope.viewAddpatapiDisplay = 'flex';
                //$ionicScrollDelegate.$getByHandle('small').scrollTop();
                if ($rootScope.PatientsdetCount == 0) {
                    $timeout(function () {
                        $ionicScrollDelegate.scrollTop(true);
                    }, 300);
                } else {
                    $timeout(function () {
                        $ionicScrollDelegate.scrollBottom(true);
                    }, 300);
                }
              
            }
           

        }

        $scope.canceldependent = function () {
            $ionicScrollDelegate.$getByHandle('isScroll').scrollTop();
            $('#dependentuserform')[0].reset();
            $('select').prop('selectedIndex', 0);
            history.back();
            if (!$scope.$$phase)
                $scope.$apply();

        }

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

        $scope.$watch('addNewDependent.healthInfoOrganization', function (newVal) {
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

        $scope.$watch('addNewDependent.healthInfoCountry', function (newVal) {
            if (!angular.isUndefined(newVal) && newVal !== '') {
                $scope.depCurrntCountryCode = $rootScope.serviceCountries.filter(function (r) { var show = r.code == newVal; return show; });
                $scope.addNewDependent.healthInfoCountryCode = $scope.depCurrntCountryCode[0].code;
                if ($scope.addNewDependent.healthInfoCountryCode.length == 6 || $scope.addNewDependent.healthInfoCountryCode.length == 5) {
                    $("#health_width").css("width", "62px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 4) {
                    $("#health_width").css("width", "45px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 3) {
                    $("#health_width").css("width", "36px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 2) {
                    $("#health_width").css("width", "24px");
                }
            } else {
                //  $scope.addNewDependent.healthInfoCountryCode = '+1';
                $scope.addNewDependent.healthInfoCountryCode = $rootScope.primaryPatientDetails[0].countryCode;
                if ($scope.addNewDependent.healthInfoCountryCode.length == 6 || $scope.addNewDependent.healthInfoCountryCode.length == 5) {
                    $("#health_width").css("width", "62px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 4) {
                    $("#health_width").css("width", "45px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 3) {
                    $("#health_width").css("width", "36px");
                }
                else if ($scope.addNewDependent.healthInfoCountryCode.length == 2) {
                    $("#health_width").css("width", "24px");
                }
            }
        });
        //Function to open ActionSheet when clicking Camera Button
        //================================================================================================================
        var options;
        $scope.showCameraActions = function () {
            options = {
                'buttonLabels': ['Take Photo', 'Choose Photo From Gallery'],
                'addCancelButtonWithLabel': 'Cancel',
            };
            window.plugins.actionsheet.show(options, cameraActionCallback);
        }
        $scope.uploadPhotoForDependant = function () {
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
            $cordovaFileTransfer.upload(fileUploadUrl, targetPath, options).then(function (result) {
                var getImageURLFromResponse = angular.fromJson(result.response);
                $rootScope.newDependentImagePath = getImageURLFromResponse.data[0].uri;
                $ionicLoading.hide();
                $state.go('tab.relatedusers');
            }, function () {
                $ionicLoading.hide();
                navigator.notification.alert($rootScope.alertupload, null, $rootScope.alertMsgName, $rootScope.alertokay);
                $state.go('tab.relatedusers');
            }, function () {
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
                    //saveToPhotoAlbum: saveToPhotoAlbumFlag,
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
        function onCameraCaptureFailure() { }

        $rootScope.editremovemodal = function () {
            $("#localize-widget").show();
            $scope.modal.remove()
                .then(function () {
                    $scope.addNewDependent.homeadd = $scope.oldfullAddress;
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

        /*$scope.doGetCountries = function() {
          var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
                    $scope.CountryList = data;
                    console.log($scope.CountryList);
              },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getCountriesList(params);
      }

        $scope.getStatesForUS = function(){
            var params = {
                accessToken : $rootScope.accessToken,
                success:function(data){
                        $scope.usStates = data;
                },
                error:function(data,status){
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if(status === 503) {
                      $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getStatesForUS(params);
        }*/

        $rootScope.ValidationReg = function ($a) {
            $('.ContinueAddressBtn').css({ 'display': 'none' });
            $('.CancelAddressBtn').css({'display':'none'});
            function refresh_close() {
                $('.close').click(function () {
                    $(this).parent().fadeOut(200);
                    setTimeout(function () {
                        $('.ContinueAddressBtn').css({ 'display': 'block' });
                        $('.CancelAddressBtn').css({'display':'block'});
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
            $scope.addNewDependent.homeadd = document.getElementById('fullAddress').value;

            $scope.countryValue = document.getElementById('country').value;
            if ($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country') {
                $scope.ErrorMessage = "Please select Country";
                $rootScope.ValidationReg($scope.ErrorMessage);
            } else if ($scope.countryValue == 'Select Country') {
                $scope.ErrorMessage = "Please select Country";
                $rootScope.ValidationReg($scope.ErrorMessage);
            } else {
                $('.ContinueAddressBtn').css({ 'display': 'block' });
                $('.CancelAddressBtn').css({'display':'block'});
            }

            var stateObj = '';
            var countryFetch = '';
            var countryCodeFetch = '';
            var stateCodeFetch = '';
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

            $rootScope.fullAddressObj = res;
            //console.log($rootScope.fullAddressObj);
            if ($scope.countryValue == '' || $scope.countryValue == null || $scope.countryValue == 'Select Country') {

            } else {

                $scope.modal.remove()
                    .then(function () {
                        $scope.modal = null;
                    });
            }
        }

        $scope.changeCountry = function () {
            var country = document.getElementById('country').value;
            if (country == 'Select Country') {
                $scope.imageName = '';
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
                // document.getElementById('fullAddress').value = "Please enter address";
                document.getElementById('fullAddress').value = $rootScope.defaultAddressText;
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

        /*  $scope.route = $rootScope.primaryPatientDetails[0].addressObject.line1;
          $scope.address2 = $rootScope.primaryPatientDetails[0].addressObject.line2;
          $scope.City = $rootScope.primaryPatientDetails[0].addressObject.city;
          $scope.ZipCode = $rootScope.primaryPatientDetails[0].addressObject.postalCode;
          $scope.State = $rootScope.primaryPatientDetails[0].addressObject.state;
          $scope.state1 = $rootScope.primaryPatientDetails[0].addressObject.state;
          $scope.Country = $rootScope.primaryPatientDetails[0].addressObject.countryCode;*/

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
                    document.getElementById('fullAddress').value = $scope.addNewDependent.homeadd;
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
                                /*
                                if(place.address_components[k].types.indexOf("route") >= 0){
                                    $scope.route = place.address_components[k].short_name;
                                }*/
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
                                // document.getElementById('fullAddress').value = "Please enter address";
                                document.getElementById('fullAddress').value = $rootScope.defaultAddressText;

                        });
                    } // fillAddress closed
                }); // modal closed
            }); // then closed
        } //addressEditModal closed
    });

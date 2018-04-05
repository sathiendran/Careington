angular.module('starter.controllers')


    .controller('appoimentDetailsCtrl', function ($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar) {
        // $('link[src="css/styles.v3.less.dynamic.css"]').remove();
        //     $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        //venkat start
        if ($rootScope.is_iPadDeviceWidth <= 360) {
            $('.apponitmentdate').attr('style', 'width: 100% !important; font-size: 22px !important;margin-top: 10px !important;');
        } else {
            $('.apponitmentdate').attr('style', 'width: 115% !important; padding-right: 15%; margin-top: 20px !important;');
        }

        // var enDay = {Monday:"lunes", Tuesday:"martes", Wednesday:"miércoles", Thursday:"jueves", Friday:"viernes", Saturday:"sábado", Sunday:"domingo"};
        // var spDay = {lunes:"Monday", martes:"Tuesday", miércoles:"Wednesday", jueves:"Thursday", viernes:"Friday", sábado:"Saturday", domingo:"Sunday"};
        // var enMonth = {January:"enero", February:"febrero", March:"marzo", April:"abril",May:"Mayo", June:"junio", July:"julio", August:"agosto", September:"septiembre",October:"octubre", November:"noviembre", December:"diciembre"};
        // var spMonth = {enero:"January", febrero:"February", marzo:"March", abril:"April",Mayo:"May", junio:"June", julio:"July", agosto:"August", septiembre:"September",octubre:"October", noviembre:"November", diciembre:"December"};
        //
        //
        $scope.isEnable = true;
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


        //    $('#localize-langs').click(function() {
        //           var isLang = $('#localize-langs .activated').text();
        //           var apponitmentWeek = $(".apponitmentWeek").text();
        //           var apponitmentMonth = $(".apponitmentMonth").text();
        //
        //
        //
        //           if(isLang == "Español") {
        //                 $(".apponitmentWeek").text(enDay[apponitmentWeek]);
        //                 $(".apponitmentMonth").text(enMonth[apponitmentMonth]);
        //
        //
        //               }
        //         else
        //         {
        //                 $(".apponitmentWeek").text(spDay[apponitmentWeek]);
        //                 $(".apponitmentMonth").text(spMonth[apponitmentMonth]);
        //
        //               }
        //
        // });
        //venkat end
        $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
        $("#localize-widget").show();
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
                if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block') {
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
        };

        $scope.addMinutes = function (inDate, inMinutes) {
            var newdate = new Date();
            newdate.setTime(inDate.getTime() + inMinutes * 60000);
            return newdate;
        }

        $rootScope.doGetAppointmentConsultationId = function (appointmentId, personId) {
            var params = {
                accessToken: $rootScope.accessToken,
                AppointmentId: appointmentId,
                personID: personId,
                success: function (data) {
                    $rootScope.consultationId = data.data[0].consultationId;
                    $rootScope.SSPage = false;
                    $rootScope.doCheckExistingConsulatationStatus('tab.appoimentDetails');
                    //    $rootScope.appointmentDisplay = "test";
                    //  $scope.$root.$broadcast("callAppointmentConsultation");
                },
                error: function (data) {
                    if (data.statusText.indexOf("has expired") != -1) {
                        $rootScope.timeNew = 'none';
                        $rootScope.timeNew1 = 'none';
                        $('.AvailableIn').hide();
                        $('.enterAppoinment').hide();
                        $('.enterAppoinment2').show();
                        $(".enterAppoinment2").css("display", "block");
                        $scope.ErrorMessage = "This appointment has expired. Please create a new appointment if you still need care!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else {
                        if (data === 'null') {
                            $scope.ErrorMessage = "Internet connection not available, Try again later!";
                            $rootScope.Validation($scope.ErrorMessage);
                        } else {
                            $rootScope.serverErrorMessageValidation();
                        }
                    }
                }
            };
            LoginService.postGetConsultationId(params);
        }

        $scope.enterWaitingRoom = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, appointmentId, appointPersonId) {
            $rootScope.PatientImageSelectUser = P_img;
            $rootScope.PatientFirstName = P_Fname;
            $rootScope.PatientLastName = P_Lname;
            $rootScope.PatientAge = P_Age;
            $scope.schedulePatAgeChange = new Date(P_Age);
            $rootScope.schedulePatAge = getAge($scope.schedulePatAgeChange);
            $rootScope.appointPatientGuardian = P_Guardian;
            $rootScope.appointmentsPage = true;
            $(".overlay").css({ "display": "none" });
            $rootScope.doGetAppointmentConsultationId(appointmentId, appointPersonId);
        }
        $scope.doGetWaitingRoom = function () {
            $state.go('tab.waitingRoom');
        }


        $scope.showEnterWaitingRoomButton = function () {
            $rootScope.timeNew = 'none';
            $rootScope.timeNew1 = 'block';
            $('.AvailableIn').hide();
            $('.enterAppoinment').show();
        };
        $rootScope.doGetUserTimezone = function () {
            var params = {
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    var userData = {};
                    userData.apiDeveloperId = snap.userSession.apiDeveloperId;
                    userData.apiKey = snap.userSession.apiKey;
                    userData.token = snap.userSession.token;
                    userData.snapLogin = true;
                    userData.timeZoneSystemId = data.message;
                    var userDataJsonData = JSON.stringify(userData);
                    $window.localStorage.setItem('snap_user_session', userDataJsonData);
                    snap.hub.mainHub().register(snap.patient.schedule.patientSelfSchedulingHub(), { dateForListening: new Date(), timeZoneSystemId: userData.timeZoneSystemId });
                    snap.hub.mainHub().start();
                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };

            LoginService.getUserTimezone(params);
        }
       
        $scope.editAppointment = function (scheduledListData, $timeout) {
            $scope.isEnable = false;
            $rootScope.isOpenPage = true;
            var localizeCurrent = $('#localize-current').text();
            if (localizeCurrent == "Español") {
                snap.lanName = 'Spanish';
            } else {
                snap.lanName = 'English';
            }
            $("#localize-widget").hide();
            snap.baseUrl = apiCommonURL;
            setTimeout(function () {
                $scope.betDelay = true;
                $ionicLoading.show({
                    template: '<img src="img/puff.svg" alt="Loading" />',
                    duration: 3000
                });
                if (snap.profileSession === undefined) {
                    snap.userSession = JSON.parse($window.localStorage.getItem("snap_user_session"));
                    snap.profileSession = JSON.parse($window.localStorage.getItem("snap_patientprofile_session"));
                    snap.hospitalSession = JSON.parse($window.localStorage.getItem("snap_hospital_session"));
                    snap.hospitalSettings = JSON.parse($window.localStorage.getItem("snap_hospital_settings"));
                    $rootScope.brandName = snap.hospitalSession.brandName;
                }
                $rootScope.doGetUserTimezone();
                snap.resolveObject("snap.patient.schedule");
                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");
                kendo.bind($("#scd-bdy"), vm);
                kendo.bind($(".header__patient-ss"), headerVM);

                if (vm) {
                    var opt = new snap.patient.schedule.appointmentDialog();
                    opt.openExistedAppointmentDialog(scheduledListData.appointmentId);
                    kendo.bind($("#appointDialog"), opt);
                    vm.load();
                }
                $scope.isEnable = true;
            }, 500);
            $scope.betDelay = false;
            $scope.isEnable = true;
        }

        $scope.doGetAppointPaymentStatus = function () {
            $rootScope.isPaid = '';
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.isPaid = data.isPaid;
                    $scope.doGetConcentToTreat();
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
            LoginService.getAppointPaymentStatus(params);
        }

        $scope.delay = function () {
            $scope.betDelay = true;
            $timeout(function () {
                $scope.betDelay = false;
            }, 5500);
        }


        $scope.doGetSelectedappoimentDetails = function (SSscheduledAppointmentId) {
            //alert("enter");
            //  $rootScope.appointmentId = '';
            //  $rootScope.appointPersonId = '';
            //  $rootScope.AppointScheduleTime = '';
            var params = {
                accessToken: $rootScope.accessToken,
                appointmentId: SSscheduledAppointmentId,
                userTimeZoneId: $rootScope.userTimeZoneId,
                success: function (data) {
                    $rootScope.scheduledListDatas = [];
                    //  snap.hub.mainHub().stop();
                    angular.forEach(data.data, function (index) {
                        $scope.paticipatingPatient = $filter('filter')(angular.fromJson(index.participants), {
                            "participantTypeCode": "1"
                        })[0];
                        var apptdate = index.startTime
                        var dataw = Date.parse(apptdate);
                        var newda = new Date(dataw);
                        var splitmnth = newda.getMonth() + 1;
                        var splitdate = newda.getDate();
                        var splityear = newda.getFullYear();
                        var Aptdate = splityear + "/" + splitmnth + "/" + splitdate;
                        $scope.formatscheduleddate = moment(Aptdate, 'YYYY/MM/DD').format('MMM D');
                        var AppoinmentDateString = formatJSONDateShort(index.startTime);
                        var AppoinmentDate = new Date(AppoinmentDateString);
                        $rootScope.appointmentwaivefee = index.waiveFee;
                        $scope.paticipatingPatientName = $scope.paticipatingPatient.person.name.given + ' ' + $scope.paticipatingPatient.person.name.family;
                        $scope.paticipatingPatientInitial = getInitialForName($scope.paticipatingPatientName);
                        $scope.paticipatingPatientPhoto = $scope.paticipatingPatient.person.photoUrl;
                        $scope.paticipatingPhysician = $filter('filter')(angular.fromJson(index.participants), {
                            "participantTypeCode": "2"
                        })[0];
                        $scope.paticipatingPhysicianName = $scope.paticipatingPhysician.person.name.given + ' ' + $scope.paticipatingPhysician.person.name.family;
                        $scope.paticipatingPhysicianInitial = getInitialForName($scope.paticipatingPhysicianName);
                        $scope.paticipatingPhysicianPhoto = $scope.paticipatingPhysician.person.photoUrl;
                        
                        var AppionmentTimeString =  GetFormattedTimeFromTimeStamp(index.startTime);
                        var AppionmentTimeSplit = AppionmentTimeString.split(' ');

                        $rootScope.scheduledListDatas.push({
                            'scheduledTime': CustomCalendar.getLocalTime1(index.startTime),
                            'scheduledTimelab': AppionmentTimeSplit[0],
                            'scheduledTimeGMT': AppionmentTimeSplit[1],
                            'scheduledTimeDate': AppoinmentDate,
                            'appointmentId': index.appointmentId,
                            'appointmentStatusCode': index.appointmentStatusCode,
                            'appointmentTypeCode': index.appointmentTypeCode,
                            'availabilityBlockId': index.availabilityBlockId,
                            'endTime': index.endTime,
                            'intakeMetadata': angular.fromJson(index.intakeMetadata),
                            'participants': angular.fromJson(index.participants),
                            'patientId': index.patientId,
                            'waiveFee': index.waiveFee,
                            'encounterTypeCode': index.encounterTypeCode,
                            'patientName': $scope.paticipatingPatientName,
                            'patientInitial': $scope.paticipatingPatientInitial,
                            'patientImage': $scope.paticipatingPatientPhoto,
                            'physicianName': $scope.paticipatingPhysicianName,
                            'physicianInitial': $scope.paticipatingPhysicianInitial,
                            'physicianImage': $scope.paticipatingPhysicianPhoto,
                            'scheduledDate': $scope.formatscheduleddate,
                            'patFirstName': $scope.paticipatingPatient.person.name.given,
                            'patLastName': $scope.paticipatingPatient.person.name.family,
                            'phiFirstName': $scope.paticipatingPhysician.person.name.given,
                            'phiLastName': $scope.paticipatingPhysician.person.name.family,
                            'clinicianId': index.clinicianId,
                            'where': index.where
                        });
                       
                    });
                    $rootScope.scheduledListDatas = $rootScope.scheduledListDatas[0];

                    var currentTime = $rootScope.scheduledListDatas.scheduledTime;
                    var getMinsExtraTime = $scope.addMinutes(currentTime, 30);
                    var getEnterTime = new Date();
                    var getMissedAppointmentExpiryTime = ((new Date(getMinsExtraTime).getTime()) - (getEnterTime.getTime()));
                    if (getMissedAppointmentExpiryTime > 0) {
                        $rootScope.AppointScheduleTime = getMissedAppointmentExpiryTime;
                        $('.enterAppoinment2').hide();
                        $(".enterAppoinment2").css("display", "none");
                    } else {
                        $rootScope.AppointScheduleTime = '';
                    }
                    $rootScope.schedulemobile = $rootScope.scheduledListDatas.where;
                    $rootScope.appointPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[0].customCode.description);
                    $rootScope.appointSecondConcern = $rootScope.scheduledListDatas.intakeMetadata.concerns[1];
                    if ($rootScope.appointSecondConcern === '' || typeof $rootScope.appointSecondConcern === 'undefined') {
                        $rootScope.appointSecondConcern = 'None Reported';
                    } else {
                        $rootScope.appointSecondConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.concerns[1].customCode.description);
                    }
                    $rootScope.appointNotes = htmlEscapeValue.getHtmlEscapeValue($rootScope.scheduledListDatas.intakeMetadata.additionalNotes);
                    if ($rootScope.appointNotes === '' || typeof $rootScope.appointNotes === 'undefined') {
                        $rootScope.appointNotes = 'None Reported';
                    } else {
                        $rootScope.appointNotes = $rootScope.scheduledListDatas.intakeMetadata.additionalNotes;
                    }
                    $rootScope.appointmentId = $rootScope.scheduledListDatas.appointmentId;
                    $rootScope.appointPersonId = $rootScope.scheduledListDatas.participants[0].person.id
                    $rootScope.appointmentsPatientDOB = $rootScope.PatientAge;
                    $rootScope.appointmentsPatientId = $rootScope.scheduledListDatas.patientId;
                    $rootScope.assignedDoctorId = $rootScope.scheduledListDatas.clinicianId; //$rootScope.scheduledListDatas.participants[0].person.id;
                    $rootScope.appointmentsPatientGurdianName = htmlEscapeValue.getHtmlEscapeValue($rootScope.primaryPatientFullName);
                    $rootScope.appointmentDisplay = "test";

                    var d = new Date();
                    d.setHours(d.getHours() + 12);
                    //var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                    var currentUserHomeDate = d;
                    /*  $rootScope.individualNextAppointmentDisplay = 'none';
                      $rootScope.individualwithoutAppointmentDisplay = 'block';
                      $rootScope.accountClinicianFooter = 'block';
                      $rootScope.accountStyle = "";
                      $rootScope.userAccContent = "";*/
                    //if ($rootScope.individualScheduledList != '') {
                    var getReplaceTime = $rootScope.scheduledListDatas.scheduledTime;
                    var currentUserHomeDate = currentUserHomeDate;

                    if($rootScope.isOpenPage == true) {
                        $scope.doRefreshAccountdetails($rootScope.scheduledListDatas.appointmentId);
                        $rootScope.isOpenPage = false;
                    }
                   

                    //  if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                    $("#appointNotes").html($rootScope.appointNotes);
                    /*    $rootScope.accountClinicianFooter = 'none';
                        $rootScope.individualNextAppointmentDisplay = 'block';
                       $rootScope.individualwithoutAppointmentDisplay = 'none';
                        $rootScope.accountStyle = "AppointNone" + $rootScope.deviceName;
                        $rootScope.userAccContent = "userAccContent" + $rootScope.deviceName;
                        $rootScope.appointmentsPatientId = $rootScope.patientId;
                        var beforAppointmentTime = getReplaceTime;
                        var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);*/
                    //if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {}
                    //  }
                    //var getReplaceTime = new Date(getReplaceTime1.setMinutes(getReplaceTime1.getMinutes() - 30));
                    if ($rootScope.scheduledListDatas.encounterTypeCode != 4) {
                        var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;
                        var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
                    } else {
                        var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;
                        var getReplaceTime = $scope.addMinutes(getReplaceTime1, -05);
                    }
                    var currentUserHomeDate = currentUserHomeDate;
                    if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                        $scope.$broadcast('timer-stop');
                        $rootScope.time = new Date(getReplaceTime).getTime();

                        $timeout(function () {
                            document.getElementsByTagName('timer')[0].stop();
                            document.getElementsByTagName('timer')[0].start();
                        }, 10);

                        $scope.$on('timer-tick', function (event, args) {
                            if (args.days === 0) {
                                $rootScope.hourDisplay = 'initial';
                                $rootScope.daysDisplay = 'none';
                                $rootScope.dayDisplay = 'none';
                            } else if (args.days === 1) {
                                $rootScope.daysDisplay = 'none';
                                $rootScope.hourDisplay = 'none';
                                $rootScope.dayDisplay = 'initial';
                            } else if (args.days > 1) {
                                $rootScope.daysDisplay = 'initial';
                                $rootScope.hourDisplay = 'none';
                                $rootScope.dayDisplay = 'none';
                            }
                            if (args.minutes === 0 && args.seconds === 1) {
                                $rootScope.timeNew = 'none';
                                $rootScope.timeNew1 = 'block';
                                $rootScope.timerCOlor = '#a2d28a';
                                $('.AvailableIn').hide();
                                $('.enterAppoinment').show();
                            } else if (args.minutes >= 0 && args.seconds > 0) {
                                $rootScope.timeNew = 'block';
                                $rootScope.timeNew1 = 'none';
                                $rootScope.timerCOlor = '#FDD8C5';
                                $('.AvailableIn').show();
                                $('.enterAppoinment').hide();
                            }
                        });
                        
                        $rootScope.time = new Date(getReplaceTime).getTime();
                        var d = new Date();
                        //  var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                        var currentUserHomeDate = d;
                        if ($rootScope.scheduledListDatas.encounterTypeCode === 3 || $rootScope.scheduledListDatas.encounterTypeCode === 4) {
                            if (getReplaceTime < currentUserHomeDate) {
                                $rootScope.timerCOlor = '#a2d28a';
                                $('.AvailableIn').hide();
                                $('.enterAppoinment').show();
                                $rootScope.timeNew = 'none';
                                $rootScope.timeNew1 = 'block';
                            } else {
                                $rootScope.timeNew = 'block';
                                $rootScope.timeNew1 = 'none';
                                $('.AvailableIn').show();
                                $('.enterAppoinment').hide();
                                $rootScope.timerCOlor = '#FDD8C5';
                            }
                        }
                    } else if ((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
                        $rootScope.timerCOlor = 'transparent';
                    }

                    history.length = history.length - 1;
                    $scope.doGetExistingPatientName();
                    $rootScope.doGetDoctorDetails();

                },
                error: function (data, status) {
                    if (status === 0) {
                        $scope.ErrorMessage = "Internet connection not available, Try again later!";
                        $rootScope.Validation($scope.ErrorMessage);
                    } else if (status === 503) {
                        $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                    } else if (status === 401) {
                        $scope.ErrorMessage = "You are not authorized to view this account";
                        $rootScope.Validation($scope.ErrorMessage);

                    } else {
                        $rootScope.serverErrorMessageValidation();
                    }
                }
            };
            LoginService.getSelectedappoimentDetails(params);

            //venkat start
            // var shdTime = $rootScope.scheduledListDatas.scheduledTime;
            //  var shdDay = shdTime.getDay();
            //  var shdMonth = shdTime.getMonth();
            //    console.log("shdTime ="+shdTime);
            //    console.log("shdMonth ="+shdMonth);
            //
            //   var spDay = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
            //   var enDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            //   var spMonth = ["enero", "febrero", "marzo", "abril","Mayo", "junio", "julio", "agosto", "septiembre","octubre", "noviembre", "diciembre"];
            //   var enMonth = ["January", "February", "March", "April","May", "June", "July", "August", "September","October", "November", "December"];
            //
            //   var localizeCurrent = $('#localize-current').text();
            //    if(localizeCurrent == "Español") {
            //          $(".apponitmentWeek").text(spDay[shdDay]);
            //          $(".apponitmentMonth").text(spMonth[shdMonth]);
            //        } else {
            //          $(".apponitmentWeek").text(enDay[shdDay]);
            //          $(".apponitmentMonth").text(enMonth[shdMonth]);
            //        }
            //venkat start


        };

        if ($rootScope.appointmentDisplay === "test") {
            $("#appointNotes").html($rootScope.appointNotes);
            if ($rootScope.scheduledListDatas.encounterTypeCode != 4) {
                var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;
                var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
            } else {
                var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;
                var getReplaceTime = $scope.addMinutes(getReplaceTime1, -05);
            }
            $scope.$broadcast('timer-stop');
            $rootScope.time = new Date(getReplaceTime).getTime();

            $scope.$on('timer-tick', function (event, args) {
                //$timeout(function(){
                if (args.days === 0) {
                    $rootScope.hourDisplay = 'initial';
                    $rootScope.daysDisplay = 'none';
                    $rootScope.dayDisplay = 'none';
                } else if (args.days === 1) {
                    $rootScope.daysDisplay = 'none';
                    $rootScope.hourDisplay = 'none';
                    $rootScope.dayDisplay = 'initial';
                } else if (args.days > 1) {
                    $rootScope.daysDisplay = 'initial';
                    $rootScope.hourDisplay = 'none';
                    $rootScope.dayDisplay = 'none';
                }

                //  if (args.millis < 600) {
                if (args.minutes === 0 && args.seconds === 1) {
                    $rootScope.timeNew = 'none';
                    $rootScope.timeNew1 = 'block';
                    $('.AvailableIn').hide();
                    $('.enterAppoinment').show();
                } else if (args.minutes >= 0 && args.seconds > 0) {
                    $('.AvailableIn').show();
                    $('.enterAppoinment').hide();
                }
            });

        }


        if (typeof $stateParams.getPage != 'undefined') {
            if ($stateParams.getPage.indexOf("webSSAppointUpdate") > -1) {
                $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                if ($rootScope.chkSSPageEnter) {
                    $ionicSideMenuDelegate.toggleLeft();
                    $rootScope.chkSSPageEnter = false;
                }
                $scope.doGetSelectedappoimentDetails(sessionStorage.getItem("SSscheduledAppointmentId"));
            }
        };

        $scope.$on("callAppointmentConsultation", function (event, args) {
            // $scope.doGeAppointmentExistingConsulatation();
            //  $scope.doGetExistingPatientName();
            //  $rootScope.doGetDoctorDetails();
            $state.go('tab.appoimentDetails');
        });

        $scope.doRefreshAccountdetails = function (curntAppointId) {
            //  $rootScope.doGetIndividualScheduledDetails();
            $scope.doGetSelectedappoimentDetails(curntAppointId);
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
            $scope.$apply();
        };

        $scope.doGeAppointmentExistingConsulatation = function () {
            $rootScope.consultionInformation = '';
            //  $rootScope.appointmentsPatientFirstName = '';
            //  $rootScope.appointmentsPatientLastName = '';
            //  $rootScope.appointmentsPatientDOB = '';
            //  $rootScope.appointmentsPatientGurdianName = '';
            //  $rootScope.appointmentsPatientImage = '';
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $scope.existingConsultation = data;
                    $rootScope.consultionInformation = data.data[0].consultationInfo;
                    $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                    if (!angular.isUndefined($rootScope.consultationStatusId)) {
                        if ($rootScope.consultationStatusId === 71) {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(

                                $rootScope.alertconstarted, // message
                                //  'Your consultation is already started on other device.', // message

                                function () {
                                  
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title

                                $rootScope.alertDone // buttonName

                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 72) {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(

                                $rootScope.alertconended, // message

                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title

                                $rootScope.alertDone // buttonName

                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 79) {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(

                                $rootScope.alertconcancel, // message

                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title

                                $rootScope.alertDone // buttonName

                            );
                            return false;
                        } else if ($rootScope.consultationStatusId === 80) {
                            $rootScope.doGetScheduledNowPhoneConsulatation();
                            navigator.notification.alert(

                                $rootScope.alertconprogress, // message

                                function () {
                                    $state.go('tab.userhome');
                                    return;
                                },
                                $rootScope.alertMsgName, // title

                                $rootScope.alertDone // buttonName

                            );
                            return false;
                        }

                    }
                    $rootScope.patientExistInfomation = data.data[0].patientInformation;
                    $rootScope.intakeForm = data.data[0].intakeForm;
                    //  $rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
                    //  $rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
                    //  $rootScope.appointmentsPatientGurdianName = htmlEscapeValue.getHtmlEscapeValue($rootScope.patientExistInfomation.guardianName);
                    //  $rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
                    //$rootScope.appointmentsPatientImage = $rootScope.patientExistInfomation.profileImagePath;
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
            LoginService.getExistingConsulatation(params);
        }

        $scope.doGetExistingPatientName = function () {
            $rootScope.consultionInformation = '';
            $rootScope.appointmentsPatientFirstName = '';
            $rootScope.appointmentsPatientLastName = '';
            //  $rootScope.appointmentsPatientDOB = '';
            $rootScope.appointmentsPatientGurdianName = '';
            $rootScope.appointmentsPatientImage = '';
            var params = {
                patientId: $rootScope.appointmentsPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {

                   

                    // $rootScope.appointmentsPatientFirstName =  data.data[0].patientName;
                    //  $rootScope.appointmentsPatientLastName = data.data[0].lastName;
                    if ($rootScope.scheduledListDatas.patFirstName !== undefined) {
                        $rootScope.appointmentsPatientFirstName = $rootScope.scheduledListDatas.patFirstName;
                        $rootScope.appointmentsPatientLastName = $rootScope.scheduledListDatas.patLastName;
                        $rootScope.appointmentsPatientImage = $rootScope.scheduledListDatas.patientImage;
                        // $rootScope.appointmentsPatientId       = $rootScope.scheduledListDatas.patientId ;
                    } else {
                        $rootScope.appointmentsPatientFirstName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);
                        $rootScope.appointmentsPatientLastName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].lastName);
                        $rootScope.appointmentsPatientImage = data.data[0].profileImagePath;
                    }
                    $("#appointNotes").html($rootScope.appointNotes);

                    // $rootScope.GoToPatientDetails('',   $rootScope.appointmentsPatientImage, $rootScope.appointmentsPatientFirstName, $rootScope.appointmentsPatientLastName, $rootScope.PatientAge, '',  $rootScope.appointmentPatientId, '', '');
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
            LoginService.getPrimaryPatientLastName(params);
        }

        $rootScope.doGetDoctorDetails = function () {
            $rootScope.doctorGender = '';
            $rootScope.scheduledDoctorDetails = [];
            var params = {
                doctorId: $rootScope.assignedDoctorId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    angular.forEach(data.data, function (index) {
                        if (index.gender === 'M') {
                            var docGender = "Male";
                        } else if (index.gender === 'F') {
                            docGender = "Female";
                        }
                        $rootScope.DoctorImage = data.data[0].profileImagePath;
                        $rootScope.scheduledDoctorDetails.push({
                            'dob': index.dob,
                            'firstName': index.firstName,
                            'lastName': index.lastName,
                            'fullName': index.fullName,
                            'gender': docGender,
                            'profileImagePath': $rootScope.DoctorImage
                        });
                    });

                    $state.go('tab.appoimentDetails');
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
            LoginService.getDoctorDetails(params);
        }

        $scope.goTOSchedule = function () {
            //$("#localize-widget").show();
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'css/styles.v3.less.dynamic.css'
            }).appendTo('head');
            //  $state.go('tab.providerSearch', { viewMode : 'all' });
            $state.go('tab.providerSearch');
        }

        $scope.goPreviousPageFromAppointDetails = function () {
            $state.go($rootScope.appointPreviousPage);
        }

        /*if ($rootScope.AppointScheduleTime !== '') {
            setTimeout(function() {
                $rootScope.timeNew = 'none';
                $rootScope.timeNew1 = 'none';
                $('.AvailableIn').hide();
                $('.enterAppoinment').hide();
                $('.enterAppoinment2').show();
                $(".enterAppoinment2").css("display", "block");
            }, $rootScope.AppointScheduleTime);
        } else {
            if($rootScope.scheduledListDatas.encountertypecode !== 2) {
              $rootScope.timeNew = 'none';
              $rootScope.timeNew1 = 'none';
              $('.AvailableIn').hide();
              $('.enterAppoinment').hide();
              $('.enterAppoinment2').show();
              $(".enterAppoinment2").css("display", "block");
           }
        }*/

    })

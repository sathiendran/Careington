angular.module('starter.controllers')
    .controller('consultationController', function($scope, $sanitize, $ionicSideMenuDelegate, $ionicPlatform, $interval, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicPopup, ageFilter, $window, $filter, htmlEscapeValue) {
        $rootScope.couserdetails = false;
        $rootScope.dupcouser = false;
        $("#localize-widget").hide();


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

        //venket
        var localizeCurrent = $('#localize-current').text();
        var myLength = $(".departmentClassVal").text().length;
        console.log("myLength ="+myLength);
         if($( window ).width()<= 375) {
           if(localizeCurrent == "Español") {
            //   console.log("Español");
             $scope.ReportEthnicityVal = "width:36.33%";
           } else {
             $scope.ReportEthnicityVal = "width:41.33%";
           }
           /* if(myLength >= 11) {
            //    console.log("myLength  is more=");
              if(localizeCurrent == "Español") {
            //      console.log("Español");
                  $scope.departmentClass = "height:45px";
              } if(localizeCurrent == "English (UK)") {
                  $scope.departmentClass = "height:25px";
              } if(localizeCurrent == "English") {
                  $scope.departmentClass = "height:25px";
              }
            }*/
             } else {
                 if(localizeCurrent == "Español"){
                   }else{
                   }
             }

               $('#localize-langs').click(function() {
                  ///    console.log("myLength ="+myLength);
                  if($( window ).width()<= 375){
                    var isLang = $('#localize-langs .activated').text();
                    var myLength = $(".departmentClassVal").text().length;
                      //console.log("val ="+$(".departmentClassVal").text());
                      //console.log("myLength ="+myLength);
                    if(isLang == "Español") {
                        //console.log("Español");
                        $scope.ReportEthnicityVal = "width:36.33%";

                    } else {
                      $scope.ReportEthnicityVal = "width:41.33%";
                    }
                    if(myLength >= 11) {
                      //  console.log("myLength  is more=");
                     if(isLang == "Español") {
                         $scope.departmentClass = "height:45px";
                     }

                     else{
                       $scope.departmentClass = "height:25px";
                     }
                   isLang = "";
                }
               }
           });


        angular.element(document).ready(function () {

          //  $("#localize-widget").hide();
        });



        $ionicPlatform.registerBackButtonAction(function() {
            if (($rootScope.currState.$current.name === "tab.userhome") ||
                ($rootScope.currState.$current.name === "tab.addCard") ||
                ($rootScope.currState.$current.name === "tab.submitPayment") ||
                ($rootScope.currState.$current.name === "tab.waitingRoom") ||
                ($rootScope.currState.$current.name === "tab.receipt") ||
                ($rootScope.currState.$current.name === "tab.videoConference") ||
                ($rootScope.currState.$current.name === "tab.connectionLost") ||
                ($rootScope.currState.$current.name === "tab.ReportScreen") ||
                  ($rootScope.currState.$current.name === "tab.reports")
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

       /* var checkAndChangeMenuIcon;
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
            $rootScope.statename = $rootScope.currState.$current.name;
            $ionicSideMenuDelegate.toggleLeft();
            $rootScope.checkAndChangeMenuIcon();
            if (checkAndChangeMenuIcon) {
                $interval.cancel(checkAndChangeMenuIcon);
            }
            if ($rootScope.primaryPatientId === $rootScope.currentPatientDetails[0].account.patientId) {
                if ($rootScope.statename === "tab.consultations") {
                    $('.sidehomeconsult').addClass("uhome");
                }
            }

            if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
                checkAndChangeMenuIcon = $interval(function() {
                    $rootScope.checkAndChangeMenuIcon();
                }, 300);
            }
        };*/
/*$scope.toggleLeft = function() {
        $rootScope.statename = $rootScope.currState.$current.name;
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.checkAndChangeMenuIcon();
        if (checkAndChangeMenuIcon) {
            $interval.cancel(checkAndChangeMenuIcon);
        }
        if ($rootScope.statename === "tab.userhome") {
            $('.sideuserhome').addClass("uhome");

        }
        if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
            checkAndChangeMenuIcon = $interval(function() {
                if ($rootScope.checkAndChangeMenuIcon) {
                    $rootScope.checkAndChangeMenuIcon();
                }
            }, 300);
        }
    };*/
        $scope.pastshow = true;
        $scope.missedshow = false;
        $scope.droppedshow = false;
        $scope.isdiplay = false;
        $scope.showsearch = function() {
            $scope.isdiplay = !$scope.isdiplay;

        }
        $rootScope.patchange = function(){
          $rootScope.doGetPatientProfiles();
            $state.go('tab.userhome');
        }
        $scope.patientchange = function(){
          $rootScope.doGetPatientProfiles();
            $state.go('tab.userhome');
        }
        $rootScope.passedconsult = function() {
            $rootScope.passededconsultants();
            var myEl = angular.element(document.querySelector('#passed'));
            myEl.removeClass('btnextcolor');
            myEl.addClass('btcolor');
            var myEl = angular.element(document.querySelector('#missed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#dropped'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');

            $scope.pastshow = true;
            $scope.missedshow = false;
            $scope.droppedshow = false;
        }

        $rootScope.missedconsult = function() {
            var now = new Date();
            var duedate = new Date(now);
            var stdate = duedate.setDate(now.getDate() - 365);
            var start = new Date(stdate);
            var day = start.getDate();
            var mnth = start.getMonth() + 1;
            var year = start.getFullYear();
            if (mnth < 10) {
                var smonth = "0" + mnth;
            } else {
                 smonth = mnth;
            }
            if (day < 10) {
                var sdate = "0" + day;
            } else {
                 sdate = day;
            }
            $scope.startDate = year + "-" + smonth + "-" + sdate + "T" + "00" + ":" + "00" + ":" + "00.000";

            var eday = now.getDate();
            var emnth = now.getMonth() + 1;
            var eyear = now.getFullYear();
            var time = now.getHours();
            var mints = now.getMinutes();
            var sec = now.getMilliseconds();
            if (emnth < 10) {
                var emonth = "0" + emnth;
            } else {
                var emonth = emnth;
            }
            if (eday < 10) {
                var edate = "0" + eday;
            } else {
                var edate = eday;
            }
            $scope.endDate = eyear + "-" + emonth + "-" + edate + "T" + time + ":" + mints + ":" + sec;

            var params = {

                accessToken: $rootScope.accessToken,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                patientId: $rootScope.patientId,
                appointmentStatusCodes: 1,
                success: function(data) {
                    $scope.Missedconsultations = data.data;
                    $rootScope.missedlist = [];

                    angular.forEach($scope.Missedconsultations, function(item) {
                        var nowDateTime = new Date();
                        var nowDateTimeEightHours = new Date(nowDateTime);
                        nowDateTimeEightHours.setMinutes(nowDateTime.getMinutes() + 15);
                        var todaydatetime = nowDateTimeEightHours.getTime();
                        var patientId = item.patientId;
                        var consultationId = item.consultationId;
                        var edtime = item.endTime;
                        var endtimeEightHours = new Date(edtime);
                        var enddatetime = endtimeEightHours.setMinutes(endtimeEightHours.getMinutes() + 15);
                        if ($rootScope.patientId === patientId) {


                            if (enddatetime < todaydatetime) {
                                var asd = edtime.split('T');
                                var formatted = asd[0];
                                var enddate = moment(formatted, 'YYYY/MM/DD').format('MMM D,YYYY');
                                var astime = asd[1].split('+');
                                var newt = astime[0].split(':');
                                var time = newt[0] + ":" + newt[1];
                                var timeString = time;
                                var hourEnd = timeString.indexOf(":");
                                var H = +timeString.substr(0, hourEnd);
                                var h = H % 12 || 12;
                                var ampm = H < 12 ? "AM" : "PM";
                                timeString = h + timeString.substr(hourEnd, 3) + ampm;
                                var missedtime = timeString;
                                var asds = item.participants;
                                var patientdata = _.where(asds, {
                                    participantTypeCode: 1
                                });
                                var drdata = _.where(asds, {
                                    participantTypeCode: 2
                                });
                                var patimg = patientdata[0].person;
                                var photo = _.pick(patimg, 'photoUrl');
                                var patphoto1 = _.values(photo);
                                var patphoto = patphoto1.join();
                                var intakeMetadata = item.intakeMetadata.concerns;
                                var patientSecondConcern = _.where(intakeMetadata, {
                                    isPrimary: false
                                });

                                if (patientSecondConcern.length > 0) {
                                    var secConcern = patientSecondConcern[0].customCode.description;
                                } else {
                                    var secConcern = 'NA';
                                }
                                if (drdata.length > 0) {
                                    var drlist = drdata[0].person.name;
                                    var nlist = _.pick(drlist, 'given', 'family');
                                    var docname = _.values(nlist);
                                    var missedDocName = docname[0] + " " + docname[1];

                                } else {
                                    var drname = "";
                                }

                                if (patientdata.length > 0) {
                                    var patList = patientdata[0].person.name;
                                    var patListGiven = _.pick(patList, 'given', 'family');
                                    var patName = _.values(patListGiven);
                                    var missedPatName = patName[0] + " " + patName[1];

                                } else {
                                     missedPatName = "";
                                }
                                if (item.intakeMetadata.additionalNotes !== '') {
                                    var additionalNotes = item.intakeMetadata.additionalNotes;
                                } else {
                                     additionalNotes = 'NA';
                                }


                                $rootScope.missedlist.push({
                                    'patphoto': patphoto,
                                    'time': missedtime,
                                    'docname': missedDocName,
                                    'missedPatFirstName': patName[0],
                                    'missedPatLastName': patName[1],
                                    'enddate': enddate,
                                    'consultationId': consultationId,
                                    'startTime': item.startTime,
                                    'additionalNotes': additionalNotes,
                                    'clinicianId': item.clinicianId,
                                    'appointmentId': item.appointmentId,
                                    'priConcern': item.intakeMetadata.concerns[0].customCode.description,
                                    'encounter':item.encounterTypeCode,
                                    'secConcern': secConcern
                                });

                            }
                        }

                    });

                },
                error: function(data,status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $scope.listOfConsultations = 'Error getting List Of Consultations';
                  }
                }
            };
            LoginService.getListOfMissedConsultation(params);

            var myEl = angular.element(document.querySelector('#missed'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#dropped'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.pastshow = false;
            $scope.missedshow = true;
            $scope.droppedshow = false;
        }
        $rootScope.droppedconsult = function() {

          var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                statusId: 81,
                success: function(data) {
                    $rootScope.Droppedconsultations = [];
                    angular.forEach(data.data, function(index) {

                        $rootScope.Droppedconsultations.push({
                            'appointmentId': index.appointmentId,
                            'assignedDoctorFirstName': index.assignedDoctorFirstName,
                            'assignedDoctorId': index.assignedDoctorId,
                            'assignedDoctorLastName': index.assignedDoctorLastName,
                            'assignedDoctorName': index.assignedDoctorName,
                            'consultantUserId': index.consultantUserId,
                            'consultationDate': index.consultationDate,
                            'consultationDuration': index.consultationDuration,
                            'consultationId': index.consultationId,
                            'consultationTime': index.consultationTime,
                            'consultationTimeInfo': index.consultationTimeInfo,
                            'dob': index.dob,
                            'isDependent': index.isDependent,
                            'patientFirstName': index.patientFirstName,
                            'patientId': index.patientId,
                            'patientLastName': index.patientLastName,
                            'patientName': index.patientName,
                            'startedConsultation': index.startedConsultation,
                            'waitingConsultation': index.waitingConsultation,
                            'encountertype':index.encounterTypeCode
                        });
                    });

                },
                error: function(data, status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else{
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };
            LoginService.getListOfDroppedConsultations(params);


            var myEl = angular.element(document.querySelector('#dropped'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#missed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.pastshow = false;
            $scope.missedshow = false;
            $scope.droppedshow = true;
        }
        $scope.consultsearch = function() {
          //  $scope.passededconsultants();
          $("#localize-widget").hide();
            $state.go('tab.consultationSearch');
            $("#localize-widget").hide();
        }



        $rootScope.doGetExistingConsulatationReport = function(consultation, nextPage) {
      /*    console.log("----------doGetExistingConsulatationReport -----------");
          console.log("consultation = "+consultation);
          console.log("nextPage = "+nextPage);*/
            $rootScope.consultationDate = '';
            $rootScope.sysTimeZone = '';
            $rootScope.addNotes = '';
            $rootScope.existingConsultationReport = '';
            $state.go(nextPage);
            var params = {
                consultationId: consultation.consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    console.log(data);
                    $rootScope.attachmentLength = '';
                    $rootScope.existingConsultationReport = data.data[0].details[0];
                    $rootScope.existconsultationparticipants = data.data[0].participants;
                    $rootScope.existconsultationprescriptions = data.data[0].prescriptions;
                    var ageFormat = '';
                    if($rootScope.existingConsultationReport.age.years > 0)
                    {
                      ageFormat += $rootScope.existingConsultationReport.age.years+' y'+' ';
                    }
                    if($rootScope.existingConsultationReport.age.months > 0)
                    {
                       ageFormat += $rootScope.existingConsultationReport.age.months+' m'+' ';
                    }
                    if($rootScope.existingConsultationReport.age.days > 0)
                    {
                      ageFormat += $rootScope.existingConsultationReport.age.days+' d';
                    }
                    $rootScope.existingConsultationReport.ageFormat = ageFormat;

                    if ($rootScope.existingConsultationReport.height !== '' && typeof $rootScope.existingConsultationReport.height !== 'undefined') {
                        if ($rootScope.existingConsultationReport.heightUnit !== '' && typeof $rootScope.existingConsultationReport.heightUnit !== 'undefined') {
                            $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                            var reheight = $rootScope.existingConsultationReport.height.split("|")
                            $rootScope.reportheight1 = reheight[0];
                            $rootScope.reportheight2 = reheight[1];
                            var reheightunit = $rootScope.existingConsultationReport.heightUnit.split("/");
                            $rootScope.reportheightunit1 = reheightunit[0];
                            $rootScope.reportheightunit2 = reheightunit[1];
                        } else {
                            $rootScope.reportHeight = $rootScope.existingConsultationReport.height;
                        }
                    } else {
                        $rootScope.reportHeight = 'N/R';
                    }
                    if ($rootScope.existingConsultationReport.weight !== '' && typeof $rootScope.existingConsultationReport.weight !== 'undefined') {
                        $rootScope.reportWeight = $rootScope.existingConsultationReport.weight;
                        $rootScope.reportWeightunit =  $rootScope.existingConsultationReport.weightUnit;
                    } else {
                        $rootScope.reportWeight = 'N/R';
                    }
                    if($rootScope.existingConsultationReport.note !== '' && typeof $rootScope.existingConsultationReport.note !== 'undefined') {
                      $rootScope.repadditionalnotes = $rootScope.existingConsultationReport.note;
                    }
                    else{
                        $rootScope.repadditionalnotes = 'N/R';
                    }
                    $rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
                    $rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);
                      $rootScope.reportpatientid =htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientId);
                     if ($rootScope.primaryPatientId !== $rootScope.existingConsultationReport.patientId){
                       if ($rootScope.existingConsultationReport.guardianName !== '' && typeof $rootScope.existingConsultationReport.guardianName !== 'undefined') {
                           $rootScope.reportGuardian = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.guardianName);
                       }
                      }


                      if($rootScope.existingConsultationReport.ethnicity !== '' && typeof $rootScope.existingConsultationReport.ethnicity !== 'undefined') {
                        $rootScope.reportethnicity = $rootScope.existingConsultationReport.ethnicity;

                      }else{
                         $rootScope.reportethnicity = 'N/R';
                      }

                      $rootScope.reportservicetype = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.serviceTypeName);
                    if ($rootScope.existingConsultationReport.patientAddress !== '' && typeof $rootScope.existingConsultationReport.patientAddress !== 'undefined') {
                        $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                    } else {
                        $rootScope.reportPatientAddress = 'None Reported';
                    }

                    if (!angular.isUndefined($rootScope.existingConsultationReport.location)) {
                        $rootScope.location = $rootScope.existingConsultationReport.location;
                    } else {
                        $rootScope.location = 'N/R';
                    }

                    if (!angular.isUndefined($rootScope.existingConsultationReport.organization)) {
                        $rootScope.organization = $rootScope.existingConsultationReport.organization;
                    } else {
                        $rootScope.organization = 'N/R';
                    }

                    if ($rootScope.existingConsultationReport.homePhone !== '' && typeof $rootScope.existingConsultationReport.homePhone !== 'undefined') {
                        $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                    } else {
                        $rootScope.reportHomePhone = 'N/R';
                    }

                    if ($rootScope.existingConsultationReport.hospitalAddress !== '' && typeof $rootScope.existingConsultationReport.hospitalAddress !== 'undefined') {
                        $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                    } else {
                        $rootScope.reportHospitalAddress = 'N/R';
                    }

                    if ($rootScope.existingConsultationReport.doctorFirstName !== '' && typeof $rootScope.existingConsultationReport.doctorFirstName !== 'undefined') {
                        $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                    } else {
                        $rootScope.reportDoctorFirstName = 'N/R';
                    }


                    if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                        $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                    } else {
                        $rootScope.reportMedicalSpeciality = '';
                    }

                    if ($rootScope.existingConsultationReport.department !== '' && typeof $rootScope.existingConsultationReport.department !== 'undefined') {
                     $rootScope.providerDepartment =  htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.department);
                  } else {
                      $rootScope.providerDepartment = '';
                  }

                    if ($rootScope.existingConsultationReport.doctorLastName !== '' && typeof $rootScope.existingConsultationReport.doctorLastName !== 'undefined') {
                        $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                    } else {
                    }

                    if ($rootScope.existingConsultationReport.gender !== '' && typeof $rootScope.existingConsultationReport.gender !== 'undefined') {
                        if ($rootScope.existingConsultationReport.gender === 'M') {
                            $rootScope.doctorGender = "Male";
                        } else {
                            $rootScope.doctorGender = "Female";
                        }
                    } else {
                        $rootScope.doctorGender = 'None Reported';
                    }

                      if ($rootScope.existingConsultationReport.brandName !== '' && typeof $rootScope.existingConsultationReport.brandName !== 'undefined') {
                        $rootScope.reportBrandName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.brandName);
                    } else {
                        $rootScope.reportBrandName = 'N/R';
                    }

                    if ($rootScope.existingConsultationReport.encounterTypeCode !== '' && typeof $rootScope.existingConsultationReport.encounterTypeCode !== 'undefined') {
                      $rootScope.encountercode =  $rootScope.existingConsultationReport.encounterTypeCode;
                        if ($rootScope.encountercode == 2) {
                            $rootScope.encountertype = "Phone Consultation";
                            $rootScope.consultationphone = $rootScope.existingConsultationReport.consultationPhoneNumber;
                            if($rootScope.existingConsultationReport.consultationPhoneType == 1){
                              $rootScope.phonetype = "Mobile"
                            }if($rootScope.existingConsultationReport.consultationPhoneType == 2){
                              $rootScope.phonetype = "Home"
                            }if($rootScope.existingConsultationReport.consultationPhoneType == 3){
                              $rootScope.phonetype = "Other"
                            }

                        } else if ($rootScope.encountercode == 3) {
                            $rootScope.encountertype = "Video Consultation";
                        }
                    } else {
                        $rootScope.encountertype = 'None Reported';
                    }


                    if ($rootScope.existingConsultationReport.appointmentType !== '' && typeof $rootScope.existingConsultationReport.appointmentType !== 'undefined') {
                      $rootScope.appointmentcode =  $rootScope.existingConsultationReport.appointmentType;
                        if ($rootScope.appointmentcode == 1) {
                            $rootScope.appointmenttype = "Provider Sche";
                        } else if ($rootScope.appointmentcode == 2) {
                            $rootScope.appointmenttype = "On-Demand";
                        }else if ($rootScope.appointmentcode == 3) {
                            $rootScope.appointmenttype = "Patient Sched";
                        }
                        //venkat
                        var appointmenttypeVal = $rootScope.appointmenttype;
                        var localizeCurrent = $('#localize-current').text();
                          //console.log("localizeCurrent ="+localizeCurrent);
                        //  console.log("myText ="+myText);
                         if($( window ).width()<= 375) {
                           //console.log("myLength  is more="+appointmenttypeVal.length);
                            if(appointmenttypeVal == "Provider Sche" || appointmenttypeVal == "Patient Sched") {
                            //    console.log("myLength  is more="+appointmenttypeVal.length);
                              if(localizeCurrent == "Español") {
                              //    console.log("Español h");
                                  $scope.departmentClass = "height:45px";
                              } else {
                                //  console.log("English h");
                                  $scope.departmentClass = "height:25px";
                              }
                            }else{
                                $scope.departmentClass = "height:25px";
                            }
                             } else {
                                 if(localizeCurrent == "Español"){
                                   }else{
                                   }
                             }
                             // venkat

                    } else {
                        $rootScope.appointmenttype = 'None Reported';
                    }


                    if ($rootScope.existingConsultationReport.consultationStatus !== '' && typeof $rootScope.existingConsultationReport.consultationStatus !== 'undefined') {
                     $rootScope.consultstatus =  $rootScope.existingConsultationReport.consultationStatus;

                        if ($rootScope.consultstatus == 72) {
                            $rootScope.reportStatus = "Successful";
                        } else if ($rootScope.consultstatus == 79) {
                            $rootScope.reportStatus = "Cancelled";
                        } else if ($rootScope.consultstatus == 81) {
                            $rootScope.reportStatus = "Dropped";
                        }
                    } else {
                        $rootScope.reportStatus = 'None Reported';
                    }


                    if ($rootScope.existingConsultationReport.rx !== '' && typeof $rootScope.existingConsultationReport.rx !== 'undefined') {
                        $rootScope.reportrx = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.rx);
                    } else {
                        $rootScope.reportrx = 'None Reported';
                    }

                    var startTimeISOString = $rootScope.existingConsultationReport.consultationDate;
                    var startTime = new Date(startTimeISOString);
                    $rootScope.consultationDate = new Date(startTime.getTime() + (startTime.getTimezoneOffset() * 60000));
                    $rootScope.consultdate =  $rootScope.existingConsultationReport.consultationDate;
                    // Add Sakthi //
                    debugger;
                    var xD = new Date(startTimeISOString);
                    var DateString = xD.toString();
                    var dateSplit = DateString.split('(');
                    //var rSpaceofString = dateSplit[1] .split(' ');
                    var rSpaceofString = $rootScope.systemTimeZoneID.split(' ');
                    if(dateSplit[1].length > 5)
                        {
                            //var rLastofString = rSpaceofString[2].split(')');
                            var SystemTimeZone = rSpaceofString[0].charAt(0)+rSpaceofString[1].charAt(0)+rSpaceofString[2].charAt(0);
                        }
                        else {
                            //var rLastofString = rSpaceofString[0].split(')');
                           // var SystemTimeZone = rLastofString[0].replace(/\"/g, "");
                           var SystemTimeZone = rSpaceofString[0].charAt(0)+rSpaceofString[1].charAt(0)+rSpaceofString[2].charAt(0);
                        }

                     $rootScope.sysTimeZone = SystemTimeZone;
                    // End Time Zone //
                    if ($rootScope.existingConsultationReport.consultationDuration !== 0 && typeof $rootScope.existingConsultationReport.consultationDuration !== 'undefined') {
                        $rootScope.displayCOnsultationDuration = "display";
                        var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
                        var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
                        if (consultationMinutes === 0) {
                            $rootScope.consultDurationMinutes = '00';
                        } else if (consultationMinutes < 10) {
                            $rootScope.consultDurationMinutes = '0' + consultationMinutes;
                        } else {
                            $rootScope.consultDurationMinutes = consultationMinutes;
                        }

                        if (consultationSeconds === 0) {
                            $rootScope.consultDurationSeconds = '00';
                        } else if (consultationSeconds < 10) {
                            $rootScope.consultDurationSeconds = '0' + consultationSeconds;
                        } else {
                            $rootScope.consultDurationSeconds = consultationSeconds;
                        }
                    } else {
                        $rootScope.displayCOnsultationDuration = "none";
                    }

                    $rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;
                    $rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
                    if (typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
                        } else {
                            $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
                        }
                    } else {
                        $rootScope.reportScreenPrimaryConcern = "";
                    }
                    $rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
                    if (typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern);
                        } else {
                            $rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern1[1]);
                        }
                    } else {
                        $rootScope.reportScreenSecondaryConcern = "None Reported";
                    }
                    $rootScope.intake = $rootScope.existingConsultationReport.intake;
                    if(typeof $rootScope.existingConsultationReport.intake.infantData != undefined && $rootScope.existingConsultationReport.intake.infantData != '') {
                      $scope.showBirthInfo = true;
                    } else {
                      $scope.showBirthInfo = false;
                    }

                    $rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;

                    if ($rootScope.fullTerm === 'N') {
                        $rootScope.fullTerm = 'No';
                    } else if ($rootScope.fullTerm === 'Y') {
                        $rootScope.fullTerm = 'Yes';
                    }

                    $rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
                    if ($rootScope.vaginalBirth === 'N') {
                        $rootScope.vaginalBirth = 'No';
                    } else if ($rootScope.vaginalBirth === 'Y') {
                        $rootScope.vaginalBirth = 'Yes';
                    }

                    $rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
                    if ($rootScope.dischargedWithMother === 'N') {
                        $rootScope.dischargedWithMother = 'No';
                    } else if ($rootScope.dischargedWithMother === 'Y') {
                        $rootScope.dischargedWithMother = 'Yes';
                    }

                    $rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
                    if ($rootScope.vaccinationsCurrent === 'N') {
                        $rootScope.vaccinationsCurrent = 'No';
                    } else if ($rootScope.vaccinationsCurrent === 'Y') {
                        $rootScope.vaccinationsCurrent = 'Yes';
                    }


                    var repdob =$rootScope.existingConsultationReport.dob;
                    var reptdate = repdob.split("T");
                    $rootScope.reportdob = reptdate[0];

                     var now = new Date();
            var duedate = new Date(now);
            var stdate = duedate.setDate(now.getDate());
            var start = new Date(stdate);
            var day = start.getDate();
            var mnth = start.getMonth() + 1;
            var year = start.getFullYear();

                    $rootScope.todayDateForReport = mnth+"/"+day+"/"+year;

                    if($rootScope.existingConsultationReport.dob !== "" && !angular.isUndefined($rootScope.existingConsultationReport.dob)) {
                      var ageDifMs = Date.now() - new Date($rootScope.existingConsultationReport.dob).getTime(); // parse string to date
                      var ageDate = new Date(ageDifMs); // miliseconds from epoch
                      $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                      if($scope.userAge === 0) {
                        $rootScope.userReportDOB = $scope.userAge;
                      } else {
                        $rootScope.userReportDOB = $scope.userAge;
                      }
                    }

                    if (typeof data.data[0].details[0].hospitalImage !== 'undefined' && data.data[0].details[0].hospitalImage !== '') {
                        var hosImage = data.data[0].details[0].hospitalImage;
                        if (hosImage.indexOf(apiCommonURL) >= 0) {
                            $rootScope.hospitalImage = hosImage;
                        } else {
                            $rootScope.hospitalImage = apiCommonURL + hosImage;
                        }
                    } else {
                        $rootScope.hospitalImage = '';
                    }

                    $rootScope.gender = data.data[0].details[0].gender;
                    if (data.data[0].details[0].gender !== '' && typeof data.data[0].details[0].gender !== 'undefined') {

                        if ($rootScope.gender === 'M') {
                            $rootScope.gender = 'Male';
                        } else if ($rootScope.gender === 'F') {
                            $rootScope.gender = 'Female';
                        }
                    } else {
                        $rootScope.gender = 'NA';
                    }

                    $rootScope.ReportMedicalConditions = [];
                    angular.forEach($rootScope.intake.medicalConditions, function(index, item) {
                        $rootScope.ReportMedicalConditions.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedicationAllergies = [];
                    angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {
                        $rootScope.ReportMedicationAllergies.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedications = [];
                    angular.forEach($rootScope.intake.medications, function(index, item) {
                        $rootScope.ReportMedications.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportSurgeries = [];
                    angular.forEach($rootScope.intake.surgeries, function(index, item) {
                        $rootScope.ReportSurgeries.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'description': index.description,
                            'month': index.month,
                            'year': index.year,
                        });
                    });

                    $rootScope.AttendeeList = [];
                    angular.forEach($rootScope.existconsultationparticipants, function(index, item) {
                        var atname = index.person.name.given;
                        if (atname !== '') {
                            $rootScope.AttendeeList.push({
                                'Number': item + 1,
                                'attedeename': index.person.name.given,
                                'secondname':  index.person.name.family,
                                'consultstart': index.period.start,
                                'consultend': index.period.end,

                            });
                        }

                    });

                    $rootScope.reportMedicalCodeDetails = [];

                    if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined')
                    {
                        angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {

                          var cptcode = index.shortDescription;
                         // var spcptcode = cptcode.split("-");
                          var spcptcode = cptcode.substr(0,cptcode.indexOf('-'));
                          var spcptcodeDesc =  cptcode.substr(cptcode.indexOf('-')+1);

                          var icdcode =   index.shortDescription;
                          //var spicdcode = icdcode.split("-");
                          var spicdcode = icdcode.substr(0,icdcode.indexOf('-'));
                          var spicdcodeDesc =  icdcode.substr(icdcode.indexOf('-')+1);


                          var icd9code =   index.shortDescription;
                          //var spicd9code = icdcode.split("-");

                          var spicd9code = icd9code.substr(0,icd9code.indexOf('-'));
                          var spicd9codeDesc =  icd9code.substr(icd9code.indexOf('-')+1);

                          var snocode =   index.shortDescription;
                          //var spsnocode = snocode.split("-");
                          var spsnocode = snocode.substr(0,snocode.indexOf('-'));
                          var spsnocodeDesc =  snocode.substr(snocode.indexOf('-')+1);
                          /*  console.log("-----------------804------------go = ");
                            console.log("cptcode = "+cptcode);
                            console.log("spsnocode = "+spsnocode);
                            console.log("spsnocodeDesc = "+spsnocodeDesc);*/
                            $rootScope.reportMedicalCodeDetails.push({
                                'Number': item + 1,
                                'shortDescription': index.shortDescription,
                                'medicalCodingSystem': index.medicalCodingSystem,
                                'EnCPTCode' : spcptcode,
                                'EnCPTDescription' : spcptcodeDesc,
                                'EnICDcode' : spicdcode,
                                'EnICDDescription' : spicdcodeDesc,
                                'EnICD9code' : spicd9code,
                                'EnICD9Description' : spicd9codeDesc,
                                'SNOMEDcode' : spsnocode,
                                'SNOMEDcodeDescription' : spsnocodeDesc
                            });
                        });
                        $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'CPT'
                        });
                        // if($rootScope.reportMediCPT != ""){
                        //
                        //   var cptcode =   $rootScope.reportMediCPT[0].shortDescription;
                        //   var spcptcode = cptcode.split("-");
                        //   $rootScope.reportMediCPTcode = spcptcode[0];
                        //   $rootScope.reportMediCPTdescription = spcptcode[1];
                        // }


                        $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'ICD-10-DX'
                        });
                        // if($rootScope.reportMediICD != ""){
                        //   var icdcode =   $rootScope.reportMediICD[0].shortDescription;
                        //   var spicdcode = cptcode.split("-");
                        //   $rootScope.reportMediICDcode = spicdcode[0];
                        //   $rootScope.reportMediICDdescription = spicdcode[1];
                        // }
                        $rootScope.reportMediICD9 = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'ICD-9-DX'
                        });
                        // if($rootScope.reportMediICD9 != ""){
                        //   var icd9code =   $rootScope.reportMediICD9[0].shortDescription;
                        //   var spicd9code = cptcode.split("-");
                        //   $rootScope.reportMediICD9code = spicd9code[0];
                        //   $rootScope.reportMediICD9description = spicd9code[1];
                        // }
                        $rootScope.reportSNOMED = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'SNOMED-CT'
                        });
                  /*      if($rootScope.reportSNOMED != ""){
                          var snocode =   $rootScope.reportSNOMED[0].shortDescription;
                          //var spsnocode = cptcode.split("-");

                          var spsnocode = cptcode.substr(0,cptcode.indexOf('-'));
                          var spsnocodeDes = cptcode.substr(cptcode.indexOf('-')+1);
                          console.log("855 = ");
                          console.log("spsnocode = "+spsnocode);
                          console.log("spsnocodeDesc = "+spsnocodeDesc);

                          $rootScope.reportMediSnocode = spsnocode;
                          $rootScope.reportMediSnodescription = spsnocodeDes;
                        }*/
                    } else {
                        $rootScope.reportMedicalCodeDetails = 'None Reported';
                    }

                    session = null;
                    $scope.getSoapNotes(consultation);
                    $scope.doGetAttachmentList(consultation.consultationId);
                    $scope.doGetChatTranscript(consultation.consultationId);
                    $scope.doGetWaitingRoomChatTranscript(consultation.consultationId);

                },
                error: function(data, status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };

            LoginService.getConsultationFinalReport(params);
        }

        $scope.doGetAttachmentList = function(consultationId) {

            var params = {
                consultationId: consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $scope.getSoapNotes();
                    $rootScope.getAttachmentList = []
                    $rootScope.snapdetails = data.data[0];
                    $rootScope.foldersize = $rootScope.snapdetails.myFolderMaxSize;
                    $rootScope.foldercreation = $rootScope.snapdetails.snapFile.createdDate;
                    angular.forEach(data.data[0].snapFile.files, function(index) {
                        var attachImage = index.name.split(".");
                        $rootScope.getAttachmentList.push({
                            'id': "'" + index.id + "'",
                            'name': index.name,
                            'image': attachImage[attachImage.length - 1]
                        });

                    });

                    $rootScope.attachmentLength = $rootScope.getAttachmentList.length;

                },
                error: function(data,status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };
            LoginService.getAttachmentList(params);
        }
        $scope.doGetChatTranscript = function(consultationId) {

            var params = {
                consultationId: consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {

                    $rootScope.chatTranscript = [];
                    if (data.count !== 0) {
                      var chatdetails=data.data[0];
                        angular.forEach(chatdetails, function(index) {
                            $rootScope.chatTranscript.push({
                              'ChatMessage': index.chatMessage,
                            });
                        });
                    }
                },
                error: function(data,status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };

            LoginService.getChatTranscript(params);

        }

         $scope.doGetWaitingRoomChatTranscript = function(consultationId) {

            var params = {
                consultationId: consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {

                    $rootScope.waitingRoomChatTranscript = [];
                    if (data.count !== 0) {
                     var chatdetails=data.data;

                        angular.forEach(chatdetails, function(index) {

                            $rootScope.waitingRoomChatTranscript.push({
                              'ChatMessage': index,
                            });

                        });
                    }
                },
                error: function(data,status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };

            LoginService.getWaitingRoomChatTranscript(params);

        }

        $scope.getSoapNotes = function(consultation) {
      /*    console.log("getSoapNotes");
            console.log("existingConsultationReport.subjective = "+$rootScope.existingConsultationReport.subjective);
            console.log("existingConsultationReport.objective = "+$rootScope.existingConsultationReport.objective);
            console.log("existingConsultationReport.assessment = "+$rootScope.existingConsultationReport.assessment);
            console.log("existingConsultationReport.plan = "+$rootScope.existingConsultationReport.plan);
*/
            $("#reportSubjective").html($rootScope.existingConsultationReport.subjective);
            $("#reportObjective").html($rootScope.existingConsultationReport.objective);
            $("#reportAssessment").html($rootScope.existingConsultationReport.assessment);
            $("#reportPlan").html($rootScope.existingConsultationReport.plan);
            if ($rootScope.existingConsultationReport.subjective !== '' && typeof $rootScope.existingConsultationReport.subjective !== 'undefined') {
                $rootScope.reportSubjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.subjective);
            } else {
                $rootScope.reportSubjective = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.objective !== '' && typeof $rootScope.existingConsultationReport.objective !== 'undefined') {
                $rootScope.reportObjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.objective);
            } else {
                $rootScope.reportObjective = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.assessment !== '' && typeof $rootScope.existingConsultationReport.assessment !== 'undefined') {
                $rootScope.reportAssessment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.assessment);
            } else {
                $rootScope.reportAssessment = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.plan !== '' && typeof $rootScope.existingConsultationReport.plan !== 'undefined') {
                $rootScope.reportPlan = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.plan);
            } else {
                $rootScope.reportPlan = 'None Reported';
            }
            $('#soapReport').find('a').each(function() {
                var aLink = angular.element(this).attr('href');
                var onClickLink = "window.open('" + aLink + "', '_system', 'location=yes'); return false;";
                angular.element(this).removeAttr('href', '');
                angular.element(this).attr('href', 'javascript:void(0);');
                angular.element(this).attr('onclick', onClickLink);
            });
        }
        $rootScope.showReportView = function(consultation, nextPage) {
      /*    console.log("----------showReportView click-----------");
          console.log("consultation = "+consultation);
          console.log("nextPage = "+nextPage);*/
            $rootScope.doGetExistingConsulatationReport(consultation, nextPage);
        }

        $scope.closeReportView = function() {
            $state.go('tab.consultations');
            $('#HealthFooter').css({'display':'block'});
        }


        $rootScope.showMissedDetailsView = function(consultation) {
            $state.go('tab.missedConsultAppoint');
            $rootScope.consultationDate = consultation.startTime;
            $rootScope.missedAppointDetails = consultation;
            if (!angular.isUndefined(consultation.clinicianId)) {
                $rootScope.doGetDoctorDetails(consultation);
            }
        }


        $rootScope.doGetDoctorDetails = function(consultation) {
            $rootScope.missedAppointDocDetails = '';
            var params = {
                doctorId: consultation.clinicianId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.missedAppointDocDetails = [];
                    angular.forEach(data.data, function(index) {
                        if (index.gender === 'M') {
                            var docGender = "Male";
                        } else if (index.gender === 'F') {
                             docGender = "Female";
                        }
                        $rootScope.missedAppointDocDetails.push({
                            'dob': index.dob,
                            'firstName': index.firstName,
                            'lastName': index.lastName,
                            'fullName': index.fullName,
                            'gender': docGender,
                            'profileImagePath': index.profileImagePath
                        });
                    });

                    $("#appointNotes").html(consultation.additionalNotes);
                    $('#appointmentNote').find('a').each(function() {
                        var aLink = angular.element(this).attr('href');
                        var onClickLink = "window.open('" + aLink + "', '_system', 'location=yes'); return false;";
                        angular.element(this).removeAttr('href', '');
                        angular.element(this).attr('href', 'javascript:void(0);');
                        angular.element(this).attr('onclick', onClickLink);
                    });


                },
                error: function(data,status) {
                  if(status === 503) {
                    $scope.$root.$broadcast("callServiceUnAvailableErrorPage");
                  } else {
                    $rootScope.serverErrorMessageValidation();
                  }
                }
            };

            LoginService.getDoctorDetails(params);

        }


        $scope.passedsearchshow = true;
        $scope.missedsearchshow = false;
        $scope.droppedsearcshow = false;
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

        $rootScope.passedsearchconsult = function() {
            $scope.data.searchProvider = '';
            $rootScope.passededconsultants();
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btnextcolor');
            myEl.addClass('btcolor');
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.passedsearchshow = true;
            $scope.missedsearchshow = false;
            $scope.droppedsearchshow = false;
        }
        $scope.missedsearchconsult = function() {
            $scope.data.searchProvider = '';
            $scope.missedconsult();
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.missedsearchshow = true;
            $scope.passedsearchshow = false;
            $scope.droppedsearchshow = false;
        }
        $scope.droppedsearchconsult = function() {
            $scope.data.searchProvider = '';
            $scope.droppedconsult();
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.passedsearchshow = false;
            $scope.missedsearchshow = false;
            $scope.droppedsearchshow = true;
        }

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

angular.module('starter.controllers')

.controller('ConferenceCtrl', function($scope, ageFilter, htmlEscapeValue, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService,$log,$ionicBackdrop,Idle,$ionicPopover, $interval) {
    $.getScript( "lib/jquery.signalR-2.1.2.js", function( data, textStatus, jqxhr ) {
$("#localize-widget").hide();
    });


    /*
    $.getScript( "https://snap-qa.com/api/signalR/hubs", function( data, textStatus, jqxhr ) {

    });*/
     function resetSessionLogoutTimer(){
         window.localStorage.setItem('Active', timeoutValue);
         var timeoutValue = 0;
         clearSessionLogoutTimer();
         var appIdleInterval = $interval(function() {
            if(window.localStorage.getItem("isCustomerInWaitingRoom") !== 'Yes' && window.localStorage.getItem('isVideoCallProgress') !== 'Yes'){
                 timeoutValue++;
                 window.localStorage.setItem('InActiveSince', timeoutValue);
                 if(timeoutValue === 30)
                   goInactive();
            }else{
                  timeoutValue = 0;
                  window.localStorage.setItem('InActiveSince', timeoutValue);
            }
         }, 60000);
    };

$("#localize-widget").show();


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


    //venkat start
      /*  var localizeCurrent = $('#localize-current').text();
        var myLength = $(".departmentClassVal").text().length;
        console.log("myLength ="+myLength);
         if($( window ).width()<= 375) {
           if(localizeCurrent == "Español") {
               console.log("Español");
             $scope.ReportEthnicityVal1 = "width:36.33% !important";
           } if(localizeCurrent == "English (UK)") {
             $scope.ReportEthnicityVal1 = "width:41.33% !important";
           } if(localizeCurrent == "English") {
             $scope.ReportEthnicityVal1 = "width:41.33% !important";
           }
            if(myLength >= 11) {
                console.log("myLength  is more=");
              if(localizeCurrent == "Español") {
                  console.log("Español");
                  $scope.departmentClass = "height:45px !important";
              } if(localizeCurrent == "English (UK)") {
                  $scope.departmentClass = "height:25px !important";
              } if(localizeCurrent == "English") {
                  $scope.departmentClass = "height:25px !important";
              }
            }
             } else {
                 if(localizeCurrent == "Español"){
                   }else{
                   }
             }

               $('#localize-langs').click(function() {
                     var myLength = $(".departmentClassVal").text().length;
                     var isLang = $('#localize-langs .activated').text();

                  //     console.log("myLength ="+myLength);
                  if($( window ).width()<= 375){
                    if(isLang == "Español") {
                        console.log("Español");
                      $(".ReportEthnicity").css("width", "36.33% !important");

                    } if(isLang == "English (UK)") {
                      $(".ReportEthnicity").css("width", "41.33% !important");

                    } if(isLang == "English") {
                      $(".ReportEthnicity").css("width", "41.33% !important");

                    }
                    if(myLength >= 11) {
                        console.log("myLength  is more=");
                     if(isLang == "Español") {
                          $(".departmentClass").css("height", "45px !important");
                     }
                     if(isLang == "English (UK)") {
                         $(".departmentClass").css("height", "25px !important");
                     }
                     if(isLang == "English") {
                            $(".departmentClass").css("height", "25px !important");
                     }
                   isLang = "";
                 }
               }
           }); */
        //venkat end


    function clearSessionLogoutTimer(){
       if(typeof appIdleInterval !== "undefined"){
          $interval.cancel(appIdleInterval);
           appIdleInterval = undefined;
           appIdleInterval = 0;
           timeoutValue = 0;
           window.localStorage.setItem('InActiveSince', timeoutValue);
       }
     };
     clearSessionLogoutTimer();
     if(typeof appIdleInterval !== "undefined"){
          $interval.cancel(appIdleInterval);
          appIdleInterval = undefined;
          appIdleInterval = 0;
          timeoutValue = 0;
          window.localStorage.setItem('InActiveSince', timeoutValue);
     }
    if (window.localStorage.getItem('isVideoCallProgress') === "Yes") {
        $('#videoCallSessionTimer').runner('stop');
        $rootScope.consultationId = window.localStorage.getItem('ConferenceCallConsultationId');
        $rootScope.accessToken = window.localStorage.getItem('accessToken');
        $rootScope.videoSessionId = window.localStorage.getItem('videoSessionId');
        $rootScope.videoApiKey = window.localStorage.getItem('videoApiKey');
        $rootScope.videoToken = window.localStorage.getItem('videoToken');
        $rootScope.PatientImageSelectUser = window.localStorage.getItem('PatientImageSelectUser');
        $rootScope.PatientFirstName = window.localStorage.getItem('PatientFirstName');
        $rootScope.PatientLastName = window.localStorage.getItem('PatientLastName');
        if (session != null) {
            session.disconnect();
            session = null;
        }
        if(connection != null){
          connection = null;
        }
        var currentTime = new Date();
        if(typeof videoCallStartTime === "undefined"){
             videoCallStartTime = currentTime;
        }
        var vStartTime = videoCallStartTime.getTime();
        var vCurrTime = currentTime.getTime();
        var cal_difference_ms = vCurrTime - vStartTime;
        videoCallSessionDuration = cal_difference_ms + 6000;
    }else{
         videoCallStartTime = new Date();
        window.localStorage.setItem('ConferenceCallConsultationId', $rootScope.consultationId);
        window.localStorage.setItem('accessToken', $rootScope.accessToken);
        window.localStorage.setItem('isVideoCallProgress', "No");
        window.localStorage.setItem('videoSessionId', $rootScope.videoSessionId);
        window.localStorage.setItem('videoApiKey', $rootScope.videoApiKey);
        window.localStorage.setItem('videoToken', $rootScope.videoToken);
        window.localStorage.setItem('PatientImageSelectUser', $rootScope.PatientImageSelectUser);
        window.localStorage.setItem('PatientFirstName', $rootScope.PatientFirstName);
        window.localStorage.setItem('PatientLastName', $rootScope.PatientLastName);
        videoCallSessionDuration = 8000;
    }
    var isCallEndedByPhysician = false;
    var participantsCount = +1;
    $scope.doGetExistingConsulatation = function() {
        $rootScope.consultionInformation = '';
        $rootScope.appointmentsPatientFirstName = '';
        $rootScope.appointmentsPatientLastName = '';
        $rootScope.appointmentsPatientDOB = '';
        $rootScope.appointmentsPatientGurdianName = '';
        $rootScope.appointmentsPatientImage = '';


        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.existingConsultation = data;

                $rootScope.consultionInformation = data.data[0].consultationInfo;
                $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                if (!angular.isUndefined($rootScope.consultationStatusId)) {
                    if ($rootScope.consultationStatusId === 72) {
                        window.localStorage.setItem('isVideoCallProgress', "No");
                        $('#thumbVideos').remove();
                          $('#videoControls').remove();
                          session.disconnect();
                          $('#publisher').hide();
                          $('#subscriber').hide();
                          $('#divVdioControlPanel').hide();

                         navigator.notification.alert(
                            // 'Consultation already completed!', // message
                            $rootScope.consultAlredComplMsg,
                             consultationEndedAlertDismissed, // callback
                             $rootScope.alertMsgName, // title
                               $rootScope.Buttonmsg //'Done' // buttonName
                         );
                        $scope.doGetExistingConsulatationReport();
                    }
                }

            },
            error: function() {

            }
        };

        LoginService.getExistingConsulatation(params);

    }

    $rootScope.doGetExistingConsulatationReport = function() {
        $state.go('tab.ReportScreen');
        $rootScope.sysTimeZone = '';
        $rootScope.userReportDOB = "";
        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.attachmentLength = '';
                $rootScope.existingConsultationReport = data.data[0].details[0];
                $rootScope.existconsultationparticipants=data.data[0].participants;
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

                /*if ($rootScope.existingConsultationReport.height !== '' && typeof $rootScope.existingConsultationReport.height !== 'undefined')
                {
                  if ($rootScope.existingConsultationReport.heightUnit !== '' && typeof $rootScope.existingConsultationReport.heightUnit !== 'undefined') {
                    $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                  } else {
                    $rootScope.reportHeight = $rootScope.existingConsultationReport.height;
                  }
                } else {
                    $rootScope.reportHeight = 'N/R';
                }*/

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
                    $rootScope.reportWeight = $rootScope.existingConsultationReport.weight + " " + $rootScope.existingConsultationReport.weightUnit;
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
                if ($rootScope.existingConsultationReport.patientAddress !== '' && typeof $rootScope.existingConsultationReport.patientAddress !== 'undefined') {
                    $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                } else {
                    $rootScope.reportPatientAddress = 'None Reported';
                }

                if($rootScope.existingConsultationReport.ethnicity !== '' && typeof $rootScope.existingConsultationReport.ethnicity !== 'undefined') {
                    $rootScope.reportethnicity = $rootScope.existingConsultationReport.ethnicity;

                  }else{
                     $rootScope.reportethnicity = 'N/R';
                  }
                if ($rootScope.existingConsultationReport.homePhone !== '' && typeof $rootScope.existingConsultationReport.homePhone !== 'undefined') {
                    $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                } else {
                    $rootScope.reportHomePhone = 'N/R';
                }

                if ($rootScope.existingConsultationReport.hospitalAddress !== '' && typeof $rootScope.existingConsultationReport.hospitalAddress !== 'undefined') {
                    $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                } else {

                }

                if ($rootScope.existingConsultationReport.brandName !== '' && typeof $rootScope.existingConsultationReport.brandName !== 'undefined') {
                        $rootScope.reportBrandName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.brandName);
                    } else {
                        $rootScope.reportBrandName = 'N/R';
                    }

                if (!angular.isUndefined($rootScope.existingConsultationReport.location)) {
                    $rootScope.location = $rootScope.existingConsultationReport.location;
                } else {
                    $rootScope.location = 'N/R';
                }

                if (!angular.isUndefined($rootScope.existingConsultationReport.organization)) {
                    $rootScope.organization =$rootScope.existingConsultationReport.organization;
                } else {
                    $rootScope.organization = 'N/R';
                }

                if ($rootScope.existingConsultationReport.doctorFirstName !== '' && typeof $rootScope.existingConsultationReport.doctorFirstName !== 'undefined') {
                    $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                } else {
                    $rootScope.reportDoctorFirstName = 'None Reported';
                }
                if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                    $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                } else {
                    $rootScope.reportMedicalSpeciality = '';
                }
                  if ($rootScope.existingConsultationReport.department !== '' && typeof $rootScope.existingConsultationReport.department !== 'undefined') {
                   $rootScope.providerDepartment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.department);
                } else {
                    $rootScope.providerDepartment = '';
                }

                if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                    $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                } else {
                    $rootScope.reportDoctorLastName = 'None Reported';
                }

                $rootScope.reportservicetype = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.serviceTypeName);

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
                         var SystemTimeZone = rSpaceofString[0].charAt(0)+rSpaceofString[1].charAt(0)+rSpaceofString[2].charAt(0)
                     }
                     else {
                         //var rLastofString = rSpaceofString[0].split(')');
                         //var SystemTimeZone = rLastofString[0].replace(/\"/g, "");
                         var SystemTimeZone = rSpaceofString[0].charAt(0)+rSpaceofString[1].charAt(0)+rSpaceofString[2].charAt(0)
                     }
                  $rootScope.sysTimeZone = SystemTimeZone;
                 // End Time Zone //

                if ($rootScope.existingConsultationReport.consultationDuration !== 0 && typeof $rootScope.existingConsultationReport.consultationDuration !== 'undefined')
                {
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

                    if (consultationSeconds == 0) {
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
                    var nsc = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                    if (nsc < 0) {
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
                    $rootScope.gender = 'N/R';
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

               /* if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined')
                 {
                    angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                        $rootScope.reportMedicalCodeDetails.push({
                            'Number': item + 1,
                            'shortDescription': index.shortDescription,
                            'medicalCodingSystem': index.medicalCodingSystem
                        });
                    });
                    $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                        medicalCodingSystem: 'CPT'
                    });
                    $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                        medicalCodingSystem: 'ICD-10-DX'
                    });

                } else {
                    $rootScope.reportMedicalCodeDetails = '';
                }*/

if ($rootScope.existingConsultationReport.medicalCodeDetails !== '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails !== 'undefined')
                    {
                        angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                          /*var cptcode = index.shortDescription;
                          var spcptcode = cptcode.split("-");
                          var icdcode =   index.shortDescription;
                          var spicdcode = icdcode.split("-");
                          var icd9code =   index.shortDescription;
                          var spicd9code = icdcode.split("-");
                          var snocode =   index.shortDescription;
                          var spsnocode = snocode.split("-");*/


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



                            $rootScope.reportMedicalCodeDetails.push({
                                'Number': item + 1,
                                'shortDescription': index.shortDescription,
                                'medicalCodingSystem': index.medicalCodingSystem,
                                /*'EnCPTCode' : spcptcode[0],
                                'EnCPTDescription' : spcptcode[1],
                                'EnICDcode' : spicdcode[0],
                                'EnICDDescription' : spicdcode[1],
                                'EnICD9code' : spicd9code[0],
                                'EnICD9Description' : spicd9code[1],
                                'SNOMEDcode' : spsnocode[0],
                                'SNOMEDcodeDescription' : spsnocode[1]*/
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
                       /*  if($rootScope.reportSNOMED != ""){
                          var snocode =   $rootScope.reportSNOMED[0].shortDescription;
                         var spsnocode = cptcode.split("-");
                          $rootScope.reportMediSnocode = spsnocode[0];
                          $rootScope.reportMediSnodescription = spsnocode[1];


                          var spsnocode = cptcode.substr(0,cptcode.indexOf('-'));
                          var spsnocodeDes = cptcode.substr(cptcode.indexOf('-')+1);
                          $rootScope.reportMediSnocode = spsnocode;
                          $rootScope.reportMediSnodescription = spsnocodeDes;


                        }*/
                    } else {
                        $rootScope.reportMedicalCodeDetails = 'None Reported';
                    }
                $window.localStorage.setItem('ChkVideoConferencePage', "");
                session = null;
                $scope.getSoapNotes();
                $scope.doGetChatTranscript();
                $scope.doGetAttachmentList();
                $scope.doGetWaitingRoomChatTranscript();
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

        LoginService.getConsultationFinalReport(params);
    }

   /* $scope.doGetAttachmentList = function() {

        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.getSoapNotes();
                $rootScope.getAttachmentList = [];


                angular.forEach(data.data[0].snapFile.files, function(index) {
                    var attachImage = index.name.split(".");
                    $rootScope.getAttachmentList.push({
                        'id': index.id,
                        'name': index.name,
                        'image': attachImage[attachImage.length - 1]
                    });

                });
                $rootScope.attachmentLength = $rootScope.getAttachmentList.length;


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

        LoginService.getAttachmentList(params);

    }*/

    $scope.doGetAttachmentList = function() {

            var params = {
              consultationId: $rootScope.consultationId,
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

    $scope.ConvChar=function( str ) {
      c = {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#039;',
           '#':'&#035;' };
      return str.replace( /[<&>'"#]/g, function(s) { return c[s]; } );
    }

    $scope.doGetChatTranscript = function() {

        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {

              $rootScope.chatTranscript = [];
              if(data.count !== 0) {
                var chatdetails=data.data[0];
                  angular.forEach(chatdetails, function(index) {
                    $rootScope.chatTranscript.push({
                      'ChatMessage': index.chatMessage,
                    });
                });
              }
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
        LoginService.getChatTranscript(params);

    }

      $scope.doGetWaitingRoomChatTranscript = function() {

        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {

              $rootScope.waitingRoomChatTranscript = [];
              if(data.count !== 0) {
                var chatdetails=data.data;
                  angular.forEach(chatdetails, function(index) {
                    $rootScope.waitingRoomChatTranscript.push({
                      'ChatMessage': index,
                    });
                });
              }
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
        LoginService.getWaitingRoomChatTranscript(params);

    }

    $scope.getSoapNotes = function() {
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


    if (session != null) {
        session.unpublish(publisher);
        session.disconnect();
        session = null;
        $scope.doGetExistingConsulatation();
    }
    $scope.doGetExistingConsulatation();

    $rootScope.ClearRootScope = function() {
        $rootScope.cuttlocations = '';
        $window.localStorage.setItem('tokenExpireTime', '');
          $(".overlay").css({"display": "none" });
          $rootScope.registedPwd =  '';
          $rootScope.PatientIdentifiers = '';
          $rootScope.PatientidupdateList = '';
        $rootScope.sessionConsultConnection.start().done(function() {
          $rootScope.sessionRoomConHub.invoke('LogoutUser');
          // alert('hhh');
           $rootScope.accessToken = '';
           $rootScope.sessionRoomConHub = null;
           $rootScope.sessionConsultConnection = null;
        });
        $rootScope = $rootScope.$new(true);
        $scope = $scope.$new(true);
        for (var prop in $rootScope) {
            if (prop.substring(0,1) !== '$') {
                delete $rootScope[prop];
            }
        }
        $(".ion-google-place-container").css({
            "display": "none"
        });
        $ionicBackdrop.release();
        if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
            $timeout(function() {
                   //$window.location.reload(true);
               });
        } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                 //$state.go('tab.login');
                 $state.go('tab.singleTheme');
                 $timeout(function() {
                        //$window.location.reload(true);
                    });
        }else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
            //$state.go('tab.loginSingle');
            $state.go('tab.singleTheme');
            $timeout(function() {
                   //$window.location.reload(true);
               });
        }else {
           $state.go('tab.login');
           $timeout(function() {
                  //$window.location.reload(true);
              });
        }
    }

    $window.localStorage.setItem('ChkVideoConferencePage', "videoConference");

    if (!angular.isUndefined($rootScope.consultationStatusId) || $rootScope.consultationStatusId !== 72) {

        //var connection = $.hubConnection();
        //debugger;
        var connectionCount = 0;

        var conHubObject = (function(connection){
             var conHub = connection.createHubProxy('consultationHub');
             connection.url = $rootScope.APICommonURL + "/api/signalR/";
            var consultationWatingId = +$rootScope.consultationId;

            connection.qs = {
               "Bearer": $rootScope.accessToken,
               "consultationId": consultationWatingId,
               "isMobile": true
            };
            conHub.on("onConsultationReview", function() {
               $rootScope.waitingMsg = "The provider is now reviewing the intake form.";
            });
            conHub.on("onCustomerDefaultWaitingInformation", function() {
               $rootScope.waitingMsg = "Please Wait....";
            });
            conHub.on("onConsultationStarted", function() {
               window.localStorage.setItem('isVideoCallProgress', "Yes");
               $rootScope.waitingMsg = "Please wait...";
            });
            window.conn = connection;
            connection.logging = true;
            connection.start({
               withCredentials: false
            }).then(function() {
               conHub.invoke("joinCustomer").then(function() {});
               $rootScope.waitingMsg = "The Provider will be with you Shortly.";
               window.localStorage.setItem('isVideoCallProgress', "Yes");
               /*connection.on("disconnected",function(){
                    setTimeout(function() {
                        if(connection && connection.start){
                             connection.start();
                        }
                    }, 5000);
               });*/
               connection.disconnected(function() {
                  setTimeout(function() {
                       if(connection && connection.start){
                            connection.start();
                       }
                  }, 5000); // Restart connection after 5 seconds.
             });
            });


            conHub.on("onConsultationEnded", function() {
               isCallEndedByPhysician = true;
               $('#videoCallSessionTimer').runner('stop');
               $scope.disconnectConference();
            });

            conHub.on("OnClientConnected", function(event) {
                  console.log('-------OnClientConnected-----------');
                   console.log(event);
                      console.log('-------OnClientConnected-----------');
            });
            conHub.on("OnClientDisconnected", function (event) {
              console.log('OnClientDisconnected');
              console.log(event);
               console.log('OnClientDisconnected');
            });

          conHub.on("onProviderUnavailable", function () {
              console.log('onProviderUnavailable1');
            //  alert('onProviderUnavailable1');
            });
            conHub.on("onProviderAvailable", function () {
              console.log('providerAvailable1');
            //  alert('providerAvailable1');
            });
            return { consultationHub: conHub, hubConnection:connection };
       }($.hubConnection()));



       var conHub = conHubObject.consultationHub;
       var connection = conHubObject.hubConnection;
      // debugger;

        /*
        var initConferenceRoomHub = function() {


             conHub.on("onParticipantDisconnected", function () {
              console.log('onParticipantDisconnected1');
              alert('onParticipantDisconnected1');
            });

            conHub.on("onParticipantConnected", function () {
              console.log('participantConnected1');
              alert('participantConnected1');
            });


            conHub.on("onProviderDisconnected", function () {
              console.log('OnClientDisconnected102');
              alert('OnClientDisconnected102');
               $.connection.hub.start();
               isCallEndedByPhysician = true;
               $('#videoCallSessionTimer').runner('stop');
               $scope.disconnectConference();
            });
        };
       // initConferenceRoomHub();
        */

        $rootScope.clinicianVideoHeight = $window.innerHeight - 60 - 100;
        $rootScope.clinicianVideoControlPanelTop = $window.innerHeight - 61;
        $rootScope.clinicianVideoWidth = $window.innerWidth;

        $rootScope.clinicianVideoHeightScreen = ($window.innerWidth / 16) * 9;

        $rootScope.patientVideoTop = $window.innerHeight - 173 - 100;
        $rootScope.controlsStyle = false;

        $rootScope.cameraPosition = "front";
        $rootScope.publishAudio = true;
        $rootScope.publishVideo = true;

        $rootScope.muteIconClass = 'ion-ios-mic callIcons';
        $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';

        var apiKey = $rootScope.videoApiKey;
        var sessionId = $rootScope.videoSessionId;
        var token = $rootScope.videoToken;

        session = OT.initSession(apiKey, sessionId);
        var customerFullName = $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName;
        var connectedStreams = new Array();
        var connectedVideoStreams = new Array();
        var lastSubscriber = "";

        var thumbSwiper = new Swiper('.swiper-container', {
            mode: 'horizontal',
            slidesPerView: 3
        });

        session.on('streamCreated', function(event) {
          setTimeout(function(){
            if($('.clsPtVideoThumImage').length > 1){
                $('.clsPtVideoThumImage').eq(0).remove();
            }
          }, 100);
            if (event.stream.name.indexOf('Screen Share') < 0) {
                participantsCount = +participantsCount + 1;
            }
            window.localStorage.setItem('isVideoCallProgress', "Yes");
            $('#pleaseWaitVideo').remove();
            $('#subscriber').css('background-color', 'black !important');
            for (var i = 0; i < connectedStreams.length; i++) {
                var tbStreamVal = session.streams[connectedStreams[i]];
                var connectedStreamId = connectedStreams[i];
                if (connectedStreamId !== "") {
                    $('#subscriber #video-' + connectedStreamId).hide();
                    $('#subscriber #' + connectedStreamId).hide();
                    $('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
                }
                if (typeof tbStreamVal === "undefined") {
                    var index = connectedStreams.indexOf(connectedStreamId);
                    connectedStreams.splice(index, 1);
                }
            }
            connectedStreams.push(event.stream.streamId);
            var streamIdVal = event.stream.streamId;
            var vdioContainer = document.createElement("div");
            vdioContainer.setAttribute("id", 'video-' + streamIdVal);
            var vdioPlayer = document.createElement("div");
            vdioPlayer.setAttribute("id", streamIdVal);
            vdioContainer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px!important; position: relative; height: " + $rootScope.clinicianVideoHeight + "px;");
            vdioPlayer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeight + "px;");

            if (ionic.Platform.isIOS()) {
                if (event.stream.videoType === 2) {
                    $('#subscriber .OT_root').hide();
                    var screenHeight = $rootScope.clinicianVideoHeight / 2;
                    var divHeight = $rootScope.clinicianVideoHeightScreen / 2;
                    var totalHeight = screenHeight - divHeight;
                    vdioContainer.setAttribute("style", "top:" + totalHeight + "px !important; position: relative; width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeightScreen + "px;");
                    vdioPlayer.setAttribute("style", "width: " + $rootScope.clinicianVideoWidth + "px; height: " + $rootScope.clinicianVideoHeightScreen + "px;");
                }
            }
            document.getElementById('subscriber').appendChild(vdioContainer);
            document.getElementById('video-' + streamIdVal).appendChild(vdioPlayer);

            lastSubscriber = event.stream.streamId;

            var subscriber = session.subscribe(event.stream, streamIdVal, {
                insertMode: 'append',
                subscribeToAudio: true,
                subscribeToVideo: true
            });
            $scope.createVideoThumbnail(event);


            $('.vdioBadge').html(participantsCount);
            setTimeout(function(){
              if($('.clsPtVideoThumImage').length > 1){
                  $('.clsPtVideoThumImage').eq(0).remove();
              }
            }, 100);
            var subChilds = $('#subscriber').children().length;
            OT.updateViews();
            setTimeout(function () {
                 if(subChilds > 1){
                      for(var j = 1; j < subChilds.length; j++){
                           $('#subscriber').children().eq(j).hide();
                           $('#subscriber').children().eq(j).appendTo("#hiddenVideos");
                      }
                      OT.updateViews();
                      if($('.clsPtVideoThumImage').length > 1){
                          $('.clsPtVideoThumImage').eq(0).remove();
                      }
                 }
            }, 1000);
        });

        //PatientImageSelectUser

        $scope.createVideoThumbnail = function(event) {
            var streamIdVal = event.stream.streamId;
            var participantName = event.stream.name;
            if (participantName === "") {
                participantName = streamIdVal.split('-')[0];
            }
            var thumbContainer = document.createElement("div");
            thumbContainer.setAttribute("id", 'thumb-' + streamIdVal);

            var thumbPlayer = document.createElement("div");
            thumbPlayer.setAttribute("id", "thumbPlayer-" + streamIdVal);
            thumbContainer.setAttribute("class", "claVideoThumb");
            var thumbLeft = $('.claVideoThumb').length * 100;
            thumbContainer.setAttribute("style", "z-index: 30000; left: " + thumbLeft + "px; border: 1px dotted red; width: 100px !important; padding: 5px; position: absolute; float: left; height: 100px !important;");
            thumbPlayer.setAttribute("style", "background-color: black; border: 1px dotted green; width: 80px !important; position: absolute; height: 80px !important;");
            thumbPlayer.setAttribute("onclick", "switchToStream('" + streamIdVal + "');");
            var imgThumbPath = $rootScope.APICommonURL + '/images/Patient-Male.gif';
            imgThumbPath = 'img/default-user.jpg';
            var videoSource = '';
            if (participantName.indexOf('Screen Share') >= 0) {
                participantName = participantName.replace('Screen Share By :', '');
                var share_icon_name = 'share_screen';
                thumbSwiper.appendSlide("<div onclick='switchToStream(\"" + streamIdVal + "\");' id='thumbPlayer-" + streamIdVal + "' class='videoThumbnail'><div id='thumb-" + streamIdVal + "' class='swiper-slide claVideoThumb'><span style='background-color: " + $rootScope.brandColor + " !important;'><i><svg class='icon-share_screen'><use xlink:href='symbol-defs.svg#icon-share_screen'></use></svg></i></span></div><p class='participantsName ellipsis'>" + participantName + "</p></div>");
            }else{
                participantName = participantName.replace('Screen Share By :', '');
                var s = htmlEscapeValue.getHtmlEscapeValue(participantName);
                var n = s.indexOf('https');
                var streamProviderName = s.substring(0, n != -1 ? n : s.length);
                var participantNameInitial = getInitialForName(streamProviderName);
                if(participantNameInitial == 'WW')
                    participantNameInitial = 'W';
                thumbSwiper.appendSlide("<div onclick='switchToStream(\"" + streamIdVal + "\");' id='thumbPlayer-" + streamIdVal + "' class='videoThumbnail'><div id='thumb-" + streamIdVal + "' class='swiper-slide claVideoThumb'><span style='background-color: " + $rootScope.brandColor + " !important;'>" + participantNameInitial + "</span></div><p class='participantsName ellipsis'>" + participantName + "</p></div>");
            }
            setTimeout(function(){
              if($('.clsPtVideoThumImage').length > 1){
                  $('.clsPtVideoThumImage').eq(0).remove();
              }
            }, 1000);
        };

        $scope.removeVideoThumbnail = function(streamIdVal) {
            $('#thumbPlayer-' + streamIdVal).hide();
            $('#thumbPlayer-' + streamIdVal).remove();
            var swiperParent = $('#thumb-' + streamIdVal).parent();
            $('#thumb-' + streamIdVal).hide();
            $('#thumb-' + streamIdVal).remove();
            $(swiperParent).remove();
            $("div.swiper-slide:empty").remove();
            OT.updateViews();
            if($('.clsPtVideoThumImage').length > 1){
                $('.clsPtVideoThumImage').eq(0).remove();
            }
        };

        $scope.arrangeVideoThumbnails = function() {
            var thumbLength = $('.claVideoThumb').length;
            for (var i = 0; i < thumbLength; i++) {
                var thumbLeft = i * 100;
                $('.claVideoThumb').eq(i).css('left', thumbLeft + 'px !important;');
            }
        };

        switchToStream = function(selectedSteamId) {
            if(connectedStreams.length <= 1){
              return;
            }
            for (var i = 0; i < connectedStreams.length; i++) {
                var connectedStreamId = connectedStreams[i];
                if (connectedStreamId !== "" && connectedStreamId !== selectedSteamId) {
                    $('#subscriber #video-' + connectedStreamId).hide();
                    $('#subscriber #' + connectedStreamId).hide();
                    $('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
                }
            }
            $('#hiddenVideos #video-' + selectedSteamId).appendTo("#subscriber");
            $('#video-' + selectedSteamId).show();
            $('#' + selectedSteamId).show();
            OT.updateViews();
        };
        session.on('streamDestroyed', function(event) {
              var tbStreamVal = event.stream.streamId;
              $scope.removeVideoThumbnail(tbStreamVal);
              $('#subscriber #video-' + connectedStreamId).hide();
              $('#subscriber #' + connectedStreamId).hide();
              $('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
              $('#' + tbStreamVal).remove();
              $('#video-' + tbStreamVal).remove();
              if (typeof tbStreamVal != "undefined") {
                  var index = connectedStreams.indexOf(tbStreamVal);
                  connectedStreams.splice(index, 1);
              }
              if (event.stream.name.indexOf('Screen Share') < 0) {
                  participantsCount = +participantsCount - 1;
              }
              $('.vdioBadge').html(participantsCount);
              $scope.removeVideoThumbnail(tbStreamVal);

              for (var i = 0; i < connectedStreams.length; i++) {
                  var tbStreamVal = session.streams[connectedStreams[i]];
                  var connectedStreamId = connectedStreams[i];
                  if (connectedStreamId !== "") {
                      $('#subscriber #video-' + connectedStreamId).hide();
                      $('#subscriber #' + connectedStreamId).hide();
                      $('#subscriber #video-' + connectedStreamId).appendTo("#hiddenVideos");
                  }
                  if (typeof tbStreamVal === "undefined") {
                      var index = connectedStreams.indexOf(connectedStreamId);
                      connectedStreams.splice(index, 1);
                  }
              }
              if (connectedStreams.length > 0) {
                  var doctorsStreamId = connectedStreams[0];
                  $('#hiddenVideos #video-' + doctorsStreamId).appendTo("#subscriber");
                  $('#video-' + doctorsStreamId).show();
                  $('#' + doctorsStreamId).show();
              }

              OT.updateViews();
              $scope.arrangeVideoThumbnails();
              $("#subscriber").css('top', '0px');
              $("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);
              event.preventDefault();
        });

     /*   session.on("connectionCreated", function(event) {
          console.log("---------connectionCreated-----------");
          console.log(event);
          console.log("---------connectionCreated-----------");
           connectionCount++;
        });
        session.on('connectionDestroyed', function(event) {
          console.log("---------connectionDestroyed-----------");
          console.log(event);
          console.log("---------connectionDestroyed-----------");
          connectionCount--;
          if(connectionCount === 0 && navigator.onLine === true) {
                $scope.GetEndFunctinCall();
          }

        });


        $scope.GetEndFunctinCall = function() {
          isCallEndedByPhysician = true;
          $('#videoCallSessionTimer').runner('stop');
          $scope.disconnectConference();
     }*/

        session.on("signal", function(event) {
          console.log("---------signal-----------");
            console.log(event);
            console.log("---------signal-----------");
        });

        // Connect to the Session
        session.connect(token, function(error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                publisher = OT.initPublisher('publisher', {
                    insertMode: 'append',
                    publishAudio: true,
                    publishVideo: true,
                    name: customerFullName
                });
                $timeout(function() {
                    $scope.controlsStyle = true;
                }, 100);
                session.publish(publisher);
                OT.updateViews();
                var conferencePtImage = window.localStorage.getItem('videoCallPtImage');
                var conferencePtFullName = window.localStorage.getItem('videoCallPtFullName');
                $('.clsPtVideoThumImage').remove();
                if(conferencePtImage && conferencePtImage != null && conferencePtImage != '' && conferencePtImage != "undefined" && conferencePtImage != undefined && conferencePtImage!="/images/default-user.jpg" && conferencePtImage!="/images/Patient-Female.gif" && conferencePtImage!="/images/Patient-Male.gif"){
                    thumbSwiper.appendSlide("<div class='videoThumbnail clsPtVideoThumImage'><div id='thumb-patient' class='swiper-slide claVideoThumb'><img src='" + conferencePtImage + "' class='listImgView'/></div><p class='participantsName ellipsis'>" + conferencePtFullName + "</p></div>");
                }else if(conferencePtImage=='/images/default-user.jpg' || conferencePtImage=='/images/Patient-Female.gif' || conferencePtImage=='/images/Patient-Male.gif'){
                  var patientInitialStr = getInitialForName(conferencePtFullName);
                  if(patientInitialStr == 'WW')
                      patientInitialStr = 'W';
                  thumbSwiper.appendSlide("<div class='videoThumbnail clsPtVideoThumImage'><div id='thumb-patient' class='swiper-slide claVideoThumb'><span style='background-color: " + $rootScope.brandColor + " !important;'>" + patientInitialStr + "</span></div><p class='participantsName ellipsis'>" + conferencePtFullName + "</p></div>");
                }
                else{
                    var patientInitialStr = getInitialForName(conferencePtFullName);
                    if(patientInitialStr == 'WW')
                        patientInitialStr = 'W';
                    thumbSwiper.appendSlide("<div class='videoThumbnail clsPtVideoThumImage'><div id='thumb-patient' class='swiper-slide claVideoThumb'><span style='background-color: " + $rootScope.brandColor + " !important;'>" + patientInitialStr + "</span></div><p class='participantsName ellipsis'>" + conferencePtFullName + "</p></div>");
                }

                $('#videoCallSessionTimer').runner({
                  autostart: true,
                  milliseconds: false,
                  startAt: videoCallSessionDuration
                });
                if($('.clsPtVideoThumImage').length > 1){
                    $('.clsPtVideoThumImage').eq(0).remove();
                }
            } else {
                alert('There was an error connecting to the session: ' + error.message);
            }

        });



        $rootScope.openVideoCameraPanel = function(){
          $('.vdioControlPanel').removeClass('animated');
          $('.vdioControlPanel').removeClass('slideInDown');
          $('.vdioControlPanel').removeClass('slideOutUp');
          $('.vdioControlPanel').removeClass('slideOutDown');
          $('.vdioControlPanel').removeClass('slideInUp');

          $('.vdioCameraControlPanel').removeClass('animated');
          $('.vdioCameraControlPanel').removeClass('slideInDown');
          $('.vdioCameraControlPanel').removeClass('slideOutUp');
          $('.vdioCameraControlPanel').removeClass('slideOutDown');
          $('.vdioCameraControlPanel').removeClass('slideInUp');

          $('.vdioControlPanel').addClass('animated slideOutUp');
          $('.vdioCameraControlPanel').addClass('animated slideInUp');
          $('.vdioControlPanel').hide();
          $('.vdioCameraControlPanel').show();
        };

        $rootScope.closeVideoCameraPanel = function(){
          $('.vdioControlPanel').removeClass('animated');
          $('.vdioControlPanel').removeClass('slideInDown');
          $('.vdioControlPanel').removeClass('slideOutUp');

          $('.vdioCameraControlPanel').removeClass('animated');
          $('.vdioCameraControlPanel').removeClass('slideInDown');
          $('.vdioCameraControlPanel').removeClass('slideOutUp');

          $('.vdioCameraControlPanel').addClass('animated slideOutUp');
          $('.vdioControlPanel').addClass('animated slideInUp');
          $('.vdioCameraControlPanel').hide();
          $('.vdioControlPanel').show();
        };

        $rootScope.toggleVideoCameraPanel = function(){
          if($rootScope.publishVideo){
            $rootScope.openVideoCameraPanel();
          }
          else{
            $scope.startPublishingVideo();
          }
        };

        $scope.toggleCamera = function() {
            if ($scope.cameraPosition === "front") {
                $rootScope.newCamPosition = "back";
                $rootScope.cameraIconClass = 'ion-ios-reverse-camera-outline callIcons';
            } else {
                $rootScope.newCamPosition = "front";
                $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
            }
            $scope.cameraPosition = $scope.newCamPosition;
            publisher.setCameraPosition($scope.newCamPosition);
        };

        $scope.insertPatientThumbnailOverVideo = function(){
          $('#publisher').html("<img style='width: 100px !important; height: 100px !important; border-radius: 50%;' src='" + $rootScope.PatientImageSelectUser + "' class='listImgView'/>");
        };

        $scope.toggleMute = function() {
            if ($scope.publishAudio) {
                $rootScope.newPublishAudio = false;
                $rootScope.muteIconClass = 'ion-ios-mic-off callIcons activeCallIcon';
                $('#vdioMic .vdioIcon i').html(createSVGIcon('microphone_mute'));
                $('#vdioMic .vdioIcon i svg').css('color', $rootScope.brandColor);
            } else {
                $rootScope.newPublishAudio = true;
                $rootScope.muteIconClass = 'ion-ios-mic callIcons';
                $('#vdioMic .vdioIcon i').html(createSVGIcon('mic'));
                $('#vdioMic .vdioIcon i svg').css('color', 'white');
            }
            $rootScope.publishAudio = $rootScope.newPublishAudio;
            publisher.publishAudio($rootScope.newPublishAudio);
        };
        $rootScope.conferenceVideoLabel = '';

        $scope.openVideoCameraPopover = function($event) {
            if($rootScope.publishVideo){
              $scope.videoCameraControlPopover.show($event);
              $('.popover-arrow').hide();
              $('#vdioCamera .vdioIcon i svg').css('color', $rootScope.brandColor);
            }
            else{
              $scope.toggleSelfCamera();
            }
         };

         $scope.toggleSelfCamera = function() {
            if ($scope.publishVideo) {
                $rootScope.newPublishVideo = false;
                $('#vdioCamera .vdioIcon i').html(createSVGIcon('video_camera_mute'));
                $('#vdioCamera .vdioIcon i svg').css('color', $rootScope.brandColor);
            } else {
                $rootScope.newPublishVideo = true;
                $('#vdioCamera .vdioIcon i').html(createSVGIcon('video_camera'));
                $('#vdioCamera .vdioIcon i svg').css('color', 'white');
            }
            $rootScope.publishVideo = $rootScope.newPublishVideo;
            publisher.publishVideo($rootScope.newPublishVideo);
            $rootScope.closeVideoCameraPanel();
        };

        $scope.toggleSpeaker = function() {

        };

        $scope.stopPublishingVideo = function() {
          $rootScope.publishVideo = false;
          $rootScope.newPublishVideo = false;
          publisher.publishVideo(false);
          $('div#publisher').hide();
          OT.updateViews();
          $('#vdioCamera .vdioIcon i').html(createSVGIcon('video_camera_mute'));
          $('#vdioCamera .vdioIcon i svg').css('color', $rootScope.brandColor);
          $rootScope.closeVideoCameraPanel();
        };

        $scope.startPublishingVideo = function() {
          $rootScope.publishVideo = true;
          $rootScope.newPublishVideo = true;
          publisher.publishVideo(true);
          $('div#publisher').show();
          OT.updateViews();
          $('#vdioCamera .vdioIcon i').html(createSVGIcon('video_camera'));
          $('#vdioCamera .vdioIcon i svg').css('color', 'white');
        };
    }




    var callEnded = false;
    $scope.disconnectConference = function() {
        if (!callEnded) {

            if(!isCallEndedByPhysician){
              navigator.notification.confirm(
                $rootScope.alertconfirm,
                  function(index) {
                      if (index == 1) {
                          $state.go('tab.videoConference');
                      } else if (index == 2) {
                           conHub.invoke("notifyClientDisconnect").then(function() {});
                           $('#thumbVideos').remove();
                           $('#videoControls').remove();
                           session.unpublish(publisher)
                           session.disconnect();
                           $('#publisher').hide();
                           $('#subscriber').hide();
                           $('#divVdioControlPanel').hide();
                           if(connection){
                                connection.stop();
                                connection.qs = {};
                                connection = null;
                           }
                           if(conHub){
                                conHub = null;
                           }
                          window.localStorage.setItem('isVideoCallProgress', "No");
                          callEnded = true;
                        navigator.notification.alert(
                            $rootScope.alertMsgConference, // message
                            consultationEndedAlertDismissed, // callback
                            $rootScope.alertMsgName, // title
                            $rootScope.Buttonmsg // buttonName
                        );
                      }
                  },
                  $rootScope. NaviConfirmation, ['No', $rootScope. YESMessageProviderSearch]
              );
            }else{
              window.localStorage.setItem('isVideoCallProgress', "No");
              callEnded = true;
            //  conHub.invoke("notifyClientDisconnect").then(function() {});
             $('#thumbVideos').remove();
             $('#videoControls').remove();
             session.unpublish(publisher)
             session.disconnect();
             $('#publisher').hide();
             $('#subscriber').hide();
             $('#divVdioControlPanel').hide();
            // debugger;
             if(connection){
                  connection.stop();
                  connection.qs = {};
                  connection = null;
             }
             if(conHub){
                  conHub = null;
             }

              navigator.notification.alert(
                $rootScope.alertMsgConference, // message
                  consultationEndedAlertDismissed, // callback
                  $rootScope.alertMsgName, // title
                    $rootScope.Buttonmsg // buttonName
              );
            }

        }
    };


    function consultationEndedAlertDismissed() {
        $('#videoCallSessionTimer').runner('stop');
       // debugger;
        if(connection){
             connection.stop();
             connection.qs = {};
             connection = null;
        }
        if(conHub){
             conHub = null;
        }
        if(typeof appIdleInterval != "undefined"){
             $interval.cancel(appIdleInterval);
             appIdleInterval = undefined;
             appIdleInterval = 0;
             timeoutValue = 0;
             window.localStorage.setItem('InActiveSince', timeoutValue);
        }
        if(typeof videoCallSessionDurationTimer !== "undefined"){
           $interval.cancel(videoCallSessionDurationTimer);
            videoCallSessionDurationTimer = undefined;
            videoCallSessionDurationTimer = 0;
            videoCallSessionDuration = 0;
        }
        resetSessionLogoutTimer();
        if (deploymentEnv === 'Single' && cobrandApp === 'Hello420') {
            var consulationEndRedirectURL = $rootScope.patientConsultEndUrl;
            if (consulationEndRedirectURL !== "") {
                $state.go('tab.singleTheme');
                setTimeout(function() {
                    window.open(consulationEndRedirectURL, '_system', '');
                }, 1000);
            }
        } else {
            $rootScope.doGetExistingConsulatationReport();
        }
        window.plugins.insomnia.allowSleepAgain();
    }
})

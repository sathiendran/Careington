// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
/*var handleOpenURL = function(url) {
    console.log("received url: " + url);
    //window.localstorage.setItem('ASA', url);
}*/
// Sandbox -  https://sandbox.connectedcare.md
// Production - https://connectedcare.md
// QA - https://snap-qa.com
// Multiple - https://sandbox.connectedcare.md and https://snap.qa.com this will let the user to choose env first
var deploymentEnv = 'Multiple'; //Production //Multiple //Multiple //Single //Demo
var deploymentEnvLogout = 'Multiple'; // same as above var deploymentEnvForProduction = 'Production';
var appStoreTestUserEmail = 'itunesmobiletester@gmail.com';
var appStoreTestUserEmail2 = 'snap.rinsoft.qaapptester@gmail.com';
var deploymentEnvForProduction = ''; //'Production'; // Set 'Production' Only for Single Production - For Apple testing purpose
var loginPageEnv = 'Multiple'; //Multiple //Production // Single
var appVersion = 8.1;
var serviceAPIError = 'https://www.connectedcarestatus.com/';
//var xApiKey = 'c69fe0477e08cb4352e07c502ddd2d146b316112'; // For Photo Upload
//var xDeveloperId = '84f6101ff82d494f8fcc5c0e54005895'; // For Photo Upload
var timeoutValue = 0;
var videoCallSessionDuration = 8000;
var videoCallStartTime = new Date();
if (deploymentEnv == 'Single') {
    appStoreTestUserEmail = 'itunesmobiletester@gmail.com';
    deploymentEnvForProduction = 'Staging'; //'Production', 'Staging', 'QA', 'Sandbox'; // Set 'Production' Only for Single Production - For Apple testing purpose

    var singleStagingHospitalId;
    var singleHospitalId;
    var brandColor;
    var logo;
    var Hospital;
    var HospitalTag;



    var cobrandApp = 'MDAmerica';
    switch (cobrandApp) {
        case "EpicMD":
            singleStagingHospitalId = 155;
            singleHospitalId = 190;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#66c3b0';
            logo = 'img/epicmd_logotypebg.png';
            Hospital = 'EpicMD';
            HospitalTag = 'Virtual Care Concierge';
            ssoURL = "";
            break;
        case "TelehealthOne":
            singleStagingHospitalId = 142;
            singleHospitalId = 142;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#5ec4fe';
            logo = 'img/teleLogo.png';
            Hospital = 'telehealthONE';
            HospitalTag = 'Virtual Care Concierge';
            ssoURL = "";
            break;
        case "Dokita":
            singleStagingHospitalId = 156;
            singleHospitalId = 184;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#ff0000';
            logo = 'img/dokita.png';
            Hospital = 'Dokita247';
            HospitalTag = 'Virtual Care Concierge';
            ssoURL = "";
            break;
        case "DYW":
            singleStagingHospitalId = 157;
            singleHospitalId = 168;
            singleQAHospitalId = 156;
            singleSandboxHospitalId = '126';
            brandColor = '#22508b';
            logo = 'img/dyw.jpg';
            Hospital = "DocYourWay's Global Care Management";
            HospitalTag = 'Virtual Care Concierge';
            ssoURL = "";
            break;
        case "Hello420":
            singleStagingHospitalId = 160;
            singleHospitalId = 197;
            singleQAHospitalId = '';
            singleSandboxHospitalId = 142;
            brandColor = '#000080';
            logo = 'img/hello420.png';
            logo = 'https://connectedcare.md/api/v2.1/images/91e9aff7-4236-415e-aff5-17434a17c17b';
            Hospital = "Hello420";
            HospitalTag = 'Medical marijuana cards, quickly';
            ssoURL = "http://52.34.151.119/hello420/login/";
            break;
        case "ambientcare":
            singleStagingHospitalId = 161;
            singleHospitalId = 212;
            singleQAHospitalId = 164;
            singleSandboxHospitalId = '';
            brandColor = '#193def';
            logo = 'img/ambientcare.png';
            logo = 'https://snap-stage.com/api/v2.1/images/1456c0dc-9322-4502-98c4-d26e501f0dc0';
            Hospital = "Ambient Virtual Care";
            HospitalTag = 'Virtual Consultation Platform';
            ssoURL = "";
            break;
        case "1800md":
            singleStagingHospitalId = 164;
            singleHospitalId = 229;
            singleQAHospitalId = 165;
            singleSandboxHospitalId = 146;
            brandColor = '#005b9f';
            logo = 'img/1800md.png';
            logo = 'https://snap-stage.com/api/v2.1/images/b98206b9-1238-4a69-9e5d-3b8090406e32';
            Hospital = "1.800MD";
            HospitalTag = 'Convenient Care Anywhere';
            ssoURL = "";
            break;
        case "LatchOn":
            singleStagingHospitalId = 166;
            singleHospitalId = 218;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#d14a43';
            logo = 'img/1800md.png';
            logo = 'https://snap-stage.com/api/v2.1/images/b98206b9-1238-4a69-9e5d-3b8090406e32';
            Hospital = "1.800MD";
            HospitalTag = 'Convenient Care Anywhere';
            ssoURL = "";
            break;
        case "Emerald Healthcare Group":
            singleStagingHospitalId = 126;
            singleHospitalId = 126;
            singleQAHospitalId = '';
            singleSandboxHospitalId = 129; // 126;
            brandColor = '#0071bb';
            logo = 'https://sandbox.connectedcare.md/api/v2.1/images/745eb236-2286-4635-b7c1-50dfe7fac390';
            Hospital = 'Emerald City Healthcare';
            HospitalTag = 'Virtual Telemedicine';
            ssoURL = "";
            break;
        case "TeleMD Virtual Clinic":
            singleStagingHospitalId = 167;
            singleHospitalId = 268;
            singleQAHospitalId = '';
            singleSandboxHospitalId = 144; // 126;
            brandColor = '#0000ff';
            logo = 'https://sandbox.connectedcare.md/api/v2.1/images/59953d85-4202-4b1b-ae0b-c4bf31203b19';
            Hospital = 'TeleMD Virtual Clinic';
            HospitalTag = 'Always Nearby';
            ssoURL = "";
            break;
        case "TheDocApp":
            singleStagingHospitalId = 162;
            singleHospitalId = 259;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#4bc9f0';
            //  logo = 'img/1800md.png';
            logo = 'https://snap-stage.com/api/v2.1/images/7900bdca-83e3-4a66-850e-7bd4c78a8f58';
            Hospital = "TheDocApp";
            HospitalTag = 'Convenient Care Anywhere';
            ssoURL = "";
            break;
        case "eVirtualcare":
            singleStagingHospitalId = 168;
            singleHospitalId = 271;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#0073c0';
            logo = 'https://snapmdadmin.snap-stage.com/api/v2.1/images/ca001725-db79-4cdb-99d1-5193029a884b';
            Hospital = "eVirtualcare";
            HospitalTag = '';
            ssoURL = "";
            break;
        case "Quensic":
            singleStagingHospitalId = 169;
            singleHospitalId = 298;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#275ba9';
            logo = 'https://snapadmin.snap-stage.com/api/v2.1/images/acd5f13c-94b1-49b8-8c86-a84fac870a70';
            Hospital = "Quensic Health";
            HospitalTag = '';
            ssoURL = "";
            break;
        case "Totalcare":
            singleStagingHospitalId = 172;
            singleHospitalId = 283;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#275ba9';
            logo = 'https://snapadmin.snap-stage.com/api/v2.1/images/acd5f13c-94b1-49b8-8c86-a84fac870a70';
            Hospital = "Total Care";
            HospitalTag = '';
            ssoURL = "";
            break;
        case "AvaMD":
            singleStagingHospitalId = 170;
            singleHospitalId = 293;
            singleQAHospitalId = '';
            singleSandboxHospitalId = '';
            brandColor = '#0073c0';
            logo = 'https://connectedcare.md/api/v2.1/images/0ad39512-5d3f-40a4-afa7-e829a1c996f2';
            Hospital = "AVA MD";
            HospitalTag = '';
            ssoURL = "";
            break;
        case "UKOnline":
            singleStagingHospitalId = '';
            singleHospitalId = '';
            singleQAHospitalId = '';
            singleSandboxHospitalId = 129; // 126;
            brandColor = '#007bb6';
            logo = 'https://sandbox.connectedcare.md/api/v2.1/images/9bc12213-bf66-4aa6-81b2-d932d6034690';
            Hospital = 'Online Doctor';
            HospitalTag = 'Your Personal Online Consultation';
            ssoURL = "";
            break;
        case "MDAmerica":
            singleStagingHospitalId = 175;
            singleHospitalId = 191;
            singleQAHospitalId = 205;
            singleSandboxHospitalId = ''; // 126;
            // brandColor = '#d14a43';
            //   logo = 'https://sandbox.connectedcare.md/api/v2.1/images/9bc12213-bf66-4aa6-81b2-d932d6034690';
            Hospital = 'MD America';
            HospitalTag = 'Your Personal Online Consultation';
            ssoURL = "";
            break;
    }

}



var handleOpenURL = function (url) {
    setTimeout(function () {
        window.localStorage.setItem("external_load", null);
        window.localStorage.setItem("external_load", url);

    }, 0);
}

//angular.module('starter', ['ionic', 'ngTouch','starter.controllers', 'starter.services' , 'ngMaterial' ])
angular.module('starter', ['ionic', 'ngTouch', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform, $state, $rootScope, LoginService, $ionicPopup, $window, Idle, $ionicBackdrop, $interval) {

        $ionicPlatform.ready(function () {
            // Idle.watch();

            // var is_iPad = navigator.userAgent.match(/iPad/i) != null;
            // var is_iPadDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

            //console.log(is_iPad);

            function resetSessionLogoutTimer() {
                window.localStorage.setItem('Active', timeoutValue);
                timeoutValue = 0;
                clearSessionLogoutTimer();
                appIdleInterval = $interval(function () {
                    if (window.localStorage.getItem("isCustomerInWaitingRoom") != 'Yes' && window.localStorage.getItem('isVideoCallProgress') != 'Yes') {
                        timeoutValue++;
                        window.localStorage.setItem('InActiveSince', timeoutValue);
                        if (timeoutValue === 30)
                            goInactive();
                    } else {
                        timeoutValue = 0;
                        window.localStorage.setItem('InActiveSince', timeoutValue);
                    }
                }, 60000);
            }

            function clearSessionLogoutTimer() {
                if (typeof appIdleInterval != "undefined") {
                    $interval.cancel(appIdleInterval);
                    appIdleInterval = undefined;
                    appIdleInterval = 0;
                    timeoutValue = 0;
                    window.localStorage.setItem('InActiveSince', timeoutValue);
                }
            }

            $('body').bind('touchstart', function () {
                resetSessionLogoutTimer();
            });

            var timeoutID;
            function setup() {
                this.addEventListener("mousemove", resetTimer, false);
                this.addEventListener("mousedown", resetTimer, false);
                this.addEventListener("keypress", resetTimer, false);
                this.addEventListener("DOMMouseScroll", resetTimer, false);
                this.addEventListener("mousewheel", resetTimer, false);
                this.addEventListener("touchmove", resetTimer, false);
                this.addEventListener("MSPointerMove", resetTimer, false);
                this.addEventListener("touchstart", resetTimer, false);
                this.addEventListener("touchend", resetTimer, false);
                startTimer();
            }

            function startTimer() {
                timeoutID = window.setTimeout(goInactive, 1800000);
            }

            function resetTimer(e) {
                window.clearTimeout(timeoutID);
                goActive();
            }

            //    $rootScope.alertTimedout = "Your session timed out.";
            //    $rootScope.alertokay = "Ok";
            //    $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
            //    $rootScope.alertokay = "Ok";
            //    $rootScope.alertconstarted = "Your consultation is already started on other device.";
            //    $rootScope.alertconended = "Your consultation is already ended.";
            //    $rootScope.alertDone = "Done";
            //    $rootScope.alertconcancel = "Your consultation is cancelled.";
            //    $rootScope.alertconprogress = "Your consultation is in progress on other device.";
            //    $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
            //    $rootScope.YESMessageProviderSearch='Yes';
            //    $rootScope.NaviConfirmation = 'Confirmation:';
            //    $rootScope.alertTimedout = "Your session timed out.";
            //    $rootScope.alertokay = "Ok";
            //    $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
            //    $rootScope.alertconsultationfailed = "Failed to save consultation!";
            //    $rootScope.alertMsg = "A verification email has been sent to the user.";
            //    $rootScope.alertokay = "Ok";
            //    $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
            //    $rootScope.alertMsgvideo = "Consultation ended successfully!";
            //    $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
            //    $rootScope.consultEndMeg = 'Your consultation is already ended.';
            //    $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
            //    $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
            //    $rootScope.sessAlertDone = 'Done';
            //    $rootScope.alertMsgConference = "Consultation ended successfully!";
            //    $rootScope.Buttonmsg = "Done";
            //    $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
            //    $rootScope.consultAlredComplMsg = 'Consultation already completed!';
            //    $rootScope. NaviConfirmation = 'Confirmation:';
            //    $rootScope. YESMessageProviderSearch='Yes';

            //       var localizeCurrent = $('#localize-current').text();
            //       console.log("lang "+localizeCurrent);
            //         if(localizeCurrent == "Español") {
            //         $rootScope.alertTimedout = "Su sesión ha expirado.";
            //         $rootScope.alertokay = "De acuerdo";
            //         $rootScope.alertupload = "No se puede cargar la foto. Por favor, inténtelo de nuevo más tarde.";
            //         $rootScope.alertokay = "De acuerdo";
            //         $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
            //         $rootScope.alertconended = "Su consulta ya ha finalizado.";
            //         $rootScope.alertDone = "Hecho";
            //         $rootScope.alertconcancel = "Su consulta se cancela.";
            //         $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
            //         $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
            //         $rootScope.YESMessageProviderSearch='Sí';
            //         $rootScope.NaviConfirmation = 'Confirmación:';
            //         $rootScope.alertTimedout = "Su sesión ha expirado.";
            //         $rootScope.alertokay = "De acuerdo";
            //         $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
            //         $rootScope.alertconsultationfailed = "Error al guardar consulta!";
            //         $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
            //         $rootScope.alertokay = "De acuerdo";
            //         $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
            //         $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
            //         $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
            //         $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
            //         $rootScope.consultCancelMsg = 'Su consulta se cancela.';
            //         $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
            //         $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
            //         $rootScope.Buttonmsg = "Listo";
            //         $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
            //         $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
            //         $rootScope.NaviConfirmation = 'Confirmación:';
            //         $rootScope.YESMessageProviderSearch='Sí';
            //         }

            //       else  {
            //       $rootScope.alertTimedout = "Your session timed out."
            //       $rootScope.alertokay = "Ok";
            //       $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
            //       $rootScope.alertokay = "Ok";
            //       $rootScope.alertconstarted = "Your consultation is already started on other device.";
            //       $rootScope.alertconended = "Your consultation is already ended.";
            //       $rootScope.alertDone = "Done";
            //       $rootScope.alertconcancel = "Your consultation is cancelled.";
            //       $rootScope.alertconprogress = "Your consultation is in progress on other device.";
            //       $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
            //        $rootScope.YESMessageProviderSearch='Yes';
            //        $rootScope.NaviConfirmation = 'Confirmation:';
            //        $rootScope.alertTimedout = "Your session timed out.";
            //        $rootScope.alertokay = "Ok";
            //        $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
            //        $rootScope.alertconsultationfailed = "Failed to save consultation!";
            //        $rootScope.alertMsg = "A verification email has been sent to the user.";
            //        $rootScope.alertokay = "Ok";
            //        $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
            //        $rootScope.alertMsgvideo = "Consultation ended successfully!";
            //        $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
            //        $rootScope.consultEndMeg = 'Your consultation is already ended.';
            //        $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
            //        $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
            //        $rootScope.sessAlertDone = 'Done';$rootScope.alertMsgConference = "Consultation ended successfully!";
            //        $rootScope.Buttonmsg = "Done";
            //        $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
            //        $rootScope.consultAlredComplMsg = 'Consultation already completed!';
            //        $rootScope. NaviConfirmation = 'Confirmation:';
            //        $rootScope. YESMessageProviderSearch='Yes';
            //         }


            //        $('#localize-langs').click(function() {
            //          var isLang = $('#localize-langs .activated').text();
            //            console.log("lang "+isLang);
            //            if(isLang == "Español") {
            //              $rootScope.alertTimedout = "Su sesión ha expirado.";
            //              $rootScope.alertokay = "De acuerdo";
            //              $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
            //              $rootScope.alertokay = "Ok";
            //              $rootScope.alertconstarted = "Su consulta ya se inició en otro dispositivo.";
            //              $rootScope.alertconended = "Su consulta ya ha finalizado.";
            //              $rootScope.alertDone = "Hecho";
            //              $rootScope.alertconcancel = "Su consulta se cancela.";
            //              $rootScope.alertconprogress = "Su consulta está en progreso en otro dispositivo.";
            //              $rootScope.alertCancelMessageConsultation = "¿Estás seguro de que quieres cancelar esta consulta?";
            //              $rootScope.YESMessageProviderSearch='Sí';
            //              $rootScope.NaviConfirmation = 'Confirmación:';
            //              $rootScope.alertTimedout = "Su sesión ha expirado.";
            //              $rootScope.alertokay = "De acuerdo";
            //             $rootScope.alertconsultationsave = "Consulta guardada exitosamente!";
            //             $rootScope.alertconsultationfailed = "Error al guardar consulta!";
            //             $rootScope.alertMsg = "Se ha enviado un correo electrónico de verificación al usuario.";
            //             $rootScope.alertokay = "De acuerdo";
            //             $rootScope.alertphoto = "La foto se puede subir solo después de activar la cuenta de co-usuario.";
            //             $rootScope.alertMsgvideo = "¡La consulta terminó exitosamente!";
            //             $rootScope.consultStartMsg = 'Su consulta ya se inició en otro dispositivo.';
            //             $rootScope.consultEndMeg = 'Su consulta ya ha finalizado';
            //             $rootScope.consultCancelMsg = 'Su consulta se cancela.';
            //             $rootScope.consultProgMsg = 'Su consulta está en progreso en otro dispositivo.';
            //             $rootScope.alertMsgConference = "¡La consulta terminó exitosamente!";
            //             $rootScope.Buttonmsg = "Listo";
            //             $rootScope.alertconfirm = "Actualmente tiene una consulta en curso. ¿Está seguro de que desea finalizar esta consulta?";
            //             $rootScope.consultAlredComplMsg = 'Consulta ya completada!';
            //             $rootScope.NaviConfirmation = 'Confirmación:';
            //             $rootScope.YESMessageProviderSearch='Sí';
            //            }
            //             else{
            //                 $rootScope.alertTimedout = "Your session timed out."
            //                 $rootScope.alertokay = "Ok";
            //                 $rootScope.alertupload = "Unable to upload the photo. Please try again later.";
            //                 $rootScope.alertokay = "Ok";
            //                 $rootScope.alertconstarted = "Your consultation is already started on other device.";
            //                 $rootScope.alertconended = "Your consultation is already ended.";
            //                 $rootScope.alertDone = "Done";
            //                 $rootScope.alertconcancel = "Your consultation is cancelled.";
            //                 $rootScope.alertconprogress = "Your consultation is in progress on other device.";
            //                 $rootScope.alertCancelMessageConsultation = "Are you sure that you want to cancel this consultation?";
            //                  $rootScope.YESMessageProviderSearch='Yes';
            //                  $rootScope.NaviConfirmation = 'Confirmation:';
            //                  $rootScope.alertTimedout = "Your session timed out.";
            //                  $rootScope.alertokay = "Ok";
            //                  $rootScope.alertconsultationsave = "Consultation saved successfully!" ;
            //                  $rootScope.alertconsultationfailed = "Failed to save consultation!";
            //                  $rootScope.alertMsg = "A verification email has been sent to the user.";
            //                  $rootScope.alertokay = "Ok";
            //                  $rootScope.alertphoto = "Photo can be uploaded only after activating co-user account.";
            //                  $rootScope.alertMsgvideo = "Consultation ended successfully!";
            //                  $rootScope.consultStartMsg = 'Your consultation is already started on other device.';
            //                  $rootScope.consultEndMeg = 'Your consultation is already ended.';
            //                  $rootScope.consultCancelMsg = 'Your consultation is cancelled.';
            //                  $rootScope.consultProgMsg = 'Your consultation is in progress on other device.';
            //                  $rootScope.sessAlertDone = 'Done';
            //                  $rootScope.alertMsgConference = "Consultation ended successfully!";
            //                  $rootScope.Buttonmsg = "Done";
            //                  $rootScope.alertconfirm = "You currently have a consultation in progress.Are you sure you want to end this consultation?";
            //                  $rootScope.consultAlredComplMsg = 'Consultation already completed!';
            //                  $rootScope. NaviConfirmation = 'Confirmation:';
            //                  $rootScope. YESMessageProviderSearch='Yes';
            //             }
            //           });


            function goInactive() {
                if ($state.$current.name !== "tab.waitingRoom" && $state.$current.name !== "tab.videoConference" && $state.$current.name !== "tab.videoLost") {
                    var inactiveDuration = window.localStorage.getItem('InActiveSince');
                    var isCustomerInWaitingRoomVal = window.localStorage.getItem("isCustomerInWaitingRoom");
                    var isVideoCallProgressVal = window.localStorage.getItem('isVideoCallProgress')
                    inactiveDuration = Number(inactiveDuration);
                    if (inactiveDuration === 30) {
                        if (window.localStorage.getItem("tokenExpireTime") != null && window.localStorage.getItem("tokenExpireTime") != "") {
                            if (isCustomerInWaitingRoomVal != 'Yes' && isVideoCallProgressVal != 'Yes') {
                                $(".ion-google-place-container").css({
                                    "display": "none"
                                });
                                $ionicBackdrop.release();
                                window.localStorage.setItem('Inactive Success', timeoutValue);
                                timeoutValue = 0;
                                clearSessionLogoutTimer();

                                var localizeCurrent = $('#localize-current').text();
                                console.log("lang " + localizeCurrent);
                                if (localizeCurrent == "Español") {
                                    var SessTimedOutMsg = 'Su sesión ha excedido el tiempo de espera.';
                                    var SessTimedOk = 'De acuerdo';
                                } else {
                                    var SessTimedOutMsg = 'Your session timed out.';
                                    var SessTimedOk = 'Ok';
                                }
                                if ($rootScope.currState.$current.name == "tab.addnewdependent") {
                                    if ($rootScope.flagdeptmodal == true) {
                                        navigator.notification.alert(

                                            $rootScope.alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    } else {
                                        $rootScope.removemodal();
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    }
                                } else if ($rootScope.currState.$current.name == "tab.healthinfo") {
                                    if ($rootScope.flagmodal == true) {
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title
                                            alertokay // buttonName
                                        );

                                        return false;
                                    } else {
                                        $rootScope.editremovemodal();
                                        navigator.notification.alert(

                                            alertTimedout, // message
                                            function () {
                                                $rootScope.ClearRootScope();
                                                return;
                                            },
                                            $rootScope.alertMsgName, // title

                                            alertokay // buttonName
                                        );
                                        return false;
                                    }
                                }
                                else {
                                    navigator.notification.alert(

                                        alertTimedout, // message
                                        function () {
                                            $rootScope.ClearRootScope();
                                            return;
                                        },
                                        $rootScope.alertMsgName // title

                                    );
                                    return false;
                                }

                            }
                        }
                    }
                }
            }
            function goActive() {
                console.log('Active');
                startTimer();
            }


            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.localStorage.getItem("app_load") == "yes") {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 500);
            } else {
                //setTimeout(function() {
                window.localStorage.setItem("app_load", "yes");
                //navigator.splashscreen.hide();
                //}, 10000);
            }
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            var initialScreenSize = window.innerHeight;
            window.addEventListener("resize", function () {
                if (window.innerHeight < initialScreenSize) {
                    $(".has-footer").css({
                        "bottom": 0
                    });
                    $(".footer").hide();
                } else {
                    $(".footer").show();
                }
            });
            /*                $rootScope.flagpopup=false;
                        // An elaborate, custom popup
                        myPopup = $ionicPopup.show({
                          template: '<b>Please make sure that you have network connection.</b>',
                          title: 'No Internet Connection',
                          cssClass: 'my-custom-popup',
                          buttons: [
                                 { text: '<b class="ietfonttype">ok</b>',
                                   type:'button',
                                }
                              ]
    
                            });
               myPopup.then(function(res) {
                 console.log('Tapped!', res);
               });
               navigator.notification.alert(
                     'Please make sure that you have network connection.', // message
                     null,
                     'No Internet Connection', // title
                     'Ok' // buttonName
                 );*/


            setTimeout(function () {
                document.addEventListener("offline", onOffline, false);
                document.addEventListener("online", onOnline, false);
            }, 100);
            $rootScope.flagpopup = true;
            var myPopup;
            function onOffline() {
                $rootScope.online = navigator.onLine;
                if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
                    $rootScope.connAlertStatus = true;
                    $('#thumbVideos').remove();
                    $('#videoControls').remove();
                    session.unpublish(publisher)
                    session.disconnect();
                    $('#publisher').hide();
                    $('#subscriber').hide();
                    OT.updateViews();
                    $state.go('tab.videoLost', { retry: 1 });
                } else {
                    $rootScope.connAlertStatus = true;
                    $('.popup').addClass("ietpopup");
                    $('.popup-title').addClass("iettitle");
                    $('.popup-buttons').addClass("ietpopup-buttons");
                    $('.dialogbox--person-location').css("visibility", "hidden");
                    $('.dialogbox-master').css("visibility", "hidden");
                    $('#scd-bdy').css("visibility", "hidden");
                    $rootScope.alertPopupA = function () {
                        $rootScope.flagpopup = false;
                        var myPopup = $ionicPopup.show({

                            template: '<b class="localizejs">Please make sure that you have network connection.</b>',
                            title: '<span class="localizejs">No Internet Connection</span>',
                            rootScope: $rootScope,
                            cssClass: 'my-custom-popup',
                            buttons: [{
                                text: '<b class="ietfonttype localizejs">ok</b>',
                                type: 'button',
                            }]
                        });

                        myPopup.then(function (res) {
                            if (res) {
                                console.log('res', res);
                            } else {
                                console.log('else');
                            }
                        });
                        $rootScope.closepopup = function () {
                            myPopup.close();
                            $('.dialogbox--person-location').css("visibility", "visible");
                            $('.dialogbox-master').css("visibility", "visible");
                            $('#scd-bdy').css("visibility", "visible");
                            $rootScope.flagpopup = true;
                        }
                    }
                    if ($rootScope.flagpopup === true) {
                        $rootScope.alertPopupA();
                    }

                }
                return false;
            }

            function onOnline() {
                console.log('Closing in controller!');

                $rootScope.connAlertStatus = false;
                $rootScope.online = navigator.onLine;
                if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
                    $state.go('tab.videoLost', { retry: 2 });
                } else {
                    if ($state.$current.name == "tab.waitingRoom")
                        $rootScope.waitingroomlostconnection();
                    //  if($rootScope.flagpopup==false){
                    $rootScope.closepopup();
                    //}
                }
            }

            // cordova.plugins.backgroundMode.setDefaults({
            //     text: $rootScope.alertMsgName
            // });
            // cordova.plugins.backgroundMode.enable();

            /*  cordova.plugins.backgroundMode.onactivate = function () {
                var i = 0;
                var alive_waiting_room_pool;
                alive_waiting_room_pool = setInterval(function(){
                     if(window.localStorage.getItem("isCustomerInWaitingRoom") == "Yes"){
                          i++;
                          vConsultationWatingId = window.localStorage.getItem("waitingRoomConsultationId");
                          vAccessToken = window.localStorage.getItem("accessToken");
                          var alive_timestamp_url = apiCommonURL + '/api/v2/patients/activeconsultations/' + vConsultationWatingId + '/alive-timestamp';
                          var reqHeaders = util.getHeaders();
                          reqHeaders['Authorization'] = "Bearer " + vAccessToken;
                          $.ajax({
                              type: 'PUT',
                              headers: reqHeaders,
                              url: alive_timestamp_url,
                              //dataType: 'json',
                              success: function(data){
                                console.log('Success at ' + i);
                              },
                              failure: function(error){
                                console.log('Failed at ' + 1);
                              }
                          });
                     }
                }, 30000);
            }*/

            // cordova.plugins.backgroundMode.onactivate = function () {
            //     var backGroundNetConnection;
            //     backGroundNetConnection = setInterval(function () {
            //         //  $rootScope.flagpopup=true;
            //         var myPopup;
            //         $rootScope.online = navigator.onLine;

            //         $window.addEventListener("offline", function () {
            //             $rootScope.$apply(function () {
            //                 if ($rootScope.connAlertStatus !== true) {
            //                     $rootScope.online = navigator.onLine;
            //                     if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
            //                         console.log('gggg5');
            //                         $('#thumbVideos').remove();
            //                         $('#videoControls').remove();
            //                         session.unpublish(publisher)
            //                         session.disconnect();
            //                         $('#publisher').hide();
            //                         $('#subscriber').hide();
            //                         OT.updateViews();
            //                     } else {
            //                         $('.popup').addClass("ietpopup");
            //                         $('.popup-title').addClass("iettitle");
            //                         $('.popup-buttons').addClass("ietpopup-buttons");
            //                         $('.dialogbox--person-location').css("visibility", "hidden");
            //                         $('.dialogbox-master').css("visibility", "hidden");
            //                         $('#scd-bdy').css("visibility", "hidden");
            //                         $rootScope.alertPopupA = function () {
            //                             $rootScope.flagpopup = false;
            //                             var myPopup = $ionicPopup.show({
            //                                 template: '<b class="localizejs">Please make sure that you have network connection.</b>',
            //                                 title: '<span class="localizejs">No Internet Connection</span>',
            //                                 rootScope: $rootScope,
            //                                 cssClass: 'my-custom-popup',
            //                                 buttons: [{
            //                                     text: '<b class="ietfonttype localizejs">ok</b>',
            //                                     onTap: function (e) {
            //                                         return false;
            //                                     }
            //                                 }]
            //                             });

            //                             myPopup.then(function (res) {
            //                                 if (res) {
            //                                     console.log('res', res);
            //                                 } else {
            //                                     console.log('else');
            //                                 }
            //                             });
            //                             $rootScope.closepopup = function () {
            //                                 myPopup.close();
            //                                 $('.dialogbox--person-location').css("visibility", "visible");
            //                                 $('.dialogbox-master').css("visibility", "visible");
            //                                 $('#scd-bdy').css("visibility", "visible");
            //                                 $rootScope.flagpopup = true;
            //                             }
            //                         }
            //                         if ($rootScope.flagpopup === true) {
            //                             $rootScope.alertPopupA();
            //                         }

            //                     }
            //                 }
            //                 return false;
            //             });
            //         }, false);

            //         $window.addEventListener("online", function () {
            //             $rootScope.$apply(function () {
            //                 console.log('Closing in controller!');
            //                 $rootScope.online = navigator.onLine;
            //                 if ($rootScope.connAlertStatus !== false) {
            //                     if (window.localStorage.getItem('isVideoCallProgress') == "Yes") {
            //                         $rootScope.netConnectionStaus = true;
            //                     } else {
            //                         //if($rootScope.flagpopup==false){
            //                         $rootScope.closepopup();
            //                         //}
            //                     }
            //                 }
            //             });
            //         }, false);
            //     }, 30000);
            // }

            setTimeout(function () {
                //  Idle.watch();
                if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "" && window.localStorage.getItem("external_load") != "null") {
                    if (window.localStorage.getItem("external_load").indexOf('jwt') >= 0) {
                        var extQuery = window.localStorage.getItem("external_load").split('?');
                        var extQueryOnly = extQuery[2];
                        var query = extQueryOnly.split("&");
                        var jwtTokenString = query[0].split("=");
                        window.localStorage.setItem("external_load", null);
                        if (jwtTokenString[1] != "" && jwtTokenString[1] != "undefined") {
                            $state.go('tab.ssoJWTPage', {
                                jwtToken: jwtTokenString[1]
                            });
                        } else if (loginPageEnv === 'Single') {
                            $state.go('tab.loginSingle');
                        } else if (loginPageEnv === 'Multiple') {
                            $state.go('tab.chooseEnvironment');
                        } else if (loginPageEnv === 'Production') {
                            $state.go('tab.login');
                        }
                    } else {
                        var EXTRA = {};
                        var extQuery = window.localStorage.getItem("external_load").split('?')
                        var extQueryOnly = extQuery[1];

                        var query = extQueryOnly.split("&");

                        for (var i = 0, max = query.length; i < max; i++) {
                            if (query[i] === "") // check for trailing & with no param
                                continue;

                            var param = query[i].split("=");
                            EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                        }
                        window.localStorage.setItem("external_load", null);
                        if (deploymentEnv != 'Single') {
                            if (EXTRA['env'] != "") {
                                var dEnv = EXTRA['env'];
                                if (dEnv.toUpperCase() == "SANDBOX") {
                                    deploymentEnv = "Sandbox";
                                    apiCommonURL = 'https://sandbox.connectedcare.md';
                                } else if (dEnv.toUpperCase() == "QA") {
                                    deploymentEnv = "QA";
                                    apiCommonURL = 'https://emerald.qa1.snapvcm.com';
                                } else if (dEnv.toUpperCase() == "PRODUCTION") {
                                    deploymentEnv = "Production";
                                    apiCommonURL = 'https://connectedcare.md';
                                } else if (dEnv.toUpperCase() == "STAGE") {
                                    deploymentEnv = "Staging";
                                    apiCommonURL = 'https://emerald.stage.snapvcm.com';
                                } else if (dEnv.toUpperCase() == "DEMO") {
                                    deploymentEnv = "Demo";
                                    apiCommonURL = 'https://demo.connectedcare.md';
                                }
                            }
                        }
                        if (EXTRA['token'] != "" && EXTRA['env'] != "" && EXTRA['token'] != "undefined" && EXTRA['env'] != "undefined") {
                            $state.go('tab.interimpage', {
                                token: EXTRA['token'],
                                hospitalId: EXTRA['hospitalId'],
                                consultationId: EXTRA['consultationId']
                            });
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Multiple') {
                            $state.go('tab.chooseEnvironment');
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Single') {
                            $state.go('tab.loginSingle');
                        } else if (EXTRA['env'] != "" && loginPageEnv == 'Production') {
                            $state.go('tab.login');
                        }
                    }
                }
            }, 2000);
            $ionicPlatform.on('resume', function () {
                if (typeof alive_waiting_room_pool != "undefined")
                    clearInterval(alive_waiting_room_pool);
                alive_waiting_room_pool = undefined;
                setTimeout(function () {
                    if ($rootScope.netConnectionStaus === true) {
                        $state.go('tab.videoLost', { retry: 2 });
                        //$state.go('tab.login');
                    }
                    //  Idle.watch();
                    if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "" && window.localStorage.getItem("external_load") != "null") {
                        if (window.localStorage.getItem("external_load").indexOf('jwt') >= 0) {
                            var extQuery = window.localStorage.getItem("external_load").split('?');
                            var extQueryOnly = extQuery[2];
                            var query = extQueryOnly.split("&");
                            var jwtTokenString = query[0].split("=");
                            window.localStorage.setItem("external_load", null);
                            if (jwtTokenString[1] != "" && jwtTokenString[1] != "undefined") {
                                $state.go('tab.ssoJWTPage', {
                                    jwtToken: jwtTokenString[1]
                                });
                            } else if (loginPageEnv === 'Single') {
                                $state.go('tab.loginSingle');
                            } else if (loginPageEnv === 'Multiple') {
                                $state.go('tab.chooseEnvironment');
                            } else if (loginPageEnv === 'Production') {
                                $state.go('tab.login');
                            }
                        } else {
                            var EXTRA = {};
                            var extQuery = window.localStorage.getItem("external_load").split('?')
                            var extQueryOnly = extQuery[1];

                            var query = extQueryOnly.split("&");

                            for (var i = 0, max = query.length; i < max; i++) {
                                if (query[i] === "") // check for trailing & with no param
                                    continue;

                                var param = query[i].split("=");
                                EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                            }
                            window.localStorage.setItem("external_load", null);
                            if (deploymentEnv != 'Single') {
                                if (EXTRA['env'] != "") {
                                    var dEnv = EXTRA['env'];
                                    if (dEnv.toUpperCase() == "SANDBOX") {
                                        deploymentEnv = "Sandbox";
                                        apiCommonURL = 'https://sandbox.connectedcare.md';
                                    } else if (dEnv.toUpperCase() == "QA") {
                                        deploymentEnv = "QA";
                                        apiCommonURL = 'https://emerald.qa1.snapvcm.com';
                                    } else if (dEnv.toUpperCase() == "PRODUCTION") {
                                        deploymentEnv = "Production";
                                        apiCommonURL = 'https://connectedcare.md';
                                    } else if (dEnv.toUpperCase() == "STAGE") {
                                        deploymentEnv = "Staging";
                                        apiCommonURL = 'https://emerald.stage.snapvcm.com';
                                    } else if (dEnv.toUpperCase() == "DEMO") {
                                        deploymentEnv = "Demo";
                                        apiCommonURL = 'https://demo.connectedcare.md';
                                    }
                                }
                            }
                            if (EXTRA['token'] != "" && EXTRA['env'] != "" && EXTRA['token'] != "undefined" && EXTRA['env'] != "undefined") {
                                $state.go('tab.interimpage', {
                                    token: EXTRA['token'],
                                    hospitalId: EXTRA['hospitalId'],
                                    consultationId: EXTRA['consultationId']
                                });
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Multiple') {
                                $state.go('tab.chooseEnvironment');
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Single') {
                                $state.go('tab.loginSingle');
                            } else if (EXTRA['env'] != "" && loginPageEnv == 'Production') {
                                $state.go('tab.login');
                            }
                        }
                    }
                }, 2000);
            });
        });

    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, IdleProvider, KeepaliveProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content):/);
        //IdleProvider.idle(600); // in seconds
        //  IdleProvider.timeout(600); // in seconds
        //  KeepaliveProvider.interval(60); // in seconds
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.serviceUnavailableError', {
                url: '/serviceUnavailableError/:lastFunctionCall/:serviceUnavailableError',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-serviceUnavailableError.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.loginSingle', {
                url: '/loginSingle',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-loginSingle.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.provider', {
                url: '/provider',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-provider.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.terms', {
                url: '/terms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-terms.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.password', {
                url: '/password',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-password.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.resetPassword', {
                url: '/resetPassword',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-resetPassword.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.userhome', {
                url: '/userhome',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userhome.html',
                        controller: 'LoginCtrl'
                    }
                }
            }).state('tab.CurrentLocationlist', {
                url: '/CurrentLocationlist',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-CurrentLocationlist.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.patientDetail', {
                url: '/patientDetail',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientDetail.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.patientCalendar', {
                url: '/patientCalendar',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientCalendar.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            /*.state('tab.updationpopup', {
                url: '/patientCalendar',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-updationpopup.html',
                        controller: 'LoginCtrl'
                    }
                }
            })*/
            .state('tab.appoimentDetails', {
                url: '/appoimentDetails/:getPage',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appoimentDetails.html',
                        controller: 'appoimentDetailsCtrl'
                    }
                }
            })
            .state('tab.patientConcerns', {
                url: '/patientConcerns',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-patientConcerns.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.appointmentDialog', {
                url: '/appointmentDialog',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-appointmentDialog.html',
                        controller: ''
                    }
                }
            })
            .state('tab.confirmPatientAddressDialog', {
                url: '/confirmPatientAddressDialog',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-confirmPatientAddressDialog.html',
                        controller: ''
                    }
                }
            })
            .state('tab.providerSearch', {
                url: '/providerSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-providerSearch.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })

            .state('tab.providerBody', {
                url: '/providerSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-providerBody.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })

            .state('tab.overlay', {
                url: '/overlay',
                views: {
                    'tab-login': {
                        templateUrl: 'schedule/tab-overlay.html',
                        controller: 'ScheduleCtrl'
                    }
                }
            })
            .state('tab.ChronicCondition', {
                url: '/ChronicCondition',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ChronicCondition.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.priorSurgeries', {
                url: '/priorSurgeries',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-priorSurgeries.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.CurrentMedication', {
                url: '/CurrentMedication',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-CurrentMedication.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.intakeBornHistory', {
                url: '/intakeBornHistory',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-intakeBornHistory.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.MedicationAllegies', {
                url: '/MedicationAllegies',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-MedicationAllegies.html',
                        controller: 'IntakeFormsCtrl'
                    }
                }
            })
            .state('tab.ConsentTreat', {
                url: '/ConsentTreat/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ConsentTreat.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultCharge', {
                url: '/consultCharge/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultCharge.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.addHealthPlan', {
                url: '/addHealthPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addHealthPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.planDetails', {
                url: '/planDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-planDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.planeditDetails', {
                url: '/planeditDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-planeditDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.applyPlan', {
                url: '/applyPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-applyPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.addCard', {
                url: '/addCard',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addCard.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultChargeNoPlan', {
                url: '/consultChargeNoPlan',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultChargeNoPlan.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.cardDetails', {
                url: '/cardDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-cardDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.cardeditDetails', {
                url: '/cardeditDetails',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-cardeditDetails.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.submitPayment', {
                url: '/submitPayment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-submitPayment.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.receipt', {
                //url: '/receipt',
                url: '/receipt/:getPage/:getconsultId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-receipt.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.waitingRoom', {
                url: '/waitingRoom',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-waitingRoom.html',
                        controller: 'waitingRoomCtrl'
                    }
                }
            })
            .state('tab.videoConference', {
                url: '/videoConference',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-videoConference.html',
                        controller: 'ConferenceCtrl'
                    }
                }
            })
            .state('tab.connectionLost', {
                url: '/connectionLost',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-connectionLost.html',
                        controller: 'connectionLostCtrl'
                    }
                }
            })
            .state('tab.ReportScreen', {
                url: '/ReportScreen',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ReportScreen.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.interimpage', {
                url: '/interimpage/:token/:hospitalId/:consultationId',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-interimpage.html',
                        controller: 'InterimController'
                    }
                }
            })
            .state('tab.ssoJWTPage', {
                url: '/ssoJWTPage/:jwtToken',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-ssoJWTPage.html',
                        controller: 'SSOJWTParsingController'
                    }
                }
            })
            .state('tab.chooseEnvironment', {
                url: '/chooseEnvironment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-chooseEnvironment.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('tab.singleTerms', {
                url: '/singleTerms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-singleTerms.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.singleTheme', {
                url: '/singleTheme',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-singleTheme.html',
                        controller: 'singleHospitalThemeCtrl'
                    }
                }
            })
            .state('tab.searchprovider', {
                url: '/searchprovider',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-searchprovider.html',
                        controller: 'searchProviderController'
                    }
                }
            })
            .state('tab.registerStep1', {
                url: '/registerStep1',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerStep1.html',
                        controller: 'registerStep1Controller'
                    }
                }
            })
            .state('tab.registerAddress', {
                url: '/registerAddress',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerAddress.html',
                        controller: 'registerStep1Controller'
                    }
                }
            })
            .state('tab.userAccount', {
                url: '/userAccount',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userAccount.html',
                        controller: 'userAccountCtrl'
                    }
                }
            })
            .state('tab.healthinfo', {
                url: '/healthinfo/:getid',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-healthinfo.html',
                        controller: 'healthinfoController'
                    }
                }
            })
            .state('tab.userAppointment', {
                url: '/userAppointment',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-userAppointment.html',
                        controller: ''
                    }
                }
            })
            .state('tab.addUser', {
                url: '/addUser',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addUser.html',
                        controller: 'newuserController'
                    }
                }
            })
            .state('tab.registerStep2', {
                url: '/registerStep2',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerStep2.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.registerSuccess', {
                url: '/registerSuccess',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerSuccess.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.registerTerms', {
                url: '/registerTerms',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-registerTerms.html',
                        controller: 'registerStep2Controller'
                    }
                }
            })
            .state('tab.relatedusers', {
                url: '/relatedusers',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-relatedusers.html',
                        controller: 'relateduserController'
                    }
                }
            })
            .state('tab.appointmentpatientdetails', {
                //  url: '/videoLost/:retry',
                url: '/appointmentpatientdetails/:getPage',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appointmentpatientdetails.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            .state('tab.profileoption', {
                url: '/profileoption',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-profileoption.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.consultations', {
                url: '/consultations',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultations.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.reports', {
                url: '/reports',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-reports.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.missedConsultAppoint', {
                url: '/missedConsultAppoint',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-missedConsultAppoint.html',
                        controller: 'consultationController'
                    }
                }
            })
            .state('tab.addnewuser', {
                url: '/addnewuser',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addnewuser.html',
                        controller: 'addnewuserController'
                    }
                }
            })
            .state('tab.addnewdependent', {
                url: '/addnewdependent',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addnewdependent.html',
                        controller: 'addnewdependentController'
                    }
                }
            })
            .state('tab.consultationSearch', {
                url: '/consultationSearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-consultationSearch.html',
                        controller: 'consultationController'

                    }
                }
            })
            .state('tab.currentmedicationsearch', {
                url: '/currentmedicationsearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-currentmedicationsearch.html',
                        controller: 'healthinfocontroller'
                    }
                }
            })
            .state('tab.addpatientid', {
                url: '/addpatientid',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-addpatientid.html',
                        controller: 'healthinfocontroller'
                    }
                }
            })

            .state('tab.appointmentpatientdetailssearch', {
                url: '/appointmentpatientdetailssearch',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-appointmentdetailssearch.html',
                        controller: 'patientCalendarCtrl'
                    }
                }
            })
            .state('primaryPatientSideMenu', {
                url: '/',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/primaryPatientSideMenu.html',
                        controller: 'sidemenuController'
                    }
                }
            })
            .state('tab.videoLost', {
                url: '/videoLost/:retry',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-videoLost.html',
                        controller: 'videoLostCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback tab-chooseEnvironment

        if (deploymentEnv == "Multiple") {
            $urlRouterProvider.otherwise('/tab/chooseEnvironment');
        } else if (deploymentEnv == "Single") {
            $urlRouterProvider.otherwise('/tab/singleTheme');
            // if(cobrandApp == 'Hello420')
            // 	$urlRouterProvider.otherwise('/tab/singleTheme');
            // else
            // 	$urlRouterProvider.otherwise('/tab/loginSingle');
        } else {
            $urlRouterProvider.otherwise('/tab/login');
        }

    });

function generateTextImage(text, bgcolor) {
    if (!bgcolor) {
        bgcolor = 'f54f2b';
    }
    bgcolor = bgcolor.replace('#', '');
    return "https://placeholdit.imgix.net/~text?txtsize=120&txtclr=ffffff&w=200&h=200&bg=" + bgcolor + "&txt=" + text;
}

function getInitialForName(name) {
    var initial = "";
    if (name) {
        name = name.toUpperCase();
        name = name.replace('  ', ' ');
        name = name.trim()
        var names = name.split(' ');
        initial = initial + names[0].substring(0, 1);
        if (names[1])
            initial = initial + names[1].substring(0, 1);
        else
            initial = name.substring(0, 2);
    }
    return initial;
}
function getInitialFromName(firstName, LastName) {
    var initial = "";
    var name = firstName + ' ' + LastName;
    if (!angular.isUndefined(firstName) && firstName !== '') {
        name = name.toUpperCase();
        name = name.replace('  ', ' ');
        name = name.trim()
        var names = name.split(' ');
        initial = initial + names[0].substring(0, 1);
        if (names[1])
            initial = initial + names[1].substring(0, 1);
        else
            initial = name.substring(0, 2);
    }
    return initial;
}

function getOnlyPhoneNumber(phoneNumber) {
    return phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length);
}

function formatHeightVal(height) {
    var h = height.split('.');
    var hv = h[0] + "|";
    if (h[1])
        hv = hv + h[1];
    else
        hv = hv + "0";
    return hv;
}

function getAge(birth) {
    var today = new Date();
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();
    var birthage = new Date(birth);
    var birthyear = birthage.getFullYear();
    var birthmonth = birthage.getMonth();
    var birthday = birthage.getDate();
    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;
    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        age = parseInt(age) - 1;
    }
    return age;
}
var createSVGIcon = function (iconName) {
    return "<svg class='icon-" + iconName + " svgIcon" + iconName + " svgIconForVideo'><use xlink:href='symbol-defs.svg#icon-" + iconName + "'></use></svg>";
};
//snapmdconnectedcare://?token=RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ&hospitalId=126&consultationId=
//vc126://??jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6ImJl…y6_DhMlvg3rqavL8l38Hdu3CKu4iQYhlsnS5U7wxeXOL0qGAbSmTdrADW9DnYCc&state={123}

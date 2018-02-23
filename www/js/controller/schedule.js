angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {
        //var snap = snap || {};
      $("#localize-widget").hide();
        var localizeCurrent = $('#localize-current').text();
      console.log("localizeCurrent is== "+localizeCurrent);
           if(localizeCurrent == "Español"){
              //  var snap = snap || {};
               // $("#retrySpanish").text("Rever?");
               $("#retrySpanish").css("color", "Red");
               // $(".drawer-card--empty.is-active::after").css({"content":"No hay proveedores guardados todavía."});
               $('head').append('<style>.drawer-card--empty.is-active:before{content:"No hay proveedores guardados todavía." !important;}</style>');
                $('head').append('<style>.drawer-card--empty.is-active::after{content:"Agregue proveedores a su lista seleccionando la estrella en su tarjeta de perfil." !important;}</style>');
               // $('head').append('<style>.column:before{width:800px !important;}</style>');
               snap.alertTimedout = "Su sesión ha expirado.";
               snap.alertokay = "De acuerdo";
               snap.alertInternetConnection ="Sin conexión a Internet.";
               snap.sessAlertDone = "Hecho";
               snap.ssConnectLost = "La conexión al sistema se pierde.";
               snap.sessAlertMessage = "Ha iniciado sesión en otro dispositivo y finalizó esta sesión.";
               snap.YESMessageProviderSearch='Sí';
               //sessAlertMessage = "Has iniciado sesión en otro dispositivo.";
               snap.SessTimedOutMsg = 'Su sesión ha excedido el tiempo de espera.';
               snap.SessTimedOk = 'De acuerdo';
               snap.lanName = 'Spanish';
           }else{
               //var snap = snap || {};
               // $("#retrySpanish").text("Retry?");
               $("#retrySpanish").css("color", "Pink");
               $('head').append('<style>.drawer-card--empty.is-active:before{content:"No saved providers yet." !important;}</style>');
               $('head').append('<style>.drawer-card--empty.is-active:after{content:"Add providers to your list by selecting the star on their profile card." !important;}</style>');
              snap.alertTimedout = "Your session timed out."
              snap.alertokay = "Ok";
              snap.alertInternetConnection ="No Internet Connection.";
              snap.sessAlertDone = "Done";
              snap.ssConnectLost = "Connection to the system is lost.";
              snap.sessAlertMessage = "You have logged in on another device and ended this session.";
              snap.YESMessageProviderSearch='Yes';
            //  sessAlertMessage = "You have logged in on another device.";
              snap.SessTimedOutMsg = 'Your session timed out.';
              snap.SessTimedOk = 'Ok';
              snap.lanName = 'English';
           }

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

        var vm = '';
        var headerVM = '';
        snap.baseUrl  = apiCommonURL;
        snap.appName = $rootScope.alertMsgName;
        if (deploymentEnvLogout === "Multiple") {
              snap.redirctPage = '#/tab/chooseEnvironment';
        } else if (cobrandApp === 'MDAmerica' && deploymentEnvLogout === "Single") {
                 snap.redirctPage = '#/tab/singleTheme';
        }else if (cobrandApp !== 'MDAmerica' && deploymentEnvLogout === "Single") {
            snap.redirctPage = '#/tab/singleTheme';
        }else {
           snap.redirctPage = '#/tab/login';
        }

        $rootScope.chkSSPageEnter = true;
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
            $rootScope.changeptienthome=function(){
              $rootScope.doGetPatientProfiles();
              $state.go('tab.userhome');
            }
            $("#localize-widget").hide();
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

      $rootScope.doGetUserTimezone = function() {
        $("#localize-widget").hide();
          var params = {
              accessToken: $rootScope.accessToken,
              success: function(data) {
                var userData = {};
                userData.apiDeveloperId = snap.userSession.apiDeveloperId;
                userData.apiKey = snap.userSession.apiKey;
                userData.token = snap.userSession.token;
                userData.snapLogin = true;
                userData.timeZoneSystemId = data.message;
                snap.userSession.timeZoneSystemId = data.message;
                var userDataJsonData = JSON.stringify(userData);
                $window.localStorage.setItem('snap_user_session', userDataJsonData);
                  if(userData.timeZoneSystemId !== '') {
                    $("#localize-widget").hide();
                            snap.cachedGetHtml("schedule/tab-providerBody.html").then(function(html) {
                              $("#localize-widget").hide();
                                $(".schedular-continer").html(html);
                                $("#localize-widget").hide();
                                var chkClass = $("body").hasClass("is-main-nav");
                                if(chkClass) {
                                  $("body").removeClass("is-main-nav");
                                }
                                $(".button__cancel").click();
                                snap.updateSnapJsSession("snap_user_session", "timeZoneSystemId", snap.userSession.timeZoneSystemId);
                                snap.resolveObject("snap.patient.schedule");
                                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                                var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");
                                headerVM.vm_isSearchBarActive = false;
                                headerVM.vm_isPatientSelectorActive = false;
                                headerVM.set("moduleTitle", "Provider");
                                headerVM.set("subModuleTitle", "All providers");
                                headerVM.isFavoriteCliniciansMode = true;
                                 $("#relatedUsrTab").css("display", "none");
                                if (!$rootScope.isIPad) {
                                     $("#searchFilter").css("display", "none");
                                }
                                kendo.bind($("#scd-bdy"), vm);
                                kendo.bind($(".header__patient-ss"), headerVM);
                                var viewMode = "all"; //$stateParams.viewMode; //"favorite";
                                $("#myProvider").removeClass("is-active");
                                $("#allProvider").addClass("is-active");
                                if (vm) {
                                    //  vm.isDataInit = false;
                                   //if (!vm.isDataInit) {  //If we enable this, scroll is not working.
                                        vm.load();
                                    //  }
                                      vm.setViewMode(viewMode);

                                  // vm.vm_favoriteClinicianCardsList_onDataBound();
                                }
                            });
                        }
              },
              error: function(data, status) {
                  if (status === 0) {
                      $scope.ErrorMessage = "Internet connection not available, Try again later!";
                      $rootScope.Validation($scope.ErrorMessage);

                  } else if (status === 401) {
                      $scope.ErrorMessage = "You are not authorized to view this account";
                      $rootScope.Validation($scope.ErrorMessage);

                  } else {
                      $rootScope.serverErrorMessageValidation();
                  }
              }
          };

          LoginService.getUserTimezone(params);
      }


        this.initSnapVars = function() {
          $("#localize-widget").hide();
            // snap.baseUrl = "https://emerald.snap-qa.com";
            snap.userSession = JSON.parse($window.localStorage.getItem("snap_user_session"));
            snap.profileSession = JSON.parse($window.localStorage.getItem("snap_patientprofile_session"));
            snap.hospitalSession = JSON.parse($window.localStorage.getItem("snap_hospital_session"));
            snap.hospitalSettings = JSON.parse($window.localStorage.getItem("snap_hospital_settings"));
            $rootScope.brandName = snap.hospitalSession.brandName;
            $rootScope.doGetUserTimezone();
        }
        $('.appoitEditPop').css('background-color', brandColor);

        this.initKendoUI = function() {
            //if(snap.profileSession === undefined) {
            $("#searchFilter").removeClass("is-active");
              $("#searchTab").removeClass("is-active");
              $("#myProvider").removeClass("is-active");
              $("#allProvider").addClass("is-active");
              $(".button__cancel").click();
              this.initSnapVars();
          //  }
        }
        this.initKendoUI();

        $scope.getDetails = function(userName) {
          $("#localize-widget").hide();
            if($('#searchTab').attr("class") != 'menu-toggle__navigation is-active') {
                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");

                if (userName === 'favorite') {
                    headerVM.vm_isSearchBarActive = false;
                    $("#searchFilter").removeClass("is-active");
                    $("#searchTab").removeClass("is-active");
                    $("#allProvider").removeClass("is-active");
                    $("#myProvider").addClass("is-active");
                  //  headerVM.set("subModuleTitle", "My provider");
                } else if (userName === 'all') {
                  headerVM.vm_isSearchBarActive = false;
                  $("#searchFilter").removeClass("is-active");
                    $("#searchTab").removeClass("is-active");
                    $("#myProvider").removeClass("is-active");
                    $("#allProvider").addClass("is-active");
                  //  headerVM.set("subModuleTitle", "All providers");
                  }
            //  kendo.bind($("#scd-bdy"), vm);
              var viewMode = userName; //$stateParams.viewMode; //"favorite";

              if (vm) {
                  if (!vm.isDataInit) {
                      vm.load();
                  }
                  vm.setViewMode(viewMode);
              }
          } else {
              if (userName === 'all') {
                 $("#searchTab").removeClass("is-active");
                 $("#myProvider").removeClass("is-active");
                 $("#allProvider").addClass("is-active");
               } else if (userName === 'favorite') {
                 $("#searchTab").removeClass("is-active");
                 $("#allProvider").removeClass("is-active");
                 $("#myProvider").addClass("is-active");
               }
               var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
               var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");
                       //kendo.bind($("#scd-bdy"), vm);
                 var viewMode = userName; //$stateParams.viewMode; //"favorite";

                 if (vm) {
                     if (!vm.isDataInit) {
                         vm.load();
                     }
                     vm.setViewMode(viewMode);
                 }
          }
        }
        $rootScope.chkSSPageEnter = true;
    });

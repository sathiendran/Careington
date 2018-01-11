angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {
        //var snap = snap || {};

        var localizeCurrent = $('#localize-current').text();
      console.log("localizeCurrent is== "+localizeCurrent);
           if(localizeCurrent == "Español"){
               // $("#retrySpanish").text("Rever?");
               $("#retrySpanish").css("color", "Red");
           }else{
               // $("#retrySpanish").text("Retry?");
               $("#retrySpanish").css("color", "Pink");
            //   $scope.retrySpanish = "Retry?";
           }

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
        $rootScope.sessionConsultConnection = $.hubConnection();
        $rootScope.sessionRoomConHub = $rootScope.sessionConsultConnection.createHubProxy('sessionLimiterHub');
        $rootScope.sessionConsultConnection.url = $rootScope.APICommonURL + "/api/signalR/";
        $rootScope.sessionConsultConnection.qs = {
         "Bearer": $rootScope.accessToken,
         // "isMobile": true,
        };
        $rootScope.sessionRoomConHub.on("onConsultationReview", function() {
        // alert("The Provider is now reviewing the intake form.");
         $scope.$digest();
        });
        $rootScope.sessionRoomConHub.on("onCustomerDefaultWaitingInformation", function() {
         $scope.$digest();
        });
        $rootScope.sessionRoomConHub.on("onConsultationStarted", function() {
         $scope.$digest();
        });
        $rootScope.sessionConsultConnection.logging = true;
        window.whub = $rootScope.sessionConsultConnection;
        $rootScope.sessionConsultConnection.start({
         withCredentials: false
        }).then(function() {
           $rootScope.sessionConsultConnection.disconnected(function() {
                // console.log("hhhh");
             setTimeout(function() {
                  // if(activeConsultConnection && activeConsultConnection.start){
                    //   activeConsultConnection.start();
                      //console.log("iiii");
                //   }
             }, 5000);
             });

        });

        $rootScope.sessionRoomConHub.on("onSessionTerminated", function(ip) {
             navigator.notification.alert(
                'You have logged in on another device and ended this session.', // message
                function() {
                    $rootScope.ClearRootScope();
                  return;
                },
                $rootScope.alertMsgName, // title
                'Done' // buttonName
           );
                //  alert("You have logged in on another device and ended this session.");
                // // window.console.log("You have logged in on another device. IP: " + ip);
                // $rootScope.ClearRootScope();
           });

      $rootScope.doGetUserTimezone = function() {
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
                            snap.cachedGetHtml("schedule/tab-providerBody.html").then(function(html) {
                                $(".schedular-continer").html(html);
                                var chkClass = $("body").hasClass("is-main-nav");
                                if(chkClass) {
                                  $("body").removeClass("is-main-nav");
                                }
                                snap.updateSnapJsSession("snap_user_session", "timeZoneSystemId", snap.userSession.timeZoneSystemId);
                                snap.resolveObject("snap.patient.schedule");
                                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                                var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");
                                headerVM.set("moduleTitle", "Provider");
                                headerVM.set("subModuleTitle", "All providers");
                                headerVM.isFavoriteCliniciansMode = true;
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
              this.initSnapVars();
          //  }
        }
        this.initKendoUI();

        $scope.getDetails = function(userName) {
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

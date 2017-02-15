angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {
        this.initSnapVars = function() {
            snap.baseUrl = "https://emerald.snap-qa.com";
            snap.userSession = JSON.parse($window.localStorage.getItem("snap_user_session"));
            snap.profileSession = JSON.parse($window.localStorage.getItem("snap_patientprofile_session"));
            snap.hospitalSession = JSON.parse($window.localStorage.getItem("snap_hospital_session"));
            snap.hospitalSettings = JSON.parse($window.localStorage.getItem("snap_hospital_settings"));
        }

        this.initKendoUI = function() {
            this.initSnapVars();
            snap.cachedGetHtml("schedule/tab-providerBody.html").then(function(html) {

                $(".schedular-continer").html(html);
                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                //snap.patient.PatientHeaderViewModel().setSubHeader({ viewMode: viewMode, module: "Provider", subModule: viewMode === "all" ? "All providers" : "My providers" });
                debugger;
                kendo.bind($("#scd-bdy"), vm);
                var viewMode = $stateParams.viewMode; //"favorite";

                if (vm) {
                    if (!vm.isDataInit) {
                        vm.load();
                    }
                    vm.setViewMode(viewMode);
                }
            });
            // debugger;
            // snap.utility.PageStyle().applyStyleV3().then(function() {

            //});

        }
        this.initKendoUI();

        $scope.getDatss = function() {
        //  $scope.vm_isSearchBarActive = true;
          //  $window.localStorage.setItem('vm_isSearchBarActive', true);
        //  $("#fff").addClass("is-active");
          if($("#searchFilter").hasClass("is-active")) {
            $("#searchFilter").removeClass("is-active");
          } else {
            $("#searchFilter").addClass("is-active");
          }
        }
    });
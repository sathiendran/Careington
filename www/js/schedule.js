angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $cordovaFileTransfer, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicModal, $ionicPopup, $ionicHistory, $filter, ageFilter, $ionicLoading, $timeout, CustomCalendar, SurgeryStocksListService, $window, $ionicBackdrop) {
        this.initSnapVars = function() {
            snap.baseUrl = "https://emerald.snap-qa.com";
            snap.userSession = JSON.parse($window.localStorage.getItem("snap_user_session"));
            snap.profileSession = JSON.parse($window.localStorage.getItem("snap_patientprofile_session"));
            snap.hospitalSession = JSON.parse($window.localStorage.getItem("snap_hospital_session"));
        }
        this.initKendoUI = function() {
            this.initSnapVars();

            snap.utility.PageStyle().applyStyleV3().then(function() {
                var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
                kendo.bind($(".schedular-continer"), vm);
                var viewMode = "all";

                if (vm) {
                    if (!vm.isDataInit) {
                        vm.load();
                    }
                    vm.setViewMode(viewMode);
                }
            });

        }
        this.initKendoUI();
    });
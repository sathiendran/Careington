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
                var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");
                headerVM.set("moduleTitle", "Provider");
                headerVM.set("subModuleTitle", "My provider");
                headerVM.isFavoriteCliniciansMode = true;
                // debugger;
                //snap.patient.PatientHeaderViewModel().setSubHeader({ viewMode: viewMode, module: "Provider", subModule: viewMode === "all" ? "All providers" : "My providers" });
                //  debugger;
                kendo.bind($("#scd-bdy"), vm);
                kendo.bind($(".header__patient-ss"), headerVM);
                var viewMode = "favorite"; //$stateParams.viewMode; //"favorite";

                if (vm) {
                    if (!vm.isDataInit) {
                        vm.load();
                    }
                    vm.setViewMode(viewMode);
                    vm.vm_favoriteClinicianCardsList_onDataBound();
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
            if ($("#searchFilter").hasClass("is-active")) {
                $("#searchFilter").removeClass("is-active");
            } else {
                $("#searchFilter").addClass("is-active");
            }
        }

        $scope.getDetails = function(userName) {
            var vm = snap.resolveObject("snap.patient.schedule.providerSearch");
            var headerVM = snap.resolveObject("snap.patient.PatientHeaderViewModel");

            if (userName === 'favorite') {
                $("#allProvider").removeClass("is-active");
                $("#myProvider").addClass("is-active");
                if (vm.favoriteCliniciansDS.data().length === 0) {
                    $("#favoriteCliniciansDetailsDiv").css("display", "none");
                    $("#favoriteCliniciansEmpty").css("display", "block");
                } else {
                    $("#favoriteCliniciansEmpty").css("display", "none");
                    $("#favoriteCliniciansDetailsDiv").css("display", "block");
                }
                headerVM.set("subModuleTitle", "My provider");
            } else if (userName === 'all') {
                $("#myProvider").removeClass("is-active");
                $("#allProvider").addClass("is-active");
                if (vm.allCliniciansDS.data().length === 0) {
                    $("#allCliniciansDetailsDiv").css("display", "none");
                    $("#allCliniciansEmpty").css("display", "block");
                } else {
                    $("#allCliniciansEmpty").css("display", "none");
                    $("#allCliniciansDetailsDiv").css("display", "block");
                }
                headerVM.set("subModuleTitle", "All providers");
            }
            vm.vm_favoriteClinicianCardsList_onDataBound();
            kendo.bind($("#scd-bdy"), vm);
            var viewMode = userName; //$stateParams.viewMode; //"favorite";

            if (vm) {
                if (!vm.isDataInit) {
                    vm.load();
                }
                vm.setViewMode(viewMode);
            }
        }
    });
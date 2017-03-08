/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />

"use strict";
(function($, $snap) {
    var snap = $snap || window.snap;
    snap.utility.PageStyle().applyStyleV3().then(function() {
        var adminController = new snap.Controller({
            layout: {
                url: '/content/admin/adminLayout.html',
                container: 'layoutMain',
                header: {
                    templateUrl: '/content/admin/adminHeader.html',
                    viewModel: {
                        vm: "snap.admin.AdminHeaderViewModel",
                        url: "/Scripts/viewModels/admin/adminheader.viewmodel.js"
                    }
                },
                sideBar: {
                    templateUrl: '/content/admin/adminsidebar.html',
                    container: "body",
                    viewModel: {
                        vm: "snap.admin.AdminHeaderViewModel",
                        url: "/Scripts/viewModels/admin/adminheader.viewmodel.js"
                    }
                },
                require: [
                        "//static.opentok.com/v2.10.0/js/opentok.min.js",
                        "/Scripts/min/consultationCommon.min.js",
                        "/Scripts/hubs/chatHub.js?svp=snapversion",
                        "/Scripts/hubs/snapWaitingRoomConsultationsHub.js?svp=snapversion",
                        "/Scripts/min/schedulerCommon.min.js",
                        "/Scripts/viewModels/common/contentLoader.js?svp=snapversion"
                ]
               
            }
        });

        adminController.on("onheaderready", function () {
            var adminHeaderViewModel = snap.admin.AdminHeaderViewModel();
            adminHeaderViewModel.initHubs();

            var drToDrChatInAdmin = snap.hospitalSettings.drToDrChatInAdmin;
            if (drToDrChatInAdmin) {
                snap.cachedGetScript("/scripts/min/consultationBasicMeeting.min.js").done(function() {
                    var $contentLoader = snap.common.contentLoader();
                    var staffChatModule = {
                        vmPath: "/scripts/viewModels/messenger/messenger.viewmodel.js?svp=snapversion",
                        vmName: "snap.Shared.MessengerViewModel",
                        contentPath: "/content/shared/messenger-template.html?svp=snapversion"
                    }
                    $contentLoader.loadModule(staffChatModule, "#staffChatContainer").done(function(vm) {
                        vm.init();
                        vm.initHeaderViewModel(adminHeaderViewModel);
                    });
                });
            }
        });

        adminController.addAction({
            name: "scheduler",
            routeUrl: "/scheduler(/:viewMode)",
            templateUrl: '/content/admin/scheduler.html',
            region: "viewcontainer",
            require: [
                "/Scripts/min/schedulerCommon.min.js",
                "/Scripts/viewModels/Admin/Schedule/coverageSchedulerLeftBar.viewmodel.js"
            ],
            viewModel: {
                vm: "snap.admin.AdminSchedulerPageViewModel",
                url: "/Scripts/viewModels/Admin/Schedule/adminScheduler.viewmodel.js"
            }

        }).then(function (routerParam, viewObject) {
            snap.patientPage = false;
            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: false,
                subHeaderTitle: "Scheduler",
                toggleSearch: function () {
                    snap.admin.AdminSchedulerPageViewModel().leftColToggle();
                },
                hideAvatarBtn: false,
                addButton: {
                    action: function () {
                        snap.admin.AdminSchedulerPageViewModel().vm_addNewEventClick();
                    },
                    visible: true
                },
                panelToggle: {
                    action: function () {
                        snap.admin.AdminSchedulerPageViewModel().leftColToggle();
                    },
                    visible: true
                },
                linkOne: {
                    visible: true,
                    active: routerParam[0] === "coverage",
                    path: "#/scheduler/coverage",
                    title: "Coverage"
                },
                linkTwo: {

                    visible: true,
                    active: typeof (routerParam[0]) === "undefined" || routerParam[0] === "availabilities",
                    path: "#/scheduler/availabilities",
                    title: "Availability"
                },
                linkThree: {
                    visible: true,
                    active: routerParam[0] === "appointments",
                    path: "#/scheduler/appointments",
                    title: "Appointments"
                }
            };
            
            $('.header').addClass('header--scheduler');
            $('.header-bar').addClass('header-bar--scheduler');
            if (routerParam[0] === "coverage") {
                $('.scheduler__create').hide();
            } else {
                $('.scheduler__create').show();
            }
            
            if (viewObject && viewObject.viewmodel) {
                if (!viewObject.viewmodel.isDataInit) {
                    viewObject.viewmodel.initData(snap.common.schedule.ScheduleCommon().userType.admin);
                }

                viewObject.viewmodel.setViewMode(routerParam[0]);
            }
            snap.admin.AdminHeaderViewModel().setSubHeader(detailsObj);
        });
        
        adminController.addAction({
            name: "settings",
            routeUrl: "/settings",
            templateUrl: '/content/admin/patientRules/patientrules.html',
            region: "viewcontainer",
            require: [
                "/Scripts/min/schedulerCommon.min.js",
                "/Scripts/viewModels/Admin/PatientRules/rulesService.js?svp=snapversion",
                "/Scripts/viewModels/Admin/PatientRules/ruleWizard.viewmodel.js?svp=snapversion"
            ],
            viewModel: {
                vm: "snap.admin.patientRules.patientRulesPageViewModel",
                url: "/Scripts/viewModels/Admin/patientRules/patientRules.viewmodel.js"
            }
        }).then(function (routerParam, viewObject) {
            if (!snap.hasAllPermission(snap.security.view_workflows)) {
                location.href = "/404/index.html";
            }
            if (viewObject && viewObject.viewmodel) {
                if (!viewObject.viewmodel.isDataInit) {
                    viewObject.viewmodel.load();
                }
            }

            snap.patientPage = false;

            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: false,
                subHeaderTitle: "Settings",
                subHeaderModuleTitle: "Workflow",
                toggleSearch: function () {
                    snap.admin.patientRules.patientRulesPageViewModel().leftColToggle();
                },
                hideAvatarBtn: false,
                panelToggle: {
                    action: function () {
                        snap.admin.patientRules.patientRulesPageViewModel().leftColToggle();
                    },
                    visible: true
                },
                linkOne: {
                    visible: false
                },
                linkTwo: {
                    visible: false
                },
                linkThree: {
                    visible: false
                },
                addButton: {
                    visible: false
                }
            };
            snap.admin.AdminHeaderViewModel().setSubHeader(detailsObj);
        });

        adminController.addAction({
            name: "default",
            routeUrl: "/",
            templateUrl: '/content/public/defaultview.html',
            region: "viewcontainer",
            viewModel: null,
        }).then(function (routerParam, viewObject) {

            //Note. In release 1.21 we hide Rules Scheduler. Redirect to home page.
            window.location = "/Admin/Main/#/analytics";

            if (viewObject && viewObject.viewmodel) {
                viewObject.viewmodel.initData();
            }
        });

        adminController.addAction({
            name: "patientQueue",
            routeUrl: "/patientQueue",
            templateUrl: '/content/Admin/patientQueue/patientQueue.html',
            region: "viewcontainer",
            require: [
                "/Scripts/min/schedulerCommon.min.js",
                "/Scripts/min/adminPatientQueue.min.js",

            ],
            viewModel: {
                vm: "snap.admin.patientQueue.patientQueue",
                url: "/Scripts/viewModels/Admin/PatientQueue/patientQueue.viewmodel.js"
            }
        }).then(function (routerParam, viewObject) {
            if (!snap.isAdminPatientQueueEnabled()) {
                snapInfo("You don't have permission to view patient queue.");
                location.href = "/Admin/Main/#/analytics";
                return;
            }

            if (viewObject && viewObject.viewmodel) {
                if (viewObject.viewmodel.isDataInit()) {
                    viewObject.viewmodel.refresh();
                } else {
                    viewObject.viewmodel.load();
                }
            }

            var $headerVM = snap.admin.AdminHeaderViewModel();

            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: true,
                subHeaderTitle: "Dashboard",
                subHeaderModuleTitle: "Patient Queue",
                hideAvatarBtn: false,
                panelToggle: {
                    action: function () {
                        viewObject.viewmodel.leftColToggle();
                        $headerVM.set("isMenuToggleActive", !$headerVM.isMenuToggleActive);
                    },
                    visible: true,
                    mobile:false, 
                    listIcon: false,
                    isToggleActive: viewObject.viewmodel.vm_showLeftColumn
                },
                linkOne: {
                    visible: false
                },
                linkTwo: {
                    visible: true,
                    active: true,
                    path: "#/patientQueue",
                    title: "Queue"
                },
                linkThree: {
                    visible: true,
                    active: false,
                    path: "#/analytics",
                    title: "Analytics"
                },
                addButton: {
                    visible: false
                }
            };
            $headerVM.setSubHeader(detailsObj);
        });


        adminController.addAction({
            name: "analytics",
            routeUrl: "/analytics",
            templateUrl: '/content/admin/analytics/analytics.html',
            region: "viewcontainer",
            require: [
                "/Scripts/snapCustomBinding.js",
                "/Scripts/DataVizTheme1.js?svp=snapversion",
                "/Scripts/services/adminAnalyticsService.js?svp=snapversion",
            ],
            viewModel: {
                vm: "snap.admin.analytics",
                url: "/Scripts/viewModels/Admin/Analytics/analytics.viewmodel.js"
            }
        }).then(function (routerParam, viewObject) {
            if (viewObject && viewObject.viewmodel) {
                if (viewObject.viewmodel.isDataInit()) {
                    viewObject.viewmodel.refresh();
                } else {
                    viewObject.viewmodel.load();
                }
            }

            var title = "Queue";

            if (!snap.isPatientQueueEnabled()) {
                title = "";
            };

            var $headerVM = snap.admin.AdminHeaderViewModel();

            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: true,
                subHeaderTitle: "Dashboard",
                subHeaderModuleTitle: "Analytics",
                hideAvatarBtn: false,
                panelToggle: {
                    action: function () {
                        viewObject.viewmodel.leftColToggle();
                        $headerVM.set("isMenuToggleActive", !$headerVM.isMenuToggleActive);
                    },
                    visible: true,
                    mobile:false,
                    listIcon: true,
                    isToggleActive: viewObject.viewmodel.vm_isLeftMenuActive
                },
                linkOne: {
                    visible: false
                },
                linkTwo: {
                    visible: snap.isPatientQueueEnabled(),
                    active: false,
                    path: "#/patientQueue",
                    title: title
                },
                linkThree: {
                    visible: true,
                    active: true,
                    path: "#/analytics",
                    title: "Analytics"
                },
                addButton: {
                    visible: false
                }
            };
            $headerVM.setSubHeader(detailsObj);
        });
        
        adminController.addAction({
            name: "serviceTypes",
            routeUrl: "/serviceTypes",
            templateUrl: '/content/Admin/serviceTypes/serviceTypes.html',
            region: "viewcontainer",
            require: [
                "/Scripts/min/schedulerCommon.min.js?svp=snapversion",
                "/Scripts/services/serviceTypes.service.js",
                "/Scripts/services/medicalCodes.service.js",
                "/Scripts/viewModels/Admin/serviceTypes/serviceTypeFactory.js",
                "/Scripts/hubs/serviceTypesHub.js"
            ],
            viewModel: {
                vm: "snap.admin.serviceTypes.serviceTypes",
                url: "/Scripts/viewModels/Admin/serviceTypes/serviceTypes.viewmodel.js"
            }
        }).then(function (routerParam, viewObject) {
            if (!snap.hasAllPermission(snap.security.view_admin_patient_queue)) {
                snapInfo("You don't have permission to view patient queue.");
                location.href = "/Admin/Dashboard";
                return;
            }

            if (viewObject && viewObject.viewmodel) {
                if (viewObject.viewmodel.isDataInit()) {
                    viewObject.viewmodel.refresh();
                } else {
                    viewObject.viewmodel.load();
                }
            }

            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: true,
                subHeaderTitle: "Settings",
                subHeaderModuleTitle: "Services & Pricing",
                hideAvatarBtn: false,
                panelToggle: {
                    action: function () {
                         viewObject.viewmodel.leftColToggle();
                    },
                    visible: true,
                    listIcon: true
                },
                linkOne: {
                    visible: false,
                },
                linkTwo: {
                    visible: false
                },
                linkThree: {
                    visible: false
                },
                addButton: {
                    visible: false
                }
            };
            snap.admin.AdminHeaderViewModel().setSubHeader(detailsObj);
        });

        adminController.start();
        if (UnBlockContainer) {
            UnBlockContainer();
        }
    })
}(jQuery, snap));
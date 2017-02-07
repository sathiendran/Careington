/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, $snap) {

    var adminController = new snap.Controller({
        layout: {
            url: '/content/admin/adminLayout.html',
            container: 'layoutMain',
            header: {
                templateUrl: '/content/clinician/clinicianHeader.html',
                viewModel: {
                    vm: "snap.clinician.ClinicianHeaderViewModel",
                    url: "/Scripts/viewModels/clinician/clinicianHeader.viewmodel.js"
                }
            }
        }
    });

    adminController.on("onheaderready", function () {
        snap.utility.PageStyle().applyStyleV3().then(function () {
            if (UnBlockContainer) {
                UnBlockContainer();
            }
        });



    });
    adminController.addAction({
        name: "scheduler",
        routeUrl: "/scheduler",
        templateUrl: '/content/admin/scheduler.html',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.admin.AdminSchedulerPageViewModel",
            url: "/Scripts/viewModels/Admin/adminScheduler.viewmodel.js"
        }

    }).then(function (routerParam, viewObject) {
        snap.patientPage = false;

        var detailsObj = {
            isMenuToggleVisible: true,
            hideSearchBtn: false,
            toggleSearch: function () { snap.admin.AdminSchedulerPageViewModel().leftColToggle(); },
            hideAvatarBtn: true,
            addButton: {
                action: function () { snap.admin.AdminSchedulerPageViewModel().addNewBlockClick(); },
                visible: true,
            },
            panelToggle: {
                action: function () { snap.admin.AdminSchedulerPageViewModel().leftColToggle(); },
                visible: true,
            },
            linkOne: {
                visible: false
            },
            linkTwo: {
                visible: true,
                active: true,
                path: "/",
                title: "Availability"
            },
            linkThree: {
                visible: true,
                active: false,
                path: "#/appointments",
                title: "Appointments"
            }
        };
        $('body').addClass('cc-scheduling availability');
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initData();
        }
        snap.admin.AdminHeaderViewModel().setSubHeader(detailsObj);
    });

    adminController.addAction({
        name: "default",
        routeUrl: "/",
        templateUrl: '/content/public/defaultview.html',
        region: "viewcontainer",
        viewModel: null,
    }).then(function (routerParam, viewObject) {
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initData();
        }
    });

    adminController.addAction({
        name: "view2",
        routeUrl: "/view2",
        templateUrl: '/content/admin/view2.html',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.view1viewmodel",
            url: "/Scripts/viewModels/admin/view1.js"
        },
    });

    adminController.addAction({
        name: "view1",
        routeUrl: "/view1",
        templateUrl: '/content/admin/view1.html',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.view1viewmodel",
            url: "/Scripts/viewModels/admin/view1.js"
        },
    });
    adminController.start();

}(jQuery, snap));

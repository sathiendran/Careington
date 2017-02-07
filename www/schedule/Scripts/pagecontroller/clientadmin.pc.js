/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, $snap) {

    var clientAdminController = new snap.Controller({
        layout: {
            url: '/content/clientadmin/clientAdminLayout.html',
            container: 'layoutMain',
            header: {
                templateUrl: '/content/clientadmin/clientAdminheader.html',
                viewModel: {
                    vm: "snap.clientAdmin.HeaderViewModel",
                    url: "/Scripts/viewModels/clientadmin/HeaderViewModel.js"
                }
            },
            footer: {
                templateUrl: '/content/clientadmin/clientAdminfooter.html',
                viewModel: {
                    vm: "snap.view1viewmodel",
                    url: "/Scripts/viewModels/clientadmin/view1.js"
                },
            },
            sideBar: {
                templateUrl: '/content/clientadmin/clientAdminSidebar.html',
                viewModel: {
                    vm: "snap.clientAdmin.SideViewModel",
                    url: "/Scripts/viewModels/clientadmin/SideViewModel.js"
                },
            }
        }
    });
    clientAdminController.on("onsidebarready", function (vm) {
      
        vm.initViewModel();
    });

    clientAdminController.addAction({
        name: "default",
        routeUrl: "/",
        templateUrl: '/content/clientadmin/defaultview.html',
        region: "viewcontainer",
        viewModel: null,
    });
    clientAdminController.addAction({
        name: "myaccount",
        routeUrl: "/myaccount",
        templateUrl: '/content/clientadmin/myaccount.html',
        region: "viewcontainer",
        viewModel:null
    });




    clientAdminController.addAction({
        name: "view1",
        routeUrl: "/view1",
        templateUrl: '/content/clientadmin/view1.html',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.view1viewmodel",
            url: "/Scripts/viewModels/clientadmin/view1.js"
        },
    });


    clientAdminController.start();

}(jQuery, snap));
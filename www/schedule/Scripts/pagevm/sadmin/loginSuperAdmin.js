/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />
/// <reference path="../../services/appointmentService.js" />
/// <reference path="tookBoxViewModel.js" />

var UnBlockContainer = function () {

};

; (function ($) {


    //snap.physician namespace
    // define the PhysicianLandingViewModel


    snap.namespace("snap.loginSuperAdminPage")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snapLoader"

        ])
        .define("LoginSuperAdminPageViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader) {

                this.loadData = function () {
                    var dataLoaded = $.Deferred();
                    var path = '/GlobalFunctionality/GlobalSynchronousMethods.aspx/GetHospitalIdWithKeys';
                    $.ajax({
                        url: path,
                        type: 'POST',
                        dataType: 'json',
                        // data: "{ 'url': 'test'}",
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            var hospInfo = response.d.split("|");
                            snap.apiDeveloperId = hospInfo[1];
                            snap.apiKey = hospInfo[2];
                            if (isEmpty(snap.apiDeveloperId)) {
                                console.error("couldn't get API Dev Key");
                            }
                            snap.hospitalId = 0;
                            //snap.hospitalId = hospInfo[0];
                            app.loginService.viewModel.setHospitalId(snap.hospitalId);
                            //alert(snap.hospitalId);
                            app.headerService.viewModel.getClientInfo(snap.hospitalId).always(function () {
                                dataLoaded.resolve();
                            });;

                        },
                        error: function () {
                            snapError("Hospital ID Failure");
                            dataLoaded.resolve();
                        }
                    });
                    return dataLoaded.promise();
                };

            }).singleton();


    $(function () {
        var footerLoaded = $.Deferred();
        $("#secLoginFooter").load("/content/shared/loginFooter.html" + snap.addVersion, function () {
            footerLoaded.resolve();
        });

      
        var $viewModel = new snap.loginSuperAdminPage.LoginSuperAdminPageViewModel();
        var vmDataLoaded = $viewModel.loadData();
        var headerLoaded = $.Deferred();
        $("#divHeader").load("/content/shared/loginHeader.html" + snap.addVersion, function () {
            var divHeader = $("#divHeader");
            kendo.bind(divHeader, app.headerService.viewModel);
            headerLoaded.resolve();
        });
        var contentLoaded = $.Deferred();
        $("#divLoginContent").load("/content/sadmin/loginContentSuperAdmin.html" + snap.addVersion, function () {
            var divLogin = $("#divLogin");
            kendo.bind(divLogin, app.loginService.viewModel);
            contentLoaded.resolve();
         
        });

  
        $.when(footerLoaded, vmDataLoaded, headerLoaded, contentLoaded).done(function () {
            $(function () {
                if (UnBlockContainer) {
                    UnBlockContainer();
                }
            });
        });
   

    });


}(jQuery));










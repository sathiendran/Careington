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


    snap.namespace("snap.loginAdminPage")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snapLoader"

        ])
        .define("LoginAdminPageViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader) {

                this.loadData = function () {
                    var loaded = $.Deferred();
                    var path = '/GlobalFunctionality/GlobalSynchronousMethods.aspx/GetHospitalIdWithKeys';
                    $.ajax({
                        url: path,
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            var hospInfo = response.d.split("|");
                            snap.hospitalId = hospInfo[0];
                            if (parseInt(snap.hospitalId) === 0) {
                                window.location = "/404";
                            }
                            snap.apiDeveloperId = hospInfo[1];
                            snap.apiKey = hospInfo[2];
                            app.loginService.viewModel.setHospitalId(snap.hospitalId);
                            app.headerService.viewModel.getClientInfo(snap.hospitalId).always(function () {
                                loaded.resolve();
                            });
                        },
                        error: function () {
                            snapError("Hospital ID Failure");
                            loaded.resolve();
                        }
                    });

                    return loaded.promise();
                  
                };

            }).singleton();


    $(function () {
        var footerLoaded = $.Deferred();
        $("#secLoginFooter").load("/content/shared/loginFooter.html" + snap.addVersion, function () {
            footerLoaded.resolve();
        });
        var $viewModel = new snap.loginAdminPage.LoginAdminPageViewModel();
        var vmDataLoaded = $viewModel.loadData();
        var headerLoaded = $.Deferred();
        $("#divHeader").load("/content/shared/loginHeader.html" + snap.addVersion, function () {
            var divHeader = $("#divHeader");
            kendo.bind(divHeader, app.headerService.viewModel);
            headerLoaded.resolve();
        });
        var contentLoaded = $.Deferred();
        $("#divLoginContent").load("/content/admin/loginContentAdmin.html" + snap.addVersion, function () {
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

        var appModule = new snap.Application();
        appModule.run();

    });


}(jQuery));










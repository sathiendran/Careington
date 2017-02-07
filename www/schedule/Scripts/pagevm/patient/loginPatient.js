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

; (function ($) {


    //snap.physician namespace
    // define the PhysicianLandingViewModel
    function loadPatientContent() {
        var headerLoaded = $.Deferred();
        $("#divHeader").load("/content/shared/loginHeader.html" + snap.addVersion, function () {
            var divHeader = $("#divHeader");
            kendo.bind(divHeader, app.headerService.viewModel);
            headerLoaded.resolve();
        });
        var contentLoaded = $.Deferred();
        if (snap.hospitalSession.customerSSO === "Mandatory") {
            $("#divLoginContent").load("/content/shared/loginRedirect.html" + snap.addVersion, function () {
                contentLoaded.resolve();
            });
        }
        else {
            $("#divLoginContent").load("/content/shared/loginContent.html" + snap.addVersion, function () {
                var divLogin = $("#divLogin");
                kendo.bind(divLogin, app.loginService.viewModel);
                contentLoaded.resolve();
            });
        }
        return $.when(headerLoaded, contentLoaded);
    }

    snap.namespace("snap.loginPatientPage")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snapLoader"

        ])
        .define("LoginPatientPageViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader) {

                this.loadData = function () {
                    var dataLoaded = $.Deferred();
                    //would like to use a promise on this
                    var path = '/GlobalFunctionality/GlobalSynchronousMethods.aspx/GetHospitalIdWithKeys';
                    $.ajax({
                        url: path,
                        type: 'POST',
                        dataType: 'json',
                        // data: "{ 'url': 'test'}",
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
                            app.headerService.viewModel.getClientInfo(snap.hospitalId).done(function () {
                                loadPatientContent().done(function () {
                                    dataLoaded.resolve();
                                });
                            });

                        },
                        error: function () {
                            dataLoaded.resolve();
                            snapError("Hospital ID Failure");
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

        var $viewModel = new snap.loginPatientPage.LoginPatientPageViewModel();
        var vmDataLoaded = $viewModel.loadData();

        $.when(footerLoaded, vmDataLoaded).done(function () {
            $(function () {
                var snapToken = snap.getUrlParam('snapToken');
                if (snapToken == null) {
                    $('#divLogin').show().addClass("active");
                    app.loginService.viewModel.initData();
                    if (UnBlockContainer) {
                        UnBlockContainer();
                    }
                }
                else {
                    BlockContainer();
                    app.loginService.viewModel.loginCustomerToApplicationSSO(snapToken);
                }
            });
        });

        var appModule = new snap.Application();
        appModule.run();

    });


}(jQuery));

/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />

; (function ($) {
    snap.namespace("snap.myPatientAccount")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snapLoader"
        ])
        .define("AddHealthPlanViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader) {
                this.loadData = function () {
                };
            }).singleton();


    function loadPatientHealthPlanContent() {
        $("#healthPlanLayout").load("/content/patient/addHealthPlanInfo.html" + snap.addVersion, function () {
            var divHealthPlan = $("#healthPlanLayout");
            var hpVM = Snap.Patient.ApplyInsurancePlanViewModel();            
            hpVM.loadPlans().always(function () {});
            kendo.bind(divHealthPlan, hpVM);
        });
    }

    $(function () {
        loadPatientHealthPlanContent();
        var appModule = new snap.Application();
        appModule.run();
    });
}(jQuery));
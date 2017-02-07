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
        .define("AddPaymentInfoViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader) {

                this.loadData = function () {
                };

            }).singleton();


    function loadCCPatientContent() {

        //change stepPayment.html later to a specific HTML file
        $("#creditCardLayout").load("/content/patient/addPaymentInfo.html" + snap.addVersion, function () {
            var divCreditCard = $("#creditCardLayout");
            var paymentVM = Snap.Patient.PatientPaymentViewModel(); //from intake form
            paymentVM.loadData().always(function () {
                
            });
            // var paymentVM = Snap.Patient.PaymentInformationViewModel(); //new vm created some duplicate code, probably don't need this one

            //It would be best to use Snap.Patient.PatientPaymentViewModel().  It does have some consutlation specific items in it though.
            //For certain things like:
            //this.coPayAmount = snap.consultationSession.copayAmount;

            kendo.bind(divCreditCard, paymentVM);
        });
    }

    $(function () {
        //$("#secLoginFooter").load("/content/shared/loginFooter.html" + snap.addVersion);
        if (snap.hospitalSession.locale == "en-GB") {
            $("#spanIcon").addClass("uk");
        }
        loadCCPatientContent();
        var appModule = new snap.Application();
        appModule.run();

    });


}(jQuery));










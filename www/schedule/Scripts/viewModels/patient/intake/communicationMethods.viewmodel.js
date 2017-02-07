
; (function ($, $snap) {
    $snap.namespace("Snap.Patient").use(["snapNotification"])
          .extend(kendo.observable)
         .define("CommunicationMethodSelector", function ($snapNotification) {
             var that = this;

             that.selectMethod = function (e) {
                 var methodId = e.currentTarget.getAttribute('data-methodId');

                 snap.updateSnapConsultationSessionMultipleValues({ communicationMethod: methodId, currentStep: 2 });
                 location.href = "/Customer/Intake/#/IntakeStep/1";
             }
         });
})(jQuery, snap)



//@ sourceURL=reEnterConsultation.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue")
    .use(["snapNotification", "snap.EventAggregator", "snap.service.appointmentService"])
        .define("reEnterOpenConsultationDialog", function ($snapNotification, $eventAggregator, $appointmentService) {
            var dialog = null;
            var consultationOpt = null;
            var userType;

            this.vm_isError = false;
            this.vm_isLoading = false;

            this.setOptions = function (opt) {
                dialog = opt.dialog;
                consultationOpt = opt.opt;
            };

            this.vm_onReEnterClick = function () {
                var location = "/Physician/main#/openconsultation/" + consultationOpt.meetingId;
                dialog.close();
                window.location = location;
            };

            this.vm_onMarkCompleteClick = function () {
                var that = this;
                that.set("vm_isLoading", true);
                $appointmentService.clinicianEndActiveOpenConsultaion(consultationOpt.meetingId).then(function () {
                    $snapNotification.info("Consultation saved.");
                }, function(error) {
                    $snapNotification.error("Failed to save consultation.");
                    window.console.log(error);
                }).always(function() {
                    sessionStorage.removeItem("meetingdata");
                    sessionStorage.removeItem("participantId");
                    sessionStorage.removeItem("personId");
                    dialog.close();
                });

            };

        }).singleton();
}(jQuery, snap, kendo));
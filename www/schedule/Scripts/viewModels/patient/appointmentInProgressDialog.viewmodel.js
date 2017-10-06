//@ sourceURL=appointmentInProgress.viewmodel.js

(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient")
        .use(["snapNotification", "snap.EventAggregator", "snap.DataService.customerDataService"])
        .extend(kendo.observable)
        .define("appointmentInProgressDialog", function($snapNotification, $eventAggregator, $customerDataService) {
            var dialog = null,
                consultation = null;

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                consultation = opt.opt;
            };

            this.vm_onYesClick = function() {
                dialog.close();

                snap.setSnapConsultationSessionData({
                    consultationId: consultation.consultationId,
                    patientId: consultation.patientId,
                    personId: consultation.personId,
                    meetingId: consultation.meetingId
                });

                sessionStorage.setItem("consultationinitaction", "1");
                window.location.assign("/patient/Main/#/Waiting");
            };

            this.vm_onNoClick = function() {
                $customerDataService.deleteAvailableWaitingConsultation(consultation.consultationId).then(function() {
                    $snapNotification.success("Consultation saved.");
                }, function(error) {
                    $snapNotification.error("Failed to save consultation.");
                }).always(function() {
                    dialog.close();
                    $eventAggregator.publish("appointmentInProgressDialog_dialogClosed");
                });
            };

        }).singleton();
}(jQuery, snap, kendo));

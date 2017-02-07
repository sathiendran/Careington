//@ sourceURL=reEnterConsultation.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue")
    .use(["snapNotification", "snap.EventAggregator", "snap.service.appointmentService", "snap.common.schedule.ScheduleCommon"])
        .define("reEnterConsultationDialog", function ($snapNotification, $eventAggregator, $appointmentService, $scheduleCommon) {
            var dialog = null;
            var consultationOpt = null;
            var userType;

            this.vm_isError = false;
            this.vm_isLoading = false;
            
            this.setOptions = function(opt) {
                dialog = opt.dialog;
                consultationOpt = opt.opt;
                userType = opt.opt.userType;
            };

            this.vm_onReEnterClick = function () {

                var videoConsultationLocation = userType === 1 ?
                                    "/Physician/main#/consultation" :
                                    "/Customer/main#/consultation?reload=1";

                var phoneConsultationLocation = "/Physician/main#/encounter/phone";

                this._executeOnConsultationCheck(function action(encounterType) {
                    snap.setSnapConsultationSessionData(consultationOpt);
                    if (encounterType === 2) {
                        window.location = phoneConsultationLocation;
                    } else {
                        window.location = videoConsultationLocation;
                    }

                });
            };

            this.vm_onMarkCompleteClick = function() {
                var that = this;

                var endConsultationAction = userType === 1 ? $appointmentService.clinicianEndActiveConsultaion : $appointmentService.patientEndActiveConsultaion;
                
                var that = this;
                this._executeOnConsultationCheck(function action() {
                    that.set("vm_isLoading", true);
                    endConsultationAction(consultationOpt.consultationId).done(function() {
                        $snapNotification.info("Consultation saved.");
                        dialog.close();
                        //$eventAggregator.published("consultation_markedAsComplete");
                    }).fail(function() {
                        $snapNotification.error("Cannot end consultation.");
                    }).always(function() {
                        that.set("vm_isLoading", false);
                    });    
                });
            };

            this._executeOnConsultationCheck = function(action) {
                var that = this;
                that.set("vm_isLoading", true);
                $appointmentService.getConsultation(consultationOpt.consultationId)
                .always(function() {
                    that.set("vm_isLoading", false);
                }).done(function(consultation) {
                    // Check that consulttaion not disconnected or dropped.
                    var status = consultation.data[0].statusId;
                    if (status === 71/*StartedConsultation*/ || status === 83/*DisconnectedConsultation*/) {
                        action(consultation.data[0].encounterTypeCode);
                        dialog.close();
                    } else {
                        $snapNotification.error("Your consultation has expired.");
                        dialog.close();
                    }
                    }).fail(function(){
                    $snapNotification.error("Cannot check Consultation.");
                    dialog.close();
                });
            };
        }).singleton();
}(jQuery, snap, kendo));

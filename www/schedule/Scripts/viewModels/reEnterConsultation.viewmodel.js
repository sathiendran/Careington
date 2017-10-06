//@ sourceURL=reEnterConsultation.viewmodel.js

(function ($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.patient")
    .use(["snapNotification", "snap.EventAggregator", "snap.enums.consultationStatus", "snap.service.appointmentService", "snap.common.schedule.ScheduleCommon"])
        .extend(kendo.observable)
        .define("reEnterConsultationDialog", function ($snapNotification, $eventAggregator, $consultationStatus, $appointmentService, $scheduleCommon) {
            var dialog = null;
            var consultationOpt = null;
            var duration;
            this.providerFullName = "";
            this.department = "";
            this.providerProfileImage = global.getDefaultProfileImageForClinician();
            this.vm_isError = false;
            this.vm_isLoading = false;
            this.setOptions = function (opt) {
                dialog = opt.dialog;
                consultationOpt = opt.opt;
                duration = opt.opt.duration;

            }.bind(this);

            this.vm_onReEnterClick = function () {
                this._executeOnConsultationCheck(function action() {
                    snap.setSnapConsultationSessionData({
                        consultationId: consultationOpt.consultationId,
                        patientId: consultationOpt.patientId,
                        meetingId: consultationOpt.meetingId,
                        personId: consultationOpt.personId,
                        patientName: consultationOpt.patientName
                    });
                    window.location = "/patient/main#/consultation?reload=1";
                });
            };

            this.vm_onMarkCompleteClick = function () {
                var that = this;

                this._executeOnConsultationCheck(function action() {
                    that.set("vm_isLoading", true);
                    $appointmentService.patientEndActiveConsultaion(consultationOpt.consultationId).done(function () {
                        $snapNotification.info("Consultation saved.");
                    }).fail(function () {
                        $snapNotification.error("Cannot end consultation.");
                    }).always(function () {
                        $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                        that.set("vm_isLoading", false);
                        dialog.close();
                    });
                });
            };

            this._executeOnConsultationCheck = function(action) {
                var that = this;
                that.set("vm_isLoading", true);
                $appointmentService.getConsultation(consultationOpt.consultationId).always(function() {
                    that.set("vm_isLoading", false);
                }).done(function(consultation) {
                    var status = consultation.data[0].statusId;
                    if (status === $consultationStatus.startedConsultation || status === $consultationStatus.disconnectedConsultation ||
                        status === $consultationStatus.doctorInitiatedConsultation) {
                        action();
                    } else {
                        var message = "Your consultation has expired.";
                        if (status === $consultationStatus.endedConsultation) {
                            message = "Your consultation has been finished via provider.";
                        } else if (status === $consultationStatus.droppedConsultation) {
                            message = "Your consultation has been marked as dropped.";
                        }
                        $snapNotification.error(message);
                        dialog.close();
                        $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                    }
                }).fail(function(){
                    $snapNotification.error("Cannot check Consultation.");
                    dialog.close();
                    $eventAggregator.publish("reEnterConsultationDialog_dialogClosed");
                });
            };
        }).singleton();
}(jQuery, snap, kendo, window));

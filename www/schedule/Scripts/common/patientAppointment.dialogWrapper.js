//@ sourceURL=patientAppointment.dialogWrapper.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.common.schedule")
    .use(["snap.common.schedule.ScheduleCommon", "snap.EventAggregator"])
        .define("appointmentDialogWrapper", function ($scheduleCommon, $eventAggregator) {
            var isLoading = false;
            this.openAppointmentDialog = function (appointmentId, userType, appointmentType, isDNA) {
                if (!isLoading) {
                    isLoading = true;
                    var dlg;
                    if (userType === $scheduleCommon.userType.patient && appointmentType === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                        dlg = snap.patient.schedule.appointmentDialog();
                        dlg.openExistedAppointmentDialog(appointmentId, isDNA).always(function () {
                            isLoading = false;
                        });
                    } else {
                        dlg = snap.admin.schedule.eventDialog();
                        dlg.openExistedAppointmentDialog(appointmentId, $scheduleCommon.eventType.appointment, userType, isDNA).done(function (dialog) {
                            $eventAggregator.updateSubscription(dialog._onRescheduleEvent, function () {
                                dlg.rescheduleAppointment(dialog.getOptions(), userType);
                            });
                        }).always(function () {
                            isLoading = false;
                        });
                    }
                }
            }
        }).singleton();
}(jQuery, snap));
//@ sourceURL=patientAppointment.dialogWrapper.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common.schedule")
    .use(["snap.common.schedule.ScheduleCommon", "snap.EventAggregator"])
        .define("appointmentDialogWrapper", function ($scheduleCommon, $eventAggregator) {
            this.openAppointmentDialog = function (appointmentId, userType, appointmentType, isDNA) {              
                if (userType === $scheduleCommon.userType.patient && appointmentType === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                    var dlg = snap.patient.schedule.appointmentDialog();
                    dlg.openExistedAppointmentDialog(appointmentId, isDNA);
                } else {
                    var dlg = snap.admin.schedule.eventDialog();
                    dlg.openExistedAppointmentDialog(appointmentId, $scheduleCommon.eventType.appointment, userType, isDNA).done(function (dialog) {
                        $eventAggregator.updateSubscription(dialog._onRescheduleEvent, function() {
                            dlg.rescheduleAppointment(dialog.getOptions(), userType);
                        });
                    });
                }              
            }
        }).singleton();
}(jQuery, snap, kendo));
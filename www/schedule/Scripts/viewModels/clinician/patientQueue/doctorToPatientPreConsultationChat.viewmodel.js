//@ sourceURL=doctorToPatientPreConsultationChat.viewmodel.js
(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue")
        .use(["snap.EventAggregator", "snap.common.patientQueue.preConsultationChat"])
        .extend(kendo.observable)
        .define("doctorToPatientPreConsultationChat", function ($eventAggregator, $preConsultationChat) {
            
            //****************** Call BASE constructor ********************
            $preConsultationChat.ctor.call(this);

            this.vm_newMessageText = "";

            this.vm_onEnterKey = function() {
                this.vm_onSendMessageButtonClick();
            };

            this.vm_onSendMessageButtonClick = function() {
                if(/\S/.test(this.vm_newMessageText)) {
                    this._sendMessage(this.vm_newMessageText);

                    $eventAggregator.publish("preConsultationChat_sendMessage");
                }

                this.set("vm_newMessageText", "");
            };
        }).singleton();
}(jQuery, snap, kendo, window));

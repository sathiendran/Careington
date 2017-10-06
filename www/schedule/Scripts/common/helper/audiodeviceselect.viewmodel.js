//@ sourceURL=reEnterConsultation.viewmodel.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.common")
    .use([])
        .define("AudioSelectDialog", function ($snapNotification, $eventAggregator, $appointmentService) {
            var dialog = null;
            var consultationOpt = null;
            var userType;
            var onCanel = function () { };
            var onOk = function () { };
            var deviceList = null;
            this.vm_isError = false;
            this.vm_isLoading = false;
            this.selectedAudioSource = null;
            this.onAudioChange = function () {
                localStorage.setItem("stethoscope", this.selectedAudioSource);
            }
            this.audioSourceList = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        options.success(deviceList);
                    }
                }
            });
            this.setOptions = function (opt) {
                dialog = opt.dialog;
                onCanel = opt.opt.onCancel;
                onOk = opt.opt.onSelect;
                deviceList = opt.opt.deviceList
            };

            this.vm_onMarkOkClick = function () {
                dialog.close();
                onOk();
            };

            this.vm_onCancelClick = function () {
                dialog.close();
                onCanel();
            };

        }).singleton();
}(jQuery, snap));
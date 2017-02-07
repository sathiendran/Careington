//@ sourceURL=dismissatientPopup.dialog.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue")
    .use(["snapNotification", "snap.EventAggregator", "snap.common.contentLoader", "snap.service.appointmentService", "snap.service.codesService"])
        .define("dismissPatientDialog", function ($snapNotification, $eventAggregator, $contentLoader, $appointmentService, $codesService) {
            var dialog = null;

            var patient = null;
            var dropdownlist = null;

            this.vm_isError = false;
            this.vm_isLoading = false;
            
            this.setOptions = function(opt) {
                dialog = opt.dialog;
                patient = opt.opt;

                if(dropdownlist) {
                    dropdownlist.value("");
                }
            };

            this.loadNonMVVM = function(container) {
                var that = this;

                $codesService.getCodeSet(snap.hospitalSession.hospitalId, "dismissreason").done(function(response) {
                    // Unfortunately we cannot use MVVM approach because not all necessaries options currently supports in MVVM.
                    // There is no way to setup this in MVVM.  popup: { appendTo: $(".dismiss-patient"), position: "bottom left", origin: "top left"}
                    dropdownlist = $(container).find(".js-dropdown-reason").kendoDropDownList({
                        optionLabel: "Select a reason",
                        dataTextField: "text",
                        dataValueField: "codeId",
                        dataSource: response.data[0].codes,
                        popup: {
                            appendTo: $(".dismiss-patient"),
                            position: "bottom left",
                            origin: "top left"
                        },
                        animation: {
                            open: {
                                effects: "slideIn:up"
                            }
                        },
                        select: function() {
                            that.set("vm_isError", false);
                        },
                    }).data("kendoDropDownList");
                });
            };

            this.vm_onDismissClick = function() {
                if(typeof(patient) === "undefined" || patient === null) {
                    $snapNotification.error("Cannot dismiss consultation. Missed patient info.");
                    return;
                }

                var dismissReasonId = dropdownlist.value();

                if(dismissReasonId === "") {
                    this.set("vm_isError", true);
                    return;
                }

                this.set("vm_isLoading", true);

                var that = this;
                $appointmentService.dismissAppointment(patient.appointmentId, dismissReasonId).always(function() {
                    that.set("vm_isLoading", false);
                }).fail(function() {
                    $snapNotification.error("Cannot dismiss appointment");
                }).done(function() {
                    dialog.close();

                    $eventAggregator.published("patientCard_dismissed", patient.appointmentId);
                });
                
            };

            this.vm_onCancelClick = function() {
                dialog.close();  
            };            
        }).singleton();
}(jQuery, snap, kendo));
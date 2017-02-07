(function($, snap, kendo, window) {
    "use strict";

    snap.namespace("snap.admin.schedule").use(["snapNotification", "snap.EventAggregator", "snap.common.schedule.ScheduleCommon", "snap.admin.AvailabilityBlockFactory", "snap.admin.schedule.AdminScheduleDSFactory", "snap.service.availabilityBlockService", "snap.admin.schedule.TimeUtils"])
        .define("eventDialog", function($snapNotification, $eventAggregator, $scheduleCommon, $availabilityBlockFactory, $adminScheduleDSFactory, $availabilityBlockService, $timeUtils) {
            var 
                content = null,
                container = "#popUpContainer",
                currentDialog = null;

            function loadContent(eventVM) {
                var dfd = $.Deferred();

                    if (eventVM._type == $scheduleCommon.eventType.availabilityBlock){
                        $.get("/content/admin/schedule/eventDialog.html" + snap.addVersion, function (data) {
                            content = data;
                            dfd.resolve(content);
                        });
                    } else if (eventVM._type == $scheduleCommon.eventType.appointment){
                        $.get("/content/admin/schedule/apptDialog.html" + snap.addVersion, function (data) {
                            content = data;
                            dfd.resolve(content);
                        });
                    } else if (eventVM._type == $scheduleCommon.eventType.documentEncounter){
                        $.get("/content/admin/schedule/encounterDialog.html" + snap.addVersion, function (data) {
                            content = data;
                            dfd.resolve(content);
                        });
                    } else {
                        var error = "Unknown event type";
                        $snapNotification.error(error);
                        throw error;
                    }
               

                return dfd.promise();
            }

            function open(eventVM) {
                close();

                var dfd = $.Deferred();

                setTimeout(function(){
                    loadContent(eventVM).done(function(content) {
                        if($(container).length === 0) {
                            $("body").append("<div id='popUpContainer'></div>");
                        } 

                        var $container = $(container);                    
                        $container.html(content);

                        if(currentDialog === null) {
                            $container.kendoWindow({
                                actions: [],
                                modal: true,
                                resizable: false,
                                animation: false
                            });

                            $container.parent().addClass('dialogbox-modal');


                            currentDialog = $container.data("kendoWindow");
                        }

                        var $apptEditor = $(container).find("#" + eventVM._type + "_editor" );
                        kendo.bind($apptEditor, eventVM);

                        $apptEditor.show();

                        currentDialog.center();
                        currentDialog.open();

                        setTimeout(function(){
                            $apptEditor.find('.dialogbox-master').addClass("is-visible");
                        }, 100);

                        $container.find(".k-grid-header").css('display', 'none');

                        dfd.resolve(); 
                    });
                }, 200);

                return dfd.promise();
            }

            function close() {
                if(currentDialog) {
                    $snapNotification.hideAllConfirmations();
                    $(container).find('.dialogbox-master').addClass("is-hidden");

                    setTimeout(function(){
                        // currentDialog.close();
                        currentDialog.destroy();
                        currentDialog = null;
                    }, 200);
                }
            }

            //*********************** EVENTS SUBSCRIPTION ************************/
            [
                "ab_onCloseClick",
                "ab_onRemoveClick",
                "ab_onSubmitClick",
                "appt_onCloseClick",
                "appt_onRemoveClick",
                "appt_onSubmitClick",
                "appt_onReschedule",
                "encDoc_onSubmitClick",
                "encDoc_onCloseClick"

            ].forEach(function(event) {
                $eventAggregator.subscriber(event, function() {
                    close();
                });
            });

            $eventAggregator.subscriber("dialog_onFocus", function() {
                $("#popUpContainer").focus();
            });
            

            //*********************** PUBLIC METHODS *****************************/
            this.open = function(opt, displayOpt) {
                var dfd = $.Deferred();
                var event = null;

                switch (displayOpt.type) {
                    case $scheduleCommon.eventType.appointment:
                        event = $availabilityBlockFactory.createAppointment(opt, displayOpt);
                        break;
                    case $scheduleCommon.eventType.availabilityBlock:
                        event = $availabilityBlockFactory.createAvailabilityBlock(opt, displayOpt);
                        break;
                    case $scheduleCommon.eventType.documentEncounter:
                        event = $availabilityBlockFactory.createDocumentEncounter(opt, displayOpt);
                        break;
                    default:
                        var error = "Unknown event type";
                        $snapNotification.error(error);
                        throw error;
                }

                event = kendo.observable(event);
                open(event).done(function() {
                    var editor = $("#editor").data("kendoEditor");
                    if (editor) {
                        editor.refresh();
                    }
                    dfd.resolve(event);
                });
                return dfd.promise();
            };

            this.close = function() {
                close();
            };

            this._openAppointmentDialog = function(options, displayOpt) {
                var dfd = $.Deferred();
                this.open(options, displayOpt).done(function(newAppt) {
                    var appt = newAppt;
                    appt.load(options.clinicianId ? [options.clinicianId] : [], displayOpt.userType).done(function() {
                        dfd.resolve(appt);
                    });
                });

                return dfd.promise();
            };

            this.openNewAppointmentDialog = function(dialogOpt) {
                var dfd = $.Deferred();

                var clinicianId = dialogOpt.clinicianId ? parseInt(dialogOpt.clinicianId) : null;
                var patientId = dialogOpt.patientId ? parseInt(dialogOpt.patientId) : null;

                var options = { 
                    clinicianId: clinicianId, 
                    patientId: patientId 
                };
                var displayOpt = {
                    type: $scheduleCommon.eventType.appointment,
                    userType: dialogOpt.userType,
                    forceReadOnly: false
                };

                this._openAppointmentDialog(options, displayOpt).done(function(appt) {
                    dfd.resolve(appt);
                });

                return dfd.promise();
            };

            this.openNewRecordDialog = function(dialogOpt) {
                var dfd = $.Deferred();

                var clinicianId = dialogOpt.clinicianId ? parseInt(dialogOpt.clinicianId) : null;
                var patientId = dialogOpt.patientId ? parseInt(dialogOpt.patientId) : null;

                var options = { 
                    clinicianId: clinicianId, 
                    patientId: patientId 
                };
                var displayOpt = {
                    type: $scheduleCommon.eventType.documentEncounter,
                    userType: dialogOpt.userType,
                    forceReadOnly: false
                };

                this._openAppointmentDialog(options, displayOpt).done(function(appt) {
                    dfd.resolve(appt);
                });

                return dfd.promise();
            };

            this.rescheduleAppointment = function(dialogOpt, userType) {
                var dfd = $.Deferred();

                var clinicianId = dialogOpt.clinicianId ? parseInt(dialogOpt.clinicianId) : null;
                var patientId = dialogOpt.patientId ? parseInt(dialogOpt.patientId) : null;

                var intakeMetadata = dialogOpt.intakeMetadata ? dialogOpt.intakeMetadata : null;
                var waiveFee = dialogOpt.waiveFee ? dialogOpt.waiveFee : false;

                var options = { 
                    clinicianId: clinicianId, 
                    patientId: patientId,
                    intakeMetadata: intakeMetadata,
                    waiveFee: waiveFee,
                    participants: dialogOpt.participants,
                    phoneNumber: dialogOpt.phoneNumber,
                    phoneType: dialogOpt.phoneType,
                    encounterTypeCode: dialogOpt.encounterTypeCode,
                    serviceTypeId: dialogOpt.serviceTypeId,
                    timeZoneId: dialogOpt.timeZoneId,
                    zonedStart: dialogOpt.zonedStart,
                    zonedEnd: dialogOpt.zonedEnd
                };

                if (dialogOpt.appointmentTypeCode !== $scheduleCommon.appointmentTypeCode.clinicianScheduled) {
                    // to prevent using wrong service type
                    options.serviceTypeId = null;
                }

                var displayOpt = {
                    type: $scheduleCommon.eventType.appointment,
                    userType: userType,
                    forceReadOnly: false
                };

                if (userType === $scheduleCommon.userType.clinician && options.clinicianId && options.clinicianId != snap.profileSession.userId) {
                    // if Provider reschedule appointment of another Provider, we should force change selected clinician
                    options.clinicianId = snap.profileSession.userId;
                    var provider = $scheduleCommon.findProvider(options.participants);
                    if (provider) {
                        options.participants.splice(options.participants.indexOf(provider), 1);
                    }
                }
                this._openAppointmentDialog(options, displayOpt).done(function(appt) {
                    dfd.resolve(appt);
                });

                return dfd.promise();
            };

            this.openExistedAppointmentDialog = function(apptId, type, userType, isDNA){
                var dfd = $.Deferred();

                var that = this;

                var promise = userType === $scheduleCommon.userType.patient ?
                    $availabilityBlockService.getAppointmentForpatient(apptId) :
                    $availabilityBlockService.getAppointment(apptId);
                promise.done(function(response) {
                    var appt = response.data[0];
                    appt.id = appt.appointmentId;
                    appt.start = $timeUtils.dateFromSnapDateString(appt.startTime);
                    appt.end = $timeUtils.dateFromSnapDateString(appt.endTime);
                    appt.isReschedulable = !!isDNA && userType != $scheduleCommon.userType.patient;
                    appt.phoneNumber = appt.where;
                    appt.phoneType = appt.whereUse;
                    if (appt.zonedTime) {
                        appt.timeZoneId = appt.zonedTime.timeZoneId;
                        appt.zonedStart = $timeUtils.dateFromSnapDateString(appt.zonedTime.startTime);
                        appt.zonedEnd = $timeUtils.dateFromSnapDateString(appt.zonedTime.endTime);
                    }

                    var displayOpt = {
                        type: type,
                        userType: userType,
                        forceReadOnly: !!isDNA
                    };

                    that._openAppointmentDialog(appt, displayOpt).done(function(exstAppt) {
                        dfd.resolve(exstAppt);
                    });
                });

                return dfd.promise(); 
            };

        }).singleton();
}(jQuery, snap, kendo, window));
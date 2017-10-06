//@ sourceURL=appointmentPopup.dialog.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
    .use(["snapNotification",
        "snap.EventAggregator",
        "snap.patient.schedule.AppointmentFactory",
        "snap.patient.schedule.patientAppointmentService",
        "snap.service.availabilityBlockService",
        "snap.common.schedule.ScheduleCommon",
        "snap.common.TimeUtils",
        "snap.service.selfSchedulingService"])
        .define("appointmentDialog", function ($snapNotification,
            $eventAggregator, $appointmentFactory, $appointmentsService,
             $availabilityBlockService, $scheduleCommon,
             $timeUtils, $selfSchedulingService) {
            var
                content = null,
                container = "#patientPopUpContainer",
                currentDialog = null;

            var dlg = this;
            function loadContent() {
                var dfd = $.Deferred();

                if (content === null) {
                    $.get("/content/patient/schedule/appointmentDialog.html" + snap.addVersion, function (data) {
                        content = data;
                        dfd.resolve(content);
                    });
                } else {
                    dfd.resolve(content);
                }

                return dfd.promise();
            }
            
            function open(eventVM) {
                close();

                var dfd = $.Deferred();

                loadContent().done(function (content) {
                    if ($(container).length === 0) {
                        $("body").append("<div id='patientPopUpContainer'></div>");
                    }

                    var $container = $(container);


                    $container.html(content);

                    eventVM.dialogContainer = $container;

                    $eventAggregator.subscriber("apptvm_TimeSlotSelected", function (timeSlot) {
                        eventVM.set("start", timeSlot.start);
                        eventVM.set("end", timeSlot.end);
                        eventVM.set("availabilityBlockId", timeSlot.availabilityBlockId);
                        eventVM.set("isNow", timeSlot.isNow);
                        eventVM.toggleDateArea();
                    });

                    $eventAggregator.subscriber("slotTray_goToDate", function (obj) {
                        var dateFilter = new Date(obj.nextDate);
                        dateFilter.setHours(0, 0, 0, 0);

                        eventVM.setSlotsDate(dateFilter);
                    });



                    if (currentDialog === null) {
                        $container.kendoWindow({
                            actions: [],
                            modal: true,
                            resizable: false,
                            animation: false
                        });

                        $container.parent().addClass('dialogbox-modal');

                        currentDialog = $container.data("kendoWindow");
                    }
                    
                    kendo.bind($container, eventVM);

                    $container.show();

                    currentDialog.center();
                    currentDialog.open();
                    eventVM.load();

                    setTimeout(function(){
                        $container.find('.dialogbox-master').addClass("is-visible");
                    }, 100);

                    $container.find(".k-grid-header").css('display', 'none');
 $(".k-overlay").click(function () {
                        close();
                    });

                    $("#patientPopUpContainer").click(function (e) {
                        var div = eventVM._type + "_editor";

                        if(e.target.id == div){
                            close();
                        }

                        if (e.target !== this)
                            return;
                          
                        close();
                    });

                    dfd.resolve();
                });

                return dfd.promise();
            }

            function close() {
                if (currentDialog) {
                    $(container).find('.dialogbox-master').addClass("is-hidden");
                    $snapNotification.hideAllConfirmations();
                    setTimeout(function(){
                        currentDialog.close();
                        currentDialog.destroy();
                        currentDialog = null;
                        $eventAggregator.published(dlg.appointmentPopupClosedEvent);
                    }, 200);
                }
            }

            this.appointmentPopupSavedEvent = "apptpp_IsSaved";
            this.appointmentPopupClosedEvent = "apptpp_IsClosed";

            ///*********************** EVENTS SUBSCRIPTION ************************/
            [
                $appointmentFactory.closeEvent
            ].forEach(function (event) {
                $eventAggregator.subscriber(event, function () {
                    close();
                });
            });

            [
                $appointmentFactory.savedEvent,
                $appointmentFactory.removedEvent
            ].forEach(function (event) {
                $eventAggregator.subscriber(event, function () {
                    close();
                    $eventAggregator.published(dlg.appointmentPopupSavedEvent);
                });
            });


            /*********************** PUBLIC METHODS *****************************/
            this.open = function (opt) {
                var event = $appointmentFactory.createNew(opt);
                
                event = kendo.observable(event);
                open(event).done(function () {
                    // var editor = $("#editor").data("kendoEditor");
                    // if (editor !== null) {
                    //     editor.refresh();
                    // }

                });

                return event;
            };

            this.close = function () {
                close();
            };


            this.openNewAppointmentDialog = function (dialogOpt) {
                var dfd = $.Deferred();

                var that = this;
                $selfSchedulingService.getClinicianCard(dialogOpt.clinicianId, $timeUtils.dateToString(dialogOpt.start)).done(function (response) {
                    var clinicianCard = response.data[0];

                    var participants = [{
                        appointmentId: null,
                        attendenceCode: $scheduleCommon.attendenceCode.required,
                        person: {
                            id: clinicianCard.personId,
                            photoUrl: clinicianCard.profilePhoto,
                            providerId: snap.hospitalSession.hospitalId,
                            name: {
                                given: clinicianCard.name,
                                family: clinicianCard.lastName
                            },
                            speciality: {
                                primary: clinicianCard.medicalSpeciality,
                                secondary: clinicianCard.subSpeciality
                            }
                        },
                        participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
 }, {
                        appointmentId: null,
                        attendenceCode: $scheduleCommon.attendenceCode.required,
                        person: {},
                        participantTypeCode: $scheduleCommon.participantTypeCode.patient,
                        patientId: dialogOpt.patientProfileId ? dialogOpt.patientProfileId : snap.profileSession.profileId
                    }];

                    var result = {
                        appt: {
                            start: dialogOpt.start,
                            end: dialogOpt.end,
                            availabilityBlockId: dialogOpt.availabilityBlockId,
                            participants: participants,
                            intakeMetadata: [],
                            isNow: dialogOpt.isNow
                        },
                        clinicianCard: {
                            userId: clinicianCard.userId,
                            slots: clinicianCard.slots

                        },
                        // we need this in order to select current patient in dialog. Currently we do not have api which can return person record on clinician site.
                          patientProfileId: dialogOpt.patientProfileId ? dialogOpt.patientProfileId : snap.profileSession.profileId
                    };

                    var appt = that.open(result);
                    dfd.resolve(appt);
            }).fail(function () {
                $snapNotification.error("Provider card information is not available");
            });
               
                return dfd.promise();
            };

            this.openExistedAppointmentDialog = function (apptId, isReadOnly) {
                var dfd = $.Deferred();

                var that = this;

                $selfSchedulingService.getAppointment(apptId).done(function (resp) {
                    var result = {
                        appt: resp.data[0],
                        isReadOnly: isReadOnly,
                        clinicianCard: {
                            userId: resp.data[0].clinicianId,
                            slots: []
                        },
                        patientProfileId: resp.data[0].patientId
                    };

                    result.appt.start = $timeUtils.dateFromSnapDateString(result.appt.startTime);
                    result.appt.end = $timeUtils.dateFromSnapDateString(result.appt.endTime);
                    result.appt.phoneNumber = result.appt.where;
                    result.appt.phoneType = result.appt.whereUse;
                   
                    $selfSchedulingService.getClinicianCard(result.appt.clinicianId, $timeUtils.dateToString($timeUtils.dateFromSnapDateString(result.appt.startTime))).done(function (clinicianResp) {
                        var clinicianCard =  clinicianResp.data[0];
                        result.clinicianCard = {
                            userId: clinicianCard.userId,
                            slots: clinicianCard.slots
                        };
                        var clinician = $scheduleCommon.findProvider(result.appt.participants);
                        if (clinician) {
                            clinician.person.speciality = {
                                primary: clinicianCard.medicalSpeciality,
                                secondary: clinicianCard.subSpeciality
                            };
                        }
                    }).fail(function () {
                        if (!result.isReadOnly) {
                            result.isClinicianDisabled = true;
                        }
                    }).always(function () {
                        var appt = that.open(result);
                        dfd.resolve(appt);
                    });
                });

                return dfd.promise();
            };

        }).singleton();
}(jQuery, snap, kendo));
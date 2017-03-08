//@ sourceURL=adminScheduler.viewmodel.js
var CustomAgenda = kendo.ui.AgendaView.extend({
    startDate: function () {
        var date = kendo.ui.AgendaView.fn.endDate.call(this);
        return kendo.date.firstDayOfMonth(date);
    },
    endDate: function () {
        var date = kendo.ui.AgendaView.fn.endDate.call(this);
        return kendo.date.lastDayOfMonth(date);
    },
    nextDate: function () {
        return kendo.date.nextDay(this.endDate());
    },
    previousDate: function () {
        var date = this.startDate();
        return kendo.date.firstDayOfMonth(kendo.date.addDays(date, -1));
    }
});

var CustomWeek = kendo.ui.WeekView.extend({
    render: function () {
        kendo.ui.WeekView.prototype.render.apply(this, arguments);
        var that = this;
        snap.admin.schedule.currentTimeMarker().getTime().done(function (userDate) {
            var now = new Date();
            if (now.toDateString() !== userDate.toDateString()) {
                if (that._startDate <= now && that._endDate >= now) {
                    that.table.find(".k-scheduler-header th:nth-child(" + (now.getDay() + 1) + ")").removeClass('k-today');
                    that.table.find("td[role='gridcell']:nth-child(" + (now.getDay() + 1) + ")").removeClass('k-today');
                }

                if (that._startDate <= userDate && that._endDate >= userDate) {
                    that.table.find(".k-scheduler-header th:nth-child(" + (userDate.getDay() + 1) + ")").addClass('k-today');
                    that.table.find("td[role='gridcell']:nth-child(" + (userDate.getDay() + 1) + ")").addClass('k-today');
                }
            }
        });

    }
});

var CustomDay = kendo.ui.DayView.extend({
    render: function () {
        kendo.ui.DayView.prototype.render.apply(this, arguments);
        var that = this;
        snap.admin.schedule.currentTimeMarker().getTime().done(function (userDate) {
            var now = new Date();
            if (now.toDateString() !== userDate.toDateString()) {
                if (that._startDate.toDateString() === now.toDateString()) {
                    that.table.find(".k-scheduler-header th").removeClass('k-today');
                    that.table.find("td[role='gridcell']").removeClass('k-today');
                }
                if (that._startDate.toDateString() === userDate.toDateString()) {
                    that.table.find(".k-scheduler-header th").addClass('k-today');
                    that.table.find("td[role='gridcell']").addClass('k-today');
                }
            }
        });

    }
});

var CustomMonth = kendo.ui.MonthView.extend({
    render: function () {
        kendo.ui.MonthView.prototype.render.apply(this, arguments);

        var that = this;
        snap.admin.schedule.currentTimeMarker().getTime().done(function (userDate) {
            var now = new Date();
            if (now.toDateString() !== userDate.toDateString()) {
                if (that._startDate <= now && that._endDate >= now) {
                    that.table.find("td[role='gridcell']").removeClass('k-today');
                }
                if (that._startDate <= userDate && that._endDate >= userDate) {
                    $(that.table.find("td[role='gridcell']:not(.k-other-month)")[userDate.getDate() - 1]).addClass('k-today');
                }
            }
        });

    }
});


(function ($, snap, kendo, window, isMobile) {
    "use strict";
    var CustomTabNames = {
        CustomAgenda: "CustomAgenda",
        CustomDay: "CustomDay",
        CustomWeek: "CustomWeek",
        CustomMonth: "CustomMonth"
    };

    snap.wasSchedulerUpdatedLastMin = false;
    snap.minSchedulerRefresh = 10000;

    snap.namespace("snap.admin.schedule").use(["snap.service.availabilityBlockService", "snap.admin.schedule.TimeUtils"])
    .define("currentTimeMarker", function ($availabilityBlockService, $timeUtils) {
        var schedulersIds = [];

        function setMarkers(userTime) {
            var markers = getMarkers();

            markers.forEach(function (marker) {
                var timeTable = marker.$time.parent().find(".k-scheduler-table");
                var k = $(timeTable).height() / 1440;

                if (k > 0) {
                    var position = Math.floor(k * (userTime.getHours() * 60 + userTime.getMinutes()));

                    marker.$time.find(".custom_current-time").css({ top: position + 'px' });
                    marker.$content.find(".custom_current-time").css({ top: position + 'px' });
                }
            });
        }

        function getMarkers() {
            var markers = [];
            schedulersIds.forEach(function (schedulerId) {
                $("#" + schedulerId + " > .k-scheduler-layout > tbody > tr:nth-child(2)").each(function (i, element) {

                    var marker = {
                        $time: $($(element).find(".k-scheduler-times")[0]),
                        $content: $($(element).find(".k-scheduler-content")[0])
                    };

                    if ($(".custom_current-time", marker.$time).length === 0) {
                        marker.$time.append("<div class='custom_current-time'></div>");
                    }
                    if ($(".custom_current-time", marker.$content).length === 0) {
                        marker.$content.append("<div class='custom_current-time'></div>");
                    }

                    markers.push(marker);
                });
            });

            return markers;
        }

        this.currentUserTime = null;

        this.setCurrentUserTime = function () {
            var refreshPromise = $.Deferred();
            var that = this;
            $availabilityBlockService.getUserCurrentTime().done(function (response) {
                that.currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                refreshPromise.resolve();
            });
            return refreshPromise.promise();
        };

        this.getCurrentTimeDfd = $.Deferred();
        this.currentTimeCalled = false;
        this.getTime = function () {
            
            var that = this;
            if (this.currentUserTime === null){
                if (!this.currentTimeCalled) {
                    that.currentTimeCalled = true;
                    that.getCurrentTimeDfd = $.Deferred();
                    $availabilityBlockService.getUserCurrentTime().done(function (response) {
                        that.currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                        that.getCurrentTimeDfd.resolve(that.currentUserTime);
                    }).always(function () {
                        that.currentTimeCalled = false;
                    });

                }
                return that.getCurrentTimeDfd.promise();
            } else {
                var timeRequestDFD = $.Deferred();
                timeRequestDFD.resolve(this.currentUserTime);
                return timeRequestDFD.promise();
            }
           
        };

        this.addTimeMarkers = function (schedulerIds) {
            schedulerIds.forEach(function (schedulerId) {
                schedulersIds.push(schedulerId);
            });
            this.refreshTimeMarker();
        };

        this.initWithTimeMarkers = function (schedulerIds) {
            var that = this;
            this.refreshAll().done(function () {
                that.addTimeMarkers(schedulerIds);
            });
        };

        this.refreshTimeMarker = function () {
            if (this.currentUserTime) {
                setMarkers(this.currentUserTime);
            }
        };

        this.refreshAll = function () {
            var refreshPromise = $.Deferred();
            var that = this;
            this.setCurrentUserTime().done(function () {
                setMarkers(that.currentUserTime);
                refreshPromise.resolve();
            });
            return refreshPromise.promise();
        };

        var that = this;
        setInterval(function () {
            that.refreshAll();
        }, 300000);
    }).singleton();



    snap.namespace("snap.admin").use([
        "snapNotification",
        "snap.service.availabilityBlockService",
        "snap.EventAggregator",
        "snap.admin.AdminSchedulerNavigator",
        "snap.admin.AvailabilityBlockFactory",
        "snap.admin.schedule.TimeUtils",
        "snap.hub.notificationService",
        "snap.common.schedule.ScheduleCommon",
        "snap.service.staffAccountService",
        "snap.admin.schedule.AdminScheduleDSFactory",
        "snap.admin.schedule.eventService",
        "snap.admin.schedule.eventDialog",
        "snap.common.loadingStack",
        "snap.admin.schedule.coverageSchedulerLeftBar",
        "snap.hub.mainHub"])
        .extend(kendo.observable)
        .define("AdminSchedulerPageViewModel", function ($snapNotification, $availabilityBlockService, $eventAggregator, $adminSchedulerNavigator, 
            $availabilityBlockFactory, $timeUtils, $notificationService, $scheduleCommon, $staffAccountService, $adminScheduleDSFactory, $eventService, 
            $eventDialog, $loadingStack, $coverageSchedulerLeftBar, $mainHub) {
            $eventService.setScope($scheduleCommon.blockPermissions.allowProviderAppt);
            var scope = this,
                clinicianListDS = $adminScheduleDSFactory.getCliniciansDS(),
                schedulerViewMode = {
                    agenda: "agenda",
                    day: "day",
                    month: "month",
                    week: "week"
                },
                viewMode = {
                    availabilities: "availabilities",
                    appointments: "appointments",
                    coverage: "coverage"
                },
                errorMessages = {
                    noClinicianSelected: "Please select one or more users to view",
                    cannotAddAppointmentIntoThisCell: "This time-slot is currently unavailable.",
                    blockIsPrivate: "You cannot modify this availability block as it was marked Private by provider",
                    blockIsLocked: "You cannot modify this availability block as it was marked Locked by admin",
                    blockIsPast: "You cannot drag or resize past appointments",
                    protectedBlock: "You cannot edit this block.",
                    insufficientPermission: "You do not have permission to edit availability blocks or appointments",
                    selectorOverflow: "Currently we can only display five provider schedules at a time. Please deselect one or more providers in order to view another provider's schedule."
                };

            var Singleton = (function () {
                var appointmentScheduler,
                    availabilitiesScheduler,
                    coverageScheduler;

                function createAvailabilitiesInstance() {
                    return $("#availability").data("kendoScheduler");
                }

                function createAppointmentsInstance() {
                    return $("#appointments").data("kendoScheduler");
                }

                function createCoverageInstance() {
                    return $("#coverages").data("kendoScheduler");
                }

                return {
                    getAppointmentsScheduler: function () {
                        if (!appointmentScheduler) {
                            appointmentScheduler = createAppointmentsInstance();
                        }
                        return appointmentScheduler;
                    },

                    getAvailabilitiesScheduler: function () {
                        if (!availabilitiesScheduler) {
                            availabilitiesScheduler = createAvailabilitiesInstance();
                        }
                        return availabilitiesScheduler;
                    },

                    getCoverageScheduler: function () {
                        if (!coverageScheduler) {
                            coverageScheduler = createCoverageInstance();
                        }
                        return coverageScheduler;
                    }
                };
            })();

            function EventSlotVM(blocks) {
                this.availabilityBlock = blocks.length > 0 ? blocks[0] : null;
                this.isDefined = this.availabilityBlock !== null;

                this.allowOnDemandAppt = false;
                this.allowSelfAppt = false;
                this.allowProviderAppt = false;
                this.isAvailable = false;
                this.isPastBlock = false;

                if (this.availabilityBlock) {
                    this.allowOnDemandAppt = this.availabilityBlock.allowOnDemandAppt;
                    this.allowSelfAppt = this.availabilityBlock.allowSelfAppt;
                    this.allowProviderAppt = this.availabilityBlock.allowProviderAppt;
                    this.isAvailable = this.availabilityBlock.isAvailable;

                    this.isPastBlock = this.availabilityBlock.end < scope.currentTimeMarker.currentUserTime;
                }
            }

            function splitSeveralDayEvents(events) {
                var splittedEvents = [];
                events.forEach(function (event) {
                    if (event.start.toDateString() !== event.end.toDateString()) {
                        // if we have an event which includes 2 days, we split it by midnight
                        var nextDayEvent = $.extend({ hasPrevious: true }, event);
                        event = $.extend({ hasNext: true }, event);
                        nextDayEvent.start = new Date(event.end);
                        nextDayEvent.end = new Date(event.end);
                        nextDayEvent.start.setHours(0, 0, 0, 0);
                        event.end = new Date(event.start);
                        // set 23:59 to kendo won't additionally split this event
                        event.end.setHours(23, 59, 0, 0);
                        splittedEvents.push(event);
                        if (nextDayEvent.start.getTime() === nextDayEvent.end.getTime()) {
                            // ignore events with zero duration
                            event.hasNext = false;
                        } else {
                            splittedEvents.push(nextDayEvent);
                        }
                    } else {
                        // if we have a usual single-day event, we just copy it
                        splittedEvents.push(event);
                    }
                });
                return splittedEvents;
            };

            var getSlots = function (elements, date) {
                var startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);

                var slots = [];
                for (var i = 0; i < elements.length; i++) {
                    var startMin = i * 30;
                    var endMin = (i + 1) * 30;

                    slots.push({
                        element: elements[i],
                        startDate: $timeUtils.addMinutes(startDate, startMin),
                        endDate: $timeUtils.addMinutes(startDate, endMin)
                    });
                }

                return slots;
            };


            var scrollToHour = function (hour, scheduler) {
                var view = scheduler.view().title.toLowerCase();
                if (view === schedulerViewMode.day || view === schedulerViewMode.week) {
                    var $contentDiv = scheduler.element.find("div.k-scheduler-content");
                    var rows = $contentDiv.find("tr"); //48 rows for each 30 min.

                    var firtRowPosition = $(rows[0]).position();
                    var rowPosition = $(rows[hour * 2]).position();

                    $contentDiv.scrollTop(rowPosition.top - firtRowPosition.top);
                }
            };

            var scrollToDayAndHour = function (date, hour, scheduler) {
                scrollToDay(date, scheduler);

                scheduler.one("dataBound", function () {
                    scrollToHour(hour, scheduler);
                });
            };

            var scrollToDay = function (date, scheduler) {
                var d = new Date(date);
                d.setHours(0, 0, 0, 0);
               // var adjustedD = new Date($timeUtils.dateToString(d));
               // scheduler.date(adjustedD);
                scheduler.date(d);
            };

            var isHourIntoView = function (hour, scheduler) {
                var view = scheduler.view().title.toLowerCase();
                if (view === schedulerViewMode.day || view === schedulerViewMode.week) {
                    var $contentDiv = scheduler.element.find("div.k-scheduler-content");
                    var rows = $contentDiv.find("tr"); //48 rows for each 30 min.

                    var $first = $(rows[0]);
                    var $elem = $($contentDiv.find("tr")[hour * 2]);

                    var docViewTop = $contentDiv.scrollTop();
                    var docViewBottom = docViewTop + $contentDiv.height();

                    var elemTop = $elem.position().top - $first.position().top;
                    var elemBottom = elemTop + $elem.height();

                    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
                }

                return true; //For Month and Agenda
            };

            var getIntervalEndDate = function (startDate, settingName, defaultInterval) {
                var endDate = new Date(startDate);

                if (snap.hospitalSettings && snap.hospitalSettings[settingName]) {
                    endDate.setMinutes(endDate.getMinutes() + parseInt(snap.hospitalSettings[settingName]));
                } else {
                    endDate.setMinutes(endDate.getMinutes() + defaultInterval);
                }

                return endDate;
            };

            var checkPermissions = function () {
                var msg = null;

                if (!snap.hasAllPermission(snap.security.manage_staff_schedule)) {
                    msg = errorMessages.insufficientPermission;
                }

                return msg;
            };

            var adjustCoverageBlock = function (block) {
                var blocks = [];
                var startTime = $timeUtils.dateFromSnapDateString(block.from);
                var endTime = $timeUtils.dateFromSnapDateString(block.to);
                var endTimeTemp = endTime;
                if ((endTime - startTime) > 0) {
                    while (endTime.toDateString() !== startTime.toDateString()) {
                        endTimeTemp = new Date(startTime);
                        endTimeTemp.setHours(23);
                        endTimeTemp.setMinutes(59);
                        blocks.push($.extend({}, block, {
                            from: new Date(startTime),
                            to: new Date(endTimeTemp)
                        }));
                        startTime.setDate(startTime.getDate() + 1);
                        startTime.setHours(0);
                        startTime.setMinutes(0);
                    }

                    if ((endTime - startTime) > 0) {
                        var newBlock = $.extend({}, block, {
                            from: new Date(startTime),
                            to: new Date(endTime)
                        });

                        blocks.push(newBlock);
                    }

                }
                return blocks;
            };

            var loadingStack = $loadingStack.newStack(function () {
                scope.areScheduledEventsLoading = true;
                scope.trigger("change", { field: "areScheduledEventsLoading" });
            }, function () {
                scope.areScheduledEventsLoading = false;
                scope.trigger("change", { field: "areScheduledEventsLoading" });
            });

            //this.isSchedulerLoading = false;
            this.areScheduledEventsLoading = false;
            this.calendarSelectedDate = new Date();
            this.viewMode = viewMode.availabilities;

            this.groupsVM = $adminSchedulerNavigator.emptyNavigator;
            this.coverageSchedulerLeftBarVM = $coverageSchedulerLeftBar.emptyNavigator;

            this.currentTimeMarker = snap.admin.schedule.currentTimeMarker();

            this.isReadOnly = !snap.hasAllPermission(snap.security.manage_staff_schedule);

            this.setViewMode = function (vMode) {
                if (typeof (vMode) !== "string") {
                    vMode = viewMode.availabilities;
                }
                var defaultUserId = that._getPassedUserId();
                if (defaultUserId !== null && !!this.groupsVM) {
                    this.groupsVM.setActiveUser(defaultUserId, function () { });

                }
                this.set("viewMode", vMode);

                this.trigger("change", {
                    field: "isAppointmentsSchedulerVisible"
                });
                this.trigger("change", {
                    field: "isAvailabilityBlockSchedulerVisible"
                });
                this.trigger("change", {
                    field: "isCoverageSchedulerVisible"
                });

                this._updateNavigationBarView(this._getCurrentScheduler().view().name);

                this._scrollToHour(7);

                // This necessary for not active scheduler. In order to display all events correct when we change tab.
                // Also this will automatically fire OnItemDataBound and populate ApointmentsSlot. If necessary replace to _reloadSchedullers in order to reload data.
                $(window).trigger('resize');
                
                this.currentTimeMarker.refreshTimeMarker();
            };

            this.customEdit = function(element) {
                var scheduler = this._getCurrentScheduler();
                var dataItem = scheduler.occurrenceByUid(element.closest(".k-task").data("uid"));
                scheduler.editEvent(dataItem);           
            };

            this.initData = function (userType) {
                this.isDataInit = true;

                this.set("userType", userType);
                var that = this;
                $(document).ready(function () {
                    loadingStack.push();
                });

                $("#appointments").on("dblclick", ".scheduler__appt-custom",function() {
                    scope.customEdit($(this));
                });

                $("#availability").on("dblclick", ".scheduler__av-custom",function() {
                    scope.customEdit($(this));
                });

                

                $adminSchedulerNavigator.loadNavigator(this.userType).done(function (navigator) {
                    scope.coverageSchedulerLeftBarVM.updateUsers();
                    navigator.showNotActiveUsersAsDisabled(that.viewMode === viewMode.appointments);
                    that.set("groupsVM", navigator);
                    var defaultUserId = that._getPassedUserId() || snap.profileSession.userId;
                    navigator.addActiveUser(defaultUserId, function () {
                        loadingStack.pop();
                    });
                }).fail(function (error) {
                    $snapNotification.error(error);
                    loadingStack.pop();
                });

                this.currentTimeMarker.initWithTimeMarkers(["appointments", "availability", "coverages"]);

                $eventAggregator.subscriber("onItemActivated", function () {
                    //that.appointments.read(); //no needs reload availabilities.
                    that._reloadSchedullers();
                });

                $eventAggregator.subscriber("onItemsSelect", function () {
                    that._reloadSchedullers();
                });

                $eventAggregator.subscriber("onGroupEnter", function () {
                    that._reloadSchedullers();
                });
                $eventAggregator.subscriber("leftbarSelectorOverflowError", function () {
                    $snapNotification.info(errorMessages.selectorOverflow);
                });

                $eventAggregator.subscriber("ab_onRemoveClick", function () {
                    that.coverages.read();
                    that.availabilities.read();
                });

                $eventAggregator.subscriber("ab_onSubmitClick", function (event) {
                    var clinicianId = event.clinician.clinicianId;

                    that._scrollToEvent(Singleton.getAvailabilitiesScheduler(), event);
                    that.groupsVM.addActiveUser(clinicianId);
                    that.coverages.read();
                    that.availabilities.read();
                });

                $eventAggregator.subscriber("appt_onRemoveClick", function () {
                    that.appointments.read();
                });

                $eventAggregator.subscriber("appt_onSubmitClick", function (event) {
                    var personId = event.participants[0].person.id;
                    clinicianListDS.selectByPersonId(personId).done(function (clinician) {
                        var clinicianId = clinician.id;

                        that._scrollToEvent(Singleton.getAppointmentsScheduler(), event);
                        that.groupsVM.addActiveUser(clinicianId);

                        that.availabilities.read().done(function () {
                            that.appointments.read();
                            that.coverages.read();
                        });
                    });
                });

                $eventAggregator.subscriber("cslb_currentEventChanged", function (block) {
                    var data = that.coverages.data();
                    for (var i = 0, l = data.length; i < l; i++) {
                        if (data[i].id === block.id) {
                            data[i].set("isSelected", true);
                        } else {
                            data[i].set("isSelected", false);
                        }
                    }

                    that._scrollToEvent(Singleton.getCoverageScheduler(), block);
                });
                $eventAggregator.subscriber("cslb_coverageTypeChanged", function (type) {
                    var scheduler = Singleton.getCoverageScheduler();

                    // If user select "All" option we group coverage block by types in scheduler.
                    scheduler.options.group.resources = (type === "all") ? ["type"] : [];

                    // Unfortunately scheduler data read and refresh works bad in case if you use group resources.
                    // Data can remain ungroup.
                    // So, in order to correctly display grouped data, we will set current data in coverage scheduler.
                    // This automatically will load all necessary data and correctly display groups.
                    scrollToDay(that.calendarSelectedDate, scheduler);
                });
                if (isMobile.any()) {
                    var availabilitiesScheduler = Singleton.getAvailabilitiesScheduler();
                    var appointmentsScheduler = Singleton.getAppointmentsScheduler();
                    availabilitiesScheduler.options.mobile = true;
                    appointmentsScheduler.options.mobile = true;
                    var setDefaultView = function () {
                        if (window.innerHeight > window.innerWidth) { //Portrait
                            availabilitiesScheduler.view(schedulerViewMode.day);
                            appointmentsScheduler.view(schedulerViewMode.day);
                        } else { //Landscape
                            availabilitiesScheduler.view(schedulerViewMode.week);
                            appointmentsScheduler.view(schedulerViewMode.week);
                        }
                    };

                    setDefaultView();

                    $(window).resize(function () {
                        setDefaultView();
                    });
                }

                // When user load page we need to scroll all schedulers to the begging of working day.
                // We can't just use ScrollToHour(...) function, because data could be not loaded yet.
                // So, instead we will scroll after DataBound event fired.
                this._scrollToHourOnDataBound(7);

                $notificationService.on("message", function (messageType, message) {
                    if (messageType === "schedule_changed") {
                        if (snap.wasSchedulerUpdatedLastMin === false) {
                            window.console.log(message);
                            that._reloadSchedullers();
                            snap.wasSchedulerUpdatedLastMin = true;
                            setTimeout(function () {
                                snap.wasSchedulerUpdatedLastMin = false;
                            }, snap.minSchedulerRefresh);
                        }
                    }
                });

                this.resizeScheduler();
            };

            this.resizeScheduler = function () {
                var that = this;

                function fitScheduler() {
                    var scheduler = that._getCurrentScheduler();
                    var height = $('.right-col').outerHeight();
                    var view = scheduler.view().name;

                    //size widget to take the whole view
                    scheduler.element.height(height);
                    scheduler.resize(true);

                    if(view == "month"){
                        scheduler.view(view);
                    }
                }

                $(window).resize(function () {
                    clearTimeout(window._resizeId);
                    window._resizeId = setTimeout(function () {
                        fitScheduler();
                    }, 500);
                });
            };

            this.onCalendarChange = function (e) {
                e.preventDefault();
                this._scrollToDayMorning(this.calendarSelectedDate);
            };
            this.isClinician = function () {
                return this.get("userType") === $scheduleCommon.userType.clinician;
            };

            this.isLeftColActive = false;
            this.leftColToggle = function () {
                $(".header__search").toggleClass("done");

                if (this.isLeftColActive) {
                    this.set("isLeftColActive", false);
                } else {
                    this.set("isLeftColActive", true);
                }
            };

            this.isAppointmentsSchedulerVisible = function () {
                return this.viewMode === viewMode.appointments;
            };

            this.isAvailabilityBlockSchedulerVisible = function () {
                return this.viewMode === viewMode.availabilities;
            };

            this.isCoverageSchedulerVisible = function () {
                return this.viewMode === viewMode.coverage;
            };

            /**************************** MVVM BINDINGS ****************************/
            this.vm_onEventDoubleClick = function (e) {
                var error = e.event.validateIfEditAvailable();
                if (error) {
                    $snapNotification.info(error);
                } else {
                    e.event.open();
                }

                switch (e.event._type) {
                    case $scheduleCommon.eventType.appointment:
                        Singleton.getAppointmentsScheduler().cancelEvent();
                        break;
                    case $scheduleCommon.eventType.availabilityBlock:
                        Singleton.getAvailabilitiesScheduler().cancelEvent();
                        break;
                }

                e.preventDefault();
                return false;
            };

            this.vm_addNewEventClick = function (e) {

                if (!this.groupsVM.isAnyUserSelected()) {
                    e.preventDefault();
                    $snapNotification.info(errorMessages.noClinicianSelected);
                    return;
                }

                if (this.isAppointmentsSchedulerVisible()) {
                    this._addNewAppointment();
                } else {
                    this._addNewAvailabilityBlock();
                }

            };

            this.vm_onMoveOrResizeEventStart = function (e) {
                var event = e.event;
                var error = event.validateIfDragAndDropAvailable();

                if (error) {
                    $snapNotification.info(error);
                    e.preventDefault();
                    return false;
                }
            };

            this.vm_onMoveOrResizeEventEnd = function (e) {
                var event = e.event,
                    that = this;

                event.save(e.start, e.end).fail(function (error) {
                    if (error) {
                        $snapNotification.error(error);
                    }
                }).always(function () {
                    that.availabilities.read();
                    that.appointments.read();
                    that.coverages.read();
                });

                e.preventDefault();
                return false;
            };

            var that = this;
            /*************************** Coverage Block Scheduler API ****************************/
            this.coverages = new kendo.data.SchedulerDataSource({
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        loadingStack.push();
                        var filters = scope._getCoverageBlocksFilters();
                        $availabilityBlockService.getCoverageBlocks(filters).done(function (result) {
                            loadingStack.pop();
                            var data = [];
                            for (var i = 0, l = result.data.length; i < l; i++) {
                                data = data.concat(adjustCoverageBlock(result.data[i]));
                            }

                            options.success({
                                data: data,
                                total: data.length
                            });
                        }).fail(function (result) {
                            loadingStack.pop();
                            $snapNotification.error("Cannot read coverage blocks");
                            window.console.log(result);
                            options.error(result);
                        });
                    },
                },
                schema: {
                    data: function (response) {
                        idIncrement = 1;
                        var blocks = response.data.map(function (coverageBlock) {
                            coverageBlock.start = coverageBlock.from;
                            coverageBlock.end = coverageBlock.to;
                            return new CoverageBlock(coverageBlock);
                        });

                        return blocks;
                    }
                },
                change: function(e) {
                    if (typeof(e.action) === "undefined") {
                        scope.coverageSchedulerLeftBarVM.setCoverageBlocks(this.data());

                        if(!(scope.currentTimeMarker.currentUserTime && scope.coverageSchedulerLeftBarVM.trySelectNowBlock(that.currentTimeMarker.currentUserTime))) {
                            scope.coverageSchedulerLeftBarVM.selectBlockByIndex(0);
                        }
                    }
                }
            });

            this.covarege_onSchedulerNavigate = function (e) {
                if (e.action === "changeView") {
                    this.coverageSchedulerLeftBarVM.updateCoverageType(e.view === CustomTabNames.CustomDay);
                    Singleton.getCoverageScheduler().options.group.resources = [];
                    Singleton.getCoverageScheduler().view(Singleton.getCoverageScheduler().view().name);
                }
                this._scrollToDayMorning(e.date);
            };

            this.covarege_onDataBound = function () {
                this.currentTimeMarker.refreshTimeMarker();

                $('.cc-scheduling__coverage-block').each(function(){
                    if($(this).height() < 10){
                        $(this).addClass('is-no-padding');
                    }
                });

            };


            //*************************** Availability Block Scheduler API ****************************/
            this.availabilities = new kendo.data.SchedulerDataSource({
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        var filters = scope._getAvailabilityBlocksFilters();
                        if (filters.clinicianIds.length > 0) {
                            loadingStack.push();
                            $availabilityBlockService.getAvailabilityBlocks(filters).done(function (result, status, xhr) {
                                var abRequestTime = xhr.getResponseHeader("X-Snap-Time");
                                var popTimeout = 100;
                                if (scope._getCurrentScheduler().view().title.toLowerCase() === schedulerViewMode.agenda) {
                                    popTimeout = 500;
                                }
                                window.setTimeout(function () {
                                    loadingStack.pop();
                                }, popTimeout);
                                options.success({
                                    abRequestTime: abRequestTime,
                                    data: result.data,
                                    total: result.total
                                });
                            }).fail(function (result) {
                                loadingStack.pop();
                                $snapNotification.error("Cannot read availability blocks");
                                window.console.log(result);
                                options.error(result);
                            });
                        } else {
                            options.success({
                                total: 0,
                                data: []
                            });
                        }
                    },
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "string" }  //this definition necessary in order show kendo scheduler that we use guid as id.
                        }
                    },
                    data: function (response) {
                        var blocks = response.data.map(function (ab) {
                            ab.start = $timeUtils.dateFromSnapDateString(ab.startTime);
                            ab.end = $timeUtils.dateFromSnapDateString(ab.endTime);
                            ab.abRequestTime = new Date(response.abRequestTime);
                            return new AvailabilityBlock(ab);
                        });
                        if (scope._getCurrentScheduler().view().title.toLowerCase() === schedulerViewMode.agenda) {
                            // for agenda view mode we call a custom splitting function becouse agenda splits events incorrectly.
                            blocks = splitSeveralDayEvents(blocks);
                        }

                        return blocks;
                    }
                }
            });

            this.abs_onDataBound = function () {
                this.currentTimeMarker.refreshTimeMarker();
            };

            this.abs_onSchedulerNavigate = function (e) {
                if(e.action === "changeView" && e.view === "day") {
                    // Since we have custom view 'CustomDay' instead of default 'day' view, we need set appropriate view in scheduler.
                    // This problem happens in Month view when we want to see all events in cell and click on  "   ...   " button.
                    Singleton.getAvailabilitiesScheduler().view(CustomTabNames.CustomDay);
                }
                this._scrollToDayMorning(e.date);
            };

            this.abs_add = function (e) {
                var errorMessage = checkPermissions();
                if (errorMessage !== null) {
                    $snapNotification.error(errorMessage);
                    e.preventDefault();
                    return false;
                }
                if (this.groupsVM.isAnyUserSelected()) {
                    var isAllDay = e.event.isAllDay;
                    var startDate = new Date(e.event.start);

                    var endDate;
                    if (isAllDay) {
                        endDate = new Date(e.event.start);
                        endDate.setDate(endDate.getDate() + 1);
                    } else {
                        endDate = this._getAvailabilityEndDate(startDate);
                    }

                    var clinicianId = 
                        (Singleton.getAvailabilitiesScheduler().view().name == schedulerViewMode.day) ? 
                        e.event.clinicianId : 
                        this.groupsVM.getFirstActiveUser().id;

                    var block = new AvailabilityBlock({
                        start: startDate,
                        end: endDate,
                        isAllDay: isAllDay,
                        clinician: {
                            clinicianId: clinicianId,
                            locked: false,
                            private: false
                        }
                    });

                    block.open();
                } else {
                    $snapNotification.info(errorMessages.noClinicianSelected);
                }

                Singleton.getAvailabilitiesScheduler().cancelEvent();
                e.preventDefault();
                return false;
            };

            //*************************** Appointment Block Scheduler API ****************************/

            function readClinicianResources(options, useUserIdAsValue) {
                var selectedUsers = scope.groupsVM.getAllSelectedUsers();
                if (selectedUsers.length === 0) {
                    options.success([]);
                } else {
                    clinicianListDS.getLocalDS().done(function (ds) {
                        var users = [];

                        scope.groupsVM.getAllSelectedUsers().forEach(function (user) {
                            var person = ds.selectById(user.id);

                            if (person) {
                                users.push({
                                    text: person.name,
                                    value: useUserIdAsValue ? user.id : person.personId,
                                    clinicianId: person.id
                                });
                            }
                        });

                        options.success(users);
                    });
                }
            }

            this.abSelectedClinicians = new kendo.data.SchedulerDataSource({
                transport: {
                    read: function (options) {
                        readClinicianResources(options, true);
                    }
                }
            });

            this.selectedClinicians = new kendo.data.SchedulerDataSource({
                transport: {
                    read: function (options) {
                        readClinicianResources(options, false);
                    }
                }
            });

            this.appointments = new kendo.data.SchedulerDataSource({
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        var filters = scope._getAppointmentsFilters();
                        if (filters.clinicianIds.length > 0) {
                            loadingStack.push();
                            $availabilityBlockService.getAppointmentsForClinician(filters).done(function (result) {
                                var popTimeout = 100;
                                if (scope._getCurrentScheduler().view().title.toLowerCase() === schedulerViewMode.agenda) {
                                    popTimeout = 500;
                                }
                                window.setTimeout(function () {
                                    loadingStack.pop();
                                }, popTimeout);
                                options.success({
                                    data: result.data,
                                    total: result.total
                                });

                            }).fail(function (result) {
                                loadingStack.pop();
                                $snapNotification.error("Cannot read appointments");
                                options.error(result);
                            });
                        } else {
                            options.success({
                                total: 0,
                                data: []
                            });
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "string" }  //this definition necessary in order show kendo scheduler that we use guid as id.
                        }
                    },
                    data: function (response) {
                        var blocks = response.data.map(function (ap) {
                            ap.start = $timeUtils.dateFromSnapDateString(ap.startTime);
                            ap.end = $timeUtils.dateFromSnapDateString(ap.endTime);
                            ap.id = ap.appointmentId;
                            ap.phoneNumber = ap.where;
                            ap.phoneType = ap.whereUse;
                            //ToDo: create ticket to API team about this problem.
                            //Server has validation for providerId
                            //but we do not recive provider id!!!
                            if (ap.participants) {
                                ap.participants.forEach(function (participant) {
                                    participant.person.providerId = snap.hospitalSession.hospitalId;
                                });
                            }
                            if (ap.zonedTime) {
                                ap.timeZoneId = ap.zonedTime.timeZoneId;
                                ap.zonedStart = $timeUtils.dateFromSnapDateString(ap.zonedTime.startTime);
                                ap.zonedEnd = $timeUtils.dateFromSnapDateString(ap.zonedTime.endTime);
                            }

                            return new Appointment(ap);
                        });

                        if (scope._getCurrentScheduler().view().title.toLowerCase() === schedulerViewMode.agenda) {
                            // for agenda view mode we call a custom splitting function becouse agenda splits events incorrectly.
                            blocks = splitSeveralDayEvents(blocks);
                        }

                        return blocks;
                    }
                }
            });

            this.apptS_onDataBound = function () {
                var viewName = Singleton.getAppointmentsScheduler().view().name;

                if (viewName === schedulerViewMode.day) {
                    this._apptProcessDayViewSlots();
                } else if (viewName === schedulerViewMode.week) {
                    this._apptProcessWeekViewSlots();
                }

                this.currentTimeMarker.refreshTimeMarker();
            };

            this.apptS_onSchedulerNavigate = function (e) {
                if (e.action === "changeView") {
                    this._updateNavigationBarView(e.view);
                }

                if(e.action === "changeView" && e.view === "day") {
                    // Since we have custom view 'CustomDay' instead of default 'day' view, we need set appropriate view in scheduler.
                    // This problem happens in Month view when we want to see all events in cell and click on  "   ...   " button.
                    Singleton.getAppointmentsScheduler().view(CustomTabNames.CustomDay);
                }

                this._scrollToDayMorning(e.date);
            };

            this.apptS_add = function (e) {
                var errorMessage = checkPermissions();
                if (errorMessage !== null) {
                    $snapNotification.error(errorMessage);
                    e.preventDefault();
                    return false;
                }
                if (this.groupsVM.isAnyUserSelected()) {
                    var isAllDay = e.event.isAllDay;
                    var startDate = new Date(e.event.start);

                    var endDate;

                    if (isAllDay) {
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1);
                    } else {
                        endDate = this._getAppointmentEndDate(startDate);
                    }
                    var isDayView = (Singleton.getAppointmentsScheduler().view().name == schedulerViewMode.day);

                    this._addNewAppointment({ startDate: startDate, endDate: endDate, isAllDay: isAllDay }, isDayView ? e.event.clinicianPersonId : null);

                } else {
                    $snapNotification.info(errorMessages.noClinicianSelected);
                }

                Singleton.getAppointmentsScheduler().cancelEvent();
                e.preventDefault();
                return false;
            };

            //*************************** Private methods ****************************/

            this._addNewAvailabilityBlock = function () {
                var startDate = this._getAppointmentDefaultStartDate();
                var endDate = this._getAvailabilityEndDate(startDate);

                var newBock = new AvailabilityBlock({
                    start: startDate,
                    end: endDate,
                    clinician: {
                        clinicianId: this.groupsVM.getFirstActiveUser().id,
                        locked: false,
                        private: false
                    }
                });

                newBock.open();
            };

            this._addNewAppointment = function (cell, personId) {
                var cellData = cell || {};
                var startDate = cellData.startDate || this._getAppointmentDefaultStartDate();
                var endDate = cellData.endDate || this._getAppointmentEndDate(startDate);
                var isAllDay = cellData.isAllDay || false;

                var selectClinicianDeferred;

                if (!!personId) {
                    selectClinicianDeferred = clinicianListDS.selectByPersonId(personId);
                } else {
                    selectClinicianDeferred = clinicianListDS.selectById(this.groupsVM.getAllActiveUsers()[0].id);
                }
                selectClinicianDeferred.done(function (item) {
                    var clinicianUserId = item.id;
                    var participants = [];
                    if (item) {
                        participants.push({
                            appointmentId: null,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            person: item.data.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
                        });
                    }

                    var newBock = new Appointment({
                        start: startDate,
                        end: endDate,
                        isAllDay: isAllDay,
                        participants: participants,
                        clinicianId: clinicianUserId
                    });

                    $eventService.canAddAppointmentWithTimeInterval(clinicianUserId, newBock.start, newBock.end).done(function (result) {
                        if (result) {
                            newBock.open();
                        } else {
                            $snapNotification.info(errorMessages.cannotAddAppointmentIntoThisCell);
                        }
                    });
                });
            };
            //== Populate Appointment Scheduler with Availability Blocks
            this._getBlocksForClinician = function (clinicianId, isAllDay) {
                var blocks = this.availabilities.data().filter(function (block) {
                    if (block.clinician) {
                        return block.clinician.clinicianId === clinicianId;
                    }

                    return false;
                });

                return blocks.filter(function (block) {
                    return block.isAllDay === isAllDay;
                });
            };

            this._getRegularBlocksForClinician = function (clinicianId) {
                return this._getBlocksForClinician(clinicianId, false);
            };

            this._getAllDayBlocksForClinician = function (clinicianId) {
                return this._getBlocksForClinician(clinicianId, true);
            };

            this._apptPopulateAvailabilityBlock = function () {
                var viewName = Singleton.getAppointmentsScheduler().view().name;

                if (viewName === schedulerViewMode.day) {
                    this._apptProcessDayViewSlots();
                } else if (viewName === schedulerViewMode.week) {
                    this._apptProcessWeekViewSlots();
                }
            };

            this._apptProcessDayViewSlots = function () {
                var scheduler = Singleton.getAppointmentsScheduler(),
                    view = scheduler.view(),
                    selectedClinicians = this.selectedClinicians.data();

                var startDate = view.startDate();
                for (var i = 0; i < selectedClinicians.length; i++) {
                    var clinicianId = selectedClinicians[i].clinicianId,
                        slotsColumnIndex = i + 1;

                    var regularBlocks = this._getRegularBlocksForClinician(clinicianId);
                    var allDayBlocks = this._getAllDayBlocksForClinician(clinicianId);

                    var regularSlots = getSlots(view.table.find(".k-scheduler-content .k-scheduler-table tr td[role='gridcell']:nth-child(" + slotsColumnIndex + ")"), startDate);
                    var allDaySlots = getSlots(view.table.find(".k-scheduler-header-all-day tr td[role=gridcell]:nth-child(" + slotsColumnIndex + ")"), startDate);

                    this._apptFillSlots(regularBlocks, regularSlots);
                    this._apptFillAllDaySlots(allDayBlocks, allDaySlots);
                }
            };

            this._apptProcessWeekViewSlots = function () {
                var regularBlocks = [],
                    allDayBlocks = [];

                if (this.groupsVM.getAllActiveUsers().length > 0) {
                    var activeClinicianId = this.groupsVM.getAllActiveUsers()[0].id;

                    regularBlocks = this._getRegularBlocksForClinician(activeClinicianId);
                    allDayBlocks = this._getAllDayBlocksForClinician(activeClinicianId);
                }

                var endIndex = 7;
                var view = Singleton.getAppointmentsScheduler().view();
                var startDate = view.startDate();
                for (var i = 1; i <= endIndex; i++) {
                    var d = $timeUtils.addDays(startDate, i - 1);
                    var regularSlots = getSlots(view.table.find(".k-scheduler-content .k-scheduler-table tr td[role='gridcell']:nth-child(" + i + ")"), d);
                    var allDaySlots = getSlots(view.table.find(".k-scheduler-header-all-day tr td[role=gridcell]:nth-child(" + i + ")"), d);

                    this._apptFillSlots(regularBlocks, regularSlots);
                    this._apptFillAllDaySlots(allDayBlocks, allDaySlots);
                }
            };

            this._apptFillAllDaySlots = function (availabilities, slots) {
                var slotVMs = [];

                slots.forEach(function (slot) {
                    var currentElement = $(slot.element);
                    var slotVM = new EventSlotVM(availabilities.filter(function (item) {
                        var slotStart = new Date(slot.startDate),
                            start = new Date(item.start);

                        slotStart.setHours(0, 0, 0, 0);
                        start.setHours(0, 0, 0, 0);

                        return slotStart.getTime() === start.getTime();
                    }));

                    slotVM.isFirst = true;
                    slotVM.isLast = true;
                    slotVM.isMiddle = false;

                    slotVMs.push({
                        slotVM: slotVM,
                        gridCell: currentElement
                    });
                });

                var template = kendo.template($("#apptSlotTemplate").html());
                slotVMs.forEach(function (slot) {
                    var gridCell = slot.gridCell;

                    gridCell.html(template(slot.slotVM));
                });
            };

            this._apptFillSlots = function (availabilities, slots) {
                var slotVMs = [];

                slots.forEach(function (slot) {
                    var currentElement = $(slot.element);
                    var slotVM = new EventSlotVM(availabilities.filter(function (item) {
                        var slotStart = new Date(slot.startDate),
                            slotEnd = new Date(slot.endDate),
                            start = new Date(item.start),
                            end = new Date(item.end);

                        return (
                            ((start <= slotStart) && (end > slotStart)) ||
                            ((start >= slotStart) && (start < slotEnd)) ||
                            ((start >= slotStart) && (end < slotEnd))
                        );
                    }));

                    slotVMs.push({
                        slotVM: slotVM,
                        gridCell: currentElement
                    });
                });

                for (var i = 0; i < slotVMs.length; i++) {
                    var currentSlot = slotVMs[i].slotVM;
                    var nextSlot = slotVMs[i + 1] ? slotVMs[i + 1].slotVM : null;
                    var prevSlot = slotVMs[i - 1] ? slotVMs[i - 1].slotVM : null;

                    currentSlot.isFirst = prevSlot ? prevSlot.availabilityBlock !== currentSlot.availabilityBlock : true;
                    currentSlot.isLast = nextSlot ? nextSlot.availabilityBlock !== currentSlot.availabilityBlock : true;
                    currentSlot.isMiddle = !currentSlot.isFirst && !currentSlot.isLast;
                }

                var template = kendo.template($("#apptSlotTemplate").html());
                slotVMs.forEach(function (slot) {
                    var gridCell = slot.gridCell;

                    gridCell.html(template(slot.slotVM));
                });
            };

            this._getPassedUserId = function () {
                if (this.userType === $scheduleCommon.userType.admin) {
                    var id = sessionStorage.getItem("as_curretnAdminUserId");
                    if (id !== null && typeof (id) !== "undefined") {
                        sessionStorage.removeItem("as_curretnAdminUserId");
                        id = parseInt(id);
                        if (!isNaN(id)) {
                            return id;
                        }
                    }
                }
                return null;
            };


            //== Filters
            this._getCoverageBlocksFilters = function () {
                var interval = scope._getSchedulerViewInterval(Singleton.getCoverageScheduler());
                return {
                    type: this.coverageSchedulerLeftBarVM.getCoverageType(),
                    from: $timeUtils.dateToString(interval.startDate),
                    to: $timeUtils.dateToString(interval.endDate)
                };
            };

            this._getAvailabilityBlocksFilters = function () {
                var interval = scope._getSchedulerViewInterval(Singleton.getAvailabilitiesScheduler());

                return {
                    clinicianIds: scope.groupsVM.getAllSelectedUsers().map(function (user) {
                        return user.id;
                    }),
                    startDate: $timeUtils.dateToString(interval.startDate),
                    endDate: $timeUtils.dateToString(interval.endDate)
                };
            };

            this._getAppointmentsFilters = function () {
                var interval = scope._getSchedulerViewInterval(Singleton.getAppointmentsScheduler());

                var clinicians = [];
                var viewName = Singleton.getAppointmentsScheduler().view().name;
                if (viewName === schedulerViewMode.day) {
                    clinicians = scope.groupsVM.getAllSelectedUsers();
                } else {
                    clinicians = scope.groupsVM.getAllActiveUsers();
                }

                return {
                    clinicianIds: clinicians.map(function (user) {
                        return user.id;
                    }),
                    startDate: $timeUtils.dateToString(interval.startDate),
                    endDate: $timeUtils.dateToString(interval.endDate)
                };
            };

            this._getSchedulerViewInterval = function (scheduler) {
                var startDate = new Date(scheduler.view().startDate());
                var endDate = new Date(scheduler.view().endDate());

                //  End date always setup to  12:00:00 AM as result all events in last day will be missed. 
                //    In order to avoid this we setup end date to the next day 12:00:00 AM.*/
                endDate.setDate(endDate.getDate() + 1);

                return {
                    startDate: startDate,
                    endDate: endDate
                };
            };

            this._getAppointmentDefaultStartDate = function () {
                var startDate = new Date(this.calendarSelectedDate);
                startDate.setHours(12, 0, 0, 0);

                return startDate;
            };

            this._getAvailabilityEndDate = function (startDate) {
                return getIntervalEndDate(startDate, "defaultAvailabilityBlockDuration", 240);
            };

            this._getAppointmentEndDate = function (startDate) {
                return getIntervalEndDate(startDate, "", 15);  //will remove for duration
            };

            //== Reload
            this._reloadSchedullers = function () {
                //Reload all schedulers. 
                var that = this;

                // 1. Availabilities 
                this.abSelectedClinicians.read().done(function() {
                    var abScheduler = Singleton.getAvailabilitiesScheduler();
                    if (abScheduler && abScheduler.view().name === "day") {
                        //There is a problem with Kendo Scheduler, sometimes it not properly load resources. This explicit setDate() should solve this problem.
                        scrollToDayAndHour(that.calendarSelectedDate, 7, abScheduler);
                    }

                    that.availabilities.read();
                });


                // 2. Appointments 
                this.selectedClinicians.read().done(function(){
                    var apptScheduler = Singleton.getAppointmentsScheduler();
                    if (apptScheduler && apptScheduler.view().name === "day") {
                        //There is a problem with Kendo Scheduler, sometimes it not properly load resources. This explicit setDate() should solve this problem.
                        scrollToDayAndHour(that.calendarSelectedDate, 7, apptScheduler);
                    }

                    that.appointments.read();
                });


                // 3. Coverages
                this.coverages.read();
            };

            this._updateNavigationBarView = function (viewName) {
                var showNotActiveUsersAsDisabled = false;
                if (this.viewMode === viewMode.appointments) {
                    showNotActiveUsersAsDisabled = (viewName !== schedulerViewMode.day);
                }

                this.groupsVM.showNotActiveUsersAsDisabled(showNotActiveUsersAsDisabled);
            };

            this._getCurrentScheduler = function () {
                var currentScheduler = null;
                switch (this.viewMode) {
                    case viewMode.appointments:
                        currentScheduler = Singleton.getAppointmentsScheduler();
                        break;
                    case viewMode.coverage:
                        currentScheduler = Singleton.getCoverageScheduler();
                        break;
                    default:
                        currentScheduler = Singleton.getAvailabilitiesScheduler();
                }
                return currentScheduler;
            };

            this._scrollToHourOnDataBound= function (hour) {
                onDataBoundScroll(Singleton.getAvailabilitiesScheduler());
                onDataBoundScroll(Singleton.getAppointmentsScheduler());
                onDataBoundScroll(Singleton.getCoverageScheduler());

                function onDataBoundScroll(scheduler) {
                    scheduler.one("dataBound", function () {                    
                        scrollToHour(hour, scheduler); // Scroll to hour.   
                        
                        // If there is no data, we again subscribe on 'dataBound' event. 
                        // This necessary when page first time loaded and 'dataBound' event raise twice. When scheduler initiated and then when data received from server.
                        // There is no possibility for endless recursion, because 'scrollToHour' function cannot trigger 'dataBound' event.
                        if(scheduler.data().length === 0) {
                            onDataBoundScroll(scheduler);
                        } 
                    });
                }
            };

            this._scrollToHour = function (hour) {
                scrollToHour(hour, Singleton.getAvailabilitiesScheduler());
                scrollToHour(hour, Singleton.getAppointmentsScheduler());
                scrollToHour(hour, Singleton.getCoverageScheduler());
            };

            this._scrollToDayMorning = function (date) {
                var h = 7;
                var d = new Date(date);
                d.setHours(0, 0, 0, 0);

                this.set("calendarSelectedDate", d);
                scrollToDayAndHour(d, h, Singleton.getAvailabilitiesScheduler());
                scrollToDayAndHour(d, h, Singleton.getAppointmentsScheduler());
                scrollToDayAndHour(d, h, Singleton.getCoverageScheduler());
            };

            this._scrollToEvent = function (scheduler, event) {
                var sHour = event.start.getHours();
                var interval = this._getSchedulerViewInterval(scheduler);

                var d = new Date(event.start);
                d.setHours(0, 0, 0, 0);
                if (event.start < interval.startDate || event.start > interval.endDate) {
                    //this is a hack in order to find proper time window.
                    var h = 7;
                    scrollToHour(h, scheduler);
                    if (!isHourIntoView(sHour, scheduler)) {
                        h = sHour;
                    }

                    this.set("calendarSelectedDate", d);
                    scrollToDayAndHour(d, h, Singleton.getAvailabilitiesScheduler());
                    scrollToDayAndHour(d, h, Singleton.getAppointmentsScheduler());
                    scrollToDayAndHour(d, h, Singleton.getCoverageScheduler());
                } else if (!isHourIntoView(sHour, scheduler)) {
                    scrollToHour(sHour, Singleton.getAvailabilitiesScheduler());
                    scrollToHour(sHour, Singleton.getAppointmentsScheduler());
                    scrollToHour(sHour, Singleton.getCoverageScheduler());
                }
            };

            function ScheduleEvent(opt) {
                this.opt = opt;

                this.opt.forceReadOnly = checkPermissions() !== null;

                this.id = opt.id;
                this.start = new Date(opt.start);
                this.end =  new Date(opt.end);

                // If event length is equal to 24 hours we decrease the time by one minute.
                // This necessary because othervise event will go to "All day" section which is not visible now, so as result event will be invisible.
                if((this.end.getTime() - this.start.getTime()) === 86400000) {
                    window.console.warn("Event duration adjustment: " + opt);
                    this.end.setMinutes(this.end.getMinutes() - 1);
                };

                this.isAllDay = false;
                this.title = ""; //Dummy field, necessary for Agenda View.

                this.isPastBlock = this.end < scope.currentTimeMarker.currentUserTime;

                this.validateIfEditAvailable = function () {
                    if (this._validateIfEditAvailable) {
                        return this._validateIfEditAvailable();
                    }

                    //in case if there is no _validateIfEditAvailable (Appointments)
                    return null;
                };

                this.validateIfDragAndDropAvailable = function () {
                    var err = this.validateIfEditAvailable();
                    if (!err) {
                        if (this._validateIfDragAndDropAvailable) {
                            return this._validateIfDragAndDropAvailable();
                        }
                        return null;
                    } else {
                        return err;
                    }
                };



            }

            function AvailabilityBlock(eOpt) {

                //****************** Call BASE constructor ********************
                ScheduleEvent.call(this, eOpt);

                this._type = $scheduleCommon.eventType.availabilityBlock;

                this.allowOnDemandAppt = eOpt.allowOnDemandAppt;
                this.allowSelfAppt = eOpt.allowSelfAppt;
                this.allowProviderAppt = eOpt.allowProviderAppt;
                this.isAvailable = eOpt.isAvailable;
                this.rule = eOpt.rule;
                this.clinician = eOpt.clinician;

                this.isLocked = false; //Admin owned
                this.isPrivate = false; //Clinician owned
                if (eOpt.clinician) {
                    this.isLocked = eOpt.clinician.locked;
                    this.isPrivate = eOpt.clinician.private;
                }

                this.clinicianId = this.clinician.clinicianId;  //this field necessary in order to sync Day view with Scheduler resources.

                //*********************** PUBLIC API ***********************/
                this.open = function () {
                    var that = this;
                    getEventContext(this.opt).done(function (isRuleAvailable) {
                        var displayOpt = {
                            type: $scheduleCommon.eventType.availabilityBlock,
                            forceReadOnly: that.opt.forceReadOnly // ToDo: refactor this.
                        };

                        $eventDialog.open(that.opt, displayOpt).done(function (event) {
                            var dialog = event;
                            dialog.set("isRuleAvailable", isRuleAvailable);
                            if (dialog._isAffectSeries()) {
                                setTimeout(function () {
                                    dialog._showFrequencyDetails(true);
                                }, 1000);
                            }
                            dialog.load(
                                scope.groupsVM.getAllSelectedUsers().map(function (user) {
                                    return user.id;
                                }),
                                scope.userType
                            );
                        });
                    });
                };

                this.save = function (start, end) {
                    var dfd = $.Deferred();
                    var that = this;
                    getEventContext(this.opt).done(function (isRuleAvailable) {
                        var opt = $.extend(true, {}, that.opt);

                        //set new event date.
                        opt.start = start;
                        opt.end = end;

                        if (!isRuleAvailable) {
                            opt.rule = null;
                        }

                        //If we have rule object it means that we are modifying the series of events.
                        if (opt.rule) {
                            var fromDate = new Date(start);
                            fromDate.setHours(0, 0, 0, 0);
                            fromDate = $timeUtils.dateToString(fromDate);
                            opt.rule.fromDate = fromDate;
                        }

                        // $eventService.validateAvailabilityBlock(opt).done(function(errors) {
                        //     if(errors.length === 0) {
                        //         $eventService.saveAvailabilityBlock(opt).done(function () {
                        //             dfd.resolve();
                        //         }).fail(function (error) {
                        //             dfd.reject(error);
                        //         });
                        //     } else {
                        //         dfd.reject(errors);
                        //     }
                        // }).fail(function(error) {
                        //     dfd.reject(error);
                        // });


                        $eventService.saveAvailabilityBlock(opt, opt.abRequestTime).done(function () {
                            dfd.resolve();
                        }).fail(function (error) {
                            dfd.reject(error);
                        });

                    });

                    return dfd.promise();
                };


                //*********************** MVVM BINDINGS ***********************/
                this.vm_isEventSeriesInProgress = function () {
                    return this._checkIfEventSeriesInProgress() !== null;
                };


                //*********************** PRIVATE METHODS ***********************/
                this._validateIfEditAvailable = function () {
                    var errorMessages = [
                        this._checkIfEventSeriesInProgress(),
                        this._checkIfIsProtectedBlock(),
                    ].filter(function (error) {
                        return error !== null;
                    });

                    return errorMessages.length > 0 ? errorMessages[0] : null;
                };
                this._validateIfDragAndDropAvailable = function () {
                    return "";
                }

                function getEventContext(opt) {
                    var dfd = $.Deferred();

                    if (opt.rule) {
                        $snapNotification.hideAllConfirmations();
                        $snapNotification.confirmationWithThreeBtns("Do you want to edit only this block occurrence or the whole series?", function () {
                            dfd.resolve(false);
                        }, function () {
                            dfd.resolve(true);
                        }, "Current block", "The series");
                    } else {
                        dfd.resolve(true);
                    }

                    return dfd.promise();
                }

                this._checkIfIsProtectedBlock = function () {
                    var msg = null;

                    switch (scope.userType) {
                        case $scheduleCommon.userType.admin:
                            if (this.isPrivate) {
                                msg = errorMessages.blockIsPrivate;
                            }
                            break;
                        case $scheduleCommon.userType.clinician:
                            if (this.isLocked) {
                                msg = errorMessages.blockIsLocked;
                            }
                            break;
                    }

                    return msg;
                };

                this._checkIfEventSeriesInProgress = function () {
                    if (this.rule && this.rule.serviceLockDate) {
                        return "Availability blocks series in progress.";
                    }

                    return null;
                };
            }

            function Appointment(eOpt) {

                //****************** Call BASE constructor ********************

                ScheduleEvent.call(this, eOpt);

                this._type = $scheduleCommon.eventType.appointment;

                //ToDo: Clarify do we need this feature or not.
                this.isAdmin = eOpt.appointmentTypeCode === $scheduleCommon.appointmentTypeCode.clinicianScheduled;
                this.isOnDemand = eOpt.appointmentTypeCode === $scheduleCommon.appointmentTypeCode.onDemand;
                this.isSelf = eOpt.appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled;

                var patient = $scheduleCommon.findPatient(eOpt.participants);
                this.extractPatientName = $scheduleCommon.getFullName(patient ? patient.person : null);
                this.extractPatientPhone = $scheduleCommon.getPhoneNumber(patient ? patient.person : null);
                this.isPastBlock = this.isPastBlock || $scheduleCommon.isAppointmentReadOnly(eOpt.appointmentStatusCode);
                var clinician = $scheduleCommon.findProvider(eOpt.participants);
                if (clinician) {
                    this.clinicianPersonId = clinician.person.id;  //this field necessary in order to sync Day view with Scheduler resources.
                }

                /*********************** PUBLIC API ***********************/
                this.open = function () {
                    var that = this;
                    $availabilityBlockService.getUserCurrentTime().done(function (result) {

                        var displayOpt = {
                            type: $scheduleCommon.eventType.appointment,
                        };

                        if(that.id) {
                            var currentUserTimeWithBuffer = $timeUtils.dateFromSnapDateString(result.data[0]);
                            currentUserTimeWithBuffer.setMinutes(currentUserTimeWithBuffer.getMinutes() - 30);

                            displayOpt.forceReadOnly = that.opt.forceReadOnly || that.start < currentUserTimeWithBuffer;
                            that.opt.isReschedulable = displayOpt.forceReadOnly && scope.userType != $scheduleCommon.userType.patient && !$scheduleCommon.isAppointmentFulfilled(that.opt.appointmentStatusCode) && !$scheduleCommon.isAppointmentInWaiting(that.opt.appointmentStatusCode);
                        }

                        if (that.opt.isReschedulable) {
                            $eventAggregator.updateSubscription("appt_onReschedule", function() {
                                $eventDialog.rescheduleAppointment(that.opt, scope.userType);
                            });
                        }

                        $eventDialog.open(that.opt, displayOpt).done(function (event) {
                            var dialog = event;
                            dialog.load(
                                scope.groupsVM.getAllSelectedUsers().map(function (user) {
                                    return user.id;
                                }),
                                scope.userType
                            );
                        });
                    });
                };

                this.save = function (start, end) {
                    var opt = $.extend(true, {}, this.opt);

                    //set new event date.
                    opt.start = start;
                    opt.end = end;


                    //var dfd = $.Deferred(); 
                    // $eventService.validateAppointment(opt).done(function(errors) {
                    //     if(errors.length === 0) {
                    //         $eventService.saveAppointment(opt).done(function () {
                    //             dfd.resolve();
                    //         }).fail(function (error) {
                    //             dfd.reject(error);
                    //         });
                    //     } else {
                    //         dfd.reject(errors);
                    //     }
                    // }).fail(function(error) {
                    //     dfd.reject(error);
                    // });
                    // return dfd.promise();

                    return $eventService.saveAppointment(opt);
                };

                /*********************** PRIVATE METHODS ***********************/
                this._validateIfEditAvailable = function () {
                    return "";
                };

                this._validateIfDragAndDropAvailable = function () {
                    if (this.isPastBlock) {
                        return errorMessages.blockIsPast;
                    }
                }
            }

            var idIncrement = 1;
            function CoverageBlock(eOpt) {
                var coverageToBlockMapping = {
                    onDemand: { field: "allowOnDemandAppt", value: true },
                    patientScheduled: { field: "allowSelfAppt", value: true },
                    adminScheduled: { field: "allowProviderAppt", value: true },
                    unavailable: { field: "isAvailable", value: false }
                };

                this.id = idIncrement++;
                this.start = eOpt.start;
                this.end = eOpt.end;
                this.isAllDay = false;
                this.isPastBlock = this.end < scope.currentTimeMarker.currentUserTime;

                this.title = ""; //Dummy field, necessary for Agenda View.

                this.clinicianCount = eOpt.clinicians.length;

                this.type = eOpt.type;

                this.isSelected = false;

                this.clinicians = eOpt.clinicians;

                this.open = function () {
                    var opt = {
                        start: this.start,
                        end: this.end
                    };

                    if(this.type && coverageToBlockMapping[this.type]) {
                        var map = coverageToBlockMapping[this.type];
                        opt[map.field] = map.value;
                    }

                    var displayOpt = {
                        type: $scheduleCommon.eventType.availabilityBlock
                    };

                    $eventDialog.open(opt, displayOpt).done(function (event) {
                        var dialog = event;
                        dialog.set("isRuleAvailable", false);
                        dialog.load([], scope.userType
                        );
                    });
                };

                this.vm_OnCoverageEventClick = function () {
                    that.coverageSchedulerLeftBarVM.selectBlockById(this.id);
                    if (this.vm_nonCoverage() && !this.isPastBlock) {
                        this.open();
                    }
                };
                this.vm_nonCoverage = function () {
                    return this.clinicianCount === 0;
                };

                this.vm_badCoverage = function () {
                    return this.clinicianCount > 0 && this.clinicianCount < snap.hospitalSettings.cbMinClinicansGood;
                };

                this.vm_goodCoverage = function () {
                    return this.clinicianCount >= snap.hospitalSettings.cbMinClinicansGood;
                };
            }
        }).singleton();
}(jQuery, snap, kendo, window, window.isMobile));
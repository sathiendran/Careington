//@ sourceURL=adminScheduleEventFactory.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.schedule").use(["snap.admin.schedule.TimeUtils"])
        .define("Repeater", function ($timeUtils) {
            var events = {
                onRepeaterChange: "onRepeaterChange",
                onRepeaterClose: "onRepeaterClose",
                onDateChange: "onDateChange"
            };

            var repeatPeriodEnum = {
                daily: 0,
                weekly: 1
            };

            var emptyRepeatRule = {
                id: null,
                modifiedDate: null,
                repeatPeriod: repeatPeriodEnum.weekly,
                repeatInterval: 1,
                toDate: null,
                repeatOn: [],

            };

            function wrapDaysOfWeekToObservableObjects(selectedDays) {
                if (typeof (selectedDays) === "undefined" || selectedDays === null) {
                    selectedDays = [];
                }

                var arr = [];
                ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(function (day) {
                    var dayNumber = arr.length + 1;
                    var isOn = (selectedDays.indexOf(dayNumber) !== -1);

                    arr.push(new kendo.data.ObservableObject({
                        day: day,
                        dayNumber: dayNumber,
                        shortName: day.charAt(0),
                        isOn: isOn,
                        triggerDay: function () {
                            this.set("isOn", !this.isOn);
                        }
                    }));
                });

                return arr;
            }

            function Repeater(repeatRule) {
                var scope = this;
                var eventList = {};
                var triggerEvent = function (name) {
                    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                    var eventCbList = eventList[name];
                    if (eventCbList) {
                        $.each(eventCbList, function () {
                            return this.apply(scope, args);
                        });
                    }
                };

                this.repeatPeriodsDS = new kendo.data.DataSource({
                    data: [{
                        text: "Weekly",
                        value: repeatPeriodEnum.weekly
                    }, {
                        text: "Daily",
                        value: repeatPeriodEnum.daily
                    }]
                });

                this.id = repeatRule.id;
                this.modifiedDate = repeatRule.modifiedDate;

                this.repeatPeriod = repeatRule.repeatPeriod;
                this.repeatInterval = repeatRule.repeatInterval;
                this.toDate = repeatRule.toDate ? new Date(repeatRule.toDate) : null;

                this.daysOfWeek = wrapDaysOfWeekToObservableObjects(repeatRule.repeatOn);

                this.shortFrequencyPeriodInfo = "";

                //*********************** PUBLIC API ***********************/
                this.getRepeatRule = function (blockStartTime, blockEndTime, defaultPeriodInMonths) {
                    // Note. Currently in UI we do not have options for specify repeater end time component (only date component)
                    // But API and repeater service use time component, so we have to add missed hours in code for proper API work.
                    // If we do not do this, and ignore time component, we can miss last block in series.

                    var repeatFromDate = new Date(blockStartTime); // In order to include first block in series we take date and time from blockStartTime.
                    var repeatToDate = new Date(blockEndTime);     // In order to include last block in series we take date and time from blockEndTime.

                    if (this.toDate === null) {
                        
                        // If user do not provided directly repeat rule end date we use default logic.
                        // We use block end date, and add default period (6 month if another value not provided)
                        var m = (typeof (defaultPeriodInMonths) === "undefined") ? 6 : defaultPeriodInMonths;

                        repeatToDate.setMonth(repeatToDate.getMonth() + m);
                    } else {

                        // If user provided repeat rule end date we use it.
                        var repeaterEndDate = new Date(this.toDate);
                        repeaterEndDate.setHours(0, 0, 0, 0);

                        var firstBlockEndDate = new Date(blockEndTime);
                        firstBlockEndDate.setHours(0, 0, 0, 0);

                        // Note. 
                        // If firstBlockEndDate = repeaterEndDate we do not need to do anything.
                        // Block end time will be used as repeater end date.
                        // 
                        // If repeaterEndDate > firstBlockEndDate we add time component (from blockEndTime) to repeater, otherwise last block in series could be missed.
                        // Example:
                        // first block start time:  01/01/2000 11:00
                        // first block end time:    01/02/2000 15:00 
                        // repeater end date:       01/30/2000
                        // As result we set repeater end time to 01/30/2000 15:00
                        //
                        // If repeaterEndDate < firstBlockEndDate 
                        // This is invalid business case, we keep repeatToDate without any changes because no block will be created at all.
                        // Example:
                        // first block start time:  01/20/2000 10:00
                        // first block end time:    01/20/2000 12:00 
                        // repeater end date:       01/10/2000
                        // As result we set repeater end time to 01/10/2000 00:00

                        if(repeaterEndDate > firstBlockEndDate) {
                            var timeDiff = repeaterEndDate.getTime() - firstBlockEndDate.getTime();
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

                            repeatToDate.setDate(repeatToDate.getDate() + diffDays);
                        } else if(repeaterEndDate < firstBlockEndDate) {
                            repeatToDate = repeaterEndDate;
                        }
                    }

                    var rule = {
                        id: this.id,
                        fromDate: $timeUtils.dateToString(repeatFromDate),
                        toDate: $timeUtils.dateToString(repeatToDate),
                        repeatInterval: this.repeatInterval,
                        repeatOn: this._getSelectedDaysNumbers(),
                        repeatPeriod: this.repeatPeriod,
                        modifiedDate: this.modifiedDate,

                        getFromDate: function () {
                            return repeatFromDate;
                        },

                        getToDate: function () {
                            return repeatToDate;
                        }
                    };

                    return rule;
                };

                this.getFrequencyPeriodInfo = function () {
                    var text = "";
                    var shortText = "";
                    switch (this.repeatPeriod) {
                        case repeatPeriodEnum.weekly:
                            if (this.repeatInterval === 1) {
                                shortText = "Week";
                                text = "Every week";
                            } else {
                                shortText = "Weeks";
                                text = "Every " + this.repeatInterval + " weeks";
                            }

                            var selectedDays = this._getSelectedDays().map(function (day) {
                                return day.day;
                            });

                            if (selectedDays.length > 0) {
                                text += " on " + selectedDays.join(", ");
                            }

                            break;
                        case repeatPeriodEnum.daily:
                            if (this.repeatInterval === 1) {
                                shortText = "Day";
                                text = "Every day";
                            } else {
                                shortText = "Days";
                                text = "Every " + this.repeatInterval + " days";
                            }
                            break;
                    }

                    this.set("shortFrequencyPeriodInfo", shortText);

                    return text;
                };

                //We need event subscription because we can not not use Kendo Observable in constructor. 
                //And use var scope = this; scope.set("...", ...)
                this.on = function (eventName, cb) {
                    var eventCbList = eventList[eventName];
                    if (!eventCbList) {
                        eventCbList = [];
                    }
                    eventCbList.push(cb);
                    eventList[eventName] = eventCbList;
                };

                //*********************** MVVM BINDINGS ***********************/
                this.vm_onCloseClick = function (e) {
                    e.preventDefault();
                    triggerEvent(events.onRepeaterClose);
                };

                this.vm_isDayWeekSelectorVisible = function () {
                    return this.repeatPeriod === repeatPeriodEnum.weekly;
                };

                this.vm_isDaySelected = function () {
                    return !this.vm_isDayWeekSelectorVisible();
                };

                this.vm_onDayWeekSelectorClick = function () {
                    triggerEvent(events.onRepeaterChange);
                };


                this.vm_onRepeatPeriodChange = function () {
                    this.trigger("change", {
                        field: "vm_isDayWeekSelectorVisible"
                    });

                    this.trigger("change", {
                        field: "vm_isDaySelected"
                    });

                    triggerEvent(events.onRepeaterChange);
                };

                this.vm_onRepeatIntervalSpin = function (e) {
                    this.set("repeatInterval", e.sender.value());
                    triggerEvent(events.onRepeaterChange);
                };

                this.vm_onRepeatIntervalChange = function () {
                    triggerEvent(events.onRepeaterChange);

                    if (this.vm_repeatIntervalError) {
                        this.set("vm_repeatIntervalError", false);
                    }

                };

                this.vm_repeatIntervalError = false;

                this.vm_onToDateChange = function () {
                    triggerEvent(events.onDateChange);
                };


                //*********************** PRIVATE METHODS ***********************/
                this._getSelectedDays = function () {
                    return this.daysOfWeek.filter(function (day) {
                        return day.isOn;
                    });
                };

                this._getSelectedDaysNumbers = function () {
                    var selectedDays = [];

                    if (this.repeatPeriod === repeatPeriodEnum.weekly) {
                        selectedDays = this._getSelectedDays().map(function (day) {
                            return day.dayNumber;
                        });
                    }

                    return selectedDays;
                };
            }

            this.createRepeater = function (repeatRule) {
                var rule = $.extend(true, {}, emptyRepeatRule, repeatRule);

                return kendo.observable(new Repeater(rule));
            };
        }).singleton();
    snap.namespace("snap.admin")
        .use(["snap.common.ItemSelector"])
        .define("ItemSelector", function ($itemSelector) {
            return $.extend({}, $itemSelector, {
                selector: function (opt) {
                    return $itemSelector.emptySelector(opt);
                },

                patientsSelector: function (opt) {
                    return $itemSelector.patientsSelector(opt);
                },

                emptySelector: function (opt) {
                    return $itemSelector.emptySelector(opt);
                },

                cliniciansSelector: function (opt) {
                    return $itemSelector.cliniciansSelector(opt);
                }
            });
        });
    snap.namespace("snap.admin").use([
        "snapNotification",
        "snap.service.availabilityBlockService",
        "snap.service.serviceTypesService",
        "snap.admin.ItemSelector",
        "snap.admin.schedule.Repeater",
        "snap.EventAggregator",
        "snap.common.schedule.ScheduleCommon",
        "snap.common.multiselectControl",
        "snap.admin.schedule.eventService",
        "snap.admin.schedule.TimeUtils"]).define("AvailabilityBlockFactory", function ($snapNotification, $availabilityBlockService, $serviceTypesService, $itemSelector,
            $repeater, $eventAggregator, $scheduleCommon, $multiselectControl, $eventService, $timeUtils) {
            var repeaterEvents = {
                onRepeaterChange: "onRepeaterChange",
                onRepeaterClose: "onRepeaterClose",
                onDateChange: "onDateChange"
            };

            var events = {
                serviceTypesLoaded: "serviceTypesSource_loaded",
                serviceTypeChanged: "serviceType_changed"
            };

            var phoneTypeEnum = {
                home: 0,
                mobile: 1,
                other: 3
            };

            var repeatPeriodEnum = {
                daily: 0,
                weekly: 1
            };

            var messages = {
                endDateAfterStart: "End date must be after the start date.",
                emptyStartDate: "Start date is required.",
                emptyEndDate: "End date is required."
            };

            var encounterTypeCodes = snap.enums.EncounterTypeCode;

            var start = new Date();
            start.setHours(12, 0, 0, 0);

            var end = new Date();
            end.setHours(12, 15, 0, 0);

            var emptyAvailabilityBlock = {
                id: 0,
                start: start,
                end: end,
                onDemandEnabled: snap.hospitalSettings.onDemand,
                onDemandEnabledOrRO: snap.hospitalSettings.onDemand,
                allowOnDemandAppt: false,
                allowSelfAppt: false,
                allowProviderAppt: false,
                isAvailable: true,
                isAllDay: false,
                optimizationTypeCodeId: 1,
                availabilityBlockRuleId: null,
                clinician: null,
                rule: null,
            };

            var emptyAppointment = {
                id: 0,
                start: start,
                end: end,
                isAllDay: false,
                waiveFee: false
            };

            var emptyEncounterDocument = {
                id: 0,
                start: start,
                end: end
            };

            var defaultDisplayOptions = {
                forceReadOnly: false
            };

            var serviceTypes, timeZones;

            var getServiceTypesDataSource = function (isReadonly, selectedService) {
                return new kendo.data.DataSource({

                    transport: {
                        read: function (options) {
                            if (isReadonly) {
                                options.success([selectedService]);
                            } else {
                                var serviceTypesPromise = typeof (serviceTypes) === "undefined" ? $serviceTypesService.get(snap.hospitalSession.hospitalId) : 
                                    $.Deferred().resolve(serviceTypes);
                                serviceTypesPromise.then(function(response) {
                                    serviceTypes = response;
                                    response = response.filter(function (item) {
                                        return item.appointmentType === $scheduleCommon.appointmentTypeCode.clinicianScheduled || 
                                            item.serviceTypeId === selectedService.serviceTypeId;
                                    });
                                    options.success(response);
                                }, function(error) {
                                    $snapNotification.error("Failed to load service types");
                                    options.error(error);
                                });
                            }
                        }
                    }
                });
            };

            var timeZoneDataSource = new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: function(options) {
                            //var filter = options.data.filter ? options.data.filter.filters[0].value : "";
                            getTimeZones().done(function(data) {
                                options.success(data);
                            });
                        }
                    }
                });

            var loadTimeZones = function() {
                var dfd = $.Deferred();
                $availabilityBlockService.getTimeZones().then(function(response) {
                    var data = response.data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.abbreviation,
                            name: item.name
                        };
                    });
                    data = data.sort(function (a, b) {
                        if (a.text < b.text) {
                            return -1;
                        }
                        return 1;
                    });
                    timeZones = data;
                    dfd.resolve(data);
                }, function() {
                    $snapNotification.error("Failed to load timezones");
                    dfd.resolve([]);
                });
                return dfd.promise();
            };

            var getTimeZones = function(nameFilter) {
                var dfd = $.Deferred(); 
                //var filter = nameFilter.toLowerCase();
                var timeZonesPromise = typeof (timeZones) === "undefined" ? loadTimeZones() : $.Deferred().resolve(timeZones);
                timeZonesPromise.done(function(timeZonesResponse) {
                    /*var data = timeZonesResponse.filter(function (item, index) {
                        if ($.trim(filter) === "") {
                            return true;
                        }
                        if (!item.text.toLowerCase().includes(filter)) {
                            if (!item.name.toLowerCase().includes(filter)) {
                                return false;
                            }
                        }
                        var firstIndex = 0;
                        timeZonesResponse.find(function (innerItem, innerIndex) {
                            if (innerItem.text == item.text) {
                                firstIndex = innerIndex;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        return item.text && firstIndex == index;
                    });
                    dfd.resolve(data);*/
                    dfd.resolve(timeZonesResponse);
                });
                return dfd.promise();
            };

            $eventService.setScope($scheduleCommon.blockPermissions.allowProviderAppt);

            function SchedulerDialog(opt) {
                this.isRuleAvailable = true;

                this.id = opt.id;
                this.start = opt.start;
                this.vm_startDateError = false;
                this.end = opt.end;
                this.vm_endDateError = false;
                this._onFocusEvent = "dialog_onFocus";

                // this properties contain start and end time in user's default timezone.
                this.startInCurrentUserTimezone = opt.startInCurrentUserTimezone || new Date(opt.start);
                this.endInCurrentUserTimezone = opt.endInCurrentUserTimezone || new Date(opt.end);

                // This two fields necessary in order to track end time changes. Ticket #6020
                // We need this fields because kendo datepicker do not provide information ("old date" and "new date" ) on date change event, so you cannot calculate time difference.
                var copyOfStartDate = new Date(opt.start);
                var copyOfEndDate = new Date(opt.end);

                // This two fields necessary in order ot track previous value when you change "All Day" checkbox.
                var isAllDayTriggerStartDate = null;
                var isAllDayTriggerEndDate = null;

                this.isAllDay = false;
                this.repeater = $repeater.createRepeater(opt.rule);
                this.frequencyPeriodInfo = this.repeater.getFrequencyPeriodInfo();

                this.isRepeat = opt.rule ? true : false; //Indicate whether this is a single event or it happens frequently.

                this.isLoading = false;
                this.isError = false;
                this.isDisabled = false;
                this.showFrequencyDetails = false;
                this.timeZoneId = snap.profileSession.timeZoneId; // for now display appointment in current user's timezone
                this.selectedTimeZone = null;

                if (this._setOptionsForConcreteEventType) {
                    this._setOptionsForConcreteEventType(opt);
                }
                this.vm_userTrayHeaderText = function () {
                    return "Who is this availability for?";
                };
                this.vm_isNotError = function () {
                    return !this.isError;
                };
                this.vm_isLoading = false;

                this.getOptions = function () {
                    var opt = {
                        id: this.id,
                        start: new Date(this.start),
                        end: new Date(this.end),
                        isAllDay: this.isAllDay
                    };

                    if (this._getOptionsForConcreteEventType) {
                        opt = $.extend(true, opt, this._getOptionsForConcreteEventType());
                    }

                    return opt;
                };

                this.vm_dayWeekSelectorError = false;

                //*********************** PUBLIC API ***********************/
                this.load = function (clinicianIds, userType) {
                    var that = this;
                    var dfd = $.Deferred();

                    this.set("vm_isLoading", true);
                    this.set("userType", userType);
                    if (this.isRuleAvailable) {
                        if (this.repeater.id) {
                            this.set("isRepeat", true);
                        } else {
                            this.set("isRepeat", false);
                        }
                    } else {
                        this.set("isRepeat", false);
                    }

                    //we need to keep this here because kendo observable create new object not extend current one.
                    this.repeater.on(repeaterEvents.onRepeaterChange, function () {
                        that.set("frequencyPeriodInfo", that.repeater.getFrequencyPeriodInfo());

                        that.set("vm_dayWeekSelectorError", false);
                        that.set("vm_repeatPeriodError", false);
                    });

                    this.repeater.on(repeaterEvents.onRepeaterClose, function () {
                        that._showFrequencyDetails(false);
                    });

                    this.repeater.on(repeaterEvents.onDateChange, function () {
                        that.set("vm_toDateError", false);
                    });

                    if (this._loadDetails) {
                        this._loadDetails(userType).done(function () {
                            subscribe(that);
                            // 1 second timeout to prevent css issues
                            // so that all styles will apply
                            setTimeout(function() {
                                that.set("vm_isLoading", false);
                                $eventAggregator.published(that._onFocusEvent);
                            }, 1000);
                            
                            dfd.resolve();
                        });
                    } else {
                        subscribe(this);
                        dfd.resolve();
                    }

                    function subscribe(that) {
                        if (!($eventAggregator.hasSubscriptions("itemSelector_onProfileClick"))) {
                            $eventAggregator.subscriber("itemSelector_onProfileClick", function (profile) {
                                $snapNotification.confirmationWithCallbacks("Viewing this profile will exit the scheduler. Do you want to proceed?", function () {
                                    if (that.userType === $scheduleCommon.userType.admin) {
                                        if (profile.personType === $itemSelector.personType.patient) {
                                            goToPatietProfile("/Admin/Patient", profile);
                                        } else if (profile.personType === $itemSelector.personType.clinician) {
                                            snap.StaffUserID = profile.id;
                                            sessionStorage.setItem('snap_staffViewEditProfile', snap.StaffUserID);
                                            location.href = "/Admin/StaffAccount";
                                        }
                                    } else if (that.userType === $scheduleCommon.userType.clinician) {
                                        if (profile.personType === $itemSelector.personType.patient) {
                                            goToPatietProfile("/Physician/PatientFile", profile);
                                        } else {
                                            if (snap.hasAnyPermission(snap.security.edit_staff_accounts, snap.security.edit_public_facing_profile_details_self)) {
                                                location.href = "/Physician/EditPhysicianProfile";
                                            }
                                            else {
                                                $snapNotification.info("You don't have permission to edit your profile.");
                                            }
                                        }
                                    }
                                });

                                function goToPatietProfile(url, profile) {
                                    sessionStorage.setItem("snap_patientId_ref", profile.id);
                                    snap.submitForm({
                                        url: url,
                                        method: "POST"
                                    }, {
                                        patientId: profile.id,
                                        token: snap.userSession.token
                                    });
                                }
                            });
                        }
                    }

                    return dfd.promise();
                };

                this.save = function () {
                    return this.saveAll(); //saveAll - Implemented in concrete dialogs Appointment/AvailabilityBlock.
                };

                this.remove = function () {
                    //If necessary here we can implement some general logic like in save method.

                    return this.removeAll(); //removeAll - Implemented in concrete dialogs Appointment/AvailabilityBlock.
                };

                //ToDo: we need to keep here only UI specific validation. Common validation should go to eventService.js
                this.validate = function () {
                    var errorList = [];

                    if (this.start === null) {
                        errorList.push(messages.emptyStartDate);
                        this.set("vm_startDateError", true);
                        this.set("vm_isSelectedStartDate", false);
                    }

                    if (this.end === null) {
                        errorList.push(messages.emptyEndDate);
                        this.set("vm_endDateError", true);
                        this.set("vm_isSelectedEndDate", false);
                    }

                    if (this.end <= this.start) {
                        errorList.push(messages.endDateAfterStart);
                        this.set("vm_endDateError", true);
                        this.set("vm_isSelectedEndDate", false);
                    }

                    if (this.isRepeat) {
                        var repeatRule = this.repeater.getRepeatRule(this.startInCurrentUserTimezone, this.endInCurrentUserTimezone);

                        if ($("#dialogbox__end-repeat").val().trim() !== "" && this.repeater.toDate === null) {
                            errorList.push("Invalid End Repeat date format");
                            this.set("vm_toDateError", true);
                        }

                        if (repeatRule.repeatPeriod !== repeatPeriodEnum.weekly && repeatRule.repeatPeriod !== repeatPeriodEnum.daily) {
                            errorList.push("Invalid repeat period.");
                            this.set("vm_repeatPeriodError", true);
                        }

                        if (repeatRule.repeatInterval <= 0) {
                            errorList.push("Repeat interval must be 1 or more.");
                            this.set("vm_repeatIntervalError", true);
                        }

                        if (repeatRule.repeatPeriod === repeatPeriodEnum.weekly && repeatRule.repeatOn.length === 0) {
                            errorList.push("Select at least one day to repeat.");
                            this.set("vm_dayWeekSelectorError", true);
                        }

                        var fromDate = $timeUtils.dateFromSnapDateString(repeatRule.fromDate);
                        var toDate = $timeUtils.dateFromSnapDateString(repeatRule.toDate);

                        if(this.end !== null && this.end > toDate) {
                            errorList.push("Repeat end date should be after the first block end date.");
                            this.set("vm_toDateError", true);
                        } else if (toDate <= fromDate) {
                            errorList.push("Repeat end date should be after the start date.");
                            this.set("vm_toDateError", true);
                        }
                    }

                    return errorList.concat(this._validateDetails()); //validate details implemented in concrete dialogs Appointment/AvailabilityBlock.
                };

                this.validateRepeatRule = function () {
                    var notifications = [];
                    var repeatRule = this.repeater.getRepeatRule(this.startInCurrentUserTimezone, this.endInCurrentUserTimezone);
                    var duration = this.endInCurrentUserTimezone - this.startInCurrentUserTimezone;
                    if (repeatRule.repeatPeriod === repeatPeriodEnum.weekly) {
                        var eventsCount = 0,
                            day = new Date(this.endInCurrentUserTimezone),
                            intervalCounter = repeatRule.repeatInterval,
                            repeatDaysOfWeek = repeatRule.repeatOn,
                            expectedEventsCount = repeatDaysOfWeek.length;

                        while (day <= repeatRule.getToDate()) {
                            var eventStart = new Date(day.getTime() - duration);
                            if (repeatDaysOfWeek.indexOf(eventStart.getDay() + 1) >= 0 && intervalCounter % repeatRule.repeatInterval === 0) {
                                eventsCount++;
                            }
                            day = $timeUtils.addDays(day, 1);
                            if (day.getDay() === 0) { //getDay() method returns the day of the week (from 0 to 6). Sunday is 0
                                intervalCounter++;
                            }
                        }

                        if (eventsCount < expectedEventsCount) {
                            notifications.push("Please note: Repeat days outside the specified time range have been ignored.");
                        }
                    }
                    return notifications;
                };

                this.validateTime = function () {
                    var errorList = [];
                    var dfd = $.Deferred();
                    var that = this;
                    $availabilityBlockService.getUserCurrentTime().done(function (response) {
                        var currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);

                        errorList = that._validateTimeDetails(currentUserTime);

                        var opt = that.getOptions();
                        if (errorList.length === 0 && (opt.end.getTime() - opt.start.getTime()) > 86400000) {
                            errorList.push("Block duration should be less than 24 hours.");
                            that.set("vm_endDateError", true);
                            that.set("vm_isSelectedEndDate", false);
                        }

                        dfd.resolve(errorList);
                    });
                    return dfd.promise();
                };


                //*********************** MVVM BINDINGS ***********************/

                this.vm_isPatientSelectError = false;

                this.vm_isProviderSelectError = false;

                this.vm_serviceTypeError = false;

                this.vm_repeatPeriodError = false;

                this.vm_timeZoneError = false;

                this.vm_disableSelectError = function (personType) {
                    if (this.vm_isPatientSelectError || this.vm_isProviderSelectError) {
                        if (personType == $itemSelector.personType.patient) {
                            this.set("vm_isPatientSelectError", false);
                        } else {
                            this.set("vm_isProviderSelectError", false);
                        }
                    }
                    this.set("vm_canShowTimeOffsets", !this.vm_isPatientSelectError && !this.vm_isProviderSelectError);
                };

                this.vm_onStartDatePartChange = function () {
                    if (this.start) {
                        // fix time part resetting when changing date part
                        this.start.setHours(copyOfStartDate.getHours());
                        this.start.setMinutes(copyOfStartDate.getMinutes());
                        this.trigger("change", {field: "start"});
                    }
                    this.vm_onStartDateChange();
                };
                this.vm_onStartDateChange = function () {
                    this._setStartDate(this.start);
                    this._updateSelectorTime();
                    this._onDataChange();
                };
                this.vm_onEndDatePartChange = function () {
                    if (this.end) {
                        // fix time part resetting when changing date part
                        this.end.setHours(copyOfEndDate.getHours());
                        this.end.setMinutes(copyOfEndDate.getMinutes());
                        this.trigger("change", {field: "end"});
                    }
                    this.vm_onEndDateChange();
                };
                this.vm_onEndDateChange = function () {
                    this._setEndDate(this.end);
                    this._updateSelectorTime(true);
                    this._onDataChange();
                };
                this.vm_onWaiveFeeChange = function(){
                    this._onDataChange();
                };
                this.vm_serviceTypeActive = false;
                this.vm_onChangeServiceType = function () {
                    this.set("vm_serviceTypeError", false);
                    this.set("vm_serviceTypeActive", this.serviceTypeId !== null);
                    $eventAggregator.published(events.serviceTypeChanged);
                    this._onDataChange();
                };
                this.vm_timeZoneActive = false;
                this.vm_onChangeTimeZone = function () {
                    this.set("vm_timeZoneError", false);
                    this.set("vm_timeZoneActive", this.timeZoneId !== null);
                    /*if (this.selectedTimeZone === null || !this.selectedTimeZone.id) {
                        this.set("vm_timeZoneError", true);
                    } else {
                        this.set("vm_timeZoneError", false);
                        this.timeZoneId = this.selectedTimeZone.id;
                    }
                    this.set("vm_timeZoneActive", this.selectedTimeZone !== null);*/
                    this._onDataChange();
                    this._updateSelectorTime();
                };

                this.vm_isNew = function () {
                    return this.id === 0;
                };

                this.vm_toDateError = false;

                // We do not use standard kendo "isAllDay" option because our scheduler do not have "All Day" section.
                // Instead we have custom "All Day" checkbox, it value is true when block start from 00:00 and end in 23:59.
                // See 'vm_onIsAllDayChange' for more details.
                this.vm_isAllDay = function () {
                    return isAllDayInterval(this.start, this.end);
                };

                this.vm_onIsAllDayChange = function () {
                    if (!this.vm_isAllDay()) {
                        // Backup current "start" and "end" dates, if user uncheck "All Day" checkbox this values will be restored as "start" and "end" dates.
                        isAllDayTriggerStartDate = new Date(this.start);
                        isAllDayTriggerEndDate = new Date(this.end);

                        var dayBegin = new Date(this.start);
                        dayBegin.setHours(0, 0, 0, 0); // Set "start" date to 00:00:00.

                        var dayEnd = new Date(this.start);
                        dayEnd.setHours(23, 59, 0, 0); // Set "end" date to 23:59:00. We ignore seconds because you can not set them from UI.

                        this._setStartDate(dayBegin);
                        this._setEndDate(dayEnd);
                    } else {
                        // If there is no isAllDayTriggerStartDate (such scenario happens when you open event and "All Day" checkbox already checked)
                        // we automatically set it to default time for this event type (by default 12:00PM 240 min for AB, and 15 min for Appt).
                        if (isAllDayTriggerStartDate === null || isAllDayTriggerEndDate === null) {
                            isAllDayTriggerStartDate = this._getDefaultStartDate();
                            isAllDayTriggerEndDate = this._getDefaultEndDate();
                        }

                        // Restore "start" and "end" dates from backup.
                        this._setStartDate(isAllDayTriggerStartDate);
                        this._setEndDate(isAllDayTriggerEndDate);

                        // We do not need this fields once "All Day" checkbox unchecked.
                        isAllDayTriggerEndDate = null;
                        isAllDayTriggerEndDate = null;
                    }
                };

                this.vm_getFrequencyDetailsToogleButtonText = function () {
                    return this.showFrequencyDetails ? "Done" : "Edit";
                };

                this.vm_onRepeatChange = function () {
                    this._showFrequencyDetails(this.isRepeat);
                    var elem = $('#dialogbox-master__container');

                    this._onDataChange();

                    setTimeout(function () {
                        elem.scrollTop(817);
                    }, 300);
                };

                this.vm_toogleFrequencyDetails = function (e) {
                    e.preventDefault();
                    this._showFrequencyDetails(!this.showFrequencyDetails);

                    var elem = $('#dialogbox-master__container');

                    setTimeout(function () {
                        elem.animate({ scrollTop: 600 }, 300);
                    }, 300);
                };

                this._convertInputTimeToCurrentUserTimezone = function() {
                    var dfd = $.Deferred();
                    var that = this;
                    this.startInCurrentUserTimezone = new Date(this.start);
                    this.endInCurrentUserTimezone = new Date(this.end);

                    if (this.timeZoneId && this.timeZoneId !== snap.profileSession.timeZoneId) {
                        // need to convert time for searching blocks
                        var duration = this.endInCurrentUserTimezone - this.startInCurrentUserTimezone;
                        var opt = {
                            dateTime: $timeUtils.dateToString(this.startInCurrentUserTimezone),
                            sourceTimeZoneId: this.timeZoneId,
                            targetTimeZoneId: snap.profileSession.timeZoneId
                        };
                        $availabilityBlockService.convertTime(opt).then(function(convertedTime) {
                            that.startInCurrentUserTimezone = $timeUtils.dateFromSnapDateString(convertedTime.convertedDateTime);
                            that.endInCurrentUserTimezone = new Date(that.startInCurrentUserTimezone);
                            that.endInCurrentUserTimezone.setTime(that.endInCurrentUserTimezone.getTime() + duration);
                            dfd.resolve();
                        }, function(error) {
                            dfd.reject(error);
                        });
                    } else {
                        dfd.resolve();
                    }

                    return dfd.promise();
                };

                this._saveAction = function () {
                    var that = this;
                    this.set("isError", false);

                    $snapNotification.hideAllConfirmations();

                    if (this._isAffectSeries()) {
                        var message = "Are you sure that you want to save this series of " + this._typeName + "s?";
                        var notifications = this.validateRepeatRule();
                            if (notifications.length) {
                                $snapNotification.info(notifications.join("<br\>"));
                                window.setTimeout(function () {
                                    $snapNotification.confirmationWithCallbacks(message, function () {
                                        saveAction();
                                    });
                                }, 1000);
                            } else {
                                $snapNotification.confirmationWithCallbacks(message, function () {
                                    saveAction();
                                });
                            }
                        } else {
                            saveAction();
                        }

                    function saveAction() {
                        that.set("isLoading", true);
                        that.set("isError", false);

                        var dfd = $.Deferred();
                        dfd.done(function () {
                            that.set("isError", false);
                        }).fail(function () {
                            that.set("isError", true);
                        }).always(function () {
                            that.set("isLoading", false);
                        });

                        that.validateTime().done(function (timeErrors) {
                            if (timeErrors.length === 0) {
                                that.save().done(function (result) {
                                    var isSeries = that._isAffectSeries();
                                    var isNew = that.vm_isNew();
                                    if (isSeries) {
                                        that._showFrequencyDetails(false);
                                    }
                                    if (result.total || result.data.length) {
                                        var message = that._typeName + (isSeries ? "s" : "") + (isNew ? " created " : " updated ") +  "successfully";
                                        $snapNotification.success(message);
                                    }
                                    $eventAggregator.published(that._onSubmitClickEvent, that.getOptions()); //_onSubmitClickEvent - Implemented in concrete dialogs Appointment/AvailabilityBlock.
                                    dfd.resolve();
                                }).fail(function (error) {
                                    if (error) {
                                        $snapNotification.error(error);
                                    }
                                    dfd.reject();
                                });
                            } else {
                                $snapNotification.error(timeErrors.join("<br\>"));
                                dfd.reject();
                            }
                        }).fail(function () {
                            $snapNotification.error("Cannot validate time.");
                            dfd.reject();
                        });
                    }
                };

                this.vm_onSubmitClick = function (e) {
                    var that = this;

                    if (this.isLoading) {
                        e.preventDefault();
                        return false;
                    }

                    this._convertInputTimeToCurrentUserTimezone().done(function() {
                        var errors = that.validate();                    
                    if (errors.length === 0) {
                            that._saveAction();
                    } else {
                        $snapNotification.error(errors.join("<br\>"));
                            that.set("isError", true);
                    }
                    });
                };

                this.vm_onRescheduleClick = function () {
                    this.set("isLoading", true);
                    $eventAggregator.published(this._onRescheduleEvent, this);
                };

                this.vm_onCloseClick = function (e) {
                    $eventAggregator.published(this._onCloseClickEvent, this); //_onCloseClickEvent - Implemented in concrete dialogs Appointment/AvailabilityBlock.

                    $snapNotification.hideAllConfirmations();

                    e.preventDefault();
                };

                this.vm_onRemoveClick = function () {
                    var that = this;
                    $snapNotification.hideAllConfirmations();
                    $snapNotification.confirmationWithCallbacks(that._removeCurrentEventMessage, function () {

                        that.set("isLoading", true);
                        that.set("vm_appointmentChanged", true);
                        that.trigger("change", {field: "vm_isNotError"});

                        that.remove().done(function () {
                            $eventAggregator.published(that._onRemoveClickEvent, that); //_onRemoveClickEvent - Implemented in concrete dialogs Appointment/AvailabilityBlock.
                            $snapNotification.success(that._removedSuccesfullyMessage);
                        }).fail(function (error) {
                            $snapNotification.error(error);
                            that.set("isError", true);
                        }).always(function () {
                            that.set("isLoading", false);
                        });
                    });
                };

                //*********************** PRIVATE API ***********************/
                this._showFrequencyDetails = function (showFrequencyDetails) {
                    this.set("showFrequencyDetails", showFrequencyDetails);
                    this.trigger("change", {
                        field: "showFrequencyDetails"
                    });
                    this.trigger("change", {
                        field: "vm_getFrequencyDetailsToogleButtonText"
                    });
                };

                this._isAffectSeries = function () {
                    return this.isRuleAvailable && this.isRepeat;
                };

                this._getDefaultStartDate = function () {
                    var startDate = new Date(this.start);
                    startDate.setHours(12, 0, 0, 0);

                    return startDate;
                };

                this._getDefaultEndDate = function () {
                    var endDate = new Date(this._getDefaultStartDate()),
                        settingName = this._defaultIntervalSetting, // implemented in concrete event type
                        defaultInterval = this._defaultInterval;  // implemented in concrete event type

                    if (snap.hospitalSettings && snap.hospitalSettings[settingName]) {
                        endDate.setMinutes(endDate.getMinutes() + parseInt(snap.hospitalSettings[settingName]));
                    } else {
                        endDate.setMinutes(endDate.getMinutes() + defaultInterval);
                    }

                    return endDate;
                };

                this._setStartDate = function (newStartDate) {
                    this._startErrorDueToEnd = false;
                    if (newStartDate === null) {
                        $snapNotification.error(messages.emptyStartDate);
                        this.set("start", new Date(copyOfStartDate));
                        if (this.start === null) {
                            this.set("vm_startDateError", true);
                            this.set("vm_isSelectedStartDate", false);
                        }
                    } else {
                        this.set("start", newStartDate);
                        this.set("vm_isSelectedStartDate", true);
                        this.set("vm_startDateError", false);

                        //claculated time diff with previous start date value.
                        var timeDiff = Math.abs(copyOfStartDate.getTime() - this.end.getTime());
                        this.set("end", new Date(this.start.getTime() + timeDiff));
                        this.set("vm_isSelectedEndDate", true);
                        this.set("vm_endDateError", false);

                        //remembered copy of 'start' and 'end' date to avoid wrong autofilling.
                        copyOfStartDate = new Date(this.start);
                        copyOfEndDate = new Date(this.end);
                    }

                    this.trigger("change", { field: "vm_isAllDay" });
                };

                this._setEndDate = function (newEndDate) {
                    if (newEndDate === null) {
                        $snapNotification.error(messages.emptyEndDate);
                        this.set("end", new Date(copyOfEndDate));
                        if (this.end === null) {
                            this.set("vm_endDateError", true);
                            this.set("vm_isSelectedEndDate", false);
                        }
                    } else if (newEndDate < this.start) {
                        $snapNotification.error(messages.endDateAfterStart);
                        this.set("end", new Date(copyOfEndDate));
                        if (this.end < this.start) {
                            this.set("vm_endDateError", true);
                            this.set("vm_isSelectedEndDate", false);
                        }
                    } else {
                        this.set("end", newEndDate);
                        copyOfEndDate = new Date(newEndDate);

                        this.set("vm_isSelectedEndDate", true);
                        this.set("vm_endDateError", false);

                        if (this._startErrorDueToEnd) {
                            this.set("vm_isSelectedStartDate", true);
                            this.set("vm_startDateError", false);
                            this._startErrorDueToEnd = false;
                        }
                    }

                    this.trigger("change", { field: "vm_isAllDay" });
                };

                function isAllDayInterval(start, end) {
                    // Check if event starts at the beginning of day
                    if (start.getHours() === 0 && start.getMinutes() === 0) {
                        // If event starts at the beginning of day and has 23:59 hours duration, we mark such event as "All Day".
                        // We check not exact time but 1 minute interval from 23:59:00 to 24:00:00 in order to support old events. 
                        // This is because previously we did not had "All day" option and there was cases when block time was set to 23:59:00 or 23:59:59 for example.
                        var interval = (end.getTime() - start.getTime());
                        return 86340000 <= interval && interval <= 86400000;
                    }

                    return false;
                }
            }


            function AvailabilityBlock(opt, displayOpt) {
                var defaultClinician = {
                    id: null,
                    name: "Select a Provider",
                    imageSource: "/images/Patient-Male.gif",
                    info: "For this availability"
                };

                this._requestTime = opt.abRequestTime;
                this._type = $scheduleCommon.eventType.availabilityBlock;
                this._typeName = "Availability Block";
                this._onSubmitClickEvent = "ab_onSubmitClick";
                this._onCloseClickEvent = "ab_onCloseClick";
                this._onRemoveClickEvent = "ab_onRemoveClick";
                this._onDblClickEvent = "ab_onDblClick";
                this.vm_isReschedulable = false;

                this._defaultInterval = 240;
                this._defaultIntervalSetting = "defaultAvailabilityBlockDuration";

                this._removeCurrentEventMessage = "Are you sure that you want to cancel this Availability Block?";
                this._removedSuccesfullyMessage = "The Availability Block was removed successfully";

                this.cliniciansSelector = $itemSelector.cliniciansSelector({
                    defaultItem: defaultClinician,
                });

                this._setOptionsForConcreteEventType = function (opt) {
                    this.onDemandEnabled = !opt.onDemandEnabled;
                    this.allowOnDemandAppt = opt.allowOnDemandAppt;
                    this.allowSelfAppt = opt.allowSelfAppt;
                    this.allowProviderAppt = opt.allowProviderAppt;
                    this.isAvailable = opt.isAvailable;
                    this.optimizationTypeCodeId = opt.optimizationTypeCodeId;
                    this.availabilityBlockRuleId = opt.availabilityBlockRuleId;
                    this.clinician = opt.clinician;
                    this.onDemandEnabledOrRO = !opt.onDemandEnabled || this.isReadOnly;
                    this.title = ""; //Dummy field, necessary for Agenda View.

                    this.isLocked = false; //Admin owned
                    this.isPrivate = false; //Clinician owned
                    this.isProtectedBlock = false;

                    if (opt.clinician) {
                        this.isLocked = opt.clinician.locked;
                        this.isPrivate = opt.clinician.private;
                        this.isProtectedBlock = this.isLocked || this.isPrivate;

                        var that = this;
                        $availabilityBlockService.getClinicianProfile(snap.hospitalSession.hospitalId, opt.clinician.clinicianId).done(function (response) {
                            var person = response.data[0].person;
                            var item = {
                                id: response.data[0].userId,
                                personId: person.id,
                                name: $scheduleCommon.getFullName(person),
                                imageSource: person.photoUrl,
                                info: $scheduleCommon.getPhoneNumber(person),
                                data: response.data[0],
                                personType: $itemSelector.personType.clinician
                            };
                            that.cliniciansSelector.selectItem(item);
                        }).fail(function () {
                            $snapNotification.error("Provider profile was not found");
                        });

                    }
                };

                this._getOptionsForConcreteEventType = function () {
                    var opt = {
                        allowOnDemandAppt: this.allowOnDemandAppt,
                        allowProviderAppt: this.allowProviderAppt,
                        allowSelfAppt: this.allowSelfAppt,
                        isAvailable: this.isAvailable,
                        optimizationTypeCodeId: this.optimizationTypeCodeId,
                        rule: null,
                        clinician: null
                    };

                    var clinician = this.cliniciansSelector.getSelectedItem();
                    if (clinician) {
                        opt.clinician = {
                            availabilityBlockId: this.id,
                            clinicianId: clinician.id,
                            locked: this.isLocked,
                            private: this.isPrivate
                        };
                    }

                    if (this._isAffectSeries()) {
                        opt.rule = this.repeater.getRepeatRule(this.startInCurrentUserTimezone, this.endInCurrentUserTimezone);
                    }

                    return opt;
                };

                this._updateSelectorTime = function(useCahedValue) {
                    this.cliniciansSelector.updateEventTime(this.start, this.end, this.timeZoneId, useCahedValue);
                };


                //****************** Call BASE constructor ********************
                SchedulerDialog.call(this, opt);

                //******************************** On dialog show **********************************/
                this._loadDetails = function (userType) {
                    var dfd = $.Deferred();
                    this.cliniciansSelector.set("isSelectorLocked", userType === $scheduleCommon.userType.clinician);
                    dfd.resolve();
                    return dfd.promise();
                };

                //********************* Availability Block methods *************************/
                this.isUnavailable = function () {
                    return !this.isAvailable;
                };
                //ToDo: implement allowOnDemandAppt allowSelfAppt allowProviderAppt isAvailable trigger.
                this.onAvailableChange = function () {
                    this.isAvailable = !this.isAvailable;
                    this.trigger("change", {
                        field: "isUnavailable"
                    });
                    if (!this.isAvailable) {
                        this.set("allowOnDemandAppt", false);
                        this.set("allowSelfAppt", false);
                        this.set("allowProviderAppt", false);

                    }
                };
                this.onApptOptionChange = function () {
                    if (this.allowOnDemandAppt || this.allowSelfAppt || this.allowProviderAppt) {
                        this.set("isAvailable", true);
                        this.trigger("change", {
                            field: "isUnavailable"
                        });
                    }
                };

                this.onIsProtectedBlockChange = function () {
                    switch (this.userType) {
                        case $scheduleCommon.userType.admin:
                            this.set("isLocked", this.isProtectedBlock);
                            break;
                        case $scheduleCommon.userType.clinician:
                            this.set("isPrivate", this.isProtectedBlock);
                            break;
                    }
                };

                this.saveAll = function () {
                    return $eventService.saveAvailabilityBlock(this.getOptions(), this._requestTime);
                };

                this.removeAll = function () {
                    return $eventService.cancelAvailabilityBlock(this.getOptions());
                };

                this._validateDetails = function () {
                    var errorList = [];

                    if (!this.allowOnDemandAppt && !this.allowSelfAppt && !this.allowProviderAppt && !this.isUnavailable()) {
                        errorList.push("Select at least one service option.");
                    }

                    if (this.cliniciansSelector.getSelectedItem() === null) {
                        errorList.push("Select a provider.");
                        this.set("vm_isProviderSelectError", true);
                    }

                    return errorList;
                };

                this._onDataChange = function () {
                    // no action
                };

                this._validateTimeDetails = function (currentUserTime) {
                    var errorList = [];
                    if (this.end < currentUserTime) {
                        // end time of updating availability block should be in the future
                        errorList.push("Block end time should not be in the past.");
                        this.set("vm_endDateError", true);
                        this.set("vm_isSelectedEndDate", false);

                        this._startErrorDueToEnd = true;
                        this.set("vm_startDateError", true);
                        this.set("vm_isSelectedStartDate", false);
                    }
                    return errorList;
                };
            }

            function ConsultationDialog(opt, displayOpt) {
                var defaultClinician = {
                    id: null,
                    name: "Select a provider",
                    imageSource: "/images/Patient-Male.gif",
                    info: "For this appointment"
                };

                var defaultPatient = {
                    id: null,
                    name: "Select a Patient",
                    imageSource: "/images/Patient-Male.gif",
                    info: "For this appointment"
                };

                var itemSelectedEvent = $itemSelector.events.onItemSelected;

                var otherPrimaryConcernId = snap.dataSource.Admin.Concern.Primary.otherConcernId;
                var otherSecondaryConcernId = snap.dataSource.Admin.Concern.Secondary.otherConcernId;

                this.zonedStart = opt.zonedStart || null;
                this.zonedEnd = opt.zonedEnd || null;
                this.appointmentTypeCode = opt.appointmentTypeCode || $scheduleCommon.appointmentTypeCode.clinicianScheduled;
                this.isTimezoneReadOnly = true;

                this._blockPermission = $scheduleCommon.blockPermissions.allowProviderAppt;

                var that = this;
                function onPatientSelected() {
                    var patient = that.patientsSelector.getSelectedItem();
                    if (patient) {
                        that.cliniciansSelector.counterpartFilter = patient.personId;
                        that.cliniciansSelector.refresh();
                    }
                }
                function onClinicianSelected() {
                    var clinician = that.cliniciansSelector.getSelectedItem();
                    if (clinician) {
                        that.patientsSelector.counterpartFilter = clinician.personId;
                        that.patientsSelector.refresh();
                    }
                }
                this.cliniciansSelector = $itemSelector.cliniciansSelector({ defaultItem: defaultClinician });
                this.patientsSelector = displayOpt.userType === $scheduleCommon.userType.patient ? $itemSelector.emptySelector({ defaultItem: defaultPatient }) : $itemSelector.patientsSelector({ defaultItem: defaultPatient });
                this.patientsSelector.on(itemSelectedEvent, onPatientSelected);
                this.cliniciansSelector.on(itemSelectedEvent, onClinicianSelected);

                this.isReschedulable = opt.isReschedulable;

                this.timeZoneDs = timeZoneDataSource;

                this.serviceTypeId = null;
                this.serviceTypeName = opt.serviceTypeName || "";

                this.vm_isReschedulable = opt.isReschedulable;
                this.vm_canShowTimeOffsets = false;
                this.vm_isTimeOffsetsVisible = false;

                this._defaultIntervalSetting = "";

                this._dismissed = false;
                this.vm_dismissedReason = "";
                this.phoneNumber = "";
                this.phoneType = "";

                this.phoneTypeDs = new kendo.data.DataSource({
                    data: [{
                        text: "Home",
                        value: phoneTypeEnum.home
                    }, {
                        text: "Mobile",
                        value: phoneTypeEnum.mobile
                    }, {
                        text: "Other",
                        value: phoneTypeEnum.other
                    }]
                });

                this._setOptionsForConcreteEventType = function (opt) {
                    this.availabilityBlockId = opt.availabilityBlockId ? opt.availabilityBlockId : null;
                    this.waiveFee = opt.waiveFee;

                    this.encounterTypeCode = opt.encounterTypeCode ? opt.encounterTypeCode : encounterTypeCodes.Video;

                    this.primaryConcern = null;
                    this.secondaryConcern = null;

                    this.vm_primaryConsernId = null;
                    this.vm_secondaryConsernId = null;
                    this.displaySecondaryConcern = false;
                    this.dataPrimaryConcernList = [];
                    this.dataSecondaryConcernList = [];
                    this.primaryConcernOtherText = "";
                    this.secondaryConcernOtherText = "";
                    this.additionalNotes = "";
                    this.vm_isAddNotesExpanded = false;
                    this.phoneNumber = opt.phoneNumber;
                    this.phoneType = opt.phoneType || phoneTypeEnum.home;
                    this.serviceTypeId = opt.serviceTypeId || null;
                    this.serviceTypeName = opt.serviceTypeName || "";
                    this._dismissed = opt.dismissed;

                    if (opt.intakeMetadata) {
                        this.additionalNotes = opt.intakeMetadata.additionalNotes ? opt.intakeMetadata.additionalNotes : "";

                        if (opt.intakeMetadata.concerns && opt.intakeMetadata.concerns.length > 0) {
                            var concerns = opt.intakeMetadata.concerns;
                            for (var i = 0; i < concerns.length; i++) {
                                if (concerns[i].isPrimary) {
                                    this.primaryConcern = concerns[i];
                                    this.vm_primaryConsernId = concerns[i].customCode.code;
                                    this.primaryConcernOtherText = concerns[i].customCode.description;
                                } else {
                                    this.secondaryConcern = concerns[i];
                                    this.displaySecondaryConcern = true;
                                    this.vm_secondaryConsernId = concerns[i].customCode.code;
                                    this.secondaryConcernOtherText = concerns[i].customCode.description;
                                }
                            }
                        }
                    }
                };

                this._updateSelectorTime = function(useCahedValue) {
                    this.patientsSelector.updateEventTime(this.start, this.end, this.timeZoneId, useCahedValue);
                    this.cliniciansSelector.updateEventTime(this.start, this.end, this.timeZoneId, useCahedValue);
                };

                //****************** Call BASE constructor ********************
                SchedulerDialog.call(this, opt);

                //******************************** On dialog show **********************************/
                this._checkProvider = function (clinician, clinicianId) {
                    var dfd = $.Deferred();
                    var that = this;
                    if (clinicianId) {
                        $availabilityBlockService.getClinicianProfile(snap.hospitalSession.hospitalId, clinicianId).then(function (responce) {
                            if (responce && responce.data && responce.data.length) {
                                var clinicianObj = $itemSelector.convertPersonToSelectorItem(responce.data[0].person, clinicianId, $itemSelector.personType.clinician, responce.data[0].specialty);
                                that.cliniciansSelector.selectItem(clinicianObj);
                                onClinicianSelected();
                                dfd.resolve(true);
                            } else {
                                that.set("isDisabled", true);
                                if (clinician) {
                                    var clinicianObj = $itemSelector.convertPersonToSelectorItem(clinician.person, clinicianId, $itemSelector.personType.clinician, clinician.specialty);
                                    that.cliniciansSelector.selectItem(clinicianObj);
                                    that.cliniciansSelector.disableSelectedItem();
                                }
                                dfd.resolve(false);
                            }
                        }, function () {
                            that.set("isDisabled", true);
                            if (clinician) {
                                var clinicianObj = $itemSelector.convertPersonToSelectorItem(clinician.person, clinicianId, $itemSelector.personType.clinician, clinician.specialty);
                                that.cliniciansSelector.selectItem(clinicianObj);
                                that.cliniciansSelector.disableSelectedItem();
                            }
                            dfd.resolve(false);
                        });
                    } else {
                        dfd.resolve(true);
                    }
                    return dfd.promise();
                };

                var getPatientProfileForPatient = function(patientId) {
                    var dfd = $.Deferred();
                    $availabilityBlockService.getPatientProfileForPatient(patientId).then(function(responce) {
                        if (responce && responce.data && responce.data.length) {
                            var data = responce.data[0];
                            var patientProfile = {
                                person: {
                                    id: patientId,
                                    photoUrl: data.profileImagePath,
                                    name: {
                                        given: data.patientName,
                                        family: data.lastName
                                    },
                                    phones: [
                                        { use: "other", value: data.mobilePhone }, 
                                        { use: "home", value: data.homePhone }
                                    ]
                                }
                            };
                            dfd.resolve({data: [patientProfile]});
                        }
                    }, function(error) {
                        dfd.reject(error);
                    });
                    return dfd.promise();
                };
                this._checkPatient = function (patient, patientId, userType) {
                    var dfd = $.Deferred();
                    var that = this;
                    if (patientId) {
                        var getPatientProfilePromise = userType == $scheduleCommon.userType.patient ?
                            getPatientProfileForPatient(patientId) :
                            $availabilityBlockService.getPatientProfile(snap.hospitalSession.hospitalId, patientId);
                        getPatientProfilePromise.then(function (responce) {
                            if (responce && responce.data && responce.data.length) {
                                var patientObj = $itemSelector.convertPersonToSelectorItem(responce.data[0].person, patientId, $itemSelector.personType.patient);
                                that.patientsSelector.selectItem(patientObj);
                                onPatientSelected();
                                dfd.resolve(true);
                            } else {
                                that.set("isDisabled", true);
                                if (patient) {
                                    var patientObj = $itemSelector.convertPersonToSelectorItem(patient.person, patientId, $itemSelector.personType.patient);
                                    that.patientsSelector.selectItem(patientObj);
                                    that.patientsSelector.disableSelectedItem();
                                }
                                dfd.resolve(false);
                            }
                        }, function () {
                            that.set("isDisabled", true);
                            if (patient) {
                                var patientObj = $itemSelector.convertPersonToSelectorItem(patient.person, patientId, $itemSelector.personType.patient);
                                that.patientsSelector.selectItem(patientObj);
                                that.patientsSelector.disableSelectedItem();
                            }
                            dfd.resolve(false);
                        });
                    } else {
                        dfd.resolve(true);
                    }
                    return dfd.promise();
                };
                this._loadConcerns = function () {
                    var dfd = $.Deferred();
                    var that = this;
                    var primaryPromise = $availabilityBlockService.getPrimaryConcerns();
                    var secondaryPromise = $availabilityBlockService.getSecondaryConcerns();

                    $.when(primaryPromise, secondaryPromise).then(function (primaryConcerns, secondaryConcerns) {
                        that.set("dataPrimaryConcernList", primaryConcerns[0].data);
                        that.set("dataSecondaryConcernList", secondaryConcerns[0].data);

                        if (that.primaryConcern) {
                            that.set("vm_primaryConsernId", that.primaryConcern.customCode.code);
                        }

                        if (that.secondaryConcern) {
                            that.set("vm_secondaryConsernId", that.secondaryConcern.customCode.code);
                        }

                        if (snap.dataSource.Admin.Concern.Primary.OtherConcern) {
                            snap.dataSource.Admin.Concern.Primary.OtherConcern.fetch().done(function () {
                                var data = snap.dataSource.Admin.Concern.Primary.OtherConcern.data();
                                if (data.length > 0) {
                                    otherPrimaryConcernId = data[0].id;
                                    that.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });
                                }
                                if (snap.dataSource.Admin.Concern.Secondary.OtherConcern) {
                                    snap.dataSource.Admin.Concern.Secondary.OtherConcern.fetch().done(function () {
                                        var data = snap.dataSource.Admin.Concern.Secondary.OtherConcern.data();
                                        if (data.length > 0) {
                                            otherSecondaryConcernId = data[0].id;
                                            that.trigger("change", { field: "vm_isSecondaryConcernOtherSelected" });
                                        }
                                        dfd.resolve();
                                    });
                                } else {
                                    dfd.resolve();
                                }
                            });
                        } else {
                            dfd.resolve();
                        }
                    }, function () {
                        dfd.reject();
                    });
                    return dfd.promise();
                };

                this._loadDetails = function (userType) {
                    var dfd = $.Deferred();
                    var scope = this;

                    if (this._initEvents) {
                        this._initEvents();
                    }

                    if (this._deepLoadDetails) {
                        this._deepLoadDetails();
                    }

                    var clinician = $scheduleCommon.findProvider(opt.participants);
                    var patient = $scheduleCommon.findPatient(opt.participants);

                    this._updateSelectorTime();
                    this.refreshEncounterType();
                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    this.set("vm_serviceTypeActive", this.serviceTypeId !== null);
                    
                    this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                    this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);
                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this.set("isReadOnly", this.isReadOnly || !this.vm_isNew() && ($scheduleCommon.isAppointmentReadOnly(opt.appointmentStatusCode) || isReadOnly(userType, clinician, opt.clinicianId)));
                    this.trigger("change", {field: "vm_isNotReadOnly"});

                    var selectedService = {
                        serviceTypeId: this.serviceTypeId,
                        description: this.serviceTypeName
                    };
                    this.set("serviceTypesSource", getServiceTypesDataSource(this.isReadOnly, selectedService));
                    this.serviceTypesSource.read().done(function () {
                        scope.trigger("change", { field: "serviceTypeId" });
                        $eventAggregator.published(events.serviceTypesLoaded);
                    });

                    this.timeZoneDs.read().done(function () {
                        scope.selectedTimeZone = scope.timeZoneDs.data().find(function(el) {
                            return el.id === scope.timeZoneId;
                        });
                        scope.set("vm_timeZoneActive", scope.selectedTimeZone !== null);
                        scope.trigger("change", { field: "selectedTimeZone" });
                    });

                    this.set("isRepeaterVisible", isRepeaterVisible(userType, this.isRepeat, this.vm_isNew(), this.appointmentTypeCode));

                    if (this.start) {
                        this.set("vm_isSelectedStartDate", true);
                    }

                    if (this.end) {
                        this.set("vm_isSelectedEndDate", true);
                    }
                    this.trigger("change", { field: "vm_isCancelBtnVisible" });
                    this.trigger("change", { field: "vm_saveBtnTxt" });

                    this.cliniciansSelector.set("isSelectorLocked", this.isReadOnly || isCliniciansSelectorLocked(userType));
                    this.patientsSelector.refresh();
                    this.patientsSelector.set("isSelectorLocked", this.isReadOnly || isPatientSelectorLocked(userType, clinician, opt.clinicianId));

                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });
                    this.trigger("change", { field: "vm_apptHeaderText" });
                    this.trigger("change", { field: "vm_isCancelButtonVisible" });
                    this.trigger("change", { field: "vm_showDismissReason" });

                    if (!this.vm_isNew()) {
                        this.patientsSelector.selectWithConfirmation = true;
                        this.patientsSelector.on($itemSelector.events.onItemClicked, function(item) {
                            $snapNotification.confirmationWithCallbacks("Are you sure you want to change the patient for this appointment? (This will send a cancellation notice to the previous patient.)", function() {
                                scope.patientsSelector.selectHandler(item);
                            });
                        });
                    }

                    $availabilityBlockService.getUserCurrentTime().done(function (resp) {
                        var userDNATime = $timeUtils.dateFromSnapDateString(resp.data[0]);
                        userDNATime.setMinutes(userDNATime.getMinutes() - 30);
                        scope.set("isFuture", userType === $scheduleCommon.userType.patient && !scope.isReadOnly && (userDNATime <= scope.end));
                        scope.trigger("change", { field: "vm_isCancelButtonVisible" });

                        $.when(scope._checkProvider(clinician, opt.clinicianId), scope._checkPatient(patient, opt.patientId, userType)).then(function () {
                            scope.set("vm_canShowTimeOffsets", 
                                scope.patientsSelector.getSelectedItem() !== null && scope.cliniciansSelector.getSelectedItem() !== null);
                            if (!scope.isReadOnly) {
                                scope._validateOnChange = true;

                                scope.patientsSelector.on(itemSelectedEvent, function() {
                                    onItemSelectedEvent($itemSelector.personType.patient);
                                });
                                scope.cliniciansSelector.on(itemSelectedEvent, function() {
                                    onItemSelectedEvent($itemSelector.personType.clinician);
                                });
                                function onItemSelectedEvent(personType) {
                                    scope.set("phoneNumber", "");
                                    scope.vm_onPhoneTypeChange();

                                    var isClinicianSelected = personType === $itemSelector.personType.clinician;
                                    var activeSelector = isClinicianSelected ? scope.cliniciansSelector : scope.patientsSelector;
                                    var otherSelector = isClinicianSelected ? scope.patientsSelector : scope.cliniciansSelector;

                                    scope._onDataChange();
                                    activeSelector.showTimeOffset(scope.vm_isTimeOffsetsVisible);
                                    scope.vm_disableSelectError(personType);

                                    if (scope.isDisabled && scope._validateOnChange) {
                                        var otherSelectorSelectedItem = otherSelector.getSelectedItem();
                                        var otherSelectorOk = !otherSelectorSelectedItem || !otherSelectorSelectedItem.isDisabled;

                                        var selectedItem = activeSelector.getSelectedItem();
                                        var checkPromise = isClinicianSelected ? scope._checkProvider(selectedItem, selectedItem.id) :
                                            scope._checkPatient(selectedItem, selectedItem.id);
                                        checkPromise.done(function (ok) {
                                            activeSelector.showTimeOffset(scope.vm_isTimeOffsetsVisible);
                                            if (ok && otherSelectorOk) {
                                                scope.set("isDisabled", false);
                                                scope._validateOnChange = false;
                                            }
                                        });
                                    }
                                }
                                scope._loadConcerns().done(function() {
                                    dfd.resolve();
                                });
                            } else {
                                dfd.resolve();
                            }
                        }, function () {
                            dfd.reject();
                        });
                    });

                    return dfd.promise();
                };

                function isCliniciansSelectorLocked(userType) {
                    if (userType === $scheduleCommon.userType.admin) {
                        return false;
                    }

                    return true;
                }

                function isPatientSelectorLocked(userType, clinician, clinicianId) {
                    if (userType === $scheduleCommon.userType.admin) {
                        return false;
                    } else if (userType === $scheduleCommon.userType.clinician) {
                        if (!clinician) {
                            return false;
                        } else {
                            return clinicianId !== snap.profileSession.userId;
                        }
                    }
                    return true;
                }

                function isReadOnly(userType, clinicican, clinicicanId) {
                    if (userType === $scheduleCommon.userType.clinician) {
                        return (!(typeof (clinicican) === "undefined" || clinicican === null || clinicicanId === snap.profileSession.userId));
                    } else {
                        return userType === $scheduleCommon.userType.patient;
                    }
                    }


                //******************************* MVVM BINDINGS ************************************/
                this._onDataChange = function () {
                    if (!this.vm_appointmentChanged) {
                        this.set("vm_appointmentChanged", true);
                        this.trigger("change", { field: "vm_isCancelBtnVisible" });
                    }
                };

                this.isVideo = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Video;
                };
                this.isPhone = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Phone;
                };
                this.isText = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Text;
                };
                this.isInPerson = function () {
                    return this.encounterTypeCode == encounterTypeCodes.InPerson;
                };
                this.refreshEncounterType = function () {
                    this.trigger("change", { field: "isVideo" });
                    this.trigger("change", { field: "isPhone" });
                    this.trigger("change", { field: "isText" });
                    this.trigger("change", { field: "isInPerson" });
                };
                this.setEncounterTypeCode = function (e) {
                    var encounterTypeCode = $(e.currentTarget).data('id');

                    this.set("encounterTypeCode", encounterTypeCode);
                    this.refreshEncounterType();
                    this._onDataChange();
                };

                this.patientNumber = "";
                this.vm_isSelectedStartDate = false;
                this.vm_isSelectedEndDate = false;
                this.vm_appointmentChanged = false;
                this.vm_primaryConcernActive = false;
                this.vm_primaryConcernError = false;
                this.vm_secondaryConcernActive = false;
                this.vm_secondaryConcernError = false;

                this.vm_isNotReadOnly = function() {
                    return !this.isReadOnly;
                };

                this.vm_showDismissReason = function () {
                    return this.userType !== $scheduleCommon.userType.patient && this._dismissed;
                };

                this.vm_isAddConcernButtonVisible = function () {
                    return !this.isReadOnly && !this.displaySecondaryConcern && this.vm_primaryConsernId !== null;
                };

                this.vm_isCancelBtnVisible = function () {
                    return !this.vm_appointmentChanged && !this.vm_isNew();
                };

                this.vm_userTrayHeaderText = function () {
                    return "Who is this appointment for?";
                };

                this.vm_apptHeaderText = function () {
                    if (this.vm_isNew()) {
                        return "New Appointment";
                    }

                    return this.isReadOnly ? "Appointment" : "Edit Appointment";
                };

                this.vm_saveBtnTxt = function () {
                    return this.vm_isNew() ? "Create" : "Save";
                };

                function isRepeaterVisible(userType, isRepeat, isNew, appointmentTypeCode) {
                    if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                        return false;
                    }
                    if (isNew) {
                        return true;
                    }

                    if (userType == $scheduleCommon.userType.patient) {
                        return isRepeat ? true : false;
                    } else {
                        return true;
                    }

                }

                this.vm_isPrimaryConcernOtherSelected = function () {
                    return this.vm_primaryConsernId === otherPrimaryConcernId;
                };

                this.vm_isSecondaryConcernOtherSelected = function () {
                    return this.vm_secondaryConsernId === otherSecondaryConcernId;
                };

                this.vm_expandAddNotes = function () {
                    this.set("vm_isAddNotesExpanded", !this.vm_isAddNotesExpanded);
                };

                this.vm_showTimeOffsets = function () {
                    var flag = !this.vm_isTimeOffsetsVisible;
                    this.set("vm_isTimeOffsetsVisible", flag);
                    this.patientsSelector.showTimeOffset(flag);
                    this.cliniciansSelector.showTimeOffset(flag);
                };

                this.vm_onAddConcernClick = function (e) {
                    e.preventDefault();
                    this.set("displaySecondaryConcern", true);
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });
                    this._onDataChange();
                };

                this.vm_onRemoveSecondaryConcernClick = function () {
                    this.set("vm_secondaryConcernError", false);
                    this.set("vm_secondaryConcernActive", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("displaySecondaryConcern", false);
                    this.set("vm_secondaryConsernId", null);
                    this.secondaryConcern = null;
                    this.set("secondaryConcernOtherText", "");
                    this.trigger("change", { field: "vm_isSecondaryConcernOtherSelected" });
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });
                    this._onDataChange();
                };

                this.vm_onPrimaryConcernChange = function () {
                    this.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });

                    this.set("vm_primaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_secondaryConcernError", false);
                        this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);

                    var concern = this._formatConcernData(this.dataPrimaryConcernList, this.vm_primaryConsernId, true);

                    if (!this.vm_isPrimaryConcernOtherSelected() && this.primaryConcernOtherText !== "") {
                        this.set("primaryConcernOtherText", "");
                    }

                    if (this.vm_isPrimaryConcernOtherSelected()) {
                        $('span.dialogbox-master__reason-dropdown').first().addClass('is-active');
                        concern.customCode.description = this.get("primaryConcernOtherText");
                    } else {
                        $('span.dialogbox-master__reason-dropdown').first().removeClass('is-active');
                    }

                    this.primaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_onSecondaryConcernChange = function () {
                    this.trigger("change", { field: "vm_isSecondaryConcernOtherSelected" });

                    var concern = this._formatConcernData(this.dataSecondaryConcernList, this.vm_secondaryConsernId, false);

                    this.set("vm_secondaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);

                    if (!this.vm_isSecondaryConcernOtherSelected() && this.secondaryConcernOtherText !== "") {
                        this.set("secondaryConcernOtherText", "");
                    }

                    if (this.vm_isSecondaryConcernOtherSelected()) {
                        $('span.dialogbox__reason-dropdown').last().addClass('is-active');
                        concern.customCode.description = this.get("secondaryConcernOtherText");
                    } else {
                        $('span.dialogbox__reason-dropdown').last().removeClass('is-active');
                    }

                    this.secondaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_onPhoneNumberChange = function () {
                    this.set("vm_phoneNumberError", false);
                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    if (this.phoneType !== phoneTypeEnum.other) {
                        this.set("phoneType", phoneTypeEnum.other);
                    }
                    this._onDataChange();
                };

                this.vm_onPhoneTypeChange = function () {
                    // get phone type
                    // get phone from person from selector
                    // update phone field
                    // TODO: remove filter Function to utilities or replace with ES6 or underscore / lodash libraries
                    try {
                        var _phoneType = this.phoneType;

                        var filterFunc = function (array, callback) {
                            var result = [];
                            for (var i = 0; i < array.length; i++) {
                                if (callback(array[i])) {
                                    result.push(array[i]);
                                }
                            }
                            return result;
                        };

                        var callback = function (a) {
                            return phoneTypeEnum[a] == _phoneType;
                        };

                        var typeName = filterFunc(Object.keys(phoneTypeEnum), callback)[0];

                        //if there is a selected patient
                        if (this.patientsSelector.getSelectedItem()) {
                            var phones = this.patientsSelector.getSelectedItem().data.person.phones;
                            var callback2 = function (b) {
                                return b.use == typeName;
                            };
                            var numberVal = filterFunc(phones, callback2);

                            if (numberVal.length > 0) {
                                this.set("phoneNumber", numberVal[0].value);
                            }
                            else {
                                this.set("phoneNumber", "");
                            }
                        }
                    }
                    catch (exp) {
                        window.console.error(exp);
                    }

                    this._onDataChange();
                };

                this.vm_onKeyUpAdditionalNotes = function () {
                    this._onDataChange();
                };

                //*********************** PRIVATE METHODS ***********************/

                this._formatConcernData = function (concernList, selectedConcernId, isPrimary) {
                    var concerns = concernList.filter(function (concern) {
                        return concern.id === selectedConcernId;
                    });

                    if (concerns.length > 0) {
                        return {
                            isPrimary: isPrimary,
                            customCode: {
                                code: selectedConcernId,
                                description: concerns[0].name
                            }
                        };
                    }

                    return null;
                };

                this._validateDetails = function () {
                    var errorList = [];

                    if (this.cliniciansSelector.getSelectedItem() === null) {
                        errorList.push("Select a Provider.");
                        this.set("vm_isProviderSelectError", true);
                        this.set("vm_canShowTimeOffsets", false);
                    }

                    if (this.patientsSelector.getSelectedItem() === null) {
                        errorList.push("Select a Patient.");
                        this.set("vm_isPatientSelectError", true);
                        this.set("vm_canShowTimeOffsets", false);
                    }

                    if ((this.vm_primaryConsernId !== null) && (this.displaySecondaryConcern && this.vm_secondaryConsernId !== null) && this.vm_secondaryConsernId !== otherSecondaryConcernId && this.primaryConcern.customCode.description === this.secondaryConcern.customCode.description) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if ((this.vm_secondaryConsernId === otherSecondaryConcernId && this.vm_primaryConsernId === otherPrimaryConcernId) && ($.trim(this.primaryConcernOtherText) === $.trim(this.secondaryConcernOtherText))) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if (this.vm_primaryConsernId === null) {
                        errorList.push("Select or enter a Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_primaryConsernId === otherPrimaryConcernId && $.trim(this.primaryConcernOtherText) === "") {
                        errorList.push("Enter Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.displaySecondaryConcern && this.vm_secondaryConsernId === null) {
                        errorList.push("Select Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_secondaryConsernId === otherSecondaryConcernId && $.trim(this.secondaryConcernOtherText) === "") {
                        errorList.push("Enter Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.encounterTypeCode === encounterTypeCodes.Phone && $.trim(this.phoneNumber) === "") {
                        errorList.push("Enter a Phone number.");
                        this.set("vm_phoneNumberError", true);
                        this.set("vm_isPhoneNumberFilled", false);
                    }
                    if (this.serviceTypeId === null) {
                        errorList.push("Select a Service Type");
                        this.set("vm_serviceTypeError", true);
                        this.set("vm_serviceTypeActive", false);
                    }

                    if (this.selectedTimeZone === null) {
                        errorList.push("Select a Timezone");
                        this.set("vm_timeZoneError", true);
                        this.set("vm_timeZoneActive", false);
                    }
                    if (this._deepValidateDetails) {
                        errorList = errorList.concat(this._deepValidateDetails());
                    }

                    return errorList;
                };
            }

            function Appointment(opt, displayOpt) {
                var scope = this;

                this._type = $scheduleCommon.eventType.appointment;
                this._typeName = "Appointment";
                this._defaultInterval = 15;

                this.appointmentStatusCode = opt.appointmentStatusCode;
                this.isReadOnly = displayOpt.forceReadOnly;

                this._onSubmitClickEvent = "appt_onSubmitClick";
                this._onCloseClickEvent = "appt_onCloseClick";
                this._onRemoveClickEvent = "appt_onRemoveClick";
                this._onRescheduleEvent = "appt_onReschedule";
                this._removeCurrentEventMessage = "Are you sure that you want to cancel this Appointment?";
                this._removedSuccesfullyMessage = "The Appointment was removed successfully";

                //****************** Call BASE constructor ********************
                ConsultationDialog.call(this, opt, displayOpt);

                this._getOptionsForConcreteEventType = function () {
                    var concerns = [];
                    if (this.primaryConcern) {
                        concerns.push(this.primaryConcern);
                    }

                    if (this.secondaryConcern) {
                        concerns.push(this.secondaryConcern);
                    }

                    var participants = [];
                    var clinicianId = null;
                    var patientId = null;

                    var clinician = this.cliniciansSelector.getSelectedItem();
                    if (clinician) {
                        participants.push({
                            appointmentId: this.id,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: clinician.data.person.id,
                            person: clinician.data.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
                        });
                        clinicianId = clinician.id;
                    }

                    var patient = this.patientsSelector.getSelectedItem();
                    if (patient) {
                        participants.push({
                            appointmentId: this.id,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: patient.data.person.id,
                            person: patient.data.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.patient
                        });
                        patientId = patient.id;
                    }

                    return {
                        appointmentTypeCode: this.appointmentTypeCode,
                        intakeMetadata: {
                            additionalNotes: this.additionalNotes,
                            concerns: concerns,
                        },
                        encounterTypeCode: this.encounterTypeCode,
                        participants: participants,
                        waiveFee: this.waiveFee,
                        clinicianId: clinicianId,
                        patientId: patientId,
                        phoneNumber: this.phoneNumber,
                        phoneType: this.phoneType,
                        serviceTypeId: this.serviceTypeId,
                        timeZoneId: this.timeZoneId,
                        startInCurrentUserTimezone: this.startInCurrentUserTimezone,
                        endInCurrentUserTimezone: this.endInCurrentUserTimezone,
                        zonedStart: this.zonedStart,
                        zonedEnd: this.zonedEnd
                    };
                };

                this._initEvents = function() {
                    scope = this;
                    $eventAggregator.subscriber(events.serviceTypeChanged, function() {
                        var selectedServiceType = scope.serviceTypesSource.data().find(function(serviceType) {
                            return serviceType.serviceTypeId === scope.serviceTypeId;
                        });
                        if (selectedServiceType) {
                            var selectedServiceDuration = selectedServiceType.appointmentLengthMinutes;
                            var startCopy = new Date(scope.start);
                            scope.set("end", new Date(startCopy.setMinutes(startCopy.getMinutes() + selectedServiceDuration)));
                            scope.set("appointmentTypeCode", selectedServiceType.appointmentType);
                            scope.vm_onEndDateChange();
                        }
                    });
                };

                this._validateTimeDetails = function (currentUserTime) {
                    var errorList = [];
                    var startTime = this.startInCurrentUserTimezone || this.start;
                    // set a 0.5 hour block in the past padding
                    currentUserTime.setMinutes(currentUserTime.getMinutes() - 30);
                    if (currentUserTime > startTime) {
                        errorList.push("Block start time should not be in the past.");
                        this.set("vm_startDateError", true);
                        this.set("vm_isSelectedStartDate", false);

                        this.set("vm_endDateError", true);
                        this.set("vm_isSelectedEndDate", false);
                    }
                    return errorList;
                };


                this.vm_isCancelButtonVisible = function () {
                    return !this.vm_isNew() && (!this.isReadOnly || this.isFuture);
                };

                this.saveAll = function () {
                    var rule = null;
                    if (this._isAffectSeries()) {
                        rule = this.repeater.getRepeatRule(this.startInCurrentUserTimezone, this.endInCurrentUserTimezone, 1);
                    }

                    return $eventService.saveAppointment(this.getOptions(), rule);
                };

                //******************************* PUBLIC API **************************************/
                this.removeAll = function () {
                    return this.userType === $scheduleCommon.userType.patient ? snap.patient.schedule.patientAppointmentService().removeAppointment(this.getOptions().id) : $eventService.cancelAppointment(this.getOptions());
                };
            }

            function DocumentEncounter(opt, displayOpt) {
                var scope = this;
                var diagnosticCodingSystem = snap.hospitalSettings.mDiagnosticCodingSystem;
                var codingSystems = {
                    icd10: "ICD-10-DX",
                    icd9: "ICD-9-DX",
                    snomed: "SNOMED-CT"
                };
                var codingSystemShortNames = {
                    icd10: "ICD-10",
                    icd9: "ICD-9",
                    snomed: "SNOMED"
                };

                var serviceDurations = [];
                var wrapCodingSystemName = function(codingSystem) {
                    if (codingSystem == codingSystems.icd10) {
                        return codingSystemShortNames.icd10;
                    } else if (codingSystem == codingSystems.icd9) {
                        return codingSystemShortNames.icd9;
                    } else if (codingSystem == codingSystems.snomed) {
                        return codingSystemShortNames.snomed;
                    } else {
                        return codingSystem;
                    }
                };

                this._type = $scheduleCommon.eventType.documentEncounter;
                this._typeName = "Document Encounter";
                this._defaultInterval = 5;
                this.durationPeriod = null;
                this.isRuleAvailable = false;
                this.isReadOnly = false;

                this.subjective = "";
                this.objective = "";
                this.assessment = "";
                this.plan = "";

                this.vm_isNext = false;
                this.vm_isSubjectiveExpanded = false;
                this.vm_isObjectiveExpanded = false;
                this.vm_isAssessmentExpanded = false;
                this.vm_isPlanExpanded = false;

                this.vm_diagnosticCodingSystem = wrapCodingSystemName(diagnosticCodingSystem);

                this._onSubmitClickEvent = "encDoc_onSubmitClick";
                this._onCloseClickEvent = "encDoc_onCloseClick";

                //****************** Call BASE constructor ********************
                ConsultationDialog.call(this, opt, displayOpt);
                this.isRepeat = false;

                this.durationPeriodTypes = function () {
                    var periods = [];
                    serviceDurations.forEach(function (el) {
                        periods.push({
                            value: el,
                            text: el
                        });
                    });
                    return new kendo.data.DataSource({
                        data: periods
                    });
                };

                var modifyEncounterConcern = function (concern) {
                    return {
                        isPrimary: concern.isPrimary,
                        description: concern.customCode.description
                    };
                };

                this._isAffectSeries = function () {
                    return false;
                };

                this._initEvents = function() {
                    scope = this;
                    $eventAggregator.subscriber(events.serviceTypesLoaded, function() {
                        serviceDurations = [];
                        scope.serviceTypesSource.data().forEach(function(item) {
                            serviceDurations.push(item.appointmentLengthMinutes);
                        });
                        serviceDurations.sort(function(item1, item2) {
                            return item1 < item2 ? -1 : 1;
                        });
                        serviceDurations = serviceDurations.filter(function(item, index) {
                            return serviceDurations.indexOf(item) === index;
                        });
                        scope.trigger("change", { field: "durationPeriodTypes" });
                    });
                    $eventAggregator.subscriber(events.serviceTypeChanged, function() {
                        var selectedServiceType = scope.serviceTypesSource.data().find(function(serviceType) {
                            return serviceType.serviceTypeId === scope.serviceTypeId;
                        });
                        if (selectedServiceType) {
                            scope.set("durationPeriod", selectedServiceType.appointmentLengthMinutes);
                            scope.vm_onChangeDuration();
                        }
                    });
                };

                this._getOptionsForConcreteEventType = function () {
                    var concerns = [];
                    if (this.primaryConcern) {
                        concerns.push(modifyEncounterConcern(this.primaryConcern));
                    }

                    if (this.secondaryConcern) {
                        concerns.push(modifyEncounterConcern(this.secondaryConcern));
                    }

                    var patient = this.patientsSelector.getSelectedItem();
                    var patientId = patient ? patient.id : null;

                    return {
                        end: this.end,
                        patientId: patientId,
                        soapNote: {
                            subjective: this.subjective,
                            objective: this.objective,
                            assessment: this.assessment,
                            plan: this.plan
                        },
                        phoneNumber: this.phoneNumber,
                        phoneType: this.phoneType,
                        serviceTypeId: this.serviceTypeId,
                        additionalNotes: this.additionalNotes,
                        encounterTypeCode: this.encounterTypeCode,
                        concerns: concerns,
                        medicalCodesIds: codesToArray(this.cptCodesSelector.getSelectedItems()).concat(codesToArray(this.icdCodesSelector.getSelectedItems())),
                        timeZoneId: this.timeZoneId,
                        startInCurrentUserTimezone: this.startInCurrentUserTimezone,
                        endInCurrentUserTimezone: this.endInCurrentUserTimezone,
                        zonedStart: this.zonedStart,
                        zonedEnd: this.zonedEnd
                    };
                };

                this._calculateEndTime = function () {
                    var duration = this.durationPeriod || this._defaultInterval;
                    var startCopy = new Date(this.start);
                    this.end = new Date(startCopy.setMinutes(startCopy.getMinutes() + duration));
                };

                this._validateTimeDetails = function (currentUserTime) {
                    var errorList = [];
                    var startTime = this.startInCurrentUserTimezone || this.start;
                    // set a 0.5 hour block in the past padding
                    if (currentUserTime < startTime) {
                        errorList.push("Consultation start time should not be in the future.");
                        this.set("vm_startDateError", true);
                        this.set("vm_isSelectedStartDate", false);
                    }
                    return errorList;
                };

                this._deepValidateDetails = function () {
                    var errorList = [];
                    if (!(/^[0-9]*$/.test(this.durationPeriod) && this.durationPeriod > 0 && this.durationPeriod < 1441)) {
                        errorList.push("Please enter an appointment time between 1 and 1440 minutes (24hrs).");
                        this.set("vm_durationPeriodError", true);
                        this.set("vm_durationPeriodActive", false);
                    }
                    return errorList;
                };

                this.saveAll = function () {
                    return $eventService.saveEncounterDocument(this.getOptions());
                };

                this.vm_backClick = function(){
                    this.set("vm_isNext", false);
                };

                this.vm_expandSubjective = function () {
                    this.set("vm_isSubjectiveExpanded", !this.vm_isSubjectiveExpanded);
                };

                this.vm_expandObjective = function () {
                    this.set("vm_isObjectiveExpanded", !this.vm_isObjectiveExpanded);
                };

                this.vm_expandAssessment = function () {
                    this.set("vm_isAssessmentExpanded", !this.vm_isAssessmentExpanded);
                };

                this.vm_expandPlan = function () {
                    this.set("vm_isPlanExpanded", !this.vm_isPlanExpanded);
                };

                this.vm_onChangeDuration = function () {
                    // test for non digits and set error flag
                    if (/^[0-9]*$/.test(this.durationPeriod) && this.durationPeriod > 0 && this.durationPeriod < 1441) {
                        this.set("vm_durationPeriodError", false);
                        this.set("vm_durationPeriodActive", this.durationPeriod !== null);
                        this._calculateEndTime();
                        this._updateSelectorTime(true);
                    }
                    else {
                        this.set("vm_durationPeriodError", true);
                    }
                };

                this.vm_onNextClick = function (e) {
                    var that = this;

                    if (this.isLoading) {
                        e.preventDefault();
                        return false;
                    }
                    this._convertInputTimeToCurrentUserTimezone().done(function () {
                        var errors = that.validate();
                        that.validateTime().done(function (timeErrors) {
                            errors = errors.concat(timeErrors);
                            if (errors.length === 0) {
                                that.set("isError", false);
                                $snapNotification.hideAllConfirmations();
                                that.set("vm_isNext", true);
                            } else {
                                $snapNotification.error(errors.join("<br\>"));
                                that.set("isError", true);
                            }
                        });
                    });
                };


                this._deepLoadDetails = function() {
                    scope = this;
                    
                    // need init it in this way because kendo noDataTemplate does not work
                    var cptCodesInput = $("input", "#cptCodesSelector");
                    var cptAutoComplete = cptCodesInput.data("kendoAutoComplete");
                    if (cptAutoComplete) {
                        scope.cptCodesSelector.initNoDataMessage(cptAutoComplete);
                    }

                    var icdCodesInput = $("input", "#icdCodesSelector");
                    var icdAutoComplete = icdCodesInput.data("kendoAutoComplete");
                    if (icdAutoComplete) {
                        scope.icdCodesSelector.initNoDataMessage(icdAutoComplete);
                    }
                };

                this._initCodes = function() {
                    var medicalCodesUrl = "/api/v2/physicians/medicalcodes";

                    var dataReadCptFilter = function (filter) {
                        return {
                            descriptionFilter: filter.filters[0].value, 
                            medicalSystem: "CPT"
                        };
                    };
                    var dataReadIcdFilter = function (filter) {
                        return {
                            descriptionFilter: filter.filters[0].value, 
                            medicalSystem: diagnosticCodingSystem
                        };
                    };

                    function MedicalCode (item, unselectHandler) {
                        this.id = item.id;
                        this.text = item.text;
                        this.data = item;
                        this.vm_onUnselectClick = function() {
                            unselectHandler(this);
                        };
                    }

                    this.cptCodesSelector = $multiselectControl.createNew({
                        constructor: MedicalCode
                    });
                    this.icdCodesSelector = $multiselectControl.createNew({
                        constructor: MedicalCode
                    });

                    this.cptCodesSelector.createFilteringDataSource(medicalCodesUrl, "id", dataReadCptFilter);
                    this.icdCodesSelector.createFilteringDataSource(medicalCodesUrl, "id", dataReadIcdFilter);
                };

                var codesToArray = function (codes) {
                    var result = [];
                    codes.forEach(function(code) {
                        result.push(code.id);
                    });
                    return result;
                };

                this._initCodes();
            }

            this.createAvailabilityBlock = function (opt, displayOpt) {
                var object = $.extend(true, {}, emptyAvailabilityBlock, opt);

                displayOpt = $.extend(true, {}, defaultDisplayOptions, displayOpt);

                return new AvailabilityBlock(object, displayOpt);
            };

            this.isAvailabilityBlock = function (obj) {
                return obj instanceof AvailabilityBlock;
            };

            this.createAppointment = function (opt, displayOpt) {
                var object = $.extend(true, {}, emptyAppointment, opt);
                displayOpt = $.extend(true, {}, defaultDisplayOptions, displayOpt);

                return new Appointment(object, displayOpt);
            };

            this.createDocumentEncounter = function (opt, displayOpt) {
                var object = $.extend(true, {}, emptyEncounterDocument, opt);
                displayOpt = $.extend(true, {}, defaultDisplayOptions, displayOpt);

                return new DocumentEncounter(object, displayOpt);
            };

            this.isAppointment = function (obj) {
                return obj instanceof Appointment;
            };
        }).singleton();

}(jQuery, snap, kendo));

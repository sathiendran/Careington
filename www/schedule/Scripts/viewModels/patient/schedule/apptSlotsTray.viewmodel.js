//@ sourceURL=apptSlotsTray.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.EventAggregator", "snap.admin.schedule.TimeUtils", "snap.service.userService", "snap.patient.schedule.patientSelfSchedulingHub"])
        .define("apptsSlotsTray", function ($snapNotification, $eventAggregator, $timeUtils, $userService, $patientSelfSchedulingHub) {
            var defaultCard = {
                slots: []
            };

            var Singleton = (function () {
                var currentUserTime = null;

                getTime();
                setInterval(function() {
                    getTime();
                }, 60000);

                function getTime() {
                    var dfd = $.Deferred();

                    $userService.getUserCurrentTime().done(function(response) {
                        currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                        dfd.resolve();
                    }).fail(function(){
                        $snapNotification.error("Can not get current user time");
                    });

                    return dfd.promise();
                }

                return {
                    getCurrentTime: function () {
                        if(currentUserTime === null) {
                            window.console.error("currentUserTime is null");
                        }

                        return new Date(currentUserTime);
                    },

                    getCurrentDate: function () {
                        var currentDate = this.getCurrentTime();
                        currentDate.setHours(0, 0, 0, 0);

                        return currentDate;
                    },
                };
            })();

           function Tray(clinicianCard, scheduleDate, slotClickCallback) { 

                // if(!$patientSelfSchedulingHub.isHubInitiated()) {
                //     $patientSelfSchedulingHub.init();    
                // }
                
                // $patientSelfSchedulingHub.on("lockSlot", function (data, from, to) { 
                //     //window.console.log("lockSlot:" + data + " time: " + from );
                // });

                // $patientSelfSchedulingHub.on("unlockSlot", function (data, from, to) { 
                //     //window.console.log("unlockSlot:" + data + " time: " + from );
                // });

                // $patientSelfSchedulingHub.on("bookSlot", function (data, from, to) { 
                //     //window.console.log("bookSlot:" + data + " time: " + from );
                // });

                // if(!$patientSelfSchedulingHub.isHubInitiated()) { 
                //     $patientSelfSchedulingHub.start(
                //         snap.userSession.token,
                //         snap.profileSession.timeZone,
                //         scheduleDate);
                // }
                


                this.userSelectedDate = new Date(scheduleDate);
                this.userSelectedDate.setHours(0, 0, 0, 0);

                var trayModel = this;

                this.userId = clinicianCard.userId;
                this.slots = clinicianCard.slots.map(function(s) {
                    return new Slot(s, clinicianCard.userId, trayModel.userSelectedDate, slotClickCallback);
                });

                this.vm_slots = function() {
                    var slots =  getFilteredSlots(this.slots, this.userSelectedDate);

                    if(slots.length > 0) {
                        var firstSlot = slots[0],
                            currentTime = Singleton.getCurrentTime(),
                            halfOfApptDuration = getHalfOfAppointmentDuration(),
                            nowStart = new Date(firstSlot.from.getTime() - halfOfApptDuration * 60000),
                            nowEnd = new Date(firstSlot.from.getTime() + halfOfApptDuration * 60000);
                        
                        firstSlot.isNow = nowStart < currentTime && currentTime < nowEnd;
                    }

                    var nextDay = getClosestNextSlotDate(this.slots);
                    if(nextDay) {
                        slots.push(kendo.observable(new NextSlot(this.userId, nextDay)));
                    }

                    return slots;
                };

                this.vm_isEmpty = function() {
                    return getFilteredSlots(this.slots, this.userSelectedDate).length === 0;
                };

                this.vm_onNextButtuonClick = function() {
                    snapInfo("Not implemented yet!!!");
                };

                this.vm_getNextApptSlotInfo = function() {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    if(nextDay) {
                        return "Next Self-Scheduling available <b>" + kendo.toString(nextDay, "MMMM dd, yyyy") + "</b>";
                    }

                    return "There is no slots for Self-Scheduling";
                };

                this.vm_goToNextDate = function() {
                    snapInfo("Not implemented yet");
                };

                function getFilteredSlots(slots, userSelectedDate) {
                    var currentTime = Singleton.getCurrentTime();

                    return slots.filter(function(slot) {
                        return isSlotHasRightTime(slot, currentTime, userSelectedDate);
                    });
                }

                function getClosestNextSlotDate(slots) {
                    var currentDate = trayModel.userSelectedDate;

                    var dates = slots.filter(function(slot) {
                        var slotDate = new Date(slot.from);
                        slotDate.setHours(0, 0, 0, 0);

                        return slotDate > currentDate;
                    }).map(function(slot) {
                        return slot.from;
                    });

                    if(dates.length === 0) {
                        return null;
                    }

                    var minDate = new Date(Math.min.apply(null,dates)); 
                    minDate.setHours(0, 0, 0, 0);

                    return minDate;
                }

                function isSlotHasRightTime(slot, currentTime, userSelectedDate) {
                    var currentDate = new Date(currentTime);
                    currentDate.setHours(0, 0, 0, 0);

                    var slotDate = new Date(slot.from);
                    slotDate.setHours(0, 0, 0, 0);

                    if(userSelectedDate > currentDate) {
                        return userSelectedDate.getTime() === slotDate.getTime();

                    } else if(userSelectedDate.getTime() === currentDate.getTime()) {
                        var halfOfApptDuration = getHalfOfAppointmentDuration(),
                            maxTimeForSlotScheduling = new Date(slot.from.getTime() + halfOfApptDuration * 60000);

                        return userSelectedDate.getTime() === slotDate.getTime() && maxTimeForSlotScheduling > currentTime;
                    }

                    return false;
                }

                function getHalfOfAppointmentDuration() {
                    return Math.round(parseInt(snap.hospitalSettings.selfScheduledAppointmentDuration) / 2);
                }
            }

            function Slot(slot, clinicianUserId, userSelectedDate, slotClickCallback) {
                this.from = $timeUtils.dateFromSnapDateString(slot.from);
                this.to = $timeUtils.dateFromSnapDateString(slot.to);
                this.availabilityBlockId = slot.availabilityBlockId;

                this.vm_isInvisible = false;
                this.vm_onSlotClick = function () {
                    slotClickCallback({ clinicianId: clinicianUserId, start: new Date(this.from), end: new Date(this.to), availabilityBlockId: this.availabilityBlockId, isNow: this.isNow });
                    $eventAggregator.published("slotTray_slotClickCallback");
                };

                this.isNow = false;

                this.formatedTime = function() {
                    return this.isNow ? "Now" : kendo.toString(this.from, "t");
                };

                this.hide = function() {
                    this.set("vm_isInvisible", true);
                };

                this.show = function() {
                    this.set("vm_isInvisible", false);
                };
            }

            function NextSlot(userId, nextDate) {
                this.vm_isVisible = true;

                this.formatedTime = function() {
                    return "Next";
                };

                this.vm_onSlotClick = function () {
                    $eventAggregator.published("slotTray_goToDate", {
                        nextDate: nextDate,
                        userId: userId
                    });
                };
            }

            this.createTimeSlotsTray = function (clinicianCard, userSelectedDate, slotClickCallback) {
                var tray = $.extend(true, {}, defaultCard, clinicianCard);
                return kendo.observable(new Tray(tray, userSelectedDate, slotClickCallback || function(){}));
            };
        }).singleton();
}(jQuery, snap, kendo));
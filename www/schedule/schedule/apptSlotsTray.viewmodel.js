//@ sourceURL=apptSlotsTray.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.EventAggregator", "snap.common.timeUtils", "snap.service.userService"])
        .define("apptsSlotsTray", function ($snapNotification, $eventAggregator, $timeUtils, $userService) {
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

           function Tray(clinicianCard, scheduleDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                this.userSelectedDate = new Date(scheduleDate);
                this.userSelectedDate.setHours(0, 0, 0, 0);

                var trayModel = this;

                this.userId = clinicianCard.userId;
                this.slots = clinicianCard.slots.map(function(s) {
                    return new Slot(s, clinicianCard.userId, trayModel.userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock);
                });

                this.getSlots = function() {
                    return getFilteredSlots(this.slots, this.userSelectedDate);
                };

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

                this.vm_hasSlotsForRightNow = function() {
                    var slots = getFilteredSlots(this.slots, this.userSelectedDate).filter(function(slot) {
                        return slot.isNow && slot.vm_isInvisible === false;
                    });

                    return slots.length > 0;
                };

                this.hasSlotForNextDate = function() {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    return nextDay ? true : false;
                };

                // this.vm_onNextButtuonClick = function() {
                //     snapInfo("Not implemented yet!!!");
                // };
                var nxtappt = " Next available appointment on ";

                  var localizeCurrent = $('#localize-current').text();
                  console.log("lang "+localizeCurrent);
                    if(localizeCurrent == "Español") {
                        nxtappt = " Siguiente cita disponible en ";
                    }
                  else  if(localizeCurrent == "English (UK)") {
                    nxtappt = " Next available appointment on ";
                  }
                  else if (localizeCurrent == "English")   {
                      nxtappt = " Next available appointment on ";
                    }

                    $('#localize-langs').click(function() {
                      var isLang = $('#localize-langs .activated').text();
                        console.log("lang "+isLang);
                        if(isLang == "Español") {
                          nxtappt = " Siguiente cita disponible en ";
                        }
                       else  if(isLang == "English (UK)") {
                         nxtappt = " Next available appointment on "
                       }
                         else if (isLang == "English") {
                             nxtappt = " Next available appointment on "
                         }
                       });

                this.vm_getNextApptSlotInfo = function() {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    if(nextDay) {
                      // var nxtappt = " Next available appointment on ";
                      var nxtappext = "<b>"+ kendo.toString(nextDay, "MMMM dd, yyyy") +"</b>";
                      var nxtapptapnd = nxtappt + "<b>"+ nxtappext +"</b>";
                        // return "Next available appointment on <b>" + kendo.toString(nextDay, "MMMM dd, yyyy") + "</b>";
                        return nxtapptapnd;
                    }

                    return "There are no appoinments currently available";
                };

                // this.vm_goToNextDate = function() {
                //     snapInfo("Not implemented yet");
                // };

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

            function Slot(slot, clinicianUserId, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                this.from = $timeUtils.dateFromSnapDateString(slot.from);
                this.to = $timeUtils.dateFromSnapDateString(slot.to);
                this.availabilityBlockId = slot.availabilityBlockId;
                this.clinicianUserId = clinicianUserId;

                this.vm_isInvisible = false;
                this.vm_onSlotClick = function () {
                    var that = this;
                    if (this.isNow) {
                        if (kendo.support.mobileOS !== false) {
                          //  snap.openMobileApp("", function () {
                                slotClickCallback({ clinicianId: that.clinicianUserId, start: new Date(that.from), end: new Date(that.to), availabilityBlockId: that.availabilityBlockId, isNow: that.isNow });
                                $eventAggregator.published("slotTray_slotClickCallback");
                          //  });
                            return;
                        }

                    }
                    slotClickCallback({ clinicianId: this.clinicianUserId, start: new Date(this.from), end: new Date(this.to), availabilityBlockId: this.availabilityBlockId, isNow: this.isNow });
                    $eventAggregator.published("slotTray_slotClickCallback");
                };

                this.isNow = false;

                this.formatedTime = function () {
                    if (this.isNow) {
                        return "NOW"
                    } else {
                        var time = kendo.toString(this.from, "t").split(" ");
                        return time[0] + "<span class='drawer-card__timestamp'>"+ time[1] + "</span>"
                    }
                };

                this.hide = function() {
                    this.set("vm_isInvisible", true);

                    if(refreshCardOnSlotLockUnlock) {
                        refreshCardOnSlotLockUnlock();
                    }
                };

                this.show = function() {
                    this.set("vm_isInvisible", false);

                    if(refreshCardOnSlotLockUnlock) {
                        refreshCardOnSlotLockUnlock();
                    }
                };
            }

            function NextSlot(userId, nextDate) {
                this.vm_isVisible = true;

                this.formatedTime = function() {
                    return "NEXT";
                };

                this.vm_onSlotClick = function () {
                    $eventAggregator.published("slotTray_goToDate", {
                        nextDate: nextDate,
                        userId: userId
                    });
                };
            }

            this.createTimeSlotsTray = function (clinicianCard, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                var tray = $.extend(true, {}, defaultCard, clinicianCard);
                return kendo.observable(new Tray(tray, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock));
            };
        }).singleton();
}(jQuery, snap, kendo));

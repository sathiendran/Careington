(function($, snap) {
    "use strict";

    snap.namespace("snap.admin.schedule").use(["snapNotification", "snap.admin.schedule.TimeUtils"])
        .define("apptRuleProcessor", function($snapNotification, $timeUtils) {
            var repeatPeriodEnum = {
                daily: 0,
                weekly: 1
            };

            function EventPrototype(appt) {
                var proto = appt;

                this.clone = function () {
                    return $.extend(true, {}, proto);
                };
            }

            function daysBetween(first, second) {
                // Copy date parts of the timestamps, discarding the time parts.
                var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
                var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

                // Do the math.
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var millisBetween = two.getTime() - one.getTime();
                var days = millisBetween / millisecondsPerDay;

                // Round down.
                return Math.floor(days);
            }

            var shiftEventDate = function(event, newDate) {
                var days = daysBetween(event.start, newDate);

                event.start = $timeUtils.addDays(event.start, days);
                event.end = $timeUtils.addDays(event.end, days);

                event.startInCurrentUserTimezone = $timeUtils.addDays(event.startInCurrentUserTimezone, days);
                event.endInCurrentUserTimezone = $timeUtils.addDays(event.endInCurrentUserTimezone, days);
            };

            var repeatDaily = function(rule, eventPrototype) {
                var events = [],
                    day = new Date(rule.getFromDate()),
                    intervalCounter = rule.repeatInterval,
                    toDateWithOffset = new Date(rule.getToDate());

                while (day <= toDateWithOffset) {
                    if(intervalCounter % rule.repeatInterval === 0) {
                        var event = eventPrototype.clone();
                        shiftEventDate(event, day);
                        if (event.end <= toDateWithOffset) {
                            events.push(event);
                        }                
                    }

                    day = $timeUtils.addDays(day, 1);
                    intervalCounter++;
                }

                return events;
            };

            var repeatWeekly = function(rule, eventPrototype) {
                var events = [],
                    day =  new Date(rule.getFromDate()),
                    intervalCounter = rule.repeatInterval,
                    repeatDaysOfWeek = rule.repeatOn,
                    toDateWithOffset = new Date(rule.getToDate());
                

                //Ticket #5988 Repeating appointment should include today's date even if different repeat day.
                var event = eventPrototype.clone();
                if (repeatDaysOfWeek.indexOf(day.getDay() + 1) < 0) {
                    // if repeat days don't include start day
                    events.push(event);
                }
                
                while (day <= toDateWithOffset) {
                    if(repeatDaysOfWeek.indexOf(day.getDay() + 1) >= 0 && intervalCounter % rule.repeatInterval === 0) {
                        event = eventPrototype.clone();
                        shiftEventDate(event, day);
                        if (event.end <= toDateWithOffset) {
                            events.push(event);
                        } 
                    }

                    day = $timeUtils.addDays(day, 1);

                    if(day.getDay() === 0) { //getDay() method returns the day of the week (from 0 to 6). Sunday is 0
                        intervalCounter++;
                    }
                }
                
                return events;
            };

            var createEventsSeries = function(rule, event) {
                var eventPrototype = new EventPrototype(event);

                var series = [];
                switch (rule.repeatPeriod) {
                    case repeatPeriodEnum.daily:
                        series = repeatDaily(rule, eventPrototype);
                        break;
                    case repeatPeriodEnum.weekly:
                        series = repeatWeekly(rule, eventPrototype);
                        break;
                }

                return series;
            };

            this.createEventsSeries = function(prototype, rule) {
                // we need to change format in order to string-to-Date convertation work correctly in FireFox
                rule.fromDate = $timeUtils.extractDatePartFromSnapDateString(rule.fromDate);
                rule.toDate = $timeUtils.extractDatePartFromSnapDateString(rule.toDate);
                return createEventsSeries(rule, prototype);
            };
        }).singleton();
}(jQuery, snap));
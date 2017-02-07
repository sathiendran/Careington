﻿//@ sourceURL=timeUtils.js

(function($, snap) {
    "use strict";
snap.namespace("snap.admin.schedule").use([])
       .define("TimeUtils", function () {
            this.addDays = function (date, days) {
               var result = new Date(date);
               result.setDate(result.getDate() + days);
               return result;
            };

            this.addMinutes = function (date, minutes) {
               return new Date(date.getTime() + minutes * 60000);
            };

            /********************** SnapTime format: "2016-04-05T14:00:00+02:00" *********************************/
            this.extractDatePartFromSnapDateString = function (snapDateString) {
               return snapDateString.slice(0, 19) + "Z"; //we need 'Z' in order to have the same data in Chrome and FF.
            };

            this.dateFromSnapDateString = function (snapDateString) {
               var year = snapDateString.slice(0, 4);// - 1900;
               var month = snapDateString.slice(5, 7) - 1;
               var day = snapDateString.slice(8, 10);
               var hours = snapDateString.slice(11, 13);
               var min = snapDateString.slice(14, 16);
               return new Date(year, month, day, hours, min);
            };

            this.dateToString = function (snapDateObject) {
               var year = snapDateObject.getFullYear();
               var month =('0'+ (snapDateObject.getMonth() + 1)).slice(-2);
               var day = ('0' + snapDateObject.getDate()).slice(-2);
               var hours = ('0' + snapDateObject.getHours()).slice(-2); 
               var min = ('0' + snapDateObject.getMinutes()).slice(-2);
               return year+'-'+month+'-'+day+'T'+hours+':'+min;
            };

            this.parseTimeInterval = function(timeIntervalInSeconds) {
                // does the same job as parseInt truncates the float
                var hours = (timeIntervalInSeconds / 3600) | 0;
                var minutes = ((timeIntervalInSeconds % 3600) / 60) | 0;
                var seconds = (timeIntervalInSeconds % 60) | 0;

                return {
                    original: {
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                    },
                    formatted: {
                        hours: hours < 10 ? "0" + hours : hours,
                        minutes: minutes < 10 ? "0" + minutes : minutes,
                        seconds: seconds < 10 ? "0" + seconds : seconds,  
                    },
                    toString: function() {
                        return [this.formatted.hours, this.formatted.minutes, this.formatted.seconds].join(":");
                    }
                };
            };

       }).singleton();
}(jQuery, window.snap = window.snap || {}));
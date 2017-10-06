//@ sourceURL=timer.js

// This module represent simple timer which can be used in order to display count up or down timer.
// Timer separated from UI representation, so it possible customize output. 
(function ($, snap) {
    "use strict";

    snap.namespace("snap.common").use("snap.common.timeUtils")
        .define("timer", function ($timeUtils) {
            var defaultOptions = {
                countDown : false,  // Count timer up or down.
                time : 0,           // Time (the number of seconds) which will be shown in timer.
                onTimerTickCallback: null  // Timer tick callback.
            };

            function Timer(opt) {
                var start,
                    time = opt.time,
                    countDown = opt.countDown,
                    onTimerTickCallback = opt.onTimerTickCallback,
                    intervalID = null;

                function timer() {
                    // get the number of seconds that have pass since 
                    // startTimer() was called
                    var t = (((Date.now() - start) / 1000) | 0);
                    var diff =  countDown ? time - t : time + t;

                    if(onTimerTickCallback) {
                        onTimerTickCallback($timeUtils.parseTimeInterval(diff));    
                    }
                }    

                this.start = function() {
                    start = Date.now();

                    // we don't want to wait a full second before the timer starts
                    timer();
                    intervalID = setInterval(timer, 1000);
                };

                this.stop = function() {
                    if(intervalID !== null) {
                        clearInterval(intervalID);
                        intervalID = null;
                    }
                };

                this.setTime = function(newTime) {
                    this.stop();

                    time = newTime;
                };
            }
            
            this.createTimer  = function(options) {
                return new Timer($.extend({}, defaultOptions, options));
            };
        }).singleton();
}(jQuery, snap));
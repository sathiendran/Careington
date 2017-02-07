(function ($) {
    // shorten references to variables. this is better for uglification
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        countlist = [], timer, TIMEREND='timeend';
    var onTimerSec = function () {
        
        for (var i = 0; i < countlist.length; i++) {
            countlist[i].tick();
        }
        
        setTimeout(onTimerClear, 500);
    }
    var onTimerClear = function () {
        for (var i = 0; i < countlist.length; i++) {
            countlist[i].tickClear();
        }
    }

    var CounterDown = Widget.extend({
        // initialization code goes here
        _value: null,
        time:null,
        init: function (element, options) {
            var that = this;
            // base call to initialize widget
            Widget.fn.init.call(this, element, options);
            that.template = kendo.template(that.options.template);
            countlist.push(that);
            if (!timer) timer = setInterval(onTimerSec, 1000);
        },
        destroy: function () {
            var that = this;
            that.stop();
            Widget.fn.init.destroy(this);
        },
        _stop: function () {
            var that = this;
            countlist = $.grep(countlist, function (v) { return v != that });
            if (countlist.length == 0) {
                clearInterval(timer);
                timer = null;
            }
        },
        value: function (value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

             that._update(value);
        },
        getTimeParts: function (){
            var that = this;
            var t = Math.floor((that._value - new Date()) / 1000);
            if (t < 0) t = 0;
            var sec = t % 60;
            t = Math.floor(t / 60)
            var min = t % 60;
            t = Math.floor(t / 60)
            var hour = t;
            /*
            var next_sec = sec;
            var next_min = min;
            var next_hour = hour;
            next_sec--;
            if (next_sec < 0) {
                next_sec = 60;
                next_min--;
                if (next_min < 0) {
                    next_min = 60;
                    next_hour--;
                }
            }
            */
            return { hours: hour < 10 ? '0' + hour : hour, min: min < 10 ? '0' + min : min, sec: sec < 10 ? '0' + sec : sec };
        },
        _update: function(value){
            var that = this;

            that._value = new Date(value);
            that.time = that.getTimeParts();
            if (timer == null && (that.time.sec != 0 || that.time.min != 0 || that.time.hours != 0)) {
                that._restart();
            }
            that.refresh();

        },
        _restart: function() {
            countlist.push(this);
            if (!timer) timer = setInterval(onTimerSec, 1000);
        },
        tickClear: function(){
            var that = this;
           // that.element.find('.time').removeClass('flip');
            that.element.find('.hour .count ').text(that.time.hour);
            that.element.find('.min .count ').text(that.time.min);
            that.element.find('.sec .count').text(that.time.sec);
        },
        tick: function(){
            var that = this;
            var time = that.getTimeParts();
            if (time.hour != that.time.hour || time.min != that.time.min || time.sec != that.time.sec) {
                var part;

                if (time.hour != that.time.hours) {
                    part = that.element.find('.hour');
                    part.find('.curr').text(that.time.hours);
                    part.find('.next').text(time.hours);
                //    part.addClass('flip');
                } 

                if (time.min != that.time.min) {
                    part = that.element.find('.min');
                    part.find('.curr').text(that.time.min);
                    part.find('.next').text(time.min);
                //    part.addClass('flip');
                }
                if (time.sec != that.time.sec) {
                    part = that.element.find('.sec');
                    part.find('.curr').text(that.time.sec);
                    part.find('.next').text(time.sec);
                 //   part.addClass('flip');
                }
            }
            that.time = time;
            if (time.sec == 0 && time.min == 0 && time.hours == 0) {
                that.trigger(TIMEREND);
                that._stop();
            }

        },
        options: {
            name: "counterdown",
            template: '<div style="display: table-cell" class="time #= data.label# "><span class="count curr top">#= data.curr #</span></div>'
            //    + '<span class="count next top">#= data.curr #</span><span class="count next bottom">#= data.curr #</span>'
          //  + '<span class="count curr bottom">#= data.curr #</span></div>'
        },
        events: [
        TIMEREND
        ],
        refresh: function() {
            var that = this;
            var html = "";
            html = kendo.render(that.template, [{ label: 'hours', curr: that.time.hours }]) + '<div style="display: table-cell">:</div>';
            html += kendo.render(that.template, [{ label: 'min', curr: that.time.min }]) + '<div style="display: table-cell">:</div>';
            html += kendo.render(that.template, [{ label: 'sec', curr: that.time.sec}]);
            that.element.html(html);
            that.element.addClass('countdown-container');
        }
    });
    ui.plugin(CounterDown);
})(jQuery);
/// <reference path="app.js" />

var snap = snap || {};

kendo.data.binders.onEnterKey = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var that = this;
        $(that.element).on("keypress", function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                that.bindings["onEnterKey"].get();
                event.preventDefault();
            }
        });
    },
    refresh: function () {
        // Empty is intentional
    }
});

// Always adds new line on "Enter" key
kendo.data.binders.onEnterNewLine = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var that = this;
        $(that.element).on("keypress", function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                $(this).val( $(this).val() + "\n");
                event.preventDefault();
            }
        });
    },
    refresh: function () {
        // Empty is intentional
    }
});

// Adds new line on ctrl + enter, shift + enter
// On single "Enter" clicking invokes binding
kendo.data.binders.onEnterKeyMultiline = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var that = this;
        $(that.element).on("keypress", function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == 13 || keycode == 10) {
                if (event.shiftKey || event.ctrlKey) {
                    // ctrl + enter, shift + enter
                    $(this).val( $(this).val() + "\n");
                } else {
                    that.bindings["onEnterKeyMultiline"].get();
                }
                event.preventDefault();
            }
        });
    },
    refresh: function () {
        // Empty is intentional
    }
});

kendo.data.binders.geoAddressInput = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        var that = this;
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        try{
            var autocomplete = new google.maps.places.Autocomplete(element);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace().formatted_address;
                if (place) {
                    var commaIndex = place.indexOf(",");
                    var address = place.substring(0, commaIndex + 1) + "\n" + place.substring(commaIndex + 1, place.length + 1);
                    element.value = address;

                    that.change(address);
                }
            });
        } catch (ex) {
            console && console.log(ex);
        }
    },
    change: function(address) {
        this.bindings["value"].set(address); //update the View-Model
    },

    refresh: function () {
        // Empty is intentional
    }
});


kendo.data.binders.class = kendo.data.Binder.extend({
    init: function (target, bindings, options) {
        kendo.data.Binder.fn.init.call(this, target, bindings, options);

        // get list of class names from our complex binding path object
        this._lookups = [];
        for (var key in this.bindings.class.path) {
            if (this.bindings.class.path.hasOwnProperty(key)) {
                this._lookups.push({
                    key: key,
                    path: this.bindings.class.path[key]
                });
            }
        }
    },

    refresh: function () {
        var lookup,
        value;

        for (var i = 0; i < this._lookups.length; i++) {
            lookup = this._lookups[i];

            // set the binder's path to the one for this lookup,
            // because this is what .get() acts on.
            this.bindings.class.path = lookup.path;
            value = this.bindings.class.get();

            // add or remove CSS class based on if value is truthy
            if (value) {
                $(this.element).addClass(lookup.key);
            } else {
                $(this.element).removeClass(lookup.key);
            }
        }
    }
});


kendo.data.binders.rmclass = kendo.data.Binder.extend({
    init: function (target, bindings, options) {
        kendo.data.Binder.fn.init.call(this, target, bindings, options);

        // get list of class names from our complex binding path object
        this._lookups = [];
        for (var key in this.bindings.rmclass.path) {
            if (this.bindings.rmclass.path.hasOwnProperty(key)) {
                this._lookups.push({
                    key: key,
                    path: this.bindings.rmclass.path[key]
                });
            }
        }
    },

    refresh: function () {
        var lookup,
        value;

        for (var i = 0; i < this._lookups.length; i++) {
            lookup = this._lookups[i];

            // set the binder's path to the one for this lookup,
            // because this is what .get() acts on.
            this.bindings.rmclass.path = lookup.path;
            value = this.bindings.rmclass.get();

            // add or remove CSS class based on if value is truthy
            if (!value) {
                $(this.element).addClass(lookup.key);
            } else {
                $(this.element).removeClass(lookup.key);
            }
        }
    }
});


kendo.data.binders.snapDateTime = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var data = this.bindings["snapDateTime"].get();
        if (data) {
            var dateObj = new Date(data);
            $(this.element).text(SnapDateTime1(dateObj));
        }
    }
});
kendo.data.binders.snapDateTimeShort = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var data = this.bindings["snapDateTimeShort"].get();
        if (data) {
            var dateObj = new Date(data);
            $(this.element).text(SnapDateTimeShort(dateObj));
        }
    }
});
kendo.data.binders.snapDate1 = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var data = this.bindings["snapDate1"].get();
        if (data) {
            var dateObj = new Date(data);
            $(this.element).text(formatJSONDate1(dateObj));
        }
    }
});
kendo.data.binders.snapDateShort = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var data = this.bindings["snapDateShort"].get();
        if (data) {
            var dateObj = new Date(data);
            $(this.element).text(formatJSONDateShort(dateObj));
        }
    }
});
kendo.data.binders.widget.max = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        //call the base constructor
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
    },
    refresh: function () {
        var that = this,
        value = that.bindings["max"].get(); //get the value from the View-Model
        $(that.element).data("kendoDatePicker").max(value); //update the widget
    }
});

kendo.data.binders.widget.min = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        //call the base constructor
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
    },
    refresh: function () {
        var that = this,
        value = that.bindings["min"].get(); //get the value from the View-Model
        $(that.element).data("kendoDatePicker").min(value); //update the widget
    }
});

kendo.data.binders.ageString = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var data = this.bindings["ageString"].get();
        if (data) {
            $(this.element).text(snap.getAgeString(data));
        }
    }
});

kendo.data.binders.slide = kendo.data.Binder.extend( {
    refresh: function() {
        var value = this.bindings["slide"].get();
        var speed = $(this.element).data("slide-speed") || 400;

        if (value) {
            $(this.element).slideDown(speed);
        } else {
            $(this.element).slideUp(speed);
        }
    }
});

 kendo.data.binders.fade = kendo.data.Binder.extend({
    refresh: function () {
        var value = this.bindings["fade"].get();
        var speed = $(this.element).data("fade-speed") || 400;

        if (value) {
            $(this.element).fadeIn(speed);
        } else {
            $(this.element).fadeOut(speed);
        }
    }
});
 kendo.data.binders.snapPhoneNumber = kendo.data.Binder.extend({
     init: function (element, bindings, options) {
         kendo.data.Binder.fn.init.call(this, element, bindings, options);
     },
     refresh: function () {
         var data = this.bindings["snapPhoneNumber"].get();
         if (data) {
             if (this.element.tagName.toLowerCase() == "input")
                 this.element.value = snap.formatPhoneNumber(data);
             else
                $(this.element).text(snap.formatPhoneNumber(data));
         }
     }
 });

(function($) {

    // shorten references to variables. this is better for uglification var kendo = window.kendo,
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
    autocomplete = "";

    var googlePlaces = kendo.ui.Widget.extend({

        init: function(element, options) {
            var that = this;

            // base call to widget initialization
            Widget.fn.init.call(this, element, options);

            autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });

            this._blurHandler = $.proxy(this._blur, this);
            this._focusHandler = $.proxy(this._focus, this);

            this.element.on("focus", this._focusHandler);
            this.element.on("blur", this._blurHandler);


        },

        options: {
            // the name is what it will appear as off the kendo namespace(i.e. kendo.ui.MyWidget).
            // The jQuery plugin would be jQuery.fn.kendoMyWidget.
            name: "googleplaces"

        },

        _focus: function () {
            this.trigger("change");
        },

        _change: function () {
            this.trigger("change");
            
        },

        _blur: function () {
            this.trigger("change");            
        },

        value: function (value) {
            var that = this;

            if (value !== undefined) {
                autocomplete.addListener('place_changed', function () {
                    var place = autocomplete.getPlace().formatted_address;
                    if (place) {
                        that.element.val(place);
                    }  
                });
            } else {
                return this.element.val();
            }
        },

        destroy: function () {
            this.element.off("focus", this._focus);
        }

        });

    ui.plugin(googlePlaces);

})(jQuery);
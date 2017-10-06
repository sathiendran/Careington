
/** @namespace */
snap.string = (function () {

    'use strict';

    return {
        /**
         * @method format
         * @public
         * @description format string behaves like ASP String.Format
         * @memberof snap.string
         * @param {string} string -  String to be formatted
         * @param {string} values - values to be insterted
         * @returns {string} formatted string
         * @example 
         * //returns "Hello World"
         * snap.string.format('{0} {1}', 'Hello', 'World');
         */
        format: function () {
            var args = Array.prototype.slice.call(arguments), //convert arguments into a js array
                str = args.shift(); //first argument is the string, rest are placeholders

            for (var i = 0, l = args.length; i < l; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                str = str.replace(regexp, args[i]);
            }

            return str;
        },
        formatURIComponents: function () {
            var args = Array.prototype.slice.call(arguments), //convert arguments into a js array
                str = args.shift(); //first argument is the string, rest are placeholders
            for (var i = 0, l = args.length; i < l; i++) {
                if (isEmpty(args[i])) {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    str = str.replace(regexp, '%27%27');
                }
                else {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    str = str.replace(regexp, encodeURIComponent(args[i]));
                }
            }

            return str;
        },
        formatUSPhone: function (phoneNum) {
            var displayph = phoneNum.replace(/[^0-9]/g, '');
            displayph = displayph.replace(/^1/, '');
            if (displayph.length === 10) {
                displayph = displayph.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                return displayph;
            }
            return phoneNum;
        },
        formatHtml: function () {
            var args = Array.prototype.slice.call(arguments), //convert arguments into a js array
                str = args.shift(); //first argument is the string, rest are placeholders

            for (var i = 0, l = args.length; i < l; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                str = str.replace(regexp, $('<div/>').text(args[i]).html());
            }

            return str;
        },
        formatString: function () {
            var pattern = /\{([^\{\}]*)\}/g;
            var values = Array.prototype.slice.call(arguments), //convert arguments into a js array
                    template = values.shift(); //first argument is the string, rest are placeholders

            if ($.isPlainObject(arguments[1])) {
                values = arguments[1];
            }
            return template.replace(pattern, function (a, b) {
                var p = b.split('.'),
                    r = values;
                try {
                    for (var s = 0, l = p.length; s < l; s++) {
                        r = r[p[s]];
                    }
                } catch (e) {
                    r = a;
                }
                return (typeof r === 'string' || typeof r === 'number') ? r : a;
            });
        },

        /**
         * @method template
         * @public
         * @description formats string template with values
         * @memberof snap.string
         * @param {string} tmpl -  template to be formatted
         * @param {object} values - values in object literal format
         * @returns {string} formatted template
         * @example 
         * //returns &lt;div id="User_1">John Smith&lt;/div>
         * snap.string.template('$lt;div id="User_{id}">{firstName} {lastName}&lt;/div>', {id: 1, firstName:'John', lastName: 'Smith'});
         */
        template: function (tmpl, obj) {
            if (typeof obj !== 'object') {
                return tmpl;
            }
            for (var propertyName in obj) {
                if (typeof obj[propertyName] !== "function") {
                    var re = new RegExp('{' + propertyName + '}', 'gm');
                    tmpl = tmpl.replace(re, obj[propertyName]);
                }
            }

            return tmpl;
        },
        /** 
         * @method getPagePath
         * @public
         * @description returns page path for a named service
         * @memberof snap.string
         * @param {string} page - name of page
         * @returns {string} path - path of service 
         * @example 
         * //returns /patient/PatientService.asmx
         * snap.string.getPagePath('CustomerPage');
         */
        getPagePath: function (page) {
            return snap.paths[page] || '';
        }
    };
}());

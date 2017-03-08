//This is to replace snapValidations.js
// TODO: more validation rules, unit test and docs, returning localized messages 
// ReSharper disable CoercedEqualsUsing
snap.validate = (function () {
    'use strict';
    
    var validators = {
        email: snap.regExMail,
        password: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s\n\r]{8,20})$/,
        creditcard: function(value, type) {
            var cardinfo = {
                'mc':'5[1-5][0-9]{14}',
                'ec':'5[1-5][0-9]{14}',
                'vi':'4(?:[0-9]{12}|[0-9]{15})',
                'ax':'3[47][0-9]{13}',
                'dc':'3(?:0[0-5][0-9]{11}|[68][0-9]{12})',
                'bl':'3(?:0[0-5][0-9]{11}|[68][0-9]{12})',
                'di':'6011[0-9]{12}',
                'jcb':'(?:3[0-9]{15}|(2131|1800)[0-9]{11})',
                'er':'2(?:014|149)[0-9]{11}'
            }, results = [];
                
            value = value.replace(/[- ]/g,''); //ignore dashes and whitespaces

            /* we know the type */
            if(type){
                var expr = '^' + cardinfo[type.toLowerCase()] + '$';
                // convert to bool
                return !!value.match(expr);
            }
            
            for (var p in cardinfo) {
                if (cardinfo.hasOwnProperty(p)) {
                    if (value.match('^' + cardinfo[p] + '$')) {
                        results.push(p);
                    }
                }
            }

            return results.length ? results.join('|') : false; // String | boolean
        }
    };

    return {
        email: function (inputEmail) {
            return validators.email.test(inputEmail);
        },
        password: function (inputPass) {
            return validators.password.test(inputPass);
        },
        date: function (inputDate) {
            return new Date(inputDate) != 'Invalid Date';
        }, 
        creditcard: function(cardno, type) {
            return validators.creditcard(cardno, type);
        }
    };
}());


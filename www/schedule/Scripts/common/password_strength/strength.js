(function ( $, window, document, undefined ) {
    var pluginName = "strength",
        defaults = {
            strengthClass: 'strength',
            strengthMeterClass: 'strength_meter',
            strengthButtonClass: 'button_strength',
            strengthButtonText: 'Show Password',
            strengthButtonTextToggle: 'Hide Password'
        };

    var upperCase = new RegExp('[A-Z]');
    var lowerCase = new RegExp('[a-z]');
    var numbers = new RegExp('[0-9]');
    var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

    function check_strength(thisval, thisid) {
        var characters = (thisval.length >= 8);
        var capitalletters = thisval.match(upperCase) ? 1 : 0;
        var loweletters = thisval.match(lowerCase) ? 1 : 0;
        var number = thisval.match(numbers) ? 1 : 0;
        var containWhiteSpace = thisval.indexOf(' ') >= 0 ? 1 : 0;

        var total = characters + capitalletters + loweletters + number;
        if (thisid.indexOf('NoText') >= 0)
            update_indicatorNoText(total, thisid); 
        else
            update_indicatorNoText(total, thisid); //temporary
        update_info('length_'  + thisid, thisval.length >= 8 && thisval.length <= 20);
        update_info('capital_' + thisid, capitalletters);
        update_info('smallLetter_' + thisid, loweletters);
        update_info('number_' + thisid, number);
        update_info('letter_' + thisid, !containWhiteSpace);
        
    }

    function update_indicator(total, thisid) {
        var thismeter = $('div[data-meter="' + thisid + '"]');

        if (total === 0) {
            thismeter.removeClass().html('');
        } else if (total === 1) {
            thismeter.removeClass();
            thismeter.addClass('veryweak').html('<p>very weak</p>');
        } else if (total === 2) {
            thismeter.removeClass();
            thismeter.addClass('weak').html('<p>weak</p>');
        } else if (total === 3) {
            thismeter.removeClass();
            thismeter.addClass('medium').html('<p>medium</p>');
        } else {
            thismeter.removeClass();
            thismeter.addClass('strong').html('<p>strong</p>');
        }
    }

    function update_indicatorNoText(total, thisid) {
        var thismeter = $('div[data-meter="' + thisid + '"]');

        if (total === 0) {
            thismeter.removeClass().html('');
        } else if (total === 1) {
            thismeter.removeClass();
            thismeter.addClass('veryweak').html('');
        } else if (total === 2) {
            thismeter.removeClass();
            thismeter.addClass('weak').html('');
        } else if (total === 3) {
            thismeter.removeClass();
            thismeter.addClass('medium').html('');
        } else {
            thismeter.removeClass();
            thismeter.addClass('strong').html('');
        }
    }

    function update_info(id, isValid) {
        id = '#' + id;

        if (isValid) {
            $(id).removeClass('invalid').addClass('valid');
        } else {
            $(id).removeClass('valid').addClass('invalid');
        }
    }

    function bind_events($s, $t, thisid) {
        $s.bind('keyup', function () {
            var thisval = $s.val();
            $t.val(thisval);
            $t.trigger('change');
            check_strength(thisval, thisid);
        }).focus(function () {
            $('#pswd_info_' + thisid).show();
        }).blur(function () {
            $('#pswd_info_' + thisid).hide();
        });
    }

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var isShown = false;
            var strengthButtonText = this.options.strengthButtonText;
            var strengthButtonTextToggle = this.options.strengthButtonTextToggle;
            var thisid = this.$elem.attr('id');

            this.$elem.addClass(this.options.strengthClass).attr('data-password', thisid).after('<input style="display:none" class="' + this.options.strengthClass + '" data-password="' + thisid + '" type="text" name="" value=""><a data-password-button="' + thisid + '" id="_b' + thisid + '" href="" class="' + this.options.strengthButtonClass + '">' + this.options.strengthButtonText + '</a><div class="' + this.options.strengthMeterClass + '"><div data-meter="' + thisid + '"><p></p></div></div>')
                .after(
    '<div id="pswd_info_' + thisid + '" class="pswd_info" style="display: none;"> \
		<h4>Password must include:</h4> \
		<ul> \
			<li id="length_'  + thisid + '" class="invalid"><span class="icon_checkmark"></span><span class="icon_cross"></span>8-20 <strong>characters</strong></li> \
			<li id="capital_' + thisid + '" class="invalid"><span class="icon_checkmark"></span><span class="icon_cross"></span>At least <strong>one capital letter</strong></li> \
			<li id="smallLetter_' + thisid + '" class="invalid"><span class="icon_checkmark"></span><span class="icon_cross"></span>At least <strong>one lowercase letter</strong></li> \
            <li id="number_' + thisid + '" class="invalid"><span class="icon_checkmark"></span><span class="icon_cross"></span>At least <strong>one number</strong></li> \
			<li id="letter_' + thisid + '" class="invalid"><span class="icon_checkmark"></span><span class="icon_cross"></span>No spaces</li> \
		</ul> \
	</div>');

            var $textInput = $('input[type="text"][data-password="' + thisid + '"]');
            var $passwordInput = this.$elem;
            bind_events($passwordInput, $textInput, thisid);
            bind_events($textInput, $passwordInput, thisid);

            if (window.PreventIvalidSymbolsInPasswordOrEmail && typeof (window.PreventIvalidSymbolsInPasswordOrEmail) == "function") {
                window.PreventIvalidSymbolsInPasswordOrEmail($passwordInput);
                window.PreventIvalidSymbolsInPasswordOrEmail($textInput);
            }

            $(document.body).on('click', '#_b' + thisid, function (e) {
                e.preventDefault();

                var thisclass = 'hide_'+$(this).attr('class');

                if (isShown) {
                    $textInput.hide();
                    $passwordInput.show().focus();
                    $('a[data-password-button="' + thisid + '"]').removeClass(thisclass).html(strengthButtonText);
                    isShown = false;
                } else {
                    //$('input[type="text"][data-password="' + thisid + '"]').show().focus();
                    $textInput.show().focus();
                    //$('input[type="password"][data-password="' + thisid + '"]').hide();
                    $passwordInput.hide();
                    $('a[data-password-button="' + thisid + '"]').addClass(thisclass).html(strengthButtonTextToggle);
                    isShown = true;
                }
            });            
        },

        isPasswordMatchAllRequrements: function() {
            var password = this.$elem.val();

            var characters = password.length >= 8 && password.length <= 20;
            var capitalletters =upperCase.test(password);
            var loweletters = lowerCase.test(password);
            var number = numbers.test(password);
            var containWhiteSpace = password.indexOf(' ') >= 0;

            return characters && capitalletters && loweletters && number && !containWhiteSpace;
        },

        clearPassword: function () {
            var $textInput = $('input[type="text"][data-password="' + this.$elem.attr('id') + '"]');
            var $passwordInput = this.$elem;

            $textInput.val("");
            $passwordInput.val("");

            check_strength("", this.$elem.attr('id'));
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );



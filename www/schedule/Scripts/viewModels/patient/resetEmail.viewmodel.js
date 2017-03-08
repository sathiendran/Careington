;(function(global) {
    var app = global.app = global.app || {};

    function emailResetViewModel() {
        var self = this;
        self.token = '';
        self.newEmail = '';

        self.overlayDialog = function () {
            var
                dialog = $('<div></div>').load('/Content/OverlayDialog/ResetEmail.html' + snap.addVersion, function () {
                    //confirmation events
                    $(this).find('div[id=sectionConfirm] button[id=btnYes]').click(function() {
                        self.resetEmail();
                    });
                    $(this).find('div[id=sectionConfirm] button[id=btnNo]').click(function() {
                        self.cancelToken();
                    });             
                    
                    //message events
                    $(this).find('div[id=sectionMessage] button[id=btnOk]').click(function () {
                        hide();
                    });
                }),
                hideAllSection = function() {
                    $(dialog).find('div.dialog-section').each(function() {
                        $(this).hide();
                    });
                },
                hide = function() {
                    dialog.fadeOut(300);
                },
                progress = function() {
                    hideAllSection();
                    $(dialog).find('div[id=sectionProgress]').show();
                },
                confirm = function (msg) {
                    hideAllSection();
                    $(dialog).find('div[id=sectionConfirm] p[id=message]').html(msg);
                    $(dialog).find('div[id=sectionConfirm]').show();
                    $('body').append($(dialog));
                },
                message = function (msg) {
                    hideAllSection();
                    $(dialog).find('div[id=sectionMessage] p[id=message]').html(msg);
                    $(dialog).find('div[id=sectionMessage]').show();
                    $('body').append(dialog);
                };

            return {
                hide: hide,
                progress: progress,
                confirm: confirm,
                message: message
            };
        }();

        self.resetEmail = function () {
            self.overlayDialog.progress();
            $.ajax({
                type: "POST",
                url: '/api/patients/ResetEmailForUserToken/' + self.token,
                dataType: "json",
                success: function (response) {
                    self.overlayDialog.message('Your email has been updated as requested. Try your new login ...');
                    $('#txtloginemail').val(self.newEmail).trigger('change');
                    $('#txtPassword').focus();
                },
                error: function () {
                    self.overlayDialog.hide();
                    snapError("error");
                }
            });
        };

        self.cancelToken = function () {
            self.overlayDialog.progress();
            return $.ajax({
                type: "POST",
                url: '/api/patients/cancleEmailResetUserToken/' + self.token,
                dataType: "json",
                success: function() {
                    self.overlayDialog.message('The email change request has been canceled. Try your last used login ...');
                },
                error: function () {
                    self.overlayDialog.hide();
                    snapError("error");
                }
            });
        };

        self.getEmail = function() {
            $.ajax({
                type: "GET",
                url: '/api/patients/getNewEmailForUserToken/' + self.token,
                dataType: "json",
                success: function (response) {
                    self.newEmail = response;
                    if (self.newEmail != '') {
                        var msg = "Do you want to apply <b>" + self.newEmail + "</b> as your new email and login ?";
                        self.overlayDialog.confirm(msg);
                    } else {
                        var msg = "This email reset token is already been used. Try your last used login ...";
                        self.overlayDialog.message(msg);
                    }
                },
                error: function(xhr) {
                    snapError([xhr.status, xhr.statusText].join(" "));
                }
            });
        };

        self.urlParam = function(paramName) {
            var urlParams; //maybe replace with getUrlParameter
            var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = window.location.search.substring(1);

            urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);

            var value = urlParams[paramName];
            value = (value === 'undefined') ? "" : value;
            return $.trim(value);
        };

        self.init = function() {
            var token = this.urlParam("resetEmailToken");
            if (token === '') {
                return;
            }

            self.token = token;
            self.getEmail();
        };
    }

    app.emailResetService = {
        viewModel: new emailResetViewModel()
    };
})(window);
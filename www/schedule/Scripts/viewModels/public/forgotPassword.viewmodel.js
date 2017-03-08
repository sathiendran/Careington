
; (function ($) {
    snap.namespace("snap.Patient")
        .extend(kendo.observable)
        .define("ForgotPasswordViewModel", function (errorTypeEnum) {
            var $scope = this;
            this.hospitalId = 0;
            this.errorClass = "inputs inputs__icon";
            this.isResetSuccessfull = false;



            this.initViewModel = function (hospitalId) {
                this.set("hospitalId", hospitalId);
            };

            this.validateInput = function (e) {
                var msg = '';
                var error;
                var email = this.get("email");

                if (isEmpty(email)) {
                    msg = "Please enter your Email";
                } else if (!validateEmail(email)) {
                    msg = "Email is invalid";
                }

               
                if ($.trim(msg).length > 0) {
                    snapError(msg);

                    snap.public.PublicHeaderViewModel().errorShake();
                    $(e.currentTarget).removeClass('button__brand is-loading').addClass('button__red error');
                    this.set("errorClass", "inputs inputs__icon is-error");
                    return false;
                }
                else {
                    this.set("errorClass", "inputs inputs__icon");
                    return true;
                }

            };

            this.submitClicked = function (e) {
                e.preventDefault();
                var that = this;
                this.onFocus();
                this.set("isInProgress", true);

                if ($(e.currentTarget).hasClass('button__red error')) {
                    $(e.currentTarget).removeClass('button__red error').addClass('button__brand is-loading');
                } else {
                    $(e.currentTarget).addClass('is-loading');
                }

                if (this.validateInput(e)) {
                    var that = this;
                    var path = '/api/v2/mail/resetPassword';
                    var userTypeId = 2;
                    if (snap.patientPage)
                        userTypeId = 1;
                    $.ajax({
                        type: "POST",
                        url: path,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({
                            email: this.get("email"),
                            hospitalId: snap.hospitalSession.hospitalId,
                            userTypeId: userTypeId
                        })
                    }).done(function () {
                        $(e.currentTarget).removeClass('is-loading');
                        that.set("isResetSuccessfull", true);
                    }).fail(function (xhr, status, error) {
                        if(xhr.status == 404){
                            snapError("Email address not found.  Please review and try again");
                        } else {
                            snapError(error);
                        }
                        snap.public.PublicHeaderViewModel().errorShake();
                        $(e.currentTarget).removeClass('button__brand is-loading').addClass('button__red error');
                        that.set("errorClass", "inputs inputs__icon is-error");
                       
                    }).always(function () {
                        that.set("isInProgress", false);
                    });
                } else{
                    this.set("isInProgress", false);
                }

            };
            this.goBackClicked = function (e) {
               e.preventDefault();
                if (snap.clinicianPage) {
                    window.location.href = snap.clinicianLogin();
                }
                else if (snap.patientPage) {
                    window.location.href = snap.patientLogin();
                }
                else  {
                    window.location.href = snap.adminLogin();
                }
                
            };
            this.onFocus = function () {
                this.set("errorClass", "inputs inputs__icon");
            };

        });

}(jQuery));
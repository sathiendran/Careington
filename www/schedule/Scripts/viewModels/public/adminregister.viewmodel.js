/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />

snap.namespace("snap.admin")
    .use(["snapNotification", "snapHttp", "snapLoader", "snap.enums.ErrorTypeEnum", "snap.public.PublicHeaderViewModel"])
    .extend(kendo.observable)
    .define("adminRegisterViewModel", function ($snapNotification, $snapHttp, $snapLoader, $errorTypeEnum, $publicheader) {
        //Private 

        var that = this;
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
        this.isPatientFacing = true;
        this.token = "";
        this.isCustomer = false;
        this.closeNotification = function () {
            this.set("isNotificationActive", false);
        };
        this.notificationText = "";
        this.inputFocus = function (e) {
            this.isNotificationActive ? this.set("isNotificationActive", false) : null;

            if ($(e.target).closest('.inputs').hasClass('is-error')) {
                $(e.target).closest('.inputs').removeClass('is-error');
            }

        };
        this.verifyToken = function () {

            var that = this;
            var def1 = $.Deferred();
            setTimeout(function () {
                var path = "/api/providers/" + snap.hospitalId + "/registration-token/" + that.token.toString();
                $.ajax({
                    type: "GET",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        var rdata = response.data;
                        if (response.success === true) {
                            if (rdata.isValid === false) {
                                console.error("Token validation failure");
                                def1.reject({ error: "Validation for Token Failed" });
                            }
                            else {
                                that.set("isPatientFacing", rdata.isAuthorizedForPatientInteraction);
                                that.set("email", rdata.email);
                                def1.resolve();

                            }
                        }
                        else {
                            setTimeout(function () { snapError(response.d); }, 2000);
                            $('#txtemail').prop("disabled", "disabled");
                            $("#txt-password").prop("disabled", "disabled");
                            $("#txt-confirmpassword").prop("disabled", "disabled");
                            $("#btn-register").prop("disabled", "disabled");
                            def1.reject({ error: "Invalid Token" });
                        }

                    }
                });
            }, 0);


            return $.when(def1);
        };

        this.error = function (errorType) {
            this.set("isNotificationActive", true);
            this.set("notificationText", errorType);

            $publicheader.errorShake();
            return false;
        };

        this.Validate = function () {
            var emailId = $.trim(this.email),
                pass = $.trim(this.password),
                cpass = $.trim(this.confirmPassword),
                error = 0;

            if (emailId.length === 0) {
                $('#txtemail').parent().addClass('is-error');
                this.error("Please enter an email address");
                error++;
            }

            if (emailId.length > 0) {
                if (!window.validateEmail(emailId)) {
                    $('#txtemail').parent().addClass('is-error');
                    this.error(window.validationMessages.emailInvalid);
                    error++;
                }
            }

            if (pass.length === 0) {
                $('#txt-password').closest('.inputs').addClass('is-error');
                this.error("Please enter password");
                error++;
            }

            if (pass.length > 0) {
                if (!validatePassword(pass)) {
                    $('#txt-password').closest('.inputs').addClass('is-error');
                    if (window.validationMessages.passwordInvaild) {
                        this.error("Password does not meet requirements.");
                    }
                    error++;
                }
            }

            if (cpass.length == 0) {
                $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                this.error("Please confirm your password");
                error++;
            }

            if (pass !== cpass) {
                $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                this.error("Password mismatch");
                error++;
            }

            if (error > 0) {
                error > 2 ? this.error("Please correct the fields below") : null;

            } else {
                return true;
            }
        };

        this.finishRegister = function () {
            var that = this;
            var btn = $('.button__brand--finish');
            try {
                if (btn.hasClass('button__red error')) {
                    btn.removeClass('button__red error').addClass('button__brand is-loading');
                } else {
                    btn.addClass('is-loading');
                }

                if (that.token === null) {
                    that.tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);

                    return;
                }
                var userEmail = that.email;
                if (isEmpty(userEmail)) {
                    that.tokenFailureCallback($errorTypeEnum.EmailAlreadyInUse_Admin);
                    return;
                }
                var path = '/api/v2/clinicians/staffs/activation';

                var Password = that.password;
                var regObj = {};
                regObj.email = userEmail;
                regObj.Password = Password;
                regObj.ProviderId = snap.hospitalSession.hospitalId;
                regObj.token = that.token.toString();
                var datastr = JSON.stringify(regObj);


                $.ajax({
                    type: "POST",
                    url: path,
                    data: datastr,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {

                        var rdata = response.data;
                        if (rdata && rdata[0] && rdata[0].userID) {
                            snapSuccess("Your registration was successful. Welcome to Connected Care.");
                            $('#txtemail').prop("disabled", "disabled");
                            $("#txt-password").prop("disabled", "disabled");
                            $("#txt-confirmpassword").prop("disabled", "disabled");
                            if (that.isPatientFacing === false) // Redirects to Physician login page for only Dr. only 
                            {
                                localStorage.setItem("snapEmailAdmin", that.email);
                                location.href = "/Admin/Login";
                            }
                            else {
                                localStorage.setItem("snapEmailPhysician", that.email);
                                location.href = "/Physician/Login";
                            }
                        }
                        else {
                            if (response.responseText.message === "This Email has already been used") {
                                that.tokenFailureCallback($errorTypeEnum.EmailAlreadyInUse_Admin);
                            }
                            else {
                                that.tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);
                            }
                        }

                    },
                    error: function (response) {
                        var responseObj = {};
                        var errorText = "";
                        if (response && (response.responseText || response.statusText)) {
                           
                            if (isEmpty(response.responseText))
                                errorText = response.statusText;
                            else
                                errorText = response.responseText;
                            try {
                                responseObj = JSON.parse(errorText);
                            } catch (e) {
                                responseObj.message = errorText;
                            }
                        } else {
                            responseObj = null;
                        }
                        if (responseObj && responseObj.message === "This Email has already been used") {
                            that.tokenFailureCallback($errorTypeEnum.EmailAlreadyInUse_Admin);
                        }
                        else if (responseObj && responseObj.message === "An error has occurred.") {
                            $snapNotification.info(responseObj.exceptionMessage);
                            setTimeout(function () {
                                if (that.isPatientFacing === false) // Redirects to Physician login page for only Dr. only 
                                {
                                    localStorage.setItem("snapEmailAdmin", that.email);
                                    location.href = "/Admin/Login";
                                }
                                else {
                                    localStorage.setItem("snapEmailPhysician", that.email);
                                    location.href = "/Physician/Login";
                                }
                            }, 5000);

                        } else {
                            if (isEmpty(errorText)) {
                                that.tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);
                            }
                            else {
                                $snapNotification.info(errorText);
                                setTimeout(function () {
                                    that.tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);
                                }, 10000);
                            }
                           
                        }

                    }
                });
            }
            catch (err) {
                window.location = "/Admin/Login";
            }

        };
        this.createAccount = function (event) {
            var btn = $('.button__brand--finish');
            btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__brand is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);

            if (this.Validate(event)) {
                this.set("isNotificationActive", false);
                this.finishRegister(event);
                //this.completeSignupProcess();
            } else {
                btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);

                return false;
            }
        };
        this.initData = function (token, loadedCallback, tokenFailureCallback) {

            $('#txt-password').strength({
                strengthClass: 'strength',
                strengthMeterClass: 'strength_meter',
                strengthButtonClass: 'button_strength',
                strengthButtonText: 'Show Password',
                strengthButtonTextToggle: 'Hide Password'
            });
            $('#txt-confirmpassword').strength({
                strengthClass: 'strength',
                strengthMeterClass: 'strength_meter',
                strengthButtonClass: 'button_strength',
                strengthButtonText: 'Show Password',
                strengthButtonTextToggle: 'Hide Password'
            });
            PreventIvalidSymbolsInPasswordOrEmail($('#txtemail'));
            this.token = token;
            this.tokenFailureCallback = tokenFailureCallback;
            this.verifyToken().done(loadedCallback).fail(function () {
                tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);
            });
        };
    }).singleton();
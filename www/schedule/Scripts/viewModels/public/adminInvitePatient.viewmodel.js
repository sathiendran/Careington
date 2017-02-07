/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />




(function ($) {

    snap.namespace("snap.admin").use(["snapNotification", "snapHttp", "snapLoader", "snap.enums.ErrorTypeEnum", "snap.public.PublicHeaderViewModel"])
         .extend(kendo.observable)
        .define("RegisterViewModel", function ($snapNotification, $snapHttp, $snapLoader, $errorTypeEnum, $publicheader) {
            //Private 
            var that = this;
            var tabStrip;

            this.isNotificationActive = false;
            this.contactNumber='';
            this.closeNotification = function(){
                this.set("isNotificationActive", false);
            };
            this.notificationText = "";
            this.inputFocus = function(e){
                this.isNotificationActive ? this.set("isNotificationActive", false) : null;

                if($(e.target).closest('.inputs').hasClass('is-error')){
                    $(e.target).closest('.inputs').removeClass('is-error');
                }
                
            };
            this.error = function(errorType){
                this.set("isNotificationActive", true);
                this.set("notificationText", errorType)

                $publicheader.errorShake();
                return false;
            };
            this.currentStep = 1;
            this.toggleRuleFailure = function () {
                $('.box__steps li').removeClass('is-active');
                $('.box__steps li:eq(2)').addClass('is-active');
            };
            this.toggleStep = function () {
                $('.box__steps li').removeClass('is-active');
                $('.box__steps li:eq(' + (this.currentStep - 1) + ')').addClass('is-active');
            };
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
            this.isPatientFacing = true;
            this.token = "";
            this.name = "";
            this.termCheckbox = false;
            this.isCustomer = false;
            this.loginUser = function () {
                var that = this,
                    btn = $('.button__brand--loginbtn'),
                    loginRequest = {
                        userTypeId: 1,
                        hospitalId: snap.hospitalId,
                        email: this.email,
                        password: this.password
                    };

                btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__brand is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);
                snap.userSession = null;
            
                if(this.token){    
                    $.ajax({
                       url: '/api/v2/Account/Token',
                       type: 'POST',
                       dataType: 'json',
                       contentType: "application/json; charset=utf-8",
                       data: JSON.stringify(loginRequest),
                       success: function (response) {
                            var data = response.data[0];
                            if (data.access_token.length > 5) {
                                window.location = "/customer/login?snapToken=" + data.access_token;
                            } else {
                                 btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                                that.error("Cannot login user.");
                            }

                       },
                       error: function(){
                            btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                            that.error("Error logging in user.");
                       }
                   });
                } else {
                    window.location = "/customer/login";
                }

            };
            this.verifyToken = function (token) {
                var that = this,
                    promise = $.Deferred(),
                    path = '/api/v2/patients/registration-token/' + token;

                $.ajax({
                    type: "GET",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        var rdata = response.data[0];
                        that.set("email", rdata.email);
                        that.set("name", rdata.firstName);

                        if (rdata.isValid) {
                            that.set("token", token);                                
                        } else {
                            var currentStep = 4;
                            that.set("currentStep", currentStep);
                            tabStrip.select(currentStep - 1);
                            that.toggleStep();
                        }

                        promise.resolve();                          
                    }, 
                    error: function(){
                        var currentStep = 3;
                            that.set("currentStep", currentStep);
                            tabStrip.select(currentStep - 1);
                            that.toggleStep();
                    }
                });
                

                return promise.promise();
            };

            this.Validate = function () {
                var emailId = $.trim(this.email),
                    pass = $.trim(this.password),
                    cpass = $.trim(this.confirmPassword),
                    chkt = this.termCheckbox,
                    error = 0;

                if (emailId.length == 0) {
                    $('#txt-email').parent().addClass('is-error');
                    this.error("Please enter an email address");

                    error++
                }

                if (emailId.length > 0) {
                     if (!window.validateEmail(emailId)) {
                        $('#txt-email').parent().addClass('is-error');
                        var errorMsg = window.validationMessages.emailInvalid

                        errorMsg = errorMsg.slice(0, errorMsg.length - 5);                    
                        this.error(errorMsg);
                        error++
                    }
                }

                if (pass.length == 0) {
                    $('#txt-password').closest('.inputs').addClass('is-error');
                    this.error("Please enter password");
                    error++
                }
                if (pass.length > 0)
                    if (!validatePassword(pass)) {
                        $('#txt-password').closest('.inputs').addClass('is-error');
                        this.error(window.validationMessages.passwordInvaild);
                        error++
                    }

                if (cpass.length == 0) {
                    $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                    this.error("Please confirm your password");
                    error++
                }

                if (pass !== cpass) {
                    $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                    this.error("Password mismatch");
                    error++
                }

                if (!chkt) {
                    $('#chkterms').addClass('is-error');
                    this.error("Please accept the terms & conditions");
                    error++
                }

                if (error > 0) {
                    error > 2 ? this.error("Please correct the fields below") : null;
                    
                } else {
                    return true;
                }
            };

            this.finishRegister = function () {
                var that = this;

                $.ajax({
                    type: "PUT",
                    url: ['/api/v2/patient/onboard/createPassword?token=', that.token, "&password=", that.password].join('')
                }).done(function () {

                    var currentStep = that.get("currentStep");
                    currentStep++;
                    that.set("currentStep", currentStep);
                    tabStrip.select(currentStep - 1);
                    that.toggleStep();

                }).fail(function () {
                    that.error("Could not complete registration.");
                    $('.button__brand--finish').removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);

                });
            };
            this.createAccount = function () {
                var btn = $('.button__brand--finish');
                btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__brand is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);

                if (this.Validate()) {
                    this.finishRegister();
                    //this.completeSignupProcess();
                } else{
                   btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
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
                tabStrip = $(".register-panel").kendoTabStrip({
                    animation: false
                }).data("kendoTabStrip");
                $(".register-panel ul.k-tabstrip-items").css({ display: "none" });

                $(window).on("keyup", function (e) {
                    if (e.keyCode == 13 && that.currentStep == 1) {
                        that.set("isNotificationActive", false);
                        that.createAccount();
                    } 
                });

        
                this.tokenFailureCallback = tokenFailureCallback;
                this.verifyToken(token).done(loadedCallback).fail(function () {
                    tokenFailureCallback($errorTypeEnum.TokenExpired_Admin);
                });
            };
        });
}(jQuery));
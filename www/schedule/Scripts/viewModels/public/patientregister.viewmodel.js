/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />

snap.namespace("snap.public")
     .use(["eventaggregator", "snap.public.PublicHeaderViewModel"])
    .extend(kendo.observable).define("RegisterPatientPageViewModel", function ($eventaggregator, $publicheader) {

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
        this.datePickerChange = function(){
            this.isNotificationActive ? this.set("isNotificationActive", false) : null;

            if($('#txt-dob').closest('.inputs').hasClass('is-error')){
                $('#txt-dob').closest('.inputs').removeClass('is-error');
            };
        };
        this.validateFirstStep = function () {
            var fName = $.trim(that.get("registrationInfo.firstName")),
                lName = $.trim(that.get("registrationInfo.lastName")),
                address = $.trim($('#txt-address').val()),
                error = 0;

            if (fName.length == 0 || fName.length > 24) {
                $('#txt-firstname').parent().addClass('is-error');
                error++
            }

            if (lName.length == 0 || lName.length > 24) {
                $('#txt-lastname').parent().addClass('is-error');
                error++
            }
            if (address.length == 0) {
                $('#txt-address').parent().addClass('is-error');
                error++
            }

            if (error > 0) {
                this.error("Please correct the fields below")
                return false;
            } else {

                this.trigger("change", {field: "registrationInfo"});
                return true;
            }
        },
        this.validateSecondStep = function () {
            var emailId = $.trim(that.get("registrationInfo.email")),
                dob = $.trim($('#txt-dob').val()),
                pass = $.trim(that.get("registrationInfo.password")),
                cpass = $.trim(that.get("registrationInfo.confirmPassword")),
                chkt = that.get("registrationInfo.readTerms");
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

            if (dob.length == 0) {
                $('#txt-dob').closest('.inputs').addClass('is-error');
                this.error("Please enter valid date of birth");
                error++
            }
            else {
                var dobError = snap.dateValidation.validateDOB(dob);
                if (dobError.length > 0) {
                    $('#txt-dob').closest('.inputs').addClass('is-error');
                    this.error(dobError);
                    error++
                } else if(new Date(dob).toLocalISO() >= snap.dateLimits.getMinDOBforEmail().toLocalISO())  {
                    var age = new Date().getFullYear() - snap.dateLimits.getMinDOBforEmail().getFullYear();
                    this.error("You should be at least " + age + " years old to register");
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

        this.error = function(errorType){
            this.set("isNotificationActive", true);
            this.set("notificationText", errorType)

            $publicheader.errorShake();
            return false;
        }

        this.finishRegister = function () {
            var info = this.get("registrationInfo");
            var that = this;
            try {
                //DOB field conversion to string representing simple date with no time zone conversions. Should pass the date as is.
                var dob = [info.birthdate.getMonth()+1, info.birthdate.getDate(), info.birthdate.getFullYear()].join('/');
                //should probably move this to kendo model with validation later
                var regObj = {};
                regObj.address = info.address;
                regObj.dob = dob;
                regObj.email = info.email;
                regObj.name = { first: info.firstName, last: info.lastName };
                regObj.password = info.password;
                regObj.providerId = snap.hospitalSession.hospitalId;
                regObj.country = info.country;
                regObj.zipCode = null;
                var path = '/api/v2/patients/single-trip-registration';
                var datastr = JSON.stringify(regObj);

                $.ajax({
                    type: "POST",
                    url: path,
                    data: datastr,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (response.total === 1) {
                            //move to the landing page if successful
                            var currentStep = that.get("currentStep");
                            currentStep++;
                            that.set("currentStep", currentStep);
                            that.set("registrationInfo.firstName", that.registrationInfo.firstName);
                            tabStrip.select(currentStep - 1);
                            that.toggleStep();
                        }
                        else {
                            //show the error mesage to the patient.
                            snapError(response);
                            $('.button__brand--finish').removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                            $publicheader.errorShake();
                        }
                    },
                    error: function (xhr) {
                        $('.button__brand--finish').removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                        $publicheader.errorShake();
                        if ((xhr.status == 400) && (xhr.responseText.indexOf("already registered") > -1)) {
                            that.error("Email Address is already registered")
                            $('#txt-email').parent().addClass('is-error');
                        }
                        else if (xhr.status == 401) {
                            window.location = snap.patientLogin();
                        }
                        else {
                            that.error("Registration Failure");
                        }
                        
                    }
                });
            }
            catch (err) {
                that.error("Data Failed to Save");
                $('.button__brand--finish').removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                $publicheader.errorShake();

            }
        };
        this.validateWholeForm = function () {
            if (this.validateFirstStep() && this.validateSecondStep()) {
                return true;
            } else {
                $('.button__brand--finish').removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);

                return false;
            }
        };
        this.completeSignupProcess = function (e) {
            var btn = $('.button__brand--finish');
            btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__brand is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);
            
            if (this.validateWholeForm(e)) {
                this.set("isNotificationActive", false);
                this.finishRegister(e);
            }
        };

        /*  View Model */
        this.BtnTxt = "Next";
        this.registrationInfo = {
            zipCode: "",
            firstName: "",
            lastName: "",
            email: "",
            birthdate: "",
            address: "",
            country: "",
            password: "",
            confirmPassword: "",
            readTerms: ""

        };
        this.currentStep = 1;
        this.toggleRuleFailure = function () {
            $('.box__steps li').removeClass('is-active');
            $('.box__steps li:eq(3)').addClass('is-active');
        };
        this.toggleStep = function () {
            $('.box__steps li').removeClass('is-active');
            $('.box__steps li:eq(' + (this.currentStep - 1) + ')').addClass('is-active');
        };
        this.OnBack = function () {
            this.set("isNotificationActive", false);
            var currentStep = 2;
            currentStep--;
            this.set("currentStep", currentStep);
            tabStrip.select(currentStep - 1);
            this.toggleStep();
        };
        this.validateAddress = function () {
            this.set("isNotificationActive", false);
            var that = this;
            var currentStep = this.get("currentStep");
            var btn = $('.button__brand--verify');
            btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__green is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);

            var path = snap.string.formatURIComponents('/api/v2.1/patients/registrations/availability?addressText={0}&hospitalId={1}', $.trim($('#txt-address').val()), snap.hospitalId);

            if (this.Validate()) {    
                $.ajax({
                    type: "get",
                    url: path,
                   // data: datastr,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (!isEmpty(response.data)) {
                            if(response.data[0].isAvailable){
                                currentStep++;
                                that.set("currentStep", currentStep);
                                that.set("registrationInfo.firstName", that.registrationInfo.firstName);
                                tabStrip.select(currentStep - 1);
                                that.toggleStep();
                            }
                            else {
                                tabStrip.select(3);
                                that.toggleRuleFailure();
                            }
                            btn.removeClass('is-loading').prop("disabled", false);
                        }
                        else {
                            that.error("Error processing address.");
                        }
                    },
                    error: function (xhr) {
                        that.error("Error processing registration");
                        btn.removeClass('button__green is-loading').addClass('button__red error').prop("disabled", false);
                        
                    }
                });

            } else {
                btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
            }
        };
        this.loginUser = function () {
            var that = this,
                loginRequest = {
                    userTypeId: 1,
                    hospitalId: snap.hospitalId,
                    email: this.registrationInfo.email,
                    password: this.registrationInfo.password
                },
                path = '/api/v2/Account/Token';
            snap.userSession = null;
            $.ajax({
               url: path,
               type: 'POST',
               dataType: 'json',
               contentType: "application/json; charset=utf-8",
               data: JSON.stringify(loginRequest),
               success: function (response) {
                    var data = response.data[0];
                    if (data.access_token.length > 5) {
                        window.location = "/customer/login?snapToken=" + data.access_token;
                    } else {
                        that.error("Cannot login user.");
                    }

               },
               error: function(){
                    that.error("Error logging in user.");
               }
           });

        };
        this.Validate = function () {
            if (this.currentStep == 1) {
                return this.validateFirstStep();
            }
            if (this.currentStep == 2) {
                return this.validateSecondStep();
            }
        };
        this.initData = function () {
            var that = this;
            
            setTimeout(function(){
                that.set("contactNumber", snap.hospitalSession.contactNumber);
            }, 2000);

            var dobField = $('#txt-dob');
            $(window).on("keyup", function (e) {
                if (e.keyCode == 13 && that.currentStep == 1) {
                    that.set("isNotificationActive", false);
                    that.validateAddress();
                } else if(e.keyCode == 13 && that.currentStep == 2){
                    that.set("isNotificationActive", false);
                    that.completeSignupProcess();
                }
            });

            $('.box__steps li:eq(' + (this.currentStep - 1) + ')').addClass('is-active');

            snap.datepickers.initializeDatePicker('.datepickerDOB', snap.dateLimits.getTodayMaxDate());

            dobField.click(function () {
                dobField.data("kendoDatePicker").open();
            });

            tabStrip = $(".register-panel").kendoTabStrip({
                animation: false,
                navigatable: false
            }).data("kendoTabStrip");
            $(".register-panel ul.k-tabstrip-items").css({ display: "none" });
            PreventIvalidSymbolsInPasswordOrEmail($('#txt-email'));
        };
    }).singleton();
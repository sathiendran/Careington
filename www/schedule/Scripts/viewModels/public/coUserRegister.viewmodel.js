
snap.namespace("snap")
    .extend(kendo.observable)
    .use(["snap.enums.ErrorTypeEnum", "snap.public.PublicHeaderViewModel"])
    .define("CoUserRegisterViewModel", function (errorTypeEnum, $publicheader) {

        var vm = this;

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

        this.token = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.dateOfBirth = '';
        this.termsAgreed = false;
        this.maxdate = new Date();
        this.mindate = snap.dateLimits.getStartDate();
        this.isCustomer = true;
        var promise = $.Deferred();
        this.txtDOBField = {};
        this.timezone = 0;
        this.address ='';
        this.srcTimeZones = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/api/v2/timezones',
                    dataType: "json"
                }
            },
            schema: {
                data: function (response) {
                    var data = response.data;
                    return data;
                },
                id: "id"
            }

        });

        this.InitRegistration = function (token) {

            var that = this;
            if (token.length) {
                var tokenCodeSetId = '18';
                var path = snap.string.formatString('/api/v2/account/couser/tokens/{0}/{1}', token, tokenCodeSetId);
                $.ajax({
                    type: "GET",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (response) {
                    if (response == "Success") {
                        that.fillEmailId(token).done(function (tempemail) {
                            promise.resolve(tempemail);
                        });


                    } else {
                        promise.reject(null, null, response.d);
                    }

                }).fail(function () {

                    promise.reject();
                });

                return promise.promise();
            }
        };

        this.fillEmailId = function () {
            var path = '/api/v2/patients/couser-tokens/' + this.token + '/email';

            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            }).done(function (response) {
                if (response) {
                    
                    if (response.dob && response.dob != "") {
                        var dob = response.dob.replace(/-/g , "/");
                        
                        vm.set("dateOfBirth", new Date(dob));
                        vm.set("timezone", response.timeZoneID);
                        vm.set("address", response.address);
                    };

                    promise.resolve(response.emailIdTemp);

                } else {
                    promise.reject();
                }
            }).fail(function (xhr, status, err) {
                console.error(err);
                promise.reject();
            });
            return promise.promise();

        };

        this.initViewAndModel = function (token, onInitComplete, showErrorPage) {
            var that = this;
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

            this.txtDOBField = $("#txtDOB");

            $("#txtDOB").click(function () {
                $("#txtDOB").data("kendoDatePicker").open();
            });

            $(window).on("keyup", function (e) {
                if (e.keyCode == 13) {
                    that.set("isNotificationActive", false);
                    that.createAccount();
                }
            });

            PreventIvalidSymbolsInPasswordOrEmail($('#txtemail'));

            this.set("token", token);
            var that = this;
            this.showErrorPage = showErrorPage;

            if (token.length) {
                this.InitRegistration(token).done(function (email) {
                    that.set("email", email);
                }).fail(function () {
                    showErrorPage(errorTypeEnum.TokenExpired_Customer);
                }).always(function () {
                    onInitComplete && onInitComplete();
                });
            } else {
                showErrorPage(errorTypeEnum.TokenExpired_Customer);
            }
        };

        this.error = function(errorType){
            this.set("isNotificationActive", true);
            this.set("notificationText", errorType)

            $publicheader.errorShake();
            return false;
        };

        this.validateInput = function () {
            var email = this.get("email"),
                password = this.get("password"),
                confirmPassword = this.get("confirmPassword"),
                dob = formatJSONDate1(this.dateOfBirth),
                address = $.trim(this.address),
                dobError = snap.dateValidation.validateDOB(dob),
                error = 0;

            if (email == "") {
               $('#txt-email').parent().addClass('is-error');
                this.error("Please enter an email address");

                error++
            }

            if (!validateEmail(email)) {
                $('#txt-email').parent().addClass('is-error');
                this.error("Please enter a valid email address");

                error++
            }

            if (password == "") {
                $('#txt-password').closest('.inputs').addClass('is-error');
                this.error("Please enter password");
                error++
            }

            if (!validatePassword(password)) {
                $('#txt-password').closest('.inputs').addClass('is-error');
                this.error(window.validationMessages.passwordInvaild);
                error++
            }

            if (confirmPassword == "") {
                $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                this.error("Please confirm your password");
                error++
            }

            if (password != "" && confirmPassword != "") {
                if (password != confirmPassword) {
                    $('#txt-confirmpassword').closest('.inputs').addClass('is-error');
                    this.error("Password mismatch");
                    error++
                }
            }

            if (address.length == 0) {
                $('#txt-address').parent().addClass('is-error');
                this.error("Please provide a valid address");
                error++
            }
            
            if (dobError.length > 0) {
                $('#txtDOB').closest('.inputs').addClass('is-error');
                this.error("Please enter valid date of birth");
                error++
            }
            else {
                $('#txtDOB').closest('.inputs').removeClass('is-error');
                var compareDob = new Date(dob);
                if (compareDob >= snap.dateLimits.getMinDOBforEmail()) {
                    $('#txtDOB').closest('.inputs').addClass('is-error');
                    this.error("Patient must be at least 12 years to create an account");
                    error++
                }
            }

            if (!this.termsAgreed) {
               $('#chkterms').addClass('is-error');
                this.error("Please accept the terms & conditions");
                error++
            }

            if (error > 0) {
                error > 1 ? this.error("Please correct the fields below") : null;
                
            } else {
                return true;
            }
        };

        this.createAccount = function (event) {
            var that = this;

            /*reg process*/

            var btn = $('.button__brand--finish');
            btn.hasClass('button__red error') ? btn.removeClass('button__red error').addClass('button__brand is-loading').prop("disabled", true) : btn.addClass('is-loading').prop("disabled", true);


            if (this.validateInput(event)) {
                this.set("isNotificationActive", false);

                var dob = "";

                if (!this.get("dateOfBirth")) {
                    dob = this.txtDOBField.val();
                } else {
                    dob = [this.dateOfBirth.getMonth() + 1, this.dateOfBirth.getDate(), this.dateOfBirth.getFullYear()].join('/');
                }
                var timezone = this.timezone || 0;
                var data = {
                    dob: dob,
                    email:  this.get("email"),
                    password:  this.get("password"),
                    providerId: snap.hospitalSession.hospitalId,
                    token: this.token,
                    address: this.address,
                    timeZoneId: parseInt(timezone)
                };
                

                that.CallService(data).done(function () {
                    snapSuccessHtml('Your account has been created successfully.<br/> You will be redirected to login page momentarily.');
                    setTimeout(function () {
                        location.href = snap.patientLogin();
                    }, 3000);
                }).fail(function (xhr, status, error) {

                    if (xhr) {
                        if (xhr.status == 401) {
                            window.location = snap.patientLogin();
                        } else if (!snap.userAborted(xhr)) {
                            btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                            if( error.indexOf('this address') >= 0){
                                $('#txt-address').parent().addClass('is-error');
                                that.error(error);
                            } else if (error.indexOf("already registered")) {
                                $('#txt-address').parent().addClass('is-error');
                                that.error("Account is already created");
                            } else {
                                that.error("Error processing registration");
                            }
                        }
                    } else {
                        btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);
                        that.error("Error processing registration");
                    }
                });
                
            } else {
                btn.removeClass('button__brand is-loading').addClass('button__red error').prop("disabled", false);

                return false;
            }
        };

        this.CallService = function (data) {
            var promise = $.Deferred();
            if (this.token.length) {
                var path = '/api/v2/patients/single-trip-registration';
                $.ajax({
                    type: "POST",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(data)
                }).done(
                function () {
                    promise.resolve();
                }).fail(function (xhr, status) {
                    var error = "Unknown error";
                    if(xhr){
                        error = JSON.parse(xhr.responseText).message;
                        }
                    promise.reject(xhr, status, error );
                })
            } else {
                promise.reject(null, null, 'token is missing at url, try again from email.');
            }


            return promise.promise();
        };

        this.ValidateCoUserToken = function () {

            var that = this;
            var token = this.token;
            try {
                var ValidResult = "";
                var tokenCodeSetId = '18';
                var path = snap.string.formatString('/api/v2/account/couser/tokens/{0}/{1}', token, tokenCodeSetId);
                $.ajax({
                    type: "GET",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                }).done(function (response) {
                    ValidResult = response;
                    if (ValidResult == "Success") {
                        that.CheckIfSameEmailID(token);
                    } else {
                        promise.reject(null, null, ValidResult);
                    }
                }).fail(function (xhr, status, error) {
                    promise.reject(xhr, status, error);

                });
            } catch (err) {
                //
            }
        };





    }).singleton();
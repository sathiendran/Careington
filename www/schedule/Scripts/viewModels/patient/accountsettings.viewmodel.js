; (function ($) {

    snap.namespace("Snap.Patient").define("AccountFieldsEnum", function () {
        this.name = "firstname";
        this.lastname = "lastname";
        this.email = "email";
        this.currentpassword = "current_password";
        this.newpassword = "new_password";
        this.confirmation = "new_password_confirmation";
    }).singleton();

    snap.namespace("Snap.Patient").use(["snap.DataService.customerDataService", "adminService", "Snap.Patient.AccountFieldsEnum"])
         .extend(kendo.observable)
        .define("AccountSettingsViewModel", function ($service, $admService, fieldsEnum) {
            var currentViewModel = this;
            this.name = "";
            this.lastname = "";
            this.email = "";
            this.timezoneid = 0;
            this.timezones = [];
            this.fnResolveElement = null;
            this.userId = "";
            this.currentpassword = "";
            this.newpassword = "";
            this.newpasswordconfirmation = "";

            this.Init = function (fnResolveElement) {
                currentViewModel.fnResolveElement = fnResolveElement;
                $.when($service.getAccountDetails(), $admService.getTimeZones())
               .then(function (details, tz) {
                   currentViewModel.set("timezones", tz[0].data);
                   currentViewModel.set("name", details[0].data[0].name);
                   currentViewModel.set("lastname", details[0].data[0].lastname);
                   currentViewModel.set("timezoneid", details[0].data[0].timezoneId);
                   currentViewModel.set("email", details[0].data[0].email);
                   currentViewModel.set("userId", details[0].data[0].userId);
               });

                currentViewModel.fnResolveElement(fieldsEnum.currentpassword).strength({
                    strengthClass: 'strength',
                    strengthMeterClass: 'strength_meter',
                    strengthButtonClass: 'button_strength',
                    strengthButtonText: 'Show Password',
                    strengthButtonTextToggle: 'Hide Password'
                });

                currentViewModel.fnResolveElement(fieldsEnum.newpassword).strength({
                    strengthClass: 'strength',
                    strengthMeterClass: 'strength_meter',
                    strengthButtonClass: 'button_strength',
                    strengthButtonText: 'Show Password',
                    strengthButtonTextToggle: 'Hide Password'
                });

                currentViewModel.fnResolveElement(fieldsEnum.confirmation).strength({
                    strengthClass: 'strength',
                    strengthMeterClass: 'strength_meter',
                    strengthButtonClass: 'button_strength',
                    strengthButtonText: 'Show Password',
                    strengthButtonTextToggle: 'Hide Password'
                });
            };
            this.SaveChanges = function (e) {
                e.preventDefault();
                this.set("name", $.trim(this.get("name")));
                this.set("lastname", $.trim(this.get("lastname")));
                this.set("email", $.trim(this.get("email")));

                if (!isValidName(this.get("name"))) {
                    snapError("Please enter a valid first name.");
                    return false;
                }
                if (!isValidName(this.get("lastname"))) {
                    snapError("Please enter a valid last name.");
                    return false;
                }
                var txtEmail = this.get("email");
                if (txtEmail == "") {
                    snapError("Please enter Email.");
                    this.fnResolveElement(fieldsEnum.email).focus();
                    return false;
                }
                if (!validateEmail(txtEmail)) {
                    snapError("Email is invalid.");
                    this.fnResolveElement(fieldsEnum.email).focus();
                    return false;
                }
                if (this.get("timezoneid") == 0) {
                    snapError("Please select Timezone.");
                    return false;
                }

                showSpinner('overlay1');
                $service.updateAccountDetails({
                    'Name': this.get("name"),
                    'Lastname': this.get("lastname"),
                    'TimezoneId': this.get("timezoneid"),
                    'Email': this.get("email")
                }).then(function (responce) {
                    if (responce.data) {
                        switch (responce.data[0]) {
                            case 2:
                                snapSuccess('Your email has been changed and a confirmation email has sent to your email. Please check your email and confirm new changes.');
                                setTimeout(function () {
                                  //  window.location.href = snap.patientLogin();
                                }, 10000);
                                break;
                            case 0:
                                snapError("Email Id already registered.");
                                break;
                            case 1:
                              //  window.location.reload();
                                break;
                            default:
                                snapError("Unable to save your changes");
                        }
                        hideSpinner();
                    } else {
                        hideSpinner();
                        snapError("Unable to save your changes e");
                    }
                },
                function (a) {
                    hideSpinner();
                    if (a.status === 401) {
                      //  window.location.href = snap.patientLogin();
                    } else if (a.status === 404) {
                        snapError("Patient profile associated with this account is not found");
                    } else {
                        snapError("Internal server error");
                    }
                }

                );
            };

            this.UpdatePassword = function (e) {
                e.preventDefault();
                if (!this.currentpassword) {
                    snapError("Please enter current Password.");
                    this.fnResolveElement(fieldsEnum.currentpassword).focus();
                    return false;
                }
                if (!this.newpassword) {
                    snapError("Please enter new Password.");
                    this.fnResolveElement(fieldsEnum.newpassword).focus();
                    return false;
                }
                if (!this.newpasswordconfirmation) {
                    snapError("Please confirm your Password.");
                    this.fnResolveElement(fieldsEnum.confirmation).focus();
                    return false;
                }
                if (!(this.newpassword === this.newpasswordconfirmation)) {
                    snapError("Passwords don't match.  Please enter again.");
                    this.fnResolveElement(fieldsEnum.newpassword).focus();
                    this.fnResolveElement(fieldsEnum.newpassword).data("plugin_strength").clearPassword();
                    this.fnResolveElement(fieldsEnum.confirmation).data("plugin_strength").clearPassword();
                    this.set("newpassword", "");
                    this.set("newpasswordconfirmation", "");
                    return false;
                }
                if (!validatePassword(this.newpassword)) {
                    this.fnResolveElement(fieldsEnum.newpassword).focus();
                    snapError(window.validationMessages.passwordInvaild);
                }
                if (!this.fnResolveElement(fieldsEnum.newpassword).data("plugin_strength").isPasswordMatchAllRequrements()) {
                    return false;
                }
                //TODO: Replace this code when new API call is implemented
                showSpinner('overlay2');
                var path = snap.string.formatURIComponents('/api/v2/account/password?old={0}&new={1}', this.currentpassword, this.newpassword);
                $.ajax({
                    type: "PUT",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        hideSpinner();

                        snapSuccess("Password has been changed successfully.");
                        currentViewModel.fnResolveElement(fieldsEnum.newpassword).data("plugin_strength").clearPassword();
                        currentViewModel.fnResolveElement(fieldsEnum.confirmation).data("plugin_strength").clearPassword();
                        currentViewModel.fnResolveElement(fieldsEnum.currentpassword).data("plugin_strength").clearPassword();
                        return false;


                    },
                    error: function (xhr) {

                        hideSpinner();
                        if (xhr.status == 401) {
                            window.location = "/public/#/admin";
                        }
                        var errMsg = "Failed to save password";
                        errMsg = xhr.responseText.substr(1, 4) == 100 ? "Current password is invalid" : errMsg;
                        errMsg = xhr.responseText.substr(1, 4) == 101 ? "New password is invalid" : errMsg;

                        snapError(errMsg);
                        console.error("Error" + xhr.responseText);
                    }
                });
            };
        });

    function showSpinner(cls) {
        var newDiv = $('<div style="background-color:#CCC;height: 43%;width: 30%;z-index: 3;position: absolute; left: 36%;-moz-opacity: 0.3;opacity:0.3;filter: alpha(opacity=0.3);" class="snapLoadDiv">', { id: 'snapLoadDiv' });
        $(newDiv).append('<img src="../../images/loader.gif" style="position:relative; top:50%; left:50%;"/>');
        $("." + cls).prepend(newDiv);
        $(newDiv).show();
    }
    function hideSpinner() {
        if ($('.snapLoadDiv').length) {
            $('.snapLoadDiv').remove();
        }
    }

}(jQuery));

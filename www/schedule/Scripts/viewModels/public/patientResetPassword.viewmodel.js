; (function ($) {
    // ReSharper disable CoercedEqualsUsing
    snap.namespace("snap.Patient")
      .define("PasswordResetService", function () {
          var isReset = false;
          this.setResetType = function (_isRest) {
              isReset = _isRest;
          };
          this.validateToken = function (token) {
              var tokenCodeSetId = '2';
              var path = snap.string.formatString('/api/v2/account/user/tokens/{0}/{1}', token, tokenCodeSetId);
              var promise = $.Deferred();
              $.ajax({
                  type: "GET",
                  async: false,
                  url: path,
                  contentType: "application/json; charset=utf-8",
                  dataType: "json"
              }).done(function (response) {
                  if (response == "Success") {
                      promise.resolve();
                  } else {
                      promise.reject();
                  }
              }).fail(function () {
                  promise.reject();
              });

              return promise.promise();
          };
          this.finishSetPassword = function (token, password) {
              var promise = $.Deferred();
              var path = snap.string.formatURIComponents('/api/v2/account/password?token={0}&password={1}', token, password);
              $.ajax({
                  type: "PUT",
                  url: path,
                  contentType: "application/json; charset=utf-8"
              }).done(function () {
                  promise.resolve();
              }).fail(function () {
                  promise.reject();
              })
              return promise.promise();
          };
      });

    snap.namespace("snap.Patient")
     .define("PasswordCreateService", function () {
         var isReset = false;
         this.setResetType = function (_isRest) {
             isReset = _isRest;
         };
         this.validateToken = function (token) {
             var promise = $.Deferred();
             $.ajax({
                 type: 'GET',
                 url: '/api/v2/patients/registration-token/' + token,
             }).done(function (resp) {
                 if (resp && resp.data.length == 1 && resp.data[0].isValid) {
                     promise.resolve();
                 } else {
                     promise.reject();
                 }
             }).fail(function () {
                 promise.reject();
             })
             return promise.promise();
         };
         this.finishSetPassword = function (token, password) {

             var promise = $.Deferred();
             $.ajax({
                 type: "PUT",
                 url: ['/api/v2/patient/onboard/createPassword?token=', token, "&password=", password].join('')
             }).done(function () {
                 promise.resolve();
             }).fail(function () {
                 promise.reject();
             })
             return promise.promise();
         };

     });


    snap.namespace("snap.Patient")
        .extend(kendo.observable)
         .use(["snap.enums.ErrorTypeEnum"])
        .define("ResetAccountPasswordViewModel", function (errorTypeEnum) {

            var $scope = this;

            this.title = "Login";
            this.titleHeader = "Password Service";
            this.token = '';
            this.password = '';
            this.confirmPassword = '';
            var $passwordService = null;
            this.messageTypesEnum = {
                EnterPassword: 0,
                ConfirmPassword: 1,
                PasswordsNotMatch: 2,
                InvalidPassword: 3,
                Success: 4
            }
            this.showReset = true;
            this.showLoginLink = false;
            this.showWarning = false;
            this.warningClass = "";
            this.errorClass = "inputs inputs__icon";
            this.warningHtml = "";

            var isResetService = false;
            this.setServiceType = function (_isResetService) {
                isResetService = _isResetService;
                if (isResetService == 1) {
                    $passwordService = new snap.Patient.PasswordResetService();
                    this.set("title", "Reset Password");
                    this.set("titleHeader", "Reset Password");
                } else {
                    $passwordService = new snap.Patient.PasswordCreateService();
                    this.set("title", "Create Password");
                    this.set("titleHeader", "Create Password");
                }
            };


            this.validateToken = function (token) {
                if (!!$passwordService)
                    return $passwordService.validateToken(token);
                //If service is not set.
                var promise = $.Deferred();
                promise.resolve();
                return promise.promise();

            };
            this.finishSetPassword = function () {
                var promise = $.Deferred();
                promise.resolve();
                return promise.promise();
            };
            this.initViewModel = function (token, onInitComplete, showErrorPage) {
                $('#txtPassword').strength({
                    strengthClass: 'strength',
                    strengthMeterClass: 'strength_meter',
                    strengthButtonClass: 'button_strength',
                    strengthButtonText: 'Show Password',
                    strengthButtonTextToggle: 'Hide Password'
                });
                $('#txtConfirmPassword').strength({
                    strengthClass: 'strength',
                    strengthMeterClass: 'strength_meter',
                    strengthButtonClass: 'button_strength',
                    strengthButtonText: 'Show Password',
                    strengthButtonTextToggle: 'Hide Password'
                });

                this.set("token", token);
                this.showErrorPage = showErrorPage;
                var that = this;

                if (token.length) {
                    this.validateToken(token).fail(function () {
                        showErrorPage(errorTypeEnum.TokenExpired_Customer);
                    }).always(function () {
                        onInitComplete && onInitComplete();
                    });
                } else {
                    showErrorPage(errorTypeEnum.TokenExpired_Customer);
                }
            };

            this.validateInput = function (e) {
                var msg = '';
                var error;
                var password = this.get("password");
                var confirmPassword = this.get("confirmPassword");


                if (password == "") {
                    msg = "Please enter a new Password<br />";
                }

                if (!validatePassword(password)) {
                    msg += window.validationMessages.passwordInvaild;
                }

                if (confirmPassword == "") {
                    msg += "Please confirm your Password<br/>";

                }

                if (password != "" && confirmPassword != "") {
                    if (password != confirmPassword) {
                        msg += "Passwords don't match. <br> Please re-enter Password.<br/>";
                    }
                }

                if ($.trim(msg).length > 0) {
                    snapError(msg);

                    snap.public.PublicHeaderViewModel().errorShake();
                    $(e.currentTarget).removeClass('button__brand is-loading').addClass('button__red error');
                    this.set("errorClass", "inputs inputs__icon is-error");

                    $('#txt-password').prop('disabled', false);
                    $('#txt-confirmpassword').prop('disabled', false);
                    return false;
                }
                else {
                    this.set("errorClass", "inputs inputs__icon");
                    return true;
                }

            };

            this.submitClicked = function (e) {
                var that = this;
                this.onFocus();
                e.preventDefault();

                $('#txt-password').prop('disabled', true);
                $('#txt-confirmpassword').prop('disabled', true);

                if ($(e.currentTarget).hasClass('button__red error')) {
                    $(e.currentTarget).removeClass('button__red error').addClass('button__brand is-loading');
                } else {
                    $(e.currentTarget).addClass('is-loading');
                }

                if (this.validateInput(e)) {

                    $passwordService.finishSetPassword(this.token, this.password).done(function () {
                        $(e.currentTarget).removeClass('is-loading');
                        snapSuccessHtml('<span class="icon_check"></span><p>Your Password has been updated. <br> Click below to login with your new password.');

                        $scope.set("showReset", false);
                        $scope.set("showLoginLink", true);

                        $scope.set("title", "Go To Login");
                    }).fail(function () {
                        $scope.showErrorPage(errorTypeEnum.TokenExpired_Customer);
                    });
                } else {
                    //validataion logic goes here

                }
            };

            this.goToLogin = function (e) {
                $(e.currentTarget).addClass('is-loading');
                location.href = '/customer/login';
            };

            this.onFocus = function () {
                if (this.errorClass == "inputs inputs__icon is-error") {
                    this.set("errorClass", "inputs inputs__icon");
                }
            }

        });


}(jQuery));
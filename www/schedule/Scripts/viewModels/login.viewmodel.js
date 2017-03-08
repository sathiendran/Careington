(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        loginError: "",
        email: "1",
        password: "",
        hospitalId: "",
        userTypeId: 1,
        isAdminLogin: false,
        token: "",
        rememberUserInfo: false,

        initData: function () {
            this.set("loginError", "");
            this.set("email", "");
            this.set("password", "");
            this.set("rememberUserInfo", false);
            this.getStorageInfo();



        },
        getHospitalId: function () {
            try {
                return this.hospitalId;
            }
            catch (err) {
                return 0;
            }
        },
        setHospitalId: function (id) {
            var that = this;
            that.set("hospitalId", id);
        },
        setUserTypeId: function (id) {
            var that = this;
            that.set("userTypeId", id);
        },
        setIsAdminPage: function (isTrue) {
            var that = this;
            that.set("isAdminLogin", isTrue);
        },
        loginCustomer: function () {
            var that = this;
            if (that.rememberUserInfo) {
                that.storeUserLogin();
            }
            else {
                that.clearUserStorage();
            }

            that.clearVideoDetectStorage();

            $.ajax({
                url: "/api/v2/patients/userprofile",
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    var data = response.data[0];

                    var profileData = {};
                    profileData.firstName = data.firstName;
                    profileData.fullName = data.fullName;
                    profileData.gender = data.gender;
                    profileData.lastName = data.lastName;
                    profileData.profileId = data.profileId;
                    profileData.userId = data.userId;
                    profileData.timeZone = data.timeZone;
                    profileData.timeZoneId = data.timeZoneId;
                    profileData.hasRequiredFields = data.hasRequiredFields;
                    profileData.contactNumber = data.mobilePhone;
                    profileData.dob = data.dob;
                    profileData.isLogouted = false;

                    profileData.profileImage = data.profileImagePath
                        || getDefaultProfileImageForPatient(data.gender);

                    snap.setSnapJsSession("snap_patientprofile_session", profileData);
                    window.location.href = snap.getPatientHome();
                },
                error: function () {
                    snapError("Failed to Load Profile");
                }

            });




        },
        changeClinicianStatus: function (userId, statusId , userStatusInformation) {
            var url = "/api/v2.1/physicians/" + userId + "/online-status";
            return $.ajax({
                url: url,
                type: 'PUT',
                dataType: 'json',
                data: JSON.stringify({
                    doctorStatus: statusId,
                    statusInformation: userStatusInformation
                }),
                contentType: "application/json; charset=utf-8"
            });

        },
        loginClinician: function () {
            var that = this;
            if (that.rememberUserInfo) {
                that.storeUserLogin();
            }
            else {
                that.clearUserStorage();
            }
            that.clearVideoDetectStorage();


            $.ajax({
                url: "/api/v2/admin/userstaffprofile",
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    var data = response.data[0];
                    var profileData = {};
                    profileData.firstName = data.firstName;
                    profileData.fullName = data.fullName;
                    profileData.gender = data.gender;
                    profileData.lastName = data.lastName;
                    profileData.profileId = data.profileId;
                    profileData.userId = data.userId;
                    profileData.timeZone = data.timeZone;
                    profileData.timeZoneId = data.timeZoneId;
                    profileData.medicalLicense = data.medicalLicense;
                    profileData.medicalSchool = data.medicalSchool;
                    profileData.medicalSpeciality = data.medicalSpeciality;
                    profileData.roles = data.roles;
                    profileData.statesLicenced = data.statesLicenced;
                    profileData.subSpeciality = data.subSpeciality;
                    profileData.isLogouted = false;
                    profileData.personId = data.personId;

                    profileData.profileImage = data.profileImagePath
                        || getDefaultProfileImageForClinician(data.gender);

                    snap.setSnapJsSession("snap_staffprofile_session", profileData);
                    that.changeClinicianStatus(data.userId, 73, "User Login").always(function () {
                        window.location.href = snap.getClinicianHome();
                    });
                },
                error: function () {
                    snapError("Failed to Load Profile");
                }

            });


        },
        loginAdmin: function () {
            var that = this;
            if (that.rememberUserInfo) {
                that.storeUserLogin();
            }
            else {
                that.clearUserStorage();
            }

            $.ajax({
                url: "/api/v2/admin/userstaffprofile",
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    var data = response.data[0];

                    var profileData = {};
                    profileData.firstName = data.firstName;
                    profileData.fullName = data.fullName;
                    profileData.gender = data.gender;
                    profileData.lastName = data.lastName;
                    profileData.profileId = data.profileId;
                    profileData.userId = data.userId;
                    profileData.timeZone = data.timeZone;
                    profileData.timeZoneId = data.timeZoneId;
                    profileData.roles = data.roles;
                    profileData.medicalSpeciality = data.medicalSpeciality;
                    profileData.isLogouted = false;
                    profileData.personId = data.personId;

                    profileData.profileImage = data.profileImagePath
                        || getDefaultProfileImageForClinician(data.gender);

                    snap.setSnapJsSession("snap_staffprofile_session", profileData);
                    window.location.href = "/Admin/Main/#/analytics";
                },
                error: function () {
                    snapError("Failed to Load Profile");
                }

            });
        },

        loginSnapMDAdmin: function () {
            var that = this;
            if (that.rememberUserInfo) {
                that.storeUserLogin();
            }
            else {
                that.clearUserStorage();
            }
            window.location.href = "/SnapMDAdmin/SnapAdmin.aspx";
        },


        clearVideoDetectStorage: function () {
            localStorage.setItem("videoSupport", "");
        },

        storeUserLogin: function () {
            var that = this;
            if (that.userTypeId == 1) {
                localStorage.setItem("snapEmailPatient", that.email);
            }
            else if (that.userTypeId == 2) {
                if (that.isAdminLogin == true) {
                    localStorage.setItem("snapEmailPhysician", that.email);
                }
                else {
                    localStorage.setItem("snapEmailAdmin", that.email);
                }
            }
        },
        clearUserStorage: function () {
            var that = this;
            if (that.userTypeId == 1) {
                localStorage.setItem("snapEmailPatient", "");
            }
            else if (that.userTypeId == 2) {
                if (that.isAdminLogin == true) {
                    localStorage.setItem("snapEmailPhysician", "");
                }
                else {
                    localStorage.setItem("snapEmailAdmin", "");
                }

            }
            else if (that.userTypeId == 3) {
                localStorage.setItem("snapMDAdminEmail", "");
            }
        },
        getStorageInfo: function () {
            var that = this;
            var emailSt;
            var passwordSt;

            if (that.userTypeId == 1) {
                emailSt = localStorage.getItem("snapEmailPatient");
            }
            else if (that.userTypeId == 2) {
                if (that.isAdminLogin == true) {
                    emailSt = localStorage.getItem("snapEmailPhysician");
                }
                else {
                    emailSt = localStorage.getItem("snapEmailAdmin");
                }
            }
            if (that.userTypeId == 3) {
                emailSt = localStorage.getItem("snapMDAdminEmail");
            }

            if ((emailSt != null) && (emailSt != undefined) && (emailSt != "")) {
                that.set("email", emailSt);

            }
            else {
                that.set("rememberUserInfo", false);
            }

        },
        loginCustomerToApplicationSSO: function (snapToken) {
            var that = this;
            var userData = {};
            userData.apiDeveloperId = snap.apiDeveloperId;
            userData.apiKey = snap.apiKey;
            userData.token = snapToken;
            userData.snapLogin = false;
            snap.setSnapJsSession("snap_user_session", userData);
            snap.getSnapUserSession();

            that.set("token", snapToken);
            snap.setHospitalSettings();
            that.loginCustomer();

        },
        loginClinicianToApplicationSSO: function (snapToken) {
            var that = this;
            var userData = {};
            userData.apiDeveloperId = snap.apiDeveloperId;
            userData.apiKey = snap.apiKey;
            userData.token = snapToken;
            userData.snapLogin = false;
            $.ajax({ 
                url: "/api/Account/RoleFunctions",
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("Authorization", "Bearer " + userData.token);
                    xhr.setRequestHeader("X-Developer-Id", userData.apiDeveloperId);
                    xhr.setRequestHeader("X-Api-Key", userData.apiKey);
                }
            }).done(function (data) {
                userData.security1to31 = data.security1to31;
                userData.security32to63 = data.security32to63;
                snap.setSnapJsSession("snap_user_session", userData);
                snap.getSnapUserSession();
                that.set("token", snapToken);
                snap.setHospitalSettings();
                that.loginClinician();
            });
        },
        errorShake: function () {
            $('.box').addClass('shake');
            setTimeout(function () {
                $('.box').removeClass('shake');
            }, 700);
        },
        loginToApplication: function (event) {
            var that = this;
            event.preventDefault();

            if (!$("#divLogin").hasClass('active')) {
                //event.preventDefault();
                // return;
            }
            if (that.password.indexOf("\"") != -1 || that.password.indexOf("'") != -1) {
                that.errorShake();

                $('.inputs__password').addClass('is-error');
                snapError("Invalid Characters in Password");
                return;
            }

            if (that.password == "") {
                that.password = $("#txtPassword").val();
            }

            if (that.email == "") {
                that.errorShake();

                $('.inputs__email').addClass('is-error');
                snapError("Please enter a Email");
                return;
            }

            if (that.password == "") {
                that.errorShake();

                $('.inputs__password').addClass('is-error');
                snapError("Please enter a Password");
                return;
            }

            if ($('.button').hasClass('button__red error')) {
                $(".button").addClass('button__brand is-loading').removeClass('button__red error');
            } else {
                $(".button").addClass('is-loading');
            }

            $('input').on('focus', function () {
                $('.inputs').hasClass('is-error') ? $('.inputs').removeClass('is-error') : null;
            });

            //TODO: we should modify a function ValidateOS() and uncomment the below condition, if WebRTC is found unsupported in any devices.
            //if (!ValidateOS()) {
            //    snapInfo("Your device is not supported for use with video conferencing. Please be advised that the remainder of the site is functional.");
            //}

            var loginRequest = {
                userTypeId: that.userTypeId,
                hospitalId: that.hospitalId,
                email: that.email,
                password: that.password
            };

            // rest old Token
            snap.userSession = null;
            var path = '/api/v2/Account/Token';
            //This is my local path.  Need to set this in configuration somehow
            $.ajax({
                url: path,
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(loginRequest),
                success: function (response) {
                    var data = response.data[0];
                    if (data.access_token.length > 5) {
                        //set user info

                        var userData = {};
                        userData.apiDeveloperId = snap.apiDeveloperId;
                        userData.apiKey = snap.apiKey;
                        userData.token = data.access_token;
                        userData.snapLogin = true;
                        snap.setSnapJsSession("snap_user_session", userData);
                        snap.getSnapUserSession();

                        that.set("token", data.access_token);
                        snap.setHospitalSettings().then(function () {

                            if (that.userTypeId == 1) {
                                that.loginCustomer();
                            }
                            else if (that.userTypeId == 2) {
                                //get persmissions
                                $.ajax({
                                    url: "/api/Account/RoleFunctions",
                                    type: 'GET',
                                    dataType: 'json',
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify(loginRequest),
                                    success: function (data) {
                                        userData.security1to31 = data.security1to31;
                                        userData.security32to63 = data.security32to63;


                                        snap.setSnapJsSession("snap_user_session", userData);
                                        snap.getSnapUserSession();
                                        if (that.isAdminLogin == true) {
                                            if (snap.canLoginAdmin())
                                                that.loginAdmin();
                                            else {
                                                that.errorShake();

                                                snapError("We are unable to find permissions for this program. Please contact customer support regarding your account.");
                                                $('.button').removeClass('button__brand is-loading').addClass('button__red error');
                                            }
                                        }

                                        else {
                                            if (snap.canLoginClinician())
                                                that.loginClinician();
                                            else {
                                                that.errorShake();
                                                snapError("We are unable to find permissions for this program. Please contact customer support regarding your account.");
                                                $('.button').removeClass('button__brand is-loading').addClass('button__red error');
                                            }
                                        }
                                    },
                                    error: function () {
                                        that.errorShake();

                                        snapError("Error finding permissions for this program. Please contact customer support regarding your account.");
                                        $('.button').removeClass('button__brand is-loading').addClass('button__red error');
                                    }

                                });


                            }
                            else if (that.userTypeId == 3) {
                                snap.setSnapJsSession("snap_user_session", userData);
                                that.loginSnapMDAdmin();

                            }
                        });


                    }
                    else {
                        that.errorShake();
                        $('.button').removeClass('button__brand is-loading').addClass('button__red error');
                        snapError("Email and Password combination failed");

                    }
                },
                error: function (xhr) {
                    that.errorShake();
                     $('.button').removeClass('button__brand is-loading').addClass('button__red error');
                     if (xhr.statusText == "Not Found") {
                        snapError("Email and Password combination failed.");
                        $('.inputs__password').addClass('is-error');
                        $('.inputs__email').addClass('is-error');
                    } else {
                        snapError("We are unable to log you in. Please contact customer support regarding your account.");
                        $('.inputs__password').addClass('is-error');
                        $('.inputs__email').addClass('is-error');
                    }
                }

            });

        },
        loadBrowserRecommendationDialog: function (isOldVersion) {
            $('<div/>').load('/Content/OverlayDialog/BrowserRecommendation.html' + snap.addVersion, function () {
                var $div = $(this);

                $(this).find('.brd_skip').click(function () {
                    if ($div.find('#not_show_modal').is(':checked')) {
                        localStorage.showRecommendedBrowser = false;
                    } else {
                        localStorage.showRecommendedBrowser = true;
                    }
                    $div.fadeOut(300);
                    $('input').blur(); //IE11 blink over fixed overlay solution
                });

                if (isOldVersion) {
                    $(this).find('.isBrowser').hide();
                } else {
                    $(this).find('.isVersion').hide();
                }


                $('body').append($(this));
            });
        }



    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };



})(window);
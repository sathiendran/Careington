/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../kendo.all.min-2.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../services/adminDataservice.js" />
; (function ($, snap) {


   

    snap.namespace("snap.admin")
        .use(["adminService", "snapLoader", "snapNotification"])
        .extend(kendo.observable)
        .define("PendingUserViewModel", function ($adminService, $loader, $notification) {
            var $scope = this;
            var countryList = new kendo.data.DataSource({
                data: []
            });
            var timeZoneList = new kendo.data.DataSource({
                data: []
            });
            var isContactValid = function(code, contactNbr) {
                code = $.trim(code);
                contactNbr = $.trim(contactNbr);
                //code or contactNbr missing
                if ((code == "" && contactNbr.length > 0) || (contactNbr == "" && code.length > 0)) {
                    return false;
                }
                return true;
            };


            var that = this, validator = null;

            //view Model Config
            this.isValid = false;
            this.isPendingUser = true;
            this.profileUserId = sessionStorage.getItem("snap_staffViewEditProfile");
            this.hospitalId = snap.hospitalId;
            this.selectedTimeZone = null;
            this.isEdit = false;
            this.selectedPhoneCountryCode = "";
            this.selectedMobileCountryCode = "";
            this.imageSource = "/images/Doctor-Male.gif";
            this.setPhoneCountryCode = function (code) {
                this.set("selectedPhoneCountryCode", code);
            };
            this.setMobileCountryCode = function (code) {
                this.set("selectedMobileCountryCode", code);
            };
            this.setTimeZone = function (code) {
                this.set("selectedTimeZone", code);
            };
            this.mailTo = function () {
                var profile = this.get("profileInfo");
                return ["mailto", profile.email].join(":");
            };
            this.isCancelShow = false;
            this.onEdit = function (e) {
                e.preventDefault();
                this.set("isEdit", true);
                this.set("isCancelShow", true);

            };
            this.tryToSave = function (e) {
                e.preventDefault();
                var data = this.get("profileInfo").toJSON();
                var phoneCountryCode = this.get('selectedPhoneCountryCode');
                var mobileCountryCode = this.get('selectedMobileCountryCode');
                mobileCountryCode = (mobileCountryCode == null) ? '' : mobileCountryCode;   //important: as it could be null

                //validations
                var validationMsg = "";
                
                //name
                if ($.trim(data.firstName) == "") {
                    validationMsg += "Please enter First Name. <br/>";
                }
                if ($.trim(data.lastName) == "") {
                    validationMsg += "Please enter Last Name. <br/>";
                }
                
                //phone number
                var phoneNumber = phoneCountryCode + data.phoneNumber;
                if (phoneCountryCode == null || phoneCountryCode == "") {
                    validationMsg += "Please select Country Code for Phone Number. <br/>";
                }
                if ($.trim(data.phoneNumber) == "") {
                    validationMsg += "Please enter a Phone Number. <br/>";
                }
                if (phoneNumber.length > 16) {  //avoiding '+' sign
                    validationMsg += "Phone Number maximum length 15. <br/>";
                }
                
                //mobile number
                var mobileNumber = mobileCountryCode + data.mobileNumber;
                var validMobile = isContactValid(mobileCountryCode, data.mobileNumber);
                if (!validMobile) {
                    if ($.trim(data.mobileNumber) == "") {
                        validationMsg += "Please enter a Mobile Number or leave it's Country Code blank. <br/>";
                    }
                    if (mobileCountryCode == "") {
                        validationMsg += "Please select Country Code for Mobile Number or leave Mobile Number blank <br/>";
                    }
                } else {
                    if (mobileNumber.length > 16) {  //avoiding '+' sign
                        validationMsg += "Mobile Number maximum length 15. <br/>";
                    }
                }

                //timezone
                if (data.timeZoneId == 0) {
                    validationMsg += "Please select Timezone. <br/>";
                }
                
                if (validationMsg != "") {
                    snapError(validationMsg);
                    return;
                } else {
                    //save throw api
                    $loader.showLoader();
                    data.phoneNumber = phoneNumber;
                    data.mobileNumber = mobileNumber;
                    $adminService.saveData(data).done(function () {
                        $notification.success("Profile Saved");
                        that.loadProfileData();
                    }).always(function () {
                        that.set("isEdit", false);
                        that.set("isCancelShow", false);
                        $loader.hideLoader();
                    });
                }
            };
            this.onCancel = function (e) {
                e.preventDefault();
                this.set("isEdit", false);
                this.set("isCancelShow", false);
                this.loadProfileData();
            };
            this.fullName = function () {
                var profile = this.get("profileInfo");
                return [profile.firstName, profile.lastName].join(" ");
            };
            this.countryCode = countryList;
            this.timeZone = timeZoneList;
            this.profileInfo = {
                firstName: '',
                lastName: '',
                email: '',
                confirmEmail: '',
                profileUrl: '',
                mobileCountryCode: '',
                mobileNumber: '',
                phoneCountryCode: '',
                phoneNumber: '',
                timeZoneId: ''
            };

            this.loadProfileData = function () {
                $loader.showLoader();
            
                var t1 = $adminService.getProfileData(this.profileUserId);
                var t2 = $adminService.getTimeZones();
                var t3 = $adminService.getCountryCodes();
                var that = this;
                $.when(t1, t2, t3).then(function (profile, _timeZone, countryCode) {

                    var tmpTimeZones = [];
                    var message = _timeZone.length ? _timeZone[1] : "Failed to read Timezones";
                    if (message === "success") {
                        _timeZone = _timeZone[0];
                        tmpTimeZones.push({
                            id: 0,
                            name: "Select Timezone",
                        });
                        
                        $.each(_timeZone.data, function () {
                            tmpTimeZones.push(this);
                        });
                        timeZoneList.data(tmpTimeZones);
                    } else {
                        snapError(message);
                    }
                    

                    countryCode = countryCode[0];
                    var tmpCountryCode = [];
                    if (countryCode.success) {
                        countryCode = countryCode.data;
                        
                        tmpCountryCode.push({
                            id: 0,
                            name: "Country Code",
                            code:"",
                        });
                        $.each(countryCode, function () {
                            tmpCountryCode.push(this);
                        });
                        countryList.data(tmpCountryCode);
                       

                    } else {
                        snapError(timeZone.message);
                    }

                    var data = profile[0];
                    if (data.success) {
                        data = data.data;
                        data.confirmEmail = data.email;
                         
                        if (data.phoneNumber && data.phoneNumber != "") {
                            that.setPhoneCountryCode(data.phoneCountryCode);
                            data.phoneNumber = data.phoneNumber.substr(data.phoneCountryCode.length);
                        }

                        if (data.mobileNumber && data.mobileNumber != "") {
                            that.setMobileCountryCode(data.mobileCountryCode);
                            data.mobileNumber = data.mobileNumber.substr(data.mobileCountryCode.length);
                        } else {
                            that.setMobileCountryCode("");
                            data.mobileNumber = "";
                        }
                        data.profileImage = data.profileImagePath 
                            || getDefaultProfileImageForClinician(data.gender);
                        
                        that.set("profileInfo", data);

                        if (data.id) {
                            if (!$scope.isPendingUser) {


                                ProfileImageUploader(
                                    $("#uploadPhoto"),
                                    "clinician",
                                    true,
                                    data.id,
                                    null,
                                    function (imageUrl) {
                                        that.set("profileImage", imageUrl);
                                        if (data.id === snap.profileSession.userId) {
                                            snap.updateSnapJsSession("snap_staffprofile_session", "profileImage", imageUrl);
                                            snap.eventAggregator.published("profileImage:changed", imageUrl);
                                        }
                                    });
                            }
                        }

                    } else {
                        snapError(data.message);
                    }
                }).always(function () {
                    $loader.hideLoader();
                });

            };
            this.initValidation = function (el) {
                $(document).on('keydown', ".phoneSnapInput", function (event) {
                    if ($(this).val() == '' && (event.keyCode == 107 || event.keyCode == 61)) {
                        // (+) sign as a first char
                    }
                    else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
                        // Allow normal operation
                    } else {
                        // Prevent the rest
                        event.preventDefault();
                    }
                });
                

                var errorTemplate = [
                    '<div class="k-widget k-tooltip k-tooltip-validation" style="margin:0.5em">',
                    '<span class="k-icon k-warning"> </span>',
                    '#:message#<div class="k-callout k-callout-n"></div></div>'].join('');

                validator = el.kendoValidator({
                    errorTemplate: errorTemplate,

                    rules: {
                        verifyEmail: function (input) {
                            var ret = true;
                            if (input.is("[name=confirm-email]")) {
                                ret = input.val() === $("#email").val();
                            }

                            return ret;
                        },
                        validmask: function (input) {
                            if (input.is("[data-validmask-msg]") && input.val() != "") {
                                var val = input.val();
                                return val.length > 4;
                            }

                            return true;
                        }
                        
                    },
                    messages: {
                        verifyEmail: "Email do not match!"
                    }
                }).data("kendoValidator");
            };
            this.bind("change", function () {
                if (validator) {
                    var isValid = validator.validate();
                    that.set("isValid", isValid);
                }
            });
        });




}(jQuery, window.snap = window.snap || {}));
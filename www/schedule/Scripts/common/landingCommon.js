//@ sourceURL=landingCommon.js

;
(function($, global, snap) {
    "use strict";

    snap.namespace("snap.shared")
        .define("landingCommon", function() {

            this.interfaceTypeEnum = {
                common: "common",
                patient: "patient",
                provider: "provider",
                caregiver: "caregiver",
                admin: "admin",
                guest: "guest",
                snapmdAdmin: "snapmdAdmin"
            };

            this.loginUserTypeEnum = {
                unknown: 0,
                patient: 1,
                adminProvider: 2,
                snapmdAdmin: 3
            };

            this.events = {
                onContactUSClick: "landingCommon_onContactUSClick",
                onTermsClick: "landingCommon_onTermsClick",
                onDialogClose: "landingCommon_onDialogClose",
                openForgotPasswordDialog: "landingCommon_openForgotPasswordDialog",
                hideLandingMenu: "landingCommon_hideLandingMenu",
            };

            var loginHashCollection = {
                patient: "#/patient",
                provider: "#/provider",
                admin: "#/admin",
                snapmdAdmin: "#/snapmdAdmin"
            };

            var forgotPasswordHashCollection = {
                patient: "#/patient/forgotpassword",
                provider: "#/provider/forgotpassword",
                admin: "#/admin/forgotpassword",
                snapmdAdmin: "#/snapmdAdmin/forgotpassword"
            };

            var localStorageLoginCollection = {
                patient: "snapEmailPatient",
                provider: "snapEmailPhysician",
                admin: "snapEmailAdmin",
                snapmdAdmin: "snapMDAdminEmail"
            };
            
            this.goToLogin = function(interfaceType, email) {
                if (email) {
                    this.storeUserLogin(interfaceType, email);
                }
                var loginHash = loginHashCollection[interfaceType];
                window.location.hash = loginHash || "";
            };

            this.getUserLogin = function(interfaceType) {
                var itemKey = localStorageLoginCollection[interfaceType];
                if (itemKey) {
                    return localStorage.getItem(itemKey);
                }
                return "";
            };
            this.storeUserLogin = function(interfaceType, email) {
                var itemKey = localStorageLoginCollection[interfaceType];
                if (itemKey) {
                    localStorage.setItem(itemKey, email);
                }
            };
            this.clearUserStorage = function(interfaceType) {
                var itemKey = localStorageLoginCollection[interfaceType];
                if (itemKey) {
                    localStorage.setItem(itemKey, "");
                }
            };
        }).singleton();


}(jQuery, window, snap));
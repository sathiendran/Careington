/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />

; (function ($, snap, kendo) {

    "use strict";
    snap.namespace("snap.common")
         .extend(kendo.observable).define("Session", function () {
             this.getHospitalInformation = function () {
                 var hospitalSetting = sessionStorage.getItem("snap_hospital_session");
                 if (hospitalSetting) {
                     hospitalSetting = JSON.parse(hospitalSetting);
                 }
                 return hospitalSetting;
             };
             this.getUserInformation = function () {
                 var userInformation = sessionStorage.getItem("snap_patientprofile_session");
                 if (userInformation) {
                     userInformation = JSON.parse(userInformation);
                 }
                 return userInformation;
             };

         }).singleton();




    snap.namespace("snap.common")
         .extend(kendo.observable).define("Utility", function () {
             var $scope = this;

             this.getEncounterAddressFromPatientProfile = function(profile) {
                var location = profile.encounterAddressLocation ? profile.encounterAddressLocation : profile.addressLocation;

                return getAddress(location, profile);
             };

             this.getLocalAddressFromPatientProfile = function(profile) {
                return getAddress(profile.addressLocation, profile);
             };

             function getAddress(location, profile) {
                var displayLocation;
                if(location) {
                    displayLocation = location.country;
                    if(location.state) {
                        displayLocation = [location.state, location.country].join(", ");
                    }
                } else {
                    displayLocation = profile.address ? profile.address : "";
                }

                return displayLocation;
             }

             this.removePhoneFormat = function (phoneNumber) {
                 phoneNumber = $.trim(phoneNumber);
                 if (phoneNumber !== null) {
                     var result = phoneNumber.trim().replace(/[^0-9]+/gi, '');
                     var isPlus = false;

                     //if ($.contains(phoneNumber, "+"))
                     if (phoneNumber.indexOf("+") > -1)
                         isPlus = true;
                     if (isPlus)
                         result = "+" + result;

                     return result;
                 }
                 else
                     return '';
             };
             this.getNumbersFromString = function (string) {
                 if (string !== null) {
                     string = $.trim(string);
                     return string.replace(/[^0-9]+/gi, '');
                 }
                 else
                     return string;
             };
             this.formatPhoneNumber=function(phoneNumber) {
                 phoneNumber = $.trim(phoneNumber);
                 var pattern;
                 var result;
                 var isPlus = false;
                 var subSet;

                 if (phoneNumber.indexOf("+") > -1) {
                     isPlus = true;
                 }

                 result = $scope.getNumbersFromString(phoneNumber);

                 if (result.length > 9) {

                     if (result.length == 10) {
                         pattern = /\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
                         subSet = '($1) $2-$3';
                     }
                     else if (result.length == 11) {
                         pattern = /\(?(\d{1})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
                         subSet = '$1($2) $3-$4';
                     }

                     else {
                         pattern = /\(?(\d{2})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;

                         subSet = '$1($2) $3-$4';
                     }

                     result = result.replace(pattern, subSet);

                     if (isPlus)
                         result = "+" + result;

                     return result;
                 }
                 else
                     return phoneNumber;
             }

             this.getNumbersFromString=function(string) {
                 if (string !== null) {
                     string = $.trim(string);
                     return string.replace(/[^0-9]+/gi, '');
                 }
                 else
                     return string;
             }

             this.formatErrorMessage = function(error) {
                if (typeof(error) === "undefined" || error === null) {
                    return "Unknown error";
                }

                var errorMessage;
                if (typeof(error) === 'string') {
                    errorMessage = error;
                } else {
                    if (error.status === 500) {
                        errorMessage = "Internal server error";
                    } else if(error.status === 404) {
                        errorMessage = "Not found";
                    } else if(error.responseText) {
                        errorMessage = error.responseText;
                        try{
                            var parsedMessage = JSON.parse(errorMessage);
                            if(!!parsedMessage.message){
                                errorMessage = parsedMessage.message;
                            }
                        } catch(err){
                            snap.util.logToConsole(err);
                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };
         }).singleton();


    snap.namespace("snap.common").use([
        "snapNotification", 
        "snap.DataService.customerDataService"])
    .extend(kendo.observable).define("navigationHelper", function ($snapNotification, $customerDataService) {
        this.patient = {
            goToPatietProfile: function(opt) {
                var message = opt.message ? opt.message : "Viewing this profile will exit current page. Do you want to proceed?";

                $snapNotification.confirmationWithCallbacks(message, function () {
                    $customerDataService.getAccountUserProfiles().done(function(data) {
                        var isUserProfile = data.data.filter(function(profile) {
                            return profile.patientId === opt.patientId; 
                        }).length > 0;

                        sessionStorage.setItem("snap_patientId_ref", opt.patientId);
                        if(isUserProfile) {
                            window.location = snap.baseUrl +  "/patient/User";
                        } else {
                            window.location = snap.baseUrl +  "/patient/Dependent";
                        }
                    }); 
                });
            }
        };

        this.physician = {

        };

        this.admin = {

        };
    }).singleton();
}(jQuery, snap, kendo));










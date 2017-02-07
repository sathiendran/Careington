/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />

; (function ($) {


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
             this.removePhoneFormat = function (phoneNumber) {
                 phoneNumber = $.trim(phoneNumber);
                 if (phoneNumber !== null) {
                     var result = "";
                     var phoneDigits = "";
                     var isPlus = false;

                     //if ($.contains(phoneNumber, "+"))
                     if (phoneNumber.indexOf("+") > -1)
                         isPlus = true;

                     result = phoneNumber.trim().replace(/[^0-9]+/gi, '');

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
                        } catch(e){

                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };
         }).singleton();






}(jQuery));










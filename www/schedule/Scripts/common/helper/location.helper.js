//@ sourceURL=location.helper.js
;
(function($, snap) {
    "use strict";
    snap.namespace("snap.helper")
        .define("locationHelper", function() {

            function AddressLocation(opt) {
                this.countryCode = opt.countryCode || "";
                this.countryName = opt.countryName || "";
                this.regionCode = opt.regionCode || "";
                this.regionName = opt.regionName || "";
            }

            this.encodeLocation = function(locationOpt) {
                if (typeof locationOpt === "string") {
                    // if patient address is provided in string format
                    return {
                        addressText: locationOpt
                    };
                }
                var addressLocation = new AddressLocation(locationOpt);
                if (addressLocation.regionCode) {
                    return {
                        country: addressLocation.countryCode,
                        region: addressLocation.regionCode
                    };
                }
                return {
                    country: addressLocation.countryCode
                };
            };

            this.getEncounterAddressTextFromPatientProfile = function(profile) {
                if (profile.encounterAddressLocation) {
                    return getAddressText(profile.encounterAddressLocation, profile, true);
                } else {
                    return this.getLocalAddressTextFromPatientProfile(profile);
                }
            };

            this.getEncounterAddressLocationFromPatientProfile = function(profile) {
                var locationObj = profile.encounterAddressLocation ? profile.encounterAddressLocation : profile.addressLocation;
                return getLocation(locationObj, profile);
            };

            this.getLocalAddressTextFromPatientProfile = function(profile) {
                return getAddressText(profile.addressLocation, profile);
            };

            this.getLocalAddressLocationFromPatientProfile = function(profile) {
                return getLocation(profile.addressLocation, profile);
            };


            function getAddressText(locationObj, profile, takeFullText) {
                if (locationObj) {
                    if (takeFullText && locationObj.addressText) {
                        return locationObj.addressText;
                    }
                    if (locationObj.state) {
                        return [locationObj.state, locationObj.country].join(", ");
                    } else {
                        return locationObj.country;
                    }
                } else {
                    return profile.address ? profile.address : "";
                }
            }

            function getLocation(locationObj, profile) {
                if (!locationObj) {
                    return profile.address ? profile.address : "";
                }
                return new AddressLocation({
                    countryCode: locationObj.countryCode,
                    countryName: locationObj.country,
                    regionCode: locationObj.stateCode,
                    regionName: locationObj.state
                });
            }
        });

}(jQuery, snap));

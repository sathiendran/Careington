//@ sourceURL=patientResponseAddressDialog.viewmodel.js

(function ($, snap, global) {
    "use strict";

    snap.namespace("snap.patient")
    .use([
            "snapNotification", 
            "snap.EventAggregator",
            "snap.admin.patientRules.ruleService",
            "snap.DataService.customerDataService",
            "snap.helper.locationHelper"
        ])
        .define("patientResponseAddressDialog", function ($snapNotification, $eventAggregator, $ruleService, $customerDataService,  $locationHelper) {
            var dialog = null,
                patientId = null;


        	this.isEditMode = false;

        	this.countryCodes = [];
        	this.regions = [];

            this.selectedCountry = null;
            this.selectedRegion = null;
            this.currentLocationText = "";
            this.currentLocation = "";

            this.vm_isLocationAutocompleteFocused = false;
            this.vm_countryError = false;
            this.vm_isCountryFilled = true;
            this.vm_stateError = false;
            this.vm_isStateFilled = false;
            this.vm_isError = false;
            this.vm_isLoading = false;

            this.vm_patientProfileImg = global.getDefaultProfileImageForPatient();


            /* Initialization */

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                patientId = opt.opt.patientId;

                this.set("currentLocationText", opt.opt.currentLocationText);
                this.set("vm_patientProfileImg", opt.opt.imageSource || global.getDefaultProfileImageForPatient());
                this.set("vm_fullName", opt.opt.fullName);
                this.set("vm_firstName", opt.opt.firstName);

                this.currentLocation = opt.opt.currentLocation;

                var that = this;
                this._loadCountries().done(function() {
                    that._loadStatesForSelectedCountry();
                });

                this.set("isEditMode", false);
                this.set("vm_isLocationAutocompleteFocused", false);
                this.set("vm_countryError", false);
                this.set("vm_stateError", false);
                this.set("vm_isError", false);
                this.set("vm_isLoading", false);

                this.set("vm_isLoading", false);

                this.trigger("change", { field: "vm_isSelfLocationDialog" });
                this.trigger("change", { field: "vm_saveButtonText"});
            };

            this.loadNonMVVM = function () {
                var that = this;

                $('.search input').on('focus', function() {
                    //that.set("vm_isLocationAutocompleteFocused", true);
                });

                $('.search input').on('blur', function(){
                    //that.set("vm_isLocationAutocompleteFocused", false);
					that.set("vm_isLocationAutocompleteFocused", true);
                });
            };


            /* MVVM properties */

            this.vm_saveButtonText = function() {
                return this.vm_isError ? "Retry?" : "Save";
            };

            this.vm_isRegionsAutocompleteEnable = function() {
                return this.regions.length > 0;
            };

            this.vm_isSelfLocationDialog = function() {
                return patientId === snap.profileSession.profileId;
            };


            /* MVVM actions */

            this.vm_onYesClick = function() {
                this.set("vm_isLoading", true);

                var that = this;

                var locationEncoded = $locationHelper.encodeLocation(this.currentLocation);

                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function(response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", that.currentLocation, addressText);
                });
            };

            this.vm_onNoClick = function() {
            	this.set("isEditMode", true);
            };

            this.vm_onCancelClick = function() {
            	this.set("isEditMode", false);
            };

            this.vm_onSaveClick = function() {
                if(!this._validate()) {
                    this.set("vm_isError", true);
                    this.trigger("change", { field: "vm_saveButtonText"});
                    return false;
                }

                this.set("vm_isError", false);
                this.trigger("change", { field: "vm_saveButtonText"});

                this.set("vm_isLoading", true);

                var selectedLocation = {
                    countryCode: this.selectedCountry.value,
                    countryName: this.selectedCountry.text,
                    regionCode: this.selectedRegion ? this.selectedRegion.value : null,
                    regionName: this.selectedRegion ? this.selectedRegion.text : null
                };
                var locationEncoded = $locationHelper.encodeLocation(selectedLocation);

                var that = this;
                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function(response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", selectedLocation, addressText);
                });
            };

            this.vm_onCountryChange = function() {
                this._loadStatesForSelectedCountry();
            };

            this.vm_onRegionChange = function() {
                this.set("vm_stateError", !this.selectedRegion || !this.selectedRegion.value);
                this.set("vm_isError", this.vm_stateError);
                this.trigger("change", { field: "vm_saveButtonText"});

                this.set("vm_isStateFilled", !this.vm_stateError);
            };



            /* Private methods */

            this._loadCountries = function() {
                var that = this;
                return $customerDataService.getProviderLicensePatientAddressMetaRule().done(function(data){
                    var d = data.data[0].countries.map(function(country) {
                        var obj = { 
                            text: $.trim(country.country),
                            value: $.trim(country.countryCode)
                        };

                        if(country.regions) {
                            obj.regions = country.regions.map(function(region) {
                                return { 
                                    text: $.trim(region.region),
                                    value: $.trim(region.regionCode)
                                };
                            }).sort(compareCodesByName);
                        }

                        return obj;
                    }).sort(compareCodesByName);

                    that.set("countryCodes", d);

                    // select current location country
                    var selectedCountryCode = that.currentLocation.countryCode || "US";
                    var defaultCountry = d.find(function(el) {
                        return el.value === selectedCountryCode;
                    });
                    defaultCountry = defaultCountry || d[0];
                    that.set("selectedCountry", defaultCountry);
                });
            };

            this._loadStatesForSelectedCountry = function() {
                this.set("regions", []);
                this.set("selectedRegion", null);
                this.set("vm_stateError", false);
                this.set("vm_isStateFilled", false);
                
                if (this.selectedCountry && this.selectedCountry.value) {
                    this.set("vm_countryError", false);
                    this.set("vm_isError", false);

                    if(this.selectedCountry.regions) {
                        this.set("regions", this.selectedCountry.regions);
                    }
                } else {
                    this.set("vm_countryError", true);
                    this.set("vm_isError", true);
                }

                this.set("vm_isCountryFilled", !this.vm_countryError);

                this.trigger("change", { field: "vm_isRegionsAutocompleteEnable" });
                this.trigger("change", { field: "vm_saveButtonText"});
            };

            this._validate = function() {
                if(!this.selectedCountry || !this.selectedCountry.value) {
                    this.set("vm_countryError", true);
                    return false;
                }

                if(this.vm_isRegionsAutocompleteEnable()) {
                    if(!this.selectedRegion || !this.selectedRegion.value) {
                        this.set("vm_stateError", true);
                        return false;
                    }
                }

                return true;
            };

			function compareCodesByName(a, b) {
	            if (a.text < b.text)
	                return -1;
	            if (a.text > b.text)
	                return 1;
	            return 0;
	        }
        }).singleton();
}(jQuery, snap, window));
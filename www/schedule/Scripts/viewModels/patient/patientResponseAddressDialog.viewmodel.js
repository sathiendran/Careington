//@ sourceURL=patientResponseAddressDialog.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient")
    .use([
            "snapNotification", 
            "snap.EventAggregator",
            "snap.admin.patientRules.ruleService",
            "snap.DataService.customerDataService"
        ])
        .define("patientResponseAddressDialog", function ($snapNotification, $eventAggregator, $ruleService, $customerDataService) {
        	var userId = null;
            var patientId = null;
        	var dialog = null;

        	this.isEditMode = false;

        	this.countryCodes = [];
        	this.regions = [];

            this.selectedCountry = "United States of America";
            this.selectedRegion = null;
            this.currentLocation = "";

            this.setOptions = function(opt) {
                patientId = opt.opt.patientId;
            	userId = opt.opt.userId;
            	dialog = opt.dialog;


                var location = opt.opt.patientProfile.encounterAddressLocation ? opt.opt.patientProfile.encounterAddressLocation : opt.opt.patientProfile.addressLocation;

                var displayLocation = "";
                if(location) {
                    displayLocation = location.country;
                    if(location.state) {
                        displayLocation = [location.state, location.country].join(", ");
                    }
                } else {
                    displayLocation = opt.opt.patientProfile.address;
                }

                this.set("currentLocation", displayLocation);

                var that = this;
                this.loadCountries().done(function() {
                    that.loadStatesForSelectedCountry();
                });
            };

            this.vm_isRegionsAutocompleteEnable = function() {
                return this.regions.length > 0;
            };
            this.vm_countryError = false;
            this.vm_stateError = false;
            this.vm_isError = false;
            this.vm_isLoading = false;
            this.vm_saveButtonText = "Save";

            this.vm_onYesClick = function() {
                this.set("vm_isLoading", true);

                var that = this;
                $customerDataService.updatePatientResponseAddress(this.currentLocation).done(function() {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed");
                });
            };

            this.vm_onNoClick = function() {
            	this.set("isEditMode", true);
            };

            this.vm_onCancelClick = function() {
            	this.set("isEditMode", false);
            };

            this.vm_isSaveDisabled = true;

            this.vm_onSaveClick = function() {
                if(!this._validate()) {
                    this.set("vm_isError", true);
                    this.set("vm_saveButtonText", "Retry?");
                    return false;
                }

                this.set("vm_isError", false);
                this.set("vm_saveButtonText", "Save");

                this.set("vm_isLoading", true);

                
                var address = [this.selectedRegion, this.selectedCountry].join(", ");

                var that = this;
                $customerDataService.updatePatientResponseAddress(address).done(function() {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed");
                });
            };

            this.vm_onCountryChange = function() {
                this.loadStatesForSelectedCountry();
            };

            this.vm_onRegionChange = function() {
                var selectedRegion = searchByText(this.regions, this.selectedRegion) ;
                
                this.set("vm_stateError", selectedRegion === null);

                if(selectedRegion){
                    this.set("vm_isSaveDisabled", false);
                } else{
                    this.set("vm_isSaveDisabled", true);
                }
            };

            this.loadCountries = function() {
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
                });
            };

            this.loadStatesForSelectedCountry = function() {
                this.set("regions", []);
                this.set("selectedRegion", null);
                
                var selectedCountry = searchByText(this.countryCodes, this.selectedCountry);
                if(selectedCountry !== null) {
                    this.set("vm_countryError", false);

                    if(selectedCountry.regions) {
                        this.set("regions", selectedCountry.regions);
                        this.set("vm_isSaveDisabled", true);
                    } else {
                        this.set("vm_isSaveDisabled", false);
                    }
                } else {
                    this.set("vm_countryError", true);
                    this.set("vm_isSaveDisabled", true);
                }

                this.trigger("change", { field: "vm_isRegionsAutocompleteEnable" });
            };

            this._validate = function() {
                var selectedCountry = searchByText(this.countryCodes, this.selectedCountry);
                if(selectedCountry === null) {
                    this.set("vm_countryError", true);
                    return false;
                }

                if(this.vm_isRegionsAutocompleteEnable()) {
                    var selectedRegion = searchByText(this.regions, this.selectedRegion);
                    if(selectedRegion === null) {
                        this.set("vm_stateError", true);
                        return false;
                    }
                }

                return true;
            };

            function searchByText(arr, text) {
                if(text) {
                    for(var i = 0; i < arr.length; i++) {
                        var country = $.trim(arr[i].text.toLowerCase());
                        var input = $.trim(text.toLowerCase());

                        if(country === input)
                            return arr[i];
                    }
                }

                return null;
            }

			function compareCodesByName(a, b) {
	            if (a.text < b.text)
	                return -1;
	            if (a.text > b.text)
	                return 1;
	            return 0;
	        }

            this.loadNonMVVM = function() {
            };
        }).singleton();
}(jQuery, snap, kendo));
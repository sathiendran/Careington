//@ sourceURL=patientResponseAddressDialog.viewmodel.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.patient")
    .use([
            "snapNotification", 
            "snap.EventAggregator",
            "snap.admin.patientRules.ruleService",
            "snap.DataService.customerDataService",
            "snap.common.utility"
        ])
        .define("patientResponseAddressDialog", function ($snapNotification, $eventAggregator, $ruleService, $customerDataService,  $utility) {
            var dialog = null,
                patientId = null;


        	this.isEditMode = false;

        	this.countryCodes = [];
        	this.regions = [];

            this.selectedCountry = "United States of America";
            this.selectedRegion = null;
            this.currentLocation = "";

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                patientId = opt.opt.patientId;

                this.set("currentLocation", opt.opt.currentLocation);
                this.set("vm_patientProfileImg", opt.opt.imageSource);
                this.set("vm_fullName", opt.opt.fullName);
                this.set("vm_firstName", opt.opt.firstName);

                var that = this;
                this.loadCountries().done(function() {
                    that.loadStatesForSelectedCountry();
                });

                this.set("isEditMode", false);
                this.set("vm_isLocationAutocompleteFocused", false);
                this.set("vm_countryError", false);
                this.set("vm_stateError", false);
                this.set("vm_isError", false);
                this.set("vm_isLoading", false);

                this.set("vm_isLoading", false);

                this.trigger("change", { field: "vm_isSelfLocationDialog" });
            };

            this.vm_isRegionsAutocompleteEnable = function() {
                return this.regions.length > 0;
            };

            this.vm_isLocationAutocompleteFocused = false;
            this.vm_countryError = false;
            this.vm_isCountryFilled = true;
            this.vm_stateError = false;
            this.vm_isStateFilled = false;
            this.vm_isError = false;
            this.vm_isLoading = false;
            this.vm_saveButtonText = "Save";

            this.vm_patientProfileImg = "";

            this.vm_isSelfLocationDialog = function() {
                return patientId === snap.profileSession.profileId;
            }

            this.vm_onYesClick = function() {
                this.set("vm_isLoading", true);

                var that = this;
                $customerDataService.updatePatientResponseAddress(this.currentLocation, patientId).done(function() {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", that.currentLocation);
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

                
                var address = this.selectedCountry;
                if(this.selectedRegion) {
                    address = [this.selectedRegion, this.selectedCountry].join(", ");
                }

                var that = this;
                $customerDataService.updatePatientResponseAddress(address, patientId).done(function() {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", address);
                });
            };

            this.vm_onCountryChange = function() {
                this.loadStatesForSelectedCountry();

                if (this.selectedCountry.length > 0) {
                    this.set("vm_isCountryFilled", true);
                } else {
                    this.set("vm_isCountryFilled", false);
                }
            };

            this.vm_onRegionChange = function() {
                var selectedRegion = searchByText(this.regions, this.selectedRegion) ;
                
                this.set("vm_stateError", selectedRegion === null);

                if(selectedRegion){
                    this.set("vm_isSaveDisabled", false);
                    this.set("vm_isStateFilled", true);
                } else{
                    this.set("vm_isSaveDisabled", true);
                    this.set("vm_isStateFilled", false);
                }
            };

            this.vm_onFocus = function() {
                console.log("fff");
            }

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

			this.loadNonMVVM = function () {
                var that = this;

			    $('.search input').on('focus', function() {
                    that.set("vm_isLocationAutocompleteFocused", true);
                });

                $('.search input').on('blur', function(){
                    that.set("vm_isLocationAutocompleteFocused", false);
                });
            };
        }).singleton();
}(jQuery, snap));
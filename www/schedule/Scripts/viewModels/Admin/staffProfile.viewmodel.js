snap.namespace("Snap.Admin")
       .define("StaffProfileDataSources", function () {
           this.GetCountriesSrc = function () {
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: [snap.baseUrl, "/api/countrycode"].join(""),
                           dataType: "json"
                       }
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data;
                           return data;
                       },
                       id: "id"
                   }
               });
           };


           this.GetTimeZoneSrc = function () {
               return snap.dataSource.getTimeZones();
           };

           this.GetDepartmentsSrc = function (hospitalId) {
               return new kendo.data.DataSource({
                   serverFiltering: true,
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/departments/hospital/', hospitalId].join(''),
                           dataType: "json"
                       },
                       parameterMap: function (data, type) {
                           if (type === "read") {
                               return { searchText: data.filter.filters[0].value };
                           }
                       }
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data;
                           return data;
                       },
                       id: "id"
                   }
               });
           };
           this.GetSpecialitySrc = function (hospitalId) {
               return new kendo.data.DataSource({
                   serverFiltering: true,
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/doctorspeciality/hospital/', hospitalId].join(''),
                           dataType: "json"
                       },
                       parameterMap: function (data, type) {
                           if (type === "read") {
                               return { searchText: data.filter.filters[0].value };
                           }
                       }
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data;
                           return data;
                       },
                       id: "id"
                   }
               });
           };
       }).singleton();




function RegionSelectorItem(opts) {
    this.stateCode = opts.regionCode;
    this.state = opts.region;
    this.isChecked = !!opts.isChecked;
    this.vm_isCheckedToggle = function () {
        this.set("isChecked", !this.isChecked);
    };
}

function getRegionACItem(opts, scope) {
    return !!opts ? kendo.observable({
        stateCode: opts.stateCode,
        state: opts.state,
        vm_onUnselectClick: function (e) {
            e.preventDefault();
            scope._removeSelectedItem(this.stateCode);
        },
        isEditable: scope.isEditable
    }) : null;
}

var ccItemId = 0;

function CountryCodesItem(opts, callbacks ) {
    function getRegions(countriesSource, countryCode) {
        var dfd = $.Deferred();
        countriesSource.read().done(function () {
            var countryData = countriesSource.data().find(function (item) {
                return item.countryCode === countryCode;
            });
            if (countryData) {
                dfd.resolve(countryData.regions || []);
            }
        });
        return dfd.promise();
    }
    this._id = ccItemId++;
    this._generateExcludeCodesCallback = function () {
        var that = this;
        return function () {
            return callbacks.excludeCallback().filter(function (item) {
                return item.countryCode !== that.countryCode
            }).map(function (item) {
                return item.countryCode;
            });
        }
    }
    this._setUpCountriesSource = function(){
        this.set("countriesSource", callbacks.getCoutriesDataSource(this._generateExcludeCodesCallback()));
    }
    this.countryCode = opts.countryCode || "NONE";
    this.selectedRegions = [];
    this.regionsSource = [];//new kendo.Data.DataSource()
    this.countriesSource = [];
    this.isEditable = false;




    this._removeSelectedItem = function (stateCode) {
        this.set("selectedRegions", this.selectedRegions.filter(function (item) {
            return item.stateCode !== stateCode;
        }));
        this.regionsSource.find(function (item) {
            return item.stateCode === stateCode;
        }).set("isChecked", false);
    };

    this._setUpRegions = function (regionsObj) {
        var that = this;
        this._setUpRegionsSource().done(function () {
            if (regionsObj) {

                regionsObj.forEach(function (ro) {
                    var region = that.regionsSource.find(function (r) {
                        return r.stateCode === ro.regionCode;
                    });
                    region.set("isChecked", true);
                    that.selectedRegions.push(getRegionACItem(region, that));
                });

                that.trigger("change", { field: "selectedRegions" });
            }
        });
    };

    this._setEditable = function (isEditable) {
        this.set("isEditable", isEditable);
        this.selectedRegions.forEach(function (item) {
            item.set("isEditable", isEditable);
        })
    };

    this._setUpRegionsSource = function () {
        var def = $.Deferred()
        var that = this;
        that._setUpCountriesSource();
        getRegions(that.countriesSource, that.countryCode).done(function (response) {
            var regions = response.map(function (item) {
                return new kendo.observable(new RegionSelectorItem(item));
            });
            that.set("regionsSource", regions);
            that.trigger("change", { field: "vm_HasRegions" });
            def.resolve();
        });
        return def.promise();
    };

    this.validateRegions = function () {
        if (this.countryCode !== "NONE" && this.selectedRegions.length === 0 && this.regionsSource.length > 0) {
            this.set("vm_isRegionsError", true);
            var that = this;
            var selectedCountry = this.countriesSource.data().find(function (item) {
                return item.countryCode === that.countryCode;
            });
            if (selectedCountry) {
                this.set("vm_countryName", selectedCountry.country);
            }
            return false;
        } else {
            this.set("vm_isRegionsError", false);
            return true;
        }
       
    };

    this.extractRegions = function () {
        if (this.countryCode === "NONE") {
            return null;
        }

        var res = {
            countryCode: this.countryCode
        };

        if (this.selectedRegions.length > 0) {
            res.regions = [];
            this.selectedRegions.forEach(function (item) {
                res.regions.push({
                    regionCode: item.stateCode
                });
            });
        }
        return res;
    }

    this.vm_autocompleteSelectedRegion = "";
    this.vm_isRegionSelectorActive = false;
    this.vm_nameFilter = "";
    this.vm_isRegionsError = false;

    this.vm_HasRegions = function () {
        return this.regionsSource.length > 0;
    };
    
    this.vm_onChangeCountryCode = function () {
        var that = this;
        this._setUpRegionsSource();
        this.set("selectedRegions", []);
        this.set("vm_isRegionsError", false);
        callbacks.notifyCountriesCodeChanged();
    };

    this.vm_onRegionSelectorOpenClick = function (e) {
        e.preventDefault();
        if (!this.isEditable) {
            return;
        }
        var that = this;
        this.set("vm_nameFilter", "");
        this.regionsSource.forEach(function (item) {
            item.set("isChecked", false);
        });
        for (var i = 0, l = this.selectedRegions.length; i < l; i++) {
            this.regionsSource.find(function (item) {
                return item.stateCode === that.selectedRegions[i].stateCode;

            }).set("isChecked", true);
        }
        this.set("vm_isRegionSelectorActive", true);
    };

    this.vm_onDoneWithItemSelectionClick = function (e) {
        e.preventDefault();
        var that = this;
        this.selectedRegions = [];
        this.set("vm_isRegionsError", false);
        this.regionsSource.forEach(function (item) {
            if (item.isChecked) {
                that.selectedRegions.push(getRegionACItem(item, that));
            }

        });
        this.set("vm_isRegionSelectorActive", false);
        this.trigger("change", { field: "selectedRegions" });
    };

    this.vm_onRegionSelect = function (e) {
        var that = this;
        var region = this.regionsSource.find(function (item) {
            return item.state === that.vm_autocompleteSelectedRegion && item.isChecked === false;
        });
        if (region) {
            region.isChecked = true;
            this.selectedRegions.push(getRegionACItem(region,this));
            this.trigger("change", { field: "selectedRegions" });
            this.set("vm_autocompleteSelectedRegion", "");
        }

    };
    this.vm_regionsFilteredSource = function () {
        var that = this;
        if (this.vm_nameFilter !== "") {
            return this.get("regionsSource").filter(function (item) {
                return item.state.toLocaleLowerCase().indexOf(that.vm_nameFilter.toLocaleLowerCase()) > -1;
            });
        }
        return this.get("regionsSource");
    }

    this.vm_nameFilterChange = function () {
        this.trigger("change", { field: "vm_regionsFilteredSource" });
    }

    this.vm_removeCountry = function () {
        callbacks.removeLicensedRegion(this._id);
    }
}


snap.namespace("Snap.Admin").use(["snapNotification", "snapHttp", "snapLoader", "Snap.Admin.StaffProfileDataSources", "snap.service.staffAccountService"])
    .extend(kendo.observable)
   .define("StaffProfileViewModel", function ($snapNotification, $snapHttp, snapLoader, $ds, $service) {

       var countries = [];
       var isCountryCodesLoading = false;
       var countryCodesLoadingDeferred;
       this.extractStateLicensedObject = function (licensedRegionDS) {
           var stateLicensedObj = [];
           licensedRegionDS.forEach(function (item) {
               var regionsObj = item.extractRegions();
               if (regionsObj !== null) {
                   stateLicensedObj.push(regionsObj);
               }
           });

           return stateLicensedObj;
       };

       var $vm = this;
       this.isEditable = false;

       this.firstName = "";
       this.lastName = "";
       this.email = "";
       this.confirmEmail = "";
       this.homeCode = "";
       this.homePhone = "";
       this.cellCode = "";
       this.cellPhone = "";
       this.timeZoneId = "";
       this.textAlerts = false;

       this.isActive = false;

       this.gender = "";

       var defaultProfileImage = getDefaultProfileImageForClinician(this.gender);
       this.profileImage = defaultProfileImage;
       this.profileImagePath = defaultProfileImage;

       this.ageText = "";
       this.dob = null;
       this.practicingSinse = "";
       this.department = "";
       this.medicalSpeciality = "";
       this.subSpeciality = "";
       this.medicalLicense = "";
       this.statesLicensed = "";
       this.schoolOfMedicine = "";
       this.yearOfStateRegistration = "";
       this.preMedicalEducation = "";
       this.internsip = "";
       this.residency = "";
       this.businessAddress = "";
       this.rxntUserName = "";
       this.rxntPassword = "";
       this.ehrExternalUserId = "";
       this.ehrExternalUserName = "";
       this.practicingSinse = "";

       this.isGB = snap.hospitalSession.locale == 'en-GB';
       this.rxntEnabled = snap.hasAnyPermission(snap.security.e_prescription_authorization) && snap.hospitalSettings.ePrescriptions;


       this.isPatientFacing = true;
       this.isPrimaryAdmin = false;
       this.isPartner = false;
       this.isPhysician = false;

       this.countriesSource = [];
       this.timezonesSource = [];
       this.departmentsSource = [];
       this.specialitiesSource = [];

       this.licensedRegionDS = [];
       this.vm_hasLicensedRegions = function () {
           if (this.isEditable) {
               return true;
           }
           return this.extractStateLicensedObject(this.licensedRegionDS).length > 0;
       }
       var countryCodesCallbacks = {
           excludeCallback :  function(){
               return $vm.extractStateLicensedObject($vm.licensedRegionDS);},
           getCoutriesDataSource: function (getExcludeCodesCallback) {
               function filterResponse(countriesResoponse, getExcludeCodesCallback) {
                   var exculeCodes = getExcludeCodesCallback();
                   var filteredResponse = countriesResoponse.filter(function (item) {
                       var exdcludeEnterance = exculeCodes && exculeCodes.find(function (exItem) {
                           return item.countryCode === exItem;
                       });
                       return !exdcludeEnterance;
                   });
                   return filteredResponse;
               }
               return new kendo.data.DataSource({
                   transport: {
                       read: function (options) {
                           if (countries.length) {
                               options.success(filterResponse(countries, getExcludeCodesCallback));
                               return;
                           } else if (!isCountryCodesLoading) {
                               isCountryCodesLoading = true;
                               countryCodesLoadingDeferred = $.ajax({
                                   url: '/api/v2.1/admin/rules/patient-provider-license-meta-rules?providerId=' + snap.hospitalSession.hospitalId,
                                   dataType: "json",
                                   type: 'get'
                               }).promise();

                           }

                           countryCodesLoadingDeferred.done(function (response) {
                               countries = [{ country: "Select Country", countryCode: "NONE" }].concat(response.data[0].countries);
                               options.success( filterResponse(countries, getExcludeCodesCallback));
                           });

                       }

                   }

               });
           },
           notifyCountriesCodeChanged: function(){
               $vm.licensedRegionDS.forEach(function(item){
                   item.countriesSource.read();
               });
           },
           removeLicensedRegion: function(id){
               $vm.licensedRegionDS = $vm.licensedRegionDS.filter(function (item) {
                   return item._id !== id;
               });
               if ($vm.licensedRegionDS.length === 0) {
                   var ccItem = new kendo.observable(new CountryCodesItem({}, countryCodesCallbacks));
                   ccItem._setEditable($vm.isEditable);
                   ccItem._setUpCountriesSource();
                   $vm.licensedRegionDS.push(ccItem);
               }
               $vm.trigger("change", { field: "licensedRegionDS" });
           }
       };

       this.addLicense = function (e) {
           e.preventDefault();
           if (!this.isEditable) {
               return;
           }
           var emptyRegion = new kendo.observable(new CountryCodesItem({}, countryCodesCallbacks ));
           emptyRegion._setEditable(this.isEditable);
           emptyRegion._setUpCountriesSource();
           this.licensedRegionDS.push(emptyRegion);
           this.trigger("change", { field: "licensedRegionDS" });
           this.trigger("change", { field: "vm_hasLicensedRegions" });
       }

       this._setLicensedRegions = function (licensedRegionsJSON) {
           var that = this;
           try {
               var regionsObj = JSON.parse(licensedRegionsJSON);
               if (regionsObj.length) {
                   regionsObj.forEach(function (regionItem) {
                       var ccItem = new kendo.observable(new CountryCodesItem(regionItem, countryCodesCallbacks));
                       ccItem._setUpRegions(regionItem.regions);
                       ccItem._setEditable(that.isEditable);
                       that.licensedRegionDS.push(ccItem);
                   });
               } else {
                   var ccItem = new kendo.observable(new CountryCodesItem({}, countryCodesCallbacks));
                   ccItem._setEditable(that.isEditable);
                   ccItem._setUpCountriesSource();
                   this.licensedRegionDS.push(ccItem);
               }
           }
           catch (e) {
               var ccItem = new kendo.observable(new CountryCodesItem({}, countryCodesCallbacks));
               ccItem._setEditable(that.isEditable);
               ccItem._setUpCountriesSource();
               this.licensedRegionDS.push(ccItem);
           }

           this.trigger("change", { field: "licensedRegionDS" });
           this.trigger("change", { field: "vm_hasLicensedRegions" });
       }


       this.roles = [];
       this.tags = [];

       this.canSchedule = function () {
           return !this.isEditable && this.isActive;
       };

       this.fullName = function () {
           return this.get("firstName") + " " + this.get("lastName");
       };

       this.mailto = function () {
           return "mailto://" + this.get("email");
       };

       this.noTags = function () {
           return this.get("tags").length == 0;
       };

       this.sendTag = function (e) {
           if (e.keyCode == 13) {
               e.preventDefault;
               e.target.value.split(",").forEach(function (tg) {
                   var tag = $.trim(tg);
                   if (tag != "") {
                       $vm.tags.push({
                           tag: tag, id: $vm.tags.length, removeTag: function (e) {
                               e.preventDefault();
                               $vm.set("tags", $vm.tags.filter(function (item) {
                                   return item.id != e.data.id;
                               }).map(function (item, idx) {
                                   item.id = idx; return item;
                               }));
                           }
                       });
                   }
               });
               this.trigger("change", { field: "tags" });
               this.set("newTag", "");
           }
       };

       this.makeEditable = function (e) {
           e && e.preventDefault();
           //Remoced permissions check as it was hardcoded
           this.set("isEditable", true);
           
           this.licensedRegionDS.forEach(function (item) {
               item._setEditable(true);
           });
           
           snap.isEditingStaffProfile = true;
           this.trigger('change', { field: "canSchedule" });
           this.trigger("change", { field: "vm_hasLicensedRegions" });
       };

       this.makeReadonly = function () {
           this.set("isEditable", false);
           this.trigger("change", { field: "vm_hasLicensedRegions" });
           this.licensedRegionDS.forEach(function (item) {
               item._setEditable(false);
           });
           snap.isEditingStaffProfile = false;
           this.trigger('change', { field: "canSchedule" });
       };

       this.textValidate = function (e) {
           //from snap.common.js
           textValidate(e);
       };
       this.yearValidate = function (e) {
           if (e.target.value.length > 4) {
               e.preventDefault();
           } else {
               //from snap.common.js
               textValidate(e);
           }
       };
       this.cancelEdit = function (e) {
           e.preventDefault();
           if (this.staffId) {
               $service.getAccountInfo(this.staffId).done(function (response) {
                   if (response.data && response.data.length === 1) {
                       $vm.setData(response.data[0]);
                   }
               });
               $vm.set("isEditable", false);
               $vm.trigger('change', { field: "canSchedule" });
           }

       };



       this.setData = function (data) {
           this.set("firstName", data.name);
           this.set("lastName", data.lastName);
           this.set("email", data.emailID);
           this.set("confirmEmail", data.emailID);
           this.set("homeCode", this.isPhysician ? "" : data.phoneCountryCode);
           this.set("cellCode", data.mobileCountryCode);
           this.set("homePhone", this.isPhysician ? data.homePhone : data.homePhone.substring(data.phoneCountryCode.length));
           this.set("cellPhone", data.mobilePhone.substring(data.mobileCountryCode.length));
           this.set("timeZoneId", data.timeZoneId);
           this.set("textAlerts", data.textAlerts === "Y");
           this.set("gender", data.gender);
           this.set("isActive", data.isActive === "A");
           this.set("ageText", data.ageString);
           this.set("dob", formatJSONDate1(data.dob));
           this.set("practicingSinse", data.yearsOfExperience);
           this.set("department", data.department);
           this.set("medicalSpeciality", data.medicalSpecialityDescription);
           this.set("subSpeciality", data.subSpecialityDescription);
           this.set("medicalLicense", data.medicalLicence);
           this.set("schoolOfMedicine", data.medicineSchool);
           this.set("preMedicalEducation", data.preMedicalEduc);
           this.set("internsip", data.internShip);
           this.set("residency", data.homeAddress);
           this.set("businessAddress", data.businessAddress);
           this.set("rxntUserName", data.rxntUserName);
           this.set("rxntPassword", data.rxntPassword);
           this.set("ehrExternalUserId", data.ehrIntegrationUserId);
           this.set("ehrExternalUserName", data.ehrIntegrationUserName);

           this.set("profileImage", data.profileImagePath
               || getDefaultProfileImageForClinician(data.gender));

           //This field is oddly named in response. Actually it means that this user is NOT the last Master Admin in this hospital
           this.set("isPrimaryAdmin", !data.primaryAdmin);
           this.set("isPartner", !!data.partnerID);
           this.setUpCellCode();
           if (!this.isPhysician) {
               this.setUpHomeCode();
           }

           this._setLicensedRegions(data.statesLicenced);

           this.trigger('change', { field: "canSchedule" });
       };

       this._setUpCountryCode = function (codeFieldName, phone, source) {
           if (!this.get(codeFieldName)) {
               if (!!phone) {
                   source.read().done(function () {
                       var codesData = source.data();
                       if (codesData && codesData.length > 0) {
                           $vm.set(codeFieldName, codesData[0].code);
                       }
                   })
               }
           }
       }

       this.setUpCellCode = function () {
           this._setUpCountryCode("cellCode", this.cellPhone, this.countriesSource);
       };
       this.setUpHomeCode = function () {
           this._setUpCountryCode("homeCode", this.homePhone, this.countriesSource);
       };

       this.initDataSources = function (hospitalId) {
           this.set("countriesSource", $ds.GetCountriesSrc());
           this.set("timezonesSource", $ds.GetTimeZoneSrc());
           this.set("departmentsSource", $ds.GetDepartmentsSrc(hospitalId));
           this.set("specialitiesSource", $ds.GetSpecialitySrc(hospitalId));
           this.set("subSpecialitiesSource", $ds.GetSpecialitySrc(hospitalId));
       };

       this.trimAll = function () {
           this.set("email", $.trim(this.email));
           this.set("confirmEmail", $.trim(this.confirmEmail));
           this.set("firstName", $.trim(this.firstName));
           this.set("lastName", $.trim(this.lastName));
           this.set("homePhone", $.trim(this.homePhone));
           this.set("cellPhone", $.trim(this.cellPhone));
           this.set("department", $.trim(this.department));
           this.set("medicalSpeciality", $.trim(this.medicalSpeciality));
           this.set("subSpeciality", $.trim(this.subSpeciality));
           this.set("medicalLicense", $.trim(this.medicalLicense));
           this.set("practicingSinse", $.trim(this.practicingSinse));
           this.set("statesLicensed", $.trim(this.statesLicensed));
           this.set("schoolOfMedicine", $.trim(this.schoolOfMedicine));
           this.set("preMedicalEducation", $.trim(this.preMedicalEducation));
           this.set("internsip", $.trim(this.internsip));
           this.set("residency", $.trim(this.residency));
           this.set("businessAddress", $.trim(this.businessAddress));
           this.set("rxntUserName", $.trim(this.rxntUserName));
           this.set("rxntPassword", $.trim(this.rxntPassword));
           this.set("ehrExternalUserId", $.trim(this.ehrExternalUserId));
           this.set("ehrExternalUserName", $.trim(this.ehrExternalUserName));
       };

       this.validateInput = function () {
           var validationResult = {
               isValid: true,
               message: ""
           };
           this.trimAll();

           if (this.email == "" || this.email == null || this.email.length == 0) {
               validationResult.isValid = false;
               validationResult.message += "Please enter an email address <br />";
           }
           if (!validateEmail(this.email)) {
               validationResult.isValid = false;
               validationResult.message += "Please enter a valid email address <br />";
           }
           if (!!this.staffId && this.email != this.confirmEmail) {
               validationResult.isValid = false;
               validationResult.message += "Email addresses do not match <br />";
           }

           if (this.firstName == "") {
               validationResult.isValid = false;
               validationResult.message += "Please enter a first name <br />";
           }

           if (this.firstName.length > 24) {
               validationResult.isValid = false;
               validationResult.message += "First name must be less than 24 characters <br />";
           }

           if (this.lastName == "") {
               validationResult.isValid = false;
               validationResult.message += "Please enter a last name <br />";
           }

           if (this.lastName.length > 24) {
               validationResult.isValid = false;
               validationResult.message += "Last name must be less than 24 characters <br />";
           }

           if (!this.timeZoneId) {
               validationResult.isValid = false;
               validationResult.message += "Please select a Time Zone <br />";
           }

           if (!this.isPhysician && (this.homeCode == "" || this.homeCode.length == 0)) {
               validationResult.isValid = false;
               validationResult.message += "Please select Country Code for Phone Number<br />";
           }

           if ((emsg = ValidatePhone(getNumbersFromString(this.homePhone), "Phone Number", true)).length > 0) {
               validationResult.isValid = false;
               validationResult.message += emsg + " <br />";
           }

           if (!this.isPhysician && (this.cellCode == "" || this.cellCode.length == 0)) {
               validationResult.isValid = false;
               validationResult.message += "Please select a Country Code for the Mobile Number or leave the Mobile Number blank <br />";
           }

           if ((emsg = ValidatePhone(getNumbersFromString(this.cellPhone), "Mobile Number", true)).length > 0) {
               validationResult.isValid = false;
               validationResult.message += emsg + " <br />";
           }

           if (this.isPatientFacing) {
              
               this.licensedRegionDS.forEach(function (item) {
                   if (!item.validateRegions()) {
                       validationResult.isValid = false;
                       validationResult.message += "Please enter at least one State/Region <br />";
                   }
               });
               if (!this.dob) {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a Date of Birth <br />";
               }

               if (this.department == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a Department <br />";
               }

               if (this.businessAddress == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a Business Address <br />";
               }

               if (this.rxntUserName != "") {
                   if (this.rxntPassword == "") {
                       validationResult.isValid = false;
                       validationResult.message += "Please enter the RxNT User Password <br/>";
                   }
               }
               if (this.rxntPassword != "") {
                   if (this.rxntUserName
                       == "") {
                       validationResult.isValid = false;
                       validationResult.message += "Please enter the RxNT User Name <br/>";
                   }
               }


               if (!this.gender) {
                   validationResult.isValid = false;
                   validationResult.message += "Please select a Gender <br />";
               }

               if (this.practicingSinse == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter the year you started practicing in YYYY format <br />";
               }
               if (this.practicingSinse.length < 4 && this.practicingSinse != "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a valid year in YYYY format <br />";
               }
               else {

                   var today = new Date();
                   today.setHours(0, 0, 0, 0);
                   var dobYear = new Date(this.dob).getFullYear();
                   var currentYear = today.getFullYear();
                   var practingYear = parseInt(this.practicingSinse);
                   var ageValue = parseInt(snap.getAgeCount(this.dob).year);
                   if (this.dob > today) {
                       validationResult.isValid = false;
                       validationResult.message += "Date of Birth cannot be greater than current date <br />";
                   }
                   if (practingYear < dobYear + 18) {
                       validationResult.isValid = false;
                       validationResult.message += "Years practicing must start at least 18 years from the users date of birth<br />";
                   }
                   if (practingYear > currentYear) {
                       validationResult.isValid = false;
                       validationResult.message += "Practicing Since cannot start in the future <br />";
                   }

                   if (ageValue < 18) {
                       validationResult.isValid = false;
                       validationResult.message += "Age must be at least be 18 years<br/>";
                   }
               }
               if (this.department == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a department <br />";
               }

               if (this.medicalSpeciality == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a medical speciality <br/>";
               }

               if (this.businessAddress == "") {
                   validationResult.isValid = false;
                   validationResult.message += "Please enter a Current Business Address <br/>";
               }
           }
           return validationResult;
       };

       this.dataForExistingAccount = function () {
           return;
       };

       this.dataForPendingAccount = function () {
           var assignedRoles = [];
           this.roles.forEach(function (item) {
               if (item.selected) {
                   assignedRoles.push({
                       id: item.roleId,
                       name: item.description
                   });
               }
           });
           return {
               userDetails: {
                   firstName: this.firstName,
                   lastName: this.lastName,
                   email: this.email,
                   phoneNumber: this.homeCode + this.homePhone,
                   cellPhoneNumber: this.cellCode + this.cellPhone,
                   timeZoneId: this.timeZoneId,
                   profileImage: this.profileImagePath,
                   receiveTextAlerts: this.textAlerts
               },
               doctorProfileDetails: {
                   dOB: this.dob,
                   practicingSinceYear: this.practicingSinse,
                   gender: this.gender,
                   internship: this.internsip,
                   department: this.department,
                   medicalSpeciality: this.medicalSpeciality,
                   medicalSubSpeciality: this.subSpeciality,
                   medicalLicense: this.medicalLicense,
                   statesLicensed: this.statesLicensed,
                   medicineSchool: this.schoolOfMedicine,
                   preMedicalEducation: this.preMedicalEducation,
                   yearOfStateRegistration: this.yearOfStateRegistration,
                   homeAddress: this.residency,
                   businessAddress: this.businessAddress
               },
               roles: assignedRoles,
               tags: this.tags.map(function (item) { return item.tag; }).join(',')

           };
       };

      
       this.sendData = function () {
           
           var data = {
               adminUserID: snap.profileSession.userId,
               staffUserID: this.staffId,
               rxntUserName: this.rxntUserName,
               rxntUserPassword: this.rxntPassword,
               ehrIntegrationUserName: this.ehrExternalUserName,
               ehrIntegrationUserId: this.ehrExternalUserId,
               fname: this.firstName,
               lname: this.lastName,
               email: this.email,
               phNumber: this.homeCode + this.homePhone,
               cellNumber: this.cellCode + this.cellPhone,
               textAlerts: this.textAlerts ? "Y" : "N",
               imgPath: this.profileImagePath,
               dOB: this.dob,
               yearPracticing: this.practicingSinse,
               department: this.department,
               medSpeciality: this.medicalSpeciality,
               subSpeciality: this.subSpeciality,
               medLicense: this.medicalLicense,
               statesLicensed: JSON.stringify(this.extractStateLicensedObject(this.licensedRegionDS)),
               schmedicine: this.schoolOfMedicine,
               preMedEducation: this.preMedicalEducation,
               internship: this.internsip,
               residency: this.residency,
               bussAddress: this.businessAddress,
               timeZoneID: this.timeZoneId,
               gender: this.gender,
               yearOfStateRegistration: this.yearOfStateRegistration

           };



           return $service.editAccountInfo(this.staffId, data);
       };

       this.createProfile = function () {
           var promise = $.Deferred();
           $service.addAccount(this.dataForPendingAccount()).done(function () {
               $snapNotification.success("Staff member account updated successfully. An email has been sent to the new staff member. Please have them check their email in order to complete registration.");
               promise.resolve();
               setTimeout(function () {
                   window.location.href = "/Admin/StaffAccounts";
               }, 1000);
           }).fail(function (xhr) {
               if (xhr.status == 401) {
                   window.location = "/Admin/Login";
               }
               else {
                   $snapNotification.error(xhr.statusText);
               }
               promise.reject();
           });
           return promise.promise();
       };

       this.editProfile = function () {
           var fullNameLabel = "#lblUserName";
           var promise = $.Deferred();
           this.sendData().done(function () {
               $snapNotification.success('Staff Member Details Updated Successfully');

               var updatedData = JSON.parse(this.data);

               $vm.makeReadonly();
               promise.resolve();
           }).fail(function (xhr, staus, error) {
               $snapNotification.error(error);
               promise.reject();
           }).always(function () {
               snapLoader.hideLoader();
           });

           return promise.promise();
       };
       this.save = function (e) {
           e.preventDefault();
           var validationResult = this.validateInput();

           if (validationResult.isValid) {
               snapLoader.showLoader();
               var promise;
               if (this.staffId) {
                   promise = this.editProfile();
               } else {
                   promise = this.createProfile();
               }
               promise.done(function () {
                   if (snap.profileSession.userId == $vm.staffId) {
                       profileData = snap.profileSession;
                       profileData.firstName = $vm.firstName;
                       profileData.fullName = $vm.fullName();
                       profileData.gender = $vm.gender;
                       profileData.lastName = $vm.lastName;
                       profileData.timeZoneId = $vm.timeZoneId;
                       profileData.medicalLicense = $vm.medicalLicense;
                       profileData.medicalSchool = $vm.medicalSchool;
                       profileData.medicalSpeciality = $vm.medicalSpeciality;
                       profileData.statesLicenced = $vm.statesLicenced;
                       profileData.subSpeciality = $vm.subSpeciality;
                       profileData.profileImage = $vm.profileImage;
                       profileData.isLogouted = false;

                       snap.setSnapJsSession("snap_staffprofile_session", profileData);
                       $.ajax({
                           type: "GET",
                           url: "/api/v2.1/users/current-time",
                           contentType: "application/json; charset=utf-8",
                           dataType: "json",
                       }).done(function (response) {
                           var timeZone = response.message;
                           snap.userSession.timeZoneSystemId = timeZone;
                           snap.updateSnapJsSession("snap_user_session", "timeZoneSystemId", timeZone);
                       }).fail(function () {
                           $snapNotification.error("Error. Time zone info missing");
                       }).always(function () {
                           window.location.reload();
                           snapLoader.hideLoader();
                       });
                   }
               }).fail(function () {
                   snapLoader.hideLoader();
               });



           } else {
               $snapNotification.error(validationResult.message);
           }
       };

       this.reactivateProfile = function () {
           var account = this;
           $snapNotification.confirmationWithCallbacks("Are you sure that you want to re-activate this user?", function () {
               $service.reActivate(account.userId).done(function () {
                   $snapNotification.success('Staff account has been successfully re-activated.');
                   window.location = "StaffAccounts";
               }).fail(function (response) {
                   $snapNotification.error(response);
               }).always(function () {
                   snapLoader.hideLoader();
               });
           });
       };

       this.deleteProfile = function (e) {
           e && e.preventDefault();
           if (this.staffId != snap.profileSession.userId) {
               $snapNotification.confirmationWithCallbacks("Are you sure that you want to deactivate this staff member",
                   function () {
                       if ($vm.staffId) {
                           if (!$vm.isPrimaryAdmin) {
                               snapLoader.showLoader();
                               $service.deleteProfile($vm.staffId).done(function () {
                                   $snapNotification.success('Staff account has been de-activated successfully.');
                                   window.location = "StaffAccounts";
                               }).fail(function (response) {
                                   $snapNotification.error(response);
                               }).always(function () {
                                   snapLoader.hideLoader();
                               });
                           } else {
                               $snapNotification.error("You can not delete the default admin user");
                           }
                       }
                   },
                   function () {
                   });
           } else {
               $snapNotification.info("You cannot delete your own account");
           }
       };
       this.resetPassword = function (e) {
           e && e.preventDefault();
           if (this.email !== "") {
               var data = {
                   email: this.email,
                   hospitalId: snap.hospitalSession.hospitalId,
                   userTypeId: 2 //Clinician
               };
               $.ajax({
                   type: "POST",
                   async: false,
                   //TOT: replace with API call
                   url: '/api/v2/mail/resetPassword',
                   data: JSON.stringify(data),
                   contentType: "application/json; charset=utf-8",
                   dataType: "json"
               }).done(function (response) {
                   $snapNotification.info("An email has been sent to the user with a link to reset their Password.");
               }).fail(function (xhr, status, error) {
                   var msg = "Unable to send reset password email <br />";
                   try {
                       msg += JSON.parse(xhr.responseText).message;
                   } catch (err) { }
                   $snapNotification.error(msg);
               });
           }
       };

       this.checkUserInteractions = function (roles) {
           if (roles.length == 0) {
               $vm.set("isPatientFacing", false);
           } else {
               $service.hasUserInteractions(roles).done(function (response) {
                   $vm.set("isPatientFacing", response.data[0]);
               }).fail(function () {
                   $snapNotification.error("Unable to check role functions");
               });
           }
       };

       this.roleStausChanged = function () {
           var roles = [];
           this.roles.forEach(function (item) {
               if (item.selected) {
                   roles.push(item.roleId);
               }
           });
           this.checkUserInteractions(roles);
       };
   });

snap.namespace("Snap.Admin").use(["snapNotification", "snapHttp", "snapLoader", "Snap.Admin.StaffProfileViewModel", "snap.service.staffAccountService"])
   .define("StaffProfileService", function ($snapNotification, $snapHttp, snapLoader, $vm, $service) {
       this.LoadViewModel = function (containerSelector, staffId, currentUserId, hospitalId, isEditable, isPhysician) {
           if (isEditable) {
               $vm.makeEditable();
           } else {
               $vm.makeReadonly();
           }
           $vm.set("staffId", staffId);
           $vm.set("isPhysician", isPhysician);
           $vm.set("isPatientFacing", isPhysician);

           if (staffId) {
               $service.getAccountInfo(staffId).done(function (response) {
                   if (response.data && response.data.length === 1) {
                       $vm.initDataSources(hospitalId);
                       $vm.setData(response.data[0]);

                       var $uploadImage = $("#selectImageID");
                       $uploadImage.show();
                       var staffUserId = response.data[0].userId;
                       ProfileImageUploader(
                           $uploadImage,
                           "clinician",
                           true,
                           staffUserId,
                           null,
                           function (imageUrl) {
                               $vm.set("profileImage", imageUrl);
                               if (staffUserId === snap.profileSession.userId) {
                                   snap.updateSnapJsSession("snap_staffprofile_session", "profileImage", imageUrl);
                                   snap.eventAggregator.published("profileImage:changed", imageUrl);
                               }
                           });
                   }
               });
           } else {
               $vm.initDataSources(hospitalId);
               $service.getIndividualRoles(0, snap.hospitalSession.hospitalId).done(function (data) {
                   data.data && data.data.forEach(function (item) {
                       item.roleStausChanged = function (e) {
                           $vm.roleStausChanged(e);
                       };
                   });
                   $vm.set("roles", data.data);
               });

           }

           snap.localize();

           kendo.bind($(containerSelector), $vm);
           return $vm;
       };
   });
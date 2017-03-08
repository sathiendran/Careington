//@ sourceURL=patientAddressRule.viewmodel.js

"use strict";
(function ($, snap, kendo, window) {
    snap.namespace("snap.admin.patientRules").use(["snapNotification", "snap.EventAggregator", "snap.admin.patientRules.ruleService", "snap.admin.patientRules.patientRulesCommon"])
    .extend(kendo.observable)
    .define("patientAddressRule", function ($snapNotification, $eventAggregator, $ruleService, $rulesCommon) {
        var scope = this,
            checkBoxStateEnum = {
                checked: "checked",
                unchecked: "unchecked",
                indeterminate: "indeterminate"
            },
            cachedPostalCodes = []; //this erray not empty in edit mode.

        this.selectedCountry = "US";
        this.postalCodes = [];

        loadCodesForCountry(this.selectedCountry).done(function() {
              $eventAggregator.published("onConditionChange"); 
        });

        //***************************** PUBLIC API ******************************
        this.loadViewModel = function() {
            scope.set("selectedCountry", "US");
            loadCodesForCountry(this.selectedCountry);
            cachedPostalCodes = [];
        };

        this.saveRule = function (ruleContext) {
            var selectedCodes = this._getSelectedCodes();
            if (selectedCodes.length === 0) {
                selectedCodes.push(
                    {
                        countryCode: this.selectedCountry,
                        country: this._getCountryNameByCode(this.selectedCountry)
                    }
                );
            }

            var ruleDescription = {
                conditionSource: $rulesCommon.ruleConditionSourceEnum.Address,
                ruleTypeId: $rulesCommon.ruleTypeCodeEnum.AddressRule,
                providerId: snap.hospitalSession.hospitalId,
                statusCode: 1, //always 1 for new rule
                subjectAddresses: selectedCodes,

                id: ruleContext.ruleId,
                conditionTypeId: ruleContext.ruleOperator

            };

            return $ruleService.saveAdressRule(ruleDescription).done(function () {
                $snapNotification.success("Rule saved successfully");
            }).fail(function (err) {
                if (typeof (err) === "string") {
                    $snapNotification.error(err);
                }
            });
        };

        this.isConditionSelected = function() {
            return this.vm_isCountrySelected();
        };

        this.getInfo = function() {
            var info = "";
            if(this.selectedCountry) {
                var countryname = this._getCountryNameByCode(this.selectedCountry);

                info = countryname !== "" ? countryname : this.selectedCountry;
            }

            if(this._getSelectedCodes().length > 0) {
                info += "<br><span>Various Regions</span>";
            }

            return {
                description: info
            };
        };

        this.setDetails = function(rule) {
            cachedPostalCodes = rule.subjectAddresses.map(function(code) {
                return new PostalCode(code);
            });

            var countryCode = rule.subjectAddresses[0].countryCode;
            scope.set("selectedCountry", countryCode);
            scope.set("postalCodes", []);
            loadCodesForCountry(this.selectedCountry);

        };

        //**************************** MVVM BINDINGS ****************************
        this.countriesDS = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $(function () { //need to bind later
                        if (!snap.hasAllPermission(snap.security.edit_workflows)) {
                            var dropDown = $("#ddSelectCountry").data("kendoDropDownList");
                            dropDown.enable(false);
                        }
                    });
                    $ruleService.getCountries().done(function (data) {
                        if (data.data[0]) {
                            var countries = data.data[0].subjectAddresses;

                            options.success(countries);
                        } else {
                            $snapNotification.error("API: no Address Meta Rule found");
                            options.success([{countryCode: "US", country: "United States"}]);
                        }
                    });
                }
            }
        });

        this.vm_isCountrySelected = function() {
            return this.selectedCountry !== null;
        };

        this.vm_postalCodes = function () {
            return this.postalCodes.sort(compareCodesByName);
        };

        this.vm_onCountryChange = function () {
            window.console.log("event :: change (" + this.selectedCountry + ")");
            this.trigger("change", { field: "vm_isCountrySelected" });

            loadCodesForCountry(this.selectedCountry).done(function() {
                $eventAggregator.published("onConditionChange"); 
            });
        };

        //************************* PRIVATE METHODS *******************************
        this._getCountryNameByCode = function (countryCode) {
            var info = "";
            
            this.countriesDS.data().forEach(function (country) {
                if (country.countryCode === countryCode) {
                    info = country.country;
                }
            });

            return info;
        };

        this._getSelectedCodes = function() {
            //All codes which were selected in UI.
            var selectedCodes = getSelectedCodes(this.postalCodes);

            //Note. In edit mode some postal codes could be selected previously but user did not load them yet.
            //Example. Hawaii -> Honolulu -> 96822

            //1. Exclude from cache all codes which are already selected. 
            var cCodes = cachedPostalCodes.filter(function(cCode) {
                return findClosestCode(cCode, selectedCodes) === null;
            });

            //2. Check all codes which were not loaded.
            cCodes = cCodes.filter(function(cCode) {
                var closestCode = findClosestCode(cCode, scope.postalCodes);

                //If there is no muched code in codes library we exclude it.
                if(closestCode === null) {
                    return false;
                }

                //If current postal code loaded and displayed we exlude it from cache.
                if(closestCode.isPostalCodeEquals(cCode)) {
                    return false;
                } 

                return closestCode._getCurrentCheckboxState() !== checkBoxStateEnum.unchecked;
            });

            var countryName = this._getCountryNameByCode(this.selectedCountry);
            return selectedCodes.concat(cCodes).map(function(code) {
                var postalCodeObject = code.getCodeObject();
                $.extend(postalCodeObject, {
                    country: countryName
                }); 

                return postalCodeObject;
            });
        };

        function findClosestCode(postalCode, postalCodes) {
            for(var i = 0; i < postalCodes.length; i++) {
                if(postalCodes[i].isPostalCodeEquals(postalCode))
                {
                    return postalCodes[i];
                }
                else if(postalCodes[i].isContainsSubCode(postalCode)) {
                    var closest = findClosestCode(postalCode, postalCodes[i].subCodes);

                    return closest !== null ? closest : postalCodes[i];
                }   
            }

            return null;
        }

        function getSelectedCodes(postalCodes) {
            var selected = [];

            postalCodes.forEach(function (postalCode) {
                if (postalCode.vm_isCheckedView()) {
                    selected.push(postalCode);
                }
                else if (postalCode.subCodes && postalCode.subCodes.length > 0) {
                    selected = selected.concat(getSelectedCodes(postalCode.subCodes));
                }
            });

            return selected;
        }

        function compareCodesByName(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        }

        function loadCodesForCountry(countryCode) {
            var dfd = $.Deferred();

            var filter = {
                countryCode: countryCode
            };

            loadCodes(filter).done(function(postalCodes) {
                scope.set("postalCodes", postalCodes);
            }).fail(function(error) {
                $snapNotification.error(error);
                scope.set("postalCodes", []);
            }).always(function() {
                scope.trigger("change", { field: "vm_postalCodes" });
                dfd.resolve();
            });
            return dfd.promise();
        }

        function loadCodes(filter) {
            var dfd = $.Deferred();

            $ruleService.getPostalCodes(filter).done(function (data) {
                var codes = data.data.map(function (postalCode) {
                    return wrapPostalCodeToNewObservableObject(postalCode);
                });

                cachedPostalCodes.forEach(function(cachedCode) {
                    codes.forEach(function(code) {
                        if(code.isPostalCodeEquals(cachedCode)) {
                            code.setViewState(checkBoxStateEnum.checked);
                        } else if(code.isContainsSubCode(cachedCode)) {
                            code.setViewState(checkBoxStateEnum.indeterminate);
                        }
                    });
                });

                dfd.resolve(codes);
            });

            return dfd.promise();
        }

        function wrapPostalCodeToNewObservableObject(postalCode) {
            var g = new kendo.data.ObservableObject(new PostalCode(postalCode));

            if (postalCode.subCodes) {
                postalCode.subCodes.forEach(function (subCode) {
                    g.subCodes.push(wrapPostalCodeToNewObservableObject(subCode));
                });
            }

            return g;
        }

        function PostalCode(postalCode) {
            this.parentCode = null;
            this.id = postalCodeToString(postalCode);
            this.name = getPostalCodeName(postalCode);
            this._codeObject = createCodeObject();


            this.checkBoxViewState = checkBoxStateEnum.unchecked;
            this.subCodes = [];

            this.setViewState = function (checkBoxState) {
                this.set("checkBoxViewState", checkBoxState);

                if(this.checkBoxViewState !== checkBoxStateEnum.indeterminate) {
                    var state = this.checkBoxViewState;
                    this.subCodes.forEach(function(postalCode) {
                        postalCode.setViewState(state);
                    });
                }
            };

            this.refreshCurrentNode = function() {
                this.refreshViewState();
                this.refreshAllChildren();
                this.refreshAllParents();
            };

            this.refreshViewState = function() {
                this.trigger("change", { field: "vm_isCheckedView" });
                this.trigger("change", { field: "vm_isIndeterminateView" });
            };

            this.refreshAllParents = function() {
                if(this.parentCode) {
                    this.parentCode.refreshViewState();
                    this.parentCode.refreshAllParents();
                }
            };

            this.refreshAllChildren = function() {
                this.subCodes.forEach(function(postalCode) {
                    postalCode.refreshViewState();
                    postalCode.refreshAllChildren();
                });
            };

            this.loadSubCodes = function () {
                if (this.subCodes.length === 0) {
                    var filter = {
                        countryCode: postalCode.countryCode,
                        stateCode: postalCode.stateCode,
                        city: postalCode.city,
                        postalCode: postalCode.postalCode,
                        maxRows: 10000 //We have to setup this field because by default API will return only 100 rows. Some states contains more than 100 cities.
                    };

                    var that = this;
                    loadCodes(filter).done(function (postalCodes) {
                        postalCodes.forEach(function(postalCode) {
                            postalCode.parentCode = that;
                        });


                        var currentState = that._getCurrentCheckboxState();
                        if(currentState !== checkBoxStateEnum.indeterminate) {
                            postalCodes.forEach(function(postalCode) {
                                postalCode.setViewState(currentState);
                            });
                        }

                        that.set("subCodes", postalCodes);
                    });
                }
            };

            this.getCodeObject = function () {
                return this._codeObject;
            };

            //********************** PUBLIC METHODS ****************************
            this.isContainsSubCode = function(postalCode) {
                if(this._codeObject.countryCode !== postalCode._codeObject.countryCode) {
                    return false;
                }

                if(this._codeObject.stateCode !== "" && this._codeObject.stateCode !== postalCode._codeObject.stateCode) {
                    return false;   
                }

                if(this._codeObject.city !== "" && this._codeObject.city !== postalCode._codeObject.city) {
                    return false;   
                }

                if(this._codeObject.postalCode !== "" && this._codeObject.postalCode !== postalCode._codeObject.postalCode) {
                    return false;   
                }

                return true;
            };

            this.isPostalCodeEquals = function(postalCode) {
                return this.id === postalCode.id;
            };

            //*********************** MVVM BINDINGS ****************************
            this.vm_isExpanded = false;

            this.vm_subCodes = function () {
                return this.subCodes.sort(compareCodesByName);
            };

            this.vm_isCheckedView = function () {
                return this._getCurrentCheckboxState() === checkBoxStateEnum.checked;
            };

            this.vm_isIndeterminateView = function () {
                return this._getCurrentCheckboxState() === checkBoxStateEnum.indeterminate;
            };
            this.canEditRules = function () {
                if (snap.hasAllPermission(snap.security.edit_workflows)) {
                    return true;
                }
                return false;
            };
            this.cantEditRules = function () {
                return (! this.canEditRules());
            };
            this.vm_onCodeCheck = function () {
                var currentState = this._getCurrentCheckboxState();

                this.setViewState(currentState === checkBoxStateEnum.checked ? checkBoxStateEnum.unchecked : checkBoxStateEnum.checked);
                this.refreshCurrentNode();
                $eventAggregator.published("onConditionChange"); 
            };

            this.vm_onCodeExpand = function () {
                this.set("vm_isExpanded", !this.vm_isExpanded);

                if (this.vm_isExpanded) {
                    this.loadSubCodes();
                }
            };

            this.vm_hasSubCodes = function () {
                if(postalCode.postalCode) {
                    return false;
                }

                return true;
            };

            //********************** PRIVATE METHODS ******************************
            this._getCurrentCheckboxState = function() {
                if(this.subCodes.length === 0) {
                    return this.checkBoxViewState;
                } else {
                    var stateCounter = {
                        checked: 0,
                        unchecked: 0,
                        indeterminate: 0
                    };

                    this.subCodes.forEach(function(postalCode) {
                        stateCounter[postalCode._getCurrentCheckboxState()]++;
                    });

                    if(stateCounter.checked === this.subCodes.length) {
                        return checkBoxStateEnum.checked;
                    } else if (stateCounter.checked > 0 || stateCounter.indeterminate > 0) {
                        return checkBoxStateEnum.indeterminate;
                    } else {
                        return checkBoxStateEnum.unchecked;
                    }
                }
            };

            function getPostalCodeName(postalCode) {
                if (postalCode.postalCode) {
                    return postalCode.postalCode;
                } else if (postalCode.city) {
                    return postalCode.city;
                } else {
                    return postalCode.state;
                }

                return "";
            }

            function createCodeObject() {
                 return {
                    countryCode: $.trim(postalCode.countryCode),
                    state: $.trim(postalCode.state),
                    stateCode: $.trim(postalCode.stateCode),
                    city: $.trim(postalCode.city),
                    postalCode: $.trim(postalCode.postalCode)
                };
            }

            function postalCodeToString(postalCode) {
                var str = [
                    postalCode.countryCode,
                    postalCode.stateCode,
                    postalCode.city,
                    postalCode.postalCode
                ].join("_").replace(/ /g, '');

                return str;
            }
        }
    }).singleton();
}(jQuery, snap, kendo, window));
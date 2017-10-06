//@ sourceURL=rulesService.js

"use strict";
(function ($, snap) {

    snap.namespace("snap.admin.patientRules").use([])
        .define("patientRulesCommon", function () {
            // In back-end we have many enums which describes rules logic.
            // In front-end we need to have the same enums in oredr to work with data from API.

            var ruleCategoryCodeEnum = {
                registrationAvailability: 1,
                visibilityRules: 4
            };

            // Code for Type of Rules 
            var ruleTypeCodeEnum = {
                // The unknown, undefined rule
                Unknown: 0,

                // The address rule
                AddressRule: 1,

                // The distance rule
                DistanceRule: 2,

                // The patient organization rule
                PatientOrganizationRule: 3,

                // Provider license checking rule
                ProviderLicenseRule: 5,

                // Provider license checking rule
                PatientResponseRule: 6,

                // The patient address & provider license matching rule
                PatientProviderLicenseRule: 7
            };

            // Source of Rule Matching Condition
            var ruleConditionSourceEnum = {
                // The unknown source
                Unknown: 0,

                // The address
                Address: 1,

                // Match provider license and patient address
                ProviderLicenseAndPatientAddress: 7,

                // Match provider license and patient response
                ProviderLicenseAndEncounterAddress: 8,
            };

            // Type of Rule Logic
            var ruleLogicTypeCodeEnum = {
                // The unknown type
                Unknown: 0,

                // Is the subject in criteria                
                In: 1,

                // Is the subject not in criteria
                NotIn: 2
            };

            this.ruleCategoryCodeEnum = ruleCategoryCodeEnum;
            this.ruleTypeCodeEnum = ruleTypeCodeEnum;
            this.ruleConditionSourceEnum = ruleConditionSourceEnum;
            this.ruleLogicTypeCodeEnum = ruleLogicTypeCodeEnum;
            

            this.ruleTileTypes = {
                ruleType: 1,
                conditionType: 2,
            };

            this.getUIStylesMapping = function() {
                return getUIStylesMapping(this);
            };

            function getUIStylesMapping($ruleCommon) {
                var ruleTypeEnum = {};
                ruleTypeEnum[$ruleCommon.ruleTypeCodeEnum.AddressRule] = {
                    iconClass: "icon_address",
                    description: "patient address"
                };
                ruleTypeEnum[$ruleCommon.ruleTypeCodeEnum.PatientProviderLicenseRule] = {
                    iconClass: "icon_v-card",
                    description: "provider license"
                };

                var operatorEnum = {};
                operatorEnum[$ruleCommon.ruleLogicTypeCodeEnum.In] = {
                    iconClass: "icon_plus"
                };
                operatorEnum[$ruleCommon.ruleLogicTypeCodeEnum.NotIn] = {
                    iconClass: "icon_minus"
                };

                var conditionSourceEnum = {};
                conditionSourceEnum[$ruleCommon.ruleConditionSourceEnum.Address] = {
                    iconClass: "icon_location-pin"
                };
                conditionSourceEnum[$ruleCommon.ruleConditionSourceEnum.ProviderLicenseAndPatientAddress] = {
                    iconClass: "icon_address"
                };
                conditionSourceEnum[$ruleCommon.ruleConditionSourceEnum.ProviderLicenseAndEncounterAddress] = {
                    iconClass: "icon_help"
                };

                return {
                    ruleTypeEnum: ruleTypeEnum,
                    operatorEnum: operatorEnum,
                    conditionSourceEnum: conditionSourceEnum
                };
            }
            
        }).singleton();

    snap.namespace("snap.admin.patientRules").use(["snapHttp"])
        .define("ruleService", function ($http) {

            var ruleApiUrl = snap.baseUrl + "/api/v2.1/admin/rules",
                postalCodeApiUrl = snap.baseUrl + "/api/v2.1/admin/postalcodes",
                addressMetaRuleApi = snap.baseUrl + "/api/v2.1/admin/rules/subject-address-meta-rules",
                providerLicenseMetaRuleApi = snap.baseUrl + "/api/v2.1/admin/rules/provider-license-meta-rules",
                patientResponseMetaRuleApi = snap.baseUrl + "/api/v2.1/admin/rules/patient-response-meta-rules",
                patientProviderLicenseMetaRuleApi = snap.baseUrl +  "/api/v2.1/admin/rules/patient-provider-license-meta-rules";

            this.getCountries = function() {
                return $http.get(addressMetaRuleApi, {
                    providerId: snap.hospitalSession.hospitalId
                });
            };

            this.getPostalCodes = function(filter) {
                return $http.get(postalCodeApiUrl, filter);
            };

            this.getProviderLicenseMetadata = function () {
                return $http.get(providerLicenseMetaRuleApi, {
                    providerId: snap.hospitalSession.hospitalId
                });
            };

            this.getPatientResponseMetadata = function () {
                return $http.get(patientResponseMetaRuleApi, {
                    providerId: snap.hospitalSession.hospitalId
                });
            };

            this.getPatientProviderLicenseMetadata = function () {
                return $http.get(patientProviderLicenseMetaRuleApi, {
                    providerId: snap.hospitalSession.hospitalId
                });
            };

            this.getCategoriesWithRules = function () {
                var dfd = $.Deferred();

                $.when(
                    this.getCategories(),
                    this.getRules(snap.hospitalSession.hospitalId)
                ).done(function (cResponse, rResponse) {
                    var categories = cResponse[0].data.filter(function (obj) {
                        return obj.key > 0;
                    }).map(function (obj) {
                        return {
                            categoryCode: obj.key,
                            categoryName: obj.value,
                            rules: rResponse.filter(function (item) {
                                return item.ruleTemplate.ruleSet.ruleCategoryId === obj.key;
                            })
                        };
                    });

                    dfd.resolve(categories);
                }).fail(function (error) {
                    dfd.reject(error);
                });

                return dfd.promise();
            };

            this.getRuleTemplates = function (filter) {
                var path = [ruleApiUrl, "rule-templates"].join("/");

                return $http.get(path, filter);
            };

            this.getCategories = function () {
                var path = [ruleApiUrl, "rule-categories"].join("/");

                return $http.get(path);
            };

            this.getRules = function () {
                var active = {
                    ProviderId: snap.hospitalSession.hospitalId,
                    StatusCode: 1
                };

                var suspended = {
                    ProviderId: snap.hospitalSession.hospitalId,
                    StatusCode: 3
                };

                var def = $.Deferred();
                $.when($http.get(ruleApiUrl, active), $http.get(ruleApiUrl, suspended)).done(function (activeResp, suspendedResp) {
                    var rules = [];
                    rules = rules.concat(activeResp[0].data);
                    rules = rules.concat(suspendedResp[0].data);
                    rules.sort(function (item1, item2) {
                        return item1.sequence - item2.sequence;
                    });
                    def.resolve(rules);
                }).fail(function () {
                    def.reject();
                });
                return def.promise();
            };

            this.getFilteredRules = function (filters) {
                var def = $.Deferred();
                this.getRules().done(function (resp) {
                    var rules = resp.filter(function (item) {
                        if (filters.categoryCode) {
                            return item.ruleTemplate.ruleSet.ruleCategoryId === filters.categoryCode;
                        } else {
                            return true;
                        }
                    });
                    def.resolve(rules);
                }).fail(function (err) {
                    def.reject(err);
                });

                return def.promise();
            };

            this.deleteRule = function (ruleId) {
                return $.ajax({
                    url: [snap.baseUrl + "/api/v2.1/admin/rules", ruleId].join("/"),
                    type: 'DELETE'
                });
            };


            this.saveRuleDescription = function(ruleDescription, ruleTypeUrlPart) {
                var dfd = $.Deferred();

                var error = this._validateRuleDescription(ruleDescription);
                if(error !== null) {
                    dfd.reject(error);
                } else {
                    var that = this;
                    this.getRuleTemplates().done(function(data) {
                        var ruleTemplate = data.data.filter(function(rTemplate) {
                            return rTemplate.statusCode === 1 && rTemplate.ruleTypeId === ruleDescription.ruleTypeId; 
                        })[0];

                        ruleDescription.ruleTemplateId = ruleTemplate.id;

                        that._save(ruleDescription, ruleTypeUrlPart).done(function(){
                            dfd.resolve();
                        }).fail(function(error) {
                            dfd.reject(error);
                        });
                    }).fail(function(error) {
                        dfd.reject(error);
                    });
                }

                return dfd;
            };

            this._save = function(rule, ruleTypeUrlPart) {
                if (!!rule.id) {
                    return $.ajax({
                        url: [ruleApiUrl, ruleTypeUrlPart, rule.id].join('/'),
                        type: "PUT",
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(rule)
                    });
                } else {
                    return $.ajax({
                        url: [ruleApiUrl, ruleTypeUrlPart].join('/'),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(rule)
                    });
                }
            };

            this.saveAdressRule = function(ruleDescription) {
                return this.saveRuleDescription(ruleDescription, "subject-address-rules");
            };

            this.saveProviderLicensePatientAddressRule = function(ruleDescription) {
                return this.saveRuleDescription(ruleDescription, "patient-provider-license-rules");
            };

            this.changeRuleStatus = function(ruleId, status) {
                var url = [ruleApiUrl, ruleId, "status"].join('/') + "?status=" + status;

                return $.ajax({
                        url: url,
                        type: "PUT",
                        contentType: 'application/json; charset=utf-8',
                    });
            };

            this.reorderCategory = function(rulesCaterhories) {
                var url =  [ruleApiUrl, "rule-categories/order"].join("/");

                return $.ajax({
                        url: url,
                        type: "PUT",
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(rulesCaterhories)
                    });
            };

            this._validateRuleDescription = function(ruleDescription) {
                if(isNullOrUndefined(ruleDescription)) {
                    return "Rule is empty.";
                } 

                if(isNullOrUndefined(ruleDescription.ruleTypeId)) {
                    return "Subject for this workflow not selected.";
                }

                if(isNullOrUndefined(ruleDescription.conditionTypeId)) {
                    return "Logic for this workflow not selected.";
                }

                if(isNullOrUndefined(ruleDescription.conditionSource)) {
                    return "Conditions for this workflow not selected.";
                }

                return null;

                function isNullOrUndefined(obj) {
                    return typeof(obj) === "undefined" || obj === null;
                }
            };
        }).singleton();

     snap.namespace("snap.admin.patientRules").use(["snap.admin.patientRules.patientRulesCommon", "snap.admin.patientRules.ruleService"])
        .define("rulesDescription", function ($patientRulesCommon, $ruleService) {
            function toRuleObject(rule) {
                return {
                    id: rule.id,
                    conditionTypeId: rule.conditionTypeId,
                    conditionSource: rule.conditionSource,
                    statusCode: rule.statusCode,
                    providerId: rule.providerId,
                    ruleTypeId: rule.ruleTemplate.ruleTypeId,
                };
            }


            this.rulesDescriptions = [
                {
                    description: "Allow patients to register if",
                    shortDescription: "Address Rule",
                    ruleCategoryId: $patientRulesCommon.ruleCategoryCodeEnum.registrationAvailability,
                    ruleTypeId: $patientRulesCommon.ruleTypeCodeEnum.AddressRule,
                    operators: [
                        {
                            conditionTypeId: $patientRulesCommon.ruleLogicTypeCodeEnum.In,
                            tile: {
                                iconClass: "icon_plus",
                                description: "Includes"
                            }
                        },
                        {
                            conditionTypeId: $patientRulesCommon.ruleLogicTypeCodeEnum.NotIn,
                            tile: {
                                iconClass: "icon_minus",
                                description: "Does Not Include"
                            }
                        }
                    ],
                    tile: {
                        iconClass: "icon_address",
                        description: "Address",
                        detailedDescription: "patient address",
                        title: "Patient"
                    },
                    conditionVM: {
                        vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/patientAddressRule.viewmodel.js?v=v2.16.1.0.35",
                        vmName: "snap.admin.patientRules.patientAddressRule",
                        contentPath: "/content/admin/patientRules/rules/patientAddress.html?v=v2.16.1.0.35"
                    },
                    getRuleSummaryInfo: function(ruleObject) {
                        var locationsText = new LocationsText().getLocationsSummary(ruleObject.subjectAddresses);

                        var operator = ruleObject.conditionTypeId === $patientRulesCommon.ruleLogicTypeCodeEnum.NotIn ? "isn't located" : "is located";

                        return ["Allow patients to register if the patient's address", operator, locationsText].join(" ");
                    },
                    getRuleSummaryShortInfo: function(ruleObject) {
                        var shortSummary = new LocationsText().getLacationsShortSummary(ruleObject.subjectAddresses);

                        return { description: shortSummary };
                    },
                    save: function(ruleObject) {
                        return $ruleService.saveAdressRule(ruleObject);
                    },
                    getRuleObject: function(rule) {
                        var rObject = toRuleObject(rule);
                        rObject.subjectAddresses = rule.subjectAddresses;

                        return rObject;
                    },

                    ruleHelpPage: "https://virtualcare.zendesk.com/hc/en-us/articles/224949767-Restrict-Patient-Registration-Based-on-Location"
                },
                {
                    description: "Allow Patient and Provider to see each other if",
                    shortDescription: "Visibility Rule",
                    ruleCategoryId: $patientRulesCommon.ruleCategoryCodeEnum.visibilityRules,
                    ruleTypeId: $patientRulesCommon.ruleTypeCodeEnum.PatientProviderLicenseRule,
                    operators: [
                        {
                            conditionTypeId: $patientRulesCommon.ruleLogicTypeCodeEnum.In,
                            tile: {
                                iconClass: "icon_plus",
                                description: "Includes"
                            }
                        }
                    ],
                    tile:  {
                        iconClass: "icon_v-card",
                        description: "License",
                        detailedDescription: "provider license",
                        title: "Provider"
                    },
                    conditionVM: {
                        vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/visibilityRule.viewmodel.js?v=v2.16.1.0.35",
                        vmName: "snap.admin.patientRules.visibilityRule",
                        contentPath: "/content/admin/patientRules/rules/visibilityRule.html?v=v2.16.1.0.35"
                    },
                    getRuleSummaryInfo: function(ruleObject) {          
                        return ruleObject.conditionSource === $patientRulesCommon.ruleConditionSourceEnum.ProviderLicenseAndPatientAddress ? 
                            "Allow patients and providers to see one another if the patient address matches the state where the providers are licensed to practice." :
                            "Allow patients and providers to see one another if the patient reports a current location in a state where the providers are licensed to practice.";
                    },

                    getRuleSummaryShortInfo: function(ruleObject) {
                        if(ruleObject.conditionSource === $patientRulesCommon.ruleConditionSourceEnum.ProviderLicenseAndPatientAddress) {
                            return  {
                                description: "Patient Address",
                                iconClass: "icon_address"
                            };
                        }

                        return  {
                            description: "Patient Response",
                            iconClass: "icon_help"
                        };
                    },
                    save: function(ruleObject) {
                        return $ruleService.saveProviderLicensePatientAddressRule(ruleObject);
                    },
                    getRuleObject: function(rule) {
                        return toRuleObject(rule);
                    },
                    ruleHelpPage: "https://virtualcare.zendesk.com/hc/en-us/articles/115002342408-Webinar-Provider-Visibility-by-License-Phone-Consult-workflow-Service-Types-"
                }                
            ];

            function LocationsText() {
                var components = {
                    country: "country",
                    state: "state",
                    city: "city"
                };

                this.getLocationsSummary = function(addresses) {
                    var locationSummary = this._getLocationInfo(addresses);

                    var action = getMostSpecificDescription([
                        {
                            addressComponent: locationSummary.countries,
                            action: getCountryLevelSummary
                        },
                        {
                            addressComponent: locationSummary.states,
                            action: getStatesLevelSummary 
                        },
                        {
                            addressComponent: locationSummary.cities,
                            action: getCityAndTownLevelSummary   
                        }
                    ]);

                    return action(locationSummary);
                };

                this.getLacationsShortSummary = function(addresses) {
                    var locationSummary = this._getLocationInfo(addresses);

                    var action = getMostSpecificDescription([
                        {
                            addressComponent: locationSummary.countries,
                            action: getCountryLevelShortSummary  
                        },
                        {
                            addressComponent: locationSummary.states,
                            action: getStatesLevelShortSummary 
                        },
                        {
                            addressComponent: locationSummary.cities,
                            action: getCityAndTownLevelShortSummary  
                        }
                    ]);

                    return action(locationSummary);
                };


                this._getLocationInfo = function(addresses) {
                    return { 
                        countries: getAddressComponents(components.country, addresses),
                        states: getAddressComponents(components.state, addresses),
                        cities: getAddressComponents(components.city, addresses)
                    };  
                };

                function getAddressComponents(component, addresses) {  
                    return addresses.map(function(address) {
                        return address[component];
                    }).filter(function onlyUnique(value, index, self) { 
                        return typeof(value) !== "undefined" && value !== "" && self.indexOf(value) === index;
                    });
                }


                function getMostSpecificDescription(componentAction) {
                    var action = null;
                    for(var i = 0; i < componentAction.length; i++) {
                        var j = i - 1;
                        if((j < 0  || componentAction[j].addressComponent.length == 1) && componentAction[i].addressComponent.length > 0) {
                            action = componentAction[i].action; 
                        } else {
                            break;
                        }
                    }

                    return action;
                }

                function getCountryLevelShortSummary(locationSummary) {
                    var summary = "";

                    if(locationSummary.countries.length === 1) {
                        summary =  locationSummary.countries[0];
                    } else if(locationSummary.countries.length > 1) {
                        summary = "various countries";
                    }

                    return summary;
                }

                function getStatesLevelShortSummary(locationSummary) {
                    var summary = getCountryLevelShortSummary(locationSummary);

                    if(locationSummary.states.length === 1) { 
                        summary =  [summary, locationSummary.states[0]].join(" ");
                    } if (locationSummary.states.length > 1) {
                        summary = [summary, "various regions"].join(" ");
                    }

                    return summary;
                }

                function getCityAndTownLevelShortSummary(locationSummary) {
                    var summary = getStatesLevelShortSummary(locationSummary);

                    if(locationSummary.cities.length === 1) { 
                        summary =  [summary, locationSummary.cities[0]].join(" ");
                    } if (locationSummary.cities.length > 1) {
                        summary = [summary, "various regions"].join(" ");
                    }

                    return summary;
                }

                function getCountryLevelSummary(locationSummary) {
                    var summary = "";

                    if(locationSummary.countries.length === 1) {
                        summary = "anywhere in the " + locationSummary.countries[0];
                    } else if (locationSummary.countries.length > 1) {
                        summary = "various countries";
                    }

                    return summary;
                }

                function getStatesLevelSummary(locationSummary) {
                    var summary = "";

                    if(locationSummary.states.length === 1) { 
                        summary =  "anywhere in the state of "  + locationSummary.states[0];
                        if(locationSummary.countries[0] !== "United States") {
                            summary +=  " in the " + locationSummary.countries[0];
                        }
                    } if (locationSummary.states.length > 1) {
                        summary = "in the various regions in the " + locationSummary.countries[0];
                    }

                    return summary;
                }

                function getCityAndTownLevelSummary(locationSummary) {
                    var summary = "";

                    if(locationSummary.cities.length === 1) { 
                        summary =  ["in ", locationSummary.cities[0], ", ", locationSummary.states[0]].join("");
                        if(locationSummary.countries[0] !==  "United States") {
                            summary +=  " in the " + locationSummary.countries[0];
                        }
                    } else if (locationSummary.cities.length > 1) {
                        summary = "in certain cities and towns in " + locationSummary.states[0];
                    }

                    return summary;
                }
            }
            
        }).singleton();
}(jQuery, snap));
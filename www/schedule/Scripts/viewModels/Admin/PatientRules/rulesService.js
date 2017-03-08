//@ sourceURL=rulesService.js

"use strict";
(function ($, snap) {

    snap.namespace("snap.admin.patientRules").use([])
        .define("patientRulesCommon", function () {
            // In back-end we have many enums which describes rules logic.
            // In front-end we need to have the same enums in oredr to work with data from API.

            this.ruleCategoryCodeEnum = {
                registrationAvailability: 1,
                visibilityRules: 4
            };

            // Code for Type of Rules 
            this.ruleTypeCodeEnum = {
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
            this.ruleConditionSourceEnum = {
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
            this.ruleLogicTypeCodeEnum = {
                // The unknown type
                Unknown: 0,

                // Is the subject in criteria                
                In: 1,

                // Is the subject not in criteria
                NotIn: 2
            };

            this.ruleTileTypes = {
                ruleType: 1,
                conditionType: 2,
            };

            this.rulesDescriptions = [
                {
                    categotyCode: this.ruleCategoryCodeEnum.registrationAvailability,
                    ruleTypeCode: this.ruleTypeCodeEnum.AddressRule,
                    operators: [
                        {
                            ruleOperator: this.ruleLogicTypeCodeEnum.In,
                            tile: {
                                iconClass: "icon_plus",
                                description: "Includes"
                            }
                        },
                        {
                            ruleOperator: this.ruleLogicTypeCodeEnum.NotIn,
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
                        vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/patientAddressRule.viewmodel.js?svp=snapversion",
                        vmName: "snap.admin.patientRules.patientAddressRule",
                        contentPath: "/content/admin/patientRules/rules/patientAddress.html?svp=snapversion"
                    }
                },
                {
                    categotyCode: this.ruleCategoryCodeEnum.visibilityRules,
                    ruleTypeCode: this.ruleTypeCodeEnum.PatientProviderLicenseRule,
                    operators: [
                        {
                            ruleOperator: this.ruleLogicTypeCodeEnum.In,
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
                        vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/visibilityRule.viewmodel.js?svp=snapversion",
                        vmName: "snap.admin.patientRules.visibilityRule",
                        contentPath: "/content/admin/patientRules/rules/visibilityRule.html?svp=snapversion"
                    }
                }
            ];
            
        }).singleton();

    snap.namespace("snap.admin.patientRules").use(["snapHttp"])
        .define("ruleService", function ($http) {

            var ruleApiUrl = "/api/v2.1/admin/rules",
                postalCodeApiUrl = "/api/v2.1/admin/postalcodes",
                addressMetaRuleApi = "/api/v2.1/admin/rules/subject-address-meta-rules",
                providerLicenseMetaRuleApi = "/api/v2.1/admin/rules/provider-license-meta-rules",
                patientResponseMetaRuleApi = "/api/v2.1/admin/rules/patient-response-meta-rules",
                patientProviderLicenseMetaRuleApi = "/api/v2.1/admin/rules/patient-provider-license-meta-rules";

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
                    url: ["/api/v2.1/admin/rules", ruleId].join("/"),
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
                            dfd.fail(error);
                        });
                    }).fail(function(error) {
                        dfd.fail(error);
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

}(jQuery, snap));
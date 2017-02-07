//@ sourceURL=patientRules.viewmodel.js


"use strict";
(function ($, snap, kendo) {

    snap.namespace("snap.admin.patientRules").use(["snapNotification", "snap.common.contentLoader", "snap.admin.patientRules.ruleService", "snap.admin.patientRules.ruleWizard", "snap.EventAggregator", "snap.admin.patientRules.patientRulesCommon", "snap.common.Utility"])
    .extend(kendo.observable)
    .define("patientRulesPageViewModel", function ($snapNotification, $contentLoader, $ruleService, $ruleWizard, $eventAggregator, $ruleCommon, $utility) {
        var scope = this,
            ruleCardActionEnum = {
                on: "on",
                off: "off"
            },
            categoriesOrder = []; // We use this array in order to store order of kendo-sortable item in memory.

        this.isDataInit = false;
        this.categories = [];
        this.ruleWizard = $ruleWizard;

        this.vm_isLoading = false;

        this._loadCategories = function () {
            this.set("vm_isLoading", true);

            var that = this;
            $ruleService.getCategoriesWithRules().done(function (categories) {
                scope.set("categories", categories.map(function (category) {
                    return new Category(category);
                }));

                categoriesOrder = categories.map(function(opt) {
                    return opt.categoryCode;
                });

                that.set("vm_isLoading", false);
            }).fail(function () {
                $snapNotification.error("Internal error. Cannot load rules.");
                that.set("vm_isLoading", false);
            });
        };

        this.load = function () {
            scope = this;
            this.isDataInit = true;

            $contentLoader.bindViewModel(this.ruleWizard, "#ruleWizardContainer", "/content/admin/patientRules/ruleWizard.html");
            this._loadCategories();
            loadJQuery();
        };

        this.leftColToggle = function() {
            this.set("vm_isLeftMenuActive", !this.vm_isLeftMenuActive);
        };

        this.textFilter = "";

        /****************** EVENTS SUBSCRIBLTIONS *********************/
        $eventAggregator.subscriber("wf_rulesChanged", function () {
             scope._loadCategories();
        });

        $eventAggregator.subscriber("rule_splice", function(categoryCode, ruleId, ruleAction) {
            var category = scope._findCategory(categoryCode);

            if(category) {
                category.spliceRuleCardInUI(ruleId, ruleAction);
            }
        });

        $eventAggregator.subscriber("rule_delete", function (categoryCode, ruleId) {
             var category = scope._findCategory(categoryCode);

            if(category) {
                category.deleteRuleCardInUI(ruleId);
            }
        });

        /********************** MVVM BINDINGS *************************/
        this.vm_isLeftMenuActive = false;

        this.vm_onFilterChanged = function () {
            for (var i = 0, l = this.categories.length; i < l; i++) {
                var cathegoryRules = this.categories[i].rules;
                for (var j = 0, ll = cathegoryRules.length; j < ll; j++) {
                    cathegoryRules[j].set("isVisible",
                        cathegoryRules[j].filterTags.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1
                    );
                }
                this.categories[i].trigger("change", { funtion: "vm_getRulesCount" });
            }

        };

        this._findCategory = function(categoryCode) {
            for(var i = 0; i < scope.categories.length; i++) {
                if(scope.categories[i]._categoryCode === categoryCode) {
                    return scope.categories[i];
                }
            }

            return null;
        };

        function loadJQuery() {
            $('.settings-control__tbody').kendoSortable({
                container: $('.settings-control__tbody'),
                handler: '.settings-control__move',
                axis: 'y',
                start: function () {
                    $('.settings-control__row').each(function () {
                        if (!$(this).closest('.settings-control__table').length) {
                            $(this).width($('.settings-control__table').width());
                        }
                    });
                },
                change: function(e) {
                    var item = categoriesOrder.splice(e.oldIndex, 1)[0]; //remove the item that has changed its order
                    categoriesOrder.splice(e.newIndex, 0, item); //add the item back using the newIndex

                    $ruleService.reorderCategory(categoriesOrder).fail(function(error) {
                        window.console.error(error);
                    
                        var errMessage = $utility.formatErrorMessage(error);
                        $snapNotification.error(errMessage);
                    });
                }
            });
        }

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

        function Category(opt) {
            this.categoryName = opt.categoryName;
            this._categoryCode = opt.categoryCode;

            this.rules = opt.rules.map(function (rule) {
                return new Rule(rule);
            });


            /********************* PUBLICK API *************************/
            this.expandDetails = function (isActive) {
                this.set("vm_isActive", isActive);
            };

            this.reloadCards = function () {
                var that = this;
                $ruleService.getFilteredRules({ categoryCode: this._categoryCode }).done(function (rules) {
                    var r = rules.map(function (rule) {
                        return new Rule(rule);
                    }).sort(sortRules);

                    that.set("rules", r);
                    that.trigger("change", { field: "vm_getRulesCount" });
                });
            };

            /******************** MVVM BINDINGS ************************/
            this.vm_isActive = true;

            this.vm_getRulesCount = function () {
                return this.get("rules").filter(function (item) {
                    return item.isVisible === true;
                }).length;
            };

            this.vm_expandCategory = function () {
                this.expandDetails(!this.vm_isActive);
            };

            this.vm_onAddNewRuleClick = function () {
                if (snap.hasAllPermission(snap.security.edit_workflows)) {
                    scope.ruleWizard.createNewRule(this._categoryCode);
                }
                else {
                    $snapNotification.info("You don't have permission to edit the Staff Settings.");
                }
               
            };

            this.spliceRuleCardInUI = function(ruleId, ruleAction) {
                var currentRuleIndex = snap.util.findIndex(this.rules, "ruleId", ruleId);

                var lastActiveRuleIndex = this._getLastActiveRuleIndex();
                var moveToIndex = 0;

                // Note. This logic abouth the way how rules cards should move in list when it on/off taken from prototype.
                if(ruleAction === ruleCardActionEnum.on && currentRuleIndex !== moveToIndex) {
                    moveToIndex = lastActiveRuleIndex + 1;  // if user turn on rule we move it after last active.
                } else if(ruleAction === ruleCardActionEnum.off) {
                    if(lastActiveRuleIndex === currentRuleIndex) {
                        moveToIndex = currentRuleIndex;         // if rule after last active rule do nothing.
                    } else {
                        moveToIndex =  this.rules.length + 1;   // if user turn off rule we move it to the end of the rules list.
                    }
                }

                if(currentRuleIndex !== moveToIndex) {
                    spliceRuleInArray(this.rules, currentRuleIndex, moveToIndex);   
                }
            };

            this.deleteRuleCardInUI = function(ruleId) {
                var currentRuleIndex = snap.util.findIndex(this.rules, "ruleId", ruleId);

                removeRuleFromArray(this.rules, currentRuleIndex);
            };

            this._getLastActiveRuleIndex = function() {
                var lastActiveRuleIndex = -1;
                for(var i = 0; i < this.rules.length; i++) {
                    if(this.rules[i].isRuleEnable()) {
                        lastActiveRuleIndex = i;
                    }
                }

                return lastActiveRuleIndex;
            };

            function sortRules(a, b) {
                if(a.isRuleEnable() && !b.isRuleEnable()) {
                    return 1;
                } 

                if(!a.isRuleEnable() && b.isRuleEnable()) {
                    return -1;
                } 

                return 0;
            }

            function spliceRuleInArray(arr, from, to) {
                var currentRule = arr[from];

                currentRule.set('vm_isRuleMoving', true);

                setTimeout(function() {
                    var item = arr.splice(from, 1);//remove the item that has changed its order
                    arr.splice(to, 0, item[0]); //add the item back using the newIndex

                    setTimeout(function() {
                        currentRule.set('vm_isRuleMoving', false);  
                    }, 100); 
                }, 300);
            }

            function removeRuleFromArray(arr, ruleIndex) {
                arr.splice(ruleIndex, 1); //remove the item from array
            }
        }

        function Rule(opt) {
            this.data = opt;
            this.data.ruleTypeId = opt.ruleTemplate.ruleTypeId;
            this.description = [opt.ruleTemplate.ruleSet.description, "based on", ruleTypeEnum[opt.ruleTemplate.ruleTypeId].description].join(" ");
            this.iconClass = ruleTypeEnum[opt.ruleTemplate.ruleTypeId].iconClass;
            this.logicClass = operatorEnum[opt.conditionTypeId].iconClass;
            this.ruleConditionClass = conditionSourceEnum[opt.conditionSource].iconClass;
            this.ruleId = opt.id;
            this.status = opt.statusCode;
            this.isVisible = true;
            this.filterTags = opt.ruleTemplate.description;

            this.valueDescription = "";
            if (opt.subjectAddresses) {
                var address = opt.subjectAddresses[0];
                if (opt.subjectAddresses.length > 1 || !address.state) {
                    this.valueDescription = (address.country || address.countryCode) + " Various Regions";
                } else {
                    this.valueDescription = address.state + ", " + (address.country || address.countryCode);
                }
            }


            this.categoryCode = opt.ruleTemplate.ruleSet.ruleCategoryId;

            this.isRuleEnable = function() {
                return this.status === 1;    
            };

            /******* MVVM BINDINGS *******/
            this.vm_toggleRule = function () {
                if (snap.hasAllPermission(snap.security.edit_workflows)) {

                    var ruleAction = this.isRuleEnable() ? ruleCardActionEnum.off : ruleCardActionEnum.on;

                    $eventAggregator.published("rule_splice", this.categoryCode, this.ruleId, ruleAction);

                    this.set("status", this.status === 1 ? 3 : 1);
                    this.data.statusCode = this.status;
                    $ruleService.changeRuleStatus(this.ruleId, this.status);

                    this.trigger("change", { field: "vm_isRuleEnabled" });
                    this.trigger("change", { field: "vm_ruleToogleTooltipText" });
                }
                else {
                    $snapNotification.info("You don't have permission to edit the Staff Settings.");
                }
            };
            this.canEditRules = function () {
                if (snap.hasAllPermission(snap.security.edit_workflows)) {
                    return true;
                }
                return false;
            };
            this.vm_deleteRule = function () {
                var that = this;
                $snapNotification.confirmationWithCallbacks("Are you sure you want to delete this rule?", function () {
                    $ruleService.deleteRule(that.ruleId).always(function () {
                        $eventAggregator.published("rule_delete", that.categoryCode, that.ruleId);
                    });
                });

            };
            this.vm_editRule = function () {
                scope.ruleWizard.editRule(this.data);
            };

            this.vm_isRuleEnabled = function () {
                return this.isRuleEnable();
            };

            this.vm_ruleToogleTooltipText = function() {
                return this.isRuleEnable() ? "Deactivate Rule" : "Activate Rule";
            };

            this.vm_isRuleMoving = false;
        }
    }).singleton();
}(jQuery, snap, kendo, window));
//@ sourceURL=ruleWizard.viewmodel.js

"use strict";
(function ($, snap, kendo, window) {
    snap.namespace("snap.admin.patientRules").use(["snapNotification", "snap.EventAggregator", "snap.common.contentLoader", "snap.admin.patientRules.ruleService", "snap.admin.patientRules.patientRulesCommon"])
    .extend(kendo.observable)
    .define("ruleWizard", function ($snapNotification, $eventAggregator, $contentLoader, $ruleService, $patientRulesCommon) {
        /*  Base Rule Architecture:
            Category --> RulesSets --> RuleTemplates --> Rule.

            Details:
            Wizard always work in context of some Category.  
            So, going through wizard steps you can create some rule from template which available in current category.
        */

        var scope = this,
            conditionStepVM = null,
            wizardContext = {},
            wizardStepsEnum = {
                subject: "subject",
                logic: "logic",
                condition: "condition"
            },
            currentStep = wizardStepsEnum.subject,
            alowedRulesDescriptions = [];       // Contains list of allowed rules for current category. Here we should place all nacassaries information.
          
        $eventAggregator.subscriber("onConditionChange", function () {
            scope.trigger("change", { field: "vm_isConditionSelected" });
            scope.trigger("change", { field: "vm_getSelectedCondition" });
        });

        this.isNew = true;

        /********************** PUBLIC API ***********************/
        this.createNewRule = function (ruleCategoryCode) {
            alowedRulesDescriptions = $patientRulesCommon.rulesDescriptions.filter(function(rule){
                return rule.categotyCode === ruleCategoryCode;
            });

            this.set("vm_isRuleWizardVisible", true);
            this.set("isNew", true);

            conditionStepVM = null;
            wizardContext = {
                ruleId: null,
                ruleCategoryCode: ruleCategoryCode
            };
            this._triggerChanges();
            
            goToStep(wizardStepsEnum.subject);

            this.trigger("change", { field: "vm_getTemplatesForCategory" });
            this.trigger("change", { field: "vm_wizardHeaderText" });
            this.trigger("change", { field: "vm_saveRuleButtonCaption" });
            
        };
        this.canEditRules = function () {
            if (snap.hasAllPermission(snap.security.edit_workflows)) {
                return true;
            }
            return false;
        };
        this.editRule = function (rule) {
            alowedRulesDescriptions = $patientRulesCommon.rulesDescriptions.filter(function(ruleDescription){
                return ruleDescription.categotyCode === rule.ruleTemplate.ruleSet.ruleCategoryId;
            });

            this.set("vm_isRuleWizardVisible", true);
            this.set("isNew", false);

            conditionStepVM = null;
            wizardContext = {
                ruleId: rule.id,
                ruleCategoryCode: rule.ruleTemplate.ruleSet.ruleCategoryId,
                ruleTypeCode: rule.ruleTemplate.ruleTypeId,
                ruleOperator: rule.conditionTypeId,
            };
            this._triggerChanges();

            goToStep(wizardStepsEnum.condition);
            
            loadRuleCodition().done(function(ruleVm) {
                conditionStepVM = ruleVm;

                conditionStepVM.setDetails(rule);

                scope.trigger("change", { field: "vm_isConditionSelected" });
                scope.trigger("change", { field: "vm_getSelectedCondition" });
            });    

            scope._triggerChanges();
            scope.isNew = false;
            scope.trigger("change", { field: "vm_wizardHeaderText" });
            scope.trigger("change", { field: "vm_saveRuleButtonCaption" });
        };

        /********************* MVVM BINDINGS *********************/
        this.vm_isRuleWizardVisible = false;
        this.vm_isLoading = false;

        this.vm_wizardHeaderText = function () {
            return this.isNew ? "Create a New Visibility Rule" : "Edit Visibility Rule";
        };

        this.vm_saveRuleButtonCaption = function () {
            return this.isNew ? "Create Rule" : "Update Rule";
        };

        this.vm_isSubjectStep = function () {
            return currentStep === wizardStepsEnum.subject;
        };

        this.vm_isLogicStep = function () {
            return currentStep === wizardStepsEnum.logic;
        };

        this.vm_isConditionStep = function () {
            return currentStep === wizardStepsEnum.condition;
        };

        this.vm_onSubjectStepClick = function () {
            if (this.canEditRules()) {
                goToStep(wizardStepsEnum.subject);
            }
            else
                $snapNotification.info("You don't have permission to edit the Staff Settings.");
        };

        this.vm_onLogicStepClick = function () {
            if (this.canEditRules()) {
                if (this.vm_isTemplateSelected()) {
                    goToStep(wizardStepsEnum.logic);
                }
            }
            else
                $snapNotification.info("You don't have permission to edit the Staff Settings.");

        };

        this.vm_onConditionStepClick = function () {
            if (this.canEditRules()) {
                if (this.vm_isOperatorSelected()) {
                    goToStep(wizardStepsEnum.condition);
                }
            }
            else
                $snapNotification.info("You don't have permission to edit the Staff Settings.");
        };

        this.vm_isConditionSelected = function () {
            if (conditionStepVM) {
                return conditionStepVM.isConditionSelected();
            }

            return false;
        };

        this.vm_getSelectedCondition = function () {
            var tile = {}
            if (conditionStepVM) {
                tile = conditionStepVM.getInfo();
            }

            return kendo.observable(new Tile(tile));
        };

        this.vm_onCancelClick = function () {
            this.set("vm_isRuleWizardVisible", false);
        };

        this.vm_onSaveClick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            this._saveRule();
        };

        this.vm_getTemplatesForCategory = function () {
            var rulesDescriptions = alowedRulesDescriptions;

            if(wizardContext.ruleTypeCode) {
                // exclude already selected template
                rulesDescriptions = rulesDescriptions.filter(function(ruleDescription) {
                    return wizardContext.ruleTypeCode !== ruleDescription.ruleTypeCode;
                });    
            }
            
            return rulesDescriptions.map(function (ruleDescription) {
                return kendo.observable(
                    new Tile(
                        ruleDescription.tile,
                        function () {
                            setRuleType(ruleDescription.ruleTypeCode);
                            goToStep(wizardStepsEnum.logic);
                        })
                );
            });
        };

        this.vm_isTemplateSelected = function () {
            return wizardContext.ruleTypeCode ? true : false;
        };

        this.vm_getSelectedRuleTemplate = function () {
            var selectedRule = getSelectedRuleDescription();
        
            return kendo.observable(new Tile(selectedRule ? selectedRule.tile : {}));
        };

        this.vm_getOperatorsForTemplate = function () {
            var avilableOperators = [];

            var selectedRule = getSelectedRuleDescription();
            if(selectedRule) {
                avilableOperators = selectedRule.operators;

                if(wizardContext.ruleOperator) {
                    avilableOperators = avilableOperators.filter(function (operator) {
                        return operator.ruleOperator !== wizardContext.ruleOperator;
                    });
                }
            }

            return avilableOperators.map(function (operator) {
                return kendo.observable(
                    new Tile(
                        operator.tile,
                        function () {
                            setRuleOperator(operator.ruleOperator);
                            goToStep(wizardStepsEnum.condition);

                            conditionStepVM = null;
                            loadRuleCodition().done(function (ruleVm) {
                                conditionStepVM = ruleVm;
                                if(conditionStepVM.loadViewModel) {
                                    conditionStepVM.loadViewModel();
                                }
                                scope.trigger("change", { field: "vm_isConditionSelected" });
                                scope.trigger("change", { field: "vm_getSelectedCondition" });
                            });
                        })
                );
            });
        };

        this.vm_isOperatorSelected = function () {
            return wizardContext.ruleOperator ? true : false;
        };

        this.vm_getSelectedOperator = function () {
            var operator = null;

            if(wizardContext.ruleOperator) {
                var selectedRule = getSelectedRuleDescription();

                operator = selectedRule.operators.filter(function(operator) {
                    return operator.ruleOperator === wizardContext.ruleOperator;
                })[0];
            }

            return kendo.observable(new Tile(operator ? operator.tile : {}));
        };


        /******************** PRIVATE METHODS ********************/
        this._triggerChanges = function () {
            this.trigger("change", { field: "vm_getTemplatesForCategory" });
            this.trigger("change", { field: "vm_getSelectedRuleTemplate" });
            this.trigger("change", { field: "vm_isTemplateSelected" });

            this.trigger("change", { field: "vm_getOperatorsForTemplate" });
            this.trigger("change", { field: "vm_getSelectedOperator" });
            this.trigger("change", { field: "vm_isOperatorSelected" });
        };

        this._saveRule = function() {
            if (conditionStepVM && typeof (conditionStepVM.saveRule) === "function") {
                this.set("vm_isLoading", true);
                conditionStepVM.saveRule(wizardContext).done(function () {
                    scope.set("vm_isRuleWizardVisible", false);
                }).always(function () {
                    scope.set("vm_isLoading", false);
                    $eventAggregator.published("wf_rulesChanged");
                });
            } else {
                window.console.error("Condition step VM is null.");
                scope.set("vm_isRuleWizardVisible", false);
            }
        };

        function getSelectedRuleDescription() {
            return alowedRulesDescriptions.filter(function(rule) {
                    return wizardContext.ruleTypeCode === rule.ruleTypeCode;
            })[0];
        }

        function loadRuleCodition() {
            var ryleDescription = getSelectedRuleDescription();

            if(ryleDescription) {
                return $contentLoader.loadModule(ryleDescription.conditionVM, "#ruleConditionContainer");
            }

            window.console.log("ruleTypeId:" + ruleTypeId);
            $snapNotification.error("Unknowm condition module.");

            throw "Unknowm condition module.";
        }

        function goToStep(step) {
            currentStep = step;

            scope.trigger("change", { field: "vm_isSubjectStep" });
            scope.trigger("change", { field: "vm_isLogicStep" });
            scope.trigger("change", { field: "vm_isConditionStep" });
            scope.trigger("change", { field: "vm_isConditionSelected" });
            scope.trigger("change", { field: "vm_getSelectedCondition" });
        }

        function setRuleType(ruleTypeCode) {
            wizardContext = {
                ruleId: wizardContext.ruleId,
                ruleCategoryCode: wizardContext.ruleCategoryCode,
                ruleTypeCode: ruleTypeCode,
            };

            scope._triggerChanges();
        }

        function setRuleOperator(ruleOperator) {
            wizardContext.ruleOperator = ruleOperator; //no need to clear data. this is a safe operation.

            scope._triggerChanges();
        }

        function Tile(tile, onClickCallback) {
            this.description = tile.description;
            this.iconClass =tile.iconClass;
            this.title = tile.title;

            this.vm_onClick = function () {
                if (onClickCallback) {
                    onClickCallback();
                }
            };
        }

    }).singleton();
}(jQuery, snap, kendo, window));
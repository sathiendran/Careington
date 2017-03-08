//@ sourceURL=visibilityRule.viewmodel.js

"use strict";
(function ($, snap, kendo, window) {
    snap.namespace("snap.admin.patientRules").use(["snapNotification", "snap.EventAggregator", "snap.admin.patientRules.ruleService", "snap.admin.patientRules.patientRulesCommon"])
     .extend(kendo.observable)
    .define("visibilityRule", function ($snapNotification, $eventAggregator, $ruleService, $rulesCommon) {
        var addressType = {
            patientAddress: $rulesCommon.ruleConditionSourceEnum.ProviderLicenseAndPatientAddress,
            encounterAddress: $rulesCommon.ruleConditionSourceEnum.ProviderLicenseAndEncounterAddress
        },
        selectedAddress = null;

        this.saveRule = function(ruleContext) {
            var ruleDescription = {
                ruleTypeId: $rulesCommon.ruleTypeCodeEnum.PatientProviderLicenseRule,
                providerId: snap.hospitalSession.hospitalId,
                statusCode: 1, //always 1 for new rule
                id: ruleContext.ruleId,
                conditionTypeId: ruleContext.ruleOperator,
                conditionSource: selectedAddress
            };

            return $ruleService.saveProviderLicensePatientAddressRule(ruleDescription).fail(function (err) {
                if (typeof (err) === "string") {
                    $snapNotification.error(err);
                }
            });
        };

        //***************************** PUBLIC API ******************************
        this.loadViewModel = function() {
            selectedAddress = null;
            this._refreshVisibility();
        };

        this.setDetails = function(rule) {
            selectedAddress = rule.conditionSource;
            this._refreshVisibility();
        };

        this.getInfo = function() {
            var info = selectedAddress === addressType.patientAddress ? 
                {
                    description: "Patient Address",
                    iconClass: "icon_address"
                }: 
                {
                    description: "Patient Response",
                    iconClass: "icon_help"
                };

            return info;
        };

        this.isConditionSelected = function() {
            return selectedAddress !== null;
        };

        this.vm_onPetientAddressClick = function() {
            selectedAddress = addressType.patientAddress;
            this._refreshVisibility();
            $eventAggregator.published("onConditionChange"); 
        };

        this.vm_onEncounterAddressClick = function() {
            selectedAddress = addressType.encounterAddress;
            this._refreshVisibility();
            $eventAggregator.published("onConditionChange"); 
        };

        this.vm_isPetientAddressVisible = function() {
            return selectedAddress !== addressType.patientAddress;
        };

        this.vm_isEncounterAddressVisible = function() {
            return selectedAddress !== addressType.encounterAddress;
        };

        this._refreshVisibility = function() {
            this.trigger("change", { field: "vm_isPetientAddressVisible" });
            this.trigger("change", { field: "vm_isEncounterAddressVisible" });
        };
    }).singleton();
}(jQuery, snap, kendo, window));
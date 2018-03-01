//@ sourceURL=scheduleEncounterMethodSelector.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common.schedule")
        .use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.common.schedule.ScheduleCommon",
            "snap.helper.encounterMethodHelper"
        ]).define("encounterMethodSelector", function (
            $snapNotification,
            $eventAggregator,
            $scheduleCommon,
            $encounterMethodHelper
        ) {
            var encounterTypeCodes = snap.enums.EncounterTypeCode;
            var $scope = this;

            this.events = {
                onMethodSelected: "encounterMethodSelector_onMethodSelected"
            };

            function EncounterMethod(opt) {
                this.typeCode = opt.typeCode;
                this.name = opt.name;
                this._isSelected = false;
                this._isDisabled = !!opt.isDisabled;

                var selectCallback = opt.selectCallback || function() {};

                this._setSelection = function (isSelected) {
                    this._isSelected = isSelected;
                    this.trigger("change", { field: "vm_isHidden"});
                    this.trigger("change", { field: "vm_isSelected"});
                };

                this.select = function() {
                    this._setSelection(true);
                };

                this.unSelect = function() {
                    this._setSelection(false);
                };

                this.vm_isSelected = function() {
                    return this._isSelected;
                };
                this.vm_isDisabled = function() {
                    return this._isDisabled;
                };
                this.vm_isHidden = function() {
                    return !this._isSelected && this._isDisabled;
                };
                this.vm_onSelect = function(e) {
                    e.preventDefault();
                    selectCallback.call($scope, this.typeCode);
                };

                this.vm_isVideoType = function() {
                    return this.typeCode === encounterTypeCodes.Video;
                };
                this.vm_isPhoneType = function() {
                    return this.typeCode === encounterTypeCodes.Phone;
                };
                this.vm_isChatType = function() {
                    return this.typeCode === encounterTypeCodes.Text;
                };
                this.vm_isInPersonType = function() {
                    return this.typeCode === encounterTypeCodes.InPerson;
                };
            }

            function MethodSelector(opt) {
                var $selector = this;
                opt = opt || {};

                this.encounterTypeCode = opt.encounterTypeCode || null;
                this.vm_isReadOnly = !!opt.isReadOnly;
                this.appointmentTypeCode = opt.appointmentTypeCode || $scheduleCommon.appointmentTypeCode.clinicianScheduled;

                var onMethodSelect = function(typeCode) {
                    if (this.vm_isReadOnly) {
                        return;
                    }
                    $selector.encounterTypeCode = typeCode;

                    $selector.vm_methods.forEach(function(encounterMethod) {
                        encounterMethod.unSelect();
                    });
                    var selectedItem = $selector.vm_methods.find(function(method) {
                        return method.typeCode === $selector.encounterTypeCode;
                    });
                    if (selectedItem) {
                        selectedItem.select();
                    }
                    $selector.trigger($scope.events.onMethodSelected, typeCode);
                };

                var methodOpts = [
                    {typeCode: encounterTypeCodes.Video},
                    {typeCode: encounterTypeCodes.Phone},
                    {typeCode: encounterTypeCodes.Text},
                    {typeCode: encounterTypeCodes.InPerson}
                ];
                methodOpts.forEach(function(methodOpt) {
                    methodOpt.selectCallback = onMethodSelect;
                    methodOpt.name = $encounterMethodHelper.getEncounterTypeName(methodOpt.typeCode);
                    methodOpt.isDisabled = !$encounterMethodHelper.isEncounterMethodEnabled(methodOpt.typeCode, $selector.appointmentTypeCode);
                });

                this.vm_methods = methodOpts.map(function(opt) {
                    return kendo.observable(new EncounterMethod(opt));
                });

                this.select = function(encounterTypeCode) {
                    $selector.encounterTypeCode = encounterTypeCode;
                    var encounterMethod = $selector.vm_methods.find(function(method) {
                        return method.typeCode === $selector.encounterTypeCode;
                    });
                    if (encounterMethod) {
                        encounterMethod.select();
                    }
                };

                this.setReadonly = function (isReadOnly) {
                    this.set("vm_isReadOnly", isReadOnly);
                };

                this.load = function() {
                    $selector = this;
                    this.trigger("change", { field: "vm_methods" });
                    if (this.encounterTypeCode) {
                        this.select(this.encounterTypeCode);
                    }
                    
                };
            }

            this.createSelector = function (opt) {
                var selector = kendo.observable(new MethodSelector(opt));
                selector.load();
                return selector;
            };

        }).singleton();

}(jQuery, snap, kendo));


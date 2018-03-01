//@ sourceURL=contactUsDialog.viewmodel.js

;
(function($, global, snap, kendo) {
    "use strict";

    snap.namespace("snap.shared")
        .use([
            "eventaggregator",
            "SnapNotification",
            "snap.shared.landingCommon"
        ])
        .extend(kendo.observable)
        .define("contactUsDialogViewModel", function(
            $eventaggregator,
            $snapNotification,
            $landingCommon
        ) {

            var $scope = this,
                dialog = null,
                loaded = false;

            this.events = {
                onScheduleOnlineClick: "contactUsDialogViewModel_onScheduleOnlineClick"
            };

            this._interfaceType = $landingCommon.interfaceTypeEnum.common;
            this._isUserPage = false;

            this.vm_generalPhoneNumber = "";
            this.vm_supportPhoneNumber = "";
            this.vm_appointmentsContactNumber = "";
            this.vm_generalEmail = "";
            this.vm_supportEmail = "";
            this.vm_address = {};
            this.vm_addressText = "";
            this.vm_brandImage = "";
            this.vm_hospitalLogo = "";
            this.vm_isGetDirectionsVisible = false;
            this.vm_isContactPhoneVisible = false;
            this.vm_isContactEmailVisible = false;
            this.vm_isHelpCenterVisible = false;

            // blocks state properties
            this.vm_isAddressDisabled = true;
            this.vm_isAppointmentsDisabled = false;
            this.vm_isSupportDisabled = true;
            this.vm_isOtherInquiriesDisabled = false;

            this.vm_isAddressHidden = false;
            this.vm_isAppointmentsHidden = false;
            this.vm_isSupportHidden = false;
            this.vm_isOtherInquiriesHidden = false;

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                this._interfaceType = opt.opt && opt.opt.interfaceType || $landingCommon.interfaceTypeEnum.common;
                this._isUserPage = opt.opt && opt.opt.isUserPage;

                this.set("vm_isHelpCenterVisible", this._isUserPage);
                this.trigger("change", { field: "vm_isScheduleOnlineAvailable" });

                if (!loaded) {
                    this._load();
                } else {
                    this._updateBlocksVisibilityState();
                }
            };

            this.onDialogClose = function() {
                $eventaggregator.published($landingCommon.events.onDialogClose);
            };


            this.vm_callHospitalLink = function() {
                return "tel:" + this.vm_generalPhoneNumber;
            };
            this.vm_callSupportLink = function() {
                return "tel:" + this.vm_supportPhoneNumber;
            };
            this.vm_callAppointmentsLink = function() {
                return "tel:" + this.vm_appointmentsContactNumber;
            };
            this.vm_mailtoHospitalLink = function() {
                return "mailto:" + this.vm_generalEmail;
            };
            this.vm_mailtoSupportLink = function() {
                return "mailto:" + this.vm_supportEmail;
            };
            this.vm_isScheduleOnlineAvailable = function() {
                return this._interfaceType === $landingCommon.interfaceTypeEnum.patient && snap.hospitalSettings.providerSearch;
            };


            this.vm_onScheduleOnlineClick = function(e) {
                e.preventDefault();
                if (this.vm_isScheduleOnlineAvailable()) {
                    this.trigger(this.events.onScheduleOnlineClick);
                }
                dialog.close();
            };
            this.vm_onGetDirectionsClick = function(e) {
                e.preventDefault();
                var url = "https://www.google.ru/maps/search/" + window.encodeURIComponent(this.vm_addressText);
                var win = window.open(url, '_blank');
                if (win) {
                    win.focus();
                } else {
                    $snapNotification.info('Please allow popups for this site');
                }
            };
            this.vm_onHelpCenterClick = function(e) {
                e.preventDefault();

                if (!this._isUserPage) {
                    return;
                }

                if (this._interfaceType === $landingCommon.interfaceTypeEnum.provider) {
                    snap.openHelp("clinician");
                } else if (this._interfaceType === $landingCommon.interfaceTypeEnum.admin) {
                    snap.openHelp("admin");
                } else {
                    snap.openHelp("patient");
                }
            };
            this.vm_onCloseClick = function(e) {
                e.preventDefault();
                dialog.close();
                $eventaggregator.published($landingCommon.events.onDialogClose);
            };

            // sets contact blocks visibility
            // to prevent displaying empty blocks without any data
            this._updateBlocksVisibilityState = function() {
                this.set("vm_isAddressDisabled", !this.vm_isAddressVisible && !this.vm_isGetDirectionsVisible);
                this.set("vm_isSupportDisabled", !this.vm_isSupportPhoneVisible && !this.vm_isHelpCenterVisible);
                this.set("vm_isAppointmentsDisabled", !this.vm_isAppointmentsContactPhoneVisible && !this.vm_isScheduleOnlineAvailable());
                this.set("vm_isOtherInquiriesDisabled", !this.vm_isContactPhoneVisible && !this.vm_isContactEmailVisible);

                var blocks = [
                    new Block({isDisabled: this.vm_isAddressDisabled}),
                    new Block({isDisabled: this.vm_isSupportDisabled}),
                    new Block({isDisabled: this.vm_isAppointmentsDisabled}),
                    new Block({isDisabled: this.vm_isOtherInquiriesDisabled})
                ];

                var disabledIndexes = [];
                blocks.forEach(function(block, index) {
                    if (block.isDisabled) {
                        disabledIndexes.push(index);
                    }
                });
                // if two or more blocks are disabled, hide first two disabled blocks
                if (disabledIndexes.length >= 2) {
                    blocks[disabledIndexes[0]].isHidden = true;
                    blocks[disabledIndexes[1]].isHidden = true;
                }

                // set vm visibility properties
                this.set("vm_isAddressHidden", blocks[0].isHidden);
                this.set("vm_isSupportHidden", blocks[1].isHidden);
                this.set("vm_isAppointmentsHidden", blocks[2].isHidden);
                this.set("vm_isOtherInquiriesHidden", blocks[3].isHidden);
            };

            this._setHospitalAddress = function (hospitalID) {
                var dfd = $.Deferred();
                var path = "/api/v2/hospitaladdress/" + hospitalID;
                $.ajax({
                    url: path,
                    type: 'GET',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                }).then(function(response) {
                    var addressObj = response.data[0].addressObject || {};
                    $scope.set("vm_address", addressObj);
                    $scope.set("vm_addressText", addressObj.addressText || "");
                    $scope.set("vm_isAddressVisible", !!$scope.vm_addressText);
                    $scope.set("vm_isGetDirectionsVisible", $scope.vm_addressText && snap.hospitalSettings.includeDirections);
                    dfd.resolve();
                }, function() {
                    $scope.set("vm_address", {});
                    $scope.set("vm_addressText", "");
                    $scope.set("vm_isAddressVisible", false);
                    $scope.set("vm_isGetDirectionsVisible", false);
                    dfd.reject();
                });
                return dfd.promise();
            };

            this._load = function() {
                loaded = true;

                if (snap.hospitalSession.appointmentsContactNumber) {
                    this.set("vm_appointmentsContactNumber", snap.hospitalSession.appointmentsContactNumber);
                    this.set("vm_isAppointmentsContactPhoneVisible", true);
                    this.trigger("change", { field: "vm_callAppointmentsLink" });
                }
                if (snap.hospitalSession.itDepartmentContactNumber) {
                    this.set("vm_supportPhoneNumber", snap.hospitalSession.itDepartmentContactNumber);
                    this.set("vm_isSupportPhoneVisible", true);
                    this.trigger("change", { field: "vm_callSupportLink" });
                }
                if (snap.hospitalSession.contactNumber) {
                    this.set("vm_generalPhoneNumber", snap.hospitalSession.contactNumber);
                    this.set("vm_isContactPhoneVisible", true);
                    this.trigger("change", { field: "vm_callHospitalLink" });
                }

                this.set("vm_brandImage", snap.hospitalSession.brandBackgroundImage);
                this.set("vm_hospitalLogo", snap.hospitalSession.hospitalLogo);

                this._setHospitalAddress(snap.hospitalSession.hospitalId).always(function() {
                    // update blocks visibility state after all data is loaded and set
                    $scope._updateBlocksVisibilityState();
                });
            };

            function Block(opt) {
                this.isDisabled = opt.isDisabled;
                this.isHidden = false;
            }

        }).singleton();
}(jQuery, window, snap, kendo));
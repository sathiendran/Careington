//@ sourceURL=selfSchedulingService.js
var setUserVars = function () {
    snap.userSession = JSON.parse(localStorage.getItem("snap_user_session"));
    snap.profileSession = JSON.parse(localStorage.getItem("snap_patientprofile_session"));
    snap.hospitalSession = JSON.parse(localStorage.getItem("snap_hospital_session"));
    snap.hospitalSettings = JSON.parse(localStorage.getItem("snap_hospital_settings"));
};
(function ($, snap) {
    "use strict";

    snap.namespace("snap.service").using(["snapHttp"]).define("selfSchedulingService", function ($http) {

        var apptApiUrl = snap.baseUrl + "/api/v2.1/patients/appointments";
        var getApptApiUrl = function () {
            // if (!snap.userSession) {
            snap.userSession = JSON.parse(localStorage.getItem("snap_user_session"));
            snap.profileSession = JSON.parse(localStorage.getItem("snap_patientprofile_session"));
            snap.hospitalSession = JSON.parse(localStorage.getItem("snap_hospital_session"));
            snap.hospitalSettings = JSON.parse(localStorage.getItem("snap_hospital_settings"));
            //}

            return snap.baseUrl + "/api/v2.1/patients/appointments";
        }
        this.getAppointment = function (apptId) {

            return $http.get([getApptApiUrl(), apptId].join("/"));
        }
        this.getUserCurrentTime = function () {
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time");
        }
        this.addAppointment = function (appt) {
            var path = getApptApiUrl();
            var headers = util.getHeaders();

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };

        this.removeAppointment = function (appointmentId) {
            var path = [getApptApiUrl(), appointmentId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path
            });
        };

        this.updateAppointment = function (appt, apptId) {
            var path = [getApptApiUrl(), apptId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };
        this.getSingleClinician = function (clinicianUserId, date) {
            return $.ajax({
                type: "GET",
                url: [snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", clinicianUserId].join("/"),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: { date: date },
            });
        };

        this.getServiceTypes = function (appointmentType) {
            var opt = {
                appointmentType: appointmentType
            };
            return $.get(snap.baseUrl + "/api/v2.1/patients/service-types", opt);
        };

        this.getCliniciansCards = function (opt) {
            return $http.get(snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", opt);
        };

        this.getFamillyGroup = function (opt) {
            return $http.get(snap.baseUrl + "/api/v2.1/patients/authorized-patients", opt);
        };

        this.getFamillyGroupPatient = function (patientId) {
            return $http.get([snap.baseUrl + "/api/v2.1/patients/authorized-patients", patientId].join("/"));
        };

        this.getClinicianCard = function (userId, date) {
            return $.get([snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", userId].join("/"), { date: date });
        };

        this.addClinicianToFavourites = function (data) {
            return $.ajax({
                type: "POST",
                url: snap.baseUrl + "/api/v2.1/patients/favorite-clinicians",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
            });
        };

        this.removeClinicianFromFavourites = function (personId) {
            //Real API call.
            return $.ajax({
                type: "DELETE",
                url: [snap.baseUrl + "/api/v2.1/patients/favorite-clinicians", personId].join("/"),
            });
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
//@ sourceURL=encounterMethod.helper.js
;
(function ($, snap) {
    "use strict";
    snap.namespace("snap.helper")
        .use([
            "snap.common.schedule.ScheduleCommon"
        ])
        .define("encounterMethodHelper", function (
            $scheduleCommon
        ) {
            var adminEncounterMap = {},
                patientEncounterMap = {},
                onDemandEncounterMap = {},
                encounterNameMap = {},
                $encounterTypeCode = snap.enums.EncounterTypeCode;

            adminEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableAdminScheduleVideoConsultation;
            adminEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableAdminSchedulePhoneConsultation;
            adminEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableAdminScheduleChatConsultation;
            adminEncounterMap[$encounterTypeCode.InPerson] = snap.hospitalSettings.enableAdminScheduleInPersonConsultation;

            patientEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableSelfScheduleVideoConsultation;
            patientEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableSelfSchedulePhoneConsultation;
            patientEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableSelfScheduleChatConsultation;
            patientEncounterMap[$encounterTypeCode.InPerson] = snap.hospitalSettings.enableSelfScheduleInPersonConsultation;

            onDemandEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableOnDemandVideoConsultation;
            onDemandEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableOnDemandPhoneConsultation;
            onDemandEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableOnDemandChatConsultation;

            this.vm_isVideoEnabled = snap.hospitalSettings.enableOnDemandVideoConsultation;
            this.vm_isPhoneEnabled = snap.hospitalSettings.enableOnDemandPhoneConsultation;
            this.vm_isChatEnabled = snap.hospitalSettings.enableOnDemandChatConsultation;

            encounterNameMap[$encounterTypeCode.Video] = "Video";
            encounterNameMap[$encounterTypeCode.Phone] = "Phone";
            encounterNameMap[$encounterTypeCode.Text] = "Chat";
            encounterNameMap[$encounterTypeCode.InPerson] = "In Person";

            this.getEncounterTypeName = function (typeCode) {
                return encounterNameMap[typeCode] || "None Reported";
            };

            this.getFirstEnabledEncounterMethod = function (appointmentTypeCode) {
                var encounterMap;
                if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                    encounterMap = patientEncounterMap;
                } else if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.onDemand) {
                    encounterMap = onDemandEncounterMap;
                } else {
                    encounterMap = adminEncounterMap;
                }
                if (encounterMap[$encounterTypeCode.Video]) {
                    return $encounterTypeCode.Video;
                } else if (encounterMap[$encounterTypeCode.Phone]) {
                    return $encounterTypeCode.Phone;
                } else if (encounterMap[$encounterTypeCode.Text]) {
                    return $encounterTypeCode.Text;
                } else if (encounterMap[$encounterTypeCode.InPerson]) {
                    return $encounterTypeCode.InPerson;
                }
                return $encounterTypeCode.None;
            };

            this.isEncounterMethodEnabled = function (encounterType, appointmentTypeCode) {
                if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                    return patientEncounterMap[encounterType] || false;
                } else if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.onDemand) {
                    return onDemandEncounterMap[encounterType] || false;
                }
                return adminEncounterMap[encounterType] || false;
            };

        });

}(jQuery, snap));



(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snap.service.selfSchedulingService", "snap.admin.schedule.TimeUtils", "snap.common.overlay", "snap.common.schedule.ScheduleCommon", "snap.patient.patientEnterConsultationHelper"])
        .define("patientAppointmentService", function ($selfSchedulingService, $timeUtils, $overlay, $scheduleCommon, $patientEnterConsultationHelper) {
            var formatErrorMessage = function (error) {
                if (typeof (error) === "undefined" || error === null) {
                    return "Unknown error";
                }

                window.console.error(error);

                var errorMessage;
                if (typeof (error) === 'string') {
                    errorMessage = error;
                } else {
                    if (error.status === 500) {
                        errorMessage = "Internal server error";
                    } else if (error.status === 404) {
                        errorMessage = "Not found";
                    } else if (error.responseText) {
                        errorMessage = error.responseText;
                        try {
                            var parsedMessage = JSON.parse(errorMessage);
                            if (!!parsedMessage.message) {
                                errorMessage = parsedMessage.message;
                            }
                        } catch (e) {

                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };

            function saveAppt(appt) {
                var dfd = $.Deferred();
                appt.startTime = $timeUtils.dateToString(appt.start);
                appt.endTime = $timeUtils.dateToString(appt.end);
                appt.where = appt.phoneNumber;
                appt.whereUse = appt.phoneType;
                delete appt.start;
                delete appt.end;
                delete appt.phoneNumber;
                delete appt.phoneType;

                var action = appt.id === 0 ?
                    $selfSchedulingService.addAppointment(appt) :
                    $selfSchedulingService.updateAppointment(appt, appt.id);

                action.done(function (response) {
                    dfd.resolve(response);
                }).fail(function (response) {
                    dfd.reject(response);
                });

                return dfd.promise();
            }


            function saveAppointmen(appt) {
                var dfd = $.Deferred();
                sessionStorage.setItem("appointPatId", appt.participants[1].patientId);
                saveAppt(appt).done(function (appointmentResponse) {
                    if (appt.isNow && $overlay) {
                        var isLoading = true;

                        $overlay.loadOverlay();
                        $overlay.setLoadingIcn("images/Clipboard-Anim-C.svg");
                        $overlay.toggleOverlay();


                        setTimeout(function () {
                            if (isLoading) {
                                $overlay.setLoadingTxt("Sending your appointment information.");
                            }
                        }, 3000);

                        setTimeout(function () {
                            if (isLoading) {
                                $overlay.setLoadingTxt("Prepping your consultation room.");
                            }
                        }, 6000);

                        //tony.y: i should not do this, copypaste from \Scripts\pagevm\sharedvm\consultationsListing.viewmodel.js direct violation of DRY principle
                        // TODO: create common service to inject it into this object
                        snap.patientPage = true;
                        if (snap.patientPage) {
                            debugger;
                            var path = snap.baseUrl + '/api/v2.1/patients/appointments/' + appointmentResponse.data[0].appointmentId;
                            $.ajax({
                                type: "GET",
                                url: path,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    isLoading = false;
                                    var data = response.data[0];
                                    //this works slow
                                    $overlay.setLoadingIcn("images/Clipboard-Done-C.svg");
                                    $overlay.setLoadingTxt("All set.");

                                    if (appt.encounterTypeCode === snap.enums.EncounterTypeCode.Phone || appt.encounterTypeCode === snap.enums.EncounterTypeCode.InPerson) {
                                        $overlay.setSubTxt("A provider will call you shortly.");
                                    } else {
                                        //$overlay.setSubTxt("Accept the consent to treat agreement to enter the waiting room.");
                                        $overlay.setSubTxt(" ");
                                    }

                                    // window.setTimeout(function() {
                                    //     $overlay.toggleOverlay();
                                    // }, 2000);

                                    window.setTimeout(function () {
                                        Snap.Patient.PatientHomeNewViewModel().goToSchedConsultInternal(data, function () {
                                            window.setTimeout(function () {
                                                // $overlay.toggleOverlay();
                                            }, 4000);
                                        });
                                    }, 2000);

                                    /*  var patient = $scheduleCommon.findPatient(data.participants);
                                      var opt = {
                                          patientId: data.patientId,
                                          patientPersonId: patient.personId,
                                          appointmentId: data.appointmentId,
                                          encounterTypeCode: data.encounterTypeCode,
                                      };
                                      $patientEnterConsultationHelper.enterConsultation(opt).then(function() {
                                          window.setTimeout(function() {
                                              $overlay.toggleOverlay();
                                          }, 2000);
                                      }, function() {
                                          $overlay.toggleOverlay();
                                      });*/
                                },
                                error: function () {
                                    snapError("Cannot find appointment.");
                                    $overlay.toggleOverlay();
                                }
                            });
                        }

                    }
                    sessionStorage.setItem("SSscheduledAppointmentId", appointmentResponse.data[0].appointmentId);
                    dfd.resolve(appointmentResponse); //Success
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd.promise();
            }

            this.removeAppointment = function (id) {
                var def = $.Deferred();
                $selfSchedulingService.removeAppointment(id).done(function () {
                    def.resolve();
                }).fail(function (error) {
                    def.reject(formatErrorMessage(error));
                });
                return def.promise();
            };

            this.saveAppointment = function (obj) {
                return saveAppointmen(obj);
            };

            this.getClinician = function (clinicianId, date) {
                var dfd = $.Deferred();
                $selfSchedulingService.getSingleClinician(clinicianId, date).done(function (clinicianResp) {
                    var doc = clinicianResp.data[0];
                    var docPerson = {
                        id: doc.personId,
                        photoUrl: doc.photo,
                        providerId: snap.hospitalSession.hospitalId,
                        name: {
                            given: doc.name,
                            family: doc.lastName
                        }
                    };
                    doc.person = docPerson;
                    doc.fullName = [doc.name, doc.lastName].join(" ");

                    dfd.resolve(doc);
                });
                return dfd.promise();
            };

            this.getAppointment = function (apptId) {
                var promise = $.Deferred();
                var that = this;
                $selfSchedulingService.getAppointment(apptId).done(function (resp) {
                    var appt = resp.data[0];
                    that.getClinician(appt.clinicianId, $timeUtils.dateToString($timeUtils.dateFromSnapDateString(appt.startTime))).done(function (clinicianResp) {
                        appt.clinician = clinicianResp;
                        promise.resolve(appt);
                    }).fail(function () {
                        promise.reject();
                    });
                }).fail(function () {
                    promise.reject();
                });
                return promise.promise();
            };
        });
}(jQuery, snap, kendo));

//@ sourceURL=patientResponseAddressDialog.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient")
        .use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.admin.patientRules.ruleService",
            "snap.DataService.customerDataService",
            "snap.helper.locationHelper"
        ])
        .define("patientResponseAddressDialog", function ($snapNotification, $eventAggregator, $ruleService, $customerDataService, $locationHelper) {

            var userId = null;
            var patientId = null;
            var dialog = null;

            this.isEditMode = false;

            this.countryCodes = [];
            this.regions = [];

            this.selectedCountry = null;
            this.selectedRegion = null;
            this.currentLocationText = "";
            this.currentLocation = "";

            this.vm_isLocationAutocompleteFocused = false;
            this.vm_countryError = false;
            this.vm_isCountryFilled = true;
            this.vm_stateError = false;
            this.vm_isStateFilled = false;
            this.vm_isError = false;
            this.vm_isLoading = false;

            this.vm_patientProfileImg = global.getDefaultProfileImageForPatient();


            /* Initialization */
            this.setOptions = function (opt) {
                dialog = opt.dialog;
                patientId = opt.opt.patientId;

                this.set("currentLocationText", opt.opt.currentLocationText);
                this.set("vm_patientProfileImg", opt.opt.imageSource || global.getDefaultProfileImageForPatient());
                this.set("vm_fullName", opt.opt.fullName);
                this.set("vm_firstName", opt.opt.firstName);

                this.currentLocation = opt.opt.currentLocation;

                var that = this;
                this._loadCountries().done(function () {
                    that._loadStatesForSelectedCountry();
                });

                this.set("isEditMode", false);
                this.set("vm_isLocationAutocompleteFocused", false);
                this.set("vm_countryError", false);
                this.set("vm_stateError", false);
                this.set("vm_isError", false);
                this.set("vm_isLoading", false);

                this.set("vm_isLoading", false);

                this.trigger("change", { field: "vm_isSelfLocationDialog" });
                this.trigger("change", { field: "vm_saveButtonText" });
            };

            this.onDialogCreate = function () {
                var that = this;

                $('.search input').on('focus', function () {
                    that.set("vm_isLocationAutocompleteFocused", true);
                });

                $('.search input').on('blur', function () {
                    that.set("vm_isLocationAutocompleteFocused", false);
                });
            };


            /* MVVM properties */

            this.vm_saveButtonText = function () {
                return this.vm_isError ? "Retry?" : "Save";
            };

            this.vm_isRegionsAutocompleteEnable = function () {
                return this.regions.length > 0;
            };

            this.vm_isSelfLocationDialog = function () {
                return patientId === snap.profileSession.profileId;
            };


            /* MVVM actions */

            this.vm_onYesClick = function () {
                this.set("vm_isLoading", true);

                var that = this;

                var locationEncoded = $locationHelper.encodeLocation(this.currentLocation);

                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function (response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", that.currentLocation, addressText);
                });
            };

            this.vm_onNoClick = function () {
                this.set("isEditMode", true);
            };

            this.vm_onCancelClick = function () {
                this.set("isEditMode", false);
            };

            this.vm_onSaveClick = function () {
                if (!this._validate()) {
                    this.set("vm_isError", true);
                    this.trigger("change", { field: "vm_saveButtonText" });
                    return false;
                }

                this.set("vm_isError", false);
                this.trigger("change", { field: "vm_saveButtonText" });

                this.set("vm_isLoading", true);

                var selectedLocation = {
                    countryCode: this.selectedCountry.value,
                    countryName: this.selectedCountry.text,
                    regionCode: this.selectedRegion ? this.selectedRegion.value : null,
                    regionName: this.selectedRegion ? this.selectedRegion.text : null
                };
                var locationEncoded = $locationHelper.encodeLocation(selectedLocation);

                var that = this;
                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function (response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", selectedLocation, addressText);
                });
            };

            this.vm_onCountryChange = function () {
                this._loadStatesForSelectedCountry();
            };

            this.vm_onRegionChange = function () {
                this.set("vm_stateError", !this.selectedRegion || !this.selectedRegion.value);
                this.set("vm_isError", this.vm_stateError);
                this.trigger("change", { field: "vm_saveButtonText" });

                this.set("vm_isStateFilled", !this.vm_stateError);
            };






            /* Private methods */

            this._loadCountries = function () {
                var that = this;
                return $customerDataService.getProviderLicensePatientAddressMetaRule().done(function (data) {
                    var d = data.data[0].countries.map(function (country) {
                        var obj = {
                            text: $.trim(country.country),
                            value: $.trim(country.countryCode)
                        };

                        if (country.regions) {
                            obj.regions = country.regions.map(function (region) {
                                return {
                                    text: $.trim(region.region),
                                    value: $.trim(region.regionCode)
                                };
                            }).sort(compareCodesByName);
                        }

                        return obj;
                    }).sort(compareCodesByName);

                    that.set("countryCodes", d);

                    // select current location country
                    var selectedCountryCode = that.currentLocation.countryCode || "US";
                    var defaultCountry = d.find(function (el) {
                        return el.value === selectedCountryCode;
                    });
                    defaultCountry = defaultCountry || d[0];
                    that.set("selectedCountry", defaultCountry);
                });
            };

            this._loadStatesForSelectedCountry = function () {
                this.set("regions", []);
                this.set("selectedRegion", null);
                this.set("vm_stateError", false);
                this.set("vm_isStateFilled", false);

                if (this.selectedCountry && this.selectedCountry.value) {
                    this.set("vm_countryError", false);
                    this.set("vm_isError", false);

                    if (this.selectedCountry.regions) {
                        this.set("regions", this.selectedCountry.regions);
                    }
                } else {
                    this.set("vm_countryError", true);
                    this.set("vm_isError", true);
                }

                this.set("vm_isCountryFilled", !this.vm_countryError);

                this.trigger("change", { field: "vm_isRegionsAutocompleteEnable" });
                this.trigger("change", { field: "vm_saveButtonText" });
            };

            this._validate = function () {
                if (!this.selectedCountry || !this.selectedCountry.value) {
                    this.set("vm_countryError", true);
                    return false;
                }

                if (this.vm_isRegionsAutocompleteEnable()) {
                    if (!this.selectedRegion || !this.selectedRegion.value) {
                        this.set("vm_stateError", true);
                        return false;
                    }
                }

                return true;
            };

            function compareCodesByName(a, b) {
                if (a.text < b.text)
                    return -1;
                if (a.text > b.text)
                    return 1;
                return 0;
            }
        }).singleton();
}(jQuery, snap, window));
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

            this.getUIStylesMapping = function () {
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
                patientProviderLicenseMetaRuleApi = snap.baseUrl + "/api/v2.1/admin/rules/patient-provider-license-meta-rules";

            this.getCountries = function () {
                return $http.get(addressMetaRuleApi, {
                    providerId: snap.hospitalSession.hospitalId
                });
            };

            this.getPostalCodes = function (filter) {
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


            this.saveRuleDescription = function (ruleDescription, ruleTypeUrlPart) {
                var dfd = $.Deferred();

                var error = this._validateRuleDescription(ruleDescription);
                if (error !== null) {
                    dfd.reject(error);
                } else {
                    var that = this;
                    this.getRuleTemplates().done(function (data) {
                        var ruleTemplate = data.data.filter(function (rTemplate) {
                            return rTemplate.statusCode === 1 && rTemplate.ruleTypeId === ruleDescription.ruleTypeId;
                        })[0];

                        ruleDescription.ruleTemplateId = ruleTemplate.id;

                        that._save(ruleDescription, ruleTypeUrlPart).done(function () {
                            dfd.resolve();
                        }).fail(function (error) {
                            dfd.reject(error);
                        });
                    }).fail(function (error) {
                        dfd.reject(error);
                    });
                }

                return dfd;
            };

            this._save = function (rule, ruleTypeUrlPart) {
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

            this.saveAdressRule = function (ruleDescription) {
                return this.saveRuleDescription(ruleDescription, "subject-address-rules");
            };

            this.saveProviderLicensePatientAddressRule = function (ruleDescription) {
                return this.saveRuleDescription(ruleDescription, "patient-provider-license-rules");
            };

            this.changeRuleStatus = function (ruleId, status) {
                var url = [ruleApiUrl, ruleId, "status"].join('/') + "?status=" + status;

                return $.ajax({
                    url: url,
                    type: "PUT",
                    contentType: 'application/json; charset=utf-8',
                });
            };

            this.reorderCategory = function (rulesCaterhories) {
                var url = [ruleApiUrl, "rule-categories/order"].join("/");

                return $.ajax({
                    url: url,
                    type: "PUT",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(rulesCaterhories)
                });
            };

            this._validateRuleDescription = function (ruleDescription) {
                if (isNullOrUndefined(ruleDescription)) {
                    return "Rule is empty.";
                }

                if (isNullOrUndefined(ruleDescription.ruleTypeId)) {
                    return "Subject for this workflow not selected.";
                }

                if (isNullOrUndefined(ruleDescription.conditionTypeId)) {
                    return "Logic for this workflow not selected.";
                }

                if (isNullOrUndefined(ruleDescription.conditionSource)) {
                    return "Conditions for this workflow not selected.";
                }

                return null;

                function isNullOrUndefined(obj) {
                    return typeof (obj) === "undefined" || obj === null;
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


            this.rulesDescriptions = [{
                description: "Allow patients to register if",
                shortDescription: "Address Rule",
                ruleCategoryId: $patientRulesCommon.ruleCategoryCodeEnum.registrationAvailability,
                ruleTypeId: $patientRulesCommon.ruleTypeCodeEnum.AddressRule,
                operators: [{
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
                    vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/patientAddressRule.viewmodel.js?v=1694",
                    vmName: "snap.admin.patientRules.patientAddressRule",
                    contentPath: "/content/admin/patientRules/rules/patientAddress.html?v=1694"
                },
                getRuleSummaryInfo: function (ruleObject) {
                    var locationsText = new LocationsText().getLocationsSummary(ruleObject.subjectAddresses);

                    var operator = ruleObject.conditionTypeId === $patientRulesCommon.ruleLogicTypeCodeEnum.NotIn ? "isn't located" : "is located";

                    return ["Allow patients to register if the patient's address", operator, locationsText].join(" ");
                },
                getRuleSummaryShortInfo: function (ruleObject) {
                    var shortSummary = new LocationsText().getLacationsShortSummary(ruleObject.subjectAddresses);

                    return { description: shortSummary };
                },
                save: function (ruleObject) {
                    return $ruleService.saveAdressRule(ruleObject);
                },
                getRuleObject: function (rule) {
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
                operators: [{
                    conditionTypeId: $patientRulesCommon.ruleLogicTypeCodeEnum.In,
                    tile: {
                        iconClass: "icon_plus",
                        description: "Includes"
                    }
                }],
                tile: {
                    iconClass: "icon_v-card",
                    description: "License",
                    detailedDescription: "provider license",
                    title: "Provider"
                },
                conditionVM: {
                    vmPath: "/Scripts/viewModels/Admin/PatientRules/rules/visibilityRule.viewmodel.js?v=1694",
                    vmName: "snap.admin.patientRules.visibilityRule",
                    contentPath: "/content/admin/patientRules/rules/visibilityRule.html?v=1694"
                },
                getRuleSummaryInfo: function (ruleObject) {
                    var r = ruleObject.conditionSource === $patientRulesCommon.ruleConditionSourceEnum.ProviderLicenseAndPatientAddress ? "Patient Address" : "Patient Response";

                    return ["Allow Patient and Provider to see each other if <br/> Provider License match to", r].join(" ");
                },
                save: function (ruleObject) {
                    return $ruleService.saveProviderLicensePatientAddressRule(ruleObject);
                },
                getRuleObject: function (rule) {
                    return toRuleObject(rule);
                },
                ruleHelpPage: "https://virtualcare.zendesk.com/hc/en-us/articles/115002342408-Webinar-Provider-Visibility-by-License-Phone-Consult-workflow-Service-Types-"
            }
            ];


        }).singleton();

}(jQuery, snap));



//@ sourceURL=appointmentFactory.js

(function ($, snap, kendo, global) {
    "use strict";
    snap.namespace("snap.patient.schedule")
        .use(["snapNotification",
            "snap.common.timeUtils",
            "snap.common.schedule.itemSelector",
            "snap.common.schedule.ScheduleCommon",
            "snap.common.schedule.encounterMethodSelector",
            "snap.helper.encounterMethodHelper",
            "snap.EventAggregator",
            "snap.service.availabilityBlockService",
            "snap.patient.schedule.patientAppointmentService",
            "snap.patient.schedule.familyGroupDataSource",
            "snap.patient.schedule.apptsSlotsTray",
            "snap.service.selfSchedulingService",
            "snap.patient.schedule.patientSelfSchedulingHub",
            "snap.service.userService",
            "snap.patient.schedule.providersSlotsLocator",
            "snap.common.timer",
            "snap.DataService.customerDataService",
            //  "snap.errorHandler",
            "snap.common.navigationHelper"
        ])
        .define("AppointmentFactory", function ($snapNotification, $timeUtils,
            $itemSelector, $scheduleCommon, $encounterMethodSelector, $encounterMethodHelper, $eventAggregator,
            $availabilityBlockService, $appointmentService,
            $familyGroupDataSource, $apptsSlotsTray, $selfSchedulingService,
            $patientSelfSchedulingHub, $userService, $providersSlotsLocator, $timer, $customerDataService,
            //$errorHandler,
            $navigationHelper) {

            this.closeEvent = "pappt_OnCloseClick";
            this.savedEvent = "pappt_OnSaved";
            this.removedEvent = "pappt_OnRemoved";

            this.dialogContainer = null;
            var fact = this;

            var encounterTypeCodes = snap.enums.EncounterTypeCode;

            var phoneTypeEnum = snap.resolveObject("snap.enums.PhoneTypes");

            function Appointment(data) {
                var opt = data.appt;
                var scope = this;

                $providersSlotsLocator.setListeningDate(new Date(opt.start));
                var slotsLocator = $providersSlotsLocator.createSlotsLocator();

                var otherPrimaryConcernId = $scheduleCommon.concernCodes.otherPrimary;
                var otherSecondaryConcernId = $scheduleCommon.concernCodes.otherSecondary;
                var availableTimeTimer = null;

                var defaultPatient = {
                    id: null,
                    name: "Select a Patient",
                    imageSource: "images/Patient-Male.gif",
                    info: "For this appointment"
                };

                this.preventDefault = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                };

                this._typeName = "Appointment";
                this._removeCurrentEventMessage = "Are you sure that you want to cancel this appointment?";
                this._removedSuccesfullyMessage = "The Appointment was removed successfully";

                this.clinician = null;
                this.clinicianImageSource = "images/Patient-Male.gif";
                this.clinicianFullName = "Select a Provider";

                this.availableTime = "00:00";

                this._secondaryConcernsAvailable = false;

                this.clinicianCard = data.clinicianCard;
                this.isClinicianDisabled = data.isClinicianDisabled;
                this.isDisabled = !!data.isClinicianDisabled;

                this._providerDisabledReason = data.disableReason || "Provider is unavailable";


                this.appointmentId = opt.appointmentId || 0;
                this.consultationId = opt.consultationId || null; // Optional field. Consultation may not exist yet.
                this.start = opt.start;
                this.end = opt.end;
                this.startDate = opt.start;
                this.oldStartDate = opt.start;
                this.availabilityBlockId = opt.availabilityBlockId;
                this.isNow = opt.isNow;
                this.waiveFee = opt.waiveFee;
                this.paymentRequisites = opt.paymentRequisites;

                this.isLoading = false;
                this.isError = false;
                this.showFrequencyDetails = false;

                this.isDateAreaInEditMode = false;
                this.vm_primaryConsernId = null;
                this.vm_secondaryConsernId = null;
                this.primaryConcernOtherText = "";
                this.secondaryConcernOtherText = "";
                //this.isReadOnly = data.isReadOnly || false;
                this.isFuture = data.isFuture;

                this.appointmentStatusCode = opt.appointmentStatusCode;

                this.vm_isLoading = false;

                this.phoneNumber = "";
                this.phoneType = phoneTypeEnum.other;

                this.timeZoneId = snap.profileSession.timeZoneId;
                this.serviceTypeId = opt.serviceTypeId;

                this.phoneTypeDs = new kendo.data.DataSource({
                    data: [{
                        text: "Home",
                        value: phoneTypeEnum.home
                    }, {
                        text: "Mobile",
                        value: phoneTypeEnum.mobile
                    }, {
                        text: "Other",
                        value: phoneTypeEnum.other
                    }]
                });
                var isUnEditable = data.isReadOnly || false;
                if (this.appointmentStatusCode) {
                    isUnEditable = isUnEditable || $scheduleCommon.isAppointmentReadOnly(this.appointmentStatusCode);
                }
                this.isRemovable = !isUnEditable;
                this.isReadOnly = isUnEditable;
                this.appointmentTypeCode = $scheduleCommon.appointmentTypeCode.patientScheduled;

                this._initSelectors = function () {
                    var clinician = $scheduleCommon.findProvider(opt.participants);
                    var clinicianID = clinician ? clinician.person.id : null;

                    var clinicianPersonId = opt.clinicianPersonId ? opt.clinicianPersonId : clinicianID;

                    this.patientsSelector = this._isPatientSelectorLocked() ?
                        $itemSelector.emptySelector({
                            defaultItem: defaultPatient,
                            htmlContainerId: "#itemSelector_patientsList",
                            scrollableElementClass: ".itemSelector_scrollable"
                        }) :
                        $itemSelector.familyGroupSelector({
                            defaultItem: defaultPatient,
                            counterpartFilter: clinicianPersonId,
                            htmlContainerId: "#itemSelector_patientsList",
                            scrollableElementClass: ".itemSelector_scrollable"
                        });

                    this.encounterMethodSelector = $encounterMethodSelector.createSelector({
                        appointmentTypeCode: this.appointmentTypeCode
                    });
                    this.encounterMethodSelector.bind($encounterMethodSelector.events.onMethodSelected, function (encounterTypeCode) {
                        scope.encounterTypeCode = encounterTypeCode;
                        scope.trigger("change", { field: "isPhone" });
                        scope._onDataChange();
                    });
                };

                this.getAppointmentDetails = function () {
                    var patient = this.patientsSelector.getSelectedItem();
                    var appointmentDetails = {
                        clinicianId: this.clinicianCard ? this.clinicianCard.userId : null,
                        providerSpeciality: this.clinician ? this.clinician.person.speciality : null,
                        patientId: patient ? patient.id : null,
                        serviceTypeFee: this.serviceTypeFee
                    };
                    return {
                        baseOptions: this.getOptions(),
                        appointmentDetails: appointmentDetails
                    }

                };

                this.getOptions = function () {
                    var concerns = [];

                    if (this.primaryConcern) {
                        concerns.push(this.primaryConcern);
                    }

                    if (this.secondaryConcern) {
                        concerns.push(this.secondaryConcern);
                    }

                    var participants = [];

                    if (this.clinician) {
                        participants.push({
                            appointmentId: this.appointmentId,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: this.clinician.person.id,
                            person: this.clinician.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
                        });
                    }

                    var patient = this.patientsSelector.getSelectedItem();
                    if (patient) {
                        participants.push({
                            appointmentId: this.appointmentId,
                            attendenceCode: $scheduleCommon.attendenceCode.required,
                            personId: patient.data.person.id,
                            person: patient.data.person,
                            participantTypeCode: $scheduleCommon.participantTypeCode.patient,
                            patientId: patient.id
                        });
                    }

                    return {
                        id: this.appointmentId,
                        start: this.start,
                        end: this.end,
                        availabilityBlockId: this.availabilityBlockId,
                        isNow: this.isNow,
                        appointmentTypeCode: this.appointmentTypeCode,
                        intakeMetadata: {
                            additionalNotes: this.additionalNotes,
                            concerns: concerns
                        },
                        participants: participants,
                        waiveFee: this.waiveFee,
                        paymentRequisites: this.paymentRequisites,
                        encounterTypeCode: this.encounterTypeCode,
                        phoneNumber: this.phoneNumber,
                        phoneType: this.phoneType,
                        serviceTypeId: this.serviceTypeId
                    };
                };

                /*********************** PUBLIC API ***********************/
                this.setInitialFocus = function () {
                    $(".directory__opener").first().focus();
                };
                this._finishLoading = function () {
                    scope = this;// 1 second timeout to prevent css issues
                    // so that all styles will apply and conrtols will render
                    window.setTimeout(function () {
                        scope.set("vm_isLoading", false);
                        scope.setInitialFocus();

                        scope.trigger("change", { field: "vm_primaryConsernId" });
                        scope.trigger("change", { field: "vm_secondaryConsernId" });
                    }, 1000);
                };
                this._checkCurrentTime = function () {
                    var dfd = $.Deferred();
                    if (!this.isReadOnly && !this.vm_isNew()) {
                        $userService.getUserCurrentTime().done(function (resp) {
                            var userTime = $timeUtils.dateFromSnapDateString(resp.data[0]);
                            scope.set("isReadOnly", scope.start < userTime);
                            scope.patientsSelector.set("isSelectorLocked", scope.patientsSelector.isSelectorLocked || scope.isReadOnly);
                            scope.trigger("change", { field: "vm_dialogTitle" });

                            scope.encounterMethodSelector.setReadonly(scope.isReadOnly);

                            var userDNATime = userTime.setMinutes(userTime.getMinutes() - 30);
                            scope.set("isFuture", userDNATime <= scope.end);
                            dfd.resolve();
                        });
                    } else {
                        dfd.resolve();
                    }
                    return dfd.promise();
                }
                this.load = function (loadOptions) {
                    scope = this;

                    var lockSlotOnOpen = !(loadOptions && loadOptions.doNotLockSlotOnOpen);

                    if (this.vm_isNew() && lockSlotOnOpen) {
                        this.lockSlot();
                    }

                    this._checkCurrentTime().always(function () {
                        // autosize textarea after changing readonly property
                        global.autosize($('.js-autoresize-textarea'));
                    });

                    this.set("vm_isLoading", true);
                    this._isPatientLoaded = false;
                    this._areConcernsLoaded = false;

                    this.patientsSelector.loadSelector();
                    this.patientsSelector.set("isSelectorLocked", this._isPatientSelectorLocked());
                    if (this.isClinicianDisabled) {
                        var targetEl = $("#providerContainer");
                        if (targetEl.length) {
                            targetEl.kendoTooltip({
                                position: "top",
                                content: scope._providerDisabledReason
                            });
                        }
                    }
                    if (sessionStorage.getItem('chkSSAddOrEdit') === 'Edit') {
                        this.patientsSelector.set("isSelectorLocked", 'true');
                    }
                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this._updateProviderEventTime();

                    this.encounterMethodSelector.setReadonly(this.isReadOnly);

                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this.trigger("change", {
                        field: "vm_dialogTitle"
                    });

                    $eventAggregator.unSubscribe("slotTray_slotClickCallback");
                    $eventAggregator.subscriber("slotTray_slotClickCallback", function () {
                        scope._onDataChange();
                        scope.patientsSelector.updateEventTime(scope.start, scope.end, scope.timeZoneId);
                        scope._updateProviderEventTime();
                    });

                    $eventAggregator.unSubscribe("itemSelector_onProfileClick");
                    $eventAggregator.subscriber("itemSelector_onProfileClick", function (data) {
                        $navigationHelper.patient.goToPatietProfile({ patientId: data.id });
                    });
                    $eventAggregator.unSubscribe("slotTray_goToDate");
                    $eventAggregator.subscriber("slotTray_goToDate", function (obj) {
                        var dateFilter = new Date(obj.nextDate);
                        dateFilter.setHours(0, 0, 0, 0);

                        scope.setSlotsDate(dateFilter);
                    });

                    $eventAggregator.unSubscribe("apptvm_TimeSlotSelected");
                    $eventAggregator.subscriber("apptvm_TimeSlotSelected", function (timeSlot) {
                        scope.set("start", timeSlot.start);
                        scope.set("end", timeSlot.end);
                        scope.set("availabilityBlockId", timeSlot.availabilityBlockId);
                        scope.set("isNow", timeSlot.isNow);
                        scope.toggleDateArea();
                    });

                    scope.patientsSelector.bind($itemSelector.events.onSelectorHide, scope.setInitialFocus);

                    if (!this.vm_isNew()) {
                        this.patientsSelector.selectWithConfirmation = true;
                        this.patientsSelector.bind($itemSelector.events.onItemClicked, function (item) {
                            $snapNotification.confirmationWithCallbacks("Are you sure you want to change the patient for this appointment? (This will send a cancellation notice to the previous patient.)", function () {
                                scope.patientsSelector.selectHandler(item);
                            });
                        });
                    }
                    if (this.vm_isNew()) {
                        this._loadServiceTypeInfo();
                    }

                    var codeSetsDs = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);

                    var patient = scope.patientsSelector.getSelectedItem();
                    if (patient) {
                        if (this.isReadOnly) {
                            this._isPatientLoaded = true;
                            this.set("vm_canShowTimeOffsets", true);
                        } else {
                            // check and refresh the patient
                            if (scope.patientsSelector.vm_isItemsLoading) {
                                scope.patientsSelector.one($itemSelector.events.onDataLoaded, function () {
                                    scope._checkPatient(patient, data);
                                });
                            } else {
                                scope._checkPatient(patient, data);
                            }

                            this.patientsSelector.bind($itemSelector.events.onItemSelected, function () {
                                scope._onDataChange();
                                scope.set("phoneNumber", "");
                                scope.vm_onPhoneTypeChange();

                                scope.patientsSelector.showTimeOffset(scope.vm_isTimeOffsetsVisible);
                                if (scope.isDisabled && !scope.isClinicianDisabled) {
                                    // if clinician is enabled, and patient disabled, we will enable dialog after selected patient change
                                    scope.set("isDisabled", false);
                                    scope.trigger("change", { field: "vm_isNotDisabled" });
                                }
                            });
                        }
                    }

                    codeSetsDs.getItemIdByName("primary", snap.hospitalSession.hospitalId, "other (provide details below)").done(function (codeId) {
                        if (codeId !== null) {
                            otherPrimaryConcernId = codeId;
                            scope.set("dataPrimaryConcernList", codeSetsDs.getCodeSetDataSourceReplacingNames(
                                "primary",
                                snap.hospitalSession.hospitalId, [
                                    "Other (provide details below)"
                                ], [{
                                    "codeId": otherPrimaryConcernId,
                                    "text": "Other (provide details below)"
                                }]
                            ));
                        } else {
                            scope.set("dataPrimaryConcernList", codeSetsDs.getCodeSetDataSource("primary", snap.hospitalSession.hospitalId));
                        }

                        if (scope.vm_primaryConsernId) {
                            scope.dataPrimaryConcernList.one("change", function () {
                                var primaryConcernFound = !!scope._formatConcernData(scope.dataPrimaryConcernList, scope.vm_primaryConsernId, true);
                                scope.set("vm_primaryConcernError", !primaryConcernFound);
                                scope.set("vm_primaryConcernActive", primaryConcernFound);
                            });
                        }
                        scope.trigger("change", { field: "vm_primaryConsernId" });
                        scope.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });

                        codeSetsDs.getItemIdByName("secondary", snap.hospitalSession.hospitalId, "other (provide details below)").done(function (codeId) {
                            if (codeId !== null) {
                                otherSecondaryConcernId = codeId;
                                scope.set("dataSecondaryConcernList", codeSetsDs.getCodeSetDataSourceReplacingNames(
                                    "secondary",
                                    snap.hospitalSession.hospitalId, [
                                        "Other (provide details below)"
                                    ], [{
                                        "codeId": otherSecondaryConcernId,
                                        "text": "Other (provide details below)"
                                    }]
                                ));
                            } else {
                                scope.set("dataSecondaryConcernList", codeSetsDs.getCodeSetDataSource("secondary", snap.hospitalSession.hospitalId));
                            }

                            scope.dataSecondaryConcernList.read().then(function () {
                                scope._secondaryConcernsAvailable = scope.dataSecondaryConcernList.data().length > 0;
                                scope.trigger("change", { field: "vm_isAddConcernButtonVisible" });
                                if (scope.vm_secondaryConsernId) {
                                    var secondaryConcernFound = !!scope._formatConcernData(scope.dataSecondaryConcernList, scope.vm_secondaryConsernId, false);
                                    scope.set("vm_secondaryConcernError", !secondaryConcernFound);
                                    scope.set("vm_secondaryConcernActive", secondaryConcernFound);
                                }
                            });
                            scope.trigger("change", { field: "vm_secondaryConsernId" });
                            scope.trigger("change", { field: "vm_isSecondaryConcernOtherSelected" });

                            scope._areConcernsLoaded = true;
                            if (scope._isPatientLoaded) {
                                scope._finishLoading();
                            }
                        });
                    });
                    var useExpirationTimer = loadOptions ? loadOptions.useExpirationTimer : true;

                    if (useExpirationTimer && !this.appointmentId) {
                        this._initDeactivationTimeout();
                    }
                };

                this._loadServiceTypeInfo = function () {
                    var dfd = $.Deferred();
                    $selfSchedulingService.getServiceTypes(this.appointmentTypeCode).then(function (data) {
                        scope.serviceTypeId = data[0].serviceTypeId;
                        scope.serviceTypeFee = data[0].baseFee;
                        dfd.resolve();
                    }, function () {
                        $snapNotification.error("Failed to load service type details");
                        dfd.reject();
                    });
                    return dfd.promise();
                };

                this._checkPatient = function (patient, data) {
                    if (scope.vm_isNew()) {
                        var patientItem = scope.patientsSelector.getItemById(patient.id) || scope.patientsSelector.getFirstItem();
                        if (patientItem) {
                            scope.patientsSelector.selectHandler(patientItem);
                        }
                        data.patientProfileId = scope.patientsSelector.getSelectedItem().id;
                    }
                    getPatientItem(data.patientProfileId).then(function (item) {
                        if (item) {
                            scope.patientsSelector.selectInitialItem(item);
                        } else {
                            scope.set("isDisabled", true);
                            scope.trigger("change", { field: "vm_isNotDisabled" });
                            scope.patientsSelector.disableSelectedItem($errorHandler.getProfileDisabledReason());
                        }
                    }, function (error) {
                        scope.set("isDisabled", true);
                        scope.trigger("change", { field: "vm_isNotDisabled" });
                        scope.patientsSelector.disableSelectedItem($errorHandler.getProfileDisabledReason(error));
                    }).always(function () {
                        scope._isPatientLoaded = true;
                        if (scope._areConcernsLoaded) {
                            scope._finishLoading();
                        }
                        scope.set("vm_canShowTimeOffsets", scope.patientsSelector.getSelectedItem() !== null);
                    });
                };

                this.save = function () {
                    this.set("isLoading", true);
                    this.set("isError", false);

                    var that = this;
                    var promise = $appointmentService.saveAppointment(this.getOptions());
                    promise.done(function () {
                        if (!that.vm_isNew()) {
                            sessionStorage.setItem('ssAppointUpdate', 'yes');
                            $snapNotification.success(that._typeName + " updated successfully");
                            var aa1 = (new Date).getTime();

                            $.connection.hub.qs = {};
                            var hubs = [];
                            $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                            location.href = "#/tab/appoimentDetails/webSSAppointUpdate" + aa1;
                            /*
                          setTimeout(function() {
                            $.connection.hub.qs = {};
                            var hubs = [];
                            $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                            location.href = "#/tab/appoimentDetails/webSSAppointUpdate"+ aa1;
                          }, 3000);*/
                        }
                        that.set("isError", false);
                    }).fail(function () {
                        that.set("isError", true);
                    }).always(function () {
                        that.set("isLoading", false);
                    });

                    return promise;
                };

                this.remove = function () {
                    var dfd = $.Deferred();
                    var that = this;
                    this._checkPaymentStatus().done(function (result) {
                        if (result) {
                            $appointmentService.removeAppointment(that.appointmentId).done(function () {
                                dfd.resolve();
                            }).fail(function (error) {
                                dfd.reject(error);
                            });
                        } else {
                            dfd.reject("Consultation is already paid by other user.");
                        }
                    });

                    return dfd;
                };

                this.lockSlot = function () {
                    $patientSelfSchedulingHub.lockSlot(this.availabilityBlockId, this.start, this.end);
                };

                this.unlockSlot = function () {
                    this._clearDeactivationTimeout();

                    $patientSelfSchedulingHub.unlockSlot(this.availabilityBlockId, this.start, this.end);
                };

                this._checkPaymentStatus = function () {
                    var dfd = $.Deferred();
                    if (this.consultationId) {
                        $customerDataService.checkPaymentStatus(this.consultationId).done(function (responsePayment) {
                            if (responsePayment.paidByUserId === snap.profileSession.userId) {
                                dfd.resolve(true);
                            }
                            else {
                                dfd.resolve(false);
                            }
                        }).fail(function () {
                            dfd.resolve(true);
                        });
                    } else {
                        dfd.resolve(true);
                    }

                    return dfd;
                };

                this.validate = function () {
                    var errorList = [];
                    if (this.start === null) {
                        errorList.push("Start date is required");
                    }
                    if (this.patientsSelector.getSelectedItem() === null) {
                        errorList.push("Select a Patient.");
                        this.set("vm_isPatientSelectError", true);
                        this.set("vm_canShowTimeOffsets", false);
                    }

                    if ((this.vm_primaryConsernId !== null) && (this.displaySecondaryConcern && this.vm_secondaryConsernId !== null) && this.vm_secondaryConsernId !== otherSecondaryConcernId && this.primaryConcern.customCode.description === this.secondaryConcern.customCode.description) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if ((this.vm_secondaryConsernId === otherSecondaryConcernId && this.vm_primaryConsernId === otherPrimaryConcernId) && ($.trim(this.primaryConcernOtherText) === $.trim(this.secondaryConcernOtherText))) {
                        errorList.push("Primary and Secondary Concerns must be different.");
                        this._concernsSimilarError = true;
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this.set("vm_secondaryConcernActive", false);
                    }

                    if (this.vm_primaryConsernId === null) {
                        errorList.push("Select or enter a Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_primaryConsernId === otherPrimaryConcernId && $.trim(this.primaryConcernOtherText) === "") {
                        errorList.push("Enter Primary Concern.");
                        this.set("vm_primaryConcernError", true);
                        this.set("vm_primaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.displaySecondaryConcern && this.vm_secondaryConsernId === null) {
                        errorList.push("Select Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.vm_secondaryConsernId === otherSecondaryConcernId && $.trim(this.secondaryConcernOtherText) === "") {
                        errorList.push("Enter Secondary Concern.");
                        this.set("vm_secondaryConcernError", true);
                        this.set("vm_secondaryConcernActive", false);
                        this._concernsSimilarError = false;
                    }

                    if (this.encounterTypeCode === encounterTypeCodes.Phone && $.trim(this.phoneNumber) === "") {
                        errorList.push("Enter a Phone number.");
                        this.set("vm_phoneNumberError", true);
                        this.set("vm_isPhoneNumberFilled", false);
                    }

                    return errorList;
                };

                this.toggleDateArea = function () {
                    this.set("startDate", this.start);
                    this.set("isDateAreaInEditMode", !this.get("isDateAreaInEditMode"));
                };
                /*********************** MVVM BINDINGS ***********************/
                //    this.availableTime = "00:00";

                this._startTimer = function () {
                    console.log("enter");
                    var that = this;
                    availableTimeTimer = $timer.createTimer({
                        countDown: true,
                        time: 300,
                        onTimerTickCallback: function (timerTick) {
                            that.set("availableTime", [timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                        }
                    });

                    availableTimeTimer.start();
                };

                this.vm_currentDate = function () {
                    var dateFilter = new Date();
                    dateFilter.setHours(0, 0, 0, 0);

                    $("#datepicker1").kendoDatePicker({
                        min: dateFilter
                    });

                    return dateFilter;
                };

                this.vm_isNotError = function () {
                    return !this.isError;
                };
                this.vm_isNew = function () {
                    return this.appointmentId === 0;
                };
                this.vm_hideTimer = false;
                this.vm_dialogTitle = function () {
                    var appoinmentStatus = this.isReadOnly ? "Appointment" : "Edit Appointment";
                    return this.vm_isNew() ? "New Appointment" : appoinmentStatus;
                };

                this.vm_isNotDisabled = function () {
                    return !this.isDisabled;
                };
                this.vm_saveBtnTxt = function () {
                    return this.vm_isNew() ? "Create" : "Save";
                };
                this.isRepeaterVisible = function () {
                    return this.vm_isNew() ? true : this.isReadOnly ? true : false;
                };

                $("#localize-widget").hide();
                this.vm_onSubmitClick = function () {
                    //debugger;
                    var that = this;
                    //if(that.additionalNotes == ""){
                    var addnotes = $(".consultation-note__textarea").val();
                    that.additionalNotes = addnotes;
                    //}

                    //$patientSelfSchedulingHub.bookSlot(this.availabilityBlockId,  $timeUtils.dateToString(this.start), $timeUtils.dateToString(this.end));
                    if (!this.isLoading) {
                        this.set("isError", false);
                        this.set("isLoading", true);
                        var errors = this.validate();
                        if (errors.length === 0) {
                            saveAction();

                        } else {
                            this.set("isLoading", false);
                            this.set("isError", true);

                            $snapNotification.error(errors.join("<br\>"));
                        }
                    }

                    function saveAction() {
                        that.save().done(function () {
                            $eventAggregator.published(fact.savedEvent, that.getOptions());
                            that._clearDeactivationTimeout();
                            $patientSelfSchedulingHub.bookSlot(that.availabilityBlockId, that.start, that.end);
                        }).fail(function (error) {
                            if (error) {
                                $snapNotification.error(error);
                                that.set("isError", true);
                            }
                        }).always(function () {
                            that.set("isloading", false);
                        });
                    }
                };

                this.vm_onCloseClick = function (e) {
                    //$("#localize-widget").show();
                    if (sessionStorage.getItem('chkSSAddOrEdit') === 'Edit') {
                        $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                    }
                    //  this._clearDeactivationTimeout();
                    $eventAggregator.published(fact.closeEvent, this);

                    //  $snapNotification.hideAllConfirmations();

                    //  $patientSelfSchedulingHub.unlockSlot(this.availabilityBlockId, this.start, this.end);

                    this.preventDefault(e);
                };

                this.vm_onRemoveClick = function () {
                    //                  $("#localize-widget").show();
                    this._clearDeactivationTimeout();
                    var that = this;
                    $snapNotification.hideAllConfirmations();
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to remove this appointment?", function () {
                        that.set("isLoading", true);
                        that.set("vm_appointmentChanged", true);
                        that.trigger("change", { field: "vm_isNotError" });

                        that.remove().done(function () {
                            $eventAggregator.published(fact.removedEvent, that);
                            if (snap.lanName === 'English') {
                                $snapNotification.success("Appointment is unassigned successfully");
                            } else {
                                $snapNotification.success("La cita no se ha asignado correctamente");
                            }
                            // $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                            setTimeout(function () {
                                $.connection.hub.qs = {};
                                var hubs = [];
                                location.href = "#/tab/appointmentpatientdetails/webSSCancel";
                            }, 2000);
                        }).fail(function (error) {
                            $snapNotification.error(error);
                            that.set("isError", true);
                        }).always(function () {
                            that.set("isLoading", false);
                        });
                    });
                };

                this.vm_isAddConcernButtonVisible = function () {
                    return !this.isReadOnly && !this.displaySecondaryConcern && this.vm_primaryConsernId !== null;
                };
                this.vm_isCancelButtonVisible = function () {
                    return !this.vm_isNew() && this.isFuture;
                };

                this.vm_isSaveBtnVisible = function () {
                    return this._dialogChanged || this.vm_isNew();
                };

                this.vm_isCancelBtnVisible = function () {
                    return !this.vm_isSaveBtnVisible() && this.isRemovable;
                };

                this.vm_canShowTimeOffsets = false;
                this.vm_isTimeOffsetsVisible = false;
                this.vm_ProviderTimeText = "";
                this.vm_showTimeOffsets = function () {
                    var flag = !this.vm_isTimeOffsetsVisible;
                    this.set("vm_isTimeOffsetsVisible", flag);
                    this.patientsSelector.showTimeOffset(flag);
                };

                this._setSelectorTime = function () {
                    this.patientsSelector.setEventTime(this.start, this.end, this.timeZoneId);
                };

                this._updateProviderEventTime = function () {
                    var that = this;
                    var duration = this.end - this.start;
                    var opt = {
                        dateTime: $timeUtils.dateToString(this.start),
                        sourceTimeZoneId: this.timeZoneId,
                        targetUserId: this.clinicianCard.userId
                    };
                    $availabilityBlockService.convertTime(opt).done(function (convertedTime) {
                        if (convertedTime) {
                            var convertedStartTime = $timeUtils.dateFromSnapDateString(convertedTime.convertedDateTime);
                            var timeZoneName = convertedTime.targetTimeZone.abbreviation;
                            var convertedEndTime = new Date(convertedStartTime);
                            convertedEndTime.setTime(convertedEndTime.getTime() + duration);
                            that.set("vm_ProviderTimeText", kendo.toString(convertedStartTime, "h:mm tt ") + timeZoneName + " - " +
                                kendo.toString(convertedEndTime, "h:mm tt ") + timeZoneName);
                        }
                    });
                };


                this._dialogChanged = false;
                this._onDataChange = function () {
                    if (!this._dialogChanged) {
                        this._dialogChanged = true;
                        this.trigger("change", { field: "vm_isSaveBtnVisible" });
                        this.trigger("change", { field: "vm_isCancelBtnVisible" });
                    }
                    if (this.isError) {
                        this.set("isError", false);
                    }
                };

                this.isVideo = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Video;
                };
                this.isPhone = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Phone;
                };
                this.isText = function () {
                    return this.encounterTypeCode == encounterTypeCodes.Text;
                };
                this.isInPerson = function () {
                    return this.encounterTypeCode == encounterTypeCodes.InPerson;
                };
                this.refreshEncounterType = function () {
                    this.trigger("change", { field: "isVideo" });
                    this.trigger("change", { field: "isPhone" });
                    this.trigger("change", { field: "isText" });
                    this.trigger("change", { field: "isInPerson" });
                };
                var setEncounterType = function (encounterTypeCode) {
                    scope.set("encounterTypeCode", encounterTypeCode);
                    scope.refreshEncounterType();
                    scope._onDataChange();
                };
                this.setVideoType = function () {
                    setEncounterType(encounterTypeCodes.Video);
                };
                this.setPhoneType = function () {
                    setEncounterType(encounterTypeCodes.Phone);
                };
                this.isPhoneConsultationDisabled = function () {
                    return snap && snap.hospitalSettings.disablePhoneConsultation;
                }
                this.setTextType = function () {
                    setEncounterType(encounterTypeCodes.Text);
                };
                this.setInPersonType = function () {
                    setEncounterType(encounterTypeCodes.InPerson);
                };

                this.vm_isPhoneNumberFilled = false;

                this.vm_onPhoneNumberChange = function () {

                    // validmask: function (input) {
                    //               console.log(input);
                    //               if (input.is("[data-validmask-msg]") && input.val() != "") {
                    //                   var maskedtextbox = input.data("kendoMaskedTextBox");
                    //                   return maskedtextbox.value().indexOf(maskedtextbox.options.promptChar) === -1;
                    //               }
                    //
                    //               return true;
                    //           }
                    this.set("vm_phoneNumberError", false);
                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    if (this.phoneType !== phoneTypeEnum.other) {
                        this.set("phoneType", phoneTypeEnum.other);
                    }
                    this._onDataChange();
                };

                //Sakthi
                this.vm_onKeyUpAdditionalNotes = function () {
                                 this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                                        if (this.phoneType !== phoneTypeEnum.other) {
                                            this.set("phoneType", phoneTypeEnum.other);
                                        }
                                        this._onDataChange();
                                    };
               

                this.vm_phoneClick = function () {
                    window.scrollTo(0, 150);
                    debugger;
                    //  alert('gggg123');
                    /*  var $htmlOrBody = $('html, body'), // scrollTop works on <body> for some browsers, <html> for others
                      scrollTopPadding = 8;
                      var textareaTop = $(this).offset().top;
                      // scroll to the textarea
                      $htmlOrBody.scrollTop(textareaTop - scrollTopPadding);*/
                };

                this.vm_onPhoneTypeChange = function () {
                    // get phone type
                    // get phone from person from selector
                    // update phone field
                    // TODO: remove filter Function to utilities or replace with ES6 or underscore / lodash libraries
                    try {
                        var _phoneType = this.phoneType;

                        var filterFunc = function (array, callback) {
                            var result = [];
                            for (var i = 0; i < array.length; i++) {
                                if (callback(array[i])) {
                                    result.push(array[i]);
                                }
                            }
                            return result;
                        };

                        var callback = function (a) {
                            return phoneTypeEnum[a] == _phoneType;
                        };

                        var typeName = filterFunc(Object.keys(phoneTypeEnum), callback)[0];

                        //there is a selected patient
                        if (this.patientsSelector.getSelectedItem()) {
                            var phones = this.patientsSelector.getSelectedItem().data.person.phones;
                            var callback2 = function (b) {
                                return b.use == typeName;
                            };
                            var numberVal = filterFunc(phones, callback2);

                            if (numberVal.length > 0) {
                                this.set("phoneNumber", numberVal[0].value);
                            } else {
                                this.set("phoneNumber", "");
                            }
                        }
                    } catch (exp) {
                        window.console.error(exp);
                    }

                    this._onDataChange();
                };
                this.vm_isNew = function () {
                    return this.appointmentId === 0;
                };

                this._isPatientSelectorLocked = function () {
                    return this.isReadOnly || !this.vm_isNew();
                };

                this.vm_expandAddNotes = function () {
                    debugger;
                    this.set("vm_isAddNotesExpanded", !this.vm_isAddNotesExpanded);
                    // $('.dialogbox-master__wrapper').animate({scrollTop : 1000},900);
                    window.setTimeout(function () {
                        $('.dialogbox-master__wrapper').animate({ scrollTop: 1000 }, 1900);
                    }, 1000);
                };
                this.vm_enterNotes = function () {
                    debugger;
                    window.setTimeout(function () {
                        $('.dialogbox-master__wrapper').animate({ scrollTop: 500 }, 400);
                    }, 1000);
                };
                this.vm_enterNumber = function () {
                    var AndroidDevice = localStorage.getItem('AndroidDevice');
                    window.setTimeout(function () {
                        if (AndroidDevice == "false") {
                            $('.dialogbox-master__wrapper').animate({ scrollTop: 1000 }, 900);
                        }
                        else {
                            $('.dialogbox-master__wrapper').animate({ scrollTop: 100 }, 90);
                        }
                    }, 1000);
                };

                //sakthi

                this.vm_onAddConcernClick = function (e) {
                    this.preventDefault(e);
                    this.set("displaySecondaryConcern", true);
                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this._onDataChange();
                };

                this.vm_onRemoveSecondaryConcernClick = function () {
                    this.set("vm_secondaryConcernError", false);
                    this.set("vm_secondaryConcernActive", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("displaySecondaryConcern", false);
                    this.set("vm_secondaryConsernId", null);
                    this.secondaryConcern = null;
                    this.set("secondaryConcernOtherText", "");
                    this.trigger("change", {
                        field: "vm_isSecondaryConcernOtherSelected"
                    });
                    this.trigger("change", {
                        field: "vm_isAddConcernButtonVisible"
                    });
                    this._onDataChange();
                };

                this.vm_primaryConcernActive = false;

                this.vm_isPrimaryConcernOtherSelected = function () {
                    return this.vm_primaryConsernId === otherPrimaryConcernId;
                };

                this.vm_isSecondaryConcernOtherSelected = function () {
                    return this.vm_secondaryConsernId === otherSecondaryConcernId;
                };
                //venkat
                this.onOpen = function () {
                    $('ul li.k-item').addClass('localizejs');
                }

                this.vm_onPrimaryConcernChange = function () {
                    this.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });

                    this.set("vm_primaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_secondaryConcernError", false);
                        this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);

                    var concern = this._formatConcernData(this.dataPrimaryConcernList, this.vm_primaryConsernId, true);
                    var changedSelectedConcern = this.primaryConcern ? this.vm_primaryConsernId !== this.primaryConcern.customCode.code : true;
                    if (changedSelectedConcern && this.primaryConcernOtherText !== "") {
                        this.set("primaryConcernOtherText", "");
                    }

                    if (this.vm_isPrimaryConcernOtherSelected()) {
                        concern.customCode.description = this.get("primaryConcernOtherText");
                    }

                    this.primaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_onPrimaryConcernChange = function () {
                    this.trigger("change", { field: "vm_isPrimaryConcernOtherSelected" });
                    this.trigger("change", { field: "vm_isAddConcernButtonVisible" });

                    this.set("vm_primaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_secondaryConcernError", false);
                        this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);

                    var concern = this._formatConcernData(this.dataPrimaryConcernList, this.vm_primaryConsernId, true);
                    var changedSelectedConcern = this.primaryConcern ? this.vm_primaryConsernId !== this.primaryConcern.customCode.code : true;
                    if (changedSelectedConcern && this.primaryConcernOtherText !== "") {
                        this.set("primaryConcernOtherText", "");
                    }

                    if (this.vm_isPrimaryConcernOtherSelected()) {
                        concern.customCode.description = this.get("primaryConcernOtherText");
                    }

                    this.primaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_primaryConcernError = false;

                this.vm_secondaryConcernActive = false;

                this.vm_onSecondaryConcernChange = function () {
                    this.trigger("change", {
                        field: "vm_isSecondaryConcernOtherSelected"
                    });

                    var concern = this._formatConcernData(this.dataSecondaryConcernList, this.vm_secondaryConsernId, false);

                    this.set("vm_secondaryConcernError", false);
                    if (this._concernsSimilarError) {
                        this.set("vm_primaryConcernError", false);
                        this.set("vm_primaryConcernActive", this.vm_primaryConsernId !== null);
                        this._concernsSimilarError = false;
                    }
                    this.set("vm_secondaryConcernActive", this.vm_secondaryConsernId !== null);

                    var changedSelectedConcern = this.secondaryConcern ? this.vm_secondaryConsernId !== this.secondaryConcern.customCode.code : true;
                    if (changedSelectedConcern && this.secondaryConcernOtherText !== "") {
                        this.set("secondaryConcernOtherText", "");
                    }

                    if (this.vm_isSecondaryConcernOtherSelected()) {
                        concern.customCode.description = this.get("secondaryConcernOtherText");
                    }

                    this.secondaryConcern = concern;

                    this._onDataChange();
                };

                this.vm_getStartTime = function () {
                    return [kendo.toString(this.get("start"), "h:mm"), " <span>", kendo.toString(this.get("start"), "tt"), "</span>"].join("");
                };
                //venkat start
                this.vm_getStartMonth = function () {
                    var apponitmentMonth = kendo.toString(this.get("start"), "MMMM");
                    return apponitmentMonth;
                }
                this.vm_getStartWeek = function () {
                    var apponitmentWeek = kendo.toString(this.get("start"), "dddd");
                    return apponitmentWeek;
                }
                this.vm_getStartDateYear = function () {
                    var apponitmentYear = kendo.toString(this.get("start"), "dd, yyyy");
                    return apponitmentYear;
                }

                //venkat end
                this.vm_getStartDate = function () {
                    //    console.log("5");
                    //venkat start
                    // var dateGet = kendo.toString(this.get("start"), "dddd, MMMM dd, yyyy");
                    // var apponitmentYear = kendo.toString(this.get("start"), "dd, yyyy");
                    // var apponitmentWeek = kendo.toString(this.get("start"), "dddd");
                    // var apponitmentMonth= kendo.toString(this.get("start"), "MMMM");
                    //
                    //   console.log("apponitmentWeek ="+apponitmentWeek);
                    //   console.log("apponitmentMonth ="+apponitmentMonth);
                    //
                    //  var localizeCurrent = $('#localize-current').text();
                    //
                    //  var resultMonth = {"January":"enero","February":"febrero","March":"marzo","April":"abril","May":"Mayo","June":"junio","August":"agosto","September":"septiembre","October":"octubre","November":"noviembre","December":"diciembre"};
                    //  $.each(resultMonth, function(k, v) {
                    //  if(k === apponitmentMonth){
                    //        if(localizeCurrent == "Español") {
                    //              $(".apponitmentMonthSS").text(v);
                    //            }
                    //        if(localizeCurrent == "English (UK)") {
                    //              $(".apponitmentMonthSS").text(k);
                    //            }
                    //        if(localizeCurrent == "English") {
                    //              $(".apponitmentMonthSS").text(k);
                    //            }
                    //       }
                    //  });
                    //
                    //  var resultDay = {"Monday":"lunes","Tuesday":"martes","Wednesday":"miércoles","Thursday":"jueves","Friday":"viernes","Saturday":"sábado","Sunday":"domingo"};
                    //    $.each(resultDay, function(k, v) {
                    //    if(k === apponitmentWeek){
                    //          if(localizeCurrent == "Español") {
                    //                $(".apponitmentWeekSS").text(v);
                    //              }
                    //          if(localizeCurrent == "English (UK)") {
                    //                $(".apponitmentWeekSS").text(k);
                    //              }
                    //          if(localizeCurrent == "English") {
                    //                $(".apponitmentWeekSS").text(k);
                    //              }
                    //         }
                    //    });
                    //
                    //    $(".apponitmentYearSS").text(apponitmentYear);
                    //venkat
                    return kendo.toString(this.get("start"), "dddd, MMMM dd, yyyy");
                };
                //venkat start

                var enDay = { Monday: "lunes", Tuesday: "martes", Wednesday: "miércoles", Thursday: "jueves", Friday: "viernes", Saturday: "sábado", Sunday: "domingo" };
                var spDay = { lunes: "Monday", martes: "Tuesday", miércoles: "Wednesday", jueves: "Thursday", viernes: "Friday", sábado: "Saturday", domingo: "Sunday" };
                var enMonth = { January: "enero", February: "febrero", March: "marzo", April: "abril", May: "Mayo", June: "junio", July: "julio", August: "agosto", September: "septiembre", October: "octubre", November: "noviembre", December: "diciembre" };
                var spMonth = { enero: "January", febrero: "February", marzo: "March", abril: "April", Mayo: "May", junio: "June", julio: "July", agosto: "August", septiembre: "September", octubre: "October", noviembre: "November", diciembre: "December" };

                $('#localize-langs').click(function () {
                    var isLang = $('#localize-langs .activated').text();

                    var apponitmentWeek = $(".apponitmentWeekSS").text();
                    var apponitmentMonth = $(".apponitmentMonthSS").text();

                    if (isLang == "Español") {
                        $(".apponitmentWeekSS").text(enDay[apponitmentWeek]);
                        $(".apponitmentMonthSS").text(enMonth[apponitmentMonth]);
                    }
                    if (isLang == "English (UK)") {
                        $(".apponitmentWeekSS").text(spDay[apponitmentWeek]);
                        $(".apponitmentMonthSS").text(spMonth[apponitmentMonth]);
                    }
                    if (isLang == "English") {
                        $(".apponitmentWeekSS").text(spDay[apponitmentWeek]);
                        $(".apponitmentMonthSS").text(spMonth[apponitmentMonth]);
                    }
                });
                //venkat end

                this.vm_onToggleEditDate = function (e) {
                    if (!this.isDateAreaInEditMode) {
                        $('.js-footer-slider').not('.slick-initialized').slick({
                            infinite: false,
                            variableWidth: true,
                            slidesToShow: 1,
                            //  slidesToScroll: 3,
                            slidesToScroll: 1,
                            draggable: false,
                            easing: 'ease',
                            prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                            nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                        });
                    }

                    this.toggleDateArea();

                    this.preventDefault(e);
                    return false;
                };

                this.vm_onCancelEditDate = function () {
                    this.toggleDateArea();
                };

                this.vm_getDateAreaHeader = function () {
                    return this.get("isDateAreaInEditMode") ? "Reschedule Your Appointment" : "Date and Time";
                };

                this.vm_getDateAreaActionLabel = function () {
                    return this.get("isDateAreaInEditMode") ? "Done" : "<span class='icon_note'></span> Edit";
                };
                this.vm_onViewClinicianProfileClick = function () {
                    //TODO: GET ID AND IMPLEMENT REDIRECT
                };

                this.vm_notification_msg = "";

                this.vm_startDateChange = function () {
                    if (this.startDate === null) {
                        this.set("startDate", this.oldStartDate);
                    } else {
                        this.setSlotsDate(this.startDate);
                    }
                };

                this.setSlotsDate = function (starDate) {
                    var that = this;

                    var date = new Date(starDate);
                    date.setHours(0, 0, 0, 0);

                    this.set("startDate", date);

                    $selfSchedulingService.getSingleClinician(this.clinicianCard.userId, $timeUtils.dateToString(date)).done(function (response) {
                        var clinicianCard = response.data[0];
                        that.set("apptsSlotsTray", $apptsSlotsTray.createTimeSlotsTray(clinicianCard, date, that._selectNewAppointmentTime));
                        slotsLocator.setSlots(that.apptsSlotsTray.slots, date);

                        that.oldStartDate = that.startDate;
                        $('.js-footer-slider').not('.slick-initialized').slick({
                            infinite: false,
                            variableWidth: true,
                            slidesToShow: 1,
                            //  slidesToScroll: 3,
                            slidesToScroll: 1,
                            draggable: false,
                            easing: 'ease',
                            prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                            nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                        });
                    }).fail(function (error) {
                        if (error.status === 404) {
                            that.set("startDate", that.oldStartDate);
                            $snapNotification.info("There is no available appointment slots for selected date.");
                        }
                    });
                };
                /*********************** PRIVATE API ***********************/
                this._setOptions = function (opt, clinicianCard) {
                    this._setSelectorTime();

                    if (opt.intakeMetadata) {
                        this.additionalNotes = opt.intakeMetadata.additionalNotes ? opt.intakeMetadata.additionalNotes : "";

                        if (opt.intakeMetadata.concerns && opt.intakeMetadata.concerns.length > 0) {

                            var concerns = opt.intakeMetadata.concerns;
                            for (var i = 0; i < concerns.length; i++) {
                                if (concerns[i].isPrimary) {
                                    this.primaryConcern = concerns[i];
                                    this.vm_primaryConsernId = concerns[i].customCode.code;
                                    this.primaryConcernOtherText = concerns[i].customCode.description;
                                } else {
                                    this.secondaryConcern = concerns[i];
                                    this.displaySecondaryConcern = true;
                                    this.vm_secondaryConsernId = concerns[i].customCode.code;
                                    this.secondaryConcernOtherText = concerns[i].customCode.description;
                                }
                            }
                        }
                    }
                    var clinician = $scheduleCommon.findProvider(opt.participants);
                    if (clinician) {
                        this.clinician = clinician;
                        this.clinicianImageSource = clinician.person.photoUrl || global.getDefaultProfileImageForClinician();
                        this.clinicianFullName = $scheduleCommon.getFullName(clinician.person);
                        this.info = $scheduleCommon.getSpeciality(clinician.person.speciality);
                        if (!this.patientsSelector.isCounterpartFilterSet()) {
                            this.patientsSelector.setCounterpartFilter(clinician.person.id);
                        }
                    }

                    if (clinicianCard) {
                        var date = new Date(this.startDate);
                        date.setHours(0, 0, 0, 0);

                        this.apptsSlotsTray = $apptsSlotsTray.createTimeSlotsTray(clinicianCard, date, this._selectNewAppointmentTime);
                        slotsLocator.setSlots(this.apptsSlotsTray.slots, date);
                    }

                    var patient = $scheduleCommon.findPatient(opt.participants);
                    var patientId = patient.patientId || data.patientProfileId;
                    if (patient) {
                        this.patientsSelector.selectInitialItem(
                            $itemSelector.convertPersonToSelectorItem(patient.person, patientId, $itemSelector.personType.patient), true);
                    }

                    this.vm_isAddNotesExpanded = false;
                    this.phoneNumber = opt.phoneNumber;
                    this.phoneType = opt.phoneType || phoneTypeEnum.other;

                    this.encounterTypeCode = opt.encounterTypeCode || $encounterMethodHelper.getFirstEnabledEncounterMethod(this.appointmentTypeCode);
                    this.encounterMethodSelector.select(this.encounterTypeCode);
                };

                this._selectNewAppointmentTime = function (timeSlot) {
                    $eventAggregator.published("apptvm_TimeSlotSelected", timeSlot);
                    $patientSelfSchedulingHub.lockSlot(timeSlot.availabilityBlockId, $timeUtils.dateToString(timeSlot.start), $timeUtils.dateToString(timeSlot.end));
                };
                this._formatConcernData = function (concernList, selectedConcernId, isPrimary) {
                    var concerns = concernList.data().filter(function (concern) {
                        return concern.codeId === selectedConcernId;
                    });

                    if (concerns.length > 0) {
                        return {
                            isPrimary: isPrimary,
                            customCode: {
                                code: selectedConcernId,
                                description: concerns[0].text
                            }
                        };
                    }

                    return null;
                };
                this._deactivationTimeout = null;
                this._clearDeactivationTimeout = function () {
                    if (this._deactivationTimeout) {
                        clearTimeout(this._deactivationTimeout);
                        this.set("isReadOnly", false);
                    }
                    if (availableTimeTimer) {
                        availableTimeTimer.stop();
                        availableTimeTimer = null;
                    }
                };
                this.isExpiredAppointment = false;
                this._initDeactivationTimeout = function () {
                    this._clearDeactivationTimeout();

                    this._startTimer();

                    var that = this;
                    this._deactivationTimeout = setTimeout(function () {
                        that.set("isReadOnly", true);
                        that.set("isDisabled", true);
                        that.trigger("change", { field: "vm_isNotDisabled" });
                        that.set("vm_notification_msg", "This appointment has expired. Please close this dialogue and select a new time.");
                        that.set("vm_hideTimer", true);

                        setTimeout(function () {
                            that.set("isExpiredAppointment", true);
                        }, 1000);

                        $patientSelfSchedulingHub.unlockSlot(that.availabilityBlockId, that.start, that.end);
                    },
                        5 * 60 * 1000);
                };

                this._initSelectors();

                this._setOptions(opt, data.clinicianCard);

                function getPatientItem(patientProfileId) {
                    var dfd = $.Deferred();

                    if (patientProfileId) {
                        $selfSchedulingService.getFamillyGroupPatient(patientProfileId).done(function (resp) {
                            if (resp.data.length) {
                                var patient = resp.data[0];
                                dfd.resolve({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $itemSelector.personType.patient
                                });
                            } else {
                                dfd.resolve(null);
                            }
                        }).fail(function (error) {
                            dfd.reject(error);
                        });
                    } else {
                        dfd.resolve(null);
                    }

                    return dfd.promise();
                }
            }



            this.createNew = function (opts) {
                return new Appointment(opts);
            };
        }).singleton();
}(jQuery, snap, kendo, window));
//@ sourceURL=appointmentPopup.dialog.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.patient.schedule.AppointmentFactory",
            "snap.patient.schedule.patientAppointmentService",
            "snap.service.availabilityBlockService",
            "snap.enums.userTypes",
            "snap.common.schedule.ScheduleCommon",
            "snap.common.timeUtils",
            "snap.common.dialogWindow",
            //  "snap.errorHandler",
            "snap.service.selfSchedulingService"
            //    "snap.shared.wizard.appointmentWizard"
        ])
        .define("appointmentDialog", function (
            $snapNotification,
            $eventAggregator,
            $appointmentFactory,
            $appointmentsService,
            $availabilityBlockService,
            $userTypes,
            $scheduleCommon,
            $timeUtils,
            $dialogWindow,
            //  $errorHandler,
            $selfSchedulingService
            //  $appointmentWizard
        ) {
            var
                content = null,
                appointmentWizard = null,
                container = "#patientPopUpContainer",
                currentDialog = null;

            var dlg = this;

            function loadContent() {
                var dfd = $.Deferred();

                if (content === null) {
                    $.get("schedule/tab-appointmentDialog.html" + snap.addVersion, function (data) {
                        content = data;
                        dfd.resolve(content);
                    });
                } else {
                    dfd.resolve(content);
                }

                return dfd.promise();
            }

            function open(eventVM) {
                close();

                var dfd = $.Deferred();

                loadContent().done(function (content) {
                    if ($(container).length === 0) {
                        $("body").append("<div id='patientPopUpContainer'></div>");
                        setTimeout(function () {
                            snap.datepickers.initializeDatePicker('.appointmentDP', null, snap.dateLimits.getTodayMaxDate(), "MM/dd/yy");
                            $(".k-list-container").addClass("localizejs");
                        }, 1000);
                    }

                    var $container = $(container);


                    $container.html(content);

                    eventVM.dialogContainer = $container;

                    /*   $eventAggregator.subscriber("apptvm_TimeSlotSelected", function(timeSlot) {
                           eventVM.set("start", timeSlot.start);
                           eventVM.set("end", timeSlot.end);
                           eventVM.set("availabilityBlockId", timeSlot.availabilityBlockId);
                           eventVM.set("isNow", timeSlot.isNow);
                           eventVM.toggleDateArea();
                       });
   
                       $eventAggregator.subscriber("slotTray_goToDate", function(obj) {
                           var dateFilter = new Date(obj.nextDate);
                           dateFilter.setHours(0, 0, 0, 0);
   
                           eventVM.setSlotsDate(dateFilter);
                       });*/



                    if (currentDialog === null) {
                        $container.kendoWindow({
                            actions: [],
                            modal: true,
                            resizable: false,
                            animation: false
                        });

                        $container.parent().addClass('dialogbox-modal');

                        currentDialog = {
                            kendoWindow: $container.data("kendoWindow")
                        };
                    }

                    kendo.bind($container, eventVM);
                    currentDialog.viewModel = eventVM;


                    $container.show();

                    currentDialog.kendoWindow.center();
                    currentDialog.kendoWindow.open();
                    eventVM.load();

                    setTimeout(function () {
                        $container.find('.dialogbox-master').addClass("is-visible");
                    }, 100);

                    $container.find(".k-grid-header").css('display', 'none');

                    $(".k-overlay").click(function () {
                        close();
                    });

                    $("#patientPopUpContainer").click(function (e) {
                        var div = eventVM._type + "_editor";

                        if (e.target.id == div) {
                            close();
                        }

                        if (e.target !== this)
                            return;

                        close();
                    });

                    dfd.resolve();
                });

                return dfd.promise();
            }

            function close() {
                if (currentDialog) {
                    $(container).find('.dialogbox-master').addClass("is-hidden");
                    $snapNotification.hideAllConfirmations();
                    setTimeout(function () {
                        currentDialog.viewModel.unlockSlot();
                        currentDialog.kendoWindow.close();
                        currentDialog.kendoWindow.destroy();
                        currentDialog = null;
                        $eventAggregator.published(dlg.appointmentPopupClosedEvent);
                    }, 200);
                }
            }

            this.appointmentPopupSavedEvent = "apptpp_IsSaved";
            this.appointmentPopupClosedEvent = "apptpp_IsClosed";

            ///*********************** EVENTS SUBSCRIPTION ************************/
            [
                $appointmentFactory.closeEvent
            ].forEach(function (event) {
                $eventAggregator.subscriber(event, function () {
                    close();
                });
            });

            [
                $appointmentFactory.savedEvent,
                $appointmentFactory.removedEvent
            ].forEach(function (event) {
                $eventAggregator.subscriber(event, function () {
                    close();
                    $eventAggregator.published(dlg.appointmentPopupSavedEvent);
                });
            });


            /*********************** PUBLIC METHODS *****************************/
            this.open = function (opt) {
                var event = $appointmentFactory.createNew(opt);

                event = kendo.observable(event);
                open(event).done(function () {
                    // var editor = $("#editor").data("kendoEditor");
                    // if (editor !== null) {
                    //     editor.refresh();
                    // }

                });

                return event;
            };

            this.close = function () {
                close();
            };

            this.openAppointmentWizard = function (options, displayOpt) {
                if (!appointmentWizard) {
                    var wizardVm = $appointmentWizard.createNew({
                        userType: displayOpt.userType
                    });
                    appointmentWizard = $dialogWindow.createNewDialog({
                        contentPath: [
                            "/content/shared/appointmentWizard/scheduleAppointmentWizard.html",
                            "/content/shared/appointmentWizard/appointmentStep.patient.html",
                        ],
                        container: "#appointmentWizardContainer",
                        vm: wizardVm
                    });
                }
                appointmentWizard.open({
                    appointmentOpt: options,
                    displayOpt: displayOpt
                });
            };

            this.openNewAppointmentDialog = function (dialogOpt) {
                var dfd = $.Deferred();
                sessionStorage.setItem('chkSSAddOrEdit', 'Add');
                var that = this;
                $selfSchedulingService.getClinicianCard(dialogOpt.clinicianId, $timeUtils.dateToString(dialogOpt.start)).done(function (response) {
                    var clinicianCard = response.data[0];

                    var participants = [{
                        appointmentId: null,
                        attendenceCode: $scheduleCommon.attendenceCode.required,
                        person: {
                            id: clinicianCard.personId,
                            photoUrl: clinicianCard.profilePhoto,
                            providerId: snap.hospitalSession.hospitalId,
                            name: {
                                given: clinicianCard.name,
                                family: clinicianCard.lastName
                            },
                            speciality: {
                                primary: clinicianCard.medicalSpeciality,
                                secondary: clinicianCard.subSpeciality
                            }
                        },
                        participantTypeCode: $scheduleCommon.participantTypeCode.practicioner
                    }, {
                        appointmentId: null,
                        attendenceCode: $scheduleCommon.attendenceCode.required,
                        person: {},
                        participantTypeCode: $scheduleCommon.participantTypeCode.patient,
                        patientId: dialogOpt.patientProfileId ? dialogOpt.patientProfileId : snap.profileSession.profileId
                    }];

                    var result = {
                        appt: {
                            start: dialogOpt.start,
                            end: dialogOpt.end,
                            availabilityBlockId: dialogOpt.availabilityBlockId,
                            participants: participants,
                            intakeMetadata: [],
                            isNow: dialogOpt.isNow
                        },
                        clinicianCard: {
                            userId: clinicianCard.userId,
                            slots: clinicianCard.slots

                        },
                        // we need this in order to select current patient in dialog. Currently we do not have api which can return person record on clinician site.
                        //patientProfileId: snap.profileSession.profileId
                        // we need this in order to select current patient in dialog. Currently we do not have api which can return person record on clinician site.
                        patientProfileId: dialogOpt.patientProfileId ? dialogOpt.patientProfileId : snap.profileSession.profileId
                    };

                    //   if (snap.showNewAppointmentWizard()) {
                    //     var diaplayOpt = {
                    //         userType: $userTypes.patient
                    //     };
                    //     that.openAppointmentWizard(result, diaplayOpt);
                    // } else {
                    that.open(result);
                    //  }

                }).fail(function () {
                    $snapNotification.error("Provider card information is not available");
                });
            };

            this.openExistedAppointmentDialog = function (apptId, isReadOnly) {
                var dfd = $.Deferred();

                var that = this;
                sessionStorage.setItem('chkSSAddOrEdit', 'Edit');
                $selfSchedulingService.getAppointment(apptId).done(function (resp) {
                    var result = {
                        appt: resp.data[0],
                        isReadOnly: isReadOnly,
                        clinicianCard: {
                            userId: resp.data[0].clinicianId,
                            slots: []
                        },
                        patientProfileId: resp.data[0].patientId
                    };

                    result.appt.start = $timeUtils.dateFromSnapDateString(result.appt.startTime);
                    result.appt.end = $timeUtils.dateFromSnapDateString(result.appt.endTime);
                    result.appt.phoneNumber = result.appt.where;
                    result.appt.phoneType = result.appt.whereUse;
                    debugger;
                    $selfSchedulingService.getUserCurrentTime().done(function (resp) {
                        //  var userDNATime = $timeUtils.dateFromSnapDateString(resp.data[0]);
                        //  userDNATime.setMinutes(userDNATime.getMinutes() - 30);
                        //  result.isFuture = userDNATime <= result.appt.end;
                        $selfSchedulingService.getClinicianCard(result.appt.clinicianId, $timeUtils.dateToString($timeUtils.dateFromSnapDateString(result.appt.startTime))).done(function (clinicianResp) {
                            var clinicianCard = clinicianResp.data[0];
                            result.clinicianCard = {
                                userId: clinicianCard.userId,
                                slots: clinicianCard.slots
                            };
                            var clinician = $scheduleCommon.findProvider(result.appt.participants);
                            if (clinician) {
                                clinician.person.speciality = {
                                    primary: clinicianCard.medicalSpeciality,
                                    secondary: clinicianCard.subSpeciality
                                };
                            }
                        }).fail(function () {
                            if (!result.isReadOnly) {
                                result.isClinicianDisabled = true;
                            }
                        }).always(function () {
                            var appt = that.open(result);
                            dfd.resolve(appt);
                        });
                    }).fail(function () {
                        dfd.reject();
                    });
                });

                return dfd.promise();
            };

        }).singleton();
}(jQuery, snap, kendo));
//@ sourceURL=itemSelector.control.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common").use(["snapNotification", "snap.EventAggregator", "snap.admin.schedule.TimeUtils", "snap.common.schedule.ScheduleCommon", "snap.common.loadingStack", "snap.service.availabilityBlockService", "snap.service.appointmentService"])
        .define("ItemSelector", function ($snapNotification, $eventAggregator, $timeUtils, $scheduleCommon, $loadingStack, $availabilityBlockService, $appointmentService) {
            var itemDefaultValues = {
                id: null,
                name: "Select a Person",
                imageSource: "images/default-user.jpg",
                info: "For the list",
            };

            this.events = {
                onItemSelected: "onItemSelected",
                onItemClicked: "onItemClicked",
                onSelectorHide: "onSelectorHide"
            };

            var $scope = this;

            this.personType = {
                clinician: "clinician",
                patient: "patient"
            };

            function sortByName(arr) {
                return arr.sort(function (a, b) {
                    var nameA = a.name.toLowerCase(),
                        nameB = b.name.toLowerCase();

                    if (nameA < nameB) { //sort string ascending
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0; //default return value (no sorting)
                });
            }

            function Item(item, container) {
                this.id = item.id;
                this.name = item.name;
                this.imageSource = item.imageSource ||
                    (item.personType === $scope.personType.clinician ? getDefaultProfileImageForClinician() : getDefaultProfileImageForPatient());
                this.info = item.info;
                this.personType = item.personType;
                this.personId = item.personId;
                this.data = item.data;

                this.isDefault = !this.id;
                this.isSelected = false;
                this.isDisabled = !!item.isDisabled;
                this.isTimeOffsetsVisible = !!item.isTimeOffsetsVisible;
                this.timeZoneId = null;
                this.timeZoneName = "unknown";

                this.vm_TimeText = item.vm_TimeText || "";

                this._convertedTimeCashe = item._convertedTimeCashe || null;

                this.select = function (val) {
                    this.set("isSelected", val);
                };

                this.onSelectClick = function () {
                    if (container) {
                        container.onSelectClick(this);
                    }
                };

                this.onViewProfileClick = function (e) {
                    if (!!this.id) {
                        $eventAggregator.published("itemSelector_onProfileClick", {
                            id: this.id,
                            personType: this.personType
                        });
                    }
                    e.preventDefault();
                    return false;
                };

                this.getValue = function () {
                    return item;
                };

                this.vm_isVisible = function () {
                    if (container) {
                        return !this.isSelected;
                    }

                    return true;
                };

                this.updateTime = function (startTime, endTime, sourceTimeZoneId, useCahedValue) {
                    var that = this;
                    var dfd = $.Deferred();
                    var duration = endTime - startTime;
                    var convertedTimePromise = (useCahedValue && this._convertedTimeCashe) ? dfd.resolve(this._convertedTimeCashe) : this._convertTime(startTime, sourceTimeZoneId);
                    convertedTimePromise.done(function (convertedTime) {
                        if (convertedTime) {
                            that._convertedTimeCashe = convertedTime;
                            var convertedStartTime = $timeUtils.dateFromSnapDateString(convertedTime.convertedDateTime);
                            var timeZoneName = convertedTime.targetTimeZone.abbreviation;
                            var convertedEndTime = new Date(convertedStartTime);
                            convertedEndTime.setTime(convertedEndTime.getTime() + duration);
                            that.timeZoneId = convertedTime.targetTimeZone.id;
                            that.timeZoneName = convertedTime.targetTimeZone.name;
                            that.set("vm_TimeText", kendo.toString(convertedStartTime, "h:mm tt ") + timeZoneName + " - " +
                                kendo.toString(convertedEndTime, "h:mm tt ") + timeZoneName);
                            dfd.resolve();
                        }
                    });
                    return dfd.promise();
                };

                this._convertTime = function (time, sourceTimeZoneId) {
                    var dfd = $.Deferred();
                    if (!time) {
                        dfd.reject();
                    } else {
                        var opt = {
                            dateTime: $timeUtils.dateToString(time),
                            sourceTimeZoneId: sourceTimeZoneId
                        }
                        if (this.personType === $scope.personType.clinician) {
                            opt.targetUserId = this.id;
                        } else {
                            opt.targetPatientId = this.id;
                        }
                        $availabilityBlockService.convertTime(opt).then(function (resp) {
                            dfd.resolve(resp);
                        }, function () {
                            dfd.reject();
                        });
                    }
                    return dfd.promise();
                }
            }

            function Container(opt) {
                this.ds = null;
                this.nameFilter = "";
                this.counterpartFilter = null;
                this.isItemsSelectorVisible = false;
                this.isSelectorLocked = false;
                this.vm_tabindex = opt.tabindex || 1;

                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this.selectedItem = null;
                var scope = this;

                var defaultItem = $.extend(true, {}, itemDefaultValues, opt.defaultItem);
                var triggerEvent = function (name) {
                    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                    var eventCbList = eventList[name];
                    if (eventCbList) {
                        $.each(eventCbList, function () {
                            return this.apply(scope, args);
                        });
                    }
                };

                this.onSelectClick = function (item) {
                    if (this.selectWithConfirmation) {
                        triggerEvent($scope.events.onItemClicked, item);
                    } else {
                        this.selectHandler(item);
                    }
                };

                this.selectHandler = function (item) {
                    this.ds.data().forEach(function (i) {
                        if (i.isSelected) {
                            i.select(false);
                        }
                    });

                    item.select(true);
                    this.selectItem(item);

                    //this._reloadItems();

                    triggerEvent($scope.events.onItemSelected);

                    this.set("isItemsSelectorVisible", false);
                    triggerEvent($scope.events.onSelectorHide);

                    this.trigger("change", { field: "ds" });
                };


                var eventList = {};

                /*********************** PUBLIC API ***********************/
                this.setDataSource = function (ds) {
                    this.set("ds", ds);

                    var that = this;
                    var loadingStack = $loadingStack.newStack(function () {
                        that.set("vm_isItemsLoading", true);
                    }, function () {
                        that.set("vm_isItemsLoading", false);
                    });

                    this.ds.bind("change", function () {
                        that._refresh();
                    });

                    this.ds.bind("requestStart", function () {
                        loadingStack.push();
                    })

                    this.ds.bind("requestEnd", function () {
                        loadingStack.pop();
                    })
                };

                this.getSelectedItem = function () {
                    return this.selectedItem;
                };

                this.isAnyItemSelected = function () {
                    var selectedItem = this.getSelectedItem();
                    return selectedItem !== null;
                };

                this.selectItem = function (item, doNotUpdateTime) {
                    var that = this;
                    this.set("selectedItem", new Item(item));
                    this.selectedItem.select(true);
                    this._refresh();
                    if (!doNotUpdateTime) {
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function () {
                            that._refresh();
                        });
                    }

                };

                this.setEventTime = function (start, end, timeZoneId) {
                    this._startTime = start;
                    this._endTime = end;
                    this._timeZoneId = timeZoneId;
                };

                this.updateEventTime = function (start, end, timeZoneId, useCahedValue) {
                    var that = this;
                    this.setEventTime(start, end, timeZoneId);
                    if (this.selectedItem) {
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId, useCahedValue).done(function () {
                            that._refresh();
                        });
                    }
                };

                this.showTimeOffset = function (value) {
                    if (this.selectedItem) {
                        this.selectedItem.set("isTimeOffsetsVisible", value);
                        this._refresh();
                    }
                };

                this.refresh = function () {
                    this._reloadItems();
                };

                //We need event subscription because we can not not use Kendo Observable in constructor.
                //And use var scope = this; scope.set("...", ...)
                this.on = function (eventName, cb) {
                    var eventCbList = eventList[eventName];
                    if (!eventCbList) {
                        eventCbList = [];
                    }
                    eventCbList.push(cb);
                    eventList[eventName] = eventCbList;
                };

                /*********************** MVVM BINDINGS ***********************/
                this.vm_isItemsLoading = false;

                this.vm_nameFilterChange = function () {
                    if (!!this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    var that = this;
                    this.searchTimeout = setTimeout(function () {
                        that.ds.read({
                            skip: 0
                        });
                    }, 500);
                };

                this.vm_isItemsListEmpty = function () {
                    return this.ds.data().length === 0;
                };

                this.vm_getItemsListEmptyNotification = function () {
                    return this.nameFilter === "" ?
                        "Enter user name to begin search" :
                        "No users match your search";
                };

                this.vm_getSelectedItemOrDefault = function () {
                    if (this.selectedItem) {
                        var selected = kendo.observable(new Item(this.selectedItem));
                        if (sessionStorage.getItem('chkSSAddOrEdit') === 'Edit') {
                            selected.set("isSelectorLocked", !this.isSelectorLocked);
                        } else {
                            selected.set("isSelectorLocked", this.isSelectorLocked);
                        }
                        return selected;
                    } else {
                        var def = defaultItem;
                        if (opt.defaultItem) {
                            def = opt.defaultItem;
                        }

                        return kendo.observable(new Item(def));
                    }
                };

                this.vm_isSelectedItemsListNotEmpty = function () {
                    return this.vm_getSelectedItems().length > 0;
                };

                this.vm_getSelectedItems = function () {
                    var arr = [];

                    if (this.selectedItem) {
                        arr.push(this.selectedItem);
                    }
                    return arr;
                };

                this.vm_openItemsSelector = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                    if (!this.isSelectorLocked && sessionStorage.getItem('chkSSAddOrEdit') !== 'Edit') {
                        var that = this;
                        that.set("isItemsSelectorVisible", true);

                        window.setTimeout(function () {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    }
                };

                this.vm_hideItemsSelector = function (e) {
                    e.preventDefault();
                    this.set("isItemsSelectorVisible", false);
                    triggerEvent($scope.events.onSelectorHide);
                };

                /************************ PRIVATE METHODS ************************/
                this._reloadItems = function () {
                    var that = this;
                    this.ds.read({ skip: 0 }).done(function () {
                        that._refresh();

                        window.setTimeout(function () {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    });
                };

                this._refresh = function () {
                    this.trigger("change", {
                        field: "vm_getSelectedItems"
                    });
                    this.trigger("change", {
                        field: "vm_getSelectedItemOrDefault"
                    });

                    this.trigger("change", {
                        field: "vm_isItemsListEmpty"
                    });
                    this.trigger("change", {
                        field: "vm_getItemsListEmptyNotification"
                    });

                    this.trigger("change", {
                        field: "vm_isSelectedItemsListNotEmpty"
                    });
                };

                this.disableSelectedItem = function () {
                    if (this.selectedItem) {
                        this.selectedItem.set("isDisabled", true);
                        this.trigger("change", {
                            field: "vm_getSelectedItemOrDefault"
                        });
                    }
                };
            }

            //************************* Data sources **************************
            function createCliniciansDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: [snap.baseUrl + "/api/v2.1/providers", snap.hospitalSession.hospitalId, "clinicians"].join("/"),
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }
                                if (container.counterpartFilter) {
                                    data.patient = container.counterpartFilter;
                                }
                                data.roleFunctions = [snap.security.conduct_virtual_consultations].join(",")
                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Provider list");
                    },
                    schema: {
                        data: function (clinicians) {
                            var data = clinicians.data.map(function (clinician) {
                                clinician.person.providerId = clinician.providerId;
                                return new Item({
                                    id: clinician.userId,
                                    personId: clinician.person.id,
                                    name: $scheduleCommon.getFullName(clinician.person),
                                    imageSource: clinician.person.photoUrl || getDefaultProfileImageForClinician(),
                                    info: $scheduleCommon.getPhoneNumber(clinician.person),
                                    data: clinician,
                                    personType: $scope.personType.clinician,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            function createPatientsDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: [snap.baseUrl + '/api/v2.1/providers/', snap.hospitalSession.hospitalId, '/patients'].join(''),
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }
                                if (container.counterpartFilter) {
                                    data.clinician = container.counterpartFilter;
                                }

                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Patients list");
                    },
                    schema: {
                        data: function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return new Item({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $scope.personType.patient,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            function createFamilyGroupDS(container) {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: snap.baseUrl + "/api/v2.1/patients/authorized-patients",
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({
                                    data: data.models
                                });
                            } else {
                                if (container.nameFilter) {
                                    data.search = container.nameFilter;
                                }

                                if (container.counterpartFilter) {
                                    data.providerPersonId = container.counterpartFilter;
                                }

                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        $scheduleCommon.handleDataSourceError(e, "Patients list");
                    },
                    schema: {
                        data: function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return new Item({
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: $scope.personType.patient,
                                }, container);
                            });

                            if (container.selectedItem) {
                                data.forEach(function (item) {
                                    if (item.personId === container.selectedItem.personId) {
                                        item.isSelected = true;
                                    }
                                });
                            }

                            return data;
                        },
                        total: "total",
                    },
                    pageSize: 30,
                    serverPaging: true
                });
            }

            /************************ "STATIC" METHODS ************************/
            this.containerClass = Container;

            this.emptySelector = function (opt) {
                var c = kendo.observable(new Container(opt));
                c.setDataSource(new kendo.data.DataSource({ data: [] }));

                return c;
            };

            this.patientsSelector = function (opt) {
                opt.tabindex = 1;
                var c = kendo.observable(new Container(opt));
                var ds = createPatientsDS(c);
                c.setDataSource(ds);

                return c;
            };

            this.cliniciansSelector = function (opt) {
                opt.tabindex = 2;
                var c = kendo.observable(new Container(opt));
                var ds = createCliniciansDS(c);
                c.setDataSource(ds);

                return c;
            };

            this.familyGroupSelector = function (opt) {
                opt.tabindex = 1;
                var c = kendo.observable(new Container(opt));
                var ds = createFamilyGroupDS(c);
                c.setDataSource(ds);

                return c;
            };

            // this.cliniciansSelector = function(opt) {
            //     return patientsSelector(opt)
            // }

            this.convertPersonToSelectorItem = function (person, id, personType, speciality) {
                var item = {
                    id: id || null,
                    personId: person.id,
                    name: $scheduleCommon.getFullName(person),
                    imageSource: person.photoUrl || (personType === $scope.personType.patient ? getDefaultProfileImageForPatient() : getDefaultProfileImageForClinician()),
                    data: {
                        person: person
                    },
                    personType: personType,
                };

                if (personType === $scope.personType.patient) {
                    item.info = $scheduleCommon.getPhoneNumber(person);
                } else {
                    item.info = $scheduleCommon.getSpeciality(speciality);
                }

                return item;
            };

        }).singleton();
}(jQuery, snap, kendo));

(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("availabilityBlockService", function ($http) {
        var abApiUrl = snap.baseUrl + "/api/v2.1/clinicians/availability-blocks",
            apptApiUrl = snap.baseUrl + "/api/v2.1/clinicians/appointments";
        var codeSetsDS = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);

        this.getAvailabilityBlocks = function (opt) {
            var path = abApiUrl;

            return $http.get(path, {
                ClinicianIds: opt.clinicianIds,
                StartDate: opt.startDate,
                EndDate: opt.endDate
            });
        };

        this.getSingleAvailabilityBlock = function (blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $http.get(path);
        };

        this.addAvailabilityBlock = function (block) {
            var path = abApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(block),
            });

        };

        this.updateAvailabilityBlock = function (block, blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(block),
            });
        };

        this.deleteAvailabilityBlock = function (blockId) {
            var path = [abApiUrl, blockId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        this.deleteAvailabilityBlockRule = function (blockId, ruleId) {
            var path = [abApiUrl, blockId, "rule", ruleId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        this.getAvailabilityBlockClinician = function (blockId) {
            var path = [abApiUrl, blockId, "clinicians"].join("/");

            return $http.get(path);
        };

        this.getAppointmentsForClinician = function (opt) {
            var path = apptApiUrl;

            return $http.get(path, opt);
        };

        this.getAppointmentsForPatient = function (opt) {
            return $http.get(snap.baseUrl + "/api/v2.1/patients/filtered-appointments", opt);
        };


        this.getAppointment = function (apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $http.get(path);
        };

        this.getAppointmentForpatient = function (apptId) {
            var path = [snap.baseUrl + "/api/v2.1/patients/appointments", apptId].join("/");

            return $http.get(path);
        };

        /************************ Appointments *************************/
        this.addAppointment = function (appt) {
            var path = apptApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };

        this.updateAppointment = function (appt, apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
        };

        this.deleteAppointment = function (apptId) {
            var path = [apptApiUrl, apptId].join("/");

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "text"
            });
        };

        /************************ COVERAGES *************************/
        this.getCoverageBlocks = function (filters) {
            var dfd = $.Deferred();
            if (filters.type !== "all") {
                $http.get(snap.baseUrl + '/api/v2.1/clinicians/availability-blocks/coverage', filters).done(function (coverageBlocks) {
                    var blocks = extendBlockArrayWithType(coverageBlocks.data, filters.type);
                    dfd.resolve({ data: blocks, total: blocks.length });
                }).fail(function () {
                    dfd.reject();
                });
            } else {
                $.when(
                    $http.get(snap.baseUrl + '/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "onDemand" })),
                    $http.get(snap.baseUrl + '/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "patientScheduled" })),
                    $http.get(snap.baseUrl + '/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "adminScheduled" })),
                    $http.get(snap.baseUrl + '/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "unavailable" }))
                ).done(function (onDemand, patientScheduled, adminScheduled, unavailable) {
                    var blocks = [].concat(
                        extendBlockArrayWithType(onDemand[0].data, 'onDemand'),
                        extendBlockArrayWithType(patientScheduled[0].data, 'patientScheduled'),
                        extendBlockArrayWithType(adminScheduled[0].data, 'adminScheduled'),
                        extendBlockArrayWithType(unavailable[0].data, 'unavailable')
                    );
                    dfd.resolve({ data: blocks, total: blocks.length });
                }).fail(function () {
                    dfd.reject();
                });
            }

            return dfd.promise();

            function extendBlockArrayWithType(coverageBlocks, coverageBlockType) {
                return coverageBlocks.map(function (item) {
                    return $.extend({}, item, { type: coverageBlockType });
                });
            }
        };

        /************************ ENCOUNTER DIALOG *************************/

        this.saveEncounterDocument = function (encDoc) {
            var path = snap.baseUrl + "/api/v2.1/clinicians/documentencounter";

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(encDoc),
            });
        };

        /************************ CONCERNS **************************/
        this.getPrimaryConcerns = function () {
            var def = $.Deferred();
            codeSetsDS.getItemIdByName("primary", snap.hospitalSession.hospitalId, "other").done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "primary",
                        snap.hospitalSession.hospitalId, [
                            "Other"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSourceAddingObjects(
                        "primary", snap.hospitalSession.hospitalId, [{
                            "codeId": -1,
                            "text": "Other (provide details below)"
                        }]));
                }
            });

            return def.promise();
        };

        this.getSecondaryConcerns = function () {
            var def = $.Deferred();
            codeSetsDS.getItemIdByName("secondary", snap.hospitalSession.hospitalId, "other").done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "secondary",
                        snap.hospitalSession.hospitalId, [
                            "Other"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSourceAddingObjects(
                        "secondary", snap.hospitalSession.hospitalId, [{
                            "codeId": -2,
                            "text": "Other (provide details below)"
                        }]));
                }
            });
            return def.promise();
        };

        /************************ PERSON **************************/
        this.getPatientList = function (providerId, searchText, take, skip) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "patients"].join("/");
            var parameters = {
                take: take,
                skip: skip
            };
            if (!!searchText) {
                parameters.search = searchText;
            }
            return $http.get(path, parameters);
        };

        this.getClinicianList = function (providerId) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "clinicians"].join("/");

            return $http.get(path);
        };

        this.getAllStaffAccountsForScheduling = function (providerId) {
            var path = [snap.baseUrl + "/api/v2.1/providers/", providerId, "/clinicians?roleFunctions=", snap.security.conduct_virtual_consultations].join("");

            return $http.get(path);
        };

        this.getPersonByEmail = function (email, userType) {
            var path = snap.baseUrl + "/api/v2.1/people?email=" + email;

            if (userType) {
                path += "&userType=" + userType;
            }

            return $http.get(path);
        };

        this.getUserCurrentTime = function () {
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time");
        };

        this.getPatientProfile = function (providerId, patientId) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "patients", patientId].join("/");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };

        this.getPatientProfilesForPatient = function (opt) {
            var path = snap.baseUrl + "/api/v2.1/patients/authorized-patients";
            var parameters = opt || {};

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: parameters
            });
        };
        this.getPatientProfileForPatient = function (patientId) {
            var path = [snap.baseUrl + "/api/v2.1/patients/authorized-patients", patientId].join("/");
            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        /*  this.getPatientProfilesForPatient = function(patientId) {
              var path = [snap.baseUrl + "/api/v2/patients/profiles", patientId].join("/");
  
              return $.ajax({
                  type: "GET",
                  url: path,
                  contentType: "application/json; charset=utf-8",
                  dataType: "json"
              });
          };*/
        this.getClinicianProfile = function (providerId, clinicianId) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "users", clinicianId, "clinician/person"].join("/");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };
        this.convertTime = function (opt) {
            var path = snap.baseUrl + "/api/v2.1/convert-time";
            return $http.get(path, opt);
        };
        this.getTimeZones = function () {
            var path = snap.baseUrl + "/api/v2/timezones";
            return $http.get(path);
        };

    }).singleton();
}(jQuery, window.snap = window.snap || {}));
snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.service.selfSchedulingService", "snap.common.schedule.ScheduleCommon"])
    .define("familyGroupDataSource", function ($snapNotification, $selfSchedulingService, $scheduleCommon) {

        function CachedDS(items) {
            var localItems = items;

            this.selectById = function (id) {
                return selectBy(id, "id");
            };

            this.selectByPersonId = function (personId) {
                return selectBy(personId, "personId");
            };

            function selectBy(value, propertyName) {
                var selectedItem = null;
                for (var i = 0; i < localItems.length; i++) {
                    if (localItems[i][propertyName] === value) {
                        selectedItem = localItems[i];
                    }
                }

                return selectedItem;
            }
        }

        function LocalDS(items) {
            CachedDS.call(this, items);
            var localItems = items;
            this.selectByName = function (name) {
                var filtered;
                if (typeof (name) === "undefined" || name === null || name === "") {
                    filtered = localItems;
                } else {
                    filtered = localItems.filter(function (item) {
                        return name === "" || item.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
                    });
                }

                return filtered;
            };


        }

        function DS() {
            this.read = function (nameFilter) {

                var dfd = $.Deferred();

                this._getDS(nameFilter).done(function (ds) {
                    dfd.resolve(ds.selectByName(nameFilter));
                });

                return dfd.promise();
            };

            this.selectById = function (id) {
                var df = $.Deferred();

                if (id) {
                    this._getDS().done(function (ds) {
                        df.resolve(ds.selectById(id));
                    });
                } else {
                    df.resolve(null);
                }

                return df.promise();
            };

            this.selectByPersonId = function (id) {
                var df = $.Deferred();

                if (id) {
                    this._getDS().done(function (ds) {
                        df.resolve(ds.selectByPersonId(id));
                    });
                } else {
                    df.resolve(null);
                }

                return df.promise();
            };

            this.getLocalDS = function () {
                return this._getDS();
            };
        }

        function FamillyGroupDS() {
            /************************************************************
             ****************** Call BASE constructor ********************
             *************************************************************/
            DS.call(this);

            this._getDS = function () {
                var dfd = $.Deferred();
                $selfSchedulingService.getFamillyGroup().done(function (resp) {

                    var data = resp.data.map(function (patient) {
                        patient.person.providerId = patient.providerId;
                        return {
                            id: patient.patientId,
                            personId: patient.person.id,
                            name: $scheduleCommon.getFullName(patient.person),
                            imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                            info: $scheduleCommon.getPhoneNumber(patient.person),
                            data: patient,
                            personType: "patient",
                        };
                    });
                    dfd.resolve(new LocalDS(data));
                });

                return dfd.promise();
            };
        }
        this.getfamilyGroupDataSource = function () {
            return new FamillyGroupDS();
        }
    });
//@ sourceURL=timeUtils.js

(function ($, snap) {
    "use strict";
    snap.namespace("snap.admin.schedule").use([])
        .define("TimeUtils", function () {
            this.addDays = function (date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            };

            this.addMinutes = function (date, minutes) {
                return new Date(date.getTime() + minutes * 60000);
            };

            /********************** SnapTime format: "2016-04-05T14:00:00+02:00" *********************************/
            this.extractDatePartFromSnapDateString = function (snapDateString) {
                return snapDateString.slice(0, 19) + "Z"; //we need 'Z' in order to have the same data in Chrome and FF.
            };

            this.dateFromSnapDateString = function (snapDateString) {
                var year = snapDateString.slice(0, 4); // - 1900;
                var month = snapDateString.slice(5, 7) - 1;
                var day = snapDateString.slice(8, 10);
                var hours = snapDateString.slice(11, 13);
                var min = snapDateString.slice(14, 16);
                return new Date(year, month, day, hours, min);
            };

            this.dateToString = function (snapDateObject) {
                var year = snapDateObject.getFullYear();
                var month = ('0' + (snapDateObject.getMonth() + 1)).slice(-2);
                var day = ('0' + snapDateObject.getDate()).slice(-2);
                var hours = ('0' + snapDateObject.getHours()).slice(-2);
                var min = ('0' + snapDateObject.getMinutes()).slice(-2);
                return year + '-' + month + '-' + day + 'T' + hours + ':' + min;
            };

            this.parseTimeInterval = function (timeIntervalInSeconds) {
                // does the same job as parseInt truncates the float
                var hours = (timeIntervalInSeconds / 3600) | 0;
                var minutes = ((timeIntervalInSeconds % 3600) / 60) | 0;
                var seconds = (timeIntervalInSeconds % 60) | 0;

                return {
                    original: {
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                    },
                    formatted: {
                        hours: hours < 10 ? "0" + hours : hours,
                        minutes: minutes < 10 ? "0" + minutes : minutes,
                        seconds: seconds < 10 ? "0" + seconds : seconds,
                    },
                    toString: function () {
                        return [this.formatted.hours, this.formatted.minutes, this.formatted.seconds].join(":");
                    }
                };
            };

        }).singleton();
}(jQuery, window.snap = window.snap || {}));
(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common.schedule").use(["snapNotification"])
        .define("ScheduleCommon", function ($snapNotification) {

            /************************ START Timezone ***************************/
            //This functionality check that we have timeZoneSystemId.
            //If not, then we get timeZoneSystemId from "/api/v2/admin/userstaffprofile" api.
            if (isEmpty(snap.userSession.timeZoneSystemId)) {
                window.console.warn("snap.userSession.timeZoneSystemId is undefined.");

                $.ajax({
                    type: "GET",
                    url: snap.baseUrl + "/api/v2.1/users/current-time",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                }).done(function (response) {
                    var timeZone = response.message;
                    snap.userSession.timeZoneSystemId = timeZone;
                    snap.updateSnapJsSession("snap_user_session", "timeZoneSystemId", timeZone);
                }).fail(function () {
                    $snapNotification.error("Error. Time zone info missied");
                });
            }
            /************************ END Timezone ***************************/

            this.findParticipant = function (participants, participantTypeCode) {
                if (participants) {
                    for (var j = 0; j < participants.length; j++) {
                        if (participants[j] && participants[j].participantTypeCode === participantTypeCode && (typeof participants[j].status === "undefined" || participants[j].status === 1)) {
                            return participants[j];
                        }
                    }
                }

                return null;
            };

            this.findProvider = function (participants) {
                return this.findParticipant(participants, this.participantTypeCode.practicioner);
            };

            this.findPatient = function (participants) {
                return this.findParticipant(participants, this.participantTypeCode.patient);
            };

            this.getFullName = function (person) {
                var fullName = "";
                if (person && person.name) {
                    var nameParts = [];

                    if (!!person.name.given) {
                        nameParts.push(person.name.given);
                    }

                    if (!!person.name.family) {
                        nameParts.push(person.name.family);
                    }

                    fullName = nameParts.join(" ");
                }

                return fullName;
            };

            this.getPhoneNumber = function (person) {
                var phoneTypesPriority = ["home", "work", "other", "old", "temp"];

                if (person && person.phones && person.phones.length) {
                    var phones = person.phones;
                    for (var i = 0; i < phoneTypesPriority.length; i++) {
                        for (var j = 0; j < phones.length; j++) {
                            if (phones[j].use === phoneTypesPriority[i] && $.trim(phones[j].value) !== "") {
                                return phones[j].value;
                            }
                        }
                    }
                    return person.phones[0].value;
                }
                return "";
            };

            this.getSpeciality = function (speciality) {
                if (!isEmpty(speciality)) {
                    var arr = [];

                    if (!!speciality.primary) {
                        arr.push(speciality.primary);
                    }

                    if (!!speciality.secondary) {
                        arr.push(speciality.secondary);
                    }

                    return arr.join(" | ");
                } else return "";
            };

            this.attendenceCode = {
                unknown: 0,
                required: 1,
                optional: 2,
                cancelled: 3
            };

            this.participantTypeCode = {
                none: 0,
                patient: 1,
                practicioner: 2,
                relatedPerson: 3
            };

            this.userType = {
                admin: 0,
                clinician: 1,
                patient: 2
            };

            this.appointmentTypeCode = {
                none: 0,
                clinicianScheduled: 1,
                onDemand: 2,
                patientScheduled: 3
            };

            this.blockPermissions = {
                allowOnDemandAppt: "allowOnDemandAppt",
                allowSelfAppt: "allowSelfAppt",
                allowProviderAppt: "allowProviderAppt",
            };

            this.eventType = {
                availabilityBlock: "availabilityBlock",
                appointment: "appointment",
                documentEncounter: "documentEncounter"
            };
            this.appointmentStatusCode = {
                notSpecified: 0,
                scheduled: 1,
                waiting: 2,
                cancelledByPatient: 3,
                cancelledByProvider: 4,
                fulfilled: 5,
                transferred: 6
            };
            this.appointmentStatus = {
                notSpecified: "NotSpecified",
                scheduled: "Scheduled",
                waiting: "Waiting",
                cancelledByPatient: "CancelledByPatient",
                cancelledByProvider: "CancelledByProvider",
                fulfilled: "Fulfilled",
                transferred: "Transferred"
            };

            this.concernCodes = {
                otherPrimary: -1,
                otherSecondary: -2
            };
            this.isAppointmentFulfilled = function (status) {
                if (typeof (status) === "string") {
                    return status === this.appointmentStatus.fulfilled;
                }
                return status === this.appointmentStatusCode.fulfilled;
            }
            this.isAppointmentReadOnly = function (status) {
                if (typeof (status) === "string") {
                    return [this.appointmentStatus.scheduled, this.appointmentStatus.transferred].indexOf(status) === -1;
                }
                return [this.appointmentStatusCode.scheduled, this.appointmentStatusCode.transferred].indexOf(status) === -1;
            };
            this.isAppointmentInWaiting = function (status) {
                if (typeof (status) === "string") {
                    return status === this.appointmentStatus.waiting;
                }
                return status === this.appointmentStatusCode.waiting;
            };

            this.handleDataSourceError = function (e, dsName) {
                if (!snap.isUnloading) {
                    var errorMessage = dsName + " error. ";
                    if (e.errorThrown === "Unauthorized") {
                        errorMessage = ["You do not have role functions for viewing ", dsName, "."].join("");
                    } else if (e.xhr.readySate !== 4) {
                        errorMessage = ["Cannot read ", dsName, ". Please check your internet connection"].join("");
                    } else if (typeof e.errorThrown != "undefined") {
                        errorMessage = errorMessage + e.errorThrown;
                    }

                    $snapNotification.error(errorMessage);
                }
            }
        }).singleton();
}(jQuery, snap, kendo));
//@ sourceURL=apptSlotsTray.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.EventAggregator", "snap.admin.schedule.TimeUtils", "snap.service.userService", "snap.patient.schedule.patientSelfSchedulingHub"])
        .define("apptsSlotsTray", function ($snapNotification, $eventAggregator, $timeUtils, $userService, $patientSelfSchedulingHub) {
            var defaultCard = {
                slots: []
            };

            var Singleton = (function () {
                var currentUserTime = null;

                getTime();
                setInterval(function () {
                    getTime();
                }, 60000);

                function getTime() {
                    var dfd = $.Deferred();

                    $userService.getUserCurrentTime().done(function (response) {
                        currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                        dfd.resolve();
                    }).fail(function () {
                        $snapNotification.error("Can not get current user time");
                    });

                    return dfd.promise();
                }

                return {
                    getCurrentTime: function () {
                        if (currentUserTime === null) {
                            window.console.error("currentUserTime is null");
                        }

                        return new Date(currentUserTime);
                    },

                    getCurrentDate: function () {
                        var currentDate = this.getCurrentTime();
                        currentDate.setHours(0, 0, 0, 0);

                        return currentDate;
                    },
                };
            })();

            function Tray(clinicianCard, scheduleDate, slotClickCallback) {

                // if(!$patientSelfSchedulingHub.isHubInitiated()) {
                //     $patientSelfSchedulingHub.init();
                // }

                // $patientSelfSchedulingHub.on("lockSlot", function (data, from, to) {
                //     //window.console.log("lockSlot:" + data + " time: " + from );
                // });

                // $patientSelfSchedulingHub.on("unlockSlot", function (data, from, to) {
                //     //window.console.log("unlockSlot:" + data + " time: " + from );
                // });

                // $patientSelfSchedulingHub.on("bookSlot", function (data, from, to) {
                //     //window.console.log("bookSlot:" + data + " time: " + from );
                // });

                // if(!$patientSelfSchedulingHub.isHubInitiated()) {
                //     $patientSelfSchedulingHub.start(
                //         snap.userSession.token,
                //         snap.profileSession.timeZone,
                //         scheduleDate);
                // }



                this.userSelectedDate = new Date(scheduleDate);
                this.userSelectedDate.setHours(0, 0, 0, 0);

                var trayModel = this;

                this.userId = clinicianCard.userId;
                this.slots = clinicianCard.slots.map(function (s) {
                    return new Slot(s, clinicianCard.userId, trayModel.userSelectedDate, slotClickCallback);
                });

                this.vm_slots = function () {
                    var slots = getFilteredSlots(this.slots, this.userSelectedDate);

                    if (slots.length > 0) {
                        var firstSlot = slots[0],
                            currentTime = Singleton.getCurrentTime(),
                            halfOfApptDuration = getHalfOfAppointmentDuration(),
                            nowStart = new Date(firstSlot.from.getTime() - halfOfApptDuration * 60000),
                            nowEnd = new Date(firstSlot.from.getTime() + halfOfApptDuration * 60000);

                        firstSlot.isNow = nowStart < currentTime && currentTime < nowEnd;
                    }

                    var nextDay = getClosestNextSlotDate(this.slots);
                    if (nextDay) {
                        slots.push(kendo.observable(new NextSlot(this.userId, nextDay)));
                    }

                    return slots;
                };

                this.vm_isEmpty = function () {
                    return getFilteredSlots(this.slots, this.userSelectedDate).length === 0;
                };

                this.vm_onNextButtuonClick = function () {
                    snapInfo("Not implemented yet!!!");
                };

                this.vm_getNextApptSlotInfo = function () {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    if (nextDay) {
                        return "Next Self-Scheduling available <b>" + kendo.toString(nextDay, "MMMM dd, yyyy") + "</b>";
                    }

                    return "There is no slots for Self-Scheduling";
                };

                this.vm_goToNextDate = function () {
                    snapInfo("Not implemented yet");
                };

                function getFilteredSlots(slots, userSelectedDate) {
                    var currentTime = Singleton.getCurrentTime();

                    return slots.filter(function (slot) {
                        return isSlotHasRightTime(slot, currentTime, userSelectedDate);
                    });
                }

                function getClosestNextSlotDate(slots) {
                    var currentDate = trayModel.userSelectedDate;

                    var dates = slots.filter(function (slot) {
                        var slotDate = new Date(slot.from);
                        slotDate.setHours(0, 0, 0, 0);

                        return slotDate > currentDate;
                    }).map(function (slot) {
                        return slot.from;
                    });

                    if (dates.length === 0) {
                        return null;
                    }

                    var minDate = new Date(Math.min.apply(null, dates));
                    minDate.setHours(0, 0, 0, 0);

                    return minDate;
                }

                function isSlotHasRightTime(slot, currentTime, userSelectedDate) {
                    var currentDate = new Date(currentTime);
                    currentDate.setHours(0, 0, 0, 0);

                    var slotDate = new Date(slot.from);
                    slotDate.setHours(0, 0, 0, 0);

                    if (userSelectedDate > currentDate) {
                        return userSelectedDate.getTime() === slotDate.getTime();

                    } else if (userSelectedDate.getTime() === currentDate.getTime()) {
                        var halfOfApptDuration = getHalfOfAppointmentDuration(),
                            maxTimeForSlotScheduling = new Date(slot.from.getTime() + halfOfApptDuration * 60000);

                        return userSelectedDate.getTime() === slotDate.getTime() && maxTimeForSlotScheduling > currentTime;
                    }

                    return false;
                }

                function getHalfOfAppointmentDuration() {
                    return Math.round(parseInt(snap.hospitalSettings.selfScheduledAppointmentDuration) / 2);
                }
            }

            function Slot(slot, clinicianUserId, userSelectedDate, slotClickCallback) {
                this.from = $timeUtils.dateFromSnapDateString(slot.from);
                this.to = $timeUtils.dateFromSnapDateString(slot.to);
                this.availabilityBlockId = slot.availabilityBlockId;

                this.vm_isInvisible = false;
                this.vm_onSlotClick = function () {
                    debugger;
                    slotClickCallback({ clinicianId: clinicianUserId, start: new Date(this.from), end: new Date(this.to), availabilityBlockId: this.availabilityBlockId, isNow: this.isNow });
                    $eventAggregator.published("slotTray_slotClickCallback");
                };

                this.isNow = false;

                this.formatedTime = function () {
                    return this.isNow ? "Now" : kendo.toString(this.from, "t");
                };

                this.hide = function () {
                    this.set("vm_isInvisible", true);
                };

                this.show = function () {
                    this.set("vm_isInvisible", false);
                };
            }

            function NextSlot(userId, nextDate) {
                this.vm_isVisible = true;

                this.formatedTime = function () {
                    return "Next";
                };

                this.vm_onSlotClick = function () {
                    $eventAggregator.published("slotTray_goToDate", {
                        nextDate: nextDate,
                        userId: userId
                    });
                };
            }

            this.createTimeSlotsTray = function (clinicianCard, userSelectedDate, slotClickCallback) {
                var tray = $.extend(true, {}, defaultCard, clinicianCard);
                return kendo.observable(new Tray(tray, userSelectedDate, slotClickCallback || function () { }));
            };
        }).singleton();
}(jQuery, snap, kendo));
(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("userService", function ($http) {
        this.getUserCurrentTime = function () {
            setUserVars();
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time").fail(function () {
                snap.redirectToLogin();
            });
        };

        this.getUserTimeZoneId = function () {
            setUserVars();
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time");
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
//@ sourceURL=patientSelfSchedulingHub.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snap.admin.schedule.TimeUtils", "snap.hub.mainHub", "snap.hub.hubModel"])
        .define("patientSelfSchedulingHub", function ($timeUtils, $mainHub, $hubModel) {
            var scope = this,
                hubListeningDate = null,
                isHubInitiated = false,
                isHubStarted = false;

            var patientSelfSchedulingHub = $.connection.patientSelfSchedulingHub;
            $hubModel._initModel(patientSelfSchedulingHub, this);

            var initEvent = function () {
                patientSelfSchedulingHub.client.lockSlot = function (data, from, to) {
                    scope.triggerEvent("lockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.unlockSlot = function (data, from, to) {
                    scope.triggerEvent("unlockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.bookSlot = function (data, from, to) {
                    scope.triggerEvent("bookSlot", data, from, to);
                };
            };

            this.init = function () {
                if (isHubInitiated) {
                    return;
                }

                isHubInitiated = true; //hub was initiated.

                if (patientSelfSchedulingHub === null || typeof (patientSelfSchedulingHub) === "undefined") {
                    window.console.error("$consulationHub script is not included");
                }

                initEvent();
            };

            this.start = function (token, timeZoneSystemId, dateForListening) {
                if (isHubStarted) {
                    return;
                }
                isHubStarted = true; //hub was started.

                hubListeningDate = dateForListening;

                $.connection.hub.qs = $.connection.hub.qs || {};

                $.connection.hub.qs["Bearer"] = token;
                $.connection.hub.qs["TimeZone"] = timeZoneSystemId;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return $mainHub.start();
            };

            // this.setDateForListening = function(dateForListening) {
            //     $.connection.hub.qs["Date"] = date;
            // }

            this.lockSlot = function (availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.lockSlot(availabilityBlockId, from, to);
            };

            this.unlockSlot = function (availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.unlockSlot(availabilityBlockId, from, to);
            };

            this.bookSlot = function (availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.bookSlot(availabilityBlockId, from, to);
            };

            //Hub listen specific date, this method change date which is currently listening.
            this.changeHubListeningDate = function (dateForListening) {
                hubListeningDate = dateForListening;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return patientSelfSchedulingHub.server.changeDate($timeUtils.dateToString(dateForListening));
            };

            //Hub listen specific date, this method return date which is currently listening.
            this.getHubListeningDate = function () {
                return new Date(hubListeningDate);
            };

            //Hub implemented as singleton because current backend hub implementation do not allow to have several hubs for a single page.
            //this metthod provide information about Hub state, was it initiated or not.
            this.isHubInitiated = function () {
                return isHubInitiated;
            };

            this.isHubStarted = function () {
                return isHubStarted;
            };

            this.markAsStarted = function (value) {
                isHubStarted = !!value;
            };

        }).singleton();
}(jQuery, snap, kendo));

//@ sourceURL=providersSlotsLocator.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snapNotification", "snap.admin.schedule.TimeUtils", "snap.patient.schedule.patientSelfSchedulingHub", "snap.service.userService",
            "snap.hub.mainHub"
        ])
        .define("providersSlotsLocator", function ($snapNotification, $timeUtils, $patientSelfSchedulingHub, $userService, $mainHub) {
            var lockedSlotsList = new SlotList();

            $patientSelfSchedulingHub.on("start", function () {
                window.console.log("patientSelfSchedulingHub started");
            });

            $patientSelfSchedulingHub.on("lockSlot", function (availabilityBlockId, from, to) {
                window.console.log("lockSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.addSlot(convertToSlot(availabilityBlockId, from, to));
            });

            $patientSelfSchedulingHub.on("unlockSlot", function (availabilityBlockId, from, to) {
                window.console.log("unlockSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.removeSlot(convertToSlot(availabilityBlockId, from, to));
            });

            $patientSelfSchedulingHub.on("bookSlot", function (availabilityBlockId, from, to) {
                window.console.log("bookSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.addSlot(convertToSlot(availabilityBlockId, from, to));
            });

            function convertToSlot(availabilityBlockId, from, to) {
                return {
                    from: $timeUtils.dateFromSnapDateString(from),
                    to: $timeUtils.dateFromSnapDateString(to),
                    availabilityBlockId: availabilityBlockId
                };
            }

            function setListeningDate(hubListeningDate) {
                var dfd = $.Deferred();
                if (typeof (hubListeningDate) === "undefined") {
                    hubListeningDate = new Date();
                }
                hubListeningDate.setHours(0, 0, 0, 0);

                if (!$patientSelfSchedulingHub.isHubInitiated()) {
                    $mainHub.register($patientSelfSchedulingHub);

                    $userService.getUserTimeZoneId().done(function (response) {
                        /*  $patientSelfSchedulingHub.start(
                              snap.userSession.token,
                              response.message,
                              hubListeningDate);
                          dfd.resolve();*/

                        $patientSelfSchedulingHub.start(
                            snap.userSession.token,
                            snap.userSession.timeZoneSystemId,
                            hubListeningDate);
                        dfd.resolve();

                    });
                } else if ($patientSelfSchedulingHub.isHubStarted() && $patientSelfSchedulingHub.getHubListeningDate().getTime() !== hubListeningDate.getTime()) {
                    lockedSlotsList.clear();
                    $patientSelfSchedulingHub.changeHubListeningDate(hubListeningDate);
                    dfd.resolve();
                } else {
                    dfd.resolve();
                }
                return dfd.promise();
            }

            function SlotList() {
                var slotsDictionary = {};

                this.addSlot = function (slot) {
                    if (this.findSlot(slot) === null) {
                        if (!(slot.availabilityBlockId in slotsDictionary)) {
                            slotsDictionary[slot.availabilityBlockId] = [];
                        }

                        slotsDictionary[slot.availabilityBlockId].push(slot);
                    }
                };

                this.removeSlot = function (slot) {
                    slot = this.findSlot(slot);
                    if (slot) {
                        var slotindex = slotsDictionary[slot.availabilityBlockId].indexOf(slot);
                        slotsDictionary[slot.availabilityBlockId].splice(slotindex, 1);
                    }
                };

                this.findSlot = function (slot) {
                    if (slot.availabilityBlockId in slotsDictionary) {
                        var blockSlots = slotsDictionary[slot.availabilityBlockId];

                        for (var i = 0; i < blockSlots.length; i++) {
                            if (blockSlots[i].from.getTime() === slot.from.getTime() && blockSlots[i].to.getTime() === slot.to.getTime()) {
                                return blockSlots[i];
                            }
                        }
                    }

                    return null;
                };

                this.clear = function () {
                    slotsDictionary = {};
                };
            }

            function ProvidersSlotsLocator() {
                var uiSlotsList = new SlotList();

                $patientSelfSchedulingHub.on("lockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if (uiSlot) {
                        uiSlot.hide();
                    }
                });

                $patientSelfSchedulingHub.on("unlockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if (uiSlot) {
                        uiSlot.show();
                    }
                });

                $patientSelfSchedulingHub.on("bookSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if (uiSlot) {
                        uiSlot.hide();
                    }
                });

                this.setSlots = function (slots, slotsDate) {
                    uiSlotsList.clear();
                    slots.forEach(function (uiSlot) {
                        uiSlotsList.addSlot(uiSlot);
                    });

                    if ($patientSelfSchedulingHub.getHubListeningDate().getTime() !== slotsDate.getTime()) {
                        setListeningDate(slotsDate);
                    } else {
                        slots.forEach(function (uiSlot) {
                            if (lockedSlotsList.findSlot(uiSlot)) {
                                uiSlot.hide();
                            }
                        });
                    }
                };
            }

            this.setListeningDate = function (hubListeningDate) {
                return setListeningDate(hubListeningDate);
            };

            this.createSlotsLocator = function () {
                return new ProvidersSlotsLocator();
            };
        }).singleton();
}(jQuery, snap));
(function ($, snap) {
    "use strict";

    snap.namespace("snap.common").define("loadingStack", function () {
        function Stack(onPush, onPop) {
            var waitStack = [],
                pushCallback = onPush,
                popCallback = onPop;

            function callIfStackIsEmpty(callback) {
                if (waitStack.length === 0 && callback && typeof (callback.call) !== "undefined") {
                    callback.call();
                }
            }

            this.init = function (onPush, onPop) {
                pushCallback = onPush;
                popCallback = onPop;
            };

            this.push = function () {
                callIfStackIsEmpty(pushCallback);
                waitStack.push({});
            };

            this.pop = function () {
                if (waitStack.length === 0) {
                    return;
                }
                waitStack.pop();
                callIfStackIsEmpty(popCallback);
            };
        }

        this.newStack = function (onPush, onPop) {
            return new Stack(onPush, onPop);
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />

;
(function ($, snap, kendo) {
    "use strict";
    snap.namespace("Snap.Patient")
        .use(["snapNotification", "snapHttp", "snapLoader", "eventaggregator", "snap.DataService.customerDataService", "snap.service.appointmentService",
            "snap.service.availabilityBlockService", "snap.hub.mainHub", "snap.hub.consultationsListingHub", "snap.hub.creditHub", "snap.patient.PatientHeaderViewModel",
            "snap.hub.notificationService",
            "snap.clinician.patientQueue.reEnterConsultationDialog",
            "snap.common.dialogWindow", "snap.common.timer", "snap.patient.patientResponseAddressDialog", "snap.common.utility", "snap.common.overlay"
        ])
        .extend(kendo.observable)
        .define("PatientHomeNewViewModel", function ($snapNotification, $snapHttp, $snapLoader, $eventAggregator, $service, $appointmentService, $availabilityBlockService,
            $mainHub, $consultationsListingHub, $creditHub, $patientHeaderVM, $notificationService,
            $reEnterConsultationDialog,
            $dialogWindow, $timer, $patientResponseAddressDialog, $utility, $overlay) {
            var $scope = this;
            var timer = null;
            var HOUR_LIMIT = 12; // How only new in 12 hours
            var MINUTE_AVAILABLE = 30; // Before 30 minutes and after can start consultation
            var NO_ROOM_MINUTE_AVAILABLE = 5; // Before 5 minutes to start no-room consultations are put to the queue
            var notifyCinicianDialog = null;

            var encounterTypeCode = snap.enums.EncounterTypeCode;

            var hubStart = function () {
                $mainHub.register($consultationsListingHub);
                $consultationsListingHub.on('refreshConsultationsListings', function () {
                    loadData();
                });
                $mainHub.register($creditHub);
                $creditHub.on("onCreditChanged", function () {
                    $scope.checkForCredits();
                });
                $notificationService.on("message", function (messageType, message) {
                    var consultationId = +message;
                    console.debug("Message Type : " + messageType);
                    console.debug("Message value : " + consultationId);
                    if (messageType === "consultation_dropped") {
                        if (snap.consultationSession && typeof consultationId === "number" && snap.consultationSession.consultationId === consultationId) {
                            $snapNotification.info("The consultation expired.");
                            $scope.closePopup();
                            $scope._hasActiveConsultation = false;
                        }
                        return;
                    }
                    if (messageType === "consultation_started") {
                        if (consultationId === $scope.activeConsultationId) {
                            $scope.patientObj.set("isInQueue", false);
                            $scope.patientObj.set("isInProgress", true);
                        } else {
                            var consultationData = $scope.availableConsultation.find(function (item) {
                                return item.consultationId == consultationId
                            });
                            if (consultationData) {
                                // init banner with started consultation
                                consultationData.status = snap.consultationStatus.startedConsultation;
                                $scope._initHomePageBanner(consultationData);
                            } else {
                                // reload consultations to init banner
                                loadData();
                            }
                        }
                        return;

                    }
                    if (messageType === "consultation_ended" && consultationId === $scope.activeConsultationId) {
                        $snapNotification.success("Consultation is ended.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                        }, 500);
                        loadData();
                        return;
                    }
                    if (messageType === "consultation_dismissed" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("This consultation has been dismissed. If you feel this cancellation is in error, please contact your provider.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                        }, 500);
                        loadData();
                        return;
                    }

                    if (messageType === "consultation_fulfilled" && consultationId === $scope.activeConsultationId) {

                        $snapNotification.info("The Provider has marked your consultation as complete.");
                        $scope._hasActiveConsultation = false;
                        $scope.activeConsultationId = null;
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                        }, 500);
                        loadData();
                        return;
                    }
                });
                $mainHub.start();
            };

            function ItemBase(item, appt) {
                this.id = item.account.patientId;
                this.firstName = item.patientName;
                this.lastName = item.lastName;
                this.imgSrc = item.account.profileImagePath || item.account.profileImage || getDefaultProfileImageForPatient();
                this.encounterTypeCode = appt.encounterTypeCode;

                this.isVideoType = false;
                this.isPhoneType = false;
                this.isTextType = false;
                this.isInPersonType = false;

                this._setEncounterType = function (typeCode) {
                    if (typeCode == encounterTypeCode.Video) {
                        this.isVideoType = true;
                    } else if (typeCode == encounterTypeCode.Phone) {
                        this.isPhoneType = true;
                    } else if (typeCode == encounterTypeCode.Text) {
                        this.isTextType = true;
                    } else if (typeCode == encounterTypeCode.InPerson) {
                        this.isInPersonType = true;
                    }
                };

                this._setEncounterType(appt.encounterTypeCode);
            }


            function Item(item, appt) {
                ItemBase.call(this, item, appt);

                this.startTime = appt.startTime;
                this.endTime = appt.endTime;
                this.apptTime = "@ " + GetFormattedTimeFromTimeStamp(this.startTime);
                this.expiryTime = appt.expiryTime;

                this.endWaitTime = "0:0:0";

                this.isInQueue = false;
                this.isInProgress = false;
            }

            function ConsultationItem(item, consultation) {
                ItemBase.call(this, item, consultation);

                this.consultationDateInfo = consultation.consultationDateInfo;
                this.start = new Date(consultation.consultationDateInfo);
                this.apptTime = "@ " + GetFormattedTimeFromTimeStamp(this.consultationDateInfo);

                this.isInProgress = consultation.status === snap.consultationStatus.startedConsultation;
                this.isInQueue = !this.isInProgress;
            }

            this.activeConsultationId = null;

            this.patientObj = null;

            this._hasActiveConsultation = false;
            this.showMoreScheduledBlock = function () {
                return this._hasActiveConsultation || this.scheduledConsultation.length > 0;
            };
            this.isOnDemandLoaded = false;
            this.isScheduledLoaded = false;
            this.isLoading = function () {
                return !(this.get("isOnDemandLoaded") && this.get("isScheduledLoaded"));
            };
            this.isReadyState = false;
            this.isMoreScheduled = false;
            this._updateCreditsVisibility = function () {
                $scope.set("isVisibleApptBadge", $scope.hasCredits && ($scope.isOnDemandAvailable || $scope.isSelfScheduleAvailable || $scope.hasScheduledConsult));
            };
            this.onViewProfileClick = function (e) {
                sessionStorage.setItem('snap_patientId_ref', e.data.patientObj.id);
                location.href = "/Customer/User";

                e.preventDefault();
                return false;
            };
            this.titleScheduled = function () {

                var itemCount = this.get("scheduledConsultation").length - 1;

                if (itemCount < 2) {
                    return ["There is <b>one</b> more appointment today"].join("");
                } else {
                    return ["There are <b>", itemCount, "</b> more appointments today "].join("");
                }
            };
            this.detailsBtn = function (e) {
                e.preventDefault();
                sessionStorage.setItem("snap_tabName_ref", "Scheduled");
                window.location.href = "/Customer/PatientConsultations";
            };
            this.manageAccount = function () {
                window.location.href = "/Customer/Users";
            };
            this.searchProviders = function () {
                window.location.href = "/Customer/Main/#/selfScheduling";
            };
            this.isOnDemandAvailable = false;
            this.isSelfScheduleAvailable = false;
            this.hasCredits = false;
            this.isProviderAvailable = function () {
                $scope.set("isSelfScheduleAvailable", $patientHeaderVM.isSelfScheduleAvailable);
                $scope._updateCreditsVisibility();
            };
            this.callOnDemand = function () {
                if (kendo.support.mobileOS !== false) {
                    //snap.openMobileApp("", function() {
                    $scope.startIntakeForm();
                    //  });
                    return;
                }
                this.startIntakeForm();
            };
            this.startIntakeForm = function () {

                if (kendo.support.browser && kendo.support.browser["edge"] === true) {
                    $snapNotification.info("Microsoft Edge Browser is not curently supported for consultation.Please use Chrome or Firefox.");
                    return;
                }
                window.location.href = "/Customer/Intake/#/ChoosePatient";

            };



            this.IsOpenForBusiness = function () {
                try {
                    $service.getOnDemand().done(function (response) {
                        var data = response.data[0];
                        var onDemandAvailable = false;
                        if (data.providerOnDemandEnabled) {
                            for (var i = 0, l = data.familyMembers.length; i < l; i++) {
                                if (data.familyMembers[i].providerAvailable && data.familyMembers[i].isAuthorized) {
                                    onDemandAvailable = true;
                                    break;
                                }
                            }
                        }
                        $scope.set("isOnDemandAvailable", data.providerOnDemandEnabled && onDemandAvailable);
                        $scope._updateCreditsVisibility();
                    }).fail(function (xhr) {
                        if (xhr.status === 401) {
                            sessionStorage.setItem("snap_logoutError", "outside of Provider operating hours");
                            //  window.location = snap.patientLogin();
                            //  window.location.href = snap.redirctPage;
                            //  window.location.reload(true);
                        } else {
                            $snapNotification.error(xhr.d);
                        }
                    }).always(function () {
                        $scope.set("isOnDemandLoaded", true);
                    });
                } catch (err) {
                    $snapNotification.info("Error getting provider information.");
                    window.console.log(err);
                }
            };
            this.isVisibleApptBadge = false;
            this.availCredits = 0;
            this.availCreditsTxt = "Appointment Credits";
            this.checkForCredits = function () {
                var that = this;
                $service.getPatientCredits(snap.profileSession.profileId).done(function (response) {
                    var credits = response.total;
                    that.hasCredits = credits > 0;
                    if (credits > 0) {
                        that.set("availCredits", credits);
                        that.set("availCreditsTxt", credits === 1 ? "Appointment Credit" : "Appointment Credits");
                    }
                    that._updateCreditsVisibility();
                }).fail(function (xhr, status, error) {
                    console.log("Credit Failure");
                });
            };
            this.closePopup = function () {
                var currentDialog = $('#popup-container').data("kendoWindow");

                if (currentDialog) {
                    currentDialog.close();
                }
            };

            this.checkForReEntryConsultation = function () {
                $service.getActiveConsultations().done(function (response) {
                    var tdata = response.total;

                    if (tdata > 0) {
                        var activeConnection;
                        response.data.forEach(function (connectionModel) {
                            if (connectionModel.status === snap.consultationStatus.startedConsultation && connectionModel.encounterTypeCode === encounterTypeCode.Video) {
                                activeConnection = connectionModel;
                            }
                        });

                        if (activeConnection) {
                            // todo: if audio or chat type, show it in progress? if video type then show dialog
                            if (notifyCinicianDialog === null) {
                                notifyCinicianDialog = $dialogWindow.createNewDialog({
                                    vm: $reEnterConsultationDialog,
                                    container: "#reEnterPopUpContainer",
                                    contentPath: "/content/Customer/reEnterConsultation.html?v=1694"
                                });
                            }

                            notifyCinicianDialog.open({
                                consultationId: activeConnection.consultationId,
                                patientId: activeConnection.patientId,
                                userType: 2,
                                meetingId: activeConnection.meetingId,
                                personId: activeConnection.patientPersonId
                            });
                        }
                    }
                }).fail(function (xhr, status, error) {
                    window.console.error("Consult API failure" + error);
                });
            };
            this.isMoreAvailConsults = false;
            this.availConsults = [];
            this.processAvailableConsultations = function () {
                var schedConsultData = $scope.scheduledConsultation,
                    availConsultData = [];

                //get a list of consults that are available now.
                if (schedConsultData.length > 1) {
                    for (var i = 0; schedConsultData.length - 1 > i; i++) {
                        var schedConsultEnterTime = Math.floor((new Date(schedConsultData[i].startTime).getTime() - $scope.loadTime) / (1000 * 60)) - MINUTE_AVAILABLE;

                        schedConsultEnterTime >= -30 && schedConsultEnterTime <= 0 ? availConsultData.push(schedConsultData[i]) : null;
                    }

                    $scope.set("isMoreAvailConsults", availConsultData.length > 0);
                }

                this.set("availConsults", availConsultData);

                //if more appointments are avialble, show info box

            };

            var startAppointmentExpirationTimer = function (time) {
                if (timer) {
                    timer.stop();
                    timer = null;
                }
                timer = $timer.createTimer({
                    countDown: true,
                    time: time,
                    onTimerTickCallback: function (timerTick) {
                        if (timerTick.original.hours <= 0 && timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                            timer.stop();
                            timer = null;
                            $snapNotification.info("The appointment has expired. Reloading data");
                            loadData();
                        }
                    }
                });
                timer.start();
            };

            this._startTimer = function () {
                $scope.set("isReadyState", false);
                if ($scope.patientObj) {
                    if (timer) {
                        timer.stop();
                        timer = null;
                    }
                    var scheduledTime = new Date($scope.patientObj.startTime);
                    var restTime = Math.floor((scheduledTime.getTime() - $scope.loadTime.getTime()) / 1000);
                    if ($scope.patientObj.encounterTypeCode === encounterTypeCode.Video) {
                        restTime -= MINUTE_AVAILABLE * 60;
                    } else {
                        restTime -= NO_ROOM_MINUTE_AVAILABLE * 60;
                    }
                    if (restTime >= 0) {
                        timer = $timer.createTimer({
                            countDown: true,
                            time: restTime,
                            onTimerTickCallback: function (timerTick) {
                                if (timerTick.original.hours <= 0 && timerTick.original.minutes <= 0 && timerTick.original.seconds <= 0) {
                                    // now can enter appointment
                                    timer.stop();
                                    timer = null;
                                    $scope.set("isReadyState", true);
                                    if ($scope.patientObj.isPhoneType || $scope.patientObj.isTextType) {
                                        $scope.patientObj.set("isInQueue", true);
                                        $scope._goToSchedConsult($scope.nextschedConsult);
                                    }
                                    startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60);
                                } else {
                                    $scope.patientObj.set("endWaitTime", [timerTick.formatted.hours, timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                                }
                            }
                        });
                        timer.start();
                    } else {
                        // appointment is already available
                        $scope.set("isReadyState", true);
                        if ($scope.patientObj.isPhoneType || $scope.patientObj.isTextType) {
                            $scope.patientObj.set("isInQueue", true);
                            $scope._goToSchedConsult($scope.nextschedConsult);
                        }
                        startAppointmentExpirationTimer(2 * MINUTE_AVAILABLE * 60 + restTime);
                    }
                }
            };

            this.loadingConsult = false;

            this.enterSchedConsult = function (e) {
                e.preventDefault();
                this.set("loadingConsult", true);
                this._goToSchedConsult(this.nextschedConsult);
            };
            this.goToSchedConsultInternal = function (data, callback) {
                this._goToSchedConsult(data, true, callback);
            };
            this._goToSchedConsult = function (data, isInternal, callback) {
                var appointmentId = data.appointmentId,
                    participants = data.participants,
                    patientParticipant = null,
                    patientId = data.patientId;

                if (isEmpty(patientId)) {
                    this.set("loadingConsult", false);
                    $snapNotification.error("Patient Loading Error");
                    return;
                }
                $.each(participants, function () {
                    if (this.participantTypeCode === 1) {
                        patientParticipant = this;
                    }
                });
                var personId = patientParticipant.person.id;
                var startTime = data.startTime;
                if (!patientParticipant) {
                    this.set("loadingConsult", false);
                    $snapNotification.error("Patient Loading Error");
                    return;
                }

                if (data.encounterTypeCode === encounterTypeCode.Phone || data.encounterTypeCode === encounterTypeCode.InPerson) {
                    // phone-type consultation is automatically created in api
                    window.setTimeout(function () {
                        $overlay.toggleOverlay();
                        $.connection.hub.qs = {};
                        var hubs = [];
                    }, 2000);

                    if (callback && callback.call) {
                        callback.call();
                    }
                    if (isInternal) {
                        location.href = snap.getPatientHome();
                    }
                } else {
                    $service.createConsultationFromAppointment(personId, appointmentId).then(function (data) {
                        if (data) {
                            var respData = data.data[0];
                            var newConsultationId = respData.consultationId;

                            if (parseInt(newConsultationId) > 0) {

                                $appointmentService.getConsultationById(newConsultationId).done(function (resp) {
                                    if (resp.data && resp.data.length > 0) {
                                        var consultationData = resp.data[0].consultationInfo;
                                        var consultationAmount = consultationData.consultationAmount || 0;
                                        var patientInformation = resp.data[0].patientInformation;
                                        snap.setSnapConsultationSessionData({
                                            consultationId: newConsultationId,
                                            patientId: patientId,
                                            personId: personId,
                                            patientParticipant: patientParticipant,
                                            isScheduled: true,
                                            totalSteps: 3,
                                            currentStep: 0,
                                            consultationAmount: consultationAmount,
                                            patientQueueEntryId: respData.patientQueueEntryId,
                                            meetingId: respData.meetingId
                                        });

                                        if (callback && callback.call) {
                                            callback.call();
                                        }
                                        //  $("link[href*='css/styles.v3.less.dynamic.css']").attr("disabled", "disabled");
                                        window.setTimeout(function () {
                                            $overlay.toggleOverlay();
                                            //alert('hhh');
                                            $.connection.hub.qs = {};
                                            var hubs = [];
                                        }, 2000);
                                        if (snap.hospitalSettings.showCTTOnScheduled) {
                                            //location.href = "/Customer/Intake/#/Confirmation";
                                            location.href = "#/tab/ConsentTreat/CTT/" + newConsultationId;
                                        } else if (snap.hospitalSettings.insuranceBeforeWaiting) {
                                            //location.href = "/Customer/Intake/#/Insurance";
                                            location.href = "#/tab/consultCharge/CTT/" + newConsultationId;
                                        } else if (snap.hospitalSettings.eCommerce && consultationAmount > 0 && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom) {
                                            //location.href = "/Customer/Intake/#/Payment";
                                            location.href = "#/tab/consultCharge/CTT/" + newConsultationId;
                                        } else {
                                            if (kendo.support.mobileOS) {
                                                //  snap.openMobileApp(parseInt(newConsultationId), function() {
                                                sessionStorage.setItem("consultationinitaction", "1");
                                                //location.href = "/Customer/Main/#/Waiting";
                                                location.href = "#/tab/receipt/CTT/" + newConsultationId;
                                                //  });
                                                return;
                                            }
                                            sessionStorage.setItem("consultationinitaction", "1");
                                            //location.href = "/Customer/Main/#/Waiting";
                                            location.href = "#/tab/receipt/CTT/" + newConsultationId;
                                        }
                                    }
                                });


                            }
                        }

                    }, function (error) {
                        $snapNotification.error(error.responseText);
                        if (!isInternal) {
                            $scope.set("loadingConsult", false);
                            loadData();
                        }
                    });
                }
            };

            this._initHomePageBanner = function (consultationData) {
                var isConsultStarted = consultationData.status === snap.consultationStatus.startedConsultation;
                if ($scope._hasActiveConsultation) {
                    if ($scope.patientObj.isInProgress) {
                        // we should not reset banner if there is any consultation in progress
                        return;
                    } else if (!isConsultStarted) {
                        var startDate = new Date(consultationData.consultationDateInfo);
                        if ($scope.patientObj.start <= startDate) {
                            // we should not reset banner if there is earlier or the same time queueing consultation
                            return;
                        }
                    }
                }


                if (timer) {
                    timer.stop();
                    timer = null;
                }
                $service.getPatientProfileDetails(consultationData.patientId, "all").done(function (res) {
                    $scope._hasActiveConsultation = true;
                    $scope.activeConsultationId = consultationData.consultationId;
                    $scope.set("isReadyState", true);

                    var patientObj = res.data[0];
                    patientObj = kendo.observable(new ConsultationItem(patientObj, consultationData));
                    $scope.set("patientObj", patientObj);
                    $scope.trigger("change", { field: "showMoreScheduledBlock" });
                });
            };


            this.availableConsultation = [];
            this.scheduledConsultation = [];
            this.nextschedConsult = null;
            this.hasScheduledConsult = false;
            var loadData = function () {
                $.when($service.getAvailableConsultation(), $service.getScheduledConsultation())
                    .then(function (availableConsultationData, schedDate) {
                        $scope.hasScheduledConsult = false;
                        $scope.loadTime = new Date();
                        var availableConsultData = availableConsultationData[0].data,
                            schedConsultData = schedDate[0].data;

                        if (availableConsultData) {
                            var availableConsultations = [];
                            $.each(availableConsultData, function (index, value) {
                                if (value.encounterTypeCode === encounterTypeCode.Phone) {
                                    $scope._initHomePageBanner(value);
                                } else if (value.status === snap.consultationStatus.startedConsultation && (value.doctorStatus === 0 || value.patientStatus === 4 || value.doctorStatus === 2)) {
                                    return;
                                }

                                availableConsultations.push(value);

                            });

                            $scope.set("availableConsultation", availableConsultations);
                        }



                        //Consultation should not be displayed in both Available and Scheduled lists.
                        //So if consultation in Available list we exclude it from Scheduled list.

                        //Becuase now schedule comes from appointment and available is consulation


                        $.each(schedConsultData, function (index, value) {
                            value.scheduledTime = new Date(value.startTime);
                            value.endTime = new Date(value.endTime);
                            value.expiryTime = Math.floor((value.scheduledTime.getTime() - $scope.loadTime.getTime()) / 1000);
                        });


                        var expDate = new Date();
                        expDate.setTime(expDate.getTime() + (HOUR_LIMIT * 60 * 60 * 1000));
                        schedConsultData = schedConsultData.filter(function (v) {
                            return v.expiryTime < HOUR_LIMIT * 60 * 60;
                        });

                        $scope.set("scheduledConsultation", schedConsultData);
                        $scope.set("isMoreScheduled", schedConsultData.length > 1);


                        //get provider's details for next scheduled appt
                        var nextschedConsult = schedConsultData.length > 0 ? schedConsultData[schedConsultData.length - 1] : null;
                        $scope.set("nextschedConsult", nextschedConsult);

                        if ($scope.nextschedConsult && !$scope._hasActiveConsultation) {
                            $scope.hasScheduledConsult = true;
                            $service.getPatientProfileDetails(nextschedConsult.patientId, "all").then(function (res) {
                                if (!$scope._hasActiveConsultation) {
                                    // need to check again because active consultation might initiate during getPatientProfileDetails request
                                    var patientObj = res.data[0];
                                    patientObj = kendo.observable(new Item(patientObj, nextschedConsult));
                                    $scope.set("patientObj", patientObj);
                                    $scope._startTimer();
                                }

                            });
                        }
                        $scope.processAvailableConsultations();
                        $scope._updateCreditsVisibility();
                        setTimeout(function () {
                            $scope.trigger("change", { field: "showMoreScheduledBlock" });
                        }, 3000);
                    })
                    .always(function () {
                        $scope.set("isScheduledLoaded", true);
                    });
            };

            this.loadData = function () {
                hubStart();
                var that = this;

                if (sessionStorage.getItem("snap_locationWasChecked") === "true") {
                    loadPageDetails();
                } else {
                    $service.isResponseRulesActive().done(function (isActive) {
                        if (isActive.active) {
                            $service.getDefaultPatientProfileDetails("all").done(function (data) {
                                var dialog = $dialogWindow.createNewDialog({
                                    vm: $patientResponseAddressDialog,
                                    container: "#patientResponseAddressPopUpContainer",
                                    contentPath: "schedule/tab-patientResponseAddressDialog.html"
                                });

                                dialog.open({
                                    patientId: snap.profileSession.profileId,
                                    userId: snap.profileSession.profileId,
                                    currentLocation: $utility.getLocationFromPatientProfile(data.data[0]),
                                    imageSource: snap.profileSession.profileImage,
                                    fullName: snap.profileSession.fullName,
                                    firstName: snap.profileSession.firstName
                                    //  patientProfile: data.data[0]
                                }).done(function () {
                                    // If the Window has no set dimensions and is centered before its content is loaded with Ajax, it is probably going to resize after the content is loaded.
                                    // This naturally changes the position of the widget on the screen and it is no longer centered.
                                    dialog.rCenter();
                                });
                            });
                        } else {
                            loadPageDetails();
                            sessionStorage.setItem("snap_locationWasChecked", true);
                        }
                    });

                    $eventAggregator.subscribe("patientResponseDialog_locationConfirmed", function () {
                        loadPageDetails();
                        sessionStorage.setItem("snap_locationWasChecked", true);
                    });
                }


                function loadPageDetails() {
                    loadData();
                    that.IsOpenForBusiness();
                    $patientHeaderVM.isProviderAvailable().done(function () {
                        that.isProviderAvailable()
                    });
                }
            };
        });

}(jQuery, snap, kendo));

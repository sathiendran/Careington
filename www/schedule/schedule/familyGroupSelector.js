/*!
	Autosize 3.0.17
	license: MIT
	http://www.jacklmoore.com/autosize
*/
    document.addEventListener("showkeyboard", function() {

           //alert("showkey");

       }, false);

       document.addEventListener("hidekeyboard", function() {

         // alert("hidekey");

       }, false);
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.autosize = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	var set = typeof Set === 'function' ? new Set() : (function () {
		var list = [];

		return {
			has: function has(key) {
				return Boolean(list.indexOf(key) > -1);
			},
			add: function add(key) {
				list.push(key);
			},
			'delete': function _delete(key) {
				list.splice(list.indexOf(key), 1);
			} };
	})();

	var createEvent = function createEvent(name) {
		return new Event(name);
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function (name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || set.has(ta)) return;

		var heightOffset = null;
		var clientWidth = ta.clientWidth;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;

			resize();
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop });
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			var originalHeight = ta.style.height;
			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = 'auto';

			var endHeight = ta.scrollHeight + heightOffset;

			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				ta.style.height = originalHeight;
				return;
			}

			ta.style.height = endHeight + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var computed = window.getComputedStyle(ta, null);
			var computedHeight = Math.round(parseFloat(computed.height));
			var styleHeight = Math.round(parseFloat(ta.style.height));

			// The computed height not matching the height set via resize indicates that
			// the max-height has been exceeded, in which case the overflow should be set to visible.
			if (computedHeight !== styleHeight) {
				if (computed.overflowY !== 'visible') {
					changeOverflow('visible');
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
				}
			}

			if (cachedHeight !== computedHeight) {
				cachedHeight = computedHeight;
				var evt = createEvent('autosize:resized');
				ta.dispatchEvent(evt);
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = (function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);
			set['delete'](ta);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});
		}).bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap });

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		set.add(ta);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		init();
	}

	function destroy(ta) {
		if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
		var evt = createEvent('autosize:destroy');
		ta.dispatchEvent(evt);
	}

	function update(ta) {
		if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
		var evt = createEvent('autosize:update');
		ta.dispatchEvent(evt);
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function (el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function (el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	module.exports = autosize;
});
//@ sourceURL=selfSchedulingService.js

(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("selfSchedulingService", function($http) {

        var apptApiUrl = snap.baseUrl + "/api/v2.1/patients/appointments";
        this.getAppointment = function (apptId) {
            return $http.get([apptApiUrl, apptId].join("/"));
        }
         this.addAppointment = function(appt) {
            var path = apptApiUrl;

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(appt),
            });
         };

         this.removeAppointment = function (appointmentId) {
             var path = [apptApiUrl, appointmentId].join("/");

             return $.ajax({
                 type: "DELETE",
                 url: path
             });
         };

        this.updateAppointment = function(appt, apptId) {
            var path = [apptApiUrl, apptId].join("/");

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
                data: {date: date},
            });
        };

        this.getCliniciansCards = function (opt) {
            return $.get(snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", opt);
        };

        this.getFamillyGroup = function(opt){
            return $http.get(snap.baseUrl + "/api/v2.1/patients/authorized-patients", opt);
        };

        this.getFamillyGroupPatient = function(patientId){
            return $http.get([snap.baseUrl + "/api/v2.1/patients/authorized-patients", patientId].join("/"));
        };

        this.getClinicianCard = function (userId, date) {
            return $.get([snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", userId].join("/"), {date: date});
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
//@ sourceURL=patientEnterConsultation.helper.js
;
(function($, snap, kendo, global) {
    "use strict";
    snap.namespace("snap.patient")
        .use(["snapNotification", "eventaggregator", "snap.DataService.customerDataService", "snap.service.appointmentService", "snap.common.utility",
            "snap.enums.ParticipantTypeCodes"])
        .define("patientEnterConsultationHelper", function($snapNotification, $eventAggregator, $service, $appointmentService, $utility,
            $participantTypeCodes) {
            var $encounterTypeCode = snap.resolveObject("snap.enums.EncounterTypeCode"),
                isLoadingConsult = false;

            var getPatientPersonId = function(appointment) {
                if (global.isEmpty(appointment.patientId)) {
                    $snapNotification.error("Appointment patientId is not set");
                    return null;
                }
                var patientParticipant = appointment.participants.find(function(participant) {
                    return participant.participantTypeCode === $participantTypeCodes.patient;
                });
                if (global.isEmpty(patientParticipant)) {
                    $snapNotification.error("Appointment patient is not set");
                    return null;
                }
                return patientParticipant.person.id;
            };

            this.enterConsultation = function(appointment) {
                var dfd = $.Deferred();
                if (isLoadingConsult) {
                    dfd.reject(true);
                } else {
                    isLoadingConsult = true;
                    var personId = getPatientPersonId(appointment);
                    if (global.isEmpty(personId)) {
                        isLoadingConsult = false;
                        dfd.reject();
                    } else {
                        if (appointment.encounterTypeCode === $encounterTypeCode.Phone) {
                            // phone-type consultation is automatically created in api
                            var isHomePage = window.location.href.toLowerCase().indexOf(snap.getPatientHome().toLowerCase()) >= 0;
                            if (!isHomePage) {
                              //  window.location.href = snap.getPatientHome();
                              //  window.location.reload();
                            }
                            dfd.resolve();
                        } else {
                            var appointmentId = appointment.appointmentId;
                            var patientId = appointment.patientId;
                            $service.createConsultationFromAppointment(personId, appointmentId).then(function(createConsultationResp) {
                                if (createConsultationResp) {
                                    var respData = createConsultationResp.data[0];
                                    var newConsultationId = respData.consultationId;

                                    if (parseInt(newConsultationId) > 0) {

                                        $appointmentService.getConsultationById(newConsultationId).done(function(getConsultationResp) {
                                            if (getConsultationResp.data && getConsultationResp.data.length > 0) {
                                                var consultationData = getConsultationResp.data[0].consultationInfo;
                                                var patientData = getConsultationResp.data[0].patientInformation;
                                                var consultationAmount = consultationData.consultationAmount || 0;

                                                var dob = new Date(patientData.dob);
                                                var d = new Date();
                                                d.setFullYear(d.getFullYear() - 1);
                                                var isUnder1 = dob > d;

                                                snap.setSnapConsultationSessionData({
                                                    consultationId: newConsultationId,
                                                    appointmentId: appointmentId,
                                                    patientId: patientId,
                                                    personId: personId,
                                                    isScheduled: true,
                                                    totalSteps: 3,
                                                    currentStep: 0,
                                                    consultationAmount: consultationAmount,
                                                    patientQueueEntryId: respData.patientQueueEntryId,
                                                    meetingId: respData.meetingId,
                                                    isUnder1: isUnder1
                                                });

                                                if (isUnder1) {
                                                    // redirect to fill birth history
                                                    location.href = "/patient/Intake/#/IntakeStep/4";
                                                } else if (snap.hospitalSettings.showCTTOnScheduled) {
                                                    location.href = "/patient/Intake/#/Confirmation";
                                                } else if (snap.hospitalSettings.insuranceBeforeWaiting) {
                                                    location.href = "/patient/Intake/#/Insurance";
                                                } else if (snap.hospitalSettings.eCommerce && consultationAmount > 0 && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom) {
                                                    location.href = "/patient/Intake/#/Payment";
                                                } else {
                                                    if (kendo.support.mobileOS) {
                                                      //  snap.openMobileApp(parseInt(newConsultationId), function() {
                                                            sessionStorage.setItem("consultationinitaction", "1");
                                                            location.href = "/patient/Main/#/Waiting";
                                                      //  });
                                                    } else {
                                                        sessionStorage.setItem("consultationinitaction", "1");
                                                        location.href = "/patient/Main/#/Waiting";
                                                    }
                                                }
                                                dfd.resolve();
                                            }
                                        });
                                    }
                                }
                            }, function(xhr) {
                                $snapNotification.error($utility.formatErrorMessage(xhr));
                                isLoadingConsult = false;
                                dfd.reject();
                            });
                        }
                    }
                }

                return dfd.promise();
            };
        });

}(jQuery, snap, kendo, window));

//@ sourceURL=location.helper.js
;
(function($, snap) {
    "use strict";
    snap.namespace("snap.helper")
        .define("locationHelper", function() {

            function AddressLocation(opt) {
                this.countryCode = opt.countryCode || "";
                this.countryName = opt.countryName || "";
                this.regionCode = opt.regionCode || "";
                this.regionName = opt.regionName || "";
            }

            this.encodeLocation = function(locationOpt) {
                if (typeof locationOpt === "string") {
                    // if patient address is provided in string format
                    return {
                        addressText: locationOpt
                    };
                }
                var addressLocation = new AddressLocation(locationOpt);
                if (addressLocation.regionCode) {
                    return {
                        country: addressLocation.countryCode,
                        region: addressLocation.regionCode
                    };
                }
                return {
                    country: addressLocation.countryCode
                };
            };

            this.getEncounterAddressTextFromPatientProfile = function(profile) {
                if (profile.encounterAddressLocation) {
                    return getAddressText(profile.encounterAddressLocation, profile, true);
                } else {
                    return this.getLocalAddressTextFromPatientProfile(profile);
                }
            };

            this.getEncounterAddressLocationFromPatientProfile = function(profile) {
                var locationObj = profile.encounterAddressLocation ? profile.encounterAddressLocation : profile.addressLocation;
                return getLocation(locationObj, profile);
            };

            this.getLocalAddressTextFromPatientProfile = function(profile) {
                return getAddressText(profile.addressLocation, profile);
            };

            this.getLocalAddressLocationFromPatientProfile = function(profile) {
                return getLocation(profile.addressLocation, profile);
            };


            function getAddressText(locationObj, profile, takeFullText) {
                if (locationObj) {
                    if (takeFullText && locationObj.addressText) {
                        return locationObj.addressText;
                    }
                    if (locationObj.state) {
                        return [locationObj.state, locationObj.country].join(", ");
                    } else {
                        return locationObj.country;
                    }
                } else {
                    return profile.address ? profile.address : "";
                }
            }

            function getLocation(locationObj, profile) {
                if (!locationObj) {
                    return profile.address ? profile.address : "";
                }
                return new AddressLocation({
                    countryCode: locationObj.countryCode,
                    countryName: locationObj.country,
                    regionCode: locationObj.stateCode,
                    regionName: locationObj.state
                });
            }
        });

}(jQuery, snap));

(function ($, snap) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snap.service.selfSchedulingService", "snap.common.timeUtils", "snap.common.overlay",
        "snap.patient.patientEnterConsultationHelper"])
        .define("patientAppointmentService", function ($selfSchedulingService, $timeUtils, $overlay, $patientEnterConsultationHelper) {
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
                            snap.util.logToConsole(e);
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
                saveAppt(appt).done(function (appointmentResponse) {
                    if (appt.isNow && $overlay) {
                        var isLoading = true;

                        $overlay.loadOverlay();
                        $overlay.setLoadingIcn("/images/svg-v3/Clipboard-Anim-C.svg");
                        $overlay.toggleOverlay();


                        setTimeout(function(){
                            if(isLoading){
                                $overlay.setLoadingTxt("Sending your appointment information.");
                            }
                        }, 3000);

                        setTimeout(function(){
                            if(isLoading){
                                $overlay.setLoadingTxt("Prepping your consultation room.");
                            }
                        }, 6000);

                        //tony.y: i should not do this, copypaste from \Scripts\pagevm\sharedvm\consultationsListing.viewmodel.js direct violation of DRY principle
                        // TODO: create common service to inject it into this object
                        if (snap.patientPage) {
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
                                    $overlay.setLoadingIcn("/images/svg-v3/Clipboard-Done-C.svg");
                                    $overlay.setLoadingTxt("All set.");

                                    if (appt.encounterTypeCode === snap.enums.EncounterTypeCode.Phone) {
                                        $overlay.setSubTxt("A provider will call you shortly.");
                                    } else {
                                        $overlay.setSubTxt(" ");
                                    }

                                    $patientEnterConsultationHelper.enterConsultation(data).done(function() {
                                        window.setTimeout(function() {
                                            $overlay.toggleOverlay();
                                        }, 2000);
                                    });
                                },
                                error: function () {
                                    snapError("Cannot find appointment.");
                                }
                            });
                        }

                    }
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
}(jQuery, snap));

//@ sourceURL=patientResponseAddressDialog.viewmodel.js

(function ($, snap, global) {
    "use strict";

    snap.namespace("snap.patient")
    .use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.admin.patientRules.ruleService",
            "snap.DataService.customerDataService",
            "snap.helper.locationHelper"
        ])
        .define("patientResponseAddressDialog", function ($snapNotification, $eventAggregator, $ruleService, $customerDataService,  $locationHelper) {
            var dialog = null,
                patientId = null;


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

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                patientId = opt.opt.patientId;

                this.set("currentLocationText", opt.opt.currentLocationText);
                this.set("vm_patientProfileImg", opt.opt.imageSource || global.getDefaultProfileImageForPatient());
                this.set("vm_fullName", opt.opt.fullName);
                this.set("vm_firstName", opt.opt.firstName);

                this.currentLocation = opt.opt.currentLocation;

                var that = this;
                this._loadCountries().done(function() {
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
                this.trigger("change", { field: "vm_saveButtonText"});
            };

            this.loadNonMVVM = function () {
                var that = this;

                $('.search input').on('focus', function() {
                    that.set("vm_isLocationAutocompleteFocused", true);
                });

                $('.search input').on('blur', function(){
                    that.set("vm_isLocationAutocompleteFocused", false);
                });
            };


            /* MVVM properties */

            this.vm_saveButtonText = function() {
                return this.vm_isError ? "Retry?" : "Save";
            };

            this.vm_isRegionsAutocompleteEnable = function() {
                return this.regions.length > 0;
            };

            this.vm_isSelfLocationDialog = function() {
                return patientId === snap.profileSession.profileId;
            };


            /* MVVM actions */

            this.vm_onYesClick = function() {
                this.set("vm_isLoading", true);

                var that = this;

                var locationEncoded = $locationHelper.encodeLocation(this.currentLocation);

                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function(response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", that.currentLocation, addressText);
                });
            };

            this.vm_onNoClick = function() {
            	this.set("isEditMode", true);
            };

            this.vm_onCancelClick = function() {
            	this.set("isEditMode", false);
            };

            this.vm_onSaveClick = function() {
                if(!this._validate()) {
                    this.set("vm_isError", true);
                    this.trigger("change", { field: "vm_saveButtonText"});
                    return false;
                }

                this.set("vm_isError", false);
                this.trigger("change", { field: "vm_saveButtonText"});

                this.set("vm_isLoading", true);

                var selectedLocation = {
                    countryCode: this.selectedCountry.value,
                    countryName: this.selectedCountry.text,
                    regionCode: this.selectedRegion ? this.selectedRegion.value : null,
                    regionName: this.selectedRegion ? this.selectedRegion.text : null
                };
                var locationEncoded = $locationHelper.encodeLocation(selectedLocation);

                var that = this;
                $customerDataService.updatePatientResponseAddress(locationEncoded, patientId).done(function(response) {
                    that.set("vm_isLoading", false);
                    dialog.close();
                    var addressText = response.data[0];
                    $eventAggregator.publish("patientResponseDialog_locationConfirmed", selectedLocation, addressText);
                });
            };

            this.vm_onCountryChange = function() {
                this._loadStatesForSelectedCountry();
            };

            this.vm_onRegionChange = function() {
                this.set("vm_stateError", !this.selectedRegion || !this.selectedRegion.value);
                this.set("vm_isError", this.vm_stateError);
                this.trigger("change", { field: "vm_saveButtonText"});

                this.set("vm_isStateFilled", !this.vm_stateError);
            };



            /* Private methods */

            this._loadCountries = function() {
                var that = this;
                return $customerDataService.getProviderLicensePatientAddressMetaRule().done(function(data){
                    var d = data.data[0].countries.map(function(country) {
                        var obj = {
                            text: $.trim(country.country),
                            value: $.trim(country.countryCode)
                        };

                        if(country.regions) {
                            obj.regions = country.regions.map(function(region) {
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
                    var defaultCountry = d.find(function(el) {
                        return el.value === selectedCountryCode;
                    });
                    defaultCountry = defaultCountry || d[0];
                    that.set("selectedCountry", defaultCountry);
                });
            };

            this._loadStatesForSelectedCountry = function() {
                this.set("regions", []);
                this.set("selectedRegion", null);
                this.set("vm_stateError", false);
                this.set("vm_isStateFilled", false);

                if (this.selectedCountry && this.selectedCountry.value) {
                    this.set("vm_countryError", false);
                    this.set("vm_isError", false);

                    if(this.selectedCountry.regions) {
                        this.set("regions", this.selectedCountry.regions);
                    }
                } else {
                    this.set("vm_countryError", true);
                    this.set("vm_isError", true);
                }

                this.set("vm_isCountryFilled", !this.vm_countryError);

                this.trigger("change", { field: "vm_isRegionsAutocompleteEnable" });
                this.trigger("change", { field: "vm_saveButtonText"});
            };

            this._validate = function() {
                if(!this.selectedCountry || !this.selectedCountry.value) {
                    this.set("vm_countryError", true);
                    return false;
                }

                if(this.vm_isRegionsAutocompleteEnable()) {
                    if(!this.selectedRegion || !this.selectedRegion.value) {
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
                patientProviderLicenseMetaRuleApi = snap.baseUrl + "/api/v2.1/admin/rules/patient-provider-license-meta-rules";

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
//@ sourceURL=appointmentFactory.js

(function ($, snap, kendo, global) {
    "use strict";
    snap.namespace("snap.patient.schedule")
        .use(["snapNotification",
            "snap.common.timeUtils",
            "snap.common.schedule.itemSelector",
            "snap.common.schedule.ScheduleCommon",
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
            "snap.errorHandler",
            "snap.common.navigationHelper"
        ])
        .define("AppointmentFactory", function ($snapNotification, $timeUtils,
            $itemSelector, $scheduleCommon, $eventAggregator,
            $availabilityBlockService, $appointmentService,
            $familyGroupDataSource, $apptsSlotsTray, $selfSchedulingService,
            $patientSelfSchedulingHub, $userService, $providersSlotsLocator, $timer, $customerDataService, $errorHandler, $navigationHelper) {

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

                var defaultPatient = {
                    id: null,
                    name: "Select a Patient",
                    imageSource: "/images/Patient-Male.gif",
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
                this.clinicianImageSource = "/images/Patient-Male.gif";
                this.clinicianFullName = "Select a Provider";

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

                this.isLoading = false;
                this.isError = false;
                this.showFrequencyDetails = false;

                this.isDateAreaInEditMode = false;
                this.vm_primaryConsernId = null;
                this.vm_secondaryConsernId = null;
                this.primaryConcernOtherText = "";
                this.secondaryConcernOtherText = "";
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
                        appointmentTypeCode: $scheduleCommon.appointmentTypeCode.patientScheduled,
                        intakeMetadata: {
                            additionalNotes: this.additionalNotes,
                            concerns: concerns
                        },
                        participants: participants,
                        waiveFee: this.waiveFee,
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
									scope = this;
									// 1 second timeout to prevent css issues
									// so that all styles will apply and conrtols will render
									window.setTimeout(function () {
											scope.set("vm_isLoading", false);
											scope.setInitialFocus();

											scope.trigger("change", { field: "vm_primaryConsernId" });
											scope.trigger("change", { field: "vm_secondaryConsernId" });
									}, 1000);
							};
							this._checkCurrentTime = function() {
									var dfd = $.Deferred();
									if (!this.isReadOnly && !this.vm_isNew()) {
											$userService.getUserCurrentTime().done(function(resp) {
													var userTime = $timeUtils.dateFromSnapDateString(resp.data[0]);
													scope.set("isReadOnly", scope.start < userTime);
													scope.patientsSelector.set("isSelectorLocked", scope.patientsSelector.isSelectorLocked || scope.isReadOnly);
													scope.trigger("change", {field: "vm_dialogTitle"});

													var userDNATime = userTime.setMinutes(userTime.getMinutes() - 30);
													scope.set("isFuture", userDNATime <= scope.end);
													dfd.resolve();
											});
									} else {
											dfd.resolve();
									}
									return dfd.promise();
							}
                this._finishLoading = function () {
                    scope = this;
                    // 1 second timeout to prevent css issues
                    // so that all styles will apply and conrtols will render
                    window.setTimeout(function () {
                        scope.set("vm_isLoading", false);
                        scope.setInitialFocus();

                        scope.trigger("change", { field: "vm_primaryConsernId" });
                        scope.trigger("change", { field: "vm_secondaryConsernId" });
                    }, 1000);
                };
                this._checkCurrentTime = function() {
                    var dfd = $.Deferred();
                    if (!this.isReadOnly && !this.vm_isNew()) {
                        $userService.getUserCurrentTime().done(function(resp) {
                            var userTime = $timeUtils.dateFromSnapDateString(resp.data[0]);
                            scope.set("isReadOnly", scope.start < userTime);
                            scope.patientsSelector.set("isSelectorLocked", scope.patientsSelector.isSelectorLocked || scope.isReadOnly);
                            scope.trigger("change", {field: "vm_dialogTitle"});

                            var userDNATime = userTime.setMinutes(userTime.getMinutes() - 30);
                            scope.set("isFuture", userDNATime <= scope.end);
                            dfd.resolve();
                        });
                    } else {
                        dfd.resolve();
                    }
                    return dfd.promise();
                }
                this.load = function () {
                    scope = this;
                    this._checkCurrentTime().always(function() {
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

                    this.set("vm_isAddNotesExpanded", !!this.additionalNotes.length);

                    this._updateProviderEventTime();

                    this.refreshEncounterType();
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
                    $eventAggregator.subscriber("itemSelector_onProfileClick", function(data) {
                        $navigationHelper.patient.goToPatietProfile({ patientId: data.id });
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

                    var codeSetsDs = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);

                    var patient = scope.patientsSelector.getSelectedItem();
                    if (patient) {
                        if (this.isReadOnly) {
                            this._isPatientLoaded = true;
                            this.set("vm_canShowTimeOffsets", true);
                        } else {
                            // check and refresh the patient
                            if (scope.patientsSelector.vm_isItemsLoading) {
                                scope.patientsSelector.one($itemSelector.events.onDataLoaded, function() {
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

                    if (!this.appointmentId) {
                        this._initDeactivationTimeout();
                    }

                };

                this._checkPatient = function(patient, data) {
                    if (scope.vm_isNew()) {
                        var patientItem = scope.patientsSelector.getItemById(patient.id);
                        if (patientItem) {
                            scope.patientsSelector.selectHandler(patientItem);
                        } else {
                            scope.patientsSelector.selectHandler(scope.patientsSelector.getFirstItem());
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
                    }, function(error) {
                        scope.set("isDisabled", true);
                        scope.trigger("change", { field: "vm_isNotDisabled" });
                        scope.patientsSelector.disableSelectedItem($errorHandler.getProfileDisabledReason(error));
                    }).always(function() {
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
                            $snapNotification.success(that._typeName + " updated successfully");
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
                    this._checkPaymentStatus().done(function(result) {
                        if(result) {
                            $appointmentService.removeAppointment(that.appointmentId).done(function() {
                                dfd.resolve();
                            }).fail(function(error) {
                                dfd.reject(error);
                            });
                        } else {
                            dfd.reject("Consultation is already paid by other user.");
                        }
                    });

                    return dfd;
                };

                this.unlockSlot = function() {
                    this._clearDeactivationTimeout();

                    $patientSelfSchedulingHub.unlockSlot(this.availabilityBlockId, this.start, this.end);
                };

                this._checkPaymentStatus = function() {
                    var dfd = $.Deferred();
                    if(this.consultationId) {
                        $customerDataService.checkPaymentStatus(this.consultationId).done(function (responsePayment) {
                            if (responsePayment.paidByUserId === snap.profileSession.userId)
                            {
                                dfd.resolve(true);
                            }
                            else {
                                dfd.resolve(false);
                            }
                        }).fail(function() {
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
                this.availableTime = "00:00";

                this._startTimer = function () {
                    var that = this;
                    var timer = $timer.createTimer({
                        countDown: true,
                        time: 300,
                        onTimerTickCallback: function (timerTick) {
                            that.set("availableTime", [timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                        }
                    });

                    timer.start();
                };

                this.vm_currentDate = function () {
                    var dateFilter = new Date();
                    dateFilter.setHours(0, 0, 0, 0);

                    return dateFilter;
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
                this.vm_onSubmitClick = function () {
				 //debugger;
                    var that = this;
				//if(that.additionalNotes == ""){
                         var addnotes = $(".consultation-note__textarea").val();
                         that.additionalNotes = addnotes;
                    //}
                    this._dialogChanged = false;
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
                    $eventAggregator.published(fact.closeEvent, this);

                    this.preventDefault(e);
                };

                this.vm_onRemoveClick = function () {
                    this._clearDeactivationTimeout();
                    var that = this;
                    $snapNotification.hideAllConfirmations();
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to remove this appointment?", function () {
                        that.set("isLoading", true);
                        that._dialogChanged = false;

                        that.remove().done(function () {
                            $eventAggregator.published(fact.removedEvent, that);
                            $snapNotification.success("The Appointment was removed successfully");
                        }).fail(function (error) {
                            $snapNotification.error(error);
                            that.set("isError", true);
                        }).always(function () {
                            that.set("isLoading", false);
                        });
                    });
                };

                this.vm_isAddConcernButtonVisible = function () {
                    return !this.isReadOnly && this._secondaryConcernsAvailable && !this.displaySecondaryConcern && this.vm_primaryConsernId !== null;
                };

                this.vm_isSaveBtnVisible = function() {
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
                    if (!scope.isReadOnly) {
                        scope.set("encounterTypeCode", encounterTypeCode);
                        scope.refreshEncounterType();
                        scope._onDataChange();
                    }
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
                    this.set("vm_phoneNumberError", false);
                    this.set("vm_isPhoneNumberFilled", $.trim(this.phoneNumber) !== "");
                    if (this.phoneType !== phoneTypeEnum.other) {
                        this.set("phoneType", phoneTypeEnum.other);
                    }
                    this._onDataChange();
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
                            }
                            else {
                                this.set("phoneNumber", "");
                            }
                        }
                    }
                    catch (exp) {
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
                    this.set("vm_isAddNotesExpanded", !this.vm_isAddNotesExpanded);
                };

                this.vm_onKeyUpAdditionalNotes = function () {
                    this._onDataChange();
                };

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

                    if (!this.vm_isPrimaryConcernOtherSelected() && this.primaryConcernOtherText !== "") {
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

                    if (!this.vm_isSecondaryConcernOtherSelected() && this.secondaryConcernOtherText !== "") {
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
                this.vm_getStartDate = function () {
                    return kendo.toString(this.get("start"), "dddd, MMMM dd, yyyy");
                };


                this.vm_onToggleEditDate = function (e) {
                    if (!this.isDateAreaInEditMode) {
                        $('.js-footer-slider').not('.slick-initialized').slick({
                            infinite: false,
                            variableWidth: true,
                            slidesToShow: 1,
                          //  slidesToScroll: 2,
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
                          //  slidesToScroll: 2,
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
                    this.encounterTypeCode = opt.encounterTypeCode ? opt.encounterTypeCode : encounterTypeCodes.Video;
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
    .use(["snapNotification",
        "snap.EventAggregator",
        "snap.patient.schedule.AppointmentFactory",
        "snap.patient.schedule.patientAppointmentService",
        "snap.service.availabilityBlockService",
        "snap.common.schedule.ScheduleCommon",
        "snap.common.timeUtils",
        "snap.errorHandler",
        "snap.service.selfSchedulingService"])
        .define("appointmentDialog", function ($snapNotification,
            $eventAggregator, $appointmentFactory, $appointmentsService,
             $availabilityBlockService, $scheduleCommon,
             $timeUtils, $errorHandler, $selfSchedulingService) {
            var
                content = null,
                container = "#patientPopUpContainer",
                currentDialog = null;

            var dlg = this;
            function loadContent() {
                var dfd = $.Deferred();

                if (content === null) {
                    $.get("/content/patient/schedule/appointmentDialog.html" + snap.addVersion, function (data) {
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
                    }

                    var $container = $(container);


                    $container.html(content);

                    eventVM.dialogContainer = $container;

                    $eventAggregator.subscriber("apptvm_TimeSlotSelected", function (timeSlot) {
                        eventVM.set("start", timeSlot.start);
                        eventVM.set("end", timeSlot.end);
                        eventVM.set("availabilityBlockId", timeSlot.availabilityBlockId);
                        eventVM.set("isNow", timeSlot.isNow);
                        eventVM.toggleDateArea();
                    });

                    $eventAggregator.subscriber("slotTray_goToDate", function (obj) {
                        var dateFilter = new Date(obj.nextDate);
                        dateFilter.setHours(0, 0, 0, 0);

                        eventVM.setSlotsDate(dateFilter);
                    });

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
                        }

                    }

                    kendo.bind($container, eventVM);
                    currentDialog.viewModel = eventVM;


                    $container.show();

                    currentDialog.kendoWindow.center();
                    currentDialog.kendoWindow.open();
                    eventVM.load();

                    setTimeout(function(){
                        $container.find('.dialogbox-master').addClass("is-visible");
                    }, 100);

                    $container.find(".k-grid-header").css('display', 'none');

                    $(".k-overlay").click(function () {
                        close();
                    });

                    $("#patientPopUpContainer").click(function (e) {
                        var div = eventVM._type + "_editor";

                        if(e.target.id == div){
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
                    setTimeout(function(){
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
                    // Empty is intentional
                });

                return event;
            };

            this.close = function () {
                close();
            };


            this.openNewAppointmentDialog = function (dialogOpt) {
                var dfd = $.Deferred();

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
                        patientProfileId: dialogOpt.patientProfileId ? dialogOpt.patientProfileId : snap.profileSession.profileId
                    };

                    var appt = that.open(result);
                    dfd.resolve(appt);
            }).fail(function () {
                $snapNotification.error("Provider card information is not available");
            });

                return dfd.promise();
            };

            this.openExistedAppointmentDialog = function (apptId, isReadOnly) {
                var dfd = $.Deferred();

                var that = this;

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

                    $selfSchedulingService.getClinicianCard(result.appt.clinicianId, $timeUtils.dateToString($timeUtils.dateFromSnapDateString(result.appt.startTime))).done(function (clinicianResp) {
                        var clinicianCard =  clinicianResp.data[0];
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
                    }).fail(function (error) {
                        if (!result.isReadOnly) {
                            result.isClinicianDisabled = true;
                            result.disableReason = $errorHandler.getProfileDisabledReason(error);
                        }
                    }).always(function () {
                        var appt = that.open(result);
                        dfd.resolve(appt);
                    });
                });

                return dfd.promise();
            };

        }).singleton();
}(jQuery, snap, kendo));
(function ($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("availabilityBlockService", function ($http) {
        var abApiUrl = snap.baseUrl + "/api/v2.1/clinicians/availability-blocks",
            apptApiUrl = snap.baseUrl + "/api/v2.1/clinicians/appointments",
            codeSetsDS,
            codeSetDataSourceWrapper = snap.resolveObject("snap.dataSource.codeSetDataSourceWrapper");

        if (codeSetDataSourceWrapper) {
            codeSetsDS = new snap.dataSource.codeSetDataSourceWrapper(["consultprimaryconcerns", "consultsecondaryconcerns"]);
        }

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

        this.getPatientAppointmentsForPatient = function (patientId, opt) {
            var path = [snap.baseUrl + "/api/v2.1/patients", patientId, "filtered-appointments"].join("/");
            return $http.get(path, opt);
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
                $http.get('/api/v2.1/clinicians/availability-blocks/coverage', filters).done(function (coverageBlocks) {
                    var blocks = extendBlockArrayWithType(coverageBlocks.data, filters.type);
                    dfd.resolve({ data: blocks, total: blocks.length });
                }).fail(function () {
                    dfd.reject();
                });
            } else {
                $.when(
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "onDemand" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "patientScheduled" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "adminScheduled" })),
                     $http.get('/api/v2.1/clinicians/availability-blocks/coverage', $.extend({}, filters, { type: "unavailable" }))
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

        this.saveEncounterDocument = function(encDoc) {
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
        this.getOtherPrimaryConcernId = function () {
            return codeSetsDS.getItemIdByName("primary", snap.hospitalSession.hospitalId, "other (provide details below)");
        };

        this.getOtherSecondaryConcerId = function () {
            return codeSetsDS.getItemIdByName("secondary", snap.hospitalSession.hospitalId, "other (provide details below)")
        }
        this.getPrimaryConcerns = function () {
            var def = $.Deferred();
            this.getOtherPrimaryConcernId().done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "primary",
                        snap.hospitalSession.hospitalId, [
                            "Other (provide details below)"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSource("primary", snap.hospitalSession.hospitalId));
                }
            });

            return def.promise();
        };

        this.getSecondaryConcerns = function () {
            var def = $.Deferred();
            this.getOtherSecondaryConcerId().done(function (codeId) {
                if (codeId !== null) {
                    def.resolve(codeSetsDS.getCodeSetDataSourceReplacingNames(
                        "secondary",
                        snap.hospitalSession.hospitalId, [
                            "Other (provide details below)"
                        ], [{
                            "codeId": codeId,
                            "text": "Other (provide details below)"
                        }]
                    ));
                } else {
                    def.resolve(codeSetsDS.getCodeSetDataSource("secondary", snap.hospitalSession.hospitalId));
                }
            });
            return def.promise();
        };

        /************************ PERSON **************************/
        this.getPatientList = function (providerId, opt) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "patients"].join("/");
            var parameters = opt || {};

            return $http.get(path, parameters);
        };

        this.getClinicianList = function (providerId, opt) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "clinicians"].join("/");
            var parameters = opt || {};

            return $http.get(path, parameters);
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
        this.getClinicianProfile = function (providerId, clinicianId) {
            var path = [snap.baseUrl + "/api/v2.1/providers", providerId, "users", clinicianId, "clinician/person"].join("/");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        };
        this.convertTime = function(opt) {
            var path = snap.baseUrl + "/api/v2.1/convert-time";
            return $http.get(path, opt);
        };
        this.getTimeZones = function() {
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
                   $selfSchedulingService.getFamillyGroup().done(function(resp){

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
//@ sourceURL=endlessScroll.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.common").use([])
        .define("endlessScroll", function () {
            function BaseDynamicList(opt) {
                var isMultiselect = opt.isMultiselect || false,
                    selectedItems = [],
                    allItems = [],
                    currentFilters = {},
                    htmlContainerId = opt.htmlContainerId,
                    scrollableElementClass = opt.scrollableElementClass, // class of scrolling element (optional). if not set htmlContainerId element is supposed to scroll
                    total = 0,
                    pageSize = opt.pageSize ? opt.pageSize : 20;

                var requestDeferred =  $.Deferred().resolve();
                var isLoaded = false;
                var isLoading = false;

                //********************* PUBLIC API ******************
                this.load = function() {
                    var that = this;
                    this._reload();

                    var requestInProgress = false;
                    var scrollableElement = getScrollableElement();
                    scrollableElement.on("scroll", function() {
                        var elementHeight = Math.floor(scrollableElement[0].scrollHeight / allItems.length);
                        var loadAdditionItemHeight = Math.floor(pageSize / 3) * elementHeight;

                        if (scrollableElement.scrollTop() + scrollableElement.innerHeight() >= scrollableElement[0].scrollHeight - loadAdditionItemHeight){
                            if (allItems.length >= total) {
                                return false;
                            }

                            if(requestInProgress) {
                                return false;
                            }

                            requestInProgress = true;
                            that._load(pageSize, allItems.length).always(function() {
                                requestInProgress = false;
                            });
                        }
                    });

                    if(typeof this._concreteListLoadDetails === "function") {
                        this._concreteListLoadDetails(htmlContainerId);
                    }

                    isLoaded = true;
                };

                this.reload = function() {
                    this._reload();
                };

                this.unload = function() {
                    var scrollableElement = getScrollableElement();

                    scrollableElement.off("scroll");

                     if(typeof this._concreteListUnloadDetails === "function") {
                        this._concreteListUnloadDetails(htmlContainerId);
                    }
                };

                function getScrollableElement() {
                    return scrollableElementClass ? $(htmlContainerId).closest(scrollableElementClass) : $(htmlContainerId);
                }

                this.filters = function(filters) {
                    if(filters) {
                        currentFilters = filters;
                    }

                    return currentFilters;
                };

                this.selectAll = function() {
                    var that = this;
                    allItems.forEach(function(item) {
                        that.selectItem(item);
                    });
                };

                this.unselectAll = function() {
                    var that = this;
                    allItems.forEach(function(item) {
                        that.unselectItem(item);
                    });
                };

                this.selectItem = function(item) {
                    if(!isMultiselect) {
                        this._selectAll(false);
                        selectedItems = [item];
                    } else {
                        //Ckeck that item not already selected
                        if(snap.util.findIndex(selectedItems, "id", item.id) < 0) {
                            selectedItems.push(item);
                        }
                    }

                    var vmItem = snap.util.findElement(allItems, "id", item.id);
                    if(vmItem) {
                        this._selectUiElement(vmItem, true);
                    }
                };

                this.unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);

                    if(index >= 0) {
                        selectedItems.splice(index, 1);
                    }

                    var vmItem = snap.util.findElement(allItems, "id", item.id);
                    if(vmItem) {
                        this._selectUiElement(vmItem, false);
                    }
                };

                this.getItemById = function(id) {
                    return snap.util.findElement(allItems, "id", id);
                };

                this.selectItemById = function(id) {
                    var uiItem = snap.util.findElement(allItems, "id", id);

                    if(uiItem) {
                        this.selectItem(uiItem);
                    }
                };

                this.unselectItemById = function(id) {
                    var uiItem = snap.util.findElement(allItems, "id", id);

                    if(uiItem) {
                        this.unselectItem(uiItem);
                    }
                };

                this.getSelectedItems = function() {
                    //clones the array and returns the reference to the new array.
                    return selectedItems.slice();
                };

                this.getVisibleItems = function() {
                    //clones the array and returns the reference to the new array.
                    return allItems.slice();
                };

                this.getHtmlContainerId = function() {
                    return htmlContainerId;
                };

                this.isSelectorLoaded = function() {
                    return isLoaded;
                };

                this.isLoading = function() {
                    return isLoading;
                };
                //********************* PRIVATE API ********************
                this._selectAll = function(isSelected) {
                    var that = this;
                    allItems.forEach(function (item) {
                        that._selectUiElement(item, isSelected);
                    });
                };

                this._load  = function(take, skip) {
                    this._isLoading(true);

                    var that = this;
                    return this._getData(take, skip).done(function(result) {
                        allItems = allItems.concat(result.data);
                        total = result.total;
                        that._isLoading(false);

                        var html = that._renderHtml(result.data);
                        $(htmlContainerId).append(html);

                        selectedItems.forEach(function(item) {
                            that._selectUiElement(item, true);
                        });

                        if(that._updateItemsUI) {
                            that._updateItemsUI(htmlContainerId);
                        }
                    });
                };

                this._reload = function() {
                    if(requestDeferred.state() === "pending") {
                        requestDeferred.reject();
                    }

                    allItems = [];
                    total = 0;
                    $(htmlContainerId).empty();

                    var that = this;
                    requestDeferred = this._load(pageSize, 0).done(function postLoadAction() {
                        if(allItems.length > 0) {
                            if(typeof that._getHeaderHtml === "function") {
                                $(htmlContainerId).prepend(that._getHeaderHtml());
                            }
                        } else {
                            // There is no item, need to show "no item" message.
                            $(htmlContainerId).prepend(that._getItemsNotFoundHtml());
                        }
                    });
                };

                this._renderHtml = function(items) {
                    var template = this._getItemTemplate();

                    var arr = items.map(function(item) {
                        return template(item);
                    });

                    return arr.join("");
                };

                this._isLoading = function(isDataLoading) {
                    isLoading = isDataLoading;
                    var $loader = $(htmlContainerId).siblings();
                    if(isLoading) {
                        $loader.addClass("is-active");
                    } else {
                        $loader.removeClass("is-active");
                    }
                };
            }

            this.getConstcurtor = function() {
                return BaseDynamicList;
            };
        }).singleton();
}(jQuery, snap));
//@ sourceURL=scheduleItemSelector.control.js

(function($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.common.schedule").use(["snapNotification", "snap.EventAggregator", "snap.common.timeUtils", "snap.common.endlessMVVMScroll",
            "snap.common.schedule.ScheduleCommon", "snap.service.availabilityBlockService"
        ])
        .define("itemSelector", function($snapNotification, $eventAggregator, $timeUtils, $endlessMVVMScroll, $scheduleCommon,
            $availabilityBlockService) {

            var itemDefaultValues = {
                id: null,
                name: "Select a Person",
                imageSource: global.getDefaultProfileImageForPatient(),
                info: "For the list",
            };

            this.events = {
                onItemSelected: "onItemSelected",
                onItemClicked: "onItemClicked",
                onSelectorHide: "onSelectorHide",
                onDataLoaded: "onDataLoaded"
            };

            var $scope = this,
                noneReportedMessage = snap.noneReportedMessage;

            this.personType = {
                clinician: "clinician",
                patient: "patient"
            };

            this.containerType = {
                empty: 0,
                provider: 1,
                patient: 2,
                familyGroup: 3
            };

            function Item(item, container) {
                this.id = item.id;
                this.name = item.name;
                this.gender = item.gender || null;
                this.imageSource = item.imageSource ||
                    (item.personType === $scope.personType.clinician ? global.getDefaultProfileImageForClinician(this.gender) :
                        global.getDefaultProfileImageForPatient(this.gender));
                this.info = item.info;
                this.personType = item.personType;
                this.personId = item.personId;
                this.data = item.data;

                this.isDefault = !this.id;
                this.isSelected = !!item.isSelected;
                this.isDisabled = !!item.isDisabled;
                this._disableReason = item._disableReason;

                this.isTimeOffsetsVisible = !!item.isTimeOffsetsVisible;
                this.timeZoneId = null;
                this.timeZoneName = "unknown";

                this.vm_TimeText = item.vm_TimeText || noneReportedMessage;

                this.vm_nodeId = container ? container.getSelectedItemId() : null;

                this._convertedTimeCashe = item._convertedTimeCashe || null;

                this.select = function(val) {
                    this.set("isSelected", val);
                };

                this.refreshState = function() {
                    if (this.isDisabled) {
                        this._refreshTooltip(this._disableReason);
                    }
                };

                this._refreshTooltip = function(reason) {
                    var that = this;

                    if (this.vm_nodeId) {
                        // set zero timeout in order to await re-rendering
                        setTimeout(function() {
                            var targetEl = $("#" + that.vm_nodeId);
                            if (targetEl.length) {
                                var kendoTooltip = targetEl.data("kendoTooltip");
                                if (kendoTooltip) {
                                    kendoTooltip.destroy();
                                }
                                targetEl.kendoTooltip({
                                    position: "top",
                                    content: reason
                                });
                            }
                        });
                    }
                };

                this.disable = function(reason) {
                    this.set("isDisabled", true);
                    this._disableReason = reason || "Profile is unavailable";
                };

                this.getValue = function() {
                    return item;
                };

                this.updateTime = function(startTime, endTime, sourceTimeZoneId, useCahedValue) {
                    var that = this;
                    var dfd = $.Deferred();
                    if (this.isDefault) {
                        dfd.reject();
                    } else {
                        var duration = endTime - startTime;
                        var convertedTimePromise = (useCahedValue && this._convertedTimeCashe) ? dfd.resolve(this._convertedTimeCashe) : this._convertTime(startTime, sourceTimeZoneId);
                        convertedTimePromise.done(function(convertedTime) {
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
                            } else {
                                that.set("vm_TimeText", noneReportedMessage);
                            }
                        }).fail(function() {
                            that.set("vm_TimeText", noneReportedMessage);
                        });
                    }
                    return dfd.promise();
                };

                this._convertTime = function(time, sourceTimeZoneId) {
                    var dfd = $.Deferred();
                    if (!time) {
                        dfd.reject();
                    } else {
                        var opt = {
                            dateTime: $timeUtils.dateToString(time),
                            sourceTimeZoneId: sourceTimeZoneId
                        };
                        if (this.personType === $scope.personType.clinician) {
                            opt.targetUserId = this.id;
                        } else {
                            opt.targetPatientId = this.id;
                        }
                        $availabilityBlockService.convertTime(opt).then(function(resp) {
                            dfd.resolve(resp);
                        }, function() {
                            dfd.reject();
                        });
                    }
                    return dfd.promise();
                };

                this.onViewProfileClick = function(e) {
                    if (!!this.id) {
                        $eventAggregator.published("itemSelector_onProfileClick", {
                            id: this.id,
                            personType: this.personType
                        });
                    }
                    e.preventDefault();
                    return false;
                };

                this.onSelectClick = function() {
                    if (container) {
                        container.onSelectClick(this);
                    }
                };
            }

            function Container(opt) {
                var $container = this;
                opt.onDataLoad = function() {
                    $container.trigger($scope.events.onDataLoaded);
                    $container._refresh();
                };

                $endlessMVVMScroll.getConstructor().call(this, opt);
                $container = this;

                var defaultItem = $.extend(true, {}, itemDefaultValues, opt.defaultItem);

                this.nameFilter = "";
                this.isItemsSelectorVisible = false;
                this.isSelectorLocked = false;
                this.vm_tabindex = opt.tabindex || 1;
                this.selectedItem = null;
                this.htmlContainerId = opt.htmlContainerId;
                this.counterpartFilter = opt.counterpartFilter;
                this.selectWithConfirmation = !!opt.selectWithConfirmation;

                this._reloadOnTypeTimer = null;

                this.vm_listId = opt.htmlContainerId.replace(/^#/, ""); // remove '#' symbol

                this.getSelectedItemId = function() {
                    return this.vm_listId + "_selectedItem";
                };

                this._selectUiElement = function(item, value) {
                    var that = this;
                    var findItem = this.getItemById(item.id);
                    if (findItem) {
                        // update item from allItems collection(if it is visible)
                        findItem.select(value);
                    }
                    item.select(value);
                    if (value) {
                        this.selectedItem = item;
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function() {
                            that._refreshSelectedItem();
                        });
                        this._refresh();
                    }
                };

                this._reloadItems = function(nameFilter) {
                    this.filters({
                        search: nameFilter || ""
                    });
                };

                this.getSelectedItem = function() {
                    return this.selectedItem;
                };

                this._refreshSelectedItem = function(refreshSelectedItems) {
                    this.trigger("change", {
                        field: "vm_getSelectedItemOrDefault"
                    });
                    if (refreshSelectedItems) {
                        this.trigger("change", {
                            field: "vm_getSelectedItems"
                        });
                    }
                };

                this._refresh = function() {
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
                        field: "vm_allItems"
                    });
                };


                /* MVVM */
                this.vm_nameFilterChange = function() {
                    if (this._reloadOnTypeTimer) {
                        window.clearTimeout(this._reloadOnTypeTimer);
                        this._reloadOnTypeTimer = null;
                    }
                    // Postpone data reloading until the end of typing
                    this._reloadOnTypeTimer = window.setTimeout(function() {
                        $container._reloadItems($container.nameFilter);
                    }, 300);
                };

                this.vm_getSelectedItems = function() {
                    return this.selectedItem ? [this.selectedItem] : [];
                };

                this.vm_isItemsListEmpty = function() {
                    var that = this;
                    if (this.selectedItem) {
                        return this.getVisibleItems().filter(function(item) {
                            return item.id !== that.selectedItem.id;
                        }).length === 0;
                    } else {
                        return this.getVisibleItems().length === 0;
                    }
                };

                this.vm_getSelectedItemOrDefault = function() {
                    if (this.selectedItem) {
                        this.selectedItem.set("isSelectorLocked", this.isSelectorLocked);
                        this.selectedItem.refreshState();
                        return this.selectedItem;
                    } else {
                        var def = defaultItem;
                        if (opt.defaultItem) {
                            def = opt.defaultItem;
                        }
                        return kendo.observable(new Item(def));
                    }
                };

                this.vm_openItemsSelector = function(e) {
                    if (e) {
                        e.preventDefault();
                    }
                    if (!this.isSelectorLocked) {
                        var that = this;
                        that.set("isItemsSelectorVisible", true);

                        window.setTimeout(function() {
                            $(".directory.is-active").find(".nameFilterField").focus();
                        }, 500);
                    }
                };

                this.vm_hideItemsSelector = function(e) {
                    e.preventDefault();
                    this.set("isItemsSelectorVisible", false);
                    this.trigger($scope.events.onSelectorHide);
                };


                /* Public methods */

                this.loadSelector = function() {
                    $container = this;
                    if (!this.isSelectorLoaded()) {
                        this.load();
                    } else {
                        this._reloadItems();
                    }
                };

                this.setCounterpartFilter = function(counterpartFilter) {
                    this.counterpartFilter = counterpartFilter;
                    if (this.isSelectorLoaded()) {
                        this._reloadItems();
                    }
                };

                this.isCounterpartFilterSet = function() {
                    return !!this.counterpartFilter;
                };

                this.selectInitialItem = function(item) {
                    var that = this;
                    var observedItem = kendo.observable(new Item(item, this));
                    this.selectedItem = observedItem;
                    this.selectItem(observedItem);
                    this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId).done(function() {
                        that._refreshSelectedItem(true);
                    });
                    this._refreshSelectedItem(true);
                };

                this.onSelectClick = function(item) {
                    if (this.selectWithConfirmation) {
                        this.trigger($scope.events.onItemClicked, item);
                    } else {
                        this.selectHandler(item);
                    }
                };

                this.selectHandler = function(item) {
                    // selectedItem will unselect automatically
                    this.selectItem(item);
                    this.trigger($scope.events.onItemSelected);

                    this.set("isItemsSelectorVisible", false);
                    this.trigger($scope.events.onSelectorHide);
                };

                this.getFirstItem = function() {
                    var items = this.getVisibleItems();
                    return items.length ? items[0] : null;
                };

                this.setEventTime = function(start, end, timeZoneId) {
                    this._startTime = start;
                    this._endTime = end;
                    this._timeZoneId = timeZoneId;
                };

                this.updateEventTime = function(start, end, timeZoneId, useCahedValue) {
                    var that = this;
                    this.setEventTime(start, end, timeZoneId);
                    if (this.selectedItem) {
                        this.selectedItem.updateTime(this._startTime, this._endTime, this._timeZoneId, useCahedValue).done(function() {
                            that._refreshSelectedItem();
                        });
                    }
                };

                this.showTimeOffset = function(value) {
                    if (this.selectedItem) {
                        this.selectedItem.set("isTimeOffsetsVisible", value);
                        this._refreshSelectedItem();
                    }
                };

                this.disableSelectedItem = function(reason) {
                    if (this.selectedItem) {
                        this.selectedItem.disable(reason);
                        this._refreshSelectedItem();
                    }
                };
            }

            function EmptyContainer(opt) {
                Container.call(this, opt);

                this._getData = function() {
                    var promise = $.Deferred();
                    promise.resolve({
                        data: [],
                        total: 0
                    });
                    return promise;
                };
            }

            function ClinicianContainer(opt) {
                Container.call(this, opt);
                this.typeName = "ClinicianContainer";

                this.personType = $scope.personType.clinician;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;

                    filter.roleFunctions = [snap.security.conduct_virtual_consultations];
                    if (this.counterpartFilter) {
                        filter.patient = this.counterpartFilter;
                    }

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getClinicianList(snap.hospitalSession.hospitalId, filter).then(function(clinicians) {
                        var items = clinicians.data.map(function(clinician) {
                            clinician.person.providerId = clinician.providerId;
                            return kendo.observable(new Item({
                                id: clinician.userId,
                                personId: clinician.person.id,
                                name: $scheduleCommon.getFullName(clinician.person),
                                gender: clinician.gender,
                                imageSource: clinician.person.photoUrl || global.getDefaultProfileImageForClinician(clinician.gender),
                                info: $scheduleCommon.getSpeciality(clinician.specialty),
                                data: clinician,
                                personType: that.personType,
                                isSelected: clinician.userId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: clinicians.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Provider list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }

            function PatientContainer(opt) {
                Container.call(this, opt);
                this.typeName = "PatientContainer";

                this.personType = $scope.personType.patient;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;
                    if (this.counterpartFilter) {
                        filter.clinician = this.counterpartFilter;
                    }

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getPatientList(snap.hospitalSession.hospitalId, filter).then(function(patients) {
                        var items = patients.data.map(function(patient) {
                            patient.person.providerId = patient.providerId;
                            return kendo.observable(new Item({
                                id: patient.patientId,
                                personId: patient.person.id,
                                name: $scheduleCommon.getFullName(patient.person),
                                gender: patient.gender,
                                imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(patient.gender),
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                data: patient,
                                personType: that.personType,
                                isSelected: patient.patientId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: patients.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Patients list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }

            function FamilyGroupContainer(opt) {
                Container.call(this, opt);

                this.personType = $scope.personType.patient;

                this._getData = function(take, skip) {
                    var that = this;
                    var filter = this.filters();
                    filter.take = take;
                    filter.skip = skip;
                    if (this.counterpartFilter) {
                        filter.providerPersonId = this.counterpartFilter;
                    }

                    var selectedId = this.selectedItem ? this.selectedItem.id : null;
                    var promise = $.Deferred();

                    $availabilityBlockService.getPatientProfilesForPatient(filter).then(function(patients) {
                        var items = patients.data.map(function(patient) {
                            patient.person.providerId = patient.providerId;
                            return kendo.observable(new Item({
                                id: patient.patientId,
                                personId: patient.person.id,
                                name: $scheduleCommon.getFullName(patient.person),
                                gender: patient.gender,
                                imageSource: patient.person.photoUrl || global.getDefaultProfileImageForPatient(patient.gender),
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                data: patient,
                                personType: that.personType,
                                isSelected: patient.patientId === selectedId
                            }, that));
                        });
                        promise.resolve({
                            data: items,
                            total: patients.total
                        });

                    }, function(error) {
                        $scheduleCommon.handleDataSourceError(error, "Patients list");
                        promise.reject(error);
                    });

                    return promise;
                };
            }


            this.emptySelector = function(opt) {
                return kendo.observable(new EmptyContainer(opt));
            };

            this.patientsSelector = function(opt) {
                return kendo.observable(new PatientContainer(opt));
            };

            this.cliniciansSelector = function(opt) {
                return kendo.observable(new ClinicianContainer(opt));
            };

            this.familyGroupSelector = function(opt) {
                return kendo.observable(new FamilyGroupContainer(opt));
            };

            this.convertPersonToSelectorItem = function(person, id, personType, gender, speciality) {
                var item = {
                    id: id || null,
                    personId: person.id,
                    name: $scheduleCommon.getFullName(person),
                    gender: gender,
                    imageSource: person.photoUrl,
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
}(jQuery, snap, kendo, window));

//@ sourceURL=apptSlotsTray.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.EventAggregator", "snap.common.timeUtils", "snap.service.userService"])
        .define("apptsSlotsTray", function ($snapNotification, $eventAggregator, $timeUtils, $userService) {
            var defaultCard = {
                slots: []
            };

            var Singleton = (function () {
                var currentUserTime = null;

                getTime();
                setInterval(function() {
                    getTime();
                }, 60000);

                function getTime() {
                    var dfd = $.Deferred();

                    $userService.getUserCurrentTime().done(function(response) {
                        currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                        dfd.resolve();
                    }).fail(function(){
                        $snapNotification.error("Can not get current user time");
                    });

                    return dfd.promise();
                }

                return {
                    getCurrentTime: function () {
                        if(currentUserTime === null) {
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

           function Tray(clinicianCard, scheduleDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                this.userSelectedDate = new Date(scheduleDate);
                this.userSelectedDate.setHours(0, 0, 0, 0);

                var trayModel = this;

                this.userId = clinicianCard.userId;
                this.slots = clinicianCard.slots.map(function(s) {
                    return new Slot(s, clinicianCard.userId, trayModel.userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock);
                });

                this.getSlots = function() {
                    return getFilteredSlots(this.slots, this.userSelectedDate);
                };

                this.vm_slots = function() {
                    var slots =  getFilteredSlots(this.slots, this.userSelectedDate);

                    if(slots.length > 0) {
                        var firstSlot = slots[0],
                            currentTime = Singleton.getCurrentTime(),
                            halfOfApptDuration = getHalfOfAppointmentDuration(),
                            nowStart = new Date(firstSlot.from.getTime() - halfOfApptDuration * 60000),
                            nowEnd = new Date(firstSlot.from.getTime() + halfOfApptDuration * 60000);

                        firstSlot.isNow = nowStart < currentTime && currentTime < nowEnd;
                    }

                    var nextDay = getClosestNextSlotDate(this.slots);
                    if(nextDay) {
                        slots.push(kendo.observable(new NextSlot(this.userId, nextDay)));
                    }

                    return slots;
                };

                this.vm_isEmpty = function() {
                    return getFilteredSlots(this.slots, this.userSelectedDate).length === 0;
                };

                this.vm_hasSlotsForRightNow = function() {
                    var slots = getFilteredSlots(this.slots, this.userSelectedDate).filter(function(slot) {
                        return slot.isNow && slot.vm_isInvisible === false;
                    });

                    return slots.length > 0;
                };

                this.hasSlotForNextDate = function() {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    return nextDay ? true : false;
                };

                // this.vm_onNextButtuonClick = function() {
                //     snapInfo("Not implemented yet!!!");
                // };

                this.vm_getNextApptSlotInfo = function() {
                    var nextDay = getClosestNextSlotDate(this.slots);

                    if(nextDay) {
                        return "Next available appointment on <b>" + kendo.toString(nextDay, "MMMM dd, yyyy") + "</b>";
                    }

                    return "There are no appoinments currently available";
                };

                // this.vm_goToNextDate = function() {
                //     snapInfo("Not implemented yet");
                // };

                function getFilteredSlots(slots, userSelectedDate) {
                    var currentTime = Singleton.getCurrentTime();

                    return slots.filter(function(slot) {
                        return isSlotHasRightTime(slot, currentTime, userSelectedDate);
                    });
                }

                function getClosestNextSlotDate(slots) {
                    var currentDate = trayModel.userSelectedDate;

                    var dates = slots.filter(function(slot) {
                        var slotDate = new Date(slot.from);
                        slotDate.setHours(0, 0, 0, 0);

                        return slotDate > currentDate;
                    }).map(function(slot) {
                        return slot.from;
                    });

                    if(dates.length === 0) {
                        return null;
                    }

                    var minDate = new Date(Math.min.apply(null,dates));
                    minDate.setHours(0, 0, 0, 0);

                    return minDate;
                }

                function isSlotHasRightTime(slot, currentTime, userSelectedDate) {
                    var currentDate = new Date(currentTime);
                    currentDate.setHours(0, 0, 0, 0);

                    var slotDate = new Date(slot.from);
                    slotDate.setHours(0, 0, 0, 0);

                    if(userSelectedDate > currentDate) {
                        return userSelectedDate.getTime() === slotDate.getTime();

                    } else if(userSelectedDate.getTime() === currentDate.getTime()) {
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

            function Slot(slot, clinicianUserId, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                this.from = $timeUtils.dateFromSnapDateString(slot.from);
                this.to = $timeUtils.dateFromSnapDateString(slot.to);
                this.availabilityBlockId = slot.availabilityBlockId;
                this.clinicianUserId = clinicianUserId;

                this.vm_isInvisible = false;
                this.vm_onSlotClick = function () {
                    var that = this;
                    if (this.isNow) {
                        if (kendo.support.mobileOS !== false) {
                          //  snap.openMobileApp("", function () {
                                slotClickCallback({ clinicianId: that.clinicianUserId, start: new Date(that.from), end: new Date(that.to), availabilityBlockId: that.availabilityBlockId, isNow: that.isNow });
                                $eventAggregator.published("slotTray_slotClickCallback");
                          //  });
                            return;
                        }

                    }
                    slotClickCallback({ clinicianId: this.clinicianUserId, start: new Date(this.from), end: new Date(this.to), availabilityBlockId: this.availabilityBlockId, isNow: this.isNow });
                    $eventAggregator.published("slotTray_slotClickCallback");
                };

                this.isNow = false;

                this.formatedTime = function () {
                    if (this.isNow) {
                        return "NOW"
                    } else {
                        var time = kendo.toString(this.from, "t").split(" ");
                        return time[0] + " <span class='drawer-card__timestamp'>"+ time[1] + "</span>"
                    }
                };

                this.hide = function() {
                    this.set("vm_isInvisible", true);

                    if(refreshCardOnSlotLockUnlock) {
                        refreshCardOnSlotLockUnlock();
                    }
                };

                this.show = function() {
                    this.set("vm_isInvisible", false);

                    if(refreshCardOnSlotLockUnlock) {
                        refreshCardOnSlotLockUnlock();
                    }
                };
            }

            function NextSlot(userId, nextDate) {
                this.vm_isVisible = true;

                this.formatedTime = function() {
                    return "NEXT";
                };

                this.vm_onSlotClick = function () {
                    $eventAggregator.published("slotTray_goToDate", {
                        nextDate: nextDate,
                        userId: userId
                    });
                };
            }

            this.createTimeSlotsTray = function (clinicianCard, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock) {
                var tray = $.extend(true, {}, defaultCard, clinicianCard);
                return kendo.observable(new Tray(tray, userSelectedDate, slotClickCallback, refreshCardOnSlotLockUnlock));
            };
        }).singleton();
}(jQuery, snap, kendo));
(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp"]).define("userService", function ($http) {
        this.getUserCurrentTime = function () {
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time").fail(function () {
                snap.redirectToLogin();
            });
        };

        this.getUserTimeZoneId = function() {
            return $http.get(snap.baseUrl + "/api/v2.1/users/current-time");
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
//@ sourceURL=patientSelfSchedulingHub.js

(function($, snap) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snap.common.timeUtils", "snap.hub.mainHub", "snap.hub.hubModel"])
        .define("patientSelfSchedulingHub", function($timeUtils, $mainHub, $hubModel) {
            var scope = this,
                hubListeningDate = null;

            this._name = "patientSelfSchedulingHub";

            var patientSelfSchedulingHub = $.connection.patientSelfSchedulingHub;
            $hubModel._initModel(patientSelfSchedulingHub, this);

            this._initConnection = function(opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (opt) {
                    $.connection.hub.qs["TimeZone"] = opt.timeZoneSystemId;
                    $.connection.hub.qs["Date"] = $timeUtils.dateToString(opt.dateForListening);
                }
            };

            this._initClient = function() {
                patientSelfSchedulingHub.client.lockSlot = function(data, from, to) {
                    scope.triggerEvent("lockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.unlockSlot = function(data, from, to) {
                    scope.triggerEvent("unlockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.bookSlot = function(data, from, to) {
                    scope.triggerEvent("bookSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.onRefreshState = function() {
                    scope.triggerEvent("onRefreshState");
                };
            };

            this.start = function(token, timeZoneSystemId, dateForListening) {
                if (this._isHubStarted) {
                    return;
                }
                this._isHubStarted = true; //hub was started.

                hubListeningDate = dateForListening;

                $.connection.hub.qs = $.connection.hub.qs || {};

                $.connection.hub.qs["Bearer"] = token;
                $.connection.hub.qs["TimeZone"] = timeZoneSystemId;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return $mainHub.start();
            };


            this.lockSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("lockSlot", availabilityBlockId, from, to);
            };

            this.unlockSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("unlockSlot", availabilityBlockId, from, to);
            };

            this.bookSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("bookSlot", availabilityBlockId, from, to);
            };

            //Hub listen specific date, this method change date which is currently listening.
            this.changeHubListeningDate = function(dateForListening) {
                hubListeningDate = dateForListening;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return this._invokeServerFunction("changeDate", $timeUtils.dateToString(dateForListening));
            };

            //Hub listen specific date, this method return date which is currently listening.
            this.getHubListeningDate = function() {
                return new Date(hubListeningDate);
            };

        }).singleton();
}(jQuery, snap));

//@ sourceURL=providersSlotsLocator.js

(function($, snap) {
    "use strict";

     snap.namespace("snap.patient.schedule")
        .use(["snapNotification", "snap.common.timeUtils", "snap.patient.schedule.patientSelfSchedulingHub", "snap.service.userService",
            "snap.hub.mainHub"])
        .define("providersSlotsLocator", function($snapNotification, $timeUtils, $patientSelfSchedulingHub, $userService, $mainHub) {
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
                if(typeof(hubListeningDate) === "undefined") {
                    hubListeningDate = new Date();
                }
                hubListeningDate.setHours(0, 0, 0, 0);

                if(!$patientSelfSchedulingHub.isHubInitialized()) {
                    $mainHub.register($patientSelfSchedulingHub);

                    $userService.getUserTimeZoneId().done(function(response) {
                        $patientSelfSchedulingHub.start(
                            snap.userSession.token,
                            response.message,
                            hubListeningDate);
                        dfd.resolve();
                    });
                } else if($patientSelfSchedulingHub.isHubStarted() && $patientSelfSchedulingHub.getHubListeningDate().getTime() !== hubListeningDate.getTime()) {
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

                this.addSlot = function(slot) {
                    if(this.findSlot(slot) === null) {
                        if (!(slot.availabilityBlockId in slotsDictionary)) {
                            slotsDictionary[slot.availabilityBlockId] = [];
                        }

                        slotsDictionary[slot.availabilityBlockId].push(slot);
                    }
                };

                this.removeSlot = function(slot) {
                    slot = this.findSlot(slot);
                    if(slot) {
                        var slotindex = slotsDictionary[slot.availabilityBlockId].indexOf(slot);
                        slotsDictionary[slot.availabilityBlockId].splice(slotindex, 1);
                    }
                };

                this.findSlot = function(slot) {
                    if (slot.availabilityBlockId in slotsDictionary) {
                        var blockSlots = slotsDictionary[slot.availabilityBlockId];

                        for(var i = 0; i < blockSlots.length; i++) {
                            if(blockSlots[i].from.getTime() === slot.from.getTime() && blockSlots[i].to.getTime() === slot.to.getTime()) {
                                return blockSlots[i];
                            }
                        }
                    }

                    return null;
                };

                this.clear = function() {
                    slotsDictionary = {};
                };
            }

            function ProvidersSlotsLocator() {
                var uiSlotsList = new SlotList();

                $patientSelfSchedulingHub.on("lockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.hide();
                    }
                });

                $patientSelfSchedulingHub.on("unlockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.show();
                    }
                });

                $patientSelfSchedulingHub.on("bookSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.hide();
                    }
                });

                this.setSlots = function(slots, slotsDate) {
                    uiSlotsList.clear();
                    slots.forEach(function(uiSlot) {
                        uiSlotsList.addSlot(uiSlot);
                    });

                    if($patientSelfSchedulingHub.getHubListeningDate().getTime() !== slotsDate.getTime()) {
                        setListeningDate(slotsDate);
                    } else {
                        slots.forEach(function(uiSlot) {
                            if(lockedSlotsList.findSlot(uiSlot)) {
                                uiSlot.hide();
                            }
                        });
                    }
                };
            }

            this.setListeningDate = function(hubListeningDate) {
                return setListeningDate(hubListeningDate);
            };

            this.createSlotsLocator = function() {
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

        this.newStack = function(onPush, onPop) {
            return new Stack(onPush, onPop);
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));
//@ sourceURL=endlessMVVMScroll.js

(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common").use([])
        .define("endlessMVVMScroll", function() {

            function BaseDynamicList(opt) {
                var isMultiselect = opt.isMultiselect || false,
                    selectedItems = [],
                    currentFilters = {},
                    htmlContainerId = opt.htmlContainerId,
                    scrollableElementClass = opt.scrollableElementClass, // class of scrolling element (optional). if not set htmlContainerId element is supposed to scroll
                    total = 0,
                    pageSize = opt.pageSize ? opt.pageSize : 20,
                    scrollableElementMultiChildren = opt.scrollableElementMultiChildren, // flag that scrollable element contains other children except container
                    onDataLoad = opt.onDataLoad, // onDataLoad callback (optional)
                    onDataLoading = opt.onDataLoading; // onDataLoading callback (optional)

                var requestDeferred = $.Deferred().resolve();
                var isLoaded = false;

                this.vm_allItems = [];
                this.vm_noResults = false;
                this.vm_isItemsLoading = false;

                //********************* PUBLIC API ******************
                this.load = function() {
                    var that = this;
                    this._reload();

                    var requestInProgress = false;
                    var scrollableElement = scrollableElementClass ? $(htmlContainerId).closest(scrollableElementClass) : $(htmlContainerId);
                    scrollableElement.scroll(function() {
                        var elementHeight;
                        if (scrollableElementMultiChildren) {
                            var otherChildHeight = scrollableElement[0].scrollHeight - $(htmlContainerId).outerHeight();
                            elementHeight = Math.floor((scrollableElement[0].scrollHeight - otherChildHeight) / that.vm_allItems.length);
                        } else {
                            elementHeight = Math.floor(scrollableElement[0].scrollHeight / that.vm_allItems.length);
                        }
                        var loadAdditionItemHeight = Math.floor(pageSize / 3) * elementHeight;

                        if (scrollableElement.scrollTop() + scrollableElement.innerHeight() >= scrollableElement[0].scrollHeight - loadAdditionItemHeight) {
                            if (that.vm_allItems.length >= total) {
                                return false;
                            }

                            if (requestInProgress) {
                                return false;
                            }

                            requestInProgress = true;
                            that._load(pageSize, that.vm_allItems.length).always(function() {
                                requestInProgress = false;
                            });
                        }
                    });

                    if (typeof this._concreteListLoadDetails === "function") {
                        this._concreteListLoadDetails(htmlContainerId);
                    }

                    isLoaded = true;
                };

                this.filters = function(filters) {
                    if (filters) {
                        currentFilters = filters;
                        this._reload();
                    }

                    return currentFilters;
                };

                this.selectAll = function() {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that.selectItem(item);
                    });
                };

                this.unselectAll = function() {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that.unselectItem(item);
                    });
                };

                this.selectItem = function(item) {
                    if (!isMultiselect) {
                        if (selectedItems.length) {
                            // unselect selected item
                            this.unselectItem(selectedItems[0]);
                        }
                        selectedItems = [item];
                    } else {
                        //Ckeck that item not already selected
                        if (snap.util.findIndex(selectedItems, "id", item.id) < 0) {
                            selectedItems.push(item);
                        }
                    }

                    var vmItem = snap.util.findElement(this.vm_allItems, "id", item.id);
                    if (vmItem) {
                        this._selectUiElement(vmItem, true);
                    }
                };

                this.unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);

                    if (index >= 0) {
                        selectedItems.splice(index, 1);
                    }

                    var vmItem = snap.util.findElement(this.vm_allItems, "id", item.id);
                    if (vmItem) {
                        this._selectUiElement(vmItem, false);
                    }
                };

                this.getItemById = function(id) {
                    return snap.util.findElement(this.vm_allItems, "id", id);
                };

                this.selectItemById = function(id) {
                    var uiItem = snap.util.findElement(this.vm_allItems, "id", id);

                    if (uiItem) {
                        this.selectItem(uiItem);
                    }
                };

                this.unselectItemById = function(id) {
                    var uiItem = snap.util.findElement(this.vm_allItems, "id", id);

                    if (uiItem) {
                        this.unselectItem(uiItem);
                    }
                };

                this.getSelectedItems = function() {
                    //clones the array and returns the reference to the new array.
                    return selectedItems.slice();
                };

                this.getVisibleItems = function() {
                    //clones the array and returns the reference to the new array.
                    return this.vm_allItems.slice();
                };

                this.getHtmlContainerId = function() {
                    return htmlContainerId;
                };

                this.isSelectorLoaded = function() {
                    return isLoaded;
                };

                //********************* PRIVATE API ********************
                this._selectAll = function(isSelected) {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that._selectUiElement(item, isSelected);
                    });
                };

                this._load = function(take, skip) {
                    this.set("vm_isItemsLoading", true);

                    var that = this;

                    if (typeof onDataLoading === "function") {
                        onDataLoading.apply(that);
                    }

                    // we use .done().fail() instead of .then() because .then() returns new promise
                    // but we need an ability to .reject() this promise
                    return this._getData(take, skip).done(function(result) {
                        // We use overrided by kendo push.apply in order to trigger change only once.
                        that.vm_allItems.push.apply(that.vm_allItems, result.data);
                        that.trigger("change", { field: "vm_allItems" });
                        total = result.total;
                        that.set("vm_isItemsLoading", false);

                        if (typeof onDataLoad === "function") {
                            onDataLoad.apply(that);
                        }

                        selectedItems.forEach(function(item) {
                            that._selectUiElement(item, true);
                        });
                    }).fail(function() {
                        that.set("vm_allItems", []);
                    });
                };

                this._reload = function() {
                    if (requestDeferred.state() === "pending") {
                        requestDeferred.reject();
                    }

                    this.vm_allItems = [];
                    total = 0;

                    var that = this;
                    requestDeferred = this._load(pageSize, 0).done(function postLoadAction() {
                        that.set("vm_noResults", that.vm_allItems.length === 0);
                    });
                };
            }

            this.getConstructor = function() {
                return BaseDynamicList;
            };

        }).singleton();
}(jQuery, snap, kendo));


(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue").use(["snapNotification", "snap.common.endlessScroll","snap.common.schedule.ScheduleCommon","snap.service.selfSchedulingService", "snap.DataService.customerDataService", "snap.common.navigationHelper"])
        .define("familyGroupSelector", function ($snapNotification, $endlessScroll, $scheduleCommon, $selfSchedulingService, $customerDataService, $navigationHelper) {
            function FamilyGroupList(opt) {
                var checkboxStateClassName = "is-active";
                var uiElementsIdPrefix = "cs_";

                //****************** Call BASE constructor ********************
                $endlessScroll.getConstcurtor().call(this, opt);

                this._getItemsNotFoundHtml = function() {
                    return $("#noPatientFound").html();
                };

                this._getHeaderHtml = function() {
                    //Implement if necessary.
                    return "";
                };

                this._getItemTemplate = function() {
                    return kendo.template($('#patientSelector_item').html());
                };

                this._getData = function(take, skip) {
                    var filter = this.filters();

                    var requestPayload = {
                        search: filter.search,
                        take: take,
                        skip: skip
                    };

                    var promise = $.Deferred();

                    $selfSchedulingService.getFamillyGroup(requestPayload).done(function(result) {
                        var items = result.data.map(function (patient) {
                            patient.person.providerId = patient.providerId;

                            var firstName = "";
                            if(patient.person && patient.person.name) {
                                firstName = patient.person.name.given;
                            }

                            return {
                                id: patient.patientId,
                                name: $scheduleCommon.getFullName(patient.person),
                                firstName: firstName,
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                personId: patient.person.id,
                                imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                data: patient
                            };
                        });

                        promise.resolve({
                            data: items,
                            total: result.total
                        });
                    }).fail(function(error) {
                        promise.reject(error);
                    });

                    return promise;
                };

                this._selectUiElement = function(item, value) {
                    var $checkbox = $("#" + uiElementsIdPrefix + item.id).find(".checkbox");

                    slectUIElement($checkbox, value);
                };

                this._concreteListLoadDetails = function(htmlContainerId) {
                    var that = this;
                    $(htmlContainerId).on('click', '.js-patient', function() {
                        var id = Number($(this).attr('id').substring(uiElementsIdPrefix.length));

                        if($(this).find(".checkbox").hasClass(checkboxStateClassName)) {
                            that.unselectItemById(id);
                        } else {
                            that.selectItemById(id);
                        }
                    });

                    $(htmlContainerId).on('click', '.js-view-patient-profile', function(e) {
                        e.stopPropagation();
                        var patientId = Number($(this).parent().attr('id').substring(uiElementsIdPrefix.length));

                        $navigationHelper.patient.goToPatietProfile({ patientId: patientId });
                    });
                };

                function slectUIElement($checkbox, value) {
                    if(value) {
                        $checkbox.addClass(checkboxStateClassName);
                    } else {
                        $checkbox.removeClass(checkboxStateClassName);
                    }
                }
            }

            this.createFamilyGroupSelectorSelector = function(opt) {
                return new FamilyGroupList(opt);
            };
        }).singleton();
}(jQuery, snap, kendo));
/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />

; (function ($, snap, kendo) {

    "use strict";
    snap.namespace("snap.common")
         .extend(kendo.observable).define("Session", function () {
             this.getHospitalInformation = function () {
                 var hospitalSetting = sessionStorage.getItem("snap_hospital_session");
                 if (hospitalSetting) {
                     hospitalSetting = JSON.parse(hospitalSetting);
                 }
                 return hospitalSetting;
             };
             this.getUserInformation = function () {
                 var userInformation = sessionStorage.getItem("snap_patientprofile_session");
                 if (userInformation) {
                     userInformation = JSON.parse(userInformation);
                 }
                 return userInformation;
             };

         }).singleton();




    snap.namespace("snap.common")
         .extend(kendo.observable).define("Utility", function () {
             var $scope = this;

             this.removePhoneFormat = function (phoneNumber) {
                 phoneNumber = $.trim(phoneNumber);
                 if (phoneNumber !== null) {
                     var result = phoneNumber.trim().replace(/[^0-9]+/gi, '');
                     var isPlus = false;

                     //if ($.contains(phoneNumber, "+"))
                     if (phoneNumber.indexOf("+") > -1)
                         isPlus = true;
                     if (isPlus)
                         result = "+" + result;

                     return result;
                 }
                 else
                     return '';
             };
             this.getNumbersFromString = function (string) {
                 if (string !== null) {
                     string = $.trim(string);
                     return string.replace(/[^0-9]+/gi, '');
                 }
                 else
                     return string;
             };
             this.formatPhoneNumber=function(phoneNumber) {
                 phoneNumber = $.trim(phoneNumber);
                 var pattern;
                 var result;
                 var isPlus = false;
                 var subSet;

                 if (phoneNumber.indexOf("+") > -1) {
                     isPlus = true;
                 }

                 result = $scope.getNumbersFromString(phoneNumber);

                 if (result.length > 9) {

                     if (result.length == 10) {
                         pattern = /\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
                         subSet = '($1) $2-$3';
                     }
                     else if (result.length == 11) {
                         pattern = /\(?(\d{1})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
                         subSet = '$1($2) $3-$4';
                     }

                     else {
                         pattern = /\(?(\d{2})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;

                         subSet = '$1($2) $3-$4';
                     }

                     result = result.replace(pattern, subSet);

                     if (isPlus)
                         result = "+" + result;

                     return result;
                 }
                 else
                     return phoneNumber;
             }

             this.getNumbersFromString=function(string) {
                 if (string !== null) {
                     string = $.trim(string);
                     return string.replace(/[^0-9]+/gi, '');
                 }
                 else
                     return string;
             }

              this.getPatientDetails = function (patId) {
	            return $.ajax({
	                type: "GET",
	                url: [snap.baseUrl + "/api/v2.1/patients/appointments/self-scheduling/clinicians", clinicianUserId].join("/"),
	                contentType: "application/json; charset=utf-8",
	                dataType: "json",
	                data: {date: date},
	            });
	        };

             this.formatErrorMessage = function(error) {
                if (typeof(error) === "undefined" || error === null) {
                    return "Unknown error";
                }

                var errorMessage;
                if (typeof(error) === 'string') {
                    errorMessage = error;
                } else {
                    if (error.status === 500) {
                        errorMessage = "Internal server error";
                    } else if(error.status === 404) {
                        errorMessage = "Not found";
                    } else if(error.responseText) {
                        errorMessage = error.responseText;
                        try{
                            var parsedMessage = JSON.parse(errorMessage);
                            if(!!parsedMessage.message){
                                errorMessage = parsedMessage.message;
                            }
                        } catch(err){
                            snap.util.logToConsole(err);
                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };
         }).singleton();


    snap.namespace("snap.common").use([
        "snapNotification",
        "snap.DataService.customerDataService"])
    .extend(kendo.observable).define("navigationHelper", function ($snapNotification, $customerDataService) {
        var defaultMessage = "Viewing this profile will exit current page. Do you want to proceed?";
        this.patient = {
            goToPatietProfile: function(opt) {
                if (!opt.patientId) {
                    window.console.warn("navigationHelper: No patientId provided");
                    return;
                }
                var message = opt.message || defaultMessage;

                $snapNotification.confirmationWithCallbacks(message, function () {
                    $customerDataService.getAccountUserProfiles().done(function(data) {

                        var isUserProfile = data.data.filter(function(profile) {
                            return profile.patientId === opt.patientId;
                        }).length > 0;
                        sessionStorage.setItem("snap_patientId_ref", opt.patientId);
                        $(".button__cancel").click();
                        if(isUserProfile) {
                            //window.location = snap.baseUrl +  "/patient/User";
                            window.location.href = "#/tab/healthinfo/"+opt.patientId;
                        } else {
                            //window.location = snap.baseUrl +  "/patient/Dependent";
                             window.location.href = "#/tab/healthinfo/"+opt.patientId;
                        }
                    });
                });
            }
        };

        this.provider = {
            goToStaffProfile: function(opt) {
                if (!opt.userId) {
                    window.console.warn("navigationHelper: No userId provided");
                    return;
                }
                var message = opt.message || defaultMessage,
                    userId = opt.userId;
                if (userId !== snap.profileSession.userId) {
                    // Provider can't view other Providers profiles
                    return;
                }
                if (snap.canAccessSelfStaffProfile()) {
                    $snapNotification.confirmationWithCallbacks(message, function () {
                        window.location.href = "/provider/EditProviderProfile";
                    });
                } else {
                    $snapNotification.info("You don't have permission to view your profile.");
                }
            },
            goToPatietProfile: function(opt) {
                staffViewPatietProfile(opt, false);
            }
        };

        this.admin = {
            goToStaffProfile: function(opt) {
                if (!opt.userId) {
                    window.console.warn("navigationHelper: No userId provided");
                    return;
                }
                var message = opt.message || defaultMessage,
                    userId = opt.userId;
                if (snap.canAccessStaffProfile(userId)) {
                    $snapNotification.confirmationWithCallbacks(message, function () {
                        snap.StaffUserID = userId;
                        sessionStorage.setItem('snap_staffViewEditProfile', snap.StaffUserID);
                        window.location.href = "/Admin/StaffAccount";
                    });
                } else {
                    $snapNotification.info("You don't have permission to view Provider profiles.");
                }
            },
            goToPatietProfile: function(opt) {
                staffViewPatietProfile(opt, true);
            }
        };

        var staffViewPatietProfile = function(opt, isAdmin) {
            if (!opt.patientId) {
                window.console.warn("navigationHelper: No patientId provided");
                return;
            }
            var message = opt.message || defaultMessage,
                patientId = opt.patientId,
                url = isAdmin ? "/Admin/Patient" : "/provider/PatientFile";
            if (snap.canAccessPatientProfile()) {
                $snapNotification.confirmationWithCallbacks(message, function () {
                    sessionStorage.setItem("snap_patientId_ref", patientId);
                    snap.submitForm({
                        url: url,
                        method: "POST"
                    }, {
                        patientId: patientId,
                        token: snap.userSession.token
                    });
                });
            } else {
                $snapNotification.info("You don't have permission to view patient's account");
            }
        };
    }).singleton();
}(jQuery, snap, kendo));

//@ sourceURL=notifyClinician.dialog.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue")
    .use([
            "snapNotification", 
            "snap.EventAggregator", 
            "snap.common.contentLoader", 
            "snap.service.appointmentService", 
            "snap.admin.schedule.TimeUtils", 
            "snap.common.schedule.ScheduleCommon",
            "snap.clinician.patientQueue.clinicianSelector",
            "snap.dataSources.codeSetDataSource"])
        .define("notifyClinicianDialog", function ($snapNotification, $eventAggregator, $contentLoader, $appointmentService, $timeUtils, $scheduleCommon, $clinicianSelector, $codeSetDataSource) {
            var genderEnum = {
                male: "M",
                female: "F"
            };

            var dialog = null;
            var $scope = null;

            var selector = $clinicianSelector.createClinicianSelector({ isMultiselect: true, htmlContainerId: "#forwardTo_ClinicansList" });

            this.successEvent = "patientCard_notificationSent";

            this.vm_showLoader = false;
            this.codeSetsDs = $codeSetDataSource.create(snap.hospitalSession.hospitalId, "appointmentnotificationreason");

            this.selectedClinicians = []; 

            this.consultationId = null;
            this.appointmentId = null;
            this.vm_consultationTime = "";
            this.vm_consultationDate = "";
            this.vm_primaryConsern = "";

            this.vm_patientFulName = "";
            this.vm_patientGender = "";
            this.vm_patientAgeInfo = "";
            this.vm_patientProfileImage = "";
            
            this.vm_clinicianFullName = "";
            this.vm_clinicianProfileImage = "";
            this.vm_clinicianSpeciality = "";

            this.vm_isIncludeAppointmentDetails = false;            

            this.vm_selectedReason = null;
            this.vm_nameFilter = "";
            this.vm_selectedGroup = null;

            this.vm_autocompleteSelectedProvider = null;

            this.vm_NotificationreasonMissied = false;

            this.vm_onReasonSelect = function() {
                this.set("vm_NotificationReasonMissied", false);
            };

            this.vm_isNoProviderSelected = function() {
                return this.selectedClinicians.length === 0;
            };

            this.vm_isAnyProviderSelected = function() {
                return this.selectedClinicians.length > 0;
            };

            this.vm_onClinicianSelectorOpenClick = function() {
                this.set("vm_isClinicianSelectorActive", true);

                selector.unselectAll();
                this.selectedClinicians.forEach(function(provider) {
                    selector.selectItem(provider);
                });

                selector.refreshHeader();
            };

            this.vm_onDoneWithItemSelectionClick = function() {
                this.set("vm_isClinicianSelectorActive", false); 

                this.selectedClinicians = selector.getSelectedItems();
                this._triggerSelectedProvidersListChange();                
            };

            this.vm_onPatientProfileImageError = function() {
                var defautProfileImage = "/images/default-user.jpg";
                if(this.vm_patientGender === genderEnum.female) {
                    defautProfileImage = "/images/Patient-Female.gif";
                } else if(this.vm_patientGender === genderEnum.male) {
                    defautProfileImage = "/images/Patient-Male.gif";
                }

                return "this.onerror=null;this.src= '" + defautProfileImage +  "'";
            };
            
            this.setOptions = function(opt) {
                dialog = opt.dialog;
                $scope = this;
                this._setGeneralInfo(opt.opt);

                this.set("vm_selectedReason", null);

                this.set("vm_nameFilter", "");
                this.set("vm_selectedGroup", null);
                this.set("vm_NotificationReasonMissied", false);

                if(!selector.isSelectorLoaded()) {
                    selector.load();    
                } else {
                    this._reloadProviderSelector();

                    this.set("vm_isClinicianSelectorActive", false); 
                    this.selectedClinicians = [];
                    this._triggerSelectedProvidersListChange();
                }
            };

            this.vm_onCloseClick = function (e) {
                e.preventDefault();

                dialog.close();
            };

            this.vm_onSendClick = function() {
                if(this.vm_selectedReason === null) {
                    this.set("vm_NotificationReasonMissied", true);
                    $snapNotification.error("Please select a reason.");
                    return;
                }


                var users = this.selectedClinicians.map(function(item) {
                    return {
                        userId: item.id,
                        email: item.email
                    };
                });

                var notificationObject = {
                    appointmentId: this.appointmentId,
                    notifiedPersons: this.selectedClinicians.map(function(clinician) {
                        return clinician.name;
                    })
                };

                this.set("vm_showLoader", true);

                var that = this;
                $appointmentService.notifyProviders(this.appointmentId, {
                    includeAppointmentDetails: this.vm_isIncludeAppointmentDetails,
                    reasonCodeId: this.vm_selectedReason,
                    users: users
                }).done(function() {
                    dialog.close();
                    $snapNotification.success("Notification was sent successfully");
                    $eventAggregator.publish("patientCard_notificationSent", notificationObject);

                }).fail(function(){
                    $snapNotification.error("Cannot send notification.");
                }).always(function() {
                    that.set("vm_showLoader", false);
                });
            };

            this.cliniciansGroupsDS = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/v2/clinicians/groups",
                        dataType: "json",
                        contentType: 'application/json',
                        type: "get"
                    }
                },
                error: function (e) {
                    var errorMessage = "provider groups list error. ";
                    if (e.errorThrown === "Unauthorized") {
                        errorMessage = "You do not have role functions for viewing provider groups.";
                    } else if (typeof e.errorThrown != "undefined") {
                        errorMessage = errorMessage + e.errorThrown;
                    }

                    $snapNotification.error(errorMessage);
                },
                schema: {
                    data: function(groups) {
                        var flatGroups = []; 

                        function addGroups(groups, targetArr) {
                            groups.forEach(function(group) {
                                targetArr.push({
                                    name: group.name,
                                    groupId: group.groupId
                                });

                                if(group.subGroups) {
                                    addGroups(group.subGroups, targetArr);
                                }
                            });
                        }

                        addGroups(groups.data, flatGroups);

                        flatGroups.sort(function(a, b) {
                            if (a.name.toLowerCase() < b.name.toLowerCase())
                                return -1;
                            if (a.name.toLowerCase() > b.name.toLowerCase())
                                return 1;
                            return 0;
                        });
                        return flatGroups;
                    },
                    total: "total"
                }
            });

            this.providersDS = new kendo.data.DataSource({
                serverFiltering: true,
                transport: {
                    read: {
                        url: ["/api/v2.1/providers", snap.hospitalSession.hospitalId, "clinicians"].join("/"),
                        dataType: "json",
                        contentType: 'application/json',
                        type: "get"
                    },
                    parameterMap: function (data) {
                        if (data.filter && data.filter.filters && data.filter.filters.length > 0) {
                            data.search =  data.filter.filters[0].value;
                        }

                        delete data.filter;

                        return data;
                    }
                },
                error: function (e) {
                    var errorMessage = "Provider list error. ";
                    if (e.errorThrown === "Unauthorized") {
                        errorMessage = "You do not have role functions for viewing Provider list.";
                    } else if (typeof e.errorThrown != "undefined") {
                        errorMessage = errorMessage + e.errorThrown;
                    }

                    $snapNotification.error(errorMessage);
                },
                schema: {
                    data: function (clinicians) {
                        var data = clinicians.data.map(function (clinician) {
                            var item =  {
                                id: clinician.userId,
                                name: $scheduleCommon.getFullName(clinician.person),
                                email: clinician.email,
                                data: clinician,
                                profileImage: clinician.person.photoUrl || getDefaultProfileImageForClinician()
                            };

                            item.vm_isSelected = snap.util.findIndex($scope.selectedClinicians, "id", item.id) >= 0;
                            item.isProviderView = $scope._isProviderView;

                            return item;
                        });

                        return data;
                    },
                    total: "total",
                }
            });

            this.vm_onSelectedGroupChange = function() {
               this._reloadProviderSelector();
            };

            var searchTimeout = null;
            this.vm_nameFilterChange = function () {
                if (!!searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                
                var that = this;
                searchTimeout = setTimeout(function () {
                    if(selector.filters().search !== that.vm_nameFilter) {
                        that._reloadProviderSelector();
                    }
                }, 500);
            };

            this.vm_autocompleteSelectProvider = function(e) {
                // If some walue was selected we have it id.
                if(this.vm_autocompleteSelectedProvider.id && snap.util.findIndex(this.selectedClinicians, "id", this.vm_autocompleteSelectedProvider.id) < 0) {
                    this.selectedClinicians.push({
                        id: this.vm_autocompleteSelectedProvider.id,
                        name: this.vm_autocompleteSelectedProvider.name,
                        email: this.vm_autocompleteSelectedProvider.email,
                    });
                    this._triggerSelectedProvidersListChange();
                } 

                //If user enter some email we will have it value in vm_autocompleteSelectedProvider variable.
                if(typeof this.vm_autocompleteSelectedProvider === 'string') {
                    if(window.validateEmail(this.vm_autocompleteSelectedProvider)) {
                        this.selectedClinicians.push({
                            id: null,
                            name: this.vm_autocompleteSelectedProvider,
                            email: this.vm_autocompleteSelectedProvider
                        });
                        this._triggerSelectedProvidersListChange();
                    } else {
                        //$snapNotification.error("Invalid email");
                    }
                }
                    
                this.set("vm_autocompleteSelectedProvider", null);
            };

            this.vm_autocompleteFiltering = function(e) {
                var filter = e.filter;

                if (!filter.value) {
                    //prevent filtering if the filter does not have value
                    e.preventDefault();
                }
            };

            this.vm_onPatientViewProfileClick = function() {
                if (this._patientId) {
                    var url = this._isProviderView ? "/Physician/PatientFile" : "/Admin/Patient";
                    sessionStorage.setItem("snap_patientId_ref", this._patientId);
                    snap.submitForm({
                        url: url,
                        method: "POST"
                    }, {
                        patientId: this._patientId,
                        token: snap.userSession.token
                    });
                }
            };

            this.vm_onProviderViewProfileClick = function(e) {
                if (this._isProviderView) {
                    return;
                }
                var staffId = e.data ? e.data.id : null;
                if (staffId) {
                    sessionStorage.setItem("snap_staffViewEditProfile", staffId);
                    location.href = "/Admin/StaffAccount";
                }
            };

            this.vm_onViewSelfProfileClick = function() {
                if (this._clinicianUserId) {
                    var url = this._isProviderView ? "/Physician/EditPhysicianProfile" : "/Admin/StaffAccount";
                    sessionStorage.setItem("snap_staffViewEditProfile", this._clinicianUserId);
                    location.href = url;
                }
            };

            this._setGeneralInfo = function(data) {
                this.set("vm_isIncludeAppointmentDetails", false);
                this.set("vm_isApptHasClinician", false);
                this._userType = data.userType;
                this._isProviderView = this._userType === $scheduleCommon.userType.clinician;

                // 1.Patient Profile details
                var patientProfile = data.patientProfile;
                this._patientId = patientProfile.patientId;
                this.set("vm_patientFulName", patientProfile.fullName);
                this.set("vm_patientGender", patientProfile.gender === "F" ? "Female" : "Male");
                this.set("vm_patientAgeInfo", patientProfile.ageInfo);
                this.set("vm_patientAddressInfo", formatAddress(patientProfile.state, patientProfile.country));
                this.set("vm_patientProfileImage", patientProfile.profileImage || getDefaultProfileImageForPatient(patientProfile.gender));
                this.trigger("change", { field: "vm_onPatientProfileImageError" });


                // 2.Clinician Profile Details. Clinician profile could be null in case of On-Demand appointment because clinician not assigned.
                if(data.clinicianProfile) {
                    var clinicianProfile = data.clinicianProfile;
                    this._clinicianUserId = clinicianProfile.userId;
                    this.set("vm_clinicianFullName", "Dr. " + clinicianProfile.fullName);
                    this.set("vm_clinicianProfileImage", clinicianProfile.profileImage);
                    this.set("vm_clinicianSpeciality", formatmedicalSpecialities(clinicianProfile.medicalSpeciality, clinicianProfile.subSpeciality));

                    this.set("vm_isApptHasClinician", true);
                }

                // 3.Consulttaion Details
                var consultationDetails = data.consultationDetails;
                this.consultationId = consultationDetails.consultationId;
                this.appointmentId = consultationDetails.appointmentId;
                this.set("vm_primaryConsern", consultationDetails.primaryConsern);
                this.set("vm_primaryConsernFormatted", formatConcerns(consultationDetails.primaryConsern, "Primary Concern"));
                this.set("vm_secondaryConsernFormatted", formatConcerns(consultationDetails.secondaryConsern, "Secondary Concern"));
                this.set("vm_additionNotesFormatted", formatConcerns(consultationDetails.additionNotes, "Additional Notes"));
                this.set("appointmentType", consultationDetails.appointmentType);
                this.trigger("change", { field: "vm_isAdminScheduled" });
                this.trigger("change", { field: "vm_isOnDemand" });
                this.trigger("change", { field: "vm_isPatientScheduled" });


                var consultationTimeInfo = $timeUtils.dateFromSnapDateString(consultationDetails.consultationTimeInfo);

                this.set("vm_consultationTime", "<span>" + kendo.toString(consultationTimeInfo, "h:mm") + "</span> " +  kendo.toString(consultationTimeInfo, "tt"));
                this.set("vm_consultationDate",  kendo.toString(consultationTimeInfo, "dddd, MMMM dd, yyyy"));
            };

            this.vm_isAdminScheduled = function() {
                return this.appointmentType === 1;
            };

            this.vm_isOnDemand = function() {
                return this.appointmentType === 2;
            };

            this.vm_isPatientScheduled = function() {
                return this.appointmentType === 3;
            };

            function formatConcerns(text, name) {
                if(typeof(text) === "undefined" || text === null || text === "") {
                    text =  "N/A";
                }

                return ["<span>", name, "</span>", text.replace(/^\d+\?/, "")].join("");
            }

            function formatmedicalSpecialities(primary, secondary) {
                var speciality = primary;
                if(secondary && secondary !== "") {
                    speciality  += " | " + secondary;
                }

                return speciality;
            }

            function formatAddress(state, country) {
                var address = (state && state.length) ? state : "";
                if (country && country.length) {
                    address += address.length ? " • " : "";
                    address += country;
                }
                return address.length ? "• " + address : "N/A";
            }

            this._setDetails = function() {
                //ToDo: implement if necessary
            };

            this._reloadProviderSelector = function() {
                var filters = {
                    nameFilter: this.vm_nameFilter,
                    groupFilter: this.vm_selectedGroup
                };

                console.log(filters);

                selector.filters(filters);
            };

            this._triggerSelectedProvidersListChange = function() {
                this.trigger("change", { field: "vm_isAnyProviderSelected" });
                this.trigger("change", { field: "vm_isNoProviderSelected" });

                var providers = this.selectedClinicians;
                var groups = selector.getGroups();

                var that = this;
                var vmItems = [];
                var allProvidersInAllGroups = {};
                groups.forEach(function iterator(group) {
                    if(snap.util.arrayContains(providers, group.providers, "id")) {
                        vmItems.push(
                            new SelectedItem(
                                group, 
                                function unselectHandler(group) {
                                    group.data.providers.forEach(function(provider) {
                                        unselectProvider(provider);
                                    });

                                    that._triggerSelectedProvidersListChange();
                                }
                            )
                        );

                        group.providers.forEach(function(provider) {
                            allProvidersInAllGroups[provider.id] = provider;
                        });
                    }
                });

                providers.forEach(function(provider) {
                    if(typeof(allProvidersInAllGroups[provider.id]) === "undefined") {
                        vmItems.push(new SelectedItem(
                            provider,
                             function unselectHandler(provider) {
                                unselectProvider(provider);
                                that._triggerSelectedProvidersListChange();
                            }
                        ));
                    }
                });

                this.set("vm_selectedItems", vmItems);

                function unselectProvider(provider) {
                    var index = snap.util.findIndex(that.selectedClinicians, "id", provider.id);

                    if(index >= 0) {
                        that.selectedClinicians.splice(index, 1);
                    }
                }
            };

            function SelectedItem(item, unselectHandler) {
                this.id = item.id;
                this.name = item.name;
                this.data = item;

                this.vm_onUnselectClick = function() {
                    unselectHandler(this);
                };
            }

        }).singleton();
}(jQuery, snap, kendo)); 
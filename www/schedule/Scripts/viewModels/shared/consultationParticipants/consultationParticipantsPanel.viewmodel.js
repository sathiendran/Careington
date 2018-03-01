//@ sourceURL=consultationParticipants.viewmodel.js

(function ($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.shared.consultationParticipants").use(["snapNotification",
        "eventaggregator",
        "snapHttp",
        "snap.hub.ConsultationHub",
        "snap.enums.screenTypes",
        "snap.enums.ParticipantStatusCodes",
        "snap.common.providerSelector",
        "snap.common.patientSelector",
        "snap.enums.ParticipantTypeCodes",
        "snap.shared.consultationParticipants.participantsService",
        ])
        .extend(kendo.observable)
        .define("consultationParticipantsPanel", function(
                $snapNotification, 
                $eventaggregator, 
                $snapHttp, 
                $consultationHub, 
                $screenTypes, 
                $participantStatusCodes, 
                $providerSelector, 
                $patientSelector, 
                $participantTypeCodes, 
                $participantsService) {
            var context = null,
                $scope = this,
                $consultationContext = null;


            var messages = {
                participantLimitReached: "You’ve reached the participant limit — a maximum of six people can participate at once in a consultation.",
                inviteText: "Invite"
            };

            var providerSelector = null;
            var patientSelector = null;

            var searchTimeout = null;

            var participantTab = {
                provider: "provider",
                patient: "patient"
            };

            var currentTab = participantTab.provider;

            var userGroupFilters = $participantsService.userGroupFilters;
            
            $eventaggregator.subscriber("pp_resendGuestInvitation", function(participantId) {
                var participantsAttachedToConsultationCount = $scope._getNotUsedRemainedInvitationCount();

                if(participantsAttachedToConsultationCount <= 0) {
                    $snapNotification.info(messages.participantLimitReached);
                    return;
                }

                $scope._sendInvitationEmail(participantId).then(function () {
                    $scope.setParticipants($scope.participants);
                }).fail(function (xhr) {
                    if (xhr.status === 403) {
                        $snapNotification.error(xhr.statusText);
                    } else {
                        $snapNotification.error("There is problem sending invitation");
                    }
                });
            });

            this.patientConnectionStatus = null;
            this.isPatientInfoInVisible = true;
            this.participants = [];

            this.providerGroupsDS = new kendo.data.DataSource({
                data: [
                    userGroupFilters.notSelected
                ]
            });
            
            this.patientGroupsDS = new kendo.data.DataSource({
                data: [
                    userGroupFilters.notSelected,
                ]
            });
            
            // Types of participants invites.
            var participantInviteType = {
                manualInput: "manualInput",
                providerList: "providerList",
                patientList: "patientList"
            };

            // List of participants whom user is going to invite to consultation.
            var participantInvites = {
                manualInput: [],
                providerList: [],
                patientList: [],

                getAllParticipantInvites: function() {
                    return [].concat(this.manualInput, this.providerList, this.patientList);
                },

                clearAllParticipantInvites: function() {
                    this.manualInput = [];
                    this.providerList = [];
                    this.patientList = [];
                }
            };

            this.patientInformation = kendo.observable({
                profileImagePath: global.getDefaultProfileImageForPatient()
            });

            this.physicianInformation = kendo.observable({
                profileImage: global.getDefaultProfileImageForClinician()
            });

            // PUBLIC METHODS
            this.setContext = function(c, participantsService) {
                // ToDo: 
                // It would be nice to make refactoring and remove context property completely. 
                // Use $consultationContext as execution context.
                // All properties from actual 'consultation' or 'open consultation' object should be wrapped inside this context.
                // As result participant panel will not have direct access to consultation object.

                context = c;
                $consultationContext = participantsService;
            };

            this.setPatientInformation = function(data) {
                data = data || {};
                data.profileImagePath = data.profileImagePath || global.getDefaultProfileImageForPatient();
                this.set("patientInformation", data);
            };
        
            this.setPatientConnectionStatus = function(connectionStatus) {
                this.patientConnectionStatus = connectionStatus;
            };

            this.setPatientInformationVisibility = function(isPatientInfoInVisible) {
                this.set("isPatientInfoInVisible", isPatientInfoInVisible);
                this._triggerParticipantsRelatedFilelds();
            };

            this.setPhysicianInformation = function(data) {
                if (data) {
                    if (data.gender && data.gender == "M") {
                        data.maleicon = true;
                        data.femaleicon = false;
                        data.gendericon = "icon_male";
                    } else {
                        data.maleicon = false;
                        data.femaleicon = true;
                        data.gendericon = "icon_female";
                    }
                    data.name = data.name || data.firstName;
                    data.profileImage = data.profileImage || global.getDefaultProfileImageForClinician(data.gender);

                    data.email = data.email || "";
                    data.practiceFor = data.yearsOfExperience ? ((new Date()).getFullYear() - data.yearsOfExperience) + " years" : "";
                    if (data.dob) {
                        var ageStr = snap.getAgeString(data.dob);
                        data.age = ageStr;
                    } else {
                        data.age = "";
                    }
                }
                data.statesLicenced = parseStatesLicensed(data.statesLicenced);
                this.set("physicianInformation", data);
            };

            this.setParticipants = function (participants) {
                if (participants && $.isArray(participants)) {
                    participants = $consultationContext.parseParticipants(participants);
                    
                    var currParticipantArr = this.participants;
                    var newParticipants = [];

                    participants.forEach(function (item, index) {
                        var isUpdated = true; // UI use this field in order to show that participant status changed.
                        var invitationSendingInProgress = false;

                        if (currParticipantArr.length > 0 && currParticipantArr[index]) {
                            isUpdated = currParticipantArr[index].status != item.status;
                            invitationSendingInProgress = currParticipantArr[index].invitationSendingInProgress ? true : false;
                        } 

                        newParticipants.push(new Participant(item, isUpdated, invitationSendingInProgress));
                    });

                    this.set("participants", newParticipants);
                
                    this._triggerParticipantsRelatedFilelds();

                    //ToDo: not a best solution. It will be better to move this actions into Participant object!
                    var that = this;
                    setTimeout(function () {
                        that._initParticipantEvent();
                    }, 1000);
                }
            };

            // ********************************** MVVM Bindings **********************************************
            this.vm_isDirectoryOpen = false;
            this.vm_isDirectoryActive = false;

            this.vm_providerNameFilter = "";
            this.vm_selectedProviderGroup = userGroupFilters.notSelected.groupId;

            this.vm_patientNameFilter = "";
            this.vm_selectedPatientGroup = userGroupFilters.notSelected.groupId;

            this.vm_inviteButtonText = messages.inviteText;

            this.vm_isGuestPage = function() {
                return context.screenType === $screenTypes.guest;
            };

            this.vm_isPatientPage = function() {
                return context.screenType === $screenTypes.patient;
            };

            this.vm_isProviderPage = function() {
                return context.screenType === $screenTypes.provider;
            };

            this.vm_onSelectedProviderGroupChange = function() {
                this._reloadProviderSelector();
            };

            this.vm_onSelectedPatientGroupChange = function() {
                if(this.vm_selectedPatientGroup === userGroupFilters.familyGroup.groupId && 
                    patientSelector.patientSelectorType !== $patientSelector.patientSelectorType.familyGroup) {

                    // Change patient selector from All patients to Family group.
                    this._setPatientSelector($patientSelector.patientSelectorType.familyGroup);
                } else if( this.vm_selectedPatientGroup !== userGroupFilters.familyGroup.groupId &&
                    patientSelector.patientSelectorType === $patientSelector.patientSelectorType.familyGroup) {

                    // Change patient selector from Family group to All patients.
                    this._setPatientSelector($patientSelector.patientSelectorType.allPatients);
                } else {
                    this._reloadPatientSelector();
                }
            };

            this.vm_providerNameFilterChange = function() {
                if (!!searchTimeout) {
                    clearTimeout(searchTimeout);
                }

                if(providerSelector !== null) {
                    var that = this;
                    searchTimeout = setTimeout(function () {
                        if(providerSelector.filters().search !== that.vm_providerNameFilter) {
                            that._reloadProviderSelector();
                        }
                    }, 500);
                }
            };

            this.vm_patientNameFilterChange = function() {
                if (!!searchTimeout) {
                    clearTimeout(searchTimeout);
                }

                var that = this;
                searchTimeout = setTimeout(function () {
                    if(patientSelector.filters().search !== that.vm_patientNameFilter) {
                        that._reloadPatientSelector();
                    }
                }, 500);
            };

            this.vm_isProviderTab = function() {
                return currentTab === participantTab.provider;
            };

            this.vm_isPatientTab = function() {
                return currentTab === participantTab.patient;
            };

            this.vm_onProviderTabClick = function(e) {
                e.preventDefault();

                this._setCurrentTab(participantTab.provider);
            };

            this.vm_onPatientTabClick = function(e) {
                e.preventDefault();

                this._setCurrentTab(participantTab.patient);
            };

            this.vm_closeTab = function(e){
                context.selectVideoTab(e);
            };

            this.vm_onPatientDisconnectClick = function() {
                if (context.screenType !== $screenTypes.provider) {
                    return;
                }

                $snapNotification.confirmationWithCallbacks("Are you sure you want to disconnect the patient?", function () {
                    $consultationHub.disconnectPatient();
                });
            };

            this.vm_showProviderDetails = function() {
                $eventaggregator.publish("ud_showProviderDetails");
            };

            this.vm_hasParticipants = function () {
                return this.participants.length > 0;
            };

            this.vm_onSendInviteClick = function () {
                // Prevent multiple click. User have to wait until all invitations are sent.
                if(this.vm_isLoading) {
                    return;
                }

                if (participantInvites.getAllParticipantInvites().length > 0) {
                    this.set("vm_isError", !this._canSendInvitation());
                    this.set("vm_isLoading", !this.vm_isError);

                    if(this.vm_isError) {
                        return;
                    }

                    this.set("vm_inviteButtonText", "");

                    var that = this;
                    this._sendInvitations(participantInvites.getAllParticipantInvites()).then(function () {
                        that.set("vm_isInviteParticipantMenuOpen", false);
                    }).fail(function(error) {
                        $snapNotification.error(error);
                    }).always(function() {
                        that.set("vm_isLoading", false);
                        that.set("vm_inviteButtonText", messages.inviteText);
                    });
                }
            };

            this.vm_onToogleParticipanPanelUserDirectory = function() {
                this.set("vm_isInviteParticipantMenuOpen", !this.vm_isInviteParticipantMenuOpen);

                if(!this.vm_isInviteParticipantMenuOpen) {
                    this._setParticipantDirectoryVisibility(false);
                }

                if(context.screenType === $screenTypes.patient) {
                    this._setCurrentTab(participantTab.patient);
                    
                    if(patientSelector === null) {
                        this._setPatientSelector($patientSelector.patientSelectorType.familyGroup);
                    }            
                } else if(context.screenType === $screenTypes.provider) {
                    this._setCurrentTab(participantTab.provider);

                    this.set(
                        "providerGroupsDS", 
                        new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: "/api/v2/clinicians/groups",
                                    dataType: "json",
                                    contentType: 'application/json',
                                    type: "get"
                                }
                            },
                            error: function (e) {
                                processDSError(e, "provider groups list");
                            },
                            schema: {
                                data: function(groups) {
                                    var flatGroups = flattenGroups(groups);

                                    // Add default 'Filter By' option.
                                    flatGroups.unshift(userGroupFilters.notSelected);

                                    return flatGroups;
                                },
                                total: "total"
                            }
                        })
                    );

                    // Temporary disable patien groups according to 11400.
                    this.set(
                        "patientGroupsDS", 
                        new kendo.data.DataSource({
                            data: $consultationContext.getPatientsFilterOptions()
                        })
                    );

                    /*
                    this.set(
                        "patientGroupsDS", 
                        new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: "/api/v2/patients/groups",
                                    dataType: "json",
                                    contentType: 'application/json',
                                    type: "get"
                                }
                            },
                            error: function (e) {
                                processDSError(e, "patient groups list");
                            },
                            schema: {
                                data: function(groups) {
                                    var flatGroups = flattenGroups(groups);

                                    var defaultOptions = $consultationContext.getPatientsFilterOptions();
                                    
                                    Array.prototype.unshift.apply(flatGroups, defaultOptions);

                                    return flatGroups;
                                },
                                total: "total"
                            }
                        })
                    );
                    */
                    
                    if(patientSelector === null) {
                        this._setPatientSelector($patientSelector.patientSelectorType.allPatients);
                    }     

                    if(providerSelector === null) {
                        var that = this;
                        providerSelector = $providerSelector.createClinicianSelector({ 
                            isMultiselect: true,
                            ignoreHeader: true,
                            htmlContainerId: "#participantInvite_providerSelector",
                            scrollableElementClass: ".clinicianSelector_scrollable",
                            getRemainedItemsToSelectCount: function() {
                                return that._getNotUsedRemainedInvitationCount();
                            }
                        });    

                        providerSelector.load();
                    }
                }

                this.trigger("change", { field: "vm_isGuestPage"});
                this.trigger("change", { field: "vm_isPatientPage"});
                this.trigger("change", { field: "vm_isProviderPage"});
            };

            this.vm_onleParticipanPanelUserDirectoryCancelClick = function() {
                participantInvites.clearAllParticipantInvites();
                this._triggerParticipantInvitesListChange();

                this.set("vm_providerNameFilter", "");
                this.set("vm_selectedProviderGroup", null);

                this._reloadProviderSelector();
                this._reloadPatientSelector();

                this.vm_onToogleParticipanPanelUserDirectory();
            };

            this.vm_onToogleUserDirectory = function() {
                var isDirectoryOpen = !this.get("vm_isDirectoryOpen");

                this._setParticipantDirectoryVisibility(isDirectoryOpen);

                if(isDirectoryOpen) {
                    if(providerSelector !== null) {
                        providerSelector.unselectAll();

                        participantInvites.providerList.forEach(function(participantInvite) {
                            providerSelector.selectItem(participantInvite);
                        });

                        providerSelector.updateItemsUI();    
                    }

                    patientSelector.unselectAll();

                    participantInvites.patientList.forEach(function(participantInvite) {
                        patientSelector.selectItem(participantInvite);
                    });

                    patientSelector.updateItemsUI();  
                } else {
                    if(providerSelector !== null) {
                        participantInvites.providerList = extractParticipantInvites(providerSelector, participantInviteType.providerList);
                    }

                    participantInvites.patientList = extractParticipantInvites(patientSelector, participantInviteType.patientList);

                    this._triggerParticipantInvitesListChange();
                }
            };

            this.vm_onParticipantInputChange = function() {
                //If user enter some email we will have it value in vm_participantEmail variable.
                if(window.validateEmail(this.vm_participantEmail)) {
                    var remainedInvitations = this._getNotUsedRemainedInvitationCount();

                    if(remainedInvitations > 0) {
                        participantInvites.manualInput.push({
                            id: null,
                            name: this.vm_participantEmail,
                            email: this.vm_participantEmail,
                            participantInviteType: participantInviteType.manualInput
                        });

                        this._triggerParticipantInvitesListChange();
                    } else {
                        $snapNotification.info("You cannot invite more participants.");
                        this.set("vm_participantEmail", null);
                    }
                } else {
                    $snapNotification.info("Email is not valid.");
                }

                this.set("vm_participantEmail", null);
            };

            this.vm_isAnyParticipantSelected = function() {
                return participantInvites.getAllParticipantInvites().length > 0;
            };       

            this.vm_remainedParticipantText = function() {
                var remainedInvitations = this._getNotUsedRemainedInvitationCount();

                if(remainedInvitations <= 0) {
                    var msg = messages.participantLimitReached;

                    if(participantInvites.getAllParticipantInvites().length > 0) {
                        msg += " Invite these recipients to join now.";
                    }

                    return msg;
                } else {
                    var countText = ['zero', 'one', 'two','three','four', 'five', 'six'][remainedInvitations];

                    var countMsg = remainedInvitations === 1 ? 
                        [countText, "more person"].join(" ") : 
                        ["as many as ", countText, "more people"].join(" ");
                        
                    return ["You can invite", countMsg, "to participate in this consultation. Send invites via email or choose people from your directory."].join(" ");
                }
            };

            this._getNotUsedRemainedInvitationCount = function() {
                var isPatientUseParticipantSeat = $consultationContext.isPatientUseParticipantSeat(this.patientConnectionStatus);
                var maxParticipantCount = isPatientUseParticipantSeat ? 4 : 5;

                var remainedInvitations = maxParticipantCount - this._getParticipantsAttachedToConsultationCount();

                remainedInvitations = remainedInvitations - participantInvites.manualInput.length;

                if(this.get("vm_isDirectoryOpen")) {
                    if(providerSelector !== null) {
                        remainedInvitations = remainedInvitations - providerSelector.getSelectedItems().length;    
                    }

                    if(patientSelector !== null) {
                        remainedInvitations = remainedInvitations - patientSelector.getSelectedItems().length;
                    }
                } else {
                    remainedInvitations = remainedInvitations - participantInvites.providerList.length;
                    remainedInvitations = remainedInvitations - participantInvites.patientList.length;
                }                

                return remainedInvitations;
            };

            this._getParticipantsAttachedToConsultationCount = function() {
                return this.participants.filter(function(participant) { 
                    return participant.isParticipantAttachedToConsultation(); 
                }).length;
            };

            this._setParticipantDirectoryVisibility = function(isVisible) {
                this.set("vm_isDirectoryActive", isVisible);

                var that = this;
                setTimeout(function(){
                    that.set("vm_isDirectoryOpen", isVisible);
                }, 300);
            };

            this._triggerParticipantsRelatedFilelds = function() {
                this.trigger("change", { field: "participants" });
                this.trigger("change", { field: "vm_hasParticipants" });
                this.trigger("change", { field: "vm_isParticipantLimitReached" });
                this.trigger("change", { field: "vm_remainedParticipantText" });
            };

            this._sendInvitations = function(participants, dfd){
                if(typeof dfd === "undefined") {
                    dfd = $.Deferred();
                }

                var p = participants.slice();

                if(p.length > 0) {
                    var that = this;
                    this._sendInvitation(p[0]).done(function() {
                        p.splice(0, 1);
                        that._sendInvitations(p, dfd);
                    }).fail(function(error){
                        dfd.fail(error);
                    });
                } else {
                    dfd.resolve();
                }   

                return dfd.promise();
            };

            this._sendInvitation = function(participantInvite) {
                var dfd = $.Deferred();

                var that = this;

                var name = "Guest " + (this.participants.length + 1);
                this._addParticipants(name, participantInvite.email).then(function (response) {
                    var data = response.data[0];
                    

                    var participant = new Participant({
                        participantId: data.participantId,
                        personId: data.personId,
                        status: data.status,
                        participantType : $participantTypeCodes.guest,
                        email: participantInvite.email,
                        firstName : name,
                        lastName : ""
                    }, true, true);

                    that.participants.push(participant);
                    that._triggerParticipantsRelatedFilelds();
                    that._removeParticipantInvite(participantInvite);

                    that._sendInvitationEmail(participant.participantId, participant.email).then(function () {
                        // Email sending could take a long time.
                        var p = snap.util.findElement(that.participants, "participantId", participant.participantId);
                        if(p !== null) {
                            p.invitationSendingInProgress = false;
                            p.trigger("change", {field: "vm_statusText"});
                        }
                    }).fail(function () {
                        $snapNotification.error("There is problem sending invitation. Participant name: " + participant.firstName);
                    });

                    dfd.resolve();
                }, function (result) {
                    if (result.status == 405) {
                        dfd.reject(result.responseText);
                    } else {
                        dfd.reject("There is problem sending invitation");
                    }
                });

                return dfd.promise();
            };

            this._sendInvitationEmail = function (participantId, email) {
                return $consultationContext.sentInvitationEmail({
                    participantId: participantId, 
                    email: email, 
                    name: context.getName()  
                });
            };

            this._canSendInvitation = function() {
                if (snap.consultationSession.physicianCompleteSoapNotes) {
                    $snapNotification.error("You can't invite guests to the dropped consultation.");
                    return false;
                }

                if(!context.isStarted) {
                    $snapNotification.info("Please start this consultation in order to access this feature.");
                    return false;
                }

                return true;
            };


            this._addParticipants = function (name, email) {
                return $consultationContext.add({ name: name, email: email});
            };

            this._initParticipantEvent = function () {
                if ($(".patient-mini-header__status").hasClass("show-status")) {
                    $(".show-status").addClass("show-status--play");
                }
            };

            this._triggerParticipantInvitesListChange = function() {
                this.trigger("change", { field: "vm_isAnyParticipantSelected" });

                var that = this;
                var vmItems = [];
                
                participantInvites.getAllParticipantInvites().forEach(function(participant) {
                    vmItems.push(new ParticipantInvite(
                        participant,
                        function unselectHandler(participant) {
                            that._removeParticipantInvite(participant);
                        }
                    ));
                });

                this.set("vm_participantInvites", vmItems);
                this.trigger("change", { field: "vm_remainedParticipantText"});
            };

            this._removeParticipantInvite = function(participantInvite) {
                var arr = participantInvites[participantInvite.participantInviteType];
                
                var index = snap.util.findIndex(arr, "email", participantInvite.email);

                if(index >= 0) {
                    arr.splice(index, 1);
                }

                this._triggerParticipantInvitesListChange();
            };

            this._reloadProviderSelector = function() {
                if(providerSelector !== null) {
                    var filters = {
                        nameFilter: this.vm_providerNameFilter,
                        groupFilter: this._getGroupFilter(this.providerGroupsDS.data(), this.vm_selectedProviderGroup)
                    };

                    providerSelector.filters(filters);
                    providerSelector.reload();
                }
            };

            this._reloadPatientSelector = function() {
                var filters = this._getPatientSelectorFilters();

                patientSelector.filters(filters);
                patientSelector.reload();
            };
            
            this._getPatientSelectorFilters = function() {
                return {
                    nameFilter: this.vm_patientNameFilter,
                    groupFilter: this._getGroupFilter(this.patientGroupsDS.data(), this.vm_selectedPatientGroup),
                    onlyWithEmail: true,
                };
            };

            this._getGroupFilter = function(groups, groupId) {
                if(groupId !== userGroupFilters.notSelected.groupId) {
                    return snap.util.findElement(groups, "groupId", groupId);
                }

                return null;
            };

            this._setPatientSelector = function (patientSelectorType) {
                var that = this;
                var opt = {
                    isMultiselect: true,
                    htmlContainerId: "#participantInvite_patientSelector",
                    scrollableElementClass: ".patientSelector_scrollable",
                    getRemainedItemsToSelectCount: function() {
                        return that._getNotUsedRemainedInvitationCount();
                    }
                };

                if(patientSelector !== null) {
                    participantInvites.patientList = extractParticipantInvites(patientSelector, participantInviteType.patientList);
                    patientSelector.unload();  
                }

                if(patientSelectorType === $patientSelector.patientSelectorType.allPatients) 
                    patientSelector = $patientSelector.createAllPatientsSelector(opt);

                if(patientSelectorType === $patientSelector.patientSelectorType.familyGroup)
                    patientSelector = $patientSelector.createFamilyGroupSelector(opt, snap.consultationSession.patientId, this.physicianInformation.personId);

                participantInvites.patientList.forEach(function(participantInvite) {
                    patientSelector.selectItem(participantInvite);
                });

                patientSelector.filters(this._getPatientSelectorFilters());    
                patientSelector.load();
            };

            this._setCurrentTab = function(tab) {
                 currentTab = tab;

                this.trigger("change", { field: "vm_isProviderTab" });
                this.trigger("change", { field: "vm_isPatientTab" });

                if(currentTab === participantTab.provider && providerSelector !== null) {
                    providerSelector.updateItemsUI();
                }

                if(currentTab === participantTab.patient && patientSelector !== null) {
                    patientSelector.updateItemsUI();
                }
            };


            function ParticipantInvite(item, unselectHandler) {
                this.name = item.name;
                this.email = item.email;
                this.data = item;

                this.vm_onUnselectClick = function() {
                    unselectHandler(item);
                };
            }

            function Participant(item, isUpdated, invitationSendingInProgress) {
                this.firstName = item.firstName;
                this.lastName = item.lastName;
                this.email = item.email || "";
                this.participantId = item.participantId;
                this.status = item.status;
                this.personId = item.personId;
                this.participantTypeCode = item.participantTypeCode;
                this.profileImagePath = item.profileImagePath || global.getDefaultProfileImageForPatient();

                this.invitationSendingInProgress = invitationSendingInProgress ? true : false;
                this.isUpdated = isUpdated ? true : false;

                this.vm_isDisconnected = item.status === $participantStatusCodes.disconnected;
                this.vm_isPending = item.status === $participantStatusCodes.pending;
                this.vm_isJoining = item.status === $participantStatusCodes.isJoining;
                this.vm_hasJoined = item.status === $participantStatusCodes.active;
                this.vm_isDismissed = item.status === $participantStatusCodes.dismissed;
                this.vm_isDeclined = item.status === $participantStatusCodes.declined;
                this.vm_hasLeft = item.status === $participantStatusCodes.left;
                this.vm_isDropped = item.status === $participantStatusCodes.dropped;

                this.vm_canBeRemoved = !this.vm_isDismissed && !context.isGuestPage() && item.personId !== snap.profileSession.personId;
                this.vm_hideStatus = this.isUpdated && this.vm_hasJoined;
                this.vm_keepStatusHidden = !this.isUpdated && !this.vm_isPending && !this.vm_isDismissed && !this.vm_isDeclined && !this.vm_hasLeft;
                this.vm_keepStatusOpen = this.vm_hasLeft && !this.isUpdated || this.vm_isDropped || this.vm_isDisconnected || this.vm_isJoining || this.vm_isPending || this.vm_isDismissed && !this.isUpdated;
                this.vm_canResendInvite = !context.isGuestPage() &&
                    (this.vm_isDismissed || this.vm_isDeclined || this.vm_hasLeft || this.vm_isDropped);

                this.vm_statusText = function() {
                    var statusText = "";

                    if(this.invitationSendingInProgress) {
                        statusText = "Sending...";
                    } else if (this.vm_isPending) {
                        statusText = "Pending - Invitation Sent";
                    } else if (this.vm_isJoining) {
                        statusText = "Is joining the consultation";
                    } else if (this.vm_hasJoined) {
                        statusText = "Has joined the consultation";
                    } else if (this.vm_isDeclined) {
                        statusText = "Has declined the invitation";
                    } else if (this.vm_hasLeft) {
                        statusText = "Has left the consultation";
                    } else if (this.vm_isDisconnected) {
                        statusText = "Disconnected - Attempting to reconnect";
                    } else if (this.vm_isDropped) {
                        statusText = "Disconnected - Reconnect Failed";
                    } else if (this.vm_isDismissed) {
                        statusText = "Dismissed";
                    } else {
                        statusText = "";
                    }

                    return statusText;
                };

                // Check that participant not dismissed, dropped or declined.
                this.isParticipantAttachedToConsultation = function() {
                    return !this.vm_isDismissed && !this.vm_isDeclined && !this.vm_isDropped && !this.vm_hasLeft;
                };

                this.vm_disconnectParticipant = function() {
                    if(context.isGuestPage())
                        return;

                    var that = this;
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to disconnect the selected guest?", function () {
                        $consultationContext.disconnectParticipant(that.participantId);
                    });
                };

                this.vm_resendInvitation = function() {
                    if(context.isGuestPage())
                        return;

                    if(this.vm_canResendInvite) {
                        $eventaggregator.publish("pp_resendGuestInvitation", this.participantId);
                    }
                };
            }



            function parseStatesLicensed (statesJson) {
                try {
                    var statesObj = JSON.parse(statesJson);
                    return statesObj.map(function (item) {
                        return {
                            countryCode: item.countryCode,
                            states: !!item.regions ? item.regions.map(function (region) { return region.regionCode; }).join(", ") : ""
                        };
                    });
                } catch (e) {
                    return [];
                }
            }

            function extractParticipantInvites(selector, inviteType) {
                return selector.getSelectedItems().filter(function(item) {
                    return window.validateEmail(item.email);
                }).map(function(p) {
                    return {
                        id: p.id,
                        name: p.name,
                        email: p.email,
                        participantInviteType: inviteType
                    };
                });
            }

            function flattenGroups(groups) {
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
            }

            function processDSError(e, dsName) {
                if (!snap.isUnloading) {
                    var errorMessage = dsName + " error. ";
                    if (e.errorThrown === "Unauthorized") {
                        errorMessage = ["You do not have role functions for viewing ", dsName, "."].join("");
                    }
                    else if (e.xhr.readySate !== 4) {
                        errorMessage = ["Cannot read ", dsName, ". Please check your internet connection"].join("");
                    }
                    else if (typeof e.errorThrown != "undefined") {
                        errorMessage = errorMessage + e.errorThrown;
                    }

                    $snapNotification.error(errorMessage);
                }
            }
        }).singleton(); //make it singleton because we only need 1 instance no matter to share the same sesssion
}(jQuery, snap, kendo, window));

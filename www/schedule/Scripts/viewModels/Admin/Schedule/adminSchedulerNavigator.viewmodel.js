(function ($, snap, kendo, window) {
    "use strict";

    snap.namespace("snap.admin").use(["snap.service.groupsService", "snap.service.staffAccountService", "snap.EventAggregator", "snap.admin.schedule.AdminScheduleDSFactory", "snap.common.schedule.ScheduleCommon"])
        .define("AdminSchedulerNavigator", function ($groupsService, $staffAccountService, $eventAggregator, $adminScheduleDSFactory, $scheduleCommonObjects) {
            var itemTypeEnum = {
                user: "user",
                group: "group"
            };

            function filterByName(items, text) {
                return items.filter(function (item) {
                    return text === "" || item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
                });
            }

            function Item(item, itemType, container) {
                this.id = item.id;
                this.name = item.name;
                this.imageSource = item.imageSource;
                this.type = itemType;

                this.isSelected = false;
                this.isActive = false;

                this.select = function (val) {
                    if (val) {
                        this.set("isSelected", true);
                    } else {
                        this.set("isSelected", false);
                        this.set("isActive", false);
                    }
                };

                this.activate = function (val) {
                    if (val) {
                        this.set("isSelected", true);
                        this.set("isActive", true);
                    } else {
                        this.set("isActive", false);
                    }
                };

                this.onSelectClick = function () {
                    if (!(this.isSelected && container.isClinician()) && container && container.allowSelection(this)) {
                        this.select(!this.isSelected);
                        container.selectHandler(this);
                    }

                    $('#dialogbox-master__container').scrollTop();
                };

                this.onActivateClick = function () {
                    if (container && container.allowSelection(this)) {
                        var selectedStateBeforeActivation = this.isSelected;
                        this.activate(true);
                        container.activateHandler(this, selectedStateBeforeActivation != this.isSelected);
                    }

                    return false; //needs in order to stop event propagation. e.preventDefault() - not work.
                };

                this.hasOpacity = function () {
                    var showNotActiveUsersAsDisabled = container.showNotActiveUsersAsDisabled();

                    return !this.get("isActive") && showNotActiveUsersAsDisabled;
                };
            }

            function Clinician(clinician, container) {
                Item.call(this, clinician, "user", container);

                this.info = clinician.info;
            }
            Clinician.prototype = Object.create(Item.prototype);
            Clinician.prototype.constructor = Clinician;

            function Group(group, container) {
                Item.call(this, group, "group", container);
                this.subGroups = group.subGroups;
                this.members = group.members;

                this.onEnterClick = function () {
                    if (container) {
                        container.enterHandler(this);
                    }
                };
            }
            Group.prototype = Object.create(Item.prototype);
            Group.prototype.constructor = Group;

            function Container() {
                this.id = "";
                this.name = "";
                this.subGroups = [];
                this.members = [];
                this.parentContainer = null;

                this.nameFilter = "";
                this.showFilter = false;
                this.listType = "users";


                this.showDetails = function (container) {
                    this.set("nameFilter", "");
                    this.set("showFilter", false);

                    this.set("id", container.id);
                    this.set("name", container.name);
                    this.set("parentContainer", container.parentContainer ? container.parentContainer : null);

                    var subGroups = [];
                    var members = [];

                    var that = this;
                    if (container.subGroups && container.subGroups.length > 0) {
                        container.subGroups.forEach(function (subGroup) {
                            subGroups.push(kendo.observable(new Group(subGroup, that)));
                        });
                    }

                    if (container.members && container.members.length > 0) {
                        container.members.forEach(function (user) {
                            members.push(kendo.observable(new Clinician(user, that)));
                        });
                    }

                    this.set("subGroups", subGroups);
                    this.set("members", members);

                    this.trigger("change", {
                        field: "getFilteredGroups"
                    });

                    this.trigger("change", {
                        field: "getFilteredUsers"
                    });

                    this.trigger("change", {
                        field: "hasParent"
                    });

                    this.trigger("change", {
                        field: "getParentGroupName"
                    });

                    this.trigger("change", {
                        field: "getSummaryInfo"
                    });

                    if (this.isUsersTabVisible()) {
                        this.set("listType", "users");
                    } else if (this.isGroupsTabVisible()) {
                        this.set("listType", "groups");
                    } else {
                        this.set("listType", "none");
                    }

                    this._updateTabState();
                    this._updateViewState();
                };


                this.toggleTabs = function (e) {
                    e.preventDefault();
                    var listType = $(e.currentTarget).text().toLowerCase();

                    this.set("listType", listType);
                    this._updateTabState();
                };

                this.isGroupsTabVisible = function () {
                    return this.subGroups.length > 0;
                };

                this.isUsersTabVisible = function () {
                    return this.members.length > 0;
                };

                this.isClinician = function () {
                    return this.get("userType") === $scheduleCommonObjects.userType.clinician;
                };

                this.isUsersVisible = function () {
                    return this.listType === "users" && this.isUsersTabVisible();
                };

                this.isGroupsVisible = function () {
                    return this.listType === "groups" && this.isGroupsTabVisible();
                };

                this.isNotFoundVisible = function () {
                    return !this.isUsersVisible() && !this.isGroupsVisible();
                };


                this.openUserTab = function () {
                    this.set("listType", "users");
                    this._updateTabState();
                };

                this.hideAllTabs = function () {
                    this.set("listType", "");
                    this._updateTabState();
                };

                this.toogleFilter = function (e) {
                    e.preventDefault();
                    this.set("showFilter", !this.showFilter);
                };

                this.getFilteredGroups = function () {
                    return filterByName(this.subGroups, this.nameFilter);
                };

                this.getFilteredUsers = function () {
                    return filterByName(this.members, this.nameFilter);
                };

                this.nameFilterChange = function () {
                    this.trigger("change", {
                        field: "getFilteredGroups"
                    });
                    this.trigger("change", {
                        field: "getFilteredUsers"
                    });
                };

                this.getSummaryInfo = function () {
                    //if id == 0 than we are in the root othervise inside some group.
                    var text = this.id > 0 ? " Grouped Users" : " Ungrouped Users";

                    var summary = [
                        this.subGroups.length + " Sub-Groups",
                        this.members.length + text
                    ];

                    return summary.join(" | ");
                };

                this.getParentGroupName = function () {
                    return this.parentContainer ? this.parentContainer.name : "";
                };

                this.hasParent = function () {
                    return this.parentContainer !== null;
                };

                this.navigateToParent = function (e) {
                    e.preventDefault();
                    if (this.parentContainer) {
                        this.showDetails(this.parentContainer);
                    }

                    $eventAggregator.published("onGroupEnter");
                };

                this.isAnyUserSelected = function () {
                    for (var i = 0; i < this.members.length; i++) {
                        if (this.members[i].isSelected) {
                            return true;
                        }
                    }

                    return false;
                };

                this.isAnyUserActive = function () {
                    for (var i = 0; i < this.members.length; i++) {
                        if (this.members[i].isActive) {
                            return true;
                        }
                    }

                    return false;
                };

                this.getAllSelectedUsers = function () {
                    return this.members.filter(function (user) {
                        return user.isSelected;
                    });
                };

                this.getAllActiveUsers = function () {
                    return this.members.filter(function (user) {
                        return user.isActive;
                    });
                };

                this.activateUsers = function (userIds) {
                    var that = this;
                    var activateUser = function (userId) {
                        that.members.forEach(function (user) {
                            if (user.id === userId) {
                                user.onActivateClick();
                            }
                        });
                    };

                    for (var i = 0; i < userIds.length; i++) {
                        activateUser(userIds[i]);
                    }
                };

                this._showNotActiveUsersAsDisabled = false;
                this.showNotActiveUsersAsDisabled = function (value) {
                    if (typeof (value) === "undefined") {
                        return this._showNotActiveUsersAsDisabled;
                    }

                    this._showNotActiveUsersAsDisabled = (value === true);
                    this._updateViewState();
                };

                //************** Collection **************//
                this.enterHandler = function (item) {
                    //Save parent container
                    item.parentContainer = kendo.observable(new Container());
                    item.parentContainer.showDetails(this);
                    this.showDetails(item);

                    $eventAggregator.published("onGroupEnter");
                };
                this.allowSelection = function (item) {
                    if (item.type === itemTypeEnum.user && !item.isSelected) {
                        var cnt = 0;
                        this.members.forEach(function (member) {
                            cnt += member.isSelected ? 1 : 0;
                        });
                        if (cnt >= 5) {
                            $eventAggregator.published("leftbarSelectorOverflowError");
                            return false;
                        }
                    }

                    return true;
                }
                this.selectHandler = function (item) {
                    if (item.type === itemTypeEnum.user) {
                        if (!this.isAnyUserActive() && this.isAnyUserSelected()) {
                            if (item.isSelected) {
                                item.activate(true);
                            } else {
                                var firstSelected = this.getAllSelectedUsers()[0];
                                firstSelected.activate(true);
                            }
                        }

                        this._updateViewState();
                        $eventAggregator.published("onItemsSelect");
                    } else if (item.type === itemTypeEnum.group) {
                        this.enterHandler(item);
                    }
                };

                this.activateHandler = function (item, isRefreshRequired) {
                    if (item.type === itemTypeEnum.user) {
                        this.deactivateAllBut(item);
                        if (isRefreshRequired) {
                            this._updateViewState();
                        }
                        $eventAggregator.published("onItemActivated");
                    } else if (item.type === itemTypeEnum.group) {
                        this.enterHandler(item);
                    }
                };

                this.deactivateAllBut = function (item) {
                    var _unselectAllBut = function (collection, selectedItem) {
                        collection.forEach(function (item) {
                            if (selectedItem.type !== item.type || selectedItem.id !== item.id) {
                                item.activate(false);
                            }
                        });
                    };

                    _unselectAllBut(this.subGroups, item);
                    _unselectAllBut(this.members, item);
                };

                /*********************** PUBLIC METHODS ***********************/
                this.getFirstActiveUser = function () {
                    var activeUsers = this.getAllActiveUsers();

                    if (activeUsers && activeUsers.length > 0) {
                        return activeUsers[0];
                    }

                    return null;
                };

                this.addActiveUser = function (userId, callback) {
                    var that = this;
                    clinisiansDS.selectById(userId).done(function (clinician) {
                        if (clinician) {
                            var m = that.members.filter(function (member) {
                                return member.id === userId;
                            });

                            var clinicianItem = null;
                            if (m.length > 0) {
                                clinicianItem = m[0];
                            } else {
                                clinicianItem = kendo.observable(new Clinician(clinician, that));
                                that.members.push(clinicianItem);
                                that.trigger("change", {
                                    field: "getFilteredUsers"
                                });

                                that.trigger("change", {
                                    field: "getSummaryInfo"
                                });
                            }

                            if (!clinicianItem.isActive) {
                                clinicianItem.onActivateClick();
                            }
                            if (callback && typeof callback.call !== "undefined") {
                                callback.call();
                            }
                        } else {
                            if (callback && typeof callback.call !== "undefined") {
                                callback.call();
                            }
                        }
                    });

                };

                this.setActiveUser = function (userId, callback) {
                    this.getAllSelectedUsers().forEach(function (item) {
                        item.activate(false);
                        item.select(false);
                    });
                    this._updateViewState();
                    this.addActiveUser(userId, callback);

                };
                /*********************** MVVM BINDINGS ***********************/

                /*********************** PRIVATE METHODS ***********************/
                this._updateViewState = function () {
                    this.trigger("change", {
                        field: "isAnyUserSelected"
                    });
                    this.trigger("change", {
                        field: "getAllSelectedUsers"
                    });
                    this.trigger("change", {
                        field: "getAllActiveUsers"
                    });
                };

                this._updateTabState = function () {
                    this.trigger("change", {
                        field: "isUsersTabVisible"
                    });

                    this.trigger("change", {
                        field: "isGroupsTabVisible"
                    });


                    this.trigger("change", {
                        field: "isUsersVisible"
                    });

                    this.trigger("change", {
                        field: "isGroupsVisible"
                    });

                    this.trigger("change", {
                        field: "isNotFoundVisible"
                    });
                };
            }

            var clinisiansDS = $adminScheduleDSFactory.getCliniciansDS();
            this.emptyNavigator = kendo.observable(new Container());
            this.loadNavigator = function (userType) {
                var that = this;
                var dfd = $.Deferred();

                var dataLoaded = $.Deferred();
                dataLoaded.reject("Unsupported user type");

                // first we init clinisians datasource
                clinisiansDS.getLocalDS().done(function () {
                    if (userType === $scheduleCommonObjects.userType.admin) {
                        dataLoaded = that.loadHospitalNavigator();
                    } else if (userType === $scheduleCommonObjects.userType.clinician) {
                        dataLoaded = that.loadPhysicianNavigator();
                    }

                    dataLoaded.done(function (parsedData) {
                        var root = kendo.observable(new Container());
                        root.showDetails(parsedData);
                        root.set("userType", userType);
                        dfd.resolve(root);
                    }).fail(function (error) {
                        dfd.reject(error);
                    });
                }).fail(function (error) {
                    dfd.reject(error);
                });

                return dfd.promise();
            };
            this.loadPhysicianNavigator = function () {
                var dfd = $.Deferred();
                var parsedData = groupApiParser({
                    subGroups: [],
                    members: [$.extend({}, snap.profileSession, {
                        clinicianId: snap.profileSession.userId
                    })],
                    name: "ALL",
                    id: 0,
                    parentContainer: null
                });

                dfd.resolve(parsedData);
                return dfd.promise();
            };
            this.loadHospitalNavigator = function () {
                var dfd = $.Deferred();

                var groupsPromise = $groupsService.get();
                var usersPromise = clinisiansDS.getCliniciansData();
                $.when(groupsPromise, usersPromise).done(function (groups, users) {
                    var parsedData = groupApiParser({
                        subGroups: groups.data,
                        members: users,
                        name: "ALL",
                        id: 0,
                        parentContainer: null
                    });
                    dfd.resolve(parsedData);
                }).fail(function (groups, users) {
                    window.console.log(groups);
                    window.console.log(users);

                    dfd.reject("Internal error: Cannot load groups and users");
                });

                return dfd.promise();
            };

            this.createNavigator = function (container) {
                var root = kendo.observable(new Container());
                root.showDetails(container);
                return root;
            };

            function clinicianApiParser(clinician) {
                var details = [];
                if (clinician.medicalSpeciality) {
                    details.push(clinician.medicalSpeciality);
                }

                if (clinician.subSpeciality) {
                    details.push(clinician.subSpeciality);
                }
                var item = {};
                if (clinician.person) {
                    details = [];
                    if (clinician.speciality) {
                        if (clinician.speciality.primary) {
                            details.push(clinician.speciality.primary);
                        }
                        if (clinician.speciality.secondary) {
                            details.push(clinician.speciality.secondary);
                        }
                    }
                    item = {
                        id: clinician.userId,
                        name: $scheduleCommonObjects.getFullName(clinician.person),
                        imageSource: clinician.person.photoUrl || getDefaultProfileImageForClinician(),
                        info: details.join(" | ")
                    };
                } else {
                    item = {
                        id: clinician.clinicianId,
                        name: clinician.fullName,
                        imageSource: clinician.profileImage || getDefaultProfileImageForClinician(),
                        info: details.join(" | ")
                    };
                }
                return item;
            }

            function groupApiParser(group) {
                var g = {
                    id: group.groupId,
                    name: group.name,
                    imageSource: "/images/ico12.png",
                    subGroups: [],
                    members: []
                };

                if (group.subGroups && group.subGroups.length > 0) {
                    group.subGroups.forEach(function (subGroup) {
                        g.subGroups.push(groupApiParser(subGroup));
                    });
                }

                if (group.members && group.members.length > 0) {
                    group.members.forEach(function (user) {
                        g.members.push(clinicianApiParser(user));
                    });
                }

                return g;
            }


        }).singleton();
}(jQuery, snap, kendo, window));
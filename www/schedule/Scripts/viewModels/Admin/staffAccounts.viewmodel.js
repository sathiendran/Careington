(function ($, global, snap, kendo, $snapNotification) {
    "use strict";
    var
        app = global.app = global.app || {},
        util = snap.util,
        apiRequest = new snap.ApiRequest();

    var crudServiceBaseUrl = "/api/v2/clinicians/staffaccounts";
    var messages = {
        invitationSent: "Invitation has been sent again.",
        invitationNotSent: "Invitation has not been sent again.",
        userNotHasClinicianFunction: "Selected User doesn't have provider function to schedule appointment.",
        deleteUserConfirm: "Are you sure that you want to delete the Selected User(s)?",
        setAsActiveConfirm: "Are you sure that you want to activate the Selected User(s)?",
        deleteItemConfirm: "Are you sure that you want to remove this ",
        tagCreated: "Tag has been created successfully",
        tagDeleted: "Tag has been deleted successfully",
        tagDeletedFail: "Tag has not been deleted",
        tagAssigment: "Tag Assigned to the User(s) Successfully",
        tagUnassigment: "Tag Unassigned from the User(s) Successfully",
        roleAssigment: "Role Assigned to the User(s) Successfully",
        roleUnassigment: "Role Unassigned from the User(s) Successfully",
        roleAssignUnassignError: "Some of the selected accounts not active. You can assign or unassign role only to activated accounts.",
        cliniciansLimitNearToMax: "Providers nearer to max limit. Please select one User at a time to assign the role.",
        cliniciansLimitExceeded: "Unable to add New Provider Role. Providers reaches max limit.",
        removeSelfAccountError: "You cannot delete your self account",
        reactivateSuccess: "The User reactivated successfully",
        reactivateFail: "Failed to reactivate selected User",
        deleteSuccess: "Selected User(s) deleted successfully",
        deleteFail: "Failed to delete selected User(s)"
    };

    var accountApiService = (function () {
        var
            userTagMapRoute = "/api/v2/clinicians/tags/{id}/staff",
            usreRole = "/api/v2/clinicians/roles/{id}/staff",
            userReActivate = "/api/v2/clinicians/staffprofiles/{id}/reactivate";

        return {
            assignTag: function (tagId, staffAccounts) {
                var url = apiRequest.formatUrl(userTagMapRoute, tagId);
                return apiRequest.post(url, staffAccounts, { action: "Assign tags to users", roleFunction: "Assign Tags" });
            },
            unassignTag: function (tagId, staffAccounts) {
                var url = apiRequest.formatUrl(userTagMapRoute, tagId);
                return apiRequest.delete(url, staffAccounts, { action: "Unassign tags from users", roleFunction: "Assign Tags" });
            },

            assignRole: function (roleId, staffAccounts) {
                var url = apiRequest.formatUrl(usreRole, roleId);
                return apiRequest.post(url, staffAccounts, { action: "Assign roles to users", roleFunction: "Assign Roles" });
            },

            unassignRole: function (roleId, staffAccounts) {
                var url = apiRequest.formatUrl(usreRole, roleId);
                return apiRequest.delete(url, staffAccounts, { action: "Unassign roles from users", roleFunction: "Assign Roles" });
            },
            validateClinicianLimitRequest: function (staffUserId, roles) {
                var path = snap.string.formatURIComponents('/api/v2/clinicians/{0}/limit', staffUserId);

                return $.ajax({
                    type: "GET",
                    url: path,
                    data: "roles=" + roles,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            validateCliniciansLimit: function (roleId, staffAccounts) {
                var roleIds = [];
                roleIds.push(roleId);

                var staffSelectedCount = staffAccounts.length;

                return this.validateClinicianLimitRequest(staffAccounts[0].userId, roleIds);//.done(function (data) {
                /*  callback(data.data[0]);
                  $def.resolve(data.data[0]);
              }).fail(function (er) {
                  $snapNotification.error("Cannot check provider limit.");
                  window.console.error(er);
                  $def.resolve();
              });*/

            },
            delete: function (selectedAccounts) {
                var data = JSON.stringify({ data: selectedAccounts });

                return $.ajax({
                    type: "DELETE",
                    url: crudServiceBaseUrl,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: data
                })
            },
            reactivate: function (staffUserId) {
                var path = apiRequest.formatUrl(userReActivate, staffUserId);
                return $.ajax({
                    type: "PUT",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                });
            }
        };
    })();

    var tagsApiServise = (function () {
        var crudTagsServiceBaseUrl = "/api/v2/clinicians/tags";

        return {
            get: function () {
                return apiRequest.get(crudTagsServiceBaseUrl, { action: "View tags", roleFunction: "View tags" });
            },

            remove: function (tagId) {
                return apiRequest.delete(crudTagsServiceBaseUrl + "/" + tagId, null, { action: "Delete tags", roleFunction: "Delete Tags" });
            },

            add: function (description) {
                return apiRequest.post(crudTagsServiceBaseUrl, description, { action: "Add new tags", roleFunction: "Create Tags" });
            }
        };
    })();

    var rolesApiServise = (function () {
        var crudTagsServiceBaseUrl = "/api/v2/clinicians/roles";

        return {
            get: function () {
                return apiRequest.get(crudTagsServiceBaseUrl, { action: "View roles", roleFunction: "View Roles" });
            },

            remove: function (roleId) {
                return apiRequest.delete(crudTagsServiceBaseUrl + "/" + roleId, null, { action: "Disable roles", roleFunction: "Disable Roles" });
            }
        };
    })();

    var groupState = {
        checked: "checked",
        unchecked: "unchecked",
        indeterminate: "indeterminate"
    };

    var staffAccountsViewModel = kendo.observable({
        adminUserId: 0,
        isAllChecked: false,
        isSomeChecked: false,
        staffFilterValue: "",
        groupsFilterValue: "",
        newTagValue: "",
        isGroupsLoading: false,
        includeInactive: false,
        tagsDataSource: {
            collectionType: "tagsDataSource",
            entityName: "tag",
            selectedItemId: -1,
            distinct: [],
            tags: []
        },
        rolesDataSource: {
            collectionType: "rolesDataSource",
            entityName: "role",
            selectedItemId: -1,
            distinct: [],
            tags: []
        },
        clearAll: function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            this._clearAll();
        },


        clickOnItem: function (id, collectionType) {

            var collection = collectionType === this.tagsDataSource.collectionType ? this.tagsDataSource : this.rolesDataSource;

            //If customer click on already selected tag we should unselect tag.
            if (id === collection.selectedItemId) {
                id = -1;
            }

            this._setTagFilter(id, collection);
        },
        findTagByName: function (tagName) {
            var tagDataSource = this.tagsDataSource;
            var tag = null;
            if (tagDataSource && tagDataSource.items && tagDataSource.items.length > 0) {
                $.each(tagDataSource.items, function () {
                    if (this.description == tagName) {
                        tag = this;
                    }
                });
            }
            return tag;
        },
        addTag: function (e) {

            if (e.keyCode === 13 || e.type === "click") {
                var that = this;
                if (that.newTagValue.trim() == "") {
                    $snapNotification.error('Please enter a tag');
                    this.set("newTagValue", "");
                    return;
                }
                if (this.findTagByName(this.newTagValue.trim()) != null) {
                    $snapNotification.error('Duplicate Tag.');
                    this.set("newTagValue", "");
                    return;
                }


                var tagValue = this.newTagValue.trim();
                tagsApiServise.add(tagValue).done(function () {
                    that._loadTags().always(function () {

                        var selectedAccounts = that._getAllSelectedAccounts();
                        if (selectedAccounts.length > 0) {
                            var newTag = that.findTagByName(tagValue);
                            if (newTag && newTag.id) {
                                that.assignItem(null, newTag.id, "tagsDataSource");
                            }

                        } else {
                            if (selectedAccounts.length == 0) {
                                $snapNotification.success(messages.tagCreated);
                            }
                        }
                    });





                });

                this.set("newTagValue", "");
            }
        },

        assignItem: function (event, id, collectionType) {
            if (event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            }
            var that = this;
            var selectedAccounts = this._getAllSelectedAccounts();
            if (selectedAccounts.some(function (staff) {
                return !staff.isActivated;
            })) {
                $snapNotification.error("Some of selected staff accounts are not activated yet. You cannot assign any " + (collectionType === this.tagsDataSource.collectionType?"tags":"roles") + " to these users.");
            } else {
                if (collectionType === this.tagsDataSource.collectionType) {
                    accountApiService.assignTag(id, selectedAccounts).done(function () {
                        $snapNotification.success(messages.tagAssigment);
                    });
                } else {
                    for (var i = 0; i < selectedAccounts.length; i++) {
                        if (!selectedAccounts[i].isActivated) {
                            $snapNotification.error(messages.roleAssignUnassignError);
                            return;
                        }
                    }

                    accountApiService.validateCliniciansLimit(id, selectedAccounts).done(function (response) {
                        if (response.data[0] === 1) {
                            accountApiService.assignRole(id, selectedAccounts).done(function () {
                                that._clearAll();
                                $snapNotification.success(messages.roleAssigment);
                            });
                        } else {
                            if (selectedAccounts.length > 1) {

                                $snapNotification.info(messages.cliniciansLimitNearToMax);
                            }
                            else {
                                $snapNotification.error(messages.cliniciansLimitExceeded);
                            }
                        }
                    });
                }
            }
            this._clearAll();
        },

        unassignItem: function (event, id, collectionType) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            var that = this;
            var selectedAccounts = this._getAllSelectedAccounts();

            if (collectionType === this.tagsDataSource.collectionType) {
                accountApiService.unassignTag(id, selectedAccounts).done(function () {
                    $snapNotification.success(messages.tagUnassigment);
                });
            } else {
                for (var i = 0; i < selectedAccounts.length; i++) {
                    if (!selectedAccounts[i].isActivated) {
                        $snapNotification.error(messages.roleAssignUnassignError);
                        return;
                    }
                }

                accountApiService.unassignRole(id, selectedAccounts).done(function () {
                    $snapNotification.success(messages.roleUnassigment);
                    that._clearAll();
                });
            }

            this._clearAll();
        },

        removeItem: function (event, id, collectionType) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }

            var that = this;
            var confirmMessage = messages.deleteItemConfirm + this[collectionType].entityName + "?";
            snap.SnapNotification().confirmationWithCallbacks(confirmMessage, function () {
                var dataSource;
                var api;
                if (collectionType === that.tagsDataSource.collectionType) {
                    api = tagsApiServise;
                    dataSource = that.tagsDataSource;
                } else {
                    api = rolesApiServise;
                    dataSource = that.rolesDataSource;
                }

                api.remove(id).done(function () {
                    var index = snap.util.findIndex(dataSource.items, "id", id);
                    if (index > -1) {
                        dataSource.items.splice(index, 1);
                    }
                    $snapNotification.success(messages.tagDeleted);
                    that.set(dataSource.collectionType, that._extendDataSource(dataSource, dataSource.items));
                    dataSource = that[dataSource.collectionType];

                    //If customer remove selected item we must unselect it and clear tag filter.
                    if (id === dataSource.selectedItemId) {
                        that._setTagFilter(-1, dataSource);
                    }
                });
            });
        },

        reload: function () {
            this.staffFilterChange();
        },

        staffFilterChange: function () {
            if (this.accountsDataSource.page() !== 1) {
                this.accountsDataSource.page(1);
            } else {
                this.accountsDataSource.read();
            }
            staffAccountsViewModel.set("isAllChecked", false);
            staffAccountsViewModel.set("isSomeChecked", false);
        },

        toggleAllAccountsCheckBox: function () {
            var all = true;

            this.accountsDataSource.data().forEach(function (element) {
                all = all && element.isChecked;
            });

            this.set("isAllChecked", all);
        },

        clickAllAccountsCheckBox: function () {
            var that = this;
            this.accountsDataSource.data().forEach(function (element) {
                element.isChecked = that.isAllChecked;
            });

            this.set("isSomeChecked", that.isAllChecked);
            this.accountsDataSource.trigger("change", { action: "clickAllAccountsCheckBox" });

            this.trigger("change", { field: "tagsDataSource" });
            this.trigger("change", { field: "rolesDataSource" });
            snap.admin.groupsModule().refresh();
        },

        deleteSelectedAccounts: function () {
            var that = this;
            snap.SnapNotification().confirmationWithCallbacks(messages.deleteUserConfirm, function () {
                var selectedAccounts = that._getAllSelectedAccounts();

                for (var i = 0; i < selectedAccounts.length; i++) {
                    if (selectedAccounts[i].userId === that.adminUserId) {
                        $snapNotification.error(messages.removeSelfAccountError);
                        return;
                    }
                }

                accountApiService.delete(selectedAccounts).then(function () {
                    selectedAccounts.forEach(function (element) {
                        element.set("isChecked", false);
                        element.set("isActive", "I");
                    });
                    staffAccountsViewModel.trigger("change", { field: "tagsDataSource" });
                    staffAccountsViewModel.trigger("change", { field: "rolesDataSource" });
                    snap.admin.groupsModule().refresh();
                    staffAccountsViewModel.set("isSomeChecked", false);
                    staffAccountsViewModel.set("isAllChecked", false);
                    $snapNotification.success(messages.deleteSuccess);
                }, function () {
                    $snapNotification.error(messages.deleteFail);
                });
            });
        },

        formatClientIdForGroup: function (groupId) {
            return "gr_" + groupId;
        },

        _getAllSelectedAccounts: function () {
            var accounts = [];

            this.accountsDataSource.data().forEach(function (element) {
                if (element.isChecked) {
                    accounts.push(element);
                }
            });

            return accounts;
        },

        _isSomeChecked: function () {
            var staffAccounts = this.accountsDataSource.data();
            for (var i = 0; i < staffAccounts.length; i++) {
                if (staffAccounts[i].isChecked)
                    return true;
            }

            return false;
        },

        _setTagFilter: function (id, collection) {
            collection.set("selectedItemId", id);
            this.staffFilterChange();
            //this.trigger("change", { field: "tagsDataSource" });

            if (this.accountsDataSource.page() !== 1) {
                this.accountsDataSource.page(1);
            }
        },
        accountsDataSource: new kendo.data.DataSource({
            batch: true,
            transport: {
                create: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "post"
                },
                read: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "get"
                },
                update: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "put"
                },
                destroy: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "delete"
                },
                parameterMap: function (data, type) {
                    if (type === "destroy") {
                        return kendo.stringify({ data: data.models });
                    }
                    if (type !== "read") {
                        return { models: kendo.stringify(data.models) };
                    } else {
                        data.staffNameFilter = staffAccountsViewModel.staffFilterValue;
                        data.tagId = staffAccountsViewModel.tagsDataSource.selectedItemId;
                        data.roleId = staffAccountsViewModel.rolesDataSource.selectedItemId;
                        data.groupIds = snap.admin.groupsModule().getSelectedGroupsIds().join(",");
                        data.includeInactiveDoctors = staffAccountsViewModel.includeInactive;
                    }

                    return data;
                }
            },
            change: function (e) {
                //String describing the action type (available for all actions other than "read"). Possible values are "itemchange", "add", "remove" and "sync".
                if (typeof e.action !== "undefined") {
                    if (e.action === "itemchange" && e.field === "isActive") {
                        e.items.forEach(function (element) {
                            element.set("isActiveBool", element.isActive === "A");
                        });
                    }
                    return;
                }

                staffAccountsViewModel.set("isAllChecked", false);
                staffAccountsViewModel.set("isSomeChecked", false);
                staffAccountsViewModel.trigger("change", { field: "tagsDataSource" });
                staffAccountsViewModel.trigger("change", { field: "rolesDataSource" });

                $.each(e.items,
                    function (i, item) {
                        item.set("profileImage", item.profileImagePath
                            || getDefaultProfileImageForClinician());
                        item.trigger("change", { field: "isActive" });
                    });
            },
            error: function (e) {
                var errorMessage = "Staff Account grid error. ";
                if (e.errorThrown === "Unauthorized") {
                    errorMessage =
                        "You do not have role functions for managing Staff Accounts. Required role functions: View Staff Accounts, Edit Staff Accounts";
                } else if (typeof e.errorThrown != "undefined") {
                    errorMessage = errorMessage + e.errorThrown;
                }

                $snapNotification.error(errorMessage);
            },
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "userId",
                    fields: {
                        "staffId": {
                            type: "number"
                        },
                        "userId": {
                            type: "number"
                        },
                        "fullName": {
                            type: "string"
                        },
                        "profileImagePath": {
                            type: "string"
                        },
                        "phone": {
                            type: "string"
                        },
                        "isActivated": {
                            type: "boolean"
                        },
                        "isActive": {
                            type: "string"
                        },
                        "isChecked": {
                            type: "boolean"
                        }
                    },
                    onChange: function () {
                        staffAccountsViewModel.toggleAllAccountsCheckBox();
                        staffAccountsViewModel.set("isSomeChecked", staffAccountsViewModel._isSomeChecked());
                        snap.admin.groupsModule().refresh();

                        staffAccountsViewModel.trigger("change", { field: "tagsDataSource" });
                        staffAccountsViewModel.trigger("change", { field: "rolesDataSource" });
                    },
                    resendInvitation: function () {
                        snap.SnapLoader().showLoader();
                        var data = {
                            hospitalId: snap.hospitalSession.hospitalId,
                            userId: this.userId,
                            name: this.fullName,
                            email: this.emailId
                        };

                        util.apiAjaxRequest(snap.string.formatString('/api/v2/emails/cousers/invitations'),
                                'POST',
                                data)
                            .done(function (response) {
                                if (response === "Success") {
                                    $snapNotification.success(messages.invitationSent);
                                } else {
                                    $snapNotification.error(messages.invitationNotSent);
                                }

                            })
                            .always(function () {
                                snap.SnapLoader().hideLoader();
                            });
                    },
                    scheduleAppointment: function () {
                        if (this.canMakeAppointments !== true) {
                            $snapNotification.info(messages.userNotHasClinicianFunction);
                            return;
                        }

                        snap.admin.schedule.eventDialog()
                            .openNewAppointmentDialog({
                                clinicianId: this.userId,
                                patientId: null,
                                userType: snap.common.schedule.ScheduleCommon().userType.admin
                            });
                    },

                    viewStaffProfile: function () {

                        if (snap.hasAnyPermission(snap.security.view_staff_accounts,
                            snap.security.edit_staff_accounts)) {
                            snap.StaffUserID = this.userId;
                            sessionStorage.setItem('snap_staffViewEditProfile', snap.StaffUserID);


                            if (!this.isActivated) {
                                if (snap.hasAnyPermission(snap.security.edit_staff_accounts))
                                    window.location.href = '/Admin/EditStaffAccount.aspx';
                            } else {
                                location.href = "/Admin/StaffAccount";
                            }
                        }
                    },
                    activateAccount: function () {
                        var account = this;
                        snap.SnapNotification().confirmationWithCallbacks(messages.setAsActiveConfirm, function () {
                            accountApiService.reactivate(account.userId).then(function (responce) {
                                if (responce && responce.data && responce.data.length && responce.data[0].isActive === "A") {
                                    account.set("isActive", "A");
                                    staffAccountsViewModel.trigger("change", { field: "tagsDataSource" });
                                    staffAccountsViewModel.trigger("change", { field: "rolesDataSource" });
                                    snap.admin.groupsModule().refresh();
                                    staffAccountsViewModel.set("isSomeChecked", false);
                                    staffAccountsViewModel.set("isAllChecked", false);
                                    $snapNotification.success(messages.reactivateSuccess);
                                } else {
                                    $snapNotification.error(messages.reactivateFail);
                                }
                            }, function () {
                                $snapNotification.error(messages.reactivateFail);
                            });
                        });
                    }
                }
            },
            pageSize: 20,
            serverPaging: true
        }),
        isLoading: true,
        isNoData: function(){
            return !this.get("isLoading") && this.get("accountsDataSource").total() === 0;
        },
        LoadViewModel: function (currentUserId) {
            //For any non MVVM manipulations
            this.adminUserId = parseInt(currentUserId);
            this._loadTags();
            this._loadRoles();
            var that = this;
            this.accountsDataSource.one("requestEnd", function (e) { // Set isLoading to false when first request is finished
                that.set("isLoading", false);
            });
        },

        imageLoadError: function (element) {
            element.onerror = "";
            element.src = "/images/Doctor-Male.gif";
        },

        _loadRoles: function () {
            var that = this;

            rolesApiServise.get().done(function (roles) {
                var rolesDataSource = that._extendDataSource(that.rolesDataSource, roles.data);
                that.set("rolesDataSource", rolesDataSource);
            });
        },

        _loadTags: function () {


            var that = this;
            var prom = tagsApiServise.get();
            prom.done(function (tags) {
                var tagsDataSource = that._extendDataSource(that.tagsDataSource, tags.data);
                that.set("tagsDataSource", tagsDataSource);
            });
            return prom;
        },

        _extendDataSource: function (dataSource, items) {
            var unique = {}, distinct = [];
            for (var i = 0; i < items.length; i++) {
                if (typeof unique[items[i].shortName] == "undefined") {
                    distinct.push(items[i].shortName);
                }
                unique[items[i].shortName] = 0;
            }

            distinct.sort();
            return {
                collectionType: dataSource.collectionType,
                entityName: dataSource.entityName,
                selectedItemId: dataSource.selectedItemId,
                distinct: distinct,
                items: items
            };
        },

        _clearAll: function () {
            this.set("isAllChecked", false);
            this.set("isSomeChecked", false);
            this.set("staffFilterValue", "");
            this.tagsDataSource.set("selectedItemId", -1);
            this.rolesDataSource.set("selectedItemId", -1);
            snap.admin.groupsModule().setSelectedGroupsIds([]);
            this.set("newTagValue", "");

            var that = this;
            this.accountsDataSource.read().done(function () {
                that.trigger("change", { field: "tagsDataSource" });
                that.trigger("change", { field: "rolesDataSource" });
                snap.admin.groupsModule().refresh();
            });
        }
    });

    /****************************** Groups ******************************/
    (function ($, staffAccountsViewModel, groupState) {
        snap.namespace("snap.admin").use(["snapNotification", "snap.admin.groupList", "snap.service.groupsService"])
            .define("groupsModule", function ($snapNotification, $groupList, $groupsService) {
                var scope = this;
                var selectedGroupsIds = []; //Groups selected by user.

                $groupList.on("onGroupsFilter", function () {
                    if ($groupList.nameFilter() !== "") {
                        scope.refresh();
                    }
                });

                $groupList.on("onGroupClick", function (e) {
                    //Note! We have two different behaviour for group checkbox click.
                    //1. If some accounts selected then click will add/remove selected accounts from group.
                    //2. If no accouts selected then click will filter acounts by group. 

                    if (staffAccountsViewModel._isSomeChecked()) {

                        if (staffAccountsViewModel._getAllSelectedAccounts().some(function (staff) {
                            return !staff.isActivated;
                        })) {
                            $snapNotification.error("Some of selected staff accounts are not activated yet. You cannot add these users to any groups.");
                            $groupList.uncheckAll();
                        } else {
                            e.group.clinicianIds = staffAccountsViewModel._getAllSelectedAccounts().map(function (account) {
                                return account.userId;
                            });

                            $groupsService.processGroupState(e.state, e.group).done(function () {
                                staffAccountsViewModel._clearAll();
                            }).fail(function () {
                                scope.refresh();
                            });
                        }
                    } else {
                        selectedGroupsIds = $groupList.getAllSelectedGroupsIds();

                        staffAccountsViewModel.reload();
                    }
                });

                $groupList.on("onGroupsLoad", function () {
                    scope.refresh();
                });

                $groupList.LoadViewModel("#groupsTab"); //Inject view model do  <div id ="groupsTab"/>

                var iterator = function (node, callback) {
                    if (node.groupId) {
                        callback(node);
                    }

                    if (node.subGroups) {
                        node.subGroups.forEach(function (group) {
                            iterator(group, callback);
                        });
                    }
                };

                var getGroupState = function (groupId, selectedAccounts) {
                    var state;
                    if (selectedAccounts.length === 0) {
                        state = selectedGroupsIds.indexOf(groupId) > -1 ? groupState.checked : groupState.unchecked;
                    } else {
                        var accountsInGroup = selectedAccounts.filter(function (staffAccount) {
                            return staffAccount.groupIds.indexOf(groupId) > -1;
                        });

                        state = groupState.unchecked;
                        if (accountsInGroup.length === 0) {
                            state = groupState.unchecked;
                        } else if (accountsInGroup.length === selectedAccounts.length) {
                            state = groupState.checked;
                        }
                        else if (accountsInGroup.length > 0) {
                            state = groupState.indeterminate;
                        }
                    }

                    return state;
                };

                var expandGroup = function (group, selectedAccounts) {
                    var expand = false;
                    if (selectedAccounts.length === 0) {
                        expand = false;
                        for (var i = 0; i < group.subGroups.length; i++) {
                            if (selectedGroupsIds.indexOf(group.subGroups[i].groupId) > -1) {
                                expand = true;
                                break;
                            }
                        }
                    } else {
                        for (var i = 0; i < group.subGroups.length; i++) {
                            var state = getGroupState(group.subGroups[i].groupId, selectedAccounts);

                            if (state !== groupState.unchecked) {
                                expand = true;
                                break;
                            }
                        }
                    }

                    if (expand) {
                        $groupList.expandGroup(group.groupId);
                    }
                };

                this.refresh = function () {
                    var root = {
                        id: null,
                        subGroups: $groupList.groups()
                    };

                    var selectedAccounts = staffAccountsViewModel._getAllSelectedAccounts();

                    selectedAccounts.forEach(function (account) {
                        if (!account.groupIds) {
                            account.groupIds = [];
                        }
                    });

                    iterator(root, function (group) {
                        var groupState = getGroupState(group.groupId, selectedAccounts);
                        $groupList.setGroupViewState(group.groupId, groupState);

                        expandGroup(group, selectedAccounts);
                    });
                };

                this.getSelectedGroupsIds = function () {
                    return selectedGroupsIds;
                };

                this.setSelectedGroupsIds = function (groupsIds) {
                    selectedGroupsIds = groupsIds;
                    this.refresh();
                };
            }).singleton();
    }($, staffAccountsViewModel, groupState));

    /****************************** End Groups ******************************/


    app.staffAccountsService = {
        viewModel: staffAccountsViewModel
    };
})(jQuery, window, snap, kendo, snap.SnapNotification());


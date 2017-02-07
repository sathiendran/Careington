(function ($, snap, kendo) {
    "use strict";
    snap.namespace("snap.admin").use(["snapNotification", "snapHttp", "snap.service.groupsService", "snap.service.staffAccountService", "snap.admin.groupList"])
        .define("staffAccountLeftBar", function ($snapNotification, $snapHttp, $groupsService, $staffAccountService, $groupList) {
            var scope = this;
            var eventList = {};
            var triggerEvent = function (name) {
                var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                var eventCbList = eventList[name];
                if (eventCbList) {
                    $.each(eventCbList, function () {
                        return this.apply(scope, args);
                    });
                }
            };

            this.on = function (eventName, cb) {
                var eventCbList = eventList[eventName];
                if (!eventCbList) {
                    eventCbList = [];
                }
                eventCbList.push(cb);
                eventList[eventName] = eventCbList;
            };

            /****************************** Common ******************************/
            // Tab Switcher
            $('.group-tabs a').on('click', function (event) {
                event.preventDefault();

                var
                    li = $(this).closest('li'),
                    index = li.index(),
                    items = $('.group-tabs__item');

                li.siblings().removeClass('is-active');
                li.addClass('is-active');
                items.siblings().removeClass('is-active');
                items.hide().eq(index).addClass('is-active').fadeIn();

                if (index < 2) {
                    $('.group-tabs__container').css("height", "100%");
                } else {
                    $('.group-tabs__container').css("height", "auto");
                }
            });

            /****************************** Groups ******************************/
            var selectedGroupsIds = [];

            this.refresh = function () {
                $groupList.uncheckAll();

                selectedGroupsIds.forEach(function (groupId) {
                    $groupList.checkGroup(groupId);
                });

                $groupList.groups().forEach(function (group) {
                    var expand = false;
                    for (var i = 0; i < group.subGroups.length; i++) {
                        if (selectedGroupsIds.indexOf(group.subGroups[i].groupId) > -1) {
                            expand = true;
                            break;
                        }
                    }

                    if (expand) {
                        $groupList.expandGroup(group.groupId);
                    } 
                });
            };

            $groupList.on("onGroupsFilter", function () {
                if ($groupList.nameFilter() === "") {
                    scope.refresh();
                }
            });

            $groupList.on("onGroupClick", function (e) {
                e.group.clinicianIds = [snap.staffUserId];
                $groupsService.processGroupState(e.state, e.group).fail(function(){
                    scope.refresh();
                });
            });

            $groupList.on("onGroupsLoad", function () {
                $groupList.isLoading(true);
                $groupsService.get(snap.staffUserId).done(function (groups) {
                    selectedGroupsIds = groups.data.map(function(group){
                        return group.groupId;
                    });
                    scope.refresh();
                    $groupList.isLoading(false);
                });
            });

            $groupList.LoadViewModel("#groupsTab"); //Inject view model do  <div id ="groupsTab"/>
            
            /****************************** Tags ******************************/
            var tagsVM = kendo.observable({
                userTags: [],
                selectedTag: null,
                tagsDS: new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: snap.string.formatString('/api/v2/clinicians/hospitals/{0}/tags', snap.hospitalSession.hospitalId),
                            dataType: "json",
                            type: "get"
                        },
                        parameterMap: function (options) {
                            if (options.filter && options.filter.filters) {
                                options.searchText = options.filter.filters[0].value;
                                delete options.filter;
                                return options;
                            }
                        }
                    },
                    schema: {
                        data: function (data) {
                            return data.data;
                        }
                    },
                }),
                isDuplicateTab:function(tagValue){
                    var userTags = this.userTags;
                   
                    var isFound = false;
                    if (userTags && userTags.length > 0) {
                        $.each(userTags, function () {
                            
                            if (this.description == tagValue) {
                                isFound = true;
                            }
                        });
                    }

                    return isFound;
                },
                addTag: function(tag){
                    if (tag === null || tag.trim() === "") {
                        $snapNotification.error("Please enter a tag.");
                        return;
                    }


                    tag = tag.trim();
                   
                    if (/^[a-zA-Z0-9_ ]*$/.test(tag)) {
                        if (this.isDuplicateTab(tag)) {
                            $snapNotification.error("Duplicate Tag");
                            this.set("selectedTag", "");
                            return;
                        }

                        var that = this;


                        $staffAccountService.assignTag(snap.profileSession.userId, snap.staffUserId, snap.hospitalSession.hospitalId, tag).done(function () {
                            $snapNotification.success("Tag has been applied successfully");
                        }).fail(function (e) {
                            $snapNotification.info("Tag has not been applied");
                            window.console.error(e);
                        }).always(function () {
                            that.loadUserTags();
                            that.set("selectedTag", "");
                        });
                    } else {
                        $snapNotification.error("Tag name can contains only alphanumeric symbols, underscore and spaces");
                    }
                },

                reomoveTag: function (id) {
                    var that = this;
                    $snapNotification.confirmationWithCallbacks("Are you sure that you want to remove this Tag?", function () {
                        $staffAccountService.unassignTag(id, snap.staffUserId).done(function () {
                            $snapNotification.success("Tag has been deleted successfully");
                        }).fail(function (e) {
                            $snapNotification.info("Tag has not been deleted");
                            window.console.error(e);
                        }).always(function () {
                            that.loadUserTags();
                        });
                    }); 
                },

                onTagClick: function (event) {
                    var tagContainer = $(event.target).closest(".deleteTag");

                    if (tagContainer.length === 0)
                        return;

                    var tagId = tagContainer.data().tagId;
                    this.reomoveTag(tagId);
                },

                loadUserTags: function () {
                    var that = this;
                    $staffAccountService.getIndividualTags(snap.staffUserId).done(function (data) {
                        that.set("userTags", data.data);
                    }).fail(function (er) {
                        that.set("userTags", []);
                        window.console.error(er);
                        $snapNotification.error("Cannot load tags");
                    });
                }
            });

            kendo.bind($("#tagsTab"), tagsVM);
            kendo.bind($(".userTabBox"), tagsVM);

            
            tagsVM.loadUserTags();
            
            //ToDo: move to MVVM when autocomplete will support flexible event binding (currently we can not use 'change' event because it triggered when control lost focus)
            $("#addTag").keydown(function (event) {
                if (event.keyCode == 13) {
                    
                    tagsVM.addTag($('#addTag').val());
                }
            });

            $(".add-button").click(function (event) {
                event.preventDefault();
                tagsVM.addTag($('#addTag').val());

            });

            /****************************** Roles ******************************/

            var rolesVM = kendo.observable({
                selectedRoles: [],

                rolesNameFilter: "",
                isLoading: false,
                roles: [],
                items: [],
                isPrimaryAdmin: true, 

                refresh: function () {
                    this.set("items", this.filter(this.get("roles"), this.rolesNameFilter));
                },

                rolesNameFilterChange: function() {
                    this.refresh();
                },              

                load: function() {
                    var that = this;
                    that.set("isLoading", true);

                    $staffAccountService.getAccountInfo(snap.staffUserId).done(function (data) {
                        that.set("isPrimaryAdmin", data.data[0].primaryAdmin);
                    }).fail(function (er) {
                        $snapNotification.info("Connot get user details.");
                        window.console.error(er);
                        that.set("isPrimaryAdmin", true);
                    });

                    $staffAccountService.getIndividualRoles(snap.staffUserId, snap.hospitalSession.hospitalId).done(function (data) {
                        var selectedRoles = {};
                        var roles = [];
                        data.data.forEach(function (role) {
                            if (role.status === "A")
                            {
                                selectedRoles[role.roleId] = true;
                            }

                            var r = {
                                id: role.roleId,
                                description: role.description,
                                roleCode: null
                            };

                            if (role.roleCode) {
                                r.roleCode = role.roleCode;
                            }

                            roles.push(r);
                        });

                        that.set("roles", roles);
                        that.selectedRoles = selectedRoles; //No need for wrapping to observable.
                    }).fail(function (er) {
                        that.set("roles", []);
                        that.set("selectedRoles", {});

                        $snapNotification.info("Connot get user roles.");
                        window.console.error(er);
                    }).always(function () {
                        that.set("isLoading", false);
                        that.refresh();
                    });
                },

                getSelectedRoles: function(){
                    var roles = [];
                    for (var key in this.selectedRoles) {
                        if (this.selectedRoles[key] === true) {
                            roles.push(key);
                        }
                    }

                    return roles;
                },

                WrapRoleToNewObservableObject: function (role) {
                    var vm = this;
                    return new kendo.data.ObservableObject({
                        description: role.description,
                        id: role.id,
                        roleCode: role.roleCode,
                        checkBoxViewState: vm.selectedRoles[role.id] || false,

                        onRoleClick: function () {
                            var role = this;
                            var selectedRoles = vm.getSelectedRoles();
                            if (!this.checkBoxViewState) {
                                selectedRoles.push(role.id);

                                $staffAccountService.validateClinicianLimit(snap.staffUserId, snap.hospitalSession.hospitalId, selectedRoles).done(function (data) {
                                    if (data.data[0] === 0) {
                                        $snapNotification.info("Unable to add New Provider Role. Providers reaches max limit.");
                                        return;
                                    }

                                    $staffAccountService.assignRole(role.id, snap.staffUserId).done(function () {
                                        role.setViewState(true);
                                        $snapNotification.success("Role has been assigned successfully.");
                                        triggerEvent("userRolesListChanged");
                                    }).fail(function (er) {
                                        $snapNotification.error("Cannot assign role.");
                                        window.console.error(er);
                                    });
                                }).fail(function (er) {
                                    $snapNotification.error("Cannot check provider limit.");
                                    window.console.error(er);
                                });
                            } else {
                                if (snap.staffUserId == snap.profileSession.userId) {
                                    $snapNotification.info("You cannot unassign your own roles");
                                    return;
                                }
                                if (selectedRoles.length === 1) {
                                    $snapNotification.error("User should have at least one role");
                                    return;
                                }
                                if (role.roleCode === "HADM" && !vm.isPrimaryAdmin) {
                                    $snapNotification.info("The role cannot be removed for this user.");
                                    return;
                                }
                                $snapNotification.hideAllConfirmations();
                                $snapNotification.confirmationWithCallbacks("Are you sure that you want to unassign this Role?", function () {
                                    $staffAccountService.unassignRole(role.id, snap.staffUserId).done(function () {
                                        role.setViewState(false);
                                        $snapNotification.success("Role has been unassigned successfully.");
                                        triggerEvent("userRolesListChanged");
                                    }).fail(function (er) {
                                        $snapNotification.error("Cannot unassign role.");
                                        window.console.error(er);
                                    });
                                });                                    
                            }
                        },

                        setViewState: function (state) {
                            this.set("checkBoxViewState", state);
                            vm.selectedRoles[this.id] = state;
                        }
                    });
                },

                filter: function (roles, text) {
                    var that = this;
                    var filteredRoles = [];
                    roles.forEach(function (role) {
                        var g = that.WrapRoleToNewObservableObject(role);

                        if (text === "" || g.description.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                            filteredRoles.push(g);
                        }
                    });

                    return filteredRoles;
                },
            });

            kendo.bind($("#rolesTab"), rolesVM);
            rolesVM.load();

        }).singleton();
}(jQuery, snap, kendo));
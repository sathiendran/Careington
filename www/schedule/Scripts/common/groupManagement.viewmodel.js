/// <reference path="../../snapCustomBinding.js" />

(function ($) {
    "use strict";
    snap.namespace("snap.admin").use(["snapNotification", "snapHttp", "snap.service.groupsService"])
        .extend(kendo.observable)
        .define("groupManagement", function ($snapNotification, $snapHttp, $groupsService) {
            var modeEnum = {
                view: "view",
                edit: "edit",
                add: "add"
            };

            var messages = {
                addPermisionMissed: "You don't have permission to add Group.",
                editPermisionMissed: "You don't have permission to edit Group.",
                removePermisionMissed: "You don't have permission to remove Group."
            }

            var scope = this;
            var popup = null;

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

            function getGroupId(event) {
                var groupContainer = $(event.target).closest(".group-box__item");

                if (groupContainer.length === 0) {
                    return 0;
                }

                return groupContainer.data().groupId;
            }

            function findGroupBy(propName, value, root, trans) {
                if(trans === null || typeof(trans) === "undefined") {
                    trans = function(item) {
                        return item;
                    };
                }

                if (trans(root[propName]) === trans(value)) {
                    return root;
                }

                if (root.subGroups) {
                    for (var i = 0; i < root.subGroups.length; i++) {
                        var group = findGroupBy(propName, value, root.subGroups[i], trans);

                        if (group) {
                            return group;
                        }
                    }
                }

                return null;
            }

            function findGroupById(id, root) {
                return findGroupBy("groupId", id, root);
            }

            function findGroupByName(name, root) {
                return findGroupBy("name", name, root, function(groupName) {
                    if(groupName) {
                        return groupName.toLowerCase();
                    }
                    
                    return groupName;
                });
            }
            
            this.isLoading = false,

            //Nested observable object is necessary for Kendo MVVM template. In order to pass complicated object with binding to template but not trigger whole model each time when some property has changed.
            this.groupsDS = new kendo.data.ObservableObject({
                currentGroupId: null, 
                currentMode: modeEnum.view,

                subGroups: [],
                groupText: "",
                
                addClick: function(e) {
                    if (!snap.hasAllPermission(snap.security.create_groups)) {
                        $snapNotification.error(messages.addPermisionMissed);
                        return;
                    } 

                    var id = getGroupId(e);
                    var that = scope.groupsDS; //this method can be called from different contexts context. Will use scope explicitly.

                    that.clear();
                    that.set("currentGroupId", id);
                    that.set("currentMode", modeEnum.add);

                    that.refreshAndFocus();
                },

                editClick: function(e) {
                    if (!snap.hasAllPermission(snap.security.modify_groups)) {
                        $snapNotification.error(messages.editPermisionMissed);
                        return;
                    } 

                    var group = findGroupById(getGroupId(e), this);
                    this.clear();
                    if (group) {
                        this.set("groupText", group.name);
                        this.set("currentGroupId", group.groupId);
                        this.set("currentMode", modeEnum.edit);
                    }
                
                    this.refreshAndFocus();
                },

                removeClick: function(e){
                    if (!snap.hasAllPermission(snap.security.remove_groups)) {
                        $snapNotification.error(messages.removePermisionMissed);
                        return;
                    }

					var id = getGroupId(e);
					var that = this;

                    scope.set("isLoading", true);
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to remove this group?", function() { 
                        $groupsService.remove(id)
                            .done(function() {
                                $snapNotification.success("Group removed.");
                            })
                            .fail(function(e) {
                                var error = "Can not remove group.";
                                if(e.status === 403 /*Forbidden*/ || e.status === 404 /*Not Found*/) { 
                                    error = e.responseText.replace(/['"]+/g, '') ;
                                } 

                                $snapNotification.error(error); 
                                console.error(e);
                            })
                            .always(function() {
                                that.load();
                            });
                    }, function(){
                        scope.set("isLoading", false);
                    });
                },

                saveClick: function () {
                    if (this.currentMode === modeEnum.add && !snap.hasAllPermission(snap.security.create_groups)) {
                        $snapNotification.error(messages.addPermisionMissed);
                        return;
                    }

                    if (this.currentMode === modeEnum.edit && !snap.hasAllPermission(snap.security.modify_groups)) {
                        $snapNotification.error(messages.editPermisionMissed);
                        return;
                    }                    

                    var error = this.validate();
                    if(error) {
                         $snapNotification.error(error);
                         return;
                    }

                    var that = this;
                    var text = $.trim(this.groupText);
                    var currentGroup = findGroupById(this.currentGroupId, this);
                    var targetGroup = {
                        name: text,
                        description: text,
                        groupId: null,
                        parentGroupId: null
                    };
                    switch (this.currentMode) {
                        case  modeEnum.add:
                            if(currentGroup){
                                targetGroup.parentGroupId  = currentGroup.groupId;
                            }
                            break;
                        case modeEnum.edit:
                            if(currentGroup){
                                targetGroup.groupId  = currentGroup.groupId;
                                targetGroup.parentGroupId = currentGroup.parentGroupId;
                            }
                            break;
                        default:
                            $snapNotification.info("Wrong mode.");
                            targetGroup = null;
                            break;
                    }

                    if(targetGroup !== null) {
                        scope.set("isLoading", true);

                        var promise = $.Deferred();
                        promise.resolve(); //Dummy resolved promise. Real value will be set by $groupsService add/edit methods.
                        if(targetGroup.groupId !== null) {
                            promise = $groupsService.edit(targetGroup, targetGroup.groupId).done(function() {
                                $snapNotification.success("Group changed.");
                            });                         
                        } else { 
                            promise = $groupsService.add(targetGroup).done(function() {
                                $snapNotification.success("New group added.");
                            });
                        }

                        promise.fail(function(e) {
                            $snapNotification.error("Cannot perform operation");
                            console.error(e);
                        }).always(function() {
                            that.load();
                        });
                    }
                },

                cancelClick: function () {
                    this.clear();
                    scope.trigger("change", { field: "groupsDS" });
                },

                groupTextKeyup: function(e){
                    switch (e.keyCode) {
                        case 27: //Esc
                            this.cancelClick();
                            e.preventDefault();
                            popup.focus();
                            break;
                        case 13: //Enter
                            this.saveClick();
                            e.preventDefault();
                            popup.focus();
                            break;
                        default:
                            if(!/^[a-zA-Z0-9 _-]+$/.test(this.groupText)) {
                                var cl = this.groupText.replace(/[^a-zA-Z0-9 _-]/g, '');
                                this.set("groupText", cl);
                            }
                    }

                    return false;
                },

                load: function () {
                    var that = this;
                    scope.set("isLoading", true);
                    $groupsService.get().done(function (groups) {
                        that.subGroups = groups.data;
                    }).fail(function (e) {
                        $snapNotification.error("Can not get groups list");
                        console.error(e);
                        that.subGroups = [];
                    }).always(function () {
                        that.clear();
                        scope.trigger("change", { field: "groupsDS" });
                        scope.set("isLoading", false);
                    });
                },

                refreshAndFocus: function () {
                    scope.trigger("change", { field: "groupsDS" });
                    $("#addNewGroupInput").focus();
                },

                clear: function() {
                    this.set("groupText", "");
                    this.set("currentGroupId", null);
                    this.set("currentMode", modeEnum.view);
                },

                validate: function() {
                    var name = this.groupText,
                        groupId =  this.currentMode === modeEnum.edit ? this.currentGroupId : null;

                    if (name === null || typeof(name) === "undefined" || $.trim(name) === "") {
                        return "Group name should not be empty.";
                    }

                    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) {
                        return "Group name should contains only alphanumeric symbols, dashes and spaces.";
                    }

                    var group = findGroupByName(name, this);
                    if(group !== null && groupId !== group.groupId) {
                        return "Group with same name already exists.";
                    }                

                    return null;
                },
            });

            this.open = function () {
                if (popup === null) {
                    $.get("/Content/Admin/groupManagement.html" + snap.addVersion, function (content) {
                        popup = $(content);
                        popup.appendTo("body");
                        kendo.bind(popup, scope);
                        popup.fadeIn();
                        popup.focus();
                    });
                } else {
                    popup.fadeIn();
                    popup.focus();
                }

                this.groupsDS.load();
            };

            this.isOpen = function () {
                if (popup !== null) {
                    return popup.is(':visible');
                }

                return false;
            };

            this.close = function () {
                popup.fadeOut();
                triggerEvent("close");
            };

            this.on = function (eventName, cb) {
                var eventCbList = eventList[eventName];
                if (!eventCbList) {
                    eventCbList = [];
                }
                eventCbList.push(cb);
                eventList[eventName] = eventCbList;
            };

            $("body").on("keyup", ".groups-popup", function (e) {
                if (e.keyCode == 27 && scope.isOpen()) {   //Esc
                    scope.close();
                }
            });
        }).singleton();
}(jQuery));
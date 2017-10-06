/// <reference path="../../snapCustomBinding.js" />

(function ($) {
    "use strict";
    snap.namespace("snap.admin").use(["snapNotification", "snapHttp", "snap.service.groupsService", "snap.admin.groupManagement"])
        //.extend(kendo.observable)
        .define("groupList", function ($snapNotification, $snapHttp, $groupsService, $groupManagement) {
            var scope = this;
            var $content = null;
            
            var groupsState = {}; //Dictionary of groups state (checked, unchecked, indeterminate).
            var groupState = {
                checked: "checked",
                unchecked: "unchecked",
                indeterminate: "indeterminate"
            };
            var eventList = {};
            var triggerEvent = function(name) {
                var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                var eventCbList = eventList[name];
                if (eventCbList) {
                    $.each(eventCbList, function() {
                        return this.apply(scope, args);
                    });
                }
            };

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

            var wrapGroupToNewObservableObject = function(group) {
                var g = new kendo.data.ObservableObject({
                    groupId: group.groupId,
                    name: group.name,
                    subGroups: [],

                    onGroupClick: function() {
                        this.setViewState(this.checkBoxViewState === groupState.checked ? groupState.unchecked : groupState.checked);

                        triggerEvent("onGroupClick", {
                            state: this.checkBoxViewState,
                            group: jQuery.extend({}, group)
                        });
                    },
                    checkBoxViewState: groupsState[group.groupId] || groupState.unchecked,
                    isCheckedView: function() {
                        return this.checkBoxViewState === groupState.checked;
                    },
                    isIndeterminateView: function () {
                        return this.checkBoxViewState === groupState.indeterminate;
                    },

                    setViewState: function (groupState) {
                        this.set("checkBoxViewState", groupState);
                        this.trigger("change", { field: "isCheckedView" });
                        this.trigger("change", { field: "isIndeterminateView" });
                        groupsState[this.groupId] = groupState;
                    }
                });

                if (group.subGroups) {
                    group.subGroups.forEach(function(group) {
                        g.subGroups.push(wrapGroupToNewObservableObject(group));
                    });
                }

                return g;
            };

            var filter = function(groups, text) {
                var filteredGroups = [];
                groups.forEach(function(group) {
                    var g = wrapGroupToNewObservableObject(group);

                    if (group.subGroups) {
                        g.subGroups = filter(group.subGroups, text);
                    }

                    if (text === "" || g.name.toLowerCase().indexOf(text.toLowerCase()) > -1 || g.subGroups.length > 0) {
                        filteredGroups.push(g);
                    }
                });

                return filteredGroups;
            };

            var findGroupById = function(groupId, root) {
                if (root.groupId === groupId) {
                    return root;
                }

                if (root.subGroups) {
                    for (var i = 0; i < root.subGroups.length; i++) {
                        var group = findGroupById(groupId, root.subGroups[i]);

                        if (group) {
                            return group;
                        }
                    }
                }

                return null;
            };


            /***************************** 
              Non MVVM logic.
            ******************************/
            var getGroupBoxItem = function(groupId) {
                return $content.find(".group-box__item[data-group-id=" + groupId + "]");
            };

            var expandGroup = function(group) {
                if (group.subGroups && group.subGroups.length > 0) {
                    var gb = getGroupBoxItem(group.groupId);

                    gb.children(".group-box__list").slideDown();
                    gb.children(".group-box__name").addClass("is-expand");
                }
            };


            var vm = kendo.observable({
                groupsNameFilter: "",
                isGroupsLoading: false,
                subGroups: [],
                items: [],

                refresh: function () {
                    this.set("items", filter(this.get("subGroups"), vm.groupsNameFilter));
                },

                groupsNameFilterChange: function() {
                    this.refresh();

                    if (this.groupsNameFilter !== "") {
                        this.expandAll();
                    }

                    triggerEvent("onGroupsFilter");  
                },

                showGroupManagement: function() {
                    $groupManagement.open();
                },

                load: function() {
                    vm.set("isGroupsLoading", true);
                    $groupsService.get().done(function (groups) {
                        iterator({ subGroups: groups.data }, function (group) {
                            if (group.subGroups == null) {
                                group.subGroups = [];
                            }
                        });
                        vm.set("subGroups", groups.data); // ==> vm.trigger("change", { field: "items" });
                    }).fail(function () {
                        vm.set("subGroups", []);
                    }).always(function () {
                        vm.refresh();
                        vm.set("isGroupsLoading", false);
                        triggerEvent("onGroupsLoad");
                    });
                },

                expandAll: function () {
                    this.items.forEach(function (group) {
                        expandGroup(group);
                    });
                }
            });

            //Public actions
            this.on = function(eventName, cb) {
                var eventCbList = eventList[eventName];
                if (!eventCbList) {
                    eventCbList = [];
                }
                eventCbList.push(cb);
                eventList[eventName] = eventCbList;
            };

            this.isLoading = function (isLoading) {
                vm.set("isGroupsLoading", isLoading);
            };

            this.expandGroup = function (groupId) {
                var group = findGroupById(groupId, vm);

                if (group) {
                    expandGroup(group);
                }
            };

            this.expandAll = function () {
                vm.expandAll();
            };

            this.checkGroup = function (groupId) {
                var group = findGroupById(groupId, { subGroups: vm.items });

                if (group) {
                    group.setViewState(groupState.checked);
                }
            };

            this.uncheckGroup = function (groupId) {
                var group = findGroupById(groupId, { subGroups: vm.items });

                if (group) {
                    group.setViewState(groupState.unchecked);
                }
            };

            this.setGroupViewState = function (groupId, groupState) {
                var group = findGroupById(groupId, { subGroups: vm.items });

                if (group) {
                    group.setViewState(groupState);
                }
            };


            this.uncheckAll = function () {                
                for (var key in groupsState) {
                    if ($.isNumeric(key)) {
                        this.uncheckGroup(parseInt(key));
                    }
                }
            };

            this.groups = function () {
                return vm.get("subGroups");
            };

            this.nameFilter = function () {
                return vm.get("groupsNameFilter");
            };

            this.getAllSelectedGroupsIds = function () {
                var groupsIds = [];
                for (var key in groupsState) {
                    if ($.isNumeric(key) && groupsState[key] == groupState.checked) {
                        groupsIds.push(parseInt(key));
                    }
                }

                return groupsIds;
            };

            this.LoadViewModel = function(container) {
                if ($content == null) {
                        $.get("/Content/Admin/groupList.html"+ snap.addVersion, function(content) {
                        $content = $(content);
                        $content.appendTo(container);
                        kendo.bind($content, vm);

                        vm.load();

                        $content.on("click", ".js-expand-list", function (e) {
                            e.preventDefault();
                            $(this).parent().siblings(".group-box__list").slideToggle();
                            $(this).parent().toggleClass("is-expand");
                        });

                        $groupManagement.on("close", function() {
                            vm.load();
                        });
                    });
                }
            };
        }).singleton();
}(jQuery));


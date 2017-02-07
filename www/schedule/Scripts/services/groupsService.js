(function($, snap) {
    "use strict";
    snap.namespace("snap.service").using(["snapHttp", "snapNotification"])
        .define("groupsService", function($http, $snapNotification) {
            var sortGroups = function(root) {
                if (root.subGroups) {
                    root.subGroups.sort(function(a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                            return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1;
                        return 0;
                    });

                    root.subGroups.forEach(function(group) {
                        sortGroups(group);
                    });
                }
            };

            var apiPath = "/api/v2/clinicians/groups";

            this.get = function(clinicianId) {
                var path = apiPath;
                var dfd = $.Deferred();

                $http.get(path, {
                    clinicianId: clinicianId
                }).done(function(data) {
                    sortGroups({
                        subGroups: data.data
                    });
                    dfd.resolve(data);
                }).fail(function(error) {
                    dfd.reject(error);
                });

                return dfd.promise();
            };

            this.add = function(group) {
                return $.ajax({
                    type: "POST",
                    url: apiPath,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(group),
                });
            };

            this.edit = function(group, groupId) {
                var path = [apiPath, groupId].join("/");

                return $.ajax({
                    type: "PUT",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(group),
                });
            };

            this.remove = function(groupId) {
                var path = [apiPath, groupId].join("/");

                return $.ajax({
                    type: "DELETE",
                    url: path,
                    contentType: "application/json; charset=utf-8",
                    dataType: "text"
                });
            };

            this.assignGroup = function(group) {
                if (group.clinicianIds && group.clinicianIds.length > 0) {
                    return this.add(group);
                }

                return $.Deferred().resolve().promise();
            };

            this.unassignGroup = function(groupId, staffAccounts) {
                var dfd = $.Deferred();
                dfd.resolve();

                staffAccounts.forEach(function(clinicianId) {
                    var path = ["/api/v2/clinicians/groups", groupId, "clinicians", clinicianId].join("/");

                    var call = $.ajax({
                        type: "DELETE",
                        url: path,
                        contentType: "application/json; charset=utf-8",
                        dataType: "text"
                    });

                    dfd = $.when(dfd, call);
                });

                return dfd.promise();
            };

            //Assign clinicians to groups or unassigns them depend from context ('state' parameter)
            this.processGroupState = function(state, group) {
                var dfd = $.Deferred();

                if (state === "checked") {
                    this.assignGroup(group).done(function() {
                        $snapNotification.success("Group successfully assigned.");
                        dfd.resolve();
                    }).fail(function(exception) {
                        $snapNotification.success("Cannot assign group.");
                        window.console.error(exception);
                        dfd.reject();
                    });
                } else {
                    var that = this;
                    $snapNotification.confirmationWithCallbacks("Are you sure you want to unassign provider(s) from this group?", function(){
                        that.unassignGroup(group.groupId, group.clinicianIds).done(function() {
                            $snapNotification.success("Group successfully unassigned.");
                            dfd.resolve();
                        }).fail(function(exception) {
                            $snapNotification.success("Cannot unassigns group.");
                            window.console.error(exception);
                            dfd.reject();
                        });
                    }, function(){
                        dfd.reject(); //reject if user will select "No" option in dialog.
                    });
                }

                return dfd.promise();
            };

        }).singleton();
}(jQuery, window.snap = window.snap || {}));
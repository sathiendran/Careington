// ReSharper disable CoercedEqualsUsing
var extractstaffProfileDTO = function(staffProfile) {
    return { userId: staffProfile.userId, staffId: staffProfile.staffId, isActivated: staffProfile.isActivated };
};

function roleFunctionsComparer(a, b) {
    if (a.description === b.description) {
        return 0;
    }
    if (a.description > b.description) {
        return 1;
    }
    if (a.description < b.description) {
        return -1;
    }
}

snap.namespace("Snap.Admin")
    .use(["snapLoader"])
       .define("retainedLoader", function (snapLoader) {
           this.count = 0;
           this.showLoader = function () {
               if (this.count == 0) {
                   snapLoader.showLoader();
               }
               this.count++;
           };
           this.hideLoader = function () {
               if (this.count > 0)
                   this.count--;
               if (this.count == 0) {
                   snapLoader.hideLoader();
               }
           };
       });

snap.namespace("Snap.Admin")
    .use(["Snap.Admin.retainedLoader", "SnapNotification"])
       .define("RoleManagementDataSources", function (loader, snapNotifications) {
           var ds = this;
           this.GetCliniciansSrc = function (parent) {
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/clinicians/staffaccounts'].join(""),
                           dataType: "json"
                       },
                       parameterMap: function (options, operation) {
                           if (operation === 'read') {
                               var map = {};
                               if (!!parent.selectedRoleId) {
                                   $.extend(map, {
                                       roleId: parent.selectedRoleId
                                   });
                               }
                                $.extend(map, {
                                    staffNameFilter: parent.nameFilter
                                });
                               return map;
                           }
                       }
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data.map(function (item) {
                               var newItem = new kendo.data.ObservableObject($.extend(item, {
                                   isChecked: false,
                                   isRemoveVisible: !!parent.selectedRoleId,
                                   on_click_Remove: function () {
                                       parent.on_UnassignRole(extractstaffProfileDTO(item));
                                   },
                                   on_click_ToggleChecked: function () {
                                       this.set("isChecked", !this.isChecked);
                                   }
                               }));
                               return newItem;
                           });

                           return data;
                       },
                   },
                   requestStart: function () {
                       loader.showLoader();
                   },
                   requestEnd: function () {
                       loader.hideLoader();
                   },
                   error: function () {

                       loader.hideLoader();
                       snapNotification.error("Error loading providers");
                   },

               });
           };
           this.GetRolesSrc = function (parent) {
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/clinicians/roles'].join(""),
                           dataType: "json"
                       }
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data.map(function (item) {
                               var newItem = new kendo.data.ObservableObject($.extend(item, {
                                   isChecked: false,
                                   on_click_Role: function () {
                                       parent.on_click_Role(item.id);
                                   }
                               }));
                               return newItem;
                           });

                           return data;
                       },
                       id: "id"
                   }
               });
           };
           this.GetRoleInfoSrc = function (parent) {
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/clinicians/roles/infos'].join(""),
                           dataType: "json"
                       }
                   },
                   requestStart: function () {
                       loader.showLoader();
                   },
                   requestEnd: function () {
                       loader.hideLoader();
                   },
                   error: function () {
                       loader.hideLoader();
                       snapNotification.error("Error loading roles");
                   },
                   schema: {
                       data: function (response) {
                           var data = response.data.map(function (item) {
                               var newItem = new kendo.data.ObservableObject($.extend(item, {
                                   isExpanded: false,
                                   selectedAssignedFunction: "",
                                   selectedAvailableFunction: "",
                                   onOffStatusBool: item.onOffStatus == 'true' || item.onOffStatus == true,
                                   noEdit: item.roleCode == 'HADM',
                                   on_click_ToggleActive: function (e) {
                                       var vm = this;
                                       e.preventDefault();
                                       if (!this.noEdit) {
                                           loader.showLoader();
                                           $.ajax({
                                                   type: 'PUT',
                                                   url: '/api/v2/clinicians/roles/' + this.roleId + '/on-off',
                                                   contentType: 'application/json; charset=utf-8',
                                                   data: JSON.stringify(!vm.onOffStatusBool)
                                               })
                                               .done(function() {
                                                   vm.set("onOffStatusBool", !vm.onOffStatusBool);
                                                   parent.refreshLists();
                                               })
                                               .fail(function() {
                                                   snapNotifications.error("Error updating role status");
                                               })
                                               .always(function() {
                                                   loader.hideLoader();
                                               });
                                       } else {
                                           snapNotifications.info("You cannot turn this role off");
                                       }
                                   },
                                   on_click_Expand: function (e) {
                                       e.preventDefault();
                                       if (!this.noEdit) {
                                           if (!this.isExpanded) {
                                               parent.on_ExpandRoleInfo();
                                           }
                                           this.set("isExpanded", !this.isExpanded);
                                           this.set("availableFunctions", ds.GetAvailableRoleFunctionsSrc(this.roleId, this));
                                           this.set("assignedFunctions", ds.GetAssignedRoleFunctionsSrc(this.roleId, this));
                                       } else {
                                           snapNotifications.info("This role is not editable");
                                       }
                                   },
                                   on_click_AddSelected: function () {
                                       if (!!this.selectedAvailableFunction) {
                                           var vm = this;
                                           $.ajax({
                                                   url: '/api/v2/clinicians/roles/' + this.roleId + '/functions',
                                                   type: 'POST',
                                                   contentType: "application/json; charset=utf-8",
                                                   data: JSON.stringify({
                                                       functionId: this.selectedAvailableFunction
                                                   })
                                               })
                                               .done(function() {
                                                   vm.set("selectedAvailableFunction", "");
                                                   vm.availableFunctions.read();
                                                   vm.assignedFunctions.read();
                                               })
                                               .fail(function() {
                                                   snapNotifications.error("Error assigning role function");
                                               });
                                       }

                                   },
                                   on_click_RemoveSelected: function () {
                                       if (!!this.selectedAssignedFunction) {
                                           var vm = this;
                                           $.ajax({
                                                   url: '/api/v2/clinicians/roles/' +
                                                       this.roleId +
                                                       '/functions/' +
                                                       this.selectedAssignedFunction,
                                                   type: 'DELETE'
                                               })
                                               .done(function() {
                                                   vm.set("selectedAssignedFunction", "");
                                                   vm.availableFunctions.read();
                                                   vm.assignedFunctions.read();
                                               })
                                               .fail(function() {
                                                   snapNotifications.error("Error unassigning role function");
                                               });
                                       }
                                   },
                                   on_click_AddAll: function () {
                                       var vm = this;
                                       $.ajax({
                                               url: '/api/v2/clinicians/roles/' + this.roleId + '/all-functions',
                                               type: 'POST'
                                           })
                                           .done(function() {
                                               vm.set("selectedAvailableFunction", "");
                                               vm.availableFunctions.read();
                                               vm.assignedFunctions.read();
                                           })
                                           .fail(function() {
                                               snapNotifications.error("Error assigning all role functions");
                                           });
                                   },
                                   on_click_RemoveAll: function () {
                                       var vm = this;
                                       $.ajax({
                                               url: '/api/v2/clinicians/roles/' + this.roleId + '/all-functions',
                                               type: 'DELETE'
                                           })
                                           .done(function() {
                                               vm.set("selectedAvailableFunction", "");
                                               vm.availableFunctions.read();
                                               vm.assignedFunctions.read();
                                           })
                                           .fail(function() {
                                               snapNotifications.error("Error unassigning all role functions");
                                           });
                                   },
                                   on_select_Available: function (functionId) {
                                       this.set("selectedAvailableFunction", functionId);
                                   },
                                   on_select_Assigned: function (functionId) {
                                       this.set("selectedAssignedFunction", functionId);
                                   },
                                   on_click_Delete: function () {
                                       parent.on_delete_Role(this.roleId);
                                   }
                               }));
                              
                               return newItem;
                           });

                           return data;
                       },
                       id: "roleId"
                   }
               });
           };


           this.GetAvailableRoleFunctionsSrc = function (roleId, parent) {
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: [snap.baseUrl, '/api/v2/clinicians/roles/' + roleId + '/available-functions'].join(''),
                           dataType: "json"
                       }
                   },
                   schema: {
                       data: function (response) {

                           return response.data.map(function (item) {
                               return $.extend(item, {
                                   on_click_RoleFunction: function () {
                                       parent.on_select_Available(item.functionId);
                                   }
                               });

                           }).sort(roleFunctionsComparer);
                       },
                       id: "functionId"
                   },
                   requestStart: function () {
                       loader.showLoader();
                   },
                   requestEnd: function () {
                       loader.hideLoader();
                   },
                   error: function () {
                       loader.hideLoader();
                       snapNotifications.error("Error loading available role functions");
                   },
               });
           };

           this.GetAssignedRoleFunctionsSrc = function (roleId, parent) {
               var crudURL = [snap.baseUrl, '/api/v2/clinicians/roles/' + roleId + '/functions'].join('');
               return new kendo.data.DataSource({
                   transport: {
                       read: {
                           url: crudURL,
                           dataType: "json"
                       },
                       destroy: {
                           dataType: "json",
                           type: "DELETE",
                           url: function (item) {
                               return crudURL + "/" + item.id;
                           }
                       },
                       create: {
                           dataType: "json",
                           type: "POST",
                           url: crudURL
                       }
                   },
                   schema: {
                       data: function (response) {

                           return response.data.map(function (item) {
                               return $.extend(item, {
                                   on_click_RoleFunction: function () {
                                       parent.on_select_Assigned(item.functionId);
                                   }
                               });

                           }).sort(roleFunctionsComparer);
                       },
                       id: "functionId"
                   },
                   requestStart: function () {
                       loader.showLoader();
                   },
                   requestEnd: function () {
                       loader.hideLoader();
                   },
                   error: function () {
                       loader.hideLoader();
                       snapNotifications.error("Error loading assigned role functions");
                   },
               });
           };

       }).singleton();

snap.namespace("Snap.Admin").use(["snapNotification", "snapHttp", "Snap.Admin.retainedLoader", "Snap.Admin.RoleManagementDataSources"])
    .extend(kendo.observable)
    .define("RolesManagementViewModel", function ($snapNotification, $snapHttp, retainedLoader, $ds) {
        var $vm = this;
        this.newRoleDescription = "";
        this.selectedRoleId = "";
        this.nameFilter = "";
        this.roles = $ds.GetRoleInfoSrc(this);
        this.rolesCheckedList = $ds.GetRolesSrc(this);
        this.cliniciansCheckedList = $ds.GetCliniciansSrc(this);
        this.isAllCliniciansSelected = false;
     
        this.refreshLists = function () {
            this.set("selectedRoleId", "");
            this.roles.read();
            this.rolesCheckedList.read();
            this.refreshCliniciansList();
        };

        this.refreshCliniciansList = function() {
            this.isAllCliniciansSelected = false;
            this.cliniciansCheckedList.read();
        };
        this.on_ExpandRoleInfo = function() {
            this.roles.data()
                .forEach(function(item) {
                    item.set("isExpanded", false);
                });
        };
        this.on_UnassignRole = function (staffProfile) {
            if (this.selectedRoleId) {
                var profiles = [staffProfile];
                if (!(this.roles.data().filter(function (item) { return item.roleId == $vm.selectedRoleId; })[0].roleCode == 'HADM' && this.cliniciansCheckedList.data().length <= 1)) {
                     $snapNotification.confirmationWithCallbacks("Do you really want to remove this user from the selected role?", function () {
                        retainedLoader.showLoader();
                        $.ajax({
                            type: "DELETE",
                            url: "/api/v2/clinicians/roles/" + $vm.selectedRoleId + "/staff",
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(profiles)
                        }).done(function () {
                            $snapNotification.success("Role is unassigned successfully");
                            $vm.refreshCliniciansList();
                        }).fail(function () {
                            $snapNotification.error("Error unassigning role");
                        }).always(function () {
                            retainedLoader.hideLoader();
                        });
                    });
                } else {
                    $snapNotification.error("Hospital should have at least one Master Admin");
                }
           }
       };
       this.on_delete_Role = function (roleId) {
           $snapNotification.confirmationWithCallbacks("Are you sure that you want to delete role?", function () {
               $.ajax({
                   type: 'DELETE',
                   url: '/api/v2/clinicians/roles/' + roleId
               }).done(function () {
                   $snapNotification.success("Role is deleted successfully");
                   $vm.refreshLists();
               }).fail(function () {
                   $snapNotification.error("Error removing roles");
               });
           });
        
       };
       this.on_click_AddRole = function () {

           if (isEmpty(this.newRoleDescription)) {
               $snapNotification.error("Please enter role name.");
               return;
           }

           retainedLoader.showLoader();
           $.ajax({
               type: 'GET',
               url: '/api/v2/clinicians/roles/names/' + encodeURIComponent(this.newRoleDescription)
           }).done(function (resp) {
               if (!resp) {
                   $.ajax({
                       type: 'POST',
                       url: '/api/v2/clinicians/roles/',
                       contentType: 'application/json; charset=utf-8',
                       data: JSON.stringify({
                           description: $vm.newRoleDescription
                       })
                   }).done(function () {
                       $vm.refreshLists();
                       $vm.set("newRoleDescription", "");
                   }).fail(function () {
                       $snapNotification.error("Please enter role name");
                   }).always(function () {
                       retainedLoader.hideLoader();
                   });
               } else {
                   $snapNotification.error("A Role with Same Name already Exists.");
                   retainedLoader.hideLoader();
               }
           }).fail(function (xhr) {
               if (xhr.statusCode == 401) {
                   window.location.href = "Admin/Login";
               } else {
                   $snapNotification.error("Error adding role");
               }
               retainedLoader.hideLoader();
           });

       };
       this.on_click_Role = function (roleId) {
           retainedLoader.showLoader();
           this.set("selectedRoleId", roleId);
           this.isAllCliniciansSelected = false;
           this.cliniciansCheckedList.read().always(function () {
               retainedLoader.hideLoader();
           });
       };

       this.on_click_Unselect_Role = function () {
           retainedLoader.showLoader();
           this.set("selectedRoleId", "");
           this.isAllCliniciansSelected = false;
           var clinicianListLoaded = this.cliniciansCheckedList.read();
           var rolesListLoaded = this.rolesCheckedList.read();
           $.when(clinicianListLoaded, rolesListLoaded).always(function () {
               retainedLoader.hideLoader();
           });
       };
       this.on_click_SelectAll_Clinicians = function () {
           $vm.isAllCliniciansSelected = !$vm.isAllCliniciansSelected;
           this.cliniciansCheckedList.data().forEach(function (item) {
               item.set("isChecked", $vm.isAllCliniciansSelected);
           });
           this.trigger("change", { field: "cliniciansCheckedList" });
       };
        this.on_keyp_StaffNameFilter = function() {
            $vm.refreshCliniciansList();
        };
        this.on_drop_AssignRole = function(e) {
            var roleId = e.dropTarget.data().roleId;
            var clinicians = $vm.cliniciansCheckedList.data()
                .filter(function(item) {
                    return item.isChecked;
                });
            $.ajax({
                    type: 'POST',
                    url: '/api/v2/clinicians/roles/' + roleId + '/staff',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(clinicians.map(extractstaffProfileDTO))
                })
                .done(function() {
                    $snapNotification.success("Role Assigned to the User(s) Successfully");
                    $vm.refreshCliniciansList();
                })
                .fail(function() {
                    $snapNotification.error("Unable to assign role to selected accounts");
                });
        };

        this.InitDragAndDrop = function(source, target) {
            $(source)
                .kendoDraggable({
                    filter: '.dragable',
                    hint: function() {
                        var dragHint = $(source).clone();

                        dragHint.find('li.dragable')
                            .each(function(index, value) {
                                $(value)
                                    .css({
                                        "opacity": 0.6
                                    });
                            });
                        dragHint.find('li.dragable > input, li.dragable > a')
                            .each(function(index, value) {
                                $(value).remove();
                            });
                        dragHint.find('li:not(.dragable)')
                            .each(function(index, value) {
                                $(value).remove();
                            });
                        dragHint.css({
                            "list-style": "none",
                            "background": "none",
                        });
                        return dragHint;
                    }
                });

            $(target)
                .kendoDropTargetArea({
                    filter: ".drop-target",
                    drop: $vm.on_drop_AssignRole
                });
        };
    });


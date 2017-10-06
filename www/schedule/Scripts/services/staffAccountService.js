(function ($, snap) {
    snap.namespace("snap.service").using(["snapHttp"]).define("staffAccountService", function ($http) {

        /***** Account Info *****/
        this.getAccountInfo = function (staffUserId) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/staffprofiles/{0}', staffUserId);
            return $http.get(path);
        };
        this.deleteProfile = function () {

            return $.ajax({
                type: "DELETE",
                url: snap.string.formatString('/api/v2/clinicians/staffprofiles/{0}', snap.staffUserId),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.reActivate = function () {
            return $.ajax({
                type: 'PUT',
                url: snap.string.formatString('/api/v2/clinicians/staffprofiles/{0}/reactivate', snap.staffUserId),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        }
        this.editAccountInfo = function (staffUserId, data) {
            var path = snap.string.formatString('/api/v2/clinicians/staffprofiles/{0}', staffUserId);
            return $.ajax({
                type: "PUT",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });
        };

        this.addAccount = function (data) {
            var path = '/api/v2/clinicians/pendingstaffprofile';
            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });
        };

        this.getAllStaffAccountsForScheduling = function (data) {
            var path = ["/api/v2.1/providers/", snap.hospitalSession.hospitalId, "/clinicians?roleFunctions=", snap.security.conduct_virtual_consultations].join("");

            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: data
            });
        }; 

        this.getAllPatientAccountsForScheduling = function (data) {
            var path = ["/api/v2.1/providers", snap.hospitalSession.hospitalId, "patients"].join("/");
          
            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: data
            });
        };

        /***** Tags *****/
        this.getIndividualTags = function (staffUserId) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/{0}/tags', staffUserId);
            return $http.get(path);
        };
        this.assignTag = function (adiminUserId, staffUserId, hospitalId, tag) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/staffs/{0}/tags', adiminUserId);
            var data = {
                staffId: staffUserId,
                hospitalId: hospitalId,
                insertText: tag
            };

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            });
        };

        this.unassignTag = function (tagId, staffUserId) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/tags/{0}/staff', tagId);
            var data = [{ userId: staffUserId, isActivated: true }];
            return $.ajax({
                type: "DELETE",
                url: path,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        /***** Roles *****/
        this.getIndividualRoles = function (staffUserId, hospitalId) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/{0}/hospitals/{1}/roles', staffUserId, hospitalId);

            return $http.get(path);
        };

        this.assignRoles = function (roleId, staffUsers) {
            var path = snap.string.formatURIComponents("/api/v2/clinicians/roles/{0}/staff", roleId);

            return $.ajax({
                type: "POST",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(staffUsers)
            });
        },

        this.assignRole = function (roleId, staffUserId) {
            var data = [{ userId: staffUserId, isActivated: true }];
            return this.assignRoles(roleId, data);
        };

        this.unassignRoles = function (roleId, staffUsers) {
            var path = snap.string.formatURIComponents("/api/v2/clinicians/roles/{0}/staff", roleId);

            return $.ajax({
                type: "DELETE",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(staffUsers)
            });
        };

        this.unassignRole = function (roleId, staffUserId) {
            var data = [{ userId: staffUserId, isActivated: true }];
            return this.unassignRoles(roleId, data);
        };

        this.validateClinicianLimit = function (staffUserId, hospitalId, roles) {
            var path = snap.string.formatURIComponents('/api/v2/clinicians/{0}/limit', staffUserId);

            return $.ajax({
                type: "GET",
                url: path,
                data: "roles=" + roles,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        this.hasUserInteractions = function (roles) {
            var path = '/api/v2/clinicians/patientinteraction';
            return $.ajax({
                type: "GET",
                url: path,
                data: "roles=" + roles,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.canConductConsultations = function (userId) {
            var path = ["/api/v2/clinicians", userId, "rolefunctions/conductconsultation"].join("/")
            return $.ajax({
                type: "GET",
                url: path,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };

        this.deleteProfileImage = function(userId) {
            return $.ajax({
                url: [snap.baseUrl, "/api/v2.1/clinicians/profile-images?clinicianUserId=" + userId].join(""),
                type: "DELETE",                
                contentType: "application/json; charset=utf-8"
            });
        };

    }).singleton();
}(jQuery, window.snap = window.snap || {}));
//@ sourceURL=snapWaitingRoomConsultationsHub.js

(function(global, $, snap) {
    "use strict";

    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("snapWaitingRoomConsultationsHub", function($hubModel) {
            var snapWaitingRoomConsultationsHub = $.connection.snapWaitingRoomConsultationsHub,
                scope = this;

            this._name = "snapWaitingRoomConsultationsHub";

            $hubModel._initModel(snapWaitingRoomConsultationsHub, this);

            this._initClient = function() {
                snapWaitingRoomConsultationsHub.client = {};
                snapWaitingRoomConsultationsHub.client.dispatchPatientConsultationInformation = function(data) {
                    if (data) {
                        scope.triggerEvent("dispatchPatientConsultationInformation", data);
                    }
                };
                snapWaitingRoomConsultationsHub.client.dispatchPatientQueuePatientCount = function (patientCount) {
                    scope.triggerEvent("dispatchPatientQueuePatientCount", patientCount);
                };

                snapWaitingRoomConsultationsHub.client.lockRequest = function(patientQueueEntryId, physicianName) {
                    scope.triggerEvent("lockRequest", patientQueueEntryId, physicianName);
                };

                snapWaitingRoomConsultationsHub.client.unlockRequest = function (patientQueueEntryId) {
                    scope.triggerEvent("unlockRequest", patientQueueEntryId);
                };

                snapWaitingRoomConsultationsHub.client.appointmentDismissed = function (appt) {
                    scope.triggerEvent("appointmentDismissed", appt);
                };

                snapWaitingRoomConsultationsHub.client.appointmentSaveClosed = function (appt) {
                    scope.triggerEvent("appointmentSaveClosed", appt);
                };

                snapWaitingRoomConsultationsHub.client.dispatchAdminPatientQueue = function(data) {
                    scope.triggerEvent("dispatchAdminPatientQueue", data);
                };

                snapWaitingRoomConsultationsHub.client.dispatchAdminPatientQueuePatientCount = function(count) {
                    scope.triggerEvent("dispatchAdminPatientQueuePatientCount", count);
                };

                snapWaitingRoomConsultationsHub.client.onUpdateFlag = function(appointmentId, flag) {
                    scope.triggerEvent("onUpdateFlag", appointmentId, flag);
                };           
            };

            this._initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.refresh = function() {
                return this._invokeServerFunction("refresh");
            };

            this.isConsulationAvailableForView = function(consultationId) {
                return this._invokeServerFunction("isConsulationAvailableForView", consultationId);
            };

            this.lockRequest = function (patientQueueEntryId) {
                return this._invokeServerFunction("lockRequest", patientQueueEntryId);
            };

            this.unlockRequest = function(patientQueueEntryId) {
                return this._invokeServerFunction("unlockRequest", patientQueueEntryId);
            };

            this.refreshAdminPatientQueue = function() {
                return this._invokeServerFunction("refreshAdminPatientQueue");
            };

            this.renewLock = function(patientQueueEntryId) {
                return this._invokeServerFunction("renewLock", patientQueueEntryId);
            };

            this.unremovableLockRequest = function(patientQueueEntryId) {
                return this._invokeServerFunction("unremovableLockRequest", patientQueueEntryId);
            };

            this.clearLocks = function() {
                return this._invokeServerFunction("clearLocks");
            };

        }).singleton();
})(window, jQuery, snap);

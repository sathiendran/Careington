//@ sourceURL=snapWaitingRoomConsultationsHub.js

(function(global, $) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("snapWaitingRoomConsultationsHub", function($hubModel) {
            var snapWaitingRoomConsultationsHub = $.connection.snapWaitingRoomConsultationsHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(snapWaitingRoomConsultationsHub, this);

            var initEvent = function() {
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

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function() {
                initConnection();
                
                if (isInitialized) {
                    window.console.log("snapWaitingRoomConsultationsHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("snapWaitingRoomConsultationsHub started");
                });

                initEvent();
            };

            this.isHubStarted = function() {
                return isStarted;
            };

            this.isHubInitialized = function() {
                return isInitialized;
            };

            this.markAsStarted = function(value) {
                isStarted = !!value;
            };

            this.refresh = function() {
                return snapWaitingRoomConsultationsHub.server.refresh();
            };

            this.isConsulationAvailableForView = function(consultationId) {
                return snapWaitingRoomConsultationsHub.server.isConsulationAvailableForView(consultationId);
            };

            this.lockRequest = function (patientQueueEntryId) {
                return snapWaitingRoomConsultationsHub.server.lockRequest(patientQueueEntryId);
            };

            this.unlockRequest = function(patientQueueEntryId) {
                return snapWaitingRoomConsultationsHub.server.unlockRequest(patientQueueEntryId);
            };

            this.refreshAdminPatientQueue = function() {
                return snapWaitingRoomConsultationsHub.server.refreshAdminPatientQueue();
            };

            this.renewLock = function() {
                return snapWaitingRoomConsultationsHub.server.renewLock();
            };

            this.unremovableLockRequest = function(patientQueueEntryId) {
                return snapWaitingRoomConsultationsHub.server.unremovableLockRequest(patientQueueEntryId);
            };

        }).singleton();
})(window, jQuery);

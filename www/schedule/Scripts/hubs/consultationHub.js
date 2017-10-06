/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapNotification.js" />
/// <reference path="../core/snapHttp.js" />

;(function($, snap) {
    "use strict";

    snap.ConsulationPageType = {
        CustomerWaitingPage: 1,
        PatientPhysicianConsultationPage: 2,
        GuestParticipantConsultationPage: 3
    };

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("ConsultationHub", function($hubModel) {
            var scope = this,
                consultationHub = $.connection.consultationHub;

            this._name = "consultationHub";

            $hubModel._initModel(consultationHub, this);

            //init Hub
            this._initClient = function() {
                consultationHub.client.onPatientAvailable = function() {
                    scope.triggerEvent("patientAvailable");
                };
                consultationHub.client.onPatientUnavailable = function() {
                    scope.triggerEvent("patientUnavailable");
                };
                consultationHub.client.onProviderUnavailable = function() {
                    scope.triggerEvent("providerUnavailable");
                };
                consultationHub.client.onProviderAvailable = function() {
                    scope.triggerEvent("providerAvailable");
                };
                consultationHub.client.onParticipantConnected = function(data) {
                    scope.triggerEvent("participantConnected", data);
                };
                consultationHub.client.onParticipantDisconnected = function(disconnectedSelf) {
                    scope.triggerEvent("participantDisconnected", disconnectedSelf);
                };
                consultationHub.client.onParticipantDeclined = function () {
                    scope.triggerEvent("participantDeclined");
                };
                consultationHub.client.onViewAnotherDoctor = function(ViewMode) {
                    scope.triggerEvent("viewAnotherDoctor", ViewMode);
                };
                consultationHub.client.onPatientDisconnectedFromWaitingRoom = function() {
                    scope.triggerEvent("patientDisconnectedFromWaitingRoom");
                };
                consultationHub.client.onConsultationEnded = function() {
                    scope.triggerEvent("consultationEnded");
                };
                consultationHub.client.onPatientEndedConsultation = function() {
                    scope.triggerEvent("onPatientEndedConsultation");
                };
                consultationHub.client.onConsultationReview = function() {
                    scope.triggerEvent("consultationReview");
                };
                consultationHub.client.onPatientInMobileDevice = function(flag) {
                    scope.triggerEvent("patientInMobileDevice", flag);
                };
                consultationHub.client.onCustomerDefaultWaitingInformation = function() {
                    scope.triggerEvent("customerDefaultWaitingInformation");
                };
                consultationHub.client.onConsultationStarted = function() {
                    scope.triggerEvent("consultationStarted");
                };
                consultationHub.client.notifyContactNumberChange = function(number) {
                    scope.triggerEvent("patientContactNumberChange", number);
                };
                consultationHub.client.onCaptureImage = function(imageId) {
                    scope.triggerEvent("onImageReceived", imageId);
                };
                consultationHub.client.onRemoveCaptureImage = function(imageId) {
                    scope.triggerEvent("onImageRemoved", imageId);
                };
                consultationHub.client.onRemoveSnapshotFolder = function() {
                    scope.triggerEvent("onRemoveSnapshotFolder");
                };
                consultationHub.client.onSetupSnapshotsFolder = function(folderId) {
                    scope.triggerEvent("onSetupSnapshotsFolder", folderId);
                };
                consultationHub.client.onPatientMarkConsultationAsFullfill = function() {
                    scope.triggerEvent("onPatientMarkConsultationAsFullfill");
                };
                consultationHub.client.onSynchronizeSessionTimer = function () {
                    scope.triggerEvent("synchronizeSessionTimer");
                };
                consultationHub.client.onParticipantStatusChanged = function (participantId, status, message) {
                    scope.triggerEvent("onParticipantStatusChanged", status, participantId, message);
                };
            };

            this._initConnection = function(opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                var $consultationId = snap.consultationSession ? snap.consultationSession.consultationId : snap.consultationId;
                $.connection.hub.qs["consultationId"] = $consultationId;
                
                if (opt && opt.pageType) {
                    if (opt.pageType == snap.ConsulationPageType.GuestParticipantConsultationPage) {
                        $.connection.hub.qs["JWT-Participant"] = sessionStorage.getItem("participantToken");
                        delete $.connection.hub.qs["Bearer"];

                        $.connection.hub.qs["participant"] = 1;
                    } else {
                        $.connection.hub.qs["Bearer"] = snap.userSession.token;
                    }

                    if (opt.pageType == snap.ConsulationPageType.CustomerWaitingPage) {
                        var consultationinitaction = sessionStorage.getItem("consultationinitaction");
                        if (!consultationinitaction) {
                            consultationinitaction = "0";
                        }
                        sessionStorage.removeItem("consultationinitaction");
                        $.connection.hub.qs["waitingroom"] = 1;
                        $.connection.hub.qs["consultationinitaction"] = consultationinitaction;
                    }
                }
            };

            this.reviewConsultationReview = function() {
                return this._invokeServerFunction("reviewConsultationReview");
            };

            this.startConsultation = function() {
                return this._invokeServerFunction("startConsultation");
            };

            this.endConsultation = function() {
                return this._invokeServerFunction("endConsultation");
            };

            this.disconnectConsultation = function() {
                return this._invokeServerFunction("disconnectConsultation");
            };

            this.updatePatientNumber = function(number) {
                return this._invokeServerFunction("updatePatientNumber", number);
            };

            this.updateParticipantDetails = function(id, name) {
                return this._invokeServerFunction("updateParticipantDetails", id, name);
            };

            this.getPatientTemporaryContactNumber = function() {
                return this._invokeServerFunction("getPatientTemporaryContactNumber");
            };

            this.removeCaptureImage = function(imgId) {
                return this._invokeServerFunction("removeCaptureImage", imgId);
            };

            this.removeSnapshotFolder = function(folderId) {
                return this._invokeServerFunction("removeSnapshotFolder", folderId);
            };


            this.notifyCaptureImage = function(imgId) {
                return this._invokeServerFunction("notifyCaptureImage", imgId);
            };

            this.isPatientInMobileDevice = function() {
                return this._invokeServerFunction("isPatientInMobileDevice");
            };

            this.disconnectPatient = function() {
                return this._invokeServerFunction("disconnectPatient");
            };

            this.disconnectGuest = function(participantId) {
                return this._invokeServerFunction("disconnectGuest", participantId);
            };

            this.getSessionSecondsElapsed = function () {
                return this._invokeServerFunction("getSessionSecondsElapsed");
            };
        }).singleton();


}(jQuery, snap));

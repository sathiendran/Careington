/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapNotification.js" />
/// <reference path="../core/snapHttp.js" />



;
(function($) {
    snap.ConsulationPageType = {
        CustomerWaitingPage: 1,
        PatientPhysicianConsultationPage: 2,
        GuestParticipantConsultationPage: 3
    };

    snap.namespace("snap.hub")
        .use(["snap.hub.hubModel"])
        .define("ConsultationHub", function ($hubModel) {
            var scope = this,
                isStarted = false,
                isInitialized = false,
                consultationHub = $.connection.consultationHub;

            $hubModel._initModel(consultationHub, this);

            //init Hub
            var initEvent = function() {
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
                consultationHub.client.onParticipantDisconnected = function() {
                    scope.triggerEvent("participantDisconnected");
                };
                consultationHub.client.onViewAnotherDoctor = function(ViewMode) {
                    scope.triggerEvent("viewAnotherDoctor", ViewMode);
                };
                consultationHub.client.onCustomerDisconnected = function() {
                    scope.triggerEvent("customerDisconnected");
                };
                consultationHub.client.onPatientDisconnectedFromWaitingRoom = function() {
                    scope.triggerEvent("patientDisconnectedFromWaitingRoom");
                };
                consultationHub.client.onConsultationEnded = function() {
                    scope.triggerEvent("consultationEnded");
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
                consultationHub.client.onPatientEndConsultation = function () {
                    scope.triggerEvent("onPatientEndConsultation");
                };
                consultationHub.client.onPatientMarkConsultationAsFullfill = function () {
                    scope.triggerEvent("onPatientMarkConsultationAsFullfill");
                };
            };

            var initConnection = function (pageType) {
                var $consultationId = snap.consultationSession ? snap.consultationSession.consultationId : snap.consultationId;
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (pageType == snap.ConsulationPageType.GuestParticipantConsultationPage) {
                    $.connection.hub.qs["JWT-Participant"] = sessionStorage.getItem("participantToken");
                    delete $.connection.hub.qs["Bearer"];
                } else {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }

                $.connection.hub.qs["consultationId"] = $consultationId;
                if (pageType == snap.ConsulationPageType.CustomerWaitingPage) {
                    var consultationinitaction = sessionStorage.getItem("consultationinitaction");
                    if (!consultationinitaction) {
                        consultationinitaction = "0";
                    }
                    sessionStorage.removeItem("consultationinitaction");
                    $.connection.hub.qs["waitingroom"] = 1;
                    $.connection.hub.qs["consultationinitaction"] = consultationinitaction;

                }
                if (pageType == snap.ConsulationPageType.GuestParticipantConsultationPage) {
                    $.connection.hub.qs["participant"] = 1;
                }
            };
            this.name = "consultation Hub";
            this.init = function(pageType) {
                initConnection(pageType);
                if (isInitialized) {
                    window.console.log("consultationHub was initialized before");
                    return;
                }
                isInitialized = true;

                initEvent();

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("consultationHub started");
                });
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

            this.getConsultationTime = function() {
                return consultationHub.server.getConsultationTime();
            };

            this.checkDroppedConsultation = function() {
                return consultationHub.server.checkDroppedConsultation();
            };
            this.checkDoctorActiveState = function() {
                return consultationHub.server.checkDoctorActiveState();
            };
            this.savedDroppedConsultation = function() {
                return consultationHub.server.savedDroppedConsultation();
            };

            this.reviewConsultationReview = function() {
                return consultationHub.server.reviewConsultationReview();
            };

            this.joinCustomer = function() {
                return consultationHub.server.joinCustomer();
            };

            this.startConsultation = function() {
                return consultationHub.server.startConsultation();
            };

            this.endConsultation = function() {
                return consultationHub.server.endConsultation();
            };

            this.disconnectConsultation = function() {
                return consultationHub.server.disconnectConsultation();
            };

            this.updatePatientNumber = function(number) {
                return consultationHub.server.updatePatientNumber(number);
            };

            this.updateParticipantDetails = function(id, name) {
                return consultationHub.server.updateParticipantDetails(id, name);
            };

            this.getPatientTemporaryContactNumber = function() {
                return consultationHub.server.getPatientTemporaryContactNumber();
            };

            this.getConsultationTime = function() {
                return consultationHub.server.getConsultationTime();
            };

            this.notifyClientDisconnect = function() {
                return consultationHub.server.notifyClientDisconnect();
            };

            this.removeCaptureImage = function(imgId) {
                return consultationHub.server.removeCaptureImage(imgId);
            };

            this.notifyCaptureImage = function(imgId) {
                return consultationHub.server.notifyCaptureImage(imgId);
            };

            this.isPatientInMobileDevice = function () {
                return consultationHub.server.isPatientInMobileDevice();
            }

            this.disconnectPatient = function() {
                return consultationHub.server.disconnectPatient();
            };

        }).singleton();


}(jQuery));

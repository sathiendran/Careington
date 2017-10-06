;
(function($, snap) {
    "use strict";

    snap.namespace("snap.common")
        .define("messages", function() {
            this.consultationMessages = {
                // messages shown in consultation room.
                patientDisconnected: "The Patient has been disconnected from the consultation.",
                patientUnavailable: "The Patient is currently not available for this consultation",
                patientDisconnectedFromWaiting: "The Patient has left the waiting room and is not available for the consultation",
                patientReentered: "The Patient has re-entered the consultation.",
                patientReenteredWaiting: "The Patient has re-entered the waiting room.",
                patientMarkComplete: "The Patient has marked the consultation complete. Please complete your notes and end the session when done.",
                patientMarkCompleteForGuest: "The Patient has marked the consultation complete.",
                patientLeft: "The Patient has left the consultation. Please complete your notes and end the session when done.",
                patientLeftForGuest: "The Patient has left the consultation.",

                providerDisconnected: "The Provider has been disconnected from this consultation. Waiting for the Provider to enter the room",
                providerReentered: "The Provider has re-entered the consultation.",
                providerMarkComplete: "The Provider has marked your consultation as complete.",

                participantEntered: "One of the participants has joined this consultation.",
                participantDisconnected: "One of the participants has been disconnected from this consultation.",
                participantLeft: "One of the participants has left this consultation.",
                participantDeclined: "One of the participants has declined the invitation.",

                consultationAlreadyCompleted: "This consultation has been already completed.",
                consultationInvalid: "This consultation is no longer valid.",
                consultationEndedBecauseProviderDisconnected: "Seems that the Provider is disconnected.",
                consultationEnded: "The Consultation ended. Please wait while we transfer you to the home page.",
                consultationDropped: "This consultation has been dropped. If you feel this dropped is in error, please contact your provider.",
                consultationEndedForGuest: "The Consultation is ended.",
                consultationViewAnotherDoctor: "This consultation has already been started by another provider.",


                endConsultation: "You currently have a consultation in progress.\n Are you sure you want to disconnect from this consultation?",
                endConsultationForProvider: "You currently have a consultation in progress.\n Are you sure you want to end this consultation?",


                getUserLeftMessage: function(userName) {
                    return userName + " has left this consultation.";
                }
            };

            this.noneReportedMessage = "None Reported";
            this.shortNoneReportedMessage = "N/R";

        }).singleton();

}(jQuery, snap));
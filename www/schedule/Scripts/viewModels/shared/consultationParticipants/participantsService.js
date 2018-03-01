
(function ($, snap) {
    "use strict";

    snap.namespace("snap.shared.consultationParticipants").use([
            "snapHttp", 
            "snap.enums.ParticipantTypeCodes",
            "snap.enums.PatientConnectionStatusCodes"
        ])
        .define("participantsService", function($snapHttp, $participantTypeCodes, $patientConnectionStatusCodes) {
            var userGroupFilters = {
                notSelected: {
                    name: " Filter By",
                    groupId: -1
                },
                familyGroup: {
                    name: "Patient's Family Group",
                    groupId: -2  
                }
            };

            function ParticipantsServiceForStandartConsultation(c) {
                var consultation = c;

                // opt: {name, email}
                this.add = function(opt) {
                    var path = ['/api/v2/patients/consultations/', consultation.consultationInfo.consultationId, '/participants'].join("");

                    return $snapHttp.ajax({
                        url: path,
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({
                            participantType: $participantTypeCodes.guest,
                            firstName: opt.name,
                            lastName: "",
                            email: opt.email
                        })
                    });
                };

                // opt: {participantId, name, email}
                this.sentInvitationEmail = function(opt) {
                    var path = '/api/v2/mail/participants/' + opt.participantId;

                    var data = {
                        name: opt.name,
                        email: opt.email
                    };

                    return $snapHttp.ajax({
                        url: path,
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(data)
                    });
                };

                this.parseParticipants = function(participants) {
                    var result = participants.map(function(participant) {
                        return {
                            firstName: participant.firstName,
                            lastName: participant.lastName,
                            email: participant.email || "",
                            participantId: participant.participantId,
                            status: participant.status,
                            personId: participant.personId,
                            participantTypeCode: participant.participantType
                        };
                    });

                    return result;
                };

                this.disconnectParticipant = function(id) {
                    consultation.consultationHub.disconnectGuest(id);
                };

                this.type = "participantsServiceForStandartConsultation";

                this.getPatientsFilterOptions = function() {
                    return [
                        userGroupFilters.notSelected,
                        userGroupFilters.familyGroup
                    ];
                };

                this.isPatientUseParticipantSeat = function(patientConnectionStatus) {
                    if(typeof patientConnectionStatus === "undefined" || patientConnectionStatus === null) {
                        return true;
                    }

                    var isInArray = [
                        $patientConnectionStatusCodes.patientEndedConsultation,
                        $patientConnectionStatusCodes.patientMarkConsultationAsFullfill,
                        $patientConnectionStatusCodes.patientRemovedByProvider,
                        $patientConnectionStatusCodes.patientDroppedByProvider,
                    ].indexOf(patientConnectionStatus) > -1;
                    
                    return !isInArray;
                };
            }

            function ParticipantsServiceForOpenConsultation(c) {
                var openConsultation = c;

                // opt: {name, email}
                this.add = function(opt) {
                    var path = ['/api/v2.1/openconsulation/meetings/', openConsultation.meetingInformation.meetingId, '/participants'].join("");

                    var authHdrF = snap.guestSession && snap.guestSession.participantToken ? "JWT-Participant " + snap.guestSession.participantToken : "";
                    var authHdr = snap.userSession && snap.userSession.token ? "Bearer " + snap.userSession.token : authHdrF;

                    return $snapHttp.ajax({
                        url: path,
                        type: "POST",
                        headers: {
                            'Authorization': authHdr,
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                        dataType: "json",
                        data: JSON.stringify({
                            participantType:  $participantTypeCodes.guest,
                            firstName: opt.name,
                            lastName: "",
                            email: opt.email
                        })
                    });
                };

                // opt: {participantId, name, email}
                this.sentInvitationEmail = function(opt) {
                    var path = '/api/v2/mail/participants/' + opt.participantId + "/openconsultation";

                    var authHdr = snap.userSession && snap.userSession.token ? "Bearer " + snap.userSession.token : snap.guestSession && snap.guestSession.participantToken ? "JWT-Participant " + snap.guestSession.participantToken : "";

                    var data = {
                        name: opt.name,
                        email: opt.email
                    };                    

                    return $snapHttp.ajax({
                        url: path,
                        type: "POST",
                        headers: {
                            'Authorization': authHdr,
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                        dataType: "json",
                        data: JSON.stringify(data)
                    });
                };

                this.parseParticipants = function(participants) {
                    var result = participants.map(function(participant) {
                        return {
                            firstName: participant.person.name.given,
                            lastName: participant.person.name.family,
                            email: participant.person.email || "",
                            profileImagePath: participant.person.photoUrl,
                            participantId: participant.participantId,
                            status: participant.status,
                            personId: participant.personId,
                            participantTypeCode: participant.participantTypeCode
                        };
                    });

                    return result;
                };

                this.disconnectParticipant = function(id) {
                    openConsultation.meetingHub.disconnectPartisipant(id);
                };

                this.type = "participantsServiceForOpenConsultation";

                this.getPatientsFilterOptions = function() {
                    return [
                        userGroupFilters.notSelected,
                    ];
                };

                this.isPatientUseParticipantSeat = function() {
                    return false;
                };
            }

            this.createParticipantsServiceForStandartConsultation = function(consultation) {
                return new ParticipantsServiceForStandartConsultation(consultation);
            };

            this.createParticipantsServiceForOpenConsultation = function(openConsultation) {
                return new ParticipantsServiceForOpenConsultation(openConsultation);
            };

            this.userGroupFilters = userGroupFilters;

        }).singleton();
}(jQuery, snap));

/// <reference path="../../jquery-2.1.3.js" />
/// <reference path="../../kendo.all.min.intellisense.js" />
/// <reference path="../../core/snap.core.js" />





; (function ($, $snap) {

    $snap.namespace("snap.Encounter").use(["SnapNotification"])
        .extend(kendo.observable)
        .define("guestViewModel", function ($snapNotification) {
            var $scope = this;
            var tabStrip = null;
            this.joinToken = "";
            this.consulationType = 1;
            this.isBlankConsulation = false;
            this.consultationId = 0;
            this.title = "";
            this.senderUserId = 0;
            this.time = "";
            this.timeZone = "";
            this.date = "";


            this.dateString = function (_dateString) {

                var dateString = new Date(_dateString),
                    day = dateString.getDate(),
                    month = dateString.getMonth() + 1,
                    year = dateString.getFullYear(),
                    timeZone = dateString.toString().match(/\(([A-Za-z\s].*)\)/)[1],
                    hour = dateString.getHours() - (dateString.getHours() >= 12 ? 12 : 0),
                    minutes = dateString.getMinutes(),
                    period = dateString.getHours() >= 12 ? 'PM' : 'AM';

                    if (day < 10)
                    {
                        day = '0' + day
                    }
                    if (month < 10)
                    {
                        month = '0' + month
                    };

                    if (minutes > 10) {
                        minutes = '0' + minutes;
                    } else if (minutes == 0) {
                        minutes = "00";
                    }
                    
                    //date
                    var date = month+'/'+day+'/'+year;
                    this.set("date", date);

                    //time
                    var time = hour + ':' + minutes + ' ' + period;
                    this.set("time", time);

                    //timezone
                    this.set("timeZone", timeZone);

            };
            this.guestInformation = {
                fullName: "",
                email: '',
                mobileNumber:""
            };
            this.guestFullName ="";
            this.participantOneFullName = "";
            this.participantOne = new kendo.data.ObservableObject({
                fullName: "",
                email: "",
                title: "",
                imgUrl: "",
                mobileNumber: "",
                avatar: ""
            });

            this.participantTwo =  new kendo.data.ObservableObject({
                fullName: "",
                email: "",
                title: "",
                imgUrl: "",
                mobileNumber: "",
                avatar: ""
            });
            this.consultationInformation = {

            };

            this.participantId = null;
            var $consultationPromise = null;
            var processJoin = function ($promise) {

                var url = "/api/v2/participants/appointments";
                $.ajax({
                    url: url,
                    headers: {
                        'Authorization': 'JWT-Participant ' + $scope.joinToken,
                        'Content-Type': 'application/json',
                        'X-Api-Key': snap.apiKey,
                        'X-Developer-Id': snap.apiDeveloperId
                    }
                }).then(function (data) {
                    data = data.data[0];
                    if (data.consultationInfo) {
                        if (data.consultationInfo.statusId === 72 || data.consultationInfo.statusId === 81) {
                            snap.Controller().navigate("/joinexit");
                        }
                    }
                    sessionStorage.setItem("consultationId", data.consultationInfo.consultationId);
                    sessionStorage.setItem("meetingId", data.meetingId);
                    sessionStorage.setItem("personId", data.personId);
                    var clinicianInformation = data.clinicianInformation;
                    var patientInformation = data.patientInformation;
                    $scope.participantId = data.participantId;
                    sessionStorage.setItem("participantId", $scope.participantId);
                    $scope.set("participantOne", {
                        fullName: clinicianInformation.fullName,
                        email: "",
                        title: "Dr",
                        imgUrl: clinicianInformation.profileImage || getDefaultProfileImageForClinician(),
                        mobileNumber: clinicianInformation.mobilePhone,
                        avatar: clinicianInformation.profileImage || getDefaultProfileImageForClinician()
                    });
                    $scope.set("participantTwo", {
                        fullName: patientInformation.fullName,
                        email: "",
                        title: "Dr",
                        imgUrl: patientInformation.profileImagePath || getDefaultProfileImageForPatient(),
                        mobileNumber: patientInformation.mobilePhone,
                        avatar: patientInformation.profileImagePath || getDefaultProfileImageForPatient()
                    });

                    $scope.dateString(data.consultationInfo.consultationDate);
                    $scope.trigger("change", {field: "participantOne"});
                    $scope.trigger("change", {field: "participantTwo"});
                    $scope.set("title", snap.hospitalSession.brandName);
                    $scope.trigger("change", { field: "title" });

                    $promise.resolve();
                }, function (data, response) {
                    
                    //TODO: show error message.
                    var response = JSON.parse(data.responseText);
                    if (response) {
                        var exp = response.exceptionType;
                        if (exp.indexOf("SecurityTokenExpiredException")) {
                            snap.Controller().navigate("/error/"+ snap.enums.ErrorTypeEnum().TokenInvalid_Invitation);
                        }
                    }
                    $promise.reject();
                });
            };
            

            this.initJoinPage = function (_joinToken, _consulationType, participantId, senderParticipantId, senderUserId) {
                $consultationPromise = $.Deferred();
                this.joinToken = _joinToken;
                this.consulationType = _consulationType;
                this.participantId = participantId;
                this.senderUserId = senderUserId;
                sessionStorage.setItem("participantId", participantId);
                sessionStorage.setItem("participantToken", _joinToken);
                sessionStorage.setItem("senderParticipantId", senderParticipantId);
                sessionStorage.setItem("senderUserId", senderUserId);
                sessionStorage.setItem("consulationType", _consulationType);
                if (this.consulationType === 1) {
                    processJoin($consultationPromise);
                } else {
                    this.set("isBlankConsulation", true);
                }
                return $consultationPromise.promise();
            };

            this.toggleApptInfo = function () {
                $('body').toggleClass('is-cc-public');
            }

            // helper 
            var getNameFunc = function (fullName) {
                var firstName, lastName;

                names = jQuery.grep(fullName.split(" "), function (n) { return (n); });
                var firstName = "";
                var lastName = "";

                if (names.length > 2) {
                    firstName = names.shift() + " " + names.shift();
                    lastName = names.join(" ");
                } else {
                    firstName = names[0] || "";
                    lastName = names[1] || "";
                }

                return {
                    firstName: firstName,
                    lastName: lastName
                }
            }

            this.updateParticipant = function () {
                var names = getNameFunc(this.guestFullName);
               
                var url = "/api/v2/patients/consultations/participants/" + this.participantId;
                return $.ajax({
                    url: url,
                    type:"PUT",
                    headers: {
                        'Authorization': 'JWT-Participant ' + $scope.joinToken,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        participantType:1,
                        firstName: names.firstName,
                        lastName: names.lastName
                    })
                    
                });
            };

            this.updateOpenParticipant = function () {
                var names = getNameFunc(this.guestFullName);

                var url = "/api/v2.1/openconsultations/participants/" + this.participantId;
                return $.ajax({
                    url: url,
                    type: "PUT",
                    headers: {
                        'Authorization': 'JWT-Participant ' + $scope.joinToken,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        participantType: 1,
                        firstName: names.firstName,
                        lastName: names.lastName
                    })

                });
            }

            this.joinConsultation = function () {
               
                var guestName = $scope.guestFullName;
                if (guestName.trim() === "" || guestName.length > 50) {
                    //TODO: replace with maxlen parameter from config file
                    guestName.length > 50 ?
                    $snapNotification.info("Guest Full Name should be less than 50 characters long.") :
                    $snapNotification.info("Pleae enter the Guest Full Name to continue.");

                } else {
                    var def = null;
                    if (this.consulationType === 1) {
                        def = this.updateParticipant();
                    } else {
                        def = this.updateOpenParticipant();
                    }
                    def.then(function () {

                        snap.updateSnapUserSessionValue('apiDeveloperId',snap.apiDeveloperId);
                        snap.updateSnapUserSessionValue('apiKey', snap.apiKey);

                        sessionStorage.setItem("participantName", $scope.guestFullName);
                        url = "/Participant/encounter.html";
                        if ($scope.consulationType !== 1) {
                            url += "#/openconsultation";
                        }
                        location.replace(url);
                    });
                }
               
            }

            this.declineConsultationWithConfirmation = function (e) {
                e.preventDefault();
                $snapNotification.confirmationWithCallbacks("Are you sure you want to decline this invitation?",
                    function() {
                        snap.Controller().navigate("/decline/" + $scope.joinToken);
                    });
            }

            // for page controller route hit
            this.declineConsultation = function(joinToken) {

                var goodWay = function(data, response) {
                    //we already here
                };
                var badWay = function() {
                    $snapNotification.error("Error occured while trying decline your token.");
                }

                var url = "/api/v2/patients/consultations/participants/" + $scope.participantId + "/invitation";
                //TODO: Replace ajax calls with something like $http where api keys and tokens will be handled automatically (Dan told that snap.common already configures ajax calls, but there are few conditions)
                $.ajax({
                        url: url,
                        type: "DELETE",
                        headers: {
                            'Authorization': 'JWT-Participant ' + joinToken,
                            'Content-Type': 'application/json',
                            'X-Api-Key': snap.apiKey,
                            'X-Developer-Id': snap.apiDeveloperId
                        },
                        data: JSON.stringify({
                            participantId: $scope.participantId
                        })
                    })
                    .then(goodWay, badWay);
            };

            this.exchangeToken = function (joinToken) {

                var url = "/api/v2/patients/consultations/guest-participant/token";

                return $.ajax({
                    url: url,
                    type: "GET",
                    headers: {
                        'Authorization': 'JWT-Participant ' + joinToken,
                        'Content-Type': 'application/json',
                        'X-Api-Key': snap.apiKey,
                        'X-Developer-Id': snap.apiDeveloperId
                    }
                });
            };

        });
}(jQuery, snap));
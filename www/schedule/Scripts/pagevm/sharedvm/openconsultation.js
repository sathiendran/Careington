/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />
/// <reference path="tookBoxViewModel.js" />



; (function ($, snap, kendo) {
    "use strict";


    snap.namespace("snap.physician")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snapLoader",
            "snap.shared.OpenConsultationTokboxViewModel",
            "snap.physician.PatientViewModel",
             "snap.Service.MessengerService",
             "snap.hub.MeetingHub", "snap.hub.mainHub"
        ])
        .define("OpenAppointmentViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $snapLoader,
                $openConsultationControl,
                $patientViewModel, $appointmentService, $meetingHub, $mainHub) {
                var currentViewModel = this;
                var $headerViewModel = null;
                if (snap && snap.clinician && snap.clinician.ClinicianHeaderViewModel) {
                    $headerViewModel = new snap.clinician.ClinicianHeaderViewModel();
                }
                //snap.clinician.ClinicianHeaderViewModel
                var meTemplate;
                this.appointmentId = snap.consultationId;
                this.participantToken = "";
                var currentMeeting = null;
                var currentProvider = null;
                var isDisconnectedMassageShow = false;
                var $scope = this;

                this.openInvitationPanel = false;
                var displayMessage = function (data) {
                    if (data && $.trim(data.message) !== "") {
                        data['date'] = kendo.toString(new Date(), "hh:mm tt");
                        data.sender = data.senderName;
                        data.senderImage = data.profileImagePath || '/images/default-user.jpg';
                        $("#chatMessageCtl").val("");
                        data.msg = $("<textarea/>").html(data.message).text();
                        var result = meTemplate(data);
                        var div = $('<div>');
                        div.html(result);
                        $("#msgCont").append(div);
                    }
                };
                var initHub = function (meetingId) {
                    meTemplate = kendo.template($("#meTemplate").html());

                    $openConsultationControl.initMeetingHub();
                    $meetingHub.off("onPatientAvailable").on("onPatientAvailable", function () {
                        isDisconnectedMassageShow = false;
                    });
                    $meetingHub.off("onBroadcastMessageReceived").on("onBroadcastMessageReceived", function (data) {
                        $(".chat__messages-list").animate({ scrollTop: $('#msgCont').height() }, 1000);
                        displayMessage(data);
                    });
                    var disConnectedTimer;
                    $meetingHub.off("onClientDisconnected").on("onClientDisconnected", function () {
                       refreshParticipants();
                    });
                    $meetingHub.off("onRefreshParticipantList").on("onRefreshParticipantList", function () {
                        refreshParticipants();
                    });
                    var connectedTimer = null;
                    $meetingHub.off("onParticipantConnected").on("onParticipantConnected", function () {
                        //need to clear old timer during page transaction
                        if (disConnectedTimer) {
                            clearTimeout(disConnectedTimer);
                            disConnectedTimer = null;
                        }
                        if (connectedTimer) {
                            clearTimeout(connectedTimer);
                            connectedTimer = null;
                        }
                        connectedTimer = setTimeout(function () {
                            $snapNotification.success("One of the participants has joined this consultation.");
                            refreshParticipants();
                        }, 4000);
                    });
                    $meetingHub.off("onParticipantDisconnected").on("onParticipantDisconnected", function () {
                       
                        if (disConnectedTimer) {
                            clearTimeout(disConnectedTimer);
                            disConnectedTimer = null;
                        }
                        disConnectedTimer = setTimeout(function () {
                            $snapNotification.success("One of the participants has left this consultation.");
                            refreshParticipants();
                        }, 4000);
                    });

                    $meetingHub.off("onOpenConultationEnded").on("onOpenConultationEnded", function () {
                        if (location.href.indexOf("patientQueue") === -1) {
                            $snapNotification.success("Consultation ended. Please wait while we transfer you to home page.");
                            sessionStorage.removeItem("meetingdata");
                            sessionStorage.removeItem("participantId");
                            sessionStorage.removeItem("personId");
                            sessionStorage.removeItem("meetingStartDate");
                            $mainHub.stop();
                            $openConsultationControl.redirectFromConsultation();
                        }

                    });

                    $meetingHub.off("onUserLeaveOpenConsultation").on("onUserLeaveOpenConsultation", function (userParticipantId) {
                        var participant = $openConsultationControl.getParticipant(userParticipantId);
                        if (participant) {
                            var name = participant.person.name.given + " " + participant.person.name.family;
                            $snapNotification.info(name + " has left this consultation.");
                            refreshParticipants();
                        }
                    });


                    $mainHub.register($meetingHub, { openConsultation: 1, meetingId: meetingId });
                    $mainHub.start().then(function () {
                        if (!isGuest()) {
                            $meetingHub.registerMeeting(meetingId);
                        }
                    });
                };
                var toggleMenu = function () {
                    if ($('#divMainWrap').hasClass('show-nav')) {
                        $('#divMainWrap').removeClass('show-nav');
                    } else {
                        $('#divMainWrap').addClass('show-nav');
                    }
                };
                var selectMenuItem = function (ee) {
                    toggleMenu();
                    if ($(this).hasClass("newwindow")) {
                        return;
                    }
                    ee.preventDefault();
                    var url;
                    if ($(this).hasClass("waiting")) {

                        url = $(this).attr("href");
                        if ($scope.isStarted) {
                            $snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to end this consultation?", function() {
                                $eventaggregator.published("requestdisconnect", { 'url': url });
                            });
                        } else {
                            $snapNotification.confirmationWithCallbacks("You  have a customer in waiting room.\n Are you sure you want to leave this consultation?", function() {
                                location.href = url;
                            });
                        }
                    }
                    if ($(this).hasClass("logout")) {
                        url = $(this).attr("href");
                        if ($scope.isStarted) {
                            $snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to logout?", function() {
                                $eventaggregator.published("requestdisconnect", { 'url': url });
                            });
                        } else {
                            $snapNotification.confirmationWithCallbacks("You  have a customer in waiting room.\n Are you sure you want to logout?", function() {
                                location.href = url;
                            });
                        }
                    }

                };

                $eventaggregator.subscriber("requestdisconnect", function (data) {
                    $snapNotification.success("Consultation ended. Please wait while we transfer you to home page.");
                    if ((typeof data === 'undefined') || (typeof data.url === 'undefined')) {
                        $openConsultationControl.redirectFromConsultation();
                    }
                    else {
                        window.location.href = data.url;
                    }
                });
                $eventaggregator.subscriber("onclientConnected", function () {
                    $(".btnSession").addClass('hidden');
                    $(".btnSessionEnd").removeClass('hidden');
                    $('nav li').removeClass("disabled");
                });
                $eventaggregator.subscriber("videoInitialized", function () {
                    if ($scope.openInvitationPanel) {
                        $openConsultationControl.set("activeParticipants", true);
                        window.setTimeout(function() {
                            $scope.openInviteForm();
                        }, 2000);
                    }
                });
                var refreshParticipants = function () {
                    $appointmentService.getParticipants(currentMeeting.meetingId).then(function (data) {
                        data = data.data;
                       
                        var guest = [];
                        var ownParticipant = sessionStorage.getItem("participantId");
                        var ownParticipantDetails = null;
                        data.forEach(function (item) {
                            if (!item.person.photoUrl) {
                                item.person.photoUrl = "/images/default-user.jpg";
                            }
                            var isCurrentProfile;
                            if (isGuest()) {
                                isCurrentProfile = item.participantId === ownParticipant;

                            } else {
                                isCurrentProfile = item.person.staffId === snap.profileSession.profileId;

                            }
                            item.medicalSpeciality = "";
                            if (isCurrentProfile && item.participantTypeCode == 2) {
                                ownParticipantDetails = item;
                            } else {
                                if (item.person.staffId != currentProvider.physicianId) {
                                    guest.push(item);
                                }
                            }
                        });
                        $openConsultationControl.setParticipantsData(guest);
                    });
                };
                var startMeeting = function (meeting, session) {
                    
                    currentMeeting = meeting;
                    $openConsultationControl.set("isStarted", true);
                    $openConsultationControl.set("isVideoBtn", true);
                    $openConsultationControl.set("isMicrophoneBtn", true);
                    $openConsultationControl.set("isMuteBtn", true);
                    $openConsultationControl.set("consultButtonTitle", "End Consult");
                    if ($headerViewModel) {
                        $headerViewModel.onSessionStarted();
                    }
                    $(".header__session-btn").hide();

                    $scope.isStarted = true;
                    $openConsultationControl.isStarted = true;
                    $scope.enableTab(true);
                    $openConsultationControl.setSessionInformation(meeting, session);

                    var assignedDoctorId = meeting.providerId || +sessionStorage.getItem("senderUserId");

                    var providers = [];

                    if (assignedDoctorId) {
                        
                        $appointmentService.getPhysicianInformation(assignedDoctorId).then(function (providerData) {
                            if (providerData.data.length > 0) {
                                
                                $openConsultationControl.setProviderData(providerData.data[0]);
                                $("#physicianIcon").attr('src', providerData.data[0].profileImagePath);
                                currentProvider = providerData.data[0];
                                $appointmentService.getParticipants(meeting.meetingId).then(function (data) {
                                    data = data.data;
                                    var providersPromise = [];
                                    var guest = [];
                                    var ownParticipant = sessionStorage.getItem("participantId");
                                    var ownParticipantDetails = null;
                                    data.forEach(function (item) {
                                        if (!item.person.photoUrl) {
                                            item.person.photoUrl = "/images/default-user.jpg";
                                        }
                                        if (item.participantTypeCode == 2) {
                                            providersPromise.push($appointmentService.getPhysicianInformationByPersonId(item.person.id));
                                        }
                                        var isCurrentProfile;
                                        if (isGuest()) {
                                            isCurrentProfile = item.participantId === ownParticipant;

                                        } else {
                                            isCurrentProfile = item.person.staffId === snap.profileSession.profileId;

                                        }
                                        item.medicalSpeciality = "";
                                        if (isCurrentProfile && item.participantTypeCode == 2) {
                                            ownParticipantDetails = item;
                                            providers.push(item);

                                        } else {
                                            if (item.person.staffId != currentProvider.physicianId) {
                                                guest.push(item);
                                            }
                                        }
                                    });
                                    if (providersPromise.length == 1) {
                                        providersPromise.push("fakeString");
                                    }
                                    $.when.apply($, providersPromise).done(function () {

                                        var data = Array.prototype.slice.call(arguments);
                                        var providerData = {

                                        };
                                        data.forEach(function (result) {
                                            if (typeof result == "object") {
                                                var provider = result[0].data[0];
                                                if (ownParticipantDetails && provider.personId == ownParticipantDetails.person.id) {
                                                    ownParticipantDetails.medicalSpeciality = provider.medicalSpeciality;
                                                    $openConsultationControl.setProviders([ownParticipantDetails]);
                                                }
                                                providerData[provider.personId] = provider;
                                            }
                                        });
                                        $openConsultationControl.setProvidersDetails(providerData);
                                    });
                                    $openConsultationControl.setProviders(providers);
                                    $openConsultationControl.setParticipantsData(guest);
                                });
                            }
                        });
                    }
                    initHub(meeting.meetingId);
                    var $messengerService = snap.resolveObject("snap.Service.MessengerService");
                    $messengerService.getMeetingConversation(meeting.meetingId).then(function (response) {
                        response.data.forEach(function (message) {
                            displayMessage(message);
                        });
                    });

                };
                var isGuest = function () {
                    currentViewModel.participantToken = sessionStorage.getItem("participantToken");
                    return currentViewModel.participantToken ? true : false;
                };
                var getAppointment = function () {
                    var url = "/api/v2.1/participants/sessions";
                    return $.ajax({
                        url: url,
                        headers: {
                            'Authorization': 'JWT-Participant ' + currentViewModel.participantToken,
                            'Content-Type': 'application/json',
                            'X-Api-Key': snap.apiKey,
                            'X-Developer-Id': snap.apiDeveloperId
                        }
                    });
                };
                this.loadData = function () {
                    kendo.bind($("#appointment-container"), $openConsultationControl);
                    kendo.bind($("#patientContainer"), $openConsultationControl);
                    if (!isGuest()) {
                        var data = JSON.parse(sessionStorage.getItem("meetingdata")) || {};
                        $scope.openInvitationPanel = !!data.openInvitationPanel;
                        // open panel only once
                        data.openInvitationPanel = false;
                        sessionStorage.setItem("meetingdata", JSON.stringify(data));
                        if ($scope.isRedirectFromProviderChat) {
                            $.when($appointmentService.getMeeting($scope.meetingId), $appointmentService.getMeetingSession($scope.meetingId))
                                .then(function (meeting, meetingSession) {
                                    meeting = meeting[0].data[0];
                                    meetingSession = meetingSession[0].data[0];
                                    sessionStorage.setItem("meetingdata", JSON.stringify({
                                        meetingdata: meeting,
                                        sessiondata: meetingSession
                                    }));
                                    startMeeting(meeting, meetingSession);
                                });
                            return;
                        }
                        if (!(data.meetingdata && data.sessiondata)) {
                            $appointmentService.createMeeting(3, true).then(function (result) {
                                result = result.data[0];
                                if (result) {
                                    $appointmentService.createParticipant(result.meetingId, snap.profileSession.userId, 2).then(function (participantResult) {
                                        participantResult = participantResult.data[0];
                                        sessionStorage.setItem("participantId", participantResult.participantId);
                                        $appointmentService.createSession(result.meetingId).then(function (data) {
                                            data = data.data[0];
                                            
                                            sessionStorage.setItem("meetingdata", JSON.stringify({
                                                meetingdata: result,
                                                sessiondata: data
                                            }));
                                            startMeeting(result, data);
                                        });
                                    });

                                }
                            });
                        } else {
                            startMeeting(data.meetingdata, data.sessiondata);
                        }
                    } else {
                        var path = '/GlobalFunctionality/GlobalSynchronousMethods.aspx/GetHospitalIdWithKeys';
                        $.ajax({
                            url: path,
                            type: 'POST',
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            success: function (response) {
                                var hospInfo = response.d.split("|");
                                snap.hospitalId = hospInfo[0];
                                if (parseInt(snap.hospitalId) === 0) {
                                    window.location = "/404";
                                }
                                snap.apiDeveloperId = hospInfo[1];
                                snap.apiKey = hospInfo[2];
                                getAppointment().then(function (result) {
                                    result = result.data[0];
                                    if (result && !result.callEndTime){
                                        var meetingData = {
                                            meetingId: result.meetingId
                                        };
                                        $openConsultationControl.initGuestUI();
                                        startMeeting(meetingData, result);
                                    } else {
                                        $snapNotification.success("Consultation ended.");
                                        sessionStorage.removeItem("meetingdata");
                                        sessionStorage.removeItem("participantId");
                                        sessionStorage.removeItem("personId");
                                        sessionStorage.removeItem("meetingStartDate");
                                        $mainHub.stop();
                                        $openConsultationControl.redirectFromConsultation();
                                    }
                                });

                            },
                            error: function () {
                                $snapNotification.error("Hospital ID Failure");
                            }
                        });
                    }
                };
                this.enableTab = function (flag) {
                    if (flag) {
                        $(".sopatab,.ePrescribe").removeClass("disabled k-state-disabled");
                    } else {
                        $(".sopatab,.ePrescribe").addClass("disabled k-state-disabled");
                    }
                };
                this.isRedirectFromProviderChat = false;
                this.meetingId = null;
                this.isStarted = false;
                this.startSession = function () {


                };

                this.updateHeaderButton = function () {
                    var _assignBtnEvent = function () {
                        $(".btnSessionEnd").hide();
                        $(".btnSession").hide();
                        $(".btnSessionEnd").off("click").on('click', function () {
                            $snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to end this consultation?", function() {
                                $eventaggregator.published("requestdisconnect", {});
                            });
                        });
                    };

                    if ($(".btnSession").length > 0) {
                        _assignBtnEvent();
                    } else {
                        ; (function () {
                            var interval = setInterval(function () {
                                if ($(".btnSession").length > 0) {
                                    _assignBtnEvent();
                                    clearInterval(interval);
                                }
                            }, 2000);
                        }());

                    }
                };

                this.openInviteForm = function() {
                    $('.patient-invite__users').toggleClass('is-active');
                    $('.patient-invite__container').toggleClass('is-active');
                    $('.js-toggle-invite-form').toggleClass('is-active');
                    window.setTimeout(function () {
                        $('input', '.patient-invite__container').focus();
                    }, 500);
                };

                this.bindUI = function () {
                    $('#main-nav')
                      .on('click', 'li > a', selectMenuItem);
                };
                this.init = function (meetingId) {
                    this.meetingId = meetingId;
                    this.isRedirectFromProviderChat = meetingId ? true : false;
                    if (this.isRedirectFromProviderChat) {
                        sessionStorage.removeItem("participantToken");
                    }
                    $("#clinician-consultation-tabs").kendoTabStrip({
                        animation: false,
                        select: function (ee) {
                            if ($(ee.item).hasClass("ePrescribe")) {
                                ee.preventDefault();
                                window.open(snap.string.formatURIComponents('/ePrescription/RxNT.aspx?token={0}&consultationId={1}&from=physician', snap.userSession.token, snap.consultationId));
                            }
                            if ($(ee.item).hasClass("chattab")) {
                                $(".message-flag").addClass('hide').html(0);
                            }
                        }
                    }).data("kendoTabStrip");

                    $(".tabSection input").kendoDropDownList();
                    this.bindUI();
                    $scope.updateHeaderButton();
                    this.loadData();
                    if (app.headerService) {
                        app.headerService.viewModel.getClientInfo(snap.hospitalId);
                    }
                    $('#nav-toggle').click(function (e) {
                        e.preventDefault();
                        toggleMenu();
                    });

                    $('.js-toggle-invite-form').on('click', function () {
                        $scope.openInviteForm();
                    });


                    setTimeout(function () {
                        $("#divMainWrap").removeClass("blockSnapUI");
                    }, 500);

                    $('.patient-data__userinfo .close').click(function () {
                        $(this).toggleClass('is-active');
                    });
                };

            }).singleton();

}(jQuery, snap, kendo));
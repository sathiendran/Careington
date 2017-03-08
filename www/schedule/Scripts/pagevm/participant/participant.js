/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />
/// <reference path="../../services/appointmentService.js" />
/// <reference path="tookBoxViewModel.js" />

"use strict";

var UnBlockContainer = UnBlockContainer || function () {

};

; (function ($, snap, kendo) {

    snap.namespace("snap.patient")
        .use([
            "snapNotification",
            "snap.common.contentLoader",
            "eventaggregator",
            "snap.shared.TokboxViewModel",
            "snap.physician.PatientViewModel",
            "snap.service.appointmentService",
            "snap.hub.ConsultationHub",
            "snap.hub.mainHub",
            "snap.hub.MeetingHub",
            "snap.service.guestConsultationService",
            "snap.common.chat.participantConsultationChat"
        ])
        .define("PatientAppointmentViewModel",
            function ($snapNotification, $contentLoader, $eventaggregator,
                $tookboxControl, $patientViewModel,
                $appointmentService, $consultationHub, $mainHub, $meetingHub, $guestConsultationService,
                $participantConsultationChat) {

                var $scope = this,
                    consultationInfo = null,
                    patientInfo = null;

                var providerUnavailable = false;

                var getVideoKey = function () {
                    var url = "/api/v2/physicians/appointments/" + $scope.appointmentId + "/videokey";
                    return $.ajax({
                        url: url,
                        headers: {
                            'Authorization': 'JWT-Participant ' + $scope.participantToken,
                            'Content-Type': 'application/json',
                            'X-Api-Key': snap.apiKey,
                            'X-Developer-Id': snap.apiDeveloperId
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
                var redirectToHome = function () {
                    location.replace("/Public/#/joinexit");
                };
                var convertToDatePart = function (ms) {
                    var d, h, m, s;
                    s = Math.abs(Math.floor(ms / 1000));
                    m = Math.abs(Math.floor(s / 60));
                    s = s % 60;
                    h = Math.abs(Math.floor(m / 60));
                    m = m % 60;
                    d = Math.abs(Math.floor(h / 24));
                    h = h % 24;
                    return { d: d, h: h, m: m, s: s };
                };
                var redirectTimer = 0;
                var initHub = function () {
                    snap.profileSession.userId = sessionStorage.getItem("participantId");
                    snap.consultationSession.personId = sessionStorage.getItem("personId");
                    $contentLoader.bindViewModel($participantConsultationChat, "#chatCont", "/content/shared/chat.html?svp=snapversion").done(function() {
                        $participantConsultationChat.load({
                            personId: snap.consultationSession.personId
                        }, $scope.appointmentId);
                    });
                    $mainHub.register($consultationHub, snap.ConsulationPageType.GuestParticipantConsultationPage);
                    $scope.participantId = snap.profileSession.userId;

                    $consultationHub.on("patientAvailable", function () {
                        $snapNotification.info("Patient has re-entered the consultation.");
                        $tookboxControl.setPatientData(patientInfo);
                    });
                    $consultationHub.on("patientUnavailable", function () {
                        $snapNotification.info("Patient not available for consultation");
                        setTimeout(function () {
                            $tookboxControl.hidePatient();
                            $snapNotification.info("Patient has been disconnected from the consultation.");

                        }, 2000);
                    });
                    $consultationHub.on("customerDisconnected", function () {
                        $snapNotification.info("Patient not available for consultation");
                        setTimeout(function () {
                            $tookboxControl.hidePatient();
                            $snapNotification.info("Patient has been disconnected from the consultation.");

                        }, 2000);
                    });
                    $consultationHub.on("patientInMobileDevice", function (flag) {
                        $scope.enableChat(!flag);
                    });
                    $consultationHub.on("providerUnavailable", function () {
                        providerUnavailable = true;
                        $snapNotification.info("Provider has disconnected from this consultation. Waiting for Provider to enter the room");
                        if (redirectTimer) {
                            clearTimeout(redirectTimer);
                            redirectTimer = 0;
                        }
                        redirectTimer = setTimeout(function () {
                            $snapNotification.info("Seems that provider is disconnected. Consultation is ended.");
                            setTimeout(function () {
                                location.replace("/Public/#/joinexit");
                            }, 2000);
                        }, 3 * 60 * 1000);
                    });

                    $consultationHub.on("providerAvailable", function () {
                        providerUnavailable = false;
                        $snapNotification.info("Provider has re-entered the consultation.");
                        if (redirectTimer) {
                            clearTimeout(redirectTimer);
                            redirectTimer = 0;
                        }
                    });
                    $consultationHub.on("consultationEnded", function () {
                        if (providerUnavailable) {
                            $snapNotification.info("Seems that provider is disconnected.");
                        }
                        $snapNotification.success("Consultation is ended.");
                        setTimeout(function () {
                            location.replace("/Public/#/joinexit");
                        }, 2000);
                    });
                    $consultationHub.on("participantConnected", function () {
                        $guestConsultationService.getParticipants().then(function (data) {
                            data = data.data[0];
                            $tookboxControl.setParticipants(data);
                        });
                    });
                    $consultationHub.on("participantDisconnected", function () {
                        $snapNotification.success("One of the participants has disconnected from this consultation.");
                        $guestConsultationService.getParticipants().then(function (data) {
                            data = data.data[0];
                            $tookboxControl.setParticipants(data);
                        });

                    });
                    $consultationHub.on("onPatientDisconnectedFromWaitingRoom", function () {
                        $snapNotification.info("Patient has left the waiting room and is not available for consultation");
                    });
                    $consultationHub.on("onPatientEndConsultation", function () {
                        $snapNotification.success("The patient has marked the consultation complete.");
                        setTimeout(function () {
                            redirectToHome();
                        }, 2000);
                    });
                    $consultationHub.on("start", function () {
                        if ($consultationHub) {
                            $consultationHub.isPatientInMobileDevice().then(function (flag) {
                                $scope.enableChat(!flag);
                            });

                            var name = sessionStorage.getItem("participantName");
                            $consultationHub.updateParticipantDetails($scope.participantId, name);

                            window.setTimeout(function () {
                                $guestConsultationService.getParticipants().then(function (data) {
                                    data = data.data[0];
                                    $tookboxControl.setParticipants(data);
                                });
                            }, 2000);
                        }

                        if ($consultationHub.getConsultationTime) { // check consultation Time
                            $consultationHub.getConsultationTime().then(function (timeInfo) {

                                if (timeInfo === 0) {
                                    $tookboxControl.startTimer(0, 0, 0);
                                    $("#sessionButtonEnd").removeClass('hidden');
                                    return;
                                }
                                timeInfo = new Date(timeInfo);

                                var diffDate = convertToDatePart(new Date() - timeInfo);

                                var hour = diffDate.h;
                                var min = diffDate.m;
                                var sec = diffDate.s;
                                if (sec >= 0) {
                                    sec = Math.floor(sec);

                                    $tookboxControl.startTimer(hour, min, sec);
                                    $("#sessionButtonEnd").removeClass('hidden');
                                }

                            });
                        }
                        return;
                    });
                    $mainHub.start();
                };

                $eventaggregator.subscriber("checkDroppedConsultation", function () {
                    $consultationHub.checkDroppedConsultation().then(function ($data) {
                        if ($data === true) {
                            $snapNotification.info("This consultation is no longer valid.");
                            setTimeout(function () {
                                redirectToHome();
                            }, 2000);
                        }
                    }, function() {
                        $snapNotification.info("It seems you’ve been disconnected.");
                        setTimeout(function () {
                            redirectToHome();
                        }, 2000);
                    });
                });
                
                this.participantToken = sessionStorage.getItem("participantToken");
                this.appointmentId = sessionStorage.getItem("consultationId");
                snap.userSession = snap.userSession || {};
                snap.userSession.token = this.participantToken;
                snap.profileSession = snap.profileSession || {};
                snap.consultationId = this.appointmentId;
                this.appointmentId = "";
                this.participantId = null;
                this.loadData = function () {
                    $patientViewModel.init(snap.ParticipantType.Guest);
                    $tookboxControl.screenType = 3;
                    kendo.bind($("#appointment-container"), $tookboxControl);
                    kendo.bind($("#patientContainer"), $patientViewModel);
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
                            $guestConsultationService.getAppointment().then(function (result) {
                                if (result) {
                                    consultationInfo = result.data[0].consultationInfo;
                                    patientInfo = result.data[0].patientInformation;
                                    snap.consultationSession.meetingId = result.data[0].meetingId;

                                    if (consultationInfo) {
                                        if (consultationInfo.statusId == snap.consultationStatus.endedConsultation) {
                                            $snapNotification.info("This consultation has already completed.");
                                            setTimeout(function () {
                                                redirectToHome();
                                            }, 1000);
                                            return;
                                        }
                                        if (consultationInfo.statusId == snap.consultationStatus.droppedConsultation) {
                                            $snapNotification.info("This consultation is no longer valid.");
                                            setTimeout(function () {
                                                redirectToHome();
                                            }, 1000);
                                            return;
                                        }
                                        getVideoKey().then(function (data) {
                                            $tookboxControl.setSessionInformation(data);
                                            $tookboxControl.onSessionStarted();

                                        });

                                        $patientViewModel.setAppointmentData(result.data);
                                        $tookboxControl.setAppointmentData(result.data);
                                        $tookboxControl.setProviderData(result.data[0].clinicianInformation);

                                        if ($meetingHub.isHubStarted()) {
                                            $participantConsultationChat.openChat(snap.consultationSession.meetingId);
                                        } else {
                                            $meetingHub.on("start", function() {
                                                $participantConsultationChat.openChat(snap.consultationSession.meetingId);
                                            });
                                        }
                                    } else {
                                        $snapNotification.error("consultation not found");
                                        setTimeout(function () {
                                            location.replace(snap.getClinicianHome());
                                        }, 1000);
                                        return;
                                    }
                                }
                            });

                        },
                        error: function () {
                            $snapNotification.error("Hospital ID Failure");
                        }
                    });

                };
                $eventaggregator.subscriber("onInitHub", initHub);
                this.bindPatientUI = function () {
                    $('#main-nav').on('click', 'li > a', selectMenuItem);
                };

                var selectMenuItem = function (ee) {
                    if ($(this).hasClass("newwindow")) {
                        return;
                    }
                    ee.preventDefault();
                    if ($(this).hasClass("waiting")) {
                        $snapNotification.info("Please wait until Provider ends the consultation.");

                    }
                    if ($(this).hasClass("logout")) {
                        var url = $(this).attr("href");
                        $snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to logout?", function() {
                            $eventaggregator.published("requestdisconnect", {
                                url: url,
                                forceDisconnect: true
                            });
                        });
                    }
                    toggleMenu();

                };
                this.enableChat = function (flag) {
                    if (flag) {
                        $(".chattab").removeClass("disabled k-state-disabled");
                        $(".chattab").show();
                        $(".patient-data__message").show();
                    } else {
                        $(".chattab").addClass("disabled k-state-disabled");
                        $(".chattab").hide();
                        $(".patient-data__message").hide();


                    }
                };
                this.init = function () {
                    $(".userprofileel, .sopatab, .ePrescribe, .filestab, .intakeel").remove();
                    $(".patient-data__intake,.patient-data__soap,.patient-data__files,.patient-data__patient-profile").remove();
                    $(".chattab").addClass("k-state-active");
                    $("#clinician-consultation-tabs").kendoTabStrip({
                        animation: false,
                        select: function (ee) {

                            if ($(ee.item).hasClass("chattab")) {
                                $(".message-flag").addClass('hide').html(0);
                            }

                        }
                    });
                    $(".patient-invite__container").remove();
                    $(".chattab").removeClass("k-state-disabled disabled");

                    $(".tabSection input").kendoDropDownList();
                    $('#nav-toggle').click(function (e) {
                        e.preventDefault();

                        toggleMenu();
                    });
                    this.loadData();
                    this.bindPatientUI();

                    setTimeout(function () {
                        snap.hospitalSession.hospitalId = +snap.hospitalSession.hospitalId; //convert string to int;

                    }, 100);
                };
            }).singleton();
}(jQuery, snap, kendo));










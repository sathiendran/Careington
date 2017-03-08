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

; (function ($) {


    snap.namespace("snap.patient")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snap.common.contentLoader",
            "snap.shared.TokboxViewModel",
            "snap.physician.PatientViewModel",
            "snap.service.appointmentService",
            "snap.hub.ConsultationHub",
            "snap.hub.mainHub",
            "snap.hub.MeetingHub",
            "snap.common.chat.userConsultationChat"
        ])
        .define("PatientAppointmentViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $contentLoader,
                $tookboxControl, $patientViewModel,
                $appointmentService, $consultationHub, $mainHub, $meetingHub, $userConsultationChat) {

                var currentViewModel = this;
                var consultationInfo = null;
                var providerUnavailable = false;

                this.appointmentId = snap.consultationId;

                var redirectToHome = function () {
                    snap.ConsultationPage = false;
                    $mainHub.stop();
                    window.location.href = snap.patientConsultEndUrl();
                };

                this.loadData = function () {
                    $patientViewModel.init(snap.ParticipantType.Patient);

                    $tookboxControl.screenType = 2;
                    kendo.bind($("#appointment-container"), $tookboxControl);
                    kendo.bind($("#patientContainer"), $patientViewModel);



                    $appointmentService.getAppointment(this.appointmentId).then(function (result) {

                        if (result) {
                            consultationInfo = result.data[0].consultationInfo;
                            snap.consultationSession.meetingId = result.data[0].meetingId;
                            $patientViewModel.updateUnreadMessagesCount();

                            if (consultationInfo) {

                                if (consultationInfo.statusId == snap.consultationStatus.endedConsultation) {
                                    $snapNotification.info("This consultation has already completed.");
                                    setTimeout(function () {
                                        redirectToHome();
                                    }, 1000);
                                    return;

                                }
                                if (consultationInfo.statusId == snap.consultationStatus.droppedConsultation) {
                                    //reconnect stays open for 3 min until dropped
                                    $snapNotification.info("This consultation is no longer valid.");
                                    setTimeout(function () {
                                        redirectToHome();
                                    }, 1000);
                                    return;
                                }

                                $patientViewModel.setAppointmentData(result.data);
                                $tookboxControl.setAppointmentData(result.data);
                                $appointmentService.getVideoKey(currentViewModel.appointmentId).then(function (data) {
                                    $tookboxControl.setSessionInformation(data);

                                    $tookboxControl.set("isStarted", true);
                                    $tookboxControl.set("isVideoBtn", true);
                                    $tookboxControl.set("isMicrophoneBtn", true);
                                    $tookboxControl.set("isMuteBtn", true);
                                    $tookboxControl.set("consultButtonTitle", "Disconect Consultation");

                                });

                                $appointmentService.getParticipants(currentViewModel.appointmentId).then(function (data) {
                                    data = data.data[0];
                                    $tookboxControl.setParticipants(data);
                                });

                                $appointmentService.getPhysicianInformation(consultationInfo.assignedDoctorId).then(function (data) {
                                    if (data.data.length > 0) {
                                        $tookboxControl.setProviderData(data.data[0]);
                                    }
                                });
                                if ($meetingHub.isHubStarted()) {
                                    $userConsultationChat.openChat(snap.consultationSession.meetingId);
                                } else {
                                    $meetingHub.on("start", function() {
                                        $userConsultationChat.openChat(snap.consultationSession.meetingId);
                                    });
                                }

                            } else {
                                $snapNotification.error("consultation not found");
                                setTimeout(function () {
                                    redirectToHome();
                                }, 1000);
                                return;
                            }
                        }
                    }, function () {
                        $snapNotification.error("consultation not found");
                        setTimeout(function () {
                            redirectToHome();
                        }, 1000);
                        return;
                    });

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

                var initHub = function () {
                    $contentLoader.bindViewModel($userConsultationChat, "#chatCont", "/content/shared/consultationChat.html?svp=snapversion").done(function() {
                        $userConsultationChat.load({
                            personId: snap.consultationSession.personId
                        }, currentViewModel.appointmentId);
                    });
                    $mainHub.register($consultationHub, snap.ConsulationPageType.PatientPhysicianConsultationPage);

                    try {
                        app.snapFileService.setupNotification(true);

                    } catch (ex) {
                        console.error("file sharing Hub not activate");
                    }

                    $consultationHub.on("consultationEnded", function () {
                        if (providerUnavailable) {
                            $snapNotification.info("Seems that provider is disconnected.");
                        }
                        $snapNotification.success("Consultation is ended.");
                        setTimeout(function () {
                            redirectToHome();
                        }, 2000);
                    });

                    $consultationHub.on("participantConnected", function () {
                        $snapNotification.success("One of the participants has joined this consultation.");
                        $appointmentService.getParticipants(currentViewModel.appointmentId).then(function (data) {
                            data = data.data[0];
                            $tookboxControl.setParticipants(data);
                        });
                    });

                    $consultationHub.on("participantDisconnected", function () {
                        $snapNotification.success("One of the participants has disconnected from this consultation.");
                        $appointmentService.getParticipants(currentViewModel.appointmentId).then(function (data) {
                            data = data.data[0];
                            $tookboxControl.setParticipants(data);
                        });

                    });

                    $consultationHub.on("providerUnavailable", function () {
                        providerUnavailable = true;
                        $snapNotification.info("Provider has disconnected from this consultation. Waiting for Provider to enter the room");
                    });

                    $consultationHub.on("providerAvailable", function () {
                        providerUnavailable = false;
                        $snapNotification.info("Provider has re-entered the consultation.");
                    });

                    $consultationHub.on("start", function () {
                        $consultationHub.checkDoctorActiveState().then(function (data) {
                            if (!data) {
                                $snapNotification.info("Waiting for Provider to enter the room");
                                setTimeout(function() {
                                    $consultationHub.checkDoctorActiveState().then(function (data) {
                                        if (!data) {
                                            $snapNotification.info("Seems that provider is disconnected.");
                                            setTimeout(function () {
                                                redirectToHome();
                                            }, 2000);
                                        }
                                    });
                                }, 30 * 1000);
                            }
                        });

                        $(".chattab").removeClass("k-state-disabled").removeClass("disabled");
                        if ($consultationHub) {
                            $consultationHub.joinCustomer();
                        }

                        if ($consultationHub.getConsultationTime) { // check consultation Time
                            $consultationHub.getConsultationTime().then(function (timeInfo) {

                                if (timeInfo == 0) {
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

                        app.snapFileService.subscribeNotification(true);
                        return;


                    });

                    $mainHub.start();
                };
                $eventaggregator.subscriber("onInitHub", initHub);

                $eventaggregator.subscriber("savedDroppedConsultation", function () {

                    $consultationHub.savedDroppedConsultation().then(function ($data) {
                        if ($data && ($data == true)) {
                            $snapNotification.info("It seems we’ve been disconnected.\nIf you don't receive a call from the Healthcare Provider within 10 minutes, \nplease reach out to your provider at the number below in order to complete your appointment. \nIf further video time is needed they will provide you with additional instructions.");

                            setTimeout(function () {
                                redirectToHome();
                            }, 10000);
                        }
                    });
                });

                $eventaggregator.subscriber("patientDisconnect", function () {
                    setTimeout(function () {
                        redirectToHome();
                    }, 1000);
                    $consultationHub.disconnectConsultation();

                });
                $eventaggregator.subscriber("checkDroppedConsultation", function () {
                    $consultationHub.checkDroppedConsultation().then(function ($data) {
                        if ($data && ($data == true)) {
                            $tookboxControl.sendDisconnectInformation();
                            $snapNotification.info("It seems we’ve been disconnected.\nIf you don't receive a call from the Healthcare Provider within 10 minutes, \nplease reach out to your provider at the number below in order to complete your appointment. \nIf further video time is needed they will provide you with additional instructions.");
                            setTimeout(function () {
                                redirectToHome();
                            }, 10000);
                        }
                    }).fail(function () {

                    });
                });

                $eventaggregator.subscriber("onclientConnected", function () {
                    $("#sessionButton").addClass('hidden');
                    $('nav li').removeClass("disabled");
                });

                $eventaggregator.subscriber("requestdisconnect", function (conf) {
                    if (conf && conf.forceDisconnect) {
                        var url = conf.url;
                        $consultationHub.notifyClientDisconnect().then(function () {
                            try {
                                //we know that we are going to redirect to other page here so its save to flag ConsultationPage off 
                                snap.ConsultationPage = false;
                                var $hub = snap.resolveObject("snap.hub.mainHub");
                                if ($hub) {
                                    $hub.isManualStop = true;
                                }

                            } catch (ex) {

                            }
                            location.href = url;
                        });
                    }
                });

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
                        snapConfirm("You currently have a consultation in progress.\n Are you sure you want to logout?");
                        $("#btnConfirmYes").click(function () {
                            $(".k-notification-confirmation").parent().remove();
                            $eventaggregator.published("requestdisconnect", {
                                url: url,
                                forceDisconnect: true
                            });

                        });
                        $("#btnConfirmNo").click(function () {
                            $(".k-notification-confirmation").parent().remove();

                        });
                    }
                    toggleMenu();

                };

                this.bindPatientUI = function () {

                    $('#main-nav')
                        .on('click', 'li > a', selectMenuItem);
                    $('#soap-field-s, #soap-field-o, #soap-field-a, #soap-field-p').kendoEditor();

                    $('.js-toggle-invite-form').on('click', function (event) {
                        $('.patient-invite__users').toggleClass('is-active')
                        $('.patient-invite__container').toggleClass('is-active')
                        $(this).toggleClass('is-active');
                    });
                };

                this.UpdateHeaderButton = function () {


                };
                var toggleMenu = function () {
                    if ($('#divMainWrap').hasClass('show-nav')) {
                        // Do things on Nav Close
                        $('#divMainWrap').removeClass('show-nav');
                    } else {
                        // Do things on Nav Open
                        $('#divMainWrap').addClass('show-nav');
                    }
                };
                this.init = function () {
                    var tabsInfo = $("#clinician-consultation-tabs").kendoTabStrip({
                        animation: false,
                        select: function (ee) {

                            if ($(ee.item).hasClass("chattab")) {
                                $(".message-flag").addClass('hide').html(0);
                            }

                        }
                    }).data("kendoTabStrip");

                    var isBetaVideo = false;
                    var isMessaging = false;
                    var isfileSharingEnable = false;

                    if (snap['getSnapHospitalSettings']) {
                        snap.getSnapHospitalSettings();
                        isfileSharingEnable = snap.hospitalSettings.fileSharing == true;
                        isBetaVideo = snap.hospitalSettings.videoBeta == true;
                        isMessaging = snap.hospitalSettings.messaging == true;
                    }

                    if (!isMessaging) {
                        var elMsg = $(".chattab");
                        tabsInfo.remove(elMsg);
                    }
                    var elInfo;
                    if (!isfileSharingEnable) {
                        elInfo = $(".filestab");
                        tabsInfo.remove(elInfo);
                    } else {
                        elInfo = $(".filestab");
                        $("#fileSharingSection").load("/content/filesharing.html" + snap.addVersion, function () {
                            app.snapFileService.consultStatus = true;
                            snap.consultationId = snap.consultationSession.consultationId;
                            initFileSharingControls(0);
                            initCustomerFiles(snap.profileSession.userId, snap.consultationSession.patientId, false);
                            elInfo.show();
                        });
                    }
                    elInfo = $(".sopatab");
                    if (elInfo) {
                        tabsInfo.remove(elInfo);
                    }
                    elInfo = $(".ePrescribe");
                    if (elInfo) {
                        tabsInfo.remove(elInfo);
                    }

                    $tookboxControl.screenType = 2;
                    $tookboxControl.setBetaParameter(isBetaVideo);


                    $("#soap-field-s").kendoEditor({ resizable: false });
                    $("#soap-field-o").kendoEditor({ resizable: false });
                    $("#soap-field-a").kendoEditor({ resizable: false });
                    $("#soap-field-p").kendoEditor({ resizable: false });

                    $(".tabSection input").kendoDropDownList();

                    $('#nav-toggle').click(function (e) {
                        e.preventDefault();

                        toggleMenu();
                    });


                    this.loadData();
                    this.bindPatientUI();
                    this.UpdateHeaderButton();

                };


            }).singleton();

}(jQuery));










/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />
/// <reference path="tookBoxViewModel.js" />
/// <reference path="../../viewModels/shared/tokbox.shared.viewmodel.js" />




; (function ($) {

    snap.namespace("snap.physician")
        .use(["snapNotification", "eventaggregator",
            "snapHttp",
            "snap.common.contentLoader",
            "snap.shared.TokboxViewModel",
            "snap.physician.PatientViewModel",
             "snap.service.appointmentService",
             "snap.hub.ConsultationHub", "snap.clinician.ClinicianHeaderViewModel",
             "snap.hub.mainHub",
             "snap.hub.MeetingHub",
             "snap.common.chat.userConsultationChat"
        ])
        .define("PhysicianAppointmentViewModel",
            function ($snapNotification, $eventaggregator,
                $snapHttp,
                $contentLoader,
                $tokboxVM,
                $patientViewModel, $appointmentService, $consultationHub, $headerViewModel, $mainHub, 
                $meetingHub, $userConsultationChat) {
                
                var consultStatus = snap.consultationStatus.unknown,
                    consultationInfo = null,
                    patientInfo = null,
                    isDisconnectedMessageShow = false,
                    $scope = this;

                this.appointmentId = snap.consultationId;

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

                var showTimerUI = function () {
                    if ($consultationHub.getConsultationTime) { // check consultation Time
                        $consultationHub.getConsultationTime().then(function (timeInfo) {
                            
                            if (timeInfo == 0) {
                                $tokboxVM.startTimer(0, 0, 0);
                                $(".btnSessionEnd").show();
                                return;
                            }
                            timeInfo = new Date(timeInfo);
                            var diffDate = convertToDatePart(new Date() - timeInfo);
                            var hour = diffDate.h;
                            var min = diffDate.m;
                            var sec = diffDate.s;
                            if (sec >= 0) {
                                sec = Math.floor(sec);
                                $tokboxVM.startTimer(hour, min, sec);
                                $(".btnSessionEnd").show();
                            }
                        });
                    }
                };

                var redirectToWaitingList = function (message) {
                    snap.ConsultationPage = false;
                    $mainHub.stop();
                    $snapNotification.error(message);
                    setTimeout(function () {
                        location.href = snap.getClinicianHome();
                    }, 5000);
                    $(".btnSession").hide();
                };
                var droppedTimer;
                var initHub = function () {
                    $contentLoader.bindViewModel($userConsultationChat, "#chatCont", "/content/shared/consultationChat.html?svp=snapversion").done(function() {
                        $userConsultationChat.load({
                            personId: snap.consultationSession.personId
                        }, $scope.appointmentId);
                    });
                    
                    $mainHub.register($consultationHub, snap.ConsulationPageType.PatientPhysicianConsultationPage);
                    $consultationHub.on("patientUnavailable", function () {
                        if ($scope.isStarted) {
                            isDisconnectedMessageShow = true;
                            snapInfo("Patient has been disconnected from the consultation.");
                            $tokboxVM.hidePatient();
                            if (droppedTimer) {
                                clearInterval(droppedTimer);
                                droppedTimer = null;
                            }
                            droppedTimer = setInterval(function () {
                                clearInterval(droppedTimer);
                                droppedTimer = null;
                                if (isDisconnectedMessageShow && !snap.customerSafeDisconnect && !snap.consultationSession.physicianCompleteSoapNotes) {
                                    $consultationHub.checkDroppedConsultation().then(function ($data) {
                                        if ($data && ($data == true)) {
                                            snap.updateSnapConsultationSessionValue("physicianCompleteSoapNotes", true);
                                            var phnNumber = patientInfo.mobilePhone || patientInfo.homePhone
                                            $snapNotification.info("It seems you’ve been disconnected.\n Please use the number below to call the patient in order to complete the consultation. \n If further video time is needed you can create a new appointment for the patient.\n " + phnNumber);
                                        }

                                    }).fail(function () {
                                        $snapNotification.info("It seems you’ve been disconnected.");
                                    });
                                }
                            }, 3 * 60 * 1000);
                        } else {
                            snapInfo("Patient has been disconnected from the waiting room.");
                        }
                    });
                    $consultationHub.on("patientAvailable", function () {

                        if ($scope.isStarted) {
                            if (isEmpty(snap.patentEnteredConsult)) {
                                snap.patentEnteredConsult = true;
                            }
                            else {
                                snapInfo("The Patient has re-entered the consultation.");
                                $tokboxVM.setPatientData(patientInfo);
                                if (droppedTimer) {
                                    clearInterval(droppedTimer);
                                    droppedTimer = null;
                                }
                               
                            }
                            isDisconnectedMessageShow = false;
                            //re-sync the consulation time. when patient join.
                           
                        } else {
                            snapInfo("The Patient has re-entered the waiting room.");
                        }
                    });


                   
                    $consultationHub.on("patientDisconnectedFromWaitingRoom", function () {
                        redirectToWaitingList("Patient has left the waiting room and is not available for consultation");
                    });
                    $consultationHub.on("viewAnotherDoctor", function () {
                        redirectToWaitingList("This consultation has already been started another provider.");
                    });
                    $consultationHub.on("patientInMobileDevice", function (flag) {
                        $tokboxVM.setPatientConnectedDevice(flag);
                        $scope.enableChat(!flag);
                    });
                    $consultationHub.on("participantConnected", function () {
                        $snapNotification.success("One of the participants has joined this consultation.");
                        $appointmentService.getParticipants($scope.appointmentId).then(function (data) {
                            data = data.data[0];
                            $tokboxVM.setParticipants(data);
                        });
                    });

                    $consultationHub.on("participantDisconnected", function () {
                        $snapNotification.success("One of the participants has disconnected from this consultation.");
                        $appointmentService.getParticipants($scope.appointmentId).then(function (data) {
                            data = data.data[0];
                            $tokboxVM.setParticipants(data);
                        });

                    });
                    $consultationHub.on("onPatientEndConsultation", function () {
                        $snapNotification.success("The patient has marked the consultation complete.  Please complete your notes and end the session when done.");
                       
                    });

                    $consultationHub.on("customerDisconnected", function () {
                        $tokboxVM.hidePatient();
                        snapConfirm("The patient has left the consultation. Was this consultation complete?");
                        $("#btnConfirmYes").click(function () {
                            $snapNotification.success("Great! Please end the session once you have completed your notes. DO NOT close this window without ending the session");

                        });
                        $("#btnConfirmNo").click(function () {
                            $consultationHub.savedDroppedConsultation().then(function () {
                                var phnNumber = patientInfo.mobilePhone || patientInfo.homePhone;
                                $snapNotification.success("This consultation will be marked as \"Dropped\". You can contact the patient at " + phnNumber + " to complete this session or re-schedule.")
                                $(".k-notification-confirmation").parent().remove();

                            });

                        });
                    });
                    try {
                        app.snapFileService.setupNotification(false);
                    } catch (ex) {
                        console.error("file sharing Hub not activate");
                    }
                    $consultationHub.on("patientContactNumberChange", function (number) {
                        if (number) {
                            $patientViewModel.updatePatientNumber(number);
                        }
                    });

                    $consultationHub.on("consultationStarted", function () {
                        showTimerUI();
                    });
                    $consultationHub.on("start", function () {
                        $(".btnSession").show();
                        $(".btnSession").removeClass('disabledbtn');
                        
                        
                        showTimerUI();
                        $consultationHub.getPatientTemporaryContactNumber().then(function (data) {
                            if (data) {
                                $patientViewModel.updatePatientNumber(data);
                            }
                        });
                        $consultationHub.isPatientInMobileDevice().then(function (flag) {
                            $scope.enableChat(!flag);
                        });
                        app.snapFileService.subscribeNotification(false);
                        if (consultationInfo.statusId == snap.consultationStatus.startedConsultation ||
                            consultationInfo.statusId == snap.consultationStatus.disconnectedConsultation) {
                            $(".btnSession").hide();
                            return;
                        }
                        $consultationHub.reviewConsultationReview().done(function () {
                            if (snap.consultationSession && snap.consultationSession.startAutomatically) {
                                $scope.startSession();
                            }
                        });

                    });
                    $meetingHub.on("start", function() {
                        $userConsultationChat.openChat(snap.consultationSession.meetingId);
                    });
                    $mainHub.start();
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
                            snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
                            $("#btnConfirmYes").click(function () {
                                $eventaggregator.published("requestdisconnect", { 'url': url });
                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                            });
                        } else {

                            snapConfirm("You  have a customer in waiting room.\n Are you sure you want to leave this consultation?");
                            $("#btnConfirmYes").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                                location.href = url;
                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remov
                                e();

                            });
                        }
                    }
                    if ($(this).hasClass("logout")) {
                        url = $(this).attr("href");
                        if ($scope.isStarted) {
                            snapConfirm("You currently have a consultation in progress.\n Are you sure you want to logout?");
                            $("#btnConfirmYes").click(function () {
                                $eventaggregator.published("requestdisconnect", { 'url': url });

                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                            });
                        } else {

                            snapConfirm("You  have a customer in waiting room.\n Are you sure you want to logout?");
                            $("#btnConfirmYes").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                                location.href = url;
                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();

                            });
                        }
                    }
                };
                $eventaggregator.subscriber("checkDroppedConsultation", function () {
                    if (snap.customerSafeDisconnect || snap.consultationSession.physicianCompleteSoapNotes) {
                        return;
                    }
                    $consultationHub.checkDroppedConsultation().then(function ($data) {
                        if ($data && ($data == true)) {
                            snap.updateSnapConsultationSessionValue("physicianCompleteSoapNotes", true);
                            var phnNumber = patientInfo.mobilePhone || patientInfo.homePhone
                            $snapNotification.info("It seems you’ve been disconnected.\n Please use the number below to call the patient in order to complete the consultation. \n If further video time is needed you can create a new appointment for the patient.\n " + phnNumber);
                        }

                    }).fail(function () {
                        $snapNotification.info("It seems you’ve been disconnected.");
                    });
                });


                $eventaggregator.subscriber("requestdisconnect", function (data) {
                    consultStatus = snap.consultationStatus.unknown;
                    $consultationHub.endConsultation().then(function (result) {

                        if (result && result['Result']) {
                            var status = result.status;
                            $eventaggregator.published("ondisconnect", {});
                            if (status == snap.consultationStatus.droppedConsultation) {
                                //ony need to check for dropped.
                                var phnNumber = patientInfo.mobilePhone || patientInfo.homePhone
                                $snapNotification.info("It seems you’ve been disconnected.\n Please use the number below to call the patient in order to complete the consultation. \n If further video time is needed you can create a new appointment for the patient.\n " + phnNumber);

                            } else {
                                $snapNotification.success("Consultation ended. Please wait while we transfer you to home page.");
                            }
                            //get the main hub
                            try {
                                //we know that we are going to redirect to other page here so its save to flag ConsultationPage off 
                                snap.ConsultationPage = false;
                                var $hub = snap.resolveObject("snap.hub.mainHub");
                                if ($hub) {
                                    $hub.isManualStop = true;
                                }
                            }catch(ex){

                            }


                            if ((typeof data === 'undefined') || (typeof data.url === 'undefined'))
                                window.location.href = snap.getClinicianHome();
                            else
                                window.location.href = data.url;

                        } else {
                            $snapNotification.info("Unable to end this consultation");
                        }
                    });
                });
                $eventaggregator.subscriber("onclientConnected", function () {
                    $(".btnSession").addClass('hidden');
                    $(".btnSessionEnd").removeClass('hidden');
                    $('nav li').removeClass("disabled");
                });




                this.loadData = function () {
                    $patientViewModel.init(snap.ParticipantType.Physician);
                    kendo.bind($("#appointment-container"), $tokboxVM);
                    kendo.bind($("#patientContainer"), $patientViewModel);
                    $appointmentService.getAppointment(this.appointmentId).then(function (result) {
                        if (result) {
                            consultationInfo = result.data[0].consultationInfo;
                            patientInfo = result.data[0].patientInformation;

                            snap.consultationSession.meetingId = result.data[0].meetingId;
                            $patientViewModel.updateUnreadMessagesCount();

                            if (consultationInfo) {

                                if (consultationInfo.statusId == snap.consultationStatus.endedConsultation) {
                                    $snapNotification.info("This consultation has already completed.");
                                    setTimeout(function () {
                                        location.replace(snap.getClinicianHome());
                                    }, 1000);
                                    return;

                                }
                                if (consultationInfo.statusId == snap.consultationStatus.droppedConsultation) {
                                    if (snap.consultationSession.physicianCompleteSoapNotes) {
                                      
                                        $tokboxVM.onSessionStarted();
                                        
                                        $headerViewModel.onSessionStarted();
                                        $scope.isStarted = true;
                                       
                                        $scope.enableSoapTab(true);
                                        app.snapFileService.viewModel.drill();
                                        app.snapFileService.bottomViewModel.drill();
                                    } else {
                                        $snapNotification.info("This consultation is no longer valid.");
                                        setTimeout(function () {
                                            location.replace(snap.getClinicianHome());
                                        }, 1000);
                                        return;
                                    }
                                }

                                if (consultationInfo.statusId == snap.consultationStatus.startedConsultation || 
                                    consultationInfo.statusId == snap.consultationStatus.disconnectedConsultation) {
                                    /*
                                    $tokboxVM.set("isStarted", true);
                                    $tokboxVM.set("isVideoBtn", true);
                                    $tokboxVM.set("isMicrophoneBtn", true);
                                    $tokboxVM.set("isMuteBtn", true);
                                    $tokboxVM.set("consultButtonTitle", "End Consult");
                                    */
                                    $tokboxVM.onSessionStarted();


                                    $headerViewModel.onSessionStarted();
                                    $scope.isStarted = true;
                                    $scope.enableTab(true);
                                    app.snapFileService.consultStatus = 1;
                                    app.snapFileService.viewModel.drill();
                                    app.snapFileService.bottomViewModel.drill();
                                }
                                $patientViewModel.setAppointmentData(result.data);
                                $tokboxVM.setAppointmentData(result.data);
                                $appointmentService.getVideoKey($scope.appointmentId).then(function (data) {
                                    $tokboxVM.setSessionInformation(data);
                                });

                                var assignedDoctorId = consultationInfo.assignedDoctorId || snap.profileSession.userId;
                                $appointmentService.getPhysicianInformation(assignedDoctorId).then(function (data) {
                                    if (data.data.length > 0) {
                                        $tokboxVM.setProviderData(data.data[0]);
                                        $("#physicianIcon").attr('src', data.data[0].profileImagePath);

                                    }
                                });

                                $appointmentService.getParticipants($scope.appointmentId).then(function (data) {
                                    data = data.data[0];
                                    $tokboxVM.setParticipants(data);
                                });
                                initHub();
                            }
                            else {
                                $snapNotification.error("consultation not found");
                                setTimeout(function () {
                                    location.replace(snap.getClinicianHome());
                                }, 1000);
                                return;
                            }
                        }
                    });
                };
                this.enableTab = function (flag) {
                    if (flag) {
                        $(".sopatab,.ePrescribe,.chattab, .filestab").removeClass("disabled k-state-disabled");
                    } else {
                        $(".sopatab,.ePrescribe,.chattab, .filestab").addClass("disabled k-state-disabled");
                    }
                };
                this.enableChat = function (flag) {
                    if (flag) {
                        $(".chattab").removeClass("disabled k-state-disabled");
                    } else {
                        $(".chattab").addClass("disabled k-state-disabled");
                    }
                };
                this.enableSoapTab = function (flag) {
                    if (flag) {
                        $(".sopatab").removeClass("disabled k-state-disabled");
                    } else {
                        $(".sopatab").addClass("disabled k-state-disabled");
                    }
                };
                this.isStarted = false;
                this.startSession = function () {
                    var $def = $.Deferred();
                    $consultationHub.startConsultation().then(function (data) {
                        if (data && data.Status === snap.consultationStatus.doctorInitiatedConsultation) {
                            $headerViewModel.onSessionStarted();
                            snap.consultationSession.meetingId = data.MeetingId;
                            $userConsultationChat.openChat(snap.consultationSession.meetingId);
                            $patientViewModel.updateUnreadMessagesCount();
                            $tokboxVM.onSessionStarted();
                            showTimerUI();
                            $scope.isStarted = true;
                            consultStatus = 1;
                            app.snapFileService.consultStatus = 1;
                            app.snapFileService.viewModel.drill();
                            app.snapFileService.bottomViewModel.drill();
                            $scope.enableTab(true);
                            $def.resolve(true);
                        } 
                        else {
                            $def.reject(true);
                            $snapNotification.info("The Patient is currently not available for this consultation");
                        }
                    });
                    return $def.promise();
                };
                this.endSession = function () {
                    snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
                    $("#btnConfirmYes").click(function () {
                        $eventaggregator.publish("requestdisconnect", {});
                    });
                    $("#btnConfirmNo").click(function () {
                        $(".k-notification-confirmation").parent().remove();
                    });
                };
                this.updateHeaderButton = function () {
                    var _assignBtnEvent = function () {
                        $(".btnSessionEnd").hide();
                        $(".btnSession").hide();
                        $(".btnSessionEnd").off("click").on('click', function () {
                            snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
                            $("#btnConfirmYes").click(function () {
                                $eventaggregator.published("requestdisconnect", {});
                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                            });
                        });


                    }

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

                this.bindPatientUI = function () {
                    $('#main-nav')
                      .on('click', 'li > a', selectMenuItem);
                    $('#soap-field-s, #soap-field-o, #soap-field-a, #soap-field-p').kendoEditor();
                };
                this.init = function () {

                    if (!snap.consultationSession) {

                        $snapNotification.info("Consultation Information is not valid");
                        setTimeout(function () {
                            location.href = snap.getClinicianHome();
                        }, 5000);
                        return;
                    }
                    var tabsInfo = $("#clinician-consultation-tabs").kendoTabStrip({
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
                    this.bindPatientUI();
                    $scope.updateHeaderButton();
                    this.loadData();
                    if (app.headerService) {
                        app.headerService.viewModel.getClientInfo(snap.hospitalId);
                    }
                    $('#nav-toggle').click(function (e) {
                        e.preventDefault();
                        toggleMenu();
                    });

                    var isfileSharingEnable = false;
                    var isMessaging = false;
                    var isBetaVideo = false;

                    if (snap['getSnapHospitalSettings']) {
                        snap.getSnapHospitalSettings();
                        if (snap.hospitalSettings) {

                            isfileSharingEnable = snap.hospitalSettings.fileSharing == true;
                            isBetaVideo = snap.hospitalSettings.videoBeta == true;
                            isMessaging = snap.hospitalSettings.messaging == true;

                        }
                    }
                    $('.js-toggle-invite-form').on('click', function () {
                        $('.patient-invite__users').toggleClass('is-active')
                        $('.patient-invite__container').toggleClass('is-active')
                        $(this).toggleClass('is-active');
                    });


                    $tokboxVM.setBetaParameter(isBetaVideo);

                    if (!isMessaging) {
                        var elMsg = $(".chattab");
                        tabsInfo.remove(elMsg);
                    }

                    if (!isfileSharingEnable) {
                        var elInfo = $(".filestab");
                        tabsInfo.remove(elInfo);
                    } else {
                        $("#fileSharingSection").load("/content/filesharing.html" + snap.addVersion, function () {
                            initFileSharingControls(1);
                            setupConsultation(snap.profileSession.userId, snap.consultationSession.patientId, snap.consultationSession.consultationId);
                        });
                    }
                    //Kubi

                    if (isBetaVideo) {

                        $tokboxVM.initKubi().then(function () {
                            $tokboxVM.showKubiPad(true);
                        });
                    } else {

                        $tokboxVM.showKubiPad(false);
                    }
                    setTimeout(function () {

                        $("#divMainWrap").removeClass("blockSnapUI");
                    }, 500);

                    $('.patient-data__userinfo .close').click(function () {
                        $(this).toggleClass('is-active');
                    });
                };

            }).singleton();

}(jQuery));
//@ sourceURL=patientwaitingroom.js

/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../viewModels/common/session.js" />
/// <reference path="../../viewModels/common/pagestyle.js" />
/// <reference path="../../viewModels/common/header.js" />



; (function ($) {
    snap.namespace("snap.patient")
          .extend(kendo.observable)
        .use(["eventaggregator", "snapNotification", "snapLoader", "snap.utility.PageStyle", "snap.common.Session", "snap.common.Utility", "snap.hub.ChatHub", "snap.hub.MeetingHub", "snap.hub.notificationService", "snap.clinician.patientQueue.doctorToPatientPreConsultationChat", "snap.common.contentLoader", "snap.hub.ConsultationHub", "snap.hub.mainHub", "snap.Service.MessengerService"])
        .define("WaitingRoomViewModel",
            function ($eventaggregator, $snapNotification, $snapLoader, $pageStyle, $session, $utility, $chatHub, $meetingHub, $notificationService, $doctorToPatientPreConsultationChat, $contentLoader,  $consultationHub, $mainHub, $messengerService) {
               
                var $scope = this;
                this.hospitalImg = "";
                this.emergencyNo = "";
                this.patientContactNumber = "";
                this.waitingmessage = "Please Wait";

                this.doctorToPatientPreConsultationChat = $doctorToPatientPreConsultationChat;
                this.isBetaVideo = snap.hospitalSettings.videoBeta ? true : false;
                this.isChatAvailable = true;
               

                

                this.user = snap.profileSession;
                this.patientContactNumber = this.user.contactNumber;
                $.extend(this.user, {
                });

                var UpdateContactNumber = function () {
                    var contactNumber = $utility.removePhoneFormat($scope.patientContactNumber);
                        var profileData = snap.profileSession;
                        profileData.contactNumber = contactNumber;
                        snap.setSnapJsSession("snap_patientprofile_session", profileData);
                        $scope.set("patientContactNumber", snap.string.formatUSPhone(contactNumber));
                        if ($consultationHub) {
                            $consultationHub.updatePatientNumber(contactNumber).then(function (flag) {
                                if (flag) {
                                    $snapNotification.success("Your immediate contact number is changed");
                                }
                            });
                        }
                     

                };

               
                this.chatMessages = [];
                this.hasNewMsg = false;
                this.countNewMsg = 0;
                this.isChatOpen = false;
                this.onChatBtnClick = function (e) {
                    e.preventDefault();
                    if (!this.chatOpen) {
                        this.hasNewMsg = false;
                        this.countNewMsg = 0;
                    }
                    this.isChatOpen = !this.isChatOpen;
                    $scope.trigger("change", { field: "isChatOpen" });
                    $scope.trigger("change", { field: "countNewMsg" });
                    $scope.trigger("change", { field: "hasNewMsg" });

                    if(this.isChatOpen) {
                        $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                    }
                    return false;
                };
                this.chatMessage = "";
                this.sendMessage = function () {
                    
                    $chatHub.sendMessageToPhysician(this.chatMessage).then(function (_data) {
                        $scope.chatMessage = "";
                        _data.name = _data.data.PatientName;
                        _data.imgUrl = _data.data.PatientProfileImg;
                        $scope.chatMessages.push(_data);
                        
                        $scope.trigger("change", { field: "chatMessage" });
                        $scope.trigger("change", { field: "chatMessages" });
                        $scope.trigger("change", { field: "countNewMsg" });
                        $scope.trigger("change", { field: "hasNewMsg" });
                    });
                    $scope.trigger("change", { field: "chatMessages" });
                };

                this.sendMeetingMessage = function (message) {
                    var conSession = snap.consultationSession;
                    var meetingId = conSession.meetingId;
                    var personId = conSession.personId;
                    $meetingHub.sendMeetingMessage(meetingId, personId, message);
                };

                var goToHome = function () {
                    window.setTimeout(function() {
                        sessionStorage.removeItem("snap_consultation_session");
                        snap.isWaitingRoom = false;
                        $mainHub.stop();
                        window.location.href = snap.getPatientHome();
                    }, 1000);
                };


                var initHub = function () {
                    $mainHub.register($meetingHub, {meetingPersonId: snap.consultationSession.personId});
                    $mainHub.register($consultationHub, snap.ConsulationPageType.CustomerWaitingPage);
                    if ($chatHub) {
                        $chatHub.on("deliverMessageToPatient", function (_data) {

                            _data.name = _data.data.PhysicianName;
                            _data.imgUrl = _data.data.PhysicianProfileImg;
                            $scope.countNewMsg++;
                            $scope.hasNewMsg = true;
                            $scope.chatMessages.push(_data);
                            $scope.trigger("change", { field: "chatMessages" });
                            $scope.trigger("change", { field: "countNewMsg" });
                            $scope.trigger("change", { field: "hasNewMsg" });
                        });
                        $mainHub.register($chatHub);
                    }

                    $consultationHub.on("consultationReview", function () {
                        $scope.set("waitingmessage", "The provider is now reviewing the intake form");
                        $("#h3WaitReviewText").html("The provider is now reviewing the intake form");
                        $("#pWaitReviewText").html("Your consultation will begin momentarily");
                    });
                    $consultationHub.on("customerDefaultWaitingInformation", function () {
                        $scope.set("waitingmessage", "Please Wait");
                        $("#h3WaitReviewText").html("Please Wait");
                        $("#pWaitReviewText").html("Your consultation will begin momentarily");
                    });
                    $consultationHub.on("start", function () {
                        $consultationHub.updatePatientNumber($scope.patientContactNumber);
                        $consultationHub.isPatientInMobileDevice().then(function (flag) {
                            if (flag) {
                                $scope.set("isChatAvailable", false);
                            }

                        });

                    });
                    $consultationHub.on("consultationStarted", function () {
                      
                        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                            var url = "/api/v2/physicians/appointments/" + snap.consultationSession.consultationId + "/videokey";
                            $.get(url).then(function (data) {

                                var sessionId = data.sessionId;
                                var tokenId = data.token;
                                if (tokenId) {
                                    tokenId = tokenId.replace(/=/gi, "@");
                                }
                                var apiKey = data.apiKey;
                                var httpUrl = getBaseURL() + snap.getPatientHome();
                                var url = "appsnapmd://?tokenId=" + tokenId + "&sessionId=" + sessionId + "&apiKey=" + apiKey + "&returnUrl=" + httpUrl;

                                location.href = url;

                                setTimeout(function () {
                                    location.href = httpUrl;
                                }, 3000);
                            });
                        } else {
                            window.location = "/Customer/main#/consultation";

                        }
                    });
                    $notificationService.on("message", function (messageType) {
                        if (messageType === "appointment_cancelled" && snap.isWaitingRoom === true) {
                            $snapNotification.error("This consultation has been cancelled. If you feel this cancellation is in error, please contact your provider.");
                            $consultationHub.disconnectConsultation();
                            goToHome();
                        } else if (messageType === "consultation_fulfilled" && snap.isWaitingRoom === true) {
                            $snapNotification.info("The Provider has marked your consultation as complete.");
                            goToHome();
                        } else if (messageType === "consultation_dismissed" && snap.isWaitingRoom === true) {
                            $snapNotification.info("This consultation has been dismissed. If you feel this cancellation is in error, please contact your provider.");
                            goToHome();
                        }
                    });

                    $mainHub.start();
                    $contentLoader.bindViewModel($scope.doctorToPatientPreConsultationChat, "#chatContainer", "/content/shared/chat.html?svp=snapversion").done(function (vm) {
                        $scope.doctorToPatientPreConsultationChat.load({
                            personId: snap.consultationSession.personId
                        });

                        $scope.doctorToPatientPreConsultationChat.openChat(snap.consultationSession.meetingId);

                        $messengerService.getUnreadConversationsCount(snap.consultationSession.meetingId, snap.consultationSession.personId).done(function(data) {
                            if(data.data[0] > 0) {
                                $scope.set("countNewMsg", data.data[0]);
                                $scope.set("hasNewMsg", true);
                            } else {
                                $scope.set("countNewMsg", 0);
                                $scope.set("hasNewMsg", false);
                            }
                        });

                        $meetingHub.on("onPreConsultationMessageReceived", function (data) {
                            if(data.meetingId === snap.consultationSession.meetingId) {
                                if($scope.isChatOpen) {
                                    $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                                } else {
                                    $scope.set("countNewMsg", $scope.countNewMsg + 1);
                                    $scope.set("hasNewMsg", true);
                                    playSound();
                                }
                            }
                        });
                    });       
                };
                var soundPlayer;
                var playSound = function () {
                    var sound = $messengerService.getRingtone("incommingMessage");
                    soundPlayer = new Audio(sound);
                    soundPlayer.play();

                };

                snap.getSnapUserSession();


                $(document).ajaxSend(function (e, jqxhr, settings) {
                    var isApi = false;
                    if (/^\//.test(settings.url))
                        isApi = true;
                    if (/^http[s]?:\/\/[^\/]+\/api/.test(settings.url))
                        isApi = true;
                   
                    if (snap && isApi && snap.userSession) {
                        if (snap.userSession.token)
                            jqxhr.setRequestHeader("Authorization", "Bearer " + snap.userSession.token);
                        if (snap.userSession.apiDeveloperId)
                            jqxhr.setRequestHeader("X-Developer-Id", snap.userSession.apiDeveloperId);
                        if (snap.userSession.apiKey)
                            jqxhr.setRequestHeader("X-Api-Key", snap.userSession.apiKey);
                    }
                });
                var getConsultation = function () {
                    var url = "/api/v2/physicians/appointments/" + snap.consultationSession.consultationId;
                    return $.getJSON(url);
                };

                this.start = function () {
                    this._subscribeToEventAgregatorEvents();

                    snap.getPatientProfileSession();
                    
                    var hospitalInfo = $session.getHospitalInformation();
                    if (hospitalInfo) {
                        $scope.set("hospitalImg", hospitalInfo.hospitalLogo);
                    }
                    var userInfo = $session.getUserInformation();
                    if (userInfo) {
                        this.set("patientContactNumber", snap.string.formatUSPhone(userInfo.contactNumber));
                    }
                    getConsultation().then(function (result) {
                        var data = result.data[0];
                        if (data) {
                           

                            var statusId = data.statusId;

                            if (statusId === snap.consultationStatus.droppedConsultation ||
                                statusId === snap.consultationStatus.endedConsultation ||
                                statusId === snap.consultationStatus.cancelConsultaion) {
                                snapInfo("This consultation has already completed.");
                                setTimeout(function () {
                                    goToHome();
                                }, 2000);
                            }
                            else if (statusId === snap.consultationStatus.doctorReviewConsultation) {
                                $scope.set("waitingmessage", "The provider is now reviewing the intake form");
                                $("#h3WaitReviewText").html("The provider is now reviewing the intake form");
                                $("#pWaitReviewText").html("Your consultation will begin momentarily");
                                initHub();
                            }
                            else {
                                if (kendo.support.mobileOS) {
                                    snap.openMobileApp(snap.consultationSession.consultationId, function () {

                                        $mainHub.stop();
                                        setTimeout(function () {
                                            initHub();
                                        }, 1000);
                                    });
                                    return;
                                }
                                initHub();
                            }
                        } else {
                            snapInfo("This consultation is no longer valid.");
                            setTimeout(function () {
                                goToHome();
                            }, 2000);
                        }
                    });

                    if (kendo.support.mobileOS) {
                        //if mobile then check the consulation in every 20 sec for proper redirection to home if app is open 
                        // there is no way to track the app so just run in certian interval

                        setInterval(function () {
                            getConsultation().then(function (result) {
                                var data = result.data[0];
                                if (data) {
                                    var statusId = data.statusId;
                                    if (statusId === snap.consultationStatus.droppedConsultation ||
                                        statusId === snap.consultationStatus.endedConsultation ||
                                        statusId === snap.consultationStatus.cancelConsultaion) {
                                        snapInfo("This consultation has already completed.");
                                        setTimeout(function () {
                                            goToHome();
                                        }, 2000);
                                    }
                                }
                            });
                        }, 20000);
                    }
                };
          

                this.onContactClick = function () {
                    if (this._isContactNumberValid($scope.patientContactNumber)) {
                        UpdateContactNumber();
                    }
                    return true;

                };
                this._isContactNumberValid = function (contactNumber) {
                    var textBoxContactNumber = $.trim(contactNumber);
                    if (textBoxContactNumber.length < 5 || textBoxContactNumber.length > 20) {
                        snapError("Contact Number must be minimum 5 & maximum 20 digits.");
                        return false;
                    }
                    return true;
                };


                this.checkPayment = function () {
                    var checkPaymentDeferred = $.Deferred();
                    snap.getSnapConsultationSession();
                    snap.getSnapUserSession();
                    if (!snap.userSession || !snap.userSession.token) {
                        goToHome();
                    }
                    if (!snap.consultationSession || !snap.consultationSession.consultationId) {
                        checkPaymentDeferred.reject();
                    } else {
                        if (snap.consultationHelper.isPaymentRequired()) {
                            window.snap.consultationId = snap.consultationSession.consultationId;
                            var path = '/api/v2/patients/copay/' + snap.consultationSession.consultationId + '/paymentstatus';
                            $.ajax({
                                type: "GET",
                                url: path,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    var data = response.data[0];
                                    if (data) {
                                        checkPaymentDeferred.resolve();
                                    } else {
                                        checkPaymentDeferred.reject();
                                    }

                                },
                                error: function () {
                                    checkPaymentDeferred.reject();
                                }
                            });
                        }
                        else {
                            checkPaymentDeferred.resolve();
                        }
                    }
                    return checkPaymentDeferred.promise();
                };

                this._subscribeToEventAgregatorEvents = function() {
                    var that = this;

                    $eventaggregator.subscriber("doctorToPatientPreConsultationChat_messageAdded", function() {
                        if(!that.chatOpen) {
                            that.set("countNewMsg", that.countNewMsg + 1);
                            that.set("hasNewMsg", true);
                        }
                    });
                };
               

            }).singleton();


   
}(jQuery));










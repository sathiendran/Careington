/// <reference path="/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />



; (function ($, snap, kendo, OT) {
    "use strict";

    snap.define("deviceapi", function () {
        var devicesById = {};

        var getDeviceLabel = function (device, currentMode) {
            currentMode = currentMode || "videoSource";
            if (device.label) {
                return device.label;
            }
            return (currentMode !== 'audioSource' && 'Camera' || 'Mic') +
              ' (' + device.deviceId.substring(0, 8) + ')';
        };

        var extractDevice = function (device) {
            devicesById[device.deviceId] = device;
            return {
                value: device.deviceId,
                label: getDeviceLabel(device)
            };
        };

        var extractAudioDevice = function (device) {
            devicesById[device.deviceId] = device;
            return {
                value: device.deviceId,
                label: getDeviceLabel(device, "audioSource")
            };
        };

        var manageVideoDeviceList = function (devices) {
            var tmpList = [];
            if (devices.length > 0) {
                devices.map(extractDevice).map(function (tag) {
                    tmpList.push(tag);
                });

            }
            return tmpList;
        };
        var manageAudioDeviceList = function (devices) {
            var tmpList = [];
            if (devices.length > 0) {
                devices.map(extractAudioDevice).map(function (tag) {
                    tmpList.push(tag);
                });

            }
            return tmpList;
        };
        this.getVideoDeviceList = function () {

            var $def = $.Deferred();
            OT.getDevices(function (error, devices) {

                if (error) {
                    return;
                }
                var audioList = manageVideoDeviceList(devices.filter(function (device) {
                    return device.kind === 'videoInput';
                }));
                $def.resolve(audioList);

            });
            return $def.promise();
        };

        this.getAudioDeviceList = function () {
            var $def = $.Deferred();
            OT.getDevices(function (error, devices) {

                if (error) {
                    return;
                }
                var cameraList = manageAudioDeviceList(devices.filter(function (device) {
                    return device.kind === 'audioInput';
                }));
                $def.resolve(cameraList);

            });
            return $def.promise();
        };

    });
    var isDev = location.href.indexOf("snap.local") >= 0;
    var openConsultationTokboxViewModel = function ($snapNotification, $snapHttp, $snapLoader, $eventaggregator, $tokboxTest,
        $layoutManager, $deviceapi, $consultationHub, $mainHub, $meetingHub) {
        var _this = this;
        this.mainHub = $mainHub;
        this.meetingHub = $meetingHub;
        this.snapNotification = $snapNotification;
        this.snapHttp = $snapHttp;
        this.snapLoader = $snapLoader;
        this.eventaggregator = $eventaggregator;
        this.layoutManager = $layoutManager;
        this.consultationHub = $consultationHub;
        this.tokboxTest = $tokboxTest;
        this.deviceapi = $deviceapi;
        this.connectionFailedCheckerInterval = null;
        this.isReenterStarted = false;
        this.cacheProvidersDetails = {};

        //Default Value
        var defaultUser = {
            profileImage: getDefaultProfileImageForClinician()
        };
        this.isConnectionReconnecting = false;
        this.meetingInformation = null;
        this.isStarted = false;
        this.consultButtonTitle = "Start Consult";
        this.screenType = 1;
        this.providerDetails = false;
        this.providerDetailsInformation = defaultUser;
        this.infoPanel = false;
        this.mobileInfoPanel = false;
        this.isShowMobileVideoControl = false;


        //Participants Data
        this.participants = [];
        this.hasParticipants = function () {
            return this.participants.length > 0;
        };
        this.isTransferFromProviderChat = false;
        this.providerLabels = "Provider";
        this.providers = [];
        //Sesssion Data

        this.sessionInformation = null;
        this.session = null;
        this.sessionConnectEvent = null;
        this.sessionError = null;

        this.publisher = null;
        this.publishError = null;

        this.screenPublisher = null;


        //#region viewModel Property
        this.currentSelectedProvider = defaultUser;
        this.consultationInfo = null;
        this.patientInformation = null;
        this.isPatientInMobileDevice = false;
        this.clientconnected = false;
        this.isSelfView = false;
        this.isVideoBtn = false;
        this.isVideoMute = false;
        this.isVideoUnMute = true;
        this.hasVideoInititlized = false;
        this.isMuteMicrophone = false;
        this.isUnMuteMicrophone = true;
        this.isMicrophoneBtn = false;
        this.isUnMute = true;
        this.isMute = false;
        this.isBeta = false;
        this.videoDisconnected = false;
        this.selectedVideoSource = null;
        this.selectedAudioSource = null;
        this.sessionTime = "00:00";
        this.invitationEmail = "";
        this.participantId = null;

        this.isMeidiaInfoShown = false;
        this.isMeidiaInfoInitialized = false;
        this.mediaInfoVM = null;

        this.customerSafeDisconnect = false;

        //side bar
        this.activeSetting = false;
        this.activeShare = false;
        this.activeParticipants = false;
        this.activeImages = false;

        this.subscribers = [];
        this.videoSourceList = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    _this.deviceapi.getVideoDeviceList().then(function (data) {
                        options.success(data);

                    }).fail(function () {
                        options.success([]);
                    });
                }
            }
        });
        this.audioSourceList = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    _this.deviceapi.getAudioDeviceList().then(function (data) {
                        options.success(data);
                    }).fail(function () {
                        options.success([]);
                    });
                }
            }
        });
        //#endregion



    };
    openConsultationTokboxViewModel.prototype.onSessionStarted = function () {
        this.set("isStarted", true);
        this.set("consultButtonTitle", "End Consult");
        this.set("isVideoBtn", true);
        this.set("isMicrophoneBtn", true);
        this.set("isMuteBtn", true);
    };

    //#region Participants
    openConsultationTokboxViewModel.prototype.initMeetingHub = function () {
        this.mainHub.register(this.meetingHub, { openConsultation: 1 });
    };

    openConsultationTokboxViewModel.prototype._initParticipantEvent = function () {
        var _this = this;

        $(".patient-invite__list .guest-header").off("click").on("click", function (e) {

            e.preventDefault();
            var participantTypeCode = $(this).data("participanttypecode");
            var personId = $(this).data("personid");
            if (participantTypeCode == 2) {
                _this.showProviderDetails({
                    data: {
                        participantTypeCode: participantTypeCode,
                        personId: personId
                    }
                });
            }
        });
        $(".patient-invite__list .patient-invite__close").off("click").on("click", function (e) {
            var that = this;
            if (e) e.stopPropagation();
            var id = $(this).data("id");
            if (id) {
                ; (function (_id) {
                    _this.snapNotification.confirmationWithCallbacks("Are you sure you want to disconnect the selected guest?", function() {
                        _this.meetingHub.disconnectPartisipant(_id).then(function() {
                            $(that).parent().remove();
                            setTimeout(function () {
                                _this.layoutManager.refreshLayout();
                            }, 1000);
                        });
                    });

                }(id));
               

            }

        });
    };
    openConsultationTokboxViewModel.prototype.setProviders = function (providers) {
        if (providers && $.isArray(providers)) {
            this.set("providers", providers);
            this.set("providerLabels", "Provider");
            this.set("isTransferFromProviderChat", true);
        }
    };
    openConsultationTokboxViewModel.prototype.setProvidersDetails = function (providersDetails) {
        this.cacheProvidersDetails = providersDetails;
        this.trigger("change", { field: "isCustomerOrPhysician" });
        this.trigger("change", { field: "participants" });
        this.trigger("change", { field: "hasParticipants" });
    };



    openConsultationTokboxViewModel.prototype.setParticipantsData = function (participants) {
        if (participants && $.isArray(participants)) {
            var _this = this;
            var provider = this.providerDetailsInformation;

            this.participants = participants.filter(function (item) {
                return provider.personId != item.personId;
            });
            this.participants.forEach(function(item) {
                if (_this.screenType === 3) {
                    item.canBeRemoved = false;
                } else if (item.personId === snap.profileSession.personId) {
                    item.canBeRemoved = false;
                } else {
                    item.canBeRemoved = true;
                }
            });

            this.trigger("change", { field: "isCustomerOrPhysician" });
            this.trigger("change", { field: "participants" });
            this.trigger("change", { field: "hasParticipants" });
            
            setTimeout(function () {
                _this._initParticipantEvent.apply(_this, []);
            }, 3000);

        }
    };

    openConsultationTokboxViewModel.prototype.getParticipant = function (participantId) {
        return this.participants.find(function (item) {
            return item.participantId == participantId;
        });
    };

    openConsultationTokboxViewModel.prototype.addParticipants = function () {
        var path = '/api/v2.1/openconsulation/meetings/' + this.meetingInformation.meetingId + '/participants';

        var authHdr = snap.userSession && snap.userSession.token ? "Bearer " + snap.userSession.token : sessionStorage.getItem("participantToken") ? "JWT-Participant " + sessionStorage.getItem("participantToken") : "";

        return this.snapHttp.ajax({
            url: path,
            type: "POST",
            headers: {
                'Authorization': authHdr,
                'Content-Type': 'application/json; charset=utf-8',
            },
            dataType: "json",
            data: JSON.stringify({
                participantType: 3,
                firstName: "",
                lastName: ""
            })
        });
    };
    openConsultationTokboxViewModel.prototype.sendInvitationEmail = function (participantId) {
        var path = '/api/v2/mail/participants/' + participantId + "/openconsultation";

        var authHdr = snap.userSession && snap.userSession.token ? "Bearer " + snap.userSession.token : sessionStorage.getItem("participantToken") ? "JWT-Participant " + sessionStorage.getItem("participantToken") : "";

        var userId = sessionStorage["senderUserId"] ? sessionStorage["senderUserId"] : 0;

        return this.snapHttp.ajax({
            url: path,
            type: "POST",
            headers: {
                'Authorization': authHdr,
                'Content-Type': 'application/json; charset=utf-8',
            },
            dataType: "json",
            data: JSON.stringify({
                email: this.invitationEmail,
                name: this.getName(),
                userId: userId
            })
        });
    };
    openConsultationTokboxViewModel.prototype.sendInvitation = function (e) {
        var _this = this;
        var button = $(e.currentTarget);
        e.preventDefault();

        if (this.invitationEmail === "") {
            _this.snapNotification.info("Please enter email.");
            return;
        }
        if (snap.regExMail.test(this.invitationEmail)) {
            if (_this.isStarted) {

                if (button.hasClass('error')) {
                    button.removeClass('button__red error').addClass('button__green is-loading');
                } else {
                    button.addClass('is-loading');
                }

                e.preventDefault();
                this.addParticipants().then(function (data) {
                    var data = data.data[0];
                    _this.participantId = data.participantId;
                    _this.sendInvitationEmail(data.participantId).then(function (result) {
                        if (result == "Success") {
                            _this.set("invitationEmail", "");
                        }
                        _this.snapNotification.info("Invitation successfully sent.");
                        button.removeClass('is-loading');
                        $('.patient-invite__invite-guests').removeClass('is-active');
                        $('.patient-invite__container').removeClass('is-active');
                    }).fail(function () {
                        _this.snapNotification.error("There is problem sending invitation");
                        button.removeClass('button__green is-loading').addClass('button__red error');
                    });
                }, function (result) {
                    button.removeClass('button__green is-loading').addClass('button__red error');
                    if (result.status == 405) {
                        _this.snapNotification.error(result.responseText);
                    } else {
                        _this.snapNotification.error("There is problem sending invitation");
                    }
                });

            } else {
                _this.snapNotification.info("Please start this consultation in order to access this feature.");
            }
        } else {
            _this.snapNotification.info("Email is not valid.");
        }
    };

    //#endregion

    //#region basic set function
    openConsultationTokboxViewModel.prototype.setPatientData = function (data) {
        this.set("patientInformation", data);

    };
    openConsultationTokboxViewModel.prototype.setPatientConnectedDevice = function (flag) {
        this.isPatientInMobileDevice = flag;
    };
    openConsultationTokboxViewModel.prototype.setProviderData = function (data) {
        if (data) {
            if (data['gender'] && data.gender == "M") {
                data['maleicon'] = true;
                data['femaleicon'] = false;
                data['gendericon'] = "icon_male";
            } else {

                data['maleicon'] = false;
                data['femaleicon'] = true;
                data['gendericon'] = "icon_female";
            }
            data.name = data.name || data.firstName;

            data.email = data.email || "";
            if (data.dob) {
                var ageStr = snap.getAgeString(data.dob);
                data.age = ageStr;
            } else {
                data.age = "";
            }
        }
        this.set("currentSelectedProvider", data);
        this.set("providerDetailsInformation", data);
    };
    openConsultationTokboxViewModel.prototype.startTimer = function (hrs, min, sec) {
        var _this = this;
        min = min || 0;
        sec = sec || 0;
        hrs = hrs || 0;
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        this._timerInterval = setInterval(function () {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
            }
            if (min == 60) {
                min = 0;
                hrs++;
            }
            var minStr;
            var secStr;
            var hrsStr;
            if (min < 10) {
                minStr = "0" + min;
            } else {
                minStr = "" + min;
            }
            if (sec < 10) {
                secStr = "0" + sec;
            } else {
                secStr = "" + sec;
            }
            if (hrs < 10) {
                hrsStr = "0" + hrs;
            } else {
                hrsStr = "" + hrs;
            }

            if (hrs === 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);


    };
    openConsultationTokboxViewModel.prototype.startTimer = function (hrs, min, sec) {
        var _this = this;
        min = min || 0;
        sec = sec || 0;
        hrs = hrs || 0;
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        this._timerInterval = setInterval(function () {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
            }
            if (min == 60) {
                min = 0;
                hrs++;
            }
            var minStr;
            var secStr;
            var hrsStr;
            if (min < 10) {
                minStr = "0" + min;
            } else {
                minStr = "" + min;
            }
            if (sec < 10) {
                secStr = "0" + sec;
            } else {
                secStr = "" + sec;
            }
            if (hrs < 10) {
                hrsStr = "0" + hrs;
            } else {
                hrsStr = "" + hrs;
            }

            if (hrs === 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);


    };
    openConsultationTokboxViewModel.prototype.setAppointmentData = function (data) {
        data = data[0];
        this.consultationInfo = data.consultationInfo;
        this.set("patientInformation", data.patientInformation);
        $(".profileImageInfo").attr('src', data.patientInformation.profileImagePath);
    };
    openConsultationTokboxViewModel.prototype.setBetaParameter = function (isEnable) {
        this.set("isBeta", isEnable);
        isVideoBeta = isEnable && this.screenType === 1;
        this.set("isMultiParticipantFeatureEnable", true);

    };
    openConsultationTokboxViewModel.prototype.initGuestUI = function() {
        this.screenType = 3;
    };
    openConsultationTokboxViewModel.prototype.showProviderDetails = function (e) {
        var parseStatesLicensed = function (statesJson) {
            if (typeof statesJson === "string") {
                try {
                    var statesObj = JSON.parse(statesJson);
                    return statesObj.map(function (item) {
                        return {
                            countryCode: item.countryCode,
                            states: !!item.regions ? item.regions.map(function (region) { return region.regionCode; }).join(", ") : ""
                        };
                    });
                } catch (e) {
                    return [];
                }
            } else {
                return statesJson;
            }
        };

        var that = this;
        if (e) {
            if (e.data && e.data.participantTypeCode && e.data.participantTypeCode != 2) {
                return;
            }

            //TODO: #9254 tony.y: replace this.set("providerDetails", true); calls with promise
            var personId = e.data ? e.data.personId : null;
            if (personId) {
                var data = this.cacheProvidersDetails[personId];
                if (data) {
                    if (data['gender'] && data.gender == "M") {
                        data['maleicon'] = true;
                        data['femaleicon'] = false;
                        data['gendericon'] = "icon_male";
                    } else {

                        data['maleicon'] = false;
                        data['femaleicon'] = true;
                        data['gendericon'] = "icon_female";
                    }
                    data.name = data.name || data.firstName;

                    data.email = data.email || "";
                    if (data.dob) {
                        var ageStr = snap.getAgeString(data.dob);
                        data.age = ageStr;
                    } else {
                        data.age = "";
                    }
                    data.statesLicenced = parseStatesLicensed(data.statesLicenced);
                    this.set("currentSelectedProvider", data);
                    this.set("providerDetails", true);
                }
                else {
                    var $messengerService = snap.resolveObject("snap.Service.MessengerService");
                    $messengerService.getPhysicianInformationByPersonId(personId).then(function (response) {
                        try {
                            var data = response.data[0];
                            var ageStr = snap.getAgeString(data.dob);
                            data.age = ageStr;
                            data.statesLicenced = parseStatesLicensed(data.statesLicenced);
                            that.set("currentSelectedProvider", data);
                            that.cacheProvidersDetails[personId] = data;
                            that.set("providerDetails", true);
                        }
                        catch (exp) {
                            window.console.error(exp);
                        }
                    });
                }

            } else {
                this.providerDetailsInformation.statesLicenced = parseStatesLicensed(this.providerDetailsInformation.statesLicenced);
                this.set("currentSelectedProvider", this.providerDetailsInformation);
                this.set("providerDetails", true);
            }
        }

    };
    openConsultationTokboxViewModel.prototype.hideProviderDetails = function () {
        this.set("providerDetails", false);
    };

    openConsultationTokboxViewModel.prototype.isCustomerOrGuest = function () {
        return (this.screenType == 2 || this.screenType == 3);
    };
    openConsultationTokboxViewModel.prototype.isCustomerOrPhysician = function () {
        return (this.screenType == 2 || this.screenType == 1);
    };

    //#endregion


    //#region tokbox related mvvm function
    openConsultationTokboxViewModel.prototype.onKeyUp = function () {
        var msg = $("#chatMessageCtl").val();
        this.meetingHub.broadcastChatMessage(this.meetingInformation.meetingId, msg).then(function () {
            $("msg").val("");
        });
    };
    openConsultationTokboxViewModel.prototype.sendDisconnectInformation = function () {
        this.session.signal({
            data: "droppedconsultation",
            type: "all"
        });
    };
    openConsultationTokboxViewModel.prototype.setSessionInformation = function (meeting, session) {
        var _this = this;
        this.meetingInformation = meeting;
        $("#snapImageholder").kendoMobileScroller({
            contentHeight: "84px;"
        });

        this.layoutManager.initElement($("#pluginPlaceholder"));
        this.sessionInformation = $.extend(session, {
            screensharing: {
                extensionID: 'padchhoieclaaocgjbfepahaakajgllb',
                annotation: false
            }
        });
        if (isDev) {
            this.sessionInformation.screensharing.extensionID = "jddomcackhhpblngkemaoiakmiohnjgm";
        }
        this.tokboxTest.setSessionId(session.sessionKey);
        this.tokboxTest.setToken(session.tokenKey);
        this.eventaggregator.published("onInitHub", {});

        this.tokboxTest.loadConfig().then(function () {
            _this.tokboxTest.startTests(function () {
                var allDone = true;

                for (var key in results) {
                    if (key == "testWebSocketSecureConnection") {
                        allDone = allDone && true;
                    } else {
                        var result = results[key];
                        var passed;
                        if (typeof result.passed === "string") {
                            passed = result.warning[result.passed];
                        } else if (result.passed === true) {
                            allDone = allDone && true;
                            $("#" + key).addClass("green");


                        } else {
                            allDone = allDone && false;

                        }
                    }
                }
                if (allDone) {
                    _this.deviceapi.getVideoDeviceList().then(function (data) {
                        _this.startTokboxConection(data);
                    });

                }
            }, function (testName, result) {


                if (typeof result == "number") {
                    $("#" + testName).find(".progress").html(result + "%");
                } else if (result) {
                    results[testName] = result;
                    $("#" + testName).find(".progress").html("100%");//.addClass("circle");

                }
            });
        }).fail(function () {
            _this.deviceapi.getVideoDeviceList().then(function (data) {
                _this.startTokboxConection(data);
            });
        });

    };
    openConsultationTokboxViewModel.prototype.onSessionReconnecting = function () {
        this.set("isConnectionReconnecting", true);
    };
    openConsultationTokboxViewModel.prototype.onSessionReconnected = function () {
        this.set("isConnectionReconnecting", false);
    };
    openConsultationTokboxViewModel.prototype.showSubscribAudioDisabled = function (stream, hasAudio) {
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;
            var mainEL = $(streamDivId).find(".OT_mute");

            if (!hasAudio) {
                mainEL.addClass("OT_active");
            } else {
                mainEL.removeClass("OT_active");
            }

        }
    };
    openConsultationTokboxViewModel.prototype.onSubscribVideoDisabled = function (stream) {
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;

            this.displayUserImage(streamDivId, 2);

        }
    };
    openConsultationTokboxViewModel.prototype.displayUserImage = function (streamDivId, screenType) {
        var mainEL = $(streamDivId);
        var img = mainEL.find("img");

        if (img && img.length === 0) {
            img = $("<img />");
            var userimage = screenType == 2 ? mainEL.find("span.userimage").text() : this.getProfilePic();

            var imgContainer = $("<div />");
            imgContainer.addClass("userpic userpic--is-consult-no-video");
            imgContainer.append(img);
            mainEL.find(".OT_video-poster").append(imgContainer);
            img.attr("src", userimage);
        }
    };
    openConsultationTokboxViewModel.prototype._initSubscriberEvent = function (sub) {
        var _this = this;
        sub.on("videoDisabled", function (event) {
            _this.onSubscribVideoDisabled(event.target.stream);
        });
        sub.on("videoEnabled", function (event) {
            var streamId = event.target.id;
            $('.OT_root').each(function () {
                if ($(this).attr('id') == streamId) {
                    $(this).find(".OT_video-poster").html("");
                }
            });
        });
    };
    openConsultationTokboxViewModel.prototype.initSubscriber = function (stream, isAudioOnly) {
        var elInfo = null;
        var _this = this;
        var props = {
            showControls: true,
            subscribeToVideo: true,
            subscribeToAudio: true,
            width: '120px',
            height: '120px',
            insertMode: 'append'
        };
        if (isAudioOnly) {
            props.subscribeToVideo = false;
        }
        var subs = this.session.subscribe(stream, 'pluginPlaceholder', props, function (error) {
            if (error) {

            } else {
                _this.subscribers.push(subs);
                if (!stream.hasVideo) {
                    _this.onSubscribVideoDisabled(stream);
                }
                if (!stream.hasAudio) {
                    _this.showSubscribAudioDisabled(stream, false);
                }
                $(".OT_root").removeClass("OT_Full");
                var subsId = subs.id;
                elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                elInfo.find(".OT_widget-container").attr("id", stream.id);
                _this.set("clientconnected", true);
                _this._initSubscriberEvent(subs);
                if (subs.subscriber) {
                    subs.subscriber.setStyle('videoDisabledDisplayMode', 'on');
                    //  initAnnotationSubscriber(subs.subscriber);
                }
            }
        });





    };

    openConsultationTokboxViewModel.prototype.onStreamCreated = function (event) {
        this.set("isStarted", true);
        if (event.stream) {
            if (this.isReenterStarted) {
                var streamId = event.stream.id;
                var alreadySubs = OT.subscribers.where(function (subscriber) {
                    return subscriber.streamId === streamId;
                });
                if (alreadySubs.length > 0) {
                    return;
                }
            }
            if (!event.stream.hasVideo) {
                this.snapNotification.info("Video stream is not available");
            }

            if (!event.stream.hasAudio && event.stream.videoType !== "screen") {
                this.snapNotification.info("Audio stream is not available");
            }

        }
        this.initSubscriber(event.stream);
        this.layoutManager.refreshLayout();
        this.set("videoDisconnected", false);
    };

    openConsultationTokboxViewModel.prototype.restartConnection = function () {
        window.console.log("retry");
        if (this.session && this.session.isConnected()) {
            //if already connected do nothing
            if (this.connectionFailedCheckerInterval) {
                clearInterval(this.connectionFailedCheckerInterval);
                this.connectionFailedCheckerInterval = null;
                this.isReenterStarted = false;
            }

            return;
        }

        var _this = this;
        if (this.publisher) {
            this.publisher.destroy();
            this.publisher = null;
        }
        this.initPublisher().then(function () {
            _this.initSession().then(function () {
                _this.connectPublisher();
            });
        });


    };
    openConsultationTokboxViewModel.prototype.detectAndReconnct = function () {

        var _this = this;
        if (!(this.session && this.session.isConnected())) {
            if (this.connectionFailedCheckerInterval) {
                clearInterval(this.connectionFailedCheckerInterval);
                this.connectionFailedCheckerInterval = null;
            }
            this.connectionFailedCheckerInterval = setInterval(function () {
                _this.restartConnection();
            }, 10 * 1000);
        }
    };
    openConsultationTokboxViewModel.prototype.onSessionDisconnected = function (event) {
        if (event && event.reason == "networkDisconnected") {
            this.isReenterStarted = true;
            this.detectAndReconnct();
        }
    };
    openConsultationTokboxViewModel.prototype.onStreamPropertyChanged = function (event) {
        if (event.changedProperty == "hasAudio") {
            this.showSubscribAudioDisabled(event.stream, event.newValue);
        }
    };
    openConsultationTokboxViewModel.prototype._convertToDatePart = function (ms) {
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

    openConsultationTokboxViewModel.prototype._initSessionEvents = function () {
        var _this = this;
        this.session.on({
            sessionReconnecting: function (event) {
                window.console.log("Disconnected from the session. Attempting to reconnect...");
                _this.onSessionReconnecting(event);
            },
            sessionReconnected: function (event) {
                window.console.log('Reconnected to the session.');
                _this.onSessionReconnected(event);
            },
            sessionDisconnected: function (event) {
                window.console.log('Disconnected from the session.');
                _this.onSessionDisconnected(event);
            },
            streamCreated: function (event) {
                setTimeout(function () {
                    _this.onStreamCreated(event);
                }, 300);
            },
            streamDestroyed: function () {
                _this.layoutManager.refreshLayout();
            },
            streamPropertyChanged: function (event) {
                _this.onStreamPropertyChanged(event);
            },
            connectionCreated: function (stream) {
                if (stream.connectionId === _this.session.connection.connectionId) {
                    return;
                }
                _this.set("isPhysicianReady", _this.screenType == 1 && _this.hasVideoInititlized);
                _this.set("videoDisconnected", false);
                _this.eventaggregator.publish("clientconnected", true);
            }
        });

        //tokbox signal
        this.session.on("signal:openconsultationtime", function (_data) {
            if (snap.publicPage) {
                var time = _data.data;
                if (time) {
                    time = +time;
                }
                var startDate = new Date(time);
                var diffDate = _this._convertToDatePart(new Date() - startDate);

                var hour = diffDate.h;
                var min = diffDate.m;
                var sec = diffDate.s;
                if (sec >= 0) {

                    _this.startTimer(hour, min, sec);
                }
            }
        });

        if (window.addEventListener) {
            window.addEventListener('online', function () {
                _this.set("isConnectionReconnecting", false);
            }, false);
        }
    };
    openConsultationTokboxViewModel.prototype.redirectFromConsultation = function() {
        var _this = this;
        window.setTimeout(function () {
            window.location.href = _this.screenType === 1 ? "/Physician/Main/#/patientQueue" : "/Public/#/joindisconnect";
        }, 1000);
    };
    openConsultationTokboxViewModel.prototype.initSession = function () {
        var $def = $.Deferred();
        var _this = this;
        this.session = OT.initSession(this.sessionInformation.apiKey, this.sessionInformation.sessionKey);
        this._initSessionEvents();
        this.session.connect(this.sessionInformation.tokenKey, function (error, sessionConnectEvent) {
            if (error) {
                _this.sessionError = error;
                $def.reject();
            } else {
                _this.sessionConnectEvent = sessionConnectEvent;
                $def.resolve();
            }
        });
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.getName = function () {
        var profileInfo;
        if (this.screenType == 1) {
            profileInfo = sessionStorage.getItem("snap_staffprofile_session");
            if (profileInfo) {
                profileInfo = JSON.parse(profileInfo);
                if (profileInfo) {
                    return profileInfo.fullName;
                }
            }
            return "";
        }
        else if (this.screenType == 2) {
            profileInfo = sessionStorage.getItem("snap_patientprofile_session");
            if (profileInfo) {
                profileInfo = JSON.parse(profileInfo);
                if (profileInfo) {
                    return profileInfo.fullName;
                }
            }
            return "";
        } else {
            profileInfo = sessionStorage.getItem("participantName");
            if (profileInfo) {
                return profileInfo;

            }
        }
    };

    openConsultationTokboxViewModel.prototype.getProfilePic = function () {
        var profilePic;
        if (snap.profileSession) {
            profilePic = snap.profileSession.profileImage;
            return profilePic ? profilePic : "/images/default-user.jpg";
        } else {
            profilePic = "/images/default-user.jpg";
            return profilePic;
        }
    };

    openConsultationTokboxViewModel.prototype._initPublisherEvent = function () {
        var _this = this;
        this.publisher.on({
            destroyed: function () {
                window.console.log("destroyed");
                _this.layoutManager.refreshLayout();
            },
            accessDenied: function () {
                $("#resultInfo").addClass("red").find(".details")
                      .html("Permission is denied to access the camera. Please change permission setting for camera access").end()
                      .find(".progress").html("100%");
                if (_this.publisher && _this.publisher.id) {
                    var elId = this.publisher.id;
                    $("#" + elId).remove();
                }
                _this.layoutManager.refreshLayout();
            },
            accessDialogOpened: function () {
                // Show allow camera message
                _this.snapNotification.info("Please allow the camera access");
            },
            accessDialogClosed: function () {

            },
            accessAllowed: function () {
                $(".networktest").hide();
            },
            streamDestroyed: function () {
                if (_this.isPatientInMobileDevice) {
                    setTimeout(function () {
                        if ($tokboxPublisher && $tokboxPublisher.publisher) {
                            $tokboxPublisher.publisher.publishVideo(true);
                        }
                    }, 2000);
                }
                return;
            }
        });
    };

    openConsultationTokboxViewModel.prototype.connectPublisher = function () {
        var _this = this;
        var $def = $.Deferred();
        if (this.session && (this.session.connected ||
                   (this.session.isConnected && this.session.isConnected()))) {
            this.session.publish(_this.publisher, function (err) {
                if (err) {
                    if (err.code === 1553 || (err.code === 1500 && err.message.indexOf("Publisher PeerConnection Error:") >= 0)) {
                        _this.snapNotification.error("Streaming connection failed. This could be due to a restrictive firewall.");
                    } else {
                        _this.snapNotification.error("An unknown error occurred while trying to publish your video. Please try again later.");
                    }
                    $def.reject();
                    _this.publishError = err;
                } else {
                    $def.resolve();
                }
            });
            this.layoutManager.refreshLayout();
        }

        return $def.promise();


    };

    openConsultationTokboxViewModel.prototype.initPublisher = function (prop) {
        prop = prop || {};
        var $def = $.Deferred();
        var _this = this;
        var name = "<span>" + this.getName() + "<span class='userimage' style='display:none;'>" + this.getProfilePic() + "</span></span>";

        var defaultProp = $.extend(prop, {
            name: name,
            testNetwork: true,
            showControls: true,
            insertMode: 'append',
            mirror: false,
            width: '120px',
            height: '120px'
        });

        this.publisher = OT.initPublisher('pluginPlaceholder', defaultProp, function (err) {
            if (err) {
                if (err.code === 1500 && err.message.indexOf('Publisher Access Denied:') >= 0) {
                    _this.snapNotification.error('Please allow access to the Camera and Microphone and try publishing again.');
                } else {
                    _this.snapNotification.error('Failed to get access to your camera or microphone. Please check that your webcam' + ' is connected and not being used by another application and try again.');
                }
                _this.publisher.destroy();
                _this.publisher = null;
                $def.reject();
            } else {
                $def.resolve();
            }
        });
        this._initPublisherEvent();
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.startTimerUI = function () {
        var meetingStartTime = this.sessionInformation.callStartTime;
        if (meetingStartTime) {
            meetingStartTime = new Date(meetingStartTime);
            var diffDate = this._convertToDatePart(new Date() - meetingStartTime);
            var hour = diffDate.h;
            var min = diffDate.m;
            var sec = diffDate.s;
            var hour = diffDate.h;
            var min = diffDate.m;
            var sec = diffDate.s;
            if (sec >= 0) {
                this.startTimer(hour, min, sec);
            }
        }
        // _this.startTimer();
    };
    openConsultationTokboxViewModel.prototype.startTokboxConection = function () {
        var _this = this;
        this.initPublisher().then(function () {
            _this.initSession().then(function () {
                _this.connectPublisher();
                var subsId = _this.publisher.id;
                var elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                _this.set("hasVideoInititlized", true);
                _this.startTimerUI();
                _this.eventaggregator.published("videoInitialized");
            });
        });
    };
    openConsultationTokboxViewModel.prototype.startSession = function (e) {
        var _this = this;
        e.preventDefault();
        if (this.isStarted && $.connection.hub.state !== $.signalR.connectionState.connected) {
            _this.snapNotification.info("Please wait... Consultation is not ready.");
            return;
        }
        var url = sessionStorage.getItem("homePageUrl");
        if (snap.profileSession.userId === this.sessionInformation.createdByUserId) {
            this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?", function () {
                _this.meetingHub.endOpenConsultation(_this.meetingInformation.meetingId).then(function () {
                    sessionStorage.removeItem("meetingdata");
                    sessionStorage.removeItem("participantId");
                    sessionStorage.removeItem("personId");
                    sessionStorage.removeItem("meetingStartDate");
                    _this.mainHub.stop();
                    setTimeout(function () {
                        location.replace(url);
                    }, 1000);

                });
            });
        } else {
            this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to disconnect from this consultation?", function () {
                var currentMeetingId = _this.sessionInformation.meetingId;
                var currentParticipantId = sessionStorage.getItem("participantId");
                _this.meetingHub.leaveOpenConsultation(currentMeetingId, currentParticipantId).then(function () {
                    sessionStorage.removeItem("meetingdata");
                    sessionStorage.removeItem("participantId");
                    sessionStorage.removeItem("personId");
                    sessionStorage.removeItem("meetingStartDate");
                    setTimeout(function () {
                        location.replace(url);
                    }, 1000);
                });
            });
        }
    };
    //#endregion

    //#region tokbox related screenshare function
    openConsultationTokboxViewModel.prototype.extensionAvailable = function () {
        var _this = this;
        var deferred = $.Deferred();
        if (isDev) {
            OT.registerScreenSharingExtension('chrome', this.sessionInformation.screensharing.extensionID, 2);
        } else {
            OT.registerScreenSharingExtension('chrome', this.sessionInformation.screensharing.extensionID);
        }
        OT.checkScreenSharingCapability(function (response) {
            if (!response.supported || !response.extensionRegistered) {
                if (OT.$.browser() === 'Firefox' && response.extensionInstalled) {
                    deferred.resolve();
                } else if (OT.$.browser() === 'Firefox' && !response.extensionInstalled) {
                    deferred.resolve(); //it could actually be in the ff browser but we can't see extensionInstalled
                    var errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function() {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            _this.installScreenshareExtension();
                        }
                    });
                    deferred.reject('screensharing extension not installed');
                } else {
                    deferred.reject('This browser does not support screen sharing! Please use Chrome, Firefox or IE!');
                }
            } else if (!response.extensionInstalled) {
                var errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                _this.snapNotification.confirmationWithCallbacks(errorMessage, function() {
                    if (OT.$.browser() === 'Firefox') {
                        window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                    }
                    else {
                        _this.installScreenshareExtension();
                    }
                });
                deferred.reject('screensharing extension not installed');
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise();

    };
    openConsultationTokboxViewModel.prototype._initScreenSharePublisher = function () {
        var _this = this;
        var createPublisher = function () {
            var innerDeferred = $.Deferred();
            var properties = {

            };
            $.extend(properties, {
                name: "Screen Share By : " + _this.getName(),
                showControls: true,
                width: '120px',
                height: '120px',
                style: {
                    buttonDisplayMode: 'off',
                },
                videoSource: 'window',
                insertMode: 'append'
            });
            _this.screenPublisher = OT.initPublisher('pluginPlaceholder', properties, function (error) {
                if (error) {
                    innerDeferred.reject('Error starting the screen sharing');
                } else {
                    innerDeferred.resolve();
                }
            });
            _this.screenPublisher.on("accessDenied", function (flag) {
                if (flag && flag.target) {
                    $("#" + flag.target.id).remove();
                    _this.screenPublisher = null;
                }

            });
            return innerDeferred.promise();
        };
        var outerDeferred = $.Deferred();
        createPublisher().then(function () {
            outerDeferred.resolve();
        });
        return outerDeferred.promise();

    };
    openConsultationTokboxViewModel.prototype.installScreenshareExtension = function () {
        var _this = this;
        window.chrome.webstore.install('https://chrome.google.com/webstore/detail/' + this.sessionInformation.screensharing.extensionID,
          function () {
              _this.snapNotification.success('successfully installed');
          }, function () {
              window.open('https://chrome.google.com/webstore/detail/' + _this.sessionInformation.screensharing.extensionID);
          });
    };
    openConsultationTokboxViewModel.prototype._publishScreenShare = function () {
        var _this = this;
        this.session.publish(this.screenPublisher, function (error) {
            if (error) {
                var errorMessage = "";
                if (error.code === 1500 && navigator.userAgent.indexOf('Firefox') !== -1) {
                    errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function() {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            _this.installScreenshareExtension();
                        }
                    });
                } else {
                    if (error.code === 1010) {
                        errorMessage = 'Check your network connection';
                    } else {
                        errorMessage = 'Error sharing the screen';
                    }
                    _this.snapNotification.error(errorMessage);
                }

            }
        });

    };
    openConsultationTokboxViewModel.prototype.startScreenSharing = function () {
        var _this = this;
        this.extensionAvailable()
         .then(function () {
             _this._initScreenSharePublisher().then(function () {
                 _this._publishScreenShare();
                 _this.layoutManager.refreshLayout();
             }).fail(function () {
                 _this.snapNotification.error('Error starting screensharing');
             });
         });
    };
    openConsultationTokboxViewModel.prototype.endScreenSharing = function () {
        this.session.unpublish(this.screenPublisher);
        this.screenPublisher = null;
        this.layoutManager.refreshLayout();
    };
    openConsultationTokboxViewModel.prototype.toggleScreen = function () {
        if (this.screenPublisher) {
            this.endScreenSharing();
        } else {
            this.startScreenSharing();
        }

    };
    //#endregion


    //#region ViewModel function
    openConsultationTokboxViewModel.prototype.clearSessionData = function () {
        sessionStorage.removeItem("meetingdata");
        sessionStorage.removeItem("participantId");
        sessionStorage.removeItem("personId");

    };
    openConsultationTokboxViewModel.prototype.disconnect = function () {
        var _this = this;
        this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to end this consultation?", function() {
            if (_this.session) {
                _this.session.disconnect();
            }
        });
    };
    openConsultationTokboxViewModel.prototype.showSettingTab = function () {
        if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
            return true;
        }
        return false;
    };
    openConsultationTokboxViewModel.prototype.showSelfView = function () {
        if (this.clientconnected) {
            if (this.publisher && this.publisher.id) {
                var id = "#" + this.publisher.id;
                $(id).toggle();
                this.set("isSelfView", !this.isSelfView);
            }
            this.trigger("change", { field: "isSelfView" });
        }
    };
    //mute video
    openConsultationTokboxViewModel.prototype.muteVideo = function () {
        var _this = this;
        if (!this.publisher) {
            this.initPublisher().then(function () {
                _this.connectPublisher();

            });
            return;
        }
        this.isVideoMute = !this.isVideoMute;
        this.isVideoBtn = !this.isVideoBtn;
        if (this.isVideoMute) {
            this.publisher.publishVideo(false);
            var streamDivId = "#" + this.publisher.id;
            this.displayUserImage(streamDivId, 1);
        } else {
            this.publisher.publishVideo(true);
            this.layoutManager.refreshLayout();
            this.hasVideoInititlized = true;
        }
        this.trigger("change", { field: "isVideoMute" });
        this.trigger("change", { field: "isVideoUnMute" });
        this.trigger("change", { field: "isVideoBtn" });
        this.trigger("change", { field: "hasVideoInititlized" });

    };

    var loadMediaInfoBoxTemplate = function (viewModel) {
        var templatePath = "/content/templates/consultationMediaInfoBox.html";
        var infoBoxId = "#mediaInfoBox";
        var $contentLoader = snap.common.contentLoader();

        $contentLoader.bindViewModel(viewModel, infoBoxId, templatePath)
            .then(function () {
                viewModel.set("isShown", !viewModel.isShown);
            });
    };

    openConsultationTokboxViewModel.prototype.showMediaInfo = function () {
        if (!this.isMeidiaInfoShown) {

            if (!this.isMeidiaInfoInitialized) {
                // load and bind template
                if (this.mediaInfoVM === null) {

                    //hate to do that direct element calls!
                    var fullScrVideoId = $('.OT_Full').attr('id');

                    this.mediaInfoVM = snap.shared.ConsultationMediaInfo();
                    this.mediaInfoVM.init({
                        subscribers: this.subscribers,
                        currentId: fullScrVideoId
                    });
                }
                loadMediaInfoBoxTemplate(this.mediaInfoVM);
                this.isMeidiaInfoInitialized = true;

            } else {
                this.mediaInfoVM.set("isShown", !this.mediaInfoVM.isShown);
            }

        } else {
            //just turn it off and delete timer (it will be inside vm)
            this.mediaInfoVM.turnOffTimer();
            this.mediaInfoVM.set("isShown", !this.mediaInfoVM.isShown);
        }

        this.set("isMeidiaInfoShown", !this.isMeidiaInfoShown);
    };

    openConsultationTokboxViewModel.prototype.muteMicrophone = function () {
        if (this.isMuteMicrophone) {
            this.publisher.publishAudio(true);
        } else {
            this.publisher.publishAudio(false);
        }
        this.set("isMuteMicrophone", !this.isMuteMicrophone);
        this.set("isMicrophoneBtn", !this.isMicrophoneBtn);

    };

    openConsultationTokboxViewModel.prototype.muteVoice = function () {
        var _this = this;
        if (this.clientconnected) {
            this.set("isMute", !this.isMute);
            this.set("isMuteBtn", !this.isMuteBtn);
            $.each(this.subscribers, function () {
                if (_this.isMute) {
                    this.subscribeToAudio(false);
                } else {
                    this.subscribeToAudio(true);
                }
            });

        }
    };
    openConsultationTokboxViewModel.prototype.selectVideoTab = function (e) {
        var _this = this;
        var el = $(e.currentTarget),
        id = el.attr("data-id");
        if (id == "activeSetting") {
            if (!window.isChrome) {
                if (!(this.isMuteMicrophone || this.isVideoMute)) {
                    if (this.publisher) {
                        this.session.unpublish(this.publisher);
                    }
                    setTimeout(function () {
                        _this.initPublisher().then(function () {
                            _this.connectPublisher();
                        });
                    }, 100);
                }
                return;
            }
        }
        if (id === "activeParticipants") {
            this.set("activeParticipants", !this.activeParticipants);
            this.set("activeSetting", false);
        }
        if (id == "activeSetting") {
            this.set("activeSetting", !this.activeSetting);
            this.set("activeParticipants", false);
        }
        if (id == "activeShare") {
            this.set("activeShare", !this.activeShare);
        }
    };
    openConsultationTokboxViewModel.prototype.onFullScreen = function () {
        var element = document.getElementById("pluginPlaceholder");
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    openConsultationTokboxViewModel.prototype.onAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    openConsultationTokboxViewModel.prototype.onVideoComboOpen = function () {
        this.videoSourceList.read();
    };
    openConsultationTokboxViewModel.prototype.onVideoChange = function () {
        var _this = this;
        if (this.selectedVideoSource !== null) {
            if (this.publisher) {
                this.publisher.destroy();
                this.publisher = null;
            }
            var publishAudio = true;
            if (this.isMuteMicrophone) {
                publishAudio = false;
            }
            _this.initPublisher({
                videoSource: _this.selectedVideoSource['value'],
                publishAudio: publishAudio
            }).then(function () {
                _this.connectPublisher();
            });


        }
    };
    openConsultationTokboxViewModel.prototype.onAudioChange = function () {
        if (this.selectedAudioSource !== null) {
            if (this.publisher) {
                this.publisher.destroy();
            }
            var publishVideo = true;
            if (this.isVideoMute) {
                publishVideo = false;
            }
            this.initPublisher({
                audioSource: this.selectedAudioSource['value'],
                publishVideo: publishVideo
            }).then(function () {
                this.connectPublisher().then(function () {
                    if (this.isVideoMute) {
                        var streamDivId = "#" + this.publisher.id;
                        this.displayUserImage(streamDivId, 1);
                    }
                }.bind(this));
            }.bind(this));
        }
    };

    //#endregion


    /* Kubi Integration */

    openConsultationTokboxViewModel.prototype.initKubi = function () {
        var $def = $.Deferred();
        /* Temp disable  Kubi
        if (snap.cachedGetScript) {
            snap.cachedGetScript("/Scripts/v2/viewmodel/kubi.control.js").done(function () {
                $kubiControl = new snap.kubi.kubiControl();
                $def.resolve();
            }).fail(function () {
                $def.reject();
            });
        } else {
            $def.reject();
        }
        */
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.showKubiPad = function () {
        //$kubiControl.showKubiWindow();
    };

    //#region Mobile view
    openConsultationTokboxViewModel.prototype.toggleMobileInfoPanel = function (e) {
        e.preventDefault();

        this.set('mobileInfoPanel', !this.mobileInfoPanel);
        this.set('infoPanel', !this.infoPanel);

        if (this.isShowMobileVideoControl || this.activeParticipants || this.activeShare) {
            this.set('isShowMobileVideoControl', false);
            this.set('activeParticipants', false);
            this.set('activeShare', false);

        }
    };
    openConsultationTokboxViewModel.prototype.showMobileControl = function () {
        this.set("isShowMobileVideoControl", !this.isShowMobileVideoControl);

        if (this.providerDetailsInformation && this.activeParticipants || this.activeParticipants) {
            this.set("providerDetails", false);
            this.set("activeParticipants", false);
        }
        if (this.activeSetting) {
            this.set("activeSetting", false);
        }
        if ($('#patientContainer').hasClass('is-active')) {
            $('#patientContainer').removeClass('is-active');
            this.set('infoPanel', false);
        }
    };
    //#endregion

    snap.namespace("snap.shared").use(["snapNotification", "snapHttp", "snapLoader",
        "eventaggregator", "snap.tokbox.TokboxTest", "snap.UI.LayoutManager", "deviceapi", "snap.hub.ConsultationHub", "snap.hub.mainHub", "snap.hub.MeetingHub"])
        .extend(kendo.observable)
        .define("OpenConsultationTokboxViewModel", openConsultationTokboxViewModel).singleton(); //make it singleton because we only need 1 instance no matter to share the same sesssion
}(jQuery, snap, kendo, OT));

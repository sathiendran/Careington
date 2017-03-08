/// <reference path="/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />


; (function ($) {

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

    var screenType = {
        provider: 1,
        patient: 2,
        guest: 3
    };

    var tokboxViewModel = function ($snapNotification, $snapHttp, $snapLoader, $eventaggregator, $tokboxTest,
        $layoutManager, $deviceapi, $consultationHub) {

        
        var _this=this;
        this.snapNotification = $snapNotification;
        this.snapHttp = $snapHttp;
        this.snapLoader = $snapLoader;
        this.eventaggregator = $eventaggregator;
        this.layoutManager = $layoutManager;
        this.consultationHub = $consultationHub;
        this.tokboxTest = $tokboxTest;
        this.deviceapi = $deviceapi;
        this.connectionFailedCheckerInterval = null;

        //Default Value
        this.isStarted = false;
        // #8875
        //this.consultButtonTitle = "Start Consult";
        this.screenType = screenType.provider;
        this.consultButtonTitle = "";
        this.providerDetails = false;
        this.infoPanel = false;
        this.isShowMobileVideoControl = false;
        this.retryDelay = 3 * 1000;
        this.retryCount = 0;
       

        //Participants Data
        this.participants = [];
        this.hasParticipants = function () {
           return this.participants.length > 0;
        };
        this.isMultiParticipantFeatureEnable = false;

        //Sesssion Data
       
        this.sessionInformation = null;
        this.session = null;
        this.sessionConnectEvent = null;
        this.sessionError = null;

        this.publisher = null;
        this.publishError = null;
        
        this.screenPublisher = null;
        this.videoSupport = true;
        this.audioSupport = true;

        //#region viewModel Property
        this.isConnectionReconnecting = false;
        this.consultationInfo = null;
        this.isPatientInMobileDevice = false;
        this.clientconnected = false;
        this.isSelfView = false;
        this.isVideoBtn = false;
        this.isVideoMute = false;
        this.hasVideoInititlized = false;
        this.isMuteMicrophone = false;
        this.isMicrophoneBtn = false;
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
        this.isShareScreen = false;
        this.activeSetting = false;
        this.activeShare = false;
        this.activeParticipants = false;
        this.activeImages = false;
        this.openSnapImageHolder = false;

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

        //#region Screensots
        this.snapImageCollection = new kendo.data.ObservableArray([]);
        this.imagePopup = $("#image-window");
        this.imagePopup.kendoWindow({
            modal: true, 
            visible: false
        });
        this.template = kendo.template($("#image-window-template").html());
        this.toolbar;
        this.palette = [
            "#1abc9c",
            "#2ecc71",
            "#3498db",
            "#9b59b6",
            "#34495e",
            "#16a085",
            "#27ae60",
            "#2980b9",
            "#8e44ad",
            "#2c3e50",
            "#f1c40f",
            "#e67e22",
            "#e74c3c",
            "#ecf0f1",
            "#95a5a6",
            "#f39c12",
            "#d35400",
            "#c0392b",
            "#bdc3c7",
            "#7f8c8d"
        ];
        this.scrollerMove = 0;
        //#endregion

    };
    tokboxViewModel.prototype.onSessionStarted = function () {
        this.set("isStarted", true);
        this.set("consultButtonTitle", "End Consult");
        this.set("isVideoBtn", true);
        this.set("isMicrophoneBtn", true);
        this.set("isMuteBtn", true);
    };

    //#region Participants

    tokboxViewModel.prototype._initParticipantEvent = function () {
        var _this=this;
        $(".participant__close").off("click").on("click", function () {
            var id = $(this).data("id");
            var that = this;
            if (id) {
                _this.snapNotification.confirmationWithCallbacks("Are you sure you want to disconnect the selected guest?", function () {
                    _this.session.signal({
                        data: id,
                        type: "guest"
                    }, function () {
                        $(that).parent().remove();
                        setTimeout(function () {
                            _this.layoutManager.refreshLayout();
                        }, 1000);
                    });
                });
            }
        });
    };
    tokboxViewModel.prototype.setParticipants = function (participants) {
        if (participants && $.isArray(participants)) {
            this.participants = participants;
            this.trigger("change", { field: "isCustomerOrPhysician" });
            this.trigger("change", { field: "participants" });
            this.trigger("change", { field: "hasParticipants" });
            this._initParticipantEvent();

        }
    };
    tokboxViewModel.prototype.addParticipants = function () {
        var path = '/api/v2/patients/consultations/' + this.consultationInfo.consultationId + '/participants';
        return this.snapHttp.ajax({
            url: path,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                participantType: 2,
                firstName: "",
                lastName: ""
            })
        });
    }
    tokboxViewModel.prototype.sendInvitationEmail = function () {
        var path = '/api/v2/mail/participants/' + this.participantId;
        return this.snapHttp.ajax({
            url: path,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                email: this.invitationEmail,
                name: this.getName()
            })
        });
    };
    tokboxViewModel.prototype.sendInvitation = function (e) {
        var _this = this;
        var button = $(e.currentTarget);
        e.preventDefault();

        if (snap.consultationSession.physicianCompleteSoapNotes) {
            this.snapNotification.error("You can't invite guests to the dropped consultation.");
            button.removeClass('button__green is-loading').addClass('button__red error');
            return;
        }
        if (this.invitationEmail === "") {
            this.snapNotification.info("Please enter email.");
            return;
        }
        if (snap.regExMail.test(this.invitationEmail)) {
            if (this.isStarted) {
                if (button.hasClass('error')) {
                    button.removeClass('button__red error').addClass('button__green is-loading');
                } else {
                    button.addClass('is-loading');
                }

                e.preventDefault();
                this.addParticipants().then(function (response) {
                    var data = response.data[0];
                    _this.participantId = data.participantId;
                    sessionStorage.setItem("participantId", data.participantId);
                    sessionStorage.setItem("personId", data.personId);
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
    tokboxViewModel.prototype.setPatientData = function (data) {
        this.set("patientInformation", data);
        this.set("isPatientInfoInVisible", false);

        if (this.screenType == screenType.provider) {
            this.initPatientEvent();
        }
    };
    tokboxViewModel.prototype.hidePatient = function() {
        this.set("isPatientInfoInVisible", true);
    };
    tokboxViewModel.prototype.initPatientEvent = function() {
        var _this=this;
        $(".patient__close").off("click").on("click", function () {
            var that = this;
            if (! _this.screenType == screenType.provider) {
                return;
            }
            _this.snapNotification.confirmationWithCallbacks("Are you sure you want to disconnect the patient?", function () {
                _this.consultationHub.disconnectPatient();
            });
        });
    };
    tokboxViewModel.prototype.setPatientConnectedDevice = function (flag) {
        this.isPatientInMobileDevice = flag;
    };
    tokboxViewModel.prototype.setProviderData = function (data) {
        var parseStatesLicensed = function (statesJson) {
            try {
                var statesObj = JSON.parse(statesJson);
                return statesObj.map(function (item) {
                    return {
                        countryCode: item.countryCode,
                        states: !!item.regions ? item.regions.map(function (region) { return region.regionCode }).join(", ") : ""
                    }
                });
            } catch (e) {
                return [];
            }
        }
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
            data.practiceFor = data.yearsOfExperience ? ((new Date()).getFullYear() - data.yearsOfExperience) + " years" : "";
            if (data.dob) {
                var ageStr = snap.getAgeString(data.dob);
                data.age = ageStr;
            } else {
                data.age = "";
            }
        }
        data.statesLicenced = parseStatesLicensed(data.statesLicenced);
        this.set("physicianInformation", data);
    };
    tokboxViewModel.prototype.physicianInformation = {
        profileImage: getDefaultProfileImageForClinician()
    };
    tokboxViewModel.prototype.patientInformation = {
        profileImagePath: getDefaultProfileImageForPatient()
    };
    tokboxViewModel.prototype.startTimer = function (hrs, min, sec) {
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

            if (hrs == 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);


    };
    tokboxViewModel.prototype.setAppointmentData = function (data) {
        data = data[0];
        this.consultationInfo = data.consultationInfo;
        this.setPatientData(data.patientInformation);
    };
    tokboxViewModel.prototype.setBetaParameter = function (isEnable) {
        this.set("isBeta", isEnable);
        isVideoBeta = isEnable && this.screenType == screenType.provider;
        this.set("isMultiParticipantFeatureEnable", true);

    };
    tokboxViewModel.prototype.showProviderDetails = function () {
        this.set("providerDetails", true);
    };
    tokboxViewModel.prototype.hideProviderDetails = function () {
        this.set("providerDetails", false);
    };

    //#endregion


    //#region tokbox related mvvm function
    tokboxViewModel.prototype.setSessionInformation = function (data) {
        var _this = this;
        $("#snapImageholder").kendoMobileScroller({
            contentHeight: "84px;"
        });
        this.layoutManager.initElement($("#pluginPlaceholder"));
        this.sessionInformation = $.extend(data, {
            screensharing: { 
                extensionID:'padchhoieclaaocgjbfepahaakajgllb',
                annotation: false
            }
        });
        if (isDev) {
            this.sessionInformation.screensharing.extensionID = "jglopgfialkifmfpopohdhacjmpmadjb";
        }
        this.tokboxTest.setSessionId(data.sessionId);
        this.tokboxTest.setToken(data.token);
        this.eventaggregator.publish("onInitHub", {});

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
    tokboxViewModel.prototype.onSessionReconnecting = function () {
        this.set("isConnectionReconnecting", true);
    };
    tokboxViewModel.prototype.onSessionReconnected = function () {
        this.set("isConnectionReconnecting", false);

    };
    tokboxViewModel.prototype.showSubscribAudioDisabled = function(stream, hasAudio){
       var subscribers = this.session.getSubscribersForStream(stream);
       if (subscribers && subscribers.length > 0) {
           var streamId = subscribers[0].id;
           var streamDivId = "#" + streamId;
           var  mainEL = $(streamDivId).find(".OT_mute");

           if(!hasAudio){
                mainEL.addClass("OT_active");
           } else {
                mainEL.removeClass("OT_active");
           }

       } 
    };
    tokboxViewModel.prototype.onSubscribVideoDisabled = function(stream){
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;

            this.displayUserImage(streamDivId, 2)

        }
    };
    tokboxViewModel.prototype.displayUserImage = function(streamDivId, selectedScreenType){
        var mainEL = $(streamDivId);
        var img = mainEL.find("img");
      
        if (img && img.length == 0) {
            img = $("<img />");
            var userimage = selectedScreenType == screenType.patient ? mainEL.find(".userimage").html() : this.getProfilePic();

            var imgContainer = $("<div />");
            imgContainer.addClass("userpic userpic--is-consult-no-video");
            imgContainer.append(img);
            mainEL.find(".OT_video-poster").append(imgContainer);
            img.attr("src", userimage);
        }
    };
    tokboxViewModel.prototype._initSubscriberEvent = function (sub) {
        var _this = this;
        sub.on("videoDisabled", function (event) {
            _this.onSubscribVideoDisabled(event.target.stream);
        });
        sub.on("videoEnabled", function (event) {
            var streamId = event.target.id;
            $('.OT_root').each(function(){
                if($(this).attr('id') == streamId){
                    $(this).find(".OT_video-poster").html("");
                } 
            });
        });
    };
    tokboxViewModel.prototype.initSubscriber = function (stream, isAudioOnly) {
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
                if (!stream.hasAudio){
                    _this.showSubscribAudioDisabled(stream, false);
                }
                $(".OT_root").removeClass("OT_Full");
                var subsId = subs.id;
                elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                _this.layoutManager.refreshLayout(true);
                elInfo.find(".OT_widget-container").attr("id", stream.id);
                _this.set("clientconnected", true);
                _this._initSubscriberEvent(subs);
                if (subs.subscriber) {
                    subs.subscriber.setStyle('videoDisabledDisplayMode', 'on');
                    initAnnotationSubscriber(subs.subscriber);
                }
            }
        });
    };

    /* Annotation  */
    tokboxViewModel.prototype.initAnnotationSubscriber = function (_subscriber) {

        var pubEli = $("#pluginPlaceholder").find(".OT_subscriber")[0];
        var canvas = new OTSolution.Annotations({
            feed: _subscriber,
            container: pubEli
        });
        this.toolbar.addCanvas(canvas);

    };

    tokboxViewModel.prototype.initAnnotationPublisher = function () {
        var pubEli = $("#pluginPlaceholder").find(".OT_publisher")[0];
        var _this = this;
        var canvas = new OTSolution.Annotations({
            feed: this.publisher,
            container: pubEli
        });
        this.toolbar.addCanvas(canvas);

        setTimeout(function () {
            var width = _this.publisher.videoWidth();
            var height = _this.publisher.videoHeight();

            $("#opentok_canvas").width(width);
            $("#opentok_canvas").height(height);
            $("#opentok_canvas").attr("width", width + "px");
            $("#opentok_canvas").attr("height", height + "px");

        }, 5000);
        canvas.onScreenCapture(function(img) {
            _this.onScreenCapture(img);
        });  
    };

    tokboxViewModel.prototype.initAnnotation = function () {
        var _this=this;
        this.toolbar = new OTSolution.Annotations.Toolbar({
            session: this.session,
            container: document.getElementById('toolbar'),
            colors: _this.palette,
            items: [
                {
                    id: 'OT_pen',
                    title: 'Pen',
                    icon: '/image/freehand.png',
                    selectedIcon: '/images/freehand_selected.png'
                },
                {
                    id: 'OT_line',
                    title: 'Line',
                    icon: '/image/line.png',
                    selectedIcon: '/images/line_selected.png'
                },
                {
                    id: 'OT_shapes',
                    title: 'Shapes',
                    icon: '/image/shapes.png',
                    items: [
                        {
                            id: 'OT_arrow',
                            title: 'Arrow',
                            icon: '/images/arrow.png'
                        },
                        {
                            id: 'OT_rect',
                            title: 'Rectangle',
                            icon: '/images/rectangle.png'
                        },
                        {
                            id: 'OT_oval',
                            title: 'Oval',
                            icon: '/images/oval.png'
                        },
                        {
                            id: 'OT_star',
                            title: 'Star',
                            icon: '/images/star.png',
                            points: [
                                [0.5 + 0.5 * Math.cos(90 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(90 * (Math.PI / 180))],
                                [0.5 + 0.25 * Math.cos(126 * (Math.PI / 180)), 0.5 + 0.25 * Math.sin(126 * (Math.PI / 180))],
                                [0.5 + 0.5 * Math.cos(162 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(162 * (Math.PI / 180))],
                                [0.5 + 0.25 * Math.cos(198 * (Math.PI / 180)), 0.5 + 0.25 * Math.sin(198 * (Math.PI / 180))],
                                [0.5 + 0.5 * Math.cos(234 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(234 * (Math.PI / 180))],
                                [0.5 + 0.25 * Math.cos(270 * (Math.PI / 180)), 0.5 + 0.25 * Math.sin(270 * (Math.PI / 180))],
                                [0.5 + 0.5 * Math.cos(306 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(306 * (Math.PI / 180))],
                                [0.5 + 0.25 * Math.cos(342 * (Math.PI / 180)), 0.5 + 0.25 * Math.sin(342 * (Math.PI / 180))],
                                [0.5 + 0.5 * Math.cos(18 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(18 * (Math.PI / 180))],
                                [0.5 + 0.25 * Math.cos(54 * (Math.PI / 180)), 0.5 + 0.25 * Math.sin(54 * (Math.PI / 180))],
                                [0.5 + 0.5 * Math.cos(90 * (Math.PI / 180)), 0.5 + 0.5 * Math.sin(90 * (Math.PI / 180))]
                            ]
                        }
                    ]
                },
                {
                    id: 'OT_colors',
                    title: 'Colors',
                    icon: '',
                    items: { /* Built dynamically */ }
                },
                {
                    id: 'OT_line_width',
                    title: 'Line Width',
                    icon: '/image/line_width.png',
                    items: { /* Built dynamically */ }
                },
                {
                    id: 'OT_clear',
                    title: 'Clear',
                    icon: '/image/clear.png'
                },
                {
                    id: 'OT_capture',
                    title: 'Capture',
                    icon: '/image/camera.png',
                    selectedIcon: '/image/camera_selected.png'
                }
            ]
        });

    };
    /*end of Annotation */

    tokboxViewModel.prototype.onStreamCreated = function (event) {
        this.set("isStarted", true);
        if (event.stream) {
            var streamId = event.stream.id;
            var alreadySubs = OT.subscribers.where(function (subscriber) {
                return subscriber.streamId === streamId;
            });
            if (alreadySubs.length > 0) {
                return;
            }
           
            if (!event.stream.hasVideo) {
                this.snapNotification.info("Video stream is not available");
            }

            if (!event.stream.hasAudio && event.stream.videoType !== "screen") {
                this.snapNotification.info("Audio stream is not available");
            }

        }
        this.initSubscriber(event.stream);

        this.set("videoDisconnected", false);

    };
    tokboxViewModel.prototype.restartConnection = function () {
        console.log("retry");
        if (this.session && this.session.isConnected()) {
            //if already connected do nothing
            if (this.connectionFailedCheckerInterval) {
                clearInterval(this.connectionFailedCheckerInterval);
                this.connectionFailedCheckerInterval = null;
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
                _this.connectPublisherOrRetry();
            });
        });


    }
    tokboxViewModel.prototype.detectAndReconnct = function () {

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
    }
    tokboxViewModel.prototype.onSessionDisconnected = function (event) {
        if (event.reason == "networkDisconnected") {
            this.detectAndReconnct();
        }
    };
    tokboxViewModel.prototype.onStreamPropertyChanged = function(event){
        if(event.changedProperty == "hasAudio"){
            this.showSubscribAudioDisabled(event.stream, event.newValue);
        }
    };
    tokboxViewModel.prototype._initSessionEvents = function () {
        var _this = this;
        this.session.on({
            sessionReconnecting: function (event) {
                console.log("Disconnected from the session. Attempting to reconnect...");
                _this.onSessionReconnecting(event);
            },
            sessionReconnected: function (event) {
                console.log('Reconnected to the session.');
                _this.onSessionReconnected(event);
            },
            sessionDisconnected: function (event) {
                console.log('Disconnected from the session.');
                _this.onSessionDisconnected(event);
            },
            streamCreated: function (event) {
                setTimeout(function () {
                    _this.onStreamCreated(event);
                }, 300);
            },
            streamDestroyed:function(){
                _this.layoutManager.refreshLayout();
            },
            streamPropertyChanged: function(event){
                _this.onStreamPropertyChanged(event);
            },
            connectionCreated: function (stream) {
                if (stream.connectionId === _this.session.connection.connectionId) {
                    return;
                }
                _this.set("isPhysicianReady", _this.screenType == screenType.provider && _this.hasVideoInititlized);
                _this.set("videoDisconnected", false);
                _this.eventaggregator.publish("clientconnected", true);
            }
        });


        //tokbox signal

        this.session.on("signal:all", function (_data) {
            var msg = _data.data;
            if (msg === "droppedconsultation" && _this.screenType == screenType.guest) {
                _this.snapNotification.info("It seems we’ve been disconnected.");
                setTimeout(function () {
                    location.href = "/Public/#/joindisconnect";
                }, 1000);
            }
        });

        this.session.on("signal:guest", function (_data) {
            if (_this.screenType == screenType.guest) {
                var participantId = _data.data;
                var currentParticipant = sessionStorage.getItem("participantId");
                if (participantId == currentParticipant) {
                    _this.snapNotification.info("You are removed from consultation.");
                    setTimeout(function () {
                        //TODO: Make it as separate service, because no reason to bring all guestjoin.viewmodel.js which makes another UI work also;
                        var url = "/api/v2/patients/consultations/participants/" + participantId + "/invitation";
                        $.ajax({
                            url: url,
                            type: "DELETE",
                            headers: {
                                'Authorization': 'JWT-Participant ' + _this.joinToken,
                                'Content-Type': 'application/json',
                                'X-Api-Key': snap.apiKey,
                                'X-Developer-Id': snap.apiDeveloperId
                            },
                            data: JSON.stringify({
                                participantId: participantId
                            })
                        });

                        location.href = "/Public/#/joindisconnect";
                    }, 1000);
                }
            }
            setTimeout(function () {
                _this.layoutManager.refreshLayout();
            }, 2000);

        });
        this.session.on("signal:patient", function (_data) {
            if (_this.screenType == screenType.provider && _data.data === "disconnect") {
                snap.customerSafeDisconnect = true;
                _this.snapNotification.info("Customer left the room. Now you can disconnect from the Consultation.");
                _this.layoutManager.refreshLayout();
            }
            else if (_this.screenType == screenType.guest && _data.data == "disconnect") {
                snap.customerSafeDisconnect = true;
                _this.snapNotification.info("Customer left the room.");
                _this.layoutManager.refreshLayout();
            }
            _this.hidePatient();
        });
        window.addEventListener('online', function (e) {
            _this.set("isConnectionReconnecting", false);
        }, false);
    };
    tokboxViewModel.prototype.hasAudioDevice = function () {
        var $def = $.Deferred();
        OT.getDevices(function (error, devices) {
            if (error) {
                $def.resolve(false);
            } else {
                var videoInputDevices = devices.filter(function (element) {
                    return element.kind == "videoInput";
                });
                if (videoInputDevices.length > 1) {
                    $def.resolve(true);
                } else {
                    $def.resolve(true);
                }
            }
        });
        return $def.promise();
    }
    tokboxViewModel.prototype.refreshVideoAudioData = function () {
        var $def = $.Deferred();
        OT.getDevices(function (error, devices) {
            devices = devices || [];
            var audio = devices.find(function (item) {
                return item.kind === "audioInput";
            });
            if (!audio) {
                this.audioSupport = false;
            }
            var video = devices.find(function (item) {
                return item.kind === "videoInput";
            });
            if (!video) {
                this.videoSupport = false;
            }
            $def.resolve();
        }.bind(this));
        return $def.promise();
    }
    tokboxViewModel.prototype.initSession = function () {
        var $def = $.Deferred();
        var _this = this;
        
        
        this.session = OT.initSession(this.sessionInformation.apiKey, this.sessionInformation.sessionId);
        this._initSessionEvents();
        this.session.connect(this.sessionInformation.token, function (error, sessionConnectEvent) {
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
    tokboxViewModel.prototype.initConsultationHubEvents = function() {
        var _this = this;
        this.consultationHub.on("onImageReceived", function (imageId) {
            var _url = [snap.baseUrl, "/api/v2/consultations/", _this.consultationInfo.consultationId, "/snapshots/", imageId, "?thumbnail=true"].join("");
            _this.snapHttp.get(_url).then(function (data) {
                data = data.data;
                $.each(data, function (i, e) {
                    _this.addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
                });
            });

        });
        this.consultationHub.on("onImageRemoved", function (imgId) {
            var array = _this.snapImageCollection;
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].imgId === imgId) {
                    array.splice(i, 1);
                }
            }
            _this.refreshScrollView();

        });
    };
    tokboxViewModel.prototype.getName = function () {
        var profileInfo;
        if (this.screenType == screenType.provider) {
            profileInfo = sessionStorage.getItem("snap_staffprofile_session");
            if (profileInfo) {
                profileInfo = JSON.parse(profileInfo);
                if (profileInfo) {
                    return profileInfo.fullName;
                }
            }
            return "";
        }
        else if (this.screenType == screenType.patient) {
            //#9079:
            //profileInfo = sessionStorage.getItem("snap_patientprofile_session");
            profileInfo = sessionStorage.getItem("snap_consultation_session");
            if (profileInfo) {
                profileInfo = JSON.parse(profileInfo);
                if (profileInfo) {
                    return profileInfo.patientName;
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

    tokboxViewModel.prototype.getProfilePic = function () {
        var profilePic;
        if (this.screenType == 2) {
            return this.patientInformation.profileImagePath;
        }
        else if (snap.profileSession) {
            profilePic = snap.profileSession.profileImage;
            return profilePic ? profilePic : "/images/default-user.jpg";
        } else {
            profilePic = "/images/default-user.jpg";
            return profilePic;
        }
    };
    
    tokboxViewModel.prototype._initPublisherEvent = function () {
        var _this = this;
        this.publisher.on({
            destroyed: function () {
                console.log("destroyed");
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
            accessDialogOpened: function (event) {
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
                        _this.publisher.publishVideo(true);
                    }, 2000);
                }
                return;
            }
        });
    }

    tokboxViewModel.prototype.connectPublisher = function () {
        var _this = this;
        var $def = $.Deferred();
        if (this.session && (this.session.connected ||
                   (this.session.isConnected && this.session.isConnected()))) {
            this.session.publish(_this.publisher, function (err) {
                if (err) {
                    console.error(err);
                    if (err.code === 1553 || (err.code === 1500 && err.message.indexOf("Publisher PeerConnection Error:") >= 0)) {
                        _this.snapNotification.error("Re-publishing. Streaming connection failed. This could be due to a restrictive firewall.");
                    } else {
                        _this.snapNotification.error("Re-publishing. An unknown error occurred while trying to publish your video.");
                    }
                    $def.reject();
                    _this.publishError = error;
                } else {
                    $def.resolve();
                }
            });
            this.layoutManager.refreshLayout();
        }

        return $def.promise();
       

    };
    

    tokboxViewModel.prototype.connectPublisherOrRetry = function () {
        var $def = $.Deferred();
        
      
        this.connectPublisher().done(function () {
            $def.resolve();
        }).fail(function () {
            this.retryCount++;
            if (this.retryCount > 5) {
                this.snapNotification.error("Maximum retry limit reached. Please refresh your browser.");
                return;
            }
            setTimeout(function () {
                this.connectPublisherOrRetry();
            }.bind(this), this.retryDelay);
        }.bind(this));
        return $def.promise();
    };

    tokboxViewModel.prototype.initPublisher = function (prop) {
        prop = prop || {};
        var $def = $.Deferred();
        var pubName = this.getName();
        pubName = $("<div>").text(pubName).html();
        var name = "<span>" + pubName + "<span class='userimage' style='display:none;'>" + this.getProfilePic() + "</span></span>";
        var _this = this;
        this.retryCount = 0;
        var defaultProp =$.extend(prop, {
            name: name,
            testNetwork:true,
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
                    _this.snapNotification.error('Failed to get access to your camera or microphone. Please check that your webcam'
                        + ' is connected and not being used by another application and try again.');
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
    tokboxViewModel.prototype.startTokboxConection = function () {
        var _this = this;
        
        this.loadSnapImages();
        this.refreshVideoAudioData().then(function () {
            if (this.audioSupport) {
                if (!this.videoSupport) {
                    this.snapNotification.info('Video device not found. switching to Audio call.');
                }
                this.initPublisher().then(function () {
                    _this.initSession().then(function () {
                        _this.initConsultationHubEvents();
                        _this.initAnnotation();
                        _this.initAnnotationPublisher();
                        _this.connectPublisherOrRetry();
                        var subsId = _this.publisher.id;
                        var elInfo = $("#" + subsId);
                        elInfo.addClass("OT_Full");
                        _this.set("hasVideoInititlized", true);
                    });

                }, function () {
                    _this.snapNotification.info('Unable to start session');
                });
            } else {
                this.snapNotification.info('Audio/Video device not found. Please plug in audio/video hardware and refresh browser.');
            }
        }.bind(this));
    };

    tokboxViewModel.prototype.startSession = function (e) {
        var _this = this;
        e.preventDefault();
        if (this.screenType == screenType.provider) {
            var $clinicianPage = new snap.physician.PhysicianAppointmentViewModel();
            if (this.isStarted) {
                $clinicianPage.endSession();
            } else {
                $clinicianPage.startSession().then(function () {
                    _this.set("isStarted", true);
                    _this.set("consultButtonTitle", "End Consult");
                    snap.clinician.ClinicianHeaderViewModel().set("isStarted", true);
                    _this.set("isVideoBtn", true);
                    _this.set("isMicrophoneBtn", true);
                    _this.set("isMuteBtn", true);
                });
            }
        }
        else if (this.screenType == screenType.patient) {
            snapConfirm("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?");
            $("#btnConfirmYes").click(function () {
                _this.session.signal({
                    data: "disconnect",
                    type: "patient"
                }, function () {
                    sessionStorage.removeItem("snap_consultation_session");
                    _this.eventaggregator.publish("patientDisconnect", {});
                });
            });
            $("#btnConfirmNo").click(function () {
                $(".k-notification-confirmation").parent().remove();
            });

        } else {
            snapConfirm("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?");
            $("#btnConfirmYes").click(function () {
                location.href = "/Public/#/joindisconnect";
            });
            $("#btnConfirmNo").click(function () {
                $(".k-notification-confirmation").parent().remove();
            });

        }

    };
    //#endregion

    //#region tokbox related screenshare function
    tokboxViewModel.prototype.extensionAvailable = function () {
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
                    snapConfirm(errorMessage);
                    $("#btnConfirmYes").click(function () {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            _this.installScreenshareExtension();
                        }
                    });
                    $("#btnConfirmNo").click(function () {
                        $(".k-notification-confirmation").parent().remove();
                    });
                    deferred.reject('screensharing extension not installed');
                } else {
                    deferred.reject('This browser does not support screen sharing! Please use Chrome, Firefox or IE!');
                }
            } else if (!response.extensionInstalled) {
               var errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                snapConfirm(errorMessage);
                $("#btnConfirmYes").click(function () {
                    if (OT.$.browser() === 'Firefox') {
                        window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                    }
                    else {
                        _this.installScreenshareExtension();
                    }
                });
                $("#btnConfirmNo").click(function () {
                    $(".k-notification-confirmation").parent().remove();
                });
                deferred.reject('screensharing extension not installed');
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise();

    };
    tokboxViewModel.prototype._initScreenSharePublisher = function () {
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

            _this.screenPublisher.on("mediaStopped", function () {
                _this.set("isShareScreen", false);
            });
            return innerDeferred.promise();
        };
        var outerDeferred = $.Deferred();
        createPublisher().then(function () {
            outerDeferred.resolve();
        });
        return outerDeferred.promise();

    };
    tokboxViewModel.prototype.installScreenshareExtension = function () {
        var _this =this;
        chrome.webstore.install('https://chrome.google.com/webstore/detail/' + this.sessionInformation.screensharing.extensionID,
          function () {
              _this.snapNotification.success('successfully installed');
          }, function () {
              window.open('https://chrome.google.com/webstore/detail/' + _this.sessionInformation.screensharing.extensionID);
          });
    };
    tokboxViewModel.prototype._publishScreenShare = function () {
        var _this = this;
        this.session.publish(this.screenPublisher, function (error) {
            if (error) {
                var errorMessage = "";
                if (error.code === 1500 && navigator.userAgent.indexOf('Firefox') !== -1) {
                    errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    snapConfirm(errorMessage);
                    $("#btnConfirmYes").click(function () {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            this.installScreenshareExtension();
                        }
                    });
                    $("#btnConfirmNo").click(function () {
                        $(".k-notification-confirmation").parent().remove();
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
    tokboxViewModel.prototype.startScreenSharing = function () {
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
    tokboxViewModel.prototype.endScreenSharing = function () {
        this.session.unpublish(this.screenPublisher);
        this.screenPublisher = null;
        this.layoutManager.refreshLayout();

       
    };
    tokboxViewModel.prototype.toggleScreen = function () {
        if (this.screenPublisher) {
            this.set("isShareScreen", false);
            this.endScreenSharing();
        } else {
            this.startScreenSharing();
            this.set("isShareScreen", true);
        }
      
    };
    //#endregion


    //#region ViewModel function
    tokboxViewModel.prototype.disconnect = function () {
        var _this = this;
        snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
        $("#btnConfirmYes").click(function () {
            if (_this.session) {
                _this.session.disconnect();
            }
        });
        $("#btnConfirmNo").click(function () {
            $(".k-notification-confirmation").parent().remove();
        });

    };

    tokboxViewModel.prototype.showSelfView = function () {
        if (this.clientconnected) {
            if (this.publisher && this.publisher.id) {
                var id = "#" + this.publisher.id;
                $(id).toggle();
                
                this.set("isSelfView", !this.isSelfView);
                this.trigger("change", { field: "isSelfView" });
                if ($(id).hasClass("OT_Full")) {
                    $(".OT_root").not(".OT_Full").first().addClass("OT_Full");
                    $(id).removeClass("OT_Full");
                }
            }
            
        }
    };
    //mute video
    tokboxViewModel.prototype.muteVideo = function () {
        var _this = this;
        if (this.publisher == null || this.publisher == undefined) {
            this.initPublisher().then(function () {
                _this.connectPublisherOrRetry();

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
        this.trigger("change", { field: "isVideoBtn" });
        this.trigger("change", { field: "isVideoMute" });
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

    tokboxViewModel.prototype.showMediaInfo = function () {
        var that = this;

        if (!this.isMeidiaInfoShown) {

            if (!this.isMeidiaInfoInitialized) {
                // load and bind template
                if (this.mediaInfoVM == null) {

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


    tokboxViewModel.prototype.muteMicrophone = function () {
        if (this.isMuteMicrophone) {
            this.publisher.publishAudio(true);
        } else {
            this.publisher.publishAudio(false);
        }
        this.set("isMuteMicrophone", !this.isMuteMicrophone);
        this.set("isMicrophoneBtn", !this.isMicrophoneBtn);


    };

    tokboxViewModel.prototype.muteVoice = function () {
        var _this = this;
        if (this.clientconnected) {
            this.set("isMute", !this.isMute);
            this.set("isMuteBtn", !this.isMuteBtn);
            $.each(_this.subscribers, function () {
                if (_this.isMute) {
                    this.subscribeToAudio(false);
                } else {
                    this.subscribeToAudio(true);
                }
            });

        }
    };
    tokboxViewModel.prototype.selectVideoTab = function (e) {
        var _this = this;
        var el = $(e.currentTarget),
        id = el.attr("data-id");
        if (id == "activeSetting") {
            if (!isChrome) {
                if (! (this.isMuteMicrophone || this.isVideoMute)) {
                if (this.publisher) {
                    this.session.unpublish(this.publisher);
                }
                setTimeout(function () {
                    _this.initPublisher().then(function () {
                        _this.connectPublisherOrRetry();
                    });
                }, 100);
                }
                return;
            }
        };
        if (id == "activeParticipants") {
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
    tokboxViewModel.prototype.onFullScreen = function () {
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

    tokboxViewModel.prototype.onAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    tokboxViewModel.prototype.onVideoComboOpen = function () {
        this.videoSourceList.read();
    };
    tokboxViewModel.prototype.onVideoChange = function (selectedData) {
        var _this = this;
        if (this.selectedVideoSource != null) {
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
                _this.connectPublisherOrRetry();
            });
        }
    };
    tokboxViewModel.prototype.onAudioChange = function () {
        if (this.selectedAudioSource != null) {
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
                this.connectPublisherOrRetry().then(function () {
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
    
    tokboxViewModel.prototype.initKubi = function () {
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
        $def.resolve();
        return $def.promise();
    };
    tokboxViewModel.prototype.showKubiPad = function () {
        //$kubiControl.showKubiWindow();
    };

    //#region Screensots
    tokboxViewModel.prototype.showSnapImageHolder = function () {
        $('.OT_root').each(function () {
            $(this).toggleClass('is-active');
        });
        this.set("activeImages", !this.activeImages);
        this.set("openSnapImageHolder", !this.openSnapImageHolder);
    };

    tokboxViewModel.prototype.loadSnapImages = function () {
        var _this = this;
        var _url = [snap.baseUrl, "/api/v2/consultations/", this.consultationInfo.consultationId, "/snapshots", "?thumbnail=true"].join("");
        this.snapHttp.get(_url).then(function (data) {
            data = data.data;
            $.each(data, function (i, e) {
                _this.addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
            });
        });
    };
    tokboxViewModel.prototype.onScreenCapture = function (img) {
        var _this = this;
        var _url = [snap.baseUrl, "/api/v2/consultations/", _this.consultationInfo.consultationId, "/snapshots"].join("");
        _this.snapNotification.info("Screenshot has been captured");
        $.ajax({
            url: _url,
            type: 'post',
            data: JSON.stringify({
                snapshotDataUrl: img
            }),
            contentType: "application/json; charset=utf-8",
        }).then(function (data) {
            data = data.data;

            if (data.length !== 1) {
                throw "API returned unexpected result on snapshot upload";
            }

            var result = data[0];
            _this.addSnapImage(result.snapshotFileId, img, img);
            _this.consultationHub.notifyCaptureImage(result.snapshotFileId);

        }).fail(function () {
            _this.snapNotification.error("There is problem uploading the  snapshot.Please try again");
        });
    };

    tokboxViewModel.prototype.refreshScrollView = function () {
        this.trigger("change", { field: "snapImageCollection" });
    };


    tokboxViewModel.prototype.addSnapImage = function (imgId, croppedImgSrc, fullImgSrc) {
        var _this = this;
        var closeImage = function() {
            _this.imagePopup.data("kendoWindow").close();
        };

        var obj = {
            imgsrc: croppedImgSrc,
            fullImgSrc: fullImgSrc,
            imgId: imgId,
            closeSnapImage: function () {
                var array = _this.snapImageCollection;
                for (var i = array.length - 1; i >= 0; i--) {
                    if (array[i].uid === this.uid) {
                        ; (function (_index, imgId) {
                            var _url = [snap.baseUrl, "/api/v2/consultations/", _this.consultationInfo.consultationId, "/snapshots/", imgId].join("");
                            $.ajax({
                                url: _url,
                                type: 'DELETE'
                            }).fail(function () {
                                this.snapNotification.error("There is problem deleting snapshot.Please try again");
                            }).then(function () {
                                $('.snap-img-item:eq('+ _index +')').addClass('is-closing');

                                setTimeout(function(){
                                    array.splice(_index, 1);
                                    _this.refreshScrollView();
                                    _this.consultationHub.removeCaptureImage(imgId);                                            
                                }, 1000)
                            });
                        }(i, this.imgId));

                    }
                }

            },
            viewImage: function() {
                _this.imagePopup.data("kendoWindow")
                    .content(_this.template( { imgsrc: fullImgSrc } ))
                    .center().open();

                _this.imagePopup.find(".image-window-close")
                    .click(function () {
                        _this.imagePopup.data("kendoWindow").close();
                    });
            }
        };

        _this.snapImageCollection.push(obj);
        _this.refreshScrollView();
        $('.OT_root').each(function () {
            $(this).addClass('is-active');
        });

        _this.set("openSnapImageHolder", true);
        _this.set("activeImages", true);
    };

    tokboxViewModel.prototype.snapImagePrev = function (e) {
        e.preventDefault();

        this.set("scrollerMove", this.scrollerMove - 30)
        this.moveScroller();
    };

    tokboxViewModel.prototype.snapImageNext = function (e) {
        e.preventDefault();

        this.set("scrollerMove", this.scrollerMove + 30)
        this.moveScroller();
    };

    tokboxViewModel.prototype.moveScroller = function () {
        var scrollerMoveAmount = this.scrollerMove,
            scroller = $("#snapImageholder").data("kendoMobileScroller");
        scroller.animatedScrollTo(scrollerMoveAmount, 0);
    };

    //#endregion

    //#region Mobile view
    tokboxViewModel.prototype.toggleMobileInfoPanel = function (e) {
        var infoPanelScope = snap.physician.PatientViewModel();
        if (infoPanelScope) {
            infoPanelScope.set('mobileInfoPanel', !infoPanelScope.mobileInfoPanel);
        }
        this.set('infoPanel', !this.infoPanel);

        if (this.isShowMobileVideoControl || this.activeParticipants || this.activeShare) {
            this.set('isShowMobileVideoControl', false);
            this.set('activeParticipants', false);
            this.set('activeShare', false);

        }
    };
    tokboxViewModel.prototype.showMobileControl = function () {
        this.set("isShowMobileVideoControl", !this.isShowMobileVideoControl);

        if (this.clinicianDetails && this.activeParticipants || this.activeParticipants) {
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
        "eventaggregator", "snap.tokbox.TokboxTest", "snap.UI.LayoutManager", "deviceapi", "snap.hub.ConsultationHub"])
        .extend(kendo.observable)
        .define("TokboxViewModel", tokboxViewModel).singleton();; //make it singleton because we only need 1 instance no matter to share the same sesssion
}(jQuery))

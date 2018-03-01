/// <reference path="/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />

; (function ($, snap, kendo, global) {
    "use strict";

    snap.define("deviceapi", function () {
        var devicesById = {};

        var getDeviceLabel = function (device, currentMode) {
            currentMode = currentMode || "videoSource";
            if (device.label) {
                return device.label;
            }
            return (currentMode !== 'audioSource' ? 'Camera' : 'Mic') +
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
            global.OT.getDevices(function (error, devices) {

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
            global.OT.getDevices(function (error, devices) {

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

    var tokboxViewModel = function ($snapNotification, $snapHttp, $snapLoader, $eventaggregator, $tokboxTest,
        $layoutManager, $deviceapi, $mainHub, $consultationHub, $participantStatusCodes, $screenTypes, $consultationParticipants, $participantsService) {


        var _this = this;
        this.snapNotification = $snapNotification;
        this.snapHttp = $snapHttp;
        this.snapLoader = $snapLoader;
        this.eventaggregator = $eventaggregator;
        this.layoutManager = $layoutManager;
        this.consultationHub = $consultationHub;
        this.mainHub = $mainHub;
        this.tokboxTest = $tokboxTest;
        this.deviceapi = $deviceapi;
        this.participantStatusCodes = $participantStatusCodes;
        this.consultationParticipants = $consultationParticipants;
        this.connectionFailedCheckerInterval = null;
        this.reconnectInterval = null;
        this.isChrome = window.isChrome;
        this.isFirefox = window.isFirefox;
        this.consultationId = null;


        //Default Value
        this.switchCameraMode = false;
        this.isStarted = false;
        this.consultButtonTitle = "";
        this.providerDetails = false;
        this.infoPanel = false;
        this.isShowMobileVideoControl = false;
        this.retryDelay = 3 * 1000;
        this.retryCount = 0;

        // Screen type
        this.screenTypes = $screenTypes;
        this.screenType = this.screenTypes.provider;
        this.isGuestPage = function () {
            return this.screenType === this.screenTypes.guest;
        };

        this.scopeActive = false;
        this.scopeUnActive = true;
        this.pillBtnFullOpacity = true;

        this.primaryActive = true;
        this.primaryInActive = false;

        this.isMultiParticipantFeatureEnable = false;
        this.stethoscopes = [];
        this.isStethoscopeEnable = false;
        this.patientAudioPublisher = null;
        this.patientAudioPublisherEl = null;

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
        this.selectedStethoscopesAudioSource = null;
        this.sessionTime = "00:00";

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
        this.snapshotsFolderId = "";
        this.snapImageCollection = new kendo.data.ObservableArray([]);
        this.imagePopup = $("#image-window");
        this.imagePopup.kendoWindow({
            modal: true,
            visible: false,
            draggable: false
        });
        this.annotation = null;
        this.template = kendo.template($("#image-window-template").html());
        this.toolbar = null;
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

        this.layoutManager.onViewChange(function () {
            this.refreshAnnotationCanvas();
        }.bind(this));

        window.onresize = function () {
            this.refreshAnnotationCanvas();
        }.bind(this);

        this.consultationParticipants.setContext(
            this,
            $participantsService.createParticipantsServiceForStandartConsultation(this)
        );

        this.subscribeToEvents();

        //#endregion

    };
    tokboxViewModel.prototype.onSessionStarted = function () {
        this.set("isStarted", true);
        this.set("consultButtonTitle", this.screenType === this.screenTypes.provider ? "End Consultation" : "Disconnect Consultation");
        this.set("isVideoBtn", true);
        this.set("isMicrophoneBtn", true);
        this.set("isMuteBtn", true);
    };

    //#region Participants

    tokboxViewModel.prototype.isStethoscopeAvailable = function () {
        return this.stethoscopes.length > 0;
    };
    tokboxViewModel.prototype.isPhysicianOrListenStethoscope = function () {
        return this.screenType === this.screenTypes.provider && this.stethoscopes.length > 0;
    };

    tokboxViewModel.prototype.setParticipants = function (participants) {
        this.consultationParticipants.setParticipants(participants);
    };

    //#endregion

    //#region basic set function
    tokboxViewModel.prototype.setPatientData = function (data) {
        this.consultationParticipants.setPatientInformation(data);
        this.consultationParticipants.setPatientInformationVisibility(false);
    };
    tokboxViewModel.prototype.hidePatient = function (connectionStatus) {
        this.consultationParticipants.setPatientConnectionStatus(connectionStatus);
        this.consultationParticipants.setPatientInformationVisibility(true);
    };
    tokboxViewModel.prototype.setPatientConnectedDevice = function (flag) {
        this.isPatientInMobileDevice = flag;
    };
    tokboxViewModel.prototype.setProviderData = function (data) {
        this.consultationParticipants.setPhysicianInformation(data);
        this.trigger("change", { field: "consultationParticipants" });
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

            if (hrs === 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);


    };
    tokboxViewModel.prototype.setAppointmentData = function (data) {
        data = data[0];
        this.consultationInfo = data.consultationInfo;
        this.consultationId = data.consultationInfo.consultationId;
        this.snapshotsFolderId = this.snapshotsFolderId || data.consultationInfo.snapshotsFolderId;
        this.setPatientData(data.patientInformation);
    };
    tokboxViewModel.prototype.setBetaParameter = function (isEnable) {
        this.set("isBeta", isEnable);
        global.isVideoBeta = isEnable && this.screenType === this.screenTypes.provider;
        this.set("isMultiParticipantFeatureEnable", true);

    };
    tokboxViewModel.prototype.showProviderDetails = function () {
        this.set("providerDetails", true);
    };
    tokboxViewModel.prototype.hideProviderDetails = function () {
        this.set("providerDetails", false);
    };
    tokboxViewModel.prototype.canShowAnnotation = function () {
        return (snap && snap.hospitalSettings && snap.hospitalSettings.showAnnotation) ? true : false;
    };

    //#endregion


    //#region tokbox related mvvm function
    tokboxViewModel.prototype.setSessionInformation = function (data) {
        $("#snapImageholder").kendoMobileScroller({
            contentHeight: "84px;"
        });
        this.layoutManager.initElement($("#pluginPlaceholder"));
        this.sessionInformation = $.extend(data, {
            screensharing: {
                extensionID: 'padchhoieclaaocgjbfepahaakajgllb',
                annotation: false
            }
        });

        //isLocal ? 'bmeijamkihnnghdnalbfomkbifdacagm' : 

        this.eventaggregator.publish("onInitHub", {});
        this.deviceapi.getVideoDeviceList().then(function (data) {
            this.startTokboxConection(data);
        }.bind(this));

        //Temp hide the Connection test untill we implement new test flow.
        /*

        this.tokboxTest.setSessionId(data.sessionId);
        this.tokboxTest.setToken(data.token);
       

        this.tokboxTest.loadConfig().then(function () {
            _this.tokboxTest.startTests(function () {
                var allDone = true;

                for (var key in results) {
                    if (key == "testWebSocketSecureConnection") {
                        allDone = allDone && true;
                    } else {
                        var result = results[key];
                        if (result.passed === true) {
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
        */

    };

    tokboxViewModel.prototype.initAll = function (_this) {
        var $def = $.Deferred();
        try {
            this.refreshVideoAudioData().then(function () {
                if (this.audioSupport) {
                    if (!this.videoSupport) {
                        this.snapNotification.info('Video device not found. switching to Audio call.');
                    }

                    this.initPublisher().then(function () {
                        _this.initSession().then(function () {
                            _this.initEvents() // previous name _this.initConsultationHubEvents();
                            _this.initAnnotationPublisher();
                            _this.connectPublisherOrRetry();
                            var subsId = _this.publisher.id;
                            var elInfo = $("#" + subsId);
                            elInfo.addClass("OT_Full");
                            _this.set("hasVideoInititlized", true);
                            $def.resolve();
                        });

                    }, function () {
                        _this.snapNotification.info('Unable to start session');
                        $def.reject();
                    });
                } else {
                    this.snapNotification.info('Audio/Video device not found. Please plug in audio/video hardware and refresh browser.');
                    $def.resolve();
                }
            }.bind(this));
        }
        finally {
            return $def.promise();
        }
    };
    tokboxViewModel.prototype.subscribeToEvents = function () {
        var that = this;
        this.eventaggregator.subscriber("ud_showProviderDetails", function () {
            that.showProviderDetails();
        });

        this.eventaggregator.subscriber("forceLogout", function () {
            snap.clearUnLoadEvent();
            that.mainHub.stop();
            if (that.session) {
                that.session.disconnect();
            }
        });
    };
    tokboxViewModel.prototype.initGuestUI = function () {
        this.screenType = this.screenTypes.guest;
        this.trigger("change", { field: "isGuestPage" });
    };
    tokboxViewModel.prototype.initProviderUI = function () {
        this.screenType = this.screenTypes.provider;
        this.trigger("change", { field: "isGuestPage" });
    };
    tokboxViewModel.prototype.initPatientUI = function () {
        this.screenType = this.screenTypes.patient;
        this.trigger("change", { field: "isGuestPage" });
    };

    tokboxViewModel.prototype.tryToReconnect = function (event, that) {
        var _this = that || this;

        if (_this.publisher) {
            _this.publisher.destroy();
            _this.publisher = null;
        }

        _this.initAll(_this)
            .then(function () {
                _this.onSessionReconnected();
            }, function (err) {
                _this.snapNotification.error("Can't reconnect");
            });
    };

    tokboxViewModel.prototype.onSessionReconnecting = function () {
        this.set("isConnectionReconnecting", true);
        var hardReconnectAfter = 90000;

        if (this.reconnectInterval)
            window.clearInterval(this.reconnectInterval);

        this.reconnectInterval = window.setInterval(this.tryToReconnect, hardReconnectAfter, 'event', this);
    };

    tokboxViewModel.prototype.onSessionReconnected = function () {
        this.set("isConnectionReconnecting", false);

        if (this.reconnectInterval)
            window.clearInterval(this.reconnectInterval);
    };
    tokboxViewModel.prototype.showSubscribAudioDisabled = function (stream, hasAudio) {
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
    tokboxViewModel.prototype.onSubscribVideoDisabled = function (stream) {
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;

            this.displayUserImage(streamDivId, 2);

        }
    };
    tokboxViewModel.prototype.displayUserImage = function (streamDivId, selectedScreenType) {
        var _this = this;
        var mainEL = $(streamDivId);
        var img = mainEL.find("img");

        if (img && img.length === 0) {
            img = $("<img />");
            var userimage = selectedScreenType === _this.screenTypes.patient ? mainEL.find(".userimage").html() : this.getProfilePic();

            var imgContainer = $("<div />");
            imgContainer.addClass("userpic userpic--is-consult-no-video");
            imgContainer.append(img);
            mainEL.find(".OT_video-poster").append(imgContainer);
            img.attr("src", userimage);
        }
    };
    tokboxViewModel.prototype._initSubscriberEvent = function (sub) {
        var _this = this;
        var isDisableBecauseOfQuality = false;
        sub.on("videoDisabled", function (event) {
            if (event.reason == "quality") {
                isDisableBecauseOfQuality = true;
                _this.snapNotification.info('Due to high packet loss and low bandwidth, video has been disabled. Please wait..');
                setTimeout(function () {
                    sub.subscribeToVideo(true);
                }.bind(_this), 8000);
            }
            _this.onSubscribVideoDisabled(event.target.stream);
        });
        sub.on("connected", function () {
            if (isDisableBecauseOfQuality) {
                isDisableBecauseOfQuality = false;
                _this.snapNotification.info('Video restore');
            }
        });
        sub.on("videoEnabled", function (event) {
            if (isDisableBecauseOfQuality) {
                isDisableBecauseOfQuality = false;
                _this.snapNotification.info('Video restore');
            }
            var streamId = event.target.id;
            $('.OT_root').each(function () {
                if ($(this).attr('id') == streamId) {
                    $(this).find(".OT_video-poster").html("");
                }
            });
        });
    };
    tokboxViewModel.prototype.initSubscriber = function (stream, isAudioOnly) {
        var isStethoscopeAudio = stream.name.indexOf('patientAudio') >= 0;
        var container = isStethoscopeAudio ? 'patientAudio' : 'pluginPlaceholder';
        var elInfo = null;
        var _this = this;
        var props = {
            showControls: true,
            width: '120px',
            height: '120px',
            insertMode: 'append'
        };
        if (!isStethoscopeAudio) {
            props.subscribeToVideo = true;
            props.subscribeToAudio = true;
            if (isAudioOnly) {
                props.subscribeToVideo = false;
            }
        } else {
            props.subscribeToVideo = false;
            props.subscribeToAudio = false;
            props.style = {
                buttonDisplayMode: 'off'
            };
            //this.scopeActive = stream.hasAudio;
            //this.scopeUnActive = !stream.hasAudio;
            this.trigger("change", { field: "isStethoscopeAudio" });
            this.trigger("change", { field: "canShowSCope" });
            this.trigger("change", { field: "countSScope" });
            this.trigger("change", { field: "scopeActive" });
            this.trigger("change", { field: "scopeUnActive" });

            if (this.isStethoscopeAudio) {
                this.set("pillBtnFullOpacity", true);
                setTimeout(function () {
                    _this.set("pillBtnFullOpacity", false)
                }, 5000)
            }
        }
        var subs = this.session.subscribe(stream, container, props, function (error) {
            if (!error) {
                if (isStethoscopeAudio) {
                    _this.patientAudioSubscriber = subs;
                    _this.refreshStethoscope();
                    _this.setPatientAudioListener(true, subs);
                    return;
                }
                _this.subscribers.push(subs);
                if (!stream.hasVideo) {
                    _this.onSubscribVideoDisabled(stream);
                }
                if (!stream.hasAudio) {
                    _this.showSubscribAudioDisabled(stream, false);
                }

                if (_this.mediaInfoVM) {
                    _this.mediaInfoVM.setSubscribers(_this.subscribers)
                }

                $(".OT_root").removeClass("OT_Full");
                var subsId = subs.id;
                elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                _this.layoutManager.refreshLayout(true);
                elInfo.find(".OT_widget-container").attr("id", stream.id);
                _this.set("clientconnected", true);
                _this._initSubscriberEvent(subs);
                if (subs) {
                    subs.setStyle('videoDisabledDisplayMode', 'on');
                    _this.initAnnotationSubscriber(subs);
                }
            }
        });
    };

    /* Annotation  */
    tokboxViewModel.prototype.initAnnotationSubscriber = function (_subscriber) {
        if (_subscriber && this.annotation) {
            var pubEli = $(_subscriber.element)[0];
            var options = {
                lineWidth: toolbar.lineWidth || 2,
                selectedColor: toolbar.selectedColor || '',
                selectedItem: toolbar.selectedItem
            };

            this.annotation.linkCanvas(_subscriber, pubEli, options);
            this._initAnnotationEvent();
        }
    };

    tokboxViewModel.prototype.startScreenShareAnnotation = function () {
        if (this.screenPublisher && this.annotation) {
            var pubEli = $(this.screenPublisher.element)[0];
            var options = {
                lineWidth: toolbar.lineWidth || 2,
                selectedColor: toolbar.selectedColor || '',
                selectedItem: toolbar.selectedItem
            };

            this.annotation.linkCanvas(this.screenPublisher, pubEli, options);
            this._initAnnotationEvent();
        }
    };

    tokboxViewModel.prototype._initAnnotationEvent = function () {
        setTimeout(function () {
            var width = $("#pluginPlaceholder").width();
            var height = $("#pluginPlaceholder").height();
            $(".opentok_canvas").width(width);
            $(".opentok_canvas").height(height);
            $(".opentok_canvas").attr("width", width + "px");
            $(".opentok_canvas").attr("height", height + "px");

        }, 1000);
        $(window).off('resize').on('resize', function () {
            var width = $("#pluginPlaceholder").width();
            var height = $("#pluginPlaceholder").height();
            $(".opentok_canvas").width(width);
            $(".opentok_canvas").height(height);
            $(".opentok_canvas").attr("width", width + "px");
            $(".opentok_canvas").attr("height", height + "px");
        });
    }
    tokboxViewModel.prototype.initAnnotationPublisher = function () {
        if (this.publisher && this.annotation) {
            var pubEli = $(this.publisher.element)[0];
            this.annotation.linkCanvas(this.publisher, pubEli);
            this._initAnnotationEvent();
        }

    };
    tokboxViewModel.prototype.captureScreenshot = function (isAnnotationEnd) {
        var videElId = $(".OT_Full").attr("id");
        var videEl = $(".OT_Full").find("video");
        this.cloneCanvas = $(".OT_Full").find("canvas")[0];

        //prevent video capture if audio only
        if($("#" + videElId).hasClass("OT_audio-only")){
            snapError("Cannot capture image when video stream is disabled.")
            return;
        }

        var videElPubOrSub = OT.publishers.find(function (item) { return item.id == videElId; });
        if (!videElPubOrSub) {
            videElPubOrSub = OT.subscribers.find(function (item) { return item.id == videElId; });
        }
        if (!videElPubOrSub) {
            return;
        }

        $('.consult-screen__screen').addClass('is-flash');
        setTimeout(function () { $('.consult-screen__screen').removeClass('is-flash'); },2000);


        var offsetX = 0;
        var offsetY = 0;
        var width = videElPubOrSub.videoWidth();
        var height = videElPubOrSub.videoHeight();

        var MAX_WIDTH = this.cloneCanvas.width;
        var MAX_HEIGHT = this.cloneCanvas.height;

        var canvasCopy = document.createElement('canvas');
        canvasCopy.width = MAX_WIDTH;
        canvasCopy.height = MAX_HEIGHT;

        if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH
            offsetX = 0;
            offsetY = (this.cloneCanvas.height - height) / 2;
        } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
            offsetX = (this.cloneCanvas.width - width) / 2;
            offsetY = 0;
        }
        // Combine the video and annotation images
        var image = new Image();

        image.onload = function () {
            console.log("Annotation Capture");
            var ctxCopy = canvasCopy.getContext('2d');
            ctxCopy.drawImage(image, offsetX, offsetY, width, height);
            ctxCopy.drawImage(this.cloneCanvas, 0, 0);
            this.onScreenCapture(canvasCopy.toDataURL());
            canvasCopy = null;

        }.bind(this);
        image.src = 'data:image/png;base64,' + videElPubOrSub.getImgData();

    };
    tokboxViewModel.prototype.initAnnotation = function () {
        this.pendingCaptureInterval = null;
        var selectedImage = null;
        if (this.canShowAnnotation() && !this.annotation) {
            this.annotation = new AnnotationAccPack({
                session: this.session,
                canvasContainer: $("#pluginPlaceholder")[0]
            });
            this.annotation.start(this.session, {
                toolbarId: 'toolbar',
                color: toolbar.selectedColor,
                lineWidth: toolbar.lineWidth
            });
            $("#OT_capture").on('click', function () {
                this.captureScreenshot();
            }.bind(this));
        }

    };
    /*end of Annotation */

    tokboxViewModel.prototype.onStreamCreated = function (event) {
        this.set("isStarted", true);
        if (event.stream) {
            var streamId = event.stream.id;
            var alreadySubs = global.OT.subscribers.where(function (subscriber) {
                return subscriber.streamId === streamId;
            });
            if (alreadySubs.length > 0) {
                return;
            }

            if (!event.stream.hasVideo && event.stream.name.indexOf('patientAudio') < 0) {
                this.snapNotification.info("Video stream is not available");
            }

            if (!event.stream.hasAudio && event.stream.videoType !== "screen" && event.stream.name.indexOf('patientAudio') < 0) {
                this.snapNotification.info("Audio stream is not available");
            }

        }
        this.initSubscriber(event.stream);

        this.set("videoDisconnected", false);

    };
    tokboxViewModel.prototype.restartConnection = function () {
        window.console.log("retry");
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
                _this.initAnnotationPublisher();
                _this.connectPublisherOrRetry();
            });
        });
    };
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
    };
    tokboxViewModel.prototype.onSessionDisconnected = function (event) {
        if (event.reason == "networkDisconnected") {
            this.detectAndReconnct();
        }
    };
    tokboxViewModel.prototype.onStreamPropertyChanged = function (event) {
        if (event.changedProperty == "hasAudio") {
            this.showSubscribAudioDisabled(event.stream, event.newValue);
            this.syncStethoscopeIcon();
            if (event.stream.name.indexOf('patientAudio') >= 0) {
                var hasAudio = event.stream.hasAudio;
                this.scopeActive = hasAudio;
                this.scopeUnActive = !hasAudio;
                this.trigger("change", { field: "scopeActive" });
                this.trigger("change", { field: "scopeUnActive" });
            }
        }
    };
    tokboxViewModel.prototype._initSessionEvents = function () {
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
            streamDestroyed: function (event) {
                _this.layoutManager.refreshLayout();
                _this.removeAnnotationLink(event.stream);
                if (event.stream.name.indexOf('patientAudio') >= 0) {
                    setTimeout(function () {
                        _this.refreshStethoscope();
                        _this.setPatientAudioListener(false, _this.patientAudioSubscriber);
                    }, 300);

                }
            },
            streamPropertyChanged: function (event) {
                _this.onStreamPropertyChanged(event);
            },
            connectionCreated: function (stream) {
                if (stream.connectionId === _this.session.connection.connectionId) {
                    return;
                }
                _this.set("isPhysicianReady", _this.screenType === _this.screenTypes.provider && _this.hasVideoInititlized);
                _this.set("videoDisconnected", false);
                _this.eventaggregator.publish("clientconnected", true);
            }
        });
        this.session.on("signal:listenToPrimary", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid) {
                if (data.listen) {
                    _this.publisher.publishAudio(true);
                } else {
                    _this.publisher.publishAudio(false);
                }
                _this.set("isMuteMicrophone", !data.listen);
                _this.set("isMicrophoneBtn", data.listen);
                _this.trigger("change", { field: "muteMicTitle" });
            }
        });
        this.session.on("signal:listenToScope", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid) {
                _this.patientAudioPublisher.publishAudio(data.listen);
            }
        });

        this.session.on("signal:sendPrimaryChannelStatus", function (_data) {
            var data = JSON.parse(_data.data);
            if (data && data.id === _this.selectedStethoscopeId) {
                _this.set("primaryActive", data.hasAudio);
                _this.set("primaryInActive", !data.hasAudio);
            }
        });

        this.session.on("signal:getPrimaryChannelStatus", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid && _this.publisher && _this.publisher.stream) {
                var hasAudio = _this.publisher.stream.hasAudio;
                _this.session.signal({ type: 'sendPrimaryChannelStatus', data: JSON.stringify({ hasAudio: hasAudio, id: stethoscopetempuserid }) });

            }
        });

        window.addEventListener('online', function () {
            _this.set("isConnectionReconnecting", false);
        }, false);
    };
    tokboxViewModel.prototype.removeAnnotationLink = function (stream) {

        if (this.annotation) {

            this.annotation.removeCanvas(stream.connection.connectionId);
        }
    };
    tokboxViewModel.prototype.hasAudioDevice = function () {
        var $def = $.Deferred();
        global.OT.getDevices(function (error, devices) {
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
    };
    tokboxViewModel.prototype.refreshVideoAudioData = function () {
        var $def = $.Deferred();
        global.OT.getDevices(function (error, devices) {
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
    };
    tokboxViewModel.prototype.initSession = function () {
        var $def = $.Deferred();
        var _this = this;


        this.session = global.OT.initSession(this.sessionInformation.apiKey, this.sessionInformation.sessionId);
        this._initSessionEvents();
        this.session.connect(this.sessionInformation.token, function (error, sessionConnectEvent) {
            if (error) {
                _this.sessionError = error;
                $def.reject();
            } else {
                _this.sessionConnectEvent = sessionConnectEvent;
                _this.initAnnotation();
                $def.resolve();
            }
        });
        return $def.promise();
    };
    tokboxViewModel.prototype.updateFilesView = function () {
        if (app.snapFileService && app.snapFileService.viewModel) {
            app.snapFileService.viewModel.updateView();
        }
        if (app.snapFileService && app.snapFileService.bottomViewModel) {
            app.snapFileService.bottomViewModel.updateView();
        }
    };
    tokboxViewModel.prototype.initEvents = function () {
        var _this = this;
        var onSnapshotsFolderRemoved = function () {
            _this.snapNotification.info("Consultation snapshots folder has been deleted");
            _this.snapImageCollection = new kendo.data.ObservableArray([]);
            _this.refreshScrollView();
            _this.set("openSnapImageHolder", false);
            _this.set("activeImages", false);
        };
        var snapshotsVisible = this.canShowAnnotation();
        if (snapshotsVisible) {
            this.consultationHub.on("onImageReceived", function (imageId) {
                _this.updateFilesView();
                var getImagePromise = _this.screenType == 3 ? snap.service.guestConsultationService().getSnapshot(_this.consultationInfo.consultationId, imageId) :
                    snap.service.appointmentService().getSnapshot(_this.consultationInfo.consultationId, imageId);
                getImagePromise.then(function (data) {
                    data = data.data;
                    $.each(data, function (i, e) {
                        _this.addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
                    });
                });

            });
            this.consultationHub.on("onImageRemoved", function (imgId) {
                _this.updateFilesView();
                var array = _this.snapImageCollection;
                for (var i = array.length - 1; i >= 0; i--) {
                    if (array[i].imgId === imgId) {
                        array.splice(i, 1);
                    }
                }
                _this.snapNotification.success("A snapshot was deleted by another participant");
                _this.refreshScrollView();

            });
            this.consultationHub.on("onRemoveSnapshotFolder", function () {
                onSnapshotsFolderRemoved();
            });
            this.consultationHub.on("onSetupSnapshotsFolder", function (folderId) {
                _this.snapshotsFolderId = folderId;
            });
            this.eventaggregator.subscriber("filedeleted", function (imgId) {
                var array = _this.snapImageCollection;
                for (var i = array.length - 1; i >= 0; i--) {
                    if (array[i].imgId === imgId) {
                        array.splice(i, 1);
                        _this.refreshScrollView();
                        _this.consultationHub.removeCaptureImage(imgId);
                    }
                }
            });
            this.eventaggregator.subscriber("folderdeleted", function (folderId) {
                if (_this.snapshotsFolderId === folderId) {
                    _this.consultationHub.removeSnapshotFolder(folderId);
                    onSnapshotsFolderRemoved();
                }
            });
        }
    };
    tokboxViewModel.prototype.getName = function () {
        if (this.screenType == this.screenTypes.provider || this.screenType == this.screenTypes.patient) {
            return snap.profileSession.fullName || "";
        } else {
            return snap.guestSession.participantName;
        }
    };

    tokboxViewModel.prototype.getProfilePic = function () {
        var profilePic;
        if (this.screenType === this.screenTypes.patient && this.consultationParticipants.patientInformation) {
            return this.consultationParticipants.patientInformation.profileImagePath;
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
        var _allowCameraNotification = null;

        this.publisher.on({
            destroyed: function () {

                window.console.log("destroyed");
                if (!_this.switchCameraMode) {
                    _this.connectPublisherOrRetry();
                }
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
                _allowCameraNotification = _this.snapNotification.info("Please allow the camera access");
            },
            accessDialogClosed: function () {
                // Empty is intentional
            },
            accessAllowed: function () {
                $(".networktest").hide();

                if (_allowCameraNotification && _allowCameraNotification.hide) {
                    _allowCameraNotification.hide();
                    _allowCameraNotification = null;
                }
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

    };
    tokboxViewModel.prototype.onStethoscopeEnable = function () {
        setTimeout(function () {
            if (!this.isStethoscopeEnable) {
                if (this.patientAudioPublisher) {
                    this.session.unpublish(this.patientAudioPublisher);
                    this.set("selectedStethoscopesAudioSource", null);
                }
            }
        }.bind(this), 500);
    };
    tokboxViewModel.prototype.publishStethoscope = function (deviceId) {
        var _this = this;
        var targetDeviceLabel = deviceId;
        var name = "";
        var tmpId = Math.round((new Date()).getTime() / 1000);
        sessionStorage.setItem("snap_stethoscopetempuserid", tmpId);
        var isProvider = this.screenType === this.screenTypes.provider;
        if (isProvider) {
            name = ["patientAudio", "provider", snap.profileSession.fullName, tmpId].join('-');
        } else if (this.screenType === this.screenTypes.patient) {
            var patientName = snap.consultationSession.patientName || this.consultationParticipants.patientInformation.patientName + ' ' + this.consultationParticipants.patientInformation.lastName;
            name = ["patientAudio", "patient", patientName, tmpId].join('-');
        } else { // guest page
            var gName = snap.guestSession.participantName;
            name = ["patientAudio", "guest", gName, tmpId].join('-');
        }
        const baseOptions = {
            name: name,
            publishAudio: true,
            publishVideo: false,
            disableAudioProcessing: true,
            audioBitrate: 256000,
            insertMode: 'append',
        };
        this.patientAudioPublisher = null;
        this.patientAudioPublisherEl = null;
        OT.getDevices(function (error, devices) {

            var stethoscope;
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].deviceId === targetDeviceLabel) {
                    stethoscope = devices[i];
                    break;
                }
            }
            //commented out because of uglify error
            //var stethoscope = devices.find(d => d.deviceId === targetDeviceLabel);

            if (!stethoscope) {
                console.info('Could not find target device');
            }
            var audioSource = stethoscope ? { audioSource: stethoscope } : {};
            var publisherOptions = Object.assign({}, baseOptions, audioSource)
            _this.patientAudioPublisher = OT.initPublisher(document.getElementById('patientAudio'), publisherOptions, function (error) {
                if (!error) {
                    _this.session.publish(_this.patientAudioPublisher, function (_, pubInfo) {
                        _this.patientAudioPublisherEl = pubInfo;
                        _this.refreshStethoscope();
                    });
                }
            });


        })
    }
    tokboxViewModel.prototype.connectPublisher = function () {
        var _this = this;
        var $def = $.Deferred();
        if (this.session && (this.session.connected ||
            (this.session.isConnected && this.session.isConnected()))) {
            this.session.publish(_this.publisher, function (err) {
                if (err) {
                    window.console.error(err);
                    if (_this.retryCount === 0) {
                        if (err.code === 1553 || (err.code === 1500 && err.message.indexOf("Publisher PeerConnection Error:") >= 0)) {
                            _this.snapNotification.error("Re-publishing. Streaming connection failed. This could be due to a restrictive firewall.");
                        } else if (err.code == 2001) {
                            console.log("TokBox Bug");
                            $def.resolve();
                            return;
                        }
                    } else {
                        _this.set("isConnectionReconnecting", true);
                    }
                    $def.reject();
                    _this.publishError = err;
                } else {
                    _this.set("isConnectionReconnecting", false);
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
                this.retryCount = 0;
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
        var defaultProp = $.extend(prop, {
            name: name,
            testNetwork: true,
            showControls: true,
            insertMode: 'append',
            mirror: false,
            width: '120px',
            height: '120px'
        });

        this.publisher = global.OT.initPublisher('pluginPlaceholder', defaultProp, function (err) {
            if (err) {
                if (err.code === 1500 && err.message.indexOf('Publisher Access Denied:') >= 0) {
                    _this.snapNotification.error('Please allow access to the Camera and Microphone and try publishing again.');
                } else {
                    _this.snapNotification.error('Failed to get access to your camera or microphone. Please check that your webcam is connected and not being used by another application and try again.');
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
        var snapshotsVisible = this.canShowAnnotation();
        if (snapshotsVisible) {
            this.loadSnapImages();
        }
        this.initAll(_this);

    };

    tokboxViewModel.prototype.startSession = function (e) {
        var _this = this;
        e.preventDefault();
        var $pageViewmodel;
        var isProvider = this.screenType === this.screenTypes.provider;
        if (isProvider) {
            $pageViewmodel = snap.resolveObject("snap.physician.PhysicianAppointmentViewModel");
        } else if (this.screenType === this.screenTypes.patient) {
            $pageViewmodel = snap.resolveObject("snap.patient.PatientAppointmentViewModel");
        } else { // guest page
            $pageViewmodel = snap.resolveObject("snap.patient.PatientAppointmentViewModel");
        }

        if ($pageViewmodel) {
            if (isProvider && !_this.isStarted) {
                $pageViewmodel.startSession();
            } else {
                $pageViewmodel.endSession();
            }
        } else {
            _this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?", function () {
                _this.consultationHub.disconnectConsultation();
                _this.redirectFromConsultation();
            });
        }
    };

    tokboxViewModel.prototype.redirectFromConsultation = function () {
        var _this = this;
        snap.ConsultationPage = false;
        _this.mainHub.isManualStop = true;
        _this.mainHub.stop();
        $(".btnSession").hide();
        window.setTimeout(function () {
            sessionStorage.removeItem("snap_participantId");
            snap.clearSnapConsultationSession();
            snap.clearSnapGuestSession();
            if (_this.screenType === _this.screenTypes.provider) {
                window.location.href = snap.getClinicianHome();
            } else if (_this.screenType == _this.screenTypes.patient) {
                sessionStorage.setItem("snap_consultationId_ref", _this.consultationId);
                window.location.href = snap.patientConsultEndUrl();
            } else {
                window.location.replace("/Public/#/joinexit");
            }
        }, 2000);
    };
    //#endregion

    //#region tokbox related screenshare function
    tokboxViewModel.prototype.extensionAvailable = function () {
        var _this = this;
        var deferred = $.Deferred();
        global.OT.registerScreenSharingExtension('chrome', this.sessionInformation.screensharing.extensionID);
        global.OT.checkScreenSharingCapability(function (response) {
            var errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
            if (!response.supported || !response.extensionRegistered) {
                if (global.OT.$.browser() === 'Firefox' && response.extensionInstalled) {
                    deferred.resolve();
                } else if (global.OT.$.browser() === 'Firefox' && !response.extensionInstalled) {
                    deferred.resolve(); //it could actually be in the ff browser but we can't see extensionInstalled
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                        if (global.OT.$.browser() === 'Firefox') {
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
                _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                    if (global.OT.$.browser() === 'Firefox') {
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
            _this.screenPublisher = global.OT.initPublisher('pluginPlaceholder', properties, function (error) {
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
        var _this = this;
        window.chrome.webstore.install('https://chrome.google.com/webstore/detail/' + this.sessionInformation.screensharing.extensionID,
            function () {
                _this.snapNotification.success('successfully installed');
            }, function () {
                window.open('https://chrome.google.com/webstore/detail/' + _this.sessionInformation.screensharing.extensionID);
            });
    };
    tokboxViewModel.prototype._publishScreenShare = function () {
        var _this = this;
        var $def = $.Deferred();
        this.session.publish(this.screenPublisher, function (error) {
            if (error) {
                var errorMessage;
                if (error.code === 1500 && navigator.userAgent.indexOf('Firefox') !== -1) {
                    errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                        if (global.OT.$.browser() === 'Firefox') {
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
                $def.reject();
                return;
            }
            $def.resolve();
            return;

        });

        return $def.promise();

    };
    tokboxViewModel.prototype.startScreenSharing = function () {
        var _this = this;
        this.extensionAvailable()
            .then(function () {
                _this._initScreenSharePublisher().then(function () {
                    _this._publishScreenShare().then(function () {
                        _this.startScreenShareAnnotation();
                    });
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
        this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to end this consultation?", function () {
            if (_this.session) {
                _this.session.disconnect();
            }
        });
    };

    tokboxViewModel.prototype.showSelfView = function () {
        if (this.clientconnected && this.publisher && this.publisher.id) {
            var id = "#" + this.publisher.id;
            $(id).toggle();

            this.set("isSelfView", !this.isSelfView);
            this.trigger("change", { field: "isSelfView" });
            if ($(id).hasClass("OT_Full")) {
                $(".OT_root").not(".OT_Full").first().addClass("OT_Full");
                $(id).removeClass("OT_Full");
            }
        }
        else {
            this.muteVideo();
        }
    };
    //mute video
    tokboxViewModel.prototype.muteVideo = function () {
        var _this = this;
        if (!this.publisher) {
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
        this.trigger("change", { field: "muteVideoTitle" });
        this.trigger("change", { field: "hasVideoInititlized" });

    };
    tokboxViewModel.prototype.muteVideoTitle = function () {
        return this.isVideoMute ? "Unmute Camera" : "Mute Camera";
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

        if (!this.isMeidiaInfoShown) {

            if (!this.isMeidiaInfoInitialized) {
                // load and bind template
                if (!this.mediaInfoVM) {
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
            this.mediaInfoVM.set("isRealtime", false);
            this.mediaInfoVM.setTimerState();

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
        this.trigger("change", { field: "muteMicTitle" });


    };
    tokboxViewModel.prototype.muteMicTitle = function () {
        return this.isMuteMicrophone ? "Unmute Microphone" : "Mute Microphone";
    };

    tokboxViewModel.prototype.muteVoice = function () {
        var _this = this;
        if (this.clientconnected) {
            this.set("isMute", !this.isMute);
            this.set("isMuteBtn", !this.isMuteBtn);
            this.trigger("change", { field: "muteVoiceTitle" });
            $.each(_this.subscribers, function () {
                if (_this.isMute) {
                    this.subscribeToAudio(false);
                } else {
                    this.subscribeToAudio(true);
                }
            });

        }
    };
    tokboxViewModel.prototype.muteVoiceTitle = function () {
        return this.isMute ? "Unmute Speakers" : "Mute Speakers";
    };

    tokboxViewModel.prototype.resetMedia = function () {
        var _this = this;

        if (this.publisher) {
            this.session.unpublish(this.publisher);
        }
        setTimeout(function () {
            _this.initPublisher().then(function () {
                _this.connectPublisherOrRetry();
            });
        }, 100);
    }

    tokboxViewModel.prototype.selectVideoTab = function (e) {
        var _this = this;
        var el = $(e.currentTarget),
            id = el.attr("data-id");
        if (id == "activeSetting" && !(window.isChrome || window.isFirefox)) {
            _this.resetMedia();
            return;
        }
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
    tokboxViewModel.prototype.refreshAnnotationCanvas = function () {
        if (this.annotation) {
            var allCanvas = $(".opentok_canvas");
            $.each(allCanvas, function (__index, currentCanvas) {
                this.annotation.refreshCanvas([currentCanvas]);
            }.bind(this));
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
        var exitHandler = function () {
            this.refreshAnnotationCanvas();
        }.bind(this);
        if (element.addEventListener) {
            element.addEventListener('webkitfullscreenchange', exitHandler, false);
            element.addEventListener('mozfullscreenchange', exitHandler, false);
            element.addEventListener('fullscreenchange', exitHandler, false);
            element.addEventListener('MSFullscreenChange', exitHandler, false);
        }
        exitHandler();
    };

    tokboxViewModel.prototype.onAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    tokboxViewModel.prototype.onVideoComboOpen = function () {
        this.videoSourceList.read();
    };
    tokboxViewModel.prototype.removePublisherAnnotationLink = function () {
        if (this.publisher && this.publisher.stream) {
            var streamId = this.publisher.stream.streamId;
            var session = OT.sessions.find(function (item) {
                return item.currentState === 'connected';
            });
            if (session) {
                var streams = session.streams.where(function (item) {
                    return item.streamId === streamId;
                });
                if (streams && streams[0]) {
                    this.removeAnnotationLink(streams[0]);
                }
            }
        }
    }
    tokboxViewModel.prototype.onVideoChange = function () {
        if (this.selectedVideoSource !== null) {
            if (this.publisher) {
                this.removePublisherAnnotationLink();
                this.switchCameraMode = true;
                this.publisher.destroy();
                this.publisher = null;
            }

            var publishAudio = true;
            if (this.isMuteMicrophone) {
                publishAudio = false;
            }
            setTimeout(function () {
                this.switchCameraMode = false;
                this.initPublisher({
                    videoSource: this.selectedVideoSource['value'],
                    publishAudio: publishAudio
                }).then(function () {
                    this.initAnnotationPublisher();
                    this.connectPublisherOrRetry();
                }.bind(this));
            }.bind(this), 1000);
        }
    };
    tokboxViewModel.prototype.onAudioChange = function () {
        if (this.selectedAudioSource !== null) {
            if (this.publisher) {
                this.removePublisherAnnotationLink();
                this.publisher.destroy();
                this.switchCameraMode = true;
                this.publisher = null;
            }
            var publishVideo = true;
            if (this.isVideoMute) {
                publishVideo = false;
            }
            setTimeout(function () {
                this.switchCameraMode = true;
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
            }.bind(this), 1000);

        }
    };

    //#endregion


    /* Kubi Integration */

    tokboxViewModel.prototype.initKubi = function () {
        var $def = $.Deferred();
        if (snap.cachedGetScript) {
            snap.cachedGetScript("/Scripts/kubi/kubi.control.js").done(function () {
                this.kubiControl = new snap.kubi.kubiControl();
                $def.resolve();
            }.bind(this)).fail(function () {
                $def.reject();
            });
        } else {
            $def.reject();
        }
        return $def.promise();
    };
    tokboxViewModel.prototype.showKubiPad = function (flag) {
        if (this.kubiControl) {
            this.kubiControl.initKubiControl();
        }
    };
    tokboxViewModel.prototype.showKubiWindow = function (flag) {

        if (!this.kubiControl.isConnected) {
            this.kubiControl.connectAndMoveCenter('6817EB').then(function () {
                this.set("isKubiVisible", true);
                this.kubiControl.toggleKubi(this.isKubiVisible);
            }.bind(this)).fail(function () {
                this.snapNotification.error("Kubi is not connected. Please connect kubi and try again.");
            }.bind(this));
        } else {
            this.set("isKubiVisible", !this.isKubiVisible);
            this.kubiControl.toggleKubi(this.isKubiVisible);
        }
    };
    tokboxViewModel.prototype.isKubiEnable = function () {
        return (snap.hospitalSettings && snap.hospitalSettings.showKubi && this.screenType === this.screenTypes.provider) ? true : false;
    };

    //#region Screensots
    tokboxViewModel.prototype.showSnapImageHolder = function () {

        // because state can be different for  OT_mini divs toggelClass will have bugs
        if (!this.activeImages) {
            $('.OT_root').each(function () {
                $(this).addClass('is-active');
            });
        }
        else {
            $('.OT_root').each(function () {
                $(this).removeClass('is-active');
            });
        }

        this.set("activeImages", !this.activeImages);
        this.set("openSnapImageHolder", !this.openSnapImageHolder);
    };

    tokboxViewModel.prototype.loadSnapImages = function () {
        var _this = this;
        var loadImagesPromise = _this.screenType == 3 ? snap.service.guestConsultationService().loadSnapshots(this.consultationInfo.consultationId) :
            snap.service.appointmentService().loadSnapshots(this.consultationInfo.consultationId);
        loadImagesPromise.then(function (data) {
            _this.snapImageCollection = new kendo.data.ObservableArray([]);
            data = data.data;
            $.each(data, function (i, e) {
                _this.addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
            });
        });
    };
    tokboxViewModel.prototype.onScreenCapture = function (img) {
        if (this.screenType == 3) {
            // sidebar is not implemented for guests
            return;
        }
        var _this = this;
        _this.snapNotification.info("Screenshot has been captured");
        snap.service.appointmentService().addSnapshot(_this.consultationInfo.consultationId, img).then(function (data) {
            data = data.data;

            if (data.length !== 1) {
                throw "API returned unexpected result on snapshot upload";
            }

            var result = data[0];
            _this.addSnapImage(result.snapshotFileId, img, img);
            _this.updateFilesView();
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
        var obj = {
            imgsrc: croppedImgSrc,
            fullImgSrc: fullImgSrc,
            imgId: imgId,
            isActive: false,
            closeSnapImage: function () {
                var _image = this;
                if (_this.screenType == 3) {
                    // guests are not permitted to delete
                    _this.snapNotification.info("You cannot delete snapshots.");
                    return;
                }
                _this.snapNotification.confirmationWithCallbacks("Are you sure that you want to delete snapshot?", function () {
                    var array = _this.snapImageCollection;
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (array[i].uid === _image.uid) {
                            ; (function (_index, imgId) {
                                snap.service.appointmentService().deleteSnapshot(_this.consultationInfo.consultationId, imgId).fail(function () {
                                    _this.snapNotification.error("There is problem deleting snapshot.Please try again");
                                }).then(function () {
                                    $('.snap-img-item:eq(' + _index + ')').addClass('is-closing');
                                    _this.snapNotification.success("The snapshot was deleted successfully");
                                    window.setTimeout(function () {
                                        array.splice(_index, 1);
                                        _this.refreshScrollView();
                                        _this.updateFilesView();
                                        _this.consultationHub.removeCaptureImage(imgId);
                                    }, 1000);
                                });
                            }(i, _image.imgId));

                        }
                    }
                });
            },
            viewImage: function () {
                var that = this;
                that.set('isActive', true);

                var popup = _this.imagePopup.data("kendoWindow");
                popup.content(_this.template({ imgsrc: fullImgSrc }));

                setTimeout(function () {
                    // this timeout is necessary to render content.
                    popup.center().open();
                }, 100);

                _this.imagePopup.find(".snapimg-window__close")
                    .click(function () {
                        _this.imagePopup.data("kendoWindow").close();
                        that.set('isActive', false);
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
        var isAnimationDisabled = false;
        //tony.y: this will work slow, possible exceptions when images not loaded or empty will catch in try
        try {
            var firstSnapImgX = $('div.snap-img-item:first-child').position().left;
            if (firstSnapImgX >= 0) {
                isAnimationDisabled = true;
            } else {
                this.set("scrollerMove", this.scrollerMove + 60);
            }

            this.moveScroller(isAnimationDisabled);
        } catch (exp) {
            window.console.error(exp);
        }

    };

    tokboxViewModel.prototype.snapImageNext = function (e) {
        e.preventDefault();

        var isAnimationDisabled = false;
        try {
            var lastSnapImgX = $('div.snap-img-item:last-child').position().left;
            var containerWidth = $("#snapImageholder").width();
            if (Math.floor(lastSnapImgX + 60) < containerWidth) {
                isAnimationDisabled = true;
            } else {
                this.set("scrollerMove", this.scrollerMove - 60);
            }

            this.moveScroller(isAnimationDisabled);
        } catch (exp) {
            window.console.error(exp);
        }

    };

    tokboxViewModel.prototype.moveScroller = function (isAnimationDisabled) {
        var scrollerMoveAmount = this.scrollerMove,
            scroller = $("#snapImageholder").data("kendoMobileScroller");
        if (isAnimationDisabled) {
            scroller.scrollTo(scrollerMoveAmount, 0);
        } else {
            scroller.animatedScrollTo(scrollerMoveAmount, 0);
        }

    };

    //#endregion

    //#region Mobile view
    tokboxViewModel.prototype.toggleMobileInfoPanel = function () {
        var infoPanelScope = snap.resolveObject("snap.physician.PatientViewModel");
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

        if (this.activeParticipants) {
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


    //#region stethoscopes 
    tokboxViewModel.prototype.refreshStethoscope = function () {
        var session = OT.sessions.find(function (item) {
            return item.currentState === 'connected';
        });
        var _this = this;
        this.stethoscopes = [];
        if (session) {
            session.streams.where(function (item) {
                return item.name.indexOf('patientAudio') >= 0;
            }).forEach(function (item) {
                var isOwnStream = false;
                if (this.patientAudioPublisher && this.patientAudioPublisher.streamId === item.streamId) {
                    isOwnStream = true;
                }
                if (!isOwnStream) {
                    var nameArray = item.name.split('-');
                    var userType = nameArray[1];
                    var userName = nameArray[2];
                    var pId = nameArray[3];
                    item.displayName = userName;
                    item.participant = {
                        id: pId,
                        name: userName,
                        userType: userType
                    };
                    this.stethoscopes.push(item);
                    this.trigger("change", { field: "stethoscopes" });
                    this.trigger("change", { field: "isStethoscopeAvailable" });
                    setTimeout(function () {
                        $.each($("input.eqSlider"), function () {
                            var slider = $(this).data("kendoSlider");
                            if (slider) {
                                slider.unbind('change').bind('change', function (e) {
                                    var el = $(this);
                                    var _id = $(el[0].element).data("id");
                                    var volumn = e.value;
                                    var volIcon = $(".consult-settings__steth-toggler-icon[data-id='" + _id + "']");
                                    var correctStreams = _this.stethoscopes.find(function (_item) {
                                        return _item.participant.id == _id;
                                    });

                                    if (volumn > 0) {
                                        if (!volIcon.hasClass("icon_speaker"))
                                            volIcon.removeClass("icon_speaker_mute");
                                        volIcon.addClass("icon_speaker");
                                    } else {
                                        volIcon.removeClass("icon_speaker");
                                        volIcon.addClass("icon_speaker_mute");
                                    }

                                    if (correctStreams) {
                                        console.log(correctStreams);
                                        var subscribers = _this.session.getSubscribersForStream(correctStreams);
                                        if (subscribers) {
                                            subscribers[0].setAudioVolume(volumn * 10);
                                        }
                                    }

                                });
                            }
                        });

                    }, 700);

                }
            }.bind(this));
            this.trigger("change", { field: "isStethoscopeAudio" });
            this.trigger("change", { field: "canShowSCope" });
            this.trigger("change", { field: "countSScope" });
            this.trigger("change", { field: "stethoscopes" });
            this.trigger("change", { field: "isPhysicianOrListenStethoscope" });
            this.trigger("change", { field: "isStethoscopeAvailable" });
            var fist = $('.consult-settings__circle-btn').first();
            if (fist.length > 0) {
                fist.parent().addClass('is-active');
                this.selectedStethoscopeId = fist.data('id');
                this.syncStethoscopeIcon();
            }
            $('.consult-settings__circle-btn').off('click').on('click', function () {
                $(this).parent().toggleClass('is-active');
                $('.consult-settings__circle-btn').parent().removeClass("is-active");
                $(this).parent().addClass('is-active');
                _this.selectedStethoscopeId = $(this).data('id');
                _this.syncStethoscopeIcon();
            });
        }
    };
    tokboxViewModel.prototype.syncStethoscopeIcon = function () {
        this.session.signal({ type: 'getPrimaryChannelStatus', data: JSON.stringify({ id: this.selectedStethoscopeId }) });
    };
    tokboxViewModel.prototype.listenToStethoscope = function () {
        if (OT.sessions.where().length == 0) {
            return false;
        }
        var session = OT.sessions.find(function (item) {
            return item.currentState === 'connected';
        });
        var selectedStream = session.streams.find(function (item) {
            return item.name.indexOf(this.selectedStethoscopeId) >= 0;
        }.bind(this));
        if (selectedStream) {
            var subscribers = session.getSubscribersForStream(selectedStream);
            if (subscribers && subscribers.length > 0) {
                var subInfo = subscribers[0];
                this.scopeActive = !this.scopeActive;
                this.scopeUnActive = !this.scopeUnActive;
                this.trigger("change", { field: "scopeActive" });
                this.trigger("change", { field: "scopeUnActive" });
                subInfo.subscribeToAudio(this.scopeActive);
            }
        }

    };
    tokboxViewModel.prototype.listenToPrimary = function () {
        this.session.signal({ type: 'listenToPrimary', data: JSON.stringify({ listen: !this.primaryActive, id: this.selectedStethoscopeId }) }, function (error_info) {
            if (!error_info) {
                this.set("primaryActive", !this.primaryActive);
                this.set("primaryInActive", !this.primaryInActive);
            }
        }.bind(this));

    };
    tokboxViewModel.prototype.setPatientAudioListener = function (listen, pubSub) {
        if (!listen && pubSub && pubSub.stream) {
            this.session.unsubscribe(pubSub.stream);
        }
    }
    tokboxViewModel.prototype.onAudioStethoscopesChange = function () {
        if (this.selectedStethoscopesAudioSource !== null) {
            if (this.patientAudioPublisher) {
                this.session.unpublish(this.patientAudioPublisher);
            }
            setTimeout(function () {
                this.publishStethoscope(this.selectedStethoscopesAudioSource.value);
            }.bind(this), 300);
        }
    };
    tokboxViewModel.prototype.onStethoscopesAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    tokboxViewModel.prototype.isCustomerOrGuest = function () {
        return (this.screenType === this.screenTypes.patient || this.screenType === this.screenTypes.guest);
    };
    tokboxViewModel.prototype.canShowSCope = function () {
        return this.stethoscopes.length > 1;
    }
    tokboxViewModel.prototype.countSScope = function () {
        return this.stethoscopes.length;
    }
    //#endregion

    snap.namespace("snap.shared").use(["snapNotification", "snapHttp", "snapLoader",
        "eventaggregator", "snap.tokbox.TokboxTest", "snap.UI.LayoutManager", "deviceapi", "snap.hub.mainHub", "snap.hub.ConsultationHub",
        "snap.enums.ParticipantStatusCodes", "snap.enums.screenTypes",
        "snap.shared.consultationParticipants.consultationParticipantsPanel",
        "snap.shared.consultationParticipants.participantsService"])
        .extend(kendo.observable)
        .define("TokboxViewModel", tokboxViewModel).singleton(); //make it singleton because we only need 1 instance no matter to share the same sesssion
}(jQuery, snap, kendo, window));










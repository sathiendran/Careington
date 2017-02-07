/// <reference path="../../jquery-2.1.3.js" />
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
                $def.resolve(audioList)

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
                $def.resolve(cameraList)

            });
            return $def.promise();
        };

    });




    snap.namespace("snap.control").use(["snapNotification", "snapHttp", "snapLoader",
        "eventaggregator", "snap.tokbox.TokboxSession",
        "snap.tokbox.TokboxPublisher", "snap.tokbox.TokboxSubscriber",
        "snap.tokbox.TokboxScreenPublisher",
        "snap.tokbox.TokboxScreenSubscriber",
        "snap.UI.LayoutManager", "snap.tokbox.TokboxTest", "deviceapi", "snap.hub.ConsultationHub"])
        .extend(kendo.observable)
        .define("TokBoxVideoViewModel", function ($snapNotification, $snapHttp, $snapLoader,
            $eventaggregator, $tokboxSession, $tokboxPublisher, $tokboxSubscriber, $tokboxScreenPublisher,
            $tokboxScreenSubscriber, $layoutManager, $tokboxTest, $deviceapi, $consultationHub) {

            var $scope = this;


            var sesstionInformation = null, session;
            var isPatientInMobileDevice = false;

            var $subscriberCollection = [];

            this.bandwidthText = "0 kbps";
            this.availableCameraList = [];
            this.availableAudioList = [];
            this.clientconnected = false;
            this.publisherready = false;
            this.isCamera = true;
            this.isScreenInitilize = false;
            this.isShare = false;
            this.isShareScreen = false;
            this.isStarted = false;
            this.patientInformation = null;
            this.physicianInformation = null;
            // #8875
            //this.consultButtonTitle = "Start Consult";
            this.consultButtonTitle = "";
            this.customerSafeDisconnect = false;
            this.activeSetting = false;
            this.activeShare = false;
            this.activeParticipants = false;
            this.activeImages = false;

            this.patientInformation = null;
            this.hasVideoInititlized = false;
            this.hasVideoInititlizedError = false;
            this.videoDisconnected = false;
            this.patientJoin = false;
            this.clinicianDetails = false;
            this.sessionTime = "00:00";
            this.fullScreen = false;
            this.isSelfView = true;
            this.isShowMobileVideoControl = false;
            this.showSidePanel = false;
            this.infoPanel = false;

            this.selectedVideoSource = null;
            this.selectedAudioSource = null;
            this.isMute = false;
            this.isPhysicianReady = false;
            this.isVideoMute = false;
            this.isVideoBtn = false;
            this.isMicrophoneBtn = false;
            this.isMuteBtn = false;

            var isVideoBeta = false;
            /* Annotation  */
            var toolbar;
            var palette = [
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
            var initAnnotationSubscriber = function (_subscriber) {

                var pubEli = $("#pluginPlaceholder").find(".OT_subscriber")[0];
                var canvas = new OTSolution.Annotations({
                    feed: _subscriber,
                    container: pubEli
                });
                toolbar.addCanvas(canvas);

            };

            var initAnnotationPublisher = function (_publisher) {
                var pubEli = $("#pluginPlaceholder").find(".OT_publisher")[0];
                var canvas = new OTSolution.Annotations({
                    feed: _publisher,
                    container: pubEli
                });
                toolbar.addCanvas(canvas);

                setTimeout(function () {
                    var width = _publisher.videoWidth();
                    var height = _publisher.videoHeight();

                    $("#opentok_canvas").width(width);
                    $("#opentok_canvas").height(height);
                    $("#opentok_canvas").attr("width", width + "px");
                    $("#opentok_canvas").attr("height", height + "px");

                }, 5000);
                canvas.onScreenCapture($scope.onScreenCapture);
            };

            var initAnnotation = function (_session) {
                toolbar = new OTSolution.Annotations.Toolbar({
                    session: _session,
                    container: document.getElementById('toolbar'),
                    colors: palette,
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

            var isOnline;
            var connectionFailedCheckerInterval = null;
            var detectAndReconnct = function () {
                if (!connectionFailedCheckerInterval) {
                    connectionFailedCheckerInterval = setInterval(function () {
                        var el = $("#pluginPlaceholder").children();
                        if (el.length == 0 || el.length == 1) {
                            if ($scope.isStarted) {
                                if (connectionFailedCheckerInterval) {
                                    clearInterval(connectionFailedCheckerInterval);
                                    connectionFailedCheckerInterval = null;
                                }
                                startNewSession();
                            }
                        }
                        el = $(".OT_subscriber_error").children();
                        if (el.length > 0) {
                            if (connectionFailedCheckerInterval) {
                                clearInterval(connectionFailedCheckerInterval);
                                connectionFailedCheckerInterval = null;
                            }
                            startNewSession();
                        }
                    }, 8000);
                }
            };

            var initTokboxEvent = function () {

                $tokboxSession.on("sessionDisconnected", function (reason) {
                    if (reason && reason === "networkDisconnected") {
                        detectAndReconnct();
                    }

                });
                $tokboxSession.on("otError", function () {
                    detectAndReconnct();
                });

                $tokboxSession.on("streamAdded", function (event) {
                    snap.reconnectInterVal = null;
                    addVideoEl(event);
                    $scope.set("videoDisconnected", false);
                });
                $tokboxSession.on("connectionCreated", function (stream) {

                    if (stream.connectionId === $scope.session.connection.connectionId) {
                        return;
                    }
                    $scope.set("isPhysicianReady", $scope.screenType == 1 && $scope.hasVideoInititlized);
                    $scope.set("videoDisconnected", false);
                    $eventaggregator.published("clientconnected", true);
                });

                $tokboxSession.on("removed", function (ee) {
                    $layoutManager.refreshLayout();
                    if (ee && (ee.destroyedReason == "clientDisconnected" || ee.destroyedReason == "networkDisconnected")) {
                        return;
                    }

                });

                $tokboxPublisher.received("signal:all", function (_data) {
                    var msg = _data.data;
                    if (msg === "droppedconsultation" && $scope.screenType == 3) {
                        $snapNotification.info("It seems we’ve been disconnected.");
                        setTimeout(function () {
                            location.href = "/Public/#/joindisconnect";
                        }, 1000);
                    }
                });

                $tokboxPublisher.received("signal:guest", function (_data) {
                    if ($scope.screenType == 3) {
                        var participantId = _data.data;
                        var currentParticipant = sessionStorage.getItem("participantId");
                        if (participantId == currentParticipant) {
                            $snapNotification.info("you are remove from consultation.");
                            setTimeout(function () {
                                //TODO: Make it as separate service, because no reason to bring all guestjoin.viewmodel.js which makes another UI work also;
                                var url = "/api/v2/patients/consultations/participants/" + participantId + "/invitation";
                                $.ajax({
                                    url: url,
                                    type: "DELETE",
                                    headers: {
                                        'Authorization': 'JWT-Participant ' + $scope.joinToken,
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
                        $layoutManager.refreshLayout();
                    }, 2000);

                });
                $tokboxPublisher.received("signal:patient", function (_data) {
                    if ($scope.screenType == 1) {
                        if (_data.data === "disconnect") {
                            snap.customerSafeDisconnect = true;
                            $snapNotification.info("Customer left the room. Now you can disconnect from the Consultation.");
                            $layoutManager.refreshLayout();

                        }

                    }
                    else if ($scope.screenType == 3) {
                        if (_data.data === "disconnect") {
                            snap.customerSafeDisconnect = true;
                            $snapNotification.info("Customer left the room.");
                            $layoutManager.refreshLayout();

                        }
                        
                    }
                    var patientInfo = {};
                    patientInfo.fullName = "";
                    patientInfo.ageGender = "";
                    patientInfo.profileImagePath = "";
                    patientInfo.patientName = "";
                    patientInfo.lastName = "";
                    $scope.set("patientInformation", patientInfo);
                });



                $tokboxPublisher.on("accessDenied", function () {
                    $("#resultInfo").addClass("red").find(".details")
                        .html("Permission is denied to access the camera. Please change permission setting for camera access").end()
                        .find(".progress").html("100%");
                    if ($tokboxPublisher.publisher && $tokboxPublisher.publisher.id) {
                        var elId = $tokboxPublisher.publisher.id;
                        $("#" + elId).remove();
                    }
                    $layoutManager.refreshLayout();
                });
                $tokboxScreenPublisher.on("mediaStopped", function () {

                    if (isPatientInMobileDevice) {
                        setTimeout(function () {
                            //re-e
                            if ($tokboxPublisher && $tokboxPublisher.publisher) {
                                $tokboxPublisher.publisher.publishVideo(true);
                            }
                        }, 2000);

                    }
                    if ($tokboxScreenPublisher.publisher && $tokboxScreenPublisher.publisher.id) {
                        var elId = $tokboxScreenPublisher.publisher.id;
                        $("#" + elId).remove();
                        $tokboxScreenPublisher.publisher = null;
                    }
                    $layoutManager.refreshLayout();

                    $scope.set("isShareScreen", false);
                });
                $tokboxScreenPublisher.on("accessAllowed", function () {
                    $layoutManager.refreshLayout();

                });
                $tokboxPublisher.on("accessAllowed", function () {
                    $(".networktest").hide();
                });

                $tokboxPublisher.on("otPublisherError", function () {
                    if (isPatientInMobileDevice) {
                        setTimeout(function () {
                            if ($tokboxPublisher && $tokboxPublisher.publisher) {
                                $tokboxPublisher.publisher.publishVideo(true);
                            }
                        }, 2000);
                    }
                    return;
                });

                $tokboxScreenPublisher.on("accessDenied", function (flag) {
                    //screenshare addon installed error wont get hit here goes to tokboxmodule.js
                    if (flag && flag.target) {
                        $("#" + flag.target.id).remove();
                    }

                });
            };
            var initSubscriberEvent = function (sub) {
               

                sub.on("videoDisabled", function (event) {
                    var subscribers = $tokboxSession.session.getSubscribersForStream(event.target.stream);
                    if (subscribers && subscribers.length > 0) {
                        var streamId = subscribers[0].id;
                        var streamDivId = "#" + streamId;
                        var mainEL = $(streamDivId);
                        var img = mainEL.find("img");
                      
                        if (img && img.length == 0) {
                            img = $("<img />");
                            var userimage = mainEL.find(".userimage").html();

                            var imgContainer = $("<div />");
                            imgContainer.addClass("userpic userpic--is-consult-no-video");
                            imgContainer.append(img);
                            mainEL.find(".OT_video-poster").append(imgContainer);
                            img.attr("src", userimage);
                        }
                        
                        // var reasonTextEl = $("<txt />");
                        // reasonTextEl.html(reasonText);
                        // var audioOnlyText = $("<div />");
                        // audioOnlyText.html("Audio Only");

                        // txt.addClass("audio-only-text");
                        // txt.append(audioOnlyText);
                        // txt.append(reasonTextEl);
                       
                        // $(streamId).each(function(){
                        //     if($(this).attr('id') == streamId){
                        //         $(this).find(".OT_video-poster .userpic--is-consult-no-video").remove();
                        //         $(this).find(".OT_video-poster").append(imgContainer);
                        //     } 
                        // });
                        // $("#pluginPlaceholder").find(".userpic--is-consult-no-video").remove();
                        // $("#pluginPlaceholder").find(".audio-only-text").remove();
                        // $("#pluginPlaceholder").append(imgContainer);
                        // $("#pluginPlaceholder").append(txt);
                        // setTimeout(function () {
                        //     $('.audio-only').svgInject();
                        // }, 200);
                    }

                });
                sub.on("videoEnabled", function (event) {
                    var streamId = event.target.id;
                    $('.OT_root').each(function(){
                        if($(this).attr('id') == streamId){
                            $(this).find(".OT_video-poster").html("");
                        } 
                    });
                    // $("#pluginPlaceholder").find(".audio-only-text").remove();
                });
            }

            var connectSubscriber = function (stream, isAudioOnly) {
                var _stream = stream;
                var elInfo = null;
                if (_stream.videoType == 'camera') {
                    var props = {
                        showControls: true,
                        subscribeToVideo: true,
                        subscribeToAudio: true,
                        width: '120px',
                        height: '120px'
                    };
                    if (isAudioOnly) {
                        props.subscribeToVideo = false;
                    }
                    var subs = new snap.tokbox.TokboxSubscriber();
                    subs.on("otSubscriberDone", function () {
                        $(".OT_root").removeClass("OT_Full");
                        var subsId = subs.subscriber.id;
                        elInfo = $("#" + subsId);
                        elInfo.addClass("OT_Full");
                        elInfo.find(".OT_widget-container").attr("id", _stream.id);
                        $scope.set("clientconnected", true);
                        initSubscriberEvent(subs);
                        if (subs.subscriber) {

                            subs.subscriber.setStyle('videoDisabledDisplayMode', 'on');
                            
                            initAnnotationSubscriber(subs.subscriber);
                        }
                        $subscriberCollection.push(subs);

                    });
                    subs.init(_stream, 'pluginPlaceholder', props);



                } else {
                    $(".OT_root").removeClass("OT_Full");
                    $tokboxScreenSubscriber.init(_stream, 'pluginPlaceholder', {
                        showControls: true,
                        width: '120px',
                        height: '120px'
                    });
                    subsId = $tokboxScreenSubscriber.subscriber.id;
                    elInfo = $("#" + subsId);
                    elInfo.addClass("OT_Full");
                    elInfo.find(".OT_widget-container").attr("id", _stream.id);

                }



            };

            var addVideoEl = function (eventInfo) {

                $scope.isStarted = true;
                $subscriberCollection = [];
                var subs = $tokboxSession.session.getSubscribersForStream(eventInfo.stream);
                if (subs.length === 0) {
                    connectSubscriber(eventInfo.stream);
                    $layoutManager.refreshLayout();
                }
            };

            var refreshScrollView = function () {
                $scope.trigger("change", { field: "snapImageCollection" });

            };

            var imagePopup = $("#image-window");
            var template = kendo.template($("#image-window-template").html());

            imagePopup.kendoWindow({
                modal: true, 
                visible: false
            });


            var addSnapImage = function (imgId, croppedImgSrc, fullImgSrc) {
                var closeImage = function() {
                    imagePopup.data("kendoWindow").close();
                };

                var obj = {
                    imgsrc: croppedImgSrc,
                    fullImgSrc: fullImgSrc,
                    imgId: imgId,
                    closeSnapImage: function () {
                        var array = $scope.snapImageCollection;
                        for (var i = array.length - 1; i >= 0; i--) {
                            if (array[i].uid === this.uid) {
                                ; (function (_index, imgId) {
                                    var _url = [snap.baseUrl, "/api/v2/consultations/", $scope.consultationInfo.consultationId, "/snapshots/", imgId].join("");
                                    $.ajax({
                                        url: _url,
                                        type: 'DELETE'
                                    }).fail(function () {
                                        $snapNotification.error("There is problem deleting snapshot.Please try again");
                                    }).then(function () {
                                        $('.snap-img-item:eq('+ _index +')').addClass('is-closing');

                                        setTimeout(function(){
                                            array.splice(_index, 1);
                                            refreshScrollView();
                                            $consultationHub.removeCaptureImage(imgId);                                            
                                        }, 1000)
                                    });
                                }(i, this.imgId));

                            }
                        }

                    },
                    viewImage: function() {
                        imagePopup.data("kendoWindow")
                            .content(template( { imgsrc: fullImgSrc } ))
                            .center().open();

                        imagePopup.find(".image-window-close")
                            .click(function () {
                                imagePopup.data("kendoWindow").close();
                            });
                    }
                };

                $scope.snapImageCollection.push(obj);
                refreshScrollView();
                $('.OT_root').each(function () {
                    $(this).addClass('is-active');
                });

                $scope.set("openSnapImageHolder", true);
                $scope.set("activeImages", true);
            };

            var initConsultationHub = function () {
                $consultationHub.on("onImageReceived", function (imageId) {
                    var _url = [snap.baseUrl, "/api/v2/consultations/", $scope.consultationInfo.consultationId, "/snapshots/", imageId, "?thumbnail=true"].join("");
                    $snapHttp.get(_url).then(function (data) {
                        data = data.data;
                        $.each(data, function (i, e) {
                            addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
                        });
                    });

                });
                $consultationHub.on("onImageRemoved", function (imgId) {
                    var array = $scope.snapImageCollection;
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (array[i].imgId === imgId) {
                            array.splice(i, 1);
                        }
                    }
                    refreshScrollView();

                });
            }

            var startTokboxConection = function () {
                var $def = $.Deferred();
                $tokboxSession.init(sesstionInformation.apiKey, sesstionInformation.sessionId, sesstionInformation.token, function (err, session) {
                    if (err) {
                        $def.reject();
                        return;
                    }
                    $scope.session = session;
                    var connectDisconnect = function (connected) {
                        $scope.connected = connected;
                        if (!connected) {
                            $scope.publishing = false;
                        }
                    };
                    if ((session.is && session.is('connected')) || session.connected) {
                        connectDisconnect(true);
                    }
                    initAnnotation(session);
                    initTokboxEvent();
                    initConsultationHub();
                    $scope.loadSnapImages();
                    var name = "<span>" + $scope.getName() + "<span class='userimage' style='display:none;'>" + snap.profileSession.profileImage + "</span></span>";

                    var defaultProp = {
                        name:name,
                        id: snap.profileSession.userId,
                        showControls: true,
                        width: '120px',
                        height: '120px'
                    };
                    $tokboxPublisher.init('pluginPlaceholder', defaultProp);
                    initAnnotationPublisher($tokboxPublisher.publisher);
                    var subsId = $tokboxPublisher.publisher.id;
                    var elInfo = $("#" + subsId);
                    elInfo.addClass("OT_Full");
                    $scope.set("hasVideoInititlized", true);
                    $def.resolve();

                });
                return $def.promise();
            };
            var startNewSession = function () {
                $(".pluginPlaceholder").html("");
                if ($tokboxSession.session) {
                    if ($tokboxPublisher.publisher) {
                        $tokboxSession.session.unpublish($tokboxPublisher.publisher);
                        $tokboxPublisher.publisher = null;
                    }
                    $tokboxSession.session.disconnect();
                    $tokboxSession.clearEvents();
                    $tokboxPublisher.clearEvents();
                    setTimeout(function () {
                        startTokboxConection();
                    }, 500);
                }

            };
            window.addEventListener('online', function () {
                isOnline = true;
                startNewSession();
            });
            window.addEventListener('offline', function () {
                $snapNotification.info("Internet connection lost.  Will wait for re-connection......");
                isOnline = false;

            });



            var showFullScreen = function (element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
            var timerInterval = null;
            var startTimer = function (hrs, min, sec) {
                min = min || 0;
                sec = sec || 0;
                hrs = hrs || 0;
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                timerInterval = setInterval(function () {
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
                        $scope.set("sessionTime", minStr + ":" + secStr);
                    } else {
                        $scope.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
                    }
                }, 1000);
              

            };

           
            this.getProfileInfo = function(){
                var profileInfo;

                if (this.screenType == 1) {
                    profileInfo = sessionStorage.getItem("snap_staffprofile_session");

                    if (profileInfo) {
                        profileInfo = JSON.parse(profileInfo);

                        return profileInfo;
                    }
                    return "";
                }
                else if (this.screenType == 2) {

                    profileInfo = sessionStorage.getItem("snap_patientprofile_session");

                    if (profileInfo) {
                        profileInfo = JSON.parse(profileInfo);

                        return profileInfo;
                    }
                    return "";
                } else {
                    profileInfo = sessionStorage.getItem("participantName");
                    if (profileInfo) {
                        return profileInfo;

                    }
                }
            };

            this.getName = function(){
                var profileInfo = this.getProfileInfo();

                if (profileInfo) {
                    return profileInfo.fullName;
                }

                return "";
            };

            this.getUserImg = function () {
               
                var profileInfo = this.getProfileInfo();

                if (profileInfo) {
                    return profileInfo.profileImage;
                }

                return "";
            };

            // this.getName = function () {
            //     var profileInfo;

            //     if (this.screenType == 1) {
            //         profileInfo = sessionStorage.getItem("snap_staffprofile_session");
            //         console.log("profileInfo1: " + profileInfo);
            //         if (profileInfo) {
            //             profileInfo = JSON.parse(profileInfo);
            //             if (profileInfo) {
            //                 return profileInfo.fullName;
            //             }
            //         }
            //         return "";
            //     }
            //     else if (this.screenType == 2) {

            //         profileInfo = sessionStorage.getItem("snap_patientprofile_session");
            //         console.log("profileInfo2: " + profileInfo);
            //         if (profileInfo) {
            //             profileInfo = JSON.parse(profileInfo);
            //             if (profileInfo) {
            //                 return profileInfo.fullName;
            //             }
            //         }
            //         return "";
            //     } else {
            //         profileInfo = sessionStorage.getItem("participantName");
            //         if (profileInfo) {
            //             return profileInfo;

            //         }
            //     }
            // }

            this.startSession = function (e) {

                startTimer();
                e.preventDefault();
                if (this.screenType == 1) {
                    var $clinicianPage = new snap.physician.PhysicianAppointmentViewModel();
                    if ($scope.isStarted) {
                        $clinicianPage.endSession();
                    } else {
                        $clinicianPage.startSession().then(function () {
                            $scope.set("isStarted", true);
                            $scope.set("consultButtonTitle", "End Consult");
                            snap.clinician.ClinicianHeaderViewModel().set("isStarted", true);
                            $scope.set("isVideoBtn", true);
                            $scope.set("isMicrophoneBtn", true);
                            $scope.set("isMuteBtn", true);
                        });
                    }
                }
                else if (this.screenType == 2) {


                    snapConfirm("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?");
                    $("#btnConfirmYes").click(function () {
                        $tokboxPublisher.send({
                            data: "disconnect",
                            type: "patient"
                        }, function () {
                            sessionStorage.removeItem("snap_consultation_session");
                            $eventaggregator.published("patientDisconnect", {});


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

            this.setPatientConnectedDevice = function (flag) {

                isPatientInMobileDevice = flag;
            };
            this.isUnMute = function () {
                return !this.isMute;
            };
            this.loadSnapImages = function () {
                var _url = [snap.baseUrl, "/api/v2/consultations/", $scope.consultationInfo.consultationId, "/snapshots", "?thumbnail=true"].join("");
                $snapHttp.get(_url).then(function (data) {
                    data = data.data;
                    $.each(data, function (i, e) {
                        addSnapImage(e.snapshotFileId, e.snapshotDataUrl, e.originalDataUrl);
                    });
                });
            };
            this.onScreenCapture = function (img) {
                var _url = [snap.baseUrl, "/api/v2/consultations/", $scope.consultationInfo.consultationId, "/snapshots"].join("");
                $snapNotification.info("Screenshot has been captured");
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
                    addSnapImage(result.snapshotFileId, img, img);
                    $consultationHub.notifyCaptureImage(result.snapshotFileId);

                }).fail(function () {
                    $snapNotification.error("There is problem uploading the  snapshot.Please try again");
                });


            }

            this.snapImageCollection = new kendo.data.ObservableArray([]);


            this.onFullScreen = function () {
                showFullScreen(document.getElementById("pluginPlaceholder"));
            };

            this.removeImage = function () {
            };

            this.scrollerMove = 0;
            this.snapImagePrev = function (e) {
                e.preventDefault();

                this.set("scrollerMove", this.scrollerMove - 30)
                this.moveScroller();
            };

            this.snapImageNext = function (e) {
                e.preventDefault();

                this.set("scrollerMove", this.scrollerMove + 30)
                this.moveScroller();
            };

            this.moveScroller = function () {
                var scrollerMoveAmount = this.scrollerMove,
                    scroller = $("#snapImageholder").data("kendoMobileScroller");

                scroller.animatedScrollTo(scrollerMoveAmount, 0);

            };



            //Start Session Information
            this.setSessionInformation = function (data) {
                $("#snapImageholder").kendoMobileScroller({
                    contentHeight: "84px;"
                });

                $layoutManager.initElement($("#pluginPlaceholder"));
                sesstionInformation = data;
                $tokboxTest.setSessionId(data.sessionId);
                $tokboxTest.setToken(data.token);
                $eventaggregator.published("onInitHub", {});


                $tokboxTest.loadConfig().then(function () {
                    $tokboxTest.startTests(function () {
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
                            $deviceapi.getVideoDeviceList().then(function (data) {
                                startTokboxConection(data);
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
                    $deviceapi.getVideoDeviceList().then(function (data) {
                        startTokboxConection(data);
                    });
                });





            };

            this.sendDisconnectInformation = function () {
                $tokboxPublisher.send({
                    data: "droppedconsultation",
                    type: "all"
                });
            };

            this.showSettingTab = function () {
                if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
                    return true;
                }
                return false;
            };
            this.consultationInfo = null;;
            this.setAppointmentData = function (data) {
                data = data[0];
                this.consultationInfo = data.consultationInfo;

                $scope.set("patientInformation", data.patientInformation);
                $(".profileImageInfo").attr('src', data.patientInformation.profileImagePath);

            };
            this.setPhysicianData = function (data) {
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
                }ж

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
                data.statesLicenced = parseStatesLicensed(data.statesLicenced);
                $scope.set("physicianInformation", data);
            };
            this.setPatientData = function (data) {
                $scope.set("patientInformation", data);
            };
            this.isMultiParticipantFeatureEnable = false;

            this.isBeta = false;
            this.setBetaParameter = function (isEnable) {
                $scope.set("isBeta", isEnable);
                isVideoBeta = isEnable && this.screenType == 1;
                $scope.set("isMultiParticipantFeatureEnable", true);
            };
            this.isCustomerOrGuest = function () {
                return (this.screenType == 2 || this.screenType == 3);
            }
            this.isCustomerOrPhysician = function () {
                return (this.screenType == 2 || this.screenType == 1);
            }
            this.participants = new kendo.data.ObservableArray([]);
            this.setParticipants = function (participants) {

                if (participants && $.isArray(participants)) {
                    $scope.set("hasParticipants", true);
                    $scope.set("participants", participants);

                    $(".patient-invite__close").off("click").on("click", function () {
                        var id = $(this).data("id");
                        var that = this;
                        if (id) {
                            snapConfirm("Are you sure you want to disconnect the selected guest?");
                            $("#btnConfirmYes").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                                $tokboxPublisher.send({
                                    data: id,
                                    type: "guest"
                                }, function () {
                                    $(that).parent().remove();
                                    setTimeout(function () {
                                        $layoutManager.refreshLayout();
                                    }, 2000);
                                });
                            });
                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                            });

                        }

                    });
                    $scope.trigger("change", { field: "isCustomerOrPhysician" });

                    //  
                }
            }
            this.addParticipants = function () {
                var path = '/api/v2/patients/consultations/' + this.consultationInfo.consultationId + '/participants';
                return $snapHttp.ajax({
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
            this.sendInvitationEmail = function () {
                var path = '/api/v2/mail/participants/' + this.participantId;
                return $snapHttp.ajax({
                    url: path,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        email: this.invitationEmail,
                        name: this.getName()
                    })
                });
            }
            this.participantId = null;
            this.sendInvitation = function (e) {
                var button = $(e.currentTarget);
                e.preventDefault();

                if (snap.consultationSession.physicianCompleteSoapNotes) {
                    $snapNotification.error("You can't invite guests to the dropped consultation.");
                    button.removeClass('button__green is-loading').addClass('button__red error');
                    return;
                }
                if (this.invitationEmail === "") {
                    $snapNotification.info("Please enter email.");
                    return;
                }
                if (snap.regExMail.test(this.invitationEmail)) {
                    if ($scope.isStarted) {

                        if (button.hasClass('error')) {
                            button.removeClass('button__red error').addClass('button__green is-loading');
                        } else {
                            button.addClass('is-loading');
                        }

                        e.preventDefault();
                        var path = '/v2/patients/consultations/' + this.consultationInfo.consultationId + '/participants';

                        this.addParticipants().then(function (response) {
                            var data = response.data[0];
                            $scope.participantId = data.participantId;
                            sessionStorage.setItem("participantId", data.participantId);
                            sessionStorage.setItem("personId", data.personId);
                            $scope.sendInvitationEmail(data.participantId).then(function (result) {
                                if (result == "Success") {
                                    $scope.set("invitationEmail", "");
                                }
                                $snapNotification.info("Invitation successfully sent.");
                                button.removeClass('is-loading');
                                $('.patient-invite__invite-guests').removeClass('is-active');
                                $('.patient-invite__container').removeClass('is-active');
                            }).fail(function () {
                                $snapNotification.error("There is problem sending invitation");
                                button.removeClass('button__green is-loading').addClass('button__red error');
                            });
                        });

                    } else {
                        $snapNotification.info("Please start this consultation in order to access this feature.");
                    }
                } else {
                    $snapNotification.info("Email is not valid.");
                }
            };
            this.invitationEmail = "";

            this.hasParticipants = function () {
                return false;
            }
            this.showClinicianDetails = function () {
                $scope.set("clinicianDetails", true);
            };
            this.hideClinicianDetails = function () {

                $scope.set("clinicianDetails", false);
            };
            this.openSnapImageHolder = false;
            this.showSnapImageHolder = function () {

                $('.OT_root').each(function () {
                    $(this).toggleClass('is-active');
                });
                this.set("activeImages", !this.activeImages);
                this.set("openSnapImageHolder", !this.openSnapImageHolder);
            }

            this.isKubiVisible = false;
            this.showKubiPad = function (flag) {
                $scope.set("isKubiVisible", flag);
                if (flag && $kubiControl) {

                    $kubiControl.bindViewModel();
                }

            };

            this.initKubi = function () {
                var $def = $.Deferred();

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
                return $def.promise();
            };
            this.showKubiWindow = function () {
                $kubiControl.showKubiWindow();
            };

            this.onStartConsultation = function () {
              
            };

            this.physicianEmailLink = function () {

                var phy = this.get("physicianInformation");
                if (!phy) {
                    return "";
                }
                return ["mailto:", this.get("physicianInformation").email].join("");
            };
            this.isPatientInfoInVisible = function () {
         
                return ((this.get("patientInformation") && this.get("patientInformation").patientName && $.trim(this.get("patientInformation").patientName) !== "")? false : true);
            };
            this.toggleScreen = function () {

                if ($scope.isStarted) {
                    if ($tokboxScreenPublisher.isActive()) {
                        var screenPublisherId = "";
                        if ($tokboxScreenPublisher.publisher && $tokboxScreenPublisher.publisher.id) {
                            screenPublisherId = $tokboxScreenPublisher.publisher.id;
                        }
                        $tokboxScreenPublisher.stopSharing();

                        $("#" + screenPublisherId).remove();
                        if (isPatientInMobileDevice) {
                            $layoutManager.refreshLayout();
                        }

                        $scope.set("isShareScreen", false);
                    } else {
                        if ($tokboxScreenPublisher && $tokboxScreenPublisher.publisher) {
                            if ($tokboxScreenPublisher.publisher['id']) {
                                var elId = $tokboxScreenPublisher.publisher.id;
                                $("#" + elId).remove();
                                $tokboxScreenPublisher.publisher = null;
                            }
                        }
                        $tokboxScreenPublisher.init('pluginPlaceholder', {
                            name: "Screen Share By : " + $scope.getName(),
                            showControls: true,
                            width: '120px',
                            height: '120px'
                        });

                        $layoutManager.refreshLayout();

                        $scope.set("isShareScreen", true);
                    }
                } else {
                    $snapNotification.info("Please wait. Screen sharing is not available.");
                }
            };
            this.isMuteMicrophone = false;
            this.isUnMuteMicrophone = function () {
                return !this.isMuteMicrophone;
            };
            this.muteMicrophone = function () {
                if (this.isMuteMicrophone) {
                    $tokboxPublisher.publisher.publishAudio(true);
                } else {
                    $tokboxPublisher.publisher.publishAudio(false);
                }
                $scope.set("isMuteMicrophone", !this.isMuteMicrophone);
                $scope.set("isMicrophoneBtn", !this.isMicrophoneBtn);

            };



            this.isVideoUnMute = function () {
                return !this.isVideoMute;
            };
            this.muteVideo = function () {
                if ($tokboxPublisher.publisher == null || $tokboxPublisher.publisher == undefined) {
                    var name = "<span>" + $scope.getName() + "<span class='userimage' style='display:none;'>" + snap.profileSession.profileImage + "</span></span>";

                    $tokboxPublisher.init('pluginPlaceholder', {
                        name: name,
                        showControls: true,
                        width: 120,
                        height: 120
                    });
                    $layoutManager.refreshLayout();
                    return;
                }


                $scope.set("isVideoMute", !this.isVideoMute);
                $scope.set("isVideoBtn", !this.isVideoBtn);
                if (this.isVideoMute) {
                    $tokboxPublisher.publishVideo(false);

                } else {
                    $tokboxPublisher.publishVideo(true);

                    $layoutManager.refreshLayout();
                    $scope.set("hasVideoInititlized", true);
                    $scope.trigger("change", { field: "isVideoUnMute" });
                }

            };



            this.startTimer = function (hour, min, sec) {
                startTimer(hour, min, sec);
            };

            this.showSelfView = function () {

                if ($scope.clientconnected) {
                    if ($tokboxPublisher.publisher && $tokboxPublisher.publisher.id) {
                        var id = "#" + $tokboxPublisher.publisher.id;
                        $(id).toggle();
                        $scope.set("isSelfView", !this.isSelfView);
                    }
                    $scope.trigger("change", { field: "isSelfView" });
                }
            };
            this.updateSelfView = function (pubid) {
                if ($tokboxPublisher.publisher && $tokboxPublisher.publisher.id == pubid) {
                    $scope.set("isSelfView", true);
                } else {
                    $scope.set("isSelfView", false);
                }
                $scope.trigger("change", { field: "isSelfView" });
            };

            this.muteVoice = function () {
                if ($scope.clientconnected) {
                    $scope.set("isMute", !this.isMute);
                    $scope.set("isMuteBtn", !this.isMuteBtn);
                    $.each($subscriberCollection, function () {
                        if ($scope.isMute) {
                            this.subscriber.subscribeToAudio(false);

                        } else {
                            this.subscriber.subscribeToAudio(true);

                        }
                    });

                }
            };


            this.screenType = 1;// 1=physician 2=Patient


            $eventaggregator.subscriber("ondisconnect", function () {
                if (session) {
                    session.disconnect();
                }
            });
            this.disconnect = function () {
                snapConfirm("You currently have a consultation in progress.\n Are you sure you want to end this consultation?");
                $("#btnConfirmYes").click(function () {
                    $eventaggregator.published("requestdisconnect", {});
                });
                $("#btnConfirmNo").click(function () {
                    $(".k-notification-confirmation").parent().remove();
                });

            };
            var isSubscribed = true;
            this.subscribeToVideo = function () {
                isSubscribed = !isSubscribed;
            };

            this.toggleMobileInfoPanel = function () {
                var infoPanelScope = snap.physician.PatientViewModel();
                infoPanelScope.set('mobileInfoPanel', !infoPanelScope.mobileInfoPanel);
                $scope.set('infoPanel', !$scope.infoPanel);

                if ($scope.isShowMobileVideoControl || $scope.activeParticipants || $scope.activeShare) {
                    $scope.set('isShowMobileVideoControl', false);
                    $scope.set('activeParticipants', false);
                    $scope.set('activeShare', false);

                }
            };

            this.showMobileControl = function () {
                $scope.set("isShowMobileVideoControl", !$scope.isShowMobileVideoControl);

                if ($scope.clinicianDetails && $scope.activeParticipants || $scope.activeParticipants) {
                    $scope.set("clinicianDetails", false);
                    $scope.set("activeParticipants", false);
                }
                if ($scope.activeSetting) {
                    $scope.set("activeSetting", false);
                }
                if ($('#patientContainer').hasClass('is-active')) {
                    $('#patientContainer').removeClass('is-active');
                    $scope.set('infoPanel', false);
                }
            }

            this.onVideoChange = function () {

                if ($scope.selectedVideoSource != null) {
                    if ($tokboxPublisher.publisher) {
                        $tokboxPublisher.publisher.destroy();

                    }
                    setTimeout(function () {
                        var name = "<span>" + $scope.getName() + "<span class='userimage' style='display:none;'>" + snap.profileSession.profileImage + "</span></span>";
                        $tokboxPublisher.changePublisher('pluginPlaceholder', {
                            showControls: true,
                            name: name,
                            videoSource: $scope.selectedVideoSource['value'],
                            width: 120,
                            height: 120
                        });
                        $layoutManager.refreshLayout();
                    }, 100);

                }
            };

            this.onAudioChange = function () {

                if ($scope.selectedAudioSource != null) {
                    if ($tokboxPublisher.publisher) {
                        $tokboxPublisher.publisher.destroy();

                    }
                    setTimeout(function () {
                        var name = "<span>" + $scope.getName() + "<span class='userimage' style='display:none;'>" + snap.profileSession.profileImage + "</span></span>";

                        $tokboxPublisher.changePublisher('pluginPlaceholder', {
                            showControls: true,
                            name:name,
                            audioSource: $scope.selectedAudioSource['value'],
                            width: 120,
                            height: 120
                        });
                        $layoutManager.refreshLayout();
                    }, 100);

                }
            };

            //For Device List

            this.videoSourceList = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $deviceapi.getVideoDeviceList().then(function (data) {
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
                        $deviceapi.getAudioDeviceList().then(function (data) {
                            options.success(data);

                        }).fail(function () {
                            options.success([]);
                        });



                    }
                }
            });
            this.onAudioComboOpen = function () {
                setTimeout(function () {
                    $scope.audioSourceList.read();
                }, 200);
            };
            this.onVideoComboOpen = function () {
                setTimeout(function () {
                    $scope.videoSourceList.read();
                }, 200);

            };
            this.setDefaultCamera = function () {
                if ($scope.selectedVideoSource) {
                    localStorage.setItem("defaultCamera", $scope.selectedVideoSource['value']);

                }
            };

            var lastClick = "";
            this.selectVideoTab = function (e) {
                var el = $(e.currentTarget),
                id = el.attr("data-id");
                if (id == "activeSetting") {
                    if (!isChrome) {
                        if ($tokboxPublisher.publisher) {
                            $tokboxSession.session.unpublish($tokboxPublisher.publisher);
                            $tokboxPublisher.publisher.destroy();
                        }
                        setTimeout(function () {
                            var name = "<span>" + $scope.getName() + "<span class='userimage' style='display:none;'>" + snap.profileSession.profileImage + "</span></span>";

                            $tokboxPublisher.changePublisher('pluginPlaceholder', {
                                showControls: false,
                                name: name,
                                width: 120,
                                height: 120
                            });
                            $layoutManager.refreshLayout();
                        }, 100);

                        return;
                    }

                };


                if (id == "activeParticipants") {
                    $scope.set("activeParticipants", !$scope.activeParticipants);
                    $scope.set("activeSetting", false);
                }

                if (id == "activeSetting") {
                    $scope.set("activeSetting", !$scope.activeSetting);
                    $scope.set("activeParticipants", false);
                }

                if (id == "activeShare") {
                    $scope.set("activeShare", !$scope.activeShare);
                }
            };

            $(window).off("click").on("keyup", function (code) {
                if (code && code.keyCode === 27) {
                    if ($scope.fullScreen) {
                        $scope.set("fullScreen", !$scope.fullScreen);
                        $eventaggregator.published("fullscreen", this.fullScreen);
                    }
                }
            });

        }).singleton();


}(jQuery));

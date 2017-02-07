/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />


; (function ($) {


    //need to create module platform js file so that we can inject 
    var isFirefox = false;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        isFirefox = true;
    }

    var screen = 'screen';
    if (isFirefox) {
        screen = "window";
    }

    snap.namespace("snap.tokbox").define("TokboxSession", function () {
        this.streams = [];
        var apiKey = null;
        var token = null;
        this.connections = [];
        this.publishers = [];
        var OTSession = this;

        var eventList = {

        };
        var scope = this;
        this.clearEvents = function () {
            eventList = [];
            scope.publishers = [];
            scope.connections = [];
            scope.streams = [];
        }
        this.on = function (eventName, cb) {

            var eventCbList = eventList[eventName];
            if (!eventCbList) {
                eventCbList = [];
            }
            eventCbList.push(cb);
            eventList[eventName] = eventCbList;
        };
        var triggerEvent = function (name) {

            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
            var eventCbList = eventList[name];
            if (eventCbList) {
                $.each(eventCbList, function () {
                    return this.apply(scope, args);
                });
            }
        };

        this.init = function (_apiKey, sessionId, _token, cb) {
            apiKey = _apiKey;
            token = _token;
            OTSession.session = TB.initSession(sessionId);
            OT.on("exception", function (event) {
                triggerEvent("otError", event);
            });

            OTSession.session.on({
                sessionConnected: function (event) {
                    triggerEvent("sessionConnected", event);
                },
                streamCreated: function (event) {
                    OTSession.streams.push(event.stream);
                    triggerEvent("streamAdded", event);
                },
                streamPropertyChanged: function (event) {
                    triggerEvent("streamPropertyChanged", event);
                },
                streamDestroyed: function (event) {

                    OTSession.streams.splice(OTSession.streams.indexOf(event.stream), 1);
                    triggerEvent("removed", event.stream);

                },
                sessionDisconnected: function (event) {
                    triggerEvent("sessionDisconnected", event);

                },
                connectionCreated: function (event) {
                    OTSession.connections.push(event.connection);
                    triggerEvent("connectionCreated", event.connection);

                },
                connectionDestroyed: function (event) {
                    OTSession.connections.splice(OTSession.connections.indexOf(event.connection), 1);
                    triggerEvent("connectionDestroyed", event);
                }
            });

            this.session.connect(apiKey, token, function (err) {
                if (cb) cb(err, OTSession.session);
            });
        };
    }).singleton();

    snap.namespace("snap.tokbox").use(["snap.tokbox.TokboxSession"]).define("TokboxPublisher", function ($tbSession) {

        var eventList = {

        };
        var el = null;
        var prop = null;
        var scope = this;
        this.publisher = null;
        this.doPublishVideo = true;
        this.clearEvents = function () {
            eventList = [];
        }
        this.on = function (eventName, cb) {

            var eventCbList = eventList[eventName];
            if (!eventCbList) {
                eventCbList = [];
            }
            eventCbList.push(cb);
            eventList[eventName] = eventCbList;
        };
        var triggerEvent = function (name) {

            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
            var eventCbList = eventList[name];
            if (eventCbList) {
                $.each(eventCbList, function () {
                    return this.apply(scope, args);
                });
            }
        };
        this.changePublisher = function (_el, _prop) {
            var $def = $.Deferred();
            el = _el;
            prop = _prop || {

            };

            $.extend(prop, {
                insertMode: 'append',
                mirror: false
            });

            scope.publisher = TB.initPublisher(el, prop);

            scope.publisher.on({
                accessDenied: function (event) {
                    triggerEvent("accessDenied", event);
                },
                accessDialogOpened: function (event) {
                    triggerEvent('accessDialogOpened', event);
                },
                accessDialogClosed: function (event) {
                    triggerEvent('accessDialogClosed', event);
                },
                accessAllowed: function (event) {
                    triggerEvent('accessAllowed', event);
                },
                loaded: function (event) {
                    triggerEvent('loaded', event);
                },
                streamCreated: function (event) {
                    triggerEvent('streamCreated', event);
                },
                streamDestroyed: function (event) {
                    triggerEvent('streamDestroyed', event);
                    triggerEvent('otPublisherError', event, scope.publisher);
                }
            });
            $tbSession.publishers.push(scope.publisher);
            scope.publisher.publishVideo(scope.doPublishVideo);
            if ($tbSession.session && ($tbSession.session.connected ||
                    ($tbSession.session.isConnected && $tbSession.session.isConnected()))) {
                $tbSession.session.publish(scope.publisher, function (err) {
                    if (err) {
                        triggerEvent('otPublisherError', err, scope.publisher);
                        $def.reject(err);

                    } else {
                       
                        $def.resolve();
                    }
                });
            }

            return $def.promise();
        };
        this.publishVideo = function (doPublishVideo) {
            scope.doPublishVideo = doPublishVideo;
            scope.publisher.publishVideo(doPublishVideo);
        }
        this.init = function (_el, _prop) {
            var $def = $.Deferred();
            el = _el;
            prop = _prop || {

            };

            $.extend(prop, {
                insertMode: 'append',
                mirror: false
            });
            if (!scope.publisher) {
                scope.publisher = TB.initPublisher(el, prop);

                scope.publisher.on({
                    accessDenied: function (event) {
                        triggerEvent("accessDenied", event);
                    },
                    accessDialogOpened: function (event) {
                        triggerEvent('accessDialogOpened', event);
                    },
                    accessDialogClosed: function (event) {
                        triggerEvent('accessDialogClosed', event);
                    },
                    accessAllowed: function (event) {
                        triggerEvent('accessAllowed', event);
                    },
                    loaded: function (event) {
                        triggerEvent('loaded', event);
                    },
                    streamCreated: function (event) {
                        triggerEvent('streamCreated', event);
                    },
                    streamDestroyed: function (event) {
                        triggerEvent('streamDestroyed', event);
                        triggerEvent('otPublisherError', event, scope.publisher);
                    }
                });
                $tbSession.publishers.push(scope.publisher);
            }
            scope.publisher.publishVideo(scope.doPublishVideo);
            if ($tbSession.session && ($tbSession.session.connected ||
                    ($tbSession.session.isConnected && $tbSession.session.isConnected()))) {
                $tbSession.session.publish(scope.publisher, function (err) {
                    if (err) {
                        triggerEvent('otPublisherError', err, scope.publisher);
                        $def.reject(err);

                    } else {
                        $def.resolve();
                    }
                });
            }

            return $def.promise();
        };
        this.send = function (data, _callBack) {
            _callBack = _callBack || function () { };
            $tbSession.session.signal(data, _callBack);
        };
        this.received = function (data, callBack) {
            $tbSession.session.on(data, callBack);
        };
        this.rePublish = function () {

            var $def = $.Deferred();
            if ($tbSession.session && ($tbSession.session.connected ||
                   ($tbSession.session.isConnected && $tbSession.session.isConnected()))) {
                if (scope.publisher) {
                    $tbSession.session.unpublish(scope.publisher);
                }
                if (scope.publisher) {
                    $tbSession.session.publish(scope.publisher);
                } else {
                    this.init(el, prop);
                }
                $def.resolve();

            } else {
                $def.reject();
            }
            return $def.promise();
        }



    }).singleton();

    snap.namespace("snap.tokbox").use(["snap.tokbox.TokboxSession", "SnapNotification"]).define("TokboxScreenPublisher", function ($tbSession, $snapNotification) {

        var eventList = {

        };
        var scope = this;
        this.chromeExtensionId = "padchhoieclaaocgjbfepahaakajgllb";
        this.clearEvents = function () {
            eventList = [];
        }
        this.on = function (eventName, cb) {

            var eventCbList = eventList[eventName];
            if (!eventCbList) {
                eventCbList = [];
            }
            eventCbList.push(cb);
            eventList[eventName] = eventCbList;
        };
        var triggerEvent = function (name) {

            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
            var eventCbList = eventList[name];
            if (eventCbList) {
                $.each(eventCbList, function () {
                    return this.apply(scope, args);
                });
            }
        };

        scope.installScreenshareExtension = function () {
            chrome.webstore.install('https://chrome.google.com/webstore/detail/' + scope.chromeExtensionId,
              function () {
                  $snapNotification.success('successfully installed');
              }, function () {
                  window.open('https://chrome.google.com/webstore/detail/' + scope.chromeExtensionId);
              });
        };
        this.isStarted = false;

        this.publisher = null;
        this.init = function (el, prop) {
            scope.isStarted = false;
            OT.registerScreenSharingExtension('chrome', scope.chromeExtensionId);
            try {

                OT.checkScreenSharingCapability(function (response) {
                    if (!response.supported || response.extensionRegistered === false) {
                        $snapNotification.error('This browser does not support screen sharing.');
                    }

                    else if (((!isFirefox) && (response["extensionInstalled"] === false))) {
                        console.log('extensionInstalled:' + response.extensionInstalled);
                        console.log('extensionRequired:' + response.extensionRequired);
                        snapConfirm("Screen sharing extension not installed. Press Yes to install extension");
                        $("#btnConfirmYes").click(function () {
                            if (!isFirefox)
                                scope.installScreenshareExtension();
                            else {
                                window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                            }
                        });
                        $("#btnConfirmNo").click(function () {
                            $(".k-notification-confirmation").parent().remove();
                        });

                    }


                    else {

                        // Screen sharing is available. Publish the screen.
                        prop = prop || {

                        };
                        $.extend(prop, {
                            videoSource: screen,
                            insertMode: 'append',
                            showControls: false,
                        });
                        scope.publisher = OT.initPublisher(el, prop
                         , function (err) {
                             if (err) {
                                 if (!isChrome) {
                                     snapConfirm("Screen sharing has encountered an error. Press 'Yes' to install the extension (refresh required), or refresh to update Firefox permissions");
                                     $("#btnConfirmYes").click(function () {
                                         window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                                     });
                                 }
                                 scope.isStarted = false;
                                 triggerEvent('otPublisherError', err, scope.publisher);

                             } else {
                                 $tbSession.publishers.push(scope.publisher);
                                 $tbSession.session.publish(scope.publisher, function (err) {
                                     if (err) {
                                         triggerEvent('otPublisherError', err, scope.publisher);
                                         scope.isStarted = false;
                                         return;
                                     }
                                     scope.isStarted = true;
                                 });
                             }
                         });

                        scope.publisher.on({
                            accessDenied: function (event) {
                                triggerEvent("accessDenied", event);
                            },
                            mediaStopped: function (event) {
                                triggerEvent("mediaStopped", event);
                            },
                            accessDialogOpened: function (event) {
                                triggerEvent('accessDialogOpened', event);
                            },
                            accessDialogClosed: function (event) {
                                triggerEvent('accessDialogClosed', event);
                            },
                            accessAllowed: function (event) {
                                triggerEvent('accessAllowed', event);
                            },
                            loaded: function (event) {
                                triggerEvent('loaded', event);
                            },
                            streamCreated: function (event) {
                                triggerEvent('streamCreated', event);
                            },
                            streamDestroyed: function (event) {

                                triggerEvent('streamDestroyed', event);
                            }
                        });

                    }
                });
            } catch (ex) {
                console.error("screensharing failure.");
            }

        };


        this.isActive = function () {
            return scope.isStarted == true;
        };
        this.stopSharing = function () {
            scope.isStarted = false;
            if (scope.publisher && $tbSession.session) {
                $tbSession.session.unpublish(scope.publisher);
                scope.publisher = null;
                
            }
        };

    }).singleton();

    snap.namespace("snap.tokbox").use(["snap.tokbox.TokboxSession", "snapNotification"]).define("TokboxSubscriber", function ($tbSession, $snapNotification) {

        var eventList = {

        };
        var scope = this;
        var stream = null, elName = null, prop = null;
        this.on = function (eventName, cb) {
            var eventCbList = eventList[eventName];
            if (!eventCbList) {
                eventCbList = [];
            }
            eventCbList.push(cb);
            eventList[eventName] = eventCbList;
        };
        this.clearEvents = function () {
            eventList = [];
        }
        var triggerEvent = function (name) {

            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
            var eventCbList = eventList[name];
            if (eventCbList) {
                $.each(eventCbList, function () {
                    return this.apply(scope, args);
                });
            }
        };
        this.retry = 1;
        var start = function () {

            scope.subscriber = $tbSession.session.subscribe(stream, elName, prop, function (err) {

                if (err) {
                    triggerEvent("otSubscriberError");


                } else {
                    scope.retry = 1;
                    triggerEvent("otSubscriberDone");
                    scope.subscriber.on("loaded", function () {
                        triggerEvent("loaded");
                    });
                    scope.subscriber.on("videoDisabled", function (event) {
                        triggerEvent("videoDisabled", event);
                    });
                    scope.subscriber.on("videoDisabled", function (event) {
                        triggerEvent("videoDisabled", event);
                    });
                   

                }
            });
        }

        this.init = function (_stream, _elName, _prop) {
            stream = _stream;
            elName = _elName;
            prop = _prop || {

            };
            $.extend(prop, {
                insertMode: 'append'
            });
            start();



        };



    });
    snap.namespace("snap.tokbox").use(["snap.tokbox.TokboxSession"]).define("TokboxScreenSubscriber", function ($tbSession) {

        var eventList = {

        };
        var scope = this;
        this.clearEvents = function () {
            eventList = [];
        }
        this.on = function (eventName, cb) {
            var eventCbList = eventList[eventName];
            if (!eventCbList) {
                eventCbList = [];
            }
            eventCbList.push(cb);
            eventList[eventName] = eventCbList;
        };
        var triggerEvent = function (name) {

            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
            var eventCbList = eventList[name];
            if (eventCbList) {
                $.each(eventCbList, function () {
                    return this.apply(scope, args);
                });
            }
        };
        this.init = function (stream, elName, prop) {
            prop = prop || {

            };
            $.extend(prop, {
                insertMode: 'append'
            });
            scope.subscriber = $tbSession.session.subscribe(stream, elName, prop, function (err) {
                if (err != null) {
                    triggerEvent("otSubscriberError", err, scope.subscriber);
                }
            });
            scope.subscriber.on("loaded", function () {
                triggerEvent("loaded");
            });


        };



    }).singleton();

}(jQuery));
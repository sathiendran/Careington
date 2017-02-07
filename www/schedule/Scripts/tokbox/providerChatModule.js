"use strict"

;
(function($) {

	snap.namespace("snap.Shared")
		.use(["snap.snapNotification"])
		.define("providerChatTokboxModule", function($snapNotification) {
			var tokboxSession,
				publisher,
				publisherProperties,
				subscribers = [],
				videoInputDevices = [],
				tokboxFeedSize = {};

			var isTogglingCamera = false,
				isRepublishing = false,
				isAudio = false;

			var $scope = this,
				eventList = {};


			var defaultFeedSize = {
				width: 375,
				height: 487
			};

			var checkAudioIntervalTime = 3000, // the interval to check audio signal.
				publisherAudioChecker,
				subscriberAudioChecker,
				isSelfMicDisabled = false,
				isSubscriberMicDisabled = false;

			var containerName;
			var webRtcEnabled = false,
				muteVideoEnabled = false;

			this.isWebRtcEnabled = function() {
				return webRtcEnabled;
			};

			this.isMuteVideoEnabled = function() {
				return muteVideoEnabled;
			};

			this.triggerEvent = function(name) {
				var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
				var eventCbList = eventList[name];
				if (eventCbList) {
					$.each(eventCbList, function() {
						return this.apply($scope, args);
					});
				}
			};

			this.on = function(eventName, cb) {
				var eventCbList = eventList[eventName];
				if (!eventCbList) {
					eventCbList = [];
				}
				eventCbList.push(cb);
				eventList[eventName] = eventCbList;
			};

			this.init = function(opt) {
				if (opt.feedSize) {
					tokboxFeedSize.width = opt.feedSize.width || defaultFeedSize.width;
					tokboxFeedSize.height = opt.feedSize.height || defaultFeedSize.height;
				}
				containerName = opt.containerName;
				if (OT.checkSystemRequirements()) {
					webRtcEnabled = true;
				} else {
					this.triggerEvent("webRtcDisabled");
				};
			};

			this.onAcceptCall = function() {
				window.setTimeout(function() {
					initCheckSubscriberAudioSignal();
				}, checkAudioIntervalTime);
			};

			this.onCallmateDisconnected = function() {
				cancelCheckSubscriberAudioSignal();
			};

			this.muteAudio = function(isMicDisabled) {
				if (publisher) {
					isSelfMicDisabled = isMicDisabled;
					publisher.publishAudio(!isMicDisabled);
					if (publisher.stream) {
						var signalData = {
							isMicDisabled: isMicDisabled,
							streamId: publisher.stream.streamId
						}
						tokboxSession.signal({
	                        data: signalData,
	                        type: "muteAudio"
	                    });
					}
					return true;
				} else {
					return false;
				}
			};

			this.switchToAudio = function() {
				if (publisher) {
					isAudio = true;
					$scope.triggerEvent('isAudioChanged', isAudio);
					publisher.publishVideo(false);
				}
			};

			this.switchToVideo = function() {
				if (publisher) {
					isAudio = false;
					$scope.triggerEvent('isAudioChanged', isAudio);
					publisher.publishVideo(true);
				}
			};

			this.onFullScreen = function () {
                var element = document.getElementById(containerName);
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
			
			this.disconnectSession = function(unSubsribe) {
			    if (tokboxSession) {
			        if (unSubsribe) {
			            var allSubs = OT.subscribers.where();
			            $.each(allSubs, function (item, subInfo) {
			                try {
			                    tokboxSession.unsubscribe(subInfo);
			                } catch (ex) {

			                }
			            });
			        }
			        tokboxSession.disconnect();
			        $scope.triggerEvent("sessionDisconnect");
			        
				}
			};
			this._removeOldListener = function () {
			    tokboxSession.off("signal:switchToAudio");
			    tokboxSession.off("signal:switchToOpenConsultation");
			    tokboxSession.off("signal:muteAudio");
			    tokboxSession.off("streamCreated");
			    tokboxSession.off("streamDestroyed");
			    tokboxSession.off("sessionDisconnected");
			};
			this.startTokboxSession = function(data, _isAudio) {
				if (!webRtcEnabled) {
					this.triggerEvent("webRtcDisabled");
					return;
				}
				muteVideoEnabled = false;
				isSelfMicDisabled = false;
				isSubscriberMicDisabled = false;
				isAudio = _isAudio;
				tokboxSession = OT.initSession(data.ApiKey, data.SessionKey);
				tokboxSession.on("signal:switchToAudio", function() {
					$scope.switchToAudio();
				});
				tokboxSession.on("signal:switchToOpenConsultation", function () {
				    $scope.triggerEvent("switchToOpenConsultation");
				});
				tokboxSession.on("signal:switchToVideo", function() {
					$scope.switchToVideo();
				});
				tokboxSession.on("signal:muteAudio", function(data) {
					var subscriber = OT.subscribers.where(function(subs) {
						return subs.stream.streamId == data.data.streamId;
					});
					if (subscriber.length) {
						isSubscriberMicDisabled = data.data.isMicDisabled;
					}
				});
				tokboxSession.on("signal:disconnect", function() {
					tokboxSession.disconnect();
					$scope.triggerEvent("sessionDisconnect");
				});
				tokboxSession.on("streamCreated", function (event) {
				    var streamId = event.stream.id;
				    var oldSubscriber = OT.subscribers.where(function (subscriber) {
				        return subscriber.streamId === streamId;
				    });
				    if (oldSubscriber.length > 0) {
				        return;
				    }

					$(".OT_publisher").addClass("mini-feed");
					var subscriberProperties = {
						width: tokboxFeedSize.width,
						height: tokboxFeedSize.height,
						name: snap.profileSession.fullName,
						insertMode: "append"
					};
					subscribers.push(tokboxSession.subscribe(event.stream, containerName, subscriberProperties));
					isAudio = !event.stream.hasVideo;
					isSubscriberMicDisabled = !event.stream.hasAudio;
					$scope.triggerEvent('isAudioChanged', isAudio);
					muteVideoEnabled = true;
					window.setTimeout(function() {
						initCheckSubscriberAudioSignal();
					}, checkAudioIntervalTime);
				});
				tokboxSession.on("streamDestroyed", function (event) {
                   
					var subscriber = subscribers.find(function(item) {
						return item.streamId === event.stream.streamId;
					});
					if (subscriber) {
						subscribers.splice(subscribers.indexOf(subscriber), 1);
						tokboxSession.unsubscribe(subscriber);
						subscriber.destroy();
					}
					cancelCheckSubscriberAudioSignal();
				});
				tokboxSession.on("sessionDisconnected", function () {
					muteVideoEnabled = false;
					if (isRepublishing || isTogglingCamera && !isAudio) {
						isRepublishing = false;
						tokboxSession.connect(data.TokenKey, function(error) {
							if (error) {
								console.log(error.message);
							} else {
								tokboxOnConnect(data);
							}
						});
					} else {
						cancelCheckPublisherAudioSignal();
						cancelCheckSubscriberAudioSignal();
						isSelfMicDisabled = false;
						isSubscriberMicDisabled = false;
						$scope._removeOldListener();
					}
				});
				tokboxSession.connect(data.TokenKey, function(error) {
					if (error) {
						console.log(error.message);
					} else {
						tokboxOnConnect(data);
					}
				});
			};

			var tokboxToggleCamera = function() {
				isTogglingCamera = false;
				OT.getDevices(function(error, devices) {
					if (!error) {
						videoInputDevices = devices.filter(function(element) {
							return element.kind == "videoInput";
						});
						if (videoInputDevices && videoInputDevices.length > 1) {
							var secondCamera = publisherProperties.videoSource ? videoInputDevices.find(function(item) {
								return item.deviceId != publisherProperties.videoSource;
							}) : videoInputDevices[1];
							publisherProperties = {
								width: tokboxFeedSize.width,
								height: tokboxFeedSize.height,
								name: snap.profileSession.fullName,
								insertMode: "append",
								videoSource: secondCamera.deviceId,
								publishVideo: true,
								publishAudio: true
							};
							publishSession();
						} else {
							$snapNotification.info("No secondary camera");
							isRepublishing = true;
							tokboxSession.disconnect();
						}
					}
				});
			};

			var publishSession = function() {
				publisher = OT.initPublisher(containerName, publisherProperties, function(error) {
					if (error && !isAudio) {
						$snapNotification.info("There is issue with video publishing.");
						console.log(error);
					}
					publisher.publishVideo(!isAudio);
					publisher.publishAudio(true);
					tokboxSession.publish(publisher);
					muteVideoEnabled = true;
				});
				$(".OT_publisher").addClass("mini-feed");

				window.setTimeout(function() {
					initCheckPublisherAudioSignal();
				}, checkAudioIntervalTime);
			};

			var tokboxOnConnect = function(data) {
				isRepublishing = false;
				if (isTogglingCamera) {
					tokboxToggleCamera();
				} else {
					$scope.triggerEvent('isAudioChanged', isAudio);
					publisherProperties = {
						width: tokboxFeedSize.width,
						height: tokboxFeedSize.height,
						name: snap.profileSession.fullName,
						insertMode: "append",
						publishVideo: !isAudio,
						publishAudio: true
					};
					publishSession();
				}
			};

			var initCheckPublisherAudioSignal = function() {
				cancelCheckPublisherAudioSignal();
				publisherAudioChecker = window.setInterval(function() {
					// check audio signal periodically
					if (publisherAudioChecker != null && !isSelfMicDisabled) {
						// if it was not cancelled
						var publishers = OT.publishers.where();
						if (publishers.length && publishers[0].stream) {
							$scope.triggerEvent("isSelfAudioLost", !publishers[0].stream.hasAudio);
						} else {
							$scope.triggerEvent("isSelfAudioLost", true);
						}
					} else {
						$scope.triggerEvent("isSelfAudioLost", false);
					}
				}, checkAudioIntervalTime);
			};

			var initCheckSubscriberAudioSignal = function() {
				cancelCheckSubscriberAudioSignal();
				subscriberAudioChecker = window.setInterval(function() {
					// check audio signal periodically
					if (subscriberAudioChecker != null && !isSubscriberMicDisabled) {
						// if it was not cancelled
						var subscribers = OT.subscribers.where();
						if (subscribers.length) {
							$scope.triggerEvent("isSubscriberAudioLost", !subscribers[0].stream.hasAudio);
						} else {
							$scope.triggerEvent("isSubscriberAudioLost", true);
						}
					} else {
						$scope.triggerEvent("isSubscriberAudioLost", false);
					}
				}, checkAudioIntervalTime);
			};

			var cancelCheckPublisherAudioSignal = function() {
				if (publisherAudioChecker != null) {
					window.clearInterval(publisherAudioChecker);
					publisherAudioChecker = null;
				}
				$scope.triggerEvent("isSelfAudioLost", false);
			};

			var cancelCheckSubscriberAudioSignal = function() {
				if (subscriberAudioChecker != null) {
					window.clearInterval(subscriberAudioChecker);
					subscriberAudioChecker = null;
				}
				$scope.triggerEvent("isSubscriberAudioLost", false);
			};

			this.toggleCamera = function() {
				if (tokboxSession && !isAudio) {
					isTogglingCamera = true;
					cancelCheckPublisherAudioSignal();
					cancelCheckSubscriberAudioSignal();

					subscribers.forEach(function(subscriber) {
						tokboxSession.unsubscribe(subscriber);
						subscriber.destroy();
					});
					subscribers = [];
					if (publisher) {
						tokboxSession.unpublish(publisher);
						publisher.destroy();
					}
					if (tokboxSession && tokboxSession.isConnected()) {
						if (window.isFireFox) {
							tokboxToggleCamera();
						} else {
							// in chrome we have to reconnect tokbox session
							tokboxSession.disconnect();
						}
					}
				}
			};

			this.hasAudioSource = function() {
				var $def = $.Deferred();
				OT.getDevices(function(error, devices) {
					if (error) {
						return $def.reject();
					}
					devices = devices || [];
					var audio = devices.find(function(item) {
						return item.kind === "audioInput";
					});
					if (audio) {
						$def.resolve();
					} else {
						$def.reject();
					}
				});
				return $def.promise();

			};

			this.hasVideoSource = function() {
				var $def = $.Deferred();
				OT.getDevices(function(error, devices) {
					if (error) {
						return $def.reject();
					}
					devices = devices || [];
					var video = devices.find(function(item) {
						return item.kind === "videoInput";
					});
					if (video) {
						$def.resolve();
					} else {
						$def.reject();
					}
				});
				return $def.promise();
			};

			this.switchToOpenConsultation = function () {
			    var $def = $.Deferred();
			    tokboxSession.signal({ data: "switchToOpenConsultation" }, function () {
			        $def.resolve();
			    });
			    return $def.promise();
			};
		})
		.singleton();

}(jQuery));
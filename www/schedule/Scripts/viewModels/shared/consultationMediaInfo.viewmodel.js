
;
(function ($, snap) {
    snap.namespace("snap.shared").use(["SnapNotification"])
        .extend(kendo.observable)
        .define("ConsultationMediaInfo", function ($notifications) {
            var that = this;
            var naMsg = "N/A";  


            that.getEmptyStats = function () {
                return {
                    audio: {
                        packetsLostRate: naMsg,
                        packetsReceived: naMsg,
                        bitRate: naMsg,
                        bytesReceived: 0
                    },
                    video: {
                        packetsLostRate: naMsg,
                        packetsReceived: naMsg,
                        bitRate: naMsg,
                        bytesReceived: 0,
                        frameRate: naMsg
                    }
                };
            };

            //observable vars
            that.stats = that.getEmptyStats();
            that.vHeight = '';
            that.vWidth = '';
            that.resolution = naMsg;
            that.previousStats = that.getEmptyStats();
            that.isShown = false;
            that.isRealtime = false;

            //inner vars
            that.currentId = null;
            that.subscribers = null;
            that.currentSubscriber = null
            that.timer = null;
            that.refreshInterval = 1000;


            that.init = function (data) {
                that.setSubscribers(data.subscribers);
                that.setCurrentClient(data.currentId);
            };

            //it should be moved to utils file or replaced by underscore or lowdash JS libraries
            var findCallback = function (elm) {
                if (elm.id === that.currentId) {
                    return true;
                }
                return false;
            };

            that.refresh = function () {
                if (that.subscribers) {
                    that.currentSubscriber = that.subscribers.find(findCallback);
                    if (that.currentSubscriber) {
                        that.vHeight =  that.currentSubscriber.stream.videoDimensions.height;
                        that.vWidth = that.currentSubscriber.stream.videoDimensions.width;
                        that.set("resolution", that.vWidth + " x " + that.vHeight);

                        that.currentSubscriber.getStats(that.updateStat);
                        return;
                    }
                    that.set("vHeight", naMsg);
                    that.set("vWidth", naMsg);
                    that.set("resolution", naMsg);
                }                
                that.set("stats", that.getEmptyStats());
            };

            that.updateStat = function (error, data) {
                that.set("previousStats", that.stats);
                that.set("stats", that.getEmptyStats());

                if (error) {
                    $notifications.error(error.message);
                    return;
                }
                if (!data.audio || !data.video) {
                    // empty stats
                    return;
                }
                data.audio.packetsLostRate = data.audio.packetsReceived == 0 ? naMsg : (data.audio.packetsLost / data.audio.packetsReceived).toFixed(4) + " %";
                data.audio.bitRate = (data.audio.bytesReceived - that.previousStats.audio.bytesReceived) / (that.refreshInterval / 1000) + " kbps";
                data.video.packetsLostRate = data.video.packetsReceived == 0 ? naMsg : (data.video.packetsLost / data.video.packetsReceived).toFixed(4) + " %";
                data.video.bitRate = (data.video.bytesReceived - that.previousStats.video.bytesReceived) / (that.refreshInterval / 1000) + " kbps";
                data.video.frameRate = data.video.frameRate.toFixed(2) + " fps";

                that.set("stats", data);
            };

            that.setTimerState = function () {
                if (!that.isRealtime) {
                    that.timer = window.setInterval(that.refresh, that.refreshInterval);
                }
                else {
                    that.turnOffTimer();
                }
            };

            that.turnOffTimer = function () {
                that.set("isRealtime", false);
                window.clearInterval(that.timer);
            };

            that.setCurrentClient = function (id) {
                that.set("currentSubscriber", null);
                that.currentId = id;
                that.refresh();
            }

            that.setSubscribers = function (subscribers) {
                that.subscribers = subscribers;
            }

            return that;

        }).singleton();
}(jQuery, snap));
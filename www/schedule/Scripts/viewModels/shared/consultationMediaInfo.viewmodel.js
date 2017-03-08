
;
(function ($, $snap) {
    snap.namespace("snap.shared").use(["SnapNotification"])
      .extend(kendo.observable)
      .define("ConsultationMediaInfo", function ($notifications) {
          var that = this;//kendo.observable();

          that.getEmptyStats = function () {
              return {
                  audio: {
                      packetsLostRate: "N/A",
                      packetsReceived: "N/A"
                  },
                  video: {
                      packetsLostRate: "N/A",
                      packetsReceived: "N/A"
                  }
              };
          };

          //observable vars
          that.stats = that.getEmptyStats();
          that.isShown = false;
          that.isRealtime = false;

          //inner vars
          that.currentId = null;
          that.subscribers = null;
          that.currentSubscriber = null
          that.timer = null;

          that.init = function (data) {
              that.currentId = data.currentId;
              that.subscribers = data.subscribers;

              that.refresh();
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
                      that.currentSubscriber.getStats(that.updateStat);
                      return;
                  }

              }
              that.set("stats", that.getEmptyStats);
          };

          that.updateStat = function (error, data) {
              that.set("stats", that.getEmptyStats());

              if (error) {
                  $notifications.error(error.message);
                  return;
              }
              data.audio.packetsLostRate = data.audio.packetsReceived == 0 ? "0" : (data.audio.packetsLost / data.audio.packetsReceived).toFixed(4);
              data.video.packetsLostRate = data.video.packetsReceived == 0 ? "0" : (data.video.packetsLost / data.video.packetsReceived).toFixed(4);
              that.set("stats", data);
          };

          that.setTimerState = function () {
              if (!that.isRealtime) {
                  that.timer = window.setInterval(that.refresh, 5000);
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
              that.currentSubscriber = null;
              that.currentId = id;
              that.refresh();
          }

          return that;

      }).singleton();
})(jQuery, snap)
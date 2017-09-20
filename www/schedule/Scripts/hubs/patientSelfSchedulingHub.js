//@ sourceURL=patientSelfSchedulingHub.js

(function($, snap) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snap.common.timeUtils", "snap.hub.mainHub", "snap.hub.hubModel"])
        .define("patientSelfSchedulingHub", function($timeUtils, $mainHub, $hubModel) {
            var scope = this,
                hubListeningDate = null;

            this._name = "patientSelfSchedulingHub";

            var patientSelfSchedulingHub = $.connection.patientSelfSchedulingHub;
            $hubModel._initModel(patientSelfSchedulingHub, this);

            this._initConnection = function(opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (opt) {
                    $.connection.hub.qs["TimeZone"] = opt.timeZoneSystemId;
                    $.connection.hub.qs["Date"] = $timeUtils.dateToString(opt.dateForListening);
                }
            };

            this._initClient = function() {
                patientSelfSchedulingHub.client.lockSlot = function(data, from, to) {
                    scope.triggerEvent("lockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.unlockSlot = function(data, from, to) {
                    scope.triggerEvent("unlockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.bookSlot = function(data, from, to) {
                    scope.triggerEvent("bookSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.onRefreshState = function() {
                    scope.triggerEvent("onRefreshState");
                };
            };

            this.start = function(token, timeZoneSystemId, dateForListening) {
                if (this._isHubStarted) {
                    return;
                }
                this._isHubStarted = true; //hub was started.

                hubListeningDate = dateForListening;

                $.connection.hub.qs = $.connection.hub.qs || {};

                $.connection.hub.qs["Bearer"] = token;
                $.connection.hub.qs["TimeZone"] = timeZoneSystemId;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return $mainHub.start();
            };

           
            this.lockSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("lockSlot", availabilityBlockId, from, to);
            };

            this.unlockSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("unlockSlot", availabilityBlockId, from, to);
            };

            this.bookSlot = function(availabilityBlockId, from, to) {
                return this._invokeServerFunction("bookSlot", availabilityBlockId, from, to);
            };

            //Hub listen specific date, this method change date which is currently listening.
            this.changeHubListeningDate = function(dateForListening) {
                hubListeningDate = dateForListening;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return this._invokeServerFunction("changeDate", $timeUtils.dateToString(dateForListening));
            };

            //Hub listen specific date, this method return date which is currently listening.
            this.getHubListeningDate = function() {
                return new Date(hubListeningDate);
            };

        }).singleton();
}(jQuery, snap));

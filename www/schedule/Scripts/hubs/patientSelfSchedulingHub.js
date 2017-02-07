//@ sourceURL=patientSelfSchedulingHub.js

(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snap.admin.schedule.TimeUtils", "snap.hub.mainHub", "snap.hub.hubModel"])
        .define("patientSelfSchedulingHub", function($timeUtils, $mainHub, $hubModel) {
            var scope = this,
                hubListeningDate = null,
                isHubInitiated = false,
                isHubStarted = false;

            var patientSelfSchedulingHub = $.connection.patientSelfSchedulingHub;
            $hubModel._initModel(patientSelfSchedulingHub, this);

            var initEvent = function() {
                patientSelfSchedulingHub.client.lockSlot = function(data, from, to) {
                    scope.triggerEvent("lockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.unlockSlot = function(data, from, to) {
                    scope.triggerEvent("unlockSlot", data, from, to);
                };

                patientSelfSchedulingHub.client.bookSlot = function(data, from, to) {
                    scope.triggerEvent("bookSlot", data, from, to);
                };
            };

            this.init = function() {
                if (isHubInitiated) {
                    return;
                }

                isHubInitiated = true; //hub was initiated.

                if (patientSelfSchedulingHub === null || typeof(patientSelfSchedulingHub) === "undefined") {
                    window.console.error("$consulationHub script is not included");
                }

                initEvent();
            };

            this.start = function(token, timeZoneSystemId, dateForListening) {
                if (isHubStarted) {
                    return;
                }
                isHubStarted = true; //hub was started.

                hubListeningDate = dateForListening;

                $.connection.hub.qs = $.connection.hub.qs || {};

                $.connection.hub.qs["Bearer"] = token;
                $.connection.hub.qs["TimeZone"] = timeZoneSystemId;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return $mainHub.start();
            };

            // this.setDateForListening = function(dateForListening) {
            //     $.connection.hub.qs["Date"] = date;
            // }

            this.lockSlot = function(availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.lockSlot(availabilityBlockId, from, to);
            };

            this.unlockSlot = function(availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.unlockSlot(availabilityBlockId, from, to);
            };

            this.bookSlot = function(availabilityBlockId, from, to) {
                return patientSelfSchedulingHub.server.bookSlot(availabilityBlockId, from, to);
            };

            //Hub listen specific date, this method change date which is currently listening.
            this.changeHubListeningDate = function(dateForListening) {
                hubListeningDate = dateForListening;
                $.connection.hub.qs["Date"] = $timeUtils.dateToString(dateForListening);

                return patientSelfSchedulingHub.server.changeDate($timeUtils.dateToString(dateForListening));
            };

            //Hub listen specific date, this method return date which is currently listening.
            this.getHubListeningDate = function() {
                return new Date(hubListeningDate);
            };

            //Hub implemented as singleton because current backend hub implementation do not allow to have several hubs for a single page.
            //this metthod provide information about Hub state, was it initiated or not.
            this.isHubInitiated = function() {
                return isHubInitiated;
            };

            this.isHubStarted = function() {
                return isHubStarted;
            };

            this.markAsStarted = function(value) {
                isHubStarted = !!value;
            };

        }).singleton();
}(jQuery, snap, kendo));

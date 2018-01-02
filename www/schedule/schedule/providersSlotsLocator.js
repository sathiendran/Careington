//@ sourceURL=providersSlotsLocator.js

(function($, snap) {
    "use strict";

     snap.namespace("snap.patient.schedule")
        .use(["snapNotification", "snap.common.timeUtils", "snap.patient.schedule.patientSelfSchedulingHub", "snap.service.userService",
            "snap.hub.mainHub"])
        .define("providersSlotsLocator", function($snapNotification, $timeUtils, $patientSelfSchedulingHub, $userService, $mainHub) {
            var lockedSlotsList = new SlotList();

            $patientSelfSchedulingHub.on("start", function () {
                window.console.log("patientSelfSchedulingHub started");
            });

            $patientSelfSchedulingHub.on("lockSlot", function (availabilityBlockId, from, to) {
                window.console.log("lockSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.addSlot(convertToSlot(availabilityBlockId, from, to));
            });

            $patientSelfSchedulingHub.on("unlockSlot", function (availabilityBlockId, from, to) {
                window.console.log("unlockSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.removeSlot(convertToSlot(availabilityBlockId, from, to));
            });

            $patientSelfSchedulingHub.on("bookSlot", function (availabilityBlockId, from, to) {
                window.console.log("bookSlot:" + availabilityBlockId + " time: " + from);

                lockedSlotsList.addSlot(convertToSlot(availabilityBlockId, from, to));
            });
            this.set("vm_isSearchBarActive", false);
            function convertToSlot(availabilityBlockId, from, to) {
                return {
                    from: $timeUtils.dateFromSnapDateString(from),
                    to: $timeUtils.dateFromSnapDateString(to),
                    availabilityBlockId: availabilityBlockId
                };
            }

            function setListeningDate(hubListeningDate) {
                var dfd = $.Deferred();
                if(typeof(hubListeningDate) === "undefined") {
                    hubListeningDate = new Date();
                }
                hubListeningDate.setHours(0, 0, 0, 0);

                if(!$patientSelfSchedulingHub.isHubInitialized()) {
                    $mainHub.register($patientSelfSchedulingHub);

                    $userService.getUserTimeZoneId().done(function(response) {
                        $patientSelfSchedulingHub.start(
                            snap.userSession.token,
                            response.message,
                            hubListeningDate);
                        dfd.resolve();
                    });
                } else if($patientSelfSchedulingHub.isHubStarted() && $patientSelfSchedulingHub.getHubListeningDate().getTime() !== hubListeningDate.getTime()) {
                    lockedSlotsList.clear();
                    $patientSelfSchedulingHub.changeHubListeningDate(hubListeningDate);
                    dfd.resolve();
                } else {
                    dfd.resolve();
                }
                return dfd.promise();
            }

            function SlotList() {
                var slotsDictionary = {};

                this.addSlot = function(slot) {
                    if(this.findSlot(slot) === null) {
                        if (!(slot.availabilityBlockId in slotsDictionary)) {
                            slotsDictionary[slot.availabilityBlockId] = [];
                        }

                        slotsDictionary[slot.availabilityBlockId].push(slot);
                    }
                };

                this.removeSlot = function(slot) {
                    slot = this.findSlot(slot);
                    if(slot) {
                        var slotindex = slotsDictionary[slot.availabilityBlockId].indexOf(slot);
                        slotsDictionary[slot.availabilityBlockId].splice(slotindex, 1);
                    }
                };

                this.findSlot = function(slot) {
                    if (slot.availabilityBlockId in slotsDictionary) {
                        var blockSlots = slotsDictionary[slot.availabilityBlockId];

                        for(var i = 0; i < blockSlots.length; i++) {
                            if(blockSlots[i].from.getTime() === slot.from.getTime() && blockSlots[i].to.getTime() === slot.to.getTime()) {
                                return blockSlots[i];
                            }
                        }
                    }

                    return null;
                };

                this.clear = function() {
                    slotsDictionary = {};
                };
            }

            function ProvidersSlotsLocator() {
                var uiSlotsList = new SlotList();

                $patientSelfSchedulingHub.on("lockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.hide();
                    }
                });

                $patientSelfSchedulingHub.on("unlockSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.show();
                    }
                });

                $patientSelfSchedulingHub.on("bookSlot", function (availabilityBlockId, from, to) {
                    var uiSlot = uiSlotsList.findSlot(convertToSlot(availabilityBlockId, from, to));
                    if(uiSlot) {
                        uiSlot.hide();
                    }
                });

                this.setSlots = function(slots, slotsDate) {
                    uiSlotsList.clear();
                    slots.forEach(function(uiSlot) {
                        uiSlotsList.addSlot(uiSlot);
                    });

                    if($patientSelfSchedulingHub.getHubListeningDate().getTime() !== slotsDate.getTime()) {
                        setListeningDate(slotsDate);
                    } else {
                        slots.forEach(function(uiSlot) {
                            if(lockedSlotsList.findSlot(uiSlot)) {
                                uiSlot.hide();
                            }
                        });
                    }
                };
            }

            this.setListeningDate = function(hubListeningDate) {
                return setListeningDate(hubListeningDate);
            };

            this.createSlotsLocator = function() {
                return new ProvidersSlotsLocator();
            };
        }).singleton();
}(jQuery, snap));

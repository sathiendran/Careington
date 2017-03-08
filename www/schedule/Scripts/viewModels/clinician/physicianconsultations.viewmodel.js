/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../header.viewmodel.js" />

"use strict";
; (function ($) {


    //snap.physician namespace

    snap.namespace("snap.physician").use(["snap.shared.consultationsListingControl", "snap.common.schedule.ScheduleCommon", "snap.hub.mainHub"])
         .extend(kendo.observable)
        .define("PhysicianConsultationViewModel", function ($consultationsListingControl, $scheduleCommon, $mainHub) {
            var consultationsListings = [];
            this.loadAllConsultationsListings = function () {
                var kendoTabstrip = $("#consultationsListingTabstrip").data("kendoTabStrip");
                $consultationsListingControl.initHub();
                var that = this;
                $mainHub.on("start", function() {
                    $consultationsListingControl.init().done(function () {
                        var listingsCount = 0;
                        consultationsListings = $consultationsListingControl.loadAllConsultationsToTabstrip(
                            kendoTabstrip,
                            {
                                clinicianUserId: snap.profileSession.userId
                            },
                            {
                                userType: $scheduleCommon.userType.clinician
                            }
                        );
                        consultationsListings.forEach(function (listing) {
                            listingsCount++;
                            listing.onLoad(function () {
                                listingsCount--;
                                if (listingsCount <= 0) {
                                    that.set("vm_isLoading", false);
                                }
                            });
                        });

                        var tabNumber = $consultationsListingControl.defaultTabNumber;
                        var tabName = sessionStorage.getItem("snap_tabName_ref");
                        if (tabName) {
                            sessionStorage.removeItem("snap_tabName_ref");
                            tabNumber = $consultationsListingControl.getTabNumber(tabName);
                        }
                            
                        kendoTabstrip.select(tabNumber);
                    });
                    $mainHub.off("start");
                });
                $mainHub.start();
            };

            this.vm_isLoading = false;
        });
}(jQuery));
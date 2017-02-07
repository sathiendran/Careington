"use strict";
snap.namespace("snap.admin").use(["snap.shared.consultationsListingControl", "snap.common.schedule.ScheduleCommon", "snapLoader"])
    .extend(kendo.observable)
    .define("consultations", function ($consultationsListingControl, $scheduleCommon, $snapLoader) {
        var consultationsListings = [];
        var dateRangeSelection = snap.kendoDateRangeSelection;
        
        dateRangeSelection.onDateRangeChange(function() {
            consultationsListings.forEach(function (listing) {
                listing.filterByDate(dateRangeSelection.startDate(), dateRangeSelection.endDate());
            });
        });

        this.nameFilterValue = null;
        this.nameFilterChange = function () {
            var that = this;
            consultationsListings.forEach(function (listing) {
                listing.filterByName(that.nameFilterValue);
            });
        };

        this.loadAllConsultationsListings = function () {
            var kendoTabstrip = $("#consultationsListingTabstrip").data("kendoTabStrip");
            var that = this;
            $consultationsListingControl.init().done(function () {
                var listingsCount = 0;
                consultationsListings = $consultationsListingControl.loadAllConsultationsToTabstrip(
                    kendoTabstrip, 
                    {}, 
                    { 
                        userType: $scheduleCommon.userType.admin 
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
        };


        this.vm_isLoading = false;
    });
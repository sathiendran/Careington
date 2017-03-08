//@ sourceURL=consultationsListingControl.viewmodel.js

"use strict";
(function ($, snap, kendo) {

    function opt(consultationStatus, options) {
        return $.extend({}, options, { status: consultationStatus });
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    snap.namespace("snap.shared").use(["Snap.Reports.consultationReportService",
        "SnapNotification", "consultationsListingDataSource",
        "snap.service.availabilityBlockService", "snap.common.schedule.ScheduleCommon",
        "snap.common.schedule.appointmentDialogWrapper", "snap.EventAggregator", "snap.hub.mainHub", "snap.hub.consultationsListingHub"])
        .define("consultationsListingControl", function ($consultationReportService, $snapNotification, $ds, $availabilityBlockService, $scheduleCommon,
            $appointmentDialogWrapper, $eventAggregator, $mainHub, $consultationsListingHub) {
            var consultationStutuses = $ds.consultationStutuses;
            var scope = this;

            var tabNames = {
                Scheduled: "Scheduled",
                Past: "Past",
                Dropped: "Dropped",
                DNA: "DNAs",
                Active: "Active"
            };
            var tabsCollection = [
                {name: tabNames.Scheduled},
                {name: tabNames.Past},
                {name: tabNames.Dropped},
                {name: tabNames.DNA},
                {name: tabNames.Active}
            ];

            [
                "appt_onRemoveClick",
                "appt_onSubmitClick",
                "pappt_OnSaved",
                "pappt_OnRemoved"
            ].forEach(function (event) {
                $eventAggregator.subscriber(event, function () {
                    scope.hub.refresh();
                });
            });

            function Listing($container, filterOpt, displayOpt) {
                var $listView = null,
                    filter = {
                        startDate: filterOpt.startDate ? new Date(filterOpt.startDate) : undefined,
                        endDate: filterOpt.endDate ? new Date(filterOpt.endDate) : undefined,
                        status: filterOpt.status,
                        clinicianUserId: filterOpt.clinicianUserId ? filterOpt.clinicianUserId : undefined,
                        patientId: filterOpt.patientId ? filterOpt.patientId : undefined,
                        isProfileActive: filterOpt.isProfileActive,
                        includePatientDependents: filterOpt.includePatientDependents ? filterOpt.includePatientDependents : undefined
                    };

                this._ds = null;

                this._onLoadHandler = function () { };
                /****************************** PUBLIC METHODS ********************/
                this.onLoad = function (handler) {
                    if (typeof (handler) === 'function') {
                        this._onLoadHandler = handler;
                    }
                }

                this.refresh = function () {
                    this._ds.read();
                };

                this.changefilters = function (/*consultationFilters*/) {
                    //filters = consultationFilters;
                    this.refresh();
                };

                this.filterByName = function (/*name*/) {
                    //filters.patientOrPhysicianNameFilter = name;
                    this.refresh();
                };

                this.filterByDate = function (startDate, endDate) {
                    filter.startDate = startDate;
                    filter.endDate = endDate;
                    this.refresh();
                };

                /****************************** PRIVATE METHODS ********************/
                this._load = function () {
                    var that = this;
                    this._ds = this._getDataSource(function () {
                        var defFilter = that._getDefaultFilter();

                        return $.extend({}, defFilter, filter);
                    });

                    $listView = createListView(this._ds, this._itemTemplate, this._emptyListingMessage, displayOpt, this);
                    addTooltipOnNameClick();

                    this._subscribeToEvents($listView);
                };

                function createListView(dataSource, itemType, emptyListingMessage, displayOpt, listing) {
                    var $listView = $container.find(".lw-body");
                    var $pager = $container.find(".lw-pager");

                    $pager.kendoPager({
                        dataSource: dataSource
                    });

                    $listView.kendoListView({
                        dataSource: dataSource,
                        template: kendo.template($("#" + itemType).html()),
                        dataBound: function () {
                            $listView.prepend($("#" + itemType + "Header").html());

                            if (dataSource.data().length === 0) {
                                $listView.append(['<div class="notice" style="display: block;">', emptyListingMessage, '</div>'].join(""));
                            }

                            if (displayOpt.showDownloadCCRButton) {
                                $listView.find(".btnDownloadCCR").show();
                            }
                            listing && listing._onLoadHandler();
                        }
                    });

                    return $listView;
                }

                function addTooltipOnNameClick() {
                    $container.on("click", ".patientName", function (e) {
                        if (e.altKey) {
                            var content = $(this).data("title");
                            if (content) {
                                if (content.indexOf("http") >= 0 || content.indexOf("null") >= 0) {
                                    return;
                                }
                                var tooltip = $(".tmpToltip").kendoTooltip({
                                    autoHide: false,
                                    position: "top",
                                    content: content
                                }).data("kendoTooltip");
                                tooltip.show($(this));
                                console && console.log(content); //keep this log
                            }
                        }
                    });
                }
            }

            function AppointmentsListing($container, filterOpt, displayOpt, hubStart, hub) {
                var defaultFilter = {
                    startDate: new Date(2000, 1, 1),
                    endDate: new Date(2050, 1, 1),
                    status: filterOpt.status
                };

                var that = this;
                hub.on('refreshConsultationsListings', function () {
                    that.refresh();
                });

                //Call base constructor
                Listing.call(this, $container, filterOpt, displayOpt, hub);

                this._emptyListingMessage = "There are no appointments found";
                this._itemTemplate = "appt";

                this._getDataSource = function (getFilter) {
                    var opt = getFilter();
                    if (opt.isProfileActive === false) {
                        return $ds.getEmptyDataSource();
                    }
                    if (opt.status === consultationStutuses.Active) {
                        return $ds.getDataSource(hubStart, hub, getFilter);
                    } else {
                        return $ds.getAppointmentsDataSource(getFilter, displayOpt.userType);
                    }
                };

                this._subscribeToEvents = function ($container) {
                    $container.on("click", ".view-appointment", function () {
                        var apptId = $(this).data("apptId");
                        var apptType = $(this).data("apptType");


                        $appointmentDialogWrapper.openAppointmentDialog(apptId, displayOpt.userType, apptType, displayOpt.isDNA);
                    });

                    $container.on("click", ".enter-appointment", function () {
                        if (snap.patientPage) {
                            var apptId = $(this).data("apptId");
                            var path = '/api/v2.1/patients/appointments/' + apptId;
                            $.ajax({
                                type: "GET",
                                url: path,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    var data = response.data[0];
                                    Snap.Patient.PatientHomeNewViewModel().goToSchedConsultInternal(data);
                                },
                                error: function () {
                                    snapError("Cannot find appointment.");
                                }
                            });
                        }
                    });
                };

                this._getDefaultFilter = function () {
                    return defaultFilter;
                };
            }

            function ConsultationsListing($container, filterOpt, displayOpt, hubStart, hub) {
                var defaultFilter = {
                    status: filterOpt.status,
                    isProfileActive: filterOpt.isProfileActive
                };

                var that = this;
                hub.on('refreshConsultationsListings', function () {
                    that.refresh();
                });

                //Call base constructor
                Listing.call(this, $container, filterOpt, displayOpt, hub);

                this._emptyListingMessage = "There are no consultations found";
                this._itemTemplate = "consultation";

                this._getDataSource = function (getFilter) {
                    return $ds.getDataSource(hubStart, hub, getFilter);
                };

                this._subscribeToEvents = function ($container) {
                    var that = this;

                    $container.on("click", ".view-report", function () {
                        var consultationId = $(this).data("consultationId");

                        $consultationReportService.show(consultationId, "standard");
                    });

                    $container.on("click", ".view-appointment", function () {
                        // NoTe. This action could occur only for dismissed appointments.
                        // Dismissed appointmets could be rescheduled. 

                        var apptId = $(this).data("apptId");
                        var apptType = $(this).data("apptType");
                        $appointmentDialogWrapper.openAppointmentDialog(apptId, displayOpt.userType, apptType, true);
                    });


                    $container.on("click", ".btnDownloadCCR", function () {
                        if (snap.canLoginAdmin()) {
                            var patientIDs =
                            $.map(that._ds.data(), function (item) {
                                return item.PatientId;
                            })
                            .filter(onlyUnique)
                            .join(",");

                            if (patientIDs === "") {
                                $snapNotification.error("Consultations listing is empty. Can't download CCR file.");
                                return false;
                            }

                            try {
                                var frmName = '/Admin/ReportBuilder.aspx';
                                var inputs = '<input type="hidden" name=PatientIDs value="' + patientIDs + '" />';
                                $('<form action="' + frmName + snap.string.formatURIComponents('?mode=CCR&token={0}', snap.userSession.token) + '"  method="POST" >' + inputs + '</form>').appendTo('body').submit();
                                return false;
                            }
                            catch (err) {
                                $snapNotification.error("GetPatientCCRInformation error: " + err);
                            }
                        } else {
                            $snapNotification.error("You don't have permission to Download CCR.");
                        }
                    });
                };

                this._getDefaultFilter = function () {
                    return defaultFilter;
                };
            }

            this.getTabNumber = function (name) {
                var index = this.defaultTabNumber;
                tabsCollection.find(function(el, ind) {
                    if (el.name.toLowerCase() === name.toLowerCase()) {
                        index = ind;
                        return true;
                    } else {
                        return false;
                    }
                });
                return index;
            };

            this.loadConsultationsToTab = function ($tab, filterOpt, displayOpt) {
                if (typeof displayOpt === "undefined") {
                    displayOpt = {};
                }


                var listing = null;
                switch (filterOpt.status) {
                    case consultationStutuses.DNA:
                        var newOpts = $.extend({}, displayOpt, { isDNA: true });
                        listing = new AppointmentsListing($tab, filterOpt, newOpts, this.hubStart, this.hub);
                        break;
                    case consultationStutuses.Scheduled:
                    case consultationStutuses.Active:
                        listing = new AppointmentsListing($tab, filterOpt, displayOpt, this.hubStart, this.hub);
                        break;
                    case consultationStutuses.Past:
                    case consultationStutuses.Dropped:
                        listing = new ConsultationsListing($tab, filterOpt, displayOpt, this.hubStart, this.hub);
                        break;
                    default:
                        $snapNotification.error("Unknown status: " + filterOpt.status);
                        break;
                }

                listing._load();


                return listing;
            };

            this.loadConsultationsToTabstrip = function ($kendoTabStrip, newTabName, filterOpt, displayOpt) {
                $kendoTabStrip.append({
                    text: newTabName,
                    content: $("#consultationListing").html()
                });

                var tab = $kendoTabStrip.items()[$kendoTabStrip.items().length - 1];
                var $newTabContainer = $("#" + $(tab).attr("aria-controls"));

                return this.loadConsultationsToTab($newTabContainer, filterOpt, displayOpt);
            };

            this.defaultTabNumber = 1; // select Past by default

            this.loadAllConsultationsToTabstrip = function ($kendoTabStrip, filterOpt, displayOpt) {
                var consultationListings = [];
                $kendoTabStrip.remove($kendoTabStrip.tabGroup.children());

                consultationListings.push(this.loadConsultationsToTabstrip($kendoTabStrip, tabNames.Scheduled, opt(consultationStutuses.Scheduled, filterOpt), displayOpt));
                consultationListings.push(this.loadConsultationsToTabstrip($kendoTabStrip, tabNames.Past, opt(consultationStutuses.Past, filterOpt), displayOpt));
                consultationListings.push(this.loadConsultationsToTabstrip($kendoTabStrip, tabNames.Dropped, opt(consultationStutuses.Dropped, filterOpt), displayOpt));
                consultationListings.push(this.loadConsultationsToTabstrip($kendoTabStrip, tabNames.DNA, opt(consultationStutuses.DNA, filterOpt), displayOpt));
                consultationListings.push(this.loadConsultationsToTabstrip($kendoTabStrip, tabNames.Active, opt(consultationStutuses.Active, filterOpt), displayOpt));

                return consultationListings;
            };

            this.initHub = function () {
                this.hub = $consultationsListingHub;
                $mainHub.register($consultationsListingHub);
                var dfd = $.Deferred();
                $mainHub.on("start", function () {
                   dfd.resolve();
                });
                this.hubStart = dfd.promise();

            };

            this.refresh = function () {
                this.hub.refresh();
            };

            this.init = function (opt) {
                var path = "/content/shared/tabstrip.html" + snap.addVersion;
                if (opt && opt.viewPath) {
                    path = opt.viewPath;
                }

                return $.get(path).then(function (html) {
                    $('body').append(html);
                });
            };
        }).singleton();
}(jQuery, snap, kendo));
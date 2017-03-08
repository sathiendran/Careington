;
(function ($, global, snap) {

    var consultationStutuses = {
        Scheduled: "Scheduled",
        Past: "Past",
        Dropped: "Dropped",
        DNA: "DNA",
        Active: "Active"
    };

    function opt(consultationStatus, options) {
        return $.extend({}, options, { consultationStatus: consultationStatus });
    };

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    snap.namespace("snap.shared").use(["Snap.Reports.consultationReportService", "SnapNotification", "consultationsListingDataSource", 
        "snap.hub.mainHub", "snap.hub.consultationsListingHub"])
    .extend(kendo.observable)
     .define("consultationsListingViewModel", function ($consultationReportService, $snapNotification, $ds, $mainHub, $consultationsListingHub) {
         var that = this;
         this.initHub = function () {
            this.hub = $consultationsListingHub;
            $mainHub.register($consultationsListingHub);

            var dfd = $.Deferred();
            $mainHub.on("start", function () {
                dfd.resolve();
            });
            this.hubStart = dfd.promise();
         };
         this.loadConsultations = function ($container, options) {
             var filtersRecent = $.extend({
                 Order: 0
             }, options);
             var filtersByPatient = $.extend({
                 Order: 1
             }, options);

             that.set("recentConsultations", $ds.getConsultationsInfoForPatient(that.hubStart, that.hub, filtersRecent));
             that.set("byPatientConsultations", $ds.getConsultationsInfoForPatient(that.hubStart, that.hub, filtersByPatient));
             $container.on("click", ".consultreportByMostRecent", function () {
                 var consultationId = $(this).data("consultationId");
                 $consultationReportService.show(consultationId, "standard");
             });
         }


     });
    snap.namespace("snap.shared")
       .use(["snap.shared.consultationsListingViewModel"])
        .define("consultationsListingControl", function ($vm) {

            this.init = function ($container, options) {
                var that = this;
                $vm.initHub();
                $.get("/content/Customer/customerConsultationsList.html" + snap.addVersion).then(function (html) {
                    var view = $(html);
                    $container.html(view[0].innerHTML);
                    $container.find("#tab-history").kendoTabStrip({
                        animation: {
                            open: {
                                effects: "fadeIn"
                            }
                        }
                    });
                    $vm.loadConsultations($container, options);
                    kendo.bind($container, $vm);
                });
            }
        }).singleton();
})(jQuery, window, snap);

//@ sourceURL=serviceTypes.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.serviceTypes").use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.service.serviceTypesService",
            "snap.service.medicalCodesService",
            "snap.common.schedule.ScheduleCommon",
            "snap.admin.serviceTypes.serviceTypeFactoty",
            "snap.hub.mainHub",
            "snap.hub.serviceTypesHub"
    ])
        .extend(kendo.observable)
        .define("serviceTypes", function (
            $snapNotification,
            $eventAggregator,
            $serviceTypesService,
            $medicalCodesService,
            $scheduleCommon,
            $serviceTypeFactoty,
            $mainHub,
            $serviceTypesHub
        ) {
            var isDataInit = false;

            this.vm_isLoading = false;
            this.vm_textSearch = "";

            this.isDataInit = function () {
                return isDataInit;
            };

            this.refresh = function () {
                this._loadData(true);
            };

            this.load = function () {
                isDataInit = true;

                this.onDemandServices.load();
                this.adminServices.load();
                this.selfSchedulingServices.load();

                this._loadData(true);

                $mainHub.register($serviceTypesHub);
                
                var that = this;
                $serviceTypesHub.on("changed", function () {
                    that._loadData(false);
                });

                $mainHub.start();
            };


            this.onDemandServices = $serviceTypeFactoty.createServiceCathegory({
                appointmentType: $scheduleCommon.appointmentTypeCode.onDemand,
                addNewServices: false,
                cathegoryName: "On-Demand Services"
            });

            this.selfSchedulingServices = $serviceTypeFactoty.createServiceCathegory({
                appointmentType: $scheduleCommon.appointmentTypeCode.patientScheduled,
                addNewServices: false,
                cathegoryName: "Self Scheduling Services"
            });

            this.adminServices = $serviceTypeFactoty.createServiceCathegory({
                appointmentType: $scheduleCommon.appointmentTypeCode.clinicianScheduled,
                addNewServices: true,
                cathegoryName: "Admin Scheduled Services"
            });


            this.vm_onTextSearchChange = function() {
                this.onDemandServices.filter(this.vm_textSearch);
                this.adminServices.filter(this.vm_textSearch);
                this.selfSchedulingServices.filter(this.vm_textSearch);
            };

            this._loadData = function(loadMedicalCodes) {
                this.set("vm_isLoading", true);

                var that = this;
                
                var p1 = $serviceTypesService.get(snap.hospitalSession.hospitalId)
                .done(function(data) {
                    that.onDemandServices.setServices(data);
                    that.adminServices.setServices(data);
                    that.selfSchedulingServices.setServices(data);                    
                }).fail(function(error) {
                    $snapNotification.error("Cannot load Services & Pricing");
                });

                var p2 = $.Deferred().resolve().promise();
                if(loadMedicalCodes) {
                    p2 = $medicalCodesService.get({
                        medicalSystem: "INS-VER",
                    }).done(function(data) {
                        that.onDemandServices.setMedicalCodes(data.data);
                        that.adminServices.setMedicalCodes(data.data);
                        that.selfSchedulingServices.setMedicalCodes(data.data);   
                    }).fail(function(error) {
                        $snapNotification.error("Cannot load medical codes");
                    });
                }

                $.when(p1, p2).always(function() {
                    that.set("vm_isLoading", false);
                    that._refreshServiceTypes();
                });
            };

            this._refreshServiceTypes = function() {
                this.trigger("change", { field: "vm_onDemandServiceTypes"});
                this.trigger("change", { field: "vm_clinicianScheduledServiceTypes"});
                this.trigger("change", { field: "vm_patientScheduledServiceTypes"});
            };
        }).singleton();
}(jQuery, snap, kendo));

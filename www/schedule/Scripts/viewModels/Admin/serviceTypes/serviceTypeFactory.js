//@ sourceURL=serviceTypeFactoty.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.serviceTypes").use([
            "snapNotification",
            "snap.EventAggregator",
            "snap.service.serviceTypesService",
            "snap.common.Utility",
            "snap.common.schedule.ScheduleCommon"
    ])
        .extend(kendo.observable)
        .define("serviceTypeFactoty", function (
            $snapNotification,
            $eventAggregator,
            $serviceTypesService,
            $utility,
            $scheduleCommon
        ) {
            var recordCounter = 0;

            function ServiceType(serviceType, medicalCodes, getSiblingServiceTypes) {
                var internalState = null;
                this.recordId = "sType_" + recordCounter++; // This id used for non MVVM operations in case if MVVM approach not work.

                this.medicalCodes = medicalCodes;
                this.serviceTypeId = serviceType.serviceTypeId;
                this.insuranceVerificationCodeId = serviceType.insuranceVerificationCodeId;
                this.isEditMode = false;
                this.isDeleteMode = false;

                this.vm_isLoading = false;
                this.vm_selectedColor = serviceType.colorHex;
                this.vm_serviceName = serviceType.description;
                this.vm_serviceCode = findMedicalCodeText(this.insuranceVerificationCodeId, this.medicalCodes);
                this.vm_apptLength = serviceType.appointmentLengthMinutes;
                this.vm_fee = serviceType.baseFee;
                this.sortOrder = serviceType.sortOrder;
                this.appointmentType = serviceType.appointmentType;

                this.vm_isServiceNameError = false;
                this.vm_isServiceCodeError = true;
                this.vm_isServiceLenghtError = false;
                this.vm_isServiceFeeError = false;
                

                this.setEditMode = function(value) {
                    this.set("isEditMode", value);
                    this.trigger("change", {field: "vm_isDeleteButtonVisible"});
                    this.trigger("change", {field: "vm_isNameEditAllow"});
                };

                this.setDeleteMode = function(value) {
                    this.set("isDeleteMode", value);
                    this.trigger("change", {field: "vm_isDeleteButtonVisible"});
                };

                this.setMedicalCodes = function(medicalCodes) {
                    this.set("medicalCodes", medicalCodes.slice());
                    this.set("vm_serviceCode",findMedicalCodeText(this.insuranceVerificationCodeId, this.medicalCodes));
                };
                
                this.vm_onSaveClick = function(e) {
                    $(e.currentTarget).focus(); // HTML button do not receive focus when we click on it. So we have to set focus. 

                    var errors = this._validate();
                    if(errors.length > 0) {
                        $snapNotification.error(errors.join(" "));
                        return;
                    }

                    var serviceType = {
                        providerId: snap.hospitalSession.hospitalId, //Note in this API provider is a hospital.
                        serviceTypeId: this.serviceTypeId,
                        colorHex: this.vm_selectedColor.replace("#", ""),
                        description: this.vm_serviceName,
                        insuranceVerificationCodeId: this.insuranceVerificationCodeId,
                        appointmentLengthMinutes: this.vm_apptLength,
                        baseFee: this.vm_fee,
                        appointmentType: this.appointmentType,
                        sortOrder: this.sortOrder
                    };

                    this.set("vm_isLoading", true);

                    var dfd = null;
                    var that = this;

                    if(serviceType.serviceTypeId !== null) {
                        dfd = $serviceTypesService.update(serviceType);
                    } else {
                        dfd = $serviceTypesService.create(serviceType).done(function(data) {
                            that.serviceTypeId = data.serviceTypeId;
                            $eventAggregator.publish("createServiceType", that.appointmentType);
                        });
                    }

                    dfd.always(function() {
                        that.set("vm_isLoading", false);
                    }).error(function(error) {
                        window.console.error(error);

                        var errMessage = $utility.formatErrorMessage(error);
                        $snapNotification.error(errMessage);
                    }).done(function(){
                        that.setEditMode(false);
                    });
                };

                this.vm_onCancelClick = function(e) {
                    $(e.currentTarget).focus(); // HTML button do not receive focus when we click on it. So we have to set focus. 

                    if(this.serviceTypeId !== null) {
                        this.setEditMode(false);

                        if(internalState) {
                            this.set("vm_selectedColor", internalState.colorHex);
                            this.set("vm_serviceName", internalState.description);
                            this.set("insuranceVerificationCodeId", internalState.insuranceVerificationCodeId);
                            this.set("vm_apptLength", internalState.appointmentLengthMinutes);
                            this.set("vm_fee", internalState.baseFee);

                            this.set("vm_serviceCode",findMedicalCodeText(this.insuranceVerificationCodeId, this.medicalCodes));

                            internalState = null;
                        }   
                    } else {
                         $eventAggregator.publish("deleteServiceType", this);
                    }
                };

                this.vm_onEditClick = function(e) {
                    $(e.currentTarget).focus(); // HTML button do not receive focus when we click on it. So we have to set focus. 

                    this.setEditMode(true);

                    internalState = {
                        colorHex: this.vm_selectedColor.replace("#", ""),
                        description: this.vm_serviceName,
                        insuranceVerificationCodeId: this.insuranceVerificationCodeId,
                        appointmentLengthMinutes: this.vm_apptLength,
                        baseFee: this.vm_fee,
                    };
                };

                this.vm_onDeleteClick = function(e) {
                    $(e.currentTarget).focus(); // HTML button do not receive focus when we click on it. So we have to set focus. 

                    $snapNotification.hideAllConfirmations();

                    var that = this;
                    $snapNotification.confirmationWithCallbacks("Are you sure you want delete this Service?", 
                    function yesClb() {
                        that.set("vm_isLoading", true);

                        $serviceTypesService.delete(that.serviceTypeId).done(function(){
                            $eventAggregator.publish("deleteServiceType", that);
                        }).fail(function(error){
                            window.console.error(error);

                            var errMessage = $utility.formatErrorMessage(error);
                            $snapNotification.error(errMessage);
                        }).always(function() {
                            that.set("vm_isLoading", false);
                        });
                    });
                };

                this.vm_onMedicalCodeChange = function() {
                    this.set("vm_serviceCode",findMedicalCodeText(this.insuranceVerificationCodeId, this.medicalCodes));
                };

                this.vm_isDeleteButtonVisible = function() {
                    return !this.isEditMode && this.isDeleteMode;
                };

                this.vm_isNameEditAllow = function() {
                     return this.isEditMode && this.appointmentType === $scheduleCommon.appointmentTypeCode.clinicianScheduled;
                };

                this._validate = function() {
                    this.set("vm_isServiceNameError", false);
                    this.set("vm_isServiceLenghtError", false);
                    this.set("vm_isServiceFeeError", false);
                    this.isServiceCodeError = false;

                    var errors = [];
                    if(this.vm_serviceName === "" || !/\S/.test(this.vm_serviceName)) {
                        this.set("vm_isServiceNameError", true);
                        errors.push("Please provide a service name.");
                    }

                    if(this.insuranceVerificationCodeId === null) {
                        $("#" + this.recordId).find(".service__drop").addClass("is-error");

                        this.isServiceCodeError = true;
                        errors.push("Please provide a code.");
                    }

                    var that = this;
                    var typesWithSameName = getSiblingServiceTypes(this.serviceTypeId).filter(function(serviceType){
                        return serviceType.vm_serviceName === that.vm_serviceName;
                    });

                    if(typesWithSameName.length > 0) {
                        this.set("vm_isServiceNameError", true);
                        errors.push("Service with such name already exists.");
                    }

                    if (that.vm_apptLength === null || that.vm_apptLength === "") {
                        this.set("vm_isServiceLenghtError", true);
                        errors.push("Please provide a sevice lenght.");
                    }

                    if (that.vm_fee === null || that.vm_fee === "") {
                        this.set("vm_isServiceFeeError", true);
                        errors.push("Please provide a service fee.");
                    }

                    this._triggerNonMVVM();
                    
                    return errors;
                };

                function findMedicalCodeText(id, medicalCodes) {
                    var text = "";
                    for(var i = 0; i < medicalCodes.length; i++) {
                        if(medicalCodes[i].id === id) {
                            return medicalCodes[i].text;
                        }
                    }

                    return text;
                }

                this._triggerNonMVVM = function() {
                    var $serviceDropdown = $("#" + this.recordId).find(".service__drop");
                    if(this.isServiceCodeError) {
                        $serviceDropdown.addClass("is-error");
                    } else {
                        $serviceDropdown.removeClass("is-error");
                    }
                };
            }

            function ServiceCathegory(serviceCathegoty) {
                var services = [],
                    medicalCodes = [],
                    textFilter = "";

                this.appointmentType = serviceCathegoty.appointmentType;
                this.cathegoryId = "serviceCathegory_" + serviceCathegoty.appointmentType;
                this.vm_addNewServices = serviceCathegoty.addNewServices;
                this.vm_cathegoryName = serviceCathegoty.cathegoryName;


                this.setMedicalCodes = function(сodes) {
                    medicalCodes = сodes;

                    services.forEach(function(service) {
                        service.setMedicalCodes(medicalCodes);
                    });
                };

                this.filter = function(text) {
                    textFilter = text;

                    this.trigger("change", { field: "vm_services" });
                    this.trigger("change", { field: "vm_isSearchEmpty" });
                };

                this.setServices = function(serviceTypes) {
                    var that = this;
                    services = serviceTypes.filter(function(serviceType) {
                        //return true; //ToDo: Test only!
                        return serviceType.appointmentType === that.appointmentType;
                    })
                    .sort(sortByOrder)
                    .map(function(serviceType) {
                        return kendo.observable(new ServiceType(serviceType, medicalCodes, getSiblingServiceTypes));
                    });

                    this._updateServiceState();
                };

                this.load = function() {
                    var that = this;
                    $eventAggregator.subscriber("deleteServiceType", function(serviceType) {
                        var i = services.indexOf(serviceType);
                        if(i >= 0) {
                            services.splice(i, 1);
                        }

                        that._updateServiceState();
                    });

                    $eventAggregator.subscriber("createServiceType", function(appointmentType) {
                        if (appointmentType === that.appointmentType) {
                            reorderServiceTypes();
                            that._updateServiceState();
                        }
                        
                    });
                    
                   this._loadScript();
                };

                this.vm_onAddNewServicesClick = function(e) {
                    var serviceType = kendo.observable(
                        new ServiceType(
                            {
                                serviceTypeId: null,
                                appointmentType: this.appointmentType,
                                colorHex: "d4735e",
                                description: "",
                                insuranceVerificationCodeId: null,
                                appointmentLengthMinutes: 1,
                                baseFee: 0,
                                sortOrder: 0 //We put dummy sort order. This will be changed on reorder.
                            },
                            medicalCodes,
                            getSiblingServiceTypes
                        )
                    );

                    serviceType.setEditMode(true);

                    services.push(serviceType);

                    this._updateServiceState();

                    e.preventDefault();
                    return false;
                };

                this.vm_services = function() {
                    var arr = services;

                    // Instead of checking the entire string to see if there's only whitespace, just check to see if there's at least one character of non whitespace:
                    if(textFilter && /\S/.test(textFilter)) {
                        var filter = textFilter.toLowerCase();

                        arr =  services.filter(function(s) {
                            // if this is a new row we ignore it because user did not saved it yet, so we do not know what name it will have.
                            if(s.serviceTypeId === null) {
                                return true;
                            } else {
                                return s.vm_serviceName.toLowerCase().indexOf(filter) !== -1 || s.vm_serviceCode.toLowerCase().indexOf(filter) !== -1;
                            }   
                        });
                    }

                    return arr;
                };

                this.vm_isSearchEmpty = function() {
                    return this.vm_services().length === 0;
                };

                this.vm_servicesCount = function() {
                    return this._getExistedItems().length + " item(s)";
                };

                this._updateServiceState = function() {
                    var canDeleteExistedService = this._getExistedItems().length > 1;

                    services.forEach(function(service) {
                        service.setDeleteMode(service.serviceTypeId === null ? true : canDeleteExistedService);
                    });

                    this.trigger("change", { field: "vm_services" });
                    this.trigger("change", { field: "vm_servicesCount" });
                    this.trigger("change", { field: "vm_isSearchEmpty" });
                };

                this._getExistedItems = function() {
                    return services.filter(function(service){
                        return service.serviceTypeId !== null;
                    });
                };

                this._loadScript = function() {
                    $("#" + this.cathegoryId).find('.js-sortable-container').each(function(){
                        $(this).kendoSortable({
                            container: $(this),
                            handler: '.js-sortable-item:not(.is-opened) .js-sortable-handler',
                            axis: 'y',
                            ignore: "input",
                            start: function() {
                                $('.js-sortable-item').each(function(){
                                    if (!$(this).closest('.js-sortable-container').length){
                                        $(this).width($('.js-sortable-container').width());
                                    }   
                                });
                            },
                            change: function(e) {
                                var item = services.splice(e.oldIndex, 1)[0]; //remove the item that has changed its order
                                services.splice(e.newIndex, 0, item); //add the item back using the newIndex

                                reorderServiceTypes();
                            }
                        });
                    });
                };

                function getSiblingServiceTypes(serviceTypeId) {
                    return services.filter(function(serviceType) {
                        return serviceType.serviceTypeId !== null && serviceType.serviceTypeId != serviceTypeId;
                    });
                }

                function reorderServiceTypes() {
                    var i = 0,
                        servicesOrder = [];

                    services.forEach(function(service) {
                        if(service.serviceTypeId !== null) {
                            servicesOrder.push({
                                serviceTypeId: service.serviceTypeId,
                                sortOrder: i++
                            });
                        }
                    });

                    $serviceTypesService.reorder(servicesOrder).fail(function(error) {
                        window.console.error(error);
                    
                        var errMessage = $utility.formatErrorMessage(error);
                        $snapNotification.error(errMessage);
                    });
                }

                function sortByOrder(a, b) {
                    if(a.sortOrder > b.sortOrder) 
                        return 1;

                    if(a.sortOrder < b.sortOrder)
                        return -1;

                    return 0;
                }
            }

            this.createServiceCathegory = function(serviceCathegoty) {
                return kendo.observable(new ServiceCathegory(serviceCathegoty));
            };
        }).singleton();
}(jQuery, snap, kendo));

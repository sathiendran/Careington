//@ sourceURL=familyGroupSelector.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue").use(["snapNotification", "snap.common.endlessScroll","snap.common.schedule.ScheduleCommon","snap.service.selfSchedulingService", "snap.DataService.customerDataService", "snap.common.navigationHelper"])
        .define("familyGroupSelector", function ($snapNotification, $endlessScroll, $scheduleCommon, $selfSchedulingService, $customerDataService, $navigationHelper) {
            function FamilyGroupList(opt) {
                var checkboxStateClassName = "is-active";
                var uiElementsIdPrefix = "cs_";

                //****************** Call BASE constructor ********************
                $endlessScroll.getConstcurtor().call(this, opt);

                this._getItemsNotFoundHtml = function() {
                    return $("#noPatientFound").html();
                };

                this._getHeaderHtml = function() {
                    //Implement if necessary.
                    return "";
                };

                this._getItemTemplate = function() {
                    return kendo.template($('#patientSelector_item').html());
                };

                this._getData = function(take, skip) {
                    var filter = this.filters();

                    var requestPayload = {
                        search: filter.search,
                        take: take,
                        skip: skip
                    };

                    var promise = $.Deferred();

                    $selfSchedulingService.getFamillyGroup(requestPayload).done(function(result) {
                        var items = result.data.map(function (patient) {
                            patient.person.providerId = patient.providerId;

                            var firstName = "";
                            if(patient.person && patient.person.name) {
                                firstName = patient.person.name.given;
                            }

                            return {
                                id: patient.patientId,
                                name: $scheduleCommon.getFullName(patient.person),
                                firstName: firstName,
                                info: $scheduleCommon.getPhoneNumber(patient.person),
                                personId: patient.person.id,
                                imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                data: patient
                            };
                        });

                        promise.resolve({
                            data: items,
                            total: result.total
                        });
                    }).fail(function(error) {
                        promise.reject(error);
                    });

                    return promise;
                };

                this._selectUiElement = function(item, value) {
                    var $checkbox = $("#" + uiElementsIdPrefix + item.id).find(".checkbox");

                    slectUIElement($checkbox, value);
                };

                this._concreteListLoadDetails = function(htmlContainerId) {
                    var that = this;
                    $(htmlContainerId).on('click', '.js-patient', function() {
                        var id = Number($(this).attr('id').substring(uiElementsIdPrefix.length));

                        if($(this).find(".checkbox").hasClass(checkboxStateClassName)) {
                            that.unselectItemById(id);
                        } else {
                            that.selectItemById(id); 
                        } 
                    });

                    $(htmlContainerId).on('click', '.js-view-patient-profile', function(e) {
                        e.stopPropagation();
                        var patientId = Number($(this).parent().attr('id').substring(uiElementsIdPrefix.length));

                        $navigationHelper.patient.goToPatietProfile({ patientId: patientId });
                    });
                };

                function slectUIElement($checkbox, value) {
                    if(value) {
                        $checkbox.addClass(checkboxStateClassName);
                    } else {
                        $checkbox.removeClass(checkboxStateClassName);
                    }
                }
            }

            this.createFamilyGroupSelectorSelector = function(opt) {
                return new FamilyGroupList(opt);
            };
        }).singleton();
}(jQuery, snap, kendo));
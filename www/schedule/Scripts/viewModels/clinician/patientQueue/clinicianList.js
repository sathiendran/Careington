//@ sourceURL=clinicianSelector.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue").use([
        "snap.common.endlessScroll",
        "snap.common.schedule.ScheduleCommon",
        "snap.service.staffAccountService"])
        .define("clinicianSelector", function ($endlessScroll, $scheduleCommon, $staffAccountService) {
            function ClinicianList(opt) {
                var checkboxStateClassName = "is-active";
                var uiElementsIdPrefix = "cs_";

                var groups = [];
                var headerTemplate = null;


                this.getGroups = function() {
                    return groups;
                };

                this.refreshHeader = function() {
                    var $checkbox = $( this.getHtmlContainerId()).find('.js-all-provider .checkbox');
                    slectUIElement($checkbox, snap.util.arrayContains(this.getSelectedItems(), this.getVisibleItems(), "id"));
                };

                //****************** Call BASE constructor ********************
                $endlessScroll.getConstcurtor().call(this, opt);

                this._getItemsNotFoundHtml = function() {
                    return $("#noProviderFound").html();
                };

                this._getHeaderHtml = function() {
                    var html = "";

                    if(headerTemplate === null) {
                        headerTemplate = kendo.template($('#providerSelector_selectAllItem').html());
                    }

                    if(this.filters().groupFilter) {
                        html = headerTemplate({isChecked: snap.util.arrayContains(this.getSelectedItems(), this.getVisibleItems(), "id")});
                    }

                    return html;
                };

                this._getItemTemplate = function() {
                    return kendo.template($('#providerSelector_item').html());
                };

                this._getData = function(take, skip) {
                    var filter = this.filters();

                    var requestPayload = {
                        search: filter.nameFilter
                    };

                    // we do not use take and skip with filter by group, because we need to use "Select All" option.
                    if(filter.groupFilter) {
                        requestPayload.groupIds = [filter.groupFilter.groupId];
                    } else {
                        requestPayload.take = take;
                        requestPayload.skip = skip;
                    }

                    var promise = $.Deferred();

                    $staffAccountService.getAllStaffAccountsForScheduling(requestPayload).done(function(result) {
                        var items = result.data.map(function(clinician) {
                            return {
                                id: clinician.userId,
                                name: $scheduleCommon.getFullName(clinician.person),
                                imageSource: clinician.person.photoUrl || getDefaultProfileImageForClinician(),
                                email: clinician.email,
                                data: clinician,
                            }; 
                        });

                        // We cashe groups if they have at least one provider.
                        if(filter.groupFilter && filter.nameFilter === "" && items.length > 0) {
                            groups[filter.groupFilter.groupId] = {
                                id: filter.groupFilter.groupId,
                                name: filter.groupFilter.name,
                                providers: items
                            };
                        }

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
                    $(htmlContainerId).on('click', '.js-provider', function() {
                        var id = Number($(this).attr('id').substring(uiElementsIdPrefix.length));

                        if($(this).find(".checkbox").hasClass(checkboxStateClassName)) {
                            that.unselectItemById(id);

                            slectUIElement($(htmlContainerId).find('.js-all-provider .checkbox'), false);
                        } else {
                            that.selectItemById(id); 

                            if(snap.util.arrayContains(that.getSelectedItems(), that.getVisibleItems(), "id")) {
                                slectUIElement($(htmlContainerId).find('.js-all-provider .checkbox'), true);
                            }
                        } 
                    });

                    $(htmlContainerId).on('click', '.js-all-provider', function() { 
                        var $checkbox = $(this).find(".checkbox");

                        if($checkbox.hasClass(checkboxStateClassName)) {
                            that.unselectAll();
                            slectUIElement($checkbox, false);
                        } else {
                            that.selectAll(); 
                            slectUIElement($checkbox, true);
                        }                   
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

            this.createClinicianSelector = function(opt) {
                return new ClinicianList(opt);
            };
        }).singleton();
}(jQuery, snap, kendo));
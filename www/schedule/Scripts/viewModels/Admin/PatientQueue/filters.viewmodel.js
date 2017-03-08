//@ sourceURL=filters.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.patientQueue").use([
        "snap.EventAggregator", 
        "snap.service.staffAccountService", 
        "snap.service.locationService",
        "snap.common.schedule.ScheduleCommon"])
        .extend(kendo.observable)
        .define("filters", function ($eventAggregator, $staffAccountService, $locationService, $scheduleCommon) {
            var filterCathegory = {
                genders: "genders",
                waitTimes: "waitTimes",
                flags: "flags",
                timeFrames: "timeFrames",
                providers: "providers",
                locations: "locations",
                statuses: "statuses",
                apptTypes: "apptTypes",

                getAllCathegories: function() {
                    return [this.genders, this.waitTimes, this.flags, this.timeFrames, this.providers, this.locations, this.statuses, this.apptTypes];
                },

                getTimeDependetCathegories: function() {
                    return [this.waitTimes, this.timeFrames];
                }
            };

            var $scope = this;
            $eventAggregator.subscriber("patientQueueFilters_change", function(){
                $scope.trigger("change", { field: "vm_isClearAllVisible" });

                //ToDo: testOnly! We need mto do this only when selected cathegory changed!
                if($scope.selectedCathegory) {
                    $scope.trigger("change", { field: "vm_isClearFilterDetailsVisible" });
                    $scope.selectedCathegory.trigger("change", {field: "vm_filters"});
                }
            });

            $eventAggregator.subscriber("patientQueueFilters_showFilterDetails", function(filterName) {
                $scope.showCathegoryDetails(filterName);
            });

            this.showCathegoryDetails = function(filterName) {
                var filter = this[filterName];

                if(filter) {
                    filter.vm_clearTextFilter();

                    this.set("vm_showCathegotyDetailsPanel", true);
                    this.set("selectedCathegory", filter);
                    this.trigger("change", { field: "vm_isClearFilterDetailsVisible" });
                }
            };

            this.selectedCathegory = null;

            this[filterCathegory.genders] = kendo.observable(new Cathegory(
            { 
                name: "Gender", 
                template: "filter", 
                isScheduledOnly: false 
            }, 
            [
                new Filter("Male", "Male", filterByGender),
                new Filter("Female", "Female", filterByGender)
            ]));

            this[filterCathegory.waitTimes] =  kendo.observable(new Cathegory(
            { 
                name: "Wait time", 
                template: "filter", 
                isScheduledOnly: false 
            },
            [
                new Filter("more than 10 min", 10, filterByWhaitTimeGreatThan),
                new Filter("more than 20 min", 20, filterByWhaitTimeGreatThan),
                new Filter("more than 30 min", 30, filterByWhaitTimeGreatThan),
                new Filter("less than 10 min", 10, filterByWhaitTimeLessThan),
                new Filter("less than 20 min", 20, filterByWhaitTimeLessThan),
                new Filter("less than 30 min", 30, filterByWhaitTimeLessThan)
            ]));

            this[filterCathegory.flags] = kendo.observable(new Cathegory(
            { 
                name: "Flag", 
                template: "flagFilter", 
                isScheduledOnly: false 
            }, 
            [
                new Filter("blue", 1, filterByFlag),
                new Filter("green", 2, filterByFlag),
                new Filter("yellow", 3, filterByFlag),
                new Filter("red", 4, filterByFlag)
            ]));

            this[filterCathegory.timeFrames] = kendo.observable(new Cathegory(
            { 
                name: "Appt. Time Frame  <span class=\'panel-filter__qualifer\'>(Scheduled ONLY)</span>",
                template: "filter", 
                isScheduledOnly: true 
            }, 
            [
                new Filter("Late", 0, filterByTimeFrame),
                new Filter("next 15 min", 15, filterByTimeFrame),
                new Filter("next 30 min", 30, filterByTimeFrame),
                new Filter("next 60 min", 60, filterByTimeFrame)
            ]));

            this[filterCathegory.statuses] = kendo.observable(new Cathegory(
            { 
                name: "Status", 
                template: "filter", 
                isScheduledOnly: false
            }, 
            [
                new Filter("In Review", true, filterByStatus),
                new Filter("Available", false, filterByStatus)
            ]));

            this[filterCathegory.apptTypes] = kendo.observable(new Cathegory(
            { 
                name: "Appointment Type <span class=\'panel-filter__qualifer\'>(Scheduled ONLY)</span>",
                template: "filter", 
                isScheduledOnly: true
            }, 
            [
                new Filter("Admin Scheduled", 1, filterByApptType),
                //new Filter("On Demand", 2, filterByApptType),
                new Filter("Patient Scheduled", 3, filterByApptType)
            ]));


            this[filterCathegory.providers] = kendo.observable(new ProviderCathegory());

            this[filterCathegory.locations] = kendo.observable(new LocationCathegory());

            this.updateFilterInfo = function(patientCards) {
                this[filterCathegory.providers].updateDynamicFiltersList(patientCards);
                this[filterCathegory.locations].updateDynamicFiltersList(patientCards);

                this.updateFilterMatchInfo(patientCards, filterCathegory.getAllCathegories());
            };

            this.updateTimeDependentFilterInfo = function(patientCards) {
                this.updateFilterMatchInfo(patientCards, filterCathegory.getTimeDependetCathegories());
            };

            this.updateFilterMatchInfo = function(patientCards, cathegories) {
                var that = this;
                cathegories.forEach(function(сathegory) {
                    that[сathegory].updateFilterMatchInfo(patientCards);
                });                
            };

            this.filter = function(consultations, opt) {
                var arr = consultations.filter(function(item) {
                    return item.isScheduled === opt.isScheduled; 
                });

                //Instead of checking the entire string to see if there's only whitespace, just check to see if there's at least one character of non whitespace:
                if(this.vm_nameFilter && /\S/.test(this.vm_nameFilter)) {
                    var nameFilter = this.vm_nameFilter.toLowerCase();

                    arr = arr.filter(function(item) {
                        return item.get("patientName").toLowerCase().indexOf(nameFilter) !== -1; 
                    });
                }

                var that = this;
                filterCathegory.getAllCathegories().forEach(function(cathegory) {
                    var cathegoryObj = that[cathegory];

                    // If cathegory only for scheduled consultations we should ignore OnDemand lists.
                    if(cathegoryObj.isScheduledOnly && !opt.isScheduled) {
                        return;
                    }

                    arr = cathegoryObj.filter(arr);
                });

                return arr;
            };

            this.isAllFiltersClear = function() {
                if(this.vm_nameFilter && /\S/.test(this.vm_nameFilter)) {
                    return false;
                }

                var all = filterCathegory.getAllCathegories();
                for(var i = 0; i < all.length; i++) {
                    if(this[all[i]].getSelectedFilters().length > 0) {
                        return false;
                    }
                }

                return true;
            };

            //*********************************** MVVM BINDINGS *******************************************
            //filters
            this.vm_nameFilter = "";
            this.vm_showCathegotyDetailsPanel = false;

            this.vm_onNameFilterChange = function() {
                $eventAggregator.publish("patientQueueFilters_change");
                this.trigger("change", {field: "vm_isNameFilterNotEmpty"});
            };
            
            this.vm_isClearAllVisible = function() { 
                return !this.isAllFiltersClear();
            };

            this.vm_isNameFilterNotEmpty = function() {
                return !!this.vm_nameFilter.length;
            };

            this.vm_clearNameFilter = function() {
                this.set("vm_nameFilter", "");
                this.trigger("change", {field: "vm_isNameFilterNotEmpty"});
                $eventAggregator.publish("patientQueueFilters_change");
            };

            this.vm_onClearAllClick = function() {
                this._clearAllFilters();

                $eventAggregator.publish("patientQueueFilters_change");
            };

            this.vm_onClearCathegotyDetailsClick = function() {
                if(this.selectedCathegory) {
                    this.selectedCathegory.vm_clearTextFilter();
                    this.selectedCathegory.cathegoryFiltersList.forEach(function(filter) {
                        filter.set("isFilterChecked", false);
                    });
                }

                $eventAggregator.publish("patientQueueFilters_change");
            };

            this.vm_isClearFilterDetailsVisible = function() {
                if(this.selectedCathegory) 
                {
                    return this.selectedCathegory.getSelectedFilters().length > 0;
                }

                return false;
            };

            this.vm_onHideCathegotyDetailsClick = function() {
                this.set("vm_showCathegotyDetailsPanel", false);
            };

            this.vm_onClearSelectedCathegoryClick = function() {
                if(this.selectedCathegory) {
                    this.selectedCathegory.cathegoryFiltersList.forEach(function(filter) {
                        filter.set("isFilterChecked", false);
                    });
                }
            };


            this._clearAllFilters = function() {
                var that = this;

                this.vm_clearNameFilter();

                filterCathegory.getAllCathegories().forEach(function(cathegory) {
                    that[cathegory].cathegoryFiltersList.forEach(function(filter) {
                        filter.set("isFilterChecked", false);
                    });
                });
            };

            function Filter(name, value, action) {
                this.filterName = name;
                this.isFilterChecked = false;
                this.matchCount = 0;

                this.value = typeof(value) !== "undefined" ? value : name;
                
                this.vm_filterInfo = function() {
                    return [this.filterName, " ", this.vm_matchCountInfo()].join("");
                };

                this.vm_matchCountInfo = function() {
                    return ["<span>(", this.matchCount, ")</span>"].join("");
                };

                this.vm_onFilterCheck = function() {
                    $eventAggregator.publish("patientQueueFilters_change");
                };

                this.isMatch = function(patientCard) {
                    return action(patientCard, this.value);
                };

                this.updateMatchCount = function(matchCount) {
                    this.matchCount = matchCount;
                    this.trigger("change", { field: "vm_matchCountInfo"});
                    this.trigger("change", { field: "vm_filterInfo"});
                };
            }

            function Cathegory(opt, filters) {
                this.vm_isCathegoryOpen = true;
                this.vm_cathegoryName = opt.name;
                this.vm_template = opt.template;
                this.isScheduledOnly = opt.isScheduledOnly;
                this.cathegoryFiltersList = filters;
                
                this.isDynamicFilter = false;

                this.vm_isCategoryClosed = function() {
                    return !this.vm_isCathegoryOpen;
                };
                
                this.vm_onCathegoryToogle = function() {
                    this.set("vm_isCathegoryOpen", !this.vm_isCathegoryOpen);
                    this.trigger("change", { field: "vm_isCategoryClosed" });
                };

                this.vm_filters = function() {
                    return this.cathegoryFiltersList;
                };

                this.filter = function(patientCards) {
                    var filters = this.getSelectedFilters();

                    var arr = patientCards;
                    if(filters.length > 0) {
                        arr = patientCards.filter(function(card) {
                            for(var i = 0; i <filters.length; i++) {
                                if(filters[i].isMatch(card)) {
                                    return true;
                                }
                            }

                            return false;
                        });
                    }

                    return arr;
                };

                this.updateFilterMatchInfo = function(patientCards) {
                    var cards = patientCards;
                    if(this.isScheduledOnly) {
                        cards = cards.filter(function(card) {
                            return card.isScheduled;
                        });
                    }

                    this.cathegoryFiltersList.forEach(function(filter) {
                        var matchCount = cards.filter(function(card) {
                            return filter.isMatch(card);
                        });

                        filter.updateMatchCount(matchCount.length);
                    });
                };

                this.getSelectedFilters = function() {
                    var selected = [];

                    this.cathegoryFiltersList.forEach(function(filter) {
                        if(filter.isFilterChecked) {
                            selected.push(filter);
                        }
                    });

                    return selected;
                };
            }

            function DynamicCathegory(name, template) {
                var maxElementsInFilter = 10;
                var isFullFiltersListLoaded = false;

                var currentConsultationsFiltersDict = {};

                //****************** Call BASE constructor ********************
                Cathegory.call(this, name, template, []);

                this.isDynamicFilter = true;

                this.updateDynamicFiltersList = function(consultations) {
                    currentConsultationsFiltersDict = this._getCurrentConsultationsFiltersDict(consultations);

                    var existedFiltersDict = this._filtersArrayToDictionary(this.cathegoryFiltersList);

                    var filtersDict = $.extend({}, currentConsultationsFiltersDict, existedFiltersDict);
                    this.set("cathegoryFiltersList", this._filtersDictionaryToArray(filtersDict));
                    this.trigger("change", {field: "vm_filters"});
                    this.trigger("change", {field: "vm_allFilters"});
                };

                this.vm_filters = function() {
                    var filtersDict = $.extend({}, currentConsultationsFiltersDict, this._getSelectedFiltersDict());
                    var cathegoryFiltersDict = this._filtersArrayToDictionary(this.cathegoryFiltersList);

                    var filtersArr = [];
                    for (var k in filtersDict) {
                        if (filtersDict.hasOwnProperty(k) && cathegoryFiltersDict[k]) {
                            filtersArr.push(cathegoryFiltersDict[k]);
                        }
                    }

                    if(filtersArr.length > maxElementsInFilter) {
                        filtersArr.splice(maxElementsInFilter, filtersArr.length);
                    }

                    return filtersArr.sort(sortFiltersBySelectionsAndNames);
                };

                this.vm_filterListEmpty = false;
                this.vm_allFilters = function() {
                    var arr = this.cathegoryFiltersList;

                    // Instead of checking the entire string to see if there's only whitespace, just check to see if there's at least one character of non whitespace:
                    if(this.vm_textFilter && /\S/.test(this.vm_textFilter)) {
                        var textFilter = this.vm_textFilter.toLowerCase();

                        arr = arr.filter(function(m) {
                            return m.filterName.toLowerCase().indexOf(textFilter) !== -1; 
                        });
                    }

                    this.set("vm_filterListEmpty", arr.length === 0);

                    return arr;
                };

                this.vm_textFilter = "";
                this.vm_onTextFilterChange = function() {
                    this.trigger("change", {field: "vm_isTextFilterNotEmpty"});
                    this.trigger("change", {field: "vm_allFilters"});
                };
                this.vm_isTextFilterNotEmpty = function() {
                    return !!this.vm_textFilter.length;
                };

                this.vm_clearTextFilter = function() {
                    this.set("vm_textFilter", "");
                    this.vm_onTextFilterChange();
                };

                this.vm_onShowMoreClick = function() {
                    if(!isFullFiltersListLoaded) {
                        isFullFiltersListLoaded = true;
                        this._loadAllFilters();
                    }

                    $eventAggregator.publish("patientQueueFilters_showFilterDetails", this._name);
                };

                this._getSelectedFiltersDict = function() {
                    var filters = {};
                    this.getSelectedFilters().forEach(function(filter) {
                        filters[filter.value] = filter;
                    });

                    return filters;
                };

                this._getCurrentConsultationsFiltersDict = function(consultations) {
                    var filters = {};

                    var that = this;
                    consultations.forEach(function(consultation) {
                        var filter = that._createFilterFromConsultation(consultation);
                        if(filter && !filters[filter.value]) {
                            filters[filter.value] =  kendo.observable(filter);
                        }
                    });

                    return filters;
                };

                this._filtersArrayToDictionary = function(filtersArr) {
                    var filtersDict = {};
                    filtersArr.forEach(function(filter) {
                        filtersDict[filter.value] = filter;
                    });

                    return filtersDict;
                };

                this._filtersDictionaryToArray = function(filtersDict) {
                    var filtersArr = [];
                    for (var k in filtersDict) {
                        if (filtersDict.hasOwnProperty(k)) {
                            filtersArr.push(filtersDict[k]);
                        }
                    }

                    return filtersArr;
                };

                this._addFilters = function(filters) {
                    var currentFilters = this._filtersArrayToDictionary(this.cathegoryFiltersList);

                    // We do not add filter if it already exist.
                    var allfilters = this._filtersDictionaryToArray($.extend({}, filters, currentFilters));

                    allfilters.sort(sortFiltersByName);

                    this.set("cathegoryFiltersList", allfilters);
                    this.trigger("change", {field: "vm_allFilters"});
                };
            }

            function ProviderCathegory() {
                this._name = filterCathegory.providers;

                //****************** Call BASE constructor ********************
                DynamicCathegory.call(
                    this, 
                    { 
                        name: "Providers <span class=\'panel-filter__qualifer\'>(Scheduled ONLY)</span>",
                        template: "filter", 
                        isScheduledOnly: true 
                    }, 
                    []
                );

                this._createFilterFromConsultation = function(consultation) {
                    if(consultation.isScheduled && consultation.doctorProfile) {
                        return new Filter(
                            consultation.doctorProfile.Name,
                            consultation.doctorProfile.UserId,
                            filterByProvider);
                    }

                    return null;
                };

                this._loadAllFilters = function() {
                    var that = this;
                    $staffAccountService.getAllStaffAccountsForScheduling({}).done(function(result) {
                        var filters = {};
                        result.data.forEach(function(clinician) {
                            filters[clinician.userId] =  kendo.observable(new Filter(
                                $scheduleCommon.getFullName(clinician.person),
                                clinician.userId,
                                filterByProvider
                            ));
                        });

                        that._addFilters(filters);
                    });
                };
            }

            function LocationCathegory() {
                this._name = filterCathegory.locations;

                //****************** Call BASE constructor ********************
                DynamicCathegory.call(
                    this,
                    { 
                        name: "Location", 
                        template: "filter", 
                        isScheduledOnly: false 
                    },
                    []
                );

                this._createFilterFromConsultation = function(consultation) {
                    if(consultation.state) {
                        return new Filter(
                            consultation.state,
                            consultation.state,
                            filterByLocation);
                    }

                    return null;
                };

                this._loadAllFilters = function() {
                    var that = this;

                    $locationService.getPostalCodes({countryCode: "US"}).done(function(result) {
                        var filters = {};
                        result.data.forEach(function(state) {
                            filters[state.state] =  kendo.observable(new Filter(
                                state.state,
                                state.state,
                                filterByLocation
                            ));
                        });

                        that._addFilters(filters);
                    });
                };
            }

            function filterByGender(patientCard, value) {
                return patientCard.gender === value;
            }

            function filterByFlag(patientCard, value) {
                return patientCard.flag === value;
            }

            function filterByWhaitTimeGreatThan(patientCard, value) {
                return patientCard.waitingTimeInSeconds > value * 60;
            }

            function filterByWhaitTimeLessThan(patientCard, value) {
                return patientCard.waitingTimeInSeconds < value * 60;
            }

            function filterByTimeFrame(patientCard, value) {
                var remainedTime = patientCard.getRemainedTimeInMinutesBeforeStart();
                return value > remainedTime;
            }

            function filterByProvider(patientCard, value) {
                if(patientCard.doctorProfile) {
                    return patientCard.doctorProfile.UserId === value;
                }

                return false;
            }

            function filterByLocation(patientCard, value) {
                return patientCard.state === value;
            }

            function filterByStatus(patientCard, value) {
                return patientCard.vm_isLocked ===  value;
            }

            function filterByApptType(patientCard, value) {
                return patientCard.appointmentType === value;
            }

            function sortFiltersBySelectionsAndNames(a, b) {
                if(a.isFilterChecked === b.isFilterChecked) {
                    return sortFiltersByName(a, b);
                }
                else if (a.isFilterChecked) {
                    return -1;
                } else if (b.isFilterChecked) {
                    return 1;
                }

                //This should never happens.
                return 0;
            }

            function sortFiltersByName(a, b) {
                var aName = a.filterName.toLowerCase();
                var bName = b.filterName.toLowerCase();

                if(aName < bName) return -1;
                if(aName > bName) return 1;
                return 0;
            }
        }).singleton();
}(jQuery, snap, kendo));

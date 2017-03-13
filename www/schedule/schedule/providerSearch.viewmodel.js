//@ sourceURL=providerSearch.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snapNotification", "snap.EventAggregator",
            "snap.service.selfSchedulingService",
            "snap.patient.schedule.appointmentDialog",
            "snap.admin.schedule.TimeUtils",
            "snap.patient.schedule.apptsSlotsTray",
            "snap.patient.schedule.patientSelfSchedulingHub",
            "snap.service.userService",
            "snap.patient.schedule.providersSlotsLocator"])
        .extend(kendo.observable)
        .define("providerSearch", function ($snapNotification, $eventAggregator, $selfSchedulingService, $appointmentDialog, $timeUtils, $apptsSlotsTray, $patientSelfSchedulingHub, $userService, $providersSlotsLocator, $scope, $state) {
            var scope = this,
                isFooterActive = true,
                isContentActive = false;


            var listViewMode = {
                all: "all",
                favorite: "favorite"
            };

            var dataSourceReadSuccessEvent = "cds_dataReadSuccess";
            var filterItemChangedEvent = "fic_changed";
            var filerCathegoryDisplayChanged = "fcd_changed";

            this.counts = {
                all: {
                    skip: 0,
                    take: 0,
                    total: 0
                },
                favorite: {
                    skip: 0,
                    take: 0,
                    total: 0
                }
            };

            this.allCliniciansDS = createClinicianDS(listViewMode.all);
            this.favoriteCliniciansDS = createClinicianDS(listViewMode.favorite);

            this.dateFilter = new Date();
            this.dateFilter.setHours(0, 0, 0, 0);
            this.oldDateFilter = this.dateFilter;
            this.nameFilter = "";
            this.isDataInit = false;
            this.hasOpenDialog = false;


            this.allFilters = [];
            this.favoriteFilters = [];
            this.vm_isSearchBarActive = false;

            $providersSlotsLocator.setListeningDate(this.dateFilter);

            var myProvidersSlotsLocator = $providersSlotsLocator.createSlotsLocator($patientSelfSchedulingHub),
                allProvidersSlotsLocator = $providersSlotsLocator.createSlotsLocator($patientSelfSchedulingHub);

            function counstructActiveFilters(filtersObject, currentFilters) {
                function Filter(name, quantity, checked, showFilterQuantity) {
                    this.filterName = name;
                    this.filterQuantity = quantity;
                    this.isFilterChecked = checked || false;

                    this.vm_showFilterQuantity = function () {
                        return this.filterQuantity !== null && showFilterQuantity;
                    };
                    this.vm_showFilter = function () {
                        return this.filterQuantity !== 0 || this.isFilterChecked;
                    };
                    this.vm_getFilterQuantity = function () {
                        return ["(", this.filterQuantity, ")"].join("");
                    };
                    this.vm_onCheckedStateChange = function () {
                        $eventAggregator.published(filterItemChangedEvent);
                    };
                }

                function Cathegory(name, filters, open) {
                    this.cathegoryName = name;
                    this.cathegoryFiltersList = filters.map(function (filter) {
                        return kendo.observable(new Filter(filter.name, filter.quantity, filter.checked, filter.showFilterQuantity));
                    });
                    this.isCathegoryOpen = open || false;

                    this.vm_onCathegoryToogle = function () {
                        this.set("isCathegoryOpen", !this.isCathegoryOpen);
                        $eventAggregator.published(filerCathegoryDisplayChanged, { name: this.cathegoryName, value: this.isCathegoryOpen });
                    };
                }

                return [kendo.observable(new Cathegory("Availability", [{
                    name: "Available",
                    quantity: filtersObject.total,
                    checked: currentFilters.Availability.filters.Available,
                    showFilterQuantity: false,
                }], currentFilters.Availability.isOpen)),
                    kendo.observable(new Cathegory("Gender", [{
                        name: "Male",
                        quantity: filtersObject.genderMale,
                        checked: currentFilters.Gender.filters.Male,
                        showFilterQuantity: true,
                    }, {
                        name: "Female",
                        quantity: filtersObject.genderFemale,
                        checked: currentFilters.Gender.filters.Female,
                        showFilterQuantity: true,
                    }], currentFilters.Gender.isOpen)),
                    kendo.observable(new Cathegory("Years of Practice", [{
                        name: "0-5",
                        quantity: filtersObject["yearsOfExperience0-5"],
                        checked: currentFilters["Years of Practice"].filters["0-5"],
                        showFilterQuantity: true,
                    }, {
                        name: "6-10",
                        quantity: filtersObject["yearsOfExperience6-10"],
                        checked: currentFilters["Years of Practice"].filters["6-10"],
                        showFilterQuantity: true,
                    }, {
                        name: "11-15",
                        quantity: filtersObject["yearsOfExperience11-15"],
                        checked: currentFilters["Years of Practice"].filters["11-15"],
                        showFilterQuantity: true,
                    }, {
                        name: "15+",
                        quantity: filtersObject["yearsOfExperience15+"],
                        checked: currentFilters["Years of Practice"].filters["15+"],
                        showFilterQuantity: true,
                    }], currentFilters["Years of Practice"].isOpen))

                ];
            }

            function createClinicianDS(mode) {
                return new kendo.data.SchedulerDataSource({
                    serverFiltering: true,
                    serverPaging: true,
                    pageSize: 10,
                    transport: {
                        read: function (options) {
                            var filters = scope._getCliniciansFilters();

                            filters.take = options.data.take;
                            filters.skip = options.data.skip;
                            filters.onlyMyProviders = mode === listViewMode.favorite;
                            filters.applyVisibilityRules = true;
                            var dfd = $.Deferred();
                            dfd.resolve(null);
                            if (options.data.userId) {
                                dfd = $selfSchedulingService.getClinicianCard(options.data.userId, filters.date);
                            }

                            $.when(dfd, $selfSchedulingService.getCliniciansCards(filters)).done(function (singlCardResult, listOfCardsResult) {
                                var cards = listOfCardsResult[0].data[0].clinicians;
                                var totals = listOfCardsResult[0].data[0].totals;


                                if (singlCardResult) {
                                    var userId = singlCardResult[0].data[0].userId;

                                    for (var i = 0; i < cards.length; i++) {
                                        if (cards[i].userId === userId) {
                                            cards.splice(i, 1);
                                            break;
                                        }
                                    }

                                    var selectedClinicianCard = singlCardResult[0].data[0];
                                    selectedClinicianCard._isSelected = true; //Custom property, we use it in order to mark element in UI.

                                    cards.unshift(selectedClinicianCard);
                                }

                                $eventAggregator.published(dataSourceReadSuccessEvent, {
                                    mode: mode,
                                    data: totals,
                                    skip: filters.skip,
                                    take: filters.take
                                });
                                options.success({
                                    data: cards,
                                    total: listOfCardsResult[0].total
                                });
                            }).fail(function (result) {
                                if (!snap.isUnloading) { //for FF. This prevents error handling from happening on aborted request when browser leaves the page.
                                    $snapNotification.error(result);
                                    options.error(result);
                                }
                            });
                        }
                    },
                    schema: {
                        total: "total",
                        data: function (response) {
                            var clinicians = response.data.map(function (ap) {
                                return new Clinician(ap, scope);
                            });

                            return clinicians;
                        }
                    }
                });
            }
            /**************EVENT SUBSCRIPTIONS***************/
            $eventAggregator.subscriber("vm_toggleSearchAndFilter", function () {
                scope.set("vm_isSearchBarActive", !scope.vm_isSearchBarActive);
            });

            $eventAggregator.subscriber($appointmentDialog.appointmentPopupSavedEvent, function () {
                scope._updateCliniciansList();
                setTimeout(function () {
                    scope.set("vm_isNotificationActive", true);
                }, 1000);

            });

            $eventAggregator.subscriber($appointmentDialog.appointmentPopupClosedEvent, function () {
                scope.hasOpenDialog = false;
            });

            $eventAggregator.subscriber(dataSourceReadSuccessEvent, function (payload) {
                scope.set(payload.mode === listViewMode.all ? "allFilters" : "favoriteFilters", counstructActiveFilters(payload.data, scope._getCurrentFilters()));
                scope.trigger("change", {
                    field: "vm_getActiveFilters"
                });
                scope.trigger("change", {
                    field: "vm_isClearFiltersVisible"
                });
                if (payload.mode === listViewMode.all) {
                    scope.counts.all = {
                        take: payload.take,
                        skip: payload.skip,
                        total: payload.data.total
                    };
                } else {
                    scope.counts.favorite = {
                        take: payload.take,
                        skip: payload.skip,
                        total: payload.data.total
                    };
                }
                scope.trigger("change", {
                    field: "vm_getPagingCount"
                });
            });

            $eventAggregator.subscriber(filterItemChangedEvent, function () {
                scope._updateCliniciansList();
                scope.allCliniciansDS.query({
                    page: 1,
                    pageSize: 10
                });
                scope.favoriteCliniciansDS.query({
                    page: 1,
                    pageSize: 10
                });
                scope.trigger("change", { field: "allCliniciansDS" });
                scope.trigger("change", { field: "favoriteCliniciansDS" });
            });

            $eventAggregator.subscriber(filerCathegoryDisplayChanged, function (evt) {
                for (var i = 0, l = scope.allFilters.length; i < l; i++) {
                    if (scope.allFilters[i].cathegoryName === evt.name) {
                        scope.allFilters[i].isCathegoryOpen = evt.value;
                    }
                    if (scope.favoriteFilters[i].cathegoryName === evt.name) {
                        scope.favoriteFilters[i].isCathegoryOpen = evt.value;
                    }
                }

            });
            /***************** PUBLIC API *******************/
            this.load = function () {
                this.isDataInit = true;
                loadJQuery();

                var that = this;
                $eventAggregator.subscriber("slotTray_goToDate", function (obj) {
                    var dateFilter = new Date(obj.nextDate);
                    dateFilter.setHours(0, 0, 0, 0);

                    that.set("dateFilter", dateFilter);

                    that.allCliniciansDS.query({
                        page: 1,
                        pageSize: 10,
                        userId: obj.userId
                    });
                    that.favoriteCliniciansDS.query({
                        page: 1,
                        pageSize: 10,
                        userId: obj.userId
                    });
                    that.trigger("change", { field: "allCliniciansDS" });
                    that.trigger("change", { field: "favoriteCliniciansDS" });
                    that.trigger("change", { field: "vm_onDateBackVisible" });

                    $(".provider-search-page__content").scrollTop(0);
                });


                $userService.getUserCurrentTime().done(function (response) {
                    var currentDateFilter = new Date(that.dateFilter);
                    currentDateFilter.setHours(0, 0, 0, 0);

                    var currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                    currentUserTime.setHours(0, 0, 0, 0);

                    that.set("vm_currentDate", currentUserTime);

                    if (currentDateFilter.getTime() != currentUserTime.getTime()) {
                        that._setFilterDate(currentUserTime);
                    }
                });
            };

            this.setViewMode = function (mode) {
                this.set("clinicianListViewMode", mode);

                this.trigger("change", {
                    field: "vm_isAllCliniciansMode"
                });

                this.trigger("change", {
                    field: "vm_isFavoriteCliniciansMode"
                });

                this.trigger("change", {
                    field: "vm_getPagingCount"
                });
            };

            this.cleanup = function () { //For all that should be done on route change
                this.set("vm_isNotificationActive", false);
            }
            /***************** MVVM BINDINGS *******************/
            this.vm_currentDate = new Date();
            this.vm_currentDate.setHours(0, 0, 0, 0);

            this.vm_isNotificationActive = false;
            this.vm_closeNotification = function () {
                this.set("vm_isNotificationActive", false);
            };
            this.vm_goToCalendar = function () {
                this.vm_closeNotification();
                window.setTimeout(function () {
                    sessionStorage.setItem("snap_tabName_ref", "Scheduled");
                    window.location.href = "#/tab/appointmentpatientdetails/getPage='webSS'";
                    return false;
                }, 300);
            };

            this.vm_isClearFiltersVisible = function () {
                var filters = this._getActiveFilters();
                for (var i = 0, l = filters.length; i < l; i++) {
                    var cathegory = filters[i].cathegoryFiltersList;
                    for (var j = 0, ll = cathegory.length; j < ll; j++) {
                        if (cathegory[j].isFilterChecked) {
                            return true;
                        }
                    }
                }

                return false;
            };

            this.vm_getPagingCount = function () {
                var curCounts = this.clinicianListViewMode === listViewMode.all ? this.counts.all : this.counts.favorite;
                var min = curCounts.total > 0 ? curCounts.skip + 1 : 0;
                var max = typeof (curCounts.take) === "undefined" ? curCounts.total : curCounts.skip + curCounts.take;
                if (max > curCounts.total) {
                    max = curCounts.total;
                }
                return [min, "-", max, " of ", curCounts.total].join("");
            };

            this.vm_onDateForvard = function () {
                var newDate = new Date(this.dateFilter);
                newDate.setDate(this.dateFilter.getDate() + 1);
                this._setFilterDate(newDate);
            };

            this.vm_onDateBack = function () {
                var newDate = new Date(this.dateFilter);
                newDate.setDate(this.dateFilter.getDate() - 1);
                this._setFilterDate(newDate);
            };

            this.vm_onDateBackVisible = function () {
                return this.vm_currentDate.getTime() < this.dateFilter.getTime();
            };

            this.vm_getActiveFilters = function () {
                return this._getActiveFilters();
            };

            this.vm_onClearAllClick = function () {
                var filters = this._getActiveFilters();
                for (var i = 0, l = filters.length; i < l; i++) {
                    var cathegory = filters[i].cathegoryFiltersList;
                    for (var j = 0, ll = cathegory.length; j < ll; j++) {
                        cathegory[j].isFilterChecked = false;
                    }
                }
                this.set("allFilters", filters);
                this.set("favouriteFilters", filters);
                this.trigger("change", {
                    field: "vm_getActiveFilters"
                });
                this.trigger("change", {
                    field: "vm_isClearFiltersVisible"
                });
                this._updateCliniciansList();
            };

            this.vm_allClinicianCardsList_onDataBound = function () {
                allProvidersSlotsLocator.setSlots(getSlotsFromDs(this.allCliniciansDS), this.dateFilter);
                expandClinicanCards(this.allCliniciansDS);

                this.set("vm_isAllCliniciansDSEmpty", this.allCliniciansDS.data().length === 0);
            };

            this.vm_favoriteClinicianCardsList_onDataBound = function () {
                myProvidersSlotsLocator.setSlots(getSlotsFromDs(this.favoriteCliniciansDS), this.dateFilter);
                expandClinicanCards(this.favoriteCliniciansDS);
                this.trigger("change", { field: "vm_isFavoriteCliniciansDSEmpty" });
                this.trigger("change", { field: "vm_hasSearchConditions" });
            };

            function expandClinicanCards(clinicianCardsDS) {

                setTimeout(function () {
                    clinicianCardsDS.data().forEach(function (clinicianCard) {
                        clinicianCard.toogleFoter(true);
                    });
                }, 100); // we need some delay in order to apply nested bindings. See this link for more details: http://www.telerik.com/forums/problem-with-databound-event-on-nested-list
            }
            this.vm_isFavoriteCliniciansDSEmpty = function () {
                return this.favoriteCliniciansDS.data().length === 0 ;
            }
            this.vm_hasSearchConditions = function () {
                /*** Check if search conditions are not default.
                 ***  By default we have filters object like this:
                 ***  {
                 ***     availableOnly: false,
                 ***     date: <today>,
                 ***     name: ""
                 ***  }
                 ***/
                var filters = this._getCliniciansFilters();
                for(var key in filters){
                    if(filters.hasOwnProperty(key)
                        && !(
                            key === "date"
                            || key === "name"
                            || key === "availableOnly"
                        )){
                        return true;
                    }
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                return !(filters.date === $timeUtils.dateToString(today)
                  && filters.name === ""
                  && filters.availableOnly === false);
            }
            this.vm_isAllCliniciansMode = function () {
                return this.clinicianListViewMode === listViewMode.all;
            };

            this.vm_isFavoriteCliniciansMode = function () {
                return this.clinicianListViewMode === listViewMode.favorite;
            };

            this.vm_toogleAllFooters = function () {
                isFooterActive = !isFooterActive;
                this._toogleAllFooters(isFooterActive);
            };

            this.vm_toogleAllContents = function () {
                isContentActive = !isContentActive;
                this._toogleAllContents(isContentActive);
            };

            this.vm_onDateFilterChange = function () {
                if (this.dateFilter === null) {
                    this.set("dateFilter", this.oldDateFilter);
                } else {
                    this.oldDateFilter = this.dateFilter;
                    this._updateCliniciansList();
                }

                this.trigger("change", {
                    field: "vm_onDateBackVisible"
                });
            };

            this.vm_onDateFilterOpen = function () {
                // This is a workaround in order to adjust date in datepicker footer.
                var date = kendo.toString(this.get("vm_currentDate"), "dddd, MMMM dd, yyyy");
                $("#dateFilterPiker_dateview .k-footer > a").html(date);
                $("#dateFilterPiker_dateview .k-footer > a").attr("title", date);

                var that = this;
                $("#dateFilterPiker_dateview .k-footer > a").one("click", function () {
                    that._setFilterDate(that.get("vm_currentDate"));
                });
            };

            this.vm_onNameFilterChange = function () {
                this._updateCliniciansList();
            };

            this.vm_getDateDay = function () {
                return kendo.toString(this.get("dateFilter"), "dddd, ");
            };

            this.vm_getDateFormatted = function () {
                return kendo.toString(this.get("dateFilter"), "MMMM dd, yyyy");
            };

            /***************** PRIVATE API *******************/
            this._setFilterDate = function (newDate) {
                this.set("dateFilter", newDate);
                this._updateCliniciansList();
                this.trigger("change", {
                    field: "vm_onDateBackVisible"
                });
            };

            this._getActiveFilters = function () {
                var af = this.get("clinicianListViewMode") === listViewMode.all ? this.allFilters : this.favoriteFilters;
                return af;
            };

            this._updateCliniciansList = function (userId) {
                var param = {
                    skip: 0
                };
                if (userId) {
                    param.userId = userId;

                }

                this.allCliniciansDS.read(param);
                this.favoriteCliniciansDS.read(param);
            };

            this._updateClinicianListForFavorite = function () {
                this.favoriteCliniciansDS.read();
                if (this.clinicianListViewMode === listViewMode.favorite) {
                    this.allCliniciansDS.read();
                }
            };

            this._getCliniciansFilters = function () {
                var currentFilters = this._getCurrentFilters();
                var filterValues = {
                    date: $timeUtils.dateToString(this.dateFilter),
                    name: this.nameFilter,
                    availableOnly: currentFilters.Availability.filters.Available
                };

                if (!(currentFilters.Gender.filters.Male && currentFilters.Gender.filters.Female) && (currentFilters.Gender.filters.Male || currentFilters.Gender.filters.Female)) {
                    filterValues.gender = currentFilters.Gender.filters.Male ? "M" : "F";
                }

                var yearsCathegory = currentFilters["Years of Practice"].filters;

                var yearsArr = [{
                    min: 5,
                    max: 0,
                    val: yearsCathegory["0-5"]
                }, {
                    min: 10,
                    max: 6,
                    val: yearsCathegory["6-10"]
                }, {
                    min: 15,
                    max: 11,
                    val: yearsCathegory["11-15"]
                }, {
                    min: 0,
                    max: 15,
                    val: yearsCathegory["15+"]
                }];

                yearsArr = yearsArr.filter(function (yf) {
                    return yf.val;
                });

                //Only if "Years of Practice" filter selected we add "practicingSinceStart" and "practicingSinceEnd" filters.
                if (yearsArr.length > 0) {
                    var yearMin = null;
                    var yearMax = new Date().getFullYear();

                    yearMax -= yearsArr[0].max;
                    var minDecr = yearsArr[yearsArr.length - 1].min;
                    if (minDecr > 0) {
                        yearMin = (new Date().getFullYear()) - minDecr;
                    }

                    filterValues.practicingSinceEnd = yearMax;
                    if (yearMin !== null) {
                        filterValues.practicingSinceStart = yearMin;
                    }
                }

                return filterValues;
            };

            this._toogleAllFooters = function (isFooterActive) {
                var ds = this._getCurrentClinicianListTimeSlots();

                ds.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleFoter(isFooterActive);
                });
            };

            this._toogleAllContents = function (isContentActive) {
                var ds = this._getCurrentClinicianListTimeSlots();

                ds.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleContent(isContentActive);
                });
            };


            this._getCurrentClinicianListTimeSlots = function () {
                return this.clinicianListViewMode === "all" ?
                    this.allCliniciansDS :
                    this.favoriteCliniciansDS;
            };

            var cardCounter = 0;
            this._getCurrentFilters = function () {
                var protoFilters = {
                    "Gender": {
                        isOpen: false,
                        filters: {
                            "Male": false,
                            "Female": false
                        },
                    },
                    "Years of Practice": {
                        isOpen: false,
                        filters: {
                            "0-5": false,
                            "6-10": false,
                            "11-15": false,
                            "15+": false,
                        }
                    },
                    "Availability": {
                        isOpen: false,
                        filters: {
                            "Available": false
                        }
                    }
                };


                var currentFilters = {};
                var activeFilters = this._getActiveFilters();
                for (var i = 0, l = activeFilters.length; i < l; i++) {
                    var curName = activeFilters[i].cathegoryName;
                    currentFilters[curName] = {
                        isOpen: activeFilters[i].isCathegoryOpen,
                        filters: {}
                    };
                    for (var j = 0, ll = activeFilters[i].cathegoryFiltersList.length; j < ll; j++) {
                        var filter = activeFilters[i].cathegoryFiltersList[j];
                        currentFilters[curName].filters[filter.filterName] = filter.isFilterChecked;
                    }
                }
                return $.extend({}, protoFilters, currentFilters);
            };
            function parseStatesLicensed(statesJson) {
                try {
                    var statesObj = JSON.parse(statesJson);
                    return statesObj.map(function (item) {
                        return {
                            countryCode: item.countryCode,
                            states: !!item.regions ? item.regions.map(function (region) { return region.regionCode }).join(", ") : ""
                        }
                    });
                } catch (e) {
                    return [];
                }
            }
            function Clinician(opt, scope) {
                this.opt = opt;
                this.photo = opt.profilePhoto || getDefaultProfileImageForClinician();
                this.practicingSince = opt.practicingSince;
                this.speciality = opt.medicalSpeciality;
                this.subSpeciality = opt.subSpeciality;
                this.dob = opt.dob;
                this.statesLicensed = parseStatesLicensed(opt.statesLicenced);

                this.address = opt.address;
                this.userId = opt.userId;


                this.vm_cardId = cardCounter++;

                var openScheduleAppointmentDialog = function (timeSlotOptions) {
                    if (!scope.hasOpenDialog) {
                        $appointmentDialog.openNewAppointmentDialog(timeSlotOptions);
                        scope.hasOpenDialog = true;
                        $patientSelfSchedulingHub.lockSlot(timeSlotOptions.availabilityBlockId, $timeUtils.dateToString(timeSlotOptions.start), $timeUtils.dateToString(timeSlotOptions.end));
                    }
                };

                this.apptsSlotsTray = $apptsSlotsTray.createTimeSlotsTray(opt, scope.dateFilter, openScheduleAppointmentDialog);

                this.vm_isSelected = opt._isSelected;
                this.isFavorite = opt.isFavorite;
                this.isFooterActive = false;
                this.isContentActive = false;

                /*********** PUBLIC METHODS *************/
                this.toogleFoter = function (isFooterActive) {
                    this._toogle(isFooterActive, "isFooterActive");

                    var footer = $("#card_" + this.vm_cardId).find('.js-footer-slider');

                    footer.not('.slick-initialized').slick({
                        infinite: false,
                        variableWidth: true,
                        slidesToShow: 1,
                        slidesToScroll: 3,
                        draggable: false,
                        easing: 'ease',
                        prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                        nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                    });
                };

                this.toogleContent = function (isContentActive) {
                    this._toogle(isContentActive, "isContentActive");
                };

                /*********** PRIVATE METHODS *************/
                this._toogle = function (isActive, prop) {
                    if (isActive === this.get(prop)) {
                        return;
                    }

                    if (typeof (isActive) === "undefined") {
                        isActive = !this.get(prop);
                    }

                    this.set(prop, isActive);
                };

                /*********** MVVM BINDINGS **************/

                this.vm_toggleFavorite = function () {
                    var clinician = this;

                    function updateclinicianState() {
                        clinician.set("isFavorite", !clinician.isFavorite);
                        $snapNotification.success(["Provider is", clinician.isFavorite ? "added to" : "removed from", "My Providers list"].join(" "));
                        scope._updateClinicianListForFavorite();
                    }
                    if (this.isFavorite) {
                        $selfSchedulingService.removeClinicianFromFavourites(this.opt.personId).done(updateclinicianState);
                    } else {
                        var clinicianPerson = {
                            id: this.opt.personId,
                        };

                        $selfSchedulingService.addClinicianToFavourites(clinicianPerson).done(updateclinicianState);
                    }
                };
                this.vm_getPracticingYears = function () {
                    var yearsOfPractice = new Date().getFullYear() - this.opt.practicingSince;
                    return [yearsOfPractice, " Year", yearsOfPractice > 1 ? "s" : ""].join("");
                };
                this.vm_getFullName = function () {
                    return [opt.name, opt.lastName].join(" ");
                };
                this.vm_getGenderText = function () {
                    if (this.opt.gender === "M") {
                        return "Male";
                    } else if (this.opt.gender === "F") {
                        return "Female";
                    }

                    return "";
                };
                this.vm_toogleFooter = function () {
                    this.toogleFoter();
                };

                this.vm_toggleContent = function () {
                    this.toogleContent();
                };
            }

            function getSlotsFromDs(ds) {
                var slots = [];

                ds.data().forEach(function (clinicianCard) {
                    clinicianCard.apptsSlotsTray.slots.sort(function (first, second) {
                        return first.from - second.from;
                    }).forEach(function (slot) {
                        slots.push(slot);
                    });
                });

                return slots;
            }

            function loadJQuery() {
                $('.js-toggle-bookmark').on('click', function (event) {
                    event.stopPropagation();
                    $(this).closest('.drawer-card').toggleClass('is-bookmarked');
                });

                $('.js-toggle-panel').on('click', function () {
                    // TODO: Toggle refine panels
                    $('.left-col').toggleClass('is-active');
                });

                $('body').on('click', '.js-toggle-search', function () {
                    window.console.log('click');
                    $('.provider-search-header__search').toggleClass('is-active');
                    return false;
                });
            }

        }).singleton();
}(jQuery, snap, kendo));

//Vertical orientation!
/*
       var clinicianCardViewType = {
           vertical: "vertical",
           horizontal: "horizontal",
       };

       this.clinicianListViewMode = clinicianCardViewType.horizontal;

       this.vm_isClinicianCardHorizontalView = function () {
           return this.get("clinicianCardViewType") === clinicianCardViewType.horizontal;
       };

       this.vm_isClinicianCardVerticalView = function () {
           return this.get("clinicianCardViewType") === clinicianCardViewType.vertical;
       };

       this._triggerCardOrientation = function () {
           this.trigger("change", {
               field: "vm_isClinicianCardHorizontalView"
           });

           this.trigger("change", {
               field: "vm_isClinicianCardVerticalView"
           });

           triggerConcreteListOfCards(this.allCliniciansDS.data());
           triggerConcreteListOfCards(this.favoriteCliniciansDS.data());

           function triggerConcreteListOfCards(cards) {
               cards.forEach(function (card) {
                   card.trigger("change", {
                       field: "vm_isClinicianCardHorizontalView"
                   });

                   card.trigger("change", {
                       field: "vm_isClinicianCardVerticalView"
                   });
               });
           }
       };
       */


// $("#clinicianCardsList").kendoMobileScroller().kendoMobileListView({
//      dataSource: cliniciansDS,
//      template:  kendo.template($("#clinicianCardTemplate").html()),
//      endlessScroll: true,
//  });

//adding this css class provider-search-page__content in providerSearch.html seems to give an extra scroll bar

//anytime bxslider is on a page there seems to be problems, I did see the same issues removing it though.

//In case we have to do grid virtual
/*  $("#grid").kendoGrid({
    dataSource: cliniciansDS,
    scrollable: {
        virtual: true
    },
    height: "500px",
    rowTemplate: kendo.template($("#clinicianCardTemplate").html()),


});*/

//@ sourceURL=providerSearch.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.patient.schedule")
        .use(["snapNotification", "snap.EventAggregator",
            "snap.service.selfSchedulingService",
            "snap.patient.schedule.appointmentDialog",
            "snap.common.TimeUtils",
            "snap.patient.schedule.apptsSlotsTray",
            "snap.patient.schedule.patientSelfSchedulingHub",
            "snap.service.userService",
            "snap.patient.schedule.providersSlotsLocator",
            "snap.clinician.patientQueue.familyGroupSelector",
            "snap.DataService.customerDataService",
            "snap.patient.patientResponseAddressDialog",
            "snap.common.dialogWindow",
            "snap.helper.locationHelper"])
        .extend(kendo.observable)
        .define("providerSearch", function (
            $snapNotification,
            $eventAggregator,
            $selfSchedulingService,
            $appointmentDialog,
            $timeUtils,
            $apptsSlotsTray,
            $patientSelfSchedulingHub,
            $userService,
            $providersSlotsLocator,
            $familyGroupSelector,
            $customerDataService,
            $patientResponseAddressDialog,
            $dialogWindow,
            $locationHelper) {
$("#localize-widget").hide();
            var scope = this,
                isFooterActive = true,
                isContentActive = false;

            var cardDisplayModeEnum = {
                list: "list",
                grid: "grid"
            };

            var listViewMode = {
                all: "all",
                favorite: "favorite"
            };
            this.set("vm_isSearchBarActive", false);
            var dataSourceReadSuccessEvent = "cds_dataReadSuccess";
            var filterItemChangedEvent = "fic_changed";
            var filerCathegoryDisplayChanged = "fcd_changed";

            var selector = $familyGroupSelector.createFamilyGroupSelectorSelector({
                isMultiselect: false,
                htmlContainerId: "#selectFamilyMember",
                scrollableElementClass: ".familyGroupSelector_scrollable",
                pageSize: 50
            });

            var defaultPatient = {
                id: snap.profileSession.profileId,
                name: snap.profileSession.fullName,
                imageSource: snap.profileSession.profileImage,
                firstName: snap.profileSession.firstName
            };
            //this.vm_isPatientSelectorActive = false;
            this.selectedPatient = defaultPatient; // this is a selected patient for self scheduling, if visibility rules is on, this will affect  list of doctors.
            this.isResponseRuleActive = false; // indicator to show if patient response rule is active in hospital;
            this.isAddressRuleActive = false;  // indicator to show if patient address rule is active in hospital;
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

            this.allCliniciansDS = kendo.observable(
                new BaseDynamicList({
                    mode: listViewMode.all,
                    htmlContainerId: "allCliniciansContainer",
                    onDataLoad: function () {
                        scope.set("vm_isAllCliniciansDSEmpty", scope.allCliniciansDS.data().length === 0);
                    }
                })
            );

            this.favoriteCliniciansDS = kendo.observable(
                new BaseDynamicList({
                    mode: listViewMode.favorite,
                    htmlContainerId: "favoriteCliniciansContainer",
                    onDataLoad: function () {
                        scope.trigger("change", { field: "vm_isFavoriteCliniciansDSEmpty" });
                        scope.trigger("change", { field: "vm_hasSearchConditions" });
                    }
                })
            );


            this.dateFilter = new Date();
            this.dateFilter.setHours(0, 0, 0, 0);
            this.oldDateFilter = this.dateFilter;
            this.nameFilter = "";
            this.isDataInit = false;
          //  that.isDataInit = false;
            this.hasOpenDialog = false;


            this.allFilters = [];
            this.favoriteFilters = [];
            this.vm_isSearchBarActive = false;

            this.cardDisplayMode = cardDisplayModeEnum.list;

            $providersSlotsLocator.setListeningDate(this.dateFilter);

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
                          window.setTimeout(function(){
                            $eventAggregator.published(filterItemChangedEvent);
                        }, 200);
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

            /* function createClinicianDS(mode) {
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
             }/*
             /**************EVENT SUBSCRIPTIONS***************/
            $eventAggregator.subscriber("vm_toggleSearchAndFilter", function () {
                if (scope.vm_isSearchBarActive == false) {
                    $("#allProvider").removeClass("is-active");
                    $("#myProvider").removeClass("is-active");
                    $("#searchTab").addClass("is-active");
                     $("#searchFilter").css("display", "block");
                } else {
                    if ($('#allProvider').attr("class") == '' & $('#myProvider').attr("class") == '') {
                        $("#searchTab").removeClass("is-active");
                        $("#myProvider").removeClass("is-active");
                        $("#allProvider").addClass("is-active");
                    } else {
                        $("#searchTab").removeClass("is-active");
                    }
                }
                scope.set("vm_isSearchBarActive", !scope.vm_isSearchBarActive);
            });

            $eventAggregator.subscriber($appointmentDialog.appointmentPopupSavedEvent, function () {
                scope._updateCliniciansList();
                setTimeout(function () {
                    scope.set("vm_isNotificationActive", true);
                }, 900); //1000);

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
                scope.trigger("change", {
                    field: "vm_getPagingName"
                });
            });


            $eventAggregator.subscriber(filterItemChangedEvent, function () {
                scope._updateCliniciansList();
                /* scope.allCliniciansDS.query({
                     page: 1,
                     pageSize: 10
                 });
                 scope.favoriteCliniciansDS.query({
                     page: 1,
                     pageSize: 10
                 });
                 scope.trigger("change", { field: "allCliniciansDS" });
                 scope.trigger("change", { field: "favoriteCliniciansDS" });*/
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
            $eventAggregator.subscriber("patientResponseDialog_locationConfirmed", function (currentLocation, currentLocationText) {
                if (scope.selectedPatient !== null) {
                    scope.selectedPatient.currentLocationText = currentLocationText;
                    scope.selectedPatient.currentLocation = currentLocation;

                    scope.set("vm_currentPatientLocation", currentLocationText);

                    var filters = scope._getCliniciansFilters();

                    scope.allCliniciansDS.query({ filters: filters });
                    scope.favoriteCliniciansDS.query({ filters: filters });
                }
            });
            /***************** PUBLIC API *******************/
            this.load = function () {
                //this.isDataInit = true;
                var aa = false;
                this.set("vm_isNotificationActive", true);
                this.set("vm_isNotificationActive", false);
                loadJQuery();

                var that = this;
                $eventAggregator.subscriber("slotTray_goToDate", function (obj) {
                    var dateFilter = new Date(obj.nextDate);
                    dateFilter.setHours(0, 0, 0, 0);

                    that.set("dateFilter", dateFilter);


                    that.allCliniciansDS.query({
                        filters: scope._getCliniciansFilters(),
                        userId: obj.userId
                    });
                    that.favoriteCliniciansDS.query({
                        filters: scope._getCliniciansFilters(),
                        userId: obj.userId
                    });
                    that.trigger("change", { field: "vm_onDateBackVisible" });

                    $(".provider-search-page__content").scrollTop(0);
                });

                $('.k-select').click(function() {
                    setTimeout(function () {
                        $('.k-nav-fast').addClass('localizejs');
                        $('.k-link').addClass('localizejs');
                  }, 10); })

                $userService.getUserCurrentTime().done(function (response) {
                    var currentDateFilter = new Date(that.dateFilter);
                    currentDateFilter.setHours(0, 0, 0, 0);

                    var currentUserTime = $timeUtils.dateFromSnapDateString(response.data[0]);
                    currentUserTime.setHours(0, 0, 0, 0);

                    that.set("vm_currentDate", currentUserTime);

                    if (currentDateFilter.getTime() != currentUserTime.getTime()) {
                        that._setFilterDate(currentUserTime);
                    }
                    // Sakthi
                    this.vm_currentDate = new Date();
                        this.vm_currentDate.setHours(0, 0, 0, 0);

                        $("#dateFilterPiker").kendoDatePicker({
                                min: this.vm_currentDate
                            });
                });
              //  that.isDataInit = this.isDataInit;
                $customerDataService.getRulesStatus().done(function (status) {
                      that.set("isResponseRuleActive", status.responseRuleActive);
                      that.set("isAddressRuleActive", status.addressRuleActive);

                      that.trigger("change", { field: "vm_isRulesActive" });
                      that.trigger("change", { field: "vm_isResponseRuleInactive" });

                      var selectedItem = snap.profileSession;
                      if(typeof that.selectedPatient != 'undefined' && aa != true) {
                        //  if (selectedItem.profileId !== that.selectedPatient.id) {
                              that.set("vm_isPatientSelectorActive", false);
                              that._setPatientForSelfScheduling(selectedItem);
                              that._updateCliniciansList();
                              selector.load();
                        /* } else {
                              that._setPatientForSelfScheduling(defaultPatient);
                              selector.load();
                          }*/
                      } else {
                          that._setPatientForSelfScheduling(defaultPatient);
                          selector.load();
                      }

                  });



                if (!this.allCliniciansDS.isEndlessScrollInitialized()) {
                    this.allCliniciansDS.initEndlessScroll();
                }

                if (!this.favoriteCliniciansDS.isEndlessScrollInitialized()) {
                    this.favoriteCliniciansDS.initEndlessScroll();
                }
                if (!this.isDataInit) {
                    this.isDataInit = true;
                    var aa = true;
                    this._updateCliniciansList();
                }
            };

            this._reloadPatientSelector = function () {
                var filters = {
                    search: this.vm_patientsNameFilter,
                };

                selector.filters(filters);
                selector.reload();
            };

            this.setViewMode = function (mode) {
                this.set("clinicianListViewMode", mode);
                if (mode == 'favorite' || mode == 'all')
                    this.set("vm_isSearchBarActive", false);

                this.trigger("change", {
                    field: "vm_isAllCliniciansMode"
                });

                this.trigger("change", {
                    field: "vm_isFavoriteCliniciansMode"
                });

                this.trigger("change", {
                    field: "vm_getPagingCount"
                });

                this.trigger("change", {
                    field: "vm_getPagingName"
                });


                // Refresh slick plug-in for current view mode.
                // Slick do not works with hided elements, so as far as we display current view mode we need re-init slick.
                this._getCurrentClinicianListTimeSlots().refreshSlickPlugin();
            };







            this.cleanup = function () { //For all that should be done on route change
                this.set("vm_isNotificationActive", true);
                this.set("vm_isNotificationActive", false);
            };
            /***************** MVVM BINDINGS *******************/
            this.vm_patientsNameFilter = "";
            this.vm_isPatientSelectorActive = false; // patient filter, show famaly group members.

            this.vm_isPatinetLoactionInLoading = true;
            this.vm_currentPatientLocation = "";
            //this.set("vm_isPatientSelectorActive", false);
            this.vm_onSelectPersonClick = function () {
                 $("#relatedUsrTab").css("display", "block");
                this.set("vm_isPatientSelectorActive", true);

                selector.unselectAll();

                if (this.selectedPatient) {
                    selector.selectItem(this.selectedPatient);
                }
            };

            this.vm_closePatientSelection = function () {
                this.set("vm_isPatientSelectorActive", false);

                var selectedItem = selector.getSelectedItems()[0];

                if (selectedItem.id !== this.selectedPatient.id) {
                    this._setPatientForSelfScheduling(selectedItem);
                    this._updateCliniciansList();
                }
            };

            var searchTimeout = null;
            this.vm_onPatientsNameFilterChange = function () {
                if (!!searchTimeout) {
                    clearTimeout(searchTimeout);
                }

                var that = this;
                searchTimeout = setTimeout(function () {
                    if (selector.filters().search !== that.vm_patientsNameFilter) {
                        that._reloadPatientSelector();
                    }
                }, 500);
            };

            var dialog = null;
            this.vm_onConfirmCurrentLocationClick = function () {
                if (this.isResponseRuleActive === true) {
                    if (dialog === null) {
                        dialog = $dialogWindow.createNewDialog({
                            vm: $patientResponseAddressDialog,
                            container: "#changePatientAddressPopUpContainer",
                            contentPath: "schedule/tab-confirmPatientAddressDialog.html",
                            required: true
                        });
                    }

                    dialog.open({
                        patientId: this.selectedPatient.id,
                        currentLocationText: this.selectedPatient.currentLocationText,
                        currentLocation: this.selectedPatient.currentLocation,
                        imageSource: this.selectedPatient.imageSource,
                        fullName: this.selectedPatient.name,
                        firstName: this.selectedPatient.firstName
                    });
                }
            };

            this.vm_isRulesActive = function () {
                return this.isResponseRuleActive || this.isAddressRuleActive;
            };

            this.vm_isResponseRuleInactive = function () {
                return !this.isResponseRuleActive;
            }



            this.vm_currentDate = new Date();
            this.vm_currentDate.setHours(0, 0, 0, 0);

            $("#dateFilterPiker").kendoDatePicker({
                    min: this.vm_currentDate
                });


            this.vm_isNotificationActive = false;
            this.vm_closeNotification = function () {
                this.vm_isNotificationActive = false;
                this.set("vm_isNotificationActive", true);
                this.set("vm_isNotificationActive", false);
            };
            this.vm_goToCalendar = function () {
                this.vm_closeNotification();
                window.setTimeout(function () {
                    sessionStorage.setItem("snap_tabName_ref", "Scheduled");
                    $.connection.hub.qs = {};
                    var hubs = [];
                    window.location.href = "#/tab/appointmentpatientdetails/webSS";
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
                return curCounts.total;
            };

            this.vm_getPagingName = function () {
                var curCounts = this.clinicianListViewMode === listViewMode.all ? this.counts.all : this.counts.favorite;
                var txt = " Provider";
                if (curCounts.total > 1) {
                    txt += "s";
                }

                return txt;
            }

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

            /* this.vm_allClinicianCardsList_onDataBound = function () {
                 allProvidersSlotsLocator.setSlots(getSlotsFromDs(this.allCliniciansDS), this.dateFilter);
                 expandClinicanCards(this.allCliniciansDS);

                 this.set("vm_isAllCliniciansDSEmpty", this.allCliniciansDS.data().length === 0);
             };

             this.vm_favoriteClinicianCardsList_onDataBound = function () {
                 this.set("vm_isNotificationActive", false);
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
             }*/
            this.vm_isFavoriteCliniciansDSEmpty = function () {
                return this.favoriteCliniciansDS.data().length === 0;
            };
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
                for (var key in filters) {
                    if (filters.hasOwnProperty(key) &&
                        !(
                            key === "date" ||
                            key === "name" ||
                            key === "availableOnly" ||
                            key === "patientId"
                        )) {
                        return true;
                    }
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                return !(filters.date === $timeUtils.dateToString(today) &&
                    filters.name === "" &&
                    filters.availableOnly === false);
            };
            this.vm_isAllCliniciansMode = function () {
                return this.clinicianListViewMode === listViewMode.all;
            };

            this.vm_isFavoriteCliniciansMode = function () {
                return this.clinicianListViewMode === listViewMode.favorite;
            };

            this.vm_toogleAllFooters = function () {
                this._toogleAllFooters(!isFooterActive);
            };

            this.vm_toogleAllContents = function () {
                if (this.vm_isGridMode()) {
                    this._toogleAllFooters(false);
                }

                this._toogleAllContents(!isContentActive);
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



                //$("#dateFilterPiker").attr("data-bind", this.get("vm_currentDate"));
                // var that = this;
                // $("#dateFilterPiker_dateview .k-footer > a").one("click", function () {
                //     that._setFilterDate(that.get("vm_currentDate"));
                // });
            };


            var nameFilterSearchTimeout = null;
            this.vm_onNameFilterChange = function () {
                if (!!nameFilterSearchTimeout) {
                    clearTimeout(nameFilterSearchTimeout);
                }

                var that = this;
                nameFilterSearchTimeout = setTimeout(function () {
                    that._updateCliniciansList();
                }, 500);
            };
// var Dateday =kendo.toString(this.get("dateFilter"), "ddd, ");
// var localizeCurrent = $('#localize-current').text();
//   if(localizeCurrent == "Español") {
//     Dateday =
            this.vm_getDateDay = function () {

              // var Dateday =kendo.toString(this.get("dateFilter"), "ddd, ");
                return kendo.toString(this.get("dateFilter"), "ddd");

            };

            this.vm_getDateFormatted = function () {
                return kendo.toString(this.get("dateFilter"), "MMM dd, yyyy");
            };

            this.vm_isGridMode = function () {
                return this.cardDisplayMode === cardDisplayModeEnum.grid;
            };

            this.vm_isListMode = function () {
                return this.cardDisplayMode === cardDisplayModeEnum.list;
            };

            this.vm_onGridModeClick = function () {
                this.set("cardDisplayMode", cardDisplayModeEnum.grid);
                this.trigger("change", { field: "vm_isGridMode" });
                this.trigger("change", { field: "vm_isListMode" });

                this._toogleAllFooters(false);
                this._refrechViewMode();


                $(window).resize();
            };

            this.vm_onListModeClick = function () {
                this.set("cardDisplayMode", cardDisplayModeEnum.list);
                this.trigger("change", { field: "vm_isGridMode" });
                this.trigger("change", { field: "vm_isListMode" });

                this._toogleAllFooters(true);
                this._refrechViewMode();

                $(window).resize();
            };


            this.vm_toogleAllCardsContentIconText = function () {
                return (isContentActive ? "Hide" : "Show") + " all provider details";
            };

            this.vm_toogleAllCardsFooterIconText = function () {
                return (isFooterActive ? "Hide" : "Show") + " all available times";
            };

            /***************** PRIVATE API *******************/
            this._setPatientForSelfScheduling = function (patient) {
                this.set("selectedPatient", patient);

                this.set("vm_isPatinetLoactionInLoading", true);
                this.set("vm_currentPatientLocation", "");

                var that = this;
                $customerDataService.getPatientProfileDetails(patient.id, "all").done(function (data) {
                    var locationText = "";
                    var addressLocation = "";
                    if (that.isResponseRuleActive) {
                        locationText = $locationHelper.getEncounterAddressTextFromPatientProfile(data.data[0]);
                        addressLocation = $locationHelper.getEncounterAddressLocationFromPatientProfile(data.data[0]);
                    } else if (that.isAddressRuleActive) {
                        locationText = $locationHelper.getLocalAddressTextFromPatientProfile(data.data[0]);
                        addressLocation = $locationHelper.getLocalAddressLocationFromPatientProfile(data.data[0]);
                    }

                    that.set("vm_currentPatientLocation", locationText);
                    that.set("vm_isPatinetLoactionInLoading", false);

                    that.selectedPatient.currentLocationText = locationText;
                    that.selectedPatient.currentLocation = addressLocation;
                });
            };

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

            this._updateCliniciansList = function () {
                var param = {
                    filters: this._getCliniciansFilters()
                };
                this.allCliniciansDS.query(param);
                this.favoriteCliniciansDS.query(param);
            };

            this._updateClinicianListForFavorite = function () {
                var param = {
                    filters: this._getCliniciansFilters()
                };

                this.favoriteCliniciansDS.query(param);
                if (this.clinicianListViewMode === listViewMode.favorite) {
                    this.allCliniciansDS.query(param);
                }
            };


            this._getCliniciansFilters = function () {
                var currentFilters = this._getCurrentFilters();
                var filterValues = {
                    date: $timeUtils.dateToString(this.dateFilter),
                    name: this.nameFilter,
                    availableOnly: currentFilters.Availability.filters.Available,
                    patientId: this.selectedPatient.id
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

            //***************************** PRIVATE METHODS **********************************
            this._refrechViewMode = function () {
                this.allCliniciansDS.refreshViewMode();
                this.favoriteCliniciansDS.refreshViewMode();
            };

            this._toogleAllFooters = function (isFActive) {
                isFooterActive = isFActive;

                this.allCliniciansDS.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleFoter(isFActive);
                });
                this.favoriteCliniciansDS.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleFoter(isFActive);
                });

                this.trigger("change", { field: "vm_toogleAllCardsFooterIconText" });
            };


            this._toogleAllContents = function (isCActive) {
                isContentActive = isCActive;

                this.allCliniciansDS.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleContent(isCActive);
                });
                this.favoriteCliniciansDS.data().forEach(function (clinicianCard) {
                    clinicianCard.toogleContent(isCActive);
                });

                this.trigger("change", { field: "vm_toogleAllCardsContentIconText" });
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
                            states: !!item.regions ? item.regions.map(function (region) { return region.regionCode; }).join(", ") : ""
                        };
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

                function openScheduleAppointmentDialog(timeSlotOptions) {
                    if (!scope.hasOpenDialog) {
                        // Set current patient as default.
                        timeSlotOptions.patientProfileId = scope.selectedPatient.id;


                        $appointmentDialog.openNewAppointmentDialog(timeSlotOptions);
                        scope.hasOpenDialog = true;
                        $patientSelfSchedulingHub.lockSlot(timeSlotOptions.availabilityBlockId, $timeUtils.dateToString(timeSlotOptions.start), $timeUtils.dateToString(timeSlotOptions.end));
                    }
                }


                this.apptsSlotsTray = null;

                this.vm_isSelected = opt._isSelected;
                this.isFavorite = opt.isFavorite;
                this.isFooterActive = scope.vm_isListMode();
                this.isContentActive = false;

                /*********** PUBLIC METHODS *************/
                this.initApptsSlotTray = function () {
                    var that = this;
                    this.apptsSlotsTray = $apptsSlotsTray.createTimeSlotsTray(opt, scope.dateFilter, openScheduleAppointmentDialog, function () {
                        that.trigger("change", { field: "apptsSlotsTray.vm_hasSlotsForRightNow" });
                    });
                };

                this.toogleFoter = function (isFooterActive) {
                    this._toogle(isFooterActive, "isFooterActive");

                    this.slickFooter();
                };

                this.slickFooter = function () {
                  // var slidesToScroll = window.innerWidth < 768 ? 1 : 2;
                   var slidesToScroll = 1;
                    // 1. Work with grid view.
                    var footer = $("#card_" + this.vm_cardId).find('.js-footer-slider');

                    footer.not('.slick-initialized').slick({
                        infinite: false,
                        variableWidth: true,
                        slidesToShow: 1,
                        slidesToScroll: slidesToScroll,
                        draggable: false,
                        easing: 'ease',
                        prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-left"></span></button>',
                        nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-right"></span></button>'
                    });

                    // 2. Work with list view.

                    // In some cases slick slider do not work well (elements hided at first, and there is not enough elements for slider)
                    // SO, IF THERE IS NO ENOUGH AVAILABLE SLOTS WE DO NOT INIT SLICK SLIDER BECAUSE WE DO NOT NEED IT.
                    var slotsCount = this.apptsSlotsTray.getSlots().length;

                    if (this.apptsSlotsTray.hasSlotForNextDate()) {
                        slotsCount++;
                    }

                    if (slotsCount > 4) {
                        var secondFooter = $("#card_" + this.vm_cardId).find('.js-flip-slider');

                        secondFooter.not('.slick-initialized').slick({
                            vertical: true,
                            infinite: false,
                            slidesToShow: 4,
                            slidesToScroll: 3,
                            easing: 'ease',
                            prevArrow: '<button type="button" class="slick-prev"><span class="icon_chevron-thin-up"></span></button>',
                            nextArrow: '<button type="button" class="slick-next"><span class="icon_chevron-thin-down"></span></button>'
                        });

                        secondFooter.slick("slickGoTo", 0); // Ticket 10105. Case #12: Available times are not displayed when clicked from info mode
                    }

                    this.trigger("change", { field: "apptsSlotsTray.vm_hasSlotsForRightNow" });
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
                this.vm_onConnectNowClick = function () {
                    var slots = this.apptsSlotsTray.getSlots().filter(function (slot) {
                        return slot.isNow;
                    });

                    if (slots.length > 0) {
                        var slot = slots[0];

                        openScheduleAppointmentDialog({
                            clinicianId: slot.clinicianUserId,
                            start: new Date(slot.from),
                            end: new Date(slot.to),
                            availabilityBlockId: slot.availabilityBlockId,
                            isNow: slot.isNow
                        });
                        $eventAggregator.published("slotTray_slotClickCallback");
                    }
                };

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
                    if (!this.opt.practicingSince) {
                        return "";
                    }
                    var yearsOfPractice = new Date().getFullYear() - this.opt.practicingSince;
                    return [yearsOfPractice, "", yearsOfPractice > 1 ? "" : ""].join("");
                };
                this.vm_getPracticingYearsString = function () {
                    if (!this.opt.practicingSince) {
                        return "";
                    }
                    var yearsOfPractice = new Date().getFullYear() - this.opt.practicingSince;
                    return [" Year", yearsOfPractice > 1 ? "s" : ""].join("");
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
                this.vm_isGridMode = function () {
                    return scope.vm_isGridMode();
                };

                this.vm_isListMode = function () {
                    return scope.vm_isListMode();
                };
            }

            function BaseDynamicList(options) {
                var
                    htmlContainerId = "#" + options.htmlContainerId,
                    total = 0,
                    pageSize = 20,
                    mode = options.mode;

                var providersSlotsLocator = $providersSlotsLocator.createSlotsLocator($patientSelfSchedulingHub);

                var isInitialized = false;
                var filters = null;

                //********************* PUBLIC API ******************
                this.vm_allItems = [];
                this.vm_htmlContainerId = options.htmlContainerId;
                this.vm_isItemsLoading = true;

                this.initEndlessScroll = function () {
                    var that = this;

                    var requestInProgress = false;

                    var $container = $(htmlContainerId).closest(".provider-search-page__content");
                    $container.scroll(function () {
                        var elementHeight = Math.floor($container[0].scrollHeight / that.vm_allItems.length);
                        var loadAdditionItemHeight = Math.floor(pageSize / 3) * elementHeight;

                        if ($container.scrollTop() + $container.innerHeight() >= $container[0].scrollHeight - loadAdditionItemHeight) {
                            if (that.vm_allItems.length >= total) {
                                return false;
                            }

                            if (requestInProgress) {
                                return false;
                            }

                            requestInProgress = true;


                            that._load({
                                take: pageSize,
                                skip: that.vm_allItems.length,
                                filters: filters
                            }).always(function () {
                                requestInProgress = false;
                            });
                        }
                    });

                    isInitialized = false;
                };

                this.isEndlessScrollInitialized = function () {
                    return isInitialized;
                };

                this.query = function (opt) {
                    filters = opt.filters;

                    if (typeof (opt.take) !== "number") {
                        opt.take = pageSize;
                    }

                    if (typeof (opt.skip) !== "number") {
                        opt.skip = 0;
                    }

                    this.set("vm_allItems", []);
                    total = 0;

                    return this._load(opt);
                };

                this.data = function () {
                    return this.vm_allItems;
                };

                this.refreshViewMode = function () {
                    this.vm_allItems.forEach(function (item) {
                        item.trigger("change", { field: "vm_isGridMode" });
                        item.trigger("change", { field: "vm_isListMode" });
                    });
                };

                this.refreshSlickPlugin = function () {
                    this.vm_allItems.forEach(function (item) {
                        item.slickFooter();
                    });
                };

                var getSingleCardDfd = $.Deferred();
                var getCardsDfd = $.Deferred();

                this._load = function (opt) {
                    // Abort any pending request before send new.
                    // We need this in order to avoid situation when API slow and user quickly change filters or something else.
                    // In such case without 'abort' user may see results of several requests at the same time.
                    var abortMessage = "_abort";

                    if (getSingleCardDfd.abort) {
                        getSingleCardDfd.abort(abortMessage);
                    }

                    if (getCardsDfd.abort) {
                        getCardsDfd.abort(abortMessage);
                    }

                    var that = this;
                    kendo.bind($("#providersearchBdy"), this);
                    that.set("vm_isItemsLoading", true);
                    var apiPayload = $.extend({}, opt.filters);

                    apiPayload.take = opt.take;
                    apiPayload.skip = opt.skip;

                    apiPayload.onlyMyProviders = mode === listViewMode.favorite;
                    apiPayload.applyVisibilityRules = true;

                    if (opt.userId) {
                        // If user click on "Next" button on provider card we navigate to next date when this provider available.
                        // And we must show this provider and all his available slots, this could be a problem if provider card not in first bunch of card (paging problem)
                        // In order to solve this problem in such case we make addition request to API in order to get all information about this provider.
                        // And then we add patient card to cards list.
                        getSingleCardDfd = $selfSchedulingService.getClinicianCard(opt.userId, apiPayload.date);
                    } else {
                        getSingleCardDfd = $.Deferred();
                        getSingleCardDfd.resolve(null);
                    }

                    getCardsDfd = $selfSchedulingService.getCliniciansCards(apiPayload);

                    return $.when(getSingleCardDfd, getCardsDfd).done(function (singlCardResult, listOfCardsResult) {
                        var cards = listOfCardsResult[0].data[0].clinicians;
                        var totals = listOfCardsResult[0].data[0].totals;

                        // If we provided 'userId' parameter we get concrete patient card which must be shown in list.
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
                            skip: apiPayload.skip,
                            take: apiPayload.take
                        });

                        total = totals.total;

                        var clinicians = cards.map(function (ap) {
                            var c = kendo.observable(new Clinician(ap, scope));
                            c.initApptsSlotTray();

                            return c;
                        });


                        if (clinicians.length > 0) {
                            // Add all new cards to providers list.
                            // We use overrided by kendo push.apply in order to trigger change only once.
                            that.vm_allItems.push.apply(that.vm_allItems, clinicians);

                            // We put all slots in one colletction and monitor any changes (lock/unlock slot)
                            providersSlotsLocator.setSlots(getSlotsFromDs(that.vm_allItems), $timeUtils.dateFromSnapDateString(apiPayload.date));

                            // turn on Slick plugin for all cards.
                            that.vm_allItems.forEach(function (card) {
                                card.slickFooter();
                            });

                            if (scope.vm_isListMode()) {
                                // Expand all new added cards, this is a card default state.
                                expandClinicanCards(clinicians);
                            }
                        }

                        // Callback for addition actions after data updated.
                        options.onDataLoad();

                        that.set("vm_isItemsLoading", false);
                    }).fail(function (result) {
                        // Ignore 'abort' operation and do not show error.
                        // We abort requests in case if user send many requests (api slow and user change filters several times.)
                        if (result.statusText && result.statusText === abortMessage) {
                            return;
                        }

                        if (!snap.isUnloading) { //for FF. This prevents error handling from happening on aborted request when browser leaves the page.
                            $snapNotification.error(result);
                            that.set("vm_allItems", []);
                        }
                    });

                };

                function getSlotsFromDs(cards) {
                    var slots = [];

                    cards.forEach(function (clinicianCard) {
                        clinicianCard.apptsSlotsTray.slots.sort(function (first, second) {
                            return first.from - second.from;
                        }).forEach(function (slot) {
                            slots.push(slot);
                        });
                    });

                    return slots;
                }

                function expandClinicanCards(cards) {

                    setTimeout(function () {
                        cards.forEach(function (clinicianCard) {
                            clinicianCard.toogleFoter(true);
                        });
                    }, 100); // we need some delay in order to apply nested bindings. See this link for more details: http://www.telerik.com/forums/problem-with-databound-event-on-nested-list
                }
            }


            var initialScreenSize = window.innerHeight;
            window.addEventListener("resize", function() {
               if(window.innerHeight < initialScreenSize){
                    $(".notification-bar--provider-search").css("display","none");
                    $(".notification-bar--dialogbox").css("display","none");
                    //$(".header__patient-ss").css("display","none");
                    //$(".header__patient-ss").hide();
                    //$(".menu-toggle").css("display","none");
                  $("footer1").hide();
               } else{
                   // $(".notification-bar--provider-search").css("display","display");
                    //$(".menu-toggle").css("display","block");
                    $(".notification-bar--provider-search").css("display","");
                    $(".notification-bar--dialogbox").css("display","");
                   // $(".header__patient-ss").show();
                   $("footer1").show();
               }
             });




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

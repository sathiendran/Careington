//@ sourceURL=coverageSchedulerLeftBar.viewmodel.js

(function ($, snap, kendo, window) {
    "use strict";

    snap.namespace("snap.admin.schedule").use(["snap.EventAggregator", "snap.common.schedule.ScheduleCommon", "snap.service.staffAccountService", "snap.admin.schedule.TimeUtils", "snap.admin.schedule.AdminScheduleDSFactory"])
        .define("coverageSchedulerLeftBar", function ($eventAggregator, $scheduleCommonObjects, $staffAccountService, $timeUtils, $adminScheduleDSFactory) {

            function Container() {
                this.currentBlock = null;
                this.coverageBlocks = [];
                this.currentBlockIndex = 0;
                this._users = [];
                this._typeList = [];
                this._isDayMode = false;

                this.vm_coverageType = "1";
                this.vm_nameFilter = "";

                var cliniciansDS = $adminScheduleDSFactory.getCliniciansDS();

                this.updateUsers = function() {
                    var that = this;
                    if (this._users.length === 0) {
                        cliniciansDS.getCliniciansData().done(function (response) {
                            that.set("_users", response.map(function (item) {
                                return {
                                    image: item.person.photoUrl || getDefaultProfileImageForClinician(),
                                    name: $scheduleCommonObjects.getFullName(item.person),
                                    userId: item.userId
                                };
                            }));
                            that.trigger("change", { field: "vm_providersList" });
                        });
                    } else {
                        this.trigger("change", { field: "vm_providersList" });
                    }
                };


                /***************** PUBLIC API ******************/
                this.getCoverageType = function () {
                    var that = this;
                    return this.vm_coverageTypeList.find(function (item) {
                        return item.coverageID == that.vm_coverageType;
                    }).coverageName;
                };

                this.updateCoverageType = function (isDayMode) {
                    this._isDayMode = isDayMode;
                    var list = this._isDayMode ? [{ "coverageID": "0", "coverageValue": "All", "coverageName": "all" }] : [];
                    list = list.concat([{ "coverageID": "1", "coverageValue": "On-Demand", "coverageName": "onDemand" },
                           { "coverageID": "2", "coverageValue": "Patient Scheduled", "coverageName": "patientScheduled" },
                           { "coverageID": "3", "coverageValue": "Admin", "coverageName": "adminScheduled" },
                           { "coverageID": "4", "coverageValue": "Unavailable", "coverageName": "unavailable" }]);
                    this.set("vm_coverageTypeList", list);
                    if (!this._isDayMode && this.vm_coverageType === "0") {
                        this.set("vm_coverageType", list[0].coverageID);
                    }
                };

                this.setCoverageBlocks = function (coverageBlocks) {
                    this.coverageBlocks = coverageBlocks;
                };

                this.trySelectNowBlock = function(currentTime) {
                    if (currentTime instanceof Date) {
                        for(var i = 0; i < this.coverageBlocks.length; i++ ) {
                            if (this.coverageBlocks[i].start <= currentTime && this.coverageBlocks[i].end >= currentTime) {
                                this.selectBlockById(this.coverageBlocks[i].id);
                                return true;
                            }
                        }
                    }
                    return false;
                };

                this.selectBlockById = function (blockId) {
                    for(var i = 0; i < this.coverageBlocks.length; i++) {
                        if(this.coverageBlocks[i].id === blockId) {
                            this.set("currentBlock", this.coverageBlocks[i]);
                            this.set("currentBlockIndex", i);
                        }
                    }

                    this.trigger("change", { field: "vm_isPrevBlockExist" });
                    this.trigger("change", { field: "vm_isNextBlockExist" });
                    this.trigger("change", { field: "vm_providersList" });
                    $eventAggregator.published("cslb_currentEventChanged", this.currentBlock);
                };

                this.selectBlockByIndex = function (coverageBlockIndex) {
                    this.set("currentBlock", this.coverageBlocks[coverageBlockIndex]);
                    this.set("currentBlockIndex", coverageBlockIndex);
                    this.trigger("change", { field: "vm_isPrevBlockExist" });
                    this.trigger("change", { field: "vm_isNextBlockExist" });
                    this.trigger("change", { field: "vm_providersList" });
                    $eventAggregator.published("cslb_currentEventChanged", this.currentBlock);
                };

                /**************** MVVM BINDINGS ****************/
                this.vm_coverageTypeChanged = function () {
                    $eventAggregator.published("cslb_coverageTypeChanged", this.getCoverageType());
                };

                this.vm_startDay = function () {
                    return !!this.get("currentBlock") ? kendo.toString(this.get("currentBlock").start, "dddd") : "";
                };

                this.vm_startTime = function () {
                    return !!this.get("currentBlock") ? kendo.toString(this.get("currentBlock").start, "h:mm tt") : "";
                };

                this.vm_endTime = function () {
                    return !!this.get("currentBlock") ? kendo.toString(this.get("currentBlock").end, "h:mm tt") : "";
                };

                this.vm_onPrevBlockClick = function (e) {
                    e.preventDefault();
                    this.selectBlockByIndex(this.currentBlockIndex - 1);
                    this.trigger("change", { field: "vm_isPrevBlockExist" });
                    this.trigger("change", { field: "vm_isNextBlockExist" });                
                };

                this.vm_onNextBlockClick = function (e) {
                    e.preventDefault();
                    this.selectBlockByIndex(this.currentBlockIndex + 1);
                    this.trigger("change", { field: "vm_isPrevBlockExist" });
                    this.trigger("change", { field: "vm_isNextBlockExist" });
                };

                this.vm_isPrevBlockExist = function () {
                    return this.get("currentBlockIndex") > 0;
                };

                this.vm_isNextBlockExist = function () {
                    return this.get("currentBlockIndex") < (this.get("coverageBlocks").length - 1);
                };

                this.vm_providersList = function () {
                    var filteredUsers = [];
                    var that = this;
                    if (this.currentBlock) {
                        for (var i = 0, l = this.currentBlock.clinicians.length; i < l; i++) {
                            var user = this._users.find(function (item) {
                                return item.userId === that.currentBlock.clinicians[i];
                            });
                            if (!!user) {
                                filteredUsers.push(user);
                            }
                        }
                        if (!!this.vm_nameFilter) {
                            filteredUsers = filteredUsers.filter(function (item) {
                                return item.name.toLowerCase().indexOf(that.vm_nameFilter.toLowerCase()) > -1;
                            });
                        }
                    }

                    return filteredUsers;

                };

                this.vm_nameFilterChange = function () {
                    this.trigger("change", { field: "vm_providersList" });
                };

                this.vm_onClinicianClick = function (e) {
                    e.preventDefault();
                    sessionStorage.setItem("as_curretnAdminUserId", e.data.userId);
                    window.location.href = "/Admin/Main/#/scheduler/availabilities";
                };

                this.vm_coverageTypeList = [{ "coverageID": "1", "coverageValue": "On-Demand", "coverageName": "onDemand" },
                           { "coverageID": "2", "coverageValue": "Patient Scheduled", "coverageName": "patientScheduled" },
                           { "coverageID": "3", "coverageValue": "Admin Scheduled", "coverageName": "adminScheduled" },
                           { "coverageID": "4", "coverageValue": "Unavailable", "coverageName": "unavailable" }];
            }

            this.emptyNavigator = kendo.observable(new Container());
        }).singleton();
}(jQuery, snap, kendo, window));
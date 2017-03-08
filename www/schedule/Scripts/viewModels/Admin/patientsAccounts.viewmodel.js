(function (global, snap, kendo) {
    var
        app = global.app = global.app || {},
        util = snap.util,
        dateRangeSelection = snap.kendoDateRangeSelection;

    var crudServiceBaseUrl = "/api/v2/clinicians/patients";

    var messages = {
        setAsInactiveConfirm: "Are you sure that you want to disable the selected patient(s)?",
        setAsActiveConfirm: "Are you sure that you want to activate this patient?"
    };

    var searchTypeEnum = {
        "all": 1,
        "droppedAppointments": 2,
        "recentVisits": 3,
        "archived": 4
    };

    var patientStatusTypeEnum = {
        "active": 1,
        "inActive": 0,
        "pending": 2
    };

    kendo.data.binders.searchTypeVisibility = kendo.data.Binder.extend({
        init: function (element, bindings, options) {

            kendo.data.Binder.fn.
                        init.call(
                         this, element, bindings, options
                       );

            var target = $(element);
            this.typeCss = target.data("typeCss");
        },

        refresh: function () {
            if (this.bindings.searchTypeVisibility.get() === this.typeCss) {
                $(this.element).show();
            } else {
                $(this.element).hide();
            }
        }
    });

    kendo.data.binders.cssToggle = kendo.data.Binder.extend({

        init: function (element, bindings, options) {

            kendo.data.Binder.fn.
                        init.call(
                         this, element, bindings, options
                       );

            var target = $(element);
            this.enabledCss = target.data("enabledCss");
            this.disabledCss = target.data("disabledCss");
            this.typeCss = target.data("typeCss");
        },

        refresh: function () {
            if (this.bindings.cssToggle.get() === searchTypeEnum[this.typeCss]) {
                $(this.element).addClass(this.enabledCss);
                $(this.element).removeClass(this.disabledCss);
            } else {
                $(this.element).addClass(this.disabledCss);
                $(this.element).removeClass(this.enabledCss);
            }
        }
    });


    var patientsAccountsViewModel = kendo.observable({
        adminUserId: 0,
        isAllChecked: false,
        filterTimer: null,
        isSomeChecked: function () {
            var staffAccounts = this.accountsDataSource.data();
            for (var i = 0; i < staffAccounts.length; i++) {
                if (staffAccounts[i].isChecked)
                    return true;
            }

            return false;
        },
        nameFilterValue: "",
        searchType: searchTypeEnum.all,
        includeInactivePatients: false,
        isArchivedView: function () {
            return this.searchType === searchTypeEnum.archived;
        },

        viewPatientAccouts: function (e) {
            var type = $(e.currentTarget).data("typeCss");

            var searchType = searchTypeEnum.all;
            if (searchTypeEnum[type]) {
                searchType = searchTypeEnum[type];
            }

            this.set("searchType", searchType);
            this.trigger("change", { field: "isArchivedView" });

            //Set the first page as current page.
            //This action will automatically refresh data source: this.accountsDataSource.read();
            this.accountsDataSource.page(1);
        },

        onIncludeInactiveCheckboxClick: function () {
            this.accountsDataSource.page(1);
        },

        downloadCCR: function () {
            var patietIds = this._getAllSelectedAccounts().map(function (elem) {
                return elem.patientId;
            }).join(",");

            this._getPatientCCRInformation(patietIds);
        },

        setAsInactive: function () {
            var that = this;
            snap.SnapNotification().confirmationWithCallbacks(messages.setAsInactiveConfirm, function () {
                var selectedAccounts = that._getAllSelectedAccounts();
                var allCheckedForConsultations = [];
                selectedAccounts.forEach(function (element) {
                    allCheckedForConsultations.push(that.checkIfDelete(element).done(function(doDelete) {
                        if (doDelete) {
                            element.status = patientStatusTypeEnum.inActive;
                            element.isChecked = false;
                            //mark the records as dirty.
                            element.dirty = true;
                        } 
                    }).fail(function(msg) {
                        snapInfo(msg);
                    }));
                });
                $.when.apply($, allCheckedForConsultations).always(function () {
                    that.accountsDataSource.trigger("change", { action: "clickAllAccountsCheckBox" });
                    that.accountsDataSource.sync();

                    that.set("isAllChecked", false);
                    that.trigger("change", { field: "isSomeChecked" });
                });

            });
        },
        checkIfDelete: function(element) {
            var that = this;
            var checkDeletionPromise = $.Deferred();
            that.checkActiveConsultations(element.patientId).done(function (hasConsultations) {
                if (!hasConsultations) {
                    that.checkFutureConsultations(element.patientId).done(function(hasFutureConsultations) {
                        if (!hasFutureConsultations) {
                            checkDeletionPromise.resolve(true);
                        } else {
                            var waitCloseNotificationTimeout = 700;
                            window.setTimeout(function() {
                                snap.SnapNotification().confirmationWithCallbacks("If you are archiving this patient, you will need to cancel all currently scheduled appointments. Are you sure you want to proceed?",
                                    function() {
                                        checkDeletionPromise.resolve(true);
                                    },
                                    function() {
                                        checkDeletionPromise.resolve(false);
                                    }
                                );
                                
                            }, waitCloseNotificationTimeout);
                        }
                    });
                } else {
                    checkDeletionPromise.reject(["You cannot deactivate account of ",element.fullName," as he (she) has active appointment."].join(""));
                }
            });
            return checkDeletionPromise.promise();
        },
        addNewPatient: function (e) {
            e.preventDefault();
            if (snap.hasAnyPermission(snap.security.edit_patients_accounts)) {
                sessionStorage.setItem('snap_patientId_ref', 0);
                window.location.href = "/Admin/PatientProfileDetails.aspx";
            }
            else {
                snapInfo("You don't have permission to add Patient accounts.")
            }

        },
        nameFilterChange: function () {
            var that = this;
            clearTimeout(that.filterTimer);
            that.filterTimer = setTimeout(function () {
                that.accountsDataSource.page(1);
            }, 500);
        },

        toggleAllAccountsCheckBox: function () {
            var all = true;

            this.accountsDataSource.data().forEach(function (element) {
                all = all && element.isChecked;
            });

            this.set("isAllChecked", all);
        },

        clickAllAccountsCheckBox: function () {
            var that = this;
            this.accountsDataSource.data().forEach(function (element) {
                //Only activated patients have checkboxes for bulk actions like 'Download CCR' or 'Set as Inactive'.
                //We will set 'isChecked' properies only for active patients.
                if (element.status == patientStatusTypeEnum.active) {
                    element.isChecked = that.isAllChecked;
                }
            });

            this.trigger("change", { field: "isSomeChecked" });
            this.accountsDataSource.trigger("change", { action: "clickAllAccountsCheckBox" });
        },

        accountsDataSource: new kendo.data.DataSource({
            batch: true,
            transport: {
                create: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: 'application/json',
                    type: "post"
                },
                read: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: 'application/json',
                    type: "get"
                },
                update: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: 'application/json',
                    type: "put"
                },
                destroy: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    contentType: 'application/json',
                    type: "delete"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return JSON.stringify({ data: data.models });
                    }
                    else {
                        data.nameFilter = patientsAccountsViewModel.nameFilterValue;
                        data.searchType = patientsAccountsViewModel.searchType;
                        data.includeInactivePatients = patientsAccountsViewModel.includeInactivePatients;

                        var startDate = dateRangeSelection.startDate();
                        var endDate = dateRangeSelection.endDate();
                        //in order to include time component we add one day.
                        endDate.setDate(endDate.getDate() + 1);

                        data.startDate = kendo.toString(startDate, "d");
                        data.endDate = kendo.toString(endDate, "d");
                        return data;
                    }
                }
            },
            change: function (e) {
                //String describing the action type (available for all actions other than "read"). Possible values are "itemchange", "add", "remove" and "sync".
                if (typeof e.action !== "undefined") {
                    return;
                }

                patientsAccountsViewModel.set("isAllChecked", false);
                patientsAccountsViewModel.trigger("change", { field: "isSomeChecked" });

                $.each(e.items,
                    function (i, item) {
                        item.profileImage = item.profileImagePath
                            || getDefaultProfileImageForPatient();

                        item.trigger("change", { field: "profileImage" });
                    });
            },
            error: function (e) {
                var errorMessage = "Patients Accounts grid error. ";
                if (e.errorThrown === "Unauthorized") {
                    errorMessage = "You do not have role functions for managing Patients Accounts. Required role functions: View Patients Accounts, Edit Patients Accounts";
                }
                else if (typeof e.errorThrown != "undefined") {
                    errorMessage = errorMessage + e.errorThrown;
                }

                snapError(errorMessage);
            },
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "patientId",
                    fields: {
                        "patientId": {
                            type: "number"
                        },
                        "fullName": {
                            type: "string"
                        },
                        "profileImagePath": {
                            type: "string"
                        },
                        "phone": {
                            type: "string"
                        },
                        "isAuthorized": {
                            type: "boolean"
                        },
                        "isDependent": {
                            type: "string"
                        },
                        "guardianId": {
                            type: "number"
                        },
                        "isChecked": {
                            type: "boolean"
                        },
                        "status": {
                            type: "number"
                        }
                    },
                    onChange: function () {
                        patientsAccountsViewModel.toggleAllAccountsCheckBox();
                        patientsAccountsViewModel.trigger("change", { field: "isSomeChecked" });
                    },

                    scheduleAppointment: function () {
                        if (!this.isAuthorized) {
                            snapError("Can not schedule appointment, patient not Authorized");
                            return;
                        }

                        snap.admin.schedule.eventDialog().openNewAppointmentDialog({
                            clinicianId: null,
                            patientId: this.patientId,
                            userType: snap.common.schedule.ScheduleCommon().userType.admin
                        });
                    },

                    viewPatientProfile: function () {
                        var data = {
                            PatientID: this.patientId,
                            IsAuthorized: this.isAuthorized,
                            ConsultationID: 0,
                            searchType: 1
                        }
                        sessionStorage.setItem("snap_patientId_ref", this.patientId);
                        sessionStorage.setItem("snap_patientId_isDependent", this.isDependent);
                        sessionStorage.setItem("snap_guardianId", this.guardianId);
                        snap.submitForm({
                            url: "/Admin/Patient",
                            method: "POST"
                        }, {
                            patientId: this.patientId,
                            token: snap.userSession.token
                        });
                    },

                    activateUser: function () {
                        var that = this;
                        snap.SnapNotification().confirmationWithCallbacks(messages.setAsActiveConfirm, function () {
                            that.set("status", patientStatusTypeEnum.active);

                            patientsAccountsViewModel.accountsDataSource.trigger("change", { action: "clickAllAccountsCheckBox" });
                            patientsAccountsViewModel.accountsDataSource.sync();
                        });
                    }
                }
            },
            pageSize: 20,
            serverPaging: true
        }),
        isLoading: true,
        isNoData: function () {
            return !this.get("isLoading") && this.get("accountsDataSource").total() === 0;
        },
        LoadViewModel: function (currentUserId) {
            //For any non MVVM manipulations
            this.adminUserId = parseInt(currentUserId);
            var that = this;
            this.accountsDataSource.one("requestEnd", function (e) { // Set isLoading to false when first request is finished
                that.set("isLoading", false);
            });

            dateRangeSelection.onDateRangeChange(function () { that.accountsDataSource.read(); });

            var $consultationsListingControl = snap.shared.consultationsListingControl();
            $consultationsListingControl.initHub();
            $consultationsListingControl.init().done(function () {
                that.checkActiveConsultations = function (patientId) {
                    var checkedPromise = $.Deferred();
                    $consultationsListingControl.hub.getConsultationsInfo({
                        ConsultationStatus: snap.consultationsListingDataSource().consultationStutuses.Active,
                        PatientId: patientId,
                        IncludeDependents: true
                    }).done(function (resp) {
                        checkedPromise.resolve(resp.Data.length > 0);
                    }).fail(function () {
                        checkedPromise.reject();
                    })

                    return checkedPromise.promise();
                },
                that.checkFutureConsultations = function (patientId) {
                    var checkedConsultationPromise = $.Deferred();
                    var availabilityBlockService = snap.service.availabilityBlockService();
                    availabilityBlockService.getUserCurrentTime().done(function (userCurrentTimeResponse) {
                        var obj = {
                            patientIds: [patientId],
                            startDate: userCurrentTimeResponse.data[0]
                        };
                        availabilityBlockService.getAppointmentsForClinician(obj).done(function (resp) {
                            checkedConsultationPromise.resolve(resp.data != null && resp.data.length > 0);
                        }).fail(function () {
                            checkedConsultationPromise.reject();
                        });
                    }).fail(function () {
                        checkedConsultationPromise.reject();
                    });
                    return checkedConsultationPromise.promise();
                }
            });
        },

        imageLoadError: function (element) {
            element.onerror = "";
            element.src = "/images/Patient-Male.gif";
        },

        _getPatientCCRInformation: function (patientIDs) {
            try {
                var frmName = '/Admin/ReportBuilder.aspx';
                var inputs = '<input type="hidden" name=PatientIDs value="' + patientIDs + '" />';
                jQuery('<form action="' + frmName + snap.string.formatURIComponents('?mode=CCR&token={0}', snap.userSession.token) + '"  method="POST" >' + inputs + '</form>').appendTo('body').submit();
                return false;
            }
            catch (err) {
                logError("GetPatientCCRInformation - PatientAccounts.aspx", "Error", err, "");
            }
        },

        _getAllSelectedAccounts: function () {
            var accounts = [];

            this.accountsDataSource.data().forEach(function (element) {
                if (element.isChecked) {
                    accounts.push(element);
                }
            });

            return accounts;
        },
    });

    app.patientsAccountsService = {
        viewModel: patientsAccountsViewModel
    };
})(window, snap, kendo);
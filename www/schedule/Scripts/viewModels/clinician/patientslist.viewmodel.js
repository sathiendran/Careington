(function (global, snap, kendo) {
    var
        app = global.app = global.app || {},
        util = snap.util;

    var crudServiceBaseUrl = "/api/v2/clinicians/patients";

    var patientsListViewModel = kendo.observable({
        nameFilterValue: "",
        includeInactivePatients: false,
        canRecordConsultation: snap.canRecordConsultation(),
        canScheduleConsultation: function (item) {
            return item && (item.isActive === true && item.isAuthorized === true) && snap.canScheduleConsultation()
        },

        nameFilterChange: function () {
            if (this.accountsDataSource.page() !== 1) {
                this.accountsDataSource.page(1);
            } else {
                this.accountsDataSource.read();
            }
        },

        onIncludeInactiveCheckboxClick: function () {
            if (this.accountsDataSource.page() !== 1) {
                this.accountsDataSource.page(1);
            } else {
                this.accountsDataSource.read();
            }

        },
        accountsDataSource: new kendo.data.DataSource({
            batch: true,
            transport: {

                read:
                    {
                        url: ['/api/v2/clinicians/patients'].join(''),
                        dataType: "json",
                        contentType: 'application/json',
                        type: "get"
                    },

                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return JSON.stringify({ data: data.models });
                    }
                    else {
                        data.nameFilter = app.patientsListService.viewModel.nameFilterValue;
                        data.includeInactivePatients = app.patientsListService.viewModel.includeInactivePatients;
                        data.applyRules = true;
                        return data;
                    }
                 
                }

            },
            error: function (e) {
                var errorMessage = "Patients Accounts grid error. ";
                if (e.errorThrown === "Unauthorized") {
                    errorMessage = "You do not have role functions for viewing Patients Accounts. Required role function: View Patients Accounts";
                }
                else if (typeof e.errorThrown != "undefined") {
                    errorMessage = errorMessage + e.errorThrown;
                }

                snapError(errorMessage);
            },
            schema: {
                data: function (response) {
                    var data = response.data;
                    return data.map(function (item) {
                        return {
                            patientId: item.patientId,
                            fullName: item.fullName,
                            phone: item.phone,
                            profileImagePath: item.profileImagePath || getDefaultProfileImageForPatient(),
                            isActive: item.status === 1,
                            isAuthorized: item.isAuthorized,
                            viewPatientProfile: function () {
                                var data = {
                                    PatientID: item.patientId,
                                    IsAuthorized: item.isAuthorized,
                                    ConsultationID: 0,
                                    searchType: 1
                                }
                                sessionStorage.setItem("snap_patientId_ref", item.patientId);
                                snap.submitForm({
                                    url: "/Physician/PatientFile",
                                    method: "POST"
                                }, {
                                    patientId: item.patientId,
                                    token: snap.userSession.token
                                });

                            },
                            scheduleConsultation: function(e) {
                                e.preventDefault();
                                if (patientsListViewModel.canScheduleConsultation) {
                                    snap.admin.schedule.eventDialog().openNewAppointmentDialog({
                                        clinicianId: snap.profileSession.userId,
                                        patientId: item.patientId,
                                        userType: snap.common.schedule.ScheduleCommon().userType.clinician
                                    });
                                } else {
                                    snapInfo("You has no permission to schedule consultation");
                                }
                            },
                            recordConsultation: function(e) {
                                e.preventDefault();
                                if (patientsListViewModel.canRecordConsultation) {
                                    snap.admin.schedule.eventDialog().openNewRecordDialog({
                                        clinicianId: snap.profileSession.userId,
                                        patientId: item.patientId,
                                        userType: snap.common.schedule.ScheduleCommon().userType.clinician
                                    });
                                } else {
                                    snapInfo("You do not have permission to document an encounter");
                                }
                            }
                        }
                    });
                },
                total: "total",

            },
            pageSize: 30,
            serverPaging: true
        }),
        isLoading: true,
        isNoData: function () {
            return !this.get("isLoading") && this.get("accountsDataSource").total() === 0;
        },
        LoadViewModel: function () {
            //For any non MVVM manipulations
            var that = this;
            this.accountsDataSource.one("requestEnd", function (e) { // Set isLoading to false when first request is finished
                that.set("isLoading", false);
            });
            this.accountsDataSource.read();
        },

        imageLoadError: function (element) {
            element.onerror = "";
            element.src = "/images/Patient-Male.gif";
        }
    });

    app.patientsListService = {
        viewModel: patientsListViewModel
    };
})(window, snap, kendo);
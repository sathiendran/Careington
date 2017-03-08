/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="~/Scripts/kendo.all.min.intellisense.js" />
/// <reference path="~/Scripts/hubs/chatHub.js" />
/// <reference path="~/Scripts/dataSources/snap.callDataSource.js" />
/// <reference path="~/Scripts/dataSources/appointmentWindow.datasource.js" />

(function (global) {
    var AdminScheduleViewModel,
        app = global.app = global.app || {};

    var ddPatientList = "cmbPatientsList";
    var ddDoctorsList = "cmbDoctorsList";

    var displayMode = {
        create: "create", //Create new appointment
        update: "update", //Update appointment
        view: "view" //View appointment
    }

    var dataSourceType = {
        patients: "patients",
        doctors: "doctors"
    }

    var $mainHub = snap.hub.mainHub();
    var $consultationsListingHub = snap.hub.consultationsListingHub();

    var getFilterInput = function (controlId) {
        var filter = "";

        if ($("#" + controlId).data("kendoDropDownList")) {
            var filterInput = $("#" + controlId).data("kendoDropDownList").filterInput;

            if (filterInput && filterInput.length) {
                filter = filterInput[0].value;
            }
        }



        return filter;
    }

    var fetchAll = function (dataSource) {
        var defered = $.Deferred();

        // read the data items
        dataSource.fetch(function () {
            var allPatients = dataSource.data();
            defered.resolve(allPatients);
        });

        return defered.promise();
    }

    var getAllDoctors = function () {
        return fetchAll(snap.dataSource.Admin.Schedule.DoctorList);
    }

    var getAllPatients = function () {
        return fetchAll(snap.dataSource.Admin.Schedule.PatientList);
    }

    var getItemByValue = function (searchValue, arr, arrValueField) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][arrValueField] === searchValue) {
                return arr[i];
            }
        }

        return null;
    }

    var createEmptyDataSource = function () {
        return new kendo.data.DataSource({
            data: []
        });
    }

    var createDataSource = function (dsType) {
        var apiUrl = null;
        var parameterMap = null;

        switch (dsType) {
            case dataSourceType.patients:
                apiUrl = "/api/v2/clinicians/patients";
                parameterMap = function (data) {

                    data.nameFilter = getFilterInput(ddPatientList);
                    //#4865
                    //Because of strange api implementation. we need to pass isNameFilterRequired false if name is empty so that can also do empty search.
                    data.isNameFilterRequired = data.nameFilter == "" ? false : true;
                    data.includeInactivePatients = false;
                    data.includeNotAuthorized = false;
                    return data;
                }
                break;
            case dataSourceType.doctors:
                apiUrl = "/api/v2/clinicians/staffaccounts";
                parameterMap = function (data) {
                    data.staffNameFilter = getFilterInput(ddDoctorsList);
                    data.includeDoctorsWithoutAppointmentPermission = false;
                    data.includePendingDoctors = false;
                    //#4865
                    //Because of strange api implementation. we need to pass isNameFilterRequired false if name is empty so that can also do empty search.
                    data.isNameFilterRequired = data.staffNameFilter == "" ? false : true;
                    return data;
                }
                break;
        }

        return new kendo.data.DataSource({
            batch: true,
            transport: {
                read: {
                    url: apiUrl,
                    dataType: "json",
                    type: "get"
                },
                parameterMap: parameterMap
            },
            error: function (e) {
                var errorMessage = "Patients Accounts api error. ";
                if (e.errorThrown === "Unauthorized") {
                    errorMessage = "You do not have role functions for view " + dsType + " accounts.";
                } else if (typeof e.errorThrown != "undefined") {
                    errorMessage = errorMessage + e.errorThrown;
                }

                snapError(errorMessage);
            },
            schema: {
                data: "data",
                total: "total"
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        });
    }

    var refreshConsultationsListings = function () {
        if ($consultationsListingHub.isHubStarted()) {
            $consultationsListingHub.refresh();
        } else {
            $mainHub.register($consultationsListingHub);
            $consultationsListingHub.on("start", function () {
                $consultationsListingHub.refresh();
            });
            $mainHub.start();
        }
    }

    AdminScheduleViewModel = kendo.data.ObservableObject.extend({
        //The whole reports page should be re-write to use this view-model
        //This currently isn't doing that much right now.
        dMode: null,
        deferred: null,
        isUpdateMode: function () {
            return this.dMode === displayMode.update;
        },
        isCreateMode: function () {
            return this.dMode === displayMode.create;
        },
        isViewMode: function () {
            return this.dMode === displayMode.view;
        },
        isUpdateOrCreateMode: function () {
            return this.isUpdateMode() || this.isCreateMode();
        },
        isSecondaryConcernDropdownEnabled: function () {
            if (this.isUpdateOrCreateMode()) {
                return !this.secondaryConsernNone;
            }

            return false;
        },

        popup: null,
        isShowSuccess: true,
        needCopy: false,
        dataDoctorList: null,
        dataPatientList: null,

        onPatientsListDataBound: function () {
            if (this.data.patientId) {
                var viewModel = this;
                getAllPatients().done(function (allPatients) {
                    var patientProfile = getItemByValue(viewModel.data.patientId, allPatients, "userID");
                    patientProfile.patientId = patientProfile.id;

                    var dataSource = viewModel.dataPatientList;
                    var data = dataSource.data();

                    if (getItemByValue(patientProfile.patientId, data, "patientId") === null) {
                        data.splice(0, 0, patientProfile);
                        viewModel.trigger("change", { field: "data.patientId" });
                    }
                });
            }
        },

        onDoctorsListDataBound: function () {
            if (this.data.assignedDoctorId) {
                var viewModel = this;
                getAllDoctors().done(function (allDoctors) {
                    var doctorProfile = getItemByValue(viewModel.data.assignedDoctorId, allDoctors, "userID");
                    doctorProfile.userId = doctorProfile.userID;

                    var dataSource = viewModel.dataDoctorList;
                    var data = dataSource.data();

                    if (getItemByValue(doctorProfile.userID, data, "userId") === null) {
                        data.splice(0, 0, doctorProfile);
                        viewModel.trigger("change", { field: "data.assignedDoctorId" });
                    }
                });
            }
        },

        //        dataConcernList: [{ key: 'key', name: 'name' }, { key: 'key2', name: 'name2' }],
        dataConcernList: snap.dataSource.Admin.Concern.PrimaryList,
        dataConcernSecondaryList: snap.dataSource.Admin.Concern.SecondaryList,
        otherPrimaryConcern: snap.dataSource.Admin.Concern.Primary.OtherConcern,
        otherSecondaryConcern: snap.dataSource.Admin.Concern.Secondary.OtherConcern,
        otherPrimaryConcernId: function () {
            if (this.otherPrimaryConcern != null && this.otherPrimaryConcern.total() > 0)
                return this.otherPrimaryConcern.at(0).id;

            return snap.dataSource.Admin.Concern.Primary.otherConcernId;
        },
        otherSecondaryConcernId: function () {
            if (this.otherSecondaryConcern != null && this.otherSecondaryConcern.total() > 0)
                return this.otherSecondaryConcern.at(0).id;

            return snap.dataSource.Admin.Concern.Secondary.otherConcernId;
        },
        consultationService: new snap.dataService.Schedule.Consultation(),
        patientDetailService: new snap.dataService.Schedule.PatientDetail(),
        data: null,


        onPatientChange: function () {
            var prtientId = this.get("data.patientId");
            if (prtientId > 0) {
                this.AssignSelectedPatientDetails(prtientId);
            }

        },
        AssignSelectedPatientDetails: function (patietnId) {
            var viewModel = this;
            this.patientDetailService.getPatientDetail(patietnId, "all").done(function (response) {
                var patient = new snap.model.Common.schedulePatient;
                var userList2 = new snap.model.Common.userList;
                var data = response.data[0];
                if (data) {
                    if (data.account) {
                        patient.set("id", data.account.patientId);
                    } else {
                        patient.set("id", patietnId);
                    }
                    patient.set("name", data.patientName + " " + data.lastName);
                    patient.set("city", data.city);
                    patient.set("zipCode", data.zipCode);
                    patient.set("gender", data.gender);
                    patient.set("dob", data.dob);
                    //we can also check if data.address has empty value then only we can go for following conditons
                    if (data.addresses && data.addresses.length) {
                        patient.set("address", data.addresses[0].addressText);
                    }
                    if (data.physicianDetails) {
                        patient.set("primaryPhysician", data.physicianDetails.primaryPhysician);
                    }
                    patient.set("$id", 1); //by default for first index of array
                }
                viewModel.set("patient", patient);
            });

        },
        onCloseSheduler: function () {
            var popupWin = this.popup.data("kendoWindow");
            popupWin.close();
            this.deferred.fail();

        },
        onUpdataSheduler: function () {
            var viewModel = this;
            var validationmsg = [];
            snapRemoveErrorNotification();

            if (!this.get("data.assignedDoctorId"))
                validationmsg.push("Please Select Provider");
            if (!this.get("data.patientId"))
                validationmsg.push("Please Select Patient");

            if (!this.get("data.primaryConsernId")) {
                validationmsg.push("Please Select Primary Concern");
            } else if (this.get("data.primaryConsernId") == this.otherPrimaryConcernId() && $.trim(this.get("data.primaryConsernOther")) == "") {
                validationmsg.push("Please Enter Primary Concern");
            }


            if (!this.get("data.secondaryConsernNone")) {
                if (!this.get("data.secondaryConsernId")) {
                    validationmsg.push("Please select a Secondary Concern, or check \"None\".");
                } else if (this.get("data.primaryConsernId") != this.otherPrimaryConcernId() && this.get("data.primaryConsernId") == this.get("data.secondaryConsernId")) {
                    validationmsg.push("Primary and Secondary Concerns must be different. ");
                } else if (this.get("data.secondaryConsernId") == this.otherSecondaryConcernId() && $.trim(this.get("data.secondaryConsernOther")) == "") {
                    validationmsg.push("Please Enter Secondary Concern ");
                } else if ((this.vm_secondaryConsernId === otherSecondaryConcernId && this.vm_primaryConsernId === otherPrimaryConcernId) && ($.trim(this.primaryConcernOtherText) === $.trim(this.secondaryConcernOtherText))) {

                    errorList.push("Primary and Secondary Concerns must be different.");
                }
            }
            if (!this.get("data.scheduledDate"))
                validationmsg.push("Please select valid Appointment Date");
            if (!this.get("data.scheduledTime"))
                validationmsg.push("Please select valid Appointment Time");
            var scheduledTime = this.get("data.scheduledTime");
            var scheduledDate = this.get("data.scheduledDate");
            if (scheduledDate && scheduledTime) {
                scheduledDate.setHours(scheduledTime.getHours());
                scheduledDate.setMinutes(scheduledTime.getMinutes());
                scheduledDate.setSeconds(0);
            }
            if (validationmsg.length > 0) {
                snapError(validationmsg.join("<br>"));
                return;
            }
            var datels = {
                assignedDoctorId: this.get("data.assignedDoctorId"),
                patientId: this.get("data.patientId"),
                consultationId: this.get("data.consultationId"),
                scheduledTime: scheduledDate.toLocalISO()
            }
            var fullDetail = {
                isNoCharge: this.get("data.isNoCharge"),
                note: this.get("data.note"),
            }
            var selPrimaryConcernId = this.get("data.primaryConsernId");
            var selPrimaryConcern = this.dataConcernList.get(selPrimaryConcernId).name;

            if (selPrimaryConcernId == this.otherPrimaryConcernId()) {
                fullDetail.primaryConsern = selPrimaryConcernId + "?" + this.get("data.primaryConsernOther");
            } else {
                fullDetail.primaryConsern = selPrimaryConcernId + "?" + selPrimaryConcern;
            }

            if (!this.get("data.secondaryConsernNone")) {
                var secondaryConsernId = this.get("data.secondaryConsernId");
                var secondaryConsern = this.dataConcernSecondaryList.get(secondaryConsernId).name;


                if (secondaryConsernId == this.otherSecondaryConcernId()) {
                    fullDetail.secondaryConsern = secondaryConsernId + "?" + this.get("data.secondaryConsernOther");
                } else {
                    fullDetail.secondaryConsern = secondaryConsernId + "?" + secondaryConsern;
                }
            }
            fullDetail = $.extend(fullDetail, datels);
            if (this.needCopy) datels = $.extend({ consultationId: null }, datels);
            this.consultationService.checkSlot(datels).done(function (data) {
                data = data.data[0];
                if (data.isDoctorAvailable && data.isPatientAvailable && data.isTimeAvailable) {
                    viewModel.UpdateScheduledAlready(fullDetail);
                } else {
                    var validationmsg = [];
                    if (!data.isTimeAvailable) {
                        validationmsg.push("Schedule Date & Time should greater than Current Date and Time of logged in user Timezone.");
                    }
                    if (!data.isPatientAvailable) {
                        validationmsg.push("Selected Patient already has another appointment booked for this slot");
                    }
                    if (validationmsg.length > 0) {
                        snapError(validationmsg.join("<br>"));
                        return;
                    } else {
                        if (!data.isDoctorAvailable) {
                            snapConfirm("Provider is already booked for a consultation at that time. Do you still want to proceed?");
                            $("#btnConfirmYes").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                                viewModel.UpdateScheduledAlready(fullDetail);
                            });

                            $("#btnConfirmNo").click(function () {
                                $(".k-notification-confirmation").parent().remove();
                            });

                        }
                    }

                }
            });

        },
        UpdateScheduledAlready: function (scheduledDate) {
            var viewModel = this;
            var popupWin = this.popup.data("kendoWindow");
            var deferred = this.deferred;
            var event;
            if (scheduledDate.consultationId && !this.needCopy)
                event = this.consultationService.save(scheduledDate.consultationId, scheduledDate);
            else
                event = this.consultationService.add(scheduledDate);
            event.done(function (data) {
                if (data) {
                    if (scheduledDate.consultationId && !this.needCopy) {
                        snapSuccess("Scheduled Consultation Details Updated Successfully");
                    } else {
                        snapSuccess("New Appointment Scheduled Successfully");
                    }

                    popupWin.close();
                    deferred.resolve(scheduledDate.consultationId, data);

                    refreshConsultationsListings();
                }
                else {
                    snapError("Failed to Update Consultation Details");
                }
            });
        },

        onBlurPrimaryConsern: function () {
            if (this.get("data.secondaryConsernNone"))
                $("#txtAppointmentNotes").data("kendoEditor").focus();

        },
        onBlurSecondaryConsern: function () {
            $("#txtAppointmentNotes").data("kendoEditor").focus();
        },

        //responsible for creating viewModel object and bind it to container
        initViewModel: function () {
            //Set min date for Past schedule appointment and DNA consultation 

            if (this.popup == null) {
                this.popup = $('<div id="divSchedulerAptPopup" class="popup apt-scheduler"></div>');
                this.popup.appendTo('body');
                var viewModel = this;
                var popup = this.popup;
                this.popup.load("/Content/Admin/ScheduledPopup.html?t=" + (new Date()).getTime(), function () {
                    kendo.bind(popup, viewModel);
                    var popupWin = popup.data("kendoWindow");
                    popupWin.center();
                    popupWin.open();
                    $("#dtpScheduleDatepicker").data("kendoDatePicker").min(viewModel.minDate());
                    viewModel.trigger("change", { field: "data.scheduledDate" });
                    $("#selPrimaryConcern").blur(function () {
                        viewModel.onBlurPrimaryConsern();
                    });
                    $("#selSecondaryConcern").blur(function () {
                        viewModel.onBlurSecondaryConsern();
                    });

                    viewModel.otherPrimaryConcern.fetch();
                    viewModel.otherSecondaryConcern.fetch();
                });
                var win = $(this.popup).kendoWindow({
                    modal: true,
                    maxWidth: 800,
                    pinned: false,
                    resizable: false,
                    visible: false,
                    position: {
                        top: 100
                    },
                    draggable: true,
                    title: 'Schedule an Appointment',
                    close: this.onWinClose,
                    actions: [
                    "Close"
                    ]
                }).data("kendoWindow");


            } else {
                var popupWin = this.popup.data("kendoWindow");
                popupWin.center();
                popupWin.open();
                $("#dtpScheduleDatepicker").data("kendoDatePicker").min(this.minDate());
                this.trigger("change", { field: "data.scheduledDate" });

            }
        },
        patienAge: function () {
            return snap.getAgeString(this.get("patient.dob"));
        },
        patienGender: function () {
            return snap.getGenderString(this.get("patient.gender"));
        },
        isMoreConsern: function () {
            return this.get("data.primaryConsernId") == this.otherPrimaryConcernId() || this.get("data.secondaryConsernId") == this.otherSecondaryConcernId();
        },
        primaryVisibleOther: function () {
            return this.get("data.primaryConsernId") == this.otherPrimaryConcernId() ? 'visible' : 'hidden';
        },
        secondaryVisibleOther: function () {
            return this.get("data.secondaryConsernId") == this.otherSecondaryConcernId() ? 'visible' : 'hidden';
        },
        patientVisible: function () {
            return this.get("data.patientId") > 0 ? 'visible' : 'hidden';
        },
        minDate: function () {
            var minDate = snap.dateLimits.getMinScheduledDate();
            minDate.setHours(0, 0, 0, 0);
            var scheduledDate = new Date(app.adminScheduleService.scheduleTime);
            scheduledDate.setHours(0, 0, 0, 0);
            var chkMinDate = scheduledDate < minDate;
            if (chkMinDate) {
                minDate = scheduledDate;
            }
            return minDate;
        },

        openSiwdow: function (data) {
            this.initViewModel();
        },
       
        noneCheck: function (e) {
            this.set("data.secondaryConsernId", null);
            this.set("data.secondaryConsernOther", "");
        },
        noneEnabled: function () {
            return !!this.get("data.secondaryConsernId") && this.get("isUpdateOrCreateMode");
        },
        secondaryConcernChanged: function (e) {
            this.set("data.secondaryConsernNone", e.data.data.secondaryConsernId == null);
        },

        viewAppointment: function ViewAppointment(consultationId, isAuthorized, options) {


            var viewModel = this;
            viewModel.otherPrimaryConcern.fetch();
            viewModel.otherSecondaryConcern.fetch();

            viewModel.set("data", new snap.model.Common.scheduleConsultation);
            viewModel.set("patient", new snap.model.Common.schedulePatient);

            if (options && options.isShowSuccess !== undefined) {
                this.isShowSuccess = options.isShowSuccess;
            } else {
                this.isShowSuccess = true;
            }
            if (options && options.needCopy !== undefined) {
                this.needCopy = options.needCopy;
            } else {
                this.needCopy = false;
            }

            if (consultationId) {
                this.consultationService.getConsultationDetail(consultationId).done(function (response) {
                    var data = response.data[0];
                    if (isAuthorized != "Y") {
                        data.patientId = null;
                        data.patient = null;
                    }

                    data.primaryConsernId = null;
                    if (data.primaryConsern) {
                        var pc = data.primaryConsern.split('?');
                        data.primaryConsernId = pc[0];
                        data.primaryConsern = pc[1];
                        if (data.primaryConsernId == viewModel.otherPrimaryConcernId()) data.primaryConsernOther = data.primaryConsern;
                    }
                    data.secondaryConsernid = null;

                    if (data.secondaryConsern) {
                        var sc = data.secondaryConsern.split('?');
                        data.secondaryConsernId = sc[0];
                        data.secondaryConsern = sc[1];
                        if (data.secondaryConsernId == viewModel.otherSecondaryConcernId()) data.secondaryConsernOther = data.secondaryConsern;
                        secondaryConsernNone = false;
                        app.adminScheduleService.secondaryConsernNone = false;
                        data.secondaryConsernNone = false;
                    } else {
                        app.adminScheduleService.secondaryConsernNone = true;
                        data.secondaryConsernNone = true;
                    }


                    data.scheduledDate = data.scheduledTime;
                    app.adminScheduleService.scheduleTime = data.scheduledTime;

                    var model = new snap.model.Common.scheduleConsultation;
                    var patient = new snap.model.Common.schedulePatient;
                    $.each(data, function (i, v) {
                        model.set(i, v);
                    });
                    if (data["patient"]) {
                        $.each(data["patient"], function (i, v) {
                            patient.set(i, v);
                        });
                    };
                    model.scheduledTime = snap.dateConversion.parseIsoDatetime(data.scheduledTime);
                    model.scheduledDate = model.scheduledTime;

                    viewModel.set("data", model);
                    viewModel.set("patient", patient);

                    viewModel.initViewModel();

                });

            } else {
                // New item
                if (options) {
                    if (options.doctorId)
                        viewModel.set("data.assignedDoctorId", options.doctorId);
                    if (options.patientId) {
                        viewModel.set("data.patientId", options.patientId);
                        viewModel.onPatientChange();
                    }
                    if (options.schedulingReasonType)
                        viewModel.set("data.schedulingReasonType", options.schedulingReasonType);
                }
                viewModel.initViewModel();
            }

            if (options && options.displayMode) {
                this.dMode = options.displayMode;
            } else {
                this.dMode = consultationId ? displayMode.update : displayMode.create;
            }

            this.trigger("change", { field: "isUpdateMode" });
            this.trigger("change", { field: "isCreateMode" });
            this.trigger("change", { field: "isViewMode" });


            this.set("dataPatientList", this.dMode === displayMode.view ? createEmptyDataSource() : createDataSource(dataSourceType.patients));
            this.set("dataDoctorList", this.dMode === displayMode.view ? createEmptyDataSource() : createDataSource(dataSourceType.doctors));


            this.deferred = new jQuery.Deferred();
            return this.deferred;
        }
    });

    app.adminScheduleService = {
        scheduleTime: '',
        viewModel: new AdminScheduleViewModel()
    };



})(window);
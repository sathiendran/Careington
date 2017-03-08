var snap = snap || {};
snap.dataSource = snap.dataSource || {};
snap.dataSource.Admin = snap.dataSource.Admin || {};
snap.dataSource.Admin.Schedule = snap.dataSource.Admin.Schedule || {};
snap.dataSource.Admin.Concern = snap.dataSource.Admin.Concern || {};
snap.dataSource.Admin.Concern.Primary = snap.dataSource.Admin.Concern.Primary || {};
snap.dataSource.Admin.Concern.Secondary = snap.dataSource.Admin.Concern.Secondary || {};
snap.dataSource.Admin.Concern.Primary.otherConcernId = -1;
snap.dataSource.Admin.Concern.Primary.otherConcernText = "Other (provide details below)";
snap.dataSource.Admin.Concern.Secondary.otherConcernId = -2;
snap.dataSource.Admin.Concern.Secondary.otherConcernText = "Other (provide details below)";

snap.dataService = snap.dataService || {};
snap.dataService.Schedule = snap.dataService.Schedule || {};

(function () {

    snap.dataSource.Admin.ajaxError = function (xhr, status, error) {
        if (xhr.status == 401) {
            window.location = "/Admin/Login";
        }
        else {
            if (xhr.responseJSON && xhr.responseJSON.message)
                snapError(xhr.responseJSON.message);
            else
                snapError(error?error:xhr.responseText);
        }
    };
    snap.dataSource.Admin.Schedule.DoctorList = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("schedule/list/doctors"),
                cache: true
            }
        },
       schema: {
                model: snap.model.Common.userList
            }

        
    });

    snap.dataSource.Admin.Schedule.PatientList = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("schedule/list/patients"),
                cache: true
            }
        },
        schema: {
                model: snap.model.Common.userList
            }
        
    });


    snap.dataSource.Admin.Concern.PrimaryList = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("v2/schedule/concern/primary"),
                cache: true
            }
        },
        schema: {
            model: snap.model.Common.ComboList,
            data: function(result) {
                //in results now
               //result.push({ id: snap.dataSource.Admin.Concern.Primary.otherConcernId, name: snap.dataSource.Admin.Concern.Primary.otherConcernText });
                return result.data;
            }
        }
    });
    
    snap.dataSource.Admin.Concern.SecondaryList = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("v2/schedule/concern/secondary"),
                cache: true
            }
        },
        schema: {
            model: snap.model.Common.ComboList,
            data: function (result) {
                return result.data;
            }
        }
    });

    snap.dataSource.Admin.Concern.Primary.OtherConcern = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("v2/schedule/concern/primary/other"),
                cache: true
            }
        },
        schema: {
            model: snap.model.Common.ComboList,
            data: function (result) {
                return result.data;
            }
        }
    });

    snap.dataSource.Admin.Concern.Secondary.OtherConcern = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("v2/schedule/concern/secondary/other"),
                cache: true
            }
        },
        schema: {
            model: snap.model.Common.ComboList,
            data: function (result) {
                return result.data;
            }
        }
    });
    /*
    snap.dataSource.Admin.Schedule.Consultation = new snap.dataSource.Common({
        transport: {
            read: {
                url: snap.dataSource.getApiUrl("admin/schedule/consultations")
            },
            schema: {
                model: { id: "id" }
            }
        }
    });
    */
    snap.dataService.Schedule.Consultation = function () {
        'use strict';
        var
        add = function (data) {
            return $.ajax({ type: "POST", contentType: "application/json", url: snap.dataSource.getApiUrl("admin/schedule/consultations"), data: JSON.stringify(data) })
                .fail(snap.dataSource.Admin.ajaxError);
        },
        save = function (id, data) {
            return $.ajax({ type: "PUT", contentType: "application/json", url: [snap.dataSource.getApiUrl("admin/schedule/consultations/"), id].join(""), data: JSON.stringify(data) })
                .fail(snap.dataSource.Admin.ajaxError);
        },
        checkSlot = function (data) {

            return $.ajax({ type: "POST", contentType: "application/json", url: snap.dataSource.getApiUrl("v2/schedule/consultations/checkSlot"), data: JSON.stringify(data) })
                .fail(snap.dataSource.Admin.ajaxError);

        },
        get = function (id) {
            return $.getJSON([snap.dataSource.getApiUrl("schedule/consultations/"), id].join(""))
            .fail(snap.dataSource.Admin.ajaxError);
        },
        getConsultationDetail = function (id) {
            return $.getJSON([snap.dataSource.getApiUrl("v2/schedule/consultations/"), id].join(""))
            .fail(snap.dataSource.Admin.ajaxError);
        };

        return {
            add: add,
            save: save,
            checkSlot: checkSlot,
            get: get,
            getConsultationDetail: getConsultationDetail
        };

    };

    snap.dataService.Schedule.Patient = function () {
        'use strict';
        var
        getShort = function (id) {
            return $.getJSON([snap.dataSource.getApiUrl("admin/schedule/patients/"), id, "/short"].join(""))
            .fail(snap.dataSource.Admin.ajaxError);
        };

        return {
            getShort: getShort

        };

    };
    
    snap.dataService.Schedule.PatientDetail = function () {
        'use strict';
        var getPatientDetail = function (id, include) {
            return $.get([snap.baseUrl, "/api/v2/patients/profile/", id, "?include=" + include].join("")).fail(snap.dataSource.Admin.ajaxError);
        };
        return {
            getPatientDetail: getPatientDetail
        };
    };

}());
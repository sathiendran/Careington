/// <reference path="jquery-2.1.3.js" />
var snap = snap || {};

snap.getScript = snap.getScript || $.getScript;

; (function (ua) {
    //Edge Support
    var browserRxs = {
        edge: /(edge)[ \/]([\w.]+)/i
    };
    for (var agent in browserRxs) {
        if (browserRxs.hasOwnProperty(agent)) {
            var match = ua.match(browserRxs[agent]);
            if (match) {
                var browser = {};
                browser[agent] = true;
                browser[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
                browser.version = parseInt(document.documentMode || match[2], 10);
                kendo.support.browser = browser;
            }
        }
    }
}(navigator.userAgent));

snap.createCache = snap.createCache || function (requestFunction) {
    var cache = {};
    return function (key, callback) {
        if (!cache[key]) {
            cache[key] = $.Deferred(function (defer) {
                requestFunction(defer, key);
            }).promise();
        }
        return cache[key].done(callback);
    };
};
snap.cachedGetScript = snap.createCache(function (defer, url) {
    snap.getScript(url).then(defer.resolve, defer.reject);
});
snap.cachedGetHtml = snap.cachedGetHtml || snap.createCache(function (defer, url) {
    if (url.indexOf("svp=snapversion") < 0) {
        if (url.indexOf("?") >= 0) {
            url = url + "&svp=snapversion";
        } else {
            url = url + "?svp=snapversion";
        }
    }
    $.get(url).then(defer.resolve, defer.reject);
});
$.extend(snap,
{
    isUnloading: false,
    defaultHeight: 'ft/in',
    defaultWeight: 'lbs',
    loadSyncScript: function(fileName) {
        try {
            $.ajaxSetup({ async: false });
            $.getScript(fileName); //We don't use the async callback, because we need the translation in the next method
            $.ajaxSetup({ async: true });

        } catch (e) {
            console.error('Error while loading : ' + fileName);
        }
    },
    getBaseUrl: function() {
        var _url = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";

        return _url;
    },
    getHubUrl: function() {
        return snap.getBaseUrl() + "api/signalr/hubs";

    },
    loadGlobule: function() {
        if (isEmpty(snap.hospitalSession) || isEmpty(snap.hospitalSession.locale))
            snap.loadSyncScript('/Scripts/localization/labels-en-US.js');
        else
            snap.loadSyncScript('/Scripts/localization/labels-' + snap.hospitalSession.locale + '.js');
    },
    localize: function() {
        $(".local").each(function (e) {
                $(this).html(snap.labels[$(this).data("label")]);
            });
    },
    getUrlParam: function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    },
    clearUserTimeZone: function() {
        $.ajax({
            type: "DELETE",
            url: "/api/v2/caches?cacheType=userTimeZone",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },

    openHelp: function(helpType) {
        var path = '/api/v2/helpcenter/customer/url';
        if (helpType == 'admin')
            path = '/api/v2/helpcenter/admin/url';
        else if (helpType == 'clinician')
            path = '/api/v2/helpcenter/physician/url';

        $.ajax({
            type: "GET",
            url: path,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                if (response.data && response.data.length) {
                    var win = window.open(response.data[0], '_blank');
                    if (win) {
                        win.focus();
                    } else {
                        snapInfo('Please allow popups for this site');
                    }

                }
            }
        });
    },

    htmlDecode: function(value) {
        if (value != null)
            return $('<div/>').html(value).text();

        return value;
    },

    patientLogin: function() {
        if (isEmpty(snap.hospitalSession))
            return "/Customer/Login";
        if (isEmpty(snap.hospitalSession.snapLogin) && snap.userSession && snap.userSession.snapLogin)
            return "/Customer/Login";
        if (! isEmpty(snap.hospitalSession.patientLogin)) {
            return snap.hospitalSession.patientLogin;
        }
        else {
            return "/Customer/Login";
        }

    },
    adminLogin: function() {
        return "/Admin/Login";
    },

    getPatientHome: function() {
        return "/Customer/Main/#/home";
    },
    patientConsultEndUrl: function() {
        if (isEmpty(snap.hospitalSession))
            return snap.getPatientHome();
        if (isEmpty(snap.hospitalSession.snapLogin) && snap.userSession.snapLogin)
            return snap.getPatientHome();
        if (!isEmpty(snap.hospitalSession.patientConsultEndUrl)) {
            return snap.hospitalSession.patientConsultEndUrl;
        }
        else {
            return snap.getPatientHome();
        }

    },
    getClinicianHome: function () {
        return "/Physician/Main/#/patientQueue";
    },
    clinicianLogin: function() {
        if (isEmpty(snap.hospitalSession))
            return "/Physician/Login";
        if (isEmpty(snap.hospitalSession.snapLogin) && snap.userSession && snap.userSession.snapLogin)
            return "/Physician/Login";
        if (!isEmpty(snap.hospitalSession.clinicianLogin)) {
            return snap.hospitalSession.clinicianLogin;
        }
        else {
            return "/Physician/Login";
        }

    },
    clinicianConsultEndUrl: function() {
        if (isEmpty(snap.hospitalSession))
            return snap.getClinicianHome();
        if (isEmpty(snap.hospitalSession.snapLogin) && snap.userSession.snapLogin)
            return snap.getClinicianHome();
        if (!isEmpty(snap.hospitalSession.clinicianConsultEndUrl) && (snap.hospitalSession.clinicianConsultEndUrl !== "/Physician/WaitingList")) {
            return snap.hospitalSession.clinicianConsultEndUrl;
        }
        else {
            return snap.getClinicianHome();
        }

    },
    userAborted: function(xhr) {
        return !xhr.getAllResponseHeaders() || xhr.status == 401;
    },

    applyFieldValidation: function(hospitalSetting, field) {

        if (hospitalSetting) {
            field.addClass('required');
        }

    },
    getGenderString: function(gender) {
        switch (gender) {
            case "F": return "Female";
            case "M": return "Male";
            default: return "N/A";
        }
    },
    getAgeString: function(dbo) {
        if (dbo == null || dbo == "")
            return "";
        if (dbo == "N/A")
            return "N/A";
        if (dbo == ": N/A")
            return ": N/A";
        var hasColon = false;

        if ((typeof dbo === "string") && (dbo.indexOf(":") === 0)) {
            hasColon = true;
            dbo = dbo.replace(":", "").trim();
        }

        var ret = "";
        var now = new Date();
        var yearNow = now.getYear();
        var monthNow = now.getMonth();
        var dateNow = now.getDate();

        var compareDob = new Date(dbo);
        var yearDob = compareDob.getYear();
        var monthDob = compareDob.getMonth();
        var dateDob = compareDob.getDate();

        var year = yearNow - yearDob;
        var day;
        var month;
        if (monthNow >= monthDob)
            month = monthNow - monthDob;
        else {
            year--;
            month = 12 + monthNow - monthDob;
        }
        if (dateNow >= dateDob)
            day = dateNow - dateDob;
        else {
            month--;
            day = 31 + dateNow - dateDob;

            if (month < 0) {
                month = 11;
                year--;
            }
        }

        if (year > 0) {
            ret = year + " " + (year > 1 ? "Years" : "Year");
        } else if (month > 6) {
            ret = month + " " + (month > 1 ? "Months" : "Month");
        } else if (month > 0) {
            ret = month + " " + (month > 1 ? "Months" : "Month");
            ret += " " + day + " " + (day > 1 ? "Days" : "Day");
        } else {
            ret += " 0 Month " + day + " " + (day > 1 ? "Days" : "Day");
        }
        return hasColon ? (": " + ret) : ret;
    },
    getAgeCount: function(dob) {
        if (dob == null || dob == "")
            return "";
        var parsedDob = new Date(Date.parse(dob));
        var dobYear = parsedDob.getFullYear();
        var dobMonth = parsedDob.getMonth();
        var dobDate = parsedDob.getDate();
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        var currentYear = d.getFullYear();
        var currentMonth = d.getMonth();
        var currentDate = d.getDate();

        var ageCount = currentYear - dobYear;
        var dayCount;
        var monthCount;
        if (currentMonth >= dobMonth)
            monthCount = currentMonth - dobMonth;
        else {
            ageCount--;
            monthCount = 12 + currentMonth - dobMonth;
        }
        if (currentDate >= dobDate)
            dayCount = currentDate - dobDate;
        else {
            monthCount--;
            dayCount = 31 + currentDate - dobDate;

            if (monthCount < 0) {
                monthCount = 11;
                ageCount--;
            }
        }
        return {
            year: ageCount,
            month: monthCount,
            day: dayCount
        };
    },
    addVersion: '?svp=snapversion',
    setHospitalSettings: function () {
        snap.getSnapUserSession();
        if (isEmpty(snap.hospitalId)) {
            snap.hospitalId = snap.hospitalSession.hospitalId;
        }
        var $def = $.Deferred();
        var path = "/api/v2/Hospital/" + snap.hospitalId;

        $.ajax({
            url: path,
            type: 'GET',
            dataType: 'json',
            async: false,
            contentType: "application/json; charset==utf-8",

            success: function (response) {
                if (response) {
                    var data = response.data[0].enabledModules;
                    var hsettings = {};
                 
                    hsettings.eCommerce = data.indexOf("ECommerce") > -1;
                    hsettings.onDemand = data.indexOf("OnDemand") > -1;
                    hsettings.cPTCodes = data.indexOf("CPTCodes") > -1;
                    hsettings.messaging = data.indexOf("Messaging") > -1;

                    hsettings.insuranceVerification = data.indexOf("InsuranceVerification") > -1;
                    hsettings.ePrescriptions = data.indexOf("EPrescriptions") > -1;
                    hsettings.ePrescriptions_EPSchedule = data.indexOf("EPrescriptions_EPSchedule") > -1;
                    hsettings.intakeForm = data.indexOf("IntakeForm") > -1;
                    hsettings.intakeForm_OnDemand = data.indexOf("IntakeForm_OnDemand") > -1;
                    hsettings.intakeForm_Scheduled = data.indexOf("IntakeForm_Scheduled") > -1;
                    hsettings.providerSearch = data.indexOf("ClinicianSearch") > -1;
                    hsettings.rxNTEHR = data.indexOf("RxNTEHR") > -1;
                    hsettings.rxNTPM = data.indexOf("RxNTPM") > -1;
                    hsettings.hidePaymentPageBeforeWaitingRoom = data.indexOf("HidePaymentPageBeforeWaitingRoom") > -1;
                    hsettings.fileSharing = data.indexOf("FileSharing") > -1;
                    hsettings.insuranceBeforeWaiting = data.indexOf("InsuranceBeforeWaiting") > -1;
                    hsettings.ePerscriptions = data.indexOf("EPerscriptions") > -1;
                    hsettings.ePSchedule1 = data.indexOf("EPSchedule1") > -1;

                    hsettings.iCD9Codes = data.indexOf("ICD9Codes") > -1;
                    hsettings.textMessaging = data.indexOf("TextMessaging") > -1;
                    hsettings.insVerificationDummy = data.indexOf("InsVerificationDummy") > -1;
                    hsettings.videoBeta = data.indexOf("VideoBeta") > -1;
                    hsettings.hidePaymentBeforeWaiting = data.indexOf("HidePaymentBeforeWaiting") > -1;
                    hsettings.showCTTOnScheduled = data.indexOf("ShowCTTOnScheduled") > -1;

                    hsettings.pPIsBloodTypeRequired = data.indexOf("PPIsBloodTypeRequired") > -1;
                    hsettings.pPIsHairColorRequired = data.indexOf("PPIsHairColorRequired") > -1;
                    hsettings.pPIsEthnicityRequired = data.indexOf("PPIsEthnicityRequired") > -1;
                    hsettings.pPIsEyeColorRequired = data.indexOf("PPIsEyeColorRequired") > -1;
                    hsettings.organizationLocation = data.indexOf("OrganizationLocation") > -1;

                    hsettings.AddressValidation = data.indexOf("AddressValidation") > -1;

                    hsettings.hideOpenConsultation = data.indexOf("HideOpenConsultation") > -1;
                    hsettings.hideDrToDrChat = data.indexOf("HideDrToDrChat") > -1;
                    hsettings.showPatientQueue = data.indexOf("ShowPatientQueue") > -1;
                    hsettings.drToDrChatInAdmin = false; //data.indexOf("DrToDrChatInAdmin") > -1;
                    //alert(data.indexOf("HideDrToDrChat"));
                    //Addd Public facing Hospital Setting
                    if (response.data[0]['settings']) {
                        $.extend(hsettings, response.data[0]['settings']);
                    }


                    snap.setSnapJsSession("snap_hospital_settings", hsettings);

                    snap.hospitalSettings = hsettings;

                    $def.resolve();
                }
            },
            error: function (response) {
                $def.reject("Failed to Load Client Profile");
                snapError("Failed to Load Client Profile");
            }
        });

        return $def.promise();
    },
    getSnapHospitalSession: function () {
        //Use JSON to retrieve the stored data and convert it 
        var storedData = sessionStorage.getItem("snap_hospital_session");
        if (storedData) {
            snap.hospitalSession = JSON.parse(storedData);
        }
    },
    getSnapHospitalSettings: function () {
        //Use JSON to retrieve the stored data and convert it 
        var storedData = sessionStorage.getItem("snap_hospital_settings");
        if (storedData) {
            snap.hospitalSettings = JSON.parse(storedData);
        }

    },
    updateSnapJsSession: function (sessionName, sessionDataKey, sessionDataValue) {
        var sessionData = JSON.parse(sessionStorage.getItem(sessionName));
        sessionData[sessionDataKey] = sessionDataValue;
        sessionStorage.setItem(sessionName, JSON.stringify(sessionData));
    },
    setSnapJsSession: function (sessionName, snapSessionData) {
        sessionStorage.setItem(sessionName, JSON.stringify(snapSessionData));
    },
    getSnapUserSession: function () {
        //Use JSON to retrieve the stored data and convert it 
        var storedData = sessionStorage.getItem("snap_user_session");
        
        if (storedData) {
            snap.userSession = JSON.parse(storedData);
        }
        else {
            snap.userSession = {};
        }
    },
    updateSnapUserSessionValue: function (key, value) {
        if (!snap.userSession) {
            this.getSnapUserSession();
        }
        var csettings = snap.userSession;
        csettings[key] = value;
        snap.userSession = csettings;
        snap.setSnapJsSession("snap_user_session", csettings);
        this.getSnapUserSession();
    },
    updateSnapConsultationSessionValue: function (key, value) {
        if (!snap.consultationSession) {
            this.getSnapConsultationSession();
        }
        var csettings = snap.consultationSession;
        csettings[key] = value;
        snap.consultationSession = csettings;
        snap.setSnapJsSession("snap_consultation_session", csettings);
        this.getSnapConsultationSession();
    },

    updateSnapConsultationSessionMultipleValues: function (valuesObject) {
        if (!snap.consultationSession) {
            this.getSnapConsultationSession();
        }
        var csettings = snap.consultationSession;
        for (var key in valuesObject) {
            csettings[key] = valuesObject[key];
        }
        snap.consultationSession = csettings;
        snap.setSnapJsSession("snap_consultation_session", csettings);
        this.getSnapConsultationSession();
    },
    setSnapConsultationSessionData: function (consultationData) {
        snap.setSnapJsSession("snap_consultation_session", consultationData);
        snap.consultationSession = consultationData;
    },
    getSnapConsultationSession: function () {
        var storedData = sessionStorage.getItem("snap_consultation_session");
        if (storedData) {
            snap.consultationSession = JSON.parse(storedData);
        }
        else {
            snap.setSnapConsultationSessionData({ consultationId: 0, isScheduled: false, patientId: 0, currentStep: 0, totalSteps: 0 });
        }
    },
    sessionStorageExists: function (dataName) {
        if (sessionStorage.getItem(dataName) == null)
            return false;
        return true;
    },
    clearSnapConsultationSession: function () {
        snap.consultationSession = null;
        sessionStorage.removeItem("snap_consultation_session");
    },

    getSnapChatRecentSession: function () {
        var storedData = sessionStorage.getItem("snap_chatrecent_session");
        if (storedData) {
            snap.chatRecentSession = JSON.parse(storedData);
        } else {
            snap.chatRecentSession = [];
        }
    },
    setSnapChatRecentSession: function (data) {
        data = data || [];
        snap.setSnapJsSession("snap_chatrecent_session", data);
        snap.chatRecentSession = callData;
    },
    addToSnapChatRecentSession: function (userId) {
        snap.chatRecentSession = snap.chatRecentSession || [];
        var oldIndex = snap.chatRecentSession.indexOf(userId);
        if (oldIndex >= 0) {
            snap.chatRecentSession.splice(oldIndex, 1);
        }
        snap.chatRecentSession.push(userId);
        snap.setSnapJsSession("snap_chatrecent_session", snap.chatRecentSession);
    },

    clearAllSnapSessions: function () {
        var i = sessionStorage.length;
        while (i--) {
            var key = sessionStorage.key(i);
            if (/snap/.test(key)) {
                sessionStorage.removeItem(key);
            }
        }
    },
    getStaffProfileSession: function () {
        var storedData = sessionStorage.getItem("snap_staffprofile_session");
        if (storedData) {
            snap.profileSession = JSON.parse(storedData);
        }
    },
    getPatientProfileSession: function () {
        var storedData = sessionStorage.getItem("snap_patientprofile_session");
        if (storedData) {
            snap.profileSession = JSON.parse(storedData);
        }
    },
    isProviderChatEnabled: function() {
        return !snap.hospitalSettings.hideDrToDrChat && snap.hasAllPermission(snap.security.provider_chat);
    },

    isAdminPatientQueueEnabled: function () {
       return snap.hasAllPermission(snap.security.view_admin_patient_queue);
    },

    isPatientQueueEnabled: function() {
        return snap.hospitalSettings.showPatientQueue;
    },

    setNumericText: function (control, format, text, max) {
        control.data("kendoNumericTextBox").max(max);
        if (control.data("kendoNumericTextBox").value() > max)
            control.data("kendoNumericTextBox").value(max);
        else
            control.data("kendoNumericTextBox").value(control.data("kendoNumericTextBox").value());
    },
    cachedScript: function (url) {
        return $.ajax({
            dataType: "script",
            cache: true,
            url: url
        });
    },
    setPageTitle: function () {
        var pageName = window.location.href.split('/');
        console.info('pageName[pageName.length - 1]: ' + pageName[pageName.length - 1] + '  --  $.trim($(document).attr("title")).length: ' + $.trim($(this).attr("title")).length);
        if ($.trim($(document).attr("title")).length == 0)//already not assigned title
            $(document).attr("title", pageName[pageName.length - 1]);
    },

    setSecruityValues: function () {

        /* bit mask */
        var sec = {};

        sec.e_prescription_creation = 1;
        sec.e_prescription_authorization = 2;
        sec.e_prescription_submission = 3;
        sec.conduct_virtual_consultations = 4;
        sec.view_patient_demographics = 5;
        sec.view_patient_personal_health_information = 6;
        sec.schedule_consultations = 7;
        sec.view_past_consultations = 8;
        sec.edit_past_consultations = 9;
        sec.provider_chat = 10;
        sec.view_staff_accounts = 11;
        sec.edit_staff_accounts = 12;
        sec.edit_public_facing_profile_details_self = 13;
        sec.edit_public_facing_profile_details_others = 14;
        sec.create_staff_accounts = 15;
        sec.create_new_admin_user = 16;
        sec.create_reports = 17;
        sec.view_reports = 18;
        sec.assign_roles = 19;
        sec.create_roles = 20;
        sec.delete_roles = 21;
        sec.disable_roles = 22;
        sec.view_edit_admin_preferences = 23;

        sec.can_access_my_files = 28;
        sec.can_view_patient_files = 29;
        sec.can_copy_upload_to_patient_files = 30;
        sec.can_manage_hospital_files = 31;

        sec.view_tags = 32;
        sec.create_tags = 33;
        sec.delete_tags = 34;
        sec.assign_tags = 35;
        sec.view_roles = 36;
        sec.view_patients_accounts = 37;
        sec.edit_patients_accounts = 38;

        sec.view_admin_dashboard = 39;

        sec.can_manage_staff_files = 40;

        sec.create_groups = 41;
        sec.remove_groups = 42;
        sec.modify_groups = 43;
        sec.manage_staff_schedule = 44;
        sec.view_workflows = 45;
        sec.edit_workflows = 46;

        sec.open_consultation = 48;
        sec.view_admin_patient_queue = 49;
        snap.security = sec;
    },
    hasAllPermission: function () {
        var roules = arguments[0];
        if (!Array.isArray(roules))
            roules = arguments;
        for (var i = 0; i < roules.length; i++) {
            var r = roules[i];
            if (r < 32) {
                if ((this.userSession.security1to31 & 1 << (r - 1)) === 0)
                    return false;
            } else {
                if ((this.userSession.security32to63 & 1 << (r - 32)) === 0)
                    return false;

            }
        }
        return true;
    },
    hasAnyPermission: function () {
        var roules = arguments[0];
        if (!Array.isArray(roules))
            roules = arguments;
        for (var i = 0; i < roules.length; i++) {
            var r = roules[i];
            if (r < 32) {
                if ((this.userSession.security1to31 & 1 << (r - 1)) > 0)
                    return true;
            } else {
                if ((this.userSession.security32to63 & 1 << (r - 32)) > 0)
                    return true;

            }
        }
        return false;
    },
    canLoginClinician: function () {
        if (snap.hasAllPermission(snap.security.conduct_virtual_consultations))
            return true;
        return false;
    },
    canLoginAdmin: function () {
        if (((snap.userSession.security32to63 & 2147483647) > 0) || ((snap.userSession.security1to31 & 134216704) > 0))
            return true;
        return false;
    },
    canScheduleConsultation: function() {
        return snap.hasAllPermission(snap.security.schedule_consultations);
    },
    canRecordConsultation: function() {
        return snap.hasAllPermission(snap.security.conduct_virtual_consultations);
    },
    openMobileApp: function (consulationId, cb, isLogin) {
        cb = cb || function () {
        };
        if (kendo.support.mobileOS['ios'] || isLogin) {
            setTimeout(function () {
                snap.openMobileAppInternal(consulationId);
            }, 200);
            return;
        }

        if (kendo.support.mobileOS['android']) {
            snapConfirm("Use the VirtualCare App for the best consultation experience.");
            $("#btnConfirmYes").html("Go");
            $("#btnConfirmNo").html("Not Now");
            $("#btnConfirmYes").click(function () {
                $(".k-notification-confirmation").parent().remove();
                setTimeout(function () {
                    snap.openMobileAppInternal(consulationId);
                }, 200);
            });

            $("#btnConfirmNo").click(function () {
                $(".k-notification-confirmation").parent().remove();
                cb();
            });
        }

    },
    getMobileAppSchema: function () {
        if (!snap['hospitalSettings']) {
            snap.getSnapHospitalSettings();
        }
        var schemaKey;
        if (kendo.support.mobileOS['android']) {
            schemaKey = "androidSchemaUrl";
        } else {
            schemaKey = "iOSSchemaUrl";
        }
        var schamaName =snap.hospitalSettings[schemaKey];
        if(schamaName){
          return schamaName;
        }
        return "snapmdconnectedcare";
    },
    getMobileAppStoreUrl: function () {
        if (!snap['hospitalSettings']) {
            snap.getSnapHospitalSettings();
        }
        var schemaKey;
        if (kendo.support.mobileOS['android']) {
            schemaKey = "androidPlayStoreUrl";
        } else {
            schemaKey = "iOSAppStoreUrl";
        }
        var appStoreUrl=snap.hospitalSettings[schemaKey];
        if(appStoreUrl){
           return appStoreUrl;
        }
        return schemaKey == "iOSAppStoreUrl" ? snap.iosAppLink : snap.andriodAppLink;
    },
    formatPhoneNumber: function (phoneNumber) {
    phoneNumber = $.trim(phoneNumber);
var pattern;
var result; 
var isPlus = false;
var subSet;

if (phoneNumber.indexOf("+") > -1) {
    isPlus = true;
}

result = getNumbersFromString(phoneNumber);

if (result.length > 9) {

    if (result.length === 10) {
        pattern = /\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
        subSet = '($1) $2-$3';
    }
    else if (result.length === 11) {
        pattern = /\(?(\d{1})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
        subSet = '$1($2) $3-$4';
    }

    else {
        pattern = /\(?(\d{2})\)?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;

        subSet = '$1($2) $3-$4';
    }

    result = result.replace(pattern, subSet);

    if (isPlus)
        result = "+" + result;

    return result;
}
else
    return phoneNumber;
},
    openMobileAppInternal: function (consultationId) {

        consultationId = consultationId || "";
        var env = "production";
        var host = location.host;
        if (host.indexOf("-qa.com") >= 0) {
            env = "qa";
        }
        else if (host.indexOf("-stage.com") >= 0) {
            env = "stage";
        } else if (host.indexOf("sandbox") >= 0) {
            env = "sandbox";
        }

        snap.getSnapUserSession();
        snap.getSnapHospitalSession();
        var token = "";
        var hospitalId;
        if (snap.userSession) {
            token = snap.userSession.token;
        }
        if (snap.hospitalSession) {
            hospitalId = snap.hospitalSession.hospitalId;
        } else {
            hospitalId = snap.hospitalId;
        }
        var schemaUlr = snap.getMobileAppSchema();
        var url =schemaUlr +"://?token=" + token + "&hospitalId=" + hospitalId + "&env=" + env + "&consultationId=" + consultationId;
        if (kendo.support.mobileOS['ios']) {
            if (kendo.support.mobileOS['majorVersion'] >= 9) {
                window.location = url;
            } else {

                $('<iframe />').attr("id", "hiddenIFrame").attr('href', url).attr('style', 'display:none;').appendTo('body');
                setTimeout(function () {
                    setTimeout(function () {
                        $("#hiddenIFrame").remove();
                    }, 100);
                }, 200);
            }
        } else {

            window.location = url;

        }
        var intervalTime = null;
        setTimeout(function () {
            intervalTime = setInterval(function () {
                $(".k-notification-confirmation").parent().remove();
            }, 7000);
            var promptUser = function () {
                snapConfirm("You will need our mobile app to conduct a consultation on the platform.");
                $("#btnConfirmYes").html("Get the app");
                $("#btnConfirmNo").html("Ignore");
                $("#btnConfirmYes").click(function () {
                    $(".k-notification-confirmation").parent().remove();
                    clearInterval(intervalTime);
                    if ((kendo.support.mobileOS['android']) || (kendo.support.mobileOS['ios'])) {
                        window.location.href = snap.getMobileAppStoreUrl();
                    }
                    else {
                        snapInfo("Comming Soon.");
                   }
                });
                $("#btnConfirmNo").click(function () {
                    clearInterval(intervalTime);
                    $(".k-notification-confirmation").parent().remove();
                    snapConfirm("This action will cancel your consultation request. Are you sure you want to cancel?");
                    $("#btnConfirmYes").click(function () {
                        $(".k-notification-confirmation").parent().remove();
                    });
                    $("#btnConfirmNo").click(function () {
                        $(".k-notification-confirmation").parent().remove();
                        promptUser();
                    });

                });
            };
            promptUser();
            //wait for 7 sec if app not oppened then open mobile app linek.
        }, 7000);

    },
    redirectToMobileApp: false,
    iosAppLink: 'https://itunes.apple.com/us/app/virtual-care/id1035220141?ls=1&mt=8',
    andriodAppLink: 'https://play.google.com/store/apps/details?id=com.snap.connectedcare.production',
    consultationStatus: {
        unknown: 0,
        paymentDone: 68,
        doctorAssigned: 69,
        doctorInitiatedConsultation: 70,
        startedConsultation: 71,
        endedConsultation: 72,
        cancelConsultaion: 79,
        inProgress: 80,
        droppedConsultation: 81,
        customerInWaiting: 82,
        doctorReviewConsultation: 154,
        dismissed: 163,
        patientEndConsultation: 73,
        disconnectedConsultation: 83
    },
    isUserLoggedIn: function () {
        return sessionStorage.getItem("snap_user_session") ? true : false;
    }
});
snap.setSecruityValues();
$(function () {
    snap.loadGlobule();
    snap.localize();
    snap.setPageTitle();
});

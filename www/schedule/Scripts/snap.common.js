/* Helper function to get Script and evel */
var snap = snap || {};

snap.getScript = snap.getScript || function (url, options) {

    options = options || {};
    var cache = true;
    if (options.cache) {
        cache = options.cache;
    }

    if ((cache) && (url.indexOf("svp=snapversion") < 0)) {
        if (url.indexOf("?") >= 0) {
            url = url + "&svp=snapversion";
        } else {
            url = url + "?svp=snapversion";
        }
    }

    options = $.extend(options || {}, {
        dataType: "script",
        cache: cache,
        url: url
    });
    return jQuery.ajax(options);
};

$.ajaxSetup({ async: false });
snap.getScript("/Scripts/min/snap.core.min.js");
snap.getScript("/Scripts/jquery.signalR-2.2.0.min.js");

//we alwys need to get the server hub script
snap.getScript("/api/signalr/hubs", {
    cache: false
});
$.ajaxSetup({ async: true });


var onSnapNotification = function (e) {
    e.element.parent().css({
        zIndex: 20004
    });

};
snap.regExMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

window.addEventListener("beforeunload", function (event) {
    snap.isUnloading = true;
    return null;
});


$(document).ajaxSend(function (e, jqxhr, settings) {

    var isApi = false;
    if (/^\//.test(settings.url))
        isApi = true;
    if (/^http[s]?:\/\/[^\/]+\/api/.test(settings.url))
        isApi = true;
    if (snap && isApi && snap.userSession) {
        if ((snap.userSession.token) && (!(settings.headers && settings.headers.Authorization))) {

            if (snap.userSession.isGuest) {
                jqxhr.setRequestHeader("Authorization", "JWT-Participant " + snap.userSession.token);    
            } else {
                jqxhr.setRequestHeader("Authorization", "Bearer " + snap.userSession.token);    
            }
            
        }

        //legacy api keys path check
        if (!snap.userSession.apiDeveloperId && snap.apiDeveloperId)        {
            snap.userSession.apiDeveloperId = snap.apiDeveloperId;
        }
        if (!snap.userSession.apiKey && snap.apiKey) {
            snap.userSession.apiKey = snap.apiKey;
        }


        if (snap.userSession.apiDeveloperId)
            jqxhr.setRequestHeader("X-Developer-Id", snap.userSession.apiDeveloperId);
        if (snap.userSession.apiKey)
            jqxhr.setRequestHeader("X-Api-Key", snap.userSession.apiKey);
        if (snap.userSession.timeZoneSystemId)
            jqxhr.setRequestHeader("Time-Zone", snap.userSession.timeZoneSystemId);
    }
    else if (snap && isApi && snap.apiDeveloperId && snap.apiKey) {
        jqxhr.setRequestHeader("X-Developer-Id", snap.apiDeveloperId);
        jqxhr.setRequestHeader("X-Api-Key", snap.apiKey);
    }
});

snap.submitForm = function (config, data) {
    var form = $('<form>', {
        'action': config.url,
        'method': config.method
    });
    $.each(data, function (name, value) {
        form.append($('<input>', {
            'name': name,
            'value': value,
            'type': 'hidden'
        }));
    });
    form.appendTo('body').submit();

};

function initializeAddressInputs() {
    $("span.addressHintText").text("Street, Apt/Unit #, City, State/Province, Zip/Postal Code");    /*hint text*/
    $(".addressPlaceholder").attr("placeholder", "Full Address");                                   /*Placeholder*/
}

function isEmpty(obj) {
    if (typeof obj == 'undefined' || obj === null || obj === '')
        return true;
    if (typeof obj == 'number' && isNaN(obj))
        return true;
    if (obj instanceof Date && isNaN(Number(obj)))
        return true;
    return false;
}
function removePhoneFormat(phoneNumber) {
    phoneNumber = $.trim(phoneNumber);
    if (phoneNumber !== null) {
        var isPlus = false;
        if (phoneNumber.indexOf("+") > -1)
            isPlus = true;
        var result = phoneNumber.trim().replace(/[^0-9]+/gi, '');
        if (isPlus)
            result = "+" + result;
        return result;
    }
    else
        return '';
}
function getNumbersFromString(string) {
    if (string !== null) {
        string = $.trim(string);
        return string.replace(/[^0-9]+/gi, '');
    }
    else
        return string;
}
function formatJSONDate1(jsonDate) {

    var mon, day, monthname;
    var newDate;
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (jsonDate != null) {
        var value = jsonDate;
        if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
            if (typeof value === "string")
                newDate = new Date(parseInt(value.substring(6, value.length - 2)));
            else
                newDate = new Date(value);
            mon = newDate.getUTCMonth();
            monthname = month[mon];
            if (newDate.getUTCDate() < 10)
                day = '0' + newDate.getUTCDate();
            else
                day = newDate.getUTCDate();
            return (monthname + " " + day + ", " + newDate.getUTCFullYear());
        }
        else {
            var newYear = value.substring(0, 4);
            mon = value.substring(5, 7);
            monthname = month[parseInt(mon - 1)];
            day = value.substring(8, 10);

            return (monthname + " " + day + ", " + newYear);
        }

    }
    else
        return '';
}

function formatJSONDateShort(jsonDate) {

    var mon, day;
    var newDate;
    if (jsonDate != null) {
        var value = jsonDate;
        if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
            if (typeof value === "string")
                newDate = new Date(parseInt(value.substring(6, value.length - 2)));
            else
                newDate = new Date(value);
            mon = newDate.getUTCMonth() + 1;

            if (newDate.getUTCDate() < 10)
                day = '0' + newDate.getUTCDate();
            else
                day = newDate.getUTCDate();
            return (mon + "/" + day + "/" + newDate.getUTCFullYear());
        }
        else {
            var newYear = value.substring(0, 4);
            mon = value.substring(5, 7);
            day = value.substring(8, 10);

            return (mon + "/" + day + "/" + newYear);
        }

    }
    else
        return '';
}
function SnapDateTime1(jsonDate) {
    return formatJSONDate1(jsonDate) + ' ' + GetFormattedTimeFromTimeStamp(jsonDate);
}
function SnapDateTimeShort(jsonDate) {
    return formatJSONDateShort(jsonDate) + ' ' + GetFormattedTimeFromTimeStamp(jsonDate);
}
function GetFormattedTimeFromTimeStamp(jsonDate) {
    var value = jsonDate;
    var hours;
    var mins;
    if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
        var time;
        if (typeof value === "string")
            time = new Date(parseInt(value.substring(6, value.length - 2)));
        else
            time = new Date(value);

        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
    }
    else {
        hours = parseInt(value.substring(11, 13));
        mins = parseInt(value.substring(14, 16));
    }
    var ampm = 'AM';
    if (hours >= 12) {
        ampm = 'PM';
    }
    if (hours > 12) {
        hours -= 12;
    }
    if (hours === 0)
        hours = 12;
    if (mins < 10) {
        mins = '0' + mins;
    }
    return hours + ':' + mins + ' ' + ampm;
}
function GetSnap24HourTime(jsonDate) {
    var value = jsonDate;
    var hours;
    var mins;
    if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
        var time;
        if (typeof value === "string")
            time = new Date(parseInt(value.substring(6, value.length - 2)));
        else
            time = new Date(value);
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
    }
    else {
        hours = parseInt(value.substring(11, 13));
        mins = parseInt(value.substring(14, 16));
    }

    if (mins < 10) {

        mins = "0" + mins;
    }
    return hours + ":" + mins;

}

function logError(MessageOrigin, MessageType, Message, Recommendation) {
    var payload = {
        MessageOrigin: "snap.common.js: "+MessageOrigin,
        MessageType: MessageType,
        Message: Message ? Message.toString().replace(/'/g, "\\'") : null,
        Recommendation: Recommendation ? Recommendation.toString().replace(/'/g, "\\'") : null
    };

    // Todo: Add userId and IP address to payload.
    $.ajax({
        type: "POST",
        url: '/api/v2.1/log-messages',
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (response) {
        sessionStorage.setItem('lastErrorId', response.data[0].id);
        location.href = "/public/#/error/";
    }).fail(function() {
        location.href = "/public/#/error/";
    });


}



var snapSuccess = function (message) {
    snap.SnapNotification().success(message);
};

var snapSuccessHtml = function (message) {
    snap.SnapNotification().successHtml(message);
};

var snapError = function (message) {
    snap.SnapNotification().error(message);
};

var snapInfo = function (message) {
    snap.SnapNotification().info(message);
};
var snapAnnouncement = function (message) {
    snap.SnapNotification().announcement(message);
};

var snapSetInterval = function (fn, time) {
    var _isStop = false;
    (function () {
        if (!_isStop) {
            fn();
            setTimeout(arguments.callee, time);
        }
    }());

    return function () {
        _isStop = true;
    };
};








var snapRemoveErrorNotification = function () {
    $(".snapError").parent().parent().remove();
};

var showSnapConfirmation = (function () {

    var confirmationGlobal = $("<span>").kendoNotification({
        pinned: true,
        position: {
            top: 30,
            right: 30
        },
        stacking: "down",
        autoHideAfter: 0,
        hideOnClick: true,
        button: true,
        templates: [
        {
            type: "confirmation",
            template: "<div class='snapInfo'><span class='icon_new'></span><h3>Confirmation:</h3><p>  #= content #  </p></div>" +
                "<div><span id='btnConfirmNo'  class='confirm-btnNo' style='float:right'>No</span>" +
                "<span id='btnConfirmYes'  class='confirm-btnYes' style='float:left'>Yes</span></div>"
        }

        ],
        show: onSnapNotification
    }).data("kendoNotification");

    return function (msg, type) {
        confirmationGlobal.show(msg, type);
    };
})();
var snapConfirm = function (message) {
    showSnapConfirmation(message, "confirmation");
};
var showSnapAlert = (function () {

    var confirmationGlobal = $("<span>").kendoNotification({
        pinned: true,
        position: {
            top: 30,
            right: 30
        },
        stacking: "down",
        autoHideAfter: 0,
        hideOnClick: false,
        modal: true,
        button: true,
        show: onSnapNotification,
        templates: [
        {
            type: "confirmation",
            template: "<div class='snapInfo'><span class='icon_new'></span><h3>Confirmation:</h3><p> #: content # </p></div>" +
                "<span id='btnAlertOk'  class='confirm-btnYes center'>Ok</span>"
        }]
    }).data("kendoNotification");

    return function (msg, type) {
        confirmationGlobal.show(msg, type);
    };
})();

$(document).ready(function () {
    $(".phoneNumberFormat").each(function () {
        var phoneNumber = $(this).data("phone-format");
        var phoneText = $(this).html();
        var formatedPhoneNumber = formatPhoneNumber(phoneNumber);
        $(this).html(phoneText.replace(phoneNumber, "") + formatedPhoneNumber);
    });
    initializeAddressInputs();
   
   
});




function sortResults(data, prop, asc) {
    if (data && data != 'undefined') {
        data = data.sort(function (a, b) {
            if (asc)
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
    }
    return data;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function textValidate(e) {
    if (e.shiftKey || e.ctrlKey || e.altKey) {
        e.preventDefault();
    } else {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
            e.preventDefault();
        }
    }
}

function initializeToolTip(className) {
    $("." + className).kendoTooltip({
        width: 250,
        position: "top"
    }).data("kendoTooltip");
}

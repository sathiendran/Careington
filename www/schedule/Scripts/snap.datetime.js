// ReSharper disable CoercedEqualsUsing
// Todo: Provide a comment indicating what this file is for.
(function (global, $) {

    var snap = global.snap = global.snap || {};
    snap.calenderObj = [];
    snap.calenderSelector = [];

    $.extend(snap, {
        datetimeShortFormatString: "mm/dd/yyyy",
        datetimeFormatString1: "MMM dd, yyyy",
        datetimeFormatString2: "MM/dd/yyyy",
        dateConversion: {
            //for adminSchedule.viewmodel
            formatConsultationDuration: function (consultationDuration) {
                if ($.trim(consultationDuration) !== "") {
                    var seconds = Math.floor(consultationDuration % 60);
                    var minutes = Math.floor(consultationDuration / 60);
                    var hours = 0;
                    if (minutes >= 60) {
                        hours = Math.floor(minutes / 60);
                        minutes = Math.floor(minutes % 60);
                    }

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;
                    hours = hours < 10 ? "0" + hours : hours;

                    return [(hours === "00" ? "" : (hours + ":")), minutes, ":", seconds].join("");
                }

                return "00:00";
            },
            parseIsoDatetime: function (dtstr) {
                var dt = dtstr.split(/[: T-]/).map(parseFloat);
                return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
            },
            ConveMonthToString: function (month) {
                if (month == "") {
                    return "";
                }
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return monthNames[month - 1];
            },

            /********************************
             * This function ignore time zone.
             * Example:
             *     Thu Nov 12 2015 00:00:00 GMT+0600   => Nov 12, 2015
             *     Thu Nov 12 2015 00:00:00 GMT-0800   => Nov 12, 2015
            *********************************/
            //\Scripts\pagevm\admin\scheduler.viewmodel.js(181)
            ConvertDateToString: function (date) {
                var yyyy = date.getFullYear().toString();
                var dd = date.getDate().toString();
                return (snap.dateConversion.ConveMonthToString(date.getMonth() + 1) + " " + (dd[1] ? dd : "0" + dd[0]) + ", " + yyyy);
            },

            ConvertDayMonthToString: function (date) {
                var dd = date.getDate().toString();
                var mm = date.getMonth() + 1;
                return mm + "/" + dd;
            },
            ConvertMonthYearToString: function (date) {
                var yyyy = date.getFullYear().toString();
                return (snap.dateConversion.ConveMonthToString(date.getMonth() + 1) + ", " + yyyy);
            }

        },
        datepickers: {
            initializeDatePickerPlaceholders: function () {
                $(".datepicker,.datepickerDOB,.datepickerConsultation").attr("placeholder", snap.datetimeShortFormatString);
                $(".datepickerPlaceholder").attr("placeholder", snap.datetimeShortFormatString);
                $("#txtDOB").attr("placeholder", snap.datetimeShortFormatString);
            },
            initializeDatePicker: function (selector, maxDate, minDate, format) {
                var localCalObj;
                function onChange() {
                    // Empty is intentional
                }
                if (maxDate) {
                    localCalObj= $(selector).kendoDatePicker({
                        format: format || snap.datetimeFormatString2,
                        parseFormats: [snap.datetimeFormatString1, snap.datetimeFormatString2, "M/d/yyyy", "dd.MM.yyyy", "dd.MM.yy", "dd.MM", "MM/dd/yyyy", "MM/dd", "MM/dd/yy"],
                        min: minDate || snap.dateLimits.getStartDate(),
                        max: maxDate,
                        change: onChange,
                    }).data("kendoDatePicker");
                } else {
                    localCalObj= $(selector).kendoDatePicker({
                        format: format || snap.datetimeFormatString2,
                        parseFormats: [snap.datetimeFormatString1, snap.datetimeFormatString2, "M/d/yyyy", "dd.MM.yyyy", "dd.MM.yy", "dd.MM", "MM/dd/yyyy", "MM/dd", "MM/dd/yy"],
                        min: minDate || snap.dateLimits.getStartDate(),
                        change: onChange,
                    }).data("kendoDatePicker");
                }

                if (localCalObj && snap.calenderSelector.indexOf(selector) == -1) {
                    snap.calenderObj.push(localCalObj);
                    snap.calenderSelector.push(selector);
                }
            },

            initializeDatePickerCalture: function () {
                snap.calenderObj.forEach(function (obj) {
                    obj.setOptions({});
                })
            }

        },

        dateValidation: {
            isDST: function (t) {
                var jan = new Date(t.getFullYear(), 0, 1);
                var jul = new Date(t.getFullYear(), 6, 1);
                return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == t.getTimezoneOffset();
            },
            validateDOB: function (inDate) {
                var errMsg = "";

                if (inDate == null || inDate == "" || typeof (inDate) == "undefined") {
                    return "Please select Date of Birth";
                }
                var date = new Date(inDate);

                var date_regex_old = /^(0[1-9]|1[012])[\/](0[1-9]|[12][0-9]|3[01])[\/](19|20)\d\d$/;
                var date_regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ ](0[1-9]|[12][0-9]|3[01])[,][ ](19|20)\d\d$/;


                if (date > snap.dateLimits.getTodayMaxDate()) {
                    errMsg = errMsg + "Date of birth cannot be in the future";
                }
                if ((typeof (inDate) === "string") && (!date_regex.test(inDate)) && (!date_regex_old.test(inDate))) {
                    errMsg = errMsg + "Please enter a valid Date of Birth " + snap.datetimeShortFormatString;
                }

                return errMsg;

            },

        },
        dateLimits: {
            getTodayMaxDate: function () {
                var dt = new Date();
                dt.setHours(23, 59, 0, 0);
                return dt;
            },
            getTodayMinDate: function () {
                var dt = new Date();
                dt.setHours(0, 0, 0, 0);
                return dt;
            },

            getMinScheduledDate: function () {
                var minDate = new Date();
                minDate.setDate(minDate.getDate() - 1);
                return minDate;
            },
            getMinDOBforEmail: function () {
                var d = new Date();
                var currentYear = d.getFullYear();
                var startingYear = (currentYear) - 13;
                var startDate = new Date(startingYear, d.getMonth(), d.getDate());
                return startDate;
            },

            getHealthPlanMaxDate: function () {
                var d = new Date();
                var currentYear = d.getFullYear();
                var startingYear = (currentYear) - 13;
                var startDate = new Date(startingYear, d.getMonth(), d.getDate());
                return startDate;
            },

            getStartDate: function () {
                var d = new Date();
                var currentYear = d.getFullYear();
                var startingYear = (currentYear) - 130;
                var startDate = new Date(startingYear, d.getMonth(), d.getDate());
                return startDate;
            }


        }

    });

    $(document).ready(function () {

        $('.datepicker, .timepicker, .enddateformat, .startdateformat').focus(function () {
            var that = this;
            setTimeout(function () {
                $(that).select();
            });
        });
        $('.timepicker').kendoTimePicker({
            format: "h:mm tt",
            parseFormats: ["HH:mm"]
        });
        snap.datepickers.initializeDatePicker('.datepicker', null);

        // Datepicker for Birthdate
        snap.datepickers.initializeDatePicker('.datepickerDOB', snap.dateLimits.getStartDate());


        // past date disable
        snap.datepickers.initializeDatePicker("#txtDOB", snap.dateLimits.getTodayMaxDate(), null, snap.datetimeFormatString1);
        snap.datepickers.initializeDatePickerPlaceholders();
        // allow leading plus(+) sign and alpha-numeric[no special char]
        $('.phoneSnapInput').bind("keypress", function (event) {
            if (event.charCode == 43 && $(this).val().indexOf('+') == -1) {
                // (+) sign as a first char
            }
            else if (event.charCode != 0) {
                var regex = new RegExp("^[0-9]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }
            }
        });

    });
})(window, $);


// Format ISO local time yyyt-mm-ddThh:mm
Date.prototype.toLocalISO = function () {
    var date = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes()));
    return date.toJSON().substring(0, 16)
}

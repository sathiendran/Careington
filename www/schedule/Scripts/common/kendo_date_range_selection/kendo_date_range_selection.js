var snap = snap || {};

snap.kendoDateRangeSelection = (function ($, window, document, undefined) {
    var
        start,
        end,
        startValidator,
        endValidator,
        callbacks = {};


    function extractDateWithoutTime(date) {
        var result = new Date(date);
        result.setHours(0, 0, 0, 0);

        return result;
    };

    var 
        mindate = extractDateWithoutTime(new Date(1753, 1, 1)), // Min SQL Server date.
        maxdate = extractDateWithoutTime(new Date(2050, 1, 1));

    var kendoValidator = {
        rules: {
            //custom date validation
            dateValidation: function(e) {
                var value = $(e).val();

                //If datepicker empty we skip validation.
                if (value.length === 0)
                    return true;

                var currentDate = Date.parse($(e).val());
                //Check if Date parse is successful
                if (!currentDate) {
                    return false;
                }
                return true;
            },
            maxRangeValidation: function (e) {
                var currentDate = Date.parse($(e).val());
                var datePicker = e.data("kendoDatePicker");
                if (currentDate > datePicker.max()) {
                    return false;
                }

                return true;
            },
            minRangeValidation: function(e) {
                var currentDate = Date.parse($(e).val());
                var datePicker = e.data("kendoDatePicker");
                if (currentDate < datePicker.min()) {
                    return false;
                }

                return true;
            }
        },
        messages: {
            //Define your custom validation massages
            required: "Date is required",
            dateValidation: "Invalid date",
            maxRangeValidation: "Invalid Date Range",
            minRangeValidation: "Invalid Date Range"
        }
    };

    function startChange() {
        var startDate = start.value(),
            endDate = end.value();

        if (startDate) {
            startDate = new Date(startDate);
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
            end.min(mindate);
        } else {
            start.max(maxdate);
            end.min(mindate);
        }

        startValidator.validate();

        if (callbacks.onDateRangeChange) {
            callbacks.onDateRangeChange();
        }
    }

    function endChange() {
        var endDate = end.value(),
        startDate = start.value();

        if (endDate) {
            endDate = new Date(endDate);
            start.max(endDate);
        } else if (startDate) {
            start.max(maxdate);
            end.min(new Date(startDate));
        } else {
            start.max(maxdate);
            end.min(mindate);
        }

        endValidator.validate();

        if (callbacks.onDateRangeChange) {
            callbacks.onDateRangeChange();
        }
    }

    $(document).ready(function () {
        var $start = $("#startDate");
        var $end = $("#endDate");        

        var nowDate = new Date();

        start = $start.kendoDatePicker({
            format: snap.datetimeFormatString1,
            parseFormats: ["dd.MM.yyyy", "dd.MM.yy", "dd.MM", "MM/dd/yyyy", "MM/dd", "MM/dd/yy"],
            max: new Date(maxdate),
            change: startChange
        }).data("kendoDatePicker");
      
        end = $end.kendoDatePicker({
            format: snap.datetimeFormatString1,
            parseFormats: ["dd.MM.yyyy", "dd.MM.yy", "dd.MM", "MM/dd/yyyy", "MM/dd", "MM/dd/yy"],
            max: new Date(maxdate),
            change: endChange
        }).data("kendoDatePicker");

        var startDate = new Date(nowDate);
        var endDate = new Date(nowDate);

        // to default the fields to empty, use html5 data-required="false"
        if ($start.data("required") == undefined || $start.data("required") == true) {
           // startDate.setMonth(endDate.getFullYear() - 1);

            startDate.setMonth(startDate.getMonth() - 2);
            start.value(startDate);
        }

        if ($end.data("required") == undefined || $end.data("required") == true) {
            end.value(endDate);
        }
        
        end.min(new Date(start.value()));

        startValidator = $start.kendoValidator(kendoValidator).data("kendoValidator");
        endValidator = $end.kendoValidator(kendoValidator).data("kendoValidator");
    });

    //This method create new Date from internal observable Date object.
    function wrapDate(date, defaultValue) {
        if (date === null) {
            return defaultValue;
        }

        return extractDateWithoutTime(date);
    }

    return {
        //Never ruturn Null
        startDate: function () {
            return wrapDate(start.value(), mindate);
        },

        //Never ruturn Null
        endDate: function () {
            return wrapDate(end.value(), maxdate);
        },

        selectedStartDate: function () {
            return wrapDate(start.value(), null);
        },

        selectedEndDate: function () {
            return wrapDate(end.value(), null);
        },

        onDateRangeChange: function (onDateRangeChangeCallback) {
            callbacks.onDateRangeChange = onDateRangeChangeCallback;
        }
    }

})(jQuery, window, document)
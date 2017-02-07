

(function (global, snap, kendo) {

    var
        app = global.app = global.app || {},
        util = snap.util,
        apiRequest = new snap.ApiRequest(),
        dateRangeSelection = snap.kendoDateRangeSelection;

    var consultationDetails = {
        patientName: {
            field: "patientName",
            title: "Patient"
        },
        gender: {
            field: "gender",
            title: "Gender"
        },
        age: {
            field: "age",
            title: "Age"
        },
        clinicianName: {
            field: "clinicianName",
            title: "Provider"
        },
        primary: {
            field: "primary",
            title: "Primary"
        },
        secondary: {
            field: "secondary",
            title: "Secondary"
        },
        date: {
            field: "date",
            title: "Date"
        },
        startTime: {
            field: "startTime",
            title: "Start Time"
        },
        length: {
            field: "length",
            title: "Length",
            format: "{0} min"
        },
        wiatTime: {
            field: "wiatTime",
            title: "Wait Time",
            format: "{0} min"
        },

        medicalCodes: {
            field: "medicalCodes",
            title: "Medical codes"
        },
        city: {
            field: "city",
            title: "City"
        },
        state: {
            field: "state",
            title: "State"
        },
        latitude: {
            field: "latitude",
            title: "Latitude"
        },
        longitude: {
            field: "longitude",
            title: "Longitude"
        }
    }

    var waitTimeGridColumns = [
        consultationDetails.patientName,
        consultationDetails.primary,
        consultationDetails.secondary,
        consultationDetails.date,
        consultationDetails.startTime,
        consultationDetails.length,
        consultationDetails.witeTime
    ];

    var consultationTimeGridColumns = [
        consultationDetails.patientName,
        consultationDetails.clinicianName,
        consultationDetails.primary,
        consultationDetails.secondary,
        consultationDetails.medicalCodes,
        consultationDetails.date,
        consultationDetails.startTime,
        consultationDetails.length
    ];

    var symptomsGridColumns = [
        consultationDetails.gender,
        consultationDetails.age,
        consultationDetails.primary,
        consultationDetails.secondary,
        consultationDetails.date,
        consultationDetails.startTime,
        consultationDetails.length
    ];

    var locationGridColumns = [
        consultationDetails.patientName,
        consultationDetails.city,
        consultationDetails.state,
        consultationDetails.longitude,
        consultationDetails.latitude
    ];

    var chartTypeEnum = {
        AverageWaitTime: "AverageWaitTime",
        PatientLocations: "PatientLocations",
        ConsultationTimes: "ConsultationTimes",
        SymptomTracker: "SymptomTracker"
    };

    var timePeriodEnum = {
        Days: "Days",
        Weeks: "Weeks",
        Months: "Months",
        Years: "Years"
    };

    var symptomsTrakesEnum = {
        All: "All",
        Primary: "Primary",
        Secondary: "Secondary"
    };

    var getChartName = function (chartType) {
        var name;
        switch (chartType) {
            case chartTypeEnum.AverageWaitTime:
                name = "Average Wait Time";
                break;
            case chartTypeEnum.PatientLocations:
                name = "Patient Locations";
                break;
            case chartTypeEnum.ConsultationTimes:
                name = "Consultation Times";
                break;
            case chartTypeEnum.SymptomTracker:
                name = "Symptom Tracker";
                break;
            default:
                name = "Unknown";
                snapError("Unknown chart type:" + chartType);
                break;
        }

        return name;
    }

    var buildChartSettings = function (data, measureType, startDate, endDate) {
        var settings = { categories: [], series: [], labelsQty: 20, datalength: data.length };

        var hashArray = data.map(function(item) {
            return new Date(item.category).setHours(0, 0, 0, 0);
        });

        var populateChartData = function (date, label) {
            settings.categories.push(label);
            var index = hashArray.indexOf(date.setHours(0, 0, 0, 0));

            if (index >= 0) {
                //Found match. Asociate series with value.
                settings.series.push(data[index].value);
            } else {
                settings.series.push(null);
            }
        }

        switch (measureType) {
            case timePeriodEnum.Days:
                for (var i = new Date(startDate) ; i <= endDate; i.setDate(i.getDate() + 1)) {
                    populateChartData(i, snap.dateConversion.ConvertDayMonthToString(i));
                }
                break;
            case timePeriodEnum.Weeks:
                var j = 0;
                var date = startDate.getDate() - startDate.getDay() + (startDate.getDay()? 1: -6);
                for (var i = new Date(startDate.setDate(date)) ; i <= endDate; i.setDate(i.getDate() + 7)) {
                    populateChartData(i, snap.dateConversion.ConvertDayMonthToString(i));
                }
                break;
            case timePeriodEnum.Months:
                settings.labelsQty = 6;
                for (var i = new Date(startDate.setDate(1)) ; i <= endDate; i.setMonth(i.getMonth() + 1)) {
                    populateChartData(i, snap.dateConversion.ConvertMonthYearToString(i));
                }
                break;
            case timePeriodEnum.Years:
                startDate.setMonth(0);
                for (var i = new Date(startDate.setDate(1)) ; i <= endDate; i.setYear(i.getFullYear() + 1)) {
                    populateChartData(i, i.getFullYear());
                }
                break;
        }
        return settings;
    }

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
            if (this.bindings.cssToggle.get() === this.typeCss) {
                $(this.element).addClass(this.enabledCss);
                $(this.element).removeClass(this.disabledCss);
            } else {
                $(this.element).addClass(this.disabledCss);
                $(this.element).removeClass(this.enabledCss);
            }
        }
    });

    var hospitalAdminDashboardViewModel = kendo.observable({
        selectedTimePeriod: timePeriodEnum.Weeks,
        selectedSymptomsTraker: symptomsTrakesEnum.All,
        chartType: chartTypeEnum.AverageWaitTime,
        isChartVisible: true,
        cropLabels: false,

        timePeriodDataSource: [
            { title: timePeriodEnum.Days, value: timePeriodEnum.Days },
            { title: timePeriodEnum.Weeks, value: timePeriodEnum.Weeks },
            { title: timePeriodEnum.Months, value: timePeriodEnum.Months },
            { title: timePeriodEnum.Years, value: timePeriodEnum.Years }
        ],

        symptomsTrakerDataSource: [
            { title: symptomsTrakesEnum.All + " Symptoms", value: symptomsTrakesEnum.All },
            { title: symptomsTrakesEnum.Primary + " Symptoms", value: symptomsTrakesEnum.Primary },
            { title: symptomsTrakesEnum.Secondary + " Symptoms", value: symptomsTrakesEnum.Secondary }
        ],

        isTimePeriodVisible: function () {
            return this.chartType === chartTypeEnum.AverageWaitTime || this.chartType === chartTypeEnum.ConsultationTimes;
        },

        isSymptomsTrakerVisible: function () {
            return this.chartType === chartTypeEnum.SymptomTracker;
        },

        cropLabelsLabel: function () {
            return this.get("cropLabels") ? "Show all" : "Crop";
        },
        onChangeTimePeriod: function () {
            this._buildChart();

        },

        onChangeCropLabels: function () {
            this._buildChart();
        },

        onChangeSymptomsTraker: function () {
            this._buildChart();
        },

        viewChart: function (e) {
            var type = $(e.currentTarget).data("typeCss");
            this.set("chartType", type);

            this._triggerEvents();
            this._buildChart();
        },

        LoadViewModel: function () {
            //For any non MVVM manipulations

            var that = this;
            dateRangeSelection.onDateRangeChange(function () { that._buildChart(); });

            this.$grid = $(".chartTable"),
            this.$chart = $("#chart");
            this._buildChart();
        },

        _buildChart: function () {
            var that = this;

            this.$grid.empty();
            this.$chart.empty();

            this.measureType = "";
            var datePattert = "yyyy-MM-dd";
            var chartUrl = function (chartName, measureType) {
                var array = [
                    "/api/v2/clinicians/dashboard",
                    chartName,
                    kendo.toString(dateRangeSelection.startDate(), datePattert),
                    kendo.toString(dateRangeSelection.endDate(), datePattert)
                ];

                if (measureType) {
                    that.measureType = measureType;
                    array.push(measureType);
                }

                return array.join("/");
            }

            var gridColumns = [];
            switch (this.chartType) {
                case chartTypeEnum.AverageWaitTime:
                    that.set("isChartVisible", true);
                    apiRequest.get(chartUrl("wait-times", that.selectedTimePeriod), { action: "Get average wait time", roleFunction: "View Admin Dashboard" }).done(function (response) {
                        that._lineChart(buildChartSettings(response.data, that.measureType, dateRangeSelection.startDate(), dateRangeSelection.endDate()));
                    });
                    gridColumns = waitTimeGridColumns;
                    break;
                case chartTypeEnum.ConsultationTimes:
                    that.set("isChartVisible", true);
                    apiRequest.get(chartUrl("consultation-times", that.selectedTimePeriod), { action: "Get average consultation time", roleFunction: "View Admin Dashboard" }).done(function (response) {
                        that._lineChart(buildChartSettings(response.data, that.measureType, dateRangeSelection.startDate(), dateRangeSelection.endDate()));
                    });
                    gridColumns = consultationTimeGridColumns;
                    break;
                case chartTypeEnum.SymptomTracker:
                    that.set("isChartVisible", true);
                    apiRequest.get(chartUrl("symptoms", that.selectedSymptomsTraker), { action: "Get symptoms", roleFunction: "View Admin Dashboard" }).done(function (response) {
                        //explode all chart categories
                        response.data.forEach(function (item) {
                            item.explode = true;
                        });

                        that._pieChart(response.data);
                    });
                    gridColumns = symptomsGridColumns;
                    break;
                case chartTypeEnum.PatientLocations:
                    that.set("isChartVisible", false);

                    var url = "googleMap.aspx?sdate=" + kendo.toString(dateRangeSelection.startDate(), datePattert) + "&edate=" + kendo.toString(dateRangeSelection.endDate(), datePattert);
                    $("#gFrame").attr('src', url);
                    gridColumns = locationGridColumns;
                    break;
                default:
                    snapError("Unknown chart type:" + this.chartType);
                    break;
            }
            
            this.trigger("change", { field: "chartInfo" });
        },

        chartInfo: function () {
            var datePattert = "MMMM d, yyyy";

            var startDate = dateRangeSelection.selectedStartDate() === null ? "<strong> [Start date not provided] </strong>" : kendo.toString(dateRangeSelection.selectedStartDate(), datePattert);
            var endDate = dateRangeSelection.selectedEndDate() === null ? "<strong> [End date not provided] </strong>" : kendo.toString(dateRangeSelection.selectedEndDate(), datePattert);

            var html = "<p>Viewing: <span>" + startDate + " to " + endDate + "</span>";

            if (this.isTimePeriodVisible() || this.isSymptomsTrakerVisible()) {
                html += "  &gt; ";
            }

            if (this.isTimePeriodVisible()) {
                html += "<span>" + this.selectedTimePeriod + "</span>";
            }

            if (this.isSymptomsTrakerVisible()) {
                html += "<span>" + this.selectedSymptomsTraker + "</span>";
            }

            return html;
        },

        _grid: function (data, columns) {
            this.$grid.empty();
            this.$grid.kendoGrid({
                sortable: true,
                filterable: true,
                columnMenu: true,
                pageable: true,
                columns: columns,
                dataSource: {
                    pageSize: 10,
                    data: data
                }
            });
        },

        _pieChart: function (data) {
            if (data.length === 0) {
                this.$chart.html("<em>No data for this period of time</em>");
                return;
            }

            this.$chart.kendoChart({
                theme: "snapmdTheme",
                title: {
                    position: "top",
                    text: getChartName(this.chartType)
                },
                legend: {
                    visible: true,
                    position: "bottom"
                },
                chartArea: {
                    height: 400,
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#= category #: #= value#%"
                    }
                },
                dataSource: {
                    data: data
                },
                series: [{
                    type: "pie",
                    startAngle: 150,
                    field: "value",
                    categoryField: "category",
                    explodeField: "explode"
                }],
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    color: "#fff"
                }
            });
        },

        _lineChart: function (settings) {
            if (settings.datalength === 0 || typeof (settings.datalength) === 'undefined') {
                this.$chart.html("<em>No data for this period of time</em>");
                return;
            }
            var labelsQty = settings.categories.length ? settings.categories.length : 0;

            var labelStep = this.cropLabels ? Math.round(labelsQty / settings.labelsQty) : 1;
            if (labelStep === 0) {
                labelStep = 1;
            }

            this.$chart.kendoChart({
                theme: "snapmdTheme",
                title: {
                    text: getChartName(this.chartType)
                },
                legend: {
                    position: "bottom"
                },
                chartArea: {
                    height: 400,
                    background: ""
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{ data: settings.series, name: getChartName(this.chartType) }],
                valueAxis: {
                    labels: {
                        format: "{0}"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0,
                    title: {
                        text: "Minutes",
                        padding: 5,
                        font: "14px sans-serif",
                        color: "#d45133"
                    }

                },
                categoryAxis: {
                    categories: settings.categories,
                    labels: {
                        step: labelStep
                    },
                    line: {
                        visible: false
                    },
                    title: {
                        text: this.selectedTimePeriod,
                        padding: 5,
                        font: "14px sans-serif",
                        color: "#d45133"
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= series.name #: #= value # (#= category #)"
                }
            });
        },

        _triggerEvents: function () {
            this.trigger("change", { field: "isTimePeriodVisible" });
            this.trigger("change", { field: "isSymptomsTrakerVisible" });
        }
    });

    app.hospitalAdminDashboardService = {
        viewModel: hospitalAdminDashboardViewModel
    };
})(window, snap, kendo);
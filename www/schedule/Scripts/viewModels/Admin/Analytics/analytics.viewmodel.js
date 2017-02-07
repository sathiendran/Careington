//@ sourceURL=analytics.viewmodel.js
; (function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin").use([
        "snap.service.adminAnalyticsService",
        "snapNotification",
    ]).extend(kendo.observable)
      .define("analytics", function (
            $adminAnalyticsService,
            $snapNotification) {
            var $scope = this,
            isDataInit = false,
            chartTypeEnum = {
                 AverageWaitTime: "AverageWaitTime",
                 PatientLocations: "PatientLocations",
                 ConsultationTimes: "ConsultationTimes",
                 SymptomTracker: "SymptomTracker"
             }, timePeriodEnum = {
                 Days: "Days",
                 Weeks: "Weeks",
                 Months: "Months",
                 Years: "Years"
             }, symptomsTrakesEnum = {
                 All: "All",
                 Primary: "Primary",
                 Secondary: "Secondary"
             }, getChartName = function (chartType) {
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
             };
            /**** Private Methods ****/
            this.chartType= chartTypeEnum.AverageWaitTime;

            this._buildChart = function () {
                function validateInput() {
                    var isValid = true;
                    var errorMsg;

                    $scope.vm_isStartDateInvalid = false;
                    $scope.vm_isEndDateInvalid = false;

                    if ($scope.startDate === null) {
                        errorMsg = "Please enter valid Start date";
                        $scope.vm_isStartDateInvalid = true;
                        isValid = false;
                    }
                    if ($scope.endDate === null) {
                        errorMsg = "Please enter valid End date";
                        $scope.vm_isEndDateInvalid = true;
                        isValid = false;
                    }
                    if (isValid && $scope.endDate <= $scope.startDate) {
                        errorMsg = "Date range is invalid";

                        $scope.vm_isStartDateInvalid = true;
                        $scope.vm_isEndDateInvalid = true;
                        isValid = false;
                    }
                   
                    if (!isValid){
                        $snapNotification.error(errorMsg);
                    }

                    $scope.trigger("change", { field: "vm_isStartDateInvalid" });
                    $scope.trigger("change", { field: "vm_isEndDateInvalid" });
                    return isValid;
                }
                function buildChartSettings(data, measureType, startDate, endDate) {
                    var settings = { categories: [], series: [], labelsQty: 20, datalength: data.length };

                    var hashArray = data.map(function (item) {
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
                            var date = startDate.getDate() - startDate.getDay() + (startDate.getDay() ? 1 : -6);
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
                function processError(error, msgOptions) {
                    if (error.status == 401) {
                        var message = ["You dont have role function"];

                        if (info && msgOptions.action) {
                            message.push(" for ", msgOptions.action, ".");
                        }

                        if (info && msgOptions.roleFunction) {
                            message.push(" Role function: ", msgOptions.roleFunction);
                        }

                        $snapNotification.error(message.join());
                    }
                    if (!snap.userAborted(error)) {
                        $snapNotification.error(error);
                    }
                }



                this.$chart.empty();
                if (!validateInput()) {
                    return;
                }
                const datePattern = "yyyy-MM-dd";
                var chartUrl = function (chartName, measureType) {
                    var array = [
                        "/api/v2/clinicians/dashboard",
                        chartName,
                        kendo.toString($scope.startDate, datePattern),
                        kendo.toString($scope.endDate, datePattern)
                    ];

                    if (measureType) {
                        $scope.measureType = measureType;
                        array.push(measureType);
                    }

                    return array.join("/");
                }

                var chartOptions = {
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                };

                switch (this.chartType) {
                    case chartTypeEnum.AverageWaitTime:
                        this.set("vm_isChartVisible", true);
                        chartOptions = $.extend({}, chartOptions, { measureType: this.vm_selectedTimePeriod });
                        $adminAnalyticsService.getAvgWaitingTime(chartOptions).done(function (response) {
                            $scope._lineChart(buildChartSettings(response.data, $scope.vm_selectedTimePeriod, $scope.startDate, $scope.endDate));
                        }).fail(function (error) {
                            processError(error, { action: "Get average wait time", roleFunction: "View Admin Dashboard" });
                        });
                        break;
                    case chartTypeEnum.ConsultationTimes:
                        this.set("vm_isChartVisible", true);
                        chartOptions = $.extend({}, chartOptions, { measureType: this.vm_selectedTimePeriod });
                        $adminAnalyticsService.getAvgConsultationTime(chartOptions).done(function (response) {
                            $scope._lineChart(buildChartSettings(response.data, $scope.vm_selectedTimePeriod, $scope.startDate, $scope.endDate));
                        }).fail(function (error) {
                            processError(error, { action: "Get average consultation time", roleFunction: "View Admin Dashboard" });
                        });
                        break;
                    case chartTypeEnum.SymptomTracker:
                        this.set("vm_isChartVisible", true);
                        chartOptions = $.extend({}, chartOptions, { measureType: this.vm_selectedSymptomsTraker });
                        $adminAnalyticsService.getSymptomTracker(chartOptions).done(function (response) {
                            //explode all chart categories
                            response.data.forEach(function (item) {
                                item.explode = true;
                            });

                            $scope._pieChart(response.data);
                        }).fail(function (error) {
                            processError(error, { action: "Get symptoms", roleFunction: "View Admin Dashboard" });
                        });
                        break;
                    case chartTypeEnum.PatientLocations:
                        this.set("vm_isChartVisible", false);

                        var url = "/Admin/googleMap.aspx?sdate=" + kendo.toString($scope.startDate, datePattern) + "&edate=" + kendo.toString($scope.endDate, datePattern);
                        $("#gFrame").attr('src', url);
                        break;
                    default:
                        $snapNotification.error("Unknown chart type:" + this.chartType);
                        break;
                }

                this.trigger("change", { field: "vm_chartInfo" });
            }

            this._pieChart = function (data) {
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
            }

            this._lineChart = function (settings) {
                if (settings.datalength === 0 || typeof (settings.datalength) === 'undefined') {
                    this.$chart.html("<em>No data for this period of time</em>");
                    return;
                }
                var labelsQty = settings.categories.length ? settings.categories.length : 0;

                var labelStep = this.vm_cropLabels ? Math.round(labelsQty / settings.labelsQty) : 1;
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
                            text: this.vm_selectedTimePeriod,
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
            }

            this._toggleChart = function (type) {
                this.set("chartType", type);
                this._buildChart();
                this.trigger("change", { field: "vm_isTimePeriodVisible" });
                this.trigger("change", { field: "vm_isSymptomsTrakerVisible" });
                this.trigger("change", { field: "vm_isAvgWaitingTimeChartActive" });
                this.trigger("change", { field: "vm_isPatientLocationsChartActive" });
                this.trigger("change", { field: "vm_isAvgConsultationTimeChartActive" });
                this.trigger("change", { field: "vm_isSymptomTrackerChartActive" });
            }

           

            /**** Public API ****/
            this.load = function () {
                //For any non MVVM manipulations
                isDataInit = true;
                this.$chart = $("#chart");
                this._buildChart();
                $(".timePeriod").attr("readonly", "readonly");
                $(".symptomTracker").attr("readonly", "readonly");

                $scope.trigger("change", { field: "startDate" });
                $scope.trigger("change", { field: "endDate" });
            }

            this.refresh = function () {
                this._buildChart();
            }

            this.isDataInit = function () {
                return isDataInit;
            };

          /****MVVM Bindings****/
            var now = new Date();
            this.endDate = new Date(now);
            now.setMonth(now.getMonth() - 2);
            this.startDate = new Date(now);
            this.vm_isStartDateInvalid = false;
            this.vm_isEndDateInvalid = false;

            this.vm_isLeftMenuActive = false;
            this.leftColToggle = function(){
                this.set("vm_isLeftMenuActive", !this.vm_isLeftMenuActive);
            };

            this.vm_selectedTimePeriod= timePeriodEnum.Weeks;
            this.vm_selectedSymptomsTraker= symptomsTrakesEnum.All;
            
            this.vm_isChartVisible= true;
            this.vm_cropLabels = false;
            this.vm_minDate = new Date(1753, 1, 1, 0, 0, 0, 0), // Min SQL Server date.
            this.vm_maxDate = new Date(2050, 1, 1, 0, 0, 0, 0);

            this.vm_timePeriodDataSource= [
                { title: timePeriodEnum.Days, value: timePeriodEnum.Days },
                { title: timePeriodEnum.Weeks, value: timePeriodEnum.Weeks },
                { title: timePeriodEnum.Months, value: timePeriodEnum.Months },
                { title: timePeriodEnum.Years, value: timePeriodEnum.Years }
            ];

            this.vm_symptomsTrakerDataSource= [
                { title: symptomsTrakesEnum.All + " Symptoms", value: symptomsTrakesEnum.All },
                { title: symptomsTrakesEnum.Primary + " Symptoms", value: symptomsTrakesEnum.Primary },
                { title: symptomsTrakesEnum.Secondary + " Symptoms", value: symptomsTrakesEnum.Secondary }
            ];

            this.vm_isTimePeriodVisible= function () {
                return this.chartType === chartTypeEnum.AverageWaitTime || this.chartType === chartTypeEnum.ConsultationTimes;
            }

            this.vm_isSymptomsTrakerVisible = function () {
                return this.chartType === chartTypeEnum.SymptomTracker;
            }

            this.vm_cropLabelsLabel = function () {
                return this.get("vm_cropLabels") ? "Show all" : "Crop";
            }

            this.vm_onChangeEndDate = function () {
                this._buildChart();
            }
            this.vm_onChangeStartDate = function () {
                this._buildChart();
            }
            this.vm_onChangeTimePeriod = function () {
                this._buildChart();
            }

            this.vm_onChangeCropLabels = function () {
                this._buildChart();
            }

            this.vm_onChangeSymptomsTraker = function () {
                this._buildChart();
            }

            this.vm_isAvgWaitingTimeChartActive = function () {
                return this.chartType === chartTypeEnum.AverageWaitTime;
            }

            this.vm_isPatientLocationsChartActive = function () {
                return this.chartType === chartTypeEnum.PatientLocations;
            }

            this.vm_isAvgConsultationTimeChartActive = function () {
                return this.chartType === chartTypeEnum.ConsultationTimes;
            }

            this.vm_isSymptomTrackerChartActive = function () {
                return this.chartType === chartTypeEnum.SymptomTracker;
            }

            this.vm_showAvgWaitingTimeChart = function () {
                this._toggleChart(chartTypeEnum.AverageWaitTime);
            }

            this.vm_showPatientLocationsChart = function () {
                this._toggleChart(chartTypeEnum.PatientLocations);
            }

            this.vm_showAvgConsultationTimeChart = function () {
                this._toggleChart(chartTypeEnum.ConsultationTimes);
            }

            this.vm_showSymptomTrackerChart = function () {
                this._toggleChart(chartTypeEnum.SymptomTracker);
            }

            this.vm_chartInfo = function () {
              var datePattern = "MMMM d, yyyy";

              var startDate = this.startDate === null ? "<strong> [Start date not provided] </strong>" : kendo.toString(this.startDate, datePattern);
              var endDate = this.endDate === null ? "<strong> [End date not provided] </strong>" : kendo.toString(this.endDate, datePattern);

              var html = "<p>Viewing: <span>" + startDate + " to " + endDate + "</span>";

              if (this.vm_isTimePeriodVisible() || this.vm_isSymptomsTrakerVisible()) {
                  html += "  &gt; ";
              }

              if (this.vm_isTimePeriodVisible()) {
                  html += "<span>" + this.vm_selectedTimePeriod + "</span>";
              }

              if (this.vm_isSymptomsTrakerVisible()) {
                  html += "<span>" + this.vm_selectedSymptomsTraker + "</span>";
              }

              return html;
          }
            
        });
}(jQuery, snap, kendo));

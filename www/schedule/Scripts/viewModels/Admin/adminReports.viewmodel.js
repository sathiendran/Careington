
//Region: Kendo Binding Helpers.
//Because of pure and not stable work of Kendo MVVM this methods will be used in order to access necessary data.

var kendoMvvmHelper = {
    findIndex: function(array, keyPropertyName, key) {
        var index = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i][keyPropertyName] === key) {
                index = i;
                break;
            }
        }

        return index;
    },

    findElement: function (array, keyPropertyName, key) {
        var result = null;
        var index = this.findIndex(array, keyPropertyName, key);
        if (index > -1) {
            result = array[index];
        }

        return result;
    }
};

(function (global, snap, kendoMvvmHelper) {

    var
        app = global.app = global.app || {},
        util = snap.util,
        reportGrid = snap.kendoGrid,
        ReportStateEnum = {
            SelectReportType: 0,
            SelectFocus: 1,
            SelectReportTemplate: 2,
            BuidReport: 3,
            ReportStateName: [
                'Select a Report Type',
                'Select your focus',
                'Reports',
                'Report'
            ]
        },
        ReportTypeEnum = {
            Standard: "Standard",
            Pivot: "Pivot"
        },
        ReportFieldType = {
            General: "General",
            Number: "Number",
            Date: "Date",
            Time: "Time",
            Age: "Age",
            TimeInterval: "TimeInterval",
            Money: "Money"
        },
        obsoleteColumnsMapping = [
            "D: Scheduled Consult Dates",
            "D: Scheduled Consult Times",
            "P: Scheduled Consult Dates",
            "P: Scheduled Consult Times"
        ];

    function getJsTypeForReportFieldType(type) {
        var fieldType;
        switch (type) {
            case ReportFieldType.Money:
            case ReportFieldType.Number:
                fieldType = "number";
                break;
            default:
                fieldType = "string";
                break;
        }

        return fieldType;
    }

    function getFormatForReportFieldType(type) {
        var format = null;

        if (type === "Money") {
            format = "{0:c}";
        }

        return format;
    }    

    var ReportModel = new kendo.data.ObservableObject({
            reportType: '',
            reportFocus: '',
            reportName: '',
            filters: [],
            columns: [],
            rows: [],
            measures: [],
            
            // data source for report filters combo box.
            // we use slice because this.columns & this.rows do not have 'concat()' methods
            fields: function () {
                var a = this.columns.slice().concat(this.rows.slice());
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (a[i] === a[j])
                            a.splice(j--, 1);
                    }
                }

                return a;
            },

            addColumnToTeport: function (columnDefenition) {
                this._addFieldToReport(columnDefenition, this.columns);
            },

            addRowToTeport: function(rowDefenition) {
                this._addFieldToReport(rowDefenition, this.rows);
            },

            _addFieldToReport: function(fieldDefenition, fieldsCollection) {
                if (kendoMvvmHelper.findIndex(fieldsCollection, 'title', fieldDefenition.title) > -1) {
                    snapError("Field is already added");
                } else {
                    fieldsCollection.push(fieldDefenition);
                    this.trigger("change", { field: "fields" });
                }
            },

            removeColumnFromReport: function (columnDefenition) {
                this._removeFieldFromReport(columnDefenition, this.columns);
            },

            removeRowFromReport: function (columnDefenition) {
                this._removeFieldFromReport(columnDefenition, this.rows);
            },

            _removeFieldFromReport: function (fieldDefenition, fieldsCollection) {
                var index = kendoMvvmHelper.findIndex(fieldsCollection, 'title', fieldDefenition.title);
                if (index > -1) {
                    var reportfield = fieldsCollection[index];
                    fieldsCollection.splice(index, 1);
                    this.trigger("change", { field: "fields" });

                    //if columns or rows do not contains current field defenition we will remove all filters releated to this field.
                    if (kendoMvvmHelper.findIndex(this.fields(), 'title', fieldDefenition.title) !== -1) {
                        return;
                    }

                    var filterIndex = kendoMvvmHelper.findIndex(this.filters, 'reportFieldTitle', reportfield.title);
                    while (filterIndex > -1) {
                        this.filters.splice(filterIndex, 1);
                        filterIndex = kendoMvvmHelper.findIndex(this.filters, 'reportFieldTitle', reportfield.title);
                    }
                }
            },

            addFilterToReport: function (filterDefenition) {
                var validationResult = this._validateProposedFilter(filterDefenition);
                if (validationResult) {
                    snapError(validationResult);
                    return;
                }

                filterDefenition.hashCode = this._hashCode(filterDefenition.reportFieldTitle + filterDefenition.filterTitle + filterDefenition.filterValue);

                if (kendoMvvmHelper.findIndex(this.filters, 'hashCode', filterDefenition.hashCode) > -1) {
                    snapError("Filter is already added");
                } else {
                    this.filters.push(filterDefenition);
                }
            },
            
            addMeasureToReport: function (measureDefenition) {
                var validationResult = this._validateProposedMeasure(measureDefenition);
                if (validationResult) {
                    snapError(validationResult);
                    return;
                }

                measureDefenition.hashCode = this._hashCode(measureDefenition.title + measureDefenition.aggregate);
                
                if (kendoMvvmHelper.findIndex(this.measures, 'hashCode', measureDefenition.hashCode) > -1) {
                    snapError("Measure is already added");
                } else {
                    this.measures.push(measureDefenition);
                }
            },

            removeFilterFromReport: function (hashCode) {
                var index = kendoMvvmHelper.findIndex(this.filters, 'hashCode', hashCode);
                if (index > -1) {
                    this.filters.splice(index, 1);
                }
            },

            removeMeasureFromReport: function (hashCode) {
                var index = kendoMvvmHelper.findIndex(this.measures, 'hashCode', hashCode);
                if (index > -1) {
                    this.measures.splice(index, 1);
                }
            },

            _validateProposedMeasure: function(measureDefenition) {
                if (measureDefenition.title === "")
                    return "Please Select Measure field";
                
                if (!measureDefenition.aggregate)
                    return "Please Select Measure agregation";

                return null;
            },

            _validateProposedFilter: function (filterDefenition) {
                if (filterDefenition.reportFieldTitle === "")
                    return "Please Select Filter field";

                if (!filterDefenition.filterType)
                    return "Please Select Filter operator";

                if (filterDefenition.filterValue === '')
                    return "Please Enter Filter text";

                var columnDefenition = kendoMvvmHelper.findElement(this.columns, 'title', filterDefenition.reportFieldTitle);

                if (columnDefenition == null)
                    return "You can not add a filter to a column that is not in the report";

                var dateFormat1 = /^(0[1-9]|1[012])[\/](0[1-9]|[12][0-9]|3[01])[\/]\d{4}$/;
                var dateFormat2 = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ ](0[1-9]|[12][0-9]|3[01])[,][ ](19|20)\d\d$/;

                if (columnDefenition.type === 'Date'  &&
                    (filterDefenition.filterType !== 'Include' && filterDefenition.filterType !== 'NotInclude') &&
                    !(dateFormat1.test(filterDefenition.filterValue) || dateFormat2.test(filterDefenition.filterValue))) {
                    return "Please enter valid date (Mmm dd, yyyy) or (mm/dd/yyyy). Example: Jul 02, 2013 ";
                }

                var dateTimeFormat1 = /^(0[1-9]|1[012])[\/](0[1-9]|[12][0-9]|3[01])[\/]\d{4}[ ](((0[1-9]|1[012]):[0-5][0-9])(AM|PM)|(([01][1-9])|2[0-3]):[0-5][0-9])$/;
                var dateTimeFormat2 = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ ](0[1-9]|[12][0-9]|3[01])[,][ ](19|20)\d\d[ ](((0[1-9]|1[012]):[0-5][0-9])(AM|PM)|(([01][1-9])|2[0-3]):[0-5][0-9])$/;
                if (columnDefenition.type == 'Time' &&
                    (filterDefenition.filterType !== 'Include' && filterDefenition.filterType !== 'NotInclude') &&
                    !(dateTimeFormat1.test(filterDefenition.filterValue) || dateTimeFormat2.test(filterDefenition.filterValue))) {
                    return "Please enter valid date and time (Mmm dd, yyyy hh:mm) or (mm/dd/yyyy hh:mm). Example: Jul 02, 2013 12:00AM";
                }

                var ageFormat = /^\s*(\d+\s+(Years?|Months?|Days?)\s*)+$/;
                if (columnDefenition.type === 'Age' && !ageFormat.test(filterDefenition.filterValue)) {
                    return "Please enter valid age. Example: 26 Years 1 Month 2 Days ";
                }

                var timeIntervalFormat = /^\s*\d+\s*(Minutes?|Minute\(s\))\s*$/;
                if (columnDefenition.type === 'TimeInterval' && !timeIntervalFormat.test(filterDefenition.filterValue)) {
                    return "Please enter valid time interval. Example: 1 Minute or 15 Minutes or 45 Minute(s)";
                }

                var moneyFormat = /^\s*\$?\s*\d+\s*$/;
                if (columnDefenition.type === 'Money' && !moneyFormat.test(filterDefenition.filterValue)) {
                    return "Please enter valid ammount. Example: $ 100 or $15 ";
                }

                return null;
            },

            _hashCode: function (str) {
                var hash = 0;
                if (str.length == 0) return hash;
                for (var i = 0; i < str.length; i++) {
                    var charCode = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + charCode;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash.toString();
            },
        });


    var AdminReportsViewModel = kendo.observable({
        isPrevButtonVisible: false,
        isNextButtonVisible: false,
        isReportContentVisible: false,
        reportModel: ReportModel,
        reportFilterOperators: [],
        availableReportFocuses: [],
        availableReportTemplates: [],
        reportColumnsAvailableForReportFocus: [],
        pageState: ReportStateEnum.SelectReportType,
        selectedTab: ReportStateEnum.ReportStateName[ReportStateEnum.SelectReportType],
        columnSelectedField: "",
        rowSelectedField: "",
        filterSelectedField: "",
        filterSelectedOperator: null,
        filterValue: "",
        measureSelectedField: "",
        measureSelectedAggregation: "",
        measureAggregationSource:
        [
            { title: "Count", aggregate: "count" },
            { title: "Average", aggregate: "average" },
            { title: "Sum", aggregate: "sum" },
            { title: "Minimum", aggregate: "min" },
            { title: "Maximum", aggregate: "max" }
        ],

        createNewReportLabel: function() {
            return "New Custom " + this.reportModel.reportFocus + " Report";
        },
        noColumnsSelectedForReport: function() {
            return this.reportModel.columns.length === 0;
        },
        noRowsSelectedForReport: function () {
            return this.reportModel.rows.length === 0;
        },
        noFiltersSelectedForReport: function() {
            return this.reportModel.filters.length === 0;
        },
        noMeasuresSelectedForReport: function() {
            return this.reportModel.measures.length === 0;
        },

        showPivotReportConfigurationOptions: function() {
            return this.reportModel.reportType === ReportTypeEnum.Pivot;
        },

        configurationPanleElementsCount: function() {
            return this.showPivotReportConfigurationOptions() ? 4 : 2;
        },

        selectReportType: function(e) {
            this._selectReportType(e.currentTarget.getAttribute('data-report-type'));
            this._setCurrentStep(ReportStateEnum.SelectFocus);
        },

        selectReportFocus: function(e) {
            this._selectReportFocus(e.currentTarget.getAttribute('data-report-focus'), false);
            this._setCurrentStep(ReportStateEnum.SelectReportTemplate);
        },

        selectReportFocusAndShowNewReport: function(e) {
            this._selectReportFocus(e.currentTarget.getAttribute('data-report-focus'), true);
            this._setCurrentStep(ReportStateEnum.BuidReport);
        },

        selectReportTemplate: function(e) {
            this._selectReportTemplate(e.currentTarget.getAttribute('data-report-template'));
            this._setCurrentStep(ReportStateEnum.BuidReport);
        },

        selectNewReport: function() {
            this._newReport();
            this._setCurrentStep(ReportStateEnum.BuidReport);
        },

        addReportColumn: function () {
            this._addFieldToReport(this.columnSelectedField, "columns");
        },

        addReportRow: function() {
            this._addFieldToReport(this.rowSelectedField, "rows");
        },

        removeReportColumn: function (e) {
            this._removeFieldFromReport(e.currentTarget.getAttribute("data-report-field"), "columns");
        },

        removeReportRow: function (e) {
            this._removeFieldFromReport(e.currentTarget.getAttribute("data-report-field"), "rows");
        },


        addReportFilter: function () {
            var filterDefenition = {
                reportFieldTitle: this.filterSelectedField,
                filterType: this.filterSelectedOperator,
                filterValue: this.filterValue
            };

            this._addFilterToReport(filterDefenition);
        },

        addReportMeasure: function () {
            var measureDefenition = {
                title: this.measureSelectedField,
                aggregate: this.measureSelectedAggregation
            };

            this._addMeasureToReport(measureDefenition);
        },

        removeReportFilter: function(e) {
            this.reportModel.removeFilterFromReport(e.currentTarget.getAttribute('data-report-hashCode'));
            this._trigerChangeReportModelEvents();
        },

        removeMeasure: function(e) {
            this.reportModel.removeMeasureFromReport(e.currentTarget.getAttribute('data-report-hashCode'));
            this._trigerChangeReportModelEvents();
        },

        buildReport: function() {
            this._buildReport();
        },

        exportReportAsExcel: function() {
            reportGrid.exportAsExcel();
        },

        exportReportAsPDF: function () {
            reportGrid.exportAsPDF();
        },

        saveReportAsTemplate: function () {
            var postData = this._getReportModelForWebApi();
                
            if (postData.reportName === '') {
                snapError("Please enter Report name");
                return;
            }
            var vm = this;
            util.apiAjaxRequest('/api/adminreports/reporttemplates', 'POST', postData).done(function (response) {
                snapSuccess(response);
                snap.SnapHttp().get('/api/adminreports/reporttemplates', { reportFocus: vm.reportModel.reportFocus }).then(function (data) {
                    vm.set("availableReportTemplates", data);
                });
            });
        },

        deleteReportTemplate: function () {
            if (this.reportModel.reportName === '') {
                snapError("Please select Report");
                return;
            }

            var postData = {
                reportFocus: this.reportModel.reportFocus,
                reportName: this.reportModel.reportName
            };

            var that = this;
            util.apiAjaxRequest('/api/adminreports/reporttemplates', 'DELETE', postData).done(function (response) {
                that.set("reportModel.reportName", '');
                snap.SnapHttp().get('/api/adminreports/reporttemplates', { reportFocus: that.reportModel.reportFocus }).then(function (data) {
                    that.set("availableReportTemplates", data);
                    snapSuccess(response);
                });
            });
        },

        nextStep: function() {
            this._setCurrentStep(this.pageState + 1);
        },

        previousStep: function() {
            this._setCurrentStep(this.pageState - 1);
        },

        _selectReportType: function (reportType) {
            if (this.reportModel.reportType === reportType)
                return;

            var that = this;
            that._clearWizardData(ReportStateEnum.SelectReportType);
            that.set("reportModel.reportType", reportType);

            if (reportType === ReportTypeEnum.Pivot) {
                reportGrid = snap.kendoPivotGrid;
            } else {
                reportGrid = snap.kendoGrid;
            }

            snap.SnapHttp().get('/api/adminreports/reportfocuses', { reportType: reportType }).then(function (data) {
                that.set("availableReportFocuses", data);
            });
        },

        _selectReportFocus: function (reportFocus, showNewReport) {
            if (this.reportModel.reportFocus === reportFocus)
                return;

            var that = this;
            that._clearWizardData(ReportStateEnum.SelectFocus);
            that.set("reportModel.reportFocus", reportFocus);

            snap.SnapHttp().get('/api/adminreports/reporttemplates', { reportFocus: reportFocus }).then(function(data) {
                that.set("availableReportTemplates", data);
            });

            snap.SnapHttp().get('/api/adminreports/reportcolumns', { reportFocus: reportFocus }).then(function(data) {
                that.set("reportColumnsAvailableForReportFocus", data);

                if (showNewReport)
                    that._newReport();
            });

            that.trigger("change", { field: "createNewReportLabel" });
        },

        _selectReportTemplate: function (reportName) {
            this._clearWizardData(ReportStateEnum.SelectReportTemplate);
            
            var postData = {
                reportFocus: this.reportModel.reportFocus,
                reportName: reportName
            };

            var that = this;
            snap.SnapHttp().get('/api/adminreports/reporttemplatesbyname', postData).then(function (rModel) {
                that.set("reportModel.reportFocus", rModel.reportFocus);
                that.set("reportModel.reportName", rModel.reportName);

                rModel.columns.forEach(function(title) {
                    that._addFieldToReport(title, 'columns');
                });

                rModel.rows.forEach(function (title) {
                    that._addFieldToReport(title, 'rows');
                });

                rModel.filters.forEach(function (filterDefenition) {
                    that._addFilterToReport(filterDefenition);
                });

                rModel.measures.forEach(function (measure) {
                    that._addMeasureToReport(measure);
                });

                that._buildReport();
            });
        },

        _newReport: function () {
            this._clearWizardData(ReportStateEnum.SelectReportTemplate);

            var that = this;
            snap.SnapHttp().get('/api/adminreports/reportdefaultfields', { reportFocus: this.reportModel.reportFocus }).then(function (reportColumns) {
                reportColumns.forEach(function (column) {
                    that._addFieldToReport(column.title, 'columns');
                });

                that._buildReport();
            });
        },

        _addFieldToReport: function(fieldTitle, collectionType) {
            var fieldDefenition = kendoMvvmHelper.findElement(this.reportColumnsAvailableForReportFocus, 'title', fieldTitle);

            if (fieldDefenition) {
                if (collectionType === "rows") {
                    this.reportModel.addRowToTeport(fieldDefenition);
                } else {
                    this.reportModel.addColumnToTeport(fieldDefenition);
                }
            } else if (obsoleteColumnsMapping.indexOf(fieldTitle) < 0) { //Some of the report columns are obsolete, so we exclude them from report without any errors.
                snapError("Column definition was not found. Title: " + fieldTitle);
            }

            this._trigerChangeReportModelEvents();
        },

        _removeFieldFromReport: function (fieldTitle, collectionType) {
            var columnDefenition = kendoMvvmHelper.findElement(this.reportColumnsAvailableForReportFocus, 'title', fieldTitle);

            if (columnDefenition) {
                if (collectionType === "rows") {
                    this.reportModel.removeRowFromReport(columnDefenition);
                } else {
                    this.reportModel.removeColumnFromReport(columnDefenition);
                }
            }

            this._trigerChangeReportModelEvents();

            if (this.filterSelectedField === columnDefenition.title) {
                this.set("filterSelectedField", '');
            }
        },
        
        _addFilterToReport: function (filterDefenition) {
            var filterOperatorDefenition = kendoMvvmHelper.findElement(this.reportFilterOperators, 'filterType', filterDefenition.filterType);

            if (filterOperatorDefenition) {
                filterDefenition.filterTitle = filterOperatorDefenition.filterTitle;
                this.reportModel.addFilterToReport(filterDefenition);
                this._trigerChangeReportModelEvents();
            } else {
                snapError("Filter definition was not found");
            }
        },

        _addMeasureToReport: function (measureDefenition) {
            var fieldDefenition = kendoMvvmHelper.findElement(this.reportColumnsAvailableForReportFocus, 'title', measureDefenition.title);

            if (fieldDefenition) {
                measureDefenition.field = fieldDefenition.field;
                measureDefenition.type = fieldDefenition.type;
                this.reportModel.addMeasureToReport(measureDefenition);
                this._trigerChangeReportModelEvents();
            } else {
                snapError("Can not add measure for field '" + measureDefenition.title + "'. Field definition was not found.");
            }
        },

        _getReportModelForWebApi: function() {
            var reportMeasures = this.reportModel.measures.map(function(element) {
                return {
                    title: element.title,
                    aggregate: element.aggregate
                };
            });

            var reportFilters = this.reportModel.filters.map(function(element) {
                return {
                    reportFieldTitle: element.reportFieldTitle,
                    filterValue: element.filterValue,
                    filterType: element.filterType
                }
            });

            return {
                reportType: this.reportModel.reportType,
                reportFocus: this.reportModel.reportFocus,
                reportName: this.reportModel.reportName,
                columns: this.reportModel.columns.map(function (element) { return element.title; }),
                rows: this.reportModel.rows.map(function (element) { return element.title; }),
                measures: reportMeasures,
                filters: reportFilters
            };
        },

        _buildReport: function () {
            var postData = this._getReportModelForWebApi();

            if (postData.columns.length === 0 && postData.rows.length === 0) {
                snapError("Please select at least one column for report.");
                return;
            }

            reportGrid.ClearGrid();

            var that = this;
            util.apiAjaxRequest('/api/adminreports/reportdata', 'POST', postData).done(function (data) {
                var gridConiguration = {
                    columns: [],
                    rows: [],
                    measures: []
                };

                that.reportModel.columns.forEach(function (element) {
                    gridConiguration.columns.push(that._getKendoGridField(element));
                });

                that.reportModel.rows.forEach(function (element) {
                    gridConiguration.rows.push(that._getKendoGridField(element));
                });

                that.reportModel.measures.forEach(function (element) {
                    var measure = {
                        fieldInfo: that._getKendoGridField(element),
                        aggregate: element.aggregate
                    };
                    
                    gridConiguration.measures.push(measure);
                });

                reportGrid.ShowGrid(gridConiguration, data);
                that.set("isReportContentVisible", true);
            });
        },

        _getKendoGridField: function(element) {
            var field = {
                field: element.field,
                title: element.title
            };

            field.type = getJsTypeForReportFieldType(element.type);
            field.format = getFormatForReportFieldType(element.type);

            return field;
        },

        _trigerChangeReportModelEvents: function () {
            this.trigger("change", { field: "noColumnsSelectedForReport" });
            this.trigger("change", { field: "noRowsSelectedForReport" });
            this.trigger("change", { field: "noFiltersSelectedForReport" });
            this.trigger("change", { field: "noMeasuresSelectedForReport" });
            this.trigger("change", { field: "showPivotReportConfigurationOptions" });
            this.trigger("change", { field: "configurationPanleElementsCount" });
            this.trigger("change", { field: "reportModel.columns" });
            this.trigger("change", { field: "reportModel.rows" });
            this.trigger("change", { field: "reportModel.fields" });
            this.trigger("change", { field: "reportModel.filters" });
            this.trigger("change", { field: "reportModel.measures" });
        },

        _setCurrentStep: function (step) {
            var that = this;
            that.set("pageState", step);
            that.set('selectedTab', ReportStateEnum.ReportStateName[step]);

            switch (step) {
                case ReportStateEnum.SelectReportType:
                    that.set("isPrevButtonVisible", false);
                    that.set("isNextButtonVisible", that.reportModel.reportType !== '');
                    break;
                case ReportStateEnum.SelectFocus:
                    that.set("isPrevButtonVisible", true);
                    that.set("isNextButtonVisible", that.reportModel.reportFocus !== '');
                    break;
                case ReportStateEnum.SelectReportTemplate:
                    that.set("isPrevButtonVisible", true);
                    that.set("isNextButtonVisible", that.reportModel.reportName !== '' || that.reportModel.columns.length > 0); // report could be without name.
                    break;
                case ReportStateEnum.BuidReport:
                    that.set("isPrevButtonVisible", true);
                    that.set("isNextButtonVisible", false);
                    break;
                default:
                    break;
            }

            that.set('pageState', step);
        },

        _clearWizardData: function (step) {
            //Clear Report.. 
            if (ReportStateEnum.BuidReport >= step) {
                this.set("reportModel.columns", []);
                this.set("reportModel.rows", []);
                this.set("reportModel.measures", []);
                this.set("reportModel.filters", []);
                reportGrid.ClearGrid();
                this.set("isReportContentVisible", false);

                this.set("columnSelectedField", '');
                this.set("rowSelectedField", '');
                this.set("measureSelectedField", '');
                this.set("measureSelectedAggregation", '');
                this.set("filterSelectedField", '');
                this.set("filterSelectedOperator", '');
                this.set("filterValue", '');
                
                //this.trigger("change", { field: "reportFilterOperators" });
            }

            //Clear Report Templates.. 
            if (ReportStateEnum.SelectReportTemplate >= step) {
                this.set("reportModel.reportName", '');
            }

            //Clear Report Focuses.. 
            if (ReportStateEnum.SelectFocus >= step) {
                this.set("reportModel.reportFocus", '');
                this.set("availableReportTemplates", []);
                this.set("reportColumnsAvailableForReportFocus", []);
            }

            //Clear Report Type.. 
            if (ReportStateEnum.SelectReportType >= step) {
                this.set("reportModel.reportType", '');
                this.set("availableReportFocuses", []);
            }

            //Refresh UI
            this._trigerChangeReportModelEvents();
        },

        LoadViewModel: function () {
            var that = this;
            util.apiAjaxRequest('/api/adminreports/reportfilteroperators', 'GET').done(function (data) {
                data.forEach(function(element) {
                    that.reportFilterOperators.push(element);
                });

                //that.set("reportFilterOperators", data);
                that.trigger("change", { field: "reportFilterOperators" });
            });
        }
    });

    app.adminReportsService = {
        viewModel: AdminReportsViewModel
    };
})(window, snap, kendoMvvmHelper);
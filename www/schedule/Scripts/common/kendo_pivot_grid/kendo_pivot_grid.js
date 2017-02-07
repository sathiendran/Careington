/*
Telerik Kendo Grid have only limitted support of MVVM and not support many importent features.
This module is wrapper for kendo grid, and allow to manage Grid from ViewModel without manipulation with HTML & JQuery and keep ViewModel clear.
*/

var snap = snap || {};

snap.kendoPivotGrid = (function (global, $) {
    var $reportContent;

    $(document).ready(function () {
        $reportContent = $('#reportContent');
    });

    function replaceEmptyValues($container, possibleValues) {
        var $matches = $container.filter(function () {
            var match = false;
            for (var i = 0; i < possibleValues.length; i++) {
                if (possibleValues[i].name + '&' === $.text([this])) {
                    match = true;
                    break;
                }
            }

            return match;
        });

        $matches.text("Empty");
        $matches.css("color", "red");
    }

    return {
        ShowGrid: function (gridConiguration, gridData) {
            var cubeDemensions = {},
                cubeMeasures = {},
                reportColumns = [],
                reportRows = [],
                measures = [],
                fields = {};

            gridConiguration.measures.forEach(function (element) {
                var measure = { field: element.fieldInfo.field, aggregate: element.aggregate };
                if (element.fieldInfo.format) {
                    measure.format = element.fieldInfo.format;
                }

                var measureName = measure.aggregate + " " + element.fieldInfo.title;

                cubeMeasures[measureName] = measure;
                fields[element.fieldInfo.field] = { type: element.fieldInfo.type };
                measures.push(measureName);
            });

            gridConiguration.columns.forEach(function (element) {
                cubeDemensions[element.field] = { caption: element.title };
                fields[element.field] = { type: element.type };
                reportColumns.push({ name: element.field });
            });

            gridConiguration.rows.forEach(function (element) {
                cubeDemensions[element.field] = { caption: element.title };
                fields[element.field] = { type: element.type };
                reportRows.push({ name: element.field });
            });

            $reportContent.kendoPivotGrid({
                height: 800,
                columnWidth: 120,
                messages: {
                    measureFields: "Select measures",
                    columnFields: "Select columns",
                    rowFields: "Select rows"
                },
                dataBound: function () {
                    var colHeaders = $(".k-grid-header").find("th");
                    var rowHeader = $(".k-pivot-rowheaders").find("td");
                    var possibleValues = reportColumns.concat(reportRows);

                    replaceEmptyValues(colHeaders, possibleValues);
                    replaceEmptyValues(rowHeader, possibleValues);
                },
                dataSource: {
                    data: gridData,
                    columns: reportColumns,
                    rows: reportRows,
                    measures: measures,
                    schema: {
                        cube: {
                            dimensions: cubeDemensions,
                            measures: cubeMeasures
                        },
                        model: {
                            fields: fields
                        }
                    }
                }
            });
        },

        ClearGrid: function () {
            $reportContent.empty();
        },

        exportAsExcel: function () {
            $reportContent.data("kendoPivotGrid").saveAsExcel();
        },

        exportAsPDF: function () {
            $reportContent.data("kendoPivotGrid").saveAsPDF();
        }
    };

})(window, jQuery);

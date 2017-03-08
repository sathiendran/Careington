/*
Telerik Kendo Grid have only limitted support of MVVM and not support many importent features.
For more details see:
1. http://www.telerik.com/forums/grid-mvvm-data-columns-can-we-bind-this-to-a-source
2. http://www.telerik.com/forums/export-all-pages-to-pdf
3. http://docs.telerik.com/kendo-ui/web/grid/how-to/pdf-export/all-pages
This module is wrapper for kendo grid, and allow to manage Grid from ViewModel without manipulation with HTML & JQuery and keep ViewModel clear.
*/

/* Dependencies
<script src="http://cdn.kendostatic.com/2014.3.1316/js/kendo.all.min.js"></script>
<!-- Load Pako ZLIB library to enable PDF compression -->
<script src="http://cdn.kendostatic.com/2014.3.1314/js/pako_deflate.min.js"></script>
<script src="http://cdn.kendostatic.com/2014.3.1314/js/jszip.min.js"></script>
*/

var snap = snap || {};

snap.kendoGrid = (function (global, $) {
    var $reportContent;

    // Import Drawing API namespaces
    var draw = kendo.drawing;
    var geom = kendo.geometry;

    function fullExport(e) {
        // Stop the built-in export
        e.preventDefault();

        // Clone the Grid HTML offscreen
        var wrapper = this.wrapper;
        var shadow = $("<div class='k-export-wrap'>")
                     .css("width", wrapper.width());

        // Prepend the export container
        wrapper.before(shadow);

        // This group will be our document containing all pages
        var doc = new draw.Group();

        this.dataSource.bind("change", function handler() {
            var dataSource = this;

            // Copy the current page view to the export container
            shadow.empty().append(wrapper.clone());

            draw.drawDOM(shadow)
                .done(function (group) {
                    // Format the current page
                    var pageNum = dataSource.page();
                    var totalPages = dataSource.totalPages();

                    var page = formatPage(group);

                    doc.append(page);

                    if (pageNum < totalPages) {
                        // Move to the next page
                        dataSource.page(pageNum + 1);
                    } else {
                        // Last page processed reached
                        dataSource.unbind("change", handler);
                        shadow.remove();
                        saveReport(doc);
                    }
                });
        });

        // Read the first page
        this.dataSource.fetch();
    }

    function saveReport(doc) {
        draw.exportPDF(doc, {
            paperSize: "A4",
            landscape: true,
            margin: "1cm",
            multiPage: true
        }).done(function (data) {
            // Save the PDF file
            kendo.saveAs({
                dataURI: data,
                fileName: "Report.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            });
        });
    }

    // PDF Output is fixed at 72 DPI
    // This gives us a fixed mm/px ratio
    var MM_TO_PX = 2.8347;

    // A4 Sheet with 1 cm borders, landscape
    var PAPER_RECT = new geom.Rect(
        [0, 0], [(297 - 20) * MM_TO_PX, (210 - 20) * MM_TO_PX]
    );

    function formatPage(content) {
        // Fit the content in the available space
        content = fit(content, PAPER_RECT);

        // Center the content
        content = hAlign(content, PAPER_RECT, "center");

        // Add a frame to fix the page size
        var frame = draw.Path.fromRect(PAPER_RECT, {
            stroke: null
        });

        var page = new draw.Group();
        page.append(frame, content);

        return page;
    }

    // Transform the content to fit into the specified size
    function fit(content, rect) {
        var bbox = content.clippedBBox();
        var size = rect.size;
        var scale = Math.min(
            size.width / bbox.width(),
            size.height / bbox.height()
        );

        // We apply the actual transformation on a wrapper
        // so its applied before any existing transformations
        var wrap = new draw.Group({
            transform: geom.transform().scale(scale, scale)
        });

        wrap.append(content);

        return wrap;
    }

    // Horizontally aligns an element within a rectangle
    // Supported aligments are "left", "center" and "right"
    function hAlign(element, rect, pos) {
        var anchor = "topLeft";

        if (pos === "center") {
            anchor = "center";
        } else if (pos === "right") {
            anchor = "topRight";
        }

        var offset = rect[anchor]().x - element.clippedBBox()[anchor]().x;

        // We apply the actual transformation on a wrapper
        // so its applied before any existing transformations
        var wrap = new draw.Group({
            transform: geom.transform().translate(offset, 0)
        });

        wrap.append(element);

        return wrap;
    }

    $(document).ready(function () {
        $reportContent = $('#reportContent');
    });

    return {
        ShowGrid: function (gridConiguration, gridData) {
            var 
              fields = {};

            gridConiguration.columns.forEach(function (element) {
                fields[element.field] = { type: element.type };
            });

            $reportContent.empty();
            $reportContent.kendoGrid();

            $reportContent.kendoGrid({
                pdfExport: fullExport,
                scrollable: true,
                sortable: true,
                pageable: true,
                columnMenu: true,
                filterable: true,
                resizable: true,
                selectable: "row",
                height: 728,
                dataSource: {
                    data: gridData,
                    pageSize: 30,
                    schema: {
                        model: {
                            fields: fields
                        }
                    }
                },
                columns: gridConiguration.columns,
                excel: {
                    allPages: true
                },
            });
        },

        ClearGrid: function () {
            $reportContent.empty();
            $reportContent.kendoGrid();
        },

        exportAsExcel: function () {
            $reportContent.data("kendoGrid").saveAsExcel();
        },

        exportAsPDF: function () {
            kendo.pdf.defineFont({
                "DejaVu Sans": "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
                "DejaVu Sans|Bold": "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
                "DejaVu Sans|Bold|Italic": "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
                "DejaVu Sans|Italic": "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf"
            });
            $reportContent.data("kendoGrid").saveAsPDF();
        }
    };

})(window, jQuery);

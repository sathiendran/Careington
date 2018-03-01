//@ sourceURL=userTermsDialog.viewmodel.js

;
(function($, global, snap, kendo) {
    "use strict";

    snap.namespace("snap.shared")
        .use([
            "eventaggregator",
            "SnapNotification",
            "snap.enums.documentTypes",
            "snap.shared.landingCommon"
        ])
        .extend(kendo.observable)
        .define("userTermsDialogViewModel", function(
            $eventaggregator,
            $snapNotification,
            $documentTypes,
            $landingCommon
        ) {
            var $scope = this,
                dialog = null,
                loaded = false;

            this._reportContainer = "#termsContent";

            this.vm_loadFailed = false;
            this.vm_termsHtml = "";
            this.vm_isLoading = false;
            this.vm_hospitalLogo = "";

            this.setOptions = function(opt) {
                dialog = opt.dialog;
                if (!loaded) {
                    this._load();
                }
            };

            this.onDialogClose = function() {
                $eventaggregator.published($landingCommon.events.onDialogClose);
            };


            this.vm_onCloseClick = function(e) {
                e.preventDefault();
                $eventaggregator.published($landingCommon.events.onDialogClose);
                dialog.close();
            };
            this.vm_onDownloadClick = function(e) {
                e.preventDefault();
                kendo.drawing.drawDOM($scope._reportContainer, {
                    paperSize: "Letter",
                    landscape: false,
                    margin: { bottom: "10mm" },
                    scale: 0.73
                }).then(function(group) {
                    kendo.drawing.pdf.saveAs(group, "Terms_and_Conditions.pdf");
                });
            };
            this.vm_onPrintClick = function(e) {
                e.preventDefault();

                var data = this.vm_termsHtml;

                var mywindow = window.open('', 'My_div', 'height=825,width=768');
                mywindow.document.write('<html><head>');

                mywindow.document.write('<title>Terms_and_Conditions</title>');
                mywindow.document.write('</head><body><div>');

                mywindow.document.write(data);

                mywindow.document.write('</div></body></html>');

                if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
                    // The timeout is necessary because window.onload does not work correctly in chrome. 
                    // For more info see https://productforums.google.com/forum/#!topic/chrome/7VIpByhmU3U
                    mywindow.document.write('<script>function doPrint(){window.setTimeout(function(){window.print();window.close();}, 500);} ');
                    mywindow.document.write('window.onload=doPrint();');
                    mywindow.document.write('</script>');

                    return true;
                } else {

                    mywindow.document.close();
                    mywindow.focus();
                    mywindow.window.print();
                    mywindow.close();

                    return false;
                }
            };

            this._load = function() {
                loaded = true;
                this.set("vm_isLoading", true);
                this.set("vm_hospitalLogo", snap.hospitalSession.hospitalLogo);

                function htmlDecode(value) {
                    if (value !== null) {
                        return $('<div/>').html(value).text();
                    }
                    return value;
                }
                var data = {
                    documentType: $documentTypes.termsAndConditions,
                    hospitalId: snap.hospitalSession.hospitalId
                };
                $.ajax({
                    url: "/api/v2/publicdocuments",
                    type: 'GET',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: data
                }).then(function(response) {
                    var termsText = response.data[0].documentText;
                    //if provider /content/EUA-Customer-Provider.pdf if it's shared login seems we show patient consumer, could try to check if on the provider login later
                    if (snap.clinicianPage || snap.adminPage) {
                        $scope.set("vm_termsHtml", htmlDecode(termsText).replace(/%PDFLINK%/g, "/content/EUA-Customer-Provider.pdf"));
                    } else {
                        $scope.set("vm_termsHtml", htmlDecode(termsText).replace(/%PDFLINK%/g, "/content/EUA-Patient-Consumer.pdf"));
                    }

                    // need to adjust the dialog size after change it content
                    dialog.resize();
                }, function() {
                    $snapNotification.info("Failed to load terms & conditions");
                    $scope.set("vm_loadFailed", true);
                }).always(function() {
                    $scope.set("vm_isLoading", false);
                });
            };
        }).singleton();
}(jQuery, window, snap, kendo));
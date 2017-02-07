﻿//@ sourceURL=dialogWindow.js

"use strict";
(function ($, snap, kendo) {

    snap.namespace("snap.common").use(["snap.common.contentLoader"])
        .define("dialogWindow", function ($contentLoader) {
            function Dialog(dialogOpt) {
                var currentDialog = null,
                    viewModel = null,
                    that = this;

                var buidingCurrentDialog = false;

                function open(opt) {
                    close();

                    var dfd = $.Deferred();

                    if (currentDialog === null) {
                        if (buidingCurrentDialog) {
                            return;
                        }
                        buidingCurrentDialog = true;

                        $contentLoader.bindViewModel(kendo.observable(dialogOpt.vm), dialogOpt.container, dialogOpt.contentPath).done(function (vm) {
                            viewModel = vm;

                            // If ViewModel contains any non MVVM logic, we will run it here.
                            if (typeof (viewModel.loadNonMVVM) === "function") {
                                viewModel.loadNonMVVM(dialogOpt.container);
                            }

                            var $container = $(dialogOpt.container);

                            $container.kendoWindow({
                                actions: [],
                                modal: true,
                                resizable: false
                            });

                            $container.parent().addClass('dialogbox-modal');

                            currentDialog = $container.data("kendoWindow");
                            buidingCurrentDialog = false;

                            openDialog(currentDialog);
                        });
                    } else {
                        openDialog(currentDialog);
                    }

                    function openDialog(dialog) {
                        dialog.center();
                        dialog.open();

                        if (typeof (viewModel.setOptions) === "function") {
                            viewModel.setOptions({
                                dialog: that,
                                opt: opt
                            });
                        }

                        window.addEventListener("resize", resizeEventListener);

                        dfd.resolve();
                    }

                    return dfd;
                }

                function close() {
                    if (currentDialog) {
                        currentDialog.close();
                        window.removeEventListener("resize", resizeEventListener);
                    }
                }

                function resizeEventListener() {
                    window.console.log("resizeEventListener");

                    // Kendo has problem with center recalculation.
                    // Sometimes it do not correctly calculate center at first time.
                    rCenter(150, 3);
                }

                function rCenter(timeInterval, attempts) {
                    r(1);

                    function r(i) {
                        if(i > attempts) 
                            return;

                        if (currentDialog) {
                            currentDialog.refresh();
                            currentDialog.center();
                        }

                        setTimeout(function() { 
                            r(i+1);
                        }, timeInterval);
                    }
                }

                /*********************** PUBLIC METHODS *****************************/
                this.open = function (opt) {
                    return open(opt);
                };

                this.close = function () {
                    close();
                };

                // Note!!! This is not a best approach, you should not use recursive refresh if there is exists clear way to center window.
                this.rCenter = function() {
                    rCenter(500, 20);
                };
            }

            /*********************** PUBLIC METHODS *****************************/
            this.createNewDialog = function (dialogOpt) {
                return new Dialog(dialogOpt);
            };
        }).singleton();
}(jQuery, snap, kendo));
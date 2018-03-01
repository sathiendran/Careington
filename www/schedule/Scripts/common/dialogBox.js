//@ sourceURL=dialogBox.js

"use strict";
(function($, snap, kendo) {

    snap.namespace("snap.common").use(["snap.common.contentLoader"])
        .define("dialogBox", function($contentLoader) {
            function DialogBase(dialogOpt) {
                var currentDialog = null,
                    viewModel = null,
                    that = this;

                var buidingCurrentDialog = false, // flag showing that content and vm are loading
                    isOpened = false, // flag that dialog is opened and shown
                    isOpenCancelled = false, // flag to cancel dialog opening (after content and vm loading done)
                    showTimeoutMS = dialogOpt.openTimeout || 500, // timeout value to show dialog (ms)
                    showTimeoutObj = null, // timeout object
                    isResizeEventListenerSet = typeof(dialogOpt.resizeEventListener) === "function";

                function open(opt) {
                    var dfd = $.Deferred();
                    close();

                    if (currentDialog === null) {
                        if (!buidingCurrentDialog) {
                            isOpenCancelled = false;
                            buidingCurrentDialog = true;
                            $contentLoader.bindViewModel(kendo.observable(dialogOpt.vm), dialogOpt.container, dialogOpt.contentPath, dialogOpt.required).done(function(vm) {
                                buidingCurrentDialog = false;
                                viewModel = vm;
                                // If ViewModel contains any non MVVM logic, we will run it here.
                                // Initializes viewmodel when creating dialog
                                if (typeof (viewModel.onDialogCreate) === "function") {
                                    viewModel.onDialogCreate(dialogOpt.container);
                                }
                                
                                var $container = $(dialogOpt.container);
                                $('body').addClass("is-viewport-frozen");
                                currentDialog = $container.children().first();

                                if (dialogOpt.containerClassName) {
                                    currentDialog.addClass(dialogOpt.containerClassName);
                                }

                                if (!dialogOpt.required) {
                                    currentDialog.click(function(e) {
                                        if (e.target === this) {
                                            if (typeof(viewModel.onDialogClose) === "function") {
                                                viewModel.onDialogClose();
                                            }
                                            close();
                                        }
                                    });
                                }
                                // check that dialog opening was not cancelled
                                if (!isOpenCancelled) {
                                    openDialog(currentDialog);
                                }
                            });
                        }
                    } else {
                        openDialog(currentDialog);
                    }

                    function openDialog($container) {
                        if (typeof(viewModel.setOptions) === "function") {
                            viewModel.setOptions({
                                dialog: that,
                                opt: opt
                            });
                        }

                        if (isResizeEventListenerSet) {
                            window.addEventListener("resize", resizeEventListener);
                        }

                        showTimeoutObj = window.setTimeout(function() {
                            if (typeof(dialogOpt.beforeOpenCallback) === "function") {
                                dialogOpt.beforeOpenCallback.apply(that, [$container]);
                            }
                            isOpened = true;
                            $container.addClass("is-active");
                        }, showTimeoutMS);

                        dfd.resolve();
                    }

                    return dfd;
                }

                function reOpen() {
                    if (currentDialog) {
                        isOpened = true;
                        $('body').addClass("is-viewport-frozen");
                        currentDialog.addClass("is-active");

                        if (isResizeEventListenerSet) {
                            window.addEventListener("resize", resizeEventListener);
                        }
                    }
                }

                function close() {
                    if (currentDialog) {
                        $('body').removeClass("is-viewport-frozen");
                        currentDialog.removeClass("is-active");
                        isOpened = false;

                        if (showTimeoutObj) {
                            // cancel dialog showing
                            window.clearTimeout(showTimeoutObj);
                            showTimeoutObj = null;
                        }

                        if (isResizeEventListenerSet) {
                            window.removeEventListener("resize", resizeEventListener);
                        }
                    } else if (buidingCurrentDialog) {
                        // cancel dialog opening
                        isOpenCancelled = true;
                    }
                }

                function resizeEventListener() {
                    window.console.log("resizeEventListener");

                    dialogOpt.resizeEventListener.apply(that, [currentDialog]);
                }


                /*********************** PUBLIC METHODS *****************************/
                this.open = function(opt) {
                    return open(opt);
                };

                this.reOpen = function() {
                    return reOpen();
                };

                this.close = function() {
                    close();
                };

                this.isOpened = function() {
                    return isOpened;
                };

                this.resize = function() {
                    return resizeEventListener();
                };
            }

            function Dialog(dialogOpt) {
                dialogOpt.containerClassName = "landing-dialogbox";

                DialogBase.call(this, dialogOpt);
            }

            function Box(dialogOpt) {
                dialogOpt.containerClassName = "landing-box";
                dialogOpt.openTimeout = 100;
                dialogOpt.required = true; // cant't be closed when clicking out

                DialogBase.call(this, dialogOpt);
            }

            function StickyDialog(dialogOpt) {
                //============copied from template script Prototypes/modules/LandingPage.html=============================
                function stickyBlocks(el) {
                    var windowHeight = el.height(),
                        box = el.find('.js-box'),
                        boxHeight = box.outerHeight(),
                        footer = el.find('.js-box-footer'),
                        footerHeight = footer.outerHeight(),
                        header = el.find('.js-box-header');

                    $('.is-sticky').removeClass('is-sticky');

                    if (boxHeight > windowHeight) {
                        footer.addClass('is-sticky');
                    }

                    el.scroll(function() {
                        var windowScroll = $(this).scrollTop();

                        if (windowScroll > 0) {
                            header.addClass('is-sticky');
                        } else {
                            header.removeClass('is-sticky');
                        }

                        if (document.documentElement.clientWidth > 768) {

                            if (windowScroll + windowHeight >= boxHeight + 24) {
                                footer.removeClass('is-sticky');
                            } else {
                                footer.addClass('is-sticky');
                            }
                        } else {
                            if (windowScroll + windowHeight >= boxHeight) {
                                footer.removeClass('is-sticky');
                            } else {
                                footer.addClass('is-sticky');
                            }
                        }
                    });
                }
                //========================================================================================================


                dialogOpt.resizeEventListener = stickyBlocks;
                dialogOpt.beforeOpenCallback = stickyBlocks;
                dialogOpt.containerClassName = "landing-dialogbox js-box-wrap";

                DialogBase.call(this, dialogOpt);
            }



            /*********************** PUBLIC METHODS *****************************/
            this.createNewDialog = function(dialogOpt) {
                return new Dialog(dialogOpt);
            };

            this.createNewBox = function(dialogOpt) {
                return new Box(dialogOpt);
            };

            this.createNewStickyDialog = function(dialogOpt) {
                return new StickyDialog(dialogOpt);
            };
        }).singleton();
}(jQuery, snap, kendo));
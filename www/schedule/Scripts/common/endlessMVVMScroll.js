//@ sourceURL=endlessMVVMScroll.js

(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common").use([])
        .define("endlessMVVMScroll", function() {

            function BaseDynamicList(opt) {
                var isMultiselect = opt.isMultiselect || false,
                    selectedItems = [],
                    currentFilters = {},
                    htmlContainerId = opt.htmlContainerId,
                    scrollableElementClass = opt.scrollableElementClass, // class of scrolling element (optional). if not set htmlContainerId element is supposed to scroll
                    total = 0,
                    pageSize = opt.pageSize ? opt.pageSize : 20,
                    scrollableElementMultiChildren = opt.scrollableElementMultiChildren, // flag that scrollable element contains other children except container
                    onDataLoad = opt.onDataLoad, // onDataLoad callback (optional)
                    onDataLoading = opt.onDataLoading; // onDataLoading callback (optional)

                var requestDeferred = $.Deferred().resolve();
                var isLoaded = false;

                this.vm_allItems = [];
                this.vm_noResults = false;
                this.vm_isItemsLoading = false;

                //********************* PUBLIC API ******************
                this.load = function() {
                    var that = this;
                    this._reload();

                    var requestInProgress = false;
                    var scrollableElement = scrollableElementClass ? $(htmlContainerId).closest(scrollableElementClass) : $(htmlContainerId);
                    scrollableElement.scroll(function() {
                        var elementHeight;
                        if (scrollableElementMultiChildren) {
                            var otherChildHeight = scrollableElement[0].scrollHeight - $(htmlContainerId).outerHeight();
                            elementHeight = Math.floor((scrollableElement[0].scrollHeight - otherChildHeight) / that.vm_allItems.length);
                        } else {
                            elementHeight = Math.floor(scrollableElement[0].scrollHeight / that.vm_allItems.length);
                        }
                        var loadAdditionItemHeight = Math.floor(pageSize / 3) * elementHeight;

                        if (scrollableElement.scrollTop() + scrollableElement.innerHeight() >= scrollableElement[0].scrollHeight - loadAdditionItemHeight) {
                            if (that.vm_allItems.length >= total) {
                                return false;
                            }

                            if (requestInProgress) {
                                return false;
                            }

                            requestInProgress = true;
                            that._load(pageSize, that.vm_allItems.length).always(function() {
                                requestInProgress = false;
                            });
                        }
                    });

                    if (typeof this._concreteListLoadDetails === "function") {
                        this._concreteListLoadDetails(htmlContainerId);
                    }

                    isLoaded = true;
                };

                this.filters = function(filters) {
                    if (filters) {
                        currentFilters = filters;
                        this._reload();
                    }

                    return currentFilters;
                };

                this.selectAll = function() {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that.selectItem(item);
                    });
                };

                this.unselectAll = function() {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that.unselectItem(item);
                    });
                };

                this.selectItem = function(item) {
                    if (!isMultiselect) {
                        if (selectedItems.length) {
                            // unselect selected item
                            this.unselectItem(selectedItems[0]);
                        }
                        selectedItems = [item];
                    } else {
                        //Ckeck that item not already selected
                        if (snap.util.findIndex(selectedItems, "id", item.id) < 0) {
                            selectedItems.push(item);
                        }
                    }

                    var vmItem = snap.util.findElement(this.vm_allItems, "id", item.id);
                    if (vmItem) {
                        this._selectUiElement(vmItem, true);
                    }
                };

                this.unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);

                    if (index >= 0) {
                        selectedItems.splice(index, 1);
                    }

                    var vmItem = snap.util.findElement(this.vm_allItems, "id", item.id);
                    if (vmItem) {
                        this._selectUiElement(vmItem, false);
                    }
                };

                this.getItemById = function(id) {
                    return snap.util.findElement(this.vm_allItems, "id", id);
                };

                this.selectItemById = function(id) {
                    var uiItem = snap.util.findElement(this.vm_allItems, "id", id);

                    if (uiItem) {
                        this.selectItem(uiItem);
                    }
                };

                this.unselectItemById = function(id) {
                    var uiItem = snap.util.findElement(this.vm_allItems, "id", id);

                    if (uiItem) {
                        this.unselectItem(uiItem);
                    }
                };

                this.getSelectedItems = function() {
                    //clones the array and returns the reference to the new array.
                    return selectedItems.slice();
                };

                this.getVisibleItems = function() {
                    //clones the array and returns the reference to the new array.
                    return this.vm_allItems.slice();
                };

                this.getHtmlContainerId = function() {
                    return htmlContainerId;
                };

                this.isSelectorLoaded = function() {
                    return isLoaded;
                };

                //********************* PRIVATE API ********************
                this._selectAll = function(isSelected) {
                    var that = this;
                    this.vm_allItems.forEach(function(item) {
                        that._selectUiElement(item, isSelected);
                    });
                };

                this._load = function(take, skip) {
                    this.set("vm_isItemsLoading", true);

                    var that = this;

                    if (typeof onDataLoading === "function") {
                        onDataLoading.apply(that);
                    }

                    // we use .done().fail() instead of .then() because .then() returns new promise
                    // but we need an ability to .reject() this promise
                    return this._getData(take, skip).done(function(result) {
                        // We use overrided by kendo push.apply in order to trigger change only once.
                        that.vm_allItems.push.apply(that.vm_allItems, result.data);
                        that.trigger("change", { field: "vm_allItems" });
                        total = result.total;
                        that.set("vm_isItemsLoading", false);

                        if (typeof onDataLoad === "function") {
                            onDataLoad.apply(that);
                        }

                        selectedItems.forEach(function(item) {
                            that._selectUiElement(item, true);
                        });
                    }).fail(function() {
                        that.set("vm_allItems", []);
                    });
                };

                this._reload = function() {
                    if (requestDeferred.state() === "pending") {
                        requestDeferred.reject();
                    }

                    this.vm_allItems = [];
                    total = 0;

                    var that = this;
                    requestDeferred = this._load(pageSize, 0).done(function postLoadAction() {
                        that.set("vm_noResults", that.vm_allItems.length === 0);
                    });
                };
            }

            this.getConstructor = function() {
                return BaseDynamicList;
            };

        }).singleton();
}(jQuery, snap, kendo));

//@ sourceURL=endlessScroll.js

(function ($, snap) {
    "use strict";

    snap.namespace("snap.common").use([])
        .define("endlessScroll", function () {
            function BaseDynamicList(opt) {
                var isMultiselect = opt.isMultiselect || false,
                    selectedItems = [],
                    allItems = [],
                    currentFilters = {},
                    htmlContainerId = opt.htmlContainerId,
                    scrollableElementClass = opt.scrollableElementClass, // class of scrolling element (optional). if not set htmlContainerId element is supposed to scroll
                    total = 0,
                    pageSize = opt.pageSize ? opt.pageSize : 20;

                var requestDeferred =  $.Deferred().resolve();
                var isLoaded = false;
                var isLoading = false;

                //********************* PUBLIC API ******************
                this.load = function() {
                    var that = this;
                    this._reload();

                    var requestInProgress = false;
                    var scrollableElement = scrollableElementClass ? $(htmlContainerId).closest(scrollableElementClass) : $(htmlContainerId);
                    scrollableElement.scroll(function() {
                        var elementHeight = Math.floor(scrollableElement[0].scrollHeight / allItems.length);
                        var loadAdditionItemHeight = Math.floor(pageSize / 3) * elementHeight; 

                        if (scrollableElement.scrollTop() + scrollableElement.innerHeight() >= scrollableElement[0].scrollHeight - loadAdditionItemHeight){
                            if (allItems.length >= total) {
                                return false;
                            } 

                            if(requestInProgress) {
                                return false;
                            }

                            requestInProgress = true;
                            that._load(pageSize, allItems.length).always(function() {
                                requestInProgress = false;
                            });
                        }
                    }); 

                    if(typeof this._concreteListLoadDetails === "function") {
                        this._concreteListLoadDetails(htmlContainerId);
                    }

                    isLoaded = true;
                };

                this.filters = function(filters) {
                    if(filters) {
                        currentFilters = filters;
                        this._reload();
                    }

                    return currentFilters;
                };

                this.selectAll = function() {
                    var that = this;
                    allItems.forEach(function(item) {
                        that.selectItem(item);
                    });
                };

                this.unselectAll = function() {
                    var that = this;
                    allItems.forEach(function(item) {
                        that.unselectItem(item);
                    });
                };

                this.selectItem = function(item) {
                    if(!isMultiselect) {
                        this._selectAll(false);
                        selectedItems = [item];
                    } else {
                        //Ckeck that item not already selected
                        if(snap.util.findIndex(selectedItems, "id", item.id) < 0) {
                            selectedItems.push(item);
                        }
                    }

                    var vmItem = snap.util.findElement(allItems, "id", item.id);
                    if(vmItem) {
                        this._selectUiElement(vmItem, true);
                    }
                };

                this.unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);

                    if(index >= 0) {
                        selectedItems.splice(index, 1);
                    }

                    var vmItem = snap.util.findElement(allItems, "id", item.id);
                    if(vmItem) {
                        this._selectUiElement(vmItem, false);
                    }
                };

                this.getItemById = function(id) {
                    return snap.util.findElement(allItems, "id", id);
                };

                this.selectItemById = function(id) {
                    var uiItem = snap.util.findElement(allItems, "id", id);

                    if(uiItem) {
                        this.selectItem(uiItem);
                    }
                };

                this.unselectItemById = function(id) {
                    var uiItem = snap.util.findElement(allItems, "id", id);

                    if(uiItem) {
                        this.unselectItem(uiItem);
                    }
                };

                this.getSelectedItems = function() {
                    //clones the array and returns the reference to the new array.
                    return selectedItems.slice();
                };

                this.getVisibleItems = function() {
                    //clones the array and returns the reference to the new array.
                    return allItems.slice();
                };

                this.getHtmlContainerId = function() {
                    return htmlContainerId;
                };

                this.isSelectorLoaded = function() {
                    return isLoaded;
                };

                this.isLoading = function() {
                    return isLoading;
                };
                //********************* PRIVATE API ********************
                this._selectAll = function(isSelected) {
                    var that = this;
                    allItems.forEach(function (item) {
                        that._selectUiElement(item, isSelected);
                    });
                };

                this._load  = function(take, skip) {
                    this._isLoading(true);

                    var that = this;
                    return this._getData(take, skip).done(function(result) {
                        allItems = allItems.concat(result.data);
                        total = result.total;
                        that._isLoading(false);

                        var html = that._renderHtml(result.data);
                        $(htmlContainerId).append(html);

                        selectedItems.forEach(function(item) {
                            that._selectUiElement(item, true);
                        });
                    });
                };

                this._reload = function() {
                    if(requestDeferred.state() === "pending") {
                        requestDeferred.reject();    
                    }
                    
                    allItems = [];
                    total = 0;
                    $(htmlContainerId).empty();

                    var that = this;
                    requestDeferred = this._load(pageSize, 0).done(function postLoadAction() {
                        if(allItems.length > 0) {
                            if(typeof that._getHeaderHtml === "function") {
                                $(htmlContainerId).prepend(that._getHeaderHtml());
                            }
                        } else {
                            // There is no item, need to show "no item" message.
                            $(htmlContainerId).prepend(that._getItemsNotFoundHtml());
                        }
                    });
                };

                this._renderHtml = function(items) {
                    var template = this._getItemTemplate();

                    var arr = items.map(function(item) {
                        return template(item);
                    });

                    return arr.join("");
                };

                this._isLoading = function(isDataLoading) {
                    isLoading = isDataLoading;
                    var $loader = $(htmlContainerId).siblings();
                    if(isLoading) {
                        $loader.addClass("is-active");
                    } else {
                        $loader.removeClass("is-active");
                    }
                };
            }

            this.getConstcurtor = function() {
                return BaseDynamicList;
            };
        }).singleton();
}(jQuery, snap));
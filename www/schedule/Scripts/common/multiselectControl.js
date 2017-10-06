//@ sourceURL=multiselectControl.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.common")
        .define("multiselectControl", function () {
            var $control = this;

            var popupMinHeight = "42px";

            this.events = {
                itemAdded: "multiselectControl_itemAdded",
                matchItemsLengthChanged: "multiselectControl_matchItemsLengthChanged",
                selectedItemChanged: "multiselectControl_selectedItemChanged"
            };

            function MultiselectControl(opt) {
                var _itemConstructor = opt.constructor;
                var _selector = opt.selector;

                var $scope = this,
                    kendoAutoComplete,
                    selectedItems = [],
                    eventList = {};


                var triggerEvent = function(name) {
                    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                    var eventCbList = eventList[name];
                    if (eventCbList) {
                        $.each(eventCbList, function() {
                            return this.apply($scope, args);
                        });
                    }
                };
           

                this.selectedItem = null;
                this.vm_noResults = false;

                this.on = function (eventName, cb) {
                    var eventCbList = eventList[eventName];
                    if (!eventCbList) {
                        eventCbList = [];
                    }
                    eventCbList.push(cb);
                    eventList[eventName] = eventCbList;
                };

                this.dataSource = opt.dataSource || [];

                this._popup = null;
                this._header = null;
                this._reloadOnTypeTimer = null;

                var itemSelected = function (item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);
                    return index >= 0;
                };

                this._onFilter = function(e) {
                    e.preventDefault(); // prevent filtering
                    var filter = e.filter;
                    if (this._reloadOnTypeTimer) {
                        window.clearTimeout(this._reloadOnTypeTimer);
                        this._reloadOnTypeTimer = null;
                    }
                    // Postpone data reloading until the end of typing
                    this._reloadOnTypeTimer = window.setTimeout(function() {
                        kendoAutoComplete.dataSource.filter(filter);
                    }, 300);
                };

                this.createFilteringDataSource = function(dataUrl, dataIdField, dataReadFilter) {
                    var doMakeFilter = dataReadFilter && dataReadFilter.call;
                    var idFieldName = dataIdField || "id";
                    this.dataSource = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: dataUrl,
                                dataType: "json"
                            },
                            parameterMap: function (data, type) {
                                if (doMakeFilter && type === "read") {
                                    return new dataReadFilter(data.filter);
                                }
                            }
                        },
                        schema: {
                            data: function (response) {
                                var data = response.data.filter(function(item) {
                                    return !itemSelected(item);
                                });
                                $scope.set("vm_noResults", data.length === 0);
                                triggerEvent($control.events.matchItemsLengthChanged, {data: data.length});
                                return data;
                            },
                            id: idFieldName 
                        }
                    });
                };

                var unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);
                    if (index >= 0) {
                        selectedItems.splice(index, 1);
                    }
                };

                this.addItem = function(item) {
                    selectedItems.push(item);
                    $scope.refreshItems();
                    triggerEvent($control.events.itemAdded, {data: item});
                };

                this._created = function() {
                    $scope = this;
                };

                this.load = function() {
                    if (!_selector && $(_selector).length) {
                        return;
                    }
                    var inputEl = $("input", $(_selector));
                    if (inputEl.length) {
                        kendoAutoComplete = inputEl.data("kendoAutoComplete");
                        if (kendoAutoComplete) {
                            kendoAutoComplete.options.delay = 0; // no delay for showing results
                            kendoAutoComplete.bind("filtering", function(e) {
                                $scope._onFilter.apply($scope, [e]);
                            });

                            $scope._popup = kendoAutoComplete.popup;
                            $scope.on($control.events.matchItemsLengthChanged, function(e) {
                                var dataLength = e.data;
                                if (dataLength && !$scope._popup.visible() && inputEl.is(':focus')) {
                                    // open popup with search results
                                    $scope._popup.open();
                                }
                            });
                        }
                    }
                };

                this.vm_selectedItems = function() {
                    var convertedItems = [];
                    selectedItems.forEach(function(item) {
                        var el =  new _itemConstructor(item, function() {
                            unselectItem(el);
                            $scope.refreshItems();
                        });
                        el = kendo.observable(el);
                        convertedItems.push(el);
                    });
                    return convertedItems;
                };

                this.containsBy = function(field, fieldName) {
                    return snap.util.findIndex(selectedItems, fieldName, field) >= 0;
                };

                this.getSelectedItems = function() {
                    return selectedItems.slice();
                };

                this.refreshItems = function() {
                    this.trigger("change", {field: "vm_selectedItems"});
                };

                this.vm_onChangeSelectedItem = function() {
                    if (typeof this.selectedItem === "object") {
                        this.addItem(this.selectedItem);
                    }
                    this.set("selectedItem", null);
                    this.set("vm_noResults", false);
                    triggerEvent($control.events.selectedItemChanged, {data: this.selectedItem});
                };
            }
            
            this.createNew = function(opt) {
                var control = kendo.observable(new MultiselectControl(opt));
                control._created();
                return control;
            };

        }).singleton();

}(jQuery, snap, kendo));

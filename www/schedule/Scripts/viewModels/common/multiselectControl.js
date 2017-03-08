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

                var $scope = this;
                var selectedItems = [];

                this.selectedItem = null;
                this.vm_noResults = false;
                this.dataSource = opt.dataSource || [];

                this._popup = null;
                this._header = null;

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
                                $scope.trigger($control.events.matchItemsLengthChanged, {data: data.length});
                                return data;
                            },
                            id: idFieldName 
                        }
                    });
                };

                var itemSelected = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);
                    return index >= 0;
                };
                
                var unselectItem = function(item) {
                    var index = snap.util.findIndex(selectedItems, "id", item.id);
                    if (index >= 0) {
                        selectedItems.splice(index, 1);
                    }
                };

                var addItem = function(item) {
                    selectedItems.push(item);
                    $scope.refreshItems();
                    $scope.trigger($control.events.itemAdded, {data: item});
                };

                this.load = function() {
                    $scope = this;
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
                        addItem(this.selectedItem);
                    }
                    this.set("selectedItem", null);
                    this.set("vm_noResults", false);
                    this.trigger($control.events.selectedItemChanged, {data: this.selectedItem});
                };

                this.initNoDataMessage = function(kendoAutoComplete) {
                    // it implements using header template to emulate noDataTemplate work
                    // this fix was made because kendo noDataTemplate does not work
                    // if you don't invoke this method multiselect works as usual without showing noData message

                    if (kendoAutoComplete.popup && kendoAutoComplete.header) {
                        this._popup = kendoAutoComplete.popup;
                        this._header = kendoAutoComplete.header;

                        this._popup.bind("close", function(e) {
                            if ($scope.vm_noResults) {
                                // prevent closing
                                e.preventDefault();
                            }
                        });

                        this.bind($control.events.matchItemsLengthChanged, function(e) {
                            var dataLength = e.data;
                            if (dataLength) {
                                // hide noData message
                                $scope._header.hide();
                            } else {
                                // show noData message and open popup if it is closed
                                $scope._header.show();
                                // adjust size
                                $scope._popup.element.css("height", popupMinHeight);
                                if (!$scope._popup.visible()) {
                                    $scope._popup.open();
                                }
                            }   
                        });

                        this.bind($control.events.selectedItemChanged, function() {
                            // when we select item or just leave input, hide noData message and close popup
                            $scope._popup.close();
                            $scope._header.hide();
                        });
                    }
                };
            }
            
            this.createNew = function(opt) {
                var control = kendo.observable(new MultiselectControl(opt));
                control.load();
                return control;
            };

        }).singleton();

}(jQuery, snap, kendo));

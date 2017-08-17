// Todo: Provide a comment indicating what this file is for.

var snap = snap || {};
snap.dataSource = snap.dataSource || {};


(function () {
    snap.dataSource.codeSetDataSourceWrapper = function (codeSetsList) {
        this._codeSetsList = codeSetsList || [];
        this._firstRun = true;
        this._codeSetsItems = [];
        this._codeSetsLoadingPromise = $.Deferred();
    };
    snap.dataSource.codeSetDataSourceWrapper.prototype = {
        _codeSetItems: [],
        _codeSetsList: [],
        _firstRun: false,
        _codeSetsLoadingPromise: $.Deferred(),
        _readCodeSets: function (hospitalId) {
            var ds = this;
            if (ds._firstRun) {
                ds._firstRun = false;
 $('<link/>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: 'css/styles.v3.less.dynamic.css'
                }).appendTo('head');
                var head = util.getHeaders();
 debugger;
                $.ajax({
                    url: snap.baseUrl + "/api/v2/codesets",
                    type: "GET",
                    data: {
                        hospitalId: hospitalId,
                        fields: ds._codeSetsList.join(',')
                    },
					headers: head

                }).done(function (resp) {
                    ds._codeSetItems = resp.data;
                    ds._codeSetsLoadingPromise.resolve(ds._codeSetItems);
                }).fail(function () {
                    ds._codeSetsLoadingPromise.reject();
                });
            }
            return ds._codeSetsLoadingPromise.promise();
        },
        _sortCodeSets : function(codes){
            return codes.sort(function (a, b) {
                return a.displayOrder - b.displayOrder;
            });
        },
        _getCodeSetData: function (codeSetName, hospitalId) {
            var ds = this;
            var readPromise = $.Deferred();
            this._readCodeSets(hospitalId).done(function (data) {
                var set = data.find(function (item) {
                    return item.name.toLowerCase().indexOf(codeSetName) > -1;
                });
                if (set && set.codes) {
                    var codes = ds._sortCodeSets(set.codes);
                    readPromise.resolve(codes);
                } else {
                    readPromise.resolve([]);
                }

            }).fail(function (error) {
                readPromise.reject(error);
            });
            return readPromise.promise();
        },

        getItemIdByName: function (codeSetName, hospitalId, requestedName) {
            var def = $.Deferred();
            var ds = this;
            ds._getCodeSetData(codeSetName, hospitalId).done(function (data) {
                var requestedNameLC = requestedName.toLowerCase();
                for (var i = 0, l = data.length; i < l; i++) {
                    if (data[i].text.toLowerCase().indexOf(requestedNameLC) > -1) {
                        def.resolve(data[i].codeId);
                        break;
                    }
                }
                if (def.state() === "pending") {
                    def.resolve(null);
                }

            });

            return def.promise();
        },

        getCodeSetDataSourceReplacingNames: function (codeSetName, hospitalId, replaceNames, replaceByObjects, keepId) {
            var ds = this;
            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        ds._getCodeSetData(codeSetName, hospitalId).done(function (data) {
                            var lastInOrder = data.length ? data[data.length - 1].displayOrder : 0;
                            var filteredData = (replaceNames && replaceNames.length > 0 && replaceByObjects
                                && replaceByObjects.length === replaceNames.length) ? (data.map(function (item) {
                                    var itemText = item.text.toLowerCase();
                                    for (var i = 0, l = replaceNames.length; i < l; i++) {
                                        if (itemText.indexOf(replaceNames[i].toLowerCase()) > -1) {
                                            if (keepId) {
                                                return $.extend({}, replaceByObjects[i], { displayOrder: lastInOrder + i + 1 }, { codeId: item.codeId });
                                            } else{
                                                return $.extend({}, replaceByObjects[i], { displayOrder: lastInOrder + i + 1 });
                                            }
                                        }
                                    }
                                    return item;
                                })) : data;
                            filteredData = ds._sortCodeSets(filteredData);
                            options.success({ data: filteredData, total: filteredData.length });
                        }).fail(function (error) {
                            options.error(error);
                        });
                    }
                },
                schema: {
                    id: "codeId",
                    data: "data",
                    total: "total"
                }
            });
        },
        getCodeSetDataSourceAddingObjects: function (codeSetName, hospitalId, objectsToAdd, namesToRemove) {
            var ds = this;
            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        ds._getCodeSetData(codeSetName, hospitalId).done(function (data) {
                            var filteredData = data;
                            if (typeof (namesToRemove) !== "undefined") {
                                namesToRemove.forEach(function (name) {
                                    var nameLC = name.toLowerCase();
                                    filteredData = filteredData.filter(function (item) {
                                        return item.text.toLowerCase().indexOf(nameLC) === -1;
                                    });
                                });
                            }
                            filteredData = filteredData.concat(objectsToAdd);

                            options.success({ data: filteredData, total: filteredData.length });
                        }).fail(function (error) {
                            options.error(error);
                        });
                    }
                },
                schema: {
                    id: "codeId",
                    data: "data",
                    total: "total"
                }
            });
        },
        getCodeSetDataSource: function (codeSetName, hospitalId) {
            var ds = this;
            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        ds._getCodeSetData(codeSetName, hospitalId).done(function (data) {
                            options.success({ data: data, total: data.length });
                        }).fail(function (error) {
                            options.error(error);
                        });
                    }
                },
                schema: {
                    id: "codeId",
                    data: "data",
                    total: "total"
                }
            });
        }

    };
}());

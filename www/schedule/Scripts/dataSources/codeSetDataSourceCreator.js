// Todo: Provide a comment indicating what this file is for.

var snap = snap || {};
snap.dataSource = snap.dataSource || {};


(function() {
    snap.dataSource.codeSetDataSourceWrapper = function(codeSetsList) {
        this._codeSetsList = codeSetsList || [];
        this._firstRun = true;
    };
    snap.dataSource.codeSetDataSourceWrapper.prototype = {
        _codeSetItems: [],
        _codeSetsList: [],
        _firstRun: false,
        _codeSetsLoadingPromise: $.Deferred(),
        _readCodeSets: function(hospitalId) {
            var ds = this;
            if (ds._firstRun) {
                ds._firstRun = false;
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

                }).done(function(resp) {
                    ds._codeSetItems = resp.data;
                    ds._codeSetsLoadingPromise.resolve(ds._codeSetItems);
                }).fail(function() {
                    ds._codeSetsLoadingPromise.reject();
                });
            }
            return ds._codeSetsLoadingPromise.promise();
        },
        _getCodeSetData: function(codeSetName, hospitalId) {
            var readPromise = $.Deferred();

            this._readCodeSets(hospitalId).done(function(data) {
                var codes = [];
                var set = data.find(function(item) {
                    return item.name.toLowerCase().indexOf(codeSetName) > -1;
                });
                if (set && set.codes) {
                    codes = set.codes.sort(function(a, b) {
                        return a.displayOrder - b.displayOrder;
                    });
                    readPromise.resolve(codes);
                } else {
                    readPromise.reject();
                }

            }).fail(function() {
                readPromise.reject();
            });
            return readPromise.promise();
        },

        getItemIdByName: function(codeSetName, hospitalId, requestedName) {
            var def = $.Deferred();
            var ds = this;
            ds._getCodeSetData(codeSetName, hospitalId).done(function(data) {
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

        getCodeSetDataSourceReplacingNames: function(codeSetName, hospitalId, replaceNames, replaceByObjects) {
            var ds = this;
            return new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        ds._getCodeSetData(codeSetName, hospitalId).done(function(data) {
                            var filteredData = (replaceNames && replaceNames.length > 0 && replaceByObjects &&
                                replaceByObjects.length === replaceNames.length) ? (data.map(function(item) {
                                var itemText = item.text.toLowerCase();
                                for (var i = 0, l = replaceNames.length; i < l; i++) {
                                    if (itemText.indexOf(replaceNames[i].toLowerCase()) > -1) {
                                        return $.extend({}, replaceByObjects[i]);
                                    }
                                }
                                return item;
                            })) : data;
                            options.success(filteredData);
                        }).fail(function() {
                            options.error();
                        });
                    }
                },
                schema: {
                    id: "codeId"
                }
            });
        },

        getCodeSetDataSource: function(codeSetName, hospitalId) {
            var ds = this;
            return new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        ds._getCodeSetData(codeSetName, hospitalId).done(function(data) {
                            options.success(data);
                        }).fail(function() {
                            options.error();
                        });
                    }
                },
                schema: {

                    id: "codeId"
                }
            });
        }

    };
}());

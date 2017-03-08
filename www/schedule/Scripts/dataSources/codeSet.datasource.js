//@ sourceURL=codeSet.datasource.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.dataSources").use([])
        .define("codeSetDataSource", function () {
            this.create = function (hospitalId, codeSetName) {
                return new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/v2/codesets",
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get",
                            data: {
                                hospitalId: hospitalId,
                                fields: [codeSetName]
                            }
                        }
                    },
                    schema: {
                        data: function(codeSet) {
                            return codeSet.data[0].codes;
                        },
                        total: function(codeSet) {
                            return codeSet.data[0].codes.length;
                        }
                    }
                });
            };
        }).singleton();
}(jQuery, snap, kendo));
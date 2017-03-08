var snap = snap || {};
function addGroupingToTimeZone(data) {
    var x = new Date();
    var displaytz = "GMT";
    var currentTimeZoneOffsetInHours = (x.getTimezoneOffset() / 60);
    if (snap.dateValidation.isDST(x))
        currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours + 1;
    if (currentTimeZoneOffsetInHours > 0) {
        if (currentTimeZoneOffsetInHours < 10)
            displaytz = displaytz + '-0' + currentTimeZoneOffsetInHours;
        else
            displaytz = displaytz + '-' + currentTimeZoneOffsetInHours;
    }
    else {
        if (currentTimeZoneOffsetInHours < -9)
            displaytz = displaytz + '+0' + currentTimeZoneOffsetInHours * -1;
        else
            displaytz = displaytz + '+' + currentTimeZoneOffsetInHours * -1;
    }

    for (var i = 0; i < data.length; i++) {
        //if (data[i].name.indexOf(displaytz) !== -1) {
        //     data[i].tzGroup = "0Your Browser";
        //     data[i].tzSort = "0";
        // }
        //else
        if ((data[i].id === 75) || (data[i].id === 80) || (data[i].id === 74)
         || (data[i].id === 77) || (data[i].id === 82) || (data[i].id === 83)
         || (data[i].id === 85) || (data[i].id === 86) || (data[i].id === 87)) {
            data[i].tzGroup = "1United States";
            data[i].tzSort = "1";
        }
        else if ((data[i].id === 2) || (data[i].id === 4)) {
            data[i].tzGroup = "2United Kingdom";
            data[i].tzSort = "2";
        }
        else {
            data[i].tzGroup = "3Global";
            data[i].tzSort = "3";
        }
    }
}
if (!snap.dataSource) {
    snap.dataSource = {};
}
(function () {
    snap.dataSource.getApiUrl = function (path) {
        return "/api/" + path;
    };
    snap.dataSource.getTimeZones = function () {
        return new kendo.data.DataSource({
            transport: {
                read: {
                    url: [snap.baseUrl, '/api/v2/timezones'].join(''),
                    dataType: "json"
                }
            },
            group: { field: "tzGroup", dir: "asc" },
            sort: { field: "id", dir: "asc" },
            schema: {
                model: {
                    fields: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        tzGroup: {
                            type: 'string',
                            sortable: {
                                compare: function (a, b) {
                                    return data[a.tzSort] - data[b.tzSort];
                                }
                            }
                        },
                        tzSort: { type: 'number' }
                    }
                },
                data: function (response) {
                    var data = response.data;
                    addGroupingToTimeZone(data);
                    return data;
                },
                id: "id"
            }

        });
    };
    
    snap.dataSource.Common = kendo.data.DataSource.extend({
        init: function (options) {
            options = $.extend({
                // Dir for all api will be  "/api/v1/"
                transport: {
                    read: {
                        beforeSend: this.beforeSend
                    }
                },
                schema: {
                    /*
                    data: "data",
                    errors: function (response) {
                        return response.message
                        //return response.success ? null : response.message // twitter's response is {"success":"false", "message": "Invalid query" }
                    }
                    */
                },
                error: function (e) {
                    if (e.xhr.status == 401) {
                        snapError("Data loading failure");
                    }
                    else {
                        snapError("Data loading failure");
                        console.error(e.xhr.responseText);
                    }
                    
                }
            }, options);
            kendo.data.DataSource.fn.init.call(this, options);
        }
    });

}());

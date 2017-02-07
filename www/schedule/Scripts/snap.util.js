// Ajax and logging utilities. Please keep things object-oriented.

var snap = snap || {};

$.extend(snap,
{
    util: {}
});

$.extend(snap.util,
{
    logToConsole: function (xhr, src) {
        console.log("Status " + xhr.status + " received by " + src + " call.");
        if (xhr.responseText) {
            var ex = JSON.parse(xhr.responseText);
            if (ex.Message) {
                console.log(ex.Message);
            }
        }
    },

    apiAjaxRequest: function (uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
        }).fail(function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = snap.patientLogin();
            }
            if (!snap.userAborted(xhr)) {
                if (xhr.status == 0 && xhr.readyState == 0) {
                    snapInfo("Internet connection lost.");
                }
                console.log(error);
            }
        });
    },
    objectExits: function (obj/*,'a.b'*/) {
        var a = arguments, b = a.callee;
        if (a[1] && ~a[1].indexOf('.'))
            return b.apply(this, [obj].concat(a[1].split('.')));

        return a.length == 1 ? a[0] : (obj[a[1]] && b.apply(this, [obj[a[1]]].concat([].slice.call(a, 2))));
    },
    disableTab: function (tabId) {
        var tab = $('#patientContainer nav li.' + tabId);
        if (tab != null && !tab.hasClass('disabled')) {
            tab.addClass('disabled').removeAttr('data-tab');
        }
    },

    findIndex: function (array, keyPropertyName, key) {
        var index = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i][keyPropertyName] === key) {
                index = i;
                break;
            }
        }

        return index;
    },

    findElement: function (array, keyPropertyName, key) {
        var result = null;
        var index = this.findIndex(array, keyPropertyName, key);
        if (index > -1) {
            result = array[index];
        }

        return result;
    },

    arrayContains: function(array, subArray, keyPropertyName) {
        var containsAll = true;
        for(var i = 0; i < subArray.length; i++) {
            if(snap.util.findIndex(array, keyPropertyName, subArray[i][keyPropertyName]) < 0) {
                containsAll = false;
                break;
            }
        }

        return containsAll;
    }



});
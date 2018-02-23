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
        }).fail(function (xhr) {
            if (xhr.status == 401) {
              //  window.location = snap.patientLogin();
            //  window.location.href = snap.redirctPage;
            //  window.location.reload(true);
            }
            if (!snap.userAborted(xhr) && xhr.status == 0 && xhr.readyState == 0) {
              //  snapInfo("Internet connection lost.");
                  navigator.notification.alert(
                      snap.alertInternetConnection, //'No Internet Connection.', // message
                      function() {
                          // window.location.href = snap.redirctPage;
                          // window.location.reload(true);
                      },
                      snap.appName, // title
                      snap.sessAlertDone //'Done' // buttonName
                  );
                  return false;
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

    findElement: function (array, keyPropertyName, key) {
        var result = null;
        var index = this.findIndex(array, keyPropertyName, key);
        if (index > -1) {
            result = array[index];
        }

        return result;
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

    arrayContains: function(array, subArray, keyPropertyName) {
        var containsAll = true;
        for(var i = 0; i < subArray.length; i++) {
            if(snap.util.findIndex(array, keyPropertyName, subArray[i][keyPropertyName]) < 0) {
                containsAll = false;
                break;
            }
        }

        return containsAll;
    },

    processResponsesAsSingle: function() {
        var dfd = $.Deferred();
        $.when.apply(this, arguments).done(function() {
            var responses = Array.prototype.slice.call(arguments);
            var data = [];
            var total = 0;
            responses.forEach(function(response) {
                data = data.concat(response[0].data);
                total += response[0].total || response[0].data.length;
            });
            dfd.resolve({data: data, total: total});
        });
        return dfd.promise();
    }

});


/* Examples: 
        Get all patients profile:
            GET /api/v2/patients/profiles
            [URL] /api/v2/patients/profiles

        Get a patient's profile: 
            GET /api/v2/patients/profiles/1234
            [URL] /api/v2/patients/profiles/{id}

        Create a new dependent record:
            POST /api/v2/patients/profiles/1234/dependents
            [URL] /api/v2/patients/profiles/{id}/dependents
*/

var snap = snap || {};

snap.ApiRequest = (function() {
    var defaults = {
        usedDefaultErrorHandler: true,
        loginPageUrl: snap.patientLogin()
    };

    function ajax(url, method, data) {
        return $.ajax({
            type: method,
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null

        });
    }

    function addDefaultErrorHandler(request, info) {
        request.fail(function (xhr, status, error) {
            if (xhr.status == 401) {
                var message = "You dont have role function";

                if (info && info.action) {
                    message += " for " + info.action + ".";
                }

                if (info && info.roleFunction) {
                    message += " Role function: " + info.roleFunction;
                }

                snapError(message);
            }
            if (!snap.userAborted(xhr)) {
                if (xhr.status == 0 && xhr.readyState == 0) {
                    snapInfo("Internet connection lost.");
                }
                console.log(error);
            }
        });
    }

    // constructor
    var module = function (options) {
        this.options = $.extend( {}, defaults, options) ;
    };


    // prototype
    module.prototype = {
        constructor: module,
        
        get: function (url, info) {
            return this.apiRequest(url, "GET", null, info);
        },

        post: function (url, data, info) {
            return this.apiRequest(url, "POST", data, info);
        },

        delete: function (url, data, info) {
            return this.apiRequest(url, "DELETE", data, info);
        },

        put: function (url, data, info) {
            return this.apiRequest(url, "PUT", data, info);
        },

        formatUrl: function (url, id) {
            if (id) {
                url = url.replace("{id}", id);
            }

            return url;
        },

        apiRequest: function (url, method, data, info) {
            var request = ajax(url, method, data);

            if (this.options.usedDefaultErrorHandler) {
                addDefaultErrorHandler(request, info);
            }

            return request;
        }
    };

    return module;
})();



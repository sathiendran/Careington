;
(function($, snap) {
    "use strict";
    snap.namespace("snap").use("SnapNotification")
        .define("errorHandler", function($snapNotification) {

            var getMessage = function(opt) {
                var xhr = opt.xhr, // an error xhr object
                    action = opt.action, // performed action name
                    roleFunction = opt.roleFunction, // role function, necessary for the action. is shown when 401 Unauthorized comes
                    defaultMessage = opt.defaultMessage, // a message that is shown if xhr is empty or xhr parsing failed
                    concatMessage = opt.concatMessage; // a message that is concatinated with parsed error message
                
                var errorMessage = "",
                    infoMessage = "",
                    includeActionNameToMsg = true; // flag to include action name to message

                if (xhr) {
                    // check xhr status code
                    if (xhr.status === 401) {
                        var unpermittedText = roleFunction ? roleFunction.toLowerCase() : (action ? action.toLowerCase() : "perform this action");
                        errorMessage = "You do not have sufficient permissions to " + unpermittedText + ". " + 
                            "Please contact your system administrator for assistance";
                        includeActionNameToMsg = false; // no need to include action name in this case
                    } else if (xhr.status === 404) {
                        errorMessage = "Resource not found";
                    } else if (xhr.status === 500) {
                        errorMessage = "Internal Server error";
                    } else if (xhr.status === 0 && xhr.readyState === 0) {
                        infoMessage = snap.userAborted(xhr) ? "Request is aborted" : "Internet connection is lost.";
                        return {
                            infoMessage: infoMessage
                        };
                    }

                    if (!errorMessage) {
                        // check xhr response and status text
                        if (typeof(xhr.responseJSON) === "object" && xhr.responseJSON.message) {
                            errorMessage = xhr.responseJSON.message;
                        } else if (xhr.responseText) {
                            var responseJSON;
                            try {
                                responseJSON = JSON.parse(xhr.responseText);
                            } catch (err) {
                                responseJSON = {};
                            }
                            errorMessage = responseJSON.message || xhr.responseText;
                        } else if (xhr.statusText) {
                            errorMessage = xhr.statusText;
                        }
                    }
                }

                if (!concatMessage && action && includeActionNameToMsg) {
                    // if no additional message provided, use action name
                    concatMessage = "Failed to " + action + ".";
                }

                if (errorMessage) {
                    // if concatMessage is provided, include it
                    errorMessage = concatMessage ? concatMessage + '\n' + errorMessage : errorMessage;
                } else {
                    // if errorMessage is not still defined, show some default message
                    errorMessage = errorMessage || defaultMessage || concatMessage || "An error occured";
                }

                return {
                    errorMessage: errorMessage
                };
            };

            this.getErrorMessage = function(opt) {
                var message = getMessage(opt);
                return message.errorMessage || message.infoMessage;
            }

            this.processError = function(opt) {
                var message = getMessage(opt);
                if (message.errorMessage) {
                    var messageLines = message.errorMessage.split('\n');
                    $snapNotification.error(messageLines.join("<br>"));
                } else if (message.infoMessage) {
                    $snapNotification.info(message.infoMessage);
                }
            };

            this.getProfileDisabledReason = function(getProfileError) {
                var errorMessage = "Profile was not found";
                if (getProfileError) {
                    if (getProfileError.responseText) {
                        try {
                            var responseJSON = JSON.parse(getProfileError.responseText);
                            errorMessage = responseJSON.message;
                        } catch (err) {
                            errorMessage = getProfileError.responseText;
                        }
                    } else if (getProfileError.status === 404) {
                        errorMessage = "Profile was not found";
                    } else if (getProfileError.status === 401) {
                        errorMessage = "You are not authorized to manage requested profile";
                    } else {
                        errorMessage = "Failed to load profile details";
                    }
                }
                return errorMessage;
            };

        }).singleton();
}(jQuery, window.snap = window.snap || {}));
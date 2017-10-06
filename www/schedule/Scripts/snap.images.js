function getDefaultProfileImageForClinician(gender) {
    var Male = gender === "M" ? "/images/Doctor-Male.gif" : "/images/default-user.jpg";
    return gender === "F" ? "/images/Doctor-Female.gif" : Male;
}

function isDefaultProfileImageForClinician(imageUrl) {
    return imageUrl === "/images/Doctor-Male.gif"
        || imageUrl === "/images/Doctor-Female.gif"
        || imageUrl === "/images/default-user.jpg";
}

function getDefaultProfileImageForPatient(gender) {
    var Male = gender === "M" ? "/images/Patient-Male.gif" : "/images/default-user.jpg";
    return gender === "F" ? "/images/Patient-Female.gif" : Male;
}

function isDefaultProfileImageForPatient(imageUrl) {
    return imageUrl === "/images/Patient-Female.gif"
        || imageUrl === "/images/Patient-Male.gif"
        || imageUrl === "/images/default-user.jpg";
}


var ProfileImageUploader;
var ImagesHelper = {};

(function () {
    var uploadMaxSizeBytes = 4194304;

    var uploadUrlPrefixes = {
        "patient": snap.baseUrl + "/api/v2.1/patients/profile-images?patientId=",
        "clinician": snap.baseUrl + "/api/v2.1/clinicians/profile-images?clinicianUserId=",
        "provider": snap.baseUrl + "/api/v2.1/providers/profile-images?hospitalId=",
        "image": snap.baseUrl + "/api/v2.1/images"
    };

    /// image dialog box section ↓

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }
    

    ImagesHelper.composeUploadUrl = function (uploadType, userId) {
        var id = userId || '';
        return uploadUrlPrefixes[uploadType] + id;
    }

    ImagesHelper.sendImageToServer = function(base64Image, uploadUrl) {
        var imageData = dataURItoBlob(base64Image);
        var formData = new FormData();
        formData.append('filename', imageData, 'png');

        var userSession = snap.userSession;

        var headers = {
            "Authorization": "Bearer " + userSession.token,
            "X-Api-Session-Id": userSession.apiSessionId,
        };

        var dfd = jQuery.Deferred();

        $.ajax({
            type: 'POST',
            url: uploadUrl,
            headers: headers,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (data) {
            dfd.resolve(data.data[0].uri);

        }).fail(function (err) {
            dfd.reject(err);

            var notifications = snap.resolveObject("snap.SnapNotification");
            if (notifications) {
                notifications.error(err.responseText);
            }
            
            console.error(err);
        });

        return dfd.promise();
    }

    ImagesHelper.isDataUri = function (dataURI) {
        return  dataURI.split(',')[0].indexOf('base64') >= 0;
    }

    ImagesHelper.openImageDialog = function (resolveCallback, rejectCallback, toggleUiSpinner) {
        // Tony.y: the problem is that we have "old" and "new" styles, we can't append new styles to old pages, so one of possible ways is to upload pictures via iframe dialog
        var templatePath = "/content/shared/DialogboxProfilePicture.html";

        var dialogBoxElement = document.createElement('iframe');
        var dialogBoxId = 'profilePhotoUpload';

        dialogBoxElement.id = dialogBoxId;
        dialogBoxElement.src = templatePath;
        dialogBoxElement.style.position = 'fixed';
        dialogBoxElement.style.top = '0';
        dialogBoxElement.style.left = '0';
        dialogBoxElement.style.width = '100%';
        dialogBoxElement.style.height = '100%';
        dialogBoxElement.style.zIndex = '100';

        // add spinner here
        if ( typeof toggleUiSpinner !== 'undefined') {
            toggleUiSpinner();
        }

        if (dialogBoxElement.addEventListener)
            dialogBoxElement.addEventListener("load", loaded, false);
        else
            dialogBoxElement.attachEvent("onload", loaded);

        document.body.appendChild(dialogBoxElement);

        function closeIframe() {
            dialogBoxElement.parentElement.removeChild(dialogBoxElement);
        }

        function showErrorMsg(errMsg) {
            var $snapNotification = snap.resolveObject("snap.SnapNotification");
            $snapNotification.error(errMsg);
        }

        function loaded() {
            if (typeof toggleUiSpinner !== 'undefined') {
                toggleUiSpinner();
            }
            
            this.contentDocument.resolve = resolveCallback ? resolveCallback : function () { console.log('no callback function for change picture event'); }
            this.contentDocument.reject = rejectCallback ? rejectCallback : function () { console.log('no callback function for reject event'); }
            this.contentDocument.closeIframe = closeIframe;
            this.contentDocument.showErrorMsg = showErrorMsg;
        };

        return dialogBoxElement;
    };

    /// end of image dialog box section ↑

    ProfileImageUploader = function ($inputSelector, uploaderType, autoUploadEnabled, profileId, onImageSelected, onImageUploaded) {
        var uploaderInstance = this;

        // we pass selectorString instead of jQuery element
        // because kendoUpload re-renders
        var inputSelector = $inputSelector;

        var uploadedUrl;

        var uploadUrl = createUploadUrl(uploaderType, profileId);
        $(inputSelector).kendoUpload(buildKendoUploadOptions(uploadUrl, autoUploadEnabled, onSelect, onUpload, onSuccess, onError, onCancel));

        function onSelect(e) {
            var isValid = validateFileSelection(e);
            if (!isValid) {
                return;
            }
            if (!autoUploadEnabled) {
                tryReadFileLocally(e, onImageSelected);
            }
        }

        function onUpload(e) {
            var xhr = e.XMLHttpRequest;

            if (!xhr) {
                e.preventDefault();
                snapError("Upload failed. System error.");
                return;
            }
            setAuthHeaders(xhr);
            hideUploadButton($(inputSelector));
        }

        function onSuccess(e) {
            if (e.response && e.response.data) {
                uploadedUrl = e.response.data[0].uri;

                if (onImageUploaded) {
                    onImageUploaded(uploadedUrl);
                }

                resetUploader($(inputSelector), true);

                if (uploaderInstance.__uploadDefer) {
                    uploaderInstance.__uploadDefer.resolve(uploadedUrl);
                }
            }
        }

        function onError(e) {
            snapError(e.XMLHttpRequest.statusText || "Upload failed");
            if (uploaderInstance.__uploadDefer) {
                uploaderInstance.__uploadDefer.fail();
            }
            resetUploader($(inputSelector), false);
        }

        function onCancel(e) {
            e.preventDefault();
            if (uploaderInstance.__uploadDefer) {
                uploaderInstance.__uploadDefer.fail();
            }
            resetUploader($(inputSelector), false);
        }

        uploaderInstance.updateSaveUrl = function (id) {
            if (!id && uploaderType !== "image") {
                throw "Profile ID must be set";
            }
            $(inputSelector).data("kendoUpload").options.async.saveUrl = createUploadUrl(uploaderType, id);
        };

        uploaderInstance.uploadAsync = function (id) {
            if (!id && uploaderType !== "image") {
                throw "Profile ID must be set";
            }
            $(inputSelector).data("kendoUpload").options.async.saveUrl = createUploadUrl(uploaderType, id);

            uploaderInstance.__uploadDefer = new $.Deferred();

            var uploadButton = $(".k-upload-selected");
            if (uploadButton.length) {
                uploadButton.click();
            } else {
                // resolve cached value
                uploaderInstance.__uploadDefer.resolve(uploadedUrl);
            }

            return uploaderInstance.__uploadDefer.promise();
        }
    };

    /**
     * @returns {Boolean} is valid selection
     */
    function validateFileSelection(e) {

        if (e.files.length === 0) {
            e.preventDefault();
            snapError("No file selected.");
            return false;
        }

        var anyFileHasInvalidFormat = $(e.files).is(function (i) {
            if (!/^\.(jpg|png|jpeg|gif)$/i.test(e.files[i].extension || "")) {
                return true;
            }
            return false;
        });

        if (anyFileHasInvalidFormat) {
            e.preventDefault();
            snapError("Invalid file format. The system can accept the following file formats: JPG, JPEG, PNG, GIF.");
            return false;
        }

        var anyFileIsBiggerThanAllowed = $(e.files).is(function (i) {
            return e.files[i].size > uploadMaxSizeBytes;
        });

        if (anyFileIsBiggerThanAllowed) {
            e.preventDefault();
            snapError("Uploaded files must be less than 4MB.");
            return false;
        }

        return true;
    }

    function buildKendoUploadOptions(uploadUrl, autoUploadEnabled, onSelect, onUpload, onSuccess, onError, onCancel) {
        return {
            async: {
                autoUpload: autoUploadEnabled,
                saveUrl: uploadUrl,
                withCredentials: false
            },
            multiple: false,
            localization: {
                select: autoUploadEnabled ? "Upload image" : "Select image",
                headerStatusUploading: "Saving...",
                headerStatusUploaded: "Profile image saved"
            },
            showFileList: !autoUploadEnabled && !FileReader,
            template: "<span title=\"#=name#\">#=name#</span>",
            select: onSelect,
            upload: onUpload,
            success: onSuccess,
            error: onError,
            cancel: onCancel
        };
    }

    function createUploadUrl(uploaderType, uploaderId) {
        var uploadUrlPrefix = uploadUrlPrefixes[uploaderType];

        if (typeof uploadUrlPrefix === "undefined") {
            throw "Incorrect uploader type '" + uploaderType + "'";
        }

        return uploadUrlPrefix + (uploaderId || "");
    }

    function tryReadFileLocally(e, onImageSelected) {
        if (FileReader && onImageSelected) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {
                onImageSelected(this.result);
            }, false);

            reader.readAsDataURL(e.files[0].rawFile);
        }
    }

    function setAuthHeaders(xhr) {
        var readyStateListener = function () {
            if (xhr.readyState !== 1 /* OPENED */) {
                return;
            }

            var userSession = snap.userSession;

            xhr.setRequestHeader("Authorization", "Bearer " + userSession.token);
            xhr.setRequestHeader("X-Api-Session-Id", userSession.apiSessionId);
            xhr.setRequestHeader("Accept", "text/plain");

            xhr.removeEventListener("readystatechange", readyStateListener);
        }
        xhr.addEventListener("readystatechange", readyStateListener);
    }

    function hideUploadButton($input) {
        $input.closest(".k-upload-button").hide();
    }

    function resetUploader($input, keepStatus) {
        var $kupload = $input.closest(".k-upload");

        $kupload.find(".k-upload-files").remove();

        if (!keepStatus) {
            $kupload.find(".k-upload-status").remove();
        }

        $kupload.addClass("k-upload-empty");

        $kupload
            .find(".k-upload-button")
            .removeClass("k-state-focused")
            .show();
    }
})();




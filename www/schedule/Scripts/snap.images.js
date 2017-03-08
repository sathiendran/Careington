function getDefaultProfileImageForClinician(gender) {
    return gender === "F"
        ? "/images/Doctor-Female.gif"
        : gender === "M"
        ? "/images/Doctor-Male.gif"
        : "/images/default-user.jpg";
}

function getDefaultProfileImageForPatient(gender) {
    return gender === "F"
        ? "/images/Patient-Female.gif"
        : gender === "M"
        ? "/images/Patient-Male.gif"
        : "/images/default-user.jpg";
}

function isDefaultProfileImageForPatient(imageUrl) {
    return imageUrl === "/images/Patient-Female.gif"
        || imageUrl === "/images/Patient-Male.gif"
        || imageUrl === "/images/default-user.jpg";
}


var ProfileImageUploader;

(function () {
    var uploadMaxSizeBytes = 4194304;

    var uploadUrlPrefixes = {
        "patient": "/api/v2.1/patients/profile-images?patientId=",
        "clinician": "/api/v2.1/clinicians/profile-images?clinicianUserId=",
        "provider": "/api/v2.1/providers/profile-images?hospitalId="
    };

    ProfileImageUploader = function($input, uploaderType, autoUploadEnabled, profileId, onImageSelected, onImageUploaded) {
        var uploaderInstance = this;

        var uploadUrl = createUploadUrl(uploaderType, profileId);
        $input.kendoUpload(buildKendoUploadOptions(uploadUrl, autoUploadEnabled, onSelect, onUpload, onSuccess, onError, onCancel));

        function onSelect(e) {
            var isValid = validateFileSelection(e);
            if (!isValid) {
                return;
            }
            if (!autoUploadEnabled) {
                tryReadFileLocally(e, onImageSelected);
            }
        };

        function onUpload(e) {
            var xhr = e.XMLHttpRequest;

            if (!xhr) {
                e.preventDefault();
                snapError("Upload failed. System error.");
                return;
            }
            setAuthHeaders(xhr);
            hideUploadButton($input);
        };

        function onSuccess(e) {
            var url = e.XMLHttpRequest.getResponseHeader("Location");

            if (onImageUploaded) {
                onImageUploaded(url);
            }

            resetUploader($input, true);

            if (uploaderInstance.__uploadDefer) {
                uploaderInstance.__uploadDefer.resolve(url);
            }
        };

        function onError(e) {
            snapError(e.XMLHttpRequest.statusText || "Upload failed");
            if (uploaderInstance.__uploadDefer) {
                uploaderInstance.__uploadDefer.fail();
            }
            resetUploader($input, false);
        };

        function onCancel(e) {
            e.preventDefault();
            if (uploaderInstance.__uploadDefer) {
                uploaderInstance.__uploadDefer.fail();
            }
            resetUploader($input, false);
        };

        uploaderInstance.updateSaveUrl = function (id) {
            if (!id) {
                throw "Profile ID must be set";
            }
            $input.data("kendoUpload").options.async.saveUrl = createUploadUrl(uploaderType, id);
        };

        uploaderInstance.uploadAsync = function (id) {
            if (!id) {
                throw "Profile ID must be set";
            }
            $input.data("kendoUpload").options.async.saveUrl = createUploadUrl(uploaderType, id);

            uploaderInstance.__uploadDefer = new $.Deferred();

            var uploadButton = $(".k-upload-selected");
            if (uploadButton.length) {
                uploadButton.click();
            } else {
                uploaderInstance.__uploadDefer.resolve();
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
                saveUrl: uploadUrl
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

        return uploadUrlPrefix + uploaderId;
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
            xhr.setRequestHeader("X-Developer-Id", userSession.apiDeveloperId);
            xhr.setRequestHeader("X-Api-Key", userSession.apiKey);
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
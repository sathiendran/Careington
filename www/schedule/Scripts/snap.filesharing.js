// snap.filesharing.js
// Provides application api calls for file sharing
// Dependencies: jQuery
// Append version querystring as ?v=1.7.1.0
// ReSharper disable CoercedEqualsUsing

var snap = snap || {};

var pw = 'auto', phC = 'auto', phN = 'auto', ph = 'auto', psw = 'auto', psh = 'auto', dPh = 'auto',psL='auto';
if (snap.is_newConsultation === true) {
        pw = 'auto',
        ph = 'auto',
        phN = 'auto',
        dPh = 170,
        psw = 380,
        psh = 315;
}


function initFileSharingControls(bottomFilesRequired) {

    function attachUploadHeaders(xhr) {
        if (!xhr) {
            return;
        }

        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState !== 1 ) {
                return;
            }

            xhr.setRequestHeader("Accept", "application/json");

            if (snap.userSession) {
                if (snap.userSession.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " + snap.userSession.token);
                }
                if (snap.userSession.apiDeveloperId) {
                    xhr.setRequestHeader("X-Developer-Id", snap.userSession.apiDeveloperId);
                }
                if (snap.userSession.apiKey) {
                    xhr.setRequestHeader("X-Api-Key", snap.userSession.apiKey);
                }
            }
        });
    }

    $(".popup.share-file").kendoWindow({
        modal: true,
        maxWidth: 412,
        width: pw,
        height: phC,
        pinned: false,
        resizable: false,
        visible: false,
        position: {
            top: 50,
            left: psL
        },
        draggable: true,
        title: 'Share a File',
        actions: [
            "Close"
        ]
    });

    var popupShare = $(".popup.share-file").data("kendoWindow");
    popupShare.wrapper.addClass('file-sharing-popup');

    $("#file-properties-popup").kendoWindow({
        modal: true,
        minWidth: 350,
        maxWidth: 412,
        width: pw,
        height: ph,
        pinned: false,
        resizable: false,
        visible: false,
        position: {
            top: 50,
            left: psL
        },
        draggable: true,
        title: 'File Properties',
        actions: [
            "Close"
        ]
    });

    var popupProp = $("#file-properties-popup").data("kendoWindow");
    popupProp.wrapper.addClass('file-sharing-popup');

    $(".popup.new-folder").kendoWindow({
        modal: true,
        maxWidth: 412,
        width: pw,
        height: phN,
        pinned: false,
        resizable: false,
        visible: false,
        position: {
            top: 50,
            left: psL
        },
        draggable: true,
        title: 'New Folder',
        actions: [
            "Close"
        ]
    });

    var popupNewFolder = $(".popup.new-folder").data("kendoWindow");
    popupNewFolder.wrapper.addClass('file-sharing-popup');

    $(".popup.copy-file").kendoWindow({
        modal: true,
        maxWidth: 412,
        width: pw,
        height: phN,
        pinned: false,
        resizable: false,
        visible: false,
        position: {
            top: 50,
            left: psL
        },
        draggable: true,
        title: 'Copy File',
        actions: [
            "Close"
        ]
    });

    var popupCopyFile = $(".popup.copy-file").data("kendoWindow");
    popupCopyFile.wrapper.addClass('file-sharing-popup');

    $(".popup.confirm-folder").kendoWindow({
        modal: true,
        width: pw,
        maxWidth: 412,
        pinned: false,
        resizable: false,
        visible: false,
        position: {
            top: 50,
            left: psL
        },
        draggable: true,
        title: 'Confirm',
        actions: [
            "Close"
        ]
    });

    var popupConfirmFolder = $(".popup.confirm-folder").data("kendoWindow");
    popupConfirmFolder.wrapper.addClass('file-sharing-popup');

    if (typeof snap.is_newConsultation === "undefined" || snap.is_newConsultation !== true) {
                popupShare.center();
                popupProp.center();
                popupNewFolder.center();
                popupCopyFile.center();
                popupConfirmFolder.center();
            }


    var fileSharingSideShowHide = function() {
        if ($('#tab11').hasClass('expMyStatus')) {
            $(".thumb").css("width", "16.565%");
        }

        if ($('#tab11').hasClass('expPtStatus')) {
            $(".thumb").css("width", "16.565%");
        }

        if ($('#tab11').hasClass('expMyList')) {
            $('.clinicianFiles th.tags span').hide();
            $('.clinicianFiles .listViewColumn').show();
            $('.clinicianFiles .detailedView').hide();
        } else {
            $('.clinicianFiles th.tags span').show();
            $('.clinicianFiles .listViewColumn').hide();
            $('.clinicianFiles .detailedView').show();
        }

        if ($('#tab11').hasClass('expPtList')) {
            $('.patientFiles th.tags span').hide();
            $('.patientFiles .listViewColumn').show();
            $('.patientFiles .detailedView').hide();
        } else {
            $('.patientFiles th.tags span').show();
            $('.patientFiles .listViewColumn').hide();
            $('.patientFiles .detailedView').show();
        }

        setTimeout(function() {
                $("#topFiles .divtarget1").css("width", "98%");
                $("#bottomFiles .divtarget1").css("width", "98%");
            },
            100);

        if (snap.is_newConsultation === true) {
            $(".k-dropzone").addClass("icon_upload-cloud");
            $(".k-window-action").addClass("icon_cross_close_popup");
        }
    };


    function snapFilesCURDNotification(data) {
        if (data != null) {

            var operation = {
                uploadF: "upload",
                deleteFL: "delete",
                createFL: "create",
                copyF: "copy"
            };

            var chkData = {
                parentName: data.message.p_name,
                uploader: data.message.uploaded_user,
                operation: data.message.operation,
                owner: data.message.uploaded_user,
                fName: data.message.file_name,
                isFolder: data.message.is_folder === "True",
                isSelfSide: snap.profileSession.userId === data.message.uploaded_user,
                isNotHome: (!isEmpty(data.message.p_name)) && data.message.p_name != 'Home' && data.message.p_name != 'Patient Home' && !(snap.regExMail).test(data.message.p_name)
            };

            var msg = "";

            var bFolder = chkData.isNotHome ? snap.string.format("inside {0} folder", chkData.parentName) : "home space";

            if (!chkData.isSelfSide && chkData.operation === operation.uploadF)
                msg = snap.string.format("Message: A file has been uploaded in {0}.  \n  File Name: {1}", bFolder, chkData.fName);

            if (!chkData.isSelfSide && chkData.operation === operation.createFL)
                msg = snap.string.format("Message: A folder has been created in {0}.  \n  Folder Name: {1}", bFolder, chkData.fName);

            if (!chkData.isSelfSide && chkData.operation === operation.deleteFL) {
                $("#" + data.message.rowID + "").remove();
                msg = snap.string.format("Message: {0} has been deleted from {1}.  \n  {2} Name: {0}", chkData.fName, bFolder, chkData.isFolder ? "Folder" : 'File');
            }

            if (!chkData.isSelfSide && chkData.operation === operation.copyF)
                msg = snap.string.format("Message: A file has been copied to {0}.  \n  File Name: {1}", bFolder, chkData.fName);

            snapInfo(msg);
        }
    }

    function buildFolderName(strName) {
        return strName;
    }

    function uploadValidation(e) {
        var varClass = e.currentTarget.className.split(" ");
        if (app.snapFileService.breadcrumbPatientFolderName == "Customers" && snap.isHospitalAdminFile && varClass.indexOf("isHospitalAdminFile") > -1) {
            snapError("Your folder cannot be created in this space, please use a patient folder instead.");
            return false;
        } else {
            return true;
        }
    }

    function setupDragDrop(that) {
        if (snap.isHospitalAdminFile && that.patientId > 0) {
            if (that.name == "Customers") {
                $(".divtarget1").hide();
            } else {
                $(".divtarget1").show();
            }
        }
    }

    $("#cloudfilesClinician").kendoUpload({
        async: {
            saveUrl: '/api/File/Upload',
            autoUpload: true,
            batch: true
        },
        select: selectFilesClinician,
        upload: function (e) {
            attachUploadHeaders(e.XMLHttpRequest);

            snap.ExtendSessionIfNecessary = true;
            snap.IsFileUploadProgress = true;

            e.sender.options.async.saveUrl = snap.string.format("/api/v2/filesharing/file/g/{0}?consultationId={1}", app.snapFileService.viewModel.id, snap.consultationId || "");
        },
        success: function (e) {
            app.snapFileService.viewModel.load(app.snapFileService.viewModel.id, e.response);

            $(".k-notification-info").parent().fadeOut(1000, function () { $(this).remove(); });
            snapSuccess('The file ' + e.files[0].name + '  was uploaded successfully.');

            snap.ExtendSessionIfNecessary = false;
            snap.IsFileUploadProgress = false;
        },
        error: function(ex) {
            snapError("There was an error uploading the files");
            snap.ExtendSessionIfNecessary = false;
            snap.IsFileUploadProgress = false;
            snap.util.logToConsole(ex);
        }
    });

    app.snapFileService.propertiesWindow = popupProp;
    app.snapFileService.copyWindow = popupCopyFile;
    app.snapFileService.newFolderWindow = popupNewFolder;
    app.snapFileService.confirmWindow = popupConfirmFolder;
    app.snapFileService.shareWindow = popupShare;
    app.snapFileService.fSharingListDetailsSH = fileSharingSideShowHide;
    app.snapFileService.snapFilesCURDNotification = snapFilesCURDNotification;
    app.snapFileService.uploadValidation = uploadValidation;
    app.snapFileService.setupDragDrop = setupDragDrop;
    app.snapFileService.buildFolderName = buildFolderName;

    $("#bottomUploadFiles").click(function () {
        if (app.snapFileService.breadcrumbPatientFolderName == "Customers" && snap.isHospitalAdminFile) {
            snapError(' Your file cannot be uploaded in this space, please use a patient folder instead.');
            $("#bottomFiles > .k-upload").slideToggle();
            return false;
        }
    });

    $("#bulkMenuTop").click(function () {

        var ulId = "#menuTop";
        $(ulId).show();

        $(ulId).hover(function () {
            $(ulId).show();
        },
           function () {
               $(ulId).hide();
           });
    });

    $("#topUploadFiles").click(function () {
        if (app.snapFileService.fileSharingType != app.snapFileService.filesharing_customer && app.snapFileService.roles.indexOf(app.snapFileService.viewMyFileRole) == -1) {
            snapError('You do not have permission to upload files.');
            return;
        }
        $("#topFiles > .k-upload").slideToggle();
        if ($('#main-slider').length > 0) {
            $('#main-slider').css('height', 'auto');
        }
    });

    $("#topFiles > .k-upload").slideToggle();

    $('.clinicianFiles .listViewColumn, .patientFiles .listViewColumn').hide();

    $('.clinicianFiles .view-detailed').click(function () {
        $('#tab11').addClass('expMyDetailed').removeClass("expMyList");
        $('.clinicianFiles th.tags span').show();
        $('.clinicianFiles .listViewColumn').hide();
        $('.clinicianFiles .detailedView').show();
    });

    $('.clinicianFiles .view-list').click(function () {
        $('#tab11').addClass('expMyList').removeClass("expMyDetailed");
        $('.clinicianFiles th.tags span').hide();
        $('.clinicianFiles .listViewColumn').show();
        $('.clinicianFiles .detailedView').hide();
    });

    $('.patientFiles .view-detailed').click(function () {
        $('#tab11').addClass('expPtDetailed').removeClass("expPtList");
        $('.patientFiles th.tags span').show();
        $('.patientFiles .listViewColumn').hide();
        $('.patientFiles .detailedView').show();
    });
    $('.patientFiles .view-list').click(function () {
        $('#tab11').addClass('expPtList').removeClass("expPtDetailed");
        $('.patientFiles th.tags span').hide();
        $('.patientFiles .listViewColumn').show();
        $('.patientFiles .detailedView').hide();
    });


    if (bottomFilesRequired != null) {
        $("#cloudfilesPatient").kendoUpload({
            async: {
                saveUrl: '/api/File/Upload',
                autoUpload: true,
                batch: true
            },
            select: selectFilesPatient,
            upload: function(e) {
                if (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer && app.snapFileService.roles.indexOf("29") == -1) {
                    snapError('You do not have permission to upload file.');
                    e.preventDefault();
                    return;
                }

                attachUploadHeaders(e.XMLHttpRequest);

                e.sender.options.async.saveUrl = snap.string.format("/api/v2/filesharing/file/g/{0}?consultationId={1}", app.snapFileService.bottomViewModel.id, snap.consultationId || "");
            },
            success: function(e) {
                app.snapFileService.bottomViewModel.load(app.snapFileService.bottomViewModel.id, e.response);


                $(".k-notification-info").parent().fadeOut(1000, function () { $(this).remove(); });
                snapSuccess('The file ' + e.files[0].name + '  was uploaded successfully.');

            },
            error: function (ex) {
                snapError("There was an error uploading the files");
                snap.ExtendSessionIfNecessary = false;
                snap.IsFileUploadProgress = false;
                snap.util.logToConsole(ex);
            }
        });


        $("#bottomUploadFiles").click(function() {
            if (app.snapFileService.roles.indexOf(app.snapFileService.copyPatientFileRole) == -1) {
                snapError('You do not have permission to upload file.');
                return;
            }
            $("#bottomFiles > .k-upload").slideToggle();
            if ($('#main-slider').length > 0) {
                $('#main-slider').css('height', 'auto');
            }
        });

        $("#bottomFiles > .k-upload").slideToggle();

        $("#bottomBulkMenuToggle").click(function() {

            var ulId = "#bottomBulkMenu";
            $(ulId).show();

            $(ulId).hover(function() {
                    $(ulId).show();
                },
                function() {
                    $(ulId).hide();
                });
        });
    } else {
        $(".divtarget1").hide();
    }
}

function getFileInfo(e) {
    return $.map(e.files, function (file) {

        var info = 0;
        
        if (file.size > 0) {
            info = Math.ceil(file.size / (1024 * 1024));
        }
        return info;
    }).join(", ");
}

function duplicatedFile(e, searchOn) {
    var fileNames = '';
    var founds = 0;
    var vFiles = app.snapFileService.viewModel.files;

    if (searchOn == 'bottom' || searchOn == 'both') {
        vFiles = app.snapFileService.bottomViewModel.files;
    }

    for (var i = 0; i < e.files.length; i++) {
        if (app.snapFileService.fileExists(e.files[i].name, searchOn)) {
            if (fileNames != '')
                fileNames += ', ';

            fileNames += e.files[i].name;
            founds++;
        }
    }

    vFiles.forEach(function (entry) {
            if ( fileNames != '' && entry.name == fileNames)
                snap.existingFileId = entry.id;
    });

    return {files: fileNames, matches: founds};
}

var filesToConfirm = [];

function fileSizeOk(e) {

    var fileName = e.files[0].name;
    if (fileName.length > 125) {
        snapError("Please select no more than 125 characters name file.");
        return false;
    }

    var fileInfo = getFileInfo(e);
    if (fileInfo > 100 && fileInfo != undefined) {
        snapError("Your file size is " + fileInfo + " MB .File size more than 100 MB can not be uploaded.");
        e.preventDefault();
        return false;
    } else if (fileInfo == 0 && fileInfo != undefined) {
        snapError("Your file size is " + fileInfo + " KB .File size  0 KB can not be uploaded.");
        e.preventDefault();
        return false;
    }

    return true;
}

function calculateMatches(e, dFile) {
    if (dFile.matches > 0) {
        if (filesToConfirm.length == 0) {
            var isFieDeleted = false;
            app.snapFileService.snapVmFiles[0].files.forEach(function (enty) {
                if ( app.snapFileService.deletedFile.indexOf(enty.id) >-1)
                isFieDeleted = true;
            });
         
            if (!isFieDeleted)
            snapInfo('The file' + (dFile.matches == 1 ? ' ' : 's ') + dFile.files + ' already exists in your folder, File' + (dFile.matches == 1 ? ' ' : 's ') +' will be replaced.' );
        }
    }
}

function selectFilesClinician(e) {
    if (!fileSizeOk(e))
        return false;

    var dFile = duplicatedFile(e, "top");

    calculateMatches(e, dFile);
    return true;
}

function selectFilesPatient(e) {
    if (!fileSizeOk(e))
        return false;

    var dFile = duplicatedFile(e, "bottom");

    calculateMatches(e, dFile);
    return true;
}

function initializeFileSharingReport(consultationId) {
    var divFileSharing = $("#file-attachments");

    var isfileSharingEnable = true;
    if (snap['getSnapHospitalSettings']) {
        snap.getSnapHospitalSettings();
        isfileSharingEnable = snap.hospitalSettings.fileSharing;
    }
    if (!isfileSharingEnable) {
        $("#file-attachments").remove();
    }
    else {
        getRoleFunctions().then(function (data) {
            app.snapFileService.roles = data;
            app.snapFileService.consultationViewModel.clear();
            app.snapFileService.consultationViewModel.consultationId = consultationId;

            if (app.snapFileService.fileSharingType == null || app.snapFileService.fileSharingType === '') {
                if (sessionStorage.snap_patientprofile_session != null)
                    app.snapFileService.fileSharingType = app.snapFileService.filesharing_customer;
                else
                    app.snapFileService.fileSharingType = app.snapFileService.filesharing_physician;
            }

            app.snapFileService.consultationViewModel.loadConsultation(app.snapFileService.consultationViewModel.consultationId);
            kendo.bind(divFileSharing, app.snapFileService.consultationViewModel);
        });
    }
    
}

function initCustomerFiles(userId, patientId, isDependent) {
    var divFileSharing = $("#topFiles");
    var bottomFiles = $("#bottomFiles");
    bottomFiles.hide();

    getRoleFunctions().then(function(data) {
        var roles = app.snapFileService.roles = data;

        if (roles.indexOf(app.snapFileService.viewMyFileRole) > -1) {
            app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = userId;
            app.snapFileService.fileSharingType = app.snapFileService.filesharing_customer;
            app.snapFileService.viewModel.patientId = patientId;
            app.snapFileService.viewModel.isDependent = isDependent;

            app.snapFileService.viewModel.load();
            kendo.bind(divFileSharing, app.snapFileService.viewModel);

            app.snapFileService.bottomViewModel = null;
            InitDragDrop();
            $(".filestab").removeClass("disabled k-state-disabled");
        } else {
            $(".filestab").addClass("disabled k-state-disabled");
            $(".files").html("<h3 style='padding: 20px'>You do not currently have permission to file sharing.</h3>");
        }
    });
}

function initPhysicianFiles(userId, adminId) {
    if (userId != adminId && adminId != null) {
        app.snapFileService.has_delete_permission = false;
    }

    if (adminId != null) {
        app.snapFileService.isAdminStaffFileSharing = true;
        snap.staffAdminId = userId;
    }

    initFileSharingControls(null);

    var divFileSharing = $("#topFiles");
    var bottomFiles = $("#bottomFiles");
    bottomFiles.hide();

    getRoleFunctions().then(function(data) {

        app.snapFileService.roles = data;

        var patientRole =  data.indexOf(app.snapFileService.viewMyFileRole) > -1 && (adminId == null || adminId === 0);
        var physicianRole = data.indexOf(app.snapFileService.manageStaffFiles) > -1 && adminId != null && adminId > 0;
        
        if (patientRole || physicianRole) {
            app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = userId;
            app.snapFileService.fileSharingType = app.snapFileService.filesharing_physician;

            app.snapFileService.viewModel.load();
            kendo.bind(divFileSharing, app.snapFileService.viewModel);

            app.snapFileService.bottomViewModel = null;
            InitDragDrop();
        } else {
            divFileSharing.hide();
            $("#liFiles").remove(); 
        }
    });
}

function initPhysicianPatientFileSharing(userId, patientId) {
    initFileSharingControls(patientId);
    var promise = getRoleFunctions();
    var divFileSharing = $("#topFiles");
    var bottomFiles = $("#bottomFiles");
    app.snapFileService.isSideView = true;

    app.snapFileService.fileSharingType = app.snapFileService.filesharing_physician;

    promise.then(function(data) {
        if (data != null) {
            var roles = app.snapFileService.roles = data;

            if (roles.indexOf(app.snapFileService.viewMyFileRole) > -1 && roles.indexOf(app.snapFileService.viewPatientFileRole) > -1 && patientId != null) {
                app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = userId;
                app.snapFileService.viewModel.load();

                kendo.bind(divFileSharing, app.snapFileService.viewModel);

                app.snapFileService.viewModel.patientRoleFunctions = roles;
                app.snapFileService.bottomViewModel.userId = app.snapFileService.bottomViewModel.folderUserId = patientId;
                app.snapFileService.bottomViewModel.patientId = patientId;

                app.snapFileService.bottomViewModel.load();
                kendo.bind(bottomFiles, app.snapFileService.bottomViewModel);

                InitDragDrop();
            } else {
                $("#filesTab").remove();
                $("#liFiles").remove();
            }
        }
    });
}

function initAdminPatientFileSharing(adminId) {
    initFileSharingControls(null);
    var promise = getRoleFunctions();
    var divFileSharing = $("#topFiles");
   
    app.snapFileService.fileSharingType = app.snapFileService.filesharing_admin;
    promise.then(function (data) {
        if (data != null) {
            var roles = app.snapFileService.roles = data;

            if (roles.indexOf(app.snapFileService.manageHospitalFileRole) > -1) {
                app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = adminId;
                app.snapFileService.viewModel.load();
                kendo.bind(divFileSharing, app.snapFileService.viewModel);

                app.snapFileService.bottomViewModel = null;

                InitDragDrop();
            } else {
                $("#filesTab").remove();
            }
        }
    });

}

function initPhysicianConsultation(userId, patientId) {
    var $selfFiles = $("#topFiles");
    var $patientFiles = $("#bottomFiles");
    var $dropArea = $(".divtarget");
    app.snapFileService.consultStatus = true;

    app.snapFileService.fileSharingType = app.snapFileService.filesharing_physician;

    getRoleFunctions().then(function (roles) {
        if (roles == null) {
            throw "Empty response from getRoleFunctions";
        }
        app.snapFileService.roles = roles;

        var canAccessSelfFiles = roles.indexOf(app.snapFileService.viewMyFileRole) > -1;
        var canViewPatientFiles = roles.indexOf(app.snapFileService.viewPatientFileRole) > -1;

        if (!canAccessSelfFiles && !canViewPatientFiles) {
            $(".filestab").addClass("disabled k-state-disabled");
            $(".files").html("<h3 style='padding: 20px'>You do not currently have permission to file sharing.</h3>");
            return;
        }
        $(".filestab").removeClass("disabled k-state-disabled");

        if (canAccessSelfFiles) {
            app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = userId;
            app.snapFileService.viewModel.load();

            kendo.bind($selfFiles, app.snapFileService.viewModel);

            InitDragDrop();
        } else {
            $selfFiles.hide();
            $dropArea.hide();
        }

        if (patientId && canViewPatientFiles) {
            if (app.snapFileService.viewModel) {
                app.snapFileService.viewModel.patientRoleFunctions = roles;
            }

            app.snapFileService.bottomViewModel.userId = userId;
            app.snapFileService.bottomViewModel.patientId = app.snapFileService.bottomViewModel.folderUserId = patientId;
            app.snapFileService.bottomViewModel.load();

            kendo.bind($patientFiles, app.snapFileService.bottomViewModel);
        } else {
            $patientFiles.hide();
            $dropArea.hide();
        }
    });
}

function initializeFileSharing(userId, patientId, doublePanel) {
    initFileSharingControls(doublePanel);

    var divFileSharing = $("#topFiles");
    var bottomFiles = $("#bottomFiles");
    var divtarget = $(".divtarget");


    app.snapFileService.viewModel.userId = userId;
    app.snapFileService.viewModel.folderUserId = app.snapFileService.viewModel.patientId = patientId;
    app.snapFileService.viewModel.load();

    kendo.bind(divFileSharing, app.snapFileService.viewModel);

    if (window.patientUserId != null) {
        app.snapFileService.bottomViewModel.userId = app.snapFileService.viewModel.userId;
        app.snapFileService.bottomViewModel.folderUserId = window.patientUserId;
        app.snapFileService.bottomViewModel.patientId = patientId;

        app.snapFileService.bottomViewModel.load();
        kendo.bind(bottomFiles, app.snapFileService.bottomViewModel);
    } else {
        app.snapFileService.bottomViewModel = null;
        bottomFiles.hide();
        divtarget.hide();
    }
}

function successRoleFn(data) {
    if (data != null) {
        app.snapFileService.roles = data;
    }
}

function initializeFileSharingNoControls(userId, patientUserId) {
    var divFileSharing = $("#topFiles");
    var bottomFiles = $("#bottomFiles");

    app.snapFileService.viewModel.userId = app.snapFileService.viewModel.folderUserId = userId;
    app.snapFileService.viewModel.load();

    kendo.bind(divFileSharing, app.snapFileService.viewModel);

    if (patientUserId != null) {
        app.snapFileService.bottomViewModel.userId = app.snapFileService.viewModel.userId;
        app.snapFileService.bottomViewModel.folderUserId = patientUserId;

        app.snapFileService.bottomViewModel.load();
        kendo.bind(bottomFiles, app.snapFileService.bottomViewModel);
    } else {
        app.snapFileService.bottomViewModel = null;
        bottomFiles.hide();
    }

    InitDragDrop();
}

function InitDragDrop() {
    var initDrop = function () {
        if (!$.fn.kendoDropTarget) {
            return;
        }
        $('tr.target1, tr>td.target1, div.divtarget1, img.target1').kendoDropTarget({
            filter: '.target1',
            dragenter: function (e) {
                e.draggable.hint.css("opacity", 1);
            },
            dragleave: function (e) {
                e.draggable.hint.css("opacity", 0.6);
            },
            drop: function (e) {
                var parentDragableId = e.draggable.currentTarget[0].parentNode.parentNode.id;
                if (parentDragableId == "")
                    parentDragableId = e.draggable.currentTarget[0].parentNode.parentNode.parentNode.id;

                if (app.snapFileService.findSameDestination(e.dropTarget[0].id, parentDragableId)) {
                    snapInfo('File can not be copied as the same destination.');
                    return;
                }

                var foundFolder = app.snapFileService.findById(e.dropTarget[0].id);
                var foundFile = app.snapFileService.findById(e.draggable.currentTarget[0].id);

                if (foundFile != null && foundFolder != null) {
                    if (!foundFolder.isWritable) {
                        snapInfo('File cannot be copied to this folder.');
                        return;
                    }

                    foundFile.copyFolder = foundFolder;
                    foundFile.copyComplete();
                }
            }
        });
    };

    var initDrag = function() {

        if (!$.fn.kendoDraggable) {
            return;
        }
        $('.filesTable, #topDivDragable, #bottomDivDragable')
            .kendoDraggable({
                filter: ".draggable1",
                hint: function (e) {
                    var $e = $(e);
                    var $d = $e.is(".draggable-icon") ? $e : $e.find(".draggable-icon");

                    var h = $d.height();

                    var element = $d.clone()
                        .css({
                            "opacity": 0.6,
                            "background-color": "#fff",
                            "height": h
                        });
                    return element;
                },
                cursorOffset: {
                    top: -15,
                    left: -15
                }
            });
    };
    setTimeout(function () {
        initDrag();
    }, 4000);
    setTimeout(function () {
        initDrop();
    }, 4000);
}

function setupConsultation(userId, patientId, consultationId, times) {
    var params = {
        consultationId: consultationId
    };

    snap.consultationId = consultationId;
    app.snapFileService.consultationId = consultationId;

    var path = '/api/consultation/filesharing';
    $.ajax({
        url: path,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(params),
        success: function (data) {
            if (data != null) {
                app.snapFileService.consultationFolder = data;
                initPhysicianConsultation(userId, patientId);
            }
        },
        error: function (xhr) {
            if (snap.util) {
                snap.util.disableTab('files');
            }
            if (times == null)
                times = 0;

            if (times < 3) {
                setTimeout(function () {
                    times = times + 1;
                    setupConsultation(userId, patientId, consultationId, times);
                }, 2000);
            } else {
                snapError("The consultation folder could not be setup.");
                snap.util.logToConsole(xhr);
            }

        }
    });
}

function getSharedFolderId() {
    var path = '/api/Folder/GetSharedFolderId';
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data != null) {
                window.sharedFolderID = data;
            }
        },
        error: function (xhr) {
            window.sharedFolderID = '';
            snap.util.logToConsole(xhr);
            setTimeout(function () {
                getSharedFolderId();
            }, 10000);
        }
    });
}

function setupFileSharing(patientId , cb) {
    var params = {
        patientId: patientId
    };

    var path = '/api/FileSharingUser/CreateCustomerProfile';
    $.ajax({
        url: path,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(params),
        timeout: 120000,
        success: function () {
            cb(true);
        },
        error: function (xhr) {
            snap.util.logToConsole(xhr);
            cb(false);
        }
    });
}

function checkFileSharingOnWaitingRoom(consultationId, success) {
    var path = '/api/FileSharingUser/CheckCustomerProfile';
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        data: "consultationid=" + consultationId,
        timeout: 120000,
        success: success,
        error: function (xhr) {
            snap.util.logToConsole(xhr);

        }
    });
}

function setupFileSharingWithEmail(email, hospitalId, success) {
    var path = '/api/FileSharingUser/SetupClinicianAccount';
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        data: "email=" + email + "&hospitalId=" + hospitalId,
        timeout: 120000,
        success: success,
        error: function (xhr) {
            snap.util.logToConsole(xhr);
        }
    });
}

function setupFileSharingWithToken(token, hospitalId, success) {
    var path = '/api/FileSharingUser/SetupClinicianAccountToken';
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        data: "token=" + token + "&hospitalId=" + hospitalId,
        timeout: 120000,
        success: success,
        error: function (xhr) {
            snapError("Failed to setup the user Folder. ");
            snap.util.logToConsole(xhr);
        }
    });
}


function setupFileSharingOnHospital(hospitalId, success) {
    var path = '/api/FileSharingUser/SetupHospital';
    return $.ajax({
        url: path,
        type: 'GET',
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        data: "hospitalId=" + hospitalId,
        success: success || function () { },

        error: function (xhr) {
            snap.util.logToConsole(xhr);
        }
    });
}

function getRoleFunctions() {
    var path = '/api/FileSharingUser/GetRoleFunction';
    var params = {
        fileSharingType: app.snapFileService.fileSharingType
    };

    return $.ajax({
        url: path,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(params)
    });
}

(function (global) {

    // ReSharper disable CoercedEqualsUsing
    // ReSharper disable StringLiteralWrongQuotes
    var SnapFileViewModel,
        app = global.app = global.app || {};


    if (!HTMLElement.prototype.click) {
        HTMLElement.prototype.click = function () {
            var ev = document.createEvent('MouseEvent');
            ev.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(ev);
        };
    }

    SnapFileViewModel = kendo.data.ObservableObject.extend({
        id: "",
        name: "",
        paramName: "",
        parent: null,
        dateCreated: "",
        createdBy: "",
        dateModified: "",
        modifiedBy: "",

        files: new kendo.data.ObservableArray({}),
        folders: new kendo.data.ObservableArray({}),
        allFiles: new kendo.data.ObservableArray({}),

        tags: new kendo.data.ObservableArray({}), // data.tags
        autoTags: new kendo.data.ObservableArray({}), //for auto complete
        firstTwoTags: new kendo.data.ObservableArray({}), // first two tags 
        tootTipTags: new kendo.data.ObservableArray({}), // rest of tags

        isTag2ToolTipVisible: true, // ..3 is visible or not
        tag2ToolTipNumber: '..0', // ..3


        isFolder: false,
        size: 0,
        topFolderSize: "",
        topFolderSizeBytes: 0,
        maxFolderSize: "",
        maxFolderSizeBytes: 0,
        md5: "",
        bufferMd5: "",
        type: "",
        isWritable: true,
        isReadable: false,
        isSharedFolder: false,
        isRemovable: false,
        isSearchEmpty: false,
        breadcrumbs: new kendo.data.ObservableArray({}),
        parents: new kendo.data.ObservableArray({}),
        dateCreatedShort: "",
        dateModifiedShort: "",
        isEmpty: false,
        isAttachedToConsultation: false,
        isFolderSizeVisible: false,
        hasAttachedFile: false,
        isSpinnerShow: true,
        isBulkActive: false,
        filesAffected: 0,

        getIsBulkActive: function () {
            if (this.patientId || snap.staffAdminId) {
                if (app.snapFileService.bottomViewModel) {
                    return app.snapFileService.bottomViewModel.isBulkActive;
                }
            }

            return app.snapFileService.viewModel.isBulkActive;
        },
        openMenu: function (e) {
            var that = this;
            var anchor = $(e.target);
            var subMenu = anchor.next();
            var con = anchor.closest('.detailedView');
            var conPos = con.scrollTop() + con.height();
            var menuPos = subMenu.closest('tr').position().top + subMenu.height() + 34;
            
            subMenu.show();

            if (conPos > menuPos) {
                subMenu.css("top", "auto");
            } else {
                subMenu.css("top", "-160px");
            }

            subMenu.hover(function () {
                subMenu.show();
            }, function () {
                subMenu.hide();
                subMenu.unbind('hover');
            });

            anchor.hover(function () {
                //Do Nada
            }, function () {
                subMenu.hide();
            });

            if (that.isFolder) {
                $(".ulMenu").removeClass("pic_menu").addClass("folder_menu");
            } else {
                $(".ulMenu").removeClass("folder_menu").addClass("pic_menu");
            }

        },
        dropMessageVisible: false,
        dropMessage: function () {
            var that = this;
            return that.patientId == 0 ? "Drop From Patient Files Here" : "Drop From My Files Here";
        },
        setDataValues: function (data, folderSize, folderSizeBytes, maxFolderSize) {
            var that = this;
            that.setId(data.id);
            that.setName(data.name);
            that.setDateCreated(data.dateCreated);
            that.setCreatedBy(data.createdBy);
            that.setDateModified(data.dateModified);
            that.setIsFolder(data.isFolder);
            that.setSize(data.size);
            that.setIsWritable(data.isWritable);
            that.setIsReadable(data.isReadable);
            that.setIsSharedFolder(data.isSharedFolder);
            that.setIsRemovable(data.isRemovable);
            that.setMd5(data.md5);
            that.setIsSearchEmpty(false);
            that.setHasAttachedFile(false);
            that.setIsFolderSizeVisible(maxFolderSize);
            that.setUserId(data.userId);
            that.setTopFolderSize(folderSize);
            that.setTopFolderSizeBytes(folderSizeBytes);
            that.setIsAttachedToConsultation(data.isAttachedToConsultation);
        },
        buildFromResponse: function (data, folderSize, folderSizeBytes, maxFolderSize) {
            var that = this;
            that.setDataValues(data, folderSize, folderSizeBytes, maxFolderSize);

            if (maxFolderSize != null && maxFolderSize.trim() != "MB") {
                app.snapFileService.maxFolderSize = maxFolderSize;
            }

            that.setMaxFolderSize(app.snapFileService.maxFolderSize);

            for (var i = 0; i < data.tags.length && app.snapFileService.gTagText !== ""; i++) {
                if (data.tags[i].tagId === app.snapFileService.gTagText) {
                    data.tags.unshift(data.tags[i]);
                    data.tags.splice(i + 1, 1);
                }
            }

            that.setTags(data.tags);
            that.updateTagProperties();

            if (data.parent != null) {
                var p = new SnapFileViewModel();
                p.buildFromResponse(data.parent, folderSize, folderSizeBytes, maxFolderSize);
                p.userId = that.userId;
                p.folderUserId = that.folderUserId;
                p.patientId = that.patientId;
                p.isDependent = that.isDependent;
                that.parent = function () { return p; };
            }

            var getThat = function ()
            {
                return that;
            };

            var iFolders = new kendo.data.ObservableArray({});

            data.folders.forEach(function (folder) {
                var f = new SnapFileViewModel();
                f.buildFromResponse(folder, folderSize, folderSizeBytes, maxFolderSize);
                f.setUserId(that.userId);
                f.setFolderUserId(that.folderUserId);
                f.setPatientId(that.patientId);
                f.setIsDependent(that.isDependent);
                f.parent = getThat;

                iFolders.push(f);
            });


            var iFiles = new kendo.data.ObservableArray({});
            data.files.forEach(function (file) {
                var l = new SnapFileViewModel();
                l.buildFromResponse(file, folderSize, folderSizeBytes, maxFolderSize);

                l.setUserId(that.userId);
                l.setFolderUserId(that.folderUserId);
                l.setPatientId(that.patientId);
                l.setIsDependent(that.isDependent);
                l.parent = getThat;
                iFiles.push(l);
            });
            

            if (name == undefined || name == "") {
                that.setIsSpinnerShow(false);
                that.setHasAttachedFile(iFiles.length == 0 || iFiles.length == undefined);
            }

            that.setFolders(iFolders);
            that.setFiles(iFiles);
            if (data.type != null)
                that.setType(data.type);

            /*  set folders & files assending order during load */
            app.snapFileService.sortAsc = true;
            var _folders = that.folders;
            var _files = that.files;
            _folders.sort(this.sortfunction_name);
            _files.sort(this.sortfunction_name);

            var all = new kendo.data.ObservableArray({});

            _folders.forEach(function (folder) {
                all.push(folder);
            });
           
            _files.forEach(function (file) {
                all.push(file);
            });

            that.setIsEmpty(data.files.length === 0 && data.folders.length === 0);
            that.setAllFiles(all);
        },
        removeSortClass: function () {
            $('th.topName').find($("span")).removeClass('asc desc');
            $('th.bottomName').find($("span")).removeClass('asc desc');
            $('th.topDate').find($("span")).removeClass('asc desc');
            $('th.bottomDate').find($("span")).removeClass('asc desc');
        },
        sort: function (e) {
            var that = this;
            var _folders = new kendo.data.ObservableArray({});
            var _files = new kendo.data.ObservableArray({});
            var _all = new kendo.data.ObservableArray({});

            var param = $(e.target).data('parameter');

            app.snapFileService.sortAsc = e.target.className == "desc" ? false : true;
            e.target.className = e.target.className == "desc" ? "asc" : "desc";

            that.setIsSearchEmpty(false);
            $(".search-files").val("");

            that.folders.forEach(function (folder) {
                if ((app.snapFileService.deletedFolder).indexOf(folder.id) == -1)
                    _folders.push(folder);
            });
            that.folders = _folders;
            that.files.forEach(function (file) {
                if ((app.snapFileService.deletedFile).indexOf(file.id) == -1)
                    _files.push(file);
            });
            that.files = _files;

            if (param == "topName" || param == "bottomName") {
                var topName = param == "topName" ? "topDate" : "bottomDate";
                $('th.' + topName).find($("span")).removeClass('asc desc');
                _folders.sort(this.sortfunction_name);
                _files.sort(this.sortfunction_name);
            }
            else if (param == "topDate" || param == "bottomDate") {
                var topDate = param == "topDate" ? "topName" : "bottomName";
                $('th.' + topDate).find($("span")).removeClass('asc desc');
                _folders.sort(this.sortfunction_date_mmdd);
                _files.sort(this.sortfunction_date_mmdd);
            }

            _folders.forEach(function (folder) {
                _all.push(folder);
            });

            _files.forEach(function (file) {
                _all.push(file);
            });
               
            that.setAllFiles(_all);

            if (app.snapFileService.findActiveViewModel(that) == "topView")
                 that.colorFirstTag(app.snapFileService.gTagText);
                  else
                that.colorFirstTag(app.snapFileService.gBottomTagText);
        },
        sortfunction_name: function (a, b) {
            if (app.snapFileService.sortAsc && a.name.toLowerCase() > b.name.toLowerCase())
                return 1;
            if (!app.snapFileService.sortAsc && a.name.toLowerCase() < b.name.toLowerCase())
                return 1;
            if (app.snapFileService.sortAsc && a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            if (!app.snapFileService.sortAsc && a.name.toLowerCase() > b.name.toLowerCase())
                return -1;
            return 0;
        },
        sortfunction_date_mmdd: function (a, b) {

           var mtch = a.dateModifiedShort.match(app.snapFileService.DATE_REX);
           var y = mtch[3];
           var d = mtch[2];
           var m = mtch[1];

            if (m.length == 1)
                m = '0' + m;
            if (d.length == 1)
                d = '0' + d;
           var dt1 = y + m + d;
            mtch = b.dateModifiedShort.match(app.snapFileService.DATE_REX);

            y = mtch[3];
            d = mtch[2];
            m = mtch[1];

            if (m.length == 1)
                m = '0' + m;
            if (d.length == 1)
                d = '0' + d;
           var dt2 = y + m + d;

            if (app.snapFileService.sortAsc && dt1 < dt2)
                return -1;
            if (!app.snapFileService.sortAsc && dt1 > dt2)
                return -1;
            if (app.snapFileService.sortAsc && dt1 > dt2)
                return 1;
            if (!app.snapFileService.sortAsc && dt1 < dt2)
                return 1;

            return 0;
        },
        sortfunction_date_ddmm: function (a, b) {
            var mtch = a.dateModifiedShort.match(app.snapFileService.DATE_REX);
            var y = mtch[3];
            var m = mtch[2];
            var d = mtch[1];

            if (m.length == 1)
                m = '0' + m;
            if (d.length == 1)
                d = '0' + d;
            var dt1 = y + m + d;
            mtch = b.dateModifiedShort.match(app.snapFileService.DATE_REX);
            y = mtch[3];
            m = mtch[2];
            d = mtch[1];
            if (m.length == 1)
                m = '0' + m;
            if (d.length == 1)
                d = '0' + d;
            var dt2 = y + m + d;

            if (app.snapFileService.sortAsc && dt1 < dt2)
                return -1;
            if (app.snapFileService.sortAsc && dt1 > dt2)
                return 1;
            if (!app.snapFileService.sortAsc && dt1 > dt2)
                return -1;
            if (!app.snapFileService.sortAsc && dt1 < dt2)
                return 1;
            return 0;
        },
        setIsLast: function (last) {
            var that = this;
            that.set("isLast", last);
        },
        setId: function (id) {
            var that = this;
            that.set("id", id);
        },
        setName: function (name) {
            var that = this;

            if (snap.noConsultationIndex && snap.noConsultationIndex != undefined) {
                that.set("name", name);
            }
            else {
                if ($.isFunction(app.snapFileService.buildFolderName)) {
                    name = app.snapFileService.buildFolderName(name);
                }
                that.set("name", name);
            }
        },
        setParent: function (parent) {
            var that = this;
            that.set("parent", parent);
        },
        setDateCreated: function (dateCreated) {
            var that = this;

            if (dateCreated != null) {
                that.set("dateCreatedShort", formatJSONDateShort(dateCreated));
            } else {
                that.set("dateCreated", dateCreated);
            }
        },
        setCreatedBy: function (createdBy) {
            var that = this;
            that.set("createdBy", createdBy == null ? "System" : createdBy);
        },
        setDateModified: function (dateModified) {
            var that = this;

            if (dateModified != null) {
                that.set("dateModifiedShort", formatJSONDateShort(dateModified));
            } else {
                that.set("dateModified", dateModified);
            }
        },
        setModifiedBy: function (modifiedBy) {
            var that = this;
            that.set("modifiedBy", modifiedBy);
        },
        setFiles: function (files) {
            var that = this;
            that.set("files", files);
        },
        setAllFiles: function (allFiles) {
            var that = this;
            that.set("allFiles", allFiles);
        },
        setFolders: function (folders) {
            var that = this;
            that.set("folders", folders);
        },
        setParents: function (folders) {
            var that = this;
            that.set("parents", folders);
        },
        setIsFolder: function (isFolder) {
            var that = this;
            that.set("isFolder", isFolder);
        },
        setSize: function (size) {
            var that = this;
            that.set("size", size);
        },
        setTopFolderSize: function (size) {
            var that = this;
            that.set("topFolderSize", size);
            app.snapFileService.snapVmFiles.push(that);
        },
        setMaxFolderSize: function (size) {
            var that = this;
            that.set("maxFolderSize", size);
        },
        setTopFolderSizeBytes: function (size) {
            var that = this;
            that.set("topFolderSizeBytes", size);
        },
        setMaxFolderSizeBytes: function (size) {
            var that = this;
            that.set("maxFolderSizeBytes", size);
        },
        setMd5: function (md5) {
            var that = this;
            that.set("md5", md5);
        },
        setBufferMd5: function (bufferMd5) {
            var that = this;
            that.set("bufferMd5", bufferMd5);
        },
        setType: function (type) {
            var that = this;
            that.set("type", type);
        },
        setIsWritable: function (isWritable) {
            var that = this;
            that.set("isWritable", isWritable);
        },
        setIsSearchEmpty: function (isSearchEmpty) {
            var that = this;
            that.set("isSearchEmpty", isSearchEmpty);
        },
        setIsReadable: function (isReadable) {
            var that = this;
            that.set("isReadable", isReadable);
        },
        setIsSharedFolder: function (isSharedFolder) {
            var that = this;
            that.set("isSharedFolder", isSharedFolder);
        },
        setIsRemovable: function (isRemovable) {
            var that = this;
            that.set("isRemovable", isRemovable);
        },
        setHasAttachedFile: function (hasAttachedFile) {
            var that = this;
            that.set("hasAttachedFile", hasAttachedFile);
        },

        setIsSpinnerShow: function (isSpinnerShow) {
            var that = this;
            that.set("isSpinnerShow", isSpinnerShow);
        },
        setTags: function (tags) {
            var that = this;
            that.set("tags", tags);
        },
        setFirstTwoTags: function (tags) {
            var that = this;
            that.set("firstTwoTags", tags);
        },
        setAutoTags: function (tags) {
            var that = this;
            that.set("autoTags", tags);
        },
        setToottipTags: function (tooltipTags) {
            var that = this;
            that.set("tootTipTags", tooltipTags);
        },
        setTag2TooltipNumber: function (tag2TooltipNumber) {
            var that = this;
            that.set("tag2ToolTipNumber", tag2TooltipNumber);
        },
        setIsAttachedToConsultation: function (isAttachedToConsult) {
            var that = this;
            that.set("isAttachedToConsultation", isAttachedToConsult);
        },
        setIsFolderSizeVisible: function (folderSize) {
            this.set("isFolderSizeVisible", !!parseInt(folderSize));
        },
        toCopyFolders: new kendo.data.ObservableArray({}),
        copyFolder: null,
        userId: 0,
        folderUserId: 0,
        consultationId: 0,
        patientId: 0,
        isDependent: false,
        showBulkMenu: false,

        isLast: false,
        menuId: function () {
            var that = this;
            return "menu_" + that.id;
        },
        openTopBatchMenu: function () {
            var that = this;
            $("#menuTop").show();
            $("#menuTop").hover(function () {
                that.set("showBulkMenu", true);
            },
            function () {
                that.set("showBulkMenu", false);
            });
        },
        displayMenuOption: function () {
            var that = this;
            return that.isFolder;
        },
        clone: function (truncateName, attachToName) {
            var that = this;
            var resp = new SnapFileViewModel();
            if (isEmpty(that.name))
                resp.name = ""; // record consutlation fix
            else if (truncateName && that.name.length > 12) {
                resp.name = that.name.substring(0, 11) + "...";
            }
            else if (attachToName != null && attachToName != '') 
              resp.name = attachToName + " - " + that.name;
            else 
              resp.name = that.name;
             
            
            resp.id = that.id;
            resp.isFolder = that.isFolder;
            resp.isSharedFolder = that.isSharedFolder;
            resp.dateCreated = that.dateCreated;
            resp.createdBy = that.createdBy;
            resp.dateModified = that.dateModified;
            resp.modifiedBy = that.modifiedBy;
            resp.size = that.size;
            resp.type = that.type;
            resp.userId = that.userId;
            resp.folderUserId = that.folderUserId;
            resp.patientId = that.patientId;
            resp.isDependent = that.isDependent;
            resp.isSharedFolder = that.isSharedFolder;
            return resp;
        },
        createBreadcrumbs: function () {
            var that = this;
            var bc = new kendo.data.ObservableArray({});
            var up = false;
            for (var i = 0; i < that.parents.length; i++) {
                that.parents[i].setIsLast(false);
                bc.push(that.parents[i]);
                if (that.parents[i].id == that.id) {
                    that.parents[i].setIsLast(true);
                    up = true;
                    break;
                }
            }
            if (!up) {
                var last = that.clone(true);
                last.setIsLast(true);
                bc.push(last);
            }
            if (that.patientId == 0 || (that.folderUserId != that.patientId)) {
                app.snapFileService.breadcrumbMyFolderId = that.id;
            } else {
                app.snapFileService.breadcrumbPatientFolderId = that.id;
            }
            that.setParents(bc);
        },
        breadCrumbColor: function () {
            var that = this;
            return that.isLast ? "last" : "";
        },
        addFolderColor: function () {
            var that = this;
            if (app.snapFileService.bottomViewModel != null && that.id === app.snapFileService.bottomViewModel.id) {
                return that.isLast && app.snapFileService.bottomViewModel.isWritable ? "icon_new_folder breadcrumbs-add-folder" : "breadcrumbs-add-folder-hide";
            }
            if (app.snapFileService.viewModel != null && that.id === app.snapFileService.viewModel.id) {
                return that.isLast && app.snapFileService.viewModel.isWritable ? "icon_new_folder breadcrumbs-add-folder" : "breadcrumbs-add-folder-hide";
            }
            return "breadcrumbs-add-folder-hide";
        },
        nameof: function () {
            return name;
        },
        setIsEmpty: function (isEmpty) {
            var that = this;
            that.set("isEmpty", isEmpty);
        },
        setUserId: function (id) {
            var that = this;
            that.set("userId", id);
        },
        setFolderUserId: function (id) {
            var that = this;
            that.set("folderUserId", id);
        },
        setPatientId: function (id) {
            var that = this;
            that.set("patientId", id);
        },
        setIsDependent: function (isDependent) {
            var that = this;
            that.set("isDependent", isDependent);
        },
        setCopyFolders: function (folders) {
            var that = this;
            that.set("toCopyFolders", folders);
        },
        setConsultationId: function (consultationId) {
            var that = this;
            that.set("consultationId", consultationId);
        },
        showSpinner: function () {
            var newDiv;
            if (app.snapFileService.addSpinnerAboveOverlayOption) {
                var elem = $(".filesharing-overlay").parent();
                for (var i = 0; i < $(".filesharing-overlay").length; i++) {
                    var currentOverlay = $($(".filesharing-overlay")[i]);
                    newDiv = $('<div style="background-color:#CCC;height:' + currentOverlay.css("height") + ';width: ' +
                        $(".filesharing-overlay")[i].clientWidth + 'px;z-index: 3;position: absolute; left: ' + currentOverlay.css("left") + '; top: '
                        + currentOverlay.css("top") + '; -moz-opacity: 0.3;opacity:0.3;filter: alpha(opacity=0.3);" class="snapLoadDiv">',
                        { id: 'snapLoadDiv' });
                    if (newDiv.width() > 0) {
                        $(newDiv).append('<img src="../../images/loader.gif" style="position:relative; top:50%; left:50%;"/>');
                    }
                    elem.prepend(newDiv);
                    $(newDiv).show();
                }
            } else {
                newDiv = $('<div style="background-color:#CCC;height: 100%;width: 100%;z-index: 3;position: absolute; left: 0; top: 0; -moz-opacity: 0.3;opacity:0.3;filter: alpha(opacity=0.3);" class="snapLoadDiv">', { id: 'snapLoadDiv' });
                $(newDiv).append('<img src="../../images/loader.gif" style="position:relative; top:50%; left:50%;"/>');
                $(".filesharing-overlay").prepend(newDiv);
                $(newDiv).show();
            }
        },
        hideSpinner: function () {
            if ($('.snapLoadDiv').length) {
                $('.snapLoadDiv').remove();
            }
        },

        __renderFolder: function (data, tagText, clsColor) {
            var that = this;

            if (data != null && data.total > 0) {
                that.buildFromResponse(data.data[0].snapFile, data.data[0].myFolderSize, data.data[0].myFolderSizeBytes, data.data[0].myFolderMaxSize);
                that.createBreadcrumbs();

                /**/
                if (isEmpty(app.snapFileService.gTagText))
                    app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);

                if ((app.snapFileService.findActiveViewModel(that) == "patientTopView") &&
                    (isEmpty(app.snapFileService.gBottomTagText)))
                    app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);

                if ((app.snapFileService.findActiveViewModel(that) != "patientTopView") &&
                   (isEmpty(app.snapFileService.gBottomTagText)) &&
                     (isEmpty(app.snapFileService.gTagText)))
                    app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);

                that.callDragDrop();
                if (app.snapFileService.fSharingListDetailsSH != null)
                    app.snapFileService.fSharingListDetailsSH();
                that.removeSortClass();
                that.colorFirstTag(tagText, clsColor);

                that.hideSpinner();

                if (app.snapFileService.viewModel) {
                    app.snapFileService.viewModel.isBulkActive = false;
                }
                if (app.snapFileService.bottomViewModel) {
                    app.snapFileService.bottomViewModel.isBulkActive = false;
                }
            }
        },

        loadFromUserId: function (folder, tagText) {
            var that = this;
            that.showSpinner();

            var fsType = app.snapFileService.fileSharingType;

            var path = folder
                ? snap.string.formatString("/api/v2/filesharing/folder/{0}/{1}", fsType, folder)
                : snap.string.formatString("/api/v2/filesharing/folder/{0}", fsType);

            if (tagText) {
                path = snap.string.formatString("/api/v2/filesharing/folder/{0}/tag", fsType);
            }

            var query = {
                patientId: that.patientId || undefined,
                adminStaffId: snap.staffAdminId || undefined,
                consultationId: snap.consultationId || undefined,
                tag: tagText || undefined
            };

            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: query,
                timeout: 120000,
                beforeSend: function (xhr) {
                    if (snap.userSession && snap.userSession.token) {
                        xhr.setRequestHeader("Authorization", "Bearer " + snap.userSession.token);
                    }
                    if (snap.apiDeveloperId) {
                        xhr.setRequestHeader("X-Developer-Id", snap.apiDeveloperId);
                    }
                    if (snap.apiKey) {
                        xhr.setRequestHeader("X-Api-Key", snap.apiKey);
                    }
                },
                success: function (data) {
                    that.hideSpinner();

                    that.__renderFolder(data, tagText);

                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error")
                        snapError("The user does not have permissions for hospital consultation folders.");
                    else
                        snapError(error);

                    that.hideSpinner();
                    if (snap['util']) {
                        snap.util.disableTab('files');
                        snap.util.logToConsole(xhr);
                    }
                    that.hideSpinner();
                }
            });
        },
        colorFirstTag: function (tagText, clsColor) {
            if (!tagText)
                return;

            var that = this;

            if (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer) {
                if (clsColor == undefined)
                    $('#topFiles ul.ulT li:first-child').addClass("selectedTag");
                else
                    $('#topFiles ul.ulT li:first-child').removeClass("selectedTag");
            }
            else {
                if (that.userId == that.folderUserId || that.folderUserId ==undefined) {
                    if (clsColor == undefined)
                        $('#topFiles ul.ulT li:first-child').addClass("selectedTag");
                    else
                        $('#topFiles ul.ulT li:first-child').removeClass("selectedTag");
                }
                else {
                    if (clsColor == undefined)
                        $('#bottomFiles ul.ulT li:first-child').addClass("selectedTag");
                    else
                        $('#bottomFiles ul.ulT li:first-child').removeClass("selectedTag");
                }
            }
        },
        load: function (folder, preloadedData) {

            if (preloadedData) {
                this.__renderFolder(preloadedData, app.snapFileService.gTagText, null);
                return;
            }

            var that = this;

            if (app.snapFileService.gTagText.toString().trim().length > 0)
                app.snapFileService.viewModel.loadFromUserId(null, app.snapFileService.gTagText);
            else
                that.loadFromUserId(folder, '');
        },

        loadConsultation: function (consultationId) {
            var that = this;
            that.setIsSpinnerShow(true);
            that.setHasAttachedFile(false);
            var path = snap.string.format('/api/consultation/filesharing/{0}/folder?fileSharingType={1}&patientId={2}', consultationId, app.snapFileService.fileSharingType, that.patientId);

            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data != null && data.total > 0) {
                        that.buildFromResponse(data.data[0].snapFile, data.data[0].myFolderSize, data.data[0].myFolderMaxSize);
                        that.createBreadcrumbs();

                        if ( isEmpty(app.snapFileService.gTagText) )
                            app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);

                        if ((app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer) &&
                           ( isEmpty(app.snapFileService.gBottomTagText) ))
                            app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);

                        if ((app.snapFileService.fileSharingType != app.snapFileService.filesharing_customer) &&
                           ( isEmpty(app.snapFileService.gBottomTagText)) &&
                             ( isEmpty(app.snapFileService.gTagText)))
                            app.snapFileService.snapDestinationFolder = that.getDestinationFolder(app.snapFileService, that);
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error"){
                        snapError("The user does not have permissions for hospital consultation folders.");
                    }
                    else if (xhr.status === 500 && !!xhr.responseJSON && xhr.responseJSON.exceptionMessage.indexOf("NotFound") !== -1) {
                        snapError("File sharing folder is already removed");
                    }
                    else {
                        snapError(error);
                    }

                    if (snap.noConsultationIndex && snap.noConsultationIndex != undefined) {
                        that.setIsSpinnerShow(false);
                        that.setHasAttachedFile(true);
                    }
                }
            });
        },

        fileType: function () {
            var that = this;
            if (that.isFolder)
                return 'folder';

            if (that.type != null && that.type != '') {
                if (that.type.indexOf("text") > -1)
                    return 'text';
                else if (that.type.indexOf("spreadsheet") > -1)
                    return 'xlsx';
            }
            return '';
        },

        checkFileExtension: function (type, extension) {
            var existingFileImg = ["aac", "ai", "aiff", "asp", "avi", "bpm", "c", "cpp", "css",
                      "dat", "dmg", "doc", "docx", "dot", "dotx", "dwg", "dxf", "eps", "exe",
                       "flv", "gif", "h", "html", "ics", "iso", "java", "jpg", "key", "m4v", "mid",
                       "mov", "mp3", "mp4", "mpg", "odp", "ods", "odt", "otp", "ots", "ott", "pdf",
                       "php", "png", "pps", "ppt", "psd", "py", "qt", "rar", "rb",
                        "rtf", "sql", "tqa", "tgz", "tiff", "txt", "wav", "xls", "xlsx", "xml",
                       "yml", "zip"];


            var audioExtension = ['3gp', 'act', 'aiff', 'aac', 'au', 'awb', 'dct', 'dss', 'dvf', 'flac', 'gsm',
                                 'iklax', 'ivs', 'mmf', 'mpc', 'msv', 'ogg', 'ra', 'rm', 'opus', 'raw', 'sln', 'tta',
                                 'vox', 'wav', 'wma', 'flac', 'zab', 'arf', 'cda', 'wpl', 'avr', 'sesx', 'fls', 'cs3', 'vlp'];


            var vedioExtension = ['aep', 'wp3', 'rms', 'dzm', 'psh', 'veg', 'sbk', 'wpl', 'usm', 'sfd', 'piv', 'dir', 'trp',
                                 'swf', 'webm', 'wlmp', 'm2p', 'mpeg', 'vro', '3gp2', 'bdmv', 'dzt', 'fcp', 'gfp', 'm21', 'mswmm',
                                 'mvp', 'rdb', 'rmp', 'rv', 'screenflow', 'swt', 'vcpf', 'viewlet', 'dnc', 'avi', 'mkv', '3gp', 'vob',
                                 'scm', 'srt', 'webm', 'm4a', 'wmv', 'mani', 'meta', 'rec', 'tp', 'bik', 'dzp', 'msdvd', 'mob', 'fbr', 'bnp',
                                 'mp4.infovid', 'ts', 'aepx', 'prproj', 'amc', 'mnv', 'mproj', 'bin', 'nvc', 'ism', 'swi', 'amx', 'ifo',
                                 'r3d', 'kmv', 'asf', 'hdmov', 'mts', 'pds', 'pac', 'trec', 'vc1', 'wmx', 'bu', 'mmv', 'vp3', 'mpg',
                                 'cpi', 'f4v', 'mov', 'mp4', 'bdm', 'scc', 'gvi', 'amc', 'mnv', 'mproj', 'bin', 'vnc', 'ism', 'swi',
                                 'amx', 'ifo', 'r3d', 'kmv', 'asf', 'hdmov', 'mts', 'pds', 'pac', 'trec', 'vcl', 'wmx', 'bu', 'mmv',
                                 'vp3', 'mpg', 'cpi', 'f4v', 'bdm', 'playlist', 'roq', 'nsv', '3g2', '3gp', 'svi', 'm2v', 'rmvb'];

            if (type == 'existing')
                return existingFileImg.indexOf(extension) > -1;
            else if (type == 'audio')
                return audioExtension.indexOf(extension) > -1;
            else if (type == 'vedio')
                return vedioExtension.indexOf(extension) > -1;
        },

        getDestinationFolder: function (snapViewModel, that) {
            var f = new kendo.data.ObservableArray({});

            if ((app.snapFileService.gBottomTagText.toString().trim().length > 0 || app.snapFileService.gTagText.toString().trim().length > 0) ) {
                return app.snapFileService.snapDestinationFolder;
            }

            if (snapViewModel.fileSharingType === snapViewModel.filesharing_customer || that.patientId === 0) {
                if (snapViewModel.bottomViewModel != null) {
                    if (!snap.isHospitalAdminFile && snapViewModel.bottomViewModel.isWritable)
                        f.push(snapViewModel.bottomViewModel.clone(false, 'Patient'));

                    snapViewModel.bottomViewModel.folders.forEach(function (folder) {
                        if (folder.isWritable)
                            f.push(folder.clone(false, 'Patient'));
                    })
                }

                if (snapViewModel.viewModel.parents[0] && snapViewModel.viewModel.parents[0].isWritable)
                    f.push(snapViewModel.viewModel.parents[0].clone(false, 'My Files'));

                snapViewModel.viewModel.folders.forEach(function (folder) {
                    if (folder.isWritable)
                        f.push(folder.clone(false, 'My Files'));
                })

            }
            else {
                if (snapViewModel.bottomViewModel !== null && snapViewModel.viewModel.isWritable) {
                    f.push(snapViewModel.viewModel.clone(false, 'My Files'));

                    snapViewModel.viewModel.folders.forEach(function (folder) {
                        if (folder.isWritable)
                            f.push(folder.clone(false, 'My Files'));
                    })
                }

                if (snapViewModel.bottomViewModel.parents[0] && snapViewModel.bottomViewModel.parents[0].isWritable)
                    f.push(snapViewModel.bottomViewModel.parents[0].clone(false, 'Patient'));

                snapViewModel.bottomViewModel.folders.forEach(function (folder) {
                    if (folder.isWritable)
                        f.push(folder.clone(false, 'Patient'));
                })
            }
            return f;
        },

        fileIcon: function () {
            var that = this;

            if (that.isFolder) {
                return '/images/icon-folder.png';
            } else {
                var parts = that.name.split('.');
                var extension = parts[parts.length - 1];

                var existingFileStatus = that.checkFileExtension('existing', extension);
                var audioFileStatus = that.checkFileExtension('audio', extension);
                var vedioFileStatus = that.checkFileExtension('vedio', extension);

                if (!existingFileStatus) {
                    if (vedioFileStatus) {
                        extension = "mov";
                    } else if (audioFileStatus) {
                        extension = "wav";
                    } else {
                        extension = "iso";
                    }
                }
                return '/images/filetypes/png/' + extension + '.png';
            }
        },

        Paperclip: function () {
            var that = this;
            return that.isAttachedToConsultation ? 'icon_attachment circle_paperclip margin_paperclip_img' : '';
        },

        checkPermission: function (that, msg) {
            if (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer)
                return true;

            if (that.userId == that.folderUserId) {//my files
                if (app.snapFileService.roles.indexOf(app.snapFileService.viewMyFileRole) == -1) {
                    snapError(msg);
                    return false;
                }
            }
            else {//patient file
                if (app.snapFileService.roles.indexOf(app.snapFileService.copyPatientFileRole) == -1) {
                    snapError(msg);
                    return false;
                }
            }
            return true;
        },
        checkCopyPermission: function (that, msg) {
            if (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer)
                return true;

            if (that.userId == that.copyFolder.folderUserId && that.userId == that.folderUserId) {//my files
                if (app.snapFileService.roles.indexOf(app.snapFileService.viewMyFileRole) == -1) {
                    snapError(msg);
                    return false;
                }
            }
            else {//patient file
                if (app.snapFileService.roles.indexOf(app.snapFileService.copyPatientFileRole) == -1) {
                    snapError(msg);
                    return false;
                }
            }
            return true;
        },
        filesSelected : function() {
            return $(".chbBulk:visible:checked").toArray().length;
        },
        download: function () {
            if (!this.checkPermission(this, "You do not have permission to download these items.")) {
                return;
            }

            var entities = this.getIsBulkActive()
                ? $.grep(this.parent(), function(e) { return e.bulkChecked; })
                : [this];

            if (entities.length === 0) {
                snapError("Please select at least one item.");
                return;
            }

            var fileIds = $.map(entities,
                function(e) {
                    if (e.isFolder) {
                        return undefined;
                    }
                    return e.id;
                });

            var folderIds = $.map(entities,
                function (e) {
                    if (!e.isFolder) {
                        return undefined;
                    }
                    return e.id;
                });

            $.ajax({
                url: "/api/v2.1/filesharing/downloads",
                type: "POST",
                data: JSON.stringify({
                    fileIds: fileIds,
                    folderIds: folderIds
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (downloadId) {
                    var downloadUrl = "/api/downloads/" + downloadId;

                    var $iframe = $('#download-iframe');

                    if ($iframe.length === 0) {
                        $iframe = $('<iframe id="download-iframe" style="display: none;"/>').appendTo($('body'));
                    }

                    $iframe.attr({
                        src: downloadUrl
                    });
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error") {
                        snapError("The user does not have permissions to download these items.");
                    } else {
                        snapError(error);
                    }
                }
            });
        },
        share: function () {
            var that = this;

            if (!that.checkPermission(that, 'You do not have permission to share file.')) {
                return;
            }

            var path = snap.string.format('/api/v2/filesharing/file/g/{0}/share?consultationId={1}', that.id, snap.consultationId || "");

            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.data[0].success) {
                        var bufA = document.createElement('a');
                        bufA.href = data.data[0].url;
                        $("#share-file-url").text(bufA.href);

                        app.snapFileService.shareWindow.open();

                        $(".share-file .cancel").bind("click", function () {
                            app.snapFileService.shareWindow.close();
                        });
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error")
                        snapError("You do not have permission to share file.");
                    else
                        snapError(error);
                    snap.util.logToConsole(xhr);
                }
            });
        },
        copy: function () {
            var that = this;
                var f = new kendo.data.ObservableArray({});
                var _folders = new kendo.data.ObservableArray({});
                var vmFolder = that.getDestinationFolder(app.snapFileService, that);
                var copyVmFolder = that.getDestinationFolder(app.snapFileService, that);

                if (app.snapFileService.gTagText.toString().trim().length > 0)
                    vmFolder = app.snapFileService.snapDestinationFolder;

                vmFolder.forEach(function (entry) {
                    f.push(entry);
                });

                f.forEach(function (contain) {
                    var i = 0;
                    copyVmFolder.forEach(function (entry) {
                        i++;
                        if (entry != undefined && entry.name == contain.name)
                            copyVmFolder = copyVmFolder.splice(i, 1);
                    });
                });

                copyVmFolder.forEach(function (entry) {
                    f.push(entry);
                });

                kendo.bind($("#copy-file-popup"), that);
                f.forEach(function (entry) {
                    if (app.snapFileService.deletedFolder.indexOf(entry.id) !== -1) {
                        return;
                    }

                    if (that.getIsBulkActive()
                        && $.grep(that.parent(), function(e) { return e.bulkChecked && e.id === entry.id }).length > 0) {
                        return;
                    }

                    if (!that.getIsBulkActive() && that.id === entry.id) {
                        return;
                    }

                    _folders.push(entry);
                });

                var bulkCount = $.map(that.parent(),
                    function (fe) {
                        if (!fe.bulkChecked) {
                            return undefined;
                        }
                        return true;
                    }).length;

                if (that.getIsBulkActive() && bulkCount === 0) {
                    snapError("Please select at least one item.");
                    return;
                }

                that.setCopyFolders(_folders);
                app.snapFileService.copyWindow.open();
                $(".copy-file .cancel").bind("click", function () {
                    app.snapFileService.copyWindow.close();
                });
        },
        copyComplete: function () {
            var that = this;
            if (that.copyFolder && that.copyFolder.id) {

                if (!that.checkCopyPermission(that, 'You do not have permission to copy file.'))
                    return;

                that.showSpinner();

                if (that.getIsBulkActive()) {
                    var copyPromises = $.map(that.parent(),
                        function(f) {
                            if (!f.bulkChecked) {
                                return undefined;
                            }

                            return that.copyFile(f, that.copyFolder);
                        });

                    $.when.apply(this, copyPromises).then(that.hideSpinner, that.hideSpinner);
                } else {
                    that.copyFile(that, that.copyFolder).then(that.hideSpinner, that.hideSpinner);
                }
            } else {
                snapInfo("Please select destination folder to copy file.");
            }

            app.snapFileService.copyWindow.close();
        },

        copyFile: function (file, folder) {
            var id = file.id;
            var url = snap.string.format("/api/v2/filesharing/{0}/g/{1}/copy/{2}?consultationId={3}", file.isFolder ? "folder" : "file", id, folder.id, snap.consultationId || "");

            return $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data == null)
                        return;

                    if (data.data[0].success) {
                        var dataId = data.data[0].snapFile.id;

                        if (app.snapFileService.isSideView || app.snapFileService.consultStatus) {
                            if (app.snapFileService.bottomViewModel != null && app.snapFileService.bottomViewModel.id !== dataId) {
                                app.snapFileService.bottomViewModel.load(app.snapFileService.bottomViewModel.id);
                            }

                            if (app.snapFileService.viewModel != null && app.snapFileService.viewModel.id !== dataId) {
                                app.snapFileService.viewModel.load(app.snapFileService.viewModel.id);
                            }

                        } else {
                            if (app.snapFileService.bottomViewModel != null && app.snapFileService.bottomViewModel.id === dataId) {
                                app.snapFileService.bottomViewModel.load(app.snapFileService.bottomViewModel.id);
                            }

                            if (app.snapFileService.viewModel != null && app.snapFileService.viewModel.id === dataId) {
                                app.snapFileService.viewModel.load(app.snapFileService.viewModel.id);
                            }

                        }

                        if (file.isFolder) {
                            snapSuccess("The folder was copied successfully.");
                        } else {
                            snapSuccess("The file was copied successfully.");
                        }
                    } else {
                        if (file.isFolder) {
                            snapInfo("A folder with the same name already exists in the destination folder.");
                        } else {
                            snapInfo("A file with the same name already exists in the destination folder.");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error") {
                        snapError("You do not have permission to copy the file.");
                    } else if (xhr.status === 409) {
                        if (file.isFolder) {
                            snapInfo("A folder with the same name already exists in the destination folder.");
                        } else {
                            snapInfo("A file with the same name already exists in the destination folder.");
                        }
                    } else {
                        snapError(error);
                    }
                    snap.util.logToConsole(xhr);
                }
            }).promise();
        },

        onChange: function () { },

        attachToConsult: function () {
            var items = this.getIsBulkActive()
                ? $.grep(this.parent(), function (f) { return f.bulkChecked; })
                : [this];

            if ($.grep(items, function(f) { return f.isFolder; }).length > 0) {
                snapError("Folders are not supported for Attach operation.");
                return;
            }

            if (items.length === 0) {
                snapError("Please select at least one item.");
                return;
            }

            var that = this;
            var attachPromises =  $.map(items, function(item) {
                return that.attachToConsultSingle(item);
            });

            $.when.apply(this, attachPromises).then(function () {
                if (app.snapFileService.bottomViewModel !== null) {
                    app.snapFileService.bottomViewModel.load(app.snapFileService.bottomViewModel.id);
                }
                if (app.snapFileService.viewModel !== null) {
                    app.snapFileService.viewModel.load(app.snapFileService.viewModel.id);
                }
            });
        },

        attachToConsultSingle: function (item) {
            if (!item.isFolder && snap.consultationId > 0) {
                var url = snap.string.format('/api/v2/filesharing/file/g/{0}/attach/{1}', item.id, snap.consultationId || "");
                return $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        if (data != null) {
                            if (data.data[0].success) {
                                snapSuccess("File attached successfully.");
                            } else {
                                snapInfo("This file has already been attached to the consultation.");
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 403 && status === "error")
                            snapError("You do not have permission to share file.");
                        else
                            snapError(error);

                        snap.util.logToConsole(xhr);
                    }
                }).promise();
            }

            return $.when();
        },
        sizeInKb: function () {
            var that = this;
            return Math.round(that.size / 1000.0, 2).toString() + " Kb";
        },
        getFileSharingTags: function (folderUserId) {
            var that = this;
            var path = '/api/filesharingtags/' + folderUserId;
            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data != null)
                        that.setAutoTags(data);
                },
                error: function () {
                    var errMsg = snap.string.format("The load of {0} tags failed.", 'file');

                    if (that.isFolder)
                        errMsg = snap.string.format("The load of {0} tags failed.", 'folder');

                    snapError(errMsg);
                }
            });
        },
        selectedValue: null,
        addTag: function () {
            var that = this;
            var _tags = that.get('tags');
            var duplicateTag = false;
            var _tagId = that.get('selectedValue.tagId');
            var _tagText = $('#txtTag').val().trim();
            if (_tagText == "" || _tagText.length == 0) {
                snapError('Please enter a tag');
                $('#txtTag').val('');
                $('#txtTag').focus();
                return;
            }

            if (_tagId == null || _tagId == 'undefined')
                _tagId = -1;

            _tags.forEach(function (tagTxt) {
                if (_tagText == tagTxt.tag) {
                    duplicateTag = true;
                }
            });

            if (duplicateTag) {
                var msg = snap.string.format("Tag already exist for this {0}", that.isFolder ? "folder" : "file");
                snapError(msg);
                return;
            }

            var params = {
                TagId: _tagId,
                Tag: _tagText,
                IsFolder: that.isFolder,
                FileFolderId: that.id,
                FolderUserId: that.folderUserId > 0 ? that.folderUserId : that.userId
            };

            var path = snap.string.format("/api/filetags?consultationId={0}", snap.consultationId || "");
            $.ajax({
                url: path,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(params),
                success: function (data) {
                    if (data != null) {
                        _tags.push({ tagFileId: data.tagFileId, tagId: data.tagId, tag: data.tag, isFolder: data.isFolder, fileFolderId: data.fileFolderId, folderUserId: data.folderUserId });

                        that.setTags(_tags);
                        setTimeout(function () {
                            if (app.snapFileService.findActiveViewModel(that) == "topView")
                                that.colorFirstTag(app.snapFileService.gTagText);
                            else
                                that.colorFirstTag(app.snapFileService.gBottomTagText);
                        }, 200);
                        $('#txtTag').val('');
                        that.updateTagProperties();
                        snapSuccess("The tag was created successfully.");
                        $('#txtTag').focus();
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error")
                        snapError("You do not have permission to create tag.");
                    else
                        snapError(error);

                    snap.util.logToConsole(xhr);
                    $('#txtTag').val('');
                    $('#txtTag').focus();
                }
            });
        },
        removeTag: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var that = this;
            var _tagFileId = $(e.target).data('tag-id');

            var path = snap.string.format("/api/filetags/{0}?consultationId={1}", _tagFileId, snap.consultationId || "");
            $.ajax({
                url: path,
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    var _tags = that.get("tags");
                    for (var i = 0; i < _tags.length; i++) {
                        if (_tags[i].tagFileId == _tagFileId) {
                            _tags.splice(i, 1);
                            break;
                        }
                    }
                    that.setTags(_tags);
                    that.updateTagProperties();

                    if (app.snapFileService.findActiveViewModel(that) == "topView")
                        that.colorFirstTag(app.snapFileService.gTagText);
                    else
                        that.colorFirstTag(app.snapFileService.gBottomTagText);

                    snapSuccess("The tag was removed successfully.");
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 403 && status === "error")
                        snapError("You do not have permission to removed the tag.");
                    else
                        snapError(error);
                }
            });
        },
        updateTagProperties: function () {
            var that = this;
            var _tags = that.get("tags");

            that.set("isTag2ToolTipVisible", false);

            var _firstTwoTags = new kendo.data.ObservableArray({});
            if (_tags.length > 0)
                _firstTwoTags.push(_tags[0]);
            if (_tags.length > 1)
                _firstTwoTags.push(_tags[1]);

            that.setFirstTwoTags(_firstTwoTags);

            var _tootTipTags = new kendo.data.ObservableArray({});
            for (var k = 2; k < _tags.length; k++) {
                _tootTipTags.push(_tags[k]);
            }
            that.setToottipTags(_tootTipTags);

            if (_tags.length > 2) {
                that.set("isTag2ToolTipVisible", true);
                var _tag2TooltipNumber = '..' + (_tags.length - 2);
                that.setTag2TooltipNumber(_tag2TooltipNumber);
            }
        },
        properties: function () {
            var that = this;
            that.getFileSharingTags(that.folderUserId ? that.folderUserId : that.userId);

            kendo.bind($("#file-properties-popup"), that);
            app.snapFileService.propertiesWindow.open();

            var title = that.isFolder ? "Folder Property" : "File Property";
            $("#file-properties-popup_wnd_title").text(title);

            setTimeout(function () {
                $('#txtTag').focus();
                $('#txtTag').attr('maxlength', '100');
            }, 500);

            $(".file-properties .cancel").bind("click", function () {
                app.snapFileService.propertiesWindow.close();
            });
        },
        searchTag: function (e) {
            var that = this;
            var _tagText = $(e.target).data('tag-tagtext');
            var uploader = $("#file-sharing .k-upload");
            app.snapFileService.gTagText = _tagText;

            var cls = e.currentTarget.className;
            if ((cls.split(" "))[1] == undefined) {
                if (app.snapFileService.findActiveViewModel(that) == "topView")
                    app.snapFileService.gTagText = _tagText;
                else {
                    app.snapFileService.gBottomTagText = _tagText;
                }
            } else {
                if (app.snapFileService.findActiveViewModel(that) == "topView")
                    app.snapFileService.gTagText = "";
                else {
                    app.snapFileService.gBottomTagText = "";
                }

                _tagText = "";
            }
            uploader.hide();

            if (that.userId == that.folderUserId || that.folderUserId ==undefined) {
                app.snapFileService.viewModel.loadFromUserId(null, _tagText);
            } else {
                app.snapFileService.bottomViewModel.loadFromUserId(null, _tagText);
            }
        },
        delete: function() {
            var items = this.getIsBulkActive()
                ? $.grep(this.parent(), function(f) { return f.bulkChecked; }) 
                : [this];

            var multipleItems = items.length > 1;
            
            if (items.length === 0) {
                snapError("Please select at least one item.");
                return;
            }

            var singleItemName = items[0].name;

            var errMsg = snap.string.format("You do not have permission to delete {0}.", multipleItems ? "these items" : singleItemName);

            if (!this.checkPermission(this, errMsg)) {
                return;
            }

            kendo.bind($("#delete-folder-popup"), {
                name: singleItemName,
                multipleItems: multipleItems,
                itemCount: items.length
            });

            app.snapFileService.confirmWindow.open();

            $('.delete-confirmation_no').unbind('click');
            $("#delete-confirmYes").unbind('click');

            $(".delete-confirmation_no").bind("click", function () {
                app.snapFileService.confirmWindow.close();
            });

            var that = this;
            $("#delete-confirmYes").bind("click", function () {
                that.showSpinner();

                var deletePromises = $.map(items, function (f) { return that.deleteSingleFile(f); });

                $.when.apply(that, deletePromises).then(that.hideSpinner, that.hideSpinner);

                app.snapFileService.confirmWindow.close();
            });
        },
        deleteSingleFile: function (file) {
            var id = file.id;
            var url = snap.string.format("/api/v2/filesharing/{0}/g/{1}?consultationId={2}", file.isFolder ? "folder" : "file", id, snap.consultationId || "");

            return $.ajax({
                url: url,
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    app.snapFileService.viewModel.load(app.snapFileService.viewModel.id, resp);

                    if (resp != null && resp.data[0].success) {
                        $("#" + id).remove();
                        if (file.isFolder) {
                            app.snapFileService.deletedFolder.push(id);
                            snapSuccess("The folder was deleted successfully.");
                        }
                        else {
                            app.snapFileService.deletedFile.push(id);
                            snapSuccess("The file was deleted successfully.");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 404 && status === "error")
                        snapError("Folder was not found.");
                    else if (xhr.status === 403 && status === "error")
                        snapError("You have no permissions to delete.");
                    else
                        snapError(error);

                    snap.util.logToConsole(xhr);
                }
            }).promise();
        },
        drill: function () {
            var that = this;
            app.snapFileService.gTagText = "";
            if (app.snapFileService && app.snapFileService.setupDragDrop) {
                app.snapFileService.setupDragDrop(that);
            }

            if (app.snapFileService && app.snapFileService.findActiveViewModel) {
                if (app.snapFileService.findActiveViewModel(that) == 'topView')
                    app.snapFileService.gTagText = "";
                else {
                    app.snapFileService.gBottomTagText = "";
                }
            }

            if (that.isFolder) {
                if (that.patientId == null || that.patientId == 0 || app.snapFileService.bottomViewModel == null) {
                    app.snapFileService.viewModel.load(that.id);
                    $("#topFiles > .k-upload").slideUp();
                } else {
                    app.snapFileService.bottomViewModel.load(that.id);
                    $("#bottomFiles > .k-upload").slideUp();
                }

                if (that.patientId > 0 && !that.isDependent) {
                    app.snapFileService.breadcrumbPatientFolderId = that.id;
                    app.snapFileService.breadcrumbPatientFolderName = that.name;

                } else {
                    app.snapFileService.breadcrumbMyFolderId = that.id;
                    app.snapFileService.breadcrumbMyFolderName = that.name;
                }
            }
        },

        mkdir: function (e) {
            var that = this;
            if (!app.snapFileService.uploadValidation(e))
                return false;

            kendo.bind($("#new-folder-popup"), that);
            app.snapFileService.newFolderWindow.open();

            setTimeout(function () {
                $('#newFolderName').focus();
            }, 500);

            $(".new-folder .cancel").bind("click", function () {
                app.snapFileService.newFolderWindow.close();
                $("#newFolderName").val('');
            });

        },
        mkdirComplete: function () {
            var that = this;
            var folderName = $("#newFolderName").val().toString().trim();
            snapRemoveErrorNotification();
            if (!that.checkPermission(that, 'You do not have permission to create folder.'))
                return;

            if (folderName.length > 125) {
                snapError("Please enter no more than 125 characters for a folder name.");
                return;
            }

            app.snapFileService.breadcrumbMyFolderName = app.snapFileService.breadcrumbMyFolderName == "" ? "Home" : app.snapFileService.breadcrumbMyFolderName;
            app.snapFileService.breadcrumbPatientFolderName = app.snapFileService.breadcrumbPatientFolderName == "" ? "Patient Home" : app.snapFileService.breadcrumbPatientFolderName;

            var folder = that;
            if (!that.isFolder) {
                if (that.patientId == null || that.patientId === 0) {
                    folder = app.snapFileService.viewModel;
                } else {
                    folder = app.snapFileService.bottomViewModel;
                }
            }

            if (folderName == "") {
                snapError("Please enter folder name");
                return;
            }

            if (that.patientId == null || (that.folderUserId != that.patientId)) {
                for (var i = 0; i < app.snapFileService.viewModel.folders.length; i++) {
                    if (app.snapFileService.viewModel.folders[i].name == $("#newFolderName").val().trim() && (app.snapFileService.deletedFolder).indexOf(app.snapFileService.viewModel.folders[i].id) == -1
                         && (app.snapFileService.breadcrumbMyFolderId == that.id)) {
                        snapError("Folder with that name already exist");
                        return;
                    }
                }
            }
            else {
                for (var i = 0; i < app.snapFileService.bottomViewModel.folders.length; i++) {
                    if (app.snapFileService.bottomViewModel.folders[i].name == $("#newFolderName").val().trim() && (app.snapFileService.deletedFolder).indexOf(app.snapFileService.bottomViewModel.folders[i].id) == -1
                        && (app.snapFileService.breadcrumbPatientFolderId == that.id)) {
                        snapError("Folder with that name already exist");
                        return;
                    }
                }
            }

            if (!isValidFolderName($("#newFolderName").val().trim())) {
                snapError("Please enter a valid folder name");
                return;
            }

            that.showSpinner();

            var params = {
                patientId: that.patientId,
                consultationId: snap.consultationId,
                parent: folder.id,
                name: folderName
            };

            var url = snap.string.format('/api/v2/filesharing/folder/g?consultationId={0}', snap.consultationId || "");

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(params),
                success: function (data) {
                    if (data != null && (app.snapFileService.breadcrumbMyFolderName.slice(0, 11) == that.name.slice(0, 11) ||
                        app.snapFileService.breadcrumbPatientFolderName.slice(0, 11) == that.name.slice(0, 11))) {

                        if (that.patientId == null || that.patientId == 0 || app.snapFileService.bottomViewModel == null) {
                            app.snapFileService.viewModel.load(app.snapFileService.viewModel.id, data);
                        } else {
                            app.snapFileService.bottomViewModel.load(app.snapFileService.viewModel.id, data);

                        }
                    } else {
                        that.hideSpinner();
                    }

                    snapSuccess("The folder was created successfully.");
                },
                error: function (xhr, status, error) {
                        if (xhr.status === 403 && status === "error")
                            snapError("You do not have permission to removed the tag.");
                        else 
                            snapError("There was a problem creating your folder.");

                        snap.util.logToConsole(error);
                        that.hideSpinner();
                }
            });

            $("#newFolderName").val('');
            app.snapFileService.newFolderWindow.close();

        },
        search: function (e) {
            var that = this;
            var newAllFiles = new kendo.data.ObservableArray({});

            that.folders.forEach(function (folder) {
                if (folder.name.toLowerCase().indexOf($(e.target).val().toLowerCase()) > -1 && (app.snapFileService.deletedFolder).indexOf(folder.id) == -1) {
                    newAllFiles.push(folder);
                }
            });

            that.files.forEach(function (file) {
                if (file.name.toLowerCase().indexOf($(e.target).val().toLowerCase()) > -1 && (app.snapFileService.deletedFile).indexOf(file.id) == -1) {
                    newAllFiles.push(file);
                }
            });
           

            if (newAllFiles[0] == undefined)
                that.setIsSearchEmpty(true);
            else
                that.setIsSearchEmpty(false);

            that.setAllFiles(newAllFiles);
            if (app.snapFileService.findActiveViewModel(that) == "topView")
                that.colorFirstTag(app.snapFileService.gTagText);
            else {
                that.colorFirstTag(app.snapFileService.gBottomTagText);
            }

            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == 13) {
                e.preventDefault();
            }
        },

        preventEnter: function (e) {
            var that = this;
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == 13) {
                that.search(e);
            }
        },

        displayViewFile: function () {
            return false;
        },

        displayDownload: function () {
            return true;
        },

        displayBulk: function () {            
            var that = this;
            return that.filesSelected.length > 0;
        },
        displaySend: function () {
            var that = this;
            return !that.isFolder;
        },
        displayProperties: function () {
            return true;
        },
        setDragableClass: function () {
            var that = this;
            return that.isFolder ? "target1" : "draggable1";
        },
        setDragableClass2: function () {
            var that = this;
            return that.isFolder ? "thumb target1" : "thumb draggable1";
        },
        setDragableImage: function () {
            var that = this;
            return that.isFolder ? "targetImg" : "draggableImg";
        },
        displayCopy: function () {
            var that = this;
            return that.isWritable;
        },
        displayBulkDelete: function () {
            return true;
        },
        displayAddFolder: function () {
            var that = this;
            return that.isFolder && that.isWritable && app.snapFileService.fileSharingType != app.snapFileService.filesharing_admin;
        },
        displayDeleteFolder: function () {
            var that = this;
            return that.isFolder && that.isRemovable && (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer || that.patientId == 0) && app.snapFileService.has_delete_permission;
        },
        displayDeleteFile: function () {
            var that = this;
            return !that.isFolder && that.isRemovable && (app.snapFileService.fileSharingType == app.snapFileService.filesharing_customer || that.patientId == 0) && app.snapFileService.has_delete_permission;
        },
        displayAttachConsult: function () {
            var that = this;
            return app.snapFileService.consultStatus && !this.isFolder;
        },
        clear: function () {
            var that = this;

            that.setFiles([]);
            that.setFolders([]);
        },
        callDragDrop: function () {
            InitDragDrop();
        },
        displayTitle: function () {
            var that = this;
            return that.isFolder ? "Folder" : "File";
        },
        toggleBulk: function () {
            var $area;
            if (app.snapFileService.viewModel.id == this.id) {
                $area = $("#topFiles");
            } else if (app.snapFileService.bottomViewModel.id == this.id) {
                $area = $("#bottomFiles");
            } else {
                throw "FileSharing element not found";
            }

            $area.find(".chbBulk").toggle();            
            this.isBulkActive = !this.isBulkActive;
            $area.find(".liBulk").toggle();
            $area.find(".liMenu").toggle();
        }
    });


    var $mainHub = snap.hub.mainHub();
    var $fileSharingHub = snap.hub.fileSharingHub();

    var setupNotification = function (isCustomer) {
        $mainHub.register($fileSharingHub, isCustomer);
    };
    var subscribeNotification = function () {
    };

    app.snapFileService = {
        roles: "",
        viewMyFileRole: "28",
        viewPatientFileRole: "29",
        copyPatientFileRole: "30",
        manageHospitalFileRole: "31",
        manageStaffFiles: "40",
        fileSharingType: "",
        gTagText: "",
        gBottomTagText: "",
        consultationId: 0,
        userId: 0,
        bottomUserId: 0,
        consultStatus: false,
        viewModel: new SnapFileViewModel(),
        bottomViewModel: new SnapFileViewModel(),
        consultationFolder: '',
        propertiesWindow: null,
        shareWindow: null,
        copyWindow: null,
        newFolderWindow: null,
        confirmWindow: null,
        fSharingListDetailsSH: null,
        snapFilesCURDNotification: null,
        findActiveViewModel: function (t) {
            if (this.fileSharingType == this.filesharing_customer) {
                return 'patientTopView';
            }
            else {
                if (t.userId == t.folderUserId) {
                    return 'bottomView';
                }
                else {
                    return 'topView';
                }
            }
        },
        deleteWindow: null,
        deletedFile: [],
        deletedFolder: [],
        attachedConsultationFiles: [],
        uploadValidation: null,
        setupDragDrop: null,
        snapVmFiles: new kendo.data.ObservableArray({}),
        consultationViewModel: new SnapFileViewModel(),
        snapDestinationFolder: new SnapFileViewModel(),
        subscribeNotification: subscribeNotification,
        snapTopDestinationFolder: new SnapFileViewModel(),
        setupNotification: setupNotification,
        addSpinnerAboveOverlayOption: false,
        initSpinnerLoadOption: function () {
            this.addSpinnerAboveOverlayOption = true;
        },
        findSameDestination: function (tagetId, parentDragableId) {
            if (parentDragableId == "topTable" || parentDragableId == "topDivDragable") {
                var that = app.snapFileService.viewModel;
                app.snapFileService.breadcrumbPatientFolderName = app.snapFileService.breadcrumbPatientFolderName.trim().length == 0 ? "Patient Home" : app.snapFileService.breadcrumbPatientFolderName;
                if (that.id == tagetId) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (parentDragableId == "bottomTable" || parentDragableId == "bottomDivDragable") {
                if (app.snapFileService.bottomViewModel != null) {
                    app.snapFileService.breadcrumbMyFolderName = app.snapFileService.breadcrumbMyFolderName.trim().length == 0 ? "Home" : app.snapFileService.breadcrumbMyFolderName;
                    that = app.snapFileService.bottomViewModel;
                    if (that.id == tagetId)
                        return true;
                }
            }
            return false;
        },
        findById: function (id) {

            var that = app.snapFileService.viewModel;

            for (var i = 0; i < that.files.length; i++) {
                if (that.files[i].id == id) {
                    return that.files[i];
                }
            }

            if (that.id == id)
                return that;

            for (var i = 0; i < that.folders.length; i++) {
                if (that.folders[i].id == id) {
                    return that.folders[i];
                }
            }

            if (app.snapFileService.bottomViewModel != null) {
                that = app.snapFileService.bottomViewModel;
                for (var i = 0; i < that.files.length; i++) {
                    if (that.files[i].id == id) {
                        return that.files[i];
                    }
                }

                if (that.id == id)
                    return that;

                for (var i = 0; i < that.folders.length; i++) {
                    if (that.folders[i].id == id) {
                        return that.folders[i];
                    }
                }
            }

            return null;
        },
        fileExists: function (name, searchOn) {
            var that = app.snapFileService.viewModel;

            if (searchOn == null || searchOn == '')
                searchOn = 'both';

            if (searchOn == 'top' || searchOn == 'both') {
                for (var i = 0; i < that.files.length; i++) {
                    if (that.files[i].name == name) {
                        return true;
                    }
                }
            }

            that = app.snapFileService.bottomViewModel;
            if (searchOn == 'bottom' || searchOn == 'both') {
                for (var i = 0; i < that.files.length; i++) {
                    if (that.files[i].name == name) {
                        return true;
                    }
                }
            }

            return false;
        },
        filesharing_admin: "admin",
        filesharing_customer: "customer",
        filesharing_physician: "physician",
        filesharing_admin_all: "admin_all",
        has_delete_permission: true,

        breadcrumbMyFolderName: "",
        breadcrumbPatientFolderName: "",
        breadcrumbMyFolderId: "",
        breadcrumbPatientFolderId: "",
        maxFolderSize: '',
        sortAsc: true,
        isAdminStaffFileSharing: false,
        isSideView: false,
        DATE_REX: /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/
    };
})(window);
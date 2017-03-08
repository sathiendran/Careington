;
(function ($, global, snap) {


    snap.namespace("snap.admin").use(["Snap.DataService.notesDataService", "SnapNotification", "snap.SnapLoader"])
        .extend(kendo.observable)
        .define("patientNotesViewmodel", function ($notesService, $snapNotification, $snapLoader) {
            vm = this;
            this.notes = [];
            this.noteText = "";
            this.noteForEdit = {
                noteText: "",
                noteId: 0
            };
            this.patientId = 0;
            this.loadNoteForEdit = function (note) {
                this.set("noteForEdit", {
                    noteText: note ? note.comment : "",
                    noteId: note ? note.patientnotesid : 0
                });
            }
            this.closePopup = function () {
                vm.popup.close();
                vm.loadNoteForEdit();
            };
            this.updateNote = function () {
                $snapLoader.showLoader();
                var noteData = {
                    NotesDescription: vm.noteForEdit.noteText,
                    PatientNotesId: vm.noteForEdit.noteId
                };
                $notesService.editNote(noteData).done(function () {
                    vm.loadNotes().done(function () {
                        vm.closePopup();
                    }).always(function () {
                        $snapLoader.hideLoader();
                    });

                }).fail(function () {
                    $snapLoader.hideLoader();
                    if (xhr.status == 401) {
                        window.location = "/Admin/Login";
                    }
                    else {
                        $snapNotification.error(xhr.responseText);
                    }
                });
            }
            this.addNote = function () {
                $snapLoader.showLoader();
                var noteData = {
                    NotesDescription: this.noteText,
                    PatientId: this.patientId
                };
                $notesService.addNote(noteData).done(function () {
                    vm.loadNotes().done(function () {
                        vm.closePopup();
                    }).always(function () {
                        $snapLoader.hideLoader();
                    });

                }).fail(function () {
                    $snapLoader.hideLoader();
                    if (xhr.status == 401) {
                        window.location = "/Admin/Login";
                    }
                    else {
                        $snapNotification.error(xhr.responseText);
                    }
                });
            };
            this.editNote = function (note) {
                if (!this.popup) {
                    this.initializePatientNoteWindow();
                }
                this.loadNoteForEdit(note);
                this.popup.center();
                this.popup.open();
            };
            this.deleteNote = function (note) {
                $snapNotification.confirmationWithCallbacks("Do you really want to delete this note?", function () {
                    $snapLoader.showLoader();
                    $notesService.deleteNote(note.patientnotesid).done(function (response) {
                        if (response == "Success") {
                            $snapNotification.success('Note has been deleted successfully');
                            vm.loadNotes().always(function () {
                                $snapLoader.hideLoader();
                            });
                        }
                        else {
                            $snapNotification.error('Something went wrong!!!');
                            $snapLoader.hideLoader();
                        }
                    }).fail(function(error) {
                        $snapLoader.hideLoader();
                        $snapNotification.error(error.status + " - " + error.statusText);
                    
                    })
                });
            };
            this.initializePatientNoteWindow = function () {
                this.popup = $(".patient-notes-editor").kendoWindow({
                    modal: true,
                    maxWidth: 300,
                    pinned: false,
                    resizable: false,
                    visible: false,
                    //position: {
                    //    top: 100
                    //},
                    draggable: true,
                    title: 'Edit patient notes',
                    close: onClose,
                    actions: ["Close"]
                }).data("kendoWindow");

                function onClose() {
                    vm.loadNoteForEdit();
                }
                
                   
                
            }
            this.loadNotes = function (patientId) {
                var loadedPromise = $.Deferred();
                if (this.patientId == 0 && !!patientId) {
                    this.patientId = patientId;
                }
                if (!!this.patientId) {
                    $notesService.getNotes(this.patientId).done(function (response) {
                        var data = JSON.parse(response);
                        var notes = [];
                        for (var i = 0; i < data.length; i++) {
                            notes.push({
                                noteDate: data[i].NotesDate + '|' + data[i].NotesTime,
                                patientnotesid: data[i].PatientNotesId,
                                comment: data[i].NotesDescription,
                                editNote: function (e) {
                                    vm.editNote(e.data);
                                },
                                deleteNote: function (e) {
                                    vm.deleteNote(e.data);
                                }
                            });
                        }
                        vm.set("notes", notes);
                        loadedPromise.resolve();
                    }).fail(function () {
                        loadedPromise.reject();
                    }).always(function () {

                    });
                } else {
                    loadedPromise.reject();
                }
                return loadedPromise.promise();
            }
        });
})(jQuery, window, snap);

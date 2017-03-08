/// <reference path="../core/snap.core.js" />
/// <reference path="../core/snapHttp.js" />
/// <reference path="../jquery-2.1.3.js" />


; (function ($, snap) {
    "use strict";

    snap.namespace("snap.DataService").using(["snapHttp"]).define("notesDataService", function ($http) {

        this.getNotes = function (patientId) {
            return $http.get([snap.baseUrl, "/api/admin/patientnotes/", patientId].join(""));
        };
        this.addNote = function (data) {

            return $.ajax({
                type: "POST",
                url: [snap.baseUrl, "/api/admin/patientnotes/add"].join(""),
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        },
         this.editNote = function (data) {

             return $.ajax({
                 type: "PUT",
                 url: [snap.baseUrl, "/api/admin/patientnotes/edit"].join(""),
                 data: JSON.stringify(data),
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
             });
         },
        this.deleteNote = function (noteId) {

            return $.ajax({
                type: "POST",
                url: [snap.baseUrl, "/api/admin/patientnotes/", noteId, "/archive"].join(""),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });
        }
        
    }).singleton();

}(jQuery, window.snap = window.snap || {}));

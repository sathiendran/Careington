/// <reference path="../jquery-2.1.3.intellisense.js" />


; (function () {

    var session = null, publisher = null;
    var initSession = function (data) {
        session = OT.initSession(data.ApiKey, data.SessionId);
        session.on({
            streamCreated: function (event) {
               
                session.subscribe(event.stream, 'mainContainer', { insertMode: 'append', width: 400, height: 400 });
            }
        });
        session.connect(data.Token, function (error) {
            if (!error) {
                $("#shareKey").html(data.Id);
                publisher = session.publish('ownContainer', { name: "John", width: 100, height: 100 });
            }
        });
    };

    var stopConnection = function () {
        session.unpublish(publisher)
        publisher.destroy();
    };

    $(function () {
        $("#startPhysician").click(function () {
            $.getJSON("/api/TestVideo/VideoKey").then(function (data) {
                initSession(data);
            });
        });
        $("#startClient").click(function () {
            var key = $("#shareKey").val();
            var url = "/api/TestVideo/VideoShareKey/" + key;
            $.getJSON(url).then(function (data) {
                initSession(data);
            });
        });

        $("#stop").click(function () {
            stopConnection();
        });

    });

}());
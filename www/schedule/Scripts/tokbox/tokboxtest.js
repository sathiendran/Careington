/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />

// ReSharper disable CoercedEqualsUsing

; (function ($) {
    
    snap.namespace("snap.tokbox").use([]).define("TokboxTest", function () {
        var DEBUG = false;
        window.results = {};
        function debug() {
            if (DEBUG) {
                console.log.apply(console, arguments);
            }
        }

        var Config = {
            serverListUri: "https://www.tokbox.com/tools/connectivity/server.php",
            sessionId:"",
            token: ""
        };
        this.setSessionId = function (sessionId) {
            Config.sessionId = sessionId;
        };
        this.setToken = function (token) {
            Config.token = token;
        };
        


        var testConfig = {
            testAnvilConnection: {
                mappedName: "anvil"
            },
            testWebSocketSecureConnection: {
                mappedName: "mantis"
            },
            testTurnConnection: {
                mappedName: "turn"
            }
        }


        var OTDoc = {
            testAnvilConnection: function (server, callback) {
                var url = server + "/session/" + Config.sessionId + "?extended=true";
                var https = false;
                getSessionInfo("https://" + url, function (err) {
                    if (err) {
                        https = false;
                    } else {
                        https = true;
                    }
                    callback(https);
                });
            },

            testTurnConnection: function (server, callback) {
                var doneCount = 0;
                var udp = false;
                var tcp = false;

                // regular turn
                testTurn("turn:" + server, function (err) {
                    if (err) {
                        udp = false;
                    } else {
                        udp = true;
                    }
                    subDone();
                });


                testTurn("turn:" + server + ":443?transport=tcp", function (err) {
                    if (err) {
                        tcp = false;
                    } else {
                        tcp = true;
                    }
                    subDone();
                });


                function subDone() {
                    doneCount++;
                    if (udp || tcp) {
                        callback(true);
                    } else if (doneCount == 2) {
                        callback(false);
                    }
                }

            },

          
            loadConfig: function () {
                for (var i in testConfig) {
                    window.results[i] = {};
                }
               
                return $.get(Config.serverListUri, function (data) {


                    for (var i in testConfig) {
                        var display = data.servers[testConfig[i].mappedName].display[0];

                        testConfig[i].display = display;

                        $("#" + i).find("h3").text(display.name)
                        $("#" + i).find(".test-description").text(display.description)
                    }

                    testConfig.testAnvilConnection.testUrls = [data.servers.anvil.generic_url]

                    testConfig.testWebSocketSecureConnection.testUrls = data.servers.mantis.urls.map(function (server) {
                        return server + ".tokbox.com";
                    });

                    testConfig.testTurnConnection.testUrls = data.servers.turn.urls.map(function (server) {
                        return server + ".tokbox.com";
                    });


                }, "json");


            },

            startTests: function (callback, progress_callback) {
             
                debug("startTests")

               

                run();

                function run() {
                    // count the number of tests
                    var count = 0;
                    var finished = 0;
                    var tests = [];

                    for (var i in OTDoc) {
                        if (OTDoc.hasOwnProperty(i) && i.indexOf("test") == 0) {
                            tests.push(i);
                            count++;
                        }
                    }

                    // now run all the tests
                    for (i = 0; i < tests.length; i++) {
                        !function (testName) {
                            progress_callback(testName, 0);
                            var doneFlag = false;
                            var timer;
                            var urls = testConfig[testName].testUrls;
                            var subTestCount = 0;

                            var doneFunc = function (passed) {
                                // make sure test doesn't get multiple results (like from timeouts)
                                if (doneFlag == true) {
                                    return;
                                }



                                doneFlag = true;

                                // clear the timeout
                                clearTimeout(timer);

                                if (!passed) {
                                    passed = false;
                                }

                                var name = $("#" + testName).find("h3").text();
                                var description = $("#" + testName).find(".test-description").text();
                                var result = {
                                    passed: passed,
                                    name: name,
                                    error: testConfig[testName].display.error,
                                    warning: testConfig[testName].display.warning,
                                    description: description
                                };

                                progress_callback(testName, result);
                                finishedTestCallback();
                            }

                            var subTestDone = function (result) {
                                subTestCount++;
                                if (result) {
                                    doneFunc(true);
                                } else if (urls.length == subTestCount) {
                                    doneFunc(false);
                                } else {
                                    progress_callback(testName, Math.round(subTestCount / urls.length * 100));
                                }
                            }

                            // run the test
                            for (var j = 0; j < urls.length; j++) {
                                !function (urlIndex) {
                                    var done = false;
                                    OTDoc[testName](urls[urlIndex], function (result) {
                                        if (done == true) {
                                            return;
                                        }
                                        done = true;
                                        subTestDone(result)
                                    });
                                }(j);
                            }


                            // set a timeout
                            timer = setTimeout(function () {
                                doneFunc(false);
                            }, 30000);
                        }(tests[i]);
                    }

                    // done function
                    function finishedTestCallback() {
                        finished++;
                        if (finished >= count) {
                            callback(results)
                        }
                    }
                }

            }
        }

        function getSessionInfo(url, callback) {
            // make the getSessionInfo Call
            $.ajax({
                headers: {
                    'X-TB-TOKEN-AUTH': Config.token,
                    'X-TB-VERSION': 1
                },
                dataType: "json",
                url: url,
                success: function () {
                    // check if theres an error
                    callback();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 404) {
                        debug("Could not find the API server.");
                        callback("Could not find the API server.");
                    } else if (jqXHR.status == 200) {

                        if (errorThrown instanceof SyntaxError) {
                            debug("Invalid JSON returned. Might be behind a proxy:\n", jqXHR.responseText)
                            callback("Invalid JSON returned. Might be behind a proxy:\n" + jqXHR.responseText);
                        }

                    } else {
                        debug("Unknown error:\n", jqXHR.responseText)
                        callback("Unknown error:\n" + jqXHR.responseText);
                    }
                }
            });
        }

        function testLogging(url, callback) {

            var data = {
                "payload": "web",
                "event_source": "connectivity_doctor",
                "action": "web",
                "event_logger": "connectivity_doctor"
            };

            $.ajax({
                method: "POST",
                data: data,
                url: url,
                success: function () {
                    callback();
                },
                error: function () {
                    callback("Error occured");
                }
            });
        }

        function testTurn(url, callback) {

            debug("testing turn");

            if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia({
                    audio: true,
                    fake: true
                }, function (stream) {
                    run(stream);
                }, function () {
                    callback(false);
                });
            } else {
                run();
            }

            function run(stream) {
                var count = 0;
                var finished = false;

                var retryCount = 0;
                var retryMax = 3;

                var iceServers = [
                  {
                      "username": "bwtest.ggb",
                      "credential": "opentok!",
                      "url": url
                  }];

                getCandidates();

                function getCandidates() {
                    var pc = new RTCPeerConnection({ iceServers: iceServers });

                    pc.onicecandidate = function (event) {

                        debug(event.candidate);
                        if (!event.candidate) {
                            // end of candidates
                            pc.close();
                            if (retryCount < retryMax - 1) {
                                retryCount++;
                                done(false, getCandidates)
                            } else {
                                done(false)
                            }
                            return;
                        } else {
                            if (checkForRelayCandidates([event.candidate.candidate])) {
                                done(true);
                            }
                        }
                    };

                    if (stream) {
                        pc.addStream(stream);
                    }

                    pc.createOffer(function (offer) {
                        pc.setLocalDescription(offer);

                        if (checkForRelayCandidates(offer.sdp.split("\n"))) {
                            done(true);
                        }
                    }, function () {
                       
                    },
                    { //this is to just to make sure we receive audio
                        mandatory: {
                            OfferToReceiveAudio: true
                        }
                    });
                }

                function checkForRelayCandidates(candidateArr) {

                    for (var i = 0; i < candidateArr.length; i++) {
                        var line = candidateArr[i];
                        if (line.indexOf("candidate:") != -1) {

                            var parts = line.trim().split(" ");
                            var candidate = {
                                protocol: parts[2],
                                ip: parts[4],
                                type: parts[7],
                            }

                            var ip = candidate.ip.split(".");
                            if (ip[0] == "192" || ip[0] == "10") {
                                // its local, so ignore
                                continue;
                            }

                            if (candidate.type == "relay") {
                                return true;
                            }
                        }
                    }

                    return false;
                }

                function done(result, retryFunc) {
                    if (finished) {
                        return;
                    }
                    if (retryFunc) {
                        retryFunc();
                        return;
                    }
                    finished = true;
                    count++;
                    if (result == true) {
                        callback();
                    } else if (count == testConfig.testTurnConnection.testUrls.length) {
                       
                        callback("No peer candidates found...." + url);
                    }
                }
            }
        }
        $.extend(this, OTDoc);



    }).singleton();

}(jQuery));
/// <reference path="jquery-1.11.1.js" />
/// <reference path="core/snap.core.js" />


; (function ($) {

    snap.namespace("snap.kubi")
        .extend(kendo.observable)
        .define("kubiControl", function () {

        //basic Default Value
        var kubiPositionX = 0.5;
        var kubiPositionY = 0.5;
        var magnitude = 0;
        var rampSpeed = 500; // higher is slower
        var timeOutVar;
       
        var leftAdjust = 13;
        var topAdjust = 33;
       

        var $scope = this;
        var canvas = null;
        var spotObject = null;
        var spotIndicator = null;
        var layerObject = null;
        var graphicContext = null;
        var currentGridWidth = 0;
        var currentGridHeight = 0;
        var lastX = 0;
        var lastY = 0;
        var pusherChannel = null;
        var pusher = null;
        //support function

        var drawLine =function(x1, y1, x2, y2) {
            graphicContext.fillStyle = '#000';
            graphicContext.strokeStyle = '#000';

            graphicContext.beginPath();
            graphicContext.moveTo(x1, y1);
            graphicContext.lineTo(x2, y2);
            graphicContext.lineWidth = 1;
            graphicContext.stroke();
            graphicContext.closePath();
        }
        var getSpotCoords = function (x, y) {

            var xRatio = 100 * (x - 15) / currentGridWidth;
            var yRatio = 100 * (y - 15) / currentGridHeight;
            var posObj = [];
            posObj.push(xRatio, yRatio);
            return posObj;
        }

        var pusherPosition = function (xp, yp) {
            if (!isNaN(xp) && !isNaN(yp)) {
                pusherChannel.trigger('client-position', { x: xp, y: yp, cmd: "position" });
                kubiPositionX = xp;
                kubiPositionY = yp;
            }
        };
        var drawAxisLine = function () {
            drawLine(lastX, 0, lastX, currentGridHeight);
            drawLine(0, lastY, currentGridWidth, lastY);

            var spotPosition = getSpotCoords(lastX, lastY);
            spotObject.show();
            spotObject.css("top", (spotPosition[1] + 0.2) + "%").css("left", (spotPosition[0] + 0.2) + "%");


        };
       
        var plotPosition=function (x, y) {


           
            if (x < 0)
                x = 0;
            else if (x > currentGridWidth)
                x = currentGridWidth;
            if (y < 0)
                y = 0;
            else if (y > currentGridHeight)
                y = currentGridHeight;

           
            lastX = x;
            lastY = y;

            // add new spot
            var spotPosition = getSpotCoords(x, y);
            spotObject.show();
            spotObject.css("top", (spotPosition[1] + 0.2) + "%").css("left", (spotPosition[0] + 0.2) + "%");

            // send command
            kubiPositionX = parseFloat((x / currentGridWidth).toFixed(2));
            kubiPositionY = parseFloat((y / currentGridHeight).toFixed(2));

            pusherPosition(kubiPositionX, kubiPositionY);
        }
        var startVector = function () {

            clearInterval(timeOutVar);
            var leftOffset = spotObject.offset().left + leftAdjust;
            var topOffset = spotObject.offset().top - topAdjust;
            timeOutVar = setInterval(function () {
                if (magnitude < (rampSpeed / 2)) {
                    magnitude++;

                } else {
                    clearInterval(timeOutVar);
                }
            }, 10);
        }
    

        var mobileMoveKubi = function (x, y) {
            pusherPosition(x, y);
            var pctX = x + 'px';
            var pctY = y + 'px';
            spotObject.animate({ 'left': pctX, 'top': pctY }, 500);
        }

        var endVector = function (direction) {
            clearInterval(timeOutVar);
            var addMagnitude = 100 * magnitude / rampSpeed / 50;
            switch (direction) {
                case "d-pad-left":
                    kubiPositionX = kubiPositionX - addMagnitude;
                    if (kubiPositionX < 0) { kubiPositionX = 0; }
                    mobileMoveKubi(kubiPositionX, kubiPositionY);

                    break;
                case "d-pad-right":
                    kubiPositionX = kubiPositionX + addMagnitude;
                    if (kubiPositionX > 1) { kubiPositionX = 1; }
                    mobileMoveKubi(kubiPositionX, kubiPositionY);

                    break;
                case "d-pad-up":
                    kubiPositionY = kubiPositionY - addMagnitude;
                    if (kubiPositionY < 0) { kubiPositionY = 0; }
                    mobileMoveKubi(kubiPositionX, kubiPositionY);

                    break;
                case "d-pad-down":
                    kubiPositionY = kubiPositionY + addMagnitude;
                    if (kubiPositionY > 1) { kubiPositionY = 1; }
                    mobileMoveKubi(kubiPositionX, kubiPositionY);

                    break;
                default:
                    break;
            }
            magnitude = 0;
        }

        var initEvent = function () {
            $('#virtualcontrol').on('click', function (e) {
                var x, y;
                var parentOffset = $(this).offset();
                if (typeof e.originalEvent.changedTouches != 'undefined') {
                    var touch = e.originalEvent.changedTouches[0];
                     x = touch.pageX - parentOffset.left;
                     y = touch.pageY - parentOffset.top;
                } else {
                     x = e.pageX - parentOffset.left;
                     y = e.pageY - parentOffset.top;
                }
                plotPosition(x, y);
            });
            canvas.on('mousemove', function (e) {
                if (layerObject) {
                    var parentOffset = layerObject.offset();
                    spotIndicator.css({
                        top: e.pageY - parentOffset.top -13,
                        left: e.pageX - parentOffset.left -13 ,
                        display: 'block'
                    });
                }
            });

            var direction = "";

            $('body').on('keydown', function (e) {
                direction = "";
                if (e.which == 37) {
                    direction = "d-pad-left";
                } else if (e.which == 39) {
                    direction = "d-pad-right";
                } else if (e.which == 38) {
                    direction = "d-pad-up";
                } else if (e.which == 40) {
                    direction = "d-pad-down";
                }
                if (direction != "") {
                    startVector();
                }
            });

            $('body').on('keyup', function (e) {
               
                direction = "";
                if (e.which == 37) {
                    direction = "d-pad-left";
                } else if (e.which == 39) {
                    direction = "d-pad-right";
                } else if (e.which == 38) {
                    direction = "d-pad-up";
                } else if (e.which == 40) {
                    direction = "d-pad-down";
                }
                if (direction != "") {
                    endVector(direction);
                }
            });
        };
        

      
      
        var connectKubi = function (cb) {
            var ourAppKey = '5b91695d223a13a08e80';

            var options = { authEndpoint: 'https://www.controlkubi.com/pusher_auth', authTransport: 'ajax' };

            pusher = new Pusher(ourAppKey, options);
            var channelName = 'presence-' + "6817EB";
            pusherChannel = pusher.subscribe(channelName);
            pusherChannel.bind('pusher:subscription_succeeded', function (members) {
                var found = false;
                members.each(function (m) {
                    if ("Kubi" == m.info.name)
                        found = true;
                });
                if (found) {
                    pusherPosition(0.5, 0.5);
                }
                cb();
            });
        }
        //Init initilization of Kubi Control
        var isInitDone = false;
        this.init = function (el) {
            
            layerObject = $(el);
            if (layerObject == null || layerObject == undefined || layerObject.length ==0) {
                
                return;
            }
            if (layerObject) {
                currentGridWidth = layerObject.width();
                currentGridHeight = layerObject.height();
                lastX = currentGridWidth / 2;
                lastY = currentGridHeight / 2;
            }
           
            var tmpCanvas = layerObject.find("canvas")[0];
            if (tmpCanvas) {
                graphicContext = tmpCanvas.getContext('2d');
                canvas = $(tmpCanvas);
                canvas.attr("width", currentGridWidth + "px");
                canvas.attr("height", currentGridHeight + "px");
              
            }
            spotObject = layerObject.find(".control-grid-spot");
            spotIndicator = layerObject.find(".grid-spot-indicator");
            drawAxisLine();
            connectKubi(function () {
                initEvent();
                plotPosition(lastX, lastY);

            });
            

        }
        this.isShow = false;
        this.bindViewModel = function () {
            kendo.bind($("#kubiview"), $scope);
            

        };
        this.showKubiWindow = function () {
           
            if (!isInitDone) {
                $.getScript("//js.pusher.com/3.0/pusher.min.js", function () {
                    isInitDone = true;
                    $scope.set("isShow", true);

                    $("#kubiWindow").getKendoWindow().center();
                    setTimeout(function () {
                        var el = $("#virtualcontrol");

                        $scope.init(el);

                    },200);
                    /** the close button in the header does not appear, due to some reason in the Kendo-ui library,
                    the solution could be to upgrade to new set of libraries and over riding the current styles.
                    This is a temporary fix till we upgrade.*/
                    $("#kubiWindow_wnd_title").parent().attr('style', 'display: block !important');
                    
                });
               
            } else {
                $scope.set("isShow", true);
                $("#kubiWindow").getKendoWindow().center();
                $("#kubiWindow").getKendoWindow().open();

            }
        };
    });

}(jQuery));
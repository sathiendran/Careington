//prerequisite → Webcam.Js library should be loaded!

(function ($, $snap) {
    "use strict";

    snap.namespace("snap.shared")
        .use([
            "snapNotification",
            "snap.common.dialogWindow"
    ])
        .define("webcamImageUploader",
            function ($snapNotification, $dialogWindow) {
                var that = this;

                var dialog = null;
                var callback = null;
                var userId = null;
                var uploadUrl = "";


                // $contentLoader somewhere deep will call that function after it load html template
                that.onDialogCreate = function () {
                    //here we init WebCamJs plugin
                    Webcam.set({
                        width: 200,
                        height: 200,
                        dest_width: 200,
                        dest_height: 200,
                        image_format: 'jpeg',
                        jpeg_quality: 90,
                        force_flash: false,
                        flip_horiz: true,
                        fps: 45,
                        enable_flash: true // false because i cant handle attach() error when browser uses http:// 
                    });


                    Webcam.on('error',
                        function (exp) {
                            console.error(exp);
                            $snapNotification.error("Webcam access error! Try to use https:// protocol. " + exp.message);
                        });

                    Webcam.attach('#webcamVideo');
                }

                that.init = function (opt) {
                    //dialog = opt.dialog;
                    callback = opt.callback;
                    uploadUrl = opt.uploadUrl;
                }

                //tony.y: it is bad bad BAD, it should not be done like that with DOM manipulation from code!!!
                that.showSlapsh = function(isShown) {
                    if (isShown) {
                        $('#dialogSplashScreen').show();
                    } else {
                        $('#dialogSplashScreen').hide();
                    }
                }

                that.open = function (opt) {

                    callback = opt.callback;
                    userId = opt.userId;
                    uploadUrl = opt.uploadUrl;

                    that.showSlapsh(false);

                    var flag = !dialog;

                    dialog = dialog || $dialogWindow.createNewDialog({
                        container: "#popUpContainer",
                        contentPath: "/content/shared/webcamImageUploader.html",
                        vm: that
                    });

                    dialog.open();

                    if (!flag) {
                        Webcam.attach('#webcamVideo');
                    }
                    
                }

                that.close = function () {
                    try {
                        Webcam.reset();
                    } finally {
                        dialog.close();
                    }
                    
                }

                that.reset = function() {
                    Webcam.reset();
                }

                ///tony.y: CopyPasted from Wbcam.js because we need XMLHttpRequest customization;

                that.b64ToUint6 = function(nChr) {
                    // convert base64 encoded character to 6-bit integer
                    // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
                    return nChr > 64 && nChr < 91 ? nChr - 65
                        : nChr > 96 && nChr < 123 ? nChr - 71
                        : nChr > 47 && nChr < 58 ? nChr + 4
                        : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
                }

                that.base64DecToArr = function(sBase64, nBlocksSize) {
                    // convert base64 encoded string to Uintarray
                    // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
                    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
                        nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, 
                        taBytes = new Uint8Array(nOutLen);
		
                    for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                        nMod4 = nInIdx & 3;
                        nUint24 |= that.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                        if (nMod4 === 3 || nInLen - nInIdx === 1) {
                            for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                                taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                            }
                            nUint24 = 0;
                        }
                    }
                    return taBytes;
                }

                that.upload = function (image_data_uri, target_url, callback) {
                    // submit image data to server using binary AJAX
                    var form_elem_name = 'webcam';

                    // detect image format from within image_data_uri
                    var image_fmt = '';
                    if (image_data_uri.match(/^data\:image\/(\w+)/))
                        image_fmt = RegExp.$1;
                    else
                        throw "Cannot locate image format in Data URI";

                    // extract raw base64 data from Data URI
                    var raw_image_data = image_data_uri.replace(/^data\:image\/\w+\;base64\,/, '');

                    // contruct use AJAX object
                    var http = new XMLHttpRequest();

                    http.open("POST", target_url, true);

                    //i do this because i hope that all the codebase will be rewritten
                    http.setRequestHeader("Authorization", "Bearer " + snap.userSession.token);
                    http.setRequestHeader("X-Api-Session-Id", snap.userSession.apiSessionId);
                    http.setRequestHeader("Accept", "text/plain");

                    // setup progress events
                    if (http.upload && http.upload.addEventListener) {
                        http.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                var progress = e.loaded / e.total;
                                Webcam.dispatch('uploadProgress', progress, e);
                            }
                        }, false);
                    }

                    // completion handler
                    var self = this;
                    http.onload = function () {
                        that.showSlapsh(false);
                        if (callback) callback.apply(self, [http, http.status, http.responseText, http.statusText]);
                        Webcam.dispatch('uploadComplete', http.status, http.responseText, http.statusText);
                    };

                    // create a blob and decode our base64 to binary
                    var blob = new Blob([that.base64DecToArr(raw_image_data)], { type: 'image/' + image_fmt });

                    // stuff into a form, so servers can easily receive it as a standard file upload
                    var form = new FormData();
                    form.append(form_elem_name, blob, form_elem_name + "." + image_fmt.replace(/e/, ''));

                    // send data to server
                    http.send(form);
                }

                that.takeSnapshoot = function (e) {
                    try {
                        that.showSlapsh(true);
                        Webcam.snap(function (data_uri) {
                            // snap complete, image data is in 'data_uri'
                            that.upload(data_uri, uploadUrl, callback);
                        });
                    } catch (exp) {
                        $snapNotification.error("Error occured while trying take webcamera snapshhot. " + exp.message);
                    }
                }
            });

})(jQuery, snap)
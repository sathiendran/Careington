/***
Contains OS related JS functions
***/

var isMobile = {

    Android: function () {
        var ua = navigator.userAgent;
        return ua.match(/Android/i) ||
            ua.match(/Dalvik/i) ||
            ua.match(/GINGERBREAD/i) ||
            ua.match(/LOLLIPOP/i) ||
            ua.match(/Linux;.*Mobile Safari/) ||
            ua.match(/Linux 1\..*AppleWebKit/);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function isMacChrome64Bit() {
    //Anything mac chrome 39 and over is 64 bit.
    if ((navigator.appVersion.indexOf("Macintosh") != -1)
        && (get_browser() == "Chrome") && (get_browser_version() > 38))
        return true;

    return false;

}

function isMacNon64Bit() {
    //Checks if not Chrome or version less than 38 but should be Mac.
    if (((get_browser() != "Chrome") || (get_browser_version() < 38))
    && (navigator.appVersion.indexOf("Macintosh") != -1)) {
        return true;
    }
    return false;
}

function GetOS() {
    if (navigator.appVersion.toLowerCase().indexOf('ipad') >= 0) {
        return 'ipad';
    }
    else if (navigator.appVersion.toLowerCase().indexOf('macintosh') >= 0) {
        return 'macintosh';
    }
    else if (navigator.appVersion.toLowerCase().indexOf('windows') >= 0) {
        return 'windows';
    }
    else {
        return 'notavailable';
    }

}

function ValidateOS() {
    if (navigator.appVersion.toLowerCase().indexOf('ipad') >= 0) {
        return true;
    }

    if (isMobile.iOS()) {
        return true;
    }
    
    if (isMobile.Android()) {
        return true;
    }

    if (navigator.appVersion.toLowerCase().indexOf('macintosh') >= 0) {
        return true;
    }

    if (navigator.appVersion.toLowerCase().indexOf('windows') >= 0) {
        return true;
    }

    return false;
}
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') >= 0;
// At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6



function screenSharingExtLink() {
    if (isChrome) {
        window.open("https://chrome.google.com/webstore/detail/connected-care-screen-sha/padchhoieclaaocgjbfepahaakajgllb");
    }
    else if (isFirefox) {
        window.open("https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/");
    }
   
}


function goToApp(appLocation) {
    setTimeout(function () {
        window.location = appLocation;
    }, 25);
}


function isBrowser64Bit() {

    if (navigator.userAgent.indexOf('WOW64') > -1 || window.navigator.platform == 'Win64')
        return true;
    return false;
}
function get_browser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|edge|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return 'Opera '
        }
        tem = ua.match(/edge\/(\d+)/i)
        if (tem != null) {
            return 'Edge';
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return M[0];
}

function get_browser_version() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|edge|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return tem[1];
        }
        tem = ua.match(/edge\/(\d+)/i)
        if (tem != null) {
            return tem[1];
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return M[1];
}
function showRecommendedBrowser() {
    if (localStorage.showRecommendedBrowser == 'false') {
        return false;
    }
    
    var browserName = get_browser();
    var envVer = get_browser_version();

    //Chrome
    if (browserName == "Chrome") {
        if (envVer >= snap.utilities.browsers.chrome) {
            return false;
        } else {
            showRecommendedBrowser.isVersion = true;
            return true;
        }
    }
    //Firefox
    if (browserName == "Firefox") {
        if (envVer >= snap.utilities.browsers.firefox) {
            return false;
        } else {
            showRecommendedBrowser.isVersion = true;
            return true;
        }
    }

    //maybe also check mobile options

    if (isMobile.any()) {
        return false;
    }
    var width = $(window).width();
    if (width <= 720) {
        return false;
    }
    return true;
}
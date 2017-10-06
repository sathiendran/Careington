// configuration file with default values
var snap = snap || {};

(function ($, $snap) {
    var snap = {
        logging: {
            level: "none"
        },
        config: {
            useUserIQ: true,
            baseUrl: ""
        },
        baseUrl: $snap.baseUrl || ""
    };

    $.extend($snap, snap);
})(jQuery, snap);

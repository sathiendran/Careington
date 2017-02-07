(function($, $snap) {

    snap.namespace("snap.enums")
        .define("ErrorTypeEnum", function() {
            this.Default = 0;
            this.TokenExpired_Admin = 1;
            this.EmailAlreadyInUse_Admin = 2;
            this.TokenExpired_Customer = 3;
            this.EmailAlreadyInUse_Customer = 4;
            this.TokenInvalid_Invitation = 5;

        }).singleton();

    snap.namespace("snap.enums")
        .define("SnapEvents", function() {
            this.GetClientInfo = "GetClientInfo";
        }).singleton();

    snap.namespace("snap.enums")
        .define("PhoneTypes", function () {
            this.home = 0;
            this.mobile = 1;
            this.other = 3;
        }).singleton();

    $snap.enums.EncounterTypeCode = $snap.enums.EncounterTypeCode || {
        None: 0,
        Text: 1,
        Phone: 2,
        Video: 3,
        InPerson: 4
    };

})(jQuery, snap);

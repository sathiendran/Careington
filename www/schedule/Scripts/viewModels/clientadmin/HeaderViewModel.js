/// <reference path="../../core/snap.core.js" />
/// <reference path="../../jquery-2.1.3.intellisense.js" />

snap.namespace("snap.clientAdmin")
     .use(["eventaggregator"])
    .extend(kendo.observable).define("HeaderViewModel", function ($eventaggregator) {
    var $scope = this;
    this.title = "Sub Header Title";
    this.onNavClick = function () {
        $eventaggregator.published("onmanuclick");
    };
    var initEvent = function () {

    }
    this.initViewModel = function () {

    };

}).singleton();
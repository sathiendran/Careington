/// <reference path="../../core/snap.core.js" />



snap.extend(kendo.observable).define("view1viewmodel", function () {
    this.title = "test";
    var $scope = this;
    this.click = function () {
        $scope.set("title", new Date().toString());
    };
}).singleton();
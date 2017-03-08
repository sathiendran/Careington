/// <reference path="../../core/snap.core.js" />
/// <reference path="../../jquery-2.1.3.intellisense.js" />

snap.namespace("snap.clientAdmin")
    .use(["eventaggregator"])
    .extend(kendo.observable).define("SideViewModel", function ($eventaggregator) {
    var $scope = this;
    this.user = {
        age: 14,

    };
    this.menuselect = function () {
        $('body').toggleClass('is-main-nav');
    };


    var initEvent = function () {

        $eventaggregator.subscriber("onmanuclick", function () {
            $('body').toggleClass('is-main-nav');
        });


        //need to do same for this

        $('body').on('click', '.js-toggle-menu', function (event) {
            event.preventDefault();
            $(this).parent().toggleClass('is-active');
            $('.left-col').toggleClass('is-active');
        });

        $('body').on('click', '.js-toggle-settings', function () {
            $(this).toggleClass('is-active');
            $('.js-toggle-settings-target').toggleClass('is-active');
        });

        $('body').on('click', '.js-toggle-search', function () {
            $(this).toggleClass('is-active');
            $('.js-toggle-search-target').toggleClass('is-active');
        });





    };
    this.initViewModel = function () {
        initEvent();
    };

}).singleton();
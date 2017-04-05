(function($, snap, kendo, window) {
    "use strict";

    snap.namespace("snap.common")
        .extend(kendo.observable)
        .define("overlay", function() {
        	var content = null,
                container = "#overlayContainer",
                $scope = this;
        	this.isActive = false;
        	this.loadingTxt = "";
            this.loadingIcn = "";
            this.subTxt = "";

        	function loadContent() {
        	    var dfd = $.Deferred();

        	    if(content === null) {
        	        $.get("schedule/tab-overlay.html" + snap.addVersion, function (data) { 
        	            content = data;
        	            dfd.resolve(content);
        	        });
        	    } else {
        	        dfd.resolve(content);
        	    }

        	    return dfd.promise();
        	}

        	this.loadOverlay = function(){
        		var dfd = $.Deferred();

        		loadContent().done(function(content) {
        		    if($(container).length === 0) {
        		        $("body").append("<div id='overlayContainer'></div>");
        		    }
        		    var $overlay = $(container);
                    $overlay.html(content);
        		    kendo.bind($overlay, $scope);

        		    dfd.resolve();
        		});

        		return dfd.promise();
        	};

        	this.toggleOverlay = function(){
        		this.set("isActive", !this.isActive);
        	};

            this.setLoadingTxt = function(string){
                this.set("loadingTxt", string);

                this.trigger("change", {
                    field: "loadingTxt"
                });
            };

            this.setLoadingIcn = function(string){
                this.set("loadingIcn", string);

                this.trigger("change", {
                    field: "loadingIcn"
                });
            };

            this.setSubTxt = function(string){
                this.set("subTxt", string);

                this.trigger("change", {
                    field: "subTxt"
                });
            };
    }).singleton();
}(jQuery, snap, kendo, window));

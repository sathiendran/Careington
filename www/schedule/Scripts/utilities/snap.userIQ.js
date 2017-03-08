(function ($, $snap) {

	snap.namespace("snap")
       .define("userIq", function () {
	    var    that = this;
       	
	    that.configure = function (user_id, account_id, user_type) {

	    	//define global variabble
	    	window._uiq = window._uiq || [];
	        var _uiq = window._uiq;

			_uiq.push(['setCustomVariable', '1', 'user_id', user_id, 'visit']);
			_uiq.push(['setCustomVariable', '2', 'account_id', account_id, 'visit']);
			_uiq.push(['setCustomVariable', '3', 'user_type', user_type, 'visit']);

			_uiq.push(["enableLinkTracking"]);
			_uiq.push(["trackPageView"]);
			(function () {
				var _uiq_config_url = (("https:" == document.location.protocol) ? "https" : "http") + "://feed.useriq.com/";
				var _uiq_prod_url = (("https:" == document.location.protocol) ? "https" : "http") + "://secure.useriq.com/";
				_uiq.push(["setTrackerUrl", _uiq_prod_url + "visits/push"]);
				_uiq.push(["setSiteId", "406028401"]);
				var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0]; g.type = "text/javascript";
				g.defer = true; g.async = true; g.src = _uiq_config_url + "useriq.js"; s.parentNode.insertBefore(g, s);
			})();
		}

       }).singleton();

})(jQuery, snap);



//minification protection
;
//Pub-Sub implimentation
//TODO: tony.y: finish this functionallity as it should be, with BDD approach (when front-end test infrastructure will be merged)
// it is in minimal working form now :)
(function ($, snap) {
    snap.namespace("snap").use()
     .define("events", function () {
         var that = this;

         that.callbacks = [];

         //TODO: create enum with Event names in snap.enums

         that.invokeCallbacks = function (eventName) {
             if (typeof (that.callbacks[eventName]) !== 'undefined') {
                 for (var i = 0; i < that.callbacks[eventName].length; i++) {
                     that.callbacks[eventName][i]();
                 }
             }
         };

         that.setCallback = function (eventName, callback) {
             that.callbacks[eventName] = that.callbacks[eventName] || new Array();
             that.callbacks[eventName].push(callback);
         };

         this.clearCallback = function () {
             // Empty is intentional
         };

     }).singleton();

})(jQuery, snap)
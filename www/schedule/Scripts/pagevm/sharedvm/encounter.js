; (function () {
    var encounterRoomsHub = function () {
        this.pageType = "";
    };
    encounterRoomsHub.prototype.initPage = function (pageType) {
        this.pageType = pageType;
    };
    encounterRoomsHub.prototype.loadView = function (){
        if (this.pageType === "phone") {
            url = "/content/shared/encounter/encounter-phone.html";
        }
        if (this.pageType == "inperson") {
            url ="/Prototypes/provider/content/encounter-in-person.html";
        }
        if (this.pageType == "chat") {
            url =  "/Prototypes/provider/content/encounter-chat.html";
        }
        snap.cachedGetHtml(url, this.bindViewToViewModel);
       
    };
    encounterRoomsHub.prototype.bindViewToViewModel = function (data) {
        snap.getCachedScript("/Scripts/viewModels/shared/encounter.viewmodel.js").then(function () {
            var $vm = snap.resolveObject("snap.shared.EncounterRoomViewModel");
            $("#encounter-rm-container").html(data);
            $('#chatCont').addClass('chat--encounter-rm');
            
            
            $vm.initControl( $vm);
            $vm.loadData();
        });
    }

    snap.namespace("snap.shared").use(["snapNotification"])
     .define("EncounterRoomsHub", encounterRoomsHub).singleton();
}());
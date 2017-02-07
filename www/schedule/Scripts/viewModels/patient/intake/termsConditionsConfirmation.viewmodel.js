function htmlDecode(value) {
    if (value != null)
        return $('<div/>').html(value).text();

    return value;
}

snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp"])
     .extend(kendo.observable)
    .define("TermsAndConditionsConfirmationViewmodel", function ($snapNotification, $snapHttp) {
        this.patientName = snap.consultationSession.patientName;
        this.guardianName = snap.consultationSession.guardianName;
        this.hospitalName = snap.hospitalSession.clientName;
        this.toc = "";
        this.cct = "";
        this.loadDocuments = function () {
            var def = $.Deferred();
            var ToC = 1, CTT = 2;
            function getHospitalDocText(id) {
                var apiPath = "/api/v2/documents/" + id + "/hospitals/" + snap.hospitalSession.hospitalId;
                return $.ajax({
                    url: apiPath,
                    type: 'GET',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                });
            }

            var promiseToC = getHospitalDocText(ToC);
            var promiseCTT = getHospitalDocText(CTT);
            var vm = this;
            promiseToC.success(function (response) {
                vm.set("toc", htmlDecode(response.data));
                promiseCTT.success(function (response) {
                    vm.set("cct", htmlDecode(response.data));
                    def.resolve();
                });
            });
            return def.promise();
        };
    }).singleton();
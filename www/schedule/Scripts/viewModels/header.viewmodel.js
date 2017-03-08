(function (global) {
    var HeaderViewModel,
        app = global.app = global.app || {};

    HeaderViewModel = kendo.data.ObservableObject.extend({
        brandName: "",
        subBrandName: "",
        clientName: "",
        clientImage: "",
        altImage: "",
        brandColor: "",
        hospitalId: "",

        getClientInfo: function (clientId) {

            var that = this;
            var def = $.Deferred();
            if (clientId > 0) {
                that.set("hospitalId", clientId);
                if (snap.sessionStorageExists && snap.sessionStorageExists("snap_hospital_session")) {
                    snap.getSnapHospitalSession();
                    that.setBrandFromSession();
                    snap.utility.PageStyle().applyStyleV3().then(function () {
                        def.resolve(1);
                    });
                }
                else {
                    var path = '/api/v2/hospital/' + clientId;
                    $.ajax({
                        type: "GET",
                        url: path,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            var hospitaData = {};
                            hospitaData.hospitalId = clientId;
                            hospitaData.brandName = response.data[0].brandName;
                            hospitaData.subBrandName = response.data[0].brandTitle;
                            hospitaData.clientName = response.data[0].hospitalName;
                            hospitaData.brandColor = response.data[0].brandColor;
                            hospitaData.hospitalLogo = response.data[0].hospitalImage;
                            hospitaData.address = response.data[0].address;
                            hospitaData.locale = response.data[0].locale;

                            hospitaData.patientLogin = response.data[0].patientLogin;
                            hospitaData.patientConsultEndUrl = response.data[0].patientConsultEndUrl;

                            hospitaData.customerSSO = response.data[0].customerSso;
                            hospitaData.customerSSOButtonText = response.data[0].customerSsoLinkText;

                            hospitaData.clinicianConsultEndUrl = response.data[0].clinicianConsultEndUrl;
                            hospitaData.clinicianLogin = response.data[0].clinicianLogin;

                            hospitaData.clinicianSSO = response.data[0].clinicianSso;
                            hospitaData.clinicianSSOButtonText = response.data[0].clinicianSsoLinkText;

                            hospitaData.contactNumber = response.data[0].contactNumber;
                            hospitaData.email = response.data[0].email;

                            hospitaData.contactNumber = response.data[0].contactNumber;
                            hospitaData.email = response.data[0].email;


                            if (response.data[0]['settings']) {
                                var oldData = snap.getSnapHospitalSettings();
                                if (!snap.hospitalSettings) {
                                    snap.hospitalSettings = {};
                                }
                                $.extend(snap.hospitalSettings, response.data[0]['settings']);
                                snap.setSnapJsSession("snap_hospital_settings", snap.hospitalSettings);
                            }

                            if (snap.setSnapJsSession) {
                                snap.setSnapJsSession("snap_hospital_session", hospitaData);
                                snap.getSnapHospitalSession();
                                that.setBrandFromSession();
                                snap.utility.PageStyle().applyStyleV3().then(function () {
                                    def.resolve(1);
                                });
                            }
                            //TODO: tony.y: possible it should be changed from pub-sub to something better, and choose another name for event
                            // "getClientInfo" event
                            snap.events().invokeCallbacks(snap.enums.SnapEvents().GetClientInfo);

                        },
                        error: function () {
                            snapError("Failed to get Client Information");
                            def.reject(null, null, "Failed to get Client Information");
                        }

                    });
                }
            }
            else {
                that.set("hospitalId", "0");
                that.set("clientImage", "");
                that.set("brandName", "");
                that.set("subBrandName", "");
                that.set("brandColor", "");
                that.set("clientName", "");
                var hospitaData = {};
                hospitaData.hospitalId = 0;
                hospitaData.brandColor = "";
                snap.setSnapJsSession("snap_hospital_session", hospitaData);
                snap.getSnapHospitalSession();
                snap.utility.PageStyle().applyStyleV3().then(function () {
                    def.resolve(1);
                });
            }

            return def.promise();
        },

        setBrandFromSession: function () {
            var that = this;
            that.set("clientImage", snap.hospitalSession.hospitalLogo);
            that.set("brandName", snap.hospitalSession.brandName);
            that.set("subBrandName", snap.hospitalSession.subBrandName);
            that.set("clientName", snap.hospitalSession.clientName);
            that.set("brandColor", snap.hospitalSession.brandColor);
        }


    });

    app.headerService = {
        viewModel: new HeaderViewModel()
    };



})(window);
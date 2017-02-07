snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp", "snap.DataService.customerDataService"])
    .extend(kendo.observable)
    .define("ProfileListViewModel", function ($snapNotification, $http, $service) {
        var currentViewModel = this;
        this.userProfiles = [];

        this.Init = function (patientId) {
            $service.getAccountUserProfiles(patientId)
                .then(function (response) {
                    var data = response.data;

                    data.forEach(function(item) {
                        item.imagePath = item.imagePath
                            || getDefaultProfileImageForPatient(item.gender);
                    });

                    currentViewModel.set("userProfiles", data);
                });
        }

	   	this.ViewProfile = function (e) {
	   	    //This code is placed here for compatibility purposes. $http.post does not work with legacy service
	   	    sessionStorage.setItem("snap_patientId_ref", e.data.patientId);
	   	    window.location = "User";
	   	    //$.ajax({
	   	    //    type: "POST",
	   	    //    url: '/customer/patientservice.asmx/CreateSessionOfPatientID',
	   	    //    data: "{PatientID:'" + e.data.patientId + "'}",
	   	    //    contentType: "application/json; charset=utf-8",
	   	    //    dataType: "json",
	   	    //    success: function (response) {
	   	    //        if (response.d == "Success") {
	   	    //            window.location = "User#" + e.data.patientId;
	   	    //        }
	   	    //        else {
	   	    //        }
	   	    //    },
	   	    //    error: function (xhr, status, error) {
	   	    //        if (xhr.status == 401) {
	   	    //            window.location = snap.patientLogin();
	   	    //        }
	   	    //        if (!snap.userAborted(xhr)) {
	   	    //            snapError(error);
	   	    //        }
	   	    //    }
	   	    //});
	   	}
	});
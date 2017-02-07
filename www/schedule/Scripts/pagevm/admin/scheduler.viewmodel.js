snap.namespace("snap.admin").use(["SnapNotification", "snap.admin.snapCookies", "snap.service.appointmentService"])
    .extend(kendo.observable)
    .define("onDemandAvailabilityViewModel", function ($snapNotification, $snapCookies, $appointmentService) {
        var selectedDoctorCookies = "selectedDoctorCookies" + "_" + snap.profileSession.userId;
        var hideSelectNotificationCookies = "hideNotification" + "_" + snap.profileSession.userId;
        var defaultColor = "#808080";
        var colors = [];

        function compareByName(a, b) {
            return a.fullName.localeCompare(b.fullName);
        }

        var indexOfDoctorById = function (doctorsList, userId) {
            var index = -1;

            for (var i = 0; i < doctorsList.length; i++) {
                if (doctorsList[i].userID === userId) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        var findDoctorById = function (doctorsList, userId) {
            var index = indexOfDoctorById(doctorsList, userId);

            if (index !== -1) {
                return doctorsList[index];
            }

            return null;
        }

        var getColor = function (index) {
            var color;
            switch (index) {
            case 0:
                color = "#08ECDA";
                break;
            case 1:
                color = "#D80070";
                break;
            case 2:
                color = "#49D700";
                break;
            case 3:
                color = "#2A2FE7";
                break;
            case 4:
                color = "#FF8D00";
                break;
            default:
                var letters = '0123456789ABCDEF'.split('');
                color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
            }

            return color;
        }

        this.dataDoctorList = [];
        this.selectedDoctorsIds = [];
        this.searchDoctorText = "";
        this.isSelectScheduledButtonVisible = false;

        this.displaySelectScheduledButton = function(isVisible) {
            this.set("isSelectScheduledButtonVisible", isVisible);
        };

        this.notSelectedDoctors = function () {
            var that = this;
            var doctors = this.dataDoctorList.filter(function (item) {
                return that.selectedDoctorsIds.indexOf(item.userID) < 0;
            });

            for (var i = 0; i < doctors.length; i++) {
                doctors[i].color = defaultColor;
            }

            var searchText = this.searchDoctorText.toLowerCase().trim();
            if (searchText !== "") {
                doctors = doctors.filter(function (item) {
                    return item.fullName.toLowerCase().indexOf(searchText) > -1;
                });
            }

            return doctors;
        }

        this.selectedDoctors = function () {
            var that = this;
            var doctors = [];

            this.selectedDoctorsIds.forEach(function (userId) {
                var doctor = findDoctorById(that.dataDoctorList, userId);

                if (doctor) {
                    doctors.push({
                        fullName: doctor.fullName,
                        userID: doctor.userID,
                        profileImagePath: doctor.profileImagePath
                    });
                }
            });

            for (var i = 0; i < doctors.length; i++) {
                doctors[i].color = colors[i];
            }

            return {
                items: doctors
            };
        }
        
        this.removeSelectedDoctor = function(e, userId) {

            this._unselectDoctor(userId);

            this._triggerChange();
        }

        this.selectDoctor = function(e) {
            // Get kendo listview.
            var $listView = e.sender;
            var data = $listView.dataSource.view();

            // Get the selected DOM elements as jQuery objects.
            var $selectedElements = $listView.select();

            // Convert the selected  jQuery DOM elements to a Array containing only "Doctor" objects.
            var selected = $.map($selectedElements, function (item) {
                var index = $(item).index();
                return data[index];
            });

            if (this.selectedDoctorsIds.length >= 5 && $snapCookies.getCookie(hideSelectNotificationCookies) !== "true") {
                $snapNotification.notificationWithCheckBox("Viewing to many users at once may result in poor performance",
                    function (isCheckboxChecked) {
                        $snapCookies.setCookie(hideSelectNotificationCookies, isCheckboxChecked, 100);
                    });
            }

            var that = this;
            selected.forEach(function (doctor) {
                that._selectDoctor(doctor.userID);
            });

            this._triggerChange();
        }

        this.load = function () {
            var that = this;
            snap.dataSource.Admin.Schedule.DoctorList.fetch(function () {
                var data = this.data().sort(compareByName);

                that.selectedDoctorsIds = [];
                if ($snapCookies.getCookie(selectedDoctorCookies) !== "") {
                    that.selectedDoctorsIds = $snapCookies.getCookie(selectedDoctorCookies).split(",").map(function (x) { return parseInt(x) });
                }

                colors = [];
                for (var i = 0; i <= data.length; i++) {
                    colors.push(getColor(i));
                }

                that.set("dataDoctorList", data);

                that._triggerChange();
            });
        }

        this.selectScheduledClick = function () {
            var that = this;

            var date = $("#scheduler").data("kendoScheduler").date();

            var startDate = snap.dateConversion.ConvertDateToString(date);

            date = new Date(date.valueOf());
            date.setDate(date.getDate() + +1);
            var endDate = snap.dateConversion.ConvertDateToString(date);
            
            var request = {
                consultationStatus: "Scheduled",
                startDate: startDate,
                endDate: endDate
            }
            var path = '/Admin/AdminService.asmx/GetScheduledCliniciansSelectedDay';
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: path,
                data: "{'selectedDate':'" + formatJSONDateShort(date) + "'}",
                dataType: "json",
                success: function (data) {
                    if (data.d != "No Data Found" && data.d != "") {
                       // var tableValues = $.parseJSON(data.d);
                        that.selectedDoctorsIds = data.d;

                       /* data.data.forEach(function (tableValues) {
                            if (!isNaN(tableValues.ownerId)) {
                                that.selectedDoctorsIds.push(parseInt(tableValues.ownerId));
                            }
                        });*/

                        that._triggerChange();


                    }
                },
                error: function (result) {
                    snapError("Error finding scheduled clincians");
                }


            });
        }
        
        this.searchDoctroTextChange = function() {
            this.trigger("change", { field: "notSelectedDoctors" });
        };

        this._selectDoctor = function (userId) {
            if (this.selectedDoctorsIds.indexOf(userId) < 0) {
                this.selectedDoctorsIds.push(userId);
            }
        }

        this._unselectDoctor = function (userId) {
            var index = this.selectedDoctorsIds.indexOf(userId);
            if (index >= 0) {
                this.selectedDoctorsIds.splice(index, 1);
            }

        }

        this._refreshScheduler = function () {
            var selectedDoctorsDataSource = this.selectedDoctors();

            var filter;
            if (selectedDoctorsDataSource.items.length === 0) {
                filter = {
                    logic: "and",
                    filters: [
                    {
                        operator: "eq",
                        field: "ownerId",
                        value: 1
                    }, {
                        operator: "neq",
                        field: "ownerId",
                        value: 1
                    }]
                };
            }
            else {
                filter = {
                    logic: "or",
                    filters: $.map(selectedDoctorsDataSource.items, function (doctor) {
                        return {
                            operator: "eq",
                            field: "ownerId",
                            value: doctor.userID
                        };
                    })
                };
            }

            var colorSeries = [];
            for (var i = 0; i < selectedDoctorsDataSource.items.length; i++) {
                colorSeries.push({
                    text: selectedDoctorsDataSource.items[i].fullName,
                    value: selectedDoctorsDataSource.items[i].userID,
                    color: selectedDoctorsDataSource.items[i].color
                });
            }

            var scheduler = $("#scheduler").data("kendoScheduler");
            scheduler.resources[0].dataSource.data(colorSeries);
            scheduler.dataSource.filter(filter);
        }

        this._refreshDoctorsLists = function () {
            this.trigger("change", { field: "notSelectedDoctors" });
            this.trigger("change", { field: "selectedDoctors" });

            $('#physicialList').kendoDraggable({
                dragstart: function(e) {
                    //add margin to position correctly the tooltip under the pointer
                    $("#dragTooltip").css("margin-left", e.clientX - 100);
                },
                hint: function(element) {
                    var hint = $(".dragoptions").clone();
                    hint.children().not(".dragoption").hide();
                    return $(element).clone();
                },
                filter: "div"
            });
        }

        this._saveCurrentState = function() {
            var userIDs = this.selectedDoctors().items.map(function (item) {
                return item.userID;
            });

            if (userIDs.length > 0) {
                $snapCookies.setCookie(selectedDoctorCookies, userIDs.join(","), 100);
            } else {
                $snapCookies.eraseCookie(selectedDoctorCookies);
            }
        }

        this._triggerChange = function () {
            this._saveCurrentState();
            this._refreshDoctorsLists();
            this._refreshScheduler();
        }
    }).singleton();
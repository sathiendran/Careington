;
(function ($, global, snap) {

    var NON_REPORTED_MESSAGE = "None Reported";
    var otherOptionMessage = "Other - (List below)";

    function displayEncounterType(encounterTypeCodeId) {
        //a little different than the enums.
        switch (encounterTypeCodeId) {
            case 1: return "Text Consultation";
            case 2: return "Phone Consultation";
            case 3: return "Video Consultation";
            case 4: return "In Person Consultation";
            default: return NON_REPORTED_MESSAGE;
        }

    }

    function formatConcern(concern) {
        var text = NON_REPORTED_MESSAGE;
        if (concern) {
            var arrConsern = concern.split("?");
            if (arrConsern.length > 1)
                text = arrConsern[1];
            else
                text = arrConsern[0];
        }

        return text;
    }

    function formatWithUnit(value, unit) {
        if (isEmpty(value))
            return "";
        if (isEmpty(unit))
            return value;
        var values = value.split("|");
        var units = unit.split("/");
        var val2 = "";
        var val2Unit = "";

        if (values.length > 1) {
            val2 = values[1];
        }

        if (units.length > 1) {
            val2Unit = units[1];
        }

        return values[0] + units[0] + " " + val2 + val2Unit;
    }

    function wrapDataSource(arr) {
        return {
            noItemMessage: NON_REPORTED_MESSAGE,
            items: arr
        }
    }

    function listDataSource(arr) {
        return wrapDataSource(arr.filter(function (item) { return item; }));
    }

    function listDataSourceForCurrentMedications(arr) {
        var newArr = [];
        $.each(arr, function (key, value) {
            //To skip the "Other - (List below)" from a array list.
            if (value != otherOptionMessage)
                newArr.push(value);
        });
        return wrapDataSource(newArr.filter(function (item) { return item; }));
    }

    function surgeriesDataSource(consultation) {
        function wrapSurgery(priorSurgery, surgeryMonth, surgeryYear) {
            return {
                priorSurgery: priorSurgery || "",
                surgeryDate: snap.dateConversion.ConveMonthToString(surgeryMonth || "") + ". " + (surgeryYear || "")
            }
        }

        var surgeries = [
            wrapSurgery(consultation.PriorSurgery1, consultation.Surgery1Month, consultation.Surgery1Year),
            wrapSurgery(consultation.PriorSurgery2, consultation.Surgery2Month, consultation.Surgery2Year),
            wrapSurgery(consultation.PriorSurgery3, consultation.Surgery3Month, consultation.Surgery3Year)
        ].filter(function (item) { return item.priorSurgery });

        return wrapDataSource(surgeries);
    }

    function prescriptionsDataSource(consultation) {
        var prescriptions = [];

        for (var key in consultation) {
            if (key.indexOf('Rx') !== -1) {
                prescriptions.push(consultation[key]);
            }
        }

        return wrapDataSource(prescriptions);
    }

    function participantDataSource(participants) {
        var localParticipants = [];

        for (var key in participants) {

            var item = participants[key];
            if (item.Person && item.Person.Name) {
                var name = item.Person.Name;
                if (name.Family !== "" || name.Given !== "") {
                    item.Period.Start = kendo.toString(new Date(item.Period.Start), "h:mm tt");
                    item.Period.End = kendo.toString(new Date(item.Period.End), "h:mm tt");
                    localParticipants.push(participants[key]);
                }
            }
        }

        return wrapDataSource(localParticipants);
    }

    function birthDetailsDataSource(consultation) {
        function wrapBirthInfo(value, description) {
            return {
                value: value,
                description: description
            }
        }

        var birthDetails = [
            wrapBirthInfo(consultation.IsChildBornFullTerm, "Child born at full term"),
            wrapBirthInfo(consultation.IsChildBornVaginally, "Child born vaginally"),
            wrapBirthInfo(consultation.IsChildDischargeMother, "Child discharged with mother"),
            wrapBirthInfo(consultation.IsVaccinationUpToDate, "Child vaccinations up-to-date")
        ]
        .filter(function (item) {
            return item.value;
        })
        .map(function (item) {
            return item.description + " : " + (item.value === "Y" ? "Yes" : "No");
        });

        return wrapDataSource(birthDetails);
    }

    function medicalCodesDataSource(medicalCodes) {
        var medCodesDictionary = {};

        medicalCodes.forEach(function (item) {
            medCodesDictionary[item.MedicalCodingSystem] = medCodesDictionary[item.MedicalCodingSystem] || {
                medicalCodingSystem: item.MedicalCodingSystem,
                medicalCodesDescription: []
            };

            medCodesDictionary[item.MedicalCodingSystem].medicalCodesDescription.push(item.ShortDescription);
        });

        var result = [];
        for (var key in medCodesDictionary) {
            result.push(medCodesDictionary[key]);
        }

        return wrapDataSource(result);
    }

    snap.namespace("Snap.Reports").use()
        .extend(kendo.observable)
        .define("сonsultationReportViewModel", function () {

            //This properties necessary because kendo MVVM has problems with MVVM bindings.
            this.$report = null;
            this.templatePath = null;

            //contains all consultation details 
            this.consultationDetails = {};

            this.currentMedications = [];
            this.medicationAllergies = [];
            this.medicalConditions = [];
            this.surgeries = [];
            this.prescriptions = [];
            this.birthInfo = [];
            this.medicalCodes = [];
            this.transcripts = [];
            this.files = [];

            //default value initializer
            this.isReportVisible = false;
            this.fullName = "";
            this.dobPatient = "";
            this.hospitalAddress = "";
            this.organization = "";
            this.location = "";
            this.hospitalTitle = "";
            this.fullName = "";
            this.patientAdress = "";
            this.homePhone = "";
            this.mobilePhone = "";
            this.consultationDate = "";
            this.clinicianInfo = "";
            this.consultationDuration = "";
            this.patientAge = "";
            this.patientGender = "";
            this.defaultLabelValue = "N/A";
            this.weight = "";
            this.height = "";
            this.participantList = [];
            this.hospitalImagePath = "/images/none.png";
            this.defautProfileImageOnError = "this.onerror=null;this.src= '/images/default-user.jpg'";
            this.profileImagePath = "/images/default-user.jpg";

            this.areLocationAndOrganizationInfoVisible = function () {
                return snap.hospitalSettings.organizationLocation;
            }

            this.formatLabelValue = function (value) {
                return value ? value : this.defaultLabelValue;
            }

            this.isParticipantAvailable = false;

            this.setReportDetails = function (consultation, participants) {

                this.consultationDetails = consultation;

                //Patient Info
                this.set("firstName", consultation.PatientName);
                this.set("lastName", consultation.LastName);
                this.set("fullName", [consultation.PatientName, " ", consultation.LastName, consultation.GuardianName ? (" (Guardian: " + consultation.GuardianName + ")") : ""].join(''));
                this.set("patientAge", this.formatLabelValue(consultation.AgeString));
                this.set("patientGender", consultation.Gender === "F" ? "Female" : "Male");
                this.set("patientAddress", consultation.PATAddress);
                this.set("homePhone", this.formatLabelValue(consultation.HomePhone));
                this.set("mobilePhone", this.formatLabelValue(consultation.MobilePhone));
                this.set("dobPatient", this.formatLabelValue(formatJSONDate1(consultation.DOB)));
                this.set("profileImagePath", consultation.ProfileImagePath || "/images/default-user.jpg");
                this.set("organization", this.formatLabelValue(consultation.Organization));
                this.set("location", this.formatLabelValue(consultation.Location));

                //hospital info
                this.set("hospitalImagePath", (consultation.HospitalImage || "/images/default-user.jpg"));
                this.set("hospitalAddress", consultation.HOSAddress);
                this.set("hospitalTitle", consultation.BrandName);

                //consultation info
                this.set("clinicianInfo", [consultation.DOCFirstName, consultation.DOCLastName, consultation.MedicalSpeciality].filter(function (item) { return item !== null }).join(", "));
                this.set("consultationDate", SnapDateTime1(consultation.ConsultationDate));
                this.set("consultationDuration", snap.dateConversion.formatConsultationDuration(consultation.ConsultationDuration));
                this.set("primaryConcern", formatConcern(consultation.PrimaryConcern));
                this.set("secondaryConcern", formatConcern(consultation.SecondaryConsern));
                this.set("currentMedications", listDataSourceForCurrentMedications([consultation.TakingMedication1, consultation.TakingMedication2, consultation.TakingMedication3, consultation.TakingMedication4]));
                this.set("medicationAllergies", listDataSource([consultation.AllergicMedication1, consultation.AllergicMedication2, consultation.AllergicMedication3, consultation.AllergicMedication4]));
                this.set("medicalConditions", listDataSource([consultation.MedicalCondition1, consultation.MedicalCondition2, consultation.MedicalCondition3, consultation.MedicalCondition4]));
                this.set("surgeries", surgeriesDataSource(consultation));
                this.set("prescriptions", prescriptionsDataSource(consultation));
                this.set("birthInfo", birthDetailsDataSource(consultation));
                this.set("subjective", consultation.Subjective || NON_REPORTED_MESSAGE);
                this.set("objective", consultation.Objective || NON_REPORTED_MESSAGE);
                this.set("assessment", consultation.Assessment || NON_REPORTED_MESSAGE);
                this.set("plan", consultation.Plan || NON_REPORTED_MESSAGE);
                this.set("medicalCodes", medicalCodesDataSource(consultation.MedicalCodeDetails));

                //Additional Fields
                this.set("AssignedDoctorId", consultation.AssignedDoctorId);
                this.set("MedicalCodeDetails", consultation.MedicalCodeDetails);
                this.set("Note", consultation.Note);
                this.set("IsNoCharge", consultation.IsNoCharge);
                this.set("ScheduledTime", consultation.ScheduledTime);
                this.set("communicationMethod", displayEncounterType(consultation.EncounterTypeCode));

                this.set("weight", formatWithUnit(consultation.Weight, consultation.WeightUnit));
                this.set("height", formatWithUnit(consultation.Height, consultation.HeightUnit));

                //Particiapnt
                this.participantList = participantDataSource(participants);


                this.set("isParticipantAvailable", participants.length !== 0);

                //trigger calculated fields
                this.trigger("change", { field: "areLocationAndOrganizationInfoVisible" });

                this.trigger("change", { field: "participantList" });
                this.trigger("change", { field: "isParticipantAvailable" });
                this.set("isReportVisible", true);

                if (consultation.Gender === "F") {
                    this.set("defautProfileImageOnError", "this.onerror=null;this.src= '/images/Patient-Female.gif'");
                } else if (consultation.Gender === "M") {
                    this.set("defautProfileImageOnError", "this.onerror=null;this.src= '/images/Patient-Male.gif'");
                }
            };

            this.setChartNotes = function (chartNotes) {
                this.set("transcripts", listDataSource(chartNotes));
            }

            this.setPreconsultationNotes = function(chartNotes) {
                this.set("preConsultTranscripts", listDataSource(chartNotes));   
            }


            this.close = function (e) {
                e.preventDefault();

                if (this.$report)
                    this.$report.data("kendoWindow").close();
            }

            this.onCloseSheduler = function () {
                var viewModel = this;
                if (!viewModel.windowView) {
                    kendo.bind($('#viewConsulationView'), viewModel);
                    viewModel.windowView = $("#viewConsulationWin").data("kendoWindow");
                }
                viewModel.windowView.close();
            }

            this.open = function () {
                if (this.$report) {
                    this.$report.data("kendoWindow").center();
                    this.$report.data("kendoWindow").open();

                    var that = this;
                    this.$report.data("kendoWindow").bind("resize", function () {
                        var h = that.$report.height() - $('#hdrConsultReport').outerHeight(true) - $('#ftrConsultReport').outerHeight(true);
                        $("#claimcontent").innerHeight(h);
                    });
                }
            }

            this.print = function (e) {
                e.preventDefault();

                var data = this.$report.html();

                if (data.indexOf("class=\"heading\"") != -1)
                    data = data.replace("class=\"heading\"", "class=\"heading\" style=\"display:none\" ");

                if (data.indexOf("<header id=\"hdrConsultReport\" class=\"heading\">") != -1)
                    data = data.substring(data.indexOf("<div id=\"divConsultReport\" class=\"claim-content\">"));
                if (data.indexOf("class=\"scrollable-area\"") != -1)
                    data = data.replace("class=\"scrollable-area\"", "");

                if (data.indexOf("class=\"bottom-panel\"") != -1)
                    data = data.replace("class=\"bottom-panel\"", "class=\"bottom-panel\" style=\"display:none\" ");

                var mywindow = window.open('', 'My_div', 'height=1000,width=1000');
                mywindow.document.write('<html><head>');
                var cssurl = snap.string.formatURIComponents("/less/styles.less.dynamic?brandColor={0}&svp=snapversion", snap.hospitalSession.brandColor);
                mywindow.document.write('<link media="all" rel="stylesheet" href="' + cssurl + '">');
                mywindow.document.write('</head><body class="post-consult patient-page chat-page">');
                mywindow.document.write('<div class="popup claim-area" id="consult-report">');
                mywindow.document.write(data);
                mywindow.document.write('</div>');

                mywindow.document.write('</body></html>');

                if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
                    // The timeout is necessary because window.onload does not work correctly in chrome. For more info see https://productforums.google.com/forum/#!topic/chrome/7VIpByhmU3U
                    mywindow.document.write('<script>function doPrint(){window.setTimeout(function(){window.print();window.close();}, 500);} ');
                    mywindow.document.write('window.onload=doPrint();');
                    mywindow.document.write('</script>');

                    return true;
                }
                else {

                    mywindow.document.close();
                    mywindow.focus();
                    mywindow.window.print();
                    mywindow.close();

                    return false;
                }
            }

            this.exportToPdf = function (e) {
                e.preventDefault();

                kendo.drawing.drawDOM($("#reportValues")).then(function (group) {
                    // set PDF arguments
                    group.options.set("pdf", {
                        margin: {
                            left: "20mm",
                            top: "40mm",
                            right: "20mm",
                            bottom: "40mm"
                        }
                    });

                    kendo.drawing.pdf.saveAs(group, "Consultation Report.pdf");
                });
            }
        });

    snap.namespace("Snap.Reports").use(["snapNotification", "snapLoader", "snap.service.appointmentService", "Snap.Reports.сonsultationReportViewModel"])
        .define("consultationReportService", function ($snapNotification, $snapLoader, $service, $consultationReportViewModel) {
            var templates = {
                "standard": "/content/consultationReports/standardConsultationReport.html" + snap.addVersion
            };

            this.show = function (consultationId, template) {
                var templatePath = templates[template];
                var that = this;

                $("#loaderAttached").show();
                if (!templatePath) {
                    $snapNotification.error("Unknown consultation report template");
                    return;
                }

                //check do we need download report and bind it to ViewModel
                if ($consultationReportViewModel.templatePath !== templatePath) {

                    if ($consultationReportViewModel.$report)
                        kendo.unbind($consultationReportViewModel.$report);

                    $consultationReportViewModel.$report = null;
                    $consultationReportViewModel.templatePath = null;

                    //load template
                    $.get(templatePath).then(function (html) {
                        var $report = $(html).appendTo("body");

                        //apply picturefill plugin.
                        if (typeof global.picturefill === 'function') {
                            global.picturefill();
                        }

                        kendo.bind($report, $consultationReportViewModel);


                        $consultationReportViewModel.$report = $report;
                        $consultationReportViewModel.templatePath = templatePath;

                        //Kendo MVVM has problems with kendoWindow binding.
                        //That is why instead of MVVM approach we create kendoWindow manually. 
                        $report.kendoWindow({
                            modal: true,
                            maxWidth: 800,
                            minWidth: 520,
                            width: 800,
                            minHeight: 160,
                            visible: false,
                            draggable: false,
                            pinned: false,
                            position: {
                                top: 100
                            },
                            title: false,
                            actions: [
                                "Close"
                            ]
                        });

                        that._openReport(consultationId);
                    });
                } else {
                    that._openReport(consultationId);
                }
            };

            this._openReport = function (consultationId) {
                //check data access first



                //load initial data.
                $service.getConsultationDetails(consultationId).done(function (response) {
                    $consultationReportViewModel.open();

                    $consultationReportViewModel.setReportDetails(response.data[0], response.participants);
                    //Initialize file sharing.
                    global.initializeFileSharingReport(consultationId);
                }).fail(function () { snapInfo("You are not authorized to view this information."); });

                $service.getConsultationChartNotes(consultationId, 2).then(function (response) {
                    $consultationReportViewModel.setChartNotes(response.data);
                });

                $service.getConsultationChartNotes(consultationId, 1).then(function (response) {
                    $consultationReportViewModel.setPreconsultationNotes(response.data);
                });

                
            }
        });
})(jQuery, window, snap);
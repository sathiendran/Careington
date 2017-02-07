(function ($, snap) {
    "use strict";
    // API models provide Clinician, Patients and Group API in a slightly different format.
    // In order to use all API models in a same way (search lists, selectors, ...) we will parse them to the one common format.
     

    // Scheduler required Clinicians, Patients and Groups list.
    // In order to use all data sources in a same way we create common API.
     
    snap.namespace("snap.admin.schedule").use(["snapNotification", "snap.common.schedule.ScheduleCommon", "snap.DataService.customerDataService", "snap.service.availabilityBlockService"])
        .define("AdminScheduleDSFactory", function ($snapNotification, $scheduleCommon, $customerDataService, $availabilityBlockService) {

            function CachedDS(items) {
                var localItems = items;

                this.selectById = function (id) {
                    return selectBy(id, "id");
                };

                this.selectByPersonId = function (personId) {
                    return selectBy(personId, "personId");
                };

                function selectBy(value, propertyName) {
                    var selectedItem = null;
                    for (var i = 0; i < localItems.length; i++) {
                        if (localItems[i][propertyName] === value) {
                            selectedItem = localItems[i];
                        }
                    }

                    return selectedItem;
                }
            }

            function LocalDS(items) {
                CachedDS.call(this, items);
                var localItems = items;
                this.selectByName = function (name) {
                    var filtered = [];
                    if (typeof (name) === "undefined" || name === null || name === "") {
                        filtered = localItems;
                    } else {
                        filtered = localItems.filter(function (item) {
                            return name === "" || item.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
                        });
                    }

                    return filtered;
                };


            }

            function NonFilteringDS(items) {
                CachedDS.call(this, items);
                var localItems = items;
                this.selectByName = function () {
                    return localItems;
                };


            }

            function DS() {
                this.read = function (nameFilter) {
                    var filter = "";

                    if (typeof (nameFilter) !== "undefined" && nameFilter !== null) {
                        filter = $.trim(nameFilter);
                    }

                    var dfd = $.Deferred();

                    this._getDS(nameFilter).done(function (ds) {
                        dfd.resolve(ds.selectByName(nameFilter));
                    });

                    return dfd.promise();
                };

                this.selectById = function (id) {
                    var df = $.Deferred();

                    if (id) {
                        this._getDS().done(function (ds) {
                            df.resolve(ds.selectById(id));
                        });
                    } else {
                        df.resolve(null);
                    }

                    return df.promise();
                };

                this.selectByPersonId = function (id) {
                    var df = $.Deferred();

                    if (id) {
                        this._getDS().done(function (ds) {
                            df.resolve(ds.selectByPersonId(id));
                        });
                    } else {
                        df.resolve(null);
                    }

                    return df.promise();
                };

                this.getLocalDS = function () {
                    return this._getDS();
                };
            }

            function CliniciansDS() {
 
                //****************** Call BASE constructor ********************

                DS.call(this);

                var cliniciansDS = null;
                var cliniciansData = null;

                this.getCliniciansData = function () {
                    var dfd = $.Deferred();
                    if (cliniciansData) {
                        dfd.resolve(cliniciansData);
                    } else {
                        this._getDS().done(function () {
                            dfd.resolve(cliniciansData);
                        });
                    }
                    return dfd.promise();
                };

                this._getDS = function () {
                    var dfd = $.Deferred();

                    if (cliniciansDS) {
                        dfd.resolve(cliniciansDS);
                    } else {
                        $availabilityBlockService.getAllStaffAccountsForScheduling(snap.hospitalSession.hospitalId).done(function (clinicians) {
                            cliniciansData = clinicians.data;
                            var data = clinicians.data.map(function (clinician) {
                                clinician.person.providerId = clinician.providerId;
                                return {
                                    id: clinician.userId,
                                    personId: clinician.person.id,
                                    name: $scheduleCommon.getFullName(clinician.person),
                                    imageSource: clinician.person.photoUrl || getDefaultProfileImageForClinician(),
                                    info: $scheduleCommon.getSpeciality(clinician.specialty),
                                    data: clinician,
                                    personType: "clinician",
                                };
                            });

                            cliniciansDS = new LocalDS(data);
                            dfd.resolve(cliniciansDS);
                        });
                    }

                    return dfd.promise();
                };
            }

            function PatientsDS() {
 
               // ****************** Call BASE constructor ********************

                DS.call(this);

                this._read = function (nameFilter) {
                    var dfd = $.Deferred();

                    this._getDS(nameFilter).done(function (ds) {
                        dfd.resolve(ds.selectByName(nameFilter));
                    });

                    return dfd.promise();
                };

                var patientsDS = null;
                this._getDS = function (nameFilter) {
                    var dfd = $.Deferred();

                   // if (patientsDS) {
                   //     dfd.resolve(patientsDS);
                 //   } else {
                        $availabilityBlockService.getPatientList(snap.hospitalSession.hospitalId, nameFilter, 20, 0).done(function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return {
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: "patient",
                                };
                            });

                            patientsDS = new NonFilteringDS(data);
                            dfd.resolve(patientsDS);
                        });
                 //   }

                    return dfd.promise();
                };
            }

             function EmptyDS() {
               // ****************** Call BASE constructor ********************
                DS.call(this);

                this._read = function (nameFilter) {
                    var dfd = $.Deferred();

                    this._getDS(nameFilter).done(function (ds) {
                        dfd.resolve(ds.selectByName(nameFilter));
                    });

                    return dfd.promise();
                };

                var emptyDS = null;
                this._getDS = function () {
                    var dfd = $.Deferred();
                    if(!emptyDS){
                        emptyDS = new NonFilteringDS([]);
                    }
                    dfd.resolve(emptyDS);

                    return dfd.promise();
                };
            }


            this.createLocalDS = function (items) {
                return new LocalDS(items);
            };

            var patientsDS = null;
            this.getPatientsDS = function () {
                return new kendo.data.DataSource({
                    batch: true,
                    transport: {
                        read: {
                            url: ['/api/v2.1/providers/', snap.hospitalSession.hospitalId, '/patients'].join(''),
                            dataType: "json",
                            contentType: 'application/json',
                            type: "get"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read") {
                                return JSON.stringify({ data: data.models });
                            }
                            else {
                                if(data.searchText) {
                                    data.search = data.searchText;
                                    delete data.searchText;   
                                }
                                
                                return data;
                            }
                        }
                    },
                    error: function (e) {
                        var errorMessage = "Patients list error. ";
                        if (e.errorThrown === "Unauthorized") {
                            errorMessage = "You do not have role functions for viewing Patients list.";
                        }
                        else if (typeof e.errorThrown != "undefined") {
                            errorMessage = errorMessage + e.errorThrown;
                        }

                        $snapNotification.error(errorMessage);
                    },
                    schema: {
                        data: function (patients) {
                            var data = patients.data.map(function (patient) {
                                patient.person.providerId = patient.providerId;
                                return {
                                    id: patient.patientId,
                                    personId: patient.person.id,
                                    name: $scheduleCommon.getFullName(patient.person),
                                    imageSource: patient.person.photoUrl || getDefaultProfileImageForPatient(),
                                    info: $scheduleCommon.getPhoneNumber(patient.person),
                                    data: patient,
                                    personType: "patient",
                                };
                            });

                            return data;
                        },
                        total: "total",

                    },
                    pageSize: 30,
                    serverPaging: true
                });
            };

            var clinicianDS = null;
            this.getCliniciansDS = function () {
                if (clinicianDS === null) {
                    clinicianDS = new CliniciansDS();
                }

                return clinicianDS;
            };

            this.getNewEmptyDS = function () {
                return new EmptyDS();
            };

            this.getNewPatientsDS = function () {
                    return new PatientsDS();
            };

            this.getNewCliniciansDS = function () {
                return new CliniciansDS();
            };
        }).singleton();

    // Kendo UI has incosistence time API, some controls can automatically use UTC another works only with local times.
    //   This module help simplify all cases when you need to work with UTC time.

   
}(jQuery, snap));
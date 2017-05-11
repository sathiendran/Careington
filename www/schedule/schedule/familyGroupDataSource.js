snap.namespace("snap.patient.schedule").use(["snapNotification", "snap.service.selfSchedulingService", "snap.common.schedule.ScheduleCommon"])
       .define("familyGroupDataSource", function ($snapNotification, $selfSchedulingService, $scheduleCommon) {

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
                   var filtered;
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

           function DS() {
               this.read = function (nameFilter) {

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

           function FamillyGroupDS() {
               /************************************************************
               ****************** Call BASE constructor ********************
               *************************************************************/
               DS.call(this);

               this._getDS = function () {
                   var dfd = $.Deferred();
                   $selfSchedulingService.getFamillyGroup().done(function(resp){

                    var data = resp.data.map(function (patient) {
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
                      dfd.resolve(new LocalDS(data));
                   });

                   return dfd.promise();
               };
           }
           this.getfamilyGroupDataSource = function () {
               return new FamillyGroupDS();
           }
       });

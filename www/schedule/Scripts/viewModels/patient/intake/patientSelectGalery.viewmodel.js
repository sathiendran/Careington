(function (global, $) {
    function sortJSON(data, key) {

        return data.sort(function (a, b) {
            var x = a[key];
            var y = b[key];

            if (a.relationCode == 94) {
                return -1;
            }
            if (b.relationCode == 94) {
                return 1;
            }

            if (x < y) {
                return -1;
            } else if (x > y) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    snap.namespace("Snap.Patient").use(["snapNotification"])
       .extend(kendo.observable)
      .define("PatientSelectGaleryViewModel", function ($snapNotification) {
          this.familyMembers = [],
          this.availableMembersCount= false,
          this.selectedCallback = function () {

          };
          this.prepareData = function (that, data, notIncludeFilter, isHideUnauthorizedMember, showProviderAvailabilityTooltip) {
              if (notIncludeFilter && notIncludeFilter.length) {
                  data = data.filter(function (element) {
                      var contains = false;
                      for (var i = 0; i < notIncludeFilter.length; i++) {
                          if (notIncludeFilter[i].patientId == element.patientId) {
                              contains = true;
                              break;
                          }
                      }
                      return !contains;
                  })
              }

              data.forEach(function (item) {
                  item.showProviderAvailabilityTooltip = !!showProviderAvailabilityTooltip;
              });

              var shortedfamilyMembers = sortJSON(data, 'patientName');
              that.set("availableMembersCount", Object.keys(data).length ==0);
              that.set("familyMembers", shortedfamilyMembers);
          };
          this.loadData = function (selectedCallback, notIncludeFilter, isHideUnauthorizedMember, showProviderAvailabilityTooltip) {
              var def = $.Deferred();
              this.selectedCallback = selectedCallback;
              var that = this;
              snap.util.apiAjaxRequest('/api/v2.1/patients/ondemand/availability', 'GET').done(function (data) {
                  var membersData = data.data[0].familyMembers;
                  var members = that.removeUnauthorizedMember(membersData);//as only show authorized member for both step1 & step5 
                  that.prepareData(that, members, notIncludeFilter, isHideUnauthorizedMember, showProviderAvailabilityTooltip);
                  if (typeof global.picturefill === 'function') {
                      global.picturefill();
                  }
                  def.resolve();
              });
              return def.promise();
          };
          this.removeUnauthorizedMember = function (data) {
              var authMembers = [];
              for (var i = 0; i < data.length; i++) {
                  if (data[i].isAuthorized) {
                      authMembers.push(data[i]);
                  }
              }
              return authMembers;
          },
          this.selectPatient = function (e) {
              var that = this;
              var patientId = e.currentTarget.getAttribute('data-patientId');
              var patientProfile = null;
              for (var i = 0; i < that.familyMembers.length; i++) {
                  if (that.familyMembers[i].patientId == patientId) {
                      patientProfile = that.familyMembers[i];
                      break;
                  }
              }
              if (patientProfile && patientProfile.providerAvailable || !patientProfile.showProviderAvailabilityTooltip) {
                  that.selectedCallback(patientProfile);
              }
          };
      });

    snap.namespace("Snap.Patient").use(["snapNotification", "Snap.Patient.PatientSelectGaleryViewModel"])
     .define("PatientSelectGaleryControl", function ($snapNotification, $viewmodel) {
         var that = this;
         this.loadControl = function (containerId, chosenCallback, notIncludeFilter, isHideUnauthorizedMember, showProviderAvailabilityTooltip) {
             if ($(containerId).children('div').length == 0) {
                 $.get("/content/patient/patientSelectGalery.html" + snap.addVersion).done(function (html) {
                     var control = $('<div></div>');
                     control.html(html);
                     this.control = $(control[0]);
                     $(containerId).append(control[0]);

                     kendo.bind(control[0], $viewmodel);
                 });
             }
             $viewmodel.loadData(chosenCallback, notIncludeFilter, isHideUnauthorizedMember, showProviderAvailabilityTooltip);

             return $viewmodel;
         };
     }).singleton();


})(window, jQuery);

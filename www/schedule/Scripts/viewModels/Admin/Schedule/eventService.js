(function($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.schedule").use(["snapNotification", "snap.admin.schedule.TimeUtils", "snap.admin.schedule.apptRuleProcessor", "snap.service.availabilityBlockService", "snap.common.schedule.ScheduleCommon", "snap.admin.schedule.AdminScheduleDSFactory"])
        .define("eventService", function($snapNotification, $timeUtils, $apptRuleProcessor, $availabilityBlockService, $scheduleCommon, $adminScheduleDSFactory) {
            var $scope = this;

            var formatErrorMessage = function(error) {
                if (typeof(error) === "undefined" || error === null) {
                    return "Unknown error";
                }

                window.console.error(error);

                var errorMessage;
                if (typeof(error) === 'string') {
                    errorMessage = error;
                } else {
                    if (error.status === 500) {
                        errorMessage = "Internal server error";
                    } else if(error.status === 404) {
                        errorMessage = "Not found";
                    } else if(error.responseText) {
                        errorMessage = error.responseText;
                        try{
                            var parsedMessage = JSON.parse(errorMessage);
                            if(!!parsedMessage.message){
                                errorMessage = parsedMessage.message;
                            }
                        } catch(e){

                        }
                    } else {
                        errorMessage = error.statusText;
                    }
                }

                return errorMessage;
            };

            /***************************** Availability Block *********************************/
            function saveAvailabilityBlock(block, maxValidChangeDate) {
                var dfd = $.Deferred();
                saveBlock(block, maxValidChangeDate).done(function (blockResponse) {
                   dfd.resolve(blockResponse);
                }).fail(function (error) {
                   dfd.reject(formatErrorMessage(error));
                });

                return dfd.promise();
            }

            function saveBlock(availabilityBlock, maxValidChangeDate) {
                availabilityBlock.startTime = $timeUtils.dateToString(availabilityBlock.start);
                availabilityBlock.endTime = $timeUtils.dateToString(availabilityBlock.end);
                delete availabilityBlock.start;
                delete availabilityBlock.end;
                if (snap.hospitalSettings.onDemand === false) {
                    availabilityBlock.allowOnDemandAppt = false;
                }
                var errMessage = "This Availability block was changed by someone else. Please reload the page to proceed.";
                if (availabilityBlock.id === 0 || typeof availabilityBlock.id === "undefined" || availabilityBlock.id === null) {
                    return $availabilityBlockService.addAvailabilityBlock(availabilityBlock, availabilityBlock.id);
                } else {
                    var def = $.Deferred();
                    $availabilityBlockService.getSingleAvailabilityBlock(availabilityBlock.id).done(function (resp) {
                       
                        var modifiedTime = new Date (resp.data[0].modifiedDate);
                        if (typeof(resp.data[0].modifiedDate) === "undefined" || modifiedTime < maxValidChangeDate){
                            $availabilityBlockService.updateAvailabilityBlock(availabilityBlock, availabilityBlock.id).done(function (response) {
                                def.resolve(response);
                            }).fail(function (error) {
                                def.reject(error);
                            });
                        } else {
                            def.reject(errMessage);
                        }
                    }).fail(function () {
                        def.reject(errMessage);
                    });
                    return def.promise();
                  
                }
            }

            function cancelAvailabilityBlock(availabilityBlock) {
                var dfd = $.Deferred();
                var promise = (isEmpty(availabilityBlock.rule) || isEmpty(availabilityBlock.rule.id))  ?
                    $availabilityBlockService.deleteAvailabilityBlock(availabilityBlock.id) :
                    $availabilityBlockService.deleteAvailabilityBlockRule(availabilityBlock.id, availabilityBlock.rule.id);

               promise.done(function () {
                    dfd.resolve();
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd;
            }

            /******************************** Appointment ************************************/
            function saveAppointment(appt, rule) {
                var dfd = $.Deferred();

                if (rule) {
                    var apptSeries = $apptRuleProcessor.createEventsSeries(appt, rule);

                    //this necessry in case when we update appointment and specified repeat rule.
                    for(var i = 1; i < apptSeries.length; i++) {
                        apptSeries[i].id = 0;

                        apptSeries[i].participants.forEach(function(participant) {
                            participant.appointmentId = null;
                        });
                    }

                    dfd = saveAppointmentsSeries(apptSeries, apptSeries.length);
                } else {
                    dfd = saveSingleAppointmen(appt);
                }

                return dfd.promise();
            }

            function cancelAppointment(appt) {
                var dfd = $.Deferred();

                $availabilityBlockService.deleteAppointment(appt.id).done(function () {
                    dfd.resolve();
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd;
            }

            function saveSingleAppointmen(appt) {
                var dfd = $.Deferred();

                saveAppt(appt).done(function (appointmentResponse) {
                    dfd.resolve(appointmentResponse); //Success
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd.promise();
            }

            function saveAppointmentsSeries(series, length, dfd, result) {
                if (typeof (dfd) === "undefined") {
                    dfd = $.Deferred();
                }

                if (typeof (result) === "undefined") {
                    result = {
                        total: 0,
                        data: []
                    };
                }

                if (series.length > 0) {
                    var appt = series.shift();

                    saveAppointment(appt).done(function (appointmentResponse) {
                        if (appointmentResponse.data.length) {
                            result.data.push(appointmentResponse.data[0]);
                            result.total++;
                        }
                        saveAppointmentsSeries(series, length, dfd, result);
                    }).fail(function (error) {
                        var startDate = appt.startTime ? $timeUtils.dateFromSnapDateString(appt.startTime) : appt.start;
                        var message = [formatErrorMessage(error), " for appointment at ", kendo.toString(startDate, "dddd, MMMM dd, yyyy h:mm tt"), ". "].join("");
                        $snapNotification.error(message);

                        if (series.length === 0) { // avoids asking for continuation if nothing is left
                            dfd.resolve(result);
                            return;
                        }

                        setTimeout(function () { // <-- this timeout necessary only for correct notifications work.
                            $snapNotification.confirmationWithCallbacks("Do you want to continue to process this appointment series?", function () {
                                saveAppointmentsSeries(series, length, dfd, result);
                            }, function () {
                                dfd.resolve(result); //finish series                                
                            });

                        }, 500);
                    });
                } else {
                    dfd.resolve(result);
                }

                return dfd.promise();
            }

            function saveAppt(appt) {
                var dfd = $.Deferred();
                if ((appt.end - appt.start) > 86400000) {
                    dfd.reject("Single appointments cannot be longer than 24 hours.");
                }
                else {
                    getMatchedAvailabilityBlockId(appt).done(function (blockId, isNewBlock) {
                        appt.availabilityBlockId = blockId;
                        appt.startTime = $timeUtils.dateToString(appt.start);
                        appt.endTime = $timeUtils.dateToString(appt.end);
                        appt.where = appt.phoneNumber;
                        appt.whereUse = appt.phoneType;
                        appt.timeZoneId = appt.timeZoneId || snap.profileSession.timeZoneId;
                        appt.zonedTime = {
                            timeZoneId: appt.timeZoneId,
                            startTime: appt.startTime,
                            endTime: appt.endTime
                        };
                        delete appt.start;
                        delete appt.end;
                        delete appt.phoneNumber;
                        delete appt.phoneType;

                        var action = appt.id === 0 ?
                            $availabilityBlockService.addAppointment(appt) :
                            $availabilityBlockService.updateAppointment(appt, appt.id);

                        action.done(function (response) {
                            dfd.resolve(response);
                        }).fail(function (response) {
                            if (isNewBlock) {
                                cancelAvailabilityBlock({ rule: null, id: blockId });
                            }
                            dfd.reject(response);
                        });
                    }).fail(function (error) {
                        dfd.reject(error);
                    });
                }

                return dfd.promise();
            }

            function getMatchedAvailabilityBlockId(appt) {
                var dfd = $.Deferred();

                var clinician = $scheduleCommon.findProvider(appt.participants);

                if (clinician === null) {
                    dfd.reject("Select a provider.");
                    return dfd.promise();
                }


                $adminScheduleDSFactory.getCliniciansDS().selectByPersonId(clinician.personId).done(function (clinician) {
                    if (clinician) {
                        var startDate = appt.startInCurrentUserTimezone || appt.start;
                        var endDate = appt.endInCurrentUserTimezone || appt.end;
                        getBlocksWithTimeInterval(startDate, endDate, clinician.id, true).done(function (blocks) {
                            if (validatePermission(blocks, $scope._blockPermission)) {
                                var block = getBlocksWithMatchedPermission(blocks, $scope._blockPermission);

                                if (block) {
                                    dfd.resolve(block.id);
                                } else {
                                    var message = "Appointment Info: <br /> Start: " +
                                                   kendo.toString(startDate, "g") +
                                                   "<br /> End: " + kendo.toString(endDate, "g") +
                                                   "<br /> <br /> There is no availability block for the selected time period. Do you want to create a block for this appointment?";
                                    // this timeout necessary only for correct notifications work.
                                    window.setTimeout(function() {
                                        $snapNotification.confirmationWithCallbacks(message, function () {
                                            var block = {
                                                id: 0,
                                                start: new Date(startDate),
                                                end: new Date(endDate),
                                                allowOnDemandAppt: false,
                                                allowSelfAppt: appt.appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled,
                                                allowProviderAppt: true,
                                                isAvailable: true,
                                                optimizationTypeCodeId: 1,
                                                clinician: {
                                                    clinicianId: clinician.id,
                                                    locked: false,
                                                    private: false
                                                },
                                                rule: null
                                            };

                                            saveAvailabilityBlock(block).done(function (b) {
                                                if (b.data && b.data.length > 0) {
                                                    dfd.resolve(b.data[0].id, true);
                                                } else {
                                                    dfd.reject("Internal error: Cannot find availability block.");
                                                }
                                            }).fail(function (error) {
                                                dfd.reject(error);
                                            });
                                        }, function () {
                                            dfd.reject("This time-slot is currently unavailable.");
                                        });
                                    }, 500);
                                    
                                }
                            } else {
                                dfd.reject("You cannot schedule appointment at this time.");
                            }
                        }).fail(function(error) {
                            dfd.reject(error);    
                        });
                    } else {
                        dfd.reject("Selected Provider doesn not have permission to create an appointment");
                    }
                }).fail(function() {
                    dfd.reject("Cannot get provider info.");
                });

                return dfd.promise();
            }

            function getBlocksWithTimeInterval(apptStart, apptEnd, clionicianId, getPartial) {
                var dfd = $.Deferred();

                var startDate = new Date(apptStart);
                var endDate = new Date(apptEnd);
                startDate.setMonth(startDate.getMonth() - 1);
                endDate.setMonth(endDate.getMonth() + 1);

                $availabilityBlockService.getAvailabilityBlocks({
                    clinicianIds: [clionicianId],
                    startDate: $timeUtils.dateToString(startDate),
                    endDate: $timeUtils.dateToString(endDate)
                }).done(function (result) {
                    var availabilityBlocks = [];
                    if (result.data) {
                        for (var i = 0; i < result.data.length; i++) {
                            if ($timeUtils.dateFromSnapDateString(result.data[i].startTime) <= apptStart && $timeUtils.dateFromSnapDateString(result.data[i].endTime) >= apptEnd) {
                                availabilityBlocks.push(result.data[i]);
                            }
                        }
                        if (getPartial && availabilityBlocks.length === 0) {
                            for (var j = 0; j < result.data.length; j++) {
                                if ($timeUtils.dateFromSnapDateString(result.data[j].startTime) < apptEnd && $timeUtils.dateFromSnapDateString(result.data[j].endTime) > apptStart) {
                                    availabilityBlocks.push(result.data[j]);
                                }
                            }
                            if (availabilityBlocks.length) {
                                // If thereare partially matched blocks
                                dfd.reject("Your request conflicts with an existing availability block. Try extending an existing block.");
                            } else {
                                dfd.resolve(availabilityBlocks);
                            }
                        } else {
                            dfd.resolve(availabilityBlocks);
                        }
                    } else {
                        dfd.resolve(availabilityBlocks);
                    }
                }).fail(function(error) {
                    dfd.reject(error);
                });

                return dfd.promise();
            }

            function validatePermission(blocks, permission) {
                if (blocks.length > 0) {
                    var block = getBlocksWithMatchedPermission(blocks, permission);
                    return block !== null;
                }

                //If there is no availability block at all than we check current permission level.
                //Admin (allowProviderAppt permission) can create appointments in empty cells (new availability block will be generated).
                return permission === $scheduleCommon.blockPermissions.allowProviderAppt;
            }

            function getBlocksWithMatchedPermission(blocks, permission) {
                var matchedBlock = null;
                blocks.forEach(function (block) {
                    if (block[permission]) {
                        matchedBlock = block;
                    }
                });

                return matchedBlock;
            }

            function saveEncounterDocument(encDoc) {
                var dfd = $.Deferred();
                
                encDoc.startTime = $timeUtils.dateToString(encDoc.start);
                encDoc.endTime = $timeUtils.dateToString(encDoc.end);
                encDoc.phone = encDoc.phoneNumber;
                encDoc.zonedTime = {
                    timeZoneId: encDoc.timeZoneId,
                    startTime: encDoc.startTime,
                    endTime: encDoc.endTime
                };
                delete encDoc.start;
                delete encDoc.end;
                delete encDoc.phoneNumber;

                $availabilityBlockService.saveEncounterDocument(encDoc).done(function (encounterResponse) {
                    dfd.resolve(encounterResponse); //Success
                }).fail(function (error) {
                    dfd.reject(formatErrorMessage(error));
                });

                return dfd.promise();
            }

            

            this.setScope = function(blockPermission) {
                this._blockPermission = blockPermission;
            };

            this.saveAvailabilityBlock = function(block, maxValidChangeDate) {
                return saveAvailabilityBlock(block, maxValidChangeDate);
            };

            this.saveAppointment = function(appt, rule) {
                return saveAppointment(appt, rule);
            };

            this.saveEncounterDocument = function(encDoc) {
                return saveEncounterDocument(encDoc);
            };

            this.cancelAvailabilityBlock = function(block) {
                return cancelAvailabilityBlock(block);
            };

            this.cancelAppointment = function(appt) {
                return cancelAppointment(appt);
            };

            this.canAddAppointmentWithTimeInterval = function (clinicianId, apptStart, apptEnd) {
                var dfd = $.Deferred();

                var permission = $scope._blockPermission;
                getBlocksWithTimeInterval(apptStart, apptEnd, clinicianId).done(function (blocks) {
                    dfd.resolve(validatePermission(blocks, permission));
                });

                return dfd.promise();
            };


        });
}(jQuery, snap, kendo));
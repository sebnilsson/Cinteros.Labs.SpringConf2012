(function (window, document, undefined) {
    'use strict';

    $(function () {
        var bugsHub = $.connection.bugsHub;

        var getIdNumber = function(idString) {
            var slashIndex = idString.indexOf('/');
            return idString.slice(slashIndex + 1);
        };

        var priorities;
        $.ajax({
            type: 'GET',
            url: '/api/BugPriorities/',
            dataType: 'json',
            success: function (data) {
                priorities = data;
            },
            async: false
        });
        
        // Class to represent a row in the seat reservations grid
        var BugReport = function (id, name, priorityIndex, hours, description) {
            var self = this;

            self.description = ko.observable(description);
            self.hours = ko.observable(parseFloat(hours) || 0);
            self.id = id;
            self.name = ko.observable(name);
            self.priorityIndex = ko.observable(priorityIndex);

            self.multiplier = ko.computed(function () {
                var index = self.priorityIndex();
                var prio = priorities[index];
                return prio ? prio.multiplier + "x" : "None";
            });

            self.rowMultiplier = ko.computed(function () {
                var index = self.priorityIndex();
                var prio = priorities[index];
                if (!prio) {
                    return 0;
                }
                return parseFloat((self.hours() * prio.multiplier)) || 0;
            });
        };

        // Overall viewmodel for this screen, along with initial state
        var BugsViewModel = function () {
            var self = this;

            self.hourlyPrice = 15;

            self.getBugReportFromJson = function (jsonObject) {
                return new BugReport(jsonObject.id, jsonObject.name, jsonObject.priorityIndex, jsonObject.hours, jsonObject.description);
            };

            self.priorities = priorities;

            self.bugs = ko.observableArray();
            self.listBugs = function() {
                $.ajax({
                    type: 'GET',
                    url: '/api/Bugs/',
                    dataType: 'json',
                    success: function (bugList) {
                        self.bugs.removeAll();
                        for (var i = 0; i < bugList.length; i++) {
                            var item = bugList[i];
                            self.bugs.push(self.getBugReportFromJson(item));
                        }
                    },
                    async: false
                });
            };

            self.totalCharge = ko.computed(function () {
                var total = 0;
                for (var i = 0; i < self.bugs().length; i++) {
                    var item = self.bugs()[i];
                    var itemPrice = item.rowMultiplier();
                    total += itemPrice;
                }
                return parseFloat(total) || 0;
            });

            // Operations
            self.addBug = function (bug, event) {
                var $button = $(event.target);
                $button.attr('disabled', 'disabled');

                var title = 'New Bug (' + (self.bugs().length + 1) + ')';

                var data = { name: title };
                $.ajax({
                    type: 'POST',
                    url: '/api/Bugs/',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (bugItem) {
                        $button.removeAttr('disabled');

                        bugsHub.server.bugAdded(bugItem);
                    },
                    error: function () {
                        $button.removeAttr('disabled');
                    }
                });
            };
            self.saveBug = function (bug, event) {
                var $button = $(event.target);
                $button.hide();
                $button.parents('tr').find('input').attr('disabled', 'disabled');

                var idNumber = getIdNumber(bug.id);
                var data = {
                    description: bug.description(),
                    hours: bug.hours(),
                    id: bug.id,
                    name: bug.name(),
                    priorityIndex: bug.priorityIndex()
                };
                $.ajax({
                    type: 'PUT',
                    url: '/api/Bugs/' + idNumber,
                    data: JSON.stringify(data),
                    cache: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (jsonData) {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');

                        bugsHub.server.bugUpdated(jsonData, jsonData.priorityIndex || 0);
                    },
                    error: function () {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');
                    }
                });
            };
            self.removeBug = function (bug, event) {
                var $button = $(event.target);
                $button.hide();
                $button.parents('tr').find('input').attr('disabled', 'disabled');

                var idNumber = getIdNumber(bug.id);
                $.ajax({
                    type: 'DELETE',
                    url: '/api/Bugs/' + idNumber,
                    dataType: 'json',
                    success: function () {
                        bugsHub.server.bugRemoved(bug);
                    },
                    error: function () {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');
                    }
                });
            };
        };

        var viewModels = { bugs: new BugsViewModel() };
        
        bugsHub.client.addBug = function(bug) {
            viewModels.bugs.bugs.push(viewModels.bugs.getBugReportFromJson(bug));
        };
        bugsHub.client.updateBug = function (bug, priorityIndex) {
            var bugs = viewModels.bugs.bugs();
            for (var i = 0; i < bugs.length; i++) {
                var existingBug = bugs[i];
                if (existingBug.id === bug.id) {
                    existingBug.description(bug.description);
                    existingBug.hours(bug.hours);
                    existingBug.name(bug.name);
                    existingBug.priorityIndex(bug.priorityIndex);
                }
            }
        };
        bugsHub.client.removeBug = function (bug) {
            var bugs = viewModels.bugs.bugs();
            for (var i = 0; i < bugs.length; i++) {
                var existingBug = bugs[i];
                if (existingBug.id === bug.id) {
                    viewModels.bugs.bugs.remove(existingBug);
                }
            }
        };
        
        $.connection.hub.error(function(error) {
            alert("Connection error: " + error);
        });

        $.connection.hub.reconnected(function() {
            viewModels.bugs.listBugs();
        });

        $.connection.hub.start(function() {
            ko.applyBindings(viewModels.bugs);
            viewModels.bugs.listBugs();
        });
    });
})(window, document)
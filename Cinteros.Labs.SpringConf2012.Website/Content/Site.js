(function (window, document, undefined) {
    'use strict';

    $(function () {

        // Class to represent a row in the seat reservations grid
        var BugReport = function (id, name, priority, hours, description) {
            var self = this;

            self.description = ko.observable(description);
            self.hours = ko.observable(parseFloat(hours) || 0);
            self.id = id;
            self.name = ko.observable(name);
            self.priority = ko.observable(priority);

            self.multiplier = ko.computed(function () {
                var prio = self.priority();
                return prio ? prio.multiplier + "x" : "None";
            });

            self.rowMultiplier = ko.computed(function () {
                var prio = self.priority();
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
                var priority = self.priorities[jsonObject.priority.index];
                return new BugReport(jsonObject.id, jsonObject.name, priority, jsonObject.hours, jsonObject.description);
            };

            self.priorities = [];
            $.ajax({
                type: 'GET',
                url: '/api/BugPriorities/',
                dataType: 'json',
                success: function (data) {
                    self.priorities = data;
                },
                async: false
            });

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

                var data = {
                    name: title
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/Bugs/',
                    data: data,
                    dataType: 'json',
                    success: function (bugItem) {
                        $button.removeAttr('disabled');

                        bugsHub.bugAdded(bugItem);
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

                var data = {
                    bug: {
                        description: bug.description(),
                        hours: bug.hours(),
                        id: bug.id,
                        name: bug.name(),
                    },
                    priorityIndex: bug.priority().index
                };
                $.ajax({
                    type: 'PUT',
                    url: '/api/Bugs/',
                    data: data,
                    dataType: 'json',
                    success: function (jsonData) {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');

                        bugsHub.bugUpdated(data.bug, data.priorityIndex || 0);
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

                $.ajax({
                    type: 'DELETE',
                    url: '/api/Bugs/',
                    data: { id: bug.id },
                    dataType: 'json',
                    success: function () {
                        bugsHub.bugRemoved(bug);
                    },
                    error: function () {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');
                    }
                });
            };
        };

        var viewModels = { bugs: new BugsViewModel() };

        var bugsHub = $.connection.bugsHub;
        
        bugsHub.addBug = function(bug) {
            viewModels.bugs.bugs.push(viewModels.bugs.getBugReportFromJson(bug));
        };
        bugsHub.updateBug = function(bug, priorityIndex) {
            var bugs = viewModels.bugs.bugs();
            for (var i = 0; i < bugs.length; i++) {
                var existingBug = bugs[i];
                if (existingBug.id === bug.id) {
                    existingBug.description(bug.description);
                    existingBug.hours(bug.hours);
                    existingBug.name(bug.name);
                    existingBug.priority = ko.observable(viewModels.bugs.priorities[priorityIndex]);
                }
            }
        };
        bugsHub.removeBug = function(bug) {
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
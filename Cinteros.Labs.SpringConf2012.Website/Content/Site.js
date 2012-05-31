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
            $.ajax({
                type: 'GET',
                url: '/api/Bugs/',
                dataType: 'json',
                success: function (bugList) {
                    for (var i = 0; i < bugList.length; i++) {
                        var item = bugList[i];
                        self.bugs.push(self.getBugReportFromJson(item));
                    }
                },
                async: false
            });

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
                        self.bugs.push(self.getBugReportFromJson(bugItem));
                        $button.removeAttr('disabled');
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
                        description: bug.description,
                        hours: bug.hours,
                        id: bug.id,
                        name: bug.name,
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
                    url: '/api/Bugs/' + bug.id,
                    dataType: 'json',
                    success: function (jsonData) {
                        self.bugs.remove(bug);
                    },
                    error: function () {
                        $button.show();
                        $button.parents('tr').find('input').removeAttr('disabled');
                    }
                });
            };
        };

        var viewModels = { bugs: new BugsViewModel() };

        viewModels.bugs.bugs.subscribe(function (data) {
            console.log(data);
        });
        ko.applyBindings(viewModels.bugs);

    });
})(window, document)
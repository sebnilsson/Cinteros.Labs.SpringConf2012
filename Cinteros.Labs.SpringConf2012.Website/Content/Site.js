(function (window, document, undefined) {
    'use strict';

    $(function () {

        // Class to represent a row in the seat reservations grid
        var BugReport = function (name, priority, hours, description) {
            var self = this;
            self.description = description;
            self.hours = ko.observable(parseFloat(hours) || 0);
            self.name = name;
            self.priority = ko.observable(priority);

            self.multiplier = ko.computed(function () {
                var multiplier = self.priority().multiplier;
                return multiplier ? multiplier + "x" : "None";
            });

            self.rowMultiplier = ko.computed(function () {
                return (self.hours() * self.priority().multiplier) || 0;
            });
        };

        // Overall viewmodel for this screen, along with initial state
        var BugsViewModel = function () {
            var self = this;

            self.hourlyPrice = 15;

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
                success: function (jsonData) {
                    for (var i = 0; i < jsonData.length; i++) {
                        var item = jsonData[i];
                        var priorityId = item.priority.id;
                        // HACK: Should be a lookup
                        var priority = self.priorities[priorityId - 1];
                        self.bugs.push(new BugReport(item.name, priority, item.hours, item.description));
                    }
                },
                async: false
            });

            // Computed data
            //            self.rowCost = ko.computed(function (bug) {
            //                return (bug.hours * bug.multiplier * self.hourlyPrice) || 0;
            //            });

            self.totalCharge = ko.computed(function () {
                var total = 0;
                for (var i = 0; i < self.bugs().length; i++) {
                    var item = self.bugs()[i];
                    var itemPrice = item.rowMultiplier();
                    total += itemPrice;
                }
                return total;
            });

            // Operations
            self.addBug = function () {
                var title = 'Bug ' + (self.bugs().length + 1);
                self.bugs.push(new BugReport(title, self.priorities[1]));
            };
            self.removeBug = function (bug) {
                self.bugs.remove(bug);
            };
        };

        var viewModels = { bugs: new BugsViewModel() };

        ko.applyBindings(viewModels.bugs);
    });
})(window, document)
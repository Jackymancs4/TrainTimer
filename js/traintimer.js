(function() {

    var app = angular.module('traintimer', []);

    app.controller('TraintimerController', function($scope, $http, $interval) {

        $scope.time = moment();
        $scope.startTime = moment("10:50 am", "HH:mm a");
        $scope.stops = [];
        $scope.deltastops = [];
        $scope.timestops = [$scope.startTime];

        this.getTime = function() {
            return $scope.time.clone().format("HH:mm:ss a");
        };

        this.getStartTime = function() {
            return $scope.startTime.clone().format("HH:mm a");
        };

        this.getTimeStops = function() {
            return $scope.timestops;
        };

        this.getStops = function() {
            return $scope.stops;
        };

        this.onRun = function() {
            if ($scope.timestops.length > 0 && $scope.timestops[0].diff($scope.time, "s") < 0)
                return true;
            else return false;
        };

        this.offRun = function() {
            if ($scope.timestops.length > 0 && $scope.timestops[$scope.timestops.length - 1].diff($scope.time, "s") < 0)
                return true;
            else return false;
        };

        this.remainingTime = function(key) {
            if ($scope.timestops.length > 0 && $scope.timestops[key] !== undefined) {
                var millisecondsdiff = $scope.timestops[key].diff($scope.time);
                var seconds = Math.floor(moment.duration(millisecondsdiff).as("seconds"));
                var minutes = Math.floor(seconds / 60);

                return minutes + ":" + (seconds % 60);
            } else return 0;


        };

        this.currentStop = function() {
            var index = 0;
            if ($scope.timestops.length > 0)
                angular.forEach($scope.timestops, function(value, key) {

                    if ($scope.time.diff(value, 's') > 0 && $scope.timestops.length > (key) && $scope.time.diff($scope.timestops[key + 1], 's') < 0)
                        index = key;
                });

            return index;
        };

        this.circleStyle = function(key) {

            var color = "red";
            var cS = this.currentStop();

            if (key == cS) {
                color = "green";
            } else if (key == cS + 1) {
                color = "orange";
            }

            var style = {
                "background-color": color
            };
            return style;
        };

        this.circlelineStyle = function(key) {

            var style = {
                "height": ($scope.deltastops[key + 1] * 2 + 20) + "px"
            };
            return style;
        };

        this.nametimeStyle = function(key) {

            var style = {
                "top": "-" + ($scope.deltastops[key + 1] * 2 + 23) + "px"
            };
            return style;
        };

        $interval(function() {
            $scope.time = moment();
        }, 1000);

        $http.get('assets/t3.json')
            .then(function(res) {

                var newTime = $scope.startTime.clone();
                $scope.timestops = [];

                angular.forEach(res.data, function(value, key) {
                    $scope.stops.push(value[0]);
                    $scope.deltastops.push(value[1]);
                    newTime.add(value[1], "m");
                    $scope.timestops.push(newTime.clone());

                    //console.log(newTime.format("h:mm:ss a"));
                });
                $scope.deltastops.push(0);
            });

    });


})();

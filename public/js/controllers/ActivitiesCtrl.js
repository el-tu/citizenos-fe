'use strict';

angular
    .module('citizenos')
    .controller('ActivitiesCtrl', ['$scope', '$stateParams', '$document', 'sActivity', function ($scope, $stateParams, $document, sActivity) {
        $scope.activitiesOffset = 0;
        $scope.activitiesLimit = 25;
        $scope.activities = [];
        $scope.filter = 'all';
        $scope.activityfilters = ['all', 'userTopics', 'userGroups', 'user', 'self'];
        var lastViewTime = null;

        $scope.loadActivities = function (offset, limit) {
            $scope.activitiesOffset = offset || $scope.activitiesOffset;
            if (offset === 0) {
                $scope.activitiesOffset = 0;
            }

            $scope.activitiesLimit = limit || $scope.activitiesLimit;
            if ($scope.activities.length && !offset && !limit) {
                $scope.activitiesOffset += $scope.activitiesLimit;
            }

            var filterValue = $scope.filter;
            if (filterValue === 'all') {
                filterValue = null;
            }

            $scope.keyCounter = function (objIn) {
                return Object.keys(objIn).length;
            };

            $scope.getGroupItems = function (values) {
                var returnArray = [];
                Object.keys(values).forEach(function (key) {
                    returnArray.push(values[key]);
                });

                return returnArray;
            };

            sActivity
                .getActivities($scope.activitiesOffset, $scope.activitiesLimit, filterValue)
                .then(function (activities) {
                    $scope.app.unreadActivitiesCount = 0;
                    activities.forEach(function (activityGroups, groupKey) {
                        Object.keys(activityGroups.values).forEach(function (key) {
                            var activity = activityGroups.values[key];
                            if (activity.data.type === 'View' && activity.data.object && activity.data.object['@type'] === 'Activity') {
                                if (!lastViewTime || activity.updatedAt > lastViewTime) {
                                    lastViewTime = activity.updatedAt;
                                }
                                activities.splice(groupKey, 1);
                            } else if (!lastViewTime || activity.updatedAt > lastViewTime) {
                                activity.isNew = '-new';
                            }
                        });
                    });
                    $scope.showLoadMoreActivities = (!activities.length < $scope.activitiesLimit);
                    $scope.activities = $scope.activities.concat(activities);

                    var element = angular.element($document[0].getElementsByClassName('lightbox_content'));
                    if (element && element[0] && element[0].scrollHeight) {
                       /* $scope.$watch(element[0].scrollHeight, function () {
                            if (activities.length && element[0].clientHeight >= element[0].scrollHeight) {
                               // $scope.loadActivities();
                            }
                        }, true);*/
                    }

                });
        };
        $scope.loadActivities();

        $scope.filterActivities = function (filter) {
            $scope.filter = filter;
            $scope.activities = [];
            $scope.loadActivities(0);
        };

        $scope.showActivityDescription = function (activity) {
            return sActivity.showActivityDescription(activity);
        };

        $scope.showActivityUpdateVersions = function (activity) {
            return sActivity.showActivityUpdateVersions(activity);
        };

        $scope.activityRedirect = function (activity) {
            return sActivity.handleActivityRedirect(activity);
        };
    }
    ]);

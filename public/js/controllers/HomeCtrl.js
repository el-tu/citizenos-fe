'use strict';

angular
    .module('citizenos')
    .controller('HomeCtrl', ['$scope', '$log', 'sTopic', function ($scope, $log, sTopic) {

        // Constant marking the "clear" or all options will do
        $scope.FILTERS_ALL = 'all';
        $scope.filters = {
            categories: {
                value: $scope.FILTERS_ALL,
                options: [$scope.FILTERS_ALL].concat(_.values(sTopic.CATEGORIES))
            },
            statuses: {
                value: $scope.FILTERS_ALL,
                options: [$scope.FILTERS_ALL].concat(_.values(sTopic.STATUSES))
            },
            limit: 30,
            offset: 0,
            tabSelected: 'categories' // Mobile view has tabs where the filters are selected, indicates which filter tab is visible
        };

        $scope.topicList = [];
        $scope.topicCountTotal = null;
        $scope.isTopicListLoading = true;

        /**
         * Update topic list by setting relevant filter
         *
         * @param {object} filter The property of filter that changed. For ex filters.statuses, filters.categories
         * @param {string} value The new value
         */
        $scope.doSetFilter = function (filter, value) {
            filter.value = value;

            $scope.topicList = [];
            $scope.topicCountTotal = null;
            $scope.filters.offset = 0;

            $scope.loadTopicList();
        };

        /**
         * Clear all applied filters
         */
        $scope.doClearFilters = function () {
            $scope.filters.categories.value = $scope.FILTERS_ALL;
            $scope.filters.statuses.value = $scope.FILTERS_ALL;

            $scope.topicList = [];
            $scope.topicCountTotal = null;
            $scope.filters.offset = 0;

            $scope.loadTopicList();
        };

        $scope.isTutorialVisible = function () {
            return $scope.filters.categories.value === $scope.FILTERS_ALL
                && $scope.filters.statuses.value === $scope.FILTERS_ALL
                && $scope.topicList.length; // Render tutorial only when there are topics, this avoids Android and alignment issues.
        };

        $scope.loadTopicList = function () {
            $log.debug('HomeCtrl.loadTopicList()');

            if ($scope.topicCountTotal && $scope.topicList.length >= $scope.topicCountTotal) {
                $log.warn('HomeCtrl.loadTopicList()', 'Maximum count of topics already loaded! Skipping API call.');
                return;
            }

            $scope.isTopicListLoading = true;

            sTopic
                .listUnauth(
                    $scope.filters.statuses.value !== $scope.FILTERS_ALL ? $scope.filters.statuses.value : null,
                    $scope.filters.categories.value !== $scope.FILTERS_ALL ? $scope.filters.categories.value : null,
                    $scope.filters.offset,
                    $scope.filters.limit
                )
                .then(
                    function (res) {
                        $scope.topicList = $scope.topicList.concat(res.data.data.rows);
                        $scope.topicCountTotal = res.data.data.countTotal;

                        $scope.filters.offset += $scope.filters.limit;

                        $scope.isTopicListLoading = false;
                    },
                    function (err) {
                        $log.warn('HomeCtrl.loadTopicList()', 'List fetch failed or was cancelled', err);
                        $scope.isTopicListLoading = false;
                    }
                );
        };
        $scope.loadTopicList();


    }]);

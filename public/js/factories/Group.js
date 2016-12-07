angular
    .module('citizenos')
    .factory('Group', ['$log', '$resource', 'sLocation', '$http', 'Topic', function ($log, $resource, sLocation, $http, Topic) {
        $log.debug('citizenos.factory.Group');
        var Group = $resource(
            sLocation.getAbsoluteUrlApi('/api/users/self/groups/:groupId'),
            {groupId: '@id'},
            {
                query: {
                    isArray: true,
                    transformResponse: function (data, headersGetter, status) {
                        if (status < 400) { // FIXME: think this error handling through....
                            var array = angular.fromJson(data).data.rows;
                            array.forEach(function (group) { // TODO: FIX THE API - group.topics should return topics[] with 1 Topic in it.
                                if (group.topics && group.topics.latest) {
                                    group.topics.latest = new Topic(group.topics.latest);
                                }
                            });
                            return array;
                        } else {
                            return data;
                        }
                    }
                },
                update: {
                    method: 'PUT',
                    transformRequest: function (data) {
                        var requestObject = {};
                        _.forEach(data.toJSON(), function (value, key) { // Remove all object properties as we have none we care about in the server side
                            if (!_.isObject(value)) {
                                requestObject[key] = value;
                            }
                        });
                        return angular.toJson(requestObject);
                    },
                    transformResponse: function (data, headersGetter, status) {
                        return angular.fromJson(data).data;
                    }
                },
                save: {
                    method: 'POST',
                    transformResponse: function (data) {
                        return angular.fromJson(data).data;
                    }
                }
            }
        );

        Group.prototype.getTopicList = function () {
            var group = this;
            var path = sLocation.getAbsoluteUrlApi('/api/users/self/groups/:groupId/topics', {groupId: this.id});
            return {
                $promise: $http
                    .get(path)
                    .then(function (res) {
                        if (res.status < 400) { // FIXME: think this error handling through....
                            var topics = [];
                            var array = res.data.data.rows;
                            array.forEach(function (value) {
                                topics.push(new Topic(value));
                            });
                            group.topics.rows = topics;
                            group.topics.count = topics.length;
                        } else {
                            return data;
                        }
                    })
            }
        };

        Group.prototype.getUserList = function () {
            var group = this;
            var path = sLocation.getAbsoluteUrlApi('/api/users/self/groups/:groupId/members', {groupId: this.id});
            return {
                $promise: $http
                    .get(path)
                    .then(function (res) {
                        if (res.status < 400) { // FIXME: think this error handling through....
                            group.members.rows = res.data.data.rows;
                            group.members.count = res.data.data.rows.length;
                        } else {
                            return data;
                        }
                    })
            }
        };


        Group.prototype.isTopicListExpanded = false;

        return Group;
    }]);
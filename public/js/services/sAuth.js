'use strict';

angular
    .module('citizenos')
    .service('sAuth', ['$http', '$q', '$log', function ($http, $q, $log) {
        var sAuth = this;

        sAuth.user = {
            loggedIn: false,
            isLoading: true
        };

        var defaultSuccess = function (response) {
            $log.debug('SUCCESS', response);
            return response.data;
        };

        var defaultError = function (response) {
            $log.debug('ERROR', response);
            return $q.reject(response);
        };

        sAuth.login = function (email, password) {
            var data = {
                email: email,
                password: password
            };

            var success = function (response) {
                sAuth.user.loggedIn = true;
                angular.extend(sAuth.user, response.data.data);
            };

            return $http.post('/api/auth/login', data).then(success, defaultError);
        };

        sAuth.status = function () {
            var success = function (response) {
                angular.extend(sAuth.user, response.data.data);
                sAuth.user.loggedIn = true;
                sAuth.user.isLoading = false;
                return response.data.data;
            };

            var error = function (response) {
                sAuth.user.isLoading = false;
                return $q.reject(response);
            };

            return $http.get('/api/auth/status').then(success, error);
        };

    }]);
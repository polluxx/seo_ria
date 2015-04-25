define([
    'modules/dashboard/comments/module',

    'modules/dashboard/comments/controllers/DashboardCommentsCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            /*$routeSegmentProvider
                .when('/dashboard', 'dashboard')
                .segment('dashboard', {
                    templateUrl: bzConfigProvider.templateUrl('/dashboard/main.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'DashboardCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });*/
    }]);
    return module;

});
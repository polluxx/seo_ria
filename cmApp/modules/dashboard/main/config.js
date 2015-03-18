define([
    'modules/dashboard/main/module',

    'modules/dashboard/main/controllers/DashboardCtrl',
    'modules/dashboard/main/factories/DashboardFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/dashboard', 'dashboard')
                .segment('dashboard', {
                    templateUrl: bzConfigProvider.templateUrl('/dashboard/main.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'DashboardCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
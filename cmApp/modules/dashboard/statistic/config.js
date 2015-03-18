define([
    'modules/dashboard/statistic/module',

    'modules/dashboard/statistic/controllers/DashboardStatisticCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/statistic', 'statistic')
                .segment('statistic', {
                    templateUrl: bzConfigProvider.templateUrl('/dashboard/statistic.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'DashboardStatisticCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
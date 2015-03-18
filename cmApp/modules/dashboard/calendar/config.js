define([
    'modules/dashboard/calendar/module',

    'modules/dashboard/calendar/controllers/DashboardCalendarCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/calendar', 'calendar')
                .segment('calendar', {
                    templateUrl: bzConfigProvider.templateUrl('/dashboard/calendar.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['author'])
                    },
                    controller: 'DashboardCalendarCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
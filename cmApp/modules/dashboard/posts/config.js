define([
    'modules/dashboard/posts/module',

    'modules/dashboard/posts/controllers/DashboardPostsCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            /*$routeSegmentProvider
                .when('/dashboard', 'dashboard')
                .segment('dashboard', {
                    templateUrl: bzConfigProvider.templateUrl('/dashboard.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'DashboardCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });*/
    }]);
    return module;

});
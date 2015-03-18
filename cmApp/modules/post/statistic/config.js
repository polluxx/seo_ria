define([
    'modules/post/statistic/module',

    'modules/post/statistic/controllers/PostStatisticCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/post/statistic', 'postStatistic')
                .segment('postStatistic', {
                    templateUrl: bzConfigProvider.templateUrl('/post/statistic.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'PostStatisticCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
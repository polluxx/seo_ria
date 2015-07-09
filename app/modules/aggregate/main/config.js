/**
 * Created by root on 08.07.15.
 */
define(['modules/aggregate/main/module','modules/aggregate/main/controllers/AggregateMainCtrl'], function(module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/aggregate', 'aggregate')
                .segment('aggregate', {
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'AggregateMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);

    return module;
});
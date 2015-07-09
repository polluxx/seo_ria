/**
 * Created by root on 08.07.15.
 */
define(['modules/aggregate/main/requests/module','modules/aggregate/main/requests/controllers/RequestsCtrl'], function(module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/aggregate/requests', 'aggregateRequests')
                .segment('aggregateRequests', {
                    templateUrl: bzConfigProvider.templateUrl('/aggregate/requests.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'RequestsCtrl',
                    //inherits: 'AggregateMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);

    return module;
});
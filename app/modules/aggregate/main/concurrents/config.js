/**
 * Created by root on 08.07.15.
 */
define(['modules/aggregate/main/concurrents/module','modules/aggregate/main/concurrents/controllers/ConcurrentsCtrl'], function(module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/aggregate/concurrents', 'aggregateConcurrents')
                .segment('aggregateConcurrents', {
                    templateUrl: bzConfigProvider.templateUrl('/aggregate/concurrents.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'ConcurrentsCtrl',
                    //inherits: 'AggregateMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);

    return module;
});
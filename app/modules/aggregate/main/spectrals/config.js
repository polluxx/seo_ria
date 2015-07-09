/**
 * Created by root on 08.07.15.
 */
define(['modules/aggregate/main/spectrals/module','modules/aggregate/main/spectrals/controllers/SpectralsCtrl'], function(module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/aggregate/spectrals', 'aggregateSpectrals')
                .segment('aggregateSpectrals', {
                    templateUrl: bzConfigProvider.templateUrl('/aggregate/spectrals.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'SpectralsCtrl',
                    //inherits: 'AggregateMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);

    return module;
});
/**
 * Created by root on 08.07.15.
 */
define(['modules/aggregate/main/topkeys/module','modules/aggregate/main/topkeys/controllers/TopKeysCtrl'], function(module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/aggregate/topkeys', 'aggregateTopkeys')
                .segment('aggregateTopkeys', {
                    templateUrl: bzConfigProvider.templateUrl('/aggregate/topkeys.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'TopKeysCtrl',
                    //inherits: 'AggregateMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);

    return module;
});
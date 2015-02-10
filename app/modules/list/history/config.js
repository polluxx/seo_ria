define([
    'modules/list/history/module',

    'modules/list/history/controllers/HistoryMainCtrl',
    'modules/list/history/factories/HistoryFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider','bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/history/:id', 'history')
                .segment('history', {
                    templateUrl: bzConfigProvider.templateUrl('/history.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()

                    },
                    controller: 'HistoryMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
define([
    'modules/list/main/module',

    'modules/list/main/controllers/ListMainCtrl',
    'modules/list/main/factories/ListFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider','bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/list/:id', 'list')
                .segment('list', {
                    templateUrl: bzConfigProvider.templateUrl('/list.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()

                    },
                    controller: 'ListMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
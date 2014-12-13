define([
    'modules/list/page/module',

    'modules/list/page/controllers/ListPageCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/page', 'page')
                .segment('page', {
                    templateUrl: bzConfigProvider.templateUrl('/page.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()
                    },
                    controller: 'ListPageCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
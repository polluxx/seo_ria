define([
    'modules/list/childs/module',

    'modules/list/childs/controllers/ListChildsCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/childs/:id', 'childs')
                .segment('childs', {
                    templateUrl: bzConfigProvider.templateUrl('/list.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()
                    },
                    controller: 'ListChildsCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
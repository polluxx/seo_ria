define([
    'modules/view/main/module',

    'modules/view/main/controllers/ViewMainCtrl',
    'modules/view/main/factories/ViewFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider','bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/view', 'view')
                .segment('view', {
                    templateUrl: bzConfigProvider.templateUrl('/view.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()
                    },
                    controller: 'ViewMainCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
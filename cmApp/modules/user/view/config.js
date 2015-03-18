define([
    'modules/user/view/module',

    'modules/user/view/controllers/UserViewCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/user/view', 'viewUser')
                .when('/user/view/:id', 'viewUser')
                .segment('viewUser', {
                    templateUrl: bzConfigProvider.templateUrl('/user/view.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'UserViewCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
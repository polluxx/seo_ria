define([
    'modules/user/list/module',

    'modules/user/list/controllers/UserListCtrl',
    'modules/user/list/factories/UserFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/user/list', 'userList')
                .segment('userList', {
                    templateUrl: bzConfigProvider.templateUrl('/user/list.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['user_list'])
                    },
                    controller: 'UserListCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
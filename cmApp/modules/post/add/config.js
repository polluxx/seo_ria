define([
    'modules/post/add/module',

    'modules/post/add/controllers/PostAddCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/post/add', 'addPost')
                .when('/post/add/:id', 'addPost')
                .segment('addPost', {
                    templateUrl: bzConfigProvider.templateUrl('/post/add.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['post_add'])
                    },
                    controller: 'PostAddCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
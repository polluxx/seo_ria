define([
    'modules/post/list/module',

    'modules/post/list/controllers/PostListCtrl',
    'modules/post/list/factories/PostFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/post/list', 'postList')
                .segment('postList', {
                    templateUrl: bzConfigProvider.templateUrl('/post/list.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['author'])
                    },
                    controller: 'PostListCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
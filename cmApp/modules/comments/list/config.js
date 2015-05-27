define([
    'modules/comments/list/module',

    'modules/comments/list/controllers/CommentsListCtrl',
    'modules/comments/list/factories/CommentsFactory'

], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/comments/list', 'commentsList')
                .segment('commentsList', {
                    templateUrl: bzConfigProvider.templateUrl('/comments/list.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['comments_list'])
                    },
                    controller: 'CommentsListCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
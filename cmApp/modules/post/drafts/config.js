define([
    'modules/post/drafts/module',

    'modules/post/drafts/controllers/PostDraftsCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/post/drafts', 'postDrafts')
                .segment('postDrafts', {
                    templateUrl: bzConfigProvider.templateUrl('/post/list.html?time=1'),
                    resolve: {
                        permissions: bzUserProvider.access(['post_drafts'])
                    },
                    controller: 'PostDraftsCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
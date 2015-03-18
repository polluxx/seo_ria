define([
    'modules/post/informer/module',

    'modules/post/informer/controllers/PostInformerCtrl',
    'modules/post/informer/filters/filter'

], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/post/informer', 'viewInformer')
                .when('/post/informer/:id', 'viewInformer')
                .segment('viewInformer', {
                    templateUrl: bzConfigProvider.templateUrl('/post/informer.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['author'])
                    },
                    controller: 'PostInformerCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
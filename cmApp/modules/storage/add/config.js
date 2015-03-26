define([
    'modules/storage/add/module',

    'modules/storage/add/controllers/StorageAddCtrl',
    'modules/storage/add/factories/StorageFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/storage/add', 'addIdea')
                .when('/storage/add/:id', 'addIdea')
                .segment('addIdea', {
                    templateUrl: bzConfigProvider.templateUrl('/storage/add.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['admin'])
                    },
                    controller: 'StorageAddCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
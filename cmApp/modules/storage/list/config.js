define([
    'modules/storage/list/module',

    'modules/storage/list/controllers/StorageListCtrl',
    'modules/storage/list/controllers/StorageArchiveCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/storage/list', 'listIdea')
                .when('/storage/archive', 'archiveIdea')
                .segment('listIdea', {
                    templateUrl: bzConfigProvider.templateUrl('/storage/list.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['storage_list'])
                    },
                    controller: 'StorageListCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                })
                .segment('archiveIdea', {
                    templateUrl: bzConfigProvider.templateUrl('/storage/list.html'),
                    resolve: {
                        permissions: bzUserProvider.access(['storage_list'])
                    },
                    controller: 'StorageArchiveCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});
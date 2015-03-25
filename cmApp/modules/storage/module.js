define([
    'angular',
    'modules/storage/add/config',
    'modules/storage/list/config'
], function (angular) {
    'use strict';

    return angular.module('module.storage', [
        'module.storage.add',
        'module.storage.list'
    ]);
});
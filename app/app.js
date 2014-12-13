define([
    'angular',
    '../bazalt',
    'angular-local-storage',
    'bz',

    'base/config',
    'modules/auth/config',
    'modules/list/config',
    'modules/view/config',

    'views'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'bz',
        'LocalStorageModule',
        'base',

        'module.auth',
        'module.list',
        'module.view',

        'views'
    ]);
});
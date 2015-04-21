define([
    'angular',
    '../bazalt',
    'angular-local-storage',
    'bz',
    'alertify',

    'base/config',
    'modules/auth/config',
    'modules/list/config',
    'modules/view/config',

    'views',
    'polyfills'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'bz',
        'LocalStorageModule',
        'base',
        'ui.bootstrap',

        'module.auth',
        'module.list',
        'module.view',

        'views'
    ]);
});
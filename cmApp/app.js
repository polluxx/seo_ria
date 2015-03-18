define([
    'angular',
    '../bazalt',
    'bz',
    'angular-local-storage',
    'base/config',


    'views',


    'modules/auth/config',
    'modules/dashboard/config',
    'modules/post/config',
    'modules/user/config',

    'angular-bootstrap',
    'ng-table',
    //'angular-bootstrap-tpl',

    'trumbowyg',
    'trumbowygUpload',
    'alertify'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'bz',
        'LocalStorageModule',
        'base',

        'views',

        'module.auth',
        //'ui.bootstrap.tpl',
        'module.dashboard',
        'module.post',
        'module.user',

        'ui.bootstrap',
        'ngTable'
    ]);
});
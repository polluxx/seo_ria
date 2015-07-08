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
    'modules/storage/config',
    'modules/user/config',
    'modules/comments/config',

    'angular-bootstrap-tpl',
    'ng-table',
    //'angular-bootstrap-tpl',

    //'trumbowyg',
    //'trumbowygUpload',


    'alertify',
    'polyfills'
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
        'module.storage',
        'module.user',
        'module.comments',


        'ui.bootstrap',
        'ngTable'

    ]);
});
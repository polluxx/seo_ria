define([
    'angular',
    'modules/user/view/config',
    'modules/user/list/config'
], function (angular) {
    'use strict';

    return angular.module('module.user', [
        'module.user.view',
        'module.user.list'
    ]);
});
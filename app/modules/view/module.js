define([
    'angular',

    'modules/view/robots/config',
    'modules/view/main/config'
], function (angular) {
    'use strict';

    return angular.module('module.view', [
        'module.view.robots',
        'module.view.main'
    ]);
});
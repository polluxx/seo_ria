define([
    'angular',

    'modules/list/page/config',
    'modules/list/main/config',
    'modules/list/childs/config',
], function (angular) {
    'use strict';

    return angular.module('module.list', [
        'module.list.page',
        'module.list.main',
        'module.list.childs'
    ]);
});
define([
    'angular',
    'modules/comments/list/config',
    //'modules/comments/edit/config'
], function (angular) {
    'use strict';

    return angular.module('module.comments', [
        'module.comments.list',
        //'module.comments.edit'
    ]);
});
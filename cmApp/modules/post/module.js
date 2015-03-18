define([
    'angular',
    'modules/post/add/config',
    'modules/post/statistic/config',
    'modules/post/list/config',
    'modules/post/drafts/config',
    'modules/post/informer/config'
], function (angular) {
    'use strict';

    return angular.module('module.post', [
        'module.post.add',
        'module.post.statistic',
        'module.post.list',
        'module.post.drafts',
        'module.post.informer'
    ]);
});
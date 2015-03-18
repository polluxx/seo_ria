define([
    'angular',
    'modules/dashboard/main/config',
    'modules/dashboard/calendar/config',
    'modules/dashboard/statistic/config',
    'modules/dashboard/posts/config',
    'modules/dashboard/comments/config'
], function (angular) {
    'use strict';

    return angular.module('module.dashboard', [
        'module.dashboard.main',
        'module.dashboard.calendar',
        'module.dashboard.statistic',
        'module.dashboard.posts',
        'module.dashboard.comments'
    ]);
});
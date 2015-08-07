define([
    'angular',

    'bz',
    'modules/aggregate/main/topkeys/config',
    'modules/aggregate/main/concurrents/config',
    'modules/aggregate/main/requests/config',
    'modules/aggregate/main/spectrals/config'

], function (angular) {
    'use strict';

    return angular.module('module.aggregate.main', [
        'bz',
        'module.aggregate.main.topkeys',
        'module.aggregate.main.concurrents',
        'module.aggregate.main.requests',
        'module.aggregate.main.spectrals'
    ]);
});
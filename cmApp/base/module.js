define([
    'angular',

    'base/config/config',
    'base/home/config',
    'base/colorpicker/config'
], function (angular) {
    'use strict';

    return angular.module('base', [
        'base.config',
        'base.home',
        'base.colorpicker'

    ]);
});
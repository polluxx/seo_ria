define([
    'angular',

    'base/config/config',
    'base/home/config',
    'base/trumbowyg/config',
    'base/colorpicker/config',
    'base/wysiwyg/config'
], function (angular) {
    'use strict';

    return angular.module('base', [
        'base.config',
        'base.home',
        'base.trumbowyg',
        'base.colorpicker',
        'base.wysiwyg'

    ]);
});
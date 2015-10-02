define([
    'angular',

    //'angular-bootstrap',
    'modules/parser/rank/config'
], function (angular) {
    'use strict';

    return angular.module('module.parser', [
        'module.parser.rank'
    ]);

});
define([
    'modules/aggregate/main/topkeys/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('TopKeysCtrl', ['$scope', '$rootScope', 'bzUser', '$routeParams', '$location', 'AggregateFactory', 'ngTableParams', function($scope, $rootScope, bzUser, $routeParams, $location, AggregateFactory, ngTableParams) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});

        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            searcheble: false,
            domain: $rootScope.domain,
            path: $location.path(),
            params: {
                target: this.domain + "/" + this.target,
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    position: 'desc'     // initial sorting
                }
            },
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api
                    AggregateFactory.top(params.url(), function(data) {
                        //$scope.tableParams.$loading = false;
                        params.total(data.data.length);
                        // set new data
                        $defer.resolve(data.data);
                    });
                }
            })
        });



        // METHODS
        angular.extend($scope, {
            validate: function(){
                if(this.target === undefined || this.target.length < 2) {
                    alertify.error("Количество символов ссылки меньше 2");
                    return null;
                }

                this.target = this.target.trim().replace(/(^\/|\/$)/g, "");
                if(this.target.match(/(http|https|www|\s)/g)) {
                    alertify.error("Недопустимые символы в ссылке");
                    return null;
                }

                return true;
            },
            start: function() {
                this.searcheble = true;
                if(!this.validate()) return;
                var self = this;
                $location.search({target: this.target});

                this.tableParams.parameters({target: this.domain + "/" + this.target});
                this.tableParams.reload();


                //return;
                /*AggregateFactory.top(params, function(response){
                    self.$loading = false;
                   if(response.errors !== undefined) {

                       self.errors = response.errors;
                       self.data = null;
                       return;
                   }

                    self.data = response.data;
                });*/
            }
        });
    }]);


});

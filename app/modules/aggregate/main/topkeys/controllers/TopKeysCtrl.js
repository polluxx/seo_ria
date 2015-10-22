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
            selected: { 'checked': false, items: {} },
            searcheble: false,
            containsData: null,
            domain: $rootScope.domain,
            path: $location.path(),
            update: this.update || $routeParams.updated,
            marked: [],
            list: [],
            lastChecked: null,
            shiftPressed: false,
            currentAction: $location.path().split("/").pop(),
            params: {
                target: this.target,
                page: 1,            // show first page
                count: 100,          // count per page
                sorting: {
                    position: 'asc'     // initial sorting
                },
                newCheck: this.update || $routeParams.updated
            },
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api

                    var api = AggregateFactory.top;
                    if($scope.currentAction === 'requests') api = AggregateFactory.requests;

                    api(params.url(), function(data) {
                        //$scope.tableParams.$loading = false;


                        if(!data.data) {
                            $scope.containsData = null;
                            $defer.resolve(data.data);
                            $scope.errors = [data.error];

                            return;
                        }

                        if(data.data.items === undefined) {

                            $scope.containsData = null;
                            //$defer.resolve($scope.list = []);
                            return;
                        }

                        params.total(data.data.total);
                        // set new data
                        $scope.containsData = (data.data.items !== undefined && data.data.items.length) ? true : false;
                        $defer.resolve($scope.list = data.data.items);
                    },
                    function(err) {
                        if(err.status !== 200) {
                            $scope.errors = [err.data.error] || ["Проблема с апи, проверьте позже"];
                            $scope.containsData = null;
                            $defer.resolve($scope.list = []);
                        }
                        console.log(err);
                    });
                }
            })
        });
        console.log($scope.currentAction);

        // METHODS
        angular.extend($scope, {
            returnSort: function() {

                return ($scope.currentAction === 'requests')
                ? {
                    queriesCount: 'desc'
                }
                    : {
                    position: 'asc'     // initial sorting
                }
            },
            validate: function(){
                if(this.target === undefined || this.target.length < 2) {
                    alertify.error("Количество символов ссылки меньше 2");
                    return null;
                }

                this.target = this.target.trim().replace(/(^\/|\/$)/g, "");
                /*if(this.target.match(/(http|https|www|\s)/g)) {
                    alertify.error("Недопустимые символы в ссылке");
                    return null;
                }*/

                return true;
            },
            start: function(update) {
                this.errors = [];

                this.containsData = null;
                this.searcheble = true;
                if(!this.validate()) return;
                var self = this;
                this.params.newCheck = this.update || $routeParams.updated;
                if(update != undefined) {
                    this.params.newCheck = this.update = update;
                    if(update !== null) alertify.log("Запрос поставлен в очередь на проверку.");
                }
                //this.params.target = this.domain + "/" + this.target;
                this.params.target = this.target;

                this.params.sorting = this.returnSort();

                $location.search(this.params);
                console.log(this.params);
                this.tableParams.parameters(this.params);
                //this.tableParams.reload();

            },
            next: function(target, isUrl) {
                var params = {
                    newCheck: true
                }, keywords = "", kArray = [];

                if(isUrl) {
                    params.target = target;
                } else {
                    target.map(function(item) {
                        kArray.push("keywords[]="+encodeURI(item));
                    });
                    keywords = '&'+kArray.join("&");
                }
                var urlpart = 'concurrents';
                if(this.currentAction === 'requests') urlpart = 'spectrals';
                var url = '/aggregate/'+urlpart+'?updated=true&target='+$routeParams.target+keywords;



                console.log(url);
                alertify.log("Запрос успешно поставлен в очередь");
                $location.url(url);
            },
            checkboxes: function(){
                var self = this;

                $scope.$watch("selected.checked", function(value) {
                    angular.forEach($scope.list, function(item) {
                        if (angular.isDefined(item.src)) {
                            $scope.selected.items[item.src] = value;
                            $scope.checkBox(item, value);
                        }
                    });
                });
            }(),
            checkBox: function(item, type, bulk) {

                var index = $scope.marked.indexOf(item.src);

                // check shift
                if($scope.shiftPressed && bulk === undefined) {
                    this.setBulk($scope.lastChecked, item);
                    return;
                }

                if(item.position !== undefined) $scope.lastChecked = item;

                if(~index && !type) $scope.marked.splice(index, 1);
                if(!~index && type) $scope.marked.push(item.src);
                //$scope.$apply();
            },
            setBulk: function(from, to) {
                if(from === null) return;

                var start = null, end = null, value, src;
                angular.forEach($scope.list, function(item) {
                    src = item.src;
                    if(end !== null) return;
                    if(src === from.src) {
                        if(start === null) {
                            start = from.src;
                        } else {
                            if(end === null) end = from.src;
                        }
                    }
                    if(src === to.src) {
                        if(start === null) {
                            start = to.src;
                        } else {
                            if(end === null) end = to.src;
                        }
                    }
                    if(start !== null) {
                        if(src === start) {
                            value = $scope.selected.items[src];
                        }
                        $scope.selected.items[src] = value;
                        $scope.checkBox(item, value, true);
                    }

                });
            },
            remove: function(keyword) {
                if(keyword === undefined || !keyword instanceof Array) return;
                var params = {}, map = [], index, item;
                alertify.confirm("Вы уверены?", function(e) {
                    if(!e) return;

                    map = keyword;
                    keyword = keyword.map(function(item) {
                        return "'"+item+"'";
                    });
                    params.query = "MATCH (a:Link)-[rel]-(k:Keyword) WHERE k.src IN ["+keyword.join(",")+"] DELETE rel";
                    if($scope.currentAction === 'requests') {
                        params.query += ", k";
                    }


                        AggregateFactory.query(params, function(response) {
                            if(response.results === undefined || !response.results.length) {
                                alertify.error("Ошибка удаления. Поробуйте позже");
                                return;
                            }


                            for(index in map) {
                                if(!map.hasOwnProperty(index)) continue;

                                $scope.marked.splice($scope.marked.indexOf(map[index]));
                            }
                            $scope.tableParams.reload();

                        },
                        function(err) {
                            if(err.status !== 200) {
                                alertify.error(err.data.error);
                            }
                        });
                });

            },
            processed: function() {
                if($scope.currentAction !== 'requests') return;

                var params = {},
                    query = "MATCH (n:Link)-[:CONTAINS]->()-[:TOP10]-(concurrent)-[:CONTAINS]-() WHERE n.src = '"+$scope.target+"' OPTIONAL MATCH (n:Link)-[:CONTAINS]->()-[:TOP10]-(con) WHERE n.src = '"+$scope.target+"' RETURN  count(distinct concurrent) as c , count(distinct con) as t";
                params.query = query;
                AggregateFactory.query(params, function(resp) {
                    if(resp.errors && resp.errors.length) {
                        alertify.error("Ошибка получения счетчика обработаных");
                        console.error(resp.errors);
                        return;
                    }

                    var data = resp.results[0].data[0].row;
                    $scope.doneCount = data[0];
                    $scope.allCount = data[1];

                    $scope.percentile = Math.ceil(($scope.doneCount/$scope.allCount)*100);
                });
            }()
        });

        document.addEventListener('keydown', function(e) {
            if(e.shiftKey) $scope.shiftPressed = true;
        });
        document.addEventListener('keyup', function(e) {
            if(e.keyCode === 16) $scope.shiftPressed = false;
        });

        // updater
        var listener = function(e) {
            console.info('update event: ' + new Date());
            $scope.update = null;
            $scope.start();
        };

        document.addEventListener('updated', listener, true);
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if(!~["aggregateTopkeys", "aggregateRequests"].indexOf(current.$$route.segment)) return;
            document.removeEventListener('updated', listener, true);
        });

        // init search
        if($scope.target) $scope.start();

    }]);


});

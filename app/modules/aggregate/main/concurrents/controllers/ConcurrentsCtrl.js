define([
    'modules/aggregate/main/concurrents/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('ConcurrentsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', '$location', 'AggregateFactory', 'ngTableParams', function($scope, $injector, bzUser, $routeParams, $location, AggregateFactory, ngTableParams) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});

        function getKeywords(keywords) {
            if(keywords === undefined) return undefined;

            if(typeof keywords === "string") return keywords;

            var keyword, result = {};
            for(keyword in keywords) {

                if(!keywords.hasOwnProperty(keyword)) continue;

                result[keyword] = keywords[keyword];
            }
            return result;
        }

        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            updated: this.updated || $routeParams.updated,
            keywords: $routeParams['keywords[]'],
            path: $location.path(),
            percentile: 0,
            marked: [],
            selected: { 'checked': false, items: {} },
            list: [],
            lastChecked: null,
            shiftPressed: false,
            params: {
                page: 1,            // show first page
                count: 500,
                target: this.target,
                newCheck: this.updated,
                keywords: getKeywords(this.keywords),
                sortable: {
                    c: 'desc'
                }
            },
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api
                    AggregateFactory.concurrents(params.url(), function(data) {
                            //$scope.tableParams.$loading = false;


                            if(!data.data) {
                                $scope.containsData = null;
                                $defer.resolve(data.data);
                                $scope.errors = [data.error];

                                return;
                            }

                            if(data.data.data === undefined) {

                                $scope.containsData = null;
                                return;
                            }

                            params.total(data.data.total);
                            // set new data
                            $scope.containsData = (data.data.data !== undefined && data.data.data.length) ? true : false;
                            $defer.resolve($scope.list = data.data.data);
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

        // METHODS
        angular.extend($scope, {
            start: function(isReload) {
                this.params.target = $routeParams.target;
                if(this.keywords !== undefined) this.params.keywords = getKeywords(this.keywords);
                this.params.newCheck = isReload || $scope.updated;
                $location.search(this.params);
                console.log(this.params);


                this.tableParams.parameters(this.params);

            },
            processed: function() {

                var params = {}, link = $scope.target,
                    query = "MATCH (n:Link)-[:CONTAINS]->(keyword)-[t:TOP10]-(r:Link) WHERE n.src = '"+link+"' OPTIONAL MATCH (n:Link)-[:CONTAINS]->(k)  WHERE n.src = '"+link+"' RETURN COUNT(DISTINCT keyword) as c, COUNT(DISTINCT k) as t";
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
            }(),
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

                if(item.intersection !== undefined) $scope.lastChecked = item;

                if(~index && !type) $scope.marked.splice(index, 1);
                if(!~index && type) $scope.marked.push(item.src);
                //$scope.$apply();
            },
            setBulk: function(from, to) {
                console.log(from);
                console.log(to);
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
            next: function(target) {
                var keywords = "", kArray = [];
                if(typeof target === "string") {
                    //params.target = target;
                } else {
                    target.map(function(item) {
                        kArray.push("keywords="+encodeURI(item));
                    });
                    keywords = '&'+kArray.join("&");
                }
                var url = '/aggregate/requests?updated=true&target='+$routeParams.target+keywords;
                console.log(url);
                alertify.log("Запрос успешно поставлен в очередь");
                $location.url(url);
            },
            remove: function(link) {
                if(link === undefined || !link instanceof Array) return;
                var params = {}, map = [], index, item;
                alertify.confirm("Вы уверены?", function(e) {
                    if(!e) return;

                    map = link;
                    link = link.map(function(item) {
                        return "'"+item+"'";
                    });

                    params.query = "MATCH (n:Link)-[rel:TOP10]->(keyword) WHERE n.src IN ["+link.join(",")+"] DELETE rel,n";
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

            }
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
            if("aggregateConcurrents" != current.$$route.segment) return;
            document.removeEventListener('updated', listener, true);
        });

        $scope.start();

    }]);


});

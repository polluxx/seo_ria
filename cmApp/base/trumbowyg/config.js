define(['base/trumbowyg/module'], function (module) {

    module.directive('trumbowygEditor', ['$filter', function ($filter) {
        jQuery.trumbowyg.langs.ru = {
            viewHTML: $filter('translate')("Посмотреть HTML"),
            formatting: $filter('translate')("Форматирование"),
            p: $filter('translate')("Обычный"),
            blockquote: $filter('translate')("Цитата"),
            code: $filter('translate')("Код"),
            header: $filter('translate')("Заголовок"),
            bold: $filter('translate')("Полужирный"),
            italic: $filter('translate')("Курсив"),
            strikethrough: $filter('translate')("Зачеркнутый"),
            underline: $filter('translate')("Подчеркнутый"),
            strong: $filter('translate')("Полужирный"),
            em: $filter('translate')("Курсив"),
            del: $filter('translate')("Зачеркнутый"),
            unorderedList: $filter('translate')("Обычный список"),
            orderedList: $filter('translate')("Нумерованный список"),
            insertImage: $filter('translate')("Вставить изображение"),
            insertVideo: $filter('translate')("Вставить видео"),
            link: $filter('translate')("Ссылка"),
            createLink: $filter('translate')("Вставить ссылку"),
            unlink: $filter('translate')("Удалить ссылку"),
            justifyLeft: $filter('translate')("По левому краю"),
            justifyCenter: $filter('translate')("По центру"),
            justifyRight: $filter('translate')("По правому краю"),
            justifyFull: $filter('translate')("По ширине"),
            horizontalRule: $filter('translate')("Горизонтальная линия"),
            fullscreen: $filter('translate')("Во весь экран"),
            close: $filter('translate')("Закрыть"),
            submit: $filter('translate')("Вставить"),
            reset: $filter('translate')("Отменить"),
            invalidUrl: $filter('translate')("Неверный URL"),
            required: $filter('translate')("Обязательное"),
            description: $filter('translate')("Описание"),
            title: $filter('translate')("Подсказка"),
            text: $filter('translate')("Текст"),
            selectImage: $filter('translate')("Выбрать изображение"),
            file: $filter('translate')("Файл"),
            error: $filter('translate')("Ошибка"),
            upload: $filter('translate')("Загрузить изображение")
        };

        return {
            restrict: 'A',
            scope: false,
            require: '?ngModel',
            link: function ($scope, element, attr, ngModel) {

                var options = {
                    enableSelectImage: true
                };
                options = angular.extend(options, $scope[attr.trumbowygEditor]);
                $scope.$watch(attr.trumbowygEditor, function(nv, ov){
                    if(angular.isDefined(nv) && angular.isDefined(ov) && nv != ov) {
                        options = angular.extend(options, nv);
                        init(options);
                    }
                });

                var init = function(options) {


                    var btns = [];


                    var butns = Object.getOwnPropertyNames(jQuery.trumbowyg.btnsGrps);

                    btns.push('formatting');
                    btns.push('link');
                    btns.push('|');
                    for(groupname in jQuery.trumbowyg.btnsGrps) {
                        if(groupname == "semantic") continue;

                        var group = jQuery.trumbowyg.btnsGrps[groupname];
                        btns.push(group);
                        btns.push('|');
                    }
                    btns.push('insertImage');
                    btns.push('upload');
                    btns.push('|');
                    btns.push('horizontalRule');
                    btns.push('viewHTML');

                    btns.push('fullscreen');
                    //console.log(jQuery.trumbowyg)

                    element.trumbowyg({
                        "btns": btns,
                        "lang": 'ru',
                        "autogrow": true
                    })
                        .on('tbwblur', function () {
                            $scope.$apply(function () {
                                ngModel.$setViewValue(element.trumbowyg('html'));
                            });
                        });
                }

                init(options);

                $scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newValue, oldValue) {
                    if (angular.isUndefined(newValue)) {
                        element.trumbowyg('empty');
                    } else {
                        element.trumbowyg('html', newValue);
                    }
                });
            }
        };
    }]);

});

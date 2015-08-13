
define(['base/home/module'], function (module) {
    module.filter('trimmer', function() {
            return function (item, expression, end) {
                if (expression === undefined) {
                    expression = /(^\/|\/$)/g;
                }
                if (end === undefined) {
                    end = "";
                }

                return item.trim().replace(expression, end);
            }
        }
    );
});
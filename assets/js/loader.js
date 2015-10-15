(function() {
    if (typeof jQuery == 'undefined' || typeof $ != 'undefined') {
        console.log("LOAD jquery");
        var link = "http://code.jquery.com/jquery-2.1.4.min.js";
        loadScript(link, "script", function() {
            loadScroll();
        });
    } else {
        loadScroll();
    }

    function loadScroll() {
        var link = "http://cobrand.ria.com/js/useful/scrolldepth.min.js";
        loadScript(link, "script", function() {

        });
    }

    function loadScript(url, type, callback){

        var script = document.createElement(type);
        if (type == "script") {
            script.type = "text/javascript";
        } else {
            script.rel = "stylesheet";
        }
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
        if (type == "script") {
            script.src = url;
        } else {
            script.href = url;
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})();
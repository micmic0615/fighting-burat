var require_index = 0;

var require_ids = {};



function require(url, callback){
    if (url.constructor === Array){
        var loaded_num = 0;
        for (var i = 0; i < url.length; ++i) {load_script(url[i], multicallback)};
        function multicallback(data){
            loaded_num++; 
            if (loaded_num == url.length){callback(data)};
        };
    } else {
       load_script(url, callback)
    }

    function load_script(url, callback){
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.charset = "UTF-8";
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
        
        script.onload = function(){
            if (callback != undefined){
                if(require_ids[String(require_index)] != undefined){
                    callback(require_ids[require_index]())
                } else {callback()}
            }
            require_index ++;
        };
    }

}


function define(func){
    require_ids[String(require_index)] = func;
}
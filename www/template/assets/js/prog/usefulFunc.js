var usefulFunc = function () {
    var that = this;
			
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();               
                        
    that.isMail=function(v){ return /^[=_.0-9a-z+~'-]+@(([-0-9a-z_]+\.)+)([a-z]{2,10})$/i.test(v); };
	//jquery extentions
	//serialize form for requests
	$.fn.extend({
            serializeJson:function(p){ 
                var s=$(this).serializeArray();
                if(p==null||p===undefined)p={};
                for(i in s)
                    if(/\[\]$/.test(s[i]['name'])){
                        p[s[i]['name']]=[];
                        $(this).find('[name="'+s[i]['name']+'"]:checked').each(function(){p[s[i]['name']].push($(this).val());});
                    }
                    else p[s[i]['name']]=s[i]['value'];
                return p;
            }
	});
};
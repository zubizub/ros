var historyLoader=function(){ 
	var that=this;
	that.chromeLoaded=!/Chrome\/\w+\.\w+/i.test(navigator.userAgent)&&!/Safary\/\w+\.\w+/i.test(navigator.userAgent)&&!/Safari\/\w+\.\w+/i.test(navigator.userAgent);
	
	that.makeUrlFromJSON=function(req,noQuestion){
		var reqStr=[],i,j;
		for(i in req)
			if(typeof req[i] == "object")
				for(j in req[i])
					reqStr.push(i+'['+j+']='+escape(req[i][j]));
			else
				reqStr.push(i+'='+escape(req[i]));
		if(reqStr.length)
			return (noQuestion===true?'':'?')+reqStr.join('&');
		return '';
	},
	that.pushHistory=function(url,json){ 
        var link = url+(typeof json=='object'?that.makeUrlFromJSON(json):'');
        if(link != location.href)
            if(undefined!=history.pushState) 
                history.pushState(
                    {},
                    "",
                    link
                ); 
	}
	that.winBindBackNext=function(){
		$(window).bind('popstate', function(event){
			if(that.chromeLoaded){
				location.href=location.href;
			}else that.chromeLoaded=true;
		});
	}
	
	//init
	that.winBindBackNext();
};
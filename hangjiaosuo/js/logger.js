define(function(require,exports,module){
	var development = false ;
	var type = 1 ; 
    var devUser = 'xizhao.wang' ;
    var config = {
        url : 'http://packagefe.dev.qunar.com/putTouchLogger'
    } ;
    var paserUrl = function(){
        var href = window.location.href ;
        if(!/^http.+/gi.test(href)){
            development = true ;
            return ;
        }
        
        var search = window.location.search ;
        if(/\?.+/gi.test(search)){
            search = search.slice(1);
            var params = search.split('&'),i,len;
            for( i=0 ,len = params.length ; i < len ; i++){
                if(/^development.+/gi.test(params[i])){
                    var key = params[i].split('=');
                    if(key[0] == 'development' && (key[1] == '1' || key[1] == 'true')){
                        development = true ;                        
                    }
                }
                
                if(/^user.+/gi.test(params[i])){
                    devUser = params[i].split('=')[1] ;
                }
            }
        }
    };
    
    var logger = function(){
        if(development){
			if(!type){
				(new Image()).src = config.url + '?user=' + devUser + '&data=' + JSON.stringify(arguments);
			}else{
				console.log(arguments);
			}            
        }
    } ;
    
	paserUrl();	
	module.exports = logger ;    
});
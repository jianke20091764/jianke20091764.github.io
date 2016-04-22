define(function(require,exports,module){
	var logger = require('js/logger');
	var dbs = window.localStorage ;
	var json = window.JSON ;
	
	var vilidateData = function(data){
		var ret = [] ,key;
		while(data.length !=0 ){
			key = data.splice(utils.random(data.length),1);			
			ret.push(key[0]);
		}
		
		return ret ;
	};
	
	var utils = {
		getItem : function(key){
			return dbs.getItem(key) || false ;
		},
		
		setItem : function(key,obj){
			return dbs.setItem(key,obj || false) ;
		},
		
		removeItem : function(key,obj){
			var data = utils.getItem(key),i,len ,item;
			if(typeof obj == 'undefined'){
				return dbs.removeItem(key);
			}else{
				data = json.parse(data) ;
				for( i = 0 ,len = data.length ; i < len ; i ++){
					if(data[i] && obj.name === data[i].name){
						item = data.splice(i,1);
						break;
					}
				}
				
				utils.setItem(key,json.stringify(data));
				return  item[0] || {};
			}			
		},
		
		random : function(data,num){
			var key = 0 ;
			if(typeof data == 'number'){
				key = (data - 1) - parseInt(Math.random()*data) ;
				return key;	
			}
		
			for(var i = 0 ,num = num || 1 ; i < num ; i ++){
				data = vilidateData(data);
			}
			return vilidateData(data)
		},
		
		getTimeKey : function(){
			return new Date().valueOf() ;
		}
	};
	
	module.exports = utils;
});
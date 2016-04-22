define(function(require,exports,module){
	var logger = require('js/logger');
	var utils = require('js/utils');
	var user = require('js/name.js');
	var development = false ;
	var cache = {
		department : user.texts 
	};
		
	var dataApp = {		
		getAllData : function(){
			var data = cache.department,len ;
			len = data.length ;
			data = utils.random(data,10);			
			
			return data ;		
		},
		
		getUsersData : function() {
			return user.names ; 
		}
	};
	
	var firseLevel = 0 ;
	var secondLevel = 1 ;
	var thirdLevel = 3 ;
	
	utils.setItem('UserLevelIndex',thirdLevel);		
	module.exports = dataApp;
});
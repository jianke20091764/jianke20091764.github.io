define(function(require,exports,module){
	var tpls = {
		people : function(data){
			var ret = [],i = 0,len = data.length || 0,key ;
			while(i < len){
				key = JSON.stringify(data[i]).replace(/"/gi,'&quot;');
				ret.push('<li class="people">');				
				ret.push('<span class="big-name">',data[i],'</span></li>');
				i++ ;		
			}
			
			return ret.join('');
		},
		
		dialog : function(data){
			var ret = [];
			
			ret.push('<p class="big-name">',data.name,'</p>');
			ret.push('<p class="small-name">',data.telephone,'</p>');
			
			return ret.join('');
		}
	};
	
	var template = {
		render : function(tpl,data){
			return tpls[tpl] ? tpls[tpl](data) : '';
		}
	};
	
	module.exports = template ;
});
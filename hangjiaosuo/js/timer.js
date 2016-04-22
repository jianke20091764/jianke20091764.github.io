define(function(require,exports,module){
	require('jquery');	
	function timer(cfg){
		this.config = $.extend({
			period : 2000,
			onStart : function(){},
			onStop : function(){},
			callback : function(){}
		},cfg || {});
		
		this.timeId = false ;
	};
	
	$.extend(timer.prototype,{
		start : function(){
			if(this.timeId){
				clearInterval(this.timeId);				
			}
			
			this.config.onStart && this.config.onStart() ;
			this.isStop = false ;
			this.timeId = setInterval($.proxy(function(){
				if(this.isStop){
					return ;
				}
				this.config.callback && this.config.callback();
			},this),this.config.period);
		},

		stop : function(){
			if(this.timeId){
				clearInterval(this.timeId);				
			}
			
			this.isStop = true ;
			this.config.onStop && this.config.onStop() ;
		}	
	});
	
	module.exports = timer ;
});
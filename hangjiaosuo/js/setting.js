define(function(require,exports,module){
	require('jquery');	
	var logger = require('js/logger');
	var config = require('js/config');
	var utils = require('js/utils');
	var timer = require('js/timer');
	var template = require('js/template'); 	
	var json = window.JSON ;	
	
	var app = {
		load : function(){
			this.build();
			this.render();
			this.regEvents();
		},
		
		build : function(){
			this.currentLevel = utils.getItem('djLevel') ;
			
			this.awardList = $('[item="list"]');
			this.reloadBtn = $('[item="reload"]');
			this.levelBtn = $('[data-value]');
			this.titleItem = $('[item="title"]');
			this.titleItem.html((config.award[this.currentLevel] || '中奖') + '名单');			
		},
		
		render : function(){
			var level = utils.getItem('djLevel');
			var data = json.parse(utils.getItem('djAwards'))[level] || [];
			this.awardList.html(template.render('award',data));			
		},
		
		regEvents : function(){
			var that = this ;
			this.reloadBtn.bind('click',$.proxy(function(e){
				e.preventDefault();
				if(confirm('你确定要重新抽奖，将会清空之前的抽奖结果！')){
					utils.setItem('djReload',1); 
					this.awardList.html('');
				}
				
			},this));
			
			this.levelBtn.bind('click',function(e){
				e.preventDefault();
				//that.currentLevel = $(this).data('value');
				utils.setItem('djLevel',$(this).data('value'));
				that.titleItem.html((config.award[$(this).data('value')] || '中奖') + '名单');
				that.render();
			});

			this.awardTimer	= new timer({
				callback : $.proxy(function(){
					this.render();
				},this),
				
				period : 1000
			});
			
			this.awardTimer.start();
		}				
	};
	
	$(function(){
		app.load();
	});
});
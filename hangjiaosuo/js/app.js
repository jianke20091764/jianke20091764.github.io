/*
* 抽奖页面
*/

define(function(require,exports,module){
	require('jquery');	
	var logger = require('js/logger');
	var config = require('js/config');
	var dataCache = require('js/data');
	var utils = require('js/utils');
	var timer = require('js/timer');
	var lottery = require('js/lottery');
	var template = require('js/template'); 
	var json = window.JSON ;
	
	var app = {
		load : function(){
			this.loadData();
			this.build();
			//this.render();
			this.regEvents();
		},
		
		reload : function(){
			if(utils.getItem('djReload') == 1){
				this.clearAllData();
				this.loadData();
				this.render();
				utils.setItem('djReload',0); 
			}
		},
		
		loadData : function(){
			var data = json.parse(utils.getItem('UserTexts') || '[]');
			if(!data || !data.length || utils.getItem('djReload') == 1 ){
				this.reloadData();
				utils.setItem('djReload',0); 
			}
		},
		
		reloadData : function(){
			utils.setItem('djLevel','third');
			utils.setItem('djTitle',config.title);
			utils.setItem('djAwards',json.stringify({
				first : [],
				second : [],
				third : [],
				other : []
			}));
			utils.setItem('Users',json.stringify(dataCache.getUsersData()));
			utils.setItem('UserTexts',json.stringify(dataCache.getAllData()));
		},
		
		clearAllData : function(){
			utils.setItem('UserTexts','[]');
		},
		
		build : function(){
			this.lotteryTitle = $('[item="title"]');
			this.lotteryPanel = $('[item="lottery"]');
			this.lotteryList = this.lotteryPanel.find('[item="list"]');
			this.lottertMask = $('[item="mask"]');
			this.lotteryDialog = this.lottertMask.find('[item="dialog"]');
			this.lotteryBtn = $('[item="btn"]');
						
			this.setTitle();
		},
		
		setTitle : function(){
			this.lotteryTitle.html(utils.getItem('djTitle'));
		},
		
		render : function(){
			var data = json.parse(utils.getItem('UserTexts'));
			
			this.peopleLength = data.length ;
			this.currentIndex = 0 ;
			
			if(!this.check()){
				return ;
			}
			
			this.lotteryList.html(template.render('people',data.concat(data)));
			if(this.lotteryTiger){
				delete this.lotteryTiger ;
			}
			
			this.lotteryTiger = new lottery({
				dom : this.lotteryList,
				frameLen : this.peopleLength,
				height : 110, 			
				callback : $.proxy(function(index){
					setTimeout($.proxy(function(){
						this.renderDialog(index)
					},this),500);
				},this)	
			});
			
			this.isFirst = false ; 
			this.reloadTimer.start(); 
		},
		
		renderDialog : function(index){			
			var items = this.lotteryList.find('[data-key]');
			var data = items.eq(index-1).data('value'),awards = json.parse(utils.getItem('djAwards'));
			var level = utils.getItem('djLevel');	
			this.currentAward = items.filter('[data-key="' + items.eq(index-1).data('key') + '"]'); 			
			$.extend(data,{
				timestamp : utils.getTimeKey(),
				index : awards[level].length + 1,
				level : level 
			});
			//utils.removeItem('UserTexts',data);
			awards[level].push(data) ;
			utils.setItem('djAwards',json.stringify(awards));
			
			this.currentIndex = index - 1 ;
			this.lotteryBtn.html('抽奖');
			this.isLoading = false ;
			this.isShown = true ;
			this.isClickActive = true ;
			this.isEnterActive = true ;
			
			
			this.lotteryDialog.html(template.render('dialog',this.getCurrentUser()));
			this.lottertMask.show();
			
		},
				
		isShown : false ,
		isEnterActive : false ,		
		isLoading : false ,
		isClickActive : true ,
		isFirst : true ,
		
		getCurrentUser : function(){
			var startIndex = parseInt(utils.getItem('UserLevelIndex') || 3,10);
			var users = JSON.parse(utils.getItem('Users')),data = {}; 
		
			$.each(users||[],function(i,v){
				if(i < startIndex){
					return ;
				}
			
				if(!v.loaded){
					data = v ;
					v.loaded = 1 ;
					return false ;
				}
			});
			
			utils.setItem('Users',JSON.stringify(users));
			return data ;
		},
		
		regEvents : function(){
			this.lotteryBtn.bind('click',$.proxy(function(e){
				e.preventDefault();
				this.startLottery();
			},this));
			
			$(window).bind('keydown',$.proxy(function(e){						
				if((e.keyCode == 13  || e.keyCode == 32) && this.isEnterActive){                    
                    e.preventDefault();
					this.startLottery();
                }
			},this));
			
			this.lottertMask.dblclick($.proxy(function(e){
				e.preventDefault();
				this.lottertMask.hide();
				this.isShown = false ;
				this.isEnterActive = true ;
			},this));
			
			this.lotteryDialog.bind('click',function(e){
				e.preventDefault();
			});
			
			this.titleTimer = new timer({
				callback : $.proxy(function(){
					this.setTitle();
				},this)
			});
			
			this.titleTimer.start();
			
			this.reloadTimer = new timer({
				callback : $.proxy(function(){
					this.reload();					
				},this)
			});
			
			this.reloadTimer.start();
		},
		
		startLottery : function(){
			if(this.isFirst){
				this.render();
			}
		
			if(this.isShown || !this.isClickActive){
				return ;
			}
			
			if(this.isLoading ){
				this.lotteryTiger.stop();				
				return ;
			}
			
			if(this.currentAward){
				this.peopleLength -- ;
				this.currentAward.remove();
				delete this.currentAward ;
			}
			
			if(!this.check()){
				return ;
			}
			
			this.isClickActive = true ;
			this.isEnterActive = true ;
			this.isLoading = true ;
			this.lotteryBtn.html('停止');
			
			this.lotteryTiger.start({
				frameLen : this.peopleLength,
				curFrame : this.currentIndex	
			});
			
		},
		
		check : function(){
			return true ;
		}
		
	};
	
	$(function(){
		app.load();
	});
});
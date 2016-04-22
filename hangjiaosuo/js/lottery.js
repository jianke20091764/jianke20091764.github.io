define(function(require,exports,module){
	require('jquery');	
	var staticConfig = {
		minResistance: 5,
		Cx: 0.01,
		zoom : 3.5,
		accSpeed: 25, 
		accFrameLen: 40, 
		maxSpeed: 250, 
		minSpeed: 20, 
		frameLen: 6, 
		totalFrame: 0, 
		curFrame: 0, 
		curSpeed: 30, 
		lotteryIndex: 1, 
		errorIndex: 0, 
		virtualDistance: 10000,
		isStop : false ,
	} ;
	
	var Tiger = function(cfg){
		this.config = $.extend({},{			
			height : '', 			
			dom : '',
			callback : function(){}			
		},this.config || {}, staticConfig || {},cfg || {});		
	};
	
	$.extend(Tiger.prototype,{		
		start : function(cfg){			
			this.resetConfig(cfg);			
			this.config.dom.css('margin-top', -(this.config.curFrame * this.config.height) + 'px');
			this.turnAround();	
		},
		
		stop : function(){
			this.config.isStop = true ;
		},
		
		resetConfig : function(cfg){
			this.config.isStop = false ;
			this.config = $.extend(this.config || {},cfg || {},{
				totalFrame : 0,
				curSpeed : 50
			});		
		},
		
		turnAround : function(){
			var intervalTime = parseInt(this.config.virtualDistance / this.config.curSpeed);
			this.config.timer = setTimeout($.proxy(function() {
				this.changeNext(intervalTime);
			},this), intervalTime);
		},
		
		changeNext : function(intervalTime){
			//this.config.totalFrame > this.config.accFrameLen
			if (this.config.curSpeed <= this.config.minSpeed + 10) {
				this.config.callback  && this.config.callback(this.config.curFrame);
				return;
			}

			var nextFrame = this.config.curFrame + 1;

			if (nextFrame >= this.config.frameLen + 1) {
				this.config.dom.animate({
					'margin-top': 0
				}, 0);
				
				nextFrame = 1;
			}

			this.config.dom.animate({
				'margin-top': (-(nextFrame - 1) * this.config.height) + 'px'
			}, intervalTime);

			this.config.curFrame = nextFrame;
			this.config.totalFrame ++;
			
			this.freshSpeed();
			this.turnAround();
		},
		
		freshSpeed : function(){
			var totalResistance = this.config.minResistance + this.config.curSpeed * this.config.Cx,
				accSpeed = this.config.accSpeed,
				curSpeed = this.config.curSpeed;
			
			//this.config.totalFrame >= this.config.accFrameLen 	
			if(this.config.isStop){
				totalResistance = this.config.minResistance * this.config.zoom + this.config.curSpeed * this.config.Cx,
				accSpeed = 0;
			}
			
			curSpeed = curSpeed - totalResistance + accSpeed; 
			
			if (curSpeed < this.config.minSpeed) {
				curSpeed = this.config.minSpeed;
			} else if (curSpeed > this.config.maxSpeed) {
				curSpeed = this.config.maxSpeed;
			}
			
			this.config.curSpeed = curSpeed;
		}
	});
		
	function lottery(cfg){
		this.tiger = new Tiger(cfg);
	};
	
	$.extend(lottery.prototype,{
		start : function(cfg){
			this.tiger.start(cfg);
		},
		
		stop : function(){
			this.tiger.stop();
		}
	});
	
	module.exports = lottery ;
});
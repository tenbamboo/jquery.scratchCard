/**
* @todo ScratchCard
* @namespace ScratchCard
* @author haze.liu
* @since 2017年04月13日 15:05:22
*/
(function($) {

//option
// options.backgroundColor //涂层背景颜色
// options.tipsColor //涂层显示文字颜色
// options.tips  //涂层文字内容
// options.btnCotent //按钮文字
// options.btnCallBack //按钮回调
// options.prompt //提示

//demo1
//$(dom).scratchCard();
//demo2
//$(dom).scratchCard({
	// backgroundColor:'#ffffff',
	// tipsColor:'#000000',
	// tips:'刮我中大奖',
	// btnCotent:'中奖啦',
	// btnCallBack:function(){},
	// prompt:'恭喜你中大奖了',
// });

//method

//重新设置按钮属性和提示信息
// $(dom).scratchCard('setBtnAndPrompt',{
		// btnCotent:'再试一次',
		// prompt:'遗憾没中奖',
		// btnCallBack:function(){},
// }); 

// $(dom).scratchCard('reset'); //重画涂层

var ScratchCard= function (element, options) {
	this.element = $(element);
	
	this.param={};
	this.param.backgroundColor=options.backgroundColor || '#aaaaaa';
	this.param.tipsColor=options.tipsColor || '#999999';
	this.param.tips= options.tips || "刮一刮";
	this.param.btnCotent = options.btnCotent || "点我领奖";
	this.param.btnCallBack = options.btnCallBack || function(){};
	this.param.prompt = options.prompt || "恭喜您中奖啦";


	//私有参数
	//这是为了不同分辨率上配合@media自动调节刮的宽度
	this.fontem = parseInt(window.getComputedStyle(document.documentElement, null)["font-size"]);
	// this.isMouseDown 标志用户是否按下鼠标或开始触摸
	// this.canvas 画布对象
	// this.ctx 画笔对象
	// this.isDone 画笔对象是否刮完


	this._init();
}
ScratchCard.prototype ={
	constructor: ScratchCard,
	_init:function(){
		this._initHTML();
		this._initCanvas();
		this._initEvent();
	},
	/**
	  * @public
	  * @function
	  * @todo 重新设置按钮属性和提示信息
	  * @memberof ScratchCard
	  * @param {Object} options -属性
	  */	
	setBtnAndPrompt:function(options){
		var that=this;
		if(options.btnCotent){
			that.element.find(".info span[name='scratchCardBtn']").html(options.btnCotent)
		};
		if(options.prompt){
			that.element.find(".info span[name='scratchCardPrompt']").html(options.prompt)
		};
		if(options.btnCallBack){
			this.param.btnCallBack = options.btnCallBack;
		};

	},
	/**
	  * @public
	  * @function
	  * @todo 重置涂层
	  * @memberof ScratchCard
	  */	
	reset:function(){
		this.isDone=false;
		this._initCanvas();
	},
	/**
	  * @private
	  * @function
	  * @todo 初始化事件
	  * @memberof ScratchCard
	  */	
	_initEvent:function(){
		var canvas=this.canvas;
		//PC端的处理
		var that=this;
		canvas.addEventListener("mousemove",function(e){
			that._eventMove(e);
		},false);
		canvas.addEventListener("mousedown",function(e){
			that._eventDown(e);
		},false);
		canvas.addEventListener("mouseup",function(e){
			that._eventUp(e);
		},false);
			
		//移动端的处理
		canvas.addEventListener('touchstart',function(e){
			that._eventDown(e);
		},false);
		canvas.addEventListener('touchend',function(e){
			that._eventUp(e);
		},false);
		canvas.addEventListener('touchmove',function(e){ 
			that._eventMove(e);
		},false);

		that.element.find(".info span[name='scratchCardBtn']").click(function(){
			if(that.param.btnCallBack){
				that.param.btnCallBack();
			}
		});
	},
	/**
	  * @private
	  * @function
	  * @todo 初始化HTML
	  * @memberof ScratchCard
	  */	
	_initHTML:function(){
		var e=this.element;
		e.addClass('scratchCard');
		var html='<div class="info">'
					+'<span class="prompt" name="scratchCardPrompt">'+this.param.prompt+'</span>'
					+'<span class="btn" name="scratchCardBtn">'+this.param.btnCotent+'</span>'
				+'</div>'
				+'<canvas name="scratchCardCanvas" class="scratchCardCanvas"></canvas>';
		e.append(html);
	},
	/**
	  * @private
	  * @function
	  * @todo 画Canvas
	  * @memberof ScratchCard
	  */	
	_initCanvas:function(){ 


		this.canvas = this.element.find("canvas[name='scratchCardCanvas']")[0];

		var canvas=this.canvas;
				
		//这里很关键，canvas自带两个属性width、height,我理解为画布的分辨率，跟style中的width、height意义不同。
		//最好设置成跟画布在页面中的实际大小一样
		//不然canvas中的坐标跟鼠标的坐标无法匹配
		canvas.width=canvas.clientWidth;
		canvas.height=canvas.clientHeight;
		this.ctx = canvas.getContext("2d");

		var ctx=this.ctx;



		//网上的做法是给canvas设置一张背景图片，我这里的做法是直接在canvas下面另外放了个div。
		//canvas.style.backgroundImage="url(中奖图片.jpg)";
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = this.param.backgroundColor;
		ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
		ctx.fill();
				
		ctx.font = "Bold 30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = this.param.tipsColor;
		ctx.fillText(this.param.tips,canvas.width/2,50);
		//把这个属性设为这个就可以做出圆形橡皮擦的效果
		//有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
		ctx.globalCompositeOperation = 'destination-out';
	},
	/**
	  * @private
	  * @function
	  * @todo 鼠标按下 和 触摸开始
	  * @memberof ScratchCard
	  */
	_eventDown:function(e){
		e.preventDefault();
		this.isMouseDown=true;
	},
	/**
	  * @private
	  * @function
	  * @todo 鼠标抬起 和 触摸结束
	  * @memberof ScratchCard
	  */
	_eventUp :function(e){
		e.preventDefault();
		var canvas=this.canvas;
		var ctx=this.ctx;

		//得到canvas的全部数据
		var a = ctx.getImageData(0,0,canvas.width,canvas.height);
		var j=0;
		for(var i=3;i<a.data.length;i+=4){
			if(a.data[i]==0)j++;
		}
			
		//当被刮开的区域等于一半时，则可以开始处理结果
		if(j>=a.data.length/20){
			this.isDone = true;
		}
		this.isMouseDown=false;
	},
	/**
	  * @private
	  * @function
	  * @todo 鼠标移动 和 触摸移动
	  * @memberof ScratchCard
	  */
	_eventMove :function(e){
		e.preventDefault();

		var canvas=this.canvas;
		var ctx=this.ctx;

		if(this.isMouseDown) {
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var topY = this.element[0].offsetTop;
			var oX = canvas.offsetLeft,
			oY = canvas.offsetTop+topY;
					
			var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
				y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;
				
			//画360度的弧线，就是一个圆，因为设置了ctx.globalCompositeOperation = 'destination-out';
			//画出来是透明的
			ctx.beginPath();
			ctx.arc(x, y, this.fontem*1.2, 0, Math.PI * 2,true);
						 
			//下面3行代码是为了修复部分手机浏览器不支持destination-out
			//我也不是很清楚这样做的原理是什么
			canvas.style.display = 'none';
			canvas.offsetHeight;
			canvas.style.display = 'inherit'; 
						 
			ctx.fill();
		}
				
		if(this.isDone){
			this.element.find('.btn').css({'z-index':3});
		}
	},
	
			
			
}





$.fn.scratchCard = function(option) {
	var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function () {
			var $this = $(this),
				data = $this.data('ScratchCard'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('ScratchCard', (data = new ScratchCard(this, $.extend({}, $.fn.scratchCard.defaults, options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined) {
					return false;
				}
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
};
$.fn.scratchCard.defaults = {};
})(jQuery);


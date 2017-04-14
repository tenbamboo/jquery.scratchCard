# jquery.scratchCard
刮刮乐

## 参数
 options.backgroundColor //涂层背景颜色

 options.tipsColor //涂层显示文字颜色

 options.tips  //涂层文字内容

 options.btnCotent //按钮文字

 options.btnCallBack //按钮回调

 options.prompt //提示



## 完整初始化
//demo1

	$(dom).scratchCard();

//demo2

	$(dom).scratchCard({
	  backgroundColor:'#ffffff',
	  tipsColor:'#000000',
	  tips:'刮我中大奖',
	  btnCotent:'中奖啦',
	  btnCallBack:function(){},
	  prompt:'恭喜你中大奖了',
	});

 ## 方法

	//重新设置按钮属性和提示信息
	$(dom).scratchCard('setBtnAndPrompt',{
		 btnCotent:'再试一次',
		 prompt:'遗憾没中奖',
		 btnCallBack:function(){},
	}); 


	$(dom).scratchCard('reset'); //重画涂层
// 这个文件试图实现一个画2维图表的库
// 请输入全局的x范围
var xMin = 0;
var xMax = 760;
// 请输入估算Y最大值，以便进行合理缩放
var yMax = 10000;
// 纵,横轴放大率
var zoomY = 550/yMax;
var zoomX = 1100/xMax;
// x的分段和每段的计算方法
// var partX = [[0,80],[80,180],[180,280],[280,360],[360,560],[560,760]];

function getY(x){
	var y = 0;
	switch(true){
		case x >= 0 && x <= 80:
			y = -(x-40)*(x-40)+1600;
			break;
		case x>80 && x<=180:
			y = 20*x-1600;
			break;
		case x>180 && x<=280:
			y = -20*(x-280);
			break;
		case x<=360:
			y = -(x-320)*(x-320)+1600;
			break;
		case x<=560:
			y = -0.49*(x-460)*(x-460)+4900;
			break;
		case x<= 660:
			y = 50*x-560*50;
			break;
		case x<= 760:
			y = -50*(x-760);
			break;

		default:
			y = 0;
			break;
	}
	return y;
}
/**
 * 使用退火算法寻找全局最优解
 */
function getGlobalMax(degreeTime){
	var ySave = 0;
	var xSave = 0;
	var xNow = xMin;
	var length = xMax-xMin;
	var degree = (xMax - xMin)/degreeTime;
	for(var i=0;i<degreeTime;i++){
		// 重画图表
		drawGraph();
		var yNow = getY(xNow);
		if(yNow>ySave){
			ySave = yNow;
			xSave = xNow;
		}
		if(xNow + length-(degree*i)>xMax){
			// 如果向右跳一步比向左跳一步升高的多
			if(getY(xNow-(degree*i))>getY(xNow-length+(degree*i))){
				// 向右跳一步
				xNow = xNow -(degree*i);
			}else{
				// 向左跳一步
				xNow = xNow-length+(degree*i);
			}
		}else{
			if(getY(xNow+length-(degree*i))>getY(xNow+length+length-(degree*i))){
				xNow = xNow+length-(degree*i);
			}else{
				xNow = xNow + length + length - (degree*i);
			}
		}
	}
	// 在这里用梯度下降算法求出全剧最优解
	var go = true;
	xNow = Math.floor(xNow);
	yNow = getY(xNow);
	while(go){
		var diff = getY(xNow-1) - getY(xNow+1);
		// 左面比较大向左跳
		if(diff>0){
			xNow -= 1;
			xSave = xNow;
			ySave = getY(xNow);
		}
		// 右边比较大向右跳
		else if(diff<0){
			xNow += 1;
			xSave = xNow;
			ySave = getY(xNow);
		}
		// 两边一样大，结束
		else{
			go = false;
		}
		console.log(diff);
	}
	// 在图上画出最优解的位置
	// 画图前的准备

	var drawing = document.getElementById('graph');
	var ctx = drawing.getContext('2d');
	ctx.beginPath();
	ctx.fillStyle = "red";
    ctx.arc(20+zoomX*xSave,580-zoomY*ySave,10,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillText('['+xSave.toFixed(2)+','+ySave.toFixed(2)+']', 35+zoomX*xSave,580-zoomY*ySave);
	ctx.fillStyle = "black";
	var location = [xSave,ySave];

	return location;
}
// 画图表
function drawGraph(){
	// 画图前的准备
	var drawing = document.getElementById('graph');
	var ctx = drawing.getContext('2d');
	// 全部清空
	ctx.clearRect(0,0,1200,600);
	// 画两个坐标轴
    ctx.beginPath();
    ctx.moveTo(20,20);
    ctx.lineTo(20,600);
    ctx.moveTo(0,580);
    ctx.lineTo(1200,580);
    ctx.closePath();
    ctx.stroke();

    // 开始画函数图像
    for(var i=0;i<xMax;i++){
    	var yNow = getY(i);
    	ctx.beginPath();
    	ctx.arc(20+(zoomX*i),580-(zoomY*yNow),2,0,Math.PI*2,true);
    	ctx.fill();
    }
}
/**
 * 获取随机颜色值
 * @return {[array]} rgb的三个值组成的数组
 */
function randomColor () {
	var colorArr = [0,0,0];
	for(var i=0;i<3;i++){
		colorArr[i] = Math.floor(Math.random()*255);
	}
	return colorArr;
}

// 画出图像
drawGraph();

// 寻找全剧最优解
function findBest(){
	var degree = document.getElementById('degree').value;
	getGlobalMax(degree);
}

/**
 * Created by Administrator on 2016/12/1.
 */
$(function () {
    /**
     * 雪球函数入口
     * @type {Element}
     */
    function Snowflake(elementName) {
        var snowElement = document.getElementById(elementName);
        var canvasContext = snowElement.getContext("2d");
        var config = {
            clientWidth:document.documentElement.clientWidth,
            clientHeight:document.documentElement.clientHeight
        };
        snowElement.width = config.clientWidth;
        snowElement.height = config.clientHeight;
        var snowNumber = 50;
        var width = config.clientWidth;
        var height = config.clientHeight;
        //构建雪球对象
        var snowArrObjs = initSnow(snowNumber,width,height);
        var snowArrNum = snowArrObjs.length;
        /**
         * 渲染雪花
         */
        var render = function () {
            canvasContext.clearRect(0,0,width,height);
            for(var i = 0; i < snowArrNum; i++) {
                snowArrObjs[i].render(canvasContext);
            }
        };
        /**
         * 更新雪花
         */
        var update = function () {
            for(var i = 0; i < snowArrNum; i++) {
                snowArrObjs[i].update();
            }
        };
        /**
         * 渲染与更新雪花函数
         */
        var renderAndUpdate = function () {
            render();
            update();
            requestAnimationFrame(renderAndUpdate);
        };
        /**
         * 调用渲染与更新雪花函数
         */
        renderAndUpdate();
    }
    function initSnow(snowNumber,width,height) {
        var options = {
            minRadius:3,
            maxRadius:10,
            maxX:width,
            maxY:height,
            minSpeedY:0.05,
            maxSpeedY:2,
            speedX:0.05,
            minAlpha:0.5,
            maxAlpha:1.0,
            minMoveX:4,
            maxMoveX:18
        };
        var snowArr = [];
        for (var i = 0;i < snowNumber; i++) {
            snowArr[i] = new Snow(options);
        }
        return snowArr;
    }
    /**
     * 雪球类
     */
    function Snow(snowSettings) {
        this.snowSettings = snowSettings;
        //半径
        this.radius = randomInRange(snowSettings.minRadius,snowSettings.maxRadius);
        //x方向上的初始值
        this.initialX = Math.random() * snowSettings.maxX;
        //角度
        this.angle = Math.random(Math.PI * 2);
        //雪花的坐标
        this.x = this.initialX + Math.sin(this.angle);
        this.y = (-Math.random() * 500);
        //雪花的透明度
        this.alpha = randomInRange(snowSettings.minAlpha,snowSettings.maxAlpha);
        //雪花在x,y方向的速率
        this.speedX = snowSettings.speedX;
        this.speedY = randomInRange(snowSettings.minSpeedY,snowSettings.maxSpeedY);
        //雪花在x轴移动的距离
        this.moveX = randomInRange(snowSettings.minMoveX, snowSettings.maxMoveX);
    }

    /**
     * 定义一个render方法，用来绘制雪球
     */
    Snow.prototype.render = function (canvasContext) {
        canvasContext.beginPath();
        canvasContext.fillStyle = "rgba(255,255,255,"+ this.alpha +")";
        canvasContext.arc(this.x,this.y,this.radius,0,2*Math.PI,true);
        canvasContext.closePath();
        canvasContext.fill();
    };
    /**
     * 定义一个update方法，用来改变雪球的运动路径
     */
    Snow.prototype.update = function () {
        this.y += this.speedY;
        if(this.y > this.snowSettings.maxY) {
            this.y -= this.snowSettings.maxY;
        }
        this.angle += this.speedX;
        if(this.angle > Math.PI * 2) {
            this.angle -= Math.PI *2;
        }
        this.x = this.initialX + this.moveX * Math.sin(this.angle);
    };
    /**
     * 生成在范围内的随机值
     */
    function randomInRange(min,max) {
        var random = Math.random() * (max - min) + min;
        return random;
    }
    Snowflake("snowflake");
});
//灯动画
var lamp = {
    elem : $('.b_background'),
    bright : function () {
        this.elem.addClass('lamp_bright')
    },
    dark : function () {
        this.elem.removeClass('lamp_bright')
    }
};
var container = $(".ani_wrap");
var swipe = Swipe(container);
visualWidth = container.width();
visualHeight = container.height();

//页面滚动到指定位置
function scrollTo(time,proportionX) {
    var disX = visualWidth * proportionX;
    swipe.scrollTo(disX,time);
}
//获取数据
var getValue = function(className) {
    var $elem = $(className);
    return {
        top : $elem.position().top,
        height : $elem.height()
    };
};
//路的Y轴
var bridgeY = function () {
    var data = getValue('.c_background_middle');
    return data.top;
}();
////////
//小女孩//
////////
var girl = {
    elem:$(".girl"),
    getHeight:function () {
        return this.elem.height();
    },
    setOffset:function () {
        this.elem.css({
            left: visualWidth / 2,
            top: bridgeY - this.getHeight()
        });
    }
};
//修正小女孩的位置
girl.setOffset();
swipe.scrollTo(visualWidth * 2,0);

//开关门的效果
function doorAction(left, right, time) {
    var $door = (".door");
    var doorLeft = $(".left_door");
    var doorRight = $(".right_door");
    var defer = $.Deferred();
    var count = 2;
    var complete = function () {
        if(count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left':left
    },time,complete);
    doorRight.transition({
        'right':right
    },time,complete);
    return defer;
}
//开门
function openDoor() {
    return doorAction('-50%','-50%',2000);
}
//关门
function shutDoor() {
    return doorAction('0','0',2000);
}

var instanceX;
/**
 * 小孩走路
 *
 */
function BoyWalk() {
    var container = $(".ani_wrap");
    //页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();
//获取数据
    var getValue = function(className) {
        var $elem = $(className);
        return {
            top : $elem.position().top,
            height : $elem.height()
        };
    };
//路的Y轴
    var pathY = function () {
        var data = getValue('.a_background_middle');
        return data.top + data.height/2;
    }();
    //设置小男孩位置
    var $boy = $("#boy");
    var boyWidth = $boy.width();
    var boyHeight = $boy.height();
    $boy.css({
        "top" : pathY - boyHeight +25 + "px"
    });
////////////////////////////////////////////////////////
//===================动画处理============================ //
////////////////////////////////////////////////////////
//暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }
//恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }
//小男孩走路动作
    function slowWalk() {
        $boy.addClass("slowWalk");
    }
//计算位移的值
    function caculateDis(direction,proportion) {
        return (direction == 'x' ? visualWidth : visualHeight) * proportion;
    }
//用transition运动到指定位置
    function startRun(options, runTimes) {
        //定义一个Deffered对象
        var dfdPlay = $.Deferred();
        restoreWalk();
        $boy.transition(
            options,
            runTimes,
            'linear',
            function () {
                dfdPlay.resolve();
            });
        return dfdPlay;
    }
//整合动画运动到指定坐标位置
    function walkRun(time,disX,disY) {
        time = time || 3000;
        slowWalk();
        var d1 = startRun({
            "left" : disX + "px",
            "top" : disY ? disY : undefined
        }, time);
        return d1;
    }

    //走进商店
    function walkToshop(runTime) {
        var defer = $.Deferred();
        var doorObj = $(".door");
        //门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        var doorOffsetTop = offsetDoor.top;
        //男孩当前的坐标
        var posBoy = $boy.position();
        var boyPoxLeft = offsetBoy.left;
        var boyPoxTop = posBoy.top;

        //中间位置
        var boyMiddle = $boy.width() / 2;
        var doorMiddle = doorObj.width() / 2;
        var doorTopMiddle = doorObj.height() /2;

        instanceX = (doorOffsetLeft + doorMiddle) - (boyPoxLeft + boyMiddle);
        instanceY = boyPoxTop + boyHeight - doorOffsetTop  + (doorTopMiddle);
        //开始走路
        var walkPlay = startRun({
            transform:'translateX(' + instanceX + 'px),translateY(-' + instanceY + ')scale(0.5,0.5)',
            opacity:0.1
        },2000);
        walkPlay.done(function () {
            $boy.css({
                opacity:0
            });
            defer.resolve();
        });
        return defer;
    }
    //取花
    function talkFlower() {
        var defer = $.Deferred();
        setTimeout(function () {
            $boy.addClass('boy_flower');
            defer.resolve()
        },1000);
        return defer
    }
    //走出店
    function walkOutShop(runTime) {
        var defer = $.Deferred();
        restoreWalk();
        var walkPlay = startRun({
            transform:'translateX(' + instanceX + 'px),translateY(0),scale(1,1)',
            opacity:1
        },runTime);
        walkPlay.done(function () {
            defer.resolve();
        });
        return defer;
    }
    return {
        //开始走路
        walkTo: function (time,proportionX,proportionY) {
            var disX = caculateDis('x',proportionX);
            var disY = caculateDis('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //走进商店
        toShop: function () {
            return walkToshop.apply(null,arguments);
        },
        //取花
        talkFlower: function () {
            return talkFlower();
        },
        //走出商店
        outShop:function () {
            return walkOutShop.apply(null,arguments);
        },
        //停止走路
        stopWalk: function () {
            pauseWalk();
        },
        //获取男孩的宽度
        getWidth:function () {
            return $boy.width();
        },
        //复位初始状态
        resetOriginal:function () {
            this.stopWalk();
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        setFlowerWalk:function () {
            $boy.addClass('slowFlowerWalk');
        }
    }
}

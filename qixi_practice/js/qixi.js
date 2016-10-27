/**
 * Created by Administrator on 2016/10/27.
 */
function boy() {
    var displacementX,displacementY;
    var visualWidth = container.width();
    var visualHeight = container.height();
    var offsetHei = $(".a_background_middle").offset().top;
    var offsetTop = offsetHei + $(".a_background_middle").height() / 2;
    var $boy = $(".boy");
    $boy.css({
        "top":offsetTop - $boy.height() + 25 + "px"
    });
    //转换具体坐标值
    var distanceValue = function (x,proportion) {
        return (x == "x" ? proportion * visualWidth : proportion * visualHeight);
    };
    //走到指定位置
    function startRun(option,time) {
        var dfdplay = $.Deferred();
        $boy.transition(option,time,"linear",function () {
            dfdplay.resolve();
        });
        return dfdplay;
    }
    //小男孩走路
    function runWalk(time,x,y) {
        time = time || 3000;
        var disX = distanceValue("x",x);
        var disY = distanceValue("y",y);
        var d1 = startRun({
            "left":disX,
            "top":disY ? disY : undefined
        },time);
        return d1;
    }
    //停止走路
    function stopWalk() {
        $boy.addClass("stop_walk");
    }
    //走进商店
    function walkToShop(runTime) {
        var defer = $.Deferred();
        var $door = $(".door");
        var doorOffsetWid = $door.offset().left;
        var doorOffsetHei = $door.offset().top;
        var boyOffsetWid = $boy.offset().left;
        var boyOffsetHei = $boy.offset().top;
        displacementX = doorOffsetWid + $door.width() / 2 - (boyOffsetWid + $boy.width() / 2);
        displacementY = doorOffsetHei + $door.height() / 2 - (boyOffsetHei + $boy.height() / 2);
        var walkPlay = startRun({
            "transform":"translate3d(" + displacementX + "px,-" + displacementY + "px,0) scale(0.5,0.5)",
            "opacity":"0.4"
        },runTime);
        walkPlay.done(function () {
            $boy.css({
                opacity:0
            });
            defer.resolve();
        });
        return defer;
    }

    return {
        distanceValue:function (x,proportion) {
            return distanceValue(x,proportion);
        },
        runWalk:function (time,x,y) {
            return runWalk(time,x,y);
        },
        shutWalk:function () {
            stopWalk();
        },
        walkToShop:function () {
            walkToShop();
        }
    }
}
//开关门的动作
function doorAction(left,right,runTime) {
    var leftDoor = $(".door .left_door");
    var rightDoor = $(".door .right_door");
    var defer = $.Deferred();
    var count = 2;
    var complete = function () {
        if(count == 1) {
            defer.resolve();
            return defer;
        }
        count--;
    }
    leftDoor.transition({
        "left":left
    },runTime);
    rightDoor.transition({
        "right":right
    },runTime);
}
//开关门动画
function doorOpen() {
    return doorAction("-50%","-50%",500);
}
function doorClose() {
    return doorAction("0","0",500);
}
//灯的动作
var lamp = {
    elem:$(".lamp"),
    lampBright:function() {
        this.elem.addClass("lamp_bright")
    },
    lampDark:function() {
        this.elem.removeClass("lamp_bright")
    }
};
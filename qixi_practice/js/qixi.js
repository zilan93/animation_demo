/**
 * Created by Administrator on 2016/10/27.
 */
//animationEnd事件
var animationEnd = (function () {
    var explorer = navigator.userAgent;
    if(~explorer.indexOf('webkit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();
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
            "transform":"translateX(" + displacementX + "px),scale(0.1,0.1)",
            "opacity":"0.3"
        },runTime);
        walkPlay.done(function () {
            $boy.css({
                opacity:0
            });
            defer.resolve();
        });
        return defer;
    }
    //走出商店
    function shutShop(runTime) {
        var defer = $.Deferred();
        var walkPlay = startRun({
            "transform":"translateX(" + displacementX + "px) scale(1,1)",
            "opacity":1
        },runTime);
        walkPlay.done(function () {
            defer.resolve();
        });
        return defer;
    }
    //取花
    function takeFlower() {
        var defer = $.Deferred();
        setTimeout(function () {
            $boy.removeClass("walk_slow").addClass("walk_flower");
            defer.resolve();
        },1000);
        return defer;
    }
    return {
        runWalk:function (time,x,y) {
            return runWalk(time,x,y);
        },
        shutWalk:function () {
            stopWalk();
        },
        walkToShop:function (runTime) {
            return walkToShop(runTime);
        },
        shutShop:function (runTime) {
            return shutShop(runTime);
        },
        takeFlower:function () {
            return takeFlower();
        },
        runRotate:function (callback) {
            $boy.addClass("rotate_boy");
            if(callback) {
                $boy.on(animationEnd,function () {
                    callback();
                    $(this).off();
                })
            }
        },
        resetOriginal:function() {
            this.shutWalk();
            $boy.removeClass("walk_flower").addClass("original_state");
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
//小鸟
var bird = {
    elem:$(".bird"),
    birdFly:function () {
        this.elem.addClass("bird_fly");
        this.elem.transition({
            right:"100%"
        },5000)
    }
}
//小女孩
var girl = {
    elem:$(".girl"),
    girlOffsetHei:function() {
        return this.elem.offset().top
    },
    girlOffsetWid:function () {
        return this.elem.offset().left
    },
    runRotate:function () {
        this.elem.addClass("rotate_girl")
    }
};
//logo动画
var logo = {
    elem:$(".logo"),
    run:function () {
        this.elem.addClass("logolightSpeedIn")
            .on(animationEnd,function () {
                $(this).addClass("logoshake").off();
            });
    }
};
//飘花效果实现
function flowerFlow() {
    var flowerURLs = [
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake1.png",
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake2.png",
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake3.png",
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake4.png",
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake5.png",
        "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake6.png"
    ];
    var $flakeContainer = $(".flower_box");
    function snowflake() {
        function getImagesName() {
            return flowerURLs[[Math.floor(Math.random() * 6)]];
        }
        function createSnowBox() {
            var url = getImagesName();
            var opacityValue = Math.random();
            return $("<div class='flower' />").css({
                "left": Math.random() * ($("#container").width() - 100) + "px",
                "top":"-41px",
                "background":"url(" + url + ") no-repeat",
                "opacity":opacityValue >= 0.5 ? opacityValue : 1
            }).addClass("snowRoll");
        }
        return createSnowBox();
    }
    setInterval(function () {
        var flowerDiv = snowflake();
        $flakeContainer.append(flowerDiv);
        flowerDiv.transition({
            "left":Math.random() * ($("#container").width() - 100) + "px",
            "top":$("#container").height() - 41 + "px"
        },5000,'ease-out',function () {
            $(this).remove();
        });
    },500)
}
//音乐配置
var audioConfig = {
    enable:true,
    playURL:'C:/users/administrator/desktop/animation_demo/qixi_practice/music/happy.wav',
    cycleURL:'C:/users/administrator/desktop/animation_demo/qixi_practice/music/circulation.wav'
}
function html5Audio(url,isloop) {
    var audio = new Audio(url);
    audio.autoplay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end:function (callback) {
            audio.addEventListener('ended',function () {
                callback();
            },false);
        }
    };
}
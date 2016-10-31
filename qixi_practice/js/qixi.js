Qixi = function () {
    //参数配置
    var config = {
        keepZoomRatio:false,
        layer:{
            'width':'100%',
            'height':'100%',
            'top':0,
            'left':0
        },
        audio:{
            enable:true,
            playURL:'C:/users/administrator/desktop/animation_demo/qixi_practice/music/happy.wav',
            cycleURL:'C:/users/administrator/desktop/animation_demo/qixi_practice/music/circulation.wav'
        },
        setTime:{
            walkToThird: 6000,
            walkToMiddle: 6500,
            walkToEnd: 6500,
            walkTobridge: 2000,
            bridgeWalk: 2000,
            walkToShop: 1500,
            walkOutShop: 1500,
            openDoorTime: 800,
            shutDoorTime: 500,
            waitRotate: 850,
            waitFlower: 800
        },
        snowflakeURL:[
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake1.png",
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake2.png",
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake3.png",
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake4.png",
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake5.png",
            "c:/Users/administrator/desktop/animation_demo/qixi_practice/images/snowflake6.png"
        ]
    };
    if(config.keepZoomRatio) {
        var proportionY = 900 / 1440;
        var screenHeight = $(document).height();
        var zoomHeight = screenHeight * proportionY;
        var zoomTop = (screenHeight - zoomHeight) /2;
        config.layer.height = zoomHeight;
        config.layer.top = zoomTop
    }
    var instanceX;
    var container = $(".qixi_bg");
    container.css(config.layer);
    var visualWidth = container.width();
    var visualHeight = container.height();
    //定位小男孩的位置
    var getValue = function (className) {
        var $elem = $(className);
        return {
            height:$elem.height(),
            top:$elem.position().top
        }
    };
    var pathY = function () {
        var data = getValue(".a_background_middle");
        return data.top + data.height / 2
    }();
    //获取c图里中间背景图的偏移
    var bridgeY = function () {
        var data = getValue(".c_background_middle");
        return data.top
    }();
    //animationEnd事件
    var animationEnd = (function () {
        var explorer = navigator.userAgent;
        if(~explorer.indexOf('webkit')) {
            return 'webkitAnimationEnd';
        }
        return 'animationend';
    })();
    //自动播放音频
    if(config.audio.enable) {
        var audio1= html5Audio(config.audio.playURL);
        audio1.end(function () {
            html5Audio(config.audio.cycleURL,true)
        })
    }
    //背景图滚动
    var swipe = Swipe(container);
    function scrollTo(time, proportionX) {
        var distX = container * proportionX;
        swipe.scrollTo(distX,time)
    }
    //小女孩
    var girl = {
        elem:$(".girl"),
        getWidth:function () {
            return this.elem.width()
        },
        getHeight: function () {
            return this.elem.height()
        },
        setOffset:function () {
            this.elem.css({
                left:visualWidth / 2,
                top:bridgeY - this.getHeight()
            })
        },
        getOffset:function () {
            return this.elem.offset();
        },
        runRotate:function () {
            this.elem.addClass("rotate_girl")
        }
    };
    //小鸟
    var bird = {
        elem:$(".bird"),
        birdFly:function () {
            this.elem.addClass("bird_fly");
            this.elem.transition({
                right:visualWidth
            },15000,'linear')
        }
    };
    //logo动画
    var logo = {
        elem:$(".logo"),
        run:function () {
            this.elem.addClass("logolightSpeedIn")
                .on(animationEnd,function () {
                    $(this).addClass("logoshake").off()
                });
        }
    };
    var boy = BoyWalk();
    boy.walkTo()
    //小男孩相关动作封装
    function BoyWalk() {
        var $boy = $(".boy");
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        var displacementX;
        $boy.css({
            "top":pathY - boyHeight + 25 + "px"
        });
        //停止走路
        function pauseWalk() {
            $boy.addClass("stop_walk")
        }
        //恢复走路
        function restoreWalk() {
            $boy.removeClass("stop_walk")
        }
        //开始走路
        function slowWalk() {
            $boy.addClass("slowWalk")
        }
        //走到指定位置
        function startRun(option,time) {
            var dfdPlay = $.Deferred();
            $boy.transition(option,time,"linear",function () {
                dfdPlay.resolve();
            });
            return dfdPlay;
        }
        //小男孩走路
        function runWalk(time,x,y) {
            time = time || 3000;
            slowWalk();
            var d1 = startRun({
                "left":x + 'px',
                "top":y ? y : undefined
            },time);
            return d1;
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
            var walkPlay = startRun({
                "transform":"translateX(" + displacementX + "px),scale(0.3,0.3)",
                "opacity":"0.1"
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
        //位置比例转换成实际像素值
        function calculateDist(direction,proportion) {
            return (direction == 'x' ? visualWidth : visualHeight) * proportion;
        }
        return {
            walkTo:function (time, proportionX, proportionY) {
                var distX = calculateDist('x',proportionX);
                var distY = calculateDist('y',proportionY);
                return runWalk(time,distX,distY)
            },
            stopWalk:function () {
                pauseWalk();
            },
            walkToShop:function (runTime) {
                return walkToShop(runTime);
            },
            shutShop:function (runTime) {
                return shutShop(runTime);
            },
            takeFlower:function () {
                $boy.removeClass("walk_slow").addClass("walk_flower");
            },
            runRotate:function (callback) {
                restoreWalk();
                $boy.addClass("rotate_boy");
                if(callback) {
                    $boy.on(animationEnd,function () {
                        callback();
                        $(this).off();
                    })
                }
            },
            resetOriginal:function() {
                this.pauseWalk();//这里为什么用this
                $boy.removeClass("walk_flower").addClass("original_state");
            },
            getWidth:function () {
                return $boy.width()
            }
        }
    }
    //开关的效果封装
    var BoyToShop = function (boyObj) {
        var defer = $.Deferred();
        var $door = $(".door");
        var leftDoor = $(".door .left_door");
        var rightDoor = $(".door .right_door");
        //开关门的动作
        function doorAction(left,right,runTime) {
            var defer = $.Deferred();
            var count = 2;
            var complete = function () {
                if(count == 1) {
                    defer.resolve();
                    return
                }
                count--;
            };
            leftDoor.transition({
                "left":left
            },runTime,complete);
            rightDoor.transition({
                "right":right
            },runTime,complete);
            return defer
        }
        //开关门动画
        function doorOpen(time) {
            return doorAction("-50%","-50%",time);
        }
        function doorClose() {
            return doorAction("0","0",time);
        }
        function takeFlower() {
            var defer = $.Deferred();
            boy.takeFlower();
            setTimeout(function () {
                defer.resolve()
            },config.setTime.waitFlower);
            return defer
        }
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



//飘花效果实现
    function flowerFlow() {
        var flowerURLs = [

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
};
function swipe() {
    //获取窗口的宽度
    var container = $("#container");
    var bgObj = container.children("ul");
    var bgLists = bgObj.children("li");
    var visualWidth = container.width();
    var visualHeight = container.height();
    //设置背景元素的宽高
    bgLists.css({
        "width":visualWidth + "px"
    });
    bgObj.css({
        "width":visualWidth * bgLists.length + "px",
        "height":visualHeight
    });
    //背景滑动
    function scrollTo(dis,time) {
        bgObj.css({
            "transform":"translate3d(-" + dis + "px,0,0)",
            "transition":"all linear " + time +"ms"
        });
    }
    return {
        scrollToFun:function (dis,time) {
            scrollTo(dis,time);
        }
    }
}
$(function () {
    var container = $("#container");
    var scrollTo = swipe();
    scrollTo.scrollToFun();
    var walk = boy();
    walk.runWalk(5000,0.7).then(function () {
        scrollTo.scrollToFun(container.width(),5000);
    }).then(function () {
        return walk.runWalk(5000,0.5);
    }).then(function () {
        return doorOpen();
    }).then(function () {
        lamp.lampBright();
    }).then(function(){
        return walk.walkToShop(1500);
    }).then(function () {
        return walk.takeFlower();
    }).then(function () {
        return walk.shutShop(1500);
    }).then(function () {
        return doorClose();
    }).then(function () {
        lamp.lampDark();
        bird.birdFly();
    }).then(function () {
        scrollTo.scrollToFun(container.width() * 2,5000);
    }).then(function () {
        return walk.runWalk(5000,0.15);
    }).then(function () {
        return walk.runWalk(1000,0.25,girl.girlOffsetHei() / container.height());
    }).then(function () {
        var disDvalue = (girl.girlOffsetWid() - $(".boy").width()) / container.width();
        return walk.runWalk(1000,disDvalue);
    }).then(function () {
        walk.resetOriginal();
    }).then(function () {
        setTimeout(function () {
            girl.runRotate();
            var walk = boy();
            walk.runRotate(function () {
                logo.run();
            });
        },1000);
    }).then(function () {
        flowerFlow();
    });
    var audio1 = html5Audio(audioConfig.playURL);
    audio1.end(function () {
        html5Audio(audioConfig.cycleURL,true);
    });
});

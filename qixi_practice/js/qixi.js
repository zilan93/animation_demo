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
    var container = $("#container");
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
        return (data.top + data.height / 2);
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
        var distX = visualWidth * proportionX;
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
    boy.walkTo(config.setTime.walkToThird,0.6).then(function () {
        scrollTo(config.setTime.walkToMiddle,1);
        return boy.walkTo(config.setTime.walkToMiddle,0.5)
    }).then(function () {
        bird.birdFly()
    }).then(function () {
        boy.stopWalk();
        return BoyToShop(boy)
    }).then(function () {
        girl.setOffset();
        scrollTo(config.setTime.walkToEnd,2);
        return boy.walkTo(config.setTime.walkToEnd,0.15)
    }).then(function () {
        return boy.walkTo(config.setTime.walkTobridge,0.25,(bridgeY - girl.getHeight()) / visualHeight)
    }).then(function () {
        var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
        return boy.walkTo(config.setTime.bridgeWalk,proportionX)
    }).then(function () {
        boy.resetOriginal();
        setTimeout(function () {
            girl.rotate();
            boy.runRotate(function () {
                logo.run();
                snowflake()
            })
        },config.setTime.waitRotate)
    });
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
            var doorOffsetLeft = $door.offset().left;
            var boyOffsetLeft = $boy.offset().left;
            instanceX = doorOffsetLeft + $door.width() / 2 - (boyOffsetLeft + $boy.width() / 2);
            var walkPlay = startRun({
                "transform":"translateX(" + instanceX + "px),scale(0.3,0.3)",
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
                return walkToShop.apply(null,arguments);
            },
            shutShop:function (runTime) {
                return shutShop.apply(null,arguments);
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
        function doorClose(time) {
            return doorAction("0","0",time);
        }
        //等待取花
        function takeFlower() {
            var defer = $.Deferred();
            boy.takeFlower();
            setTimeout(function () {
                defer.resolve()
            },config.setTime.waitFlower);
            return defer
        }
        //开关灯动画
        var lamp = {
            elem:$(".lamp"),
            bright:function() {
                this.elem.addClass("lamp_bright")
            },
            dark:function() {
                this.elem.removeClass("lamp_bright")
            }
        };
        var waitOpen = doorOpen(config.setTime.openDoorTime);
        waitOpen.then(function () {
            lamp.bright();
            return boyObj.walkToShop($door,config.setTime.walkToShop)
        }).then(function () {
            return takeFlower();
        }).then(function () {
            return boyObj.shutShop(config.setTime.shutDoorTime)
        }).then(function () {
            doorClose(config.setTime.shutDoorTime);
            lamp.dark();
            defer.resolve()
        });
        return defer;
    };
    //飘花效果实现
    function snowflake() {
        var $flakeContainer = $(".flower_box");
        function getImagesName() {
            return flowerURLs[[Math.floor(Math.random() * 6)]];
        }
        function createSnowBox() {
            var url = getImagesName();
            return $("<div class='flower' />").css({
                "top":"-41px",
                "background":"url(" + url + ") no-repeat cover",
            }).addClass("snowRoll");
        }
        setInterval(function () {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1;
            var endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            var $flake = createSnowBox();
            $flake.css({
                left:startPositionLeft,
                opacity:randomStart
            });
            $flakeContainer.append($flake);
            flowerDiv.transition({
                "left":endPositionLeft,
                "top":endPositionTop,
                opacity:0.7
            },duration,'ease-out',function () {
                $(this).remove();
            });
        },200)
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
//页面背景滚动
function Swipe(container,options) {
    var bgObj = container.find(":first");
    var swipe = {};
    var slides = bgObj.children('li');
    var width = container.width();
    var height = container.height();
    //设置背景元素的宽高
    bgObj.css({
        "width":width * slides.length + "px",
        "height":height + 'px'
    });
    $.each(slides,function (index) {
        var slide = slides.eq(index);
        slide.css({
            width:width + 'px',
            height:height +'px'
        })
    });
    var isComplete = false;
    var timer;
    var callbacks = {};
    container[0].addEventListener('transitionend',function () {
        isComplete = true
    },false);
    function monitorOffset(element) {
        timer = setTimeout(function () {
            if(isComplete) {
                clearInterval(timer);
                return
            }
            callbacks.move(element.offset().left);
            monitorOffset(element)
        },500)
    }
    swipe.watch = function (eventName,callback) {
        callbacks[eventName] = callback
    };
    swipe.scrollTo = function (x, speed) {
        bgObj.css({
            'transition':'all ' + speed + 'ms',
            'transform':'translate3d(-'+ x + 'px,0px,0px)'
        });
        return this
    };
    return swipe
}
$(function () {
   Qixi();
});

/**
 * 除页面滚动以外的动画效果
 */
var animationAction = (function () {
    var instanceX;
    var instanceY,
        container = $(".ani_wrap"),
        visualWidth = container.width(),
        visualHeight = container.height(),
        boyAction = {};
//动画结束事件兼容处理
    var animationEnd = (function () {
        var explorer = navigator.userAgent;
        if(~explorer.indexOf('webkit')) {
            return 'webkitAnimationEnd';
        }
        return 'animationend';
    })();
//音频播放函数
    function html5Audio(url,isloop) {
        var audio = new Audio(url);
        audio.autoplay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end:function (callback) {
                audio.addEventListener("ended",function () {
                    callback();
                },false);
            }
        }
    }
    function audioPlay() {
        var audio= {
            enable:true,
            playURL:'music/happy.wav',
            cycleURL:'music/circulation.wav'
        };
        var audio1 = html5Audio(audio.playURL);
        audio1.end(function () {
            html5Audio(config.audio.cycleURL,true);
        })
    }
//获取数据的高度和偏移值
    var getValue = function (className) {
        var $elem = $(className);
        return {
            height:$elem.height(),
            offsetTop:$elem.position().top
        }
    };
    function BoyWalk() {
        //设置小男孩位置
        var $boy = $("#boy");
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        //页面可视区域
        var visualWidth = container.width();
        var visualHeight = container.height();
        //获取小男孩的定位值
        var pathY = function () {
            var data = getValue(".a_background_middle");
            return data.offsetTop + data.height / 2;
        }();
        //初始化小男孩的位置
        $boy.css({
            "top" : pathY - boyHeight +25 + "px"
        });
////////////////////////////////////////////////////////
//===================动画处理============================ //
////////////////////////////////////////////////////////
        //暂停走路
        function pauseWalk() {
            $boy.removeClass('boy_flower').addClass("boy_rotate").addClass('pauseWalk');
        }
        //恢复走路
        function restoreWalk() {
            $boy.removeClass('pauseWalk');
        }
        //小男孩走路动作
        function slowWalk() {
            $boy.addClass("slow_walk");
        }
        //将百分比转换成数值
        function caculateDis(directon,proportion) {
            return (directon == 'x' ? visualWidth : visualHeight) * proportion;
        }
        //小男孩走到指定位置
        function walkRun(time,disX,disY) {
            time = time || 3000;
            slowWalk();
            var dl = startRun({
                "left":disX + "px",
                "top":disY ? disY : undefined
            },time);
            return dl;
        }
        //移动到指定位置
        function startRun(options,runTime) {
            var dfd = $.Deferred();
            restoreWalk();
            $boy.transition(
                options,
                runTime,
                "linear",
                function () {
                    dfd.resolve();
                }
            );
            return dfd;
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
            var boyPoxLeft = posBoy.left;
            var boyPoxTop = posBoy.top;

            //中间位置
            var boyMiddle = $boy.width() / 2;
            var doorMiddle = doorObj.width() / 2;
            var doorTopMiddle = doorObj.height() /2;

            instanceX = (doorOffsetLeft + doorMiddle) - (boyPoxLeft + boyMiddle);
            instanceY = boyPoxTop + boyHeight/2 - (doorOffsetTop + doorTopMiddle);
            //开始走路
            var walkPlay = startRun({
                transform:'translateX(' + instanceX + 'px),translateY(-' + instanceY + 'px),scale(0.5,0.5)',
                opacity:0.2
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
                $boy.removeClass("slow_walk").addClass('boy_flower');
                defer.resolve()
            },1000);
            return defer;
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
            //位移值
            instanceX:function() {
                return instanceX;
            },
            //还原到站立的姿势
            resetOriginal:function () {
                this.stopWalk();
                $boy.removeClass("boy_flower slow_walk").addClass("boyOriginal")
            },
            //转身动作
            rotate:function (callback) {
                restoreWalk();
                $boy.addClass('rotate');
                if(callback) {
                    $boy.one(animationEnd,function () {
                        callback();
                    })
                }
            }
        }
    }
//开关门的效果
    function doorAction(left,right,time) {
        var dfd = $.Deferred();
        var $door = $(".door");
        var leftDoor = $door.find(".left_door");
        var rightDoor = $door.find(".right_door");
        var count = 1;
        var complete = function() {
            if(count == 2) {
                dfd.resolve();
                return;
            }
            count++;
        };
        leftDoor.transition({
            "left":left
        },time,"linear",complete);
        rightDoor.transition({
            "right":right
        },time,"linear",complete);
        return dfd;
    }
//开门
    var openDoor = function () {
        return doorAction("-50%","-50%",1500);
    };
//关门
    var shutDoor = function () {
        return doorAction("0","0",1500);
    };
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
////////
//小女孩//
////////
//获取中间桥的偏移
    var bridgeY = function () {
        var data = getValue(".c_background_middle");
        return data.top;
    }();
    var girl = {
        elem:$(".girl"),
        rotate:function () {
            this.elem.addClass('girl_rotate');
        },
        getWidth:function () {
            return this.elem.width();
        },
        getHeight:function () {
            return this.elem.height();
        },
        setPosition:function () {
            this.elem.css({
                left: visualWidth / 2,
                top: bridgeY - this.getHeight()
            });
        },
        getPosition:function () {
            return this.elem.offset();
        }
    };
//修正小女孩的位置
    girl.setPosition();
////////
//logo//
////////
//logo动画
    var logo = {
        elem:$(".logo"),
        run:function () {
            this.elem.addClass('logolightSpeedIn')
                .on(animationEnd,function () {
                    $(this).addClass('logoshake').off();
                });
        }
    };
////////
//飘花//
////////
    var snowflakeURL = [
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake1.png',
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake2.png',
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake3.png',
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake4.png',
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake5.png',
        'C:/Users/Administrator/Desktop/animation_demo/qixi/qixi_ver1.0/images/snowflake/snowflake6.png'
    ];
    function snowflake() {
        var $flakeContainer = $("#snowflake");
        function getImageName() {
            return snowflakeURL[[Math.floor(Math.random() * 6)]];
        }
        function createSnowBox() {
            var url = getImageName();
            return $('<div class="snowbox" />').css({
                'width':41,
                'height':41,
                'position':'absolute',
                'backgroundSize':'cover',
                'zIndex':'10000',
                'top':'-41px',
                'backgroundImage':'url(' + url + ')'
            }).addClass('snowRoll');
        }
        setInterval(function () {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1,
                endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            //创建一个雪花
            var $flake = createSnowBox();
            //设计起点位置
            $flake.css({
                left:startPositionLeft,
                opacity:randomStart
            });
            $flakeContainer.append($flake);
            //开始执行动画
            $flake.transition({
                top:endPositionTop,
                left:endPositionLeft,
                opacity:0.7
            },duration,'ease-out',function () {
                $(this).remove()
            });
        },200);
    }
    boyAction = {
        config:{
            visualWidth:visualWidth,
            visualHeight:visualHeight
        },
        openDoor:openDoor,
        shutDoor:shutDoor,
        lamp:lamp,
        girl:girl,
        logo:logo,
        BoyWalk:BoyWalk(),
        snowflake:snowflake
    };
    return boyAction;
})();
/**
 * 在Swipe函数里定义一个swipe对象，给该对象绑定一个scrollTo方法，并返回该对象。
 * 需要页面滚动时，只用调用该对象的方法，传入参数即可。
 */
function Swipe(contanier) {
    //获取包裹li容器对象
    var element = contanier.find(":first");
    //滑动对象
    var swipe = {};
    //获取li
    var slides = element.children("li");
    //获取外层容器的宽高
    var width = contanier.width();
    var heigth = contanier.height();
    //设置ul容器的宽高
    element.css({
        "width" : width * slides.length + "px",
        "height" : heigth + "px"
    });
    //设置li滑块容器的宽高
    $.each(slides,function (index) {
        var slide = slides.eq(index);
        slide.css({
            "width" : width + "px",
            "height" : heigth + "px"
        });
    });
    //监控完成与移动
    swipe.scrollTo = function(x, speed) {
        //执行动画移动
        element.css({
            "transform":"translate3d(-" + x + "px,0,0)",
            "transition":"all linear " + speed + "ms"
        });
        return this;
    };
    return swipe;
}



/**
 * 小孩走路
 *
 */
function BoyWalk() {
    var container = $(".ani_wrap");
    //页面可视区域
    var visualWid = container.width();
    var visualHei = container.height();
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
        return (direction == 'x' ? visualWid : visualHei) * proportion;
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
        //开始走路

    }
    return {
        //开始走路
        walkTo: function (time,proportionX,proportionY) {
            var disX = caculateDis('x',proportionX);
            var disY = caculateDis('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //停止走路
        stopWalk: function () {
            pauseWalk();
        }
    }
}

//================================================
//格式化字符串
//将数组里的slice方法赋值给slice变量，定义一个toArray函数，
//toArray函数的作用是，运用call方法，给a对象绑定一个slice方法；
//即转换成数组；
//slice(start,end);返回从start到end-1处的字符串;
var slice = Array.prototype.slice;

function toArray(a, i, j) {
    return slice.call(a, i || 0, j || a.length);
}
/**
 * 返回true,如果传递的值不是未定义。
 * @param {Mixed}
 * @return {Boolean}
 */
function isDefined(v) {
    return typeof v !== 'undefined';
}
/**
 * 拷贝对象，跳过已存在的
 * @param  {[type]} o [接受方对象]
 * @param  {[type]} c [源对象]
 * @return {[type]}   [description]
 */
//将c里面有的，o里面没有的属性添加到o对象中
function applyIf(o, c) {
    if (o) {
        for (var p in c) {
            //跳过已存在
            if (!isDefined(o[p])) {
                o[p] = c[p];
            }
        }
    }
    return o;
}
/**
 * @class String
 * 格式化字符串
 */
//将format属性赋值给String对象，即String对象有了自定义的format方法；
// /\{(\d+)\}/g/，用来匹配1个或多个数字；
//replace(a,b)用b来替换a
applyIf(String, {
    format: function(format) {
        var args = toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return args[i];
        });
    }
});
/**
 * 3d旋转木马
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
*/
function Carousel(carousel, options) {
    //图片
    var imgUrls = options.imgUrls;
    //场景元素
    var $carousel = carousel;
    //容器元素
    var $spinner = carousel.find("#spinner");
    var angle = 0;
    //图片数
    var numpics = imgUrls.length;
    //角度
    var rotate = 360 / numpics;
    var start = 0;
    var current = 1;
    //子元素
    var $contentElements;

    //图片数量
    this.numpics = numpics;

    /**
     * 创建结构
     * @param  {[type]} imgUrl [description]
     * @return {[type]}        [description]
*/

    function createStr(imgUrl) {
        var str = '<figure style="transform:rotateY({0}deg) translateZ({1}) scaleY(.9);position:absolute;">'
            + '<img src="{2}" style="width:100%;height:100%;">'
            + '</figure>';

        return String.format(str,
            start,
            "2.5rem",
            imgUrl
        )
    }

    /**
     * 初始化样式
     * @return {[type]} [description]
*/
    function initStyle() {
        //场景元素
        $carousel.css({
            "transform": "scale(0.3)",
            "-webkit-perspective": "500",
            "-moz-perspective": "500px",
            "position": "absolute",
            "left": "6.8rem",
            "top": "4.5rem"
        });
        //容器
        $spinner.css({
            "width": "4rem",
            "transform-style": "preserve-3d"
        })
    }

    /**
     * 绘制页面节点
     * @return {[type]} [description]
*/
    function render() {
        //创建内容
        var contentStr = '';
        $.each(imgUrls, function(index, url) {
            contentStr += createStr(url);
            start = start + rotate;
        })
        $contentElements = $(contentStr);
        $spinner.append($contentElements)
    }

    //样式
    initStyle();
    //绘制节点
    render();


    //旋转次数,游标,当前页码
    var currIndex;

    /**
     * 运行旋转
     * @param  {[type]}   count    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
*/
    this.run = function(count, callback) {
        currIndex = count;
        //360
        //480
        //600
        angle = (count - 1) * rotate + 360;
        $spinner
            .css({
                "transform": "rotateY(-" + angle + "deg)",
                "transition":"1s"
            })
            .css({
                "-moz-transform": "rotateY(-" + angle + "deg)",
                "-moz-transition":"1s"
            })
            .one("transitionend webkitTransitionend", function() {
                //去掉transition保留在样式上
                //照成的缩放元素会有动画变化
                $spinner.css("transition","");
                $spinner.css("-moz-transition","");
                callback && callback();
            });
    };
    this.selected = function (e) {
        var t = $contentElements.find("img"),
            n = t.length;
        t.transition({
            scale:1.5
        },2000,"linear",function () {
            return 1 === n ? void e() : void n--
        })
    };
    this.destroy = function () {
        $spinner.remove()
    };
    /**
     * 视频播放
     * @param  {[type]} index   [description]
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
*/
    this.playVideo = function(e) {
        //索引从0开始
        var index = currIndex - 1;

        var element = element || $contentElements.eq(index);

        /**
         * vide标签
         * @type {[type]}
*/
        var $video = $('<video preload="auto"  class="bounceIn" style="width:50%;height:50%;position:absolute;left:30%;top:35%;"></video>');

        $video.css({
            "position": "absolute",
            "z-index": "999"
        });

        //地址
        $video.attr('src', options.videoUrls[index]);

        //播放
        $video.on("loadeddata",function() {
            $video[0].play();
            setTimeout(function () {
                e.load()
            },1000)
        });

        //停止
        $video.on("ended", function() {
            $video[0].pause();
            //退出效果
            $video.addClass("bounceOut").one("animationend webkitAnimationEnd", function() {
                $video.remove();
                e.complete()
            })
        });
        $carousel.after($video)
    }
}
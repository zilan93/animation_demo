/**
 * Created by Administrator on 2016/11/11.
 */
function pageA(element) {
    this.$root = element;
    this.$boy = element.find(".boy");
    this.$window = element.find(".window");
    this.$leftWin = this.$window.find(".window_left");
    this.$rightWin = this.$window.find(".window_right");
    this.run();
}
/**
 * 开窗
 * @return {[type]} [description]
 */
pageA.prototype.openWindow = function (callback) {
    var count = 1;
    var complete = function () {
        ++count;
        if(count === 2) {
            callback && callback();
        }
    }
    var bind = function (data) {
        data.one("transitionend webkitTransitionEnd",function (event) {
            data.removeClass("window_animation");
            complete();
        })
    }
    bind(this.$leftWin.addClass("window_animation").addClass("hover"));
    bind(this.$rightWin.addClass("window_animation").addClass("hover"));
}

/**
 * 运行下一个动画
 * @return {Function} [description]
 */
pageA.prototype.next = function (options) {
    var dfd = $.Deferred();
    this.$boy.addClass("boy_run");
    this.$boy.transition(options.style,options.time,'linear',function () {
        dfd.resolve()
    });
    return dfd;
};
/**
 * 停止走路
 */
pageA.prototype.stopWalk = function () {
    this.$boy.removeClass("boy_run")
};
/**
 * 路径
 * @type {any}
 */
pageA.prototype.run = function (callback) {
    var that = this;
    var next = function () {
        return this.next.apply(this,arguments)
    }.bind(this);

    next({
        "time":1000,
        "style":{
            "top":"4rem",
            "right":"16rem",
            "scale":"1"
        }
    }).then(function () {
            return next({
                "time":500,
                "style":{
                    "rotateY":"-180",
                    "scale":"1.5"
                }
            })
        }).then(function () {
            return next({
                "time":700,
                "style":{
                    "top":"7.5rem",
                    "right":"1rem",
                    "scale":"1"
                }
            })
        }).then(function () {
            that.stopWalk();
            that.openWindow(callback);
        })
};


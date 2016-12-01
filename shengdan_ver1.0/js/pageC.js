/**
 * Created by Administrator on 2016/11/11.
 */
function pageC() {
    this.$window = $(".page-c .window");
    this.$leftWin = this.$window.find(".window_left");
    this.$rightWin = this.$window.find(".window_right");
    this.$sceneBg = this.$window.find(".window_scene_bg");
    this.$closeBg = this.$window.find(".window_close_bg");
    this.$sceneBg.transition({
        "opacity":0
    },"3000");
    this.$closeBg.transition({
        "opacity":1
    },"5000");
    this.closeWindow();
}
pageC.prototype.closeWindow = function (callback) {
    var count = 1;
    var complete = function () {
        if(count == 2) {
            alert(0);
            callback && callback();
        }
        count++;
    };
    var bind = function (data) {
        data.one("animationend webkitAnimationEnd",function (event) {
            complete();
        })
    };
    bind(this.$leftWin.addClass("close"));
    bind(this.$rightWin.addClass("close"));
};
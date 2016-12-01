/**
 * Created by Administrator on 2016/12/1.
 */
var snowFlake = function(snowObj) {
    var snowObj = $(snowObj);
    var snowContext = snowObj[0].getContext("2d");
    var container = $("body");
    snowObj.css({
        "width":container.width(),
        "height":container.height()
    });
    function singalSnow(pixelX,pixelY,r) {
        snowContext.clearRect(pixelX,pixelY,2*r,2*r);
        snowContext.fillStyle = "rgb(255,255,255)";
        snowContext.beginPath();
        snowContext.arc(pixelX,pixelY,r,0,2*Math.PI);
        snowContext.closePath();
        snowContext.fill();
    }
    function moreSnow() {
        setInterval(function () {
            var pixelX = Math.floor(Math.random() * snowObj.width());
            var pixelY = Math.floor(Math.random() * snowObj.height());
            var r = Math.floor(Math.random() * 10);
            singalSnow(pixelX,pixelY,r);
        },10);
    }
    function snowSports() {
        var endX = Math.floor(Math.random() * snowObj.width());
        var endY = 50;

    }
};
snowFlake("#snowflake");
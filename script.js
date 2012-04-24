var animation = function () {

    var canvas = document.getElementById('myCanvas');
    var c = canvas.getContext('2d');
    canvas.addEventListener('mousemove', function(e) {
        config.x = e.clientX;
        config.y = e.clientY;
    });

    var config = {
        x:      200,
        y:      200,
        initW:  20,
        initH:  20,
        ftl:    100 //frames to live
    };


    var sparkles = [];


    var frame = function () {
        c.clearRect(0,0,600,600);
        c.shadowBlur = 50;
        c.shadowColor = 'black';
        c.fillStyle = 'rgba(0,0,0,0.75)';

        for (var i = 0; i < sparkles.length ; i++ ) {
            var s = sparkles[i];

            var r = 200 + s.ftl;
            var g = 0 + s.ftl * 1;
            var b = 0;

            c.fillStyle = 'rgba('+r+','+g+','+b+',0.75)';

            c.fillRect(s.x, s.y, s.w, s.h);
            s.x += s.xSpeed;
            s.y += s.ySpeed;
            s.h *= 0.96;
            s.w *= 0.96;
            s.ftl -= 1;
            if ( s.ftl == 0 ) {
                sparkles.splice(i, 1);
            } else { 
                sparkles[i] = s;
            }
        }
    }

    function addSparkle() {
        var sparkle = {
            x       : config.x,
            y       : config.y,
            h       : config.initH,
            w       : config.initW,
            xSpeed  : parseInt(Math.random()*20)-10,
            ySpeed  : parseInt(Math.random()*20)-10,
            ftl     : config.ftl
        };
        sparkles.push(sparkle);
    }

    setInterval(frame, 30);
    setInterval(addSparkle, 30);
};
window.addEventListener("load", function(){
    animation();
});

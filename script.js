var animation = function () {

    var canvas  = document.getElementById('myCanvas');
    var width   = canvas.getAttribute('width');
    var height  = canvas.getAttribute('height');
    var c       = canvas.getContext('2d');

    var config = {
        x:      200,
        y:      200,
        initW:  10,
        initH:  10,
        decay:  5,
        ftl:    100, //frames to live
        rebound:true,
        gravity: 2
    };

    canvas.addEventListener('mousemove', function(e) {
        config.x = e.clientX - config.initW;
        config.y = e.clientY - config.initH;
    });


    var sparkles = [];


    var frame = function () {
        c.clearRect(0,0,600,600);
        c.shadowBlur = 5;
        c.fillStyle = 'rgba(0,0,0,0.75)';

        for (var i = 0; i < sparkles.length ; i++ ) {
            var s = sparkles[i];

            var r = 200;
            var g = 0;
            var b = 0;
            var a = (-s.decay+1) + s.decay*(s.ftl / 100);

            c.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
            c.shadowColor = 'rgba('+r+','+g+','+b+','+a+')';

            c.beginPath();
            c.arc(s.x, s.y, s.h, 0, Math.PI*2, true); 
            c.closePath();
            c.fill();

            s.x += s.xSpeed;
            s.y += s.ySpeed;
            s.h *= 0.96;
            s.w *= 0.96;
            s.ySpeed += config.gravity;
            s.ftl -= 1;

            if ( config.rebound ) {
                if ( s.x > width  || s.x < 0 ) {
                    s.xSpeed *= -1;
                }
                if ( s.y > height  || s.y < 0 ) {
                    s.ySpeed *= -1;
                }
            }

            //garbage collect
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
    addSparkle();
};
window.addEventListener("load", function(){
    animation();
});

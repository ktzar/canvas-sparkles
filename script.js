//Animation Class
var Animation = function () {

    //set the canvas and load the width and height
    var canvas  = document.getElementById('myCanvas');
    var width   = canvas.getAttribute('width');
    var height  = canvas.getAttribute('height');
    var c       = canvas.getContext('2d');

    //generator settings
    var config = {
        x:          200,
        y:          200,
        initW:      10,
        initH:      10,
        decay:      5,
        initSpeed:  20, //max initial speed
        ftl:        100, //frames to live
        bounce:     true, //bounce in the walls
        wallAbsorb: 0.75, //speed lost in every bounce
        gravity:    1, // y axis gravity
        shrinkRate: 0.96, //size decrease rate
        genRate:    30 //Generation rate
    };

    this.setConfig = function (new_config) {
        for ( item in new_config ) {
            if ( typeof config[item] != "undefined" ) {
                config[item] = new_config[item];
            }
        }
    };

    //Generate particles from the current cursor position
    canvas.addEventListener('mousemove', function(e) {
        config.x = e.clientX - config.initW;
        config.y = e.clientY - config.initH;
    });


    //Array with the particles
    var particles = [];

    //Function to execute every frame
    var frame = function () {
        c.clearRect(0,0,600,600);
        c.shadowBlur = 15;
        c.fillStyle = 'rgba(0,0,0,0.75)';

        for (var i = 0; i < particles.length ; i++ ) {
            var s = particles[i];

            var r = 255;
            var g = 0;
            var b = 0;
            var a = (-s.decay+1) + s.decay*(s.ftl / 100);

            c.fillStyle     = 'rgba('+r+','+g+','+b+','+a+')';
            c.shadowColor   = 'rgba('+r+','+g+','+b+','+a+')';

            c.beginPath();
            c.arc(s.x, s.y, s.h, 0, Math.PI*2, true); 
            c.closePath();
            c.fill();

            //Movement
            s.x += s.xSpeed;
            s.y += s.ySpeed;
            //Shrink
            s.h *= config.shrinkRate;
            s.w *= config.shrinkRate;
            //Gravity
            s.ySpeed += config.gravity;
            s.ftl -= 1;
            //Bounce
            if ( config.bounce ) {
                if ( s.x > width  || s.x < s.w ) {
                    s.xSpeed *= -config.wallAbsorb;
                }
                if ( s.y > height  || s.y < s.w ) {
                    s.ySpeed *= -config.wallAbsorb;
                }
            }
            //garbage collect
            if ( s.ftl == 0 ) {
                particles.splice(i, 1);
            } else { 
                particles[i] = s;
            }
        }
    }

    //Create a new Particle
    function addParticle() {
        var particle = {
            x       : config.x,
            y       : config.y,
            h       : config.initH,
            w       : config.initW,
            xSpeed  : (Math.random()*config.initSpeed)-config.initSpeed/2,
            ySpeed  : (Math.random()*config.initSpeed)-config.initSpeed/2,
            ftl     : config.ftl
        };
        particles.push(particle);
    }

    setInterval(frame, 30);
    setInterval(addParticle, 1);
};
var animInstance;
window.addEventListener("load", function(){
    animInstance = new Animation();
});

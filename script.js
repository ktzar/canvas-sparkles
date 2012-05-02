/**
 * Return a random number between a and b
 * 
 * @param a int
 * @param b int
 * @return int
 */
function randomBetween (a, b) {
    if ( a > b ) {
        var range = a - b;
        var min = b;
    } else {
        var range = b - a;
        var min = a;
    }
    return (Math.random()*range)+min;

}

//Animation Class
var Animation = function (new_config) {

    //set the canvas and load the width and height
    var canvas  = document.getElementById('myCanvas');
    var width   = canvas.getAttribute('width');
    var height  = canvas.getAttribute('height');
    var c       = canvas.getContext('2d');
    var _this   = this;

    //generator settings
    var config = {
        x:          200,
        y:          200,
        initW:      20,
        initH:      20,
        decay:      5,
        initSpeedY: [-20, 20],  //Max initial speed range in Y axis
        initSpeedX: [-20, 20],  //Max initial speed range in X axis
        bounceX:    true,       //Bounce in the side walls
        bounceY:    true,       //Bounce in the top/bottom walls
        wallAbsorb: 0.75,       //Speed lost in every bounce
        gravity:    1,          //Y axis gravity
        shrinkRate: 0.96,       //Size decrease rate
        genRate:    10,         //Generation rate
        genPerStep: 1,          //Particles generated per step
        steps:      -1          //-1 for ilimited
    };

    this.setConfig = function (new_config) {
        console.log(new_config);
        for ( item in new_config ) {
            if ( typeof config[item] != "undefined" ) {
                config[item] = new_config[item];
            }
        }
        console.log(config);
    };


    if ( typeof new_config != "undefined" ) {
        this.setConfig(new_config);
    }

    //Generate particles from the current cursor position
    canvas.addEventListener('mousemove', function(e) {
        console.log(' create ', config.initW, config.initH);
        config.x = e.clientX - config.initW;
        config.y = e.clientY - config.initH;
    });


    //Array with the particles
    var particles = [];

    //Function to execute every frame
    var frame = function () {
        c.clearRect(0,0,600,600);
        c.shadowBlur = 0;
        c.fillStyle = 'rgba(0,0,0,0.75)';

        for (var i = 0; i < particles.length ; i++ ) {
            var s = particles[i];

            var r = 255;
            var g = 0;
            var b = 0;
            var a = (-s.decay+1) + s.decay*(s.age / 100);

            c.fillStyle     = 'rgba('+r+','+g+','+b+','+a+')';
            c.shadowColor   = 'red';

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
            s.age ++;
            //Bounce
            if ( config.bounceX ) {
                if ( s.x + s.w > width  || s.x - s.w < 0 ) {
                    s.xSpeed *= -config.wallAbsorb;
                }
            }
            if ( config.bounceY ) {
                if ( s.y + s.h > height  || s.y - s.h < 0 ) {
                    s.ySpeed *= -config.wallAbsorb;
                }
            }
            //garbage collect
            if ( s.h < 1 || s.w < 1 ) {
                particles.splice(i, 1);
            } else { 
                particles[i] = s;
            }
        }
    }

    //Create a new Particle
    function addParticle() {
        for ( i = 0 ; i < config.genPerStep ; i ++ ) {
            var particle = {
                x       : config.x,
                y       : config.y,
                h       : config.initH,
                w       : config.initW,
                xSpeed  : randomBetween(config.initSpeedX[0],config.initSpeedX[1]),
                ySpeed  : randomBetween(config.initSpeedY[0],config.initSpeedY[1]),
                age     : 0
            };
            particles.push(particle);
        }
        config.steps --;
        if ( config.steps == 0 ) {
            clearInterval(_this.interval);
        }
    }

    setInterval(frame, 30);
    _this.interval = setInterval(addParticle, config.genRate);
};

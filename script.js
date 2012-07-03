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

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame    || 
    window.webkitRequestAnimationFrame      || 
    window.mozRequestAnimationFrame         || 
    window.oRequestAnimationFrame           || 
    window.msRequestAnimationFrame          || 
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

//Animation Class
var ParticleSystem = function (new_config) {

    //set the canvas and load the width and height
    var canvas  = document.getElementById('myCanvas');
    var width   = canvas.getAttribute('width');
    var height  = canvas.getAttribute('height');
    var c       = canvas.getContext('2d');
    var _this   = this;

    //generator settings
    this.config = {
        x:          200,
        y:          200,
        initSize:   20,
        decay:      5,
        initSpeedRand: 10,
        initSpeedY: 0,  //Max initial speed range in Y axis
        initSpeedX: 0,  //Max initial speed range in X axis
        bounceX:    true,       //Bounce in the side walls
        bounceY:    true,       //Bounce in the top/bottom walls
        wallAbsorb: 1,       //Speed lost in every bounce
        gravity:    1,          //Y axis gravity
        shrinkRate: 0.96,       //Size decrease rate
        genRate:    10,         //Generation rate
        genPerStep: 1,          //Particles generated per step
        steps:      -1          //-1 for ilimited
    };

    this.setConfig = function (new_config) {
        console.log(new_config);
        for ( item in new_config ) {
            if ( typeof _this.config[item] != "undefined" ) {
                _this.config[item] = new_config[item];
            }
        }
        console.log(_this.config);
    };


    if ( typeof new_config != "undefined" ) {
        this.setConfig(new_config);
    }

    //Generate particles from the current cursor position
    canvas.addEventListener('mousemove', function(e) {
        _this.config.x = e.offsetX - _this.config.initSize;
        _this.config.y = e.offsetY - _this.config.initSize;
    });


    //Array with the particles
    var particles = [];

    //Function to execute every frame
    var frame = function () {
        window.requestAnimFrame(frame);
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
            c.arc(s.x, s.y, s.s, 0, Math.PI*2, true); 
            c.closePath();
            c.fill();

            //Movement
            s.x += s.xSpeed;
            s.y += s.ySpeed;
            //Shrink
            s.s *= _this.config.shrinkRate;
            //Gravity
            s.ySpeed += _this.config.gravity;
            s.age ++;
            //Bounce
            if ( _this.config.bounceX ) {
                if ( s.x > width  || s.x - s.s < 0 ) {
                    s.xSpeed *= -_this.config.wallAbsorb;
                }
            }
            if ( _this.config.bounceY ) {
                if ( s.y > height  || s.y - s.s < 0 ) {
                    s.ySpeed *= -_this.config.wallAbsorb;
                }
            }
            //garbage collect
            if ( s.s < 1 ) {
                particles.splice(i, 1);
            }
        }
    }

    //Create a new Particle
    function addParticle() {
        for ( i = 0 ; i < _this.config.genPerStep ; i ++ ) {
            var particle = {
                x       : _this.config.x,
                y       : _this.config.y,
                s       : _this.config.initSize,
                xSpeed  : randomBetween(_this.config.initSpeedX-_this.config.initSpeedRand,_this.config.initSpeedX+_this.config.initSpeedRand),
                ySpeed  : randomBetween(_this.config.initSpeedY-_this.config.initSpeedRand,_this.config.initSpeedY+_this.config.initSpeedRand),
                age     : 0
            };
            particles.push(particle);
        }
        _this.config.steps --;
        _this.timeout = setTimeout(addParticle, _this.config.genRate);
    }


    window.requestAnimFrame(frame);
    _this.timeout = setTimeout(addParticle, _this.config.genRate);
};

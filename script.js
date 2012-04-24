var animation = function () {

    var canvas = document.getElementById('myCanvas');
    var c = canvas.getContext('2d');

    console.log(c);

    var sparkles = [];


    var frame = function () {
        c.clearRect(0,0,600,600);

        for (var i = 0; i < sparkles.length ; i++ ) {
            c.fillRect(sparkles[i].x, sparkles[i].y, 20, 20);
            sparkles[i].x += sparkles[i].xSpeed;
            sparkles[i].y += sparkles[i].ySpeed;
            
        }
    }

    function addSparkle() {
        var sparkle = {
            x       : 200,
            y       : 200,
            h       : 40,
            w       : 40,
            xSpeed  : parseInt(Math.random()*20)-10,
            ySpeed  : parseInt(Math.random()*20)-10
        };
        sparkles.push(sparkle);
    }

    setInterval(frame, 30);
    setInterval(addSparkle, 30);
};
window.addEventListener("load", function(){
    animation();
});

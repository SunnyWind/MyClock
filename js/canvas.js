var clockHour = -1;
var clockMinute = -1;
var clockSecond = -1;
var CLOCK_MODE_NORMAL = 0;
var CLOCK_MODE_WATERFALL = 1;
var clockMode = CLOCK_MODE_NORMAL;
var waterfallHeight = 0;
var lovePicture;
//var startDate = new Date();
//startDate.setFullYear(2012);
//startDate.setMonth(8);
//startDate.setDate(23);

function Particle( x, y, radius ) {
	this.init( x, y, radius );
}

Particle.prototype = {

	init: function( x, y, radius ) {

		this.alive = true;

		this.radius = radius || 10;
		this.color = '#fff';

		this.x = x || 0.0;
		this.y = y || 0.0;

        // Velocity
		this.vx = 0.0;
		this.vy = 0.0;
        
        // Accelerate
        this.ax = 0.0;
        this.ay = 0.98
        
        this.bounceable = false;
        this.bounce = false;
	},

	move: function() {

		this.x += (this.vx + this.ax);
		this.y += (this.vy + this.ay);

		this.vx += this.ax;
		

        if ( this.y <= window.innerHeight ) {
            this.vy += this.ay;
        } else if( this.bounce ) {
            this.alive = false;
        } else if (this.bounceable) {
            this.vy = (-this.vy) * random(0.3, 0.8);
            
            this.bounce = true;
        } else {
            this.alive = false;
        }
//		this.alive = this.y <= window.innerHeight;
	},

	draw: function( ctx ) {

		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
		ctx.fillStyle = this.color;
		ctx.fill();
	}
};

var MAX_PARTICLES = 280;
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

var particles = [];
var pool = [];

var clock = Sketch.create();


// clock.mousemove = function() {
//    var particle, theta, force, touch, max, i, j, n;
//
//    for ( i = 0, n = clock.touches.length; i < n; i++ ) {
//
//        touch = clock.touches[i], max = random( 1, 4 );
//        for ( j = 0; j < max; j++ ) clock.spawn( touch.x, touch.y );
//    }
//};


clock.update = function() {
    clock.innerWidth = window.innerWidth;
    clock.innerHeight = window.innerHeight;
    
    var i, particle;

    for ( i = particles.length - 1; i >= 0; i-- ) {

        particle = particles[i];

        if ( particle.alive ) particle.move();
        else pool.push( particles.splice( i, 1 )[0] );
    }
    
    if (clockMode == CLOCK_MODE_NORMAL) {
        spark();
        
        if ( clockSecond == 0 ) {
            clockMode = CLOCK_MODE_WATERFALL;
        }
    }else if (clockMode == CLOCK_MODE_WATERFALL) {
        if (waterfallHeight == 0) {
            // Initialize love picture
            if (!lovePicture) {
                lovePicture = new Image();
            }
            
            lovePicture.src = "img/pic0"+ parseInt(random(1, 6))+".png";
        }
        
        if ( waterfallHeight < window.innerHeight ) {
            waterfall(waterfallHeight);
            waterfallHeight += 0.53; // Addition result can't be integer
        } else if (waterfallHeight > window.innerHeight) {
            waterfallHeight = window.innerHeight;
            setTimeout(function(){
                clockMode = CLOCK_MODE_NORMAL;
                waterfallHeight = 0;
                smash();
            }, 10000);
        }
            
    }
}

clock.draw = function() {
    clock.globalCompositeOperation  = 'lighter';

    displayTime(clock);
    
    // Draw balls
    for ( var i = particles.length - 1; i >= 0; i-- ) {
        particles[i].draw( clock );
    }

    if ( clockMode == CLOCK_MODE_WATERFALL ) {
        // Draw waterfall image
        var imgWidth;
        var imgHeight;
        var cutWidth;
        var cutHeight;
        if ( window.innerHeight/ window.innerWidth > lovePicture.naturalHeight / lovePicture.naturalWidth ) {
            imgHeight = window.innerHeight;
            imgWidth = imgHeight * lovePicture.naturalWidth / lovePicture.naturalHeight;
        } else {
            imgWidth = window.innerWidth;
            imgHeight = imgWidth * lovePicture.naturalHeight / lovePicture.naturalWidth;
        }
        
        cutWidth = window.innerWidth * lovePicture.naturalWidth / imgWidth;
        cutHeight = waterfallHeight * lovePicture.naturalHeight / imgHeight;
        
        clock.drawImage(lovePicture, 0, 0, cutWidth, cutHeight, 0, 0, window.innerWidth, waterfallHeight  );
    }
}

 
clock.spawn = function( x, y ) {

	if ( particles.length >= MAX_PARTICLES )
		pool.push( particles.shift() );

	particle = pool.length ? pool.pop() : new Particle();
	particle.init( x, y, random( 5, 40 ) );

    if ( clockMode == CLOCK_MODE_NORMAL ) {
        particle.vx = random( -10.0, 10.0 );
        particle.vy = random( -10.0, 0.0 );
        particle.bounceable = true;
    }
	
	particle.color = random( COLOURS );

	particles.push( particle );
};


function displayTime(ctx) {
    var curDate = new Date();
    clockHour = curDate.getHours();
    clockMinute = curDate.getMinutes();
    clockSecond = curDate.getSeconds();
    
    var positionX = window.innerWidth/2 - 250;
    var positionY = window.innerHeight/2 - 50;
    
    ctx.font = "100px Verdana";
    ctx.fillStyle = "rgb(73, 57, 61)";
    ctx.fillText((clockHour>9?clockHour:"0"+clockHour)+":"+
                 (clockMinute>9?clockMinute:"0"+clockMinute)+":"+
                 (clockSecond>9?clockSecond:"0"+clockSecond), positionX, positionY);
    
    
        //Date
    var tgthDays = (Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()) - 
                    Date.UTC(2012,8,23))/(1000*60*60*24);
    ctx.font = "40px Verdana";
    ctx.fillStyle = "rgb(73, 57, 61)";
    ctx.fillText("我们相爱的第" + tgthDays + "天", 20, 100);
    
}


//function drawLovePicture(ctx) {
//    ctx.drawImage(lovePicture, 0, 0, window.innerWidth, )
//}

function spark() {
    var curDate = new Date();
    var hour = curDate.getHours();
    var minute = curDate.getMinutes();
    var second = curDate.getSeconds();
    
    var positionX = window.innerWidth/2 - 250;
    var positionY = window.innerHeight/2 - 50;
    
    var diffs = [];
    if( hour != clockHour ) {
        diffs.push(1);
        if ( hour%10 == 0 ) {
            diffs.push(0);
        }
    }
    
    if( minute != clockMinute ) {
        diffs.push(3);
        if ( minute%10 == 0 ) {
            diffs.push(2);
        }
    }
    
    if( second != clockSecond ) {
        diffs.push(5);
        if ( second%10 == 0 ) {
            diffs.push(4);
        }
    }
    
    for (var i = 0 ; i < diffs.length ; i++) {
        
        var spawnPositionX = positionX + diffs[i]*85;
        
        if (i>1)
            spawnPositionX += 80;
        
        if (i>3)
            spawnPositionX += 80;
        
        var ballNum = random(5, 15);
        
        for (j=0; j < ballNum ; j++) {
            clock.spawn( spawnPositionX+random(10,40), positionY+random(-80,0) );
        }
    }
}

function smash() {
    var smashBallNum = (window.innerHeight / 50) * (window.innerWidth / 50) ;
    for (j=0; j < smashBallNum ; j++) {
        clock.spawn( random(0,window.innerWidth), random(0, window.innerHeight) );
    }
}

function waterfall(height) {
    var fallBallNum = window.innerWidth/500;
    
    for (j=0; j < fallBallNum ; j++) {
        clock.spawn( random(0,window.innerWidth), height );
    }
}



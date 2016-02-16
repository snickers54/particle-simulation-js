/* Author: Julien Singler
Description: Particle class */
function Particle(x, y) {
    // kind of private attributes
    this.gravity = 0.0981;
    // it ensures we are going to lose speed when bouncing..
    this.bounce_coeff = 0.8;
    this.data = {};
    this.bounce = {bottom:true, ticks:0, static:false};

    // define speed vector
    // don't forget Math.random is givin a number between 0 an 1,
    var rho = Math.random() * 10;
    var angle = Math.random() * Math.PI * 2;
    this.coordinates = {x: x, y: y};
    this.vector = {x: Math.cos(angle) * rho, y: Math.sin(angle) * rho};
}

Particle.prototype.update = function() {
    this.max_width = window.innerWidth;
    this.max_height = window.innerHeight;

    this.coordinates.x += this.vector.x;
    this.coordinates.y += this.vector.y;

    // bouncing effects and vector calculus from https://www.compuscene.org/?p=156
    // there is however not 50 ways to write this code..
    if (this.coordinates.x < 0) {
        this.vector.x *= -this.bounce_coeff;
        this.vector.y *= this.bounce_coeff;
        this.coordinates.x = 0;
    }
    if (this.coordinates.x >= this.max_width) {
        this.vector.x *= -this.bounce_coeff;
        this.vector.y *= this.bounce_coeff;
        this.coordinates.x = this.max_width;
    }
    if (this.coordinates.y <= 0) {
        this.vector.y *= - this.bounce_coeff;
        this.vector.x *= this.bounce_coeff;
        this.coordinates.y = 0;
    }
    // I changed the way it calculate how a particle should stop living,
    // I just count how many bounce there is since the last side touched..
    this.bounce.bottom = false;
    if (this.coordinates.y > this.max_height) {
        this.bounce.bottom = true;
        // if I bounce before 20 cycles / ticks It means I'm close to the side and not going enough far, so I'm a dying particle..
        if (this.bounce.ticks < 20) {
            this.bounce.static = true;
        }
        this.bounce.ticks = 0;
        this.vector.y *= - this.bounce_coeff;
        this.vector.x *= this.bounce_coeff;
        this.coordinates.y = this.max_height;
    } else {
        this.bounce.ticks += 1;
    }
    this.vector.y += this.gravity;
    // console.log(this.vector);
};

Particle.prototype.get_vector = function() {
    return this.vector;
};

Particle.prototype.get_coordinates = function() {
    return this.coordinates;
};

Particle.prototype.is_static = function() {
    return this.bounce.static;
};

// php style magic methods :) just thought it will be fun ..
// I did this, because I wanted to store some kind of data in each particle, depending on which renderer I'm using.
// for example, when using HTML renderer, I'm storing the dom element ..
Particle.prototype.__get = function(key) {
    if (this.data.hasOwnProperty(key)) {
        return this.data[key];
    }
    return null;
};
Particle.prototype.__set = function(key, value) {
    this.data[key] = value;
};

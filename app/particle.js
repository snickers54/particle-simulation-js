function Particle(x, y) {
    // kind of private attributes
    this.gravity = 0.0981;
    this.bounce_coeff = 0.8;
    this.data = {};
    this.bounce = {bottom:true, ticks:0, static:false};

    // define speed vector
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

    if (this.coordinates.x < 0) {
        this.vector.x *= -this.bounce_coeff;
        this.vector.y *= this.bounce_coeff;
        this.coordinates.x = 0;
    }
    if (this.coordinates.x >= this.max_width) {
        this.vector.x *= -this.bounce_coeff;
        this.vector.y *= this.bounce_coeff;
        this.coordinates.x = this.max_width - 1;
    }
    if (this.coordinates.y <= 0) {
        this.vector.y *= - this.bounce_coeff;
        this.vector.x *= this.bounce_coeff;
        this.coordinates.y = 0;
    }
    this.bounce.bottom = false;
    if (this.coordinates.y > this.max_height) {
        this.bounce.bottom = true;
        if (this.bounce.ticks < 20) {
            this.bounce.static = true;
        }
        this.bounce.ticks = 0;
        this.vector.y *= - this.bounce_coeff;
        this.vector.x *= this.bounce_coeff;
        this.coordinates.y = this.max_height - 1;
    } else {
        this.bounce.ticks += 1;
    }
    // Met à jour la vitesse avec l'accélération (gravité)
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

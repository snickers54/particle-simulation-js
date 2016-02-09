/* Author: Julien Singler
Description: Particle class */
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
/* Author: Julien Singler
Description: Settings class */
function Settings() {

}

Settings.prototype.display_number_particles = function(length){
    var dom = document.getElementById("number_particles");
    dom.innerHTML = length + " particles";
};

Settings.prototype.pause = function() {
    var dom = document.getElementById("pause_resume");
    dom.innerHTML = "Resume";
    dom.setAttribute("onclick", "core.resume(event)")
};

Settings.prototype.resume = function() {
    var dom = document.getElementById("pause_resume");
    dom.innerHTML = "Pause";
    dom.setAttribute("onclick", "core.pause(event)")
};

Settings.prototype.display_renderer_name = function(type){
    var dom = document.getElementById("renderer_name");
    dom.innerHTML = type + " in use !";
};
/* Author: Julien Singler
Description: HTML class */
function HTML(arguments){
    var css = "\n\t.particle{display:block;z-index:50;position:absolute;width:10px;height:10px;border-radius:10px;background-color:black;}\n";
    this.addStyleTag(css);
    this.garbage_collector = [];
    this.colors = arguments.colors;
}

HTML.prototype.generate_dom = function(particle){
    if (particle.__get("color") === null) {
        particle.__set("color", this.colors[Math.floor(Math.random() * this.colors.length)]);
    }
	var new_div = document.createElement("div");
    new_div.className = "particle";
	document.body.appendChild(new_div);
    new_div.style["background-color"] = particle.__get("color");
	return new_div;
};

HTML.prototype.addStyleTag = function(css) {
    var d = document;
    var tag = d.createElement('style');

    d.getElementsByTagName('head')[0].appendChild(tag);
    tag.setAttribute('type', 'text/css');
    if (tag.styleSheet) {
        tag.styleSheet.cssText = css;
    } else {
        tag.appendChild(document.createTextNode(css));
    }
};

HTML.prototype.clear = function(particles) {
    if (particles.length <= this.garbage_collector.length / 2) {
        for (var i = 0; i < (this.garbage_collector.length / 2) - 100; i++) {
            var dom = this.garbage_collector.pop();
            dom.parentNode.removeChild(dom);
        }
    }
};

HTML.prototype.reset = function() {
    var elem = document.getElementsByClassName('particle');

    for (var i = 0; i < elem.length; i++) {
        elem[i].style.display = "none";
    }
};

HTML.prototype.remove = function(particle) {
    // this is the parent ..
    if (particle.__get("dom") !== null) {
        var dom = particle.__get("dom");
        this.garbage_collector.push(dom);
        dom.style.display = "none";
    }
};

HTML.prototype.get_css_value = function(key, dom) {
    return window.getComputedStyle(dom).getPropertyValue(key);
}

HTML.prototype.draw = function(particle) {
    var dom = particle.__get("dom");
    if (dom === null) {
        var div;
        if (this.garbage_collector.length <= 0) {
            div = this.generate_dom(particle);
        } else {
            // fat optimization, reusing dom ..
            div = this.garbage_collector[0];
            this.garbage_collector.splice(0, 1);
        }
        particle.__set("dom", div);
        dom = div;
    }
    if (this.get_css_value("display", dom) === "none") {
        dom.style.display = "block";
    }
    var coordinates = particle.get_coordinates();
    dom.style.top = coordinates.y+"px";
    dom.style.left = coordinates.x+"px";
};
/* Author: Julien Singler
Description: Canvas class */
function Canvas(arguments){
    this.colors = arguments.colors;
    this.canvas = this.generate_dom();
    this.context = this.canvas.getContext("2d");

    var self = this;
    window.onresize = function(event){
        self.canvas.height = window.innerHeight;
        self.canvas.width = window.innerWidth;
        self.context = self.canvas.getContext("2d");
    };
}

Canvas.prototype.reset = function() {this.clear();};

Canvas.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.draw = function(particle){
    if (particle.__get("color") === null) {
        particle.__set("color", this.colors[Math.floor(Math.random() * this.colors.length)]);
    }
    this.context.beginPath();
    var coordinate = particle.get_coordinates();
    this.context.arc(coordinate.x, coordinate.y, 5, 0, 2 * Math.PI, false);
    this.context.fillStyle = particle.__get("color");
    this.context.fill();
};

Canvas.prototype.remove = function(particle) {};

Canvas.prototype.generate_dom = function(){
	var new_div = document.createElement("canvas");
    new_div.className = "canvas";
    new_div.height = window.innerHeight;
    new_div.width = window.innerWidth;
	document.body.appendChild(new_div);
	return new_div;
};
/* Author: Julien Singler
Description: Renderer kind of Interface  */

// It was used more than once, so I refactored this to a function..
function check_implementation(method, instance) {
    if (typeof instance[method] !== "function") {
        // this render instance doesn't support draw method ..
        console.error("Your class doesn't implement "+method+" method ..");
        return false;
    }
    return true;
}
function class_exists(myclass) {
    if (typeof window[myclass] === "undefined") {
        // this class doesn't exists in the global window object, we can't dynamically instantiate it ..
        console.error("The class "+ myclass + " doesn't exists ..");
        return false;
    }
    return true;
};
// this class will be a kind of interface, the goal here is to be able to change the way we render the particles ..
// so we could chose canvas, or html ..

function Renderer(arguments) {
    this.arguments = arguments;
    if (class_exists(arguments.type) === false) {return false;}
    this.type = arguments.type;
    this.instance = {};
    this.instance[arguments.type] = new window[arguments.type](arguments);
    return true;
}

Renderer.prototype.reset = function(){
    if (check_implementation("reset", this.instance[this.type]) === false) return false;
    this.instance[this.type].reset();
};

Renderer.prototype.change = function(type) {
    if (class_exists(type) === false) {return false;}

    if (!this.instance.hasOwnProperty(type)) {
        this.instance[type] = new window[type](this.arguments);
    }
    this.type = type;
    return true;
};

Renderer.prototype.clear = function(particles) {
    if (check_implementation("clear", this.instance[this.type]) === false) return false;
    this.instance[this.type].clear(particles);
};

Renderer.prototype.draw = function(particles) {
    if (check_implementation("draw", this.instance[this.type]) === false) return false;
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        this.instance[this.type].draw(particle);
    }
    return true;
};

Renderer.prototype.remove = function(particle) {
    if (check_implementation("remove", this.instance[this.type]) === false) return false;
    this.instance[this.type].remove(particle);
    return true;
};
/* Author: Julien Singler
Description: Core Class */

function Core(arguments) {
    // easier to return ..
    this.stopped = null;
    this.opts = {
        particles_per_click: 1,
        refresh_time: 20,
        experimental: true
    };
    this.controls = {
        particles: [],
        initialized: false,
        interval_id: null,
        paused: false
    };
    // instantiation of our class dependencies
    this.settings = new Settings();
    this.renderer = new Renderer(arguments);
    this.settings.display_renderer_name(arguments.type);

    // we define here, our main async loop using a setInterval :)
    this.init();
}

// I can't really make it private method, I need to create a kind of tricked implementation, don't want to lose time on this.
// I'm just going to do a kind of singleton..
Core.prototype.init = function() {
    // Golang style error handling..
    if (this.controls.initialized === true) {
        return;
    }
    this.controls.initialized = true;
    // here I'm using bind, to pass my self instance through setInterval, I'm considering `bind` is a standard technologies commonly supported by most current browsers.
    if (this.opts.experimental === true) {
        this.controls.interval_id = window.requestAnimationFrame(this.tick.bind(this));
    } else {
        this.controls.interval_id = setInterval(this.tick.bind(this), this.opts.refresh_time);
    }
}

Core.prototype.change_renderer = function(type){
    this.renderer.reset();
    if (this.renderer.change(type) === true) {
        this.settings.display_renderer_name(type);
    }
};

Core.prototype.add = function(x, y) {
    // first we create particles and we need to monitor them ..
    // we will let disappear particles when their speed is 0
    if (this.controls.interval_id === null) {return;}
    for (var i = 0; i < this.opts.particles_per_click; i++) {
        this.controls.particles.push(new Particle(x, y));
    }
};

Core.prototype.pause = function(event){
    if (this.opts.experimental === true) {
        window.cancelAnimationFrame(this.controls.interval_id);
        this.controls.paused = true;
    } else {
        clearInterval(this.controls.interval_id);
    }
    this.controls.interval_id = null;
    this.controls.initialized = false;
    this.settings.pause();
    return ;
};
Core.prototype.resume = function(event) {
    this.controls.paused = false;
    this.init();
    this.settings.resume();
};

Core.prototype.get_controls = function() {
    return this.controls;
};

Core.prototype.get_options = function() {
    return this.opts;
};

Core.prototype.change_number_particles = function(value){
    if (!isNaN(value)){
        this.opts.particles_per_click = parseInt(value);
    }
};
// our main loop
Core.prototype.tick = function(timestamp) {
    // .length is static, so no worries about performance..
    // for each particle we have to either check we calculate new positions or delete it ..
    // we loop backward to be able to remove an element with splice which reindex, without breaking our iteration..
    this.renderer.clear(this.controls.particles);
    for (var i = this.controls.particles.length; i > 0 ; i--) {
        var particle = this.controls.particles[i - 1];
        if (particle.is_static()) {
            this.renderer.remove(particle);
            this.controls.particles.splice(i - 1, 1);
            continue;
        }
        // if we get here, this particle is valid and we have to update it ..
        particle.update();
    }
    this.settings.display_number_particles(this.controls.particles.length);
    this.renderer.draw(this.controls.particles);
    if (this.opts.experimental === true && this.controls.paused === false) {
        this.opts.interval_id = window.requestAnimationFrame(this.tick.bind(this));
    }

};
/* Author: Julien Singler
Description: starting point */

var core;
window.onload = function(){
    core = new Core({type:"Canvas", colors:['black', 'blue', 'orange', 'brown', 'red', 'green', 'grey', 'whitesmoke', 'pink', 'darkblue', 'purple']});

    document.onclick = function(event) {
        // It seems, this code is to fix < IE9 even system ..
        if (event === undefined) event = window.event;
        var target = 'target' in event? event.target : event.srcElement;
        // this part is probably the most awful thing I've wrote so far ..
        if (target.getAttribute("id") !== "pause_resume"
            && target.getAttribute("name") !== "nb_particles" &&
            target.tagName.toLowerCase() !== "button") {
            core.add(event.pageX, event.pageY);
        }
    };

}

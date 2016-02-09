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

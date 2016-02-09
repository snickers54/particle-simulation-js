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

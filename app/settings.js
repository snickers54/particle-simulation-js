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

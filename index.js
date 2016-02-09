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

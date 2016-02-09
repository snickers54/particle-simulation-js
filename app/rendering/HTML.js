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

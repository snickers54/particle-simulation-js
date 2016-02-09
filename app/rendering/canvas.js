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

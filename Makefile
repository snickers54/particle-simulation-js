all:
	cat ./app/particle.js ./app/settings.js ./app/rendering/HTML.js ./app/rendering/canvas.js ./app/renderer.js ./app/core.js index.js > all.js
	uglifyjs all.js -nc > all.min.js

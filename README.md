# Particles and gravity simulation for Yieldify
---

## Introduction
I found many ways to do this assignment, the easiest would be in a canvas, and more difficult directly with HTML. The challenge to do it with HTML is performance. Because DOM modification is expensive in term of time. That's why react is using virtual DOM modifications.

As I don't really believe Yieldify is using canvas on their clients websites. I will try to go the extra mile and not working only with canvas..

I'm going to use JavaScript ES5, I could use ES6 with babel, but the generated code will be heavier just to get syntactic sugars ..
I'm taking care of performance because I believe it's important for the success of this project.

I'm also trying to limit at maximum external dependencies, like css files ..

Also, I chose to develop in snake_case because I had to chose something and be consistent.

## HOWTO
I created a docker to simplify build (concat and minify). But if you want to do it without docker, you just need to install `npm` then do `npm install -g uglify-js` and `make`.

The docker is just here to build, it will exit when finished..

## Implementation

I developed everything in Object Oriented Javascript, but javascript is not the best language to do so.

I think my implementation is pretty clean and I wanted to work with an interface but javascript forced me to implement it myself. That's why in renderer.js there is a function `check_implementation` to be sure if you want to develop your class of rendering you will need to implement some methods like `draw`, `remove`...

I added a control panel in HTML, and did an external class to interact with its DOM because I didn't want my Core class to do everything. That's why I created a `Settings` class.

I tried to optimize wherever I can. For example, in my `HTML` renderer, I created a kind of `garbage collector` for the element I create. That way, I can reuse already existing DOM. Because a particle is "dying" at a certain point, I just `display:none` the div, then it's push in my garbage_collector array and will be reused after, when the user click again.. On certain conditions, which should probably be revised, I delete divs particles.

I discovered `window.requestAnimationFrame` which is experimental but recommended when handling animation.. Seems better than our old friend `setInterval`. I added an option : `optimized` which activate requestAnimationFrame when set to true.

There is 2 renderer : HTML and Canvas, by default I start with canvas, but you can dynamically change the renderer by clicking on the appropriate buttons .. As you will notice, they keep their positions and everything is going well :)


## Improvements
There is obviously improvements to do and bugs to fix, here is a non-exhaustive list :

* [Bug] The scrollbar appears when one or more particles are touching the bottom or right side of the screen..
* [Improvement] Handle click and add particles until you release the mouse button.
* [Improvement] Well, managing to add collision between particles would be wonderful, but it seems complex and probably won't be fluid.
* [Improvement] We can clearly see a pattern with `Math.random`, it would be great to have a better random method..
* [Improvement] A friend of mine, advised me to use `transform:translate` instead of setting directly positions as `top / left` style attributes.. Which should give better perfs as transform:translate is sometimes calculated on GPU ?!

## Conclusion
I had a lot of fun coding this assessment. I hope you found my implementation interesting.

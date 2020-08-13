# CS184 Final Project: School of Fish
A flocking simulation created as my Final Project for CS184: Computer Graphics and Imaging. Created using Javascript.

## Setup
To run this project, install it locally and then setup a local server using the following statement. Open on localhost:8000 and navigate to sim.html.
```
$ python3 -m http.server
```

## Libraries
* [p5.js](https://p5js.org/)
* [math.js](https://mathjs.org/)

## Features
* Interactive GUI
  * change field of view (FOV) and depth of view
  * particle mode and fish mode - view the boids (bird-oid objects) as particles or fish
  * steering mode - see the direction vectors and the FOVs of the fish
  * change number of fish
  * click on the screen to add food
* Basic flocking behavior
* Fish food - fish will swim towards food and eat it
* Obstacle avoidance

## References
* [Flocks, Herds, and Schools: A Distributed Behavioral Model, Craig Reynolds](http://www.cs.toronto.edu/~dt/siggraph97-course/cwr87/)
* [AI for Game Developers by Glenn Seemann, David M Bourg: Chapter 4. Flocking](https://www.oreilly.com/library/view/ai-for-game/0596005555/ch04.html)
* [3 Simple Rules of Flocking Behaviors: Alignment, Cohesion, and Separation, Vijay Pemmaraju](https://gamedevelopment.tutsplus.com/tutorials/3-simple-rules-of-flocking-behaviors-alignment-cohesion-and-separation--gamedev-3444)
* [Understanding Steering Behaviors, Fernando Bevilacqua](https://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732)
* [Simulating Bird Flock Behavior in Python Using Boids, Rohola Zandie](https://medium.com/better-programming/boids-simulating-birds-flock-behavior-in-python-9fff99375118)

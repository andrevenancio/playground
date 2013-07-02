/**
 * Spritesheet Prototype for McDonalds Summer Foods minisite
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Spritesheet
 * @constructor
 */
var Spritesheets = function() {
  this.debug = new Razor.Debugger(false, false);

  this.folder = this.debug.gui.addFolder('Spritesheets');
  this.debug.gui.close();

  this.bindedRender = this.render.bind(this);

  // the div where we render the animation
  this.domElement = document.getElementById('example');

  // an instance of the Timeline class
  this.box = new Timeline(this.domElement, 'spritesheets/box.png', 16, 46, this.onUpdate);

  this.init();
};

/**
 * Initializes the experiment
 */
Spritesheets.prototype.init = function() {

  /* dat.GUI controlers */
  this.folder.add(this, 'startLooping');
  this.folder.add(this, 'stopLooping');
  this.folder.add(this.box, 'currentFrame').listen();
  this.folder.open();

  requestAnimationFrame(this.bindedRender);
};


/**
 * Render
 */
Spritesheets.prototype.render = function() {
  this.debug.begin();

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};


Spritesheets.prototype.startLooping = function() {
  this.box.start();
};

Spritesheets.prototype.stopLooping = function() {
  this.box.end(function() {
      alert('animation ' + this.box.id + " ended");
  });
};

Spritesheets.prototype.onUpdate = function(currentFrame) {
  console.log('update');
  this.domElement.className = 'sprite animation_frame_' + currentFrame
};

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

  this.folder = this.debug.gui.addFolder('Sprite');
  this.debug.gui.open();

  this.bindedRender = this.render.bind(this);

  // the div where we render the animation
  this.domElement = document.getElementById('example');

  // an instance of the Timeline class
  this.box = new Timeline(this.domElement, 'spritesheets/convertible.png', 11, 49, this.onUpdate);

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

  this.startLooping();
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
  var scope = this;
  this.box.end(function() {
      console.log('animation ' + scope.box.id + " ended");
  });
};

Spritesheets.prototype.onUpdate = function(currentFrame) {
  console.log('update');
  this.domElement.className = 'sprite convertible_frame_' + currentFrame
};

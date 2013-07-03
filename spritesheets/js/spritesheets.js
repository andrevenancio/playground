/**
 * Spritesheet Prototype for McDonalds Summer Foods minisite
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Spritesheet
 * @constructor
 */
var Spritesheets = function() {
  this.debug = new Razor.Debugger(true, false);

  this.folder = this.debug.gui.addFolder('Spritesheets');
  this.folderConvertible = this.folder.addFolder('Convertible');
  this.folderPark = this.folder.addFolder('Park');
  this.debug.gui.open();


  this.bindedRender = this.render.bind(this);
  this.bindedUpdateConvertible = this.onUpdateConvertible.bind(this);
  this.bindedUpdatePark = this.onUpdatePark.bind(this);

  // the div where we render the animation
  this.convertible = document.getElementById('convertible');
  this.park = document.getElementById('park');

  // an instance of the Timeline class
  this.timelineConvertible = new Timeline(this.convertible, 'spritesheets/convertible.png', 13, 49, this.bindedUpdateConvertible);
  this.timelinePark = new Timeline(this.park, 'spritesheets/park.png', 30, 81, this.bindedUpdatePark);

  this.init();
};

/**
 * Initializes the experiment
 */
Spritesheets.prototype.init = function() {

  /* dat.GUI controlers */
  this.folder.add(this, 'startLooping');
  this.folder.add(this, 'stopLooping');
  this.folder.open();
  this.folderConvertible.add(this.timelineConvertible, 'currentFrame').listen();
  this.folderConvertible.open();

  this.folderPark.add(this.timelinePark, 'currentFrame').listen();
  this.folderPark.open();

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
  this.timelineConvertible.start();
  this.timelinePark.start();
};

Spritesheets.prototype.stopLooping = function() {
  var scope = this;
  this.timelineConvertible.end(function() {
    console.log('animation', scope.timelineConvertible.id, "ended");
  });

  this.timelinePark.end(function() {
    console.log('animation', scope.timelinePark.id, "ended");
  });
};

Spritesheets.prototype.onUpdateConvertible = function(currentFrame) {
  this.convertible.className = 'convertible convertible_frame_' + currentFrame
};

Spritesheets.prototype.onUpdatePark = function(currentFrame) {
  this.park.className = 'park park_frame_' + currentFrame
};

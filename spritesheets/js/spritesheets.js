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
  this.folderCamping = this.folder.addFolder('Camping');
  this.folderCinema = this.folder.addFolder('Cinema');
  this.folderConvertible = this.folder.addFolder('Convertible');
  this.folderPark = this.folder.addFolder('Park');
  this.debug.gui.open();


  this.bindedRender = this.render.bind(this);
  this.bindedUpdateCamping = this.onUpdateCamping.bind(this);
  this.bindedUpdateCinema = this.onUpdateCinema.bind(this);
  this.bindedUpdateConvertible = this.onUpdateConvertible.bind(this);
  this.bindedUpdatePark = this.onUpdatePark.bind(this);

  // the div where we render the animation
  this.camping = document.getElementById('camping');
  this.cinema = document.getElementById('cinema');
  this.convertible = document.getElementById('convertible');
  this.park = document.getElementById('park');

  // an instance of the Timeline class
  this.timelineCamping = new Timeline(this.camping, 'spritesheets/camping.png', 13, 49, this.bindedUpdateCamping);
  this.timelineCinema = new Timeline(this.cinema, 'spritesheets/cinema.png', 13, 49, this.bindedUpdateCinema);
  this.timelineConvertible = new Timeline(this.convertible, 'spritesheets/convertible.png', 13, 49, this.bindedUpdateConvertible);
  this.timelinePark = new Timeline(this.park, 'spritesheets/park.png', 30, 81, this.bindedUpdatePark);

  this.currentFrame = 0;
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

  this.folderCamping.add(this.timelineCamping, 'currentFrame').listen();
  this.folderCamping.open();

  this.folderCinema.add(this.timelineCinema, 'currentFrame').listen();
  this.folderCinema.open();

  this.folderConvertible.add(this.timelineConvertible, 'currentFrame').listen();
  this.folderConvertible.open();

  this.folderPark.add(this.timelinePark, 'currentFrame').listen();
  this.folderPark.open();

  //this.startLooping();
  requestAnimationFrame(this.bindedRender);
};


/**
 * Render
 */
Spritesheets.prototype.render = function() {
  this.debug.begin();

  this.camping.className = 'camping camping_frame_' + this.currentFrame % 10;
  this.cinema.className = 'cinema cinema_frame_' + this.currentFrame % 10;
  this.convertible.className = 'convertible convertible_frame_' + this.currentFrame % 10;
  this.park.className = 'park park_frame_' + this.currentFrame % 10;

  this.currentFrame++;
  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};


Spritesheets.prototype.startLooping = function() {
  this.timelineCamping.start();
  this.timelineCinema.start();
  this.timelineConvertible.start();
  this.timelinePark.start();
};

Spritesheets.prototype.stopLooping = function() {
  var scope = this;

  this.timelineCamping.end(function() {
    console.log('animation', scope.timelineCamping.id, "ended");
  });

  this.timelineCinema.end(function() {
    console.log('animation', scope.timelineCinema.id, "ended");
  });

  this.timelineConvertible.end(function() {
    console.log('animation', scope.timelineConvertible.id, "ended");
  });

  this.timelinePark.end(function() {
    console.log('animation', scope.timelinePark.id, "ended");
  });
};

Spritesheets.prototype.onUpdateCamping = function(currentFrame) {
  this.camping.className = 'camping camping_frame_' + currentFrame
};

Spritesheets.prototype.onUpdateCinema = function(currentFrame) {
  this.cinema.className = 'cinema cinema_frame_' + currentFrame
};

Spritesheets.prototype.onUpdateConvertible = function(currentFrame) {
  this.convertible.className = 'convertible convertible_frame_' + currentFrame
};

Spritesheets.prototype.onUpdatePark = function(currentFrame) {
  this.park.className = 'park park_frame_' + currentFrame
};

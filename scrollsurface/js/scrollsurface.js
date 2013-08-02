/**
 * Scroll Surface Prototype
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * ScrollSurface
 * @constructor
 */
var ScrollSurface = function() {
  this.debug = new Razor.Debugger(true, false);
  this.grid = new ScrollSurface.Grid('canvas');

  this.folder = this.debug.gui.addFolder('Scroll Surface');
  this.debug.gui.open();

  this.isDown = false;
  this.mouseX = 0;
  this.mouseY = 0;

  this.offsetX = this.offsetY = 0;
  this.offsetX_ = this.offsetY_ = 0;

  /* values used to calculate distance */
  this.oldX = this.oldY = 0;
  this.newX = this.newY = 0;
  this.distanceX = this.distanceY = 0;

  this.bindedRender = this.render.bind(this);

  this.init();
};

ScrollSurface.prototype.init = function() {
  var scope = this;
  window.addEventListener('resize', function() { scope.resize(); }, false);
  window.addEventListener('mousedown', function(e) { scope.onDown(e); }, false);
  window.addEventListener('mousemove', function(e) { scope.onMove(e); }, false);
  window.addEventListener('mouseup', function(e) { scope.onUp(e); }, false);

  var colors = this.folder.addFolder('RGB');
  colors.open();
  colors.add(this.grid, 'R').listen();
  colors.add(this.grid, 'G').listen();
  colors.add(this.grid, 'B').listen();
  this.folder.add(this.grid, 'offsetX').listen();
  this.folder.add(this.grid, 'offsetY').listen();


  this.folder.open();

  this.feedGrid();
  requestAnimationFrame(this.bindedRender);
};

ScrollSurface.prototype.resize = function() {
  this.grid.resize();
};

ScrollSurface.prototype.feedGrid = function() {
  var data = [];
  for (var i = 0; i < 20; i++) {
    var obj = {};
      obj.id = 'id_' + i;
      data.push(obj);
  }
  this.grid.feed(data);
  this.grid.resize();
};

ScrollSurface.prototype.onDown = function(e) {
  this.isDown = true;

  this.mouseX = e.pageX;
  this.mouseY = e.pageY - 40;

  this.oldX = this.mouseX;
  this.oldY = this.mouseY;

  this.offsetX_ = this.offsetX;
  this.offsetY_ = this.offsetY;
};

ScrollSurface.prototype.onMove = function(e) {
  if (this.isDown) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY - 40;
  }
};

ScrollSurface.prototype.onUp = function(e) {
  if (this.isDown == true) {
    this.isDown = false;
    this.offsetX = this.offsetX_;
    this.offsetY = this.offsetY_;
  }
};

ScrollSurface.prototype.calculate = function() {
  this.newX = this.mouseX;
  this.newY = this.mouseY;
  this.distanceX = this.newX - this.oldX;
  this.distanceY = this.newY - this.oldY;

  if (this.isDown) {
    this.offsetX_ = this.offsetX - this.distanceX * -1;
    this.offsetY_ = this.offsetY - this.distanceY * -1;
  }
};

ScrollSurface.prototype.render = function() {
  this.debug.begin();

  this.calculate();
  this.grid.render(this.offsetX_, 0/*this.offsetY_*/);

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

/**
 * Dragging Prototype for Blackberry F1 Win Win Facebook App
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Drag
 * @constructor
 */
var Dragger = function() {
  this.debug = new Razor.Debugger(false, false);

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.width = 400;
  this.height = 400;

  this.folder = this.debug.gui.addFolder('Dragger');
  this.debug.gui.close();
  this.domDragger = document.getElementById('dragger');

  this.isDown = false;
  this.upperSpeed = 10;
  this.lowerSpeed = 2;
  this.left = '#333333';
  this.right = '#222222';

  this.mouse = new Float32Array(2);
  this.draggerPosition = new Float32Array(2);
  this.upperPosition = new Float32Array(2);
  this.lowerPosition = new Float32Array(2);

  this.bindedRender = this.render.bind(this);

  this.init();
};

/**
 * Initializes the experiment
 */
Dragger.prototype.init = function() {
  this.resize();

  this.draggerPosition[0] = this.mouse[0] = (this.width - 66) * 0.5;
  this.draggerPosition[1] = this.mouse[1] = (this.height - 66) * 0.5;

  var scope = this;
  window.addEventListener('resize', function() { scope.resize(); }, false);
  this.domDragger.addEventListener('mousedown', function(e) { scope.onDown(e); }, false);
  this.canvas.addEventListener('mousemove', function(e) { scope.onMove(e); }, false);
  window.addEventListener('mouseup', function(e) { scope.onUp(2); }, false);

  /* dat.GUI controlers */
  this.folder.addColor(scope, 'left');
  this.folder.addColor(scope, 'right');
  this.folder.add(scope, 'upperSpeed', 1, 10);
  this.folder.add(scope, 'lowerSpeed', 1, 10);
  this.folder.open();

  requestAnimationFrame(this.bindedRender);
};

/**
 * Handles mouse down
 * @param  {event} e mouse event.
 */
Dragger.prototype.onDown = function(e) {
  this.isDown = true;

  this.mouse[0] = e.pageX;
  this.mouse[1] = e.pageY;

};

/**
 * Handles mouse move
 * @param  {event} e mouse event.
 */
Dragger.prototype.onMove = function(e) {
  if (this.isDown) {
    this.mouse[0] = e.pageX;
    this.mouse[1] = e.pageY;
  }
};

/**
 * Handles mouse up
 * @param  {event} e mouse event.
 */
Dragger.prototype.onUp = function(e) {
  if (this.isDown == true) {
    this.isDown = false;
  }
};

/**
 * Handles window resize
 */
Dragger.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;
};


/**
 * Render
 */
Dragger.prototype.render = function() {
  this.debug.begin();

  this.context.clearRect(0, 0, this.width, this.height);

  var originalX = this.draggerPosition[0] + 33;

  this.upperPosition[0] += ((this.mouse[0] + 33) - this.upperPosition[0]) / this.upperSpeed;
  this.lowerPosition[0] += ((this.mouse[0] + 33) - this.lowerPosition[0]) / this.lowerSpeed;

  //left half
  this.context.beginPath();
  this.context.fillStyle = this.left;
  this.context.moveTo(0, 0);
  this.context.lineTo(this.upperPosition[0], 0);
  this.context.lineTo(this.lowerPosition[0], this.height);
  this.context.lineTo(0, this.height);
  this.context.closePath();
  this.context.fill();

  //right half
  this.context.beginPath();
  this.context.fillStyle = this.right;
  this.context.moveTo(this.upperPosition[0], 0);
  this.context.lineTo(this.width, 0);
  this.context.lineTo(this.width, this.height);
  this.context.lineTo(this.lowerPosition[0], this.height);
  this.context.closePath();
  this.context.fill();

  //line
  this.context.beginPath();
  this.context.lineWidth = 3;
  this.context.strokeStyle = '#e8e8e8';
  this.context.moveTo(this.upperPosition[0], 0);
  this.context.lineTo(this.lowerPosition[0], this.height);
  this.context.closePath();
  this.context.stroke();

  var x = 0;
  var d = 0;
  if (this.lowerPosition[0] > this.upperPosition[0]) {
    d = this.lowerPosition[0] - this.upperPosition[0];
    x = this.upperPosition[0] + d / 2;
  } else {
    d = this.upperPosition[0] - this.lowerPosition[0];
    x = this.lowerPosition[0] + d / 2;
  }

  var angle = Razor.Math.getAngleBetweenPointsDegrees(this.upperPosition[0], 0, this.lowerPosition[0], this.height) + 90;

  this.domDragger.style.top = this.draggerPosition[1] + 'px';
  this.domDragger.style.left = (x - 33) + 'px';
  this.domDragger.style['-moz-transform'] = 'rotate(' + angle + 'deg)';
  this.domDragger.style['-webkit-transform'] = 'rotate(' + angle + 'deg)';
  this.domDragger.style['-o-transform'] = 'rotate(' + angle + 'deg)';
  this.domDragger.style['-ms-transform'] = 'rotate(' + angle + 'deg)';
  this.domDragger.style['transform'] = 'rotate(' + angle + 'deg)';

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

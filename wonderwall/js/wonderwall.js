/**
 * Wonderwall example
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Wonderwall
 * @constructor
 */
var Wonderwall = function() {
  this.debug = new Razor.Debugger(false, false);

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.width = 800;
  this.height = 600;

  this.canvasBox;

  this.mouseX = 0;
  this.mouseY = 0;

  this.folder = this.debug.gui.addFolder('Wonderwall');

  this.rows = 6;
  this.columns = 6;
  this.sizeW = 100;
  this.sizeH = 100;
  this.reaction = 120;
  this.minValue = -20;
  this.maxValue = 20;

  this.points = [];

  this.bindedRender = this.render.bind(this);

  this.init();
};

/**
 * Initializes the experiment
 */
Wonderwall.prototype.init = function() {
  this.resize();

  var scope = this;
  window.addEventListener('resize', function() { scope.resize(); }, false);
  this.canvas.addEventListener('mousemove', function(e) { scope.onMove(e); }, false);

  /* dat.GUI controlers */
  this.folder.add(scope, 'rows', 2, 10).step(1).onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'columns', 2, 10).step(1).onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'reaction', -200, 200);
  this.folder.add(scope, 'sizeW').onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'sizeH').onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'minValue', -50, 50).onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'maxValue', -50, 50).onChange(this.rebuild.bind(this));
  this.folder.open();

  this.buildGrid();

  requestAnimationFrame(this.bindedRender);
};

/**
 * Handles mouse move
 * @param  {Event} e Mouse move event.
 */
Wonderwall.prototype.onMove = function(e) {
  this.mouseX = e.pageX;
  this.mouseY = e.pageY;
};

/**
 * Rebuilds the experiment, everytime a parameter is changed
 */
Wonderwall.prototype.rebuild = function() {
  this.points = [];

  this.resize();
  this.buildGrid();
};

/**
 * Handles window resize
 */
Wonderwall.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;

  this.canvasBox = Razor.getBoundingBox(this.canvas);
};

/**
 * Builds the tiles based on a grid
 */
Wonderwall.prototype.buildGrid = function() {

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      var point = new Wonderwall.Point(this.sizeW + (j * this.sizeW) + Razor.Math.getRandom(this.minValue, this.maxValue), this.sizeH + (i * this.sizeH) + Razor.Math.getRandom(this.minValue, this.maxValue));
      this.points.push(point);
    }
  }
};

/**
 * Updates a point based on proximity with mouse
 * @param  {Wonderwall.Point} point Point to update.
 */
Wonderwall.prototype.update = function(point) {
  var dx;
  var dy;
  var distance = Math.sqrt((point.ox - (this.mouseX - this.canvasBox.x)) * (point.ox - (this.mouseX - this.canvasBox.x)) + (point.oy - (this.mouseY - this.canvasBox.y)) * (point.oy - (this.mouseY - this.canvasBox.y)));

  if (distance < Math.abs(this.reaction)) {
    var diff = distance * (Math.abs(this.reaction) - distance) / Math.abs(this.reaction);
    diff *= this.reaction < 0 ? 1 : -1;

    var radian = Math.atan2((this.mouseY - this.canvasBox.y) - point.oy, (this.mouseX - this.canvasBox.x) - point.ox);
    var diffX = (diff * 2) * Math.cos(radian);
    var diffY = (diff * 2) * Math.sin(radian);

    dx = point.ox + diffX;
    dy = point.oy + diffY;
  } else {
    dx = point.ox;
    dy = point.oy;
  }

  point.x += (dx - point.x) / 3;
  point.y += (dy - point.y) / 3;
};

/**
 * Renders tiles
 */
Wonderwall.prototype.render = function() {
  this.debug.begin();

  this.context.clearRect(0, 0, this.width, this.height);

  for (var i = 0; i < this.points.length; i++) {
    this.update(this.points[i], i == 0 ? true : false);
  }

  var current = 0;
  var sum = 0;
  var total = (this.rows - 1) * (this.columns - 1);

  for (var a = 0; a < this.rows - 1; a++) {
    for (var b = 0; b < this.columns - 1; b++) {

      this.context.beginPath();
      this.context.moveTo(this.points[current + sum].x, this.points[current + sum].y);
      this.context.lineTo(this.points[current + sum + 1].x, this.points[current + sum + 1].y);
      this.context.lineTo(this.points[current + sum + 1 + this.columns].x, this.points[current + sum + 1 + this.columns].y);
      this.context.lineTo(this.points[current + sum + 0 + this.columns].x, this.points[current + sum + 0 + this.columns].y);
      this.context.closePath();

      var value = Math.floor(255 - (4 * current));
      this.context.fillStyle = 'rgb(' + value + ',' + 0 + ',' + value + ')';
      this.context.fill();

      if (b % this.columns == this.columns - 2) {
        ++sum;
      }
      ++current;
    }
  }

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

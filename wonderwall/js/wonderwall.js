/**
 * Wonderwall example
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Wonderwall
 * @constructor
 */
var Wonderwall = function() {
  this.debug = new Razor.Debugger();
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.width = 800;
  this.height = 600;

  this.canvasBox;

  this.isMouseDown = false;
  this.mouseX = 0;
  this.mouseY = 0;

  this.folder = this.debug.gui.addFolder('Wonderwall');

  this.columns = 5;
  this.rows = 7;
  this.sizeW = 96;
  this.sizeH = 96;
  this.reaction = 96;

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
  this.canvas.addEventListener('mousedown', function(e) { scope.onDown(e); }, false);
  this.canvas.addEventListener('mouseup', function(e) { scope.onUp(2); }, false);
  this.canvas.addEventListener('mousemove', function(e) { scope.onMove(e); }, false);

  /* dat.GUI controlers */
  var scope = this;
  this.folder.add(scope, 'columns', 1, 10).step(1).onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'rows', 1, 10).step(1).onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'reaction', -200, 200);
  this.folder.add(scope, 'sizeW').onChange(this.rebuild.bind(this));
  this.folder.add(scope, 'sizeH').onChange(this.rebuild.bind(this));
  this.folder.open();

  this.buildGrid();

  requestAnimationFrame(this.bindedRender);
};

Wonderwall.prototype.onDown = function(e) {
  this.isMouseDown = true;
  this.mouseX = e.pageX;
  this.mouseY = e.pageY;
};

Wonderwall.prototype.onUp = function(e) {
  this.isMouseDown = false;
  this.mouseX = e.pageX;
  this.mouseY = e.pageY;
};

Wonderwall.prototype.onMove = function(e) {
  this.mouseX = e.pageX;
  this.mouseY = e.pageY;
};

Wonderwall.prototype.rebuild = function() {
  this.points = [];

  this.resize();
  this.buildGrid();
};

Wonderwall.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;

  this.canvasBox = Razor.getBoundingBox(this.canvas);
};

Wonderwall.prototype.buildGrid = function() {

  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      var point = new Wonderwall.Point(this.sizeW + (j * this.sizeW) + Math.random()*10, this.sizeH + (i * this.sizeH));
      this.points.push(point);
    }
  }
};

Wonderwall.prototype.update = function(point, debug) {
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

Wonderwall.prototype.render = function() {
  this.debug.begin();

  this.context.clearRect(0, 0, this.width, this.height);

  for (var i = 0; i < this.points.length; i++) {
    this.update(this.points[i], i == 0 ? true : false);
  }

  var current = 0;
  var sum = 0;
  var total = (this.columns - 1) * (this.rows - 1);

  for (var a = 0; a < this.columns - 1; a++) {
    for (var b = 0; b < this.rows - 1; b++) {

      this.context.beginPath();
      this.context.moveTo(this.points[current + sum].x, this.points[current + sum].y);
      this.context.lineTo(this.points[current + sum + 1].x, this.points[current + sum + 1].y);
      this.context.lineTo(this.points[current + sum + 1 + this.rows].x, this.points[current + sum + 1 + this.rows].y);
      this.context.lineTo(this.points[current + sum + 0 + this.rows].x, this.points[current + sum + 0 + this.rows].y);
      this.context.closePath();

      var valor = Math.floor(255 - (4 * current));
      this.context.fillStyle = 'rgb(' + valor + ',' + 0 + ',' + valor + ')';
      this.context.fill();

      if (b % this.rows == this.rows - 2) {
        ++sum;
      }
      ++current;
    }
  }

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

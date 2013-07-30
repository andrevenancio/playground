/**
 * ScrollSurface Grid
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * ScrollSurface Grid
 * @constructor
 */
ScrollSurface.Grid = function(canvas) {
  this.canvas = document.getElementById(canvas);
  this.context = this.canvas.getContext('2d');


  this.width = 400;
  this.height = 400;
  this.ox = (window.innerWidth - this.width) / 2;
  this.oy = (window.innerHeight - this.height - 40) / 2;
  this.x = 0;
  this.y = 0;

  this.offsetX = 0;
  this.offsetY = 0;

  this.rows = 2;
  this.columns = 2;
  this.size = 100;

  this.points = [];
  this.pointsInScene = [];
};

ScrollSurface.Grid.prototype.resize = function() {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight - 40;

  this.ox = (window.innerWidth - this.width) / 2;
  this.oy = (window.innerHeight - this.height - 40) / 2;

  this.rebuild();
};

ScrollSurface.Grid.prototype.rebuild = function() {

  this.points = [];
  this.pointsInScene = [];

  //calculates the number of necessary points taking in consideration the device width and the cell width
  this.rows = Math.ceil(this.height / this.size) + 3;
  this.columns = Math.ceil(this.width / this.size) + 3;

  var x = this.ox + this.x - this.size;
  var y = this.oy + this.y - this.size;
  var a = 0;
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      a++;

      var point = new ScrollSurface.Point(x + (j * this.size), y + (i * this.size), a);
      this.points.push(point);
    }
  }
};

ScrollSurface.Grid.prototype.render = function(offsetX, offsetY) {

  this.offsetX = offsetX;
  this.offsetY = offsetY;

  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (var point in this.points) {
    var inside = this.checkIfInScreen(this.points[point]);

    this.context.beginPath();
    this.context.arc(offsetX + this.points[point].x, offsetY + this.points[point].y, 5, 0, 2 * Math.PI, false);
    this.context.fillStyle = inside;
    this.context.fill();
    this.context.lineWidth = 5;
    this.context.strokeStyle = '#003300';
    this.context.stroke();

    this.context.fillStyle = 'yellow';
    this.context.font = '9px Arial center';
    this.context.fillText(this.points[point].id, offsetX + this.points[point].x, offsetY + this.points[point].y);
  }

  this.context.strokeStyle = '#FFFFFF';
  this.context.lineWidth = 1;
  this.context.strokeRect(this.ox + this.x, this.oy + this.y, this.width, this.height);

};

ScrollSurface.Grid.prototype.checkIfInScreen = function(point) {

  var p = point;

  var x = this.ox + this.x - this.offsetX;
  var y = this.oy + this.y - this.offsetY;

  if(p.x >= x && p.x <= (x + this.width) && p.y >= y && p.y <= (y + this.height)) {
    return 'red'
  }
  return 'cyan';
}
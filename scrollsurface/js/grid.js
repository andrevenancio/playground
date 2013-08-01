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


  this.width = 450;
  this.height = 300;
  this.ox = (window.innerWidth - this.width) / 2;
  this.oy = (window.innerHeight - this.height - 40) / 2;
  this.x = 0;
  this.y = 0;

  this.offsetX = 0;
  this.offsetY = 0;

  this.rows = 2;
  this.columns = 2;
  this.size = 50;

  this.points = [];
  this.firstPoint = undefined;
  this.oldfirstPoint = undefined;

  this.howMany = 1;
  this.extra = 0;
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

  //calculates the number of necessary points taking in consideration the device width and the cell width
  this.rows = Math.ceil(this.height / this.size) + 1 + (2 * this.extra);
  this.columns = Math.floor(this.width / this.size) + 1 + (2 * this.extra);

  var x = this.ox + this.x - (this.size * this.extra);
  var y = this.oy + this.y - (this.size * this.extra);
  var a = 0;
  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      var point = new ScrollSurface.Point(x + (i * this.size), y + (j * this.size), a);
      this.points.push(point);
      a++;
    }
  }
};

ScrollSurface.Grid.prototype.addToGridOnRight = function() {
  /*
  var lastID = this.points[this.points.length - 1].id;
  for (var j = this.rows - 1; j >= 0; j--) {

    var id = this.points.length - this.rows;
    lastID++;

    var point = new ScrollSurface.Point(this.points[id].x + this.size, this.points[id].y, lastID);
    this.points.push(point);
  }
  */

  var i = 0;
  while (i < this.rows) {
    this.points.splice(0, 1);
    i++;
  }
};

ScrollSurface.Grid.prototype.addToGridOnLeft = function() {
  /*var lastID = this.points[this.points.length - 1].id;
  for (var j = this.rows - 1; j >= 0; j--) {

    var id = this.points.length - this.rows;
    lastID++;

    var point = new ScrollSurface.Point(this.points[id].x + this.size, this.points[id].y, lastID);
    this.points.push(point);
  }
*/
//grabs first positions
  var temp = [];
  for(var i= 0; i<this.rows; i++) {
    temp.push(this.points[i]);
  }

  var i = 0;
  while (i < this.rows) {
    this.points.splice(this.points.length - 1, 1);
    i++;
  }

  var lastID = this.points[this.points.length - 1].id;
  for(var i=0; i<this.rows; i++) {
    var point = new ScrollSurface.Point(temp[i].x - this.size, temp[i].y, lastID);
    this.points.unshift(point);
    lastID++;
  }
};

ScrollSurface.Grid.prototype.render = function(offsetX, offsetY) {

  this.offsetX = offsetX;
  //this.offsetY = offsetY;

  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  var firstPoint = null;
  for (var point in this.points) {

    var curPoint = this.points[point];
    var inside = this.checkIfInScreen(curPoint);
    var colour = inside == true ? 'green' : 'orange';

    //checks column and row
    if (inside == true && firstPoint === null) {
      firstPoint = curPoint;

      if (firstPoint !== this.firstPoint) {
        this.firstPoint = firstPoint;
        var row = Math.ceil((firstPoint.id - this.points[0].id) / this.rows);

        console.log(row);

        if (row >= (this.extra + 2)) {
          this.howMany = row - (this.extra + 1);

          for (var i = 0; i < this.howMany; i++) {
            this.addToGridOnRight();
          }

          break;
          throw new Error('Breaking out of loop failed');

        } else if (row <= this.extra) {
          this.howMany = row - (this.extra - 1);

          for (var i = 0; i < this.howMany; i++) {
            this.addToGridOnLeft();
          }

          break;
          throw new Error('Breaking out of loop failed');

        }
      }
    }

    this.context.beginPath();
    this.context.fillStyle = colour;
    this.context.arc(this.offsetX + curPoint.x, this.offsetY + curPoint.y, 3, 0, 2 * Math.PI, false);
    this.context.fill();

    this.context.fillStyle = 'white';
    this.context.font = '10px Arial';
    this.context.fillText(curPoint.id, this.offsetX + curPoint.x, this.offsetY + curPoint.y);
    this.context.closePath();
  }

  this.context.beginPath();
  this.context.strokeStyle = '#FFFFFF';
  this.context.lineWidth = 1;
  this.context.strokeRect(this.ox + this.x, this.oy + this.y, this.width, this.height);
  this.context.closePath();
};

ScrollSurface.Grid.prototype.checkIfInScreen = function(point) {

  var p = point;

  var x = this.ox + this.x - this.offsetX;
  var y = this.oy + this.y - this.offsetY;

  if (p.x >= x && p.x <= (x + this.width) && p.y >= y && p.y <= (y + this.height)) {
    return true;
  }
  return false;
};

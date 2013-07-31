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
  this.extra = 2;
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
  //console.log('removing', this.howMany);
  var newArray = [];
  for (var i = 0; i < this.points.length; i++) {
    //removing from the array
    if (i < (this.rows * this.howMany)) {
      continue;
    }
    //adding all tge rest to the array
    newArray.push(this.points[i]);
  }

  var lastID = this.points[this.points.length - 1].id;
  console.log(lastID);  
  //var id = 0;
  /*for (var i = (this.rows * howMany) - 1; i >= 0; i--) {
    lastID++;

    id = this.points.length - (1 + i);

    if(howMany>1) {
      console.log(id);
    };
    var point = new ScrollSurface.Point(this.points[id].x + this.size, this.points[id].y, lastID);
    newArray.push(point);
  }

  console.log(this.points.length, newArray.length);
  */
  this.points = [];
  for (var i = 0; i < newArray.length; i++) {
    this.points.push(newArray[i]);
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
        //console.log(row);
        if (row >= (this.extra + 2)) {
          this.howMany = row - (this.extra + 1)
          //console.log('monta', this.howMany);
          this.addToGridOnRight();
          break;
          //throw new Error('Breaking out of loop failed');
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

  if (this.howMany > 3) {
    //console.log('rebuild with', this.howMany);
    //debugger;
  }
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

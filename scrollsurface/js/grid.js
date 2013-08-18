/**
 * ScrollSurface Grid
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * ScrollSurface Grid
 * @constructor
 */
ScrollSurface.Grid = function(canvas) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');

  this.width = window.innerWidth;
  this.height = window.innerHeight - 40;
  this.x = (window.innerWidth - this.width) / 2;
  this.y = (window.innerHeight - this.height) / 2;
  this.offsetX = 0;
  this.offsetY = 0;
  this.cols = 3;
  this.rows = 3;
  this.scale = 0.1;

  this.R = false;
  this.G = true;
  this.B = true;
  this.detectInView = false;

  this.curItem = 0;
  this.data = [];
  this.points = [];

  this.oldRow = this.oldCol = 0;
  this.curRow = this.curCol = 0;
};

ScrollSurface.Grid.prototype.feed = function(data) {
  this.data = data;
};

ScrollSurface.Grid.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight - 40;

  this.x = (window.innerWidth - (this.width * this.scale)) / 2;
  this.y = (window.innerHeight - ((this.height * this.scale)) - 40) / 2;

  this.rebuild();
};

ScrollSurface.Grid.prototype.rebuild = function() {
  this.points = [];

  var a = 0;
  var x = this.x - (this.width * this.scale);
  var y = this.y - (this.height * this.scale);

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var id = this.curRow + (this.curCol * 3) + a;
      if(a == 0) {
        console.warn(id)
      }
      if (this.curRow < 0) {
        id += this.data.length + 1;
      }

      if (this.curCol < 0) {
        id += this.data.length;
      }

      var point = new ScrollSurface.Point(x + (j * (this.width * this.scale)) - this.offsetX,
                                          y + (i * (this.height * this.scale)) - this.offsetY,
                                          this.data[id % this.data.length].id);
      this.points.push(point);
      a++;
    }
  }
};

ScrollSurface.Grid.prototype.checkIfInView = function() {
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    var x = this.x - this.offsetX;
    var y = this.y - this.offsetY;

    if ((point.x + this.width * this.scale) >= x && point.x <= (x + this.width * this.scale) && (point.y + this.height * this.scale) >= y && point.y <= (y + this.height * this.scale)) {
      point.active = true;
    } else {
      point.active = false;
    }
  }
};

ScrollSurface.Grid.prototype.checkArray = function() {
  this.oldRow = this.curRow;
  this.oldCol = this.curCol;
  this.curRow = Math.floor(-this.offsetX / (this.width * this.scale));
  this.curCol = Math.floor(-this.offsetY / (this.height * this.scale));

  if (this.oldRow !== this.curRow || this.oldCol !== this.curCol) {
    this.rebuild();
  }
};

ScrollSurface.Grid.prototype.render = function(offsetX, offsetY) {

  this.offsetX = offsetX;
  this.offsetY = offsetY;

  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  this.checkArray();
  if (this.detectInView) {
    this.checkIfInView();
  }

  for (var i = 0; i < this.points.length; i++) {

    var value = Math.floor(255 - (5 * i));

    this.context.save();
    this.context.globalAlpha = this.points[i].active == true ? 1 : 0.1;

    this.context.beginPath();
    this.context.fillStyle = 'rgb(' + (this.R == true ? value : 0) + ',' + (this.G == true ? value : 0) + ',' + (this.B == true ? value : 0) + ')';
    //this.context.fillStyle = 'grey';
    this.context.rect(this.offsetX + this.points[i].x, this.offsetY + this.points[i].y, this.width * this.scale, this.height * this.scale);
    this.context.fill();

    this.context.fillStyle = '#000000';
    this.context.font = '10px Arial';
    this.context.fillText(this.points[i].id, this.offsetX + this.points[i].x + (this.width * this.scale) / 2, this.offsetY + this.points[i].y + (this.height * this.scale) / 2);
    //this.context.strokeStyle = '#000000';
    //this.context.lineWidth = 1;
    //this.context.stroke();
    this.context.closePath();

    this.context.restore();
  }

  this.context.beginPath();
  this.context.strokeStyle = '#FFFFFF';
  this.context.lineWidth = 2;
  this.context.strokeRect(this.x, this.y, this.width * this.scale, this.height * this.scale);
  this.context.closePath();
};

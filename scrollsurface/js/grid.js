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

  this.width = 100;
  this.height = 100;
  this.x = (window.innerWidth - this.width) / 2;
  this.y = (window.innerHeight - this.height - 40) / 2;
  this.offsetX = 0;
  this.offsetY = 0;
  this.cols = 3;
  this.rows = 3;

  this.R = false;
  this.G = true;
  this.B = false;

  this.points = [];
};

ScrollSurface.Grid.prototype.resize = function() {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight - 40;

  this.x = (window.innerWidth - this.width) / 2;
  this.y = (window.innerHeight - this.height - 40) / 2;

  this.rebuild();
};

ScrollSurface.Grid.prototype.rebuild = function() {

  this.points = [];

  var a = 0;
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var point = new ScrollSurface.Point(this.x + (j * this.width), this.y + (i * this.height), a);
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

    if ((point.x + this.width) >= x && point.x <= (x + this.width) && (point.y + this.height) >= y && point.y <= (y + this.height)) {
      point.active = true;
    } else {
      point.active = false;
    }
  }
};

ScrollSurface.Grid.prototype.checkArray = function() {
  var cellStartX = this.points[0].x + this.offsetX;


  if (cellStartX < (this.x-this.width)) {
    var lastID = this.points[this.points.length - 1].id;
    console.log('remove elements from the left');
    //we need to remove elements from the points array, but not to mess up the original array, lets duplicate all points into a new one
    
    var temp = [];
    for (var i = 0; i < this.points.length; i++) {
      console.log(i%this.rows, i);
      if (i % this.rows == 0) {
        lastID++;

        var newIndex = i + this.rows-1;
        var point = new ScrollSurface.Point(this.points[newIndex].x + this.width, this.points[newIndex].y, lastID);
        temp.push(point);
        //console.log('NEW', i)
        continue;
      }
      //console.log('OLD', i)
      temp.push(this.points[i]);
    }
    //all points added, except the points on the left
    this.points = [];
    for (var i = 0; i < temp.length; i++) {
      //console.log(temp[i])
      this.points.push(temp[i]);
    }
    debugger;
  }  
};

ScrollSurface.Grid.prototype.render = function(offsetX, offsetY) {

  this.offsetX = offsetX;// - (this.width*(this.cols-2));
  this.offsetY = offsetY;// - (this.height*(this.rows-2));

  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  this.checkArray();
  this.checkIfInView();

  for (var i = 0; i < this.points.length; i++) {

    var value = Math.floor(255 - (5 * i));

    this.context.save();
    this.context.globalAlpha = this.points[i].active == true ? 1 : 0.1;

    this.context.beginPath();
    this.context.fillStyle = 'rgb(' + (this.R == true ? value : 0) + ',' + (this.G == true ? value : 0) + ',' + (this.B == true ? value : 0) + ')';
    this.context.rect(this.offsetX + this.points[i].x, this.offsetY + this.points[i].y, this.width, this.height);
    this.context.fill();

    this.context.fillStyle = '#000000';
    this.context.font = '12px Arial';
    this.context.fillText(this.points[i].id, this.offsetX + this.points[i].x + this.width / 2, this.offsetY + this.points[i].y + this.height / 2);
    //this.context.strokeStyle = '#000000';
    //this.context.lineWidth = 1;
    //this.context.stroke();
    this.context.closePath();

    this.context.restore();
  }

  this.context.beginPath();
  this.context.strokeStyle = '#FFFFFF';
  this.context.lineWidth = 1;
  this.context.strokeRect(this.x, this.y, this.width, this.height);
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

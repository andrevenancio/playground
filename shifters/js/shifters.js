/**
 * Shifters Prototype
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Shifters
 * @constructor
 */
var Shifters = function() {

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  this.debug = new Razor.Debugger(true, false);

  this.folder = this.debug.gui.addFolder('Shifters');
  this.debug.gui.open();


  this.points = [{x: 200, y: 100},
                 {x: 200, y: 249},
                 {x: 328, y: 174.5}];
  this.randomPoint, this.pointA, this.pointB;

  this.width = 0;
  this.height = 0;

  this.distance = 128;
  this.bindedRender = this.render.bind(this);

  this.init();
};

Shifters.prototype.init = function() {
  var scope = this;
  window.addEventListener('resize', function() { scope.resize(); }, false);
  this.folder.add(this, 'distance', -128, 128).listen();
  this.folder.open();

  this.resize();
  this.startRandom();
  requestAnimationFrame(this.bindedRender);
};

Shifters.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;
};


Shifters.prototype.render = function() {
  this.debug.begin();
  TWEEN.update();

  this.context.clearRect(0, 0, this.width, this.height);

  //meio de dois pontos
  var x = (this.pointB.x + this.pointA.x) / 2;
  var y = (this.pointB.y + this.pointA.y) / 2;

  //mover um ponto sobre uma linha que liga dois pontos
  var ponto = this.calculatePointAlongAxis({x: x, y: y}, this.randomPoint, this.distance);
  x = ponto.x;
  y = ponto.y;

  this.context.beginPath();
  this.context.arc(x, y, 2, 0, 2 * Math.PI, false);
  this.context.fillStyle = 'black';
  this.context.fill();

  this.drawTriangle(this.context, this.pointA, this.pointB, {x: x, y: y});


  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

Shifters.prototype.calculatePointAlongAxis = function(pointA, pointB, distance) {
  var point = {x: 0, y: 0};
  var doubleMagnitude = Math.sqrt(Math.pow((pointB.y - pointA.y), 2) + Math.pow((pointB.x - pointA.x), 2));
  point.x = (pointA.x + (distance * ((pointB.x - pointA.x) / doubleMagnitude)));
  point.y = (pointA.y + (distance * ((pointB.y - pointA.y) / doubleMagnitude)));
  return point;
};


Shifters.prototype.drawTriangle = function(context, a, b, c) {
  context.save();
  context.globalAlpha = 1;

  context.beginPath();
  context.fillStyle = '#FF0000';
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.lineTo(c.x, c.y);
  context.lineTo(a.x, a.y);
  context.fill();
  context.closePath();

  context.restore();
};

Shifters.prototype.startRandom = function() {
  var randomPoint = Math.round(Math.random() * 2);
  this.randomPoint = this.points[randomPoint];
 // console.log('ponto', randomPoint);
  switch (randomPoint) {
    case 0:
      this.pointA = this.points[1];
      this.pointB = this.points[2];
      break;
    case 1:
      this.pointA = this.points[0];
      this.pointB = this.points[2];
      break;
    case 2:
      this.pointA = this.points[0];
      this.pointB = this.points[1];
      break;
  }

this.distance = 128;
var self = this;
var tween1 = new TWEEN.Tween(this)
            .to({ distance: -128 }, 500)
            .delay(500)
            .easing(TWEEN.Easing.Quartic.In)
            .onUpdate(function() {
              console.log(this.distance);
            })
            .onComplete(function() {
              console.log('acabou');

              //meio de dois pontos
              var x = (self.pointB.x + self.pointA.x) / 2;
              var y = (self.pointB.y + self.pointA.y) / 2;

              var ponto = self.calculatePointAlongAxis({x: x, y: y}, self.randomPoint, self.distance);
              x = ponto.x;
              y = ponto.y;
              self.points[randomPoint].x = x;
              self.points[randomPoint].y = y;
              self.startRandom();
            })
            .start();
};

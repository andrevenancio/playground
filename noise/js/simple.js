/**
 * Simple Noise example
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Simple Noise
 * @constructor
 */
var SimpleNoise = function() {
  this.debug = new Razor.Debugger(false, false);

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.width = 400;
  this.height = 400;

  this.folder = this.debug.gui.addFolder('Simple Noise');

  this.R = 255;
  this.G = 0;
  this.B = 0;
  this.grayscale = false;
  this.grayscaleSlider = '';

  this.tempCanvas = document.createElement('canvas');
  this.tempContext = this.tempCanvas.getContext('2d');
  this.noise = new Razor.SimpleNoise();

  this.bindedRender = this.render.bind(this);

  this.init();
};

/**
 * Initializes the experiment
 */
SimpleNoise.prototype.init = function() {
  this.resize();

  var scope = this;
  window.addEventListener('resize', function() { scope.resize(); }, false);

  /* dat.GUI controlers */
  this.folder.add(scope, 'grayscale', 0, 255).onChange(this.handleGrayscale.bind(this));
  this.folder.add(scope, 'R', 0, 255).step(1).listen().onChange(function() {
    scope.grayscaleSlider = 'r';
    scope.rebuild();
  }.bind(this));
  this.folder.add(scope, 'G', 0, 255).step(1).listen().onChange(function() {
    scope.grayscaleSlider = 'g';
    scope.rebuild();
  }.bind(this));
  this.folder.add(scope, 'B', 0, 255).step(1).listen().onChange(function() {
    scope.grayscaleSlider = 'b';
    scope.rebuild();
  }.bind(this));

  this.folder.open();

  this.noise.setDetail(400, 400);

  this.rebuild();
  requestAnimationFrame(this.bindedRender);
};

/**
 * Rebuilds the experiment, everytime a parameter is changed
 */
SimpleNoise.prototype.rebuild = function() {
  if (this.grayscale == true) {
    var value = 0;
    switch (this.grayscaleSlider) {
      case 'r':
        value = this.R;
        this.B = this.R;
        this.G = this.R;
        break;
      case 'b':
        value = this.B;
        this.R = this.B;
        this.G = this.B;
        break;
      case 'g':
        value = this.G;
        this.R = this.G;
        this.B = this.G;
        break;
    }
    this.noise.setGrayscale(value);
  } else {
    this.noise.setRed(this.R);
    this.noise.setGreen(this.G);
    this.noise.setBlue(this.B);
  }

  this.noise.generate();
};

/**
 * Handles window resize
 */
SimpleNoise.prototype.resize = function() {
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;

  this.canvasBox = Razor.getBoundingBox(this.canvas);
};

SimpleNoise.prototype.handleGrayscale = function(bool) {
  this.grayscale = bool;
  this.rebuild();
};

/**
 * Render
 */
SimpleNoise.prototype.render = function() {
  this.debug.begin();

  this.context.clearRect(0, 0, this.width, this.height);

  this.tempContext.putImageData(this.noise.getSimple(), 0, 0);
  this.context.drawImage(this.tempCanvas, 0, 0, this.width, this.height);

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

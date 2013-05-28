/**
 * Example
 * @author first.lastname@razorfish.com (FIRST LASTNAME)
 */

/**
 * Example
 * @constructor
 */
var Example = function() {
  this.debug = new Razor.Debugger(true, false);
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.bindedRender = this.render.bind(this);

  this.init();
};

/**
 * Initializes the experiment
 */
Example.prototype.init = function() {
  this.canvas.width = 400;
  this.canvas.height = 300;
  this.canvas.style['background-color'] = 'rgba(255, 255, 255, 0.8)';

  requestAnimationFrame(this.bindedRender);

};

Example.prototype.render = function() {
  this.debug.begin();

  this.context.clearRect(0, 0, this.width, this.height);

  this.debug.end();
  requestAnimationFrame(this.bindedRender);
};

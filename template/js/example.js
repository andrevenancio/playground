/**
 * Example
 * @author first.lastname@razorfish.com (FIRST LASTNAME)
 */

/**
 * Example
 * @constructor
 */
var Example = function() {
  this.debug = new Razor.Debugger();
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.init();
};

/**
 * Initializes the experiment
 */
Example.prototype.init = function() {
  this.canvas.width = 400;
  this.canvas.height = 300;
  this.canvas.style['background-color'] = 'rgba(255, 255, 255, 0.8)';
};

/**
 * Wonderwall Point
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * Wonderwall Point
 * @param  {Number} x X position.
 * @param  {Number} y Y position.
 */
Wonderwall.Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.ox = this.x || 0;
  this.oy = this.y || 0;
};

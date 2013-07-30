/**
 * ScrollSurface Point
 * @author andre.venancio@razorfish.com (Andre Venancio)
 */

/**
 * ScrollSurface Point
 * @param  {Number} x X position.
 * @param  {Number} y Y position.
 */
ScrollSurface.Point = function(x, y, id) {
  this.x = x || 0;
  this.y = y || 0;
  this.id = id || 'none';
};
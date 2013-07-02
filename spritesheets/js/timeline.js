/**
 * Timeline
 */
var Timeline = function(holder, spriteshet, startingLoop, endingLoop, update) {
  this.id = spriteshet;
  this.isLooping = false;

  this.domElement = holder;
  this.spriteshet = spriteshet;
  this.startingLoop = startingLoop;
  this.endingLoop = endingLoop;

  this.needsRender = false;
  this.needsLoop = false;
  this.currentFrame = 0;
  this.endCallback = function(){};
  this.updateCallback = update;

  this.bindedRender = this.render_.bind(this);
};


Timeline.prototype.start = function() {
  console.log('starting loop', this.id);
  if (this.needsRender == true) {
    return;
  } else {
    this.needsRender = true;
    this.needsLoop = true;
    this.isLooping = true;
    requestAnimationFrame(this.bindedRender);
  }
};

Timeline.prototype.end = function(callback) {
  console.log('ending loop', this.id);

  if (this.needsRender == true && this.needsLoop == true) {
    this.endCallback = callback;
    this.needsLoop = false;
  }
};


/**
 * render timeline
 * @private
 */
Timeline.prototype.render_ = function() {
  //console.log('render frame', this.currentFrame);

  this.updateCallback(this.currentFrame);

  if (this.needsLoop == true) {
    // our animation is looping normally
    this.currentFrame++;
  } else if (this.needsLoop == false) {
    // the end method was called, rewind animation
   
    if (this.currentFrame == 0) {
      // the animation reached frame 0, dispatch the callback
      this.needsRender = false;
      this.isLooping = false;
      this.endCallback();
    }

    this.currentFrame--;
  }

  // if the last frame of loop is detected, go back to first frame of loop
  if (this.currentFrame == this.endingLoop + 1) {
    this.currentFrame = this.startingLoop;
  }

  // detect if we still need to run this render_ method
  if (this.needsRender) {
    requestAnimationFrame(this.bindedRender);
  }
};

/**
 * Original by wensheng.yan on 5/23/16 for videojs-panorama.
 * Refactored by Kjue 09/02/19.
 */
import document from 'global/document';
import videojs from 'video.js';
const Component = videojs.getComponent('Component');

const element = document.createElement('canvas');

element.className = 'vjs-video-helper-canvas';

/**
 * Class to support IE11 by rendering video via a canvas element.
 */
class HelperCanvas extends Component {
  constructor(player, options) {
    super(player, options);
    this.videoElement = options.video;
    this.width = player.videoWidth();
    this.height = player.videoHeight();
    element.width = this.width;
    element.height = this.height;
    element.style.display = 'none';
    options.el = element;
    this.context = element.getContext('2d');
    this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);
  }

  /**
   * Returns the canvas element that helper draws onto.
   */
  el() {
    return element;
  }

  /**
   * Updates the canvas image from the video element.
   */
  update() {
    this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);
  }
}
videojs.registerComponent('HelperCanvas', HelperCanvas);

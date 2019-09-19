/**
 * Original by wensheng.yan on 5/23/16 for videojs-panorama.
 * Refactored by Kjue 09/02/19.
 */
import document from 'global/document';
import videojs from 'video.js';
import { CanvasTexture } from 'three';
const Component = videojs.getComponent('Component');

/**
 * Class to support IE11 by rendering video via a canvas element.
 *
 * **Limitation:** IE11 still has an issue with CORS so that the
 * WebGL can ONLY render textures from the same domain the page
 * is hosted in.
 *
 * Refactored to better shape with ideas from Three.js.
 *
 * @see https://forum.unity.com/threads/webgl-www-security-cross-origin-resource-sharing-help-please.328419/
 */
class HelperCanvas extends Component {
  /**
   * Constructor for the HelperCanvas component that forwards the
   * video texture to WebGL.
   *
   * @param {*} player VideoJS instance
   * @param {*} options options
   */
  constructor(player, options) {
    super(player, options);

    this.element = document.createElement('canvas');
    this.element.crossOrigin = 'anonymous';
    this.element.className = 'vjs-video-helper-canvas';
    this.video = options.video;
    this.width = player.videoWidth();
    this.height = player.videoHeight();
    this.element.width = this.width;
    this.element.height = this.height;
    this.element.style.display = 'none';
    this.context = this.element.getContext('2d');

    this.context.drawImage(this.video, 0, 0, this.width, this.height);
    this.texture_ = new CanvasTexture(this.context.canvas);

    this.texture_.generateMipmaps = false;
    this.texture_.onUpdate = () => {
      if (this.video.readyState >= this.video.HAVE_CURRENT_DATA ||
          this.player_.seeking()) {
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        this.needsUpdate = true;
      }
    };
  }

  /**
   * Getter for the texture we can use from this element.
   */
  get texture() {
    return this.texture_;
  }
}
videojs.registerComponent('HelperCanvas', HelperCanvas);

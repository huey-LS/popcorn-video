import {
  createDecoderFactory,
  Source
} from '@popcorn-video/video';

import { HTML5Decoder } from '@popcorn-video/html5-decoder';

import flvjs from 'flv.js';


export class FlvjsDecoder extends HTML5Decoder {
  static isSupported () {
    return flvjs && flvjs.isSupported();
  }
  static isCanPlaySource (source: Source) {
    const type = source.type;
    const supportedTypes = {
      'video/flv': true,
      'video/x-flv': true
    };
    if (FlvjsDecoder.isSupported() && (supportedTypes as any)[type]) {
      return true;
    }

    return false;
  }

  _flvjsConfig: any;

  flvPlayer?: any;

  constructor (source: Source, options: FlvjsDecoderOptions) {
    super(source, options);
    this._flvjsConfig = options.flvjsConfig;
  }

  setSource (source: Source) {
    this.destroyFlyjs();
    this.setupFlyjs();
  }

  destroyFlyjs () {
    if (this.flvPlayer) {
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
  }

  setupFlyjs () {
    const source = this.source;
    let mediaDataSource = {
      // type: source.type === undefined ? 'flv' : source.type,
      type: 'flv',
      url: source.src
    };

    console.log('setupFlyjs', this.source, mediaDataSource);

    this.flvPlayer = flvjs.createPlayer(mediaDataSource, this._flvjsConfig);
    this.flvPlayer.attachMediaElement(this._el);
    this.flvPlayer.load();

    this.flvPlayer.on(flvjs.Events.ERROR, (errorType: any, errorDetail: any) => {
      console.log(errorType, errorDetail);
      // this.error_ = new videojs.MediaError(
      //   videojs.MediaError.MEDIA_ERR_CUSTOM
      // );
      // if (errorType === flvjs.ErrorTypes.NETWORK_ERROR) {
      //   // 403 or 404
      //   if (errorDetail === flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
      //     this.error_ = new videojs.MediaError(
      //       videojs.MediaError.MEDIA_ERR_ABORTED
      //     );
      //   } else if (errorDetail === flvjs.ErrorDetails.NETWORK_TIMEOUT) {
      //     this.error_ = new videojs.MediaError(
      //       videojs.MediaError.MEDIA_ERR_NETWORK
      //     );
      //   }
      // }
      // this.trigger('error');
      return;
    })
  }

  setup (dom: HTMLElement) {
    dom.appendChild(this._el);
    this.setupFlyjs();
    if (this._autoplay) {
      setTimeout(() => {
        try {
          this.play();
        } catch (e) {}
      }, 2000);
    }
  }

  play () {
    if (this.flvPlayer) {
      this.flvPlayer.play();
    }
  }

  pause () {
    if (this.flvPlayer) {
      this.flvPlayer.pause();
    }
  }

  get volume () {
    if (this.flvPlayer) {
      this.flvPlayer.volume;
    }
    return 0;
  }

  destroy () {
    super.destroy.call(this);
    this.destroyFlyjs();
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}

interface FlvjsDecoderOptions {
  htmlAttributes: { [propName: string]: string },
  flvjsConfig: any,
  autoplay?: boolean
}

export const createFlvjsDecoder = createDecoderFactory<FlvjsDecoderOptions, FlvjsDecoder>(FlvjsDecoder);
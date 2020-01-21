import {
  createDecoderFactory,
  Source,
  VideoError,
  ErrorCodes
} from '@popcorn-video/video';

import { HTML5Decoder, HTML5DecoderOptions } from '@popcorn-video/html5-decoder';

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
    this.setLoading(true);
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
      type: 'flv',
      url: source.src
    };

    this.flvPlayer = flvjs.createPlayer(mediaDataSource, this._flvjsConfig);
    this.flvPlayer.attachMediaElement(this._el);
    this.flvPlayer.load();

    this.flvPlayer.on(flvjs.Events.ERROR, (errorType: any, errorDetail: any) => {
      let error = new VideoError();

      if (errorType === flvjs.ErrorTypes.NETWORK_ERROR) {
        error.setCode(
          ErrorCodes.MEDIA_ERR_NETWORK
        );
        // 403 or 404
        if (errorDetail === flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
          error.setCode(
            ErrorCodes.MEDIA_ERR_SOURCE_INVALID
          );
        } else if (errorDetail === flvjs.ErrorDetails.NETWORK_TIMEOUT) {
          error.setCode(
            ErrorCodes.MEDIA_ERR_NETWORK_TIMEOUT
          );
        }
      }
      this.error = error;
      this.emit('error', error);
      return;
    })
  }

  setup (dom: HTMLElement) {
    dom.appendChild(this._el);
    this.setupFlyjs();
  }

  destroy () {
    super.destroy.call(this);
    this.destroyFlyjs();
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}

interface FlvjsDecoderOptions extends HTML5DecoderOptions {
  flvjsConfig: any
}

export const createFlvjsDecoder = createDecoderFactory<FlvjsDecoderOptions, FlvjsDecoder>(FlvjsDecoder);
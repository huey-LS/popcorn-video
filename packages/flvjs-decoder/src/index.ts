import {
  createDecoderFactory,
  Source,
  VideoError,
  ErrorCodes
} from '@popcorn-video/video';

import {
  HTML5BaseDecoder,
  HTML5DecoderOptions
} from '@popcorn-video/html5-decoder';

import flvjs from 'flv.js';

interface FlvjsMediaConfig {
  isLive?: boolean,
  hasAudio?: boolean,
  hasVideo?: boolean,
  cors?: boolean,
  withCredentials?: boolean,
  // Indicates total media duration, in milliseconds
  duration?: number
}

interface FlvjsConfig extends flvjs.Config {

}

export abstract class FlvjsBaseDecoder<ME extends HTMLVideoElement|HTMLAudioElement> extends HTML5BaseDecoder<ME> {
  _flvjsMediaConfig: FlvjsMediaConfig;
  _flvjsConfig: FlvjsConfig;

  flvPlayer?: any;

  get _defaultFlvjsMediaConfig (): FlvjsMediaConfig {
    return {};
  }
  get _defaultFlvjsConfig (): FlvjsConfig {
    return {};
  }

  constructor (source: Source, options: FlvjsDecoderOptions) {
    super(source, options);
    this._flvjsMediaConfig = {
      ...this._defaultFlvjsMediaConfig,
      ...(options.flvjsMediaConfig || {})
    };
    this._flvjsConfig = {
      ...this._defaultFlvjsConfig,
      ...(options.flvjsConfig || {})
    }
  }

  setSource (source: Source) {
    this.source = source;
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
    const {
      src,
      type,
      ...otherSource
    } = source;
    let mediaDataSource = {
      ...this._flvjsMediaConfig,
      ...otherSource,
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

  destroy () {
    super.destroy.call(this);
    this.destroyFlyjs();
  }
}

export class FlvjsDecoder extends FlvjsBaseDecoder<HTMLVideoElement> {
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

  get _defaultFlvjsMediaConfig () {
    return {
      hasAudio: true,
      hasVideo: true
    }
  }

  createElement (): HTMLVideoElement {
    let el = document.createElement('video');
    let htmlAttributes = Object.assign({}, this._htmlAttributes);
    Object.keys(htmlAttributes)
      .forEach((attributeName) => {
        el.setAttribute(attributeName, htmlAttributes[attributeName]);
      });

    return el;
  }
}

interface FlvjsDecoderOptions extends HTML5DecoderOptions {
  flvjsConfig: FlvjsConfig,
  flvjsMediaConfig: FlvjsMediaConfig
}

export const createFlvjsDecoder = createDecoderFactory<FlvjsDecoderOptions, FlvjsDecoder>(FlvjsDecoder);

export class FlvjsAudioDecoder extends FlvjsBaseDecoder<HTMLAudioElement> {
  static isSupported () {
    return flvjs && flvjs.isSupported();
  }
  static isCanPlaySource (source: Source) {
    const type = source.type;
    const supportedTypes = {
      'audio/flv': true,
      'audio/x-flv': true
    };
    if (FlvjsAudioDecoder.isSupported() && (supportedTypes as any)[type]) {
      return true;
    }

    return false;
  }

  get _defaultFlvjsMediaConfig () {
    return {
      hasAudio: true,
      hasVideo: false
    }
  }
  createElement (): HTMLAudioElement {
    let el = document.createElement('audio');
    let htmlAttributes = Object.assign({}, this._htmlAttributes);
    Object.keys(htmlAttributes)
      .forEach((attributeName) => {
        el.setAttribute(attributeName, htmlAttributes[attributeName]);
      });

    return el;
  }
}

export const createFlvjsAudioDecoder = createDecoderFactory<FlvjsDecoderOptions, FlvjsAudioDecoder>(FlvjsAudioDecoder);
import {
  Decoder,
  createDecoderFactory,
  Source,
  VideoError,
  ErrorCodes
} from '@popcorn-video/video';


export abstract class HTML5BaseDecoder<ME extends HTMLVideoElement|HTMLAudioElement> extends Decoder {
  get buffered () {
    const timeRanges = this._el.buffered;
    if (!timeRanges.length) return 0;
    return timeRanges.end(timeRanges.length -1);
  };
  get currentTime () {
    return this._el.currentTime;
  };

  get duration () {
    return this._el.duration || 0;
  }

  _el: ME;
  _htmlAttributes: { [propName: string]: string };

  loading: boolean = false;

  constructor (source: Source, options: HTML5DecoderOptions) {
    super(source);

    this._htmlAttributes = options.htmlAttributes;
    this._el = this.createElement();
    this._el.setAttribute('style', 'width: 100%;height: 100%');

    this._el.addEventListener('loadstart', () => {
      this.setLoading(true);
    });

    this._el.addEventListener('canplay', () => {
      this.setLoading(false);
    });

    this._el.addEventListener('error', () => {
      let elementError = this._el.error;
      let error = new VideoError();
      if (elementError) {
        let elementErrorToVideoErrorMap: any = {
          1: ErrorCodes.MEDIA_ERR_ABORTED,
          2: ErrorCodes.MEDIA_ERR_NETWORK,
          3: ErrorCodes.MEDIA_ERR_DECODE,
          4: ErrorCodes.MEDIA_ERR_SOURCE_INVALID
        }
        let errorCode = elementErrorToVideoErrorMap[elementError.code]
        if (errorCode) {
          error.setCode(errorCode);
        }
      }
      this.error = error;
      this.emit('error', error);
    })

    this.initEventFromElement([
      'canplay',
      'loadeddata', 'loadedmetadata', 'loadstart', 'progress', 'suspend',
      'pause', 'play', 'seeked', 'timeupdate', 'volumechange'
    ]);
  }

  initEventFromElement (eventNames: string[]) {
    eventNames.forEach((eventName) => {
      this._el.addEventListener(eventName, () => {
        this.emit(eventName as any, null);
      }, true);
    })
  }

  setSource (source: Source) {
    super.setSource.call(this, source);
    this._el.src = source.src;
    this.setLoading(true);
  }

  abstract createElement (): ME;

  get readyState () {
    return this._el.readyState;
  }

  get state () {
    if (this._el.ended) {
      return 'ended';
    }
    if (this._el.paused === false) {
      return 'playing';
    }
    return 'paused';
  }

  setLoading (loading: boolean) {
    this.loading = loading;
  }

  setup (dom: HTMLElement) {
    dom.appendChild(this._el);
    this.error = null;
    this.setSource(this.source);
  }

  play () {
    var promise = this._el.play();
    if (promise) {
      return promise;
    } else {
      return Promise.resolve();
    }
  }

  pause () {
    var promise: any = this._el.pause();
    if (promise) {
      return promise;
    } else {
      return Promise.resolve();
    }
  }

  seek (targetTime: number) {
    this._el.currentTime = targetTime;
  }
  setMute (muted = true) {
    this._el.muted = muted;
  }

  get muted () {
    if (this._el.volume === 0) return true;
    return this._el.muted;
  }

  setVolume (volume: number) {
    this._el.volume = volume;
    if (volume > 0) {
      this.setMute(false);
    }
  }
  get volume () {
    if (this._el.muted) return 0;
    return this._el.volume;
  }

  destroy () {
    super.destroy.call(this);
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}


export class HTML5Decoder extends HTML5BaseDecoder<HTMLVideoElement> {
  static _testElement?: HTMLVideoElement;
  static get lazyTestElement () {
    if (!this._testElement) {
      this._testElement = document.createElement('video');
    }
    return this._testElement;
  }

  static isSupported () {
    try {
      this.lazyTestElement.volume = 0.5;
    } catch (e) {
      return false
    }
    return !!(this.lazyTestElement && this.lazyTestElement.canPlayType);
  }
  static isCanPlaySource (source: Source) {
    return this.lazyTestElement.canPlayType(source.type) !== '';
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

export const createHTML5Decoder = createDecoderFactory<HTML5DecoderOptions, HTML5Decoder>(HTML5Decoder);

export class HTML5AudioDecoder extends HTML5BaseDecoder<HTMLAudioElement> {
  static _testElement?: HTMLAudioElement;
  static get lazyTestElement () {
    if (!this._testElement) {
      this._testElement = document.createElement('audio');
    }
    return this._testElement;
  }

  static isSupported () {
    try {
      this.lazyTestElement.volume = 0.5;
    } catch (e) {
      return false
    }
    return !!(this.lazyTestElement && this.lazyTestElement.canPlayType);
  }
  static isCanPlaySource (source: Source) {
    return this.lazyTestElement.canPlayType(source.type) !== '';
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

export const createHTML5AudioDecoder = createDecoderFactory<HTML5DecoderOptions, HTML5AudioDecoder>(HTML5AudioDecoder);

export interface HTML5DecoderOptions {
  htmlAttributes: { [propName: string]: string }
}
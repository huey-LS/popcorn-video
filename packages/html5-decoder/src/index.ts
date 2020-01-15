import {
  Decoder,
  createDecoderFactory,
  Source
} from '@popcorn-video/video';


export class HTML5Decoder extends Decoder {
  static _testVideoElement?: HTMLVideoElement;
  static get lazyTestVideoElement () {
    if (!this._testVideoElement) {
      this._testVideoElement = document.createElement('video');
    }
    return this._testVideoElement;
  }

  static isSupported () {
    try {
      this.lazyTestVideoElement.volume = 0.5;
    } catch (e) {
      return false
    }
    return !!(this.lazyTestVideoElement && this.lazyTestVideoElement.canPlayType);
  }
  static isCanPlaySource (source: Source) {
    return this.lazyTestVideoElement.canPlayType(source.type) !== '';
  }

  get buffered () {
    const timeRanges = this._el.buffered;
    if (!timeRanges.length) return 0;
    return timeRanges.end(timeRanges.length -1);
  };
  get currentTime () {
    return this._el.currentTime;
  };

  _el: HTMLVideoElement;
  _htmlAttributes: { [propName: string]: string };
  _autoplay: boolean;

  loading: boolean = false;

  constructor (source: Source, options: HTML5DecoderOptions) {
    super(source);

    this._htmlAttributes = options.htmlAttributes;
    this._autoplay = !!options.autoplay;
    this._el = this.createVideoElement();
    this._el.setAttribute('style', 'width: 100%;height: 100%');
    if (this._autoplay) {
      this._el.setAttribute('autoplay', 'autoplay');
    }

    this.initEventFromElement([
      'canplay', 'error',
      'loadeddata', 'loadedmetadata', 'loadstart', 'progress', 'suspend',
      'pause', 'play', 'seeked', 'timeupdate', 'volumechange'
    ]);

    this._el.addEventListener('loadstart', () => {
      this.setLoading(true);
    });

    this._el.addEventListener('canplay', () => {
      this.setLoading(false);
    });
  }

  initEventFromElement (eventNames: string[]) {
    eventNames.forEach((eventName) => {
      this._el.addEventListener(eventName, () => {
        this.emit(eventName as any, null);
      }, true);
    })
  }

  setSource (source: Source) {
    this._el.src = source.src;
  }

  createVideoElement () {
    let el = document.createElement('video');
    let htmlAttributes = Object.assign({}, this._htmlAttributes);
    Object.keys(htmlAttributes)
      .forEach((attributeName) => {
        el.setAttribute(attributeName, htmlAttributes[attributeName]);
      });

    return el;
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

    this.setSource(this.source);

    if (this._autoplay) {
      setTimeout(() => {
        try {
          this.play();
        } catch (e) {}
      }, 100);
    }
  }

  play () {
    this._el.play();
  }

  pause () {
    this._el.pause();
  }

  seek (targetTime: number) {
    this._el.currentTime = targetTime;
  }
  setMute (muted = true) {
    this._el.muted = muted;
  }

  get muted () {
    return this._el.muted;
  }

  setVolume (volume: number) {
    this._el.volume = volume;
  }
  get volume () {
    return this._el.volume;
  }

  destroy () {
    super.destroy.call(this);
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}

interface HTML5DecoderOptions {
  htmlAttributes: { [propName: string]: string },
  autoplay?: boolean
}

export const createHTML5Decoder = createDecoderFactory<HTML5DecoderOptions, HTML5Decoder>(HTML5Decoder);
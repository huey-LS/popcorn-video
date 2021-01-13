import { Source } from '../types';
import { Decoder, DecoderFactory, DecoderEvents } from './decoder';

import { EventEmitter } from './event-emitter';

export class Player extends EventEmitter<DecoderEvents> {
  decoderFactories: DecoderFactory<any>[];
  decoder?: Decoder;
  sources: Source[];
  autoplay: boolean;
  loop: boolean;
  _parentDom?: any;

  constructor (options: {
    decoders: DecoderFactory<any>[],
    sources: Source[],
    autoplay?: boolean,
    loop?: boolean,
  }) {
    super();
    this.decoderFactories = options.decoders.filter((decoder) => decoder.isSupported());
    // this.decoder = this.createDecoder();
    this.sources = options.sources;
    this.autoplay = !!options.autoplay;
    this.loop = !!options.loop;
    this.setSources(options.sources);
  }

  setSources (sources: Source[]) {
    this.sources = sources;
    if (this.decoder) {
      this.decoder.destroy();
    }
    this.decoder = this.createDecoder();
    if (this.decoder) {
      this.decoder.addAllListener((event) => {
        this.emit(event);
      })
    }
  }

  refresh () {
    if (this.sources) {
      this.setSources(this.sources);
      this.setup(this._parentDom);
    }
  }

  createDecoder () {
    for (let source of this.sources) {
      for (let decoder of this.decoderFactories) {
        if (decoder.isCanPlaySource(source)) {
          return decoder(source);
        }
      }
    }
  }

  get error () {
    if (this.decoder) {
      return this.decoder.error;
    }
    return null;
  }

  get loading () {
    if (this.decoder) {
      return this.decoder.loading;
    }
    return false;
  }

  get buffered () {
    if (this.decoder) {
      return this.decoder.buffered;
    }
    return 0;
  }

  get currentTime () {
    if (this.decoder) {
      return this.decoder.currentTime;
    }
    return 0;
  }

  get duration () {
    if (this.decoder) {
      return this.decoder.duration;
    }
    return 0;
  }

  get readyState () {
    if (this.decoder) {
      return this.decoder.readyState;
    }

    return 0;
  }

  get state () {
    if (this.decoder) {
      return this.decoder.state;
    }

    return 'unready';
  }

  get volume () {
    if (this.decoder) {
      return this.decoder.volume;
    }
    return 0;
  }

  get muted () {
    if (this.decoder) {
      return this.decoder.muted;
    }

    return true;
  }

  setup (dom: HTMLElement) {
    this._parentDom = dom;
    if (this.decoder) {
      this.decoder.setup(dom);

      if (this.loop) {
        this.decoder.setLoop(true);
      }
      if (this.autoplay) {
        this.decoder.once('canplay', () => {
          this.play().then((e) => {
          }, (e) => {
            // chrome autoplay-policy-changes: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
            this.setMute(true);
            this.play();
          })
        })
      }
    }
  }

  play () {
    if (this.decoder) {
      return this.decoder.play();
    } else {
      return Promise.reject();
    }
  }

  pause () {
    if (this.decoder) {
      return this.decoder.pause();
    } else {
      return Promise.reject();
    }
  }

  seek (targetTime: number) {
    if (this.decoder) {
      this.decoder.seek(targetTime);
    }
  }

  setMute (muted: boolean) {
    if (this.decoder) {
      this.decoder.setMute(muted);
    }
  }

  setVolume (volume: number) {
    if (this.decoder) {
      this.decoder.setVolume(volume);
    }
  }

  destroy () {
    super.destroy();
    if (this.decoder) {
      this.decoder.destroy();
    }
  }
}
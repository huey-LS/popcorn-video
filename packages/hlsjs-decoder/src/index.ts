import Hlsjs from 'hls.js';

import {
  createDecoderFactory,
  Source
} from '@popcorn-video/video';
import { HTML5Decoder, HTML5DecoderOptions } from '@popcorn-video/html5-decoder';


export class HlsjsDecoder extends HTML5Decoder {
  static isSupported () {
    return Hlsjs.isSupported();
  }
  static isCanPlaySource (source: Source) {
    const type = source.type;
    const supportedTypes = {
      'application/vnd.apple.mpegurl': true,
      'application/x-mpegURL': true
    };
    if ((supportedTypes as any)[type]) {
      return true;
    }

    return false;
  }

  _hlsjsConfig: any;

  hlsPlayer?: Hlsjs

  constructor (source: Source, options: HlsjsDecoderOptions) {
    super(source, options);
    this._hlsjsConfig = options.hlsjsConfig;
  }

  setSource (source: Source) {
    this.source = source;
    this.destroyHlsjs();
    this.setupHlsjs();
  }

  setupHlsjs () {
    const source = this.source;
    var hlsPlayer = new Hlsjs();
    this.hlsPlayer = hlsPlayer;
    hlsPlayer.loadSource(source.src);
    hlsPlayer.attachMedia(this._el);
    // hlsPlayer.on(Hlsjs.Events.MANIFEST_PARSED,() => {
    //   // console.log(123)
    //   this.play();
    // });
  }

  destroyHlsjs () {
    if (this.hlsPlayer) {
      let hlsPlayer = this.hlsPlayer;
      hlsPlayer.detachMedia();
      hlsPlayer.destroy();
      delete this.hlsPlayer;
    }
  }

  destroy () {
    super.destroy.call(this);
    this.destroyHlsjs();
  }
}

interface HlsjsDecoderOptions extends HTML5DecoderOptions {
  htmlAttributes: { [propName: string]: string },
  hlsjsConfig: any
}
export const createHlsjsDecoder = createDecoderFactory<HlsjsDecoderOptions, HlsjsDecoder>(HlsjsDecoder);
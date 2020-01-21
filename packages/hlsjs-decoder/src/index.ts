import {
  createDecoderFactory,
  Source
} from '@popcorn-video/video';

import { HTML5Decoder, HTML5DecoderOptions } from '@popcorn-video/html5-decoder';


export class HlsjsDecoder extends HTML5Decoder {
  static isSupported () {
    return false;
  }
  static isCanPlaySource (source: Source) {
    const type = source.type;
    const supportedTypes = {
      'video/flv': true,
      'video/x-flv': true
    };
    if ((supportedTypes as any)[type]) {
      return true;
    }

    return false;
  }

  _hlsjsConfig: any;

  constructor (source: Source, options: HlsjsDecoderOptions) {
    super(source, options);
    this._hlsjsConfig = options.hlsjsConfig;
  }
}

interface HlsjsDecoderOptions extends HTML5DecoderOptions {
  htmlAttributes: { [propName: string]: string },
  hlsjsConfig: any
}
export const createFlvjsDecoder = createDecoderFactory<HlsjsDecoderOptions, HlsjsDecoder>(HlsjsDecoder);
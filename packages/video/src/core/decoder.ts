import { Source } from '../types';

import {
  EventEmitter,
  Event,
  TypedEventCallback,
  CommonEventConfig
} from './event-emitter';
import { VideoError } from './video-error';
import { ValueOfPlayState } from '../shared/constants';

export abstract class Decoder<EVENTS extends DecoderEvents = DecoderEvents> extends EventEmitter<EVENTS> {
  static isCanPlaySource (source: Source) { return false; }
  static isSupported () { return false; }

  source: Source;

  error: null|VideoError = null;

  constructor (source: Source) {
    super();
    this.source = source;
  }

  abstract state: ValueOfPlayState;

  abstract readyState: number;

  abstract loading: boolean;

  abstract setup (dom: any): void;
  setSource (source: Source) {
    this.source = source;
  };
  abstract play (): Promise<any>;
  abstract pause (): void;
  abstract seek (targetTime: number): void;
  abstract setMute (muted: boolean): void;
  abstract muted: boolean;
  abstract setVolume (volume: number): void;
  abstract volume: number;
  abstract setLoop (loop: boolean): void;
  abstract loop: boolean;
  abstract buffered: number;
  abstract currentTime: number;
  abstract duration: number;
}


export interface DecoderEvents extends CommonEventConfig {
  'abort': TypedEventCallback<Event<null>>, // 在播放被终止时触发,例如, 当播放中的视频重新开始播放时会触发这个事件。
  'canplay': TypedEventCallback<Event<null>>, // 在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发
  'ended': TypedEventCallback<Event<null>>, // 播放结束时触发。
  'error': TypedEventCallback<Event<null>>, // 在发生错误时触发
  'loadeddata': TypedEventCallback<Event<null>>, // 媒体的第一帧已经加载完毕。
  'loadedmetadata': TypedEventCallback<Event<null>>, // 媒体的元数据已经加载完毕，现在所有的属性包含了它们应有的有效信息。
  'loadstart': TypedEventCallback<Event<null>>, // 在媒体开始加载时触发。
  'pause': TypedEventCallback<Event<null>>, // 播放暂停时触发。
  'play': TypedEventCallback<Event<null>>, // 在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体回放。
  'progress': TypedEventCallback<Event<null>>, // 告知媒体相关部分的下载进度时周期性地触发。
  'seeked': TypedEventCallback<Event<null>>, // 在跳跃操作完成时触发。
  'suspend': TypedEventCallback<Event<null>>, // 在媒体资源加载终止时触发，这可能是因为下载已完成或因为其他原因暂停。
  'timeupdate': TypedEventCallback<Event<null>>, // 元素的currentTime属性表示的时间已经改变。
  'volumechange': TypedEventCallback<Event<null>>, // 在音频音量改变时触发（既可以是volume属性改变，也可以是muted属性改变）.。
}

export interface DecoderFactory<T> {
  (source: Source): T,
  isCanPlaySource: (source: Source) => boolean,
  isSupported: () => boolean
}

export function createDecoderFactory<O, T extends Decoder> (CurrentDecoder: any) {
  return function (options: O) {
    let DecoderFactory: any = function (source: any) {
      return new (CurrentDecoder as any)(source, options)
    }

    DecoderFactory.isSupported = () => CurrentDecoder.isSupported.call(CurrentDecoder);
    DecoderFactory.isCanPlaySource = (source: Source) => CurrentDecoder.isCanPlaySource.call(CurrentDecoder, source);

    return DecoderFactory as DecoderFactory<T>;
  }
}
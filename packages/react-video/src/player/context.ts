import { createContext } from 'react';

import { VideoError }  from '@popcorn-video/video'

const videoPlayerContextContent: VideoPlayerContextType = {
  state: 'unready',
  currentTime: 0,
  buffered: 0,
  duration: 0,
  volume: 0,
  muted: true,
  error: null,
  readyState: 0,
  play: () => {},
  pause: () => {},
  seek: () => {},
  setMute: () => {},
  setVolume: () => {},
  refresh: () => {}
};

export type VideoPlayerContextType = {
  state: 'unready'|'ended'|'paused'|'playing',
  currentTime: number,
  buffered: number,
  duration: number,
  volume: number,
  muted: boolean,
  loading?: boolean,
  error: null|VideoError,
  readyState: number,
  play: () => void,
  pause: () => void,
  seek: (targetTime: number) => void,
  setMute: (muted: boolean) => void,
  setVolume: (volume: number) => void,
  refresh: () => void
}

export const VideoPlayerContext = createContext(videoPlayerContextContent);

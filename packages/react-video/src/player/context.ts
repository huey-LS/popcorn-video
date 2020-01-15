import { createContext } from 'react';

const videoPlayerContextContent: {
  state: 'unready'|'ended'|'paused'|'playing',
  currentTime: number,
  buffered: number,
  duration: number,
  volume: number,
  muted: boolean,
  loading?: boolean,
  play: () => void,
  pause: () => void,
  seek: (targetTime: number) => void,
  setMute: (muted: boolean) => void,
  setVolume: (volume: number) => void,
  refresh: () => void
} = {
  state: 'unready',
  currentTime: 0,
  buffered: 0,
  duration: 0,
  volume: 0,
  muted: true,
  play: () => {},
  pause: () => {},
  seek: () => {},
  setMute: () => {},
  setVolume: () => {},
  refresh: () => {}
};

export const VideoPlayerContext = createContext(videoPlayerContextContent);

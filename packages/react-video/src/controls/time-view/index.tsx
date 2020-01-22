import * as React from 'react';
import { loadStyleLazy } from '../../shared/load-style';
import { VideoPlayerContext } from '../../player/context';

const {
  useContext
} = React;

export function CurrentTimeView () {
  const playerContext = useContext(VideoPlayerContext);
  return (
    <div
      className="popcorn-video-time-view"
    >{formatTime(playerContext.currentTime)}</div>
  )
}

export function DurationView () {
  const playerContext = useContext(VideoPlayerContext);
  return (
    <div
      className="popcorn-video-time-view"
    >{formatTime(playerContext.duration)}</div>
  )
}

function formatTime (second: number) {
  let showMinute:string|number = Math.floor(second / 60);
  if(showMinute < 10) showMinute = '0' + showMinute;
  let showSecond:string|number = Math.round(second % 60);
  if(showSecond < 10) showSecond = '0' + showSecond;
  return `${showMinute}:${showSecond}`;
}

loadStyleLazy(`
.popcorn-video-time-view {
  color: #fff;
  font-size: 12px;
}
`);


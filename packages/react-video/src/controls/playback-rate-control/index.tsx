import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';
import { VolumeIcon } from '../../icons/volume';
import { VolumeMutedIcon } from '../../icons/volume-muted';

export function PlaybackRateControl ({
  className = '',
  options = []
}: {
  className?: string,
  options: { value: number, text: string }[]
}) {
  const playerContext = useContext(VideoPlayerContext);
  const playbackRate = playerContext.playbackRate;

  return (
    <div
      className={['popcorn-playback-rate-control', className].join(' ')}
    >
      <span
        className="popcorn-playback-rate-control-shower"
      >
        {playbackRate}x
      </span>
      <div
        className="popcorn-playback-rate-control-plane"
      >
        {
          options.map(({ value, text }) => (
            <div
              key={value}
              className="popcorn-playback-rate-control-option"
              onClick={() => {
                playerContext.setPlaybackRate(value);
              }}
            >{text}</div>
          ))
        }
      </div>
    </div>
  )
}
loadStyleLazy(`
.popcorn-playback-rate-control {
  margin: 0 10px;
  position: relative;
  font-size: 12px;
}

.popcorn-playback-rate-control-shower {
  display: block;
  min-width: 2em;
  padding: 4px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}

.popcorn-playback-rate-control-plane {
  display: none;
  position: absolute;
  left: -20%;
  bottom: 100%;
  width: 140%;
  background: #fff;
}
.popcorn-playback-rate-control:hover .popcorn-playback-rate-control-plane {
  display: block;
}
.popcorn-playback-rate-control-option {
  color: #000;
  padding: 4px;
  text-align: center;
  cursor: pointer;
}
.popcorn-playback-rate-control-option:hover {
  background: #efefef;
}
`);

import React, {
  useContext
} from 'react';

import { VideoPlayerContext } from '../../player/context';

import { PlayIcon } from '../../icons/play';
import { PauseIcon } from '../../icons/pause';
import { RestartIcon } from '../../icons/restart';

export function PlayButton () {
  const playerContext = useContext(VideoPlayerContext);

  return (
    <div
      style={{
        margin: 10
      }}
    >
      {
        playerContext.state === 'playing' ? (
          <span
            onClick={() => playerContext.pause()}
          >
            <PauseIcon
              color='#fff'
            />
          </span>
        ) : playerContext.state === 'ended' ? (
          <span
            onClick={() => {
              playerContext.seek(0);
              playerContext.play();
            }}
          >
            <RestartIcon
              color='#fff'
            />
          </span>
        ) : (
          <span
            onClick={() => playerContext.play()}
          >
            <PlayIcon
              color='#fff'
            />
          </span>
        )
      }
    </div>
  )
}

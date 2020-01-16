import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';
import { PlayIcon } from '../../icons/play';
import { PauseIcon } from '../../icons/pause';
import { RestartIcon } from '../../icons/restart';

const {
  useContext
} = React;

export function PlayButton (props: {
  noRestart?: boolean
}) {
  const playerContext = useContext(VideoPlayerContext);
  const { noRestart } = props;

  return (
    <div
      className="popcorn-video-play-button"
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
        ) : playerContext.state === 'ended' && !noRestart ? (
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
loadStyleLazy(`
.popcorn-video-play-button {
  margin: 10px;
}
`);

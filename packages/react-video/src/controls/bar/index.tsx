import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';

const {
  useContext
} = React;

export function Bar ({
  force = false,
  children
}: {
  force?: boolean,
  children: any
}) {
  const playerContext = useContext(VideoPlayerContext);
  const showing = force || (
    playerContext.state !== 'playing'
  );

  return (
    <div
      className={ "popcorn-video-bar" + (showing ? ' popcorn-video-bar-showing' : '')}
    >
      {children}
    </div>
  )
}

loadStyleLazy(`
.popcorn-video-bar {
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: opacity 200ms linear;
  background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(0,0,0,0.16) 100%);
}
.popcorn-video-bar-showing {
  opacity: 1;
}

.popcorn-video:hover .popcorn-video-bar {
  opacity: 1;
}
`);

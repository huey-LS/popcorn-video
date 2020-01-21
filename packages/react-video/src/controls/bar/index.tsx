import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';

const {
  useContext
} = React;

export function Bar ({
  forceShow = false,
  showOnNotPlaying = true,
  hideBeforeReady = true,
  children
}: {
  forceShow?: boolean,
  hideBeforeReady?: boolean,
  showOnNotPlaying?: boolean,
  children: any
}) {
  const playerContext = useContext(VideoPlayerContext);

  const forceHideBeforeReady = hideBeforeReady && (
    playerContext.readyState === 0
  );

  const forceShowOnNotPlaying = showOnNotPlaying && (
    playerContext.state !== 'playing'
  )

  const forceClassName = forceShow
    ? ' popcorn-video-bar-showing'
    : forceHideBeforeReady
    ? ' popcorn-video-bar-hiding'
    : forceShowOnNotPlaying
    ? ' popcorn-video-bar-showing'
    : '';

  return (
    <div
      className={ "popcorn-video-bar" + forceClassName}
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
.popcorn-video-bar-hiding {
  opacity: 0;
}

.popcorn-video:hover .popcorn-video-bar {
  opacity: 1;
}
.popcorn-video-bar-hiding:hover .popcorn-video-bar {
  opacity: 0;
}
`);

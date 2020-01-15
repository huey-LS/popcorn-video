import React, {
  useContext
} from 'react';

import { VideoPlayerContext } from '../../player/context';


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
      style={{
        display: showing ? 'flex' : 'none',
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0
      }}
    >
      {children}
    </div>
  )
}

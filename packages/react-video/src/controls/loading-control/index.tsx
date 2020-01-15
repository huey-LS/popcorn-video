import React, {
  useContext
} from 'react';

import { VideoPlayerContext } from '../../player/context';

import { LoadingIcon } from '../../icons/loading';

export function LoadingControl () {
  const playerContext = useContext(VideoPlayerContext);

  const showing = playerContext.loading;

  return (
    <div
      style={{
        display: showing ? 'flex' : 'none',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <LoadingIcon
        size={30}
        color='#fff'
      />
    </div>
  )
}

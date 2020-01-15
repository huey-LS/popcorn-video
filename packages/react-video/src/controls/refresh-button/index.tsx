import React, {
  useContext
} from 'react';

import { VideoPlayerContext } from '../../player/context';

import { RefreshIcon } from '../../icons/refresh';

export function RefreshButton () {
  const playerContext = useContext(VideoPlayerContext);

  return (
    <div
      style={{
        margin: 10
      }}
    >
      <span
        onClick={() => playerContext.refresh()}
      >
        <RefreshIcon
          color='#fff'
        />
      </span>
    </div>
  )
}

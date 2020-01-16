import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';
import { RefreshIcon } from '../../icons/refresh';

const {
  useContext
} = React;

export function RefreshButton () {
  const playerContext = useContext(VideoPlayerContext);

  return (
    <div
      className="popcorn-video-refresh-button"
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
loadStyleLazy(`
.popcorn-video-refresh-button {
  margin: 10px;
}
`);

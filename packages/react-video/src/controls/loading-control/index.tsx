import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';
import { LoadingIcon } from '../../icons/loading';

const {
  useContext
} = React;

export function LoadingControl (props: {
  size?: number,
  color?: string
}) {
  const playerContext = useContext(VideoPlayerContext);

  const showing = playerContext.loading;
  const size = props.size || 30;
  const color = props.color || '#fff';

  return (
    <div
      className="popcorn-video-loading-control"
      style={{
        display: showing ? 'flex' : 'none'
      }}
    >
      <LoadingIcon
        size={size}
        color={color}
      />
    </div>
  )
}
loadStyleLazy(`
.popcorn-video-loading-control {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  align-items: center;
  justify-content: center;
}
`);

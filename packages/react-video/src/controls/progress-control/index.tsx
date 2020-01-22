import * as React from 'react';
import { loadStyleLazy } from '../../shared/load-style';
import { VideoPlayerContext } from '../../player/context';

const {
  useContext
} = React;

export function ProgressControl () {
  const playerContext = useContext(VideoPlayerContext);
  let percent = 100 * playerContext.currentTime / playerContext.duration;
  if (!playerContext.currentTime) percent = 0;
  return (
    <div
      className="popcorn-video-progress-control"
    >
      <div
        className="popcorn-video-progress-control-max"
      >
        <div
          className="popcorn-video-progress-control-current"
          style={{ width: percent + '%' }}
        >
        </div>
      </div>
    </div>
  )
}


loadStyleLazy(`
.popcorn-video-progress-control {
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.popcorn-video-progress-control-max {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #fff;
}
.popcorn-video-progress-control-current {
  height: 100%;
  border-radius: 2px;
  background: #9ac600;
}
`);


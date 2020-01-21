import * as React from 'react';

import { VideoPlayerContext, VideoPlayerContextType } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';

const {
  useContext
} = React;

export function EndedView (props: {
  className?: string,
  style?: any,
  content?: (playerContext: VideoPlayerContextType) => any
}) {
  const { className, style, content } = props;
  const playerContext = useContext(VideoPlayerContext);
  const state = playerContext.state;
  const isEnded = state === 'ended';


  return (
    <div
      className={"popcorn-video-ended-view " + (className || '')}
      style={{
        display: isEnded ? 'flex' : 'none',
        ...style
      }}
    >
      {
        content && (
          content(playerContext)
        )
      }
    </div>
  )
}
loadStyleLazy(`
.popcorn-video-ended-view {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #000;
}
`);

import * as React from 'react';
import { VideoError } from '@popcorn-video/video';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';

const {
  useContext
} = React;

export function ErrorView (props: {
  className?: string,
  style?: any,
  content?: (error: VideoError) => any
}) {
  const playerContext = useContext(VideoPlayerContext);

  const error = playerContext.error;

  const { className, style, content } = props;

  return (
    <div
      className={"popcorn-video-error-view " + (className || '')}
      style={{
        display: error ? 'flex' : 'none',
        ...style
      }}
    >
      {
        error && (
          content ? (
            content(error)
          ): (
            error.message
          )
        )
      }
    </div>
  )
}
loadStyleLazy(`
.popcorn-video-error-view {
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

import * as React from 'react';
import { loadStyleLazy } from '../../shared/load-style';

export function SpaceControl () {
  return (
    <div
      className="popcorn-video-space-control"
    ></div>
  )
}

loadStyleLazy(`
.popcorn-video-space-control {
  flex: 1
}
`);


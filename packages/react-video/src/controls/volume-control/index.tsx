import React, {
  useContext
} from 'react';

import { VideoPlayerContext } from '../../player/context';

import { VolumeIcon } from '../../icons/volume';
import { VolumeMutedIcon } from '../../icons/volume-muted';

export function VolumeControl () {
  const playerContext = useContext(VideoPlayerContext);
  const muted = playerContext.muted;

  return (
    <div
      style={{
        margin: 10
      }}
    >
      <span
        onClick={() => playerContext.setMute(!playerContext.muted)}
      >
        {
          muted ? (
            <VolumeMutedIcon
              color="#fff"
            />
          ): (
            <VolumeIcon
              color="#fff"
            />
          )
        }
      </span>
    </div>
  )
}

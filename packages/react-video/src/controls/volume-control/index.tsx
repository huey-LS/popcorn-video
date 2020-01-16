import * as React from 'react';

import { VideoPlayerContext } from '../../player/context';
import { loadStyleLazy } from '../../shared/load-style';
import { VolumeIcon } from '../../icons/volume';
import { VolumeMutedIcon } from '../../icons/volume-muted';

const {
  useContext,
  useEffect,
  useState,
  useRef,
} = React;

export function VolumeControl () {
  const playerContext = useContext(VideoPlayerContext);
  const muted = playerContext.muted;
  const volume = playerContext.volume;

  const changingRef = useRef<React.MouseEvent|null>(null);
  const maxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let listenedParent = document;
    let moveListener = (event: MouseEvent) => {
      if (changingRef.current && maxRef.current) {
        let maxRect = maxRef.current.getBoundingClientRect();
        let newVolume = Math.min(
          1,
          Math.max(
            0,
            1 - ((event.clientY - maxRect.top) / maxRect.height)
          )
        );
        playerContext.setVolume(newVolume);
      }
    }

    let upListener = (event: MouseEvent) => {
      if (changingRef.current) {
        changingRef.current = null;
      }
    }

    listenedParent.addEventListener(
      'mousemove',
      moveListener,
      false
    );

    listenedParent.addEventListener(
      'mouseup',
      upListener,
      false
    );
    return () => {
      listenedParent.removeEventListener('mousemove', moveListener);
      listenedParent.removeEventListener('mousemove', upListener);
    }
  })

  return (
    <div
      className="popcorn-video-volume-control"
    >
      <span
        className="popcorn-video-volume-control-muted-button"
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
      <div className="popcorn-video-volume-control-plane">
        <div
          className="popcorn-video-volume-control-max"
          ref={maxRef}
        >
          <div
            className="popcorn-video-volume-control-current"
            style={{ height: (volume * 100) + '%' }}
          ></div>
          <div
            className="popcorn-video-volume-control-change-button"
            style={{ bottom: (volume * 100) + '%' }}
            onMouseDown={(event) => {
              changingRef.current = event;
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
loadStyleLazy(`
.popcorn-video-volume-control {
  margin: 10px;
  position: relative;
}

.popcorn-video-volume-control-muted-button {
  cursor: pointer;
}

.popcorn-video-volume-control-plane {
  display: none;
  position: absolute;
  left: -20%;
  bottom: 100%;
  width: 140%;
  height: 100px;
  background: #fff;
}

.popcorn-video-volume-control-max {
  position: absolute;
  left: 50%;
  top: 10%;
  width: 4px;
  height: 80%;
  margin-left: -2px;
  border-radius: 2px;
  background: #ccc;
  overflow: visible;
}
.popcorn-video-volume-control-current {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 2px;
  background: #9ac600;
}

.popcorn-video-volume-control-change-button {
  position: absolute;
  left: -3px;
  width: 10px;
  height: 10px;
  margin-bottom: -5px;
  border-radius: 100%;
  background: #fff;
  box-shadow: 0 0 5px #ccc;
  cursor: pointer;
}

.popcorn-video-volume-control:hover .popcorn-video-volume-control-plane {
  display: block;
}
`);

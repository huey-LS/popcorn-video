import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  constants as PlayerConstants
} from '@popcorn-video/video';

import { loadStyleLazy } from '../../shared/load-style';
import { VideoPlayerContext } from '../../player/context';

export function ProgressControl ({
  className = '',
  progressBarClassName = ''
}: {
  className?: string,
  progressBarClassName?: string
}) {
  const changingRef = useRef<React.MouseEvent|null>(null);
  const playStateBeforeDragRef = useRef('');
  const durationRef =  useRef(0);
  const maxRef = useRef<HTMLDivElement>(null);
  const playerContext = useContext(VideoPlayerContext);
  const changingProgressRef = useRef<number>(0);
  const [changingPercent, setChangingPercent] = useState(0);
  let percent = 100 * playerContext.currentTime / playerContext.duration;
  if (!playerContext.currentTime) percent = 0;
  const currentChangingPercent = changingRef.current ? changingPercent : percent;
  durationRef.current = playerContext.duration;

  const seekByClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (maxRef.current) {
      let maxRect = maxRef.current.getBoundingClientRect();
      let targetProgress = Math.min(
        1,
        Math.max(
          0,
          (event.clientX - maxRect.left) / maxRect.width
        )
      );

      playerContext.seek(
        targetProgress * durationRef.current
      )
    }
  }

  const startDragPercent = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    changingRef.current = event;
    setChangingPercent(percent);
    playStateBeforeDragRef.current = playerContext.state;
    playerContext.pause();
  }

  useEffect(() => {
    let listenedParent = document;
    let moveListener = (event: MouseEvent) => {
      if (changingRef.current && maxRef.current) {
        let maxRect = maxRef.current.getBoundingClientRect();
        let targetProgress = Math.min(
          1,
          Math.max(
            0,
            (event.clientX - maxRect.left) / maxRect.width
          )
        );
        changingProgressRef.current = targetProgress;
        setChangingPercent(
          targetProgress * 100
        );
      }
    }

    let upListener = (event: MouseEvent) => {
      if (changingRef.current) {
        changingRef.current = null;
        playerContext.seek(
          changingProgressRef.current * durationRef.current
        );
        if (playStateBeforeDragRef.current === PlayerConstants.PLAY_STATE.PLAYING) {
          playerContext.play();
        }
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
      listenedParent.removeEventListener('mouseup', upListener);
      listenedParent.removeEventListener('mouseout', upListener);
    }
  }, []);

  return (
    <div
      className={['popcorn-video-progress-control', className].join(' ')}
    >
      <div
        className="popcorn-video-progress-control-max"
        ref={maxRef}
        onClick={seekByClick}
      >
        <div
          className={['popcorn-video-progress-control-current', progressBarClassName].join(' ')}
          style={{ width: percent + '%' }}
        >
        </div>
        <div
          className={
            "popcorn-video-progress-control-change-button" + (
              changingRef.current ? ' popcorn-video-progress-control-change-button-grabbing' : ''
            )
          }
          style={{ left: currentChangingPercent + '%' }}
          onMouseDown={startDragPercent}
        ></div>
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
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
}
.popcorn-video-progress-control-current {
  height: 100%;
  border-radius: 2px;
  background: #9ac600;
}
.popcorn-video-progress-control-change-button {
  position: absolute;
  top: -3px;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 100%;
  background: #fff;
  box-shadow: 0 0 5px #ccc;
  cursor: pointer;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  cursor: grab;
}
.popcorn-video-progress-control-change-button-grabbing {
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
`);


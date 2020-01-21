import React from 'react';
import ReactDom from 'react-dom';
import { createHTML5Decoder } from '@popcorn-video/html5-decoder';
import { createFlvjsDecoder } from '@popcorn-video/flvjs-decoder';

import { VideoPlayer, Controls } from '../src';


function App () {
  return (
    <div style={{width: 480, height: 270 }}>
      <VideoPlayer
        autoplay={true}
        decoders={
          [
            createFlvjsDecoder({
              htmlAttributes: {
                'autoplay': 'autoplay',
                'preload': 'auto'
              },
              flvjsConfig: {
                isLive: true,
                hasAudio: true,
                hasVideo: true
              }
            }),
            createHTML5Decoder({
              htmlAttributes: {
                'autoplay': 'autoplay',
                'preload': 'auto'
              }
            })
          ]
        }
        sources={[
          {
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "video/mp4"
          }
        ]}
      >
        <Controls.LoadingControl />
        <Controls.Bar>
          <Controls.PlayButton noRestart={true} />
          <Controls.RefreshButton />
          <Controls.SpaceControl />
          <Controls.VolumeControl />
        </Controls.Bar>
      </VideoPlayer>
    </div>
  )
}

ReactDom.render(
  <App />, document.getElementById('application')
);

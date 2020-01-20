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
              htmlAttributes: {'abc':'abc'},
              flvjsConfig: {
                isLive: true,
                hasAudio: true,
                hasVideo: true
              },
              autoplay: true
            }),
            createHTML5Decoder({
              htmlAttributes: {'abc':'abc'},
              autoplay: true
            })
          ]
        }
        sources={[
          {
            src: 'http://flv8bcb80ef.live.126.net/live/7e1d4d7b21fb4d5c8bac0881ca55e325.flv?netease=flv8bcb80ef.live.126.net',
            type: 'video/x-flv'
          },
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

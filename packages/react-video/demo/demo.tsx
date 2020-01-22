import React from 'react';
import ReactDom from 'react-dom';
import { createHTML5Decoder } from '@popcorn-video/html5-decoder';
import { createFlvjsDecoder } from '@popcorn-video/flvjs-decoder';
import { createHlsjsDecoder } from '@popcorn-video/hlsjs-decoder';

import { VideoPlayer, Controls } from '../src';


function App () {
  return (
    <div style={{width: 480, height: 270 }}>
      <VideoPlayer
        autoplay={true}
        decoders={
          [
            createHTML5Decoder({
              htmlAttributes: {
                'autoplay': 'autoplay',
                'preload': 'auto'
              }
            }),
            createHlsjsDecoder({
              htmlAttributes: {
                'autoplay': 'autoplay',
                'preload': 'auto'
              },
              hlsjsConfig: {}
            }),
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
            })
          ]
        }
        sources={[
          {
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "video/mp4"
          },
          {
            src: "https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8",
            type: "application/x-mpegURL"
          }
        ]}
      >
        <Controls.LoadingControl />
        <Controls.Bar>
          <Controls.PlayButton noRestart={true} />
          <Controls.RefreshButton />
          <Controls.SpaceControl />
          <Controls.ProgressControl />
          <div style={{
            width: 70,
            color: '#fff',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 12
          }}>
            <Controls.CurrentTimeView />
            <span>/</span>
            <Controls.DurationView />
          </div>
          <Controls.VolumeControl />
        </Controls.Bar>
        <Controls.ErrorView />
        <Controls.EndedView
          content={() => '播放结束啦'}
        />
      </VideoPlayer>
    </div>
  )
}

ReactDom.render(
  <App />, document.getElementById('application')
);

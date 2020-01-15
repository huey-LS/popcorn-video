```js
import { Player, createHTML5Decoder } from '@popcorn-video/video';

new Player({
  decoders: [
    createHTML5Decoder({
      htmlAttributes: {'xx':'xx'}
    })
  ],
  sources: [{
    src: 'xxx.mp4',
    type: 'video/mp4'
  }]
})
```
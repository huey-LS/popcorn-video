import * as React from 'react';

import { loadStyle } from '../shared/load-style';
export function LoadingIcon ({
  color = '#000',
  size = 20
}: {
  color?: string,
  size?: number
} = {}) {
  return (
    <svg
      style={{
        animation: 'popcorn-react-video-spin 800ms infinite linear'
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path fill="none" d="M0 0h24v24H0z"/>
      <path
        fill={color}
        d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
      />
    </svg>
  )
}

/**
 * @keyframes spin {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
 */
loadStyle(`
@keyframes popcorn-react-video-spin {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
`);
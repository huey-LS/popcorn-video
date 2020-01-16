import * as React from 'react';

export function PauseIcon ({
  color = '#000',
  size = 20
}: {
  color?: string,
  size?: number
} = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
        <path
          fill="none"
          d="M0 0h24v24H0z"
        />
        <path
          fill={color}
          d="M6 5h2v14H6V5zm10 0h2v14h-2V5z"
        />
    </svg>
  )
}
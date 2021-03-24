export const PLAY_STATE = {
  ENDED: 'ended' as const,
  PAUSED: 'paused' as const,
  PLAYING: 'playing' as const,
  UNREADY: 'unready' as const,
}

type ValueOf<T> = T[keyof T];
export type ValueOfPlayState = ValueOf<typeof PLAY_STATE>;

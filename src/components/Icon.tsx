import type { CSSProperties } from 'react'

export type IconName =
  | 'play'
  | 'pause'
  | 'plus'
  | 'minus'
  | 'font'
  | 'rewind'
  | 'forward'
  | 'top'
  | 'bottom'
  | 'mirror'
  | 'rotate'
  | 'settings'
  | 'close'
  | 'back'
  | 'list'
  | 'trash'
  | 'copy'
  | 'edit'
  | 'plusCircle'
  | 'sliders'
  | 'preset'
  | 'target'
  | 'archive'
  | 'restore'
  | 'chevron'
  | 'more'
  | 'link'

const PATHS: Record<IconName, string> = {
  play: 'M8 5v14l11-7z',
  pause: 'M7 5h4v14H7zM13 5h4v14h-4z',
  plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z',
  minus: 'M5 11h14v2H5z',
  font: 'M5 19l5.5-14h3L19 19h-2.2l-1.5-4H8.7l-1.5 4zm4.4-6h5.2L12 6.3z',
  rewind: 'M11 12l8-6v12zM4 12l7-6v12z',
  forward: 'M13 12L5 6v12zM20 12l-7-6v12z',
  top: 'M6 5h12v2H6zM12 9l6 7h-4v4h-4v-4H6z',
  bottom: 'M12 19l-6-7h4V8h4v4h4zM6 5h12v0z',
  mirror: 'M12 3v18M8 7l-4 5 4 5zM16 7l4 5-4 5z',
  rotate: 'M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z',
  settings:
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.4 4l1.5-1.2-1.5-2.6-1.9.6a6.9 6.9 0 0 0-1-.6l-.3-2h-3l-.3 2c-.35.16-.68.36-1 .6l-1.9-.6-1.5 2.6L8.5 12l-1.5 1.2 1.5 2.6 1.9-.6c.32.24.65.44 1 .6l.3 2h3l.3-2c.35-.16.68-.36 1-.6l1.9.6 1.5-2.6z',
  close: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
  list: 'M4 6h16M4 12h16M4 18h16',
  trash: 'M6 7h12l-1 13H7zM9 7V4h6v3',
  copy: 'M8 8h11v12H8zM5 4h10v2H7v10H5z',
  edit: 'M4 20h4L18 10l-4-4L4 16zM15 5l4 4',
  plusCircle: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm1 8h4v2h-4v4h-2v-4H7v-2h4V7h2z',
  sliders: 'M4 8h10M18 8h2M4 16h2M10 16h10M14 6v4M6 14v4',
  preset: 'M4 5h16v4H4zM4 11h16v8H4zm3 3v2M11 14v2',
  target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  archive: 'M4 5h16v3H4z M6 8v11h12V8 M9 12h6',
  restore: 'M4 12h16v7H4z M12 9V3 M9 6l3-3 3 3',
  chevron: 'M9 6l6 6-6 6',
  more: 'M6 12a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zm7.6 0a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zm7.6 0a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z',
  link: 'M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 6 6l-1 1M13.5 17.5l-1 1a4 4 0 0 1-6-6l1-1',
}

const STROKE: Partial<Record<IconName, boolean>> = {
  mirror: true,
  close: true,
  back: true,
  list: true,
  edit: true,
  sliders: true,
  archive: true,
  restore: true,
  chevron: true,
  link: true,
}

interface IconProps {
  name: IconName
  size?: number
  style?: CSSProperties
}

export function Icon({ name, size = 22, style }: IconProps) {
  const stroke = STROKE[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={stroke ? 'none' : 'currentColor'}
      stroke={stroke ? 'currentColor' : 'none'}
      strokeWidth={stroke ? 2 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

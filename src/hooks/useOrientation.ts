import { useEffect, useState } from 'react'

export interface ViewportInfo {
  width: number
  height: number
  isLandscape: boolean
  isPortrait: boolean
}

function read(): ViewportInfo {
  const width = window.innerWidth
  const height = window.innerHeight
  return { width, height, isLandscape: width >= height, isPortrait: width < height }
}

/** Live viewport size + orientation, updated on resize / orientation change. */
export function useOrientation(): ViewportInfo {
  const [info, setInfo] = useState<ViewportInfo>(() =>
    typeof window === 'undefined'
      ? { width: 0, height: 0, isLandscape: true, isPortrait: false }
      : read(),
  )

  useEffect(() => {
    const update = () => setInfo(read())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return info
}

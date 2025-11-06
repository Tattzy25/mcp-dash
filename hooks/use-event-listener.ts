'use client'

import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Element | Window | Document,
): void {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && 'addEventListener' in element
    if (!isSupported) return

    const eventListener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[K])
    }

    element.addEventListener(eventName, eventListener)
    return () => element.removeEventListener(eventName, eventListener)
  }, [eventName, element])
}

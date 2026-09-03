import { useRef, useEffect } from 'react'

export function useMagneticCursor() {}

export function useMagneticButton() {
  const ref = useRef<HTMLButtonElement>(null)
  // Empty effect keeps hook count identical to the original implementation,
  // preventing React from throwing "rendered fewer hooks" during HMR updates.
  useEffect(() => {}, [])
  return ref
}

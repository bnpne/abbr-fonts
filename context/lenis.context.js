'use client'

import { ReactLenis as Lenis } from 'lenis/react'

export function LenisProvider({ children }) {
  return (
    <Lenis root>
      <main>{children}</main>
    </Lenis>
  )
}

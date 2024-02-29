'use client'

import StoreModal from 'fontdue-js/StoreModal'
import {useEffect, useRef} from 'react'
import {useStore} from 'libs/store'

export function StoreModalContainer() {
  const modal = useRef()
  const n = useStore()

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      const t = mutations[0]?.target
      if (t) {
        if (t.children.length > 0) {
          if (n.isNavOpened === false) {
            n.setIsNavOpened(false)
          }
        }
      }
    })
    if (modal.current) {
      observer.observe(modal.current, {
        childList: true,
        subtree: true,
      })

      return () => {
        observer.disconnect()
      }
    }
  }, [n])

  return (
    <div ref={modal} data-lenis-prevent>
      <StoreModal />
    </div>
  )
}

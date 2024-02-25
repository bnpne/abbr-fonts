'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

export default function ActiveLink({
  className: classNameProp,
  active: activeProp = true,
  children,
  ...props
}) {
  const path = usePathname()
  const active = activeProp && path === props.href.replace(/\?.+/, '')
  const className = `${classNameProp || ''} ${active ? 'active' : ''}`
  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  )
}

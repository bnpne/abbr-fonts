'use client'

import cn from 'clsx'

export function PageLayout({children, className}) {
  return <div className={cn('page', className)}>{children}</div>
}

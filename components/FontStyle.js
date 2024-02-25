'use client'

import React from 'react'
import useFontStyle from 'fontdue-js/useFontStyle'
export default function FontStyle({
  familyName,
  styleName,
  style: styleProp,
  children,
  ...rest
}) {
  const {style} = useFontStyle({
    fontFamily: `${familyName} ${styleName}`,
    fontWeight: '400',
    fontStyle: 'normal',
  })

  return (
    <span style={{...style, ...styleProp}} {...rest}>
      {children}
    </span>
  )
}

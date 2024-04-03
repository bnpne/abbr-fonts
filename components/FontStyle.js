'use client'

import React, {useRef} from 'react'
import useFontStyle from 'fontdue-js/useFontStyle'
export default function FontStyle({
  familyName,
  styleName,
  style: styleProp,
  children,
  ...rest
}) {
  const anima = useRef()

  const {style} = useFontStyle({
    fontFamily: `${familyName} ${styleName}`,
    fontWeight: '400',
    fontStyle: 'normal',
  })
  return (
    <span ref={anima} style={{...style, ...styleProp}} {...rest}>
      {children}
    </span>
  )
}

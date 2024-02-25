'use client'
import ReactDOM from 'react-dom'
const createFontFaceStyle = ({cssFamily, name, webfontSources}) => {
  const source = webfontSources?.find(source => source?.format === 'woff2')
  if (!source) return ''

  return `
    @font-face {
      font-family: "${cssFamily} ${name}";
      src: url(${source.url}) format(${source.format});
      font-weight: 400;
      font-style: normal;
    }
  `
}

export default function PreloadWebfonts({style}) {
  if (!style) return null
  const source = style.webfontSources?.find(
    source => source?.format === 'woff2',
  )
  if (source?.url) {
    ReactDOM.preload(source.url, {as: 'font'})
  }
  return (
    <style
      type="text/css"
      dangerouslySetInnerHTML={{
        __html: createFontFaceStyle(style),
      }}
    />
  )
}

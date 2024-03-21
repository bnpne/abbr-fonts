'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TypeTesters from 'fontdue-js/TypeTesters'
import CharacterViewer from 'fontdue-js/CharacterViewer'
import BuyButton from 'fontdue-js/BuyButton'
import FontStyle from './FontStyle'
import Carousel from './Carousel'
import FontdueHTML from './FontdueHTML'
import {notEmpty} from 'libs/graphql/utils'
import TextAnima from './TextAnima'
import {useGSAP} from '@gsap/react'
import {useRef} from 'react'
import gsap from 'gsap'
import {useDeviceDetection} from 'context/device-detection.context'

function instanceCSS(instance) {
  const settings = instance.coordinates.map(
    coordinate => `'${coordinate.axis}' ${coordinate.value}`,
  )

  return {
    fontVariationSettings: settings.join(', '),
  }
}

function showBuyButton(collection) {
  if (collection.sku) return true

  const hasFontStylesSKU = collection.fontStyles?.some(
    style => style.sku !== null,
  )
  if (hasFontStylesSKU) return true

  const hasBundlesSKU = collection.bundles?.some(bundle => bundle.sku !== null)
  if (hasBundlesSKU) return true

  if ('children' in collection) {
    const hasChildrenSKU = collection.children?.some(child =>
      showBuyButton(child),
    )
    if (hasChildrenSKU) return true
  }

  return false
}
function groupVariableInstances(fontInstances) {
  if (!fontInstances) return
  const groupedFontInstances = {}

  if (fontInstances.length < 2) {
    return Object.values(groupedFontInstances)
  }

  // Determine the varying axis by comparing first two instances
  const varyingAxis = fontInstances[0].coordinates.find((coordinate, index) => {
    return coordinate.value !== fontInstances[1].coordinates[index].value
  })?.axis

  for (const fontInstance of fontInstances) {
    // Exclude varying axis from grouping
    const sortedCoordinates = fontInstance.coordinates
      .filter(coord => coord.axis !== varyingAxis)
      .sort((a, b) => a.axis.localeCompare(b.axis))

    // Create a string key by concatenating axis and value pairs
    const key = sortedCoordinates
      .map(coord => `${coord.axis}:${coord.value}`)
      .join(',')

    // If the key is not in the dictionary, create a new array
    if (!(key in groupedFontInstances)) {
      groupedFontInstances[key] = []
    }

    // Add the font instance to the group
    groupedFontInstances[key].push(fontInstance)
  }

  return Object.values(groupedFontInstances)
}

function familyStylesGrouped(fontStyles) {
  if (!fontStyles) return null
  const groups = fontStyles.filter(notEmpty).reduce((groups, style) => {
    const key = `${style.cssFamily}-${style.cssWeight}`

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(style)

    return groups
  }, {})
  return Object.values(groups)
}

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items)
  config = config || {}
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: {ease: 'none'},
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')))
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          gsap.getProperty(el, 'xPercent'),
      )
      return xPercents[i]
    },
  })
  gsap.set(items, {x: 0})
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], 'scaleX') +
    (parseFloat(config.paddingRight) || 0)
  for (i = 0; i < length; i++) {
    item = items[i]
    curX = (xPercents[i] / 100) * widths[i]
    distanceToStart = item.offsetLeft + curX - startX
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add('label' + i, distanceToStart / pixelsPerSecond)
    times[i] = distanceToStart / pixelsPerSecond
  }
  function toIndex(index, vars) {
    vars = vars || {}
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length) // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex]
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())}
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }
  tl.next = vars => toIndex(curIndex + 1, vars)
  tl.previous = vars => toIndex(curIndex - 1, vars)
  tl.current = () => curIndex
  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.times = times
  tl.progress(1, true).progress(0, true) // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete()
    tl.reverse()
  }
  return tl
}

function CollectionStyles({collection, isSubfamily}) {
  const collectionStyle = useRef()
  const {isMobile} = useDeviceDetection()

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray('.cs')
      horizontalLoop(boxes, {
        paused: false,
        repeat: -1,
        duration: isMobile ? 25 : 15,
      })
        .totalProgress(0.1)
        .timeScale(0.5)

      gsap.set(boxes, {x: '50%'})

      // gsap.set(, {x: '100%'})
      // gsap.to(collectionStyle.current, {
      //   x: '-100%',
      //   repeat: -1,
      //   duration: 15,
      //   ease: 'linear',
      // })
    },
    {dependencies: [collectionStyle], scope: collectionStyle},
  )
  return (
    <div className="collection-styles" ref={collectionStyle}>
      <div className="cs">
        {isSubfamily && (
          <h3 className="collection-styles__label">{collection.name}</h3>
        )}

        {collection.isVariableFont
          ? collection.fontStyles?.map((style, i) => {
              const groups = groupVariableInstances(style.variableInstances)
              return (
                <FontStyle
                  key={i}
                  familyName={collection.name}
                  styleName={style.name}
                >
                  {groups?.map((group, i) => (
                    <span key={i} className="collection-styles__group">
                      {group?.map((instance, j) => (
                        <span
                          key={j}
                          style={instanceCSS(instance)}
                          className="collection-styles__style"
                        >
                          {'Aa '}
                        </span>
                      ))}
                    </span>
                  ))}
                </FontStyle>
              )
            })
          : familyStylesGrouped(collection.fontStyles)?.map((chunk, i) => (
              <span key={i} className="collection-styles__group">
                {chunk.map((style, j) => (
                  <FontStyle
                    key={j}
                    familyName={collection.name}
                    styleName={style.name}
                    className="collection-styles__style"
                  >
                    {style.name.split(' ')[0]}
                  </FontStyle>
                ))}
              </span>
            ))}
      </div>
      <div className="cs">
        {isSubfamily && (
          <h3 className="collection-styles__label">{collection.name}</h3>
        )}

        {collection.isVariableFont
          ? collection.fontStyles?.map((style, i) => {
              const groups = groupVariableInstances(style.variableInstances)
              return (
                <FontStyle
                  key={i}
                  familyName={collection.name}
                  styleName={style.name}
                >
                  {groups?.map((group, i) => (
                    <span key={i} className="collection-styles__group">
                      {group?.map((instance, j) => (
                        <span
                          key={j}
                          style={instanceCSS(instance)}
                          className="collection-styles__style"
                        >
                          {'Aa '}
                        </span>
                      ))}
                    </span>
                  ))}
                </FontStyle>
              )
            })
          : familyStylesGrouped(collection.fontStyles)?.map((chunk, i) => (
              <span key={i} className="collection-styles__group">
                {chunk.map((style, j) => (
                  <FontStyle
                    key={j}
                    familyName={collection.name}
                    styleName={style.name}
                    className="collection-styles__style"
                  >
                    {style.name.split(' ')[0]}
                  </FontStyle>
                ))}
              </span>
            ))}
      </div>
    </div>
  )
}
function FontDetail({collection}) {
  return (
    <>
      <div className={`collection-info ${collection.collectionType}`}>
        {collection.fontStyles?.length === 1 ? (
          <div className="collection-info__name">
            <FontStyle
              familyName={collection.featureStyle?.cssFamily}
              styleName={collection.featureStyle?.name}
            >
              <h1>
                <TextAnima>{collection.name}</TextAnima>
              </h1>
            </FontStyle>
          </div>
        ) : (
          <div className="collection-info__name">
            <FontStyle
              familyName={collection.featureStyle?.cssFamily}
              styleName={collection.featureStyle?.name}
            >
              <h1>
                <TextAnima>
                  {collection.name}
                  {collection.collectionType === 'superfamily' && ' Collection'}
                </TextAnima>
              </h1>
            </FontStyle>
          </div>
        )}

        {collection.images?.length ? (
          <div className="collection-info__images">
            <TextAnima display={'block'}>
              <Carousel>
                {collection.images.map((image, i) => (
                  <div key={i} className="collection-info__image">
                    {image.meta && image.meta.mimeType === 'video/mp4' ? (
                      <video src={image.url} playsInline muted autoPlay loop />
                    ) : (
                      <Image
                        src={image.url}
                        width={image.meta?.width ?? 1000}
                        height={image.meta?.height ?? 768}
                        alt={image.description ?? ''}
                        priority={i === 0}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            </TextAnima>
          </div>
        ) : null}

        {!collection.tags.includes('Bespoke') && (
          <>
            <div className="collection-info__styles">
              {collection.collectionType === 'family' &&
              !collection.isVariableFont &&
              (collection.fontStyles?.length ?? 0) > 1 ? (
                <CollectionStyles collection={collection} isSubfamily={false} />
              ) : null}
              {collection.collectionType === 'superfamily' &&
                collection.children?.map((child, i) => (
                  <CollectionStyles
                    key={i}
                    collection={child}
                    isSubfamily={true}
                  />
                ))}
            </div>

            <div className="collection-info__buy">
              {showBuyButton(collection) && (
                <BuyButton
                  collectionId={collection.id}
                  collectionName={collection.name}
                />
              )}
              {collection.minisiteLink && (
                <a
                  href={collection.minisiteLink}
                  className="collection-info__minisite-link"
                  target="_blank"
                  rel="noopener"
                >
                  {`${collection.name} Minisite`}
                </a>
              )}
            </div>
          </>
        )}
      </div>

      {!collection.tags.includes('Bespoke') && (
        <>
          <TypeTesters collectionId={collection.id} defaultMode="local" />
        </>
      )}

      <div className="collection-more-info">
        {collection.description ? (
          <div className="collection-more-info__description">
            <FontdueHTML html={collection.description} />
          </div>
        ) : null}
        {collection.pdfs?.length ? (
          <div className="collection-more-info__specimens">
            <h3 className="specimen-more-info__specimens__label">
              {pluralize('PDF Specimen', 'PDFs', collection.pdfs.length)}
            </h3>
            <div className="collection-more-info__specimens__images">
              {collection.pdfs.map((pdf, i) => (
                <Link
                  key={i}
                  href={pdf.url}
                  target="_blank"
                  className="collection-more-info__specimens__link"
                >
                  <div className="collection-more-info__specimens__image">
                    {pdf.thumbnailUrl && <img src={pdf.thumbnailUrl} alt="" />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {!collection.tags.includes('Bespoke') && (
        <>
          <CharacterViewer collectionId={collection.id} />
          <div className="collection-info__buybottom">
            {showBuyButton(collection) && (
              <BuyButton
                collectionId={collection.id}
                collectionName={collection.name}
              />
            )}
            {collection.minisiteLink && (
              <a
                href={collection.minisiteLink}
                className="collection-info__minisite-link"
                target="_blank"
                rel="noopener"
              >
                {`${collection.name} Minisite`}
              </a>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default FontDetail

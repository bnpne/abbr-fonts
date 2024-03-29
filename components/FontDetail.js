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
import TextAnima from './TextAnima'
import PreloadWebfonts from './PreloadWebfonts'

function showBuyButton(collection) {
  if (collection.sku) return true

  const hasFontStylesSKU = collection.fontStyles?.some(
    (style) => style.sku !== null
  )
  if (hasFontStylesSKU) return true

  const hasBundlesSKU = collection.bundles?.some(
    (bundle) => bundle.sku !== null
  )
  if (hasBundlesSKU) return true

  if ('children' in collection) {
    const hasChildrenSKU = collection.children?.some((child) =>
      showBuyButton(child)
    )
    if (hasChildrenSKU) return true
  }

  return false
}

function FontDetail({ collection }) {
  return (
    <>
      <div className={`collection-info ${collection.collectionType}`}>
        {collection.fontStyles?.length === 1 ? (
          <div className="collection-info__name">
            <PreloadWebfonts style={collection.featureStyle} />
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

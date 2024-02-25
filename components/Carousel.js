'use client'
import {useEffect, useState} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination, Autoplay} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export default function Carousel({children}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="carousel" data-loaded={loaded}>
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay
        loop
        pagination={{el: '.carousel-pagination'}}
      >
        {children.map((child, i) => (
          <SwiperSlide key={i}>{child}</SwiperSlide>
        ))}
      </Swiper>

      <div className="carousel-pagination" />
    </div>
  )
}

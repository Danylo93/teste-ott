/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState} from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  
} from './EmblaCarouselArrowButtons'
import Modal from './modal-detail-video';
import useEmblaCarousel from 'embla-carousel-react'
import { Video } from '@/types/video';



type PropType = {
  slides: Video[]
  options?: EmblaOptionsType
  title: String
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, title } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, slidesToScroll: 5 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null); 
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev())
      setNextBtnEnabled(emblaApi.canScrollNext())
    }
    emblaApi.on('select', onSelect)
    onSelect()

    
    
  }, [emblaApi]);

  const handleImageClick = (video: Video) => {
    setSelectedVideo(video); 
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

 

  return (
    <section className="embla">
      <h2 className="text-center text-2xl font-bold mb-4 text-red-800">{title}</h2>
      {prevBtnEnabled && <PrevButton onClick={() => emblaApi?.scrollPrev()} />}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container grid grid-cols-5 gap-4">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <img 
                src={slide.thumbnail} 
                alt={slide.title} 
                className="w-full h-full object-cover cursor-pointer" 
                onClick={() => handleImageClick(slide)}
              />

            </div>
          ))}
        </div>
      </div>
      {nextBtnEnabled && <NextButton onClick={() => emblaApi?.scrollNext()} />}
      {isModalOpen && <Modal onClose={handleCloseModal} isOpen={true} video={selectedVideo} />}
      
      
    </section>
  );
};


export default EmblaCarousel

"use client"

import React, {useEffect, useState}from 'react';


import { Video } from '@/components/modal-add-video';
import EmblaCarousel from '@/components/Carrousel';
import { Header } from '@/components/Header';



export default function Videos() {

  const [videos, setVideos] = useState<Video[]>([]);

  async function buscarVideos() {
    try {
      const resposta = await fetch('http://localhost:3333/videos');
      const videos = await resposta.json();
      return videos;
    } catch (erro) {
      console.error(erro);
      return [];
    }
  }

  useEffect(() => {
    buscarVideos().then(videos => {
      setVideos(videos);
    });
  }, []);

  const videosByCategory: { [category: string]: Video[] } = videos.reduce((groups, video) => {
    video.categories.forEach(category => {
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(video);
    });
    return groups;
  }, {});

  

  return (
    <>
    <Header />
    <main className='relative overflow-y-scroll p-8 pb-20 scrollbar-hide lg:pl-16 '>
      {/* <Banner movie={featuredMovie} /> */}
      {Object.entries(videosByCategory).map(([category, videos]) => (
          <div key={category}>
            <EmblaCarousel slides={videos} title={category} />
          </div>
        ))}

       
    </main>
    </>
  );
}



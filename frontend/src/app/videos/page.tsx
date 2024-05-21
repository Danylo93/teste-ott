"use client"

import React, {useEffect, useState}from 'react';


import { Video } from '@/components/modal-add-video';
import EmblaCarousel from '@/components/Carrousel';
import { Header } from '@/components/Header';
import { api } from '@/services/api';



export default function Videos() {

  const [videos, setVideos] = useState<Video[]>([]);

  async function findVideos() {
    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (erro) {
      console.error(erro);
      return [];
    }
  }

  useEffect(() => {
    findVideos().then(videos => {
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



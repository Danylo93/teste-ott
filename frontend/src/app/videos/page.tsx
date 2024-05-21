"use client"

import React, {useEffect, useState}from 'react';



import EmblaCarousel from '@/components/Carrousel';
import { Header } from '@/components/Header';
import { api } from '@/services/api';
import { Video } from '@/types/video';



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
    if (Array.isArray(video.categories)) {
      video.categories.forEach(category => {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(video);
      });
    }
    return groups;
  }, {} as { [category: string]: Video[] });
  

  

  return (
    <>
    <Header />
    <main className='relative overflow-y-scroll p-8 pb-20 scrollbar-hide lg:pl-16 '>
    {Object.entries(videosByCategory).map(([category, videos]) => (
  <div key={category}>
    {videos.map(video => (
      <EmblaCarousel key={video.id} slides={videos} title={category} />
    ))}
  </div>
))}




       
    </main>
    </>
  );
}



"use client"

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import EmblaCarousel from '@/components/Carrousel';
import { Header } from '@/components/Header';
import { Video } from '@/types/video';

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    findVideos();
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get('/categories');
      const categoriesData = response.data || [];
      const categoriesMap = categoriesData.reduce((acc: { [id: string]: string }, category: { _id: string, name: string }) => {
        acc[category._id] = category.name;
        return acc;
      }, {});
      setCategories(categoriesMap);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategories({});
    }
  }

  async function findVideos() {
    try {
      const response = await api.get('/videos');
      const videos = response.data || [];
      setVideos(videos);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      setVideos([]);
    }
  }

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
        {Object.entries(videosByCategory).map(([categoryId, videos]) => (
          <div key={categoryId}>
            <EmblaCarousel key={categoryId} slides={videos} title={categories[categoryId]} />
          </div>
        ))}
      </main>
    </>
  );
}

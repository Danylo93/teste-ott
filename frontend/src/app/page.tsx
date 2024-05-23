"use client"

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import VideosCategory from "@/components/VideosCategory";
import Modal from "@/components/modal-add-video";
import Categories from "@/components/Categories";
import { FaArrowRight } from 'react-icons/fa'
import { Video } from "@/types/video";
import { Category } from "@/types/category";
import ModalEditCategory from "@/components/modal-edit-category";
import { api } from "@/services/api";
import Loading from "./loading";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [nameCategoria, setNameCategoria] = useState('');
  const [addVideoModalOpen, setAddVideoModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddVideo = () => {
    if (categories.length === 0) {
      alert('Por favor adicione uma categoria, antes de adicionar um vídeo!!!');
      return;
    }
    setAddVideoModalOpen(true);
  };

  const handleCloseAddVideo = () => {
    setAddVideoModalOpen(false);
  };

  async function createCategory() {
    if (!nameCategoria) {
      alert('Por favor, digite o nome da categoria.');
      return;
    }

    try {
      const response = await api.post('/categories', {
        name: nameCategoria,
      });

      if (response.status === 200) {
        alert('Categoria criada com sucesso!');
        setNameCategoria('');

        window.location.reload();
      } else {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
    } catch (erro) {
      console.error(erro);
      alert('Ocorreu um erro ao criar a categoria.');
    }
  };

  async function findCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (erro) {
      console.error(erro);
      return [];
    }
  }

  async function findVideos() {
    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (erro) {
      console.error(erro);
      return [];
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);

      if (response.status === 200) {
        alert('Categoria excluída com sucesso!');
        // Recarrega as categorias e os vídeos após a exclusão
        findCategories().then(categorias => {
          setCategories(categorias);
        });
        findVideos().then(videos => {
          setVideos(videos);
        });
      } else {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir a categoria:', error);
      alert('Ocorreu um erro ao excluir a categoria.');
    }
  };

  useEffect(() =>  {
    findCategories().then(categorias => {
      setCategories(categorias);
      setIsLoading(false);
    });
    findVideos().then(videos => {
      setVideos(videos);
    });
  }, [])

  const handleVideoAdded = () => {
    findVideos();
};

  return (
    <div className="h-screen">
      <div className="p-10">
        <h1 className="font-bold">ÁREA INTERNA - GESTÃO DE CATEGORIAS E EDIÇÃO DE VÍDEO</h1>
        <Link href="/videos">
          <button className="inline-flex items-center text-black text-sm">Visualizar página de biblioteca de vídeos <FaArrowRight className="ml-2" /></button>
        </Link>
      </div>

      <div className=" p-10">
        <h2 className="text-black font-bold">Criação e Ordenação de Categorias</h2>
        <h4 className="text-zinc-600">Para criar uma categoria basta digitar o nome da categoria e dar um clique no botão. A ordenação será conforme está abaixo, você pode alterar a ordem arrastando as categorias.</h4>
        <div className="flex items-center justify-between border-2 mt-2 border-gray-400 rounded-lg p-4 pb-10 mb-10">
          <input 
            type="text"
            name="category"
            id="category"
            placeholder="Digite o nome da Categoria"
            className="border-2 border-gray-400 w-full h-9 rounded-lg bg-white px-4 text-gray-400 outline-none focus:outline-none mr-2"
            value={nameCategoria}
            onChange={e => setNameCategoria(e.target.value)}
          />
          <button onClick={createCategory} className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 flex-shrink-0 whitespace-nowrap mb-2">Adicionar Categoria</button>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <Categories onDeleteCategory={handleDeleteCategory} />
        )}

        <div className="rounded bg-white">
          <h2 className="font-bold mb-4 text-black mt-10">Vídeos da Categoria</h2>
          
          {isLoading ? (
            <Loading />
          ) : (
            <VideosCategory />
          )}
        </div>
      </div>
    </div>
  );
}

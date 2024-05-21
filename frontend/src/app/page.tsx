"use client"

import { useState, useEffect } from "react";
import Link from 'next/link';
import VideosCategory from "@/components/VideosCategory";
import Modal from "@/components/modal-add-video";
import Categories from "@/components/Categories";
import { FaArrowRight } from 'react-icons/fa'
import { Video } from "@/types/video";
import { Category } from "@/types/category";
import ModalEditCategory from "@/components/modal-edit-category";



export default function Home() {


  const [categorias, setCategorias] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [addVideoModalOpen, setAddVideoModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);

  const handleAddVideo = () => {
    setAddVideoModalOpen(true);
  };

  const handleCloseAddVideo = () => {
    setAddVideoModalOpen(false);
  };

  const handleEditCategory = async () => {
    setEditCategoryModalOpen(true);
  };

  const handleCloseEditCategory = () => {
    setEditCategoryModalOpen(false);
  };

  
  async function criarCategoria() {
    if (!nomeCategoria) {
      alert('Por favor, digite o nome da categoria.');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3333/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nomeCategoria }),
      });

      if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
      }

      const categoria = await resposta.json();
      alert('Categoria criada com sucesso!');
      setNomeCategoria(''); // Limpa o input
    } catch (erro) {
      console.error(erro);
      alert('Ocorreu um erro ao criar a categoria.');
    }
  }
  
 async function buscarCategorias() {
  try {
    const resposta = await fetch('http://localhost:3333/categories');
    const categorias = await resposta.json();
    return categorias;
  } catch (erro) {
    console.error(erro);
    return [];
  }
}

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


useEffect(() =>  {
  buscarCategorias().then(categorias => {
    setCategorias(categorias);
  });
  buscarVideos().then(videos => {
    setVideos(videos);
  });
}, [])




const handleDelete = async (id: string) => {
  try {
    if (!id) {
      throw new Error('ID da categoria não fornecido');
    }

    categorias.forEach(categoria => {
      console.log(categoria.id); 
    });
    const response = await fetch(`http://localhost:3333/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const updatedCategorias = categorias.filter(categoria => categoria.id !== id);
    setCategorias(updatedCategorias);

    console.log(`Categoria com ID: ${id} deletada com sucesso.`);
    alert('Categoria deletada com sucesso!');
  } catch (error) {
    console.error(`Ocorreu um erro ao deletar a categoria: ${error}`);
    alert('Ocorreu um erro ao deletar a categoria.');
  }
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
      <h4 className="text-zinc-600">Para criar uma categoria basta digitar o nome da categoria e dar um clique no botão.A ordenação será conforme está abaixo, você pode alterar a ordem arrastando as categorias.</h4>
      <div className="flex items-center justify-between border-2 border-gray-400 rounded-lg p-4 pb-10 mb-10">
  <input 
    type="text"
    name="category"
    id="category"
    placeholder="Digite o nome da Categoria"
    className="border-2 border-gray-400 w-full h-9 rounded-lg bg-white px-4 text-gray-400 outline-none focus:outline-none mr-2"
    value={nomeCategoria}
    onChange={e => setNomeCategoria(e.target.value)}
  />
  <button onClick={criarCategoria} className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 flex-shrink-0 whitespace-nowrap mb-2">Adicionar Categoria</button>
  
</div>

<Categories />

    

      <div className="rounded bg-white">
      <h2 className="font-bold mb-4 text-black mt-10">Vídeos da Categoria</h2>
      <div className="flex items-center justify-between">
      <h4 className="text-zinc-600">A Ordenação será conforme está abaixo, você pode alterar a ordem arrastando os vídeos.</h4>
      <button 
        className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 flex-shrink-0 whitespace-nowrap mb-2"
        onClick={handleAddVideo}  disabled={categorias.length === 0}
      >
        Adicionar Novo Vídeo
      </button>

      {addVideoModalOpen && <Modal onClose={handleCloseAddVideo} isOpen={true} />}
    
</div>

 <VideosCategory />
      </div>
      
      </div>
    </div>
  );
}

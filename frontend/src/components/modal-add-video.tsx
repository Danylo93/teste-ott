import { api } from '@/services/api';
import { useState, useEffect, FC, FormEvent } from 'react';

export interface Video {
    id: string;
    title: string;
    description: string;
    category: string;
    videoUrl: string;
    thumbnail: string;
}

interface Categoria {
  id: string;
  name: string;
  videos?: Video[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadingCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (erro) {
        console.error(erro);
      }
    };
  
    loadingCategories();
  }, []);
  const extractYouTubeVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
      setThumbnail('');
    }
  };

  const handleAddVideo = async (event: FormEvent) => {
    event.preventDefault();
    const videoData = {
      title: videoTitle,
      description: description,
      categories: selectedCategories,
      videoUrl: videoUrl,
      thumbnail: thumbnail,
    };
  
    try {
      const response = await api.post('/videos', videoData);
  
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      alert('Vídeo adicionado com sucesso!');
      onClose();
    } catch (error) {
      alert('Ocorreu um erro ao adicionar o vídeo.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto ">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg px-8 pt-5 pb-4 sm:p-6 sm:pb-4 shadow-2xl relative text-center">
            <button onClick={onClose} className="absolute top-0 right-0 m-2 focus:outline-none">
              <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center text-font-bold">
                  Adicionar Novo Vídeo
                </h3>
                <div className="mt-2">
                  <form className="w-full max-w-sm mx-auto" onSubmit={handleAddVideo}>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-title">
                          Título do Vídeo
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-title"
                          type="text"
                          value={videoTitle}
                          onChange={e => setVideoTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-description">
                          Descrição
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-description"
                          type="text"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-category">
                          Categoria
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <select
                          multiple={true}
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-category"
                          value={selectedCategories}
                          onChange={e => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedCategories(selectedOptions);
                          }}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-url">
                          URL do Vídeo
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-url"
                          type="text"
                          value={videoUrl}
                          onChange={e => handleVideoUrlChange(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-thumbnail">
                          Thumbnail
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-thumbnail"
                          type="text"
                          value={thumbnail}
                          onChange={e => setThumbnail(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    {thumbnail && (
                      <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                          <img src={thumbnail} alt="Thumbnail do Vídeo" className="w-full rounded" />
                        </div>
                      </div>
                    )}
                    <div className="md:flex md:items-center">
                      <div className="md:w-1/3"></div>
                      <div className="md:w-2/3">
                        <button
                          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                          type="submit"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-700 opacity-70" onClick={onClose}></div>
      </div>
    </>
  );
}

export default Modal;


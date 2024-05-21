
import { api } from '@/services/api';
import { useState, useEffect, FC, FormEvent } from 'react';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string; 
}

const ModalEditCategory: FC<ModalProps> = ({ isOpen, onClose, categoryId }) => {

  const [nameCategory, setNameCategory] = useState('');
  const [categorias, setCategorias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  
  const editCategory = async (name: string) => {
    console.log("Tentando editar categoria com nome:", name);
    if (!name) {
      console.error('Nome da categoria inválido ou não fornecido');
      return;
    }
  
    try {
      const response = await api.get(`/categories?name=${encodeURIComponent(name)}`);
      const category = response.data[0]; 
  
      if (!category) {
        console.error('Categoria não encontrada');
        return;
      }
  
     
      await api.put(`/categories/${category._id}`, { name: nameCategory });
  
      alert('Categoria Atualizada com Sucesso');
    
      setCategorias(categorias.map(categoria => {
        if (categoria._id === category._id) {
          return { ...categoria, name: nameCategory };
        }
        return categoria;
      }));
    } catch (erro) {
      console.error(erro);
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
                  Editar Categoria
                </h3>
                <div className="mt-2">
                  <form className="w-full max-w-sm mx-auto">
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="video-title">
                          Nome da Categoria
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id="video-title"
                          type="text"
                          value={nameCategory}
                          onChange={e => setNameCategory(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:flex md:items-center">
                      <div className="md:w-1/3"></div>
                      <div className="md:w-2/3">
                        <button
                          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                          type="submit" disabled={isLoading} onClick={editCategory}
                        >
                          {isLoading ? 'Aguarde...' : 'Editar Categoria'}
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

export default ModalEditCategory;


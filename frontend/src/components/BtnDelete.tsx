import { api } from '@/services/api';
import React from 'react';
import { FaTrash } from "react-icons/fa";

interface BtnDeleteProps {
  id: string;
  name: string;
  onDelete: () => void; 
}

const BtnDelete: React.FC<BtnDeleteProps> = ({ id, name, onDelete }) => {
  const removeCategory = async () => {
    if (!id || id === 'undefined') {
      alert('ID inválido');
      return;
    }

    const userConfirmed = window.confirm(`Você tem certeza que deseja excluir categoria de ${name}?`);
    
    if (userConfirmed) {
      try {
        const res = await api.delete(`/categories/${id}`);
    
        if (res.status === 200) {
          onDelete(); 
          alert(`Categoria excluída com sucesso: ${name}`);
        } else {
          const errorData = res.data;
          alert(`Erro ao excluir categoria: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        alert(`Erro ao conectar com o servidor: ${error}`);
      }
    }
  };

  return (
    <div>
      <button onClick={removeCategory} className="bg-red-500 text-white px-2 py-1 rounded m-2">
        <FaTrash />
      </button>
    </div>
  );
};

export default BtnDelete;

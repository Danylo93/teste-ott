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
        const res = await fetch(`http://localhost:3333/categories/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          onDelete(); 
          alert(`Categoria excluída com sucesso: ${name}`);
        } else {
          const errorData = await res.json();
          alert(`Erro ao excluir categoria: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        alert(`Erro ao conectar com o servidor: ${error.message}`);
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

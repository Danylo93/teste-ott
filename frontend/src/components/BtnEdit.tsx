import { api } from '@/services/api';
import React, { useState } from 'react';
import { FaEdit } from "react-icons/fa";

interface BtnEditProps {
  id: string; 
  currentName: string; 
  onEdit: () => void; 
}

const BtnEdit: React.FC<BtnEditProps> = ({ id, currentName, onEdit }) => {
  const [name, setName] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);

  const updateCategory = async () => {
    if (!id || id === 'undefined') {
      alert('ID inválido');
      return;
    }

    try {
      const res = await api.put(`/categories/${id}`, { name });
  
      if (res.status === 200) {
        onEdit()
        alert(`Categoria atualizada com sucesso: ${name}`);
        setIsEditing(false);
      } else {
        const errorData = res.data;
        alert(`Erro ao atualizar categoria: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert(`Erro ao conectar com o servidor: ${error.message}`);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border p-1 rounded text-black"
          />
          <button onClick={updateCategory} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">
            Salvar
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-2 py-1 rounded ml-2">
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-2 py-1 rounded m-2">
          <FaEdit />
        </button>
      )}
    </div>
  );
};

export default BtnEdit;

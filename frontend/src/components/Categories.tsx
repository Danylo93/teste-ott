"use client"

import { api } from "@/services/api";
import { Category } from "@/types/category";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalEditCategory from "./modal-edit-category";

const Categories = () => {
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);

    const handleEditCategory = async () => {
        setEditCategoryModalOpen(true);
      };
    
      const handleCloseEditCategory = () => {
        setEditCategoryModalOpen(false);
      };

    

    const onDragEnd = (result: { destination: { index: number } | null; source: { index: number } }) => {
        if (!result.destination) return;

        const items = Array.from(categorias);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCategorias(items);
    };

    async function buscarCategorias() {
        try {
          const response = await api.get('/categories');
          const data = response.data;
      
          console.log('Dados recebidos:', data);
      
          const categorias = data.map((categoria: any) => ({
            id: categoria._id.$oid,
            name: categoria.name,
          }));
          setCategorias(categorias);
      
          console.log('Categorias transformadas:', categorias);
        } catch (erro) {
          console.error(erro);
          setCategorias([]);
        }
      }

      const deleteCategory = async (name: string) => {
        try {
          const response = await api.get(`/categories?name=${encodeURIComponent(name)}`);
          const category = response.data[0];
        console.log('Categorias do excluir:',category._id)
          if (!category) {
            console.error('Categoria não encontrada');
            return;
          }
      
          await api.delete(`/categories/${category._id}`);
          alert('Categoria Excluída com Sucesso');
          setCategorias(categorias.filter(categoria => categoria._id !== category._id));
          window.location.reload();
        } catch (erro) {
          console.error(erro);
        }
      };

      
      

    useEffect(() => {
        buscarCategorias();
    }, []);

    return (
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable droppableId="categories">
            {(provided) => (
                    <div className="flex flex-row flex-wrap gap-4 border-2 border-gray-400 rounded p-20"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {categorias.length === 0 ? (
                            <div className="text-center text-red-500 w-full">
                                Nenhuma categoria criada
                            </div>
                        ) : (
                            categorias.map(({ id, name }, index) => (
                                <Draggable key={id} draggableId={id} index={index}>
                                    {(provided) => (
                                        <div className="category relative group p-4 border border-gray-200 rounded shadow"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {name}
                                            <div className="absolute right-0 top-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 text-center transition duration-200 ease-in-out">
                                                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEditCategory(id)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteCategory(id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            {editCategoryModalOpen && <ModalEditCategory onClose={handleCloseEditCategory} isOpen={true} />}
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Categories;

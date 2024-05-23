"use client"

import { api } from "@/services/api";
import { Category } from "@/types/category";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalEditCategory from "./modal-edit-category";
import Link from "next/link";
import BtnDelete from "./BtnDelete";
import BtnEdit from "./BtnEdit";

const Categories = () => {
 

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
   

    
    const handleDragEnd = (result) => {
      if (!result.destination) return; // se a posição final for nula, não faça nada
  
      const items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      setCategories(items);
    };
    

    useEffect(() => {
      fetchCategories();
    }, []);

    
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3333/categories');
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

      const handleCategoryDelete = () => {
        fetchCategories();
      };

    return (
      <div>
      {isLoading ? (
        <p className="text-black text-center">Carregando Categorias</p>
      ) : categories.length === 0 ? (
        <div className="border-2 text-center border-gray-400 rounded p-20 w-full">
        <p className="text-gray-400 text-center">Você precisa adicionar pelo menos uma categoria.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {categories.map((category, index) => (
                  <Draggable key={category._id} draggableId={category._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="category-item bg-slate-900 rounded-lg p-2 mb-2 flex items-center"
                      >
                        <span className="flex-grow text-center text-slate-300">{category.name}</span>
                        <div>
                          <BtnEdit id={category._id} currentName={category.name} />
                          <BtnDelete id={category._id} name={category.name} onDelete={handleCategoryDelete} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
    );
};

export default Categories;

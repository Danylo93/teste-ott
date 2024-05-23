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
   
   

    
    const handleDragEnd = (result) => {
      if (!result.destination) return; // se a posição final for nula, não faça nada
  
      const items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      setCategories(items);
    };
    

    

    

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await fetch('http://localhost:3333/categories');
            const data = await response.json();
            setCategories(data);
          } catch (error) {
            console.error('Erro ao buscar categorias:', error);
          }
        };
    
        fetchCategories();
      }, []);

      useEffect(() => {
        const handleCategoryDelete = () => {
          
          window.location.reload(); // recarrega a página
        };
    

        window.addEventListener('categoryDeleted', handleCategoryDelete);
    
       
        return () => {
          window.removeEventListener('categoryDeleted', handleCategoryDelete);
        };
      }, [categories]);
    

      


    return (
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
                    className="category-item bg-gray-500 rounded-lg p-2 mb-2 flex items-center"
                  >
                    <span className="flex-grow text-center text-black">{category.name}</span>
                    <div>
                      <BtnEdit id={category._id} currentName={category.name} />
                      <BtnDelete id={category._id} />
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
    );
};

export default Categories;

"use client"

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import BtnDelete from "./BtnDelete";
import BtnEdit from "./BtnEdit";
import { api } from "@/services/api";

const Categories = () => {
 

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
   

    
    const handleDragEnd = (result) => {
      if (!result.destination) return; 
  
      const items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      setCategories(items);
    };
    

    useEffect(() => {
      loadCategories();
    }, []);

    
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        const data = response.data;
        setCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

      const handleCategoryDelete = () => {
        loadCategories();
      };

      const handleCategoryEdit = () => {
        loadCategories();
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
        <div className="border-2 text-center border-gray-400 rounded p-20 w-full">
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
                          <BtnEdit id={category._id} currentName={category.name} onEdit={handleCategoryEdit} />
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
        </div>
      )}
    </div>
    );
};

export default Categories;

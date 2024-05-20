"use client"

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Category {
    id: string;
    name: string;
}

const Categories = () => {
    const [categorias, setCategorias] = useState<Category[]>([]);

    const onDragEnd = (result: { destination: { index: number; }; source: { index: number; }; }) => {
        if (!result.destination) return;

        const items = Array.from(categorias);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCategorias(items);
    };

    async function buscarCategorias() {
        try {
            const resposta = await fetch('http://localhost:3333/categories');
            const data = await resposta.json();
            // Log para ver os dados recebidos
            console.log('Dados recebidos:', data);
            // Transform the data to match the Category interface
            const categorias = data.map((categoria: any) => ({
                id: categoria._id.$oid,
                name: categoria.name
            }));
            setCategorias(categorias);
            // Log para ver as categorias após a transformação
            console.log('Categorias transformadas:', categorias);
        } catch (erro) {
            console.error(erro);
            setCategorias([]);
        }
    }

    async function excluirCategoria(id: string) {
        console.log("Tentando excluir categoria com ID:", id); // Log de depuração
        if (!id) {
            console.error('ID da categoria inválido ou não fornecido');
            return;
        }

        try {
            const resposta = await fetch(`http://localhost:3333/categories/${id}`, {
                method: 'DELETE'
            });
            if (!resposta.ok) {
                throw new Error('Erro ao excluir a categoria');
            }
            alert('Categoria Excluída com Sucesso');
            setCategorias(categorias.filter(categoria => categoria.id !== id));
        } catch (erro) {
            console.error(erro);
        }
    }

    useEffect(() => {
        buscarCategorias();
    }, []);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="categories">
                {(provided) => (
                    
                    <div className="flex flex-row flex-wrap gap-4 border-2 border-gray-400 rounded p-20" {...provided.droppableProps} ref={provided.innerRef}>
                        {categorias.map(({ id, name }, index) => (
                            <Draggable key={id} draggableId={id} index={index}>
                                {(provided) => (

                                    <div className="category relative group p-4 border border-gray-200 rounded shadow"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        {name}
                                        <div className="absolute right-0 top-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                                                <FaEdit />
                                            </button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => excluirCategoria(id)}>
                                                <FaTrash />
                                            </button>
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

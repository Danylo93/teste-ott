"use client"

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "@/context/DndContext";
import { Video } from "./modal-add-video";

const VideosCategory = () => {
    const [videos, setVideos] = useState<Video[]>([]);

    async function buscarVideos() {
      try {
        const resposta = await fetch('http://localhost:3333/videos');
        const videos = await resposta.json();
        return videos;
      } catch (erro) {
        console.error(erro);
        return [];
      }
    }
  
    useEffect(() => {
      buscarVideos().then(videos => {
        setVideos(videos);
      });
    }, []);
  
    const videosByCategory: { [category: string]: Video[] } = videos.reduce((groups, video) => {
      video.categories.forEach(category => {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(video);
      });
      return groups;
    }, {});

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId !== destination.droppableId) {
            const newData = { ...videosByCategory };
            const sourceCategory = source.droppableId;
            const destinationCategory = destination.droppableId;
            const [item] = newData[sourceCategory].splice(source.index, 1);
            newData[destinationCategory].splice(destination.index, 0, item);
            setVideos(Object.values(newData).flat());
    
            // Atualizar a API
            try {
                const response = await fetch('http://localhost:3333/videos/' + item.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categories: [destinationCategory, ...item.categories.filter(category => category !== sourceCategory)]
                    })
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a API');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            const newData = { ...videosByCategory };
            const sourceCategory = source.droppableId;
            const [item] = newData[sourceCategory].splice(source.index, 1);
            newData[sourceCategory].splice(destination.index, 0, item);
            setVideos(Object.values(newData).flat());
        }
    };
    
    if (!videos.length) {
        return <LoadingSkeleton />
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
                {
                    Object.keys(videosByCategory).map((category, index) => {
                        return (
                            <Droppable key={category} droppableId={category}>
                                {(provided) => (
                                    <div className="p-5 lg:w-1/3 w-full bg-white border-gray-400 border border-dashed"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <h2 className="text-center font-bold mb-6 text-black">{category}</h2>
                                        {
                                            videosByCategory[category].map((video, index) => (
                                                <Draggable key={video.id} draggableId={video.id} index={index}>
                                                    {(provided) => (
                                                        <div className="bg-gray-200 mx-1 px-4 py-3 my-3"
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            {video.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )
                    })
                }
            </div>
        </DragDropContext>
    );
};

export default VideosCategory;

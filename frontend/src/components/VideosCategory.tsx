"use client"

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { Video } from "./modal-add-video";

const VideosCategory = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        buscarVideos().then(videos => {
            setVideos(videos || []);
        });
    }, []);

    const processVideosByCategory = (videos: Video[]) => {
        return videos.reduce((groups: { [category: string]: Video[] }, video: Video) => {
            if (video.categories && Array.isArray(video.categories)) {
                video.categories.forEach(category => {
                    if (!groups[category]) {
                        groups[category] = [];
                    }
                    groups[category].push(video);
                });
            } else {
                console.warn(`O vídeo ${video.id} não tem categorias válidas`);
            }
            return groups;
        }, {});
    };

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const videosByCategory = processVideosByCategory(videos);

        const sourceCategory = source.droppableId;
        const destinationCategory = destination.droppableId;

        const newData = { ...videosByCategory };
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
    };


    const videosByCategory = processVideosByCategory(videos);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
                {Object.keys(videosByCategory).length === 0 ? (
                    <div className="flex gap-4 border-2 text-center border-gray-400 rounded p-20 w-full">
                        <p className="text-md  text-red-700">Crie uma categoria para poder adicionar Vídeos.</p>
                    </div>
                ) : (
                    Object.keys(videosByCategory).map((category) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div className="p-5 lg:w-1/3 w-full bg-white border-gray-400 border border-dashed"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2 className="text-center font-bold mb-6 text-black">{category}</h2>
                                    {videosByCategory[category].map((video, index) => (
                                        <Draggable key={video.id} draggableId={video.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="flex items-center bg-gray-200 mx-1 my-3 p-4"
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <div className="w-24 h-24 bg-cover bg-center rounded-md overflow-hidden mr-4">
                                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-lg font-semibold">{video.title}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))
                )}
            </div>
        </DragDropContext>
    );
};

export default VideosCategory;

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { api } from "@/services/api";
import { Video } from "@/types/video";

const VideosCategory = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        findVideos();
    }, []);

    async function findVideos() {
        try {
            const response = await api.get('/videos');
            setVideos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            setVideos([]);
        }
    }

    const processVideosByCategory = (videos: Video[]) => {
        return videos.reduce((groups: { [category: string]: Video[] }, video: Video) => {
            if (video.categories && Array.isArray(video.categories)) {
                video.categories.forEach(cat => {
                    if (!groups[cat]) {
                        groups[cat] = [];
                    }
                    groups[cat].push(video);
                });
            } else {
                console.warn(`O vídeo ${video.id} não tem categorias válidas`);
            }
            return groups;
        }, {});
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceCategory = result.source.droppableId;
        const destinationCategory = result.destination.droppableId;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const updatedVideos = [...videos];
        const movedVideo = updatedVideos.find(video => video.categories.includes(sourceCategory));
        if (!movedVideo) return;

        movedVideo.categories = movedVideo.categories.filter(category => category !== sourceCategory);
        movedVideo.categories.splice(destinationIndex, 0, destinationCategory);

        setVideos(updatedVideos);
    };

    const videosByCategory = processVideosByCategory(videos);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
                {Object.keys(videosByCategory).length === 0 ? (
                    <div className=" gap-4 border-2 text-center border-gray-400 rounded p-20 w-full">
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

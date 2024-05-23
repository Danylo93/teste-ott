import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { api } from "@/services/api";
import { Video } from "@/types/video";
import Modal from "./modal-add-video";

const VideosCategory = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [videosByCategory, setVideosByCategory] = useState<{ [category: string]: Video[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const videos = response.data || [];
            setVideos(videos);
            setVideosByCategory(processVideosByCategory(videos));
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            setVideos([]);
            setVideosByCategory({});
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

        const { source, destination } = result;

        const sourceCategory = source.droppableId.replace('droppable-', '');
        const destinationCategory = destination.droppableId.replace('droppable-', '');

        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const sourceItems = Array.from(videosByCategory[sourceCategory]);
        const [movedVideo] = sourceItems.splice(sourceIndex, 1);

        if (sourceCategory === destinationCategory) {
            sourceItems.splice(destinationIndex, 0, movedVideo);
            setVideosByCategory(prev => ({
                ...prev,
                [sourceCategory]: sourceItems,
            }));
        } else {
            const destinationItems = Array.from(videosByCategory[destinationCategory] || []);
            destinationItems.splice(destinationIndex, 0, movedVideo);

            setVideosByCategory(prev => ({
                ...prev,
                [sourceCategory]: sourceItems,
                [destinationCategory]: destinationItems,
            }));

            movedVideo.categories = [destinationCategory];
            api.put(`/videos/${movedVideo.id}/category`, { category: destinationCategory })
                .catch(error => console.error('Erro ao atualizar categoria do vídeo:', error));
        }
    };

    const handleVideoAdded = () => {
        findVideos();
    };

    return (
        <div>
            <div className="flex items-center justify-between">
            <h4 className="text-zinc-600">A Ordenação será conforme está abaixo, você pode alterar a ordem arrastando os vídeos.</h4>
            <button onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 flex-shrink-0 whitespace-nowrap mb-2"
            >
              Adicionar Novo Vídeo
            </button>
            
          </div>
            {isLoading ? (
                <p className="text-black text-center">Carregando Videos...</p>
            ) : Object.keys(videosByCategory).length === 0 ? (
                <div className="border-2 text-center border-gray-400 rounded p-20 w-full">
                    <p className="text-md text-red-700">Crie uma categoria para poder adicionar Vídeos.</p>
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
                        {Object.keys(videosByCategory).map((category) => (
                            <Droppable key={category} droppableId={`droppable-${category}`}>
                                {(provided) => (
                                    <div
                                        className="p-5 lg:w-1/3 w-full bg-white border-gray-400 border border-dashed rounded-md"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <h2 className="text-center text-lg font-bold mb-6 text-black">{category}</h2>
                                        <div className="flex flex-col items-center">
                                            {videosByCategory[category].map((video, index) => (
                                                <Draggable key={video.id} draggableId={`draggable-${category}-${video.id}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`flex items-center bg-gray-200 my-3 p-4 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                borderRadius: '8px',
                                                                width: '100%',
                                                                maxWidth: '350px',
                                                            }}
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
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVideoAdded={handleVideoAdded} />
        </div>
    );
};

export default VideosCategory;

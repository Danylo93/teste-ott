import React, { useState, FC, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
}

interface TagProps {
  id: number;
  video: Video;
  moveTag: (fromIndex: number, toIndex: number) => void;
  index: number;
}
interface DragItem {
  type: string;
  id: string;
  index: number;
}

const TagVideo: FC<TagProps> = ({ video, id , moveTag, index }) => {
 
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: 'CARD',
    drop(item: DragItem, monitor) {
      if (item.id !== video.id) {
        moveTag(item.index, index);
        item.index = index;
      }
    },
  });
  
  drag(drop(ref));

  return (
    <DndProvider backend={HTML5Backend}>
      <div
      style={{ opacity: isDragging ? 0.5 : 1, width: '150px', height: '150px' }}
  ref={ref} 
  className="m-2 pb-20  bg-black text-white cursor-move flex flex-col justify-between rounded items-center"
>

<iframe width="120" height="120" src={video.videoUrl} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
<span >{video.title}</span>
</div>

    </DndProvider>
  );
};

export default TagVideo;

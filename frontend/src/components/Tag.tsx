import { useState, FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface Categoria {
  id: string;
  name: string;
}

interface TagProps {
  id: number;
  categoria: Categoria;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  moveTag: (fromIndex: number, toIndex: number) => void;
  index: number;
}
interface DragItem {
  type: string;
  id: string;
  index: number;
}

const Tag: FC<TagProps> = ({ categoria, id , onEdit, onDelete, moveTag, index }) => {
  const [showOptions, setShowOptions] = useState(false);
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
      if (item.id !== categoria.id) {
        moveTag(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      className="p-2 m-2 bg-blue-500 text-white cursor-move flex justify-between rounded items-center"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{categoria.name}</span>
      {showOptions && (
        <div>
          <button onClick={() => onEdit(categoria.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
          </button>
          <button onClick={() => onDelete(categoria.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Tag;

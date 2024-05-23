import { FC, useEffect} from 'react';

interface ImageProps {
  title: string;
  description: string;
  videoUrl: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: ImageProps | null;
}

const ModalVideoDetail: FC<ModalProps> = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) {
    return null;
  }

  const videoId = video.videoUrl.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  
  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen">
    <div className="fixed inset-0 bg-white rounded-lg shadow-2xl overflow-hidden">
      <button onClick={onClose} className="absolute top-0 right-0 m-2 focus:outline-none">
        <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="sm:flex sm:items-start h-full">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 className="text-lg leading-6 text-gray-900 text-center font-bold">
            {video.title}
          </h3>
          <div className="mt-2 overflow-y-auto max-h-96">
            <p className="font-medium text-gray-500 text-center">{video.description}</p>
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full aspect-video"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="fixed inset-0 transition-opacity" onClick={onClose}>
        <div className="absolute inset-0 bg-gray-700 opacity-70"></div>
      </div>
    </>
  );
};

export default ModalVideoDetail;

import { useState, useEffect, FC, FormEvent } from 'react';
import { Video } from './Tag-video';
import { ImageProps } from './Carrousel';



interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: ImageProps | null;
}

const ModalVideoDetail: FC<ModalProps> = ({ isOpen, onClose, video}) => {
  if (!isOpen || !video) {
    return null;
  }



  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto ">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg px-8 pt-5 pb-4 sm:p-6 sm:pb-4 shadow-2xl relative text-center">
            <button onClick={onClose} className="absolute top-0 right-0 m-2 focus:outline-none">
            <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center text-font-bold">
              {video.title}
                </h3>
                <div className="mt-2">
                  <p className="font-medium text-gray-500 text-center">{video.description}</p>
                  <iframe src={video.videoUrl} className="w-full h-64" />
              <div className="mt-2">
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-700 opacity-70" onClick={onClose}></div>
      </div>
    </>
  );

  
}

export default ModalVideoDetail;

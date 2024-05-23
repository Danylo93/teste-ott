"use client";

const Loading: React.FC = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <p className="text-black text-2xl">Carregando...</p>
      </div>
    );
  };
  
  export default Loading;

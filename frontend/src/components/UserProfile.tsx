import React from 'react';
import Image from 'next/image';

export const UserProfile = () => (
  <div className='flex items-center space-x-4'>
    <p className='hidden lg:inline text-white font-bold'>Ir para Dashboard</p>
    <Image
      width={30}
      height={30}
      src='/profile.png'
      alt='Profile'
      className='cursor-pointer rounded' />
  </div>
);

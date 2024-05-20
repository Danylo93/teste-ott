import React from 'react';
import Image from 'next/image';

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Image
      src='/logo.svg'
      alt='Logo'
      width={60}
      height={60}
      className='cursor-pointer' 
    />
    <h1 style={{ color: 'white', marginLeft: '10px', fontWeight: 'bold', fontSize: 24 }}>OiTube</h1>
  </div>
);
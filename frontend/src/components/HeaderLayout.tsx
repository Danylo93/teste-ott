'use client';
import Link from 'next/link';
import React from 'react';
import { Logo } from './Logo';
import { UserProfile } from './UserProfile';


interface IHeaderLayoutProps {
  isScrolled: boolean;
}
export function HeaderLayout({
  isScrolled
}: IHeaderLayoutProps): JSX.Element {
  return (
    <header
      className={`${isScrolled ? 'bg-blue-600' : ''}
        fixed top-0 z-50 flex w-full items-center justify-between
        bg-gradient-to-t from-transparent to-blue-950 p-2 px-4 transition-all
        lg:px-16 lg:py-4`}
    >
      <div className='flex items-center space-x-2 md:space-x-8'>
        <Link href='/'>
          <Logo />
        </Link>
        
      </div>
      <div className='flex items-center space-x-2'>
        <Link href='/'>
          <UserProfile />
        </Link>
      </div>
    </header>
  );
}

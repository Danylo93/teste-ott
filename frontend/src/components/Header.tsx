'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, FormEvent, ChangeEvent } from 'react';


import { HeaderLayout } from './HeaderLayout';
import { useScroll } from '@/hooks/useScroll';


export function Header(): JSX.Element {
  const isScrolled = useScroll();

  return (
    <HeaderLayout isScrolled={isScrolled}>
      
    </HeaderLayout>
  );
}

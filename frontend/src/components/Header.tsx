'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, FormEvent, ChangeEvent } from 'react';


import { HeaderLayout } from './HeaderLayout';
import { useScroll } from '@/hooks/useScroll';



export function Header(): JSX.Element {
  const isScrolled = useScroll();
  const router = useRouter();
  const params = useSearchParams();
  const initialSearchTerm = params?.get('title') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);


  return (
    <HeaderLayout isScrolled={isScrolled}>
      
    </HeaderLayout>
  );
}

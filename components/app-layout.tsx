'use client';

import { Container } from '@mui/material';
import React, { memo, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Copyright from './copyright';
import Header from './header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <main className='flex min-h-screen flex-col items-center justify-center'>
        <div className='relative flex flex-1 w-full flex-col overflow-hidden bg-white sm:max-w-lg sm:rounded-md lg:max-w-7xl transform-gpu'>
          <Container className='mx-auto h-[95vh] flex flex-col'>
            <Header />
            {children}
          </Container>
        </div>
        <Copyright />
      </main>
      <ToastContainer closeButton />
    </>
  );
};

export default memo(AppLayout);

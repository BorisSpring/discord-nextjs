'use client';
import React, { useEffect, useState } from 'react';
import CreateServerModal from '../modals/CreateServerModal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <>
      <CreateServerModal />
    </>
  ) : null;
};

export default ModalProvider;

'use client';
import React, { useEffect, useState } from 'react';
import CreateServerModal from '../modals/CreateServerModal';
import InviteModal from '../modals/InviteModal';
import EditServerSettingsModal from '../modals/EditServerSettingsModal';
import ManageMembersModal from '../modals/ManageMembersModal';
import CreateChannelModal from '../modals/CreateChanelModal';
import LeaveServerModal from '../modals/LeaveServerModal';
import DeleteServerModal from '../modals/DeleteServerModal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerSettingsModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  ) : null;
};

export default ModalProvider;

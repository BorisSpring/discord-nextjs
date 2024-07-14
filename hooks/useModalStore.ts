import { ServerWithMembersAndProfiles } from '@/lib/types';
import { Channel, ChannelType } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'editChannel'
  | 'createChannel'
  | 'invite'
  | 'members'
  | 'leaveServer'
  | 'deleteServer'
  | 'deleteChannel';

interface ModalData {
  server?: ServerWithMembersAndProfiles;
  channelType?: ChannelType;
  channel?: Channel;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: ModalData,
    channelType?: ChannelType
  ) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  channelType: undefined,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));

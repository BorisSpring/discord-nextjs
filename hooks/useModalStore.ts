import { ServerWithMembersAndProfiles } from '@/lib/types';
import { create } from 'zustand';

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'createChannel'
  | 'invite'
  | 'members'
  | 'leaveServer'
  | 'deleteServer';

interface ModalData {
  server?: ServerWithMembersAndProfiles;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));

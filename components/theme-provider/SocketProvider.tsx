'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConntected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConntected: false,
});

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConntected, setIsConntected] = useState(false);

  useEffect(() => {
    const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: true,
    });

    socketInstance.on('connect', () => setIsConntected(true));

    socketInstance.on('disconnect', () => setIsConntected(false));

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConntected }}>
      {children}
    </SocketContext.Provider>
  );
};

import { createContext } from 'react';

export const SocketContext = createContext(null);

function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;

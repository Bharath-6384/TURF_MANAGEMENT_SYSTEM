// import React, { createContext, useEffect, useState } from 'react';
// import config from '../../../config';

// export const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children }) => {
//   const [ws, setWs] = useState(null);
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     const websocket = new WebSocket(config.wsUrl);

//     websocket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     websocket.onmessage = (event) => {
//       console.log('Message from server:', event.data);
//       setMessage(JSON.parse(event.data));
//     };

//     websocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     websocket.onclose = (event) => {
//       console.log('WebSocket connection closed:', event);
//     };

//     setWs(websocket);

//     return () => {
//       websocket.close();
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={{ ws, message }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

import { createContext } from 'react';
import { WebSocketContextType, WebSocketProviderProps } from '../../../model/common/websocketprovidermodel';
import  useWebSocketService  from '../../../services/service/common/websocketproviderservice';

export const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  message: null,
});

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { ws, message } = useWebSocketService();

  return (
    <WebSocketContext.Provider value={{ ws, message }}>
      {children}
    </WebSocketContext.Provider>
  );
};

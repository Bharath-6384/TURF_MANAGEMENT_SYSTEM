export interface WebSocketContextType {
  ws        : WebSocket | null;
  message   : any;
}

export interface WebSocketProviderProps {
  children  : React.ReactNode;
}

export interface WebSocketServiceReturn {
  ws        : WebSocket | null;
  message   : any;
}

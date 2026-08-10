import { useEffect, useState }    from 'react';
import config                     from '../../../api/base-url';
import { WebSocketServiceReturn } from '../../../model/common/websocketprovidermodel';

 const WebSocketproviderService = (): WebSocketServiceReturn => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const websocket = new WebSocket(config.wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      setMessage(JSON.parse(event.data));
    };

    websocket.onerror = (error: Event) => {
      console.error(error);
    };

    websocket.onclose = (event: CloseEvent) => {
      console.log(event);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return { ws, message };
};
export default WebSocketproviderService;
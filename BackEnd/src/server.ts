import app from "./app";
import dotenv from "dotenv";
import { initWebSocket } from './services/websocket-service';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  initWebSocket();
  console.log(`Server running on port ${PORT}`);
});
